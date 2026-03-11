"""
Unit tests for the pipeline components: curve_fitter, prompt_builder, and rag orchestrator.
Run with: pytest tests/test_pipeline.py -v
"""

import math
import pytest
import numpy as np

from tessera_rag.config import (
    ISO_31_FREQS, DEFAULT_BANDS, PARAM_RANGES,
    BAND_TYPE_PEAK, BAND_TYPE_LOW_SHELF, BAND_TYPE_HIGH_SHELF,
)
from tessera_rag.data.schema import EQBandSetting, EQDescriptorEntry, TargetCurve
from tessera_rag.pipeline.curve_fitter import (
    _peak_response, _lowshelf_response, _highshelf_response,
    band_response, combined_response, fit_curve,
)
from tessera_rag.pipeline.prompt_builder import build_prompt
from tessera_rag.pipeline.retriever import QueryResult


# ─────────────────────────────────────────────────────────────────────────────
# Curve fitter — filter math
# ─────────────────────────────────────────────────────────────────────────────

FREQS = np.array(ISO_31_FREQS, dtype=np.float64)


class TestFilterMath:
    def test_peak_zero_gain_is_flat(self):
        resp = _peak_response(1000.0, 0.0, 1.0, FREQS)
        assert np.allclose(resp, 0.0, atol=1e-6)

    def test_lowshelf_zero_gain_is_flat(self):
        resp = _lowshelf_response(30.0, 0.0, 0.707, FREQS)
        assert np.allclose(resp, 0.0, atol=1e-6)

    def test_highshelf_zero_gain_is_flat(self):
        resp = _highshelf_response(16000.0, 0.0, 0.707, FREQS)
        assert np.allclose(resp, 0.0, atol=1e-6)

    def test_peak_boost_at_centre(self):
        """A +6 dB peak at 1 kHz should have max gain near 1 kHz."""
        resp = _peak_response(1000.0, 6.0, 1.0, FREQS)
        idx_1k = ISO_31_FREQS.index(1000)
        assert resp[idx_1k] == pytest.approx(6.0, abs=0.5)

    def test_peak_cut_at_centre(self):
        resp = _peak_response(1000.0, -6.0, 1.0, FREQS)
        idx_1k = ISO_31_FREQS.index(1000)
        assert resp[idx_1k] == pytest.approx(-6.0, abs=0.5)

    def test_lowshelf_boost_below_corner(self):
        """Low shelf +6 dB at 100 Hz: gain should be ~+6 dB well below corner."""
        resp = _lowshelf_response(100.0, 6.0, 0.707, FREQS)
        idx_20 = ISO_31_FREQS.index(20)
        assert resp[idx_20] > 4.0

    def test_lowshelf_flat_well_above_corner(self):
        """Low shelf +6 dB at 100 Hz: gain should be ~0 dB well above corner."""
        resp = _lowshelf_response(100.0, 6.0, 0.707, FREQS)
        idx_10k = ISO_31_FREQS.index(10000)
        assert abs(resp[idx_10k]) < 1.0

    def test_highshelf_boost_above_corner(self):
        """High shelf +6 dB at 8 kHz: gain should be ~+6 dB at 16 kHz."""
        resp = _highshelf_response(8000.0, 6.0, 0.707, FREQS)
        idx_16k = ISO_31_FREQS.index(16000)
        assert resp[idx_16k] > 4.0

    def test_combined_response_sums_bands(self):
        """Combined response with all-zero gains should be ~0 everywhere."""
        params = np.zeros(24)
        for i, b in enumerate(DEFAULT_BANDS):
            params[i]      = math.log(b["frequency"])
            params[16 + i] = math.log(b["q"])
            # gains already 0
        resp = combined_response(params, FREQS)
        assert np.allclose(resp, 0.0, atol=1e-5)


# ─────────────────────────────────────────────────────────────────────────────
# Curve fitter — optimisation
# ─────────────────────────────────────────────────────────────────────────────

class TestCurveFitter:
    def test_fit_returns_8_bands(self):
        target = [0.0] * len(ISO_31_FREQS)
        bands = fit_curve(target)
        assert len(bands) == 8

    def test_fit_all_in_range(self):
        # Non-trivial target with some boosts/cuts
        target = [3.0 if f < 400 else -2.0 for f in ISO_31_FREQS]
        bands = fit_curve(target)
        for band in bands:
            assert PARAM_RANGES["gain"][0] <= band.gain <= PARAM_RANGES["gain"][1]
            assert PARAM_RANGES["q"][0]    <= band.q   <= PARAM_RANGES["q"][1]
            assert PARAM_RANGES["frequency"][0] <= band.frequency <= PARAM_RANGES["frequency"][1]

    def test_fit_band_types_fixed(self):
        target = [0.0] * len(ISO_31_FREQS)
        bands = fit_curve(target)
        assert bands[0].type == BAND_TYPE_LOW_SHELF
        assert bands[7].type == BAND_TYPE_HIGH_SHELF
        for i in range(1, 7):
            assert bands[i].type == BAND_TYPE_PEAK

    def test_fit_flat_target_near_zero(self):
        """For a flat (all-zero) target, all gains should be near zero."""
        target = [0.0] * len(ISO_31_FREQS)
        bands = fit_curve(target)
        for band in bands:
            assert abs(band.gain) < 2.0   # allow small residual

    def test_fit_warm_shape(self):
        """A warm target (lows boosted, highs cut) should yield positive low gains."""
        target = [4.0 if f <= 200 else (-2.0 if f >= 5000 else 0.0) for f in ISO_31_FREQS]
        bands = fit_curve(target)
        # Band 0 (LowShelf) gain should be positive
        assert bands[0].gain > 0.0

    def test_fit_bright_shape(self):
        """A bright target (highs boosted) should yield positive high band gains."""
        target = [-2.0 if f <= 200 else (4.0 if f >= 5000 else 0.0) for f in ISO_31_FREQS]
        bands = fit_curve(target)
        # Band 7 (HighShelf) or band 6 gain should be positive
        assert bands[7].gain > 0.0 or bands[6].gain > 0.0


# ─────────────────────────────────────────────────────────────────────────────
# Prompt builder
# ─────────────────────────────────────────────────────────────────────────────

def _make_result(descriptor: str, score: float = 0.85, negated: bool = False) -> QueryResult:
    bands = [
        EQBandSetting(frequency=b["frequency"], gain=1.0, q=b["q"], type=b["type"])
        for b in DEFAULT_BANDS
    ]
    entry = EQDescriptorEntry(descriptor=descriptor, bands=bands,
                              source="test", confidence=0.8, participant_count=10)
    return QueryResult(entry=entry, score=score, negated=negated)


class TestPromptBuilder:
    def test_returns_two_strings(self):
        sys_p, user_p = build_prompt("warm", [_make_result("warm")])
        assert isinstance(sys_p, str) and isinstance(user_p, str)

    def test_system_prompt_mentions_31_bands(self):
        sys_p, _ = build_prompt("warm", [])
        assert "31" in sys_p

    def test_user_prompt_contains_query(self):
        _, user_p = build_prompt("warm and airy", [_make_result("warm")])
        assert "warm and airy" in user_p

    def test_user_prompt_contains_descriptor(self):
        _, user_p = build_prompt("warm", [_make_result("warm")])
        assert "warm" in user_p

    def test_negated_reference_flagged(self):
        _, user_p = build_prompt("not too bright", [_make_result("bright", negated=True)])
        assert "INVERSE" in user_p or "negat" in user_p.lower() or "NEGATED" in user_p

    def test_audio_metrics_included(self):
        metrics = {"rms_db": -18.0, "spectral_centroid": 3500.0}
        _, user_p = build_prompt("warm", [_make_result("warm")], audio_metrics=metrics)
        assert "rms_db" in user_p or "spectral" in user_p or "analysis" in user_p.lower()

    def test_no_references_handled(self):
        sys_p, user_p = build_prompt("warm", [])
        # Should not crash with empty references
        assert "warm" in user_p

    def test_all_31_iso_freqs_listed(self):
        sys_p, _ = build_prompt("warm", [])
        # The system prompt must list all ISO frequencies for the LLM
        assert "20000" in sys_p


# ─────────────────────────────────────────────────────────────────────────────
# EQSuggestion schema
# ─────────────────────────────────────────────────────────────────────────────

class TestEQSuggestion:
    def _make_suggestion(self):
        from tessera_rag.data.schema import EQSuggestion
        bands = [
            EQBandSetting(frequency=b["frequency"], gain=1.0, q=b["q"], type=b["type"])
            for b in DEFAULT_BANDS
        ]
        return EQSuggestion(explanation="Test", eq=bands)

    def test_to_plugin_dict_has_eq_key(self):
        s = self._make_suggestion()
        d = s.to_plugin_dict()
        assert "eq" in d
        assert "explanation" in d

    def test_to_plugin_dict_has_8_bands(self):
        s = self._make_suggestion()
        d = s.to_plugin_dict()
        assert len(d["eq"]) == 8

    def test_to_plugin_dict_band_fields(self):
        s = self._make_suggestion()
        d = s.to_plugin_dict()
        for band in d["eq"]:
            assert "frequency" in band
            assert "gain" in band
            assert "q" in band
            assert "type" in band
