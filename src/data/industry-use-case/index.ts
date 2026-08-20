import type { IndustryUseCaseProfile } from "@/domain";
import {
  INDUSTRY_SLUGS,
  listCrmUseCaseSlugs,
  synthesizeIndustryUseCaseProfile,
} from "@/data/crm-graph";
import { buildFinancialServicesAdvisoryUseCaseProfile } from "./financial-services-advisory";
import { buildFinancialServicesComplexSalesUseCaseProfile } from "./financial-services-complex-sales";

type ProfileKey = `${string}::${string}`;

const PROFILES: Record<ProfileKey, () => IndustryUseCaseProfile> = {
  "financial-services::advisory-relationship-management":
    buildFinancialServicesAdvisoryUseCaseProfile,
  "financial-services::complex-sales-processes":
    buildFinancialServicesComplexSalesUseCaseProfile,
};

/** Hand-authored profiles win; the shared graph covers everything else. */
export function getIndustryUseCaseProfile(
  industrySlug: string,
  useCaseSlug: string,
): IndustryUseCaseProfile | null {
  const build = PROFILES[`${industrySlug}::${useCaseSlug}`];
  if (build) return build();
  return synthesizeIndustryUseCaseProfile(industrySlug, null, useCaseSlug);
}

export function listIndustryUseCaseProfiles(): IndustryUseCaseProfile[] {
  return listIndustryUseCaseParams()
    .map((params) =>
      getIndustryUseCaseProfile(params.industrySlug, params.useCaseSlug),
    )
    .filter((profile): profile is IndustryUseCaseProfile => profile != null);
}

export function listIndustryUseCaseParams(): Array<{
  industrySlug: string;
  useCaseSlug: string;
}> {
  const params: Array<{ industrySlug: string; useCaseSlug: string }> = [];
  const seen = new Set<string>();

  for (const industrySlug of INDUSTRY_SLUGS) {
    for (const useCaseSlug of listCrmUseCaseSlugs()) {
      seen.add(`${industrySlug}::${useCaseSlug}`);
      params.push({ industrySlug, useCaseSlug });
    }
  }

  // Hand-authored pairs outside the shared use-case set still need params.
  for (const key of Object.keys(PROFILES)) {
    if (seen.has(key)) continue;
    const [industrySlug, useCaseSlug] = key.split("::");
    params.push({ industrySlug: industrySlug!, useCaseSlug: useCaseSlug! });
  }

  return params;
}

export {
  buildFinancialServicesAdvisoryUseCaseProfile,
  buildFinancialServicesComplexSalesUseCaseProfile,
};
