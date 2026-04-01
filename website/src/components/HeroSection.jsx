import React from 'react';
import IllustrationPlaceholder from './IllustrationPlaceholder';

const HeroSection = ({ onExplore }) => (
  <header id="home" className="relative z-10 min-h-screen flex items-center px-6 md:px-16">
    <div className="w-full max-w-6xl mx-auto py-32">

      {/* Section number */}
      <div
        className="section-number mb-8 animate-fade-in-up"
        style={{ animationDelay: '0ms', animationFillMode: 'both' }}
      >
        01 / THE MISSION
      </div>

      {/* Main mission statement */}
      <h1
        className="text-5xl md:text-7xl lg:text-8xl font-accent font-semibold leading-[1.05] text-white mb-8 max-w-4xl animate-fade-in-up"
        style={{ animationDelay: '100ms', animationFillMode: 'both' }}
      >
        The soul of music creation<br />
        <span className="text-tessera-orange">is not for sale.</span>
      </h1>

      {/* Sub-statement */}
      <p
        className="text-xl md:text-2xl text-gray-400 font-body font-light max-w-2xl leading-relaxed mb-12 animate-fade-in-up"
        style={{ animationDelay: '200ms', animationFillMode: 'both' }}
      >
        When AI can finish a track in seconds, the speed erases the meaning.
        TESSERA exists to make sure the process of creating music —{' '}
        <span className="text-white">the human part</span> — never dies.
      </p>

      {/* Soft CTA */}
      <div
        className="flex flex-wrap gap-8 mb-20 animate-fade-in-up"
        style={{ animationDelay: '320ms', animationFillMode: 'both' }}
      >
        <button
          onClick={onExplore}
          className="group flex items-center gap-3 font-mono text-sm text-tessera-teal tracking-wider transition-all duration-300 hover:text-white"
        >
          EXPLORE OUR PHILOSOPHY
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
        </button>
        <button
          onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
          className="group flex items-center gap-3 font-mono text-sm text-tessera-dim tracking-wider transition-all duration-300 hover:text-gray-300"
        >
          SEE TESSERA EQ
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
        </button>
      </div>

      {/* Hero illustration placeholder */}
      <div
        className="animate-fade-in-up"
        style={{ animationDelay: '400ms', animationFillMode: 'both' }}
      >
        <IllustrationPlaceholder
          description="Hero illustration — a musician at a mixing desk, cinematic dark lighting, the TESSERA aesthetic: ink black background, teal data visualizations, orange active elements. The human hand resting on the fader. Emotional, atmospheric. Generate with Stockimg.ai or Nano Banana."
          aspectRatio="21/9"
        />
      </div>

    </div>
  </header>
);

export default HeroSection;
