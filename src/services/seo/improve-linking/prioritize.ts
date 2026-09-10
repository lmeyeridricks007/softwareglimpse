import { getSoftwareBySlug, getComparisonBySlug } from "@/data";
import { getGuides } from "@/data/repositories/guides";
import {
  classifyEnrichmentLane,
  compareByLaneThenScore,
  laneReportFields,
  loadExternalEnrichmentEvidence,
  type EnrichmentLane,
  type StrategicOverrideReason,
} from "@/services/seo/enrichment-lanes";
import { loadGscOpportunitySignalsByPath } from "@/services/seo/gsc-opportunity/load-report";
import { identityPath } from "@/seo/canonical";
import type { BatchPageRef } from "./types";

const CATEGORY_IMPORTANCE: Record<string, number> = {
  crm: 100,
  "sales-intelligence": 90,
  "email-marketing": 85,
  marketing: 75,
  hr: 70,
  "project-management": 65,
  ecommerce: 60,
  "business-communications": 55,
  ai: 50,
  "it-development": 40,
};

export type LanePrioritizedPage = BatchPageRef & {
  lane: EnrichmentLane;
  overallScore: number;
  gscDemandScore: number;
  strategicScore: number;
  qualityGapScore: number;
  commercialScore: number;
  authorityScore: number;
  strategicOverride: boolean;
  strategicOverrideReasons: StrategicOverrideReason[];
  reason: string;
};

/**
 * Order improve-batch pages for internal-link work: Lane A first so
 * proven-demand URLs get inbound links before zero-impression long-tail.
 */
export function prioritizePagesForLinking(
  pages: BatchPageRef[],
): LanePrioritizedPage[] {
  const gscByPath = loadGscOpportunitySignalsByPath();
  const external = loadExternalEnrichmentEvidence();

  const ranked: LanePrioritizedPage[] = pages.map((page) => {
    const pathKey = identityPath(page.path);
    const gsc = gscByPath.get(pathKey) ?? gscByPath.get(page.path);

    let categoryImportance = 25;
    let productPopularity = 8;
    let commercialRelevance = 8;
    let competitorRelationship = false;
    let importantBuyerQuestion = false;

    if (page.pageType === "guide" || pathKey.includes("/guides/")) {
      const guide = getGuides({ includeUnpublished: true }).find(
        (g) => g.slug === page.slug,
      );
      categoryImportance =
        CATEGORY_IMPORTANCE[guide?.categorySlugs?.[0] || ""] ?? 30;
      const product = guide?.productSlugs?.[0]
        ? getSoftwareBySlug(guide.productSlugs[0])
        : null;
      productPopularity = product?.affiliate?.enabled ? 20 : product ? 10 : 5;
      commercialRelevance = product?.affiliate?.enabled ? 22 : 10;
      importantBuyerQuestion = true;
    } else if (page.pageType === "comparison" || pathKey.includes("/compare/")) {
      const comparison = getComparisonBySlug(page.slug, {
        includeUnpublished: true,
      });
      categoryImportance =
        CATEGORY_IMPORTANCE[comparison?.categorySlug || ""] ?? 40;
      competitorRelationship = true;
      importantBuyerQuestion = true;
      commercialRelevance = 24;
      productPopularity = 18;
    } else if (page.pageType === "software" || pathKey.includes("/software/")) {
      const software = getSoftwareBySlug(page.slug);
      categoryImportance =
        CATEGORY_IMPORTANCE[software?.primaryCategorySlug || ""] ?? 25;
      productPopularity = software?.affiliate?.enabled ? 22 : 10;
      commercialRelevance = software?.affiliate?.enabled ? 28 : 10;
    }

    const qualityGap = Math.min(
      40,
      (page.stillBlocked ? 18 : 0) +
        (page.materiallyImproved ? 8 : 14) +
        Math.max(0, 30 - (page.afterQuality ?? page.beforeQuality ?? 0)),
    );

    const laneResult = classifyEnrichmentLane({
      gsc: {
        impressions: gsc?.impressions ?? 0,
        clicks: gsc?.clicks ?? 0,
        position: gsc?.position ?? null,
        opportunityScore: gsc?.opportunityScore ?? 0,
        hasDirectQuery: gsc?.hasDirectQuery,
        knownBacklinks: external.backlinksByPath.get(pathKey) ?? 0,
        realAiCitations: external.aiCitationsByPath.get(pathKey) ?? 0,
      },
      strategic: {
        categoryImportance,
        productPopularity,
        commercialRelevance,
        internalJourneyStrength: page.materiallyImproved ? 16 : 8,
        competitorRelationship,
        importantBuyerQuestion,
      },
      qualityGap,
    });

    const fields = laneReportFields(laneResult);
    return {
      ...page,
      lane: fields.lane,
      overallScore: fields.overallScore,
      gscDemandScore: fields.gscDemandScore,
      strategicScore: fields.strategicScore,
      qualityGapScore: fields.qualityGapScore,
      commercialScore: fields.commercialScore,
      authorityScore: fields.authorityScore,
      strategicOverride: fields.strategicOverride,
      strategicOverrideReasons: fields.strategicOverrideReasons,
      reason: fields.reason,
    };
  });

  return ranked.sort((a, b) =>
    compareByLaneThenScore(
      {
        lane: a.lane,
        priorityScore: a.overallScore,
        gscEvidenceScore: a.gscDemandScore,
      },
      {
        lane: b.lane,
        priorityScore: b.overallScore,
        gscEvidenceScore: b.gscDemandScore,
      },
    ),
  );
}
