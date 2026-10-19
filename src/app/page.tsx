import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ServiceCards } from "@/components/sections/ServiceCards";
import { AvailabilityNotice, CtaBand } from "@/components/sections/Cta";
import { Faqs } from "@/components/sections/Faqs";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMeta } from "@/lib/seo";
import { faqSchema, graph } from "@/lib/schema";
import { IS_PRELAUNCH, PRIMARY_CTA_HREF, PRIMARY_CTA_LABEL } from "@/config/launch";
import { CITIES } from "@/data/cities";
import { SITE } from "@/config/site";
import type { Faq } from "@/data/types";

export const metadata: Metadata = pageMeta({
  title: "Sealed Engineering Letters Texas | Licensed PE",
  description:
    "Sealed engineering letters and certifications for property anywhere in Texas. Solar structural letters, foundation certifications, roof letters, and WPI-8.",
  path: "/",
});

const STEPS = [
  {
    n: "01",
    title: "Tell us what you need",
    body: "Pick the deliverable, give us the property address, and answer a short intake built for that specific document. No general contact form, no discovery call, no proposal.",
  },
  {
    n: "02",
    title: "We collect the evidence",
    body: "Some documents are written from what you upload: plans, photographs, framing information, and equipment cut sheets. Others require somebody on site, and a certified field technician performs the measurements and the photographic record.",
  },
  {
    n: "03",
    title: "A licensed Texas PE reviews and seals",
    body: "The engineer reviews the evidence, performs the analysis, and seals what it supports. The sealed PDF arrives ready to upload to a permit portal or a loan file.",
  },
];

const AUDIENCES = [
  { label: "Solar installers", href: "/industries/solar-installers" },
  { label: "Lenders and loan officers", href: "/industries/lenders-and-loan-officers" },
  { label: "Realtors and title companies", href: "/industries/realtors-and-title-companies" },
  { label: "General contractors", href: "/services/structural-letters-for-permits" },
  { label: "Homeowners", href: "/services" },
];

const HOME_FAQS: Faq[] = [
  {
    q: "What is a sealed engineering letter?",
    a: "It is a written engineering opinion carrying the seal and signature of a licensed professional engineer. The seal is what makes it admissible to a permit office, an underwriter, or a state agency, because it places the engineer's license behind the conclusion. A letter without a seal is correspondence; a letter with one is a professional record.",
  },
  {
    q: "Do you work everywhere in Texas?",
    a: "Yes. Document based deliverables are produced for any Texas address. Deliverables requiring a site observation are scheduled around a certified field technician reaching the property, which is what sets the timeline in the more remote parts of the state.",
  },
  {
    q: "How is this different from hiring a traditional engineering firm?",
    a: "Scope and process rather than credentials. A traditional firm sells hours against a proposal. This is a fixed catalog of defined deliverables with a fixed intake for each one, ordered online. The engineering is the same engineering and the seal is the same seal. What changes is that you know what you are getting before you start.",
  },
  {
    q: "Can you tell me what the letter will conclude before you write it?",
    a: "No, and that is the point of a seal. An engineer seals what the evidence supports, which means the conclusion follows the review rather than the order. What can be stated in advance is exactly what will be examined and exactly what the document will contain.",
  },
  {
    q: "Who is behind Sealed Engineering?",
    a: `${SITE.legalLine}, and all engineering work is performed under that entity's license and registration. The brand exists to make a defined set of deliverables orderable online rather than negotiated.`,
  },
];

export default function HomePage() {
  const featuredCities = CITIES.slice(0, 10);

  return (
    <>
      <JsonLd json={graph(faqSchema("/", HOME_FAQS))} />

      {/* Hero */}
      <section className="on-seal bg-seal-800 text-on-seal">
        <Container className="py-16 sm:py-20 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-on-seal-soft">
              Anywhere in Texas
            </p>
            <h1 className="mt-4 text-[2.125rem] font-bold leading-[1.1] text-on-seal sm:text-5xl lg:text-[3.5rem]">
              Sealed engineering letters for Texas property, ordered online
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-on-seal-soft">
              The exact document your permit office, your underwriter, or your insurer is asking
              for. Flat rate, defined scope, and built for the seal of a licensed Texas
              Professional Engineer, who will seal only what the evidence supports.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button href={PRIMARY_CTA_HREF} variant="on-seal">
                {PRIMARY_CTA_LABEL}
              </Button>
              <Button href="/services" variant="outline-on-seal">
                See all ten deliverables
              </Button>
            </div>

            <ul className="mt-10 flex flex-wrap gap-x-7 gap-y-2 text-sm text-on-seal-soft">
              <li>Licensed Texas PE review</li>
              <li>Flat rate, quoted up front</li>
              <li>Digital seal, ready to submit</li>
            </ul>
          </div>
        </Container>
      </section>

      {IS_PRELAUNCH && (
        <Container className="pt-10">
          <AvailabilityNotice />
        </Container>
      )}

      {/* Services */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-seal-800 sm:text-3xl">
              Ten deliverables, each with a defined scope
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-soft">
              Every one of these is a document somebody has told you to go and get. Each page below
              explains what it is, who needs it, exactly what arrives, and what evidence has to
              exist before an engineer can seal it.
            </p>
          </div>
          <div className="mt-10">
            <ServiceCards />
          </div>
        </Container>
      </section>

      {/* How it works */}
      <section className="border-y border-line bg-paper-sunk py-16 sm:py-20">
        <Container>
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-seal-800 sm:text-3xl">How it works</h2>
            <p className="mt-4 text-base leading-relaxed text-ink-soft">
              Three steps, and the middle one is the only part that varies by deliverable.
            </p>
          </div>
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {STEPS.map((s) => (
              <li
                key={s.n}
                className="rounded-[var(--radius-card)] border border-line bg-paper-card p-7"
              >
                <span className="font-[family-name:var(--font-display)] text-sm font-bold tracking-[0.1em] text-wax-600">
                  {s.n}
                </span>
                <h3 className="mt-3 font-[family-name:var(--font-display)] text-lg font-bold text-seal-800">
                  {s.title}
                </h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">{s.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Who we serve */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
            <div>
              <h2 className="text-2xl font-bold text-seal-800 sm:text-3xl">Who this is built for</h2>
              <p className="mt-4 text-base leading-relaxed text-ink-soft">
                Five groups order most of this work, and three of them order it every week. The
                pages below are written for repeat buyers rather than for one time orders.
              </p>
              <ul className="mt-7 flex flex-wrap gap-2.5">
                {AUDIENCES.map((a) => (
                  <li key={a.label}>
                    <Link
                      href={a.href}
                      className="inline-flex rounded-full border border-line-strong bg-paper-card px-4 py-2 text-sm font-medium text-seal-800 hover:border-seal-600 hover:bg-seal-100"
                    >
                      {a.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[var(--radius-card)] border border-line bg-paper-card p-7 sm:p-9">
              <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-seal-800">
                What a seal actually means
              </h3>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink">
                A professional engineer&apos;s seal is a statement that a licensed individual
                reviewed the evidence and reached the stated conclusion, and that their license
                stands behind it. It is not a formality, it is not a rubber stamp, and it is not
                available on request.
              </p>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink">
                That is why nobody here will tell you in advance what a letter will conclude, and
                why a document that does not support certification comes back with the reason and
                the remedy rather than with a signature. It is also exactly why the seal is worth
                anything to the permit office or the underwriter receiving it.
              </p>
              <p className="mt-5 text-sm text-ink-soft">
                Engineering work is performed under the license and registration of 254 Engineering
                Services LLC.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Texas coverage */}
      <section className="border-t border-line py-16 sm:py-20">
        <Container>
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-seal-800 sm:text-3xl">
              Texas is not one engineering problem
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-soft">
              Design wind speed runs from around 100 miles per hour in the interior past 150 on the
              lower coast. Soil runs from Houston Black clay that moves inches every season to
              Permian caliche that barely moves at all. Fourteen counties carry a windstorm
              certification requirement the rest of the state has never heard of. Every city page
              below is written for that market rather than templated across it.
            </p>
          </div>
          <ul className="mt-9 flex flex-wrap gap-2.5">
            {featuredCities.map((c) => (
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
                All 25 cities
              </Link>
            </li>
          </ul>
        </Container>
      </section>

      <Faqs faqs={HOME_FAQS} heading="Common questions" />

      <CtaBand
        heading={
          IS_PRELAUNCH
            ? "Founding customers get the first turnaround slots"
            : "Order the document you need"
        }
        body={
          IS_PRELAUNCH
            ? "Tell us what you order, how often, and where in Texas you work. Waitlist members are contacted first when ordering opens, in the order they joined."
            : "Pick the deliverable, complete the intake for it, and the sealed document comes back ready to submit."
        }
      />
    </>
  );
}
