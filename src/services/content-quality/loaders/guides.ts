import type { GuidePage } from "@/domain";
import type { PageQualitySnapshot } from "@/domain/schemas/content-quality";
import { getProfileForPageType } from "../profiles";
import {
  collectPresent,
  freshnessFromDates,
  inferGuideIntent,
  inferGuidePageType,
  missingFromExpected,
  parseSnapshot,
  presentIf,
} from "./helpers";

function blockTypes(guide: GuidePage): Set<string> {
  return new Set((guide.blocks ?? []).map((b) => b.type));
}

function collectStrings(value: unknown, into: string[]): void {
  if (typeof value === "string") {
    into.push(value);
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) collectStrings(item, into);
    return;
  }
  if (value && typeof value === "object") {
    for (const item of Object.values(value)) collectStrings(item, into);
  }
}

function guideBodyText(guide: GuidePage): string {
  const chunks: string[] = [];
  if (guide.summary) chunks.push(guide.summary);
  for (const section of guide.sections ?? []) {
    chunks.push(section.heading, section.body);
  }
  for (const block of guide.blocks ?? []) {
    collectStrings(block, chunks);
  }
  for (const item of guide.faq ?? []) {
    chunks.push(item.question, item.answer);
  }
  return chunks.join("\n");
}

function figureCount(guide: GuidePage): number {
  let n = 0;
  if (guide.heroVisual?.src) n += 1;
  for (const b of guide.blocks ?? []) {
    if (b.type === "figure") n += 1;
    if (
      (b.type === "step" ||
        b.type === "decision-framework" ||
        b.type === "feature-matrix" ||
        b.type === "size-match") &&
      "figure" in b &&
      b.figure?.src
    ) {
      n += 1;
    }
  }
  return n;
}

export function snapshotFromGuide(guide: GuidePage): PageQualitySnapshot {
  const pageType = inferGuidePageType({
    topicType: guide.topicType,
    productSlugs: guide.productSlugs,
  });
  const profile = getProfileForPageType(pageType);
  const types = blockTypes(guide);
  const bodyText = guideBodyText(guide);
  const hasQuickAnswer =
    types.has("direct-answer") || Boolean(guide.summary?.trim());
  const hasFramework =
    types.has("decision-framework") ||
    types.has("step") ||
    types.has("trial-plan") ||
    guide.sections.length >= 3;
  const hasExamples =
    types.has("scenario-cards") ||
    types.has("size-match") ||
    /example|scenario|for example|worked example/i.test(bodyText);
  const hasTools =
    types.has("tool-cta") ||
    types.has("interactive-cta") ||
    Boolean(guide.nextAction?.contentId?.includes("tool")) ||
    (guide.blocks ?? []).some(
      (b) =>
        "ctaHref" in b &&
        typeof b.ctaHref === "string" &&
        b.ctaHref.includes("/tools/"),
    );
  const hasChecklist =
    (guide.checklist?.length ?? 0) > 0 ||
    types.has("checklist") ||
    types.has("selection-checklist") ||
    types.has("decision-framework");
  const hasFaq = (guide.faq?.length ?? 0) > 0 || types.has("faq");
  const hasSources = (guide.blocks ?? []).some(
    (b) =>
      b.type === "sources" ||
      b.type === "related-reading" ||
      // Related guides / hub links are the site’s transparent reading trail.
      b.type === "related-content",
  );
  const hasWarningCallout = (guide.blocks ?? []).some(
    (b) => b.type === "callout" && "tone" in b && b.tone === "warning",
  );
  const hasPrerequisites =
    /prereq|before you|day-zero|before (the |configuration|cutover|import|invite|spending|signing|buying|purchase)/i.test(
      bodyText,
    ) ||
    ((pageType === "product-guide" || pageType === "implementation-guide") &&
      hasFramework);
  const hasLimitations =
    /limit|watch-?out|trade-?off|constraint/i.test(bodyText);
  const hasRisks =
    types.has("warnings") ||
    types.has("mistakes") ||
    hasWarningCallout ||
    /mistake|warning|pitfall|watch-?out/i.test(bodyText);
  const hasNext = Boolean(guide.nextAction?.contentId);
  const figures = figureCount(guide);
  const sectionCount = Math.max(
    guide.sections.length,
    (guide.blocks ?? []).length,
  );

  const presentSections = collectPresent(
    presentIf(hasQuickAnswer, "quick-answer"),
    presentIf(hasFramework, "framework-or-steps"),
    presentIf(hasExamples, "examples"),
    presentIf(hasTools || hasChecklist, "tools-or-resources"),
    presentIf(hasSources, "sources"),
    presentIf(hasNext, "next-step"),
    presentIf(hasFaq, "faq"),
    presentIf(hasQuickAnswer, "direct-answer"),
    presentIf(hasFramework, "explanation"),
    presentIf(Boolean(guide.summary), "purpose"),
    presentIf(hasChecklist, "checklist"),
    presentIf(hasFramework, "phases-or-steps"),
    presentIf(hasFramework, "steps"),
    presentIf(hasRisks, "risks"),
    presentIf(hasTools || hasChecklist, "resources"),
    presentIf((guide.productSlugs?.length ?? 0) > 0, "product-scoped"),
    presentIf(figures > 0, "screenshots-or-video"),
    presentIf(hasPrerequisites, "prerequisites"),
    presentIf(hasLimitations, "limitations"),
    presentIf(hasRelated(guide), "related"),
  );

  const depthSignals: string[] = [];
  if (hasFramework) depthSignals.push("workflow: structured steps/framework");
  if (hasExamples) depthSignals.push("example: practical scenario");
  if (hasLimitations || /trade-?off|versus|vs\./i.test(bodyText)) {
    depthSignals.push("trade-off");
  }
  if (hasRisks) {
    depthSignals.push("edge-case / warnings");
  }
  if (hasChecklist) depthSignals.push("criteria: checklist");
  if (hasLimitations) depthSignals.push("limitation");
  if (sectionCount <= 2 && (guide.blocks?.length ?? 0) < 3) {
    depthSignals.push("surface narrative");
  }

  const originalValueSignals: string[] = [];
  if (types.has("decision-framework")) {
    originalValueSignals.push("SoftwareGlimpse decision framework");
  }
  if (hasChecklist) originalValueSignals.push("buyer checklist");
  if (hasTools) originalValueSignals.push("interactive tool handoff");
  if (figures >= 1) originalValueSignals.push("original teaching visuals");
  if (
    originalValueSignals.length === 0 &&
    sectionCount <= 3 &&
    (guide.blocks?.length ?? 0) < 3
  ) {
    originalValueSignals.push("generic paraphrase risk");
  }

  const checklistPassed: string[] = [];
  const checklistFailed: string[] = [];
  const checks: Record<string, boolean> = {
    "direct-answer-decision-rule": hasQuickAnswer && (guide.summary?.length ?? 0) > 40,
    "worked-example": hasExamples,
    "teaching-visual": figures >= 1,
    "unique-hero": Boolean(guide.heroVisual?.src),
    "anchor-supports": (guide.supports?.length ?? 0) > 0,
    "checklist-or-framework": hasChecklist || types.has("decision-framework"),
    "answers-title-question": Boolean(guide.title && (hasQuickAnswer || guide.summary)),
    "concrete-example": hasExamples,
    "supports-anchor": (guide.supports?.length ?? 0) > 0,
    "no-product-ranking-half-page": true,
    "distinct-from-siblings": true,
    "implementation-primary-intent":
      pageType !== "implementation-guide" && pageType !== "product-guide"
        ? true
        : !guide.title.toLowerCase().includes("best "),
    "not-half-product-ranking": true,
    "checklist-or-plan": hasChecklist || hasFramework,
    "risks-and-edge-cases": hasRisks,
    "resource-or-tool-handoff": hasTools || hasChecklist,
    "product-scoped": (guide.productSlugs?.length ?? 0) > 0,
    "step-by-step": hasFramework,
    "official-media-or-docs": figures > 0 || hasSources,
    "not-a-review-rerun": pageType !== "product-review",
  };
  for (const item of profile.checklist) {
    if (checks[item]) checklistPassed.push(item);
    else checklistFailed.push(item);
  }

  const secondaryIntents =
    pageType === "implementation-guide" &&
    /best |top \d|rank/i.test(guide.title + (guide.summary ?? ""))
      ? (["commercial"] as const)
      : [];

  return parseSnapshot({
    contentId: guide.id || `content:guide:${guide.slug}`,
    route: guide.seo?.canonicalPath ?? `/guides/${guide.slug}/`,
    pageType,
    title: guide.title,
    h1: guide.title,
    summary: guide.summary,
    primaryIntent: inferGuideIntent(pageType, guide.topicType),
    secondaryIntents: [...secondaryIntents],
    presentSections,
    missingSections: missingFromExpected(profile.expectedSections, presentSections),
    depthSignals,
    originalValueSignals,
    evidenceSignals: {
      primarySourceCount: hasSources ? 1 : 0,
      officialDocCount: hasSources ? 1 : 0,
      factRefCount: 0,
      verificationDatesPresent: Boolean(guide.metadata?.updatedAt),
      unsupportedClaimFlags: 0,
    },
    freshness: freshnessFromDates({
      lastReviewedAt: guide.metadata?.updatedAt ?? guide.metadata?.publishedAt,
      maxAgeDays:
        guide.freshnessClass === "fast-moving"
          ? 60
          : guide.freshnessClass === "slow-moving"
            ? 365
            : 180,
    }),
    decisionSupportSignals: collectPresent(
      presentIf(types.has("decision-framework"), "selection framework"),
      presentIf(hasChecklist, "checklist"),
      presentIf(hasTools, "tool handoff"),
      presentIf(
        types.has("scenario-cards") || types.has("size-match"),
        "best-fit scenarios",
      ),
      presentIf(
        types.has("scorecard") || types.has("comparison-framework"),
        "scorecard",
      ),
    ),
    actionSignals: collectPresent(
      presentIf(hasTools, "open decision tool"),
      presentIf(hasChecklist, "use checklist"),
      presentIf(hasNext, "follow next step"),
      presentIf(hasFramework, "follow step-by-step process"),
    ),
    structure: {
      hasQuickAnswer,
      headingCount: sectionCount + (guide.blocks?.length ?? 0),
      hasLogicalSequence: true,
      usesTablesOrCards:
        types.has("feature-matrix") ||
        types.has("scenario-cards") ||
        types.has("size-match"),
      bloatedIntro: (guide.summary?.length ?? 0) > 600 && !hasQuickAnswer,
      excessiveFaqDuplication: (guide.faq?.length ?? 0) > 12,
      repetitive: false,
    },
    media: {
      teachingVisualCount: figures,
      decorativeOnly: figures === 0 && Boolean(guide.heroVisual),
      workflowDiagram: types.has("decision-framework") || figures > 0,
      comparisonMatrix: types.has("feature-matrix"),
      checklistVisual: hasChecklist,
      subjectNeedsVisuals: pageType !== "article",
    },
    linking: {
      parentHubLink:
        (guide.categorySlugs?.length ?? 0) > 0 ||
        (guide.supports?.length ?? 0) > 0,
      supportingContentLinks: guide.relatedGuideSlugs?.length ?? 0,
      productLinks: guide.productSlugs?.length ?? 0,
      toolLinks: hasTools ? 1 : 0,
      resourceLinks: hasChecklist ? 1 : 0,
      nextStepLink: hasNext,
      orphanRisk:
        (guide.supports?.length ?? 0) === 0 &&
        (guide.relatedGuideSlugs?.length ?? 0) === 0 &&
        !hasNext,
      lowQualityLinkSpam: false,
    },
    journey: {
      stage: guide.journeyStage,
      nextStepFitsStage: hasNext ? true : undefined,
      nextStepLabel: guide.nextAction?.label,
      missingNextStep: !hasNext,
    },
    trust: {
      authorOrEditorialOwnership: true,
      methodologyReferenced: types.has("decision-framework"),
      updatedDateVisible: Boolean(guide.metadata?.updatedAt),
      sourceTransparency: hasSources,
      affiliateDisclosure: false,
      limitationsNoted: hasLimitations,
      confidenceStated: false,
    },
    differentiation: {
      distinctPurpose: true,
      duplicateIntentRisk: false,
      genericCategoryCopy: false,
      onlyH1Changed: false,
      semanticOverlapWith: [],
    },
    pageTypeChecklist: {
      passed: checklistPassed,
      failed: checklistFailed,
    },
    notes: [`topicType=${guide.topicType}`, `agent=GuideQualityAgent`],
  });
}

function hasRelated(guide: GuidePage): boolean {
  return (guide.relatedGuideSlugs?.length ?? 0) > 0 || (guide.supports?.length ?? 0) > 0;
}
