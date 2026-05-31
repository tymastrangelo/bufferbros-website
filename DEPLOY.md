# Buffer Bros — deploy & operate guide

The site is now a Cloudflare Worker: the static site is served from `public/`
and a small booking backend (the Worker + a D1 database) handles availability
and bookings. This guide covers first-time setup, secrets, and day-to-day admin.

---

## What changed

- The static site (HTML/CSS/JS) was redesigned and now lives in `public/`.
- The booking API lives in `src/index.js` + `functions/api/*` (handlers) and talks to a D1 database. The customer books at `public/booking.html`; you manage availability at `public/admin.html`.
- All pricing and durations live in **one file**: `public/js/services.js`. Edit prices/times there and both the Packages page and booking update automatically.
- `quote.html` now redirects to `booking.html` so old ad links keep working.

---

## One-time setup

You'll need a free Cloudflare account and Node.js installed locally.

### 1. Install the CLI and log in
```bash
npm install -g wrangler        # or use npx wrangler ... everywhere
wrangler login
```

### 2. Create the D1 database
```bash
wrangler d1 create bufferbros
```
Copy the `database_id` it prints and paste it into `wrangler.toml`
(replace `PASTE_YOUR_D1_DATABASE_ID_HERE`).

### 3. Create the tables
```bash
wrangler d1 execute bufferbros --remote --file=./schema.sql
```

### 4. Deploy
This project is a Cloudflare **Worker** (static site served from `public/`,
booking API in `src/index.js`). The repo is connected to Git, so **every push
to `main` triggers a deploy automatically**. To deploy manually instead:
```bash
wrangler deploy
```

### 5. Set your secrets
Easiest: in the dashboard, open the **bufferbros-website** Worker →
**Settings → Variables and Secrets → Add** (type = Secret) for each of these.
Or from the terminal (run each once, paste the value when prompted):
```bash
wrangler secret put ADMIN_PASSWORD   # your admin login password
wrangler secret put ADMIN_SECRET     # any long random string
wrangler secret put OWNER_EMAIL      # where booking emails go
wrangler secret put FROM_EMAIL       # verified sender, e.g. bookings@bufferbros.org
wrangler secret put RESEND_API_KEY   # from resend.com (free tier)
```
- **ADMIN_SECRET**: just mash the keyboard for a long random string. It signs your admin login session.
- **Email** uses [Resend](https://resend.com). Create a free account, verify your `bufferbros.org` domain, create an API key, and use a `FROM_EMAIL` on that domain. If you skip email for now, bookings still save; they just won't email.

### 6. Point your domain at Cloudflare
Your domain is `bufferbros.org` (currently on GitHub Pages via the `CNAME` file).
- In the **bufferbros-website** Worker: **Settings → Domains & Routes → Add → Custom domain → `bufferbros.org`** (and `www`).
- Update your domain's nameservers/DNS to Cloudflare as instructed.
- Once live on Cloudflare, GitHub Pages is no longer used.

---

## Day-to-day: managing your calendar

Go to **`bufferbros.org/admin.html`** and log in with your `ADMIN_PASSWORD`.

- **Weekly hours** — set the times you're open each day. Uncheck a day to close it. These are the slots customers can book.
- **Block off time** — block a single day or a date range (vacation), or a time window within a day. Blocked time disappears from customer booking instantly.
- **Upcoming bookings** — see every confirmed appointment with contact info and address. Cancel one to free its slot.

The booking page only ever offers times that fit the chosen package + vehicle size
(plus a travel/cleanup buffer), and it never offers a slot that overlaps a block or
another booking. A booked slot is re-checked at submit time, so two people can't grab
the same time.

---

## Editing prices and packages

Open `public/js/services.js`. All prices and durations live there.
- `minutes` controls how long a slot is held (this is what makes a Standard on a 4Runner take ~2.5 hrs).
- `price` shows on the Packages page and in the booking summary.
- You can add/remove sizes, add-ons, and maintenance plans freely.

After editing, push to Git (auto-deploys) or run `wrangler deploy`.

---

## Tuning behavior

Defaults live in `schema.sql` under `settings` (already applied):
- `slot_granularity_min` (30) — start times shown every 30 min.
- `min_lead_min` (180) — earliest a customer can book is 3 hours out.
- `buffer_min` (30) — pack-up/travel time held after each job.

Change them anytime:
```bash
wrangler d1 execute bufferbros --remote --command="UPDATE settings SET value='60' WHERE key='min_lead_min'"
```

---

## Local development
```bash
wrangler dev
```
This serves the static site and the booking API together at `http://localhost:8787`,
using a local D1 database. Apply the schema locally first with
`wrangler d1 execute bufferbros --local --file=./schema.sql`.
