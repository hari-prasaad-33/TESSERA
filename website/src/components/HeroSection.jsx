import SectionMarker from './SectionMarker';
import ShaderBackground from './ShaderBackground';
import { shaderPresets } from '../shaders/presets';

export default function HeroSection({ onExplore }) {
  return (
    <header id="home" className="relative z-10 min-h-screen overflow-hidden px-6 pb-10 pt-28 md:px-10 lg:px-14 lg:pb-14">
      <div className="absolute inset-y-0 right-0 w-full lg:w-[56vw]">
        <ShaderBackground
          fragmentShader={shaderPresets.hero}
          mixBlendMode="screen"
          opacity={0.96}
          className="scale-[1.04]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_24%,rgba(255,184,77,0.22),transparent_24%),linear-gradient(90deg,rgba(5,5,26,0.88)_0%,rgba(5,5,26,0.62)_28%,rgba(5,5,26,0.18)_48%,rgba(5,5,26,0.04)_100%)]" />
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
              When AI can finish a track in seconds, the speed can erase the reason we started.
              Tessera exists to protect the ritual, the struggle, and the human decisions that make music mean something.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <button
                onClick={onExplore}
                className="rounded-full border border-[#5dd4f0]/45 bg-[#5dd4f0]/14 px-7 py-3 font-mono text-xs font-semibold uppercase tracking-[0.28em] text-[#d5f8ff] transition-all duration-300 hover:border-[#5dd4f0] hover:bg-[#5dd4f0]/22"
              >
                Explore the philosophy
              </button>
              <button
                onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                className="rounded-full border border-white/10 px-7 py-3 font-mono text-xs uppercase tracking-[0.28em] text-[#c4ccd9] transition-all duration-300 hover:border-white/25 hover:text-white"
              >
                See Tessera EQ
              </button>
            </div>
          </div>

          <div className="hidden lg:block" />
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-8 right-6 left-6 z-10 md:left-auto md:right-10 md:w-[28rem] lg:right-14">
        <div className="rounded-[1.6rem] border border-white/10 bg-black/28 p-6 backdrop-blur-md">
          <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#8d94ab]">Tessera thesis</div>
          <p className="mt-4 text-2xl leading-tight text-[#f0ebe0] sm:text-3xl">
            Process over shortcuts.
          </p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-[#d0d7e4]">
            We use intelligence to remove friction, not authorship.
            The machine can suggest. The artist still decides.
          </p>
        </div>
      </div>
    </header>
  );
}
