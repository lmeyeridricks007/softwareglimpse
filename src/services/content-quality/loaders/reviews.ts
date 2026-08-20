import type { ProductReview } from "@/domain";
import type { PageQualitySnapshot } from "@/domain/schemas/content-quality";
import { loadEnrichment, loadManualSources } from "@/data/research/store";
import { getProfileForPageType } from "../profiles";
import {
  collectPresent,
  freshnessFromDates,
  missingFromExpected,
  parseSnapshot,
  presentIf,
} from "./helpers";

export function snapshotFromProductReview(
  review: ProductReview,
): PageQualitySnapshot {
  const profile = getProfileForPageType("product-review");
  const sources = loadManualSources(review.productSlug);
  const enrichment = loadEnrichment(review.productSlug);
  const liveSources = sources.filter(
    (s) => s.sourceType !== "fixture" && s.authority !== "fixture",
  );
  const hasVerdict = Boolean(review.verdict?.trim());
  const hasBestFor = (review.bestFor?.length ?? 0) > 0;
  const hasNotFor = (review.notIdealFor?.length ?? 0) > 0;
  const hasCriteria = (review.criterionAssessments?.length ?? 0) > 0;
  const rationales = (review.criterionAssessments ?? []).filter((a) =>
    a.rationale?.trim(),
  );
  const hasPricing = Boolean(review.pricingSummary?.trim());
  const hasProsCons =
    (review.pros?.length ?? 0) > 0 && (review.cons?.length ?? 0) > 0;
  const hasFeatures = (review.keyFeatures?.length ?? 0) > 0;
  const hasAlts =
    (review.alternativeSlugs?.length ?? 0) > 0 ||
    (review.comparisonSlugs?.length ?? 0) > 0;
  const hasMethodology = Boolean(review.methodologySlug);
  const hasFaq = (review.faq?.length ?? 0) > 0;
  const factRefs = (review.factRefs ?? []).reduce(
    (n, f) => n + (f.factIds?.length ?? 0),
    0,
  );
  const screenshotCount = enrichment?.screenshots?.length ?? 0;
  const videoCount = enrichment?.media?.length ?? 0;

  const presentSections = collectPresent(
    presentIf(hasVerdict, "verdict"),
    presentIf(hasBestFor, "best-for"),
    presentIf(hasNotFor, "not-for"),
    presentIf(hasCriteria, "criteria"),
    presentIf(hasFeatures, "features"),
    presentIf(hasPricing, "pricing"),
    presentIf(hasProsCons, "pros-cons"),
    presentIf(factRefs > 0 || liveSources.length > 0, "evidence"),
    presentIf(hasAlts, "alternatives"),
    presentIf(hasMethodology, "methodology"),
    presentIf(hasFaq, "faq"),
  );

  const depthSignals = collectPresent(
    presentIf(hasCriteria, "criteria: editorial assessments"),
    presentIf(hasBestFor && hasNotFor, "buyer segmentation"),
    presentIf((review.limitations?.length ?? 0) > 0, "limitation"),
    presentIf((review.sections?.length ?? 0) >= 4, "workflow / feature depth"),
    presentIf(Boolean(review.whoShouldChoose), "example: who should choose"),
    presentIf(
      rationales.length < Math.max(1, review.criterionAssessments.length / 2),
      "surface: unsupported score rationales",
    ),
  );

  const originalValueSignals = collectPresent(
    presentIf(hasVerdict && hasCriteria, "SoftwareGlimpse assessment"),
    presentIf(hasBestFor && hasNotFor, "best-for / not-for framing"),
    presentIf((review.limitations?.length ?? 0) > 0, "stated limitations"),
    presentIf(!hasVerdict && !hasCriteria, "vendor-summary risk"),
  );

  const genericPros =
    hasProsCons &&
    (review.pros ?? []).every((p) => p.split(/\s+/).filter(Boolean).length < 4) &&
    (review.cons ?? []).every((c) => c.split(/\s+/).filter(Boolean).length < 4);

  const checks: Record<string, boolean> = {
    "approved-editorial": review.editorialStatus === "approved",
    "criterion-rationales":
      hasCriteria && rationales.length === review.criterionAssessments.length,
    "best-for-and-not-for": hasBestFor && hasNotFor,
    "pricing-summary": hasPricing,
    "alternative-or-comparison-links": hasAlts,
    "methodology-referenced": hasMethodology,
    "fact-backed-claims": factRefs > 0 || liveSources.length > 0,
  };
  const checklistPassed = profile.checklist.filter((c) => checks[c]);
  const checklistFailed = profile.checklist.filter((c) => !checks[c]);

  return parseSnapshot({
    contentId: review.id || `content:review:${review.productSlug}`,
    route: `/software/${review.productSlug}/`,
    pageType: "product-review",
    title: review.title,
    h1: review.h1,
    summary: review.summary ?? review.intro,
    primaryIntent: "commercial",
    presentSections,
    missingSections: missingFromExpected(
      profile.expectedSections,
      presentSections,
    ),
    depthSignals,
    originalValueSignals,
    evidenceSignals: {
      primarySourceCount: liveSources.length,
      officialDocCount: liveSources.filter((s) =>
        /official|docs|vendor/i.test(s.sourceType),
      ).length,
      pricingSourceCount: liveSources.filter((s) =>
        /pric/i.test(s.sourceType + (s.domain ?? "")),
      ).length,
      screenshotCount,
      officialVideoCount: videoCount,
      factRefCount: factRefs,
      verificationDatesPresent:
        liveSources.some((s) => Boolean(s.verifiedAt)) ||
        Boolean(enrichment?.pricing?.verifiedAt),
      unsupportedClaimFlags:
        (review.overallScore != null && rationales.length === 0 ? 1 : 0) +
        (genericPros ? 1 : 0),
    },
    freshness: freshnessFromDates({
      lastReviewedAt: review.lastUpdatedAt ?? review.metadata?.updatedAt,
      sourcesVerifiedAt: liveSources.find((s) => s.verifiedAt)?.verifiedAt,
      pricingFresh: hasPricing ? liveSources.length > 0 : undefined,
      maxAgeDays: 90,
    }),
    decisionSupportSignals: collectPresent(
      presentIf(hasCriteria, "criterion assessments"),
      presentIf(hasBestFor, "best-for scenarios"),
      presentIf(hasAlts, "alternatives / comparisons"),
      presentIf(
        Boolean(review.whoShouldConsiderAlternatives),
        "when to look elsewhere",
      ),
    ),
    actionSignals: collectPresent(
      presentIf(hasAlts, "compare alternatives"),
      presentIf(hasPricing, "review pricing"),
      "visit product CTA",
    ),
    structure: {
      hasQuickAnswer: hasVerdict,
      headingCount: (review.sections?.length ?? 0) + 4,
      hasLogicalSequence: true,
      usesTablesOrCards: hasCriteria,
      bloatedIntro: (review.intro?.length ?? 0) > 800 && !hasVerdict,
      excessiveFaqDuplication: (review.faq?.length ?? 0) > 15,
      repetitive: false,
    },
    media: {
      teachingVisualCount: screenshotCount + videoCount,
      decorativeOnly: false,
      workflowDiagram: false,
      comparisonMatrix: hasCriteria,
      checklistVisual: false,
      subjectNeedsVisuals: true,
    },
    linking: {
      parentHubLink: true,
      supportingContentLinks: review.relatedGuidePaths?.length ?? 0,
      productLinks: 0,
      toolLinks: 0,
      resourceLinks: 0,
      nextStepLink:
        (review.comparisonSlugs?.length ?? 0) > 0 ||
        (review.alternativeSlugs?.length ?? 0) > 0,
      orphanRisk: false,
      lowQualityLinkSpam: false,
    },
    journey: {
      stage: "research",
      nextStepFitsStage:
        (review.comparisonSlugs?.length ?? 0) > 0 ||
        (review.alternativeSlugs?.length ?? 0) > 0,
      nextStepLabel: review.comparisonSlugs?.[0]
        ? `Compare ${review.comparisonSlugs[0]}`
        : review.alternativeSlugs?.[0]
          ? "See alternatives"
          : undefined,
      missingNextStep:
        (review.comparisonSlugs?.length ?? 0) === 0 &&
        (review.alternativeSlugs?.length ?? 0) === 0,
    },
    trust: {
      authorOrEditorialOwnership: review.editorialStatus === "approved",
      methodologyReferenced: hasMethodology,
      updatedDateVisible: Boolean(review.lastUpdatedAt),
      sourceTransparency: liveSources.length > 0 || factRefs > 0,
      affiliateDisclosure: true,
      limitationsNoted: (review.limitations?.length ?? 0) > 0 || hasNotFor,
      confidenceStated: Boolean(review.confidence),
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
      `editorialStatus=${review.editorialStatus}`,
      "agent=ProductReviewQualityAgent",
      genericPros ? "flag: generic pros/cons" : "",
      !hasBestFor || !hasNotFor ? "flag: weak buyer segmentation" : "",
    ].filter(Boolean),
  });
}
