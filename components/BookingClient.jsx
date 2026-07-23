'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { BB } from '@/lib/site';

/* ---------- pure helpers ---------- */
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
// local YYYY-MM-DD (avoids UTC day-shift from toISOString)
const isoLocal = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function BookingClient({ catalog: S }) {
  const params = useSearchParams();
  const cur = S.currency;

  // Plans book their first visit here: the full Standard Detail at the sign-up
  // discount. Per-visit plan pricing is quoted in person at that visit.
  const disc = (S.plan && S.plan.firstVisitDiscountPct) || 10;
  const firstVisitPrice = (detailPrice) => Math.round(detailPrice * (1 - disc / 100));

  const FREQS = useMemo(() => (
    [{ id: 'onetime', name: 'One-time', desc: 'Just this once', recurring: false }]
      .concat(S.maintenance.map((m) => ({ id: m.id, name: m.name, desc: m.cadence, note: m.note, recurring: true })))
  ), [S]);

  /* ---------- state ---------- */
  const [sizeId, setSizeId] = useState(() => {
    const sz = params.get('size');
    return S.sizes.some((s) => s.id === sz) ? sz : null;
  });
  const [freq, setFreq] = useState(() => {
    const fq = params.get('freq');
    return ['onetime', ...S.maintenance.map((m) => m.id)].includes(fq) ? fq : null;
  });
  const [addons, setAddons] = useState([]);
  const [date, setDate] = useState(null);
  const [startMin, setStartMin] = useState(null);
  const [slots, setSlots] = useState(null);        // null = idle, 'loading', 'error', or []
  const [contact, setContact] = useState({ name: '', phone: '', email: '', address: '', notes: '' });
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(null); // { text }
  const [pickedOther, setPickedOther] = useState(null); // label for the native date input

  const slotLoadId = useRef(0);

  /* ---------- derived ---------- */
  const addonQuote = useCallback((a) => (a.pricing && a.pricing[sizeId]) || a, [sizeId]);
  const isRecurring = !!freq && freq !== 'onetime';
  const size = S.sizes.find((s) => s.id === sizeId);
  const planName = (FREQS.find((f) => f.id === freq) || {}).name || '--';

  const totals = useMemo(() => {
    const detail = sizeId ? (S.detail.pricing[sizeId] || {}) : {};
    let price = !sizeId || !freq ? 0 : (freq === 'onetime' ? detail.price || 0 : firstVisitPrice(detail.price || 0));
    let minutes = detail.minutes || 0;
    addons.forEach((id) => {
      const a = S.addons.find((x) => x.id === id);
      if (a) { const q = addonQuote(a); price += q.price || 0; minutes += q.minutes || 0; }
    });
    return { price, minutes };
  }, [S, sizeId, freq, addons, addonQuote]);

  const detailsFilled = ['name', 'phone', 'email', 'address'].every((k) => contact[k].trim());
  const priceLabel = isRecurring ? 'First visit' : 'Estimated total';
  const priceText = !(sizeId && freq) ? '--' : (totals.price > 0 ? cur + totals.price : 'Confirmed on site');

  /* ---------- availability ---------- */
  useEffect(() => {
    setStartMin(null);
    if (!sizeId || !freq || !date) { setSlots(null); return; }
    const myId = ++slotLoadId.current;
    setSlots('loading');
    fetch(`/api/availability?date=${date}&duration=${totals.minutes}`)
      .then((r) => r.json())
      .then((data) => {
        if (myId !== slotLoadId.current) return;
        if (!data.ok) throw new Error(data.error);
        setSlots(data.slots);
      })
      .catch(() => { if (myId === slotLoadId.current) setSlots('error'); });
    // totals.minutes covers size + addons; date/freq gate the fetch
  }, [sizeId, freq, date, totals.minutes]);

  /* ---------- mobile flow: glide to the next step ---------- */
  const scrollToStep = (id) => {
    if (!window.matchMedia('(max-width: 1023px)').matches) return;
    requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  /* ---------- submit ---------- */
  async function submit(e) {
    e?.preventDefault();
    setError('');
    if (!sizeId) return showError('Please choose your vehicle size.');
    if (!freq) return showError('Please choose how often (one-time or a maintenance plan).');
    if (!date || startMin == null) return showError('Please pick a date and time.');
    if (!detailsFilled) return showError('Please fill in your name, phone, email and address.');
    if (!agreed) return showError('Please agree to the terms and conditions.');

    const pkgName = S.detail.name + (isRecurring ? ` (${planName} plan)` : '');
    const payload = {
      name: contact.name.trim(), email: contact.email.trim(), phone: contact.phone.trim(),
      address: contact.address.trim(), notes: contact.notes.trim(),
      packageId: S.detail.id, packageName: pkgName,
      sizeId: size.id, sizeLabel: size.label,
      addons: addons.map((id) => { const a = S.addons.find((x) => x.id === id); return { id: a.id, name: a.name, price: addonQuote(a).price || 0 }; }),
      date, startMin,
      durationMin: totals.minutes, price: totals.price || 0,
      agreedTerms: true,
    };

    setSubmitting(true);
    try {
      const res = await fetch('/api/book', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || 'Something went wrong');
      if (typeof gtag !== 'undefined') gtag('event', 'conversion', { event_category: 'booking' });
      setConfirmed({ text: `${pkgName} for your ${size.label.toLowerCase()} on ${data.when}.` });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      showError(err.message || `We could not complete the booking. Please call ${BB.phone}.`);
    } finally {
      setSubmitting(false);
    }
  }
  function showError(msg) {
    setError(msg);
    requestAnimationFrame(() => document.getElementById('form-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
  }

  /* ---------- step gating ---------- */
  const gates = {
    size: { unlocked: true, done: !!sizeId },
    freq: { unlocked: !!sizeId, done: !!freq },
    addons: { unlocked: !!freq, done: addons.length > 0 },
    date: { unlocked: !!freq, done: startMin != null },
    details: { unlocked: startMin != null, done: detailsFilled },
    terms: { unlocked: startMin != null, done: agreed },
  };

  const Badge = ({ gate, n }) => (
    <span className={`step-badge ${!gate.unlocked ? 'locked' : gate.done ? 'done' : ''}`}>
      {!gate.unlocked ? <i className="fas fa-lock" style={{ fontSize: '.7rem' }} aria-hidden />
        : gate.done ? <i className="fas fa-check" aria-hidden /> : n}
    </span>
  );
  const Hint = ({ gate, children }) => gate.unlocked ? null : (
    <p className="step-hint text-sm font-medium mb-3"><i className="fas fa-arrow-up mr-1" aria-hidden /> {children}</p>
  );

  const freqPriceTag = (id) => {
    if (!sizeId) return null;
    const detail = (S.detail.pricing[sizeId] || {}).price;
    if (!detail || detail <= 0) return <span className="text-xs" style={{ color: 'var(--slate-soft)' }}>TBD</span>;
    if (id === 'onetime') return <span className="font-bold text-brand">{cur}{detail}</span>;
    return (
      <>
        <span className="font-bold text-brand">{cur}{firstVisitPrice(detail)}</span>
        <span className="block text-[11px]" style={{ color: 'var(--slate-soft)' }}>first visit · {disc}% off</span>
      </>
    );
  };

  /* ---------- date chips ---------- */
  const dateChips = useMemo(() => {
    const base = new Date(); base.setHours(12, 0, 0, 0);
    return Array.from({ length: 14 }, (_, i) => {
      const d = new Date(base); d.setDate(base.getDate() + i);
      return { iso: isoLocal(d), top: i === 0 ? 'Today' : i === 1 ? 'Tmrw' : WD[d.getDay()], day: d.getDate(), mon: MON[d.getMonth()] };
    });
  }, []);

  /* ---------- confirmation state ---------- */
  if (confirmed) {
    return (
      <section className="section" style={{ background: 'var(--surface-2)' }}>
        <div className="container max-w-xl">
          <div className="card p-8 sm:p-10 text-center">
            <div className="h-16 w-16 mx-auto rounded-full bg-green-100 text-green-600 grid place-items-center text-3xl mb-4"><i className="fas fa-check" aria-hidden /></div>
            <h1 className="text-2xl font-bold mb-2">You are booked!</h1>
            <p className="mb-6" style={{ color: 'var(--slate)' }}>{confirmed.text}</p>
            <p className="text-sm mb-6" style={{ color: 'var(--slate-soft)' }}>
              We sent a confirmation to your email. The time may be an arrival window, and final pricing is confirmed
              on site. Need to change something? Call or text {BB.phone}.
            </p>
            <Link href="/" className="btn btn-outline">Back to home</Link>
          </div>
        </div>
      </section>
    );
  }

  const summaryRows = [
    ['Service', S.detail.name],
    ['Vehicle', size ? size.label : '--'],
    ['Plan', planName],
    ...(addons.length ? [['Add-ons', addons.map((id) => (S.addons.find((a) => a.id === id) || {}).name).filter(Boolean).join(', ')]] : []),
    ...(totals.minutes ? [['Time', 'About ' + fmtDur(totals.minutes)]] : []),
    ...(date ? [['Date', date]] : []),
    ...(startMin != null ? [['Start', fmtTime(startMin)]] : []),
  ];

  return (
    <>
      <section className="section" style={{ background: 'var(--surface-2)' }}>
        <div className="container max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="eyebrow">Book online</span>
            <h1 className="text-4xl sm:text-5xl font-extrabold mt-3 mb-4">Book your detail</h1>
            <p style={{ color: 'var(--slate-soft)' }}>
              Every booking is our complete Standard Detail — a full showroom finish inside and out.
              Just tell us about your car and pick a time.
            </p>
          </div>

          <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start pb-24 lg:pb-0">
            <div className="lg:col-span-2 min-w-0 space-y-8">

              {/* 1. Vehicle size */}
              <div id="step-size" className="card p-6 sm:p-7 step">
                <div className="flex items-center gap-3 mb-4">
                  <Badge gate={gates.size} n="1" />
                  <h2 className="text-lg font-bold">Your vehicle size</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {S.sizes.map((s) => (
                    <label key={s.id} className={`choice ${s.id === sizeId ? 'is-selected' : ''}`}>
                      <input type="radio" name="size" value={s.id} checked={s.id === sizeId}
                             onChange={() => { setSizeId(s.id); scrollToStep('step-freq'); }} />
                      <span className="font-semibold text-ink text-sm">{s.label}</span>
                      <span className="block text-xs mt-0.5" style={{ color: 'var(--slate-soft)' }}>{s.note}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 2. Frequency */}
              <div id="step-freq" className={`card p-6 sm:p-7 step ${gates.freq.unlocked ? '' : 'locked'}`}>
                <div className="flex items-center gap-3 mb-1">
                  <Badge gate={gates.freq} n="2" />
                  <h2 className="text-lg font-bold">How often?</h2>
                </div>
                <Hint gate={gates.freq}>Choose your vehicle size first.</Hint>
                <p className="text-sm mb-4" style={{ color: 'var(--slate-soft)' }}>
                  Book a one-time detail, or start a maintenance plan — a plan books your first detail at {disc}% off,
                  and we set your recurring rate at that visit.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {FREQS.map((f) => (
                    <label key={f.id} className={`choice ${f.id === freq ? 'is-selected' : ''}`}>
                      <input type="radio" name="freq" value={f.id} checked={f.id === freq}
                             onChange={() => { setFreq(f.id); scrollToStep('step-addons'); }} />
                      <span className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-ink text-sm">{f.name}</span>
                        <span className="shrink-0 text-right">{freqPriceTag(f.id)}</span>
                      </span>
                      <span className="block text-xs mt-0.5" style={{ color: 'var(--slate-soft)' }}>
                        {f.desc}{f.note ? ` · ${f.note}` : ''}
                      </span>
                    </label>
                  ))}
                </div>
                {isRecurring && (
                  <div className="mt-4 text-sm rounded-xl p-3" style={{ background: 'var(--brand-soft)', color: 'var(--brand-dark)' }}>
                    <i className="fas fa-circle-info mr-1" aria-hidden /> We book your first visit now — a full Standard
                    Detail at {disc}% off to get your car to maintenance shape. Your recurring per-visit price and
                    schedule are set with you at that visit.
                  </div>
                )}
              </div>

              {/* 3. Add-ons */}
              <div id="step-addons" className={`card p-6 sm:p-7 step ${gates.addons.unlocked ? '' : 'locked'}`}>
                <div className="flex items-center gap-3 mb-1">
                  <Badge gate={gates.addons} n="3" />
                  <h2 className="text-lg font-bold">Add-ons <span className="font-normal text-sm" style={{ color: 'var(--slate-soft)' }}>(optional)</span></h2>
                </div>
                <Hint gate={gates.addons}>Choose how often first.</Hint>
                <p className="text-sm mb-4" style={{ color: 'var(--slate-soft)' }}>
                  Everything else is already included. These add a little time to your appointment.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {S.addons.map((a) => {
                    const on = addons.includes(a.id);
                    const p = addonQuote(a).price;
                    return (
                      <label key={a.id} className={`choice ${on ? 'is-selected' : ''}`}>
                        <input type="checkbox" checked={on}
                               onChange={() => setAddons(on ? addons.filter((x) => x !== a.id) : [...addons, a.id])} />
                        <span className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-ink text-sm">{a.name}</span>
                          <span className="text-sm font-bold text-brand shrink-0">{p > 0 ? `+${cur}${p}` : ''}</span>
                        </span>
                        <span className="block text-xs mt-0.5" style={{ color: 'var(--slate-soft)' }}>{a.note || ''}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 4. Date & time */}
              <div id="step-date" className={`card p-6 sm:p-7 step ${gates.date.unlocked ? '' : 'locked'}`}>
                <div className="flex items-center gap-3 mb-4">
                  <Badge gate={gates.date} n="4" />
                  <h2 className="text-lg font-bold">Pick a date and time</h2>
                </div>
                <Hint gate={gates.date}>Choose your vehicle size and how often first.</Hint>
                <div className="flex gap-2 overflow-x-auto no-scrollbar snap-x -mx-1 px-1 pb-2 mb-3">
                  {dateChips.map((c) => (
                    <button key={c.iso} type="button"
                            className={`slot ${date === c.iso ? 'is-selected' : ''} snap-start shrink-0 w-16 flex flex-col items-center gap-0.5 py-2`}
                            onClick={() => { setDate(c.iso); setPickedOther(null); scrollToStep('slots-area'); }}>
                      <span className="text-[11px] font-medium">{c.top}</span>
                      <span className="text-lg font-bold leading-none">{c.day}</span>
                      <span className="text-[10px] opacity-70">{c.mon}</span>
                    </button>
                  ))}
                </div>
                <div className="mb-5">
                  <span className="relative inline-flex items-center gap-1.5 text-sm font-medium text-brand cursor-pointer">
                    <i className="far fa-calendar" aria-hidden />
                    <span>{pickedOther || 'Pick another date'}</span>
                    <input
                      type="date" min={isoLocal(new Date())} aria-label="Pick another date"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => {
                        if (!e.target.value) return;
                        const [y, m, d] = e.target.value.split('-').map(Number);
                        setDate(e.target.value);
                        setPickedOther(`${MON[m - 1]} ${d}, ${y}`);
                        scrollToStep('slots-area');
                      }}
                    />
                  </span>
                </div>
                <div id="slots-area">
                  {slots === null && <p className="text-sm" style={{ color: 'var(--slate-soft)' }}>Choose a date above to see open times.</p>}
                  {slots === 'loading' && (
                    <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--slate-soft)' }}>
                      <div className="spinner spinner-dark" style={{ width: 24, height: 24, borderWidth: 3 }} /> Loading open times...
                    </div>
                  )}
                  {slots === 'error' && (
                    <p className="text-sm text-red-600">
                      We could not load open times right now. Please call or text{' '}
                      <a href={BB.phoneHref} className="font-semibold underline">{BB.phone}</a> to book.
                    </p>
                  )}
                  {Array.isArray(slots) && slots.length === 0 && (
                    <p className="text-sm" style={{ color: 'var(--slate-soft)' }}>
                      No open times that day. Try another date, or call us at{' '}
                      <a href={BB.phoneHref} className="text-brand font-semibold">{BB.phone}</a>.
                    </p>
                  )}
                  {Array.isArray(slots) && slots.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {slots.map((s) => (
                        <button key={s.min} type="button"
                                className={`slot ${startMin === s.min ? 'is-selected' : ''}`}
                                onClick={() => { setStartMin(s.min); scrollToStep('step-details'); }}>
                          {s.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* 5. Details */}
              <div id="step-details" className={`card p-6 sm:p-7 step ${gates.details.unlocked ? '' : 'locked'}`}>
                <div className="flex items-center gap-3 mb-4">
                  <Badge gate={gates.details} n="5" />
                  <h2 className="text-lg font-bold">Your details</h2>
                </div>
                <Hint gate={gates.details}>Pick a date and time first.</Hint>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label" htmlFor="f-name">Full name</label>
                    <input id="f-name" className="field" required autoComplete="name"
                           value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="label" htmlFor="f-phone">Phone</label>
                    <input id="f-phone" type="tel" className="field" required autoComplete="tel"
                           value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label" htmlFor="f-email">Email</label>
                    <input id="f-email" type="email" className="field" required autoComplete="email"
                           value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label" htmlFor="f-address">Service address</label>
                    <input id="f-address" className="field" placeholder="Where should we meet your vehicle?" required autoComplete="street-address"
                           value={contact.address} onChange={(e) => setContact({ ...contact, address: e.target.value })} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label" htmlFor="f-notes">Notes <span className="font-normal" style={{ color: 'var(--slate-soft)' }}>(optional)</span></label>
                    <textarea id="f-notes" className="field" rows={3} placeholder="Vehicle make/model, gate codes, anything we should know"
                              value={contact.notes} onChange={(e) => setContact({ ...contact, notes: e.target.value })} />
                  </div>
                </div>
              </div>

              {/* 6. Terms */}
              <div id="step-terms" className={`card p-6 sm:p-7 step ${gates.terms.unlocked ? '' : 'locked'}`}>
                <div className="flex items-center gap-3 mb-4">
                  <Badge gate={gates.terms} n="6" />
                  <h2 className="text-lg font-bold">Agree &amp; confirm</h2>
                </div>
                <Hint gate={gates.terms}>Pick a date and time first.</Hint>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
                         className="mt-1 h-5 w-5 accent-blue-600 shrink-0" required />
                  <span className="text-sm" style={{ color: 'var(--slate)' }}>
                    I agree to the Buffer Bros <Link href="/terms" target="_blank" className="text-brand font-semibold hover:underline">Terms &amp; Conditions</Link>.
                    I understand pre and post service inspections are performed, that Buffer Bros is not liable for
                    pre-existing conditions or damage not caused by their work, and that the final price may change if
                    my vehicle needs more work than its package covers.
                  </span>
                </label>
              </div>

              {error && <div id="form-error" className="text-sm text-red-600 font-medium">{error}</div>}
            </div>

            {/* SUMMARY (desktop) */}
            <aside className="hidden lg:block lg:sticky lg:top-24">
              <div className="card p-6">
                <h3 className="font-bold text-lg mb-4">Your appointment</h3>
                <dl className="space-y-3 text-sm">
                  {summaryRows.map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-3">
                      <dt style={{ color: 'var(--slate-soft)' }}>{k}</dt>
                      <dd className="font-semibold text-ink text-right">{v}</dd>
                    </div>
                  ))}
                </dl>
                <div className="border-t border-gray-100 mt-4 pt-4">
                  <div className="flex items-baseline justify-between">
                    <span className="font-semibold">{priceLabel}</span>
                    <span className="text-2xl font-extrabold text-ink">{priceText}</span>
                  </div>
                  <p className="text-xs mt-1" style={{ color: 'var(--slate-soft)' }}>Confirmed on site. May vary by condition.</p>
                </div>
                <button type="submit" disabled={submitting} className="btn btn-primary btn-block mt-5">Confirm booking</button>
              </div>
            </aside>
          </form>
        </div>
      </section>

      {/* SUMMARY (mobile sticky bar) */}
      <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 bg-white/95 backdrop-blur border-t border-gray-200">
        <div className="container flex items-center justify-between gap-3 py-3" style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}>
          <div className="leading-tight min-w-0">
            <div className="text-[11px] truncate" style={{ color: 'var(--slate-soft)' }}>{priceLabel}</div>
            <div className="text-xl font-extrabold text-ink truncate">{priceText}</div>
          </div>
          <button type="button" disabled={submitting} onClick={submit} className="btn btn-primary shrink-0 px-6">Confirm booking</button>
        </div>
      </div>

      {/* Loading overlay */}
      {submitting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60">
          <div className="bg-white rounded-2xl px-8 py-7 flex items-center gap-4 shadow-xl">
            <div className="spinner spinner-dark" />
            <p className="font-semibold text-ink">Booking your appointment...</p>
          </div>
        </div>
      )}
    </>
  );
}
