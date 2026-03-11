"""
Semantic result cache for Tessera EQ RAG.

After the LLM generates a novel EQ curve, that result is stored here so
future semantically-similar queries can be served without an LLM call.

Architecture
------------
- SQLite backend at ~/.tessera/semantic_cache.db  (WAL mode, matches user_profile.py)
- In-memory FAISS IndexFlatIP for fast cosine similarity search
- FAISS index is rebuilt from SQLite on startup and updated incrementally on each store()
- Thread safety: WAL allows concurrent reads; single-writer (the server process)
- LRU eviction: when MAX_CACHE_SIZE is reached, oldest 10% of entries are removed;
  FAISS index is then fully rebuilt since IndexFlatIP has no delete support

Schema
------
  semantic_cache(
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      query_embedding BLOB    NOT NULL,   -- float32 (384,) stored as raw bytes
      eq_json         TEXT    NOT NULL,   -- JSON list of 8 EQBandSetting dicts
      explanation     TEXT    NOT NULL,
      hit_count       INTEGER NOT NULL DEFAULT 0,
      created_at      TEXT    NOT NULL,
      last_accessed   TEXT    NOT NULL
  )
"""

from __future__ import annotations

import json
import sqlite3
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Optional

import faiss
import numpy as np

from tessera_rag.config import EMBEDDING_DIM, MAX_CACHE_SIZE, SEMANTIC_CACHE_PATH
from tessera_rag.data.schema import EQBandSetting, EQSuggestion


_DDL = """
CREATE TABLE IF NOT EXISTS semantic_cache (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    query_embedding BLOB    NOT NULL,
    eq_json         TEXT    NOT NULL,
    explanation     TEXT    NOT NULL,
    hit_count       INTEGER NOT NULL DEFAULT 0,
    created_at      TEXT    NOT NULL,
    last_accessed   TEXT    NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sc_last_accessed ON semantic_cache (last_accessed);
"""


def _vec_to_blob(vec: np.ndarray) -> bytes:
    return vec.astype(np.float32).tobytes()


def _blob_to_vec(blob: bytes) -> np.ndarray:
    return np.frombuffer(blob, dtype=np.float32).copy()


class SemanticCache:
    """
    In-memory FAISS index backed by a SQLite persistent store.

    Lifecycle (called from server.py lifespan):
      1. SemanticCache() — creates schema, rebuilds FAISS from existing rows
      2. lookup(embedding, threshold) — called before every LLM call
      3. store(embedding, suggestion) — called after every LLM call
    """

    def __init__(self, db_path: Path = SEMANTIC_CACHE_PATH) -> None:
        self.db_path = db_path
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        self._init_schema()

        self._index: faiss.Index = faiss.IndexFlatIP(EMBEDDING_DIM)
        self._row_ids: list[int] = []

        self.rebuild_index()

    # ── Private helpers ────────────────────────────────────────────────────────

    def _conn(self) -> sqlite3.Connection:
        conn = sqlite3.connect(str(self.db_path), timeout=30)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA journal_mode=WAL;")
        conn.execute("PRAGMA synchronous=NORMAL;")
        return conn

    def _init_schema(self) -> None:
        with self._conn() as conn:
            for stmt in _DDL.strip().split(";"):
                if stmt.strip():
                    conn.execute(stmt)
            conn.commit()

    def _evict_lru(self, conn: sqlite3.Connection) -> None:
        """Delete the oldest 10% of entries (by last_accessed) to make room."""
        evict_n = max(1, MAX_CACHE_SIZE // 10)
        conn.execute(
            """
            DELETE FROM semantic_cache
            WHERE id IN (
                SELECT id FROM semantic_cache
                ORDER BY last_accessed ASC
                LIMIT ?
            )
            """,
            (evict_n,),
        )

    # ── Public API ─────────────────────────────────────────────────────────────

    def rebuild_index(self) -> int:
        """
        Rebuild the in-memory FAISS index from all SQLite rows.
        Called once on startup and after any LRU eviction.
        Returns the number of entries loaded.
        """
        self._index = faiss.IndexFlatIP(EMBEDDING_DIM)
        self._row_ids = []

        with self._conn() as conn:
            rows = conn.execute(
                "SELECT id, query_embedding FROM semantic_cache ORDER BY id"
            ).fetchall()

        if not rows:
            return 0

        ids  = [r["id"] for r in rows]
        vecs = np.stack([_blob_to_vec(r["query_embedding"]) for r in rows]).astype(np.float32)

        self._index.add(vecs)
        self._row_ids = ids
        return len(ids)

    def lookup(self, embedding: np.ndarray, threshold: float) -> Optional[EQSuggestion]:
        """
        Search the dynamic cache for a semantically similar query.

        embedding : shape (1, 384) or (384,), L2-normalised float32 —
                    same format as produced by DescriptorEmbedder.embed_query()
        threshold : minimum cosine similarity to accept a cache hit

        Returns an EQSuggestion on hit, None on miss.
        """
        if self._index.ntotal == 0:
            return None

        q = embedding.reshape(1, EMBEDDING_DIM).astype(np.float32)
        scores, faiss_indices = self._index.search(q, 1)

        score     = float(scores[0][0])
        faiss_idx = int(faiss_indices[0][0])

        if faiss_idx < 0 or score < threshold:
            return None

        if faiss_idx >= len(self._row_ids):
            return None

        row_id = self._row_ids[faiss_idx]
        now = datetime.now(timezone.utc).isoformat()

        with self._conn() as conn:
            row = conn.execute(
                "SELECT eq_json, explanation FROM semantic_cache WHERE id=?",
                (row_id,),
            ).fetchone()
            if row is None:
                return None
            conn.execute(
                "UPDATE semantic_cache SET hit_count=hit_count+1, last_accessed=? WHERE id=?",
                (now, row_id),
            )
            conn.commit()

        eq_bands = [EQBandSetting(**b) for b in json.loads(row["eq_json"])]
        return EQSuggestion(explanation=row["explanation"], eq=eq_bands)

    def store(self, embedding: np.ndarray, suggestion: EQSuggestion) -> None:
        """
        Persist a newly generated EQSuggestion and update the FAISS index.

        embedding : shape (1, 384) or (384,), L2-normalised float32
        suggestion: the EQSuggestion produced by the LLM pipeline
        """
        vec     = embedding.reshape(EMBEDDING_DIM).astype(np.float32)
        blob    = _vec_to_blob(vec)
        eq_json = json.dumps([b.model_dump() for b in suggestion.eq])
        now     = datetime.now(timezone.utc).isoformat()

        evicted = False
        with self._conn() as conn:
            count = conn.execute("SELECT COUNT(*) FROM semantic_cache").fetchone()[0]
            if count >= MAX_CACHE_SIZE:
                self._evict_lru(conn)
                evicted = True
            cur = conn.execute(
                "INSERT INTO semantic_cache "
                "(query_embedding, eq_json, explanation, hit_count, created_at, last_accessed) "
                "VALUES (?, ?, ?, 0, ?, ?)",
                (blob, eq_json, suggestion.explanation, now, now),
            )
            new_id = cur.lastrowid
            conn.commit()

        if evicted:
            # IndexFlatIP has no delete — must rebuild the whole index
            self.rebuild_index()
        else:
            # Fast path: just append the new vector
            self._index.add(vec.reshape(1, EMBEDDING_DIM))
            self._row_ids.append(new_id)

    def stats(self) -> dict:
        """Return cache statistics for the /cache/stats endpoint."""
        one_hour_ago = (datetime.now(timezone.utc) - timedelta(hours=1)).isoformat()

        with self._conn() as conn:
            total = conn.execute(
                "SELECT COUNT(*) FROM semantic_cache"
            ).fetchone()[0]
            total_hits = conn.execute(
                "SELECT COALESCE(SUM(hit_count), 0) FROM semantic_cache"
            ).fetchone()[0]
            recent_hits = conn.execute(
                "SELECT COALESCE(SUM(hit_count), 0) FROM semantic_cache WHERE last_accessed > ?",
                (one_hour_ago,),
            ).fetchone()[0]

        return {
            "dynamic_cache_size": total,
            "total_hits": int(total_hits),
            "hits_last_hour": int(recent_hits),
        }
