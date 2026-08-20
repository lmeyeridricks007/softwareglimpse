import {
  FeatureDetailProfileSchema,
  type FeatureDetailProfile,
} from "@/domain";
import {
  listCrmFeatureSlugs,
  synthesizeFeatureDetailProfile,
} from "@/data/crm-graph";
import {
  CRM_FEATURE_PILLAR_SLUGS,
  featureDepthBySlug,
} from "./deep";
import { coreOpsFeatureVisualsBySlug } from "./core-ops-visuals";
import { buildMultiplePipelinesFeatureProfile } from "./multiple-pipelines";
import { buildWorkflowAutomationFeatureProfile } from "./workflow-automation";

const PROFILES: Record<string, () => FeatureDetailProfile> = {
  "multiple-pipelines": buildMultiplePipelinesFeatureProfile,
  "workflow-automation": buildWorkflowAutomationFeatureProfile,
};

/** Catalogue / enrichment slug → public feature detail URL slug. */
const CATALOGUE_TO_PAGE_SLUG: Record<string, string> = {
  "custom-pipelines": "multiple-pipelines",
  "call-functionality": "calling",
  reporting: "reporting-dashboards",
};

function mergeDepth(
  base: FeatureDetailProfile,
  depth: (typeof featureDepthBySlug)[string] | undefined,
): FeatureDetailProfile {
  if (!depth) return base;
  return FeatureDetailProfileSchema.parse({
    ...base,
    ...depth,
    challenges: depth.challenges?.length ? depth.challenges : base.challenges,
    outcomes: depth.outcomes?.length ? depth.outcomes : base.outcomes,
    workflowSteps: depth.workflowSteps?.length
      ? depth.workflowSteps
      : base.workflowSteps,
    workedExamples: depth.workedExamples?.length
      ? depth.workedExamples
      : base.workedExamples,
    faq: depth.faq?.length ? depth.faq : base.faq,
  });
}

function depthForSlug(pageSlug: string) {
  const visuals = coreOpsFeatureVisualsBySlug[pageSlug];
  const authored = featureDepthBySlug[pageSlug];
  if (!visuals && !authored) return undefined;
  return { ...visuals, ...authored };
}

/** Hand-authored profiles win; the shared graph covers everything else. Depth overlays both. */
export function getFeatureDetailProfile(
  slug: string,
): FeatureDetailProfile | null {
  const pageSlug = CATALOGUE_TO_PAGE_SLUG[slug] ?? slug;
  const build = PROFILES[pageSlug];
  const base = build ? build() : synthesizeFeatureDetailProfile(pageSlug);
  if (!base) return null;
  return mergeDepth(base, depthForSlug(pageSlug));
}

/** Public feature detail href when a researched Feature Detail page exists. */
export function resolveFeatureDetailHref(featureSlug: string): string | null {
  const profile = getFeatureDetailProfile(featureSlug);
  return profile ? `/features/${profile.slug}/` : null;
}

export function listFeatureDetailProfiles(): FeatureDetailProfile[] {
  return listFeatureDetailParams()
    .map((params) => getFeatureDetailProfile(params.slug))
    .filter((profile): profile is FeatureDetailProfile => profile != null);
}

/** All feature detail routes (pillar + remaining graph pages). */
export function listFeatureDetailParams(): Array<{ slug: string }> {
  const slugs = [
    ...CRM_FEATURE_PILLAR_SLUGS,
    ...Object.keys(PROFILES),
    ...listCrmFeatureSlugs(),
  ];
  return [...new Set(slugs)].map((slug) => ({ slug }));
}

/** Curated CRM Features index (CRM-FEAT-001…016). */
export function listFeaturePillarProfiles(): FeatureDetailProfile[] {
  return CRM_FEATURE_PILLAR_SLUGS.map((slug) => getFeatureDetailProfile(slug)).filter(
    (profile): profile is FeatureDetailProfile => profile != null,
  );
}

export function listIndustryFeatureParams(): Array<{
  industrySlug: string;
  featureSlug: string;
}> {
  const params: Array<{ industrySlug: string; featureSlug: string }> = [];
  for (const profile of listFeatureDetailProfiles()) {
    for (const ctx of profile.industryContexts) {
      params.push({
        industrySlug: ctx.industrySlug,
        featureSlug: profile.slug,
      });
    }
  }
  return params;
}

export {
  buildMultiplePipelinesFeatureProfile,
  buildWorkflowAutomationFeatureProfile,
  CRM_FEATURE_PILLAR_SLUGS,
  featureDepthBySlug,
};
