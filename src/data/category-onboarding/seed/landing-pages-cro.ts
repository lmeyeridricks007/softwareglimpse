import { CategoryDefinitionSchema, type CategoryDefinition } from "@/domain";

/**
 * Landing Pages & CRO subcategory definition v1.0 — under parent marketing.
 * Landing page builders, funnels, and conversion optimization cluster.
 */
export const landingPagesCroDefinition: CategoryDefinition =
  CategoryDefinitionSchema.parse({
    id: "cat-def-landing-pages-cro-v1",
    slug: "landing-pages-cro",
    name: "Landing Pages & CRO",
    shortDescription:
      "Build high-converting landing pages and sales funnels — distinct from email marketing automation and social scheduling.",
    parentSlug: "marketing",
    aliases: [
      "landing page builder software",
      "landing page software",
      "sales funnel software",
      "funnel builder software",
      "CRO software",
      "conversion rate optimization tools",
    ],
    lifecycle: "active",
    configVersion: "1.0.0",
    scope: {
      definition:
        "Software whose primary job is building landing pages, multi-step sales funnels, lead-capture forms, and conversion optimization workflows — page builders, funnel sequences, A/B tests, and campaign analytics — not email marketing automation platforms, social schedulers, or PPC ad managers where landing pages are secondary.",
      includes: [
        { id: "inc-landing-builder", label: "Landing page builders and templates" },
        { id: "inc-funnel", label: "Multi-step sales funnels and conversion paths" },
        { id: "inc-forms", label: "Lead-capture forms and opt-in workflows" },
        { id: "inc-cro", label: "A/B testing and conversion optimization" },
      ],
      excludes: [
        {
          id: "exc-email-map",
          label: "Email marketing automation as primary job",
          notes: "ActiveCampaign, Mailchimp — parent email-marketing cluster",
        },
        {
          id: "exc-social",
          label: "Social scheduling and publishing as primary job",
          notes: "Buffer, Hootsuite — parent social-media-management cluster",
        },
        {
          id: "exc-ppc",
          label: "PPC and paid ads management as primary job",
          notes: "Diginius, Birch — parent ppc-advertising cluster",
        },
        {
          id: "exc-website-builder",
          label: "Full website builders without funnel/landing core",
          notes: "Prefer website-digital-presence for site-wide builders",
        },
      ],
      adjacentCategorySlugs: ["marketing", "email-marketing", "website-digital-presence", "ppc-advertising"],
      classificationNotes: [
        "Kartra is all-in-one funnel anchor — distinct from ESP-only email marketing",
        "Leadpages is landing-page primary — not MAP workflow peer against Marketo",
        "Freshmarketer bundles MAP + landing — rank inside funnel/landing cluster when landing is buyer job",
        "Distinct from email automation MAP — do not rank Kartra against ActiveCampaign as undifferentiated #1",
        "Use parent marketing finder with funnel/landing job filter — no dedicated subcategory finder",
        "Never rank lightweight landing builders, all-in-one funnels, and enterprise MAP as one list",
      ],
    },
    features: [
      feat(
        "landing-pages",
        "Landing pages",
        "Campaign landing pages, templates, and mobile-responsive builders.",
        "core",
        true,
        true,
      ),
      feat(
        "funnel-builder",
        "Funnel builder",
        "Multi-step acquisition funnels from landing page to conversion.",
        "core",
        true,
        true,
      ),
      feat(
        "forms-lead-capture",
        "Forms & lead capture",
        "Opt-in forms, pop-ups, and lead-capture embeds.",
        "important",
        true,
        true,
      ),
      feat(
        "ab-testing",
        "A/B testing",
        "Landing page and funnel split tests for conversion optimization.",
        "important",
        true,
        true,
      ),
      feat(
        "analytics-reporting",
        "Analytics & reporting",
        "Funnel, conversion, and campaign performance reporting.",
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
        notes: "Per-site, per-funnel, and contact limits when published",
      },
      { domain: "plans", level: "required", featureSlugs: [] },
      {
        domain: "features",
        level: "required",
        featureSlugs: ["landing-pages", "funnel-builder"],
      },
      { domain: "integrations", level: "required", featureSlugs: [] },
      { domain: "limits", level: "required", featureSlugs: [] },
    ],
    editorialMethodology: {
      id: "methodology-landing-pages-cro-v1",
      slug: "landing-pages-cro-editorial",
      name: "Landing Pages & CRO Editorial Methodology",
      version: "1.0.0",
      categorySlug: "landing-pages-cro",
      description:
        "SoftwareGlimpse evaluates landing page and CRO platforms on ease of use, funnel job fit, landing builder depth, funnel workflows, forms, A/B testing, analytics, integrations, scalability, and value. Products are ranked within landing/funnel clusters only. Affiliate relationships never influence scores.",
      criteria: [
        crit("ease-of-use", "Ease of use", "Learning curve for marketers building pages and funnels.", 12, 0, ["features:landing-pages"]),
        crit("cro-job-fit", "CRO job fit", "Fit to landing builder vs all-in-one funnel cluster.", 14, 1, ["features:landing-pages", "features:funnel-builder"]),
        crit("landing-builder", "Landing builder", "Template quality, editor depth, and mobile responsiveness.", 12, 2, ["features:landing-pages"]),
        crit("funnel-workflows", "Funnel workflows", "Multi-step paths, upsells, and conversion sequencing.", 12, 3, ["features:funnel-builder"]),
        crit("forms-capture", "Forms & capture", "Opt-in forms, pop-ups, and lead-capture depth.", 10, 4, ["features:forms-lead-capture"]),
        crit("ab-testing", "A/B testing", "Split-test tooling for pages and funnel steps.", 8, 5, ["features:ab-testing"]),
        crit("analytics", "Analytics", "Funnel and conversion reporting depth.", 8, 6, ["features:analytics-reporting"]),
        crit("integrations", "Integrations", "CRM, ESP, payment, and analytics connectors.", 8, 7, ["integrations"]),
        crit("scalability", "Scalability", "Sites, funnels, contacts, and team seats.", 8, 8, ["limits", "pricing"]),
        crit("value-for-money", "Value for money", "Pricing fairness vs capabilities and plan gates.", 8, 9, ["pricing", "plans"]),
      ],
      notes: "Weights sum to 100. Score within landing/funnel clusters. Affiliate economics excluded.",
    },
    comparisonCriteria: [
      cmp("starting-pricing", "Starting pricing", "factual", 0, "high"),
      cmp("landing-pages", "Landing pages", "editorial", 1, "high", "landing-pages"),
      cmp("funnel-builder", "Funnel builder", "editorial", 2, "high", "funnel-builder"),
      cmp("forms", "Forms & lead capture", "editorial", 3, "high", "forms-lead-capture"),
      cmp("ab-testing", "A/B testing", "editorial", 4, "medium", "ab-testing"),
      cmp("analytics", "Analytics & reporting", "editorial", 5, "high", "analytics-reporting"),
      cmp("integrations", "Integrations", "editorial", 6, "medium"),
    ],
    pricingDimensions: [
      { id: "pd-lpcro-sites", slug: "sites", name: "Sites / funnels", enginePrimitive: "usage", required: true },
      { id: "pd-lpcro-contacts", slug: "contacts", name: "Contacts / leads", enginePrimitive: "usage", required: true },
      { id: "pd-lpcro-plans", slug: "plans", name: "Plan tiers", enginePrimitive: "flat", required: true },
    ],
    pricingCapability: "PARTIAL",
    pricingCapabilityNotes: [
      "Per-site and contact-limit primitives supported; category TCO calculator not built",
    ],
    recommendationDimensions: [
      { id: "rd-lpcro-job", slug: "primary-job", name: "Primary job (landing builder vs all-in-one funnel)" },
      { id: "rd-lpcro-funnel", slug: "funnel-complexity", name: "Funnel complexity" },
      { id: "rd-lpcro-team", slug: "team-size", name: "Team size" },
      { id: "rd-lpcro-budget", slug: "budget", name: "Budget" },
    ],
    finderReadiness: "NOT_READY",
    finderNotes: [
      "Use parent marketing-finder with funnel/landing job filter — no dedicated subcategory finder UI",
      "Landing and funnel job routing through parent marketing finder dimensions",
    ],
    useCases: [
      { slug: "landing-pages", name: "Landing pages", pageEligibility: "content-candidate" },
      { slug: "funnel-building", name: "Funnel building", pageEligibility: "content-candidate" },
    ],
    audienceSlugs: ["small-business", "marketing"],
    businessSizeSlugs: ["micro", "small-business", "mid-market"],
    businessTypeSlugs: ["agency", "saas", "startup", "creators"],
    seedProductSlugs: ["kartra", "freshmarketer", "leadpages"],
    queryAliases: [
      "landing page builder software",
      "sales funnel software",
      "funnel builder software",
      "CRO software",
    ],
    requiredResearchDomains: ["identity", "pricing", "plans", "features", "integrations", "limits"],
    optionalResearchDomains: ["free-trial", "ai-capabilities"],
    pricingModelsSupported: ["per-seat", "usage", "flat", "custom", "hybrid"],
    notes: [
      "Tier 1 marketing subcategory — landing/funnel cluster under parent marketing",
      "Distinct from email automation MAP — Kartra and Leadpages are funnel anchors",
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
    id: `feat-lpcro-${slug}`,
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
    id: `crit-lpcro-${slug}`,
    slug,
    name,
    description,
    weight,
    evidenceRequirements,
    scoringScaleMin: 0,
    scoringScaleMax: 10,
    categorySlug: "landing-pages-cro",
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
    id: `cmp-lpcro-${slug}`,
    slug,
    name,
    kind,
    displayOrder,
    decisionImportance,
    ...(featureSlug ? { featureSlug } : {}),
  };
}
