import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SERVICES } from "@/data/services";
import { PRIMARY_CTA_HREF, PRIMARY_CTA_LABEL } from "@/config/launch";

/**
 * 404.
 *
 * Deliberately useful rather than decorative. Somebody who lands here arrived
 * from a stale link or a typo, and the four most likely things they wanted are
 * one click away. No metadata export: Next marks this noindex on its own, and
 * a canonical URL on a 404 would be a contradiction.
 */
export default function NotFound() {
  const popular = SERVICES.slice(0, 6);

  return (
    <section className="py-20 sm:py-28">
      <Container width="narrow">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-wax-600">Error 404</p>
        <h1 className="mt-4 text-[1.875rem] font-bold leading-tight text-seal-800 sm:text-[2.5rem]">
          That page is not here
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-ink-soft">
          Either the link is out of date or something in the address is off by a character. The
          things people are usually looking for are below.
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Button href={PRIMARY_CTA_HREF}>{PRIMARY_CTA_LABEL}</Button>
          <Button href="/services" variant="secondary">
            All deliverables
          </Button>
        </div>

        <h2 className="mt-14 text-lg font-bold text-seal-800">Most requested</h2>
        <ul className="mt-5 space-y-2.5">
          {popular.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/services/${s.slug}`}
                className="text-[0.9375rem] font-medium text-seal-800 underline underline-offset-4 hover:text-wax-700"
              >
                {s.name}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/texas"
              className="text-[0.9375rem] font-medium text-seal-800 underline underline-offset-4 hover:text-wax-700"
            >
              Texas cities
            </Link>
          </li>
          <li>
            <Link
              href="/insights"
              className="text-[0.9375rem] font-medium text-seal-800 underline underline-offset-4 hover:text-wax-700"
            >
              Insights
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className="text-[0.9375rem] font-medium text-seal-800 underline underline-offset-4 hover:text-wax-700"
            >
              Contact
            </Link>
          </li>
        </ul>
      </Container>
    </section>
  );
}
