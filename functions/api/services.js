/* GET /api/services.js — the live BB_SERVICES catalog as a script.
   Prices, durations, add-on names and notes come straight from Supabase, so
   editing them in the admin dashboard's Settings page updates this site with
   no deploy (pages pick it up within the 5-minute cache window). Marketing
   copy (taglines, what's-included lists, size labels) lives here in COPY.
   If Supabase is unreachable, src/index.js falls back to the static
   /js/services.js snapshot so the booking page never goes down. */

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

async function sb(env, path) {
  const res = await fetch(`${env.SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
    },
  });
  if (!res.ok) throw new Error(`${path} ${res.status}`);
  return res.json();
}

export async function onRequestGet({ env }) {
  const [services, pricing, plans] = await Promise.all([
    sb(env, 'services?select=*&active=eq.true&order=sort'),
    sb(env, 'service_pricing?select=*'),
    sb(env, 'plan_pricing?select=*'),
  ]);

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

  const maintenance = ['monthly', 'biweekly', 'weekly'].map((id) => ({
    id,
    ...COPY.maintenance[id],
    pricing: Object.fromEntries(
      plans.filter((p) => p.cadence === id).map((p) => [p.size_id, { price: +p.price }])),
  }));

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

  const catalog = { currency: COPY.currency, sizes: COPY.sizes, detail, maintenance, addons };
  return new Response(`window.BB_SERVICES = ${JSON.stringify(catalog)};`, {
    headers: {
      'content-type': 'application/javascript; charset=utf-8',
      'cache-control': 'public, max-age=300',
    },
  });
}
