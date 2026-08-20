export const SOFTWARE_HUB_TABS = [
  {
    id: "overview",
    slug: "",
    label: "Overview",
    titleSuffix: "Review",
    description:
      "Editorial verdict, scores, strengths, limitations, and how this product fits.",
    icon: "overview",
  },
  {
    id: "features",
    slug: "features",
    label: "Features",
    titleSuffix: "Features",
    description:
      "A detailed look at the features this product offers, which plans include them, and how they work in practice.",
    icon: "features",
  },
  {
    id: "pricing",
    slug: "pricing",
    label: "Pricing",
    titleSuffix: "Pricing",
    description:
      "Current plans, seat pricing, add-ons, and what your team is likely to pay.",
    icon: "pricing",
  },
  {
    id: "guides",
    slug: "guides",
    label: "Guides",
    titleSuffix: "Guides",
    description:
      "Setup, implementation, migration, plans, and worth-it guides for this product.",
    icon: "guides",
  },
  {
    id: "use-cases",
    slug: "use-cases",
    label: "Use Cases",
    titleSuffix: "Use Cases",
    description:
      "Where this product excels, the teams that benefit most, and scenarios where it delivers the greatest value.",
    icon: "use-cases",
  },
  {
    id: "comparisons",
    slug: "comparisons",
    label: "Comparisons",
    titleSuffix: "Comparisons",
    description:
      "See how this product compares to other software across features, pricing, ease of use, and overall value.",
    icon: "comparisons",
  },
  {
    id: "alternatives",
    slug: "alternatives",
    label: "Alternatives",
    titleSuffix: "Alternatives",
    description:
      "Explore credible alternatives when this product is not the right fit for your team.",
    icon: "alternatives",
  },
  {
    id: "evidence",
    slug: "evidence",
    label: "Reviews & Evidence",
    titleSuffix: "Reviews & Evidence",
    description:
      "How we researched this product, what we verified, and where our evidence comes from.",
    icon: "evidence",
  },
  {
    id: "methodology",
    slug: "methodology",
    label: "Methodology",
    titleSuffix: "Methodology",
    description:
      "The transparent evaluation process behind this review — criteria, scoring, and independence.",
    icon: "methodology",
  },
  {
    id: "faq",
    slug: "faq",
    label: "FAQ",
    titleSuffix: "FAQ",
    description:
      "Answers to the most common questions buyers ask about this product.",
    icon: "faq",
  },
] as const;

export type SoftwareHubTabId = (typeof SOFTWARE_HUB_TABS)[number]["id"];

export const SOFTWARE_HUB_TAB_SLUGS = SOFTWARE_HUB_TABS.map((t) => t.slug).filter(
  Boolean,
) as string[];

export function getSoftwareHubTab(
  tabIdOrSlug: string | undefined | null,
): (typeof SOFTWARE_HUB_TABS)[number] {
  if (!tabIdOrSlug || tabIdOrSlug === "overview") {
    return SOFTWARE_HUB_TABS[0]!;
  }
  const found = SOFTWARE_HUB_TABS.find(
    (t) => t.id === tabIdOrSlug || t.slug === tabIdOrSlug,
  );
  return found ?? SOFTWARE_HUB_TABS[0]!;
}

export function isSoftwareHubTabSlug(slug: string): boolean {
  return SOFTWARE_HUB_TAB_SLUGS.includes(slug);
}

export function softwareHubPath(productSlug: string, tabId?: SoftwareHubTabId): string {
  const tab = getSoftwareHubTab(tabId ?? "overview");
  if (!tab.slug) return `/software/${productSlug}/`;
  return `/software/${productSlug}/${tab.slug}/`;
}

/** Feature slug → hub category for Features tab navigation. */
export const FEATURE_HUB_CATEGORIES: Array<{
  id: string;
  label: string;
  featureSlugs: string[];
}> = [
  {
    id: "pipeline-deals",
    label: "Pipeline & deals",
    featureSlugs: [
      "pipeline-management",
      "deal-management",
      "custom-pipelines",
    ],
  },
  {
    id: "contacts-leads",
    label: "Contacts & leads",
    featureSlugs: [
      "contact-management",
      "lead-management",
      "lead-scoring",
      "prospecting",
      "data-enrichment",
    ],
  },
  {
    id: "sales-automation",
    label: "Sales automation",
    featureSlugs: [
      "workflow-automation",
      "sales-automation",
      "email-sequences",
      "automation-workflows",
    ],
  },
  {
    id: "email-communication",
    label: "Email & communication",
    featureSlugs: [
      "email-sync",
      "email-tracking",
      "email-campaigns",
      "call-functionality",
      "meeting-scheduling",
    ],
  },
  {
    id: "reporting",
    label: "Reporting & analytics",
    featureSlugs: ["reporting", "forecasting", "analytics"],
  },
  {
    id: "integrations",
    label: "Integrations",
    featureSlugs: ["integrations", "crm-sync", "data-export"],
  },
  {
    id: "ai",
    label: "AI features",
    featureSlugs: ["ai-assistance", "ai-content-generation"],
  },
  {
    id: "mobile",
    label: "Mobile",
    featureSlugs: ["mobile-app"],
  },
  {
    id: "admin",
    label: "Administration",
    featureSlugs: ["custom-fields"],
  },
];
