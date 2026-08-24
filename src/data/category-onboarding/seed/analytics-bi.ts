import { CategoryDefinitionSchema, type CategoryDefinition } from "@/domain";

/**
 * Analytics & Business Intelligence decision-domain definition v1.0.
 * Attribute leads, unify marketing metrics, and build executive KPI dashboards.
 */
export const analyticsBiDefinition: CategoryDefinition =
  CategoryDefinitionSchema.parse({
    id: "cat-def-analytics-bi-v1",
    slug: "analytics-bi",
    name: "Analytics & Business Intelligence",
    shortDescription:
      "Attribute leads, unify marketing metrics, and build executive KPI dashboards — distinct from MAP, social scheduling, or funnel builders.",
    parentSlug: null,
    aliases: [
      "marketing analytics software",
      "business intelligence software",
      "KPI dashboard software",
      "lead attribution software",
      "marketing reporting software",
    ],
    lifecycle: "active",
    configVersion: "1.0.0",
    scope: {
      definition:
        "Software whose primary job is proving marketing ROI — lead and call attribution, unified marketing metrics, and executive KPI dashboards. Not full MAP/funnel platforms, social schedulers, or ESPs unless analytics is the stated buyer job.",
      includes: [
        { id: "inc-lead-attribution", label: "Lead & call attribution" },
        { id: "inc-kpi-dashboards", label: "Executive KPI dashboards" },
        { id: "inc-marketing-connectors", label: "Marketing data connectors" },
        { id: "inc-channel-reporting", label: "Channel & campaign reporting" },
      ],
      excludes: [
        {
          id: "exc-map",
          label: "Marketing automation platforms without analytics-first purchase",
          notes: "Prefer marketing for MAP/funnel primary jobs",
        },
        {
          id: "exc-social",
          label: "Social scheduling without BI depth",
          notes: "Prefer social-media-marketing for posting jobs",
        },
        {
          id: "exc-warehouse",
          label: "Enterprise data warehouse / ETL-only stacks",
          notes: "Out of scope until inventory grows",
        },
      ],
      adjacentCategorySlugs: ["marketing", "crm", "ecommerce"],
      classificationNotes: [
        "WhatConverts is lead/call attribution primary — not MAP or social scheduling",
        "Databox is KPI dashboard + connector primary — not funnel builder",
        "Canvas Score pending onboarding — affiliate only, no seed yet",
        "Below 5 primaries — marketing sub-hub until inventory grows",
        "Dedicated finder deferred until canvas-score onboarded and 6+ primaries",
      ],
    },
    features: [
      feat(
        "lead-attribution",
        "Lead attribution",
        "Attribute leads, calls, and forms to campaigns and sources.",
        "core",
        true,
        true,
      ),
      feat(
        "call-tracking",
        "Call tracking",
        "Dynamic numbers, call recording, and call-level source data.",
        "core",
        true,
        true,
      ),
      feat(
        "kpi-dashboards",
        "KPI dashboards",
        "Executive and team dashboards with goal tracking.",
        "core",
        true,
        true,
      ),
      feat(
        "marketing-data-connectors",
        "Marketing data connectors",
        "Pull metrics from ads, CRM, analytics, and ops tools.",
        "core",
        true,
        true,
      ),
      feat(
        "channel-reporting",
        "Channel reporting",
        "Campaign and channel performance rollups.",
        "important",
        true,
        true,
      ),
      feat(
        "goal-alerts",
        "Goals & alerts",
        "Threshold alerts and scheduled report delivery.",
        "important",
        true,
        true,
      ),
      feat(
        "integrations",
        "Integrations",
        "CRM, ads, GA, and warehouse connectors.",
        "important",
        true,
        true,
      ),
      feat(
        "reporting-dashboards",
        "Reporting & dashboards",
        "Shared reporting primitives for landscape scoring.",
        "specialist",
        true,
        false,
        "Score when dashboard depth is claimed but not the primary job.",
      ),
    ],
    researchRequirements: [
      { domain: "identity", level: "required", featureSlugs: [] },
      {
        domain: "pricing",
        level: "required",
        featureSlugs: [],
        notes: "Per-source, per-dashboard, and connector plan models",
      },
      { domain: "plans", level: "required", featureSlugs: [] },
      {
        domain: "features",
        level: "required",
        featureSlugs: ["lead-attribution", "kpi-dashboards", "marketing-data-connectors"],
      },
      { domain: "integrations", level: "required", featureSlugs: [] },
      { domain: "limits", level: "required", featureSlugs: [] },
      { domain: "free-trial", level: "recommended", featureSlugs: [] },
    ],
    editorialMethodology: {
      id: "methodology-analytics-bi-v1",
      slug: "analytics-bi-editorial",
      name: "Analytics & BI Editorial Methodology",
      version: "1.0.0",
      categorySlug: "analytics-bi",
      description:
        "SoftwareGlimpse evaluates analytics and BI platforms on ease of use, analytics job fit, data connector depth, attribution accuracy, dashboard flexibility, integrations, scalability, and value. Products are ranked within job clusters only.",
      criteria: [
        crit("ease-of-use", "Ease of use", "Setup and daily review rituals for marketers and ops.", 12, 0, ["features:kpi-dashboards"]),
        crit("analytics-job-fit", "Analytics job fit", "Fit to attribution, dashboard, or connector cluster.", 15, 1, ["features:lead-attribution", "features:kpi-dashboards"]),
        crit("connector-depth", "Data connector depth", "Ads, CRM, analytics, and ops source coverage.", 12, 2, ["features:marketing-data-connectors", "integrations"]),
        crit("attribution-accuracy", "Attribution accuracy", "Lead/call/form source fidelity and offline→online.", 12, 3, ["features:lead-attribution", "features:call-tracking"]),
        crit("dashboard-flexibility", "Dashboard flexibility", "Widgets, goals, sharing, and drill-down.", 10, 4, ["features:kpi-dashboards"]),
        crit("integrations", "Integrations", "CRM, ads, and warehouse connector depth.", 10, 5, ["integrations"]),
        crit("alerts-reporting", "Alerts & reporting", "Scheduled delivery and threshold alerts.", 8, 6, ["features:goal-alerts"]),
        crit("scalability", "Scalability", "Client accounts, data volume, and governance.", 8, 7, ["limits"]),
        crit("value-for-money", "Value for money", "Pricing fairness vs sources, seats, and dashboards.", 13, 8, ["pricing", "plans"]),
      ],
      notes: "Weights sum to 100. Score within job clusters. Affiliate economics excluded.",
    },
    comparisonCriteria: [
      cmp("starting-pricing", "Starting pricing", "factual", 0, "high"),
      cmp("free-trial", "Free trial", "factual", 1, "medium"),
      cmp("attribution", "Lead attribution", "editorial", 2, "high", "lead-attribution"),
      cmp("dashboards", "KPI dashboards", "editorial", 3, "high", "kpi-dashboards"),
      cmp("connectors", "Data connectors", "editorial", 4, "high", "marketing-data-connectors"),
      cmp("call-tracking", "Call tracking", "editorial", 5, "medium", "call-tracking"),
      cmp("integrations", "Integrations", "editorial", 6, "medium"),
    ],
    pricingDimensions: [
      { id: "pd-bi-sources", slug: "data-sources", name: "Data sources / connectors", enginePrimitive: "usage", required: true },
      { id: "pd-bi-seats", slug: "seats", name: "Users / viewers", enginePrimitive: "per-seat", required: false },
      { id: "pd-bi-plans", slug: "plans", name: "Plan tiers", enginePrimitive: "flat", required: true },
    ],
    pricingCapability: "PARTIAL",
    pricingCapabilityNotes: [
      "Per-source and per-seat primitives supported; category TCO calculator not built",
    ],
    recommendationDimensions: [
      { id: "rd-bi-job", slug: "primary-job", name: "Primary job (attribution vs dashboards)" },
      { id: "rd-bi-sources", slug: "data-sources", name: "Required marketing data sources" },
      { id: "rd-bi-audience", slug: "audience", name: "Agency vs in-house reporting" },
      { id: "rd-bi-budget", slug: "budget", name: "Budget" },
    ],
    finderReadiness: "NOT_READY",
    finderNotes: [
      "Defer dedicated finder until canvas-score onboarded and 6+ primary products",
      "Index under marketing hub with scope notes until inventory grows",
    ],
    useCases: [
      { slug: "marketing-attribution", name: "Marketing attribution", pageEligibility: "content-candidate" },
      { slug: "kpi-dashboards", name: "KPI dashboards", pageEligibility: "content-candidate" },
      { slug: "marketing-metrics", name: "Marketing metrics unification", pageEligibility: "content-candidate" },
    ],
    audienceSlugs: ["marketing", "operations"],
    businessSizeSlugs: ["micro", "small-business", "mid-market", "enterprise"],
    businessTypeSlugs: ["agency", "saas", "startup"],
    seedProductSlugs: ["whatconverts", "databox"],
    queryAliases: [
      "marketing analytics software",
      "KPI dashboard software",
      "lead attribution software",
    ],
    requiredResearchDomains: ["identity", "pricing", "plans", "features", "integrations", "limits"],
    optionalResearchDomains: ["free-trial"],
    pricingModelsSupported: ["per-seat", "usage", "flat", "custom", "hybrid"],
    notes: [
      "Tier 2 nurture inventory — February 2027 hub launch",
      "Canvas Score affiliate pending URL — not in seed",
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
    id: `feat-bi-${slug}`,
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
    id: `crit-bi-${slug}`,
    slug,
    name,
    description,
    weight,
    evidenceRequirements,
    scoringScaleMin: 0,
    scoringScaleMax: 10,
    categorySlug: "analytics-bi",
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
    id: `cmp-bi-${slug}`,
    slug,
    name,
    kind,
    displayOrder,
    decisionImportance,
    ...(featureSlug ? { featureSlug } : {}),
  };
}
