import FounderVideoSection from './FounderVideoSection';
import SectionMarker from './SectionMarker';
import ShaderBackground from './ShaderBackground';
import { shaderPresets } from '../shaders/presets';

export default function AnswerSection() {
  return (
    <section className="relative z-10 overflow-hidden px-6 pb-24 pt-36 md:px-10 lg:px-14 lg:pb-28 lg:pt-40">
      <div className="absolute inset-y-0 left-0 w-full lg:w-[52vw]">
        <ShaderBackground
          fragmentShader={shaderPresets.pulse}
          mixBlendMode="screen"
          opacity={0.88}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,5,24,0.10)_0%,rgba(8,5,24,0.08)_24%,rgba(8,5,24,0.52)_58%,rgba(8,5,24,0.90)_100%),linear-gradient(180deg,rgba(6,8,17,0.10),rgba(6,8,17,0.84)_86%)]" />
      </div>

      <div className="panel-shell relative z-10">
        <SectionMarker number="03" title="OUR ANSWER" className="mb-10" />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(22rem,1.08fr)] lg:min-h-[44rem]">
          <div className="relative flex min-h-[28rem] items-end lg:min-h-[44rem] lg:pr-6">
            <div className="w-full rounded-[1.8rem] border border-white/10 bg-black/24 p-6 backdrop-blur-md sm:p-7 lg:max-w-[34rem]">
              <div className="font-mono text-[11px] uppercase tracking-[0.34em] text-[#5dd4f0]">
                Where most tools hide the work, we leave it in your hands.
              </div>
              <h2 className="display-tight mt-4 text-[#f0ebe0]">
                FLOW STATE,
                <span className="mt-2 block text-[#ffb84d]">UNLOCKED.</span>
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[#d5dbe7] sm:text-lg">
                We are not keeping AI out of the room. We are making sure you can see everything it does, change anything it suggests, and walk away knowing the final track is yours -- fully, without asterisks. We call it the glass box: every suggestion is visible, every parameter is editable, and nothing happens behind your back.
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(7,10,16,0.92))] p-8 sm:p-10 lg:p-12">
            <div
              className="absolute inset-0 opacity-[0.08] mix-blend-screen"
              style={{
                backgroundImage: "url('/images/textures/lichen-rock-normal.jpg')",
                backgroundPosition: 'center',
                backgroundSize: '520px',
                filter: 'grayscale(1) sepia(0.2) saturate(0.52) brightness(0.8)',
              }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(7,10,16,0.14)_34%,rgba(7,10,16,0.1)_100%)]" />
            <div className="relative">
            <p className="font-mono text-[11px] uppercase tracking-[0.34em] text-[#ffb84d]">
              The line we will not cross
            </p>
            <p className="mt-6 text-lg leading-relaxed text-[#d5dbe7] sm:text-xl">
              There is a line we will not cross. Tessera will reduce friction -- it will help you get to the sound faster. But it will never make a creative decision on your behalf. Not a small one, not a big one. Because the moment a tool changes the final track from what you imagined, that track is no longer fully yours. And we do not think that is a trade-off worth making.
            </p>
            </div>
          </div>
        </div>

        <div className="relative z-20 -mb-20 mt-10 max-w-4xl rounded-[1.8rem] border border-white/10 bg-[linear-gradient(135deg,rgba(8,10,16,0.92),rgba(18,10,8,0.82))] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8">
          <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-[#8d94ab]">From principle to product</div>
          <p className="mt-4 max-w-3xl text-2xl leading-tight text-[#f0ebe0] sm:text-3xl">
            That is the principle. Now here is what it looks like when it is running. We build in the open -- starting with the first product.
          </p>
        </div>

        <div className="mt-28">
          <FounderVideoSection />
        </div>
      </div>
    </section>
  );
}
