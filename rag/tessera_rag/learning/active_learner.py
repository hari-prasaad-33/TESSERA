"""
active_learner.py — Blends per-user learned EQ deltas into RAG suggestions.

When a user has accumulated ≥ MIN_OBSERVATIONS similar adjustments, the next
/eq/suggest call for the same query cluster blends the average delta into the
RAG-generated EQ curve with a confidence-scaled alpha:

    alpha = max_alpha * tanh(n / confidence_scale)

This grows smoothly from 0 → max_alpha as observations accumulate.
At n=1, alpha≈0.0; at n=10, alpha≈max_alpha*0.46; at n=30, alpha≈max_alpha.
"""

from __future__ import annotations

import math
from typing import Optional

from tessera_rag.learning.user_profile import UserProfile, cluster_key


def blend_bands(
    bands: list[dict],
    user_id: Optional[str],
    query: str,
    profile: UserProfile,
    max_alpha: float = 0.5,
    confidence_scale: float = 10.0,
) -> list[dict]:
    """
    Apply the user's learned delta to RAG-suggested EQ bands.

    Parameters
    ----------
    bands:            The 8-band EQ dicts from the RAG pipeline (freq/gain/q/type/bypass).
    user_id:          If None, skip personalisation and return bands unchanged.
    query:            The user's tonal query (used to look up the cluster).
    profile:          The UserProfile store to query for learned deltas.
    max_alpha:        Maximum blend fraction (0 = no learning, 1 = full delta).
    confidence_scale: Number of observations at which alpha reaches ~0.46 * max_alpha.

    Returns
    -------
    A new list of band dicts with personalised gain/freq/q values.
    """
    if not user_id:
        return bands

    result = profile.get_learned_delta(user_id, query)
    if result is None:
        return bands

    delta, n = result
    alpha = max_alpha * math.tanh(n / confidence_scale)

    blended = []
    for band, d in zip(bands, delta):
        b = dict(band)
        b["gain"]      = band.get("gain", 0.0)      + alpha * d.get("d_gain", 0.0)
        b["frequency"] = band.get("frequency", 1000) + alpha * d.get("d_freq", 0.0)
        b["q"]         = max(0.1, band.get("q", 1.0) + alpha * d.get("d_q",    0.0))
        # Clamp gain to ±24 dB (matching APVTS parameter range)
        b["gain"] = max(-24.0, min(24.0, b["gain"]))
        blended.append(b)

    return blended
