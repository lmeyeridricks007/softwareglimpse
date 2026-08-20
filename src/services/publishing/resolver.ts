import {
  getPublicationState,
  type ContentRegistryEntry,
  type PublicationState,
} from "@/domain";

export function getPublicationStateForEntry(
  entry: ContentRegistryEntry,
  now: Date = new Date(),
): PublicationState {
  return getPublicationState(
    {
      status: entry.metadata.status,
      publishedAt: entry.metadata.publishedAt,
      scheduledAt: entry.metadata.scheduledAt,
      seoIndexable: entry.seoIndexable,
    },
    now,
  );
}

/** Entries safe for public listings / internal link targets. */
export function filterVisibleEntries(
  entries: ContentRegistryEntry[],
  now: Date = new Date(),
): ContentRegistryEntry[] {
  return entries.filter(
    (entry) => getPublicationStateForEntry(entry, now).isVisibleInListings,
  );
}

/** Entries eligible for sitemap (visible + seoIndexable). */
export function filterSitemapEntries(
  entries: ContentRegistryEntry[],
  now: Date = new Date(),
): ContentRegistryEntry[] {
  return entries.filter((entry) => {
    const state = getPublicationStateForEntry(entry, now);
    return state.isVisibleInListings && state.isIndexable;
  });
}
