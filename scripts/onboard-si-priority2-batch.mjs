#!/usr/bin/env node
/**
 * Sales Intelligence Priority-2 products:
 * 6sense, Demandbase, Seamless.AI, Clay, Clearbit (Breeze Intelligence), Bombora.
 *
 * Usage: node scripts/onboard-si-priority2-batch.mjs
 * Idempotent — overwrites product research / editorial packs.
 *
 * Does NOT auto-publish. Affiliate economics never enter scores.
 * Grounded in first-party research packs gathered 2026-08-17.
 *
 * Schema notes (vs broken P1 initial shapes):
 * - Facts: extractedAt/normalizedAt/verifiedAt/approvedAt, isFixture, notes;
 *   evidence = {sourceId, excerpt?, locator?} only; no valueType/createdAt/updatedAt/approvedBy.
 * - Enrichment: domainCheckedAt domain→ISO map; limitations with kind;
 *   editorialFit array; AI capability enum; integrations without availability.
 * - Reviews: ProductReviewSchema (alternativeSlugs, comparisonSlugs, string keyFeatures/
 *   limitations, metadata/seo, lastUpdatedAt — no top-level reviewedAt/reviewer/createdAt/updatedAt).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const VERIFIED_AT = "2026-08-17T11:00:00.000Z";
const PUBLISHED_AT = "2026-08-17T00:00:00.000Z";

const RELATED_GUIDE_PATHS = [
  "/guides/how-to-choose-sales-intelligence/",
  "/guides/what-is-sales-intelligence/",
  "/best/sales-intelligence-software/",
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
];

const SI_CRITERIA = [
  "contact-data",
  "prospecting",
  "data-enrichment",
  "email-outreach",
  "crm-sync",
  "ease-of-use",
  "reporting",
  "value-for-money",
];

const SI_FEATURES = [
  "contact-data",
  "prospecting",
  "data-enrichment",
  "email-outreach",
  "email-sequences",
  "crm-sync",
  "lead-management",
  "reporting",
  "ai-assistance",
  "lead-scoring",
  "integrations",
  "contact-management",
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
    ...extra.fields,
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
    rules: [],
    ...extra.fields,
  };
}

function planPerSeat(slug, name, monthly, extra = {}) {
  return {
    id: `plan-${slug}`,
    slug,
    name,
    isFree: false,
    contactSales: false,
    hasFreeTrial: Boolean(extra.hasFreeTrial),
    trialDays: extra.trialDays,
    highlighted: Boolean(extra.highlighted),
    currency: "USD",
    amountPerSeat: monthly,
    interval: "month",
    billingInterval: extra.billingInterval ?? "month",
    unit: "seat",
    rules: [],
  };
}

function comparisonSlugPair(a, b) {
  return [a, b].sort().join("-vs-");
}

/** @type {object[]} */
const PRODUCTS = [
  {
    slug: "sixsense",
    name: "6sense",
    company: "6sense",
    website: "https://6sense.com",
    domain: "6sense.com",
    pricingUrl: "https://6sense.com/platform/sales/pricing/",
    aliases: ["6sense", "6sense Sales Intelligence"],
    softShortDescription:
      "Enterprise ABM and sales intelligence platform for predictive intent, account prioritization, and revenue-team orchestration — custom-quote packaging.",
    shortDescription:
      "Enterprise account-based marketing and sales intelligence platform that combines predictive buying intent, contact/account data, and go-to-market orchestration for mid-market and enterprise revenue teams.",
    vendorPositioning:
      "6sense helps B2B revenue teams identify in-market accounts, prioritize buyers, and orchestrate personalized engagement with predictive AI and sales intelligence.",
    pricingModel: "custom-quote",
    hasFreePlan: false,
    hasFreeTrial: false,
    pricingNotes:
      "6sense Sales Intelligence packaging is quote-led (SI + Credits, SI + Predictive, SI + Credits + Predictive style bundles). No public seat dollar list prices on the sales pricing surface — contact sales. Confirm current modules and credit consumption with 6sense.",
    fixturePlans: [
      "PLAN si-credits-predictive: name=SI + Credits + Predictive; contactSales=true; currency=USD; interval=month; billingInterval=month; unit=seat",
      "PLAN si-credits: name=SI + Credits; contactSales=true; currency=USD; interval=month; billingInterval=month; unit=seat",
      "PLAN si-predictive: name=SI + Predictive; contactSales=true; currency=USD; interval=month; billingInterval=month; unit=seat",
    ],
    enrichmentPlans: [
      contactSalesPlan("si-credits-predictive", "SI + Credits + Predictive", {
        highlighted: true,
      }),
      contactSalesPlan("si-credits", "SI + Credits"),
      contactSalesPlan("si-predictive", "SI + Predictive"),
    ],
    featureOverrides: {
      "contact-data": "supported",
      prospecting: "supported",
      "data-enrichment": "supported",
      "email-outreach": "supported",
      "email-sequences": "limited",
      "crm-sync": "supported",
      "lead-management": "limited",
      reporting: "supported",
      "ai-assistance": "supported",
      "lead-scoring": "supported",
      integrations: "supported",
      "contact-management": "supported",
    },
    aiLines: [
      "AI lead-scoring: supported",
      "AI recommendations: supported",
      "AI forecasting: supported",
      "AI assistant: supported",
      "AI automation: limited",
    ],
    integrations: [
      { integrationSlug: "salesforce", kind: "native" },
      { integrationSlug: "hubspot", kind: "native" },
      { integrationSlug: "marketo", kind: "native" },
      { integrationSlug: "outreach", kind: "native" },
      { integrationSlug: "salesloft", kind: "native" },
    ],
    limitations: [
      "Seat and module prices are not published — packaging is custom quote",
      "Enterprise ABM / predictive stack carries material implementation and admin overhead",
      "Native email sequencing depth is limited versus dedicated sales engagement platforms",
      "Best value assumes mid-market/enterprise ABM motions — overkill for SMB contact lookup",
      "Credit and predictive modules require ongoing governance of account coverage",
    ],
    limitationKinds: [
      "high-cost-at-scale",
      "other",
      "feature-unavailable",
      "plan-restriction",
      "usage-cap",
    ],
    scores: {
      "contact-data": 7,
      prospecting: 8,
      "data-enrichment": 8,
      "email-outreach": 6,
      "crm-sync": 8,
      "ease-of-use": 5,
      reporting: 8,
      "value-for-money": 5,
    },
    scoreRationales: {
      "contact-data":
        "6sense documents contact and account intelligence as part of the sales platform, but its center of gravity is predictive intent and ABM prioritization rather than being the category’s deepest standalone contact database.",
      prospecting:
        "Account and buyer prioritization, in-market signals, and sales workflows are first-party strengths for enterprise prospecting motions that start from accounts, not only people searches.",
      "data-enrichment":
        "Enrichment of accounts/contacts and buying-stage context is core to the predictive ABM story — enrichment serves orchestration, not just CSV fill.",
      "email-outreach":
        "Sales engagement assist and orchestration exist, but native multichannel sequencing is not the primary product job versus Outreach/Salesloft-class tools — score reflects assist depth, not sequencer leadership.",
      "crm-sync":
        "Native CRM and marketing-automation connectors (Salesforce, HubSpot, Marketo, and sales engagement tools) are first-party documented for enterprise stacks.",
      "ease-of-use":
        "Powerful but enterprise-packaged: predictive models, credits, and ABM admin raise the learning curve versus self-serve SMB SI tools.",
      reporting:
        "Account journey, pipeline influence, and revenue-team reporting are positioned as first-class for ABM and sales intelligence buyers.",
      "value-for-money":
        "No published list prices and enterprise packaging make value opaque for SMB buyers; teams that will run predictive ABM at scale may still justify cost — score reflects transparency and accessibility.",
    },
    bestFor: [
      "Enterprise and upper mid-market ABM teams that prioritize in-market accounts with predictive intent",
      "Revenue orgs orchestrating marketing + sales on shared account intelligence",
      "Buyers who need predictive scoring and sales intelligence in one enterprise platform",
    ],
    notIdealFor: [
      "SMB teams that need transparent published seat pricing and self-serve onboarding",
      "Buyers who only want a lightweight contact database or sequencer",
      "Teams without an ABM or account-based GTM motion",
    ],
    pros: [
      "Predictive buying intent and account prioritization for enterprise ABM",
      "Sales intelligence packaged with credits and predictive modules",
      "Strong CRM / MAP / sales-engagement integration surface",
      "Reporting oriented to account journey and pipeline influence",
      "Designed for mid-market and enterprise revenue orchestration",
    ],
    cons: [
      "Custom-quote only — no public seat dollar prices",
      "Implementation and admin overhead are material",
      "Native sequencing is limited vs dedicated engagement suites",
      "Overkill for founders who only need occasional contact lookups",
      "Credit/module governance adds ongoing ops cost",
    ],
    keyFeatures: [
      "Predictive buying intent and in-market account signals",
      "Sales intelligence contact and account data",
      "ABM prioritization and orchestration workflows",
      "CRM and marketing-automation sync",
      "Revenue and account-journey reporting",
    ],
    pricingSummary:
      "Custom-quote Sales Intelligence packages (SI + Credits, SI + Predictive, SI + Credits + Predictive). No published seat dollar prices on 6sense sales pricing. Confirm current modules and credits with 6sense.",
    whoShouldChoose:
      "Choose 6sense when enterprise predictive intent and ABM account prioritization are the primary jobs and you can run a custom-quote evaluation.",
    whoShouldConsiderAlternatives:
      "Compare Demandbase for competing ABM orchestration, ZoomInfo for deeper enterprise contact databases, Apollo for self-serve data+engagement, and Clay for modern multi-provider enrichment workflows.",
    alternativeSlugs: ["demandbase", "zoominfo", "apollo", "clay"],
    competitorSlugs: ["demandbase", "zoominfo", "apollo", "clay"],
    comparableSlugs: ["demandbase", "zoominfo"],
    subcategorySlugs: ["prospecting", "contact-data"],
    useCaseSlugs: ["prospecting", "data-enrichment", "lead-management"],
    teamTypeSlugs: ["sales", "marketing", "revops"],
    businessSizeSlugs: ["mid-market", "enterprise"],
    officialVideos: [
      {
        videoId: "DjzS_DZOEYw",
        title: "How 6sense BDRs Use Rich Intelligence to Book More Meetings",
        channel: "6sense",
        shows: [
          "BDR workflow using 6sense sales intelligence",
          "Account and buyer signal prioritization",
        ],
        features: ["prospecting", "contact-data", "ai-assistance"],
      },
    ],
    sourcesExtra: [
      {
        id: "sixsense-platform",
        url: "https://6sense.com/platform/",
        title: "6sense Platform",
        domains: ["features", "product-positioning", "ai-capabilities"],
      },
      {
        id: "sixsense-sales",
        url: "https://6sense.com/platform/sales/",
        title: "6sense for Sales",
        domains: ["features", "product-positioning"],
      },
      {
        id: "sixsense-integrations",
        url: "https://6sense.com/integrations/",
        title: "6sense Integrations",
        domains: ["integrations"],
      },
    ],
  },
  {
    slug: "demandbase",
    name: "Demandbase",
    company: "Demandbase",
    website: "https://www.demandbase.com",
    domain: "demandbase.com",
    pricingUrl: "https://www.demandbase.com/pricing/",
    aliases: ["Demandbase One"],
    softShortDescription:
      "Enterprise ABM platform (Demandbase One) for account intelligence, intent, and go-to-market orchestration — custom-quote packaging.",
    shortDescription:
      "Enterprise account-based experience platform (Demandbase One) that unifies account intelligence, buying signals, advertising, and sales/marketing orchestration for B2B revenue teams.",
    vendorPositioning:
      "Demandbase One is the account-based go-to-market platform that helps B2B companies identify, engage, and close their best-fit accounts.",
    pricingModel: "custom-quote",
    hasFreePlan: false,
    hasFreeTrial: false,
    pricingNotes:
      "Demandbase One is sold as a custom-quote enterprise platform. No public seat dollar list prices on demandbase.com/pricing — contact sales. Confirm current modules (ABX, advertising, sales, data) with Demandbase.",
    fixturePlans: [
      "PLAN demandbase-one: name=Demandbase One; contactSales=true; currency=USD; interval=month; billingInterval=month; unit=seat",
    ],
    enrichmentPlans: [
      contactSalesPlan("demandbase-one", "Demandbase One", {
        highlighted: true,
      }),
    ],
    featureOverrides: {
      "contact-data": "supported",
      prospecting: "supported",
      "data-enrichment": "supported",
      "email-outreach": "limited",
      "email-sequences": "limited",
      "crm-sync": "supported",
      "lead-management": "limited",
      reporting: "supported",
      "ai-assistance": "supported",
      "lead-scoring": "supported",
      integrations: "supported",
      "contact-management": "supported",
    },
    aiLines: [
      "AI lead-scoring: supported",
      "AI recommendations: supported",
      "AI assistant: limited",
      "AI automation: limited",
    ],
    integrations: [
      { integrationSlug: "salesforce", kind: "native" },
      { integrationSlug: "hubspot", kind: "native" },
      { integrationSlug: "marketo", kind: "native" },
      { integrationSlug: "pardot", kind: "native" },
      { integrationSlug: "outreach", kind: "native" },
    ],
    limitations: [
      "Demandbase One pricing is custom quote only — no published seat list prices",
      "Enterprise ABM scope means substantial implementation and change-management cost",
      "Native email sequencing is limited versus dedicated sales engagement tools",
      "Email outreach depth is secondary to account orchestration and advertising",
      "Overkill for teams that only need a contact database without ABM programs",
    ],
    limitationKinds: [
      "high-cost-at-scale",
      "other",
      "feature-unavailable",
      "feature-unavailable",
      "plan-restriction",
    ],
    scores: {
      "contact-data": 7,
      prospecting: 8,
      "data-enrichment": 8,
      "email-outreach": 4,
      "crm-sync": 8,
      "ease-of-use": 5,
      reporting: 8,
      "value-for-money": 5,
    },
    scoreRationales: {
      "contact-data":
        "Demandbase documents account and people intelligence inside Demandbase One, but it is primarily an ABX/ABM orchestration platform rather than a pure contact-database specialist.",
      prospecting:
        "Account identification, intent, and sales play prioritization are core — strong for account-based prospecting, not SMB people-search UX.",
      "data-enrichment":
        "Firmographic, technographic, and intent enrichment of target accounts is central to the Demandbase One data story.",
      "email-outreach":
        "Outreach is mostly via integrated sales engagement and marketing channels; native email sequencing is limited — score reflects orchestration assist, not sequencer depth.",
      "crm-sync":
        "Native Salesforce/HubSpot/MAP connectors are first-party strengths for enterprise ABM stacks.",
      "ease-of-use":
        "Enterprise ABX configuration, advertising, and data ops raise complexity versus self-serve SI tools.",
      reporting:
        "Account engagement, pipeline, and ABM performance reporting are positioned as first-class for enterprise buyers.",
      "value-for-money":
        "Opaque custom packaging and enterprise scope hold the score down for price-sensitive buyers; justified when full ABX programs are in scope.",
    },
    bestFor: [
      "Enterprise B2B teams running account-based marketing and sales orchestration",
      "Revenue orgs that need intent + advertising + CRM-connected ABM in one platform",
      "Mid-market/enterprise buyers comparing Demandbase One vs 6sense-class ABM stacks",
    ],
    notIdealFor: [
      "SMB teams needing self-serve contact data with published pricing",
      "Buyers whose primary job is multichannel email sequencing",
      "Teams without an account-based GTM program",
    ],
    pros: [
      "Unified Demandbase One ABX platform spanning data, engagement, and orchestration",
      "Strong account intelligence and intent for enterprise ABM",
      "Deep CRM and marketing-automation integrations",
      "Lead scoring and account prioritization documented first-party",
      "Reporting oriented to account engagement and pipeline",
    ],
    cons: [
      "Custom-quote only with no public seat prices",
      "Heavyweight for teams that only need contact lookup",
      "Native email sequencing is limited",
      "Implementation overhead is material",
      "Email outreach score reflects orchestration, not a built-in sequencer",
    ],
    keyFeatures: [
      "Demandbase One account-based experience platform",
      "Account intelligence and buying signals",
      "ABM orchestration across sales and marketing",
      "CRM and MAP sync",
      "Account engagement and pipeline reporting",
    ],
    pricingSummary:
      "Demandbase One is custom-quote enterprise packaging. No published seat dollar prices on demandbase.com/pricing. Confirm current modules with Demandbase.",
    whoShouldChoose:
      "Choose Demandbase when enterprise account-based orchestration (data + engagement + ABM) is the buying job and you can run a custom-quote evaluation.",
    whoShouldConsiderAlternatives:
      "Compare 6sense for predictive ABM peers, ZoomInfo for deeper contact databases, and Apollo for self-serve data+engagement.",
    alternativeSlugs: ["sixsense", "zoominfo", "apollo"],
    competitorSlugs: ["sixsense", "zoominfo", "apollo"],
    comparableSlugs: ["sixsense", "zoominfo"],
    subcategorySlugs: ["prospecting", "contact-data"],
    useCaseSlugs: ["prospecting", "data-enrichment", "lead-management"],
    teamTypeSlugs: ["sales", "marketing", "revops"],
    businessSizeSlugs: ["mid-market", "enterprise"],
    officialVideos: [
      {
        videoId: "1G5ItvG8ivU",
        title: "Demandbase One. Something for Everyone.",
        channel: "Demandbase",
        shows: [
          "Demandbase One platform overview",
          "Account-based go-to-market framing",
        ],
        features: ["prospecting", "data-enrichment", "reporting"],
      },
    ],
    sourcesExtra: [
      {
        id: "demandbase-one",
        url: "https://www.demandbase.com/platform/",
        title: "Demandbase One Platform",
        domains: ["features", "product-positioning", "ai-capabilities"],
      },
      {
        id: "demandbase-sales",
        url: "https://www.demandbase.com/products/sales/",
        title: "Demandbase for Sales",
        domains: ["features", "product-positioning"],
      },
      {
        id: "demandbase-integrations",
        url: "https://www.demandbase.com/integrations/",
        title: "Demandbase Integrations",
        domains: ["integrations"],
      },
    ],
  },
  {
    slug: "seamless-ai",
    name: "Seamless.AI",
    company: "Seamless Contacts",
    website: "https://seamless.ai",
    domain: "seamless.ai",
    pricingUrl: "https://seamless.ai/pricing",
    aliases: ["Seamless", "Seamless.AI"],
    softShortDescription:
      "High-volume B2B contact and sales intelligence platform with freemium entry, Chrome prospecting, and CRM sync — Pro/Enterprise quote-led.",
    shortDescription:
      "B2B sales intelligence and contact platform for finding verified emails and phone numbers, prospecting via Chrome/LinkedIn workflows, enrichment, and CRM sync — with a free plan and paid Pro/Enterprise tiers.",
    vendorPositioning:
      "Seamless.AI helps sales teams find accurate B2B contact data and book more meetings with real-time search and sales intelligence.",
    pricingModel: "subscription",
    hasFreePlan: true,
    hasFreeTrial: false,
    pricingNotes:
      "Freemium entry with a Free plan; Pro and Enterprise are contact-sales / paid subscription packaging on seamless.ai/pricing. Treat as subscription with a free rung rather than pure usage. Confirm current credit and seat limits on the live pricing page.",
    fixturePlans: [
      "PLAN free: name=Free; isFree=true; currency=USD; interval=month; billingInterval=month",
      "PLAN pro: name=Pro; contactSales=true; currency=USD; interval=month; billingInterval=month; unit=seat",
      "PLAN enterprise: name=Enterprise; contactSales=true; currency=USD; interval=month; billingInterval=month; unit=seat",
    ],
    enrichmentPlans: [
      freePlan("free", "Free"),
      contactSalesPlan("pro", "Pro", { highlighted: true }),
      contactSalesPlan("enterprise", "Enterprise"),
    ],
    featureOverrides: {
      "contact-data": "supported",
      prospecting: "supported",
      "data-enrichment": "supported",
      "email-outreach": "supported",
      "email-sequences": "supported",
      "crm-sync": "supported",
      "lead-management": "supported",
      reporting: "supported",
      "ai-assistance": "supported",
      "lead-scoring": "supported",
      integrations: "supported",
      "contact-management": "supported",
    },
    aiLines: [
      "AI email-generation: supported",
      "AI assistant: supported",
      "AI recommendations: limited",
      "AI automation: limited",
    ],
    integrations: [
      { integrationSlug: "salesforce", kind: "native" },
      { integrationSlug: "hubspot", kind: "native" },
      { integrationSlug: "pipedrive", kind: "native" },
      { integrationSlug: "outreach", kind: "native" },
      { integrationSlug: "salesloft", kind: "zapier-style" },
    ],
    limitations: [
      "Pro and Enterprise list prices are often quote-led rather than fully self-serve published dollars",
      "Data accuracy still requires buyer verification workflows — not a lab-audited guarantee",
      "Free plan limits make serious outbound volume a paid conversation quickly",
      "Not a full CRM system of record",
      "Chrome/LinkedIn prospecting workflows carry platform compliance risk some orgs reject",
    ],
    limitationKinds: [
      "plan-restriction",
      "other",
      "usage-cap",
      "feature-unavailable",
      "other",
    ],
    scores: {
      "contact-data": 8,
      prospecting: 8,
      "data-enrichment": 7,
      "email-outreach": 8,
      "crm-sync": 8,
      "ease-of-use": 7,
      reporting: 7,
      "value-for-money": 6,
    },
    scoreRationales: {
      "contact-data":
        "Seamless.AI’s core job is B2B email/phone contact discovery with real-time search — strong for high-volume contact data buyers.",
      prospecting:
        "Chrome extension and LinkedIn-adjacent prospecting workflows are first-party strengths for SDR list building.",
      "data-enrichment":
        "Enrichment of leads/contacts into CRM is documented; depth is solid for SMB/mid-market outbound rather than enterprise waterfall orchestration.",
      "email-outreach":
        "Outreach and sequencing capabilities are part of the sales platform story — stronger execution than pure ABM intent tools.",
      "crm-sync":
        "Native CRM connectors (Salesforce, HubSpot, Pipedrive, and more) are first-party documented.",
      "ease-of-use":
        "Chrome-first prospecting is approachable for SDRs; credit/plan limits add moderate ops overhead.",
      reporting:
        "Usage and activity reporting support outbound coaching, though Seamless is not primarily a BI suite.",
      "value-for-money":
        "Free plan helps evaluation, but Pro/Enterprise opacity and credit limits hold the score to moderate for price-sensitive teams.",
    },
    bestFor: [
      "SMB and mid-market SDR teams that need high-volume email/phone contact data",
      "Reps who prospect heavily via Chrome/LinkedIn capture workflows",
      "Teams that want freemium entry before committing to Pro/Enterprise",
    ],
    notIdealFor: [
      "Enterprise ABM teams whose primary job is predictive intent orchestration",
      "Buyers who need fully transparent published dollars on every paid tier before shortlisting",
      "Organizations that cannot accept Chrome/LinkedIn prospecting compliance risk",
    ],
    pros: [
      "Strong contact-data and prospecting motion for high-volume outbound",
      "Free plan lowers evaluation friction",
      "CRM sync with major sales CRMs",
      "Email outreach and sequencing support beyond pure data lookup",
      "Familiar Chrome extension workflow for SDRs",
    ],
    cons: [
      "Paid Pro/Enterprise packaging can be quote-opaque",
      "Free limits push serious volume to paid quickly",
      "Not an enterprise ABM predictive platform",
      "Data quality still needs buyer verification discipline",
      "LinkedIn/Chrome workflows may conflict with compliance policies",
    ],
    keyFeatures: [
      "Real-time B2B email and phone search",
      "Chrome extension prospecting",
      "Contact and company enrichment",
      "CRM sync for Salesforce/HubSpot and peers",
      "Email outreach and sales workflow tools",
    ],
    pricingSummary:
      "Subscription with a Free plan; Pro and Enterprise are paid/contact-sales tiers on seamless.ai/pricing. No self-serve free trial called out as primary evaluation path — Free plan is the entry rung. Confirm current limits and dollars on Seamless.AI.",
    whoShouldChoose:
      "Choose Seamless.AI when high-volume contact discovery and Chrome-led prospecting are the primary jobs and a free entry tier matters.",
    whoShouldConsiderAlternatives:
      "Compare Apollo for data+sequences with clearer published paid rungs, Lusha for enrichment-first SMB data, ZoomInfo for enterprise depth, and Clay for multi-provider enrichment workflows.",
    alternativeSlugs: ["apollo", "lusha", "zoominfo", "clay"],
    competitorSlugs: ["apollo", "lusha", "zoominfo", "clay"],
    comparableSlugs: ["apollo", "lusha"],
    subcategorySlugs: ["contact-data", "prospecting"],
    useCaseSlugs: ["prospecting", "data-enrichment", "email-outreach"],
    teamTypeSlugs: ["sales", "revops"],
    businessSizeSlugs: ["small-business", "mid-market"],
    officialVideos: [
      {
        videoId: "zYvxvkyLS3c",
        title: "How to Use the Seamless Chrome Extension on LinkedIn",
        channel: "Seamless.AI",
        shows: [
          "Chrome extension prospecting on LinkedIn",
          "Contact capture workflow",
        ],
        features: ["prospecting", "contact-data"],
      },
    ],
    sourcesExtra: [
      {
        id: "seamless-product",
        url: "https://seamless.ai/products",
        title: "Seamless.AI Products",
        domains: ["features", "product-positioning"],
      },
      {
        id: "seamless-chrome",
        url: "https://seamless.ai/chrome-extension",
        title: "Seamless.AI Chrome Extension",
        domains: ["features", "prospecting"],
      },
      {
        id: "seamless-integrations",
        url: "https://seamless.ai/integrations",
        title: "Seamless.AI Integrations",
        domains: ["integrations"],
      },
    ],
  },
  {
    slug: "clay",
    name: "Clay",
    company: "Clay",
    website: "https://www.clay.com",
    domain: "clay.com",
    pricingUrl: "https://www.clay.com/pricing",
    softShortDescription:
      "GTM data enrichment and workflow platform for multi-provider waterfall prospecting — Free + Launch from ~$167/mo headline, Growth, Enterprise.",
    shortDescription:
      "Go-to-market data and enrichment platform that lets growth and RevOps teams build multi-provider waterfall workflows (Claygent AI research, enrichment, outreach prep) with Free, Launch, Growth, and Enterprise plans.",
    vendorPositioning:
      "Clay is the creative GTM platform to find, enrich, and engage the right people — combining data providers and AI agents in flexible tables and workflows.",
    pricingModel: "subscription",
    hasFreePlan: true,
    hasFreeTrial: true,
    trialDays: 14,
    startingPriceMonthly: 167,
    pricingNotes:
      "Published ladder includes Free, Launch (headline ~$167/mo per Clay pricing — annual billing often starts lower), Growth (~$446/mo headline), and Enterprise contact sales. Confirm current credit packs, seat rules, and annual discounts on clay.com/pricing. Free trial documented (treat as ~14 days where offered).",
    fixturePlans: [
      "PLAN free: name=Free; isFree=true; currency=USD; interval=month; billingInterval=month",
      "PLAN launch: name=Launch; amountPerSeat=167; currency=USD; interval=month; billingInterval=month; unit=seat",
      "PLAN growth: name=Growth; amountPerSeat=446; currency=USD; interval=month; billingInterval=month; unit=seat",
      "PLAN enterprise: name=Enterprise; contactSales=true; currency=USD; interval=month; billingInterval=month; unit=seat",
    ],
    enrichmentPlans: [
      freePlan("free", "Free"),
      planPerSeat("launch", "Launch", 167, {
        hasFreeTrial: true,
        trialDays: 14,
        highlighted: true,
      }),
      planPerSeat("growth", "Growth", 446, { hasFreeTrial: true, trialDays: 14 }),
      contactSalesPlan("enterprise", "Enterprise"),
    ],
    featureOverrides: {
      "contact-data": "supported",
      prospecting: "supported",
      "data-enrichment": "supported",
      "email-outreach": "supported",
      "email-sequences": "limited",
      "crm-sync": "supported",
      "lead-management": "supported",
      reporting: "limited",
      "ai-assistance": "supported",
      "lead-scoring": "limited",
      integrations: "supported",
      "contact-management": "supported",
    },
    aiLines: [
      "AI assistant: supported",
      "AI recommendations: supported",
      "AI automation: supported",
      "AI email-generation: supported",
      "AI summaries: supported",
    ],
    integrations: [
      { integrationSlug: "hubspot", kind: "native" },
      { integrationSlug: "salesforce", kind: "native" },
      { integrationSlug: "apollo", kind: "third-party" },
      { integrationSlug: "clearbit", kind: "third-party" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    limitations: [
      "Learning curve is steep for non-technical GTM users — table/waterfall mental model",
      "Credit consumption across providers requires ongoing cost governance",
      "Native sequencing depth is limited versus dedicated sales engagement platforms",
      "Reporting is lighter than enterprise ABM analytics suites",
      "Launch/Growth headline monthly prices can be higher than annual effective rates — model carefully",
    ],
    limitationKinds: [
      "other",
      "usage-cap",
      "feature-unavailable",
      "feature-unavailable",
      "high-cost-at-scale",
    ],
    scores: {
      "contact-data": 8,
      prospecting: 8,
      "data-enrichment": 9,
      "email-outreach": 8,
      "crm-sync": 7,
      "ease-of-use": 6,
      reporting: 5,
      "value-for-money": 7,
    },
    scoreRationales: {
      "contact-data":
        "Clay aggregates many providers into waterfall contact discovery — strong coverage when configured well, dependent on connected sources rather than a single proprietary DB claim.",
      prospecting:
        "Flexible tables, signals, and provider mixes make Clay excellent for creative prospecting systems built by GTM engineers.",
      "data-enrichment":
        "Multi-provider enrichment and Claygent AI web research are the category-defining strengths — enrichment is the product’s center of gravity.",
      "email-outreach":
        "Outreach prep, personalization, and push into engagement tools are strong; native sequencer depth is secondary.",
      "crm-sync":
        "HubSpot/Salesforce and workflow pushes are documented; sync maturity is solid but not the whole product story.",
      "ease-of-use":
        "Powerful for technical GTM users; steeper than point-and-click contact databases for average SDRs.",
      reporting:
        "Operational table outputs dominate; not positioned as a full ABM analytics suite.",
      "value-for-money":
        "Free plan + published Launch/Growth rungs and trial path are clearer than enterprise SI quotes; credit burn is the main value risk.",
    },
    bestFor: [
      "GTM engineers and RevOps teams building multi-provider enrichment waterfalls",
      "Growth teams that want Claygent-style AI research inside prospecting workflows",
      "Buyers consolidating many data vendors into one orchestration layer",
    ],
    notIdealFor: [
      "Non-technical teams that need a simple Chrome contact lookup only",
      "Buyers who want a native enterprise ABM analytics suite",
      "Teams unwilling to govern multi-provider credit spend",
    ],
    pros: [
      "Best-in-class multi-provider enrichment and waterfall flexibility",
      "Claygent AI web research agent for creative GTM workflows",
      "Free plan plus published Launch/Growth headline pricing",
      "Strong HubSpot/Salesforce and provider ecosystem connections",
      "Excellent for building custom prospecting systems",
    ],
    cons: [
      "Steeper learning curve than simple contact databases",
      "Credits across providers can surprise budgets",
      "Reporting is lighter than ABM platforms",
      "Native sequencing is limited",
      "Requires GTM/ops ownership to get full value",
    ],
    keyFeatures: [
      "Multi-provider data waterfall enrichment",
      "Claygent AI web research agent",
      "Flexible GTM tables and workflow recipes",
      "CRM and outbound tool connections",
      "Free + Launch/Growth/Enterprise packaging",
    ],
    pricingSummary:
      "Free plan; Launch from about $167/mo headline; Growth about $446/mo headline; Enterprise contact sales. Annual billing often lowers effective monthly cost — confirm on clay.com/pricing. Free trial available (~14 days where offered).",
    whoShouldChoose:
      "Choose Clay when multi-provider enrichment waterfalls and AI research workflows are the primary job and you have GTM/RevOps capacity to operate them.",
    whoShouldConsiderAlternatives:
      "Compare Apollo for all-in-one data+sequences, Clearbit/Breeze for HubSpot-native enrichment, ZoomInfo for enterprise databases, and Seamless.AI for simpler high-volume contact search.",
    alternativeSlugs: ["apollo", "clearbit", "zoominfo", "seamless-ai"],
    competitorSlugs: ["apollo", "clearbit", "zoominfo", "seamless-ai"],
    comparableSlugs: ["apollo", "clearbit"],
    subcategorySlugs: ["data-enrichment", "prospecting", "contact-data"],
    useCaseSlugs: ["data-enrichment", "prospecting", "lead-management"],
    teamTypeSlugs: ["sales", "revops", "marketing"],
    businessSizeSlugs: ["small-business", "mid-market", "enterprise"],
    officialVideos: [
      {
        videoId: "Oc5w3FEEijw",
        title: "Clay 101 Lesson 8: Claygent AI Web Research Agent",
        channel: "Clay",
        shows: [
          "Claygent AI web research agent walkthrough",
          "Enrichment workflow in Clay tables",
        ],
        features: ["data-enrichment", "ai-assistance", "prospecting"],
      },
    ],
    sourcesExtra: [
      {
        id: "clay-product",
        url: "https://www.clay.com/product",
        title: "Clay Product",
        domains: ["features", "product-positioning", "ai-capabilities"],
      },
      {
        id: "clay-claygent",
        url: "https://www.clay.com/claygent",
        title: "Claygent",
        domains: ["ai-capabilities", "features"],
      },
      {
        id: "clay-integrations",
        url: "https://www.clay.com/integrations",
        title: "Clay Integrations",
        domains: ["integrations"],
      },
      {
        id: "clay-pricing",
        url: "https://www.clay.com/pricing",
        title: "Clay Pricing",
        domains: ["pricing", "plans", "free-plan", "free-trial"],
      },
    ],
  },
  {
    slug: "clearbit",
    name: "Clearbit",
    company: "HubSpot",
    website: "https://www.clearbit.com",
    domain: "clearbit.com",
    pricingUrl: "https://www.hubspot.com/products/clearbit",
    aliases: [
      "Breeze Intelligence",
      "HubSpot Breeze Intelligence",
      "Clearbit Enrichment",
    ],
    softShortDescription:
      "HubSpot-owned enrichment (Clearbit → Breeze Intelligence) for CRM fill and inbound intelligence — usage/credits via HubSpot, Starter+ required.",
    shortDescription:
      "Clearbit is HubSpot’s B2B data enrichment product, now part of HubSpot Breeze Intelligence — used to enrich CRM records and power inbound/account intelligence, monetized via HubSpot credits rather than a standalone classic SI database.",
    vendorPositioning:
      "Clearbit (HubSpot Breeze Intelligence) helps businesses enrich customer data and uncover buying insights — now delivered inside the HubSpot ecosystem.",
    pricingModel: "usage",
    hasFreePlan: false,
    hasFreeTrial: false,
    pricingNotes:
      "Clearbit enrichment is sold through HubSpot as Breeze Intelligence / credit packs — usage-style monetization, not a classic self-serve SI seat ladder. Typically requires HubSpot Starter or higher. Contact HubSpot sales for credit packs. Confirm current Breeze Intelligence packaging on hubspot.com.",
    fixturePlans: [
      "PLAN enrichment-credits: name=Enrichment Credits (HubSpot); contactSales=true; currency=USD; interval=month; billingInterval=month; unit=credit",
    ],
    enrichmentPlans: [
      contactSalesPlan("enrichment-credits", "Enrichment Credits (HubSpot)", {
        highlighted: true,
        fields: {
          description:
            "HubSpot credit-based Clearbit / Breeze Intelligence enrichment packaging — contact sales.",
        },
      }),
    ],
    featureOverrides: {
      "contact-data": "supported",
      prospecting: "limited",
      "data-enrichment": "supported",
      "email-outreach": "limited",
      "email-sequences": "limited",
      "crm-sync": "supported",
      "lead-management": "limited",
      reporting: "limited",
      "ai-assistance": "supported",
      "lead-scoring": "limited",
      integrations: "supported",
      "contact-management": "supported",
    },
    aiLines: [
      "AI assistant: supported",
      "AI recommendations: limited",
      "AI lead-scoring: limited",
      "AI automation: limited",
    ],
    integrations: [
      { integrationSlug: "hubspot", kind: "native" },
      { integrationSlug: "salesforce", kind: "official-connector" },
      { integrationSlug: "segment", kind: "official-connector" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    limitations: [
      "Now HubSpot-owned and repositioned as Breeze Intelligence — buying motion is HubSpot-centric",
      "No standalone free plan; typically needs HubSpot Starter+",
      "Credit/usage monetization can be opaque versus flat SI seats",
      "Prospecting and email outreach depth are limited versus Apollo-class tools",
      "Not a full sales engagement or ABM orchestration suite",
    ],
    limitationKinds: [
      "other",
      "plan-restriction",
      "usage-cap",
      "feature-unavailable",
      "feature-unavailable",
    ],
    scores: {
      "contact-data": 7,
      prospecting: 4,
      "data-enrichment": 9,
      "email-outreach": 2,
      "crm-sync": 8,
      "ease-of-use": 8,
      reporting: 5,
      "value-for-money": 7,
    },
    scoreRationales: {
      "contact-data":
        "Clearbit remains a strong firmographic/person enrichment source, but packaging and coverage are now framed through HubSpot Breeze Intelligence rather than a standalone mega-database.",
      prospecting:
        "Not positioned as a primary outbound list-building SI tool — prospecting score is intentionally low versus Apollo/Seamless-class products.",
      "data-enrichment":
        "Enrichment is the product’s historic and current center of gravity — CRM fill and inbound intelligence are the buying jobs.",
      "email-outreach":
        "Not an email sequencer or outreach platform — score reflects enrichment-only posture.",
      "crm-sync":
        "Native HubSpot delivery plus connectors make CRM enrichment sync a first-class path.",
      "ease-of-use":
        "For HubSpot customers, enrichment UX is comparatively straightforward versus multi-provider waterfall tools.",
      reporting:
        "Light versus dedicated SI analytics — reporting lives mostly in HubSpot context.",
      "value-for-money":
        "Strong when already on HubSpot and credits fit usage; weaker if you need a standalone SI suite with published seats.",
    },
    bestFor: [
      "HubSpot customers that need CRM and inbound enrichment via Breeze Intelligence / Clearbit",
      "Marketing and RevOps teams prioritizing form and CRM fill quality",
      "Buyers who want enrichment without standing up a separate prospecting database",
    ],
    notIdealFor: [
      "Outbound teams whose primary job is list building and sequencing",
      "Orgs not on HubSpot (or unwilling to buy HubSpot credits)",
      "Buyers needing enterprise ABM predictive intent platforms",
    ],
    pros: [
      "Category-defining enrichment DNA, now inside HubSpot Breeze Intelligence",
      "Strong HubSpot-native CRM fill experience",
      "Simpler than multi-provider waterfall tools for HubSpot shops",
      "AI assistance surfaces in the HubSpot/Breeze context",
      "Usage/credit packaging can fit inbound enrichment jobs",
    ],
    cons: [
      "HubSpot ownership and rename change the buying motion",
      "Not a free standalone SI product — Starter+ / credits required",
      "Weak as a primary prospecting or email outreach tool",
      "Credit opacity versus flat published SI seats",
      "Reporting and sequencing are not the product’s job",
    ],
    keyFeatures: [
      "B2B firmographic and person enrichment",
      "HubSpot Breeze Intelligence delivery",
      "CRM record fill and inbound intelligence",
      "HubSpot-native sync and credit packs",
      "AI assistance in the HubSpot ecosystem",
    ],
    pricingSummary:
      "Usage/credit packaging via HubSpot (Clearbit → Breeze Intelligence). No classic free SI plan; typically requires HubSpot Starter+. Enrichment credit packs are contact-sales. Confirm current Breeze Intelligence pricing on HubSpot.",
    whoShouldChoose:
      "Choose Clearbit / Breeze Intelligence when HubSpot-native enrichment is the job and you already (or will) buy HubSpot credits.",
    whoShouldConsiderAlternatives:
      "Compare Clay for multi-provider waterfalls, Lusha for SMB enrichment+contact data, ZoomInfo for enterprise databases, and Apollo for prospecting+sequences.",
    alternativeSlugs: ["clay", "lusha", "zoominfo", "apollo"],
    competitorSlugs: ["clay", "lusha", "zoominfo", "apollo"],
    comparableSlugs: ["clay", "lusha"],
    subcategorySlugs: ["data-enrichment", "contact-data"],
    useCaseSlugs: ["data-enrichment", "contact-management"],
    teamTypeSlugs: ["marketing", "revops", "sales"],
    businessSizeSlugs: ["small-business", "mid-market", "enterprise"],
    // No officialVideos — none verified in this research pass
    sourcesExtra: [
      {
        id: "clearbit-hubspot",
        url: "https://www.hubspot.com/products/clearbit",
        title: "HubSpot Clearbit / Breeze Intelligence",
        domains: ["pricing", "product-positioning", "features"],
      },
      {
        id: "clearbit-site",
        url: "https://www.clearbit.com",
        title: "Clearbit",
        domains: ["identity", "product-positioning"],
      },
      {
        id: "breeze-intelligence",
        url: "https://www.hubspot.com/products/artificial-intelligence",
        title: "HubSpot Breeze / AI",
        domains: ["ai-capabilities", "features"],
      },
    ],
  },
  {
    slug: "bombora",
    name: "Bombora",
    company: "Bombora",
    website: "https://bombora.com",
    domain: "bombora.com",
    pricingUrl: "https://bombora.com/speak-to-an-expert/",
    softShortDescription:
      "Intent-data specialist (Company Surge®) for B2B account prioritization — not a contact database; custom-quote packaging.",
    shortDescription:
      "B2B intent-data specialist best known for Company Surge® topic-level buying signals that help sales and marketing teams prioritize in-market accounts — typically layered onto CRM/ABM stacks rather than used as a contact database.",
    vendorPositioning:
      "Bombora provides cooperative intent data that helps B2B companies identify which accounts are in-market and what they care about — data that lets you do big things.",
    pricingModel: "custom-quote",
    hasFreePlan: false,
    hasFreeTrial: false,
    pricingNotes:
      "Bombora is sold via speak-to-an-expert / custom quote. No public seat dollar list prices on the primary commercial path. Confirm current Company Surge® packaging, topic caps, and delivery (CRM/MAP/ABM partners) with Bombora.",
    fixturePlans: [
      "PLAN company-surge: name=Company Surge; contactSales=true; currency=USD; interval=month; billingInterval=month; unit=seat",
      "PLAN intent-data: name=Intent Data Platform; contactSales=true; currency=USD; interval=month; billingInterval=month; unit=seat",
    ],
    enrichmentPlans: [
      contactSalesPlan("company-surge", "Company Surge", { highlighted: true }),
      contactSalesPlan("intent-data", "Intent Data Platform"),
    ],
    featureOverrides: {
      "contact-data": "limited",
      prospecting: "limited",
      "data-enrichment": "supported",
      "email-outreach": "limited",
      "email-sequences": "limited",
      "crm-sync": "supported",
      "lead-management": "limited",
      reporting: "supported",
      "ai-assistance": "limited",
      "lead-scoring": "limited",
      integrations: "supported",
      "contact-management": "limited",
    },
    aiLines: [
      "AI recommendations: limited",
      "AI lead-scoring: limited",
      "AI assistant: limited",
      "AI automation: unknown",
    ],
    integrations: [
      { integrationSlug: "salesforce", kind: "native" },
      { integrationSlug: "hubspot", kind: "native" },
      { integrationSlug: "marketo", kind: "native" },
      { integrationSlug: "6sense", kind: "third-party" },
      { integrationSlug: "demandbase", kind: "third-party" },
    ],
    limitations: [
      "Intent-data specialist — not a B2B email/phone contact database",
      "Custom-quote only via speak-to-an-expert path",
      "Prospecting and outreach execution still require other tools in the stack",
      "Topic selection and surge thresholds need RevOps governance",
      "AI assistance is limited relative to full SI/engagement suites",
    ],
    limitationKinds: [
      "feature-unavailable",
      "high-cost-at-scale",
      "feature-unavailable",
      "other",
      "feature-unavailable",
    ],
    scores: {
      "contact-data": 3,
      prospecting: 4,
      "data-enrichment": 7,
      "email-outreach": 2,
      "crm-sync": 7,
      "ease-of-use": 6,
      reporting: 8,
      "value-for-money": 5,
    },
    scoreRationales: {
      "contact-data":
        "Bombora is not a contact database — score is intentionally low. Buyers still need ZoomInfo/Apollo/Cognism-class tools for emails and dials.",
      prospecting:
        "Intent helps prioritize which accounts to work, but Bombora does not replace list building or people search UX.",
      "data-enrichment":
        "Topic-level Company Surge® signals enrich account prioritization — enrichment of buying context, not classic email waterfall fill.",
      "email-outreach":
        "No native sequencer — outreach happens in other tools. Score reflects intent-only posture.",
      "crm-sync":
        "Delivery into CRM/MAP/ABM partners is a first-party distribution model for surge data.",
      "ease-of-use":
        "Conceptually clear (topics + surge), but topic governance and partner delivery add moderate ops work.",
      reporting:
        "Intent analytics and surge reporting are the product’s analytical strength for ABM and sales prioritization.",
      "value-for-money":
        "Custom quotes and specialist scope make value opaque; justified when intent is a named buying criterion in an existing stack.",
    },
    bestFor: [
      "ABM and enterprise sales teams that need third-party intent layered onto CRM/ABM stacks",
      "RevOps programs already buying contact data elsewhere and needing surge prioritization",
      "Buyers comparing Bombora Company Surge® as the intent specialist vs full ABM suites",
    ],
    notIdealFor: [
      "Buyers who need a contact database as the primary output",
      "Teams seeking an all-in-one SI + sequencer platform",
      "SMB teams that need self-serve published pricing",
    ],
    pros: [
      "Category-defining B2B cooperative intent (Company Surge®)",
      "Strong reporting for in-market account prioritization",
      "Designed to layer onto CRM, MAP, and ABM platforms",
      "Clear specialist positioning vs contact-database vendors",
      "Useful peer comparison for 6sense/Demandbase intent modules",
    ],
    cons: [
      "Not a contact database — you still need people data elsewhere",
      "Custom-quote commercial model",
      "No native email outreach or sequences",
      "Topic governance required to avoid noisy surge lists",
      "Limited AI assistance versus full SI suites",
    ],
    keyFeatures: [
      "Company Surge® topic-level intent data",
      "In-market account prioritization signals",
      "CRM / MAP / ABM partner delivery",
      "Intent analytics and surge reporting",
      "B2B cooperative data network coverage",
    ],
    pricingSummary:
      "Custom-quote intent-data packaging via Bombora speak-to-an-expert. No published seat dollar prices on the primary commercial path. Confirm Company Surge® topics, caps, and delivery with Bombora.",
    whoShouldChoose:
      "Choose Bombora when third-party intent data is a named buying criterion and you already have (or will buy) contact data and engagement tools separately.",
    whoShouldConsiderAlternatives:
      "Compare 6sense or Demandbase when you want intent bundled inside a full ABM platform, and ZoomInfo when you need enterprise contact data with intent add-ons.",
    alternativeSlugs: ["sixsense", "demandbase", "zoominfo"],
    competitorSlugs: ["sixsense", "demandbase", "zoominfo"],
    comparableSlugs: ["sixsense", "demandbase"],
    subcategorySlugs: ["prospecting", "data-enrichment"],
    useCaseSlugs: ["prospecting", "data-enrichment", "lead-management"],
    teamTypeSlugs: ["sales", "marketing", "revops"],
    businessSizeSlugs: ["mid-market", "enterprise"],
    officialVideos: [
      {
        videoId: "32VSB9nXLNM",
        title: "Bombora - Data that lets you do big things",
        channel: "Bombora",
        shows: [
          "Bombora intent-data positioning",
          "Company Surge value framing",
        ],
        features: ["data-enrichment", "reporting", "prospecting"],
      },
    ],
    sourcesExtra: [
      {
        id: "bombora-company-surge",
        url: "https://bombora.com/company-surge/",
        title: "Bombora Company Surge",
        domains: ["features", "product-positioning"],
      },
      {
        id: "bombora-intent",
        url: "https://bombora.com/intent-data/",
        title: "Bombora Intent Data",
        domains: ["features", "product-positioning"],
      },
      {
        id: "bombora-integrations",
        url: "https://bombora.com/integrations/",
        title: "Bombora Integrations",
        domains: ["integrations"],
      },
    ],
  },
];

function avgScore(scores) {
  const vals = SI_CRITERIA.map((c) => scores[c]);
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
      notes: `First-party product positioning for ${p.name} (SI Priority-2 onboarding 2026-08-17).`,
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

${p.fixturePlans.join("\n")}
`;
}

function buildProductFixture(p) {
  const featureLines = SI_FEATURES.map(
    (f) => `FEATURE ${f}: ${featureAvailability(p, f)}`,
  ).join("\n");
  const ai = (p.aiLines ?? ["AI assistant: limited"]).join("\n");
  return `# FIXTURE SNAPSHOT — structured from first-party research (2026-08-17)

SHORT_DESCRIPTION: ${p.shortDescription}
VENDOR_POSITIONING: ${p.vendorPositioning}

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
    useCaseIds: ["prospecting"],
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
    purpose: `Official ${p.name} product video for SI Priority-2 onboarding`,
    whatThisShows: v.shows ?? [],
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

function buildEnrichment(p) {
  const slugs = planSlugs(p);
  const featureSupport = SI_FEATURES.map((featureSlug) => ({
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
      businessSizeSlug === "enterprise" || businessSizeSlug === "mid-market"
        ? "strong"
        : "moderate";
    return {
      businessSizeSlug,
      teamTypeSlug: "sales",
      strength,
      rationale: `${p.name} fit for ${businessSizeSlug} sales teams from first-party positioning and SI Priority-2 research.`,
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
    media: buildMedia(p),
    sourceIds: [
      `${p.slug}-product-official`,
      `${p.slug}-pricing-official`,
      ...(p.sourcesExtra ?? []).map((s) => s.id),
    ],
    notes: `SI Priority-2 onboarding enrichment from first-party research ${VERIFIED_AT}. handsOnTesting=false.`,
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
    notes: "SI Priority-2 first-party research extract",
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
  for (const featureSlug of SI_FEATURES) {
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
  return SI_CRITERIA.map((criterionSlug) => {
    const score = p.scores[criterionSlug];
    const supportingFactIds = [
      `fact-${p.slug}-features.${
        criterionSlug === "email-outreach"
          ? "email-outreach"
          : criterionSlug === "value-for-money"
            ? "contact-data"
            : criterionSlug === "ease-of-use"
              ? "prospecting"
              : criterionSlug
      }`,
      `fact-${p.slug}-pricing.model`,
    ];
    if (criterionSlug === "value-for-money") {
      supportingFactIds[0] = `fact-${p.slug}-pricing.hasFreePlan`;
      if (p.startingPriceMonthly !== undefined) {
        supportingFactIds.push(`fact-${p.slug}-pricing.startingPriceMonthly`);
      }
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
    id: `assessment-${p.slug}-si-v1`,
    productSlug: p.slug,
    methodologySlug: "sales-intelligence-editorial",
    methodologyVersion: "1.0.0",
    status: "approved",
    verdict: `${p.name}: ${p.whoShouldChoose} Scores use the sales-intelligence editorial methodology from first-party research as of 2026-08-17 — not hands-on product testing.`,
    strengths: p.pros.slice(0, 5),
    weaknesses: p.cons.slice(0, 5),
    bestFor: p.bestFor,
    notIdealFor: p.notIdealFor,
    tradeoffs: [
      "Data depth / intent specialization vs outreach execution built-in",
      "Published price transparency vs enterprise custom quoting",
      "Specialization fit vs all-in-one SMB consolidation",
    ],
    recommendation: `${p.whoShouldChoose} ${p.whoShouldConsiderAlternatives}`,
    editorialNotes:
      "SI Priority-2 batch. Approved on sales-intelligence-editorial v1.0.0. handsOnTesting=false. Affiliate economics excluded.",
    handsOnTesting: false,
    confidence: "medium",
    criterionAssessments,
    overallScore,
    overallScoreRationale:
      "Equal-weight average of 8 sales-intelligence editorial criteria, rounded to 1 decimal. Not a hands-on lab score.",
    scoreAudit: [
      {
        at: VERIFIED_AT,
        actor: "editorial",
        change:
          "SI Priority-2 onboarding; approved SI criteria; handsOnTesting=false",
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
    assessmentId: `assessment-${p.slug}-si-v1`,
    editorialStatus: "approved",
    title: `${p.name} Review (2026)`,
    h1: `${p.name} Review`,
    intro: `${p.name} is evaluated here as sales intelligence software — ${p.shortDescription} This review uses SoftwareGlimpse’s sales-intelligence methodology (contact data, prospecting, enrichment, email outreach, CRM sync, usability, reporting, value). It is based on first-party research, not hands-on lab testing.`,
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
    methodologySlug: "sales-intelligence-editorial",
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
        question: `Is ${p.name} a CRM?`,
        answer: `No. ${p.name} is sales intelligence / prospecting software. Keep a CRM of record (HubSpot, Salesforce, Pipedrive, etc.) and use ${p.name} for discovery, enrichment, intent, or account prioritization as applicable.`,
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
      title: `${p.name} Review (2026) — Sales Intelligence`,
      description: `${p.name} sales intelligence review on SoftwareGlimpse: strengths, trade-offs, pricing posture, and who should buy.`,
      canonicalPath: `/software/${p.slug}/`,
      indexable: true,
    },
  };
}

function softSnippet(p) {
  const aliases = p.aliases?.length
    ? `\n    aliases: ${JSON.stringify(p.aliases)},`
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
    primaryCategorySlug: "sales-intelligence",
    subcategorySlugs: ${JSON.stringify(p.subcategorySlugs)},
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
      id: `job-${p.slug}-si-priority2`,
      productSlug: p.slug,
      status: "completed",
      createdAt: VERIFIED_AT,
      completedAt: VERIFIED_AT,
      notes: "SI Priority-2 batch",
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
    `✓ ${p.slug}  overall=${assessment.overallScore}  media=${(p.officialVideos ?? []).length}`,
  );
}

function writeSeedSnippet(products) {
  const out = path.join(ROOT, "scripts/_si-priority2-seed-snippet.ts");
  const body = `// Auto-generated by scripts/onboard-si-priority2-batch.mjs
// Append into src/data/seed/software.ts before the closing ]; of softwareSeed.

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
        shows: v.shows,
        features: v.features,
      });
    }
  }
  writeJson(
    path.join(ROOT, "scripts/_si-priority2-official-videos.json"),
    videos,
  );
  console.log(`✓ video specs → ${videos.length} videos`);
}

function main() {
  for (const p of PRODUCTS) writeProduct(p);
  writeSeedSnippet(PRODUCTS);
  writeVideoImportSpec(PRODUCTS);
  console.log("\nNext:");
  console.log("  1. Patch software.ts with scripts/_si-priority2-seed-snippet.ts");
  console.log("  2. Download / generate brand logos under public/brands/");
  console.log("  3. Update best.ts + comparisons.ts");
  console.log("  4. npx tsx scripts/product-guide-visuals.ts --si");
  console.log("  5. Import official videos via assets:approve flow");
  console.log("  6. npm run workflow:run -- software <slug> (approval gates)");
  console.log("  7. Content quality audit — target >75");
}

main();
