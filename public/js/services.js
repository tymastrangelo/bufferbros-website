/* ===========================================================
   Buffer Bros - services, pricing & durations (FALLBACK SNAPSHOT)
   -----------------------------------------------------------
   The live catalog is served by /api/services.js, built from Supabase —
   prices are edited in the admin dashboard's Settings page, not here.
   This file is only served if Supabase is unreachable (see src/index.js),
   so keep it roughly in sync when prices change.

   Add-ons may carry a per-size `pricing` map (like the detail does);
   `price`/`minutes` are then the sedan fallback.
   =========================================================== */

window.BB_SERVICES = {

  currency: '$',

  /* Vehicle size tiers. Price and time scale off these. */
  sizes: [
    { id: 'sedan',   label: 'Car / Sedan / Coupe',  note: 'Sedans, coupes, small hatchbacks' },
    { id: 'midsize', label: 'Midsize SUV / Truck',  note: '2-row SUVs, midsize trucks' },
    { id: 'large',   label: 'Large SUV / Truck',    note: '3-row SUVs, full-size trucks, vans' },
  ],

  /* The one and only detail. Showroom finish, inside and out, every time. */
  detail: {
    id: 'standard',
    name: 'The Standard Detail',
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
    pricing: {
      sedan:   { price: 229, minutes: 120 }, // ~2 hr
      midsize: { price: 249, minutes: 150 }, // ~2.5 hr, e.g. 4Runner
      large:   { price: 269, minutes: 180 }, // ~3 hr
    },
  },

  /* Maintenance = the Standard Detail on repeat. Same work, lower price per
     visit the more often we come. Per-visit price by vehicle size. */
  maintenance: [
    {
      id: 'monthly', name: 'Monthly', cadence: 'Every month',
      note: 'Keep it consistently clean',
      pricing: { sedan: { price: 179 }, midsize: { price: 199 }, large: { price: 219 } },
    },
    {
      id: 'biweekly', name: 'Bi-Weekly', cadence: 'Every two weeks',
      note: 'Most popular', popular: true,
      pricing: { sedan: { price: 159 }, midsize: { price: 179 }, large: { price: 199 } },
    },
    {
      id: 'weekly', name: 'Weekly', cadence: 'Every week',
      note: 'Lowest price per visit',
      pricing: { sedan: { price: 139 }, midsize: { price: 159 }, large: { price: 179 } },
    },
  ],

  /* Optional add-ons. minutes add to the appointment length. */
  addons: [
    { id: 'clay-bar',   name: 'Clay Bar + Hand Wax',   price: 100, minutes: 60, note: 'Deep paint decontamination, finished with a longer-lasting hand wax instead of the standard spray wax',
      pricing: { sedan: { price: 100, minutes: 60 }, midsize: { price: 125, minutes: 75 }, large: { price: 150, minutes: 90 } } },
    { id: 'pet-hair',   name: 'Pet Hair Removal',      price: 50, minutes: 30, note: 'Heavy shedding cases may be quoted up' },
    { id: 'engine-bay', name: 'Engine Bay Cleaning',   price: 45, minutes: 30, note: 'Degreased and dressed' },
    { id: 'headlights', name: 'Headlight Restoration', price: 100, minutes: 45, note: 'Per pair — clears yellowed, foggy lenses' },
    { id: 'odor',       name: 'Odor / Ozone Treatment', price: 65, minutes: 45, note: 'Heavy smoke may be quoted up' },
  ],
};
