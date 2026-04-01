import { useMemo } from 'react';
import SectionMarker from './SectionMarker';

function RotaryKnob({ label, value, accent = 'orange', size = 'md' }) {
  const isTeal = accent === 'teal';
  const ring = isTeal ? '#5DD4F0' : '#FF6A33';
  const glow = isTeal ? 'rgba(93, 212, 240, 0.22)' : 'rgba(255, 106, 51, 0.24)';
  const shell = size === 'lg' ? 'h-18 w-18' : 'h-14 w-14';

  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <div
        className={`relative ${shell} rounded-full border border-white/10 bg-[radial-gradient(circle_at_30%_28%,rgba(255,255,255,0.12),rgba(11,14,22,0.92)_62%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]`}
        style={{ boxShadow: `0 0 26px ${glow}` }}
      >
        <div className="absolute inset-[18%] rounded-full border border-white/6 bg-[radial-gradient(circle_at_40%_32%,rgba(255,255,255,0.12),rgba(8,10,16,0.98)_66%)]" />
        <div
          className="absolute left-1/2 top-1/2 h-[42%] w-[2px] -translate-x-1/2 -translate-y-[86%] rounded-full"
          style={{ background: ring, boxShadow: `0 0 12px ${ring}` }}
        />
        <div
          className="absolute inset-[9%] rounded-full border"
          style={{ borderColor: `${ring}66` }}
        />
      </div>
      <div className="font-mono text-[8px] uppercase tracking-[0.28em] text-[#8d94ab]">{label}</div>
      <div className="font-mono text-[9px] text-[#d4d8e5]">{value}</div>
    </div>
  );
}

function SmallButton({ children, active = false }) {
  return (
    <span
      className={`rounded-full px-3 py-1 font-mono text-[8px] uppercase tracking-[0.24em] transition-colors ${
        active
          ? 'border border-[#ff8b5f]/70 bg-[#ff6a33]/20 text-[#ffd2bf]'
          : 'border border-white/8 bg-white/[0.03] text-[#8d94ab]'
      }`}
    >
      {children}
    </span>
  );
}

function GraphNode({ cx, cy, index, icon = 'peak' }) {
  const iconPath = {
    shelf: 'M -6 5 C -1 5 -1 0 4 0 L 7 0',
    peak: 'M -7 4 C -4 4 -3 -5 0 -5 C 3 -5 4 4 7 4',
    cut: 'M -6 5 C -1 5 -1 -2 4 -2 L 7 -2',
  }[icon];

  return (
    <g transform={`translate(${cx} ${cy})`}>
      <circle r="18" fill="rgba(255,106,51,0.16)" />
      <circle r="13" fill="rgba(255,106,51,0.1)" stroke="rgba(255,106,51,0.85)" strokeWidth="1.4" />
      <circle r="8.8" fill="rgba(18,13,12,0.98)" stroke="rgba(255,196,170,0.28)" strokeWidth="0.8" />
      <path d={iconPath} fill="none" stroke="#ff965f" strokeWidth="1.5" strokeLinecap="round" />
      <text y="-20" textAnchor="middle" fill="#ff9d71" fontSize="6" fontFamily="'JetBrains Mono', monospace">{index}</text>
    </g>
  );
}

function EQGraph() {
  const strands = useMemo(
    () => [
      'M 70 214 C 130 170 170 148 230 160 C 310 176 360 244 438 228 C 515 214 562 132 650 154',
      'M 70 218 C 150 188 206 146 272 170 C 345 197 392 247 474 214 C 548 184 605 124 650 146',
      'M 70 210 C 132 194 188 158 248 166 C 322 176 380 210 446 194 C 530 173 586 142 650 156',
      'M 70 224 C 146 236 202 202 270 188 C 344 172 392 166 472 188 C 548 208 594 196 650 166',
    ],
    [],
  );

  const nodes = [
    { x: 96, y: 240, index: '2', icon: 'cut' },
    { x: 162, y: 152, index: '1', icon: 'shelf' },
    { x: 278, y: 150, index: '3', icon: 'peak' },
    { x: 402, y: 110, index: '4', icon: 'peak' },
    { x: 528, y: 164, index: '6', icon: 'peak' },
    { x: 598, y: 168, index: '5', icon: 'peak' },
    { x: 690, y: 136, index: '7', icon: 'shelf' },
    { x: 730, y: 176, index: '8', icon: 'shelf' },
  ];

  return (
    <svg viewBox="0 0 780 320" className="h-full w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="eqFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="rgba(125, 240, 255, 0.34)" />
          <stop offset="70%" stopColor="rgba(93, 212, 240, 0.08)" />
          <stop offset="100%" stopColor="rgba(6, 11, 18, 0.0)" />
        </linearGradient>
        <linearGradient id="eqLine" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#7de3ff" />
          <stop offset="100%" stopColor="#6fd2ef" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="780" height="320" fill="rgba(6, 11, 16, 0.88)" />

      {Array.from({ length: 17 }, (_, i) => (
        <line
          key={`h-${i}`}
          x1="58"
          x2="748"
          y1={26 + i * 16.5}
          y2={26 + i * 16.5}
          stroke={i % 4 === 0 ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.025)'}
          strokeWidth={i % 4 === 0 ? '1.1' : '0.6'}
        />
      ))}

      {Array.from({ length: 21 }, (_, i) => (
        <line
          key={`v-${i}`}
          x1={58 + i * 34.5}
          x2={58 + i * 34.5}
          y1="26"
          y2="292"
          stroke={i % 4 === 0 ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.025)'}
          strokeWidth={i % 4 === 0 ? '1.05' : '0.6'}
        />
      ))}

      {strands.map((d, index) => (
        <path
          key={index}
          d={d}
          fill="none"
          stroke="rgba(93, 212, 240, 0.18)"
          strokeWidth="1.1"
        />
      ))}

      <path
        d="M 58 178 C 86 178 110 178 146 178 C 182 178 198 142 252 150 C 304 157 336 128 402 120 C 468 112 510 155 560 155 C 618 155 650 124 696 132 C 734 138 748 222 748 280 L 748 292 L 58 292 Z"
        fill="url(#eqFill)"
      />
      <path
        d="M 58 178 C 86 178 110 178 146 178 C 182 178 198 142 252 150 C 304 157 336 128 402 120 C 468 112 510 155 560 155 C 618 155 650 124 696 132 C 734 138 748 222 748 280"
        fill="none"
        stroke="url(#eqLine)"
        strokeWidth="3"
      />

      {nodes.map((node) => (
        <GraphNode key={node.index} {...node} />
      ))}

      {['20Hz', '50', '100', '200', '500', '1k', '2k', '5k', '10k', '20k'].map((label, index) => (
        <text
          key={label}
          x={58 + index * 76.5}
          y="308"
          fill="rgba(173,180,197,0.66)"
          fontSize="8"
          fontFamily="'JetBrains Mono', monospace"
          textAnchor={index === 0 ? 'start' : index === 9 ? 'end' : 'middle'}
        >
          {label}
        </text>
      ))}
    </svg>
  );
}

const spectrumThreads = [
  'M 124 238 C 166 188 218 144 284 154 C 336 160 378 192 434 212 C 474 228 530 226 612 212',
  'M 136 222 C 200 164 258 140 328 148 C 382 154 440 198 512 206 C 570 212 614 196 676 164',
  'M 124 244 C 196 224 266 176 330 174 C 404 172 460 214 544 232 C 606 246 664 226 710 190',
];

export function EQInterfaceMockup({ className = '' }) {
  return (
    <div className={`relative flex h-full min-h-[30rem] flex-col overflow-hidden border border-white/8 bg-[#090d14] text-white shadow-[0_28px_80px_rgba(0,0,0,0.45)] ${className}`.trim()}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(93,212,240,0.08),transparent_42%),radial-gradient(circle_at_82%_18%,rgba(255,106,51,0.12),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_12%,transparent_88%,rgba(255,255,255,0.03))]" />

      <div className="relative z-10 flex items-center justify-between gap-4 border-b border-white/8 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <SmallButton>Load</SmallButton>
          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/8 bg-white/[0.03] text-[11px] text-[#b6bfd4]">play</span>
          <span className="hidden font-mono text-[8px] uppercase tracking-[0.26em] text-[#7d859a] sm:inline">No file loaded</span>
        </div>

        <div className="text-center">
          <div className="font-display text-xl font-semibold tracking-[0.14em] text-[#ff7f49] sm:text-2xl">TESSERA-EQ</div>
          <div className="font-mono text-[8px] uppercase tracking-[0.32em] text-[#c8cedd]">Parametric EQ</div>
        </div>

        <div className="flex items-center gap-2">
          <SmallButton active>Static</SmallButton>
          <SmallButton>Dynamic</SmallButton>
        </div>
      </div>

      <div className="relative z-10 grid flex-1 grid-cols-[96px_minmax(0,1fr)_96px] gap-3 px-3 pb-3 pt-3 sm:px-4">
        <div className="rounded-[1.4rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(8,10,16,0.92))] p-3">
          <div className="mb-4 font-mono text-[8px] uppercase tracking-[0.28em] text-[#8d94ab]">Input Gain</div>
          <RotaryKnob label="Gain" value="+1.5 dB" accent="orange" size="lg" />
          <div className="mt-6 border-t border-white/6 pt-4">
            <div className="mb-3 font-mono text-[8px] uppercase tracking-[0.28em] text-[#8d94ab]">Global Controls</div>
            <div className="space-y-2">
              <div className="rounded-xl border border-white/8 bg-white/[0.02] px-3 py-2 text-center font-mono text-[8px] uppercase tracking-[0.22em] text-[#d0d6e4]">Solo Selected Band</div>
              <div className="rounded-xl border border-white/8 bg-white/[0.02] px-3 py-2 text-center font-mono text-[8px] uppercase tracking-[0.22em] text-[#d0d6e4]">Reset All Bands</div>
            </div>
          </div>
        </div>

        <div className="grid min-h-[22rem] grid-rows-[minmax(0,1fr)_128px] gap-3">
          <div className="rounded-[1.6rem] border border-white/8 bg-[linear-gradient(180deg,rgba(13,20,30,0.92),rgba(6,10,14,0.96))] p-4">
            <div className="relative h-full overflow-hidden rounded-[1.2rem] border border-white/6 bg-[#070b11]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_44%,rgba(93,212,240,0.08),transparent_45%)]" />
              <EQGraph />
              <svg viewBox="0 0 780 320" className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="none">
                {spectrumThreads.map((thread) => (
                  <path key={thread} d={thread} fill="none" stroke="rgba(93,212,240,0.16)" strokeWidth="1.3" />
                ))}
              </svg>
            </div>
          </div>

          <div className="grid grid-cols-[1.1fr_1fr_1fr_1fr_1.4fr] gap-3 rounded-[1.6rem] border border-white/8 bg-[linear-gradient(180deg,rgba(10,14,21,0.98),rgba(7,9,14,0.94))] p-4">
            <div className="flex flex-col justify-between rounded-[1.1rem] border border-white/8 bg-white/[0.02] p-3">
              <div className="font-mono text-[8px] uppercase tracking-[0.24em] text-[#8d94ab]">Selected Band Editor</div>
              <div>
                <div className="text-[1.05rem] font-semibold tracking-[0.08em] text-[#ff7f49]">Band 3</div>
                <div className="font-mono text-[8px] uppercase tracking-[0.22em] text-[#8d94ab]">Selected</div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-between rounded-[1.1rem] border border-white/8 bg-white/[0.02] p-3">
              <div className="font-mono text-[8px] uppercase tracking-[0.22em] text-[#8d94ab]">Type</div>
              <div className="rounded-full border border-white/8 px-3 py-1 font-mono text-[8px] uppercase tracking-[0.24em] text-[#d0d6e4]">Peak</div>
              <div className="text-[10px] text-[#8d94ab]">Filter</div>
            </div>

            <div className="rounded-[1.1rem] border border-white/8 bg-white/[0.02] p-3">
              <div className="mb-3 text-center font-mono text-[8px] uppercase tracking-[0.22em] text-[#8d94ab]">Freq</div>
              <RotaryKnob label="Band 3" value="244 Hz" accent="orange" />
            </div>

            <div className="rounded-[1.1rem] border border-white/8 bg-white/[0.02] p-3">
              <div className="mb-3 text-center font-mono text-[8px] uppercase tracking-[0.22em] text-[#8d94ab]">Gain</div>
              <RotaryKnob label="Band 3" value="3.8 dB" accent="orange" />
            </div>

            <div className="grid grid-cols-[1fr_1fr] gap-3 rounded-[1.1rem] border border-white/8 bg-white/[0.02] p-3">
              <div>
                <div className="mb-3 text-center font-mono text-[8px] uppercase tracking-[0.22em] text-[#8d94ab]">Q</div>
                <RotaryKnob label="Band 3" value="1.00" accent="orange" />
              </div>
              <div className="flex flex-col justify-between rounded-[0.9rem] border border-white/8 bg-[#0a0e15] p-3">
                <div className="font-mono text-[8px] uppercase tracking-[0.22em] text-[#8d94ab]">Global Filter Type</div>
                <div className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.22em] text-[#d0d6e4]">
                  <span className="rounded-full border border-[#ff8b5f]/40 px-2 py-1 text-[#ff8b5f]">HPF</span>
                  <span className="rounded-full border border-white/8 px-2 py-1">LPF</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[1.4rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(8,10,16,0.92))] p-3">
          <div className="mb-4 text-right font-mono text-[8px] uppercase tracking-[0.28em] text-[#8d94ab]">Output Gain</div>
          <div className="flex flex-col items-end">
            <RotaryKnob label="Gain" value="+0.0 dB" accent="orange" size="lg" />
          </div>
          <div className="mt-6 border-t border-white/6 pt-4">
            <div className="mb-3 font-mono text-[8px] uppercase tracking-[0.28em] text-[#8d94ab]">Analyzer</div>
            <div className="rounded-[1rem] border border-white/8 bg-white/[0.02] p-3">
              <div className="mb-3 flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.24em] text-[#8d94ab]">
                <span>Bypass</span>
                <span className="h-3 w-3 rounded border border-white/12 bg-[#0a0e15]" />
              </div>
              <div className="flex items-center gap-3 rounded-full border border-[#5dd4f0]/25 bg-[#5dd4f0]/8 px-3 py-2 font-mono text-[8px] uppercase tracking-[0.24em] text-[#d5f8ff]">
                <span className="h-3 w-3 rounded-sm border border-[#5dd4f0]/50 bg-[#5dd4f0]/20" />
                <span>On / Off</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 border-t border-white/8 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3 rounded-full border border-white/8 bg-black/35 px-4 py-3">
          <div className="h-2 w-2 rounded-full bg-[#5dd4f0] shadow-[0_0_18px_rgba(93,212,240,0.8)]" />
          <span className="flex-1 font-mono text-[9px] uppercase tracking-[0.22em] text-[#9ba3b9]">Describe the tone you want...</span>
          <span className="rounded-full border border-[#ff8b5f]/40 bg-[#ff6a33]/14 px-4 py-2 font-mono text-[8px] uppercase tracking-[0.24em] text-[#ffd6c4]">Suggest</span>
        </div>
      </div>
    </div>
  );
}

function LevelTrack({ accent = 'teal' }) {
  const bars = useMemo(
    () => Array.from({ length: 26 }, (_, index) => 0.25 + ((Math.sin(index * 0.5) + 1) * 0.5) * 0.7),
    [],
  );

  const active = accent === 'teal' ? 'from-[#5dd4f0] to-[#247c90]' : 'from-[#ffb84d] to-[#ff6a33]';

  return (
    <div className="flex h-28 items-end gap-[3px]">
      {bars.map((value, index) => (
        <span
          key={index}
          className={`w-[5px] rounded-full bg-gradient-to-t ${active}`}
          style={{ height: `${18 + value * 72}%`, opacity: 0.18 + value * 0.75 }}
        />
      ))}
    </div>
  );
}

export function ChannelStripMockup({ className = '' }) {
  const modules = [
    { name: 'Gate', accent: 'teal' },
    { name: 'EQ', accent: 'orange' },
    { name: 'Comp', accent: 'teal' },
    { name: 'Sat', accent: 'orange' },
    { name: 'Verb', accent: 'teal' },
    { name: 'Limit', accent: 'orange' },
  ];

  return (
    <div className={`relative flex h-full min-h-[24rem] flex-col overflow-hidden border border-white/8 bg-[#0a0d15] ${className}`.trim()}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,184,77,0.16),transparent_30%),radial-gradient(circle_at_76%_30%,rgba(93,212,240,0.15),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_18%,transparent_84%,rgba(255,255,255,0.02))]" />

      <div className="relative z-10 flex items-center justify-between border-b border-white/8 px-5 py-4">
        <div>
          <div className="font-mono text-[8px] uppercase tracking-[0.32em] text-[#8d94ab]">TESSERA ONE</div>
          <div className="mt-1 text-3xl font-semibold tracking-[0.08em] text-white">Channel Strip</div>
        </div>
        <div className="rounded-full border border-[#ffb84d]/30 bg-[#ffb84d]/10 px-4 py-2 font-mono text-[8px] uppercase tracking-[0.24em] text-[#ffe1af]">Coming 2026</div>
      </div>

      <div className="relative z-10 grid flex-1 grid-cols-[140px_minmax(0,1fr)_140px] gap-4 p-5">
        <div className="rounded-[1.4rem] border border-white/8 bg-white/[0.03] p-4">
          <div className="mb-3 font-mono text-[8px] uppercase tracking-[0.24em] text-[#8d94ab]">Input</div>
          <LevelTrack accent="teal" />
          <div className="mt-4 rounded-[1rem] border border-white/8 bg-black/25 p-3 font-mono text-[8px] uppercase tracking-[0.22em] text-[#8d94ab]">Semantic prompt ready</div>
        </div>

        <div className="rounded-[1.6rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(8,11,16,0.94))] p-5">
          <div className="mb-6 flex items-center justify-between">
            <div className="font-mono text-[8px] uppercase tracking-[0.28em] text-[#8d94ab]">Transparent AI routing</div>
            <div className="font-mono text-[8px] uppercase tracking-[0.24em] text-[#d0d6e4]">Every move is editable</div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {modules.map((module) => {
              const teal = module.accent === 'teal';
              return (
                <div key={module.name} className="rounded-[1.2rem] border border-white/8 bg-[#0a0e15] p-4 text-center">
                  <div
                    className={`mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full border ${
                      teal ? 'border-[#5dd4f0]/35 text-[#5dd4f0]' : 'border-[#ffb84d]/35 text-[#ffb84d]'
                    } bg-white/[0.02] text-xs uppercase tracking-[0.3em]`}
                  >
                    {module.name.slice(0, 2)}
                  </div>
                  <div className="font-mono text-[8px] uppercase tracking-[0.24em] text-[#d0d6e4]">{module.name}</div>
                </div>
              );
            })}
          </div>
          <div className="mt-5 rounded-[1.2rem] border border-white/8 bg-black/25 p-4">
            <div className="font-mono text-[8px] uppercase tracking-[0.24em] text-[#8d94ab]">Intent chain</div>
            <div className="mt-3 flex items-center gap-3 text-[10px] text-[#d0d6e4]">
              <span className="rounded-full border border-[#5dd4f0]/25 px-3 py-1 font-mono uppercase tracking-[0.22em] text-[#d5f8ff]">Prompt</span>
              <span className="h-px flex-1 bg-gradient-to-r from-[#5dd4f0]/40 to-[#ffb84d]/40" />
              <span className="rounded-full border border-[#ffb84d]/25 px-3 py-1 font-mono uppercase tracking-[0.22em] text-[#ffe1af]">Visible controls</span>
            </div>
          </div>
        </div>

        <div className="rounded-[1.4rem] border border-white/8 bg-white/[0.03] p-4">
          <div className="mb-3 font-mono text-[8px] uppercase tracking-[0.24em] text-[#8d94ab]">Output</div>
          <LevelTrack accent="orange" />
          <div className="mt-4 rounded-[1rem] border border-white/8 bg-black/25 p-3 font-mono text-[8px] uppercase tracking-[0.22em] text-[#8d94ab]">Adaptive taste profile</div>
        </div>
      </div>
    </div>
  );
}

function FeatureChip({ label, accent = 'teal' }) {
  const theme = accent === 'teal'
    ? 'border-[#5dd4f0]/20 bg-[#5dd4f0]/8 text-[#d5f8ff]'
    : 'border-[#ffb84d]/20 bg-[#ffb84d]/8 text-[#ffe1af]';

  return (
    <span className={`rounded-full border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.22em] ${theme}`}>
      {label}
    </span>
  );
}

export default function ProductShowcase({ onNavigate }) {
  return (
    <section id="products" className="relative z-10 px-6 pb-28 pt-12 md:px-10 lg:px-14">
      <div className="panel-shell">
        <SectionMarker number="05" title="THE PROOF" className="mb-10" />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)]">
          <div className="overflow-hidden rounded-[2rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(8,11,16,0.96))] p-3 sm:p-4">
            <EQInterfaceMockup />
          </div>

          <div className="flex flex-col justify-center rounded-[2rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(7,10,16,0.92))] p-8 sm:p-10 lg:p-12">
            <div className="mb-5 flex flex-wrap gap-3">
              <FeatureChip label="Available now" accent="teal" />
              <FeatureChip label="Local-first AI" accent="orange" />
            </div>

            <h2 className="display-tight mb-5 text-[#f0ebe0]">
              TESSERA EQ
            </h2>

            <p className="mb-6 max-w-xl text-lg leading-relaxed text-[#c7cfdd]">
              An intent-driven 8-band EQ that translates plain language into editable curves.
              It analyzes, suggests, and steps back so the artist stays in charge.
            </p>

            <div className="mb-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.4rem] border border-white/8 bg-black/20 p-4">
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#8d94ab]">Glass-box control</div>
                <div className="mt-2 text-sm leading-relaxed text-[#d8deea]">Every AI move maps to visible bands, gain, Q, and filter type.</div>
              </div>
              <div className="rounded-[1.4rem] border border-white/8 bg-black/20 p-4">
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#8d94ab]">Adaptive engine</div>
                <div className="mt-2 text-sm leading-relaxed text-[#d8deea]">Dynamic suggestions evolve across the track and learn from your corrections.</div>
              </div>
            </div>

            <div className="mb-9 flex flex-wrap gap-3">
              {['8 bands', 'Dynamic mode', 'Offline response', 'Learns your taste', 'Standalone', 'VST3 + AU'].map((item, index) => (
                <FeatureChip key={item} label={item} accent={index % 2 === 0 ? 'teal' : 'orange'} />
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate('eq-features')}
                className="rounded-full border border-[#5dd4f0]/45 bg-[#5dd4f0]/14 px-7 py-3 font-mono text-xs font-semibold uppercase tracking-[0.28em] text-[#d5f8ff] transition-all duration-300 hover:border-[#5dd4f0] hover:bg-[#5dd4f0]/22"
              >
                Explore Features
              </button>
              <button className="rounded-full border border-white/10 px-7 py-3 font-mono text-xs uppercase tracking-[0.28em] text-[#bfc7d8] transition-all duration-300 hover:border-white/25 hover:text-white">
                Download
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { value: '8', label: 'Bands', note: 'fully editable' },
            { value: '786', label: 'Descriptors', note: 'local semantic set' },
            { value: '<1s', label: 'Response', note: 'for local matches' },
            { value: '3 tiers', label: 'Inference', note: 'local to creative AI' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-[1.6rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(7,10,16,0.9))] p-6">
              <div className="text-5xl font-semibold tracking-[-0.05em] text-[#f0ebe0]">{stat.value}</div>
              <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.28em] text-[#8d94ab]">{stat.label}</div>
              <div className="mt-2 text-sm text-[#c7cfdd]">{stat.note}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
