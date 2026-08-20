import type { ContentId, ContentRegistryEntry, ScheduleRecord } from "@/domain";
import { listDueSchedules, loadVersion } from "@/data/publishing/store";
import { publishContent, type PublishResult } from "../publish";

export type PublishRunnerOptions = {
  now?: Date;
  dryRun?: boolean;
  actor?: string;
  /** Injectable schedule source (tests). */
  listDue?: (now: Date) => ScheduleRecord[];
  /** Optional in-memory entries keyed by contentId string. */
  entries?: Map<string, ContentRegistryEntry>;
  qualityOk?: boolean;
  depsValid?: boolean;
};

export type PublishRunnerResult = {
  published: PublishResult[];
  skipped: PublishResult[];
  failed: PublishResult[];
};

/**
 * Find due schedules and publish each.
 * Idempotent: skip if already published at the scheduled version.
 */
export function runPublishDue(
  opts: PublishRunnerOptions = {},
): PublishRunnerResult {
  const now = opts.now ?? new Date();
  const due = (opts.listDue ?? listDueSchedules)(now);
  const published: PublishResult[] = [];
  const skipped: PublishResult[] = [];
  const failed: PublishResult[] = [];

  for (const schedule of due) {
    const key = String(schedule.contentId);
    const entry = opts.entries?.get(key);

    const live = loadVersion(schedule.contentId, schedule.approvedVersion);
    if (live?.status === "published") {
      const skip: PublishResult = {
        contentId: schedule.contentId as ContentId,
        status: "skipped",
        reason: "already-published-at-version",
        version: schedule.approvedVersion,
        entry,
      };
      skipped.push(skip);
      continue;
    }

    const result = publishContent(schedule.contentId, {
      now,
      dryRun: opts.dryRun,
      actor: opts.actor ?? "publish-runner",
      version: schedule.approvedVersion,
      currentStatus: entry?.metadata.status ?? "scheduled",
      firstPublishedAt: entry?.firstPublishedAt,
      entry,
      qualityOk: opts.qualityOk ?? true,
      depsValid: opts.depsValid ?? true,
    });

    if (result.status === "published" || result.status === "dry-run") {
      published.push(result);
      if (result.entry && opts.entries) {
        opts.entries.set(key, result.entry);
      }
    } else if (result.status === "skipped") {
      skipped.push(result);
    } else {
      failed.push(result);
    }
  }

  return { published, skipped, failed };
}
