import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ServiceCards } from "@/components/sections/ServiceCards";
import { AvailabilityNotice, CtaBand } from "@/components/sections/Cta";
import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMeta } from "@/lib/seo";
import { breadcrumbSchema, graph, type Crumb } from "@/lib/schema";
import { SERVICES } from "@/data/services";

export const metadata: Metadata = pageMeta({
  title: "Texas PE Sealed Letters and Certifications",
  description:
    "Ten sealed engineering deliverables for Texas property: solar structural letters, foundation certifications, roof letters, WPI-8, and permit letters.",
  path: "/services",
});

const CRUMBS: Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
];

/** Split by how the evidence is gathered, because that is what decides the timeline. */
const GROUPS = [
  {
    heading: "Written from documents you upload",
    body: "No site visit, so nothing waits on scheduling or on somebody being home. What sets the pace is how complete the submission is.",
    modes: ["upload"],
  },
  {
    heading: "Documents or a site visit, depending on the conditions",
    body: "If the existing conditions can be established from photographs and drawings, it is a document review. If they cannot, an engineer will not seal an assumption, and the intake says which applies before any work starts.",
    modes: ["either"],
  },
  {
    heading: "Requires somebody on the property",
    body: "Foundations, roofs, and windstorm compliance are statements about a physical thing, and none of them can be made honestly from a photograph. A certified field technician performs the measurements and the photographic record.",
    modes: ["site-visit"],
  },
] as const;

export default function ServicesHubPage() {
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
              Sealed engineering letters and certifications for Texas
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">
              Ten defined deliverables. Each page tells you what the document is, who is asking you
              for it, exactly what arrives, and what evidence has to exist before a licensed Texas
              Professional Engineer can seal it.
            </p>
          </div>
          <AvailabilityNotice className="mt-8 max-w-3xl" />
        </Container>
      </section>

      {GROUPS.map((group) => {
        const slugs = SERVICES.filter((s) =>
          (group.modes as readonly string[]).includes(s.evidenceMode),
        ).map((s) => s.slug);
        if (slugs.length === 0) return null;
        return (
          <section key={group.heading} className="py-12 sm:py-14">
            <Container>
              <div className="max-w-2xl">
                <h2 className="text-2xl font-bold text-seal-800">{group.heading}</h2>
                <p className="mt-3 text-base leading-relaxed text-ink-soft">{group.body}</p>
              </div>
              <div className="mt-8">
                <ServiceCards only={slugs} />
              </div>
            </Container>
          </section>
        );
      })}

      <section className="border-t border-line py-14">
        <Container width="narrow">
          <h2 className="text-2xl font-bold text-seal-800">Not sure which one you need?</h2>
          <p className="mt-4 text-base leading-relaxed text-ink">
            The fastest route to an answer is to send whatever it was that sent you here. A plan
            review comment, an underwriter condition, or a line in an inspection report names the
            document far more precisely than a description of the situation does, and it costs
            nothing to be told you need something cheaper than you thought.
          </p>
        </Container>
      </section>

      <CtaBand
        heading="Tell us which document you need"
        body="Pick the deliverable and answer the intake built for it. No discovery call, no proposal."
      />
    </>
  );
}
