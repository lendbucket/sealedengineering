// Voice and regulatory phrase audit.
//
// Reconciled against TEXAS_ENGINEERING_DOMINANCE.md Part 4 item 3 and Part 1.
// The rule set is now the playbook's, plus this brand's own stricter claim
// rules, all held in scripts/lib/voice-blocklist.mjs and shared with
// scripts/email-audit.mjs so the two surfaces cannot disagree.
//
// SCOPE, AND WHAT IT DELIBERATELY DOES NOT DUPLICATE
// --------------------------------------------------
// scripts/placeholder-audit.mjs owns the mechanical content rules: em and en
// dashes, emoji, dollar amounts, phone numbers, off-domain email, and regulated
// credentials. This audit does not re-check any of them. Two audits enforcing
// one rule means two places to update and one that gets missed.
//
// WHAT THIS OWNS
//   1. The playbook banned-phrase list, verbatim.
//   2. The Part 1 regulatory phrase checks, active while the gate is on.
//   3. Outcome guarantees and insurance claim language (this brand's extension).
//   4. The four structural tells: uniform paragraph rhythm, stacked rhetorical
//      triads, question-heading density, bolded listicle lead-ins.
//   5. Hyphen used as a sentence connector (Part 6 style law).
//
//   BASE_URL=http://localhost:3125 node scripts/voice-audit.mjs
//   VOICE_STATS=1 to print the measured structural numbers per page.
import {
  BOLD_LEADIN_EXEMPT,
  voiceAllowed,
  BANNED_PATTERN,
  HYPHEN_AS_CONNECTOR,
  NOT_ONLY_BUT_ALSO,
  PUFFERY_RULES,
} from "./lib/voice-blocklist.mjs";
// SYNCHRONIZED from the 254 repo, copied verbatim. Carries both the active and
// the PASSIVE voice of every regulated claim. The passive half is the reason
// this module exists: a sibling site passed an active-voice-only list while
// claiming in twenty places that a licensed engineer was already sealing work.
import { ALL_REGULATED, NEVER_CLAIMS, findClaims } from "./lib/regulatory.mjs";

const BASE = process.env.BASE_URL || "http://localhost:3125";
const LAUNCH_MODE = (process.env.LAUNCH_MODE || "prelaunch").trim().toLowerCase();
const IS_PRELAUNCH = LAUNCH_MODE !== "live";
const SHOW_STATS = process.env.VOICE_STATS === "1";

/**
 * Structural thresholds.
 *
 * Calibrated against this site's own pages, which were written by hand, and set
 * with room so that ordinary variation does not trip them. They are tells, not
 * laws: each one is a shape that generated prose falls into and written prose
 * does not, and each threshold is deliberately generous so a hit means
 * something.
 */
const THRESHOLDS = {
  // Coefficient of variation of paragraph length. Generated prose converges on
  // paragraphs of near-identical length; written prose varies because the ideas
  // vary. Below this, every paragraph is the same size.
  minParagraphVariation: 0.28,
  // Only judge rhythm where there is enough of it to judge.
  minParagraphsForRhythm: 8,
  // Playbook: "question-heading density above roughly 40 percent".
  maxQuestionHeadingRatio: 0.4,
  // Triads per thousand words. "A, B, and C" is a normal English construction;
  // stacking them is the tell.
  maxTriadsPerThousandWords: 14,
  // Bolded lead-ins opening list items, where the page is prose-carried.
  maxBoldListLeadIns: 4,
};

const findings = [];
const seen = new Set();
const record = (route, rule, why, match) => {
  const key = `${route}|${rule}|${String(match).toLowerCase().slice(0, 80)}`;
  if (seen.has(key)) return;
  seen.add(key);
  findings.push({ route, rule, why, match: String(match) });
};

async function get(path) {
  const res = await fetch(`${BASE}${path}`);
  return { status: res.status, html: await res.text() };
}

const decode = (s) =>
  s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

function mainOf(html) {
  const m = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  return m ? m[1] : html;
}

function visibleText(html) {
  return decode(
    html
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * The compliance disclosures, removed before the regulatory rules run.
 *
 * These sentences exist precisely to say services are NOT being offered, and
 * they necessarily contain the vocabulary those rules hunt for. Matching them
 * would be the audit failing a page for carrying the disclosure the audit
 * exists to require.
 */
const DISCLOSURES = [
  "no engineering services are being offered or performed under this brand until it is granted",
  "Sealed Engineering is not yet accepting orders",
  "until that registration is granted, no engineering services are being offered or performed",
  "is not a request for engineering services",
  "Sealed Engineering is not offering or performing engineering services until firm registration is granted",
];

function stripDisclosures(text) {
  let out = text;
  for (const d of DISCLOSURES) out = out.split(d).join(" ");
  return out;
}

// ---- assertion guards -------------------------------------------------

function sentenceAround(text, index) {
  const start = Math.max(0, text.lastIndexOf(".", index - 1) + 1);
  let end = text.indexOf(".", index);
  const q = text.indexOf("?", index);
  if (q !== -1 && (end === -1 || q < end)) end = q;
  if (end === -1) end = text.length;
  return { sentence: text.slice(start, Math.min(end + 1, text.length)).trim(), start };
}

const NEGATOR =
  /\b(?:no|not|never|cannot|can't|nobody|neither|nor|without|refuses?|refused|declines?|declined|does not|do not|is not|are not|will not|won't)\b/i;

/**
 * A match is only a violation when the site is asserting it.
 *
 * Two guards, both learned from the first run of this audit, which produced
 * twelve findings and zero real problems. Questions: this site is full of FAQs
 * whose purpose is to ask the dangerous question and answer it honestly.
 * Negations: the Terms page enumerates what a seal is NOT, so it necessarily
 * contains every phrase this audit hunts for.
 */
function isAssertion(text, index) {
  const { sentence, start } = sentenceAround(text, index);
  if (sentence.endsWith("?")) return false;
  if (NEGATOR.test(text.slice(start, index))) return false;
  return true;
}

// ---- structural measurement -------------------------------------------

function structureOf(mainHtml) {
  const paragraphs = [...mainHtml.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((m) => visibleText(m[1]))
    .filter((t) => t.split(/\s+/).length >= 12);

  const lengths = paragraphs.map((p) => p.split(/\s+/).length);
  const mean = lengths.length ? lengths.reduce((a, b) => a + b, 0) / lengths.length : 0;
  const variance = lengths.length
    ? lengths.reduce((a, b) => a + (b - mean) ** 2, 0) / lengths.length
    : 0;
  const cv = mean ? Math.sqrt(variance) / mean : 1;

  const headings = [...mainHtml.matchAll(/<h([23])\b[^>]*>([\s\S]*?)<\/h\1>/gi)].map((m) =>
    visibleText(m[2]),
  );
  const questionHeadings = headings.filter((h) => h.endsWith("?"));

  const words = visibleText(mainHtml).split(/\s+/).filter(Boolean).length;
  // "word, word, and word" or "word, word and word".
  const triads = [...visibleText(mainHtml).matchAll(/\b[\w'-]+,\s+[\w'-]+,?\s+and\s+[\w'-]+\b/g)];

  const boldLeadIns = [
    ...mainHtml.matchAll(/<li\b[^>]*>\s*(?:<[^>]+>\s*)*<(?:strong|b)\b/gi),
  ];

  return {
    paragraphCount: paragraphs.length,
    paragraphCv: cv,
    headingCount: headings.length,
    questionHeadingCount: questionHeadings.length,
    questionHeadingRatio: headings.length ? questionHeadings.length / headings.length : 0,
    words,
    triads: triads.length,
    triadsPerThousand: words ? (triads.length / words) * 1000 : 0,
    boldLeadIns: boldLeadIns.length,
  };
}

// ---- run ---------------------------------------------------------------

const sm = await get("/sitemap.xml");
if (sm.status !== 200) {
  console.error(`voice-audit: cannot read sitemap (status ${sm.status})`);
  process.exitCode = 1;
} else {
  const routes = [...sm.html.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (m) => m[1].replace(/^https:\/\/sealedengineering\.com/, "") || "/",
  );

  if (routes.length === 0) {
    console.error("voice-audit: sitemap contained no URLs; refusing to pass on zero routes");
    process.exitCode = 1;
  } else {
    // Both gates are down on this site: the TBPELS firm registration is
    // pending AND no PE is hired. ALL_REGULATED is the union of the active
    // voice offer claims (firm gate) and the passive voice sealing claims
    // (engineer of record gate), which is exactly the right set for that state.
    // NEVER_CLAIMS applies in every gate state, forever.
    const regulated = IS_PRELAUNCH ? ALL_REGULATED : [];
    const stats = [];

    for (const route of routes) {
      const { status, html } = await get(route);
      if (status !== 200) {
        record(route, "unreachable", "The page did not return 200.", `HTTP ${status}`);
        continue;
      }
      const main = mainOf(html);
      const text = visibleText(main);
      const stripped = stripDisclosures(text);

      // 1. Playbook banned phrases. No assertion guard: these are style, and a
      // banned phrase inside a question is still a banned phrase.
      for (const m of text.matchAll(BANNED_PATTERN)) {
        if (voiceAllowed(m[0].trim())) continue;
        record(route, "banned-phrase", "Playbook Part 4 item 3 banned-phrase list.", m[0].trim());
      }
      for (const m of text.matchAll(NOT_ONLY_BUT_ALSO)) {
        record(route, "not-only-but-also", "Playbook Part 4 item 3, listed construction.", m[0].trim());
      }

      // 2. Regulated claims, gate dependent. Read against the disclosure
      // stripped text so the compliance notice does not flag itself.
      for (const hit of findClaims(stripped, regulated)) {
        if (!isAssertion(stripped, hit.index)) continue;
        record(route, "regulated-claim", `Shared regulatory library: ${hit.why}.`, hit.match.trim());
      }
      // 3. Claims no engineering firm may make in any gate state, ever.
      for (const hit of findClaims(text, NEVER_CLAIMS)) {
        if (!isAssertion(text, hit.index)) continue;
        record(route, "never-claim", `Shared regulatory library: ${hit.why}.`, hit.match.trim());
      }
      for (const rule of PUFFERY_RULES) {
        for (const m of text.matchAll(rule.pattern)) {
          if (!isAssertion(text, m.index)) continue;
          record(route, rule.id, rule.why, m[0].trim());
        }
      }

      // 5. Hyphen as a sentence connector, Part 6.
      for (const m of text.matchAll(HYPHEN_AS_CONNECTOR)) {
        const { sentence } = sentenceAround(text, m.index);
        record(
          route,
          "hyphen-as-connector",
          "Playbook Part 6 style law: no hyphens as sentence connectors.",
          sentence.slice(0, 100),
        );
      }

      // 4. Structural tells.
      const s = structureOf(main);
      stats.push({ route, ...s });

      if (s.paragraphCount >= THRESHOLDS.minParagraphsForRhythm && s.paragraphCv < THRESHOLDS.minParagraphVariation) {
        record(
          route,
          "uniform-paragraph-rhythm",
          "Playbook Part 4 item 3 structural tell. Generated prose converges on paragraphs of near-identical length.",
          `${s.paragraphCount} paragraphs, length variation ${s.paragraphCv.toFixed(2)} (floor ${THRESHOLDS.minParagraphVariation})`,
        );
      }
      if (s.headingCount >= 4 && s.questionHeadingRatio > THRESHOLDS.maxQuestionHeadingRatio) {
        record(
          route,
          "question-heading-density",
          "Playbook Part 4 item 3 structural tell: question-heading density above roughly 40 percent.",
          `${s.questionHeadingCount}/${s.headingCount} headings are questions (${Math.round(s.questionHeadingRatio * 100)} percent)`,
        );
      }
      if (s.words >= 400 && s.triadsPerThousand > THRESHOLDS.maxTriadsPerThousandWords) {
        record(
          route,
          "stacked-triads",
          "Playbook Part 4 item 3 structural tell: stacked rhetorical triads.",
          `${s.triads} triads in ${s.words} words (${s.triadsPerThousand.toFixed(1)} per thousand, cap ${THRESHOLDS.maxTriadsPerThousandWords})`,
        );
      }
      if (s.boldLeadIns > THRESHOLDS.maxBoldListLeadIns && !BOLD_LEADIN_EXEMPT.has(route)) {
        record(
          route,
          "bold-listicle-lead-ins",
          "Playbook Part 4 item 3 structural tell: bolded listicle lead-ins where prose carries.",
          `${s.boldLeadIns} list items open with bold text (cap ${THRESHOLDS.maxBoldListLeadIns})`,
        );
      }
    }

    console.log("=== VOICE AUDIT ===");
    console.log(
      `scanned ${routes.length} sitemap routes against ${BASE} in ${LAUNCH_MODE} mode.\n` +
        `rules: playbook banned list, ${regulated.length} regulated from the shared library ` +
        `(active and passive voice), ${NEVER_CLAIMS.length} never-claims, ` +
        `${PUFFERY_RULES.length} puffery, 4 structural tells, 1 style law.`,
    );

    if (SHOW_STATS) {
      console.log("\n-- structural measurements");
      for (const s of stats.slice().sort((a, b) => a.paragraphCv - b.paragraphCv)) {
        console.log(
          `   cv=${s.paragraphCv.toFixed(2)} p=${String(s.paragraphCount).padStart(2)} ` +
            `q=${s.questionHeadingCount}/${s.headingCount} ` +
            `triads/k=${s.triadsPerThousand.toFixed(1)} bold-li=${s.boldLeadIns}  ${s.route}`,
        );
      }
    }

    if (findings.length === 0) {
      console.log("\nPASS: no banned phrases, regulatory claims, or structural tells in rendered output.");
      console.log(
        "Mechanical content rules (dashes, emoji, currency, phone numbers, credentials) belong " +
          "to placeholder-audit and are not re-checked here.",
      );
    } else {
      const byRule = new Map();
      for (const f of findings) {
        if (!byRule.has(f.rule)) byRule.set(f.rule, []);
        byRule.get(f.rule).push(f);
      }
      for (const [rule, list] of byRule) {
        console.log(`\n-- ${rule}: ${list.length} finding(s)`);
        console.log(`   why: ${list[0].why}`);
        for (const f of list.slice(0, 10)) console.log(`   ${f.route}\n     "${f.match}"`);
        if (list.length > 10) console.log(`   ... and ${list.length - 10} more`);
      }
      console.log(
        `\nFAIL: ${findings.length} finding(s) across ${new Set(findings.map((f) => f.route)).size} route(s).`,
      );
      process.exitCode = 1;
    }
  }
}
