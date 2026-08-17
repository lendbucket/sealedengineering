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
import { CITIES, getCity } from "@/data/cities";
import { getService } from "@/data/services";

export function generateStaticParams() {
  return CITIES.map((c) => ({ city: c.slug }));
}

export const dynamicParams = false;

type Params = { params: Promise<{ city: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { city: slug } = await params;
  const city = getCity(slug);
  if (!city) return {};
  return pageMeta({
    title: city.title,
    description: city.description,
    path: `/texas/${city.slug}`,
  });
}

export default async function CityPage({ params }: Params) {
  const { city: slug } = await params;
  const city = getCity(slug);
  if (!city) notFound();

  const crumbs: Crumb[] = [
    { name: "Home", path: "/" },
    { name: "Texas cities", path: "/texas" },
    { name: city.name, path: `/texas/${city.slug}` },
  ];

  const primary = getService(city.emphasis[0]);
  const nearby = city.nearby.map((n) => getCity(n)).filter((c) => c !== undefined);

  const FACTS = [
    { label: "County", value: city.county },
    { label: "Region", value: city.region },
    { label: "Design wind speed", value: city.wind.band, note: city.wind.note },
    { label: "Soil", value: city.soil.label, note: city.soil.note },
    { label: "Residential plan review", value: city.permitOffice.name, note: city.permitOffice.note },
    {
      label: "TDI windstorm area",
      value: city.windstormArea
        ? "Yes, WPI-8 certification applies"
        : "No, WPI-8 does not apply here",
    },
  ];

  return (
    <>
      <JsonLd
        json={graph(
          ...(primary
            ? [
                serviceSchema({
                  name: `${primary.fullName} in ${city.name}, Texas`,
                  description: city.description,
                  path: `/texas/${city.slug}`,
                  serviceType: primary.keyword,
                  areaServed: city.name,
                }),
              ]
            : []),
          faqSchema(`/texas/${city.slug}`, city.faqs),
          breadcrumbSchema(crumbs),
        )}
      />

      <Container className="pt-8">
        <Breadcrumbs crumbs={crumbs} />
      </Container>

      {/* Hero */}
      <section className="pt-8">
        <Container>
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-wax-600">
              {city.county}
              {city.windstormArea ? " . TDI windstorm area" : ""}
            </p>
            <h1 className="mt-4 text-[1.875rem] font-bold leading-tight text-seal-800 sm:text-[2.5rem]">
              {city.h1}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">{city.lede}</p>
            <div className="mt-8">
              <Button href={PRIMARY_CTA_HREF}>{PRIMARY_CTA_LABEL}</Button>
            </div>
            <AvailabilityNotice className="mt-8" />
          </div>
        </Container>
      </section>

      {/* The local facts table */}
      <section className="py-14">
        <Container>
          <h2 className="text-2xl font-bold text-seal-800">
            What governs engineering work in {city.name}
          </h2>
          <dl className="mt-7 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line sm:grid-cols-2">
            {FACTS.map((f) => (
              <div key={f.label} className="bg-paper-card p-6">
                <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-wax-600">
                  {f.label}
                </dt>
                <dd className="mt-2 text-base font-semibold text-seal-800">{f.value}</dd>
                {f.note && (
                  <dd className="mt-2 text-sm leading-relaxed text-ink-soft">{f.note}</dd>
                )}
              </div>
            ))}
          </dl>
          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-ink-soft">
            Wind speeds are the ASCE 7 band for the area and are given as planning context. Every
            sealed document uses the value looked up for the specific site address, along with the
            exposure category that actually applies to that site.
          </p>
        </Container>
      </section>

      {/* The genuinely local part */}
      <section className="border-y border-line bg-paper-sunk py-14 sm:py-16">
        <Container width="narrow">
          <div className="prose">
            <h2>Engineering in {city.name}, in practice</h2>
            {city.local.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </Container>
      </section>

      {/* Services emphasized here */}
      <section className="py-14 sm:py-16">
        <Container>
          <h2 className="text-2xl font-bold text-seal-800">
            What {city.name} orders most
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-soft">
            Ordered by local weight rather than alphabetically. Every deliverable in the catalog is
            available for a {city.name} address; these are the ones this market actually asks for.
          </p>
          <div className="mt-8">
            <ServiceCards only={city.emphasis} />
          </div>
          <p className="mt-7">
            <Link
              href="/services"
              className="text-[0.9375rem] font-semibold text-seal-800 underline underline-offset-4 hover:text-wax-700"
            >
              See all ten deliverables
            </Link>
          </p>
        </Container>
      </section>

      <Faqs faqs={city.faqs} heading={`${city.name} questions`} />

      {/* Nearby */}
      {nearby.length > 0 && (
        <section className="py-14">
          <Container>
            <h2 className="text-2xl font-bold text-seal-800">Nearby Texas markets</h2>
            <ul className="mt-6 flex flex-wrap gap-2.5">
              {nearby.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/texas/${c.slug}`}
                    className="inline-flex rounded-full border border-line bg-paper-card px-4 py-2 text-sm font-medium text-seal-800 hover:border-seal-600"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/texas"
                  className="inline-flex rounded-full bg-seal-800 px-4 py-2 text-sm font-semibold text-on-seal hover:bg-seal-700"
                >
                  All {CITIES.length} cities
                </Link>
              </li>
            </ul>
          </Container>
        </section>
      )}

      <CtaBand
        heading={`Sealed documents for ${city.name} property`}
        body={`Tell us the address and the document you have been asked for. ${city.name} sits in ${city.county}, and both the wind values and the reviewing office follow from that.`}
      />
    </>
  );
}
