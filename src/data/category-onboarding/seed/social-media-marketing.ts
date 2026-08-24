import { CategoryDefinitionSchema, type CategoryDefinition } from "@/domain";

/**
 * Social Media Marketing decision-domain definition v1.0.
 * Scheduling, listening, influencer workflows — distinct from generic MAP/funnel marketing.
 */
export const socialMediaMarketingDefinition: CategoryDefinition =
  CategoryDefinitionSchema.parse({
    id: "cat-def-social-media-marketing-v1",
    slug: "social-media-marketing",
    name: "Social Media Marketing",
    shortDescription:
      "Social scheduling, listening, influencer campaigns, and social ROI reporting — distinct from generic marketing automation.",
    parentSlug: null,
    aliases: [
      "social media marketing software",
      "social media management software",
      "social media scheduler",
      "social listening software",
      "influencer marketing platform",
    ],
    lifecycle: "active",
    configVersion: "1.0.0",
    scope: {
      definition:
        "Software whose primary job is planning and publishing social posts, monitoring brand mentions, running influencer campaigns, or reporting on social performance — not full marketing automation platforms, funnel builders, or ESPs unless social execution is the stated buyer job.",
      includes: [
        { id: "inc-scheduler", label: "Social scheduling & publishing calendars" },
        { id: "inc-listening", label: "Social listening & brand monitoring" },
        { id: "inc-influencer", label: "Influencer discovery, outreach, and campaign management" },
        { id: "inc-suite", label: "Social suites (publish + inbox + analytics)" },
        { id: "inc-analytics", label: "Social analytics & ROI reporting" },
      ],
      excludes: [
        {
          id: "exc-map",
          label: "Primary marketing automation / MAP platforms",
          notes: "Marketo, Braze, Freshmarketer stay marketing-primary",
        },
        {
          id: "exc-funnel",
          label: "Funnel builders without social as the core job",
          notes: "Kartra, ClickFunnels stay marketing-primary",
        },
        {
          id: "exc-esp",
          label: "Email marketing ESPs",
          notes: "Prefer email-marketing",
        },
        {
          id: "exc-pr-enterprise",
          label: "Enterprise PR/media intelligence without social execution",
          notes: "Meltwater/Brandwatch may be landscape — rank listening cluster only",
        },
      ],
      adjacentCategorySlugs: ["marketing", "email-marketing", "crm"],
      classificationNotes: [
        "Buffer and Hootsuite are scheduling/suite anchors — not MAP peers",
        "Brand24 is social-listening primary — not a scheduler award peer",
        "SocialBee is social-management/recycling primary — not listening or influencer",
        "Zypper is influencer-marketing primary — landscape only vs schedulers",
        "Later, Agorapulse, Sprout Social remain marketing landscape until recategorized",
        "Never rank schedulers, listening suites, and influencer tools as one undifferentiated #1",
      ],
    },
    features: [
      feat(
        "social-scheduling",
        "Social scheduling",
        "Queue posts, calendars, and multi-network publishing.",
        "core",
        true,
        true,
      ),
      feat(
        "content-calendar",
        "Content calendar",
        "Visual planning, approvals, and team collaboration on social content.",
        "core",
        true,
        true,
      ),
      feat(
        "social-listening",
        "Social listening",
        "Mention monitoring, sentiment, and alert workflows.",
        "core",
        true,
        true,
      ),
      feat(
        "influencer-marketing",
        "Influencer marketing",
        "Creator discovery, outreach, contracts, and campaign tracking.",
        "specialist",
        true,
        true,
      ),
      feat(
        "social-analytics",
        "Social analytics",
        "Engagement, reach, and channel performance reporting.",
        "important",
        true,
        true,
      ),
      feat(
        "social-inbox",
        "Social inbox",
        "Unified comment and DM triage across networks.",
        "important",
        true,
        true,
      ),
      feat(
        "ai-content-generation",
        "AI content generation",
        "AI-assisted captions, hashtags, and post ideas.",
        "optional",
        true,
        true,
      ),
      feat(
        "reputation-reviews",
        "Reputation monitoring",
        "Review and mention alerts beyond core social feeds.",
        "optional",
        true,
        false,
      ),
    ],
    researchRequirements: [
      { domain: "identity", level: "required", featureSlugs: [] },
      {
        domain: "pricing",
        level: "required",
        featureSlugs: [],
        notes: "Per-channel, per-seat, keyword/mention caps",
      },
      { domain: "plans", level: "required", featureSlugs: [] },
      {
        domain: "features",
        level: "required",
        featureSlugs: ["social-scheduling", "social-listening", "influencer-marketing"],
      },
      { domain: "integrations", level: "required", featureSlugs: [] },
      { domain: "limits", level: "required", featureSlugs: [] },
      { domain: "free-trial", level: "recommended", featureSlugs: [] },
      { domain: "ai-capabilities", level: "recommended", featureSlugs: [] },
    ],
    editorialMethodology: {
      id: "methodology-social-media-marketing-v1",
      slug: "social-media-marketing-editorial",
      name: "Social Media Marketing Editorial Methodology",
      version: "1.0.0",
      categorySlug: "social-media-marketing",
      description:
        "SoftwareGlimpse evaluates social media marketing platforms on ease of use, social job fit (scheduling, listening, influencer, or suite), workflow depth, analytics, integrations, scalability, value, and AI assistance. Products are ranked within job clusters only. Affiliate relationships never influence scores.",
      criteria: [
        crit("ease-of-use", "Ease of use", "Learning curve for social managers and approvers.", 12, 0, ["features:social-scheduling"]),
        crit("social-job-fit", "Social job fit", "Fit to scheduling, listening, influencer, or suite cluster.", 15, 1, ["features:social-scheduling", "features:social-listening", "features:influencer-marketing"]),
        crit("workflow-depth", "Workflow depth", "Calendars, approvals, mention triage, or influencer pipelines.", 12, 2, ["features:content-calendar", "features:social-inbox"]),
        crit("analytics", "Analytics", "Reporting depth for social ROI and channel performance.", 10, 3, ["features:social-analytics"]),
        crit("integrations", "Integrations", "Native network, CRM, and UTM/analytics connections.", 10, 4, ["integrations"]),
        crit("listening-depth", "Listening depth", "Mention coverage, sentiment, and alert quality.", 10, 5, ["features:social-listening"]),
        crit("scalability", "Scalability", "Profiles, seats, keywords, and multi-brand workspaces.", 8, 6, ["limits", "pricing"]),
        crit("value-for-money", "Value for money", "Pricing fairness vs capabilities and plan gates.", 13, 7, ["pricing", "plans"]),
        crit("ai-capabilities", "AI capabilities", "Useful caption/idea assist — not marketing fluff.", 10, 8, ["features:ai-content-generation", "ai-capabilities"]),
      ],
      notes: "Weights sum to 100. Score within job clusters. Affiliate economics excluded.",
    },
    comparisonCriteria: [
      cmp("starting-pricing", "Starting pricing", "factual", 0, "high"),
      cmp("free-plan", "Free plan", "factual", 1, "medium"),
      cmp("scheduling", "Social scheduling", "editorial", 2, "high", "social-scheduling"),
      cmp("listening", "Social listening", "editorial", 3, "high", "social-listening"),
      cmp("influencer", "Influencer tools", "editorial", 4, "medium", "influencer-marketing"),
      cmp("analytics", "Social analytics", "editorial", 5, "high", "social-analytics"),
      cmp("integrations", "Integrations", "editorial", 6, "high"),
    ],
    pricingDimensions: [
      { id: "pd-smm-channels", slug: "channels", name: "Channels / profiles", enginePrimitive: "per-seat", required: true },
      { id: "pd-smm-seats", slug: "seats", name: "Users / seats", enginePrimitive: "per-seat", required: true },
      { id: "pd-smm-mentions", slug: "mentions", name: "Keywords / mentions", enginePrimitive: "usage", required: false },
      { id: "pd-smm-plans", slug: "plans", name: "Plan tiers", enginePrimitive: "flat", required: true },
    ],
    pricingCapability: "PARTIAL",
    pricingCapabilityNotes: [
      "Per-channel and per-seat primitives supported; category TCO calculator not built",
    ],
    recommendationDimensions: [
      { id: "rd-smm-job", slug: "primary-job", name: "Primary job (schedule vs listen vs influencer)" },
      { id: "rd-smm-channels", slug: "channels", name: "Networks needed" },
      { id: "rd-smm-team", slug: "team-size", name: "Team / agency size" },
      { id: "rd-smm-budget", slug: "budget", name: "Budget" },
    ],
    finderReadiness: "DATA_MODEL_READY",
    finderNotes: [
      "Five primaries in seed — finder UI candidate after hub matures",
      "Scheduling vs listening vs influencer are distinct finder jobs",
    ],
    useCases: [
      { slug: "social-media-management", name: "Social media management", pageEligibility: "content-candidate" },
      { slug: "social-media-marketing", name: "Social media marketing", pageEligibility: "content-candidate" },
      { slug: "social-listening", name: "Social listening", pageEligibility: "content-candidate" },
      { slug: "brand-monitoring", name: "Brand monitoring", pageEligibility: "content-candidate" },
      { slug: "influencer-marketing", name: "Influencer marketing", pageEligibility: "content-candidate" },
    ],
    audienceSlugs: ["small-business", "marketing"],
    businessSizeSlugs: ["micro", "small-business", "mid-market", "enterprise"],
    businessTypeSlugs: ["agency", "saas", "startup"],
    seedProductSlugs: ["buffer", "hootsuite", "brand24", "socialbee", "zypper"],
    queryAliases: [
      "social media marketing software",
      "social media scheduler",
      "social listening tool",
      "influencer marketing platform",
    ],
    requiredResearchDomains: ["identity", "pricing", "plans", "features", "integrations", "limits"],
    optionalResearchDomains: ["free-trial", "ai-capabilities"],
    pricingModelsSupported: ["per-seat", "usage", "flat", "custom", "hybrid"],
    notes: [
      "Split from marketing parent hub — social jobs are distinct from MAP/funnels",
      "Buffer and Hootsuite are editorial anchors; three affiliate SKUs anchor clusters",
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
    id: `feat-smm-${slug}`,
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
    id: `crit-smm-${slug}`,
    slug,
    name,
    description,
    weight,
    evidenceRequirements,
    scoringScaleMin: 0,
    scoringScaleMax: 10,
    categorySlug: "social-media-marketing",
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
    id: `cmp-smm-${slug}`,
    slug,
    name,
    kind,
    displayOrder,
    decisionImportance,
    ...(featureSlug ? { featureSlug } : {}),
  };
}
