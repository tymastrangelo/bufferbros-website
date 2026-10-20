import Link from 'next/link';
import { BB } from '@/lib/site';
import { getCatalog } from '@/lib/catalog';
import BeforeAfter from '@/components/BeforeAfter';
import PricingTimes from '@/components/PricingTimes';
import SizeStart from '@/components/SizeStart';
import InViewVideo from '@/components/InViewVideo';
import Reveal from '@/components/Reveal';
import { IconAnchor, IconPlus, IconStar } from '@/components/Icons';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Mobile Car Detailing in Naples & Marco Island, FL | Buffer Bros',
  description: 'Mobile car detailing in Naples and Marco Island, FL. We come to your driveway, garage or condo lot. One complete detail, priced by vehicle size. See open times and book online.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Mobile Car Detailing in Naples & Marco Island, FL | Buffer Bros',
    description: 'We come to your driveway, garage or condo lot. See open times and book online.',
    url: '/',
  },
};

const REVIEWS = [
  { quote: 'Tyler and Gabe did a great job detailing my 2003 Jag. Looks new again. They were prompt and professional. I highly recommend Buffer Bros and will use them again.', name: 'Scott M.' },
  { quote: 'I booked quickly and Gabe arrived right on time, was polite, and made my 10 year old vehicle look new again. I was very pleased and will keep them in mind for future refreshers.', name: 'Phran G.' },
  { quote: 'Tyler and Gabe did a fantastic job on my old Jeep. It looked like new when they were done. They are honest and dependable and really pay attention to detail. Highly recommend.', name: 'Jim H.' },
];

const STEPS = [
  ['Book online', 'Pick your vehicle size and a real open time. It takes about a minute, and nothing is charged.'],
  ['We come to you', 'We show up with all our gear and get to work in your driveway, garage or lot, hooked up to your outdoor spigot and outlet.'],
  ['Pay when it is done', 'Look the car over when we finish, then pay by card, Zelle, Venmo or cash.'],
];

const PHOTOS = [
  { src: '/images/audi-q8-foam.jpg', alt: 'Audi Q8 in a foam bath during a mobile wash' },
  { src: '/images/mercedes-s-interior.jpg', alt: 'Mercedes-Benz S-Class cream leather interior after detailing' },
  { src: '/images/job-rangerover-rinse.jpg', alt: 'Rinsing a foamed Range Rover on a paver driveway in Naples' },
  { src: '/images/aston-db11-interior.jpg', alt: 'Aston Martin DB11 interior after detailing' },
];

// ponytail: neighborhoods beyond "Marco Island and Naples" are listed for local search;
// confirm the list with Tyler.
const AREAS = ['Marco Island', 'Naples', 'Old Naples', 'Park Shore', 'Pelican Bay', 'Vanderbilt Beach', 'Port Royal', "Fiddler's Creek"];

// Policy answers come from the existing site copy and terms. Confirm changes with Tyler.
const FAQ = [
  ['Do you need my water or power?', 'We use your outdoor water spigot and an outlet when you have them. No outlet nearby? We can bring our own power. No water we can use, like in some condo garages? Let us know when you book and we will bring water.'],
  ['How long does a detail take?', 'About two to three hours, depending on the size of the vehicle and any extras. The booking page shows the exact time for your car before you pick a slot.'],
  ['When do I pay?', 'After the detail, once you have looked the car over. Card, Zelle, Venmo or cash. Nothing is charged when you book.'],
  ['Do I need to be home?', 'No. If you are home, we walk the car with you at the start and the end. If you will not be, tell us when you book and we will plan it ahead: where the car is, how we get to it and how you want to pay.'],
  ['Can I keep it this clean?', 'Yes. A maintenance plan puts you on a weekly, bi-weekly or monthly schedule at a lower price per visit, and your first detail is discounted.'],
  ['What if something is not right?', 'Tell us and we will make it right. If you are home, we walk the car with you at the end for exactly that reason. If not, just text us.'],
];

const FAQ_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
};

function Stars({ size = 16 }) {
  return (
    <span className="inline-flex text-[color:var(--color-sun)]" aria-label="5 out of 5 stars">
      {[0, 1, 2, 3, 4].map((i) => <IconStar key={i} size={size} weight="fill" />)}
    </span>
  );
}

export default async function HomePage() {
  const S = await getCatalog();
  const disc = (S.plan && S.plan.firstVisitDiscountPct) || 10;
  const from = (S.detail.pricing.sedan || {}).price;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_LD) }} />

      {/* HERO */}
      <section>
        <div className="container grid gap-10 lg:grid-cols-[1.12fr_1fr] lg:gap-14 items-center pt-8 pb-12 sm:pt-12 lg:pt-14 lg:pb-14">
          <div>
            <a href={BB.reviews} target="_blank" rel="noopener noreferrer" className="load inline-flex items-center gap-2 text-sm font-medium text-ink-2 hover:text-ink">
              <Stars /> 5.0 on Google
            </a>
            <h1 className="load [--i:1] display mt-4">Mobile car detailing in Naples and Marco Island</h1>
            <p className="load [--i:2] lede mt-6 max-w-lg">
              We come to your driveway, garage or condo lot. One complete detail, inside and out, priced by vehicle size.
            </p>
            <SizeStart catalog={S} className="load [--i:3] mt-8 max-w-lg" />
            <p className="load [--i:4] mt-4 text-sm text-ink-2">
              Questions first? <a href={BB.smsHref} className="link num">Text {BB.phone}</a>
            </p>
          </div>
          <div className="load-media [--i:2] relative">
            <BeforeAfter src="/images/aston-db11.jpg" beforeSrc="/images/aston-db11-before.jpg" alt="Light-blue Aston Martin DB11 Volante after a Buffer Bros detail" />
          </div>
        </div>

        {/* spec row */}
        <div className="container">
          <dl className="load [--i:5] grid grid-cols-2 md:grid-cols-4 mb-4 sm:mb-6">
            {[
              [`${S.currency}${from}`, 'Starting price'],
              ['2–3 hrs', 'On site, start to finish'],
              ['7 days', 'Open every day of the week'],
              ['5.0', 'Rating on Google'],
            ].map(([v, k]) => (
              <div key={k} className="border-t border-[color:var(--line)] py-6 sm:py-8 pr-4 even:border-l even:pl-5 md:even:pl-8 md:border-l md:pl-8 md:first:border-l-0 md:first:pl-0">
                <dt className="text-3xl sm:text-4xl font-bold wide text-ink num">{v}</dt>
                <dd className="mt-1 text-sm text-ink-2">{k}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="section section-sand scroll-mt-16">
        <div className="container">
          <div className="max-w-2xl mb-10">
            <h2 className="h2">Pricing</h2>
            <p className="lede mt-3">One complete detail for every car. The price only changes with the size of the vehicle.</p>
          </div>
          <Reveal><PricingTimes catalog={S} /></Reveal>
          <p className="mt-10 text-ink-2">
            Want it kept this clean? <Link href="/packages#plans" className="link">Maintenance plans</Link> cost less per visit, and the first detail is {disc}% off.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS: a real sequence, so it is numbered */}
      <section className="section section-light">
        <div className="container">
          <h2 className="h2">How it works</h2>
          <ol className="mt-10 grid gap-8 md:grid-cols-3 md:gap-10">
            {STEPS.map(([t, b], i) => (
              <Reveal as="li" key={t} className="step" i={i}>
                <span className="text-sm font-semibold text-brand num">Step {i + 1}</span>
                <h3 className="mt-2 text-xl">{t}</h3>
                <p className="mt-2 text-ink-2">{b}</p>
              </Reveal>
            ))}
          </ol>
          <Reveal className="mt-12 max-w-2xl" i={3}><SizeStart catalog={S} label="Start with your vehicle" /></Reveal>
        </div>
      </section>

      {/* OUR WORK */}
      <section className="section section-sand">
        <div className="container">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <h2 className="h2">Our work</h2>
            <a href={BB.instagram} target="_blank" rel="noopener noreferrer" className="link">More on Instagram</a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:auto-rows-[13.5rem]">
            <Reveal className="zoom col-span-2 md:row-span-2 relative overflow-hidden rounded-[20px] bg-ink aspect-video md:aspect-auto">
              <InViewVideo src="/videos/broll-web.mp4" poster="/images/posters/broll.jpg" label="Detailing a white Toyota 4Runner in a Marco Island driveway" className="absolute inset-0 h-full w-full object-cover" />
            </Reveal>
            <Reveal i={1} className="zoom md:row-span-2 relative overflow-hidden rounded-[20px] bg-ink aspect-[9/16] md:aspect-auto">
              <InViewVideo src="/videos/reel-range-rover.mp4" poster="/images/posters/reel-range-rover.jpg" label="Range Rover HSE interior and wheel detail" className="absolute inset-0 h-full w-full object-cover" />
            </Reveal>
            <Reveal i={2} className="zoom md:row-span-2 relative overflow-hidden rounded-[20px] bg-ink aspect-[9/16] md:aspect-auto">
              <InViewVideo src="/videos/reel-toyotas.mp4" poster="/images/posters/reel-toyotas.jpg" label="Detailing two Toyotas" className="absolute inset-0 h-full w-full object-cover" />
            </Reveal>
            {PHOTOS.map((p, i) => (
              <Reveal key={p.src} i={i + 3} className="zoom relative overflow-hidden rounded-[20px] bg-ink aspect-square md:aspect-auto">
                <img src={p.src} alt={p.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="section section-light">
        <div className="container">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <h2 className="h2">Reviews</h2>
              <p className="mt-3 inline-flex items-center gap-2 text-ink-2"><Stars size={18} /> 5.0 on Google</p>
            </div>
            <a href={BB.reviews} target="_blank" rel="noopener noreferrer" className="btn btn-outline">Read all reviews on Google</a>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {REVIEWS.map((r, i) => (
              <Reveal as="figure" key={r.name} i={i} className="rounded-[20px] bg-[color:var(--surface-2)] p-7 flex flex-col">
                <Stars />
                <blockquote className="mt-4 text-ink leading-relaxed grow">“{r.quote}”</blockquote>
                <figcaption className="mt-6 text-sm font-semibold text-ink">{r.name}</figcaption>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICE AREA */}
      <section className="section section-sand">
        <div className="container grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
          <div>
            <h2 className="h2">Where we work</h2>
            <p className="lede mt-4 max-w-lg">We come to you anywhere in Marco Island and Naples. Not sure you are in range? Text us your address.</p>
            <Reveal as="ul" className="mt-7 flex flex-wrap gap-2">
              {AREAS.map((a) => (
                <li key={a} className="rounded-full bg-white border border-[color:var(--line)] px-4 py-2 text-sm font-medium text-ink">{a}</li>
              ))}
            </Reveal>
          </div>
          <Reveal i={1} className="relative overflow-hidden rounded-[20px] border border-[color:var(--line)] bg-white aspect-[4/3]">
            <iframe
              title="Buffer Bros service area: Marco Island and Naples, Florida"
              src="https://www.google.com/maps?ll=26.04,-81.74&z=10&output=embed"
              className="absolute inset-0 h-full w-full grayscale-[35%]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Reveal>
        </div>
      </section>

      {/* PLANS + BOATS */}
      <section className="section section-light">
        <div className="container grid gap-4 lg:grid-cols-2">
          <Reveal className="rounded-[24px] bg-[color:var(--surface-2)] p-8 sm:p-10 flex flex-col min-h-[18rem]">
            <h2 className="text-3xl">Maintenance plans</h2>
            <p className="mt-4 max-w-md text-ink-2">Weekly, every two weeks or monthly. Each visit costs less than a one-time detail, and your first detail is {disc}% off. Pause any time.</p>
            <div className="mt-auto pt-8">
              <Link href="/packages#plans" className="btn btn-dark">See plans</Link>
            </div>
          </Reveal>
          <Reveal i={1} className="zoom"><Link href="/boats" className="group relative overflow-hidden rounded-[24px] h-full min-h-[18rem] p-8 sm:p-10 flex flex-col justify-end text-white">
            <img src="/images/boat-marina.jpg" alt="" aria-hidden loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
            <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" aria-hidden />
            <span className="relative">
              <span className="inline-flex items-center gap-2 text-sm font-medium text-white/85"><IconAnchor size={16} /> Boat detailing</span>
              <span className="block text-3xl font-bold mt-2">At your dock, lift or trailer</span>
              <span className="mt-4 inline-block font-semibold underline underline-offset-4 decoration-white/40 group-hover:decoration-white">Get a boat quote</span>
            </span>
          </Link></Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="section section-sand">
        <div className="container grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <h2 className="h2">Common questions</h2>
            <p className="lede mt-4">Something else? Text us and Tyler or Gabe will answer.</p>
            <a href={BB.smsHref} className="btn btn-outline mt-7 num">Text {BB.phone}</a>
          </div>
          <Reveal className="faq">
            {FAQ.map(([q, a]) => (
              <details key={q}>
                <summary>{q}<IconPlus size={20} className="chev" /></summary>
                <p className="text-[color:var(--slate-soft)]">{a}</p>
              </details>
            ))}
          </Reveal>
        </div>
      </section>

      {/* BOOK */}
      <Reveal as="section" className="section-photo" style={{ '--photo': 'url(/images/posters/broll.jpg)' }}>
        <Reveal className="container py-16 sm:py-24 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <h2 className="h2">Book your detail online</h2>
            <p className="mt-3">See real open times and pick one in about a minute.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/booking" className="btn btn-light px-8">See open times</Link>
            <a href={BB.phoneHref} className="btn btn-glass num">Call {BB.phone}</a>
          </div>
        </Reveal>
      </Reveal>
    </>
  );
}
