'use client';

/* Booking in three steps: 1 · your car (size, how often, extras) → 2 · a real open
   time → 3 · your details. Arriving from the homepage quote (?size&freq&date&start)
   skips straight to the details. A sticky price bar (phone) / summary card (desktop)
   keeps the total and the Confirm button in reach the whole time. */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { BB } from '@/lib/site';
import { getAttribution, trackBooking } from '@/lib/track';
import { getClaim } from '@/lib/offer';
import Wheel from '@/components/Wheel';
import { IconCalendarBlank, IconCheck, IconCheckCircle, IconInfo, IconPlus } from '@/components/Icons';

const fmtDur = (min) => {
  const h = Math.floor(min / 60), m = min % 60;
  if (h && m) return `${h} hr ${m} min`;
  if (h) return `${h} hr${h > 1 ? 's' : ''}`;
  return `${m} min`;
};
const fmtTime = (min) => {
  let h = Math.floor(min / 60);
  const m = min % 60;
  const ap = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${String(m).padStart(2, '0')} ${ap}`;
};
const isoLocal = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const prettyDate = (iso) => {
  const [y, m, d] = iso.split('-').map(Number);
  return `${WD[new Date(y, m - 1, d, 12).getDay()]}, ${MON[m - 1]} ${d}`;
};
const HEARD = ['Google', 'Instagram', 'Facebook', 'Nextdoor', 'A friend or neighbor', 'Saw the truck', 'Other'];

function Step({ n, title, done, children, id }) {
  return (
    <section id={id} className="card p-5 sm:p-7 scroll-mt-24">
      <div className="flex items-center gap-3 mb-5">
        <span className={`h-8 w-8 shrink-0 rounded-full grid place-items-center text-sm font-bold transition-colors ${done ? 'bg-brand text-white' : 'bg-[color:var(--surface-2)] text-ink'}`}>
          {done ? <IconCheck size={16} weight="bold" /> : n}
        </span>
        <h2 className="text-xl">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export default function BookingClient({ catalog: S }) {
  const params = useSearchParams();
  const cur = S.currency;
  const disc = (S.plan && S.plan.firstVisitDiscountPct) || 10;
  const firstVisitPrice = (p) => Math.round(p * (1 - disc / 100));

  const FREQS = useMemo(
    () => [{ id: 'onetime', name: 'One-time', desc: 'Just this once' }].concat(S.maintenance.map((m) => ({ id: m.id, name: m.name, desc: m.cadence, note: m.note }))),
    [S]
  );

  const [sizeId, setSizeId] = useState(() => (S.sizes.some((s) => s.id === params.get('size')) ? params.get('size') : null));
  const [freq, setFreq] = useState(() => (FREQS.some((f) => f.id === params.get('freq')) ? params.get('freq') : 'onetime'));
  const [addons, setAddons] = useState([]);
  const [showAddons, setShowAddons] = useState(false);
  const [date, setDate] = useState(() => (/^\d{4}-\d{2}-\d{2}$/.test(params.get('date') || '') ? params.get('date') : null));
  const prefillStart = useRef(params.get('start') != null ? Number(params.get('start')) : null);
  const [startMin, setStartMin] = useState(null);
  const [slots, setSlots] = useState(null);
  const [contact, setContact] = useState({ name: '', phone: '', email: '', address: '', notes: '' });
  const [noWater, setNoWater] = useState(false); // we use the client's spigot; water has to be planned ahead
  const [away, setAway] = useState(false); // not home: access and payment get planned ahead
  const [heard, setHeard] = useState(null);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(null);
  const [offer, setOffer] = useState(null); // welcome offer claimed via the email popup
  useEffect(() => {
    const sync = () => setOffer(getClaim());
    sync();
    window.addEventListener('bb:offer-claimed', sync);
    return () => window.removeEventListener('bb:offer-claimed', sync);
  }, []);
  const slotLoad = useRef(0);

  const addonQuote = useCallback((a) => (a.pricing && a.pricing[sizeId]) || a, [sizeId]);
  const isPlan = freq !== 'onetime';
  const size = S.sizes.find((s) => s.id === sizeId);
  const planName = (FREQS.find((f) => f.id === freq) || {}).name;

  const totals = useMemo(() => {
    const detail = sizeId ? S.detail.pricing[sizeId] || {} : {};
    let price = !sizeId ? 0 : isPlan ? firstVisitPrice(detail.price || 0) : detail.price || 0;
    let minutes = detail.minutes || 0;
    for (const id of addons) {
      const a = S.addons.find((x) => x.id === id);
      if (a) {
        const q = addonQuote(a);
        price += q.price || 0;
        minutes += q.minutes || 0;
      }
    }
    const discount = offer ? Math.round((price * offer.pct) / 100) : 0;
    return { price: price - discount, minutes, discount };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [S, sizeId, isPlan, addons, addonQuote, offer]);

  /* open times for the chosen day */
  useEffect(() => {
    setStartMin(null);
    if (!sizeId || !date) return setSlots(null);
    const my = ++slotLoad.current;
    setSlots('loading');
    fetch(`/api/availability?date=${date}&duration=${totals.minutes}`)
      .then((r) => r.json())
      .then((d) => {
        if (my !== slotLoad.current) return;
        if (!d.ok) throw new Error(d.error);
        setSlots(d.slots);
        // honor the time picked on the homepage, if it's still open
        if (prefillStart.current != null && d.slots.some((s) => s.min === prefillStart.current)) setStartMin(prefillStart.current);
        prefillStart.current = null;
      })
      .catch(() => my === slotLoad.current && setSlots('error'));
  }, [sizeId, date, totals.minutes]);

  const dateChips = useMemo(() => {
    const base = new Date();
    base.setHours(12, 0, 0, 0);
    return Array.from({ length: 14 }, (_, i) => {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      return { iso: isoLocal(d), top: i === 0 ? 'Today' : i === 1 ? 'Tmrw' : WD[d.getDay()], day: d.getDate(), mon: MON[d.getMonth()] };
    });
  }, []);

  const scrollTo = (id) => requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  const detailsFilled = ['name', 'phone', 'email', 'address'].every((k) => contact[k].trim());
  const ready = sizeId && date && startMin != null && detailsFilled && agreed;
  const priceText = sizeId ? (totals.price > 0 ? `${cur}${totals.price}` : 'Quoted on site') : 'Pick a size';

  function fail(msg, at) {
    setError(msg);
    if (at) scrollTo(at);
  }

  async function submit(e) {
    e?.preventDefault();
    setError('');
    if (!sizeId) return fail('Choose your vehicle size.', 'step-car');
    if (!date || startMin == null) return fail('Pick a date and time.', 'step-time');
    if (!detailsFilled) return fail('Add your name, phone, email and address.', 'step-you');
    if (!agreed) return fail('Please agree to the terms to confirm.', 'step-you');

    const packageName = S.detail.name + (isPlan ? ` (${planName} plan)` : '');
    const payload = {
      name: contact.name.trim(),
      email: contact.email.trim(),
      phone: contact.phone.trim(),
      address: contact.address.trim(),
      notes: [noWater && 'No water spigot on site: bring water.', away && 'Customer will not be home: plan access and payment ahead.', contact.notes.trim()].filter(Boolean).join('\n'),
      packageId: S.detail.id,
      packageName,
      sizeId: size.id,
      sizeLabel: size.label,
      addons: addons.map((id) => {
        const a = S.addons.find((x) => x.id === id);
        return { id: a.id, name: a.name, price: addonQuote(a).price || 0 };
      }),
      date,
      startMin,
      durationMin: totals.minutes,
      price: totals.price || 0,
      agreedTerms: true,
      attribution: { ...(getAttribution() || {}), heard },
      offerCode: offer && totals.discount > 0 ? offer.code : null,
    };

    setSubmitting(true);
    try {
      const res = await fetch('/api/book', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'Something went wrong');
      trackBooking({ value: totals.price || 0, id: data.id });
      setConfirmed({ when: data.when, packageName });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      fail(err.message || `We could not complete the booking. Please call ${BB.phone}.`);
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmed) {
    return (
      <section className="section section-sand min-h-[70svh]">
        <div className="container max-w-lg">
          <div className="card p-8 sm:p-10 text-center rise">
            <IconCheckCircle size={56} weight="fill" className="mx-auto text-[color:var(--color-ok)]" />
            <h1 className="text-3xl mt-4">You are booked</h1>
            <p className="mt-3 text-ink">
              {confirmed.packageName} for your {size.label.toLowerCase()}, {confirmed.when}.
            </p>
            <p className="mt-4 text-sm" style={{ color: 'var(--slate-soft)' }}>
              A confirmation is on its way to {contact.email}. The time is an arrival window, and you pay after the detail.
              Need to change something? Text {BB.phone}.
            </p>
            <div className="mt-7 flex flex-col sm:flex-row justify-center gap-3">
              <a href={BB.smsHref} className="btn btn-outline">Text us</a>
              <Link href="/" className="btn btn-dark">Back to home</Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="section section-sand pt-10 sm:pt-14">
        <div className="container max-w-6xl">
          <div className="max-w-2xl mb-8">
            <h1 className="text-4xl sm:text-5xl">Book your detail</h1>
            <p className="lede mt-3">Three quick steps. Nothing is charged until the work is done.</p>
          </div>

          <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-[1fr_22rem] gap-6 lg:gap-8 items-start pb-28 lg:pb-0">
            <div className="min-w-0 space-y-5">
              {/* 1 · CAR */}
              <Step n="1" id="step-car" title="Your car" done={!!sizeId}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5" role="radiogroup" aria-label="Vehicle size">
                  {S.sizes.map((s) => {
                    const p = (S.detail.pricing[s.id] || {}).price;
                    return (
                      <label key={s.id} className={`choice ${s.id === sizeId ? 'is-selected' : ''}`}>
                        <input type="radio" name="size" checked={s.id === sizeId} onChange={() => { setSizeId(s.id); if (!date) scrollTo('step-time'); }} />
                        <span className="flex items-baseline justify-between gap-2">
                          <span className="font-semibold text-ink text-[0.95rem]">{s.label}</span>
                          <span className="font-bold text-ink num">{cur}{isPlan ? firstVisitPrice(p) : p}</span>
                        </span>
                        <span className="block text-xs mt-1" style={{ color: 'var(--slate-soft)' }}>{s.note}</span>
                      </label>
                    );
                  })}
                </div>

                <p className="label mt-6">How often</p>
                <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="How often">
                  {FREQS.map((f) => (
                    <label key={f.id} className={`choice py-2.5 px-4 ${f.id === freq ? 'is-selected' : ''}`}>
                      <input type="radio" name="freq" checked={f.id === freq} onChange={() => setFreq(f.id)} />
                      <span className="text-sm font-semibold text-ink">{f.name}</span>
                      {f.note && <span className="ml-1.5 text-xs" style={{ color: 'var(--slate-soft)' }}>{f.note}</span>}
                    </label>
                  ))}
                </div>
                {isPlan && (
                  <p className="mt-3 text-sm flex gap-2 rounded-xl p-3 rise" style={{ background: 'var(--brand-soft)', color: 'var(--brand-dark)' }}>
                    <IconInfo size={18} className="shrink-0 mt-0.5" />
                    Your first visit is a full detail at {disc}% off. Every visit after costs less than a one-time detail, and we set the exact rate with you that day.
                  </p>
                )}

                <div className="mt-6">
                  {!showAddons && addons.length === 0 ? (
                    <button type="button" className="link inline-flex items-center gap-1.5 text-sm" onClick={() => setShowAddons(true)}>
                      <IconPlus size={16} weight="bold" /> Add extras (pet hair, headlights, clay bar…)
                    </button>
                  ) : (
                    <>
                      <p className="label">Extras <span className="font-normal" style={{ color: 'var(--slate-soft)' }}>(optional)</span></p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 rise">
                        {S.addons.map((a) => {
                          const on = addons.includes(a.id);
                          const p = addonQuote(a).price;
                          return (
                            <label key={a.id} className={`choice ${on ? 'is-selected' : ''}`}>
                              <input type="checkbox" checked={on} onChange={() => setAddons(on ? addons.filter((x) => x !== a.id) : [...addons, a.id])} />
                              <span className="flex items-baseline justify-between gap-2">
                                <span className="font-semibold text-ink text-sm">{a.name}</span>
                                <span className="text-sm font-bold text-ink num shrink-0">{p > 0 ? `+${cur}${p}` : ''}</span>
                              </span>
                              {a.note && <span className="block text-xs mt-0.5" style={{ color: 'var(--slate-soft)' }}>{a.note}</span>}
                            </label>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              </Step>

              {/* 2 · TIME */}
              <Step n="2" id="step-time" title="Pick a time" done={startMin != null}>
                {!sizeId ? (
                  <p className="text-sm" style={{ color: 'var(--slate-soft)' }}>Choose your car above and open times show up here.</p>
                ) : (
                  <>
                    <div className="flex gap-2 overflow-x-auto no-scrollbar snap-x -mx-1 px-1 pb-1">
                      {dateChips.map((c) => (
                        <button key={c.iso} type="button" onClick={() => setDate(c.iso)}
                                className={`slot snap-start shrink-0 w-[4.25rem] flex flex-col items-center gap-0.5 py-2 ${date === c.iso ? 'is-selected' : ''}`}>
                          <span className="text-[0.7rem] font-medium opacity-80">{c.top}</span>
                          <span className="text-lg leading-none">{c.day}</span>
                          <span className="text-[0.7rem] font-medium opacity-70">{c.mon}</span>
                        </button>
                      ))}
                    </div>
                    <label className="relative mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand cursor-pointer">
                      <IconCalendarBlank size={16} />
                      {date && !dateChips.some((c) => c.iso === date) ? prettyDate(date) : 'Pick a later date'}
                      <input type="date" min={isoLocal(new Date())} aria-label="Pick a later date" className="absolute inset-0 opacity-0 cursor-pointer"
                             onChange={(e) => e.target.value && setDate(e.target.value)} />
                    </label>

                    <div className="mt-5 min-h-[3rem]" aria-live="polite">
                      {!date && <p className="text-sm" style={{ color: 'var(--slate-soft)' }}>Choose a day to see open times. This visit takes about {fmtDur(totals.minutes)}.</p>}
                      {slots === 'loading' && <p className="flex items-center gap-2.5 text-sm" style={{ color: 'var(--slate-soft)' }}><Wheel size={22} /> Checking the schedule…</p>}
                      {slots === 'error' && (
                        <p className="text-sm text-red-700">Open times would not load. Text <a href={BB.smsHref} className="font-semibold underline">{BB.phone}</a> and we will book you.</p>
                      )}
                      {Array.isArray(slots) && slots.length === 0 && (
                        <p className="text-sm" style={{ color: 'var(--slate-soft)' }}>That day is full. Try the next one, or text <a href={BB.smsHref} className="link">{BB.phone}</a>.</p>
                      )}
                      {Array.isArray(slots) && slots.length > 0 && (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 rise">
                          {slots.map((s) => (
                            <button key={s.min} type="button" onClick={() => { setStartMin(s.min); scrollTo('step-you'); }}
                                    className={`slot ${startMin === s.min ? 'is-selected' : ''}`}>
                              {s.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </Step>

              {/* 3 · YOU */}
              <Step n="3" id="step-you" title="Your details" done={detailsFilled && agreed}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label" htmlFor="f-name">Full name</label>
                    <input id="f-name" className="field" autoComplete="name" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="label" htmlFor="f-phone">Mobile number</label>
                    <input id="f-phone" type="tel" inputMode="tel" className="field" autoComplete="tel" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label" htmlFor="f-email">Email <span className="font-normal" style={{ color: 'var(--slate-soft)' }}>for your confirmation</span></label>
                    <input id="f-email" type="email" inputMode="email" className="field" autoComplete="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label" htmlFor="f-address">Where is the car?</label>
                    <input id="f-address" className="field" autoComplete="street-address" placeholder="Street address, city" value={contact.address} onChange={(e) => setContact({ ...contact, address: e.target.value })} />
                    <label className="mt-3 flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" checked={noWater} onChange={(e) => setNoWater(e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-[color:var(--brand)]" />
                      <span className="text-sm" style={{ color: 'var(--slate)' }}>
                        No outdoor water spigot we can use here. We will bring water. <span style={{ color: 'var(--slate-soft)' }}>We use your spigot and an outlet when you have them, and can bring our own power.</span>
                      </span>
                    </label>
                    <label className="mt-3 flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" checked={away} onChange={(e) => setAway(e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-[color:var(--brand)]" />
                      <span className="text-sm" style={{ color: 'var(--slate)' }}>
                        I will not be home. <span style={{ color: 'var(--slate-soft)' }}>No problem. We will text you to plan access and payment ahead of time.</span>
                      </span>
                    </label>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label" htmlFor="f-notes">Anything we should know? <span className="font-normal" style={{ color: 'var(--slate-soft)' }}>(optional)</span></label>
                    <textarea id="f-notes" className="field" rows={2} placeholder="Make and model, gate code, where to park" value={contact.notes} onChange={(e) => setContact({ ...contact, notes: e.target.value })} />
                  </div>
                </div>

                <p className="label mt-6">How did you hear about us? <span className="font-normal" style={{ color: 'var(--slate-soft)' }}>(optional)</span></p>
                <div className="flex flex-wrap gap-2">
                  {HEARD.map((h) => (
                    <button key={h} type="button" onClick={() => setHeard(heard === h ? null : h)} aria-pressed={heard === h}
                            className={`choice py-2 px-3.5 text-sm font-medium text-ink ${heard === h ? 'is-selected' : ''}`}>
                      {h}
                    </button>
                  ))}
                </div>

                <label className="mt-6 flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-[color:var(--brand)]" />
                  <span className="text-sm" style={{ color: 'var(--slate)' }}>
                    I agree to the <Link href="/terms" target="_blank" className="link">terms</Link>. We inspect the car before and after, we are not liable for damage that was already there, and the price can change if the car needs more than the detail covers.
                  </span>
                </label>
              </Step>

              {error && <p role="alert" className="text-sm font-medium text-red-700 rise">{error}</p>}
            </div>

            {/* SUMMARY (desktop) */}
            <aside className="hidden lg:block lg:sticky lg:top-24">
              <div className="card p-6">
                <h3 className="text-lg">Your appointment</h3>
                <dl className="mt-4 space-y-2.5 text-sm">
                  {[
                    ['Detail', S.detail.name],
                    ['Vehicle', size ? size.label : 'Not picked yet'],
                    ['How often', planName],
                    ...(addons.length ? [['Extras', addons.map((id) => (S.addons.find((a) => a.id === id) || {}).name).join(', ')]] : []),
                    ...(totals.minutes ? [['Takes about', fmtDur(totals.minutes)]] : []),
                    ...(totals.discount ? [[`Welcome offer (${offer.pct}% off)`, `-${cur}${totals.discount}`]] : []),
                    ['When', date && startMin != null ? `${prettyDate(date)} at ${fmtTime(startMin)}` : date ? prettyDate(date) : 'Not picked yet'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-4">
                      <dt style={{ color: 'var(--slate-soft)' }}>{k}</dt>
                      <dd className="font-semibold text-ink text-right">{v}</dd>
                    </div>
                  ))}
                </dl>
                <div className="border-t border-line mt-5 pt-4 flex items-baseline justify-between">
                  <span className="font-semibold text-ink">{isPlan ? 'First visit' : 'Total'}</span>
                  <span className="text-3xl font-bold text-ink num">{priceText}</span>
                </div>
                <p className="text-xs mt-1" style={{ color: 'var(--slate-soft)' }}>Pay after the detail. Confirmed on site.</p>
                <button type="submit" disabled={submitting} className={`btn btn-block mt-5 ${ready ? 'btn-primary' : 'btn-dark'}`}>
                  {submitting ? <><Wheel size={18} /> Booking…</> : 'Confirm booking'}
                </button>
              </div>
            </aside>
          </form>
        </div>
      </section>

      {/* PRICE BAR (phone) */}
      <div className="lg:hidden action-bar flex items-center justify-between gap-3">
        <div className="leading-tight min-w-0">
          <p className="text-xs truncate" style={{ color: 'var(--slate-soft)' }}>
            {date && startMin != null ? `${prettyDate(date)} at ${fmtTime(startMin)}` : isPlan ? 'First visit' : 'Total'}
          </p>
          <p className="text-xl font-bold text-ink num truncate">{priceText}</p>
        </div>
        <button type="button" disabled={submitting} onClick={submit} className={`btn shrink-0 px-6 ${ready ? 'btn-primary' : 'btn-dark'}`}>
          {submitting ? <><Wheel size={18} /> Booking…</> : 'Confirm'}
        </button>
      </div>
    </>
  );
}
