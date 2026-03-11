"""
Dynamic RAG — per-segment EQ curve generation for time-varying automation.

Phase 3 of TESSERA EQ: produces one EQ keyframe per audio segment so that
the AutomationEngine (Phase 4) can interpolate between them, creating smooth
time-varying EQ that follows the musical content of the source material.

Flow:
  PreScanAnalyzer (C++) ──► POST /eq/dynamic-suggest ──► dynamic_rag.process_segments()
                                                           └── TesseraEQRAG.process() × N segments
                                                                └── curve_fitter() → 8 bands
                          ◄── DynamicEQResponse (keyframes list) ──────────────────────────
"""

from __future__ import annotations

import asyncio
import logging
from typing import Optional

from tessera_rag.api.models import (
    DynamicEQRequest,
    DynamicEQResponse,
    EQBandResponse,
    EQKeyframe,
)
from tessera_rag.pipeline.rag import TesseraEQRAG

logger = logging.getLogger(__name__)


async def process_segments(
    rag: TesseraEQRAG,
    request: DynamicEQRequest,
) -> DynamicEQResponse:
    """
    Generate one EQ keyframe per audio segment.

    Runs the full TesseraEQRAG pipeline for every segment in *request.segments*.
    Segments without audio metrics fall back to the global query-only RAG result.

    Phase 4 note:
        The returned keyframes feed directly into AutomationEngine::loadKeyframes(),
        which interpolates between them at buffer-aligned boundaries.

    Args:
        rag:     Initialised TesseraEQRAG instance (retriever + optional generator).
        request: DynamicEQRequest containing the global query and per-segment metrics.

    Returns:
        DynamicEQResponse with one EQKeyframe per input segment, sorted by timestamp.
    """
    segments = sorted(request.segments, key=lambda s: s.timestamp_ms)
    keyframes: list[EQKeyframe] = []
    explanations: list[str] = []

    # Build segment tasks — run concurrently where possible.
    # (TesseraEQRAG.process is synchronous; we offload each to a thread executor.)
    loop = asyncio.get_event_loop()

    async def process_one(seg) -> tuple[float, list[EQBandResponse], str]:
        metrics_dict: Optional[dict] = None
        if seg.audio_metrics is not None:
            metrics_dict = seg.audio_metrics.model_dump(exclude_none=True)

        # Run blocking RAG pipeline in thread pool so we don't stall the event loop
        suggestion = await loop.run_in_executor(
            None,  # default ThreadPoolExecutor
            lambda: rag.process(
                query=request.query,
                audio_metrics=metrics_dict,
                k=request.k,
            ),
        )

        eq_bands = [
            EQBandResponse(
                frequency=b.frequency,
                gain=b.gain,
                q=b.q,
                type=b.type,
                bypass=b.bypass,
            )
            for b in suggestion.eq
        ]
        return seg.timestamp_ms, eq_bands, suggestion.explanation

    tasks = [process_one(seg) for seg in segments]
    results = await asyncio.gather(*tasks, return_exceptions=True)

    for result in results:
        if isinstance(result, Exception):
            logger.error("Segment processing failed: %s", result)
            # Skip failed segments rather than aborting the whole request
            continue
        ts_ms, eq_bands, explanation = result
        keyframes.append(EQKeyframe(timestamp_ms=ts_ms, eq=eq_bands))
        explanations.append(explanation)

    if not keyframes:
        raise RuntimeError("All segments failed to process — check RAG server logs.")

    # Sort by timestamp (asyncio.gather preserves order, but be explicit)
    keyframes.sort(key=lambda kf: kf.timestamp_ms)

    total_ms = max(kf.timestamp_ms for kf in keyframes) if keyframes else 0.0
    summary = explanations[0] if explanations else "No explanation available"

    return DynamicEQResponse(
        explanation=f"Dynamic EQ: {summary} (across {len(keyframes)} segments)",
        keyframes=keyframes,
        total_duration_ms=total_ms,
    )
