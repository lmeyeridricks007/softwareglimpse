import { CategoryDefinitionSchema, type CategoryDefinition } from "@/domain";

/**
 * PPC Advertising subcategory definition v1.0 — under parent marketing.
 * Paid ads management and campaign optimization cluster — deferred hub until inventory expands.
 */
export const ppcAdvertisingDefinition: CategoryDefinition =
  CategoryDefinitionSchema.parse({
    id: "cat-def-ppc-advertising-v1",
    slug: "ppc-advertising",
    name: "PPC Advertising",
    shortDescription:
      "Manage and optimize paid search and social ad campaigns — distinct from landing page builders and email marketing automation.",
    parentSlug: "marketing",
    aliases: [
      "PPC software",
      "PPC management software",
      "paid ads software",
      "paid search software",
      "ad campaign management software",
    ],
    lifecycle: "active",
    configVersion: "1.0.0",
    scope: {
      definition:
        "Software whose primary job is managing, optimizing, and reporting on paid advertising campaigns — search, social, and display ads across ad platforms — including bid management, budget pacing, creative testing, and campaign analytics — not landing page builders, email marketing automation, or organic social schedulers.",
      includes: [
        { id: "inc-ads-mgmt", label: "Paid ads campaign management across platforms" },
        { id: "inc-bid-opt", label: "Bid management and budget optimization" },
        { id: "inc-reporting", label: "Cross-channel ad performance reporting" },
        { id: "inc-automation", label: "Marketing automation tied to paid acquisition workflows" },
      ],
      excludes: [
        {
          id: "exc-landing",
          label: "Landing page and funnel builders as primary job",
          notes: "Kartra, Leadpages — parent landing-pages-cro cluster",
        },
        {
          id: "exc-email",
          label: "Email marketing automation as primary job",
          notes: "ActiveCampaign, Mailchimp — parent email-marketing cluster",
        },
        {
          id: "exc-social-organic",
          label: "Organic social scheduling as primary job",
          notes: "Buffer, Hootsuite — parent social-media-management cluster",
        },
        {
          id: "exc-analytics-bi",
          label: "General analytics / BI without ads management core",
          notes: "Prefer analytics-bi for cross-channel BI",
        },
      ],
      adjacentCategorySlugs: ["marketing", "landing-pages-cro", "analytics-bi", "email-marketing"],
      classificationNotes: [
        "Diginius is PPC reporting/management anchor — not landing-page peer",
        "Birch is paid social/search management primary — landscape peer to Diginius",
        "pageIntent hub — defer indexable hub until 4+ peers",
        "Use parent marketing finder — scope PPC vs MAP vs landing — no dedicated subcategory finder",
        "Never rank PPC managers, MAP platforms, and landing builders as one undifferentiated #1",
      ],
    },
    features: [
      feat(
        "ads-management",
        "Ads management",
        "Create, manage, and optimize paid campaigns across ad platforms.",
        "core",
        true,
        true,
      ),
      feat(
        "marketing-automation",
        "Marketing automation",
        "Automated workflows tied to paid acquisition and lead nurture.",
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
        notes: "Ad spend %, per-account, and seat pricing when published",
      },
      { domain: "plans", level: "required", featureSlugs: [] },
      {
        domain: "features",
        level: "required",
        featureSlugs: ["ads-management"],
      },
      { domain: "integrations", level: "required", featureSlugs: [] },
      { domain: "limits", level: "required", featureSlugs: [] },
    ],
    editorialMethodology: {
      id: "methodology-ppc-advertising-v1",
      slug: "ppc-advertising-editorial",
      name: "PPC Advertising Editorial Methodology",
      version: "1.0.0",
      categorySlug: "ppc-advertising",
      description:
        "SoftwareGlimpse evaluates PPC advertising platforms on ease of use, PPC job fit, ads management depth, campaign workflows, analytics, integrations, scalability, value, and marketing automation tie-ins. Products are ranked within PPC clusters only. Affiliate relationships never influence scores.",
      criteria: [
        crit("ease-of-use", "Ease of use", "Learning curve for marketers managing paid campaigns.", 12, 0, ["features:ads-management"]),
        crit("ppc-job-fit", "PPC job fit", "Fit to search vs social vs cross-channel PPC cluster.", 15, 1, ["features:ads-management"]),
        crit("ads-management", "Ads management", "Campaign creation, bid rules, and budget pacing depth.", 15, 2, ["features:ads-management"]),
        crit("campaign-workflows", "Campaign workflows", "Multi-account, creative testing, and optimization workflows.", 12, 3, ["features:ads-management", "features:marketing-automation"]),
        crit("analytics", "Analytics", "Cross-channel ad performance and attribution reporting.", 12, 4, ["features:ads-management"]),
        crit("integrations", "Integrations", "Ad platform, CRM, and analytics connectors.", 10, 5, ["integrations"]),
        crit("scalability", "Scalability", "Accounts, ad spend tiers, and team seats.", 8, 6, ["limits", "pricing"]),
        crit("value-for-money", "Value for money", "Pricing fairness vs capabilities and spend minimums.", 10, 7, ["pricing", "plans"]),
        crit("marketing-automation", "Marketing automation", "Paid-to-nurture workflow depth when bundled.", 6, 8, ["features:marketing-automation"]),
      ],
      notes: "Weights sum to 100. Score within PPC clusters. Affiliate economics excluded.",
    },
    comparisonCriteria: [
      cmp("starting-pricing", "Starting pricing", "factual", 0, "high"),
      cmp("ad-platforms", "Ad platforms supported", "factual", 1, "high"),
      cmp("ads-management", "Ads management", "editorial", 2, "high", "ads-management"),
      cmp("marketing-automation", "Marketing automation", "editorial", 3, "medium", "marketing-automation"),
      cmp("integrations", "Integrations", "editorial", 4, "medium"),
    ],
    pricingDimensions: [
      { id: "pd-ppc-spend", slug: "ad-spend", name: "Managed ad spend", enginePrimitive: "usage", required: true },
      { id: "pd-ppc-accounts", slug: "accounts", name: "Ad accounts", enginePrimitive: "usage", required: true },
      { id: "pd-ppc-plans", slug: "plans", name: "Plan tiers", enginePrimitive: "flat", required: true },
    ],
    pricingCapability: "PARTIAL",
    pricingCapabilityNotes: [
      "Ad-spend and per-account primitives supported; category TCO calculator not built",
    ],
    recommendationDimensions: [
      { id: "rd-ppc-job", slug: "primary-job", name: "Primary job (search vs social vs cross-channel PPC)" },
      { id: "rd-ppc-spend", slug: "ad-spend", name: "Monthly ad spend" },
      { id: "rd-ppc-platforms", slug: "ad-platforms", name: "Ad platforms needed" },
      { id: "rd-ppc-budget", slug: "budget", name: "Software budget" },
    ],
    finderReadiness: "NOT_READY",
    finderNotes: [
      "Use parent marketing-finder — scope PPC vs MAP vs landing — no dedicated subcategory finder UI",
      "PPC job routing through parent marketing finder dimensions",
    ],
    useCases: [
      { slug: "marketing-automation", name: "Marketing automation", pageEligibility: "content-candidate" },
    ],
    audienceSlugs: ["small-business", "marketing"],
    businessSizeSlugs: ["small-business", "mid-market", "enterprise"],
    businessTypeSlugs: ["agency", "saas", "ecommerce", "startup"],
    seedProductSlugs: ["diginius", "birch"],
    queryAliases: [
      "PPC software",
      "PPC management software",
      "paid ads software",
      "paid search software",
    ],
    requiredResearchDomains: ["identity", "pricing", "plans", "features", "integrations", "limits"],
    optionalResearchDomains: ["free-trial", "ai-capabilities"],
    pricingModelsSupported: ["usage", "per-seat", "flat", "custom", "hybrid"],
    notes: [
      "Tier 2 marketing subcategory — deferred hub until 4+ PPC-native peers",
      "pageIntent hub — defer indexable hub until 4+ peers",
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
    id: `feat-ppc-${slug}`,
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
    id: `crit-ppc-${slug}`,
    slug,
    name,
    description,
    weight,
    evidenceRequirements,
    scoringScaleMin: 0,
    scoringScaleMax: 10,
    categorySlug: "ppc-advertising",
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
    id: `cmp-ppc-${slug}`,
    slug,
    name,
    kind,
    displayOrder,
    decisionImportance,
    ...(featureSlug ? { featureSlug } : {}),
  };
}
