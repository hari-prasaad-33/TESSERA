export default function FoundersNoteSection() {
  return (
    <section className="relative z-10 overflow-hidden" aria-labelledby="founders-note-heading">
      <div className="grid gap-12 border-t border-white/10 pt-14 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-stretch lg:gap-16 lg:pt-16">
        <div className="max-w-3xl border-l-2 border-[#5dd4f0]/40 pl-6 sm:pl-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.34em] text-[#5dd4f0]">Founder&apos;s note</p>
          <h2 id="founders-note-heading" className="texture-type-shadow mt-4 text-4xl font-semibold tracking-[-0.06em] text-[#f0ebe0] sm:text-5xl lg:text-6xl">
            Why Tessera
            <span className="block text-[#ffb84d]">has to exist.</span>
          </h2>
          <p className="texture-type-shadow-soft mt-6 text-base leading-relaxed text-[#d4dbea] sm:text-lg lg:text-[1.12rem]">
            Tessera started from a discomfort with tools that promise total ease. I do not want software that replaces the search.
            I want software that helps sound arrive faster without stripping the artist out of the arrival.
          </p>
        </div>

        <div className="flex flex-col justify-end gap-8 lg:border-l lg:border-white/10 lg:pl-10">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#8d94ab]">In one line</div>
            <p className="texture-type-shadow-soft mt-3 max-w-sm text-xl font-semibold leading-snug text-[#f0ebe0] sm:text-2xl">
              A creative tool should sharpen intent, not replace it.
            </p>
          </div>
          <div className="h-px w-full max-w-xs bg-gradient-to-r from-white/0 via-white/15 to-white/0 lg:max-w-none" />
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#8d94ab]">What this protects</div>
            <p className="texture-type-shadow-soft mt-3 max-w-sm text-base leading-relaxed text-[#d4dbea]">
              The feeling that the final decision is still yours, even when intelligence is helping you move faster.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
