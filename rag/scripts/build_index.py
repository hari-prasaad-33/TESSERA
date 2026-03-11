"""
One-shot build script: download → preprocess → embed → build FAISS index.

Usage:
    cd C:\\Dev\\TesseraOne\\rag
    python scripts/build_index.py
"""

import sys
from pathlib import Path

# Make tessera_rag importable when running as a script
sys.path.insert(0, str(Path(__file__).parent.parent))

from tessera_rag.data.download import download_all
from tessera_rag.data.preprocess import preprocess_all, load_processed
from tessera_rag.index.embedder import DescriptorEmbedder
from tessera_rag.index.faiss_index import EQFaissIndex
from tessera_rag.config import (
    PROCESSED_JSONL, EMBEDDINGS_NPY, FAISS_INDEX_PATH, FAISS_METADATA_PATH,
    RAW_DIR,
)
import numpy as np


def main() -> None:
    print("=" * 60)
    print("TESSERA EQ RAG — Index Build")
    print("=" * 60)

    # ── Step 1: Download ───────────────────────────────────────────────────────
    print("\n[1/4] Downloading datasets…")
    fx_dir, eq_path = download_all()

    # ── Step 2: Preprocess ─────────────────────────────────────────────────────
    print("\n[2/4] Preprocessing…")
    entries = preprocess_all(
        socialfx_raw_dir=fx_dir,
        socialeq_raw_path=eq_path,
        out_path=PROCESSED_JSONL,
    )
    print(f"      Total entries: {len(entries)}")
    print(f"      Unique sources: {set(e.source for e in entries)}")

    # ── Step 3: Embed ──────────────────────────────────────────────────────────
    print("\n[3/4] Embedding descriptors…")
    embedder = DescriptorEmbedder()
    descriptors = [e.descriptor for e in entries]
    embeddings = embedder.embed(descriptors, show_progress=True)
    EMBEDDINGS_NPY.parent.mkdir(parents=True, exist_ok=True)
    np.save(str(EMBEDDINGS_NPY), embeddings)
    print(f"      Embeddings shape: {embeddings.shape} → {EMBEDDINGS_NPY}")

    # ── Step 4: Build FAISS index ──────────────────────────────────────────────
    print("\n[4/4] Building FAISS index…")
    index = EQFaissIndex(dim=embeddings.shape[1])
    index.build(embeddings, entries)
    index.save(FAISS_INDEX_PATH, FAISS_METADATA_PATH)

    # ── Summary ────────────────────────────────────────────────────────────────
    print("\n" + "=" * 60)
    print("Build complete!")
    print(f"  Descriptors indexed : {index.index.ntotal}")
    print(f"  FAISS index         : {FAISS_INDEX_PATH}")
    print(f"  Metadata            : {FAISS_METADATA_PATH}")
    print(f"  Embeddings          : {EMBEDDINGS_NPY}")
    print("\nNext steps:")
    print("  python scripts/interactive.py   # test with natural language")
    print("  python scripts/evaluate.py      # run benchmark")
    print("  uvicorn tessera_rag.api.server:app --port 8420  # start API")
    print("=" * 60)


if __name__ == "__main__":
    main()
