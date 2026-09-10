import type { GuidePage } from "@/domain/schemas";
import {
  classifyGuideAuditType,
  isFactoryProductPackGuide,
  isIndustryVariantGuide,
  isProductExplainerGuide,
} from "@/services/seo/guides-index-worthiness/classify";
import type { EnrichmentGuideType } from "./types";

function factoryKindFromSlug(guide: GuidePage): string | null {
  if (guide.productSlugs.length !== 1) return null;
  const productSlug = guide.productSlugs[0]!;
  for (const kind of [
    "implementation",
    "migration",
    "setup",
    "plans",
    "worth-it",
  ] as const) {
    const expected =
      kind === "worth-it"
        ? `is-${productSlug}-worth-it`
        : `${productSlug}-${kind}`;
    if (guide.slug === expected) return kind;
  }
  return null;
}

/**
 * Map an existing guide to an enrichment taxonomy type.
 * Does not force one template — factory kind and topic drive the result.
 */
export function classifyEnrichmentGuideType(
  guide: GuidePage,
): EnrichmentGuideType {
  if (isProductExplainerGuide(guide)) return "PRODUCT_EXPLAINER";
  if (isIndustryVariantGuide(guide)) return "INDUSTRY_GUIDE";

  const factoryKind = factoryKindFromSlug(guide);
  if (factoryKind === "implementation" || factoryKind === "setup") {
    return "IMPLEMENTATION_GUIDE";
  }
  if (factoryKind === "migration") return "MIGRATION_GUIDE";
  if (factoryKind === "plans") return "COST_GUIDE";
  if (factoryKind === "worth-it") return "DECISION_GUIDE";

  const audit = classifyGuideAuditType(guide);
  switch (audit) {
    case "buying-guide":
      return "BUYING_GUIDE";
    case "pricing-guide":
      return "COST_GUIDE";
    case "software-selection":
    case "comparison-education":
      return "DECISION_GUIDE";
    case "migration-guide":
      return "MIGRATION_GUIDE";
    case "industry-guide":
      return "INDUSTRY_GUIDE";
    case "use-case-guide":
      return "USE_CASE_GUIDE";
    case "implementation-guide":
      return "IMPLEMENTATION_GUIDE";
    case "educational-explainer":
    case "how-to":
    case "methodology":
    case "trend-research":
      return "CATEGORY_EDUCATION";
    case "product-explainer":
      return "PRODUCT_EXPLAINER";
    case "checklist":
      return guide.topicType === "integration"
        ? "INTEGRATION_GUIDE"
        : "DECISION_GUIDE";
    case "product-pack-factory":
      return isFactoryProductPackGuide(guide)
        ? "IMPLEMENTATION_GUIDE"
        : "OTHER";
    default:
      break;
  }

  switch (guide.topicType) {
    case "feature-explainer":
      return "FEATURE_GUIDE";
    case "integration":
      return "INTEGRATION_GUIDE";
    case "use-case":
      return "USE_CASE_GUIDE";
    case "pricing-education":
      return "COST_GUIDE";
    case "buying-guide":
      return "BUYING_GUIDE";
    case "implementation":
    case "setup":
      return "IMPLEMENTATION_GUIDE";
    case "migration":
      return "MIGRATION_GUIDE";
    case "selection":
    case "comparison-education":
      return "DECISION_GUIDE";
    case "fundamental":
    case "how-it-works":
    case "strategy":
      return "CATEGORY_EDUCATION";
    default:
      return "OTHER";
  }
}
