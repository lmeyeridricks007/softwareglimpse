import { CategoryHubProfileSchema, type CategoryHubProfile } from "@/domain";

export function buildPpcAdvertisingCategoryHubProfile(): CategoryHubProfile {
  return CategoryHubProfileSchema.parse({
    categorySlug: "ppc-advertising",
    shortName: "PPC Advertising",
    displayName: "PPC Advertising Software",
    tagline:
      "Manage and optimize paid search and social ad campaigns — distinct from landing page builders and email marketing automation.",
    definition:
      "PPC advertising software helps marketers create, manage, and optimize paid campaigns across search, social, and display ad platforms. The right tool matches the PPC job — search-focused vs social ads vs cross-channel — not a single list that ranks Diginius against Kartra or ActiveCampaign as undifferentiated peers. Shortlist via the parent Marketing Finder, scoping PPC vs MAP vs landing jobs. Hub deferred until 4+ PPC-native peers are onboarded.",
    iconSlug: "ppc-advertising",
    decisionCriteria: [
      "Primary PPC job fit",
      "Search vs social vs cross-channel ads",
      "Ad platform coverage",
      "Bid and budget management",
      "Cross-channel reporting",
      "Marketing automation tie-ins",
    ],
    popularNeeds: [
      "Paid search management",
      "Social ads management",
      "Bid optimization",
      "Budget pacing",
      "Cross-channel ad reporting",
      "Campaign automation",
    ],
    chooseGuideHref: "/guides/how-to-choose-ppc-advertising-software/",
    glance: {
      whatItDoes: [
        "Creates and manages paid ad campaigns",
        "Optimizes bids and budgets across platforms",
        "Reports cross-channel ad performance",
        "Automates rules for pacing and scaling",
        "Connects ad data to CRM and analytics",
        "Ties paid acquisition to nurture workflows",
      ],
      bestFor: [
        "Agencies managing client ad accounts",
        "In-house teams scaling paid search",
        "Ecommerce brands running social ads",
        "Marketers needing PPC reporting without full MAP",
      ],
      typicalFeatures: [
        "Ads management",
        "Marketing automation",
        "Analytics & reporting",
        "Integrations",
      ],
    },
    types: [
      {
        id: "paid-search",
        name: "Paid search",
        description: "Search campaign management, bid rules, and keyword optimization.",
        icon: "search",
        href: "/use-cases/marketing-automation/",
        ctaLabel: "Explore paid search →",
      },
      {
        id: "paid-social",
        name: "Paid social",
        description: "Social ad campaign management across Meta, LinkedIn, and more.",
        icon: "share-2",
        href: "/use-cases/marketing-automation/",
        ctaLabel: "Explore paid social →",
      },
      {
        id: "cross-channel",
        name: "Cross-channel PPC",
        description: "Unified reporting and management across search and social ads.",
        icon: "layers",
        href: "/use-cases/marketing-automation/",
        ctaLabel: "Explore cross-channel PPC →",
      },
      {
        id: "ppc-reporting",
        name: "PPC reporting",
        description: "Ad performance dashboards and attribution without full campaign UI.",
        icon: "bar-chart",
        href: "/use-cases/marketing-automation/",
        ctaLabel: "Explore PPC reporting →",
      },
    ],
    tools: [
      {
        label: "Marketing Finder — PPC constraint",
        description:
          "Shortlist by PPC job fit via the parent marketing finder, scoping PPC vs MAP vs landing.",
        href: "/tools/marketing-finder/",
        ctaLabel: "Run Marketing Finder →",
      },
    ],
    finderHref: "/tools/marketing-finder/",
    bestPageHref: "/best/ppc-advertising-software/",
    guides: [
      {
        slug: "what-is-ppc-advertising-software",
        title: "What is PPC advertising software?",
        href: "/guides/what-is-ppc-advertising-software/",
      },
      {
        slug: "how-to-choose-ppc-advertising-software",
        title: "How to choose PPC advertising software",
        href: "/guides/how-to-choose-ppc-advertising-software/",
      },
      {
        slug: "ppc-advertising-pricing-guide",
        title: "PPC advertising pricing guide",
        href: "/guides/ppc-advertising-pricing-guide/",
      },
      {
        slug: "ppc-advertising-vs-marketing-automation",
        title: "PPC advertising vs marketing automation",
        href: "/guides/ppc-advertising-vs-marketing-automation/",
      },
    ],
  });
}
