import type { CapabilityHubProfile } from "@/domain";

type Depth = Pick<
  CapabilityHubProfile,
  | "displayTitle"
  | "badgeLabel"
  | "tagline"
  | "overview"
  | "whoThisIsFor"
  | "whatMattersIntro"
  | "workedExample"
  | "workedExampleSecondary"
  | "glance"
  | "challenges"
  | "outcomes"
  | "capabilityNeeds"
  | "workflowSteps"
  | "priorities"
  | "scenarios"
  | "buyingFramework"
  | "buyingGuideHref"
  | "faq"
  | "heroVisual"
  | "needsVisual"
  | "workflowVisual"
  | "relatedCapabilitySlugs"
  | "relatedUseCaseSlugs"
  | "relatedRequirementSlugs"
  | "relatedFeatureSlugs"
  | "featuredGuideHrefs"
  | "categorySlug"
>;

const NO_UNIVERSAL =
  "No. Fit depends on your primary ecommerce job (hosted SaaS vs open-source vs omnichannel POS vs dropshipping sourcing), catalog complexity, and which requirements are must-haves. Use the Best ecommerce software shortlist and how-to-choose guide rather than starting from a single ranking.";

const ECOM_META = {
  categorySlug: "ecommerce" as const,
  buyingGuideHref: "/guides/how-to-choose-ecommerce-software/",
};

function ecomCap(args: {
  slug: string;
  title: string;
  badge: string;
  tagline: string;
  overview: string;
  who: string;
  matters: string;
  example: string;
  example2: string;
  goal: string;
  priorities: string[];
  relatedCaps: string[];
  relatedUse: string[];
  featureSlug: string;
}): Depth {
  return {
    ...ECOM_META,
    displayTitle: `Ecommerce ${args.title} capability`,
    badgeLabel: args.badge,
    tagline: args.tagline,
    overview: args.overview,
    whoThisIsFor: args.who,
    whatMattersIntro: args.matters,
    workedExample: args.example,
    workedExampleSecondary: args.example2,
    glance: {
      primaryGoal: args.goal,
      typicalTeam: "Founders, merchandisers, retail ops, and warehouse staff",
      commonPriorities: args.priorities,
    },
    challenges: [
      {
        id: "missing",
        title: "Capability missing or gated",
        pain: "Teams discover the feature only after buying the wrong plan.",
        crmHelps: "Map must-haves to the qualifying plan before purchase.",
      },
      {
        id: "unused",
        title: "Capability unused after launch",
        pain: "Adoption fails and orders drift back to spreadsheets.",
        crmHelps: "Trial with a real SKU and a sceptic operator.",
      },
      {
        id: "tco",
        title: "Hidden TCO",
        pain: "Apps, processing, or hosting blow the starter-tile budget.",
        crmHelps: "Model subscription + processing + apps at your GMV.",
      },
      {
        id: "wrong-job",
        title: "Wrong job cluster",
        pain: "A sourcing app is forced to act like a storefront — or POS is an afterthought.",
        crmHelps: "Keep clusters on separate decision paths.",
      },
    ],
    outcomes: [
      {
        id: "clarity",
        title: "Clearer operating loop",
        description: "The capability supports a weekly ritual people keep.",
      },
      {
        id: "less-rework",
        title: "Less rework",
        description: "Catalog, checkout, or fulfillment needs fewer manual chases.",
      },
      {
        id: "evidence",
        title: "Better evidence",
        description: "Operators can review orders, inventory, or imports without a vendor screenshot.",
      },
    ],
    capabilityNeeds: [
      {
        id: args.slug,
        title: args.title,
        description: `Evaluate ${args.title.toLowerCase()} on the plan you will buy.`,
        priority: "must" as const,
        href: `/capabilities/${args.slug}/`,
      },
    ],
    workflowSteps: [
      {
        id: "confirm",
        label: "Confirm must-have",
        detail: "Write the weekly outcome this capability must deliver.",
      },
      {
        id: "map",
        label: "Map plan gates",
        detail: "Check which tier unlocks the workflow.",
      },
      {
        id: "trial",
        label: "Trial with a real order",
        detail: "Run one SKU through catalog, checkout, or import.",
      },
      {
        id: "decide",
        label: "Decide inside the cluster",
        detail: "Compare peers for the same job — not across clusters.",
      },
    ],
    priorities: args.priorities.slice(0, 3).map((title, i) => ({
      id: `p-${i}`,
      title,
      description: `${title} as a buying lens for this capability.`,
      icon: "check" as const,
    })),
    scenarios: [
      {
        id: "primary",
        title: "Primary job buyer",
        bestWhen: "This capability is central to the weekly commerce ritual.",
      },
      {
        id: "adjacent",
        title: "Adjacent buyer",
        bestWhen: "Another ecommerce cluster is primary — keep this on a secondary shortlist.",
      },
    ],
    buyingFramework: [
      {
        step: 1,
        title: "Confirm this capability is a must-have",
        href: "/guides/how-to-choose-ecommerce-software/",
      },
      {
        step: 2,
        title: "Map it to plan gates and TCO",
        href: "/guides/ecommerce-pricing-guide/",
      },
      {
        step: 3,
        title: "Test it with a real order",
        href: "/guides/what-is-ecommerce-software/",
      },
      {
        step: 4,
        title: "Compare researched platforms",
        href: "/best/ecommerce-software/",
        ctaLabel: "Best ecommerce software →",
      },
    ],
    faq: [
      {
        question: `Is there one best platform for ${args.title.toLowerCase()}?`,
        answer: NO_UNIVERSAL,
      },
      {
        question: "How does this relate to CRM capabilities?",
        answer:
          "CRM capabilities store relationships and pipeline on customer records. Ecommerce capabilities run storefront, catalog, checkout, and fulfillment — often integrating with ads and email. Buy for the commerce job that is blocking first.",
      },
    ],
    relatedCapabilitySlugs: args.relatedCaps,
    relatedUseCaseSlugs: args.relatedUse,
    relatedRequirementSlugs: [],
    relatedFeatureSlugs: [args.featureSlug],
    featuredGuideHrefs: [
      "/guides/how-to-choose-ecommerce-software/",
      "/guides/what-is-ecommerce-software/",
      "/best/ecommerce-software/",
      "/categories/ecommerce/",
    ],
    heroVisual: {
      src:
        args.slug === "inventory-management" || args.slug === "shipping-fulfillment"
          ? `/capabilities/${args.slug}-hero-v2.png`
          : `/capabilities/${args.slug}-hero.png`,
      alt: `Educational diagram of ecommerce ${args.title.toLowerCase()} capability.`,
      caption: `${args.title} as buyers should evaluate it in an ecommerce stack — not a product endorsement.`,
    },
    needsVisual: {
      src: `/capabilities/${args.slug}-needs.png`,
      alt: `Diagram mapping ${args.title.toLowerCase()} pains to ecommerce capability fixes.`,
      caption: `What usually breaks around ${args.title.toLowerCase()} — and how this capability helps.`,
    },
    workflowVisual: {
      src: `/capabilities/${args.slug}-workflow.png`,
      alt: `Workflow diagram for using ${args.title.toLowerCase()} in ecommerce.`,
      caption: `A practical operating loop for ${args.title.toLowerCase()}.`,
    },
  };
}

/**
 * Ecommerce capability hub depth.
 */
export const ecommerceCapabilityDepth: Record<string, Depth> = {
  "online-storefront": ecomCap({
    slug: "online-storefront",
    title: "Online storefront",
    badge: "Storefront",
    tagline: "Branded product pages, themes, and a shoppable domain.",
    overview:
      "Online storefront is the capability that publishes a catalog customers can browse and buy from — hosted SaaS or open-source.",
    who: "DTC founders and merchandisers launching or redesigning a shop.",
    matters: "Evaluate themes, custom domain, and checkout on the plan you will buy.",
    example:
      "Worked example: Harbor Studio publishes 12 SKUs on a branded domain instead of a marketplace-only shop.",
    example2:
      "Worked example: a WordPress site adds WooCommerce rather than migrating off the CMS.",
    goal: "A shoppable branded store",
    priorities: ["Theme quality", "Custom domain", "Mobile UX", "Plan gates", "App TCO"],
    relatedCaps: ["product-catalog", "checkout-payments"],
    relatedUse: ["online-storefront"],
    featureSlug: "online-storefront",
  }),
  "product-catalog": ecomCap({
    slug: "product-catalog",
    title: "Product catalog",
    badge: "Catalog",
    tagline: "SKUs, variants, collections, and merchandising at scale.",
    overview:
      "Product catalog capability covers variants, collections, and merchandising so shoppers find the right SKU.",
    who: "Merchandisers managing options, bundles, or large catalogs.",
    matters: "Evaluate variant depth and collection rules on the plan you will buy.",
    example:
      "Worked example: Northline Retail stops rebuilding size/color matrices in sheets.",
    example2:
      "Worked example: a B2B seller needs quantity breaks that a simple catalog cannot hold.",
    goal: "Trusted SKU truth",
    priorities: ["Variants", "Collections", "Bulk edit", "B2B lists", "Plan gates"],
    relatedCaps: ["online-storefront", "inventory-management", "b2b-wholesale"],
    relatedUse: ["catalog-management", "wholesale-b2b"],
    featureSlug: "product-catalog",
  }),
  "checkout-payments": ecomCap({
    slug: "checkout-payments",
    title: "Checkout & payments",
    badge: "Checkout",
    tagline: "Cart, payment methods, and conversion at the last step.",
    overview:
      "Checkout & payments is converting a cart into a paid order — including wallets, express checkout, and processing spreads.",
    who: "Founders and ops owners accountable for conversion and card rates.",
    matters: "Evaluate methods, abandonment tools, and processing TCO on the qualifying plan.",
    example:
      "Worked example: Harbor Studio adds shopper wallets and measures completed checkouts, not just store visits.",
    example2:
      "Worked example: a retailer compares native payments vs a third-party gateway fee.",
    goal: "Paid orders without friction",
    priorities: ["Payment methods", "Express checkout", "Processing rates", "Trust signals", "Plan gates"],
    relatedCaps: ["online-storefront", "order-management"],
    relatedUse: ["checkout-conversion"],
    featureSlug: "checkout-payments",
  }),
  "order-management": ecomCap({
    slug: "order-management",
    title: "Order management",
    badge: "Orders",
    tagline: "Capture, route, and update orders across channels.",
    overview:
      "Order management keeps every paid order in a queue operators can fulfill without a shared inbox.",
    who: "Ops and warehouse staff processing daily orders.",
    matters: "Evaluate status workflows, refunds, and multi-channel orders on the plan you will buy.",
    example:
      "Worked example: Harbor Studio stops copying PayPal emails into a packing sheet.",
    example2:
      "Worked example: marketplace and website orders land in one queue.",
    goal: "Owned order queues",
    priorities: ["Statuses", "Refunds", "Multi-channel", "Notifications", "Integrations"],
    relatedCaps: ["shipping-fulfillment", "inventory-management"],
    relatedUse: ["order-fulfillment"],
    featureSlug: "order-management",
  }),
  "inventory-management": ecomCap({
    slug: "inventory-management",
    title: "Inventory management",
    badge: "Inventory",
    tagline: "On-hand counts, locations, and oversell protection.",
    overview:
      "Inventory management keeps stock accurate across website, POS, and warehouses so you do not sell what you cannot ship.",
    who: "Retail and warehouse operators sharing stock across channels.",
    matters: "Evaluate multi-location stock and oversell rules on the plan you will buy.",
    example:
      "Worked example: Harbor Retail stops selling the last unit twice — once in store, once online.",
    example2:
      "Worked example: a 3PL location is a first-class stock bucket, not a note.",
    goal: "Trusted on-hand counts",
    priorities: ["Locations", "Oversell rules", "Transfers", "POS sync", "Plan gates"],
    relatedCaps: ["pos-omnichannel", "order-management", "shipping-fulfillment"],
    relatedUse: ["omnichannel-retail", "order-fulfillment"],
    featureSlug: "inventory-management",
  }),
  "shipping-fulfillment": ecomCap({
    slug: "shipping-fulfillment",
    title: "Shipping & fulfillment",
    badge: "Fulfillment",
    tagline: "Labels, rates, tracking, and 3PL handoffs.",
    overview:
      "Shipping & fulfillment turns paid orders into labeled shipments and tracking the buyer can trust.",
    who: "Warehouse and ops staff packing daily.",
    matters: "Evaluate label printers, carrier rates, and 3PL connectors on the plan or apps you will buy.",
    example:
      "Worked example: Harbor Studio prints labels from the order queue instead of a carrier website.",
    example2:
      "Worked example: a brand routes overflow to a 3PL without retyping addresses.",
    goal: "Shipped orders with tracking",
    priorities: ["Labels", "Rates", "Tracking", "3PL", "Returns"],
    relatedCaps: ["order-management", "inventory-management"],
    relatedUse: ["order-fulfillment"],
    featureSlug: "shipping-fulfillment",
  }),
  "pos-omnichannel": ecomCap({
    slug: "pos-omnichannel",
    title: "POS & omnichannel",
    badge: "POS",
    tagline: "In-person selling with the same catalog and inventory as online.",
    overview:
      "POS & omnichannel unifies brick-and-click so stores and the website share items, stock, and customers.",
    who: "Retailers adding a website or online brands opening a store.",
    matters: "Evaluate hardware, location inventory, and pickup on the package you will buy.",
    example:
      "Worked example: Harbor Retail rings a sale in store and the website stock updates.",
    example2:
      "Worked example: buy-online-pickup-in-store without a second catalog.",
    goal: "One catalog, online and in store",
    priorities: ["Hardware", "Shared inventory", "Pickup", "Location plans", "Processing rates"],
    relatedCaps: ["inventory-management", "checkout-payments", "online-storefront"],
    relatedUse: ["omnichannel-retail"],
    featureSlug: "pos-omnichannel",
  }),
  "marketplace-channels": ecomCap({
    slug: "marketplace-channels",
    title: "Marketplace & sales channels",
    badge: "Channels",
    tagline: "Amazon, social shops, and other storefronts from one catalog.",
    overview:
      "Marketplace & sales channels reuse product data so you are not merchandising the same SKU in five admin UIs.",
    who: "Brands selling on marketplaces and social shops as well as their domain.",
    matters: "Evaluate which channels are native vs app-gated on the plan you will buy.",
    example:
      "Worked example: Harbor Studio lists the same SKU on Instagram Shop without a second inventory file.",
    example2:
      "Worked example: marketplace orders return into the same fulfillment queue.",
    goal: "One catalog, many storefronts",
    priorities: ["Native channels", "Sync fidelity", "Order routing", "App TCO", "Plan gates"],
    relatedCaps: ["product-catalog", "order-management"],
    relatedUse: ["online-storefront", "order-fulfillment"],
    featureSlug: "marketplace-channels",
  }),
  "b2b-wholesale": ecomCap({
    slug: "b2b-wholesale",
    title: "B2B / wholesale",
    badge: "B2B",
    tagline: "Price lists, quantity breaks, and buyer-specific catalogs.",
    overview:
      "B2B / wholesale lets trade buyers purchase at negotiated prices without a separate wholesale spreadsheet.",
    who: "Brands selling to retailers or other businesses alongside DTC.",
    matters: "Evaluate price lists and company accounts on the plan you will buy — often a higher tier.",
    example:
      "Worked example: Northline Retail publishes a logged-in wholesale catalog instead of emailing CSVs.",
    example2:
      "Worked example: quantity breaks apply automatically at checkout.",
    goal: "Negotiated prices without spreadsheets",
    priorities: ["Price lists", "Company accounts", "Quantity breaks", "Net terms", "Plan gates"],
    relatedCaps: ["product-catalog", "checkout-payments"],
    relatedUse: ["wholesale-b2b"],
    featureSlug: "b2b-wholesale",
  }),
  "dropshipping-sourcing": ecomCap({
    slug: "dropshipping-sourcing",
    title: "Dropshipping sourcing",
    badge: "Sourcing",
    tagline: "Import supplier catalogs and route orders without holding inventory.",
    overview:
      "Dropshipping sourcing is an import-and-route job that requires an existing storefront — it is not a platform.",
    who: "Merchants testing supplier SKUs on a store they already run.",
    matters: "Evaluate product caps, supplier geography, and order push on the plan you will buy.",
    example:
      "Worked example: Harbor Studio imports 20 US/EU SKUs into Shopify without holding stock.",
    example2:
      "Worked example: a Shopify-only merchant uses an import app instead of switching platforms.",
    goal: "Imported SKUs that fulfill automatically",
    priorities: ["Import caps", "Supplier quality", "Order routing", "Store connector", "Plan TCO"],
    relatedCaps: ["product-catalog", "order-management", "online-storefront"],
    relatedUse: ["dropshipping-sourcing"],
    featureSlug: "dropshipping-sourcing",
  }),
  "app-extensions": ecomCap({
    slug: "app-extensions",
    title: "App / extension ecosystem",
    badge: "Apps",
    tagline: "Third-party apps and plugins that extend the core commerce loop.",
    overview:
      "App / extension ecosystems fill gaps — reviews, subscriptions, wholesale — but they are part of TCO, not free features.",
    who: "Merchants whose core platform is close but missing a specialist workflow.",
    matters: "Budget recurring app fees and check whether a higher native plan is cheaper than a stack of plugins.",
    example:
      "Worked example: Harbor Studio adds a reviews app and treats its monthly fee as part of platform TCO.",
    example2:
      "Worked example: a WooCommerce merchant models paid extensions before calling the stack free.",
    goal: "Extend without surprise bills",
    priorities: ["Native vs app", "Recurring fees", "Maintenance", "Security", "Plan comparison"],
    relatedCaps: ["online-storefront", "checkout-payments"],
    relatedUse: ["online-storefront", "checkout-conversion"],
    featureSlug: "app-extensions",
  }),
};
