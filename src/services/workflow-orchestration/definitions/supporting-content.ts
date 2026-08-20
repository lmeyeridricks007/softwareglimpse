import {
  WorkflowDefinitionSchema,
  type WorkflowDefinition,
} from "@/domain";

/**
 * supporting-content:v1 — controlled guide creation from accepted topic candidates.
 * Does not mass-generate. Stops at editorial approval.
 */
export const supportingContentWorkflow: WorkflowDefinition =
  WorkflowDefinitionSchema.parse({
    id: "supporting-content",
    version: "1.0.0",
    name: "Supporting Content Generation",
    targetType: "content",
    completionPolicy: {
      requireAllRequired: true,
      allowOptionalBlocked: false,
      stopAfterApproval: true,
      publishAfterApproval: false,
    },
    steps: [
      {
        id: "topic-validation",
        handler: "noop",
        required: true,
        failurePolicy: "block-workflow",
        priority: "high",
        label: "Duplicate / intent validation",
        config: {},
      },
      {
        id: "research-readiness",
        handler: "noop",
        dependsOn: ["topic-validation"],
        required: true,
        failurePolicy: "block-workflow",
        priority: "high",
        label: "Research readiness",
        config: {},
      },
      {
        id: "generate",
        handler: "agent-run",
        dependsOn: ["research-readiness"],
        required: true,
        failurePolicy: "block-workflow",
        priority: "high",
        label: "Guide Agent",
        approval: { type: "editorial", required: true },
        config: { maxAutomaticRevisions: 1, defaultAgentId: "guide-agent" },
      },
      {
        id: "internal-links",
        handler: "internal-link",
        dependsOn: ["generate"],
        required: false,
        failurePolicy: "continue",
        priority: "normal",
        label: "Internal link plan",
        config: {},
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
