import React, { useState } from 'react';
import Logogram from './Logogram';

// ─── Feature Data ────────────────────────────────────────────────────────────

const FEATURES = [
  {
    id: 'eq-engine',
    category: 'Core Engine',
    accent: 'teal',
    title: '8-Band Parametric EQ',
    tagline: 'The foundation. Built without compromise.',
    description:
      'A fully parametric 8-band equalizer covering the full audible spectrum — from sub-bass shelf to air frequencies. Every band is individually addressable: frequency, gain, Q, filter type, and bypass.',
    specs: [
      'Band 0 — Low Shelf @ 30 Hz',
      'Bands 1–6 — Peak Filters (100 Hz → 10 kHz)',
      'Band 7 — High Shelf @ 16 kHz',
      'Filter types: Low Cut, Low Shelf, Peak, High Shelf, High Cut',
      'Per-band bypass — isolate or A/B any band instantly',
      'Input & Output gain with smooth 5ms ramps (no zipper noise)',
    ],
    visual: 'eq-bands',
  },
  {
    id: 'ai-suggest',
    category: 'AI Intelligence',
    accent: 'orange',
    title: 'Natural Language AI Suggestions',
    tagline: 'Say what you want. Get an EQ curve back.',
    description:
      'Type a goal in plain language — "warmer low end", "cut the harshness around 3k", "more air and presence". Tessera EQ captures 8 seconds of your audio, runs a full spectral analysis, and returns precise EQ parameters in seconds.',
    specs: [
      '"Capture" — 8-second audio recording for analysis',
      'Spectral analysis: RMS, peak, crest factor, centroid, band energy, ZCR',
      'RAG-powered AI — retrieves from curated mixing knowledge',
      'Returns: frequency, gain, Q, type for all 8 bands',
      'Human-readable explanation alongside every suggestion',
      'One-click apply — or tweak manually. You stay in control.',
    ],
    visual: 'ai-prompt',
  },
  {
    id: 'dynamic-eq',
    category: 'Dynamic EQ',
    accent: 'teal',
    title: 'Pre-Scan & Time-Varying EQ',
    tagline: 'An EQ that evolves with your music.',
    description:
      'Unlike static EQ suggestions, Tessera EQ can pre-scan your full track — segmenting it into time windows, extracting per-segment audio metrics, and generating a complete set of EQ keyframes that smoothly interpolate across the timeline.',
    specs: [
      'Pre-Scan mode: up to 120 seconds of audio analysis',
      'Automatic segment detection — adapts to track structure',
      'Per-segment spectral features sent to the AI',
      'Keyframe-based automation engine (buffer-aligned interpolation)',
      'Dynamic mode toggle — switch between static and evolving EQ',
      'Works within your DAW timeline, no export needed',
    ],
    visual: 'keyframes',
  },
  {
    id: 'spectrum',
    category: 'Visualization',
    accent: 'orange',
    title: 'Real-Time Spectrum Analyzer',
    tagline: 'See exactly what you\'re shaping.',
    description:
      'A live 2048-point FFT spectrum analyzer runs continuously alongside the EQ curve overlay. Watch frequency content change in real time as you adjust bands or apply AI suggestions. Input and output metering keeps levels in check.',
    specs: [
      '2048-point FFT (50% overlap, Hann window)',
      'Non-blocking — polled at ~30 Hz, never stalls the audio thread',
      'EQ frequency-response curve overlaid on the spectrum',
      'Input & Output level meters (thread-safe atomic reads)',
      'Logarithmic frequency axis — matches human perception',
    ],
    visual: 'spectrum',
  },
  {
    id: 'learning',
    category: 'Learning Engine',
    accent: 'teal',
    title: 'AI That Learns From You',
    tagline: 'Every adjustment makes the next suggestion better.',
    description:
      'After applying an AI suggestion, the Learning Engine watches how you tweak the bands. When you\'re done, it computes the delta between what the AI suggested and what you actually wanted — and submits it to improve future responses. Everything stays local.',
    specs: [
      'Tracks AI suggestion vs. your final EQ adjustments',
      'Computes per-band delta (Δfreq, Δgain, ΔQ)',
      'POST /eq/learn — writes to local SQLite via WAL mode',
      'Offline resilience — pending adjustments saved to .jsonl, flushed on next run',
      'Per-user ID support — works across concurrent plugin instances',
      'Opt-in / opt-out toggle in settings',
    ],
    visual: 'learning',
  },
  {
    id: 'standalone',
    category: 'Standalone & Compatibility',
    accent: 'orange',
    title: 'Standalone Mode & File Playback',
    tagline: 'Your EQ. Everywhere.',
    description:
      'Tessera EQ runs as a standalone application — no DAW required. Load an audio file, apply your EQ, and listen back. Full transport controls with scrubbing support. When you\'re ready, run it as a plugin in any VST3 or AU host.',
    specs: [
      'Standalone app — load and play audio without a DAW',
      'File format support: WAV, AIFF, FLAC, MP3, OGG',
      'Playback transport: play, stop, toggle, position scrub',
      'Plugin formats: VST3, Audio Unit (AU)',
      'macOS & Windows support',
      'Local RAG AI — no cloud dependency, no API key needed',
    ],
    visual: 'standalone',
  },
];

// ─── Accent helpers ───────────────────────────────────────────────────────────

const accentClass = {
  teal: {
    text: 'text-tessera-teal',
    border: 'border-tessera-teal/20',
    bg: 'bg-tessera-teal/5',
    tag: 'bg-tessera-teal/10 text-tessera-teal border-tessera-teal/20',
    dot: 'bg-tessera-teal',
    glow: 'shadow-tessera-teal/10',
    line: 'via-tessera-teal/40',
  },
  orange: {
    text: 'text-tessera-orange',
    border: 'border-tessera-orange/20',
    bg: 'bg-tessera-orange/5',
    tag: 'bg-tessera-orange/10 text-tessera-orange border-tessera-orange/20',
    dot: 'bg-tessera-orange',
    glow: 'shadow-tessera-orange/10',
    line: 'via-tessera-orange/40',
  },
};

// ─── Feature Visual Illustrators ─────────────────────────────────────────────

const EQBandsViz = () => (
  <svg viewBox="0 0 320 140" className="w-full h-32 opacity-70">
    {[0,1,2,3,4,5,6,7].map(i => {
      const heights = [55, 40, 70, 50, 60, 80, 45, 35];
      const h = heights[i];
      const x = 20 + i * 36;
      return (
        <g key={i}>
          <rect x={x} y={130 - h} width="22" height={h} rx="3"
            fill="rgba(77,124,138,0.15)" stroke="rgba(77,124,138,0.3)" strokeWidth="1"/>
          <rect x={x} y={130 - h} width="22" height="3" rx="1" fill="#4d7c8a"/>
        </g>
      );
    })}
    <line x1="10" y1="70" x2="310" y2="70" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="3 4"/>
  </svg>
);

const AiPromptViz = () => (
  <div className="w-full space-y-3 py-2">
    <div className="glass-card rounded-xl px-4 py-3 border border-white/5 flex items-center gap-3">
      <div className="w-2 h-2 rounded-full bg-tessera-orange animate-pulse"></div>
      <span className="font-mono text-xs text-gray-400">"warmer low end, cut the harshness at 3k"</span>
    </div>
    <div className="flex justify-center">
      <div className="w-[1px] h-6 bg-gradient-to-b from-tessera-orange/50 to-transparent"></div>
    </div>
    <div className="glass-card rounded-xl px-4 py-3 border border-tessera-orange/10 bg-tessera-orange/5">
      <div className="font-mono text-xs text-tessera-orange mb-2 tracking-widest">AI SUGGESTION</div>
      <div className="grid grid-cols-4 gap-2">
        {['100Hz +3dB', '300Hz -1dB', '3kHz -4dB', '10kHz +2dB'].map(s => (
          <div key={s} className="text-center">
            <div className="font-mono text-[9px] text-gray-400">{s}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const KeyframesViz = () => (
  <svg viewBox="0 0 320 100" className="w-full h-24 opacity-80">
    <defs>
      <linearGradient id="kfGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#4d7c8a" stopOpacity="0.6"/>
        <stop offset="100%" stopColor="#4d7c8a" stopOpacity="0.1"/>
      </linearGradient>
    </defs>
    {/* Timeline base */}
    <line x1="20" y1="70" x2="300" y2="70" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
    {/* Curve */}
    <path d="M 20,60 C 60,55 80,45 120,50 C 155,55 165,65 200,48 C 235,32 265,38 300,42"
      fill="none" stroke="#4d7c8a" strokeWidth="2"/>
    {/* Keyframe diamonds */}
    {[[20,60],[80,45],[140,52],[200,48],[260,36],[300,42]].map(([x,y],i) => (
      <g key={i} transform={`translate(${x},${y})`}>
        <rect x="-5" y="-5" width="10" height="10" rx="1" fill="#050505" stroke="#4d7c8a" strokeWidth="1.5" transform="rotate(45)"/>
      </g>
    ))}
    {/* Time labels */}
    {['0s','8s','16s','24s','32s','40s'].map((t, i) => {
      const xs = [20,80,140,200,260,300];
      return <text key={i} x={xs[i]} y="90" textAnchor="middle" fill="rgba(107,114,128,0.5)" fontSize="8" fontFamily="'JetBrains Mono',monospace">{t}</text>;
    })}
  </svg>
);

const SpectrumViz = () => (
  <svg viewBox="0 0 320 100" className="w-full h-24 opacity-80">
    {Array.from({length: 48}, (_, i) => {
      const h = Math.max(4, Math.sin(i * 0.4) * 25 + Math.random() * 30 + 15);
      return (
        <rect key={i} x={8 + i * 6.3} y={95 - h} width="4.5" height={h} rx="1"
          fill={`rgba(255,95,31,${0.3 + (h/60) * 0.5})`}/>
      );
    })}
    {/* EQ overlay line */}
    <path d="M 8,65 C 40,60 80,50 130,52 C 165,54 190,60 230,50 C 265,41 295,38 312,38"
      fill="none" stroke="rgba(77,124,138,0.7)" strokeWidth="1.5" strokeDasharray="3 2"/>
  </svg>
);

const LearningViz = () => (
  <div className="w-full flex items-center justify-center gap-8 py-4">
    <div className="text-center">
      <div className="font-mono text-xs text-tessera-dim mb-2 tracking-widest">AI SUGGESTED</div>
      <div className="space-y-1">
        {['+3.0', '-1.5', '+2.0'].map((v, i) => (
          <div key={i} className="font-mono text-xs text-gray-500 glass-card px-3 py-1 rounded border border-white/5">{v} dB</div>
        ))}
      </div>
    </div>
    <div className="flex flex-col items-center gap-1">
      <div className="w-12 h-[1px] bg-gradient-to-r from-tessera-teal to-tessera-orange"></div>
      <div className="font-mono text-[9px] text-tessera-dim">DELTA</div>
    </div>
    <div className="text-center">
      <div className="font-mono text-xs text-tessera-teal mb-2 tracking-widest">YOU ADJUSTED</div>
      <div className="space-y-1">
        {['+2.0', '-2.5', '+3.5'].map((v, i) => (
          <div key={i} className="font-mono text-xs text-tessera-teal glass-card px-3 py-1 rounded border border-tessera-teal/10">{v} dB</div>
        ))}
      </div>
    </div>
  </div>
);

const StandaloneViz = () => (
  <div className="w-full space-y-2 py-2">
    <div className="glass-card rounded-xl px-4 py-3 border border-white/5 flex items-center gap-3">
      <div className="font-mono text-xs text-tessera-dim">FILE</div>
      <div className="flex-1 font-mono text-xs text-gray-300 truncate">my_mix_stem.wav</div>
      <div className="font-mono text-xs text-tessera-orange">WAV</div>
    </div>
    <div className="glass-card rounded-xl px-4 py-3 border border-white/5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button className="w-6 h-6 rounded-full border border-tessera-orange/40 flex items-center justify-center">
          <div className="w-0 h-0 border-t-[4px] border-b-[4px] border-l-[6px] border-transparent border-l-tessera-orange ml-0.5"></div>
        </button>
        <div className="w-32 h-1 bg-white/10 rounded-full">
          <div className="w-2/5 h-full bg-tessera-orange rounded-full"></div>
        </div>
      </div>
      <div className="font-mono text-xs text-tessera-dim">VST3 · AU</div>
    </div>
  </div>
);

const visuals = {
  'eq-bands': <EQBandsViz />,
  'ai-prompt': <AiPromptViz />,
  'keyframes': <KeyframesViz />,
  'spectrum': <SpectrumViz />,
  'learning': <LearningViz />,
  'standalone': <StandaloneViz />,
};

// ─── Feature Card ─────────────────────────────────────────────────────────────

const FeatureCard = ({ feature, isExpanded, onToggle }) => {
  const a = accentClass[feature.accent];

  return (
    <div
      className={`glass-card rounded-3xl border transition-all duration-500 overflow-hidden cursor-pointer group
        ${isExpanded ? `${a.border} ${a.bg}` : 'border-white/5 hover:border-white/10'}`}
      onClick={onToggle}
    >
      {/* Card Header */}
      <div className="p-8">
        <div className="flex items-start justify-between mb-6">
          <span className={`font-mono text-xs tracking-[0.2em] px-3 py-1 rounded-full border ${a.tag}`}>
            {feature.category.toUpperCase()}
          </span>
          <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-transform duration-300 ${a.border} ${isExpanded ? 'rotate-45' : ''}`}>
            <span className={`text-xs leading-none ${a.text}`}>+</span>
          </div>
        </div>

        <h3 className={`text-2xl md:text-3xl font-display font-light mb-3 tracking-tight transition-colors
          ${isExpanded ? a.text : 'text-white group-hover:text-gray-200'}`}>
          {feature.title}
        </h3>
        <p className="text-tessera-dim font-light italic text-sm">{feature.tagline}</p>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-8 pb-8 animate-fade-in">
          {/* Visual illustration */}
          <div className="mb-6 glass-card rounded-2xl border border-white/5 p-4 bg-black/20">
            {visuals[feature.visual]}
          </div>

          <p className="text-gray-400 leading-relaxed mb-8 text-base">
            {feature.description}
          </p>

          <div className="space-y-3">
            <div className={`font-mono text-xs tracking-widest mb-4 ${a.text}`}>SPECS & DETAILS</div>
            {feature.specs.map((spec, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${a.dot}`}></div>
                <span className="text-sm text-gray-400 leading-relaxed">{spec}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const EQFeaturesPage = ({ onBack }) => {
  const [expanded, setExpanded] = useState('ai-suggest');

  const toggle = (id) => setExpanded(prev => prev === id ? null : id);

  return (
    <div className="min-h-screen bg-tessera-ink text-gray-300 font-sans pt-32 pb-20 px-6 animate-fade-in relative overflow-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[55%] h-[55%] bg-tessera-teal/5 rounded-full blur-[180px]"></div>
        <div className="absolute bottom-0 left-0 w-[45%] h-[45%] bg-tessera-orange/4 rounded-full blur-[180px]"></div>
        <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] bg-tessera-teal/3 rounded-full blur-[120px]"></div>
      </div>

      {/* Back Nav */}
      <nav className="fixed top-0 w-full z-50 px-6 py-6 flex justify-between items-center mix-blend-difference pointer-events-none">
        <div className="pointer-events-auto">
          <button onClick={onBack} className="flex items-center gap-2 text-tessera-dim hover:text-white transition-colors group">
            <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
            <span className="font-mono text-xs tracking-widest">BACK</span>
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto relative z-10">

        {/* Hero */}
        <div className="text-center mb-24">
          <div className="font-mono text-xs text-tessera-teal tracking-[0.3em] mb-6 uppercase">Tessera Audio — Product</div>
          <h1 className="text-6xl md:text-8xl font-display font-light text-white mb-6 tracking-tight">
            TESSERA <span className="text-tessera-teal">EQ</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 font-light max-w-2xl mx-auto leading-relaxed mb-8">
            Eight bands. Infinite intent. An equalizer that <span className="text-white">listens</span>,{' '}
            <span className="text-tessera-teal">analyzes</span>, and{' '}
            <span className="text-tessera-orange">evolves</span>.
          </p>
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-tessera-teal/50 to-transparent mx-auto"></div>
        </div>

        {/* Feature count strip */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-20">
          {[
            { num: '8', label: 'Bands' },
            { num: 'AI', label: 'Powered' },
            { num: '∞', label: 'Dynamic' },
            { num: 'FFT', label: 'Spectrum' },
            { num: '∂', label: 'Learning' },
            { num: '✦', label: 'Standalone' },
          ].map(({ num, label }) => (
            <div key={label} className="glass-card rounded-2xl border border-white/5 p-4 text-center">
              <div className="text-2xl font-display text-tessera-teal mb-1">{num}</div>
              <div className="font-mono text-xs text-tessera-dim tracking-widest">{label}</div>
            </div>
          ))}
        </div>

        {/* Feature Cards */}
        <div className="space-y-4 mb-20">
          {FEATURES.map(feature => (
            <FeatureCard
              key={feature.id}
              feature={feature}
              isExpanded={expanded === feature.id}
              onToggle={() => toggle(feature.id)}
            />
          ))}
        </div>

        {/* Philosophy tie-in */}
        <div className="glass-card p-10 md:p-16 rounded-3xl border border-tessera-teal/10 bg-gradient-to-br from-tessera-void to-tessera-ink relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-tessera-teal to-transparent opacity-40"></div>
          <div className="absolute bottom-0 right-0 opacity-10 pointer-events-none">
            <svg width="200" height="200" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="200 60" className="text-tessera-teal"/>
            </svg>
          </div>
          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <p className="font-mono text-xs text-tessera-teal tracking-widest mb-6">THE TESSERA WAY</p>
            <h3 className="text-3xl font-display font-light text-white mb-6 leading-tight">
              You shape the sound.<br/>
              <span className="text-tessera-teal">The AI clears the path.</span>
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Tessera EQ doesn't make creative decisions for you. It eliminates the technical friction
              between your ears and the result — so you stay in the flow state, not in parameter menus.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <button className="bg-tessera-teal text-black px-12 py-5 rounded-full font-mono font-bold tracking-wider hover:bg-white transition duration-500 shadow-[0_0_30px_rgba(77,124,138,0.3)]">
            GET TESSERA EQ
          </button>
        </div>

      </div>
    </div>
  );
};

export default EQFeaturesPage;
