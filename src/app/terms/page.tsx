import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { pageMeta } from "@/lib/seo";
import { breadcrumbSchema, graph, type Crumb } from "@/lib/schema";
import { SITE } from "@/config/site";
import { IS_PRELAUNCH } from "@/config/launch";
import { registrationStatement } from "@/config/firm-registration";

export const metadata: Metadata = pageMeta({
  title: "Terms of Use | Sealed Engineering",
  description:
    "The terms that apply to using sealedengineering.com, what a sealed document is and is not, and the limits on what any page here can tell you.",
  path: "/terms",
});

const CRUMBS: Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Terms", path: "/terms" },
];

const EFFECTIVE = "August 16, 2026";

export default function TermsPage() {
  return (
    <>
      <JsonLd json={graph(breadcrumbSchema(CRUMBS))} />

      <Container className="pt-8">
        <Breadcrumbs crumbs={CRUMBS} />
      </Container>

      <section className="pt-8 pb-16">
        <Container width="narrow">
          <h1 className="text-[1.875rem] font-bold leading-tight text-seal-800 sm:text-[2.5rem]">
            Terms of Use
          </h1>
          <p className="mt-4 text-sm text-ink-soft">Effective {EFFECTIVE}</p>

          <div className="prose mt-10">
            <p>
              These terms govern your use of sealedengineering.com. Sealed Engineering is a brand
              of {SITE.legalEntity}, a Texas limited liability company. In these terms, &quot;we&quot;
              and &quot;us&quot; mean that company.
            </p>

            <h2>1. Who provides the engineering</h2>
            <p>
              All engineering services described on this site are provided by {SITE.legalEntity}
              {" "}under its license and registration, and every sealed document is the work of a
              professional engineer licensed in the State of Texas. Sealed Engineering is a trade
              name and a way of ordering. It is not a separate professional entity and it does not
              hold a license of its own.
            </p>

            {IS_PRELAUNCH && (
              <>
                <h2>2. Current status</h2>
                <p>
                  {registrationStatement()} Until ordering opens, no engineering services are
                  being offered or performed under the Sealed Engineering name, and nothing on this
                  site is an offer to perform them. The waitlist records interest and creates no
                  obligation on either side.
                </p>
              </>
            )}

            <h2>{IS_PRELAUNCH ? "3" : "2"}. Nothing here is an engineering opinion</h2>
            <p>
              Every page on this site is general information about categories of engineering
              document. None of it is an engineering opinion, evaluation, certification, or
              recommendation about any specific property, structure, or condition, and none of it
              may be relied on as one.
            </p>
            <p>
              An engineering opinion about your property exists only in a document that has been
              sealed and signed by a licensed professional engineer, addressed to a named
              recipient, and issued after the evidence was reviewed. If you are holding a page
              printout rather than a sealed document, you are not holding an engineering opinion.
            </p>

            <h2>{IS_PRELAUNCH ? "4" : "3"}. No engineer client relationship is formed here</h2>
            <p>
              Reading this site, submitting a form, joining the waitlist, or exchanging emails does
              not create an engineer client relationship. That relationship begins when an
              engagement for a specific deliverable on a specific property is accepted in writing,
              and it is limited to the scope of that engagement.
            </p>

            <h2>{IS_PRELAUNCH ? "5" : "4"}. What a seal means, and what it does not</h2>
            <p>
              A professional engineer&apos;s seal means a licensed individual reviewed the evidence
              available and reached the stated conclusion, with their license behind it. It is a
              professional judgement about observed conditions on a stated date.
            </p>
            <p>It is specifically not any of the following.</p>
            <ul>
              <li>
                A guarantee, warranty, or insurance of any kind, express or implied, about
                performance, condition, or future behaviour.
              </li>
              <li>
                A promise that any permit office, lender, underwriter, insurer, or agency will
                accept the document or approve anything. Those decisions belong to them.
              </li>
              <li>
                A statement about anything that was concealed, inaccessible, or outside the stated
                scope. A document reports what could be observed and says what could not.
              </li>
              <li>
                A prediction. A roof certification estimates remaining service life; it does not
                promise it. A foundation report describes measured conditions; it does not promise
                they will hold.
              </li>
            </ul>
            <p>
              No outcome is promised in advance of a review. An engineer seals what the evidence
              supports, and where the evidence does not support the conclusion a client was hoping
              for, that is reported with the reason rather than resolved in their favour.
            </p>

            <h2>{IS_PRELAUNCH ? "6" : "5"}. Accuracy of what you submit</h2>
            <p>
              Documents are produced from information you provide: measurements, photographs,
              drawings, framing details, dates, and names. You are responsible for the accuracy and
              completeness of that information, and for having the right to provide it. A
              conclusion drawn from inaccurate information is not a conclusion anybody can rely on,
              and where a material inaccuracy comes to light the document may be withdrawn or
              revised.
            </p>

            <h2>{IS_PRELAUNCH ? "7" : "6"}. Use of a delivered document</h2>
            <p>
              A sealed document is prepared for a named recipient, a stated property, and a stated
              purpose. It may be submitted to that recipient for that purpose. It may not be
              altered, excerpted in a way that changes its meaning, reused for a different property
              or transaction, or presented as covering a scope it does not cover.
            </p>

            <h2>{IS_PRELAUNCH ? "8" : "7"}. Insurance claims</h2>
            <p>
              We do not prepare insurance claim documentation, do not solicit claim work, and do
              not produce documents framed to support or oppose a claim. A repair specification
              states how a repair is performed. A roof certification states observed condition and
              estimated remaining life. What a carrier does with either is a matter between you and
              your carrier.
            </p>

            <h2>{IS_PRELAUNCH ? "9" : "8"}. Pricing</h2>
            <p>
              Where flat rate pricing is described, it applies to the defined scope of the
              deliverable as published at the time of order. Work outside that scope, including
              repeat site visits caused by inaccessible conditions, is quoted separately before it
              is performed rather than added afterward.
            </p>

            <h2>{IS_PRELAUNCH ? "10" : "9"}. Intellectual property</h2>
            <p>
              The content, structure, and design of this site belong to {SITE.legalEntity}. You may
              read it, print it, and link to it. You may not copy it wholesale into another site.
              Documents delivered to you are yours to use as section {IS_PRELAUNCH ? "7" : "6"}{" "}
              describes; the underlying calculations, templates, and methods remain ours.
            </p>

            <h2>{IS_PRELAUNCH ? "11" : "10"}. Limitation of liability</h2>
            <p>
              To the fullest extent permitted by Texas law, our liability arising from your use of
              this site is limited to the amount you paid for the specific deliverable that gave
              rise to the claim. We are not liable for indirect, incidental, or consequential
              losses, including lost profits, delayed closings, or missed deadlines. Nothing in
              this section limits liability that cannot lawfully be limited, including liability
              for the professional conduct of a licensed engineer, which is governed by the Texas
              Engineering Practice Act and the rules of the Texas Board of Professional Engineers
              and Land Surveyors.
            </p>

            <h2>{IS_PRELAUNCH ? "12" : "11"}. Complaints about engineering practice</h2>
            <p>
              Complaints regarding the practice of engineering may be directed to the Texas Board
              of Professional Engineers and Land Surveyors. Raising a concern with us first is
              welcome and is not a precondition to contacting the Board.
            </p>

            <h2>{IS_PRELAUNCH ? "13" : "12"}. Governing law</h2>
            <p>
              These terms are governed by the laws of the State of Texas, without regard to its
              conflict of laws rules. Any dispute is subject to the exclusive jurisdiction of the
              state and federal courts located in Texas.
            </p>

            <h2>{IS_PRELAUNCH ? "14" : "13"}. Changes</h2>
            <p>
              These terms may change. The effective date at the top changes when they do, and the
              version in force is the one published at the time of your order.
            </p>

            <h2>{IS_PRELAUNCH ? "15" : "14"}. Contact</h2>
            <p>
              {SITE.legalEntity}, operating as Sealed Engineering.{" "}
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
