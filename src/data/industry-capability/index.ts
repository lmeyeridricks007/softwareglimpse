import type { IndustryCapabilityProfile } from "@/domain";
import {
  INDUSTRY_SLUGS,
  listCrmCapabilitySlugs,
  synthesizeIndustryCapabilityProfile,
} from "@/data/crm-graph";
import { buildFinancialServicesPipelineManagementProfile } from "./financial-services-pipeline-management";
import { buildFinancialServicesWorkflowAutomationProfile } from "./financial-services-workflow-automation";

type ProfileKey = `${string}::${string}`;

const PROFILES: Record<ProfileKey, () => IndustryCapabilityProfile> = {
  "financial-services::pipeline-management":
    buildFinancialServicesPipelineManagementProfile,
  "financial-services::workflow-automation":
    buildFinancialServicesWorkflowAutomationProfile,
};

/** Hand-authored profiles win; the shared graph covers everything else. */
export function getIndustryCapabilityProfile(
  industrySlug: string,
  capabilitySlug: string,
): IndustryCapabilityProfile | null {
  const build = PROFILES[`${industrySlug}::${capabilitySlug}`];
  if (build) return build();
  return synthesizeIndustryCapabilityProfile(
    industrySlug,
    null,
    capabilitySlug,
  );
}

export function listIndustryCapabilityProfiles(): IndustryCapabilityProfile[] {
  return listIndustryCapabilityParams()
    .map((params) =>
      getIndustryCapabilityProfile(params.industrySlug, params.capabilitySlug),
    )
    .filter((profile): profile is IndustryCapabilityProfile => profile != null);
}

export function listIndustryCapabilityParams(): Array<{
  industrySlug: string;
  capabilitySlug: string;
}> {
  const params: Array<{ industrySlug: string; capabilitySlug: string }> = [];
  const seen = new Set<string>();

  for (const industrySlug of INDUSTRY_SLUGS) {
    for (const capabilitySlug of listCrmCapabilitySlugs()) {
      seen.add(`${industrySlug}::${capabilitySlug}`);
      params.push({ industrySlug, capabilitySlug });
    }
  }

  // Hand-authored pairs outside the shared capability set still need params.
  for (const key of Object.keys(PROFILES)) {
    if (seen.has(key)) continue;
    const [industrySlug, capabilitySlug] = key.split("::");
    params.push({ industrySlug: industrySlug!, capabilitySlug: capabilitySlug! });
  }

  return params;
}

export {
  buildFinancialServicesPipelineManagementProfile,
  buildFinancialServicesWorkflowAutomationProfile,
};
