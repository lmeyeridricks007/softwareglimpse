import { randomUUID } from "node:crypto";
import type { PublishJob, RefreshCandidate } from "@/domain";
import { saveJob, setRefreshState } from "@/data/publishing/store";
import { createDraftVersion } from "../versions";

export type RefreshRunnerOptions = {
  now?: Date;
  dryRun?: boolean;
  actor?: string;
  /**
   * NEVER auto-publish editorial — this runner only queues jobs / draft stubs.
   */
  candidates: RefreshCandidate[];
};

export type RefreshRunnerJobResult = {
  contentId: string;
  status: "queued" | "draft-created" | "dry-run" | "skipped";
  jobId?: string;
  draftVersion?: number;
  reason?: string;
};

export type RefreshRunnerResult = {
  results: RefreshRunnerJobResult[];
  queued: number;
  draftsCreated: number;
  skipped: number;
};

/**
 * Queue refresh jobs / create draft version stubs from candidates.
 * NEVER auto-publishes editorial content. Supports dry-run.
 */
export function runRefreshCandidates(
  opts: RefreshRunnerOptions,
): RefreshRunnerResult {
  const now = opts.now ?? new Date();
  const nowIso = now.toISOString();
  const results: RefreshRunnerJobResult[] = [];
  let queued = 0;
  let draftsCreated = 0;
  const skipped = 0;

  for (const candidate of opts.candidates) {
    if (opts.dryRun) {
      results.push({
        contentId: String(candidate.contentId),
        status: "dry-run",
        reason: candidate.reasons.join(","),
      });
      continue;
    }

    setRefreshState({
      ...candidate,
      refreshStatus: "refresh-in-progress",
    });

    const job: PublishJob = {
      id: `job-refresh-${randomUUID().slice(0, 8)}`,
      type: "content-refresh",
      target: candidate.contentId,
      status: "queued",
      createdAt: nowIso,
      attempt: 1,
      result: {
        priority: candidate.priority,
        reasons: candidate.reasons,
        changeEventIds: candidate.changeEventIds,
        autoPublish: false,
      },
    };
    saveJob(job);
    queued += 1;

    const draft = createDraftVersion({
      contentId: candidate.contentId,
      generator: "refresh-runner",
      createdAt: nowIso,
      summary: {
        refreshReasons: candidate.reasons,
        note: "Draft stub — editorial required before publish",
      },
    });
    draftsCreated += 1;

    results.push({
      contentId: String(candidate.contentId),
      status: "draft-created",
      jobId: job.id,
      draftVersion: draft.version,
    });
  }

  return { results, queued, draftsCreated, skipped };
}
