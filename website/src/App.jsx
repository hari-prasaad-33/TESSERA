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
import TextureVeil from './components/TextureVeil';

function Panel({ bg, id, children, texture = null, overlay = null }) {
  return (
    <section id={id} className={`relative min-h-screen overflow-hidden ${bg}`}>
      {texture}
      {overlay}
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

      <Panel bg="bg-[#0a0806]">
        <HeroSection />
      </Panel>

      <div className="pointer-events-none relative z-30 mx-auto -mt-20 mb-[-7.5rem] w-full max-w-[1600px] px-6 md:-mt-24 md:mb-[-8.5rem] md:px-10 lg:-mt-28 lg:mb-[-10rem] lg:px-14">
        <div className="md:ml-auto md:max-w-[40rem] lg:max-w-[44rem]">
          <ThesisBridgeCard />
        </div>
      </div>

      <Panel
        bg="bg-[#1a0f08]"
        texture={
          <TextureVeil
            src="/images/textures/qwantani-moon-noon.jpg"
            opacity={0.58}
            position="center"
            filter="saturate(1.12) contrast(1.05) brightness(0.55)"
          />
        }
        overlay={<div className="pointer-events-none absolute inset-0 bg-[rgba(40,20,8,0.62)]" />}
      >
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.12),transparent_35%)]" />
        <ProblemSection />
      </Panel>

      <Panel
        bg="bg-[#080a10]"
        texture={
          <TextureVeil
            src="/images/textures/quarry-04-puresky.jpg"
            opacity={0.52}
            position="center top"
            filter="saturate(0.95) contrast(1.04) brightness(0.48)"
          />
        }
        overlay={<div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(6,10,22,0.78),rgba(6,12,24,0.55)_45%,rgba(4,8,18,0.82))]" />}
      >
        <AnswerSection />
      </Panel>

      <Panel bg="bg-[#0a0c10]">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent_30%)]" />
        <HowWeBuildSection eqMockup={<EQInterfaceMockup />} />
      </Panel>

      <Panel
        bg="bg-[#0c0a08]"
        texture={
          <TextureVeil
            src="/images/textures/cliff-side.jpg"
            opacity={0.5}
            position="center"
            filter="saturate(0.88) contrast(1.08) brightness(0.42)"
          />
        }
        overlay={<div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(8,6,4,0.75),rgba(6,5,4,0.88))]" />}
      >
        <ProductShowcase onNavigate={navigateTo} />
      </Panel>

      <Panel bg="bg-[#08080c]">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(4,4,10,0.5)_100%)]" />
        <VisionSection />
      </Panel>

      <footer className="relative overflow-hidden border-t border-white/8 bg-[#05060c] px-6 py-20 text-center md:px-10 lg:px-14">
        <TextureVeil
          src="/images/textures/lichen-rock.jpg"
          opacity={0.22}
          position="center"
          filter="saturate(0.85) contrast(1.1) brightness(0.35)"
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(5,6,12,0.92),rgba(4,5,10,0.96))]" />
        <div className="relative z-10 panel-shell">
          <div className="mb-8 flex justify-center opacity-70 transition-opacity hover:opacity-100">
            <EternalRing />
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.34em] text-[#8d94ab]">Tessera Audio</p>
          <div className="mt-5 space-y-2 text-sm text-[#c6cfdd]">
            <p>Founder: Hari Prasaad S</p>
            <p>
              <a href="mailto:hello@tessera.audio" className="text-[#5dd4f0] underline-offset-4 hover:underline">
                hello@tessera.audio
              </a>
            </p>
          </div>
          <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.28em] text-[#6f768a]">Copyright 2026</p>
        </div>
      </footer>
    </div>
  );
}
