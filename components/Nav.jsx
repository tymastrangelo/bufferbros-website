'use client';

import { useState, useEffect } from 'react';
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

  useEffect(() => { setOpen(false); }, [pathname]);

  // The /connect link-in-bio page is chromeless.
  if (pathname === '/connect') return null;

  return (
    <header>
      <nav className="site-nav">
        <div className="container flex items-center justify-between h-20">
          <Link href="/" className="flex items-center shrink-0" aria-label="Buffer Bros home">
            <img src="/images/black-logo.png" alt="Buffer Bros" className="h-11 w-auto" />
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className={`nav-link${pathname === l.href ? ' active' : ''}`}>
                {l.label}
              </Link>
            ))}
            <a href={BB.phoneHref} className="text-sm font-semibold text-ink hover:text-brand transition-colors">
              <i className="fas fa-phone-alt mr-1.5 text-brand" aria-hidden />{BB.phone}
            </a>
            <Link href="/booking" className="btn btn-primary py-2.5 px-5 text-sm">Book Now</Link>
          </div>
          <button
            className="md:hidden p-2 -mr-2 text-gray-900"
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
        <div className={`mobile-menu ${open ? '' : 'is-hidden'} md:hidden border-t border-gray-100 bg-white`}>
          <div className="container py-3 space-y-1">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`block px-3 py-3 text-base font-medium rounded-lg hover:bg-gray-50 ${pathname === l.href ? 'text-brand' : 'text-gray-900'}`}
              >
                {l.label}
              </Link>
            ))}
            <a href={BB.phoneHref} className="block px-3 py-3 text-base font-medium text-gray-900 hover:bg-gray-50 rounded-lg">
              <i className="fas fa-phone-alt mr-2 text-brand" aria-hidden />Call or text {BB.phone}
            </a>
            <Link href="/booking" className="btn btn-primary btn-block mt-2">Book Now</Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
