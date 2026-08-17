// Metadata and schema audit.
//
// The master prompt names SEO metadata and page titles as the single highest
// priority on this build, and Lighthouse does not check the things that
// actually matter for that. Lighthouse asks whether a title exists. It does not
// ask whether the title is unique across fifty pages, whether it is under 60
// characters, whether the canonical points at the page it is on, or whether
// og:site_name says the brand rather than the LLC.
//
// Those four are exactly the failures that are invisible in review and
// expensive in a crawl three weeks later, so they get their own gate.
//
//   BASE_URL=http://localhost:3125 node scripts/meta-audit.mjs
const BASE = process.env.BASE_URL || "http://localhost:3125";
const SITE_URL = "https://sealedengineering.com";
const BRAND = "Sealed Engineering";
const TITLE_MAX = 60;
const DESCRIPTION_MAX = 155;
/** Every Insights post must clear this. Stated in the master prompt. */
const POST_MIN_WORDS = 1200;

const problems = [];
const note = (route, message) => problems.push({ route, message });

async function get(path) {
  const res = await fetch(`${BASE}${path}`);
  return { status: res.status, html: await res.text() };
}

const pick = (html, re) => {
  const m = html.match(re);
  return m ? m[1] : null;
};

const decode = (s) =>
  s
    ? s
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#x27;|&#39;/g, "'")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
    : s;

const meta = (html, name) =>
  decode(
    pick(html, new RegExp(`<meta[^>]+(?:name|property)="${name}"[^>]*content="([^"]*)"`, "i")) ||
      pick(html, new RegExp(`<meta[^>]+content="([^"]*)"[^>]*(?:name|property)="${name}"`, "i")),
  );

function textOf(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function jsonLdTypes(html) {
  const types = new Set();
  for (const m of html.matchAll(
    /<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi,
  )) {
    try {
      const parsed = JSON.parse(m[1]);
      const nodes = parsed["@graph"] || [parsed];
      for (const n of nodes) if (n && n["@type"]) types.add(n["@type"]);
    } catch (err) {
      types.add(`UNPARSEABLE: ${String(err.message).split("\n")[0]}`);
    }
  }
  return types;
}

const sm = await get("/sitemap.xml");
if (sm.status !== 200) {
  console.error(`meta-audit: cannot read sitemap (status ${sm.status})`);
  process.exitCode = 1;
} else {
  const routes = [...sm.html.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (m) => m[1].replace(SITE_URL, "") || "/",
  );

  if (routes.length === 0) {
    console.error("meta-audit: sitemap contained no URLs; refusing to pass on zero routes");
    process.exitCode = 1;
  } else {
    const titles = new Map();
    const descriptions = new Map();
    const h1s = new Map();
    let scanned = 0;

    for (const route of routes) {
      const { status, html } = await get(route);
      if (status !== 200) {
        note(route, `unreachable: HTTP ${status}`);
        continue;
      }
      scanned++;

      // ---- title ----
      const title = decode(pick(html, /<title>([^<]*)<\/title>/i));
      if (!title) note(route, "no <title>");
      else {
        if (title.length > TITLE_MAX) note(route, `title is ${title.length} chars: ${JSON.stringify(title)}`);
        const prior = titles.get(title);
        if (prior) note(route, `title duplicates ${prior}: ${JSON.stringify(title)}`);
        else titles.set(title, route);
      }

      // ---- description ----
      const description = meta(html, "description");
      if (!description) note(route, "no meta description");
      else {
        if (description.length > DESCRIPTION_MAX) {
          note(route, `description is ${description.length} chars`);
        }
        const prior = descriptions.get(description);
        if (prior) note(route, `description duplicates ${prior}`);
        else descriptions.set(description, route);
      }

      // ---- exactly one H1, and it is not empty ----
      const h1Matches = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)];
      if (h1Matches.length === 0) note(route, "no <h1>");
      else if (h1Matches.length > 1) note(route, `${h1Matches.length} <h1> elements`);
      else {
        const h1 = textOf(h1Matches[0][1]);
        if (!h1) note(route, "<h1> is empty");
        else {
          const prior = h1s.get(h1);
          if (prior) note(route, `h1 duplicates ${prior}: ${JSON.stringify(h1)}`);
          else h1s.set(h1, route);
        }
      }

      // ---- canonical points at THIS page ----
      const canonical = pick(html, /<link[^>]+rel="canonical"[^>]*href="([^"]*)"/i);
      const expected = `${SITE_URL}${route === "/" ? "" : route}`;
      if (!canonical) note(route, "no canonical link");
      else if (canonical !== expected) note(route, `canonical is ${canonical}, expected ${expected}`);

      // ---- og:site_name must be the brand on every page ----
      const siteName = meta(html, "og:site_name");
      if (siteName !== BRAND) {
        note(route, `og:site_name is ${JSON.stringify(siteName)}, expected ${JSON.stringify(BRAND)}`);
      }

      // ---- schema ----
      const types = jsonLdTypes(html);
      for (const t of types) if (String(t).startsWith("UNPARSEABLE")) note(route, `JSON-LD ${t}`);
      if (!types.has("Organization")) note(route, "no Organization schema");
      if (!types.has("WebSite")) note(route, "no WebSite schema");
      if (route !== "/" && !types.has("BreadcrumbList")) note(route, "no BreadcrumbList schema");
      if (route.startsWith("/services/") && route !== "/services" && !types.has("Service")) {
        note(route, "service page without Service schema");
      }
      if (route.startsWith("/insights/") && route !== "/insights" && !types.has("BlogPosting")) {
        note(route, "post without BlogPosting schema");
      }
      // Review and rating schema is banned until real reviews exist.
      if (types.has("AggregateRating") || types.has("Review")) {
        note(route, "review or rating schema present, which is banned until real reviews exist");
      }

      // ---- post length ----
      if (route.startsWith("/insights/") && route !== "/insights") {
        const article = html.match(/<article[\s\S]*?<\/article>/i);
        const words = textOf(article ? article[0] : html).split(/\s+/).filter(Boolean).length;
        if (words < POST_MIN_WORDS) {
          note(route, `post is ${words} words, minimum is ${POST_MIN_WORDS}`);
        }
      }

      // ---- lang, viewport, and the robots trap ----
      if (!/<html[^>]+lang="en"/i.test(html)) note(route, "html has no lang=en");
      if (!meta(html, "viewport")) note(route, "no viewport meta");
      const robots = meta(html, "robots");
      if (robots && /noindex/i.test(robots)) {
        note(route, "page is in the sitemap and carries noindex");
      }
    }

    console.log("=== META AUDIT ===");
    console.log(`scanned ${scanned} of ${routes.length} sitemap routes against ${BASE}`);
    console.log(
      `unique titles: ${titles.size}, unique descriptions: ${descriptions.size}, unique H1s: ${h1s.size}`,
    );

    if (problems.length === 0) {
      console.log("\nPASS: titles, descriptions, H1s, canonicals, og:site_name, and schema all clean.");
    } else {
      console.log(`\nFAIL: ${problems.length} problem(s):`);
      for (const p of problems) console.log(`  ${p.route}\n    ${p.message}`);
      process.exitCode = 1;
    }
  }
}
