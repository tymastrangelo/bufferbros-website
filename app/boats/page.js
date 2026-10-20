import { getCatalog } from '@/lib/catalog';
import BoatInquiry from '@/components/BoatInquiry';
import Reveal from '@/components/Reveal';
import { BB } from '@/lib/site';
import { IconAnchor, IconCamera, IconCheck } from '@/components/Icons';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Boat Detailing in Marco Island & Naples | At Your Dock or Lift',
  description: 'Mobile boat detailing in Marco Island and Naples, FL. Wash, wax, oxidation removal, interior and ceramic, done at your dock, lift or trailer. Send photos for a personal quote.',
  alternates: { canonical: '/boats' },
  openGraph: { title: 'Boat Detailing | Buffer Bros', description: 'At your dock, lift or trailer. Send photos for a quote.', url: '/boats' },
};

export default async function BoatsPage() {
  const S = await getCatalog();
  return (
    <>
      <section className="relative overflow-hidden bg-ink">
        <img src="/images/boat-marina.jpg" alt="" aria-hidden className="settle absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/20" aria-hidden />
        <div className="container relative py-16 sm:py-24 text-white max-w-3xl mr-auto">
          <p className="load inline-flex items-center gap-2 text-sm font-medium text-white/85"><IconAnchor size={16} /> Boat detailing</p>
          <h1 className="load [--i:1] display text-white mt-3">At your dock, lift or trailer.</h1>
          <p className="load [--i:2] mt-5 text-lg text-white/80 max-w-xl">
            No two boats need the same work, so every one is quoted personally. Send a few photos and we usually get back to you the same day.
          </p>
          <a href="#quote" className="load [--i:3] btn btn-primary mt-8">Get a boat quote</a>
        </div>
      </section>

      <section id="quote" className="section section-sand scroll-mt-20">
        <div className="container grid gap-8 lg:grid-cols-[0.85fr_1.15fr] items-start">
          <div>
            <h2 className="h2">Starting rates, per foot</h2>
            <p className="lede mt-3">A guide, not a menu. Condition, hull size and dock or trailer all factor in.</p>
            <Reveal as="ul" className="mt-8 card divide-y divide-[color:var(--line)]">
              {(S.boat || []).map((b) => (
                <li key={b.id} className="flex items-baseline justify-between gap-4 px-5 py-3.5">
                  <span className="text-ink">{b.name}{b.id === 'maintenance-ft' && '*'}</span>
                  <span className="font-bold text-ink num">{S.currency}{b.perFt}<span className="font-normal text-sm" style={{ color: 'var(--slate-soft)' }}>/ft</span></span>
                </li>
              ))}
            </Reveal>
            <p className="text-sm mt-4" style={{ color: 'var(--slate-soft)' }}>
              *Maintenance wash is an estimate. It depends on the boat and the schedule, and could be more or less.
            </p>
            <ul className="mt-8 space-y-3">
              {['We come to you anywhere in Marco Island and Naples', 'Photos of oxidation or trouble spots get you the most accurate number', 'Pay after the work is done'].map((t) => (
                <li key={t} className="flex gap-3"><IconCheck size={20} weight="bold" className="text-brand shrink-0 mt-0.5" /> {t}</li>
              ))}
            </ul>
          </div>
          <Reveal i={1} className="card p-6 sm:p-8">
            <h2 className="text-2xl">Get your quote</h2>
            <p className="mt-2 mb-6 text-sm flex items-center gap-2" style={{ color: 'var(--slate-soft)' }}>
              <IconCamera size={16} /> Tell us about the boat and add photos. Or text them to <a href={BB.smsHref} className="link num">{BB.phone}</a>.
            </p>
            <BoatInquiry />
          </Reveal>
        </div>
      </section>
    </>
  );
}
