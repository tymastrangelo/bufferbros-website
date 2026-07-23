'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BB } from '@/lib/site';

export default function Footer() {
  const pathname = usePathname();
  if (pathname === '/connect') return null;

  return (
    <footer className="section-dark glow-bottom text-white pt-16 pb-8">
      <div className="container">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div>
            <img src="/images/transparent-logo.png" alt="Buffer Bros" className="h-12 w-auto mb-4" />
            <p className="text-gray-400 text-sm leading-relaxed">
              Premium mobile detailing brought to your driveway in {BB.area}.
            </p>
            <div className="flex gap-3 mt-5">
              <a href={BB.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                 className="h-10 w-10 grid place-items-center rounded-full bg-white/10 hover:bg-white/20 transition"><i className="fab fa-instagram" aria-hidden /></a>
              <a href={BB.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                 className="h-10 w-10 grid place-items-center rounded-full bg-white/10 hover:bg-white/20 transition"><i className="fab fa-facebook-f" aria-hidden /></a>
              <a href={BB.phoneHref} aria-label="Call us"
                 className="h-10 w-10 grid place-items-center rounded-full bg-white/10 hover:bg-white/20 transition"><i className="fas fa-phone-alt" aria-hidden /></a>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4">Explore</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/" className="text-gray-400 hover:text-white transition">Home</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white transition">About</Link></li>
              <li><Link href="/packages" className="text-gray-400 hover:text-white transition">The Detail &amp; Pricing</Link></li>
              <li><Link href="/portfolio" className="text-gray-400 hover:text-white transition">Our Work</Link></li>
              <li><Link href="/booking" className="text-gray-400 hover:text-white transition">Book Now</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4">Company</h3>
            <ul className="space-y-2.5 text-sm">
              <li><a href={BB.reviews} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">Google Reviews</a></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-white transition">Terms &amp; Conditions</Link></li>
              <li><Link href="/privacy" className="text-gray-400 hover:text-white transition">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4">Contact</h3>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li><a href={BB.phoneHref} className="hover:text-white transition"><i className="fas fa-phone-alt w-5" aria-hidden />{BB.phone}</a></li>
              <li><a href={BB.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-white transition"><i className="fab fa-instagram w-5" aria-hidden />@bufferbros.fl</a></li>
              <li><span><i className="fas fa-location-dot w-5" aria-hidden />{BB.area}</span></li>
              <li><span><i className="fas fa-clock w-5" aria-hidden />{BB.hours}</span></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
          <p>&copy; 2026 Buffer Bros Detailing. All rights reserved.</p>
          <p>Insured mobile detailing in Southwest Florida.</p>
        </div>
      </div>
    </footer>
  );
}
