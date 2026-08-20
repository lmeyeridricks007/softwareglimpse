import { describe, expect, it } from "vitest";
import type { WorkflowRun, WorkflowStepRun } from "@/domain";
import {
  computeRunStatus,
  isOptionalContinuePolicy,
  isStepSatisfied,
} from "./dependency";

function step(
  partial: Partial<WorkflowStepRun> & Pick<WorkflowStepRun, "id" | "status">,
): WorkflowStepRun {
  return {
    definitionStepId: partial.id,
    handler: "noop",
    required: true,
    failurePolicy: "block-workflow",
    attempt: 0,
    maxAttempts: 2,
    dependsOn: [],
    priority: "normal",
    config: {},
    inputRefs: {},
    outputRefs: {},
    blockers: [],
    warnings: [],
    revisionAttempts: 0,
    ...partial,
  };
}

function run(steps: WorkflowStepRun[]): WorkflowRun {
  return {
    id: "wf-test",
    workflowId: "software-onboarding-content",
    workflowVersion: "1.0.0",
    name: "test",
    targetType: "software",
    targetId: "aweber",
    status: "running",
    steps,
    history: [],
    options: {},
    warnings: [],
    createdAt: "2026-08-17T00:00:00.000Z",
    updatedAt: "2026-08-17T00:00:00.000Z",
  };
}

describe("optional continue-with-warning", () => {
  it("treats optional review-required as satisfied so required gates can run", () => {
    const pricing = step({
      id: "pricing-page",
      status: "review-required",
      required: false,
      failurePolicy: "continue-with-warning",
    });
    expect(isOptionalContinuePolicy(pricing)).toBe(true);
    expect(isStepSatisfied(pricing)).toBe(true);

    const status = computeRunStatus(
      run([
        step({ id: "software-review", status: "completed" }),
        pricing,
        step({ id: "editorial-approval", status: "ready" }),
      ]),
    );
    expect(status).toBe("running");
  });

  it("still parks the run when a required editorial gate is waiting", () => {
    const status = computeRunStatus(
      run([
        step({ id: "software-review", status: "completed" }),
        step({
          id: "pricing-page",
          status: "completed-with-warning",
          required: false,
          failurePolicy: "continue-with-warning",
        }),
        step({ id: "editorial-approval", status: "waiting" }),
      ]),
    );
    expect(status).toBe("review-required");
  });
});
