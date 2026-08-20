#!/usr/bin/env node
/**
 * Email Marketing Wave-1 products:
 * Primary ESP: GetResponse, AWeber, Campaign Monitor
 * Adjacent (not best-page ESP peers): Bouncer, InboxAlly
 *
 * Usage: node scripts/onboard-email-marketing-batch.mjs
 * Idempotent — overwrites product research / editorial packs.
 *
 * Does NOT auto-publish beyond writing approved editorial JSON.
 * Affiliate economics never enter scores.
 * Grounded in docs/reports/_em-research-*.json (2026-08-17).
 *
 * Schema notes (match SI Priority-2):
 * - Facts: extractedAt/normalizedAt/verifiedAt/approvedAt, isFixture, notes;
 *   evidence = {sourceId, excerpt?, locator?} only.
 * - Enrichment: domainCheckedAt domain→ISO map; limitations with kind;
 *   editorialFit array; AI capability enum; integrations without availability.
 * - Reviews: ProductReviewSchema (alternativeSlugs, comparisonSlugs, string
 *   keyFeatures/limitations, metadata/seo, lastUpdatedAt).
 * - Assessments: methodologySlug email-marketing-editorial v1.0.0, approved,
 *   handsOnTesting false.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const VERIFIED_AT = "2026-08-17T14:00:00.000Z";
const PUBLISHED_AT = "2026-08-17T00:00:00.000Z";

const RELATED_GUIDE_PATHS = [
  "/guides/how-to-choose-email-marketing-software/",
  "/guides/what-is-email-marketing-software/",
  "/best/email-marketing-software/",
];

const DOMAIN_CHECK_KEYS = [
  "identity",
  "pricing",
  "plans",
  "features",
  "product-positioning",
  "ai-capabilities",
  "integrations",
  "free-trial",
  "free-plan",
  "limits",
];

/** Exact criterionSlug values from email-marketing editorialMethodology */
const EM_CRITERIA = [
  "ease-of-use",
  "email-creation",
  "automation",
  "segmentation",
  "analytics",
  "deliverability-tooling",
  "integrations",
  "scalability",
  "value-for-money",
  "ai-capabilities",
];

const EM_FEATURES = [
  "email-campaigns",
  "newsletter-builder",
  "email-templates",
  "drag-drop-editor",
  "automation-workflows",
  "segmentation",
  "personalization",
  "ab-testing",
  "contact-management",
  "landing-pages",
  "forms",
  "transactional-email",
  "analytics",
  "deliverability-tools",
  "ai-content-generation",
];

function contactSalesPlan(slug, name, extra = {}) {
  return {
    id: `plan-${slug}`,
    slug,
    name,
    isFree: false,
    contactSales: true,
    hasFreeTrial: Boolean(extra.hasFreeTrial),
    trialDays: extra.trialDays,
    highlighted: Boolean(extra.highlighted),
    rules: [],
    ...(extra.description ? { description: extra.description } : {}),
    ...(extra.limits ? { limits: extra.limits } : {}),
  };
}

function freePlan(slug = "free", name = "Free", extra = {}) {
  return {
    id: `plan-${slug}`,
    slug,
    name,
    isFree: true,
    contactSales: false,
    hasFreeTrial: false,
    highlighted: Boolean(extra.highlighted),
    rules: [
      {
        kind: "flat",
        amount: 0,
        currency: "USD",
        interval: "month",
        amountPeriod: "month",
      },
    ],
    ...(extra.description ? { description: extra.description } : {}),
    ...(extra.limits ? { limits: extra.limits } : {}),
  };
}

function planFlat(slug, name, monthly, extra = {}) {
  return {
    id: `plan-${slug}`,
    slug,
    name,
    isFree: false,
    contactSales: false,
    hasFreeTrial: Boolean(extra.hasFreeTrial),
    trialDays: extra.trialDays,
    highlighted: Boolean(extra.highlighted),
    rules: [
      {
        kind: "flat",
        amount: monthly,
        currency: "USD",
        interval: "month",
        amountPeriod: "month",
      },
    ],
    ...(extra.description ? { description: extra.description } : {}),
    ...(extra.limits ? { limits: extra.limits } : {}),
  };
}

function planUsageCredits(slug, name, amount, extra = {}) {
  return {
    id: `plan-${slug}`,
    slug,
    name,
    isFree: false,
    contactSales: Boolean(extra.contactSales),
    hasFreeTrial: Boolean(extra.hasFreeTrial),
    highlighted: Boolean(extra.highlighted),
    rules: extra.contactSales
      ? []
      : [
          {
            kind: "flat",
            amount,
            currency: "USD",
            interval: "one-time",
            amountPeriod: "month",
          },
        ],
    ...(extra.description ? { description: extra.description } : {}),
    ...(extra.limits ? { limits: extra.limits } : {}),
  };
}

function comparisonSlugPair(a, b) {
  return [a, b].sort().join("-vs-");
}

/** @type {object[]} */
const PRODUCTS = [
  {
    slug: "getresponse",
    name: "GetResponse",
    company: "GetResponse",
    website: "https://www.getresponse.com",
    domain: "getresponse.com",
    pricingUrl: "https://www.getresponse.com/pricing",
    aliases: ["Get Response"],
    membershipRole: "primary",
    softShortDescription:
      "AI email, automation, landing pages & funnels with a forever-free tier and paid contact-based plans.",
    shortDescription:
      "GetResponse is an AI-driven email marketing and lifecycle automation platform with newsletters, automation workflows, landing pages, funnels, webinars (higher plans), and ecommerce tools. Paid plans use contact-list tiers with unlimited monthly email sends; a forever-free plan and 14-day premium trial are published.",
    vendorPositioning:
      "AI-powered email, automation, and SMS to convert customers and grow repeat revenue — all-in-one owned-channel marketing for entrepreneurs, ecommerce, and brands (claims 350k+ customers, 99% deliverability across 160+ countries).",
    pricingModel: "freemium",
    hasFreePlan: true,
    hasFreeTrial: true,
    trialDays: 14,
    startingPriceMonthly: 19,
    pricingNotes:
      "Verified 2026-08-17 from getresponse.com/pricing and /pricing/free. Paid Starter/Marketer/Creator priced by list size (published packages: 1k, 2.5k, 5k, 10k, 25k, 50k, 100k). Monthly floors at ~1,000 contacts: Starter $19/mo, Marketer $59/mo, Creator $69/mo; annual ~18% off ($15.58 / $48.38 / $56.58). Unlimited monthly sends on paid plans. Free forever: up to 500 contacts, 2,500 newsletters/mo, 1 landing page (post-trial limits). 14-day premium feature trial on Free signup (no credit card). Enterprise: custom quote / book a demo; 30-day Enterprise Pilot via demo. Taxes may apply.",
    fixturePlans: [
      "PLAN free: name=Free; isFree=true; maxContacts=500; maxNewslettersMonthly=2500",
      "PLAN starter: name=Starter; amount=19; currency=USD; interval=month; entryBand=~1000 contacts; unlimited sends",
      "PLAN marketer: name=Marketer; amount=59; currency=USD; interval=month; entryBand=~1000 contacts",
      "PLAN creator: name=Creator; amount=69; currency=USD; interval=month; entryBand=~1000 contacts",
      "PLAN enterprise: name=Enterprise; contactSales=true",
    ],
    enrichmentPlans: [
      freePlan("free", "Free", {
        limits: { maxContacts: 500, maxEmailSendsMonthly: 2500 },
        description:
          "Forever free up to 500 contacts / 2,500 newsletters/mo; 1 landing page post-trial.",
      }),
      planFlat("starter", "Starter", 19, {
        hasFreeTrial: true,
        trialDays: 14,
        limits: { includedContactsEntry: 1000 },
        description:
          "Entry list price at ~1,000 contacts; scales by list-size packages. Unlimited monthly sends.",
      }),
      planFlat("marketer", "Marketer", 59, {
        hasFreeTrial: true,
        trialDays: 14,
        highlighted: true,
        limits: { includedContactsEntry: 1000 },
        description:
          "Automation/ecommerce-oriented mid tier; entry ~1,000 contacts. Unlimited sends.",
      }),
      planFlat("creator", "Creator", 69, {
        hasFreeTrial: true,
        trialDays: 14,
        limits: { includedContactsEntry: 1000 },
        description:
          "Creator tier with webinars/courses; entry ~1,000 contacts. Unlimited sends.",
      }),
      contactSalesPlan("enterprise", "Enterprise", {
        description: "Custom quote / demo; Enterprise Pilot available via sales.",
      }),
    ],
    featureOverrides: {
      "email-campaigns": "supported",
      "newsletter-builder": "supported",
      "email-templates": "supported",
      "drag-drop-editor": "supported",
      "automation-workflows": "supported",
      segmentation: "supported",
      personalization: "supported",
      "ab-testing": "supported",
      "contact-management": "supported",
      "landing-pages": "supported",
      forms: "supported",
      "transactional-email": "limited",
      analytics: "supported",
      "deliverability-tools": "supported",
      "ai-content-generation": "supported",
    },
    aiLines: [
      "AI email-generation: supported",
      "AI assistant: supported",
      "AI automation: limited",
      "AI recommendations: limited",
    ],
    integrations: [
      { integrationSlug: "shopify", kind: "native" },
      { integrationSlug: "woocommerce", kind: "native" },
      { integrationSlug: "wordpress", kind: "native" },
      { integrationSlug: "hubspot", kind: "zapier-style" },
      { integrationSlug: "salesforce", kind: "zapier-style" },
    ],
    limitations: [
      "Starter limited to 1 custom automation workflow and capped AI generator uses",
      "Free plan heavily limited after 14-day premium window (branding, LP visits, automation filters)",
      "SMS, dedicated IP/domain, and some enterprise tools require Enterprise",
      "Full contact-band price table beyond headline floors requires plan/list selector on site",
      "Not a full sales CRM — email/automation center of gravity",
    ],
    limitationKinds: [
      "plan-restriction",
      "usage-cap",
      "requires-add-on",
      "other",
      "feature-unavailable",
    ],
    scores: {
      "ease-of-use": 8,
      "email-creation": 8,
      automation: 8,
      segmentation: 7,
      analytics: 7,
      "deliverability-tooling": 7,
      integrations: 7,
      scalability: 8,
      "value-for-money": 8,
      "ai-capabilities": 7,
    },
    scoreRationales: {
      "ease-of-use":
        "GetResponse positions an approachable all-in-one SMB workspace (campaigns, automation, landing pages). Learning curve rises on Marketer/Creator feature depth, but Free/Starter onboarding is comparatively self-serve.",
      "email-creation":
        "First-party campaign, newsletter, template, and drag-and-drop editor surfaces are core product jobs — strong email composition for SMB/ecommerce senders.",
      automation:
        "Marketing automation workflows are a documented strength on paid tiers; Starter’s single custom automation and Free-tier filters are real plan gates, so score reflects Marketer+ depth rather than Free/Starter alone.",
      segmentation:
        "List and behavioral segmentation are supported across the platform story; depth is solid for SMB lifecycle email, not enterprise CDP-class audiences.",
      analytics:
        "Campaign and automation reporting are first-party documented; deeper ecommerce attribution varies by plan and stack.",
      "deliverability-tooling":
        "Vendor claims strong deliverability and authentication guidance; tooling is present but not a specialist deliverability suite like InboxAlly/Bouncer Kit.",
      integrations:
        "Ecommerce and common marketing connectors are documented; CRM depth is secondary to owned-channel email/automation.",
      scalability:
        "Published contact packages scale to 100k with Enterprise above — strong for growing lists with unlimited paid sends.",
      "value-for-money":
        "Forever-free rung plus Starter from $19/mo at ~1k contacts is competitive versus peers that start higher or lack a free plan — score reflects published floors, not affiliate terms.",
      "ai-capabilities":
        "AI content/generation assistance is marketed across the product; Starter AI use caps keep the score below unconstrained AI suites.",
    },
    bestFor: [
      "SMBs wanting email + automation + landing pages in one stack",
      "Ecommerce needing cart recovery and promo tools (Marketer+)",
      "Creators monetizing courses/webinars/newsletters (Creator)",
      "Teams starting on a forever-free plan before upgrading",
    ],
    notIdealFor: [
      "Buyers who only need a simple newsletter with no automation/landing-page bundle",
      "Enterprises needing SSO/dedicated IP without moving to Enterprise quote",
      "Teams that require unlimited AI generator uses on the cheapest paid tier (Starter AI capped)",
    ],
    pros: [
      "Forever-free plan plus competitive paid contact-tier floors",
      "Automation, landing pages, and funnels bundled with email",
      "Unlimited monthly sends on paid plans",
      "AI-assisted content tools on the product roadmap/story",
      "Ecommerce-oriented Marketer features for cart/promo workflows",
    ],
    cons: [
      "Starter automation and AI caps push serious workflows up-tier",
      "Free plan becomes constrained after the premium trial window",
      "Enterprise features (SMS, dedicated IP) require sales packaging",
      "Full list-size price matrix needs live selector confirmation",
      "Not a full CRM system of record",
    ],
    keyFeatures: [
      "Email campaigns and newsletter builder",
      "Marketing automation workflows",
      "Landing pages and funnels",
      "Contact-tier pricing with unlimited paid sends",
      "AI content assistance and ecommerce tools (higher plans)",
    ],
    pricingSummary:
      "Free forever (500 contacts / 2,500 newsletters/mo). Paid Starter/Marketer/Creator from $19 / $59 / $69/mo at ~1,000 contacts (annual ~18% off). Unlimited sends on paid plans. Enterprise custom quote. 14-day premium trial on Free signup.",
    whoShouldChoose:
      "Choose GetResponse when you want an all-in-one email + automation + landing-page stack with a free entry rung and clear published contact-tier floors.",
    whoShouldConsiderAlternatives:
      "Compare Mailchimp for broader brand recognition/freemium, ActiveCampaign for deeper marketing automation + CRM, AWeber for simpler creator email, and Campaign Monitor for design-led agency email.",
    alternativeSlugs: [
      "mailchimp",
      "activecampaign",
      "aweber",
      "campaign-monitor",
    ],
    competitorSlugs: [
      "mailchimp",
      "activecampaign",
      "aweber",
      "campaign-monitor",
      "klaviyo",
      "hubspot",
    ],
    comparableSlugs: ["mailchimp", "aweber", "campaign-monitor"],
    secondaryCategorySlugs: ["marketing"],
    subcategorySlugs: [],
    useCaseSlugs: [
      "newsletters",
      "marketing-automation",
      "ecommerce-email",
      "lead-nurturing",
      "small-business-campaigns",
    ],
    teamTypeSlugs: ["marketing", "founders"],
    businessSizeSlugs: ["micro", "small-business", "mid-market"],
    officialVideos: [],
    sourcesExtra: [
      {
        id: "getresponse-pricing-free",
        url: "https://www.getresponse.com/pricing/free",
        title: "GetResponse Free Plan",
        domains: ["pricing", "free-plan", "limits"],
      },
    ],
  },
  {
    slug: "aweber",
    name: "AWeber",
    company: "AWeber Systems, Inc.",
    website: "https://www.aweber.com",
    domain: "aweber.com",
    pricingUrl: "https://www.aweber.com/pricing.htm",
    aliases: ["A Weber"],
    membershipRole: "primary",
    softShortDescription:
      "Creator- and SMB-focused email marketing with free forever, Lite/Plus tiers, and landing pages.",
    shortDescription:
      "AWeber is an email marketing and automation platform aimed at small businesses and creators, with newsletters, autoresponders/automations, landing pages, signup forms, ecommerce selling tools, and analytics. Pricing is subscriber-tiered; Free forever and 14-day paid-plan trials are published.",
    vendorPositioning:
      "Powerfully simple email marketing and automation to connect, automate, and sell — positioned for small businesses and creators (long-running ESP; homepage emphasizes ease and free start).",
    pricingModel: "freemium",
    hasFreePlan: true,
    hasFreeTrial: true,
    trialDays: 14,
    startingPriceMonthly: 15,
    pricingNotes:
      "Verified 2026-08-17 from aweber.com/pricing.htm and docs.aweber.com pricing help. Free: lifetime, up to 500 subscribers and 3,000 emails/mo (docs). Lite: from $15/mo monthly or ~$12.49–$12.50/mo billed annually at 500 subs (10× send cap). Plus: from $30/mo monthly or ~$19.99–$20/mo billed annually at 500 subs (12× send cap). Done For You: expert setup add-on marketed with Plus + setup fee (promo pricing on site). Unlimited: flat $899/mo (docs). 100,000+ subscribers: contact sales. Paid Lite/Plus: 14-day free trial. Limited-time setup promos appear on marketing pages — treat promo fees as non-evergreen.",
    fixturePlans: [
      "PLAN free: name=Free; isFree=true; maxSubscribers=500; maxEmailsMonthly=3000",
      "PLAN lite: name=Lite; amount=15; currency=USD; interval=month; entryBand=500 subs; sendCap=10x",
      "PLAN plus: name=Plus; amount=30; currency=USD; interval=month; entryBand=500 subs; sendCap=12x",
      "PLAN unlimited: name=Unlimited; amount=899; currency=USD; interval=month",
      "PLAN large-account: name=Large account (100k+); contactSales=true",
    ],
    enrichmentPlans: [
      freePlan("free", "Free", {
        limits: { maxContacts: 500, maxEmailSendsMonthly: 3000 },
        description:
          "Lifetime free up to 500 subscribers / 3,000 emails/mo (official docs).",
      }),
      planFlat("lite", "Lite", 15, {
        hasFreeTrial: true,
        trialDays: 14,
        limits: { includedContactsEntry: 500 },
        description:
          "From $15/mo at 500 subscribers (annual ~$12.50/mo). 10× subscriber monthly send volume.",
      }),
      planFlat("plus", "Plus", 30, {
        hasFreeTrial: true,
        trialDays: 14,
        highlighted: true,
        limits: { includedContactsEntry: 500 },
        description:
          "From $30/mo at 500 subscribers (annual ~$20/mo). 12× send volume; higher list/LP/automation caps than Lite.",
      }),
      planFlat("unlimited", "Unlimited", 899, {
        description:
          "Flat $899/mo Unlimited subscribers per docs; up to 15× monthly sends per subscriber.",
      }),
      contactSalesPlan("large-account", "Large account (100k+)", {
        description: "100,000+ subscribers — contact sales / large-account pricing.",
      }),
    ],
    featureOverrides: {
      "email-campaigns": "supported",
      "newsletter-builder": "supported",
      "email-templates": "supported",
      "drag-drop-editor": "supported",
      "automation-workflows": "supported",
      segmentation: "supported",
      personalization: "supported",
      "ab-testing": "supported",
      "contact-management": "supported",
      "landing-pages": "supported",
      forms: "supported",
      "transactional-email": "limited",
      analytics: "supported",
      "deliverability-tools": "supported",
      "ai-content-generation": "limited",
    },
    aiLines: [
      "AI email-generation: limited",
      "AI assistant: limited",
      "AI automation: limited",
    ],
    integrations: [
      { integrationSlug: "wordpress", kind: "native" },
      { integrationSlug: "shopify", kind: "native" },
      { integrationSlug: "stripe", kind: "native" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    limitations: [
      "Free: 1 list, limited automations/landing pages, AWeber branding, hard 500-sub / 3k-send caps",
      "Lite caps lists, LPs, automations, users, and segments vs Plus",
      "Marketing pricing page emphasizes Lite/Plus/Done For You; Unlimited details live primarily in docs",
      "Promo setup fees and 'months free' offers are time-limited — verify live checkout",
      "Less suited to complex B2B multi-product marketing automation / CRM-heavy stacks",
    ],
    limitationKinds: [
      "usage-cap",
      "plan-restriction",
      "other",
      "other",
      "feature-unavailable",
    ],
    scores: {
      "ease-of-use": 8,
      "email-creation": 7,
      automation: 6,
      segmentation: 6,
      analytics: 6,
      "deliverability-tooling": 7,
      integrations: 6,
      scalability: 6,
      "value-for-money": 8,
      "ai-capabilities": 5,
    },
    scoreRationales: {
      "ease-of-use":
        "AWeber’s long-running positioning is powerfully simple email for creators and SMBs — strong daily usability, less enterprise admin surface.",
      "email-creation":
        "Solid newsletter/campaign builders and templates for SMB/creator sends; design depth is competitive but not Campaign Monitor’s primary brand story.",
      automation:
        "Autoresponders and automations exist, with Lite/Free plan caps; depth trails ActiveCampaign-class marketing automation.",
      segmentation:
        "Subscriber segmentation is available; Lite segment/list caps and Free-tier limits hold the score to moderate.",
      analytics:
        "Campaign analytics cover opens/clicks and core performance; not a deep BI/ecommerce analytics suite.",
      "deliverability-tooling":
        "Established ESP deliverability practices and authentication guidance; not a specialist reputation-repair product.",
      integrations:
        "Creator/ecommerce connectors are documented; ecosystem breadth is narrower than Mailchimp/HubSpot-class stacks.",
      scalability:
        "Subscriber tiers scale, with Unlimited and 100k+ sales paths, but send multipliers and Lite caps constrain high-volume senders.",
      "value-for-money":
        "Free forever plus Lite from $15/mo at 500 subs is strong published value for creators/SMBs — promo setup fees excluded from the score.",
      "ai-capabilities":
        "Some AI signup-form / content assistance appears in vendor content; not the category’s deepest AI automation story.",
    },
    bestFor: [
      "Creators and solopreneurs needing email + landing pages + basic funnels",
      "Teams wanting a free forever starter with phone/chat support culture",
      "Users who prefer subscriber-based plans with explicit monthly send multipliers",
    ],
    notIdealFor: [
      "Complex B2B multi-product marketing automation / CRM-heavy stacks",
      "High-volume ecommerce needing deep product/catalog automation comparable to Klaviyo",
      "Buyers who dislike vendor branding on Free-tier messages",
    ],
    pros: [
      "Forever-free plan with published subscriber/send caps",
      "Approachable Lite/Plus pricing for creators and SMBs",
      "Landing pages, forms, and ecommerce selling tools bundled",
      "Long-running ESP reputation and support culture",
      "Clear send multipliers on Lite/Plus",
    ],
    cons: [
      "Free and Lite feature/list caps constrain growing programs",
      "Automation depth trails dedicated marketing-automation platforms",
      "AI assistance is limited versus AI-forward ESPs",
      "Promo setup fees are time-limited — verify checkout",
      "Not ideal for complex B2B CRM-centric stacks",
    ],
    keyFeatures: [
      "Newsletters and email campaigns",
      "Autoresponders and automations",
      "Landing pages and signup forms",
      "Subscriber-tier Free / Lite / Plus pricing",
      "Creator-oriented ecommerce selling tools",
    ],
    pricingSummary:
      "Free forever (500 subscribers / 3,000 emails/mo). Lite from $15/mo and Plus from $30/mo at 500 subscribers (annual lower). Unlimited $899/mo. 100k+ contact sales. 14-day trial on paid Lite/Plus.",
    whoShouldChoose:
      "Choose AWeber when you want simple creator/SMB email with a free forever rung and straightforward Lite/Plus subscriber pricing.",
    whoShouldConsiderAlternatives:
      "Compare GetResponse for deeper automation/landing-page bundling, Mailchimp for broader ecosystem freemium, Campaign Monitor for design-led email, and ActiveCampaign for automation+CRM depth.",
    alternativeSlugs: [
      "getresponse",
      "mailchimp",
      "campaign-monitor",
      "activecampaign",
    ],
    competitorSlugs: [
      "mailchimp",
      "getresponse",
      "campaign-monitor",
      "activecampaign",
      "klaviyo",
      "hubspot",
    ],
    comparableSlugs: ["getresponse", "mailchimp", "campaign-monitor"],
    secondaryCategorySlugs: ["marketing"],
    subcategorySlugs: [],
    useCaseSlugs: [
      "newsletters",
      "small-business-campaigns",
      "lead-nurturing",
      "ecommerce-email",
    ],
    teamTypeSlugs: ["marketing", "founders"],
    businessSizeSlugs: ["micro", "small-business"],
    officialVideos: [
      {
        videoId: "rdUpyHxG9PA",
        title:
          "AI Sign-Up Form Builder: Personality Quiz, Postcard Flip, and a Playable Game / The Shift AI Show",
        channel: "AWeber (The Shift AI Show)",
        shows: [
          "Product demo of AWeber AI signup-form builder",
          "Interactive form experiences inside AWeber",
        ],
        features: [
          "ai-content-generation",
          "contact-management",
          "landing-pages",
        ],
      },
    ],
    sourcesExtra: [
      {
        id: "aweber-pricing-docs",
        url: "https://docs.aweber.com/getting-started-with-aweber/aweber-information/how-much-does-aweber-cost",
        title: "AWeber Pricing Docs",
        domains: ["pricing", "plans", "free-plan", "limits"],
      },
    ],
  },
  {
    slug: "campaign-monitor",
    name: "Campaign Monitor",
    company: "Marigold (Campaign Monitor by Marigold)",
    website: "https://www.campaignmonitor.com",
    domain: "campaignmonitor.com",
    pricingUrl: "https://www.campaignmonitor.com/pricing/",
    aliases: ["CampaignMonitor", "Marigold Campaign Monitor"],
    membershipRole: "primary",
    softShortDescription:
      "Design-led email marketing by Marigold with contact-tier Lite, Essentials, Premier, and Enterprise.",
    shortDescription:
      "Campaign Monitor (by Marigold) is a design-focused email marketing platform with drag-and-drop building, templates, segmentation, automation/journeys, AI writing/boost tools, analytics, and agency/multi-account features. Pricing is contact-tiered across Lite, Essentials, Premier, plus custom Enterprise; free trial is offered (no forever free plan published).",
    vendorPositioning:
      "Smarter email for a better bottom line — simple, powerful email for businesses and agencies; Marigold positions Campaign Monitor as the self-serve SMB/agency email product in its loyalty suite.",
    pricingModel: "subscription",
    hasFreePlan: false,
    hasFreeTrial: true,
    trialDays: 30,
    startingPriceMonthly: 13,
    pricingNotes:
      "Verified 2026-08-17 from campaignmonitor.com/pricing. Plans: Free trial / Lite / Essentials / Premier / Enterprise. Contact bands on page: 0–500, 501–2,500, …, 50,001+. For 0–500 contacts, official page shows ~10% annual discount figures consistent with monthly floors Lite $13, Essentials $31 (explicit 'then $31/month' copy), Premier $171; annual effective ≈ $11.70 / $27.90 / $153.90. Lite: capped sends (~5× / 2,500 at 500 contacts). Essentials/Premier: unlimited sends. Website Builder add-on $10/mo on lower tiers. Enterprise: contact sales (GDPR/SOC2, custom DPA, invoice/PO). 30-day free trial documented (500 contacts / 500 emails on trial comparison). No forever-free plan on pricing page.",
    fixturePlans: [
      "PLAN lite: name=Lite; amount=13; currency=USD; interval=month; entryBand=0-500; sendCap~2500",
      "PLAN essentials: name=Essentials; amount=31; currency=USD; interval=month; unlimited sends",
      "PLAN premier: name=Premier; amount=171; currency=USD; interval=month; unlimited sends",
      "PLAN enterprise: name=Enterprise; contactSales=true",
    ],
    enrichmentPlans: [
      planFlat("lite", "Lite", 13, {
        hasFreeTrial: true,
        trialDays: 30,
        limits: {
          includedContactsEntry: 500,
          maxEmailSendsMonthly: 2500,
        },
        description:
          "From $13/mo at 0–500 contacts; send volume capped (~2,500 at lowest band).",
      }),
      planFlat("essentials", "Essentials", 31, {
        hasFreeTrial: true,
        trialDays: 30,
        highlighted: true,
        limits: { includedContactsEntry: 500 },
        description:
          "From $31/mo at 0–500 contacts; unlimited monthly email sends.",
      }),
      planFlat("premier", "Premier", 171, {
        hasFreeTrial: true,
        trialDays: 30,
        limits: { includedContactsEntry: 500 },
        description:
          "From $171/mo at 0–500 contacts; unlimited sends; premier support features.",
      }),
      contactSalesPlan("enterprise", "Enterprise", {
        description:
          "Custom — large lists / security / billing; contact sales (50,001+ bands also push sales).",
      }),
    ],
    featureOverrides: {
      "email-campaigns": "supported",
      "newsletter-builder": "supported",
      "email-templates": "supported",
      "drag-drop-editor": "supported",
      "automation-workflows": "supported",
      segmentation: "supported",
      personalization: "supported",
      "ab-testing": "supported",
      "contact-management": "supported",
      "landing-pages": "limited",
      forms: "limited",
      "transactional-email": "limited",
      analytics: "supported",
      "deliverability-tools": "supported",
      "ai-content-generation": "supported",
    },
    aiLines: [
      "AI email-generation: supported",
      "AI recommendations: limited",
      "AI assistant: limited",
    ],
    integrations: [
      { integrationSlug: "shopify", kind: "native" },
      { integrationSlug: "salesforce", kind: "native" },
      { integrationSlug: "wordpress", kind: "native" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    limitations: [
      "No forever free plan — trial only",
      "Lite monthly send caps force upgrades for frequent senders",
      "Premier jump is large vs Essentials at the same contact band",
      "Some advanced features / website builder may be add-ons or higher-tier only",
      "Price rises sharply with contact band; 50,001+ often requires sales",
    ],
    limitationKinds: [
      "feature-unavailable",
      "usage-cap",
      "high-cost-at-scale",
      "requires-add-on",
      "plan-restriction",
    ],
    scores: {
      "ease-of-use": 8,
      "email-creation": 9,
      automation: 6,
      segmentation: 7,
      analytics: 7,
      "deliverability-tooling": 7,
      integrations: 7,
      scalability: 7,
      "value-for-money": 6,
      "ai-capabilities": 6,
    },
    scoreRationales: {
      "ease-of-use":
        "Campaign Monitor emphasizes simple, powerful email for businesses and agencies — approachable builder UX with agency/multi-account complexity on higher plans.",
      "email-creation":
        "Design-led templates and drag-and-drop building are the product’s clearest first-party strength versus automation-first peers.",
      automation:
        "Journeys/automation exist, but the center of gravity is design-quality email rather than ActiveCampaign-depth marketing automation.",
      segmentation:
        "Lists and segments are first-class for campaign targeting; solid for SMB/agency email programs.",
      analytics:
        "Campaign analytics and benchmarks are documented; AI boost/insights appear on the product story without being a full BI suite.",
      "deliverability-tooling":
        "Standard ESP authentication and deliverability support; not a specialist reputation-repair tool.",
      integrations:
        "Ecommerce/CRM connectors and agency tooling are documented; ecosystem is competitive for SMB/agency email.",
      scalability:
        "Contact bands scale with Enterprise/sales paths above large lists; Lite send caps constrain frequent senders until Essentials+.",
      "value-for-money":
        "No forever free plan and a steep Premier jump vs Essentials hold the score moderate despite Lite’s low entry floor.",
      "ai-capabilities":
        "AI writer/booster tools are marketed; useful but not the primary buying reason versus design quality.",
    },
    bestFor: [
      "Brand-conscious teams prioritizing email design/templates",
      "Agencies needing client/subaccount tooling (higher plans)",
      "Marketers wanting AI writer/booster and benchmarked campaign insights",
    ],
    notIdealFor: [
      "Buyers needing a forever-free ESP",
      "Cost-sensitive senders who outgrow Lite’s send cap but find Essentials/Premier steep",
      "Teams needing a full marketing CRM (sales pipeline) rather than email-first",
    ],
    pros: [
      "Design-led email creation and templates",
      "Clear Lite / Essentials / Premier contact-tier packaging",
      "Unlimited sends on Essentials and Premier",
      "Agency/multi-account features on higher plans",
      "Official product overview video available",
    ],
    cons: [
      "No forever-free plan",
      "Lite send caps push frequent senders up-tier",
      "Premier pricing jump is large at the same contact band",
      "Automation depth trails dedicated marketing-automation platforms",
      "Website Builder and some features may be add-ons",
    ],
    keyFeatures: [
      "Design-focused drag-and-drop email builder",
      "Templates and personalization",
      "Segmentation and journeys/automation",
      "AI writing/boost tools",
      "Agency and analytics features on higher plans",
    ],
    pricingSummary:
      "No forever free plan. 30-day trial. Lite from $13/mo, Essentials from $31/mo, Premier from $171/mo at 0–500 contacts (annual ~10% off). Lite send-capped; Essentials/Premier unlimited sends. Enterprise contact sales.",
    whoShouldChoose:
      "Choose Campaign Monitor when email design quality and agency-friendly packaging matter more than forever-free entry or deepest automation.",
    whoShouldConsiderAlternatives:
      "Compare Mailchimp or GetResponse for freemium entry, AWeber for simpler creator email, and ActiveCampaign for deeper automation + CRM.",
    alternativeSlugs: [
      "mailchimp",
      "getresponse",
      "aweber",
      "activecampaign",
    ],
    competitorSlugs: [
      "mailchimp",
      "getresponse",
      "aweber",
      "activecampaign",
      "klaviyo",
      "hubspot",
    ],
    comparableSlugs: ["mailchimp", "getresponse", "aweber"],
    secondaryCategorySlugs: ["marketing"],
    subcategorySlugs: [],
    useCaseSlugs: [
      "newsletters",
      "small-business-campaigns",
      "marketing-automation",
      "lead-nurturing",
    ],
    teamTypeSlugs: ["marketing", "founders"],
    businessSizeSlugs: ["small-business", "mid-market"],
    officialVideos: [
      {
        videoId: "0hMDzGuc6WY",
        title: "Email Marketing Solutions | Campaign Monitor Product Overview",
        channel: "Campaign Monitor (@TryCampaignMonitor)",
        shows: [
          "Official product walkthrough: lists/segments",
          "Campaign builder, personalization, scheduling, analytics",
        ],
        features: [
          "email-campaigns",
          "newsletter-builder",
          "email-templates",
          "segmentation",
          "automation-workflows",
          "analytics",
          "deliverability-tools",
        ],
      },
    ],
    sourcesExtra: [
      {
        id: "campaign-monitor-marigold",
        url: "https://meetmarigold.com/",
        title: "Marigold",
        domains: ["product-positioning", "identity"],
      },
    ],
  },
  {
    slug: "bouncer",
    name: "Bouncer",
    company: "Bouncer (UseBouncer)",
    website: "https://www.usebouncer.com",
    domain: "usebouncer.com",
    pricingUrl: "https://www.usebouncer.com/pricing/",
    aliases: ["UseBouncer", "Bouncer email verification"],
    membershipRole: "adjacent",
    adjacentNote:
      "Email verification / list hygiene — adjacent to email marketing, not a core campaign ESP. Do not rank as an ESP peer on best email-marketing pages.",
    softShortDescription:
      "Email verification and list hygiene platform for cleaner sends and stronger sender reputation.",
    shortDescription:
      "Bouncer verifies email addresses via app and API, with optional real-time form protection (Shield), toxicity checks, and a Deliverability Kit for inbox placement and authentication testing.",
    vendorPositioning:
      "Powerful, secure, and caring email verification — improve data quality, email marketing ROI, protect sign-up forms, and protect sender reputation.",
    pricingModel: "usage",
    hasFreePlan: false,
    hasFreeTrial: true,
    startingPriceMonthly: 8,
    pricingNotes:
      "100 free verification credits to start; no credit card required to start. Credits never expire. Official FAQ: not charged for duplicate addresses within a list or for 'unknown' results. Volume discounts on credit packs. Verification packs from $8 (1,000 credits) to $2,000 (1M) with custom above. Deliverability Kit from $25/mo Starter. Shield from ~$2/mo at 1,000 monthly checks.",
    fixturePlans: [
      "PLAN verify-1k: name=Email Verification 1,000 credits; one-time=$8",
      "PLAN verify-10k: name=Email Verification 10,000 credits; one-time=$60",
      "PLAN deliverability-starter: name=Deliverability Kit Starter; amount=25; interval=month",
      "PLAN deliverability-standard: name=Deliverability Kit Standard; amount=125; interval=month",
      "PLAN shield-example: name=Bouncer Shield; from≈$2/mo at 1k checks",
    ],
    enrichmentPlans: [
      planUsageCredits("verify-1k", "Email Verification — 1,000 credits", 8, {
        highlighted: true,
        description: "Minimum purchase 1,000 credits; pay-as-you-go; credits never expire.",
        limits: { credits: 1000 },
      }),
      planUsageCredits("verify-10k", "Email Verification — 10,000 credits", 60, {
        description: "Pay-as-you-go credit pack.",
        limits: { credits: 10000 },
      }),
      planFlat("deliverability-starter", "Deliverability Kit — Starter", 25, {
        description: "250 test emails; 10 IPs/domains monitored.",
        limits: { testEmails: 250, monitoredIpsDomains: 10 },
      }),
      planFlat("deliverability-standard", "Deliverability Kit — Standard", 125, {
        description: "1,000 test emails; 25 IPs/domains monitored.",
        limits: { testEmails: 1000, monitoredIpsDomains: 25 },
      }),
      contactSalesPlan("verify-enterprise", "Email Verification — 1M+", {
        description: "Custom volume verification pricing.",
      }),
    ],
    featureOverrides: {
      "email-campaigns": "not-supported",
      "newsletter-builder": "not-supported",
      "email-templates": "not-supported",
      "drag-drop-editor": "not-supported",
      "automation-workflows": "not-supported",
      segmentation: "not-supported",
      personalization: "not-supported",
      "ab-testing": "not-supported",
      "contact-management": "limited",
      "landing-pages": "not-supported",
      forms: "limited",
      "transactional-email": "not-supported",
      analytics: "limited",
      "deliverability-tools": "supported",
      "ai-content-generation": "not-supported",
    },
    aiLines: ["AI assistant: not-supported", "AI automation: not-supported"],
    integrations: [
      { integrationSlug: "mailchimp", kind: "native" },
      { integrationSlug: "hubspot", kind: "native" },
      { integrationSlug: "activecampaign", kind: "native" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    limitations: [
      "Not an email sending or campaign tool",
      "Core verification is credit-based (not a single flat unlimited plan)",
      "Catch-all / unknown results still require judgment even with deep verification claims",
      "ESP comparison criteria (creation/automation) do not apply — adjacent hygiene tool",
      "Deliverability Kit and Shield are separate paid products from verification credits",
    ],
    limitationKinds: [
      "feature-unavailable",
      "usage-cap",
      "other",
      "feature-unavailable",
      "requires-add-on",
    ],
    scores: {
      "ease-of-use": 7,
      "email-creation": 1,
      automation: 1,
      segmentation: 1,
      analytics: 4,
      "deliverability-tooling": 8,
      integrations: 7,
      scalability: 8,
      "value-for-money": 7,
      "ai-capabilities": 1,
    },
    scoreRationales: {
      "ease-of-use":
        "Verification app/API and credit packs are straightforward for list hygiene workflows; Shield/Kit add moderate setup.",
      "email-creation":
        "Not an ESP — no campaign/newsletter builder. Score intentionally near-floor so adjacent tools are not ranked as email peers.",
      automation:
        "Not a marketing-automation platform. Adjacent verification/API workflows only.",
      segmentation:
        "No list-building/segmentation ESP features — verification of existing lists only.",
      analytics:
        "Verification results, toxicity, and Deliverability Kit reporting exist; not campaign analytics.",
      "deliverability-tooling":
        "Core strength: verification, Shield form protection, and Deliverability Kit (inbox placement, auth testing).",
      integrations:
        "Marketing platform connectors and API are first-party strengths for plugging into ESP stacks.",
      scalability:
        "Credit packs scale to 1M+ with custom volume; designed for high-volume list hygiene.",
      "value-for-money":
        "Published credit packs from $8/1k and free starter credits are transparent; Kit/Shield add separate costs.",
      "ai-capabilities":
        "Not an AI content/automation ESP — score near-floor for category AI criterion.",
    },
    bestFor: [
      "Marketers cleaning lists before campaigns",
      "Agencies and SaaS teams needing API verification",
      "Teams protecting signup forms from bad/fraudulent emails",
      "Senders monitoring domain/IP deliverability health",
    ],
    notIdealFor: [
      "Teams needing a full email campaign / ESP platform",
      "Users who only need a personal inbox or email host",
    ],
    pros: [
      "Transparent credit-pack verification pricing",
      "API and marketing-platform integrations",
      "Shield real-time form protection",
      "Deliverability Kit for inbox/auth testing",
      "Credits never expire; free starter credits",
    ],
    cons: [
      "Not an ESP — cannot send campaigns",
      "Credit-based model requires ongoing top-ups at volume",
      "Unknown/catch-all results still need human judgment",
      "Kit and Shield are separate purchase decisions",
      "Should not be compared as a Mailchimp/GetResponse peer",
    ],
    keyFeatures: [
      "Bulk email list verification",
      "Email Verification API",
      "Bouncer Shield form protection",
      "Toxicity checks",
      "Deliverability Kit (inbox placement / auth)",
    ],
    pricingSummary:
      "Pay-as-you-go verification credits from $8/1,000 (packs up to $2,000/1M; custom above). 100 free starter credits. Deliverability Kit from $25/mo. Shield from ~$2/mo at 1,000 monthly checks.",
    whoShouldChoose:
      "Choose Bouncer when list verification / form protection / deliverability testing is the job — pair it with an ESP, do not treat it as one.",
    whoShouldConsiderAlternatives:
      "Compare other verification vendors for hygiene; for campaign sending choose GetResponse, Mailchimp, AWeber, or Campaign Monitor instead.",
    alternativeSlugs: ["inboxally", "getresponse", "mailchimp"],
    competitorSlugs: ["neverbounce", "zerobounce", "hunter", "clearout"],
    comparableSlugs: ["inboxally"],
    secondaryCategorySlugs: ["marketing"],
    subcategorySlugs: [],
    useCaseSlugs: ["small-business-campaigns", "ecommerce-email"],
    teamTypeSlugs: ["marketing", "founders"],
    businessSizeSlugs: ["micro", "small-business", "mid-market"],
    officialVideos: [],
    sourcesExtra: [],
  },
  {
    slug: "inboxally",
    name: "InboxAlly",
    company: "InboxAlly",
    website: "https://inboxally.com",
    domain: "inboxally.com",
    pricingUrl: "https://www.inboxally.com/pricing",
    aliases: ["Inbox Ally"],
    membershipRole: "adjacent",
    adjacentNote:
      "Deliverability / warmup / reputation repair — adjacent to email marketing. Do not treat as a core ESP or rank against campaign platforms on best pages.",
    softShortDescription:
      "Email deliverability and reputation repair via seed engagement and inbox placement tooling.",
    shortDescription:
      "InboxAlly uses a seed engagement network and ML scoring to improve inbox placement, reverse spam/promotions misclassification, and warm or repair sender reputation without taking over ESP credentials.",
    vendorPositioning:
      "Email deliverability software that teaches inbox providers your mail is wanted — repair-grade reputation work, not just new-domain warmup.",
    pricingModel: "subscription",
    hasFreePlan: false,
    hasFreeTrial: true,
    trialDays: 10,
    startingPriceMonthly: 149,
    pricingNotes:
      "10-day free trial, no credit card required. Free toolkit/tester available. Affiliate inventory notes a time-limited reader offer (verify before publishing): through 2026-12-01, 20% off first 3 months with code BFCM2025. Starter $149/mo (100 seeds/day, 1 profile); Plus $645/mo; Premium $1,190/mo; Enterprise custom.",
    fixturePlans: [
      "PLAN starter: name=Starter; amount=149; interval=month; seeds=100/day; profiles=1",
      "PLAN plus: name=Plus; amount=645; interval=month; seeds=500/day; profiles=5",
      "PLAN premium: name=Premium; amount=1190; interval=month; seeds=1000/day; profiles=10",
      "PLAN enterprise: name=Enterprise; contactSales=true",
    ],
    enrichmentPlans: [
      planFlat("starter", "Starter", 149, {
        hasFreeTrial: true,
        trialDays: 10,
        highlighted: true,
        description: "100 seed emails/day; 1 sender profile; email support.",
        limits: { seedEmailsDaily: 100, senderProfiles: 1 },
      }),
      planFlat("plus", "Plus", 645, {
        hasFreeTrial: true,
        trialDays: 10,
        description: "500 seed emails/day; 5 sender profiles; email + live chat.",
        limits: { seedEmailsDaily: 500, senderProfiles: 5 },
      }),
      planFlat("premium", "Premium", 1190, {
        hasFreeTrial: true,
        trialDays: 10,
        description:
          "1,000 seed emails/day; 10 sender profiles; phone support; setup + weekly strategy.",
        limits: { seedEmailsDaily: 1000, senderProfiles: 10 },
      }),
      contactSalesPlan("enterprise", "Enterprise", {
        description: "Thousands of seeds/day; unlimited sender profiles.",
      }),
    ],
    featureOverrides: {
      "email-campaigns": "not-supported",
      "newsletter-builder": "not-supported",
      "email-templates": "not-supported",
      "drag-drop-editor": "not-supported",
      "automation-workflows": "limited",
      segmentation: "not-supported",
      personalization: "not-supported",
      "ab-testing": "not-supported",
      "contact-management": "not-supported",
      "landing-pages": "not-supported",
      forms: "not-supported",
      "transactional-email": "not-supported",
      analytics: "supported",
      "deliverability-tools": "supported",
      "ai-content-generation": "not-supported",
    },
    aiLines: [
      "AI recommendations: supported",
      "AI assistant: limited",
      "AI automation: limited",
    ],
    integrations: [
      { integrationSlug: "hubspot", kind: "native" },
      { integrationSlug: "klaviyo", kind: "native" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    limitations: [
      "Not a campaign platform — complements an ESP",
      "Pricing scales steeply with sender profiles and seed volume",
      "Requires including seed addresses in sends",
      "Reputation repair often takes weeks — trial alone may not prove full repair",
      "ESP creation/automation criteria do not apply — adjacent deliverability tool",
    ],
    limitationKinds: [
      "feature-unavailable",
      "high-cost-at-scale",
      "other",
      "other",
      "feature-unavailable",
    ],
    scores: {
      "ease-of-use": 6,
      "email-creation": 1,
      automation: 3,
      segmentation: 1,
      analytics: 6,
      "deliverability-tooling": 9,
      integrations: 7,
      scalability: 7,
      "value-for-money": 5,
      "ai-capabilities": 5,
    },
    scoreRationales: {
      "ease-of-use":
        "Seed-list inclusion and profile setup add ops work versus self-serve ESPs; CSM support helps but warmup/repair is not one-click.",
      "email-creation":
        "Not an ESP — no campaign builder. Near-floor score prevents adjacent ranking as an email peer.",
      automation:
        "Adaptive Autowarmup and seed engagement are deliverability automations, not marketing-automation workflows.",
      segmentation:
        "No subscriber segmentation product — works alongside whatever ESP owns the list.",
      analytics:
        "IA Score, reputation, inbox placement by provider, blacklist/DMARC reporting are first-party strengths for deliverability ops.",
      "deliverability-tooling":
        "Category-specialist strength: seed engagement, inbox placement testing, reputation repair without taking ESP credentials.",
      integrations:
        "Native CRM/ESP connectors (HubSpot, Klaviyo, and more) plus REST API on every plan.",
      scalability:
        "Plans scale seed volume and sender profiles to Enterprise; designed for multi-domain agencies and high-volume senders.",
      "value-for-money":
        "Starter at $149/mo is steep versus ESP entry floors; justified when damaged reputation is the buying job — score reflects accessibility.",
      "ai-capabilities":
        "ML scoring (IA Score / reputation) is real product tech; not AI email-content generation for marketers.",
    },
    bestFor: [
      "Senders with damaged domain reputation",
      "High-volume marketers and cold outreach operators",
      "Agencies managing multiple client sending domains",
      "ESPs/experts adding deliverability tooling",
    ],
    notIdealFor: [
      "Teams that need an ESP to build/send campaigns",
      "Very low-volume senders seeking a cheap warmup-only tool",
      "Buyers expecting a complete fix inside a 10-day trial (vendor notes repair often takes weeks)",
    ],
    pros: [
      "Specialist deliverability and reputation repair",
      "Works with any ESP/SMTP via seed inclusion",
      "Inbox placement testing and ML reputation scoring",
      "Native CRM integrations and API on every plan",
      "Dedicated CSM on every plan",
    ],
    cons: [
      "Not an email campaign platform",
      "Pricing scales steeply with seeds/profiles",
      "Requires operational discipline to include seeds",
      "Trial may be shorter than full repair cycles",
      "Should not be ranked as a Mailchimp/GetResponse peer",
    ],
    keyFeatures: [
      "Adaptive Autowarmup and seed engagement network",
      "IA Score / IA Reputation ML scoring",
      "Inbox placement testing by provider",
      "Blacklist monitoring and DMARC reporting",
      "Works with any ESP via seed list inclusion",
    ],
    pricingSummary:
      "10-day free trial (no card). Starter $149/mo, Plus $645/mo, Premium $1,190/mo, Enterprise custom. Time-limited promo codes may appear in affiliate inventory — verify before publishing.",
    whoShouldChoose:
      "Choose InboxAlly when inbox placement / reputation repair is the job and you already have (or will keep) a separate ESP for campaigns.",
    whoShouldConsiderAlternatives:
      "Compare Bouncer for list verification hygiene; for building and sending campaigns choose GetResponse, Mailchimp, AWeber, or Campaign Monitor.",
    alternativeSlugs: ["bouncer", "getresponse", "mailchimp"],
    competitorSlugs: ["mailreach", "warmup-inbox", "lemwarm", "instantly"],
    comparableSlugs: ["bouncer"],
    secondaryCategorySlugs: ["marketing"],
    subcategorySlugs: [],
    useCaseSlugs: ["small-business-campaigns", "ecommerce-email"],
    teamTypeSlugs: ["marketing"],
    businessSizeSlugs: ["small-business", "mid-market"],
    officialVideos: [],
    sourcesExtra: [],
  },
];

function avgScore(scores) {
  const vals = EM_CRITERIA.map((c) => scores[c]);
  return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10;
}

function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function writeText(filePath, text) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, text.endsWith("\n") ? text : `${text}\n`, "utf8");
}

function featureAvailability(p, feature) {
  return p.featureOverrides?.[feature] ?? "unknown";
}

function planSlugs(p) {
  return p.enrichmentPlans.map((pl) => pl.slug);
}

function buildSources(p) {
  const sources = [
    {
      id: `${p.slug}-product-official`,
      productSlug: p.slug,
      url: p.website,
      domain: p.domain,
      title: `${p.name} — Official Site`,
      publisher: p.company,
      sourceType: "official-product-page",
      authority: "first-party",
      retrievedAt: VERIFIED_AT,
      verifiedAt: VERIFIED_AT,
      lastCheckedAt: VERIFIED_AT,
      domains: [
        "identity",
        "features",
        "product-positioning",
        "ai-capabilities",
      ],
      confidence: "high",
      status: "active",
      notes: `First-party product positioning for ${p.name} (email-marketing Wave-1 onboarding 2026-08-17).`,
    },
    {
      id: `${p.slug}-pricing-official`,
      productSlug: p.slug,
      url: p.pricingUrl,
      domain: new URL(p.pricingUrl).hostname.replace(/^www\./, ""),
      title: `${p.name} Pricing`,
      publisher: p.company,
      sourceType: "official-pricing-page",
      authority: "first-party",
      retrievedAt: VERIFIED_AT,
      verifiedAt: VERIFIED_AT,
      lastCheckedAt: VERIFIED_AT,
      domains: ["pricing", "plans", "free-plan", "free-trial", "limits"],
      confidence: "high",
      status: "active",
      notes: p.pricingNotes,
    },
  ];
  for (const extra of p.sourcesExtra ?? []) {
    sources.push({
      id: extra.id,
      productSlug: p.slug,
      url: extra.url,
      domain: new URL(extra.url).hostname.replace(/^www\./, ""),
      title: extra.title,
      publisher: p.company,
      sourceType: "official-product-page",
      authority: "first-party",
      retrievedAt: VERIFIED_AT,
      verifiedAt: VERIFIED_AT,
      lastCheckedAt: VERIFIED_AT,
      domains: extra.domains,
      confidence: "high",
      status: "active",
      notes: `First-party support source for ${p.name}.`,
    });
  }
  return sources;
}

function buildPricingFixture(p) {
  return `# FIXTURE SNAPSHOT — structured from first-party research (2026-08-17)
# Label: fixture extract for FixtureFactExtractor — not a live HTML scrape dump.

CURRENCY: USD
PRICING_MODEL: ${p.pricingModel}
FREE_PLAN: ${p.hasFreePlan}
FREE_TRIAL: ${p.hasFreeTrial}
MEMBERSHIP_ROLE: ${p.membershipRole}

${p.fixturePlans.join("\n")}
`;
}

function buildProductFixture(p) {
  const featureLines = EM_FEATURES.map(
    (f) => `FEATURE ${f}: ${featureAvailability(p, f)}`,
  ).join("\n");
  const ai = (p.aiLines ?? ["AI assistant: limited"]).join("\n");
  const adjacent =
    p.membershipRole === "adjacent"
      ? `\nADJACENT: true\nADJACENT_NOTE: ${p.adjacentNote}\n`
      : "";
  return `# FIXTURE SNAPSHOT — structured from first-party research (2026-08-17)

SHORT_DESCRIPTION: ${p.shortDescription}
VENDOR_POSITIONING: ${p.vendorPositioning}
MEMBERSHIP_ROLE: ${p.membershipRole}${adjacent}
${featureLines}

${ai}
`;
}

function buildMedia(p) {
  return (p.officialVideos ?? []).map((v) => ({
    id: `media-${p.slug}-${v.videoId.toLowerCase()}`,
    productSlug: p.slug,
    productIds: [p.slug],
    type: "official-video",
    provider: "youtube",
    sourceUrl: `https://www.youtube.com/watch?v=${v.videoId}`,
    videoId: v.videoId,
    providerId: v.videoId,
    embedUrl: `https://www.youtube-nocookie.com/embed/${v.videoId}`,
    title: v.title,
    thumbnailUrl: `https://i.ytimg.com/vi/${v.videoId}/hqdefault.jpg`,
    channelName: v.channel,
    sourceOrganization: p.company,
    officialSource: true,
    officialSourceKind: "vendor-channel",
    verifiedAt: VERIFIED_AT,
    lastCheckedAt: VERIFIED_AT,
    sourceHealth: "unknown",
    refreshFlags: [],
    embeddingAllowed: true,
    capabilityIds: [],
    featureIds: v.features ?? [],
    requirementIds: [],
    useCaseIds: p.useCaseSlugs?.slice(0, 2) ?? ["newsletters"],
    industryIds: [],
    guideIds: [],
    evidenceRefs: [],
    evidenceClaimIds: [],
    evidenceClaimKinds: [],
    demonstratedDimensionIds: [],
    requirementCriterionIds: [],
    workflowStageIds: [],
    reportedOutcomes: [],
    placements: ["features", "overview"],
    purpose: `Official ${p.name} product video for email-marketing Wave-1 onboarding`,
    whatThisShows: Array.isArray(v.shows) ? v.shows : [v.shows].filter(Boolean),
    limitations: [],
    whatToNotice: [],
    status: "active",
  }));
}

function parseAiLine(line) {
  const cleaned = line.replace(/^AI\s+/i, "").trim();
  const idx = cleaned.indexOf(":");
  const capability = (idx === -1 ? cleaned : cleaned.slice(0, idx)).trim();
  const availability = (
    idx === -1 ? "unknown" : cleaned.slice(idx + 1)
  ).trim();
  return { capability, availability: availability || "unknown" };
}

function supportingFeatureForCriterion(criterionSlug) {
  const map = {
    "ease-of-use": "drag-drop-editor",
    "email-creation": "email-campaigns",
    automation: "automation-workflows",
    segmentation: "segmentation",
    analytics: "analytics",
    "deliverability-tooling": "deliverability-tools",
    integrations: "contact-management",
    scalability: "contact-management",
    "value-for-money": "email-campaigns",
    "ai-capabilities": "ai-content-generation",
  };
  return map[criterionSlug] ?? "email-campaigns";
}

function buildEnrichment(p) {
  const slugs = planSlugs(p);
  const featureSupport = EM_FEATURES.map((featureSlug) => ({
    featureSlug,
    availability: featureAvailability(p, featureSlug),
    planSlugs: slugs,
    sourceIds: [`${p.slug}-product-official`],
  }));

  const pricing = {
    currency: "USD",
    model: p.pricingModel,
    hasFreePlan: p.hasFreePlan,
    hasFreeTrial: p.hasFreeTrial,
    plans: p.enrichmentPlans,
    notes: p.pricingNotes,
    verifiedAt: VERIFIED_AT,
    sourceIds: [`${p.slug}-pricing-official`],
  };
  if (p.startingPriceMonthly !== undefined) {
    pricing.startingPriceMonthly = p.startingPriceMonthly;
  }
  if (p.trialDays !== undefined) {
    pricing.trialDays = p.trialDays;
  }

  const domainCheckedAt = Object.fromEntries(
    DOMAIN_CHECK_KEYS.map((k) => [k, VERIFIED_AT]),
  );

  const limitationKinds = p.limitationKinds ?? [];
  const limitations = p.limitations.map((description, i) => ({
    kind: limitationKinds[i] ?? "other",
    description,
    sourceIds: [`${p.slug}-product-official`],
    isEditorial: false,
  }));

  const editorialFit = (p.businessSizeSlugs ?? []).map((businessSizeSlug) => {
    const strength =
      p.membershipRole === "adjacent"
        ? "moderate"
        : businessSizeSlug === "mid-market"
          ? "strong"
          : businessSizeSlug === "micro" || businessSizeSlug === "small-business"
            ? "strong"
            : "moderate";
    return {
      businessSizeSlug,
      teamTypeSlug: "marketing",
      strength,
      rationale: `${p.name} fit for ${businessSizeSlug} marketing teams from first-party positioning and email-marketing Wave-1 research${
        p.membershipRole === "adjacent" ? " (adjacent tool, not core ESP)" : ""
      }.`,
      isEditorial: true,
    };
  });

  const notesParts = [
    `Email-marketing Wave-1 onboarding enrichment from first-party research ${VERIFIED_AT}. handsOnTesting=false.`,
    `membershipRole=${p.membershipRole}.`,
  ];
  if (p.adjacentNote) notesParts.push(p.adjacentNote);

  return {
    productSlug: p.slug,
    shortDescription: p.shortDescription,
    featureSupport,
    aiCapabilities: (p.aiLines ?? []).map((line) => {
      const { capability, availability } = parseAiLine(line);
      return {
        capability,
        availability,
        sourceIds: [`${p.slug}-product-official`],
      };
    }),
    integrationSupport: (p.integrations ?? []).map((i) => ({
      integrationSlug: i.integrationSlug,
      kind: i.kind,
      sourceIds: [`${p.slug}-product-official`],
      ...(i.notes ? { notes: i.notes } : {}),
    })),
    vendorPositioning: [
      {
        claim: p.vendorPositioning,
        audienceHints: p.bestFor.slice(0, 3),
        sourceIds: [`${p.slug}-product-official`],
      },
    ],
    editorialFit,
    limitations,
    pricing,
    screenshots: [],
    media: buildMedia(p),
    sourceIds: [
      `${p.slug}-product-official`,
      `${p.slug}-pricing-official`,
      ...(p.sourcesExtra ?? []).map((s) => s.id),
    ],
    notes: notesParts.join(" "),
    domainCheckedAt,
    updatedAt: VERIFIED_AT,
  };
}

function factBase(p, id, domain, field, value, sourceId, excerpt, locator) {
  const evidence = {
    sourceId,
    excerpt: excerpt.slice(0, 280),
  };
  if (locator) evidence.locator = locator;
  return {
    id,
    productSlug: p.slug,
    domain,
    field,
    value,
    sourceIds: [sourceId],
    evidence: [evidence],
    extractedAt: VERIFIED_AT,
    normalizedAt: VERIFIED_AT,
    verifiedAt: VERIFIED_AT,
    approvedAt: VERIFIED_AT,
    confidence: "medium",
    status: "approved",
    isFixture: true,
    notes: "Email-marketing Wave-1 first-party research extract",
  };
}

function buildFacts(p) {
  const productSrc = `${p.slug}-product-official`;
  const pricingSrc = `${p.slug}-pricing-official`;
  const facts = [
    factBase(
      p,
      `fact-${p.slug}-identity.shortDescription`,
      "identity",
      "identity.shortDescription",
      p.shortDescription,
      productSrc,
      p.shortDescription.slice(0, 160),
    ),
    factBase(
      p,
      `fact-${p.slug}-positioning.vendorClaim`,
      "product-positioning",
      "positioning.vendorClaim",
      p.vendorPositioning,
      productSrc,
      p.vendorPositioning.slice(0, 160),
    ),
    factBase(
      p,
      `fact-${p.slug}-pricing.model`,
      "pricing",
      "pricing.model",
      p.pricingModel,
      pricingSrc,
      p.pricingNotes.slice(0, 160),
    ),
    factBase(
      p,
      `fact-${p.slug}-pricing.hasFreePlan`,
      "pricing",
      "pricing.hasFreePlan",
      p.hasFreePlan,
      pricingSrc,
      `hasFreePlan=${p.hasFreePlan}`,
    ),
    factBase(
      p,
      `fact-${p.slug}-pricing.hasFreeTrial`,
      "pricing",
      "pricing.hasFreeTrial",
      p.hasFreeTrial,
      pricingSrc,
      `hasFreeTrial=${p.hasFreeTrial}`,
    ),
  ];
  if (p.membershipRole === "adjacent") {
    facts.push(
      factBase(
        p,
        `fact-${p.slug}-positioning.membershipRole`,
        "product-positioning",
        "positioning.membershipRole",
        "adjacent",
        productSrc,
        p.adjacentNote.slice(0, 200),
        "ADJACENT",
      ),
    );
  }
  if (p.startingPriceMonthly !== undefined) {
    facts.push(
      factBase(
        p,
        `fact-${p.slug}-pricing.startingPriceMonthly`,
        "pricing",
        "pricing.startingPriceMonthly",
        p.startingPriceMonthly,
        pricingSrc,
        `Starting ~$${p.startingPriceMonthly}/mo where published`,
      ),
    );
  }
  for (const plan of p.enrichmentPlans) {
    facts.push(
      factBase(
        p,
        `fact-${p.slug}-pricing.plans.${plan.slug}`,
        "plans",
        `pricing.plans.${plan.slug}`,
        plan,
        pricingSrc,
        `${plan.name}${plan.contactSales ? " (contact sales)" : ""}${plan.isFree ? " (free)" : ""}`,
        `PLAN ${plan.slug}`,
      ),
    );
  }
  for (const featureSlug of EM_FEATURES) {
    const availability = featureAvailability(p, featureSlug);
    facts.push(
      factBase(
        p,
        `fact-${p.slug}-features.${featureSlug}`,
        "features",
        `features.${featureSlug}`,
        { featureSlug, availability },
        productSrc,
        `${featureSlug}=${availability}`,
        `FEATURE ${featureSlug}`,
      ),
    );
  }
  return facts;
}

function buildCriterionAssessments(p) {
  return EM_CRITERIA.map((criterionSlug) => {
    const score = p.scores[criterionSlug];
    const featureSlug = supportingFeatureForCriterion(criterionSlug);
    const supportingFactIds = [
      `fact-${p.slug}-features.${featureSlug}`,
      `fact-${p.slug}-pricing.model`,
    ];
    if (criterionSlug === "value-for-money") {
      supportingFactIds[0] = `fact-${p.slug}-pricing.hasFreePlan`;
      if (p.startingPriceMonthly !== undefined) {
        supportingFactIds.push(`fact-${p.slug}-pricing.startingPriceMonthly`);
      }
    }
    if (criterionSlug === "integrations") {
      supportingFactIds[0] = `fact-${p.slug}-positioning.vendorClaim`;
    }
    return {
      criterionSlug,
      score,
      rationale:
        p.scoreRationales?.[criterionSlug] ??
        `${criterionSlug} scored ${score}/10 from first-party research for ${p.name} — not hands-on lab tested.`,
      supportingFactIds,
      confidence: "medium",
      status: "approved",
      reviewedAt: VERIFIED_AT,
      reviewer: "editorial",
    };
  });
}

function buildAssessment(p) {
  const overallScore = avgScore(p.scores);
  const criterionAssessments = buildCriterionAssessments(p);
  const adjacentBit =
    p.membershipRole === "adjacent"
      ? ` Marked adjacent (not a core ESP peer for best-page ranking).`
      : "";
  return {
    id: `assessment-${p.slug}-email-marketing-v1`,
    productSlug: p.slug,
    methodologySlug: "email-marketing-editorial",
    methodologyVersion: "1.0.0",
    status: "approved",
    verdict: `${p.name}: ${p.whoShouldChoose}${adjacentBit} Scores use the email-marketing editorial methodology from first-party research as of 2026-08-17 — not hands-on product testing.`,
    strengths: p.pros.slice(0, 5),
    weaknesses: p.cons.slice(0, 5),
    bestFor: p.bestFor,
    notIdealFor: p.notIdealFor,
    tradeoffs: [
      "Campaign/automation depth vs design simplicity",
      "Forever-free / trial entry vs paid feature unlocks",
      "Core ESP breadth vs adjacent deliverability/verification specialization",
    ],
    recommendation: `${p.whoShouldChoose} ${p.whoShouldConsiderAlternatives}`,
    editorialNotes: `Email-marketing Wave-1 batch. Approved on email-marketing-editorial v1.0.0. membershipRole=${p.membershipRole}. handsOnTesting=false. Affiliate economics excluded.${
      p.adjacentNote ? ` ${p.adjacentNote}` : ""
    }`,
    handsOnTesting: false,
    confidence: "medium",
    criterionAssessments,
    overallScore,
    overallScoreRationale:
      "Equal-weight average of 10 email-marketing editorial criteria, rounded to 1 decimal. Not a hands-on lab score. Adjacent tools score low on ESP-centric criteria by design.",
    scoreAudit: [
      {
        at: VERIFIED_AT,
        actor: "editorial",
        change:
          "Email-marketing Wave-1 onboarding; approved EM criteria; handsOnTesting=false",
        nextOverall: overallScore,
      },
    ],
    reviewedAt: VERIFIED_AT,
    reviewer: "editorial",
    createdAt: VERIFIED_AT,
    updatedAt: VERIFIED_AT,
  };
}

function buildReview(p) {
  const overallScore = avgScore(p.scores);
  const criterionAssessments = buildCriterionAssessments(p);
  const researchSourceIds = [
    `${p.slug}-product-official`,
    `${p.slug}-pricing-official`,
    ...(p.sourcesExtra ?? []).map((s) => s.id),
  ];
  const comparisonSlugs = (p.alternativeSlugs ?? []).map((alt) =>
    comparisonSlugPair(p.slug, alt),
  );
  const roleLabel =
    p.membershipRole === "adjacent"
      ? "an adjacent email-marketing tool (verification/deliverability — not a core ESP)"
      : "email marketing software";

  return {
    id: `review-${p.slug}-v1`,
    productSlug: p.slug,
    assessmentId: `assessment-${p.slug}-email-marketing-v1`,
    editorialStatus: "approved",
    title: `${p.name} Review (2026)`,
    h1: `${p.name} Review`,
    intro: `${p.name} is evaluated here as ${roleLabel} — ${p.shortDescription} This review uses SoftwareGlimpse’s email-marketing methodology (ease of use, email creation, automation, segmentation, analytics, deliverability tooling, integrations, scalability, value, AI). It is based on first-party research, not hands-on lab testing.`,
    summary: p.whoShouldChoose,
    verdict: `${p.whoShouldChoose} ${p.whoShouldConsiderAlternatives} Scores reflect first-party documentation as of 2026-08-17 — not hands-on product testing. Confirm current packaging on the vendor site before purchase.`,
    overallScore,
    criterionAssessments,
    bestFor: p.bestFor,
    notIdealFor: p.notIdealFor,
    pros: p.pros,
    cons: p.cons,
    keyFeatures: p.keyFeatures,
    limitations: p.limitations,
    pricingSummary: p.pricingSummary,
    whoShouldChoose: p.whoShouldChoose,
    whoShouldConsiderAlternatives: p.whoShouldConsiderAlternatives,
    alternativeSlugs: p.alternativeSlugs,
    comparisonSlugs,
    relatedGuidePaths: RELATED_GUIDE_PATHS,
    methodologySlug: "email-marketing-editorial",
    methodologyVersion: "1.0.0",
    researchSourceIds,
    factRefs: [
      {
        section: "pricing",
        factIds: [
          `fact-${p.slug}-pricing.model`,
          `fact-${p.slug}-pricing.hasFreePlan`,
          `fact-${p.slug}-pricing.hasFreeTrial`,
          ...(p.startingPriceMonthly !== undefined
            ? [`fact-${p.slug}-pricing.startingPriceMonthly`]
            : []),
        ],
      },
      {
        section: "overview",
        factIds: [
          `fact-${p.slug}-identity.shortDescription`,
          `fact-${p.slug}-positioning.vendorClaim`,
        ],
      },
    ],
    faq: [
      {
        question: `Is ${p.name} a full email marketing ESP?`,
        answer:
          p.membershipRole === "adjacent"
            ? `No. ${p.name} is adjacent tooling (verification/deliverability) that complements an ESP. Use GetResponse, Mailchimp, AWeber, or Campaign Monitor to build and send campaigns.`
            : `Yes. ${p.name} is evaluated as email marketing / ESP software for campaigns, lists, and related automation — not as a full sales CRM of record.`,
      },
      {
        question: `How is ${p.name} priced?`,
        answer: p.pricingSummary,
      },
      {
        question: `Did SoftwareGlimpse personally test ${p.name}?`,
        answer:
          "No. This review is based on first-party product and pricing research evidence, not hands-on product usage.",
      },
    ],
    sections: [
      {
        id: "overview",
        heading: "Overview",
        body: p.shortDescription,
      },
      {
        id: "best-for",
        heading: "Who it’s for",
        body: p.bestFor.map((b) => `• ${b}`).join("\n"),
      },
      {
        id: "pricing",
        heading: "Pricing",
        body: p.pricingSummary,
      },
      {
        id: "limitations",
        heading: "Limitations",
        body: p.limitations.map((l) => `• ${l}`).join("\n"),
      },
    ],
    confidence: "medium",
    handsOnTesting: false,
    contentVersion: 1,
    refreshNeeded: false,
    lastUpdatedAt: VERIFIED_AT,
    metadata: {
      status: "published",
      publishedAt: PUBLISHED_AT,
      updatedAt: VERIFIED_AT,
      reviewedAt: VERIFIED_AT,
      author: "author-lee-meyeridricks",
      researchStatus: "complete",
    },
    seo: {
      title: `${p.name} Review (2026) — Email Marketing`,
      description: `${p.name} email marketing review on SoftwareGlimpse: strengths, trade-offs, pricing posture, and who should buy.`,
      canonicalPath: `/software/${p.slug}/`,
      indexable: true,
    },
  };
}

function softSnippet(p) {
  const aliases = p.aliases?.length
    ? `\n    aliases: ${JSON.stringify(p.aliases)},`
    : "";
  const secondary = p.secondaryCategorySlugs?.length
    ? `\n    secondaryCategorySlugs: ${JSON.stringify(p.secondaryCategorySlugs)},`
    : "";
  return `  soft({
    id: "soft-${p.slug}",
    slug: "${p.slug}",
    name: "${p.name}",
    company: "${p.company}",
    website: "${p.website}",
    logo: { src: "/brands/${p.slug}.png", alt: "${p.name} logo" },
    shortDescription:
      ${JSON.stringify(p.softShortDescription)},${aliases}
    primaryCategorySlug: "email-marketing",${secondary}
    subcategorySlugs: ${JSON.stringify(p.subcategorySlugs ?? [])},
    useCaseSlugs: ${JSON.stringify(p.useCaseSlugs)},
    teamTypeSlugs: ${JSON.stringify(p.teamTypeSlugs)},
    businessSizeSlugs: ${JSON.stringify(p.businessSizeSlugs)},
    competitorSlugs: ${JSON.stringify(p.competitorSlugs)},
    alternativeSlugs: ${JSON.stringify(p.alternativeSlugs)},
    comparableSlugs: ${JSON.stringify(p.comparableSlugs)},
    metadata: {
      status: "published",
      publishedAt: "${PUBLISHED_AT}",
      researchStatus: "complete",
    },
  }),`;
}

function writeProduct(p) {
  const researchDir = path.join(ROOT, "src/data/research", p.slug);
  const fixturesDir = path.join(researchDir, "fixtures");
  const publicDir = path.join(ROOT, "public/software", p.slug, "diagrams");
  fs.mkdirSync(fixturesDir, { recursive: true });
  fs.mkdirSync(publicDir, { recursive: true });

  writeJson(path.join(researchDir, "sources.json"), buildSources(p));
  writeText(
    path.join(fixturesDir, `${p.slug}-pricing-fixture.txt`),
    buildPricingFixture(p),
  );
  writeText(
    path.join(fixturesDir, `${p.slug}-product-fixture.txt`),
    buildProductFixture(p),
  );
  writeJson(path.join(researchDir, "enrichment.json"), buildEnrichment(p));
  writeJson(path.join(researchDir, "facts.json"), buildFacts(p));
  writeJson(path.join(researchDir, "conflicts.json"), []);
  writeJson(path.join(researchDir, "jobs.json"), [
    {
      id: `job-${p.slug}-email-marketing-wave1`,
      productSlug: p.slug,
      status: "completed",
      createdAt: VERIFIED_AT,
      completedAt: VERIFIED_AT,
      notes: `Email-marketing Wave-1 batch; membershipRole=${p.membershipRole}`,
    },
  ]);
  writeJson(path.join(researchDir, "snapshots.json"), []);

  const assessment = buildAssessment(p);
  writeJson(
    path.join(ROOT, "src/data/editorial/assessments", `${p.slug}.json`),
    assessment,
  );
  writeJson(
    path.join(ROOT, "src/data/editorial/reviews", `${p.slug}.json`),
    buildReview(p),
  );

  console.log(
    `✓ ${p.slug}  overall=${assessment.overallScore}  role=${p.membershipRole}  media=${(p.officialVideos ?? []).length}`,
  );
}

function writeSeedSnippet(products) {
  const out = path.join(ROOT, "scripts/_em-batch-seed-snippet.ts");
  const body = `// Auto-generated by scripts/onboard-email-marketing-batch.mjs
// Append into src/data/seed/software.ts before the closing ]; of softwareSeed.
// getresponse: replace candidate-only (primary was marketing) with full soft — primaryCategorySlug email-marketing.
// bouncer / inboxally: adjacent tools — primary email-marketing but NOT best-page ESP peers.

${products.map(softSnippet).join("\n")}
`;
  writeText(out, body);
  console.log(`✓ seed snippet → ${path.relative(ROOT, out)}`);
}

function writeVideoImportSpec(products) {
  const videos = [];
  for (const p of products) {
    for (const v of p.officialVideos ?? []) {
      videos.push({
        product: p.slug,
        videoId: v.videoId,
        title: v.title,
        channel: v.channel,
        org: p.company,
        assetType: "official-product-video",
        shows: Array.isArray(v.shows) ? v.shows : [v.shows].filter(Boolean),
        features: v.features,
      });
    }
  }
  writeJson(path.join(ROOT, "scripts/_em-batch-official-videos.json"), videos);
  console.log(`✓ video specs → ${videos.length} videos`);
}

function main() {
  for (const p of PRODUCTS) writeProduct(p);
  writeSeedSnippet(PRODUCTS);
  writeVideoImportSpec(PRODUCTS);
  console.log("\nNext:");
  console.log("  1. Patch software.ts with scripts/_em-batch-seed-snippet.ts");
  console.log(
    "  2. Reclassify mailchimp + activecampaign primaryCategorySlug → email-marketing",
  );
  console.log("  3. Update email-marketing.ts seedProductSlugs");
  console.log("  4. Download / generate brand logos under public/brands/");
  console.log("  5. Import official videos via assets:approve flow");
  console.log("  6. Content quality audit — target ≥75");
}

main();
