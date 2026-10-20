'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BB } from '@/lib/site';
import { IconFacebook, IconInstagram, IconStar } from '@/components/Icons';

export default function Footer() {
  const pathname = usePathname();
  if (pathname === '/connect') return null;

  return (
    <footer className="pt-16 pb-10 text-ink-2">
      <div className="container">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <img src="/images/black-logo.png" alt="Buffer Bros" className="h-9 w-auto mb-5" />
            <p className="text-sm leading-relaxed max-w-xs">
              Mobile detailing in {BB.area}. We come to your driveway, dock or garage.
            </p>
            <p className="text-ink font-semibold mt-5 num">
              <a href={BB.phoneHref} className="hover:underline">{BB.phone}</a>
            </p>
            <p className="text-sm">Call or text, {BB.hours.toLowerCase()}</p>
          </div>
          <div>
            <h2 className="text-sm font-semibold mb-4">Services</h2>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/packages" className="hover:text-ink">The Detail and pricing</Link></li>
              <li><Link href="/packages#plans" className="hover:text-ink">Maintenance plans</Link></li>
              <li><Link href="/boats" className="hover:text-ink">Boat detailing</Link></li>
              <li><Link href="/booking" className="hover:text-ink">Book online</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-semibold mb-4">Company</h2>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/about" className="hover:text-ink">About us</Link></li>
              <li><Link href="/portfolio" className="hover:text-ink">Our work</Link></li>
              <li><a href={BB.reviews} target="_blank" rel="noopener noreferrer" className="hover:text-ink inline-flex items-center gap-1.5"><IconStar size={14} weight="fill" className="text-[color:var(--color-sun)]" /> Google reviews</a></li>
              <li><Link href="/terms" className="hover:text-ink">Terms</Link> and <Link href="/privacy" className="hover:text-ink">privacy</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[color:var(--line)] mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <p>&copy; {new Date().getFullYear()} Buffer Bros Detailing. Fully insured.</p>
          <div className="flex gap-2">
            <a href={BB.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="h-10 w-10 grid place-items-center rounded-full bg-[color:var(--surface-2)] hover:bg-[color:var(--line)] text-ink"><IconInstagram size={20} /></a>
            <a href={BB.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="h-10 w-10 grid place-items-center rounded-full bg-[color:var(--surface-2)] hover:bg-[color:var(--line)] text-ink"><IconFacebook size={20} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
