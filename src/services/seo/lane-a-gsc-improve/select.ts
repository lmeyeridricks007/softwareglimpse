/**
 * Select top Lane A pages by hard GSC position bands (page-level only).
 * Never invents demand; never uses inferred query mappings for selection.
 */
import { loadGscOpportunityReport } from "@/services/seo/gsc-opportunity/load-report";
import { LANE_A_MIN_IMPRESSIONS } from "@/services/seo/enrichment-lanes/types";
import { identityPath } from "@/seo/canonical";
import type { GscOpportunityRow } from "@/services/seo/gsc-opportunity/types";

export type LaneAPageKind =
  | "guide"
  | "comparison"
  | "software"
  | "best"
  | "category";

export type PositionBand =
  | "8-20"
  | "21-30"
  | "31-50"
  | "50+-commercial"
  | "lane-a-fill"
  | "excluded";

export type LaneASelectedPage = {
  kind: LaneAPageKind;
  slug: string;
  path: string;
  lane: "A";
  band: Exclude<PositionBand, "excluded">;
  impressions: number;
  clicks: number;
  ctr: number;
  avgPosition: number;
  opportunityScore: number;
  primaryAction: string;
  rootCauses: string[];
  commercialIntent: string | null;
  focus: "snippet" | "substance" | "intent" | "mixed";
  reason: string;
  hasDirectQuery: boolean;
};

function kindFromPath(path: string): LaneAPageKind | null {
  if (path.startsWith("/software/")) return "software";
  if (path.startsWith("/compare/")) return "comparison";
  if (path.startsWith("/guides/")) return "guide";
  if (path.startsWith("/best/")) return "best";
  if (path.startsWith("/categories/")) return "category";
  return null;
}

function slugFromPath(path: string, kind: LaneAPageKind): string | null {
  const parts = path.split("/").filter(Boolean);
  if (kind === "software" && parts[0] === "software" && parts[1]) return parts[1];
  if (kind === "comparison" && parts[0] === "compare" && parts[1]) return parts[1];
  if (kind === "guide" && parts[0] === "guides" && parts[1]) return parts[1];
  if (kind === "best" && parts[0] === "best" && parts[1]) return parts[1];
  if (kind === "category" && parts[0] === "categories" && parts[1]) {
    return parts[1];
  }
  return null;
}

function isCommercialKind(kind: LaneAPageKind): boolean {
  return kind === "software" || kind === "comparison" || kind === "best";
}

export function classifyPositionBand(
  position: number,
  impressions: number,
  kind: LaneAPageKind,
): PositionBand {
  if (!Number.isFinite(position) || position <= 0) return "excluded";
  if (position >= 8 && position <= 20) return "8-20";
  if (position > 20 && position <= 30) return "21-30";
  if (position > 30 && position <= 50) {
    return impressions >= 50 ? "31-50" : "excluded";
  }
  if (position > 50) {
    return impressions >= 150 && isCommercialKind(kind)
      ? "50+-commercial"
      : "excluded";
  }
  // position < 8 — already strong; not in hard priority buckets
  return "excluded";
}

function bandRank(band: Exclude<PositionBand, "excluded">): number {
  switch (band) {
    case "8-20":
      return 1;
    case "21-30":
      return 2;
    case "31-50":
      return 3;
    case "50+-commercial":
      return 4;
    case "lane-a-fill":
      return 5;
  }
}

function classifyFocus(row: GscOpportunityRow): LaneASelectedPage["focus"] {
  const causes = new Set(row.rootCauses ?? []);
  const action = row.primaryAction;
  const pos = row.avgPosition ?? 99;
  const snippet =
    action === "OPTIMIZE_TITLE" ||
    action === "OPTIMIZE_TITLE_FOR_QUERY" ||
    causes.has("POOR_CTR") ||
    causes.has("TITLE_WEAK") ||
    (pos <= 20 && (row.ctr ?? 0) < 0.02 && row.impressions >= 30);
  const intent =
    action === "SEARCH_INTENT_MISMATCH" ||
    causes.has("POSSIBLE_INTENT_OVERLAP") ||
    causes.has("INTENT_MISMATCH");
  const substance =
    action === "IMPROVE_INTRO" ||
    action === "REFRESH_CONTENT" ||
    causes.has("THIN_CONTENT") ||
    pos > 30;

  if (snippet && !substance && !intent) return "snippet";
  if (intent && !snippet) return "intent";
  if (substance && !snippet) return "substance";
  if (snippet && substance) return "mixed";
  return substance ? "substance" : "mixed";
}

/**
 * Hard-bucket select: fill 8–20 → 21–30 → 31–50 (strong imp) → deep commercial.
 * Page-level GSC only. Inferred queries never drive selection.
 */
export function selectLaneAGscImprovePages(
  limit = 30,
): {
  selected: LaneASelectedPage[];
  bandCounts: Record<string, number>;
  skipped: Array<{ path: string; reason: string }>;
  gscProvenance: Record<string, unknown> | null;
} {
  const report = loadGscOpportunityReport();
  const skipped: Array<{ path: string; reason: string }> = [];
  if (!report) {
    return {
      selected: [],
      bandCounts: {},
      skipped: [{ path: "*", reason: "No real GSC opportunities report found" }],
      gscProvenance: null,
    };
  }

  const rows = report.allRanked ?? report.top100 ?? [];
  const candidates: LaneASelectedPage[] = [];

  for (const row of rows) {
    const path = identityPath(row.path);
    const kind = kindFromPath(path);
    if (!kind) {
      skipped.push({ path, reason: "non-enrichable page type" });
      continue;
    }
    const slug = slugFromPath(path, kind);
    if (!slug) {
      skipped.push({ path, reason: "missing slug (hub index)" });
      continue;
    }

    const impressions = row.impressions ?? 0;
    const clicks = row.clicks ?? 0;
    if (impressions < LANE_A_MIN_IMPRESSIONS && clicks <= 0) {
      skipped.push({ path, reason: "below Lane A GSC threshold" });
      continue;
    }

    const avgPosition = row.avgPosition;
    if (avgPosition == null || !Number.isFinite(avgPosition)) {
      skipped.push({ path, reason: "missing avgPosition" });
      continue;
    }

    const band = classifyPositionBand(avgPosition, impressions, kind);
    if (band === "excluded") {
      skipped.push({
        path,
        reason: `outside priority bands (pos=${avgPosition.toFixed(1)}, imp=${impressions})`,
      });
      continue;
    }

    const hasDirectQuery =
      row.queryProvenance === "DIRECT_GSC" ||
      row.queryProvenance === "HISTORICAL_DIRECT_GSC";

    candidates.push({
      kind,
      slug,
      path,
      lane: "A",
      band,
      impressions,
      clicks,
      ctr: row.ctr ?? 0,
      avgPosition,
      opportunityScore: row.opportunityScore ?? 0,
      primaryAction: String(row.primaryAction ?? "UNKNOWN"),
      rootCauses: row.rootCauses ?? [],
      commercialIntent: row.commercialIntent
        ? String(row.commercialIntent)
        : null,
      focus: classifyFocus(row),
      reason: `Lane A · band ${band} · page-level GSC ${impressions} imp · pos ${avgPosition.toFixed(1)} · ${row.primaryAction}`,
      hasDirectQuery,
    });
  }

  candidates.sort((a, b) => {
    const br = bandRank(a.band) - bandRank(b.band);
    if (br !== 0) return br;
    if (b.impressions !== a.impressions) return b.impressions - a.impressions;
    return b.opportunityScore - a.opportunityScore;
  });

  const selected = candidates.slice(0, limit);

  // Fill to limit with next Lane A commercial pages (still real page-level GSC).
  if (selected.length < limit) {
    const used = new Set(selected.map((s) => s.path));
    const fill: LaneASelectedPage[] = [];
    for (const row of rows) {
      const path = identityPath(row.path);
      if (used.has(path)) continue;
      const kind = kindFromPath(path);
      if (!kind || !isCommercialKind(kind)) continue;
      const slug = slugFromPath(path, kind);
      if (!slug) continue;
      const impressions = row.impressions ?? 0;
      const clicks = row.clicks ?? 0;
      if (impressions < LANE_A_MIN_IMPRESSIONS && clicks <= 0) continue;
      const avgPosition = row.avgPosition;
      if (avgPosition == null || !Number.isFinite(avgPosition)) continue;
      fill.push({
        kind,
        slug,
        path,
        lane: "A",
        band: "lane-a-fill",
        impressions,
        clicks,
        ctr: row.ctr ?? 0,
        avgPosition,
        opportunityScore: row.opportunityScore ?? 0,
        primaryAction: String(row.primaryAction ?? "UNKNOWN"),
        rootCauses: row.rootCauses ?? [],
        commercialIntent: row.commercialIntent
          ? String(row.commercialIntent)
          : null,
        focus: classifyFocus(row),
        reason: `Lane A fill · page-level GSC ${impressions} imp · pos ${avgPosition.toFixed(1)} · ${row.primaryAction}`,
        hasDirectQuery:
          row.queryProvenance === "DIRECT_GSC" ||
          row.queryProvenance === "HISTORICAL_DIRECT_GSC",
      });
    }
    fill.sort(
      (a, b) =>
        b.impressions - a.impressions ||
        b.opportunityScore - a.opportunityScore,
    );
    for (const f of fill) {
      if (selected.length >= limit) break;
      selected.push(f);
    }
  }

  const bandCounts: Record<string, number> = {
    "8-20": 0,
    "21-30": 0,
    "31-50": 0,
    "50+-commercial": 0,
    "lane-a-fill": 0,
  };
  for (const s of selected) bandCounts[s.band] = (bandCounts[s.band] ?? 0) + 1;

  return {
    selected,
    bandCounts,
    skipped: skipped.slice(0, 80),
    gscProvenance: (report.provenance ?? null) as Record<string, unknown> | null,
  };
}
