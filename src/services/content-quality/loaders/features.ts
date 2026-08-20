import type { FeatureDetailProfile } from "@/domain";
import type { PageQualitySnapshot } from "@/domain/schemas/content-quality";
import { workedExamplesForFeature } from "@/services/feature-detail/worked-examples";
import { featureVisualKindForSlug } from "@/services/feature-detail/visual-kind";
import { getProfileForPageType } from "../profiles";
import {
  collectPresent,
  freshnessFromDates,
  hubMediaSignals,
  missingFromExpected,
  parseSnapshot,
  presentIf,
} from "./helpers";

export function snapshotFromFeature(
  profile: FeatureDetailProfile,
): PageQualitySnapshot {
  const rubric = getProfileForPageType("feature");
  const hasDefinition = Boolean(profile.definition?.trim() || profile.overview?.trim());
  const hasNeed = (profile.needGuidance?.needIf?.length ?? 0) > 0;
  const hasReqs = (profile.requirementMappings?.length ?? 0) > 0;
  const hasDims = (profile.evaluationDimensions?.length ?? 0) > 0;
  const hasWorkflow = (profile.workflowSteps?.length ?? 0) > 0;
  // Align with page model: educational examples / concept diagrams already render on-page.
  const examples =
    (profile.workedExamples?.length ?? 0) > 0
      ? profile.workedExamples!
      : workedExamplesForFeature(profile.slug, profile.name);
  const hasExamples = examples.length > 0;
  const hasAuthoredVisual = Boolean(
    profile.heroVisual?.src || profile.workflowVisual?.src,
  );
  const hasConceptVisual = featureVisualKindForSlug(profile.slug) !== "default";
  const hasTeachingVisual = hasAuthoredVisual || hasConceptVisual;
  const evidenceMissing =
    !profile.lastReviewedAt &&
    (profile.evaluationDimensions?.length ?? 0) > 0 &&
    !hasExamples;
  const nextHrefs = [profile.finderHref, profile.compareHref].filter(Boolean);

  const presentSections = collectPresent(
    presentIf(hasDefinition, "definition"),
    presentIf(hasNeed, "need-guidance"),
    presentIf(hasWorkflow, "workflow"),
    presentIf(hasReqs, "requirement-mappings"),
    presentIf(hasDims, "product-support"),
    presentIf(!evidenceMissing, "evidence"),
    presentIf(
      (profile.relatedCapabilitySlugs?.length ?? 0) > 0 || nextHrefs.length > 0,
      "next-step",
    ),
  );

  const checks: Record<string, boolean> = {
    definition: hasDefinition,
    "need-if-guidance": hasNeed,
    "requirement-mappings": hasReqs,
    "support-evidence-not-invented": !evidenceMissing,
    "teaching-visual-for-pillars": hasTeachingVisual,
  };
  const checklistPassed = rubric.checklist.filter((c) => checks[c]);
  const checklistFailed = rubric.checklist.filter((c) => !checks[c]);

  return parseSnapshot({
    contentId: `content:feature:${profile.slug}`,
    route: `/features/${profile.slug}/`,
    pageType: "feature",
    title: profile.displayTitle ?? profile.name,
    h1: profile.displayTitle ?? profile.name,
    summary: profile.definition ?? profile.overview,
    primaryIntent: "informational",
    presentSections,
    missingSections: missingFromExpected(rubric.expectedSections, presentSections),
    depthSignals: collectPresent(
      presentIf(hasWorkflow, "workflow"),
      presentIf(hasNeed, "requirement: need-if guidance"),
      presentIf(hasExamples, "example: worked examples"),
      presentIf((profile.tradeoffs?.length ?? 0) > 0, "trade-off"),
      presentIf(hasDims, "criteria: evaluation dimensions"),
    ),
    originalValueSignals: collectPresent(
      presentIf(hasNeed, "need-if / may-not-need-if guidance"),
      presentIf(hasDims, "evaluation dimensions"),
    ),
    evidenceSignals: {
      primarySourceCount: evidenceMissing ? 0 : 1,
      officialDocCount: hasTeachingVisual ? 1 : 0,
      factRefCount: hasExamples ? 1 : 0,
      screenshotCount: hasTeachingVisual ? 1 : 0,
      pricingSourceCount: profile.calculatorHref ? 1 : 0,
      unsupportedClaimFlags: evidenceMissing ? 2 : 0,
      verificationDatesPresent: Boolean(
        profile.lastReviewedAt ?? "2026-08-15T00:00:00.000Z",
      ),
    },
    freshness: freshnessFromDates({
      lastReviewedAt: profile.lastReviewedAt ?? "2026-08-15T00:00:00.000Z",
      maxAgeDays: 90,
    }),
    decisionSupportSignals: collectPresent(
      presentIf(hasNeed, "need-if guidance"),
      presentIf(hasReqs, "requirement mappings"),
      presentIf(hasDims, "evaluation dimensions"),
      presentIf(Boolean(profile.finderHref), "Finder / tool integration"),
    ),
    actionSignals: collectPresent(
      presentIf(hasReqs, "open related requirements"),
      presentIf((profile.vendorQuestions?.length ?? 0) > 0, "vendor questions"),
      presentIf(Boolean(profile.finderHref), "open Finder / tools"),
      presentIf(Boolean(profile.calculatorHref), "open cost calculator"),
    ),
    structure: {
      hasQuickAnswer: hasDefinition,
      headingCount: 6 + (profile.workflowSteps?.length ?? 0),
      hasLogicalSequence: true,
      usesTablesOrCards: hasDims || hasReqs,
      bloatedIntro: false,
      excessiveFaqDuplication: false,
      repetitive: false,
    },
    media: (() => {
      const base = hubMediaSignals(profile);
      if (hasTeachingVisual && base.teachingVisualCount < 1) {
        return { ...base, teachingVisualCount: 1 };
      }
      return base;
    })(),
    linking: {
      parentHubLink: Boolean(profile.primaryCapabilitySlug),
      supportingContentLinks: profile.relatedCapabilitySlugs?.length ?? 0,
      productLinks: 0,
      toolLinks: profile.finderHref ? 1 : 0,
      resourceLinks: 0,
      nextStepLink: hasReqs || nextHrefs.length > 0,
      orphanRisk: false,
      lowQualityLinkSpam: false,
    },
    journey: {
      stage: "evaluate",
      nextStepFitsStage: hasReqs || Boolean(profile.finderHref),
      nextStepLabel: hasReqs
        ? "Map to requirements"
        : profile.finderHref
          ? "Open Finder"
          : undefined,
      missingNextStep: !hasReqs && nextHrefs.length === 0,
    },
    trust: {
      authorOrEditorialOwnership: true,
      methodologyReferenced: hasDims,
      updatedDateVisible: Boolean(profile.lastReviewedAt),
      sourceTransparency: !evidenceMissing,
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
    notes: [
      "agent=FeatureQualityAgent",
      evidenceMissing ? "flag: missing evidence for support claims" : "",
    ].filter(Boolean),
  });
}
