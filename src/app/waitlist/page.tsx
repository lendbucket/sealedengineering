import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { WaitlistForm } from "@/components/forms/WaitlistForm";
import { pageMeta } from "@/lib/seo";
import { breadcrumbSchema, graph, type Crumb } from "@/lib/schema";
import { IS_LIVE } from "@/config/launch";
import { SERVICES, getService } from "@/data/services";

export const metadata: Metadata = pageMeta({
  title: "Join the Sealed Engineering Texas Waitlist",
  description:
    "Founding customers are contacted first when ordering opens. Tell us the deliverable you need, where in Texas, and how often you order.",
  path: "/waitlist",
});

const CRUMBS: Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Waitlist", path: "/waitlist" },
];

/**
 * force-dynamic for the same reason /order carries it: the launch gate has to
 * be decided per request by the running server rather than baked into a
 * prerendered artifact at build time. See the comment in src/app/order/page.tsx
 * for the redirect loop this prevents.
 */
export const dynamic = "force-dynamic";

/**
 * The waitlist page reads a `service` query parameter so a CTA on a service
 * page can preselect the deliverable. That makes it a dynamic render rather
 * than a static one, which is the correct trade: this is the one page on the
 * site whose job is conversion rather than indexing.
 */
export default async function WaitlistPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  // In live mode the waitlist has no purpose and the order flow is the thing.
  // Redirecting rather than rendering a dead page keeps every existing link and
  // every printed CTA working after the flag flips.
  if (IS_LIVE) redirect("/order");

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
          <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
            <div>
              <h1 className="text-[1.875rem] font-bold leading-tight text-seal-800 sm:text-[2.5rem]">
                Join the Sealed Engineering waitlist
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-ink-soft">
                Sealed Engineering is not open yet. Firm registration is pending with the Texas
                Board of Professional Engineers and Land Surveyors, and until it is granted no
                engineering services are offered or performed under this brand.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-ink-soft">
                What the waitlist does is put you in line. Founding customers are contacted first
                when ordering opens, in the order they joined, and businesses ordering repeat
                volume are set up as accounts before the queue starts moving.
              </p>

              <div className="mt-9 rounded-[var(--radius-card)] border border-line bg-paper-sunk p-7">
                <h2 className="font-[family-name:var(--font-display)] text-base font-bold text-seal-800">
                  What happens next
                </h2>
                <ol className="mt-4 space-y-3 text-[0.9375rem] leading-relaxed text-ink">
                  <li>
                    <strong className="font-semibold text-seal-800">1.</strong> Your details are
                    recorded with the date you joined. Nothing is sold, shared, or passed on.
                  </li>
                  <li>
                    <strong className="font-semibold text-seal-800">2.</strong> When firm
                    registration is granted, you are contacted at the email you give below.
                  </li>
                  <li>
                    <strong className="font-semibold text-seal-800">3.</strong> Businesses with
                    monthly volume get an account set up first, because that is the part that takes
                    a conversation rather than a form.
                  </li>
                </ol>
              </div>
            </div>

            <div className="rounded-[var(--radius-card)] border border-line bg-paper-card p-7 sm:p-9">
              <WaitlistForm
                serviceOptions={serviceOptions}
                path="/waitlist"
                defaultService={preselected}
              />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
