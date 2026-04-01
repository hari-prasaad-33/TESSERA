import VideoPlayer from './VideoPlayer';
import { EmberNebulaIllustration } from './ConceptIllustrations';

const FOUNDER_VIDEO_SRC = '/videos/founders-video-cropped.mp4';
const FOUNDER_VIDEO_POSTER = '/images/founder-poster.svg';

export default function FounderVideoSection() {
  return (
    <section className="relative z-10 overflow-hidden">
      <div className="relative rounded-[2rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(7,10,16,0.96))] p-5 sm:p-8 lg:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(93,212,240,0.09),transparent_32%),radial-gradient(circle_at_82%_22%,rgba(255,184,77,0.10),transparent_34%)]" />

        <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1.12fr)_minmax(14rem,0.52fr)] lg:items-center">
          <div className="relative overflow-hidden rounded-[1.7rem] border border-white/8 bg-black/18 p-6 sm:p-8 lg:p-10">
            <div className="relative">
              <div className="font-mono text-[10px] uppercase tracking-[0.34em] text-[#5dd4f0]">From the founder</div>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.06em] text-[#f0ebe0] sm:text-5xl lg:text-6xl">
                Why Tessera
                <span className="block text-[#ffb84d]">has to exist.</span>
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#d4dbea] sm:text-lg">
                Tessera started from a discomfort with creative tools that promise total ease. I do not want software that
                replaces the search. I want software that shortens the distance to sound without flattening the reason we create.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-[minmax(0,1.1fr)_minmax(14rem,0.9fr)]">
                <div className="rounded-[1.4rem] border border-white/8 bg-black/24 p-5 backdrop-blur-sm">
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#8d94ab]">In one line</div>
                  <p className="mt-4 text-xl font-semibold leading-tight text-[#f0ebe0]">
                    If a tool saves time by erasing authorship, it is too expensive.
                  </p>
                </div>

                <div className="relative min-h-[12rem] overflow-hidden rounded-[1.4rem] border border-white/8 bg-[#070a10]">
                  <EmberNebulaIllustration className="absolute inset-0" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,10,16,0.12),rgba(7,10,16,0.54)_54%,rgba(7,10,16,0.88))]" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#8d94ab]">What the note is about</div>
                    <p className="mt-3 text-lg font-semibold leading-tight text-[#f0ebe0]">
                      Keeping the human weight of the decision inside the tool.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative lg:pl-2">
            <div className="mx-auto max-w-[12rem] sm:max-w-[13rem] lg:ml-auto lg:mr-0 lg:max-w-[13.5rem]">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-full border border-white/10 bg-black/20 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.28em] text-[#8d94ab]">
                  One take
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
                playButtonClassName="h-14 w-14 sm:h-16 sm:w-16"
                resetOnLeave
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
