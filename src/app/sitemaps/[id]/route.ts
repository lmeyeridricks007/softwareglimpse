import { notFound } from "next/navigation";
import {
  SITEMAP_XML_HEADERS,
  buildSitemapChildFiles,
  buildUrlsetXml,
  getSitemapChildFile,
  parseSitemapChildId,
} from "@/seo/sitemap";

export const revalidate = 86_400;

type RouteParams = { params: Promise<{ id: string }> };

/**
 * Named child sitemap urlsets.
 * Public URLs are `/sitemap-{name}.xml` via next.config rewrite.
 */
export function generateStaticParams() {
  return buildSitemapChildFiles().map((child) => ({ id: child.id }));
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { id: rawId } = await params;
  const childId = parseSitemapChildId(rawId);
  if (!childId) notFound();

  const child = getSitemapChildFile(childId);
  if (!child || child.entries.length === 0) notFound();

  const xml = buildUrlsetXml(child.entries);
  return new Response(xml, { headers: SITEMAP_XML_HEADERS });
}
