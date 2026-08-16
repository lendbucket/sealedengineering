/**
 * Brand and entity constants for Sealed Engineering.
 *
 * Sealed Engineering is a brand operating under the license and legal entity of
 * 254 Engineering Services LLC. Both names appear in schema and in the footer,
 * and they mean different things: the brand is what customers search for, the
 * LLC is who holds the license. Keeping the pair in one file is what stops the
 * two from drifting apart across fifty pages.
 *
 * Anything still awaiting an owner decision is null rather than invented. A
 * plausible placeholder phone number is invisible in review and ships; a null
 * that every consumer has to handle is not. See BACKLOG.md.
 */

export const SITE = {
  /** Consumer-facing brand. This is the SERP site name we are training. */
  brand: "Sealed Engineering",
  /** The licensed entity behind the brand. */
  legalEntity: "254 Engineering Services LLC",
  /** Rendered in the footer of every page. */
  legalLine: "Sealed Engineering is a brand of 254 Engineering Services LLC",
  domain: "sealedengineering.com",
  url: "https://sealedengineering.com",
  /** Parent brand site. Used for the parentOrganization schema edge. */
  parentUrl: "https://254engineering.com",
  /** Where careers traffic for PE roles is handed off. */
  parentCareersUrl: "https://254engineering.com/careers",
  email: "hello@sealedengineering.com",
  notifyEmail: "ceo@36west.org",
  /**
   * Owner decision pending: whether a public phone number is published at all,
   * and which one. Null until then. Every surface that would render a phone
   * checks for null rather than falling back to a number nobody answers.
   */
  phone: null as string | null,
  state: "Texas",
  stateCode: "TX",
  country: "US",
  /** The row this site writes into the shared eng_ tables. */
  siteKey: "sealed",
} as const;

/** og:site_name, application name, and the WebSite schema name all agree. */
export const SITE_NAME = SITE.brand;
