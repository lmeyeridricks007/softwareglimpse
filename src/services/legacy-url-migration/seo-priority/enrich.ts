import { detectSeoOrphans } from "@/services/internal-linking/orphan-detector";
import type { UrlMappingRow } from "../mapping-agent/types";
import {
  defaultMigrationGscImportPath,
  inspectSeoDataAvailability,
  loadLivePagePerformance,
  toGscMetrics,
} from "./availability";
import type {
  DataAvailabilityReport,
  HistoricalSeoImportance,
  MetricConfidence,
  MigrationRiskLevel,
  SeoPriorityRow,
} from "./types";

function importanceRank(v: HistoricalSeoImportance): number {
  return { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 }[v];
}

function maxImportance(
  a: HistoricalSeoImportance,
  b: HistoricalSeoImportance,
): HistoricalSeoImportance {
  return importanceRank(a) <= importanceRank(b) ? a : b;
}

function maxRisk(a: MigrationRiskLevel, b: MigrationRiskLevel): MigrationRiskLevel {
  return importanceRank(a as HistoricalSeoImportance) <=
    importanceRank(b as HistoricalSeoImportance)
    ? a
    : b;
}

function isCommercialIntent(row: UrlMappingRow): boolean {
  return [
    "product_review",
    "product_pricing",
    "product_alternatives",
    "comparison",
    "best",
  ].includes(row.legacyIntent);
}

function isClusterRole(row: UrlMappingRow): boolean {
  return (
    row.matchBasis === "same_category_cluster" ||
    row.matchBasis === "same_guide_intent" ||
    row.legacyIntent === "hub" ||
    row.legacyIntent === "category" ||
    Boolean(row.newPath?.match(/^\/(best|categories|guides|compare|software)\//))
  );
}

function isBrandProduct(row: UrlMappingRow): boolean {
  return (
    row.legacyIntent === "product_review" ||
    row.legacyIntent === "product_pricing" ||
    row.legacyIntent === "product_alternatives" ||
    row.legacyIntent === "comparison" ||
    row.matchBasis === "same_product" ||
    row.matchBasis === "same_comparison_pair" ||
    row.matchBasis === "explicit_historical"
  );
}

/**
 * Score historical SEO importance from available signals only.
 * Traffic/backlink thresholds apply only when live metrics exist.
 */
export function scoreImportance(input: {
  row: UrlMappingRow;
  clicks: number | null;
  impressions: number | null;
  referringDomains: number | null;
  destinationInbound: number | null;
  hasLiveTraffic: boolean;
  hasLiveBacklinks: boolean;
}): {
  importance: HistoricalSeoImportance;
  reasons: string[];
  metricConfidence: MetricConfidence;
  dataSources: string[];
} {
  const {
    row,
    clicks,
    impressions,
    referringDomains,
    destinationInbound,
    hasLiveTraffic,
    hasLiveBacklinks,
  } = input;
  const reasons: string[] = [];
  const dataSources: string[] = [];
  let importance: HistoricalSeoImportance = "LOW";
  let metricConfidence: MetricConfidence = "NONE";

  const commercial = isCommercialIntent(row);
  const cluster = isClusterRole(row);
  const brand = isBrandProduct(row);

  if (hasLiveTraffic && clicks != null && impressions != null) {
    dataSources.push("search-console");
    metricConfidence = "HIGH";
    if (clicks >= 100 || impressions >= 5000) {
      importance = maxImportance(importance, "CRITICAL");
      reasons.push(
        `GSC traffic: ${clicks} clicks / ${impressions} impressions (CRITICAL threshold)`,
      );
    } else if (clicks >= 20 || impressions >= 1000) {
      importance = maxImportance(importance, "HIGH");
      reasons.push(
        `GSC traffic: ${clicks} clicks / ${impressions} impressions (HIGH threshold)`,
      );
    } else if (clicks >= 1 || impressions >= 100) {
      importance = maxImportance(importance, "MEDIUM");
      reasons.push(
        `GSC traffic: ${clicks} clicks / ${impressions} impressions (MEDIUM threshold)`,
      );
    } else {
      reasons.push("GSC present but negligible clicks/impressions for this URL");
    }
  }

  if (hasLiveBacklinks && referringDomains != null) {
    dataSources.push("backlinks");
    metricConfidence =
      metricConfidence === "NONE" ? "MEDIUM" : metricConfidence;
    if (referringDomains >= 20) {
      importance = maxImportance(importance, "CRITICAL");
      reasons.push(`${referringDomains} referring domains (CRITICAL)`);
    } else if (referringDomains >= 5) {
      importance = maxImportance(importance, "HIGH");
      reasons.push(`${referringDomains} referring domains (HIGH)`);
    } else if (referringDomains >= 1) {
      importance = maxImportance(importance, "MEDIUM");
      reasons.push(`${referringDomains} referring domains (MEDIUM)`);
    }
  }

  // Proxy / content-role signals (always available from mapping plan)
  dataSources.push("url-mapping-plan");
  if (metricConfidence === "NONE") metricConfidence = "LOW";

  if (commercial && brand) {
    const crmRelevant =
      Boolean(row.newPath) ||
      row.matchBasis === "same_product" ||
      row.matchBasis === "same_comparison_pair" ||
      row.matchBasis === "explicit_historical" ||
      /crm|pipedrive|hubspot|salesforce|zoho|freshsales|keap|dynamics|monday|copper|insightly|capsule|activecampaign|getresponse|sugar|apollo|lusha|folk|close|attio|nutshell|bitrix|creatio|oracle|streak|salesflare/.test(
        row.legacyPath,
      );
    if (crmRelevant) {
      importance = maxImportance(importance, "HIGH");
      reasons.push(
        "Commercial CRM product/comparison/best intent with brand/product relevance",
      );
    } else {
      importance = maxImportance(importance, "MEDIUM");
      reasons.push(
        "Commercial-shaped URL without catalogue CRM match — medium until GSC confirms traffic",
      );
    }
  } else if (commercial) {
    importance = maxImportance(importance, "MEDIUM");
    reasons.push("Commercial intent page type");
  }

  if (cluster && (brand || commercial)) {
    importance = maxImportance(importance, "HIGH");
    reasons.push("Important content-cluster / hub role");
  } else if (cluster) {
    importance = maxImportance(importance, "MEDIUM");
    reasons.push("Content-cluster role");
  }

  if (row.legacyIntent === "guide" && row.recommendedAction !== "410") {
    importance = maxImportance(importance, "MEDIUM");
    reasons.push("Guide-intent URL (informational cluster)");
  }

  if (
    destinationInbound != null &&
    destinationInbound >= 10 &&
    row.newPath
  ) {
    dataSources.push("new-site-internal-links");
    importance = maxImportance(importance, "HIGH");
    reasons.push(
      `Mapped destination has strong new-site inbound (${destinationInbound})`,
    );
  }

  if (
    ["tag", "author", "feed", "pagination", "query", "attachment"].includes(
      row.legacyIntent,
    ) ||
    row.recommendedAction === "410" ||
    row.matchBasis === "strategy_retire" ||
    row.matchBasis === "taxonomy_retire"
  ) {
    // Cap retirement candidates unless live traffic contradicts
    if (!hasLiveTraffic || (clicks ?? 0) < 5) {
      importance = "LOW";
      reasons.push("Taxonomy/strategy retirement candidate — low SEO priority");
    }
  }

  // Without live traffic/backlinks, do not claim CRITICAL solely from heuristics
  if (!hasLiveTraffic && !hasLiveBacklinks && importance === "CRITICAL") {
    importance = "HIGH";
    reasons.push(
      "Capped at HIGH: CRITICAL requires live traffic or backlink evidence (unavailable)",
    );
  }

  if (reasons.length === 0) {
    reasons.push("No strong importance signals from available sources");
  }

  return { importance, reasons, metricConfidence, dataSources };
}

export function scoreMigrationRisk(input: {
  importance: HistoricalSeoImportance;
  row: UrlMappingRow;
  hasLiveTraffic: boolean;
  clicks: number | null;
}): { risk: MigrationRiskLevel; reasons: string[] } {
  const { importance, row, hasLiveTraffic, clicks } = input;
  const reasons: string[] = [];
  let risk: MigrationRiskLevel = "LOW";

  const unmappedValuable =
    !row.newPath &&
    (importance === "CRITICAL" || importance === "HIGH") &&
    row.recommendedAction === "REVIEW";
  const retiringValuable =
    (row.recommendedAction === "410" || row.recommendedAction === "404") &&
    (importance === "CRITICAL" || importance === "HIGH");
  const lowConfRedirect =
    Boolean(row.newPath) &&
    row.confidence === "LOW" &&
    (importance === "CRITICAL" || importance === "HIGH");
  const reviewRequired =
    row.recommendedAction === "REVIEW" &&
    (importance === "CRITICAL" || importance === "HIGH" || importance === "MEDIUM");

  if (importance === "CRITICAL") {
    risk = maxRisk(risk, "CRITICAL");
    reasons.push("CRITICAL historical importance");
  } else if (importance === "HIGH") {
    risk = maxRisk(risk, "HIGH");
    reasons.push("HIGH historical importance");
  } else if (importance === "MEDIUM") {
    risk = maxRisk(risk, "MEDIUM");
  }

  if (unmappedValuable) {
    risk = maxRisk(risk, "CRITICAL");
    reasons.push("Valuable URL is unmapped / REVIEW — traffic-loss risk if cut over blindly");
  }
  if (retiringValuable) {
    risk = maxRisk(risk, "CRITICAL");
    reasons.push("Valuable URL proposed for 404/410 — confirm before retirement");
  }
  if (lowConfRedirect) {
    risk = maxRisk(risk, "HIGH");
    reasons.push("Low-confidence redirect on important URL");
  }
  if (reviewRequired) {
    risk = maxRisk(risk, importance === "LOW" ? "MEDIUM" : "HIGH");
    reasons.push("Manual review still required before redirect implementation");
  }
  if (
    hasLiveTraffic &&
    (clicks ?? 0) > 0 &&
    (row.recommendedAction === "410" || row.recommendedAction === "404")
  ) {
    risk = maxRisk(risk, "CRITICAL");
    reasons.push("Live GSC clicks on a retirement candidate");
  }

  if (reasons.length === 0) {
    reasons.push("Low migration risk given available signals");
  }
  return { risk, reasons };
}

export function enrichMappingRowsWithSeoPriority(
  rows: UrlMappingRow[],
  opts?: { importPath?: string },
): {
  availability: DataAvailabilityReport;
  enriched: SeoPriorityRow[];
} {
  const importPath = opts?.importPath ?? defaultMigrationGscImportPath();
  const availability = inspectSeoDataAvailability({ importPath });
  const perf = loadLivePagePerformance({ importPath });

  let inboundCounts = new Map<string, number>();
  try {
    const orphans = detectSeoOrphans();
    inboundCounts = orphans.inboundCounts;
  } catch {
    // Internal link graph optional for enrichment
  }

  const enriched: SeoPriorityRow[] = rows.map((row) => {
    const gscAgg = perf.get(row.legacyPath);
    // Also try matching if GSC used new-style paths already (rare pre-migration)
    const gsc =
      toGscMetrics(gscAgg) ??
      (row.newPath ? toGscMetrics(perf.get(row.newPath)) : null);

    const destinationInbound = row.newPath
      ? (inboundCounts.get(row.newPath) ?? null)
      : null;

    const scored = scoreImportance({
      row,
      clicks: gsc?.clicks ?? null,
      impressions: gsc?.impressions ?? null,
      referringDomains: null,
      destinationInbound,
      hasLiveTraffic: availability.searchConsole.available,
      hasLiveBacklinks: availability.backlinks.available,
    });

    const risk = scoreMigrationRisk({
      importance: scored.importance,
      row,
      hasLiveTraffic: availability.searchConsole.available,
      clicks: gsc?.clicks ?? null,
    });

    return {
      legacyPath: row.legacyPath,
      legacyUrl: row.legacyUrl,
      legacyTitle: row.legacyTitle,
      newPath: row.newPath,
      newTitle: row.newTitle,
      recommendedAction: row.recommendedAction,
      relationship: row.relationship,
      mappingConfidence: row.confidence,
      historicalSeoImportance: scored.importance,
      migrationRisk: risk.risk,
      dataSources: scored.dataSources,
      metricConfidence: scored.metricConfidence,
      importanceReasons: scored.reasons,
      riskReasons: risk.reasons,
      gsc,
      analytics: null,
      backlinks: null,
      proxy: {
        commercialValue: isCommercialIntent(row),
        contentClusterRole: isClusterRole(row),
        brandProductRelevance: isBrandProduct(row),
        mappedDestinationInbound: destinationInbound,
        mappingAction: row.recommendedAction,
        mappingRelationship: row.relationship,
        seoRiskFromMapper: row.seoRisk,
      },
    };
  });

  return { availability, enriched };
}
