import type {
  ContentQualityAssessment,
  ContentQualityPageType,
} from "@/domain/schemas/content-quality";

export type PageImportance =
  | "pillar"
  | "high-commercial"
  | "supporting"
  | "long-tail";

export type JourneyImportance = "high" | "medium" | "low";

export type ContentQualityPriority = "CQ-P0" | "CQ-P1" | "CQ-P2" | "CQ-P3";

export type GapSeverity = "critical" | "major" | "moderate" | "minor";

const PILLAR_ROUTES = new Set([
  "/categories/crm/",
  "/best/crm-software/",
  "/guides/what-is-crm/",
  "/guides/how-to-choose-crm/",
  "/guides/crm-requirements-guide/",
  "/guides/crm-evaluation-guide/",
  "/guides/do-i-need-a-crm/",
  "/guides/how-crm-works/",
  "/guides/crm-vs-spreadsheet/",
  "/guides/crm-pricing-guide/",
  "/tools/crm-finder/",
  "/software/hubspot/",
  "/software/salesforce/",
  "/software/pipedrive/",
]);

const HIGH_COMMERCIAL_TYPES: ContentQualityPageType[] = [
  "product-review",
  "comparison",
  "best",
  "industry",
];

export function classifyPageImportance(
  route: string,
  pageType: ContentQualityPageType,
): PageImportance {
  if (PILLAR_ROUTES.has(route) || pageType === "best") return "pillar";
  if (HIGH_COMMERCIAL_TYPES.includes(pageType)) return "high-commercial";
  if (
    pageType === "guide" ||
    pageType === "use-case" ||
    pageType === "capability" ||
    pageType === "requirement" ||
    pageType === "feature" ||
    pageType === "resource" ||
    pageType === "tool-landing"
  ) {
    return "supporting";
  }
  if (pageType === "product-guide" || pageType === "implementation-guide") {
    return "supporting";
  }
  return "long-tail";
}

export function classifyJourneyImportance(
  pageType: ContentQualityPageType,
  stage?: string,
): JourneyImportance {
  if (
    pageType === "best" ||
    pageType === "product-review" ||
    pageType === "comparison" ||
    pageType === "guide"
  ) {
    return "high";
  }
  if (
    stage === "choose" ||
    stage === "evaluate" ||
    stage === "define-requirements" ||
    stage === "research" ||
    stage === "compare" ||
    stage === "find"
  ) {
    return "high";
  }
  if (
    pageType === "industry" ||
    pageType === "use-case" ||
    pageType === "requirement" ||
    pageType === "feature"
  ) {
    return "medium";
  }
  return "low";
}

export function classifyGapSeverity(
  assessment: ContentQualityAssessment,
): GapSeverity {
  const evidence = assessment.dimensions.find(
    (d) => d.id === "evidence-source-quality",
  );
  const trust = assessment.dimensions.find((d) => d.id === "trust-transparency");
  const diff = assessment.dimensions.find(
    (d) => d.id === "content-differentiation",
  );
  const cannibalized = Boolean(
    diff &&
      diff.score <= 2 &&
      diff.evidence.some(
        (e) =>
          e.present === false &&
          /generic category copy|Only H1 changed|Near duplicate|Duplicate intent/i.test(
            e.label,
          ),
      ),
  );

  const dangerous =
    assessment.notes.some((n) =>
      /unsupported|misleading|fabricat|fake testing|vendor-summary risk/i.test(
        n,
      ),
    ) ||
    (assessment.pageType === "product-review" &&
      ((evidence?.score ?? 5) <= 1 ||
        ((trust?.score ?? 5) <= 1 && (evidence?.score ?? 5) <= 2))) ||
    (assessment.pageType === "best" &&
      assessment.dimensions.find((d) => d.id === "page-type-specific")?.score ===
        0) ||
    (assessment.pageType === "comparison" &&
      (evidence?.score ?? 5) <= 1 &&
      assessment.notes.some((n) => /side-by-side/i.test(n))) ||
    cannibalized;

  // Critical = dangerous OR severely incomplete
  if (dangerous) return "critical";
  if (assessment.overallScore < 35) return "critical";
  if (assessment.overallScore < 50 || assessment.criticalGaps.length >= 3) {
    return "major";
  }
  if (assessment.overallScore < 70 || assessment.majorImprovements.length > 0) {
    return "moderate";
  }
  return "minor";
}

/**
 * ImprovementPriority ≈ ContentGapSeverity × PageImportance × JourneyImportance
 * Coarse bands only — no fake precision.
 */
export function assignImprovementPriority(input: {
  assessment: ContentQualityAssessment;
  pageImportance: PageImportance;
  journeyImportance: JourneyImportance;
}): ContentQualityPriority {
  const severity = classifyGapSeverity(input.assessment);
  const { pageImportance, journeyImportance } = input;

  // P0: factually dangerous / broken / unsupported / misleading — regardless of importance
  if (severity === "critical") {
    // Still require some importance for pure thin long-tail stubs unless evidence is toxic
    const evidence = input.assessment.dimensions.find(
      (d) => d.id === "evidence-source-quality",
    );
    if (
      (evidence?.score ?? 5) <= 1 ||
      pageImportance === "pillar" ||
      pageImportance === "high-commercial" ||
      journeyImportance === "high"
    ) {
      return "CQ-P0";
    }
    return "CQ-P1";
  }

  if (severity === "major") {
    if (pageImportance === "pillar" || pageImportance === "high-commercial") {
      return "CQ-P1";
    }
    if (journeyImportance === "high") return "CQ-P1";
    return "CQ-P2";
  }

  if (severity === "moderate") {
    if (pageImportance === "pillar") return "CQ-P1";
    if (pageImportance === "high-commercial") return "CQ-P2";
    return "CQ-P2";
  }

  // minor
  if (pageImportance === "pillar" && input.assessment.overallScore < 85) {
    return "CQ-P2";
  }
  return "CQ-P3";
}
