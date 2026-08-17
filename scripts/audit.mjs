// Link and route integrity crawl.
//
// Walks every internal link from the sitemap outward and asserts that nothing
// on this site points at a 404, that no page links to a redirect chain, and
// that the machine-readable surfaces answer. It is the cheap check that catches
// the expensive class of mistake: a typo in an href on a page nobody reviewed.
//
//   BASE_URL=http://localhost:3125 node scripts/audit.mjs
const BASE = process.env.BASE_URL || "http://localhost:3125";
const SITE_URL = "https://sealedengineering.com";

const problems = [];
const note = (message) => problems.push(message);

async function head(path) {
  // GET rather than HEAD: Next answers HEAD, but a redirect's Location header
  // and a 404's body both matter here, and one request that tells the whole
  // story beats two that each tell half.
  const res = await fetch(`${BASE}${path}`, { redirect: "manual" });
  return { status: res.status, location: res.headers.get("location"), res };
}

const sm = await fetch(`${BASE}/sitemap.xml`);
if (!sm.ok) {
  console.error(`audit: cannot read sitemap (status ${sm.status})`);
  process.exitCode = 1;
} else {
  const xml = await sm.text();
  const routes = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (m) => m[1].replace(SITE_URL, "") || "/",
  );

  const seen = new Set(routes);
  /** Every internal href found, mapped to the pages that contain it. */
  const links = new Map();

  for (const route of routes) {
    const res = await fetch(`${BASE}${route}`);
    if (!res.ok) {
      note(`${route}: HTTP ${res.status} (listed in the sitemap)`);
      continue;
    }
    const html = await res.text();
    for (const m of html.matchAll(/href="(\/[^"#?]*)"/g)) {
      const href = m[1].replace(/\/$/, "") || "/";
      if (href.startsWith("/_next")) continue;
      if (!links.has(href)) links.set(href, new Set());
      links.get(href).add(route);
    }
  }

  console.log("=== LINK AUDIT ===");
  console.log(`${routes.length} sitemap routes, ${links.size} distinct internal link targets`);

  for (const [href, sources] of links) {
    const { status, location } = await head(href);
    const from = [...sources].slice(0, 3).join(", ");
    if (status >= 400) {
      note(`${href}: HTTP ${status}, linked from ${from}`);
    } else if (status >= 300) {
      // A redirect reached by following a link on our own site is a link that
      // should have pointed at the destination. Costs a round trip for every
      // visitor and leaks a little authority on every crawl.
      note(`${href}: HTTP ${status} to ${location}, linked from ${from}`);
    }
  }

  // The machine-readable surfaces are not in the sitemap and are exactly where
  // a broken generator goes unnoticed.
  for (const path of ["/robots.txt", "/llms.txt", "/llms-full.txt", "/sitemap.xml", "/manifest.webmanifest", "/favicon.ico", "/opengraph-image"]) {
    const { status } = await head(path);
    if (status >= 300) note(`${path}: HTTP ${status}`);
  }

  // A 404 has to actually be a 404. A soft 404 answering 200 is how a typo'd
  // URL ends up indexed.
  const missing = await head("/this-route-does-not-exist");
  if (missing.status !== 404) note(`/this-route-does-not-exist: HTTP ${missing.status}, expected 404`);

  // Every sitemap route must be reachable from somewhere, or it is an orphan
  // that only a crawler reading the sitemap will ever find.
  const orphans = routes.filter((r) => r !== "/" && !links.has(r));
  for (const o of orphans) note(`${o}: in the sitemap but not linked from any page`);

  if (problems.length === 0) {
    console.log(`\nPASS: no broken links, no internal redirects, no orphans, 404 answers 404.`);
    console.log(`(checked ${seen.size} sitemap routes and ${links.size} link targets)`);
  } else {
    console.log(`\nFAIL: ${problems.length} problem(s):`);
    for (const p of problems) console.log(`  - ${p}`);
    process.exitCode = 1;
  }
}
