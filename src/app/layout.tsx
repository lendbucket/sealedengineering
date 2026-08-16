import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Header, type NavLink } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE, SITE_NAME } from "@/config/site";
import { PRIMARY_CTA_HREF, PRIMARY_CTA_LABEL } from "@/config/launch";
import { graph, organizationSchema, websiteSchema } from "@/lib/schema";

/**
 * Self-hosted through next/font, so there is no render-blocking request to a
 * third party and no layout shift while a webfont arrives. Space Grotesk is a
 * modern grotesque and carries the headings; Inter carries the long-form
 * service and city copy, where reading speed matters more than character.
 */
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  // Per-page titles are absolute and keyword-leading, so the template only
  // applies to anything that forgets to set one.
  title: {
    default: "Sealed Engineering Letters Texas | Licensed PE",
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Sealed engineering letters, certifications, and small plan sets for Texas property, reviewed and sealed by a licensed Texas Professional Engineer.",
  applicationName: SITE_NAME,
  authors: [{ name: SITE.legalEntity, url: SITE.parentUrl }],
  creator: SITE.legalEntity,
  publisher: SITE.legalEntity,
  formatDetection: { telephone: false, address: false, email: false },
  openGraph: { siteName: SITE_NAME, locale: "en_US", type: "website" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f3b2e",
};

/**
 * Header links are built here rather than inside the (client) Header so the
 * services and cities datasets stay on the server. Five strings cross the
 * boundary instead of a few hundred kilobytes of copy.
 */
const NAV: NavLink[] = [
  { label: "Services", href: "/services" },
  { label: "Texas cities", href: "/texas" },
  { label: "Solar installers", href: "/industries/solar-installers" },
  { label: "Lenders", href: "/industries/lenders-and-loan-officers" },
  { label: "Insights", href: "/insights" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-seal-800 focus:px-4 focus:py-2 focus:text-on-seal"
        >
          Skip to content
        </a>
        <Header primaryLinks={NAV} ctaLabel={PRIMARY_CTA_LABEL} ctaHref={PRIMARY_CTA_HREF} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <JsonLd json={graph(organizationSchema(), websiteSchema())} />
      </body>
    </html>
  );
}
