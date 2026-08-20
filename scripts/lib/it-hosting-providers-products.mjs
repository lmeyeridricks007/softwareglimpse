/**
 * IT hosting providers (compact) — not panel licences.
 * cloudways, wp-engine.
 *
 * Pricing grounded 2026-08-18 from first-party pages.
 * Affiliate economics never enter scores. handsOnTesting=false.
 *
 * WP Engine (7.7) is the hosting-providers cluster award.
 * Cloudways (7.6) is the managed multi-cloud peer.
 * Explicitly NOT peer-ranked with Plesk / cPanel as panel licences —
 * those pairs are landscape only.
 */
import { expandItProduct } from "./it-compact-expand.mjs";

const HOSTING_FEATURES = {
  "incident-management": "not-supported",
  "change-problem": "not-supported",
  "service-catalog": "not-supported",
  "infrastructure-monitoring": "limited",
  "apm-tracing": "not-supported",
  "log-management": "limited",
  "source-control": "not-supported",
  "cicd-actions": "limited",
  "hosting-panel": "limited",
  "managed-hosting": "supported",
  "proxy-network": "not-supported",
  "itsm-ai": "not-supported",
  "dev-ai": "limited",
  "oncall-paging": "not-supported",
  "enterprise-security": "limited",
  "analytics-reporting": "limited",
};

const COMPACT = [
  {
    slug: "cloudways",
    name: "Cloudways",
    company: "Cloudways Ltd. (DigitalOcean company)",
    website: "https://www.cloudways.com",
    domain: "cloudways.com",
    pricingUrl: "https://www.cloudways.com/pricing.php",
    aliases: ["Cloudways Hosting", "Cloudways Autonomous"],
    membershipRole: "primary",
    jobCluster: "hosting-providers",
    softShortDescription:
      "Managed cloud hosting — Flexible from $11/mo DigitalOcean Standard; Autonomous WordPress autoscaling separate line.",
    shortDescription:
      "Cloudways is a managed cloud hosting platform (a DigitalOcean company) that provisions app stacks on cloud VMs instead of selling a Plesk/cPanel panel licence. Flexible publishes from $11/mo for DigitalOcean Standard and is billed hourly. Autonomous WordPress autoscaling is a separate product line — do not treat the Flexible $11 floor as Autonomous. Same hosting-providers cluster as WP Engine (managed hosting), not hosting-operations (panel licences). Landscape-only versus Plesk/cPanel.",
    vendorPositioning:
      "Managed multi-cloud hosting — pick a cloud VM, skip panel-licence math, scale WordPress and other apps from one console.",
    pricingModel: "usage",
    hasFreePlan: false,
    hasFreeTrial: true,
    startingPriceMonthly: 11,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from cloudways.com/pricing.php (high confidence). Flexible from $11/mo DigitalOcean Standard; hourly billing. Autonomous WordPress is a separate line — not that $11 floor. Flexible free trial without a card per the first-party page. Affiliate economics excluded.",
    pricingSummary:
      "Flexible from $11/mo (DigitalOcean Standard, hourly). Autonomous WordPress is a separate line. Free trial without a card on Flexible. Confirm live on cloudways.com/pricing.php.",
    plans: [
      {
        kind: "flat-monthly",
        slug: "flexible-do-standard",
        name: "Flexible (DigitalOcean Standard)",
        amount: 11,
        highlighted: true,
        hasFreeTrial: true,
        description:
          "$11/mo published Flexible floor on DigitalOcean Standard — billed hourly. Free trial without a card per first-party page.",
      },
      {
        kind: "contact-sales",
        slug: "autonomous",
        name: "Autonomous WordPress",
        description:
          "Separate WordPress autoscaling line — not the Flexible $11 DigitalOcean Standard floor. Confirm live packaging on cloudways.com/pricing.php.",
      },
    ],
    featureOverrides: HOSTING_FEATURES,
    aiLines: [
      "ITSM AI copilot: not-supported",
      "Developer AI copilot: limited",
      "AI automation: limited",
      "AI recommendations: limited",
    ],
    integrations: [
      { integrationSlug: "wordpress", kind: "native" },
      { integrationSlug: "api", kind: "api" },
    ],
    limitations: [
      "Flexible $11 is a DigitalOcean Standard floor billed hourly — other clouds and sizes change TCO",
      "Autonomous WordPress autoscaling is a separate line, not included in the Flexible $11 tile",
      "Not a Plesk/cPanel panel licence — you are buying managed hosting, not a control-panel SKU",
      "Not ITSM, observability, source control, or a proxy network",
      "WordPress is one of several app stacks — not a WP Engine-style WordPress-only specialist",
    ],
    limitationKinds: [
      "other",
      "other",
      "other",
      "feature-unavailable",
      "other",
    ],
    scores: {
      "ease-of-use": 7,
      "it-job-fit": 9,
      "workflow-depth": 8,
      integrations: 8,
      "admin-security": 7,
      scalability: 8,
      "value-for-money": 8,
      "ai-capabilities": 5,
    },
    scoreRationales: {
      "ease-of-use":
        "Managed console over cloud VMs is easier than raw IaaS, but still more knobs than WP Engine’s WordPress-only UX. Not a lab test.",
      "it-job-fit":
        "Primary job is managed multi-cloud hosting — hosting-providers cluster with WP Engine, not Plesk/cPanel panel licences.",
      "workflow-depth":
        "Flexible stack + separate Autonomous WordPress line cover managed hosting workflows; not a hosting-panel reseller OS.",
      integrations: "WordPress and API/cloud-provider plumbing are the integration story.",
      "admin-security":
        "Managed platform security is real; not a panel-licence hardening kit and not WP Engine’s WordPress-specialist posture.",
      scalability: "Hourly Flexible plus Autonomous autoscaling scale; TCO still follows VM size and cloud choice.",
      "value-for-money":
        "Published $11 DigitalOcean Standard floor is the sharpest managed-host entry here. Affiliate economics excluded.",
      "ai-capabilities":
        "No meaningful ITSM/dev AI copilot — scored low; hosting job rarely needs AI scoring depth.",
    },
    bestFor: [
      "Teams that want managed hosting on a chosen cloud VM without buying a panel licence",
      "Agencies running WordPress plus other apps on one Cloudways account",
      "Buyers who will actually use hourly Flexible billing and the $11 DigitalOcean Standard floor",
    ],
    notIdealFor: [
      "Admins buying a Plesk or cPanel licence for servers they already own",
      "WordPress-only buyers who want WP Engine’s specialist packaging",
      "ITSM, observability, or source-control purchases",
    ],
    pros: [
      "Published Flexible $11/mo DigitalOcean Standard floor",
      "Hourly billing",
      "Flexible free trial without a card",
      "Managed multi-cloud, not a panel SKU",
      "Autonomous WordPress line when autoscaling is the job",
    ],
    cons: [
      "Autonomous is a separate line from Flexible $11",
      "Not WordPress-only specialist depth",
      "Other clouds/sizes raise TCO fast",
      "Not a panel licence for owned metal",
      "AI capabilities are not the product",
    ],
    keyFeatures: [
      "Managed cloud hosting (Flexible)",
      "DigitalOcean Standard from $11/mo",
      "Hourly billing",
      "Autonomous WordPress (separate line)",
      "Multi-app stacks — not panel licensing",
    ],
    whoShouldChoose:
      "Choose Cloudways when managed multi-cloud hosting is the job — not a Plesk/cPanel panel licence, and not WP Engine’s WordPress-only specialist path by default.",
    whoShouldConsiderAlternatives:
      "Compare WP Engine for managed WordPress-specialist hosting; Plesk or cPanel only if you need a control-panel licence on infrastructure you already run (landscape, not a peer rank).",
    alternativeSlugs: ["wp-engine", "plesk"],
    competitorSlugs: ["wp-engine", "plesk", "cpanel"],
    comparableSlugs: ["wp-engine"],
    useCaseSlugs: ["hosting-providers"],
    businessSizeSlugs: ["micro", "small-business", "mid-market"],
    teamTypeSlugs: ["operations", "engineering"],
    sourcesExtra: [
      {
        id: "cloudways-pricing",
        url: "https://www.cloudways.com/pricing.php",
        title: "Cloudways pricing",
        domains: ["pricing", "plans", "free-trial", "limits"],
      },
    ],
  },
  {
    slug: "wp-engine",
    name: "WP Engine",
    company: "WP Engine, Inc.",
    website: "https://wpengine.com",
    domain: "wpengine.com",
    pricingUrl: "https://wpengine.com/plans/",
    aliases: ["WPEngine", "WP Engine Hosting", "WP Engine Core"],
    membershipRole: "primary",
    jobCluster: "hosting-providers",
    softShortDescription:
      "Managed WordPress hosting — Essential Startup from $30/mo annual first-year; Core from $400/mo; Enterprise custom.",
    shortDescription:
      "WP Engine is a managed WordPress hosting platform (WordPress-specialist, not a multi-app cloud console and not a Plesk/cPanel licence). Essential plans on wpengine.com/plans (2026-08-18): Startup $30/mo*, Professional $55, Growth $109, Scale $276 — *first-year Essential disclaimer applies; confirm renewal. Core from $400/mo. Enterprise custom. Same hosting-providers cluster as Cloudways — different shape (WordPress-only specialist vs multi-cloud/multi-app). Landscape-only versus Plesk/cPanel.",
    vendorPositioning:
      "Managed WordPress hosting — specialist platform, support, and workflow for WordPress, not a generic cloud VM panel.",
    pricingModel: "flat",
    hasFreePlan: false,
    hasFreeTrial: false,
    startingPriceMonthly: 30,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from wpengine.com/plans/ (high confidence). Essential Startup $30/mo annual first-year; Professional $55; Growth $109; Scale $276; Core $400/mo; Enterprise custom. The $30 Startup tile is a first-year Essential disclaimer — confirm renewal before treating it as ongoing TCO. Affiliate economics excluded.",
    pricingSummary:
      "Essential Startup from $30/mo annual first-year*. Professional $55. Growth $109. Scale $276. Core from $400/mo. Enterprise quote. Confirm live (and renewal) on wpengine.com/plans/.",
    plans: [
      {
        kind: "flat-annual",
        slug: "essential-startup",
        name: "Essential Startup",
        amount: 30,
        highlighted: true,
        description:
          "$30/mo billed annually on first-year Essential packaging — confirm renewal. WordPress-managed Startup tile.",
      },
      {
        kind: "flat-monthly",
        slug: "essential-professional",
        name: "Essential Professional",
        amount: 55,
        description: "$55/mo Essential Professional — confirm live billing interval on wpengine.com/plans/.",
      },
      {
        kind: "flat-monthly",
        slug: "essential-growth",
        name: "Essential Growth",
        amount: 109,
        description: "$109/mo Essential Growth.",
      },
      {
        kind: "flat-monthly",
        slug: "essential-scale",
        name: "Essential Scale",
        amount: 276,
        description: "$276/mo Essential Scale.",
      },
      {
        kind: "flat-monthly",
        slug: "core",
        name: "Core",
        amount: 400,
        description: "Core from $400/mo — above Essential, below Enterprise quote.",
      },
      {
        kind: "contact-sales",
        slug: "enterprise",
        name: "Enterprise",
        description: "Custom WordPress hosting — contact sales.",
      },
    ],
    featureOverrides: {
      ...HOSTING_FEATURES,
      "enterprise-security": "supported",
      "cicd-actions": "limited",
    },
    aiLines: [
      "ITSM AI copilot: not-supported",
      "Developer AI copilot: limited",
      "AI automation: limited",
      "AI recommendations: limited",
    ],
    integrations: [
      { integrationSlug: "wordpress", kind: "native" },
      { integrationSlug: "api", kind: "api" },
    ],
    limitations: [
      "Startup $30/mo is first-year Essential annual packaging — renewal can change TCO",
      "WordPress-specialist hosting — not Cloudways-style multi-app / multi-cloud VMs",
      "Not a Plesk/cPanel panel licence for servers you already own",
      "Core $400/mo and Enterprise quote are a different buying motion than Essential",
      "Not ITSM, observability, git-as-product, or a proxy network",
    ],
    limitationKinds: [
      "other",
      "other",
      "other",
      "plan-restriction",
      "feature-unavailable",
    ],
    scores: {
      "ease-of-use": 8,
      "it-job-fit": 9,
      "workflow-depth": 8,
      integrations: 7,
      "admin-security": 8,
      scalability: 8,
      "value-for-money": 7,
      "ai-capabilities": 6,
    },
    scoreRationales: {
      "ease-of-use":
        "WordPress-only managed UX is the easiest path in this cluster for WP teams. Not a lab test.",
      "it-job-fit":
        "Primary job is managed WordPress hosting — hosting-providers cluster award versus Cloudways; not a panel-licence peer of Plesk.",
      "workflow-depth":
        "Essential → Core → Enterprise WordPress workflow (deploys, staging, WP-specific ops) is deep for that job.",
      integrations: "WordPress-centric integrations; narrower multi-app/cloud story than Cloudways.",
      "admin-security":
        "WordPress-specialist platform security is a buying reason versus generic managed VMs.",
      scalability: "Scale / Core / Enterprise exist; Essential first-year tiles are not the large-estate path.",
      "value-for-money":
        "First-year $30 Startup is a clear published floor; renewal and Core $400 change the math. Affiliate economics excluded.",
      "ai-capabilities":
        "Limited WordPress-assist packaging — scored as supporting, not a reason to pick a host.",
    },
    bestFor: [
      "Teams whose only hosting job is managed WordPress",
      "Buyers who will pay for WP Engine specialist support and WP workflow",
      "Organisations that will land on Core or Enterprise, not only the first-year Startup tile",
    ],
    notIdealFor: [
      "Multi-app / multi-cloud VM hosting (Cloudways)",
      "Admins who need a Plesk or cPanel licence on owned servers",
      "ITSM, observability, or source-control purchases",
    ],
    pros: [
      "WordPress-specialist managed hosting",
      "Published Essential ladder including Startup $30 first-year",
      "Core from $400/mo and Enterprise path",
      "Stronger WP admin-security story than generic managed VMs",
      "Clear hosting-providers cluster fit",
    ],
    cons: [
      "First-year Essential disclaimer on Startup $30",
      "Not multi-app / multi-cloud",
      "Not a panel licence",
      "Core/Enterprise is a steep jump from Essential",
      "AI is not the product",
    ],
    keyFeatures: [
      "Managed WordPress hosting",
      "Essential Startup / Professional / Growth / Scale",
      "Core from $400/mo",
      "Enterprise custom",
      "WordPress-specialist platform (not a panel SKU)",
    ],
    whoShouldChoose:
      "Choose WP Engine when managed WordPress-specialist hosting is the job — not Cloudways multi-cloud/multi-app by default, and not a Plesk/cPanel panel licence.",
    whoShouldConsiderAlternatives:
      "Compare Cloudways for managed multi-cloud / multi-app hosting; Plesk or cPanel only if you need a control-panel licence (landscape, not a peer rank).",
    alternativeSlugs: ["cloudways", "plesk"],
    competitorSlugs: ["cloudways", "plesk", "cpanel"],
    comparableSlugs: ["cloudways"],
    useCaseSlugs: ["hosting-providers"],
    businessSizeSlugs: ["small-business", "mid-market", "enterprise"],
    teamTypeSlugs: ["operations", "engineering"],
    sourcesExtra: [
      {
        id: "wp-engine-plans",
        url: "https://wpengine.com/plans/",
        title: "WP Engine plans",
        domains: ["pricing", "plans", "limits"],
      },
    ],
  },
];

export const PRODUCTS = COMPACT.map(expandItProduct);

export const COMPARISON_PAIRS = [
  ["wp-engine", "cloudways"],
  ["cloudways", "plesk"],
  ["wp-engine", "plesk"],
];
