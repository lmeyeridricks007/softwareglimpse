import type { MetadataRoute } from "next";
import { CANONICAL_PRODUCTION_ORIGIN } from "@/seo/english-only-cutover";
import { getSiteUrl } from "@/lib/site";

/**
 * Production robots.txt — English crawl surface.
 *
 * Sitemap points at the **index** (`/sitemap.xml`) only — not each child.
 * Do NOT Disallow legacy locale prefixes: Google must fetch those URLs to
 * observe 301/410 from Proxy. Disallow is for utility / non-content surfaces.
 * Sitemap assets must remain crawlable (never Disallow `/sitemap`).
 */
export default function robots(): MetadataRoute.Robots {
  const configured = getSiteUrl().replace(/\/$/, "");
  // Prefer configured origin when it matches production convention; otherwise
  // fall back to the hard canonical so robots never advertise apex/non-www.
  const siteUrl =
    configured === CANONICAL_PRODUCTION_ORIGIN ||
    configured.endsWith(".vercel.app")
      ? configured || CANONICAL_PRODUCTION_ORIGIN
      : CANONICAL_PRODUCTION_ORIGIN;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/go/",
          "/api/",
          "/search/",
          "/dev/",
          "/compare/build/",
          "/newsletter/",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
