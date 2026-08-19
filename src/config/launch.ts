/**
 * The compliance gate.
 *
 * TBPELS firm registration is not active yet. Until it is, this site must not
 * state that engineering services are currently being offered or performed in
 * Texas. That is not a marketing preference, it is the Texas Engineering
 * Practice Act, and the penalty for getting it wrong lands on the PE's license
 * rather than on the website.
 *
 * So the gate is a single read of one environment variable, and every CTA,
 * every footer, and every schema block asks it rather than hardcoding an
 * assumption. Two modes:
 *
 *   prelaunch  Order CTAs become waitlist forms. Copy speaks in the future
 *              tense. Footer discloses that registration is pending.
 *   live       Order flow activates. Footer renders the firm number.
 *
 * `live` additionally requires TBPELS_FIRM_NUMBER to be set, because a live
 * site with an empty firm number is the exact disclosure failure this gate
 * exists to prevent. Missing it degrades to prelaunch rather than shipping a
 * footer that says "TBPELS Firm No." followed by nothing.
 */

export type LaunchMode = "prelaunch" | "live";

const raw = (process.env.LAUNCH_MODE || "prelaunch").trim().toLowerCase();
const firmNumber = (process.env.TBPELS_FIRM_NUMBER || "").trim();

/**
 * Resolved mode. Note the degrade: `live` without a firm number is treated as
 * `prelaunch`, loudly in dev and silently in production, because failing shut
 * is the only safe direction for a licensure disclosure.
 */
export const LAUNCH_MODE: LaunchMode = raw === "live" && firmNumber ? "live" : "prelaunch";

if (raw === "live" && !firmNumber && process.env.NODE_ENV !== "production") {
  console.warn(
    "[launch] LAUNCH_MODE=live but TBPELS_FIRM_NUMBER is empty. Falling back to prelaunch: " +
      "a live footer with no firm number is worse than a prelaunch one.",
  );
}

export const IS_PRELAUNCH = LAUNCH_MODE === "prelaunch";
export const IS_LIVE = LAUNCH_MODE === "live";

/** Only meaningful in live mode; null in prelaunch so nothing can render an empty label. */
export const TBPELS_FIRM_NUMBER: string | null = IS_LIVE ? firmNumber : null;

/**
 * The two lines of licensure disclosure the footer renders, in order.
 * Kept here rather than in the Footer component so the placeholder audit and
 * the compliance copy read from the same source.
 */
export function licensureLines(): string[] {
  if (IS_LIVE) {
    return [`TBPELS Firm No. ${TBPELS_FIRM_NUMBER}`];
  }
  return [
    "Firm registration pending with the Texas Board of Professional Engineers and Land Surveyors.",
  ];
}

/**
 * How the site describes the seal, gate aware.
 *
 * WHY THIS IS A CONSTANT AND NOT A SENTENCE
 * -----------------------------------------
 * Until 2026-08-18 the chrome of this site said, on every page, that documents
 * are "reviewed and sealed by a licensed Texas Professional Engineer". Present
 * tense, passive voice, and no PE is hired. That is a claim the engineer of
 * record gate does not permit, and it survived an active voice regulatory check
 * for months because it contains none of the words that check looks for. The
 * shared library at scripts/lib/regulatory.mjs exists because a sibling site
 * made the identical mistake.
 *
 * Passive voice is how this claim gets made without anybody noticing they made
 * it. Removing the agent does not remove the assertion.
 *
 * So the phrasing lives here, switched by the gate, which also means the day the
 * PE is hired is a one line change rather than a sweep across fifty four pages.
 */
export const SEALING_PHRASE = IS_LIVE
  ? "reviewed and sealed by a licensed Texas Professional Engineer"
  : "each requiring the seal of a licensed Texas Professional Engineer";

/** Short form, for descriptions and cards where the long one does not fit. */
export const SEALING_PHRASE_SHORT = IS_LIVE
  ? "sealed by a licensed Texas PE"
  : "requiring a licensed Texas PE seal";

/** The label every primary CTA carries, so one word change moves the whole site. */
export const PRIMARY_CTA_LABEL = IS_LIVE ? "Order now" : "Join the waitlist";
export const PRIMARY_CTA_HREF = IS_LIVE ? "/order" : "/waitlist";

/** Short reassurance line under a CTA. Future tense in prelaunch, present in live. */
export const PRIMARY_CTA_NOTE = IS_LIVE
  ? "Flat rate, quoted before you order."
  : "Opening soon. Founding customers get first turnaround slots.";
