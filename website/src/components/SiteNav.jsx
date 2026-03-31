import React, { useState, useEffect } from 'react';
import Logogram from './Logogram';

/**
 * Shared navigation bar used on all pages.
 * Props:
 *   currentPage  — 'home' | 'eq-features' | 'discover'
 *   onNavigate   — (page) => void
 *   onScrollTo   — (sectionId) => void  (only meaningful on home page)
 */
const SiteNav = ({ currentPage = 'home', onNavigate, onScrollTo }) => {
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const goHome = () => onNavigate('home');

  const handleSection = (id) => {
    setShowDropdown(false);
    if (currentPage === 'home') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      onNavigate('home');
      // scroll after nav renders
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 120);
    }
  };

  const isSubPage = currentPage !== 'home';

  return (
    <nav className={`fixed top-0 w-full z-50 px-6 py-4 flex items-center justify-between transition-all duration-300 ${
      scrolled || isSubPage
        ? 'backdrop-blur-xl bg-tessera-ink/85 border-b border-white/5'
        : ''
    }`}>

      {/* ── Left: Logo ──────────────────────────────── */}
      <button
        onClick={goHome}
        className="flex items-center gap-2 group"
      >
        <Logogram size={32} progress={70} color="text-tessera-orange" />
        <span className="font-display font-bold tracking-tighter text-xl text-white">TESSERA</span>
      </button>

      {/* ── Centre: Nav links ───────────────────────── */}
      <div className="hidden md:flex items-center gap-10 font-mono text-sm tracking-[0.2em]">

        {/* Back / Home */}
        {isSubPage && (
          <button
            onClick={goHome}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 text-gray-300 hover:border-white/30 hover:text-white transition-all duration-300 group"
          >
            <span className="transition-transform duration-300 group-hover:-translate-x-0.5">←</span>
            <span>HOME</span>
          </button>
        )}

        {!isSubPage && (
          <button
            onClick={() => handleSection('home')}
            className="text-tessera-dim hover:text-white transition-colors duration-300"
          >
            HOME
          </button>
        )}

        {/* Products dropdown */}
        <div
          className="relative"
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={() => setShowDropdown(false)}
        >
          <span className="cursor-pointer text-tessera-dim hover:text-white transition-colors duration-300 py-4 block select-none">
            PRODUCTS ▾
          </span>

          {showDropdown && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-64 glass-card p-2 rounded-xl border border-white/10 shadow-2xl z-50">
              {/* Tessera EQ */}
              <button
                onClick={() => { setShowDropdown(false); onNavigate('eq-features'); }}
                className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg transition-colors group ${
                  currentPage === 'eq-features' ? 'bg-tessera-teal/10' : 'hover:bg-white/5'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-tessera-teal flex-shrink-0"></span>
                <div>
                  <div className="font-bold text-sm tracking-widest text-tessera-teal">TESSERA EQ</div>
                  <div className="font-mono text-[9px] text-tessera-dim tracking-wider mt-0.5">
                    AI PARAMETRIC EQ — AVAILABLE
                  </div>
                </div>
                {currentPage === 'eq-features' && (
                  <span className="ml-auto font-mono text-[9px] text-tessera-teal">VIEWING</span>
                )}
              </button>

              {/* Tessera ONE */}
              <button
                onClick={() => handleSection('vision')}
                className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg hover:bg-white/5 transition-colors group"
              >
                <span className="w-2 h-2 rounded-full bg-tessera-orange flex-shrink-0"></span>
                <div>
                  <div className="font-bold text-sm tracking-widest text-tessera-orange">TESSERA ONE</div>
                  <div className="font-mono text-[9px] text-tessera-dim tracking-wider mt-0.5">
                    MIXING SUITE — COMING 2026
                  </div>
                </div>
              </button>

              {/* DAW teaser */}
              <div className="mx-4 my-1 h-[1px] bg-white/5"></div>
              <div className="flex items-center gap-3 px-4 py-2 opacity-40 cursor-default">
                <span className="w-2 h-2 rounded-full border border-tessera-dim flex-shrink-0"></span>
                <div className="font-mono text-[9px] text-tessera-dim tracking-wider">
                  TESSERA DAW — THE MOONSHOT
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Context-aware right link */}
        {currentPage === 'eq-features' ? (
          <button
            onClick={() => handleSection('philosophy')}
            className="text-tessera-dim hover:text-white transition-colors duration-300"
          >
            OUR PHILOSOPHY
          </button>
        ) : currentPage === 'discover' ? (
          <button
            onClick={() => onNavigate('eq-features')}
            className="text-tessera-teal hover:text-white transition-colors duration-300"
          >
            EXPLORE EQ
          </button>
        ) : (
          <button
            onClick={() => onNavigate('eq-features')}
            className="text-tessera-dim hover:text-white transition-colors duration-300"
          >
            EXPLORE EQ
          </button>
        )}
      </div>

      {/* ── Right: Page indicator dot ───────────────── */}
      <div className="flex items-center gap-3">
        {/* Mobile back button */}
        {isSubPage && (
          <button
            onClick={goHome}
            className="md:hidden flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 text-gray-300 text-sm hover:border-white/30 hover:text-white transition-all"
          >
            ← HOME
          </button>
        )}
        <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center">
          <div className={`w-1.5 h-1.5 rounded-full ${
            currentPage === 'eq-features' ? 'bg-tessera-teal' :
            currentPage === 'discover'    ? 'bg-tessera-orange' :
            'bg-tessera-teal'
          }`}></div>
        </div>
      </div>

    </nav>
  );
};

export default SiteNav;
