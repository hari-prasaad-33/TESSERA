import FounderVideoSection from './FounderVideoSection';
import SectionMarker from './SectionMarker';
import ShaderBackground from './ShaderBackground';
import { shaderPresets } from '../shaders/presets';

const principles = [
  {
    title: 'See the move',
    description: 'A suggestion should arrive as a visible chain of parameters, not as a mysterious result.',
  },
  {
    title: 'Change the move',
    description: 'Every recommendation stays draggable, reversible, and interruptible the moment taste disagrees.',
  },
  {
    title: 'Own the result',
    description: 'The machine may help you get there faster. It should never be confused for the author.',
  },
];

export default function AnswerSection() {
  return (
    <section className="relative z-10 overflow-hidden px-6 py-24 md:px-10 lg:px-14 lg:py-28">
      <div className="absolute inset-y-0 left-0 w-full lg:w-[52vw]">
        <ShaderBackground
          fragmentShader={shaderPresets.pulse}
          mixBlendMode="screen"
          opacity={0.88}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,5,24,0.10)_0%,rgba(8,5,24,0.08)_24%,rgba(8,5,24,0.52)_58%,rgba(8,5,24,0.90)_100%),linear-gradient(180deg,rgba(6,8,17,0.10),rgba(6,8,17,0.84)_86%)]" />
      </div>

      <div className="panel-shell relative z-10">
        <SectionMarker number="03" title="OUR ANSWER" className="mb-10" />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(22rem,1.08fr)] lg:min-h-[44rem]">
          <div className="relative flex min-h-[28rem] items-end lg:min-h-[44rem] lg:pr-6">
            <div className="w-full rounded-[1.8rem] border border-white/10 bg-black/24 p-6 backdrop-blur-md sm:p-7 lg:max-w-[34rem]">
              <div className="font-mono text-[11px] uppercase tracking-[0.34em] text-[#5dd4f0]">
                A different stance on AI
              </div>
              <h2 className="display-tight mt-4 text-[#f0ebe0]">
                FLOW STATE,
                <span className="mt-2 block text-[#ffb84d]">UNLOCKED.</span>
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[#d5dbe7] sm:text-lg">
                Our answer is not to keep intelligence out of the room. It is to make intelligence stay visible.
                Suggestion is welcome. Hidden authorship is not.
              </p>
              <p className="mt-4 border-l border-[#5dd4f0]/35 pl-4 text-sm leading-relaxed text-[#d7edf3]">
                The glass box means the artist can inspect every step, interrupt every step, and still own the final one.
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(7,10,16,0.92))] p-8 sm:p-10 lg:p-12">
            <p className="font-mono text-[11px] uppercase tracking-[0.34em] text-[#ffb84d]">
              One principle
            </p>
            <h3 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-[#f0ebe0] sm:text-4xl">
              Glass box, not black box.
            </h3>
            <div className="mt-8 grid gap-4">
              {principles.map((principle, index) => (
                <div key={principle.title} className="rounded-[1.4rem] border border-white/8 bg-black/18 p-5">
                  <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#8d94ab]">0{index + 1}</div>
                  <div className="mt-2 text-xl font-semibold tracking-[-0.03em] text-white">{principle.title}</div>
                  <p className="mt-2 text-sm leading-relaxed text-[#c5cddd]">{principle.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-20 -mb-20 mt-10 max-w-3xl rounded-[1.8rem] border border-white/10 bg-[linear-gradient(135deg,rgba(8,10,16,0.92),rgba(18,10,8,0.82))] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8">
          <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#8d94ab]">Bridge into the build</div>
          <p className="mt-4 text-2xl leading-tight text-[#f0ebe0] sm:text-3xl">
            The idea only matters if the software makes it real.
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#c6cfdd] sm:text-base">
            So from here on, we stop talking in abstractions and show the first product directly: how Tessera EQ listens,
            translates, and stays under the artist's hand.
          </p>
        </div>

        <div className="mt-28">
          <FounderVideoSection />
        </div>
      </div>
    </section>
  );
}
