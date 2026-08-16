export type Faq = { q: string; a: string };

/**
 * How the evidence behind a seal is gathered. This is a real distinction, not a
 * marketing one: an engineer can seal a solar attachment analysis from a plan
 * set and a photo set, and cannot seal a foundation certification without
 * somebody measuring the actual foundation.
 */
export type EvidenceMode = "upload" | "site-visit" | "either";

export type Service = {
  slug: string;
  /** Short label for cards and navigation. */
  name: string;
  /** Longer descriptive name used in schema and breadcrumbs. */
  fullName: string;
  /** The primary keyword this page is built to win. */
  keyword: string;
  title: string;
  description: string;
  h1: string;
  /** One or two sentences under the H1. Plain English, no adjectives doing work. */
  lede: string;
  evidenceMode: EvidenceMode;
  /** Who orders this, in the buyer's own words. */
  whoNeedsIt: { who: string; why: string }[];
  /** Body of the page: headed sections of expert explanation. */
  sections: { heading: string; paragraphs: string[]; bullets?: string[] }[];
  /** Exactly what arrives, itemized. */
  deliverable: string[];
  /** What the engineer needs before anything can be sealed. */
  evidence: string[];
  /** Typical turnaround framing. No promise, no guarantee. */
  turnaround: string;
  faqs: Faq[];
  /** Slugs of services a buyer of this one commonly also needs. */
  related: string[];
  /** Cities where this service carries unusual local weight. */
  emphasisCities?: string[];
};
