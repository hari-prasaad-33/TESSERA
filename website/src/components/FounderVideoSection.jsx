import { ModularGridIllustration } from './ConceptIllustrations';

export default function FounderVideoSection() {
  return (
    <section className="relative z-10 overflow-hidden">
      <div className="relative overflow-hidden rounded-[2rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(7,10,16,0.96))] px-6 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
        <div className="absolute inset-y-0 right-[-8%] w-full opacity-[0.4] lg:w-[62%] lg:opacity-[0.68]">
          <ModularGridIllustration className="h-full" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(93,212,240,0.08),transparent_30%),radial-gradient(circle_at_82%_22%,rgba(255,184,77,0.12),transparent_32%),linear-gradient(90deg,rgba(7,10,16,0.96)_0%,rgba(7,10,16,0.9)_34%,rgba(7,10,16,0.54)_58%,rgba(7,10,16,0.82)_100%)]" />

        <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.62fr)] lg:items-end">
          <div className="max-w-4xl">
            <div className="font-mono text-[10px] uppercase tracking-[0.34em] text-[#5dd4f0]">From the founder</div>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.06em] text-[#f0ebe0] sm:text-5xl lg:text-6xl">
              Why Tessera
              <span className="block text-[#ffb84d]">has to exist.</span>
            </h2>
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-[#d4dbea] sm:text-lg lg:text-[1.12rem]">
              Tessera started from a discomfort with tools that promise total ease. I do not want software that replaces the search.
              I want software that helps sound arrive faster without stripping the artist out of the arrival.
            </p>
          </div>

          <div className="grid gap-5 lg:justify-self-end">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#8d94ab]">In one line</div>
              <p className="mt-3 max-w-md text-2xl font-semibold leading-tight text-[#f0ebe0]">
                A creative tool should sharpen intent, not replace it.
              </p>
            </div>
            <div className="h-px w-full max-w-xs bg-gradient-to-r from-white/0 via-white/18 to-white/0" />
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#8d94ab]">What this protects</div>
              <p className="mt-3 max-w-md text-base leading-relaxed text-[#d4dbea]">
                The feeling that the final decision is still yours, even when intelligence is helping you move faster.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
