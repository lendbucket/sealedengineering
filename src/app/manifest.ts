import type { MetadataRoute } from "next";
import { SITE, SITE_NAME } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "Sealed Eng",
    description:
      "Sealed engineering letters, certifications, and small plan sets for Texas property.",
    start_url: "/",
    display: "browser",
    background_color: "#faf7f1",
    theme_color: "#0f3b2e",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/favicon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/favicon-512.png", sizes: "512x512", type: "image/png" },
    ],
    id: SITE.url,
  };
}
