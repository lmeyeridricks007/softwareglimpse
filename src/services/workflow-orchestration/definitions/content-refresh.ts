import {
  WorkflowDefinitionSchema,
  type WorkflowDefinition,
} from "@/domain";

export const contentRefreshWorkflow: WorkflowDefinition =
  WorkflowDefinitionSchema.parse({
    id: "content-refresh",
    version: "1.0.0",
    name: "Content Refresh",
    targetType: "refresh",
    completionPolicy: {
      requireAllRequired: true,
      allowOptionalBlocked: true,
      stopAfterApproval: true,
      publishAfterApproval: false,
    },
    steps: [
      {
        id: "refresh-agent",
        handler: "agent-run",
        required: true,
        failurePolicy: "block-workflow",
        priority: "high",
        label: "Refresh Agent",
        config: { agentId: "refresh-agent", maxAutomaticRevisions: 1 },
      },
      {
        id: "editorial-approval",
        handler: "approval-check",
        dependsOn: ["refresh-agent"],
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
