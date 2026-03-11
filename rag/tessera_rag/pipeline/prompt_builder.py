"""
Builds the grounded LLM prompt.

The prompt asks the LLM to output a 31-band ISO frequency response
(the "target curve") rather than 8-band parameters directly.
The retrieved crowdsourced reference settings ground the output in
empirical human-perception data.
"""

from __future__ import annotations
from tessera_rag.config import ISO_31_FREQS, DEFAULT_BANDS, BAND_TYPE_LOW_SHELF, BAND_TYPE_HIGH_SHELF
from tessera_rag.pipeline.retriever import QueryResult


_BAND_TYPE_NAMES = {0: "LowCut", 1: "LowShelf", 2: "Peak", 3: "HighShelf", 4: "HighCut"}

_SYSTEM_PROMPT = """\
You are an expert parametric equaliser engineer with deep knowledge of psychoacoustics
and professional audio mixing. You map natural language descriptions of desired sound
characteristics to precise EQ frequency response curves.

## Tessera EQ Band Layout (for your reference)
| Band | Default Freq | Type      |
|------|-------------|-----------|
| 0    | 30 Hz       | LowShelf  |
| 1    | 100 Hz      | Peak      |
| 2    | 300 Hz      | Peak      |
| 3    | 1000 Hz     | Peak      |
| 4    | 2500 Hz     | Peak      |
| 5    | 5000 Hz     | Peak      |
| 6    | 10000 Hz    | Peak      |
| 7    | 16000 Hz    | HighShelf |

## Output Format
You MUST respond with valid JSON only — no markdown fences, no prose.
The JSON must have exactly two keys:
  "explanation": A 1–2 sentence plain-English description of what you did and why.
  "target_curve": An object with exactly 31 keys (ISO octave frequencies as strings).
                  Each value is a gain in dB (float), range: -24.0 to +24.0.

The 31 required frequency keys are (in Hz):
20, 25, 31.5, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800,
1000, 1250, 1600, 2000, 2500, 3150, 4000, 5000, 6300, 8000, 10000, 12500, 16000, 20000

Example response structure:
{
  "explanation": "Boosted low frequencies for warmth, gently reduced upper mids to soften harshness.",
  "target_curve": {
    "20": 3.0, "25": 3.2, "31.5": 3.5, "40": 3.3, "50": 3.0,
    "63": 2.5, "80": 2.0, "100": 1.5, "125": 1.0, "160": 0.5,
    "200": 0.0, "250": -0.3, "315": -0.5, "400": -0.5, "500": -0.5,
    "630": -0.5, "800": -1.0, "1000": -1.0, "1250": -1.5, "1600": -1.5,
    "2000": -2.0, "2500": -2.0, "3150": -1.5, "4000": -1.5, "5000": -1.5,
    "6300": -1.0, "8000": -1.0, "10000": -1.0, "12500": -1.5, "16000": -2.0,
    "20000": -2.0
  }
}

## Perceptual Frequency Map
Use this reference when interpreting natural language descriptors and designing curves.

| Range          | Region         | Perceptual Effect                                                       |
|----------------|----------------|-------------------------------------------------------------------------|
| 20–60 Hz       | Sub-bass       | Physical rumble, weight, chest thump. Excess causes muddiness.          |
| 60–250 Hz      | Bass           | Warmth, body, fullness. Home of kick and bass guitar fundamentals.      |
| 250–500 Hz     | Low-mids       | Boxiness, muddiness, or richness depending on instrument and amount.    |
| 500–1000 Hz    | Mids           | Body of vocals and guitars. Excess sounds hollow or honky.              |
| 1000–2000 Hz   | Upper-mids     | Presence, intelligibility of speech, nasal quality.                     |
| 2000–4000 Hz   | Presence       | Attack, bite, harshness. Critical for vocal clarity and guitar crunch.  |
| 4000–8000 Hz   | Brilliance     | Consonant definition, sibilance, cymbal shimmer, string detail.         |
| 8000–12500 Hz  | Upper treble   | Air, breathiness, sparkle. Excessive boost causes listener fatigue.     |
| 12500–20000 Hz | Extreme air    | Subtle openness and spatial cues. Most content has little energy here.  |

## Common Descriptor-to-Frequency Mappings
- "warm" / "warmth" → gentle boost 80–250 Hz, subtle cut above 4 kHz
- "bright" / "airy" → boost 8–16 kHz region, possibly cut low-mids
- "muddy" / "boxy" → cut 200–500 Hz range (typically narrow Q around 300 Hz)
- "harsh" / "sharp" → cut 2–5 kHz region (narrow Q, surgical)
- "thin" / "weak" → boost 80–250 Hz for body, possibly boost low-mids
- "punchy" / "tight" → boost attack region 2–5 kHz, tighten lows (cut sub-60 Hz)
- "full" / "fat" → broad boost 60–400 Hz, gentle presence lift
- "nasal" / "honky" → cut 800–1500 Hz (narrow Q)
- "sibilant" / "hissy" → cut 5–10 kHz (narrow Q, de-essing)
- "dark" / "muffled" → inverse of bright — cut above 4–8 kHz or boost below 250 Hz
- "crisp" / "clear" → boost 3–6 kHz for presence, cut mud at 250–400 Hz
- "presence" / "forward" → boost 2–5 kHz, slight air boost at 10–12 kHz

## Curve Design Principles
1. Prefer surgical cuts (narrow Q, 2–4 dB) to fix problems, and broad boosts (wide Q) to add character.
2. The net sum of all 31 gain values should trend toward 0 dB across the spectrum (loudness-neutral intent).
3. Make changes proportional to the intensity of the descriptor — "slightly warm" ≠ "very warm".
4. Do not apply gain beyond ±12 dB unless the descriptor is extreme (e.g. "huge bass", "remove all treble").
5. Ensure the curve is smooth across adjacent frequencies — avoid abrupt gain steps of more than 3 dB between neighbours.
6. When the user requests opposing qualities (e.g. "warm but clear"), balance the two with complementary adjustments in different frequency regions rather than cancelling them out.
7. If a negation is indicated (e.g. "not too bright"), apply a gentle inverse of the described quality rather than extreme opposite.
8. For instrument-specific requests, bias toward the frequency ranges where that instrument has its fundamental and harmonic energy.
"""


def _format_reference(result: QueryResult) -> str:
    """Format a single retrieved descriptor as a human-readable reference block."""
    e = result.entry
    lines = [
        f"Descriptor: \"{e.descriptor}\"  "
        f"(confidence={e.confidence:.2f}, n={e.participant_count}, source={e.source})",
    ]
    for i, band in enumerate(e.bands):
        t = _BAND_TYPE_NAMES.get(band.type, "?")
        lines.append(
            f"  Band {i} ({t} @ {band.frequency:.0f} Hz): "
            f"gain={band.gain:+.1f} dB, Q={band.q:.2f}"
        )
    if result.negated:
        lines.append("  [NOTE: User query implies INVERSE/reduction of this descriptor]")
    return "\n".join(lines)


def _format_audio_metrics(metrics: dict | None) -> str:
    if not metrics:
        return ""
    lines = ["## Audio Analysis of the Uploaded Track"]
    for k, v in metrics.items():
        lines.append(f"  {k}: {v}")
    lines.append(
        "Use this analysis to adapt the EQ curve appropriately "
        "(e.g., if low energy is high, be conservative with bass boosts)."
    )
    return "\n".join(lines)


def build_prompt(
    user_query: str,
    retrieved: list[QueryResult],
    audio_metrics: dict | None = None,
) -> tuple[str, str]:
    """
    Returns (system_prompt, user_prompt).
    The user_prompt contains retrieved references + audio metrics + the actual request.
    """
    ref_block = "\n\n".join(
        f"Reference {i + 1}:\n{_format_reference(r)}"
        for i, r in enumerate(retrieved)
    ) if retrieved else "(No references retrieved — use your expert knowledge.)"

    metrics_block = _format_audio_metrics(audio_metrics)

    freq_list = ", ".join(str(f) for f in ISO_31_FREQS)

    user_prompt = f"""\
## Empirically Validated Reference Settings
The following EQ settings were crowdsourced from audio professionals for descriptors
similar to the user's request. Use them as your primary reference — do not deviate
significantly without reason.

{ref_block}

{metrics_block}

## User Request
The artist wants their sound to be: "{user_query}"

## Task
Generate a 31-band frequency response curve (in dB) that achieves this.
Stay close to the reference data but adapt based on audio analysis if provided.
The curve should be smooth and musically meaningful.

Required frequency keys: {freq_list}

Respond with JSON only.
"""
    return _SYSTEM_PROMPT, user_prompt
