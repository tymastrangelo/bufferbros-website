/* ===========================================================
   Services catalog — prices, durations, add-ons.
   Live data comes from Supabase (edited in the admin dashboard's
   Settings page). Marketing copy lives here in COPY. If Supabase
   is unreachable or env vars are missing (e.g. fresh local dev),
   the FALLBACK snapshot below is served so nothing ever breaks.

   Per-visit maintenance-plan prices are backend-only: the site
   never shows them. Plans book a first visit (a full Standard
   Detail at the sign-up discount); the recurring rate is agreed
   in person at that visit.
   =========================================================== */

const COPY = {
  currency: '$',
  sizes: [
    { id: 'sedan',   label: 'Car / Sedan / Coupe',  note: 'Sedans, coupes, small hatchbacks' },
    { id: 'midsize', label: 'Midsize SUV / Truck',  note: '2-row SUVs, midsize trucks' },
    { id: 'large',   label: 'Large SUV / Truck',    note: '3-row SUVs, full-size trucks, vans' },
  ],
  detail: {
    promise: 'Showroom finish, every single time.',
    tagline: 'A complete inside and out detail. No tiers, no upsells to get a clean car. This is the whole thing.',
    includes: [
      'Full interior vacuum, seats, carpets and mats',
      'Hand wash with a double foam bath',
      'Layer of protective spray wax',
      'Wheels, tires and tire shine',
      'All interior surfaces wiped down',
      'Interior and exterior glass',
      'Door jambs cleaned',
    ],
  },
  maintenance: {
    monthly:  { name: 'Monthly',   cadence: 'Every month',     note: 'Keep it consistently clean' },
    biweekly: { name: 'Bi-Weekly', cadence: 'Every two weeks', note: 'Most popular', popular: true },
    weekly:   { name: 'Weekly',    cadence: 'Every week',      note: 'Lowest price per visit' },
  },
};

const FALLBACK = {
  currency: COPY.currency,
  sizes: COPY.sizes,
  detail: {
    id: 'standard',
    name: 'The Standard Detail',
    ...COPY.detail,
    pricing: {
      sedan:   { price: 229, minutes: 120 },
      midsize: { price: 249, minutes: 150 },
      large:   { price: 269, minutes: 180 },
    },
  },
  maintenance: ['monthly', 'biweekly', 'weekly'].map((id) => ({ id, ...COPY.maintenance[id] })),
  plan: { firstVisitDiscountPct: 10 },
  addons: [
    { id: 'clay-bar',   name: 'Clay Bar + Hand Wax',   price: 100, minutes: 60, note: 'Deep paint decontamination, finished with a longer-lasting hand wax instead of the standard spray wax',
      pricing: { sedan: { price: 100, minutes: 60 }, midsize: { price: 125, minutes: 75 }, large: { price: 150, minutes: 90 } } },
    { id: 'pet-hair',   name: 'Pet Hair Removal',      price: 50, minutes: 30, note: 'Heavy shedding cases may be quoted up' },
    { id: 'engine-bay', name: 'Engine Bay Cleaning',   price: 45, minutes: 30, note: 'Degreased and dressed' },
    { id: 'headlights', name: 'Headlight Restoration', price: 100, minutes: 45, note: 'Per pair. Clears yellowed, foggy lenses' },
    { id: 'odor',       name: 'Odor / Ozone Treatment', price: 65, minutes: 45, note: 'Heavy smoke may be quoted up' },
  ],
};

async function sb(path) {
  const res = await fetch(`${process.env.SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
    },
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`${path} ${res.status}`);
  return res.json();
}

export async function getCatalog() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return FALLBACK;
  try {
    const [services, pricing, settings] = await Promise.all([
      sb('services?select=*&active=eq.true&order=sort'),
      sb('service_pricing?select=*'),
      sb('settings?select=key,value'),
    ]);
    const setting = (key, fallback) => {
      const row = settings.find((s) => s.key === key);
      const n = row ? Number(row.value) : NaN;
      return Number.isFinite(n) ? n : fallback;
    };

    const rowsFor = (id) => pricing.filter((p) => p.service_id === id);
    const sizePricing = (rows) => Object.fromEntries(
      rows.filter((r) => r.size_id !== '*').map((r) => [r.size_id, { price: +r.price, minutes: r.minutes }]));

    const std = services.find((s) => s.id === 'standard');
    const detail = {
      id: 'standard',
      name: (std && std.name) || 'The Standard Detail',
      ...COPY.detail,
      pricing: sizePricing(rowsFor('standard')),
    };

    const maintenance = ['monthly', 'biweekly', 'weekly'].map((id) => ({ id, ...COPY.maintenance[id] }));
    const plan = { firstVisitDiscountPct: setting('plan_initial_discount_pct', 10) };

    const addons = services.filter((s) => s.kind === 'addon').map((s) => {
      const rows = rowsFor(s.id);
      const flat = rows.find((r) => r.size_id === '*') || rows.find((r) => r.size_id === 'sedan') || rows[0] || { price: 0, minutes: 0 };
      const perSize = rows.some((r) => r.size_id !== '*');
      return {
        id: s.id, name: s.name, note: s.note || '',
        price: +flat.price, minutes: flat.minutes,
        ...(perSize ? { pricing: sizePricing(rows) } : {}),
      };
    });

    return { currency: COPY.currency, sizes: COPY.sizes, detail, maintenance, plan, addons };
  } catch (err) {
    console.error('catalog: falling back to snapshot —', err.message);
    return FALLBACK;
  }
}
