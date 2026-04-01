import { ChannelStripMockup } from './ProductShowcase';
import SectionMarker from './SectionMarker';
import ShaderBackground from './ShaderBackground';
import { shaderPresets } from '../shaders/presets';

function RoadmapVisual() {
  const stops = [
    { title: 'EQ', note: 'Available now', accent: 'teal' },
    { title: 'Dynamics', note: 'In build', accent: 'amber' },
    { title: 'Space', note: 'Next layer', accent: 'orange' },
    { title: 'ONE', note: 'Integrated suite', accent: 'amber' },
    { title: 'DAW', note: 'The moonshot', accent: 'teal' },
  ];

  return (
    <div className="relative flex h-full min-h-[26rem] items-center overflow-hidden bg-[#090714] p-8 sm:p-10 lg:p-12">
      <ShaderBackground fragmentShader={shaderPresets.cosmos} opacity={0.86} mixBlendMode="screen" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,6,14,0.10),rgba(5,6,14,0.78)_84%)]" />
      <div className="relative z-10 w-full">
        <div className="flex flex-wrap items-center gap-3 sm:gap-5">
          {stops.map((stop, index) => {
            const theme = stop.accent === 'teal'
              ? 'border-[#5dd4f0]/28 bg-[#5dd4f0]/10 text-[#d5f8ff]'
              : stop.accent === 'amber'
                ? 'border-[#ffb84d]/28 bg-[#ffb84d]/10 text-[#ffe1af]'
                : 'border-[#ff6a33]/28 bg-[#ff6a33]/10 text-[#ffd6c4]';

            return (
              <div key={stop.title} className="flex items-center gap-3 sm:gap-5">
                <div className={`min-w-[8rem] border px-5 py-4 ${theme}`}>
                  <div className="font-mono text-[10px] uppercase tracking-[0.28em]">{stop.note}</div>
                  <div className="mt-2 text-2xl font-semibold tracking-[-0.04em]">{stop.title}</div>
                </div>
                {index < stops.length - 1 && <div className="hidden h-px w-14 bg-gradient-to-r from-white/10 via-white/30 to-white/10 sm:block" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function VisionSection() {
  return (
    <section id="vision" className="relative z-10 px-6 pb-28 pt-24 md:px-10 lg:px-14 lg:pb-32">
      <div className="panel-shell">
        <SectionMarker number="06" title="THE VISION" className="mb-10" />

        <div className="mb-10 max-w-4xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.34em] text-[#ffb84d]">
            This is only the first product
          </p>
          <h2 className="display-tight mt-4 text-[#f0ebe0]">
            THIS IS JUST
            <span className="mt-2 block text-[#ffb84d]">THE BEGINNING.</span>
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#c6cfdd]">
            Tessera EQ is the entry point. The real ambition is a full environment where every intelligent tool stays transparent, tactile, and in service of the musician.
          </p>
        </div>

        <div className="space-y-8">
          <div className="overflow-hidden border-y border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(7,10,16,0.92))] lg:border">
            <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.9fr)]">
              <div className="min-h-[24rem] lg:min-h-[30rem]">
                <ChannelStripMockup className="h-full" />
              </div>
              <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-12 xl:p-14">
                <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#8d94ab]">Coming 2026</div>
                <h3 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-[#f0ebe0] sm:text-5xl">TESSERA ONE</h3>
                <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.26em] text-[#ffb84d]">The complete AI mixing suite</p>
                <p className="mt-6 max-w-xl text-base leading-relaxed text-[#c6cfdd]">
                  EQ, dynamics, saturation, space, utility, and learning all connected by one intent layer. A system that understands the mix as a whole, but still exposes every decision as something you can tweak and own.
                </p>
                <button className="mt-8 w-fit rounded-full border border-[#ffb84d]/35 bg-[#ffb84d]/10 px-7 py-3 font-mono text-xs uppercase tracking-[0.28em] text-[#ffe1af] transition-all duration-300 hover:border-[#ffb84d]/60 hover:bg-[#ffb84d]/14">
                  Join the waitlist
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-hidden border-y border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(7,10,16,0.92))] lg:border">
            <div className="max-w-3xl px-8 pt-8 sm:px-10 sm:pt-10 lg:px-12 lg:pt-12 xl:px-14 xl:pt-14">
              <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#8d94ab]">The moonshot</div>
              <h3 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-[#f0ebe0] sm:text-5xl">TESSERA DAW</h3>
              <p className="mt-6 text-base leading-relaxed text-[#c6cfdd]">
                A digital audio workspace where plugins, timeline, and artist all communicate through semantic intent without hiding the engineering underneath. New interaction model. Same values.
              </p>
            </div>
            <div className="mt-8">
              <RoadmapVisual />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
