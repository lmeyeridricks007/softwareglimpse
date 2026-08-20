import type {
  AlternativesPage,
  BestPage,
  Comparison,
  ProductReview,
  ResearchSource,
} from "@/domain";
import {
  evaluateAlternativesQuality,
  evaluateBestQuality,
  evaluateComparisonQuality,
  type QualityResult,
} from "@/domain/quality-gates";
import { loadManualSources } from "@/data/research/store";
import { loadAssessment, loadReview } from "@/data/editorial/store";

export type EditorialQualityResult = QualityResult & {
  pageType: "software-review" | "comparison" | "alternatives" | "best";
  publishable: boolean;
};

function hasFixtureResearchSources(productSlugs: string[]): boolean {
  for (const slug of productSlugs) {
    const sources = loadManualSources(slug);
    if (sources.some(isFixtureSource)) return true;
  }
  return false;
}

function isFixtureSource(source: ResearchSource): boolean {
  return (
    source.sourceType === "fixture" ||
    source.authority === "fixture" ||
    Boolean(source.id?.includes("fixture"))
  );
}

function withFixtureGate(
  base: QualityResult,
  productSlugs: string[],
  pageType: EditorialQualityResult["pageType"],
): EditorialQualityResult {
  const failures = [...base.failures];
  if (hasFixtureResearchSources(productSlugs)) {
    failures.push("research-fixture-not-live");
  }
  const ok = failures.length === 0;
  return {
    pageType,
    ok,
    failures,
    publishable: ok,
  };
}

/**
 * Software review publishability — approved editorial review + live research.
 */
export function evaluateSoftwareReviewQuality(
  review: ProductReview,
): EditorialQualityResult {
  const failures: string[] = [];

  if (review.editorialStatus !== "approved") {
    failures.push("editorial-not-approved");
  }
  if (!review.verdict?.trim()) failures.push("missing-verdict");
  if (!review.summary?.trim() && !review.intro?.trim()) {
    failures.push("missing-summary");
  }
  if (review.sections.length < 3) failures.push("insufficient-sections");
  if (review.criterionAssessments.length === 0) {
    failures.push("missing-criterion-assessments");
  }
  for (const a of review.criterionAssessments) {
    if (!a.rationale?.trim()) {
      failures.push(`score-missing-rationale:${a.criterionSlug}`);
    }
  }
  if (review.confidence === "low" && review.editorialStatus === "approved") {
    // Low confidence approved reviews are allowed but flagged.
    failures.push("low-confidence-review");
  }

  const assessment = loadAssessment(review.productSlug);
  if (!assessment) failures.push("missing-assessment");
  else if (assessment.status !== "approved") {
    failures.push("assessment-not-approved");
  }

  const base: QualityResult = { ok: failures.length === 0, failures };
  return withFixtureGate(base, [review.productSlug], "software-review");
}

export function evaluateEditorialComparisonQuality(
  comparison: Comparison,
): EditorialQualityResult {
  const base = evaluateComparisonQuality(comparison);
  const failures = [...base.failures];
  if (
    comparison.editorialStatus &&
    comparison.editorialStatus !== "approved"
  ) {
    failures.push("editorial-not-approved");
  }
  return withFixtureGate(
    { ok: failures.length === 0, failures },
    comparison.productSlugs,
    "comparison",
  );
}

export function evaluateEditorialAlternativesQuality(
  page: AlternativesPage,
): EditorialQualityResult {
  const base = evaluateAlternativesQuality(page);
  const failures = [...base.failures];
  if (page.editorialStatus && page.editorialStatus !== "approved") {
    failures.push("editorial-not-approved");
  }
  if (!page.editorialRecommendation?.trim()) {
    // Soft requirement when researched — still fail publishable editorial path
    if (page.metadata.researchStatus === "complete") {
      failures.push("missing-editorial-recommendation");
    }
  }
  const productSlugs = [
    page.sourceSlug,
    ...page.alternatives.map((a) => a.targetSlug),
  ];
  return withFixtureGate(
    { ok: failures.length === 0, failures },
    productSlugs,
    "alternatives",
  );
}

export function evaluateEditorialBestQuality(
  page: BestPage,
): EditorialQualityResult {
  const base = evaluateBestQuality(page);
  const failures = [...base.failures];
  if (page.editorialStatus && page.editorialStatus !== "approved") {
    failures.push("editorial-not-approved");
  }
  for (const rec of page.recommendations) {
    if (!rec.approved) failures.push(`recommendation-not-approved:${rec.productSlug}`);
    if (rec.badge && !rec.approved) {
      failures.push(`badge-without-approval:${rec.productSlug}`);
    }
  }
  return withFixtureGate(
    { ok: failures.length === 0, failures },
    page.eligibleProductSlugs,
    "best",
  );
}

export function evaluatePageQuality(input:
  | { pageType: "software-review"; review?: ProductReview; productSlug: string }
  | { pageType: "comparison"; entity: Comparison }
  | { pageType: "alternatives"; entity: AlternativesPage }
  | { pageType: "best"; entity: BestPage },
): EditorialQualityResult {
  switch (input.pageType) {
    case "software-review": {
      const review = input.review ?? loadReview(input.productSlug);
      if (!review) {
        return {
          pageType: "software-review",
          ok: false,
          publishable: false,
          failures: ["missing-review"],
        };
      }
      return evaluateSoftwareReviewQuality(review);
    }
    case "comparison":
      return evaluateEditorialComparisonQuality(input.entity);
    case "alternatives":
      return evaluateEditorialAlternativesQuality(input.entity);
    case "best":
      return evaluateEditorialBestQuality(input.entity);
  }
}
