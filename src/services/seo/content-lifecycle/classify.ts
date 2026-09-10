import type { GuideGateId } from "@/services/seo/guides-index-worthiness/types";
import type { CompareGateId } from "@/services/seo/compare-index-worthiness/types";
import type {
  ContentLifecycleState,
  ImprovementReason,
} from "./types";
import { remediationForReasons } from "./remediation";

/**
 * Map legacy audit classification → lifecycle.
 * Former permanent NOINDEX classes become IMPROVE (preserve + remediate).
 */
export function lifecycleFromLegacyClass(
  classification:
    | "KEEP_INDEX"
    | "IMPROVE"
    | "NOINDEX"
    | "MERGE"
    | "REMOVE"
    | "REDIRECT"
    | "REVIEW_MANUALLY",
): ContentLifecycleState {
  switch (classification) {
    case "KEEP_INDEX":
      return "INDEXABLE";
    case "IMPROVE":
    case "NOINDEX":
      return "IMPROVE";
    case "REVIEW_MANUALLY":
    case "MERGE":
      return "MANUAL_REVIEW";
    case "REMOVE":
    case "REDIRECT":
      return "RETIRED";
    default:
      return "IMPROVE";
  }
}

export function improvementReasonsFromGuideGates(input: {
  failedGateIds: GuideGateId[];
  factoryPack: boolean;
  productExplainer: boolean;
  staleDataRisk?: "high" | "medium" | "low";
  softReasons?: string[];
}): ImprovementReason[] {
  const reasons = new Set<ImprovementReason>();
  const { failedGateIds, factoryPack, productExplainer } = input;

  if (factoryPack) reasons.add("TEMPLATE_HEAVY");
  if (productExplainer) {
    reasons.add("THIN_EXPLAINER");
    reasons.add("TEMPLATE_HEAVY");
  }

  for (const id of failedGateIds) {
    switch (id) {
      case "not_factory_boilerplate":
        reasons.add("TEMPLATE_HEAVY");
        break;
      case "unique_analysis":
        reasons.add("INSUFFICIENT_UNIQUE_VALUE");
        break;
      case "content_substance":
        reasons.add("THIN_EXPLAINER");
        break;
      case "internal_discoverability":
        reasons.add("MISSING_INTERNAL_LINKS");
        break;
      case "distinct_search_intent":
        reasons.add("DUPLICATE_INTENT");
        reasons.add("WEAK_SEARCH_INTENT");
        break;
      case "editorial_completeness":
        reasons.add("LOW_EVIDENCE");
        break;
      case "canonical_validity":
        reasons.add("OTHER");
        break;
      default:
        reasons.add("OTHER");
    }
  }

  if (input.staleDataRisk === "high") reasons.add("OUTDATED");

  const soft = (input.softReasons ?? []).join(" ").toLowerCase();
  if (soft.includes("pricing")) reasons.add("MISSING_PRICING");
  if (soft.includes("source") || soft.includes("evidence")) {
    reasons.add("MISSING_SOURCES");
  }
  if (
    soft.includes("semantic_template") ||
    soft.includes("semantic-template") ||
    soft.includes("interchangeable")
  ) {
    reasons.add("SEMANTIC_TEMPLATE_RISK");
  }

  if (reasons.size === 0 && failedGateIds.length > 0) {
    reasons.add("OTHER");
  }

  return [...reasons];
}

export function improvementReasonsFromCompareGates(input: {
  failedGateIds: CompareGateId[];
  relationshipKind: string;
  thinMesh?: boolean;
  staleDays?: number | null;
}): ImprovementReason[] {
  const reasons = new Set<ImprovementReason>();
  const { failedGateIds, relationshipKind } = input;

  if (
    relationshipKind === "same_category_only" ||
    relationshipKind === "cross_category_undeclared" ||
    relationshipKind === "missing_product"
  ) {
    reasons.add("WEAK_COMPARISON_RELATIONSHIP");
  }

  for (const id of failedGateIds) {
    switch (id) {
      case "meaningful_relationship":
        reasons.add("WEAK_COMPARISON_RELATIONSHIP");
        break;
      case "content_data_completeness":
        reasons.add("MISSING_PRODUCT_DATA");
        if (
          input.failedGateIds.includes("content_data_completeness")
        ) {
          reasons.add("MISSING_PRICING");
        }
        break;
      case "minimum_differentiation":
        reasons.add("INSUFFICIENT_UNIQUE_VALUE");
        if (input.thinMesh) reasons.add("TEMPLATE_HEAVY");
        break;
      case "decision_guidance":
        reasons.add("WEAK_DECISION_SUPPORT");
        break;
      case "internal_discoverability":
        reasons.add("MISSING_INTERNAL_LINKS");
        break;
      case "canonical_validity":
        reasons.add("OTHER");
        break;
      default:
        reasons.add("OTHER");
    }
  }

  if (input.staleDays != null && input.staleDays > 540) {
    reasons.add("OUTDATED");
  }

  if (reasons.size === 0 && failedGateIds.length > 0) {
    reasons.add("OTHER");
  }

  return [...reasons];
}

/**
 * Resolve final lifecycle for an evaluation, applying registry overrides
 * and INDEXABLE_READY when quality passes but index flag is not yet on.
 */
export function resolveLifecycleState(input: {
  legacyClassification:
    | "KEEP_INDEX"
    | "IMPROVE"
    | "NOINDEX"
    | "MERGE"
    | "REMOVE"
    | "REDIRECT"
    | "REVIEW_MANUALLY";
  qualityPasses: boolean;
  seedOrPromotedIndexable: boolean;
  registryLifecycle: ContentLifecycleState | null;
}): ContentLifecycleState {
  if (input.registryLifecycle === "RETIRED") return "RETIRED";
  if (input.registryLifecycle === "IMPROVING") return "IMPROVING";
  if (input.registryLifecycle === "READY_FOR_REVIEW") {
    return "READY_FOR_REVIEW";
  }
  // Manual-review triage may demote REVIEW_MANUALLY → IMPROVE (enrichment queue)
  // or retain MANUAL_REVIEW (weak / nonsensical / missing data).
  if (input.registryLifecycle === "IMPROVE") return "IMPROVE";
  if (input.registryLifecycle === "MANUAL_REVIEW") return "MANUAL_REVIEW";
  if (
    input.registryLifecycle === "INDEXABLE" &&
    input.seedOrPromotedIndexable
  ) {
    return "INDEXABLE";
  }

  if (input.qualityPasses) {
    if (input.seedOrPromotedIndexable) return "INDEXABLE";
    return "INDEXABLE_READY";
  }

  const derived = lifecycleFromLegacyClass(input.legacyClassification);
  if (derived === "INDEXABLE") {
    // Quality did not pass — should not happen, fall back to improve
    return "IMPROVE";
  }
  return derived;
}

export { remediationForReasons };
