import type { GuidePage } from "@/domain/schemas";
import { evaluateGuideIndexWorthiness } from "@/services/seo/guides-index-worthiness/evaluate";
import type { ImprovementReason } from "@/services/seo/content-lifecycle";
import { blueprintForType } from "./blueprints";
import { resolveCredibilitySignals } from "./credibility";
import { resolveDecisionSupportActions } from "./decision-support";
import { collectDataEnrichmentSignals } from "./enrich-context";
import { resolveGuideSearchIntent, type GscGuideSignal } from "./intent";
import { classifyEnrichmentGuideType } from "./taxonomy";
import { uniqueValueGap } from "./unique-value";
import type { EnrichmentPlan } from "./types";

/**
 * Build a type-specific enrichment plan for an existing guide URL.
 * Omits unsupported data sections; never proposes fabricated facts.
 */
export function planGuideEnrichment(
  guide: GuidePage,
  gsc?: GscGuideSignal | null,
): EnrichmentPlan {
  const enrichmentType = classifyEnrichmentGuideType(guide);
  const intent = resolveGuideSearchIntent(guide, gsc);
  const blueprint = blueprintForType(enrichmentType);
  const gap = uniqueValueGap(guide, enrichmentType);
  const dataSignals = collectDataEnrichmentSignals(guide);
  const credibility = resolveCredibilitySignals(guide);
  const decisionActions = resolveDecisionSupportActions(guide, intent);

  const evaluation = evaluateGuideIndexWorthiness(guide);
  const remediationFocus = (evaluation.improvementReasons ??
    []) as ImprovementReason[];

  const proposedBlockTypes: string[] = [];
  if (gap.missing.includes("decision_framework")) {
    proposedBlockTypes.push("decision-framework");
  }
  if (gap.missing.includes("product_shortlist")) {
    proposedBlockTypes.push("product-shortlist");
  }
  if (
    gap.missing.includes("pricing_comparison") &&
    dataSignals.hasPricing
  ) {
    proposedBlockTypes.push("cost-breakdown");
  }
  if (gap.missing.includes("buyer_checklist")) {
    proposedBlockTypes.push("selection-checklist");
  }
  if (gap.missing.includes("implementation_workflow")) {
    proposedBlockTypes.push("step");
  }
  if (gap.missing.includes("limitations_evidence")) {
    proposedBlockTypes.push("mistakes");
  }
  if (gap.missing.includes("tradeoff_table")) {
    proposedBlockTypes.push("comparison-framework");
  }
  if (decisionActions.some((a) => a.kind === "finder" || a.kind === "cost_calculator")) {
    proposedBlockTypes.push("interactive-cta");
  }

  // Drop proposed blocks whose data is unsupported
  const filteredBlocks = proposedBlockTypes.filter((t) => {
    if (t === "cost-breakdown" && !dataSignals.hasPricing) return false;
    if (t === "product-shortlist" && !dataSignals.hasAlternatives && guide.productSlugs.length === 0) {
      return false;
    }
    return true;
  });

  const notes: string[] = [];
  if (dataSignals.omittedUnsupported.length) {
    notes.push(
      `Omit unsupported: ${dataSignals.omittedUnsupported.slice(0, 8).join(", ")}`,
    );
  }
  if (!credibility.hasSources) {
    notes.push("No research sourceIds — skip fabricated citations");
  }
  notes.push(blueprint.notes);

  const canApplyDeterministically =
    guide.productSlugs.length === 1 &&
    (enrichmentType === "PRODUCT_EXPLAINER" ||
      enrichmentType === "IMPLEMENTATION_GUIDE" ||
      enrichmentType === "COST_GUIDE" ||
      enrichmentType === "MIGRATION_GUIDE" ||
      enrichmentType === "DECISION_GUIDE");

  return {
    slug: guide.slug,
    enrichmentType,
    intent,
    blueprint,
    uniqueValueRequired: gap.required,
    uniqueValuePresent: gap.present,
    uniqueValueMissing: gap.missing,
    dataSignals,
    credibility,
    decisionActions,
    proposedBlockTypes: filteredBlocks,
    remediationFocus,
    canApplyDeterministically,
    notes,
  };
}
