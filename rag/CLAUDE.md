# TESSERA EQ RAG — CLAUDE.md

This file gives Claude Code the full context needed to work on this project without re-explaining from scratch.

---

## Project Identity

**TESSERA** is an AI-powered audio plugin & DAW ecosystem company.
**This folder (`rag/`)** contains the Python RAG (Retrieval-Augmented Generation) system for **TESSERA EQ** — the first standalone plugin in the roadmap.

**Founder:** Hari Prasaad S | **Est.:** 2026 | **Parent repo:** `C:\Dev\TesseraOne`

---

## Core Philosophy

### Glass Box (Not Black Box)
- AI reasons internally at **high resolution** (31-band ISO frequency curve)
- Output is always collapsed to **8 tweakable parametric EQ bands** the musician fully owns
- Every AI suggestion is a starting point — the artist accepts, rejects, or adjusts every knob
- **100% creative control stays with the artist at all times**

### Ground-Level DSP Integration
- AI does not twist GUI knobs — it operates at the mathematical root of the audio signal
- Uses IIR biquad filter coefficient math (Audio EQ Cookbook / Robert Bristow-Johnson) — the same math as JUCE
- The `curve_fitter.py` uses `scipy.optimize` (L-BFGS-B) to fit 8 parametric bands to a 31-band AI-generated target

### RAG over Hallucination
- Natural language → crowdsourced empirical mappings → grounded LLM response
- Datasets: **SocialEQ** (Northwestern, 2013) + **SocialFX** (Sony Research)
- Fast path: if retrieval similarity > 0.95, skip the LLM entirely (offline capable)

---

## Architecture Overview

```
User query ("warm", "cut the mud", "not too bright")
    ↓
[retriever.py]  → embed query (all-MiniLM-L6-v2) → FAISS cosine search → top-k matches
    ↓
[Fast path?]    → if similarity > 0.95: compute 31-band curve from dataset entry directly
    ↓ (else)
[prompt_builder.py] → grounded prompt: retrieved references + audio metrics + query
    ↓
[generator.py]  → GPT-4o (temperature=0.3) → 31-band ISO target curve (JSON)
    ↓
[curve_fitter.py] → scipy L-BFGS-B → optimal 8-band parametric EQ (freq, gain, Q)
    ↓
[rag.py]        → EQSuggestion (explanation + 8 bands)
    ↓
[server.py]     → FastAPI POST /eq/suggest → JSON matching AIBrain.h parseSuggestionJson
```

---

## Tessera 8-Band EQ Layout (must always match `EightBandEQ.h`)

| Band | Default Freq | Type      | Notes             |
|------|-------------|-----------|-------------------|
| 0    | 30 Hz       | LowShelf  | type=1            |
| 1    | 100 Hz      | Peak      | type=2            |
| 2    | 300 Hz      | Peak      | type=2            |
| 3    | 1000 Hz     | Peak      | type=2            |
| 4    | 2500 Hz     | Peak      | type=2            |
| 5    | 5000 Hz     | Peak      | type=2            |
| 6    | 10000 Hz    | Peak      | type=2            |
| 7    | 16000 Hz    | HighShelf | type=3            |

**Parameter ranges:** freq 20–20000 Hz · gain ±24 dB · Q 0.1–10.0 · type 0–4

**JSON field names** (must match `AIBrain.h:28-34`): `frequency`, `gain`, `q`, `type`, `bypass`

---

## Project Structure

```
rag/
├── CLAUDE.md                       ← you are here
├── pyproject.toml                  ← dependencies, uses uv for venv
├── .venv/                          ← Python 3.14, activate: .venv\Scripts\activate
├── tessera_rag/
│   ├── config.py                   ← ALL constants (band layout, param ranges, ISO freqs, paths)
│   ├── data/
│   │   ├── schema.py               ← Pydantic: EQBandSetting, EQDescriptorEntry, TargetCurve, EQSuggestion
│   │   ├── download.py             ← SocialFX (HuggingFace) + SocialEQ (Zenodo) download
│   │   └── preprocess.py           ← normalize 6-band/10-band → 8-band, dedup, synonym augmentation
│   ├── index/
│   │   ├── embedder.py             ← SentenceTransformer wrapper (all-MiniLM-L6-v2, 384-dim)
│   │   └── faiss_index.py          ← IndexFlatIP build/search/save/load
│   ├── pipeline/
│   │   ├── retriever.py            ← query preprocessing + FAISS → QueryResult list
│   │   ├── prompt_builder.py       ← grounded system+user prompt for GPT-4o
│   │   ├── generator.py            ← OpenAI call → TargetCurve (31-band JSON)
│   │   ├── curve_fitter.py         ← IIR filter math + scipy optimisation → 8 EQBandSettings
│   │   └── rag.py                  ← orchestrator (fast path + full pipeline)
│   └── api/
│       ├── models.py               ← FastAPI request/response models
│       └── server.py               ← POST /eq/suggest · GET /eq/search · GET /health
├── scripts/
│   ├── build_index.py              ← one-shot: download → preprocess → embed → FAISS
│   ├── interactive.py              ← REPL for manual testing
│   └── evaluate.py                 ← 30-query benchmark with domain sanity checks
├── tests/                          ← 64 tests, all passing
│   ├── test_preprocess.py
│   ├── test_retriever.py
│   └── test_pipeline.py            ← includes IIR filter math validation
└── data/                           ← gitignored generated data
    ├── raw/                        ← downloaded dataset files
    ├── processed/eq_descriptors.jsonl
    ├── embeddings/descriptor_embeddings.npy
    └── faiss_index/eq.index + eq_metadata.json
```

---

## Key Files in Parent Repo (C:\Dev\TesseraOne\Source\)

| File | Why it matters here |
|------|---------------------|
| `AI/AIBrain.h:28–34` | `EQBand` struct — exact JSON field names our API must output |
| `AI/AIBrain.h:620–631` | `parseSuggestionJson` — how C++ consumes our response |
| `AI/AIBrain.h:462–471` | Example JSON — the output format the C++ plugin expects |
| `DSP/EightBandEQ.h:12–19` | `EQBandType` enum (0=LowCut … 4=HighCut) |
| `DSP/EightBandEQ.h:51–61` | Default band config — our `config.py::DEFAULT_BANDS` mirrors this |
| `AI/AudioAnalyzer.h:35–47` | `AudioMetrics::toJsonString()` — optional input to `/eq/suggest` |

---

## Running Commands

```bash
# Python / venv
VENV=".venv/Scripts/python.exe"

# Run all tests (64 tests)
$VENV -m pytest tests/ -v

# Run a specific test file
$VENV -m pytest tests/test_pipeline.py -v

# Build FAISS index from scratch (downloads datasets ~2 min)
$VENV scripts/build_index.py

# Interactive REPL (needs OPENAI_API_KEY)
set OPENAI_API_KEY=sk-...
$VENV scripts/interactive.py

# Benchmark (30 queries with sanity checks)
$VENV scripts/evaluate.py

# Start API server on localhost:8420
$VENV -m uvicorn tessera_rag.api.server:app --host 127.0.0.1 --port 8420

# Curl test
curl -X POST http://127.0.0.1:8420/eq/suggest \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"warm\"}"
```

---

## Datasets

| Dataset | Where | Size | EQ format |
|---------|-------|------|-----------|
| **SocialEQ** | Zenodo / socialeq.org | 324 descriptors | 10-band graphic EQ @ ISO octaves |
| **SocialFX** | HuggingFace `seungheondoh/socialfx-original` | 4,297 words | 6-band parametric EQ (18 params) |

Both are normalised to Tessera's 8-band format in `preprocess.py` using log-frequency interpolation.
Synonym augmentation adds variants ("warm" → "warmth", "warmer") via `config.py::SYNONYM_GROUPS`.

---

## Important Design Decisions

1. **IIR filter math uses 44100 Hz sample rate** for the optimisation — same as JUCE default
2. **Temperature = 0.3** for the LLM (lower than the existing `AIBrain.h`'s 0.7) — RAG context grounds the output
3. **Band 0 type is always LowShelf, Band 7 always HighShelf** — enforced in `curve_fitter.py` bounds
4. **FAISS IndexFlatIP** (brute-force inner product) is used — cosine sim on normalised embeddings, fast enough for ~5K vectors
5. **Fast path threshold = 0.95** — tweak in `config.py::FAST_PATH_THRESHOLD`
6. **API port = 8420** — defined in `config.py::API_PORT`. Change there, server picks it up automatically
7. **SocialFX column detection** in `preprocess.py::_parse_socialfx_row` tries multiple column-name formats because the HuggingFace schema isn't documented — it prints the first row so you can inspect and adjust

---

## C++ Plugin Integration (Future)

The API server is a drop-in replacement for the OpenAI endpoint in `AIBrain.h`:
- Change the URL from `https://api.openai.com/...` to `http://127.0.0.1:8420/eq/suggest`
- The response JSON format is identical — `parseSuggestionJson` works unchanged
- For embedded C++ (no server): export embedding model to ONNX + link FAISS C++ directly

---

## Strategic Roadmap

1. ✅ **TESSERA EQ RAG** — this folder (Python prototype, complete)
2. 🔜 **TESSERA EQ Plugin** — extract `EightBandEQ.h` into standalone JUCE plugin, wire to this API
3. 🔜 **TESSERA REVERB** — next standalone plugin (SocialFX has reverb descriptors too)
4. 🔜 **TESSERA COMPRESSOR** — standalone
5. 🔜 **TESSERA ONE** — unified channel strip combining all modules (the original demo)

---

## Plan File

Full research notes and implementation rationale live at:
`C:\Users\TransOrg\.claude\plans\frolicking-tinkering-beacon.md`
