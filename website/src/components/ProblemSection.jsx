import { useEffect, useState } from 'react';
import SectionMarker from './SectionMarker';

const questions = [
  'Was it to hear your own taste taking shape in real time?',
  'Was it to chase the moment where intuition finally becomes form?',
  'Was it to make something no one else could have made in your place?',
  'Was it to feel fully inside the work, not merely finished with it?',
  'Was it to be able to say, when it lands: this is mine?',
];

export default function ProblemSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((value) => (value + 1) % questions.length);
    }, 3200);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section id="philosophy" className="relative z-10 overflow-hidden px-6 pb-24 pt-48 md:px-10 md:pt-52 lg:px-14 lg:pb-28 lg:pt-56">
      <div className="panel-shell relative z-10">
        <SectionMarker number="02" title="THE PROBLEM" className="mb-10" />

        <div className="grid gap-10 lg:min-h-[26rem]">
          <div className="max-w-4xl py-8">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.34em] text-[#ffb84d]">
              The quiet part no one is saying.
            </p>
            <h2 className="texture-type-shadow display-tight text-[#f0ebe0]">THE PROBLEM</h2>
            <p className="texture-type-shadow-soft mt-6 max-w-xl text-xl leading-relaxed text-[#c6cfdd] sm:text-2xl">
              The tools keep getting better. That is not the problem. The problem is what happens to the creative act when every difficult step gets compressed into a shortcut. When the gap between nothing and a finished track becomes trivially small, the question stops being &quot;how do I get there&quot; and starts being &quot;why does getting there even matter anymore.&quot;
            </p>
          </div>
        </div>

        <div className="relative z-10 -mb-20 mt-12 lg:mt-20">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:items-end lg:gap-16">
            <div className="border-l-2 border-[#ffb84d]/35 pl-6 sm:pl-8">
              <div className="font-mono text-[11px] uppercase tracking-[0.32em] text-[#8d94ab]">What are we protecting?</div>
              <p className="texture-type-shadow mt-4 max-w-md text-2xl leading-tight text-[#f0ebe0] sm:text-3xl">
                Not a checklist. A private reason for starting in the first place.
              </p>
              <p className="texture-type-shadow-soft mt-4 max-w-md text-base leading-relaxed text-[#c7cfdd] sm:text-lg">
                Maybe it sounds less like a mission statement and more like the voice that brought you into the room.
              </p>
            </div>

            <div className="border-l-2 border-white/20 pl-6 sm:pl-8 lg:pt-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#8d94ab]">Ask yourself</p>
              <div
                className="relative mt-5 min-h-[8rem] sm:min-h-[9rem] lg:min-h-[9.5rem]"
                aria-live="polite"
                aria-atomic="true"
              >
                {questions.map((question, index) => (
                  <p
                    key={question}
                    className={`absolute left-0 top-0 max-w-xl text-xl leading-snug text-[#e8e4dc] transition-all duration-700 ease-out sm:text-2xl lg:text-[1.45rem] lg:leading-snug ${
                      index === activeIndex
                        ? 'translate-y-0 opacity-100'
                        : 'pointer-events-none translate-y-1 opacity-0'
                    }`}
                    aria-hidden={index !== activeIndex}
                  >
                    {index === activeIndex ? (
                      <span className="text-[#ffb84d]">&mdash; </span>
                    ) : null}
                    {question}
                  </p>
                ))}
              </div>
              <div className="mt-8 flex gap-2" role="presentation" aria-hidden>
                {questions.map((_, index) => (
                  <span
                    key={index}
                    className={`h-1 rounded-full transition-all duration-500 ${
                      index === activeIndex ? 'w-6 bg-[#ffb84d]/90' : 'w-1 bg-white/20'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <p className="texture-type-shadow-soft mt-14 max-w-2xl border-l-2 border-white/15 pl-6 text-base leading-relaxed text-[#b8c1d2] sm:mt-16 sm:pl-8 sm:text-lg">
            We cannot guess it exactly. It is too personal. But whatever it was -- that is what we are building around.
          </p>
        </div>
      </div>
    </section>
  );
}
