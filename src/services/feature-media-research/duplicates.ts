import type { ProductMedia, ResearchMediaProvider } from "@/domain";
import {
  enrichMediaFromSourceUrl,
  parseVideoSourceUrl,
} from "@/services/product-media";

function normalizeUrl(url: string): string {
  try {
    const u = new URL(url);
    u.hash = "";
    // Drop common tracking params; keep identity params.
    for (const key of [...u.searchParams.keys()]) {
      if (/^(utm_|fbclid|gclid|ref|mc_)/i.test(key)) {
        u.searchParams.delete(key);
      }
    }
    return u.toString().replace(/\/$/, "").toLowerCase();
  } catch {
    return url.trim().toLowerCase();
  }
}

export function mediaProviderKey(media: ProductMedia): {
  provider: ResearchMediaProvider;
  providerId: string | null;
  sourceUrlKey: string;
} {
  const enriched = enrichMediaFromSourceUrl(media);
  const providerId =
    enriched.providerId ?? enriched.videoId ?? null;
  return {
    provider: enriched.provider,
    providerId,
    sourceUrlKey: normalizeUrl(enriched.sourceUrl),
  };
}

/**
 * Match on provider + providerId (preferred) or normalized sourceUrl.
 * Avoids duplicate canonical ResearchMedia records.
 */
export function findDuplicateResearchMedia(
  candidate: Pick<
    ProductMedia,
    "provider" | "sourceUrl" | "videoId" | "providerId" | "id"
  >,
  existing: ProductMedia[],
): ProductMedia | null {
  const parsed = parseVideoSourceUrl(candidate.sourceUrl);
  const provider = candidate.provider ?? parsed?.provider;
  const providerId =
    candidate.providerId ??
    candidate.videoId ??
    parsed?.videoId ??
    null;
  const sourceKey = normalizeUrl(
    parsed?.sourceUrl ?? candidate.sourceUrl,
  );

  for (const item of existing) {
    if (candidate.id && item.id === candidate.id) continue;
    const key = mediaProviderKey(item);
    if (providerId && key.providerId && provider === key.provider) {
      if (providerId === key.providerId) return item;
    }
    if (key.sourceUrlKey === sourceKey) return item;
  }
  return null;
}

/** Collect media across products for cross-enrichment duplicate checks. */
export function findDuplicateAcrossCatalog(
  candidate: Pick<
    ProductMedia,
    "provider" | "sourceUrl" | "videoId" | "providerId" | "id"
  >,
  catalog: ProductMedia[],
): ProductMedia | null {
  return findDuplicateResearchMedia(candidate, catalog);
}
