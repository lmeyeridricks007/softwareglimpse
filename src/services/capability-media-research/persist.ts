import type { ProductMedia } from "@/domain";
import { loadEnrichment } from "@/data/research/store";
import {
  listEnrichmentMedia,
  upsertResearchMediaInEnrichment,
} from "@/services/feature-media-research/persist";

/**
 * Collect ResearchMedia across product enrichments for duplicate checks.
 * Capability and Feature research share the same canonical catalog.
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

/** Re-export persist helpers — Capability research never creates a second copy. */
export {
  listEnrichmentMedia,
  upsertResearchMediaInEnrichment,
};

export function productHasEnrichment(productSlug: string): boolean {
  return Boolean(loadEnrichment(productSlug));
}
