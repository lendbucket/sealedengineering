import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { CtaBand } from "@/components/sections/Cta";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMeta } from "@/lib/seo";
import { breadcrumbSchema, graph, type Crumb } from "@/lib/schema";
import { POSTS } from "@/data/posts";
import { readingMinutes } from "@/data/posts/types";

export const metadata: Metadata = pageMeta({
  title: "Texas Engineering Letters Explained | Insights",
  description:
    "Plain English explanations of the sealed documents Texas permit offices, lenders, and insurers ask for, written by people who issue them.",
  path: "/insights",
});

const CRUMBS: Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Insights", path: "/insights" },
];

export default function InsightsHubPage() {
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
              Insights
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">
              Almost nobody reads about engineering documents for pleasure. These are written for
              the person who has been handed a requirement and needs to understand it before
              spending money on it. No sales copy, no hedging, and the parts that are genuinely
              uncertain are written as uncertain.
            </p>
          </div>

          <ul className="mt-12 grid gap-5 lg:grid-cols-2">
            {POSTS.map((p) => (
              <li key={p.slug} className="flex">
                <Link
                  href={`/insights/${p.slug}`}
                  className="group flex w-full flex-col rounded-[var(--radius-card)] border border-line bg-paper-card p-7 transition-colors hover:border-seal-600"
                >
                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-wax-600">
                    {readingMinutes(p)} minute read
                  </span>
                  <span className="mt-3 font-[family-name:var(--font-display)] text-xl font-bold leading-snug text-seal-800">
                    {p.h1}
                  </span>
                  <span className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-ink-soft">
                    {p.excerpt}
                  </span>
                  <span className="mt-5 text-sm font-semibold text-seal-700 group-hover:text-wax-700">
                    Read it
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CtaBand
        heading="Still not sure which document you need?"
        body="Send the plan review comment or the underwriter condition. It names the document more precisely than any description of the situation does."
      />
    </>
  );
}
