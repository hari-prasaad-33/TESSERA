import { EQInterfaceMockup } from './ProductShowcase';
import SectionMarker from './SectionMarker';
import ShaderBackground from './ShaderBackground';
import { shaderPresets } from '../shaders/presets';

function SemanticEngineVisual() {
  const stages = ['Prompt', 'Tokenizer', 'Embedding', 'Similarity', '8-band curve'];

  return (
    <div className="relative flex h-full min-h-[26rem] flex-col justify-center overflow-hidden bg-transparent p-6 sm:p-8 lg:p-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.05),transparent_26%)]" />
      <div className="relative z-10 grid gap-0">
        {stages.map((stage) => (
          <div
            key={stage}
            className="flex h-11 items-center border-b border-white/12 font-mono text-[11px] uppercase tracking-[0.24em] text-[#d5f8ff]"
          >
            {stage}
          </div>
        ))}
      </div>
      <div className="relative z-10 mt-8 grid gap-4 sm:grid-cols-3">
        <div className="border-l-2 border-[#5dd4f0]/35 pl-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#8d94ab]">Local model</div>
          <div className="mt-2 text-base text-[#d8deea]">384-dimensional embeddings, computed on device.</div>
        </div>
        <div className="border-l-2 border-[#ffb84d]/35 pl-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#8d94ab]">Reference set</div>
          <div className="mt-2 text-base text-[#d8deea]">786 descriptors scored by cosine similarity.</div>
        </div>
        <div className="border-l-2 border-white/20 pl-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#8d94ab]">Latency</div>
          <div className="mt-2 text-base text-[#d8deea]">Under a second for high-confidence local matches.</div>
        </div>
      </div>
    </div>
  );
}

function TierVisual() {
  const tiers = [
    { title: 'Tier 1', subtitle: 'Local hit', threshold: '>= 0.95', accent: 'teal' },
    { title: 'Tier 2', subtitle: 'Grounded AI', threshold: '0.82 - 0.95', accent: 'amber' },
    { title: 'Tier 3', subtitle: 'Creative AI', threshold: '< 0.82', accent: 'orange' },
  ];

  const border = {
    teal: 'border-[#5dd4f0]/40',
    amber: 'border-[#ffb84d]/40',
    orange: 'border-[#ff6a33]/40',
  };

  return (
    <div className="flex h-full min-h-[26rem] items-center bg-[#0e1218]/90 p-6 sm:p-8 lg:p-10">
      <div className="w-full max-w-xl space-y-6">
        {tiers.map((tier) => (
          <div key={tier.title} className={`border-l-2 ${border[tier.accent]} pl-5`}>
            <div className="font-mono text-[11px] uppercase tracking-[0.26em] text-[#8d94ab]">{tier.title}</div>
            <div className="mt-2 flex flex-wrap items-baseline justify-between gap-2">
              <div className="text-2xl font-semibold tracking-[-0.04em] text-[#f0ebe0] sm:text-[1.65rem]">{tier.subtitle}</div>
              <div className="font-mono text-sm uppercase tracking-[0.24em] text-[#c6cfdd]">{tier.threshold}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DSPVisual() {
  return (
    <div className="flex h-full min-h-[26rem] items-center justify-center bg-transparent p-6 sm:p-8 lg:p-10">
      <svg viewBox="0 0 620 280" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="waveA" x1="0" x2="1">
            <stop offset="0%" stopColor="#5dd4f0" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#5dd4f0" stopOpacity="0.85" />
          </linearGradient>
          <linearGradient id="waveB" x1="0" x2="1">
            <stop offset="0%" stopColor="#ffb84d" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#ff6a33" stopOpacity="0.85" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width="620" height="280" fill="rgba(7,10,16,0.18)" stroke="rgba(255,255,255,0.08)" />
        <path d="M 36 148 C 88 62 144 234 198 148 C 248 66 302 230 360 148 C 418 62 472 228 524 148" fill="none" stroke="url(#waveA)" strokeWidth="4" />
        <path d="M 36 148 C 88 148 144 148 198 148 C 248 148 302 148 360 148 C 418 148 472 148 524 148" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" strokeDasharray="5 7" />
        <path d="M 36 148 C 88 62 144 234 198 148 C 248 66 302 230 360 148 C 418 62 472 228 524 148" fill="none" stroke="url(#waveB)" strokeWidth="2.2" strokeDasharray="1 10" />
        {['Before', 'After', 'Artifact free sweep'].map((label, index) => (
          <text key={label} x={58 + index * 180} y="242" fill="rgba(208,214,228,0.86)" fontSize="13" fontFamily="'JetBrains Mono', monospace">
            {label}
          </text>
        ))}
      </svg>
    </div>
  );
}

function BuildSlab({ id, title, subtitle, description, visual, reverse = false, slabIndex = 0 }) {
  return (
    <div className={slabIndex === 0 ? 'pb-2 pt-0' : 'border-t border-white/10 pb-2 pt-14'}>
      <div
        className={`grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-12 ${reverse ? 'lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1' : ''}`}
      >
        <div className="flex flex-col justify-center border-l-2 border-[#5dd4f0]/25 px-0 py-2 pl-6 sm:py-4 lg:px-2 lg:py-6 lg:pl-8 xl:pr-8">
          <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#8d94ab]">{id}</div>
          <h3 className="texture-type-shadow mt-4 text-3xl font-semibold tracking-[-0.05em] text-[#f0ebe0] sm:text-4xl">{title}</h3>
          <p className="texture-type-shadow-soft mt-3 font-mono text-[11px] uppercase tracking-[0.26em] text-[#5dd4f0]">{subtitle}</p>
          <p className="texture-type-shadow-soft mt-6 max-w-xl text-lg leading-relaxed text-[#c6cfdd]">{description}</p>
        </div>
        <div className="min-h-[24rem] lg:min-h-[30rem]">{visual}</div>
      </div>
    </div>
  );
}

/**
 * @param {{ eqMockup?: import('react').ReactNode, slabStart?: number, slabEnd?: number, includeIntro?: boolean }} props
 */
export default function HowWeBuildSection({ eqMockup, slabStart = 0, slabEnd = 4, includeIntro = true }) {
  const liveVisual = eqMockup ?? <EQInterfaceMockup className="h-full min-h-[30rem] border-0" />;

  const slabs = [
    {
      id: '04.1',
      title: 'Glass Box in Action',
      subtitle: 'A prompt becomes a curve you can inspect immediately.',
      description:
        "Type a phrase like 'add warmth and air' and the system suggests a full EQ state. Nothing is hidden behind a magic button. Every band is draggable, editable, and reversible.",
      reverse: false,
      visual: (
        <div className="relative h-full min-h-[26rem] overflow-hidden bg-transparent">
          <ShaderBackground fragmentShader={shaderPresets.lanterns} opacity={0.28} mixBlendMode="screen" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(8,10,14,0.12),rgba(6,8,12,0.28)_84%)]" />
          <div className="relative z-10 h-full">{liveVisual}</div>
        </div>
      ),
    },
    {
      id: '04.2',
      title: 'From Phrase to Curve',
      subtitle: 'Human language gets grounded before it touches the audio.',
      description:
        'A local pipeline tokenizes the prompt, embeds it into vector space, and retrieves the nearest tonal descriptors before shaping the EQ. It is fast, grounded, and private by default.',
      reverse: true,
      visual: <SemanticEngineVisual />,
    },
    {
      id: '04.3',
      title: 'Confidence Routing',
      subtitle: 'Local-first when the answer is obvious. AI-assisted when the intent is ambiguous.',
      description:
        'High-confidence matches return instantly from the local dataset. Mid-confidence prompts get grounded AI refinement. Truly novel intent can escalate to the broader creative model. Every path degrades gracefully.',
      reverse: false,
      visual: <TierVisual />,
    },
    {
      id: '04.4',
      title: 'Musical DSP Underneath',
      subtitle: 'Stable filters. Smooth ramps. No audible compromise.',
      description:
        'Cytomic state-variable filters and safe parameter interpolation let the interface move continuously, whether the driver is a human hand or an AI suggestion. The math exists to serve the sound, not show off.',
      reverse: true,
      visual: <DSPVisual />,
    },
  ];

  const visible = slabs.slice(slabStart, slabEnd);

  return (
    <section className="relative z-10 px-6 pb-28 pt-24 md:px-10 lg:px-14 lg:pb-32">
      <div className="panel-shell">
        {includeIntro ? (
          <div className="mb-12 max-w-4xl lg:mb-16">
            <SectionMarker number="04" title="HOW TESSERA EQ WORKS" className="mb-10" />
            <div className="border-l-2 border-[#5dd4f0]/30 pl-6 sm:pl-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.34em] text-[#5dd4f0]">The first product, in the open</p>
              <h2 className="texture-type-shadow display-tight mt-4 text-[#f0ebe0]">
                THIS IS HOW
                <span className="mt-2 block text-[#5dd4f0]">TESSERA EQ THINKS.</span>
              </h2>
              <p className="texture-type-shadow-soft mt-6 max-w-2xl text-xl leading-relaxed text-[#c6cfdd]">
                This is Tessera EQ -- the first product, shown exactly as it works. You describe the sound you want. It suggests an EQ curve. You see every parameter, drag any node, undo anything. No mystery. No magic buttons.
              </p>
            </div>
          </div>
        ) : (
          <div className="mb-10 max-w-2xl border-l-2 border-white/20 pl-6 sm:pl-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-[#8d94ab]">Section 04 continued</p>
            <p className="texture-type-shadow-soft mt-2 text-base leading-relaxed text-[#c6cfdd]">Routing, confidence, and the DSP underneath.</p>
          </div>
        )}

        <div className="space-y-4">
          {visible.map((slab, i) => (
            <BuildSlab key={slab.id} {...slab} slabIndex={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
