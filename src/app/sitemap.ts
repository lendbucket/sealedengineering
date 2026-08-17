import type { MetadataRoute } from "next";
import { SITE } from "@/config/site";
import { IS_LIVE } from "@/config/launch";
import { SERVICES } from "@/data/services";
import { CITIES } from "@/data/cities";
import { INDUSTRIES } from "@/data/industries";
import { POSTS } from "@/data/posts";

/**
 * The sitemap.
 *
 * Two rules it obeys that are easy to get wrong:
 *
 *   1. Only canonical URLs. Every entry here is the exact string the page's
 *      canonical tag emits, because a sitemap that lists a URL the page does
 *      not claim as canonical is a contradiction a crawler has to resolve, and
 *      it resolves it by trusting neither.
 *
 *   2. Only the mode's real pages. /waitlist exists in prelaunch and redirects
 *      in live; /order is the reverse. Listing both would put a permanent
 *      redirect in the sitemap in whichever mode is running.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const url = (path: string) => `${SITE.url}${path === "/" ? "" : path}`;

  const entries: MetadataRoute.Sitemap = [
    { url: url("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: url("/services"), lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: url("/texas"), lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: url("/industries"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: url("/insights"), lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    {
      url: url(IS_LIVE ? "/order" : "/waitlist"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    { url: url("/careers"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: url("/contact"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: url("/privacy"), lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: url("/terms"), lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  for (const s of SERVICES) {
    entries.push({
      url: url(`/services/${s.slug}`),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    });
  }

  for (const c of CITIES) {
    entries.push({
      url: url(`/texas/${c.slug}`),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  for (const i of INDUSTRIES) {
    entries.push({
      url: url(`/industries/${i.slug}`),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  for (const p of POSTS) {
    entries.push({
      url: url(`/insights/${p.slug}`),
      lastModified: new Date(p.dateModified || p.datePublished),
      changeFrequency: "yearly",
      priority: 0.6,
    });
  }

  return entries;
}
