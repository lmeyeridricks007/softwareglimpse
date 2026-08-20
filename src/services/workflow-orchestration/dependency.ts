import type { WorkflowRun, WorkflowStepRun, WorkflowStepStatus } from "@/domain";

const TERMINAL_OK: WorkflowStepStatus[] = [
  "completed",
  "completed-with-warning",
  "skipped",
];

const TERMINAL_FAIL: WorkflowStepStatus[] = ["failed", "cancelled"];

export function isOptionalContinuePolicy(step: WorkflowStepRun): boolean {
  return (
    !step.required &&
    (step.failurePolicy === "continue" ||
      step.failurePolicy === "continue-with-warning")
  );
}

export function isStepSatisfied(step: WorkflowStepRun): boolean {
  if (TERMINAL_OK.includes(step.status)) return true;
  if (
    isOptionalContinuePolicy(step) &&
    (step.status === "blocked" ||
      step.status === "review-required" ||
      step.status === "waiting" ||
      step.status === "failed")
  ) {
    return true;
  }
  return false;
}

export function isStepBlocking(step: WorkflowStepRun): boolean {
  if (TERMINAL_FAIL.includes(step.status) && step.required) return true;
  if (
    step.status === "failed" &&
    step.failurePolicy === "block-workflow"
  ) {
    return true;
  }
  return false;
}

/**
 * Mark steps READY when all dependencies are satisfied.
 * Independent steps may become ready together (parallel readiness).
 */
export function resolveStepReadiness(run: WorkflowRun): WorkflowRun {
  const byDef = new Map(run.steps.map((s) => [s.id, s]));
  // For expanded children, dependsOn refers to definition step ids of parents
  const steps = run.steps.map((step) => {
    if (
      TERMINAL_OK.includes(step.status) ||
      TERMINAL_FAIL.includes(step.status) ||
      step.status === "running" ||
      step.status === "review-required" ||
      step.status === "waiting" ||
      step.status === "stale" ||
      step.status === "cancelled"
    ) {
      return step;
    }

    const depsMet = step.dependsOn.every((depId) => {
      // Match parent definition id or exact step id
      const exact = byDef.get(depId);
      if (exact) return isStepSatisfied(exact);
      const parents = run.steps.filter(
        (s) => s.definitionStepId === depId || s.id === depId,
      );
      if (parents.length === 0) return false;
      return parents.every((p) => isStepSatisfied(p));
    });

    if (!depsMet) {
      return { ...step, status: "pending" as const };
    }

    if (step.status === "pending" || step.status === "blocked") {
      // Keep blocked if blockers already set from prior attempt with optional policy
      if (step.status === "blocked" && step.blockers.length > 0) {
        return step;
      }
      return { ...step, status: "ready" as const, blockers: [] };
    }

    return step;
  });

  return { ...run, steps };
}

export function listReadySteps(run: WorkflowRun): WorkflowStepRun[] {
  const priorityRank = { critical: 0, high: 1, normal: 2, low: 3 };
  return run.steps
    .filter((s) => s.status === "ready")
    .sort((a, b) => {
      // Prefer content generation over approval gates while peers are ready
      const aApproval = a.handler === "approval-check" ? 1 : 0;
      const bApproval = b.handler === "approval-check" ? 1 : 0;
      if (aApproval !== bApproval) return aApproval - bApproval;
      const pr = priorityRank[a.priority] - priorityRank[b.priority];
      if (pr !== 0) return pr;
      return a.id.localeCompare(b.id);
    });
}

export function listBlockedSteps(run: WorkflowRun): WorkflowStepRun[] {
  return run.steps.filter(
    (s) =>
      s.status === "blocked" ||
      (s.status === "pending" && s.blockers.length > 0),
  );
}

export function computeRunStatus(
  run: WorkflowRun,
): WorkflowRun["status"] {
  if (run.status === "cancelled" || run.status === "superseded") {
    return run.status;
  }

  const steps = run.steps;
  if (steps.some((s) => s.status === "running")) return "running";

  if (steps.some((s) => isStepBlocking(s))) return "failed";

  const requiredGate = steps.some(
    (s) =>
      s.required &&
      (s.status === "review-required" || s.status === "waiting"),
  );
  if (requiredGate) return "review-required";

  if (steps.some((s) => s.status === "blocked" && s.required)) {
    return "blocked";
  }

  const required = steps.filter((s) => s.required);
  const requiredDone = required.every((s) => isStepSatisfied(s));
  if (!requiredDone) {
    if (steps.some((s) => s.status === "ready")) return "running";
    if (steps.some((s) => s.status === "blocked")) return "blocked";
    return "running";
  }

  const optionalBlocked = steps.some(
    (s) =>
      !s.required &&
      (s.status === "blocked" || s.status === "failed" || s.status === "completed-with-warning"),
  );
  const warnings =
    optionalBlocked ||
    steps.some((s) => s.status === "completed-with-warning") ||
    run.warnings.length > 0;

  return warnings ? "completed-with-warnings" : "completed";
}
