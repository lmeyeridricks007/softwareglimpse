import {
  WorkflowRunSchema,
  WorkflowStepRunSchema,
  SingleContentWorkflowInputSchema,
  type SoftwareWorkflowInput,
  type CategoryWorkflowInput,
  type RefreshWorkflowInput,
  type WorkflowDefinition,
  type WorkflowRun,
  type WorkflowStepRun,
  type WorkflowStepDefinition,
} from "@/domain";
import { z } from "zod";
import { WORKFLOW_EXECUTION_CONFIG } from "@/data/config/workflows/execution";
import {
  acquireTargetLock,
  appendWorkflowEvent,
  listWorkflowRuns,
  loadWorkflowRun,
  releaseTargetLock,
  saveWorkflowRun,
  loadApproval,
  saveApproval,
  listApprovals,
} from "@/data/workflows/store";
import { findLatestRunForSlug } from "@/data/onboarding/store";
import { canonicalizeComparisonSlug } from "@/domain";
import { getWorkflowDefinition, listWorkflowDefinitions } from "./definitions";
import {
  computeRunStatus,
  isOptionalContinuePolicy,
  listReadySteps,
  resolveStepReadiness,
} from "./dependency";
import { getHandler } from "./handlers/types";
import "./handlers";
import { validateWorkflowDefinition } from "./validate-definition";

function nowIso(): string {
  return new Date().toISOString();
}

function history(
  run: WorkflowRun,
  event: string,
  message: string,
  stepId?: string,
  data?: Record<string, unknown>,
): WorkflowRun {
  return {
    ...run,
    history: [
      ...run.history,
      { at: nowIso(), event, stepId, message, data },
    ],
    updatedAt: nowIso(),
  };
}

function emit(event: string, payload: Record<string, unknown>): void {
  try {
    appendWorkflowEvent(event, payload);
  } catch {
    // ignore
  }
}

function stepFromDefinition(
  def: WorkflowStepDefinition,
  overrides: Partial<WorkflowStepRun> = {},
): WorkflowStepRun {
  return WorkflowStepRunSchema.parse({
    id: overrides.id ?? def.id,
    definitionStepId: def.id,
    handler: def.handler,
    label: def.label ?? def.id,
    status: "pending",
    required: def.required,
    failurePolicy: def.failurePolicy,
    attempt: 0,
    maxAttempts:
      def.retryPolicy?.maxAttempts ??
      WORKFLOW_EXECUTION_CONFIG.defaultRetry.maxAttempts,
    dependsOn: def.dependsOn,
    priority: def.priority,
    config: { ...def.config, ...overrides.config },
    expansionKey: overrides.expansionKey,
    ...overrides,
  });
}

/**
 * Expand comparison/use-case child steps from content plan / options.
 */
function expandSteps(
  definition: WorkflowDefinition,
  targetId: string,
  options: Record<string, unknown>,
): WorkflowStepRun[] {
  const steps: WorkflowStepRun[] = [];
  const maxComparisons = Number(
    options.maxComparisons ?? WORKFLOW_EXECUTION_CONFIG.maxComparisonsPerProduct,
  );

  const skipPricing = options.generatePricing === false;
  const skipAlternatives = options.generateAlternatives === false;
  const skipComparisons = options.generateComparisons === false;
  const skipReview = options.generateReview === false;
  const skipLinks = options.runInternalLinks === false;

  for (const def of definition.steps) {
    if (def.id === "pricing-page" && skipPricing) {
      steps.push(
        stepFromDefinition(def, {
          status: "skipped",
          warnings: ["Skipped by option generatePricing=false"],
        }),
      );
      continue;
    }
    if (def.id === "alternatives" && skipAlternatives) {
      steps.push(
        stepFromDefinition(def, {
          status: "skipped",
          warnings: ["Skipped by option generateAlternatives=false"],
        }),
      );
      continue;
    }
    if (def.id === "software-review" && skipReview) {
      steps.push(
        stepFromDefinition(def, {
          status: "skipped",
          warnings: ["Skipped by option generateReview=false"],
          required: false,
        }),
      );
      continue;
    }
    if (def.id === "internal-links" && skipLinks) {
      steps.push(
        stepFromDefinition(def, {
          status: "skipped",
          warnings: ["Skipped by option runInternalLinks=false"],
        }),
      );
      continue;
    }
    if (
      (def.id === "comparisons" || def.config.expandKind === "comparisons") &&
      skipComparisons
    ) {
      steps.push(
        stepFromDefinition(def, {
          status: "skipped",
          warnings: ["Skipped by option generateComparisons=false"],
        }),
      );
      continue;
    }

    if (def.config.expandKind === "comparisons") {
      const fromPlan: string[] = [];
      const run = findLatestRunForSlug(targetId);
      if (run?.pageCandidates) {
        for (const p of run.pageCandidates) {
          if (p.pageType !== "comparison") continue;
          const slug =
            p.canonicalPath
              ?.replace(/^\/compare\//, "")
              .replace(/\/$/, "") ?? "";
          if (slug.includes("-vs-")) fromPlan.push(slug);
        }
      }
      // Also from product comparableSlugs if present in options
      const extra = Array.isArray(options.comparisonTargets)
        ? (options.comparisonTargets as string[])
        : typeof options.comparisonTargets === "string" && options.comparisonTargets
          ? String(options.comparisonTargets).split(",").filter(Boolean)
          : [];

      const targets = [...new Set([...fromPlan, ...extra])].slice(
        0,
        maxComparisons,
      );

      if (targets.length === 0) {
        steps.push(
          stepFromDefinition(def, {
            status: "blocked",
            blockers: [
              "No comparison candidates within limits — relationship/content-plan empty",
            ],
            required: false,
          }),
        );
        continue;
      }

      for (const raw of targets) {
        const parts = raw.split("-vs-");
        const slug =
          parts.length === 2
            ? canonicalizeComparisonSlug(parts as [string, string])
            : raw;
        steps.push(
          stepFromDefinition(def, {
            id: `comparison:${slug}`,
            expansionKey: slug,
            label: `Comparison ${slug}`,
            config: {
              ...def.config,
              agentId: "comparison-agent",
              targetSlug: slug,
            },
          }),
        );
      }
      continue;
    }

    if (def.config.expandKind === "use-cases") {
      const useCases = Array.isArray(options.useCaseTargets)
        ? (options.useCaseTargets as string[])
        : [];
      if (useCases.length === 0) {
        steps.push(
          stepFromDefinition(def, {
            status: "skipped",
            warnings: ["No use-case targets configured"],
            required: false,
          }),
        );
        continue;
      }
      for (const uc of useCases) {
        steps.push(
          stepFromDefinition(def, {
            id: `use-case:${uc}`,
            expansionKey: uc,
            label: `Use case ${uc}`,
            config: {
              ...def.config,
              agentId: "use-case-page-agent",
              targetSlug: uc,
            },
          }),
        );
      }
      continue;
    }

    // Single-content generate step: inject agentId from options
    if (def.id === "generate" && typeof options.agentId === "string") {
      steps.push(
        stepFromDefinition(def, {
          config: {
            ...def.config,
            agentId: options.agentId as never,
            targetSlug:
              typeof options.targetSlug === "string"
                ? options.targetSlug
                : targetId,
            allowNormalizedFacts: Boolean(options.allowNormalizedFacts),
          },
        }),
      );
      continue;
    }

    steps.push(
      stepFromDefinition(def, {
        config: {
          ...def.config,
          targetSlug:
            def.config.targetSlug ??
            (def.handler === "agent-run" ? targetId : def.config.targetSlug),
          allowNormalizedFacts:
            def.config.allowNormalizedFacts ||
            Boolean(options.allowNormalizedFacts) ||
            targetId === "getresponse",
        },
      }),
    );
  }

  return steps;
}

function supersedeActiveRuns(targetType: string, targetId: string, newId: string): void {
  for (const run of listWorkflowRuns()) {
    if (
      run.targetType === targetType &&
      run.targetId === targetId &&
      run.id !== newId &&
      !["completed", "completed-with-warnings", "failed", "cancelled", "superseded"].includes(
        run.status,
      )
    ) {
      const updated = {
        ...run,
        status: "superseded" as const,
        supersededBy: newId,
        updatedAt: nowIso(),
      };
      saveWorkflowRun(updated);
    }
  }
}

export function createWorkflowRun(
  definition: WorkflowDefinition,
  input: {
    targetId: string;
    options?: Record<string, unknown>;
    softwareOnboardingRunId?: string;
    categoryOnboardingRunId?: string;
  },
): WorkflowRun {
  const issues = validateWorkflowDefinition(definition);
  const errors = issues.filter((i) => i.severity === "error");
  if (errors.length) {
    throw new Error(
      `Invalid workflow definition ${definition.id}: ${errors.map((e) => e.message).join("; ")}`,
    );
  }

  const id = `wf-${definition.id}-${input.targetId}-${Date.now()}`;
  const targetKey = `${definition.targetType}:${input.targetId}`;

  // Supersede prior active runs and release their locks before acquiring
  supersedeActiveRuns(definition.targetType, input.targetId, id);
  for (const run of listWorkflowRuns()) {
    if (run.supersededBy === id) {
      releaseTargetLock(targetKey, run.id);
    }
  }

  const lock = acquireTargetLock(targetKey, id);
  if (!lock.ok) {
    // Take over stale lock if holder is superseded/terminal
    releaseTargetLock(targetKey, lock.holder ?? "");
    const retry = acquireTargetLock(targetKey, id);
    if (!retry.ok) {
      throw new Error(
        `Active workflow lock held by ${retry.holder} for ${input.targetId}`,
      );
    }
  }

  const options = input.options ?? {};
  let run: WorkflowRun = WorkflowRunSchema.parse({
    id,
    workflowId: definition.id,
    workflowVersion: definition.version,
    name: `${definition.name}: ${input.targetId}`,
    targetType: definition.targetType,
    targetId: input.targetId,
    status: "created",
    steps: expandSteps(definition, input.targetId, options),
    history: [],
    options,
    softwareOnboardingRunId: input.softwareOnboardingRunId,
    categoryOnboardingRunId: input.categoryOnboardingRunId,
    warnings: [],
    createdAt: nowIso(),
    updatedAt: nowIso(),
  });

  run = history(run, "workflow_created", `Created ${definition.id}:v${definition.version}`);
  run = resolveStepReadiness(run);
  saveWorkflowRun(run);
  emit("workflow_created", { runId: run.id, targetId: input.targetId });
  return run;
}

export function createSoftwareWorkflow(
  input: SoftwareWorkflowInput,
): WorkflowRun {
  const definition = getWorkflowDefinition("software-onboarding-content");
  return createWorkflowRun(definition, {
    targetId: input.productId,
    softwareOnboardingRunId: input.softwareOnboardingRunId,
    options: {
      ...input.options,
      generateReview: input.options.generateReview,
      generatePricing: input.options.generatePricing,
      generateAlternatives: input.options.generateAlternatives,
      generateComparisons: input.options.generateComparisons,
      runInternalLinks: input.options.runInternalLinks,
      allowNormalizedFacts:
        input.options.allowNormalizedFacts || input.productId === "getresponse",
      maxComparisons: input.options.maxComparisons,
      skipOnboarding: input.options.skipOnboarding,
    },
  });
}

export function createCategoryWorkflow(
  input: CategoryWorkflowInput,
): WorkflowRun {
  const definition = getWorkflowDefinition("category-onboarding-content");
  return createWorkflowRun(definition, {
    targetId: input.categoryId,
    categoryOnboardingRunId: input.categoryOnboardingRunId,
    options: { ...input.options },
  });
}

export function createSingleContentWorkflow(
  input: z.input<typeof SingleContentWorkflowInputSchema>,
): WorkflowRun {
  const parsed = SingleContentWorkflowInputSchema.parse(input);
  const definition = getWorkflowDefinition("single-content-generation");
  return createWorkflowRun(definition, {
    targetId: parsed.targetSlug,
    options: {
      agentId: parsed.agentId,
      targetSlug: parsed.targetSlug,
      productIds: parsed.productIds,
      categoryIds: parsed.categoryIds,
      allowNormalizedFacts: parsed.options.allowNormalizedFacts,
    },
  });
}

export function createRefreshWorkflow(
  input: RefreshWorkflowInput,
): WorkflowRun {
  const definition = getWorkflowDefinition("content-refresh");
  return createWorkflowRun(definition, {
    targetId: input.productId ?? input.contentId,
    options: {
      changeEventType: input.changeEventType,
      affectedSections: input.affectedSections,
      contentId: input.contentId,
      agentId: "refresh-agent",
      targetSlug: input.productId ?? input.contentId,
    },
  });
}

export function getWorkflowStatus(runId: string): WorkflowRun | null {
  const run = loadWorkflowRun(runId);
  if (!run) return null;
  return resolveStepReadiness(run);
}

export type RunWorkflowOptions = {
  dryRun?: boolean;
  maxSteps?: number;
};

async function executeOneStep(
  run: WorkflowRun,
  step: WorkflowStepRun,
  options: RunWorkflowOptions,
): Promise<WorkflowRun> {
  let current = history(
    run,
    "workflow_step_started",
    `Started ${step.label ?? step.id}`,
    step.id,
  );
  emit("workflow_step_started", { runId: run.id, stepId: step.id });

  const idx = current.steps.findIndex((s) => s.id === step.id);
  const attempting: WorkflowStepRun = {
    ...current.steps[idx],
    status: "running",
    attempt: current.steps[idx].attempt + 1,
    startedAt: nowIso(),
    error: undefined,
  };
  current.steps = [...current.steps];
  current.steps[idx] = attempting;
  current.status = "running";
  current.updatedAt = nowIso();
  saveWorkflowRun(current);

  const handler = getHandler(attempting.handler);
  const result = await handler.execute({
    run: current,
    step: attempting,
    dryRun: options.dryRun,
  });

  let updated: WorkflowStepRun = {
    ...attempting,
    status: result.status,
    outputRefs: { ...attempting.outputRefs, ...result.outputRefs },
    inputRefs: { ...attempting.inputRefs, ...result.inputRefs },
    inputSnapshot: result.inputSnapshot ?? attempting.inputSnapshot,
    blockers: result.blockers ?? [],
    warnings: [...attempting.warnings, ...(result.warnings ?? [])],
    error: result.error,
    draftId: result.draftId ?? attempting.draftId,
    agentTaskId: result.agentTaskId ?? attempting.agentTaskId,
    approvalId: result.approvalId ?? attempting.approvalId,
    completedAt:
      result.status === "running" ? undefined : nowIso(),
    revisionAttempts:
      result.historyMessage?.includes("revision")
        ? attempting.revisionAttempts + 1
        : attempting.revisionAttempts,
  };

  // Retry policy for transient errors
  if (
    result.status === "failed" &&
    result.retryable &&
    updated.attempt < updated.maxAttempts
  ) {
    updated = {
      ...updated,
      status: "ready",
      error: result.error,
      warnings: [
        ...updated.warnings,
        `Retry scheduled (${updated.attempt}/${updated.maxAttempts}): ${result.retryErrorCode}`,
      ],
      completedAt: undefined,
    };
    current.steps[idx] = updated;
    current = history(
      current,
      "workflow_step_failed",
      `Retryable failure on ${step.id}: ${result.error}`,
      step.id,
    );
    saveWorkflowRun(current);
    emit("workflow_step_failed", {
      runId: current.id,
      stepId: step.id,
      retry: true,
    });
    return current;
  }

  // Optional blocked / QA-review → continue-with-warning path
  if (
    result.status === "blocked" &&
    !updated.required &&
    (updated.failurePolicy === "continue-with-warning" ||
      updated.failurePolicy === "continue")
  ) {
    current.warnings = [
      ...current.warnings,
      `${updated.id} blocked: ${(result.blockers ?? []).join("; ")}`,
    ];
  }

  if (
    updated.status === "review-required" &&
    isOptionalContinuePolicy(updated)
  ) {
    updated = {
      ...updated,
      status: "completed-with-warning",
      warnings: [
        ...updated.warnings,
        "Optional step held for QA/editorial review — required path continues",
      ],
    };
    current.warnings = [
      ...current.warnings,
      `${updated.id}: optional review-required did not block the workflow`,
    ];
  }

  current.steps[idx] = updated;
  current = history(
    current,
    result.status === "failed" ? "workflow_step_failed" : "workflow_step_completed",
    result.historyMessage ?? `Step ${step.id} → ${result.status}`,
    step.id,
  );

  if (result.status === "waiting") {
    emit("approval_requested", {
      runId: current.id,
      stepId: step.id,
      approvalId: result.approvalId,
    });
  }

  current = resolveStepReadiness(current);
  current.status = computeRunStatus(current);
  current.updatedAt = nowIso();
  saveWorkflowRun(current);
  emit(
    result.status === "failed" ? "workflow_step_failed" : "workflow_step_completed",
    { runId: current.id, stepId: step.id, status: result.status },
  );
  return current;
}

/**
 * Run ready steps one at a time (concurrency=1).
 * Stops at waiting/review-required/blocked required gates.
 */
export async function runWorkflow(
  runId: string,
  options: RunWorkflowOptions = {},
): Promise<WorkflowRun> {
  let run = loadWorkflowRun(runId);
  if (!run) throw new Error(`Workflow run not found: ${runId}`);
  if (run.status === "cancelled" || run.status === "superseded") {
    return run;
  }

  run = history(run, "workflow_started", "Workflow execution started");
  run.status = "running";
  saveWorkflowRun(run);
  emit("workflow_started", { runId });

  const maxSteps = options.maxSteps ?? 50;
  let executed = 0;

  while (executed < maxSteps) {
    run = resolveStepReadiness(run);
    const ready = listReadySteps(run);
    if (ready.length === 0) break;

    // Cap agent tasks per run
    const agentDone = run.steps.filter(
      (s) =>
        s.handler === "agent-run" &&
        (s.status === "completed" || s.status === "completed-with-warning"),
    ).length;
    const next = ready[0];
    if (
      next.handler === "agent-run" &&
      agentDone >= WORKFLOW_EXECUTION_CONFIG.maxAgentTasksPerRun
    ) {
      run = history(
        run,
        "workflow_blocked",
        `Agent task cap reached (${WORKFLOW_EXECUTION_CONFIG.maxAgentTasksPerRun})`,
      );
      run.status = "review-required";
      saveWorkflowRun(run);
      break;
    }

    emit("workflow_step_ready", { runId: run.id, stepId: next.id });
    run = await executeOneStep(run, next, options);
    executed += 1;

    if (run.status === "blocked" || run.status === "failed") {
      break;
    }

    // Stop only at required waiting/review gates — optional QA review continues.
    const requiredGate = run.steps.some(
      (s) =>
        s.required &&
        (s.status === "waiting" || s.status === "review-required"),
    );
    if (requiredGate) {
      run.status = "review-required";
      run = history(
        run,
        "workflow_blocked",
        "WAITING FOR EDITORIAL APPROVAL",
      );
      saveWorkflowRun(run);
      break;
    }
  }

  run = resolveStepReadiness(run);
  run.status = computeRunStatus(run);
  run.updatedAt = nowIso();

  if (
    run.status === "completed" ||
    run.status === "completed-with-warnings"
  ) {
    releaseTargetLock(`${run.targetType}:${run.targetId}`, run.id);
    run = history(run, "workflow_completed", `Workflow ${run.status}`);
    emit("workflow_completed", { runId: run.id, status: run.status });
  } else if (run.status === "failed") {
    run = history(run, "workflow_failed", "Workflow failed");
    emit("workflow_failed", { runId: run.id });
  }

  saveWorkflowRun(run);
  return run;
}

export async function resumeWorkflow(
  runId: string,
  options: RunWorkflowOptions = {},
): Promise<WorkflowRun> {
  let run = loadWorkflowRun(runId);
  if (!run) throw new Error(`Workflow run not found: ${runId}`);
  if (run.status === "cancelled" || run.status === "superseded") {
    return run;
  }

  // Re-queue blocked onboarding attach now that a software run may exist
  run = {
    ...run,
    steps: run.steps.map((s) => {
      if (
        s.status !== "blocked" ||
        (s.handler !== "software-onboarding" && s.handler !== "content-plan")
      ) {
        return s;
      }
      return {
        ...s,
        status: "pending" as const,
        blockers: [],
        warnings: [
          ...s.warnings,
          "Re-queued blocked onboarding attach on resume",
        ],
      };
    }),
  };

  // Optional QA-fail review must not keep the run parked forever.
  run = {
    ...run,
    steps: run.steps.map((s) =>
      s.status === "review-required" && isOptionalContinuePolicy(s)
        ? {
            ...s,
            status: "completed-with-warning" as const,
            warnings: [
              ...s.warnings,
              "Optional review-required demoted on resume — required path continues",
            ],
          }
        : s,
    ),
  };

  // Refresh approval-check waiting steps → ready if approved
  run = {
    ...run,
    steps: run.steps.map((s) => {
      if (s.status !== "waiting" || s.handler !== "approval-check") return s;
      if (!s.approvalId) return s;
      const appr = loadApproval(s.approvalId);
      if (appr?.status === "approved") {
        return {
          ...s,
          status: "ready" as const,
          warnings: [...s.warnings, "Approval received — resuming"],
        };
      }
      if (appr?.status === "rejected") {
        return {
          ...s,
          status: "failed" as const,
          error: appr.notes ?? "Approval rejected",
        };
      }
      return s;
    }),
  };

  // Re-queue blocked pre-publish validation after approval / handler fixes
  run = {
    ...run,
    steps: run.steps.map((s) => {
      if (s.status !== "blocked" || s.handler !== "pre-publish-validation") {
        return s;
      }
      return {
        ...s,
        status: "ready" as const,
        blockers: [],
        warnings: [
          ...s.warnings,
          "Re-running blocked pre-publish validation on resume",
        ],
      };
    }),
  };

  // Re-ready blocked optional? keep blocked.
  // Stale completed steps with changed snapshots → mark stale
  run = {
    ...run,
    steps: run.steps.map((s) => {
      if (
        (s.status === "completed" || s.status === "completed-with-warning") &&
        s.inputSnapshot &&
        run!.options.forceStale === true
      ) {
        return { ...s, status: "stale" as const, blockers: ["Forced stale for POC"] };
      }
      return s;
    }),
  };

  // Convert stale → ready for re-execution
  run = {
    ...run,
    steps: run.steps.map((s) =>
      s.status === "stale"
        ? {
            ...s,
            status: "ready" as const,
            draftId: undefined,
            warnings: [...s.warnings, "Re-running stale step"],
          }
        : s,
    ),
  };

  run = history(run, "workflow_resumed", "Workflow resumed");
  emit("workflow_resumed", { runId });
  saveWorkflowRun(run);
  return runWorkflow(runId, options);
}

export function cancelWorkflow(runId: string, reason: string): WorkflowRun {
  let run = loadWorkflowRun(runId);
  if (!run) throw new Error(`Workflow run not found: ${runId}`);
  run = {
    ...run,
    status: "cancelled",
    cancelReason: reason,
    steps: run.steps.map((s) =>
      ["pending", "ready", "running", "waiting", "review-required", "blocked"].includes(
        s.status,
      )
        ? { ...s, status: "cancelled" as const }
        : s,
    ),
    updatedAt: nowIso(),
  };
  run = history(run, "workflow_cancelled", reason);
  releaseTargetLock(`${run.targetType}:${run.targetId}`, run.id);
  saveWorkflowRun(run);
  return run;
}

export function planWorkflow(
  definitionId: string,
  targetId: string,
  options: Record<string, unknown> = {},
): {
  definition: WorkflowDefinition;
  steps: Array<{
    id: string;
    label?: string;
    dependsOn: string[];
    required: boolean;
    handler: string;
    agentId?: string;
  }>;
  existingRun?: string;
  blockers: string[];
} {
  const definition = getWorkflowDefinition(definitionId);
  const issues = validateWorkflowDefinition(definition);
  const expanded = expandSteps(definition, targetId, options);
  const existing = listWorkflowRuns().find(
    (r) =>
      r.targetId === targetId &&
      r.workflowId === definitionId &&
      !["superseded", "cancelled"].includes(r.status),
  );
  return {
    definition,
    steps: expanded.map((s) => ({
      id: s.id,
      label: s.label,
      dependsOn: s.dependsOn,
      required: s.required,
      handler: s.handler,
      agentId: s.config.agentId,
    })),
    existingRun: existing?.id,
    blockers: [
      ...issues.filter((i) => i.severity === "error").map((i) => i.message),
      ...expanded
        .filter((s) => s.status === "blocked")
        .flatMap((s) => s.blockers),
    ],
  };
}

export function approveWorkflowApproval(
  approvalId: string,
  decidedBy: string,
  notes?: string,
): ReturnType<typeof loadApproval> {
  const record = loadApproval(approvalId);
  if (!record) throw new Error(`Approval not found: ${approvalId}`);
  const updated = {
    ...record,
    status: "approved" as const,
    decidedBy,
    decidedAt: nowIso(),
    notes,
  };
  saveApproval(updated);
  emit("approval_received", { approvalId, status: "approved" });
  return updated;
}

export function rejectWorkflowApproval(
  approvalId: string,
  decidedBy: string,
  reason: string,
): ReturnType<typeof loadApproval> {
  const record = loadApproval(approvalId);
  if (!record) throw new Error(`Approval not found: ${approvalId}`);
  const updated = {
    ...record,
    status: "rejected" as const,
    decidedBy,
    decidedAt: nowIso(),
    notes: reason,
  };
  saveApproval(updated);
  emit("approval_received", { approvalId, status: "rejected" });
  return updated;
}

export function formatWorkflowStatus(run: WorkflowRun): string {
  const lines: string[] = [
    run.name.toUpperCase(),
    "",
  ];
  for (const step of run.steps) {
    const mark =
      step.status === "completed" || step.status === "completed-with-warning"
        ? "✓"
        : step.status === "blocked" || step.status === "failed"
          ? "!"
          : step.status === "waiting" || step.status === "review-required"
            ? "○"
            : step.status === "skipped"
              ? "-"
              : "·";
    lines.push(`${mark} ${step.label ?? step.id}  [${step.status}]`);
    if (step.blockers.length) {
      for (const b of step.blockers) lines.push(`    ${b}`);
    }
    if (step.status === "waiting") {
      lines.push("    WAITING FOR EDITORIAL APPROVAL");
    }
    if (step.draftId) lines.push(`    draft: ${step.draftId}`);
  }
  lines.push("");
  lines.push(`Overall: ${run.status.toUpperCase()}`);
  return lines.join("\n");
}

export function workflowMetrics(): Record<string, number> {
  const runs = listWorkflowRuns();
  const approvals = listApprovals();
  return {
    runsCreated: runs.length,
    completed: runs.filter((r) =>
      ["completed", "completed-with-warnings"].includes(r.status),
    ).length,
    blocked: runs.filter((r) => r.status === "blocked").length,
    failed: runs.filter((r) => r.status === "failed").length,
    reviewRequired: runs.filter((r) => r.status === "review-required").length,
    averageStepsPerRun:
      runs.length === 0
        ? 0
        : Math.round(
            runs.reduce((n, r) => n + r.steps.length, 0) / runs.length,
          ),
    agentTasks: runs.reduce(
      (n, r) => n + r.steps.filter((s) => s.handler === "agent-run").length,
      0,
    ),
    approvalBacklog: approvals.filter((a) => a.status === "pending").length,
  };
}

export { listWorkflowDefinitions, getWorkflowDefinition, listApprovals, listWorkflowRuns };
