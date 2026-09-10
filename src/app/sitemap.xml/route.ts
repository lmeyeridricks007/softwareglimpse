import { getSiteUrl } from "@/lib/site";
import {
  SITEMAP_XML_HEADERS,
  buildSitemapChildFiles,
  buildSitemapIndexXml,
  buildSitemapPartitions,
} from "@/seo/sitemap";

/** Regenerate daily — avoids per-request rebuild of the full URL inventory. */
export const revalidate = 86_400;

/**
 * Sitemap index (canonical discovery endpoint).
 *
 * Child urlsets: `/sitemap-{type}.xml` (rewritten to `/sitemaps/{type}.xml`).
 * Empty content types are omitted. Reviews ship under `software`.
 */
export function GET() {
  const partitions = buildSitemapPartitions();
  const children = buildSitemapChildFiles(partitions);
  const xml = buildSitemapIndexXml({
    siteUrl: getSiteUrl(),
    children,
  });

  return new Response(xml, { headers: SITEMAP_XML_HEADERS });
}
