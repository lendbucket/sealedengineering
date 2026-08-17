import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { AvailabilityNotice } from "@/components/sections/Cta";
import { JsonLd } from "@/components/seo/JsonLd";
import { ContactForm } from "@/components/forms/ContactForm";
import { pageMeta } from "@/lib/seo";
import { breadcrumbSchema, graph, type Crumb } from "@/lib/schema";
import { SITE } from "@/config/site";
import { licensureLines } from "@/config/launch";

export const metadata: Metadata = pageMeta({
  title: "Contact Sealed Engineering | Texas PE Letters",
  description:
    "Questions about a sealed letter, a certification, or a volume account in Texas. Every message is read by a person and answered.",
  path: "/contact",
});

const CRUMBS: Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Contact", path: "/contact" },
];

export default function ContactPage() {
  return (
    <>
      <JsonLd json={graph(breadcrumbSchema(CRUMBS))} />

      <Container className="pt-8">
        <Breadcrumbs crumbs={CRUMBS} />
      </Container>

      <section className="pt-8 pb-16">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
            <div>
              <h1 className="text-[1.875rem] font-bold leading-tight text-seal-800 sm:text-[2.5rem]">
                Contact Sealed Engineering
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-ink-soft">
                If a permit office or an underwriter has written you a condition, paste it verbatim
                and you will get a far more useful answer than a description of the situation
                produces.
              </p>

              <AvailabilityNotice className="mt-8" />

              <dl className="mt-9 space-y-6">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-wax-600">
                    Email
                  </dt>
                  <dd className="mt-1.5">
                    <a
                      href={`mailto:${SITE.email}`}
                      className="text-base font-semibold text-seal-800 underline underline-offset-4 hover:text-wax-700"
                    >
                      {SITE.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-wax-600">
                    Coverage
                  </dt>
                  <dd className="mt-1.5 text-base text-ink">
                    Property anywhere in Texas. Documents produced from a submission are prepared
                    for any Texas address; anything requiring a site observation is scheduled
                    around a certified field technician reaching the property.
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-wax-600">
                    Legal entity
                  </dt>
                  <dd className="mt-1.5 text-base text-ink">
                    {SITE.legalLine}. All engineering work is performed under that entity&apos;s
                    license and registration.
                  </dd>
                  {licensureLines().map((line) => (
                    <dd key={line} className="mt-1.5 text-sm text-ink-soft">
                      {line}
                    </dd>
                  ))}
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-wax-600">
                    What this is not
                  </dt>
                  <dd className="mt-1.5 text-base text-ink">
                    Not an emergency line. If a structure is unsafe or somebody is in danger, call
                    911 and then your local building official.
                  </dd>
                </div>
              </dl>
            </div>

            <div className="rounded-[var(--radius-card)] border border-line bg-paper-card p-7 sm:p-9">
              <ContactForm path="/contact" />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
