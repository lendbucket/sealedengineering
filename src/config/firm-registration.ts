/**
 * THE FIRM'S REGISTRATION, AS THE BOARD HOLDS IT. Operator ruling, 2026-10-19.
 *
 * Until that day this site said "Firm registration pending with the Texas Board
 * of Professional Engineers and Land Surveyors" in its footer, on its contact,
 * terms and waitlist pages, in its order refusal and in llms.txt, and Google
 * had indexed it on the contact page and the city pages. TBPELS issued F-29811
 * on 2026-09-10 and reissued it to 254 Engineering LLC on 2026-09-21, so the
 * sentence had been false for over a month.
 *
 * The statement below is the wording 254engineering.com renders through its
 * own `registrationStatement()`, typed here because this repository does not
 * share that register. If the board's record changes, this file and 254's
 * register change in the same sitting.
 *
 * Source: the TBPELS verification letter of 2026-09-21, recorded in the 254
 * repository's src/config/credentials.ts.
 */
export const FIRM_REGISTRATION = {
  issuedTo: "254 Engineering LLC",
  number: "F-29811",
  /** The last day the registration is active, as the board states it. */
  expires: "2027-07-31",
} as const;

/** True through the expiry date, read in Texas time. */
function isActive(today: Date = new Date()): boolean {
  const ymd = today.toLocaleDateString("en-CA", { timeZone: "America/Chicago" });
  return ymd <= FIRM_REGISTRATION.expires;
}

/**
 * The one registration sentence this site renders, or null once the
 * registration has lapsed, so a lapsed number is never stated as current.
 */
export function registrationStatement(today?: Date): string | null {
  if (!isActive(today)) return null;
  return `${FIRM_REGISTRATION.issuedTo} is a Texas registered engineering firm, TBPELS Firm Registration ${FIRM_REGISTRATION.number}.`;
}
