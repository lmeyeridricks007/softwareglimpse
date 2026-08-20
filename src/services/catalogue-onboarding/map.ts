import {
  getAllCategoriesUnfiltered,
  getCategoryBySlug,
  getSoftwareBySlug,
} from "@/data";
import { getCategoryOnboardingOverride } from "@/data/config/onboarding/policy";
import {
  loadAliasMap,
  saveAliasMap,
  saveCategoryGaps,
  type CategoryGap,
} from "@/data/catalogue/store";
import type {
  CatalogueAliasMapEntry,
  CategoryReadinessStatus,
  NormalizedCatalogueCandidate,
} from "@/domain";
import type { CatalogueClassification } from "./classify";

export type CatalogueMapping = {
  sourceId: string;
  canonicalProductSlug?: string;
  mappedProductSlugs: string[];
  categorySlug?: string;
  categoryReadiness: CategoryReadinessStatus;
  vendorFamily?: string;
  aliasConfirmed: boolean;
  gaps: string[];
};

export function resolveCategoryReadiness(
  categorySlug: string | undefined,
): CategoryReadinessStatus {
  if (!categorySlug) return "CATEGORY_UNKNOWN";
  const cat = getCategoryBySlug(categorySlug, { includeUnpublished: true });
  if (!cat) {
    // Unknown taxonomy slug (e.g. business-operations) → gap
    const all = getAllCategoriesUnfiltered();
    if (!all.some((c) => c.slug === categorySlug)) {
      return "CATEGORY_NOT_READY";
    }
    return "CATEGORY_UNKNOWN";
  }
  const override = getCategoryOnboardingOverride(categorySlug);
  if (override.categoryContentReady) return "CATEGORY_READY";
  if (override.requiredResearchDomains.length > 0) return "CATEGORY_PARTIAL";
  return "CATEGORY_NOT_READY";
}

export function mapCatalogueCandidate(
  candidate: NormalizedCatalogueCandidate,
  classification: CatalogueClassification,
): CatalogueMapping {
  const gaps: string[] = [];
  const categorySlug = candidate.categoryHint;
  const categoryReadiness = resolveCategoryReadiness(categorySlug);

  if (
    categoryReadiness === "CATEGORY_NOT_READY" ||
    categoryReadiness === "CATEGORY_UNKNOWN"
  ) {
    if (categorySlug) {
      gaps.push(`Category gap: ${categorySlug}`);
    } else {
      gaps.push("No category hint");
    }
  }

  let canonicalProductSlug = classification.matchedProductSlug;
  const mappedProductSlugs: string[] = [];

  if (classification.bucket === "MULTI_PRODUCT_PROGRAM") {
    for (const name of candidate.splitCandidates) {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      const existing = getSoftwareBySlug(slug, { includeUnpublished: true });
      if (existing) mappedProductSlugs.push(existing.slug);
    }
    return {
      sourceId: candidate.sourceId,
      mappedProductSlugs,
      categorySlug,
      categoryReadiness,
      vendorFamily: candidate.vendorFamily,
      aliasConfirmed: false,
      gaps: [
        ...gaps,
        "MULTI_PRODUCT_PROGRAM — do not create single fake software entity",
      ],
    };
  }

  if (
    classification.bucket === "SOFTWARE" ||
    classification.bucket === "SOFTWARE_LIKE_PLATFORM"
  ) {
    if (!canonicalProductSlug) {
      const bySlug = getSoftwareBySlug(candidate.suggestedSlug, {
        includeUnpublished: true,
      });
      if (bySlug) canonicalProductSlug = bySlug.slug;
    }
    if (canonicalProductSlug) mappedProductSlugs.push(canonicalProductSlug);
  }

  // Confirm alias map when identity is EXISTING
  let aliasConfirmed = false;
  if (
    canonicalProductSlug &&
    (classification.identityOutcome === "EXISTING" ||
      classification.identityOutcome === "RENAMED_PRODUCT")
  ) {
    aliasConfirmed = true;
    upsertAlias(candidate.rawName, canonicalProductSlug, candidate.sourceId);
    if (candidate.normalizedName !== candidate.rawName) {
      upsertAlias(
        candidate.normalizedName,
        canonicalProductSlug,
        candidate.sourceId,
      );
    }
  }

  return {
    sourceId: candidate.sourceId,
    canonicalProductSlug,
    mappedProductSlugs,
    categorySlug,
    categoryReadiness,
    vendorFamily: candidate.vendorFamily,
    aliasConfirmed,
    gaps,
  };
}

function upsertAlias(
  affiliateLabel: string,
  canonicalProductSlug: string,
  sourceId: string,
): void {
  const map = loadAliasMap();
  const existing = map.find(
    (e) => e.affiliateLabel.toLowerCase() === affiliateLabel.toLowerCase(),
  );
  const entry: CatalogueAliasMapEntry = {
    affiliateLabel,
    canonicalProductSlug,
    sourceId,
    confirmedAt: new Date().toISOString(),
  };
  if (existing) {
    Object.assign(existing, entry);
  } else {
    map.push(entry);
  }
  saveAliasMap(map);
}

/**
 * Build CategoryGap queue — does not auto-create categories.
 */
export function rebuildCategoryGaps(
  mappings: CatalogueMapping[],
): CategoryGap[] {
  const byCat = new Map<string, CatalogueMapping[]>();
  for (const m of mappings) {
    if (
      m.categorySlug &&
      (m.categoryReadiness === "CATEGORY_NOT_READY" ||
        m.categoryReadiness === "CATEGORY_UNKNOWN")
    ) {
      const list = byCat.get(m.categorySlug) ?? [];
      list.push(m);
      byCat.set(m.categorySlug, list);
    }
    // Also gaps for known categories that are not content-ready
    if (
      m.categorySlug &&
      m.categoryReadiness === "CATEGORY_PARTIAL" &&
      !getCategoryOnboardingOverride(m.categorySlug).categoryContentReady
    ) {
      // partial is ok for planning — only NOT_READY/UNKNOWN become gaps for missing cats
    }
  }

  const now = new Date().toISOString();
  const gaps: CategoryGap[] = [];
  for (const [categorySlug, items] of byCat) {
    const exists = Boolean(
      getCategoryBySlug(categorySlug, { includeUnpublished: true }),
    );
    gaps.push({
      categorySlug,
      catalogueProductCount: items.length,
      sourceIds: items.map((i) => i.sourceId),
      status: exists ? "CATEGORY_NOT_READY" : "CATEGORY_UNKNOWN",
      notes: exists
        ? ["Category exists but methodology/content not ready"]
        : ["Category slug not in taxonomy — do not auto-create"],
      updatedAt: now,
    });
  }
  saveCategoryGaps(gaps);
  return gaps;
}
