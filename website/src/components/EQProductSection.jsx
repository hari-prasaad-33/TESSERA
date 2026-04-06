import React from 'react';

const EQCurveViz = () => (
  <svg viewBox="0 0 400 180" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
    {/* Grid lines horizontal */}
    {[0, 45, 90, 135, 180].map(y => (
      <line key={`h${y}`} x1="0" y1={y} x2="400" y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
    ))}
    {/* Grid lines vertical */}
    {[0, 80, 160, 240, 320, 400].map(x => (
      <line key={`v${x}`} x1={x} y1="0" x2={x} y2="180" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
    ))}
    {/* Zero dB line */}
    <line x1="0" y1="90" x2="400" y2="90" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="3 5"/>

    {/* EQ curve fill (glow area under curve) */}
    <path
      d="M 0,90 C 25,90 40,86 65,80 C 85,75 100,65 130,58 C 155,53 165,62 195,70 C 220,77 235,84 265,74 C 290,65 310,54 345,48 C 368,44 383,45 400,46 L 400,180 L 0,180 Z"
      fill="url(#eqGradient)"
      opacity="0.12"
    />
    {/* EQ curve line */}
    <path
      d="M 0,90 C 25,90 40,86 65,80 C 85,75 100,65 130,58 C 155,53 165,62 195,70 C 220,77 235,84 265,74 C 290,65 310,54 345,48 C 368,44 383,45 400,46"
      fill="none"
      stroke="#FF5F1F"
      strokeWidth="2.5"
    />

    {/* Gradient definition */}
    <defs>
      <linearGradient id="eqGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FF5F1F" />
        <stop offset="100%" stopColor="#FF5F1F" stopOpacity="0" />
      </linearGradient>
    </defs>

    {/* Band nodes */}
    {[
      [10, 90], [65, 80], [130, 58], [195, 70], [265, 74], [310, 54], [358, 48], [396, 46]
    ].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r="4.5" fill="#050505" stroke="#FF5F1F" strokeWidth="2"/>
    ))}

    {/* Frequency labels */}
    {['30', '100', '300', '1k', '2.5k', '5k', '10k', '16k'].map((label, i) => {
      const xs = [10, 65, 130, 195, 265, 310, 358, 396];
      return (
        <text key={i} x={xs[i]} y="175" textAnchor="middle" fill="rgba(107,114,128,0.6)" fontSize="7.5" fontFamily="'JetBrains Mono', monospace">
          {label}
        </text>
      );
    })}
  </svg>
);

const EQProductSection = ({ onNavigate }) => {
  return (
    <section className="relative z-10 py-32 px-6 max-w-7xl mx-auto">
      {/* Separator */}
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent mb-32"></div>

      <div className="grid md:grid-cols-2 gap-16 items-center">
        {/* EQ Visualization — left side */}
        <div className="glass-card rounded-3xl border border-white/5 relative overflow-hidden flex flex-col group" style={{ aspectRatio: '4/3' }}>
          <div className="absolute inset-0 bg-gradient-to-b from-tessera-void to-black opacity-80"></div>

          {/* Labels */}
          <div className="relative z-10 flex justify-between items-center px-6 pt-6 pb-2">
            <span className="font-mono text-xs text-tessera-teal tracking-widest">8-BAND PARAMETRIC EQ</span>
            <span className="font-mono text-xs text-tessera-dim tracking-widest">AI ENHANCED</span>
          </div>

          {/* Graph Area */}
          <div className="relative z-10 flex-1 px-4 pb-4">
            <EQCurveViz />
          </div>

          {/* Hover shimmer */}
          <div className="absolute inset-0 bg-gradient-to-br from-tessera-teal/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
        </div>

        {/* Text — right side */}
        <div>
          <div className="font-mono text-xs text-tessera-teal tracking-[0.3em] mb-4 uppercase">New Product</div>
          <h2 className="text-5xl font-display text-white mb-6 tracking-tight uppercase" style={{ textShadow: '0 0 20px rgba(77,124,138,0.25)' }}>
            TESSERA <span className="text-tessera-teal">EQ</span>
          </h2>
          <h3 className="text-3xl font-display mb-8 leading-tight">
            Precision EQ.<br/>Powered by <span className="text-tessera-orange">Intent.</span>
          </h3>
          <p className="text-lg text-gray-400 mb-4 leading-relaxed">
            An 8-band parametric equalizer that understands what you're trying to achieve.
            Describe your sound in plain language—the AI shapes the curve.
          </p>
          <p className="text-base text-gray-500 mb-8 leading-relaxed">
            Not just a static suggestion. Tessera EQ pre-scans your full track and generates
            a <span className="text-tessera-teal">time-varying EQ</span> that evolves with the music.
            Then it learns from your every adjustment.
          </p>

          {/* Quick feature pills */}
          <div className="flex flex-wrap gap-2 mb-10">
            {['8-Band Parametric', 'Dynamic EQ', 'Learning AI', 'Spectrum Analyzer', 'Standalone'].map(tag => (
              <span key={tag} className="font-mono text-xs px-3 py-1 rounded-full border border-tessera-teal/20 text-tessera-teal/70 bg-tessera-teal/5">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex gap-4">
            <button
              className="px-10 py-5 bg-tessera-teal/15 border border-tessera-teal/40 text-tessera-teal font-mono font-bold tracking-wider rounded-full transition-all hover:scale-105 hover:bg-tessera-teal/25 hover:shadow-lg hover:shadow-tessera-teal/10"
              onClick={() => document.getElementById('how-eq-works')?.scrollIntoView({ behavior: 'smooth' })}
            >
              EXPLORE FEATURES
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EQProductSection;
