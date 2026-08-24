import { CategoryDefinitionSchema, type CategoryDefinition } from "@/domain";

/**
 * Social Media Management subcategory definition v1.0 — under parent marketing.
 * Scheduling, publishing, and social analytics cluster — not listening or influencer.
 */
export const socialMediaManagementDefinition: CategoryDefinition =
  CategoryDefinitionSchema.parse({
    id: "cat-def-social-media-management-v1",
    slug: "social-media-management",
    name: "Social Media Management",
    shortDescription:
      "Schedule, publish, and analyze social posts across networks — distinct from social listening, influencer campaigns, and full MAP platforms.",
    parentSlug: "marketing",
    aliases: [
      "social media management software",
      "social media scheduler",
      "social publishing software",
      "social media calendar software",
      "social media analytics software",
    ],
    lifecycle: "active",
    configVersion: "1.0.0",
    scope: {
      definition:
        "Software whose primary job is scheduling, publishing, and analyzing social posts across networks — content calendars, multi-network queues, approval workflows, social inboxes, and channel analytics — not social listening suites, influencer marketing platforms, or marketing automation platforms where email/funnels are the core job.",
      includes: [
        { id: "inc-scheduling", label: "Multi-network social scheduling and publishing" },
        { id: "inc-calendar", label: "Content calendars and approval workflows" },
        { id: "inc-inbox", label: "Social inbox for comments and DMs" },
        { id: "inc-analytics", label: "Social channel analytics and reporting" },
      ],
      excludes: [
        {
          id: "exc-listening",
          label: "Social listening and brand monitoring as primary job",
          notes: "Brand24 — parent social-media-marketing listening cluster",
        },
        {
          id: "exc-influencer",
          label: "Influencer marketing platforms as primary job",
          notes: "Zypper — parent social-media-marketing influencer cluster",
        },
        {
          id: "exc-map",
          label: "Marketing automation / MAP platforms as primary job",
          notes: "Marketo, Braze, Freshmarketer — parent marketing MAP cluster",
        },
        {
          id: "exc-funnel",
          label: "Funnel builders without social execution as core job",
          notes: "Kartra, ClickFunnels — parent landing-pages-cro cluster",
        },
      ],
      adjacentCategorySlugs: ["marketing", "social-media-marketing", "email-marketing"],
      classificationNotes: [
        "Buffer and Hootsuite are scheduling/suite anchors — not listening or influencer peers",
        "SocialBee is social-management/recycling primary — not listening or influencer",
        "Brand24 is social-listening primary — exclude from scheduling cluster awards",
        "Zypper is influencer-marketing primary — landscape only vs schedulers",
        "Use parent marketing finder with social scheduling job filter — no dedicated subcategory finder",
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
    ],
    researchRequirements: [
      { domain: "identity", level: "required", featureSlugs: [] },
      {
        domain: "pricing",
        level: "required",
        featureSlugs: [],
        notes: "Per-channel, per-seat, and profile caps when published",
      },
      { domain: "plans", level: "required", featureSlugs: [] },
      {
        domain: "features",
        level: "required",
        featureSlugs: ["social-scheduling", "content-calendar"],
      },
      { domain: "integrations", level: "required", featureSlugs: [] },
      { domain: "limits", level: "required", featureSlugs: [] },
    ],
    editorialMethodology: {
      id: "methodology-social-media-management-v1",
      slug: "social-media-management-editorial",
      name: "Social Media Management Editorial Methodology",
      version: "1.0.0",
      categorySlug: "social-media-management",
      description:
        "SoftwareGlimpse evaluates social media management platforms on ease of use, scheduling job fit, calendar workflows, analytics, inbox depth, integrations, scalability, value, and AI assistance. Products are ranked within scheduling/publishing clusters only. Affiliate relationships never influence scores.",
      criteria: [
        crit("ease-of-use", "Ease of use", "Learning curve for social managers and approvers.", 12, 0, ["features:social-scheduling"]),
        crit("scheduling-job-fit", "Scheduling job fit", "Fit to scheduler vs social suite cluster.", 14, 1, ["features:social-scheduling", "features:content-calendar"]),
        crit("calendar-workflows", "Calendar workflows", "Planning, approvals, and publishing depth.", 12, 2, ["features:content-calendar"]),
        crit("analytics", "Analytics", "Reporting depth for social ROI and channel performance.", 10, 3, ["features:social-analytics"]),
        crit("integrations", "Integrations", "Native network, CRM, and UTM/analytics connections.", 8, 4, ["integrations"]),
        crit("inbox-depth", "Inbox depth", "Comment and DM triage across networks.", 8, 5, ["features:social-inbox"]),
        crit("channel-coverage", "Channel coverage", "Networks supported and per-profile limits.", 10, 6, ["features:social-scheduling", "limits"]),
        crit("scalability", "Scalability", "Profiles, seats, and multi-brand workspaces.", 8, 7, ["limits", "pricing"]),
        crit("value-for-money", "Value for money", "Pricing fairness vs capabilities and plan gates.", 10, 8, ["pricing", "plans"]),
        crit("ai-capabilities", "AI capabilities", "Useful caption/idea assist — not marketing fluff.", 8, 9, ["features:ai-content-generation", "ai-capabilities"]),
      ],
      notes: "Weights sum to 100. Score within scheduling clusters. Affiliate economics excluded.",
    },
    comparisonCriteria: [
      cmp("starting-pricing", "Starting pricing", "factual", 0, "high"),
      cmp("channels", "Channels / profiles", "factual", 1, "high"),
      cmp("scheduling", "Social scheduling", "editorial", 2, "high", "social-scheduling"),
      cmp("calendar", "Content calendar", "editorial", 3, "high", "content-calendar"),
      cmp("analytics", "Social analytics", "editorial", 4, "high", "social-analytics"),
      cmp("inbox", "Social inbox", "editorial", 5, "medium", "social-inbox"),
      cmp("integrations", "Integrations", "editorial", 6, "medium"),
    ],
    pricingDimensions: [
      { id: "pd-smmgmt-channels", slug: "channels", name: "Channels / profiles", enginePrimitive: "per-seat", required: true },
      { id: "pd-smmgmt-seats", slug: "seats", name: "Users / seats", enginePrimitive: "per-seat", required: true },
      { id: "pd-smmgmt-plans", slug: "plans", name: "Plan tiers", enginePrimitive: "flat", required: true },
    ],
    pricingCapability: "PARTIAL",
    pricingCapabilityNotes: [
      "Per-channel and per-seat primitives supported; category TCO calculator not built",
    ],
    recommendationDimensions: [
      { id: "rd-smmgmt-job", slug: "primary-job", name: "Primary job (scheduler vs social suite)" },
      { id: "rd-smmgmt-channels", slug: "channels", name: "Networks needed" },
      { id: "rd-smmgmt-team", slug: "team-size", name: "Team / agency size" },
      { id: "rd-smmgmt-budget", slug: "budget", name: "Budget" },
    ],
    finderReadiness: "NOT_READY",
    finderNotes: [
      "Use parent marketing-finder with social scheduling job filter — no dedicated subcategory finder UI",
      "Social scheduling job routing through parent marketing finder dimensions",
    ],
    useCases: [
      { slug: "social-media-management", name: "Social media management", pageEligibility: "content-candidate" },
      { slug: "content-marketing", name: "Content marketing", pageEligibility: "content-candidate" },
    ],
    audienceSlugs: ["small-business", "marketing"],
    businessSizeSlugs: ["micro", "small-business", "mid-market", "enterprise"],
    businessTypeSlugs: ["agency", "saas", "startup"],
    seedProductSlugs: ["socialbee", "buffer", "hootsuite"],
    queryAliases: [
      "social media management software",
      "social media scheduler",
      "social publishing software",
      "social media calendar software",
    ],
    requiredResearchDomains: ["identity", "pricing", "plans", "features", "integrations", "limits"],
    optionalResearchDomains: ["free-trial", "ai-capabilities"],
    pricingModelsSupported: ["per-seat", "usage", "flat", "custom", "hybrid"],
    notes: [
      "Tier 1 marketing subcategory — scheduling/publishing cluster under parent marketing",
      "Narrow scope: scheduling, publishing, analytics — not listening or influencer",
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
    id: `feat-smmgmt-${slug}`,
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
    id: `crit-smmgmt-${slug}`,
    slug,
    name,
    description,
    weight,
    evidenceRequirements,
    scoringScaleMin: 0,
    scoringScaleMax: 10,
    categorySlug: "social-media-management",
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
    id: `cmp-smmgmt-${slug}`,
    slug,
    name,
    kind,
    displayOrder,
    decisionImportance,
    ...(featureSlug ? { featureSlug } : {}),
  };
}
