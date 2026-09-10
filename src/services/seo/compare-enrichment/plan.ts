import type { Comparison, Software } from "@/domain/schemas";
import {
  resolveComparisonRelationship,
  type SoftLookup,
} from "@/services/seo/compare-index-worthiness/relationship";
import { improvementReasonsFromCompareGates } from "@/services/seo/content-lifecycle/classify";
import { buildCapabilityCompareRows } from "./capability-table";
import { buildDecisionContentDraft } from "./decision-content";
import { resolveComparisonEvidence } from "./evidence";
import { buildPricingDiffSummary } from "./pricing";
import { resolveComparisonThesis } from "./thesis";
import type {
  CompareEnrichmentPlan,
  UniqueDecisionElement,
} from "./types";

function detectPresent(
  comparison: Comparison,
  draft: ReturnType<typeof buildDecisionContentDraft>,
  rows: ReturnType<typeof buildCapabilityCompareRows>,
): UniqueDecisionElement[] {
  const present: UniqueDecisionElement[] = [];
  if (comparison.verdict?.trim() || draft.quickVerdict.trim()) {
    present.push("quick_verdict");
  }
  if (
    draft.chooseAIf.length + draft.chooseBIf.length >= 2 ||
    (comparison.bestFor?.some((bf) => bf.scenarios.length > 0) ?? false)
  ) {
    present.push("choose_if_rules");
  }
  if (draft.keyDifferences.length > 0) present.push("key_differences");
  if (draft.pricingDifferences.length > 0 || comparison.pricingNotes?.trim()) {
    present.push("pricing_diff");
  }
  if (rows.length >= 2) present.push("capability_table");
  if (draft.targetCompany.length > 0) present.push("target_audience");
  if (
    draft.bestFitScenarios.length > 0 ||
    (comparison.scenarioRecommendations?.length ?? 0) > 0 ||
    (comparison.bestFor?.some((bf) => (bf.scenarios?.length ?? 0) > 0) ?? false)
  ) {
    present.push("scenario_fit");
  }
  present.push("evidence_clarity");
  if (draft.alternatives.length > 0) present.push("alternatives");
  if (draft.finalRecommendation.trim()) present.push("final_recommendation");
  return [...new Set(present)];
}

const REQUIRED: UniqueDecisionElement[] = [
  "quick_verdict",
  "choose_if_rules",
  "key_differences",
  "scenario_fit",
  "final_recommendation",
];

export function planCompareEnrichment(
  comparison: Comparison,
  soft: SoftLookup,
): CompareEnrichmentPlan {
  const rel = resolveComparisonRelationship(comparison, soft);
  const [slugA, slugB] = comparison.productSlugs;
  const a = soft.get(slugA ?? "") as Software | undefined;
  const b = soft.get(slugB ?? "") as Software | undefined;
  const notes: string[] = [];

  if (!a || !b) {
    return {
      slug: comparison.slug,
      productA: slugA ?? "",
      productB: slugB ?? "",
      relationshipKind: rel.kind,
      intentValid: false,
      thesis: null,
      capabilityRows: [],
      pricing: {
        startingPriceA: null,
        startingPriceB: null,
        billingA: null,
        billingB: null,
        freeTier: { a: null, b: null },
        trials: { a: null, b: null },
        modelA: null,
        modelB: null,
        complexityNote: null,
        costCalculatorHref: null,
        notes: ["Missing product(s)"],
      },
      evidence: {
        levelA: "researched",
        levelB: "researched",
        handsOnA: false,
        handsOnB: false,
        disclaimer: "Products missing — cannot enrich.",
      },
      decisionDraft: {
        quickVerdict: "",
        chooseAIf: [],
        chooseBIf: [],
        keyDifferences: [],
        pricingDifferences: [],
        targetCompany: [],
        easeImplementation: [],
        integrationDifferences: [],
        strengthsA: [],
        strengthsB: [],
        limitationsA: [],
        limitationsB: [],
        bestFitScenarios: [],
        poorFitScenarios: [],
        alternatives: [],
        finalRecommendation: "",
      },
      uniquePresent: [],
      uniqueMissing: REQUIRED,
      canApplyDeterministically: false,
      notes: ["Missing product entities"],
      remediationFocus: improvementReasonsFromCompareGates({
        failedGateIds: ["meaningful_relationship"],
        relationshipKind: rel.kind,
        thinMesh: true,
      }),
    };
  }

  const thesis = resolveComparisonThesis(a, b, rel.signals);
  if (!thesis) {
    notes.push("No data-backed thesis — enrichment will stay conservative");
  }

  const capabilityRows = buildCapabilityCompareRows(a, b);
  const pricing = buildPricingDiffSummary(a, b);
  const evidence = resolveComparisonEvidence(a, b);
  const decisionDraft = buildDecisionContentDraft(a, b, {
    thesis,
    pricing,
    evidence,
    capabilityRows,
  });

  const uniquePresent = detectPresent(comparison, decisionDraft, capabilityRows);
  const uniqueMissing = REQUIRED.filter((r) => !uniquePresent.includes(r));

  const intentValid =
    rel.kind !== "missing_product" &&
    rel.kind !== "cross_category_undeclared" &&
    (rel.dataBackedComparable ||
      rel.kind === "same_category_only" ||
      rel.genuineCompetitors);

  // Same-category IMPROVE pages can still get decision content if we have
  // enough product fields to write non-empty choose-if + differences.
  const canApply =
    intentValid &&
    Boolean(a.name && b.name) &&
    (decisionDraft.chooseAIf.length > 0 ||
      decisionDraft.chooseBIf.length > 0 ||
      decisionDraft.keyDifferences.length > 0 ||
      capabilityRows.length > 0);

  if (!canApply) {
    notes.push("Insufficient structured product data for deterministic apply");
  }

  return {
    slug: comparison.slug,
    productA: a.slug,
    productB: b.slug,
    relationshipKind: rel.kind,
    intentValid,
    thesis,
    capabilityRows,
    pricing,
    evidence,
    decisionDraft,
    uniquePresent,
    uniqueMissing,
    canApplyDeterministically: canApply,
    notes,
    remediationFocus: improvementReasonsFromCompareGates({
      failedGateIds: rel.genuineCompetitors ? [] : ["meaningful_relationship"],
      relationshipKind: rel.kind,
      thinMesh: false,
    }),
  };
}
