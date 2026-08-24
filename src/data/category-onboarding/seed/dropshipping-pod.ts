import { CategoryDefinitionSchema, type CategoryDefinition } from "@/domain";

/**
 * Dropshipping & Print-on-Demand subcategory definition v1.0 — under parent ecommerce.
 * Product sourcing, POD merch, and inventory-free fulfillment cluster.
 */
export const dropshippingPodDefinition: CategoryDefinition = CategoryDefinitionSchema.parse({
  id: "cat-def-dropshipping-pod-v1",
  slug: "dropshipping-pod",
  name: "Dropshipping & Print-on-Demand",
  shortDescription:
    "Source products, POD merch, and fulfill without inventory — distinct from storefront platforms and 3PL shipping.",
  parentSlug: "ecommerce",
  aliases: [
    "dropshipping software",
    "print on demand software",
    "dropshipping sourcing",
    "POD fulfillment",
    "supplier catalog software",
  ],
  lifecycle: "active",
  configVersion: "1.0.0",
  scope: {
    definition:
      "Software whose primary job is dropshipping product sourcing or print-on-demand fulfillment — supplier catalogs, product import, POD mockups, and storefront integrations — not hosted storefront platforms, pure shipping-label tools, or third-party logistics without a self-serve software SKU.",
    includes: [
      { id: "inc-dropship-sourcing", label: "Dropshipping supplier sourcing and import" },
      { id: "inc-pod-fulfillment", label: "Print-on-demand catalog and fulfillment networks" },
      { id: "inc-supplier-catalog", label: "Curated supplier catalogs and product discovery" },
      { id: "inc-storefront-sync", label: "Storefront integrations (Shopify, WooCommerce, etc.)" },
    ],
    excludes: [
      {
        id: "exc-storefront",
        label: "Hosted storefront platforms as primary job",
        notes: "Shopify/Wix — parent ecommerce storefront cluster",
      },
      {
        id: "exc-3pl-only",
        label: "Third-party logistics without sourcing/POD software SKU",
        notes: "ShipBob-class 3PL — fulfillment-shipping cluster",
      },
      {
        id: "exc-shipping-labels",
        label: "Pure shipping-label and carrier tools",
        notes: "Sendcloud — fulfillment-shipping cluster",
      },
      {
        id: "exc-marketplace-only",
        label: "Pure marketplaces without merchant software",
        notes: "Not a dropshipping software peer",
      },
    ],
    adjacentCategorySlugs: [
      "ecommerce",
      "fulfillment-shipping",
      "marketing",
    ],
    classificationNotes: [
      "Spocket is curated US/EU supplier sourcing — editorial anchor for dropshipping",
      "AliDrop is AliExpress import automation — distinct from curated Spocket catalog",
      "Printify is POD fulfillment network — not a storefront platform",
      "Use parent ecommerce-finder with fulfillment-model constraint — no dedicated subcategory finder UI",
      "Never rank dropshipping sourcing, AliExpress import, and POD networks as one undifferentiated #1",
    ],
  },
  features: [
    feat(
      "dropshipping-sourcing",
      "Dropshipping sourcing",
      "Supplier discovery, vetting, and product sourcing.",
      "core",
      true,
      true,
    ),
    feat(
      "print-on-demand",
      "Print on demand",
      "POD catalog, mockups, and fulfillment network.",
      "core",
      true,
      true,
    ),
    feat(
      "supplier-catalog",
      "Supplier catalog",
      "Curated product catalogs and import-ready listings.",
      "core",
      true,
      true,
    ),
    feat(
      "product-import",
      "Product import",
      "One-click import to storefront with pricing rules.",
      "core",
      true,
      true,
    ),
    feat(
      "storefront-integrations",
      "Storefront integrations",
      "Shopify, WooCommerce, and marketplace connectors.",
      "important",
      true,
      true,
    ),
  ],
  researchRequirements: [
    { domain: "identity", level: "required", featureSlugs: [] },
    {
      domain: "pricing",
      level: "required",
      featureSlugs: [],
      notes: "Subscription vs per-order vs product-margin pricing",
    },
    { domain: "plans", level: "required", featureSlugs: [] },
    {
      domain: "features",
      level: "required",
      featureSlugs: ["dropshipping-sourcing", "print-on-demand"],
    },
    { domain: "integrations", level: "required", featureSlugs: [] },
    { domain: "limits", level: "required", featureSlugs: [] },
  ],
  editorialMethodology: {
    id: "methodology-dropshipping-pod-v1",
    slug: "dropshipping-pod-editorial",
    name: "Dropshipping & Print-on-Demand Editorial Methodology",
    version: "1.0.0",
    categorySlug: "dropshipping-pod",
    description:
      "SoftwareGlimpse evaluates dropshipping and POD platforms on ease of use, fulfillment job fit, sourcing depth, POD catalog, supplier quality, storefront integrations, scalability, and value. Products are ranked within fulfillment-model clusters only.",
    criteria: [
      crit("ease-of-use", "Ease of use", "Import workflow and daily merchant operations.", 14, 0, ["features:product-import"]),
      crit("fulfillment-job-fit", "Fulfillment job fit", "Fit to curated sourcing vs AliExpress import vs POD.", 16, 1, ["features:dropshipping-sourcing", "features:print-on-demand"]),
      crit("dropshipping-sourcing", "Dropshipping sourcing", "Supplier discovery and vetting depth.", 14, 2, ["features:dropshipping-sourcing"]),
      crit("print-on-demand", "Print on demand", "POD catalog, mockups, and fulfillment quality.", 14, 3, ["features:print-on-demand"]),
      crit("supplier-catalog", "Supplier catalog", "Catalog breadth and import-ready listings.", 12, 4, ["features:supplier-catalog"]),
      crit("storefront-integrations", "Storefront integrations", "Shopify, WooCommerce, and marketplace sync.", 12, 5, ["features:storefront-integrations"]),
      crit("value-for-money", "Value for money", "Subscription vs per-order TCO.", 10, 6, ["pricing", "plans"]),
      crit("scalability", "Scalability", "Order volume, SKU limits, and multi-store.", 8, 7, ["limits"]),
    ],
    notes: "Weights sum to 100. Score within fulfillment-model clusters. Affiliate economics excluded.",
  },
  comparisonCriteria: [
    cmp("starting-pricing", "Starting pricing", "factual", 0, "high"),
    cmp("pricing-model", "Pricing model (sub vs per-order)", "factual", 1, "high"),
    cmp("dropshipping-sourcing", "Dropshipping sourcing", "editorial", 2, "high", "dropshipping-sourcing"),
    cmp("print-on-demand", "Print on demand", "editorial", 3, "high", "print-on-demand"),
    cmp("supplier-catalog", "Supplier catalog", "editorial", 4, "high", "supplier-catalog"),
    cmp("storefront-integrations", "Storefront integrations", "editorial", 5, "medium", "storefront-integrations"),
  ],
  pricingDimensions: [
    { id: "pd-dpp-subscription", slug: "subscription", name: "Monthly subscription", enginePrimitive: "flat", required: true },
    { id: "pd-dpp-orders", slug: "orders", name: "Per-order / product margin", enginePrimitive: "usage", required: true },
    { id: "pd-dpp-plans", slug: "plans", name: "Plan tiers", enginePrimitive: "flat", required: true },
  ],
  pricingCapability: "PARTIAL",
  pricingCapabilityNotes: [
    "Subscription and per-order primitives supported; category TCO calculator not built",
  ],
  recommendationDimensions: [
    { id: "rd-dpp-job", slug: "primary-job", name: "Primary job (sourcing vs POD vs import)" },
    { id: "rd-dpp-store", slug: "storefront", name: "Storefront platform" },
    { id: "rd-dpp-catalog", slug: "catalog-type", name: "Curated vs marketplace sourcing" },
    { id: "rd-dpp-budget", slug: "budget", name: "Budget" },
  ],
  finderReadiness: "NOT_READY",
  finderNotes: [
    "Use parent ecommerce-finder with fulfillment-model constraint — no dedicated subcategory finder UI",
    "Dropshipping/POD job routing through parent ecommerce finder dimensions",
  ],
  useCases: [
    { slug: "dropshipping-sourcing", name: "Dropshipping sourcing", pageEligibility: "content-candidate" },
  ],
  audienceSlugs: ["operations", "marketing"],
  businessSizeSlugs: ["micro", "small-business"],
  businessTypeSlugs: ["ecommerce", "startup", "agency"],
  seedProductSlugs: ["spocket", "alidrop", "printify"],
  queryAliases: [
    "dropshipping software",
    "print on demand software",
    "dropshipping sourcing",
    "POD fulfillment",
  ],
  requiredResearchDomains: ["identity", "pricing", "plans", "features", "integrations", "limits"],
  optionalResearchDomains: ["free-trial"],
  pricingModelsSupported: ["flat", "usage", "hybrid", "credits"],
  notes: [
    "Tier 1 ecommerce subcategory — dropshipping/POD affiliate cluster",
    "Do not invent product scores; do not auto-publish pages",
  ],
  supportingKnowledgeAreas: ["fundamentals", "selection", "pricing", "features"],
});

function feat(
  slug: string,
  name: string,
  description: string,
  importance: "core" | "important" | "optional" | "specialist",
  comparisonRelevant: boolean,
  finderRelevant: boolean,
  researchGuidance?: string,
) {
  return {
    id: `feat-dpp-${slug}`,
    slug,
    name,
    description,
    importance,
    comparisonRelevant,
    finderRelevant,
    researchGuidance,
    aliases: [],
  };
}

function crit(
  slug: string,
  name: string,
  description: string,
  weight: number,
  displayOrder: number,
  evidenceRequirements: string[],
) {
  return {
    id: `crit-dpp-${slug}`,
    slug,
    name,
    description,
    weight,
    evidenceRequirements,
    scoringScaleMin: 0,
    scoringScaleMax: 10,
    categorySlug: "dropshipping-pod",
    displayOrder,
  };
}

function cmp(
  slug: string,
  name: string,
  kind: "factual" | "editorial",
  displayOrder: number,
  decisionImportance: "high" | "medium" | "low",
  featureSlug?: string,
) {
  return {
    id: `cmp-dpp-${slug}`,
    slug,
    name,
    kind,
    displayOrder,
    decisionImportance,
    ...(featureSlug ? { featureSlug } : {}),
  };
}
