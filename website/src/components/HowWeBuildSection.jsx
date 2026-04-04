import { EQInterfaceMockup } from './ProductShowcase';
import SectionMarker from './SectionMarker';
import ShaderBackground from './ShaderBackground';
import { shaderPresets } from '../shaders/presets';

function SemanticEngineVisual() {
  const stages = ['Prompt', 'Tokenizer', 'Embedding', 'Similarity', '8-band curve'];

  return (
    <div className="relative flex h-full min-h-[26rem] flex-col justify-center overflow-hidden bg-[#0b0c0d] p-6 sm:p-8 lg:p-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.06),transparent_26%),radial-gradient(circle_at_80%_78%,rgba(255,184,77,0.12),transparent_30%)]" />
      <div className="relative z-10 grid gap-4">
        {stages.map((stage, index) => (
          <div key={stage} className="flex items-center gap-3">
            <div className="flex h-12 min-w-0 flex-1 items-center border border-white/8 bg-black/22 px-4 font-mono text-[10px] uppercase tracking-[0.24em] text-[#d5f8ff]">
              {stage}
            </div>
            {index < stages.length - 1 && <div className="h-px w-10 bg-gradient-to-r from-[#5dd4f0]/55 to-[#ffb84d]/55" />}
          </div>
        ))}
      </div>
      <div className="relative z-10 mt-6 grid gap-3 sm:grid-cols-3">
        <div className="border border-white/8 bg-black/22 p-4">
          <div className="font-mono text-[9px] uppercase tracking-[0.24em] text-[#8d94ab]">Local model</div>
          <div className="mt-2 text-sm text-[#d8deea]">384-dimensional embeddings, computed on device.</div>
        </div>
        <div className="border border-white/8 bg-black/22 p-4">
          <div className="font-mono text-[9px] uppercase tracking-[0.24em] text-[#8d94ab]">Reference set</div>
          <div className="mt-2 text-sm text-[#d8deea]">786 descriptors scored by cosine similarity.</div>
        </div>
        <div className="border border-white/8 bg-black/22 p-4">
          <div className="font-mono text-[9px] uppercase tracking-[0.24em] text-[#8d94ab]">Latency</div>
          <div className="mt-2 text-sm text-[#d8deea]">Under a second for high-confidence local matches.</div>
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

  return (
    <div className="flex h-full min-h-[26rem] items-center justify-center bg-[#0c0d0f] p-6 sm:p-8 lg:p-10">
      <div className="w-full max-w-xl space-y-4">
        {tiers.map((tier, index) => {
          const theme = tier.accent === 'teal'
            ? 'border-[#5dd4f0]/25 bg-[#5dd4f0]/10 text-[#d5f8ff]'
            : tier.accent === 'amber'
              ? 'border-[#ffb84d]/25 bg-[#ffb84d]/10 text-[#ffe1af]'
              : 'border-[#ff6a33]/25 bg-[#ff6a33]/10 text-[#ffd6c4]';

          return (
            <div key={tier.title} className={`border p-5 ${theme}`}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.26em]">{tier.title}</div>
                  <div className="mt-2 text-2xl font-semibold tracking-[-0.04em]">{tier.subtitle}</div>
                </div>
                <div className="font-mono text-xs uppercase tracking-[0.24em]">{tier.threshold}</div>
              </div>
              {index < tiers.length - 1 && <div className="mt-4 h-px bg-white/10" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DSPVisual() {
  return (
    <div className="flex h-full min-h-[26rem] items-center justify-center bg-[#0b0c0e] p-6 sm:p-8 lg:p-10">
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

        <rect x="0" y="0" width="620" height="280" fill="rgba(7,10,16,0.6)" stroke="rgba(255,255,255,0.08)" />
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

function BuildSlab({ id, title, subtitle, description, visual, reverse = false }) {
  return (
    <div className="overflow-hidden border-y border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(7,10,16,0.92))] lg:border">
      <div className={`grid gap-0 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] ${reverse ? 'lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1' : ''}`}>
        <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-12 xl:p-14">
          <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#8d94ab]">{id}</div>
          <h3 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-[#f0ebe0] sm:text-4xl">{title}</h3>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.26em] text-[#5dd4f0]">{subtitle}</p>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-[#c6cfdd]">{description}</p>
        </div>
        <div className="min-h-[24rem] lg:min-h-[30rem]">{visual}</div>
      </div>
    </div>
  );
}

export default function HowWeBuildSection({ eqMockup }) {
  const liveVisual = eqMockup ?? <EQInterfaceMockup className="h-full min-h-[30rem] border-0" />;

  return (
    <section className="relative z-10 px-6 pb-28 pt-24 md:px-10 lg:px-14 lg:pb-32">
      <div className="panel-shell">
        <SectionMarker number="04" title="HOW TESSERA EQ WORKS" className="mb-10" />

        <div className="mb-10 max-w-4xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.34em] text-[#5dd4f0]">
            The first product, in the open
          </p>
          <h2 className="display-tight mt-4 text-[#f0ebe0]">
            THIS IS HOW
            <span className="mt-2 block text-[#5dd4f0]">TESSERA EQ THINKS.</span>
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#c6cfdd]">
            This is Tessera EQ -- the first product, shown exactly as it works. You describe the sound you want. It suggests an EQ curve. You see every parameter, drag any node, undo anything. No mystery. No magic buttons.
          </p>
        </div>

        <div className="space-y-8">
          <BuildSlab
            id="04.1"
            title="Glass Box in Action"
            subtitle="A prompt becomes a curve you can inspect immediately."
            description="Type a phrase like 'add warmth and air' and the system suggests a full EQ state. Nothing is hidden behind a magic button. Every band is draggable, editable, and reversible."
            visual={
              <div className="relative h-full overflow-hidden bg-[#0a0b0d]">
                <ShaderBackground fragmentShader={shaderPresets.lanterns} opacity={0.34} mixBlendMode="screen" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,7,7,0.06),rgba(7,7,7,0.54)_84%)]" />
                <div className="relative z-10 h-full">{liveVisual}</div>
              </div>
            }
          />

          <BuildSlab
            id="04.2"
            title="From Phrase to Curve"
            subtitle="Human language gets grounded before it touches the audio."
            description="A local pipeline tokenizes the prompt, embeds it into vector space, and retrieves the nearest tonal descriptors before shaping the EQ. It is fast, grounded, and private by default."
            visual={<SemanticEngineVisual />}
            reverse
          />

          <BuildSlab
            id="04.3"
            title="Confidence Routing"
            subtitle="Local-first when the answer is obvious. AI-assisted when the intent is ambiguous."
            description="High-confidence matches return instantly from the local dataset. Mid-confidence prompts get grounded AI refinement. Truly novel intent can escalate to the broader creative model. Every path degrades gracefully."
            visual={<TierVisual />}
          />

          <BuildSlab
            id="04.4"
            title="Musical DSP Underneath"
            subtitle="Stable filters. Smooth ramps. No audible compromise."
            description="Cytomic state-variable filters and safe parameter interpolation let the interface move continuously, whether the driver is a human hand or an AI suggestion. The math exists to serve the sound, not show off."
            visual={<DSPVisual />}
            reverse
          />
        </div>
      </div>
    </section>
  );
}
