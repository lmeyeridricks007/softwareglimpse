import type { SearchPerformanceRow, SeoOpportunity } from "@/domain";
import { aggregatePage, aggregatePageQuery } from "../aggregate";
import { resolveSearchUrl } from "../url-resolver";

export type PageReport = {
  page: string;
  normalizedPath: string;
  contentId?: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  topQueries: Array<{ query: string; clicks: number; impressions: number }>;
  relatedOpportunities: SeoOpportunity[];
};

export function buildPageReport(
  pageUrl: string,
  rows: SearchPerformanceRow[],
  opportunities: SeoOpportunity[] = [],
): PageReport {
  const resolution = resolveSearchUrl(pageUrl);
  const pageRows = rows.filter((r) => {
    if (!r.page) return false;
    return resolveSearchUrl(r.page).normalizedPath === resolution.normalizedPath;
  });
  const agg = aggregatePage(pageRows)[0] ?? {
    page: pageUrl,
    clicks: 0,
    impressions: 0,
    ctr: 0,
    position: 0,
  };
  const topQueries = aggregatePageQuery(pageRows)
    .slice(0, 10)
    .map((pq) => ({
      query: pq.query,
      clicks: pq.clicks,
      impressions: pq.impressions,
    }));

  const relatedOpportunities = opportunities.filter(
    (o) =>
      o.contentId === resolution.contentId ||
      o.evidence.pages.includes(resolution.normalizedPath),
  );

  return {
    page: pageUrl,
    normalizedPath: resolution.normalizedPath,
    contentId: resolution.contentId,
    clicks: agg.clicks,
    impressions: agg.impressions,
    ctr: agg.ctr,
    position: agg.position,
    topQueries,
    relatedOpportunities,
  };
}
