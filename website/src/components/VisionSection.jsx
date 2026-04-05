import SectionMarker from './SectionMarker';
import { TesseractIllustration } from './ConceptIllustrations';

export default function VisionSection() {
  return (
    <section id="vision" className="relative z-10 px-6 pb-28 pt-24 md:px-10 lg:px-14 lg:pb-32">
      <div className="panel-shell">
        <SectionMarker number="06" title="THE HORIZON" className="mb-10" />

        <div className="mb-10 max-w-4xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.34em] text-[#ffb84d]">
            The road ahead
          </p>
          <h2 className="display-tight mt-4 text-[#f0ebe0]">
            THIS IS JUST
            <span className="mt-2 block text-[#ffb84d]">THE BEGINNING.</span>
          </h2>
        </div>

        <div className="mb-10 max-w-3xl rounded-[1.5rem] border border-white/14 bg-[#141c2a]/78 px-8 py-10 sm:px-10 sm:py-12">
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#5dd4f0]">Moonshot</p>
          <h3 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-[#f0ebe0] sm:text-4xl">TESSERA DAW</h3>
          <p className="mt-5 text-base leading-relaxed text-[#c6cfdd] sm:text-lg">
            Our long-term goal is a full digital audio workstation -- Tessera DAW -- where every capability, end to end,
            follows the same philosophy we are proving now: intelligence that removes friction, never authorship.
            Suggestions stay visible, parameters stay yours, and the final track stays unmistakably your decision.
            There is no ship date on the horizon for that; there is only the standard -- if we build it, it earns the name.
          </p>
        </div>

        <div className="space-y-8">
          <div className="relative overflow-hidden border-y border-white/12 bg-[#121a26]/72 lg:border">
            <div className="relative grid min-h-[24rem] items-center px-8 py-10 sm:px-10 sm:py-12 lg:min-h-[28rem] lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-10 lg:px-12 xl:px-14">
              <div className="relative hidden min-h-[12rem] overflow-hidden rounded-[1.5rem] border border-white/12 bg-[#0e1420]/78 lg:block">
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.48]">
                  <TesseractIllustration className="h-full min-h-[14rem] w-full scale-110" />
                </div>
              </div>
              <div className="max-w-3xl lg:justify-self-end">
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#8d94ab]">Design principle</div>
                <p className="mt-5 text-lg leading-relaxed text-[#c6cfdd] sm:text-xl">
                  Every product we build will follow the same principle: reduce friction, never replace intention.
                  The goal is not to build the most powerful AI in music. It is to build the most honest one.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
