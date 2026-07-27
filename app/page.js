import Link from 'next/link';
import { BB } from '@/lib/site';

export const metadata = {
  title: 'Buffer Bros | Mobile Car Detailing in Marco Island & Naples, FL',
  description: 'Mobile car detailing in Marco Island and Naples, FL. One complete detail, priced up front. We come to your driveway. Book online in about a minute.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Buffer Bros | Mobile Car Detailing in Marco Island & Naples, FL',
    description: 'Premium mobile detailing brought to your driveway. Book online in about a minute.',
    url: '/',
  },
};

const REVIEWS = [
  {
    quote: 'Tyler and Gabe did a great job detailing my 2003 Jag. Looks new again. They were prompt and professional. I highly recommend Buffer Bros and will use them again.',
    name: 'Scott M.',
  },
  {
    quote: 'I booked quickly and Gabe arrived right on time, was polite, and made my 10 year old vehicle look new again. I was very pleased and will keep them in mind for future refreshers.',
    name: 'Phran G.',
  },
  {
    quote: 'Tyler and Gabe did a fantastic job on my old Jeep. It looked like new when they were done. They are honest and dependable and really pay attention to detail. Highly recommend.',
    name: 'Jim H.',
  },
];

const STEPS = [
  {
    n: '01',
    title: 'Tell us your car',
    body: 'Pick your vehicle size and how often you want it done. The price is right on the page, so you know the cost before you book.',
  },
  {
    n: '02',
    title: 'Choose a time',
    body: 'See the times we actually have open. Each slot fits the work your car needs, so we never run late on you.',
  },
  {
    n: '03',
    title: 'We come to you',
    body: 'We show up with our own water and power and leave your car with a showroom finish, right in your driveway.',
  },
];

const WORK = [
  { src: '/images/aston-db11.jpg', alt: 'Freshly detailed light-blue Aston Martin DB11 Volante in a Naples driveway' },
  { src: '/images/philosophy.jpg', alt: 'Pressure rinsing a white Toyota 4Runner during a mobile detail' },
  { src: '/images/mercedes-s-interior.jpg', alt: 'Detailed Mercedes-Benz S-Class interior with cream leather' },
  { src: '/images/audi-q8-foam.jpg', alt: 'Audi Q8 covered in a thick foam bath' },
  { src: '/images/aston-db11-interior.jpg', alt: 'Detailed Aston Martin DB11 interior with blue and white leather' },
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      {/* -mt-16 pulls the video up behind the floating nav pill; pt-16 keeps the
          content centered in the space below the header. Full 100svh so the next
          section never peeks into the first screen. */}
      <section className="section-dark relative min-h-[100svh] -mt-16 pt-16 flex items-center overflow-hidden">
        <video
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden
        >
          <source src="/videos/broll.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/70 to-black/40" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />

        <div className="container relative z-10 py-28">
          <div className="max-w-2xl text-white" style={{ textShadow: '0 2px 16px rgba(0,0,0,.55)' }}>
            <span className="inline-flex items-center gap-2 text-sm font-semibold bg-white/10 border border-white/20 backdrop-blur px-4 py-1.5 rounded-full mb-7" style={{ textShadow: 'none' }}>
              <i className="fas fa-star text-yellow-400" aria-hidden /> 5-star rated &middot; Marco Island &amp; Naples
            </span>
            <h1 className="text-white text-[2.6rem] leading-[1.04] sm:text-6xl lg:text-7xl font-extrabold mb-6">
              Your car, detailed in your driveway.
            </h1>
            <p className="text-lg sm:text-xl text-gray-200 mb-9 max-w-xl">
              One complete detail, done right every time. We bring our own water and power. You just pick a time.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/booking" className="btn btn-primary text-base sm:px-8">Book an Appointment</Link>
              <Link href="/packages" className="btn btn-ghost">See the Detail &amp; Pricing</Link>
            </div>
            <div className="flex flex-wrap items-center gap-x-7 gap-y-2.5 mt-10 text-sm text-gray-300">
              <span><i className="fas fa-location-dot mr-2 text-brand" aria-hidden />We come to you</span>
              <span><i className="fas fa-shield-halved mr-2 text-brand" aria-hidden />Insured</span>
              <span><i className="fas fa-clock mr-2 text-brand" aria-hidden />Open 7 days</span>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — asymmetric split, no card grid */}
      <section className="section section-light">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20">
            <div className="lg:col-span-2 reveal">
              <div className="lg:sticky lg:top-28">
                <span className="eyebrow">Simple by design</span>
                <h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-bold mt-3 mb-5">
                  Booking takes about a minute
                </h2>
                <p style={{ color: 'var(--slate-soft)' }}>
                  No back and forth, no waiting on a quote. Pick what you want, see real open times, and you are on the calendar.
                </p>
                <Link href="/booking" className="btn btn-dark mt-8">Start Booking</Link>
              </div>
            </div>
            <div className="lg:col-span-3">
              <ol className="space-y-4">
                {STEPS.map((s) => (
                  <li key={s.n} className="reveal flex gap-4 sm:gap-8 items-start rounded-2xl p-4 sm:p-8 transition-colors hover:bg-[color:var(--surface-2)]">
                    <span className="ghost-num" aria-hidden>{s.n}</span>
                    <div className="pt-2">
                      <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
                      <p className="text-[15px] leading-relaxed" style={{ color: 'var(--slate-soft)' }}>{s.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* WHY — image split with checklist */}
      <section className="section section-tint">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="relative reveal order-2 md:order-1">
              <img
                src="/images/about-action.jpg"
                alt="Buffer Bros detailing a Porsche 911 in a driveway in Naples, FL"
                className="w-full h-80 lg:h-[30rem] object-cover rounded-3xl"
                loading="lazy"
                style={{ boxShadow: 'var(--shadow-lg)' }}
              />
              <div className="absolute -bottom-5 left-5 sm:left-8 card px-5 py-4 flex items-center gap-3">
                <span className="text-yellow-400 text-sm" aria-hidden>
                  <i className="fas fa-star" /><i className="fas fa-star" /><i className="fas fa-star" /><i className="fas fa-star" /><i className="fas fa-star" />
                </span>
                <span className="text-sm font-semibold text-ink">5.0 on Google</span>
              </div>
            </div>
            <div className="reveal order-1 md:order-2">
              <span className="eyebrow">Why Buffer Bros</span>
              <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-6">Detailing done right, every time</h2>
              <ul className="space-y-5">
                <li className="flex gap-4">
                  <span className="h-11 w-11 shrink-0 rounded-xl bg-brand/10 text-brand grid place-items-center text-lg"><i className="fas fa-house" aria-hidden /></span>
                  <div>
                    <h3 className="font-semibold text-ink mb-1">Fully mobile, fully equipped</h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--slate-soft)' }}>We work at your home or office with our own water and power. Nothing to drop off, nothing to plug in.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="h-11 w-11 shrink-0 rounded-xl bg-brand/10 text-brand grid place-items-center text-lg"><i className="fas fa-spray-can-sparkles" aria-hidden /></span>
                  <div>
                    <h3 className="font-semibold text-ink mb-1">Pro-grade products</h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--slate-soft)' }}>The same tools and products the best shops use, dialed in for every surface of your car.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="h-11 w-11 shrink-0 rounded-xl bg-brand/10 text-brand grid place-items-center text-lg"><i className="fas fa-handshake" aria-hidden /></span>
                  <div>
                    <h3 className="font-semibold text-ink mb-1">Honest and local</h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--slate-soft)' }}>Two local guys who answer their own phone, treat your car like their own, and stand behind the work.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* RECENT WORK — scrolling strip of real jobs */}
      <section className="section section-dark overflow-hidden">
        <div className="container flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 reveal">
          <div>
            <span className="eyebrow">Recent work</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3">Cars we&apos;ve detailed around town</h2>
          </div>
          <Link href="/portfolio" className="text-sm font-semibold text-brand hover:underline shrink-0">
            See all our work <i className="fas fa-arrow-right ml-1 text-xs" aria-hidden />
          </Link>
        </div>
        <div className="marquee reveal">
          <div className="marquee-track">
            {[...WORK, ...WORK].map((w, i) => (
              <img
                key={i}
                src={w.src}
                alt={i < WORK.length ? w.alt : ''}
                aria-hidden={i >= WORK.length}
                className="h-52 sm:h-72 w-auto rounded-2xl object-cover"
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="section section-light">
        <div className="container">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 max-w-5xl mx-auto mb-12 reveal">
            <div>
              <span className="eyebrow">Reviews</span>
              <h2 className="text-3xl sm:text-4xl font-bold mt-3">What our customers say</h2>
            </div>
            <a href={BB.reviews} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-brand hover:underline shrink-0">
              Read more on Google <i className="fas fa-arrow-right ml-1 text-xs" aria-hidden />
            </a>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {REVIEWS.map((r) => (
              <figure key={r.name} className="card card-hover p-7 reveal flex flex-col">
                <div className="text-yellow-400 mb-4 text-sm" aria-label="5 out of 5 stars">
                  <i className="fas fa-star" /><i className="fas fa-star" /><i className="fas fa-star" /><i className="fas fa-star" /><i className="fas fa-star" />
                </div>
                <blockquote className="mb-5 leading-relaxed grow" style={{ color: 'var(--slate)' }}>
                  &ldquo;{r.quote}&rdquo;
                </blockquote>
                <figcaption className="font-semibold text-ink flex items-center gap-2">
                  {r.name}
                  <span className="text-xs font-medium rounded-full px-2 py-0.5" style={{ background: 'var(--brand-soft)', color: 'var(--brand-dark)' }}>Google review</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="section section-dark">
        <div className="container text-center max-w-2xl mx-auto reveal">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to get your car detailed?</h2>
          <p className="text-gray-300 mb-9">
            Grab the next open time and we handle the rest, anywhere in Marco Island and Naples.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link href="/booking" className="btn btn-primary sm:px-8">Book Now</Link>
            <a href={BB.smsHref} className="btn btn-ghost">Text us a question</a>
          </div>
          <p className="text-sm text-gray-400 mt-8">
            Prefer to talk? Call or text <a href={BB.phoneHref} className="text-white font-semibold hover:underline">{BB.phone}</a>, {BB.hours.toLowerCase()}.
          </p>
        </div>
      </section>
    </>
  );
}
