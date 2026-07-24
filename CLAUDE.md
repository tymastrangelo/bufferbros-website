# Buffer Bros website

Next.js 15 + Tailwind v4, deployed to Cloudflare Workers via OpenNext.
Full operating guide: DEPLOY.md.

## Deploying to the live site

Pushing to `main` on GitHub auto-deploys via Cloudflare git builds
(build command `npx opennextjs-cloudflare build`, deploy command
`npx opennextjs-cloudflare deploy`). Manual fallback:

```bash
npm run deploy
```

Never use a bare `wrangler deploy`; it skips the OpenNext build.
When Tyler says the changes are done / he's happy with them, commit and push to `main` to ship them.

## Copy voice

- No em dashes in any user-facing text. Use periods, commas, or `·` in short labels.
- Plain, human sentences. Avoid slogan-y triads and words like "premium".
- Tagline to keep: "One detail. Done right."

## Pricing rules

- Live prices come from Supabase (edited at admin.bufferbros.org); `lib/catalog.js` is the fallback snapshot, keep it roughly in sync.
- Never show maintenance plan per-visit prices on the site. A plan books a first detail at the plan discount; recurring rate is agreed in person.
- Boats are inquiry-only (call/text), no set rates.
