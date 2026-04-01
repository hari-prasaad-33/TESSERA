import SectionMarker from './SectionMarker';
import { EmberNebulaIllustration, TesseractIllustration } from './ConceptIllustrations';

function RoadmapVisual() {
  const stops = [
    { title: 'EQ', note: 'Available now', accent: 'teal' },
    { title: 'Dynamics', note: 'In build', accent: 'amber' },
    { title: 'Space', note: 'Next layer', accent: 'orange' },
    { title: 'ONE', note: 'Parent shell', accent: 'amber' },
    { title: 'Environment', note: 'Long arc', accent: 'teal' },
  ];

  return (
    <div className="relative flex h-full min-h-[26rem] items-center overflow-hidden bg-[#090714] p-8 sm:p-10 lg:p-12">
      <EmberNebulaIllustration className="absolute inset-0" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,6,14,0.16),rgba(5,6,14,0.78)_84%)]" />
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
            Why the name matters
          </p>
          <h2 className="display-tight mt-4 text-[#f0ebe0]">
            FROM TESSERACT,
            <span className="mt-2 block text-[#ffb84d]">TESSERA.</span>
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#c6cfdd]">
            In Interstellar, the tesseract is a space where distant points can still be touched together. That image stuck with us.
            The ambition here is similar: sound, interface, engineering, and authorship should stay connected instead of being pulled apart.
          </p>
        </div>

        <div className="space-y-8">
          <div className="overflow-hidden border-y border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(7,10,16,0.92))] lg:border">
            <div className="grid gap-0 lg:grid-cols-[minmax(0,0.96fr)_minmax(20rem,1.04fr)]">
              <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-12 xl:p-14">
                <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#8d94ab]">The metaphor</div>
                <h3 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-[#f0ebe0] sm:text-5xl">A tool that keeps far-apart things connected.</h3>
                <p className="mt-6 max-w-xl text-base leading-relaxed text-[#c6cfdd]">
                  Prompt and parameter. Emotion and engineering. Speed and authorship. The point is not to collapse everything into one magic outcome.
                  It is to make the distances shorter without losing the structure that lets the artist stay present.
                </p>
              </div>
              <div className="min-h-[24rem] lg:min-h-[30rem]">
                <TesseractIllustration className="h-full" />
              </div>
            </div>
          </div>

          <div className="overflow-hidden border-y border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(7,10,16,0.92))] lg:border">
            <div className="max-w-3xl px-8 pt-8 sm:px-10 sm:pt-10 lg:px-12 lg:pt-12 xl:px-14 xl:pt-14">
              <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#8d94ab]">The arc ahead</div>
              <h3 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-[#f0ebe0] sm:text-5xl">A family of tools, not a single trick.</h3>
              <p className="mt-6 text-base leading-relaxed text-[#c6cfdd]">
                Tessera EQ is the first proof. Tessera One is the parent shell taking shape behind it. After that, the aim is a full environment where each tool remains legible, tactile, and artist-first.
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
