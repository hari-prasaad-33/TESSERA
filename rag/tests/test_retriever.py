"""
Unit tests for the FAISS index and retriever.
These tests build a tiny in-memory index from synthetic data — no files needed.
Run with: pytest tests/test_retriever.py -v
"""

import pytest
import numpy as np
from tessera_rag.config import DEFAULT_BANDS, BAND_TYPE_PEAK, BAND_TYPE_LOW_SHELF, BAND_TYPE_HIGH_SHELF
from tessera_rag.data.schema import EQBandSetting, EQDescriptorEntry
from tessera_rag.index.faiss_index import EQFaissIndex
from tessera_rag.pipeline.retriever import EQRetriever, _ACTION_PREFIXES, _NEGATION_RE


# ── Fixtures ───────────────────────────────────────────────────────────────────

def _make_entry(descriptor: str, gain: float = 0.0) -> EQDescriptorEntry:
    bands = [
        EQBandSetting(frequency=b["frequency"], gain=gain, q=b["q"], type=b["type"])
        for b in DEFAULT_BANDS
    ]
    return EQDescriptorEntry(descriptor=descriptor, bands=bands,
                             source="test", confidence=0.8, participant_count=5)


class _FakeEmbedder:
    """Deterministic embedder using random-but-fixed vectors per word."""
    dim = 4

    def embed(self, texts: list[str], **kwargs) -> np.ndarray:
        rng = np.random.default_rng(42)
        base = rng.normal(size=(100, self.dim)).astype(np.float32)
        vecs = []
        for t in texts:
            idx = hash(t) % 100
            v = base[idx].copy()
            norm = np.linalg.norm(v)
            vecs.append(v / norm if norm > 0 else v)
        return np.stack(vecs).astype(np.float32)

    def embed_query(self, query: str) -> np.ndarray:
        return self.embed([query])


@pytest.fixture
def tiny_index():
    descriptors = ["warm", "bright", "dark", "muddy", "harsh", "crisp"]
    entries = [_make_entry(d) for d in descriptors]
    embedder = _FakeEmbedder()
    embeddings = embedder.embed(descriptors)

    idx = EQFaissIndex(dim=4)
    idx.build(embeddings, entries)
    return idx, embedder, entries


# ── EQFaissIndex ───────────────────────────────────────────────────────────────

def test_index_builds(tiny_index):
    idx, _, entries = tiny_index
    assert idx.index.ntotal == len(entries)

def test_search_returns_k_results(tiny_index):
    idx, embedder, _ = tiny_index
    q = embedder.embed_query("warm")
    results = idx.search(q, k=3)
    assert len(results) == 3

def test_search_scores_descending(tiny_index):
    idx, embedder, _ = tiny_index
    q = embedder.embed_query("warm")
    results = idx.search(q, k=5)
    scores = [r[1] for r in results]
    assert scores == sorted(scores, reverse=True)

def test_search_scores_in_valid_range(tiny_index):
    idx, embedder, _ = tiny_index
    q = embedder.embed_query("bright")
    results = idx.search(q, k=3)
    for _, score in results:
        assert -1.1 <= score <= 1.1  # cosine similarity

def test_exact_match_top1(tiny_index):
    """An exact descriptor should be the top-1 result (or very close)."""
    idx, embedder, _ = tiny_index
    # Use the same embedder for both query and index — exact descriptor → same vector
    q = embedder.embed_query("warm")
    results = idx.search(q, k=1)
    assert results[0][0].descriptor == "warm"


# ── EQRetriever action-prefix stripping ───────────────────────────────────────

@pytest.mark.parametrize("raw,expected_stripped", [
    ("make it warmer",        "warmer"),
    ("add some brightness",   "brightness"),
    ("cut the muddiness",     "muddiness"),
    ("reduce the harshness",  "harshness"),
    ("boost the presence",    "presence"),
    ("give me more warmth",   "warmth"),
    ("needs more punch",      "punch"),
])
def test_action_prefix_stripping(raw, expected_stripped):
    cleaned = _ACTION_PREFIXES.sub("", raw.lower()).strip()
    assert cleaned == expected_stripped, f"For '{raw}': got '{cleaned}'"


# ── EQRetriever negation detection ───────────────────────────────────────────

@pytest.mark.parametrize("query,should_negate", [
    ("not too bright", True),
    ("less harsh",     True),
    ("reduce harshness", True),
    ("warm",           False),
    ("bright and airy", False),
])
def test_negation_detection(query, should_negate):
    is_negated = bool(_NEGATION_RE.match(query.lower()))
    assert is_negated == should_negate


# ── EQRetriever compound query ────────────────────────────────────────────────

def test_compound_query_returns_k_results(tiny_index):
    idx, embedder, _ = tiny_index
    retriever = EQRetriever(embedder, idx)
    results = retriever.retrieve("warm and bright", k=4)
    assert 1 <= len(results) <= 4

def test_single_query_returns_results(tiny_index):
    idx, embedder, _ = tiny_index
    retriever = EQRetriever(embedder, idx)
    results = retriever.retrieve("dark", k=3)
    assert len(results) >= 1

def test_negated_query_flagged(tiny_index):
    idx, embedder, _ = tiny_index
    retriever = EQRetriever(embedder, idx)
    results = retriever.retrieve("not too bright", k=3)
    # At least the first result should be negated
    assert any(r.negated for r in results)
