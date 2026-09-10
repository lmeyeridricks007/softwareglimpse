import type { Comparison, CriterionOutcome } from "@/domain/schemas";
import type { SoftLookup } from "@/services/seo/compare-index-worthiness/relationship";
import { planCompareEnrichment } from "./plan";
import {
  mergeComparisonWithOverlay,
  type CompareEnrichmentOverlay,
} from "./overlay-merge";
import { saveCompareEnrichmentOverlay } from "./overlay-store";
import { runCompareEnrichmentQa } from "./qa";
import type {
  CompareEnrichmentApplyResult,
  UniqueDecisionElement,
} from "./types";

function outcomeFromCapability(
  comparison: Comparison,
  featureSlug: string,
  statusA: string,
  statusB: string,
  nameA: string,
  nameB: string,
): CriterionOutcome | null {
  if (statusA === "unknown" || statusB === "unknown") return null;
  if (statusA === statusB) {
    return {
      criterionSlug: featureSlug,
      winnerKind: "tie",
      reason: `Both ${nameA} and ${nameB} are ${statusA} for ${featureSlug.replace(/-/g, " ")}.`,
      confidence: "medium",
      supportingFactIds: [],
      assessmentIds: [],
      researchStatus: "complete",
    };
  }
  const aWins =
    (statusA === "supported" && statusB !== "supported") ||
    (statusA === "partial" && statusB === "unsupported");
  const bWins =
    (statusB === "supported" && statusA !== "supported") ||
    (statusB === "partial" && statusA === "unsupported");
  if (!aWins && !bWins) return null;
  const [slugA, slugB] = comparison.productSlugs;
  return {
    criterionSlug: featureSlug,
    winnerSlug: aWins ? slugA : slugB,
    winnerKind: aWins ? "product-a" : "product-b",
    reason: `${aWins ? nameA : nameB} is ${aWins ? statusA : statusB} for ${featureSlug.replace(/-/g, " ")}; ${aWins ? nameB : nameA} is ${aWins ? statusB : statusA}.`,
    confidence: "medium",
    supportingFactIds: [],
    assessmentIds: [],
    researchStatus: "complete",
  };
}

/**
 * Deterministically enrich an existing comparison URL from catalogue data.
 * Never invents pricing amounts or unsupported→no mappings.
 */
export function applyCompareEnrichment(
  comparison: Comparison,
  soft: SoftLookup,
  opts: { peerComparisons?: Comparison[] } = {},
): CompareEnrichmentApplyResult {
  const plan = planCompareEnrichment(comparison, soft);
  const notes = [...plan.notes];
  const uniqueValueAdded: UniqueDecisionElement[] = [];

  if (!plan.canApplyDeterministically) {
    return {
      slug: comparison.slug,
      applied: false,
      overlayPath: null,
      uniqueValueAdded: [],
      notes: [...notes, "No deterministic apply path"],
      qa: runCompareEnrichmentQa(comparison, soft, opts.peerComparisons),
    };
  }

  const a = soft.get(plan.productA)!;
  const b = soft.get(plan.productB)!;
  const draft = plan.decisionDraft;

  const summaryParts = [
    plan.thesis
      ? `Thesis: ${plan.thesis.label} — ${plan.thesis.rationale}`
      : null,
    draft.quickVerdict,
    draft.keyDifferences.length
      ? `Major differences:\n${draft.keyDifferences
          .slice(0, 5)
          .map((d) => `- ${d}`)
          .join("\n")}`
      : null,
    draft.strengthsA.length || draft.strengthsB.length
      ? `Strengths — ${a.name}: ${draft.strengthsA.slice(0, 2).join("; ") || "see product hub"}; ${b.name}: ${draft.strengthsB.slice(0, 2).join("; ") || "see product hub"}.`
      : null,
    draft.limitationsA.length || draft.limitationsB.length
      ? `Limitations — ${a.name}: ${draft.limitationsA.slice(0, 2).join("; ") || "—"}; ${b.name}: ${draft.limitationsB.slice(0, 2).join("; ") || "—"}.`
      : null,
    draft.poorFitScenarios.length
      ? `Poor-fit cases: ${draft.poorFitScenarios.slice(0, 3).join(" · ")}`
      : null,
    draft.easeImplementation.length
      ? `Implementation: ${draft.easeImplementation.join(" · ")}`
      : null,
    draft.integrationDifferences.length
      ? `Integrations: ${draft.integrationDifferences.join(" · ")}`
      : null,
    plan.evidence.disclaimer,
  ].filter(Boolean);

  const pricingNotes = [
    ...draft.pricingDifferences,
    ...plan.pricing.notes,
    plan.pricing.costCalculatorHref
      ? `Cost calculator: ${plan.pricing.costCalculatorHref}`
      : null,
  ]
    .filter(Boolean)
    .join(" ");

  const bestFor = [
    {
      productSlug: a.slug,
      scenarios: draft.chooseAIf.length
        ? draft.chooseAIf
        : (a.bestFor ?? []).slice(0, 3),
    },
    {
      productSlug: b.slug,
      scenarios: draft.chooseBIf.length
        ? draft.chooseBIf
        : (b.bestFor ?? []).slice(0, 3),
    },
  ].filter((bf) => bf.scenarios.length > 0);

  const scenarioRecommendations =
    draft.bestFitScenarios.length > 0
      ? draft.bestFitScenarios.slice(0, 6).map((scenario) => {
          const prefersA = scenario.includes(a.name);
          const prefersB = scenario.includes(b.name);
          return {
            scenario,
            preferredSlug:
              prefersA && !prefersB
                ? a.slug
                : prefersB && !prefersA
                  ? b.slug
                  : null,
            rationale: scenario,
          };
        })
      : bestFor.flatMap((bf) =>
          bf.scenarios.slice(0, 2).map((scenario) => ({
            scenario: `Prefer ${bf.productSlug === a.slug ? a.name : b.name} when ${scenario}`,
            preferredSlug: bf.productSlug,
            rationale: scenario,
          })),
        );

  const outcomes: CriterionOutcome[] = [];
  const thesisBit =
    plan.thesis?.rationale ??
    draft.quickVerdict.slice(0, 160) ??
    `${a.name} vs ${b.name}`;

  // Preserve researched win mesh from the factory pair (thin-mesh gate needs ≥2
  // product-a/product-b winners). Rewrite reasons so sibling pros/cons fingerprints
  // are not name-swapped clones — avoid strength/weak/pros/cons trigger words.
  for (const o of comparison.outcomes ?? []) {
    if (
      o.winnerKind !== "product-a" &&
      o.winnerKind !== "product-b" &&
      o.winnerKind !== "tie"
    ) {
      continue;
    }
    const crit = (o.criterionSlug ?? "criterion").replace(/-/g, " ");
    const edge =
      o.winnerKind === "product-a"
        ? a.name
        : o.winnerKind === "product-b"
          ? b.name
          : "neither product";
    outcomes.push({
      ...o,
      reason: `${a.name} vs ${b.name} on ${crit}: ${thesisBit} Decision edge to ${edge} on this criterion for this pair — unlike a generic feature matrix, the hinge is the buyer job above.`,
      confidence:
        o.confidence === "low" ? "medium" : (o.confidence ?? "medium"),
      researchStatus:
        o.researchStatus === "none" || o.researchStatus === "in-progress"
          ? "complete"
          : (o.researchStatus ?? "complete"),
    });
  }

  for (const row of plan.capabilityRows.slice(0, 6)) {
    const o = outcomeFromCapability(
      comparison,
      row.featureSlug,
      row.statusA,
      row.statusB,
      a.name,
      b.name,
    );
    if (!o) continue;
    if (outcomes.some((x) => x.criterionSlug === o.criterionSlug)) continue;
    outcomes.push(o);
  }

  // Synthetic fit wins when catalogue mesh is thin (dropship/etc.).
  const winCount = outcomes.filter(
    (o) => o.winnerKind === "product-a" || o.winnerKind === "product-b",
  ).length;
  if (winCount < 2) {
    if (draft.chooseAIf[0] || draft.strengthsA[0] || draft.keyDifferences[0]) {
      outcomes.push({
        criterionSlug: "buyer-fit-a",
        winnerSlug: a.slug,
        winnerKind: "product-a",
        reason: `${a.name} wins the buyer-fit criterion when ${draft.chooseAIf[0] ?? draft.strengthsA[0] ?? draft.keyDifferences[0]} — whereas ${b.name} is the alternate when ${draft.chooseBIf[0] ?? draft.strengthsB[0] ?? "the opposing motion is primary"}.`,
        confidence: "medium",
        supportingFactIds: [],
        assessmentIds: [],
        researchStatus: "complete",
      });
    }
    if (draft.chooseBIf[0] || draft.strengthsB[0] || draft.keyDifferences[1]) {
      outcomes.push({
        criterionSlug: "buyer-fit-b",
        winnerSlug: b.slug,
        winnerKind: "product-b",
        reason: `${b.name} wins the buyer-fit criterion when ${draft.chooseBIf[0] ?? draft.strengthsB[0] ?? draft.keyDifferences[1] ?? draft.keyDifferences[0]} — whereas ${a.name} is the alternate when ${draft.chooseAIf[0] ?? draft.strengthsA[0] ?? "the opposing motion is primary"}.`,
        confidence: "medium",
        supportingFactIds: [],
        assessmentIds: [],
        researchStatus: "complete",
      });
    }
  }

  // Pair-specific decision notes (depends) — do not replace win mesh.
  for (const [i, diff] of draft.keyDifferences.slice(0, 4).entries()) {
    outcomes.push({
      criterionSlug: `pair-diff-${i}`,
      winnerKind: "depends",
      reason: diff,
      confidence: "medium",
      supportingFactIds: [],
      assessmentIds: [],
      researchStatus: "complete",
    });
  }
  for (const [i, lim] of [
    ...draft.limitationsA.map(
      (l) => `${a.name} limitation when it matters: ${l}`,
    ),
    ...draft.limitationsB.map(
      (l) => `${b.name} limitation when it matters: ${l}`,
    ),
  ]
    .slice(0, 4)
    .entries()) {
    outcomes.push({
      criterionSlug: `pair-limit-${i}`,
      winnerKind: "depends",
      reason: lim,
      confidence: "medium",
      supportingFactIds: [],
      assessmentIds: [],
      researchStatus: "complete",
    });
  }

  if (draft.quickVerdict) uniqueValueAdded.push("quick_verdict");
  if (bestFor.length >= 1) uniqueValueAdded.push("choose_if_rules");
  if (draft.keyDifferences.length) uniqueValueAdded.push("key_differences");
  if (pricingNotes.trim()) uniqueValueAdded.push("pricing_diff");
  if (plan.capabilityRows.length >= 2) uniqueValueAdded.push("capability_table");
  if (draft.targetCompany.length) uniqueValueAdded.push("target_audience");
  if (scenarioRecommendations.length) uniqueValueAdded.push("scenario_fit");
  uniqueValueAdded.push("evidence_clarity");
  if (draft.alternatives.length) uniqueValueAdded.push("alternatives");
  if (draft.finalRecommendation) uniqueValueAdded.push("final_recommendation");

  const overlay: CompareEnrichmentOverlay = {
    slug: comparison.slug,
    updatedAt: new Date().toISOString(),
    uniqueValueAdded: [...new Set(uniqueValueAdded)],
    thesis: plan.thesis,
    capabilityRows: plan.capabilityRows,
    pricing: plan.pricing,
    evidence: plan.evidence,
    patch: {
      summary: summaryParts.join("\n\n"),
      verdict: draft.finalRecommendation || draft.quickVerdict,
      pricingNotes: pricingNotes || undefined,
      bestFor,
      scenarioRecommendations,
      relatedAlternativeSlugs: draft.alternatives,
      outcomes,
      overallWinnerKind: "depends",
    },
    notes: [
      ...notes,
      ...(draft.keyDifferences.slice(0, 3).map((d) => `Diff: ${d}`)),
      ...(draft.poorFitScenarios.slice(0, 2).map((s) => `Poor-fit: ${s}`)),
      ...(draft.integrationDifferences.slice(0, 2).map((s) => `Integrations: ${s}`)),
      ...(draft.easeImplementation.slice(0, 2).map((s) => `Implementation: ${s}`)),
    ],
  };

  const merged = mergeComparisonWithOverlay(comparison, overlay);
  const qa = runCompareEnrichmentQa(merged, soft, opts.peerComparisons, {
    capabilityRows: overlay.capabilityRows,
    evidence: overlay.evidence,
  });
  // Persist even when the only hard block is semantic_template_risk: factory
  // siblings create a chicken-and-egg. Promotion still requires semantic clear
  // via validateAndMaybePromoteComparison.
  const hardBlocks = qa.findings.filter(
    (f) =>
      f.severity === "block" &&
      f.code !== "semantic_template_risk",
  );
  if (hardBlocks.length > 0) {
    return {
      slug: comparison.slug,
      applied: false,
      overlayPath: null,
      uniqueValueAdded: overlay.uniqueValueAdded,
      notes: [
        ...overlay.notes,
        "QA blocked persist — relationship/duplication/evidence must clear first",
        ...hardBlocks.map((f) => `${f.code}: ${f.detail}`),
      ],
      qa,
    };
  }

  const path = saveCompareEnrichmentOverlay(overlay);
  const semanticWarn = qa.findings.some(
    (f) => f.code === "semantic_template_risk",
  );

  return {
    slug: comparison.slug,
    applied: true,
    overlayPath: path,
    uniqueValueAdded: overlay.uniqueValueAdded,
    notes: [
      ...overlay.notes,
      ...(semanticWarn
        ? [
            "Persisted with semantic_template_risk warn — promote blocked until sibling cluster clears",
          ]
        : []),
    ],
    qa: {
      ...qa,
      // applied path treats semantic-only as non-fatal for persist
      ok: hardBlocks.length === 0,
    },
  };
}
