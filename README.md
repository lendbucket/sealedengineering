# sealedengineering.com

Sealed Engineering is a productized, flat rate engineering deliverables brand
for Texas property. It is a brand of **254 Engineering Services LLC**, and every
sealed document is the work of an engineer licensed in Texas.

This repository is the marketing and intake site.

## The two things to understand before changing anything

### 1. The compliance gate is a legal control, not a feature flag

`src/config/launch.ts` reads `LAUNCH_MODE` and resolves to `prelaunch` or
`live`. TBPELS firm registration is not active, so the site must not state that
engineering services are currently offered or performed.

- **prelaunch** (shipping): every CTA routes to `/waitlist`, `/order` redirects
  there, the order server action refuses independently of the UI, and the footer
  discloses that registration is pending.
- **live**: `/order` activates, `/waitlist` redirects there, and the footer
  renders `TBPELS Firm No.` with `TBPELS_FIRM_NUMBER`.

`live` with an empty firm number **degrades back to prelaunch**. Failing shut is
the only safe direction for a licensure disclosure.

Both modes are exercised end to end by `npm run forms-audit`.

### 2. The database is closed by construction

Every `eng_` table has RLS enabled with **zero policies**. No browser-held
credential can read or write anything, so there is deliberately no
`NEXT_PUBLIC_SUPABASE_*` key in this project. All access is server side through
the service role.

`src/lib/supabase.ts` starts with `import "server-only"`. If any client
component ever imports it, even transitively, the build fails and names the
file. That is the guarantee, not the comment above it.

## Getting started

```bash
npm install
cp .env.example .env.local     # then fill it in
npm run dev                    # http://localhost:3125
```

| Variable | Required | Notes |
| --- | --- | --- |
| `SUPABASE_URL` | yes | Shared project. Do not create a new one. |
| `SUPABASE_SERVICE_ROLE_KEY` | yes | Server only. Never `NEXT_PUBLIC_`. |
| `RESEND_API_KEY` | no | Absent means notifications are skipped and logged. A form still saves. |
| `LAUNCH_MODE` | yes | `prelaunch` or `live`. |
| `TBPELS_FIRM_NUMBER` | for live | Empty degrades `live` to `prelaunch`. |

## Where things live

```
src/config/     site identity and the launch gate
src/data/       services, cities, industries, and the Insights posts
src/lib/        seo, schema, supabase, email, forms, attribution
src/app/        routes; actions.ts holds every server action
scripts/        the audit suite and its harnesses
```

Content is data, not markup. Ten services, twenty five cities, three industry
pages, and six posts all render from `src/data/`. Post bodies are structured
blocks rather than JSX specifically so `meta-audit` can enforce the 1200 word
floor rather than trusting that somebody met it.

## The audit suite

Run everything at the end of a session. Five of these are ports of the harness
from the `wattsmith` repo; `meta-audit` is new and exists because Lighthouse
does not check the things that actually matter for titles.

```bash
npm run build
npx next start -p 3125          # the audits below read this server

npm run audit                   # links, redirects, orphans, soft 404s
npm run cta-audit               # conversion path present and launch-mode correct on every page
npm run voice-audit             # regulatory phrasing, guarantees, claim language, puffery
npm run link-map -- --baseline  # record the internal link map; --compare to diff
npm run meta-audit              # title/description length + uniqueness, H1s,
                                # canonicals, og:site_name, schema, post length
npm run placeholder-audit       # 555 numbers, TODOs, dollar amounts, em dashes, emoji,
                                # and any PE name, licence, or firm number not in
                                # src/config/credentials.ts
npm run seo-audit               # Lighthouse SEO category, asserts 100 everywhere

BASE_URL=http://localhost:3125 npm run contrast-audit   # axe WCAG A/AA at 390 and 1280
BASE_URL=http://localhost:3125 npm run mobile-audit     # 320/375/390/430, targets, drawer
npm run forms-audit             # every form, both launch modes, end to end
npm run email-audit             # every Resend template, rendered offline, no mail sent
```

`contrast-audit` and `mobile-audit` spawn their own `next dev` when `BASE_URL`
is unset. `next dev` writes `.next`, so the build guard refuses while a server
on `:3125` is serving out of it. That refusal is correct. Either stop the
server or point them at it, as above.

`npm run shots -- / /services/solar-structural-letters` writes screenshots at
390 and 1280 into `screenshots/`.

## The build guard

`npm run build` runs `scripts/preflight-build.mjs` first, every time, including
when a build is invoked from another script. It refuses to build while a server
is holding `.next`.

This is not caution. Overwriting `.next` under a running `next start` produces a
torn artifact: routes that 404 from a build that reported success, while a curl
smoke check against the still-running stale process answers 200. Two independent
signals agree that nothing is wrong, each reading a different half. Being
careful does not catch that.

`AUDIT_KILL_STALE=1 npm run build` has the guard clear the blockers first.

## Content rules the audits enforce

- No em dashes, no en dashes, no emoji. `placeholder-audit` fails the build.
- No dollar amounts anywhere until a price sheet exists. Same audit.
- No phone number until one is decided. Same audit.
- No review or rating schema until real reviews exist. `meta-audit` fails on it.
- No PE name, licence number, or firm registration number that is not listed in
  `src/config/credentials.ts`. All three lists are empty today, so any credential
  appearing anywhere fails the build. Publishing one is a deliberate edit to that
  file, never a side effect of writing copy.
- No outcome guarantees, no claim solicitation, no unsupportable superlatives.
  `voice-audit` owns these and deliberately does not re-check the mechanical
  rules above.
- Titles under 60 characters, descriptions under 155, both unique sitewide, one
  H1 per page, canonical pointing at itself. `meta-audit`, and `lib/seo.ts`
  throws in development before it ever reaches the audit.

## Deployment

Vercel, team `salon-envy`, auto deploy from `main`. DNS through Cloudflare, grey
cloud.

Open items requiring an owner decision are in [BACKLOG.md](./BACKLOG.md).
