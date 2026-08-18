/**
 * Measure the 25 city pages so the metro proposal argues from data rather than
 * from impression.
 *
 * Everything here is computed from this repo and from the link-map baseline.
 * No search volume, no difficulty, no competitor data: no Ahrefs call has been
 * authorised, and the proposal says plainly which questions that leaves open
 * rather than guessing at them.
 */
import fs from "node:fs";
import { CITIES } from "../src/data/cities.ts";
import { SERVICES } from "../src/data/services.ts";

const words = (s) => String(s).trim().split(/\s+/).filter(Boolean).length;

const baseline = JSON.parse(fs.readFileSync("audit/link-map.baseline.json", "utf8"));

const rows = CITIES.map((c) => {
  // Prose that is true of this market and nowhere else. Deliberately excludes
  // the shared template strings, which are identical on all 25 and would make
  // every page look equally deep.
  const localWords =
    words(c.lede) +
    c.local.reduce((n, p) => n + words(p), 0) +
    c.faqs.reduce((n, f) => n + words(f.q) + words(f.a), 0);

  // Verified primary-source facts carried on the page.
  const verifiedFacts = [
    c.permitOffice.name,
    c.permitOffice.note,
    c.permitOffice.submittal,
    c.wind.note,
    c.soil.note,
  ].filter(Boolean).length;

  const inbound = baseline.byRoute[`/texas/${c.slug}`]?.inbound ?? 0;

  // How many services name this city in their emphasisCities, which is a proxy
  // for how many distinct commercial intents this market actually serves.
  const emphasisedBy = SERVICES.filter((s) => (s.emphasisCities || []).includes(c.slug)).length;

  return {
    slug: c.slug,
    name: c.name,
    county: c.county,
    region: c.region,
    windstorm: c.windstormArea,
    localWords,
    verifiedFacts,
    inbound,
    emphasisedBy,
    services: c.emphasis.length,
  };
});

const fmt = (n, w) => String(n).padStart(w);
console.log(
  "slug".padEnd(16) +
    "region".padEnd(26) +
    "local".padStart(6) +
    "facts".padStart(6) +
    "inb".padStart(5) +
    "emph".padStart(6) +
    "  wpi8",
);
console.log("-".repeat(72));
for (const r of rows.slice().sort((a, b) => b.localWords - a.localWords)) {
  console.log(
    r.slug.padEnd(16) +
      r.region.padEnd(26) +
      fmt(r.localWords, 6) +
      fmt(r.verifiedFacts, 6) +
      fmt(r.inbound, 5) +
      fmt(r.emphasisedBy, 6) +
      (r.windstorm ? "   yes" : "    no"),
  );
}

const total = rows.reduce((n, r) => n + r.localWords, 0);
console.log(
  `\n25 cities, ${total} words of market-specific prose, ` +
    `median ${rows.map((r) => r.localWords).sort((a, b) => a - b)[12]}, ` +
    `range ${Math.min(...rows.map((r) => r.localWords))} to ${Math.max(...rows.map((r) => r.localWords))}.`,
);
console.log(`windstorm-area cities: ${rows.filter((r) => r.windstorm).length}`);
console.log(
  `emphasised by 6+ services: ${rows.filter((r) => r.emphasisedBy >= 6).map((r) => r.slug).join(", ") || "none"}`,
);
console.log(
  `emphasised by 0 services: ${rows.filter((r) => r.emphasisedBy === 0).map((r) => r.slug).join(", ") || "none"}`,
);
