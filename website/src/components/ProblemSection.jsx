import { useEffect, useState } from 'react';
import SectionMarker from './SectionMarker';
import ShaderBackground from './ShaderBackground';
import { shaderPresets } from '../shaders/presets';

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
    <section id="philosophy" className="relative z-10 overflow-hidden px-6 py-24 md:px-10 lg:px-14 lg:py-28">
      <div className="absolute inset-y-0 right-0 w-full lg:w-[54vw]">
        <ShaderBackground
          fragmentShader={shaderPresets.rain}
          mixBlendMode="screen"
          opacity={0.86}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,6,17,0.92)_0%,rgba(6,6,17,0.70)_30%,rgba(6,6,17,0.18)_54%,rgba(6,6,17,0.08)_100%),linear-gradient(180deg,rgba(7,9,14,0.12),rgba(7,9,14,0.74)_86%)]" />
      </div>

      <div className="panel-shell relative z-10">
        <SectionMarker number="02" title="THE PROBLEM" className="mb-10" />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.94fr)_minmax(22rem,1.06fr)] lg:min-h-[42rem]">
          <div className="flex flex-col justify-center py-6 lg:pr-8">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.34em] text-[#ffb84d]">
              Faster is not always deeper
            </p>
            <h2 className="display-tight text-[#f0ebe0]">
              THE PROBLEM
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#c6cfdd]">
              The danger is not that tools get better. It is that the creative act gets compressed into a result,
              and the result becomes all that matters.
            </p>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-[#8d94ab]">
              Once the process is flattened into convenience, the artist is left with a harder question:
              what were we really here for in the first place?
            </p>
          </div>

          <div className="relative flex min-h-[28rem] items-end lg:min-h-[42rem]">
            <div className="w-full rounded-[1.8rem] border border-white/10 bg-black/28 p-5 backdrop-blur-md sm:p-6 lg:ml-auto lg:max-w-[40rem]">
              <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.32em] text-[#8d94ab]">What are we protecting?</div>
              <p className="mb-5 max-w-2xl text-sm leading-relaxed text-[#b8c1d2]">
                Not a checklist. A private reason. Maybe it sounded something like this:
              </p>
              <div className="space-y-3">
                {questions.map((question, index) => (
                  <div
                    key={question}
                    className={`rounded-[1.1rem] border px-4 py-3 text-sm leading-relaxed transition-all duration-500 ${
                      index === activeIndex
                        ? 'border-[#ffb84d]/30 bg-[#ffb84d]/10 text-[#f6ecdb]'
                        : 'border-white/8 bg-white/[0.03] text-[#b7bfd0]'
                    }`}
                  >
                    {question}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
