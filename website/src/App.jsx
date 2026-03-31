import { useState, useEffect } from 'react'
import PhilosophySection from './components/PhilosophySection'
import ProductShowcase from './components/ProductShowcase'
import { EQInterfaceMockup } from './components/ProductShowcase'
import Logogram from './components/Logogram'
import EternalRing from './components/EternalRing'
import DiscoverPage from './components/DiscoverPage'
import EQFeaturesPage from './components/EQFeaturesPage'
import HeroSection from './components/HeroSection'
import HowWeBuildSection from './components/HowWeBuildSection'
import VisionSection from './components/VisionSection'

const MistBackground = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
    <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-tessera-teal/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }}></div>
    <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-tessera-mist rounded-full blur-[100px]"></div>
    <div className="absolute top-[40%] left-[20%] w-[40%] h-[40%] bg-tessera-orange/5 rounded-full blur-[180px] mix-blend-screen"></div>
    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03]"></div>
  </div>
);

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [showProductsDropdown, setShowProductsDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  // Scroll-aware nav background
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  const handleProductSectionNav = (target) => {
    if (currentPage !== 'home') {
      setCurrentPage('home');
      setTimeout(() => {
        const el = document.getElementById(target);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(target);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Sub-pages
  if (currentPage === 'discover') {
    return (
      <>
        <MistBackground />
        <DiscoverPage onBack={() => navigateTo('home')} />
      </>
    );
  }

  if (currentPage === 'eq-features') {
    return (
      <>
        <MistBackground />
        <EQFeaturesPage onBack={() => navigateTo('home')} />
      </>
    );
  }

  // Home page
  return (
    <div className="min-h-screen bg-tessera-ink text-tessera-text selection:bg-tessera-orange selection:text-black font-sans">
      <MistBackground />

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center transition-all duration-300 ${
        scrolled ? 'backdrop-blur-xl bg-tessera-ink/80 border-b border-white/5' : ''
      }`}>
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => handleProductSectionNav('home')}
        >
          <Logogram size={32} progress={70} color="text-tessera-orange" />
          <div className="font-display font-bold tracking-tighter text-xl">TESSERA</div>
        </div>

        {/* Nav links */}
        <div className="hidden md:flex gap-12 font-mono text-sm tracking-[0.2em] font-medium text-tessera-dim relative">
          <button
            onClick={() => handleProductSectionNav('home')}
            className="hover:text-white transition-all duration-300"
          >
            HOME
          </button>

          <div
            className="relative"
            onMouseEnter={() => setShowProductsDropdown(true)}
            onMouseLeave={() => setShowProductsDropdown(false)}
          >
            <span className="cursor-pointer hover:text-white transition-all duration-300 py-4 block">
              PRODUCTS ▾
            </span>
            {showProductsDropdown && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-60 glass-card p-2 rounded-xl shadow-xl z-50 border border-white/10">
                {/* EQ first — the current product */}
                <button
                  onClick={() => handleProductSectionNav('products')}
                  className="flex items-center gap-3 w-full text-left px-4 py-3 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-tessera-teal flex-shrink-0"></span>
                  <div>
                    <div className="font-bold text-sm tracking-widest text-tessera-teal">TESSERA EQ</div>
                    <div className="font-mono text-[9px] text-tessera-dim tracking-wider mt-0.5">AI PARAMETRIC EQ — AVAILABLE</div>
                  </div>
                </button>
                {/* ONE — coming soon */}
                <button
                  onClick={() => { setShowProductsDropdown(false); document.getElementById('vision')?.scrollIntoView({ behavior: 'smooth' }); }}
                  className="flex items-center gap-3 w-full text-left px-4 py-3 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-tessera-orange flex-shrink-0"></span>
                  <div>
                    <div className="font-bold text-sm tracking-widest text-tessera-orange">TESSERA ONE</div>
                    <div className="font-mono text-[9px] text-tessera-dim tracking-wider mt-0.5">MIXING SUITE — COMING 2026</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => navigateTo('eq-features')}
            className="hover:text-white transition-all duration-300"
          >
            EXPLORE EQ
          </button>
        </div>

        {/* Indicator dot */}
        <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center">
          <div className="w-1 h-1 bg-tessera-teal rounded-full"></div>
        </div>
      </nav>

      {/* ── 01 / THE MISSION ──────────────────────────── */}
      <HeroSection
        onExplore={() => {
          document.getElementById('philosophy')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* ── 02 + 03 / THE PROBLEM + OUR ANSWER (includes Founder Video) ── */}
      <PhilosophySection />

      {/* ── 04 / HOW WE BUILD ─────────────────────────── */}
      <HowWeBuildSection eqMockup={<EQInterfaceMockup />} />

      {/* ── 05 / THE PROOF — TESSERA EQ ───────────────── */}
      <ProductShowcase onNavigate={navigateTo} />

      {/* ── 06 / THE VISION ───────────────────────────── */}
      <div id="vision">
        <VisionSection />
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
  );
}

export default App;
