import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMeta } from "@/lib/seo";
import { breadcrumbSchema, graph, type Crumb } from "@/lib/schema";
import { SITE } from "@/config/site";

/**
 * A routing stub, deliberately.
 *
 * WHY THIS PAGE STOPPED BEING A CAREERS PAGE
 * ------------------------------------------
 * The cross brand keyword registry assigns every careers term in the family to
 * 254 Engineering Services, and it records this page as an unresolved
 * collision: it was titled "Field Technician Jobs in Texas" and targeting
 * "field inspection technician jobs texas", which 254 owns and already ranks
 * for. Two brands competing for one hiring term does not produce two rankings.
 * It produces one winner, one suppressed page, and applications split across
 * two funnels for a single company.
 *
 * So this page routes instead of competing. It carries no application form and
 * no job term in its title. Hiring for the whole family, engineering roles and
 * field roles alike, runs through 254.
 *
 * This is also the "part of the same family" cross-link the playbook permits:
 * one honest note where the relationship is real, not a reciprocal link scheme.
 * If Sealed Engineering ever hires directly under its own name, this page comes
 * back and the registry entry is renegotiated first.
 */
export const metadata: Metadata = pageMeta({
  title: "Hiring Runs Through 254 Engineering",
  description:
    "Sealed Engineering does not hire directly. Engineering, review, and field roles across the family are hired through 254 Engineering.",
  path: "/careers",
});

const CRUMBS: Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Hiring", path: "/careers" },
];

export default function CareersPage() {
  return (
    <>
      <JsonLd json={graph(breadcrumbSchema(CRUMBS))} />

      <Container className="pt-8">
        <Breadcrumbs crumbs={CRUMBS} />
      </Container>

      <section className="pt-8 pb-20">
        <Container width="narrow">
          <h1 className="text-[1.875rem] font-bold leading-tight text-seal-800 sm:text-[2.5rem]">
            Hiring runs through 254 Engineering
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-ink-soft">
            Sealed Engineering does not hire under its own name. It is a brand of{" "}
            {SITE.legalEntity}, and every role that supports it, professional engineers, review
            engineers, and the field technicians who gather the evidence behind a seal, is hired by
            that firm.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">
            One posting, one application, one hiring process. There is no second queue here to
            apply to, and an application sent to this brand would only be forwarded.
          </p>

          <div className="mt-10 rounded-[var(--radius-card)] border border-line bg-paper-sunk p-7">
            <h2 className="font-[family-name:var(--font-display)] text-lg font-bold text-seal-800">
              Open roles are listed at 254 Engineering
            </h2>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink">
              Field technician work is the role most people arrive here looking for. It is real
              work, it is scheduled by proximity to the property, and it is the evidence every
              sealed document rests on. It is posted and hired there rather than here.
            </p>
            <p className="mt-6">
              <a
                href={SITE.parentCareersUrl}
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center rounded-[var(--radius-control)] bg-seal-800 px-5 py-3 text-[0.9375rem] font-semibold text-on-seal transition-colors hover:bg-seal-700"
              >
                See open roles at {SITE.legalEntity}
              </a>
            </p>
          </div>

          <p className="mt-8 text-sm leading-relaxed text-ink-soft">
            Field technicians gather evidence and perform measurements. They do not perform
            engineering or issue opinions. Every engineering opinion and every seal is the work of a
            licensed Texas Professional Engineer, under the license and registration of{" "}
            {SITE.legalEntity}.
          </p>
        </Container>
      </section>
    </>
  );
}
