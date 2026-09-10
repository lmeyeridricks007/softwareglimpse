/**
 * Write GSC opportunity feeds consumed by enrichment / testing / pricing /
 * internal-link / refresh systems. Analysis artifacts only.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { GscOpportunityReport, GscOpportunityRow } from "./types";
import { extractEstateSlug, inferEstateType } from "./estate";

export type GscSystemFeeds = {
  guideEnrichment: string;
  compareEnrichment: string;
  testingPriority: string;
  pricingMonitor: string;
  internalLinks: string;
  refresh: string;
};

function feedMeta(report: GscOpportunityReport) {
  return {
    generatedAt: report.generatedAt,
    sourceFile: report.sourceFile,
    dataThroughDate: report.dataThroughDate,
    rangeLabel: report.rangeLabel,
    engineVersion: report.engineVersion,
    synthetic: false,
  };
}

function rowSignal(row: GscOpportunityRow) {
  const trustedQuery =
    row.actionConfidence === "EVIDENCED" ||
    row.actionConfidence === "REVIEW_REQUIRED"
      ? row.targetQuery ?? row.primaryQuery
      : null;
  return {
    path: row.path,
    estateType: row.estateType,
    queueBucket: row.queueBucket,
    lifecycleState: row.lifecycleState,
    opportunityScore: row.opportunityScore,
    impressions: row.impressions,
    position: row.avgPosition,
    ctr: row.ctr,
    primaryQuery: trustedQuery,
    targetQuery: trustedQuery,
    relationshipSource: row.relationshipSource,
    queryProvenance: row.queryProvenance,
    queryMappingConfidence: row.queryMappingConfidence,
    queryEvidence: row.queryEvidence,
    querySourceDateRange: row.querySourceDateRange,
    actionConfidence: row.actionConfidence,
    requiresHumanReview: row.requiresHumanReview,
    intent: row.commercialIntent,
    primaryAction: row.primaryAction,
    remediation: row.intentProfile?.suggestedRemediation ?? row.recommendedActions,
  };
}

export function writeGscSystemFeeds(
  report: GscOpportunityReport,
  cwd: string = process.cwd(),
): GscSystemFeeds {
  const dir = path.join(cwd, "data/seo/feeds");
  mkdirSync(dir, { recursive: true });

  const guides = (report.allRanked ?? [])
    .filter((r) => r.estateType === "guides")
    .slice(0, 200)
    .map((r) => ({
      ...rowSignal(r),
      slug: extractEstateSlug(r.path, "guides"),
      queries:
        r.actionConfidence === "EVIDENCED" ||
        r.actionConfidence === "REVIEW_REQUIRED"
          ? [r.targetQuery, ...r.secondaryQueries].filter(Boolean)
          : [],
      inferredQueryCandidates: (r.inferredQueryCandidates ?? []).slice(0, 5),
    }));

  const compares = (report.allRanked ?? [])
    .filter((r) => r.estateType === "comparisons")
    .slice(0, 200)
    .map((r) => ({
      ...rowSignal(r),
      slug: extractEstateSlug(r.path, "comparisons"),
      queries:
        r.actionConfidence === "EVIDENCED" ||
        r.actionConfidence === "REVIEW_REQUIRED"
          ? [r.targetQuery, ...r.secondaryQueries].filter(Boolean)
          : [],
      inferredQueryCandidates: (r.inferredQueryCandidates ?? []).slice(0, 5),
    }));

  const testing = (report.allRanked ?? [])
    .filter((r) => r.estateType === "software")
    .slice(0, 200)
    .map((r) => ({
      ...rowSignal(r),
      slug: extractEstateSlug(r.path, "software"),
    }));

  const pricing = (report.allRanked ?? [])
    .filter(
      (r) =>
        r.estateType === "software" ||
        r.estateType === "pricing" ||
        r.rootCauses.includes("PRICING_MISSING") ||
        r.recommendedActions.includes("ADD_PRICING"),
    )
    .slice(0, 200)
    .map((r) => ({
      ...rowSignal(r),
      slug:
        extractEstateSlug(r.path, "software") ||
        extractEstateSlug(r.path, "pricing"),
      pricingGap: r.rootCauses.includes("PRICING_MISSING"),
    }));

  const internalLinks = (report.allRanked ?? [])
    .filter(
      (r) =>
        r.rootCauses.includes("WEAK_INTERNAL_LINKS") ||
        r.rootCauses.includes("LOW_INBOUND_LINKS") ||
        r.recommendedActions.includes("ADD_INTERNAL_LINKS"),
    )
    .slice(0, 150)
    .map((r) => ({
      ...rowSignal(r),
      suggestedTargets: r.internalLinkRecommendations.slice(0, 8),
    }));

  const refresh = (report.allRanked ?? [])
    .filter(
      (r) =>
        r.rootCauses.includes("OUTDATED") ||
        r.recommendedActions.includes("REFRESH_CONTENT") ||
        r.primaryAction === "REFRESH_CONTENT",
    )
    .slice(0, 150)
    .map((r) => ({
      ...rowSignal(r),
      estate: inferEstateType(r.path),
    }));

  const paths: GscSystemFeeds = {
    guideEnrichment: path.join(dir, "gsc-guide-enrichment.json"),
    compareEnrichment: path.join(dir, "gsc-compare-enrichment.json"),
    testingPriority: path.join(dir, "gsc-testing-priority.json"),
    pricingMonitor: path.join(dir, "gsc-pricing-monitor.json"),
    internalLinks: path.join(dir, "gsc-internal-links.json"),
    refresh: path.join(dir, "gsc-refresh.json"),
  };

  const meta = feedMeta(report);

  writeFileSync(
    paths.guideEnrichment,
    JSON.stringify({ meta, items: guides }, null, 2) + "\n",
  );
  writeFileSync(
    paths.compareEnrichment,
    JSON.stringify({ meta, items: compares }, null, 2) + "\n",
  );
  writeFileSync(
    paths.testingPriority,
    JSON.stringify({ meta, items: testing }, null, 2) + "\n",
  );
  writeFileSync(
    paths.pricingMonitor,
    JSON.stringify({ meta, items: pricing }, null, 2) + "\n",
  );
  writeFileSync(
    paths.internalLinks,
    JSON.stringify({ meta, items: internalLinks }, null, 2) + "\n",
  );
  writeFileSync(
    paths.refresh,
    JSON.stringify({ meta, items: refresh }, null, 2) + "\n",
  );

  return {
    guideEnrichment: "data/seo/feeds/gsc-guide-enrichment.json",
    compareEnrichment: "data/seo/feeds/gsc-compare-enrichment.json",
    testingPriority: "data/seo/feeds/gsc-testing-priority.json",
    pricingMonitor: "data/seo/feeds/gsc-pricing-monitor.json",
    internalLinks: "data/seo/feeds/gsc-internal-links.json",
    refresh: "data/seo/feeds/gsc-refresh.json",
  };
}
