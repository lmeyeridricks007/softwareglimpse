import { CategoryHubProfileSchema, type CategoryHubProfile } from "@/domain";

export function buildSocialMediaManagementCategoryHubProfile(): CategoryHubProfile {
  return CategoryHubProfileSchema.parse({
    categorySlug: "social-media-management",
    shortName: "Social Media Management",
    displayName: "Social Media Management Software",
    tagline:
      "Schedule, publish, and analyze social posts across networks — distinct from social listening, influencer campaigns, and marketing automation.",
    definition:
      "Social media management software helps teams plan content calendars, queue posts across networks, triage comments and DMs, and report on channel performance. The right tool matches the scheduling job — lightweight scheduler vs social suite — not a single list that ranks Buffer against Brand24 or Zypper as if they were the same purchase. Shortlist via the parent Marketing Finder with a social scheduling job filter.",
    iconSlug: "social-media-management",
    decisionCriteria: [
      "Primary scheduling job fit",
      "Network and profile coverage",
      "Calendar and approval depth",
      "Social inbox triage",
      "Analytics and reporting",
      "Per-channel and seat pricing",
    ],
    popularNeeds: [
      "Social scheduling",
      "Content calendar",
      "Multi-network publishing",
      "Social inbox",
      "Approval workflows",
      "Social analytics",
    ],
    chooseGuideHref: "/guides/how-to-choose-social-media-management-software/",
    glance: {
      whatItDoes: [
        "Queues posts across social networks",
        "Runs approval workflows on content calendars",
        "Publishes to multiple profiles from one queue",
        "Triages comments and DMs in a social inbox",
        "Recycles and repurposes evergreen content",
        "Reports engagement and channel performance",
      ],
      bestFor: [
        "Social managers publishing weekly calendars",
        "Agencies managing multiple client profiles",
        "Small teams replacing manual posting",
        "Growth teams needing analytics without listening suites",
      ],
      typicalFeatures: [
        "Social scheduling",
        "Content calendar",
        "Social analytics",
        "Social inbox",
        "AI content generation",
      ],
    },
    types: [
      {
        id: "scheduler",
        name: "Social scheduler",
        description: "Lightweight multi-network calendars and publishing queues.",
        icon: "calendar",
        href: "/use-cases/social-media-management/",
        ctaLabel: "Explore schedulers →",
      },
      {
        id: "suite",
        name: "Social suite",
        description: "Publish, inbox, and analytics for larger teams.",
        icon: "layers",
        href: "/use-cases/social-media-management/",
        ctaLabel: "Explore social suites →",
      },
      {
        id: "content-calendar",
        name: "Content calendar",
        description: "Visual planning and approval workflows for social content.",
        icon: "grid",
        href: "/use-cases/content-marketing/",
        ctaLabel: "Explore content calendars →",
      },
      {
        id: "analytics",
        name: "Social analytics",
        description: "Channel performance reporting without listening suites.",
        icon: "bar-chart",
        href: "/use-cases/social-media-management/",
        ctaLabel: "Explore social analytics →",
      },
    ],
    tools: [
      {
        label: "Marketing Finder — social scheduling",
        description:
          "Shortlist by scheduling job fit via the parent marketing finder with social scheduling filter.",
        href: "/tools/marketing-finder/",
        ctaLabel: "Run Marketing Finder →",
      },
    ],
    finderHref: "/tools/marketing-finder/",
    bestPageHref: "/best/social-media-management-software/",
    guides: [
      {
        slug: "what-is-social-media-management-software",
        title: "What is social media management software?",
        href: "/guides/what-is-social-media-management-software/",
      },
      {
        slug: "how-to-choose-social-media-management-software",
        title: "How to choose social media management software",
        href: "/guides/how-to-choose-social-media-management-software/",
      },
      {
        slug: "social-media-management-pricing-guide",
        title: "Social media management pricing guide",
        href: "/guides/social-media-management-pricing-guide/",
      },
      {
        slug: "social-media-management-vs-social-media-marketing",
        title: "Social media management vs broader social marketing",
        href: "/guides/social-media-management-vs-social-media-marketing/",
      },
    ],
  });
}
