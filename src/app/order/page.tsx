import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { OrderForm } from "@/components/forms/OrderForm";
import { pageMeta } from "@/lib/seo";
import { breadcrumbSchema, graph, type Crumb } from "@/lib/schema";
import { IS_LIVE } from "@/config/launch";
import { SERVICES, getService } from "@/data/services";

export const metadata: Metadata = pageMeta({
  title: "Order a Sealed Engineering Document in Texas",
  description:
    "Pick the deliverable, give us the property address, upload your documents, and a licensed Texas PE reviews and seals what the evidence supports.",
  path: "/order",
});

const CRUMBS: Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Order", path: "/order" },
];

/**
 * force-dynamic, and this is load-bearing rather than tidy.
 *
 * In prelaunch this page calls redirect() before touching searchParams, so
 * Next sees no dynamic API and prerenders the REDIRECT itself as a static
 * artifact. /waitlist reads searchParams and stays dynamic. Flip LAUNCH_MODE to
 * live without a rebuild and the two disagree: /order serves a build-time
 * redirect to /waitlist while /waitlist evaluates the flag at runtime and
 * redirects back to /order. The browser gets ERR_TOO_MANY_REDIRECTS and the
 * whole order flow is unreachable.
 *
 * That is not hypothetical. `npm run forms-audit` found it by starting a live
 * server against a prelaunch build, which is exactly the state a deploy is in
 * between an environment change and the next build.
 *
 * Marking both sides dynamic means the launch gate is decided per request, by
 * the running server, from the environment it actually has.
 */
export const dynamic = "force-dynamic";

/**
 * The live-mode order flow.
 *
 * Built now and gated, so the day LAUNCH_MODE flips is a configuration change
 * rather than a build. In prelaunch this redirects to the waitlist rather than
 * rendering an inert form, because a form that cannot be submitted is worse
 * than a page that sends you somewhere useful. The server action refuses
 * independently, so the gate does not depend on this redirect.
 */
export default async function OrderPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  if (!IS_LIVE) redirect("/waitlist");

  const { service } = await searchParams;
  const preselected = service && getService(service) ? service : undefined;
  const serviceOptions = SERVICES.map((s) => ({ value: s.slug, label: s.name }));

  return (
    <>
      <JsonLd json={graph(breadcrumbSchema(CRUMBS))} />

      <Container className="pt-8">
        <Breadcrumbs crumbs={CRUMBS} />
      </Container>

      <section className="pt-8 pb-16">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
            <div>
              <h1 className="text-[1.875rem] font-bold leading-tight text-seal-800 sm:text-[2.5rem]">
                Order a sealed document
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-ink-soft">
                One intake, and it is the same one every time. Pick the deliverable, give us the
                property address, and upload whatever you already have.
              </p>

              <div className="mt-9 rounded-[var(--radius-card)] border border-line bg-paper-sunk p-7">
                <h2 className="font-[family-name:var(--font-display)] text-base font-bold text-seal-800">
                  Before you start
                </h2>
                <ul className="mt-4 space-y-3 text-[0.9375rem] leading-relaxed text-ink">
                  <li>
                    The property address matters more than anything else in this form. Wind speed
                    and exposure are looked up from it, and both change the analysis.
                  </li>
                  <li>
                    If a permit office or an underwriter wrote you a condition, paste it verbatim
                    in the notes. It is the single most useful thing you can give us.
                  </li>
                  <li>
                    Attic and framing photographs are what turn a site visit into a document review
                    on several of these deliverables.
                  </li>
                </ul>
              </div>
            </div>

            <div className="rounded-[var(--radius-card)] border border-line bg-paper-card p-7 sm:p-9">
              <OrderForm
                serviceOptions={serviceOptions}
                path="/order"
                defaultService={preselected}
              />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
