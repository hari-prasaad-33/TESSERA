import { ModularGridIllustration } from './ConceptIllustrations';

export default function FoundersNoteSection() {
  return (
    <section className="relative z-10 overflow-hidden" aria-labelledby="founders-note-heading">
      <div className="relative overflow-hidden rounded-[2rem] border border-white/14 bg-[#141a24]/82 px-6 py-10 shadow-[0_28px_80px_rgba(0,0,0,0.35)] sm:px-10 sm:py-12 lg:px-14 lg:py-14">
        <div className="pointer-events-none absolute inset-0 opacity-[0.32] lg:opacity-[0.42]">
          <ModularGridIllustration className="h-full" />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(125deg,rgba(14,18,26,0.88)_0%,rgba(14,18,26,0.72)_38%,rgba(16,20,28,0.58)_62%,rgba(14,18,26,0.82)_100%)]" />

        <div className="relative grid gap-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-stretch lg:gap-16">
          <div className="max-w-3xl border-l-2 border-[#5dd4f0]/35 pl-6 sm:pl-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.34em] text-[#5dd4f0]">Founder&apos;s note</p>
            <h2 id="founders-note-heading" className="mt-4 text-4xl font-semibold tracking-[-0.06em] text-[#f0ebe0] sm:text-5xl lg:text-6xl">
              Why Tessera
              <span className="block text-[#ffb84d]">has to exist.</span>
            </h2>
            <p className="mt-6 text-base leading-relaxed text-[#d4dbea] sm:text-lg lg:text-[1.12rem]">
              Tessera started from a discomfort with tools that promise total ease. I do not want software that replaces the search.
              I want software that helps sound arrive faster without stripping the artist out of the arrival.
            </p>
          </div>

          <div className="flex flex-col justify-end gap-8 border-t border-white/10 pt-10 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#8d94ab]">In one line</div>
              <p className="mt-3 max-w-sm text-xl font-semibold leading-snug text-[#f0ebe0] sm:text-2xl">
                A creative tool should sharpen intent, not replace it.
              </p>
            </div>
            <div className="h-px w-full max-w-xs bg-gradient-to-r from-white/0 via-white/20 to-white/0 lg:max-w-none" />
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#8d94ab]">What this protects</div>
              <p className="mt-3 max-w-sm text-base leading-relaxed text-[#d4dbea]">
                The feeling that the final decision is still yours, even when intelligence is helping you move faster.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
