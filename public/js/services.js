/* ===========================================================
   Buffer Bros - services, pricing & durations (SINGLE SOURCE OF TRUTH)
   -----------------------------------------------------------
   We offer ONE detail: the Standard Detail. Clean doesn't have tiers.
   Maintenance is that same detail on a recurring schedule, which costs
   less per visit because the car stays in showroom shape.

   This one file drives the Packages page AND the booking page
   (durations decide how long a slot is blocked off).

   To change pricing: edit `price` values below. To change how long a
   job blocks the calendar: edit `minutes`. A price of 0 shows as "TBD".
   =========================================================== */

window.BB_SERVICES = {

  currency: '$',

  /* Vehicle size tiers. Price and time scale off these. */
  sizes: [
    { id: 'sedan',   label: 'Car / Sedan / Coupe',  note: 'Sedans, coupes, small hatchbacks' },
    { id: 'midsize', label: 'Midsize SUV / Truck',  note: '2-row SUVs, 4Runner, midsize trucks' },
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
      'Layer of protective wax',
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
    { id: 'pet-hair',   name: 'Pet Hair Removal',      price: 40, minutes: 30, note: 'Heavy shedding and embedded hair' },
    { id: 'engine-bay', name: 'Engine Bay Cleaning',   price: 35, minutes: 30, note: 'Cleaned and dressed' },
    { id: 'ceramic',    name: 'Ceramic Spray Coating', price: 60, minutes: 45, note: 'Months of added protection' },
    { id: 'headlights', name: 'Headlight Restoration', price: 50, minutes: 45, note: 'Clears yellowed, foggy lenses' },
    { id: 'odor',       name: 'Odor / Ozone Treatment', price: 45, minutes: 30, note: 'Smoke and stubborn smells' },
  ],
};
