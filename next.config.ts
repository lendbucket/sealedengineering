import type { NextConfig } from "next";

/**
 * Security headers applied to every route.
 *
 * The CSP is Report-Only deliberately. This site has no third party scripts
 * today, so an enforcing policy would very likely be fine, and "very likely
 * fine" is not a good reason to be one header away from a blank page on a site
 * whose whole job is being found. It runs in report mode until there is a
 * report endpoint collecting violations, and then it is promoted.
 *
 * `'unsafe-inline'` in script-src covers React's hydration bootstrap and the
 * inline JSON-LD blocks, both of which are ours and neither of which accepts
 * user input.
 */
const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  {
    key: "Content-Security-Policy-Report-Only",
    value: [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'self'",
      "img-src 'self' data: blob:",
      "font-src 'self' data:",
      "style-src 'self' 'unsafe-inline'",
      "script-src 'self' 'unsafe-inline'",
      // The order form uploads straight to Supabase storage through a signed
      // URL, so the browser genuinely does connect to that origin.
      "connect-src 'self' https://*.supabase.co",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    // AVIF first, WebP as the fallback. Order matters: the first entry the
    // request's Accept header matches is the one served.
    formats: ["image/avif", "image/webp"],
    qualities: [75],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        // The order flow carries a property address and uploaded documents.
        // Nothing between here and the browser should keep a copy.
        source: "/order",
        headers: [
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate, private" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Stale link insurance. The service-areas shape is what the sibling sites
      // use, and somebody will type it or link it.
      { source: "/service-areas", destination: "/texas", permanent: true },
      { source: "/service-areas/:city", destination: "/texas/:city", permanent: true },
      { source: "/blog", destination: "/insights", permanent: true },
      { source: "/blog/:slug", destination: "/insights/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
