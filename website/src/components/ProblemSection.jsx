import { useEffect, useState } from 'react';
import SectionMarker from './SectionMarker';
import ShaderBackground from './ShaderBackground';
import { shaderPresets } from '../shaders/presets';

const reasons = [
  'To be recognized and appreciated for our taste.',
  'To give listeners the strongest possible emotional experience.',
  'To say something that only we could have made.',
  'To chase that electric, fully present flow state.',
  'To hold onto the feeling of: this is mine.',
];

export default function ProblemSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((value) => (value + 1) % reasons.length);
    }, 2600);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section id="philosophy" className="relative z-10 px-6 py-24 md:px-10 lg:px-14 lg:py-28">
      <div className="panel-shell">
        <SectionMarker number="02" title="THE PROBLEM" className="mb-10" />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(22rem,1.1fr)]">
          <div className="flex flex-col justify-center rounded-[2rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(7,10,16,0.92))] p-8 sm:p-10 lg:p-12">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.34em] text-[#ffb84d]">
              Faster is not always deeper
            </p>
            <h2 className="display-tight text-[#f0ebe0]">
              THE PROBLEM
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#c6cfdd]">
              When AI finishes the track in seconds, the speed can flatten the emotional weight of making it.
              It pushes us back to the first question: why did we show up in the studio at all?
            </p>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-[#8d94ab]">
              The danger is not that tools get better. It is that the creative act gets compressed into a result,
              and the result becomes all that matters.
            </p>
          </div>

          <div className="relative min-h-[30rem] overflow-hidden rounded-[2rem] border border-white/8 bg-[#080d14] lg:min-h-[38rem]">
            <ShaderBackground
              fragmentShader={shaderPresets.rain}
              mixBlendMode="screen"
              opacity={0.8}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,9,14,0.18),rgba(7,9,14,0.82)_78%)]" />

            <div className="absolute inset-x-0 top-0 z-10 p-6 sm:p-8">
              <div className="inline-flex rounded-full border border-white/10 bg-black/25 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.26em] text-[#d5f8ff] backdrop-blur-md">
                The human element
              </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 z-10 p-6 sm:p-8">
              <div className="rounded-[1.8rem] border border-white/10 bg-black/28 p-5 backdrop-blur-md sm:p-6">
                <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.32em] text-[#8d94ab]">What are we protecting?</div>
                <div className="space-y-3">
                  {reasons.map((reason, index) => (
                    <div
                      key={reason}
                      className={`rounded-[1.1rem] border px-4 py-3 text-sm leading-relaxed transition-all duration-500 ${
                        index === activeIndex
                          ? 'border-[#ffb84d]/30 bg-[#ffb84d]/10 text-[#f6ecdb]'
                          : 'border-white/8 bg-white/[0.03] text-[#b7bfd0]'
                      }`}
                    >
                      {reason}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
