import { getSoftwareBySlug } from "@/data";
import type { WorkflowRun } from "@/domain";
import {
  cancelWorkflow,
  listApprovals,
  listWorkflowRuns,
  rejectWorkflowApproval,
} from "./engine";

const PARKED_RUN_STATUSES = new Set([
  "review-required",
  "waiting",
  "blocked",
  "created",
]);

const CONTENT_WORKFLOW_IDS = new Set([
  "software-onboarding-content",
  "single-content-generation",
]);

/**
 * Parked content workflows whose catalogue software page is already published.
 * Agent drafts stay unpublished — this does not approve or publish.
 */
export function shouldCloseParkedContentWorkflow(
  run: Pick<WorkflowRun, "status" | "workflowId" | "targetId">,
): boolean {
  if (!PARKED_RUN_STATUSES.has(run.status)) return false;
  if (!CONTENT_WORKFLOW_IDS.has(run.workflowId)) return false;
  const product = getSoftwareBySlug(run.targetId, { includeUnpublished: true });
  return product?.metadata.status === "published";
}

export function closeParkedContentWorkflowsForPublishedCatalogue(options: {
  decidedBy: string;
  reason: string;
  dryRun?: boolean;
}): {
  cancelledRunIds: string[];
  rejectedApprovalIds: string[];
} {
  const runs = listWorkflowRuns().filter(shouldCloseParkedContentWorkflow);
  const cancelledRunIds = runs.map((run) => run.id);
  const pendingForRuns = listApprovals().filter(
    (approval) =>
      approval.status === "pending" &&
      approval.workflowRunId != null &&
      cancelledRunIds.includes(approval.workflowRunId),
  );
  const rejectedApprovalIds = pendingForRuns.map((approval) => approval.id);

  if (options.dryRun) {
    return { cancelledRunIds, rejectedApprovalIds };
  }

  for (const run of runs) {
    cancelWorkflow(run.id, options.reason);
  }
  for (const approval of pendingForRuns) {
    rejectWorkflowApproval(approval.id, options.decidedBy, options.reason);
  }
  return { cancelledRunIds, rejectedApprovalIds };
}
