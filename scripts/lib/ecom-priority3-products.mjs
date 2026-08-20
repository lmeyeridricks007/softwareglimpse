/**
 * Ecommerce Priority-3 credibility products (compact).
 * opencart, commercetools, vtex, saleor, medusa, tiendanube
 * — not in affiliate inventory.
 *
 * Pricing grounded 2026-08-18 from first-party / careful secondary reporting.
 * Affiliate economics never enter scores. handsOnTesting=false.
 *
 * Cluster notes (do not steal existing awards):
 * - commercetools / vtex / tiendanube → saas-platform landscape (Shopify keeps 9.2)
 * - opencart / saleor / medusa → open-source-platform landscape (WooCommerce keeps 8.1)
 * - Wix 7.1, Square Online 8.0, Spocket 7.1 awards untouched
 */
import { expandEcomProduct } from "./ecom-compact-expand.mjs";

const COMPACT = [
  {
    slug: "opencart",
    name: "OpenCart",
    company: "OpenCart Ltd",
    website: "https://www.opencart.com/",
    domain: "opencart.com",
    pricingUrl: "https://www.opencart.com/",
    aliases: ["Open Cart"],
    membershipRole: "primary",
    jobCluster: "open-source-platform",
    softShortDescription:
      "GPL open-source PHP cart — free download core; optional managed cloud cited ~$59–$99/mo by secondary sources (confirm live). WooCommerce keeps the cluster award.",
    shortDescription:
      "OpenCart is a GPL open-source PHP ecommerce platform. The primary path is a free core download plus hosting and extension TCO you own. Secondary sources cite optional managed OpenCart cloud around ~$59–$99/mo — treat as medium confidence and confirm live; SoftwareGlimpse does not invent first-party cloud tiles. Landscape open-source peer — WooCommerce keeps the cluster award (8.1). Research grounded 2026-08-18.",
    vendorPositioning:
      "Open-source online store software — free core, marketplace extensions, and community themes for SMB merchants.",
    pricingModel: "hybrid",
    hasFreePlan: true,
    hasFreeTrial: false,
    startingPriceMonthly: 0,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18: OpenCart core is free open-source download (GPL) — high confidence. Optional managed cloud pricing (~$59–$99/mo) appears in secondary roundups only — medium confidence; confirm live on vendor/cloud partners; do not treat as first-party confirmed list tiles. Primary buyer path is free core + hosting/extension TCO. Affiliate economics excluded.",
    pricingSummary:
      "Open-source core: free license + hosting/extension TCO. Optional managed cloud sometimes cited ~$59–$99/mo (confirm live — not first-party confirmed here). Confirm on opencart.com.",
    plans: [
      {
        kind: "free",
        slug: "open-source",
        name: "OpenCart (open source)",
        highlighted: true,
        description:
          "Free GPL download — you own hosting, security, extensions, and agency work.",
      },
      {
        kind: "contact-sales",
        slug: "managed-cloud",
        name: "Managed cloud (confirm live)",
        description:
          "Secondary sources cite ~$59–$99/mo managed hosting — confirm live; not treated as first-party confirmed tiles.",
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
      { integrationSlug: "paypal", kind: "third-party" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    officialVideos: [],
    limitations: [
      "Hosting, security, and extension TCO are on you even when the license is $0",
      "Managed cloud floors are not first-party confirmed here — confirm live before budgeting",
      "POS / omnichannel is extension-dependent, not a native retail bundle",
      "Admin UX and ecosystem mindshare trail WooCommerce and Magento for many buyers",
    ],
    limitationKinds: [
      "other",
      "plan-restriction",
      "requires-add-on",
      "other",
    ],
    scores: {
      "ease-of-use": 7,
      "storefront-commerce-fit": 6,
      "catalog-orders-depth": 7,
      "checkout-conversion": 6,
      integrations: 6,
      "omnichannel-pos": 2,
      scalability: 6,
      "value-for-money": 8,
      "ai-capabilities": 3,
    },
    scoreRationales: {
      "ease-of-use":
        "More approachable than Magento for simple PHP stores; still self-hosted ops versus Shopify/Woo guided paths.",
      "storefront-commerce-fit":
        "Core job is open-source storefront. Landscape peer — WooCommerce keeps the open-source cluster award (8.1).",
      "catalog-orders-depth":
        "Solid catalog and order basics for SMB PHP carts; weaker than Magento for complex B2B programmes.",
      "checkout-conversion":
        "Checkout works via payment extensions; conversion quality depends on theme and gateway work.",
      integrations:
        "Extension marketplace covers common payments and shipping — narrower mindshare than WooCommerce.",
      "omnichannel-pos":
        "Not a retail POS product — in-person selling is extension territory at best.",
      scalability:
        "Fine for SMB catalogs; high-GMV complex programmes usually outgrow classic OpenCart stacks.",
      "value-for-money":
        "Free GPL core is strong when you accept hosting/extension TCO and do not need Magento depth.",
      "ai-capabilities":
        "Minimal first-party AI versus modern SaaS platforms.",
    },
    pros: [
      "Free GPL open-source core",
      "Commerce-first PHP cart (not a CMS plugin)",
      "Large extension and theme marketplace",
      "Low license floor for self-hosted SMBs",
    ],
    cons: [
      "Self-hosted ops and extension hygiene",
      "Managed cloud pricing needs live confirmation",
      "Weaker ecosystem mindshare than WooCommerce",
    ],
    bestFor: [
      "SMB merchants wanting a free PHP open-source cart",
      "Teams comfortable self-hosting and buying extensions",
      "Catalogs that do not need Magento/Adobe programme depth",
    ],
    notIdealFor: [
      "WordPress-native content + store teams (see WooCommerce)",
      "Founders wanting zero hosting ops (see Shopify)",
      "Retailers whose center of gravity is POS hardware",
    ],
    keyFeatures: [
      "GPL open-source core",
      "Extension marketplace",
      "Multi-store catalog basics",
      "Payment gateway extensions",
      "Optional managed cloud (confirm live)",
    ],
    whoShouldChoose:
      "Choose OpenCart when you want a free PHP open-source cart and will own hosting and extensions — not when you need WordPress-native WooCommerce or hosted SaaS simplicity.",
    whoShouldConsiderAlternatives:
      "Consider WooCommerce for WordPress-native open source; PrestaShop for EU commerce-first PHP; Magento for deeper B2B/enterprise; Shopify for hosted SaaS.",
    useCaseSlugs: ["online-storefront"],
    teamTypeSlugs: ["operations", "marketing"],
    businessSizeSlugs: ["small-business", "mid-market"],
    competitorSlugs: ["woocommerce", "prestashop", "magento"],
    alternativeSlugs: ["woocommerce", "prestashop", "magento"],
    comparableSlugs: ["woocommerce", "prestashop", "magento"],
    subcategorySlugs: [],
  },
  {
    slug: "commercetools",
    name: "commercetools",
    company: "commercetools GmbH",
    website: "https://commercetools.com/",
    domain: "commercetools.com",
    pricingUrl: "https://commercetools.com/pricing",
    aliases: ["commercetools Sphere", "Composable Commerce"],
    membershipRole: "primary",
    jobCluster: "saas-platform",
    softShortDescription:
      "Composable enterprise commerce API — quote-only packages + 60-day free trial; contact sales. Shopify keeps the SaaS award.",
    shortDescription:
      "commercetools is a composable, API-first enterprise commerce platform (MACH-oriented) for mid-market and enterprise brands that assemble storefronts, catalogs, and channels on a commerce engine rather than an all-in-one SMB admin. Pricing is quote-only with a published 60-day free trial — no public monthly $ tiles. Landscape saas-platform peer — Shopify keeps the cluster award (9.2). Research grounded 2026-08-18 from commercetools.com/pricing.",
    vendorPositioning:
      "Composable commerce for ambitious brands — API-first commerce engine, not a theme-first SMB launcher.",
    pricingModel: "custom",
    hasFreePlan: false,
    hasFreeTrial: true,
    trialDays: 60,
    startingPriceConfidence: "low",
    pricingNotes:
      "Verified 2026-08-18 from commercetools.com/pricing (high confidence that list $ tiles are absent). Quote-only packaging with a 60-day free trial (first-party). Core / tailored / premium-support-style packages are contact-sales — SoftwareGlimpse does not invent floors. Implementation and front-end TCO dominate. Affiliate economics excluded.",
    pricingSummary:
      "Custom quote + 60-day free trial. Contact commercetools — no published monthly list tiles. Confirm live packaging on commercetools.com/pricing.",
    plans: [
      {
        kind: "contact-sales",
        slug: "core",
        name: "Core",
        description:
          "Composable commerce engine — contact sales for packaging and capacity.",
      },
      {
        kind: "contact-sales",
        slug: "tailored",
        name: "Tailored",
        highlighted: true,
        hasFreeTrial: true,
        trialDays: 60,
        description:
          "Tailored enterprise packaging — quote only. 60-day free trial available (confirm live).",
      },
      {
        kind: "contact-sales",
        slug: "premium-support",
        name: "Premium support",
        description:
          "Premium support / enterprise add-on path — confirm live with commercetools.",
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
      "marketplace-channels": "supported",
      "b2b-wholesale": "supported",
      "marketing-automation": "add-on",
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
      { integrationSlug: "stripe", kind: "third-party" },
      { integrationSlug: "paypal", kind: "third-party" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    officialVideos: [],
    limitations: [
      "No published monthly list price — hard to compare without a sales worksheet",
      "Requires front-end / MACH assembly — not a weekend theme launch",
      "Overkill for SMB catalogs that fit Shopify or BigCommerce",
      "Implementation timelines are measured in programmes, not days",
    ],
    limitationKinds: [
      "plan-restriction",
      "other",
      "other",
      "other",
    ],
    scores: {
      "ease-of-use": 5,
      "storefront-commerce-fit": 8,
      "catalog-orders-depth": 9,
      "checkout-conversion": 8,
      integrations: 9,
      "omnichannel-pos": 7,
      scalability: 10,
      "value-for-money": 5,
      "ai-capabilities": 7,
    },
    scoreRationales: {
      "ease-of-use":
        "Composable API-first admin and partner delivery — not a guided SMB launch path like Shopify.",
      "storefront-commerce-fit":
        "Scored as composable enterprise SaaS commerce. Landscape peer — Shopify keeps the saas-platform award (9.2).",
      "catalog-orders-depth":
        "Catalog, pricing, and order APIs are strengths for complex multi-brand programmes.",
      "checkout-conversion":
        "Checkout is composed via APIs/partners — capable at enterprise scale, not Shop Pay out of the box.",
      integrations:
        "MACH ecosystem and APIs are the product — strong when you have integration capacity.",
      "omnichannel-pos":
        "Channel and in-person paths are supported in enterprise programmes — not a Square hardware bundle.",
      scalability:
        "Designed for high-GMV, multi-market composable commerce.",
      "value-for-money":
        "Quote-only packaging and front-end TCO compress value for anyone who does not need composable depth.",
      "ai-capabilities":
        "Vendor AI/assistant narratives exist on the enterprise path — secondary to the commerce engine job.",
    },
    pros: [
      "Composable / MACH commerce engine for ambitious brands",
      "60-day free trial on the sales path",
      "Strong catalog and API depth",
      "Enterprise scalability narrative",
    ],
    cons: [
      "Quote-only — no published monthly tiles",
      "Needs front-end and SI capacity",
      "Not an SMB Shopify substitute",
    ],
    bestFor: [
      "Mid-market and enterprise brands assembling composable storefronts",
      "Teams with MACH / headless delivery capacity",
      "Programmes that outgrew monolith SMB SaaS packaging",
    ],
    notIdealFor: [
      "Solo founders wanting a theme + apps weekend launch",
      "Buyers who need published monthly plan tiles only",
      "Retailers whose only need is Square-class POS hardware",
    ],
    keyFeatures: [
      "Composable commerce APIs",
      "Catalog & order engine",
      "60-day free trial",
      "Multi-channel / B2B paths",
      "Contact-sales packaging",
    ],
    whoShouldChoose:
      "Choose commercetools when composable API-first commerce is the job and you have budget for a quote plus front-end assembly — not when you want Shopify’s guided SMB admin.",
    whoShouldConsiderAlternatives:
      "Consider Salesforce Commerce Cloud for Salesforce-stack enterprises; Magento/Adobe for open-source enterprise; Shopify for hosted SaaS with published tiles.",
    useCaseSlugs: ["online-storefront", "wholesale-b2b"],
    teamTypeSlugs: ["operations", "marketing"],
    businessSizeSlugs: ["mid-market", "enterprise"],
    competitorSlugs: ["salesforce-commerce-cloud", "magento", "shopify"],
    alternativeSlugs: ["salesforce-commerce-cloud", "magento", "shopify"],
    comparableSlugs: ["salesforce-commerce-cloud", "magento", "shopify"],
    subcategorySlugs: [],
  },
  {
    slug: "vtex",
    name: "VTEX",
    company: "VTEX",
    website: "https://vtex.com/",
    domain: "vtex.com",
    pricingUrl: "https://vtex.com/en-us/get-started/",
    aliases: ["VTEX Commerce", "VTEX IO"],
    membershipRole: "primary",
    jobCluster: "saas-platform",
    softShortDescription:
      "Enterprise commerce SaaS — contact-sales get-started only; no invented floors. Shopify keeps the SaaS award.",
    shortDescription:
      "VTEX is a hosted commerce platform aimed at mid-market and enterprise brands running online storefronts, marketplace-style channels, and digital commerce operations. First-party get-started paths route to talk-to-sales — SoftwareGlimpse does not invent published monthly floors. Landscape saas-platform peer — Shopify keeps the cluster award (9.2). Research grounded 2026-08-18 from vtex.com.",
    vendorPositioning:
      "Digital commerce platform for ambitious brands — storefronts, marketplaces, and composable experiences on VTEX.",
    pricingModel: "custom",
    hasFreePlan: false,
    hasFreeTrial: false,
    startingPriceConfidence: "low",
    pricingNotes:
      "Verified 2026-08-18 from vtex.com/en-us/get-started (high confidence that self-serve $ tiles are absent). Contact-sales only — no invented list floors. Implementation and GMV/contract packaging dominate TCO. Affiliate economics excluded.",
    pricingSummary:
      "Contact sales via VTEX get-started. No published monthly list tiles in this catalogue — confirm live packaging with VTEX.",
    plans: [
      {
        kind: "contact-sales",
        slug: "talk-to-sales",
        name: "Talk to sales",
        highlighted: true,
        description:
          "Get-started / talk-to-sales packaging — quote only. Confirm live with VTEX.",
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
      "marketplace-channels": "supported",
      "b2b-wholesale": "supported",
      "marketing-automation": "add-on",
      "analytics-reporting": "supported",
      "ai-assistance": "supported",
      "dropshipping-sourcing": "add-on",
      "app-extensions": "supported",
    },
    aiLines: [
      "AI assistant: supported",
      "AI summaries: limited",
      "AI automation: limited",
      "AI recommendations: supported",
    ],
    integrations: [
      { integrationSlug: "stripe", kind: "third-party" },
      { integrationSlug: "paypal", kind: "third-party" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    officialVideos: [],
    limitations: [
      "No published self-serve monthly tiles — hard to shortlist on list price alone",
      "Enterprise sales and implementation cycles versus Shopify SMB speed",
      "Omnichannel POS depth is not the Square-class hardware story",
      "Overkill for simple SMB catalogs",
    ],
    limitationKinds: [
      "plan-restriction",
      "other",
      "feature-unavailable",
      "other",
    ],
    scores: {
      "ease-of-use": 6,
      "storefront-commerce-fit": 8,
      "catalog-orders-depth": 8,
      "checkout-conversion": 8,
      integrations: 8,
      "omnichannel-pos": 6,
      scalability: 9,
      "value-for-money": 6,
      "ai-capabilities": 6,
    },
    scoreRationales: {
      "ease-of-use":
        "Capable commerce admin for mid-market teams, with more sales/implementation friction than Shopify Basic.",
      "storefront-commerce-fit":
        "Primary job is hosted enterprise/mid-market storefront commerce. Landscape peer — Shopify keeps the award.",
      "catalog-orders-depth":
        "Strong catalog and order ops for multi-channel programmes; trails deepest Magento/SFCC B2B stacks for some edge cases.",
      "checkout-conversion":
        "Hosted checkout is solid for VTEX programmes — not Shop Pay ecosystem defaults.",
      integrations:
        "App/IO and partner connectors cover mid-market and enterprise channels.",
      "omnichannel-pos":
        "Omnichannel narratives exist; not scored as a Square hardware bundle.",
      scalability:
        "Built for growing and enterprise GMV programmes across markets.",
      "value-for-money":
        "Opaque quote packaging compresses value for SMB buyers who need published tiles.",
      "ai-capabilities":
        "Vendor AI features appear on the platform path — secondary to commerce ops.",
    },
    pros: [
      "Hosted commerce for mid-market and enterprise brands",
      "Marketplace / multi-channel orientation",
      "IO / extensibility for custom experiences",
      "Stronger enterprise narrative than SMB website builders",
    ],
    cons: [
      "Contact-sales only — no invented floors",
      "Heavier sales cycle than Shopify SMB",
      "Not a POS-first retail stack",
    ],
    bestFor: [
      "Mid-market and enterprise brands needing hosted commerce beyond SMB tiles",
      "Teams evaluating marketplace-style channel programmes",
      "Buyers comparing BigCommerce / Shopify Plus / SFCC peers",
    ],
    notIdealFor: [
      "Solo founders needing a published $29/mo tile",
      "WordPress-native open-source stacks",
      "Retailers whose center of gravity is Square POS hardware",
    ],
    keyFeatures: [
      "Hosted commerce platform",
      "Catalog & order management",
      "Marketplace / channel paths",
      "VTEX IO extensibility",
      "Contact-sales packaging",
    ],
    whoShouldChoose:
      "Choose VTEX when you need a mid-market/enterprise hosted commerce platform and will run a sales-led evaluation — not when you need Shopify’s published SMB tiles.",
    whoShouldConsiderAlternatives:
      "Consider Shopify or BigCommerce for published SaaS tiles; Salesforce Commerce Cloud for Salesforce-stack enterprises; Magento for open-source control.",
    useCaseSlugs: ["online-storefront", "wholesale-b2b"],
    teamTypeSlugs: ["operations", "marketing"],
    businessSizeSlugs: ["mid-market", "enterprise"],
    competitorSlugs: ["shopify", "bigcommerce", "salesforce-commerce-cloud"],
    alternativeSlugs: ["shopify", "bigcommerce", "salesforce-commerce-cloud"],
    comparableSlugs: ["shopify", "bigcommerce", "salesforce-commerce-cloud"],
    subcategorySlugs: [],
  },
  {
    slug: "saleor",
    name: "Saleor",
    company: "Saleor Commerce",
    website: "https://saleor.io/",
    domain: "saleor.io",
    pricingUrl: "https://saleor.io/pricing",
    aliases: ["Saleor Commerce", "Saleor Cloud"],
    membershipRole: "primary",
    jobCluster: "open-source-platform",
    softShortDescription:
      "Headless GraphQL commerce — OSS self-host free; Cloud Select $1599/mo, Volume $3999/mo, Enterprise quote. Forever Free is non-commercial only.",
    shortDescription:
      "Saleor is a headless, GraphQL-first open-source commerce platform. OSS self-host is free for production; Saleor Cloud Forever Free is non-commercial prototyping only — do not treat it as a merchant production free plan. Production Cloud (first-party 2026-08-18): Select $1599/mo (up to $200k GMV/mo, 0.8% overage), Volume $3999/mo (up to $1M GMV, 0.4% overage), Enterprise contact. Landscape open-source peer — WooCommerce keeps the cluster award (8.1). Research grounded 2026-08-18 from saleor.io/pricing.",
    vendorPositioning:
      "Composable, GraphQL-native commerce — open-source core plus Saleor Cloud for teams that want hosted headless.",
    pricingModel: "hybrid",
    hasFreePlan: true,
    hasFreeTrial: false,
    startingPriceMonthly: 0,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from saleor.io/pricing (high confidence for Cloud tiles). OSS self-host free for production. Forever Free Cloud is non-commercial prototyping only — not a production merchant free plan. Select $1599/mo (≤$200k GMV/mo, 0.8% overage); Volume $3999/mo (≤$1M GMV, 0.4% overage); Enterprise contact. Accelerator and professional services (e.g. ~$6000 one-time) may apply — confirm live. Affiliate economics excluded.",
    pricingSummary:
      "OSS self-host: free. Cloud: Select $1599/mo, Volume $3999/mo, Enterprise quote. Forever Free Cloud is non-commercial only. Confirm live on saleor.io/pricing.",
    plans: [
      {
        kind: "free",
        slug: "open-source",
        name: "Open Source (self-host)",
        description:
          "Free OSS for production self-host — you own hosting, DevOps, and front-end.",
      },
      {
        kind: "flat-annual",
        slug: "select",
        name: "Cloud Select",
        amount: 1599,
        highlighted: true,
        description:
          "$1599/mo — up to $200k GMV/mo, 0.8% overage. Production Cloud band.",
      },
      {
        kind: "flat-annual",
        slug: "volume",
        name: "Cloud Volume",
        amount: 3999,
        description:
          "$3999/mo — up to $1M GMV/mo, 0.4% overage. Confirm live packaging.",
      },
      {
        kind: "contact-sales",
        slug: "enterprise",
        name: "Cloud Enterprise",
        description:
          "Enterprise Cloud quote — confirm live with Saleor. Forever Free is non-commercial prototyping only.",
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
      { integrationSlug: "stripe", kind: "native" },
      { integrationSlug: "paypal", kind: "third-party" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    officialVideos: [],
    limitations: [
      "Cloud Select floor ($1599/mo) is high versus WooCommerce hosting TCO",
      "Forever Free Cloud is non-commercial — not a production merchant free plan",
      "Headless means you still build or buy the storefront",
      "POS / omnichannel is not the product center of gravity",
    ],
    limitationKinds: [
      "high-cost-at-scale",
      "plan-restriction",
      "other",
      "feature-unavailable",
    ],
    scores: {
      "ease-of-use": 5,
      "storefront-commerce-fit": 7,
      "catalog-orders-depth": 8,
      "checkout-conversion": 7,
      integrations: 8,
      "omnichannel-pos": 4,
      scalability: 8,
      "value-for-money": 6,
      "ai-capabilities": 6,
    },
    scoreRationales: {
      "ease-of-use":
        "Developer/headless GraphQL stack — not a guided SMB theme admin.",
      "storefront-commerce-fit":
        "Core job is headless open-source commerce. Landscape peer — WooCommerce keeps the award.",
      "catalog-orders-depth":
        "Strong catalog and order APIs for composable storefronts.",
      "checkout-conversion":
        "Checkout is composed in your front-end — capable when engineered well.",
      integrations:
        "GraphQL APIs and apps support modern stacks; ecosystem is smaller than Shopify.",
      "omnichannel-pos":
        "Not a retail POS product.",
      scalability:
        "Cloud Volume/Enterprise and self-host scale for ambitious catalogues.",
      "value-for-money":
        "OSS free is strong; Cloud Select $1599 floor is steep versus Woo/Medusa Cloud entry.",
      "ai-capabilities":
        "Limited first-party AI relative to large SaaS platforms.",
    },
    pros: [
      "Free OSS self-host for production",
      "Published Cloud Select / Volume tiles",
      "GraphQL-native headless commerce",
      "Clear GMV bands on Cloud plans",
    ],
    cons: [
      "High Cloud Select floor",
      "Forever Free is non-commercial only",
      "You still build the storefront experience",
    ],
    bestFor: [
      "Teams building headless GraphQL storefronts",
      "Mid-market brands that will self-host or buy Cloud Select+",
      "Composable stacks comparing Medusa and commercetools",
    ],
    notIdealFor: [
      "SMB founders wanting a theme marketplace weekend launch",
      "Merchants mistaking Forever Free for production Cloud",
      "Retail POS-first businesses",
    ],
    keyFeatures: [
      "GraphQL commerce APIs",
      "OSS self-host",
      "Saleor Cloud Select / Volume",
      "Headless storefront freedom",
      "Enterprise quote path",
    ],
    whoShouldChoose:
      "Choose Saleor when headless GraphQL commerce is the job and you will either self-host OSS or budget for Cloud Select+ — not when Forever Free looks like a production free plan.",
    whoShouldConsiderAlternatives:
      "Consider Medusa for JS/MIT headless with lower Cloud floors; Magento for deeper classic enterprise OSS; commercetools for quote-only composable SaaS.",
    useCaseSlugs: ["online-storefront"],
    teamTypeSlugs: ["operations", "marketing"],
    businessSizeSlugs: ["mid-market", "enterprise"],
    competitorSlugs: ["medusa", "magento", "commercetools"],
    alternativeSlugs: ["medusa", "magento", "commercetools"],
    comparableSlugs: ["medusa", "magento", "commercetools"],
    subcategorySlugs: [],
  },
  {
    slug: "medusa",
    name: "Medusa",
    company: "Medusa",
    website: "https://medusajs.com/",
    domain: "medusajs.com",
    pricingUrl: "https://medusajs.com/pricing/",
    aliases: ["MedusaJS", "Medusa Cloud", "Medusa.js"],
    membershipRole: "primary",
    jobCluster: "open-source-platform",
    softShortDescription:
      "Headless JS commerce — MIT OSS free; Cloud Develop $29, Launch $99 highlighted, Scale $299, Enterprise custom. No GMV tax.",
    shortDescription:
      "Medusa is a headless, JavaScript/TypeScript open-source commerce platform. MIT OSS self-host is free for production. Medusa Cloud (first-party): Develop from $29/mo, Launch from $99/mo (highlighted), Scale from $299/mo, Enterprise custom — no GMV percentage tax on published Cloud tiles. Landscape open-source peer — WooCommerce keeps the cluster award (8.1). Research grounded 2026-08-18 from medusajs.com/pricing.",
    vendorPositioning:
      "Open-source commerce for developers — modular JS commerce engine plus Medusa Cloud hosting.",
    pricingModel: "hybrid",
    hasFreePlan: true,
    hasFreeTrial: false,
    startingPriceMonthly: 0,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from medusajs.com/pricing (high confidence). MIT OSS self-host free. Cloud: Develop from $29/mo, Launch from $99/mo, Scale from $299/mo, Enterprise custom. No GMV tax on published Cloud tiles. Affiliate economics excluded.",
    pricingSummary:
      "OSS self-host: free. Cloud from $29/mo Develop; Launch $99/mo; Scale $299/mo; Enterprise custom. No GMV tax. Confirm live on medusajs.com/pricing.",
    plans: [
      {
        kind: "free",
        slug: "open-source",
        name: "Open Source (self-host)",
        description: "Free MIT license — you own hosting and the storefront.",
      },
      {
        kind: "flat-annual",
        slug: "develop",
        name: "Cloud Develop",
        amount: 29,
        description: "From $29/mo — early Cloud / development band.",
      },
      {
        kind: "flat-annual",
        slug: "launch",
        name: "Cloud Launch",
        amount: 99,
        highlighted: true,
        description: "From $99/mo — typical production Cloud entry (highlighted).",
      },
      {
        kind: "flat-annual",
        slug: "scale",
        name: "Cloud Scale",
        amount: 299,
        description: "From $299/mo — higher Cloud capacity band.",
      },
      {
        kind: "contact-sales",
        slug: "enterprise",
        name: "Cloud Enterprise",
        description: "Custom Enterprise Cloud — confirm live with Medusa.",
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
      "b2b-wholesale": "add-on",
      "marketing-automation": "add-on",
      "analytics-reporting": "supported",
      "ai-assistance": "supported",
      "dropshipping-sourcing": "add-on",
      "app-extensions": "supported",
    },
    aiLines: [
      "AI assistant: supported",
      "AI summaries: limited",
      "AI automation: limited",
      "AI recommendations: supported",
    ],
    integrations: [
      { integrationSlug: "stripe", kind: "native" },
      { integrationSlug: "paypal", kind: "third-party" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    officialVideos: [],
    limitations: [
      "Headless means you still build or buy the storefront UX",
      "Not a WordPress-native plugin path (see WooCommerce)",
      "POS / omnichannel is limited versus Square or Lightspeed",
      "Cloud packaging and modules still need live confirmation for edge limits",
    ],
    limitationKinds: [
      "other",
      "other",
      "feature-unavailable",
      "plan-restriction",
    ],
    scores: {
      "ease-of-use": 6,
      "storefront-commerce-fit": 7,
      "catalog-orders-depth": 7,
      "checkout-conversion": 7,
      integrations: 8,
      "omnichannel-pos": 3,
      scalability: 7,
      "value-for-money": 8,
      "ai-capabilities": 7,
    },
    scoreRationales: {
      "ease-of-use":
        "Developer-friendly JS modules beat Magento for many teams; still not a Shopify theme admin.",
      "storefront-commerce-fit":
        "Core job is headless open-source commerce. Landscape peer — WooCommerce keeps the award.",
      "catalog-orders-depth":
        "Solid modular catalog and order workflows for DTC/headless builds.",
      "checkout-conversion":
        "Checkout is composed with Stripe-class gateways — quality depends on your storefront.",
      integrations:
        "Module ecosystem and JS stack integrate well with modern web tooling.",
      "omnichannel-pos":
        "Not a retail POS product.",
      scalability:
        "Launch/Scale/Enterprise cover growth; very large programmes may still evaluate Saleor Cloud or commercetools.",
      "value-for-money":
        "Free OSS plus Cloud from $29/$99 without GMV tax is competitive for headless teams.",
      "ai-capabilities":
        "Vendor AI narratives are stronger than classic PHP carts, secondary to the commerce engine.",
    },
    pros: [
      "Free MIT OSS self-host",
      "Published Cloud ladder without GMV tax",
      "JS/TypeScript developer experience",
      "Launch $99 highlighted production band",
    ],
    cons: [
      "You still own the storefront experience",
      "Not WordPress-native",
      "POS is not the job",
    ],
    bestFor: [
      "JS teams building headless storefronts",
      "SMBs to mid-market brands that will self-host or buy Cloud Launch",
      "Buyers comparing Saleor’s higher Cloud floors",
    ],
    notIdealFor: [
      "Non-technical founders wanting themes-only Shopify",
      "WordPress content + commerce teams",
      "POS-first retailers",
    ],
    keyFeatures: [
      "MIT open-source commerce",
      "Medusa Cloud Develop / Launch / Scale",
      "Modular JS commerce engine",
      "Stripe-friendly checkout paths",
      "No GMV tax on published Cloud tiles",
    ],
    whoShouldChoose:
      "Choose Medusa when you want headless JS commerce with a free OSS core and approachable Cloud tiles — not when you need WordPress-native WooCommerce or Shopify’s theme ecosystem.",
    whoShouldConsiderAlternatives:
      "Consider Saleor for GraphQL-native Cloud with GMV bands; WooCommerce for WordPress; Shopify for hosted SaaS themes/apps.",
    useCaseSlugs: ["online-storefront"],
    teamTypeSlugs: ["operations", "marketing"],
    businessSizeSlugs: ["small-business", "mid-market", "enterprise"],
    competitorSlugs: ["saleor", "shopify", "woocommerce"],
    alternativeSlugs: ["saleor", "shopify", "woocommerce"],
    comparableSlugs: ["saleor", "shopify", "woocommerce"],
    subcategorySlugs: [],
  },
  {
    slug: "tiendanube",
    name: "Tiendanube",
    company: "Tiendanube",
    website: "https://www.tiendanube.com/",
    domain: "tiendanube.com",
    pricingUrl: "https://www.tiendanube.com/planes-y-precios",
    aliases: ["Nuvemshop", "Tienda Nube", "Nube"],
    membershipRole: "primary",
    jobCluster: "saas-platform",
    softShortDescription:
      "LATAM hosted commerce (Tiendanube / Nuvemshop brand) — Argentina ARS tiles: Inicial $0, Esencial ~$20 USD, Impulso ~$59 highlighted, Escala ~$174; Evolución contact. One page only.",
    shortDescription:
      "Tiendanube is a LATAM-focused hosted ecommerce SaaS (also known as Nuvemshop in some markets — one SoftwareGlimpse page, aliases only). Argentina first-party planes-y-precios (2026-08-18 schema.org Offers): Inicial ARS $0, Esencial ARS $26.999/mo, Impulso ARS $78.999/mo, Escala ARS $234.999/mo, Evolución contact. 7-day trial on paid. Annual ~25% discount noted on page. USD schema amounts (~$20 / ~$59 / ~$174) use approximate FX ~1350 ARS/USD (medium confidence) — ARS is the source of truth. Landscape saas-platform peer — Shopify keeps the award (9.2). Research grounded 2026-08-18.",
    vendorPositioning:
      "Create your online store in Latin America — Tiendanube / Nuvemshop for SMB and growing merchants.",
    pricingModel: "flat",
    hasFreePlan: true,
    hasFreeTrial: true,
    trialDays: 7,
    startingPriceMonthly: 0,
    startingPriceConfidence: "medium",
    pricingNotes:
      "Verified 2026-08-18 from tiendanube.com/planes-y-precios Argentina schema.org Offers (high confidence for ARS amounts). Inicial ARS $0; Esencial ARS $26.999/mo; Impulso ARS $78.999/mo; Escala ARS $234.999/mo; Evolución contact. 7-day trial on paid. Annual ~25% discount noted on page. USD approximates (~$20 / ~$59 / ~$174) use ~1350 ARS/USD — medium confidence FX; do not treat USD as first-party. Transaction fees vary by plan with external processors; Pago Nube may waive TN txn fee — confirm live. Affiliate economics excluded. Nuvemshop is an alias — not a separate product page.",
    pricingSummary:
      "Inicial ARS $0. Esencial ~$20/mo USD equiv., Impulso ~$59, Escala ~$174 (ARS source of truth). Evolución contact. 7-day trial on paid. Confirm live ARS tiles and txn fees.",
    plans: [
      {
        kind: "free",
        slug: "inicial",
        name: "Inicial",
        description: "ARS $0 — free entry plan (confirm live limits and fees).",
      },
      {
        kind: "flat-annual",
        slug: "esencial",
        name: "Esencial",
        amount: 20,
        hasFreeTrial: true,
        trialDays: 7,
        description:
          "~$20/mo USD equiv. of ARS $26.999/mo (FX ~1350, medium confidence). ARS is source of truth.",
      },
      {
        kind: "flat-annual",
        slug: "impulso",
        name: "Impulso",
        amount: 59,
        highlighted: true,
        hasFreeTrial: true,
        trialDays: 7,
        description:
          "~$59/mo USD equiv. of ARS $78.999/mo (highlighted). ARS is source of truth.",
      },
      {
        kind: "flat-annual",
        slug: "escala",
        name: "Escala",
        amount: 174,
        hasFreeTrial: true,
        trialDays: 7,
        description:
          "~$174/mo USD equiv. of ARS $234.999/mo. ARS is source of truth.",
      },
      {
        kind: "contact-sales",
        slug: "evolucion",
        name: "Evolución",
        description: "Contact sales — confirm live with Tiendanube.",
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
      "marketplace-channels": "limited",
      "b2b-wholesale": "limited",
      "marketing-automation": "supported",
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
      { integrationSlug: "paypal", kind: "third-party" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    officialVideos: [],
    limitations: [
      "Regional LATAM focus — not a global Shopify peer for every market",
      "USD amounts are FX approximates; ARS tiles are the source of truth",
      "Transaction fees with external processors vary by plan — confirm live (Pago Nube may waive TN fee)",
      "Nuvemshop is the same product brand family — do not create a second /software/ page",
    ],
    limitationKinds: [
      "other",
      "other",
      "plan-restriction",
      "other",
    ],
    scores: {
      "ease-of-use": 8,
      "storefront-commerce-fit": 7,
      "catalog-orders-depth": 7,
      "checkout-conversion": 7,
      integrations: 7,
      "omnichannel-pos": 4,
      scalability: 6,
      "value-for-money": 8,
      "ai-capabilities": 5,
    },
    scoreRationales: {
      "ease-of-use":
        "Guided LATAM SMB admin is the product strength for merchants launching in Spanish/Portuguese markets.",
      "storefront-commerce-fit":
        "Primary job is hosted SaaS storefront for LATAM SMBs. Landscape peer — Shopify keeps the award.",
      "catalog-orders-depth":
        "Solid for SMB catalogs; weaker for Magento-class B2B complexity.",
      "checkout-conversion":
        "Local payments and checkout work for regional buyers; trails Shop Pay global ecosystem narratives.",
      integrations:
        "Apps and local payment rails cover LATAM SMB needs — narrower than Shopify’s global app store.",
      "omnichannel-pos":
        "Limited versus Square Online or Lightspeed Retail.",
      scalability:
        "Escala/Evolución help growing brands; global enterprise programmes often outgrow regional packaging.",
      "value-for-money":
        "Free Inicial plus mid Impulso band is competitive for LATAM SMBs when ARS pricing fits.",
      "ai-capabilities":
        "Limited first-party AI versus larger global SaaS platforms.",
    },
    pros: [
      "Free Inicial plan and 7-day trial on paid",
      "Published ARS plan ladder for Argentina",
      "Strong LATAM SMB positioning (Tiendanube / Nuvemshop)",
      "Local payments and regional go-to-market",
    ],
    cons: [
      "Not a global undifferentiated Shopify #1",
      "USD schema uses approximate FX",
      "Txn fees need live modeling",
    ],
    bestFor: [
      "LATAM SMBs launching or growing an online store",
      "Merchants who want regional payments and Spanish/Portuguese UX",
      "Teams comparing Shopify in LATAM markets",
    ],
    notIdealFor: [
      "Global enterprise programmes needing SFCC/commercetools depth",
      "Buyers who only evaluate USD first-party tiles",
      "POS-first retailers needing Square-class hardware",
    ],
    keyFeatures: [
      "Hosted LATAM storefront",
      "Inicial / Esencial / Impulso / Escala / Evolución",
      "Local payment rails",
      "7-day trial on paid",
      "Nuvemshop brand alias (one page)",
    ],
    whoShouldChoose:
      "Choose Tiendanube when LATAM hosted commerce with regional pricing and UX is the job — not when you need a separate Nuvemshop page or a global Shopify Plus programme.",
    whoShouldConsiderAlternatives:
      "Consider Shopify for global SaaS ecosystem depth; Wix for website-builder commerce; Ecwid for embeddable carts on an existing site.",
    useCaseSlugs: ["online-storefront"],
    teamTypeSlugs: ["operations", "marketing"],
    businessSizeSlugs: ["small-business", "mid-market"],
    competitorSlugs: ["shopify", "wix", "ecwid"],
    alternativeSlugs: ["shopify", "wix", "ecwid"],
    comparableSlugs: ["shopify", "wix", "ecwid"],
    subcategorySlugs: [],
  },
];

export const COMPARISON_PAIRS = [
  ["opencart", "woocommerce"],
  ["commercetools", "salesforce-commerce-cloud"],
  ["vtex", "bigcommerce"],
  ["saleor", "medusa"],
  ["tiendanube", "shopify"],
];

export const PRODUCTS = COMPACT.map(expandEcomProduct);
