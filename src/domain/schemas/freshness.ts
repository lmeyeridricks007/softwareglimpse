import { z } from "zod";
import { ResearchDomainSchema, type ResearchDomain } from "./research-source";

/**
 * Starting freshness policies (days). Configurable — not hardcoded domain truths.
 */
export const FreshnessPolicySchema = z.object({
  domain: ResearchDomainSchema,
  maxAgeDays: z.number().int().positive(),
});

export type FreshnessPolicy = z.infer<typeof FreshnessPolicySchema>;

export const DEFAULT_FRESHNESS_POLICIES: FreshnessPolicy[] = [
  { domain: "pricing", maxAgeDays: 30 },
  { domain: "plans", maxAgeDays: 30 },
  { domain: "free-plan", maxAgeDays: 30 },
  { domain: "free-trial", maxAgeDays: 30 },
  { domain: "ai-capabilities", maxAgeDays: 30 },
  { domain: "features", maxAgeDays: 90 },
  { domain: "official-media", maxAgeDays: 90 },
  { domain: "integrations", maxAgeDays: 90 },
  { domain: "limits", maxAgeDays: 90 },
  { domain: "platforms", maxAgeDays: 180 },
  { domain: "deployment", maxAgeDays: 180 },
  { domain: "support", maxAgeDays: 180 },
  { domain: "security-compliance", maxAgeDays: 180 },
  { domain: "business-size-fit", maxAgeDays: 180 },
  { domain: "use-cases", maxAgeDays: 180 },
  { domain: "product-positioning", maxAgeDays: 180 },
  { domain: "company-information", maxAgeDays: 365 },
  { domain: "identity", maxAgeDays: 365 },
];

export function getFreshnessMaxAgeDays(
  domain: ResearchDomain,
  policies: FreshnessPolicy[] = DEFAULT_FRESHNESS_POLICIES,
): number {
  return policies.find((p) => p.domain === domain)?.maxAgeDays ?? 90;
}
