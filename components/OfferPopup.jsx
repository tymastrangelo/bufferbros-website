'use client';

/* "Get 5% off your first detail" email capture. Opens once per visitor after ~12s,
   half a page of scroll, or (desktop) when the cursor heads for the tab bar; any
   "Get the code" link opens it on demand. Never interrupts booking or the
   link-in-bio page. Esc, the scrim, and "No thanks" all close it. */
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { OFFER, getClaim, markSeen, setClaim, shouldAutoOpen } from '@/lib/offer';
import { getAttribution } from '@/lib/track';
import { IconCheck, IconX } from '@/components/Icons';
import Wheel from '@/components/Wheel';

export default function OfferPopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [state, setState] = useState('idle'); // idle | sending | done | error
  const [error, setError] = useState('');
  const input = useRef(null);
  const quiet = pathname === '/booking' || pathname === '/connect';

  // on-demand opening (promo bar, links)
  useEffect(() => {
    const show = () => {
      if (getClaim()) setState('done');
      setOpen(true);
    };
    window.addEventListener('bb:offer-open', show);
    return () => window.removeEventListener('bb:offer-open', show);
  }, []);

  // automatic opening, once
  useEffect(() => {
    if (quiet || !shouldAutoOpen()) return;
    let fired = false;
    const fire = () => {
      if (fired) return;
      fired = true;
      markSeen();
      setOpen(true);
      cleanup();
    };
    const timer = setTimeout(fire, 12000);
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0 && window.scrollY / max > 0.5) fire();
    };
    const onLeave = (e) => e.clientY <= 0 && fire();
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('mouseout', onLeave);
    function cleanup() {
      clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('mouseout', onLeave);
    }
    return cleanup;
  }, [quiet]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    setTimeout(() => input.current?.focus({ preventScroll: true }), 50);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  async function submit(e) {
    e.preventDefault();
    setError('');
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) return setError('Enter a valid email address.');
    setState('sending');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), attribution: getAttribution() }),
      }).then((r) => r.json());
      if (!res.ok) throw new Error(res.error);
      setClaim(email.trim());
      if (typeof window.gtag === 'function') window.gtag('event', 'sign_up', { method: 'welcome_offer' });
      setState('done');
    } catch (err) {
      setState('error');
      setError(err.message || 'That did not go through. Try again in a moment.');
    }
  }

  if (!open) return null;
  return (
    <>
      <div className="modal-scrim" onClick={() => setOpen(false)} />
      <div role="dialog" aria-modal="true" aria-labelledby="offer-title" className="modal grid md:grid-cols-[0.9fr_1.1fr]">
        <div className="relative hidden md:block">
          <img src="/images/aston-db11.jpg" alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
        </div>
        <div className="relative p-6 sm:p-9">
          <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="absolute right-3 top-3 h-10 w-10 grid place-items-center rounded-full text-ink-2 hover:bg-[color:var(--surface-2)]">
            <IconX size={20} />
          </button>

          {state === 'done' ? (
            <div className="rise pt-2">
              <span className="h-12 w-12 grid place-items-center rounded-full bg-[color:var(--color-ok)] text-white"><IconCheck size={24} weight="bold" /></span>
              <h2 id="offer-title" className="text-3xl mt-5">You are in.</h2>
              <p className="mt-3 text-ink-2">Your {OFFER.pct}% off is saved and applies automatically when you book. We also emailed you the code.</p>
              <p className="mt-5 inline-flex items-center gap-3 rounded-xl border-2 border-dashed border-[color:var(--line)] px-4 py-2.5">
                <span className="text-sm text-ink-2">Code</span>
                <span className="text-xl font-bold wide text-ink tracking-wide">{OFFER.code}</span>
              </p>
              <Link href="/booking" onClick={() => setOpen(false)} className="btn btn-primary btn-block mt-6">Book with {OFFER.pct}% off</Link>
            </div>
          ) : (
            <form onSubmit={submit} className="pt-2">
              <h2 id="offer-title" className="text-3xl sm:text-4xl">Get {OFFER.pct}% off your first detail</h2>
              <p className="mt-3 text-ink-2">Join our email list and we will send your code right now. A few emails a year, mostly seasonal openings. Unsubscribe any time.</p>
              <label htmlFor="offer-email" className="label mt-6">Email</label>
              <input ref={input} id="offer-email" type="email" inputMode="email" autoComplete="email" className="field" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              {error && <p role="alert" className="mt-2 text-sm text-red-700">{error}</p>}
              <button type="submit" disabled={state === 'sending'} className="btn btn-primary btn-block mt-4">
                {state === 'sending' ? <><Wheel size={18} /> Sending your code…</> : `Get my ${OFFER.pct}% off`}
              </button>
              <button type="button" onClick={() => setOpen(false)} className="mt-3 w-full text-center text-sm text-ink-2 hover:text-ink py-2">No thanks</button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
