import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { AvailabilityNotice, CtaBand } from "@/components/sections/Cta";
import { Faqs } from "@/components/sections/Faqs";
import { ServiceCards } from "@/components/sections/ServiceCards";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMeta } from "@/lib/seo";
import { breadcrumbSchema, faqSchema, graph, type Crumb } from "@/lib/schema";
import { PRIMARY_CTA_HREF, PRIMARY_CTA_LABEL } from "@/config/launch";
import { INDUSTRIES, getIndustry } from "@/data/industries";

export function generateStaticParams() {
  return INDUSTRIES.map((i) => ({ industry: i.slug }));
}

export const dynamicParams = false;

type Params = { params: Promise<{ industry: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { industry: slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) return {};
  return pageMeta({
    title: industry.title,
    description: industry.description,
    path: `/industries/${industry.slug}`,
  });
}

export default async function IndustryPage({ params }: Params) {
  const { industry: slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) notFound();

  const crumbs: Crumb[] = [
    { name: "Home", path: "/" },
    { name: "Industries", path: "/industries" },
    { name: industry.name, path: `/industries/${industry.slug}` },
  ];

  const others = INDUSTRIES.filter((i) => i.slug !== industry.slug);

  return (
    <>
      <JsonLd
        json={graph(faqSchema(`/industries/${industry.slug}`, industry.faqs), breadcrumbSchema(crumbs))}
      />

      <Container className="pt-8">
        <Breadcrumbs crumbs={crumbs} />
      </Container>

      <section className="pt-8">
        <Container>
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-wax-600">
              {industry.name}
            </p>
            <h1 className="mt-4 text-[1.875rem] font-bold leading-tight text-seal-800 sm:text-[2.5rem]">
              {industry.h1}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">{industry.lede}</p>
            <div className="mt-8">
              <Button href={PRIMARY_CTA_HREF}>{PRIMARY_CTA_LABEL}</Button>
            </div>
            <AvailabilityNotice className="mt-8" />
          </div>
        </Container>
      </section>

      {/* The pain */}
      <section className="py-14 sm:py-16">
        <Container>
          <h2 className="text-2xl font-bold text-seal-800 sm:text-3xl">
            What actually goes wrong today
          </h2>
          <ul className="mt-8 grid gap-5 sm:grid-cols-2">
            {industry.pains.map((p) => (
              <li
                key={p.title}
                className="rounded-[var(--radius-card)] border border-line bg-paper-card p-7"
              >
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-seal-800">
                  {p.title}
                </h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">{p.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* The answer */}
      <section className="border-y border-line bg-paper-sunk py-14 sm:py-16">
        <Container>
          <h2 className="text-2xl font-bold text-seal-800 sm:text-3xl">What changes</h2>
          <ul className="mt-8 grid gap-5 sm:grid-cols-2">
            {industry.answers.map((a) => (
              <li key={a.title} className="rounded-[var(--radius-card)] bg-paper-card p-7">
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-seal-800">
                  {a.title}
                </h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">{a.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Services */}
      <section className="py-14 sm:py-16">
        <Container>
          <h2 className="text-2xl font-bold text-seal-800 sm:text-3xl">What this account orders</h2>
          <div className="mt-8">
            <ServiceCards only={industry.services} />
          </div>
          <div className="mt-9 rounded-[var(--radius-card)] border border-line-strong bg-wax-100 p-6">
            <p className="text-[0.9375rem] leading-relaxed text-ink">
              <strong className="font-semibold text-wax-700">At intake:</strong>{" "}
              {industry.intakeNote}
            </p>
          </div>
        </Container>
      </section>

      <Faqs faqs={industry.faqs} heading={`${industry.name}: common questions`} />

      <section className="py-14">
        <Container>
          <h2 className="text-2xl font-bold text-seal-800">Other repeat buyers</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {others.map((o) => (
              <li key={o.slug} className="flex">
                <Link
                  href={`/industries/${o.slug}`}
                  className="flex w-full flex-col rounded-[var(--radius-card)] border border-line bg-paper-card p-6 hover:border-seal-600"
                >
                  <span className="font-[family-name:var(--font-display)] text-lg font-bold text-seal-800">
                    {o.name}
                  </span>
                  <span className="mt-2 text-[0.9375rem] leading-relaxed text-ink-soft">
                    {o.lede}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CtaBand
        heading="Set up an account rather than an order"
        body={industry.intakeNote}
      />
    </>
  );
}
