import type { WorkflowDefinitionIssue } from "./validate-definition";
import { validateWorkflowDefinition } from "./validate-definition";
import { listWorkflowDefinitions } from "./definitions";
import { listHandlers, hasHandler } from "./handlers/types";
import "./handlers";

export type WorkflowValidationReport = {
  ok: boolean;
  issues: WorkflowDefinitionIssue[];
  definitionCount: number;
  handlerCount: number;
};

export function validateWorkflowOrchestration(): WorkflowValidationReport {
  const issues: WorkflowDefinitionIssue[] = [];
  const defs = listWorkflowDefinitions();

  for (const def of defs) {
    issues.push(...validateWorkflowDefinition(def));
    for (const step of def.steps) {
      if (!hasHandler(step.handler)) {
        issues.push({
          severity: "error",
          code: "HANDLER_NOT_REGISTERED",
          message: `${def.id}/${step.id}: handler ${step.handler} not registered`,
        });
      }
    }
  }

  const handlers = listHandlers();
  if (handlers.length < 10) {
    issues.push({
      severity: "warning",
      code: "FEW_HANDLERS",
      message: `Only ${handlers.length} handlers registered`,
    });
  }

  return {
    ok: issues.filter((i) => i.severity === "error").length === 0,
    issues,
    definitionCount: defs.length,
    handlerCount: handlers.length,
  };
}
