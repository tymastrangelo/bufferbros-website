'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BB } from '@/lib/site';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/packages', label: 'The Detail' },
  { href: '/portfolio', label: 'Our Work' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const linksRef = useRef(null);
  const [pill, setPill] = useState(null); // { left, width } of the active link

  useEffect(() => { setOpen(false); }, [pathname]);

  // Slide the highlight pill to the active link on navigation.
  useEffect(() => {
    const move = () => {
      const el = linksRef.current?.querySelector('.nav-link.active');
      setPill(el ? { left: el.offsetLeft, width: el.offsetWidth } : null);
    };
    move();
    // re-measure once fonts finish loading and on resize, so the pill stays aligned
    document.fonts?.ready?.then(move);
    window.addEventListener('resize', move);
    return () => window.removeEventListener('resize', move);
  }, [pathname]);

  // The /connect link-in-bio page is chromeless.
  if (pathname === '/connect') return null;

  return (
    <header className="site-nav">
      <nav>
        <div className="container relative">
          <div className="nav-shell">
          <Link href="/" className="flex items-center shrink-0" aria-label="Buffer Bros home">
            <img src="/images/black-logo.png" alt="Buffer Bros" className="h-10 w-auto" />
          </Link>
          <div ref={linksRef} className="relative hidden md:flex items-center gap-1.5">
            {pill && <span className="nav-pill" style={{ left: pill.left, width: pill.width }} aria-hidden />}
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className={`nav-link${pathname === l.href ? ' active' : ''}`}>
                {l.label}
              </Link>
            ))}
            <a href={BB.phoneHref} className="text-sm font-semibold text-ink hover:text-brand transition-colors px-3">
              <i className="fas fa-phone-alt mr-1.5 text-brand" aria-hidden />{BB.phone}
            </a>
            <Link href="/booking" className="btn btn-primary py-2.5 px-5 text-sm">Book Now</Link>
          </div>
          <button
            className="md:hidden p-2 text-gray-900"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              {open
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M6 18L18 6" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
          </div>
          <div className={`mobile-menu ${open ? '' : 'is-hidden'} md:hidden bg-white border border-gray-100`}>
            <div className="p-3 space-y-1">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`block px-4 py-3 text-base font-medium rounded-xl hover:bg-gray-50 ${pathname === l.href ? 'text-brand' : 'text-gray-900'}`}
                >
                  {l.label}
                </Link>
              ))}
              <a href={BB.phoneHref} className="block px-4 py-3 text-base font-medium text-gray-900 hover:bg-gray-50 rounded-xl">
                <i className="fas fa-phone-alt mr-2 text-brand" aria-hidden />Call or text {BB.phone}
              </a>
              <Link href="/booking" className="btn btn-primary btn-block mt-2">Book Now</Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
