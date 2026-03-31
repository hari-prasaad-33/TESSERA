import React, { useState, useEffect } from 'react';
import Logogram from './Logogram';

// ─── Product Image with fallback ─────────────────────────────────────────────

const ProductImage = ({ src, alt, fallback }) => {
  const [imgError, setImgError] = useState(false);
  if (imgError || !src) return fallback;
  return (
    <div className="relative w-full h-full flex items-center justify-center p-4">
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-contain rounded-xl drop-shadow-[0_0_40px_rgba(0,0,0,0.5)]"
        onError={() => setImgError(true)}
      />
    </div>
  );
};

// ─── Animated Level Meter ─────────────────────────────────────────────────────

const LevelMeter = ({ height = 100, color = '#FF5F1F', speed = 1.5, className = '' }) => {
  const [level, setLevel] = useState(0.4);

  useEffect(() => {
    const interval = setInterval(() => {
      setLevel(0.3 + Math.random() * 0.55);
    }, 120 / speed);
    return () => clearInterval(interval);
  }, [speed]);

  return (
    <div className={`relative ${className}`} style={{ width: 6, height }}>
      <div className="absolute inset-0 rounded-full bg-white/5"></div>
      <div
        className="absolute bottom-0 left-0 right-0 rounded-full transition-all"
        style={{
          height: `${level * 100}%`,
          background: `linear-gradient(to top, ${color}, ${color}88)`,
          transitionDuration: `${100 / speed}ms`,
          boxShadow: `0 0 8px ${color}40`,
        }}
      ></div>
    </div>
  );
};

// ─── Pulse Dot ────────────────────────────────────────────────────────────────

const PulseDot = ({ color = 'bg-tessera-orange', size = 'w-2 h-2', delay = 0 }) => (
  <div
    className={`${size} rounded-full ${color} animate-pulse`}
    style={{ animationDelay: `${delay}ms`, animationDuration: '2s' }}
  ></div>
);

// ─── TESSERA ONE – Channel Strip Mockup ───────────────────────────────────────

const ChannelStripMockup = () => {
  const modules = [
    { name: 'GATE',   colorClass: 'text-tessera-teal',   glowHex: '#4d7c8a', progress: 35 },
    { name: 'EQ',     colorClass: 'text-tessera-orange', glowHex: '#FF5F1F', progress: 70 },
    { name: 'COMP',   colorClass: 'text-tessera-teal',   glowHex: '#4d7c8a', progress: 80 },
    { name: 'SAT',    colorClass: 'text-tessera-orange', glowHex: '#FF5F1F', progress: 50 },
    { name: 'REVERB', colorClass: 'text-tessera-teal',   glowHex: '#4d7c8a', progress: 60 },
    { name: 'LIMIT',  colorClass: 'text-tessera-orange', glowHex: '#FF5F1F', progress: 75 },
  ];

  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <PulseDot color="bg-tessera-orange" delay={0} />
          <span className="font-mono text-[10px] text-tessera-orange tracking-widest">TESSERA ONE</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[9px] text-tessera-dim tracking-widest">CHANNEL STRIP</span>
          <div className="w-2 h-2 rounded-sm bg-green-500/60 animate-pulse" style={{ animationDuration: '3s' }}></div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-6 gap-2">
        <div className="flex flex-col items-center gap-1 px-1">
          <LevelMeter height={90} color="#4d7c8a" speed={1.2} />
          <span className="font-mono text-[7px] text-tessera-dim mt-1">IN</span>
        </div>
        <div className="w-6 h-[1px] bg-gradient-to-r from-tessera-teal/40 to-transparent"></div>

        {modules.map((mod, i) => (
          <div key={mod.name} className="flex items-center">
            <div className="flex flex-col items-center group/mod cursor-default">
              <div className="relative transition-transform duration-300 group-hover/mod:scale-110">
                <Logogram size={64} progress={mod.progress} color={mod.colorClass} />
                <div
                  className="absolute inset-0 rounded-full opacity-0 group-hover/mod:opacity-100 transition-opacity duration-300"
                  style={{ boxShadow: `0 0 20px ${mod.glowHex}30` }}
                ></div>
              </div>
              <span className="font-mono text-[8px] text-tessera-dim mt-2 tracking-widest group-hover/mod:text-white transition-colors duration-300">
                {mod.name}
              </span>
            </div>
            {i < modules.length - 1 && (
              <div className="w-3 mx-0.5">
                <div className="h-[1px] bg-gradient-to-r from-white/10 to-white/5"></div>
              </div>
            )}
          </div>
        ))}

        <div className="w-6 h-[1px] bg-gradient-to-r from-transparent to-tessera-orange/40"></div>
        <div className="flex flex-col items-center gap-1 px-1">
          <LevelMeter height={90} color="#FF5F1F" speed={1.4} />
          <span className="font-mono text-[7px] text-tessera-dim mt-1">OUT</span>
        </div>
      </div>

      <div className="mx-3 mb-3 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black/40 border border-white/5">
        <div className="w-1.5 h-1.5 rounded-full bg-tessera-orange animate-pulse"></div>
        <span className="font-mono text-[10px] text-gray-500 flex-1">"make it warmer and punchier"</span>
        <span className="font-mono text-[9px] text-tessera-teal tracking-wider px-2 py-0.5 rounded bg-tessera-teal/10 border border-tessera-teal/20">ANALYZE</span>
      </div>
    </div>
  );
};

// ─── TESSERA EQ – Interface Mockup ────────────────────────────────────────────

const EQInterfaceMockup = () => {
  const [bars] = useState(() =>
    Array.from({ length: 64 }, (_, i) =>
      Math.max(3, Math.sin(i * 0.3) * 18 + Math.cos(i * 0.15) * 12 + 20 + Math.random() * 10)
    )
  );

  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <PulseDot color="bg-tessera-teal" delay={200} />
          <span className="font-mono text-[10px] text-tessera-teal tracking-widest">TESSERA EQ</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[9px] text-tessera-dim tracking-widest">8-BAND PARAMETRIC</span>
          <div className="w-2 h-2 rounded-sm bg-green-500/60 animate-pulse" style={{ animationDuration: '3s' }}></div>
        </div>
      </div>

      <div className="flex-1 relative mx-3 my-2 overflow-hidden">
        <div className="absolute left-0 top-2 bottom-2 flex flex-col items-center justify-center z-10">
          <LevelMeter height={70} color="#4d7c8a" speed={1.0} />
        </div>

        <svg viewBox="0 0 640 160" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          {[0, 40, 80, 120, 160].map(y => (
            <line key={y} x1="20" y1={y} x2="620" y2={y} stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
          ))}
          {[20, 120, 220, 320, 420, 520, 620].map(x => (
            <line key={x} x1={x} y1="0" x2={x} y2="160" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
          ))}

          {bars.map((h, i) => {
            const x = 24 + i * 9.2;
            const opacity = 0.15 + (h / 60) * 0.25;
            return (
              <rect key={i} x={x} y={155 - h * 1.8} width="6" height={h * 1.8}
                rx="1" fill={`rgba(77,124,138,${opacity})`} />
            );
          })}

          <defs>
            <linearGradient id="showcaseEqFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF5F1F" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#FF5F1F" stopOpacity="0" />
            </linearGradient>
          </defs>

          <path d="M 24,80 C 60,80 90,72 140,65 C 180,60 210,50 270,44 C 310,40 340,52 390,58 C 420,62 450,68 500,56 C 540,46 570,40 616,38 L 616,160 L 24,160 Z"
            fill="url(#showcaseEqFill)" />
          <path d="M 24,80 C 60,80 90,72 140,65 C 180,60 210,50 270,44 C 310,40 340,52 390,58 C 420,62 450,68 500,56 C 540,46 570,40 616,38"
            fill="none" stroke="#FF5F1F" strokeWidth="2" />

          {[[24,80],[100,68],[190,52],[290,44],[370,56],[460,62],[540,48],[616,38]].map(([x,y],i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="6" fill="#050505" stroke="#FF5F1F" strokeWidth="1.5" />
              <circle cx={x} cy={y} r="2" fill="#FF5F1F" />
            </g>
          ))}
        </svg>

        <div className="absolute right-0 top-2 bottom-2 flex flex-col items-center justify-center z-10">
          <LevelMeter height={70} color="#FF5F1F" speed={1.3} />
        </div>
      </div>

      <div className="flex justify-between px-6 pb-1">
        {['30', '100', '300', '1k', '2.5k', '5k', '10k', '16k'].map(f => (
          <span key={f} className="font-mono text-[7px] text-tessera-dim/50">{f}</span>
        ))}
      </div>

      <div className="mx-3 mb-3 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black/40 border border-white/5">
        <div className="w-1.5 h-1.5 rounded-full bg-tessera-teal animate-pulse"></div>
        <span className="font-mono text-[10px] text-gray-500 flex-1">"cut the harshness, add warmth and air"</span>
        <span className="font-mono text-[9px] text-tessera-orange tracking-wider px-2 py-0.5 rounded bg-tessera-orange/10 border border-tessera-orange/20">SUGGEST</span>
      </div>
    </div>
  );
};

// ─── Feature Pill with tooltip ────────────────────────────────────────────────

const FeatureIcon = ({ children, label, description = '', color = 'teal' }) => {
  const isOrange = color === 'orange';
  const pillBase = isOrange
    ? 'border-tessera-orange/20 bg-tessera-orange/5 hover:border-tessera-orange/40 hover:bg-tessera-orange/10'
    : 'border-tessera-teal/20 bg-tessera-teal/5 hover:border-tessera-teal/40 hover:bg-tessera-teal/10';
  const iconColor = isOrange ? 'text-tessera-orange' : 'text-tessera-teal';

  return (
    <div className={`group/pill relative flex items-center gap-2.5 px-3 py-2 rounded-full border cursor-default transition-all duration-300 ${pillBase}`}>
      <span className={`text-sm ${iconColor}`}>{children}</span>
      <span className="font-mono text-[9px] text-tessera-dim tracking-wider group-hover/pill:text-gray-300 transition-colors">
        {label}
      </span>
      {description && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg bg-tessera-void border border-white/10 font-mono text-[9px] text-tessera-text tracking-wide whitespace-nowrap opacity-0 group-hover/pill:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
          {description}
        </span>
      )}
    </div>
  );
};

// ─── Main Showcase (EQ only) ──────────────────────────────────────────────────

const ProductShowcase = ({ onNavigate }) => {
  return (
    <section id="products" className="relative z-10 py-20 px-6 max-w-6xl mx-auto">

      {/* Section Header */}
      <div className="text-center mb-16">
        <span className="section-number block mb-4">05 / THE PROOF</span>
        <h2 className="text-4xl md:text-5xl font-display font-light text-white tracking-tight mb-4">
          Tessera <span className="text-tessera-teal">EQ</span>
        </h2>
        <p className="text-gray-500 max-w-lg mx-auto text-sm leading-relaxed">
          Intelligent audio tools that automate the science of mixing — so you can stay in the art.
        </p>
        <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-tessera-teal/40 to-transparent mx-auto mt-6"></div>
      </div>

      {/* ─── TESSERA EQ Product Card ─── */}
      <div className="group glass-card rounded-3xl border border-white/5 overflow-hidden transition-all duration-700 group-hover:shadow-[0_0_80px_rgba(77,124,138,0.14)] hover:border-tessera-teal/15 hover:scale-[1.005] mb-16">
        <div className="h-[2px] bg-gradient-to-r from-transparent via-tessera-teal/50 to-transparent"></div>

        <div className="grid md:grid-cols-2 gap-0">
          {/* Mockup Side */}
          <div className="relative bg-gradient-to-br from-[#080810] to-[#05050a] min-h-[300px] md:min-h-[380px] md:border-r border-white/5 overflow-hidden">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-gradient-to-br from-tessera-teal/8 via-transparent to-tessera-teal/5"></div>
            <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-tessera-teal/5 to-transparent pointer-events-none"></div>
            <ProductImage
              src="/images/tessera-eq-gui.png"
              alt="Tessera EQ 8-Band Parametric Interface"
              fallback={<EQInterfaceMockup />}
            />
          </div>

          {/* Info Side */}
          <div className="p-8 md:p-10 flex flex-col justify-center">
            <div className="mb-4">
              <span className="inline-block font-mono text-[10px] tracking-[0.3em] px-3 py-1 rounded-full border text-tessera-teal bg-tessera-teal/10 border-tessera-teal/20">
                AVAILABLE NOW
              </span>
            </div>

            <h2
              className="text-4xl md:text-5xl font-display font-light text-white mb-2 tracking-tight uppercase"
              style={{ textShadow: '0 0 30px rgba(77,124,138,0.15)' }}
            >
              TESSERA <span className="text-tessera-teal">EQ</span>
            </h2>

            <p className="font-mono text-xs text-tessera-dim tracking-wider mb-5">
              AI-POWERED 8-BAND PARAMETRIC EQ
            </p>

            <p className="text-sm md:text-base text-gray-400 leading-relaxed mb-6">
              An 8-band parametric equalizer that understands intent. Describe your sound goal — the AI shapes
              the curve. Pre-scans your full track and generates a time-varying EQ that evolves with the music.
              Then it learns from your every adjustment.
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-3 mb-8">
              {[
                { icon: '⫘', label: '8-BAND',     description: '8 parametric bands' },
                { icon: '◇', label: 'AI',          description: 'Prompt-driven EQ' },
                { icon: '∞', label: 'DYNAMIC',     description: 'Time-varying curves' },
                { icon: '▥', label: 'FFT',         description: 'Full spectral view' },
                { icon: '∂', label: 'LEARNS',      description: 'Adapts to your taste' },
                { icon: '▶', label: 'STANDALONE',  description: 'No DAW required' },
              ].map(f => (
                <FeatureIcon key={f.label} label={f.label} description={f.description} color="teal">
                  {f.icon}
                </FeatureIcon>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate('eq-features')}
                className="px-8 py-3.5 bg-tessera-teal/25 border border-tessera-teal/60 text-tessera-teal font-mono text-sm font-bold tracking-wider rounded-full transition-all duration-300 hover:bg-tessera-teal/40 hover:border-tessera-teal hover:scale-105 hover:shadow-[0_0_40px_rgba(77,124,138,0.25)]"
              >
                EXPLORE FEATURES
              </button>
              <button className="px-8 py-3.5 border border-white/10 text-gray-400 font-mono text-sm tracking-wider rounded-full transition-all duration-300 hover:border-white/20 hover:text-white hover:scale-105">
                DOWNLOAD
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats strip — EQ focused, big numbers */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { value: '8',    label: 'Bands',       sub: 'parametric EQ' },
          { value: '786',  label: 'Descriptors', sub: 'in the local dataset' },
          { value: '<1s',  label: 'Response',    sub: 'fully offline' },
          { value: '∞',    label: 'Learning',    sub: 'adapts to you' },
        ].map(({ value, label, sub }) => (
          <div
            key={label}
            className="glass-card rounded-2xl border border-white/5 p-6 text-center group hover:border-white/10 transition-all duration-300 cursor-default hover:shadow-teal-glow"
          >
            <div className="text-5xl md:text-6xl font-display font-black leading-none mb-3 text-white group-hover:text-tessera-teal transition-colors duration-300">
              {value}
            </div>
            <div className="font-mono text-[10px] text-tessera-dim tracking-[0.3em] uppercase">{label}</div>
            <div className="font-mono text-[9px] text-tessera-dim/50 mt-1 tracking-wider">{sub}</div>
          </div>
        ))}
      </div>

    </section>
  );
};

export { EQInterfaceMockup, ChannelStripMockup };
export default ProductShowcase;
