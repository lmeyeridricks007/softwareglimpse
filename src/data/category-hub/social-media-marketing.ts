import { CategoryHubProfileSchema, type CategoryHubProfile } from "@/domain";

export function buildSocialMediaMarketingCategoryHubProfile(): CategoryHubProfile {
  return CategoryHubProfileSchema.parse({
    categorySlug: "social-media-marketing",
    shortName: "Social Media Marketing",
    displayName: "Social Media Marketing Software",
    tagline:
      "Find social media marketing software by job — scheduling, listening, influencer campaigns, and social suites.",
    definition:
      "Social media marketing software helps teams plan posts, monitor mentions, run influencer campaigns, and report on channel performance. The right tool matches the primary job — not a single list that ranks Buffer against Brand24 or Zypper as if they were the same purchase.",
    iconSlug: "social-media-marketing",
    decisionCriteria: [
      "Primary job fit",
      "Channel coverage",
      "Calendar & approval depth",
      "Listening / mention caps",
      "Influencer workflow fit",
      "Total cost (seats + channels + keywords)",
    ],
    popularNeeds: [
      "Social scheduling",
      "Content calendar",
      "Social listening",
      "Brand monitoring",
      "Influencer campaigns",
      "Social analytics",
    ],
    chooseGuideHref: "/guides/how-to-choose-social-media-marketing-software/",
    glance: {
      whatItDoes: [
        "Queues posts across social networks",
        "Runs approval workflows on content calendars",
        "Monitors brand and competitor mentions",
        "Triages comments and DMs in a social inbox",
        "Discovers and tracks influencer campaigns",
        "Reports engagement and social ROI",
      ],
      bestFor: [
        "Social managers publishing weekly calendars",
        "Brand teams monitoring reputation",
        "Agencies managing multiple client profiles",
        "Growth teams running creator partnerships",
      ],
      typicalFeatures: [
        "Social scheduling",
        "Content calendar",
        "Social listening",
        "Social inbox",
        "Influencer outreach",
        "Social analytics",
      ],
    },
    types: [
      {
        id: "scheduler",
        name: "Social scheduling",
        description: "Multi-network calendars, queues, and approvals.",
        icon: "calendar",
        href: "/use-cases/social-media-management/",
        ctaLabel: "Explore schedulers →",
      },
      {
        id: "listening",
        name: "Social listening",
        description: "Mentions, sentiment, and alert workflows.",
        icon: "ear",
        href: "/use-cases/social-listening/",
        ctaLabel: "Explore listening tools →",
      },
      {
        id: "influencer",
        name: "Influencer marketing",
        description: "Creator discovery, outreach, and campaign tracking.",
        icon: "users",
        href: "/use-cases/influencer-marketing/",
        ctaLabel: "Explore influencer platforms →",
      },
      {
        id: "suite",
        name: "Social suite",
        description: "Publish, inbox, and analytics for larger teams.",
        icon: "layers",
        href: "/use-cases/social-media-marketing/",
        ctaLabel: "Explore social suites →",
      },
    ],
    tools: [
      {
        id: "finder",
        name: "Category finder",
        description: "Shortlist by scheduling vs listening vs influencer job.",
        href: "/tools/social-media-marketing-finder/",
        icon: "search",
      },
    ],
    bestPageHref: "/best/social-media-marketing-software/",
    finderHref: "/tools/social-media-marketing-finder/",
    guides: [
      {
        label: "What is social media marketing software?",
        href: "/guides/what-is-social-media-marketing-software/",
      },
      {
        label: "How to choose",
        href: "/guides/how-to-choose-social-media-marketing-software/",
      },
      {
        label: "Pricing guide",
        href: "/guides/social-media-marketing-pricing-guide/",
      },
    ],
  });
}
