import { IndustryHubProfileSchema, type IndustryHubProfile } from "@/domain";
import { industryDepthBySlug } from "./deep";
import { verticalDepthBySlug } from "./vertical-depth";
import { buildFinancialServicesIndustryHubProfile } from "./financial-services";
import { industryQualityBySlug } from "./quality-fields";
import { verticalQualityBySlug } from "./vertical-quality";
import { applyIndustryWorkflowEnrichment } from "./workflow-enrichment";

const PROFILES: Record<string, () => IndustryHubProfile> = {
  "financial-services": buildFinancialServicesIndustryHubProfile,
};

function depthFor(slug: string) {
  return industryDepthBySlug[slug] ?? verticalDepthBySlug[slug];
}

function qualityFor(slug: string) {
  return industryQualityBySlug[slug] ?? verticalQualityBySlug[slug];
}

function mergeDepth(
  base: IndustryHubProfile,
  depth: ReturnType<typeof depthFor> | undefined,
  quality: ReturnType<typeof qualityFor> | undefined,
): IndustryHubProfile {
  const workflowSteps = applyIndustryWorkflowEnrichment(
    base.industrySlug,
    depth?.workflowSteps?.length ? depth.workflowSteps : base.workflowSteps,
  );

  return IndustryHubProfileSchema.parse({
    ...base,
    ...(quality ?? {}),
    overview: depth?.overview ?? base.overview,
    whoThisIsFor: depth?.whoThisIsFor ?? base.whoThisIsFor,
    whatMattersIntro: depth?.whatMattersIntro ?? base.whatMattersIntro,
    workedExample: depth?.workedExample ?? base.workedExample,
    workedExampleSecondary:
      depth?.workedExampleSecondary ?? base.workedExampleSecondary,
    tagline: depth?.tagline ?? base.tagline,
    glance: depth?.glance ?? base.glance,
    challenges: depth?.challenges?.length ? depth.challenges : base.challenges,
    outcomes: depth?.outcomes?.length ? depth.outcomes : base.outcomes,
    capabilityNeeds: depth?.capabilityNeeds?.length
      ? depth.capabilityNeeds
      : base.capabilityNeeds,
    workflowSteps,
    needsVisual: depth?.needsVisual ?? base.needsVisual,
    workflowVisual: depth?.workflowVisual ?? base.workflowVisual,
    heroVisual: depth?.heroVisual ?? base.heroVisual,
    faq: depth?.faq?.length ? depth.faq : base.faq,
    // Quality fields: prefer dedicated packs, then depth, then base (FS profile)
    priorities: quality?.priorities?.length
      ? quality.priorities
      : base.priorities?.length
        ? base.priorities
        : [],
    useCases: quality?.useCases?.length
      ? quality.useCases
      : base.useCases?.length
        ? base.useCases
        : [],
    implementationConsiderations: quality?.implementationConsiderations?.length
      ? quality.implementationConsiderations
      : base.implementationConsiderations?.length
        ? base.implementationConsiderations
        : [],
    evaluationQuestions: quality?.evaluationQuestions?.length
      ? quality.evaluationQuestions
      : base.evaluationQuestions?.length
        ? base.evaluationQuestions
        : [],
    securityDimensions: quality?.securityDimensions?.length
      ? quality.securityDimensions
      : base.securityDimensions?.length
        ? base.securityDimensions
        : [],
    securityDisclaimer: quality?.securityDisclaimer ?? base.securityDisclaimer,
    buyingFramework: quality?.buyingFramework?.length
      ? quality.buyingFramework
      : base.buyingFramework?.length
        ? base.buyingFramework
        : [],
    finderHref: quality?.finderHref ?? base.finderHref,
    calculatorHref: quality?.calculatorHref ?? base.calculatorHref,
    compareHref: quality?.compareHref ?? base.compareHref,
    catalogueHref: quality?.catalogueHref ?? base.catalogueHref,
    methodologyHref: quality?.methodologyHref ?? base.methodologyHref,
    buyingGuideHref: quality?.buyingGuideHref ?? base.buyingGuideHref,
    featuredGuideHrefs: quality?.featuredGuideHrefs?.length
      ? quality.featuredGuideHrefs
      : base.featuredGuideHrefs?.length
        ? base.featuredGuideHrefs
        : [],
    relatedIndustrySlugs: quality?.relatedIndustrySlugs?.length
      ? quality.relatedIndustrySlugs
      : base.relatedIndustrySlugs?.length
        ? base.relatedIndustrySlugs
        : [],
    productFitGuidance: quality?.productFitGuidance?.length
      ? quality.productFitGuidance
      : base.productFitGuidance?.length
        ? base.productFitGuidance
        : [],
    lastReviewedAt: quality?.lastReviewedAt ?? base.lastReviewedAt,
  });
}

/**
 * Returns a hub presentation profile for any known industry slug.
 * Hand-authored profiles (e.g. financial-services) are enriched with depth;
 * other industries get narrative depth + quality field packs.
 */
export function getIndustryHubProfile(
  industrySlug: string,
): IndustryHubProfile | null {
  const depth = depthFor(industrySlug);
  const quality = qualityFor(industrySlug);
  const build = PROFILES[industrySlug];
  if (build) {
    return mergeDepth(build(), depth, quality);
  }
  if (!depth && !quality) return null;
  return mergeDepth(
    IndustryHubProfileSchema.parse({ industrySlug }),
    depth,
    quality,
  );
}

export function listIndustryHubProfiles(): IndustryHubProfile[] {
  const slugs = new Set([
    ...Object.keys(PROFILES),
    ...Object.keys(industryDepthBySlug),
    ...Object.keys(verticalDepthBySlug),
    ...Object.keys(industryQualityBySlug),
    ...Object.keys(verticalQualityBySlug),
  ]);
  return [...slugs]
    .map((slug) => getIndustryHubProfile(slug))
    .filter((p): p is IndustryHubProfile => Boolean(p));
}

export { buildFinancialServicesIndustryHubProfile };
export { industryDepthBySlug } from "./deep";
export { verticalDepthBySlug } from "./vertical-depth";
export { industryQualityBySlug } from "./quality-fields";
export { verticalQualityBySlug } from "./vertical-quality";
