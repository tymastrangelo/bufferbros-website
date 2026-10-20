'use client';

import { useEffect, useRef, useState } from 'react';

/* Materializes its element the first time it scrolls into view (CSS: "motion" in
   globals.css). Renders plain until its own effect runs, so server HTML, no-JS and
   reduced-motion visitors always see content, and anything already on screen at mount
   just stays put. React owns the class (state), so streaming/hydration never mismatches.
   `i` staggers siblings. */
export default function Reveal({ as: Tag = 'div', className = '', i, style, ...rest }) {
  const ref = useRef(null);
  const [state, setState] = useState(''); // '' (static) → 'armed' (hidden) → 'in' (animating)

  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    setState('armed');
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setState('in'); io.disconnect(); }
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={`reveal ${className} ${state}`.trim()}
         style={i == null ? style : { ...style, '--i': i }} {...rest} />
  );
}
