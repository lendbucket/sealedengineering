import type { Faq } from "@/data/types";

/**
 * Post bodies are structured data rather than JSX or MDX.
 *
 * The reason is the 1200 word floor. A post written as JSX cannot be measured
 * without parsing it, so the minimum becomes an intention nobody checks. As
 * blocks, the word count is a reduce over strings, which is what lets
 * scripts/meta-audit.mjs fail the build on a thin post instead of trusting that
 * one was not written.
 *
 * It also keeps the rendering to one component with no per-post markup, so a
 * heading in post six cannot quietly look different from a heading in post one.
 */
export type Block =
  | { h2: string }
  | { h3: string }
  | { p: string }
  | { ul: string[] }
  | { ol: string[] }
  | { callout: { title: string; body: string } };

export type Post = {
  slug: string;
  /** Meta title, keyword-leading, under 60 characters. */
  title: string;
  /** Meta description, under 155 characters. */
  description: string;
  /** On-page H1. May be longer and more natural than the meta title. */
  h1: string;
  /** One paragraph shown on the hub and under the H1. */
  excerpt: string;
  /** ISO date. */
  datePublished: string;
  dateModified?: string;
  /** Service slugs this post should send a reader to. */
  related: string[];
  body: Block[];
  faqs?: Faq[];
};

/** Words in a post body, used by the hub for reading time and by the audit. */
export function wordCount(post: Post): number {
  let text = post.excerpt;
  for (const b of post.body) {
    if ("p" in b) text += " " + b.p;
    else if ("h2" in b) text += " " + b.h2;
    else if ("h3" in b) text += " " + b.h3;
    else if ("ul" in b) text += " " + b.ul.join(" ");
    else if ("ol" in b) text += " " + b.ol.join(" ");
    else if ("callout" in b) text += " " + b.callout.title + " " + b.callout.body;
  }
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/** Reading time in minutes at a deliberately conservative 200 words per minute. */
export function readingMinutes(post: Post): number {
  return Math.max(1, Math.round(wordCount(post) / 200));
}
