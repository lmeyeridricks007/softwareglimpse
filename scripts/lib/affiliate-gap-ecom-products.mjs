/**
 * Affiliate gap Ecommerce pack (compact).
 * flippa, shipbob, ueni.
 *
 * Pricing grounded 2026-08-19 from first-party pages (ShipBob quote-based — medium confidence floors).
 * Affiliate economics never enter scores. handsOnTesting=false.
 */
import { expandEcomProduct } from "./ecom-compact-expand.mjs";

export const VERIFIED_AT = "2026-08-19T12:00:00.000Z";

const COMPACT = [
  {
    slug: "flippa",
    name: "Flippa",
    company: "Flippa Pty Ltd",
    website: "https://flippa.com",
    domain: "flippa.com",
    pricingUrl: "https://flippa.com/pricing",
    aliases: ["Flippa.com", "Flippa Marketplace"],
    membershipRole: "adjacent",
    jobCluster: "saas-platform",
    adjacentNote:
      "Adjacent to ecommerce storefront platforms: Flippa is an online business and digital-asset marketplace (buy/sell websites, SaaS, stores, apps) — not a cart, checkout, or catalog platform. Never a Shopify-class best-page peer.",
    softShortDescription:
      "Online business marketplace — buyer browse free; seller listing from $29 + tiered success fees (from 5%); Premium $49/mo or $388/yr for buyers.",
    shortDescription:
      "Flippa is a marketplace for buying and selling online businesses and digital assets — websites, ecommerce stores, SaaS, apps, domains, and content properties. Buyers browse free; optional Flippa Premium is $49/month or $388/year. Sellers pay a non-refundable listing fee (Entry Level Package from $29 on published pricing) plus a tiered success fee on closed deals (from about 5%, higher on smaller exits — confirm live tiers on flippa.com/pricing). Escrow/FlippaPay transaction fees are separate. Scored as ecommerce-adjacent exit/acquisition tooling, not a storefront platform.",
    vendorPositioning:
      "The world's largest marketplace for buying and selling online businesses — listings, deal room, and escrow in one platform.",
    pricingModel: "hybrid",
    hasFreePlan: true,
    hasFreeTrial: false,
    startingPriceMonthly: 0,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-19 from flippa.com/pricing (high confidence for buyer free tier and Premium; medium for seller success-fee tiers by asset value). Entry listing from $29; success fees from 5% tiered by sale price. Premium $49/mo or $388/yr. Affiliate aff-flippa. Affiliate economics excluded.",
    pricingSummary:
      "Buyers: free browse; Premium $49/mo or $388/yr optional. Sellers: listing from $29 + success fee from ~5% on close. Confirm asset-value tiers on flippa.com/pricing.",
    plans: [
      {
        kind: "free",
        slug: "free",
        name: "Free (Buyer)",
        description: "Free marketplace browse and basic deal access for buyers.",
      },
      {
        kind: "flat-monthly",
        slug: "premium-monthly",
        name: "Premium",
        amount: 49,
        description: "$49/mo Premium — early access, deeper data, cancel anytime.",
      },
      {
        kind: "flat-annual",
        slug: "premium-yearly",
        name: "Premium (Yearly)",
        amount: 32.33,
        description: "$388/yr Premium (~$32.33/mo equivalent) — save vs monthly.",
      },
      {
        kind: "flat-monthly",
        slug: "seller-entry",
        name: "Seller Entry Listing",
        amount: 29,
        description:
          "From $29 listing fee (Entry Level Package) plus tiered success fee on sale — not a monthly SaaS seat.",
      },
    ],
    featureOverrides: {
      "online-storefront": "not-supported",
      "product-catalog": "not-supported",
      "checkout-payments": "not-supported",
      "order-management": "not-supported",
      "inventory-management": "not-supported",
      "shipping-fulfillment": "not-supported",
      "pos-omnichannel": "not-supported",
      "marketplace-channels": "supported",
      "b2b-wholesale": "not-supported",
      "marketing-automation": "limited",
      "analytics-reporting": "limited",
      "ai-assistance": "limited",
      "dropshipping-sourcing": "not-supported",
      "app-extensions": "not-supported",
    },
    aiLines: [
      "AI assistant: limited",
      "AI summaries: limited",
      "AI automation: not-supported",
      "AI recommendations: limited",
    ],
    integrations: [
      { integrationSlug: "stripe", kind: "native" },
      { integrationSlug: "google-workspace", kind: "native" },
    ],
    limitations: [
      "Marketplace for buying/selling businesses — not a storefront or cart",
      "Seller success fees scale with exit price — model before listing",
      "Due diligence and verification quality varies by listing",
      "Premium buyer tier is optional — not required to browse",
      "Not order fulfillment, dropshipping, or website builder primary",
    ],
    scores: {
      "ease-of-use": 7,
      "storefront-commerce-fit": 3,
      "catalog-orders-depth": 2,
      "checkout-conversion": 2,
      integrations: 6,
      "omnichannel-pos": 1,
      scalability: 8,
      "value-for-money": 6,
      "ai-capabilities": 4,
    },
    scoreRationales: {
      "storefront-commerce-fit":
        "Exit/acquisition marketplace — scored low on storefront criteria by design; not a cart or catalog product.",
      "value-for-money":
        "Free buyer access is strong; seller listing + success fees can be material on sub-$50K exits — compare to broker-assisted routes. Affiliate economics excluded.",
    },
    bestFor: [
      "Founders buying or selling sub-$500K online businesses and digital assets",
      "Operators who want a public marketplace with deal-room tooling",
      "Buyers who will pay for Premium early-access data on active listings",
    ],
    notIdealFor: [
      "Merchants who still need a hosted storefront (Shopify, BigCommerce)",
      "Dropshipping catalog import (Spocket, AliDrop)",
      "3PL fulfillment operations (ShipBob)",
    ],
    pros: [
      "Large buyer/seller marketplace with published fee structure",
      "Free buyer tier plus optional Premium",
      "Deal room, LOI/APA tooling, and escrow integrations",
      "Covers websites, SaaS, ecommerce, apps, and domains",
      "Entry listings from $29",
    ],
    cons: [
      "Not a commerce platform",
      "Success fees add up on smaller exits",
      "Listing quality and verification require buyer diligence",
      "No storefront, checkout, or inventory features",
      "AI is not a core differentiator",
    ],
    keyFeatures: [
      "Business/asset marketplace listings",
      "Deal room and negotiation",
      "Escrow / FlippaPay checkout",
      "Premium buyer data tier",
      "Seller listing packages from $29",
    ],
    whoShouldChoose:
      "Choose Flippa when buying or selling an online business is the job — and treat it as an acquisition marketplace adjacent to storefront ecommerce, not a Shopify replacement.",
    whoShouldConsiderAlternatives:
      "Compare Spocket or AliDrop for dropshipping sourcing; Shopify or WooCommerce if you need a cart; broker-led exits for high-touch $500K+ sales.",
    alternativeSlugs: ["spocket"],
    competitorSlugs: ["spocket", "alidrop"],
    comparableSlugs: ["spocket"],
    useCaseSlugs: ["online-storefront"],
    businessSizeSlugs: ["solo", "micro", "small-business"],
    teamTypeSlugs: ["founders", "marketing"],
    catalogueSourceId: "aff-flippa",
    sourcesExtra: [
      {
        id: "flippa-pricing",
        url: "https://flippa.com/pricing",
        title: "Flippa pricing",
        domains: ["pricing", "plans", "limits"],
      },
    ],
  },
  {
    slug: "shipbob",
    name: "ShipBob",
    company: "ShipBob, Inc.",
    website: "https://www.shipbob.com",
    domain: "shipbob.com",
    pricingUrl: "https://www.shipbob.com/pricing/",
    aliases: ["ShipBob Fulfillment", "ShipBob 3PL"],
    membershipRole: "primary",
    jobCluster: "dropshipping-sourcing",
    softShortDescription:
      "DTC 3PL fulfillment network — quote-based pick/pack, storage, receiving, and shipping; ~$275/mo minimum reported; requires existing storefront.",
    shortDescription:
      "ShipBob is a third-party logistics (3PL) fulfillment network for ecommerce brands — pick/pack, warehousing, receiving, returns, and carrier shipping across US and international nodes. Pricing is quote-based (2026-08-19): receiving, bin/shelf/pallet storage, per-order pick/pack, and pass-through shipping — no universal public rate card. Merchant-reported floors include roughly $275/month minimum spend and ~$2.50–$3.50 pick/pack per order before packaging and carrier costs. Requires an existing storefront (Shopify, BigCommerce, WooCommerce, etc.). Same fulfillment-adjacent cluster as Printful/Spocket — Spocket keeps the dropshipping-sourcing award for supplier import.",
    vendorPositioning:
      "Ecommerce fulfillment platform — distributed warehouse network, two-day shipping positioning, and WMS for scaling DTC brands.",
    pricingModel: "hybrid",
    hasFreePlan: false,
    hasFreeTrial: false,
    startingPriceMonthly: 275,
    startingPriceConfidence: "medium",
    pricingNotes:
      "Verified 2026-08-19 from shipbob.com/pricing structure plus cross-checks (medium confidence — quote-based). Published model: onboarding/setup (varies), receiving, storage (bin/shelf/pallet), all-in fulfillment fee, optional kitting/returns. ~$275/mo minimum and ~$2.50–$3.50 pick/pack cited in merchant reports — confirm quote. Affiliate aff-shipbob. Affiliate economics excluded.",
    pricingSummary:
      "Quote-based 3PL — receiving, storage, pick/pack, and shipping. ~$275/mo minimum reported. Model your SKU profile before comparing to Printful POD or in-house fulfillment.",
    plans: [
      {
        kind: "contact-sales",
        slug: "fulfillment",
        name: "Fulfillment (Quote)",
        description:
          "Custom quote — pick/pack, storage, receiving, shipping, and optional returns/kitting.",
      },
      {
        kind: "contact-sales",
        slug: "plus",
        name: "ShipBob Plus",
        description: "Enterprise / high-volume packaging — contact sales.",
      },
      {
        kind: "contact-sales",
        slug: "wms",
        name: "ShipBob WMS",
        description: "Warehouse management for owned facilities — separate product line.",
      },
    ],
    featureOverrides: {
      "online-storefront": "not-supported",
      "product-catalog": "limited",
      "checkout-payments": "not-supported",
      "order-management": "supported",
      "inventory-management": "supported",
      "shipping-fulfillment": "supported",
      "pos-omnichannel": "not-supported",
      "marketplace-channels": "limited",
      "b2b-wholesale": "limited",
      "marketing-automation": "not-supported",
      "analytics-reporting": "supported",
      "ai-assistance": "limited",
      "dropshipping-sourcing": "not-supported",
      "app-extensions": "supported",
    },
    aiLines: [
      "AI assistant: limited",
      "AI summaries: limited",
      "AI automation: limited",
      "AI recommendations: limited",
    ],
    integrations: [
      { integrationSlug: "shopify", kind: "native" },
      { integrationSlug: "woocommerce", kind: "native" },
      { integrationSlug: "bigcommerce", kind: "native" },
      { integrationSlug: "amazon", kind: "native" },
      { integrationSlug: "api", kind: "api" },
    ],
    limitations: [
      "Requires an existing ecommerce storefront — not a cart or checkout product",
      "Quote-based pricing with ~$275/mo minimum reported — opaque until sales conversation",
      "Storage and node-classification fees penalize slow-moving SKUs",
      "Not dropshipping supplier import (Spocket award path)",
      "Heavy/oversized SKUs may fit regional 3PLs better",
    ],
    scores: {
      "ease-of-use": 7,
      "storefront-commerce-fit": 8,
      "catalog-orders-depth": 7,
      "checkout-conversion": 3,
      integrations: 9,
      "omnichannel-pos": 3,
      scalability: 9,
      "value-for-money": 6,
      "ai-capabilities": 5,
    },
    scoreRationales: {
      "storefront-commerce-fit":
        "Strong fulfillment/order-management fit for DTC brands with existing stores — scored for the fulfillment job, not as a commerce OS.",
      "checkout-conversion":
        "No checkout surface — ShipBob fulfills orders from your cart; conversion is your storefront's job.",
      "value-for-money":
        "Network scale helps shipping zones, but quote opacity, minimums, and accessorial fees compress value for sub-400-order brands. Affiliate economics excluded.",
    },
    bestFor: [
      "DTC brands on Shopify/BigCommerce/Woo needing multi-node US fulfillment",
      "Operators doing 400+ orders/month who can absorb ~$275/mo minimums",
      "Teams optimizing two-day shipping zones with distributed inventory",
    ],
    notIdealFor: [
      "Merchants without a storefront yet",
      "Dropshipping-only catalog import (Spocket, AliDrop)",
      "Print-on-demand micro brands (Printful)",
      "Low-volume sellers who cannot clear monthly minimums",
    ],
    pros: [
      "Broad US/international fulfillment network",
      "Native Shopify/Woo/BigCommerce connectors",
      "Pick/pack + storage + shipping in one quote",
      "Returns and kitting optional services",
      "Scales toward enterprise WMS path",
    ],
    cons: [
      "No public flat rate card",
      "Monthly minimums reported ~$275",
      "Storage fees on slow inventory",
      "Not a storefront or supplier marketplace",
      "Quote negotiation required",
    ],
    keyFeatures: [
      "Distributed 3PL fulfillment",
      "Inventory storage (bin/shelf/pallet)",
      "Pick, pack, and ship",
      "Returns processing",
      "Storefront + marketplace integrations",
    ],
    whoShouldChoose:
      "Choose ShipBob when you already run a storefront and need outsourced pick/pack fulfillment at scale — not when you still need a cart or dropshipping supplier catalog.",
    whoShouldConsiderAlternatives:
      "Compare Printful for print-on-demand; Spocket for US/EU supplier import; regional 3PLs for heavy SKU profiles or sub-minimum volume.",
    alternativeSlugs: ["printful", "spocket"],
    competitorSlugs: ["printful", "spocket", "alidrop"],
    comparableSlugs: ["printful", "spocket"],
    useCaseSlugs: ["order-fulfillment"],
    businessSizeSlugs: ["small-business", "mid-market", "enterprise"],
    teamTypeSlugs: ["operations"],
    catalogueSourceId: "aff-shipbob",
    sourcesExtra: [
      {
        id: "shipbob-pricing",
        url: "https://www.shipbob.com/pricing/",
        title: "ShipBob pricing",
        domains: ["pricing", "plans", "limits"],
      },
    ],
  },
  {
    slug: "ueni",
    name: "UENI",
    company: "UENI.com",
    website: "https://ueni.com",
    domain: "ueni.com",
    pricingUrl: "https://ueni.com/en-us/pricing/",
    aliases: ["UENI.com", "Ueni Websites"],
    membershipRole: "primary",
    jobCluster: "website-builder",
    softShortDescription:
      "Done-for-you local business websites — Launch $79 setup + $24.99/mo; Plus $59/mo; Growth $124.99/mo. 30-day money-back guarantee.",
    shortDescription:
      "UENI is a done-for-you website service for local small businesses — custom-designed site, domain, hosting, SSL, business email, basic ecommerce/booking, and human support. US pricing (2026-08-19): Launch $79 one-time setup + $24.99/month; Plus (most popular) $59/month with unlimited concierge edits; Growth $124.99/month with 1-on-1 marketing; Ecommerce tier $99/month on published US grid. 30-day money-back guarantee. 0% transaction fee on published ecommerce tiers. Website-builder-commerce cluster peer of Wegic — not a Shopify-class commerce OS.",
    vendorPositioning:
      "Professional websites built for you in seven days — done-for-you design, hosting, and ongoing support for local businesses.",
    pricingModel: "flat",
    hasFreePlan: false,
    hasFreeTrial: false,
    startingPriceMonthly: 24.99,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-19 from ueni.com/en-us/pricing (high confidence). Launch $79 setup + $24.99/mo. Plus $59/mo. Ecommerce $99/mo. Growth $124.99/mo. Annual/two-year prepay discounts published. 30-day money-back guarantee. Affiliate aff-ueni. Affiliate economics excluded.",
    pricingSummary:
      "From $79 setup + $24.99/mo Launch. Plus $59/mo (concierge edits). Ecommerce $99/mo. Growth $124.99/mo. 30-day guarantee — confirm live tiers on ueni.com/en-us/pricing.",
    plans: [
      {
        kind: "flat-monthly",
        slug: "launch",
        name: "Launch",
        amount: 24.99,
        highlighted: true,
        description:
          "$79 setup + $24.99/mo — custom site, domain, email, hosting, basic store/booking.",
      },
      {
        kind: "flat-monthly",
        slug: "plus",
        name: "Plus",
        amount: 59,
        description:
          "$59/mo — unlimited done-for-you edits and advanced customer-winning features.",
      },
      {
        kind: "flat-monthly",
        slug: "ecommerce",
        name: "Ecommerce",
        amount: 99,
        description: "$99/mo — full online store features on published US grid.",
      },
      {
        kind: "flat-monthly",
        slug: "growth",
        name: "Growth",
        amount: 124.99,
        description: "$124.99/mo — adds 1-on-1 marketing and growth strategy.",
      },
    ],
    featureOverrides: {
      "online-storefront": "supported",
      "product-catalog": "limited",
      "checkout-payments": "supported",
      "order-management": "limited",
      "inventory-management": "limited",
      "shipping-fulfillment": "not-supported",
      "pos-omnichannel": "not-supported",
      "marketplace-channels": "not-supported",
      "b2b-wholesale": "not-supported",
      "marketing-automation": "limited",
      "analytics-reporting": "limited",
      "ai-assistance": "limited",
      "dropshipping-sourcing": "not-supported",
      "app-extensions": "not-supported",
    },
    aiLines: [
      "AI assistant: limited",
      "AI summaries: limited",
      "AI automation: not-supported",
      "AI recommendations: not-supported",
    ],
    integrations: [
      { integrationSlug: "google-workspace", kind: "native" },
      { integrationSlug: "facebook", kind: "native" },
      { integrationSlug: "stripe", kind: "native" },
    ],
    limitations: [
      "Done-for-you service model — less extensibility than Shopify/Wix app ecosystems",
      "Not a 3PL or marketplace (ShipBob, Flippa are different jobs)",
      "Advanced commerce depth trails hosted SaaS platforms",
      "Growth tier adds cost for marketing-heavy buyers",
      "Setup fee plus monthly — model TCO vs DIY builders",
    ],
    scores: {
      "ease-of-use": 9,
      "storefront-commerce-fit": 7,
      "catalog-orders-depth": 5,
      "checkout-conversion": 6,
      integrations: 5,
      "omnichannel-pos": 2,
      scalability: 5,
      "value-for-money": 8,
      "ai-capabilities": 4,
    },
    scoreRationales: {
      "ease-of-use":
        "Done-for-you build in ~7 days plus concierge edits on Plus — high approachability for non-technical local owners.",
      "storefront-commerce-fit":
        "Website-builder-commerce job for local SMBs — not Shopify-scale catalog or channel depth.",
      "value-for-money":
        "$79 setup + $24.99/mo undercuts agencies; Plus/Growth tiers raise TCO. 0% commission on published ecommerce tiers. Affiliate economics excluded.",
    },
    bestFor: [
      "Local SMBs that want a professional site without DIY builder time",
      "Owners who value concierge edits (Plus) over app-marketplace flexibility",
      "Micro retailers needing basic ecommerce/booking on one monthly plan",
    ],
    notIdealFor: [
      "High-SKU DTC brands needing Shopify/BigCommerce scale",
      "3PL fulfillment buyers (ShipBob)",
      "Operators who want full theme/code control (Webflow, WooCommerce)",
    ],
    pros: [
      "Done-for-you website in ~7 days",
      "Published $24.99/mo floor after $79 setup",
      "Domain, email, hosting, SSL bundled",
      "0% transaction fee on published ecommerce tiers",
      "30-day money-back guarantee",
    ],
    cons: [
      "Less extensible than Shopify/Wix",
      "Catalog and channel depth limited",
      "No POS or 3PL story",
      "Growth tier gets expensive for marketing-heavy needs",
      "AI is not a headline feature",
    ],
    keyFeatures: [
      "Custom-designed local business website",
      "Domain, hosting, SSL, business email",
      "Basic ecommerce and bookings",
      "Concierge edits (Plus+)",
      "Marketing support (Growth)",
    ],
    whoShouldChoose:
      "Choose UENI when a done-for-you local business website with optional light commerce is the job — not when you need Shopify-class scale or 3PL fulfillment.",
    whoShouldConsiderAlternatives:
      "Compare Wegic for AI website generation; Leadpages for landing-page funnels; Shopify if catalog, channels, and apps are the priority.",
    alternativeSlugs: ["wegic", "leadpages"],
    competitorSlugs: ["wegic", "leadpages"],
    comparableSlugs: ["wegic"],
    useCaseSlugs: ["website-builder-commerce"],
    businessSizeSlugs: ["solo", "micro", "small-business"],
    teamTypeSlugs: ["marketing", "founders"],
    catalogueSourceId: "aff-ueni",
    sourcesExtra: [
      {
        id: "ueni-us-pricing",
        url: "https://ueni.com/en-us/pricing/",
        title: "UENI US pricing",
        domains: ["pricing", "plans", "limits"],
      },
    ],
  },
];

export const PRODUCTS = COMPACT.map(expandEcomProduct);

export const COMPARISON_PAIRS = [
  ["flippa", "spocket"],
  ["shipbob", "printful"],
  ["shipbob", "spocket"],
  ["ueni", "wegic"],
  ["ueni", "leadpages"],
];
