import FoundersNoteSection from './FoundersNoteSection';
import SectionMarker from './SectionMarker';

export default function AnswerSection() {
  return (
    <section className="relative z-10 overflow-hidden px-6 pb-24 pt-36 md:px-10 lg:px-14 lg:pb-28 lg:pt-40">
      <div className="panel-shell relative z-10">
        <SectionMarker number="03" title="OUR ANSWER" className="mb-10" />

        <div className="grid gap-14 lg:min-h-[32rem] lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-end lg:gap-16">
          <div className="border-l-2 border-[#5dd4f0]/35 pl-6 sm:pl-8">
            <div className="font-mono text-[11px] uppercase tracking-[0.34em] text-[#5dd4f0]">
              Where most tools hide the work, we leave it in your hands.
            </div>
            <h2 className="texture-type-shadow display-tight mt-4 text-[#f0ebe0]">
              FLOW STATE,
              <span className="mt-2 block text-[#ffb84d]">UNLOCKED.</span>
            </h2>
            <p className="texture-type-shadow-soft mt-5 max-w-[34rem] text-lg leading-relaxed text-[#dae0ec] sm:text-xl">
              We are not keeping AI out of the room. We are making sure you can see everything it does, change anything it suggests, and walk away knowing the final track is yours -- fully, without asterisks. We call it the glass box: every suggestion is visible, every parameter is editable, and nothing happens behind your back.
            </p>
          </div>

          <div className="lg:pl-2">
            <div className="border-l-2 border-[#ffb84d]/45 pl-6 sm:pl-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.34em] text-[#ffb84d]">The line we will not cross</p>
              <p className="texture-type-shadow-soft mt-5 text-xl leading-relaxed text-[#e8ecf4] sm:text-2xl">
                There is a line we will not cross. Tessera will reduce friction -- it will help you get to the sound faster. But it will never make a creative decision on your behalf. Not a small one, not a big one. Because the moment a tool changes the final track from what you imagined, that track is no longer fully yours. And we do not think that is a trade-off worth making.
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-20 -mb-20 mt-16 max-w-4xl border-l-2 border-white/15 pl-6 sm:mt-20 sm:pl-8">
          <div className="font-mono text-[11px] uppercase tracking-[0.32em] text-[#8d94ab]">From principle to product</div>
          <p className="texture-type-shadow mt-4 max-w-3xl text-2xl leading-tight text-[#f0ebe0] sm:text-3xl">
            That is the principle. Now here is what it looks like when it is running. We build in the open -- starting with the first product.
          </p>
        </div>

        <div className="mt-28">
          <FoundersNoteSection />
        </div>
      </div>
    </section>
  );
}
