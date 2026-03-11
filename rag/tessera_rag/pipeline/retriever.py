"""
Query → embed → FAISS search → top-k EQ descriptors.

Handles natural language pre-processing:
  - Lowercase normalisation
  - Action prefix stripping ("make it", "add some", "cut the", ...)
  - Negation extraction ("not too bright" → {"query": "bright", "negate": True})
  - Compound queries ("warm and bright" → split and merge results)
"""

from __future__ import annotations
import re
from tessera_rag.index.embedder import DescriptorEmbedder
from tessera_rag.index.faiss_index import EQFaissIndex
from tessera_rag.data.schema import EQDescriptorEntry

# Prefixes to strip before embedding (the descriptor part matters, not the verb)
_ACTION_PREFIXES = re.compile(
    r"^(make\s+(it|the|this)\s+|add\s+(some\s+|more\s+)?|boost\s+(the\s+)?|"
    r"cut\s+(the\s+|some\s+)?|reduce\s+(the\s+)?|remove\s+(the\s+)?|"
    r"increase\s+(the\s+)?|decrease\s+(the\s+)?|give\s+(it|me)\s+(?:some\s+|more\s+)?|"
    r"i\s+want\s+(more\s+|some\s+)?|needs?\s+(more\s+|some\s+)?|"
    r"too\s+much\s+|less\s+)",
    re.IGNORECASE,
)

_NEGATION_RE = re.compile(
    r"^(not\s+(too\s+)?|less\s+|reduce\s+(the\s+)?|without\s+(too\s+much\s+)?)",
    re.IGNORECASE,
)

_COMPOUND_SPLIT = re.compile(r"\s*(?:and|but|,)\s*", re.IGNORECASE)


class QueryResult:
    def __init__(self, entry: EQDescriptorEntry, score: float, negated: bool = False) -> None:
        self.entry = entry
        self.score = score
        self.negated = negated


class EQRetriever:
    def __init__(self, embedder: DescriptorEmbedder, index: EQFaissIndex) -> None:
        self.embedder = embedder
        self.index = index

    # ── Public API ─────────────────────────────────────────────────────────────

    def retrieve_with_embedding(
        self, query: str, k: int = 5
    ) -> tuple[list[QueryResult], np.ndarray]:
        """
        Same as retrieve() but also returns the query embedding vector.

        The embedding represents the full cleaned query (not per sub-part) and is
        suitable for use as a semantic cache key in the RAG orchestrator.

        Returns:
            (results, embedding) where embedding has shape (1, EMBEDDING_DIM), float32, L2-normalised.
        """
        import numpy as np

        query_lower = query.strip().lower()

        # For both simple and compound queries, embed the full cleaned query
        # for the cache key (compound sub-part retrieval logic is unchanged below)
        clean_full = _ACTION_PREFIXES.sub("", query_lower)
        clean_full = _NEGATION_RE.sub("", clean_full).strip() or query_lower
        embedding  = self.embedder.embed_query(clean_full)

        results = self.retrieve(query, k=k)
        return results, embedding

    def retrieve(self, query: str, k: int = 5) -> list[QueryResult]:
        """
        Main entry point. Returns up to k QueryResult objects (sorted by score).
        Handles compound queries by merging sub-query results.
        """
        query = query.strip().lower()

        # Split compound queries: "warm and bright" → ["warm", "bright"]
        parts = [p.strip() for p in _COMPOUND_SPLIT.split(query) if p.strip()]

        if len(parts) > 1:
            # Retrieve for each part, merge and deduplicate by descriptor
            all_results: dict[str, QueryResult] = {}
            for part in parts:
                for r in self._retrieve_single(part, k):
                    key = r.entry.descriptor
                    if key not in all_results or r.score > all_results[key].score:
                        all_results[key] = r
            merged = sorted(all_results.values(), key=lambda r: r.score, reverse=True)
            return merged[:k]

        return self._retrieve_single(query, k)

    # ── Internals ──────────────────────────────────────────────────────────────

    def _retrieve_single(self, query: str, k: int) -> list[QueryResult]:
        """Retrieve for a single (pre-split) query fragment."""
        negated = bool(_NEGATION_RE.match(query))

        # Strip action prefixes and negation prefixes before embedding
        clean = _ACTION_PREFIXES.sub("", query)
        clean = _NEGATION_RE.sub("", clean).strip()
        if not clean:
            clean = query  # fallback

        vec = self.embedder.embed_query(clean)
        raw = self.index.search(vec, k)
        return [QueryResult(entry, score, negated) for entry, score in raw]
