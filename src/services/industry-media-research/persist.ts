import type { ProductMedia } from "@/domain";
import { loadEnrichment } from "@/data/research/store";
import {
  listEnrichmentMedia,
  upsertResearchMediaInEnrichment,
} from "@/services/feature-media-research/persist";
import {
  evaluateMediaGovernance,
  type MediaGovernanceResult,
} from "@/services/product-media/governance";

/**
 * Collect ResearchMedia across product enrichments for duplicate checks.
 * Industry / Product / Use Case / Capability / Feature / Requirement share catalog.
 */
export function listCatalogResearchMedia(
  productSlugs: string[],
): ProductMedia[] {
  const byId = new Map<string, ProductMedia>();
  for (const slug of productSlugs) {
    for (const media of listEnrichmentMedia(slug)) {
      if (!byId.has(media.id)) byId.set(media.id, media);
    }
  }
  return [...byId.values()];
}

export {
  listEnrichmentMedia,
  upsertResearchMediaInEnrichment,
};

export function productHasEnrichment(productSlug: string): boolean {
  return Boolean(loadEnrichment(productSlug));
}

/**
 * Run media health governance against industry-scoped ResearchMedia.
 */
export function evaluateIndustryMediaHealth(
  media: ProductMedia[],
  options?: {
    industrySlug?: string;
    now?: Date;
    industryRelationshipNeedsReview?: boolean;
    uiStale?: boolean;
    sourceChanged?: boolean;
  },
): MediaGovernanceResult[] {
  const scoped = options?.industrySlug
    ? media.filter((m) => m.industryIds.includes(options.industrySlug!))
    : media;
  const now = options?.now ?? new Date();
  return scoped.map((m) =>
    evaluateMediaGovernance({
      media: m,
      now,
      industryRelationshipNeedsReview:
        options?.industryRelationshipNeedsReview,
      uiStale: options?.uiStale,
      sourceChanged: options?.sourceChanged,
    }),
  );
}
