"""
Parametric EQ curve fitter.

Given a 31-band target frequency response (dB gains at ISO octave frequencies),
finds the optimal 8-band parametric EQ settings (frequency, gain, Q) that
best approximate it using scipy.optimize.

Filter math: Audio EQ Cookbook (Robert Bristow-Johnson) IIR biquad formulas —
the same underlying math JUCE uses for its IIR filters.
"""

from __future__ import annotations
import math
import numpy as np
from scipy.optimize import minimize  # type: ignore

from tessera_rag.config import (
    ISO_31_FREQS, ISO_31_WEIGHTS, DEFAULT_BANDS,
    BAND_FREQ_RANGES, PARAM_RANGES,
    BAND_TYPE_LOW_SHELF, BAND_TYPE_PEAK, BAND_TYPE_HIGH_SHELF,
    NUM_BANDS,
)
from tessera_rag.data.schema import EQBandSetting

# Reference sample rate for filter math (44100 Hz standard)
_FS = 44100.0
_FREQS_ARRAY = np.array(ISO_31_FREQS, dtype=np.float64)
_WEIGHTS_ARRAY = np.array(ISO_31_WEIGHTS, dtype=np.float64)

# Band types for the 8 Tessera bands (fixed)
_BAND_TYPES = [b["type"] for b in DEFAULT_BANDS]

# ── IIR biquad filter response ─────────────────────────────────────────────────

def _biquad_magnitude_db(b0: float, b1: float, b2: float,
                          a0: float, a1: float, a2: float,
                          freqs: np.ndarray, fs: float) -> np.ndarray:
    """
    Evaluate the magnitude response (in dB) of a biquad filter at each frequency.
    H(z) = (b0 + b1*z^-1 + b2*z^-2) / (a0 + a1*z^-1 + a2*z^-2)
    """
    w = 2.0 * math.pi * freqs / fs
    z_minus1 = np.exp(-1j * w)
    z_minus2 = np.exp(-2j * w)
    numerator   = b0 + b1 * z_minus1 + b2 * z_minus2
    denominator = a0 + a1 * z_minus1 + a2 * z_minus2
    H = numerator / denominator
    mag_db = 20.0 * np.log10(np.maximum(np.abs(H), 1e-10))
    return mag_db


def _peak_response(freq_hz: float, gain_db: float, q: float,
                   freqs: np.ndarray, fs: float = _FS) -> np.ndarray:
    """Peaking EQ biquad magnitude response at each frequency in freqs."""
    if abs(gain_db) < 1e-6:
        return np.zeros(len(freqs))
    A     = 10.0 ** (gain_db / 40.0)
    w0    = 2.0 * math.pi * freq_hz / fs
    alpha = math.sin(w0) / (2.0 * q)
    b0 =  1.0 + alpha * A
    b1 = -2.0 * math.cos(w0)
    b2 =  1.0 - alpha * A
    a0 =  1.0 + alpha / A
    a1 = -2.0 * math.cos(w0)
    a2 =  1.0 - alpha / A
    return _biquad_magnitude_db(b0, b1, b2, a0, a1, a2, freqs, fs)


def _lowshelf_response(freq_hz: float, gain_db: float, q: float,
                       freqs: np.ndarray, fs: float = _FS) -> np.ndarray:
    """Low shelf biquad magnitude response (shelf slope S ≈ 1/Q)."""
    if abs(gain_db) < 1e-6:
        return np.zeros(len(freqs))
    A  = 10.0 ** (gain_db / 40.0)
    w0 = 2.0 * math.pi * freq_hz / fs
    S  = max(0.1, min(10.0, q))   # reuse Q slot as shelf slope parameter
    alpha = (math.sin(w0) / 2.0) * math.sqrt((A + 1.0 / A) * (1.0 / S - 1.0) + 2.0)
    sqrtA = math.sqrt(A)
    cos_w = math.cos(w0)
    b0 =  A * ((A + 1) - (A - 1) * cos_w + 2 * sqrtA * alpha)
    b1 = 2 * A * ((A - 1) - (A + 1) * cos_w)
    b2 =  A * ((A + 1) - (A - 1) * cos_w - 2 * sqrtA * alpha)
    a0 =       (A + 1) + (A - 1) * cos_w + 2 * sqrtA * alpha
    a1 = -2 * ((A - 1) + (A + 1) * cos_w)
    a2 =       (A + 1) + (A - 1) * cos_w - 2 * sqrtA * alpha
    return _biquad_magnitude_db(b0, b1, b2, a0, a1, a2, freqs, fs)


def _highshelf_response(freq_hz: float, gain_db: float, q: float,
                        freqs: np.ndarray, fs: float = _FS) -> np.ndarray:
    """High shelf biquad magnitude response."""
    if abs(gain_db) < 1e-6:
        return np.zeros(len(freqs))
    A  = 10.0 ** (gain_db / 40.0)
    w0 = 2.0 * math.pi * freq_hz / fs
    S  = max(0.1, min(10.0, q))
    alpha = (math.sin(w0) / 2.0) * math.sqrt((A + 1.0 / A) * (1.0 / S - 1.0) + 2.0)
    sqrtA = math.sqrt(A)
    cos_w = math.cos(w0)
    b0 =  A * ((A + 1) + (A - 1) * cos_w + 2 * sqrtA * alpha)
    b1 = -2 * A * ((A - 1) + (A + 1) * cos_w)
    b2 =  A * ((A + 1) + (A - 1) * cos_w - 2 * sqrtA * alpha)
    a0 =       (A + 1) - (A - 1) * cos_w + 2 * sqrtA * alpha
    a1 =  2 * ((A - 1) - (A + 1) * cos_w)
    a2 =       (A + 1) - (A - 1) * cos_w - 2 * sqrtA * alpha
    return _biquad_magnitude_db(b0, b1, b2, a0, a1, a2, freqs, fs)


def band_response(band_type: int, freq_hz: float, gain_db: float, q: float,
                  freqs: np.ndarray) -> np.ndarray:
    """Dispatch to the correct filter response function."""
    if band_type == BAND_TYPE_LOW_SHELF:
        return _lowshelf_response(freq_hz, gain_db, q, freqs)
    elif band_type == BAND_TYPE_HIGH_SHELF:
        return _highshelf_response(freq_hz, gain_db, q, freqs)
    else:
        return _peak_response(freq_hz, gain_db, q, freqs)


def combined_response(params: np.ndarray, freqs: np.ndarray = _FREQS_ARRAY) -> np.ndarray:
    """
    Compute the combined magnitude response (dB) at each frequency.

    params layout (24 values):
      params[0:8]   = log(frequency) for each band
      params[8:16]  = gain (dB) for each band
      params[16:24] = log(Q) for each band
    """
    total = np.zeros(len(freqs))
    for i in range(NUM_BANDS):
        freq  = math.exp(params[i])
        gain  = params[8 + i]
        q     = math.exp(params[16 + i])
        total += band_response(_BAND_TYPES[i], freq, gain, q, freqs)
    return total


# ── Optimisation ───────────────────────────────────────────────────────────────

def _build_x0_and_bounds() -> tuple[np.ndarray, list[tuple]]:
    """Build initial parameter vector and bounds from Tessera defaults."""
    x0 = np.zeros(24)
    bounds = []

    for i, (band, freq_range) in enumerate(zip(DEFAULT_BANDS, BAND_FREQ_RANGES)):
        # log(frequency)
        x0[i] = math.log(band["frequency"])
        bounds.append((math.log(freq_range[0]), math.log(freq_range[1])))

    for i in range(NUM_BANDS):
        # gain (dB), start at 0
        x0[8 + i] = 0.0
        bounds.append((-24.0, 24.0))

    log_q_min, log_q_max = math.log(PARAM_RANGES["q"][0]), math.log(PARAM_RANGES["q"][1])
    for i, band in enumerate(DEFAULT_BANDS):
        # log(Q)
        x0[16 + i] = math.log(band["q"])
        bounds.append((log_q_min, log_q_max))

    return x0, bounds


def _loss(x: np.ndarray, target: np.ndarray) -> float:
    """Weighted MSE between combined response and target curve."""
    pred = combined_response(x, _FREQS_ARRAY)
    diff = pred - target
    return float(np.sum(_WEIGHTS_ARRAY * diff * diff))


def fit_curve(target_gains_db: list[float],
              max_iter: int = 1000) -> list[EQBandSetting]:
    """
    Fit an 8-band parametric EQ to the 31-band target curve.

    target_gains_db: list of 31 gain values (dB) corresponding to ISO_31_FREQS.
    Returns a list of 8 EQBandSetting objects.
    """
    target = np.array(target_gains_db, dtype=np.float64)
    x0, bounds = _build_x0_and_bounds()

    # Warm-start: for each band, set gain to the nearest target value
    for i, (band, freq_range) in enumerate(zip(DEFAULT_BANDS, BAND_FREQ_RANGES)):
        default_freq = band["frequency"]
        # Find index in ISO_31_FREQS closest to this band's default frequency
        log_f = math.log10(default_freq)
        closest_idx = min(range(len(ISO_31_FREQS)),
                          key=lambda j: abs(math.log10(ISO_31_FREQS[j]) - log_f))
        x0[8 + i] = float(np.clip(target[closest_idx], -24.0, 24.0))

    result = minimize(
        _loss,
        x0,
        args=(target,),
        method="L-BFGS-B",
        bounds=bounds,
        options={"maxiter": max_iter, "ftol": 1e-9, "gtol": 1e-7},
    )

    x_opt = result.x
    bands: list[EQBandSetting] = []
    for i, band_type in enumerate(_BAND_TYPES):
        freq  = float(np.clip(math.exp(x_opt[i]),       PARAM_RANGES["frequency"][0], PARAM_RANGES["frequency"][1]))
        gain  = float(np.clip(x_opt[8 + i],             PARAM_RANGES["gain"][0],      PARAM_RANGES["gain"][1]))
        q     = float(np.clip(math.exp(x_opt[16 + i]),  PARAM_RANGES["q"][0],         PARAM_RANGES["q"][1]))
        bands.append(EQBandSetting(frequency=round(freq, 1), gain=round(gain, 2),
                                   q=round(q, 3), type=band_type, bypass=False))

    fit_error = result.fun
    if fit_error > 50.0:
        # High error usually means the target curve is extreme — still valid output
        pass

    return bands
