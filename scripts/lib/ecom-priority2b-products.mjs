/**
 * Ecommerce Priority-2b credibility products (compact).
 * webflow, lightspeed-retail — not in affiliate inventory.
 *
 * Pricing grounded 2026-08-18 from first-party published plan tiles.
 * Affiliate economics never enter scores. handsOnTesting=false.
 *
 * Cluster notes (do not steal existing awards):
 * - webflow → website-builder landscape (Wix keeps award 7.1; Squarespace peer 6.6)
 * - lightspeed-retail → omnichannel-pos landscape (Square Online keeps award 8.0)
 *   Distinct from Ecwid (Lightspeed eCom embeddable store).
 */
import { expandEcomProduct } from "./ecom-compact-expand.mjs";

const COMPACT = [
  {
    slug: "webflow",
    name: "Webflow",
    company: "Webflow",
    website: "https://webflow.com/",
    domain: "webflow.com",
    pricingUrl: "https://webflow.com/pricing",
    aliases: ["Webflow Ecommerce", "Webflow CMS"],
    membershipRole: "primary",
    jobCluster: "website-builder",
    softShortDescription:
      "Design-led website platform with Ecommerce — Standard $29/mo (500 items, 2% fee), Plus $74 highlighted (5,000 items, 0% fee), Advanced $212 (15,000 items); requires a Site plan in addition.",
    shortDescription:
      "Webflow is a design-led website platform with a separate Ecommerce plan stack. US Ecommerce tiles billed yearly (2026-08-18 from webflow.com/pricing): Standard $29/mo (500 items, 2% transaction fee), Plus $74/mo (5,000 items, 0% Webflow fee), Advanced $212/mo (15,000 items, 0% fee). Ecommerce requires a Site plan as well — Site Premium is commonly ~$25/mo annual after the May 2026 site-plan simplification. A free site workspace exists, but selling is paid. Landscape website-builder peer — Wix keeps the cluster award (7.1); Squarespace is the design-led peer (6.6). Not a Shopify-class commerce OS. Research grounded 2026-08-18 from first-party pricing; confirm live on webflow.com/pricing.",
    vendorPositioning:
      "Build visually, publish professionally — Webflow CMS plus Ecommerce for design-led brands that want code-level control without a traditional CMS.",
    pricingModel: "flat",
    hasFreePlan: false,
    hasFreeTrial: false,
    startingPriceMonthly: 29,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from webflow.com/pricing (high confidence for Ecommerce annual tiles). Ecommerce billed yearly: Standard $29/mo (500 items, 2% txn fee), Plus $74/mo (5,000 items, 0% Webflow txn fee, highlighted), Advanced $212/mo (15,000 items, 0% fee). A Site plan is required in addition to an Ecommerce plan — Site Premium ~$25/mo annual (May 2026 site-plan simplification) is context for TCO, not the store floor. Combined Standard + Site Premium is ~$54/mo annual before processing. Site free workspace exists; ecommerce is paid (hasFreePlan=false). No dedicated Ecommerce trial documented here. Card processing is separate. Affiliate economics excluded.",
    pricingSummary:
      "Ecommerce from $29/mo Standard annual (500 items, 2% fee) plus a required Site plan (~$25/mo Premium annual). Plus $74/mo (5,000 items, 0% fee); Advanced $212/mo (15,000 items). Confirm live on webflow.com/pricing.",
    plans: [
      {
        kind: "flat-annual",
        slug: "site-premium",
        name: "Site Premium",
        amount: 25,
        description:
          "~$25/mo annual (May 2026 site-plan simplification). Required alongside an Ecommerce plan — not a store plan by itself.",
      },
      {
        kind: "flat-annual",
        slug: "ecommerce-standard",
        name: "Ecommerce Standard",
        amount: 29,
        description:
          "$29/mo billed yearly — 500 items, 2% Webflow transaction fee. Requires a Site plan.",
      },
      {
        kind: "flat-annual",
        slug: "ecommerce-plus",
        name: "Ecommerce Plus",
        amount: 74,
        highlighted: true,
        description:
          "$74/mo billed yearly — 5,000 items, 0% Webflow transaction fee. Requires a Site plan.",
      },
      {
        kind: "flat-annual",
        slug: "ecommerce-advanced",
        name: "Ecommerce Advanced",
        amount: 212,
        description:
          "$212/mo billed yearly — 15,000 items, 0% Webflow transaction fee. Requires a Site plan.",
      },
    ],
    featureOverrides: {
      "online-storefront": "supported",
      "product-catalog": "supported",
      "checkout-payments": "supported",
      "order-management": "supported",
      "inventory-management": "limited",
      "shipping-fulfillment": "supported",
      "pos-omnichannel": "not-supported",
      "marketplace-channels": "limited",
      "b2b-wholesale": "limited",
      "marketing-automation": "limited",
      "analytics-reporting": "supported",
      "ai-assistance": "supported",
      "dropshipping-sourcing": "add-on",
      "app-extensions": "supported",
    },
    aiLines: [
      "AI assistant: supported",
      "AI summaries: limited",
      "AI automation: limited",
      "AI recommendations: limited",
    ],
    integrations: [
      { integrationSlug: "stripe", kind: "native" },
      { integrationSlug: "paypal", kind: "native" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    officialVideos: [],
    limitations: [
      "Ecommerce requires a Site plan in addition to the Ecommerce plan — model combined TCO, not the $29 floor alone",
      "Catalog caps (500 / 5,000 / 15,000 items) and Standard’s 2% transaction fee trail Shopify-class commerce OS depth",
      "No native retail POS — Webflow is website-builder commerce, not omnichannel hardware",
      "Inventory, B2B, and marketplace depth are SMB/design-led, not Magento/Shopify Plus ops",
    ],
    limitationKinds: [
      "plan-restriction",
      "plan-restriction",
      "feature-unavailable",
      "feature-unavailable",
    ],
    scores: {
      "ease-of-use": 8,
      "storefront-commerce-fit": 8,
      "catalog-orders-depth": 6,
      "checkout-conversion": 7,
      integrations: 7,
      "omnichannel-pos": 2,
      scalability: 6,
      "value-for-money": 7,
      "ai-capabilities": 6,
    },
    scoreRationales: {
      "ease-of-use":
        "Visual canvas is the product strength for designers; commerce setup is more structured than Wix drag-and-drop but still guided versus a commerce OS.",
      "storefront-commerce-fit":
        "Primary job is a design-led website with a paid Ecommerce add-on stack. Landscape website-builder peer — does not displace Wix’s cluster award.",
      "catalog-orders-depth":
        "Fine for curated catalogs within plan item caps; weaker for complex variants, B2B, and multi-warehouse ops.",
      "checkout-conversion":
        "Hosted checkout with Stripe/PayPal works; conversion tooling exists but trails Shop Pay-class ecosystems.",
      integrations:
        "Payments plus Apps/Zapier cover SMB design-led stores — narrower than Shopify’s app marketplace.",
      "omnichannel-pos":
        "Not a retail POS product — in-person selling is not the job.",
      scalability:
        "Plus/Advanced raise item caps; high-SKU or high-GMV ops usually outgrow website-builder packaging.",
      "value-for-money":
        "Dual Site + Ecommerce stack raises the true floor above the $29 Ecommerce tile; Plus at $74 with 0% fee is the sensible mid band.",
      "ai-capabilities":
        "Webflow AI assists design and copy — useful, secondary to the visual CMS job.",
    },
    pros: [
      "Design-led visual CMS with production-quality published sites",
      "Published Ecommerce ladder (Standard / Plus / Advanced) with item-cap clarity",
      "Plus and Advanced drop the Webflow transaction fee",
      "Native Stripe and PayPal checkout",
    ],
    cons: [
      "Site plan + Ecommerce plan is a two-SKU TCO, not a single Core tile",
      "Not a Shopify peer for complex commerce ops",
      "No native POS / omnichannel retail",
    ],
    bestFor: [
      "Design-led brands that want a custom site and a curated catalog on one visual CMS",
      "Teams that outgrew Wix/Squarespace templates but do not need a commerce OS",
      "Founders who will model Site + Ecommerce TCO and stay inside item caps",
    ],
    notIdealFor: [
      "High-SKU catalogs, heavy B2B, or marketplace ops",
      "Retailers whose center of gravity is POS hardware",
      "Teams that want a single all-in-one commerce OS (see Shopify)",
    ],
    keyFeatures: [
      "Visual CMS / Designer",
      "Ecommerce Standard / Plus / Advanced",
      "Item caps + transaction-fee ladder",
      "Stripe / PayPal checkout",
      "Webflow AI design assistance",
    ],
    whoShouldChoose:
      "Choose Webflow when the website visual quality is the product and ecommerce is a first-class but secondary job on the same CMS — and you will pay for both a Site plan and an Ecommerce plan.",
    whoShouldConsiderAlternatives:
      "Consider Wix for a simpler site+store tile; Squarespace for template-led design; Shopify if commerce ops are the center of gravity.",
    useCaseSlugs: ["website-builder-commerce", "online-storefront"],
    teamTypeSlugs: ["marketing", "operations"],
    businessSizeSlugs: ["solo", "micro", "small-business"],
    competitorSlugs: ["wix", "squarespace", "shopify"],
    alternativeSlugs: ["wix", "squarespace", "shopify"],
    comparableSlugs: ["wix", "squarespace", "shopify"],
    subcategorySlugs: [],
  },
  {
    slug: "lightspeed-retail",
    name: "Lightspeed Retail",
    company: "Lightspeed",
    website: "https://www.lightspeedhq.com/pos/retail/",
    domain: "lightspeedhq.com",
    pricingUrl: "https://www.lightspeedhq.com/pos/retail/pricing/",
    aliases: ["Lightspeed Retail POS", "Lightspeed X-Series", "Lightspeed POS"],
    membershipRole: "primary",
    jobCluster: "omnichannel-pos",
    softShortDescription:
      "Retail POS + omnichannel — Basic $89/mo, Core $149 highlighted, Plus $289/mo USD; Lightspeed Payments ~1.5% card-present; eCommerce on higher tiers. Distinct from Ecwid.",
    shortDescription:
      "Lightspeed Retail (X-Series POS) is a retail point-of-sale platform with catalog, inventory, and omnichannel selling — including built-in Lightspeed eCommerce on higher tiers. US tiles from lightspeedhq.com (2026-08-18): Basic $89/mo, Core $149/mo, Plus $289/mo, with contact-sales CTAs on the page. Lightspeed Payments card-present is published around 1.5%; using a third-party processor may incur a high monthly surcharge (confirm live). This is the POS-first Lightspeed product — distinct from Ecwid (Lightspeed eCom), the embeddable store widget. Landscape omnichannel peer — Square Online keeps the cluster award (8.0). Research grounded 2026-08-18 from first-party pricing; confirm live on lightspeedhq.com/pos/retail/pricing.",
    vendorPositioning:
      "Retail POS that unifies in-store selling, inventory, and omnichannel commerce for ambitious retailers.",
    pricingModel: "flat",
    hasFreePlan: false,
    hasFreeTrial: false,
    startingPriceMonthly: 89,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from lightspeedhq.com/pos/retail/pricing (high confidence for published USD tiles). Basic $89/mo, Core $149/mo (highlighted), Plus $289/mo. Contact-sales CTAs appear on the page — confirm annual vs monthly billing and location add-ons live. Lightspeed Payments card-present ~1.5% on page. Third-party payment processors may incur a high monthly surcharge — confirm live before assuming Stripe/etc. is cheaper. Built-in Lightspeed eCommerce is packaged on higher tiers, not as a standalone embeddable cart (that is Ecwid). No free plan; no self-serve trial documented (contact sales). Affiliate economics excluded.",
    pricingSummary:
      "From $89/mo Basic. Core $149/mo, Plus $289/mo (USD). Contact sales for packaging. Model Lightspeed Payments (~1.5% card-present) vs third-party processor surcharges. Confirm live on lightspeedhq.com/pos/retail/pricing.",
    plans: [
      {
        kind: "flat-annual",
        slug: "basic",
        name: "Basic",
        amount: 89,
        description: "$89/mo USD — entry retail POS tile. Confirm ecommerce packaging live.",
      },
      {
        kind: "flat-annual",
        slug: "core",
        name: "Core",
        amount: 149,
        highlighted: true,
        description:
          "$149/mo USD — typical omnichannel retail band; eCommerce more complete on this and Plus.",
      },
      {
        kind: "flat-annual",
        slug: "plus",
        name: "Plus",
        amount: 289,
        description: "$289/mo USD — highest published self-serve retail tile. Contact sales for more.",
      },
      {
        kind: "contact-sales",
        slug: "contact-sales",
        name: "Contact sales",
        description:
          "Page CTAs route to sales for packaging, locations, and payments — confirm live with Lightspeed.",
      },
    ],
    featureOverrides: {
      "online-storefront": "supported",
      "product-catalog": "supported",
      "checkout-payments": "supported",
      "order-management": "supported",
      "inventory-management": "supported",
      "shipping-fulfillment": "supported",
      "pos-omnichannel": "supported",
      "marketplace-channels": "limited",
      "b2b-wholesale": "limited",
      "marketing-automation": "limited",
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
      { integrationSlug: "paypal", kind: "third-party" },
      { integrationSlug: "quickbooks", kind: "native" },
      { integrationSlug: "xero", kind: "native" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    officialVideos: [],
    limitations: [
      "No free plan or documented self-serve trial — contact sales is the common path",
      "Third-party payment processors may incur a high monthly surcharge versus Lightspeed Payments (~1.5% card-present) — confirm live",
      "Built-in eCommerce is a POS-tied storefront, not Ecwid’s embed-on-any-site widget",
      "Online-only DTC brands without a retail floor usually fit Square Online or Shopify better",
    ],
    limitationKinds: [
      "plan-restriction",
      "high-cost-at-scale",
      "other",
      "other",
    ],
    scores: {
      "ease-of-use": 7,
      "storefront-commerce-fit": 7,
      "catalog-orders-depth": 8,
      "checkout-conversion": 8,
      integrations: 8,
      "omnichannel-pos": 10,
      scalability: 8,
      "value-for-money": 6,
      "ai-capabilities": 5,
    },
    scoreRationales: {
      "ease-of-use":
        "Retail POS admin is capable for store teams, with more onboarding than Square’s free-tier simplicity.",
      "storefront-commerce-fit":
        "Scored as omnichannel retail (POS + online), not as a website builder or embeddable cart. Landscape peer — Square Online keeps the cluster award.",
      "catalog-orders-depth":
        "Inventory, variants, and multi-location catalog are Lightspeed Retail strengths versus Square’s simpler online catalog.",
      "checkout-conversion":
        "In-person checkout is the core; online checkout is solid on higher-tier eCommerce — not Shop Pay-class.",
      integrations:
        "Accounting (QuickBooks/Xero), payments, and app connectors are strong for a retail POS suite.",
      "omnichannel-pos":
        "This is the job — unified retail POS, inventory, and omnichannel selling. Distinct from Ecwid’s embeddable cart.",
      scalability:
        "Core/Plus and multi-location packaging support growing retailers better than Square’s simplest online store.",
      "value-for-money":
        "$89 floor and possible third-party processor surcharges compress value versus Square’s free online entry — justified when POS depth is the purchase reason.",
      "ai-capabilities":
        "Limited first-party AI versus larger SaaS platforms — not a scoring driver.",
    },
    pros: [
      "True retail POS with inventory and omnichannel as the center of gravity",
      "Published Basic / Core / Plus USD tiles",
      "Lightspeed Payments card-present rate published around 1.5%",
      "Built-in eCommerce on higher tiers (not a separate CMS migration)",
    ],
    cons: [
      "Higher published floor than Square Online’s free tier",
      "Third-party processor surcharge risk — confirm live",
      "Not the Lightspeed embeddable-cart product (that is Ecwid)",
    ],
    bestFor: [
      "Brick-and-click retailers who need POS + inventory as the system of record",
      "Multi-location specialty retail outgrowing Square’s simplest online store",
      "Merchants who will use Lightspeed Payments rather than fight processor surcharges",
    ],
    notIdealFor: [
      "Online-only brands without a retail floor (see Shopify)",
      "Existing-site owners who only need an embeddable cart (see Ecwid)",
      "Teams standardized on Square hardware who want the cheapest online add-on",
    ],
    keyFeatures: [
      "Lightspeed X-Series retail POS",
      "Multi-location inventory",
      "Lightspeed Payments",
      "Built-in eCommerce (higher tiers)",
      "Accounting connectors",
    ],
    whoShouldChoose:
      "Choose Lightspeed Retail when in-store POS and inventory are the system of record and the online store should follow that catalog — not when you only need an embeddable cart (Ecwid) or a free Square Online add-on.",
    whoShouldConsiderAlternatives:
      "Consider Square Online if you already run Square POS and want the cheapest unified online store; Shopify for online-first scale with POS as an add-on; Ecwid if you only need to embed a cart on an existing site.",
    useCaseSlugs: ["omnichannel-retail", "online-storefront"],
    teamTypeSlugs: ["operations", "marketing"],
    businessSizeSlugs: ["small-business", "mid-market"],
    competitorSlugs: ["square-online", "shopify", "ecwid"],
    alternativeSlugs: ["square-online", "shopify", "ecwid"],
    comparableSlugs: ["square-online", "shopify", "ecwid"],
    subcategorySlugs: [],
  },
];

export const COMPARISON_PAIRS = [
  ["webflow", "wix"],
  ["lightspeed-retail", "square-online"],
];

export const PRODUCTS = COMPACT.map(expandEcomProduct);
