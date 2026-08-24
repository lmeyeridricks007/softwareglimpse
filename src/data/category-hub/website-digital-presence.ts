import { CategoryHubProfileSchema, type CategoryHubProfile } from "@/domain";

export function buildWebsiteDigitalPresenceCategoryHubProfile(): CategoryHubProfile {
  return CategoryHubProfileSchema.parse({
    categorySlug: "website-digital-presence",
    shortName: "Website & Digital Presence",
    displayName: "Website & Digital Presence Software",
    tagline:
      "Find website software by job — storefronts, site builders, landing pages, hosting panels, and digital business marketplaces.",
    definition:
      "Website and digital presence software helps teams launch sites, optimize landing pages, run hosted stores, administer servers, and buy or sell digital businesses. The right tool matches the primary job — not a single list that ranks Shopify against Leadpages or Plesk as if they were the same purchase. Dedicated finder tooling is deferred until six or more primary products exist.",
    iconSlug: "website-digital-presence",
    decisionCriteria: [
      "Primary web job fit",
      "Commerce vs brochure site",
      "Self-host vs fully hosted",
      "CRO / testing depth",
      "Payment & analytics integrations",
      "Total cost (plans + transaction fees)",
    ],
    popularNeeds: [
      "Online store builder",
      "Website builder",
      "Landing pages",
      "AI website builder",
      "Hosting control panel",
      "Buy/sell online businesses",
    ],
    chooseGuideHref: "/guides/how-to-choose-website-digital-presence-software/",
    glance: {
      whatItDoes: [
        "Publishes websites and landing pages",
        "Runs hosted ecommerce storefronts and checkout",
        "Generates sites from AI prompts",
        "Administers servers and hosting panels",
        "Lists digital businesses for sale",
        "Connects payments, analytics, and CRM",
      ],
      bestFor: [
        "Founders launching a first site or store",
        "Marketers running campaign landing pages",
        "Agencies managing client sites and hosting",
        "Buyers acquiring existing online businesses",
      ],
      typicalFeatures: [
        "Website builder",
        "Landing pages",
        "Online storefront",
        "AI site generation",
        "Hosting control panel",
        "CRO & A/B testing",
      ],
    },
    types: [
      {
        id: "storefront",
        name: "Hosted storefront",
        description: "Catalog, checkout, channels, and apps.",
        icon: "shopping-cart",
        href: "/use-cases/online-storefront/",
        ctaLabel: "Explore storefront platforms →",
      },
      {
        id: "builder",
        name: "Website builders",
        description: "SMB sites with optional commerce plans.",
        icon: "layout",
        href: "/use-cases/website-builder-commerce/",
        ctaLabel: "Explore site builders →",
      },
      {
        id: "landing",
        name: "Landing pages & CRO",
        description: "Campaign pages, forms, and conversion tests.",
        icon: "target",
        href: "/use-cases/landing-pages/",
        ctaLabel: "Explore landing tools →",
      },
      {
        id: "hosting",
        name: "Hosting & panels",
        description: "Server and site administration (IT-primary landscape).",
        icon: "server",
        href: "/use-cases/hosting-operations/",
        ctaLabel: "Explore hosting panels →",
      },
    ],
    tools: [],
    bestPageHref: "/best/website-digital-presence-software/",
    guides: [
      {
        slug: "what-is-website-digital-presence-software",
        title: "What is website & digital presence software?",
        href: "/guides/what-is-website-digital-presence-software/",
      },
      {
        slug: "how-to-choose-website-digital-presence-software",
        title: "How to choose website software",
        href: "/guides/how-to-choose-website-digital-presence-software/",
      },
      {
        slug: "website-digital-presence-vs-ecommerce-software",
        title: "Website hub vs ecommerce software",
        href: "/guides/website-digital-presence-vs-ecommerce-software/",
      },
    ],
  });
}
