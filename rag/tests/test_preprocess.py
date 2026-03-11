"""
Unit tests for data preprocessing.
Run with: pytest tests/test_preprocess.py -v
"""

import pytest
from tessera_rag.config import PARAM_RANGES, DEFAULT_BANDS
from tessera_rag.data.preprocess import (
    _nearest_band, _interpolate_gain, _clamp_band,
    _socialfx_to_tessera, _SOCIALFX_DEFAULT_FREQS,
    augment_with_synonyms, deduplicate,
)
from tessera_rag.data.schema import EQBandSetting, EQDescriptorEntry
from tessera_rag.config import BAND_TYPE_PEAK, BAND_TYPE_LOW_SHELF, BAND_TYPE_HIGH_SHELF

TESSERA_FREQS = [b["frequency"] for b in DEFAULT_BANDS]


# ── _nearest_band ──────────────────────────────────────────────────────────────

def test_nearest_band_exact():
    assert _nearest_band(100.0, TESSERA_FREQS) == 1

def test_nearest_band_log_proximity():
    # 80 Hz is closer to 100 Hz than to 30 Hz in log space
    assert _nearest_band(80.0, TESSERA_FREQS) == 1

def test_nearest_band_high_freq():
    assert _nearest_band(16000.0, TESSERA_FREQS) == 7


# ── _interpolate_gain ──────────────────────────────────────────────────────────

def test_interpolate_below_range():
    gains = [2.0, 1.0, 0.0]
    freqs = [100.0, 1000.0, 10000.0]
    assert _interpolate_gain(10.0, freqs, gains) == pytest.approx(2.0)

def test_interpolate_above_range():
    gains = [2.0, 1.0, 0.0]
    freqs = [100.0, 1000.0, 10000.0]
    assert _interpolate_gain(20000.0, freqs, gains) == pytest.approx(0.0)

def test_interpolate_midpoint():
    # At the geometric mean of 100 and 1000 (≈316 Hz), gain should be ~1.5
    freqs = [100.0, 1000.0]
    gains = [2.0, 1.0]
    result = _interpolate_gain(316.0, freqs, gains)
    assert 1.4 < result < 1.6


# ── _clamp_band ────────────────────────────────────────────────────────────────

def test_clamp_gain_upper():
    band = _clamp_band(1000.0, 99.0, 1.0, BAND_TYPE_PEAK)
    assert band.gain == pytest.approx(PARAM_RANGES["gain"][1])

def test_clamp_gain_lower():
    band = _clamp_band(1000.0, -99.0, 1.0, BAND_TYPE_PEAK)
    assert band.gain == pytest.approx(PARAM_RANGES["gain"][0])

def test_clamp_q_lower():
    band = _clamp_band(1000.0, 0.0, 0.001, BAND_TYPE_PEAK)
    assert band.q >= PARAM_RANGES["q"][0]

def test_clamp_freq_lower():
    band = _clamp_band(1.0, 0.0, 1.0, BAND_TYPE_PEAK)
    assert band.frequency >= PARAM_RANGES["frequency"][0]


# ── _socialfx_to_tessera ───────────────────────────────────────────────────────

def _make_flat_socialfx_entry(gain_val: float = 3.0) -> EQDescriptorEntry:
    gains = [gain_val] * 6
    qs    = [1.0] * 6
    return _socialfx_to_tessera("test", _SOCIALFX_DEFAULT_FREQS, gains, qs, 0.8, 10)

def test_socialfx_to_tessera_band_count():
    entry = _make_flat_socialfx_entry()
    assert len(entry.bands) == 8

def test_socialfx_to_tessera_all_in_range():
    entry = _make_flat_socialfx_entry(20.0)  # extreme gain
    gr = PARAM_RANGES["gain"]
    for band in entry.bands:
        assert gr[0] <= band.gain <= gr[1]

def test_socialfx_to_tessera_band_types():
    entry = _make_flat_socialfx_entry()
    assert entry.bands[0].type == BAND_TYPE_LOW_SHELF
    assert entry.bands[7].type == BAND_TYPE_HIGH_SHELF
    for i in range(1, 7):
        assert entry.bands[i].type == BAND_TYPE_PEAK


# ── augment_with_synonyms ──────────────────────────────────────────────────────

def _make_entry(descriptor: str, gain: float = 2.0) -> EQDescriptorEntry:
    bands = [
        EQBandSetting(frequency=b["frequency"], gain=gain, q=b["q"], type=b["type"])
        for b in DEFAULT_BANDS
    ]
    return EQDescriptorEntry(descriptor=descriptor, bands=bands,
                             source="test", confidence=0.8, participant_count=5)

def test_synonym_augmentation_adds_variants():
    entries = [_make_entry("warm")]
    augmented = augment_with_synonyms(entries)
    descriptors = {e.descriptor for e in augmented}
    # "warm" is in SYNONYM_GROUPS with "warmth", "warmer"
    assert "warmth" in descriptors or "warmer" in descriptors

def test_synonym_augmentation_no_duplicates():
    entries = [_make_entry("warm"), _make_entry("warmth")]
    augmented = augment_with_synonyms(entries)
    descs = [e.descriptor for e in augmented]
    # No two entries should share the same descriptor
    assert len(descs) == len(set(descs))


# ── deduplicate ────────────────────────────────────────────────────────────────

def test_dedup_merges_same_word():
    e1 = _make_entry("warm", gain=2.0)
    e2 = _make_entry("warm", gain=4.0)
    e2 = EQDescriptorEntry(descriptor="warm", bands=e2.bands,
                           source="socialeq", confidence=0.9, participant_count=10)
    e1 = EQDescriptorEntry(descriptor="warm", bands=e1.bands,
                           source="socialfx", confidence=0.8, participant_count=5)
    merged = deduplicate([e1, e2])
    assert sum(1 for e in merged if e.descriptor == "warm") == 1

def test_dedup_weighted_average():
    e1 = _make_entry("warm", gain=0.0)
    e2 = _make_entry("warm", gain=4.0)
    e1 = EQDescriptorEntry(descriptor="warm", bands=e1.bands,
                           source="socialfx", confidence=0.8, participant_count=1)
    e2 = EQDescriptorEntry(descriptor="warm", bands=e2.bands,
                           source="socialeq", confidence=0.9, participant_count=3)
    merged = deduplicate([e1, e2])
    warm = next(e for e in merged if e.descriptor == "warm")
    # Weighted avg: (0*1 + 4*3)/(1+3) = 3.0
    assert warm.bands[0].gain == pytest.approx(3.0, abs=0.01)

def test_dedup_preserves_unique():
    entries = [_make_entry("warm"), _make_entry("bright")]
    result = deduplicate(entries)
    assert len(result) == 2
