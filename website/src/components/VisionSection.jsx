import { ChannelStripMockup } from './ProductShowcase';
import SectionMarker from './SectionMarker';
import { EmberNebulaIllustration } from './ConceptIllustrations';

function RoadmapVisual() {
  const stops = [
    { title: 'EQ', note: 'Available now', accent: 'teal' },
    { title: 'Dynamics', note: 'In build', accent: 'amber' },
    { title: 'Space', note: 'Next layer', accent: 'orange' },
    { title: 'ONE', note: 'Parent shell', accent: 'amber' },
    { title: 'Environment', note: 'Long arc', accent: 'teal' },
  ];

  return (
    <div className="relative flex h-full min-h-[24rem] items-center overflow-hidden bg-[#090714] p-8 sm:p-10 lg:p-12">
      <EmberNebulaIllustration className="absolute inset-0" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,6,14,0.16),rgba(5,6,14,0.82)_82%)]" />
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
        <SectionMarker number="06" title="THE HORIZON" className="mb-10" />

        <div className="mb-10 max-w-4xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.34em] text-[#ffb84d]">
            What comes after the first instrument
          </p>
          <h2 className="display-tight mt-4 text-[#f0ebe0]">
            THIS IS JUST
            <span className="mt-2 block text-[#ffb84d]">THE BEGINNING.</span>
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#c6cfdd]">
            Tessera EQ is the first proof. The larger ambition is a full environment where intelligent tools remain visible,
            tactile, and unmistakably in service of the musician.
          </p>
        </div>

        <div className="space-y-8">
          <div className="overflow-hidden border-y border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(7,10,16,0.92))] lg:border">
            <div className="grid gap-0 lg:grid-cols-[minmax(0,1.08fr)_minmax(21rem,0.92fr)]">
              <div className="min-h-[22rem] lg:min-h-[26rem]">
                <ChannelStripMockup className="h-full min-h-[22rem]" />
              </div>
              <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-12 xl:p-14">
                <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#8d94ab]">In build</div>
                <h3 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-[#f0ebe0] sm:text-5xl">TESSERA ONE</h3>
                <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.26em] text-[#ffb84d]">The parent shell behind the first release</p>
                <p className="mt-6 max-w-xl text-base leading-relaxed text-[#c6cfdd]">
                  Tessera One is where EQ, dynamics, saturation, space, playback, prompting, and taste memory live together.
                  Not one magic window. A connected system the artist can still read and steer.
                </p>
                <button className="mt-8 w-fit rounded-full border border-[#ffb84d]/35 bg-[#ffb84d]/10 px-7 py-3 font-mono text-xs uppercase tracking-[0.28em] text-[#ffe1af] transition-all duration-300 hover:border-[#ffb84d]/60 hover:bg-[#ffb84d]/14">
                  Join the waitlist
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-hidden border-y border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(7,10,16,0.92))] lg:border">
            <div className="max-w-3xl px-8 pt-8 sm:px-10 sm:pt-10 lg:px-12 lg:pt-12 xl:px-14 xl:pt-14">
              <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#8d94ab]">The arc ahead</div>
              <h3 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-[#f0ebe0] sm:text-5xl">A family of tools, not a single trick.</h3>
              <p className="mt-6 text-base leading-relaxed text-[#c6cfdd]">
                Tessera EQ is the first surface. Tessera One is the parent shell taking shape behind it. After that, the aim is a full environment where each tool remains legible, tactile, and artist-first.
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
