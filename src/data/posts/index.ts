import type { Post } from "@/data/posts/types";
import { post as sealedLetter } from "@/data/posts/sealed-engineering-letter";
import { post as solarTexas } from "@/data/posts/solar-structural-letter-texas";
import { post as fhaVa } from "@/data/posts/fha-va-foundation-certification";
import { post as roofCert } from "@/data/posts/roof-certification-letter-covers";
import { post as wpi8 } from "@/data/posts/wpi-8-windstorm-explained";
import { post as permitLetter } from "@/data/posts/when-permit-office-requires-engineer";
import { post as windstormLookup } from "@/data/posts/look-up-windstorm-certificate";

/**
 * Newest first is deliberately NOT the order here.
 *
 * All six launch posts share a publication date, so sorting by date would give
 * an arbitrary order that changes whenever a file is touched. They are listed
 * in reading order instead: the general explainer first, then the specific
 * deliverables. Once posts have genuinely different dates, the hub can sort by
 * date and this comment can go.
 */
export const POSTS: Post[] = [sealedLetter, solarTexas, fhaVa, roofCert, wpi8, windstormLookup, permitLetter];

export const POST_SLUGS = POSTS.map((p) => p.slug);

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}

export type { Post };
