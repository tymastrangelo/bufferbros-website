import Link from 'next/link';
import { BB } from '@/lib/site';
import InViewVideo from '@/components/InViewVideo';
import Reveal from '@/components/Reveal';
import { IconInstagram } from '@/components/Icons';

export const metadata = {
  title: 'Our Work | Mobile Detailing in Marco Island & Naples',
  description: 'Real cars Buffer Bros has detailed in Marco Island and Naples, FL. Photos and clips from our own jobs, plus new ones on Instagram @bufferbros.fl.',
  alternates: { canonical: '/portfolio' },
  openGraph: { title: 'Our Work | Buffer Bros Mobile Detailing', description: 'Photos and clips from our own jobs.', url: '/portfolio' },
};

// Each tile: a photo, or a muted looping clip linking to the full video.
const TILES = [
  { kind: 'img', src: '/images/aston-db11.jpg', alt: 'Light-blue Aston Martin DB11 Volante after a full detail in Naples', caption: 'Aston Martin DB11 in Naples', span: 'md:col-span-2 md:row-span-2' },
  { kind: 'video', src: '/videos/reel-range-rover.mp4', poster: '/images/posters/reel-range-rover.jpg', href: 'https://www.tiktok.com/t/ZThve9kvv/', caption: 'Range Rover HSE, watch the full clip' },
  { kind: 'img', src: '/images/mercedes-s-interior.jpg', alt: 'Cream leather Mercedes-Benz S-Class interior after detailing', caption: 'Mercedes S-Class interior' },
  { kind: 'img', src: '/images/audi-q8-foam.jpg', alt: 'Audi Q8 in a thick foam bath during a mobile detail', caption: 'Audi Q8 foam bath' },
  { kind: 'video', src: '/videos/reel-toyotas.mp4', poster: '/images/posters/reel-toyotas.jpg', href: 'https://www.tiktok.com/t/ZThveSwB4/', caption: 'Two Toyotas, watch the full clip' },
  { kind: 'img', src: '/images/aston-db11-interior.jpg', alt: 'Blue and white leather Aston Martin interior after detailing', caption: 'DB11 interior' },
  { kind: 'img', src: '/images/job-4runner-wash.jpg', alt: 'Pressure washing a white Toyota 4Runner in a driveway', caption: 'Toyota 4Runner', span: 'md:col-span-2' },
  { kind: 'img', src: '/images/job-rangerover-rinse.jpg', alt: 'Rinsing a foamed Range Rover on a paver driveway', caption: 'Range Rover rinse' },
];

export default function PortfolioPage() {
  return (
    <>
      <section className="section section-light pb-10">
        <div className="container flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="load kicker">Our work</p>
            <h1 className="load [--i:1] display mt-2">Straight from the camera roll.</h1>
            <p className="load [--i:2] lede mt-5">Real cars we have detailed around Marco Island and Naples. New ones go up on Instagram the day we finish.</p>
          </div>
          <a href={BB.instagram} target="_blank" rel="noopener noreferrer" className="load [--i:3] btn btn-outline"><IconInstagram size={20} /> @bufferbros.fl</a>
        </div>
      </section>

      <section className="pb-16 sm:pb-24">
        <div className="container grid grid-cols-2 md:grid-cols-4 md:auto-rows-[14rem] gap-3 sm:gap-4">
          {TILES.map((t, i) => {
            const inner = (
              <>
                {t.kind === 'img' ? (
                  <img src={t.src} alt={t.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <InViewVideo src={t.src} poster={t.poster} label={t.caption} className="absolute inset-0 h-full w-full object-cover" />
                )}
                <figcaption className="absolute inset-x-0 bottom-0 p-3 sm:p-4 text-white text-xs sm:text-sm font-medium bg-gradient-to-t from-black/75 to-transparent">{t.caption}</figcaption>
              </>
            );
            const cls = `zoom group relative overflow-hidden rounded-2xl aspect-square md:aspect-auto ${t.span ?? ''}`;
            return t.href ? (
              <Reveal as="a" key={t.src} href={t.href} target="_blank" rel="noopener noreferrer" className={cls} i={i % 4}><figure>{inner}</figure></Reveal>
            ) : (
              <Reveal as="figure" key={t.src} className={cls} i={i % 4}>{inner}</Reveal>
            );
          })}
        </div>
      </section>

      <section className="section section-sand">
        <div className="container flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <h2 className="h2 max-w-lg">Your car could be the next one up here.</h2>
          <Link href="/booking" className="btn btn-primary">Book your detail</Link>
        </div>
      </section>
    </>
  );
}
