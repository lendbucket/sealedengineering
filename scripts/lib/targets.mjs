/**
 * The page sample every audit measures.
 *
 * One list, imported by seo-audit, contrast-audit, and mobile-audit, because
 * three hand-maintained lists is three lists that drift, and the one that
 * drifts is always the one that would have caught the regression.
 *
 * Chosen as one representative page per template plus enough breadth to be a
 * real sample rather than a token one. The city entries deliberately span a
 * windstorm county, a clay county, and a West Texas county, because those three
 * render different content on the same template.
 */
export const TEMPLATES = [
  { name: "home", path: "/" },
  { name: "services hub", path: "/services" },
  { name: "service: solar", path: "/services/solar-structural-letters" },
  { name: "service: mh foundation", path: "/services/manufactured-home-foundation-certification" },
  { name: "service: wpi-8", path: "/services/wpi-8-windstorm-certification" },
  { name: "service: beam sizing", path: "/services/beam-and-header-sizing-letters" },
  { name: "texas hub", path: "/texas" },
  { name: "city: houston", path: "/texas/houston" },
  { name: "city: corpus christi", path: "/texas/corpus-christi" },
  { name: "city: lubbock", path: "/texas/lubbock" },
  { name: "city: alice", path: "/texas/alice" },
  { name: "industries hub", path: "/industries" },
  { name: "industry: solar", path: "/industries/solar-installers" },
  { name: "industry: lenders", path: "/industries/lenders-and-loan-officers" },
  { name: "insights hub", path: "/insights" },
  { name: "post: sealed letter", path: "/insights/what-is-a-sealed-engineering-letter" },
  { name: "post: wpi-8", path: "/insights/wpi-8-windstorm-certificates-explained" },
  { name: "waitlist", path: "/waitlist" },
  { name: "careers", path: "/careers" },
  { name: "contact", path: "/contact" },
  { name: "privacy", path: "/privacy" },
  { name: "terms", path: "/terms" },
  { name: "404", path: "/this-route-does-not-exist" },
];

/** Everything except the deliberate 404, for audits that assert a 200. */
export const OK_TEMPLATES = TEMPLATES.filter((t) => t.name !== "404");
