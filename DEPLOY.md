# Buffer Bros — deploy & operate guide

The site is a **Next.js app** deployed to Cloudflare Workers via OpenNext.
Pages live in `app/`, shared UI in `components/`, and the booking API in
`app/api/*` (it talks to Supabase — the same database the admin dashboard at
**admin.bufferbros.org** uses).

---

## Local development

```bash
npm install
cp .env.example .env.local   # fill in the Supabase values (see below)
npm run dev                  # http://localhost:3000
```

Without `.env.local` the site still runs: pricing falls back to the snapshot
in `lib/catalog.js`, but availability/booking calls will fail. For full local
booking, set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (Supabase project
→ Settings → API).

To test the real Cloudflare Worker runtime locally:

```bash
npm run preview
```

---

## Deploying

```bash
npm run deploy
```

This builds the Next.js app, adapts it with OpenNext, and deploys the
`bufferbros-website` Worker using `wrangler.jsonc`. You need to be logged in
(`npx wrangler login`).

> **⚠️ If the repo is connected to Cloudflare's Git auto-deploy (Workers
> Builds):** update the build settings in the Cloudflare dashboard
> (Worker → Settings → Build) so the **build command** is
> `npx opennextjs-cloudflare build` and the **deploy command** is
> `npx opennextjs-cloudflare deploy`. The old static-site deploy will fail
> or serve nothing after this migration if the build command isn't updated.

### Secrets

Set once, in the dashboard (Worker → Settings → Variables and Secrets) or via
terminal:

```bash
wrangler secret put SUPABASE_URL
wrangler secret put SUPABASE_SERVICE_ROLE_KEY
wrangler secret put OWNER_EMAIL      # where booking emails go
wrangler secret put FROM_EMAIL       # verified Resend sender
wrangler secret put RESEND_API_KEY   # from resend.com
```

Email is best-effort: bookings still save without Resend configured.

---

## Editing prices, services and plans

All live pricing comes from **Supabase**, edited in the admin dashboard's
Settings page (admin.bufferbros.org). The site picks changes up within
5 minutes — no deploy needed.

- **Maintenance plan per-visit rates are intentionally not shown on the
  site.** Plans book a first visit (a full Standard Detail at the sign-up
  discount, `plan_initial_discount_pct` in Supabase `settings`); you agree
  the recurring rate with the customer in person.
- Marketing copy (taglines, the what's-included list, size labels) lives in
  `lib/catalog.js` (`COPY`), which also holds the offline fallback snapshot —
  keep the fallback prices roughly in sync when you change prices in the
  dashboard.

## Boats

The packages page has a **Boats** tab (no set rates yet) that funnels
inquiries to call/text. When boat pricing is ready, it can be added to the
catalog like the other services.

---

## SEO

- Per-page titles/descriptions: exported `metadata` in each `app/*/page.js`.
- Structured data (LocalBusiness/AutoWash JSON-LD): `app/layout.js`.
- `sitemap.xml` and `robots.txt` are generated from `app/sitemap.js` and
  `app/robots.js`.
- Old `.html` URLs (ads, QR codes, bookmarks) 301-redirect in
  `next.config.mjs`.

---

## Day-to-day: managing your calendar

Weekly hours, blocked time, and bookings are managed in the admin dashboard
at **admin.bufferbros.org**. The booking page only offers times that fit the
chosen vehicle + add-ons (Supabase `get_available_slots`), and the slot is
re-validated at submit (`book_appointment`), so double-booking is impossible.
