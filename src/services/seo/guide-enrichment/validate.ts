import type { GuidePage } from "@/domain/schemas";
import {
  canPromoteToIndexable,
  upsertLifecycleEntry,
} from "@/services/seo/content-lifecycle";
import { guidePassesPromotionGates } from "@/services/seo/content-lifecycle/promote";
import { promoteAndPersist } from "@/services/seo/content-lifecycle/promote-persist";
import {
  assessGuideSemanticTemplateRisk,
  recordSemanticEnrichmentPair,
  type SemanticPromotionOutcome,
} from "@/services/content-quality/gate/semantic-template";
import { runEnrichmentQa } from "./qa";
import { uniqueValueGap } from "./unique-value";
import { classifyEnrichmentGuideType } from "./taxonomy";

export type EnrichmentPromotionDecision = {
  slug: string;
  ok: boolean;
  promoted: boolean;
  reasons: string[];
  semanticOutcome?: SemanticPromotionOutcome;
};

/**
 * After enrichment: QA + unique value + promotion gates.
 * Never fake quality — leave URL intact on failure.
 * High semantic-template risk → stay IMPROVE or MANUAL_REVIEW (no auto-promote).
 */
export function validateAndMaybePromoteGuide(
  guide: GuidePage,
  opts: {
    peerGuides?: GuidePage[];
    promote?: boolean;
    beforeAssessment?: ReturnType<typeof assessGuideSemanticTemplateRisk>;
    persistSemanticHistory?: boolean;
  } = {},
): EnrichmentPromotionDecision {
  const reasons: string[] = [];
  const peers = opts.peerGuides ?? [];
  const type = classifyEnrichmentGuideType(guide);
  const gap = uniqueValueGap(guide, type);
  if (!gap.sufficient) {
    reasons.push(
      `Unique value incomplete: missing ${gap.missing.join(", ") || "minimum elements"}`,
    );
  }

  const qa = runEnrichmentQa(guide, peers);
  if (!qa.ok) {
    reasons.push(
      ...qa.findings
        .filter((f) => f.severity === "block")
        .map((f) => `${f.code}: ${f.detail}`),
    );
  }

  const afterSemantic =
    opts.beforeAssessment != null
      ? assessGuideSemanticTemplateRisk(guide, peers)
      : undefined;

  const gates = guidePassesPromotionGates(guide, {
    peers,
    persistSemanticHistory:
      opts.persistSemanticHistory === true || opts.promote === true,
  });
  if (!gates.ok) {
    reasons.push(...gates.detail.map((d) => `gate:${d}`));
  }

  const semantic = gates.semantic ?? afterSemantic;
  if (semantic?.blocksAutoPromotion) {
    reasons.push(`SEMANTIC_TEMPLATE_RISK: ${semantic.promotionReason}`);
  }

  const blockedBySemantic = Boolean(semantic?.blocksAutoPromotion);

  if (reasons.length > 0) {
    const outcome: SemanticPromotionOutcome = blockedBySemantic
      ? "blocked_manual_review"
      : "blocked_improve";

    if (opts.promote && blockedBySemantic) {
      upsertLifecycleEntry({
        kind: "guide",
        slug: guide.slug,
        lifecycle: "MANUAL_REVIEW",
        indexable: false,
        previousLifecycle: "IMPROVE",
        passedReasons: [],
        notes: `Semantic template risk — ${semantic?.riskSignals.join(", ") ?? "SEMANTIC_TEMPLATE_RISK"}`,
        updatedAt: new Date().toISOString(),
      });
    }

    if (opts.beforeAssessment && semantic) {
      recordSemanticEnrichmentPair({
        before: opts.beforeAssessment,
        after: semantic,
        pageType: "guide",
        promotionOutcome: outcome,
        persist: opts.persistSemanticHistory !== false && opts.promote === true,
      });
    }

    return {
      slug: guide.slug,
      ok: false,
      promoted: false,
      reasons,
      semanticOutcome: outcome,
    };
  }

  if (!opts.promote) {
    if (opts.beforeAssessment && semantic) {
      recordSemanticEnrichmentPair({
        before: opts.beforeAssessment,
        after: semantic,
        pageType: "guide",
        promotionOutcome: "cleared_not_promoted",
        persist: opts.persistSemanticHistory === true,
      });
    }
    return {
      slug: guide.slug,
      ok: true,
      promoted: false,
      reasons: ["INDEXABLE_READY — promote flag not set"],
      semanticOutcome: "cleared_not_promoted",
    };
  }

  const decision = canPromoteToIndexable({
    kind: "guide",
    entity: guide,
    peers,
  });
  if (!decision.ok) {
    return {
      slug: guide.slug,
      ok: false,
      promoted: false,
      reasons: decision.detail,
      semanticOutcome:
        decision.lifecycle === "MANUAL_REVIEW"
          ? "blocked_manual_review"
          : "blocked_improve",
    };
  }

  // Persist each successful promote so mid-batch linking/gates cannot lose it.
  const result = promoteAndPersist({
    kind: "guide",
    entity: guide,
    peers,
  });

  if (opts.beforeAssessment && semantic) {
    recordSemanticEnrichmentPair({
      before: opts.beforeAssessment,
      after: semantic,
      pageType: "guide",
      promotionOutcome: result.ok ? "promoted" : "blocked_improve",
      persist: true,
    });
  }

  return {
    slug: guide.slug,
    ok: result.ok,
    promoted: result.ok,
    reasons: result.detail,
    semanticOutcome: result.ok ? "promoted" : "blocked_improve",
  };
}
