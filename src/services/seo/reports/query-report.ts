import type { SearchPerformanceRow, SeoOpportunity } from "@/domain";
import { aggregatePageQuery, aggregateQuery } from "../aggregate";
import { classifyQuery } from "../classify-query";
import { clusterKeyForQuery } from "../cluster-queries";
import { resolveSearchUrl } from "../url-resolver";

export type QueryReport = {
  query: string;
  normalized: string;
  clusterKey: string;
  intent: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  pages: Array<{ page: string; path: string; impressions: number }>;
  relatedOpportunities: SeoOpportunity[];
};

export function buildQueryReport(
  query: string,
  rows: SearchPerformanceRow[],
  opportunities: SeoOpportunity[] = [],
): QueryReport {
  const classified = classifyQuery(query);
  const matching = rows.filter(
    (r) => r.query?.toLowerCase() === query.toLowerCase(),
  );
  const agg = aggregateQuery(matching)[0] ?? {
    query,
    clicks: 0,
    impressions: 0,
    ctr: 0,
    position: 0,
  };
  const pages = aggregatePageQuery(matching).map((pq) => ({
    page: pq.page,
    path: resolveSearchUrl(pq.page).normalizedPath,
    impressions: pq.impressions,
  }));

  return {
    query,
    normalized: classified.normalized,
    clusterKey: clusterKeyForQuery(query),
    intent: classified.intent,
    clicks: agg.clicks,
    impressions: agg.impressions,
    ctr: agg.ctr,
    position: agg.position,
    pages,
    relatedOpportunities: opportunities.filter(
      (o) =>
        o.query?.toLowerCase() === query.toLowerCase() ||
        (o.queryCluster && o.queryCluster === clusterKeyForQuery(query)),
    ),
  };
}
