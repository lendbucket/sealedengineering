// Voice and regulatory phrase audit.
//
// SCOPE, AND WHAT IT DELIBERATELY DOES NOT DUPLICATE
// --------------------------------------------------
// scripts/placeholder-audit.mjs already owns the mechanical content rules:
// em and en dashes, emoji, dollar amounts, phone numbers, off-domain email,
// and now regulated credentials. This audit does not re-check any of them.
// Two audits enforcing one rule means two places to update and one that gets
// missed.
//
// What this owns is the regulatory and voice surface, which is the class of
// sentence that is grammatically fine, reads as good marketing, and is either
// a licensure problem or a promise the business cannot keep:
//
//   1. Outcome guarantees. "Guaranteed approval", "we guarantee your permit".
//      An engineer seals what the evidence supports. A page that promises the
//      conclusion has stated that its conclusions do not follow evidence.
//   2. Claim solicitation and maximisation. This brand does not do insurance
//      claim work and must not appear to.
//   3. Availability language while firm registration is pending. In prelaunch
//      the site must not say services are currently offered or performed.
//   4. Superlatives and puffery that no source could support.
//   5. AI-tell filler that reads as generated rather than written.
//
// NOTE FOR RECONCILIATION: the upgrade brief specifies this audit "per
// playbook Part 4 item 3 with the regulatory phrase check from Part 1". The
// playbook has not been supplied. The rules below are derived from the
// standing compliance section of WEBSITE_MASTER_PROMPT.md, which is in the
// repo. Reconcile this list against the playbook when it lands; BACKLOG.md
// carries the item.
//
//   BASE_URL=http://localhost:3125 node scripts/voice-audit.mjs
const BASE = process.env.BASE_URL || "http://localhost:3125";
const LAUNCH_MODE = (process.env.LAUNCH_MODE || "prelaunch").trim().toLowerCase();
const IS_PRELAUNCH = LAUNCH_MODE !== "live";

/**
 * Each rule is a named pattern with the reason it exists. The reason is
 * printed on a hit, because "voice-audit failed" without it sends somebody
 * hunting through a style guide.
 */
const RULES = [
  {
    id: "outcome-guarantee",
    why: "An engineer seals what the evidence supports. Promising the conclusion in advance is both a licensure problem and a claim the business cannot honour.",
    // Requires US as the subject. The first version of this rule matched any
    // sentence containing "guarantee" near "approval", and every one of its
    // hits was the site behaving correctly: a Terms bullet listing what a seal
    // is NOT, and two FAQ questions answered "no". A regulatory audit that
    // fires on the honest disclaimer is one people switch off in a week.
    pattern:
      /\b(?:we|our\s+(?:team|engineers?|firm)|sealed\s+engineering)\s+(?:\w+\s+){0,2}(?:guarantee|promise|assure|warrant)s?\b/gi,
  },
  {
    id: "guaranteed-approval-phrase",
    why: "Same rule as an adjective, which is how it usually reaches a landing page.",
    pattern:
      /\bguaranteed\s+(?:\w+\s+){0,2}(?:approval|approved|pass(?:ing)?|acceptance|permit|certification|results?|outcome)\b|\b(?:approval|permit|certification)\s+(?:is\s+)?guaranteed\b/gi,
  },
  {
    id: "we-will-certify",
    why: "Committing to certify before observing is committing to a conclusion. The honest form is what will be examined, not what will be found.",
    pattern:
      /\bwe\s+(?:will|can)\s+(?:certify|approve|pass)\s+(?:your|the)\b/gi,
  },
  {
    id: "claim-solicitation",
    why: "This brand does not prepare, solicit, or support insurance claim work, and must not appear to.",
    pattern:
      /\b(?:maximi[sz]e|maximi[sz]ing|increase|boost|fight|win)\s+(?:your\s+)?(?:insurance\s+)?(?:claim|settlement|payout)\b/gi,
  },
  {
    id: "claim-help",
    why: "Same rule. Offering to help with a claim is claim work regardless of the wording.",
    pattern:
      /\b(?:help|assist)\s+(?:you\s+)?(?:with\s+)?(?:your\s+)?insurance\s+claim\b/gi,
  },
  {
    id: "denied-claim",
    why: "Claim denial language is claim adjusting territory and is outside this brand's scope.",
    pattern: /\bdenied\s+(?:insurance\s+)?claim\b/gi,
  },
  {
    id: "puffery",
    why: "Unsupportable superlative about this business. Nothing here should assert a ranking no source could establish.",
    // The superlative has to attach to a business noun. Bare "leading" and
    // "best" match ordinary English that is not a claim: "a leading cause of a
    // document being sent back", "best practice". Both were flagged by the
    // first version of this rule and both were correct writing.
    pattern:
      /\b(?:#\s?1|number one|best|leading|premier|top[- ]rated|world[- ]class|unmatched|unrivall?ed|foremost)\s+(?:\w+\s+){0,2}(?:engineer|engineers|engineering|firm|company|provider|service|choice|source|team)\b/gi,
  },
  {
    id: "fastest-cheapest",
    why: "A speed or price superlative about this business, which it has no data to support, and pricing is a pending owner item besides.",
    // Same correction. "The fastest way to submit a project" is advice to the
    // reader and is exactly what these pages should say. "The fastest engineer
    // in Texas" is a claim. The difference is the noun.
    pattern:
      /\b(?:fastest|cheapest|lowest[- ]price[d]?|most affordable)\s+(?:\w+\s+){0,2}(?:engineer|engineers|engineering|firm|company|provider|service|turnaround|letters?|certifications?|price|prices|rates?)\b|\b(?:fastest|cheapest)\s+in\s+(?:texas|the state|the industry|the business)\b/gi,
  },
  {
    id: "ai-filler",
    why: "Reads as generated rather than written. The content rule is that every line reads as expert human writing.",
    pattern:
      /\b(?:in today's (?:fast[- ]paced |ever[- ]changing )?world|when it comes to|it['’]s important to note that|delve into|navigate the complexities|unlock the (?:power|potential)|elevate your|rest assured|look no further)\b/gi,
  },
  {
    id: "trust-me",
    why: "Assertions of trustworthiness are what an untrustworthy site writes. Show the mechanism instead.",
    pattern: /\b(?:trusted by thousands|you can trust us|we pride ourselves)\b/gi,
  },
];

/**
 * Prelaunch only. While firm registration is pending the site must not state
 * that engineering services are currently being offered or performed.
 *
 * These are matched against page text with the deliberate disclosures removed
 * first, because the compliance notice itself contains the words "engineering
 * services" and "offered or performed" and would otherwise flag itself.
 */
const PRELAUNCH_RULES = [
  {
    id: "present-tense-service",
    why: "Firm registration is pending, so the site cannot say work is being performed today.",
    pattern:
      /\bwe\s+(?:currently\s+)?(?:perform|provide|offer|deliver|are performing|are providing|are offering)\s+(?:\w+\s+){0,2}engineering\b/gi,
  },
  {
    id: "order-today",
    why: "An invitation to transact while ordering is not open.",
    pattern: /\b(?:order|buy|purchase|book)\s+(?:yours?\s+)?(?:today|now)\b/gi,
  },
  {
    id: "same-day-turnaround",
    why: "A turnaround commitment made before the business is open to take work.",
    pattern: /\b(?:same[- ]day|24[- ]hour|next[- ]day)\s+(?:turnaround|delivery|service)\b/gi,
  },
];

async function get(path) {
  const res = await fetch(`${BASE}${path}`);
  return { status: res.status, html: await res.text() };
}

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
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * The compliance disclosures, removed before the prelaunch rules run.
 *
 * These sentences exist precisely to say that services are NOT being offered,
 * and they necessarily contain the vocabulary the prelaunch rules look for.
 * Matching them would be the audit failing the page for carrying the
 * disclosure the audit exists to require.
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

/**
 * The sentence a match sits in, used by the guards below.
 *
 * Crude sentence splitting on purpose. It only has to be good enough to see a
 * question mark or a negator, and a real parser here would be a dependency
 * bought to make a heuristic feel rigorous.
 */
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
 * twelve findings and zero real problems:
 *
 *   Questions. This site is full of FAQs whose entire purpose is to ask the
 *   dangerous question and answer it honestly. "Can you guarantee the
 *   foundation will pass?" is the copy working, not failing.
 *
 *   Negations. The Terms page enumerates what a seal is NOT, which means it
 *   necessarily contains every phrase this audit hunts for.
 */
function isAssertion(text, index) {
  const { sentence, start } = sentenceAround(text, index);
  if (sentence.endsWith("?")) return false;
  // Only the part of the sentence BEFORE the match. A negator after it does
  // not change what was asserted.
  const before = text.slice(start, index);
  if (NEGATOR.test(before)) return false;
  return true;
}

const findings = [];
const seen = new Set();
const record = (route, rule, why, match) => {
  const key = `${route}|${rule}|${match.toLowerCase()}`;
  if (seen.has(key)) return;
  seen.add(key);
  findings.push({ route, rule, why, match });
};

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
    const active = IS_PRELAUNCH ? [...RULES, ...PRELAUNCH_RULES] : RULES;

    for (const route of routes) {
      const { status, html } = await get(route);
      if (status !== 200) {
        record(route, "unreachable", "The page did not return 200.", `HTTP ${status}`);
        continue;
      }
      const text = visibleText(html);
      const stripped = stripDisclosures(text);

      for (const rule of active) {
        const isPrelaunchRule = PRELAUNCH_RULES.includes(rule);
        const subject = isPrelaunchRule ? stripped : text;
        for (const m of subject.matchAll(rule.pattern)) {
          if (!isAssertion(subject, m.index)) continue;
          record(route, rule.id, rule.why, m[0].trim());
        }
      }
    }

    console.log("=== VOICE AUDIT ===");
    console.log(
      `scanned ${routes.length} sitemap routes against ${BASE} in ${LAUNCH_MODE} mode ` +
        `(${active.length} rules)`,
    );

    if (findings.length === 0) {
      console.log("\nPASS: no regulatory or voice violations in rendered output.");
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
