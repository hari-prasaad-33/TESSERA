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

// ─── Reusable panel wrapper ──────────────────────────────────────────────────
const Panel = ({ bg, texture, children, className = '', id }) => (
  <div id={id} className={`relative overflow-hidden ${bg} ${className}`}>
    {/* Texture overlay */}
    {texture && (
      <div className={`absolute inset-0 pointer-events-none ${texture}`} style={{ opacity: 1 }} />
    )}
    {children}
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
      <div className="bg-[#04040a] min-h-screen">
        <SiteNav currentPage="discover" onNavigate={navigateTo} />
        <DiscoverPage onBack={() => navigateTo('home')} />
      </div>
    );
  }

  if (currentPage === 'eq-features') {
    return (
      <div className="bg-[#030d10] min-h-screen">
        <SiteNav currentPage="eq-features" onNavigate={navigateTo} />
        <EQFeaturesPage onBack={() => navigateTo('home')} />
      </div>
    );
  }

  // Home page
  return (
    <div className="text-tessera-text selection:bg-tessera-orange selection:text-black">
      <SiteNav currentPage="home" onNavigate={navigateTo} />

      {/* ── 01 / THE MISSION — deep space blue-black, clean ── */}
      <Panel bg="bg-[#04040a]">
        {/* Teal nebula top-right */}
        <div className="absolute top-[-15%] right-[-10%] w-[55%] h-[70%] rounded-full blur-[130px] pointer-events-none bg-tessera-teal/10" />
        {/* Faint orange horizon */}
        <div className="absolute bottom-0 left-[20%] w-[60%] h-[30%] rounded-full blur-[100px] pointer-events-none bg-tessera-orange/4" />
        <HeroSection
          onExplore={() => document.getElementById('philosophy')?.scrollIntoView({ behavior: 'smooth' })}
        />
      </Panel>

      <div className="section-divider" />

      {/* ── 02 + 03 / THE PROBLEM + OUR ANSWER — warm dark + scan lines ── */}
      <Panel bg="bg-[#070509]" texture="texture-scanlines">
        {/* Cold blue-grey left ambient */}
        <div className="absolute top-[10%] left-[-8%] w-[40%] h-[50%] rounded-full blur-[120px] pointer-events-none bg-[#1a2030]/60" />
        {/* Orange ember bottom-right for 03/Answer */}
        <div className="absolute bottom-[5%] right-[-5%] w-[35%] h-[40%] rounded-full blur-[110px] pointer-events-none bg-tessera-orange/6" />
        <PhilosophySection />
      </Panel>

      <div className="section-divider" />

      {/* ── 04 / HOW WE BUILD — technical teal-black + dot grid ── */}
      <Panel bg="bg-[#030d10]" texture="texture-dots">
        {/* Teal radial top-left */}
        <div className="absolute top-[-10%] left-[-5%] w-[45%] h-[50%] rounded-full blur-[140px] pointer-events-none bg-tessera-teal/8" />
        <HowWeBuildSection eqMockup={<EQInterfaceMockup />} />
      </Panel>

      <div className="section-divider" />

      {/* ── 05 / THE PROOF — pure black, orange spotlight ── */}
      <Panel bg="bg-[#020202]" id="products">
        {/* Orange center spotlight */}
        <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[60%] h-[60%] rounded-full blur-[160px] pointer-events-none bg-tessera-orange/7" />
        <ProductShowcase onNavigate={navigateTo} />
      </Panel>

      <div className="section-divider" />

      {/* ── 06 / THE VISION — deep indigo + star field ── */}
      <Panel bg="bg-[#05040f]" texture="texture-stars" id="vision">
        {/* Teal left */}
        <div className="absolute top-[15%] left-[-5%] w-[35%] h-[45%] rounded-full blur-[120px] pointer-events-none bg-tessera-teal/8" />
        {/* Orange right */}
        <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[40%] rounded-full blur-[120px] pointer-events-none bg-tessera-orange/6" />
        <VisionSection />
      </Panel>

      {/* ── Footer ── */}
      <footer className="py-24 text-center text-tessera-dim text-xs font-mono border-t border-white/5 relative overflow-hidden bg-[#020202]">
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
