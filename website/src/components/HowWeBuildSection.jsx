import React from 'react';
import IllustrationPlaceholder from './IllustrationPlaceholder';

const HowWeBuildSection = ({ eqMockup }) => {
  const methods = [
    {
      id: '4.1',
      title: 'Glass Box in Action',
      subtitle: 'Every AI decision maps to a knob you can turn.',
      description:
        "When you type \"add warmth and air,\" the AI doesn't hide behind a magic button. It adjusts 8 visible EQ bands — each one draggable, each one yours to override. The AI suggests. You decide. Nothing happens that you can't see and undo.",
      hasLiveMockup: true,
    },
    {
      id: '4.2',
      title: 'The Semantic Engine',
      subtitle: 'From human words to mathematical curves — on your machine.',
      description:
        'A native C++ RAG pipeline runs entirely offline. Your words are tokenized by a BERT WordPiece tokenizer, embedded into 384-dimensional vectors via ONNX Runtime inference, and matched against 786 pre-computed EQ descriptors using cosine similarity. All in under a second. No internet required.',
      illustrationDesc:
        'Diagram: "warm and bright" → WordPiece tokenizer → 384-dim embedding space → cosine similarity search → 8-band EQ curve output. Flow left-to-right, minimal, teal connection lines on ink black.',
    },
    {
      id: '4.3',
      title: 'Three-Tier Intelligence',
      subtitle: 'Local-first. AI-assisted when it adds value.',
      description:
        'Tier 1 (≥ 0.95 similarity): High-confidence matches return instantly from the local dataset — no API call, no latency. Tier 2 (0.82–0.95): The AI refines using the 5 nearest dataset entries as grounding context. Tier 3 (< 0.82): Novel or unusual descriptions trigger full AI creative interpretation. Every tier degrades gracefully to the dataset if the network is unavailable.',
      illustrationDesc:
        'Three-tier funnel diagram: Tier 1 at top (instant, local, green), Tier 2 middle (AI-grounded, teal), Tier 3 at base (AI creative, orange). Show confidence thresholds ≥0.95 / 0.82–0.95 / <0.82 as labels.',
    },
    {
      id: '4.4',
      title: 'The DSP Foundation',
      subtitle: 'Cytomic SVF. Trapezoidal integration. Zero artifacts.',
      description:
        'Every filter uses Cytomic State Variable Filter topology with per-sample safe coefficient updates. Sweep any parameter at any speed — AI-driven or manual — and hear nothing but the music. No zipper noise, no blowups, no compromise. The math exists to serve the sound.',
      illustrationDesc:
        'Smooth EQ curve sweep animation — before/after showing artifact-free modulation. A clean waveform comparison showing transparent SVF processing. Minimal, technical, teal/orange.',
    },
  ];

  return (
    <section className="py-32 relative z-10 max-w-5xl mx-auto px-6">
      <div className="section-number mb-8">04 / HOW WE BUILD</div>

      <h2 className="text-4xl md:text-5xl font-display font-light text-white tracking-tight mb-6 max-w-3xl leading-tight">
        We build in the open.<br />
        <span className="text-tessera-teal">Here's how Tessera EQ works.</span>
      </h2>

      <p className="text-lg text-gray-400 font-light max-w-2xl leading-relaxed mb-20">
        No black boxes. No magic buttons. Every piece of our architecture exists
        to keep you in control while removing the friction between intent and sound.
      </p>

      <div className="space-y-24">
        {methods.map((method, i) => {
          const isReversed = i % 2 !== 0;
          return (
            <div
              key={method.id}
              className={`grid md:grid-cols-2 gap-10 md:gap-16 items-center ${isReversed ? 'direction-reverse' : ''}`}
            >
              {/* Text side */}
              <div className={isReversed ? 'md:order-2' : ''}>
                <span className="font-mono text-xs text-tessera-orange tracking-[0.3em] mb-3 block">
                  {method.id}
                </span>
                <h3 className="text-2xl md:text-3xl font-display font-light text-white mb-2 tracking-tight">
                  {method.title}
                </h3>
                <p className="font-mono text-xs text-tessera-dim tracking-wider mb-5">
                  {method.subtitle}
                </p>
                <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                  {method.description}
                </p>
              </div>

              {/* Visual side */}
              <div className={isReversed ? 'md:order-1' : ''}>
                {method.hasLiveMockup ? (
                  <div className="relative rounded-2xl border border-white/10 bg-gradient-to-b from-tessera-void to-tessera-ink overflow-hidden shadow-teal-glow">
                    <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-tessera-teal/5 to-transparent pointer-events-none z-10"></div>
                    <div style={{ height: '260px' }}>
                      {eqMockup}
                    </div>
                  </div>
                ) : (
                  <IllustrationPlaceholder
                    description={method.illustrationDesc}
                    aspectRatio="4/3"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default HowWeBuildSection;
