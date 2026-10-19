@AGENTS.md

# Standing law for sealedengineering.com

Derived from `TEXAS_ENGINEERING_DOMINANCE.md`, which is the portfolio playbook
and outranks this file wherever they differ. Read the playbook in full before
writing anything. `WEBSITE_MASTER_PROMPT.md` is the original brief for this
site; where it and the playbook conflict, the conflict is reported to the
operator rather than resolved locally, and the open ones are listed in
`BACKLOG.md`.

## 1. This brand, and what it may not touch

Sealed Engineering is the **homeowner and ordering-party brand**: somebody who
needs one specific document. It is a brand of 254 Engineering LLC and
holds no license of its own. (It said "254 Engineering Services LLC" until
2026-10-19; no such entity exists. Operator ruling that day.)

| Owns | Does not own |
| --- | --- |
| Transactional service terms | Firm level institutional terms |
| City level geo (`/texas/[city]`) | County level geo, which is 254's |
| Homeowner and ordering-party education | Government and municipal content |
| | Careers, which route to 254 |
| | Contractor direct response stamping, which is StampMyPlans |

`src/data/keyword-registry.ts` is the authority, not this table. It is a
**synchronized file**: the source of truth lives in the 254 repo, and editing it
here creates a divergence that must be copied back. Before writing any page or
post, look the term up. If it is absent, add it there first with an owner. If it
belongs to another brand, this brand does not target it. Two brands never target
the same primary keyword, ever. `npm run registry-audit` enforces this and
reports collisions rather than resolving them.

## 2. The regulatory gate comes before everything

**TBPELS issued F-29811 on 2026-09-10 and reissued it to 254 Engineering LLC
on 2026-09-21.** Since 2026-10-19 the footer, contact, terms and waitlist pages
state the registration through `registrationStatement()` in
`src/config/firm-registration.ts`, in both modes, and no page says it is
pending. The gate below is still the law for this brand while
`LAUNCH_MODE=prelaunch`: the brand does not take orders, and that is a fact
about the brand rather than about the registration. While prelaunch:

- Nothing states or implies that engineering services are currently offered or
  performed. `LAUNCH_MODE=prelaunch` drives this from `src/config/launch.ts`.
- No "our engineers" plural, no turnaround promises for sealed work, no claim
  that stamped deliverables are available.
- No PE name, license number, or firm registration number appears anywhere
  unless it is in `src/config/credentials.ts`. All three lists are empty.
  `npm run placeholder-audit` fails the build on any credential that is not.
- `live` with an empty `TBPELS_FIRM_NUMBER` degrades back to `prelaunch`, and
  `src/instrumentation.ts` refuses to boot a server whose launch mode does not
  match the build's. Failing shut is the only safe direction for a licensure
  disclosure.

## 3. Content gates, absolute

- **Every technical claim is verified against a primary source while writing**,
  or stated generally without invented specifics. A commonly repeated number
  that cannot be traced is named as unverifiable rather than repeated. Source
  URLs go in the data file's header comment; see `src/data/services.ts`.
- **Zero invented statistics, anecdotes, client stories, project examples, or
  costs.** No dollar figure appears anywhere until a price sheet exists.
- **No review or rating schema** until real third-party reviews exist.
- **Geo pages must say something true of that place specifically** which could
  not be produced by find-and-replacing the name. A city page that cannot does
  not ship. `src/data/cities.ts` records a verified permit office, a source URL,
  and a verification date per city.
- Style laws on every rendered string: no em dashes, no en dashes, no hyphens as
  sentence connectors, no emoji, no banned phrases, nothing fabricated.
- Posts clear 1200 words, measured from the rendered article by `meta-audit`.

## 4. Two-phase content discipline

Research, propose, **stop for operator approval**, then write. The proposal
carries: title, primary and secondary keywords, volume and difficulty, what
ranks today and why it is beatable, a cannibalization check against every page
here and against the registry, and the internal link plan per post. No Ahrefs
call without stating the expected cost first and having it authorized.

## 5. The audit suite is the quality floor

Ten gates. Run all of them before any completion report, and verify any new one
by injecting a violation and watching it fail before trusting a green.

```
npm run build && npx next start -p 3125

npm run audit             links, redirects, orphans, soft 404s
npm run meta-audit        titles, descriptions, H1s, canonicals, og, schema, post length
npm run registry-audit    cross brand cannibalization
npm run placeholder-audit fabrications, currency, credentials, dashes, emoji
npm run voice-audit       banned phrases, regulatory claims, structural tells
npm run cta-audit         conversion path present and launch-mode correct
npm run seo-audit         Lighthouse SEO, asserts 100
npm run email-audit       every Resend template, offline
npm run link-map -- --baseline   internal link map

BASE_URL=http://localhost:3125 npm run contrast-audit
BASE_URL=http://localhost:3125 npm run mobile-audit
npm run forms-audit
```

`contrast-audit` and `mobile-audit` spawn `next dev`, which writes `.next`, so
the build guard correctly refuses while `:3125` is serving. Point them at it.

**The build race guard runs on every build.** Never bypass it.

## 6. Session mechanics

- Feature branches. No force pushes. Merge only on the operator's word.
- Report and stop at every workstream end. Screenshots at 390 and 1280,
  self-reviewed, before reporting.
- Completion claims verified from disk and from a running app.
- Judgment calls disclosed, not buried.
- **A completion report that is not true is the one unforgivable failure.** If
  something is unverified, say so. If an audit was not run, say that.
