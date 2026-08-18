// Cross brand keyword registry audit.
//
// The registry (src/data/keyword-registry.ts) is the single source of truth for
// which of the three brands owns which term. Playbook Part 2 rule 2: two brands
// never target the same primary keyword, ever.
//
// WHY THIS IS A GATE AND NOT A CHECKLIST
// --------------------------------------
// The cannibalization failure is invisible from inside one repo. Every page
// here renders, scores, and reads correctly; the damage happens in a search
// index comparing this site to two others nobody is looking at in this
// session. Google resolves the collision by picking one canonical winner and
// suppressing the rest, so the losing page is not merely wasted, it drags on
// the winner.
//
// So the check runs here, against rendered output, with the registry as the
// authority:
//
//   1. Every term this brand owns and marks live has a page that answers 200.
//   2. No page here targets a term the registry assigns to another brand.
//   3. Every indexable page is accounted for by a registry entry.
//
// Check 2 REPORTS rather than resolves. A collision is an operator decision
// across three repos, and a session that silently retargets a page to dodge an
// audit has made the problem worse and hidden it.
//
//   BASE_URL=http://localhost:3125 npm run registry-audit
import { registry, BRANDS } from "../src/data/keyword-registry.ts";

const BASE = process.env.BASE_URL || "http://localhost:3125";
const THIS_BRAND = "sealed";

const problems = [];
const notes = [];
const fail = (message) => problems.push(message);

async function get(path) {
  const res = await fetch(`${BASE}${path}`);
  return { status: res.status, html: res.ok ? await res.text() : "" };
}

const strip = (s) =>
  s
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

/** Normalised for phrase comparison: punctuation folded, spacing collapsed. */
const norm = (s) => strip(s).replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();

const sm = await get("/sitemap.xml");
if (sm.status !== 200) {
  console.error(`registry-audit: cannot read sitemap (status ${sm.status})`);
  process.exitCode = 1;
} else {
  const routes = [...sm.html.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (m) => m[1].replace(/^https:\/\/sealedengineering\.com/, "") || "/",
  );

  // ---- gather what each page actually targets --------------------------
  /** path -> { title, h1 } */
  const pages = new Map();
  for (const route of routes) {
    const { status, html } = await get(route);
    if (status !== 200) {
      fail(`${route}: in the sitemap but returned HTTP ${status}`);
      continue;
    }
    const title = (html.match(/<title>([^<]*)<\/title>/i) || [, ""])[1];
    const h1raw = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [, ""])[1];
    pages.set(route, { title: norm(title), h1: norm(h1raw) });
  }

  const ours = registry.filter((e) => e.owner === THIS_BRAND);
  const foreign = registry.filter((e) => e.owner !== THIS_BRAND);

  // ---- 1. owned and live means a page exists ---------------------------
  const expandable = (path) => !path || path.includes("{");
  for (const e of ours) {
    if (e.status === "planned") {
      notes.push(`planned, not yet built: "${e.keyword}"${e.path ? ` -> ${e.path}` : ""}`);
      continue;
    }
    if (expandable(e.path)) {
      // Pattern entries such as /texas/{city} are checked by the city count
      // below rather than as a single path.
      continue;
    }
    if (!pages.has(e.path)) {
      fail(
        `"${e.keyword}" is owned by this brand with status ${e.status} and path ${e.path}, ` +
          `but that path is not in the sitemap.`,
      );
    }
  }

  // The one pattern entry: every city named in its note must have a page.
  {
    const pattern = ours.find((e) => e.path && e.path.includes("{city}"));
    if (pattern) {
      const named = (pattern.note || "").match(/live:\s*([^.]+)\./);
      if (named) {
        const cities = named[1]
          .split(",")
          .map((c) => c.trim().toLowerCase().replace(/\s+/g, "-"))
          .filter(Boolean);
        const missing = cities.filter((c) => !pages.has(`/texas/${c}`));
        if (missing.length) {
          fail(`city pattern entry names ${cities.length} cities; missing pages: ${missing.join(", ")}`);
        } else {
          notes.push(`city pattern: all ${cities.length} named city pages present.`);
        }
      }
    }
  }

  // ---- 2. no page here targets another brand's term --------------------
  //
  // Scoped to <title> and <h1>. That is where targeting is declared. Scanning
  // body copy would flag every honest mention of the parent firm and turn this
  // gate into noise, which is how a gate stops being read.
  /**
   * Routes permitted to name another brand in their title.
   *
   * Playbook Part 2 rule 4 allows cross-linking between the brands "sparingly
   * and honestly, a part of the same family note where true". A routing stub
   * whose entire purpose is to send hiring traffic to the firm that does the
   * hiring has to be able to say whose firm it is. Naming a sibling brand while
   * handing traffic TO it is the opposite of competing for its term.
   *
   * Scoped to branded-kind entries only. If this page ever put an
   * institutional or transactional term belonging to another brand in its
   * title, that still fails.
   */
  const FAMILY_REFERENCE_OK = {
    "/careers": "Routing stub. It exists to send hiring traffic to 254 Engineering Services and must name them.",
  };

  for (const e of foreign) {
    const kw = norm(e.keyword);
    if (kw.includes("{")) continue;
    // Very short terms would match incidentally.
    if (kw.split(" ").length < 2) continue;
    for (const [route, { title, h1 }] of pages) {
      if (e.kind === "branded" && FAMILY_REFERENCE_OK[route]) continue;
      const inTitle = title.includes(kw);
      const inH1 = h1.includes(kw);
      if (!inTitle && !inH1) continue;
      fail(
        `COLLISION: ${route} targets "${e.keyword}" in its ${inTitle ? "title" : "h1"}, ` +
          `but the registry assigns that term to ${BRANDS[e.owner].name} (${BRANDS[e.owner].domain}).` +
          (e.note ? `\n      registry note: ${e.note.replace(/\s+/g, " ").slice(0, 220)}` : "") +
          `\n      This is an operator decision across repos. Do not retarget the page to silence this.`,
      );
    }
  }

  // ---- 2b. unresolved collisions the registry itself records -----------
  //
  // Check 2 only fires on an exact phrase match in a title or H1. The careers
  // collision did not match: the registry term was "field inspection technician
  // jobs texas" and this site was titled "Field Technician Jobs in Texas". One
  // word apart, and the audit would have reported clean on a collision the
  // registry documents in plain English two lines below the term. So any entry
  // whose note says COLLISION is surfaced until somebody removes the word.
  for (const e of registry) {
    if (!e.note || !/COLLISION/i.test(e.note)) continue;
    if (/RESOLVED/i.test(e.note)) continue;
    fail(
      `UNRESOLVED COLLISION recorded in the registry for "${e.keyword}" (owner ${e.owner}).\n` +
        `      ${e.note.replace(/\s+/g, " ").slice(0, 300)}\n` +
        `      Resolve it across repos and update the registry note, in that order.`,
    );
  }

  // ---- 3. every page is accounted for ----------------------------------
  const ownedPaths = new Set(ours.filter((e) => e.path && !expandable(e.path)).map((e) => e.path));
  // Pages that exist for users rather than for search, and are not expected to
  // carry a registry term.
  const NON_TARGETING = new Set([
    "/privacy",
    "/terms",
    "/waitlist",
    "/order",
    "/contact",
    "/careers",
    "/services",
    "/texas",
    "/industries",
    "/insights",
  ]);
  const unregistered = [...pages.keys()].filter(
    (p) => !ownedPaths.has(p) && !NON_TARGETING.has(p) && !p.startsWith("/texas/"),
  );
  if (unregistered.length) {
    for (const p of unregistered) {
      fail(`${p}: indexable but has no entry in the registry. Add one with an owner before it ships.`);
    }
  }

  // ---- report ----------------------------------------------------------
  console.log("=== KEYWORD REGISTRY AUDIT ===");
  console.log(`brand: ${BRANDS[THIS_BRAND].name} (${BRANDS[THIS_BRAND].domain})`);
  console.log(`owns: ${BRANDS[THIS_BRAND].owns}`);
  console.log(`does not own: ${BRANDS[THIS_BRAND].doesNotOwn}`);
  console.log(
    `\nregistry: ${registry.length} entries, ${ours.length} owned by this brand, ` +
      `${foreign.length} owned elsewhere. ${pages.size} pages checked.`,
  );

  if (notes.length) {
    console.log("\n-- notes");
    for (const n of notes) console.log(`   ${n}`);
  }

  if (problems.length === 0) {
    console.log("\nPASS: no cannibalization. Every owned term has a page, no page targets another brand's term.");
  } else {
    console.log(`\nFAIL: ${problems.length} problem(s):`);
    for (const p of problems) console.log(`  - ${p}`);
    process.exitCode = 1;
  }
}
