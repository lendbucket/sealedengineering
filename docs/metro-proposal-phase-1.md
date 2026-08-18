# Phase 1 report: the Texas metro layer

Report only. Nothing built, nothing changed, no Ahrefs call made.
Date: 2026-08-18. Author: build session. Decision required from the operator.

---

## What was asked, and why the answer inverts the question

The brief asked for "a proposal for which few metros earn real pages", on the
premise that this brand's geo layer should shrink to a handful of metros and
that any thin or doorway-pattern geo pages should be noindexed first.

That premise was attached to a positioning you have since confirmed as
misrouted. Under the split that actually stands, recorded in
`src/data/keyword-registry.ts`, this brand owns city level geo and 254 is
explicitly forbidden from building city pages. Shrinking here does not hand the
territory to a sibling. It vacates it.

So this report answers the question the measurement supports: **not which pages
to cut, but where to invest depth next.** The case for that follows.

---

## The doorway test, measured

The playbook's line (Part 3.2) is that every geo page must contain substantial
information true of that place specifically, which could not be produced by
find-and-replacing the place name. Measured across all 25 pages, counting only
market-specific prose and excluding every shared template string:

| Measure | Result |
| --- | --- |
| Market-specific words per page | **400 to 557**, median 443 |
| Total market-specific prose | 11,234 words |
| Verified primary-source facts per page | **5 of 5 on all 25** |
| Pages below any plausible thinness floor | **0** |

Every page carries a permit office verified against that city's own site with a
source URL and a verification date, a submittal fact unique to that jurisdiction,
a wind band with an exposure note, a soil series with a behaviour note, four
market-specific paragraphs, and three local FAQs.

The submittal facts alone defeat find-and-replace. Victoria makes one and two
family plan review **optional**, which is unusual in Texas. McAllen refuses a
permit application without a **recorded plat**. Amarillo rejects plans marked
"Not for Construction", which bears directly on sealed submittals. Round Rock
runs a **one permit system** requiring every subcontractor listed before
issuance. Odessa is on the **2018 IRC** while Harlingen is on the **2024**.

**Conclusion: no page in this layer fails the doorway test, and none should be
noindexed.** Recommending otherwise would mean deindexing verified primary
source research to satisfy a premise that no longer holds.

---

## Proposed tiers, for depth investment

Ranked on signals actually available in this repo: how many service pages name
the market in `emphasisCities` (a proxy for distinct commercial intents served),
editorial inbound links from the link map baseline, and whether the market sits
inside the TDI windstorm area, which the playbook notes creates a legitimately
different page template.

### Tier A, deepen first (4)

| City | Services emphasising | Inbound | Why |
| --- | --- | --- | --- |
| Houston | 10 | 16 | Every service names it. Uniquely, the TDI windstorm boundary runs **through** the county, so one market carries both templates. |
| San Antonio | 8 | 14 | Balcones Escarpment splits the metro's geology; large manufactured housing stock drives certification volume. |
| Dallas | 7 | 12 | Houston Black clay plus the hail corridor: two independent demand drivers. |
| Fort Worth | 5 | 10 | Eagle Ford shale behaves differently from Dallas clay, which is a real and under-written distinction. |

### Tier B, second wave (6)

Austin, Corpus Christi, Waco, El Paso, Round Rock, College Station.

Austin carries the highest inbound outside Tier A (11) and a demanding review.
Corpus Christi is the flagship windstorm market. **El Paso is the single most
defensible page in the entire portfolio**: the only Texas metro where seismic
design genuinely enters the criteria, and where the soil failure mode is
collapse under wetting rather than expansive swell. Nothing else in Texas
engineering content says that, and no sibling brand can say it either.

### Tier C, hold as written (15)

The remaining fifteen. Above the doorway line, verified, and earning their place.
No further investment until Tier A and B index and rank, per the playbook's
wave discipline.

---

## Two findings worth acting on independently of tiers

**1. San Angelo is emphasised by zero service pages.** Every other city is named
in at least one service page's `emphasisCities`. San Angelo is named by none,
which means no money page points at it and it receives no commercial-intent
internal link from the service layer. The page itself is fine, 428 words of
market-specific prose. This is a linking gap, not a content gap, and the fix is
one line in `src/data/services.ts` where it genuinely belongs. Foundation
inspection reports and manufactured home foundation certifications both fit the
market described on that page.

**2. The five windstorm cities are a cluster, not five pages.** Houston, Corpus
Christi, Brownsville, Beaumont, and Harlingen share a template the other twenty
cannot use, because WPI-8 applies to them and not to the rest of Texas. The
playbook calls this out as creating two legitimately different page types. That
cluster is the strongest content position this brand holds and is currently
served by one Insights post. It could carry considerably more.

---

## What this report cannot settle, and what it would cost

No Ahrefs call has been made or authorised. Three questions genuinely need it:

1. **Search volume for the city pattern.** Does "sealed engineering letters
   {city} tx" have real demand, or is the demand on service plus city crosses
   such as "roof certification letter Houston"?
2. **Whether service plus city combos earn existence.** Playbook 3.3 permits
   them **only** where search demand and unique substance both exist. Ten
   services times twenty five cities is 250 pages, which is the doorway trap
   the playbook names explicitly. This should not be built on intuition.
3. **Beatability per metro**, to order Tier A and B by winnability rather than
   by market size.

**Proposed call, for authorisation before it runs:** one batched
`keywords-explorer-matching-terms` request, minimal columns (keyword, volume,
difficulty), row limit capped, over roughly eight seed terms covering the city
pattern and the top service plus metro crosses. One call, one batch, Lite plan.
I will state the expected unit cost from the subscription endpoint before
executing, and will not call anything until you say so.

---

## Recommendation

1. **Noindex nothing.** The layer passes the doorway test on measurement.
2. **Adopt the tiers** for depth investment order.
3. **Fix the San Angelo linking gap**, a one line change.
4. **Authorise the single Ahrefs batch** before any combo pages are considered.
5. **Develop the windstorm cluster** as the strongest defensible position.

Nothing in this report has been implemented.
