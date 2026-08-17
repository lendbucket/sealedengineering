import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { AvailabilityNotice, CtaBand } from "@/components/sections/Cta";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMeta } from "@/lib/seo";
import { breadcrumbSchema, graph, type Crumb } from "@/lib/schema";
import { CITIES, citiesByRegion } from "@/data/cities";

export const metadata: Metadata = pageMeta({
  title: "Texas Engineering Letters by City | Sealed PE",
  description:
    "Sealed engineering letters across 25 Texas cities. Wind zone, soil, and the permit office that reviews it, written for each market rather than templated.",
  path: "/texas",
});

const CRUMBS: Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Texas cities", path: "/texas" },
];

export default function TexasHubPage() {
  const groups = citiesByRegion();
  const windstorm = CITIES.filter((c) => c.windstormArea);

  return (
    <>
      <JsonLd json={graph(breadcrumbSchema(CRUMBS))} />

      <Container className="pt-8">
        <Breadcrumbs crumbs={CRUMBS} />
      </Container>

      <section className="pt-8">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-[2rem] font-bold leading-tight text-seal-800 sm:text-[2.75rem]">
              Sealed engineering letters across Texas, city by city
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">
              Design wind speed in this state runs from around 100 miles per hour in the interior
              past 150 on the lower coast. Soil runs from Houston Black clay that moves inches
              every season to Permian caliche that barely moves at all. Fourteen counties carry a
              windstorm certification requirement the rest of the state has never heard of.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">
              None of that is decoration. It changes what a document has to say and which office
              reviews it, which is why each page below is written for its market.
            </p>
          </div>
          <AvailabilityNotice className="mt-8 max-w-3xl" />
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <div className="rounded-[var(--radius-card)] border border-line-strong bg-paper-sunk p-7">
            <h2 className="font-[family-name:var(--font-display)] text-lg font-bold text-seal-800">
              The windstorm line
            </h2>
            <p className="mt-3 max-w-3xl text-[0.9375rem] leading-relaxed text-ink">
              The Texas Department of Insurance designates fourteen seaward counties plus the part
              of Harris County east of Highway 146. Inside that area, construction has to be
              documented with a WPI-8 certificate of compliance before windstorm coverage will be
              written or continued. Outside it, there is no such requirement at all. These Tier 1
              markets sit inside it.
            </p>
            <ul className="mt-5 flex flex-wrap gap-2.5">
              {windstorm.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/texas/${c.slug}`}
                    className="inline-flex rounded-full border border-wax-600 bg-wax-100 px-4 py-2 text-sm font-semibold text-wax-700 hover:bg-paper-card"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {groups.map((g) => (
        <section key={g.region} className="pb-12">
          <Container>
            <h2 className="text-2xl font-bold text-seal-800">{g.region}</h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {g.cities.map((c) => (
                <li key={c.slug} className="flex">
                  <Link
                    href={`/texas/${c.slug}`}
                    className="group flex w-full flex-col rounded-[var(--radius-card)] border border-line bg-paper-card p-6 transition-colors hover:border-seal-600"
                  >
                    <span className="font-[family-name:var(--font-display)] text-lg font-bold text-seal-800">
                      {c.name}
                    </span>
                    <span className="mt-1 text-xs font-semibold uppercase tracking-[0.1em] text-wax-600">
                      {c.county}
                      {c.windstormArea ? " . WPI-8 area" : ""}
                    </span>
                    <span className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">
                      {c.soil.label}
                    </span>
                    <span className="mt-2 text-[0.9375rem] leading-relaxed text-ink-soft">
                      Wind: {c.wind.band}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ))}

      <section className="border-t border-line py-14">
        <Container width="narrow">
          <h2 className="text-2xl font-bold text-seal-800">Not on this list?</h2>
          <p className="mt-4 text-base leading-relaxed text-ink">
            These 25 are the markets with pages written for them, not the limit of where documents
            go. Deliverables produced from documents are prepared for any Texas address. Anything
            requiring a site observation is scheduled around a certified field technician reaching
            the property, which is what sets the timeline in the more remote parts of the state.
          </p>
          <p className="mt-4 text-base leading-relaxed text-ink">
            More city pages are added in waves rather than all at once. A page that cannot say
            something true and specific about its market is worse than no page, so each one waits
            until it can.
          </p>
        </Container>
      </section>

      <CtaBand heading="Tell us where the property is" body="The address decides the wind speed, the soil, and which office reviews it." />
    </>
  );
}
