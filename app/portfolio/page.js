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

export default function PortfolioPage() {
  return (
    <>
      <section className="section bg-white">
        <div className="container max-w-3xl text-center">
          <span className="eyebrow">Our work</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold mt-3 mb-5">See the cars we detail</h1>
          <p className="text-lg mb-12" style={{ color: 'var(--slate-soft)' }}>
            We post our latest details on Instagram, from daily drivers to weekend favorites.
            That is where you will find our freshest work.
          </p>

          <div className="card section-dark p-8 sm:p-12 max-w-xl mx-auto reveal border-0">
            <div className="h-16 w-16 mx-auto rounded-2xl grid place-items-center text-3xl text-white mb-5"
                 style={{ background: 'linear-gradient(135deg,#feda75,#d62976 45%,#962fbf 75%,#4f5bd5)' }}>
              <i className="fab fa-instagram" aria-hidden />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">@bufferbros.fl</h2>
            <p className="text-gray-300 mb-7">
              Before and afters, full details, and everything in between. Give us a follow and see what we have been
              working on.
            </p>
            <a href={BB.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-block sm:w-auto sm:inline-flex">
              <i className="fab fa-instagram" aria-hidden /> View on Instagram
            </a>
          </div>

          <p className="mt-10 text-sm" style={{ color: 'var(--slate-soft)' }}>
            Like what you see? <Link href="/booking" className="text-brand font-semibold hover:underline">Book your detail</Link> and your car could be next.
          </p>
        </div>
      </section>
    </>
  );
}
