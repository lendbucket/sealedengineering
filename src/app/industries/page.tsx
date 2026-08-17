import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { CtaBand } from "@/components/sections/Cta";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMeta } from "@/lib/seo";
import { breadcrumbSchema, graph, type Crumb } from "@/lib/schema";
import { INDUSTRIES } from "@/data/industries";

export const metadata: Metadata = pageMeta({
  title: "Engineering Accounts for Texas Businesses",
  description:
    "One engineering relationship for solar installers, lenders and loan officers, and realtors and title companies working across Texas.",
  path: "/industries",
});

const CRUMBS: Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Industries", path: "/industries" },
];

export default function IndustriesHubPage() {
  return (
    <>
      <JsonLd json={graph(breadcrumbSchema(CRUMBS))} />

      <Container className="pt-8">
        <Breadcrumbs crumbs={CRUMBS} />
      </Container>

      <section className="pt-8 pb-14">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-[2rem] font-bold leading-tight text-seal-800 sm:text-[2.75rem]">
              Engineering accounts for businesses that order every week
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">
              Three groups order most of this work repeatedly, and none of them are buying a
              document. They are buying the day it takes off a permit calendar, the condition it
              clears in underwriting, or the argument it ends in a negotiation. These pages are
              written for that, rather than for a one time order.
            </p>
          </div>

          <ul className="mt-10 grid gap-5 lg:grid-cols-3">
            {INDUSTRIES.map((i) => (
              <li key={i.slug} className="flex">
                <Link
                  href={`/industries/${i.slug}`}
                  className="group flex w-full flex-col rounded-[var(--radius-card)] border border-line bg-paper-card p-7 transition-colors hover:border-seal-600"
                >
                  <span className="font-[family-name:var(--font-display)] text-xl font-bold text-seal-800">
                    {i.name}
                  </span>
                  <span className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-ink-soft">
                    {i.lede}
                  </span>
                  <span className="mt-5 text-sm font-semibold text-seal-700 group-hover:text-wax-700">
                    How the account works
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CtaBand heading="Tell us what you order and how often" body="Volume is set up as an account rather than as a series of orders." />
    </>
  );
}
