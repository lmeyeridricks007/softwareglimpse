import type { ContentRegistryEntry, PublishStatus } from "@/domain";
import { getPublicationState } from "@/domain";

const PREVIEW_ELIGIBLE: readonly PublishStatus[] = [
  "draft",
  "review",
  "approved",
  "scheduled",
  "rejected",
];

/**
 * Helpers for draftMode / preview eligibility.
 * Preview surfaces must send noindex; never treat as public.
 */
export function isPreviewEligible(status: PublishStatus): boolean {
  return (PREVIEW_ELIGIBLE as readonly string[]).includes(status);
}

export function previewNoindexFlags(entry: {
  status: PublishStatus;
  seoIndexable?: boolean;
}): { robots: "noindex,nofollow"; indexable: false } {
  void entry;
  return { robots: "noindex,nofollow", indexable: false };
}

export function getPreviewState(
  entry: ContentRegistryEntry,
  now: Date = new Date(),
) {
  const state = getPublicationState(
    {
      status: entry.metadata.status,
      publishedAt: entry.metadata.publishedAt,
      scheduledAt: entry.metadata.scheduledAt,
      seoIndexable: false,
      preview: isPreviewEligible(entry.metadata.status),
    },
    now,
  );
  return {
    ...state,
    eligible: isPreviewEligible(entry.metadata.status),
    ...previewNoindexFlags({ status: entry.metadata.status }),
  };
}
