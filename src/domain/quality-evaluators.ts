/**
 * Pure page-type quality evaluators — no catalogue / lifecycle imports.
 * Kept separate from `quality-gates.ts` so seed materializers (comparison
 * research) can call generation policy without a circular init cycle:
 * materialize → generation-policy → quality-gates → promote → index-gates → data → seed.
 */

import type {
  AlternativesPage,
  BestPage,
  Category,
  Comparison,
  GuidePage,
  Software,
} from "@/domain/schemas";

export type QualityResult = {
  ok: boolean;
  failures: string[];
};

export function evaluateGuideQuality(guide: GuidePage): QualityResult {
  const failures: string[] = [];
  if (!guide.title) failures.push("missing-title");
  const hasBlocks = (guide.blocks?.length ?? 0) >= 3;
  const hasSections = guide.sections.length >= 2;
  if (!hasBlocks && !hasSections) failures.push("thin-sections");
  if (!guide.supports.length) failures.push("missing-anchor-supports");
  return { ok: failures.length === 0, failures };
}

export function evaluateSoftwareQuality(software: Software): QualityResult {
  const failures: string[] = [];
  if (!software.name) failures.push("missing-name");
  if (!software.primaryCategorySlug) failures.push("missing-primary-category");
  // Catalogue stubs may be indexable with identity-only content.
  return { ok: failures.length === 0, failures };
}

export function evaluateCategoryQuality(category: Category): QualityResult {
  const failures: string[] = [];
  if (!category.name) failures.push("missing-name");
  if (category.pageIntent === "supported") {
    failures.push("page-intent-supported-only");
  }
  if (
    category.pageIntent === "indexable" &&
    category.metadata.researchStatus === "none" &&
    !category.shortDescription
  ) {
    // Allow hub pages with shortDescription even if research incomplete.
  }
  return { ok: failures.length === 0, failures };
}

/**
 * Comparison indexability requires researched differentiation — not empty shells.
 */
export function evaluateComparisonQuality(
  comparison: Comparison,
): QualityResult {
  const failures: string[] = [];
  if (comparison.productSlugs.length !== 2) {
    failures.push("requires-two-products");
  }
  if (comparison.metadata.researchStatus !== "complete") {
    failures.push("research-incomplete");
  }
  if (!comparison.verdict) failures.push("missing-verdict");
  if (
    comparison.editorialStatus &&
    comparison.editorialStatus !== "approved"
  ) {
    failures.push("editorial-not-approved");
  }
  const completeOutcomes = comparison.outcomes.filter(
    (o) => o.researchStatus === "complete" && o.reason,
  );
  if (completeOutcomes.length < 3) {
    failures.push("insufficient-researched-criteria");
  }
  // Fabricated single-winner without kind is discouraged when depends/tie fits.
  if (
    comparison.overallWinnerSlug &&
    comparison.overallWinnerKind === "depends"
  ) {
    failures.push("winner-slug-conflicts-with-depends");
  }
  return { ok: failures.length === 0, failures };
}

export function evaluateAlternativesQuality(
  page: AlternativesPage,
): QualityResult {
  const failures: string[] = [];
  if (!page.sourceSlug) failures.push("missing-source");
  if (page.alternatives.length < 2) {
    failures.push("insufficient-alternatives");
  }
  const reasoned = page.alternatives.filter(
    (a) => a.reason && a.keyTradeoff,
  );
  if (reasoned.length < 2) failures.push("insufficient-reasons");
  if (page.metadata.researchStatus !== "complete") {
    failures.push("research-incomplete");
  }
  if (page.editorialStatus && page.editorialStatus !== "approved") {
    failures.push("editorial-not-approved");
  }
  return { ok: failures.length === 0, failures };
}

export function evaluateBestQuality(page: BestPage): QualityResult {
  const failures: string[] = [];
  if (!page.methodology) failures.push("missing-methodology");
  if (page.eligibleProductSlugs.length < 3) {
    failures.push("insufficient-eligible-pool");
  }

  const rankedApproved = page.recommendations.filter(
    (r) => r.approved && r.rationale,
  );
  const clusterApproved = page.useCaseRecommendations.filter(
    (r) => r.approved && r.rationale,
  );
  const clusterAwardPage =
    page.recommendations.length === 0 && clusterApproved.length >= 2;

  if (!clusterAwardPage) {
    if (page.recommendations.length < 2) {
      failures.push("insufficient-recommendations");
    }
    const withRationale = page.recommendations.filter((r) => r.rationale);
    if (withRationale.length < 2) failures.push("insufficient-rationales");
    if (rankedApproved.length < 2) {
      failures.push("insufficient-approved-recommendations");
    }
  }

  // "Best overall" / top badges require explicit approval — never popularity/affiliate.
  for (const rec of page.recommendations) {
    if (
      rec.recommendationLabel?.toLowerCase().includes("best overall") &&
      !rec.approved
    ) {
      failures.push("unapproved-best-overall-label");
    }
  }
  if (page.metadata.researchStatus !== "complete") {
    failures.push("research-incomplete");
  }
  if (page.editorialStatus && page.editorialStatus !== "approved") {
    failures.push("editorial-not-approved");
  }
  return { ok: failures.length === 0, failures };
}
