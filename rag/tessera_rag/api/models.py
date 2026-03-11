"""
FastAPI request / response models.
Response format matches AIBrain.h parseSuggestionJson (AIBrain.h:588).
"""

from __future__ import annotations
from typing import Optional
from pydantic import BaseModel, Field


class AudioMetrics(BaseModel):
    """Optional audio analysis from AudioAnalyzer.h (AudioMetrics::toJsonString format)."""
    rms_db: Optional[float] = None
    peak_db: Optional[float] = None
    crest_factor: Optional[float] = None
    spectral_centroid: Optional[float] = None
    spectral_flatness: Optional[float] = None
    low_energy: Optional[float] = None
    low_mid_energy: Optional[float] = None
    high_mid_energy: Optional[float] = None
    high_energy: Optional[float] = None
    dynamic_range: Optional[float] = None
    zero_crossing_rate: Optional[float] = None


class EQRequest(BaseModel):
    query: str = Field(..., min_length=1, description="Natural language descriptor")
    audio_metrics: Optional[AudioMetrics] = Field(default=None)
    k: int = Field(default=5, ge=1, le=20, description="Number of references to retrieve")
    user_id: Optional[str] = Field(default=None, description="Phase 5: user ID for personalised blending")


class EQBandResponse(BaseModel):
    """Matches AIBrain.h EQBand struct field names exactly."""
    frequency: float
    gain: float
    q: float
    type: int
    bypass: bool


class EQResponse(BaseModel):
    """Matches the JSON format consumed by parseSuggestionJson (AIBrain.h:620-631)."""
    explanation: str
    eq: list[EQBandResponse]


class SearchResponse(BaseModel):
    descriptor: str
    score: float
    negated: bool
    confidence: float
    source: str
    bands: list[dict]


# ── Phase 3: Dynamic EQ (time-varying, pre-scan based) ────────────────────────

class SegmentMetricsRequest(BaseModel):
    """One time-stamped audio segment and its extracted features."""
    timestamp_ms: float = Field(..., description="Segment start time in milliseconds")
    audio_metrics: Optional[AudioMetrics] = Field(
        default=None,
        description="Spectral/dynamic features extracted by AudioAnalyzer.h for this segment",
    )


class DynamicEQRequest(BaseModel):
    """
    Request for time-varying EQ automation curves.

    The plugin pre-scans the audio, divides it into segments (default 500 ms),
    extracts AudioMetrics per segment, and sends all segments in a single request.
    The server returns one EQ keyframe per segment.
    """
    query: str = Field(..., min_length=1, description="Global tonal descriptor (e.g. 'warm')")
    segments: list[SegmentMetricsRequest] = Field(
        ..., min_length=1, description="Time-ordered list of audio segments to analyse"
    )
    k: int = Field(default=5, ge=1, le=20)


class EQKeyframe(BaseModel):
    """One time-stamped EQ snapshot — a single point on the automation curve."""
    timestamp_ms: float
    eq: list[EQBandResponse]


class DynamicEQResponse(BaseModel):
    """
    Time-varying EQ automation data for all 8 bands.
    Each keyframe is one EQ snapshot at a segment boundary.
    The plugin's AutomationEngine (Phase 4) interpolates between keyframes.
    """
    explanation: str
    keyframes: list[EQKeyframe]
    total_duration_ms: float


# ── Phase 5: Learning ──────────────────────────────────────────────────────────

class AdjustmentRequest(BaseModel):
    """
    Payload sent by LearningEngine.h after the artist tweaks an AI suggestion.
    All JSON fields are stringified arrays of 8 band objects to avoid nested
    Pydantic models (the plugin sends pre-serialised JSON strings).
    """
    user_id:        str = Field(default="default")
    query:          str = Field(..., min_length=1)
    suggested_json: str = Field(..., description="JSON: [{frequency, gain, q, type, bypass} × 8]")
    final_json:     str = Field(..., description="JSON: [{frequency, gain, q, type, bypass} × 8]")
    delta_json:     str = Field(..., description="JSON: [{d_freq, d_gain, d_q} × 8]")


class ClusterProfile(BaseModel):
    query_cluster:  str
    n_observations: int
    avg_delta:      list[dict]
    updated_at:     str


class UserProfileResponse(BaseModel):
    user_id:           str
    total_adjustments: int
    clusters:          list[ClusterProfile]
