import path from "node:path";
import { normalizePagePath } from "@/services/seo/url-resolver";
import { firstExisting, readJsonIfExists } from "./io";
import { classifyDataValidity } from "./validity";
import type { OpportunityRow, OpportunitySection } from "./types";

type GscOppReport = {
  generatedAt?: string;
  sourceFile?: string;
  sourceLabel?: string | null;
  dataThroughDate?: string | null;
  provenance?: {
    synthetic?: boolean;
    dataThroughDate?: string | null;
    dateRangeStart?: string | null;
    dateRangeEnd?: string | null;
    importRetrievedAt?: string | null;
    generatedAt?: string;
  };
  top20?: Array<{
    path: string;
    opportunityScore: number;
    impressions: number;
    avgPosition: number;
    primaryAction: string;
    queueBucket?: string;
  }>;
  indexedImprovementQueue?: Array<{
    path: string;
    opportunityScore: number;
    impressions: number;
    avgPosition: number;
    primaryAction: string;
  }>;
  improvePromotionQueue?: Array<{
    path: string;
    opportunityScore: number;
    impressions: number;
    avgPosition: number;
    primaryAction: string;
  }>;
  allRanked?: Array<{
    path: string;
    opportunityScore: number;
    impressions: number;
    avgPosition: number;
    primaryAction: string;
    rootCauses?: string[];
  }>;
};

type RawExport = {
  label?: string;
  rows?: Array<{
    page?: string;
    query?: string;
    clicks: number;
    impressions: number;
    position: number;
  }>;
};

function ensureSlash(p: string): string {
  if (!p || p === "/") return "/";
  const s = p.startsWith("/") ? p : `/${p}`;
  return s.endsWith("/") ? s : `${s}/`;
}

function pagePositionBands(cwd: string): {
  band11to20: OpportunityRow[];
  top10: OpportunityRow[];
  declines: OpportunityRow[];
  label: string | null;
} {
  const abs = firstExisting(
    path.join(cwd, "data/seo/gsc-export.json"),
    path.join(cwd, "docs/migration/data/gsc-export.json"),
  );
  const data = abs ? readJsonIfExists<RawExport>(abs) : null;
  if (!data?.rows?.length) {
    return { band11to20: [], top10: [], declines: [], label: null };
  }

  const map = new Map<
    string,
    { impressions: number; positionWeighted: number; clicks: number }
  >();
  for (const row of data.rows) {
    if (!row.page || row.query) continue;
    const p = ensureSlash(normalizePagePath(row.page));
    const cur = map.get(p) ?? {
      impressions: 0,
      positionWeighted: 0,
      clicks: 0,
    };
    cur.impressions += row.impressions;
    cur.positionWeighted += row.position * row.impressions;
    cur.clicks += row.clicks;
    map.set(p, cur);
  }

  const band11to20: OpportunityRow[] = [];
  const top10: OpportunityRow[] = [];
  for (const [pathKey, cur] of map) {
    if (cur.impressions < 20) continue;
    const pos = cur.positionWeighted / cur.impressions;
    const row: OpportunityRow = {
      path: pathKey,
      score: null,
      impressions: cur.impressions,
      position: Number(pos.toFixed(1)),
      primaryAction: null,
    };
    if (pos > 10 && pos <= 20) band11to20.push(row);
    if (pos > 0 && pos <= 10) top10.push(row);
  }

  band11to20.sort((a, b) => (b.impressions ?? 0) - (a.impressions ?? 0));
  top10.sort((a, b) => (b.impressions ?? 0) - (a.impressions ?? 0));

  return {
    band11to20: band11to20.slice(0, 15),
    top10: top10.slice(0, 15),
    declines: [],
    label: data.label ?? path.basename(abs!),
  };
}

/**
 * Opportunity section — prefers GSC Opportunity Engine output; falls back to
 * position-band slices from Performance export. Ranking declines require a
 * prior period (otherwise empty + note).
 * Never treats fixture/synthetic opportunity reports as connected production data.
 */
export function buildOpportunitySection(cwd = process.cwd()): OpportunitySection {
  const oppPath = firstExisting(
    path.join(cwd, "data/seo/gsc-opportunities.json"),
    path.join(cwd, "src/data/seo/gsc-opportunities.json"),
  );
  const opp = oppPath ? readJsonIfExists<GscOppReport>(oppPath) : null;
  const bands = pagePositionBands(cwd);
  const synthetic = Boolean(opp?.provenance?.synthetic);

  if (
    synthetic ||
    (!opp?.top20?.length && bands.band11to20.length === 0 && bands.top10.length === 0)
  ) {
    return {
      status: "not_connected",
      validity: synthetic ? "FIXTURE" : "NOT_CONNECTED",
      sourceLabel: null,
      dataThroughDate: null,
      generatedAt: null,
      synthetic: synthetic,
      top20: [],
      indexedImprovement: [],
      improvePromotion: [],
      entering11to20: [],
      enteringTop10: [],
      rankingDeclines: [],
      notes: [
        synthetic
          ? "Fixture/synthetic GSC opportunity report ignored — run seo:gsc-opportunities on a real export."
          : "Run npm run seo:gsc-opportunities after importing a GSC Performance export.",
        "Ranking declines need a prior comparable period — not connected yet.",
      ],
    };
  }

  const mapRow = (r: {
    path: string;
    opportunityScore: number;
    impressions: number;
    avgPosition: number;
    primaryAction: string;
    targetQuery?: string | null;
    queryMappingConfidence?: string | null;
    relationshipSource?: string | null;
    actionConfidence?: string | null;
  }): OpportunityRow => ({
    path: r.path,
    score: r.opportunityScore,
    impressions: r.impressions,
    position: r.avgPosition,
    primaryAction: r.primaryAction,
    queryEvidence: r.targetQuery ?? null,
    queryConfidence: r.queryMappingConfidence ?? null,
    relationshipSource: r.relationshipSource ?? null,
    actionConfidence: r.actionConfidence ?? null,
  });

  const top20: OpportunityRow[] = opp?.top20?.map(mapRow) ?? [];
  const indexedImprovement = (opp?.indexedImprovementQueue ?? []).map(mapRow);
  const improvePromotion = (opp?.improvePromotionQueue ?? []).map(mapRow);

  const declines: OpportunityRow[] = [];
  if (opp?.allRanked) {
    for (const row of opp.allRanked.slice(0, 80)) {
      if (row.rootCauses?.includes("OUTDATED") || row.primaryAction === "REFRESH_CONTENT") {
        declines.push({
          path: row.path,
          score: row.opportunityScore,
          impressions: row.impressions,
          position: row.avgPosition,
          primaryAction: row.primaryAction,
          note: "Flagged refresh / outdated — not proven SERP decline without prior period",
        });
      }
    }
  }

  const through =
    opp?.provenance?.dataThroughDate ??
    opp?.dataThroughDate ??
    opp?.provenance?.dateRangeEnd ??
    null;

  return {
    status: opp?.top20?.length ? "connected" : "partial",
    validity: classifyDataValidity({
      connected: true,
      synthetic: false,
      sourcePath: oppPath,
      dataThroughDate: through,
      generatedAt: opp?.generatedAt,
    }),
    sourceLabel: opp?.sourceLabel ?? opp?.sourceFile ?? bands.label,
    dataThroughDate: through,
    generatedAt: opp?.generatedAt ?? opp?.provenance?.generatedAt ?? null,
    synthetic: false,
    top20: top20.slice(0, 20),
    indexedImprovement: indexedImprovement.slice(0, 15),
    improvePromotion: improvePromotion.slice(0, 15),
    entering11to20: bands.band11to20,
    enteringTop10: bands.top10,
    rankingDeclines: declines.slice(0, 15),
    notes: [
      opp?.top20?.length
        ? `Top 20 from GSC Opportunity Engine (real export${through ? ` through ${through}` : ""}).`
        : "GSC Opportunity Engine output missing — showing position bands from Performance export only.",
      `Queue A (indexed): ${indexedImprovement.length} · Queue B (IMPROVE/promote): ${improvePromotion.length}`,
      "“Entering” lists are current-position slices (≤10 / 11–20), not proven week-over-week entries without a prior snapshot.",
      declines.length === 0
        ? "Ranking declines: not connected without prior-period comparison (refresh flags shown only when opportunity report exists)."
        : "Decline list includes refresh/outdated opportunity flags — verify with period-over-period GSC before acting.",
    ],
  };
}
