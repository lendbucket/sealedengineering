import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { ApplicationForm } from "@/components/forms/ApplicationForm";
import { pageMeta } from "@/lib/seo";
import { breadcrumbSchema, graph, type Crumb } from "@/lib/schema";
import { SITE } from "@/config/site";
import { CITIES } from "@/data/cities";

export const metadata: Metadata = pageMeta({
  title: "Field Technician Jobs in Texas | Sealed Engineering",
  description:
    "Field technician work across Texas: foundation elevation surveys, roof observations, and photographic records for a licensed PE. Paid per job or salaried.",
  path: "/careers",
});

const CRUMBS: Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Careers", path: "/careers" },
];

const WHAT_YOU_DO = [
  "Run a relative elevation survey on a residential foundation with a digital level, on a grid, and record it accurately enough that somebody can repeat it a year later.",
  "Get into a crawl space with a light and a camera and document footings, piers, anchorage, and enclosure against a checklist that does not move.",
  "Observe a roof safely, from the surface where the pitch and covering allow it and from a ladder at the eave where they do not, and photograph what is actually there.",
  "Record HUD data plate and label numbers, serial numbers, and measurements exactly as they read, including when they are inconvenient.",
  "Show up when you said you would, because on the other end of that appointment is a closing date somebody has already moved twice.",
];

const WHAT_YOU_DO_NOT = [
  "You do not perform engineering. You gather evidence.",
  "You do not issue opinions, conclusions, or certifications to a customer.",
  "You do not tell a homeowner whether their foundation is failing, whether their roof will pass, or what a repair should cost.",
  "You do not adjust an observation because somebody would prefer a different answer. That is the whole job, stated in one sentence.",
];

export default function CareersPage() {
  const markets = CITIES.slice(0, 12);

  return (
    <>
      <JsonLd json={graph(breadcrumbSchema(CRUMBS))} />

      <Container className="pt-8">
        <Breadcrumbs crumbs={CRUMBS} />
      </Container>

      <section className="pt-8">
        <Container>
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-wax-600">
              Field technician, across Texas
            </p>
            <h1 className="mt-4 text-[1.875rem] font-bold leading-tight text-seal-800 sm:text-[2.5rem]">
              The evidence behind every seal is somebody standing on the property
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">
              An engineer can only seal what the evidence supports, which makes the person
              gathering that evidence the most consequential role in this business. If you are
              precise, you show up on time, and you write down what you actually saw, the rest is
              teachable.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-14 sm:py-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <h2 className="text-2xl font-bold text-seal-800">What the work is</h2>
              <ul className="mt-6 space-y-4">
                {WHAT_YOU_DO.map((w) => (
                  <li key={w} className="text-[0.9375rem] leading-relaxed text-ink">
                    {w}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-seal-800">What the work is not</h2>
              <ul className="mt-6 space-y-4">
                {WHAT_YOU_DO_NOT.map((w) => (
                  <li key={w} className="text-[0.9375rem] leading-relaxed text-ink">
                    {w}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm leading-relaxed text-ink-soft">
                Every engineering opinion and every seal is the work of a licensed Texas
                Professional Engineer, under the license and registration of {SITE.legalEntity}.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-line bg-paper-sunk py-14 sm:py-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <h2 className="text-2xl font-bold text-seal-800">Who tends to be good at it</h2>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink">
                Home inspectors, roofers, framers, surveyors, HVAC and plumbing techs, and people
                who have spent time in crawl spaces for any reason at all. Also people from
                completely outside construction who are careful, methodical, and comfortable being
                told their measurement was wrong. The second group is often better, because they
                have not learned to eyeball anything yet.
              </p>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink">
                You need reliable transport, a valid driver license, and a phone that takes decent
                photographs. Equipment and training on the survey procedure are provided.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-seal-800">Where the work is</h2>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink">
                Work is assigned by how close you are to the property, so being based somewhere
                with volume matters more than being based somewhere large. These are the markets
                with the most site work.
              </p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {markets.map((c) => (
                  <li
                    key={c.slug}
                    className="rounded-full border border-line bg-paper-card px-3.5 py-1.5 text-sm text-seal-800"
                  >
                    {c.name}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm leading-relaxed text-ink-soft">
                Full time, part time, and per job arrangements all exist. Say which one you want on
                the form and it will not count against you.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-14 sm:py-16">
        <Container width="narrow">
          <h2 className="text-2xl font-bold text-seal-800">Apply</h2>
          <p className="mt-3 text-base leading-relaxed text-ink-soft">
            Short form, read by a person. Everybody gets an answer.
          </p>
          <div className="mt-8 rounded-[var(--radius-card)] border border-line bg-paper-card p-7 sm:p-9">
            <ApplicationForm path="/careers" />
          </div>
        </Container>
      </section>

      <section className="border-t border-line py-14">
        <Container width="narrow">
          <h2 className="text-2xl font-bold text-seal-800">Looking for a PE role?</h2>
          <p className="mt-4 text-base leading-relaxed text-ink">
            Professional engineer, EIT, and design roles are hired through the parent firm rather
            than through this brand, because they sit under its license and its registration.
          </p>
          <p className="mt-4">
            <a
              href={SITE.parentCareersUrl}
              rel="noopener noreferrer"
              className="text-base font-semibold text-wax-700 underline underline-offset-4 hover:text-wax-600"
            >
              {SITE.legalEntity} careers
            </a>
          </p>
        </Container>
      </section>
    </>
  );
}
