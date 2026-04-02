import SectionMarker from './SectionMarker';
import ShaderBackground from './ShaderBackground';
import { shaderPresets } from '../shaders/presets';

export default function HeroSection({ onExplore }) {
  return (
    <header id="home" className="relative z-10 min-h-screen overflow-hidden px-6 pb-24 pt-28 md:px-10 lg:px-14 lg:pb-28">
      <div className="absolute inset-y-0 right-0 w-full lg:w-[56vw]">
        <ShaderBackground
          fragmentShader={shaderPresets.hero}
          mixBlendMode="screen"
          opacity={0.96}
          className="scale-[1.04]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_22%,rgba(255,184,77,0.28),transparent_22%),radial-gradient(circle_at_86%_70%,rgba(255,106,51,0.18),transparent_24%),linear-gradient(90deg,rgba(5,5,26,0.9)_0%,rgba(5,5,26,0.66)_28%,rgba(5,5,26,0.2)_48%,rgba(5,5,26,0.06)_100%)]" />
      </div>

      <div className="panel-shell relative z-10 flex min-h-[calc(100vh-7rem)] items-end">
        <div className="grid w-full gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.9fr)] lg:items-end">
          <div className="relative z-10 max-w-5xl pb-4">
            <SectionMarker number="01" title="THE MISSION" className="mb-8" />
            <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.34em] text-[#5dd4f0]">
              Human-first audio intelligence
            </p>
            <h1 className="display-bleed max-w-[12ch] text-[#f0ebe0]">
              THE SOUL OF MUSIC CREATION
              <span className="mt-3 block text-[#ffb84d]">IS NOT FOR SALE.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-[#c6cfdd] md:text-xl">
              AI can collapse distance. It should not collapse meaning. Tessera is built for the part of music creation
              that still has to feel chosen, earned, and unmistakably human.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <button
                onClick={onExplore}
                className="rounded-full border border-[#5dd4f0]/45 bg-[#5dd4f0]/14 px-7 py-3 font-mono text-xs font-semibold uppercase tracking-[0.28em] text-[#d5f8ff] transition-all duration-300 hover:border-[#5dd4f0] hover:bg-[#5dd4f0]/22"
              >
                Start with the question
              </button>
              <button
                onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                className="rounded-full border border-white/10 px-7 py-3 font-mono text-xs uppercase tracking-[0.28em] text-[#c4ccd9] transition-all duration-300 hover:border-white/25 hover:text-white"
              >
                See the first instrument
              </button>
            </div>
          </div>

          <div className="hidden lg:block" />
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-[-4.5rem] left-6 right-6 z-20 md:left-auto md:right-10 md:w-[40rem] lg:right-14 lg:w-[44rem]">
        <div className="relative overflow-hidden rounded-[1.8rem] border border-white/10 bg-[linear-gradient(135deg,rgba(7,10,16,0.94),rgba(15,10,14,0.82))] p-6 shadow-[0_34px_90px_rgba(0,0,0,0.52)] backdrop-blur-xl sm:p-7">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_22%,rgba(93,212,240,0.12),transparent_28%),radial-gradient(circle_at_84%_24%,rgba(255,184,77,0.16),transparent_28%)]" />
          <div className="relative grid gap-5 sm:grid-cols-[minmax(0,1.15fr)_minmax(15rem,0.85fr)] sm:items-end">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#8d94ab]">Tessera thesis</div>
              <p className="mt-4 text-[1.95rem] leading-[0.98] text-[#f0ebe0] sm:text-[2.45rem]">
                Process over shortcuts.
              </p>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#d0d7e4] sm:text-base">
                We use intelligence to remove friction, not authorship. The machine can suggest. The artist still decides.
              </p>
            </div>

            <div className="grid gap-3 font-mono text-[10px] uppercase tracking-[0.24em]">
              <div className="rounded-[1.1rem] border border-white/10 bg-black/18 px-4 py-3 text-[#d7edf3]">Visible moves</div>
              <div className="rounded-[1.1rem] border border-white/10 bg-black/18 px-4 py-3 text-[#ffe1af]">Editable handoff</div>
              <div className="rounded-[1.1rem] border border-white/10 bg-black/18 px-4 py-3 text-[#d7edf3]">Artist in control</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
