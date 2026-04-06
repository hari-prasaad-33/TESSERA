import SectionMarker from './SectionMarker';
import { TesseractIllustration } from './ConceptIllustrations';

export default function VisionSection() {
  return (
    <section id="vision" className="relative z-10 px-6 pb-28 pt-24 md:px-10 lg:px-14 lg:pb-32">
      <div className="panel-shell">
        <SectionMarker number="06" title="THE HORIZON" className="mb-10" />

        <div className="mb-12 max-w-4xl lg:mb-14">
          <p className="font-mono text-[11px] uppercase tracking-[0.34em] text-[#ffb84d]">The road ahead</p>
          <h2 className="texture-type-shadow display-tight mt-4 text-[#f0ebe0]">
            THIS IS JUST
            <span className="mt-2 block text-[#ffb84d]">THE BEGINNING.</span>
          </h2>
        </div>

        <div className="mb-14 max-w-3xl border-l-2 border-[#5dd4f0]/35 pl-6 sm:mb-16 sm:pl-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-[#5dd4f0]">Moonshot</p>
          <h3 className="texture-type-shadow mt-4 text-3xl font-semibold tracking-[-0.05em] text-[#f0ebe0] sm:text-4xl">TESSERA DAW</h3>
          <p className="texture-type-shadow-soft mt-5 text-lg leading-relaxed text-[#c6cfdd] sm:text-xl">
            Our long-term goal is a full digital audio workstation -- Tessera DAW -- where every capability, end to end,
            follows the same philosophy we are proving now: intelligence that removes friction, never authorship.
            Suggestions stay visible, parameters stay yours, and the final track stays unmistakably your decision.
            Every product we ship between now and then is a step closer -- and proof that the philosophy holds.
          </p>
        </div>

        <div className="relative overflow-hidden pt-4">
          <div className="pointer-events-none absolute bottom-0 left-0 top-0 hidden w-[42%] opacity-[0.22] lg:block">
            <TesseractIllustration className="h-full min-h-[16rem] w-full scale-110" />
          </div>
          <div className="relative grid min-h-[20rem] items-center lg:grid-cols-[minmax(0,0.4fr)_minmax(0,1fr)] lg:gap-12 lg:pl-4">
            <div className="hidden lg:block" aria-hidden />
            <div className="max-w-3xl border-l-2 border-white/20 pl-6 lg:justify-self-end lg:pl-8">
              <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#8d94ab]">Design principle</div>
              <p className="texture-type-shadow-soft mt-5 text-xl leading-relaxed text-[#c6cfdd] sm:text-2xl">
                Every product we build will follow the same principle: reduce friction, never replace intention.
                The goal is not to build the most powerful AI in music. It is to build the most honest one.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
