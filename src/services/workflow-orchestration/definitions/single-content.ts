import {
  WorkflowDefinitionSchema,
  type WorkflowDefinition,
} from "@/domain";

export const singleContentGenerationWorkflow: WorkflowDefinition =
  WorkflowDefinitionSchema.parse({
    id: "single-content-generation",
    version: "1.0.0",
    name: "Single Content Generation",
    targetType: "content",
    completionPolicy: {
      requireAllRequired: true,
      allowOptionalBlocked: false,
      stopAfterApproval: true,
      publishAfterApproval: false,
    },
    steps: [
      {
        id: "content-readiness",
        handler: "noop",
        required: true,
        failurePolicy: "block-workflow",
        priority: "high",
        label: "Content readiness",
        config: {},
      },
      {
        id: "generate",
        handler: "agent-run",
        dependsOn: ["content-readiness"],
        required: true,
        failurePolicy: "block-workflow",
        priority: "high",
        label: "Generate content",
        approval: { type: "editorial", required: true },
        config: { maxAutomaticRevisions: 1 },
      },
      {
        id: "editorial-approval",
        handler: "approval-check",
        dependsOn: ["generate"],
        required: true,
        failurePolicy: "manual-review",
        priority: "critical",
        label: "Editorial approval",
        approval: { type: "editorial", required: true },
        config: { approvalType: "editorial", stopAfterApproval: true },
      },
      {
        id: "pre-publish-validation",
        handler: "pre-publish-validation",
        dependsOn: ["editorial-approval"],
        required: true,
        failurePolicy: "block-workflow",
        priority: "critical",
        label: "Pre-publish validation",
        config: {},
      },
    ],
  });
