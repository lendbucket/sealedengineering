import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { IS_PRELAUNCH, PRIMARY_CTA_HREF, PRIMARY_CTA_LABEL, PRIMARY_CTA_NOTE } from "@/config/launch";

/**
 * The launch-aware call to action.
 *
 * Every CTA on the site routes through this, which is what makes the compliance
 * gate a single switch rather than fifty edits. In prelaunch the language is
 * future tense and points at the waitlist. In live mode it points at the order
 * flow. Nothing else about the page changes.
 */
export function CtaBand({
  heading,
  body,
  tone = "seal",
}: {
  heading: string;
  body?: string;
  tone?: "seal" | "paper";
}) {
  const dark = tone === "seal";

  return (
    <section className={dark ? "on-seal bg-seal-800 text-on-seal" : "bg-paper-sunk"}>
      <Container className="py-14 sm:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2
            className={`text-2xl font-bold sm:text-3xl ${dark ? "text-on-seal" : "text-seal-800"}`}
          >
            {heading}
          </h2>
          {body && (
            <p className={`mt-4 text-base leading-relaxed ${dark ? "text-on-seal-soft" : "text-ink-soft"}`}>
              {body}
            </p>
          )}
          <div className="mt-7 flex flex-col items-center gap-3">
            <Button href={PRIMARY_CTA_HREF} variant={dark ? "on-seal" : "primary"}>
              {PRIMARY_CTA_LABEL}
            </Button>
            <p className={`text-sm ${dark ? "text-on-seal-soft" : "text-ink-soft"}`}>
              {PRIMARY_CTA_NOTE}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

/**
 * The inline availability notice that sits near the top of every page that
 * describes a deliverable.
 *
 * This is the honest half of the compliance gate. The service pages explain
 * what these documents are and what they contain, which is true regardless of
 * registration status. This notice is what keeps a reader from concluding that
 * the work is being performed today, which is the statement the Texas
 * Engineering Practice Act does not allow until the firm registration is
 * active. It renders nothing in live mode.
 */
export function AvailabilityNotice({ className = "" }: { className?: string }) {
  if (!IS_PRELAUNCH) return null;

  return (
    <div
      className={`rounded-[var(--radius-card)] border border-line-strong bg-wax-100 p-5 ${className}`}
      role="note"
    >
      <p className="text-sm font-semibold text-wax-700">Opening soon</p>
      <p className="mt-2 text-sm leading-relaxed text-ink">
        Sealed Engineering is not yet accepting orders. Firm registration is pending with the Texas
        Board of Professional Engineers and Land Surveyors, and no engineering services are being
        offered or performed under this brand until it is granted. Founding customers on the
        waitlist are contacted first when ordering opens.
      </p>
    </div>
  );
}
