import type { WorkflowDefinition, WorkflowHandlerId } from "@/domain";
import { WorkflowHandlerIdSchema } from "@/domain";

export type WorkflowDefinitionIssue = {
  severity: "error" | "warning";
  code: string;
  message: string;
};

export function validateWorkflowDefinition(
  definition: WorkflowDefinition,
): WorkflowDefinitionIssue[] {
  const issues: WorkflowDefinitionIssue[] = [];
  const ids = new Set<string>();

  for (const step of definition.steps) {
    if (ids.has(step.id)) {
      issues.push({
        severity: "error",
        code: "DUPLICATE_STEP_ID",
        message: `Duplicate step id: ${step.id}`,
      });
    }
    ids.add(step.id);

    const handlerOk = WorkflowHandlerIdSchema.safeParse(step.handler);
    if (!handlerOk.success) {
      issues.push({
        severity: "error",
        code: "UNKNOWN_HANDLER",
        message: `Unknown handler ${step.handler} on step ${step.id}`,
      });
    }

    for (const dep of step.dependsOn) {
      if (!definition.steps.some((s) => s.id === dep)) {
        issues.push({
          severity: "error",
          code: "MISSING_DEPENDENCY",
          message: `Step ${step.id} depends on unknown step ${dep}`,
        });
      }
    }

    if (
      step.failurePolicy === "manual-review" &&
      !step.approval &&
      step.handler !== "approval-check"
    ) {
      issues.push({
        severity: "warning",
        code: "MANUAL_REVIEW_WITHOUT_APPROVAL",
        message: `Step ${step.id} uses manual-review without approval policy`,
      });
    }

    if (step.handler === "agent-run" && !step.config.agentId && step.id !== "generate" && step.id !== "comparisons" && step.id !== "use-cases") {
      // comparisons/use-cases/generate get agentId from expansion/input
      if (!step.config.expandFromContentPlan) {
        issues.push({
          severity: "warning",
          code: "AGENT_ID_MISSING",
          message: `agent-run step ${step.id} has no agentId in config`,
        });
      }
    }
  }

  const cycle = detectCycle(definition);
  if (cycle) {
    issues.push({
      severity: "error",
      code: "DEPENDENCY_CYCLE",
      message: `Dependency cycle detected: ${cycle.join(" → ")}`,
    });
  }

  return issues;
}

export function detectCycle(
  definition: WorkflowDefinition,
): string[] | null {
  const graph = new Map(
    definition.steps.map((s) => [s.id, s.dependsOn] as const),
  );
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const stack: string[] = [];

  function dfs(node: string): string[] | null {
    if (visiting.has(node)) {
      const idx = stack.indexOf(node);
      return [...stack.slice(idx), node];
    }
    if (visited.has(node)) return null;
    visiting.add(node);
    stack.push(node);
    for (const dep of graph.get(node) ?? []) {
      const c = dfs(dep);
      if (c) return c;
    }
    stack.pop();
    visiting.delete(node);
    visited.add(node);
    return null;
  }

  for (const id of graph.keys()) {
    const c = dfs(id);
    if (c) return c;
  }
  return null;
}

export function assertKnownHandler(id: WorkflowHandlerId): void {
  WorkflowHandlerIdSchema.parse(id);
}
