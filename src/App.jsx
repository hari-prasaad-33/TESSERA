import { useState, useEffect } from 'react'
import PhilosophySection from './components/PhilosophySection'
import ProductSection from './components/ProductSection'
import Logogram from './components/Logogram'
import EternalRing from './components/EternalRing'
import DiscoverPage from './components/DiscoverPage'
import SpecsPage from './components/SpecsPage'

const MistBackground = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
    <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-tessera-teal/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }}></div>
    <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-tessera-mist rounded-full blur-[100px]"></div>
    <div className="absolute top-[40%] left-[20%] w-[40%] h-[40%] bg-tessera-orange/5 rounded-full blur-[180px] mix-blend-screen"></div>
    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03]"></div>
  </div>
);

function App() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'discover', 'specs'
  const [showProductsDropdown, setShowProductsDropdown] = useState(false);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  const handleProductSectionNav = (target) => {
      // If we are on a sub-page, go home first, then scroll
      if (currentPage !== 'home') {
          setCurrentPage('home');
          // Use timeout to allow render
          setTimeout(() => {
              const el = document.getElementById(target);
              if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 100);
      } else {
          // Already on home, just scroll
          const el = document.getElementById(target);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
  };

  // Render Sub-Pages
  if (currentPage === 'discover') {
      return (
        <>
            <MistBackground />
            <DiscoverPage onBack={() => navigateTo('home')} />
        </>
      );
  }

  if (currentPage === 'specs') {
      return (
        <>
            <MistBackground />
            <SpecsPage onBack={() => navigateTo('home')} />
        </>
      );
  }

  // Render Home Page
  return (
    <div className="min-h-screen bg-tessera-ink text-tessera-text selection:bg-tessera-orange selection:text-black font-sans">
      <MistBackground />
      
      {/* Navigation / Header */}
      <nav className="fixed top-0 w-full z-50 px-6 py-6 flex justify-between items-center mix-blend-difference">
        <div className="flex items-center gap-3 relative cursor-pointer" onClick={() => handleProductSectionNav('home')}>
          <Logogram size={50} progress={70} color="text-tessera-orange" className="absolute -left-6 opacity-60 blur-sm" />
          <div className="font-display font-bold tracking-tighter text-xl relative z-10">TESSERA</div>
        </div>
        <div className="hidden md:flex gap-12 font-mono text-sm tracking-[0.2em] font-medium text-tessera-dim relative">
          <button onClick={() => handleProductSectionNav('home')} className="hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all duration-300">HOME</button>
          
          <div 
            className="relative"
            onMouseEnter={() => setShowProductsDropdown(true)}
            onMouseLeave={() => setShowProductsDropdown(false)}
          >
            <span className="cursor-pointer hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all duration-300 py-4 block">PRODUCTS ▼</span>
            {showProductsDropdown && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 glass-card p-2 rounded-lg shadow-xl z-50 animate-fade-in border border-white/10">
                <button onClick={() => handleProductSectionNav('tessera-one')} className="block w-full text-left px-4 py-3 text-sm font-bold tracking-widest hover:bg-white/10 rounded-md text-tessera-orange transition-colors">TESSERA ONE</button>
              </div>
            )}
          </div>

          <button onClick={() => navigateTo('discover')} className="hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all duration-300">DISCOVER PLUGIN</button>
          <button onClick={() => navigateTo('specs')} className="hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition-all duration-300">READ SPECS</button>
        </div>
        <div className="w-8 h-8 rounded-full border border-current opacity-50 flex items-center justify-center">
          <div className="w-1 h-1 bg-current rounded-full"></div>
        </div>
      </nav>

      {/* 1. Company Hero (TESSERA) */}
      <header id="home" className="relative z-10 h-screen flex flex-col justify-center items-center text-center px-4">
        <div className="mb-12 animate-fade-in relative">
          <Logogram size={180} progress={85} color="text-tessera-orange" />
          <div className="absolute inset-0 flex items-center justify-center">
             <span className="font-mono text-xs text-tessera-teal tracking-widest">EST. 2026</span>
          </div>
        </div>
        
        <h1 className="text-7xl md:text-9xl font-display font-light tracking-tight mb-6 leading-none">
          TESSERA 
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-400 font-light max-w-xl leading-relaxed mt-4">
          Empowering the <span className="text-tessera-orange font-normal">soul of creation</span> in the age of AI.
        </p>
      </header>

      {/* 2. Philosophy Section (The Why) + Founder's Video */}
      <PhilosophySection />

      {/* 3. Product Landing Page (TESSERA ONE) */}
      <div id="tessera-one">
        <ProductSection onNavigate={navigateTo} />
      </div>

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
