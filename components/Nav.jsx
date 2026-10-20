'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BB } from '@/lib/site';
import { IconMenu, IconPhone, IconX } from '@/components/Icons';

export const NAV_LINKS = [
  { href: '/packages', label: 'The Detail' },
  { href: '/boats', label: 'Boats' },
  { href: '/portfolio', label: 'Our Work' },
  { href: '/about', label: 'About' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (pathname === '/connect') return null; // link-in-bio page is chromeless

  return (
    <header className="site-nav">
      <nav className="nav-bar" aria-label="Main">
        <div className="container flex h-16 items-center justify-between gap-4">
          <Link href="/" className="shrink-0" aria-label="Buffer Bros home">
            <img src="/images/black-logo.png" alt="Buffer Bros" className="h-9 w-auto" />
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className={`nav-link${pathname.startsWith(l.href) ? ' active' : ''}`}
                    aria-current={pathname.startsWith(l.href) ? 'page' : undefined}>
                {l.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <a href={BB.phoneHref} className="nav-link inline-flex items-center gap-1.5 num">
              <IconPhone size={16} /> {BB.phone}
            </a>
            <Link href="/booking" className="btn btn-primary btn-sm">Book now</Link>
          </div>

          <button
            className="md:hidden -mr-2 h-11 w-11 grid place-items-center rounded-full text-ink"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <IconX size={24} /> : <IconMenu size={24} />}
          </button>
        </div>
      </nav>

      {/* phone menu: full-width sheet under the bar */}
      <div className={`md:hidden fixed inset-x-0 top-[calc(4rem+env(safe-area-inset-top))] bottom-0 z-40 bg-white transition-[opacity,transform] duration-200 ${open ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
        <div className="container py-4 flex flex-col">
          {[{ href: '/', label: 'Home' }, ...NAV_LINKS].map((l, i) => (
            <Link key={l.href} href={l.href} style={{ transitionDelay: open ? `${60 + i * 35}ms` : '0ms' }}
                  className={`py-4 text-2xl font-semibold text-ink border-b border-line transition-[opacity,transform] duration-300 ease-out ${open ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>{l.label}</Link>
          ))}
          <div className="mt-8 flex flex-col gap-3">
            <Link href="/booking" className="btn btn-primary btn-block">Book a detail</Link>
            <a href={BB.smsHref} className="btn btn-outline btn-block">Text us at {BB.phone}</a>
          </div>
        </div>
      </div>
    </header>
  );
}
