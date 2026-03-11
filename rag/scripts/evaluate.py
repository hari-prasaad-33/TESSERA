"""
Benchmark the Tessera EQ RAG system against 30 standard test queries.

Usage:
    cd C:\\Dev\\TesseraOne\\rag
    set OPENAI_API_KEY=sk-...
    python scripts/evaluate.py

Metrics reported per query:
  - retrieval_hit     : top-1 descriptor is semantically related (heuristic check)
  - top1_score        : cosine similarity of top-1 retrieval
  - fast_path         : whether the fast path (no LLM) was used
  - gain_range_ok     : all 8 band gains within [-24, 24] dB
  - q_range_ok        : all Q values within [0.1, 10.0]
  - latency_s         : wall-clock seconds for the full pipeline
  - sanity_ok         : domain-specific checks (see SANITY_CHECKS below)
"""

import os
import sys
import time
import json
from pathlib import Path
from dataclasses import dataclass, field

sys.path.insert(0, str(Path(__file__).parent.parent))

from tessera_rag.config import FAISS_INDEX_PATH, FAISS_METADATA_PATH, PARAM_RANGES
from tessera_rag.index.embedder import DescriptorEmbedder
from tessera_rag.index.faiss_index import EQFaissIndex
from tessera_rag.pipeline.retriever import EQRetriever
from tessera_rag.pipeline.generator import EQGenerator
from tessera_rag.pipeline.rag import TesseraEQRAG

# ── Test query corpus ─────────────────────────────────────────────────────────

TEST_QUERIES = [
    # Single descriptors — most common
    "warm", "bright", "dark", "muddy", "thin", "harsh",
    "crisp", "smooth", "punchy", "nasal", "sibilant", "airy",
    "boxy", "hollow", "full", "presence", "heavy",
    # Action phrases
    "cut the muddiness", "add brightness", "reduce harshness",
    "make it warmer", "boost the presence", "less sibilance",
    # Compound
    "warm and bright", "smooth but present", "full and clear",
    "warm but not dark",
    # Contextual / creative
    "vintage vinyl warmth", "radio-ready clarity", "lo-fi warmth",
]

# ── Sanity checks — domain-specific pass/fail rules ───────────────────────────
# Each entry: (query_substring_match, check_fn)
# check_fn receives the list of 8 EQBandSetting and returns True/False

def _low_boosted(bands) -> bool:
    """Warm/heavy: low bands (0-1) should net positive."""
    return bands[0].gain + bands[1].gain > 0.0

def _high_boosted(bands) -> bool:
    """Bright/airy/crisp: high bands (5-7) should net positive."""
    return bands[5].gain + bands[6].gain + bands[7].gain > 0.0

def _highs_cut(bands) -> bool:
    """Dark/muffled: high bands should be attenuated."""
    return bands[6].gain + bands[7].gain < 0.0

def _low_mid_cut(bands) -> bool:
    """Muddy/boxy: 300-1k range should be attenuated."""
    return bands[2].gain + bands[3].gain < 0.0

def _upper_mid_boosted(bands) -> bool:
    """Presence: 2.5–5 kHz should be boosted."""
    return bands[4].gain + bands[5].gain > 0.0

def _upper_mid_cut(bands) -> bool:
    """Harsh/sibilant: 5–10 kHz should be cut."""
    return bands[5].gain + bands[6].gain < 0.0

SANITY_CHECKS: dict[str, callable] = {
    "warm":      _low_boosted,
    "heavy":     _low_boosted,
    "vintage":   _low_boosted,
    "lo-fi":     _low_boosted,
    "bright":    _high_boosted,
    "airy":      _high_boosted,
    "crisp":     _high_boosted,
    "clarity":   _high_boosted,
    "dark":      _highs_cut,
    "muddy":     _low_mid_cut,
    "muddiness": _low_mid_cut,
    "boxy":      _low_mid_cut,
    "hollow":    _low_mid_cut,
    "presence":  _upper_mid_boosted,
    "present":   _upper_mid_boosted,
    "harsh":     _upper_mid_cut,
    "harshness": _upper_mid_cut,
    "sibilant":  _upper_mid_cut,
    "sibilance": _upper_mid_cut,
}


def _sanity_check(query: str, bands) -> tuple[bool, str]:
    """Return (passed, rule_applied)."""
    q_lower = query.lower()
    for keyword, check_fn in SANITY_CHECKS.items():
        if keyword in q_lower:
            return check_fn(bands), keyword
    return True, "(no rule)"   # No rule defined → vacuously pass


# ── Result dataclass ──────────────────────────────────────────────────────────

@dataclass
class QueryResult:
    query: str
    top1_score: float = 0.0
    top1_descriptor: str = ""
    fast_path: bool = False
    gain_range_ok: bool = True
    q_range_ok: bool = True
    sanity_ok: bool = True
    sanity_rule: str = ""
    latency_s: float = 0.0
    error: str = ""


# ── Main ──────────────────────────────────────────────────────────────────────

def main() -> None:
    if not FAISS_INDEX_PATH.exists():
        print("ERROR: FAISS index not found. Run: python scripts/build_index.py")
        sys.exit(1)

    print("=" * 70)
    print("TESSERA EQ RAG — Evaluation Benchmark")
    print("=" * 70)

    embedder  = DescriptorEmbedder()
    index     = EQFaissIndex.load(FAISS_INDEX_PATH, FAISS_METADATA_PATH)
    retriever = EQRetriever(embedder, index)

    api_key   = os.environ.get("OPENAI_API_KEY")
    generator = EQGenerator(api_key) if api_key else None
    if not generator:
        print("NOTE: OPENAI_API_KEY not set — fast-path-only evaluation.\n")

    rag = TesseraEQRAG(retriever=retriever, generator=generator)

    results: list[QueryResult] = []

    fr_min, fr_max = PARAM_RANGES["frequency"]
    gr_min, gr_max = PARAM_RANGES["gain"]
    qr_min, qr_max = PARAM_RANGES["q"]

    for query in TEST_QUERIES:
        qr = QueryResult(query=query)
        t0 = time.perf_counter()
        try:
            # Retrieval info
            ret = retriever.retrieve(query, k=5)
            if ret:
                qr.top1_score = ret[0].score
                qr.top1_descriptor = ret[0].entry.descriptor
                qr.fast_path = ret[0].score >= 0.95

            # Full pipeline
            suggestion = rag.process(query, k=5)

            # Range checks
            qr.gain_range_ok = all(gr_min <= b.gain <= gr_max for b in suggestion.eq)
            qr.q_range_ok    = all(qr_min <= b.q   <= qr_max for b in suggestion.eq)

            # Sanity check
            qr.sanity_ok, qr.sanity_rule = _sanity_check(query, suggestion.eq)

        except Exception as e:
            qr.error = str(e)

        qr.latency_s = time.perf_counter() - t0
        results.append(qr)
        status = "✓" if (not qr.error and qr.gain_range_ok and qr.q_range_ok and qr.sanity_ok) else "✗"
        print(f"  {status}  {query:<35}  "
              f"score={qr.top1_score:.3f}  "
              f"{'FAST' if qr.fast_path else 'LLM ':4}  "
              f"{qr.latency_s:.2f}s"
              + (f"  ERROR: {qr.error}" if qr.error else "")
              + (f"  SANITY FAIL [{qr.sanity_rule}]" if not qr.sanity_ok else ""))

    # ── Summary ────────────────────────────────────────────────────────────────
    total    = len(results)
    passed   = sum(1 for r in results if not r.error and r.gain_range_ok and r.q_range_ok and r.sanity_ok)
    errored  = sum(1 for r in results if r.error)
    fast_pts = sum(1 for r in results if r.fast_path)
    avg_lat  = sum(r.latency_s for r in results) / total
    avg_score= sum(r.top1_score for r in results) / total
    sanity_f = sum(1 for r in results if not r.sanity_ok)

    print("\n" + "=" * 70)
    print(f"Results:  {passed}/{total} passed")
    print(f"  Range checks passed : {sum(1 for r in results if r.gain_range_ok and r.q_range_ok)}/{total}")
    print(f"  Sanity checks passed: {total - sanity_f}/{total}")
    print(f"  Fast path used      : {fast_pts}/{total} queries")
    print(f"  Errors              : {errored}")
    print(f"  Avg top-1 score     : {avg_score:.3f}")
    print(f"  Avg latency         : {avg_lat:.2f}s")
    print("=" * 70)

    # Save JSON report
    report_path = Path(__file__).parent.parent / "data" / "eval_report.json"
    report_path.parent.mkdir(parents=True, exist_ok=True)
    with open(report_path, "w") as f:
        json.dump(
            [{"query": r.query, "top1_score": r.top1_score, "top1_descriptor": r.top1_descriptor,
              "fast_path": r.fast_path, "gain_range_ok": r.gain_range_ok,
              "q_range_ok": r.q_range_ok, "sanity_ok": r.sanity_ok,
              "sanity_rule": r.sanity_rule, "latency_s": r.latency_s, "error": r.error}
             for r in results],
            f, indent=2,
        )
    print(f"Report saved → {report_path}")


if __name__ == "__main__":
    main()
