import { CategoryDefinitionSchema, type CategoryDefinition } from "@/domain";

/**
 * Website & Digital Presence decision-domain definition v1.0.
 * Site builders, landing pages, hosting panels, storefronts, and digital business marketplaces.
 */
export const websiteDigitalPresenceDefinition: CategoryDefinition =
  CategoryDefinitionSchema.parse({
    id: "cat-def-website-digital-presence-v1",
    slug: "website-digital-presence",
    name: "Website & Digital Presence",
    shortDescription:
      "Launch sites, optimize landing pages, run hosted storefronts, manage hosting control panels, and buy or sell digital businesses.",
    parentSlug: null,
    aliases: [
      "website builder software",
      "landing page builder",
      "website software",
      "digital presence platform",
      "online store builder",
    ],
    lifecycle: "active",
    configVersion: "1.0.0",
    scope: {
      definition:
        "Software whose primary job is launching or operating a web presence — site builders, landing pages, hosted storefronts, hosting/server control panels, AI site generation, or digital-business marketplaces. Buyers shopping across ecommerce, marketing, IT, and AI need a coherent hub; products stay in adjacent categories as secondaries when the core job differs.",
      includes: [
        { id: "inc-site-builder", label: "Website & SMB site builders" },
        { id: "inc-landing", label: "Landing pages & CRO" },
        { id: "inc-storefront", label: "Hosted ecommerce storefronts" },
        { id: "inc-hosting-panel", label: "Hosting / server control panels" },
        { id: "inc-marketplace", label: "Digital business buy/sell marketplaces" },
        { id: "inc-ai-site", label: "AI website generation" },
      ],
      excludes: [
        {
          id: "exc-map",
          label: "Marketing automation without page/site core",
          notes: "Prefer marketing for MAP-only purchases",
        },
        {
          id: "exc-fulfillment",
          label: "3PL / shipping labels without storefront",
          notes: "Prefer ecommerce fulfillment landscape",
        },
        {
          id: "exc-cloud-paas",
          label: "App PaaS / deploy platforms without panel licensing",
          notes: "Render/Fly.io stay it-development",
        },
        {
          id: "exc-llm",
          label: "General LLM assistants without site builder",
          notes: "ChatGPT-class tools stay ai-primary",
        },
      ],
      adjacentCategorySlugs: [
        "ecommerce",
        "marketing",
        "it-development",
        "ai",
      ],
      classificationNotes: [
        "Shopify is hosted storefront primary — not a landing-page or panel peer",
        "Leadpages is landing/CRO primary — not a full site builder or marketplace",
        "UENI and Wegic are site-builder primaries (local SMB vs AI prompt-to-site)",
        "Flippa is digital-business marketplace primary — not storefront software",
        "Plesk stays it-development primary; landscape only for hosting-panel jobs here",
        "Dedicated finder deferred — high scope risk; subcategory hubs under marketing/ecommerce first",
      ],
    },
    features: [
      feat("website-builder", "Website builder", "Drag-and-drop or AI site authoring.", "core", true, true),
      feat("landing-pages", "Landing pages", "Campaign landing pages, forms, and CRO.", "core", true, true),
      feat("online-storefront", "Online storefront", "Hosted ecommerce catalog and checkout.", "core", true, true),
      feat("hosting-control-panel", "Hosting control panel", "Server and site administration panels.", "specialist", true, true),
      feat("digital-business-marketplace", "Digital business marketplace", "Buy/sell sites, stores, and online businesses.", "specialist", true, true),
      feat("ai-site-generation", "AI site generation", "Prompt-to-site and AI layout generation.", "important", true, true),
      feat("cro-testing", "CRO & A/B testing", "Split tests, heatmaps, and conversion tooling.", "important", true, true),
      feat("integrations", "Integrations", "Payments, analytics, CRM, and domain/DNS depth.", "important", true, true),
    ],
    researchRequirements: [
      { domain: "identity", level: "required", featureSlugs: [] },
      { domain: "pricing", level: "required", featureSlugs: [], notes: "Plan tiers, transaction fees, panel licensing" },
      { domain: "plans", level: "required", featureSlugs: [] },
      { domain: "features", level: "required", featureSlugs: ["website-builder", "landing-pages", "online-storefront"] },
      { domain: "integrations", level: "required", featureSlugs: [] },
      { domain: "limits", level: "required", featureSlugs: [] },
      { domain: "free-trial", level: "recommended", featureSlugs: [] },
    ],
    editorialMethodology: {
      id: "methodology-website-digital-presence-v1",
      slug: "website-digital-presence-editorial",
      name: "Website & Digital Presence Editorial Methodology",
      version: "1.0.0",
      categorySlug: "website-digital-presence",
      description:
        "SoftwareGlimpse evaluates website and digital presence products on ease of use, web job fit, workflow depth, commerce, CRO, integrations, scalability, value, and AI assistance. Products are ranked within job clusters only.",
      criteria: [
        crit("ease-of-use", "Ease of use", "Learning curve for site owners and admins.", 12, 0, ["features:website-builder"]),
        crit("web-job-fit", "Web job fit", "Fit to storefront, builder, landing, panel, marketplace, or AI-site cluster.", 15, 1, ["features:website-builder", "features:online-storefront", "features:landing-pages"]),
        crit("workflow-depth", "Workflow depth", "Publishing, catalog, domains, and admin workflows.", 12, 2, ["features:landing-pages", "features:online-storefront"]),
        crit("commerce", "Commerce depth", "Checkout, payments, and catalog when claimed.", 10, 3, ["features:online-storefront"]),
        crit("cro", "CRO & conversion", "Landing tests, forms, and conversion tooling.", 10, 4, ["features:cro-testing", "features:landing-pages"]),
        crit("integrations", "Integrations", "Payments, analytics, CRM, and DNS depth.", 10, 5, ["integrations"]),
        crit("scalability", "Scalability", "Traffic, SKUs, multi-site, and enterprise governance.", 8, 6, ["limits"]),
        crit("value-for-money", "Value for money", "Pricing fairness vs capabilities and plan gates.", 13, 7, ["pricing", "plans"]),
        crit("ai-assistance", "AI assistance", "AI site generation and content assistance depth.", 10, 8, ["features:ai-site-generation"]),
      ],
      notes: "Weights sum to 100. Score within job clusters. Affiliate economics excluded.",
    },
    comparisonCriteria: [
      cmp("starting-pricing", "Starting pricing", "factual", 0, "high"),
      cmp("free-trial", "Free trial", "factual", 1, "medium"),
      cmp("site-builder", "Website builder", "editorial", 2, "high", "website-builder"),
      cmp("storefront", "Storefront / commerce", "editorial", 3, "high", "online-storefront"),
      cmp("landing", "Landing pages", "editorial", 4, "high", "landing-pages"),
      cmp("hosting-panel", "Hosting panel", "editorial", 5, "medium", "hosting-control-panel"),
      cmp("integrations", "Integrations", "editorial", 6, "medium"),
    ],
    pricingDimensions: [
      { id: "pd-wdp-plans", slug: "plans", name: "Plan tiers", enginePrimitive: "flat", required: true },
      { id: "pd-wdp-transactions", slug: "transactions", name: "Transaction / GMV fees", enginePrimitive: "usage", required: false },
      { id: "pd-wdp-seats", slug: "seats", name: "Sites / seats", enginePrimitive: "per-seat", required: false },
    ],
    pricingCapability: "PARTIAL",
    pricingCapabilityNotes: ["Plan and transaction-fee primitives supported; category TCO calculator not built"],
    recommendationDimensions: [
      { id: "rd-wdp-job", slug: "primary-job", name: "Primary job (storefront vs builder vs landing vs panel vs marketplace)" },
      { id: "rd-wdp-commerce", slug: "commerce", name: "Selling products online" },
      { id: "rd-wdp-technical", slug: "technical-depth", name: "Self-host / panel vs fully hosted" },
      { id: "rd-wdp-budget", slug: "budget", name: "Budget" },
    ],
    finderReadiness: "NOT_READY",
    finderNotes: [
      "Defer dedicated finder until 6+ primaries — high scope risk across builder/landing/hosting/storefront jobs",
      "Prefer subcategory hubs under marketing + ecommerce until traffic proves top-level finder",
    ],
    useCases: [
      { slug: "website-builder-commerce", name: "Website builder commerce", pageEligibility: "content-candidate" },
      { slug: "online-storefront", name: "Online storefront", pageEligibility: "content-candidate" },
      { slug: "landing-pages", name: "Landing pages", pageEligibility: "content-candidate" },
      { slug: "ai-website-builder", name: "AI website builder", pageEligibility: "content-candidate" },
      { slug: "hosting-operations", name: "Hosting operations", pageEligibility: "content-candidate" },
    ],
    audienceSlugs: ["marketing", "small-business"],
    businessSizeSlugs: ["micro", "small-business", "mid-market", "enterprise"],
    businessTypeSlugs: ["saas", "agency", "startup"],
    seedProductSlugs: ["shopify", "leadpages", "ueni", "flippa"],
    queryAliases: ["website builder", "landing page software", "online store builder"],
    requiredResearchDomains: ["identity", "pricing", "plans", "features", "integrations", "limits"],
    optionalResearchDomains: ["free-trial", "ai-capabilities"],
    pricingModelsSupported: ["flat", "usage", "per-seat", "custom", "hybrid"],
    notes: [
      "Tier 2 nurture inventory — January 2027 hub launch",
      "Plesk IT-primary with secondary taxonomy; hosting panel landscape on best page",
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
) {
  return {
    id: `feat-wdp-${slug}`,
    slug,
    name,
    description,
    importance,
    comparisonRelevant,
    finderRelevant,
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
    id: `crit-wdp-${slug}`,
    slug,
    name,
    description,
    weight,
    evidenceRequirements,
    scoringScaleMin: 0,
    scoringScaleMax: 10,
    categorySlug: "website-digital-presence",
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
    id: `cmp-wdp-${slug}`,
    slug,
    name,
    kind,
    displayOrder,
    decisionImportance,
    ...(featureSlug ? { featureSlug } : {}),
  };
}
