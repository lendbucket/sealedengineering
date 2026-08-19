/**
 * The shared voice blocklist.
 *
 * Playbook Part 4 item 3 requires one list shared between site copy and email
 * templates "so the two surfaces cannot disagree". Both scripts/voice-audit.mjs
 * and scripts/email-audit.mjs import from here, and neither keeps a private
 * copy. A rule that exists twice is a rule that will exist in two versions.
 *
 * WHAT MOVED OUT, 2026-08-18
 * --------------------------
 * This file used to carry its own REGULATORY_RULES and CLAIM_RULES. Both are
 * deleted. They now live in scripts/lib/regulatory.mjs, which is a SYNCHRONIZED
 * file copied verbatim from the 254 repo and shared across all three brands.
 *
 * That was the right call and it was not merely tidier. The local rules were
 * written in the active voice, hunting for "we seal" and "we provide
 * engineering". The shared module was built after a sibling site passed exactly
 * those rules while claiming in twenty places that a licensed engineer was
 * already reviewing and sealing work, because every one of those claims was
 * written in the PASSIVE voice. "Work is reviewed and sealed by a licensed
 * Professional Engineer" makes the same claim as "we seal" and shares none of
 * its words.
 *
 * Do not re-add regulatory patterns here. Add them to regulatory.mjs, in both
 * voices, and copy that file back to 254.
 *
 * What remains in this file is the playbook's style list and the structural
 * exemptions, which are voice concerns rather than licensure ones.
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
export const BANNED_PATTERN = new RegExp(`\\b(?:${BANNED_PHRASES.map(lit).join("|")})\\b`, "gi");

/**
 * Puffery and superlative claims about this business.
 *
 * Kept here rather than moved to regulatory.mjs because these are marketing
 * excess rather than licensure exposure, and the shared module is deliberately
 * scoped to claims a Texas engineering board would care about.
 *
 * Both patterns require the superlative to attach to a business noun. Bare
 * "leading" and "best" match ordinary English that is not a claim: "a leading
 * cause of a document being sent back", "best practice". Both were flagged by
 * an earlier version of these rules and both were correct writing.
 */
export const PUFFERY_RULES = [
  {
    id: "puffery",
    why: "Unsupportable superlative about this business.",
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
 * compound modifier and is what this pattern isolates.
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
