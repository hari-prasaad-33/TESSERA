import React, { useRef, useState, useEffect } from 'react';
import FounderVideoSection from './FounderVideoSection';
import IllustrationPlaceholder from './IllustrationPlaceholder';

const PhilosophySection = () => {
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

  const pillars = [
    {
      number: '01',
      title: 'The Glass Box',
      description: 'AI should be a semantic assistant, not a ghost producer. Every algorithmic decision is mapped to tactile, editable parameters. You see exactly why and how every move was made.',
    },
    {
      number: '02',
      title: 'Semantic Intelligence',
      description: 'Traditional tools are dumb and reactive. TESSERA understands musical context — translating human intent like "add warmth" into proactive, time-varying mathematical reality.',
    },
    {
      number: '03',
      title: 'Deep Personalization',
      description: 'Universal AI presets fail professionals. Our system observes how you adjust its suggestions, building a private profile of your sonic taste that adapts over time.',
    },
    {
      number: '04',
      title: 'Uncompromising DSP',
      description: 'No zipper noise. No filter blowups. State Variable Filters with trapezoidal integration ensure AI-driven modulations remain completely transparent and musically pure.',
    },
    {
      number: '05',
      title: 'Atmospheric Aesthetic',
      description: 'We reject sterile spreadsheet interfaces and fake wood panels alike. Ink Black canvas, Teal data, Orange active elements — designed to maximize focus on the Delta.',
    },
  ];

  // Mantra wheel scroll detection
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
    <section className="py-32 relative z-10 max-w-5xl mx-auto px-6 space-y-32">

      {/* ═══════════════════════════════════════════════════════════
          SECTION 02 — THE PROBLEM
      ═══════════════════════════════════════════════════════════ */}
      <div id="philosophy">
        <div className="section-number mb-8">02 / THE PROBLEM</div>

        <div className="glass-card p-10 md:p-16 rounded-3xl border border-white/5 bg-gradient-to-br from-tessera-void to-tessera-ink relative animate-fade-in">
          {/* Subtle background decoration */}
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
              {/* Needle */}
              <div className="absolute left-0 inset-y-0 w-8 flex items-center justify-center">
                <div className="w-[1px] h-full bg-white/10"></div>
                <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-4 h-1 bg-tessera-orange rounded-full shadow-[0_0_10px_#FF5F1F] z-10"></div>
              </div>

              {/* Scrollable list */}
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
                      index === activeIndex
                        ? 'opacity-100 text-white'
                        : 'opacity-40 text-gray-400'
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

        {/* Illustration placeholder */}
        <div className="mt-10">
          <IllustrationPlaceholder
            description="A musician alone in a dimly lit studio, staring at an AI-generated track on screen — the creative spark fading. Cinematic, moody. TESSERA dark aesthetic."
            aspectRatio="16/7"
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 03 — OUR ANSWER
      ═══════════════════════════════════════════════════════════ */}
      <div>
        <div className="section-number mb-8">03 / OUR ANSWER</div>

        {/* Purist Trap vs Tessera Way */}
        <div className="glass-card p-10 md:p-16 rounded-3xl border border-tessera-teal/10 bg-gradient-to-br from-tessera-void to-tessera-ink relative mb-16">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-tessera-orange/50 to-transparent"></div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="relative p-6 rounded-2xl bg-red-950/20 border border-red-900/10">
              <h3 className="text-2xl font-display mb-6 text-red-300/80">The Purist Trap</h3>
              <p className="text-tessera-dim leading-relaxed">
                Sticking solely to traditional methods is a self-imposed ceiling. Rejecting modern tools
                isn't a badge of honor — it's a limitation on your potential. The tools don't make the art; you do.
              </p>
            </div>
            <div className="relative p-6 rounded-2xl bg-tessera-orange/5 border border-tessera-orange/10">
              <h3 className="text-2xl font-display mb-6 text-tessera-orange">The Tessera Way</h3>
              <p className="text-gray-300 leading-relaxed mb-6">
                <strong>Flow State, Unlocked.</strong><br />
                Tessera bridges the gap between bedroom studios and industry standards.
                By automating the technical mundane, we liberate your mental bandwidth for what truly matters: the music.
              </p>
              <p className="font-accent text-base text-tessera-teal border-l-2 border-tessera-teal pl-4 italic">
                "Art shouldn't just serve the audience. It must serve the creator first."
              </p>
            </div>
          </div>
        </div>

        {/* The 5 Pillars */}
        <h3 className="text-3xl md:text-4xl font-display font-light text-white tracking-tight mb-12 text-center">
          Our Five Pillars
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          {pillars.map((pillar, i) => (
            <div
              key={pillar.number}
              className={`glass-card p-8 rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-300 group cursor-default ${
                i === pillars.length - 1 ? 'md:col-span-2' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <span className="font-mono text-xs text-tessera-orange tracking-wider mt-1 flex-shrink-0">
                  {pillar.number}
                </span>
                <div>
                  <h4 className="text-lg font-display font-medium text-white mb-3 group-hover:text-tessera-teal transition-colors duration-300">
                    {pillar.title}
                  </h4>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Illustration placeholder */}
        <div className="mt-12">
          <IllustrationPlaceholder
            description="Abstract visualization of the 'Glass Box' concept — transparent layers of audio processing, visible signal flow, the artist's hand in control. Teal + orange palette on ink black."
            aspectRatio="16/7"
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          FOUNDER VIDEO
      ═══════════════════════════════════════════════════════════ */}
      <FounderVideoSection />

    </section>
  );
};

export default PhilosophySection;
