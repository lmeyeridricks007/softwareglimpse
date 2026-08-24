import { CategoryHubProfileSchema, type CategoryHubProfile } from "@/domain";

export function buildDropshippingPodCategoryHubProfile(): CategoryHubProfile {
  return CategoryHubProfileSchema.parse({
    categorySlug: "dropshipping-pod",
    shortName: "Dropshipping & Print-on-Demand",
    displayName: "Dropshipping & Print-on-Demand Software",
    tagline:
      "Source products, POD merch, and fulfill without inventory — distinct from storefront platforms and 3PL shipping.",
    definition:
      "Dropshipping and print-on-demand software helps merchants source products and fulfill orders without holding inventory — supplier catalogs, product import, POD mockups, and storefront integrations. The right tool matches the fulfillment job — curated supplier sourcing, AliExpress import automation, or POD fulfillment networks — not a single list that ranks Spocket against Printify as undifferentiated peers. Shortlist via the parent Ecommerce Finder with the fulfillment-model constraint.",
    iconSlug: "dropshipping-pod",
    decisionCriteria: [
      "Primary fulfillment job fit",
      "Curated sourcing vs AliExpress import vs POD",
      "Supplier catalog breadth and quality",
      "Product import workflow",
      "Storefront platform integrations",
      "Subscription vs per-order pricing",
    ],
    popularNeeds: [
      "Dropshipping supplier sourcing",
      "Print-on-demand merch",
      "One-click product import",
      "Shopify / WooCommerce sync",
      "Curated supplier catalogs",
      "Inventory-free fulfillment",
    ],
    chooseGuideHref: "/guides/how-to-choose-dropshipping-pod-software/",
    glance: {
      whatItDoes: [
        "Discovers and vets dropshipping suppliers",
        "Imports products to your storefront",
        "Manages print-on-demand catalogs and mockups",
        "Syncs inventory and pricing automatically",
        "Fulfills orders without holding stock",
        "Integrates with Shopify and WooCommerce",
      ],
      bestFor: [
        "Merchants launching without inventory investment",
        "Curated US/EU supplier sourcing via Spocket",
        "AliExpress import automation for budget stores",
        "Custom merch via print-on-demand networks",
      ],
      typicalFeatures: [
        "Dropshipping sourcing",
        "Print on demand",
        "Supplier catalog",
        "Product import",
        "Storefront integrations",
      ],
    },
    types: [
      {
        id: "curated-sourcing",
        name: "Curated supplier sourcing",
        description: "Vetted US/EU supplier catalogs with fast shipping.",
        icon: "package-search",
        href: "/use-cases/dropshipping-sourcing/",
        ctaLabel: "Explore curated sourcing →",
      },
      {
        id: "marketplace-import",
        name: "Marketplace import",
        description: "AliExpress and marketplace product import automation.",
        icon: "download",
        href: "/use-cases/dropshipping-sourcing/",
        ctaLabel: "Explore marketplace import →",
      },
      {
        id: "print-on-demand",
        name: "Print on demand",
        description: "Custom merch with POD fulfillment networks.",
        icon: "shirt",
        href: "/use-cases/print-on-demand/",
        ctaLabel: "Explore print on demand →",
      },
    ],
    tools: [
      {
        label: "Ecommerce Finder — fulfillment model",
        description:
          "Shortlist by sourcing vs POD job fit via the parent ecommerce finder.",
        href: "/tools/ecommerce-finder/",
        ctaLabel: "Run Ecommerce Finder →",
      },
    ],
    finderHref: "/tools/ecommerce-finder/",
    bestPageHref: "/best/dropshipping-pod-software/",
    guides: [
      {
        slug: "what-is-dropshipping-pod-software",
        title: "What is dropshipping & print-on-demand software?",
        href: "/guides/what-is-dropshipping-pod-software/",
      },
      {
        slug: "how-to-choose-dropshipping-pod-software",
        title: "How to choose dropshipping & print-on-demand software",
        href: "/guides/how-to-choose-dropshipping-pod-software/",
      },
      {
        slug: "dropshipping-pod-pricing-guide",
        title: "Dropshipping & POD pricing guide",
        href: "/guides/dropshipping-pod-pricing-guide/",
      },
      {
        slug: "dropshipping-pod-vs-ecommerce-software",
        title: "Dropshipping/POD vs broader ecommerce software",
        href: "/guides/dropshipping-pod-vs-ecommerce-software/",
      },
    ],
  });
}
