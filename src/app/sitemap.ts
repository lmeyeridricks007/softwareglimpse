import type { MetadataRoute } from "next";
import { getSitemapEntries, toMetadataRouteSitemap } from "@/seo/sitemap";

/** Regenerate daily — avoids per-request rebuild of ~6k URLs on cache miss. */
export const revalidate = 86_400;

export default function sitemap(): MetadataRoute.Sitemap {
  return toMetadataRouteSitemap(getSitemapEntries());
}
