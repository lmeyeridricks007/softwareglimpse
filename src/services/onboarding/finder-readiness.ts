import type { FinderReadinessStatus, Software } from "@/domain";
import { getCategoryOnboardingOverride } from "@/data/config/onboarding/policy";
import { loadEnrichment } from "@/data/research/store";

/**
 * Finder readiness — category-aware; reuses CRM eligibility heuristics.
 * Does not invent finders for unsupported categories.
 */
export function assessFinderReadiness(product: Software): {
  crmFinder: FinderReadinessStatus;
  generalFinder: FinderReadinessStatus;
  notes: string[];
} {
  const override = getCategoryOnboardingOverride(product.primaryCategorySlug);
  const notes: string[] = [...override.notes];
  const enrichment = loadEnrichment(product.slug);

  let crmFinder: FinderReadinessStatus = "NOT_APPLICABLE";
  if (override.finder === "crm" || override.finder === "sales-intelligence") {
    const expectedCategory =
      override.finder === "crm" ? "crm" : "sales-intelligence";
    const eligible =
      product.primaryCategorySlug === expectedCategory &&
      (product.useCaseSlugs.length > 0 ||
        (enrichment?.featureSupport.length ?? 0) > 0);
    crmFinder = eligible ? "ELIGIBLE" : "NOT_ELIGIBLE";
    if (!eligible) {
      notes.push(
        override.finder === "crm"
          ? "CRM Finder needs use cases or feature support enrichment"
          : "SI Finder needs use cases or feature support enrichment",
      );
    }
  } else if (override.finder === "future") {
    notes.push("Dedicated finder not built for this category yet");
  } else {
    notes.push("No finder configured for this category");
  }

  return {
    crmFinder,
    generalFinder: "FUTURE",
    notes,
  };
}
