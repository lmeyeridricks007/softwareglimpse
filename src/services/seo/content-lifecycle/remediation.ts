import type {
  ImprovementReason,
  RemediationRequirement,
} from "./types";

/**
 * Explicit remediation requirements for each improvement reason.
 * Multiple reasons → union of requirements.
 */
export const REMEDIATION_BY_REASON: Record<
  ImprovementReason,
  RemediationRequirement[]
> = {
  INSUFFICIENT_UNIQUE_VALUE: [
    "product_specific_analysis",
    "data_backed_comparison",
    "unique_scenarios",
    "category_specific_guidance",
  ],
  TEMPLATE_HEAVY: [
    "product_specific_analysis",
    "data_backed_comparison",
    "category_specific_guidance",
    "unique_scenarios",
    "pricing",
    "evidence_sources",
  ],
  SEMANTIC_TEMPLATE_RISK: [
    "product_specific_analysis",
    "unique_scenarios",
    "editorial_distinctness_review",
    "strengthen_verdict_and_best_for",
    "category_specific_guidance",
  ],
  WEAK_SEARCH_INTENT: [
    "editorial_distinctness_review",
    "category_specific_guidance",
    "unique_scenarios",
  ],
  MISSING_PRICING: ["pricing"],
  MISSING_PRODUCT_DATA: ["add_product_data_coverage", "data_backed_comparison"],
  WEAK_DECISION_SUPPORT: [
    "strengthen_verdict_and_best_for",
    "unique_scenarios",
    "category_specific_guidance",
  ],
  MISSING_INTERNAL_LINKS: [
    "relevant_incoming_links",
    "relevant_hub_membership",
    "contextual_outgoing_links",
  ],
  THIN_EXPLAINER: [
    "product_specific_analysis",
    "category_specific_guidance",
    "unique_scenarios",
    "evidence_sources",
  ],
  WEAK_COMPARISON_RELATIONSHIP: [
    "declare_competitive_relationship",
    "data_backed_comparison",
    "editorial_distinctness_review",
  ],
  OUTDATED: ["refresh_stale_data", "pricing", "evidence_sources"],
  MISSING_SOURCES: ["evidence_sources"],
  LOW_EVIDENCE: ["evidence_sources", "data_backed_comparison"],
  DUPLICATE_INTENT: [
    "editorial_distinctness_review",
    "merge_or_retire_duplicate",
  ],
  OTHER: ["editorial_distinctness_review"],
};

export function remediationForReasons(
  reasons: ImprovementReason[],
): RemediationRequirement[] {
  const set = new Set<RemediationRequirement>();
  for (const reason of reasons) {
    for (const req of REMEDIATION_BY_REASON[reason] ?? []) {
      set.add(req);
    }
  }
  return [...set];
}
