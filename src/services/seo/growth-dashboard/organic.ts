import path from "node:path";
import type { SearchSnapshot } from "@/domain";
import { SearchSnapshotSchema } from "@/domain";
import { aggregatePage } from "@/services/seo/aggregate";
import { normalizePagePath } from "@/services/seo/url-resolver";
import { expectedCtrForPosition } from "@/data/config/seo/ctr-baselines";
import {
  listSnapshots,
  loadFixtureSnapshot,
  loadSnapshot,
} from "@/data/seo/store";
import { firstExisting, notConnected, num, pct, readJsonIfExists } from "./io";
import { classifyDataValidity } from "./validity";
import type { CtrOpportunityRow, OrganicSearchSection } from "./types";

type RawExport = {
  synthetic?: boolean;
  label?: string;
  meta?: {
    dataThroughDate?: string;
    rangeLabel?: string;
    retrievedAt?: string;
    /** Property totals from Chart/Devices — use when Pages tab is GSC-capped. */
    siteTotals?: {
      clicks?: number;
      impressions?: number;
      ctr?: number;
      position?: number;
      source?: string;
    };
    pageExportCap?: number;
  };
  rows?: Array<{
    page?: string;
    query?: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  }>;
};

const CTR_COMPARE_MIN_IMPRESSIONS = 50;

function ensureSlash(p: string): string {
  if (!p || p === "/") return "/";
  const s = p.startsWith("/") ? p : `/${p}`;
  return s.endsWith("/") ? s : `${s}/`;
}

function loadGscPerformanceExport(cwd: string): {
  abs: string;
  data: RawExport;
} | null {
  const abs = firstExisting(
    path.join(cwd, "data/seo/gsc-export.json"),
    path.join(cwd, "docs/migration/data/gsc-export.json"),
    path.join(cwd, "src/data/seo/imports/gsc-export.json"),
    path.join(cwd, "data/seo/imports/gsc-export.json"),
  );
  if (!abs) return null;
  const data = readJsonIfExists<RawExport>(abs);
  if (!data?.rows?.length) return null;
  return { abs, data };
}

/** Prior REAL snapshot only — never pair REAL current with fixture previous. */
function loadComparableRealPrior(
  currentThrough: string | null,
  rangeLabel?: string,
): SearchSnapshot | null {
  if (!currentThrough) return null;
  const metas = listSnapshots()
    .filter((m) => m.source === "import" || m.source === "gsc")
    .sort((a, b) => b.dataThroughDate.localeCompare(a.dataThroughDate));
  for (const meta of metas) {
    if (meta.dataThroughDate >= currentThrough) continue;
    if (rangeLabel && meta.rangeLabel && meta.rangeLabel !== rangeLabel) {
      continue;
    }
    const snap = loadSnapshot(meta.id);
    if (!snap || snap.synthetic) continue;
    return snap;
  }
  return null;
}

function tryLoadPreviousFixtureSnapshot(): SearchSnapshot | null {
  try {
    return loadFixtureSnapshot("synthetic-28d-previous.json");
  } catch {
    return null;
  }
}

function emptyOrganic(validity: OrganicSearchSection["validity"]): OrganicSearchSection {
  const nc = notConnected();
  return {
    status: "not_connected",
    validity,
    sourceLabel: null,
    dataThroughDate: null,
    synthetic: false,
    discovery: { pagesWithImpressions: nc, impressions: nc },
    ranking: {
      top10: nc,
      band11to20: nc,
      band21to50: nc,
      deeperThan50: nc,
      weightedPosition: nc,
    },
    pageOneQuality: {
      top10Impressions: nc,
      top10Clicks: nc,
      top10ShareOfImpressions: nc,
      top10ImpressionShare: nc,
      top10PagesWith100PlusImpressions: nc,
      top10PagesWithClicks: nc,
      top10CommercialPages: nc,
      commercialTop10Pages: nc,
      commercialTop10Share: nc,
      siteCtr: nc,
      note: "GSC Performance export not connected.",
    },
    ctrDetail: {
      siteCtr: nc,
      comparedPageCount: nc,
      highImpressionLowCtr: [],
      note: "GSC Performance export not connected.",
    },
    traffic: { organicClicks: nc, pagesWithClicks: nc },
    clicks: nc,
    impressions: nc,
    ctr: nc,
    averagePosition: nc,
    pagesWithImpressions: nc,
    pagesWithClicks: nc,
    top10Count: nc,
    top20Count: nc,
    top50Count: nc,
    trend: {
      status: "not_connected",
      clicksDeltaPct: null,
      impressionsDeltaPct: null,
      ctrDeltaPct: null,
      positionDelta: null,
      note: "No prior comparable period import — trend not connected.",
    },
  };
}

function looksCommercialPath(pagePath: string): boolean {
  if (
    pagePath.startsWith("/software/") ||
    pagePath.startsWith("/compare/") ||
    pagePath.startsWith("/best/") ||
    pagePath.startsWith("/alternatives/") ||
    pagePath.includes("/pricing")
  ) {
    return true;
  }
  if (pagePath.startsWith("/guides/")) {
    return /(?:plans|pricing|cost|worth-it|vs-|alternatives|setup)/i.test(
      pagePath,
    );
  }
  return false;
}

/**
 * Organic search: Discovery / Ranking / CTR / Traffic.
 * Never labels search "strong" from impressions alone.
 */
export function buildOrganicSearchSection(
  cwd = process.cwd(),
): OrganicSearchSection {
  const loaded = loadGscPerformanceExport(cwd);
  if (!loaded) {
    return emptyOrganic("NOT_CONNECTED");
  }

  const pageRows = loaded.data.rows!.filter((r) => r.page && !r.query);
  const rowsForAgg =
    pageRows.length > 0
      ? pageRows
      : loaded.data.rows!.filter((r) => r.page);

  const byPage = new Map<
    string,
    { clicks: number; impressions: number; positionWeighted: number }
  >();
  for (const row of rowsForAgg) {
    if (!row.page) continue;
    const p = ensureSlash(normalizePagePath(row.page));
    const cur = byPage.get(p) ?? {
      clicks: 0,
      impressions: 0,
      positionWeighted: 0,
    };
    cur.clicks += row.clicks;
    cur.impressions += row.impressions;
    cur.positionWeighted += row.position * row.impressions;
    byPage.set(p, cur);
  }

  let clicks = 0;
  let impressions = 0;
  let pagesWithImpressions = 0;
  let pagesWithClicks = 0;
  let top10 = 0;
  let band11to20 = 0;
  let band21to50 = 0;
  let deeperThan50 = 0;
  let top20 = 0;
  let top50 = 0;
  let positionWeighted = 0;
  let top10Impressions = 0;
  let top10Clicks = 0;
  let commercialTop10Pages = 0;
  let top10PagesWith100PlusImpressions = 0;
  let top10PagesWithClicks = 0;
  const ctrGaps: CtrOpportunityRow[] = [];
  let comparedPageCount = 0;

  for (const [pagePath, cur] of byPage) {
    clicks += cur.clicks;
    impressions += cur.impressions;
    positionWeighted += cur.positionWeighted;
    if (cur.impressions > 0) pagesWithImpressions += 1;
    if (cur.clicks > 0) pagesWithClicks += 1;
    const pos =
      cur.impressions > 0 ? cur.positionWeighted / cur.impressions : null;
    if (pos != null && pos > 0) {
      if (pos <= 10) {
        top10 += 1;
        top10Impressions += cur.impressions;
        top10Clicks += cur.clicks;
        if (cur.impressions >= 100) top10PagesWith100PlusImpressions += 1;
        if (cur.clicks > 0) top10PagesWithClicks += 1;
        if (looksCommercialPath(pagePath)) commercialTop10Pages += 1;
      } else if (pos <= 20) band11to20 += 1;
      else if (pos <= 50) band21to50 += 1;
      else deeperThan50 += 1;
      if (pos <= 20) top20 += 1;
      if (pos <= 50) top50 += 1;
    }

    if (cur.impressions >= CTR_COMPARE_MIN_IMPRESSIONS && pos != null) {
      const expected = expectedCtrForPosition(pos);
      if (expected != null) {
        comparedPageCount += 1;
        const actual = cur.clicks / cur.impressions;
        const gap = (expected - actual) * 100;
        if (gap >= 1.5 && cur.impressions >= 100) {
          ctrGaps.push({
            path: pagePath,
            impressions: cur.impressions,
            position: Number(pos.toFixed(1)),
            actualCtr: Number((actual * 100).toFixed(2)),
            expectedCtr: Number((expected * 100).toFixed(2)),
            ctrGapPctPoints: Number(gap.toFixed(2)),
          });
        }
      }
    }
  }

  ctrGaps.sort(
    (a, b) =>
      b.ctrGapPctPoints * Math.log10(1 + b.impressions) -
      a.ctrGapPctPoints * Math.log10(1 + a.impressions),
  );

  const siteTotals = loaded.data.meta?.siteTotals;
  const siteClicks =
    typeof siteTotals?.clicks === "number" ? siteTotals.clicks : clicks;
  const siteImpressions =
    typeof siteTotals?.impressions === "number"
      ? siteTotals.impressions
      : impressions;
  const ctr =
    typeof siteTotals?.ctr === "number"
      ? siteTotals.ctr
      : siteImpressions > 0
        ? siteClicks / siteImpressions
        : 0;
  const avgPos =
    typeof siteTotals?.position === "number"
      ? siteTotals.position
      : impressions > 0
        ? positionWeighted / impressions
        : 0;
  clicks = siteClicks;
  impressions = siteImpressions;

  let trend: OrganicSearchSection["trend"] = {
    status: "not_connected",
    clicksDeltaPct: null,
    impressionsDeltaPct: null,
    ctrDeltaPct: null,
    positionDelta: null,
    note: "No paired prior GSC period for this export — import a previous-period snapshot to enable trend.",
  };

  const dataThrough = loaded.data.meta?.dataThroughDate ?? null;

  if (loaded.data.synthetic) {
    // Fixture↔fixture only — never shown as production period-over-period.
    const previous = tryLoadPreviousFixtureSnapshot();
    if (previous) {
      const prevPages = aggregatePage(previous.rows.filter((r) => r.page));
      const prevClicks = prevPages.reduce((s, p) => s + p.clicks, 0);
      const prevImp = prevPages.reduce((s, p) => s + p.impressions, 0);
      const prevCtr = prevImp > 0 ? prevClicks / prevImp : 0;
      const prevPos =
        prevImp > 0
          ? prevPages.reduce((s, p) => s + p.position * p.impressions, 0) /
            prevImp
          : 0;
      trend = {
        status: "partial",
        clicksDeltaPct:
          prevClicks > 0 ? ((clicks - prevClicks) / prevClicks) * 100 : null,
        impressionsDeltaPct:
          prevImp > 0 ? ((impressions - prevImp) / prevImp) * 100 : null,
        ctrDeltaPct: prevCtr > 0 ? ((ctr - prevCtr) / prevCtr) * 100 : null,
        positionDelta: avgPos - prevPos,
        note: "FIXTURE trend vs synthetic prior — not production GSC period-over-period.",
      };
    }
  } else {
    const previous = loadComparableRealPrior(
      dataThrough,
      loaded.data.meta?.rangeLabel,
    );
    if (previous) {
      const prevPages = aggregatePage(previous.rows.filter((r) => r.page));
      const prevClicks = prevPages.reduce((s, p) => s + p.clicks, 0);
      const prevImp = prevPages.reduce((s, p) => s + p.impressions, 0);
      const prevCtr = prevImp > 0 ? prevClicks / prevImp : 0;
      const prevPos =
        prevImp > 0
          ? prevPages.reduce((s, p) => s + p.position * p.impressions, 0) /
            prevImp
          : 0;
      trend = {
        status: "connected",
        clicksDeltaPct:
          prevClicks > 0 ? ((clicks - prevClicks) / prevClicks) * 100 : null,
        impressionsDeltaPct:
          prevImp > 0 ? ((impressions - prevImp) / prevImp) * 100 : null,
        ctrDeltaPct: prevCtr > 0 ? ((ctr - prevCtr) / prevCtr) * 100 : null,
        positionDelta: avgPos - prevPos,
        note: `REAL period-over-period vs snapshot through ${previous.meta.dataThroughDate} (${previous.meta.rangeLabel})`,
      };
    } else {
      trend = {
        status: "not_connected",
        clicksDeltaPct: null,
        impressionsDeltaPct: null,
        ctrDeltaPct: null,
        positionDelta: null,
        note:
          "No comparable REAL GSC Performance period on disk (same range label required). Last-12-months vs Last-3-months is NOT_YET_MEASURABLE — retain this snapshot and import a later Last-12-months export.",
      };
    }
  }

  const validity = classifyDataValidity({
    connected: true,
    synthetic: Boolean(loaded.data.synthetic),
    sourcePath: loaded.abs,
    dataThroughDate: loaded.data.meta?.dataThroughDate,
  });

  const siteCtr = pct(ctr * 100, "Site CTR — not a ranking quality label");
  const weightedPos = num(
    Number(avgPos.toFixed(1)),
    "Impression-weighted average — not fixed SERP rank",
  );
  const top10Share =
    impressions > 0 ? (top10Impressions / impressions) * 100 : 0;
  const commercialShare = top10 > 0 ? (commercialTop10Pages / top10) * 100 : 0;
  const shareMetric = pct(
    Number(top10Share.toFixed(1)),
    "Share of site impressions occurring in Top 10",
  );
  const commercialCountMetric = num(
    commercialTop10Pages,
    "Top-10 pages on software/compare/best/buying-guide paths",
  );
  const trafficClickNote =
    clicks < 50
      ? "Low absolute volume — not strong performance"
      : clicks < 100
        ? "Modest volume — treat as building, not strong"
        : undefined;

  return {
    status: "connected",
    validity,
    sourceLabel: loaded.data.label ?? path.basename(loaded.abs),
    dataThroughDate: loaded.data.meta?.dataThroughDate ?? null,
    synthetic: Boolean(loaded.data.synthetic),
    discovery: {
      pagesWithImpressions: num(
        pagesWithImpressions,
        loaded.data.meta?.pageExportCap
          ? `Pages receiving ≥1 impression in the Pages tab (GSC export capped at ${loaded.data.meta.pageExportCap})`
          : "Pages receiving ≥1 impression",
      ),
      impressions: num(impressions, "Discovery demand — not ranking strength"),
    },
    ranking: {
      top10: num(top10, "Pages with avg position ≤ 10 — count alone is not quality"),
      band11to20: num(band11to20, "Pages with avg position 11–20"),
      band21to50: num(band21to50, "Pages with avg position 21–50"),
      deeperThan50: num(deeperThan50, "Pages with avg position > 50"),
      weightedPosition: weightedPos,
    },
    pageOneQuality: {
      top10Impressions: num(
        top10Impressions,
        "Impressions on pages averaging ≤10",
      ),
      top10Clicks: num(top10Clicks, "Clicks on pages averaging ≤10"),
      top10ShareOfImpressions: shareMetric,
      top10ImpressionShare: shareMetric,
      top10PagesWith100PlusImpressions: num(
        top10PagesWith100PlusImpressions,
        "Top-10 pages with ≥100 impressions",
      ),
      top10PagesWithClicks: num(
        top10PagesWithClicks,
        "Top-10 pages earning ≥1 click",
      ),
      top10CommercialPages: commercialCountMetric,
      commercialTop10Pages: commercialCountMetric,
      commercialTop10Share: pct(
        Number(commercialShare.toFixed(1)),
        "Share of Top-10 pages that look commercial/search-intent",
      ),
      siteCtr,
      note: "Page-one quality uses impressions, clicks, CTR, intent mix, and Top-10 share — not page count alone.",
    },
    ctrDetail: {
      siteCtr,
      comparedPageCount: num(
        comparedPageCount,
        `Pages with ≥${CTR_COMPARE_MIN_IMPRESSIONS} impressions and expected CTR baseline`,
      ),
      highImpressionLowCtr: ctrGaps.slice(0, 15),
      note: "Expected CTR is a heuristic baseline for opportunity spotting — not a GSC guarantee.",
    },
    traffic: {
      organicClicks: num(clicks, trafficClickNote),
      pagesWithClicks: num(pagesWithClicks, "Pages earning ≥1 click"),
    },
    clicks: num(clicks, trafficClickNote),
    impressions: num(impressions),
    ctr: siteCtr,
    averagePosition: weightedPos,
    pagesWithImpressions: num(pagesWithImpressions),
    pagesWithClicks: num(pagesWithClicks),
    top10Count: num(top10, "Pages with avg position ≤ 10"),
    top20Count: num(top20, "Pages with avg position ≤ 20"),
    top50Count: num(top50, "Pages with avg position ≤ 50"),
    trend,
  };
}

/** @internal parse helper for tests */
export function __parseSnapshot(raw: unknown): SearchSnapshot {
  return SearchSnapshotSchema.parse(raw);
}
