import type { MetadataRoute } from "next";
import { getSitemapEntries, toMetadataRouteSitemap } from "@/seo/sitemap";

export default function sitemap(): MetadataRoute.Sitemap {
  return toMetadataRouteSitemap(getSitemapEntries());
}
