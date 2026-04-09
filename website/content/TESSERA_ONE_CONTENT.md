# Tessera One — Website Content

Content for the **Discover Plugin** and **Read Specs** sections. Integrate into modals, panels, or pages as needed.

---

## Discover Plugin

### Not a replacement. A catalyst

Tessera One is an intelligent channel strip that listens, analyzes, and suggests. It handles the mundane science of mixing so you can stay in the flow of creation.

Spending hours tweaking EQs and compressors kills creative momentum. Tessera One flips the script: you describe what you want—"warmer and punchier," "more presence," "tighter low end"—and the AI listens to your audio, analyzes it, and returns suggested settings in seconds. You keep full control: apply with one click, or ignore and tweak by hand. Either way, you stay in the zone.

### Demo Video

See Tessera One in action—how the AI listens to your audio and suggests settings in seconds.

**[VIDEO PLACEHOLDER]**

### Feature Highlights

**AI-Powered Analysis**

Capture eight seconds of your audio, type a goal like "make it warmer and punchier," and hit Analyze. Tessera One uses OpenAI GPT-4/4o or Google Gemini to return parameter suggestions tailored to your sound. Review them, apply with one click, or adjust manually. The AI is a starting point—your ears have the final say.

**8-Band Parametric EQ**

A visual frequency curve spans 20 Hz to 20 kHz with draggable nodes for each band. Low Shelf, Low Cut, Peak, High Shelf, High Cut—every band is fully configurable. Shape your tone by ear or let the AI suggest the curve.

**Dynamics Chain**

A noise gate cleans up bleed and hiss. A compressor with soft knee tames peaks and adds punch. A brick-wall limiter keeps you safe at the master bus. All three are in the chain, each bypassable, so you can build exactly the dynamics you need.

**Saturation**

Soft, Hard, Tape, and Tube modes add harmonics and character. Drive and mix controls let you dial in subtle warmth or aggressive crunch without leaving the channel strip.

**Reverb**

Hall, Room, Plate, and Small Room types with size, damping, width, wet, and pre-delay. Add space and depth in seconds.

**Your Workflow, Your Control**

AI suggestions are optional. Every parameter can be tweaked manually. Save and load states. Tessera One accelerates your workflow without replacing your judgment.

### CTA

Ready to mix faster? Try Tessera One today—or contact us at hari@tesseraaudio.com for a demo or download.

---

## Read Specs

### Plugin Format

| Platform | Formats |
|----------|---------|
| Windows | VST3, Standalone (.exe) |
| macOS | AU, VST3, Standalone |

### Signal Chain

```
Input Gain → Noise Gate → 8-Band EQ → Compressor → Saturator → Reverb → Limiter → Output Gain
```

### EQ Module

- **8 bands:** Low Shelf (30 Hz), Peak (100, 300, 1k, 2.5k, 5k, 10k Hz), High Shelf (16 kHz)
- **Per-band:** Frequency 20 Hz–20 kHz, Gain ±24 dB, Q 0.1–10
- **Types:** Low Cut, Low Shelf, Peak, High Shelf, High Cut

### Dynamics

| Module | Parameters |
|--------|------------|
| **Gate** | Threshold −80 to 0 dB, Ratio 1:1–100:1, Attack 0.1–100 ms, Release 10–1000 ms |
| **Compressor** | Threshold, Ratio, Attack, Release, Makeup, Knee (soft knee) |
| **Limiter** | Brick-wall, Ceiling, Release |

### Saturation

- **Modes:** Soft, Hard, Tape, Tube
- **Parameters:** Drive, Mix

### Reverb

- **Types:** Hall, Room, Plate, Small Room
- **Parameters:** Size, Damping, Width, Wet, Pre-delay

### AI Analysis

- **Capture:** 8 seconds of audio
- **Metrics:** RMS, Peak, Crest Factor, Spectral Centroid, Spectral Flatness, 4-band energy, Zero Crossing Rate
- **Providers:** OpenAI (GPT-4/4o), Google Gemini
- **Optional text prompt** (e.g. “warmer and punchier”) to guide suggestions

### Requirements

- **Windows:** 10/11 with WebView2 Runtime
- **macOS:** 12+ (for WKWebView)
- **AI features:** API key (OpenAI or Google)
- **Host:** VST3/AU host or Standalone app

### Tech Stack

- JUCE 8, C++23
- Native JUCE UI (C++ / juce_gui_basics)
