import React, { useRef, useState, useEffect } from 'react';
import IllustrationPlaceholder from './IllustrationPlaceholder';

const ProblemSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef(null);
  const ITEM_HEIGHT = 52;

  const reasons = [
    "Is it to be recognized and appreciated for our talent?",
    "Maybe it is the desire to give the best possible experience to the audience.",
    "Perhaps it is simply for self-expression.",
    "Or is it for that specific adrenaline... the joy of being 100% in the Flow State?",
    "Maybe it is just to have that tangible sense of 'This is mine.'"
  ];

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const handleScroll = () => {
      const idx = Math.round(el.scrollTop / ITEM_HEIGHT);
      setActiveIndex(Math.max(0, Math.min(idx, reasons.length - 1)));
    };
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  const highlightWords = (text) => {
    return text.split(' ').map((word, i) => {
      if (word.includes('Flow') || word.includes('mine')) {
        return <span key={i} className="text-white opacity-90">{word} </span>;
      }
      return <span key={i}>{word} </span>;
    });
  };

  return (
    <section id="philosophy" className="relative z-10 w-full max-w-5xl mx-auto px-6 py-24 flex flex-col justify-center min-h-screen">
      <div className="section-number mb-8">02 / THE PROBLEM</div>

      <div className="glass-card p-10 md:p-16 rounded-3xl border border-white/5 bg-gradient-to-br from-tessera-void to-tessera-ink relative">
        <div className="absolute inset-0 opacity-30 pointer-events-none overflow-hidden rounded-3xl">
          <svg className="absolute -top-20 -right-20 w-96 h-96 opacity-20 text-tessera-teal" viewBox="0 0 400 400">
            <circle cx="200" cy="200" r="180" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="300 100" />
          </svg>
        </div>

        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-display font-light leading-tight mb-8 text-white tracking-tight opacity-90">
            The Human Element
          </h2>

          <h3 className="text-xl md:text-2xl font-display font-light text-gray-400 max-w-3xl mb-10 leading-relaxed">
            When AI finishes the <span className="text-white opacity-90">track</span> in seconds,
            the speed can cause a loss of meaning. It forces a return to the start, to ask:{' '}
            <span className="text-tessera-orange">Why did we show up in the first place?</span>
          </h3>

          {/* Mantra Wheel */}
          <div className="relative w-full mx-auto mb-10" style={{ height: '220px' }}>
            <div className="absolute left-0 inset-y-0 w-8 flex items-center justify-center">
              <div className="w-[1px] h-full bg-white/10"></div>
              <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-4 h-1 bg-tessera-orange rounded-full shadow-[0_0_10px_#FF5F1F] z-10"></div>
            </div>
            <div
              ref={scrollContainerRef}
              className="h-full overflow-y-scroll scrollbar-hide text-left pl-10 pr-4"
              style={{
                maskImage: 'linear-gradient(to bottom, transparent 0%, white 15%, white 85%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, white 15%, white 85%, transparent 100%)',
                scrollSnapType: 'y mandatory',
              }}
            >
              <div style={{ height: 'calc(50% - 0.75rem)' }} className="flex-shrink-0"></div>
              {reasons.map((reason, index) => (
                <p
                  key={index}
                  style={{ scrollSnapAlign: 'center' }}
                  className={`text-xl font-accent leading-loose py-2 transition-all duration-300 ${
                    index === activeIndex ? 'opacity-100 text-white' : 'opacity-40 text-gray-400'
                  }`}
                >
                  {highlightWords(reason)}
                </p>
              ))}
              <div style={{ height: 'calc(50% - 0.75rem)' }} className="flex-shrink-0"></div>
            </div>
          </div>

          <p className="text-xl font-accent font-normal text-gray-400 leading-relaxed max-w-4xl opacity-90">
            It is usually a mix of all of these — and perhaps other reasons we haven't even found words for yet.
          </p>
        </div>
      </div>

      <div className="mt-10">
        <IllustrationPlaceholder
          description="A musician alone in a dimly lit studio, staring at an AI-generated track on screen — the creative spark fading. Cinematic, moody. TESSERA dark aesthetic."
          aspectRatio="16/7"
        />
      </div>
    </section>
  );
};

export default ProblemSection;
