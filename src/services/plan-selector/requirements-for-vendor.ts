import {
  PLAN_REQUIREMENTS,
  type PlanRequirementDef,
} from "@/data/config/plan-selector/requirements";
import type { PricingSnapshot } from "@/services/pricing";

/**
 * Only expose requirements that appear in the vendor’s verified featureSupport.
 * AI group included only when ai-assistance (or similar) is researched.
 */
export function availableRequirementsForVendor(
  snapshot: PricingSnapshot,
): PlanRequirementDef[] {
  const known = new Set(
    snapshot.featureSupport.map((f) => f.featureSlug),
  );
  return PLAN_REQUIREMENTS.filter((req) => {
    if (!known.has(req.featureSlug)) return false;
    if (req.group === "ai") {
      const entry = snapshot.featureSupport.find(
        (f) => f.featureSlug === req.featureSlug,
      );
      if (!entry || entry.availability === "unknown") return false;
      if (entry.planSlugs.length === 0) return false;
    }
    return true;
  });
}
