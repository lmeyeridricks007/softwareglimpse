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
 * Use Case / Capability / Feature research share the same canonical catalog.
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
 * Run existing media health governance against use-case-scoped ResearchMedia.
 * Covers availability, embedding, source status, verification freshness.
 */
export function evaluateUseCaseMediaHealth(
  media: ProductMedia[],
  options?: { useCaseSlug?: string; now?: Date },
): MediaGovernanceResult[] {
  const scoped = options?.useCaseSlug
    ? media.filter((m) => m.useCaseIds.includes(options.useCaseSlug!))
    : media;
  const now = options?.now ?? new Date();
  return scoped.map((m) => evaluateMediaGovernance({ media: m, now }));
}
