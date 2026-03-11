"""
Sentence-transformer embedding wrapper.
Model: all-MiniLM-L6-v2 — 384-dim, fast inference, good ONNX export path.
"""

from __future__ import annotations
import numpy as np
from tessera_rag.config import EMBEDDING_MODEL, EMBEDDING_DIM


class DescriptorEmbedder:
    def __init__(self, model_name: str = EMBEDDING_MODEL) -> None:
        from sentence_transformers import SentenceTransformer  # type: ignore
        self.model = SentenceTransformer(model_name)
        self.dim = EMBEDDING_DIM

    def embed(self, texts: list[str], show_progress: bool = False) -> np.ndarray:
        """
        Embed a list of strings.
        Returns float32 array of shape (N, DIM), L2-normalised so that
        inner product == cosine similarity.
        """
        vecs = self.model.encode(
            texts,
            normalize_embeddings=True,
            show_progress_bar=show_progress,
            batch_size=128,
        )
        return vecs.astype(np.float32)

    def embed_query(self, query: str) -> np.ndarray:
        """Embed a single query string. Returns shape (1, DIM)."""
        return self.embed([query])
