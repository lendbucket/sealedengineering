import { FIRM_REGISTRATION } from "@/config/firm-registration";

/**
 * The only credentials this site is allowed to publish.
 *
 * WHY THIS IS A CONFIG FILE AND NOT A COMMENT
 * -------------------------------------------
 * A professional engineer's name and licence number are the two pieces of text
 * on an engineering site that must never be wrong, and they are also the two
 * most likely to be invented. A drafted page that says "sealed by John Smith,
 * P.E., Texas License No. 98765" reads as finished work and is a false
 * statement about a real regulated credential. It would not trip a spellcheck,
 * a reviewer, or any of the other audits.
 *
 * So the rule is inverted: scripts/placeholder-audit.mjs extracts every PE
 * name, licence number, and firm registration number it can find in rendered
 * output and fails the build on anything not listed here. Publishing a
 * credential is therefore a deliberate edit to this file rather than a side
 * effect of writing copy.
 *
 * The two engineer lists are empty on purpose: no individual engineer is named
 * anywhere on the site. The firm list holds the board's registration from
 * 2026-10-19, when the site began stating it.
 */

/** Full names permitted to appear alongside a P.E. designation. */
export const VERIFIED_PE_NAMES: readonly string[] = [];

/**
 * Texas PE licence numbers permitted to appear. Digits only, as they read on
 * the board roster, without a prefix.
 */
export const VERIFIED_PE_LICENSE_NUMBERS: readonly string[] = [];

/**
 * TBPELS firm registration numbers permitted to appear.
 *
 * The registration in src/config/firm-registration.ts, which every page now
 * states, and nothing else. A TBPELS_FIRM_NUMBER in the environment that
 * differs from the board's record renders in live mode and fails the audit,
 * which is the point. It was derived from that variable, and empty in
 * prelaunch, until 2026-10-19, while the registration was described as pending.
 */
export const VERIFIED_FIRM_NUMBERS: readonly string[] = [FIRM_REGISTRATION.number];

/** Normalised for comparison: case folded, punctuation and spacing removed. */
export function normalizeCredential(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}
