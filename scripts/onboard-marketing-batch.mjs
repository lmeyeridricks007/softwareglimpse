#!/usr/bin/env node
/**
 * Marketing & Growth Wave-2 (+ LMS/webinar follow-on) products:
 * Kartra, SocialBee, Brand24, Freshmarketer, LearnWorlds, Livestorm
 *
 * Usage:
 *   node scripts/onboard-marketing-batch.mjs
 *   node scripts/onboard-marketing-batch.mjs learnworlds livestorm
 * Idempotent — overwrites product research / editorial packs.
 *
 * Does NOT auto-publish beyond writing approved editorial JSON.
 * Affiliate economics never enter scores.
 * Grounded in docs/reports/_em-research-adjacent-marketing.json (2026-08-17)
 * plus first-party LearnWorlds / Livestorm pricing pages (2026-08-17).
 *
 * Schema notes (match SI Priority-2 / email-marketing Wave-1):
 * - Facts: extractedAt/normalizedAt/verifiedAt/approvedAt, isFixture, notes;
 *   evidence = {sourceId, excerpt?, locator?} only.
 * - Enrichment: domainCheckedAt domain→ISO map; limitations with kind;
 *   editorialFit array; AI capability enum; integrations without availability.
 * - Reviews: ProductReviewSchema (alternativeSlugs, comparisonSlugs, string
 *   keyFeatures/limitations, metadata/seo, lastUpdatedAt).
 * - Assessments: methodologySlug marketing-editorial v1.0.0, approved,
 *   handsOnTesting false.
 *
 * Skipped this wave: Zypper (exclude — personal finance), Fastmail, NiceJob, SaneBox.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const VERIFIED_AT = "2026-08-17T15:00:00.000Z";
const PUBLISHED_AT = "2026-08-17T00:00:00.000Z";

const RELATED_GUIDE_PATHS = [
  "/guides/how-to-choose-marketing-software/",
  "/categories/marketing/",
  "/best/marketing-software/",
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

/** Exact criterionSlug values from marketing editorialMethodology */
const MKT_CRITERIA = [
  "ease-of-use",
  "campaign-content",
  "marketing-automation",
  "funnel-conversion",
  "analytics-attribution",
  "brand-monitoring",
  "integrations",
  "scalability",
  "value-for-money",
  "ai-capabilities",
];

const MKT_FEATURES = [
  "social-scheduling",
  "content-calendar",
  "social-listening",
  "funnel-builder",
  "landing-pages",
  "marketing-automation",
  "forms-lead-capture",
  "analytics",
  "ads-management",
  "reputation-reviews",
  "webinars",
  "email-sms-channels",
  "team-collaboration",
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
        currency: extra.currency ?? "USD",
        interval: "month",
        amountPeriod: "month",
      },
    ],
    ...(extra.description ? { description: extra.description } : {}),
    ...(extra.limits ? { limits: extra.limits } : {}),
  };
}

/** Per-unit / credit packs (e.g. Livestorm attendee credits). */
function planPerUnit(slug, name, amountPerUnit, extra = {}) {
  return {
    id: `plan-${slug}`,
    slug,
    name,
    isFree: false,
    contactSales: Boolean(extra.contactSales),
    hasFreeTrial: Boolean(extra.hasFreeTrial),
    trialDays: extra.trialDays,
    highlighted: Boolean(extra.highlighted),
    rules: extra.contactSales
      ? []
      : [
          {
            kind: "per-unit",
            unit: extra.unit ?? "credit",
            amountPerUnit,
            currency: extra.currency ?? "USD",
            interval: extra.interval ?? "year",
            amountPeriod: extra.amountPeriod ?? "year",
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
    slug: "kartra",
    name: "Kartra",
    company: "Kartra",
    website: "https://home.kartra.com",
    domain: "home.kartra.com",
    pricingUrl: "https://home.kartra.com/pricing",
    aliases: [],
    membershipRole: "primary",
    softShortDescription:
      "All-in-one marketing and online business platform for funnels, email, courses, and checkouts.",
    shortDescription:
      "Kartra combines landing pages, email/SMS marketing, memberships/courses, checkouts, funnels, AI copy, and related automation in one platform aimed at coaches, experts, and creators.",
    vendorPositioning:
      "The all-in-one platform that turns your expertise into scalable income — replace 8–12 tools with one system.",
    pricingModel: "subscription",
    hasFreePlan: false,
    hasFreeTrial: true,
    trialDays: 30,
    startingPriceMonthly: 59,
    pricingNotes:
      "Verified 2026-08-17 from home.kartra.com/pricing. Homepage CTA: free trial. Pricing page: 30-day risk-free money-back; cancel anytime. Yearly billed rates shown as lower effective monthly. Essentials includes 5% transaction fees; Starter+ list 0% transaction fees. Essentials $59/mo ($52/mo annual); Starter $119/mo ($99/mo annual); Growth $229/mo ($189/mo annual); Professional $549/mo ($429/mo annual).",
    fixturePlans: [
      "PLAN essentials: name=Essentials; amount=59; currency=USD; interval=month; contacts=500; emails=10000; pages=5; txnFee=5%",
      "PLAN starter: name=Starter; amount=119; currency=USD; interval=month; contacts=2500; unlimited email/SMS/pages; txnFee=0%",
      "PLAN growth: name=Growth; amount=229; currency=USD; interval=month; contacts=12500; automations; affiliates",
      "PLAN professional: name=Professional; amount=549; currency=USD; interval=month; contacts=25000; realtime funnel analytics",
    ],
    enrichmentPlans: [
      planFlat("essentials", "Essentials", 59, {
        hasFreeTrial: true,
        trialDays: 30,
        limits: { maxContacts: 500, maxEmailSendsMonthly: 10000, maxPages: 5 },
        description:
          "500 contacts; 10,000 emails/mo; 5 pages; 1 product; 1 membership; Kartra AI 30 uses; 5% transaction fees.",
      }),
      planFlat("starter", "Starter", 119, {
        hasFreeTrial: true,
        trialDays: 30,
        highlighted: true,
        limits: { maxContacts: 2500 },
        description:
          "2,500 contacts; unlimited email & SMS; unlimited pages/products/memberships; AI 100 uses; 0% transaction fees.",
      }),
      planFlat("growth", "Growth", 229, {
        hasFreeTrial: true,
        trialDays: 30,
        limits: { maxContacts: 12500 },
        description:
          "12,500 contacts; automations; affiliates; surveys; 10 team members; helpdesk.",
      }),
      planFlat("professional", "Professional", 549, {
        hasFreeTrial: true,
        trialDays: 30,
        limits: { maxContacts: 25000 },
        description:
          "25,000 contacts; real-time funnel analytics; helpdesk live chat; higher AI uses.",
      }),
    ],
    featureOverrides: {
      "social-scheduling": "limited",
      "content-calendar": "limited",
      "social-listening": "unsupported",
      "funnel-builder": "supported",
      "landing-pages": "supported",
      "marketing-automation": "supported",
      "forms-lead-capture": "supported",
      analytics: "supported",
      "ads-management": "unsupported",
      "reputation-reviews": "unsupported",
      webinars: "limited",
      "email-sms-channels": "supported",
      "team-collaboration": "supported",
      "ai-content-generation": "supported",
    },
    aiLines: [
      "AI copywriting: supported",
      "AI assistant: supported",
      "AI automation: limited",
      "AI recommendations: limited",
    ],
    integrations: [
      { integrationSlug: "stripe", kind: "native" },
      { integrationSlug: "paypal", kind: "native" },
      { integrationSlug: "zapier", kind: "zapier-style" },
      { integrationSlug: "webinarjam", kind: "native", notes: "Sibling webinar products" },
    ],
    limitations: [
      "All-in-one breadth can be heavier than a dedicated ESP or scheduler",
      "Lower tiers cap contacts, pages, and AI uses",
      "Essentials charges 5% transaction fees",
      "Not a social listening or paid-ads command center",
      "Webinars rely on paired WebinarJam/EverWebinar rather than deep native webinar suite",
    ],
    limitationKinds: [
      "other",
      "usage-cap",
      "plan-restriction",
      "feature-unavailable",
      "requires-add-on",
    ],
    scores: {
      "ease-of-use": 8,
      "campaign-content": 8,
      "marketing-automation": 8,
      "funnel-conversion": 9,
      "analytics-attribution": 8,
      "brand-monitoring": 3,
      integrations: 7,
      scalability: 8,
      "value-for-money": 7,
      "ai-capabilities": 8,
    },
    scoreRationales: {
      "ease-of-use":
        "Kartra markets a consolidated creator workspace; learning curve rises with membership/checkout depth but funnel/page builders are positioned as approachable.",
      "campaign-content":
        "Landing pages, broadcasts, and sequences are first-party core — strong campaign composition for coaches/creators, not a social calendar specialist.",
      "marketing-automation":
        "Automations, tagging, and sequences are documented strengths on Growth+; Essentials/Starter still cover email/SMS automation basics.",
      "funnel-conversion":
        "Funnel builder, landing pages, checkouts, and memberships are the product’s center of gravity — highest criterion score by design.",
      "analytics-attribution":
        "Funnel analytics deepen on Professional (realtime); reporting is solid for creator funnels, not enterprise multi-touch attribution.",
      "brand-monitoring":
        "Not a social listening product — low score by design versus Brand24-class tools.",
      integrations:
        "Payments and Zapier-style connectors are documented; CRM/ecosystem depth is secondary to the all-in-one stack.",
      scalability:
        "Published contact tiers to 25k with Professional; higher volumes need plan confirmation — solid for SMB/creator scale.",
      "value-for-money":
        "Entry Essentials at $59/mo is mid-priced for all-in-one breadth; transaction fees on Essentials and rapid tier jumps temper the score.",
      "ai-capabilities":
        "Kartra AI copy is marketed with plan-based use caps — useful assistance, not unlimited AI.",
    },
    bestFor: [
      "Coaches, consultants, and creators consolidating funnel + email + course stack",
      "Solopreneurs wanting one platform vs many point tools",
      "Teams needing checkouts and memberships alongside marketing pages",
    ],
    notIdealFor: [
      "Buyers who only need a lightweight ESP",
      "Teams needing deep social listening or paid-ads management as the core job",
      "Large B2B teams needing enterprise CRM depth as primary system",
    ],
    pros: [
      "True all-in-one: funnels, email/SMS, courses, checkouts",
      "Clear published tier ladder with annual discounts",
      "Kartra AI copy assistance on all paid tiers",
      "0% transaction fees from Starter upward",
      "Money-back / trial posture reduces buy risk",
    ],
    cons: [
      "Heavier than a dedicated ESP or social tool",
      "Contact/page/AI caps push upgrades",
      "Essentials transaction fees",
      "Weak on social listening and native ads",
      "Webinar depth depends on sibling products",
    ],
    keyFeatures: [
      "Landing page / funnel builder",
      "Email and SMS marketing",
      "Memberships and courses",
      "Checkouts and payments",
      "Kartra AI copy",
      "Forms, calendars, surveys",
    ],
    pricingSummary:
      "Essentials from $59/mo ($52/mo annual); Starter $119; Growth $229; Professional $549. Free trial / 30-day money-back. Essentials has 5% txn fees; Starter+ 0%. Contact caps 500 → 25,000.",
    whoShouldChoose:
      "Choose Kartra when you want funnels, email/SMS, courses, and checkouts in one creator-oriented platform instead of stitching multiple tools.",
    whoShouldConsiderAlternatives:
      "Compare dedicated ESPs (GetResponse, ActiveCampaign) if you only need email; SocialBee for social scheduling; Freshmarketer for Freshworks-aligned marketing automation.",
    alternativeSlugs: ["getresponse", "freshmarketer", "socialbee"],
    competitorSlugs: [
      "clickfunnels",
      "kajabi",
      "systeme-io",
      "gohighlevel",
      "hubspot",
      "activecampaign",
    ],
    comparableSlugs: ["getresponse", "freshmarketer"],
    secondaryCategorySlugs: ["email-marketing"],
    subcategorySlugs: [],
    useCaseSlugs: [
      "funnel-building",
      "marketing-automation",
      "lead-generation",
      "creator-marketing",
      "multichannel-campaigns",
    ],
    teamTypeSlugs: ["marketing", "founders"],
    businessSizeSlugs: ["micro", "small-business", "mid-market"],
    officialVideos: [
      {
        title: "Learn Kartra Live: Email Marketing (official webinar)",
        url: "https://kartra.com/webinars/learn-kartra-live-email-marketing/",
        notes: "Official webinar page — embed videoId not captured in text crawl",
      },
    ],
    catalogueSourceId: "aff-kartra",
    affiliateUrl: "https://try.kartra.com/jzs0bc88f4ur",
  },
  {
    slug: "socialbee",
    name: "SocialBee",
    company: "SocialBee LABS SRL (part of WebPros)",
    website: "https://socialbee.com",
    domain: "socialbee.com",
    pricingUrl: "https://socialbee.com/pricing/",
    aliases: ["Social Bee"],
    membershipRole: "primary",
    softShortDescription:
      "AI-assisted social media scheduling, content recycling, and team collaboration.",
    shortDescription:
      "SocialBee is a social media management platform for planning, AI content, scheduling across major networks, analytics, and agency workspaces.",
    vendorPositioning:
      "AI-powered social media management — create, schedule, and recycle content without hiring a full-time social person.",
    pricingModel: "subscription",
    hasFreePlan: false,
    hasFreeTrial: true,
    trialDays: 14,
    startingPriceMonthly: 29,
    pricingNotes:
      "Verified 2026-08-17 from socialbee.com/pricing/. 14-day free trial of Pro plan, no credit card; 30-day money-back. Yearly billed ~16% off. Prices exclude VAT/GST. Bootstrap $29/mo ($24 annual); Accelerate $49 ($40); Pro $99 ($82); Agency Pro50/100/150 higher.",
    fixturePlans: [
      "PLAN bootstrap: name=Bootstrap; amount=29; currency=USD; interval=month; profiles=5; users=1",
      "PLAN accelerate: name=Accelerate; amount=49; currency=USD; interval=month; profiles=10",
      "PLAN pro: name=Pro; amount=99; currency=USD; interval=month; profiles=25; users=3",
      "PLAN pro50: name=Pro50; amount=179; currency=USD; interval=month; profiles=50",
      "PLAN pro100: name=Pro100; amount=329; currency=USD; interval=month; profiles=100",
      "PLAN pro150: name=Pro150; amount=449; currency=USD; interval=month; profiles=150",
    ],
    enrichmentPlans: [
      planFlat("bootstrap", "Bootstrap", 29, {
        hasFreeTrial: true,
        trialDays: 14,
        limits: { maxSocialProfiles: 5, maxUsers: 1 },
        description: "Up to 5 social profiles; 1 user; 1 workspace.",
      }),
      planFlat("accelerate", "Accelerate", 49, {
        hasFreeTrial: true,
        trialDays: 14,
        limits: { maxSocialProfiles: 10 },
        description:
          "Up to 10 profiles; advanced analytics; hashtag organizer; CSV; approvals.",
      }),
      planFlat("pro", "Pro", 99, {
        hasFreeTrial: true,
        trialDays: 14,
        highlighted: true,
        limits: { maxSocialProfiles: 25, maxUsers: 3 },
        description:
          "Up to 25 profiles; 3 users/workspace; 5 workspaces; export reports.",
      }),
      planFlat("pro50", "Pro50 (Agency)", 179, {
        limits: { maxSocialProfiles: 50, maxUsers: 5 },
        description: "Up to 50 profiles; 5 users; 10 workspaces.",
      }),
      planFlat("pro100", "Pro100 (Agency)", 329, {
        limits: { maxSocialProfiles: 100 },
        description: "Up to 100 profiles; 5 users; 20 workspaces.",
      }),
      planFlat("pro150", "Pro150 (Agency)", 449, {
        limits: { maxSocialProfiles: 150 },
        description: "Up to 150 profiles; 5 users; 30 workspaces.",
      }),
    ],
    featureOverrides: {
      "social-scheduling": "supported",
      "content-calendar": "supported",
      "social-listening": "limited",
      "funnel-builder": "unsupported",
      "landing-pages": "unsupported",
      "marketing-automation": "limited",
      "forms-lead-capture": "unsupported",
      analytics: "supported",
      "ads-management": "unsupported",
      "reputation-reviews": "unsupported",
      webinars: "unsupported",
      "email-sms-channels": "unsupported",
      "team-collaboration": "supported",
      "ai-content-generation": "supported",
    },
    aiLines: [
      "AI content generation: supported",
      "AI Copilot: supported",
      "AI automation: limited",
      "AI recommendations: limited",
    ],
    integrations: [
      { integrationSlug: "facebook", kind: "native" },
      { integrationSlug: "instagram", kind: "native" },
      { integrationSlug: "linkedin", kind: "native" },
      { integrationSlug: "tiktok", kind: "native" },
      { integrationSlug: "canva", kind: "native" },
    ],
    limitations: [
      "Profile and workspace caps by plan",
      "Historical analytics depth limited on Bootstrap (3 months)",
      "Not a full social listening suite like Brand24",
      "Not an ESP or funnel/landing-page platform",
      "Paid social ad management is not the core product",
    ],
    limitationKinds: [
      "usage-cap",
      "plan-restriction",
      "feature-unavailable",
      "feature-unavailable",
      "feature-unavailable",
    ],
    scores: {
      "ease-of-use": 8,
      "campaign-content": 9,
      "marketing-automation": 5,
      "funnel-conversion": 3,
      "analytics-attribution": 7,
      "brand-monitoring": 4,
      integrations: 7,
      scalability: 7,
      "value-for-money": 8,
      "ai-capabilities": 8,
    },
    scoreRationales: {
      "ease-of-use":
        "SocialBee positions AI-assisted scheduling for solopreneurs and SMBs — category recycling and calendar UX are the product’s daily job.",
      "campaign-content":
        "Multi-network scheduling, content categories, and recycling are first-party strengths — highest criterion score by design.",
      "marketing-automation":
        "Scheduling/recycling is not multichannel marketing automation — moderate score for evergreen queues, not journeys.",
      "funnel-conversion":
        "No funnel/landing-page builder — low score by design versus Kartra/Freshmarketer.",
      "analytics-attribution":
        "Social analytics and report export (higher tiers) are solid for posting performance; not full marketing attribution.",
      "brand-monitoring":
        "Engagement inbox covers comments/mentions/DMs on supported networks but is not Brand24-class listening — limited.",
      integrations:
        "Major social networks + Canva documented; CRM/ESP depth is secondary.",
      scalability:
        "Agency ladders to 150 profiles; caps drive upgrades but published path exists.",
      "value-for-money":
        "Bootstrap from $29/mo with Pro trial is competitive for SMB social scheduling — score excludes affiliate terms.",
      "ai-capabilities":
        "AI Copilot / content generation is a marketed core feature across the product story.",
    },
    bestFor: [
      "Solopreneurs and SMBs scheduling social content",
      "Social media managers and agencies needing multi-workspace plans",
      "Teams wanting AI-assisted social copy and recycling",
    ],
    notIdealFor: [
      "Teams needing deep paid social ad management as the core product",
      "Buyers seeking email marketing / ESP features",
      "PR teams needing enterprise social listening",
    ],
    pros: [
      "Strong multi-network scheduling and content recycling",
      "AI content tools marketed as a core workflow",
      "Agency workspace ladders with clear profile packs",
      "14-day Pro trial without credit card",
      "Engagement inbox for supported networks",
    ],
    cons: [
      "Profile/workspace caps force upgrades",
      "Not a listening, ESP, or funnel platform",
      "Bootstrap analytics history limited",
      "Ads management not core",
      "Competitor set includes deeper enterprise social suites",
    ],
    keyFeatures: [
      "Multi-network social scheduling",
      "AI content generation / Copilot",
      "Content categories and recycling",
      "Analytics and branded reports (higher tiers)",
      "Team workspaces and approvals",
    ],
    pricingSummary:
      "Bootstrap from $29/mo ($24 annual); Accelerate $49; Pro $99; Agency Pro50–Pro150 from $179–$449/mo. 14-day Pro trial; 30-day money-back. Prices exclude VAT/GST.",
    whoShouldChoose:
      "Choose SocialBee when social scheduling, content recycling, and AI-assisted posting are the primary job — especially for SMBs and agencies.",
    whoShouldConsiderAlternatives:
      "Compare Brand24 for listening, Kartra for funnels/email/courses, and Buffer/Hootsuite-class tools if you need a different social suite shape.",
    alternativeSlugs: ["brand24", "kartra", "freshmarketer"],
    competitorSlugs: [
      "buffer",
      "hootsuite",
      "later",
      "sprout-social",
      "agorapulse",
    ],
    comparableSlugs: ["brand24"],
    secondaryCategorySlugs: [],
    subcategorySlugs: [],
    useCaseSlugs: [
      "social-media-management",
      "multichannel-campaigns",
      "creator-marketing",
    ],
    teamTypeSlugs: ["marketing", "founders"],
    businessSizeSlugs: ["micro", "small-business", "mid-market"],
    officialVideos: [
      {
        title: "How to Use SocialBee | Demo Webinar",
        url: "https://socialbee.com/pricing/",
        notes: "Pricing page promotes live demo webinar; register via SocialBee site",
      },
    ],
    catalogueSourceId: "aff-socialbee",
    affiliateUrl: "https://get.socialbee.io/txg9o1sie7g4",
  },
  {
    slug: "brand24",
    name: "Brand24",
    company: "Brand24",
    website: "https://brand24.com",
    domain: "brand24.com",
    pricingUrl: "https://brand24.com/prices/",
    aliases: [],
    membershipRole: "primary",
    softShortDescription:
      "AI social listening and brand monitoring across social, news, blogs, and more.",
    shortDescription:
      "Brand24 monitors online mentions across 25M+ sources for reputation protection, awareness measurement, competitor analysis, and customer insights with sentiment and reporting.",
    vendorPositioning:
      "#1 AI social listening tool — protect reputation, measure awareness, analyze competitors, discover customer insights.",
    pricingModel: "subscription",
    hasFreePlan: false,
    hasFreeTrial: true,
    trialDays: 14,
    startingPriceMonthly: 199,
    pricingNotes:
      "Verified 2026-08-17 from brand24.com/prices/ (official doc last verified 2026-06-10; last pricing change 2026-05-13). 14-day free trial, no credit card. 30-day money-back (excludes custom sales). Individual $249/mo ($199 annual); Team $349 ($299); Pro $499 ($399); Business $699 ($599); Enterprise from $1,499/mo annual. API $99/mo add-on on Business; included on Enterprise.",
    fixturePlans: [
      "PLAN individual: name=Individual; amount=249; currency=USD; interval=month; keywords=3; mentions=2000",
      "PLAN team: name=Team; amount=349; currency=USD; interval=month; keywords=7; mentions=10000",
      "PLAN pro: name=Pro; amount=499; currency=USD; interval=month; keywords=12; mentions=40000",
      "PLAN business: name=Business; amount=699; currency=USD; interval=month; keywords=25; mentions=100000",
      "PLAN enterprise: name=Enterprise; amount=1499; currency=USD; interval=month; contactSales=false; annualFloor",
    ],
    enrichmentPlans: [
      planFlat("individual", "Individual", 249, {
        hasFreeTrial: true,
        trialDays: 14,
        limits: { maxKeywords: 3, maxMentionsMonthly: 2000 },
        description:
          "3 keywords; 2,000 mentions/mo; refresh every 12 hours; 1 user. Annual effective $199/mo.",
      }),
      planFlat("team", "Team", 349, {
        hasFreeTrial: true,
        trialDays: 14,
        highlighted: true,
        limits: { maxKeywords: 7, maxMentionsMonthly: 10000 },
        description:
          "7 keywords; 10,000 mentions/mo; hourly refresh; unlimited users. Annual $299/mo.",
      }),
      planFlat("pro", "Pro", 499, {
        hasFreeTrial: true,
        trialDays: 14,
        limits: { maxKeywords: 12, maxMentionsMonthly: 40000 },
        description:
          "12 keywords; 40,000 mentions/mo; realtime; white-label reports. Annual $399/mo.",
      }),
      planFlat("business", "Business", 699, {
        hasFreeTrial: true,
        trialDays: 14,
        limits: { maxKeywords: 25, maxMentionsMonthly: 100000 },
        description:
          "25 keywords; 100,000 mentions/mo; realtime; QuickShare; podcasts. Annual $599/mo.",
      }),
      planFlat("enterprise", "Enterprise", 1499, {
        limits: {},
        description:
          "From $1,499/mo annual only — custom keywords/mentions. API included.",
      }),
    ],
    featureOverrides: {
      "social-scheduling": "unsupported",
      "content-calendar": "unsupported",
      "social-listening": "supported",
      "funnel-builder": "unsupported",
      "landing-pages": "unsupported",
      "marketing-automation": "unsupported",
      "forms-lead-capture": "unsupported",
      analytics: "supported",
      "ads-management": "unsupported",
      "reputation-reviews": "limited",
      webinars: "unsupported",
      "email-sms-channels": "unsupported",
      "team-collaboration": "supported",
      "ai-content-generation": "limited",
    },
    aiLines: [
      "AI Brand Assistant: supported",
      "AI sentiment analysis: supported",
      "AI automation: limited",
      "AI recommendations: limited",
    ],
    integrations: [
      { integrationSlug: "slack", kind: "native" },
      { integrationSlug: "api", kind: "native", notes: "API add-on on Business; included Enterprise" },
      { integrationSlug: "mcp", kind: "native", notes: "MCP support stated on all plans" },
    ],
    limitations: [
      "Keyword and mention caps drive upgrades",
      "Source categories gated by plan",
      "Individual plan not realtime (12-hour refresh)",
      "Not a social scheduling or funnel platform",
      "Enterprise is annual-only custom packaging",
    ],
    limitationKinds: [
      "usage-cap",
      "plan-restriction",
      "plan-restriction",
      "feature-unavailable",
      "other",
    ],
    scores: {
      "ease-of-use": 7,
      "campaign-content": 4,
      "marketing-automation": 3,
      "funnel-conversion": 2,
      "analytics-attribution": 9,
      "brand-monitoring": 10,
      integrations: 6,
      scalability: 8,
      "value-for-money": 6,
      "ai-capabilities": 7,
    },
    scoreRationales: {
      "ease-of-use":
        "Listening dashboards are approachable for PR/marketing teams; keyword/mention model needs onboarding but is standard for the category.",
      "campaign-content":
        "Not a content/scheduling product — low score by design versus SocialBee.",
      "marketing-automation":
        "Monitoring/alerts are not marketing automation journeys — low by design.",
      "funnel-conversion":
        "No funnel/landing tooling — lowest conversion score among this wave.",
      "analytics-attribution":
        "Reach, awareness, sentiment, and reporting are first-party strengths for monitoring programs.",
      "brand-monitoring":
        "Core product job — social listening across 25M+ sources with sentiment and AI assistant; highest criterion score.",
      integrations:
        "Slack/API/MCP documented; broader marketing-stack connectors are secondary to listening.",
      scalability:
        "Mention/keyword ladders to Business/Enterprise support scale; caps are explicit.",
      "value-for-money":
        "Starts ~$199–$249/mo — premium vs schedulers; fair for listening specialists but pricey for light monitoring needs.",
      "ai-capabilities":
        "AI Brand Assistant and sentiment are marketed; not an AI content studio.",
    },
    bestFor: [
      "PR and marketing teams monitoring brand and competitors",
      "Agencies delivering monitoring reports to clients",
      "Crisis / reputation monitoring at scale",
    ],
    notIdealFor: [
      "Users who only need to schedule social posts",
      "Local review-generation workflows (use reputation tools instead)",
      "Buyers seeking email/funnel platforms",
    ],
    pros: [
      "Dedicated social listening across many source types",
      "Sentiment, reach, and awareness metrics",
      "Clear keyword/mention plan ladder",
      "14-day trial without credit card",
      "White-label / agency reporting on higher tiers",
    ],
    cons: [
      "Premium pricing vs social schedulers",
      "Mention/keyword caps force upgrades",
      "Individual refresh is not realtime",
      "No scheduling or funnel builders",
      "API may be an add-on below Enterprise",
    ],
    keyFeatures: [
      "Real-time / scheduled mention monitoring",
      "Sentiment analysis",
      "Reach and awareness metrics",
      "AI Brand Assistant (higher tiers)",
      "White-label reporting",
      "Multi-source coverage (social, news, blogs, podcasts by plan)",
    ],
    pricingSummary:
      "Individual from $249/mo ($199 annual); Team $349; Pro $499; Business $699; Enterprise from $1,499/mo annual. 14-day trial; 30-day money-back (excludes custom deals).",
    whoShouldChoose:
      "Choose Brand24 when social listening, reputation monitoring, and mention analytics are the primary job — not scheduling or funnels.",
    whoShouldConsiderAlternatives:
      "Compare SocialBee for posting/scheduling, Meltwater/Brandwatch-class suites for enterprise listening, and NiceJob-class tools for review generation.",
    alternativeSlugs: ["socialbee", "kartra", "freshmarketer"],
    competitorSlugs: [
      "mention",
      "meltwater",
      "brandwatch",
      "talkwalker",
      "sprout-social",
    ],
    comparableSlugs: ["socialbee"],
    secondaryCategorySlugs: [],
    subcategorySlugs: [],
    useCaseSlugs: [
      "social-listening",
      "brand-monitoring",
      "multichannel-campaigns",
    ],
    teamTypeSlugs: ["marketing"],
    businessSizeSlugs: ["small-business", "mid-market"],
    officialVideos: [
      {
        title: "Practical Social Listening & Marketing Webinar Series",
        url: "https://brand24.com/webinar/",
        notes: "Official webinar series page",
      },
    ],
    catalogueSourceId: "aff-brand24",
    affiliateUrl: "https://try.brand24.com/nt5khme0rtcj",
  },
  {
    slug: "freshmarketer",
    name: "Freshmarketer",
    company: "Freshworks Inc.",
    website: "https://www.freshworks.com/crm/marketing/",
    domain: "freshworks.com",
    pricingUrl: "https://www.freshworks.com/crm/marketing/pricing/",
    aliases: ["Freshworks Marketing", "Freshworks CRM Marketing"],
    membershipRole: "primary",
    softShortDescription:
      "Freshworks marketing automation for multichannel campaigns, journeys, and AI-assisted marketing.",
    shortDescription:
      "Freshmarketer is Freshworks’ marketing automation product covering email and multichannel engagement, segmentation, journeys, landing pages/forms, and Freddy AI features, with CRM alignment.",
    vendorPositioning:
      "Transform marketing to boost revenue growth — attract, nurture, and convert with AI-powered marketing automation.",
    pricingModel: "freemium",
    hasFreePlan: true,
    hasFreeTrial: true,
    trialDays: 21,
    startingPriceMonthly: 15,
    pricingNotes:
      "Verified 2026-08-17 from freshworks.com/crm/marketing/pricing/. Legacy /freshmarketer/ URL 404'd. Public page shows Free and Enterprise only; older Growth/Pro tiers not confirmed on live official pricing this pass — do not invent. Free: 100 marketing contacts; 500 monthly email sends. Enterprise: $15/mo with 500 marketing contacts (billed annually shown); add-ons for contacts, CRO, dedicated IP, Freddy AI Agent, Messaging Agent. 21-day free trial, no credit card. Annual toggle (save 20%).",
    fixturePlans: [
      "PLAN free: name=Free; isFree=true; maxMarketingContacts=100; maxEmailSendsMonthly=500",
      "PLAN enterprise: name=Enterprise; amount=15; currency=USD; interval=month; includedContacts=500; billedAnnuallyShown",
      "PLAN addon-contacts: name=Marketing Contacts add-on; amount=100; notes=from 5000 contacts/mo",
    ],
    enrichmentPlans: [
      freePlan("free", "Free", {
        limits: { maxMarketingContacts: 100, maxEmailSendsMonthly: 500 },
        description:
          "100 marketing contacts; 500 monthly email sends; basic segmentation; web tracking and forms; social media campaigns.",
      }),
      planFlat("enterprise", "Enterprise", 15, {
        hasFreeTrial: true,
        trialDays: 21,
        highlighted: true,
        limits: { includedMarketingContacts: 500 },
        description:
          "$15/mo with 500 marketing contacts (annual display). AI campaign assistant; transactional emails; advanced segmentation; webhooks. Contact add-ons scale cost.",
      }),
      planFlat("addon-contacts", "Add-on — Marketing Contacts", 100, {
        description: "Starting $100 / 5,000 contacts / month (published add-on).",
      }),
      contactSalesPlan("addon-cro", "Add-on — Conversion Rate Optimization", {
        description: "CRO add-on starting $219 / 10,000 MUV / month.",
      }),
    ],
    featureOverrides: {
      "social-scheduling": "limited",
      "content-calendar": "unsupported",
      "social-listening": "unsupported",
      "funnel-builder": "limited",
      "landing-pages": "supported",
      "marketing-automation": "supported",
      "forms-lead-capture": "supported",
      analytics: "supported",
      "ads-management": "limited",
      "reputation-reviews": "unsupported",
      webinars: "unsupported",
      "email-sms-channels": "supported",
      "team-collaboration": "supported",
      "ai-content-generation": "supported",
    },
    aiLines: [
      "Freddy AI for marketing: supported",
      "AI campaign assistant: supported",
      "AI automation: supported",
      "AI recommendations: limited",
    ],
    integrations: [
      { integrationSlug: "freshsales", kind: "native" },
      { integrationSlug: "freshdesk", kind: "native" },
      { integrationSlug: "facebook", kind: "native", notes: "Custom audiences on Enterprise" },
      { integrationSlug: "whatsapp", kind: "native" },
    ],
    limitations: [
      "Public page collapses paid SKUs into Enterprise + contact add-ons — contact scaling can dominate cost",
      "Legacy inventory URL /freshmarketer/ is broken (404)",
      "Email send multipliers historically tied to plan/contacts (confirm in-product)",
      "Not a social listening or deep social scheduling suite",
      "Best fit inside Freshworks ecosystem",
    ],
    limitationKinds: [
      "other",
      "other",
      "usage-cap",
      "feature-unavailable",
      "other",
    ],
    scores: {
      "ease-of-use": 7,
      "campaign-content": 6,
      "marketing-automation": 9,
      "funnel-conversion": 7,
      "analytics-attribution": 7,
      "brand-monitoring": 3,
      integrations: 8,
      scalability: 7,
      "value-for-money": 8,
      "ai-capabilities": 8,
    },
    scoreRationales: {
      "ease-of-use":
        "Freshworks marketing UI is approachable for SMBs already in the ecosystem; journey builders add learning curve.",
      "campaign-content":
        "Email/multichannel campaigns and landing pages are present; not a social content calendar specialist.",
      "marketing-automation":
        "Journeys, segmentation, and multichannel engagement are the product’s core job — highest criterion score.",
      "funnel-conversion":
        "Landing pages, forms, chatbots, and CRO add-on support conversion; weaker than dedicated funnel builders like Kartra.",
      "analytics-attribution":
        "Performance analytics documented; CRO is an add-on — solid but not attribution-platform depth.",
      "brand-monitoring":
        "Not a listening product — low by design.",
      integrations:
        "Native Freshworks CRM/support stack is a clear strength versus standalone tools.",
      scalability:
        "Contact add-ons scale, but public packaging opacity and contact-driven cost are real limits.",
      "value-for-money":
        "Free tier plus Enterprise from $15/mo at 500 contacts is an attractive published entry — score reflects floors, not affiliate terms.",
      "ai-capabilities":
        "Freddy AI / campaign assistant is first-party marketed across Freshworks marketing.",
    },
    bestFor: [
      "Teams already in or considering Freshworks CRM",
      "SMBs wanting marketing automation with a free starting tier",
      "Multichannel nurture (email + messaging)",
    ],
    notIdealFor: [
      "Buyers needing only a standalone lightweight newsletter tool with transparent mid-tier public pricing",
      "Users outside Freshworks ecosystem who want best-of-breed ESP only",
      "Teams needing social listening as the primary job",
    ],
    pros: [
      "Free plan plus low published Enterprise entry",
      "Multichannel journeys with Freshworks CRM alignment",
      "Freddy AI marketing assistance",
      "Landing pages, forms, and segmentation",
      "21-day trial without credit card",
    ],
    cons: [
      "Public paid packaging is thin (Enterprise + add-ons)",
      "Contact add-ons can dominate total cost",
      "Legacy product URL is broken",
      "Weak on social listening/scheduling depth",
      "Strongest when already buying Freshworks",
    ],
    keyFeatures: [
      "Multichannel engagement (email, SMS, WhatsApp, social)",
      "Freddy AI for marketing",
      "Predictive & behavioral segmentation",
      "Automated customer journeys",
      "Landing pages, forms, chatbots",
      "Freshworks CRM ecosystem integration",
    ],
    pricingSummary:
      "Free (100 contacts / 500 emails/mo). Enterprise from $15/mo with 500 marketing contacts (annual display). Contact/CRO/IP/AI add-ons published. 21-day free trial. Confirm current packaging on Freshworks pricing.",
    whoShouldChoose:
      "Choose Freshmarketer when you want Freshworks-aligned marketing automation with a free entry rung and multichannel journeys — especially if CRM is already Freshworks.",
    whoShouldConsiderAlternatives:
      "Compare ActiveCampaign/GetResponse for standalone ESP depth, Kartra for creator funnels/courses, and Hubspot-class suites for broader marketing hubs.",
    alternativeSlugs: ["getresponse", "kartra", "activecampaign"],
    competitorSlugs: [
      "hubspot",
      "activecampaign",
      "mailchimp",
      "klaviyo",
      "brevo",
    ],
    comparableSlugs: ["getresponse", "kartra"],
    secondaryCategorySlugs: ["email-marketing"],
    subcategorySlugs: [],
    useCaseSlugs: [
      "marketing-automation",
      "lead-generation",
      "multichannel-campaigns",
    ],
    teamTypeSlugs: ["marketing"],
    businessSizeSlugs: ["micro", "small-business", "mid-market"],
    officialVideos: [],
    catalogueSourceId: "aff-freshmarketer",
    affiliateUrl: null,
    sourcesExtra: [
      {
        id: "freshmarketer-product-crm-marketing",
        url: "https://www.freshworks.com/crm/marketing/",
        title: "Freshworks CRM Marketing (Freshmarketer)",
        domains: ["identity", "features", "product-positioning", "ai-capabilities"],
      },
    ],
  },
  {
    slug: "learnworlds",
    name: "LearnWorlds",
    company: "LearnWorlds",
    website: "https://www.learnworlds.com",
    domain: "learnworlds.com",
    pricingUrl: "https://www.learnworlds.com/pricing/",
    aliases: [],
    membershipRole: "primary",
    softShortDescription:
      "AI-powered LMS for creating, selling, and delivering online courses and academies.",
    shortDescription:
      "LearnWorlds is an AI-powered learning management system for course creators, training providers, and academies — combining course building, commerce (checkouts, memberships, funnels), community, certificates/SCORM, marketing integrations, and learner analytics.",
    vendorPositioning:
      "The #1 AI-powered LMS built for learning businesses — create and sell courses, run multi-client training, and prove learner outcomes.",
    pricingModel: "subscription",
    currency: "USD",
    hasFreePlan: false,
    hasFreeTrial: true,
    trialDays: 30,
    startingPriceMonthly: 29,
    pricingNotes:
      "Verified 2026-08-17 from learnworlds.com/pricing/. Monthly vs annually (save ~20%). Starter $29/mo ($24/mo billed annually) with $5 per paid enrollment; Pro Trainer $99/mo ($79 annual) no enrollment fees; Learning Center $299/mo ($249 annual) no enrollment fees; Corporate custom. Starter: 1,000 active learners/mo, 1 admin, 300 AI credits. Pro Trainer: 2,000 learners, 5 admins, 500 AI credits. Learning Center: 2,000 learners, 25 admins, 1,000 AI credits, white-label, up to 10 client groups. 30-day trial with core features. Prices exclude VAT.",
    fixturePlans: [
      "PLAN starter: name=Starter; amount=29; currency=USD; interval=month; learners=1000; admins=1; enrollmentFee=$5",
      "PLAN pro-trainer: name=Pro Trainer; amount=99; currency=USD; interval=month; learners=2000; admins=5; enrollmentFee=none",
      "PLAN learning-center: name=Learning Center; amount=299; currency=USD; interval=month; learners=2000; admins=25; whiteLabel=true",
      "PLAN corporate: name=Corporate; contactSales=true; currency=USD; interval=month",
    ],
    enrichmentPlans: [
      planFlat("starter", "Starter", 29, {
        hasFreeTrial: true,
        trialDays: 30,
        limits: { maxActiveLearnersMonthly: 1000, maxAdmins: 1, maxAiCreditsMonthly: 300 },
        description:
          "1,000 active learners/mo; 1 admin; 300 AI credits/mo; $5 per paid enrollment; 24/5 email support.",
      }),
      planFlat("pro-trainer", "Pro Trainer", 99, {
        hasFreeTrial: true,
        trialDays: 30,
        highlighted: true,
        limits: { maxActiveLearnersMonthly: 2000, maxAdmins: 5, maxAiCreditsMonthly: 500 },
        description:
          "2,000 active learners/mo; 5 admins; 500 AI credits; no enrollment fees; subscriptions/memberships; certificates; up to 20 SCORM; 50+ integrations.",
      }),
      planFlat("learning-center", "Learning Center", 299, {
        hasFreeTrial: true,
        trialDays: 30,
        limits: { maxActiveLearnersMonthly: 2000, maxAdmins: 25, maxAiCreditsMonthly: 1000, maxClientGroups: 10 },
        description:
          "Full white-label; up to 10 client groups; automation triggers; scheduled reports; 2 hours setup help.",
      }),
      contactSalesPlan("corporate", "Corporate", {
        description:
          "Custom learners/admins/AI credits; 99.95% uptime; dedicated success manager; 24/7 phone support.",
      }),
    ],
    featureOverrides: {
      "social-scheduling": "unsupported",
      "content-calendar": "unsupported",
      "social-listening": "unsupported",
      "funnel-builder": "supported",
      "landing-pages": "supported",
      "marketing-automation": "supported",
      "forms-lead-capture": "limited",
      analytics: "supported",
      "ads-management": "unsupported",
      "reputation-reviews": "unsupported",
      webinars: "supported",
      "email-sms-channels": "limited",
      "team-collaboration": "supported",
      "ai-content-generation": "supported",
    },
    aiLines: [
      "AI assistant: supported",
      "AI automation: limited",
      "AI transcription: supported",
      "AI email-generation: supported",
    ],
    integrations: [
      { integrationSlug: "stripe", kind: "native" },
      { integrationSlug: "paypal", kind: "native" },
      { integrationSlug: "hubspot", kind: "native", notes: "Fuller on higher plans; tracking-code-only on lower tiers per pricing matrix" },
      { integrationSlug: "zapier", kind: "zapier-style" },
      { integrationSlug: "mailchimp", kind: "native" },
      { integrationSlug: "shopify", kind: "native" },
    ],
    limitations: [
      "Starter charges $5 per paid enrollment",
      "Active learner and admin caps by plan",
      "AI credits are metered monthly",
      "Not a social scheduling or listening platform",
      "Email marketing is credit-capped mass email, not a full ESP",
    ],
    limitationKinds: [
      "plan-restriction",
      "usage-cap",
      "usage-cap",
      "feature-unavailable",
      "plan-restriction",
    ],
    scores: {
      "ease-of-use": 8,
      "campaign-content": 8,
      "marketing-automation": 7,
      "funnel-conversion": 8,
      "analytics-attribution": 7,
      "brand-monitoring": 2,
      integrations: 8,
      scalability: 8,
      "value-for-money": 7,
      "ai-capabilities": 8,
    },
    scoreRationales: {
      "ease-of-use":
        "LearnWorlds positions templates and AI course building for learning businesses — approachable for creators, with academy depth adding setup complexity on higher tiers.",
      "campaign-content":
        "Landing pages, page funnels with AI, coupons, and course sales pages are first-party strengths for course GTM — not a social calendar tool.",
      "marketing-automation":
        "Learning Center documents triggers/conditions/delays; Starter/Pro cover selling and some email credits — solid LMS automation, not full multichannel MA.",
      "funnel-conversion":
        "Commerce engine (checkouts, memberships, upsells, page funnels) is core to the product story — high score for course conversion workflows.",
      "analytics-attribution":
        "Course, sales, affiliate, and learner reporting with scheduled reports on higher tiers; not enterprise multi-touch marketing attribution.",
      "brand-monitoring":
        "Not a social listening product — low score by design versus Brand24-class tools.",
      integrations:
        "50+ built-in integrations marketed (Stripe, PayPal, HubSpot, Zapier, Mailchimp, Shopify, live session tools) — strong LMS ecosystem connectivity.",
      scalability:
        "Published path from Starter → Corporate custom learners/admins; multi-client groups on Learning Center — solid for growing academies.",
      "value-for-money":
        "Starter at $29/mo is accessible but enrollment fees and learner/AI caps push upgrades; Pro Trainer removes enrollment fees — mid-strong value excluding affiliate terms.",
      "ai-capabilities":
        "AI course builder, assessments, emails/images, interactive video AI, and metered AI credits are marketed core features.",
    },
    bestFor: [
      "Course creators and coaches selling online courses and memberships",
      "Training providers running multi-client academies",
      "Teams needing LMS + commerce + light marketing in one stack",
    ],
    notIdealFor: [
      "Buyers who only need social scheduling or brand listening",
      "Teams wanting a dedicated ESP as the primary system",
      "Organizations needing enterprise marketing automation beyond LMS workflows",
    ],
    pros: [
      "Full LMS with AI course building and interactive video",
      "Built-in commerce: checkouts, memberships, funnels",
      "Clear published tier ladder with annual savings",
      "30-day trial of core features",
      "White-label and multi-client groups on Learning Center+",
    ],
    cons: [
      "Starter enrollment fees ($5/paid enrollment)",
      "Learner/admin/AI credit caps drive upgrades",
      "Not a social or paid-ads command center",
      "Mass email is credit-limited vs full ESP peers",
      "Corporate pricing requires sales",
    ],
    keyFeatures: [
      "AI course builder, quizzes, and interactive video",
      "Course commerce: checkouts, memberships, bundles",
      "Page funnels and landing pages",
      "Community, certificates, SCORM",
      "Live sessions via Zoom/Meet/Teams/Webex",
      "Learner and sales analytics",
    ],
    pricingSummary:
      "Starter from $29/mo ($24 annual) with $5/enrollment; Pro Trainer $99 ($79 annual) no enrollment fees; Learning Center $299 ($249 annual); Corporate custom. 30-day trial. Prices exclude VAT. Confirm on learnworlds.com/pricing/.",
    whoShouldChoose:
      "Choose LearnWorlds when an AI-powered LMS with built-in course commerce and academy delivery is the primary job — especially for creators and training providers.",
    whoShouldConsiderAlternatives:
      "Compare Kartra for broader creator funnels/email/SMS all-in-one, Freshmarketer for Freshworks marketing automation, and SocialBee if social scheduling is the primary need.",
    alternativeSlugs: ["kartra", "freshmarketer", "socialbee"],
    competitorSlugs: [
      "kajabi",
      "thinkific",
      "teachable",
      "podia",
      "kartra",
      "moodle",
    ],
    comparableSlugs: ["kartra"],
    secondaryCategorySlugs: [],
    subcategorySlugs: [],
    useCaseSlugs: [
      "creator-marketing",
      "funnel-building",
      "lead-generation",
      "multichannel-campaigns",
    ],
    teamTypeSlugs: ["marketing", "founders"],
    businessSizeSlugs: ["micro", "small-business", "mid-market"],
    officialVideos: [
      {
        title: "LearnWorlds product demo / watch a demo (official site)",
        url: "https://www.learnworlds.com/",
        notes: "Homepage promotes Watch a demo — embed videoId not captured in text crawl",
      },
    ],
    catalogueSourceId: "aff-learnworlds",
    affiliateUrl: "https://get.learnworlds.com/eigvvf6yiu74",
  },
  {
    slug: "livestorm",
    name: "Livestorm",
    company: "Livestorm",
    website: "https://livestorm.co",
    domain: "livestorm.co",
    pricingUrl: "https://livestorm.co/pricing/",
    aliases: [],
    membershipRole: "primary",
    softShortDescription:
      "Browser-based webinar and virtual events platform for marketing teams.",
    shortDescription:
      "Livestorm is a European-designed webinar and online events platform for marketing teams — registration pages, email cadences, browser-based live rooms, engagement tools, CRM integrations, analytics, and AI content repurposing, priced on attendee credits.",
    vendorPositioning:
      "Where marketing teams run webinars — all-in-one video events from registration to replay, with pay-for-actual-attendees pricing.",
    pricingModel: "usage",
    currency: "EUR",
    hasFreePlan: false,
    hasFreeTrial: true,
    pricingNotes:
      "Verified 2026-08-17 from livestorm.co/pricing/. Pro: €2.50 per attendee credit (yearly credit packs; 1 credit per unique participant per session for live/replay/on-demand; team members not counted; no-shows not charged). Pro highlights: up to 4 hours/session, unlimited events/recording/team members, up to 3,000 live attendees/event, standard multilingual support. Enterprise: custom (up to 12 hours/session, enterprise integrations, custom analytics, dedicated CS, VIP support/SLA). Free trial CTA on pricing. Add-ons include AI Studio, live translations, SSO, restreaming, etc. Do not invent USD monthly starting prices — model is usage/credit-based in EUR.",
    fixturePlans: [
      "PLAN pro: name=Pro; amountPerUnit=2.50; currency=EUR; unit=attendee-credit; interval=year; maxLiveAttendees=3000; maxDurationHours=4",
      "PLAN enterprise: name=Enterprise; contactSales=true; currency=EUR; interval=custom; maxDurationHours=12",
    ],
    enrichmentPlans: [
      planPerUnit("pro", "Pro", 2.5, {
        currency: "EUR",
        unit: "credit",
        interval: "year",
        amountPeriod: "year",
        hasFreeTrial: true,
        highlighted: true,
        limits: { maxLiveAttendeesPerEvent: 3000, maxSessionHours: 4 },
        description:
          "€2.50 per attendee credit (yearly packs). Up to 4h/session; unlimited events, recording, team members; up to 3,000 live attendees/event.",
      }),
      contactSalesPlan("enterprise", "Enterprise", {
        description:
          "Custom attendee packaging; up to 12h/session; enterprise CRM integrations; custom analytics; dedicated CS; VIP support & SLA.",
      }),
    ],
    featureOverrides: {
      "social-scheduling": "unsupported",
      "content-calendar": "unsupported",
      "social-listening": "unsupported",
      "funnel-builder": "limited",
      "landing-pages": "supported",
      "marketing-automation": "limited",
      "forms-lead-capture": "supported",
      analytics: "supported",
      "ads-management": "unsupported",
      "reputation-reviews": "unsupported",
      webinars: "supported",
      "email-sms-channels": "limited",
      "team-collaboration": "supported",
      "ai-content-generation": "supported",
    },
    aiLines: [
      "AI transcription: supported",
      "AI summaries: supported",
      "AI assistant: supported",
      "AI automation: limited",
    ],
    integrations: [
      { integrationSlug: "hubspot", kind: "native" },
      { integrationSlug: "salesforce", kind: "native", notes: "Enterprise plan" },
      { integrationSlug: "marketo", kind: "native", notes: "Enterprise plan" },
      { integrationSlug: "pardot", kind: "native", notes: "Enterprise plan" },
      { integrationSlug: "brevo", kind: "native", notes: "Enterprise plan" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    limitations: [
      "Pricing is attendee-credit based (EUR), not a simple flat SaaS ladder",
      "Pro caps session length at 4 hours (12 on Enterprise)",
      "Deep CRM integrations (Salesforce, Marketo, Pardot) are Enterprise",
      "Not a social scheduling, listening, or full ESP platform",
      "Running out of attendee credits blocks new attendees until upgrade",
    ],
    limitationKinds: [
      "other",
      "plan-restriction",
      "plan-restriction",
      "feature-unavailable",
      "usage-cap",
    ],
    scores: {
      "ease-of-use": 8,
      "campaign-content": 7,
      "marketing-automation": 6,
      "funnel-conversion": 7,
      "analytics-attribution": 8,
      "brand-monitoring": 2,
      integrations: 8,
      scalability: 8,
      "value-for-money": 7,
      "ai-capabilities": 7,
    },
    scoreRationales: {
      "ease-of-use":
        "Livestorm markets browser-based, no-download events with intuitive registration and room UX aimed at marketing teams — strong usability positioning.",
      "campaign-content":
        "Registration pages, branded rooms, and email cadences support webinar campaigns; not a general campaign/content calendar suite.",
      "marketing-automation":
        "Email cadences and CRM sync help webinar workflows; deeper MA journeys live in connected tools — moderate by design.",
      "funnel-conversion":
        "Registration conversion, attendance rate, and webinar conversion analytics are first-party strengths for event-led funnels.",
      "analytics-attribution":
        "UTM capture, attendance, engagement, and conversion metrics are core post-event analytics — high for webinar attribution, not full multi-channel.",
      "brand-monitoring":
        "Not a social listening product — low score by design.",
      integrations:
        "HubSpot native on Pro; Salesforce/Marketo/Pardot/Dynamics/Brevo on Enterprise plus API/webhooks — strong marketing-stack connectivity.",
      scalability:
        "Up to 3,000 live attendees/event, unlimited team members, Enterprise duration/CS path — solid webinar scale.",
      "value-for-money":
        "Pay-for-actual-attendees (no-shows free; team free) is fair packaging; €2.50/credit and pack sizing still require volume planning — mid-strong excluding affiliate terms.",
      "ai-capabilities":
        "AI transcription, content repurposing, and AI Studio clips are marketed; live translations are add-ons — solid assistance, not unlimited AI.",
    },
    bestFor: [
      "Marketing teams running webinars and virtual product events",
      "Teams wanting browser-based events with CRM-connected registration",
      "Organizations preferring attendee-credit pricing over host seats",
    ],
    notIdealFor: [
      "Buyers needing social scheduling or brand listening as the core product",
      "Teams wanting an LMS/course platform (see LearnWorlds) or full ESP",
      "Orgs that need deep MA journeys without a connected automation tool",
    ],
    pros: [
      "Pay only for actual attendees (no-shows and team members free)",
      "Browser-based rooms with strong engagement features",
      "Registration pages, email cadences, and UTM analytics",
      "HubSpot native; enterprise CRM suite on higher plan",
      "EU-hosted, ISO 27001 and GDPR positioning",
    ],
    cons: [
      "Credit-pack pricing needs volume forecasting",
      "Pro session cap at 4 hours",
      "Enterprise required for several CRM integrations",
      "Not an ESP, LMS, or social suite",
      "Add-ons (AI Studio, translations, SSO) can expand cost",
    ],
    keyFeatures: [
      "Browser-based webinars up to 3,000 live attendees",
      "Registration pages and email cadences",
      "Polls, Q&A, chat, reactions, and recording/replays",
      "CRM integrations (HubSpot; Enterprise CRM suite)",
      "UTM, attendance, and conversion analytics",
      "AI transcription and content repurposing",
    ],
    pricingSummary:
      "Pro from €2.50 per attendee credit (yearly packs; 1 credit per unique participant per session). Enterprise custom. Free trial available. Confirm current packaging on livestorm.co/pricing/ — do not assume a published USD monthly floor.",
    whoShouldChoose:
      "Choose Livestorm when webinars and virtual events for marketing teams are the primary job — especially if you want browser-based rooms and pay-for-attendees pricing.",
    whoShouldConsiderAlternatives:
      "Compare Kartra when you need funnels/email/courses beyond events, Freshmarketer for marketing automation journeys, and SocialBee if social scheduling is the primary need.",
    alternativeSlugs: ["kartra", "freshmarketer", "socialbee"],
    competitorSlugs: [
      "zoom",
      "goto-webinar",
      "webinarjam",
      "demio",
      "bigmarker",
    ],
    comparableSlugs: ["kartra"],
    secondaryCategorySlugs: [],
    subcategorySlugs: [],
    useCaseSlugs: [
      "lead-generation",
      "multichannel-campaigns",
      "creator-marketing",
    ],
    teamTypeSlugs: ["marketing"],
    businessSizeSlugs: ["small-business", "mid-market"],
    officialVideos: [
      {
        title: "Livestorm live demo webinar (official site)",
        url: "https://livestorm.co/",
        notes: "Homepage promotes live demo webinar — embed videoId not captured in text crawl",
      },
    ],
    catalogueSourceId: "aff-livestorm",
    affiliateUrl: null,
  },
];

function avgScore(scores) {
  const vals = MKT_CRITERIA.map((c) => scores[c]);
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
  const raw = p.featureOverrides?.[feature] ?? "unknown";
  // Schema uses not-supported (not "unsupported")
  if (raw === "unsupported") return "not-supported";
  return raw;
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
      notes: `First-party product positioning for ${p.name} (Marketing Wave-2 onboarding 2026-08-17).`,
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

CURRENCY: ${p.currency ?? "USD"}
PRICING_MODEL: ${p.pricingModel}
FREE_PLAN: ${p.hasFreePlan}
FREE_TRIAL: ${p.hasFreeTrial}
${p.trialDays ? `TRIAL_DAYS: ${p.trialDays}` : ""}
${p.startingPriceMonthly !== undefined ? `STARTING_PRICE_MONTHLY: ${p.startingPriceMonthly}` : ""}

NOTES:
${p.pricingNotes}

PLANS:
${p.fixturePlans.map((line) => `- ${line}`).join("\n")}
`;
}

function buildProductFixture(p) {
  const featureLines = MKT_FEATURES.map(
    (f) => `FEATURE ${f}: ${featureAvailability(p, f)}`,
  ).join("\n");
  const ai = (p.aiLines ?? []).map((l) => `AI ${l}`).join("\n");
  return `# FIXTURE SNAPSHOT — structured from first-party research (2026-08-17)

SHORT_DESCRIPTION: ${p.shortDescription}
VENDOR_POSITIONING: ${p.vendorPositioning}
MEMBERSHIP_ROLE: ${p.membershipRole}
PRIMARY_CATEGORY: marketing

${featureLines}

${ai}
`;
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
    "ease-of-use": "content-calendar",
    "campaign-content": "social-scheduling",
    "marketing-automation": "marketing-automation",
    "funnel-conversion": "funnel-builder",
    "analytics-attribution": "analytics",
    "brand-monitoring": "social-listening",
    integrations: "team-collaboration",
    scalability: "marketing-automation",
    "value-for-money": "landing-pages",
    "ai-capabilities": "ai-content-generation",
  };
  return map[criterionSlug] ?? "marketing-automation";
}

function buildEnrichment(p) {
  const slugs = planSlugs(p);
  const featureSupport = MKT_FEATURES.map((featureSlug) => ({
    featureSlug,
    availability: featureAvailability(p, featureSlug),
    planSlugs: slugs,
    sourceIds: [`${p.slug}-product-official`],
  }));

  const pricing = {
    currency: p.currency ?? "USD",
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
      businessSizeSlug === "mid-market"
        ? "moderate"
        : businessSizeSlug === "micro" || businessSizeSlug === "small-business"
          ? "strong"
          : "moderate";
    return {
      businessSizeSlug,
      teamTypeSlug: "marketing",
      strength,
      rationale: `${p.name} fit for ${businessSizeSlug} marketing teams from first-party positioning and Marketing Wave-2 research.`,
      isEditorial: true,
    };
  });

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
    media: [],
    sourceIds: [
      `${p.slug}-product-official`,
      `${p.slug}-pricing-official`,
      ...(p.sourcesExtra ?? []).map((s) => s.id),
    ],
    notes: `Marketing Wave-2 onboarding enrichment from first-party research ${VERIFIED_AT}. handsOnTesting=false. membershipRole=${p.membershipRole}. primaryCategorySlug=marketing.`,
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
    notes: "Marketing Wave-2 first-party research extract",
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
  for (const featureSlug of MKT_FEATURES) {
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
  return MKT_CRITERIA.map((criterionSlug) => {
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
  return {
    id: `assessment-${p.slug}-marketing-v1`,
    productSlug: p.slug,
    methodologySlug: "marketing-editorial",
    methodologyVersion: "1.0.0",
    status: "approved",
    verdict: `${p.name}: ${p.whoShouldChoose} Scores use the marketing-editorial methodology from first-party research as of 2026-08-17 — not hands-on product testing.`,
    strengths: p.pros.slice(0, 5),
    weaknesses: p.cons.slice(0, 5),
    bestFor: p.bestFor,
    notIdealFor: p.notIdealFor,
    tradeoffs: [
      "Specialist depth (listening vs scheduling vs funnels) vs all-in-one breadth",
      "Published entry price vs contact/profile/mention upgrade pressure",
      "Marketing automation / email depth vs pure ESP peers",
    ],
    recommendation: `${p.whoShouldChoose} ${p.whoShouldConsiderAlternatives}`,
    editorialNotes: `Marketing Wave-2 batch. Approved on marketing-editorial v1.0.0. membershipRole=${p.membershipRole}. primaryCategorySlug=marketing. handsOnTesting=false. Affiliate economics excluded.`,
    handsOnTesting: false,
    confidence: "medium",
    criterionAssessments,
    overallScore,
    overallScoreRationale:
      "Equal-weight average of 10 marketing-editorial criteria, rounded to 1 decimal. Not a hands-on lab score. Specialist tools score low on non-core criteria by design.",
    scoreAudit: [
      {
        at: VERIFIED_AT,
        actor: "editorial",
        change:
          "Marketing Wave-2 onboarding; approved marketing criteria; handsOnTesting=false",
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

  return {
    id: `review-${p.slug}-v1`,
    productSlug: p.slug,
    assessmentId: `assessment-${p.slug}-marketing-v1`,
    editorialStatus: "approved",
    title: `${p.name} Review (2026)`,
    h1: `${p.name} Review`,
    intro: `${p.name} is evaluated here as Marketing & Growth software — ${p.shortDescription} This review uses SoftwareGlimpse’s marketing methodology (ease of use, campaign/content tools, marketing automation, funnel/conversion, analytics, brand monitoring, integrations, scalability, value, AI). It is based on first-party research, not hands-on lab testing.`,
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
    methodologySlug: "marketing-editorial",
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
        question: `Is ${p.name} email marketing software?`,
        answer:
          p.secondaryCategorySlugs?.includes("email-marketing")
            ? `${p.name} is primarily Marketing & Growth software with meaningful email/SMS capability — email-marketing is a secondary membership, not the primary ESP category.`
            : `No. ${p.name} is evaluated as Marketing & Growth software. For core ESP/newsletter tools, see email-marketing category peers like GetResponse or AWeber.`,
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
      {
        question: `Who should choose ${p.name}?`,
        answer: p.whoShouldChoose,
      },
      {
        question: `What are the main limitations of ${p.name}?`,
        answer: p.limitations.slice(0, 3).join(" "),
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
        id: "features",
        heading: "Key features",
        body: p.keyFeatures.map((f) => `• ${f}`).join("\n"),
      },
      {
        id: "limitations",
        heading: "Limitations",
        body: p.limitations.map((l) => `• ${l}`).join("\n"),
      },
      {
        id: "alternatives",
        heading: "Alternatives",
        body: p.whoShouldConsiderAlternatives,
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
      title: `${p.name} Review (2026) — Marketing & Growth`,
      description: `${p.name} marketing software review on SoftwareGlimpse: strengths, trade-offs, pricing posture, and who should buy.`,
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
    primaryCategorySlug: "marketing",${secondary}
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
    path.join(fixturesDir, `${p.slug}-pricing-official.txt`),
    buildPricingFixture(p),
  );
  writeText(
    path.join(fixturesDir, `${p.slug}-product-fixture.txt`),
    buildProductFixture(p),
  );
  writeText(
    path.join(fixturesDir, `${p.slug}-product-official.txt`),
    buildProductFixture(p),
  );
  writeJson(path.join(researchDir, "enrichment.json"), buildEnrichment(p));
  writeJson(path.join(researchDir, "facts.json"), buildFacts(p));
  writeJson(path.join(researchDir, "conflicts.json"), []);
  writeJson(path.join(researchDir, "jobs.json"), [
    {
      id: `job-${p.slug}-marketing-wave2`,
      productSlug: p.slug,
      domains: [
        "identity",
        "pricing",
        "plans",
        "features",
        "integrations",
        "free-trial",
        "free-plan",
        "limits",
        "ai-capabilities",
        "product-positioning",
      ],
      status: "approved",
      createdAt: VERIFIED_AT,
      updatedAt: VERIFIED_AT,
      completedAt: VERIFIED_AT,
      dryRun: false,
      allowFixtures: true,
      sourceIds: [
        `${p.slug}-product-official`,
        `${p.slug}-pricing-official`,
        ...(p.sourcesExtra ?? []).map((s) => s.id),
      ],
      snapshotIds: [],
      factIds: [],
      conflictIds: [],
      errors: [],
      notes: `Marketing Wave-2 batch; membershipRole=${p.membershipRole}; primaryCategorySlug=marketing`,
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
    `✓ ${p.slug}  overall=${assessment.overallScore}  role=${p.membershipRole}  secondary=${(p.secondaryCategorySlugs ?? []).join(",") || "-"}`,
  );
}

function writeSeedSnippet(products) {
  const out = path.join(ROOT, "scripts/_marketing-batch-seed-snippet.ts");
  const body = `// Auto-generated by scripts/onboard-marketing-batch.mjs
// Append into src/data/seed/software.ts before the closing ]; of softwareSeed.
// Prefer: node scripts/patch-software-seed-marketing.mjs

${products.map(softSnippet).join("\n")}
`;
  writeText(out, body);
  console.log(`✓ seed snippet → ${path.relative(ROOT, out)}`);
}

function writeVideoImportSpec(products) {
  const videos = [];
  for (const p of products) {
    for (const v of p.officialVideos ?? []) {
      if (v.videoId) {
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
      } else {
        videos.push({
          product: p.slug,
          title: v.title,
          url: v.url,
          notes: v.notes,
          org: p.company,
          assetType: "official-webinar-or-demo-page",
          status: "needs-video-id",
        });
      }
    }
  }
  writeJson(path.join(ROOT, "scripts/_marketing-batch-official-videos.json"), videos);
  console.log(`✓ video specs → ${videos.length} entries`);
}

function writeAffiliateHints(products) {
  const rows = products.map((p) => ({
    productSlug: p.slug,
    catalogueSourceId: p.catalogueSourceId ?? null,
    affiliateUrl: p.affiliateUrl ?? null,
    enable:
      Boolean(p.affiliateUrl) &&
      Boolean(p.catalogueSourceId),
  }));
  writeJson(path.join(ROOT, "scripts/_marketing-batch-affiliate-hints.json"), rows);
  console.log(
    `✓ affiliate hints → ${rows.filter((r) => r.enable).length}/${rows.length} with live URLs`,
  );
}

function main() {
  const filter = process.argv.slice(2).filter((a) => !a.startsWith("-"));
  const selected = filter.length
    ? PRODUCTS.filter((p) => filter.includes(p.slug))
    : PRODUCTS;
  if (!selected.length) {
    console.error(
      `No matching products for filter: ${filter.join(", ")}\nKnown: ${PRODUCTS.map((p) => p.slug).join(", ")}`,
    );
    process.exit(1);
  }
  for (const p of selected) writeProduct(p);
  writeSeedSnippet(selected);
  writeVideoImportSpec(selected);
  writeAffiliateHints(selected);
  console.log("\nOverall scores:");
  for (const p of selected) {
    console.log(`  ${p.slug}: ${avgScore(p.scores)}`);
  }
  console.log("\nNext:");
  console.log("  1. Patch software.ts via scripts/patch-software-seed-marketing.mjs");
  console.log("  2. Enable affiliates: npm run affiliate:set -- <slug> --url <url> --default");
  console.log("  3. Exclude Zypper: npm run catalogue -- review aff-zypper --decision exclude --notes \"...\"");
  console.log("  4. Download / generate brand logos under public/brands/");
  console.log("  5. Content quality audit — target ≥75");
}

main();
