import { CategoryHubProfileSchema, type CategoryHubProfile } from "@/domain";

export function buildAnalyticsBiCategoryHubProfile(): CategoryHubProfile {
  return CategoryHubProfileSchema.parse({
    categorySlug: "analytics-bi",
    shortName: "Analytics & BI",
    displayName: "Analytics & Business Intelligence Software",
    tagline:
      "Find analytics software by job — lead attribution, marketing metrics, and executive KPI dashboards.",
    definition:
      "Analytics and business intelligence software helps marketers and operators attribute leads, unify channel metrics, and build KPI dashboards executives can trust. The right tool matches the primary job — not a single list that ranks WhatConverts against Databox as if they were undifferentiated peers. Dedicated finder tooling is deferred until canvas-score is onboarded and the category has six or more primary products.",
    iconSlug: "analytics-bi",
    decisionCriteria: [
      "Primary analytics job fit",
      "Attribution vs dashboard depth",
      "Required data sources",
      "Agency vs in-house reporting",
      "Goal alerts & scheduled delivery",
      "Total cost (sources + seats)",
    ],
    popularNeeds: [
      "Lead attribution",
      "Call tracking",
      "KPI dashboards",
      "Marketing connectors",
      "Executive reporting",
      "ROI proof for campaigns",
    ],
    chooseGuideHref: "/guides/how-to-choose-analytics-bi-software/",
    glance: {
      whatItDoes: [
        "Attributes leads, calls, and forms to campaigns",
        "Pulls metrics from ads, CRM, and analytics tools",
        "Builds executive and team KPI dashboards",
        "Tracks goals with alerts and scheduled reports",
        "Unifies scattered marketing metrics",
        "Supports agency multi-client reporting",
      ],
      bestFor: [
        "Agencies proving campaign ROI to clients",
        "Marketing teams unifying channel metrics",
        "Operators building executive KPI views",
        "Teams needing call-level attribution",
      ],
      typicalFeatures: [
        "Lead attribution",
        "Call tracking",
        "KPI dashboards",
        "Marketing data connectors",
        "Channel reporting",
        "Goals & alerts",
      ],
    },
    types: [
      {
        id: "attribution",
        name: "Lead & call attribution",
        description: "Track leads, calls, and forms to marketing sources.",
        icon: "target",
        href: "/use-cases/marketing-attribution/",
        ctaLabel: "Explore attribution tools →",
      },
      {
        id: "dashboards",
        name: "KPI dashboards",
        description: "Executive and team dashboards with goal tracking.",
        icon: "chart",
        href: "/use-cases/kpi-dashboards/",
        ctaLabel: "Explore dashboard tools →",
      },
      {
        id: "connectors",
        name: "Marketing metrics unification",
        description: "Connect ads, CRM, and analytics into one view.",
        icon: "link",
        href: "/use-cases/marketing-metrics/",
        ctaLabel: "Explore connector tools →",
      },
    ],
    tools: [],
    bestPageHref: "/best/analytics-bi-software/",
    guides: [
      {
        slug: "what-is-analytics-bi-software",
        title: "What is analytics & BI software?",
        href: "/guides/what-is-analytics-bi-software/",
      },
      {
        slug: "how-to-choose-analytics-bi-software",
        title: "How to choose analytics software",
        href: "/guides/how-to-choose-analytics-bi-software/",
      },
      {
        slug: "analytics-bi-pricing-guide",
        title: "Analytics & BI pricing guide",
        href: "/guides/analytics-bi-pricing-guide/",
      },
      {
        slug: "analytics-bi-vs-marketing-software",
        title: "Analytics & BI vs marketing software",
        href: "/guides/analytics-bi-vs-marketing-software/",
      },
    ],
  });
}
