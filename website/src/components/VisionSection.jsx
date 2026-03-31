import React from 'react';
import { ChannelStripMockup } from './ProductShowcase';
import Logogram from './Logogram';
import IllustrationPlaceholder from './IllustrationPlaceholder';

const VisionSection = () => (
  <section className="py-32 relative z-10 max-w-5xl mx-auto px-6">
    <div className="section-number mb-8">06 / THE VISION</div>

    <h2 className="text-4xl md:text-5xl font-display font-light text-white tracking-tight mb-6 max-w-3xl leading-tight">
      This is just the beginning.
    </h2>

    <p className="text-lg text-gray-400 font-light max-w-2xl leading-relaxed mb-20">
      Tessera EQ is the foundation stone. What comes next is a completely new way to interact with sound.
    </p>

    {/* ─── TESSERA ONE ──────────────────────────────────────── */}
    <div className="group glass-card rounded-3xl border border-white/5 overflow-hidden mb-12 transition-all duration-700 hover:border-tessera-orange/15 hover:shadow-[0_0_80px_rgba(255,95,31,0.08)]">
      <div className="h-[2px] bg-gradient-to-r from-transparent via-tessera-orange/50 to-transparent"></div>

      <div className="grid md:grid-cols-2 gap-0">
        {/* Mockup — dimmed with Coming Soon overlay */}
        <div className="relative bg-gradient-to-br from-[#080810] to-[#05050a] min-h-[300px] md:min-h-[340px] md:border-r border-white/5 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-tessera-orange/5 via-transparent to-tessera-orange/3"></div>
          <div className="opacity-40 pointer-events-none">
            <ChannelStripMockup />
          </div>
          {/* Coming Soon overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-tessera-ink/50">
            <div className="text-center">
              <span className="font-mono text-sm text-tessera-orange tracking-[0.4em] block mb-3">COMING 2026</span>
              <div className="w-16 h-[1px] bg-tessera-orange/40 mx-auto"></div>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-8 md:p-10 flex flex-col justify-center">
          <span className="inline-block font-mono text-[10px] tracking-[0.3em] px-3 py-1 rounded-full border text-tessera-orange bg-tessera-orange/10 border-tessera-orange/20 mb-4 w-fit">
            COMING SOON
          </span>

          <h3
            className="text-4xl md:text-5xl font-display font-light text-white mb-2 tracking-tight uppercase"
            style={{ textShadow: '0 0 30px rgba(255,95,31,0.15)' }}
          >
            TESSERA <span className="text-tessera-orange">ONE</span>
          </h3>

          <p className="font-mono text-xs text-tessera-dim tracking-wider mb-5">
            THE COMPLETE AI MIXING SUITE
          </p>

          <p className="text-sm md:text-base text-gray-400 leading-relaxed mb-8">
            The complete mixing ecosystem. Tessera ONE will integrate every stage of the mix chain into a
            single AI-powered plugin: EQ, Compressor, Saturator, Reverb, Gate, and Limiter — all built on
            the intelligence foundation of Tessera EQ.
          </p>

          <button className="px-8 py-3.5 border border-white/10 text-gray-400 font-mono text-sm tracking-wider rounded-full transition-all duration-300 hover:border-tessera-orange/40 hover:text-tessera-orange hover:scale-105 w-fit">
            JOIN THE WAITLIST
          </button>
        </div>
      </div>
    </div>

    {/* ─── TESSERA DAW MOONSHOT ─────────────────────────────── */}
    <div className="glass-card p-10 md:p-16 rounded-3xl border border-white/5 bg-gradient-to-br from-tessera-void to-tessera-ink relative text-center">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-tessera-teal/30 to-transparent opacity-70"></div>

      <div className="mb-8 flex justify-center">
        <Logogram size={80} progress={30} color="text-tessera-teal" />
      </div>

      <span className="section-number block mb-4">THE MOONSHOT</span>

      <h3 className="text-3xl md:text-5xl font-display font-light text-white tracking-tight mb-6 max-w-2xl mx-auto leading-tight">
        TESSERA <span className="text-tessera-orange">DAW</span>
      </h3>

      <p className="text-gray-400 max-w-xl mx-auto leading-relaxed mb-8">
        A completely new digital audio workspace where plugins, the DAW, and the artist communicate
        seamlessly through semantic intent and uncompromised audio engineering. An ecosystem where
        AI empowers the musician — never replacing them.
      </p>

      <p className="font-mono text-sm text-tessera-teal border-l-2 border-tessera-teal pl-4 max-w-lg mx-auto text-left italic mb-12">
        "You aren't just selling a better EQ. You are selling a completely new way to interact with sound."
      </p>

      <IllustrationPlaceholder
        description="The TESSERA ecosystem roadmap: EQ → Compressor → Reverb → ONE → DAW. A visual timeline or constellation map showing the progression. Futuristic, minimal, ink black with teal/orange nodes."
        aspectRatio="21/9"
      />
    </div>
  </section>
);

export default VisionSection;
