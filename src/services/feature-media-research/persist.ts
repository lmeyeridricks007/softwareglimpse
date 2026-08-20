import type { ProductMedia, ProductResearchEnrichment } from "@/domain";
import { loadEnrichment, saveEnrichment } from "@/data/research/store";

/**
 * Upsert a ResearchMedia record into product enrichment.
 * Never changes status to active/published implicitly — caller must activate.
 */
export function upsertResearchMediaInEnrichment(
  productSlug: string,
  media: ProductMedia,
  options?: { persist?: boolean },
): { enrichment: ProductResearchEnrichment; created: boolean } | null {
  const existing = loadEnrichment(productSlug);
  if (!existing) return null;

  const idx = existing.media.findIndex((m) => m.id === media.id);
  const nextMedia =
    idx >= 0
      ? existing.media.map((m, i) => (i === idx ? media : m))
      : [...existing.media, media];

  const enrichment: ProductResearchEnrichment = {
    ...existing,
    media: nextMedia,
    updatedAt: new Date().toISOString(),
  };

  if (options?.persist) {
    saveEnrichment(productSlug, enrichment);
  }

  return { enrichment, created: idx < 0 };
}

export function listEnrichmentMedia(productSlug: string): ProductMedia[] {
  return loadEnrichment(productSlug)?.media ?? [];
}
