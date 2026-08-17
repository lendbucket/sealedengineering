import type { Metadata } from "next";
import { SITE, SITE_NAME } from "@/config/site";

/**
 * One place that builds page metadata, because the two things most likely to
 * rot across a fifty page site are the canonical and the og:site_name, and both
 * are invisible when wrong.
 *
 * Title and description lengths are asserted rather than trusted. Google
 * truncates around 60 and 155 characters respectively, and a truncated title is
 * a lost click on a page that otherwise ranks. In development a violation
 * throws, so it is caught while writing the page instead of in a crawl three
 * weeks later. In production it degrades to a warning: a long title is worse
 * than a short one, and both are better than a 500.
 */

export const TITLE_MAX = 60;
export const DESCRIPTION_MAX = 155;

type PageMetaInput = {
  /** Keyword-leading, under 60 characters, and unique across the site. */
  title: string;
  /** Under 155 characters, and unique across the site. */
  description: string;
  /** Site-root-relative path, with a leading slash and no trailing slash. */
  path: string;
  /** Set for pages that must not be indexed (thank-you pages, previews). */
  noindex?: boolean;
  /** Overrides the default OG image route for a page that has its own. */
  ogImage?: string;
};

function assertLengths(title: string, description: string, path: string) {
  const problems: string[] = [];
  if (title.length > TITLE_MAX) {
    problems.push(`title is ${title.length} chars (max ${TITLE_MAX}): ${JSON.stringify(title)}`);
  }
  if (description.length > DESCRIPTION_MAX) {
    problems.push(
      `description is ${description.length} chars (max ${DESCRIPTION_MAX}): ${JSON.stringify(description)}`,
    );
  }
  if (problems.length === 0) return;

  const message = `[seo] ${path}\n  ${problems.join("\n  ")}`;
  if (process.env.NODE_ENV === "production") console.warn(message);
  else throw new Error(message);
}

export function canonical(path: string): string {
  const clean = path === "/" ? "" : path.replace(/\/+$/, "");
  return `${SITE.url}${clean}`;
}

export function pageMeta({ title, description, path, noindex, ogImage }: PageMetaInput): Metadata {
  assertLengths(title, description, path);
  const url = canonical(path);

  return {
    // `absolute` rather than a bare string, and this is load-bearing.
    //
    // The root layout declares a title template of "%s | Sealed Engineering".
    // A bare string here would be run through it, so a title measured at 48
    // characters in this function would reach the browser at 69. The assertion
    // above would pass and the SERP would still truncate.
    //
    // Every title on this site already carries its own brand context, so the
    // template is the wrong tool for them. It stays declared in the layout as a
    // fallback for any page that forgets to call pageMeta at all.
    //
    // scripts/meta-audit.mjs measures the rendered <title> rather than this
    // value, which is how the discrepancy was found in the first place.
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      // og:site_name is the SERP site-name signal, and it has to say the brand
      // rather than the LLC on every single page for Google to accept it.
      siteName: SITE_NAME,
      title,
      description,
      url,
      locale: "en_US",
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
