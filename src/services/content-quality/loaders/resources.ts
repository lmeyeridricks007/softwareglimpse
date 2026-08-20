import type { Resource, ResourceHubProfile } from "@/domain";
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

export function snapshotFromResource(
  resource: Resource,
  profile: ResourceHubProfile | null,
): PageQualitySnapshot {
  const rubric = getProfileForPageType("resource");
  const downloads = profile?.downloadFiles?.length ?? 0;
  const sections = profile?.artifactSections?.length ?? 0;
  const howTo = Boolean(profile?.howToUse?.trim());
  const superficial = downloads === 0 && sections < 2 && !howTo;
  const tools = profile?.relatedToolHrefs?.length ?? 0;
  const guides = profile?.featuredGuideHrefs?.length ?? 0;

  const presentSections = collectPresent(
    presentIf(Boolean(resource.description || profile?.overview), "purpose"),
    presentIf(howTo, "how-to-use"),
    presentIf(downloads > 0 || sections > 0, "artifact"),
    presentIf(guides > 0, "related-guides"),
    presentIf(tools > 0 || guides > 0, "next-step"),
  );

  const checks: Record<string, boolean> = {
    "usable-artifact": downloads > 0 || sections >= 2,
    "usage-instructions": howTo,
    "linked-from-journey": guides > 0 || tools > 0,
    "not-thin-landing-only": !superficial,
  };
  const checklistPassed = rubric.checklist.filter((c) => checks[c]);
  const checklistFailed = rubric.checklist.filter((c) => !checks[c]);

  return parseSnapshot({
    contentId: resource.id || `content:resource:${resource.slug}`,
    route: `/resources/${resource.slug}/`,
    pageType: "resource",
    title: resource.name,
    h1: resource.name,
    summary: resource.description ?? profile?.overview,
    primaryIntent: "informational",
    presentSections,
    missingSections: missingFromExpected(rubric.expectedSections, presentSections),
    depthSignals: collectPresent(
      presentIf(sections >= 2, "artifact completeness"),
      presentIf(howTo, "usability instructions"),
      presentIf((profile?.workflowSteps?.length ?? 0) > 0, "workflow"),
      presentIf((profile?.challenges?.length ?? 0) > 0, "trade-off / challenge context"),
      presentIf(
        Boolean(profile?.workedExample || profile?.workedExampleStructured),
        "example: worked scenario",
      ),
      presentIf(
        (profile?.evidenceRules?.doesNotCount?.length ?? 0) > 0,
        "limitation: evidence rules",
      ),
      presentIf(superficial, "surface: lead-gen landing risk"),
    ),
    originalValueSignals: collectPresent(
      presentIf(downloads > 0, "downloadable checklist/template"),
      presentIf(sections >= 2 || (profile?.whatsInside?.length ?? 0) >= 3, "structured worksheet sections"),
      presentIf(
        (profile?.artifactSections ?? []).some((s) =>
          /vendor question/i.test(s.title),
        ),
        "vendor questions",
      ),
      presentIf(
        Boolean(profile?.workedExampleStructured || profile?.workedExample),
        "worked teaching example",
      ),
      presentIf(Boolean(profile?.evidenceRules), "evidence rules / scoring gates"),
      presentIf((profile?.workflowSteps?.length ?? 0) > 0, "operational workflow"),
      presentIf(superficial, "generic paraphrase risk"),
    ),
    evidenceSignals: {
      primarySourceCount: 0,
      unsupportedClaimFlags: 0,
      verificationDatesPresent: Boolean(profile?.lastReviewedAt),
    },
    freshness: freshnessFromDates({
      lastReviewedAt: profile?.lastReviewedAt ?? resource.metadata?.updatedAt,
      maxAgeDays: 365,
    }),
    decisionSupportSignals: collectPresent(
      presentIf(downloads > 0 || sections > 0, "practical artifact"),
      presentIf(tools > 0, "tool integration"),
      presentIf(
        (profile?.artifactSections ?? []).some((s) =>
          /gate|score|weight|vendor/i.test(s.title),
        ),
        "scorecard / gates / vendor questions",
      ),
    ),
    actionSignals: collectPresent(
      presentIf(downloads > 0, "download artifact"),
      presentIf(tools > 0, "open related tool"),
      presentIf(howTo, "follow how-to-use"),
    ),
    structure: {
      hasQuickAnswer: Boolean(resource.description),
      headingCount: 3 + sections,
      hasLogicalSequence: true,
      usesTablesOrCards: sections > 0,
      bloatedIntro: false,
      excessiveFaqDuplication: false,
      repetitive: superficial,
    },
    media: profile
      ? hubMediaSignals(profile)
      : {
          teachingVisualCount: 0,
          subjectNeedsVisuals: false,
          decorativeOnly: false,
          workflowDiagram: false,
          comparisonMatrix: false,
          checklistVisual: downloads > 0,
        },
    linking: {
      parentHubLink: (resource.categorySlugs?.length ?? 0) > 0,
      supportingContentLinks: guides,
      productLinks: 0,
      toolLinks: tools,
      resourceLinks: 0,
      nextStepLink: tools > 0 || guides > 0,
      orphanRisk: tools === 0 && guides === 0,
      lowQualityLinkSpam: false,
    },
    journey: {
      stage: resource.stage ?? "evaluate",
      nextStepFitsStage: tools > 0 || guides > 0,
      nextStepLabel: tools > 0 ? "Open related tool" : undefined,
      missingNextStep: tools === 0 && guides === 0,
    },
    trust: {
      authorOrEditorialOwnership: true,
      methodologyReferenced: Boolean(profile?.evidenceRules),
      updatedDateVisible: Boolean(profile?.lastReviewedAt),
      sourceTransparency: Boolean(profile?.evidenceRules?.countsAs?.length),
      affiliateDisclosure: false,
      limitationsNoted: (profile?.evidenceRules?.doesNotCount?.length ?? 0) > 0,
      confidenceStated: Boolean(profile?.workedExampleStructured),
    },
    differentiation: {
      distinctPurpose: !superficial,
      duplicateIntentRisk: false,
      genericCategoryCopy: false,
      onlyH1Changed: false,
      semanticOverlapWith: [],
    },
    pageTypeChecklist: { passed: checklistPassed, failed: checklistFailed },
    notes: [
      "agent=ResourceQualityAgent",
      superficial ? "flag: superficial lead-gen risk" : "",
    ].filter(Boolean),
  });
}
