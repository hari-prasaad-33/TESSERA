import { useMemo } from 'react';
import SectionMarker from './SectionMarker';

function RotaryKnob({ label, value, accent = 'orange', size = 'md' }) {
  const isTeal = accent === 'teal';
  const ring = isTeal ? '#5DD4F0' : '#FF6A33';
  const glow = isTeal ? 'rgba(93, 212, 240, 0.22)' : 'rgba(255, 106, 51, 0.24)';
  const shell = size === 'lg' ? 'h-16 w-16' : 'h-12 w-12';

  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <div
        className={`relative ${shell} rounded-full border border-white/10 bg-[radial-gradient(circle_at_30%_28%,rgba(255,255,255,0.12),rgba(11,14,22,0.92)_62%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]`}
        style={{ boxShadow: `0 0 24px ${glow}` }}
      >
        <div className="absolute inset-[18%] rounded-full border border-white/6 bg-[radial-gradient(circle_at_40%_32%,rgba(255,255,255,0.12),rgba(8,10,16,0.98)_66%)]" />
        <div
          className="absolute left-1/2 top-1/2 h-[42%] w-[2px] -translate-x-1/2 -translate-y-[86%] rounded-full"
          style={{ background: ring, boxShadow: `0 0 12px ${ring}` }}
        />
        <div className="absolute inset-[9%] rounded-full border" style={{ borderColor: `${ring}66` }} />
      </div>
      <div className="font-mono text-[8px] uppercase tracking-[0.28em] text-[#8d94ab]">{label}</div>
      <div className="font-mono text-[9px] text-[#d4d8e5]">{value}</div>
    </div>
  );
}

function SmallButton({ children, active = false }) {
  return (
    <span
      className={`rounded-full px-3 py-1 font-mono text-[8px] uppercase tracking-[0.24em] ${
        active
          ? 'border border-[#ff8b5f]/70 bg-[#ff6a33]/20 text-[#ffd2bf]'
          : 'border border-white/8 bg-white/[0.03] text-[#8d94ab]'
      }`}
    >
      {children}
    </span>
  );
}

function PluginMockupDisclaimer() {
  return (
    <p className="relative z-10 border-t border-white/8 bg-[#05070c]/95 px-3 py-2.5 text-center font-mono text-[8px] leading-relaxed text-[#6f768a] sm:px-4 sm:text-[9px]">
      <span className="text-[#8d94ab]">*</span> This image is not an exact representation of the actual plugin.
    </p>
  );
}

function MiniToggle({ children, active = false }) {
  return (
    <span
      className={`rounded-md border px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.22em] ${
        active
          ? 'border-[#ff8b5f]/45 bg-[#ff6a33]/14 text-[#ffd6c4]'
          : 'border-white/8 bg-white/[0.02] text-[#a0a8ba]'
      }`}
    >
      {children}
    </span>
  );
}

function ModuleShell({ title, accent = 'orange', children, className = '' }) {
  const color =
    accent === 'teal'
      ? 'text-[#5dd4f0]'
      : accent === 'amber'
        ? 'text-[#ffb84d]'
        : 'text-[#ff8b5f]';

  return (
    <div className={`border border-white/8 bg-black/18 p-4 ${className}`.trim()}>
      <div className={`font-mono text-[9px] uppercase tracking-[0.24em] ${color}`}>{title}</div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function TransportWaveform() {
  const samples = useMemo(
    () => [
      0.42, 0.4, 0.38, 0.36, 0.34, 0.32, 0.3, 0.28, 0.3, 0.34, 0.4, 0.44, 0.48, 0.46,
      0.42, 0.38, 0.36, 0.34, 0.33, 0.32, 0.31, 0.3, 0.29, 0.28, 0.3, 0.34, 0.38, 0.44,
      0.48, 0.45, 0.41, 0.36, 0.31, 0.28, 0.26, 0.24, 0.23, 0.22, 0.24, 0.28, 0.34, 0.4,
      0.46, 0.5, 0.47, 0.42, 0.37, 0.32, 0.28, 0.26, 0.24, 0.22, 0.24, 0.27, 0.31, 0.36,
      0.4, 0.44, 0.47, 0.45, 0.41, 0.36, 0.3, 0.26, 0.22, 0.19, 0.17, 0.16, 0.18, 0.22,
      0.28, 0.34, 0.38, 0.42, 0.46, 0.44, 0.39, 0.34, 0.3, 0.26, 0.22, 0.19, 0.18, 0.2,
      0.24, 0.3, 0.36, 0.41, 0.45, 0.43, 0.38, 0.34, 0.3, 0.26, 0.24, 0.22,
    ],
    [],
  );
  const progress = 0.36;
  const viewWidth = 1000;
  const leftPad = 12;
  const usableWidth = 976;
  const gap = usableWidth / samples.length;
  const playedIndex = Math.floor(samples.length * progress);
  const playheadX = leftPad + usableWidth * progress;

  return (
    <div className="relative h-7 overflow-hidden rounded-full border border-white/8 bg-[#111315]">
      <div
        className="absolute inset-y-0 left-0 rounded-full bg-[linear-gradient(90deg,rgba(255,106,51,0.38),rgba(255,106,51,0.14))]"
        style={{ width: `${progress * 100}%` }}
      />
      <svg viewBox={`0 0 ${viewWidth} 44`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        {samples.map((sample, index) => {
          const barHeight = 6 + sample * 12;
          const x = leftPad + index * gap;
          const y = 22 - barHeight;
          const color =
            index <= playedIndex
              ? 'rgba(255,183,120,0.82)'
              : index % 9 === 0
                ? 'rgba(93,212,240,0.56)'
                : 'rgba(155,162,176,0.38)';

          return <rect key={index} x={x} y={y} width={Math.max(gap * 0.52, 3)} height={barHeight * 2} rx="1.4" fill={color} />;
        })}
        <line x1={playheadX} x2={playheadX} y1="5" y2="39" stroke="#ff6a33" strokeWidth="2.5" />
      </svg>
    </div>
  );
}

function EQGraph() {
  const strands = useMemo(
    () => [
      'M 74 214 C 136 174 196 144 260 156 C 328 170 386 222 456 216 C 528 208 588 156 652 170',
      'M 86 228 C 166 188 228 162 298 182 C 372 204 426 244 510 222 C 588 202 640 170 696 154',
      'M 82 234 C 174 224 254 186 326 184 C 408 180 482 222 566 230 C 638 238 694 220 726 194',
    ],
    [],
  );

  const nodes = [
    { x: 122, y: 176, accent: 'orange' },
    { x: 248, y: 144, accent: 'teal' },
    { x: 392, y: 110, accent: 'orange' },
    { x: 556, y: 150, accent: 'teal' },
    { x: 678, y: 132, accent: 'orange' },
  ];

  return (
    <svg viewBox="0 0 780 320" className="h-full w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="eqFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="rgba(125, 240, 255, 0.34)" />
          <stop offset="76%" stopColor="rgba(93, 212, 240, 0.08)" />
          <stop offset="100%" stopColor="rgba(6, 11, 18, 0.0)" />
        </linearGradient>
        <linearGradient id="eqLine" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#7de3ff" />
          <stop offset="100%" stopColor="#6fd2ef" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="780" height="320" fill="rgba(6,11,16,0.9)" />

      {Array.from({ length: 14 }, (_, i) => (
        <line
          key={`h-${i}`}
          x1="48"
          x2="740"
          y1={30 + i * 18}
          y2={30 + i * 18}
          stroke={i % 3 === 0 ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.026)'}
          strokeWidth={i % 3 === 0 ? '1.1' : '0.6'}
        />
      ))}

      {[48, 106, 164, 228, 302, 388, 492, 612, 740].map((x, index) => (
        <line
          key={`v-${x}`}
          x1={x}
          x2={x}
          y1="30"
          y2="282"
          stroke={index % 2 === 0 ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.03)'}
          strokeWidth={index % 2 === 0 ? '1.05' : '0.7'}
        />
      ))}

      {strands.map((path, index) => (
        <path key={index} d={path} fill="none" stroke="rgba(93,212,240,0.15)" strokeWidth="1.2" />
      ))}

      <path
        d="M 48 184 C 86 184 112 184 144 184 C 176 184 204 144 248 144 C 296 144 330 126 394 110 C 464 94 514 152 560 152 C 610 152 642 126 684 132 C 722 138 740 220 740 280 L 740 292 L 48 292 Z"
        fill="url(#eqFill)"
      />
      <path
        d="M 48 184 C 86 184 112 184 144 184 C 176 184 204 144 248 144 C 296 144 330 126 394 110 C 464 94 514 152 560 152 C 610 152 642 126 684 132 C 722 138 740 220 740 280"
        fill="none"
        stroke="url(#eqLine)"
        strokeWidth="3"
      />

      {nodes.map((node, index) => (
        <g key={index} transform={`translate(${node.x} ${node.y})`}>
          <circle r="17" fill={node.accent === 'orange' ? 'rgba(255,106,51,0.18)' : 'rgba(93,212,240,0.15)'} />
          <circle
            r="12"
            fill="rgba(18,13,12,0.98)"
            stroke={node.accent === 'orange' ? 'rgba(255,106,51,0.82)' : 'rgba(93,212,240,0.76)'}
            strokeWidth="1.35"
          />
          <circle r="6.5" fill={node.accent === 'orange' ? '#ff8b5f' : '#9ce7f8'} />
        </g>
      ))}

      {['20Hz', '50', '100', '200', '500', '1k', '2k', '5k', '20k'].map((label, index) => (
        <text
          key={label}
          x={[48, 106, 164, 228, 302, 388, 492, 612, 740][index]}
          y="308"
          fill="rgba(173,180,197,0.66)"
          fontSize="8"
          fontFamily="'JetBrains Mono', monospace"
          textAnchor={index === 0 ? 'start' : index === 8 ? 'end' : 'middle'}
        >
          {label}
        </text>
      ))}
    </svg>
  );
}

function EQSidebar({ side }) {
  if (side === 'left') {
    return (
      <div className="border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(8,10,16,0.92))] p-3">
        <div className="mb-3 font-mono text-[8px] uppercase tracking-[0.28em] text-[#8d94ab]">Input gain</div>
        <div className="flex justify-center">
          <RotaryKnob label="Input" value="+1.5 dB" accent="orange" size="lg" />
        </div>
        <div className="mt-4 grid gap-2 font-mono text-[8px] uppercase tracking-[0.22em] text-[#d0d6e4]">
          <div className="border border-white/8 bg-white/[0.02] px-2 py-2 text-center">Solo</div>
          <div className="border border-white/8 bg-white/[0.02] px-2 py-2 text-center">Reset</div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(8,10,16,0.92))] p-3">
      <div className="mb-3 font-mono text-[8px] uppercase tracking-[0.28em] text-right text-[#8d94ab]">Output</div>
      <div className="flex justify-center">
        <RotaryKnob label="Output" value="+0.0 dB" accent="orange" size="lg" />
      </div>
      <div className="mt-4 space-y-2">
        <div className="border border-white/8 bg-white/[0.02] px-3 py-2 text-center font-mono text-[8px] uppercase tracking-[0.22em] text-[#d0d6e4]">Bypass off</div>
        <div className="rounded-full border border-[#5dd4f0]/25 bg-[#5dd4f0]/8 px-3 py-2 text-center font-mono text-[8px] uppercase tracking-[0.22em] text-[#d5f8ff]">Analyzer on</div>
      </div>
    </div>
  );
}

function EQDeckCard({ title, children, className = '' }) {
  return (
    <div className={`border border-white/8 bg-white/[0.02] p-3 ${className}`.trim()}>
      <div className="mb-3 font-mono text-[8px] uppercase tracking-[0.22em] text-[#8d94ab]">{title}</div>
      {children}
    </div>
  );
}

export function EQInterfaceMockup({ className = '' }) {
  return (
    <div
      className={`relative flex h-full min-h-[25rem] min-w-0 max-w-full flex-col overflow-hidden border-0 bg-[#090d14] text-white shadow-[0_28px_80px_rgba(0,0,0,0.45)] ${className}`.trim()}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_52%_30%,rgba(255,106,51,0.08),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_14%,transparent_88%,rgba(255,255,255,0.03))]" />

      <div className="relative z-10 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-b border-white/8 px-3 py-3 sm:justify-between sm:px-6">
        <div className="flex min-w-0 shrink items-center gap-2">
          <SmallButton>Load</SmallButton>
          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/8 bg-white/[0.03] text-[11px] text-[#b6bfd4]">play</span>
          <span className="hidden font-mono text-[8px] uppercase tracking-[0.26em] text-[#7d859a] sm:inline">No file loaded</span>
        </div>

        <div className="min-w-0 basis-full text-center sm:basis-auto">
          <div className="font-display text-xl font-semibold tracking-[0.14em] text-[#ff7f49] sm:text-2xl">TESSERA-EQ</div>
          <div className="font-mono text-[8px] uppercase tracking-[0.32em] text-[#c8cedd]">Parametric EQ</div>
        </div>

        <div className="flex shrink-0 items-center justify-center gap-2 sm:justify-end">
          <SmallButton active>Static</SmallButton>
          <SmallButton>Dynamic</SmallButton>
        </div>
      </div>

      <div className="relative z-10 flex min-w-0 flex-1 flex-col gap-4 px-3 pb-3 pt-3 sm:px-4">
        <div className="grid min-w-0 gap-4 xl:grid-cols-[88px_minmax(0,1fr)_88px]">
          <EQSidebar side="left" />

          <div className="border border-white/8 bg-[linear-gradient(180deg,rgba(13,20,30,0.92),rgba(6,10,14,0.96))] p-4">
            <div className="relative min-h-[17rem] overflow-hidden border border-white/6 bg-[#070b11]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_44%,rgba(93,212,240,0.08),transparent_45%)]" />
              <EQGraph />
            </div>
          </div>

          <EQSidebar side="right" />
        </div>

        <div className="grid min-w-0 gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-[0.92fr_0.96fr_0.9fr_0.9fr_1.16fr]">
          <EQDeckCard title="Selected band">
            <div className="text-[1rem] font-semibold tracking-[0.08em] text-[#ff7f49]">Band 3</div>
            <div className="mt-1 font-mono text-[8px] uppercase tracking-[0.22em] text-[#8d94ab]">Peak filter</div>
          </EQDeckCard>

          <EQDeckCard title="Filter type">
            <div className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.22em] text-[#d0d6e4]">
              <span className="rounded-full border border-[#ff8b5f]/40 px-2 py-1 text-[#ff8b5f]">Peak</span>
              <span className="rounded-full border border-white/8 px-2 py-1">Shelf</span>
            </div>
            <div className="mt-4 text-[10px] text-[#8d94ab]">Drag any point live</div>
          </EQDeckCard>

          <EQDeckCard title="Freq">
            <RotaryKnob label="Band 3" value="244 Hz" accent="orange" />
          </EQDeckCard>

          <EQDeckCard title="Gain">
            <RotaryKnob label="Band 3" value="+3.8 dB" accent="orange" />
          </EQDeckCard>

          <EQDeckCard title="Q / Filter">
            <div className="grid gap-3 sm:grid-cols-[90px_minmax(0,1fr)]">
              <RotaryKnob label="Band 3" value="1.00" accent="orange" />
              <div className="flex flex-col justify-between border border-white/8 bg-[#0a0e15] p-3">
                <div className="font-mono text-[8px] uppercase tracking-[0.22em] text-[#8d94ab]">Global filter</div>
                <div className="mt-3 flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.22em] text-[#d0d6e4]">
                  <span className="rounded-full border border-[#ff8b5f]/40 px-2 py-1 text-[#ff8b5f]">HPF</span>
                  <span className="rounded-full border border-white/8 px-2 py-1">LPF</span>
                </div>
              </div>
            </div>
          </EQDeckCard>
        </div>

        <div className="min-w-0 border border-white/8 bg-black/35 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3 rounded-full border border-white/8 bg-black/35 px-3 py-3 sm:px-4">
            <div className="h-2 w-2 shrink-0 rounded-full bg-[#5dd4f0] shadow-[0_0_18px_rgba(93,212,240,0.8)]" />
            <span className="min-w-0 flex-1 font-mono text-[9px] uppercase tracking-[0.22em] text-[#9ba3b9]">
              Describe the tone you want...
            </span>
            <span className="rounded-full border border-[#ff8b5f]/40 bg-[#ff6a33]/14 px-4 py-2 font-mono text-[8px] uppercase tracking-[0.24em] text-[#ffd6c4]">Suggest</span>
          </div>
        </div>
      </div>

      <PluginMockupDisclaimer />
    </div>
  );
}

function AudioProfilePanel() {
  const freqLines = [42, 96, 158, 230, 316, 390];

  return (
    <div className="border border-white/8 bg-[#090b0d] p-3">
      <svg viewBox="0 0 420 170" className="h-36 w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="tesseraOneCurve" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#ff7f49" />
            <stop offset="48%" stopColor="#6fd2ef" />
            <stop offset="100%" stopColor="#ff7f49" />
          </linearGradient>
          <linearGradient id="tesseraOneFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(111,210,239,0.24)" />
            <stop offset="100%" stopColor="rgba(9,11,13,0)" />
          </linearGradient>
        </defs>

        {freqLines.map((x) => (
          <line key={`v-${x}`} x1={x} x2={x} y1="18" y2="142" stroke="rgba(255,255,255,0.08)" />
        ))}
        {Array.from({ length: 5 }, (_, index) => (
          <line
            key={`h-${index}`}
            x1="40"
            x2="390"
            y1={24 + index * 28}
            y2={24 + index * 28}
            stroke={index === 2 ? 'rgba(255,255,255,0.11)' : 'rgba(255,255,255,0.05)'}
          />
        ))}

        <path
          d="M 40 112 C 60 116 74 122 92 118 C 118 112 136 88 160 82 C 190 74 210 94 238 96 C 268 98 290 74 318 70 C 344 66 366 78 390 84"
          fill="none"
          stroke="rgba(93,212,240,0.14)"
          strokeWidth="1.3"
        />
        <path
          d="M 40 112 C 60 116 74 122 92 118 C 118 112 136 88 160 82 C 190 74 210 94 238 96 C 268 98 290 74 318 70 C 344 66 366 78 390 84 L 390 142 L 40 142 Z"
          fill="url(#tesseraOneFill)"
        />
        <path
          d="M 40 112 C 60 116 74 122 92 118 C 118 112 136 88 160 82 C 190 74 210 94 238 96 C 268 98 290 74 318 70 C 344 66 366 78 390 84"
          fill="none"
          stroke="url(#tesseraOneCurve)"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {[
          { x: 160, y: 82, accent: '#ff6a33' },
          { x: 318, y: 70, accent: '#5dd4f0' },
          { x: 390, y: 84, accent: '#ff6a33' },
        ].map((point) => (
          <g key={`${point.x}-${point.y}`} transform={`translate(${point.x} ${point.y})`}>
            <circle r="12" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" />
            <circle r="5" fill={point.accent} />
            <circle r="8.5" fill="none" stroke={`${point.accent}66`} />
          </g>
        ))}

        {[
          ['40', 42, 'start'],
          ['120', 96, 'middle'],
          ['400', 158, 'middle'],
          ['1.2k', 230, 'middle'],
          ['4k', 316, 'middle'],
          ['12k', 390, 'end'],
        ].map(([label, x, anchor]) => (
          <text
            key={label}
            x={x}
            y="158"
            fill="rgba(173,180,197,0.72)"
            fontSize="8"
            fontFamily="'JetBrains Mono', monospace"
            textAnchor={anchor}
          >
            {label}
          </text>
        ))}
      </svg>
    </div>
  );
}

function ParameterGrid({ knobs }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {knobs.map((knob) => (
        <RotaryKnob key={knob.label} label={knob.label} value={knob.value} accent={knob.accent} />
      ))}
    </div>
  );
}

export function ChannelStripMockup({ className = '' }) {
  return (
    <div
      className={`relative min-w-0 max-w-full overflow-hidden bg-[#050607] text-white shadow-[0_28px_80px_rgba(0,0,0,0.45)] ${className}`.trim()}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,106,51,0.08),transparent_20%),radial-gradient(circle_at_78%_12%,rgba(93,212,240,0.08),transparent_18%)]" />

      <div className="relative z-10 border-b border-white/8 px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between gap-4 text-[10px] uppercase tracking-[0.24em] text-[#a6adbc]">
          <div className="font-mono text-[#ff8b5f]">Est. 2026</div>
          <div className="font-mono text-[#f0ebe0]">TESSERA ONE</div>
          <div className="hidden items-center gap-5 font-mono sm:flex">
            <span>In: -inf dB</span>
            <span>Out: -inf dB</span>
            <MiniToggle>Options</MiniToggle>
            <MiniToggle>API config</MiniToggle>
          </div>
        </div>
      </div>

      <div className="relative z-10 border-b border-white/8 px-4 py-3 sm:px-6">
        <TransportWaveform />
      </div>

      <div className="relative z-10 border-b border-white/8 px-4 py-3 sm:px-6">
        <div className="flex flex-wrap items-center gap-2">
          {['Open', 'Play', 'Pause', 'Stop'].map((item, index) => (
            <MiniToggle key={item} active={index === 1}>
              {item}
            </MiniToggle>
          ))}
          <div className="ml-2 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.22em] text-[#a0a8ba]">
            <span className="h-3 w-3 rounded border border-white/18" />
            <span>Loop</span>
          </div>
          <div className="ml-3 min-w-0 flex-1 truncate font-mono text-[9px] text-[#c9cfdb]">
            lancey-foux-style-synth-dreamy-lead-guitar_136bpm_B.wav
          </div>
          <div className="font-mono text-[9px] text-[#a0a8ba]">0:10 / 0:42</div>
        </div>
      </div>

      <div className="relative z-10 border-b border-white/8 px-4 py-3 sm:px-6">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_92px_160px_92px]">
          <div className="rounded-md border border-white/8 bg-black/22 px-4 py-3 text-sm text-[#e4e8ef]">
            A distorted guitar backing for a rock song.
          </div>
          <MiniToggle>Analyze</MiniToggle>
          <div className="rounded-md border border-white/8 bg-black/22 px-3 py-3 font-mono text-[9px] text-[#d0d6e4]">
            1: A distorted guitar backing f...
          </div>
          <MiniToggle>Restore</MiniToggle>
        </div>
      </div>

      <div className="relative z-10 grid min-w-0 gap-3 px-4 py-4 sm:px-6 lg:grid-cols-3">
        <ModuleShell title="Gate" accent="orange">
          <ParameterGrid
            knobs={[
              { label: 'Threshold', value: '-46.0 dB', accent: 'orange' },
              { label: 'Ratio', value: '3.5:1', accent: 'teal' },
              { label: 'Attack', value: '2.0 ms', accent: 'teal' },
              { label: 'Release', value: '84 ms', accent: 'orange' },
            ]}
          />
        </ModuleShell>

        <ModuleShell title="EQ Surface" accent="teal">
          <AudioProfilePanel />
          <div className="mt-4 grid grid-cols-3 gap-4">
            <RotaryKnob label="Freq" value="1.2 kHz" accent="teal" />
            <RotaryKnob label="Gain" value="+2.4 dB" accent="orange" />
            <RotaryKnob label="Q" value="1.20" accent="teal" />
          </div>
        </ModuleShell>

        <ModuleShell title="Compressor" accent="orange">
          <ParameterGrid
            knobs={[
              { label: 'Threshold', value: '-18.0 dB', accent: 'orange' },
              { label: 'Ratio', value: '4.0:1', accent: 'teal' },
              { label: 'Attack', value: '10.0 ms', accent: 'teal' },
              { label: 'Release', value: '100 ms', accent: 'orange' },
            ]}
          />
        </ModuleShell>
      </div>

      <div className="relative z-10 grid min-w-0 gap-3 border-t border-white/8 px-4 pb-3 pt-4 sm:px-6 lg:grid-cols-3">
        <ModuleShell title="Saturator" accent="orange">
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.7fr)]">
            <RotaryKnob label="Drive" value="6.4" accent="orange" size="lg" />
            <RotaryKnob label="Mix" value="42%" accent="orange" size="lg" />
            <div className="flex flex-col justify-center gap-2">
              <div className="rounded-md border border-[#ff8b5f]/30 bg-[#ff6a33]/10 px-3 py-2 text-center font-mono text-[8px] uppercase tracking-[0.22em] text-[#ffd6c4]">Tape</div>
              <div className="rounded-md border border-white/8 bg-white/[0.02] px-3 py-2 text-center font-mono text-[8px] uppercase tracking-[0.22em] text-[#a0a8ba]">Tube</div>
            </div>
          </div>
        </ModuleShell>

        <ModuleShell title="Reverb" accent="amber">
          <div className="grid gap-4 lg:grid-cols-[140px_minmax(0,1fr)]">
            <div className="space-y-3">
              <div className="rounded-md border border-white/8 bg-black/22 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.22em] text-[#d0d6e4]">Room</div>
              <div className="rounded-md border border-white/8 bg-black/22 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.22em] text-[#d0d6e4]">Hard</div>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <RotaryKnob label="Size" value="34" accent="teal" />
              <RotaryKnob label="Damp" value="28" accent="orange" />
              <RotaryKnob label="Width" value="74" accent="teal" />
              <RotaryKnob label="Wet" value="16" accent="orange" />
            </div>
          </div>
        </ModuleShell>

        <ModuleShell title="Limiter" accent="teal">
          <div className="grid grid-cols-2 gap-4">
            <RotaryKnob label="Ceiling" value="-0.1 dB" accent="orange" size="lg" />
            <RotaryKnob label="Release" value="Auto" accent="teal" size="lg" />
          </div>
        </ModuleShell>
      </div>

      <PluginMockupDisclaimer />
    </div>
  );
}

function FeatureChip({ label, accent = 'teal' }) {
  const theme =
    accent === 'teal'
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
    <section id="products" className="relative z-10 min-w-0 overflow-x-clip px-6 pb-28 pt-12 md:px-10 lg:px-14">
      <div className="panel-shell min-w-0 max-w-full">
        <SectionMarker number="05" title="THE PLATFORM" className="mb-10" />

        <div className="border-t border-white/10">
          <div className="grid min-w-0 gap-0 lg:grid-cols-[minmax(0,1.22fr)_minmax(0,1fr)] lg:items-start xl:grid-cols-[minmax(0,1.22fr)_minmax(21rem,0.78fr)]">
            <div className="min-w-0 overflow-hidden rounded-xl bg-[#0a0e14] lg:rounded-l-xl lg:rounded-r-none lg:self-start">
              <ChannelStripMockup className="w-full" />
            </div>

            <div className="flex min-w-0 flex-col justify-center px-0 py-10 sm:py-12 lg:px-10 lg:py-14 xl:pl-12">
              <div className="mb-5 flex flex-wrap gap-3">
                <FeatureChip label="Shipping now" accent="teal" />
                <FeatureChip label="The umbrella" accent="orange" />
                <FeatureChip label="Long game" accent="teal" />
              </div>

              <h2 className="texture-type-shadow display-tight mb-5 text-[#f0ebe0]">TESSERA ONE</h2>

              <p className="texture-type-shadow-soft mb-8 max-w-xl text-lg leading-relaxed text-[#c7cfdd]">
                Tessera EQ is what we are shipping first -- a single tool that proves the idea works. Tessera One is what comes next: EQ, gate, compression, reverb, saturation, all connected under one transparent mixing surface. And behind all of it is Tessera itself -- the long-term vision of a full production environment where intelligent tools stay visible, editable, and unmistakably in service of the artist.
              </p>

              <div className="mb-8 space-y-7">
                <div className="border-l-2 border-[#5dd4f0]/45 pl-5">
                  <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#5dd4f0]">TESSERA EQ</div>
                  <div className="mt-2 text-sm leading-relaxed text-[#d8deea]">The first product. Shipping now. An AI-assisted parametric EQ that stays transparent.</div>
                </div>
                <div className="border-l-2 border-[#ffb84d]/45 pl-5">
                  <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#ffb84d]">TESSERA ONE</div>
                  <div className="mt-2 text-sm leading-relaxed text-[#d8deea]">The umbrella. A suite of mixing tools -- EQ, gate, compressor, reverb, saturation -- all sharing the same philosophy: visible suggestions, full artist control.</div>
                </div>
                <div className="border-l-2 border-[#5dd4f0]/35 pl-5">
                  <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#5dd4f0]">TESSERA</div>
                  <div className="mt-2 text-sm leading-relaxed text-[#d8deea]">The long game. A full digital audio workstation where every step of creation follows the glass-box principle.</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => document.getElementById('how-eq-works')?.scrollIntoView({ behavior: 'smooth' })}
                  className="rounded-full border border-[#5dd4f0]/45 bg-[#5dd4f0]/14 px-7 py-3 font-mono text-xs font-semibold uppercase tracking-[0.28em] text-[#d5f8ff] transition-all duration-300 hover:border-[#5dd4f0] hover:bg-[#5dd4f0]/22"
                >
                  See Tessera EQ
                </button>
                <button
                  type="button"
                  onClick={() => document.getElementById('believers')?.scrollIntoView({ behavior: 'smooth' })}
                  className="rounded-full border border-white/10 px-7 py-3 font-mono text-xs uppercase tracking-[0.28em] text-[#bfc7d8] transition-all duration-300 hover:border-white/25 hover:text-white"
                >
                  Early believers
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-10 border-t border-white/10 pt-12 sm:grid-cols-3 sm:gap-8">
          {[
            { value: '8', label: 'Parametric bands', note: 'Full curve transparency on every suggestion.' },
            { value: '6', label: 'Modules in One', note: 'EQ, dynamics, space, and color in one shell.' },
            { value: '1', label: 'Glass-box DAW', note: 'One environment where intent stays visible end to end.' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="texture-type-shadow text-5xl font-semibold tracking-[-0.05em] text-[#f0ebe0]">{stat.value}</div>
              <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.28em] text-[#8d94ab]">{stat.label}</div>
              <div className="texture-type-shadow-soft mt-2 text-sm text-[#c7cfdd]">{stat.note}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
