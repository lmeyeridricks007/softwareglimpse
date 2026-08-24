import {
  getPublicationState,
  type ContentRegistryEntry,
  type PublicationState,
} from "@/domain";
import {
  getPublicationContextSync,
  getSitemapPublicationContext,
  isContentVisible,
  type PublicationContext,
} from "@/domain/publication-context";

export function getPublicationStateForEntry(
  entry: ContentRegistryEntry,
  now: Date = new Date(),
  context: PublicationContext = getPublicationContextSync(),
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
  context: PublicationContext = getPublicationContextSync(),
): ContentRegistryEntry[] {
  return entries.filter((entry) =>
    isContentVisible(
      {
        status: entry.metadata.status,
        publishedAt: entry.metadata.publishedAt,
        scheduledAt: entry.metadata.scheduledAt,
      },
      context,
      now,
    ),
  );
}

/** Entries eligible for sitemap (visible + seoIndexable). */
export function filterSitemapEntries(
  entries: ContentRegistryEntry[],
  now: Date = new Date(),
  context: PublicationContext = getSitemapPublicationContext(now),
): ContentRegistryEntry[] {
  return entries.filter((entry) => {
    const state = getPublicationStateForEntry(entry, now, context);
    return (
      isContentVisible(
        {
          status: entry.metadata.status,
          publishedAt: entry.metadata.publishedAt,
          scheduledAt: entry.metadata.scheduledAt,
        },
        context,
        now,
      ) &&
      state.isIndexable &&
      entry.seoIndexable
    );
  });
}
