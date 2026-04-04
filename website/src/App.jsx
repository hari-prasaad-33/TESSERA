import { useEffect, useState } from 'react';
import ProductShowcase, { EQInterfaceMockup } from './components/ProductShowcase';
import EternalRing from './components/EternalRing';
import DiscoverPage from './components/DiscoverPage';
import EQFeaturesPage from './components/EQFeaturesPage';
import HeroSection from './components/HeroSection';
import ProblemSection from './components/ProblemSection';
import AnswerSection from './components/AnswerSection';
import HowWeBuildSection from './components/HowWeBuildSection';
import ThesisBridgeCard from './components/ThesisBridgeCard';
import VisionSection from './components/VisionSection';
import SiteNav from './components/SiteNav';
import { EmberNebulaIllustration, OrbFieldIllustration } from './components/ConceptIllustrations';

function Panel({ bg, id, children, texture = null }) {
  return (
    <section id={id} className={`relative min-h-screen ${bg}`}>
      {texture}
      {children}
    </section>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const navigateTo = (page) => setCurrentPage(page);

  if (currentPage === 'discover') {
    return (
      <div className="min-h-screen bg-[#040711]">
        <SiteNav currentPage="discover" onNavigate={navigateTo} />
        <DiscoverPage onBack={() => navigateTo('home')} />
      </div>
    );
  }

  if (currentPage === 'eq-features') {
    return (
      <div className="min-h-screen bg-[#050914]">
        <SiteNav currentPage="eq-features" onNavigate={navigateTo} />
        <EQFeaturesPage onBack={() => navigateTo('home')} />
      </div>
    );
  }

  return (
    <div className="text-tessera-text selection:bg-tessera-orange selection:text-black">
      <SiteNav currentPage="home" onNavigate={navigateTo} />

      <Panel bg="bg-[#05051A]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(93,212,240,0.08),transparent_24%),radial-gradient(circle_at_84%_16%,rgba(255,184,77,0.12),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_28%)]" />
        <HeroSection onExplore={() => document.getElementById('philosophy')?.scrollIntoView({ behavior: 'smooth' })} />
      </Panel>

      <div className="section-divider" />

      <div className="pointer-events-none relative z-30 mx-auto -mt-20 mb-[-7.5rem] w-full max-w-[1600px] px-6 md:-mt-24 md:mb-[-8.5rem] md:px-10 lg:-mt-28 lg:mb-[-10rem] lg:px-14">
        <div className="md:ml-auto md:max-w-[40rem] lg:max-w-[44rem]">
          <ThesisBridgeCard />
        </div>
      </div>

      <Panel
        bg="bg-[#060611]"
        texture={<div className="absolute inset-0 opacity-[0.14]"><OrbFieldIllustration className="h-full" /></div>}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_84%_20%,rgba(255,184,77,0.1),transparent_20%),linear-gradient(180deg,rgba(255,255,255,0.01),transparent_26%)]" />
        <ProblemSection />
      </Panel>

      <div className="section-divider" />

      <Panel
        bg="bg-[#080518]"
        texture={<div className="absolute inset-0 opacity-[0.12]"><EmberNebulaIllustration className="h-full" /></div>}
      >
        <AnswerSection />
      </Panel>

      <Panel bg="bg-[#071117]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(93,212,240,0.12),transparent_28%),radial-gradient(circle_at_84%_72%,rgba(255,184,77,0.1),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_22%)]" />
        <HowWeBuildSection eqMockup={<EQInterfaceMockup />} />
      </Panel>

      <div className="section-divider" />

      <Panel
        bg="bg-[#05070A]"
        texture={<div className="absolute inset-0 opacity-[0.12]"><EmberNebulaIllustration className="h-full" /></div>}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_22%,rgba(255,106,51,0.12),transparent_20%),radial-gradient(circle_at_80%_36%,rgba(93,212,240,0.05),transparent_24%)]" />
        <ProductShowcase onNavigate={navigateTo} />
      </Panel>

      <div className="section-divider" />

      <Panel
        bg="bg-[#06040F]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,184,77,0.08),transparent_24%),radial-gradient(circle_at_74%_18%,rgba(93,212,240,0.03),transparent_24%)]" />
        <VisionSection />
      </Panel>

      <footer className="relative overflow-hidden border-t border-white/6 bg-[#04050A] px-6 py-20 text-center md:px-10 lg:px-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(93,212,240,0.05),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(255,184,77,0.06),transparent_24%)]" />
        <div className="relative z-10 panel-shell">
          <div className="mb-8 flex justify-center opacity-70 transition-opacity hover:opacity-100">
            <EternalRing />
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.34em] text-[#8d94ab]">Tessera Audio</p>
          <div className="mt-5 space-y-2 text-sm text-[#c6cfdd]">
            <p>Founder: Hari Prasaad S</p>
            <p>Contact: 7305205794</p>
            <p>Email: hariprasaad3333@gmail.com</p>
          </div>
          <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.28em] text-[#6f768a]">Copyright 2026</p>
        </div>
      </footer>
    </div>
  );
}
