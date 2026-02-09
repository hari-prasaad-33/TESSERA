import { useState, useEffect } from 'react'
import PhilosophySection from './components/PhilosophySection'
import ProductSection from './components/ProductSection' // Corrected import
import Logogram from './components/Logogram'
import EternalRing from './components/EternalRing'

const MistBackground = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
    <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-tessera-teal/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }}></div>
    <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-tessera-mist rounded-full blur-[100px]"></div>
    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03]"></div>
  </div>
);

function App() {
  return (
    <div className="min-h-screen bg-tessera-ink text-tessera-text selection:bg-tessera-orange selection:text-black font-sans">
      <MistBackground />
      
      {/* Navigation / Header */}
      <nav className="fixed top-0 w-full z-50 px-6 py-6 flex justify-between items-center mix-blend-difference">
        <div className="flex items-center gap-3 relative">
          <Logogram size={50} progress={70} color="text-tessera-orange" className="absolute -left-6 opacity-60 blur-sm" />
          <div className="font-display font-bold tracking-tighter text-xl relative z-10">TESSERA</div>
        </div>
        <div className="hidden md:flex gap-8 font-mono text-xs tracking-widest text-tessera-dim">
          <span>01. PHILOSOPHY</span>
          <span>02. PRODUCT</span>
          <span>03. VISION</span>
        </div>
        <div className="w-8 h-8 rounded-full border border-current opacity-50 flex items-center justify-center">
          <div className="w-1 h-1 bg-current rounded-full"></div>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative z-10 h-screen flex flex-col justify-center items-center text-center px-4">
        <div className="mb-12 animate-fade-in relative">
          <Logogram size={180} progress={85} color="text-tessera-orange" />
          <div className="absolute inset-0 flex items-center justify-center">
             <span className="font-mono text-xs text-tessera-teal tracking-widest">EST. 2026</span>
          </div>
        </div>
        
        <h1 className="text-7xl md:text-9xl font-display font-light tracking-tight mb-6 leading-none">
          TESSERA <span className="text-tessera-dim block md:inline">ONE</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-400 font-light max-w-xl leading-relaxed mt-4">
          Empowering the <span className="text-tessera-orange font-normal">soul of creation</span> in the age of AI.
        </p>
      </header>

      {/* Philosophy Section (The Why) */}
      <PhilosophySection />

      {/* Product Section (The What) */}
      <ProductSection />

      {/* Footer */}
      <footer className="py-24 text-center text-tessera-dim text-xs font-mono border-t border-white/5 mt-20 relative overflow-hidden">
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2">
           <div className="mb-4 flex justify-center opacity-50 hover:opacity-100 transition-opacity">
             <EternalRing /> 
           </div>
        </div>
        <div className="mt-40">
          <p>© 2026 TESSERA AUDIO.</p>
          <div className="mt-4 text-tessera-dim text-xs font-mono tracking-widest">
            <p>FOUNDER: HARI PRASAAD S</p>
            <p>CONTACT: 7305205794</p>
            <p>EMAIL: hariprasaad3333@gmail.com</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
