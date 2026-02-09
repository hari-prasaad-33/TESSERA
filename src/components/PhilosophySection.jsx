import React from 'react';
import FounderVideoSection from './FounderVideoSection';

const PhilosophySection = () => {
  const reasons = [
    "Is it to be recognized and appreciated for our talent?",
    "Maybe it is the desire to give the best possible experience to the audience.",
    "Perhaps it is simply for self-expression.",
    "Or is it for that specific adrenaline... the joy of being 100% in the Flow State?",
    "Maybe it is just to have that tangible sense of 'This is mine.'"
  ];

  const highlightWords = (text) => {
    return text.split(' ').map((word, i) => {
      if (word.includes('Flow') || word.includes('mine')) {
        return <span key={i} className="text-white opacity-90">{word} </span>;
      }
      return <span key={i}>{word} </span>;
    });
  };

  return (
    <section className="py-32 relative z-10 max-w-5xl mx-auto px-6 space-y-24">
      
      {/* The Human Element - Mantra Wheel Card */}
      <div className="glass-card p-10 md:p-16 rounded-3xl border border-white/5 bg-gradient-to-br from-tessera-void to-tessera-ink relative animate-fade-in">
        {/* Subtle Background Decoration - Arrival Motif */}
        <div className="absolute inset-0 opacity-30 pointer-events-none overflow-hidden rounded-3xl">
           <svg className="absolute -top-20 -right-20 w-96 h-96 opacity-20 text-tessera-teal" viewBox="0 0 400 400">
              <circle cx="200" cy="200" r="180" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="300 100" />
           </svg>
        </div>

        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-display font-light leading-tight mb-8 text-white tracking-tight opacity-90">
            The Human Element
          </h2>
          
          {/* Fixed Sub-headline */}
          <h3 className="text-xl md:text-2xl font-display font-light text-gray-400 max-w-3xl mb-10 leading-relaxed">
            When AI finishes the <span className="text-white opacity-90">track</span> in seconds, the speed can cause a loss of meaning. It forces a return to the start, to ask: <span className="text-tessera-orange">Why did we show up in the first place?</span>
          </h3>
          
          {/* Scrollable Mantra Wheel with Needle */}
          <div className="relative w-full mx-auto mb-10" style={{ height: '220px' }}>
            {/* The Needle Container */}
            <div className="absolute left-0 inset-y-0 w-8 flex items-center justify-center">
              <div className="w-[1px] h-full bg-white/10"></div>
              <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-4 h-1 bg-tessera-orange rounded-full shadow-[0_0_10px_#FF5F1F] z-10"></div>
            </div>
            
            {/* Scrollable Mantra Wheel */}
            <div className="h-full overflow-y-scroll scroll-snap-y scroll-snap-mandatory scrollbar-hide text-left pl-10 pr-4"
                 style={{ maskImage: 'linear-gradient(to bottom, transparent 0%, white 15%, white 85%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, white 15%, white 85%, transparent 100%)' }}>
              
              {/* Top Padding to center first item */}
              <div className="h-[calc(50%-0.75rem)] flex-shrink-0"></div> 
              
              {reasons.map((reason, index) => (
                <p key={index} className="text-xl font-mono text-gray-300 leading-loose scroll-snap-align-center py-2 transition-all duration-300 
                                          data-[active=true]:blur-0 data-[active=true]:text-white data-[active=true]:opacity-100 data-[active=true]:scale-100
                                          blur-[0.5px] opacity-30"
                     data-active={false} 
                >
                  {highlightWords(reason)}
                </p>
              ))}

              {/* Bottom Padding to center last item */}
              <div className="h-[calc(50%-0.75rem)] flex-shrink-0"></div> 

            </div>
          </div>

          {/* Fixed Bottom - Closing Sentence */}
          <p className="text-xl font-light text-gray-400 leading-relaxed max-w-4xl opacity-90">
            It is usually a mix of all of these—and perhaps other reasons we haven't even found words for yet.
          </p>

        </div>
      </div>

      {/* Founder's Video - right after The Human Element */}
      <FounderVideoSection />

      {/* The Synthesis (Purist Trap) - Kept as requested */}
      <div className="glass-card p-10 md:p-16 rounded-3xl border border-tessera-teal/10 bg-gradient-to-br from-tessera-void to-tessera-ink relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-tessera-orange to-transparent opacity-50"></div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-display mb-6">The Purist Trap</h3>
            <p className="text-tessera-dim leading-relaxed mb-6">
              Sticking solely to traditional methods is a self-imposed ceiling. Rejecting modern tools isn't a badge of honor—it's a limitation on your potential. The tools don't make the art; you do.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-display mb-6 text-tessera-orange">The Tessera Way</h3>
            <p className="text-gray-300 leading-relaxed mb-6">
              <strong>Flow State, Unlocked.</strong><br/>
              Tessera bridges the gap between bedroom studios and industry standards. By automating the technical mundane, we liberate your mental bandwidth for what truly matters: the music.
            </p>
            <p className="font-mono text-sm text-tessera-teal border-l-2 border-tessera-teal pl-4">
              "Art shouldn't just serve the audience. It must serve the creator first."
            </p>
          </div>
        </div>
      </div>

    </section>
  );
};

export default PhilosophySection;
