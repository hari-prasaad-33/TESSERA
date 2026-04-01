import VideoPlayer from './VideoPlayer';
import ShaderBackground from './ShaderBackground';
import { shaderPresets } from '../shaders/presets';

const FOUNDER_VIDEO_SRC = '/videos/founders-video.mp4';
const FOUNDER_VIDEO_POSTER = '/images/founder-poster.svg';

const talkingPoints = [
  'A creative tool should sharpen intent, not replace it.',
  'The artist stays in the loop, in control, and in the credits.',
  'Great software should feel like an instrument, not a vending machine.',
];

export default function FounderVideoSection() {
  return (
    <section className="relative z-10 overflow-hidden">
      <div className="relative rounded-[2rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(7,10,16,0.96))] p-5 sm:p-8 lg:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(93,212,240,0.09),transparent_32%),radial-gradient(circle_at_82%_22%,rgba(255,184,77,0.10),transparent_34%)]" />

        <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1.12fr)_minmax(19rem,0.72fr)] lg:items-center">
          <div className="relative overflow-hidden rounded-[1.7rem] border border-white/8 bg-black/18 p-6 sm:p-8 lg:p-10">
            <div className="absolute inset-0">
              <ShaderBackground
                fragmentShader={shaderPresets.pulse}
                opacity={0.42}
                mixBlendMode="screen"
              />
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(6,12,20,0.86),rgba(7,10,16,0.54)_44%,rgba(23,12,10,0.56)_100%)]" />
            </div>

            <div className="relative">
              <div className="font-mono text-[10px] uppercase tracking-[0.34em] text-[#5dd4f0]">From the founder</div>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.06em] text-[#f0ebe0] sm:text-5xl lg:text-6xl">
                Why Tessera
                <span className="block text-[#ffb84d]">has to exist.</span>
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#d4dbea] sm:text-lg">
                The story lands better when the video feels like a deliberate note, not a jump scare. So we are treating it more like an editorial portrait: tighter, calmer, and better integrated into the page.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-[minmax(0,1.1fr)_minmax(14rem,0.9fr)]">
                <div className="rounded-[1.4rem] border border-white/8 bg-black/24 p-5 backdrop-blur-sm">
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#8d94ab]">Core stance</div>
                  <ul className="mt-4 space-y-3 text-sm leading-relaxed text-[#d3dbe7]">
                    {talkingPoints.map((point) => (
                      <li key={point} className="flex gap-3">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#ffb84d]" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="relative min-h-[12rem] overflow-hidden rounded-[1.4rem] border border-white/8 bg-[#070a10]">
                  <ShaderBackground
                    fragmentShader={shaderPresets.rain}
                    opacity={0.66}
                    mixBlendMode="screen"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,10,16,0.08),rgba(7,10,16,0.58)_58%,rgba(7,10,16,0.88))]" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#8d94ab]">Founder note</div>
                    <p className="mt-3 text-lg font-semibold leading-tight text-[#f0ebe0]">
                      Process over shortcuts. Taste over autocomplete.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative lg:pl-2">
            <div className="mx-auto max-w-[24rem] lg:ml-auto lg:mr-0">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#8d94ab]">Portrait playback</div>
                  <p className="mt-2 text-sm leading-relaxed text-[#c7cfdd]">
                    Cropped in the layout so the phone borders fall away and the note feels intentional.
                  </p>
                </div>
                <div className="rounded-full border border-[#5dd4f0]/20 bg-[#071019] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.24em] text-[#5dd4f0]">
                  tighter frame
                </div>
              </div>

              <VideoPlayer
                src={FOUNDER_VIDEO_SRC}
                poster={FOUNDER_VIDEO_POSTER}
                className="rounded-[1.8rem] border-white/10 bg-[#02040a]"
                aspectClassName="aspect-[4/5]"
                videoClassName="object-cover object-center scale-[1.24]"
                playButtonClassName="h-16 w-16 sm:h-[4.5rem] sm:w-[4.5rem]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
