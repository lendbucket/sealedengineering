import { SITE, SITE_NAME } from "@/config/site";
import { IS_LIVE, SEALING_PHRASE, TBPELS_FIRM_NUMBER } from "@/config/launch";
import { canonical } from "@/lib/seo";

/**
 * JSON-LD builders.
 *
 * The entity model matters more here than the markup does. Sealed Engineering
 * is a brand; 254 Engineering Services LLC is the legal person that holds the
 * engineering license. Google is being told exactly that: an Organization for
 * the brand, with `parentOrganization` pointing at the LLC and a stable @id per
 * node so the graph resolves to one entity rather than fifty copies.
 *
 * What is deliberately absent: AggregateRating and Review. There are no real
 * reviews yet, and rating schema without them is both a policy violation and a
 * manual action waiting to happen. It goes in when the reviews are real.
 */

const ORG_ID = `${SITE.url}/#organization`;
const WEBSITE_ID = `${SITE.url}/#website`;
const PARENT_ID = `${SITE.parentUrl}/#organization`;

type Json = Record<string, unknown>;

export function organizationSchema(): Json {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE_NAME,
    legalName: SITE.legalEntity,
    url: SITE.url,
    description:
      "Sealed engineering letters, certifications, and small plan sets for Texas property, " +
      `${SEALING_PHRASE}.`,
    parentOrganization: {
      "@type": "Organization",
      "@id": PARENT_ID,
      name: SITE.legalEntity,
      url: SITE.parentUrl,
    },
    brand: { "@type": "Brand", name: SITE_NAME },
    areaServed: { "@type": "State", name: "Texas" },
    email: SITE.email,
    ...(SITE.phone ? { telephone: SITE.phone } : {}),
    // Only asserted once the registration exists. An identifier for a
    // registration that has not been granted is a false statement to a search
    // engine and to a regulator reading the same page.
    ...(IS_LIVE && TBPELS_FIRM_NUMBER
      ? {
          identifier: {
            "@type": "PropertyValue",
            propertyID: "TBPELS Firm Registration",
            value: TBPELS_FIRM_NUMBER,
          },
        }
      : {}),
  };
}

export function websiteSchema(): Json {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    // This is the field Google reads for the SERP site name. It says the brand.
    name: SITE_NAME,
    url: SITE.url,
    publisher: { "@id": ORG_ID },
    inLanguage: "en-US",
  };
}

export type Crumb = { name: string; path: string };

export function breadcrumbSchema(crumbs: Crumb[]): Json {
  return {
    "@type": "BreadcrumbList",
    "@id": `${canonical(crumbs[crumbs.length - 1].path)}#breadcrumb`,
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: canonical(c.path),
    })),
  };
}

export function serviceSchema(input: {
  name: string;
  description: string;
  path: string;
  serviceType: string;
  /** City name when the page is geo-scoped, otherwise the whole state. */
  areaServed?: string;
}): Json {
  return {
    "@type": "Service",
    "@id": `${canonical(input.path)}#service`,
    name: input.name,
    description: input.description,
    serviceType: input.serviceType,
    provider: { "@id": ORG_ID },
    areaServed: input.areaServed
      ? { "@type": "City", name: input.areaServed, containedInPlace: { "@type": "State", name: "Texas" } }
      : { "@type": "State", name: "Texas" },
    // No `offers` node with a price. Pricing is a pending owner item, and an
    // invented price in schema is the kind of number that outlives the page.
  };
}

export type Faq = { q: string; a: string };

export function faqSchema(path: string, faqs: Faq[]): Json {
  return {
    "@type": "FAQPage",
    "@id": `${canonical(path)}#faq`,
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function blogPostingSchema(input: {
  headline: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified?: string;
  wordCount?: number;
}): Json {
  return {
    "@type": "BlogPosting",
    "@id": `${canonical(input.path)}#post`,
    headline: input.headline,
    description: input.description,
    mainEntityOfPage: canonical(input.path),
    datePublished: input.datePublished,
    dateModified: input.dateModified || input.datePublished,
    ...(input.wordCount ? { wordCount: input.wordCount } : {}),
    // Authored and reviewed by the licensed entity, not by a persona nobody can
    // look up on the board's roster.
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    inLanguage: "en-US",
  };
}

/**
 * Wrap nodes into one @graph document.
 *
 * One script tag per page rather than several: separate blocks are legal, but a
 * single graph is what makes the @id references above resolve into one entity
 * instead of several partially-described ones.
 */
export function graph(...nodes: Json[]): string {
  return JSON.stringify({ "@context": "https://schema.org", "@graph": nodes });
}
