import VideoPlayer from './VideoPlayer';
import { ModularGridIllustration, OrbFieldIllustration } from './ConceptIllustrations';

const FOUNDER_VIDEO_SRC = '/videos/founders-video-cropped.mp4';
const FOUNDER_VIDEO_POSTER = '/images/founder-poster.svg';

export default function FounderVideoSection() {
  return (
    <section className="relative z-10 overflow-hidden">
      <div className="relative rounded-[2rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(7,10,16,0.96))] p-5 sm:p-8 lg:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(93,212,240,0.08),transparent_30%),radial-gradient(circle_at_82%_22%,rgba(255,184,77,0.12),transparent_32%)]" />

        <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(11rem,0.46fr)] lg:items-center">
          <div className="relative overflow-hidden rounded-[1.7rem] border border-white/8 bg-black/18 p-6 sm:p-8 lg:p-10">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(7,11,18,0.92),rgba(11,12,18,0.52)_48%,rgba(23,12,10,0.54)_100%)]" />

            <div className="relative">
              <div className="font-mono text-[10px] uppercase tracking-[0.34em] text-[#5dd4f0]">From the founder</div>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.06em] text-[#f0ebe0] sm:text-5xl lg:text-6xl">
                Why Tessera
                <span className="block text-[#ffb84d]">has to exist.</span>
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#d4dbea] sm:text-lg">
                Tessera started from a discomfort with tools that promise total ease. I do not want software that
                replaces the search. I want software that helps sound arrive faster without stripping the artist out of the arrival.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(16rem,0.92fr)]">
                <div className="rounded-[1.4rem] border border-white/8 bg-black/24 p-5 backdrop-blur-sm">
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#8d94ab]">In one line</div>
                  <p className="mt-4 text-2xl font-semibold leading-tight text-[#f0ebe0]">
                    A creative tool should sharpen intent, not replace it.
                  </p>
                </div>

                <div className="grid gap-4">
                  <div className="relative min-h-[10rem] overflow-hidden rounded-[1.4rem] border border-white/8 bg-[#070a10]">
                    <OrbFieldIllustration className="absolute inset-0" />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,10,16,0.1),rgba(7,10,16,0.62)_58%,rgba(7,10,16,0.9))]" />
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#8d94ab]">What the note protects</div>
                      <p className="mt-3 text-lg font-semibold leading-tight text-[#f0ebe0]">
                        The feeling that the final decision is still yours.
                      </p>
                    </div>
                  </div>

                  <div className="relative min-h-[8rem] overflow-hidden rounded-[1.4rem] border border-white/8 bg-[#0d1015]">
                    <ModularGridIllustration className="absolute inset-0 opacity-85" />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,10,16,0.3),rgba(8,10,16,0.82))]" />
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#8d94ab]">Built like an instrument</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative lg:pl-2">
            <div className="mx-auto max-w-[10.8rem] sm:max-w-[11.6rem] lg:ml-auto lg:mr-0 lg:max-w-[11.8rem]">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-full border border-white/10 bg-black/20 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.28em] text-[#8d94ab]">
                  Founder note
                </div>
                <div className="rounded-full border border-[#ffb84d]/18 bg-[#1a110c] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.28em] text-[#ffb84d]">
                  58 sec
                </div>
              </div>

              <VideoPlayer
                src={FOUNDER_VIDEO_SRC}
                poster={FOUNDER_VIDEO_POSTER}
                className="rounded-[1.8rem] border-white/10 bg-[#02040a]"
                aspectClassName="aspect-[4/5]"
                videoClassName="object-cover object-center"
                playButtonClassName="h-12 w-12 sm:h-14 sm:w-14"
                resetOnLeave
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
