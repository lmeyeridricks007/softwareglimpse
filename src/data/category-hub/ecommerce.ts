import { CategoryHubProfileSchema, type CategoryHubProfile } from "@/domain";

/**
 * Ecommerce category hub profile.
 * Teaching visuals: `/public/categories/ecommerce-hero.png`, `ecommerce-needs.png`, `ecommerce-workflow.png`.
 */
export function buildEcommerceCategoryHubProfile(): CategoryHubProfile {
  return CategoryHubProfileSchema.parse({
    categorySlug: "ecommerce",
    shortName: "Ecommerce",
    displayName: "Ecommerce Software",
    tagline:
      "Find ecommerce software by job — hosted SaaS platforms, open-source carts, omnichannel POS, or dropshipping sourcing.",
    definition:
      "Ecommerce software helps merchants launch and operate online stores, unify retail channels, or automate supplier imports. The right tool matches the primary job — not a single undifferentiated ranking that pits Shopify against Spocket or Square against WooCommerce.",
    iconSlug: "ecommerce",
    decisionCriteria: [
      "Primary job fit",
      "Catalog & order depth",
      "Checkout & payments",
      "Integrations & channels",
      "Omnichannel / POS need",
      "Total cost (subs + processing + apps)",
    ],
    popularNeeds: [
      "Online storefront",
      "Catalog management",
      "Checkout & conversion",
      "Omnichannel retail",
      "Order fulfillment",
      "Dropshipping sourcing",
    ],
    chooseGuideHref: "/guides/how-to-choose-ecommerce-software/",
    glance: {
      whatItDoes: [
        "Publishes branded online storefronts",
        "Manages products, variants, and collections",
        "Runs checkout and payments",
        "Routes orders and fulfillments",
        "Connects marketplaces and social channels",
        "Bundles POS with online catalog (omnichannel)",
        "Imports supplier catalogs (dropshipping apps)",
      ],
      bestFor: [
        "DTC brands launching online",
        "Retailers adding ecommerce to stores",
        "WordPress merchants",
        "Dropshippers testing niches",
      ],
      typicalFeatures: [
        "Online storefront",
        "Product catalog",
        "Checkout & payments",
        "Order management",
        "POS & omnichannel",
        "App / extension ecosystem",
        "Analytics & reporting",
      ],
    },
    types: [
      {
        id: "saas-platform",
        name: "Hosted SaaS platform",
        description: "Shopify-class all-in-one storefront, checkout, and channels.",
        icon: "layers",
        href: "/use-cases/online-storefront/",
        ctaLabel: "Explore SaaS platforms →",
      },
      {
        id: "open-source",
        name: "Open-source cart",
        description: "WooCommerce-class plugin stacks on your hosting.",
        icon: "code",
        href: "/use-cases/online-storefront/",
        ctaLabel: "Explore open-source →",
      },
      {
        id: "omnichannel",
        name: "Omnichannel retail",
        description: "Square-class POS + online store bundles.",
        icon: "layers",
        href: "/use-cases/omnichannel-retail/",
        ctaLabel: "Explore omnichannel →",
      },
      {
        id: "dropshipping",
        name: "Dropshipping sourcing",
        description: "Spocket/AliDrop-class import automation — requires a storefront.",
        icon: "layers",
        href: "/use-cases/dropshipping-sourcing/",
        ctaLabel: "Explore sourcing apps →",
      },
      {
        id: "website-builder",
        name: "Website-builder commerce",
        description: "Wix/Squarespace-class site + store — design-led SMB, not a commerce OS.",
        icon: "layers",
        href: "/use-cases/website-builder-commerce/",
        ctaLabel: "Explore website builders →",
      },
    ],
    heroVisual: {
      src: "/categories/ecommerce-hero.png",
      alt: "Ecommerce software command center with storefront, catalog, checkout, and channels.",
    },
    needsVisual: {
      src: "/categories/ecommerce-needs.png",
      alt: "Ecommerce buyer problems mapped to software fixes.",
    },
    workflowVisual: {
      src: "/categories/ecommerce-workflow.png",
      alt: "Ecommerce software buyer workflow from job to trial and TCO check.",
    },
    featuredGuideHrefs: [
      "/guides/what-is-ecommerce-software/",
      "/guides/how-to-choose-ecommerce-software/",
      "/guides/ecommerce-pricing-guide/",
      "/best/ecommerce-software/",
    ],
    bestPageHref: "/best/ecommerce-software/",
    methodologyHref: "/guides/ecommerce-pricing-guide/",
    companyRoutes: {
      about: "/about/",
      methodology: "/methodology/",
      affiliateDisclosure: "/affiliate-disclosure/",
    },
  });
}
