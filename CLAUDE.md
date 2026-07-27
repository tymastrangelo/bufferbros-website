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

## Working in this repo

- Don't run Playwright or other browser checks unless Tyler asks; he tests locally himself. Verifying with `next build` is enough.
- Never commit test artifacts (screenshots, scratch scripts, downloaded photo candidates). Only commit files the site needs to run.
- Use the graphify skill for codebase/architecture questions to save context space.

## Copy voice

- No em dashes in any user-facing text. Use periods, commas, or `·` in short labels.
- Plain, human sentences. Avoid slogan-y triads and words like "premium".
- Tagline to keep: "One detail. Done right."

## Pricing rules

- Live prices come from Supabase (edited at admin.bufferbros.org); `lib/catalog.js` is the fallback snapshot, keep it roughly in sync.
- Never show maintenance plan per-visit prices on the site. A plan books a first detail at the plan discount; recurring rate is agreed in person.
- Boats: per-foot starting rates come live from Supabase (service `boat-detail`), shown as a guide only. Every boat is still quoted personally via the inquiry form on /packages (emails Tyler with photos). Maintenance wash rate is an estimate, keep the asterisk.
