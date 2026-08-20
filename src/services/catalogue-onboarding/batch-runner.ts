import {
  appendCatalogueAudit,
  loadCatalogueBatch,
  loadProcessingRecord,
  saveCatalogueBatch,
  saveProcessingRecord,
} from "@/data/catalogue/store";
import { listWorkflowRuns } from "@/data/workflows/store";
import type { CatalogueOnboardingBatch } from "@/domain";
import {
  createSoftwareWorkflow,
  resumeWorkflow,
  runWorkflow,
} from "@/services/workflow-orchestration";
import { loadEnrichment } from "@/data/research/store";
import type { CatalogueWorkItem } from "./planner";

export type BatchRunOptions = {
  dryRun?: boolean;
  /** Create workflows but do not execute agent steps. */
  createOnly?: boolean;
  approvedBy?: string;
};

/**
 * Approve a planned batch before execution.
 */
export function approveCatalogueBatch(
  batchId: string,
  approvedBy = "cli",
): CatalogueOnboardingBatch {
  const batch = loadCatalogueBatch(batchId);
  if (!batch) throw new Error(`Batch not found: ${batchId}`);
  if (batch.status !== "planned" && batch.status !== "approved") {
    throw new Error(`Batch ${batchId} cannot be approved from ${batch.status}`);
  }
  const updated: CatalogueOnboardingBatch = {
    ...batch,
    status: "approved",
    approvedAt: new Date().toISOString(),
    approvedBy,
    updatedAt: new Date().toISOString(),
  };
  saveCatalogueBatch(updated);
  appendCatalogueAudit("batch_approved", { batchId, approvedBy });
  return updated;
}

function findExistingSoftwareWorkflow(productId: string) {
  return listWorkflowRuns().find(
    (r) =>
      r.workflowId === "software-onboarding-content" &&
      r.targetId === productId &&
      (r.status === "created" ||
        r.status === "running" ||
        r.status === "waiting" ||
        r.status === "blocked" ||
        r.status === "review-required" ||
        r.status === "completed" ||
        r.status === "completed-with-warnings"),
  );
}

/**
 * Execute catalogue batch: create/reuse software workflows; respect caps via workflow engine.
 * Partial failure does not roll back others.
 */
export async function runCatalogueBatch(
  batchId: string,
  items: CatalogueWorkItem[],
  options: BatchRunOptions = {},
): Promise<CatalogueOnboardingBatch> {
  let batch = loadCatalogueBatch(batchId);
  if (!batch) throw new Error(`Batch not found: ${batchId}`);

  if (batch.status === "planned" && !options.dryRun) {
    throw new Error(
      `Batch ${batchId} is planned — approve first (sg catalogue approve)`,
    );
  }

  const bySource = new Map(items.map((i) => [i.candidate.sourceId, i]));
  const results: CatalogueOnboardingBatch["results"] = [];
  const workflowRunIds = [...batch.workflowRunIds];

  if (options.dryRun) {
    for (const sourceId of batch.sourceIds) {
      const item = bySource.get(sourceId);
      results.push({
        sourceId,
        productSlug:
          item?.mapping.canonicalProductSlug ??
          item?.candidate.suggestedSlug,
        status: "dry-run",
        message: `Would ${item?.priority.actionHint ?? "ONBOARD"} via software workflow`,
      });
    }
    return {
      ...batch,
      results,
      updatedAt: new Date().toISOString(),
    };
  }

  batch = {
    ...batch,
    status: "running",
    updatedAt: new Date().toISOString(),
  };
  saveCatalogueBatch(batch);

  for (const sourceId of batch.sourceIds) {
    const item = bySource.get(sourceId);
    if (!item) {
      results.push({
        sourceId,
        status: "failed",
        message: "Work item missing",
      });
      continue;
    }

    const productId =
      item.mapping.canonicalProductSlug ?? item.candidate.suggestedSlug;

    try {
      if (
        item.priority.actionHint === "MAINTAIN" ||
        item.priority.actionHint === "EXCLUDE" ||
        item.priority.actionHint === "REVIEW"
      ) {
        results.push({
          sourceId,
          productSlug: productId,
          status: item.priority.actionHint.toLowerCase(),
          message: item.priority.reasons.join("; "),
        });
        continue;
      }

      const enrichment = loadEnrichment(productId);
      const needsOnboardingRun =
        item.maturityTier === "TIER_0_CATALOGUE_ONLY" ||
        item.maturityTier === "TIER_1_IDENTITY_TAXONOMY" ||
        item.maturityTier === "TIER_2_RESEARCH" ||
        (item.maturityTier === "TIER_3_CORE_PAGE" && enrichment == null);

      let run = findExistingSoftwareWorkflow(productId);
      if (!run) {
        run = createSoftwareWorkflow({
          productId,
          options: {
            generateReview: true,
            generatePricing: true,
            generateAlternatives: true,
            generateComparisons: true,
            runInternalLinks: true,
            stopAfterApproval: true,
            allowNormalizedFacts: productId === "getresponse",
            dryRun: false,
            maxComparisons: 3,
            skipOnboarding:
              item.priority.actionHint === "RECONCILE" && !needsOnboardingRun,
          },
        });
        workflowRunIds.push(run.id);
        appendCatalogueAudit("workflow_created", {
          sourceId,
          productId,
          runId: run.id,
        });
      } else {
        workflowRunIds.push(run.id);
        appendCatalogueAudit("workflow_reused", {
          sourceId,
          productId,
          runId: run.id,
        });
      }

      const record = loadProcessingRecord(sourceId);
      if (record) {
        saveProcessingRecord({
          ...record,
          state: "onboarding-created",
          workflowRunId: run.id,
          batchId,
          canonicalProductSlug: productId,
          updatedAt: new Date().toISOString(),
        });
      }

      if (options.createOnly) {
        results.push({
          sourceId,
          productSlug: productId,
          status: "workflow-created",
          message: run.id,
        });
        continue;
      }

      const executed =
        run.status === "created" || run.status === "running"
          ? await runWorkflow(run.id, { dryRun: false })
          : run.status === "blocked" ||
              run.status === "waiting" ||
              run.status === "review-required"
            ? await resumeWorkflow(run.id)
            : run;

      results.push({
        sourceId,
        productSlug: productId,
        status: executed.status,
        message: `workflow ${executed.id}`,
      });
    } catch (err) {
      results.push({
        sourceId,
        productSlug: productId,
        status: "failed",
        message: err instanceof Error ? err.message : String(err),
      });
    }
  }

  const failed = results.filter((r) => r.status === "failed").length;
  const warned = results.filter(
    (r) =>
      r.status === "blocked" ||
      r.status === "waiting" ||
      r.status === "review-required" ||
      r.status === "completed-with-warnings",
  ).length;
  const status =
    failed === results.length && results.length > 0
      ? "failed"
      : failed > 0 || warned > 0
        ? "completed-with-warnings"
        : "completed";

  const updated: CatalogueOnboardingBatch = {
    ...batch,
    status,
    results,
    workflowRunIds: [...new Set(workflowRunIds)],
    updatedAt: new Date().toISOString(),
  };
  saveCatalogueBatch(updated);
  appendCatalogueAudit("batch_completed", { batchId, status });
  return updated;
}

export async function resumeCatalogueBatch(
  batchId: string,
): Promise<CatalogueOnboardingBatch> {
  const batch = loadCatalogueBatch(batchId);
  if (!batch) throw new Error(`Batch not found: ${batchId}`);
  const results = [...batch.results];

  for (const runId of batch.workflowRunIds) {
    try {
      const run = await resumeWorkflow(runId);
      const idx = results.findIndex((r) => r.message?.includes(runId));
      const entry = {
        sourceId: results[idx]?.sourceId ?? run.targetId,
        productSlug: run.targetId,
        status: run.status,
        message: `resumed ${runId}`,
      };
      if (idx >= 0) results[idx] = entry;
      else results.push(entry);
    } catch (err) {
      results.push({
        sourceId: runId,
        status: "failed",
        message: err instanceof Error ? err.message : String(err),
      });
    }
  }

  const failed = results.filter((r) => r.status === "failed").length;
  const updated: CatalogueOnboardingBatch = {
    ...batch,
    status: failed ? "completed-with-warnings" : "completed",
    results,
    updatedAt: new Date().toISOString(),
  };
  saveCatalogueBatch(updated);
  return updated;
}
