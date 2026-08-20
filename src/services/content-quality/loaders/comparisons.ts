import type { Comparison } from "@/domain";
import type { PageQualitySnapshot } from "@/domain/schemas/content-quality";
import { getProfileForPageType } from "../profiles";
import {
  collectPresent,
  freshnessFromDates,
  missingFromExpected,
  parseSnapshot,
  presentIf,
} from "./helpers";

export function snapshotFromComparison(
  comparison: Comparison,
): PageQualitySnapshot {
  const profile = getProfileForPageType("comparison");
  const completeOutcomes = (comparison.outcomes ?? []).filter(
    (o) => o.researchStatus === "complete" && o.reason?.trim(),
  );
  const factBacked = (comparison.outcomes ?? []).filter(
    (o) => (o.supportingFactIds?.length ?? 0) > 0,
  );
  const boilerplateOutcomes = (comparison.outcomes ?? []).filter((o) =>
    /current research shows comparable support on/i.test(o.reason ?? ""),
  );
  const boilerplateShare =
    (comparison.outcomes?.length ?? 0) > 0
      ? boilerplateOutcomes.length / comparison.outcomes.length
      : 0;
  const majorityBoilerplate = boilerplateShare >= 0.5;
  const hasVerdict = Boolean(comparison.verdict?.trim());
  const hasScenarios =
    (comparison.scenarioRecommendations?.length ?? 0) > 0 ||
    (comparison.bestFor?.length ?? 0) > 0;
  const hasPricing = Boolean(comparison.pricingNotes?.trim());
  const sideBySideRisk =
    completeOutcomes.length < 2 &&
    hasVerdict &&
    (comparison.summary?.length ?? 0) > 200;

  const presentSections = collectPresent(
    presentIf(hasVerdict || Boolean(comparison.overallWinnerKind), "verdict-or-depends"),
    presentIf((comparison.outcomes?.length ?? 0) > 0, "criteria-table"),
    presentIf(hasScenarios, "scenarios"),
    presentIf(factBacked.length > 0, "evidence"),
    presentIf(hasPricing, "pricing-context"),
    presentIf(true, "next-step"),
  );

  const checks: Record<string, boolean> = {
    "researched-criteria": completeOutcomes.length >= 3,
    "balanced-evidence": factBacked.length >= Math.min(3, completeOutcomes.length),
    "scenario-recommendations": hasScenarios,
    "no-forced-universal-winner":
      comparison.overallWinnerKind === "depends" ||
      comparison.overallWinnerKind === "tie" ||
      Boolean(comparison.overallWinnerSlug),
    "pricing-or-tco-context": hasPricing,
  };
  const checklistPassed = profile.checklist.filter((c) => checks[c]);
  const checklistFailed = profile.checklist.filter((c) => !checks[c]);

  return parseSnapshot({
    contentId: comparison.id || `content:comparison:${comparison.slug}`,
    route: `/compare/${comparison.slug}/`,
    pageType: "comparison",
    title: comparison.title,
    h1: comparison.title,
    summary: comparison.summary,
    primaryIntent: "comparison",
    presentSections,
    missingSections: missingFromExpected(profile.expectedSections, presentSections),
    depthSignals: collectPresent(
      presentIf(completeOutcomes.length >= 3, "criteria: researched differences"),
      presentIf(hasScenarios, "trade-off / scenario recommendations"),
      presentIf(hasPricing, "cost context"),
      presentIf(sideBySideRisk, "surface: two reviews side-by-side risk"),
      presentIf(
        majorityBoilerplate,
        "surface: comparable-support boilerplate outcomes",
      ),
    ),
    originalValueSignals: collectPresent(
      presentIf(completeOutcomes.length >= 3, "structured criterion outcomes"),
      presentIf(hasScenarios, "who-should-choose scenarios"),
      presentIf(sideBySideRisk, "generic paraphrase risk"),
      presentIf(
        majorityBoilerplate,
        "template outcome language (comparable support)",
      ),
    ),
    evidenceSignals: {
      primarySourceCount: factBacked.length,
      factRefCount: factBacked.reduce(
        (n, o) => n + (o.supportingFactIds?.length ?? 0),
        0,
      ),
      verificationDatesPresent: comparison.metadata?.researchStatus === "complete",
      unsupportedClaimFlags: sideBySideRisk ? 1 : 0,
    },
    freshness: freshnessFromDates({
      lastReviewedAt: comparison.metadata?.updatedAt,
      maxAgeDays: 90,
    }),
    decisionSupportSignals: collectPresent(
      presentIf(completeOutcomes.length > 0, "shared criteria"),
      presentIf(hasScenarios, "scenario recommendations"),
      presentIf(hasVerdict, "verdict / depends framing"),
    ),
    actionSignals: collectPresent(
      "compare product CTAs",
      presentIf(hasPricing, "check pricing / TCO"),
    ),
    structure: {
      hasQuickAnswer: hasVerdict,
      headingCount: 6 + (comparison.outcomes?.length ?? 0),
      hasLogicalSequence: true,
      usesTablesOrCards: (comparison.outcomes?.length ?? 0) > 0,
      bloatedIntro: false,
      excessiveFaqDuplication: false,
      repetitive: sideBySideRisk || majorityBoilerplate,
    },
    media: {
      teachingVisualCount: (comparison.outcomes?.length ?? 0) > 0 ? 1 : 0,
      decorativeOnly: false,
      workflowDiagram: false,
      comparisonMatrix: (comparison.outcomes?.length ?? 0) > 0,
      checklistVisual: false,
      subjectNeedsVisuals: true,
    },
    linking: {
      parentHubLink: Boolean(comparison.categorySlug),
      supportingContentLinks: 0,
      productLinks: comparison.productSlugs.length,
      toolLinks: 0,
      resourceLinks: 0,
      nextStepLink: true,
      orphanRisk: false,
      lowQualityLinkSpam: false,
    },
    journey: {
      stage: "compare",
      nextStepFitsStage: true,
      nextStepLabel: "Check pricing / calculator",
      missingNextStep: false,
    },
    trust: {
      authorOrEditorialOwnership: comparison.editorialStatus === "approved",
      methodologyReferenced: Boolean(comparison.methodologyVersion),
      updatedDateVisible: Boolean(comparison.metadata?.updatedAt),
      sourceTransparency: factBacked.length > 0,
      affiliateDisclosure: true,
      limitationsNoted: comparison.overallWinnerKind === "depends",
      confidenceStated: completeOutcomes.some((o) => Boolean(o.confidence)),
    },
    differentiation: {
      distinctPurpose: true,
      duplicateIntentRisk: false,
      genericCategoryCopy: false,
      onlyH1Changed: false,
      semanticOverlapWith: [],
    },
    pageTypeChecklist: { passed: checklistPassed, failed: checklistFailed },
    notes: [
      `researchStatus=${comparison.metadata?.researchStatus}`,
      "agent=ComparisonQualityAgent",
      sideBySideRisk ? "flag: side-by-side review paste risk" : "",
      majorityBoilerplate
        ? `flag: ${boilerplateOutcomes.length}/${comparison.outcomes?.length ?? 0} outcomes use “comparable support”`
        : "",
    ].filter(Boolean),
  });
}
