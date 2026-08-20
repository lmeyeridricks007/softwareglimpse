import type { RequirementDetailProfile } from "@/domain";
import type { PageQualitySnapshot } from "@/domain/schemas/content-quality";
import { getProfileForPageType } from "../profiles";
import {
  collectPresent,
  freshnessFromDates,
  hubMediaSignals,
  missingFromExpected,
  parseSnapshot,
  presentIf,
} from "./helpers";

export function snapshotFromRequirement(
  profile: RequirementDetailProfile,
): PageQualitySnapshot {
  const rubric = getProfileForPageType("requirement");
  const hasDefinition = Boolean(
    profile.buyerNeedDescription?.trim() || profile.overview?.trim(),
  );
  const hasAcceptance = (profile.acceptanceNeeds?.length ?? 0) > 0;
  const hasFeatures = (profile.featureLinks?.length ?? 0) > 0;
  const hasQuestions = (profile.vendorQuestions?.length ?? 0) > 0;
  const hasCriteria = (profile.evaluationCriteria?.length ?? 0) > 0;
  const finder = Boolean(profile.finderHref);

  const presentSections = collectPresent(
    presentIf(hasDefinition, "definition"),
    presentIf(hasAcceptance, "acceptance-criteria"),
    presentIf(hasFeatures, "feature-mappings"),
    presentIf(hasQuestions, "questions-to-ask"),
    presentIf(finder || hasFeatures, "next-step"),
  );

  const checks: Record<string, boolean> = {
    "acceptance-criteria": hasAcceptance,
    "feature-or-capability-links": hasFeatures,
    "vendor-questions": hasQuestions,
    "scorecard-or-finder-handoff": finder,
  };
  const checklistPassed = rubric.checklist.filter((c) => checks[c]);
  const checklistFailed = rubric.checklist.filter((c) => !checks[c]);

  return parseSnapshot({
    contentId: `content:requirement:${profile.slug}`,
    route: `/requirements/${profile.slug}/`,
    pageType: "requirement",
    title: profile.displayTitle ?? profile.name,
    h1: profile.displayTitle ?? profile.name,
    summary: profile.shortAnswer ?? profile.buyerNeedDescription,
    primaryIntent: "informational",
    presentSections,
    missingSections: missingFromExpected(rubric.expectedSections, presentSections),
    depthSignals: collectPresent(
      presentIf(hasDefinition, "requirement clarity"),
      presentIf(hasAcceptance, "criteria: acceptance needs"),
      presentIf(Boolean(profile.demoTest), "demo verification"),
      presentIf((profile.tradeoffs?.length ?? 0) > 0, "trade-off"),
      presentIf((profile.workflowSteps?.length ?? 0) > 0, "workflow"),
    ),
    originalValueSignals: collectPresent(
      presentIf(hasAcceptance, "acceptance criteria framework"),
      presentIf(hasQuestions, "vendor questions"),
      presentIf(finder, "Finder / scorecard handoff"),
    ),
    evidenceSignals: {
      // Feature mappings are catalogue links, not primary sources.
      primarySourceCount: 0,
      unsupportedClaimFlags: 0,
      verificationDatesPresent: Boolean(profile.lastReviewedAt),
    },
    freshness: freshnessFromDates({
      lastReviewedAt: profile.lastReviewedAt,
      maxAgeDays: 180,
    }),
    decisionSupportSignals: collectPresent(
      presentIf(hasCriteria, "evaluation criteria"),
      presentIf(hasAcceptance, "acceptance criteria"),
      presentIf(hasQuestions, "vendor questions"),
      presentIf(finder, "Finder integration"),
    ),
    actionSignals: collectPresent(
      presentIf(finder, "open Finder / scorecard"),
      presentIf(hasQuestions, "ask vendors"),
      presentIf(Boolean(profile.demoTest), "run demo verification"),
    ),
    structure: {
      hasQuickAnswer: Boolean(profile.shortAnswer),
      headingCount: 5 + (profile.acceptanceNeeds?.length ?? 0),
      hasLogicalSequence: true,
      usesTablesOrCards: hasAcceptance || hasFeatures,
      bloatedIntro: false,
      excessiveFaqDuplication: false,
      repetitive: false,
    },
    media: hubMediaSignals(profile),
    linking: {
      parentHubLink: true,
      supportingContentLinks: profile.useCaseLinks?.length ?? 0,
      productLinks: 0,
      toolLinks: finder ? 1 : 0,
      resourceLinks: 0,
      nextStepLink: finder || hasFeatures,
      orphanRisk: false,
      lowQualityLinkSpam: false,
    },
    journey: {
      stage: "define-requirements",
      nextStepFitsStage: finder,
      nextStepLabel: finder ? "Open Finder / Requirements Builder" : undefined,
      missingNextStep: !finder,
    },
    trust: {
      authorOrEditorialOwnership: true,
      methodologyReferenced: hasCriteria,
      updatedDateVisible: Boolean(profile.lastReviewedAt),
      sourceTransparency: false,
      affiliateDisclosure: false,
      limitationsNoted: (profile.tradeoffs?.length ?? 0) > 0,
      confidenceStated: false,
    },
    differentiation: {
      distinctPurpose: true,
      duplicateIntentRisk: false,
      genericCategoryCopy: false,
      onlyH1Changed: false,
      semanticOverlapWith: [],
    },
    pageTypeChecklist: { passed: checklistPassed, failed: checklistFailed },
    notes: ["agent=RequirementQualityAgent"],
  });
}
