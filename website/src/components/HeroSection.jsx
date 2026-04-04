import SectionMarker from './SectionMarker';
import ShaderBackground from './ShaderBackground';
import { shaderPresets } from '../shaders/presets';

export default function HeroSection() {
  return (
    <header id="home" className="relative z-10 min-h-screen overflow-visible px-6 pb-16 pt-28 md:px-10 lg:px-14 lg:pb-20">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/textures/rogland-clear-night.jpg')",
            opacity: 0.68,
            filter: 'saturate(1.06) contrast(1.04)',
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,4,3,0.97)_0%,rgba(5,4,3,0.82)_18%,rgba(5,4,3,0.42)_38%,rgba(5,4,3,0.18)_55%,rgba(5,4,3,0.35)_100%)]" />
        <ShaderBackground
          fragmentShader={shaderPresets.hero}
          mixBlendMode="screen"
          opacity={0.2}
          className="scale-[1.02]"
        />
      </div>

      <div className="panel-shell relative z-10 flex min-h-[calc(100vh-7rem)] items-end">
        <div className="grid w-full gap-8">
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
              Every new tool promises to get you there faster. But &quot;there&quot; was never the point. The hours you spend shaping a sound -- that is not friction to be removed. That is the work itself. Tessera exists for the part of music that still has to feel yours.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
