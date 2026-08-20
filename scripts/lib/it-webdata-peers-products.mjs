/**
 * IT web-data peers of Bright Data (compact).
 * oxylabs, scraperapi, apify, thordata.
 *
 * Pricing grounded 2026-08-18 from first-party pages.
 * Affiliate economics never enter scores. handsOnTesting=false.
 *
 * Bright Data (7.7) remains the web-data-collection cluster award.
 * Oxylabs is the enterprise proxy / scraper-API peer (7.7).
 * ScraperAPI is the managed scraping-API path (7.3).
 * Apify is the Actor-platform / compute path (7.5).
 * ThorData is the budget proxy / scraper peer (6.8) — affiliate identity
 * resolved from REVIEW_REQUIRED (was low-confidence identity only).
 */
import { expandItProduct } from "./it-compact-expand.mjs";

const PROXY_FEATURES = {
  "incident-management": "not-supported",
  "change-problem": "not-supported",
  "service-catalog": "not-supported",
  "infrastructure-monitoring": "not-supported",
  "apm-tracing": "not-supported",
  "log-management": "not-supported",
  "source-control": "not-supported",
  "cicd-actions": "limited",
  "hosting-panel": "not-supported",
  "proxy-network": "supported",
  "itsm-ai": "not-supported",
  "dev-ai": "limited",
  "oncall-paging": "not-supported",
  "enterprise-security": "supported",
  "analytics-reporting": "supported",
};

const API_SCRAPE_FEATURES = {
  ...PROXY_FEATURES,
  "proxy-network": "supported",
  "enterprise-security": "limited",
  "dev-ai": "limited",
};

const ACTOR_FEATURES = {
  ...PROXY_FEATURES,
  "dev-ai": "supported",
  "enterprise-security": "limited",
  "analytics-reporting": "supported",
};

const COMPACT = [
  {
    slug: "oxylabs",
    name: "Oxylabs",
    company: "Oxylabs",
    website: "https://oxylabs.io",
    domain: "oxylabs.io",
    pricingUrl: "https://oxylabs.io/pricing",
    aliases: ["Oxylabs Residential Proxies", "Oxylabs Web Scraper API", "OxyCopilot"],
    membershipRole: "primary",
    jobCluster: "web-data-collection",
    softShortDescription:
      "Enterprise proxy + Web Scraper API — Residential Starter 5GB $30/mo ($6/GB); Web Scraper API from $49/mo; ISO 27001.",
    shortDescription:
      "Oxylabs is an enterprise proxy and web-data platform (residential, datacenter, mobile, ISP, Web Unblocker, Web Scraper API). Residential Starter publishes at 5GB for $30/mo ($6/GB); Basic 20GB $100; Advanced 125GB $500; Corporate 1TB $2,500. Web Scraper API starts from $49/mo. Datacenter proxies offer a free trial. ISO/IEC 27001:2022 certified products. Same web-data-collection cluster as Bright Data — not ITSM, observability, or hosting panels.",
    vendorPositioning:
      "Premium proxies and scraper APIs for large-scale public web data collection.",
    pricingModel: "usage",
    hasFreePlan: false,
    hasFreeTrial: true,
    startingPriceMonthly: 30,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from oxylabs.io/pricing and residential-proxy-pool pricing (high confidence). Residential Starter 5GB $30/mo ($6/GB) is the published self-serve floor; Web Scraper API from $49/mo is a separate product line. GB/commit math still dominates TCO. Affiliate economics excluded.",
    pricingSummary:
      "Residential Starter 5GB $30/mo ($6/GB). Web Scraper API from $49/mo. Datacenter free trial. Confirm live on oxylabs.io/pricing.",
    plans: [
      {
        kind: "flat-monthly",
        slug: "residential-starter",
        name: "Residential Starter (5GB)",
        amount: 30,
        highlighted: true,
        description: "5GB residential at $6/GB — $30 billed monthly; top-up up to 100GB.",
      },
      {
        kind: "flat-monthly",
        slug: "residential-basic",
        name: "Residential Basic (20GB)",
        amount: 100,
        description: "20GB residential at $5/GB — $100 billed monthly.",
      },
      {
        kind: "flat-monthly",
        slug: "web-scraper-api",
        name: "Web Scraper API",
        amount: 49,
        hasFreeTrial: true,
        description: "Managed scraper API — starts from $49/mo on published pricing.",
      },
      {
        kind: "contact-sales",
        slug: "enterprise",
        name: "Enterprise / Corporate",
        description: "Corporate residential 1TB $2,500/mo and custom commits.",
      },
    ],
    featureOverrides: PROXY_FEATURES,
    aiLines: [
      "ITSM AI copilot: not-supported",
      "Developer AI copilot: limited",
      "AI automation: limited",
      "AI recommendations: limited",
    ],
    integrations: [
      { integrationSlug: "python", kind: "native" },
      { integrationSlug: "nodejs", kind: "native" },
      { integrationSlug: "api", kind: "api" },
    ],
    limitations: [
      "Residential Starter $30 is still GB-metered — overages/top-ups change TCO",
      "Some targets are restricted on the residential network (banking, streaming, ticketing, etc.)",
      "Not ITSM, observability, source control, or hosting panel",
      "Web Scraper API and proxy lines are separate SKUs — do not treat one floor as all-in",
      "Compliance / KYC posture must be validated per use case",
    ],
    scores: {
      "ease-of-use": 7,
      "it-job-fit": 9,
      "workflow-depth": 8,
      integrations: 8,
      "admin-security": 8,
      scalability: 8,
      "value-for-money": 7,
      "ai-capabilities": 6,
    },
    scoreRationales: {
      "ease-of-use":
        "Self-serve proxy and scraper-API dashboards are approachable for data engineers; product-line choice is the learning curve. Not a lab test.",
      "it-job-fit":
        "Primary job is enterprise proxy / web-data collection — ranked with Bright Data, not Plesk or Datadog.",
      "workflow-depth":
        "Residential/datacenter/mobile/ISP plus Web Unblocker and Web Scraper API cover a deep collection loop.",
      integrations: "Python/Node/API SDKs and dashboard tooling for scraping stacks.",
      "admin-security":
        "ISO 27001 certification and KYC/trust-center posture are buying reasons vs budget proxy vendors.",
      scalability: "Corporate TB packs and enterprise commits scale; not unlimited free throughput.",
      "value-for-money":
        "Published $30 residential starter is clearer than Bright Data’s ~$499 commit floor — still premium GB pricing. Affiliate economics excluded.",
      "ai-capabilities":
        "OxyCopilot and scraper assist exist — scored as limited assistance, not a reason to skip proxy reliability.",
    },
    bestFor: [
      "Data teams that need enterprise residential/datacenter proxies with published self-serve floors",
      "Buyers who want Web Scraper API and proxy lines from one vendor",
      "Projects that need ISO 27001-certified collection infrastructure",
    ],
    notIdealFor: [
      "Hosting admins buying server panels (Plesk)",
      "Teams that only need Actor marketplace compute (Apify)",
      "Hobby experiments that fit ScraperAPI’s free credit tier",
    ],
    pros: [
      "Published residential Starter $30/mo",
      "Broad proxy + scraper API catalogue",
      "ISO 27001 certified products",
      "Datacenter free trial",
      "Self-serve dashboard",
    ],
    cons: [
      "GB math still dominates TCO",
      "Restricted target list on residential",
      "Not a free-forever proxy plan",
      "Multiple product lines to shortlist",
      "Compliance diligence required",
    ],
    keyFeatures: [
      "Residential / datacenter / mobile / ISP proxies",
      "Web Scraper API",
      "Web Unblocker",
      "Geo-targeting and sticky sessions",
      "ISO 27001 certified products",
    ],
    whoShouldChoose:
      "Choose Oxylabs when enterprise proxy / scraper-API infrastructure with published self-serve floors is the job — not Bright Data by default, and not Plesk.",
    whoShouldConsiderAlternatives:
      "Compare Bright Data for enterprise commit breadth; ScraperAPI for managed API credits; Apify for Actor workflows; ThorData for lower GB entry.",
    alternativeSlugs: ["bright-data", "scraperapi", "apify"],
    competitorSlugs: ["bright-data", "scraperapi", "apify", "thordata"],
    comparableSlugs: ["bright-data", "scraperapi"],
    useCaseSlugs: ["web-data-collection"],
    businessSizeSlugs: ["small-business", "mid-market", "enterprise"],
    teamTypeSlugs: ["operations", "engineering"],
    sourcesExtra: [
      {
        id: "oxylabs-pricing",
        url: "https://oxylabs.io/pricing",
        title: "Oxylabs pricing",
        domains: ["pricing", "plans", "limits"],
      },
      {
        id: "oxylabs-residential-pricing",
        url: "https://oxylabs.io/pricing/residential-proxy-pool",
        title: "Oxylabs Residential Proxies pricing",
        domains: ["pricing", "plans", "limits"],
      },
    ],
  },
  {
    slug: "scraperapi",
    name: "ScraperAPI",
    company: "ScraperAPI",
    website: "https://www.scraperapi.com",
    domain: "scraperapi.com",
    pricingUrl: "https://www.scraperapi.com/pricing/",
    aliases: ["Scraper API", "ScraperAPI Hobby"],
    membershipRole: "primary",
    jobCluster: "web-data-collection",
    softShortDescription:
      "Managed scraping API — Free 1,000 credits; Hobby $49/mo ($44.10 annual); 7-day trial with 5,000 credits.",
    shortDescription:
      "ScraperAPI is a managed web-scraping API that handles proxies, JS rendering, CAPTCHA/anti-bot, and retries behind a credit model. Free plan includes 1,000 API credits (max 5 concurrent). Hobby is $49/mo ($44.10 billed annually) with 100,000 credits and 20 threads. Startup $149, Business $299, Scaling $475, Professional $975, Advanced $1,975, Enterprise custom. 7-day trial with 5,000 credits and no card required. Domain credit multipliers apply (e.g. Amazon 5, Google/Bing 25). Same web-data cluster as Bright Data — different shape (API credits, not GB proxy packs).",
    vendorPositioning:
      "One API for scraping — proxies, rendering, and anti-bot handled for you.",
    pricingModel: "usage",
    hasFreePlan: true,
    hasFreeTrial: true,
    trialDays: 7,
    startingPriceMonthly: 49,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from scraperapi.com/pricing (high confidence). Hobby $49/mo monthly / $44.10 annual. Free 1,000 credits. Trial 5,000 credits / 7 days. Credit multipliers by domain change effective cost. Affiliate economics excluded.",
    pricingSummary:
      "Free 1,000 credits. Hobby from $49/mo ($44.10 annual). 7-day trial 5,000 credits. Confirm live credit multipliers on scraperapi.com/pricing.",
    plans: [
      {
        kind: "free",
        slug: "free",
        name: "Free",
        limits: ["1,000 API credits", "Max 5 concurrent connections"],
        description: "Free plan with 1,000 API credits — no credit card required.",
      },
      {
        kind: "flat-monthly",
        slug: "hobby",
        name: "Hobby",
        amount: 49,
        highlighted: true,
        hasFreeTrial: true,
        trialDays: 7,
        description:
          "$49/mo monthly ($44.10 annual) — 100,000 credits, 20 threads, US & EU geotargeting.",
      },
      {
        kind: "flat-monthly",
        slug: "startup",
        name: "Startup",
        amount: 149,
        description: "$149/mo — 1,000,000 credits, 50 threads.",
      },
      {
        kind: "flat-monthly",
        slug: "scaling",
        name: "Scaling",
        amount: 475,
        description: "$475/mo — 5,000,000 credits, 200 threads, PAYG overage path.",
      },
      {
        kind: "contact-sales",
        slug: "enterprise",
        name: "Enterprise",
        description: "Custom credits, concurrency, and dedicated support.",
      },
    ],
    featureOverrides: API_SCRAPE_FEATURES,
    aiLines: [
      "ITSM AI copilot: not-supported",
      "Developer AI copilot: limited",
      "AI automation: limited",
      "AI recommendations: not-supported",
    ],
    integrations: [
      { integrationSlug: "python", kind: "native" },
      { integrationSlug: "nodejs", kind: "native" },
      { integrationSlug: "api", kind: "api" },
    ],
    limitations: [
      "Domain credit multipliers (Amazon/Google/LinkedIn/bot-bypass) change effective cost vs sticker floors",
      "Unused credits do not roll over",
      "Not a raw residential proxy network like Bright Data / Oxylabs",
      "Not ITSM, observability, git, or hosting panel",
      "Geotargeting is limited on Hobby/Startup (US & EU)",
    ],
    scores: {
      "ease-of-use": 9,
      "it-job-fit": 8,
      "workflow-depth": 7,
      integrations: 8,
      "admin-security": 6,
      scalability: 7,
      "value-for-money": 8,
      "ai-capabilities": 5,
    },
    scoreRationales: {
      "ease-of-use":
        "Single API + credit dashboard is the easiest entry in the cluster for developers. Not a lab test.",
      "it-job-fit":
        "Managed scraping API fits web-data-collection — not a full enterprise proxy estate peer of Bright Data.",
      "workflow-depth":
        "JS rendering, CAPTCHA/anti-bot, crawler access, and DataPipeline cover common scrape loops; less proxy-type depth.",
      integrations: "Language SDKs and HTTP API are enough for most scrape pipelines.",
      "admin-security":
        "SMB/mid-market SaaS posture — weaker published enterprise compliance story than Oxylabs ISO 27001.",
      scalability: "Plans scale to 20M+ credits and Enterprise custom — concurrency caps apply.",
      "value-for-money":
        "Free + $49 Hobby floor is the clearest low-entry path; domain multipliers are the catch. Affiliate economics excluded.",
      "ai-capabilities":
        "No meaningful AI copilot story versus Actor platforms — scored low.",
    },
    bestFor: [
      "Developers who want a managed scrape API without operating proxy pools",
      "Teams that need a free/trial path before commit",
      "Moderate-volume production scraping with published credit tiers",
    ],
    notIdealFor: [
      "Buyers who need raw residential/datacenter proxy control",
      "Enterprises that require ISO 27001-first proxy vendors",
      "Actor marketplace / compute-unit workflows (Apify)",
    ],
    pros: [
      "Free 1,000 credits",
      "Published Hobby $49 floor",
      "7-day trial with 5,000 credits",
      "JS rendering + anti-bot included",
      "Clear credit tiers",
    ],
    cons: [
      "Domain credit multipliers",
      "No credit rollover",
      "Not a full proxy network",
      "Weaker enterprise compliance story",
      "Geotargeting limited on lower plans",
    ],
    keyFeatures: [
      "Managed scraping API",
      "JS rendering",
      "Premium proxy pools",
      "CAPTCHA / anti-bot handling",
      "Domain cost estimator",
    ],
    whoShouldChoose:
      "Choose ScraperAPI when a managed scraping API with credit tiers is the job — not raw proxy GB packs by default.",
    whoShouldConsiderAlternatives:
      "Compare Bright Data or Oxylabs for proxy-network control; Apify for Actor workflows.",
    alternativeSlugs: ["bright-data", "oxylabs", "apify"],
    competitorSlugs: ["bright-data", "oxylabs", "apify", "thordata"],
    comparableSlugs: ["oxylabs", "bright-data"],
    useCaseSlugs: ["web-data-collection"],
    businessSizeSlugs: ["solo", "micro", "small-business", "mid-market"],
    teamTypeSlugs: ["engineering", "operations"],
    sourcesExtra: [
      {
        id: "scraperapi-pricing",
        url: "https://www.scraperapi.com/pricing/",
        title: "ScraperAPI pricing",
        domains: ["pricing", "plans", "free-plan", "free-trial", "limits"],
      },
    ],
  },
  {
    slug: "apify",
    name: "Apify",
    company: "Apify Technologies s.r.o.",
    website: "https://apify.com",
    domain: "apify.com",
    pricingUrl: "https://apify.com/pricing",
    aliases: ["Apify Store", "Apify Actors", "Apify Proxy"],
    membershipRole: "primary",
    jobCluster: "web-data-collection",
    softShortDescription:
      "Actor platform for web scraping — Free $0 ($5 usage); Starter $29/mo ($26 annual); Scale $199; Business $999.",
    shortDescription:
      "Apify is a web-scraping and automation platform built around Actors (ready-made or custom scrapers), compute units, storage, and Apify Proxy. Free includes $5 prepaid usage/month. Starter is $29/mo ($26 annual) with $29 prepaid usage; Scale $199 ($179 annual); Business $999 ($899 annual). Usage beyond prepaid is PAYG (compute units from $0.13–$0.20/CU). Residential proxy from $7–$8/GB depending on plan. Same web-data-collection cluster as Bright Data — different shape (Actor marketplace + compute, not enterprise proxy-first).",
    vendorPositioning:
      "Full-stack web scraping and automation platform — Actors, storage, and proxies.",
    pricingModel: "hybrid",
    hasFreePlan: true,
    hasFreeTrial: false,
    startingPriceMonthly: 29,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from apify.com/pricing (high confidence). Starter $29/mo ($26 annual). Free $5 usage. Prepaid usage does not roll over. Proxy GB and Actor Store pricing are separate line items. Affiliate economics excluded.",
    pricingSummary:
      "Free $5 usage. Starter from $29/mo ($26 annual). Scale $199. Business $999. Confirm live CU and proxy rates on apify.com/pricing.",
    plans: [
      {
        kind: "free",
        slug: "free",
        name: "Free",
        limits: ["$5 prepaid platform usage / month", "Community support"],
        description: "Free plan with $5 prepaid usage — no card required.",
      },
      {
        kind: "flat-monthly",
        slug: "starter",
        name: "Starter",
        amount: 29,
        highlighted: true,
        description:
          "$29/mo ($26 annual) — $29 prepaid usage, chat support, Bronze Store discount.",
      },
      {
        kind: "flat-monthly",
        slug: "scale",
        name: "Scale",
        amount: 199,
        description:
          "$199/mo ($179 annual) — $199 prepaid usage, priority chat, Silver Store discount.",
      },
      {
        kind: "flat-monthly",
        slug: "business",
        name: "Business",
        amount: 999,
        description:
          "$999/mo ($899 annual) — $999 prepaid usage, account manager, Gold Store discount.",
      },
      {
        kind: "contact-sales",
        slug: "enterprise",
        name: "Enterprise",
        description: "Custom scraping solutions, SLAs, and dedicated team.",
      },
    ],
    featureOverrides: ACTOR_FEATURES,
    aiLines: [
      "ITSM AI copilot: not-supported",
      "Developer AI copilot: supported",
      "AI automation: supported",
      "AI recommendations: limited",
    ],
    integrations: [
      { integrationSlug: "python", kind: "native" },
      { integrationSlug: "nodejs", kind: "native" },
      { integrationSlug: "api", kind: "api" },
    ],
    limitations: [
      "Prepaid usage does not roll over — unused credits expire each cycle",
      "Actor Store and proxy GB costs can exceed the plan sticker quickly",
      "Not an enterprise proxy-network-first buy like Bright Data / Oxylabs",
      "Not ITSM, observability, git, or hosting panel",
      "Free plan blocks when prepaid usage is exhausted until next cycle",
    ],
    scores: {
      "ease-of-use": 8,
      "it-job-fit": 8,
      "workflow-depth": 8,
      integrations: 8,
      "admin-security": 7,
      scalability: 7,
      "value-for-money": 8,
      "ai-capabilities": 6,
    },
    scoreRationales: {
      "ease-of-use":
        "Actor Store + console is approachable for developers; CU/proxy cost model is the learning curve. Not a lab test.",
      "it-job-fit":
        "Actor-platform web scraping fits web-data-collection — different primary shape than Bright Data proxy estates.",
      "workflow-depth":
        "Actors, schedules, storage, datasets, and proxy options form a deep scrape/automation loop.",
      integrations: "SDKs, API, and automation connectors (incl. Zapier) for engineering workflows.",
      "admin-security":
        "Business/Enterprise account paths exist; weaker ISO-first story than Oxylabs in public packaging.",
      scalability: "Scale/Business + PAYG CU scales mid-market; enterprise is quote.",
      "value-for-money":
        "Free + $29 Starter is a sharp published floor for Actor work. Affiliate economics excluded.",
      "ai-capabilities":
        "Developer tooling and automation assist — scored as limited/supporting, not an LLM suite.",
    },
    bestFor: [
      "Teams that want ready-made or custom Actors rather than raw proxy ops",
      "Developers who need compute + storage + proxy in one platform",
      "Projects that benefit from Apify Store scrapers",
    ],
    notIdealFor: [
      "Buyers who only need residential GB without an Actor runtime",
      "Hosting panel or ITSM purchases",
      "Enterprises that insist on ISO 27001 proxy-first vendors only",
    ],
    pros: [
      "Free plan with $5 usage",
      "Published Starter $29 floor",
      "Actor Store marketplace",
      "Compute + proxy + storage together",
      "Strong developer docs",
    ],
    cons: [
      "Usage does not roll over",
      "Proxy/Store costs stack on plan fee",
      "Not proxy-network-first",
      "Cost model complexity",
      "Free plan hard-stops on usage",
    ],
    keyFeatures: [
      "Apify Actors and Store",
      "Compute units (CU)",
      "Apify Proxy (residential/datacenter/SERP)",
      "Datasets and storage",
      "Schedules and webhooks",
    ],
    whoShouldChoose:
      "Choose Apify when Actor-based scraping and automation is the job — not Bright Data proxy GB by default.",
    whoShouldConsiderAlternatives:
      "Compare Bright Data or Oxylabs for proxy-network estates; ScraperAPI for a simpler credit API.",
    alternativeSlugs: ["bright-data", "oxylabs", "scraperapi"],
    competitorSlugs: ["bright-data", "oxylabs", "scraperapi", "thordata"],
    comparableSlugs: ["bright-data", "oxylabs"],
    useCaseSlugs: ["web-data-collection"],
    businessSizeSlugs: ["solo", "micro", "small-business", "mid-market", "enterprise"],
    teamTypeSlugs: ["engineering", "operations"],
    sourcesExtra: [
      {
        id: "apify-pricing",
        url: "https://apify.com/pricing",
        title: "Apify pricing",
        domains: ["pricing", "plans", "free-plan", "limits"],
      },
    ],
  },
  {
    slug: "thordata",
    name: "ThorData",
    company: "ThorData",
    website: "https://thordata.com",
    domain: "thordata.com",
    pricingUrl: "https://thordata.com/pricing",
    aliases: ["Thordata", "Thor Data"],
    membershipRole: "primary",
    jobCluster: "web-data-collection",
    softShortDescription:
      "Budget proxy + scraper tooling — Residential from $2/GB (1GB pack); Web Scraper API credit packs from ~$30.",
    shortDescription:
      "ThorData (Thordata) sells residential, datacenter, mobile, and ISP proxies plus Web Scraper API, SERP API, Web Unlocker, and Scraping Browser. Residential packs publish from 1GB at $2.00/GB ($2 total) through volume tiers (e.g. 150GB at $1.00/GB). Mobile from $2.20–$5.00/GB depending on pack. Web Scraper API credit packs from about $30 (30,000 credits). Affiliate programme aff-thordata. Same web-data-collection cluster as Bright Data — budget / SMB entry peer, not the enterprise award path. Identity previously REVIEW_REQUIRED for low-confidence mapping; first-party pricing confirms proxy/scraper product lines.",
    vendorPositioning:
      "Affordable proxy servers and data scraping tools for web data collection.",
    pricingModel: "usage",
    hasFreePlan: false,
    hasFreeTrial: false,
    startingPriceMonthly: 2,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from thordata.com/pricing (high confidence on pack tiles). Residential 1GB $2 entry; volume discounts to ~$0.65–$0.80/GB at high GB. startingPriceMonthly $2 is the smallest residential pack, not a monthly SaaS seat. Affiliate aff-thordata. Affiliate economics excluded from scoring.",
    pricingSummary:
      "Residential from $2/GB (1GB pack). Volume and mobile/API packs on thordata.com/pricing. Confirm live pack math before purchase.",
    plans: [
      {
        kind: "flat-monthly",
        slug: "residential-1gb",
        name: "Residential 1GB",
        amount: 2,
        highlighted: true,
        description: "1GB residential pack at $2.00/GB — $2 total on published pricing.",
      },
      {
        kind: "flat-monthly",
        slug: "residential-50gb",
        name: "Residential 50GB",
        amount: 75,
        description: "50GB residential at $1.50/GB — $75 total.",
      },
      {
        kind: "flat-monthly",
        slug: "web-scraper-api-30k",
        name: "Web Scraper API 30k",
        amount: 30,
        description: "30,000 scraper API credits — about $30 on published pack pricing.",
      },
      {
        kind: "contact-sales",
        slug: "high-volume",
        name: "High-volume residential",
        description: "1000GB+ residential packs (e.g. $0.65–$0.73/GB) on published high-volume tiles.",
      },
    ],
    featureOverrides: {
      ...PROXY_FEATURES,
      "enterprise-security": "limited",
      "analytics-reporting": "limited",
      "dev-ai": "not-supported",
    },
    aiLines: [
      "ITSM AI copilot: not-supported",
      "Developer AI copilot: not-supported",
      "AI automation: not-supported",
      "AI recommendations: not-supported",
    ],
    integrations: [
      { integrationSlug: "api", kind: "api" },
      { integrationSlug: "python", kind: "native" },
    ],
    limitations: [
      "Brand maturity and enterprise compliance story are thinner than Bright Data / Oxylabs",
      "Marketing claims should be validated — score from published packaging, not Fortune-500 slogans",
      "Pack-based GB/credits — not a seat SaaS; small packs are not monthly all-you-can-scrape",
      "Not ITSM, observability, git, or hosting panel",
      "Affiliate programme exists — economics excluded from editorial scores",
    ],
    scores: {
      "ease-of-use": 7,
      "it-job-fit": 8,
      "workflow-depth": 7,
      integrations: 6,
      "admin-security": 6,
      scalability: 7,
      "value-for-money": 8,
      "ai-capabilities": 5,
    },
    scoreRationales: {
      "ease-of-use":
        "Dashboard pack purchase is straightforward; product-line sprawl (proxy/API/browser) is the learning curve. Not a lab test.",
      "it-job-fit":
        "Proxy + scraper API lines fit web-data-collection — budget peer of Bright Data, not a hosting panel.",
      "workflow-depth":
        "Residential/mobile/datacenter plus scraper/SERP/unlocker/browser cover common jobs; less platform depth than Bright Data.",
      integrations: "API-first with lighter published SDK/ecosystem depth than Bright Data or Apify.",
      "admin-security":
        "Limited public enterprise compliance packaging versus Oxylabs ISO 27001.",
      scalability: "High-volume GB packs exist; enterprise SLA story is thinner.",
      "value-for-money":
        "Published $2/GB entry is the cluster’s sharpest pack floor — validate quality/compliance for production. Affiliate economics excluded.",
      "ai-capabilities": "No meaningful AI copilot story — scored low.",
    },
    bestFor: [
      "Teams that need a low published GB entry for proxy experiments",
      "Buyers comparing budget residential packs against Bright Data commits",
      "Projects that will validate quality before scaling volume",
    ],
    notIdealFor: [
      "Enterprises that require ISO 27001-first proxy vendors",
      "Teams that want Actor marketplace compute (Apify)",
      "Hosting or ITSM purchases",
    ],
    pros: [
      "Published residential from $2/GB",
      "Multiple proxy + API product lines",
      "Volume discount tiles",
      "Affiliate programme available",
      "Clear pack pricing pages",
    ],
    cons: [
      "Thinner enterprise brand/compliance story",
      "Quality must be validated in production",
      "Not Actor-platform depth",
      "Marketing claims need skepticism",
      "Small packs are not monthly SaaS seats",
    ],
    keyFeatures: [
      "Residential / datacenter / mobile / ISP proxies",
      "Web Scraper API",
      "SERP API",
      "Web Unlocker",
      "Scraping Browser",
    ],
    whoShouldChoose:
      "Choose ThorData when a budget published proxy/scraper pack is the job — not Bright Data enterprise commits by default.",
    whoShouldConsiderAlternatives:
      "Compare Bright Data or Oxylabs for enterprise proxy estates; ScraperAPI for managed credits; Apify for Actors.",
    alternativeSlugs: ["bright-data", "oxylabs", "scraperapi"],
    competitorSlugs: ["bright-data", "oxylabs", "scraperapi", "apify"],
    comparableSlugs: ["bright-data", "oxylabs"],
    useCaseSlugs: ["web-data-collection"],
    businessSizeSlugs: ["solo", "micro", "small-business", "mid-market"],
    teamTypeSlugs: ["operations", "engineering"],
    catalogueSourceId: "aff-thordata",
    affiliateUrl: "https://affiliate.thordata.com/eu3nfozhzp5f",
    sourcesExtra: [
      {
        id: "thordata-pricing",
        url: "https://thordata.com/pricing",
        title: "ThorData pricing",
        domains: ["pricing", "plans", "limits"],
      },
    ],
  },
];

export const PRODUCTS = COMPACT.map(expandItProduct);

export const COMPARISON_PAIRS = [
  ["oxylabs", "bright-data"],
  ["scraperapi", "bright-data"],
  ["apify", "bright-data"],
  ["thordata", "bright-data"],
  ["oxylabs", "scraperapi"],
  ["apify", "oxylabs"],
];
