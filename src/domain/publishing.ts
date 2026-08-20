import {
  isPublishedStatus,
  type ContentMetadata,
  type PublishStatus,
} from "@/domain/schemas";

export type PublishGateInput = {
  status: PublishStatus;
  publishedAt?: string;
  scheduledAt?: string;
};

/**
 * A document is publicly available only when:
 * - status is published, refresh-needed, or refreshing
 * - publishedAt is absent or <= now
 * - if scheduled, scheduledAt must be <= now (defensive)
 *
 * Timezone: all timestamps are ISO-8601 UTC with `Z` (e.g. 2026-08-13T12:00:00.000Z).
 * Compare with `Date.parse` / `Date` in UTC; do not apply local offsets at the gate.
 */
export function isPubliclyAvailable(
  input: PublishGateInput,
  now: Date = new Date(),
): boolean {
  if (!isPublishedStatus(input.status)) {
    return false;
  }

  if (input.scheduledAt) {
    const scheduled = Date.parse(input.scheduledAt);
    if (!Number.isNaN(scheduled) && scheduled > now.getTime()) {
      return false;
    }
  }

  if (input.publishedAt) {
    const published = Date.parse(input.publishedAt);
    if (!Number.isNaN(published) && published > now.getTime()) {
      return false;
    }
  }

  return true;
}

export function isIndexable(options: {
  seoIndexable: boolean;
  metadata: ContentMetadata;
  now?: Date;
}): boolean {
  if (!options.seoIndexable) return false;
  return isPubliclyAvailable(
    {
      status: options.metadata.status,
      publishedAt: options.metadata.publishedAt,
      scheduledAt: options.metadata.scheduledAt,
    },
    options.now,
  );
}

export type PublicationState = {
  isPublished: boolean;
  isScheduled: boolean;
  isIndexable: boolean;
  isVisibleInListings: boolean;
  isVisibleInInternalLinks: boolean;
  isPreviewOnly: boolean;
};

export type PublicationStateInput = {
  status: PublishStatus;
  publishedAt?: string;
  scheduledAt?: string;
  seoIndexable?: boolean;
  /** Explicit draft/preview flag — never implies public visibility. */
  preview?: boolean;
};

/**
 * Full publication visibility snapshot for registry / sitemap / linking.
 *
 * Rules:
 * - scheduled with future scheduledAt → not listings / links / sitemap
 * - published + refresh-needed (or refreshing) → still public
 * - draft / review / approved / rejected / archived → never public
 * - preview flag is separate (preview-only surfaces)
 */
export function getPublicationState(
  input: PublicationStateInput,
  now: Date = new Date(),
): PublicationState {
  const isScheduledStatus = input.status === "scheduled";
  const scheduledInFuture =
    Boolean(input.scheduledAt) &&
    !Number.isNaN(Date.parse(input.scheduledAt!)) &&
    Date.parse(input.scheduledAt!) > now.getTime();

  const isPublished = isPubliclyAvailable(
    {
      status: input.status,
      publishedAt: input.publishedAt,
      scheduledAt: input.scheduledAt,
    },
    now,
  );

  const isPreviewOnly = Boolean(input.preview) && !isPublished;

  const isVisible =
    isPublished && !isPreviewOnly && !(isScheduledStatus && scheduledInFuture);

  return {
    isPublished,
    isScheduled: isScheduledStatus || scheduledInFuture,
    isIndexable: Boolean(input.seoIndexable) && isVisible,
    isVisibleInListings: isVisible,
    isVisibleInInternalLinks: isVisible,
    isPreviewOnly,
  };
}

export type PublishContext = {
  now?: Date;
  /** Quality gate already passed. */
  qualityOk?: boolean;
  /** Dependency / refresh checks passed. */
  depsValid?: boolean;
  /** When scheduling: require scheduledAt <= now unless allowFuture. */
  allowFutureSchedule?: boolean;
};

/**
 * Whether a registry entry (or gate input) may be published now.
 * Requires status approved|scheduled, quality + deps flags, and schedule due.
 */
export function canPublish(
  entry: {
    status: PublishStatus;
    scheduledAt?: string;
    approvedVersion?: number;
    liveVersion?: number;
  },
  context: PublishContext = {},
): { ok: boolean; reasons: string[] } {
  const reasons: string[] = [];
  const now = context.now ?? new Date();

  if (entry.status !== "approved" && entry.status !== "scheduled") {
    reasons.push(`status-not-publishable:${entry.status}`);
  }

  if (context.qualityOk === false) {
    reasons.push("quality-gate-failed");
  }

  if (context.depsValid === false) {
    reasons.push("dependencies-invalid");
  }

  if (entry.status === "scheduled" && entry.scheduledAt) {
    const scheduled = Date.parse(entry.scheduledAt);
    if (!Number.isNaN(scheduled) && scheduled > now.getTime()) {
      if (!context.allowFutureSchedule) {
        reasons.push("schedule-not-due");
      }
    }
  }

  if (
    entry.status === "scheduled" &&
    entry.approvedVersion != null &&
    entry.liveVersion != null &&
    entry.approvedVersion === entry.liveVersion
  ) {
    reasons.push("already-published-at-version");
  }

  return { ok: reasons.length === 0, reasons };
}
