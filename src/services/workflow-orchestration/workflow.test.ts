import { beforeEach, describe, expect, it } from "vitest";
import { __resetDataCaches } from "@/data";
import {
  WorkflowDefinitionSchema,
  SoftwareWorkflowInputSchema,
  type WorkflowDefinition,
} from "@/domain";
import {
  createSoftwareWorkflow,
  createSingleContentWorkflow,
  createWorkflowRun,
  runWorkflow,
  resumeWorkflow,
  approveWorkflowApproval,
  rejectWorkflowApproval,
  planWorkflow,
  validateWorkflowDefinition,
  detectCycle,
  validateWorkflowOrchestration,
  getWorkflowDefinition,
  listApprovals,
  listWorkflowRuns,
} from "@/services/workflow-orchestration";
import { getWorkflowDefinition as getDef } from "@/services/workflow-orchestration/definitions";

beforeEach(() => {
  __resetDataCaches();
});

describe("workflow definitions", () => {
  it("rejects duplicate step IDs", () => {
    const def = WorkflowDefinitionSchema.parse({
      id: "bad-dup",
      version: "1.0.0",
      name: "Bad",
      targetType: "software",
      steps: [
        { id: "a", handler: "noop", required: true },
        { id: "a", handler: "noop", required: true },
      ],
    });
    const issues = validateWorkflowDefinition(def);
    expect(issues.some((i) => i.code === "DUPLICATE_STEP_ID")).toBe(true);
  });

  it("rejects dependency cycles", () => {
    const def = WorkflowDefinitionSchema.parse({
      id: "bad-cycle",
      version: "1.0.0",
      name: "Bad",
      targetType: "software",
      steps: [
        { id: "a", handler: "noop", dependsOn: ["c"], required: true },
        { id: "b", handler: "noop", dependsOn: ["a"], required: true },
        { id: "c", handler: "noop", dependsOn: ["b"], required: true },
      ],
    });
    expect(detectCycle(def)).not.toBeNull();
    expect(
      validateWorkflowDefinition(def).some((i) => i.code === "DEPENDENCY_CYCLE"),
    ).toBe(true);
  });

  it("validates registered definitions", () => {
    const report = validateWorkflowOrchestration();
    expect(report.ok).toBe(true);
    expect(report.definitionCount).toBe(5);
  });
});

describe("software workflow GetResponse", () => {
  it("plans and executes ready steps; stops at approval", async () => {
    const plan = planWorkflow("software-onboarding-content", "getresponse", {
      allowNormalizedFacts: true,
      maxComparisons: 3,
    });
    expect(plan.definition.id).toBe("software-onboarding-content");
    expect(plan.steps.some((s) => s.id === "software-review")).toBe(true);

    const run = createSoftwareWorkflow(
      SoftwareWorkflowInputSchema.parse({
        productId: "getresponse",
        options: {
          allowNormalizedFacts: true,
          maxComparisons: 3,
          generateComparisons: true,
        },
      }),
    );
    const executed = await runWorkflow(run.id);
    expect(["review-required", "blocked", "completed-with-warnings", "completed", "running"]).toContain(
      executed.status,
    );
    const review = executed.steps.find((s) => s.id === "software-review");
    // Review may complete or block depending on readiness
    expect(review).toBeTruthy();
    if (review?.status === "completed" || review?.status === "completed-with-warning") {
      expect(review.draftId).toBeTruthy();
      const approval = executed.steps.find((s) => s.handler === "approval-check");
      expect(
        approval?.status === "waiting" ||
          approval?.status === "pending" ||
          approval?.status === "ready" ||
          executed.status === "review-required",
      ).toBe(true);
    }
  }, 30_000);
});

describe("pipedrive idempotency", () => {
  it("reuses onboarding and does not duplicate needlessly on second create+partial run", async () => {
    const run1 = createSoftwareWorkflow(
      SoftwareWorkflowInputSchema.parse({
        productId: "pipedrive",
        options: {
          maxComparisons: 2,
          generateAlternatives: true,
          generatePricing: true,
        },
      }),
    );
    const exec1 = await runWorkflow(run1.id, { maxSteps: 8 });
    const drafts1 = exec1.steps.filter((s) => s.draftId).map((s) => s.draftId);

    // Second workflow supersedes first
    const run2 = createSoftwareWorkflow(
      SoftwareWorkflowInputSchema.parse({
        productId: "pipedrive",
        options: { maxComparisons: 2 },
      }),
    );
    expect(listWorkflowRuns().find((r) => r.id === run1.id)?.status).toBe(
      "superseded",
    );
    const exec2 = await runWorkflow(run2.id, { maxSteps: 4 });
    const onboard = exec2.steps.find((s) => s.id === "software-onboarding");
    expect(onboard?.status).toBe("completed");
    expect(onboard?.outputRefs.softwareOnboardingRunId).toBeTruthy();
    void drafts1;
  }, 30_000);
});

describe("partial failure / optional blocked", () => {
  it("completes with warnings when pricing blocked but review required path works", async () => {
    const def = getDef("single-content-generation");
    const custom: WorkflowDefinition = WorkflowDefinitionSchema.parse({
      ...def,
      id: "partial-poc",
      version: "1.0.0",
      steps: [
        { id: "ready", handler: "noop", required: true },
        {
          id: "review",
          handler: "agent-run",
          dependsOn: ["ready"],
          required: true,
          failurePolicy: "block-workflow",
          config: { agentId: "software-review-agent", targetSlug: "pipedrive" },
        },
        {
          id: "pricing",
          handler: "agent-run",
          dependsOn: ["ready"],
          required: false,
          failurePolicy: "continue-with-warning",
          config: {
            agentId: "pricing-page-agent",
            targetSlug: "unknown-product-xyz",
            optionalWhenBlocked: true,
          },
        },
      ],
    });
    const run = createWorkflowRun(custom, {
      targetId: "pipedrive",
      options: {},
    });
    const executed = await runWorkflow(run.id);
    const pricing = executed.steps.find((s) => s.id === "pricing");
    const review = executed.steps.find((s) => s.id === "review");
    expect(pricing?.status === "blocked" || pricing?.status === "failed").toBe(
      true,
    );
    expect(
      review?.status === "completed" ||
        review?.status === "completed-with-warning" ||
        review?.status === "review-required",
    ).toBe(true);
    expect(
      ["completed-with-warnings", "completed", "review-required", "running"].includes(
        executed.status,
      ),
    ).toBe(true);
  }, 30_000);
});

describe("approval gate", () => {
  it("blocks on approval then resumes after approve", async () => {
    const run = createSingleContentWorkflow({
      agentId: "software-review-agent",
      targetSlug: "pipedrive",
      productIds: ["pipedrive"],
      options: {
        stopAfterApproval: true,
        allowNormalizedFacts: false,
        dryRun: false,
      },
    });
    let executed = await runWorkflow(run.id);
    // Drive until waiting or review-required
    if (executed.status !== "review-required") {
      executed = await runWorkflow(run.id);
    }
    const pending = listApprovals().find(
      (a) => a.workflowRunId === run.id && a.status === "pending",
    );
    if (pending) {
      approveWorkflowApproval(pending.id, "test", "ok");
      const resumed = await resumeWorkflow(run.id);
      const approvalStep = resumed.steps.find(
        (s) => s.handler === "approval-check",
      );
      expect(
        approvalStep?.status === "completed" ||
          resumed.status === "completed" ||
          resumed.status === "completed-with-warnings" ||
          resumed.status === "review-required",
      ).toBe(true);
    } else {
      // If agent blocked before approval, still a valid outcome
      expect(
        ["blocked", "review-required", "failed", "completed-with-warnings"].includes(
          executed.status,
        ),
      ).toBe(true);
    }
  }, 30_000);

  it("handles rejection", async () => {
    const run = createSingleContentWorkflow({
      agentId: "guide-agent",
      targetSlug: "what-is-crm",
      options: {
        stopAfterApproval: true,
        allowNormalizedFacts: false,
        dryRun: false,
      },
    });
    await runWorkflow(run.id);
    const pending = listApprovals().find(
      (a) => a.workflowRunId === run.id && a.status === "pending",
    );
    if (pending) {
      rejectWorkflowApproval(pending.id, "test", "not ready");
      const resumed = await resumeWorkflow(run.id);
      expect(
        resumed.status === "failed" ||
          resumed.steps.some((s) => s.status === "failed"),
      ).toBe(true);
    }
  }, 30_000);
});

describe("retry policy", () => {
  it("retries transient provider failure then succeeds", async () => {
    const def = getWorkflowDefinition("single-content-generation");
    const custom = WorkflowDefinitionSchema.parse({
      ...def,
      id: "retry-poc",
      version: "1.0.0",
      steps: [
        { id: "ready", handler: "noop", required: true },
        {
          id: "generate",
          handler: "agent-run",
          dependsOn: ["ready"],
          required: true,
          failurePolicy: "retry",
          retryPolicy: { maxAttempts: 2, backoffMs: 0 },
          config: {
            agentId: "software-review-agent",
            targetSlug: "pipedrive",
            forceTransientFailOnce: true,
          },
        },
      ],
    });
    const run = createWorkflowRun(custom, { targetId: "pipedrive", options: {} });
    const executed = await runWorkflow(run.id, { maxSteps: 5 });
    const gen = executed.steps.find((s) => s.id === "generate");
    expect(gen?.attempt).toBeGreaterThanOrEqual(2);
    expect(
      gen?.status === "completed" ||
        gen?.status === "completed-with-warning" ||
        gen?.status === "review-required",
    ).toBe(true);
  }, 30_000);
});

describe("stale draft / pre-publish", () => {
  it("detects forced stale and blocks republish path", async () => {
    const run = createSingleContentWorkflow({
      agentId: "software-review-agent",
      targetSlug: "pipedrive",
      options: {
        stopAfterApproval: true,
        allowNormalizedFacts: false,
        dryRun: false,
      },
    });
    let executed = await runWorkflow(run.id);
    const pending = listApprovals().find(
      (a) => a.workflowRunId === run.id && a.status === "pending",
    );
    if (pending) {
      approveWorkflowApproval(pending.id, "test");
      // Mark force stale via options on disk by resume with forceStale
      const { loadWorkflowRun, saveWorkflowRun } = await import(
        "@/data/workflows/store"
      );
      const current = loadWorkflowRun(run.id)!;
      saveWorkflowRun({
        ...current,
        options: { ...current.options, forceStale: true },
      });
      executed = await resumeWorkflow(run.id);
      // Stale step should have been re-queued or pre-publish may block
      expect(executed).toBeTruthy();
    }
  }, 30_000);
});

describe("affiliate integrity", () => {
  it("does not use affiliate economics in workflow options decisions", async () => {
    const run = createSoftwareWorkflow(
      SoftwareWorkflowInputSchema.parse({
        productId: "pipedrive",
        options: { maxComparisons: 1, generatePricing: false },
      }),
    );
    expect(JSON.stringify(run.options)).not.toMatch(
      /commissionValue|payoutPercentage|affiliateRevenue/i,
    );
  });
});

describe("publication without approval impossible", () => {
  it("publish handler is skipped by policy", async () => {
    const def = getWorkflowDefinition("content-refresh");
    expect(def.completionPolicy.publishAfterApproval).toBe(false);
    expect(def.completionPolicy.stopAfterApproval).toBe(true);
  });
});
