import { identityPath } from "@/seo/canonical";
import type { LinkModuleId } from "@/services/internal-linking/types";

/**
 * Place an injected edge in the module that matches the destination
 * (not a catch-all relatedGuides dump).
 */
export function moduleForTarget(toPath: string): LinkModuleId {
  const p = identityPath(toPath);
  if (p.startsWith("/guides/")) return "relatedGuides";
  if (p.startsWith("/software/")) return "relatedProducts";
  if (p.startsWith("/compare/")) return "relatedComparisons";
  if (p.startsWith("/use-cases/")) return "relatedUseCases";
  if (p.startsWith("/industries/")) return "relatedIndustries";
  if (p.startsWith("/capabilities/")) return "relatedCapabilities";
  if (p.startsWith("/features/")) return "relatedFeatures";
  if (p.startsWith("/requirements/")) return "relatedRequirements";
  if (p.startsWith("/best/") || p.startsWith("/categories/")) {
    return "relatedResources";
  }
  if (p.startsWith("/research/") || p.startsWith("/tools/")) {
    return "relatedResources";
  }
  return "relatedResources";
}
