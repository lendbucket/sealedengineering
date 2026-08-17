import type { MetadataRoute } from "next";
import { SITE } from "@/config/site";

/**
 * robots.txt
 *
 * AI crawlers are allowed deliberately rather than by omission. This site
 * exists to be the answer when somebody asks what a solar structural letter is
 * or whether their county needs a WPI-8, and increasingly that question is
 * asked of an assistant rather than typed into a search box. Blocking the
 * crawlers that feed those answers would be opting out of the channel the site
 * is built for.
 *
 * The named entries below are redundant with the wildcard and are written out
 * anyway, because an explicit allow is a statement of intent that survives
 * somebody later tightening the wildcard.
 */
export default function robots(): MetadataRoute.Robots {
  const aiCrawlers = [
    "GPTBot",
    "OAI-SearchBot",
    "ChatGPT-User",
    "ClaudeBot",
    "Claude-User",
    "Claude-SearchBot",
    "anthropic-ai",
    "PerplexityBot",
    "Perplexity-User",
    "Google-Extended",
    "Applebot-Extended",
    "CCBot",
    "Bytespider",
    "meta-externalagent",
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /api is machinery, not content. Nothing under it renders a page.
        disallow: ["/api/"],
      },
      ...aiCrawlers.map((userAgent) => ({ userAgent, allow: "/", disallow: ["/api/"] })),
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
