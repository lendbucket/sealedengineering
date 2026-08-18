/**
 * The shared voice blocklist.
 *
 * Playbook Part 4 item 3 requires one list shared between site copy and email
 * templates "so the two surfaces cannot disagree". Both scripts/voice-audit.mjs
 * and scripts/email-audit.mjs import from here, and neither keeps a private
 * copy. A rule that exists twice is a rule that will exist in two versions.
 *
 * THREE GROUPS, AND WHY THEY ARE SEPARATE
 * ---------------------------------------
 *   BANNED_PHRASES   The playbook's literal list, verbatim.
 *   REGULATORY       Part 1: the licensure claims that are a legal problem
 *                    rather than a style one. These carry the heaviest weight.
 *   CLAIMS           Rules derived from this brand's own compliance section in
 *                    WEBSITE_MASTER_PROMPT.md that the playbook does not name
 *                    explicitly: outcome guarantees and insurance claim
 *                    language. Kept because they are stricter, not looser, and
 *                    marked as an extension so the next reconciliation can see
 *                    what came from where.
 *
 * Every rule carries the reason it exists. "voice-audit failed" without a
 * reason sends somebody hunting through a style guide.
 */

/** Playbook Part 4 item 3, verbatim. */
export const BANNED_PHRASES = [
  "unlock",
  "elevate",
  "seamless",
  "journey",
  "empower",
  "passionate",
  "top-notch",
  "top notch",
  "hassle-free",
  "hassle free",
  "one-stop",
  "one stop",
  "cutting-edge",
  "cutting edge",
  "state-of-the-art",
  "state of the art",
  "look no further",
  "in today's",
  "when it comes to",
  "we've got you covered",
  "we have you covered",
  "rest assured",
];

/**
 * "not only X but also Y" is on the playbook list and is a construction rather
 * than a phrase, so it needs a pattern of its own.
 */
export const NOT_ONLY_BUT_ALSO = /\bnot only\b[^.?!]{0,80}\bbut also\b/gi;

/** Escape a literal for use inside a RegExp. */
const lit = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * One case-insensitive pattern for the whole banned list.
 *
 * Word boundaries on both ends so "unlock" does not fire inside "unlocked" in a
 * technical sentence, and so "journey" does not fire inside a street name.
 */
export const BANNED_PATTERN = new RegExp(
  `\\b(?:${BANNED_PHRASES.map(lit).join("|")})\\b`,
  "gi",
);

/**
 * Regulatory phrase checks, Part 1 item 3.
 *
 * "Engineer", "engineering", and "sealed" are regulated terms in Texas. While
 * the firm registration is pending, a present-tense claim that this brand
 * performs engineering is the specific thing the gate exists to prevent.
 */
export const REGULATORY_RULES = [
  {
    id: "present-tense-engineering",
    why: "Part 1 item 3. Firm registration is pending, so no present-tense claim that this brand performs or offers engineering services may ship.",
    prelaunchOnly: true,
    pattern:
      /\bwe\s+(?:currently\s+)?(?:seal|stamp|perform|provide|offer|deliver|are\s+(?:sealing|stamping|performing|providing|offering))\b(?:[^.?!]{0,40}\bengineering\b)?/gi,
  },
  {
    id: "our-engineers-plural",
    why: "Part 1 item 2. No 'our engineers' plural fiction before the PE hire is real.",
    prelaunchOnly: true,
    pattern: /\bour\s+(?:team\s+of\s+)?engineers\b/gi,
  },
  {
    id: "sealed-deliverables-available",
    why: "Part 1 item 2. No claim that stamped or sealed deliverables are currently available, and no turnaround promise for sealed work, before the gate opens.",
    prelaunchOnly: true,
    pattern:
      /\b(?:sealed|stamped)\s+(?:documents?|letters?|plans?|deliverables?)\s+(?:are|is)\s+(?:available|delivered|provided)\b/gi,
  },
  {
    id: "order-today",
    why: "Part 1. An invitation to transact while ordering is not open.",
    prelaunchOnly: true,
    pattern: /\b(?:order|buy|purchase|book)\s+(?:yours?\s+)?(?:today|now)\b/gi,
  },
  {
    id: "turnaround-promise",
    why: "Part 1 item 2. A turnaround commitment made before the business can take work.",
    prelaunchOnly: true,
    pattern: /\b(?:same[- ]day|24[- ]hour|next[- ]day|48[- ]hour)\s+(?:turnaround|delivery|service|seal)\b/gi,
  },
];

/**
 * Claim and guarantee rules.
 *
 * EXTENSION beyond the playbook's named list, derived from the compliance
 * section of WEBSITE_MASTER_PROMPT.md: never guarantee approvals, never promise
 * conclusions in advance, never solicit insurance claims or use claim
 * maximization language. Retained through the playbook reconciliation because
 * they are stricter than anything it removes.
 */
export const CLAIM_RULES = [
  {
    id: "outcome-guarantee",
    why: "An engineer seals what the evidence supports. Promising the conclusion in advance is a licensure problem and a claim the business cannot honour.",
    // Requires US as the subject: an earlier version matched any sentence
    // containing "guarantee" and every hit was the site correctly disclaiming.
    pattern:
      /\b(?:we|our\s+(?:team|engineers?|firm)|sealed\s+engineering)\s+(?:\w+\s+){0,2}(?:guarantee|promise|assure|warrant)s?\b/gi,
  },
  {
    id: "guaranteed-approval-phrase",
    why: "The same rule as an adjective, which is how it usually reaches a landing page.",
    pattern:
      /\bguaranteed\s+(?:\w+\s+){0,2}(?:approval|approved|pass(?:ing)?|acceptance|permit|certification|results?|outcome)\b|\b(?:approval|permit|certification)\s+(?:is\s+)?guaranteed\b/gi,
  },
  {
    id: "we-will-certify",
    why: "Committing to certify before observing is committing to a conclusion.",
    pattern: /\bwe\s+(?:will|can)\s+(?:certify|approve|pass)\s+(?:your|the)\b/gi,
  },
  {
    id: "claim-solicitation",
    why: "This brand does not prepare, solicit, or support insurance claim work, and must not appear to.",
    pattern:
      /\b(?:maximi[sz]e|maximi[sz]ing|increase|boost|fight|win)\s+(?:your\s+)?(?:insurance\s+)?(?:claim|settlement|payout)\b/gi,
  },
  {
    id: "claim-help",
    why: "Offering to help with a claim is claim work regardless of the wording.",
    pattern: /\b(?:help|assist)\s+(?:you\s+)?(?:with\s+)?(?:your\s+)?insurance\s+claim\b/gi,
  },
  {
    id: "denied-claim",
    why: "Claim denial language is claim adjusting territory and outside this brand's scope.",
    pattern: /\bdenied\s+(?:insurance\s+)?claim\b/gi,
  },
  {
    id: "puffery",
    why: "Unsupportable superlative about this business.",
    // Must attach to a business noun: bare "leading" and "best" match ordinary
    // English ("a leading cause", "best practice") that is not a claim.
    pattern:
      /\b(?:#\s?1|number one|best|leading|premier|top[- ]rated|world[- ]class|unmatched|unrivall?ed|foremost)\s+(?:\w+\s+){0,2}(?:engineer|engineers|engineering|firm|company|provider|service|choice|source|team)\b/gi,
  },
  {
    id: "fastest-cheapest",
    why: "A speed or price superlative the business has no data for, and pricing is a pending owner item besides.",
    pattern:
      /\b(?:fastest|cheapest|lowest[- ]price[d]?|most affordable)\s+(?:\w+\s+){0,2}(?:engineer|engineers|engineering|firm|company|provider|service|turnaround|letters?|certifications?|price|prices|rates?)\b|\b(?:fastest|cheapest)\s+in\s+(?:texas|the state|the industry|the business)\b/gi,
  },
  {
    id: "trust-me",
    why: "Assertions of trustworthiness are what an untrustworthy site writes. Show the mechanism instead.",
    pattern: /\b(?:trusted by thousands|you can trust us|we pride ourselves)\b/gi,
  },
];

/**
 * Style laws from Part 6 that apply to every rendered string.
 *
 * Em dashes, en dashes, emoji, currency, and phone numbers are owned by
 * scripts/placeholder-audit.mjs and are deliberately NOT repeated here. The one
 * Part 6 law that had no home until the playbook arrived is the hyphen used as
 * a sentence connector, which is a different thing from a hyphen inside a
 * compound modifier and is what this pattern isolates: a hyphen with a space on
 * at least one side, joining clauses the way an em dash would.
 */
export const HYPHEN_AS_CONNECTOR = /\s-\s|\s-[a-z]|[a-z]-\s/g;

/**
 * Deliberate, reviewed exceptions to the banned-phrase list.
 *
 * Each needs a reason and each is matched against the matched string rather
 * than the whole page, so an allowlisted token cannot shelter a real hit
 * sitting next to it. Same discipline as the placeholder audit's allowlist.
 */
export const VOICE_ALLOWLIST = [
  {
    literal: "One Stop",
    why: "The One Stop Shop is the actual name of the City of El Paso Planning and Inspections intake facility on Texas Avenue. The banned phrase targets 'your one-stop shop for X' marketing, not the proper name of a government counter a reader has to walk into.",
  },
];

/** True when a matched string is an allowed exception. */
export const voiceAllowed = (match) =>
  VOICE_ALLOWLIST.some((a) => match.includes(a.literal) || a.literal.includes(match));

/**
 * Routes exempt from the bolded-listicle tell.
 *
 * A privacy policy and a terms page use bolded category lead-ins because a
 * reader scans them for the one clause that affects them, which is a
 * readability convention older than any of this and not an AI tell. The
 * exemption is per route and per rule rather than blanket: these pages are
 * still measured for every other structural tell.
 */
export const BOLD_LEADIN_EXEMPT = new Set(["/privacy", "/terms"]);
