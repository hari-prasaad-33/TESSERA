import SectionMarker from './SectionMarker';
import ShaderBackground from './ShaderBackground';
import { shaderPresets } from '../shaders/presets';

export default function HeroSection({ onExplore }) {
  return (
    <header id="home" className="relative z-10 min-h-screen overflow-visible px-6 pb-16 pt-28 md:px-10 lg:px-14 lg:pb-20">
      <div className="absolute inset-0">
        <ShaderBackground
          fragmentShader={shaderPresets.hero}
          mixBlendMode="screen"
          opacity={0.42}
          className="scale-[1.02]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,205,146,0.14),transparent_18%),radial-gradient(circle_at_82%_66%,rgba(255,106,51,0.12),transparent_22%),linear-gradient(90deg,rgba(7,7,8,0.96)_0%,rgba(7,7,8,0.9)_26%,rgba(7,7,8,0.58)_46%,rgba(7,7,8,0.3)_64%,rgba(7,7,8,0.56)_100%)]" />
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
