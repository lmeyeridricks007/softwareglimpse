import type {
  DomainCompetitor,
  QueryLevelCompetitors,
  SerpCompetitorDiscoveryReport,
} from "../serp-competitors/types";
import type {
  QueryClusterId,
  SampledQueryCluster,
} from "./types";

const PRIORITY_QUERIES = [
  "best crm software",
  "hubspot vs pipedrive",
  "crm evaluation checklist",
  "crm migration",
  "hubspot review",
  "pipedrive review",
  "how to choose crm",
  "crm comparison",
  "crm implementation",
  "crm for financial services",
] as const;

export function clusterIdForQuery(query: string): QueryClusterId {
  const q = query.toLowerCase();
  if (/\bbest\b|\btop\b/.test(q)) return "best-list";
  if (/\bvs\.?\b|versus|compar/.test(q)) return "comparison";
  if (/\breview\b/.test(q)) return "review";
  if (/checklist|evaluat|requirement|rfp/.test(q)) return "evaluation-checklist";
  if (/migrat|implement/.test(q)) return "migration-implementation";
  if (/how to|what is|guide|types of|benefits|glossary/.test(q)) {
    return "category-guide";
  }
  return "other";
}

const CLUSTER_LABELS: Record<QueryClusterId, string> = {
  "best-list": "Best / listicle",
  comparison: "Comparisons",
  review: "Product reviews",
  "evaluation-checklist": "Evaluation / checklists",
  "migration-implementation": "Migration / implementation",
  "category-guide": "Category / guides",
  other: "Other CRM topics",
};

/**
 * Sample 3–8 significant domains per high-priority query cluster.
 * Uses SERP results only — never a hardcoded business-competitor list.
 */
export function sampleCompetitorClusters(
  report: SerpCompetitorDiscoveryReport,
  opts: {
    minDomainsPerCluster?: number;
    maxDomainsPerCluster?: number;
    maxPagesPerDomain?: number;
  } = {},
): SampledQueryCluster[] {
  const minD = opts.minDomainsPerCluster ?? 3;
  const maxD = opts.maxDomainsPerCluster ?? 8;
  const maxPages = opts.maxPagesPerDomain ?? 2;

  const domainMeta = new Map(
    report.domains.map((d) => [d.domain, d] as const),
  );
  const byQuery = new Map(
    report.byQuery.map((q) => [q.query.toLowerCase(), q] as const),
  );

  const priorityWithResults = PRIORITY_QUERIES.map((q) => byQuery.get(q)).filter(
    (q): q is QueryLevelCompetitors =>
      Boolean(q && q.competitors.length > 0),
  );

  // Fall back: any non-empty SERP queries if priority empty
  const baseQueries =
    priorityWithResults.length > 0
      ? priorityWithResults
      : report.byQuery.filter((q) => q.competitors.length > 0);

  const grouped = new Map<
    QueryClusterId,
    {
      queries: QueryLevelCompetitors[];
      domainRanks: Map<string, { bestRank: number; urls: Map<string, { url: string; title: string; rank: number; query: string }> }>;
    }
  >();

  for (const q of baseQueries) {
    const id = clusterIdForQuery(q.query);
    const g = grouped.get(id) ?? {
      queries: [],
      domainRanks: new Map(),
    };
    g.queries.push(q);
    for (const c of q.competitors) {
      const acc = g.domainRanks.get(c.domain) ?? {
        bestRank: c.rank,
        urls: new Map(),
      };
      acc.bestRank = Math.min(acc.bestRank, c.rank);
      if (!acc.urls.has(c.url) && acc.urls.size < maxPages) {
        acc.urls.set(c.url, {
          url: c.url,
          title: c.title,
          rank: c.rank,
          query: q.query,
        });
      }
      g.domainRanks.set(c.domain, acc);
    }
    grouped.set(id, g);
  }

  const clusters: SampledQueryCluster[] = [];

  for (const [id, g] of grouped) {
    const ranked = [...g.domainRanks.entries()]
      .map(([domain, acc]) => {
        const meta = domainMeta.get(domain);
        const significanceScore =
          meta?.score ??
          Math.max(0, 100 - acc.bestRank * 10);
        return {
          domain,
          type: meta?.type ?? ("other" as const),
          significance: meta?.significance ?? "query-specific",
          bestRank: acc.bestRank,
          significanceScore,
          samplePages: [...acc.urls.values()].sort((a, b) => a.rank - b.rank),
        };
      })
      .sort(
        (a, b) =>
          b.significanceScore - a.significanceScore ||
          a.bestRank - b.bestRank ||
          a.domain.localeCompare(b.domain),
      );

    // Prefer primary/secondary; fill to min–max
    const primaries = ranked.filter((d) =>
      ["primary-organic-competitor", "secondary"].includes(d.significance),
    );
    let picked = (primaries.length >= minD ? primaries : ranked).slice(0, maxD);
    if (picked.length < minD) {
      picked = ranked.slice(0, Math.min(maxD, Math.max(minD, ranked.length)));
    }

    const sgPage =
      g.queries.find((q) => q.associatedPage)?.associatedPage ?? null;

    clusters.push({
      id,
      label: CLUSTER_LABELS[id],
      queries: g.queries.map((q) => q.query),
      softwareGlimpsePage: sgPage,
      domains: picked.map((d) => ({
        domain: d.domain,
        type: d.type,
        significance: d.significance,
        samplePages: d.samplePages,
      })),
    });
  }

  return clusters.sort((a, b) => a.label.localeCompare(b.label));
}

export function uniqueSamplePages(
  clusters: SampledQueryCluster[],
  maxTotalPages = 24,
): Array<{
  url: string;
  title: string;
  domain: string;
  query: string;
  rank: number;
  pageTypeHint?: string;
}> {
  const seen = new Set<string>();
  const out: Array<{
    url: string;
    title: string;
    domain: string;
    query: string;
    rank: number;
  }> = [];
  for (const c of clusters) {
    for (const d of c.domains) {
      for (const p of d.samplePages) {
        if (seen.has(p.url)) continue;
        seen.add(p.url);
        out.push({
          url: p.url,
          title: p.title,
          domain: d.domain,
          query: p.query,
          rank: p.rank,
        });
        if (out.length >= maxTotalPages) return out;
      }
    }
  }
  return out;
}

export function topDomainsAcrossClusters(
  clusters: SampledQueryCluster[],
  domainMeta: DomainCompetitor[],
  max = 8,
): string[] {
  const scores = new Map<string, number>();
  for (const c of clusters) {
    for (const d of c.domains) {
      const meta = domainMeta.find((x) => x.domain === d.domain);
      scores.set(
        d.domain,
        Math.max(scores.get(d.domain) ?? 0, meta?.score ?? 40),
      );
    }
  }
  return [...scores.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, max)
    .map(([d]) => d);
}
