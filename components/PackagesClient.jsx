'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BB } from '@/lib/site';

const fmtDur = (min) => {
  const h = Math.floor(min / 60), m = min % 60;
  if (h && m) return `${h} hr ${m} min`;
  if (h) return `${h} hr${h > 1 ? 's' : ''}`;
  return `${m} min`;
};

export default function PackagesClient({ catalog: S }) {
  const [tab, setTab] = useState('auto'); // 'auto' | 'boat'
  const [size, setSize] = useState(S.sizes[0].id);

  const cur = S.currency;
  const tier = S.detail.pricing[size] || {};
  const disc = (S.plan && S.plan.firstVisitDiscountPct) || 10;
  const fmtPrice = (n) => (n && n > 0 ? `${cur}${n}` : 'TBD');
  const addonPrice = (a) => (a.pricing && a.pricing[size] ? a.pricing[size].price : a.price);
  const half = Math.ceil(S.detail.includes.length / 2);

  const IncludeList = ({ items }) => (
    <ul className="space-y-2.5 text-sm" style={{ color: 'var(--slate)' }}>
      {items.map((i) => (
        <li key={i} className="flex gap-2.5">
          <i className="fas fa-check text-brand mt-1 text-xs" aria-hidden />
          <span>{i}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      {/* HEADER + TABS */}
      <section className="section section-light pb-8 sm:pb-10">
        <div className="container max-w-3xl text-center">
          <span className="eyebrow">The detail</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold mt-3 mb-4 sm:mb-5">One detail. Done right.</h1>
          <p className="text-base sm:text-lg" style={{ color: 'var(--slate-soft)' }}>
            No bronze, silver, or gold packages here. Every car gets the same complete detail,
            and the price just depends on your vehicle size.
          </p>

          {/* vehicle-type tabs */}
          <div className="inline-flex mt-9 p-1.5 rounded-full border" style={{ background: 'var(--surface-2)', borderColor: 'var(--line)' }} role="tablist" aria-label="Vehicle type">
            <button
              type="button" role="tab" aria-selected={tab === 'auto'}
              onClick={() => setTab('auto')}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${tab === 'auto' ? 'bg-ink text-white shadow-md' : 'text-ink hover:bg-white'}`}
            >
              Cars &amp; Trucks
            </button>
            <button
              type="button" role="tab" aria-selected={tab === 'boat'}
              onClick={() => setTab('boat')}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all inline-flex items-center gap-2 ${tab === 'boat' ? 'bg-ink text-white shadow-md' : 'text-ink hover:bg-white'}`}
            >
              Boats
              <span className="text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded" style={{ background: 'var(--brand)', color: '#fff' }}>New</span>
            </button>
          </div>
        </div>
      </section>

      {tab === 'boat' ? (
        /* ============ BOATS ============ */
        <section className="section section-tint">
          <div className="container max-w-3xl">
            <div className="card overflow-hidden">
              <div className="section-dark p-8 sm:p-10 text-center">
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white bg-white/10 border border-white/20 px-3 py-1.5 rounded-full mb-4">
                  <i className="fas fa-anchor" aria-hidden /> Now taking inquiries
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Boat detailing</h2>
                <p className="text-gray-300 max-w-xl mx-auto">
                  Boat detailing is brand new for us, so we&apos;re quoting each boat individually.
                  No set rates yet, just the same care we give every car.
                </p>
              </div>
              <div className="p-8 sm:p-10">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center mb-9">
                  <div>
                    <div className="h-11 w-11 mx-auto rounded-xl bg-brand/10 text-brand grid place-items-center text-lg mb-3"><i className="fas fa-comments" aria-hidden /></div>
                    <p className="text-sm font-semibold text-ink mb-1">Tell us about your boat</p>
                    <p className="text-xs" style={{ color: 'var(--slate-soft)' }}>Size, condition, and what you want done.</p>
                  </div>
                  <div>
                    <div className="h-11 w-11 mx-auto rounded-xl bg-brand/10 text-brand grid place-items-center text-lg mb-3"><i className="fas fa-file-invoice-dollar" aria-hidden /></div>
                    <p className="text-sm font-semibold text-ink mb-1">Get a personal quote</p>
                    <p className="text-xs" style={{ color: 'var(--slate-soft)' }}>We&apos;ll price it fairly for the work it needs.</p>
                  </div>
                  <div>
                    <div className="h-11 w-11 mx-auto rounded-xl bg-brand/10 text-brand grid place-items-center text-lg mb-3"><i className="fas fa-water" aria-hidden /></div>
                    <p className="text-sm font-semibold text-ink mb-1">We come to your dock</p>
                    <p className="text-xs" style={{ color: 'var(--slate-soft)' }}>At your dock, lift, or trailer in Marco &amp; Naples.</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  <a href={BB.smsHref} className="btn btn-primary"><i className="fas fa-message" aria-hidden /> Text us about your boat</a>
                  <a href={BB.phoneHref} className="btn btn-outline"><i className="fas fa-phone-alt" aria-hidden /> Call {BB.phone}</a>
                </div>
                <p className="text-center text-xs mt-5" style={{ color: 'var(--slate-soft)' }}>
                  We&apos;re still working out our boat rates, so the first boats get a great deal.
                </p>
              </div>
            </div>
          </div>
        </section>
      ) : (
        /* ============ CARS & TRUCKS ============ */
        <>
          {/* size selector */}
          <section className="bg-white pb-10 sm:pb-14">
            <div className="container max-w-3xl">
              <p className="label text-center mb-3">Choose your vehicle size to see pricing</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" role="radiogroup" aria-label="Vehicle size">
                {S.sizes.map((s) => (
                  <button
                    key={s.id} type="button" role="radio" aria-checked={s.id === size}
                    onClick={() => setSize(s.id)}
                    className={`choice text-left ${s.id === size ? 'is-selected' : ''}`}
                  >
                    <span className="block font-semibold text-ink">{s.label}</span>
                    <span className="block text-xs mt-0.5" style={{ color: 'var(--slate-soft)' }}>{s.note}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* THE STANDARD DETAIL */}
          <section className="section section-tint">
            <div className="container max-w-4xl">
              <div className="card overflow-hidden" style={{ borderColor: 'var(--brand)', boxShadow: 'var(--shadow-md)' }}>
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="p-7 sm:p-9 md:border-r border-gray-100">
                    <span className="inline-block text-[11px] font-bold tracking-wide text-brand bg-brand/10 px-3 py-1 rounded-full mb-3">EVERYTHING INCLUDED</span>
                    <h2 className="text-2xl font-extrabold">{S.detail.name}</h2>
                    <p className="text-sm mt-2 mb-5" style={{ color: 'var(--slate-soft)' }}>{S.detail.tagline}</p>
                    <div className="flex items-end gap-2 mb-1">
                      <span className="text-4xl font-extrabold text-ink" style={{ fontFamily: 'var(--font-display)' }}>{fmtPrice(tier.price)}</span>
                      <span className="text-sm mb-1" style={{ color: 'var(--slate-soft)' }}>one-time</span>
                    </div>
                    <p className="text-xs mb-6" style={{ color: 'var(--slate-soft)' }}>
                      <i className="far fa-clock mr-1" aria-hidden />About {fmtDur(tier.minutes || 0)} for your selected size
                    </p>
                    <Link href={`/booking?size=${size}&freq=onetime`} className="btn btn-primary btn-block">Book this detail</Link>
                    <p className="text-xs text-center mt-3" style={{ color: 'var(--slate-soft)' }}>
                      Want it kept this way? <a href="#maintenance" className="text-brand font-semibold">See maintenance plans</a>
                    </p>
                  </div>
                  <div className="p-7 sm:p-9">
                    <p className="font-semibold text-ink mb-4">What&apos;s included, inside and out</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-0">
                      <IncludeList items={S.detail.includes.slice(0, half)} />
                      <IncludeList items={S.detail.includes.slice(half)} />
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-center text-sm mt-6" style={{ color: 'var(--slate-soft)' }}>
                Prices assume a vehicle in average condition. Heavily soiled vehicles may be quoted higher. See our{' '}
                <Link href="/terms" className="text-brand font-semibold hover:underline">terms</Link>.
              </p>
            </div>
          </section>

          {/* MAINTENANCE — plans without prices; rates are set in person */}
          <section id="maintenance" className="section section-light scroll-mt-24">
            <div className="container max-w-5xl">
              <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
                <span className="eyebrow">Keep it that way</span>
                <h2 className="text-3xl sm:text-4xl font-bold mt-3">Maintenance plans</h2>
                <p className="mt-4" style={{ color: 'var(--slate-soft)' }}>
                  The exact same Standard Detail on a schedule, at a lower per-visit rate than booking one-off.
                  Cancel or change anytime.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
                {S.maintenance.map((m) => (
                  <div key={m.id} className="card card-hover relative p-6 sm:p-7 text-center flex flex-col"
                       style={m.popular ? { borderColor: 'var(--brand)', boxShadow: 'var(--shadow-md)' } : undefined}>
                    {m.popular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                        Most popular
                      </span>
                    )}
                    <h3 className="text-xl font-bold">{m.name}</h3>
                    <p className="text-sm mb-5" style={{ color: 'var(--slate-soft)' }}>{m.cadence}{m.note ? ` · ${m.note}` : ''}</p>
                    <Link href={`/booking?size=${size}&freq=${m.id}`} className={`btn ${m.popular ? 'btn-primary' : 'btn-outline'} btn-block mt-auto`}>
                      Start {m.name.toLowerCase()}
                    </Link>
                    <p className="text-xs mt-3 leading-relaxed" style={{ color: 'var(--slate-soft)' }}>
                      Books your first detail at <span className="font-semibold text-ink">{disc}% off</span>,
                      and every visit after costs less
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-center text-sm mt-7 max-w-lg mx-auto" style={{ color: 'var(--slate-soft)' }}>
                We set your exact per-visit rate with you at that first detail. It depends on your car and how
                often we come.
              </p>
            </div>
          </section>

          {/* ADD-ONS */}
          <section className="section section-tint">
            <div className="container">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="eyebrow">Make it yours</span>
                <h2 className="text-3xl sm:text-4xl font-bold mt-3">Add-ons</h2>
                <p className="mt-4" style={{ color: 'var(--slate-soft)' }}>
                  Everything above is already included. These are the extras for when your car needs a little more.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
                {S.addons.map((a) => (
                  <div key={a.id} className="card card-hover p-5 flex items-center justify-between gap-4">
                    <div>
                      <div className="font-semibold text-ink">{a.name}</div>
                      <div className="text-xs mt-0.5" style={{ color: 'var(--slate-soft)' }}>{a.note || ''}</div>
                    </div>
                    <div className="font-bold text-brand shrink-0">
                      {addonPrice(a) > 0 ? `+${cur}${addonPrice(a)}` : 'TBD'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* CTA */}
      <section className="section section-dark">
        <div className="container text-center max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready for that showroom finish?</h2>
          <p className="text-gray-300 mb-9">Book a one-time detail or start a maintenance plan, and pick a time that works for you.</p>
          <Link href="/booking" className="btn btn-primary sm:px-8">Book an Appointment</Link>
        </div>
      </section>
    </>
  );
}
