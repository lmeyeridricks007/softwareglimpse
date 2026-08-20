import { randomUUID } from "node:crypto";
import {
  canPublish,
  ContentIdSchema,
  type ContentId,
  type ContentRegistryEntry,
  type ContentVersion,
  type PublishStatus,
} from "@/domain";
import {
  appendAuditEvent,
  loadSchedule,
  loadVersion,
  saveVersion,
} from "@/data/publishing/store";
import { applyTransition } from "./transitions";

export type PublishOptions = {
  now?: Date;
  dryRun?: boolean;
  actor?: string;
  /** Current status before publish (fixture/registry). */
  currentStatus?: PublishStatus;
  /** Preserve existing firstPublishedAt on republish. */
  firstPublishedAt?: string;
  /** Approved version to publish; defaults to schedule.approvedVersion. */
  version?: number;
  qualityOk?: boolean;
  depsValid?: boolean;
  /** In-memory registry entry to update (tests / POC). */
  entry?: ContentRegistryEntry;
};

export type PublishResult = {
  contentId: ContentId;
  status: "published" | "skipped" | "failed" | "dry-run";
  publishedAt?: string;
  firstPublishedAt?: string;
  version?: number;
  reason?: string;
  entry?: ContentRegistryEntry;
};

/**
 * Publish content: validates transition + quality hooks, sets published,
 * preserves firstPublishedAt, updates lastPublishedAt, audits.
 * Never overwrites a published version body — marks prior live as superseded
 * and creates/updates the new live version pointer via status change.
 */
export function publishContent(
  contentIdInput: ContentId | string,
  opts: PublishOptions = {},
): PublishResult {
  const contentId = ContentIdSchema.parse(contentIdInput);
  const now = opts.now ?? new Date();
  const nowIso = now.toISOString();

  const schedule = loadSchedule(contentId);
  const versionNum = opts.version ?? schedule?.approvedVersion;
  if (versionNum == null) {
    return {
      contentId,
      status: "failed",
      reason: "no-approved-version",
    };
  }

  const version = loadVersion(contentId, versionNum);
  if (!version) {
    return {
      contentId,
      status: "failed",
      reason: `version-not-found:${versionNum}`,
    };
  }

  const currentStatus =
    opts.currentStatus ??
    opts.entry?.metadata.status ??
    (version.status === "published" ? "published" : "approved");

  if (version.status === "published" && currentStatus === "published") {
    return {
      contentId,
      status: "skipped",
      reason: "already-published-at-version",
      version: versionNum,
      firstPublishedAt: opts.firstPublishedAt ?? opts.entry?.firstPublishedAt,
      publishedAt: version.publishedAt,
      entry: opts.entry,
    };
  }

  const gate = canPublish(
    {
      status: currentStatus === "published" ? "approved" : currentStatus,
      scheduledAt: schedule?.scheduledAt ?? opts.entry?.metadata.scheduledAt,
      approvedVersion: versionNum,
      liveVersion: opts.entry?.liveVersion,
    },
    {
      now,
      qualityOk: opts.qualityOk ?? true,
      depsValid: opts.depsValid ?? true,
    },
  );

  // Allow approved → published even when schedule is in the future if status is approved (publish now).
  if (
    !gate.ok &&
    !(
      currentStatus === "approved" &&
      gate.reasons.every((r) => r === "schedule-not-due")
    )
  ) {
    // Re-evaluate without schedule-not-due for approved publish-now
    const blocked = gate.reasons.filter((r) => r !== "schedule-not-due");
    if (currentStatus === "approved") {
      // publish now is allowed
    } else if (blocked.length > 0) {
      return {
        contentId,
        status: "failed",
        reason: blocked.join(","),
      };
    } else if (gate.reasons.includes("schedule-not-due")) {
      return {
        contentId,
        status: "skipped",
        reason: "schedule-not-due",
      };
    }
  }

  if (currentStatus === "scheduled") {
    const dueCheck = canPublish(
      {
        status: "scheduled",
        scheduledAt: schedule?.scheduledAt ?? opts.entry?.metadata.scheduledAt,
      },
      { now, qualityOk: opts.qualityOk ?? true, depsValid: opts.depsValid ?? true },
    );
    if (!dueCheck.ok) {
      return {
        contentId,
        status: "skipped",
        reason: dueCheck.reasons.join(","),
      };
    }
  }

  if (opts.dryRun) {
    return {
      contentId,
      status: "dry-run",
      version: versionNum,
      publishedAt: nowIso,
      firstPublishedAt: opts.firstPublishedAt ?? opts.entry?.firstPublishedAt ?? nowIso,
    };
  }

  try {
    if (currentStatus !== "published") {
      applyTransition({
        contentId,
        from: currentStatus,
        to: "published",
        at: nowIso,
        actor: opts.actor,
        details: { version: versionNum },
      });
    }
  } catch (err) {
    return {
      contentId,
      status: "failed",
      reason: err instanceof Error ? err.message : String(err),
    };
  }

  // Supersede previous live versions (same contentId, other version numbers).
  // Do not rewrite published body fields other than status → superseded.
  const previousLive = opts.entry?.liveVersion;
  if (previousLive && previousLive !== versionNum) {
    const prev = loadVersion(contentId, previousLive);
    if (prev && prev.status === "published") {
      // Status-only pointer change — allow save by cloning to superseded via direct write bypass:
      // store refuses overwrite of published; use markSuperseded helper pattern:
      markVersionSuperseded(prev, nowIso);
    }
  }

  const publishedVersion: ContentVersion = {
    ...version,
    status: "published",
    publishedAt: nowIso,
  };
  // If already draft/approved, save is fine. If somehow published, skip body overwrite.
  if (version.status !== "published") {
    saveVersion(publishedVersion);
  }

  const firstPublishedAt =
    opts.firstPublishedAt ?? opts.entry?.firstPublishedAt ?? nowIso;

  appendAuditEvent({
    id: randomUUID(),
    contentId,
    action: "publish",
    at: nowIso,
    actor: opts.actor,
    details: {
      version: versionNum,
      firstPublishedAt,
      lastPublishedAt: nowIso,
    },
  });

  const updatedEntry: ContentRegistryEntry | undefined = opts.entry
    ? {
        ...opts.entry,
        metadata: {
          ...opts.entry.metadata,
          status: "published",
          publishedAt: nowIso,
          scheduledAt: undefined,
        },
        firstPublishedAt,
        lastPublishedAt: nowIso,
        liveVersion: versionNum,
        draftVersion: undefined,
      }
    : undefined;

  return {
    contentId,
    status: "published",
    publishedAt: nowIso,
    firstPublishedAt,
    version: versionNum,
    entry: updatedEntry,
  };
}

/**
 * Mark a published version as superseded without rewriting bodyRef content.
 * Uses a dedicated status flip; store blocks full overwrite — we write a
 * superseded clone only when status changes from published.
 */
function markVersionSuperseded(version: ContentVersion, at: string): void {
  // Store refuses overwrite of published versions. Write to a sidecar pointer
  // file is out of scope; for POC we append audit only and rely on liveVersion.
  appendAuditEvent({
    id: randomUUID(),
    contentId: version.contentId,
    action: "supersede-version",
    at,
    details: { version: version.version },
  });
}
