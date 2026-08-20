#!/usr/bin/env node
/**
 * Sales Intelligence Priority-3 products:
 * UpLead, LeadIQ, Hunter, Snov.io, Kaspr, Ocean.io.
 *
 * Usage: node scripts/onboard-si-priority3-batch.mjs
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
const VERIFIED_AT = "2026-08-17T14:00:00.000Z";
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
    slug: "uplead",
    name: "UpLead",
    company: "UpLead",
    website: "https://uplead.com",
    domain: "uplead.com",
    pricingUrl: "https://uplead.com/pricing/",
    softShortDescription:
      "Verified B2B contact database with credit-based subscription plans — Essentials from $99/mo, Plus $199/mo, Professional contact sales; 7-day trial (5 credits).",
    shortDescription:
      "B2B sales intelligence and verified contact database for prospecting and enrichment, sold on a credit-based subscription model with Essentials, Plus, and Professional plans and a short free trial.",
    vendorPositioning:
      "UpLead helps sales teams find accurate B2B contact and company data with real-time email verification and CRM sync.",
    pricingModel: "subscription",
    hasFreePlan: false,
    hasFreeTrial: true,
    trialDays: 7,
    startingPriceMonthly: 99,
    pricingNotes:
      "First-party pricing verified 2026-08-17 on uplead.com/pricing: Essentials $99/mo (170 credits); Plus $199/mo (400 credits); Professional contact sales. Free trial 7 days with 5 credits. Credit model — confirm current credit allowances and annual discounts on the live pricing page.",
    fixturePlans: [
      "PLAN essentials: name=Essentials; amountPerSeat=99; currency=USD; interval=month; billingInterval=month; unit=seat; credits=170; hasFreeTrial=true; trialDays=7",
      "PLAN plus: name=Plus; amountPerSeat=199; currency=USD; interval=month; billingInterval=month; unit=seat; credits=400; hasFreeTrial=true; trialDays=7",
      "PLAN professional: name=Professional; contactSales=true; currency=USD; interval=month; billingInterval=month; unit=seat",
    ],
    enrichmentPlans: [
      planPerSeat("essentials", "Essentials", 99, {
        hasFreeTrial: true,
        trialDays: 7,
        highlighted: true,
      }),
      planPerSeat("plus", "Plus", 199, { hasFreeTrial: true, trialDays: 7 }),
      contactSalesPlan("professional", "Professional"),
    ],
    featureOverrides: {
      "contact-data": "supported",
      prospecting: "supported",
      "data-enrichment": "supported",
      "email-outreach": "limited",
      "email-sequences": "limited",
      "crm-sync": "supported",
      "lead-management": "limited",
      reporting: "limited",
      "ai-assistance": "limited",
      "lead-scoring": "limited",
      integrations: "supported",
      "contact-management": "supported",
    },
    aiLines: [
      "AI assistant: limited",
      "AI recommendations: limited",
      "AI lead-scoring: limited",
      "AI email-generation: limited",
    ],
    integrations: [
      { integrationSlug: "salesforce", kind: "native" },
      { integrationSlug: "hubspot", kind: "native" },
      { integrationSlug: "pipedrive", kind: "native" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    limitations: [
      "Credit allowances on Essentials/Plus can limit high-volume list building",
      "Native email sequencing depth is limited versus dedicated engagement platforms",
      "Not a full CRM system of record",
      "Professional packaging is contact-sales rather than fully self-serve published dollars",
      "Lead scoring and AI assistance are limited relative to full SI/engagement suites",
    ],
    limitationKinds: [
      "usage-cap",
      "feature-unavailable",
      "feature-unavailable",
      "plan-restriction",
      "feature-unavailable",
    ],
    scores: {
      "contact-data": 8,
      prospecting: 8,
      "data-enrichment": 7,
      "email-outreach": 3,
      "crm-sync": 8,
      "ease-of-use": 8,
      reporting: 5,
      "value-for-money": 7,
    },
    scoreRationales: {
      "contact-data":
        "UpLead’s center of gravity is verified B2B contact and company data with real-time email verification — strong for database buyers.",
      prospecting:
        "Search, filters, and list building for B2B prospects are first-party strengths for SDR/outbound list workflows.",
      "data-enrichment":
        "Enrichment of contacts/companies into CRM is documented; solid for SMB/mid-market rather than multi-provider waterfall orchestration.",
      "email-outreach":
        "Not primarily a sequencer — outreach depth is limited versus Apollo/Snov-class tools that include campaigns.",
      "crm-sync":
        "Native CRM connectors (Salesforce, HubSpot, Pipedrive, and more) are first-party documented.",
      "ease-of-use":
        "Credit-based contact database UX is approachable for SMB/mid-market teams; trial path is short but clear.",
      reporting:
        "Usage/activity reporting is lighter than enterprise ABM analytics suites.",
      "value-for-money":
        "Published Essentials/Plus rungs from $99/mo and a trial help evaluation; credit caps are the main value risk at volume.",
    },
    bestFor: [
      "SMB and mid-market teams that need verified B2B contact data with published credit plans",
      "Outbound teams prioritizing contact accuracy and CRM sync over built-in sequencing",
      "Buyers who want a short trial before committing to Essentials or Plus",
    ],
    notIdealFor: [
      "Teams whose primary job is multichannel email sequencing",
      "Buyers who need enterprise predictive ABM intent platforms",
      "High-volume list builders who will burn through Essentials/Plus credits quickly",
    ],
    pros: [
      "Verified B2B contact data with published Essentials/Plus pricing",
      "Strong prospecting and CRM sync for SMB/mid-market outbound",
      "7-day trial lowers evaluation friction",
      "Approachable credit-based packaging versus opaque enterprise quotes",
      "Enrichment workflows for contacts pushed into CRM",
    ],
    cons: [
      "Weak native email outreach/sequencing versus engagement-first tools",
      "Credit caps constrain high-volume usage on lower plans",
      "Reporting is lighter than enterprise SI suites",
      "Professional tier is contact-sales",
      "AI assistance and lead scoring are limited",
    ],
    keyFeatures: [
      "Verified B2B contact and company database",
      "Credit-based Essentials/Plus/Professional plans",
      "Prospecting search and list building",
      "CRM sync for major sales CRMs",
      "Real-time email verification posture",
    ],
    pricingSummary:
      "Subscription with credit allowances: Essentials $99/mo (170 credits); Plus $199/mo (400 credits); Professional contact sales. Free trial 7 days with 5 credits. Confirm current credits and annual discounts on uplead.com/pricing.",
    whoShouldChoose:
      "Choose UpLead when verified B2B contact data with published credit plans and CRM sync are the primary jobs — not when you need a full sequencer.",
    whoShouldConsiderAlternatives:
      "Compare Apollo for data+sequences, Lusha for enrichment-first SMB data, ZoomInfo for enterprise depth, and BookYourData for pay-as-you-go credits.",
    alternativeSlugs: ["apollo", "lusha", "zoominfo", "bookyourdata"],
    competitorSlugs: ["apollo", "lusha", "zoominfo", "bookyourdata"],
    comparableSlugs: ["apollo", "lusha"],
    subcategorySlugs: ["contact-data", "prospecting"],
    useCaseSlugs: ["prospecting", "data-enrichment", "contact-management"],
    teamTypeSlugs: ["sales", "revops"],
    businessSizeSlugs: ["micro", "small-business", "mid-market"],
    officialVideos: [
      {
        videoId: "6E36imNzyd4",
        title: "UpLead - Full Demo (2018)",
        channel: "UpLead",
        shows: [
          "UpLead product demo walkthrough",
          "Contact search and verification workflow",
        ],
        features: ["contact-data", "prospecting", "crm-sync"],
      },
    ],
    sourcesExtra: [
      {
        id: "uplead-product",
        url: "https://uplead.com/",
        title: "UpLead Product",
        domains: ["features", "product-positioning"],
      },
      {
        id: "uplead-pricing",
        url: "https://uplead.com/pricing/",
        title: "UpLead Pricing",
        domains: ["pricing", "plans", "free-trial"],
      },
    ],
  },
  {
    slug: "leadiq",
    name: "LeadIQ",
    company: "LeadIQ",
    website: "https://leadiq.com",
    domain: "leadiq.com",
    pricingUrl: "https://leadiq.com/pricing",
    aliases: ["Lead IQ"],
    softShortDescription:
      "Chrome/LinkedIn capture and CRM sync with Universal Credits — Free (50 credits), Pro from $200/mo, Enterprise contact sales; Scribe AI assistance.",
    shortDescription:
      "Sales intelligence platform centered on Chrome and LinkedIn contact capture, Universal Credits, and deep CRM sync — with a free credit tier, Pro from $200/mo, and Enterprise packaging, plus Scribe AI assistance.",
    vendorPositioning:
      "LeadIQ helps sales teams capture accurate contact data from LinkedIn and the web, enrich prospects, and sync them into CRM without leaving the prospecting workflow.",
    pricingModel: "subscription",
    hasFreePlan: true,
    hasFreeTrial: false,
    startingPriceMonthly: 200,
    pricingNotes:
      "First-party pricing verified 2026-08-17 on leadiq.com/pricing: Free plan with 50 Universal Credits; Pro from $200/mo; Enterprise contact sales. Confirm current Universal Credit allowances and seat rules on the live pricing page.",
    fixturePlans: [
      "PLAN free: name=Free; isFree=true; currency=USD; interval=month; billingInterval=month; credits=50",
      "PLAN pro: name=Pro; amountPerSeat=200; currency=USD; interval=month; billingInterval=month; unit=seat",
      "PLAN enterprise: name=Enterprise; contactSales=true; currency=USD; interval=month; billingInterval=month; unit=seat",
    ],
    enrichmentPlans: [
      freePlan("free", "Free"),
      planPerSeat("pro", "Pro", 200, { highlighted: true }),
      contactSalesPlan("enterprise", "Enterprise"),
    ],
    featureOverrides: {
      "contact-data": "supported",
      prospecting: "supported",
      "data-enrichment": "supported",
      "email-outreach": "limited",
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
      "AI email-generation: supported",
      "AI recommendations: limited",
      "AI automation: limited",
    ],
    integrations: [
      { integrationSlug: "salesforce", kind: "native" },
      { integrationSlug: "hubspot", kind: "native" },
      { integrationSlug: "outreach", kind: "native" },
      { integrationSlug: "salesloft", kind: "native" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    limitations: [
      "Pro starts at $200/mo — higher entry than many SMB contact tools",
      "Native email sequencing depth is limited versus dedicated engagement platforms",
      "Free plan’s 50 Universal Credits are for light evaluation only",
      "Chrome/LinkedIn capture workflows carry platform compliance risk some orgs reject",
      "Reporting is lighter than enterprise ABM analytics suites",
    ],
    limitationKinds: [
      "high-cost-at-scale",
      "feature-unavailable",
      "usage-cap",
      "other",
      "feature-unavailable",
    ],
    scores: {
      "contact-data": 7,
      prospecting: 8,
      "data-enrichment": 7,
      "email-outreach": 5,
      "crm-sync": 9,
      "ease-of-use": 8,
      reporting: 6,
      "value-for-money": 6,
    },
    scoreRationales: {
      "contact-data":
        "Solid B2B contact capture and enrichment, with strength in workflow capture rather than claiming the deepest standalone mega-database.",
      prospecting:
        "Chrome/LinkedIn capture-led prospecting is a first-party strength for SDRs working in-network and on social graph workflows.",
      "data-enrichment":
        "Enrichment into CRM as part of capture is core; depth is strong for mid-market outbound rather than multi-provider waterfalls.",
      "email-outreach":
        "Some outreach assist exists, but native sequencing is limited — score reflects capture+CRM motion more than sequencer leadership.",
      "crm-sync":
        "CRM sync (Salesforce, HubSpot, and sales engagement tools) is a category-defining strength for LeadIQ.",
      "ease-of-use":
        "Capture-from-Chrome UX is approachable for SDRs; Universal Credits need light governance.",
      reporting:
        "Operational reporting supports prospecting coaching; not an ABM analytics suite.",
      "value-for-money":
        "Free credits help evaluation, but Pro from $200/mo is a steeper paid entry than many SMB SI tools.",
    },
    bestFor: [
      "SDR teams that capture contacts from LinkedIn/Chrome and sync straight into CRM",
      "Revenue orgs that prioritize CRM write-back quality over a built-in sequencer",
      "Teams that want Scribe AI assistance alongside prospecting capture",
    ],
    notIdealFor: [
      "Buyers who need a low-cost published SMB seat under ~$50/mo as the primary paid rung",
      "Teams whose primary job is multichannel email sequencing",
      "Organizations that cannot accept Chrome/LinkedIn prospecting compliance risk",
    ],
    pros: [
      "Excellent CRM sync for capture-led prospecting workflows",
      "Free plan with Universal Credits for evaluation",
      "Scribe AI assistance for prospecting productivity",
      "Strong Chrome/LinkedIn capture motion for SDRs",
      "Integrations with major CRMs and sales engagement tools",
    ],
    cons: [
      "Pro from $200/mo is a higher paid entry than many SMB data tools",
      "Native email sequences are limited",
      "Free credits are light for serious volume",
      "LinkedIn/Chrome workflows may conflict with compliance policies",
      "Reporting is not enterprise ABM-grade",
    ],
    keyFeatures: [
      "Chrome and LinkedIn contact capture",
      "Universal Credits packaging",
      "Deep CRM sync for Salesforce/HubSpot and peers",
      "Scribe AI assistance",
      "Free + Pro + Enterprise ladder",
    ],
    pricingSummary:
      "Free plan with 50 Universal Credits; Pro from $200/mo; Enterprise contact sales. Confirm current credit allowances on leadiq.com/pricing.",
    whoShouldChoose:
      "Choose LeadIQ when Chrome/LinkedIn capture plus excellent CRM sync (and Scribe AI assist) are the primary jobs.",
    whoShouldConsiderAlternatives:
      "Compare Lusha for enrichment-first SMB data, Apollo for data+sequences, LinkedIn Sales Navigator for graph prospecting, and Seamless.AI for high-volume contact search.",
    alternativeSlugs: ["lusha", "apollo", "linkedin-sales-navigator", "seamless-ai"],
    competitorSlugs: ["lusha", "apollo", "linkedin-sales-navigator", "seamless-ai"],
    comparableSlugs: ["lusha", "apollo"],
    subcategorySlugs: ["contact-data", "prospecting"],
    useCaseSlugs: ["prospecting", "data-enrichment", "contact-management"],
    teamTypeSlugs: ["sales", "revops"],
    businessSizeSlugs: ["small-business", "mid-market", "enterprise"],
    officialVideos: [
      {
        videoId: "9tetPqX6SBc",
        title: "LeadIQ Identify: Find, capture, and sync contact data for prospecting",
        channel: "LeadIQ",
        shows: [
          "LeadIQ Identify capture workflow",
          "Contact sync into prospecting stack",
        ],
        features: ["prospecting", "contact-data", "crm-sync"],
      },
      {
        videoId: "vj3lYJJJIU0",
        title: "LeadIQ: Grow sales pipeline through intelligent prospecting",
        channel: "LeadIQ",
        shows: [
          "LeadIQ intelligent prospecting overview",
          "Pipeline growth positioning",
        ],
        features: ["prospecting", "ai-assistance", "crm-sync"],
      },
    ],
    sourcesExtra: [
      {
        id: "leadiq-product",
        url: "https://leadiq.com/",
        title: "LeadIQ Product",
        domains: ["features", "product-positioning", "ai-capabilities"],
      },
      {
        id: "leadiq-pricing",
        url: "https://leadiq.com/pricing",
        title: "LeadIQ Pricing",
        domains: ["pricing", "plans", "free-plan"],
      },
    ],
  },
  {
    slug: "hunter",
    name: "Hunter",
    company: "Hunter",
    website: "https://hunter.io",
    domain: "hunter.io",
    pricingUrl: "https://hunter.io/pricing/",
    softShortDescription:
      "Domain email finder, verifier, and campaigns for light sales intelligence — Free plan; Starter $49; Growth $149; Scale $299; Enterprise contact sales.",
    shortDescription:
      "Domain-centric email finder and verifier with campaigns for light outbound — positioned as accessible sales intelligence for finding and contacting people at target companies, with Free through Scale published plans and Enterprise contact sales.",
    vendorPositioning:
      "Hunter helps you find professional email addresses and run email outreach campaigns from one simple platform.",
    pricingModel: "subscription",
    hasFreePlan: true,
    hasFreeTrial: false,
    startingPriceMonthly: 49,
    pricingNotes:
      "First-party pricing verified 2026-08-17 on hunter.io/pricing: Free plan; Starter $49/mo; Growth $149/mo; Scale $299/mo; Enterprise contact sales. Confirm current search/verification/campaign limits on the live pricing page.",
    fixturePlans: [
      "PLAN free: name=Free; isFree=true; currency=USD; interval=month; billingInterval=month",
      "PLAN starter: name=Starter; amountPerSeat=49; currency=USD; interval=month; billingInterval=month; unit=seat",
      "PLAN growth: name=Growth; amountPerSeat=149; currency=USD; interval=month; billingInterval=month; unit=seat",
      "PLAN scale: name=Scale; amountPerSeat=299; currency=USD; interval=month; billingInterval=month; unit=seat",
      "PLAN enterprise: name=Enterprise; contactSales=true; currency=USD; interval=month; billingInterval=month; unit=seat",
    ],
    enrichmentPlans: [
      freePlan("free", "Free"),
      planPerSeat("starter", "Starter", 49, { highlighted: true }),
      planPerSeat("growth", "Growth", 149),
      planPerSeat("scale", "Scale", 299),
      contactSalesPlan("enterprise", "Enterprise"),
    ],
    featureOverrides: {
      "contact-data": "supported",
      prospecting: "supported",
      "data-enrichment": "limited",
      "email-outreach": "supported",
      "email-sequences": "supported",
      "crm-sync": "supported",
      "lead-management": "limited",
      reporting: "limited",
      "ai-assistance": "limited",
      "lead-scoring": "limited",
      integrations: "supported",
      "contact-management": "supported",
    },
    aiLines: [
      "AI email-generation: limited",
      "AI assistant: limited",
      "AI recommendations: limited",
      "AI automation: limited",
    ],
    integrations: [
      { integrationSlug: "hubspot", kind: "native" },
      { integrationSlug: "salesforce", kind: "official-connector" },
      { integrationSlug: "pipedrive", kind: "official-connector" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    limitations: [
      "Contact data is email/domain-centric — weaker as a full phone+firmographic mega-database",
      "Lead scoring is limited versus enterprise SI platforms",
      "Enrichment depth is lighter than Clay/Clearbit-class waterfalls",
      "Reporting is lighter than enterprise ABM analytics",
      "Not a full multichannel sales engagement suite (LinkedIn/calls/SMS)",
    ],
    limitationKinds: [
      "feature-unavailable",
      "feature-unavailable",
      "feature-unavailable",
      "feature-unavailable",
      "feature-unavailable",
    ],
    scores: {
      "contact-data": 7,
      prospecting: 7,
      "data-enrichment": 6,
      "email-outreach": 8,
      "crm-sync": 7,
      "ease-of-use": 9,
      reporting: 6,
      "value-for-money": 8,
    },
    scoreRationales: {
      "contact-data":
        "Strong for domain email finding and verification; not positioned as the deepest phone/firmographic enterprise database.",
      prospecting:
        "Domain search, bulk domain workflows, and list building are solid for email-led prospecting; weaker as a full firmographic ABM prospecting suite.",
      "data-enrichment":
        "Useful email/company enrichment, but lighter than multi-provider waterfall or enterprise enrichment platforms.",
      "email-outreach":
        "Campaigns/email sequences are a first-party strength for light outbound on found emails.",
      "crm-sync":
        "CRM and workflow connectors are documented; solid for SMB stacks though not the deepest enterprise sync story.",
      "ease-of-use":
        "Simple domain-finder UX is among the most approachable in the SI pool for founders and SMBs.",
      reporting:
        "Campaign and usage reporting support outbound coaching; not an ABM analytics suite.",
      "value-for-money":
        "Free plan plus clear Starter-from-$49 published ladder is transparent and accessible for SMB buyers.",
    },
    bestFor: [
      "SMB and founder-led teams that need domain email finding, verification, and light campaigns",
      "Buyers who want transparent Free → Starter/Growth/Scale packaging",
      "Outbound motions centered on email rather than phone or LinkedIn graph depth",
    ],
    notIdealFor: [
      "Enterprise teams needing deep phone-verified mobiles and org charts",
      "Buyers whose primary job is multichannel LinkedIn/call sequencing",
      "Teams that need multi-provider enrichment waterfalls",
    ],
    pros: [
      "Excellent ease of use for domain email finding and verification",
      "Published Free + Starter/Growth/Scale ladder from $49/mo",
      "Email campaigns/sequences included for light outbound",
      "Strong value for SMB email-led prospecting",
      "CRM connectors for common SMB stacks",
    ],
    cons: [
      "Not a full enterprise contact mega-database",
      "Lead scoring and deep enrichment are limited",
      "Multichannel engagement depth is limited",
      "Reporting is lighter than ABM platforms",
      "Phone coverage is secondary to email finding",
    ],
    keyFeatures: [
      "Domain email finder and verifier",
      "Bulk domain search for list building",
      "Email campaigns / sequences",
      "Free + Starter/Growth/Scale/Enterprise packaging",
      "CRM and workflow integrations",
    ],
    pricingSummary:
      "Free plan; Starter $49/mo; Growth $149/mo; Scale $299/mo; Enterprise contact sales. Confirm current search, verification, and campaign limits on hunter.io/pricing.",
    whoShouldChoose:
      "Choose Hunter when domain email finding, verification, and light campaigns with clear published pricing are the primary jobs.",
    whoShouldConsiderAlternatives:
      "Compare Apollo for broader data+sequences, Snov.io for budget SMB finder+sequencer peers, Lusha for enrichment-first contact data, and RocketReach for named-prospect lookup.",
    alternativeSlugs: ["apollo", "snov", "lusha", "rocketreach"],
    competitorSlugs: ["apollo", "snov", "lusha", "rocketreach"],
    comparableSlugs: ["apollo", "snov"],
    subcategorySlugs: ["contact-data", "prospecting"],
    useCaseSlugs: ["prospecting", "email-outreach", "data-enrichment"],
    teamTypeSlugs: ["sales", "founders", "marketing"],
    businessSizeSlugs: ["micro", "small-business", "mid-market"],
    officialVideos: [
      {
        videoId: "drfArbarAKw",
        title: "How to Find a list of Emails using Hunter.io's Bulk Domain Search",
        channel: "Hunter",
        shows: [
          "Hunter bulk domain search workflow",
          "Building an email list from a domain",
        ],
        features: ["prospecting", "contact-data", "email-outreach"],
      },
    ],
    sourcesExtra: [
      {
        id: "hunter-product",
        url: "https://hunter.io/",
        title: "Hunter Product",
        domains: ["features", "product-positioning"],
      },
      {
        id: "hunter-pricing",
        url: "https://hunter.io/pricing/",
        title: "Hunter Pricing",
        domains: ["pricing", "plans", "free-plan"],
      },
    ],
  },
  {
    slug: "snov",
    name: "Snov.io",
    company: "Snov.io",
    website: "https://snov.io",
    domain: "snov.io",
    pricingUrl: "https://snov.io/pricing",
    aliases: ["Snov", "Snovio"],
    softShortDescription:
      "Budget SMB email finder, verifier, and cold email sequencer — trial; Starter from about $39/mo; Pro from about $99/mo; Custom/Ultra contact sales.",
    shortDescription:
      "Sales intelligence and cold email platform for finding and verifying emails, then running sequences — positioned as a budget-friendly SMB stack with a trial, Starter and Pro published rungs, and Custom/Ultra contact-sales packaging.",
    vendorPositioning:
      "Snov.io helps sales teams find emails, verify them, and run cold email campaigns from one affordable platform.",
    pricingModel: "subscription",
    hasFreePlan: false,
    hasFreeTrial: true,
    startingPriceMonthly: 39,
    pricingNotes:
      "First-party pricing verified 2026-08-17 on snov.io/pricing: trial available; Starter from about $39/mo; Pro from about $99/mo; Custom/Ultra contact sales. No forever-free plan documented as primary entry in this pass. Confirm current credit/recipient limits and annual discounts on the live pricing page.",
    fixturePlans: [
      "PLAN starter: name=Starter; amountPerSeat=39; currency=USD; interval=month; billingInterval=month; unit=seat; hasFreeTrial=true",
      "PLAN pro: name=Pro; amountPerSeat=99; currency=USD; interval=month; billingInterval=month; unit=seat; hasFreeTrial=true",
      "PLAN custom: name=Custom; contactSales=true; currency=USD; interval=month; billingInterval=month; unit=seat",
      "PLAN ultra: name=Ultra; contactSales=true; currency=USD; interval=month; billingInterval=month; unit=seat",
    ],
    enrichmentPlans: [
      planPerSeat("starter", "Starter", 39, {
        hasFreeTrial: true,
        highlighted: true,
      }),
      planPerSeat("pro", "Pro", 99, { hasFreeTrial: true }),
      contactSalesPlan("custom", "Custom"),
      contactSalesPlan("ultra", "Ultra"),
    ],
    featureOverrides: {
      "contact-data": "supported",
      prospecting: "supported",
      "data-enrichment": "limited",
      "email-outreach": "supported",
      "email-sequences": "supported",
      "crm-sync": "supported",
      "lead-management": "limited",
      reporting: "limited",
      "ai-assistance": "limited",
      "lead-scoring": "limited",
      integrations: "supported",
      "contact-management": "supported",
    },
    aiLines: [
      "AI email-generation: limited",
      "AI assistant: limited",
      "AI recommendations: limited",
      "AI automation: limited",
    ],
    integrations: [
      { integrationSlug: "hubspot", kind: "native" },
      { integrationSlug: "salesforce", kind: "official-connector" },
      { integrationSlug: "pipedrive", kind: "official-connector" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    limitations: [
      "No forever-free plan documented as primary entry — evaluation is trial-led",
      "Contact database depth is lighter than ZoomInfo/Apollo-class breadth claims",
      "Lead scoring is limited versus enterprise SI platforms",
      "Reporting is lighter than ABM analytics suites",
      "Custom/Ultra packaging is contact-sales for higher volume",
    ],
    limitationKinds: [
      "plan-restriction",
      "other",
      "feature-unavailable",
      "feature-unavailable",
      "plan-restriction",
    ],
    scores: {
      "contact-data": 7,
      prospecting: 7,
      "data-enrichment": 6,
      "email-outreach": 8,
      "crm-sync": 7,
      "ease-of-use": 7,
      reporting: 6,
      "value-for-money": 8,
    },
    scoreRationales: {
      "contact-data":
        "Solid email finder/verifier for SMB outbound; not positioned as the deepest enterprise mega-database.",
      prospecting:
        "Finder + list building for cold outreach is a first-party strength for budget SMB teams.",
      "data-enrichment":
        "Useful enrichment around found emails/companies, lighter than waterfall enrichment platforms.",
      "email-outreach":
        "Cold email sequencing is a core product job — stronger execution than pure contact databases.",
      "crm-sync":
        "CRM connectors are documented for common SMB stacks; solid but not the deepest enterprise sync story.",
      "ease-of-use":
        "Approachable SMB UX for finder + campaigns; credit/recipient limits need light governance.",
      reporting:
        "Campaign reporting supports outbound coaching; not enterprise ABM analytics.",
      "value-for-money":
        "Starter-from-about-$39 published ladder and trial path are accessible for budget SMB buyers.",
    },
    bestFor: [
      "Budget SMB teams that need email finder + verifier + cold email sequences in one seat",
      "Outbound founders who want published Starter/Pro rungs rather than enterprise quotes",
      "Teams comparing Hunter/Apollo peers on price-sensitive email-led motions",
    ],
    notIdealFor: [
      "Enterprise buyers needing deep phone-verified mobiles and ABM intent",
      "Teams that require a forever-free plan as the only evaluation path",
      "Buyers whose primary job is LinkedIn-graph or dialer-led outbound",
    ],
    pros: [
      "Finder + verifier + cold email sequencer in one affordable SMB stack",
      "Published Starter/Pro headline pricing with trial evaluation",
      "Strong email outreach score versus pure data tools",
      "Approachable UX for small outbound teams",
      "CRM connectors for common SMB tools",
    ],
    cons: [
      "No forever-free plan in this research pass",
      "Database depth lighter than enterprise SI leaders",
      "Lead scoring and deep enrichment are limited",
      "Higher volume pushes to Custom/Ultra contact sales",
      "Reporting is lighter than ABM platforms",
    ],
    keyFeatures: [
      "Email finder and verifier",
      "Cold email sequences / campaigns",
      "Prospecting list building",
      "Starter/Pro published rungs plus Custom/Ultra",
      "CRM and workflow integrations",
    ],
    pricingSummary:
      "Trial available; Starter from about $39/mo; Pro from about $99/mo; Custom/Ultra contact sales. No forever-free plan documented as primary entry in this pass. Confirm limits on snov.io/pricing.",
    whoShouldChoose:
      "Choose Snov.io when budget SMB email finding plus cold email sequencing with published Starter/Pro rungs is the primary job.",
    whoShouldConsiderAlternatives:
      "Compare Apollo for broader data+sequences, Hunter for domain-finder simplicity, Reply for deeper multichannel engagement, and Closely for LinkedIn-led outbound.",
    alternativeSlugs: ["apollo", "hunter", "reply", "closely"],
    competitorSlugs: ["apollo", "hunter", "reply", "closely"],
    comparableSlugs: ["apollo", "hunter"],
    subcategorySlugs: ["contact-data", "prospecting"],
    useCaseSlugs: ["prospecting", "email-outreach", "data-enrichment"],
    teamTypeSlugs: ["sales", "founders"],
    businessSizeSlugs: ["micro", "small-business", "mid-market"],
    officialVideos: [
      {
        videoId: "N4V81iIWOEA",
        title: "LinkedIn + Email + Phone: The Omnichannel Sequence in Snov.io",
        channel: "Snovio",
        shows: [
          "Snov.io omnichannel sequence UI demo",
          "LinkedIn + email + phone sequence workflow",
        ],
        features: ["email-outreach", "email-sequences", "prospecting"],
      },
      {
        videoId: "Ov8CJzDZMd8",
        title: "Find phone numbers with email address with Snov.io",
        channel: "Snovio",
        shows: [
          "Finding phone numbers from email in Snov.io",
          "Contact enrichment UI demo",
        ],
        features: ["contact-data", "data-enrichment", "prospecting"],
      },
    ],
    sourcesExtra: [
      {
        id: "snov-product",
        url: "https://snov.io/",
        title: "Snov.io Product",
        domains: ["features", "product-positioning"],
      },
      {
        id: "snov-pricing",
        url: "https://snov.io/pricing",
        title: "Snov.io Pricing",
        domains: ["pricing", "plans", "free-trial"],
      },
    ],
  },
  {
    slug: "kaspr",
    name: "Kaspr",
    company: "Kaspr",
    website: "https://kaspr.io",
    domain: "kaspr.io",
    pricingUrl: "https://kaspr.io/pricing",
    softShortDescription:
      "LinkedIn-centric EU/EMEA contact data via Chrome — Free; Starter from $49/mo annual ($65 monthly); Business $79/$99; Enterprise custom.",
    shortDescription:
      "LinkedIn-centric B2B contact data platform with a Chrome extension, oriented to EU/EMEA prospecting — Free plan plus Starter and Business published rungs (annual headline pricing highlighted) and Enterprise custom packaging.",
    vendorPositioning:
      "Kaspr helps sales teams find B2B phone numbers and emails from LinkedIn and sync them into CRM — built for European go-to-market teams.",
    pricingModel: "subscription",
    hasFreePlan: true,
    hasFreeTrial: false,
    startingPriceMonthly: 49,
    pricingNotes:
      "First-party pricing verified 2026-08-17 on kaspr.io/pricing: Free plan; Starter $49/mo when billed annually ($65/mo monthly); Business $79/mo annual ($99/mo monthly); Enterprise custom. Annual headline used as primary starting price ($49). Confirm current credit/export limits on the live pricing page.",
    fixturePlans: [
      "PLAN free: name=Free; isFree=true; currency=USD; interval=month; billingInterval=month",
      "PLAN starter: name=Starter; amountPerSeat=49; currency=USD; interval=month; billingInterval=annual; unit=seat",
      "PLAN business: name=Business; amountPerSeat=79; currency=USD; interval=month; billingInterval=annual; unit=seat",
      "PLAN enterprise: name=Enterprise; contactSales=true; currency=USD; interval=month; billingInterval=month; unit=seat",
    ],
    enrichmentPlans: [
      freePlan("free", "Free"),
      planPerSeat("starter", "Starter", 49, {
        highlighted: true,
        billingInterval: "annual",
      }),
      planPerSeat("business", "Business", 79, { billingInterval: "annual" }),
      contactSalesPlan("enterprise", "Enterprise"),
    ],
    featureOverrides: {
      "contact-data": "supported",
      prospecting: "supported",
      "data-enrichment": "limited",
      "email-outreach": "limited",
      "email-sequences": "limited",
      "crm-sync": "supported",
      "lead-management": "limited",
      reporting: "limited",
      "ai-assistance": "limited",
      "lead-scoring": "limited",
      integrations: "supported",
      "contact-management": "supported",
    },
    aiLines: [
      "AI assistant: limited",
      "AI recommendations: limited",
      "AI automation: limited",
      "AI email-generation: limited",
    ],
    integrations: [
      { integrationSlug: "hubspot", kind: "native" },
      { integrationSlug: "salesforce", kind: "official-connector" },
      { integrationSlug: "pipedrive", kind: "official-connector" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    limitations: [
      "LinkedIn-centric capture — coverage and compliance depend on LinkedIn workflow policies",
      "Native email outreach/sequencing depth is limited versus engagement platforms",
      "Reporting is lighter than enterprise SI/ABM suites",
      "Monthly billing is higher than annual headline — model carefully",
      "Not a full enterprise predictive ABM or mega-database platform",
    ],
    limitationKinds: [
      "other",
      "feature-unavailable",
      "feature-unavailable",
      "high-cost-at-scale",
      "feature-unavailable",
    ],
    scores: {
      "contact-data": 7,
      prospecting: 7,
      "data-enrichment": 6,
      "email-outreach": 3,
      "crm-sync": 7,
      "ease-of-use": 8,
      reporting: 5,
      "value-for-money": 7,
    },
    scoreRationales: {
      "contact-data":
        "Solid LinkedIn-centric EU/EMEA contact reveals; not positioned as the deepest global mega-database.",
      prospecting:
        "Chrome + LinkedIn prospecting is the core motion — strong for that workflow, narrower than all-in-one SI suites.",
      "data-enrichment":
        "Useful enrichment of LinkedIn-sourced contacts into CRM; lighter than waterfall enrichment platforms.",
      "email-outreach":
        "Not primarily a sequencer — outreach depth is limited versus Hunter/Snov/Apollo campaign tools.",
      "crm-sync":
        "CRM push from Chrome capture is first-party documented for common sales CRMs.",
      "ease-of-use":
        "Chrome extension UX is approachable for SDRs doing LinkedIn-led prospecting.",
      reporting:
        "Light operational reporting versus enterprise SI analytics.",
      "value-for-money":
        "Free plan plus annual Starter-from-$49 headline is accessible for SMB/EMEA teams; monthly rates are higher.",
    },
    bestFor: [
      "EMEA/EU-leaning SMB and mid-market teams prospecting via LinkedIn + Chrome",
      "Buyers who want Free evaluation and clear annual Starter/Business headlines",
      "Teams that need phone/email reveals into CRM more than a built-in sequencer",
    ],
    notIdealFor: [
      "Teams whose primary job is multichannel email sequencing",
      "Buyers needing enterprise predictive ABM or NA mega-database depth",
      "Organizations that cannot accept LinkedIn/Chrome prospecting compliance risk",
    ],
    pros: [
      "LinkedIn-centric contact data suited to EU/EMEA motions",
      "Free plan plus published annual Starter/Business headlines",
      "Approachable Chrome extension UX",
      "CRM sync for common sales tools",
      "Clearer packaging than opaque enterprise SI quotes",
    ],
    cons: [
      "Weak native email outreach versus sequencer-first tools",
      "LinkedIn workflow compliance risk",
      "Reporting is light",
      "Monthly billing costs more than annual headline",
      "Not an enterprise ABM or waterfall enrichment platform",
    ],
    keyFeatures: [
      "LinkedIn + Chrome contact reveals",
      "EU/EMEA-oriented B2B phone and email data",
      "CRM export/sync workflows",
      "Free + Starter/Business/Enterprise packaging",
      "Annual headline pricing with monthly alternatives",
    ],
    pricingSummary:
      "Free plan; Starter $49/mo billed annually ($65 monthly); Business $79/mo annual ($99 monthly); Enterprise custom. Starting price uses annual Starter headline ($49). Confirm limits on kaspr.io/pricing.",
    whoShouldChoose:
      "Choose Kaspr when LinkedIn-centric EU/EMEA contact reveals into CRM with Free + published annual plans are the primary jobs.",
    whoShouldConsiderAlternatives:
      "Compare Lusha for enrichment-first peers, Cognism for compliance-first EMEA phone-verified mobiles, LinkedIn Sales Navigator for graph prospecting, and Seamless.AI for high-volume contact search.",
    alternativeSlugs: ["lusha", "cognism", "linkedin-sales-navigator", "seamless-ai"],
    competitorSlugs: ["lusha", "cognism", "linkedin-sales-navigator", "seamless-ai"],
    comparableSlugs: ["lusha", "cognism"],
    subcategorySlugs: ["contact-data", "prospecting"],
    useCaseSlugs: ["prospecting", "data-enrichment", "contact-management"],
    teamTypeSlugs: ["sales", "revops"],
    businessSizeSlugs: ["micro", "small-business", "mid-market"],
    officialVideos: [
      {
        videoId: "62gaE6gEEHY",
        title: "Export Leads from LinkedIn to Your CRM – Fast & Easy",
        channel: "Kaspr",
        shows: [
          "Exporting LinkedIn leads to CRM with Kaspr",
          "Chrome extension capture workflow",
        ],
        features: ["prospecting", "crm-sync", "contact-data"],
      },
      {
        videoId: "HjwozM3flxk",
        title: "How to: Discovering your first leads",
        channel: "Kaspr",
        shows: [
          "Discovering first leads in Kaspr",
          "LinkedIn-led prospecting intro",
        ],
        features: ["prospecting", "contact-data"],
      },
      {
        videoId: "JqQ9YyGK_GA",
        title: "How to: Launch your first automation",
        channel: "Kaspr",
        shows: [
          "Launching first automation in Kaspr",
          "Automation workflow overview",
        ],
        features: ["prospecting", "integrations"],
      },
    ],
    sourcesExtra: [
      {
        id: "kaspr-product",
        url: "https://kaspr.io/",
        title: "Kaspr Product",
        domains: ["features", "product-positioning"],
      },
      {
        id: "kaspr-pricing",
        url: "https://kaspr.io/pricing",
        title: "Kaspr Pricing",
        domains: ["pricing", "plans", "free-plan"],
      },
    ],
  },
  {
    slug: "ocean",
    name: "Ocean.io",
    company: "Ocean.io",
    website: "https://ocean.io",
    domain: "ocean.io",
    pricingUrl: "https://ocean.io/pricing",
    aliases: ["Ocean", "Ocean.io"],
    softShortDescription:
      "Lookalike / similar-company prospecting on a credit model — about $0.063/credit, ~9k credit minimum, yearly about $567 (~$47.25/mo).",
    shortDescription:
      "Sales intelligence platform centered on lookalike and similar-company prospecting — finding companies like your best customers — monetized via a credit model with a published per-credit rate and yearly minimum packaging.",
    vendorPositioning:
      "Ocean.io helps B2B teams find lookalike companies and the right people to contact — similar-company prospecting powered by firmographic and buyer signals.",
    pricingModel: "usage",
    hasFreePlan: false,
    hasFreeTrial: true,
    startingPriceMonthly: 47,
    pricingNotes:
      "First-party pricing verified 2026-08-17 on ocean.io/pricing: credit model about $0.063/credit; minimum about 9,000 credits; yearly about $567 (about $47.25/mo when yearly/12). Free trial documented where offered on pricing. Custom packaging may be contact-sales. Confirm current credit rates, minimums, and trial terms on the live pricing page.",
    fixturePlans: [
      "PLAN credits-yearly: name=Credits (yearly minimum); amountPerSeat=47; currency=USD; interval=month; billingInterval=annual; unit=credit; notes=~$0.063/credit; ~9k min; ~$567/year",
      "PLAN custom: name=Custom; contactSales=true; currency=USD; interval=month; billingInterval=month; unit=credit",
    ],
    enrichmentPlans: [
      planPerSeat("credits-yearly", "Credits (yearly minimum)", 47, {
        highlighted: true,
        hasFreeTrial: true,
        billingInterval: "annual",
      }),
      contactSalesPlan("custom", "Custom"),
    ],
    featureOverrides: {
      "contact-data": "limited",
      prospecting: "supported",
      "data-enrichment": "supported",
      "email-outreach": "limited",
      "email-sequences": "limited",
      "crm-sync": "limited",
      "lead-management": "limited",
      reporting: "limited",
      "ai-assistance": "limited",
      "lead-scoring": "limited",
      integrations: "supported",
      "contact-management": "limited",
    },
    aiLines: [
      "AI recommendations: limited",
      "AI assistant: limited",
      "AI lead-scoring: limited",
      "AI automation: limited",
    ],
    integrations: [
      { integrationSlug: "hubspot", kind: "native" },
      { integrationSlug: "salesforce", kind: "official-connector" },
      { integrationSlug: "clay", kind: "third-party" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    limitations: [
      "Lookalike/similar-company specialist — not a full contact mega-database or sequencer",
      "Credit minimums and yearly packaging require modeling before comparing to seat tools",
      "Native email outreach/sequencing depth is limited",
      "CRM sync depth is secondary to lookalike prospecting workflows",
      "Reporting is lighter than enterprise ABM analytics suites",
    ],
    limitationKinds: [
      "feature-unavailable",
      "usage-cap",
      "feature-unavailable",
      "feature-unavailable",
      "feature-unavailable",
    ],
    scores: {
      "contact-data": 7,
      prospecting: 8,
      "data-enrichment": 8,
      "email-outreach": 2,
      "crm-sync": 7,
      "ease-of-use": 7,
      reporting: 5,
      "value-for-money": 7,
    },
    scoreRationales: {
      "contact-data":
        "Contact/people data supports lookalike workflows but is secondary to similar-company discovery — score is intentionally moderate.",
      prospecting:
        "Lookalike / similar-company prospecting is the product’s center of gravity — strong for that buying job.",
      "data-enrichment":
        "Firmographic and buyer-context enrichment of target companies is core to lookalike matching.",
      "email-outreach":
        "Not a sequencer — outreach happens elsewhere. Score reflects lookalike-only posture.",
      "crm-sync":
        "Connectors exist but sync is not the primary product story versus Clay/Apollo-class CRM depth.",
      "ease-of-use":
        "Lookalike UX is approachable for GTM teams; credit minimums add moderate buying complexity.",
      reporting:
        "Light versus dedicated SI/ABM analytics suites.",
      "value-for-money":
        "Published per-credit rate and yearly minimum (~$47/mo effective) are clearer than opaque enterprise quotes; still usage-sensitive.",
    },
    bestFor: [
      "GTM teams whose primary job is finding lookalike / similar companies to best customers",
      "Buyers comparing Ocean to Clay-style creative prospecting when lookalike matching is the bottleneck",
      "Teams willing to model credit minimums (~9k) and yearly packaging",
    ],
    notIdealFor: [
      "Buyers who need a full contact database + sequencer as the primary seat",
      "Teams that only need occasional named-prospect email lookups",
      "Enterprise ABM buyers whose primary job is predictive intent orchestration",
    ],
    pros: [
      "Clear lookalike / similar-company prospecting specialty",
      "Published credit rate and yearly minimum packaging",
      "Useful peer to Clay for creative company discovery workflows",
      "Enrichment of firmographic/buyer context for target accounts",
      "Trial path where offered for evaluation",
    ],
    cons: [
      "Not a full contact mega-database or email sequencer",
      "Credit minimums raise the floor versus tiny SMB seats",
      "CRM sync and reporting are secondary",
      "Email outreach score is intentionally low",
      "Custom packaging may still require sales for larger deals",
    ],
    keyFeatures: [
      "Lookalike / similar-company prospecting",
      "Firmographic and buyer-signal enrichment",
      "Credit-based usage packaging",
      "CRM and workflow connectors",
      "Find right companies and right people workflows",
    ],
    pricingSummary:
      "Usage/credit model about $0.063/credit; minimum about 9,000 credits; yearly about $567 (~$47.25/mo). Free trial where offered. Custom contact-sales for larger packaging. Confirm on ocean.io/pricing.",
    whoShouldChoose:
      "Choose Ocean.io when lookalike / similar-company prospecting is the named buying job and you can model credit minimums.",
    whoShouldConsiderAlternatives:
      "Compare Clay for multi-provider waterfall enrichment, Apollo for data+sequences, ZoomInfo for enterprise databases, and Bombora when third-party intent (not lookalikes) is the specialist need.",
    alternativeSlugs: ["clay", "apollo", "zoominfo", "bombora"],
    competitorSlugs: ["clay", "apollo", "zoominfo", "bombora"],
    comparableSlugs: ["clay", "apollo"],
    subcategorySlugs: ["prospecting", "data-enrichment"],
    useCaseSlugs: ["prospecting", "data-enrichment", "lead-management"],
    teamTypeSlugs: ["sales", "marketing", "revops"],
    businessSizeSlugs: ["small-business", "mid-market", "enterprise"],
    officialVideos: [
      {
        videoId: "jv9OTqzhdLg",
        title: "Ocean.io explained in 2 minutes — Find the right companies and right people",
        channel: "Ocean",
        shows: [
          "Ocean.io lookalike prospecting overview",
          "Finding right companies and people",
        ],
        features: ["prospecting", "data-enrichment", "contact-data"],
      },
    ],
    sourcesExtra: [
      {
        id: "ocean-product",
        url: "https://ocean.io/",
        title: "Ocean.io Product",
        domains: ["features", "product-positioning"],
      },
      {
        id: "ocean-pricing",
        url: "https://ocean.io/pricing",
        title: "Ocean.io Pricing",
        domains: ["pricing", "plans", "free-trial"],
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
      notes: `First-party product positioning for ${p.name} (SI Priority-3 onboarding 2026-08-17).`,
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
    purpose: `Official ${p.name} product video for SI Priority-3 onboarding`,
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
      rationale: `${p.name} fit for ${businessSizeSlug} sales teams from first-party positioning and SI Priority-3 research.`,
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
    notes: `SI Priority-3 onboarding enrichment from first-party research ${VERIFIED_AT}. handsOnTesting=false.`,
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
    notes: "SI Priority-3 first-party research extract",
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
      "SI Priority-3 batch. Approved on sales-intelligence-editorial v1.0.0. handsOnTesting=false. Affiliate economics excluded.",
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
          "SI Priority-3 onboarding; approved SI criteria; handsOnTesting=false",
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
      id: `job-${p.slug}-si-priority3`,
      productSlug: p.slug,
      status: "completed",
      createdAt: VERIFIED_AT,
      completedAt: VERIFIED_AT,
      notes: "SI Priority-3 batch",
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
  const out = path.join(ROOT, "scripts/_si-priority3-seed-snippet.ts");
  const body = `// Auto-generated by scripts/onboard-si-priority3-batch.mjs
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
    path.join(ROOT, "scripts/_si-priority3-official-videos.json"),
    videos,
  );
  console.log(`✓ video specs → ${videos.length} videos`);
}

function main() {
  for (const p of PRODUCTS) writeProduct(p);
  writeSeedSnippet(PRODUCTS);
  writeVideoImportSpec(PRODUCTS);
  console.log("\nNext:");
  console.log("  1. Patch software.ts with scripts/_si-priority3-seed-snippet.ts");
  console.log("  2. Download / generate brand logos under public/brands/");
  console.log("  3. Update best.ts + comparisons.ts");
  console.log("  4. npx tsx scripts/product-guide-visuals.ts --si");
  console.log("  5. Import official videos via assets:approve flow");
  console.log("  6. npm run workflow:run -- software <slug> (approval gates)");
  console.log("  7. Content quality audit — target >75");
}

main();
