"""
Interactive CLI REPL for testing the Tessera EQ RAG system.

Usage:
    cd C:\\Dev\\TesseraOne\\rag
    set OPENAI_API_KEY=sk-...
    python scripts/interactive.py
"""

import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from tessera_rag.config import (
    FAISS_INDEX_PATH, FAISS_METADATA_PATH, ISO_31_FREQS, DEFAULT_BANDS
)
from tessera_rag.index.embedder import DescriptorEmbedder
from tessera_rag.index.faiss_index import EQFaissIndex
from tessera_rag.pipeline.retriever import EQRetriever
from tessera_rag.pipeline.generator import EQGenerator
from tessera_rag.pipeline.rag import TesseraEQRAG

_BAND_TYPE_NAMES = {0: "LowCut", 1: "LowShelf", 2: "Peak", 3: "HighShelf", 4: "HighCut"}


def _print_eq(suggestion) -> None:
    print(f"\n  Explanation: {suggestion.explanation}")
    print()
    print(f"  {'Band':<4} {'Type':<10} {'Freq (Hz)':<12} {'Gain (dB)':<11} {'Q':<7}")
    print(f"  {'-'*4} {'-'*10} {'-'*12} {'-'*11} {'-'*7}")
    for i, band in enumerate(suggestion.eq):
        t = _BAND_TYPE_NAMES.get(band.type, "?")
        print(f"  {i:<4} {t:<10} {band.frequency:<12.1f} {band.gain:+<11.2f} {band.q:<7.3f}")

    if suggestion.target_curve:
        print("\n  31-band target curve (internal AI reasoning):")
        gains = suggestion.target_curve.as_array(ISO_31_FREQS)
        # Print as a compact bar chart
        for freq, gain in zip(ISO_31_FREQS, gains):
            bar_len = int(abs(gain) * 2)
            bar = ("+" if gain >= 0 else "-") + ("█" * bar_len)
            print(f"  {freq:>7} Hz  {gain:+6.2f} dB  {bar}")


def _print_references(results) -> None:
    print(f"\n  Retrieved {len(results)} reference(s):")
    for i, r in enumerate(results):
        neg = " [NEGATED]" if r.negated else ""
        print(f"    [{i+1}] \"{r.entry.descriptor}\""
              f"  score={r.score:.3f}  conf={r.entry.confidence:.2f}{neg}")


def main() -> None:
    if not FAISS_INDEX_PATH.exists():
        print("ERROR: FAISS index not found. Run: python scripts/build_index.py")
        sys.exit(1)

    print("\n" + "=" * 60)
    print("TESSERA EQ RAG — Interactive Mode")
    print("=" * 60)
    print("Type a sound descriptor (e.g. 'warm', 'bright', 'cut the mud')")
    print("Commands: !search <query>  !quit\n")

    embedder  = DescriptorEmbedder()
    index     = EQFaissIndex.load(FAISS_INDEX_PATH, FAISS_METADATA_PATH)
    retriever = EQRetriever(embedder, index)

    api_key = os.environ.get("OPENAI_API_KEY")
    generator = EQGenerator(api_key) if api_key else None
    if not generator:
        print("NOTE: OPENAI_API_KEY not set — retrieval-only mode (fast path only).\n")

    rag = TesseraEQRAG(retriever=retriever, generator=generator)

    while True:
        try:
            query = input("tessera-eq> ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\nGoodbye.")
            break

        if not query:
            continue
        if query.lower() in ("!quit", "!exit", "quit", "exit"):
            print("Goodbye.")
            break

        if query.startswith("!search "):
            q = query[8:].strip()
            results = rag.search_only(q, k=8)
            print(f"\nRetrieval results for '{q}':")
            for r in results:
                print(f"  {r['score']:.3f}  \"{r['descriptor']}\"  (conf={r['confidence']:.2f})")
            print()
            continue

        import time
        t0 = time.time()
        try:
            results = retriever.retrieve(query, k=5)
            _print_references(results)

            suggestion = rag.process(query, k=5)
            _print_eq(suggestion)

        except Exception as e:
            print(f"\nERROR: {e}")

        elapsed = time.time() - t0
        print(f"\n  [{elapsed:.2f}s]\n")


if __name__ == "__main__":
    main()
