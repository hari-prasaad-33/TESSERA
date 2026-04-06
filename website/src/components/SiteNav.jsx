import { useEffect, useState } from 'react';
import Logogram from './Logogram';

export default function SiteNav({ currentPage = 'home', onNavigate }) {
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 36);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isSubPage = currentPage !== 'home';

  const handleSection = (id) => {
    setShowDropdown(false);

    if (currentPage === 'home') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    onNavigate('home');
    window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 140);
  };

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 px-6 py-4 transition-all duration-300 md:px-10 lg:px-14 ${
        scrolled || isSubPage
          ? 'border-b border-white/6 bg-[#080d16]/82 backdrop-blur-xl'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4">
        <button onClick={() => onNavigate('home')} className="flex items-center gap-3">
          <Logogram size={30} progress={72} color="text-tessera-orange" />
          <span className="text-lg font-semibold tracking-[0.18em] text-[#f0ebe0]">TESSERA</span>
        </button>

        <div className="hidden items-center gap-8 font-mono text-[11px] uppercase tracking-[0.26em] text-[#b8c0d1] md:flex">
          <button className="transition-colors hover:text-white" onClick={() => handleSection('home')}>
            Home
          </button>
          <button className="transition-colors hover:text-white" onClick={() => handleSection('philosophy')}>
            Philosophy
          </button>

          <div className="relative" onMouseEnter={() => setShowDropdown(true)} onMouseLeave={() => setShowDropdown(false)}>
            <button className="transition-colors hover:text-white">Products</button>
            {showDropdown && (
              <div className="absolute left-1/2 top-full mt-3 w-72 -translate-x-1/2 rounded-[1.2rem] border border-white/10 bg-[#060A13]/94 p-2 shadow-[0_22px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
                <button
                  onClick={() => handleSection('how-eq-works')}
                  className="flex w-full items-start gap-3 rounded-[1rem] px-4 py-3 text-left transition-colors hover:bg-white/[0.04]"
                >
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#5dd4f0]" />
                  <span>
                    <span className="block font-mono text-[10px] uppercase tracking-[0.28em] text-[#d5f8ff]">Tessera EQ</span>
                    <span className="mt-1 block text-[11px] normal-case tracking-normal text-[#99a3b7]">Intent-driven parametric EQ available now.</span>
                  </span>
                </button>

                <button
                  onClick={() => handleSection('products')}
                  className="mt-1 flex w-full items-start gap-3 rounded-[1rem] px-4 py-3 text-left transition-colors hover:bg-white/[0.04]"
                >
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#ffb84d]" />
                  <span>
                    <span className="block font-mono text-[10px] uppercase tracking-[0.28em] text-[#ffe1af]">Tessera One</span>
                    <span className="mt-1 block text-[11px] normal-case tracking-normal text-[#99a3b7]">The integrated suite coming next.</span>
                  </span>
                </button>
              </div>
            )}
          </div>

          <button className="transition-colors hover:text-white" onClick={() => handleSection('how-eq-works')}>
            Explore TESSERA EQ
          </button>
        </div>

        <div className="flex items-center gap-3">
          {isSubPage && (
            <button
              onClick={() => onNavigate('home')}
              className="rounded-full border border-white/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.24em] text-[#d2daea] transition-all duration-300 hover:border-white/20 hover:text-white md:hidden"
            >
              Home
            </button>
          )}
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
            <span
              className={`h-2 w-2 rounded-full ${
                currentPage === 'discover' ? 'bg-[#ffb84d]' : 'bg-[#ff6a33]'
              }`}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
