import Link from "next/link";
import { Wordmark } from "@/components/brand/Wordmark";
import { Container } from "@/components/ui/Container";
import { SITE } from "@/config/site";
import { licensureLines } from "@/config/launch";
import { SERVICES } from "@/data/services";
import { CITIES } from "@/data/cities";
import { INDUSTRIES } from "@/data/industries";

/**
 * Site footer.
 *
 * Two things here are not decoration. The legal line naming 254 Engineering
 * Services LLC has to appear on every page, and the licensure disclosure has to
 * say the right thing for the current launch mode. Both come from config rather
 * than from markup, so flipping LAUNCH_MODE changes them everywhere at once.
 */
export function Footer() {
  const year = new Date().getFullYear();
  const topCities = CITIES.slice(0, 12);

  return (
    <footer className="on-seal mt-20 bg-seal-900 text-on-seal-soft">
      <Container className="py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Wordmark tone="paper" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed">
              Sealed engineering letters, certifications, and small plan sets for property anywhere
              in Texas, reviewed and sealed by a licensed Texas Professional Engineer.
            </p>
          </div>

          <nav aria-label="Services">
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-on-seal">Services</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="hover:text-on-seal">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Service areas">
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-on-seal">
              Service areas
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {topCities.map((c) => (
                <li key={c.slug}>
                  <Link href={`/texas/${c.slug}`} className="hover:text-on-seal">
                    {c.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/texas" className="font-semibold text-on-seal hover:underline">
                  All Texas cities
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Company">
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-on-seal">Company</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {INDUSTRIES.map((i) => (
                <li key={i.slug}>
                  <Link href={`/industries/${i.slug}`} className="hover:text-on-seal">
                    {i.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/insights" className="hover:text-on-seal">
                  Insights
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-on-seal">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-on-seal">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-12 border-t border-seal-700 pt-8 text-sm">
          <p className="font-semibold text-on-seal">{SITE.legalLine}</p>
          {licensureLines().map((line) => (
            <p key={line} className="mt-1.5">
              {line}
            </p>
          ))}
          <p className="mt-1.5">
            Engineering services are provided under the license and registration of{" "}
            {SITE.legalEntity}. Nothing on this site is an engineering opinion about any specific
            property, and no engineer client relationship is formed by reading it.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
            <span>
              Copyright {year} {SITE.legalEntity}
            </span>
            <Link href="/privacy" className="hover:text-on-seal">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-on-seal">
              Terms
            </Link>
            <a href={`mailto:${SITE.email}`} className="hover:text-on-seal">
              {SITE.email}
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
