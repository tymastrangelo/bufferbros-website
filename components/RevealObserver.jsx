'use client';

import { useEffect } from 'react';

/* Fades .reveal elements in as they enter the viewport. Watches the DOM itself
   (not the route) so elements added by client-side navigation, tab switches, or
   streaming are always picked up — pathname-based re-runs fired too early and
   left new pages invisible. */
export default function RevealObserver() {
  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });

    const seen = new WeakSet(); // no DOM writes here — attributes added mid-hydration break React
    const observeAll = () => {
      document.querySelectorAll('.reveal:not(.in)').forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        io.observe(el);
      });
    };
    observeAll();
    const mo = new MutationObserver(observeAll);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { mo.disconnect(); io.disconnect(); };
  }, []);

  return null;
}
