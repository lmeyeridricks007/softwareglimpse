import { CategoryDefinitionSchema, type CategoryDefinition } from "@/domain";

/**
 * Fulfillment & Shipping subcategory definition v1.0 — under parent ecommerce.
 * Order fulfillment, shipping labels, returns, and 3PL outsourcing cluster.
 */
export const fulfillmentShippingDefinition: CategoryDefinition = CategoryDefinitionSchema.parse({
  id: "cat-def-fulfillment-shipping-v1",
  slug: "fulfillment-shipping",
  name: "Fulfillment & Shipping",
  shortDescription:
    "Ship orders, manage returns, and outsource fulfillment — distinct from storefront platforms and dropshipping sourcing.",
  parentSlug: "ecommerce",
  aliases: [
    "fulfillment software",
    "shipping software",
    "order fulfillment software",
    "3PL fulfillment software",
    "returns management software",
  ],
  lifecycle: "active",
  configVersion: "1.0.0",
  scope: {
    definition:
      "Software whose primary job is order fulfillment and shipping — label generation, carrier integrations, returns management, and 3PL outsourcing — not hosted storefront platforms, dropshipping product sourcing, or pure marketing automation.",
    includes: [
      { id: "inc-order-fulfillment", label: "Order fulfillment workflows and pick/pack/ship" },
      { id: "inc-shipping-labels", label: "Shipping label generation and rate shopping" },
      { id: "inc-returns", label: "Returns management and reverse logistics" },
      { id: "inc-3pl", label: "3PL fulfillment outsourcing and warehouse networks" },
      { id: "inc-carrier", label: "Carrier integrations and multi-carrier shipping" },
    ],
    excludes: [
      {
        id: "exc-storefront",
        label: "Hosted storefront platforms as primary job",
        notes: "Shopify/Wix — parent ecommerce storefront cluster",
      },
      {
        id: "exc-dropship-sourcing",
        label: "Dropshipping product sourcing without shipping core",
        notes: "Spocket/AliDrop — dropshipping-pod cluster when sourcing-primary",
      },
      {
        id: "exc-pod-only",
        label: "Print-on-demand networks without shipping-label core",
        notes: "Printify — dropshipping-pod cluster when POD-primary",
      },
      {
        id: "exc-3pl-service-only",
        label: "Third-party logistics without self-serve software SKU",
        notes: "Landscape only — ShipBob has software SKU and belongs here",
      },
    ],
    adjacentCategorySlugs: [
      "ecommerce",
      "dropshipping-pod",
      "marketing",
    ],
    classificationNotes: [
      "ShipBob is 3PL fulfillment with merchant software portal — editorial anchor for outsourced fulfillment",
      "Sendcloud is multi-carrier shipping labels — distinct from 3PL warehouse outsourcing",
      "Spocket and AliDrop appear when merchant also needs sourcing alongside shipping stack",
      "Use parent ecommerce-finder with integration filter — no dedicated subcategory finder UI",
      "Never rank 3PL outsourcing, shipping-label tools, and sourcing apps as one undifferentiated #1",
    ],
  },
  features: [
    feat(
      "order-fulfillment",
      "Order fulfillment",
      "Pick, pack, ship workflows and order routing.",
      "core",
      true,
      true,
    ),
    feat(
      "shipping-labels",
      "Shipping labels",
      "Label generation, rate shopping, and batch printing.",
      "core",
      true,
      true,
    ),
    feat(
      "returns-management",
      "Returns management",
      "Return portals, RMA workflows, and reverse logistics.",
      "core",
      true,
      true,
    ),
    feat(
      "3pl-fulfillment",
      "3PL fulfillment",
      "Outsourced warehouse, inventory, and fulfillment network.",
      "core",
      true,
      true,
    ),
    feat(
      "carrier-integrations",
      "Carrier integrations",
      "Multi-carrier rates, tracking, and delivery options.",
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
      notes: "Per-label vs per-order vs 3PL storage and pick fees",
    },
    { domain: "plans", level: "required", featureSlugs: [] },
    {
      domain: "features",
      level: "required",
      featureSlugs: ["order-fulfillment", "shipping-labels"],
    },
    { domain: "integrations", level: "required", featureSlugs: [] },
    { domain: "limits", level: "required", featureSlugs: [] },
  ],
  editorialMethodology: {
    id: "methodology-fulfillment-shipping-v1",
    slug: "fulfillment-shipping-editorial",
    name: "Fulfillment & Shipping Editorial Methodology",
    version: "1.0.0",
    categorySlug: "fulfillment-shipping",
    description:
      "SoftwareGlimpse evaluates fulfillment and shipping platforms on ease of use, fulfillment job fit, order workflows, shipping labels, returns, 3PL depth, carrier integrations, scalability, and value. Products are ranked within fulfillment job clusters only.",
    criteria: [
      crit("ease-of-use", "Ease of use", "Daily shipping workflow and admin setup.", 12, 0, ["features:shipping-labels"]),
      crit("fulfillment-job-fit", "Fulfillment job fit", "Fit to 3PL outsourcing vs labels vs returns.", 14, 1, ["features:order-fulfillment", "features:3pl-fulfillment"]),
      crit("order-fulfillment", "Order fulfillment", "Pick/pack/ship and order routing depth.", 14, 2, ["features:order-fulfillment"]),
      crit("shipping-labels", "Shipping labels", "Rate shopping, label generation, and batching.", 12, 3, ["features:shipping-labels"]),
      crit("returns-management", "Returns management", "Return portals and reverse logistics.", 10, 4, ["features:returns-management"]),
      crit("carrier-integrations", "Carrier integrations", "Multi-carrier rates and tracking.", 12, 5, ["features:carrier-integrations"]),
      crit("3pl-fulfillment", "3PL fulfillment", "Warehouse network and outsourced fulfillment.", 10, 6, ["features:3pl-fulfillment"]),
      crit("value-for-money", "Value for money", "Per-label vs 3PL fee TCO.", 10, 7, ["pricing", "plans"]),
      crit("scalability", "Scalability", "Order volume, warehouses, and multi-channel.", 6, 8, ["limits"]),
    ],
    notes: "Weights sum to 100. Score within fulfillment job clusters. Affiliate economics excluded.",
  },
  comparisonCriteria: [
    cmp("starting-pricing", "Starting pricing", "factual", 0, "high"),
    cmp("pricing-model", "Pricing model (label vs 3PL)", "factual", 1, "high"),
    cmp("order-fulfillment", "Order fulfillment", "editorial", 2, "high", "order-fulfillment"),
    cmp("shipping-labels", "Shipping labels", "editorial", 3, "high", "shipping-labels"),
    cmp("returns-management", "Returns management", "editorial", 4, "medium", "returns-management"),
    cmp("3pl-fulfillment", "3PL fulfillment", "editorial", 5, "high", "3pl-fulfillment"),
    cmp("carrier-integrations", "Carrier integrations", "editorial", 6, "medium", "carrier-integrations"),
  ],
  pricingDimensions: [
    { id: "pd-fs-labels", slug: "labels", name: "Per-label / shipment", enginePrimitive: "usage", required: true },
    { id: "pd-fs-3pl", slug: "3pl-fees", name: "3PL storage & pick fees", enginePrimitive: "usage", required: true },
    { id: "pd-fs-plans", slug: "plans", name: "Plan tiers", enginePrimitive: "flat", required: true },
  ],
  pricingCapability: "PARTIAL",
  pricingCapabilityNotes: [
    "Per-label and 3PL fee primitives supported; category TCO calculator not built",
  ],
  recommendationDimensions: [
    { id: "rd-fs-job", slug: "primary-job", name: "Primary job (3PL vs labels vs returns)" },
    { id: "rd-fs-volume", slug: "order-volume", name: "Order volume and shipping mix" },
    { id: "rd-fs-store", slug: "storefront", name: "Storefront and marketplace stack" },
    { id: "rd-fs-budget", slug: "budget", name: "Budget" },
  ],
  finderReadiness: "NOT_READY",
  finderNotes: [
    "Use parent ecommerce-finder with integration filter — no dedicated subcategory finder UI",
    "Fulfillment/shipping job routing through parent ecommerce finder dimensions",
  ],
  useCases: [
    { slug: "order-fulfillment", name: "Order fulfillment", pageEligibility: "content-candidate" },
  ],
  audienceSlugs: ["operations"],
  businessSizeSlugs: ["micro", "small-business", "mid-market"],
  businessTypeSlugs: ["ecommerce", "startup", "agency"],
  seedProductSlugs: ["shipbob", "sendcloud", "spocket", "alidrop"],
  queryAliases: [
    "fulfillment software",
    "shipping software",
    "order fulfillment software",
    "3PL fulfillment software",
  ],
  requiredResearchDomains: ["identity", "pricing", "plans", "features", "integrations", "limits"],
  optionalResearchDomains: ["free-trial"],
  pricingModelsSupported: ["usage", "flat", "hybrid", "per-seat"],
  notes: [
    "Tier 1 ecommerce subcategory — fulfillment/shipping affiliate cluster",
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
    id: `feat-fs-${slug}`,
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
    id: `crit-fs-${slug}`,
    slug,
    name,
    description,
    weight,
    evidenceRequirements,
    scoringScaleMin: 0,
    scoringScaleMax: 10,
    categorySlug: "fulfillment-shipping",
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
    id: `cmp-fs-${slug}`,
    slug,
    name,
    kind,
    displayOrder,
    decisionImportance,
    ...(featureSlug ? { featureSlug } : {}),
  };
}
