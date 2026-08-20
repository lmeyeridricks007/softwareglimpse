/**
 * Ecommerce Priority-2 credibility products (compact).
 * ecwid, salesforce-commerce-cloud, prestashop, shopware, printful, printify
 * — not in affiliate inventory.
 *
 * Pricing grounded 2026-08-18 from first-party / consistent secondary
 * reporting of published plan tiles (SFCC remains quote-only GMV).
 * Affiliate economics never enter scores. handsOnTesting=false.
 *
 * Cluster notes (do not steal existing awards):
 * - ecwid / salesforce-commerce-cloud → saas-platform landscape (Shopify keeps cluster award)
 * - prestashop / shopware → open-source-platform landscape (WooCommerce keeps award 8.1)
 * - printful / printify → dropshipping-sourcing POD landscape (Spocket keeps sourcing award 7.1)
 */
import { expandEcomProduct } from "./ecom-compact-expand.mjs";

const COMPACT = [
  {
    slug: "ecwid",
    name: "Ecwid",
    company: "Lightspeed",
    website: "https://www.ecwid.com/",
    domain: "ecwid.com",
    pricingUrl: "https://www.ecwid.com/pricing",
    aliases: ["Ecwid by Lightspeed", "Lightspeed eCom"],
    membershipRole: "primary",
    jobCluster: "saas-platform",
    softShortDescription:
      "Embeddable storefront you add to an existing site — Starter $5/mo, Venture $29 annual, Business $49, Unlimited $119 (post 2 Mar 2026 tiles); no Ecwid transaction fees.",
    shortDescription:
      "Ecwid (Lightspeed) is a hosted ecommerce widget you embed on an existing website, WordPress, or social storefront rather than replacing the CMS. US tiles after the 2 March 2026 update: Starter $5/mo; Venture $35/mo or $29 annual; Business $65/mo or $49 annual; Unlimited $149/mo or $119 annual. Ecwid does not add its own transaction fee on top of payment processing. Landscape SaaS peer — not a Shopify-class commerce OS. Research grounded 2026-08-18 from first-party pricing; confirm live on ecwid.com/pricing.",
    vendorPositioning:
      "Add a store to any website — embeddable cart, catalog, and checkout without migrating the whole site to a new platform.",
    pricingModel: "flat",
    hasFreePlan: false,
    hasFreeTrial: false,
    startingPriceMonthly: 5,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from ecwid.com/pricing (high confidence for post-2 March 2026 tiles). Annual monthly-equivalents: Starter $5, Venture $29, Business $49, Unlimited $119. Monthly list: $5 / $35 / $65 / $149. No Ecwid-charged transaction fee; card processing is via Stripe/PayPal/etc. Affiliate economics excluded.",
    pricingSummary:
      "From $5/mo Starter. Venture ~$29/mo annual ($35 monthly), Business ~$49 ($65 monthly), Unlimited ~$119 ($149 monthly). No Ecwid transaction fees. Confirm live on ecwid.com/pricing.",
    plans: [
      {
        kind: "flat-annual",
        slug: "starter",
        name: "Starter",
        amount: 5,
        description: "$5/mo — entry embeddable store; confirm product/staff caps live.",
      },
      {
        kind: "flat-annual",
        slug: "venture",
        name: "Venture",
        amount: 29,
        highlighted: true,
        description: "$29/mo billed annually ($35 monthly). Typical SMB embeddable store.",
      },
      {
        kind: "flat-annual",
        slug: "business",
        name: "Business",
        amount: 49,
        description: "$49/mo billed annually ($65 monthly). Higher catalog and staff limits.",
      },
      {
        kind: "flat-annual",
        slug: "unlimited",
        name: "Unlimited",
        amount: 119,
        description: "$119/mo billed annually ($149 monthly). Highest published self-serve tile.",
      },
    ],
    featureOverrides: {
      "online-storefront": "supported",
      "product-catalog": "supported",
      "checkout-payments": "supported",
      "order-management": "supported",
      "inventory-management": "supported",
      "shipping-fulfillment": "supported",
      "pos-omnichannel": "limited",
      "marketplace-channels": "add-on",
      "b2b-wholesale": "limited",
      "marketing-automation": "limited",
      "analytics-reporting": "supported",
      "ai-assistance": "limited",
      "dropshipping-sourcing": "add-on",
      "app-extensions": "supported",
    },
    aiLines: [
      "AI assistant: limited",
      "AI summaries: limited",
      "AI automation: limited",
      "AI recommendations: limited",
    ],
    integrations: [
      { integrationSlug: "stripe", kind: "native" },
      { integrationSlug: "paypal", kind: "native" },
      { integrationSlug: "woocommerce", kind: "native" },
      { integrationSlug: "wix", kind: "native" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    officialVideos: [],
    limitations: [
      "Catalog, B2B, and checkout depth trail Shopify-class commerce OS products",
      "POS / omnichannel is limited versus Lightspeed Retail or Square",
      "You still need a host site or page to embed into — Ecwid is not a full website builder",
      "AI assistance is thin compared with larger SaaS platforms",
    ],
    limitationKinds: [
      "feature-unavailable",
      "feature-unavailable",
      "other",
      "feature-unavailable",
    ],
    scores: {
      "ease-of-use": 9,
      "storefront-commerce-fit": 8,
      "catalog-orders-depth": 6,
      "checkout-conversion": 7,
      integrations: 8,
      "omnichannel-pos": 5,
      scalability: 6,
      "value-for-money": 9,
      "ai-capabilities": 4,
    },
    scoreRationales: {
      "ease-of-use":
        "Embed-and-sell admin is guided and lighter than a full commerce OS — strong for SMBs adding a cart to an existing site.",
      "storefront-commerce-fit":
        "Primary job is an embeddable storefront on an existing site. Landscape SaaS peer — does not displace Shopify as the hosted commerce OS.",
      "catalog-orders-depth":
        "Fine for SMB catalogs; weaker for complex B2B, multi-warehouse, and enterprise merchandising.",
      "checkout-conversion":
        "Checkout works on the embed; conversion tooling exists but trails Shop Pay-class ecosystems.",
      integrations:
        "Payments plus WordPress/Wix/social connectors cover SMB embed use; app depth is narrower than Shopify.",
      "omnichannel-pos":
        "Some Lightspeed adjacency, but Ecwid itself is not a retail POS bundle.",
      scalability:
        "Unlimited helps SKU caps; high-GMV complex catalogs usually outgrow widget packaging.",
      "value-for-money":
        "Low published floor and no Ecwid transaction fee make it competitive for embed-a-store SMBs.",
      "ai-capabilities":
        "Limited AI surface versus larger SaaS platforms — not a scoring driver.",
    },
    pros: [
      "Embed a store without migrating the whole website",
      "Low published starting tile and no Ecwid transaction fee",
      "Works with existing WordPress, Wix, and custom sites",
      "Lightspeed-backed hosted SaaS rather than self-hosted ops",
    ],
    cons: [
      "Not a Shopify peer for complex commerce ops",
      "POS and B2B depth are limited",
      "You still need a site to embed into",
    ],
    bestFor: [
      "SMBs that already have a website and need a cart, not a new CMS",
      "WordPress/Wix/custom sites adding payments without a platform migration",
      "Founders who want a low monthly floor and no platform transaction fee",
    ],
    notIdealFor: [
      "High-SKU catalogs, heavy B2B, or marketplace ops",
      "Retailers whose center of gravity is POS hardware",
      "Teams that want a full commerce OS with Shop Pay-class checkout",
    ],
    keyFeatures: [
      "Embeddable store widget",
      "Hosted catalog and checkout",
      "No Ecwid transaction fee",
      "WordPress / existing-site connectors",
      "Lightspeed-hosted SaaS",
    ],
    whoShouldChoose:
      "Choose Ecwid when the website already exists and you need an embeddable cart — not when you are choosing a full hosted commerce OS.",
    whoShouldConsiderAlternatives:
      "Consider Shopify for commerce-first SaaS scale; Wix/Squarespace if you also need the website builder; WooCommerce if you already live in WordPress and want open-source control.",
    useCaseSlugs: ["online-storefront", "checkout-conversion"],
    teamTypeSlugs: ["operations", "marketing"],
    businessSizeSlugs: ["solo", "micro", "small-business"],
    competitorSlugs: ["shopify", "wix", "squarespace"],
    alternativeSlugs: ["shopify", "wix", "squarespace"],
    comparableSlugs: ["shopify", "wix", "squarespace"],
    subcategorySlugs: [],
  },
  {
    slug: "salesforce-commerce-cloud",
    name: "Salesforce Commerce Cloud",
    company: "Salesforce",
    website: "https://www.salesforce.com/commerce/",
    domain: "salesforce.com",
    pricingUrl: "https://www.salesforce.com/commerce/b2c-ecommerce/pricing/",
    aliases: ["SFCC", "Demandware", "B2C Commerce"],
    membershipRole: "primary",
    jobCluster: "saas-platform",
    softShortDescription:
      "Salesforce B2C Commerce (ex-Demandware) — Growth/Plus/Premium are GMV-percent quote only; enterprise SaaS landscape, not an SMB Shopify substitute.",
    shortDescription:
      "Salesforce Commerce Cloud (B2C Commerce, formerly Demandware) is Salesforce’s enterprise hosted commerce suite for complex B2C/B2B storefronts, catalogs, and Marketing Cloud adjacency. Pricing is quote-only as a GMV percentage across Growth, Plus, and Premium — Salesforce does not publish a monthly list tile. Magento/Adobe Commerce is the open-source enterprise peer; SFCC is the Salesforce SaaS enterprise path. Research grounded 2026-08-18 from Salesforce commerce pricing pages. Landscape peer — does not displace Shopify as the SMB/mid-market SaaS award.",
    vendorPositioning:
      "Composable enterprise commerce on Salesforce — B2C storefronts, catalogs, and customer data in one cloud.",
    pricingModel: "custom",
    hasFreePlan: false,
    hasFreeTrial: false,
    startingPriceConfidence: "low",
    pricingNotes:
      "Verified 2026-08-18 from Salesforce B2C Commerce pricing pages (high confidence that list tiles are absent). Growth / Plus / Premium are contact-sales GMV-% quotes. Implementation, Salesforce ecosystem licenses, and SI work dominate TCO. Affiliate economics excluded. No invented list price.",
    pricingSummary:
      "Custom GMV-% quote (Growth, Plus, Premium). Contact Salesforce — SoftwareGlimpse does not invent a monthly floor.",
    plans: [
      {
        kind: "contact-sales",
        slug: "growth",
        name: "Growth",
        description: "GMV-based B2C Commerce — contact Salesforce for pricing.",
      },
      {
        kind: "contact-sales",
        slug: "plus",
        name: "Plus",
        highlighted: true,
        description: "Higher GMV / capability band — quote only.",
      },
      {
        kind: "contact-sales",
        slug: "premium",
        name: "Premium",
        description: "Enterprise GMV band — quote only. Confirm live with Salesforce.",
      },
    ],
    featureOverrides: {
      "online-storefront": "supported",
      "product-catalog": "supported",
      "checkout-payments": "supported",
      "order-management": "supported",
      "inventory-management": "supported",
      "shipping-fulfillment": "supported",
      "pos-omnichannel": "add-on",
      "marketplace-channels": "supported",
      "b2b-wholesale": "supported",
      "marketing-automation": "supported",
      "analytics-reporting": "supported",
      "ai-assistance": "supported",
      "dropshipping-sourcing": "add-on",
      "app-extensions": "supported",
    },
    aiLines: [
      "AI assistant: supported",
      "AI summaries: supported",
      "AI automation: supported",
      "AI recommendations: supported",
    ],
    integrations: [
      { integrationSlug: "salesforce", kind: "native" },
      { integrationSlug: "stripe", kind: "third-party" },
      { integrationSlug: "paypal", kind: "third-party" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    officialVideos: [],
    limitations: [
      "Pricing is opaque GMV-% — hard to compare without a Salesforce worksheet",
      "Implementation is a multi-month SI programme, not a weekend theme install",
      "TCO includes Salesforce ecosystem licenses beyond the commerce SKU",
      "Overkill for SMB catalogs that would be better on Shopify or BigCommerce",
    ],
    limitationKinds: [
      "plan-restriction",
      "other",
      "high-cost-at-scale",
      "other",
    ],
    scores: {
      "ease-of-use": 5,
      "storefront-commerce-fit": 9,
      "catalog-orders-depth": 10,
      "checkout-conversion": 9,
      integrations: 10,
      "omnichannel-pos": 7,
      scalability: 10,
      "value-for-money": 5,
      "ai-capabilities": 7,
    },
    scoreRationales: {
      "ease-of-use":
        "Enterprise admin and SI delivery — not a guided SMB launch path like Shopify.",
      "storefront-commerce-fit":
        "Core job is enterprise hosted storefront operations. Landscape SaaS peer — does not steal Shopify’s SMB/mid-market award.",
      "catalog-orders-depth":
        "Catalog, merchandising, and B2B depth are SFCC strengths versus SMB SaaS.",
      "checkout-conversion":
        "Enterprise checkout and personalization are capable; quality depends on the SI build.",
      integrations:
        "Native Salesforce Customer 360 plus a large LINK/partner ecosystem.",
      "omnichannel-pos":
        "Possible via Salesforce/partner retail paths — not a Square-class bundle.",
      scalability:
        "Designed for high-GMV, multi-brand, multi-locale enterprise programmes.",
      "value-for-money":
        "GMV quotes and SI TCO compress value except where Salesforce is already the system of record.",
      "ai-capabilities":
        "Einstein / Salesforce AI appear on Commerce Cloud paths — useful, not the purchase reason alone.",
    },
    pros: [
      "Enterprise catalog, B2B, and storefront depth on hosted SaaS",
      "Native Salesforce CRM / Marketing Cloud adjacency",
      "Scales to complex multi-brand programmes",
      "LINK partner and API surface for composable builds",
    ],
    cons: [
      "Quote-only GMV pricing with high SI TCO",
      "Steep learning curve versus SMB SaaS",
      "Not an SMB launch platform",
    ],
    bestFor: [
      "Mid-market and enterprise brands already on Salesforce",
      "Complex B2C/B2B catalogs that need hosted enterprise commerce",
      "Programmes with SI budget measured in months, not weekends",
    ],
    notIdealFor: [
      "SMB founders wanting published monthly tiles",
      "Teams without Salesforce gravity or integrator capacity",
      "Open-source buyers who want Magento/Adobe Commerce code ownership",
    ],
    keyFeatures: [
      "B2C Commerce (ex-Demandware)",
      "Enterprise catalog & merchandising",
      "Native Salesforce ecosystem",
      "B2B commerce surfaces",
      "Einstein / Salesforce AI adjacency",
    ],
    whoShouldChoose:
      "Choose Salesforce Commerce Cloud when enterprise hosted commerce and Salesforce adjacency outweigh SMB SaaS simplicity — and you can fund an SI programme.",
    whoShouldConsiderAlternatives:
      "Consider Magento/Adobe Commerce for the open-source enterprise peer; Shopify Plus or BigCommerce for hosted SaaS without Salesforce TCO; WooCommerce for WordPress-native mid-market stacks.",
    useCaseSlugs: ["online-storefront", "wholesale-b2b", "catalog-management"],
    teamTypeSlugs: ["operations", "marketing"],
    businessSizeSlugs: ["mid-market", "enterprise"],
    competitorSlugs: ["magento", "shopify", "bigcommerce"],
    alternativeSlugs: ["magento", "shopify", "bigcommerce"],
    comparableSlugs: ["magento", "shopify", "bigcommerce"],
    subcategorySlugs: [],
  },
  {
    slug: "prestashop",
    name: "PrestaShop",
    company: "PrestaShop / Fortidia",
    website: "https://www.prestashop.com/",
    domain: "prestashop.com",
    pricingUrl: "https://prestashop.com/prestashop-offers/",
    aliases: ["Presta Shop"],
    membershipRole: "primary",
    jobCluster: "open-source-platform",
    softShortDescription:
      "Open-source PHP commerce — Classic free; Hosted from ~$26/mo annual (€24 excl. VAT) with 14-day trial; Enterprise quote. WooCommerce keeps the cluster award.",
    shortDescription:
      "PrestaShop is an open-source PHP ecommerce platform (Classic is free to self-host) plus a Hosted SaaS path from €24/mo excl. VAT on annual billing (~$26 USD; €29 monthly) with a 14-day trial, and an Enterprise quote. Buyers own hosting and module TCO on Classic. Landscape open-source peer — WooCommerce keeps the cluster award. Research grounded 2026-08-18 from PrestaShop offers pages; EUR amounts converted approximately to USD.",
    vendorPositioning:
      "Create and grow your online store with PrestaShop — free open-source core or hosted plans, plus a marketplace of modules.",
    pricingModel: "hybrid",
    hasFreePlan: true,
    hasFreeTrial: true,
    trialDays: 14,
    startingPriceMonthly: 0,
    startingPriceConfidence: "medium",
    pricingNotes:
      "Verified 2026-08-18 from prestashop.com/prestashop-offers (high confidence for Classic free + Hosted/Enterprise structure). Hosted from €24/mo excl. VAT annual (~$26 USD) / €29 monthly; 14-day trial. Enterprise is quote-only. USD conversion is approximate (medium confidence). Self-hosted TCO (hosting, modules, agency) is separate. Affiliate economics excluded.",
    pricingSummary:
      "Classic: free open-source license + hosting/module TCO. Hosted from ~$26/mo annual (€24 excl. VAT) with 14-day trial. Enterprise: contact sales. Confirm live EUR tiles.",
    plans: [
      {
        kind: "free",
        slug: "classic",
        name: "Classic",
        description: "Free open-source download — you own hosting, security, and modules.",
      },
      {
        kind: "flat-annual",
        slug: "hosted",
        name: "Hosted",
        amount: 26,
        highlighted: true,
        hasFreeTrial: true,
        trialDays: 14,
        description: "~$26/mo billed annually (€24 excl. VAT; €29 monthly). 14-day trial.",
      },
      {
        kind: "contact-sales",
        slug: "enterprise",
        name: "Enterprise",
        description: "Quote-only enterprise packaging — confirm live with PrestaShop.",
      },
    ],
    featureOverrides: {
      "online-storefront": "supported",
      "product-catalog": "supported",
      "checkout-payments": "supported",
      "order-management": "supported",
      "inventory-management": "supported",
      "shipping-fulfillment": "supported",
      "pos-omnichannel": "add-on",
      "marketplace-channels": "add-on",
      "b2b-wholesale": "add-on",
      "marketing-automation": "add-on",
      "analytics-reporting": "supported",
      "ai-assistance": "limited",
      "dropshipping-sourcing": "add-on",
      "app-extensions": "supported",
    },
    aiLines: [
      "AI assistant: limited",
      "AI summaries: limited",
      "AI automation: limited",
      "AI recommendations: limited",
    ],
    integrations: [
      { integrationSlug: "stripe", kind: "third-party" },
      { integrationSlug: "paypal", kind: "native" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    officialVideos: [],
    limitations: [
      "Classic TCO (hosting, modules, agency) is not $0 even when the license is free",
      "POS / omnichannel is module-dependent, not a native retail bundle",
      "Addons marketplace quality varies — upgrade discipline is required",
      "Weaker WordPress-native content story than WooCommerce",
    ],
    limitationKinds: [
      "other",
      "requires-add-on",
      "other",
      "feature-unavailable",
    ],
    scores: {
      "ease-of-use": 7,
      "storefront-commerce-fit": 8,
      "catalog-orders-depth": 8,
      "checkout-conversion": 7,
      integrations: 7,
      "omnichannel-pos": 4,
      scalability: 7,
      "value-for-money": 8,
      "ai-capabilities": 4,
    },
    scoreRationales: {
      "ease-of-use":
        "More commerce-structured than raw Magento, less CMS-native than WooCommerce — Hosted is the guided path.",
      "storefront-commerce-fit":
        "Core job is open-source storefront + catalog. Landscape peer — WooCommerce keeps the open-source cluster award.",
      "catalog-orders-depth":
        "Solid catalog, multi-store, and module-driven B2B — competitive with Woo for mid-complexity merchants.",
      "checkout-conversion":
        "Checkout is capable via native + modules; conversion quality depends on theme and payment modules.",
      integrations:
        "Large module marketplace; quality and maintenance vary versus hosted app stores.",
      "omnichannel-pos":
        "POS is possible via modules — not a Square-class bundle.",
      scalability:
        "Can scale with hosting/Enterprise; very high-GMV complex programmes often move to Magento or Shopware.",
      "value-for-money":
        "Free Classic plus a published Hosted tile is competitive when you accept module/hosting TCO.",
      "ai-capabilities":
        "Limited first-party AI versus larger SaaS platforms.",
    },
    pros: [
      "Free open-source Classic license",
      "Published Hosted path with a 14-day trial",
      "Commerce-first PHP core (not a CMS plugin)",
      "Large module marketplace",
    ],
    cons: [
      "Self-hosted TCO and module hygiene",
      "POS is not native",
      "Not the WordPress-native default (see WooCommerce)",
    ],
    bestFor: [
      "EU/global merchants wanting a commerce-first open-source cart",
      "Teams that will self-host Classic or buy Hosted to skip DevOps",
      "Catalogs that outgrew website-builder commerce but do not need Magento TCO",
    ],
    notIdealFor: [
      "WordPress-native content + store teams (see WooCommerce)",
      "SMB founders wanting a full hosted commerce OS (see Shopify)",
      "Retailers whose center of gravity is POS hardware",
    ],
    keyFeatures: [
      "Open-source Classic core",
      "Hosted SaaS option",
      "Module marketplace",
      "Multi-store catalog",
      "Enterprise quote path",
    ],
    whoShouldChoose:
      "Choose PrestaShop when you want a commerce-first open-source cart (or its Hosted twin) and you are not already committed to WordPress.",
    whoShouldConsiderAlternatives:
      "Consider WooCommerce for WordPress-native open source; Shopware for a more modern Symfony/enterprise OSS path; Magento for deeper B2B/enterprise; Shopify for hosted SaaS.",
    useCaseSlugs: ["online-storefront", "catalog-management"],
    teamTypeSlugs: ["operations", "marketing"],
    businessSizeSlugs: ["small-business", "mid-market"],
    competitorSlugs: ["woocommerce", "shopware", "magento"],
    alternativeSlugs: ["woocommerce", "shopware", "magento"],
    comparableSlugs: ["woocommerce", "shopware", "magento"],
    subcategorySlugs: [],
  },
  {
    slug: "shopware",
    name: "Shopware",
    company: "Shopware AG",
    website: "https://www.shopware.com/",
    domain: "shopware.com",
    pricingUrl: "https://www.shopware.com/en/pricing/",
    aliases: ["Shopware 6"],
    membershipRole: "primary",
    jobCluster: "open-source-platform",
    softShortDescription:
      "Symfony open-source commerce — Community Edition free (Fair Usage ~€1M GMV); Rise from ~$660/mo; Evolve from €2400/mo; Beyond quote.",
    shortDescription:
      "Shopware is a Symfony-based open-source commerce platform. Community Edition is MIT-licensed and free, with a Fair Usage policy that expects a paid plan above about €1M GMV. Commercial SaaS/self-serve: Rise from €600/mo (~$660 USD); Evolve from €2400/mo; Beyond is quote-only. Landscape open-source peer — WooCommerce keeps the cluster award. Research grounded 2026-08-18 from shopware.com/en/pricing; EUR amounts converted approximately to USD.",
    vendorPositioning:
      "Composable commerce platform — open-source Community Edition plus Rise, Evolve, and Beyond for growing and enterprise brands.",
    pricingModel: "hybrid",
    hasFreePlan: true,
    hasFreeTrial: false,
    startingPriceMonthly: 0,
    startingPriceConfidence: "medium",
    pricingNotes:
      "Verified 2026-08-18 from shopware.com/en/pricing (high confidence for plan names). Community Edition free (MIT) with Fair Usage — paid required above ~€1M GMV. Rise from €600/mo (~$660 USD). Evolve from €2400/mo (contact in this catalogue). Beyond quote-only. USD conversion is approximate (medium confidence). Affiliate economics excluded.",
    pricingSummary:
      "Community Edition: free (Fair Usage ~€1M GMV). Rise from ~$660/mo (€600). Evolve / Beyond: contact sales. Confirm live EUR tiles on shopware.com/en/pricing.",
    plans: [
      {
        kind: "free",
        slug: "community",
        name: "Community Edition",
        description: "Free MIT license — Fair Usage expects paid above ~€1M GMV.",
      },
      {
        kind: "flat-annual",
        slug: "rise",
        name: "Rise",
        amount: 660,
        highlighted: true,
        description: "From ~$660/mo (€600). First commercial self-serve band.",
      },
      {
        kind: "contact-sales",
        slug: "evolve",
        name: "Evolve",
        description: "From €2400/mo published starting band — confirm live with Shopware.",
      },
      {
        kind: "contact-sales",
        slug: "beyond",
        name: "Beyond",
        description: "Enterprise quote — confirm live with Shopware.",
      },
    ],
    featureOverrides: {
      "online-storefront": "supported",
      "product-catalog": "supported",
      "checkout-payments": "supported",
      "order-management": "supported",
      "inventory-management": "supported",
      "shipping-fulfillment": "supported",
      "pos-omnichannel": "add-on",
      "marketplace-channels": "add-on",
      "b2b-wholesale": "supported",
      "marketing-automation": "add-on",
      "analytics-reporting": "supported",
      "ai-assistance": "limited",
      "dropshipping-sourcing": "add-on",
      "app-extensions": "supported",
    },
    aiLines: [
      "AI assistant: limited",
      "AI summaries: limited",
      "AI automation: limited",
      "AI recommendations: supported",
    ],
    integrations: [
      { integrationSlug: "stripe", kind: "third-party" },
      { integrationSlug: "paypal", kind: "native" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    officialVideos: [],
    limitations: [
      "Community Edition Fair Usage pushes paid plans above ~€1M GMV",
      "Rise commercial floor is high versus WooCommerce core + hosting",
      "POS / omnichannel is not the center of the product",
      "Implementation still needs developer/agency capacity versus hosted SaaS",
    ],
    limitationKinds: [
      "plan-restriction",
      "high-cost-at-scale",
      "feature-unavailable",
      "other",
    ],
    scores: {
      "ease-of-use": 7,
      "storefront-commerce-fit": 8,
      "catalog-orders-depth": 8,
      "checkout-conversion": 7,
      integrations: 8,
      "omnichannel-pos": 4,
      scalability: 8,
      "value-for-money": 7,
      "ai-capabilities": 6,
    },
    scoreRationales: {
      "ease-of-use":
        "Modern admin versus Magento-era stacks, but still developer-led compared with Shopify.",
      "storefront-commerce-fit":
        "Core job is open-source / composable storefront. Landscape peer — WooCommerce keeps the open-source cluster award.",
      "catalog-orders-depth":
        "Strong catalog and B2B surfaces on Shopware 6 — competitive with PrestaShop and approaching Magento for many mid-market cases.",
      "checkout-conversion":
        "Checkout is capable and extensible; conversion quality depends on storefront implementation.",
      integrations:
        "App ecosystem plus APIs are solid for a European OSS platform.",
      "omnichannel-pos":
        "POS is not a native Square-class bundle.",
      scalability:
        "Rise/Evolve/Beyond and headless options support ambitious GMV better than typical SMB carts.",
      "value-for-money":
        "Community Edition is generous until Fair Usage; Rise’s €600 floor is steep for SMBs versus Woo.",
      "ai-capabilities":
        "Shopware AI / Copilot appears on commercial paths — secondary to the commerce core.",
    },
    pros: [
      "Modern Symfony open-source core with a free Community Edition",
      "Clear commercial ladder (Rise / Evolve / Beyond)",
      "Stronger B2B/composable story than typical SMB carts",
      "API / headless options for ambitious storefronts",
    ],
    cons: [
      "Fair Usage and Rise floor raise TCO as GMV grows",
      "Still needs developer capacity versus hosted SaaS",
      "POS is not native",
    ],
    bestFor: [
      "Mid-market EU/global merchants wanting modern open-source commerce",
      "Teams with Symfony/PHP capacity or a Shopware partner",
      "Catalogs that outgrew Woo simplicity but do not want Magento TCO",
    ],
    notIdealFor: [
      "Solo founders wanting a weekend hosted launch",
      "WordPress-native content + store teams (see WooCommerce)",
      "Retailers whose center of gravity is POS hardware",
    ],
    keyFeatures: [
      "Community Edition (MIT)",
      "Shopware 6 composable core",
      "B2B surfaces",
      "Rise / Evolve / Beyond ladder",
      "API / headless storefronts",
    ],
    whoShouldChoose:
      "Choose Shopware when you want a modern open-source commerce core with a commercial ladder — and you have partner capacity to implement it.",
    whoShouldConsiderAlternatives:
      "Consider PrestaShop for a lower-TCO PHP OSS peer; WooCommerce for WordPress-native stacks; Magento for deeper Adobe enterprise; Shopify for hosted SaaS.",
    useCaseSlugs: ["online-storefront", "catalog-management", "wholesale-b2b"],
    teamTypeSlugs: ["operations", "marketing"],
    businessSizeSlugs: ["small-business", "mid-market", "enterprise"],
    competitorSlugs: ["prestashop", "woocommerce", "magento"],
    alternativeSlugs: ["prestashop", "woocommerce", "magento"],
    comparableSlugs: ["prestashop", "woocommerce", "magento"],
    subcategorySlugs: [],
  },
  {
    slug: "printful",
    name: "Printful",
    company: "Printful",
    website: "https://www.printful.com/",
    domain: "printful.com",
    pricingUrl: "https://www.printful.com/pricing",
    aliases: ["Printful POD"],
    membershipRole: "primary",
    jobCluster: "dropshipping-sourcing",
    softShortDescription:
      "Print-on-demand fulfillment — Free $0; Growth $24.99/mo (waived after $12k/year sales) with 14-day trial; Enterprise quote. Product print costs separate.",
    shortDescription:
      "Printful is a print-on-demand fulfillment network: you design products, they print and ship to the customer. It is a POD sourcing/fulfillment layer, not a full checkout platform (Printful Stores is an add-on storefront). Plans (2026-08-18): Free $0; Growth $24.99/mo with a 14-day trial (subscription waived after $12k/year in Printful sales); Enterprise quote. White-label product costs and shipping are billed separately from the subscription. POD landscape peer — Spocket keeps the dropshipping-sourcing cluster award. Research grounded 2026-08-18 from printful.com/pricing.",
    vendorPositioning:
      "Print-on-demand fulfillment for ecommerce and marketplaces — connect your store, design products, Printful prints and ships.",
    pricingModel: "freemium",
    hasFreePlan: true,
    hasFreeTrial: true,
    trialDays: 14,
    startingPriceMonthly: 0,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from printful.com/pricing (high confidence). Free $0. Growth $24.99/mo, 14-day trial; Printful states the Growth fee is waived after $12k/year in sales through Printful. Enterprise quote. Fulfillment/product/shipping costs are separate from the platform subscription. Affiliate economics excluded.",
    pricingSummary:
      "Free $0. Growth $24.99/mo (14-day trial; waived after $12k/year Printful sales). Enterprise quote. Budget product print + shipping separately. You still need a storefront for checkout.",
    plans: [
      {
        kind: "free",
        slug: "free",
        name: "Free",
        highlighted: true,
        description: "$0 platform fee — pay product fulfillment and shipping.",
      },
      {
        kind: "flat-annual",
        slug: "growth",
        name: "Growth",
        amount: 24.99,
        hasFreeTrial: true,
        trialDays: 14,
        description: "$24.99/mo — 14-day trial; waived after $12k/year Printful sales.",
      },
      {
        kind: "contact-sales",
        slug: "enterprise",
        name: "Enterprise",
        description: "Quote — higher volume branding and account support.",
      },
    ],
    featureOverrides: {
      "online-storefront": "add-on",
      "product-catalog": "limited",
      "checkout-payments": "not-supported",
      "order-management": "limited",
      "inventory-management": "limited",
      "shipping-fulfillment": "supported",
      "pos-omnichannel": "not-supported",
      "marketplace-channels": "supported",
      "b2b-wholesale": "not-supported",
      "marketing-automation": "not-supported",
      "analytics-reporting": "limited",
      "ai-assistance": "limited",
      "dropshipping-sourcing": "supported",
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
      { integrationSlug: "wix", kind: "native" },
      { integrationSlug: "bigcommerce", kind: "native" },
      { integrationSlug: "squarespace", kind: "native" },
    ],
    officialVideos: [],
    limitations: [
      "Not a checkout platform — Shopify/Woo/Etsy/etc. (or Printful Stores add-on) required",
      "Product print and shipping costs are separate from the $0–$24.99 subscription",
      "Catalog is POD blanks, not a general merchandise sourcing network",
      "No retail POS — Printful is fulfillment, not omnichannel commerce",
    ],
    limitationKinds: [
      "feature-unavailable",
      "other",
      "feature-unavailable",
      "feature-unavailable",
    ],
    scores: {
      "ease-of-use": 9,
      "storefront-commerce-fit": 9,
      "catalog-orders-depth": 7,
      "checkout-conversion": 3,
      integrations: 9,
      "omnichannel-pos": 2,
      scalability: 8,
      "value-for-money": 8,
      "ai-capabilities": 5,
    },
    scoreRationales: {
      "ease-of-use":
        "Design-to-publish connectors are polished — merchants launch POD catalogs without running a print shop.",
      "storefront-commerce-fit":
        "Scored for the POD fulfillment job, not as a commerce OS. Landscape peer — Spocket keeps the dropshipping-sourcing cluster award.",
      "catalog-orders-depth":
        "Strong on blanks, branding, and order routing; not a general wholesale catalog.",
      "checkout-conversion":
        "Checkout lives on the connected storefront — Printful is not a cart product.",
      integrations:
        "Native connectors to Shopify, Woo, Wix, BigCommerce, Squarespace, and major marketplaces.",
      "omnichannel-pos":
        "Not a POS product.",
      scalability:
        "Global print network scales branded merch programmes; Growth waiver after $12k/year sales helps operators.",
      "value-for-money":
        "Free plan plus waived Growth at volume is competitive; model print/shipping margins separately.",
      "ai-capabilities":
        "Design helpers exist — secondary to fulfillment quality.",
    },
    pros: [
      "Free plan with fulfillment billed per product",
      "Native connectors to major storefronts and marketplaces",
      "Growth fee waived after $12k/year Printful sales",
      "In-house print quality/branding controls versus generic dropship catalogs",
    ],
    cons: [
      "Not a storefront or checkout product",
      "POD blanks only — not US/EU general merchandise sourcing (see Spocket)",
      "Print/shipping costs dominate TCO versus the subscription",
    ],
    bestFor: [
      "Brands selling custom merch, apparel, and print products without inventory",
      "Shopify/Woo/Etsy stores that need POD fulfillment, not a new cart",
      "Operators who want in-house print quality versus marketplace dropship",
    ],
    notIdealFor: [
      "Merchants who still need a cart/checkout platform",
      "General merchandise dropshippers (see Spocket / AliDrop)",
      "Retail POS-first businesses",
    ],
    keyFeatures: [
      "Print-on-demand fulfillment",
      "Store and marketplace connectors",
      "Branding / packing inserts",
      "Free + Growth plans",
      "Printful Stores add-on storefront",
    ],
    whoShouldChoose:
      "Choose Printful when you already have (or will add) a storefront and need branded print-on-demand fulfillment — not when you still need a cart.",
    whoShouldConsiderAlternatives:
      "Consider Printify for a multi-printer POD marketplace; Spocket/AliDrop for general merchandise dropshipping; Shopify/Woo if you still need the store platform.",
    useCaseSlugs: ["dropshipping-sourcing", "online-storefront"],
    teamTypeSlugs: ["operations", "marketing"],
    businessSizeSlugs: ["solo", "micro", "small-business"],
    competitorSlugs: ["printify", "spocket", "alidrop"],
    alternativeSlugs: ["printify", "spocket", "alidrop"],
    comparableSlugs: ["printify", "spocket", "alidrop"],
    subcategorySlugs: [],
  },
  {
    slug: "printify",
    name: "Printify",
    company: "Printify",
    website: "https://printify.com/",
    domain: "printify.com",
    pricingUrl: "https://printify.com/pricing/",
    aliases: ["Printify POD"],
    membershipRole: "primary",
    jobCluster: "dropshipping-sourcing",
    softShortDescription:
      "Print-on-demand marketplace — Free $0 (5 stores); Premium $24.99/mo annual ($39 monthly from Feb 2026); Enterprise quote. Print costs separate.",
    shortDescription:
      "Printify is a print-on-demand marketplace connecting stores to a network of print providers — a POD sourcing layer, not a checkout platform (Pop-Up Store is a limited storefront). Plans (2026-08-18): Free $0 (up to 5 stores); Premium from $39/mo or $24.99/mo billed annually ($299/yr); Enterprise quote. February 2026 raised monthly Premium to $39. Product print and shipping costs are separate. POD landscape peer with Printful — Spocket keeps the dropshipping-sourcing cluster award. Research grounded 2026-08-18 from printify.com/pricing.",
    vendorPositioning:
      "Print-on-demand marketplace — connect your store to a global printer network and sell custom products without inventory.",
    pricingModel: "freemium",
    hasFreePlan: true,
    hasFreeTrial: false,
    startingPriceMonthly: 0,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from printify.com/pricing (high confidence). Free $0, up to 5 stores. Premium $39/mo monthly (raised February 2026) or $24.99/mo annual ($299/yr). Enterprise quote. Print/shipping billed by print providers separately. Affiliate economics excluded.",
    pricingSummary:
      "Free $0 (5 stores). Premium ~$24.99/mo annual ($39 monthly). Enterprise quote. Budget printer product + shipping separately. You still need a storefront for checkout.",
    plans: [
      {
        kind: "free",
        slug: "free",
        name: "Free",
        description: "$0 — up to 5 stores; pay print provider product and shipping.",
        limits: { maxStores: 5 },
      },
      {
        kind: "flat-annual",
        slug: "premium",
        name: "Premium",
        amount: 24.99,
        highlighted: true,
        description: "$24.99/mo billed annually ($299/yr; $39 monthly from Feb 2026).",
      },
      {
        kind: "contact-sales",
        slug: "enterprise",
        name: "Enterprise",
        description: "Quote — higher volume and account support.",
      },
    ],
    featureOverrides: {
      "online-storefront": "limited",
      "product-catalog": "limited",
      "checkout-payments": "not-supported",
      "order-management": "limited",
      "inventory-management": "limited",
      "shipping-fulfillment": "supported",
      "pos-omnichannel": "not-supported",
      "marketplace-channels": "supported",
      "b2b-wholesale": "not-supported",
      "marketing-automation": "not-supported",
      "analytics-reporting": "limited",
      "ai-assistance": "limited",
      "dropshipping-sourcing": "supported",
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
      { integrationSlug: "wix", kind: "native" },
      { integrationSlug: "bigcommerce", kind: "native" },
      { integrationSlug: "squarespace", kind: "native" },
    ],
    officialVideos: [],
    limitations: [
      "Not a checkout platform — Shopify/Woo/Etsy/etc. required (Pop-Up Store is limited)",
      "Print quality and SLAs vary by print provider in the marketplace",
      "Free plan caps stores (5); Premium monthly rose to $39 in February 2026",
      "No retail POS — Printify is POD sourcing/fulfillment, not omnichannel commerce",
    ],
    limitationKinds: [
      "feature-unavailable",
      "other",
      "plan-restriction",
      "feature-unavailable",
    ],
    scores: {
      "ease-of-use": 8,
      "storefront-commerce-fit": 9,
      "catalog-orders-depth": 7,
      "checkout-conversion": 3,
      integrations: 9,
      "omnichannel-pos": 2,
      scalability: 8,
      "value-for-money": 8,
      "ai-capabilities": 5,
    },
    scoreRationales: {
      "ease-of-use":
        "Provider marketplace adds choice and some complexity versus Printful’s in-house network — still approachable for SMBs.",
      "storefront-commerce-fit":
        "Scored for the POD sourcing job, not as a commerce OS. Landscape peer with Printful — Spocket keeps the dropshipping-sourcing award.",
      "catalog-orders-depth":
        "Wide blanks catalog via multiple printers; not a general merchandise sourcing network.",
      "checkout-conversion":
        "Checkout lives on the connected storefront — Printify is not a cart product.",
      integrations:
        "Native connectors to Shopify, Woo, Wix, BigCommerce, Squarespace, and marketplaces.",
      "omnichannel-pos":
        "Not a POS product.",
      scalability:
        "Multi-printer network can scale geographically; quality variance is the tradeoff versus a single in-house printer.",
      "value-for-money":
        "Free plan plus cheaper annual Premium is competitive; model printer product costs, not just the subscription.",
      "ai-capabilities":
        "Design helpers exist — secondary to printer selection and margins.",
    },
    pros: [
      "Free plan with up to 5 stores",
      "Multi-printer marketplace for coverage and price shopping",
      "Annual Premium cheaper than the February 2026 $39 monthly tile",
      "Native connectors to major storefronts",
    ],
    cons: [
      "Not a storefront or checkout product",
      "Print quality/SLA variance across providers",
      "POD blanks only — not general merchandise dropshipping (see Spocket)",
    ],
    bestFor: [
      "Merchants who want to compare print providers instead of a single in-house network",
      "Shopify/Woo/Etsy stores adding POD without inventory",
      "Operators optimizing print cost versus Printful’s branded in-house path",
    ],
    notIdealFor: [
      "Merchants who still need a cart/checkout platform",
      "Brands that want a single in-house print SLA (see Printful)",
      "General merchandise dropshippers (see Spocket / AliDrop)",
    ],
    keyFeatures: [
      "Print-on-demand marketplace",
      "Multi-printer network",
      "Store connectors",
      "Free plan (5 stores)",
      "Printify Pop-Up Store",
    ],
    whoShouldChoose:
      "Choose Printify when you already have a storefront and want a multi-printer POD marketplace — not when you still need a cart.",
    whoShouldConsiderAlternatives:
      "Consider Printful for in-house print quality and branding; Spocket/AliDrop for general merchandise dropshipping; Shopify/Woo if you still need the store platform.",
    useCaseSlugs: ["dropshipping-sourcing", "online-storefront"],
    teamTypeSlugs: ["operations", "marketing"],
    businessSizeSlugs: ["solo", "micro", "small-business"],
    competitorSlugs: ["printful", "spocket", "alidrop"],
    alternativeSlugs: ["printful", "spocket", "alidrop"],
    comparableSlugs: ["printful", "spocket", "alidrop"],
    subcategorySlugs: [],
  },
];

export const COMPARISON_PAIRS = [
  ["printful", "printify"],
  ["prestashop", "shopware"],
  ["ecwid", "shopify"],
  ["salesforce-commerce-cloud", "magento"],
];

export const PRODUCTS = COMPACT.map(expandEcomProduct);
