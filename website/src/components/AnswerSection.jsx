import FoundersNoteSection from './FoundersNoteSection';
import SectionMarker from './SectionMarker';

export default function AnswerSection() {
  return (
    <section className="relative z-10 overflow-hidden px-6 pb-24 pt-36 md:px-10 lg:px-14 lg:pb-28 lg:pt-40">
      <div className="panel-shell relative z-10">
        <SectionMarker number="03" title="OUR ANSWER" className="mb-10" />

        <div className="relative overflow-hidden rounded-[2rem] border border-white/14 bg-[#141c28]/82">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_72%,rgba(93,212,240,0.08),transparent_30%),radial-gradient(circle_at_76%_22%,rgba(255,184,77,0.1),transparent_26%)]" />

          <div className="relative grid gap-8 px-6 py-10 sm:px-8 sm:py-12 lg:min-h-[36rem] lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:px-10 lg:py-14 xl:px-12">
            <div className="flex items-end">
              <div className="max-w-[34rem]">
                <div className="font-mono text-[11px] uppercase tracking-[0.34em] text-[#5dd4f0]">
                  Where most tools hide the work, we leave it in your hands.
                </div>
                <h2 className="display-tight mt-4 text-[#f0ebe0]">
                  FLOW STATE,
                  <span className="mt-2 block text-[#ffb84d]">UNLOCKED.</span>
                </h2>
                <p className="mt-5 text-base leading-relaxed text-[#d5dbe7] sm:text-lg">
                  We are not keeping AI out of the room. We are making sure you can see everything it does, change anything it suggests, and walk away knowing the final track is yours -- fully, without asterisks. We call it the glass box: every suggestion is visible, every parameter is editable, and nothing happens behind your back.
                </p>
              </div>
            </div>

            <div className="flex items-center lg:justify-end">
              <div className="w-full max-w-3xl rounded-[1.7rem] border border-white/14 bg-[#101a26]/86 p-8 sm:p-10">
                <p className="font-mono text-[11px] uppercase tracking-[0.34em] text-[#ffb84d]">
                  The line we will not cross
                </p>
                <p className="mt-6 text-lg leading-relaxed text-[#d5dbe7] sm:text-xl">
                  There is a line we will not cross. Tessera will reduce friction -- it will help you get to the sound faster. But it will never make a creative decision on your behalf. Not a small one, not a big one. Because the moment a tool changes the final track from what you imagined, that track is no longer fully yours. And we do not think that is a trade-off worth making.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-20 -mb-20 mt-10 max-w-4xl rounded-[1.8rem] border border-white/14 bg-[#121a24]/86 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)] sm:p-10">
          <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#8d94ab]">From principle to product</div>
          <p className="mt-4 max-w-3xl text-2xl leading-tight text-[#f0ebe0] sm:text-3xl">
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
