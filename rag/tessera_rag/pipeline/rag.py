"""
RAG orchestrator: the full pipeline.

  retrieve → three-tier routing → curve-fit → 8-band EQ

Three tiers (score = top FAISS cosine similarity):

  Tier 1  score >= FAST_PATH_THRESHOLD (0.95)
          Fast path: skip LLM, compute curve directly from training data.
          Cost: $0.

  Tier 2  CACHE_LOOKUP_THRESHOLD (0.82) <= score < FAST_PATH_THRESHOLD
          Semantic cache lookup:
            hit  → return cached result. Cost: $0.
            miss → call CHEAP_MODEL (gpt-4o-mini), store result in cache.
          First-time cost is ~10x cheaper than Tier 3.

  Tier 3  score < CACHE_LOOKUP_THRESHOLD (0.82)
          Genuinely novel query: call full LLM_MODEL (gpt-4o), store in cache.

After any LLM call (Tier 2 miss or Tier 3), the result is stored in the
SemanticCache so future semantically-similar queries hit Tier 2 for free.
"""

from __future__ import annotations
from typing import Optional

from tessera_rag.config import (
    FAST_PATH_THRESHOLD, CACHE_LOOKUP_THRESHOLD, DEFAULT_K, ISO_31_FREQS,
    LLM_MODEL, CHEAP_MODEL,
)
from tessera_rag.data.schema import EQSuggestion, EQBandSetting, TargetCurve
from tessera_rag.pipeline.retriever import EQRetriever, QueryResult
from tessera_rag.pipeline.prompt_builder import build_prompt
from tessera_rag.pipeline.generator import EQGenerator
from tessera_rag.pipeline.curve_fitter import fit_curve, combined_response, _FREQS_ARRAY
from tessera_rag.pipeline.cache import SemanticCache
import numpy as np


def _entry_to_target_curve(result: QueryResult) -> tuple[list[float], str]:
    """
    Convert a retrieved EQDescriptorEntry to a 31-band target curve
    by computing the parametric EQ response at the 31 ISO frequencies.
    """
    from tessera_rag.pipeline.curve_fitter import band_response, _BAND_TYPES
    import math
    from tessera_rag.config import NUM_BANDS

    entry = result.entry
    target = np.zeros(len(ISO_31_FREQS))
    freqs_arr = np.array(ISO_31_FREQS, dtype=np.float64)

    for i, (band, band_type) in enumerate(zip(entry.bands, _BAND_TYPES)):
        resp = band_response(band_type, band.frequency, band.gain, band.q, freqs_arr)
        if result.negated:
            resp = -resp
        target += resp

    gains = [float(np.clip(g, -24.0, 24.0)) for g in target]
    desc = f"Crowdsourced: \"{entry.descriptor}\" (confidence={entry.confidence:.2f})"
    return gains, desc


class TesseraEQRAG:
    def __init__(self,
                 retriever: EQRetriever,
                 generator: EQGenerator | None = None,
                 semantic_cache: Optional[SemanticCache] = None) -> None:
        self.retriever     = retriever
        self.generator     = generator
        self.semantic_cache = semantic_cache

    def process(self,
                query: str,
                audio_metrics: dict | None = None,
                k: int = DEFAULT_K) -> EQSuggestion:
        """
        Full pipeline: natural language → 8-band EQ suggestion.

        Returns an EQSuggestion whose .eq field contains 8 EQBandSettings
        and whose .explanation describes the rationale.
        """
        # ── Step 1: retrieve + get query embedding ────────────────────────────
        results: list[QueryResult]
        query_embedding: np.ndarray
        results, query_embedding = self.retriever.retrieve_with_embedding(query, k=k)

        top_score = results[0].score if results else 0.0

        # ── Tier 1: fast path (training data, no LLM) ────────────────────────
        if top_score >= FAST_PATH_THRESHOLD:
            target_gains, explanation = _entry_to_target_curve(results[0])
            target_curve = TargetCurve(
                explanation=explanation,
                gains={str(f): g for f, g in zip(ISO_31_FREQS, target_gains)},
            )
            bands: list[EQBandSetting] = fit_curve(target_gains)
            return EQSuggestion(
                explanation=target_curve.explanation,
                eq=bands,
                target_curve=target_curve,
            )

        # ── Tier 2: semantic cache lookup (moderate confidence) ────────────────
        if self.semantic_cache is not None and top_score >= CACHE_LOOKUP_THRESHOLD:
            cached = self.semantic_cache.lookup(query_embedding, CACHE_LOOKUP_THRESHOLD)
            if cached is not None:
                return cached   # cache hit: $0 cost, sub-millisecond latency

        # ── Tiers 2 miss / 3: LLM generation ─────────────────────────────────
        if self.generator is None:
            raise RuntimeError(
                "No generator configured and no high-confidence retrieval match. "
                "Provide an OpenAI API key or lower the FAST_PATH_THRESHOLD."
            )

        # Route to cheap model for moderate-confidence misses (Tier 2),
        # full model for genuinely novel queries (Tier 3).
        model_override = (
            CHEAP_MODEL if top_score >= CACHE_LOOKUP_THRESHOLD else LLM_MODEL
        )

        system_prompt, user_prompt = build_prompt(query, results, audio_metrics)
        target_curve = self.generator.generate(
            system_prompt, user_prompt, model=model_override
        )
        target_gains = target_curve.as_array(ISO_31_FREQS)

        # ── Curve fitting → 8 parametric bands ───────────────────────────────
        bands = fit_curve(target_gains)
        suggestion = EQSuggestion(
            explanation=target_curve.explanation,
            eq=bands,
            target_curve=target_curve,
        )

        # ── Store in semantic cache for future queries ─────────────────────────
        if self.semantic_cache is not None:
            self.semantic_cache.store(query_embedding, suggestion)

        return suggestion

    def search_only(self, query: str, k: int = DEFAULT_K) -> list[dict]:
        """
        Retrieval-only mode — no LLM call.
        Returns the top-k matches as plain dicts (for the /eq/search endpoint).
        """
        results = self.retriever.retrieve(query, k=k)
        return [
            {
                "descriptor": r.entry.descriptor,
                "score": round(r.score, 4),
                "negated": r.negated,
                "confidence": r.entry.confidence,
                "source": r.entry.source,
                "bands": [b.model_dump() for b in r.entry.bands],
            }
            for r in results
        ]
