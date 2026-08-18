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
import { breadcrumbSchema, faqSchema, graph, serviceSchema, type Crumb } from "@/lib/schema";
import { PRIMARY_CTA_HREF, PRIMARY_CTA_LABEL } from "@/config/launch";
import { SERVICES, getService } from "@/data/services";
import { CITIES, getCity } from "@/data/cities";
import type { EvidenceMode } from "@/data/types";

/**
 * The ten service pages. Fully static: every slug is known at build time and
 * nothing on the page reads a request.
 */
export function generateStaticParams() {
  return SERVICES.map((s) => ({ service: s.slug }));
}

export const dynamicParams = false;

const EVIDENCE_LABEL: Record<EvidenceMode, string> = {
  upload: "Document review, no site visit",
  "site-visit": "Site visit required",
  either: "Documents or a site visit, depending on conditions",
};

type Params = { params: Promise<{ service: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { service: slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return pageMeta({
    title: service.title,
    description: service.description,
    path: `/services/${service.slug}`,
  });
}

export default async function ServicePage({ params }: Params) {
  const { service: slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const crumbs: Crumb[] = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: service.name, path: `/services/${service.slug}` },
  ];

  // No slice. There was a .slice(0, 8) here, and it silently swallowed the
  // ninth entry when san-angelo was added to close the one city with no
  // inbound link from any money page. A cap that drops data without saying so
  // turns an editorial decision in the data file into a no-op nobody notices;
  // link-map reported zero change and the fix looked applied. The lists are
  // curated per service and none is long enough to need truncating.
  const emphasisCities = (service.emphasisCities || [])
    .map((c) => getCity(c))
    .filter((c) => c !== undefined);

  return (
    <>
      <JsonLd
        json={graph(
          serviceSchema({
            name: service.fullName,
            description: service.description,
            path: `/services/${service.slug}`,
            serviceType: service.keyword,
          }),
          faqSchema(`/services/${service.slug}`, service.faqs),
          breadcrumbSchema(crumbs),
        )}
      />

      <Container className="pt-8">
        <Breadcrumbs crumbs={crumbs} />
      </Container>

      {/* Hero */}
      <section className="pt-8">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-14">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-wax-600">
                {EVIDENCE_LABEL[service.evidenceMode]}
              </p>
              <h1 className="mt-4 text-[1.875rem] font-bold leading-tight text-seal-800 sm:text-[2.5rem]">
                {service.h1}
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-ink-soft">{service.lede}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href={`${PRIMARY_CTA_HREF}?service=${service.slug}`}>
                  {PRIMARY_CTA_LABEL}
                </Button>
                <Button href="#what-arrives" variant="secondary">
                  See what arrives
                </Button>
              </div>
              <AvailabilityNotice className="mt-8" />
            </div>

            <aside className="rounded-[var(--radius-card)] border border-line bg-paper-sunk p-7">
              <h2 className="font-[family-name:var(--font-display)] text-base font-bold text-seal-800">
                Who orders this
              </h2>
              <dl className="mt-5 space-y-5">
                {service.whoNeedsIt.map((w) => (
                  <div key={w.who}>
                    <dt className="text-sm font-semibold text-seal-800">{w.who}</dt>
                    <dd className="mt-1.5 text-sm leading-relaxed text-ink-soft">{w.why}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          </div>
        </Container>
      </section>

      {/* Explanation */}
      <section className="py-14 sm:py-16">
        <Container width="narrow">
          <div className="prose">
            {service.sections.map((sec) => (
              <div key={sec.heading}>
                <h2>{sec.heading}</h2>
                {sec.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
                {sec.bullets && (
                  <ul>
                    {sec.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Deliverable and evidence */}
      <section id="what-arrives" className="border-y border-line bg-paper-sunk py-14 sm:py-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <h2 className="text-2xl font-bold text-seal-800">What arrives</h2>
              <ul className="mt-6 space-y-3.5">
                {service.deliverable.map((d) => (
                  <li key={d} className="flex gap-3 text-[0.9375rem] leading-relaxed text-ink">
                    <Check />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm leading-relaxed text-ink-soft">{service.turnaround}</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-seal-800">What has to exist first</h2>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">
                An engineer seals what the evidence supports, so this list is the work rather than
                the paperwork around it. Anything missing is named rather than assumed.
              </p>
              <ul className="mt-6 space-y-3.5">
                {service.evidence.map((ev) => (
                  <li key={ev} className="flex gap-3 text-[0.9375rem] leading-relaxed text-ink">
                    <Dot />
                    <span>{ev}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <Faqs faqs={service.faqs} heading={`${service.name}: common questions`} />

      {/* Local emphasis */}
      {emphasisCities.length > 0 && (
        <section className="py-14 sm:py-16">
          <Container>
            <h2 className="text-2xl font-bold text-seal-800">
              Where this is ordered most in Texas
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-soft">
              Wind speed, soil, and the permit office all change by market, and so does what this
              document has to address. These pages are written for the market rather than templated
              across it.
            </p>
            <ul className="mt-7 flex flex-wrap gap-2.5">
              {emphasisCities.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/texas/${c.slug}`}
                    className="inline-flex rounded-full border border-line bg-paper-card px-4 py-2 text-sm font-medium text-seal-800 hover:border-seal-600"
                  >
                    {service.name} in {c.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/texas"
                  className="inline-flex rounded-full bg-seal-800 px-4 py-2 text-sm font-semibold text-on-seal hover:bg-seal-700"
                >
                  All {CITIES.length} Texas cities
                </Link>
              </li>
            </ul>
          </Container>
        </section>
      )}

      {/* Related */}
      <section className="border-t border-line py-14 sm:py-16">
        <Container>
          <h2 className="text-2xl font-bold text-seal-800">Often needed alongside this</h2>
          <div className="mt-7">
            <ServiceCards only={service.related} />
          </div>
        </Container>
      </section>

      <CtaBand
        heading={`Need a ${service.fullName.toLowerCase()}?`}
        body={service.evidence[0] ? `Start with the property address and we will tell you exactly what else is needed.` : undefined}
      />
    </>
  );
}

function Check() {
  return (
    <svg
      viewBox="0 0 20 20"
      width="18"
      height="18"
      aria-hidden="true"
      focusable="false"
      className="mt-1 shrink-0 text-seal-600"
    >
      <path
        d="M4 10.5l4 4 8-9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function Dot() {
  return (
    <svg
      viewBox="0 0 20 20"
      width="18"
      height="18"
      aria-hidden="true"
      focusable="false"
      className="mt-1 shrink-0 text-wax-600"
    >
      <circle cx="10" cy="10" r="3.5" fill="currentColor" />
    </svg>
  );
}
