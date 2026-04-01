import React from 'react';
import Logogram from './Logogram';

const ProductSection = ({ onNavigate }) => {
  return (
    <section className="relative z-10 py-32 px-6 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 gap-16 items-center mb-16">
        <div className="order-2 md:order-1">
          <h2 className="text-5xl font-display text-white mb-8 tracking-tight uppercase text-glow drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">TESSERA <span className="text-tessera-orange">ONE</span></h2>
          <h3 className="text-5xl font-display mb-8">Not a replacement.<br/>A <span className="text-tessera-teal">Catalyst.</span></h3>
          <p className="text-lg text-gray-400 mb-6 leading-relaxed">
            Tessera One is an intelligent channel strip that listens, analyzes, and suggests. 
            It handles the mundane science of mixing so you can stay in the flow of creation.
          </p>
          <div className="flex gap-4 mt-8">
            <button
              className="group relative px-10 py-5 bg-gray-700 text-white font-mono font-bold tracking-wider rounded-full overflow-hidden transition-all hover:scale-105 hover:bg-gray-600 hover:shadow-lg"
              onClick={() => onNavigate('discover')}
            >
              <span className="relative">DISCOVER PLUGIN</span>
            </button>
          </div>
        </div>
        
        {/* Abstract Interface Visualization */}
        <div className="order-1 md:order-2 glass-card aspect-square rounded-3xl border border-white/5 relative overflow-hidden flex items-center justify-center group">
          <div className="absolute inset-0 bg-gradient-to-b from-tessera-void to-black opacity-80"></div>
          
          {/* Animated Knobs Simulation */}
          <div className="relative z-10 grid grid-cols-2 gap-8">
             <Logogram size={80} progress={60} color="text-tessera-teal group-hover:text-tessera-orange" />
             <Logogram size={80} progress={30} color="text-tessera-dim group-hover:text-tessera-teal" />
             <Logogram size={80} progress={90} color="text-tessera-dim group-hover:text-tessera-teal" />
             <Logogram size={80} progress={45} color="text-tessera-teal group-hover:text-tessera-orange" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
