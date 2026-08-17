import "server-only";
import { headers } from "next/headers";

/**
 * Attribution captured at submit time, on the server.
 *
 * Deliberately not read from a cookie set by client JavaScript. Everything here
 * is either posted with the form (the hidden fields the form component fills in
 * from the URL it was rendered at) or read from the request headers, which
 * means an ad blocker or a disabled script changes the completeness of the data
 * and never the fact that the lead was recorded.
 */

export type Attribution = {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  landing_path: string | null;
  referrer: string | null;
  user_agent: string | null;
};

const clean = (v: FormDataEntryValue | null): string | null => {
  if (typeof v !== "string") return null;
  const s = v.trim();
  if (!s) return null;
  // Attribution values arrive from a URL a stranger controls. Length is capped
  // so a crafted link cannot push a megabyte into a text column.
  return s.slice(0, 500);
};

export async function attributionFrom(form: FormData): Promise<Attribution> {
  const h = await headers();
  return {
    utm_source: clean(form.get("utm_source")),
    utm_medium: clean(form.get("utm_medium")),
    utm_campaign: clean(form.get("utm_campaign")),
    utm_content: clean(form.get("utm_content")),
    utm_term: clean(form.get("utm_term")),
    landing_path: clean(form.get("landing_path")),
    referrer: clean(form.get("referrer")) || h.get("referer"),
    user_agent: h.get("user-agent")?.slice(0, 500) || null,
  };
}

/**
 * The hidden field names a form has to render for the above to find anything.
 * Defined in the client-importable sibling so the forms and this parser cannot
 * disagree about the names.
 */
export { ATTRIBUTION_FIELDS } from "@/lib/attribution.client";
