// Internal link map.
//
// Records, for every indexable page, which pages link to it and which pages it
// links out to. Writes a JSON baseline and prints a summary.
//
// WHY A BASELINE BEFORE ANY LINKING PASS
// --------------------------------------
// Contextual internal linking is the one optimisation where it is genuinely
// hard to tell afterwards whether anything happened. Links get added, the site
// feels more connected, and nobody can say whether the pages that needed
// inbound links actually got them or whether forty links piled onto the three
// pages that were already well connected.
//
// So: measure first, write the numbers down, and diff. Without the baseline the
// after-measurement is a number with nothing to compare it to.
//
// It also surfaces two things worth acting on independently of any pass:
// orphans, which no page links to, and dead ends, which link nowhere.
//
//   BASE_URL=http://localhost:3125 node scripts/link-map.mjs
//   BASE_URL=... node scripts/link-map.mjs --baseline     writes the baseline file
//   BASE_URL=... node scripts/link-map.mjs --compare      diffs against it
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.BASE_URL || "http://localhost:3125";
const SITE_URL = "https://sealedengineering.com";
const OUT_DIR = process.env.LINK_MAP_DIR || "audit";
const BASELINE = path.join(OUT_DIR, "link-map.baseline.json");

const writeBaseline = process.argv.includes("--baseline");
const compare = process.argv.includes("--compare");

async function get(p) {
  const res = await fetch(`${BASE}${p}`);
  return { status: res.status, html: await res.text() };
}

/**
 * Links inside <main> only.
 *
 * Header and footer links appear on every page and would swamp the counts:
 * every service page would show 54 inbound links and the measurement would say
 * nothing about editorial linking, which is the thing being managed. Chrome
 * links are counted separately so the number is visible rather than hidden.
 */
function mainOf(html) {
  const m = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  return m ? m[1] : "";
}

function internalHrefs(fragment) {
  const out = new Set();
  for (const m of fragment.matchAll(/href="(\/[^"#?]*)"/g)) {
    const href = m[1].replace(/\/$/, "") || "/";
    if (href.startsWith("/_next") || href.startsWith("/api")) continue;
    out.add(href);
  }
  return [...out];
}

/** Anchor text, so a linking pass can be checked for prose anchors later. */
function anchorsIn(fragment) {
  const out = [];
  for (const m of fragment.matchAll(/<a\b[^>]*href="(\/[^"#?]*)"[^>]*>([\s\S]*?)<\/a>/g)) {
    const href = m[1].replace(/\/$/, "") || "/";
    if (href.startsWith("/_next") || href.startsWith("/api")) continue;
    const text = m[2].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    if (text) out.push({ href, text });
  }
  return out;
}

const sm = await get("/sitemap.xml");
if (sm.status !== 200) {
  console.error(`link-map: cannot read sitemap (status ${sm.status})`);
  process.exitCode = 1;
} else {
  const routes = [...sm.html.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (m) => m[1].replace(SITE_URL, "") || "/",
  );

  /** route -> { outbound: [], inboundFrom: [], chromeOnly: number, anchors: [] } */
  const map = new Map(routes.map((r) => [r, { outbound: [], inboundFrom: [], anchors: [] }]));

  for (const route of routes) {
    const { status, html } = await get(route);
    if (status !== 200) continue;
    const main = mainOf(html);
    const outbound = internalHrefs(main).filter((h) => h !== route);
    map.get(route).outbound = outbound;
    map.get(route).anchors = anchorsIn(main);

    for (const target of outbound) {
      const entry = map.get(target);
      if (entry) entry.inboundFrom.push(route);
    }
  }

  const rows = routes.map((r) => ({
    route: r,
    inbound: map.get(r).inboundFrom.length,
    outbound: map.get(r).outbound.length,
  }));

  const orphans = rows.filter((r) => r.route !== "/" && r.inbound === 0);
  const deadEnds = rows.filter((r) => r.outbound === 0);
  const totalLinks = rows.reduce((n, r) => n + r.outbound, 0);

  const snapshot = {
    base: BASE,
    routes: routes.length,
    totalEditorialLinks: totalLinks,
    byRoute: Object.fromEntries(
      routes.map((r) => [
        r,
        {
          inbound: map.get(r).inboundFrom.length,
          outbound: map.get(r).outbound.length,
          inboundFrom: map.get(r).inboundFrom.slice().sort(),
        },
      ]),
    ),
  };

  console.log("=== LINK MAP ===");
  console.log(`${routes.length} routes, ${totalLinks} editorial links inside <main>`);
  console.log(
    `median inbound: ${
      rows
        .map((r) => r.inbound)
        .sort((a, b) => a - b)[Math.floor(rows.length / 2)]
    }, max inbound: ${Math.max(...rows.map((r) => r.inbound))}`,
  );

  console.log(`\n-- least linked to (bottom 10)`);
  for (const r of rows.slice().sort((a, b) => a.inbound - b.inbound).slice(0, 10)) {
    console.log(`   ${String(r.inbound).padStart(3)} inbound  ${r.route}`);
  }

  console.log(`\n-- most linked to (top 10)`);
  for (const r of rows.slice().sort((a, b) => b.inbound - a.inbound).slice(0, 10)) {
    console.log(`   ${String(r.inbound).padStart(3)} inbound  ${r.route}`);
  }

  if (orphans.length) {
    console.log(`\n-- orphans: ${orphans.length} route(s) with no editorial inbound link`);
    for (const o of orphans) console.log(`   ${o.route}`);
  }
  if (deadEnds.length) {
    console.log(`\n-- dead ends: ${deadEnds.length} route(s) linking nowhere from <main>`);
    for (const d of deadEnds) console.log(`   ${d.route}`);
  }

  if (writeBaseline) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
    fs.writeFileSync(BASELINE, JSON.stringify(snapshot, null, 2) + "\n");
    console.log(`\nbaseline written to ${BASELINE}`);
  } else if (compare) {
    if (!fs.existsSync(BASELINE)) {
      console.error(`\nlink-map: no baseline at ${BASELINE}. Run with --baseline first.`);
      process.exitCode = 1;
    } else {
      const before = JSON.parse(fs.readFileSync(BASELINE, "utf8"));
      console.log(`\n=== COMPARED TO BASELINE ===`);
      console.log(
        `editorial links: ${before.totalEditorialLinks} -> ${snapshot.totalEditorialLinks} ` +
          `(${snapshot.totalEditorialLinks - before.totalEditorialLinks >= 0 ? "+" : ""}` +
          `${snapshot.totalEditorialLinks - before.totalEditorialLinks})`,
      );
      const changed = [];
      for (const [route, now] of Object.entries(snapshot.byRoute)) {
        const then = before.byRoute[route];
        if (!then) {
          changed.push(`   NEW    ${route} (${now.inbound} inbound)`);
        } else if (then.inbound !== now.inbound) {
          changed.push(
            `   ${then.inbound} -> ${now.inbound}  ${route}`,
          );
        }
      }
      if (changed.length === 0) console.log("no inbound link counts changed.");
      else {
        console.log(`${changed.length} route(s) changed inbound count:`);
        for (const c of changed) console.log(c);
      }
    }
  } else {
    console.log(`\n(run with --baseline to record, --compare to diff)`);
  }
}
