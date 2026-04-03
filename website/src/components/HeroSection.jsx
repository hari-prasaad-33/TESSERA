import SectionMarker from './SectionMarker';
import ShaderBackground from './ShaderBackground';
import { ModularGridIllustration } from './ConceptIllustrations';
import { shaderPresets } from '../shaders/presets';

export default function HeroSection({ onExplore }) {
  return (
    <header id="home" className="relative z-10 min-h-screen overflow-visible px-6 pb-16 pt-28 md:px-10 lg:px-14 lg:pb-20">
      <div className="absolute inset-y-0 right-0 w-full lg:w-[58vw]">
        <ModularGridIllustration className="absolute inset-0" />
        <ShaderBackground
          fragmentShader={shaderPresets.hero}
          mixBlendMode="screen"
          opacity={0.42}
          className="scale-[1.06]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_22%,rgba(255,205,146,0.16),transparent_20%),radial-gradient(circle_at_84%_68%,rgba(255,106,51,0.14),transparent_22%),linear-gradient(90deg,rgba(5,5,26,0.94)_0%,rgba(5,5,26,0.82)_24%,rgba(5,5,26,0.42)_44%,rgba(5,5,26,0.12)_66%,rgba(5,5,26,0.18)_100%)]" />
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
              Every new tool promises to get you there faster. But &quot;there&quot; was never the point. The hours you spend shaping a sound -- that is not friction to be removed. That is the work itself. Tessera exists for the part of music that still has to feel yours.
            </p>
          </div>

          <div className="hidden lg:block" />
        </div>
      </div>
    </header>
  );
}
