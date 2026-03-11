"""
Central configuration. All constants must match the C++ plugin exactly.
References: Source/DSP/EightBandEQ.h, Source/PluginProcessor.h
"""

from pathlib import Path

# ── Project paths ─────────────────────────────────────────────────────────────

RAG_DIR = Path(__file__).parent.parent
DATA_DIR = RAG_DIR / "data"
RAW_DIR = DATA_DIR / "raw"
PROCESSED_DIR = DATA_DIR / "processed"
EMBEDDINGS_DIR = DATA_DIR / "embeddings"
FAISS_DIR = DATA_DIR / "faiss_index"

PROCESSED_JSONL = PROCESSED_DIR / "eq_descriptors.jsonl"
EMBEDDINGS_NPY = EMBEDDINGS_DIR / "descriptor_embeddings.npy"
FAISS_INDEX_PATH = FAISS_DIR / "eq.index"
FAISS_METADATA_PATH = FAISS_DIR / "eq_metadata.json"

# ── Embedding model ───────────────────────────────────────────────────────────

EMBEDDING_MODEL = "all-MiniLM-L6-v2"
EMBEDDING_DIM = 384

# ── Tessera 8-Band EQ — must match EightBandEQ.h exactly ─────────────────────

NUM_BANDS = 8

# EQBandType enum values (EightBandEQ.h:12-19)
BAND_TYPE_LOW_CUT   = 0
BAND_TYPE_LOW_SHELF = 1
BAND_TYPE_PEAK      = 2
BAND_TYPE_HIGH_SHELF = 3
BAND_TYPE_HIGH_CUT  = 4

# Default band configuration (EightBandEQ.h:54-61)
DEFAULT_BANDS = [
    {"frequency": 30.0,    "gain": 0.0, "q": 0.707, "type": BAND_TYPE_LOW_SHELF,  "bypass": False},
    {"frequency": 100.0,   "gain": 0.0, "q": 1.0,   "type": BAND_TYPE_PEAK,       "bypass": False},
    {"frequency": 300.0,   "gain": 0.0, "q": 1.0,   "type": BAND_TYPE_PEAK,       "bypass": False},
    {"frequency": 1000.0,  "gain": 0.0, "q": 1.0,   "type": BAND_TYPE_PEAK,       "bypass": False},
    {"frequency": 2500.0,  "gain": 0.0, "q": 1.0,   "type": BAND_TYPE_PEAK,       "bypass": False},
    {"frequency": 5000.0,  "gain": 0.0, "q": 1.0,   "type": BAND_TYPE_PEAK,       "bypass": False},
    {"frequency": 10000.0, "gain": 0.0, "q": 1.0,   "type": BAND_TYPE_PEAK,       "bypass": False},
    {"frequency": 16000.0, "gain": 0.0, "q": 0.707, "type": BAND_TYPE_HIGH_SHELF, "bypass": False},
]

# Parameter ranges (Source/PluginProcessor.h APVTS ranges)
PARAM_RANGES = {
    "frequency": (20.0, 20000.0),
    "gain":      (-24.0, 24.0),
    "q":         (0.1, 10.0),
    "type":      (0, 4),
}

# Per-band frequency search ranges for curve fitting
BAND_FREQ_RANGES = [
    (20.0,   120.0),   # Band 0: LowShelf
    (60.0,   200.0),   # Band 1: Peak
    (180.0,  600.0),   # Band 2: Peak
    (600.0,  2000.0),  # Band 3: Peak
    (1500.0, 5000.0),  # Band 4: Peak
    (3000.0, 10000.0), # Band 5: Peak
    (6000.0, 16000.0), # Band 6: Peak
    (8000.0, 20000.0), # Band 7: HighShelf
]

# ── 31-band ISO standard frequencies ─────────────────────────────────────────

ISO_31_FREQS = [
    20, 25, 31.5, 40, 50, 63, 80, 100, 125, 160,
    200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600,
    2000, 2500, 3150, 4000, 5000, 6300, 8000, 10000, 12500, 16000, 20000,
]

# Perceptual weights for curve fitting loss (higher = more important)
# Emphasise speech intelligibility region (1 kHz – 5 kHz)
import math as _math
ISO_31_WEIGHTS = [
    1.0 + 2.0 * _math.exp(-(((_math.log10(f) - _math.log10(2500)) ** 2) / (2 * 0.4 ** 2)))
    for f in ISO_31_FREQS
]

# ── RAG / retrieval ───────────────────────────────────────────────────────────

FAST_PATH_THRESHOLD    = 0.95   # Skip LLM if top-1 similarity exceeds this
CACHE_LOOKUP_THRESHOLD = 0.82   # Semantic cache hit threshold (below fast path)
DEFAULT_K = 5                   # Default number of retrieved references
LLM_TEMPERATURE = 0.3
LLM_MODEL   = "gpt-4o"         # Full model — used for genuinely novel queries (score < 0.82)
CHEAP_MODEL = "gpt-4o-mini"    # Cheap model — for moderate-confidence cache misses (0.82–0.95)

# ── Semantic cache ────────────────────────────────────────────────────────────

SEMANTIC_CACHE_PATH = Path.home() / ".tessera" / "semantic_cache.db"
MAX_CACHE_SIZE      = 10_000   # Max entries before LRU eviction

# ── FastAPI ───────────────────────────────────────────────────────────────────

API_HOST = "127.0.0.1"
API_PORT = 8420

# ── Dataset synonyms (augment vocabulary before embedding) ────────────────────

SYNONYM_GROUPS = [
    ["warm", "warmth", "warmer"],
    ["bright", "brightness", "brighter", "airy", "sparkly"],
    ["dark", "darkness", "darker", "dull", "muffled"],
    ["muddy", "muddiness", "murky", "boomy", "boxy"],
    ["thin", "thinness", "hollow", "weak"],
    ["harsh", "harshness", "sharp", "aggressive"],
    ["crisp", "crispness", "clear", "clarity"],
    ["smooth", "smoothness", "silky", "soft"],
    ["punchy", "punch", "tight", "impact"],
    ["nasal", "nasality", "honky", "midrange"],
    ["sibilant", "sibilance", "hissy", "lisping"],
    ["presence", "forward", "in-your-face", "close"],
    ["airy", "open", "spacious", "breathy"],
    ["full", "fullness", "fat", "thick"],
    ["tinny", "tinny", "metallic"],
]
