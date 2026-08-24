import { CategoryDefinitionSchema, type CategoryDefinition } from "@/domain";

/**
 * Reputation & Review Management decision-domain definition v1.0.
 * Collect reviews, respond on Google/social, and automate reputation workflows.
 */
export const reputationReviewsDefinition: CategoryDefinition =
  CategoryDefinitionSchema.parse({
    id: "cat-def-reputation-reviews-v1",
    slug: "reputation-reviews",
    name: "Reputation & Review Management",
    shortDescription:
      "Collect reviews, respond on Google and social, and automate reputation workflows — distinct from helpdesk ticketing and live chat.",
    parentSlug: null,
    aliases: [
      "reputation management software",
      "review management software",
      "online review software",
      "review generation software",
    ],
    lifecycle: "active",
    configVersion: "1.0.0",
    scope: {
      definition:
        "Software whose primary job is collecting customer reviews, monitoring reputation signals, responding on Google and social platforms, and automating review-request workflows for local and service businesses. Not helpdesk ticketing, live chat, or CRM pipeline tools unless reputation is the stated buyer job.",
      includes: [
        { id: "inc-review-collection", label: "Review collection & requests" },
        { id: "inc-review-monitoring", label: "Review monitoring & alerts" },
        { id: "inc-review-response", label: "Review response workflows" },
        { id: "inc-social-proof", label: "Social proof & referral widgets" },
      ],
      excludes: [
        {
          id: "exc-helpdesk",
          label: "Helpdesk ticketing without reputation core",
          notes: "Prefer customer-service for ticket queues",
        },
        {
          id: "exc-live-chat",
          label: "Live chat widgets without review depth",
          notes: "Prefer customer-service for chat-first jobs",
        },
        {
          id: "exc-enterprise-listening",
          label: "Enterprise social listening / brand intelligence",
          notes: "Prefer marketing/social-media-marketing for listening suites",
        },
      ],
      adjacentCategorySlugs: ["customer-service", "marketing", "social-media-marketing"],
      classificationNotes: [
        "NiceJob is reputation/review primary — explicitly excluded from CS helpdesk peer sets",
        "Single-product category — CS-adjacent until inventory grows",
        "No finder until 4+ primary products",
        "Do not rank reputation tools against Zendesk-class helpdesks",
      ],
    },
    features: [
      feat(
        "review-collection",
        "Review collection",
        "Automated review requests after jobs or purchases.",
        "core",
        true,
        true,
      ),
      feat(
        "review-monitoring",
        "Review monitoring",
        "Alerts for new reviews across Google and social platforms.",
        "core",
        true,
        true,
      ),
      feat(
        "review-response",
        "Review response",
        "Respond to reviews from a unified inbox.",
        "important",
        true,
        true,
      ),
      feat(
        "social-proof-widgets",
        "Social proof widgets",
        "Embeddable review widgets and testimonial displays.",
        "important",
        true,
        true,
      ),
      feat(
        "referral-workflows",
        "Referral workflows",
        "Refer-a-friend and referral automation.",
        "important",
        true,
        true,
      ),
      feat(
        "reputation-automation",
        "Reputation automation",
        "Triggered SMS/email review campaigns.",
        "core",
        true,
        true,
      ),
      feat(
        "integrations",
        "Integrations",
        "CRM, scheduling, and payment connectors.",
        "important",
        true,
        true,
      ),
      feat(
        "reputation-reviews",
        "Reputation & reviews",
        "Shared reputation capability for landscape scoring.",
        "specialist",
        true,
        false,
        "Score when reputation is claimed but not the primary purchase.",
      ),
    ],
    researchRequirements: [
      { domain: "identity", level: "required", featureSlugs: [] },
      {
        domain: "pricing",
        level: "required",
        featureSlugs: [],
        notes: "Per-location and per-user local business plan models",
      },
      { domain: "plans", level: "required", featureSlugs: [] },
      {
        domain: "features",
        level: "required",
        featureSlugs: ["review-collection", "review-monitoring", "reputation-automation"],
      },
      { domain: "integrations", level: "required", featureSlugs: [] },
      { domain: "limits", level: "required", featureSlugs: [] },
      { domain: "free-trial", level: "recommended", featureSlugs: [] },
    ],
    editorialMethodology: {
      id: "methodology-reputation-reviews-v1",
      slug: "reputation-reviews-editorial",
      name: "Reputation & Review Management Editorial Methodology",
      version: "1.0.0",
      categorySlug: "reputation-reviews",
      description:
        "SoftwareGlimpse evaluates reputation and review management platforms on ease of use, reputation job fit, collection automation, monitoring depth, response workflows, integrations, scalability, and value. Products are ranked within reputation job clusters only.",
      criteria: [
        crit("ease-of-use", "Ease of use", "Setup for local business owners and marketers.", 12, 0, ["features:review-collection"]),
        crit("reputation-job-fit", "Reputation job fit", "Fit to review collection, monitoring, and response jobs.", 15, 1, ["features:review-collection", "features:review-monitoring"]),
        crit("collection-automation", "Collection automation", "Post-job review request triggers and channels.", 12, 2, ["features:reputation-automation"]),
        crit("monitoring-depth", "Monitoring depth", "Google, Facebook, and multi-platform coverage.", 12, 3, ["features:review-monitoring"]),
        crit("response-workflows", "Response workflows", "Unified review response and team workflows.", 10, 4, ["features:review-response"]),
        crit("social-proof", "Social proof", "Widgets, referrals, and on-site proof.", 10, 5, ["features:social-proof-widgets", "features:referral-workflows"]),
        crit("integrations", "Integrations", "CRM, scheduling, and payment connectors.", 10, 6, ["integrations"]),
        crit("scalability", "Scalability", "Multi-location and franchise governance.", 8, 7, ["limits"]),
        crit("value-for-money", "Value for money", "Pricing fairness vs locations and automation depth.", 11, 8, ["pricing", "plans"]),
      ],
      notes: "Weights sum to 100. Score within reputation clusters. Affiliate economics excluded.",
    },
    comparisonCriteria: [
      cmp("starting-pricing", "Starting pricing", "factual", 0, "high"),
      cmp("free-trial", "Free trial", "factual", 1, "medium"),
      cmp("collection", "Review collection", "editorial", 2, "high", "review-collection"),
      cmp("monitoring", "Review monitoring", "editorial", 3, "high", "review-monitoring"),
      cmp("response", "Review response", "editorial", 4, "medium", "review-response"),
      cmp("social-proof", "Social proof", "editorial", 5, "medium", "social-proof-widgets"),
      cmp("integrations", "Integrations", "editorial", 6, "medium"),
    ],
    pricingDimensions: [
      { id: "pd-rr-locations", slug: "locations", name: "Locations / businesses", enginePrimitive: "usage", required: true },
      { id: "pd-rr-users", slug: "users", name: "Users", enginePrimitive: "per-seat", required: false },
      { id: "pd-rr-plans", slug: "plans", name: "Plan tiers", enginePrimitive: "flat", required: true },
    ],
    pricingCapability: "PARTIAL",
    pricingCapabilityNotes: [
      "Per-location primitives supported; category TCO calculator not built",
    ],
    recommendationDimensions: [
      { id: "rd-rr-job", slug: "primary-job", name: "Primary job (collection vs monitoring vs response)" },
      { id: "rd-rr-locations", slug: "locations", name: "Number of locations" },
      { id: "rd-rr-channels", slug: "channels", name: "Required review platforms" },
      { id: "rd-rr-budget", slug: "budget", name: "Budget" },
    ],
    finderReadiness: "NOT_READY",
    finderNotes: [
      "Hub page only until 4+ primary products",
      "Single-product category — CS-adjacent until inventory grows",
    ],
    useCases: [
      { slug: "reputation-reviews", name: "Reputation & reviews", pageEligibility: "content-candidate" },
      { slug: "review-generation", name: "Review generation", pageEligibility: "content-candidate" },
      { slug: "local-reputation", name: "Local reputation management", pageEligibility: "content-candidate" },
    ],
    audienceSlugs: ["marketing", "small-business"],
    businessSizeSlugs: ["micro", "small-business", "mid-market"],
    businessTypeSlugs: ["local-services", "trades", "agency"],
    seedProductSlugs: ["nicejob"],
    queryAliases: [
      "reputation management software",
      "review management software",
      "online review software",
    ],
    requiredResearchDomains: ["identity", "pricing", "plans", "features", "integrations", "limits"],
    optionalResearchDomains: ["free-trial"],
    pricingModelsSupported: ["per-seat", "usage", "flat", "custom", "hybrid"],
    notes: [
      "Tier 3 defer inventory — April 2027 hub launch",
      "NiceJob what-is ships Tier 7 CS Nov 2026",
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
    id: `feat-rr-${slug}`,
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
    id: `crit-rr-${slug}`,
    slug,
    name,
    description,
    weight,
    evidenceRequirements,
    scoringScaleMin: 0,
    scoringScaleMax: 10,
    categorySlug: "reputation-reviews",
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
    id: `cmp-rr-${slug}`,
    slug,
    name,
    kind,
    displayOrder,
    decisionImportance,
    ...(featureSlug ? { featureSlug } : {}),
  };
}
