import { useEffect, useState } from 'react';
import SectionMarker from './SectionMarker';
import ShaderBackground from './ShaderBackground';
import { OrbFieldIllustration } from './ConceptIllustrations';
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
    <section id="philosophy" className="relative z-10 overflow-hidden px-6 pb-24 pt-36 md:px-10 lg:px-14 lg:pb-28 lg:pt-40">
      <div className="absolute inset-y-0 right-0 w-full lg:w-[54vw]">
        <ShaderBackground
          fragmentShader={shaderPresets.rain}
          mixBlendMode="screen"
          opacity={0.86}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_24%,rgba(255,184,77,0.16),transparent_24%),linear-gradient(90deg,rgba(6,6,17,0.94)_0%,rgba(6,6,17,0.74)_32%,rgba(6,6,17,0.2)_58%,rgba(6,6,17,0.08)_100%),linear-gradient(180deg,rgba(7,9,14,0.12),rgba(7,9,14,0.78)_86%)]" />
      </div>

      <div className="panel-shell relative z-10">
        <SectionMarker number="02" title="THE PROBLEM" className="mb-10" />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.04fr)_minmax(18rem,0.96fr)] lg:min-h-[30rem] lg:items-end">
          <div className="flex flex-col justify-center py-6 lg:pr-8">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.34em] text-[#ffb84d]">
              Faster is not always deeper
            </p>
            <h2 className="display-tight text-[#f0ebe0]">THE PROBLEM</h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#c6cfdd]">
              The danger is not that tools get better. It is that the creative act gets compressed into a result,
              and the result becomes all that matters.
            </p>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-[#8d94ab]">
              Once the process is flattened into convenience, the artist is left with a harder question:
              what were we really here for in the first place?
            </p>
          </div>

          <div className="relative min-h-[14rem] overflow-hidden rounded-[1.8rem] border border-white/8 bg-black/18">
            <OrbFieldIllustration className="absolute inset-0" />
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(8,10,16,0.86),rgba(8,10,16,0.36)_42%,rgba(24,14,9,0.46)_100%)]" />
            <div className="relative flex h-full items-end p-6 sm:p-8">
              <p className="max-w-md text-2xl leading-tight text-[#f0ebe0] sm:text-3xl">
                The loss is subtle:
                <span className="block text-[#ffb84d]">the result survives, but the reason starts disappearing.</span>
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-20 -mb-20 mt-12 lg:mt-14">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(10,12,18,0.94),rgba(17,11,9,0.82))] p-6 shadow-[0_32px_90px_rgba(0,0,0,0.48)] backdrop-blur-xl sm:p-8 lg:p-10">
            <div className="absolute inset-y-0 right-0 hidden w-[38%] opacity-55 lg:block">
              <OrbFieldIllustration className="h-full" />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,12,18,0.86),rgba(10,12,18,0.14))]" />
            </div>

            <div className="relative grid gap-8 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:items-start">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#8d94ab]">What are we protecting?</div>
                <p className="mt-4 max-w-md text-2xl leading-tight text-[#f0ebe0] sm:text-3xl">
                  Not a checklist. A private reason for starting in the first place.
                </p>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-[#c7cfdd] sm:text-base">
                  Maybe it sounds less like a mission statement and more like the voice that brought you into the room.
                </p>
              </div>

              <div className="space-y-3">
                {questions.map((question, index) => (
                  <div
                    key={question}
                    className={`rounded-[1.1rem] border px-4 py-3 text-sm leading-relaxed transition-all duration-500 sm:px-5 sm:py-4 sm:text-base ${
                      index === activeIndex
                        ? 'border-[#ffb84d]/30 bg-[#ffb84d]/12 text-[#f6ecdb]'
                        : 'border-white/8 bg-white/[0.03] text-[#c0c8d7]'
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
