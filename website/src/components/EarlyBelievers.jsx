import { useState } from 'react';
import SectionMarker from './SectionMarker';
import TextureVeil from './TextureVeil';

/** Override with VITE_FORMSPREE_ID in website/.env if you swap forms */
const FORMSPREE_FORM_ID = import.meta.env.VITE_FORMSPREE_ID || 'mbdpqojl';

export default function EarlyBelievers() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle');
  const submitting = status === 'submitting';

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    try {
      const body = new FormData();
      body.append('email', email);
      if (message.trim()) body.append('message', message.trim());
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_FORM_ID}`, {
        method: 'POST',
        body,
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        setStatus('success');
        setEmail('');
        setMessage('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <section
      id="believers"
      className="relative z-10 min-w-0 overflow-x-clip border-t border-white/10 bg-[#11131c] px-6 py-24 md:px-10 lg:px-14 lg:py-28"
    >
      <TextureVeil
        src="/images/textures/rogland-clear-night.jpg"
        opacity={0.22}
        position="center 40%"
        filter="saturate(0.85) contrast(1.08) brightness(0.38)"
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(17,19,28,0.72),rgba(14,16,24,0.88))]" />
      <div className="panel-shell relative z-10 min-w-0 max-w-full">
        <SectionMarker number="07" title="EARLY BELIEVERS" className="mb-10" />
        <div className="glass-pane max-w-2xl px-6 py-6 sm:px-8 sm:py-8">
          <div className="border-l-2 border-[#ffb84d]/35 pl-6 sm:pl-8">
            <h2 className="texture-type-shadow display-tight text-[#f0ebe0]">BELIEVE IN HUMAN-FIRST MUSIC?</h2>
            <p className="texture-type-shadow-soft mt-6 text-lg leading-relaxed text-[#c6cfdd] sm:text-xl">
              This is bigger than a product launch. We are gathering the people who think the creative act is worth protecting. If that is
              you, leave your email. When we move, you hear first.
            </p>

            {status === 'success' ? (
              <p className="mt-8 font-mono text-sm uppercase tracking-[0.2em] text-[#5dd4f0]">You&apos;re in. We&apos;ll be in touch.</p>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
                <label className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#8d94ab]">
                  <span className="mb-2 block">Email</span>
                  <input
                    type="email"
                    name="email"
                    required
                    value={email}
                    onChange={(ev) => setEmail(ev.target.value)}
                    autoComplete="email"
                    className="w-full rounded-xl border border-white/15 bg-[#0a0c12]/80 px-4 py-3 font-sans text-base normal-case tracking-normal text-[#f0ebe0] placeholder:text-[#6f768a] outline-none transition-colors focus:border-[#5dd4f0]/50"
                    placeholder="you@example.com"
                  />
                </label>
                <label className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#8d94ab]">
                  <span className="mb-2 block">A note for Tessera</span>
                  <textarea
                    name="message"
                    rows={4}
                    value={message}
                    onChange={(ev) => setMessage(ev.target.value)}
                    className="w-full resize-y rounded-xl border border-white/15 bg-[#0a0c12]/80 px-4 py-3 font-sans text-base normal-case tracking-normal text-[#f0ebe0] placeholder:text-[#6f768a] outline-none transition-colors focus:border-[#5dd4f0]/50"
                    placeholder="Thoughts, hopes, or why you are here…"
                  />
                </label>
                <button
                  type="submit"
                  disabled={submitting}
                  className="self-start rounded-full border border-[#ffb84d]/45 bg-[#ffb84d]/14 px-8 py-3 font-mono text-xs font-semibold uppercase tracking-[0.26em] text-[#ffe1af] transition-all duration-300 hover:border-[#ffb84d] hover:bg-[#ffb84d]/22 disabled:opacity-50 sm:self-end"
                >
                  {submitting ? 'Sending…' : 'Stand with us'}
                </button>
              </form>
            )}

            {status === 'error' ? (
              <p className="mt-4 text-sm text-[#ff6a33]">Something went wrong. Try again or email hello@tessera.audio.</p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
