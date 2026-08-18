// Placeholder content audit. Crawls the rendered output of every sitemap route
// and fails loudly on anything that reads as unfinished scaffolding: fabricated
// phone numbers, lorem ipsum, TODO markers, throwaway email domains, or any
// email that is not on the real domain.
//
// This runs against the built server rather than against the source, because
// business constants come from configuration. A wrong value renders sitewide
// while the repo looks clean, and a fabricated 555 number is invisible in
// review because it looks exactly like a real one.
//
// This site adds two rules the wattsmith original did not need:
//
//   - Dollar amounts. Pricing is a pending owner item and NO figure may appear
//     anywhere until a price sheet exists. A number that ships here would be
//     quoted back for years after it changed.
//   - Em dashes and en dashes. Banned by the content rules, and the reliable
//     way they arrive is by being pasted rather than typed.
//
//   BASE_URL=http://localhost:3125 node scripts/placeholder-audit.mjs
import fs from "node:fs";

const BASE = process.env.BASE_URL || "http://localhost:3125";

/** The one domain company email may live on. */
const REAL_EMAIL_DOMAIN = "sealedengineering.com";

/**
 * The credentials this site is allowed to publish, read from
 * src/config/credentials.ts.
 *
 * Parsed out of the TypeScript rather than duplicated here, because two lists
 * of licence numbers is one list too many and the copy that drifts is always
 * the one nobody is looking at. If the shape of that file changes, this throws
 * rather than returning empty arrays: an audit that silently starts allowing
 * everything is worse than one that breaks loudly.
 */
function loadVerifiedCredentials() {
  const file = new URL("../src/config/credentials.ts", import.meta.url);
  let source;
  try {
    source = fs.readFileSync(file, "utf8");
  } catch (err) {
    throw new Error(`placeholder-audit: cannot read src/config/credentials.ts (${err.message})`);
  }

  const listOf = (name) => {
    const m = source.match(
      new RegExp(`export const ${name}: readonly string\\[\\] = \\[([\\s\\S]*?)\\];`),
    );
    if (!m) {
      throw new Error(
        `placeholder-audit: could not find ${name} in src/config/credentials.ts.\n` +
          `The audit refuses to run rather than assume an empty allowlist, because an empty\n` +
          `allowlist read by accident would pass every fabricated credential on the site.`,
      );
    }
    return [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
  };

  // Firm numbers are derived from the environment in the config, so the audit
  // reads the same environment rather than trying to evaluate TypeScript.
  const firmFromEnv =
    (process.env.LAUNCH_MODE || "prelaunch").trim().toLowerCase() === "live"
      ? [(process.env.TBPELS_FIRM_NUMBER || "").trim()].filter(Boolean)
      : [];

  return {
    names: listOf("VERIFIED_PE_NAMES"),
    licenses: listOf("VERIFIED_PE_LICENSE_NUMBERS"),
    firms: firmFromEnv,
  };
}

const VERIFIED = loadVerifiedCredentials();
const normalize = (v) => v.toLowerCase().replace(/[^a-z0-9]/g, "");
const verifiedNames = new Set(VERIFIED.names.map(normalize));
const verifiedLicenses = new Set(VERIFIED.licenses.map(normalize));
const verifiedFirms = new Set(VERIFIED.firms.map(normalize));

/**
 * Deliberate, reviewed exceptions. Each needs a reason, and each is matched as
 * a literal against the matched string rather than against the whole page, so
 * an allowlisted token cannot hide a real finding sitting next to it.
 */
const ALLOWLIST = [
  {
    literal: "you@email.com",
    why: "Never used. Kept as an allowlist entry so that if a form input ever adopts an example address, the reason is on the record rather than discovered.",
  },
];

const allowed = (match) => ALLOWLIST.some((a) => match.includes(a.literal) || a.literal.includes(match));

async function get(path) {
  const res = await fetch(`${BASE}${path}`);
  return { status: res.status, html: await res.text() };
}

/**
 * Visible text only: scripts, styles, and JSON-LD stripped, tags removed,
 * entities decoded. Word markers are checked against this rather than raw HTML
 * so framework internals and the RSC payload cannot produce phantom hits.
 */
function visibleText(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

/** Attribute values that are user-visible or machine-consumed, plus JSON-LD. */
function surfaces(html) {
  const out = [];
  for (const m of html.matchAll(/href="(tel:[^"]*)"/gi)) out.push(["tel: link", m[1]]);
  for (const m of html.matchAll(/href="(mailto:[^"]*)"/gi)) out.push(["mailto: link", m[1]]);
  for (const m of html.matchAll(/placeholder="([^"]*)"/gi)) out.push(["input placeholder", m[1]]);
  for (const m of html.matchAll(/<meta[^>]+content="([^"]*)"/gi)) out.push(["meta tag", m[1]]);
  for (const m of html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    out.push(["JSON-LD", m[1]]);
  }
  return out;
}

const WORD_MARKERS = /\b(TODO|TBD|FIXME|PLACEHOLDER|XXX|COMING SOON|LOREM)\b/gi;
const LOREM = /lorem\s+ipsum/gi;
const THROWAWAY = /\b(?:example\.com|test@[\w.-]+|sample@[\w.-]+|foo@[\w.-]+)/gi;
const EMAIL = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
// Loose on separators, strict on shape, so (210) 446-5446, 210.446.5446 and
// 2104465446 all normalize to the same ten digits.
const PHONE = /(?:\+?1[\s.\-]?)?\(?\b\d{3}\)?[\s.\-]?\d{3}[\s.\-]?\d{4}\b/g;
// Unseparated runs, which is how tel: hrefs are written. The separated pattern
// cannot anchor inside an 11-digit run, so a fabricated number reachable only
// through a tel: link would slip past it.
const PHONE_RUN = /\+?1?\d{10}(?!\d)/g;
// Currency in any of the shapes copy tends to use.
const MONEY = /(?:\$\s?\d[\d,]*(?:\.\d{2})?|\b\d[\d,]*\s?(?:dollars|USD)\b)/gi;
const DASHES = /[–—]/g;
// Emoji, including the pictographic ranges and the variation selector that
// usually rides along with them.
const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{1F000}-\u{1F02F}]/gu;

/**
 * Regulated credentials.
 *
 * All three require the credential to actually be asserted, which is what keeps
 * them off the ordinary copy. "a licensed Texas PE" has no comma and no number
 * and matches nothing. "Reviewed by Jane Doe, P.E., Texas License No. 98765"
 * matches twice and fails the build unless both are in the verified config.
 */
// A personal name immediately followed by a P.E. designation. Requires at
// least two capitalised words AND a comma, so "licensed Texas PE" is not a hit.
const PE_NAME = /\b([A-Z][a-zA-Z.'-]+(?:\s+[A-Z][a-zA-Z.'-]+){1,3}),\s*P\.?\s?E\.?(?![a-z])/g;
// A licence number, which needs the word licence and digits. "valid driver
// license" and "under its license and registration" have no digits.
const PE_LICENSE =
  /\b(?:licen[sc]e|lic\.)\s*(?:no\.?|number|#)?\s*:?\s*#?\s*(\d{3,7})\b/gi;
// A firm registration number. "Firm registration pending" has no digits.
const FIRM_NUMBER =
  /\b(?:TBPELS\s*)?firm\s*(?:registration\s*)?(?:no\.?|number|#)\s*:?\s*#?\s*(F-?[\d-]{3,12}|\d{3,7})\b/gi;

const findings = [];
const seen = new Set();
const record = (route, rule, match, where) => {
  const value = String(match).trim();
  if (allowed(value)) return;
  const key = `${route}|${rule}|${value}|${where}`;
  if (seen.has(key)) return;
  seen.add(key);
  findings.push({ route, rule, match: value, where });
};

function scanText(route, where, text) {
  if (!text) return;

  for (const m of text.matchAll(WORD_MARKERS)) record(route, "placeholder marker", m[0], where);
  for (const m of text.matchAll(LOREM)) record(route, "lorem ipsum", m[0], where);
  for (const m of text.matchAll(THROWAWAY)) record(route, "throwaway address", m[0], where);
  for (const m of text.matchAll(DASHES)) {
    record(route, "em or en dash (content rules ban both)", m[0], where);
  }
  for (const m of text.matchAll(EMOJI)) record(route, "emoji (content rules ban them)", m[0], where);
  for (const m of text.matchAll(MONEY)) {
    record(route, "dollar amount (pricing is a pending owner item)", m[0], where);
  }

  // Regulated credentials: anything asserted must be in the verified config.
  for (const m of text.matchAll(PE_NAME)) {
    if (!verifiedNames.has(normalize(m[1]))) {
      record(route, "PE name not in verified credentials config", m[0], where);
    }
  }
  for (const m of text.matchAll(PE_LICENSE)) {
    if (!verifiedLicenses.has(normalize(m[1]))) {
      record(route, "licence number not in verified credentials config", m[0], where);
    }
  }
  for (const m of text.matchAll(FIRM_NUMBER)) {
    if (!verifiedFirms.has(normalize(m[1]))) {
      record(route, "firm registration number not in verified credentials config", m[0], where);
    }
  }

  for (const m of text.matchAll(EMAIL)) {
    const domain = m[0].split("@")[1]?.toLowerCase();
    if (domain !== REAL_EMAIL_DOMAIN) record(route, "off-domain email", m[0], where);
  }

  for (const pattern of [PHONE, PHONE_RUN]) {
    for (const m of text.matchAll(pattern)) {
      const digits = m[0].replace(/\D/g, "").replace(/^1(?=\d{10}$)/, "");
      if (digits.length !== 10) continue;
      if (/^\d{3}555\d{4}$/.test(digits)) {
        record(route, "fabricated 555 number", m[0], where);
      } else {
        // There is no published phone number yet, so ANY ten digit number in
        // rendered output is a finding rather than a mismatch. When a real
        // number is decided, this becomes a comparison against it.
        record(route, "phone number, but none is published yet", m[0], where);
      }
    }
  }
}

// process.exitCode rather than process.exit() throughout: an abrupt exit while
// keep-alive sockets from the crawl are still open trips a libuv assertion on
// Windows and replaces the intended status with a crash code.
const bail = (message) => {
  console.error(`placeholder-audit: ${message}`);
  process.exitCode = 1;
};

const sm = await get("/sitemap.xml");
const routes =
  sm.status === 200
    ? [...sm.html.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
        (m) => m[1].replace(/^https:\/\/sealedengineering\.com/, "") || "/",
      )
    : [];

if (sm.status !== 200) {
  bail(`cannot read sitemap at ${BASE}/sitemap.xml (status ${sm.status})`);
} else if (routes.length === 0) {
  bail("sitemap contained no URLs; refusing to report a pass on zero routes");
} else {
  for (const route of routes) {
    const { status, html } = await get(route);
    if (status !== 200) {
      findings.push({ route, rule: "unreachable", match: `HTTP ${status}`, where: "response" });
      continue;
    }
    scanText(route, "page text", visibleText(html));
    for (const [where, value] of surfaces(html)) scanText(route, where, value);
  }

  // The llms files are not in the sitemap and are exactly the kind of generated
  // surface where a stale constant hides.
  for (const extra of ["/llms.txt", "/llms-full.txt"]) {
    const { status, html } = await get(extra);
    if (status !== 200) {
      findings.push({ route: extra, rule: "unreachable", match: `HTTP ${status}`, where: "response" });
      continue;
    }
    scanText(extra, "plain text", html);
  }

  console.log("=== PLACEHOLDER AUDIT ===");
  console.log(`scanned ${routes.length} sitemap routes plus the llms files against ${BASE}`);

  if (findings.length === 0) {
    console.log(`\nPASS: no placeholder content in rendered output.`);
    console.log(`allowlisted by design: ${ALLOWLIST.map((a) => `"${a.literal}"`).join(", ")}`);
    console.log(
      `verified credentials: ${VERIFIED.names.length} PE name(s), ` +
        `${VERIFIED.licenses.length} licence number(s), ${VERIFIED.firms.length} firm number(s). ` +
        `Anything else asserted in rendered output fails this audit.`,
    );
  } else {
    // Grouped by rule so a failure reads as a problem rather than a wall of routes.
    const byRule = new Map();
    for (const f of findings) {
      if (!byRule.has(f.rule)) byRule.set(f.rule, []);
      byRule.get(f.rule).push(f);
    }
    for (const [rule, list] of byRule) {
      console.log(`\n-- ${rule}: ${list.length} finding(s)`);
      for (const f of list.slice(0, 12)) console.log(`   ${f.route}\n     [${f.where}] ${f.match}`);
      if (list.length > 12) console.log(`   ... and ${list.length - 12} more`);
    }
    console.log(
      `\nFAIL: ${findings.length} finding(s) across ${new Set(findings.map((f) => f.route)).size} route(s).`,
    );
    process.exitCode = 1;
  }
}
