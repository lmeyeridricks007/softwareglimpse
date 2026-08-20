import type { GuidePage } from "@/domain";
import type { GuideAssetGuideKind } from "@/domain/schemas/asset-discovery";

/**
 * Classify guide for asset judgment:
 * vendor-neutral conceptual pages ≠ product implementation pages.
 */
export function classifyGuideKind(guide: GuidePage): GuideAssetGuideKind {
  const slug = guide.slug.toLowerCase();
  const topic = guide.topicType;
  const products = guide.productSlugs ?? [];
  const isIndustry =
    slug.includes("financial-services") ||
    slug.includes("healthcare") ||
    slug.includes("retail") ||
    (guide.categorySlugs ?? []).some((c) => c.includes("industry"));

  if (isIndustry) return "industry-guide";

  // Topic-first for educational guides — productSlugs are often examples, not page subject
  if (topic === "fundamental" || topic === "how-it-works") {
    return "vendor-neutral-fundamental";
  }
  if (topic === "selection" || topic === "buying-guide") {
    return "vendor-neutral-selection";
  }
  if (topic === "pricing-education") return "vendor-neutral-pricing";
  if (topic === "comparison-education") return "comparison-education";
  if (topic === "strategy") return "strategy-guide";
  if (topic === "checklist") return "checklist-guide";
  if (topic === "feature-explainer" || slug.includes("-features")) {
    return "feature-guide";
  }
  if (slug.includes("requirement")) return "requirement-guide";
  if (topic === "use-case" || slug.includes("use-case")) return "use-case-guide";

  // Product-subject guides (implementation/setup/migration with or without productSlugs)
  if (topic === "implementation") {
    return products.length > 0 ? "product-implementation" : "product-implementation";
  }
  if (topic === "setup") return "product-setup";
  if (topic === "migration") return "product-migration";

  // Explicit product-named guides (e.g. hubspot-setup) without educational topic
  if (
    products.length === 1 &&
    (slug.includes(products[0]!) || slug.startsWith(products[0]!))
  ) {
    return "product-guide";
  }

  if (products.length > 0) return "product-guide";
  return "other";
}

export function isProductHeavyKind(kind: GuideAssetGuideKind): boolean {
  return (
    kind === "product-implementation" ||
    kind === "product-setup" ||
    kind === "product-migration" ||
    kind === "product-guide"
  );
}

export function isVendorNeutralKind(kind: GuideAssetGuideKind): boolean {
  return (
    kind === "vendor-neutral-fundamental" ||
    kind === "vendor-neutral-selection" ||
    kind === "vendor-neutral-pricing" ||
    kind === "comparison-education" ||
    kind === "strategy-guide"
  );
}

export function detectIndustryIds(guide: GuidePage): string[] {
  if (guide.slug.includes("financial-services")) return ["financial-services"];
  return [];
}

/** Heuristic: section title/body suggests pricing (not bare “plan” / “seat” in trial scripts). */
export function sectionLooksLikePricing(title: string, body?: string): boolean {
  const t = `${title} ${body ?? ""}`.toLowerCase();
  return /pric|tco|budget|per.?seat|seat.?cost|list.?price|billing.?model|cost.?calculator|add-?ons?|feature.?gate/.test(
    t,
  ) || (/\bcost\b/.test(t) && /(tier|subscription|seat)/.test(t));
}

export function sectionLooksLikeMigration(title: string, body?: string): boolean {
  const t = `${title} ${body ?? ""}`.toLowerCase();
  // Require migration-shaped language — plain "import" in trial scripts is not migration
  return /migrat|cutover|field.?map|data.?map|schema.?map|legacy.?crm|source.?to.?target/.test(
    t,
  );
}

export function sectionLooksLikeSecurity(title: string, body?: string): boolean {
  const t = `${title} ${body ?? ""}`.toLowerCase();
  return /secur|gdpr|privacy|compliance|permission|access.?control|sso|trust/.test(
    t,
  );
}

export function sectionLooksLikeDemo(title: string, body?: string): boolean {
  const t = `${title} ${body ?? ""}`.toLowerCase();
  return /demo|trial|evaluate|shortlist|walkthrough|see it/.test(t);
}

export function sectionLooksLikeWorkflow(title: string, body?: string): boolean {
  const t = `${title} ${body ?? ""}`.toLowerCase();
  return /workflow|pipeline|process|journey|stage|loop|how .+ work/.test(t);
}

export function sectionLooksLikeFieldMapping(title: string, body?: string): boolean {
  const t = `${title} ${body ?? ""}`.toLowerCase();
  return /field.?map|source.?to.?target|map your field|schema.?map/.test(t);
}
