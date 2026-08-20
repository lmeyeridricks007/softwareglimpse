import { DEFAULT_FRESHNESS_POLICIES, getFreshnessMaxAgeDays } from "@/domain";

/**
 * CRM pricing engine config v1.
 * Staleness reuses research freshness policies for the pricing domain.
 */
export const CRM_PRICING_CONFIG = {
  version: "crm-pricing-v1",
  stalenessMaxAgeDays: getFreshnessMaxAgeDays(
    "pricing",
    DEFAULT_FRESHNESS_POLICIES,
  ),
  /** Primary CRM category slug for calculator pool. */
  primaryCategorySlug: "crm",
} as const;

export type CrmPricingConfig = typeof CRM_PRICING_CONFIG;
