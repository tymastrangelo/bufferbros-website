'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BB } from '@/lib/site';
import { IconText } from '@/components/Icons';

/* Phones: Book and Text stay one tap away on every page (the booking page has
   its own price bar, the link-in-bio page has no chrome). */
export default function ActionBar() {
  const pathname = usePathname();
  if (pathname === '/booking' || pathname === '/connect') return null;
  return (
    <>
      <div className="h-[calc(4.5rem+env(safe-area-inset-bottom))] md:hidden" aria-hidden />
      <div className="action-bar md:hidden flex gap-2.5">
        <a href={BB.smsHref} className="btn btn-outline shrink-0 px-4" aria-label="Text us">
          <IconText size={20} /> Text
        </a>
        <Link href="/booking" className="btn btn-primary grow">Book a detail</Link>
      </div>
    </>
  );
}
