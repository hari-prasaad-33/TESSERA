import { useState, useEffect } from 'react'
import ProductShowcase from './components/ProductShowcase'
import { EQInterfaceMockup } from './components/ProductShowcase'
import EternalRing from './components/EternalRing'
import DiscoverPage from './components/DiscoverPage'
import EQFeaturesPage from './components/EQFeaturesPage'
import HeroSection from './components/HeroSection'
import ProblemSection from './components/ProblemSection'
import AnswerSection from './components/AnswerSection'
import HowWeBuildSection from './components/HowWeBuildSection'
import VisionSection from './components/VisionSection'
import SiteNav from './components/SiteNav'
import CircuitTexture from './components/CircuitTexture'

// ─── Full-viewport panel banner ──────────────────────────────────────────────
// min-h-screen ensures each section fills the viewport like Colossal's banners.
// Content can overflow beyond one screen for content-heavy sections.
const Panel = ({ bg, texture, children, id, center = false }) => (
  <div
    id={id}
    className={`relative overflow-hidden min-h-screen ${bg} ${center ? 'flex flex-col justify-center' : ''}`}
  >
    {texture && (
      <div className={`absolute inset-0 pointer-events-none ${texture}`} />
    )}
    {children}
  </div>
);

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const navigateTo = (page) => setCurrentPage(page);

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

  // Home page — each Panel = one full-viewport banner
  return (
    <div className="text-tessera-text selection:bg-tessera-orange selection:text-black">
      <SiteNav currentPage="home" onNavigate={navigateTo} />

      {/* ── 01 / THE MISSION ─────────────────────────────────────────
          Deep space blue-black. Clean — no texture. Teal nebula top-right.
      ──────────────────────────────────────────────────────────────── */}
      <Panel bg="bg-[#04040a]" center>
        <div className="absolute top-[-15%] right-[-10%] w-[55%] h-[80%] rounded-full blur-[130px] pointer-events-none bg-tessera-teal/10" />
        <div className="absolute bottom-0 left-[20%] w-[60%] h-[30%] rounded-full blur-[100px] pointer-events-none bg-tessera-orange/[0.04]" />
        <HeroSection
          onExplore={() => document.getElementById('philosophy')?.scrollIntoView({ behavior: 'smooth' })}
        />
      </Panel>

      <div className="section-divider" />

      {/* ── 02 / THE PROBLEM ─────────────────────────────────────────
          Warm dark purple-black. Horizontal scan lines. Cold blue left ambient.
      ──────────────────────────────────────────────────────────────── */}
      <Panel bg="bg-[#070509]" texture="texture-scanlines" center>
        <div className="absolute top-[5%] left-[-8%] w-[40%] h-[60%] rounded-full blur-[120px] pointer-events-none bg-[#1a2030]/50" />
        <div className="absolute bottom-0 right-[-5%] w-[30%] h-[40%] rounded-full blur-[100px] pointer-events-none bg-tessera-orange/[0.04]" />
        <ProblemSection />
      </Panel>

      <div className="section-divider" />

      {/* ── 03 / OUR ANSWER ──────────────────────────────────────────
          Slightly warmer dark. Orange ember builds from bottom-right.
      ──────────────────────────────────────────────────────────────── */}
      <Panel bg="bg-[#09060a]">
        <div className="absolute bottom-[-5%] right-[-5%] w-[45%] h-[55%] rounded-full blur-[130px] pointer-events-none bg-tessera-orange/[0.06]" />
        <div className="absolute top-[10%] left-[-5%] w-[30%] h-[40%] rounded-full blur-[110px] pointer-events-none bg-tessera-teal/[0.05]" />
        <AnswerSection />
      </Panel>

      <div className="section-divider" />

      {/* ── 04 / HOW WE BUILD ────────────────────────────────────────
          Technical teal-black. PCB circuit texture. Teal radial glow.
      ──────────────────────────────────────────────────────────────── */}
      <Panel bg="bg-[#030d10]">
        <CircuitTexture opacity={0.55} />
        <div className="absolute top-[-10%] left-[-5%] w-[45%] h-[50%] rounded-full blur-[140px] pointer-events-none bg-tessera-teal/[0.12]" />
        <HowWeBuildSection eqMockup={<EQInterfaceMockup />} />
      </Panel>

      <div className="section-divider" />

      {/* ── 05 / THE PROOF ───────────────────────────────────────────
          Pure black. No texture. Orange center spotlight — max focus on product.
      ──────────────────────────────────────────────────────────────── */}
      <Panel bg="bg-[#020202]" id="products" center>
        <div className="absolute top-[15%] left-[50%] -translate-x-1/2 w-[70%] h-[70%] rounded-full blur-[160px] pointer-events-none bg-tessera-orange/[0.07]" />
        <ProductShowcase onNavigate={navigateTo} />
      </Panel>

      <div className="section-divider" />

      {/* ── 06 / THE VISION ──────────────────────────────────────────
          Deep indigo. Star field texture. Dual teal + orange ambience.
      ──────────────────────────────────────────────────────────────── */}
      <Panel bg="bg-[#05040f]" texture="texture-stars" id="vision">
        <div className="absolute top-[15%] left-[-5%] w-[35%] h-[45%] rounded-full blur-[120px] pointer-events-none bg-tessera-teal/[0.08]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[40%] rounded-full blur-[120px] pointer-events-none bg-tessera-orange/[0.06]" />
        <VisionSection />
      </Panel>

      {/* ── Footer ───────────────────────────────────────────────── */}
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
