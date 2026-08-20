import {
  canonicalizeComparisonSlug,
  evaluateAlternativesQuality,
  evaluateBestQuality,
  evaluateCategoryQuality,
  evaluateComparisonQuality,
  isSymmetricRelationship,
  type SoftwareRelationship,
} from "@/domain";
import {
  getAllAlternativesUnfiltered,
  getAllBestPagesUnfiltered,
  getAllCategoriesUnfiltered,
  getAllComparisonsUnfiltered,
  getAllSoftwareUnfiltered,
  getRelationships,
  getUseCases,
} from "@/data/repositories/catalog";

export type ValidationIssue = {
  code: string;
  message: string;
  severity: "error" | "warning";
};

export type ValidationReport = {
  ok: boolean;
  issues: ValidationIssue[];
};

export function validateContentRepository(): ValidationReport {
  const issues: ValidationIssue[] = [];
  const software = getAllSoftwareUnfiltered();
  const categories = getAllCategoriesUnfiltered();
  const softwareSlugs = new Set(software.map((s) => s.slug));
  const categorySlugs = new Set(categories.map((c) => c.slug));
  const useCaseSlugs = new Set(getUseCases().map((u) => u.slug));

  // Unique software / category slugs already enforced at load — re-check pairs
  assertUnique(
    software.map((s) => s.slug),
    "software",
    issues,
  );
  assertUnique(
    categories.map((c) => c.slug),
    "category",
    issues,
  );

  for (const product of software) {
    if (!categorySlugs.has(product.primaryCategorySlug)) {
      issues.push({
        code: "unknown-primary-category",
        severity: "error",
        message: `${product.slug} primaryCategorySlug unknown: ${product.primaryCategorySlug}`,
      });
    }
    for (const slug of [
      ...product.secondaryCategorySlugs,
      ...product.subcategorySlugs,
    ]) {
      if (!categorySlugs.has(slug)) {
        issues.push({
          code: "unknown-category-ref",
          severity: "error",
          message: `${product.slug} references unknown category ${slug}`,
        });
      }
    }
    for (const slug of product.useCaseSlugs) {
      if (!useCaseSlugs.has(slug)) {
        issues.push({
          code: "unknown-use-case-ref",
          severity: "error",
          message: `${product.slug} references unknown use case ${slug}`,
        });
      }
    }
    for (const slug of [
      ...product.competitorSlugs,
      ...product.alternativeSlugs,
      ...product.comparableSlugs,
    ]) {
      if (!softwareSlugs.has(slug)) {
        issues.push({
          code: "unknown-product-ref",
          severity: "error",
          message: `${product.slug} references unknown product ${slug}`,
        });
      }
      if (slug === product.slug) {
        issues.push({
          code: "self-relationship",
          severity: "error",
          message: `${product.slug} references itself in related slug arrays`,
        });
      }
    }
  }

  validateRelationships(getRelationships(), softwareSlugs, issues);
  validateComparisons(softwareSlugs, issues);
  validateAlternatives(softwareSlugs, issues);
  validateBest(softwareSlugs, categorySlugs, issues);
  validatePublishedQuality(issues);

  return {
    ok: issues.filter((i) => i.severity === "error").length === 0,
    issues,
  };
}

function validateRelationships(
  relationships: SoftwareRelationship[],
  softwareSlugs: Set<string>,
  issues: ValidationIssue[],
): void {
  const seen = new Set<string>();
  for (const edge of relationships) {
    if (!softwareSlugs.has(edge.source)) {
      issues.push({
        code: "unknown-relationship-source",
        severity: "error",
        message: `Relationship ${edge.id} unknown source ${edge.source}`,
      });
    }
    if (!softwareSlugs.has(edge.target)) {
      issues.push({
        code: "unknown-relationship-target",
        severity: "error",
        message: `Relationship ${edge.id} unknown target ${edge.target}`,
      });
    }
    if (
      edge.source === edge.target &&
      isSymmetricRelationship(edge.type)
    ) {
      issues.push({
        code: "invalid-self-relationship",
        severity: "error",
        message: `Relationship ${edge.id} is an invalid self ${edge.type}`,
      });
    }
    const key = `${edge.type}:${edge.source}:${edge.target}`;
    if (seen.has(key)) {
      issues.push({
        code: "duplicate-relationship",
        severity: "error",
        message: `Duplicate relationship ${key}`,
      });
    }
    seen.add(key);
  }
}

function validateComparisons(
  softwareSlugs: Set<string>,
  issues: ValidationIssue[],
): void {
  const seenPairs = new Set<string>();
  for (const comparison of getAllComparisonsUnfiltered()) {
    for (const slug of comparison.productSlugs) {
      if (!softwareSlugs.has(slug)) {
        issues.push({
          code: "invalid-comparison-participant",
          severity: "error",
          message: `Comparison ${comparison.slug} unknown product ${slug}`,
        });
      }
    }
    const canonical = canonicalizeComparisonSlug(comparison.productSlugs);
    if (comparison.slug !== canonical) {
      issues.push({
        code: "noncanonical-comparison-slug",
        severity: "error",
        message: `Comparison slug ${comparison.slug} should be ${canonical}`,
      });
    }
    if (seenPairs.has(canonical)) {
      issues.push({
        code: "duplicate-comparison",
        severity: "error",
        message: `Duplicate canonical comparison ${canonical}`,
      });
    }
    seenPairs.add(canonical);

    if (
      comparison.seo.indexable &&
      !evaluateComparisonQuality(comparison).ok
    ) {
      issues.push({
        code: "indexable-fails-quality",
        severity: "error",
        message: `Comparison ${comparison.slug} marked indexable but fails quality gate`,
      });
    }
  }
}

function validateAlternatives(
  softwareSlugs: Set<string>,
  issues: ValidationIssue[],
): void {
  for (const page of getAllAlternativesUnfiltered()) {
    if (!softwareSlugs.has(page.sourceSlug)) {
      issues.push({
        code: "invalid-alternatives-source",
        severity: "error",
        message: `Alternatives ${page.slug} unknown source ${page.sourceSlug}`,
      });
    }
    for (const entry of page.alternatives) {
      if (!softwareSlugs.has(entry.targetSlug)) {
        issues.push({
          code: "invalid-alternative-target",
          severity: "error",
          message: `Alternatives ${page.slug} unknown target ${entry.targetSlug}`,
        });
      }
      if (entry.targetSlug === page.sourceSlug) {
        issues.push({
          code: "self-alternative",
          severity: "error",
          message: `Alternatives ${page.slug} includes self`,
        });
      }
    }
    if (
      page.seo.indexable &&
      !evaluateAlternativesQuality(page).ok
    ) {
      issues.push({
        code: "indexable-fails-quality",
        severity: "error",
        message: `Alternatives ${page.slug} marked indexable but fails quality gate`,
      });
    }
  }
}

function validateBest(
  softwareSlugs: Set<string>,
  categorySlugs: Set<string>,
  issues: ValidationIssue[],
): void {
  for (const page of getAllBestPagesUnfiltered()) {
    if (page.categorySlug && !categorySlugs.has(page.categorySlug)) {
      issues.push({
        code: "unknown-best-category",
        severity: "error",
        message: `Best page ${page.slug} unknown category ${page.categorySlug}`,
      });
    }
    for (const slug of page.eligibleProductSlugs) {
      if (!softwareSlugs.has(slug)) {
        issues.push({
          code: "unknown-best-eligible",
          severity: "error",
          message: `Best page ${page.slug} unknown eligible product ${slug}`,
        });
      }
    }
    if (
      page.seo.indexable &&
      !evaluateBestQuality(page).ok
    ) {
      issues.push({
        code: "indexable-fails-quality",
        severity: "error",
        message: `Best page ${page.slug} marked indexable but fails quality gate`,
      });
    }
  }
}

function validatePublishedQuality(issues: ValidationIssue[]): void {
  for (const category of getAllCategoriesUnfiltered()) {
    if (
      category.seo.indexable &&
      !evaluateCategoryQuality(category).ok
    ) {
      issues.push({
        code: "indexable-fails-quality",
        severity: "warning",
        message: `Category ${category.slug} indexable flag set but quality/publish gate fails`,
      });
    }
  }
}

function assertUnique(
  slugs: string[],
  label: string,
  issues: ValidationIssue[],
): void {
  const seen = new Set<string>();
  for (const slug of slugs) {
    if (seen.has(slug)) {
      issues.push({
        code: "duplicate-slug",
        severity: "error",
        message: `Duplicate ${label} slug ${slug}`,
      });
    }
    seen.add(slug);
  }
}
