// Cross brand keyword registry audit, ported to the differentiation record.
//
// The registry (src/data/keyword-registry.ts) is synchronized verbatim from
// 254engineering. Until 2026-08-30 it was an ownership map, one keyword to one
// brand, and this audit enforced that map. The operator superseded the model
// that day: each brand writes on every service it performs, for its own buyer,
// and the registry records each brand's ANGLE on a topic rather than an owner.
//
// PORTED 2026-10-17 ON THE OPERATOR'S CONDITION THAT EVERY ASSERTION THE OLD
// AUDIT MADE STILL EXISTS, SAME OR STRICTER. Each check below carries the
// letter of the old check it replaces (S1 to S7) so the two can be read side by
// side. Where the new registry cannot support the old assertion in full, the
// check says so in its own output rather than passing quietly.
//
//   S1. The sitemap answers.
//   S2. Every sitemap route answers 200.
//   S3. Every topic this brand marks live with a path has that path in the
//       sitemap. STRICTER: a topic with status none may not carry a path.
//   S4. The city pages the registry claims are present. WEAKER ON IDENTITY: the
//       new registry states a COUNT of city pages and names none, so the count
//       is asserted and the names cannot be. A registry with no city claim for
//       this brand is a FAIL, never a skip.
//   S5. No page here targets, in its title or H1, a topic this brand has
//       declined (status none) or has no angle on while another brand does. The
//       old form was "a term the registry assigns to another brand"; nothing is
//       assigned to anybody now, so declining is the nearest fact the registry
//       holds. STRICTER: the /careers family exemption for branded terms is
//       gone, because the new registry has no branded kind.
//   S6. No unresolved COLLISION is recorded in the registry, in a topic note or
//       in any brand's angle.
//   S7. Every indexable page is accounted for by a path this brand claims in
//       the registry, apart from the same pages for users the old audit listed.
//
// Check S5 REPORTS rather than resolves. A conflict is an operator decision
// across three repos, and a session that silently retargets a page to dodge an
// audit has made the problem worse and hidden it.
//
//   BASE_URL=http://localhost:3125 npm run registry-audit
import { topics, BRANDS } from "../src/data/keyword-registry.ts";

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

const angleOf = (t) => t.angles[THIS_BRAND];
const isPattern = (path) => !path || path.includes("{");

// ---- S1. the sitemap answers ----------------------------------------------
const sm = await get("/sitemap.xml");
if (sm.status !== 200) {
  console.error(`registry-audit: cannot read sitemap (status ${sm.status})`);
  process.exitCode = 1;
} else {
  const routes = [...sm.html.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (m) => m[1].replace(/^https:\/\/sealedengineering\.com/, "") || "/",
  );

  // ---- S2. gather what each page actually targets ------------------------
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

  const ours = topics.filter((t) => angleOf(t));
  const declined = topics.filter(
    (t) => (angleOf(t)?.status === "none" || !angleOf(t)) && Object.values(t.angles).some((a) => a && a.status !== "none"),
  );

  // ---- S3. live with a path means the page exists -------------------------
  let liveWithPath = 0;
  let liveWithoutPath = 0;
  for (const t of ours) {
    const a = angleOf(t);
    if (a.status === "planned") {
      notes.push(`planned, not yet built: "${t.topic}"${a.path ? ` -> ${a.path}` : ""}`);
      continue;
    }
    if (a.status === "none") {
      if (a.path) fail(`"${t.topic}" is declined by this brand (status none) but carries path ${a.path}.`);
      continue;
    }
    if (!a.path) {
      liveWithoutPath++;
      continue;
    }
    if (isPattern(a.path)) continue;
    liveWithPath++;
    if (!pages.has(a.path)) {
      fail(`"${t.topic}" is live on this brand at path ${a.path}, but that path is not in the sitemap.`);
    }
  }
  notes.push(
    `S3 subject: ${liveWithPath} live topic(s) with a path checked against the sitemap; ` +
      `${liveWithoutPath} live topic(s) carry no path and so cannot be checked.`,
  );

  // ---- S4. the city pages the registry claims -----------------------------
  {
    const cityPages = [...pages.keys()].filter((p) => /^\/texas\/[^/]+$/.test(p));
    const pattern = ours.find((t) => angleOf(t).path && angleOf(t).path.includes("{city}"));
    const geo = ours.find((t) => t.cluster === "geo" && angleOf(t).status === "live");
    if (pattern) {
      fail(`"${pattern.topic}" carries a city pattern path, which this port has no reader for. Port the reader before trusting this audit.`);
    } else if (!geo) {
      fail(`the registry carries no live city geography for this brand, so the ${cityPages.length} /texas/ pages are claimed by nothing.`);
    } else {
      const stated = (angleOf(geo).angle.match(/\b(\d+) city pages\b/) || [])[1];
      if (!stated) {
        fail(`"${geo.topic}" states no count of city pages, so the ${cityPages.length} /texas/ pages cannot be checked against it.`);
      } else if (Number(stated) !== cityPages.length) {
        fail(`the registry says ${stated} city pages; the sitemap carries ${cityPages.length} under /texas/.`);
      } else {
        notes.push(
          `city geography: the registry states ${stated} city pages and the sitemap carries ${cityPages.length}. ` +
            `The registry names no cities, so WHICH pages they are is not checked.`,
        );
      }
    }
  }

  // ---- S5. no page here targets a topic this brand declined ---------------
  //
  // Scoped to <title> and <h1>. That is where targeting is declared. Scanning
  // body copy would flag every honest mention of the subject and turn this gate
  // into noise, which is how a gate stops being read.
  for (const t of declined) {
    const kw = norm(t.topic);
    if (kw.includes("{")) continue;
    // Very short terms would match incidentally.
    if (kw.split(" ").length < 2) continue;
    for (const [route, { title, h1 }] of pages) {
      const inTitle = title.includes(kw);
      const inH1 = h1.includes(kw);
      if (!inTitle && !inH1) continue;
      const others = Object.entries(t.angles)
        .filter(([b, a]) => b !== THIS_BRAND && a && a.status !== "none")
        .map(([b]) => BRANDS[b].name);
      fail(
        `DECLINED TOPIC: ${route} targets "${t.topic}" in its ${inTitle ? "title" : "h1"}, ` +
          `but the registry records no angle for this brand on it (written by ${others.join(", ")}).` +
          (angleOf(t)?.angle ? `\n      registry angle: ${angleOf(t).angle.replace(/\s+/g, " ").slice(0, 220)}` : "") +
          `\n      This is an operator decision across repos. Do not retarget the page to silence this.`,
      );
    }
  }
  notes.push(`S5 subject: ${declined.length} topic(s) this brand declined or has no angle on, across ${pages.size} pages.`);

  // ---- S6. unresolved collisions the registry itself records -------------
  for (const t of topics) {
    const texts = [t.note ?? "", ...Object.values(t.angles).map((a) => a?.angle ?? "")];
    for (const text of texts) {
      if (!/COLLISION/i.test(text)) continue;
      if (/RESOLVED/i.test(text)) continue;
      fail(
        `UNRESOLVED COLLISION recorded in the registry for "${t.topic}".\n` +
          `      ${text.replace(/\s+/g, " ").slice(0, 300)}\n` +
          `      Resolve it across repos and update the registry, in that order.`,
      );
    }
  }

  // ---- S7. every page is accounted for -----------------------------------
  const claimed = new Set(ours.map((t) => angleOf(t).path).filter((p) => p && !isPattern(p)));
  // Pages that exist for users rather than for search, and are not expected to
  // carry a registry topic. The same list the old audit carried, unchanged.
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
    (p) => !claimed.has(p) && !NON_TARGETING.has(p) && !p.startsWith("/texas/"),
  );
  for (const p of unregistered) {
    fail(`${p}: indexable but no registry topic claims it for this brand. Add the path to this brand's angle before it ships.`);
  }

  // ---- report ----------------------------------------------------------
  console.log("=== KEYWORD REGISTRY AUDIT ===");
  console.log(`brand: ${BRANDS[THIS_BRAND].name} (${BRANDS[THIS_BRAND].domain})`);
  console.log(`audience: ${BRANDS[THIS_BRAND].audience}`);
  console.log(`stance: ${BRANDS[THIS_BRAND].stance}`);
  console.log(
    `\nregistry: ${topics.length} topics, ${ours.length} with an angle for this brand, ` +
      `${claimed.size} path(s) claimed. ${pages.size} pages checked.`,
  );

  if (notes.length) {
    console.log("\n-- notes");
    for (const n of notes) console.log(`   ${n}`);
  }

  if (problems.length === 0) {
    console.log("\nPASS: every claimed page exists, every page is claimed, no page targets a declined topic.");
  } else {
    console.log(`\nFAIL: ${problems.length} problem(s):`);
    for (const p of problems) console.log(`  - ${p}`);
    process.exitCode = 1;
  }
}
