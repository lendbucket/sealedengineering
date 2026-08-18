# Phase 1 report: keyword batch results

Date: 2026-08-18. One Ahrefs call, authorised in advance.
**Estimated 2,000 units, actual 1,680.** 80 rows at 21 units per row; the query
returned 80 of the 100 row cap. Lite plan, workspace usage now 19,023 of
100,000, resetting 2026-08-31.

Call: `keywords-explorer-matching-terms`, country US, `select`
`keyword,volume,difficulty`, eight seeds, `match_mode: terms`, `limit: 100`,
ordered by volume descending.

---

## The three questions, answered

### 1. Does the city pattern have demand? No.

Two of the eight seeds were city-crossed on purpose: `structural engineer letter
houston` and `foundation certification dallas`. Between them they returned **not
one Texas city-crossed engineering keyword with any measured volume.**

The only rows containing a Texas city name are `itil foundation certification
dallas` and `istqb certification foundation level test in dallas`, both at or
near zero, and both IT training courses that have nothing to do with this
business.

Also telling: `manufactured home foundation certification` carries **50/mo**
while `manufactured home foundation certification texas` measures **0**. The
qualifier subtracts rather than adds.

### 2. Do service plus city combos earn existence? No. The default stands.

The playbook permits combos only where search demand **and** unique substance
both exist. Unique substance exists here; demand does not appear at all. Ten
services times twenty five cities would be 250 pages built against measured zero,
which is the doorway trap the playbook names by name.

**Recommendation: do not build combo pages.** Revisit only if Search Console
impressions later show city-crossed queries this dataset cannot see.

### 3. Beatability ordering? Not answerable as asked, and the reason matters.

Metro ordering by winnability cannot be computed, because no metro term has
volume to win. The question dissolves rather than resolves.

What the data does say about difficulty is worth more: **every keyword with a
measured KD came in between 2 and 9.** The space is effectively uncontested. The
constraint on this business is not competition, it is that the head terms are
small.

---

## What actually has volume

| Keyword | Vol/mo | KD |
| --- | --- | --- |
| texas windstorm wpi-8 certificate search | 80 | 9 |
| manufactured home foundation certification | 50 | 8 |
| foundation certification manufactured home | 30 | null |
| wpi-8 windstorm certificate search | 30 | 2 |
| hud manufactured home foundation certification | 20 | null |
| six further variants at 10 each | 10 | 2 or null |

Two clusters carry essentially all measurable demand: **WPI-8 windstorm** and
**manufactured home foundation certification**. Both are already service pages
here, both were corrected to primary sources yesterday, and both are among the
best-sourced pages on the site.

### The intent finding, which changes what to write

The highest volume term is `texas windstorm wpi-8 certificate **search**`. That
word is doing a lot of work. Those people are not hiring an engineer. They are
trying to **look up whether a certificate already exists** on a property, which
is a lookup TDI provides.

That is not a reason to ignore the term. It is a reason to serve it honestly:
explain how to search TDI's system, what the result means, and what the options
are when the search comes back empty, which is precisely the moment somebody
needs an engineer. Answering the navigational question earns the commercial one.
Writing a sales page against that query would deserve to lose to TDI, and would.

---

## Limits of this data, stated plainly

- **80 rows shaped by eight seeds.** A different seed set returns a different
  picture. This is a probe, not a census.
- **Ahrefs under-reports very low volume terms.** A 0 here means below the
  reporting threshold, not that nobody searches. For a business whose entire
  market is small and high intent, that caveat is load bearing, and it is the
  main reason the combo recommendation is "do not build" rather than "the demand
  is proven absent".
- **No SERP or competitor data was pulled.** "What ranks today and why it is
  beatable" is therefore answered by KD alone. A serp-overview call would settle
  it properly and has not been authorised or made.
- Difficulty is null on most rows, which is normal for low volume terms.

---

## What this changes

1. **No combo pages.** Confirmed by data, matching the standing default.
2. **No further geo expansion.** The Tier A and B ordering in
   `metro-proposal-phase-1.md` should be read as depth investment in pages that
   already exist, not as a case for more of them. The 25 stay, verified and
   useful, earning long-tail and topical coverage rather than head terms.
3. **Depth belongs in the service and education layer**, specifically the WPI-8
   and manufactured home foundation clusters, which is where all measurable
   demand sits and where difficulty is lowest.
4. **The certificate-search intent deserves its own treatment** inside the WPI-8
   cluster.

- [ ] **Registry question for the operator, not actioned here.** The registry
      assigns this brand `manufactured home foundation certification texas`
      (0 volume) and `wpi-8 windstorm certification texas`. The volume sits on
      the **unqualified** national forms (50 and 80). The Texas qualifier is
      honest positioning and appears to cost measured demand. Changing a
      registry entry is a cross-repo decision, so it is reported rather than
      made.
