import type { SearchSnapshot } from "@/domain";
import type { SearchVisibilityMetricsInput } from "@/domain/schemas/site-intelligence";
import { expectedCtrForPosition } from "@/data/config/seo/ctr-baselines";
import { resolveSearchUrl } from "@/services/seo/url-resolver";
import { aggregatePage, aggregateQuery } from "@/services/seo/aggregate";
import type {
  SearchPerformanceReport,
  SearchPerformanceSignal,
  SearchPerformanceSnapshot,
} from "./types";
import { snapshotFromSearchSnapshot } from "./types";

const NEAR_WIN_MIN_POS = 8;
const NEAR_WIN_MAX_POS = 20;
const NEAR_WIN_MIN_IMP = 80;
const CTR_MIN_IMP = 100;
const DEFEND_MAX_POS = 5;
const DEFEND_MIN_CLICKS = 10;

export const POSITION_METHODOLOGY = [
  "Average position (GSC) is an impression-weighted average across the reporting period — not a fixed SERP rank.",
  "A URL can appear at different ranks for the same query on different days/devices; the metric blends those appearances.",
  "Do not treat position 8.4 as “always rank #8.” Use it as a relative traction/near-win signal only.",
  "Site Intelligence never converts average position into a “% chance to rank.”",
] as const;

function pathOf(page: string): string {
  return resolveSearchUrl(page).normalizedPath;
}

function parentClusterPrefix(pagePath: string): string {
  const parts = pagePath.split("/").filter(Boolean);
  if (parts.length >= 1) return `/${parts[0]}/`;
  return "/";
}

export function analyzeSearchPerformance(input: {
  generatedAt: string;
  sourceMode: SearchPerformanceReport["sourceMode"];
  current: SearchSnapshot | null;
  previous: SearchSnapshot | null;
  notes?: string[];
}): SearchPerformanceReport {
  const methodologyNotes = [...POSITION_METHODOLOGY];
  const notes = [...(input.notes ?? [])];
  const disclaimers = [
    "Does not scrape Google Search Console HTML.",
    "Does not invent credentials or fabricate live GSC rows.",
    "Fixture/synthetic snapshots must not be claimed as live SoftwareGlimpse GSC.",
  ];

  if (!input.current) {
    return {
      generatedAt: input.generatedAt,
      sourceMode: "none",
      live: false,
      synthetic: false,
      totals: {
        clicks: 0,
        impressions: 0,
        avgCtr: null,
        avgPosition: null,
        queryCount: 0,
        pageCount: 0,
      },
      snapshots: [],
      nearWins: [],
      ctrOpportunities: [],
      refreshCandidates: [],
      emergingTopics: [],
      defendCluster: [],
      visibilityMetrics: null,
      methodologyNotes,
      notes: [
        ...notes,
        "No search-performance snapshot available — visibility DATA NOT AVAILABLE",
      ],
      disclaimers,
    };
  }

  const current = input.current;
  const snapshots = snapshotFromSearchSnapshot(current);
  const pageAggs = aggregatePage(current.rows);
  const queryAggs = aggregateQuery(current.rows);

  const totalClicks = current.rows.reduce((s, r) => s + r.clicks, 0);
  const totalImp = current.rows.reduce((s, r) => s + r.impressions, 0);
  const avgCtr = totalImp > 0 ? totalClicks / totalImp : null;
  const avgPosition =
    totalImp > 0
      ? current.rows.reduce((s, r) => s + r.position * r.impressions, 0) /
        totalImp
      : null;

  const nearWins = detectNearWins(snapshots);
  const ctrOpportunities = detectCtrOpportunities(snapshots);
  const refreshCandidates = detectRefresh(
    current,
    input.previous,
  );
  const emergingTopics = detectEmerging(current, input.previous);
  const defendCluster = detectDefend(snapshots, pageAggs);

  const visibilityMetrics = toVisibilityMetrics(current, {
    pageCount: pageAggs.length,
    queryCount: queryAggs.length,
    totalClicks,
    totalImp,
    avgCtr,
    avgPosition,
  });

  if (current.synthetic) {
    notes.push(
      "SYNTHETIC snapshot — suitable for pipeline tests; do not claim live SoftwareGlimpse GSC",
    );
  } else if (current.meta.source === "import") {
    notes.push("Imported GSC-shaped snapshot (approved export) — treat as performance truth for this run");
  } else if (current.meta.source === "gsc") {
    notes.push("Live GSC source label on snapshot");
  }

  const period =
    current.rows[0]?.dateRange ?? {
      startDate: current.meta.dataThroughDate,
      endDate: current.meta.dataThroughDate,
    };

  return {
    generatedAt: input.generatedAt,
    sourceMode: input.sourceMode,
    live: !current.synthetic && (current.meta.source === "gsc" || current.meta.source === "import"),
    synthetic: Boolean(current.synthetic),
    current: {
      id: current.meta.id,
      rangeLabel: current.meta.rangeLabel,
      dataThroughDate: current.meta.dataThroughDate,
      source: current.meta.source,
      rowCount: current.rows.length,
      period,
    },
    previous: input.previous
      ? {
          id: input.previous.meta.id,
          rangeLabel: input.previous.meta.rangeLabel,
          dataThroughDate: input.previous.meta.dataThroughDate,
        }
      : undefined,
    totals: {
      clicks: totalClicks,
      impressions: totalImp,
      avgCtr,
      avgPosition,
      queryCount: queryAggs.length,
      pageCount: pageAggs.length,
    },
    snapshots,
    nearWins,
    ctrOpportunities,
    refreshCandidates,
    emergingTopics,
    defendCluster,
    visibilityMetrics,
    methodologyNotes,
    notes,
    disclaimers,
  };
}

function detectNearWins(
  rows: SearchPerformanceSnapshot[],
): SearchPerformanceSignal[] {
  return rows
    .filter(
      (r) =>
        r.impressions >= NEAR_WIN_MIN_IMP &&
        r.position >= NEAR_WIN_MIN_POS &&
        r.position <= NEAR_WIN_MAX_POS,
    )
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 25)
    .map((r) => ({
      kind: "near-win" as const,
      title: `Near-win: “${r.query}”`,
      page: pathOf(r.page),
      query: r.query,
      impressions: r.impressions,
      clicks: r.clicks,
      ctr: r.ctr,
      position: r.position,
      detail: `High impressions (${r.impressions}) with average position ${r.position.toFixed(1)} (band ${NEAR_WIN_MIN_POS}–${NEAR_WIN_MAX_POS})`,
      recommendedAction:
        "Improve existing page depth/intent match and internal links — treat as breakthrough candidate, not a guaranteed rank",
    }));
}

function detectCtrOpportunities(
  rows: SearchPerformanceSnapshot[],
): SearchPerformanceSignal[] {
  const out: SearchPerformanceSignal[] = [];
  for (const r of rows) {
    if (r.impressions < CTR_MIN_IMP) continue;
    const expected = expectedCtrForPosition(r.position);
    if (expected == null) continue;
    if (r.ctr >= expected * 0.65) continue;
    out.push({
      kind: "ctr-opportunity",
      title: `CTR opportunity: “${r.query}”`,
      page: pathOf(r.page),
      query: r.query,
      impressions: r.impressions,
      clicks: r.clicks,
      ctr: r.ctr,
      position: r.position,
      detail: `CTR ${(r.ctr * 100).toFixed(2)}% vs expected ~${(expected * 100).toFixed(2)}% at avg position ${r.position.toFixed(1)}`,
      recommendedAction:
        "Test title/meta description / SERP snippet clarity — do not assume ranking change is required",
    });
  }
  return out.sort((a, b) => b.impressions - a.impressions).slice(0, 25);
}

function detectRefresh(
  current: SearchSnapshot,
  previous: SearchSnapshot | null,
): SearchPerformanceSignal[] {
  if (!previous) return [];
  const curPages = aggregatePage(current.rows);
  const prevPages = aggregatePage(previous.rows);
  const prevBy = new Map(
    prevPages.map((p) => [pathOf(p.page), p]),
  );
  const out: SearchPerformanceSignal[] = [];
  for (const cur of curPages) {
    const prev = prevBy.get(pathOf(cur.page));
    if (!prev || prev.impressions < 50) continue;
    const posWorse = cur.position - prev.position >= 2;
    const clickDrop =
      prev.clicks >= 10 && cur.clicks < prev.clicks * 0.75;
    if (!posWorse && !clickDrop) continue;
    out.push({
      kind: "refresh-candidate",
      title: `Refresh candidate: ${pathOf(cur.page)}`,
      page: pathOf(cur.page),
      impressions: cur.impressions,
      clicks: cur.clicks,
      ctr: cur.ctr,
      position: cur.position,
      detail: `Avg position ${prev.position.toFixed(1)} → ${cur.position.toFixed(1)}; clicks ${prev.clicks} → ${cur.clicks}`,
      recommendedAction:
        "Refresh content/evidence/freshness signals; investigate SERP feature shifts before rewriting wholesale",
    });
  }
  return out.sort((a, b) => b.impressions - a.impressions).slice(0, 20);
}

function detectEmerging(
  current: SearchSnapshot,
  previous: SearchSnapshot | null,
): SearchPerformanceSignal[] {
  if (!previous) return [];
  const prevQueries = new Set(
    previous.rows.filter((r) => r.query).map((r) => r.query!.toLowerCase()),
  );
  const out: SearchPerformanceSignal[] = [];
  for (const r of current.rows) {
    if (!r.query || !r.page) continue;
    if (prevQueries.has(r.query.toLowerCase())) continue;
    if (r.impressions < 40) continue;
    out.push({
      kind: "emerging-topic",
      title: `Emerging: “${r.query}”`,
      page: pathOf(r.page),
      query: r.query,
      impressions: r.impressions,
      clicks: r.clicks,
      ctr: r.ctr,
      position: r.position,
      detail: `New impressions in current period (${r.impressions}) not present in prior snapshot`,
      recommendedAction:
        "Evaluate as new/expanding topic — confirm intent fit before creating net-new pages",
    });
  }
  return out.sort((a, b) => b.impressions - a.impressions).slice(0, 20);
}

function detectDefend(
  rows: SearchPerformanceSnapshot[],
  pageAggs: ReturnType<typeof aggregatePage>,
): SearchPerformanceSignal[] {
  const pagesWithImp = new Map<string, number>();
  for (const p of pageAggs) {
    pagesWithImp.set(pathOf(p.page), p.impressions);
  }

  const strong = rows.filter(
    (r) => r.position <= DEFEND_MAX_POS && r.clicks >= DEFEND_MIN_CLICKS,
  );
  const out: SearchPerformanceSignal[] = [];
  for (const r of strong) {
    const pagePath = pathOf(r.page);
    const prefix = parentClusterPrefix(pagePath);
    let clusterSupport = 0;
    for (const [p, imp] of pagesWithImp) {
      if (p !== pagePath && p.startsWith(prefix) && imp >= 30) {
        clusterSupport += 1;
      }
    }
    if (clusterSupport >= 3) continue;
    out.push({
      kind: "defend-cluster",
      title: `Defend/build cluster around ${pagePath}`,
      page: pagePath,
      query: r.query,
      impressions: r.impressions,
      clicks: r.clicks,
      ctr: r.ctr,
      position: r.position,
      detail: `Strong avg position ${r.position.toFixed(1)} but only ${clusterSupport} sibling pages with measurable impressions under ${prefix}`,
      recommendedAction:
        "Build/strengthen supporting cluster pages and internal links to defend topical authority",
    });
  }
  return out.slice(0, 15);
}

function toVisibilityMetrics(
  snap: SearchSnapshot,
  stats: {
    pageCount: number;
    queryCount: number;
    totalClicks: number;
    totalImp: number;
    avgCtr: number | null;
    avgPosition: number | null;
  },
): SearchVisibilityMetricsInput {
  // Normalize coarsely for Site Intelligence pillar F — not a ranking model.
  const impressionsNorm = Math.min(100, Math.round(Math.log10(stats.totalImp + 1) * 25));
  const clicksNorm = Math.min(100, Math.round(Math.log10(stats.totalClicks + 1) * 28));
  const ctrNorm =
    stats.avgCtr == null ? 40 : Math.min(100, Math.round(stats.avgCtr * 1000));
  const positionDistributionNorm =
    stats.avgPosition == null
      ? 40
      : Math.max(10, Math.min(100, Math.round(100 - (stats.avgPosition - 1) * 6)));
  const queryCoverageNorm = Math.min(100, stats.queryCount * 4);
  const indexedPerformingCoverage = Math.min(100, stats.pageCount * 5);
  const nonBrandClickShareNorm = 55; // brand split not computed without brand list

  return {
    synthetic: Boolean(snap.synthetic),
    indexedPerformingCoverage,
    impressionsNorm,
    clicksNorm,
    ctrNorm,
    positionDistributionNorm,
    queryCoverageNorm,
    nonBrandClickShareNorm,
    notes: [
      snap.synthetic
        ? "Derived from SYNTHETIC search-performance snapshot"
        : `Derived from ${snap.meta.source} snapshot ${snap.meta.id}`,
      "Average position used only as a distribution proxy — not fixed SERP rank",
    ],
  };
}
