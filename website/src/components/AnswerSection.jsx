import FounderVideoSection from './FounderVideoSection';
import SectionMarker from './SectionMarker';
import ShaderBackground from './ShaderBackground';
import { shaderPresets } from '../shaders/presets';

const pillars = [
  {
    title: 'Glass Box',
    description: 'AI is a semantic assistant, not a ghost producer. Every decision is mapped to tactile controls you can inspect and change.',
  },
  {
    title: 'Semantic Intelligence',
    description: 'Describe the sound in human language and Tessera translates it into visible, editable DSP moves.',
  },
  {
    title: 'Deep Personalization',
    description: 'The system learns from your corrections so the next suggestion moves closer to your actual taste.',
  },
  {
    title: 'Uncompromising DSP',
    description: 'Stable filters, smooth ramps, and artifact-free modulation keep the math transparent and musical.',
  },
  {
    title: 'Atmospheric Design',
    description: 'We reject sterile utility software. The interface should feel focused, premium, and creatively alive.',
  },
];

export default function AnswerSection() {
  return (
    <section className="relative z-10 px-6 py-24 md:px-10 lg:px-14 lg:py-28">
      <div className="panel-shell">
        <SectionMarker number="03" title="OUR ANSWER" className="mb-10" />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(22rem,1.08fr)]">
          <div className="relative min-h-[30rem] overflow-hidden rounded-[2rem] border border-white/8 bg-[#090714] lg:min-h-[40rem]">
            <ShaderBackground
              fragmentShader={shaderPresets.pulse}
              mixBlendMode="screen"
              opacity={0.82}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,8,17,0.14),rgba(6,8,17,0.84)_78%)]" />

            <div className="absolute inset-0 z-10 flex flex-col justify-between p-8 sm:p-10">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.34em] text-[#5dd4f0]">
                  A different stance on AI
                </p>
                <h2 className="display-tight mt-4 text-[#f0ebe0]">
                  FLOW STATE,
                  <span className="mt-2 block text-[#ffb84d]">UNLOCKED.</span>
                </h2>
              </div>

              <div className="rounded-[1.8rem] border border-white/10 bg-black/26 p-6 backdrop-blur-md sm:p-7">
                <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#8d94ab]">The Tessera way</div>
                <p className="mt-4 text-base leading-relaxed text-[#d5dbe7] sm:text-lg">
                  We are not trying to automate away taste. We are trying to remove the friction between intent and sound,
                  so the creator spends more time deciding and less time wrestling the tool.
                </p>
                <p className="mt-4 border-l border-[#5dd4f0]/35 pl-4 text-sm leading-relaxed text-[#d7edf3]">
                  Art should not just serve the audience. It should serve the creator first.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(7,10,16,0.92))] p-8 sm:p-10 lg:p-12">
            <p className="font-mono text-[11px] uppercase tracking-[0.34em] text-[#ffb84d]">
              Five pillars
            </p>
            <h3 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-[#f0ebe0] sm:text-4xl">
              Build the intelligence. Keep the human in charge.
            </h3>
            <div className="mt-8 grid gap-4">
              {pillars.map((pillar, index) => (
                <div key={pillar.title} className="rounded-[1.4rem] border border-white/8 bg-black/18 p-5">
                  <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#8d94ab]">0{index + 1}</div>
                  <div className="mt-2 text-xl font-semibold tracking-[-0.03em] text-white">{pillar.title}</div>
                  <p className="mt-2 text-sm leading-relaxed text-[#c5cddd]">{pillar.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-20 -mb-20 mt-10 max-w-3xl rounded-[1.8rem] border border-white/10 bg-[linear-gradient(135deg,rgba(8,10,16,0.92),rgba(18,10,8,0.82))] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8">
          <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#8d94ab]">Bridge into the build</div>
          <p className="mt-4 text-2xl leading-tight text-[#f0ebe0] sm:text-3xl">
            The philosophy only matters if the product makes it visible.
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#c6cfdd] sm:text-base">
            So the next section is not marketing language. It is the architecture, the interaction model, and the proof that the idea survives contact with software.
          </p>
        </div>

        <div className="mt-28">
          <FounderVideoSection />
        </div>
      </div>
    </section>
  );
}
