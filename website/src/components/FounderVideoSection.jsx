import VideoPlayer from './VideoPlayer';

const FOUNDER_VIDEO_SRC = '/videos/founders-video.mp4';
const FOUNDER_VIDEO_POSTER = '/images/founder-poster.svg';

export default function FounderVideoSection() {
  return (
    <section className="relative z-10">
      <div className="rounded-[2rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(7,10,16,0.92))] p-8 sm:p-10 lg:p-12">
        <div className="mb-8 max-w-3xl">
          <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#8d94ab]">From the founder</div>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[#f0ebe0] sm:text-4xl">
            Why Tessera has to exist.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#c6cfdd]">
            The philosophy is easier to feel when you hear it directly. So the default view should invite the story in gently, not throw a close-up into the middle of the page.
          </p>
        </div>
        <VideoPlayer src={FOUNDER_VIDEO_SRC} poster={FOUNDER_VIDEO_POSTER} />
      </div>
    </section>
  );
}
