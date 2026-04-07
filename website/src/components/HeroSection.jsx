import { useEffect, useState } from 'react';
import SectionMarker from './SectionMarker';

/** How far the mission block sits below its final position before the first scroll intent. */
const SLIDE_OFFSET_PX = 56;
/** Document scroll that also triggers settle (backup if wheel events are swallowed). */
const SCROLL_SETTLE_PX = 16;

function getScrollY() {
  return window.scrollY || document.documentElement?.scrollTop || document.body?.scrollTop || 0;
}

export default function HeroSection() {
  const [slideSettled, setSlideSettled] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setSlideSettled(true);
      return;
    }

    const settle = () => setSlideSettled(true);

    const onScroll = () => {
      if (getScrollY() >= SCROLL_SETTLE_PX) settle();
    };

    const onWheel = (e) => {
      if (e.deltaY > 0) settle();
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true, capture: true });
    window.addEventListener('wheel', onWheel, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('wheel', onWheel);
    };
  }, []);

  return (
    <header id="home" className="relative z-10 min-h-screen overflow-x-clip px-6 pb-16 pt-28 md:px-10 lg:px-14 lg:pb-20">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/textures/rogland-clear-night.jpg')",
            opacity: 0.82,
            filter: 'saturate(1.06) contrast(1.04) brightness(1.04)',
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,3,2,0.94)_0%,rgba(5,4,3,0.84)_16%,rgba(5,4,3,0.48)_36%,rgba(5,4,3,0.2)_58%,rgba(5,4,3,0.34)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.26)_0%,rgba(0,0,0,0.1)_48%,transparent_78%)]" />
      </div>

      <div className="panel-shell relative z-10 flex min-h-[calc(100vh-7rem)] min-w-0 items-end">
        <div className="grid w-full min-w-0 gap-8">
          <div
            className="relative z-10 max-w-full min-w-0 pb-4 will-change-transform md:max-w-5xl"
            style={{
              transform: slideSettled ? 'translateY(0)' : `translateY(${SLIDE_OFFSET_PX}px)`,
              transition: 'transform 0.75s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            <SectionMarker number="01" title="THE MISSION" className="mb-8" />
            <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.34em] text-[#5dd4f0]">
              Human-first audio intelligence
            </p>
            <h1 className="display-bleed max-w-full text-[#f0ebe0] sm:max-w-[12ch]">
              THE SOUL OF MUSIC CREATION
              <span className="mt-3 block text-[#ffb84d]">IS NOT FOR SALE.</span>
            </h1>
            <p className="texture-type-shadow-soft mt-8 max-w-2xl text-xl leading-relaxed text-[#c6cfdd] md:text-2xl">
              Every new tool promises to get you there faster. But &quot;there&quot; was never the point. The hours you spend shaping a sound -- that is not friction to be removed. That is the work itself. Tessera exists for the part of music that still has to feel yours.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
