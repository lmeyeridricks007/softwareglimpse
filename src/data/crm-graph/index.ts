/**
 * Shared CRM graph: capability, use-case, feature, and requirement definitions
 * plus the synthesizers that turn them into valid presentation profiles for any
 * industry. Hand-authored profiles always take precedence in the registries.
 */

export {
  CRM_CAPABILITIES,
  getCrmCapabilityDefinition,
  type CrmCapabilityDefinition,
  type CrmCapabilityRequirementDefinition,
  type CrmCapabilityTradeoff,
} from "./capabilities";

export {
  CRM_USE_CASES,
  getCrmUseCaseDefinition,
  type CrmUseCaseCapabilityDefinition,
  type CrmUseCaseDefinition,
  type CrmUseCaseRequirementDefinition,
} from "./use-cases";

export {
  CRM_FEATURES,
  getCrmFeatureDefinition,
  type CrmFeatureDefinition,
  type CrmFeatureDimensionDefinition,
} from "./features";

export {
  CRM_REQUIREMENTS,
  getCrmRequirementDefinition,
  type CrmRequirementDefinition,
  type CrmRequirementFeatureLink,
} from "./requirements";

export {
  crmCapabilitySlugsByHubPriority,
  crmFeaturePageSlug,
  synthesizeFeatureDetailProfile,
  synthesizeIndustryCapabilityProfile,
  synthesizeIndustryUseCaseProfile,
  synthesizeRequirementDetailProfile,
} from "./synthesize";

import { CRM_CAPABILITIES } from "./capabilities";
import { CRM_FEATURES } from "./features";
import { CRM_REQUIREMENTS } from "./requirements";
import { CRM_USE_CASES } from "./use-cases";

/** Industry hubs the shared graph can build pages for. */
export const INDUSTRY_SLUGS = [
  "small-business",
  "retail-ecommerce",
  "healthcare",
  "financial-services",
  "manufacturing",
  "real-estate",
  "education",
  "saas",
  "nonprofit",
  "hospitality",
  "transportation-logistics",
  "legal-services",
  "construction",
  "plumbing",
  "solar",
  "event-management",
  "private-equity",
  "venture-capital",
  "photography",
  "coaching",
  "investor-relations",
  "engineering",
  "music",
  "web-design",
  "security-companies",
] as const;

export type IndustrySlug = (typeof INDUSTRY_SLUGS)[number];

export function listCrmCapabilitySlugs(): string[] {
  return CRM_CAPABILITIES.map((item) => item.slug);
}

export function listCrmUseCaseSlugs(): string[] {
  return CRM_USE_CASES.map((item) => item.slug);
}

export function listCrmFeatureSlugs(): string[] {
  return CRM_FEATURES.map((item) => item.slug);
}

export function listCrmRequirementSlugs(): string[] {
  return CRM_REQUIREMENTS.map((item) => item.slug);
}

/** Industry hub priority id → shared capability slug. */
const HUB_PRIORITY_TO_CAPABILITY: Record<string, string> = Object.fromEntries(
  CRM_CAPABILITIES.map((item) => [item.hubPriorityId, item.slug]),
);

export function hubPriorityCapabilitySlug(
  priorityId: string,
): string | undefined {
  return HUB_PRIORITY_TO_CAPABILITY[priorityId];
}

/** Industry hub use-case id → shared use-case slug. */
const HUB_USE_CASE_TO_SLUG: Record<string, string> = Object.fromEntries(
  CRM_USE_CASES.map((item) => [item.hubUseCaseId, item.slug]),
);

export function hubUseCaseSlug(useCaseId: string): string | undefined {
  return HUB_USE_CASE_TO_SLUG[useCaseId];
}
