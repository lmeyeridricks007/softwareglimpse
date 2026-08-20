import type {
  SupportingContentDecision,
  SupportingTopicCandidate,
} from "@/domain";
import { SupportingContentDecisionSchema } from "@/domain";
import {
  getGuideBySlug,
} from "@/data/repositories/guides";
import { decideTopicPlacement } from "@/services/content-clusters";
import type { SupportingTopicConcept } from "@/domain";

/**
 * SupportingContentPlanner — page/section/reject decisions with evidence.
 */
export function evaluateSupportingTopic(
  candidate: SupportingTopicCandidate,
): SupportingContentDecision {
  const reasons = [candidate.placementReason, ...candidate.evidence.notes];

  let recommendation = candidate.placement;
  let nextAgentId: SupportingContentDecision["nextAgentId"] = "none";
  let workflowAction: SupportingContentDecision["workflowAction"] = "noop";

  // Micro / not recommended
  if (
    candidate.priorityClass === "NOT_RECOMMENDED" ||
    candidate.readiness === "not-recommended"
  ) {
    recommendation = "REJECT";
    workflowAction = "reject";
    reasons.push("Rejected: insufficient standalone value or NOT_RECOMMENDED");
  } else if (candidate.readiness === "duplicate") {
    recommendation = "EXPAND_EXISTING_PAGE";
    nextAgentId = "refresh-agent";
    workflowAction = "refresh-existing";
    reasons.push("Duplicate intent — expand canonical guide");
  } else if (candidate.placement === "ADD_SECTION") {
    recommendation = "ADD_SECTION";
    nextAgentId = "refresh-agent";
    workflowAction = "add-section";
    reasons.push("Add section to existing page — do not create URL");
  } else if (candidate.placement === "EXPAND_EXISTING_PAGE") {
    recommendation = "EXPAND_EXISTING_PAGE";
    nextAgentId = "refresh-agent";
    workflowAction = "refresh-existing";
  } else if (candidate.placement === "NEW_PAGE" && candidate.readiness === "ready") {
    recommendation = "NEW_PAGE";
    nextAgentId = "guide-agent";
    workflowAction = "create-guide";
  } else if (
    candidate.placement === "NEW_PAGE" &&
    candidate.readiness === "research-required"
  ) {
    recommendation = "MANUAL_REVIEW";
    workflowAction = "manual-review";
    reasons.push("Research required before GuideAgent");
  } else if (candidate.readiness === "exists") {
    recommendation = "NO_ACTION";
    workflowAction = "noop";
    reasons.push("Guide already exists");
  } else {
    recommendation = candidate.placement === "NO_ACTION" ? "REJECT" : "MANUAL_REVIEW";
    workflowAction =
      recommendation === "REJECT" ? "reject" : "manual-review";
  }

  // Registry duplicate: pricing intent owned by pricing page
  if (
    candidate.topicType === "pricing-education" &&
    candidate.productSlugs[0] &&
    candidate.suggestedSlug.includes("pricing-guide")
  ) {
    recommendation = "REJECT";
    workflowAction = "reject";
    nextAgentId = "none";
    reasons.push(
      `Canonical intent owned by pricing:${candidate.productSlugs[0]}`,
    );
  }

  const primaryAnchor =
    candidate.supports.find((s) => s.relationType === "supports-anchor")
      ?.contentId ?? candidate.supports[0]?.contentId;

  return SupportingContentDecisionSchema.parse({
    candidateId: candidate.id,
    recommendation,
    primaryAnchorContentId: primaryAnchor,
    expandTargetSlug: candidate.expandTargetSlug ?? candidate.existingGuideSlug,
    reasons: [...new Set(reasons.filter(Boolean))],
    nextAgentId,
    workflowAction,
    plannerVersion: "1.0.0",
  });
}

export function planSupportingContentDecisions(
  candidates: SupportingTopicCandidate[],
): SupportingContentDecision[] {
  return candidates.map(evaluateSupportingTopic);
}

/** Helper for concept-level POC fixtures */
export function evaluateConceptPlacement(
  concept: SupportingTopicConcept,
  existingSlugs: string[],
) {
  const placement = decideTopicPlacement(concept, new Set(existingSlugs));
  const existingGuide = placement.expandTargetSlug
    ? getGuideBySlug(placement.expandTargetSlug, { includeUnpublished: true })
    : undefined;
  return { ...placement, existingGuideTitle: existingGuide?.title };
}

export function supportingContentPlannerReadiness(): {
  status: "READY" | "BLOCKED" | "REVIEW_REQUIRED";
  reasons: { code: string; message: string; critical: boolean }[];
} {
  return { status: "READY", reasons: [] };
}
