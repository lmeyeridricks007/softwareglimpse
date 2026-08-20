import type { UseCaseHubProfile } from "@/domain";

type Depth = Pick<
  UseCaseHubProfile,
  | "overview"
  | "whoThisIsFor"
  | "whatMattersIntro"
  | "workedExample"
  | "workedExampleSecondary"
  | "tagline"
  | "displayTitle"
  | "badgeLabel"
  | "glance"
  | "challenges"
  | "outcomes"
  | "capabilityNeeds"
  | "workflowSteps"
  | "priorities"
  | "scenarios"
  | "buyingFramework"
  | "needsVisual"
  | "workflowVisual"
  | "heroVisual"
  | "faq"
  | "relatedUseCaseSlugs"
  | "featuredGuideHrefs"
  | "categorySlug"
  | "finderHref"
  | "catalogueHref"
  | "primaryCta"
  | "secondaryCta"
  | "buyingGuideHref"
>;

const ECOM_CTAS = {
  categorySlug: "ecommerce" as const,
  finderHref: "/best/ecommerce-software/",
  catalogueHref: "/categories/ecommerce/",
  buyingGuideHref: "/guides/how-to-choose-ecommerce-software/",
  primaryCta: {
    href: "/best/ecommerce-software/",
    label: "Best ecommerce software",
  },
  secondaryCta: {
    href: "/categories/ecommerce/",
    label: "Browse ecommerce software",
  },
};

const ECOM_GUIDES = [
  "/guides/what-is-ecommerce-software/",
  "/guides/how-to-choose-ecommerce-software/",
  "/guides/ecommerce-pricing-guide/",
  "/best/ecommerce-software/",
];

/** Prefer `-v2` teaching visuals when a unique GenerateImage set exists for this slug. */
const ECOM_USE_V2: Record<string, Partial<Record<"hero" | "needs" | "workflow", true>>> = {
  "order-fulfillment": { workflow: true },
  "website-builder-commerce": { hero: true, needs: true, workflow: true },
};

function ecomUseVisual(slug: string, kind: "hero" | "needs" | "workflow"): string {
  const suffix = ECOM_USE_V2[slug]?.[kind] ? `${kind}-v2` : kind;
  return `/use-cases/${slug}-${suffix}.png`;
}

function ecommerceUseCase(args: {
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
  typicalTeam: string;
  priorities: string[];
  productsNote: string;
  related: string[];
  challenges: Array<{
    id: string;
    title: string;
    pain: string;
    crmHelps: string;
  }>;
  outcomes: Array<{ id: string; title: string; description: string }>;
  needs: Array<{
    id: string;
    title: string;
    description: string;
    priority: "must" | "nice";
  }>;
  steps: Array<{ id: string; label: string; detail: string; goal: string }>;
  scenarios: Array<{ id: string; title: string; bestWhen: string }>;
  extraFaq: { question: string; answer: string };
}): Depth {
  return {
    ...ECOM_CTAS,
    displayTitle: `Ecommerce software for ${args.title}`,
    badgeLabel: args.badge,
    tagline: args.tagline,
    overview: args.overview,
    whoThisIsFor: args.who,
    whatMattersIntro: args.matters,
    workedExample: args.example,
    workedExampleSecondary: args.example2,
    glance: {
      primaryGoal: args.goal,
      typicalTeam: args.typicalTeam,
      commonPriorities: args.priorities,
    },
    challenges: args.challenges,
    outcomes: args.outcomes,
    capabilityNeeds: args.needs.map((n) => ({
      ...n,
      href: `/capabilities/${n.id}/`,
    })),
    workflowSteps: args.steps,
    priorities: args.priorities.map((title, i) => ({
      id: `p-${i}`,
      title,
      description: `${title} as a buying lens for this use case.`,
      icon: "check" as const,
    })),
    scenarios: args.scenarios,
    buyingFramework: [
      {
        step: 1,
        title: "Confirm this use case is the primary job",
        href: "/guides/how-to-choose-ecommerce-software/",
      },
      {
        step: 2,
        title: "Price the qualifying configuration",
        href: "/guides/ecommerce-pricing-guide/",
      },
      {
        step: 3,
        title: "Compare researched platforms",
        href: "/best/ecommerce-software/",
        ctaLabel: "Best ecommerce software →",
      },
    ],
    heroVisual: {
      src: ecomUseVisual(args.slug, "hero"),
      alt: `Educational diagram for ${args.title} in ecommerce software.`,
      caption: `${args.title} as buyers should evaluate it — not a product endorsement.`,
    },
    needsVisual: {
      src: ecomUseVisual(args.slug, "needs"),
      alt: `Needs diagram for ${args.title}.`,
      caption: "What usually breaks — and how the right tooling helps.",
    },
    workflowVisual: {
      src: ecomUseVisual(args.slug, "workflow"),
      alt: `Workflow diagram for ${args.title}.`,
      caption: "A practical operating loop for this use case.",
    },
    faq: [
      {
        question: "Which products relate to this use case?",
        answer: `In the current ecommerce catalogue wave, explore: ${args.productsNote}. Related products appear when those soft entries are seeded and tagged.`,
      },
      {
        question: "Is there one best tool for this use case?",
        answer:
          "No. Fit depends on job cluster, channels, and plan gates. Use the Best ecommerce software page for methodology-based editor’s picks inside clusters — not one undifferentiated ranking across storefront platforms and sourcing apps.",
      },
      args.extraFaq,
    ],
    relatedUseCaseSlugs: args.related,
    featuredGuideHrefs: ECOM_GUIDES,
  };
}

/**
 * Ecommerce use-case hub depth (`/use-cases/[slug]/`).
 * Educational — no invented prices, scores, or product endorsements.
 */
export const ecommerceUseCaseDepth: Record<string, Depth> = {
  "online-storefront": ecommerceUseCase({
    slug: "online-storefront",
    title: "Online storefront",
    badge: "Online storefront",
    tagline:
      "Launch a branded online store with catalog, checkout, and payments — instead of stitching a brochure site to a payment link.",
    overview:
      "Online storefront is the job of publishing a buyer-facing shop: themes, product pages, domains, cart, and checkout that a merchant can operate without rebuilding the store for every campaign. Hosted SaaS platforms and open-source carts both do this job — they fail for different hosting and TCO reasons.",
    who: "DTC brands, SMB merchants, and WordPress operators whose blocking job is a live store customers can browse and buy from — not a POS-first or supplier-import app.",
    matters:
      "Prioritise theme and editor quality, catalog-to-checkout completeness, and channel apps on the plan you will actually buy. Model hosting plus extensions separately if you choose an open-source cart.",
    example:
      "Worked example: Harbor Studio moves from Instagram checkout links to a branded store. Every product has a page, cart, and paid order — so Friday launches no longer depend on a founder DMing invoices.",
    example2:
      "Worked example: a WordPress publisher adds a cart plugin on existing hosting so the blog and store share one domain — then prices hosting, SSL, and paid extensions as one configuration.",
    goal: "A branded store customers can browse and complete an order on",
    typicalTeam: "DTC merchants, SMB operators, and WordPress store owners",
    priorities: [
      "Theme / editor on the quoted plan",
      "Catalog to checkout completeness",
      "Payments and tax handling",
      "Apps / extensions TCO",
      "Hosting vs SaaS ownership",
    ],
    productsNote: "shopify, bigcommerce, woocommerce, square-online",
    related: [
      "catalog-management",
      "checkout-conversion",
      "omnichannel-retail",
    ],
    challenges: [
      {
        id: "brochure",
        title: "The site cannot take an order",
        pain: "Buyers leave to pay by invoice, DM, or a third-party link.",
        crmHelps:
          "A storefront with cart and checkout keeps browse-to-pay on one domain.",
      },
      {
        id: "theme-gates",
        title: "The editor or theme is plan-gated",
        pain: "The mock looked complete; the paid plan is what you actually need.",
        crmHelps:
          "Map theme, checkout, and channel features to the qualifying plan before you buy.",
      },
      {
        id: "wrong-shape",
        title: "The shortlist mixes different jobs",
        pain: "A sourcing app is compared as if it were a store, or POS is treated as a SaaS peer.",
        crmHelps:
          "Shortlist hosted platforms against hosted platforms, and open-source carts against open-source.",
      },
      {
        id: "hidden-tco",
        title: "Apps and hosting rewrite the price",
        pain: "The starter tile ignores payment processing, themes, and plugins.",
        crmHelps:
          "Price the configuration you will run — subscription plus processing plus extensions.",
      },
    ],
    outcomes: [
      {
        id: "live-store",
        title: "A live branded store",
        description: "Customers reach products, cart, and checkout on your domain.",
      },
      {
        id: "owned-orders",
        title: "Owned order records",
        description: "Each paid order has a status the merchant can fulfil from.",
      },
      {
        id: "repeatable-merch",
        title: "Repeatable merchandising",
        description: "Collections and themes change without rebuilding the site.",
      },
      {
        id: "honest-tco",
        title: "Honest configuration TCO",
        description: "Hosting, apps, and processing sit on the same buying sheet.",
      },
    ],
    needs: [
      {
        id: "online-storefront",
        title: "Online storefront",
        description: "Evaluate themes, pages, and domains on the plan you will buy.",
        priority: "must",
      },
      {
        id: "product-catalog",
        title: "Product catalog",
        description: "Confirm products, variants, and collections are native.",
        priority: "must",
      },
      {
        id: "checkout-payments",
        title: "Checkout & payments",
        description: "Cart, checkout, and payment methods must complete an order.",
        priority: "must",
      },
      {
        id: "app-extensions",
        title: "App / extension ecosystem",
        description: "Model paid apps or plugins as part of TCO, not a bonus.",
        priority: "nice",
      },
    ],
    steps: [
      {
        id: "launch",
        label: "Launch the store",
        detail: "Connect domain, theme, and a first product.",
        goal: "A URL a buyer can open.",
      },
      {
        id: "catalog",
        label: "Stock the catalog",
        detail: "Add products, variants, and collections with owners.",
        goal: "No empty storefront.",
      },
      {
        id: "checkout",
        label: "Turn on checkout",
        detail: "Enable payments, tax, and shipping rules for a test order.",
        goal: "One paid order end-to-end.",
      },
      {
        id: "operate",
        label: "Operate weekly",
        detail: "Review orders, merchandising, and app spend.",
        goal: "One improvement per week.",
      },
    ],
    scenarios: [
      {
        id: "saas",
        title: "Hosted SaaS merchant",
        bestWhen:
          "You want an all-in-one storefront, checkout, and channels without running hosting.",
      },
      {
        id: "open-source",
        title: "Open-source / WordPress merchant",
        bestWhen:
          "You already own a WordPress site and will model hosting plus extension TCO.",
      },
    ],
    extraFaq: {
      question: "Is a dropshipping sourcing app a storefront?",
      answer:
        "No. Sourcing apps import supplier catalogs into an existing store. Shortlist them under dropshipping sourcing — not as a substitute for a hosted or open-source storefront.",
    },
  }),

  "omnichannel-retail": ecommerceUseCase({
    slug: "omnichannel-retail",
    title: "Omnichannel retail",
    badge: "Omnichannel retail",
    tagline:
      "Sell online and in person with one catalog, one inventory picture, and payments the register and the site both trust.",
    overview:
      "Omnichannel retail is the job of unifying brick-and-click: POS, online store, and stock so a floor sale and a web order cannot sell the same last unit twice. It is a different purchase from a pure hosted storefront or a dropshipping importer.",
    who: "Retailers already (or about to) run in-person checkout who need the same catalog and inventory online — not DTC-only brands without a counter.",
    matters:
      "Prioritise POS + online on one catalog, inventory sync across locations, and payment reconciliation on the bundle you will actually buy. Confirm whether omnichannel is native or an add-on.",
    example:
      "Worked example: Harbor Retail publishes the same SKU to the floor POS and the website. A Saturday web order decrements store stock before the Sunday shift opens — so staff stop selling air.",
    example2:
      "Worked example: a café with a Square-class register adds an online store so catering orders and walk-ins share payments and items — without a second catalog in a spreadsheet.",
    goal: "Unified catalog, inventory, and payments across floor and web",
    typicalTeam: "Brick-and-click retailers, multi-location shops, and POS-first operators",
    priorities: [
      "POS + online on one catalog",
      "Inventory across locations",
      "Buy online / pick up in store",
      "Payment reconciliation",
      "Hardware and plan gates",
    ],
    productsNote: "square-online, shopify",
    related: [
      "online-storefront",
      "catalog-management",
      "order-fulfillment",
    ],
    challenges: [
      {
        id: "two-catalogs",
        title: "Floor and web catalogs diverge",
        pain: "Staff sell items the site still shows, or the reverse.",
        crmHelps:
          "One product record feeding POS and storefront keeps merchandising in sync.",
      },
      {
        id: "phantom-stock",
        title: "Inventory is not shared",
        pain: "The last unit sells twice; refunds and apologies follow.",
        crmHelps:
          "Location-aware stock and reservation rules protect the last unit.",
      },
      {
        id: "split-payments",
        title: "Payments live in two dashboards",
        pain: "Finance reconciles register and ecommerce as if they were two businesses.",
        crmHelps:
          "A POS + online bundle with shared tender reporting reduces dual books.",
      },
      {
        id: "wrong-peer",
        title: "The shortlist is a generic SaaS rank",
        pain: "A hosted DTC platform is compared as if it were a register bundle.",
        crmHelps:
          "Shortlist omnichannel POS + online peers — not undifferentiated storefront lists.",
      },
    ],
    outcomes: [
      {
        id: "one-catalog",
        title: "One catalog of record",
        description: "Floor and web merchandising share SKUs and prices.",
      },
      {
        id: "trusted-stock",
        title: "Trusted location stock",
        description: "Staff see what is sellable before they ring or ship.",
      },
      {
        id: "shared-tender",
        title: "Shared payment picture",
        description: "Register and online tenders reconcile from one stack.",
      },
      {
        id: "bopis-ready",
        title: "In-store pickup that holds",
        description: "Web orders reserve floor stock instead of hoping.",
      },
    ],
    needs: [
      {
        id: "pos-omnichannel",
        title: "POS & omnichannel",
        description: "Evaluate in-person POS plus online on the qualifying bundle.",
        priority: "must",
      },
      {
        id: "product-catalog",
        title: "Product catalog",
        description: "The same SKUs must feed floor and web.",
        priority: "must",
      },
      {
        id: "inventory-management",
        title: "Inventory management",
        description: "Confirm location stock and low-stock alerts on the plan you buy.",
        priority: "must",
      },
      {
        id: "checkout-payments",
        title: "Checkout & payments",
        description: "Register and web checkout should share tender reporting.",
        priority: "must",
      },
    ],
    steps: [
      {
        id: "unify",
        label: "Unify the catalog",
        detail: "One SKU list for POS and the online store.",
        goal: "No shadow product sheets.",
      },
      {
        id: "locations",
        label: "Map locations",
        detail: "Assign stock to stores and any warehouse.",
        goal: "Sellable quantity per site.",
      },
      {
        id: "sell",
        label: "Sell both ways",
        detail: "Ring a floor sale and complete a web order on the same item.",
        goal: "Stock decrements in both channels.",
      },
      {
        id: "reconcile",
        label: "Reconcile",
        detail: "Review tenders and exceptions weekly.",
        goal: "One ops improvement per week.",
      },
    ],
    scenarios: [
      {
        id: "pos-first",
        title: "POS-first retailer",
        bestWhen:
          "The register already runs daily and the online store must inherit that catalog.",
      },
      {
        id: "multi-site",
        title: "Multi-location shop",
        bestWhen:
          "Stock and pickup rules differ by site and a single warehouse view is not enough.",
      },
    ],
    extraFaq: {
      question: "Is omnichannel the same as launching a DTC storefront?",
      answer:
        "Not always. DTC storefronts can add POS later, but omnichannel buyers should shortlist tools whose primary job is unified POS + online inventory — not a store-only platform ranked as if it were a register bundle.",
    },
  }),

  "catalog-management": ecommerceUseCase({
    slug: "catalog-management",
    title: "Catalog management",
    badge: "Catalog management",
    tagline:
      "Keep products, variants, collections, and merchandising accurate at SKU scale — instead of rebuilding the catalog in spreadsheets.",
    overview:
      "Catalog management is the operational layer of ecommerce: SKUs, options, collections, and merchandising that survive channel copies. A storefront without catalog discipline still publishes wrong prices and ghost variants.",
    who: "Merchandisers, ops leads, and multi-SKU merchants whose weekly pain is product data — not theme design or supplier import alone.",
    matters:
      "Prioritise variant depth, collections, and inventory hooks on the plan you will buy. Confirm whether marketplace channels copy the same catalog or a second spreadsheet.",
    example:
      "Worked example: Northline Goods stops maintaining colour/size variants in a sheet. Each SKU has options the storefront and channels both read — so a price change does not require three uploads.",
    example2:
      "Worked example: a seasonal merchant uses collections for drop merchandising so homepage and ads point at the same product set.",
    goal: "Trusted products, variants, and collections at SKU scale",
    typicalTeam: "Merchandisers, ops, and multi-SKU ecommerce teams",
    priorities: [
      "Variant and option depth",
      "Collections / merchandising",
      "Inventory on the SKU",
      "Channel catalog copy",
      "Bulk edit / import gates",
    ],
    productsNote: "shopify, bigcommerce, woocommerce",
    related: [
      "online-storefront",
      "wholesale-b2b",
      "checkout-conversion",
    ],
    challenges: [
      {
        id: "sheet-source",
        title: "The spreadsheet is the catalog",
        pain: "Prices and variants drift from what the store shows.",
        crmHelps:
          "A product record with options and collections becomes the system of record.",
      },
      {
        id: "variant-chaos",
        title: "Variants are incomplete",
        pain: "Buyers pick a size that cannot fulfil, or staff duplicate SKUs.",
        crmHelps:
          "Native variants and inventory on the option keep sellable combinations honest.",
      },
      {
        id: "channel-fork",
        title: "Marketplaces fork the catalog",
        pain: "A listing update never reaches the store, or the reverse.",
        crmHelps:
          "Channel publishing that reads the same product record reduces dual maintenance.",
      },
      {
        id: "bulk-gates",
        title: "Bulk edit is plan-gated",
        pain: "Seasonal updates take a weekend of one-by-one clicks.",
        crmHelps:
          "Confirm import, bulk edit, and collection tools on the qualifying plan.",
      },
    ],
    outcomes: [
      {
        id: "sku-truth",
        title: "SKU truth",
        description: "Each sellable combination has one product record.",
      },
      {
        id: "merch-sets",
        title: "Merchandising sets",
        description: "Collections drive storefront and campaign surfaces.",
      },
      {
        id: "less-rekey",
        title: "Fewer rekeys",
        description: "Price and copy changes propagate instead of being pasted.",
      },
      {
        id: "channel-ready",
        title: "Channel-ready data",
        description: "Listings can reuse the catalog instead of a second file.",
      },
    ],
    needs: [
      {
        id: "product-catalog",
        title: "Product catalog",
        description: "Evaluate products, variants, and collections on the plan you will buy.",
        priority: "must",
      },
      {
        id: "inventory-management",
        title: "Inventory management",
        description: "Stock must attach to the SKU, not a separate notebook.",
        priority: "must",
      },
      {
        id: "marketplace-channels",
        title: "Marketplace & sales channels",
        description: "Confirm whether channels reuse this catalog or fork it.",
        priority: "nice",
      },
      {
        id: "online-storefront",
        title: "Online storefront",
        description: "Collections and product pages must publish from the same records.",
        priority: "must",
      },
    ],
    steps: [
      {
        id: "model",
        label: "Model the SKU",
        detail: "Define products, options, and sellable variants.",
        goal: "No duplicate ghost SKUs.",
      },
      {
        id: "merch",
        label: "Merchandise",
        detail: "Build collections and surfaces buyers will actually use.",
        goal: "Findable products.",
      },
      {
        id: "stock",
        label: "Attach stock",
        detail: "Inventory and low-stock rules live on the variant.",
        goal: "Sellable quantities you can defend.",
      },
      {
        id: "publish",
        label: "Publish & refresh",
        detail: "Push changes to storefront and channels from one record.",
        goal: "One catalog of record.",
      },
    ],
    scenarios: [
      {
        id: "multi-variant",
        title: "High-variant catalog",
        bestWhen:
          "Colour, size, or bundle options are the weekly merchandising load.",
      },
      {
        id: "multi-channel",
        title: "Multi-channel merchant",
        bestWhen:
          "The same SKUs must reach storefront plus marketplaces without a second spreadsheet.",
      },
    ],
    extraFaq: {
      question: "Can catalog management be bought separately from a storefront?",
      answer:
        "Usually it is a capability of the storefront platform or cart — not a standalone ranking against POS or sourcing apps. Confirm variant depth and bulk tools on the plan you will buy, then keep adjacent jobs on their own shortlists.",
    },
  }),

  "checkout-conversion": ecommerceUseCase({
    slug: "checkout-conversion",
    title: "Checkout & conversion",
    badge: "Checkout & conversion",
    tagline:
      "Get carts to paid orders with payment methods, express checkout, and recovery that the quoted plan actually includes.",
    overview:
      "Checkout & conversion is the job of turning intent into a paid order: cart, payment methods, tax/shipping at checkout, and recovery for abandoned carts. Theme polish without a completable checkout is not this job.",
    who: "Merchants whose blocking metric is completed checkout — DTC, omnichannel, and cart operators who already have a catalog to sell.",
    matters:
      "Prioritise payment methods buyers actually use, checkout completeness on the quoted plan, and whether recovery is native or an app. Record gateway and processing fees separately from subscription.",
    example:
      "Worked example: Harbor Studio loses carts at payment because only one card brand is offered. Enabling additional methods and a guest checkout path reduces drop-off without a redesign.",
    example2:
      "Worked example: an SMB enables abandoned-cart recovery on the plan that actually includes it — after confirming the feature is not an unpaid app.",
    goal: "Completable checkout with payment methods buyers will use",
    typicalTeam: "DTC merchants, conversion owners, and store operators",
    priorities: [
      "Payment methods on the plan",
      "Guest / express checkout",
      "Tax and shipping at checkout",
      "Abandoned-cart recovery gates",
      "Processing fee TCO",
    ],
    productsNote: "shopify, bigcommerce, woocommerce, square-online",
    related: [
      "online-storefront",
      "order-fulfillment",
      "catalog-management",
    ],
    challenges: [
      {
        id: "broken-pay",
        title: "Checkout cannot complete",
        pain: "Buyers abandon because a method, tax, or shipping step fails.",
        crmHelps:
          "Native checkout with the payment methods you will actually offer keeps the path completable.",
      },
      {
        id: "forced-account",
        title: "Forced accounts stall guests",
        pain: "First-time buyers bounce rather than create a login.",
        crmHelps:
          "Guest checkout and express wallets reduce account friction when they are in-plan.",
      },
      {
        id: "recovery-apps",
        title: "Recovery is an afterthought app",
        pain: "Abandoned carts sit in a report nobody emails from.",
        crmHelps:
          "Confirm native or app recovery on the qualifying plan — and its extra cost.",
      },
      {
        id: "fee-surprise",
        title: "Processing fees rewrite TCO",
        pain: "The subscription looked cheap until card fees landed.",
        crmHelps:
          "Model gateway and processing fees beside the plan, not after go-live.",
      },
    ],
    outcomes: [
      {
        id: "completable",
        title: "Completable checkout",
        description: "A test order can pay without a workaround.",
      },
      {
        id: "method-fit",
        title: "Method fit",
        description: "Buyers see tenders they already use.",
      },
      {
        id: "recovery-loop",
        title: "A recovery loop",
        description: "Abandoned carts have an owned follow-up path.",
      },
      {
        id: "fee-clarity",
        title: "Fee clarity",
        description: "Processing sits on the same buying sheet as subscription.",
      },
    ],
    needs: [
      {
        id: "checkout-payments",
        title: "Checkout & payments",
        description: "Evaluate cart, checkout, and payment methods on the plan you will buy.",
        priority: "must",
      },
      {
        id: "online-storefront",
        title: "Online storefront",
        description: "Checkout has to live on the store buyers already browse.",
        priority: "must",
      },
      {
        id: "order-management",
        title: "Order management",
        description: "Paid checkouts must create an order ops can fulfil.",
        priority: "must",
      },
      {
        id: "app-extensions",
        title: "App / extension ecosystem",
        description: "Recovery and wallets may be apps — price them as such.",
        priority: "nice",
      },
    ],
    steps: [
      {
        id: "methods",
        label: "Choose methods",
        detail: "List the tenders buyers in your market expect.",
        goal: "No missing must-have payment type.",
      },
      {
        id: "complete",
        label: "Complete a test order",
        detail: "Guest path, tax, and shipping on the quoted checkout.",
        goal: "One paid order without staff intervention.",
      },
      {
        id: "recover",
        label: "Recover abandons",
        detail: "Turn on native or app recovery and name an owner.",
        goal: "Abandoned carts are not a dead report.",
      },
      {
        id: "review",
        label: "Review drop-off",
        detail: "Check where carts stall; fix one step per week.",
        goal: "One conversion improvement weekly.",
      },
    ],
    scenarios: [
      {
        id: "dtc",
        title: "DTC checkout",
        bestWhen:
          "The store is live and unpaid carts — not catalog depth — are the weekly blocker.",
      },
      {
        id: "omni-pay",
        title: "Omnichannel tender",
        bestWhen:
          "Floor and web payments must reconcile, not just convert the online cart.",
      },
    ],
    extraFaq: {
      question: "Should processing fees be compared as if they were subscription price?",
      answer:
        "Treat them as part of configuration TCO, not a substitute for job-fit. Confirm live gateway rates with the vendor. SoftwareGlimpse does not invent fee totals or rank products by unpublished processing.",
    },
  }),

  "order-fulfillment": ecommerceUseCase({
    slug: "order-fulfillment",
    title: "Order fulfillment",
    badge: "Order fulfillment",
    tagline:
      "Pick, pack, ship, and track orders from one operations queue — instead of reconstructing status from inboxes and carrier sites.",
    overview:
      "Order fulfillment is the job of moving a paid order to a delivered one: labels, tracking, 3PL handoffs, and returns. It sits beside catalog and checkout; it is not a sourcing-app substitute for a store.",
    who: "Ops and warehouse-adjacent merchants whose weekly ritual is shipping paid orders — including teams evaluating 3PL handoffs as software, not as a logistics contract alone.",
    matters:
      "Prioritise order queues, shipping labels, and inventory decrement on the plan you will buy. Confirm whether 3PL and returns are native, an app, or a separate service.",
    example:
      "Worked example: Northline Ops prints labels from the order queue instead of copying addresses into a carrier site. Tracking writes back so support stops asking “did it ship?” in chat.",
    example2:
      "Worked example: a merchant routes overflow SKUs to a 3PL while keeping high-velocity items in-house — after confirming the handoff is supported on the quoted stack.",
    goal: "Paid orders that ship with tracking ops can trust",
    typicalTeam: "Ecommerce ops, warehouse leads, and multi-channel merchants",
    priorities: [
      "Order queue and statuses",
      "Labels and tracking write-back",
      "Inventory decrement on ship",
      "3PL / app handoff gates",
      "Returns path",
    ],
    productsNote: "shopify, bigcommerce, woocommerce",
    related: [
      "catalog-management",
      "checkout-conversion",
      "dropshipping-sourcing",
    ],
    challenges: [
      {
        id: "inbox-ops",
        title: "Fulfillment lives in inboxes",
        pain: "Nobody knows which paid orders still need a label.",
        crmHelps:
          "An order queue with statuses and owners replaces carrier-tab archaeology.",
      },
      {
        id: "stock-lag",
        title: "Stock does not decrement on ship",
        pain: "The store still sells what left the building.",
        crmHelps:
          "Fulfillment that updates inventory keeps sellable quantity honest.",
      },
      {
        id: "tracking-gap",
        title: "Tracking never writes back",
        pain: "Support re-asks the carrier because the order record is blank.",
        crmHelps:
          "Label and tracking fields on the order give support a single place to look.",
      },
      {
        id: "3pl-split",
        title: "3PL is a side spreadsheet",
        pain: "Overflow routing is tribal knowledge.",
        crmHelps:
          "Confirm 3PL or app handoffs on the qualifying plan before you split inventory.",
      },
    ],
    outcomes: [
      {
        id: "owned-queue",
        title: "An owned order queue",
        description: "Every unshipped paid order has a next action.",
      },
      {
        id: "shipped-truth",
        title: "Shipped-as-truth inventory",
        description: "Stock follows fulfillment, not a nightly guess.",
      },
      {
        id: "visible-tracking",
        title: "Visible tracking",
        description: "Support reads the order, not a second portal.",
      },
      {
        id: "clear-returns",
        title: "A clear returns path",
        description: "Refunds and restocks attach to the original order.",
      },
    ],
    needs: [
      {
        id: "order-management",
        title: "Order management",
        description: "Evaluate orders, fulfillments, and refunds on the plan you will buy.",
        priority: "must",
      },
      {
        id: "shipping-fulfillment",
        title: "Shipping & fulfillment",
        description: "Labels, rates, and tracking must exist on the quoted configuration.",
        priority: "must",
      },
      {
        id: "inventory-management",
        title: "Inventory management",
        description: "Ship events should update sellable stock.",
        priority: "must",
      },
      {
        id: "marketplace-channels",
        title: "Marketplace & sales channels",
        description: "Multi-channel orders should land in the same queue when that is the job.",
        priority: "nice",
      },
    ],
    steps: [
      {
        id: "capture",
        label: "Capture the order",
        detail: "Paid checkouts enter a queue with an owner.",
        goal: "No orphan paid orders.",
      },
      {
        id: "pick",
        label: "Pick & pack",
        detail: "Allocate stock and pack from the record.",
        goal: "Fulfillment matches the order.",
      },
      {
        id: "ship",
        label: "Ship & track",
        detail: "Buy a label; write tracking back to the order.",
        goal: "The buyer and support see the same status.",
      },
      {
        id: "except",
        label: "Handle exceptions",
        detail: "Returns, splits, and 3PL overflow have a path.",
        goal: "One ops improvement per week.",
      },
    ],
    scenarios: [
      {
        id: "in-house",
        title: "In-house shipping",
        bestWhen:
          "The team prints labels from the order queue and needs tracking write-back.",
      },
      {
        id: "split-3pl",
        title: "Split 3PL routing",
        bestWhen:
          "Some SKUs ship from a partner and the handoff must stay on the order record.",
      },
    ],
    extraFaq: {
      question: "Is a 3PL the same as ecommerce fulfillment software?",
      answer:
        "A 3PL is a logistics service. Ecommerce software is the order queue, labels, and inventory updates. Shortlist software for the operating loop; treat 3PL contracts as an adjacent decision unless the vendor sells a self-serve software SKU.",
    },
  }),

  "dropshipping-sourcing": ecommerceUseCase({
    slug: "dropshipping-sourcing",
    title: "Dropshipping sourcing",
    badge: "Dropshipping sourcing",
    tagline:
      "Import supplier catalogs and route orders without holding inventory — on top of a storefront you already run.",
    overview:
      "Dropshipping sourcing is the job of connecting an existing store to supplier catalogs, importing products, and routing paid orders to suppliers. It is not a hosted storefront and should not be ranked against Shopify-class platforms.",
    who: "Merchants testing niches or running supplier-fulfilled catalogs who already have (or will buy) a storefront — not buyers looking for an all-in-one shop builder.",
    matters:
      "Prioritise supplier geography and quality filters, import automation, and order routing on the plan you will buy. Confirm the storefront the app actually supports.",
    example:
      "Worked example: a Shopify merchant imports a US/EU supplier catalog through a sourcing app, then routes test orders so the first paid sale does not require copy-paste into a supplier dashboard.",
    example2:
      "Worked example: a niche tester compares two sourcing apps on the same storefront — after confirming neither replaces the need for checkout and themes.",
    goal: "Supplier imports and order routing without holding inventory",
    typicalTeam: "Dropship merchants, niche testers, and store operators with a live cart",
    priorities: [
      "Existing storefront required",
      "Supplier geography / quality",
      "Import automation",
      "Order routing to suppliers",
      "Plan caps on SKUs / orders",
    ],
    productsNote: "spocket, alidrop",
    related: [
      "online-storefront",
      "catalog-management",
      "order-fulfillment",
    ],
    challenges: [
      {
        id: "no-store",
        title: "There is no storefront yet",
        pain: "A sourcing app cannot publish a branded checkout by itself.",
        crmHelps:
          "Buy or confirm the store first; treat sourcing as an add-on job cluster.",
      },
      {
        id: "manual-import",
        title: "Products are copy-pasted",
        pain: "Catalog updates lag suppliers; prices and stock lie.",
        crmHelps:
          "Import automation keeps supplier catalogs from becoming a weekend spreadsheet.",
      },
      {
        id: "manual-route",
        title: "Orders are retyped to suppliers",
        pain: "Paid sales stall in a tab nobody owns.",
        crmHelps:
          "Order routing from the store to the supplier reduces missed fulfilments.",
      },
      {
        id: "wrong-rank",
        title: "Sourcing is ranked against platforms",
        pain: "A specialist app looks “incomplete” next to a full storefront.",
        crmHelps:
          "Compare sourcing apps to sourcing peers only — never as a Shopify substitute.",
      },
    ],
    outcomes: [
      {
        id: "imported-catalog",
        title: "An imported catalog",
        description: "Supplier products land on the existing store without rekeying.",
      },
      {
        id: "routed-orders",
        title: "Routed orders",
        description: "Paid sales reach the supplier from the store record.",
      },
      {
        id: "honest-scope",
        title: "Honest job scope",
        description: "The storefront remains a separate purchase.",
      },
      {
        id: "cap-awareness",
        title: "Plan-cap awareness",
        description: "SKU and order limits are checked before a large import.",
      },
    ],
    needs: [
      {
        id: "dropshipping-sourcing",
        title: "Dropshipping sourcing",
        description: "Evaluate supplier import and routing on the plan you will buy.",
        priority: "must",
      },
      {
        id: "product-catalog",
        title: "Product catalog",
        description: "Imported products must land as store SKUs you can merchandise.",
        priority: "must",
      },
      {
        id: "order-management",
        title: "Order management",
        description: "Paid store orders must route to suppliers with a status you can see.",
        priority: "must",
      },
      {
        id: "shipping-fulfillment",
        title: "Shipping & fulfillment",
        description: "Supplier shipping updates should write back when the app supports it.",
        priority: "nice",
      },
    ],
    steps: [
      {
        id: "store",
        label: "Confirm the store",
        detail: "A live storefront and checkout already exist.",
        goal: "Sourcing is an add-on, not a shop builder.",
      },
      {
        id: "import",
        label: "Import suppliers",
        detail: "Filter geography and quality; import a test set.",
        goal: "SKUs you are willing to sell.",
      },
      {
        id: "route",
        label: "Route a test order",
        detail: "Pay a test checkout and confirm supplier handoff.",
        goal: "No copy-paste fulfilment.",
      },
      {
        id: "cap",
        label: "Check plan caps",
        detail: "SKU and order limits on the quoted sourcing plan.",
        goal: "No surprise lock mid-import.",
      },
    ],
    scenarios: [
      {
        id: "us-eu",
        title: "US/EU supplier import",
        bestWhen:
          "You already have a store and want supplier catalogs with published plan caps.",
      },
      {
        id: "shopify-native",
        title: "Shopify-native import",
        bestWhen:
          "The store is Shopify and the sourcing app’s job is import automation on that cart only.",
      },
    ],
    extraFaq: {
      question: "Do you rank dropshipping apps against full storefront platforms?",
      answer:
        "No. Sourcing apps require a store. Compare them inside the dropshipping-sourcing cluster. Hosted SaaS, open-source carts, and omnichannel POS stay on their own shortlists.",
    },
  }),

  "wholesale-b2b": ecommerceUseCase({
    slug: "wholesale-b2b",
    title: "Wholesale / B2B",
    badge: "Wholesale / B2B",
    tagline:
      "Run company accounts, price lists, and bulk checkout so wholesale buyers are not forced through a DTC cart.",
    overview:
      "Wholesale / B2B is the job of selling to companies: negotiated price lists, buyer accounts, and bulk ordering on an ecommerce platform. It is adjacent to catalog management — not a dropshipping importer and not always included on every storefront plan.",
    who: "Manufacturers, distributors, and brands selling to other businesses who need account pricing and bulk order flows — not only a public DTC catalog.",
    matters:
      "Prioritise company accounts, price lists, and bulk checkout on the plan you will buy. Confirm whether B2B is native, Plus-gated, or an extension.",
    example:
      "Worked example: Harbor Goods gives approved retailers a login with their price list. Reorders happen in bulk instead of emailing a spreadsheet that nobody versions.",
    example2:
      "Worked example: a distributor separates DTC and wholesale catalogs so a consumer promo never overwrites a negotiated tier.",
    goal: "Company accounts with price lists and bulk checkout",
    typicalTeam: "Wholesale brands, distributors, and B2B merchandisers",
    priorities: [
      "Company / buyer accounts",
      "Price lists and tiers",
      "Bulk / quick order",
      "Native vs add-on / plan gate",
      "Catalog shared with DTC",
    ],
    productsNote: "bigcommerce, shopify, woocommerce",
    related: [
      "catalog-management",
      "online-storefront",
      "order-fulfillment",
    ],
    challenges: [
      {
        id: "email-reorder",
        title: "Wholesale reorders live in email",
        pain: "Price lists drift and nobody knows which quote is current.",
        crmHelps:
          "Buyer accounts with attached price lists make the current deal visible at checkout.",
      },
      {
        id: "dtc-bleed",
        title: "DTC prices leak to wholesale",
        pain: "Retail partners see consumer pricing, or consumers see partner SKUs.",
        crmHelps:
          "Separate catalogs or gated price lists keep audiences on the right offer.",
      },
      {
        id: "line-tax",
        title: "Bulk line entry is painful",
        pain: "Buyers will not click through 80 product pages to reorder.",
        crmHelps:
          "Quick order, CSV, or bulk add-to-cart on the qualifying plan reduces friction.",
      },
      {
        id: "gate-surprise",
        title: "B2B is plan-gated or an extension",
        pain: "The storefront demo looked wholesale-ready; the quoted plan is not.",
        crmHelps:
          "Map accounts, price lists, and bulk checkout to the configuration you will buy.",
      },
    ],
    outcomes: [
      {
        id: "account-pricing",
        title: "Account pricing",
        description: "Approved buyers see their list, not the public catalog price.",
      },
      {
        id: "bulk-path",
        title: "A bulk order path",
        description: "Reorders do not require a consumer-style browse.",
      },
      {
        id: "separated-offers",
        title: "Separated offers",
        description: "DTC and wholesale merchandising do not overwrite each other.",
      },
      {
        id: "owned-reorder",
        title: "Owned reorders",
        description: "Wholesale orders land in the same fulfillment queue as other paid orders.",
      },
    ],
    needs: [
      {
        id: "b2b-wholesale",
        title: "B2B / wholesale",
        description: "Evaluate company accounts and price lists on the plan you will buy.",
        priority: "must",
      },
      {
        id: "product-catalog",
        title: "Product catalog",
        description: "Wholesale SKUs still need variants and merchandising discipline.",
        priority: "must",
      },
      {
        id: "checkout-payments",
        title: "Checkout & payments",
        description: "Bulk checkout and net terms (if offered) must complete on the quoted plan.",
        priority: "must",
      },
      {
        id: "order-management",
        title: "Order management",
        description: "Wholesale orders should share the fulfillment queue with other channels.",
        priority: "must",
      },
    ],
    steps: [
      {
        id: "accounts",
        label: "Create buyer accounts",
        detail: "Approve companies and attach a price list.",
        goal: "No anonymous wholesale pricing.",
      },
      {
        id: "catalog",
        label: "Scope the catalog",
        detail: "Decide what is DTC-public versus account-gated.",
        goal: "The right offer per audience.",
      },
      {
        id: "order",
        label: "Place a bulk order",
        detail: "Test quick order or bulk add on the quoted checkout.",
        goal: "A reorder without a spreadsheet.",
      },
      {
        id: "fulfil",
        label: "Fulfil from the queue",
        detail: "Wholesale paid orders follow the same ops path.",
        goal: "One order system of record.",
      },
    ],
    scenarios: [
      {
        id: "brand-wholesale",
        title: "Brand with retail partners",
        bestWhen:
          "You already sell DTC and need gated price lists for approved retailers.",
      },
      {
        id: "distributor",
        title: "Distributor / manufacturer",
        bestWhen:
          "Bulk reorders and company accounts are the primary job — not a consumer theme.",
      },
    ],
    extraFaq: {
      question: "Is wholesale always included on a storefront plan?",
      answer:
        "Often it is native on some platforms, plan-gated on others, or an extension on open-source carts. Confirm company accounts, price lists, and bulk checkout on the configuration you will buy — do not assume the public storefront demo includes B2B.",
    },
  }),

  "website-builder-commerce": ecommerceUseCase({
    slug: "website-builder-commerce",
    title: "Website-builder commerce",
    badge: "Website + store",
    tagline:
      "Launch a brand website and sell from the same builder — design-led SMB commerce, not a Shopify-class OS.",
    overview:
      "Website-builder commerce is the job of shipping a polished site and a store together. Wix and Squarespace are the peer cluster — not Magento for complex B2B and not Shopify for commerce-first ops depth.",
    who: "Design-led SMBs, creators, and service businesses that need pages and product sales in one builder.",
    matters:
      "Prioritise template quality, ecommerce plan gates (Core+ on Wix; Plus/Advanced fee math on Squarespace), and TCO including platform transaction fees.",
    example:
      "Worked example: Harbor Studio publishes a brand site and a 20-SKU shop on Wix Core without hiring a developer.",
    example2:
      "Worked example: a photographer sells prints on Squarespace Plus and models digital product fees before upgrading.",
    goal: "A polished site and store in one builder",
    typicalTeam: "Founders, designers, and small merchandising teams",
    priorities: [
      "Template / design quality",
      "Ecommerce plan gate",
      "Platform + card fees",
      "Catalog depth you need",
      "Exit cost (domain, pages)",
    ],
    productsNote: "wix, squarespace",
    related: ["online-storefront", "checkout-conversion", "catalog-management"],
    challenges: [
      {
        id: "wrong-peer",
        title: "Compared to Shopify as if peers",
        pain: "Buyers expect commerce-OS depth from a website builder.",
        crmHelps:
          "Keep website-builder shortlists separate from hosted SaaS platforms.",
      },
      {
        id: "plan-gate",
        title: "Free/Light cannot sell",
        pain: "The demo looked shoppable; the plan does not unlock payments.",
        crmHelps: "Budget Core+ (Wix) or the fee tier you need (Squarespace).",
      },
      {
        id: "fee-stack",
        title: "Platform fees surprise at volume",
        pain: "Subscription looked cheap; fees dominate at GMV.",
        crmHelps: "Model platform + card fees at your order volume.",
      },
      {
        id: "catalog-ceiling",
        title: "Catalog outgrows the builder",
        pain: "Variants, B2B, or multi-warehouse needs appear later.",
        crmHelps: "Re-evaluate Shopify/Woo/Magento when ops depth becomes the job.",
      },
    ],
    outcomes: [
      {
        id: "live-brand",
        title: "Live brand site",
        description: "Pages and storefront share one design system.",
      },
      {
        id: "paid-orders",
        title: "Paid test orders",
        description: "Checkout works on the plan you actually buy.",
      },
      {
        id: "honest-tco",
        title: "Honest fee model",
        description: "Platform and card fees are on the worksheet before launch.",
      },
      {
        id: "exit-aware",
        title: "Exit awareness",
        description: "Domain and content export paths are known before you scale.",
      },
    ],
    needs: [
      {
        id: "builder",
        title: "Site builder",
        description: "Templates and page editing non-developers will use.",
        priority: "must",
      },
      {
        id: "store",
        title: "Integrated store",
        description: "Products, cart, and payments on a selling plan.",
        priority: "must",
      },
      {
        id: "fees",
        title: "Fee transparency",
        description: "Platform and processing fees at your GMV.",
        priority: "must",
      },
      {
        id: "apps",
        title: "Light extensions",
        description: "Bookings/marketing if your mix needs them.",
        priority: "nice",
      },
    ],
    steps: [
      {
        id: "job",
        label: "Confirm website-first",
        detail: "If commerce ops dominate, shortlist SaaS/open-source instead.",
        goal: "Right cluster",
      },
      {
        id: "plan",
        label: "Pick selling tier",
        detail: "Core+ on Wix; fee tier on Squarespace.",
        goal: "Payments unlocked",
      },
      {
        id: "design",
        label: "Template + catalog",
        detail: "Publish pages and first SKUs.",
        goal: "Brand live",
      },
      {
        id: "prove",
        label: "Test checkout",
        detail: "One paid or test order on the target plan.",
        goal: "Loop works",
      },
    ],
    scenarios: [
      {
        id: "brand-smb",
        title: "Design-led SMB",
        bestWhen: "The website is the brand and the store is secondary-to-equal.",
      },
      {
        id: "creator",
        title: "Creator / service + products",
        bestWhen: "You sell a curated catalog alongside bookings or content.",
      },
    ],
    extraFaq: {
      question: "Should I pick Wix or Squarespace instead of Shopify?",
      answer:
        "Only when website design and pages are the primary job. If you need deep apps, channels, POS, or complex catalogs, shortlist hosted SaaS or open-source clusters instead — do not force a website builder to act like a commerce OS.",
    },
  }),
};
