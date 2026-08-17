/**
 * The attribution field names, in a module a client component can import.
 *
 * lib/attribution.ts is `server-only` because it reads request headers. The
 * hidden inputs that feed it are rendered in the browser, so the list of names
 * has to live somewhere both sides can reach. Splitting the constant out is the
 * cheapest way to keep the server module genuinely server-only rather than
 * relaxing it and losing the build-time guarantee.
 *
 * lib/attribution.ts re-exports from here, so there is still one definition.
 */
export const ATTRIBUTION_FIELDS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "landing_path",
  "referrer",
] as const;

export type AttributionField = (typeof ATTRIBUTION_FIELDS)[number];
