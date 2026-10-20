'use client';

/* Hero before/after: the real photo on the left of a squeegee blade, a "before" on
   the right. The before is an AI edit of the same photo (dust, brake dust, road
   grime) composited onto the original background, so everything but the car is
   pixel-identical and nothing jumps at the blade. The caption says it's simulated.
   The blade wipes once, dirty to clean, when it first comes into view, then follows a drag (mouse or
   a sideways swipe; vertical swipes still scroll the page) or the arrow keys.
   Reduced motion: no sweep, blade parked at the middle. */
import { useEffect, useRef, useState } from 'react';
import { IconArrowsHorizontal } from '@/components/Icons';

export default function BeforeAfter({ src, beforeSrc, alt }) {
  const box = useRef(null);
  const dirty = useRef(null);
  const blade = useRef(null);
  const before = useRef(null);
  const after = useRef(null);
  const pos = useRef(50);
  const dragging = useRef(false);
  const [ready, setReady] = useState(false);
  const [value, setValue] = useState(50); // for aria only, updated on release / keys

  const apply = (p) => {
    pos.current = Math.max(0, Math.min(100, p));
    const x = pos.current;
    if (dirty.current) dirty.current.style.clipPath = `inset(0 0 0 ${x}%)`;
    if (blade.current) blade.current.style.left = `${x}%`;
    if (before.current) before.current.style.opacity = x > 82 ? '0' : '1';
    if (after.current) after.current.style.opacity = x < 18 ? '0' : '1';
  };

  useEffect(() => {
    const img = new Image();
    img.src = beforeSrc;
    let raf = 0;
    let io;
    img.decode().then(() => {
      setReady(true);
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce) return apply(50);
      apply(4); // starts dirty; the blade wipes left to right and leaves it clean
      io = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now() + 600; // lands after the hero photo settles in
        const tick = (now) => {
          if (dragging.current) return; // the visitor took over
          const t = Math.min(1, Math.max(0, (now - t0) / 1500));
          const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
          apply(4 + (60 - 4) * ease);
          if (t < 1) raf = requestAnimationFrame(tick);
          else setValue(60);
        };
        raf = requestAnimationFrame(tick);
      }, { threshold: 0.3 });
      io.observe(box.current);
    }).catch(() => setReady(true));
    return () => { cancelAnimationFrame(raf); io?.disconnect(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [beforeSrc]);

  const fromEvent = (e) => {
    const rect = box.current.getBoundingClientRect();
    return ((e.clientX - rect.left) / rect.width) * 100;
  };
  const onDown = (e) => {
    dragging.current = true;
    box.current.setPointerCapture?.(e.pointerId);
    apply(fromEvent(e));
  };
  const onMove = (e) => dragging.current && apply(fromEvent(e));
  const onUp = () => {
    if (!dragging.current) return;
    dragging.current = false;
    setValue(Math.round(pos.current));
  };
  const onKey = (e) => {
    const step = e.shiftKey ? 15 : 5;
    if (e.key === 'ArrowLeft') apply(pos.current - step);
    else if (e.key === 'ArrowRight') apply(pos.current + step);
    else if (e.key === 'Home') apply(0);
    else if (e.key === 'End') apply(100);
    else return;
    e.preventDefault();
    setValue(Math.round(pos.current));
  };

  return (
    <figure>
      <div
        ref={box}
        className="ba aspect-[4/3] w-full"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        <img src={src} alt={alt} draggable={false} />
        <img ref={dirty} src={beforeSrc} alt="" aria-hidden draggable={false} className={`transition-opacity duration-300 ${ready ? 'opacity-100' : 'opacity-0'}`} style={{ clipPath: 'inset(0 0 0 4%)' }} />
        <span ref={after} className="ba-tag left-4" style={{ opacity: 0 }}>After</span>
        <span ref={before} className="ba-tag right-4">Before</span>
        <div ref={blade} className="ba-blade" style={{ left: '4%' }}>
          <button
            type="button"
            className="ba-grip"
            role="slider"
            aria-label="Before and after comparison"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={value}
            aria-valuetext={`${value}% showing the detailed car`}
            onKeyDown={onKey}
          >
            <IconArrowsHorizontal size={22} weight="bold" />
          </button>
        </div>
      </div>
      <figcaption className="mt-3 text-sm text-[color:var(--slate-soft)]">
        Drag to compare. A car we detailed in Naples. The before photo is an AI simulation.
      </figcaption>
    </figure>
  );
}
