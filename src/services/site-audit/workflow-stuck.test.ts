import { describe, expect, it } from "vitest";
import type { WorkflowRun, WorkflowStepRun } from "@/domain";
import { isWorkflowStuck } from "./checks/affiliate-ops";

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

function run(
  partial: Partial<WorkflowRun> & Pick<WorkflowRun, "status" | "steps">,
): WorkflowRun {
  return {
    id: "wf-test",
    workflowId: "software-onboarding-content",
    workflowVersion: "1.0.0",
    name: "test",
    targetType: "software",
    targetId: "aweber",
    history: [],
    options: {},
    warnings: [],
    createdAt: "2026-08-17T12:00:00.000Z",
    updatedAt: "2026-08-17T12:00:00.000Z",
    ...partial,
  };
}

describe("isWorkflowStuck", () => {
  const now = Date.parse("2026-08-18T10:00:00.000Z");

  it("flags optional review-required that parked the run immediately", () => {
    expect(
      isWorkflowStuck(
        run({
          status: "review-required",
          steps: [
            step({ id: "software-review", status: "completed" }),
            step({
              id: "pricing-page",
              status: "review-required",
              required: false,
              failurePolicy: "continue-with-warning",
            }),
            step({ id: "editorial-approval", status: "ready" }),
          ],
        }),
        now,
      ),
    ).toBe(true);
  });

  it("does not flag a fresh required editorial wait", () => {
    expect(
      isWorkflowStuck(
        run({
          status: "review-required",
          updatedAt: "2026-08-18T09:30:00.000Z",
          steps: [
            step({ id: "software-review", status: "completed" }),
            step({ id: "editorial-approval", status: "waiting" }),
          ],
        }),
        now,
      ),
    ).toBe(false);
  });

  it("flags a required editorial wait after stuckAfterMs", () => {
    expect(
      isWorkflowStuck(
        run({
          status: "review-required",
          updatedAt: "2026-08-16T10:00:00.000Z",
          steps: [
            step({ id: "editorial-approval", status: "waiting" }),
          ],
        }),
        now,
      ),
    ).toBe(true);
  });
});
