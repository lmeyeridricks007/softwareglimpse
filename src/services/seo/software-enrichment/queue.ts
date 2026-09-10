import { getSoftware } from "@/data";
import { assessSoftwareCompleteness } from "@/services/completeness/software-completeness";
import { loadGscOpportunitySignalsByPath } from "@/services/seo/gsc-opportunity/load-report";
import {
  classifyEnrichmentLane,
  compareByLaneThenScore,
  laneReportFields,
} from "@/services/seo/enrichment-lanes";
import { auditSoftwareFields } from "./field-audit";
import { dependentCounts } from "./dependents";
import type { SoftwareQueueItem } from "./types";

const CATEGORY_IMPORTANCE: Record<string, number> = {
  crm: 100,
  "sales-intelligence": 90,
  "email-marketing": 80,
  marketing: 75,
  hr: 70,
  "project-management": 65,
  ecommerce: 60,
  "business-communications": 55,
  ai: 50,
  "it-development": 45,
};

export type BuildSoftwareQueueOptions = {
  limit?: number;
};

/**
 * Priority queue: GSC → dependents → commercial → compare frequency → gaps.
 */
export function buildSoftwareEnrichmentQueue(
  options: BuildSoftwareQueueOptions = {},
): SoftwareQueueItem[] {
  const gscByPath = loadGscOpportunitySignalsByPath();
  const items: SoftwareQueueItem[] = [];

  for (const software of getSoftware()) {
    const path = `/software/${software.slug}/`;
    const gsc =
      gscByPath.get(path) || gscByPath.get(`/software/${software.slug}`) || null;
    const gscImpressions = gsc?.impressions ?? 0;
    const gscClicks = gsc?.clicks ?? 0;
    const gscPosition = gsc?.position ?? null;
    const gscOpportunity = gsc?.opportunityScore ?? 0;

    const deps = dependentCounts(software.slug);
    const completeness = assessSoftwareCompleteness(software);
    const fieldAudit = auditSoftwareFields(software);

    const categoryImportance =
      CATEGORY_IMPORTANCE[software.primaryCategorySlug ?? ""] ?? 20;
    const commercialRelevance = software.affiliate?.enabled ? 80 : 35;
    const qualityGap = Math.max(
      0,
      100 - fieldAudit.score,
      100 - completeness.completenessPercent,
    );

    const laneResult = classifyEnrichmentLane({
      gsc: {
        impressions: gscImpressions,
        clicks: gscClicks,
        position: gscPosition,
        opportunityScore: gscOpportunity,
        hasDirectQuery: Boolean(gsc?.hasDirectQuery),
      },
      strategic: {
        categoryImportance,
        productPopularity: Math.min(100, deps.total * 3),
        commercialRelevance,
        internalJourneyStrength: Math.min(100, deps.guides * 8 + deps.best * 5),
        competitorRelationship: (software.competitorSlugs?.length ?? 0) > 0,
        importantBuyerQuestion: deps.comparisons >= 3,
      },
      qualityGap,
    });

    const fields = laneReportFields(laneResult);
    const nudge =
      deps.comparisons * 0.4 +
      fieldAudit.missingCount * 1.5 +
      (software.affiliate?.enabled ? 3 : 0);
    const priorityScore = Number((fields.overallScore + nudge).toFixed(2));

    items.push({
      slug: software.slug,
      name: software.name,
      categorySlug: software.primaryCategorySlug ?? null,
      lane: fields.lane,
      priorityScore,
      orderingReason: `${laneResult.orderingReason}; ${[
        gscImpressions > 0 ? `gsc:${gscImpressions}` : null,
        deps.comparisons ? `comps:${deps.comparisons}` : null,
        deps.guides ? `guides:${deps.guides}` : null,
        fieldAudit.missingCount ? `missing:${fieldAudit.missingCount}` : null,
      ]
        .filter(Boolean)
        .join(",") || "baseline"}`,
      gscImpressions,
      gscClicks,
      dependentCount: deps.total,
      comparisonCount: deps.comparisons,
      commercialScore: fields.commercialScore,
      dataGapScore: fieldAudit.missingCount * 12 + fieldAudit.unknownCount * 6,
      evidenceGapScore:
        completeness.sections.editorial === "missing"
          ? 25
          : completeness.sections.editorial === "partial"
            ? 12
            : 0,
      completenessPercent: completeness.completenessPercent,
    });
  }

  items.sort((a, b) =>
    compareByLaneThenScore(
      {
        lane: a.lane,
        priorityScore: a.priorityScore,
        gscEvidenceScore: a.gscImpressions,
      },
      {
        lane: b.lane,
        priorityScore: b.priorityScore,
        gscEvidenceScore: b.gscImpressions,
      },
    ),
  );
  return options.limit != null ? items.slice(0, options.limit) : items;
}
