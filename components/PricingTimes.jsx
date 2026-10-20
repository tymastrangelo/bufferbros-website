'use client';

/* Homepage pricing: pick a vehicle size → price, what's included, extras, and the
   next real open times for that size (same availability engine as booking). Tapping
   a time lands in booking with size, date and time already filled in. */
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Wheel from '@/components/Wheel';
import { IconCheck, IconClock } from '@/components/Icons';

const isoLocal = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const DAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const dayLabel = (iso, i) => {
  if (i === 0) return 'Today';
  if (i === 1) return 'Tomorrow';
  const [y, m, d] = iso.split('-').map(Number);
  return `${DAY[new Date(y, m - 1, d, 12).getDay()]} ${MON[m - 1]} ${d}`;
};
const hours = (min) => {
  const h = min / 60;
  return Number.isInteger(h) ? `${h} hours` : `${h.toFixed(1)} hours`;
};

export default function PricingTimes({ catalog: S }) {
  const [size, setSize] = useState('sedan');
  const [slots, setSlots] = useState(null);
  const seq = useRef(0);
  const tier = S.detail.pricing[size] || {};
  const addonPrice = (a) => (a.pricing && a.pricing[size] ? a.pricing[size].price : a.price);

  useEffect(() => {
    if (!tier.minutes) return;
    const my = ++seq.current;
    setSlots('loading');
    (async () => {
      const found = [];
      const base = new Date();
      for (let i = 0; i < 12 && found.length < 6; i++) {
        const d = new Date(base);
        d.setDate(base.getDate() + i);
        const iso = isoLocal(d);
        try {
          const r = await fetch(`/api/availability?date=${iso}&duration=${tier.minutes}`).then((x) => x.json());
          if (my !== seq.current) return;
          // first and a midday option per day: spread out reads better than 8 adjacent slots
          const day = (r.ok ? r.slots : []).filter((_, k, a) => k === 0 || k === Math.floor(a.length / 2));
          for (const s of day) if (found.length < 6) found.push({ date: iso, day: dayLabel(iso, i), ...s });
        } catch {
          break;
        }
      }
      if (my === seq.current) setSlots(found);
    })();
  }, [size, tier.minutes]);

  const href = (s) => `/booking?size=${size}&freq=onetime${s ? `&date=${s.date}&start=${s.min}` : ''}`;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-12 items-start">
      <div>
        <div className="grid grid-cols-3 gap-2 sm:gap-3" role="radiogroup" aria-label="Vehicle size">
          {S.sizes.map((s) => (
            <button key={s.id} type="button" role="radio" aria-checked={s.id === size} onClick={() => setSize(s.id)} className="choice p-3 sm:p-5">
              <span className="block text-2xl sm:text-4xl font-bold wide text-ink num">{S.currency}{(S.detail.pricing[s.id] || {}).price}</span>
              <span className="block mt-1 text-xs sm:text-sm text-ink-2 leading-snug">{s.label}</span>
            </button>
          ))}
        </div>

        <p key={size} className="swap mt-6 flex items-center gap-2 text-sm text-ink-2">
          <IconClock size={16} /> About {hours(tier.minutes || 0)} on site for this size
        </p>
        <ul className="mt-5 grid sm:grid-cols-2 gap-x-8 gap-y-3">
          {S.detail.includes.map((item) => (
            <li key={item} className="flex gap-3">
              <IconCheck size={20} weight="bold" className="text-brand shrink-0 mt-0.5" />
              <span className="text-ink">{item}</span>
            </li>
          ))}
        </ul>

        <div className="mt-8 border-t border-[color:var(--line)] pt-6">
          <p className="text-sm font-semibold text-ink">Optional extras</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {S.addons.map((a) => (
              <li key={a.id} className="rounded-full border border-[color:var(--line)] bg-white px-3.5 py-1.5 text-sm text-ink">
                {a.name} <span className="text-ink-2 num">+{S.currency}{addonPrice(a)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card p-5 sm:p-6 lg:sticky lg:top-24">
        <p className="font-semibold text-ink">Next open times</p>
        <p className="text-sm text-ink-2">For a {S.sizes.find((s) => s.id === size)?.label.toLowerCase()}</p>
        <div className="mt-4 min-h-[9.5rem]" aria-live="polite">
          {slots === 'loading' && (
            <p className="flex items-center gap-2.5 text-sm text-ink-2"><Wheel size={22} /> Checking the schedule…</p>
          )}
          {Array.isArray(slots) && slots.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {slots.map((s, i) => (
                <Link key={`${s.date}-${s.min}`} href={href(s)} style={{ '--i': i }} className="slot rise flex flex-col items-start justify-center leading-tight">
                  <span className="text-xs font-medium text-ink-2">{s.day}</span>
                  <span>{s.label}</span>
                </Link>
              ))}
            </div>
          )}
          {Array.isArray(slots) && slots.length === 0 && (
            <p className="text-sm text-ink-2">Nothing open in the next two weeks online. Text us and we will find a time.</p>
          )}
        </div>
        <Link href={href(null)} className="btn btn-primary btn-block mt-5"><span>Book a <span key={size} className="swap inline-block num">{S.currency}{tier.price}</span> detail</span></Link>
        <p className="mt-3 text-center text-xs text-ink-2">Nothing is charged until the work is done.</p>
      </div>
    </div>
  );
}
