import Link from 'next/link';

export const metadata = {
  title: 'About — Local Mobile Detailers in Marco Island & Naples',
  description: 'Buffer Bros is a local mobile detailing team serving Marco Island and Naples, FL. Meet the two guys behind the work — fully equipped, insured, and hands-on since 2023.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About | Buffer Bros Mobile Detailing',
    description: 'Two locals who love clean cars, serving Marco Island and Naples.',
    url: '/about',
  },
};

const COMMITMENTS = [
  { icon: 'fa-circle-check', title: 'We stand behind the work', body: 'If you are not happy with something, let us know and we will fix it.' },
  { icon: 'fa-magnifying-glass', title: 'Pre and post inspection', body: 'We document the car before and after every detail so nothing is a surprise.' },
  { icon: 'fa-shield-halved', title: 'Insured and local', body: 'A real local business you can call, not a faceless franchise.' },
];

export default function AboutPage() {
  return (
    <>
      <section className="section section-light pb-12">
        <div className="container max-w-3xl text-center">
          <span className="eyebrow">About us</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold mt-3 mb-5">Two locals who love clean cars</h1>
          <p className="text-lg" style={{ color: 'var(--slate-soft)' }}>
            Buffer Bros is a mobile detailing team serving Marco Island and Naples. We bring the shop to your
            driveway and treat every car like it is our own.
          </p>
        </div>
      </section>

      <section className="section section-tint">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center mb-20">
            <div className="reveal">
              <span className="eyebrow">Since 2023</span>
              <h2 className="text-3xl font-bold mt-3 mb-5">Our story</h2>
              <p className="mb-4" style={{ color: 'var(--slate)' }}>
                Buffer Bros started in 2023 with two friends, a few buckets, and a habit of never leaving a car half
                done. Word got around fast, and a weekend side project turned into a full mobile detailing setup.
              </p>
              <p className="mb-4" style={{ color: 'var(--slate)' }}>
                Today we run a fully equipped mobile rig that carries its own water and power, so we can detail your
                car anywhere in the Marco and Naples area without plugging into anything of yours.
              </p>
              <p style={{ color: 'var(--slate)' }}>
                We still answer the phone ourselves, and the same two people who book your appointment are the ones
                who show up to do the work.
              </p>
            </div>
            <img src="/images/about-team.jpg" alt="Tyler and Gabe, the Buffer Bros mobile detailing team"
                 className="w-full h-80 lg:h-96 object-cover rounded-3xl reveal" loading="lazy"
                 style={{ boxShadow: 'var(--shadow-lg)' }} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">
            <img src="/images/about-action.jpg" alt="Buffer Bros detailing a Porsche 911 on site"
                 className="w-full h-80 lg:h-96 object-cover rounded-3xl order-2 md:order-1 reveal" loading="lazy"
                 style={{ boxShadow: 'var(--shadow-lg)' }} />
            <div className="order-1 md:order-2 reveal">
              <span className="eyebrow">The craft</span>
              <h2 className="text-3xl font-bold mt-3 mb-5">How we work</h2>
              <p className="mb-4" style={{ color: 'var(--slate)' }}>
                Good detailing is not about rushing through a checklist. It is about doing the small things well:
                the door jambs, the seams, the spots most people skip.
              </p>
              <p className="mb-4" style={{ color: 'var(--slate)' }}>
                We walk the car with you before we start and again when we finish, so you know exactly what was done
                and your car goes back to you in better shape than we found it.
              </p>
              <p style={{ color: 'var(--slate)' }}>
                If something is not right, tell us and we will make it right. That is the whole point of hiring a
                local team.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-light">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12 reveal">
            <span className="eyebrow">What you can count on</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-3">Our commitments</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {COMMITMENTS.map((c) => (
              <div key={c.title} className="card card-hover p-7 text-center reveal">
                <div className="h-14 w-14 mx-auto rounded-2xl bg-brand/10 text-brand grid place-items-center text-2xl mb-4"><i className={`fas ${c.icon}`} aria-hidden /></div>
                <h3 className="text-lg font-semibold mb-2">{c.title}</h3>
                <p className="text-sm" style={{ color: 'var(--slate-soft)' }}>{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="container text-center max-w-2xl mx-auto reveal">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Let us take care of your car</h2>
          <p className="text-gray-300 mb-9">Book online in about a minute and pick a time that works for you.</p>
          <Link href="/booking" className="btn btn-primary sm:px-8">Book an Appointment</Link>
        </div>
      </section>
    </>
  );
}
