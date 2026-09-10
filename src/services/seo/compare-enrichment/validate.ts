import type { Comparison } from "@/domain/schemas";
import { canPromoteToIndexable } from "@/services/seo/content-lifecycle";
import { comparisonPassesPromotionGates } from "@/services/seo/content-lifecycle/promote";
import { promoteAndPersist } from "@/services/seo/content-lifecycle/promote-persist";
import type { SoftLookup } from "@/services/seo/compare-index-worthiness/relationship";
import { checkComparisonDifferentiation } from "./differentiation";
import { runCompareEnrichmentQa } from "./qa";
import { planCompareEnrichment } from "./plan";
import type { CapabilityCompareRow, EvidencePairSummary } from "./types";

export type CompareEnrichmentPromotionDecision = {
  slug: string;
  ok: boolean;
  promoted: boolean;
  reasons: string[];
};

/**
 * After enrichment: intent + QA + differentiation + promotion gates.
 * Never fake quality — leave URL intact on failure.
 */
export function validateAndMaybePromoteComparison(
  comparison: Comparison,
  soft: SoftLookup,
  opts: {
    peerComparisons?: Comparison[];
    promote?: boolean;
    capabilityRows?: CapabilityCompareRow[];
    evidence?: EvidencePairSummary | null;
  } = {},
): CompareEnrichmentPromotionDecision {
  const reasons: string[] = [];
  const plan = planCompareEnrichment(comparison, soft);

  if (!plan.intentValid) {
    reasons.push(`Intent invalid: relationship ${plan.relationshipKind}`);
  }
  if (plan.uniqueMissing.length > 0) {
    reasons.push(
      `Decision value incomplete: missing ${plan.uniqueMissing.join(", ")}`,
    );
  }

  const qa = runCompareEnrichmentQa(
    comparison,
    soft,
    opts.peerComparisons,
    {
      capabilityRows: opts.capabilityRows ?? plan.capabilityRows,
      evidence: opts.evidence ?? plan.evidence,
    },
  );
  if (!qa.ok) {
    reasons.push(
      ...qa.findings
        .filter((f) => f.severity === "block")
        .map((f) => `${f.code}: ${f.detail}`),
    );
  }

  const diff = checkComparisonDifferentiation(
    comparison,
    opts.peerComparisons ?? [],
  );
  if (!diff.ok) {
    reasons.push(
      ...diff.findings
        .filter((f) => f.severity === "block")
        .map((f) => `${f.code}: ${f.detail}`),
    );
  }

  const gates = comparisonPassesPromotionGates(comparison, soft, {
    peers: opts.peerComparisons,
    persistSemanticHistory: opts.promote === true,
  });
  if (!gates.ok) {
    reasons.push(...gates.detail.map((d) => `gate:${d}`));
  }
  if (gates.semantic?.blocksAutoPromotion) {
    reasons.push(`SEMANTIC_TEMPLATE_RISK: ${gates.semantic.promotionReason}`);
  }

  if (reasons.length > 0) {
    return { slug: comparison.slug, ok: false, promoted: false, reasons };
  }

  if (!opts.promote) {
    return {
      slug: comparison.slug,
      ok: true,
      promoted: false,
      reasons: ["INDEXABLE_READY — promote flag not set"],
    };
  }

  const decision = canPromoteToIndexable({
    kind: "comparison",
    entity: comparison,
    soft,
    peers: opts.peerComparisons,
  });
  if (!decision.ok) {
    return {
      slug: comparison.slug,
      ok: false,
      promoted: false,
      reasons: decision.detail,
    };
  }

  const result = promoteAndPersist({
    kind: "comparison",
    entity: comparison,
    soft,
    peers: opts.peerComparisons,
  });
  return {
    slug: comparison.slug,
    ok: result.ok,
    promoted: result.ok,
    reasons: result.detail,
  };
}
