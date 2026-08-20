import type {
  CompetitorSignificance,
  DomainCompetitor,
  QueryLevelCompetitors,
  QuerySeed,
  SerpCompetitorDiscoveryReport,
  SerpQueryResult,
} from "./types";
import {
  classifyCompetitorDomain,
  competitorTypeLabel,
  inferPageTypeFromUrl,
} from "./classify-domain";

const OWN = new Set(["softwareglimpse.com"]);

function significanceFor(input: {
  queryCount: number;
  totalQueries: number;
  avgPosition: number;
  score: number;
}): CompetitorSignificance {
  const coverage = input.queryCount / Math.max(1, input.totalQueries);
  if (coverage >= 0.35 && input.avgPosition <= 6 && input.score >= 55) {
    return "primary-organic-competitor";
  }
  if (coverage >= 0.15 || (input.queryCount >= 3 && input.avgPosition <= 8)) {
    return "secondary";
  }
  return "query-specific";
}

/**
 * Aggregate per-query SERPs into domain competitors + query-level lists.
 */
export function aggregateSerpCompetitors(input: {
  cluster: string;
  seeds: QuerySeed[];
  serpResults: SerpQueryResult[];
  generatedAt: string;
  provider: string;
  staleAfterDays?: number;
}): SerpCompetitorDiscoveryReport {
  const seedByQuery = new Map(
    input.seeds.map((s) => [s.query.toLowerCase(), s]),
  );
  const totalQueries = input.serpResults.filter((r) => r.results.length > 0)
    .length;

  type Acc = {
    domain: string;
    positions: number[];
    queries: Set<string>;
    urls: string[];
    pageTypes: Set<string>;
  };
  const byDomain = new Map<string, Acc>();
  let resultCount = 0;

  const byQuery: QueryLevelCompetitors[] = [];

  for (const serp of input.serpResults) {
    const seed = seedByQuery.get(serp.query.toLowerCase());
    const competitors: QueryLevelCompetitors["competitors"] = [];

    for (const row of serp.results) {
      if (OWN.has(row.domain)) continue;
      resultCount += 1;
      const type = classifyCompetitorDomain(row.domain);
      competitors.push({
        domain: row.domain,
        type,
        rank: row.rank,
        url: row.url,
        title: row.title,
      });

      const acc = byDomain.get(row.domain) ?? {
        domain: row.domain,
        positions: [],
        queries: new Set<string>(),
        urls: [],
        pageTypes: new Set<string>(),
      };
      acc.positions.push(row.rank);
      acc.queries.add(serp.query);
      if (acc.urls.length < 5) acc.urls.push(row.url);
      acc.pageTypes.add(inferPageTypeFromUrl(row.url, row.title));
      byDomain.set(row.domain, acc);
    }

    byQuery.push({
      query: serp.query,
      intent: seed?.intent ?? "unknown",
      associatedPage: seed?.associatedPage ?? null,
      competitors: competitors.sort((a, b) => a.rank - b.rank),
    });
  }

  const domains: DomainCompetitor[] = [...byDomain.values()].map((acc) => {
    const avgPosition =
      acc.positions.reduce((a, b) => a + b, 0) / acc.positions.length;
    const bestPosition = Math.min(...acc.positions);
    const queryCount = acc.queries.size;
    const frequency = queryCount;
    // Score: frequency + position quality + coverage
    const coverage = queryCount / Math.max(1, totalQueries);
    const positionScore = Math.max(0, 1 - (avgPosition - 1) / 10);
    const score = Math.round(
      coverage * 50 + positionScore * 35 + Math.min(15, queryCount * 2),
    );
    const type = classifyCompetitorDomain(acc.domain);
    return {
      domain: acc.domain,
      type,
      significance: significanceFor({
        queryCount,
        totalQueries,
        avgPosition,
        score,
      }),
      frequency,
      avgPosition: Math.round(avgPosition * 10) / 10,
      bestPosition,
      queryCount,
      queries: [...acc.queries].sort(),
      sampleUrls: acc.urls,
      pageTypesObserved: [...acc.pageTypes].sort(),
      score,
    };
  });

  domains.sort(
    (a, b) =>
      b.score - a.score ||
      b.queryCount - a.queryCount ||
      a.avgPosition - b.avgPosition ||
      a.domain.localeCompare(b.domain),
  );

  return {
    generatedAt: input.generatedAt,
    cluster: input.cluster,
    provider: input.provider,
    queryCount: input.serpResults.length,
    resultCount,
    staleAfterDays: input.staleAfterDays ?? 14,
    domains,
    byQuery,
    notes: [
      `Aggregated ${totalQueries} non-empty SERPs across ${input.serpResults.length} queries`,
      "Competitors identified from current organic results — not a hardcoded business list",
      `Own domain softwareglimpse.com excluded from competitor tables`,
    ],
    disclaimer:
      "SERP competitor snapshots go stale. Re-run periodically. This is not a ranking prediction and not a curated sales-competitor list.",
  };
}

export { competitorTypeLabel };
