"""
Dataset preprocessing: normalise SocialFX and SocialEQ to Tessera's 8-band format.

Both datasets use different EQ configurations:
- SocialFX: 6-band parametric EQ (18 params: freq, gain, Q × 6)
- SocialEQ: 10-band (roughly 1-octave graphic EQ at ISO centres)

We normalise both to Tessera's fixed 8-band layout (30, 100, 300, 1k, 2.5k, 5k, 10k, 16k Hz)
by nearest-frequency mapping and gain interpolation.
"""

from __future__ import annotations
import json
import math
from pathlib import Path
from collections import defaultdict

from tessera_rag.config import (
    RAW_DIR, PROCESSED_JSONL, DEFAULT_BANDS,
    BAND_TYPE_LOW_SHELF, BAND_TYPE_PEAK, BAND_TYPE_HIGH_SHELF,
    PARAM_RANGES, SYNONYM_GROUPS,
)
from tessera_rag.data.schema import EQBandSetting, EQDescriptorEntry

# ── Tessera band centre frequencies ──────────────────────────────────────────

TESSERA_FREQS = [b["frequency"] for b in DEFAULT_BANDS]
TESSERA_TYPES = [b["type"] for b in DEFAULT_BANDS]


# ── Frequency-proximity mapping helper ───────────────────────────────────────

def _nearest_band(freq_hz: float, target_freqs: list[float]) -> int:
    """Return index of the nearest band by log-frequency distance."""
    log_f = math.log10(freq_hz)
    return min(range(len(target_freqs)),
               key=lambda i: abs(math.log10(target_freqs[i]) - log_f))


def _interpolate_gain(query_freq: float,
                      source_freqs: list[float],
                      source_gains: list[float]) -> float:
    """
    Log-frequency linear interpolation of gain at query_freq
    given a set of (freq, gain) pairs.
    """
    if not source_freqs:
        return 0.0
    log_q = math.log10(query_freq)
    log_s = [math.log10(f) for f in source_freqs]

    # Below lowest or above highest: clamp to nearest
    if log_q <= log_s[0]:
        return source_gains[0]
    if log_q >= log_s[-1]:
        return source_gains[-1]

    # Binary search for bracketing pair
    for i in range(len(log_s) - 1):
        if log_s[i] <= log_q <= log_s[i + 1]:
            t = (log_q - log_s[i]) / (log_s[i + 1] - log_s[i])
            return source_gains[i] + t * (source_gains[i + 1] - source_gains[i])
    return 0.0


def _clamp_band(freq: float, gain: float, q: float, band_type: int) -> EQBandSetting:
    fr, gr, qr = PARAM_RANGES["frequency"], PARAM_RANGES["gain"], PARAM_RANGES["q"]
    return EQBandSetting(
        frequency=max(fr[0], min(fr[1], freq)),
        gain=max(gr[0], min(gr[1], gain)),
        q=max(qr[0], min(qr[1], q)),
        type=band_type,
        bypass=False,
    )


def _default_tessera_bands() -> list[EQBandSetting]:
    return [_clamp_band(b["frequency"], 0.0, b["q"], b["type"]) for b in DEFAULT_BANDS]


# ── SocialFX parsing ──────────────────────────────────────────────────────────

# SocialFX 6-band typical centre frequencies (from paper / dataset inspection)
# These will be detected dynamically if the dataset contains explicit freq values.
_SOCIALFX_DEFAULT_FREQS = [100.0, 300.0, 1000.0, 3000.0, 6300.0, 12000.0]


def _parse_socialfx_row(row: dict) -> tuple[str, list[float], list[float], list[float]] | None:
    """
    Parse a single SocialFX row, returning (word, freqs, gains, qs).
    Handles multiple possible column-name formats discovered in the wild.
    Returns None if the row lacks EQ data or is not an EQ entry.
    """
    # Filter to EQ effect type if the dataset has mixed effects
    effect = row.get("effect", row.get("effect_type", "eq"))
    if isinstance(effect, str) and effect.lower() not in ("eq", "equalizer", "equalisation", ""):
        return None

    word = (row.get("word") or row.get("descriptor") or row.get("label") or "").strip().lower()
    if not word:
        return None

    # ── Attempt 1: flat named columns like low_gain, low_mid_gain, ... ────────
    band_names = ["low", "low_mid", "mid", "high_mid", "high", "very_high"]
    flat_gains = []
    for bn in band_names:
        g = row.get(f"{bn}_gain") or row.get(f"eq_{bn}_gain") or row.get(f"{bn}_db")
        if g is not None:
            flat_gains.append(float(g))
    if len(flat_gains) == 6:
        flat_qs = [float(row.get(f"{bn}_q", 1.0) or 1.0) for bn in band_names]
        flat_freqs = [
            float(row.get(f"{bn}_freq", row.get(f"eq_{bn}_freq", d)) or d)
            for bn, d in zip(band_names, _SOCIALFX_DEFAULT_FREQS)
        ]
        return word, flat_freqs, flat_gains, flat_qs

    # ── Attempt 2: "eq_params" key with list/dict ─────────────────────────────
    params = row.get("eq_params") or row.get("params") or row.get("parameters")
    if params is not None:
        if isinstance(params, str):
            try:
                params = json.loads(params)
            except json.JSONDecodeError:
                return None

        # List of dicts: [{"freq":…,"gain":…,"q":…}, …]
        if isinstance(params, list) and len(params) == 6:
            if isinstance(params[0], dict):
                freqs = [float(p.get("freq", p.get("frequency", d))) for p, d in zip(params, _SOCIALFX_DEFAULT_FREQS)]
                gains = [float(p.get("gain", p.get("gain_db", 0.0))) for p in params]
                qs    = [float(p.get("q", p.get("Q", 1.0))) for p in params]
                return word, freqs, gains, qs
            # Flat list of 18 values: [f0, g0, q0, f1, g1, q1, …]
            if isinstance(params[0], (int, float)) and len(params) == 18:
                freqs = [float(params[i * 3])     for i in range(6)]
                gains = [float(params[i * 3 + 1]) for i in range(6)]
                qs    = [float(params[i * 3 + 2]) for i in range(6)]
                return word, freqs, gains, qs

        # Dict keyed by band name
        if isinstance(params, dict):
            freqs, gains, qs = [], [], []
            for bn, df in zip(band_names, _SOCIALFX_DEFAULT_FREQS):
                band = params.get(bn, params.get(f"band_{bn}", {}))
                if isinstance(band, dict):
                    freqs.append(float(band.get("freq", band.get("frequency", df))))
                    gains.append(float(band.get("gain", band.get("gain_db", 0.0))))
                    qs.append(float(band.get("q", band.get("Q", 1.0))))
            if len(freqs) == 6:
                return word, freqs, gains, qs

    # ── Attempt 3: numbered band columns eq_band_0_gain … eq_band_5_gain ─────
    numbered_gains = [row.get(f"eq_band_{i}_gain") or row.get(f"band{i}_gain") for i in range(6)]
    if all(g is not None for g in numbered_gains):
        gains = [float(g) for g in numbered_gains]
        freqs = [
            float(row.get(f"eq_band_{i}_freq", row.get(f"band{i}_freq", d)) or d)
            for i, d in enumerate(_SOCIALFX_DEFAULT_FREQS)
        ]
        qs = [float(row.get(f"eq_band_{i}_q", 1.0) or 1.0) for i in range(6)]
        return word, freqs, gains, qs

    return None


def _socialfx_to_tessera(word: str, src_freqs: list[float],
                          src_gains: list[float], src_qs: list[float],
                          confidence: float, n_participants: int) -> EQDescriptorEntry:
    """Map 6-band SocialFX EQ → Tessera 8-band using log-freq interpolation."""
    bands: list[EQBandSetting] = []
    for i, (tf, band_type) in enumerate(zip(TESSERA_FREQS, TESSERA_TYPES)):
        gain = _interpolate_gain(tf, src_freqs, src_gains)
        # Q: take from nearest source band
        ni = _nearest_band(tf, src_freqs)
        q = src_qs[ni] if src_qs else 1.0
        bands.append(_clamp_band(tf, gain, q, band_type))
    return EQDescriptorEntry(
        descriptor=word,
        bands=bands,
        source="socialfx",
        confidence=confidence,
        participant_count=n_participants,
    )


def process_socialfx(raw_dir: Path = RAW_DIR / "socialfx") -> list[EQDescriptorEntry]:
    """Parse all SocialFX JSONL splits and return EQDescriptorEntry list."""
    entries: list[EQDescriptorEntry] = []
    word_accum: dict[str, list[tuple]] = defaultdict(list)  # word → [(freqs, gains, qs)]

    for jsonl_path in sorted(raw_dir.glob("*.jsonl")):
        with open(jsonl_path, encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                try:
                    row = json.loads(line)
                except json.JSONDecodeError:
                    continue
                result = _parse_socialfx_row(row)
                if result is None:
                    continue
                word, freqs, gains, qs = result
                word_accum[word].append((freqs, gains, qs))

    if not word_accum:
        print("WARNING: No EQ entries parsed from SocialFX — check column names above.")
        return []

    # Aggregate: use mean gains across all entries for the same word
    for word, samples in word_accum.items():
        n = len(samples)
        mean_freqs = [sum(s[0][i] for s in samples) / n for i in range(6)]
        mean_gains = [sum(s[1][i] for s in samples) / n for i in range(6)]
        mean_qs    = [sum(s[2][i] for s in samples) / n for i in range(6)]

        # Confidence: normalised by sqrt(n), capped at 1.0
        confidence = min(1.0, math.sqrt(n) / 10.0)
        entries.append(_socialfx_to_tessera(word, mean_freqs, mean_gains, mean_qs, confidence, n))

    print(f"SocialFX: {len(entries)} unique descriptors parsed.")
    return entries


# ── SocialEQ parsing ──────────────────────────────────────────────────────────

# Standard ISO octave-band centres used by the SocialEQ 10-band graphic EQ
_SOCIALEQ_FREQS = [31.5, 63.0, 125.0, 250.0, 500.0, 1000.0, 2000.0, 4000.0, 8000.0, 16000.0]


def process_socialeq(raw_path: Path | None) -> list[EQDescriptorEntry]:
    """Parse SocialEQ raw JSON and return EQDescriptorEntry list."""
    if raw_path is None or not raw_path.exists():
        print("SocialEQ raw file not found — skipping.")
        return []

    try:
        with open(raw_path, encoding="utf-8") as f:
            data = json.load(f)
    except Exception as e:
        print(f"WARNING: Could not load SocialEQ data: {e}")
        return []

    # Normalise to list of dicts
    if isinstance(data, dict):
        # Might be {descriptor: {gains: [...], ...}, ...} or {"data": [...]}
        if "data" in data:
            rows = data["data"]
        else:
            # Convert keyed dict to list
            rows = [{"descriptor": k, **v} if isinstance(v, dict) else {"descriptor": k, "gains": v}
                    for k, v in data.items()]
    elif isinstance(data, list):
        rows = data
    else:
        print("WARNING: Unrecognised SocialEQ data format.")
        return []

    word_accum: dict[str, list[list[float]]] = defaultdict(list)

    for row in rows:
        if not isinstance(row, dict):
            continue
        word = (row.get("word") or row.get("descriptor") or row.get("term") or "").strip().lower()
        if not word:
            continue

        # Extract 10-band gains — various possible keys
        gains = (row.get("gains") or row.get("eq_gains") or row.get("eq") or
                 row.get("parameters") or row.get("eq_params"))

        # If 40-element flat list: [freq0, gain0, q0, on0, freq1, gain1, q1, on1, …]
        if isinstance(gains, list) and len(gains) == 40:
            gains = [gains[i * 4 + 1] for i in range(10)]  # extract gains only

        # If 10-element gain list
        if isinstance(gains, list) and len(gains) == 10:
            try:
                gains = [float(g) for g in gains]
                word_accum[word].append(gains)
            except (TypeError, ValueError):
                pass

    entries: list[EQDescriptorEntry] = []
    for word, samples in word_accum.items():
        n = len(samples)
        mean_gains = [sum(s[i] for s in samples) / n for i in range(10)]
        confidence = min(1.0, math.sqrt(n) / 10.0)

        bands: list[EQBandSetting] = []
        for tf, band_type in zip(TESSERA_FREQS, TESSERA_TYPES):
            gain = _interpolate_gain(tf, _SOCIALEQ_FREQS, mean_gains)
            bands.append(_clamp_band(tf, gain, 1.0, band_type))

        entries.append(EQDescriptorEntry(
            descriptor=word,
            bands=bands,
            source="socialeq",
            confidence=confidence,
            participant_count=n,
        ))

    print(f"SocialEQ: {len(entries)} unique descriptors parsed.")
    return entries


# ── Synonym augmentation ──────────────────────────────────────────────────────

def augment_with_synonyms(entries: list[EQDescriptorEntry]) -> list[EQDescriptorEntry]:
    """
    For each synonym group, if at least one member exists in the dataset,
    create entries for the missing synonyms pointing to the same EQ settings.
    """
    existing: dict[str, EQDescriptorEntry] = {e.descriptor: e for e in entries}
    new_entries: list[EQDescriptorEntry] = []

    for group in SYNONYM_GROUPS:
        # Find any existing member of this group
        source_entry = None
        for word in group:
            if word in existing:
                source_entry = existing[word]
                break
        if source_entry is None:
            continue
        # Create augmented entries for missing synonyms
        for word in group:
            if word not in existing:
                aug = EQDescriptorEntry(
                    descriptor=word,
                    bands=list(source_entry.bands),
                    source="augmented",
                    confidence=source_entry.confidence * 0.8,
                    participant_count=source_entry.participant_count,
                )
                new_entries.append(aug)
                existing[word] = aug

    print(f"Synonym augmentation: added {len(new_entries)} entries.")
    return entries + new_entries


# ── Deduplication ─────────────────────────────────────────────────────────────

def deduplicate(entries: list[EQDescriptorEntry]) -> list[EQDescriptorEntry]:
    """
    When the same descriptor appears in both SocialFX and SocialEQ,
    keep both but merge into a weighted average (by participant_count).
    """
    grouped: dict[str, list[EQDescriptorEntry]] = defaultdict(list)
    for e in entries:
        grouped[e.descriptor].append(e)

    merged: list[EQDescriptorEntry] = []
    for word, group in grouped.items():
        if len(group) == 1:
            merged.append(group[0])
            continue
        # Weighted average of gains / Q values
        total_weight = sum(e.participant_count for e in group)
        merged_bands = []
        for band_idx in range(8):
            w_gain = sum(e.bands[band_idx].gain * e.participant_count for e in group) / total_weight
            w_q    = sum(e.bands[band_idx].q * e.participant_count for e in group) / total_weight
            ref_band = group[0].bands[band_idx]
            merged_bands.append(_clamp_band(ref_band.frequency, w_gain, w_q, ref_band.type))
        best_confidence = max(e.confidence for e in group)
        merged.append(EQDescriptorEntry(
            descriptor=word,
            bands=merged_bands,
            source="merged",
            confidence=best_confidence,
            participant_count=total_weight,
        ))

    print(f"Deduplication: {len(entries)} → {len(merged)} entries.")
    return merged


# ── Entry point ───────────────────────────────────────────────────────────────

def preprocess_all(
    socialfx_raw_dir: Path = RAW_DIR / "socialfx",
    socialeq_raw_path: Path | None = RAW_DIR / "socialeq" / "socialeq_raw.json",
    out_path: Path = PROCESSED_JSONL,
) -> list[EQDescriptorEntry]:
    out_path.parent.mkdir(parents=True, exist_ok=True)

    fx_entries = process_socialfx(socialfx_raw_dir)
    eq_entries = process_socialeq(socialeq_raw_path if (socialeq_raw_path and socialeq_raw_path.exists()) else None)

    all_entries = fx_entries + eq_entries
    if not all_entries:
        raise RuntimeError("No entries parsed from any dataset — check download output.")

    all_entries = deduplicate(all_entries)
    all_entries = augment_with_synonyms(all_entries)

    with open(out_path, "w", encoding="utf-8") as f:
        for entry in all_entries:
            f.write(json.dumps(entry.to_dict(), ensure_ascii=False) + "\n")

    print(f"\n✓ Preprocessed {len(all_entries)} total entries → {out_path}")
    return all_entries


def load_processed(path: Path = PROCESSED_JSONL) -> list[EQDescriptorEntry]:
    """Load already-processed entries from JSONL."""
    entries = []
    with open(path, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line:
                entries.append(EQDescriptorEntry.from_dict(json.loads(line)))
    return entries
