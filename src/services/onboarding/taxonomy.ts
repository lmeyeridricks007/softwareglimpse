import {
  getAllCategoriesUnfiltered,
  getCategoryBySlug,
} from "@/data";
import type {
  CategoryGap,
  TaxonomyAssignment,
  TaxonomyConfidence,
} from "@/domain";
import { getCategoryOnboardingOverride } from "@/data/config/onboarding/policy";
import {
  findAffiliateCatalogueEntry,
} from "@/data/seed/affiliate-catalogue";

export type TaxonomyStageResult = {
  assignments: TaxonomyAssignment[];
  categoryGaps: CategoryGap[];
  primaryCategorySlug?: string;
  categoryContentReady: boolean;
  lowConfidenceRequiresReview: boolean;
};

/**
 * Prefer existing canonical taxonomy — never invent categories.
 */
export function classifyTaxonomy(input: {
  productSlug: string;
  productName: string;
  suggestedCategorySlugs: string[];
  source?: string;
}): TaxonomyStageResult {
  const assignments: TaxonomyAssignment[] = [];
  const categoryGaps: CategoryGap[] = [];
  const all = getAllCategoriesUnfiltered();

  const suggested = [...input.suggestedCategorySlugs];
  if (suggested.length === 0 && input.source === "affiliate-catalogue") {
    const entry =
      findAffiliateCatalogueEntry(input.productSlug) ??
      findAffiliateCatalogueEntry(input.productName);
    if (entry?.categoryHint) suggested.push(entry.categoryHint);
  }

  // Name heuristics — deterministic, low confidence only as secondary
  const name = input.productName.toLowerCase();
  if (suggested.length === 0) {
    if (/\bcrm\b|salesforce|pipedrive|hubspot/.test(name)) {
      suggested.push("crm");
    } else if (/email|newsletter|getresponse|mailchimp|campaign/.test(name)) {
      suggested.push("email-marketing");
    } else if (/whatsapp|wati|slack|teams|chat/.test(name)) {
      suggested.push("business-communications");
    }
  }

  const primaryHint = suggested[0];
  if (!primaryHint) {
    categoryGaps.push({
      productSlug: input.productSlug,
      candidateLabel: input.productName,
      reason: "No category suggested and no heuristic matched",
      similarCategorySlugs: all
        .filter((c) => !c.parentSlug)
        .slice(0, 5)
        .map((c) => c.slug),
    });
    return {
      assignments,
      categoryGaps,
      categoryContentReady: false,
      lowConfidenceRequiresReview: true,
    };
  }

  const primary = getCategoryBySlug(primaryHint, { includeUnpublished: true });
  if (!primary) {
    const similar = all
      .filter((c) =>
        c.name.toLowerCase().includes(primaryHint.slice(0, 4)) ||
        primaryHint.includes(c.slug.slice(0, 4)),
      )
      .map((c) => c.slug)
      .slice(0, 5);
    categoryGaps.push({
      productSlug: input.productSlug,
      candidateLabel: primaryHint,
      reason: `Category slug "${primaryHint}" does not exist in taxonomy`,
      similarCategorySlugs: similar.length
        ? similar
        : all.filter((c) => !c.parentSlug).slice(0, 5).map((c) => c.slug),
    });
    return {
      assignments,
      categoryGaps,
      categoryContentReady: false,
      lowConfidenceRequiresReview: true,
    };
  }

  const confidence: TaxonomyConfidence =
    input.suggestedCategorySlugs.includes(primary.slug) ? "high" : "medium";

  assignments.push({
    slug: primary.slug,
    role: "primary",
    confidence,
    reason: input.suggestedCategorySlugs.includes(primary.slug)
      ? "Explicitly suggested"
      : "Heuristic / affiliate catalogue hint",
  });

  for (const slug of suggested.slice(1)) {
    const cat = getCategoryBySlug(slug, { includeUnpublished: true });
    if (!cat) {
      categoryGaps.push({
        productSlug: input.productSlug,
        candidateLabel: slug,
        reason: `Secondary category "${slug}" missing`,
        similarCategorySlugs: [],
      });
      continue;
    }
    assignments.push({
      slug: cat.slug,
      role: cat.parentSlug ? "subcategory" : "secondary",
      confidence: "medium",
      reason: "Suggested secondary classification",
    });
  }

  const override = getCategoryOnboardingOverride(primary.slug);
  const lowConfidenceRequiresReview = assignments.some(
    (a) => a.confidence === "low",
  );

  return {
    assignments,
    categoryGaps,
    primaryCategorySlug: primary.slug,
    categoryContentReady: override.categoryContentReady,
    lowConfidenceRequiresReview,
  };
}
