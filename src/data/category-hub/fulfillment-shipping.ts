import { CategoryHubProfileSchema, type CategoryHubProfile } from "@/domain";

export function buildFulfillmentShippingCategoryHubProfile(): CategoryHubProfile {
  return CategoryHubProfileSchema.parse({
    categorySlug: "fulfillment-shipping",
    shortName: "Fulfillment & Shipping",
    displayName: "Fulfillment & Shipping Software",
    tagline:
      "Ship orders, manage returns, and outsource fulfillment — distinct from storefront platforms and dropshipping sourcing.",
    definition:
      "Fulfillment and shipping software helps merchants ship orders, manage returns, and outsource warehouse operations — label generation, carrier integrations, returns portals, and 3PL networks. The right tool matches the fulfillment job — outsourced 3PL, multi-carrier shipping labels, or returns management — not a single list that ranks ShipBob against Sendcloud as undifferentiated peers. Shortlist via the parent Ecommerce Finder with the integration filter.",
    iconSlug: "fulfillment-shipping",
    decisionCriteria: [
      "Primary fulfillment job fit",
      "3PL outsourcing vs shipping labels vs returns",
      "Order volume and carrier mix",
      "Storefront and marketplace integrations",
      "Returns workflow depth",
      "Per-label vs 3PL fee TCO",
    ],
    popularNeeds: [
      "Order fulfillment workflows",
      "Multi-carrier shipping labels",
      "Returns management portal",
      "3PL warehouse outsourcing",
      "Rate shopping and tracking",
      "Shopify / marketplace sync",
    ],
    chooseGuideHref: "/guides/how-to-choose-fulfillment-shipping-software/",
    glance: {
      whatItDoes: [
        "Routes and fulfills customer orders",
        "Generates shipping labels with rate shopping",
        "Manages returns and reverse logistics",
        "Outsources pick/pack/ship to 3PL networks",
        "Integrates with carriers and storefronts",
        "Tracks shipments and delivery status",
      ],
      bestFor: [
        "Growing brands outsourcing to 3PL via ShipBob",
        "EU merchants needing multi-carrier labels via Sendcloud",
        "Stores scaling beyond self-ship workflows",
        "Merchants needing returns portal automation",
      ],
      typicalFeatures: [
        "Order fulfillment",
        "Shipping labels",
        "Returns management",
        "3PL fulfillment",
        "Carrier integrations",
      ],
    },
    types: [
      {
        id: "3pl-outsourcing",
        name: "3PL outsourcing",
        description: "Outsourced warehouse, inventory, and fulfillment network.",
        icon: "warehouse",
        href: "/use-cases/order-fulfillment/",
        ctaLabel: "Explore 3PL outsourcing →",
      },
      {
        id: "shipping-labels",
        name: "Shipping labels",
        description: "Multi-carrier rate shopping and label generation.",
        icon: "truck",
        href: "/use-cases/shipping-labels/",
        ctaLabel: "Explore shipping labels →",
      },
      {
        id: "returns-management",
        name: "Returns management",
        description: "Return portals, RMA workflows, and reverse logistics.",
        icon: "rotate-ccw",
        href: "/use-cases/returns-management/",
        ctaLabel: "Explore returns management →",
      },
    ],
    tools: [
      {
        label: "Ecommerce Finder — integration filter",
        description:
          "Shortlist by 3PL vs labels vs returns job fit via the parent ecommerce finder.",
        href: "/tools/ecommerce-finder/",
        ctaLabel: "Run Ecommerce Finder →",
      },
    ],
    finderHref: "/tools/ecommerce-finder/",
    bestPageHref: "/best/fulfillment-shipping-software/",
    guides: [
      {
        slug: "what-is-fulfillment-shipping-software",
        title: "What is fulfillment & shipping software?",
        href: "/guides/what-is-fulfillment-shipping-software/",
      },
      {
        slug: "how-to-choose-fulfillment-shipping-software",
        title: "How to choose fulfillment & shipping software",
        href: "/guides/how-to-choose-fulfillment-shipping-software/",
      },
      {
        slug: "fulfillment-shipping-pricing-guide",
        title: "Fulfillment & shipping pricing guide",
        href: "/guides/fulfillment-shipping-pricing-guide/",
      },
      {
        slug: "fulfillment-shipping-vs-ecommerce-software",
        title: "Fulfillment/shipping vs broader ecommerce software",
        href: "/guides/fulfillment-shipping-vs-ecommerce-software/",
      },
    ],
  });
}
