# Backlog

Ordered by what blocks the site from being useful, not by effort.

## Blocked on an owner decision

These cannot be built around. Each one is a decision only Robert can make, and
each is currently represented in the code by a `null`, an empty string, or a
deliberate absence rather than by a plausible-looking placeholder. That is on
purpose: an invented value is invisible in review and ships.

- [ ] **Price sheet.** No dollar figure appears anywhere on the site. Every
      surface that would imply one says "flat rate" and routes to a quote or
      the waitlist. `scripts/placeholder-audit.mjs` fails the build on any
      currency-shaped string in rendered output, so this cannot be half-done.
      Unblocks: `offers` schema on service pages, a real pricing page, and
      removing the hedge from the CTA copy.
- [ ] **Public phone number, and whether to publish one at all.**
      `src/config/site.ts` carries `phone: null` and every consumer checks for
      it. The placeholder audit currently treats *any* ten-digit number in
      rendered output as a finding, since none is published. When a number is
      decided, change that rule to a comparison against the real one.
- [ ] **Logo files.** The wordmark in `src/components/brand/Wordmark.tsx` and
      the mark in `scripts/brand-rasters.mjs` are typographic placeholders.
      Replace both, then run `npm run brand-rasters` to regenerate the favicon
      set and `public/favicon.ico`.
- [ ] **DBA filing status for Sealed Engineering.** The footer asserts the
      brand-to-entity relationship on every page. That assertion should be
      backed by a filed assumed name certificate for 254 Engineering Services
      LLC.
- [ ] **TBPELS firm registration listing this assumed name.** The registration
      must cover the name the public sees. A registration that lists only the
      LLC while the site trades as Sealed Engineering is the gap most likely to
      draw a complaint.
- [ ] **Launch mode flip authorization.** `LAUNCH_MODE=live` plus a real
      `TBPELS_FIRM_NUMBER` activates ordering sitewide. Both modes are built and
      both are tested by `npm run forms-audit`. Nobody should flip this without
      the registration in hand; `src/config/launch.ts` degrades `live` back to
      `prelaunch` if the firm number is empty, which is a guard rail and not a
      substitute for the decision.

## Verify before launch

- [x] **Permit office names, all 25 cities. DONE 2026-08-17.** Every department
      name was verified against the city's own site. The source URL and the
      verification date are recorded in `permitOffice` in `src/data/cities.ts`,
      and each city page now publishes one verified local submittal fact with a
      citation. Six of the 25 were wrong and are corrected: Brownsville,
      Killeen, Waco, College Station, Harlingen, and Alice each named a body
      that either does not perform residential plan review or does not exist
      under that name. See the annual cadence item at the end of this file.
- [ ] **ASCE 7 wind bands.** The bands in `src/data/cities.ts` are planning
      context and every page says so. Confirm against the current adopted
      edition per jurisdiction.
- [ ] **`hello@sealedengineering.com` mailbox exists and is monitored.** The
      site publishes it and the placeholder audit enforces that no other domain
      appears. Also confirm the Resend sending domain is verified, or every
      notification silently fails to send while forms keep succeeding.
- [ ] **Supabase and Resend environment variables set in the Vercel project.**
      `src/lib/supabase.ts` throws rather than degrading if they are missing,
      so a form on production would error loudly rather than lose a lead. That
      is the correct failure and it is still a failure.

## Build next

- [ ] **Admin view for `eng_leads` and `eng_applications`.** Rows are being
      written and there is currently no way to read them except SQL. Not urgent
      in prelaunch, urgent the week ordering opens.
- [x] **Tier 2 city pages: CANCELLED PERMANENTLY 2026-08-18** on measured zero
      demand. The candidate wave list is withdrawn. The existing 25 stay as
      built; no new city page ships on this brand without new demand evidence.
      Full ruling below.
- [ ] **Per-service intake forms.** The waitlist collects a service slug today.
      In live mode each deliverable should ask for the evidence its own service
      page lists, rather than sharing one generic intake.
- [ ] **Promote the CSP from Report-Only to enforcing.** `next.config.ts` ships
      `Content-Security-Policy-Report-Only`. Wire a report endpoint, watch it
      for a week, then promote.
- [ ] **`engineersealed.com` 301 to `sealedengineering.com`,** if the domain is
      owned. Not yet configured.
- [ ] **Real reviews, then review schema.** `src/lib/schema.ts` deliberately
      emits no `AggregateRating` or `Review`, and `scripts/meta-audit.mjs` fails
      the build if any appears. Revisit only when real reviews exist.

## Known gaps in the audit suite

- [ ] **No Lighthouse performance gate.** `npm run seo-audit` runs the SEO
      category only. Performance is worth measuring and was left out
      deliberately: a flaky number in a blocking gate is how a suite becomes
      something people skip. Add it as a separate, non-blocking report.
- [ ] **`npm run contrast-audit` and `npm run mobile-audit` cannot spawn their
      own server while `:3125` is up.** Both write `.next` via `next dev`, so
      the build guard correctly refuses. Run them with
      `BASE_URL=http://localhost:3125` against the running server, or stop it
      first. This is working as designed and is written down because the error
      message reads like a failure the first time you see it.

## Registry and playbook synchronization

- [ ] **`TEXAS_ENGINEERING_DOMINANCE.md` is not in the repo.** The upgrade brief
      referenced it as provided; it was not, and it is not present in any
      sibling repo. Everything gated on it is unstarted: the CLAUDE.md rewrite
      that makes it standing law, the exact rule list for
      `scripts/voice-audit.mjs` (Part 4 item 3 and the Part 1 regulatory phrase
      check), and the county cross-reference rule (Part 2 rule 4). The voice
      audit currently enforces rules derived from the compliance section of
      `WEBSITE_MASTER_PROMPT.md`, which is in the repo. **Reconcile that rule
      list against the playbook when it lands.**
- [ ] **`src/data/keyword-registry.ts` has not arrived from the 254 repo.**
      The 254 repo has no `src/data` directory yet. Nothing was improvised in
      its place. Blocked on it: verifying all 54 existing pages against the
      registry, the cannibalization checks, the Tier 2 city proposal, and the
      whole content phase.
- [ ] **Registry synchronization rule.** Once installed, the registry is the
      single source of ownership for every term. This site owns commercial
      intent service terms, city level geo, and homeowner education clusters.
      It does not own institutional firm terms, county level geo (254 owns
      counties), or contractor direct response stamp terms (stampmyplans).
      Any page whose target term is not clearly owned here is reported as a
      conflict rather than resolved locally, and no page ships against a term
      the registry assigns elsewhere. Re-verify on every registry update, and
      treat a registry change as a content change: re-run `meta-audit` and
      `link-map --compare` after it.
- [ ] **No Ahrefs calls have been made.** The operator has not authorized any
      for this session. Tier 2 selection and content phase 1 both require one
      small batched pull with the cost stated first.

## Standing verification cadence

- [ ] **Permit offices, re-verify annually.** All 25 were verified against each
      city's official site on 2026-08-17 and the source URL is recorded in
      `permitOffice.source` in `src/data/cities.ts`, with the date in
      `permitOffice.verified`. Re-verification is now a diff against those URLs
      rather than a research project. Municipalities reorganize: six of the 25
      were already wrong at first build.

## Source standard applied to service pages, 2026-08-17

Section 3 of the upgrade brief. Every technical claim on the ten service pages
was checked against a primary source. What changed:

- [x] **WPI-8 was materially wrong and is corrected.** The pages described one
      "engineer path" as an alternative to filing a WPI-1. TDI actually runs two
      separate processes. Ongoing construction: Form WPI-1 before work starts,
      inspections during the work by a TDI inspector or an **appointed**
      engineer, WPI-2-BC forms, WPI-8 certificate. Completed construction: **any**
      TBPELS licensed engineer may inspect, Form **WPI-2E** with a sealed
      post-construction report, **WPI-8E** certificate. WPI-8C was a TWIA
      certificate issued only between 2017-01-01 and 2020-05-31. All of this is
      now stated correctly on the service page and in the Insights post.
- [x] **Harris County boundary corrected.** The copy named Kemah, which is in
      Galveston County, and Baytown, which TDI does not list. Both were inferred
      from a road on a map. TDI's own wording is "parts of Harris County east of
      Highway 146", naming La Porte, Morgan's Point, Pasadena, Seabrook, and
      Shoreacres. Corrected in three places.
- [x] **HUD standard named precisely.** HUD publishes the September 1996
      Permanent Foundations Guide as HUD-7584 and cites it as HUD-4930.3G. Both
      designations are HUD's own and both are now given. HUD's requirement that
      the certifier be licensed **in the state where the home is located** is now
      quoted rather than asserted as our own view.
- [x] **VA and USDA claims restated.** The pages asserted that VA carries "an
      equivalent requirement in its own lender handbook" and that USDA programs
      "generally do as well". Neither could be traced to a VA or USDA primary
      source: Circular 26-18-7 does not address manufactured home foundations,
      and the Chapter 12 MPR document redirects to a portal that could not be
      read. The copy now says what is verified, that HUD's guide is the standard,
      and attributes the instruction to obtain a certification to the lender's
      written condition.
- [x] **Texas Section ASCE guidelines named with version.** Now cited as
      Guidelines for the Evaluation and Repair of Residential Foundations,
      adopted 2002, Version 3 adopted March 2022.
- [x] **The three to five psf array dead load was removed.** A working rule of
      thumb, not a published figure. The copy now says the number is taken from
      the module and racking cut sheets for the system being installed, which is
      both accurate and more useful.

Source URLs are recorded in the header comment of `src/data/services.ts`.

- [ ] **Still unverified, and currently stated generally rather than removed:**
      the ASCE 7 wind bands in `src/data/cities.ts`. Every page says they are
      planning context and that the sealed value is looked up per address, so
      nothing turns on them, but they should be checked against the adopted
      edition per jurisdiction before anyone treats them as design input.

## Playbook reconciliation, 2026-08-17

`TEXAS_ENGINEERING_DOMINANCE.md` is now in the repo and `CLAUDE.md` is rewritten
from it as standing law. What changed, and what did not.

### Closed by the playbook arriving

- [x] **voice-audit rule list reconciled.** The derived list has been replaced by
      the playbook's Part 4 item 3 list verbatim (unlock, elevate, seamless,
      journey, empower, passionate, top-notch, hassle-free, one-stop,
      cutting-edge, state-of-the-art, look no further, in today's, when it comes
      to, we've got you covered, rest assured, not only X but also Y), plus the
      four structural tells and the Part 1 regulatory checks. It lives in
      `scripts/lib/voice-blocklist.mjs` and is now SHARED with `email-audit`, as
      Part 4 item 3 requires.
- [x] **Registry installed and verified.** `src/data/keyword-registry.ts` copied
      from the 254 repo. `npm run registry-audit` checks all 54 pages: every
      owned term has a page, no page targets another brand's term, every page is
      accounted for. Passes.
- [x] **Careers collision actioned.** `/careers` is now a routing stub to
      254engineering.com/careers, retitled off the field technician jobs term,
      with the application form and its server action removed.
- [x] **Sitemap lastModified fixed.** It emitted `new Date()` on all 54 entries,
      which is the build timestamp Part 3.4 explicitly forbids. Only the Insights
      posts carry a real date, so only they carry the field now.
- [x] **Hyphen as a sentence connector** is now checked (Part 6 style law). It
      had no home before the playbook arrived.

### Differences reported rather than resolved

- [ ] **METADATA LENGTH FLOORS. OPERATOR DECISION NEEDED.**
      `WEBSITE_MASTER_PROMPT.md` section 4 specifies titles "under 60 characters"
      and descriptions "under 155", with no floor. Playbook Part 3.4 specifies
      **50 to 60** and **140 to 160**. This site was built to the first and
      measures against the second as follows:
      **50 of 54 titles are under 50 characters. 25 of 54 descriptions are under
      140.** The caps were aligned to the playbook (155 raised to 160) and still
      fail the run. The floors are reported by `meta-audit` as warnings and do
      NOT fail it, because rewriting 75 operator-facing strings to settle a
      conflict between two operator documents is not a call this session should
      make silently. Decide the standard and the rewrite is mechanical.

- [ ] **REGISTRY DIVERGENCE. MUST BE COPIED BACK TO 254.**
      The careers entry note in `src/data/keyword-registry.ts` was edited here to
      record the collision as resolved on the sealed side. The registry header
      states the 254 repo is the source of truth and that editing a copy creates
      a divergence until copied. **Copy this file's careers note back to
      254engineering's `data/keyword-registry.ts`.** Until that happens the two
      repos disagree about whether the collision is open.

### Still open against the playbook

- [ ] **www to apex 308 redirect at the platform level** (Part 3.4). Not
      configured. Vercel domain settings, not a code change.
- [ ] **Search Console property, sitemap submission** (Part 3.4 and Part 7 item
      7). Not done.
- [ ] **og:url and canonical verified against the LIVE domain after deploy**
      (Part 3.4). Every audit here measures localhost. The post-deploy check
      against the real host has not been run.
- [ ] **No-hover-dependence check** (Part 6). `mobile-audit` asserts 44px targets
      but does not yet assert that nothing is reachable only on hover.
- [ ] **Anchor discipline in the linking law** (Part 5.3). `link-map` records
      anchors per target but does not yet fail on "click here", "learn more", or
      an anchor phrase repeated more than twice at the same target. Add before
      the first contextual linking pass, which is when it starts to matter.
- [ ] **Design register review** (Part 6). The playbook calls for white-dominant
      and extremely corporate with a distinct register per brand. This site is
      paper-and-seal-green, which is restrained but not white-dominant, and it
      was approved by the operator on screenshots before the playbook arrived.
      Worth an explicit confirmation that it still reads as intended alongside
      the other two brands.

## Fabrication sweep, 2026-08-18: clean

Run against source and all 56 rendered surfaces (54 sitemap routes plus
`/llms.txt` and `/llms-full.txt`) in response to an operator brief listing
specific fabricated elements to remove. **None of them exist in this repo, and
none ever have.**

Searched for and not found: testimonials or quote attributions, star and review
counts including the "150+ five-star reviews" claim, `AggregateRating` / `Review`
/ `Rating` schema, firm registration number 19245 or any other, "Licensed and
Insured" or "bonded", invented project or client counts, years-in-business
claims, and turnaround guarantees.

This is enforced rather than fortunate, and the enforcement is what should be
maintained:

- `placeholder-audit` fails the build on any PE name, licence number, or firm
  registration number absent from `src/config/credentials.ts`. All three lists
  are empty, so any credential anywhere fails.
- `meta-audit` fails on any `AggregateRating` or `Review` node. **The hasReviews
  false pattern is permanent until real third-party reviews exist.**
- `voice-audit` fails on turnaround promises, outcome guarantees, and puffery.
- No dollar figure may appear until a price sheet exists.

No branch survives this sweep because there was nothing to change. A permanent
standalone sweep script was considered and not added: the three audits above
already cover every pattern it looked for, and a fourth script duplicating them
would be a second place to maintain the same rules.

## Brief routing incident, 2026-08-18

An operator brief arrived instructing this repo to remove fabricated elements
that do not exist here, and to invert the brand positioning: Sealed to
contractor-facing plan stamping, StampMyPlans to homeowner. Both were queried
before any action and the operator confirmed **the registry stands and the brief
was misrouted**.

Recorded so a future session does not re-litigate it:

- **Sealed Engineering remains the homeowner and ordering-party brand.** It owns
  transactional service terms, city level geo, and homeowner education.
  StampMyPlans owns contractor plan stamping process, speed, and volume terms,
  and owns no geo. 254 owns institutional terms, county geo, and careers.
- **The 25 city pages stay indexed.** They are not doorway pages: each carries a
  permit office verified against the city's own site with a source URL and date,
  a distinct local submittal fact, wind band, soil, four market-specific
  paragraphs, and three local FAQs. There are no county pages in this repo, and
  the registry forbids 254 from building city pages, so deindexing these would
  leave Texas city geo unowned across the whole portfolio.
- Nothing was noindexed and no positioning was changed.

- [ ] **REGISTRY SOURCE OF TRUTH IS MISLABELLED.** The header of
      `src/data/keyword-registry.ts` states the 254 repo holds the master copy.
      As of 2026-08-18 the 254 repo has **no** registry file; the only other copy
      is `stampmyplans/data/keyword-registry.ts`, which is byte-identical to this
      one except for the careers note. Designate the real source of truth, fix
      the header in every copy, and copy this repo's resolved careers note into
      it. Until then the divergence declared in the previous session is still
      open and pointing at a repo that does not have the file.

## Rulings executed, 2026-08-18

- [x] **Registry: unqualified national forms are now the primary targets.**
      `manufactured home foundation certification` (50/mo, KD 8) and
      `wpi-8 windstorm certification` are registered to this brand as primary,
      with the Texas-qualified forms retained as secondary variants on the same
      URLs rather than deleted, because deleting them would erase the record of
      the concession from 254. Edited in the 254 repo as the source of truth and
      synced here. The pages remain Texas-specific throughout.
- [x] **Lookup-intent page built.** `/insights/how-to-look-up-a-texas-windstorm-certificate`,
      1,616 words, verified against TDI's own pages. Terms registered before
      writing, per registry law.
- [x] **TIER 2 CITY EXPANSION IS CANCELLED PERMANENTLY.** Ruled 2026-08-18 on the
      measured zero from the authorised keyword batch: no Texas city-crossed
      engineering term returned any volume, and the Texas qualifier measured
      lower than the unqualified form on both money terms. The existing 25 city
      pages **stay as built**: they carry verified primary-source substance,
      they cost nothing to keep, and the registry forbids 254 from building city
      pages so deindexing them would vacate the territory. **No new city page
      ships on this brand without new demand evidence.** The candidate Tier 2
      list previously in this file is withdrawn.
- [x] **Phase 2 content proposal written** and awaiting approval:
      `docs/content-proposal-phase-2.md`. Eight pieces, both measured clusters,
      two of them depth on existing pages rather than new URLs.

## Regulatory library, adopted 2026-08-18

`scripts/lib/regulatory.mjs` is copied verbatim from the 254 repo and is a
SYNCHRONIZED file. The local `REGULATORY_RULES` and `CLAIM_RULES` in
`voice-blocklist.mjs` are deleted; `voice-audit` and `email-audit` both import
from the shared module now.

**It found a real compliance failure on this site immediately.** The chrome said,
on every page, that documents are "reviewed and sealed by a licensed Texas
Professional Engineer". Present tense, passive voice, and no PE is hired. It
survived months of an active-voice-only check because it contains none of the
words that check looks for, which is exactly the lesson the shared module was
written to encode.

Fixed by making the phrasing a gate-aware constant, `SEALING_PHRASE` in
`src/config/launch.ts`, used by the layout metadata, Organization schema,
footer, og image, and both llms files. The day the PE is hired is now a one line
change rather than a sweep. Four city descriptions, the lenders description, and
one service lede were reworded gate-neutral instead, since they are static
strings in data files.

- [ ] **Two divergences to copy back to 254.** The registry entries for the two
      lookup-intent terms were added to 254's working tree and are not yet on its
      main. If `regulatory.mjs` gains patterns here, it must be copied back too.
- [ ] **Correction to an earlier entry in this file:** a previous session recorded
      that the 254 repo had no registry file. That was wrong. It is at
      `254engineering/data/keyword-registry.ts`, on main, and is the source of
      truth. The earlier "source of truth is mislabelled" item is withdrawn.
