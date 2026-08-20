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
 * Requirement / Use Case / Capability / Feature research share the same catalog.
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
 * Run media health governance against requirement-scoped ResearchMedia.
 */
export function evaluateRequirementMediaHealth(
  media: ProductMedia[],
  options?: { requirementSlug?: string; now?: Date },
): MediaGovernanceResult[] {
  const scoped = options?.requirementSlug
    ? media.filter((m) =>
        m.requirementIds.includes(options.requirementSlug!),
      )
    : media;
  const now = options?.now ?? new Date();
  return scoped.map((m) => evaluateMediaGovernance({ media: m, now }));
}
