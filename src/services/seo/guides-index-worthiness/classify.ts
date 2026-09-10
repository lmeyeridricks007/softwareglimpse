import type { GuidePage } from "@/domain/schemas";
import type { GuideAuditType } from "./types";

/**
 * Product-pack factory kinds. Kept local (no import from `product-guides/kinds`)
 * so search-index gates stay free of `node:fs` and safe for client bundles via
 * `quality-gates` → `isEntityIndexable`.
 */
const FACTORY_PACK_KINDS = [
  "implementation",
  "migration",
  "setup",
  "plans",
  "worth-it",
] as const;

function factoryProductGuideKind(guide: {
  slug: string;
  productSlugs: readonly string[];
}): (typeof FACTORY_PACK_KINDS)[number] | null {
  if (guide.productSlugs.length !== 1) return null;
  const productSlug = guide.productSlugs[0]!;
  for (const kind of FACTORY_PACK_KINDS) {
    const expected =
      kind === "worth-it"
        ? `is-${productSlug}-worth-it`
        : `${productSlug}-${kind}`;
    if (guide.slug === expected) return kind;
  }
  return null;
}

/** Product-pack factory page (implementation / migration / setup / plans / worth-it). */
export function isFactoryProductPackGuide(
  guide: Pick<GuidePage, "slug" | "productSlugs">,
): boolean {
  return factoryProductGuideKind(guide) != null;
}

/** Seeded product explainer like `what-is-pipedrive` — high template risk across products. */
export function isProductExplainerGuide(guide: Pick<GuidePage, "slug" | "productSlugs">): boolean {
  if (guide.productSlugs.length !== 1) return false;
  const product = guide.productSlugs[0]!;
  return guide.slug === `what-is-${product}`;
}

/** Industry-prefixed CRM-style educational variants. */
export function isIndustryVariantGuide(guide: Pick<GuidePage, "slug">): boolean {
  return (
    guide.slug.startsWith("financial-services-") ||
    guide.slug.includes("-industry-") ||
    /^(healthcare|real-estate|education|nonprofit)-crm/.test(guide.slug)
  );
}

export function classifyGuideAuditType(guide: GuidePage): GuideAuditType {
  if (isFactoryProductPackGuide(guide)) return "product-pack-factory";
  if (isProductExplainerGuide(guide)) return "product-explainer";
  if (isIndustryVariantGuide(guide)) return "industry-guide";

  switch (guide.topicType) {
    case "buying-guide":
      return "buying-guide";
    case "pricing-education":
      return "pricing-guide";
    case "selection":
      return "software-selection";
    case "migration":
      return "migration-guide";
    case "implementation":
    case "setup":
      return "implementation-guide";
    case "use-case":
      return "use-case-guide";
    case "how-it-works":
      return "how-to";
    case "fundamental":
    case "feature-explainer":
      return "educational-explainer";
    case "comparison-education":
      return "comparison-education";
    case "checklist":
      return "checklist";
    case "strategy":
    case "troubleshooting":
      return "trend-research";
    default:
      return "other";
  }
}

export function guideTargetIntent(guide: GuidePage): string {
  const cat = guide.categorySlugs[0] ?? "software";
  const type = classifyGuideAuditType(guide);
  if (type === "product-pack-factory") {
    const kind = factoryProductGuideKind(guide);
    return `${guide.productSlugs[0] ?? "product"}:${kind ?? "pack"}`;
  }
  if (type === "product-explainer") {
    return `what-is:${guide.productSlugs[0]}`;
  }
  return `${cat}:${guide.topicType}:${guide.journeyStage}`;
}

/** Normalize titles for intent clustering (strip filler words). */
export function normalizeIntentTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/softwareglimpse/g, "")
    .replace(
      /\b(best|top|guide|software|platforms?|tools?|the|a|an|for|and|to|of|your|how|what|is|complete|ultimate|beginner.?s?)\b/g,
      " ",
    )
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function intentClusterKey(guide: GuidePage): string {
  const cat = guide.categorySlugs[0] ?? "none";
  const type = classifyGuideAuditType(guide);
  // Factory packs cluster by kind across products (boilerplate mesh).
  if (type === "product-pack-factory") {
    return `factory:${factoryProductGuideKind(guide) ?? "pack"}`;
  }
  if (type === "product-explainer") {
    return `product-explainer:${cat}`;
  }
  return `${cat}|${guide.topicType}|${normalizeIntentTitle(guide.title)}`;
}
