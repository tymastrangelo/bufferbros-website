'use client';

/* A muted, looping clip that only plays while it's on screen (saves battery and
   data on phones) and never autoplays for people who asked for reduced motion. */
import { useEffect, useRef } from 'react';

export default function InViewVideo({ src, poster, className = '', label }) {
  const ref = useRef(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => {});
      else v.pause();
    }, { threshold: 0.35 });
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      poster={poster}
      className={className}
      aria-label={label}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
