import { CategoryHubProfileSchema, type CategoryHubProfile } from "@/domain";

export function buildLandingPagesCroCategoryHubProfile(): CategoryHubProfile {
  return CategoryHubProfileSchema.parse({
    categorySlug: "landing-pages-cro",
    shortName: "Landing Pages & CRO",
    displayName: "Landing Pages & CRO Software",
    tagline:
      "Build high-converting landing pages and sales funnels — distinct from email marketing automation and social scheduling.",
    definition:
      "Landing page and CRO software helps marketers build campaign pages, multi-step funnels, lead-capture forms, and conversion tests. The right tool matches the funnel job — lightweight landing builder vs all-in-one funnel platform — not a single list that ranks Leadpages against Kartra or ActiveCampaign as undifferentiated peers. Shortlist via the parent Marketing Finder with a funnel/landing job filter.",
    iconSlug: "landing-pages-cro",
    decisionCriteria: [
      "Primary funnel job fit",
      "Landing builder vs all-in-one funnel",
      "Template and editor depth",
      "Forms and lead-capture workflows",
      "A/B testing capability",
      "Integrations with ESP and CRM",
    ],
    popularNeeds: [
      "Landing page builder",
      "Sales funnel builder",
      "Lead-capture forms",
      "A/B testing",
      "Conversion analytics",
      "Checkout and upsell steps",
    ],
    chooseGuideHref: "/guides/how-to-choose-landing-pages-cro-software/",
    glance: {
      whatItDoes: [
        "Builds campaign landing pages from templates",
        "Designs multi-step sales funnels",
        "Captures leads with forms and pop-ups",
        "Runs A/B tests on pages and funnel steps",
        "Tracks funnel and conversion metrics",
        "Connects to ESP, CRM, and payment tools",
      ],
      bestFor: [
        "Marketers launching campaign landing pages",
        "Creators selling through funnel sequences",
        "Agencies building client conversion paths",
        "Teams needing CRO without full MAP complexity",
      ],
      typicalFeatures: [
        "Landing pages",
        "Funnel builder",
        "Forms & lead capture",
        "A/B testing",
        "Analytics & reporting",
      ],
    },
    types: [
      {
        id: "landing-builder",
        name: "Landing page builder",
        description: "Fast campaign pages, templates, and mobile-responsive editors.",
        icon: "layout",
        href: "/use-cases/landing-pages/",
        ctaLabel: "Explore landing builders →",
      },
      {
        id: "funnel-platform",
        name: "All-in-one funnel",
        description: "Multi-step funnels with checkout, upsells, and email tie-ins.",
        icon: "git-merge",
        href: "/use-cases/funnel-building/",
        ctaLabel: "Explore funnel platforms →",
      },
      {
        id: "forms-capture",
        name: "Forms & lead capture",
        description: "Opt-in forms, pop-ups, and embeddable lead widgets.",
        icon: "clipboard",
        href: "/use-cases/landing-pages/",
        ctaLabel: "Explore lead capture →",
      },
      {
        id: "cro-testing",
        name: "CRO & A/B testing",
        description: "Split tests and conversion optimization on pages and funnels.",
        icon: "flask",
        href: "/use-cases/funnel-building/",
        ctaLabel: "Explore CRO tools →",
      },
    ],
    tools: [
      {
        label: "Marketing Finder — funnel/landing",
        description:
          "Shortlist by landing vs funnel job fit via the parent marketing finder with funnel/landing filter.",
        href: "/tools/marketing-finder/",
        ctaLabel: "Run Marketing Finder →",
      },
    ],
    finderHref: "/tools/marketing-finder/",
    bestPageHref: "/best/landing-pages-cro-software/",
    guides: [
      {
        slug: "what-is-landing-pages-cro-software",
        title: "What is landing pages & CRO software?",
        href: "/guides/what-is-landing-pages-cro-software/",
      },
      {
        slug: "how-to-choose-landing-pages-cro-software",
        title: "How to choose landing pages & CRO software",
        href: "/guides/how-to-choose-landing-pages-cro-software/",
      },
      {
        slug: "landing-pages-cro-pricing-guide",
        title: "Landing pages & CRO pricing guide",
        href: "/guides/landing-pages-cro-pricing-guide/",
      },
      {
        slug: "landing-pages-cro-vs-email-marketing",
        title: "Landing pages & CRO vs email marketing automation",
        href: "/guides/landing-pages-cro-vs-email-marketing/",
      },
    ],
  });
}
