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
import { sectionBackgrounds } from './sectionBackgrounds';

function Panel({ bg, id, children, texture = null, overlay = null, vignette = null }) {
  return (
    <section id={id} className={`relative min-h-screen overflow-hidden ${bg}`}>
      {texture}
      {overlay}
      {vignette}
      {children}
    </section>
  );
}

function SectionBackdrop({ config }) {
  if (!config) return null;
  return (
    <>
      <TextureVeil
        src={config.src}
        opacity={config.opacity}
        position={config.position}
        filter={config.filter}
      />
      <div className={`pointer-events-none absolute inset-0 ${config.overlayClass}`} />
      {config.vignetteClass ? (
        <div className={`pointer-events-none absolute inset-0 ${config.vignetteClass}`} />
      ) : null}
    </>
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
        bg="bg-[#2a1810]"
        texture={
          <TextureVeil
            src="/images/textures/qwantani-moon-noon.jpg"
            opacity={0.78}
            position="center"
            filter="saturate(1.15) contrast(1.04) brightness(0.72)"
          />
        }
        overlay={<div className="pointer-events-none absolute inset-0 bg-[rgba(48,28,14,0.38)]" />}
      >
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.06),transparent_40%)]" />
        <ProblemSection />
      </Panel>

      <Panel
        bg="bg-[#101820]"
        texture={
          <TextureVeil
            src="/images/textures/quarry-04-puresky.jpg"
            opacity={0.74}
            position="center top"
            filter="saturate(1.02) contrast(1.03) brightness(0.68)"
          />
        }
        overlay={<div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(8,14,26,0.42),rgba(10,18,32,0.28)_50%,rgba(6,12,22,0.48))]" />}
      >
        <AnswerSection />
      </Panel>

      <Panel bg={sectionBackgrounds.howWeBuild.baseTint} texture={<SectionBackdrop config={sectionBackgrounds.howWeBuild} />}>
        <HowWeBuildSection eqMockup={<EQInterfaceMockup />} />
      </Panel>

      <Panel bg={sectionBackgrounds.products.baseTint} texture={<SectionBackdrop config={sectionBackgrounds.products} />}>
        <ProductShowcase onNavigate={navigateTo} />
      </Panel>

      <Panel bg={sectionBackgrounds.vision.baseTint} texture={<SectionBackdrop config={sectionBackgrounds.vision} />}>
        <VisionSection />
      </Panel>

      <footer className="relative overflow-hidden border-t border-white/10 bg-[#0a0c14] px-6 py-20 text-center md:px-10 lg:px-14">
        <TextureVeil
          src="/images/textures/lichen-rock.jpg"
          opacity={0.4}
          position="center"
          filter="saturate(0.92) contrast(1.06) brightness(0.58)"
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(8,10,18,0.72),rgba(6,8,14,0.82))]" />
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
