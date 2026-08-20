import type { CategoryHubProfile } from "@/domain";
import { buildCrmCategoryHubProfile } from "./crm";
import { buildCustomerServiceCategoryHubProfile } from "./customer-service";
import { buildEcommerceCategoryHubProfile } from "./ecommerce";
import { buildHrCategoryHubProfile } from "./hr";

const PROFILES: Record<string, () => CategoryHubProfile> = {
  crm: buildCrmCategoryHubProfile,
  hr: buildHrCategoryHubProfile,
  ecommerce: buildEcommerceCategoryHubProfile,
  "customer-service": buildCustomerServiceCategoryHubProfile,
};

export function getCategoryHubProfile(
  categorySlug: string,
): CategoryHubProfile | null {
  const build = PROFILES[categorySlug];
  return build ? build() : null;
}

export function listCategoryHubProfiles(): CategoryHubProfile[] {
  return Object.keys(PROFILES).map((slug) => PROFILES[slug]!());
}

export {
  buildCrmCategoryHubProfile,
  buildHrCategoryHubProfile,
  buildEcommerceCategoryHubProfile,
  buildCustomerServiceCategoryHubProfile,
};
