"""
user_profile.py — SQLite-backed store for per-user EQ adjustment learning data.

Database: ~/.tessera/tessera_learning.db

Schema
------
  adjustments:        raw log of every artist adjustment (suggested → final)
  learned_clusters:   running-average delta per (user_id, query_cluster)

Thread safety
-------------
  The FastAPI server is the sole writer — plugin instances POST via HTTP.
  Each handler opens a short-lived connection (no shared state between threads).
  WAL mode allows concurrent readers from the /eq/profile endpoint.

Active learning trigger
-----------------------
  After every write, if the cluster now has ≥ MIN_OBSERVATIONS, the
  learned_clusters row is updated with the new running average delta.
  The /eq/suggest endpoint can blend this delta into future RAG suggestions.
"""

from __future__ import annotations

import json
import re
import sqlite3
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

# ── Constants ──────────────────────────────────────────────────────────────────

DEFAULT_DB_PATH     = Path.home() / ".tessera" / "tessera_learning.db"
MIN_OBSERVATIONS    = 3      # cluster must have this many adjustments before delta is trusted

# ── Schema DDL ────────────────────────────────────────────────────────────────

_DDL_ADJUSTMENTS = """
CREATE TABLE IF NOT EXISTS adjustments (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id        TEXT    NOT NULL,
    query          TEXT    NOT NULL,
    query_cluster  TEXT    NOT NULL,
    timestamp      TEXT    NOT NULL,
    suggested_json TEXT    NOT NULL,
    final_json     TEXT    NOT NULL,
    delta_json     TEXT    NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_adj_user ON adjustments (user_id, query_cluster);
"""

_DDL_CLUSTERS = """
CREATE TABLE IF NOT EXISTS learned_clusters (
    user_id        TEXT    NOT NULL,
    query_cluster  TEXT    NOT NULL,
    avg_delta_json TEXT    NOT NULL,
    n_observations INTEGER NOT NULL DEFAULT 1,
    updated_at     TEXT    NOT NULL,
    PRIMARY KEY (user_id, query_cluster)
);
"""

# ── Helpers ───────────────────────────────────────────────────────────────────

def cluster_key(query: str) -> str:
    """Normalise a query to a cluster key: lowercase, de-punctuate, sort words."""
    words = sorted(re.sub(r"[^a-z0-9 ]", "", query.lower()).split())
    return " ".join(words) or "default"


def _incremental_avg(old: list[dict], new_delta: list[dict], n: int) -> list[dict]:
    """
    Welford-style incremental mean:
        avg_n = avg_{n-1} + (x_n - avg_{n-1}) / n
    """
    result = []
    for o, d in zip(old, new_delta):
        result.append({
            "d_freq": o["d_freq"] + (d.get("d_freq", 0.0) - o["d_freq"]) / n,
            "d_gain": o["d_gain"] + (d.get("d_gain", 0.0) - o["d_gain"]) / n,
            "d_q":    o["d_q"]    + (d.get("d_q",    0.0) - o["d_q"])    / n,
        })
    return result

# ── UserProfile ───────────────────────────────────────────────────────────────

class UserProfile:
    """
    Thread-safe (per-connection) SQLite store for user learning data.

    Create one instance in the server lifespan and pass it to endpoints.
    The server process is the sole writer; WAL mode handles concurrent readers.
    """

    def __init__(self, db_path: Path = DEFAULT_DB_PATH) -> None:
        self.db_path = db_path
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        self._init_schema()

    # ── Private ───────────────────────────────────────────────────────────────

    def _conn(self) -> sqlite3.Connection:
        conn = sqlite3.connect(str(self.db_path), timeout=30)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA journal_mode=WAL;")
        conn.execute("PRAGMA synchronous=NORMAL;")
        return conn

    def _init_schema(self) -> None:
        with self._conn() as conn:
            for stmt in _DDL_ADJUSTMENTS.strip().split(";"):
                if stmt.strip():
                    conn.execute(stmt)
            for stmt in _DDL_CLUSTERS.strip().split(";"):
                if stmt.strip():
                    conn.execute(stmt)
            conn.commit()

    # ── Public API ────────────────────────────────────────────────────────────

    def record_adjustment(
        self,
        user_id: str,
        query: str,
        suggested_json: str,
        final_json: str,
        delta_json: str,
    ) -> int:
        """
        Persist a raw adjustment and update the cluster running average.
        Returns the new row id.
        """
        ck  = cluster_key(query)
        now = datetime.now(timezone.utc).isoformat()

        with self._conn() as conn:
            cur = conn.execute(
                "INSERT INTO adjustments "
                "(user_id, query, query_cluster, timestamp, suggested_json, final_json, delta_json) "
                "VALUES (?, ?, ?, ?, ?, ?, ?)",
                (user_id, query, ck, now, suggested_json, final_json, delta_json),
            )
            row_id = cur.lastrowid

            # Update running average for the cluster
            existing = conn.execute(
                "SELECT avg_delta_json, n_observations FROM learned_clusters "
                "WHERE user_id=? AND query_cluster=?",
                (user_id, ck),
            ).fetchone()

            new_delta = json.loads(delta_json)

            if existing is None:
                conn.execute(
                    "INSERT INTO learned_clusters "
                    "(user_id, query_cluster, avg_delta_json, n_observations, updated_at) "
                    "VALUES (?, ?, ?, 1, ?)",
                    (user_id, ck, delta_json, now),
                )
            else:
                n       = existing["n_observations"] + 1
                old_avg = json.loads(existing["avg_delta_json"])
                new_avg = _incremental_avg(old_avg, new_delta, n)
                conn.execute(
                    "UPDATE learned_clusters "
                    "SET avg_delta_json=?, n_observations=?, updated_at=? "
                    "WHERE user_id=? AND query_cluster=?",
                    (json.dumps(new_avg), n, now, user_id, ck),
                )

            conn.commit()
        return row_id

    def get_learned_delta(
        self, user_id: str, query: str
    ) -> Optional[tuple[list[dict], int]]:
        """
        Return (avg_delta, n_observations) for this user/query cluster, or None
        if fewer than MIN_OBSERVATIONS adjustments have been recorded.
        """
        ck = cluster_key(query)
        with self._conn() as conn:
            row = conn.execute(
                "SELECT avg_delta_json, n_observations FROM learned_clusters "
                "WHERE user_id=? AND query_cluster=?",
                (user_id, ck),
            ).fetchone()

        if row is None or row["n_observations"] < MIN_OBSERVATIONS:
            return None
        return json.loads(row["avg_delta_json"]), row["n_observations"]

    def get_profile(self, user_id: str) -> dict:
        """Return a summary of all learned clusters for a user."""
        with self._conn() as conn:
            clusters = conn.execute(
                "SELECT query_cluster, n_observations, avg_delta_json, updated_at "
                "FROM learned_clusters WHERE user_id=? ORDER BY n_observations DESC",
                (user_id,),
            ).fetchall()
            total = conn.execute(
                "SELECT COUNT(*) AS cnt FROM adjustments WHERE user_id=?",
                (user_id,),
            ).fetchone()["cnt"]

        return {
            "user_id": user_id,
            "total_adjustments": total,
            "clusters": [
                {
                    "query_cluster":  r["query_cluster"],
                    "n_observations": r["n_observations"],
                    "avg_delta":      json.loads(r["avg_delta_json"]),
                    "updated_at":     r["updated_at"],
                }
                for r in clusters
            ],
        }
