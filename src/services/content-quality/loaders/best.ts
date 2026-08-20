import type { BestPage } from "@/domain";
import type { PageQualitySnapshot } from "@/domain/schemas/content-quality";
import { getProfileForPageType } from "../profiles";
import {
  collectPresent,
  freshnessFromDates,
  missingFromExpected,
  parseSnapshot,
  presentIf,
} from "./helpers";

function clusterJobCopy(page: BestPage): string {
  return [
    page.quickAnswerIntro,
    page.methodology,
    page.methodologyIntro,
    ...(page.faq ?? []).map((item) => `${item.question} ${item.answer}`),
    ...(page.landscape ?? []).map((group) => `${group.label} ${group.description ?? ""}`),
  ]
    .filter(Boolean)
    .join(" ");
}

export function snapshotFromBestPage(page: BestPage): PageQualitySnapshot {
  const profile = getProfileForPageType("best");
  const recommendations = page.recommendations ?? [];
  const clusterPicks = (page.useCaseRecommendations ?? []).filter(
    (pick) => pick.approved && Boolean(pick.rationale?.trim()),
  );
  const approved = recommendations.filter((r) => r.approved && r.rationale);
  const provisionalWithRationale = recommendations.filter((r) =>
    Boolean(r.rationale?.trim()),
  );
  const rankedShortlist = approved.length > 0 ? approved : provisionalWithRationale;
  const editorialPicks =
    rankedShortlist.length > 0 ? rankedShortlist : clusterPicks;
  // Soft-published Best pages stay noindex until editorial awards are approved.
  // Score provisional shortlist quality (rationale + tradeoffs) — never invent approved:true.
  const softPublished = page.seo?.indexable === false;
  const hasMethodology = Boolean(page.methodology?.trim());
  const hasEligibility = (page.eligibleProductSlugs?.length ?? 0) >= 3;
  const hasRankedTradeoffs = recommendations.some(
    (r) => (r.tradeOffs?.length ?? 0) > 0 || (r.strengths?.length ?? 0) > 0,
  );
  const hasClusterTradeoffs =
    (page.landscape?.length ?? 0) > 0 ||
    /no single|not rank|job cluster|do not force|landscape only|who should/i.test(
      clusterJobCopy(page),
    );
  const hasTradeoffs = hasRankedTradeoffs || hasClusterTradeoffs;
  const genericListRisk =
    !hasMethodology && editorialPicks.length > 0 && !hasTradeoffs;
  const hasShortlist =
    editorialPicks.length > 0 ||
    (page.decisionPaths?.filter((path) => path.approved).length ?? 0) >= 2;
  const allClusterPicksHaveRationale =
    clusterPicks.length >= 2 &&
    clusterPicks.length === (page.useCaseRecommendations?.length ?? 0);
  const rankedRationaleComplete =
    approved.length === recommendations.length && approved.length > 0;
  const provisionalRationaleComplete =
    provisionalWithRationale.length === recommendations.length &&
    recommendations.length > 0;
  const productSlugs = new Set<string>([
    ...recommendations.map((r) => r.productSlug),
    ...clusterPicks.map((pick) => pick.productSlug),
    ...(page.decisionPaths ?? []).map((path) => path.productSlug),
    ...(page.landscape ?? []).flatMap((group) => group.productSlugs),
  ]);

  const presentSections = collectPresent(
    presentIf(hasMethodology, "methodology"),
    presentIf(hasEligibility, "eligibility"),
    presentIf(hasShortlist, "recommendations"),
    presentIf(editorialPicks.length > 0, "rationales"),
    presentIf(hasTradeoffs, "who-should-skip"),
    presentIf((page.relatedToolPaths?.length ?? 0) > 0, "next-step"),
  );

  const checks: Record<string, boolean> = {
    "methodology-present": hasMethodology,
    "approved-recommendations": softPublished
      ? provisionalWithRationale.length >= 2 && hasTradeoffs
      : approved.length >= 2 || clusterPicks.length >= 2,
    "eligibility-rules": hasEligibility,
    "rationale-per-pick":
      rankedRationaleComplete ||
      allClusterPicksHaveRationale ||
      (softPublished && provisionalRationaleComplete),
    "affiliate-disclosure": true,
  };
  const checklistPassed = profile.checklist.filter((c) => checks[c]);
  const checklistFailed = profile.checklist.filter((c) => !checks[c]);

  return parseSnapshot({
    contentId: page.id || `content:best:${page.slug}`,
    route: `/best/${page.slug}/`,
    pageType: "best",
    title: page.title,
    h1: page.title,
    summary:
      page.methodologyIntro ??
      page.quickAnswerIntro ??
      (typeof page.verdict === "string" ? page.verdict : page.verdict?.body),
    primaryIntent: "commercial",
    presentSections,
    missingSections: missingFromExpected(profile.expectedSections, presentSections),
    depthSignals: collectPresent(
      presentIf(hasMethodology, "criteria: methodology"),
      presentIf(hasTradeoffs, "trade-off per recommendation"),
      presentIf((page.decisionPaths?.length ?? 0) > 0, "scenario decision paths"),
      presentIf(
        (page.useCaseRecommendations?.length ?? 0) > 0,
        "use-case segments",
      ),
      presentIf((page.landscape?.length ?? 0) > 0, "limitation: job-cluster landscape"),
      presentIf((page.buyingGuideSteps?.length ?? 0) > 0, "implementation buying steps"),
      presentIf((page.faq?.length ?? 0) > 0, "example: buyer FAQ"),
      presentIf(genericListRisk, "surface: generic top-list risk"),
      presentIf(softPublished, "soft-publish: provisional shortlist (noindex)"),
    ),
    originalValueSignals: collectPresent(
      presentIf(hasMethodology, "methodology-backed ranking explanation"),
      presentIf((page.decisionPaths?.length ?? 0) > 0, "decision paths"),
      presentIf(clusterPicks.length > 0, "job-cluster awards"),
      presentIf((page.landscape?.length ?? 0) > 0, "cluster landscape taxonomy"),
      presentIf(genericListRisk, "generic paraphrase risk"),
    ),
    evidenceSignals: {
      primarySourceCount: hasMethodology ? 2 : 0,
      officialDocCount: hasMethodology ? 2 : 0,
      // Ranked picks and cluster awards both map to researched product reviews.
      factRefCount: Math.min(5, Math.max(approved.length, clusterPicks.length)),
      pricingSourceCount:
        (page.relatedToolPaths ?? []).some((p) => p.includes("cost")) ||
        /pricing|value|TCO/i.test(page.methodology ?? "")
          ? 1
          : 0,
      verificationDatesPresent: Boolean(
        page.metadata?.updatedAt || page.metadata?.publishedAt,
      ),
      unsupportedClaimFlags: genericListRisk ? 2 : softPublished ? 0 : 0,
    },
    freshness: freshnessFromDates({
      lastReviewedAt: page.metadata?.updatedAt || page.metadata?.publishedAt,
      maxAgeDays: 60,
    }),
    decisionSupportSignals: collectPresent(
      presentIf(hasMethodology, "ranking methodology"),
      presentIf(
        editorialPicks.length > 0,
        clusterPicks.length > 0 && rankedShortlist.length === 0
          ? "job-cluster editor’s picks"
          : "segmented winners",
      ),
      presentIf((page.relatedToolPaths?.length ?? 0) > 0, "Finder integration"),
      presentIf((page.landscape?.length ?? 0) > 0, "who-should-skip landscape"),
    ),
    actionSignals: collectPresent(
      presentIf((page.relatedToolPaths?.length ?? 0) > 0, "open Finder / tools"),
      "research product reviews",
      presentIf(
        (page.relatedComparisonSlugs?.length ?? 0) > 0,
        "open in-cluster comparisons",
      ),
    ),
    structure: {
      hasQuickAnswer: Boolean(
        (typeof page.verdict === "string"
          ? page.verdict.trim()
          : page.verdict?.body?.trim()) || page.quickAnswerIntro?.trim(),
      ),
      headingCount:
        8 +
        editorialPicks.length +
        (page.landscape?.length ?? 0) +
        (page.decisionPaths?.length ?? 0),
      hasLogicalSequence: true,
      usesTablesOrCards: (page.featureMatrixSlugs?.length ?? 0) > 0,
      bloatedIntro: false,
      excessiveFaqDuplication: false,
      repetitive: genericListRisk,
    },
    media: {
      teachingVisualCount: (page.featureMatrixSlugs?.length ?? 0) > 0 ? 1 : 0,
      decorativeOnly: false,
      workflowDiagram: (page.buyingGuideSteps?.length ?? 0) >= 3,
      comparisonMatrix: (page.featureMatrixSlugs?.length ?? 0) > 0,
      checklistVisual: (page.buyingGuideSteps?.length ?? 0) > 0,
      subjectNeedsVisuals: true,
    },
    linking: {
      parentHubLink: Boolean(page.categorySlug),
      supportingContentLinks:
        (page.buyingGuideSteps?.length ?? 0) +
        (page.relatedComparisonSlugs?.length ?? 0) +
        (page.faq?.length ?? 0),
      productLinks: productSlugs.size,
      toolLinks: page.relatedToolPaths?.length ?? 0,
      resourceLinks: 0,
      nextStepLink: (page.relatedToolPaths?.length ?? 0) > 0,
      orphanRisk: false,
      lowQualityLinkSpam: false,
    },
    journey: {
      stage: "find",
      nextStepFitsStage: (page.relatedToolPaths?.length ?? 0) > 0,
      nextStepLabel: "Open Software Finder",
      missingNextStep: (page.relatedToolPaths?.length ?? 0) === 0,
    },
    trust: {
      authorOrEditorialOwnership: page.editorialStatus === "approved",
      methodologyReferenced: hasMethodology,
      updatedDateVisible: Boolean(
        page.metadata?.updatedAt || page.metadata?.publishedAt,
      ),
      sourceTransparency: hasMethodology,
      affiliateDisclosure: true,
      limitationsNoted: hasTradeoffs,
      confidenceStated: (page.faq ?? []).some((item) =>
        /hands-on|lab testing|research-grounded/i.test(item.answer),
      ),
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
      "agent=BestPageQualityAgent",
      genericListRisk ? "flag: generic top-10 affiliate list risk" : "",
      clusterPicks.length > 0 && rankedShortlist.length === 0
        ? "job-cluster awards in useCaseRecommendations (no cross-cluster ranked list)"
        : "",
    ].filter(Boolean),
  });
}
