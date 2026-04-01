import React from 'react';
import IllustrationPlaceholder from './IllustrationPlaceholder';
import FounderVideoSection from './FounderVideoSection';

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

const AnswerSection = () => (
  <section className="relative z-10 w-full max-w-5xl mx-auto px-6 py-24">
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

    <div className="mt-12">
      <IllustrationPlaceholder
        description="Abstract visualization of the 'Glass Box' concept — transparent layers of audio processing, visible signal flow, the artist's hand in control. Teal + orange palette on ink black."
        aspectRatio="16/7"
      />
    </div>

    <div className="mt-24">
      <FounderVideoSection />
    </div>
  </section>
);

export default AnswerSection;
