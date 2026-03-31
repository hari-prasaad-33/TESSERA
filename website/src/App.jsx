import { useState, useEffect } from 'react'
import PhilosophySection from './components/PhilosophySection'
import ProductShowcase from './components/ProductShowcase'
import { EQInterfaceMockup } from './components/ProductShowcase'
import EternalRing from './components/EternalRing'
import DiscoverPage from './components/DiscoverPage'
import EQFeaturesPage from './components/EQFeaturesPage'
import HeroSection from './components/HeroSection'
import HowWeBuildSection from './components/HowWeBuildSection'
import VisionSection from './components/VisionSection'
import SiteNav from './components/SiteNav'

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

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

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
        <SiteNav currentPage="discover" onNavigate={navigateTo} />
        <DiscoverPage onBack={() => navigateTo('home')} />
      </>
    );
  }

  if (currentPage === 'eq-features') {
    return (
      <>
        <MistBackground />
        <SiteNav currentPage="eq-features" onNavigate={navigateTo} />
        <EQFeaturesPage onBack={() => navigateTo('home')} />
      </>
    );
  }

  // Home page
  return (
    <div className="min-h-screen bg-tessera-ink text-tessera-text selection:bg-tessera-orange selection:text-black font-sans">
      <MistBackground />

      {/* Navigation */}
      <SiteNav currentPage="home" onNavigate={navigateTo} />

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
