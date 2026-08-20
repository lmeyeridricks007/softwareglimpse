import {
  RequirementDetailProfileSchema,
  type RequirementDetailProfile,
} from "@/domain";
import {
  listCrmRequirementSlugs,
  synthesizeRequirementDetailProfile,
} from "@/data/crm-graph";
import {
  CRM_REQUIREMENT_PILLAR_SLUGS,
  requirementDepthBySlug,
} from "./deep";
import { buildAutomateLeadFollowUpRequirementProfile } from "./automate-lead-follow-up";
import { buildSeparateSalesProcessesRequirementProfile } from "./separate-sales-processes";

const PROFILES: Record<string, () => RequirementDetailProfile> = {
  "separate-sales-processes": buildSeparateSalesProcessesRequirementProfile,
  "automate-lead-follow-up": buildAutomateLeadFollowUpRequirementProfile,
};

function mergeDepth(
  base: RequirementDetailProfile,
  depth: (typeof requirementDepthBySlug)[string] | undefined,
): RequirementDetailProfile {
  if (!depth) return base;
  return RequirementDetailProfileSchema.parse({
    ...base,
    ...depth,
    challenges: depth.challenges?.length ? depth.challenges : base.challenges,
    outcomes: depth.outcomes?.length ? depth.outcomes : base.outcomes,
    acceptanceNeeds: depth.acceptanceNeeds?.length
      ? depth.acceptanceNeeds
      : base.acceptanceNeeds,
    workflowSteps: depth.workflowSteps?.length
      ? depth.workflowSteps
      : base.workflowSteps,
    faq: depth.faq?.length ? depth.faq : base.faq,
    useCaseLinks: depth.useCaseLinks?.length
      ? depth.useCaseLinks
      : base.useCaseLinks,
  });
}

/** Hand-authored profiles win; the shared graph covers everything else. Depth overlays both. */
export function getRequirementDetailProfile(
  slug: string,
): RequirementDetailProfile | null {
  const build = PROFILES[slug];
  const base = build ? build() : synthesizeRequirementDetailProfile(slug);
  if (!base) return null;
  return mergeDepth(base, requirementDepthBySlug[slug]);
}

/** Public requirement detail href when a researched Requirement page exists. */
export function resolveRequirementDetailHref(
  requirementSlug: string,
): string | null {
  const profile = getRequirementDetailProfile(requirementSlug);
  return profile ? `/requirements/${profile.slug}/` : null;
}

export function listRequirementDetailProfiles(): RequirementDetailProfile[] {
  return listRequirementDetailParams()
    .map((params) => getRequirementDetailProfile(params.slug))
    .filter((profile): profile is RequirementDetailProfile => profile != null);
}

export function listRequirementDetailParams(): Array<{ slug: string }> {
  const slugs = [
    ...CRM_REQUIREMENT_PILLAR_SLUGS,
    ...Object.keys(PROFILES),
    ...listCrmRequirementSlugs(),
  ];
  return [...new Set(slugs)].map((slug) => ({ slug }));
}

/** Curated CRM Requirements index (CRM-REQ-001…010). */
export function listRequirementPillarProfiles(): RequirementDetailProfile[] {
  return CRM_REQUIREMENT_PILLAR_SLUGS.map((slug) =>
    getRequirementDetailProfile(slug),
  ).filter((profile): profile is RequirementDetailProfile => profile != null);
}

export function listIndustryRequirementParams(): Array<{
  industrySlug: string;
  requirementSlug: string;
}> {
  const params: Array<{ industrySlug: string; requirementSlug: string }> = [];
  for (const profile of listRequirementDetailProfiles()) {
    for (const ctx of profile.industryContexts) {
      params.push({
        industrySlug: ctx.industrySlug,
        requirementSlug: profile.slug,
      });
    }
  }
  return params;
}

export {
  buildAutomateLeadFollowUpRequirementProfile,
  buildSeparateSalesProcessesRequirementProfile,
  CRM_REQUIREMENT_PILLAR_SLUGS,
  requirementDepthBySlug,
};
