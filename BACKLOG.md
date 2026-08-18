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
- [ ] **Tier 2 city pages.** Expand in waves only after Tier 1 indexes and
      ranks. The rule from the master prompt stands: a page that cannot say
      something true and specific about its market does not ship. Candidate
      next wave: Denton, Sugar Land, Conroe, New Braunfels, Temple, Longview,
      Texarkana, Del Rio, Eagle Pass, Big Spring.
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
