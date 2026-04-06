import { useEffect, useState } from 'react';
import ProductShowcase, { EQInterfaceMockup } from './components/ProductShowcase';
import EternalRing from './components/EternalRing';
import DiscoverPage from './components/DiscoverPage';
import EarlyBelievers from './components/EarlyBelievers';
import HeroSection from './components/HeroSection';
import ProblemSection from './components/ProblemSection';
import AnswerSection from './components/AnswerSection';
import HowWeBuildSection from './components/HowWeBuildSection';
import ThesisBridgeCard from './components/ThesisBridgeCard';
import VisionSection from './components/VisionSection';
import SiteNav from './components/SiteNav';
import TextureVeil from './components/TextureVeil';
import { contentLaneScrim, sectionBackgrounds } from './sectionBackgrounds';

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
      {config.contentLaneClass ? (
        <div className={`pointer-events-none absolute inset-0 ${config.contentLaneClass}`} />
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
      <div className="min-h-screen bg-[#080d16]">
        <SiteNav currentPage="discover" onNavigate={navigateTo} />
        <DiscoverPage onBack={() => navigateTo('home')} />
      </div>
    );
  }

  return (
    <div className="text-tessera-text selection:bg-tessera-orange selection:text-black">
      <SiteNav currentPage="home" onNavigate={navigateTo} />

      <Panel bg="bg-[#0e0c09]">
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
            opacity={0.86}
            position="center"
            filter="saturate(1.15) contrast(1.04) brightness(0.86)"
          />
        }
        overlay={<div className="pointer-events-none absolute inset-0 bg-[rgba(48,28,14,0.32)]" />}
      >
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.06),transparent_40%)]" />
        <div className={`pointer-events-none absolute inset-0 ${contentLaneScrim}`} />
        <ProblemSection />
      </Panel>

      <Panel
        bg="bg-[#101820]"
        texture={
          <TextureVeil
            src="/images/textures/quarry-04-puresky.jpg"
            opacity={0.78}
            position="center top"
            filter="saturate(1.02) contrast(1.03) brightness(0.66)"
          />
        }
        overlay={<div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(8,14,26,0.36),rgba(10,18,32,0.32)_50%,rgba(6,12,22,0.42))]" />}
      >
        <div className={`pointer-events-none absolute inset-0 ${contentLaneScrim}`} />
        <AnswerSection />
      </Panel>

      <Panel
        id="how-eq-works"
        bg={sectionBackgrounds.howWeBuild.baseTint}
        texture={<SectionBackdrop config={sectionBackgrounds.howWeBuild} />}
      >
        <HowWeBuildSection eqMockup={<EQInterfaceMockup />} includeIntro slabStart={0} slabEnd={2} />
      </Panel>

      <Panel bg={sectionBackgrounds.howWeBuildCont.baseTint} texture={<SectionBackdrop config={sectionBackgrounds.howWeBuildCont} />}>
        <HowWeBuildSection includeIntro={false} slabStart={2} slabEnd={4} />
      </Panel>

      <Panel bg={sectionBackgrounds.products.baseTint} texture={<SectionBackdrop config={sectionBackgrounds.products} />}>
        <ProductShowcase onNavigate={navigateTo} />
      </Panel>

      <Panel bg={sectionBackgrounds.vision.baseTint} texture={<SectionBackdrop config={sectionBackgrounds.vision} />}>
        <VisionSection />
      </Panel>

      <EarlyBelievers />

      <footer className="relative overflow-hidden border-t border-white/10 bg-[#0e1118] px-6 py-20 text-center md:px-10 lg:px-14">
        <TextureVeil
          src="/images/textures/rogland-clear-night.jpg"
          opacity={0.36}
          position="center bottom"
          filter="saturate(1.02) contrast(1.05) brightness(0.56)"
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(8,10,18,0.68),rgba(5,6,12,0.78))]" />
        <div className="relative z-10 panel-shell">
          <div className="mb-8 flex justify-center opacity-70 transition-opacity hover:opacity-100">
            <EternalRing />
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.34em] text-[#8d94ab]">Tessera Audio</p>
          <div className="mt-5 space-y-2 text-sm text-[#d2daea]">
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
