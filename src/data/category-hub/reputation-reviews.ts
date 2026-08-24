import { CategoryHubProfileSchema, type CategoryHubProfile } from "@/domain";

export function buildReputationReviewsCategoryHubProfile(): CategoryHubProfile {
  return CategoryHubProfileSchema.parse({
    categorySlug: "reputation-reviews",
    shortName: "Reputation & Reviews",
    displayName: "Reputation & Review Management Software",
    tagline:
      "Collect reviews, respond on Google and social, and automate reputation workflows for local businesses.",
    definition:
      "Reputation and review management software helps local and service businesses collect customer reviews, monitor reputation signals, respond on Google and social platforms, and automate review-request campaigns. The right tool matches the reputation job — not helpdesk ticketing or live chat widgets. Finder tooling is deferred until the category has four or more primary products.",
    iconSlug: "reputation-reviews",
    decisionCriteria: [
      "Primary reputation job fit",
      "Review collection automation",
      "Platform coverage (Google, social)",
      "Response workflow depth",
      "Social proof & referrals",
      "Total cost (locations + users)",
    ],
    popularNeeds: [
      "Review generation",
      "Google review management",
      "Review monitoring",
      "Social proof widgets",
      "Referral automation",
      "Local reputation workflows",
    ],
    chooseGuideHref: "/guides/how-to-choose-reputation-reviews-software/",
    glance: {
      whatItDoes: [
        "Sends automated review requests after jobs",
        "Monitors new reviews across platforms",
        "Centralizes review response workflows",
        "Embeds social proof on websites",
        "Runs referral campaigns",
        "Alerts teams to reputation changes",
      ],
      bestFor: [
        "Local service businesses building Google presence",
        "Contractors and trades seeking review volume",
        "Franchises managing multi-location reputation",
        "Agencies running reputation for clients",
      ],
      typicalFeatures: [
        "Review collection",
        "Review monitoring",
        "Review response",
        "Social proof widgets",
        "Referral workflows",
        "Reputation automation",
      ],
    },
    types: [
      {
        id: "collection",
        name: "Review collection",
        description: "Automated post-job review requests via SMS and email.",
        icon: "star",
        href: "/use-cases/review-generation/",
        ctaLabel: "Explore review collection tools →",
      },
      {
        id: "monitoring",
        name: "Review monitoring",
        description: "Alerts and dashboards for new reviews and ratings.",
        icon: "bell",
        href: "/use-cases/reputation-reviews/",
        ctaLabel: "Explore monitoring tools →",
      },
      {
        id: "local-reputation",
        name: "Local reputation management",
        description: "Google, social, and multi-location reputation ops.",
        icon: "map-pin",
        href: "/use-cases/local-reputation/",
        ctaLabel: "Explore local reputation tools →",
      },
    ],
    tools: [],
    bestPageHref: "/best/reputation-reviews-software/",
    guides: [
      {
        slug: "what-is-reputation-reviews-software",
        title: "What is reputation & review management software?",
        href: "/guides/what-is-reputation-reviews-software/",
      },
      {
        slug: "how-to-choose-reputation-reviews-software",
        title: "How to choose reputation software",
        href: "/guides/how-to-choose-reputation-reviews-software/",
      },
      {
        slug: "reputation-reviews-pricing-guide",
        title: "Reputation software pricing guide",
        href: "/guides/reputation-reviews-pricing-guide/",
      },
      {
        slug: "reputation-reviews-vs-customer-service-software",
        title: "Reputation vs customer service software",
        href: "/guides/reputation-reviews-vs-customer-service-software/",
      },
    ],
  });
}
