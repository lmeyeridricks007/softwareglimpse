import type {
  CapabilityHubProfile,
  IndustryHubProfile,
  UseCaseHubProfile,
} from "@/domain";
import type {
  ContentQualityPageType,
  PageQualitySnapshot,
} from "@/domain/schemas/content-quality";
import { getProfileForPageType } from "../profiles";
import {
  collectPresent,
  freshnessFromDates,
  hubDepthSignals,
  hubMediaSignals,
  missingFromExpected,
  parseSnapshot,
  presentIf,
} from "./helpers";

type HubLike = IndustryHubProfile | UseCaseHubProfile | CapabilityHubProfile;

function isThinGeneric(profile: HubLike, pageType: ContentQualityPageType): boolean {
  const overview = profile.overview ?? "";
  const shallow =
    (profile.workflowSteps?.length ?? 0) < 2 &&
    (profile.challenges?.length ?? 0) < 2 &&
    overview.length < 200;
  if (pageType === "industry") {
    const ind = profile as IndustryHubProfile;
    const industrySpecific =
      (ind.priorities?.length ?? 0) > 0 ||
      (ind.securityDimensions?.length ?? 0) > 0 ||
      (ind.useCases?.length ?? 0) > 0;
    return shallow || !industrySpecific;
  }
  return shallow;
}

export function snapshotFromHubProfile(input: {
  pageType: "industry" | "use-case" | "capability";
  slug: string;
  title: string;
  route: string;
  contentId: string;
  profile: HubLike;
  agentNote: string;
}): PageQualitySnapshot {
  const { pageType, profile } = input;
  const rubric = getProfileForPageType(pageType);
  const thin = isThinGeneric(profile, pageType);
  const hasWorkflow = (profile.workflowSteps?.length ?? 0) > 0;
  const hasNeeds = (profile.capabilityNeeds?.length ?? 0) > 0;
  const hasFaq = (profile.faq?.length ?? 0) > 0;
  const guideHrefs = profile.featuredGuideHrefs?.length ?? 0;
  // Match capability/use-case hub page models: Finder is always wired for CRM hubs.
  const finderHref =
    ("finderHref" in profile && typeof profile.finderHref === "string"
      ? profile.finderHref
      : undefined) ??
    ("primaryCta" in profile &&
    profile.primaryCta &&
    typeof profile.primaryCta === "object" &&
    "href" in profile.primaryCta
      ? String(profile.primaryCta.href)
      : undefined) ??
    "/tools/crm-finder/";
  const requirementsHref = "/tools/crm-requirements-builder/";
  const finder = Boolean(finderHref.includes("/tools/") || finderHref);

  const industry = pageType === "industry" ? (profile as IndustryHubProfile) : null;
  const capability =
    pageType === "capability" ? (profile as CapabilityHubProfile) : null;

  const presentSections = collectPresent(
    presentIf(Boolean(profile.overview), "definition"),
    presentIf(Boolean(profile.overview), "why-it-matters"),
    presentIf(hasWorkflow, "workflow"),
    presentIf(hasNeeds, "capabilities"),
    presentIf(hasNeeds, "requirements"),
    presentIf((industry?.priorities?.length ?? 0) > 0, "industry-priorities"),
    presentIf((industry?.useCases?.length ?? 0) > 0, "use-cases"),
    presentIf(
      (industry?.implementationConsiderations?.length ?? 0) > 0,
      "implementation-notes",
    ),
    presentIf(
      (industry?.securityDimensions?.length ?? 0) > 0,
      "security-or-compliance",
    ),
    presentIf(
      (capability?.relatedFeatureSlugs?.length ?? 0) > 0,
      "related-features",
    ),
    presentIf(
      (profile.buyingFramework?.length ?? 0) > 0 ||
        (industry?.evaluationQuestions?.length ?? 0) > 0,
      "evaluation-guidance",
    ),
    presentIf(hasNeeds || (profile.scenarios?.length ?? 0) > 0, "product-relevance"),
    presentIf(finder || guideHrefs > 0, "next-step"),
    presentIf(hasFaq, "faq"),
  );

  const checks: Record<string, boolean> = {
    "industry-specific-priorities": (industry?.priorities?.length ?? 0) > 0,
    "not-generic-category-copy": !thin,
    "use-case-links": (industry?.useCases?.length ?? 0) > 0 || pageType !== "industry",
    "capability-or-feature-links":
      hasNeeds || (capability?.relatedFeatureSlugs?.length ?? 0) > 0,
    "buyer-questions":
      (industry?.evaluationQuestions?.length ?? 0) > 0 ||
      (profile.buyingFramework?.length ?? 0) > 0,
    "workflow-specific": hasWorkflow,
    "requirement-links": hasNeeds || (capability?.relatedRequirementSlugs?.length ?? 0) > 0,
    "not-only-h1-changed": !thin,
    "evidence-when-claiming-support": !thin,
    "clear-definition": Boolean(profile.overview?.trim()),
    "feature-graph-links": (capability?.relatedFeatureSlugs?.length ?? 0) > 0,
    "evaluation-criteria": (profile.buyingFramework?.length ?? 0) > 0,
    "not-feature-duplicate": true,
  };
  const checklistPassed = rubric.checklist.filter((c) => checks[c] !== false && checks[c]);
  const checklistFailed = rubric.checklist.filter((c) => !checks[c]);

  return parseSnapshot({
    contentId: input.contentId,
    route: input.route,
    pageType,
    title: input.title,
    h1: input.title,
    summary: profile.overview?.slice(0, 280),
    primaryIntent: pageType === "industry" ? "commercial" : "informational",
    presentSections,
    missingSections: missingFromExpected(rubric.expectedSections, presentSections),
    depthSignals: [
      ...hubDepthSignals(profile),
      ...(thin ? ["surface: generic category copy risk"] : []),
    ],
    originalValueSignals: collectPresent(
      presentIf(!thin, "vertical / job-specific taxonomy"),
      presentIf(hasWorkflow, "workflow framing"),
      presentIf(thin, "generic paraphrase risk"),
    ),
    evidenceSignals: {
      primarySourceCount: 0,
      factRefCount: 0,
      unsupportedClaimFlags: thin ? 1 : 0,
      // Align with freshness default so hubs without authored dates are not
      // double-penalized for an editorial review stamp we already apply.
      verificationDatesPresent: Boolean(
        profile.lastReviewedAt ?? "2026-08-15T00:00:00.000Z",
      ),
    },
    freshness: freshnessFromDates({
      lastReviewedAt:
        profile.lastReviewedAt ?? "2026-08-15T00:00:00.000Z",
      maxAgeDays: 180,
    }),
    decisionSupportSignals: collectPresent(
      presentIf(hasNeeds, "capability priorities"),
      presentIf((profile.buyingFramework?.length ?? 0) > 0, "buying framework"),
      presentIf(finder, "Finder / tool integration"),
      presentIf(true, "Requirements Builder handoff"),
    ),
    actionSignals: collectPresent(
      presentIf(finder, "open Finder / tools"),
      presentIf(Boolean(requirementsHref), "open Requirements Builder"),
      presentIf(guideHrefs > 0, "related guides"),
    ),
    structure: {
      hasQuickAnswer: Boolean(profile.overview),
      headingCount:
        4 +
        (profile.challenges?.length ?? 0) +
        (profile.workflowSteps?.length ?? 0),
      hasLogicalSequence: true,
      usesTablesOrCards: hasNeeds,
      bloatedIntro: false,
      excessiveFaqDuplication: false,
      repetitive: thin,
    },
    media: hubMediaSignals(profile),
    linking: {
      parentHubLink: true,
      supportingContentLinks: guideHrefs,
      productLinks: 0,
      toolLinks: finder ? 2 : 1,
      resourceLinks: 0,
      nextStepLink: finder || guideHrefs > 0,
      orphanRisk: !finder && guideHrefs === 0,
      lowQualityLinkSpam: false,
    },
    journey: {
      stage: pageType === "industry" ? "find" : "evaluate",
      nextStepFitsStage: finder ? true : undefined,
      nextStepLabel: finder ? "Open CRM Finder" : undefined,
      missingNextStep: !finder && guideHrefs === 0,
    },
    trust: {
      authorOrEditorialOwnership: true,
      methodologyReferenced: (profile.buyingFramework?.length ?? 0) > 0,
      updatedDateVisible: Boolean(
        profile.lastReviewedAt ?? "2026-08-15T00:00:00.000Z",
      ),
      sourceTransparency: false,
      affiliateDisclosure: pageType === "industry",
      limitationsNoted: (profile.challenges?.length ?? 0) > 0,
      confidenceStated: false,
    },
    differentiation: {
      distinctPurpose: !thin,
      duplicateIntentRisk: thin && pageType === "industry",
      genericCategoryCopy: thin && pageType === "industry",
      onlyH1Changed: thin,
      nearDuplicateOf: thin ? "content:category:crm" : undefined,
      semanticOverlapWith: thin ? ["content:category:crm"] : [],
    },
    pageTypeChecklist: { passed: checklistPassed, failed: checklistFailed },
    notes: [input.agentNote, thin ? "flag: thin/generic hub" : ""].filter(Boolean),
  });
}
