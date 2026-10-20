'use client';

/* The Detail: one offer, priced by size. Centered pill tabs switch the vehicle; the
   card below never changes size (all three photos are stacked and crossfade), so it
   stays front and center while you compare. Plans never show per-visit prices. */
import { useState } from 'react';
import Link from 'next/link';
import { IconCheck, IconClock } from '@/components/Icons';
import Reveal from '@/components/Reveal';

const DETAIL_IMG = {
  sedan: { src: '/images/aston-db11.jpg', alt: 'Light-blue Aston Martin DB11 after a full detail in a Naples driveway', pos: '72% 55%' },
  midsize: { src: '/images/audi-q8-foam.jpg', alt: 'Audi Q8 midsize SUV in a foam bath during a mobile detail', pos: '22% 60%' },
  // ponytail: representative image (AI-generated); swap for a real truck job photo when we have one.
  large: { src: '/images/truck-large.jpg', alt: 'Black full-size pickup truck on a paver driveway', pos: '88% 62%' },
};
const SHORT = { sedan: 'Car', midsize: 'Midsize SUV', large: 'Large SUV / Truck' };
const ADDON_IMG = {
  'clay-bar': '/images/addon-clay-bar.jpg',
  'pet-hair': '/images/addon-pet-hair.jpg',
  'engine-bay': '/images/addon-engine-bay.jpg',
  headlights: '/images/addon-headlights.jpg',
  odor: '/images/mercedes-s-interior.jpg',
};
const fmtDur = (min) => {
  const h = Math.floor(min / 60), m = min % 60;
  if (h && m) return `${h} hr ${m} min`;
  if (h) return `${h} hr${h > 1 ? 's' : ''}`;
  return `${m} min`;
};
// catalog notes come from the dashboard; keep the site's no-em-dash rule
const tidy = (s) => (s || '').replace(/\s*—\s*/g, '. ').replace(/\.\s*\./g, '.');

export default function PackagesClient({ catalog: S }) {
  const [size, setSize] = useState(S.sizes[0].id);
  const cur = S.currency;
  const tier = S.detail.pricing[size] || {};
  const disc = (S.plan && S.plan.firstVisitDiscountPct) || 10;
  const addonPrice = (a) => (a.pricing && a.pricing[size] ? a.pricing[size].price : a.price);
  const sizeInfo = S.sizes.find((s) => s.id === size);
  const idx = S.sizes.findIndex((s) => s.id === size);

  return (
    <>
      <section className="section section-light pb-10 sm:pb-12">
        <div className="container max-w-3xl text-center">
          <p className="load kicker">The Detail and pricing</p>
          <h1 className="load [--i:1] display mt-3">One detail. Done right.</h1>
          <p className="load [--i:2] lede mt-5 mx-auto max-w-2xl">
            No bronze, silver or gold packages. Every car gets the same complete detail, inside and out. The price depends only on the size of the vehicle.
          </p>
        </div>
      </section>

      <section className="pb-16 sm:pb-24">
        <div className="container">
          {/* tabs */}
          <div className="load [--i:3] flex justify-center">
            <div className="relative grid grid-cols-3 gap-1 rounded-full bg-[color:var(--surface-2)] p-1.5 w-full max-w-xl" role="tablist" aria-label="Vehicle size">
              {/* one white pill slides between tabs (1.25rem = side padding + the two gaps) */}
              <span aria-hidden className="absolute inset-y-1.5 left-1.5 rounded-full bg-white shadow-[var(--shadow-sm)] transition-transform duration-500"
                    style={{ width: 'calc((100% - 1.25rem) / 3)', transform: `translateX(calc(${idx} * (100% + 0.25rem)))`, transitionTimingFunction: 'var(--ease-out)' }} />
              {S.sizes.map((s) => {
                const on = s.id === size;
                return (
                  <button key={s.id} type="button" role="tab" aria-selected={on} onClick={() => setSize(s.id)}
                          className={`relative rounded-full px-2 py-2.5 sm:py-3 text-center transition-colors duration-200 ${on ? 'text-ink' : 'text-ink-2 hover:text-ink'}`}>
                    <span className="block text-[0.8rem] sm:text-sm font-semibold leading-tight">{SHORT[s.id] ?? s.label}</span>
                    <span className="block text-xs sm:text-sm num mt-0.5">{cur}{(S.detail.pricing[s.id] || {}).price}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* the card: fixed size, front and center. Photo beside the info (on top on phones). */}
          <div className="load-media [--i:4] mx-auto mt-8 max-w-5xl card overflow-hidden grid md:grid-cols-[1.1fr_1fr]">
            <div className="relative aspect-[16/10] md:aspect-auto bg-ink">
              {S.sizes.map((s) => {
                const img = DETAIL_IMG[s.id] || DETAIL_IMG.sedan;
                return (
                  <img key={s.id} src={img.src} alt={s.id === size ? img.alt : ''} aria-hidden={s.id !== size}
                       style={{ objectPosition: img.pos || 'center' }}
                       className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 ease-out ${s.id === size ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.04]'}`} />
                );
              })}
            </div>
            <div className="flex flex-col p-7 sm:p-9">
              <div key={size} className="swap">
                <p className="text-sm font-semibold text-brand">{sizeInfo?.label}</p>
                <p className="text-sm text-ink-2">{sizeInfo?.note}</p>
              </div>
              <h2 className="text-2xl mt-4">{S.detail.name}</h2>
              <div className="mt-3 flex items-end gap-3">
                <span key={size} className="swap text-5xl font-bold wide text-ink num leading-none">{cur}{tier.price}</span>
                <span key={`t-${size}`} className="swap text-sm pb-1 inline-flex items-center gap-1 text-ink-2"><IconClock size={14} /> about {fmtDur(tier.minutes || 0)}</span>
              </div>
              <ul className="mt-6 space-y-2.5 border-t border-[color:var(--line)] pt-6">
                {S.detail.includes.map((i) => (
                  <li key={i} className="flex gap-3">
                    <IconCheck size={20} weight="bold" className="text-brand shrink-0 mt-0.5" /> <span className="text-ink">{i}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-8">
                <Link href={`/booking?size=${size}&freq=onetime`} className="btn btn-primary btn-block"><span>Book a <span key={size} className="swap inline-block num">{cur}{tier.price}</span> detail</span></Link>
                <p className="text-xs mt-3 text-center text-ink-2">
                  Priced for average condition. Very heavy soiling may cost more, see the <Link href="/terms" className="link">terms</Link>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EXTRAS: equal cards, last row centered */}
      <section className="section section-sand">
        <div className="container max-w-5xl">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="h2">Extras</h2>
            <p className="lede mt-3">Everything above is already included. Add these when you book. Prices shown for: {SHORT[size]}.</p>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {S.addons.map((a, i) => (
              <Reveal key={a.id} i={i} className="zoom card overflow-hidden flex flex-col w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.7rem)]">
                <div className="relative h-44 bg-ink">
                  {ADDON_IMG[a.id] && <img src={ADDON_IMG[a.id]} alt="" aria-hidden loading="lazy" className="absolute inset-0 h-full w-full object-cover" />}
                </div>
                <div className="p-5 flex items-start justify-between gap-3 grow">
                  <div>
                    <p className="font-semibold text-ink">{a.name}</p>
                    <p className="text-sm mt-1 text-ink-2 min-h-[2.6rem] line-clamp-2">{tidy(a.note)}</p>
                  </div>
                  <p className="font-bold text-ink num shrink-0">{addonPrice(a) > 0 ? `+${cur}${addonPrice(a)}` : 'Quoted'}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PLANS: no per-visit prices on the site, ever */}
      <section id="plans" className="section section-light scroll-mt-20">
        <div className="container max-w-5xl">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="h2">Maintenance plans</h2>
            <p className="lede mt-3">
              The same complete detail on a schedule, for less per visit than booking one at a time. Your first detail is {disc}% off, and we set your rate with you that day. Pause or change any time.
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {S.maintenance.map((m, i) => (
              <Reveal as={Link} key={m.id} href={`/booking?size=${size}&freq=${m.id}`} i={i}
                    className={`card card-hover p-7 flex flex-col text-center ${m.popular ? 'ring-2 ring-[color:var(--brand)] border-transparent' : ''}`}>
                <span className="text-xl font-bold text-ink">{m.name}</span>
                <span className="mt-1 text-sm text-ink-2">{m.cadence}</span>
                {m.popular && <span className="mx-auto mt-3 text-xs font-semibold rounded-full px-2.5 py-1 bg-brand text-white">Most popular</span>}
                <span key={size} className="swap mt-auto pt-6 font-semibold text-brand">First visit {cur}{Math.round((tier.price || 0) * (1 - disc / 100))}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
