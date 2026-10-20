import Link from 'next/link';
import { BB } from '@/lib/site';
import { IconCalendar, IconCar, IconInstagram, IconPhone, IconStar, IconText } from '@/components/Icons';

export const metadata = {
  title: 'Connect with Buffer Bros',
  description: 'Book, call, text, or follow Buffer Bros Mobile Detailing in Marco Island and Naples, FL.',
  alternates: { canonical: '/connect' },
  robots: { index: false },
};

const LINKS = [
  { href: '/booking', label: 'Book a detail', icon: IconCalendar, primary: true },
  { href: BB.smsHref, label: 'Text us', icon: IconText },
  { href: BB.phoneHref, label: 'Call us', icon: IconPhone },
  { href: '/packages', label: 'The Detail and pricing', icon: IconCar },
  { href: BB.reviewLink, label: 'Leave a Google review', icon: IconStar, external: true },
  { href: BB.instagram, label: 'Instagram', icon: IconInstagram, external: true },
];

/* Link-in-bio page: no nav, no footer, one column of big taps. */
export default function ConnectPage() {
  return (
    <section className="section-ink min-h-[100svh] flex flex-col items-center justify-center px-6 py-14 text-center">
      <Link href="/"><img src="/images/transparent-logo.png" alt="Buffer Bros" className="w-52" /></Link>
      <p className="mt-4 text-white/70">Mobile detailing in Marco Island and Naples</p>
      <div className="mt-9 flex flex-col gap-3 w-full max-w-sm">
        {LINKS.map(({ href, label, icon: Icon, primary, external }) => {
          const cls = `btn btn-block justify-start px-5 ${primary ? 'btn-primary' : 'btn-glass'}`;
          const body = <><Icon size={20} /> <span className="grow text-center -ml-5">{label}</span></>;
          return href.startsWith('/') ? (
            <Link key={label} href={href} className={cls}>{body}</Link>
          ) : (
            <a key={label} href={href} className={cls} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{body}</a>
          );
        })}
      </div>
      <p className="text-white/40 text-xs mt-10">&copy; {new Date().getFullYear()} Buffer Bros Detailing</p>
    </section>
  );
}
