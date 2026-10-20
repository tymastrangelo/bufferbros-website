import Link from 'next/link';
import { BB } from '@/lib/site';
import Reveal from '@/components/Reveal';

export const metadata = {
  title: 'About Us | Local Mobile Detailers in Marco Island & Naples',
  description: 'Buffer Bros is a local mobile detailing team serving Marco Island and Naples, FL. The same two people who book your appointment do the work. Fully equipped and insured.',
  alternates: { canonical: '/about' },
  openGraph: { title: 'About | Buffer Bros Mobile Detailing', description: 'Two locals who love clean cars, serving Marco Island and Naples.', url: '/about' },
};

// Stills from our own job videos. No stock, no AI.
const PHOTOS = [
  { src: '/images/job-4runner-wash.jpg', alt: 'Pressure washing a white Toyota 4Runner in a driveway', cls: 'col-span-2' },
  { src: '/images/job-rangerover-rinse.jpg', alt: 'Rinsing a foamed Range Rover on a paver driveway in Naples', cls: '' },
  { src: '/images/job-toyota-trunk.jpg', alt: 'Cleaning the cargo area of a new Toyota', cls: '' },
];

const FACTS = [
  ['Started', '2023'],
  ['Where', 'Marco Island and Naples'],
  ['Insurance', 'Fully insured'],
];

const PROMISES = [
  ['We walk the car with you', 'Before we start and again when we finish. Not home? We plan it with you ahead of time.'],
  ['We make it right', 'If something is not right, tell us and we fix it. That is the point of hiring locals.'],
  ['We answer our own phone', 'Text or call and you get Tyler or Gabe, not a call center or a franchise.'],
];

export default function AboutPage() {
  return (
    <>
      <section className="section section-light">
        <div className="container max-w-5xl">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:items-end">
            <div className="load">
              <p className="kicker">About us</p>
              <h1 className="display mt-2">Two locals who love clean cars.</h1>
            </div>
            <p className="load [--i:1] lede">
              Buffer Bros started in 2023 with two friends, a few buckets and a habit of never leaving a car half done. Today it is a fully equipped mobile setup, and the same two people who book your appointment are the ones who show up to do it.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3">
            {PHOTOS.map((p, i) => (
              <img key={p.src} src={p.src} alt={p.alt} style={{ '--i': i + 2 }} className={`load-media ${p.cls} h-44 sm:h-56 md:h-72 w-full object-cover rounded-2xl`} />
            ))}
          </div>

          <dl className="mt-10 grid sm:grid-cols-3 gap-y-5">
            {FACTS.map(([k, v], i) => (
              <Reveal key={k} i={i} className="border-t border-[color:var(--line)] pt-4 sm:pr-6">
                <dt className="text-sm text-ink-2">{k}</dt>
                <dd className="mt-1 font-semibold text-ink">{v}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      <section className="section section-sand">
        <div className="container max-w-5xl">
          <h2 className="h2">How we work</h2>
          <p className="lede mt-4 max-w-2xl">
            Good detailing is not rushing through a checklist. It is the small things done well: the door jambs, the seams, the spots most people skip.
          </p>
          <dl className="mt-10 grid gap-8 md:grid-cols-3">
            {PROMISES.map(([t, b], i) => (
              <Reveal key={t} i={i} className="border-l-2 border-brand pl-5">
                <dt className="font-semibold text-ink">{t}</dt>
                <dd className="mt-1 text-ink-2">{b}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      <Reveal as="section" className="section section-photo" style={{ '--photo': 'url(/images/posters/broll.jpg)' }}>
        <Reveal className="container max-w-5xl flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <h2 className="h2 max-w-lg">Let us take care of your car.</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/booking" className="btn btn-primary">See open times</Link>
            <a href={BB.smsHref} className="btn btn-glass num">Text {BB.phone}</a>
          </div>
        </Reveal>
      </Reveal>
    </>
  );
}
