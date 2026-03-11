"""
FAISS index wrapper for EQ descriptor retrieval.

IndexFlatIP (inner product) is used because embeddings are L2-normalised,
making inner product equivalent to cosine similarity. Brute-force is
perfectly adequate for ~5,000 descriptors.
"""

from __future__ import annotations
import json
import numpy as np
from pathlib import Path

import faiss  # type: ignore

from tessera_rag.config import EMBEDDING_DIM, FAISS_INDEX_PATH, FAISS_METADATA_PATH
from tessera_rag.data.schema import EQDescriptorEntry


class EQFaissIndex:
    def __init__(self, dim: int = EMBEDDING_DIM) -> None:
        self.dim = dim
        self.index: faiss.Index = faiss.IndexFlatIP(dim)
        self.entries: list[EQDescriptorEntry] = []

    def build(self, embeddings: np.ndarray, entries: list[EQDescriptorEntry]) -> None:
        """Build the index from pre-computed embeddings and their metadata."""
        assert embeddings.shape == (len(entries), self.dim), (
            f"Shape mismatch: embeddings {embeddings.shape}, entries {len(entries)}"
        )
        self.index.reset()
        self.index.add(embeddings.astype(np.float32))
        self.entries = list(entries)
        print(f"FAISS index built: {self.index.ntotal} vectors, dim={self.dim}")

    def search(self, query_vec: np.ndarray, k: int = 5) -> list[tuple[EQDescriptorEntry, float]]:
        """
        Nearest-neighbour search.
        query_vec: shape (1, dim) or (dim,) — will be reshaped automatically.
        Returns list of (entry, similarity_score) sorted by score desc.
        """
        q = query_vec.reshape(1, self.dim).astype(np.float32)
        scores, indices = self.index.search(q, k)
        results = []
        for score, idx in zip(scores[0], indices[0]):
            if idx >= 0:
                results.append((self.entries[idx], float(score)))
        return results

    def save(self,
             index_path: Path = FAISS_INDEX_PATH,
             metadata_path: Path = FAISS_METADATA_PATH) -> None:
        index_path.parent.mkdir(parents=True, exist_ok=True)
        faiss.write_index(self.index, str(index_path))
        with open(metadata_path, "w", encoding="utf-8") as f:
            json.dump([e.to_dict() for e in self.entries], f, ensure_ascii=False, indent=2)
        print(f"Saved FAISS index → {index_path}")
        print(f"Saved metadata   → {metadata_path}")

    @classmethod
    def load(cls,
             index_path: Path = FAISS_INDEX_PATH,
             metadata_path: Path = FAISS_METADATA_PATH) -> "EQFaissIndex":
        obj = cls()
        obj.index = faiss.read_index(str(index_path))
        with open(metadata_path, encoding="utf-8") as f:
            raw = json.load(f)
        obj.entries = [EQDescriptorEntry.from_dict(d) for d in raw]
        print(f"Loaded FAISS index: {obj.index.ntotal} vectors from {index_path}")
        return obj
