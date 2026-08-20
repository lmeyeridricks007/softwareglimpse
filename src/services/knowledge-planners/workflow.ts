import {
  SupportingContentWorkflowInputSchema,
  type SupportingContentWorkflowInput,
  type WorkflowRun,
} from "@/domain";
import { planCategoryKnowledge } from "./category-planner";
import { evaluateSupportingTopic } from "./supporting-planner";
import { createSingleContentWorkflow } from "@/services/workflow-orchestration/engine";

/**
 * Create a controlled supporting-content workflow from a topic candidate id.
 * NEW_PAGE → GuideAgent via single-content-generation.
 * ADD_SECTION / EXPAND → refresh-agent task (not a new URL).
 * REJECT → no workflow.
 */
export function createSupportingContentWorkflow(
  input: SupportingContentWorkflowInput,
): {
  action: string;
  workflow?: WorkflowRun;
  message: string;
  decision?: ReturnType<typeof evaluateSupportingTopic>;
} {
  const parsed = SupportingContentWorkflowInputSchema.parse(input);
  const categorySlug =
    parsed.categorySlug ??
    parsed.supportingTopicId.split(":")[0]?.replace(/^candidate-?/, "") ??
    "crm";

  // Resolve candidate from latest category plan or live planner
  const plan = planCategoryKnowledge(
    categorySlug.includes("email") ? "email-marketing" : categorySlug === "crm" || parsed.categorySlug === "crm"
      ? parsed.categorySlug ?? "crm"
      : parsed.categorySlug ?? "crm",
  );

  const topicId = parsed.supportingTopicId.startsWith("candidate:")
    ? parsed.supportingTopicId
    : `candidate:${parsed.supportingTopicId}`;

  const candidate =
    plan.topicCandidates.find((c) => c.id === topicId) ??
    plan.topicCandidates.find(
      (c) =>
        c.id.endsWith(parsed.supportingTopicId) ||
        c.suggestedSlug === parsed.supportingTopicId,
    );

  if (!candidate) {
    return {
      action: "noop",
      message: `Supporting topic not found: ${parsed.supportingTopicId}`,
    };
  }

  const decision = evaluateSupportingTopic(candidate);

  if (decision.workflowAction === "reject" || decision.workflowAction === "noop") {
    return {
      action: decision.workflowAction,
      decision,
      message: `No workflow: ${decision.reasons.join("; ")}`,
    };
  }

  if (decision.workflowAction === "manual-review") {
    return {
      action: "manual-review",
      decision,
      message: `Manual review required: ${decision.reasons.join("; ")}`,
    };
  }

  if (
    decision.workflowAction === "refresh-existing" ||
    decision.workflowAction === "add-section"
  ) {
    const target =
      decision.expandTargetSlug ?? candidate.expandTargetSlug ?? candidate.suggestedSlug;
    if (parsed.dryRun) {
      return {
        action: decision.workflowAction,
        decision,
        message: `Would create refresh-agent task for ${target} (dry-run)`,
      };
    }
    const workflow = createSingleContentWorkflow({
      agentId: "refresh-agent",
      targetSlug: target,
      options: { dryRun: false },
    });
    return {
      action: decision.workflowAction,
      decision,
      workflow,
      message: `Created refresh workflow ${workflow.id} for ${target}`,
    };
  }

  // create-guide
  if (parsed.dryRun) {
    return {
      action: "create-guide",
      decision,
      message: `Would create guide-agent workflow for ${candidate.suggestedSlug} (dry-run)`,
    };
  }

  const workflow = createSingleContentWorkflow({
    agentId: "guide-agent",
    targetSlug: candidate.suggestedSlug,
    options: { dryRun: false },
  });

  return {
    action: "create-guide",
    decision,
    workflow,
    message: `Created guide workflow ${workflow.id} for ${candidate.suggestedSlug}`,
  };
}

/** Plan CORE supporting workflows without executing. */
export function planCoreSupportingWorkflows(categorySlug: string) {
  const plan = planCategoryKnowledge(categorySlug);
  return plan.topicCandidates
    .filter(
      (c) =>
        c.priorityClass === "CORE" &&
        c.placement === "NEW_PAGE" &&
        c.readiness === "ready",
    )
    .map((c) => ({
      supportingTopicId: c.id,
      titleConcept: c.titleConcept,
      suggestedSlug: c.suggestedSlug,
      decision: evaluateSupportingTopic(c),
    }));
}
