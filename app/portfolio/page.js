import Link from 'next/link';
import { BB } from '@/lib/site';

export const metadata = {
  title: 'Our Work — Detailing Before & Afters',
  description: 'See the cars Buffer Bros details in Marco Island and Naples, FL. Fresh before-and-after transformations posted on Instagram @bufferbros.fl.',
  alternates: { canonical: '/portfolio' },
  openGraph: {
    title: 'Our Work | Buffer Bros Mobile Detailing',
    description: 'Before and afters, full details, and everything in between.',
    url: '/portfolio',
  },
};

/* blueprint-style annotation label used on every mosaic tile */
function TileLabel({ children, light = false }) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.14em] ${light ? 'text-white' : 'text-brand'}`}
    >
      <span className={`h-[2px] w-4 rounded-full ${light ? 'bg-white/80' : 'bg-brand'}`} aria-hidden />
      {children}
    </span>
  );
}

export default function PortfolioPage() {
  return (
    <section className="section section-light">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <span className="eyebrow justify-center">Our work</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold mt-3 mb-5">Real cars, real driveways</h1>
          <p className="text-lg" style={{ color: 'var(--slate-soft)' }}>
            A look at the details we&apos;ve been doing around Marco Island and Naples —
            and where to catch the freshest ones the day we finish them.
          </p>
          <a
            href={BB.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-5 font-semibold text-brand hover:underline"
          >
            <i className="fab fa-instagram text-lg" aria-hidden /> Instagram
          </a>
        </div>

        {/* job-board mosaic */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:auto-rows-[13rem] max-w-5xl mx-auto">
          {/* lead tile — the finished product */}
          <figure className="reveal group relative overflow-hidden rounded-2xl h-72 md:h-auto md:col-span-2 md:row-span-2" style={{ boxShadow: 'var(--shadow-md)' }}>
            <img
              src="/images/aston-db11.jpg"
              alt="Freshly detailed light-blue Aston Martin DB11 Volante in a Naples driveway"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" aria-hidden />
            <figcaption className="absolute bottom-4 left-5">
              <TileLabel light>Aston Martin DB11 — fresh finish</TileLabel>
            </figcaption>
          </figure>

          {/* tiktok clips — tap through to the full video */}
          <a
            href="https://www.tiktok.com/t/ZThve9kvv/"
            target="_blank"
            rel="noopener noreferrer"
            className="reveal group relative overflow-hidden rounded-2xl h-96 md:h-auto md:row-span-2"
            style={{ boxShadow: 'var(--shadow-md)' }}
            aria-label="Watch this detail on TikTok"
          >
            <video autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]">
              <source src="/videos/detail1.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" aria-hidden />
            <span className="absolute top-4 right-4 h-9 w-9 grid place-items-center rounded-full bg-black/55 text-white text-sm backdrop-blur transition group-hover:bg-black/80" aria-hidden>
              <i className="fab fa-tiktok" />
            </span>
            <span className="absolute bottom-4 left-5">
              <TileLabel light>Range Rover HSE — watch on TikTok</TileLabel>
            </span>
          </a>

          <a
            href="https://www.tiktok.com/t/ZThveSwB4/"
            target="_blank"
            rel="noopener noreferrer"
            className="reveal group relative overflow-hidden rounded-2xl h-96 md:h-auto md:row-span-2"
            style={{ boxShadow: 'var(--shadow-md)' }}
            aria-label="Watch this detail on TikTok"
          >
            <video autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]">
              <source src="/videos/detail2.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" aria-hidden />
            <span className="absolute top-4 right-4 h-9 w-9 grid place-items-center rounded-full bg-black/55 text-white text-sm backdrop-blur transition group-hover:bg-black/80" aria-hidden>
              <i className="fab fa-tiktok" />
            </span>
            <span className="absolute bottom-4 left-5">
              <TileLabel light>Two new Toyotas — watch on TikTok</TileLabel>
            </span>
          </a>

          {/* instagram — the live feed slot, dark like the footer */}
          <a
            href={BB.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="reveal group section-dark relative overflow-hidden rounded-2xl h-56 md:h-auto flex flex-col justify-between p-5 transition-transform duration-300 hover:-translate-y-1"
            style={{ boxShadow: 'var(--shadow-md)' }}
          >
            <div className="flex items-center justify-between">
              <span className="h-11 w-11 rounded-xl grid place-items-center text-xl text-white"
                    style={{ background: 'linear-gradient(135deg,#feda75,#d62976 45%,#962fbf 75%,#4f5bd5)' }}>
                <i className="fab fa-instagram" aria-hidden />
              </span>
              <i className="fas fa-arrow-up-right-from-square text-white/40 text-sm transition group-hover:text-white" aria-hidden />
            </div>
            <div>
              <p className="text-white font-bold text-lg leading-tight">@bufferbros.fl</p>
              <p className="text-gray-400 text-sm mt-1">Fresh before &amp; afters, posted as we finish them.</p>
              <span className="inline-block mt-3 text-sm font-semibold text-white underline-offset-4 group-hover:underline">Follow along</span>
            </div>
          </a>

          <figure className="reveal group relative overflow-hidden rounded-2xl h-56 md:h-auto" style={{ boxShadow: 'var(--shadow-sm)' }}>
            <img
              src="/images/audi-q8-foam.jpg"
              alt="Audi Q8 covered in a thick foam bath during a mobile detail in Marco Island"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              loading="lazy"
            />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" aria-hidden />
            <figcaption className="absolute bottom-4 left-5">
              <TileLabel light>Audi Q8 — foam bath</TileLabel>
            </figcaption>
          </figure>

          {/* b-roll — the work itself, in motion */}
          <div className="reveal relative overflow-hidden rounded-2xl aspect-video md:aspect-auto md:h-auto md:col-span-2" style={{ boxShadow: 'var(--shadow-md)' }}>
            <video autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover" aria-label="Buffer Bros detailing cars on location">
              <source src="/videos/broll.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" aria-hidden />
            <div className="absolute bottom-4 left-5">
              <TileLabel light>On the job — filmed on location</TileLabel>
            </div>
          </div>

          <figure className="reveal group relative overflow-hidden rounded-2xl h-56 md:h-auto" style={{ boxShadow: 'var(--shadow-sm)' }}>
            <img
              src="/images/mercedes-s-interior.jpg"
              alt="Detailed Mercedes-Benz S-Class coupe interior with cream leather"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              loading="lazy"
            />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" aria-hidden />
            <figcaption className="absolute bottom-4 left-5">
              <TileLabel light>Mercedes S-Class — interior detail</TileLabel>
            </figcaption>
          </figure>

          <figure className="reveal group relative overflow-hidden rounded-2xl h-56 md:h-auto md:col-span-2" style={{ boxShadow: 'var(--shadow-sm)' }}>
            <img
              src="/images/aston-db11-interior.jpg"
              alt="Detailed Aston Martin DB11 interior with blue and white leather"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              loading="lazy"
            />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" aria-hidden />
            <figcaption className="absolute bottom-4 left-5">
              <TileLabel light>DB11 — interior detail</TileLabel>
            </figcaption>
          </figure>
        </div>

        <p className="mt-12 text-center text-sm reveal" style={{ color: 'var(--slate-soft)' }}>
          Like what you see? <Link href="/booking" className="text-brand font-semibold hover:underline">Book your detail</Link> and your car could be next.
        </p>
      </div>
    </section>
  );
}
