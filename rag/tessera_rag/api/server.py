"""
FastAPI server for the Tessera EQ RAG system.

Endpoints:
  POST /eq/suggest         — full RAG pipeline (retrieve + LLM generate + curve fit)
  POST /eq/dynamic-suggest — Phase 3: per-segment keyframes for automation curves
  GET  /eq/search          — retrieval only, no LLM (offline / fast mode)
  POST /eq/learn           — Phase 5: record a user adjustment for active learning
  GET  /eq/profile/{uid}   — Phase 5: retrieve a user's learned EQ profile
  GET  /health             — status check

Start with:  uvicorn tessera_rag.api.server:app --host 127.0.0.1 --port 8420
"""

from __future__ import annotations

import os
from contextlib import asynccontextmanager
from typing import Optional

from fastapi import FastAPI, HTTPException, Query

from tessera_rag.api.models import (
    EQRequest, EQResponse, EQBandResponse, SearchResponse,
    DynamicEQRequest, DynamicEQResponse,
    AdjustmentRequest, UserProfileResponse, ClusterProfile,
)
from tessera_rag.config import (
    FAISS_INDEX_PATH, FAISS_METADATA_PATH, API_HOST, API_PORT
)
from tessera_rag.index.embedder import DescriptorEmbedder
from tessera_rag.index.faiss_index import EQFaissIndex
from tessera_rag.pipeline.retriever import EQRetriever
from tessera_rag.pipeline.generator import EQGenerator
from tessera_rag.pipeline.rag import TesseraEQRAG
from tessera_rag.pipeline.cache import SemanticCache
from tessera_rag.pipeline.dynamic_rag import process_segments
from tessera_rag.learning.user_profile import UserProfile
from tessera_rag.learning.active_learner import blend_bands

# ── Global state ──────────────────────────────────────────────────────────────

_rag:     Optional[TesseraEQRAG] = None
_profile: Optional[UserProfile]  = None
_cache:   Optional[SemanticCache] = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global _rag, _profile, _cache

    print("Loading Tessera EQ RAG system…")

    if not FAISS_INDEX_PATH.exists():
        raise RuntimeError(
            f"FAISS index not found at {FAISS_INDEX_PATH}. "
            "Run: python scripts/build_index.py"
        )

    embedder  = DescriptorEmbedder()
    index     = EQFaissIndex.load(FAISS_INDEX_PATH, FAISS_METADATA_PATH)
    retriever = EQRetriever(embedder, index)

    api_key   = os.environ.get("OPENAI_API_KEY")
    generator = EQGenerator(api_key) if api_key else None
    if generator is None:
        print("WARNING: OPENAI_API_KEY not set — running in retrieval-only mode.")

    _cache   = SemanticCache()   # opens/creates ~/.tessera/semantic_cache.db
    _rag     = TesseraEQRAG(retriever=retriever, generator=generator, semantic_cache=_cache)
    _profile = UserProfile()     # opens/creates ~/.tessera/tessera_learning.db

    print(
        f"✓ Ready — {index.index.ntotal} descriptors loaded. "
        f"Semantic cache: {_cache._index.ntotal} entries. "
        f"Learning DB: {_profile.db_path}"
    )

    yield  # server runs here

    _rag     = None
    _profile = None
    _cache   = None


app = FastAPI(
    title="Tessera EQ RAG",
    version="0.5.0",
    description="Natural language → parametric EQ parameters via RAG + dynamic automation curves + active learning",
    lifespan=lifespan,
)


# ── Endpoints ─────────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    if _rag is None:
        raise HTTPException(503, "RAG system not initialised.")
    return {
        "status":      "ok",
        "descriptors": _rag.retriever.index.index.ntotal,
        "learning_db": str(_profile.db_path) if _profile else "not initialised",
    }


@app.get("/cache/stats")
def cache_stats():
    """
    Semantic cache performance statistics.

    Returns training index size, dynamic cache size, hit counts, and an
    estimate of how many LLM tokens have been saved by cache hits.
    Each cache hit avoids roughly 1,400 tokens (800 output + ~600 average input).
    """
    if _rag is None:
        raise HTTPException(503, "RAG system not initialised.")

    training_size = _rag.retriever.index.index.ntotal
    cache_data    = _cache.stats() if _cache else {
        "dynamic_cache_size": 0,
        "total_hits": 0,
        "hits_last_hour": 0,
    }

    # Rough token-saving estimate per cache hit (output + average grounded prompt)
    tokens_per_hit = 1_400
    tokens_saved   = cache_data["total_hits"] * tokens_per_hit

    return {
        "training_index_size":  training_size,
        "dynamic_cache_size":   cache_data["dynamic_cache_size"],
        "total_cache_hits":     cache_data["total_hits"],
        "hits_last_hour":       cache_data["hits_last_hour"],
        "tokens_saved_estimate": tokens_saved,
    }


@app.post("/eq/suggest", response_model=EQResponse)
def suggest_eq(request: EQRequest):
    """
    Full RAG pipeline: retrieve references → (LLM generate 31-band curve) → curve-fit → 8-band EQ.

    Phase 5: If user_id is provided and sufficient adjustments have been recorded,
    the result is blended with the user's learned delta before returning.
    """
    if _rag is None:
        raise HTTPException(503, "RAG system not initialised.")

    metrics_dict = request.audio_metrics.model_dump(exclude_none=True) if request.audio_metrics else None

    try:
        suggestion = _rag.process(
            query=request.query,
            audio_metrics=metrics_dict,
            k=request.k,
        )
    except Exception as e:
        raise HTTPException(500, detail=str(e))

    # Convert to band dicts for blending
    band_dicts = [
        {"frequency": b.frequency, "gain": b.gain, "q": b.q,
         "type": b.type, "bypass": b.bypass}
        for b in suggestion.eq
    ]

    # Phase 5: blend with user's learned preferences (no-op if user_id is None
    # or fewer than MIN_OBSERVATIONS adjustments have been recorded)
    if _profile and request.user_id:
        band_dicts = blend_bands(
            band_dicts, request.user_id, request.query, _profile
        )

    return EQResponse(
        explanation=suggestion.explanation,
        eq=[
            EQBandResponse(
                frequency=b["frequency"],
                gain=b["gain"],
                q=b["q"],
                type=b["type"],
                bypass=b["bypass"],
            )
            for b in band_dicts
        ],
    )


@app.post("/eq/dynamic-suggest", response_model=DynamicEQResponse)
async def suggest_dynamic_eq(request: DynamicEQRequest):
    """
    Phase 3 — Dynamic EQ automation curves.

    Accepts a query and a list of audio segments (each with AudioMetrics extracted
    by PreScanAnalyzer.h). Returns one EQ keyframe per segment, ready for the
    AutomationEngine (Phase 4) to interpolate between them.
    """
    if _rag is None:
        raise HTTPException(503, "RAG system not initialised.")

    try:
        response = await process_segments(_rag, request)
    except Exception as e:
        raise HTTPException(500, detail=str(e))

    return response


@app.get("/eq/search", response_model=list[SearchResponse])
def search_descriptors(
    q: str = Query(..., description="Natural language query"),
    k: int = Query(default=5, ge=1, le=20),
):
    """
    Retrieval-only endpoint — no LLM call.
    Returns the top-k matching descriptors with their EQ settings.
    """
    if _rag is None:
        raise HTTPException(503, "RAG system not initialised.")

    results = _rag.search_only(q, k=k)
    return [SearchResponse(**r) for r in results]


# ── Phase 5: Learning ──────────────────────────────────────────────────────────

@app.post("/eq/learn", status_code=202)
def record_adjustment(body: AdjustmentRequest):
    """
    Phase 5 — Record an artist EQ adjustment for active learning.

    The LearningEngine.h sends this after the artist tweaks the AI suggestion.
    Stores the delta in SQLite (WAL mode, server-serialised writes).
    After ≥ 3 adjustments for the same query cluster, the learned delta is
    blended into future /eq/suggest responses when the same user_id is supplied.
    """
    if _profile is None:
        raise HTTPException(503, "Learning store not initialised.")

    try:
        row_id = _profile.record_adjustment(
            user_id=body.user_id,
            query=body.query,
            suggested_json=body.suggested_json,
            final_json=body.final_json,
            delta_json=body.delta_json,
        )
    except Exception as e:
        raise HTTPException(500, detail=f"Failed to record adjustment: {e}")

    return {"status": "accepted", "id": row_id, "user_id": body.user_id}


@app.get("/eq/profile/{user_id}", response_model=UserProfileResponse)
def get_user_profile(user_id: str):
    """
    Phase 5 — Return a user's learned EQ profile.

    Lists all query clusters the user has adjusted, with the learned average
    delta and observation count. Only clusters with ≥ MIN_OBSERVATIONS adjustments
    are used for active blending, but all are returned here for transparency.
    """
    if _profile is None:
        raise HTTPException(503, "Learning store not initialised.")

    data = _profile.get_profile(user_id)
    return UserProfileResponse(
        user_id=data["user_id"],
        total_adjustments=data["total_adjustments"],
        clusters=[
            ClusterProfile(
                query_cluster=c["query_cluster"],
                n_observations=c["n_observations"],
                avg_delta=c["avg_delta"],
                updated_at=c["updated_at"],
            )
            for c in data["clusters"]
        ],
    )


# ── Dev runner ────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn  # type: ignore
    uvicorn.run("tessera_rag.api.server:app", host=API_HOST, port=API_PORT, reload=True)
