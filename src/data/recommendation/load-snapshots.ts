import {
  getAllComparisonsUnfiltered,
  getSoftwareByCategory,
} from "@/data/repositories/catalog";
import { loadEnrichment } from "@/data/research/store";
import { isPubliclyAvailable } from "@/domain/publishing";
import {
  buildProductSnapshots,
  type ProductRecommendationSnapshot,
} from "@/services/recommendation";

/**
 * Serialize primary-category product snapshots for a finder.
 * Scoring runs client-side via pure `recommendForCategory` — no API route.
 * Does not fabricate enrichment; missing research stays empty on the snapshot.
 */
export function getFinderSnapshotsForCategory(
  categorySlug: string,
): ProductRecommendationSnapshot[] {
  const software = getSoftwareByCategory(categorySlug)
    .filter((item) => item.primaryCategorySlug === categorySlug)
    .slice()
    .sort((a, b) => a.slug.localeCompare(b.slug));
  return buildProductSnapshots(
    software.map((item) => ({
      software: item,
      enrichment: loadEnrichment(item.slug),
    })),
  );
}

/** Published comparison slugs the client can deep-link to (no query pages). */
export function getPublishedComparisonSlugsForCategory(
  categorySlug: string,
): string[] {
  return getAllComparisonsUnfiltered()
    .filter(
      (comparison) =>
        comparison.categorySlug === categorySlug &&
        isPubliclyAvailable(comparison.metadata),
    )
    .map((comparison) => comparison.slug);
}

export function getCrmFinderSnapshots(): ProductRecommendationSnapshot[] {
  return getFinderSnapshotsForCategory("crm");
}

export function getPublishedCrmComparisonSlugs(): string[] {
  return getPublishedComparisonSlugsForCategory("crm");
}

export function getSiFinderSnapshots(): ProductRecommendationSnapshot[] {
  return getFinderSnapshotsForCategory("sales-intelligence");
}

export function getPublishedSiComparisonSlugs(): string[] {
  return getPublishedComparisonSlugsForCategory("sales-intelligence");
}
