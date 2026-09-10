import type {
  ManualReviewClass,
  ManualReviewDecision,
  RelationshipEvidencePack,
} from "./types";
import { hasHistoricalOrBuyerDemand } from "./classify";

/**
 * Phase 3 — map classification → operational decision.
 * Never delete. RETIRE candidate only when nonsensical AND no demand.
 * Do not auto-reject ambiguous (WEAK) pairs.
 */
export function decideManualReviewAction(
  classification: ManualReviewClass,
  pack: RelationshipEvidencePack,
): {
  decision: ManualReviewDecision;
  remediation: string[];
  retireEligible: boolean;
} {
  switch (classification) {
    case "DIRECT_COMPETITOR":
    case "ALTERNATIVE":
    case "CROSS_CATEGORY_DECISION":
    case "SPECIALIST_VS_GENERALIST":
      return {
        decision: "ENQUEUE_ENRICHMENT",
        remediation: [
          "enrich_decision_content",
          "ensure_buyer_thesis",
          "data_backed_comparison",
        ],
        retireEligible: false,
      };

    case "WEAK_RELATIONSHIP":
      return {
        decision: "LEAVE_IMPROVE_WITH_REMEDIATION",
        remediation: [
          "declare_competitive_relationship",
          "data_backed_comparison",
          "editorial_distinctness_review",
          "editorial_justification_before_promote",
          ...(pack.bestListCoOccurrence
            ? ["confirm_best_list_intent"]
            : []),
        ],
        retireEligible: false,
      };

    case "MISSING_DATA":
      return {
        decision: "BLOCK_PENDING_CATALOGUE",
        remediation: [
          "onboard_missing_product",
          "catalogue_data_remediation",
          "re_run_manual_review_after_catalogue",
        ],
        retireEligible: false,
      };

    case "NONSENSICAL": {
      const demand = hasHistoricalOrBuyerDemand(pack);
      if (demand) {
        return {
          decision: "PRESERVE_NOINDEX_REVIEW",
          remediation: [
            "investigate_demand_source",
            "editorial_distinctness_review",
            "preserve_route_no_promote",
          ],
          retireEligible: false,
        };
      }
      return {
        decision: "CANDIDATE_RETIRE_NOINDEX",
        remediation: [
          "confirm_no_historical_demand",
          "confirm_no_backlinks",
          "preserve_route_pending_signoff",
          "retire_or_noindex_after_editorial_signoff",
        ],
        retireEligible: true,
      };
    }

    default:
      return {
        decision: "PRESERVE_NOINDEX_REVIEW",
        remediation: ["editorial_review"],
        retireEligible: false,
      };
  }
}
