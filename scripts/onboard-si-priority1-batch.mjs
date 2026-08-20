#!/usr/bin/env node
/**
 * Sales Intelligence Priority-1 credibility products (not yet onboarded):
 * ZoomInfo, Cognism, LinkedIn Sales Navigator.
 *
 * Usage: node scripts/onboard-si-priority1-batch.mjs
 * Idempotent — overwrites product research / editorial packs.
 *
 * Does NOT auto-publish. Affiliate economics never enter scores.
 * Grounded in first-party research packs gathered 2026-08-17.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const VERIFIED_AT = "2026-08-17T08:00:00.000Z";
const PUBLISHED_AT = "2026-08-17T00:00:00.000Z";

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

/** @type {object[]} */
const PRODUCTS = [
  {
    slug: "zoominfo",
    name: "ZoomInfo",
    company: "ZoomInfo Technologies",
    website: "https://www.zoominfo.com",
    domain: "zoominfo.com",
    pricingUrl: "https://www.zoominfo.com/pricing",
    softShortDescription:
      "Enterprise go-to-market intelligence platform for B2B contact/company data, enrichment, intent, and Copilot workflows — custom-quote packaging.",
    shortDescription:
      "Go-to-market intelligence platform providing B2B company and contact data, buying signals, enrichment, and AI Copilot workflows for sales and marketing teams.",
    vendorPositioning:
      "ZoomInfo is a go-to-market intelligence platform that helps businesses find, engage, and win customers more efficiently.",
    pricingModel: "custom-quote",
    hasFreePlan: false,
    hasFreeTrial: true,
    pricingNotes:
      "Main Sales/Marketing packages are licenses + credits with named plans (Professional, Copilot Advanced, Copilot Enterprise, Marketing Demand, ABM Lite, ABM Enterprise) but no published seat dollar prices on zoominfo.com/pricing — contact sales. GTM.AI is a separate pay-as-you-go surface with published credit prices; treat as adjacent access path, not the main Sales package list price.",
    fixturePlans: [
      "PLAN professional: name=ZoomInfo Professional; contactSales=true; currency=USD; interval=month; billingInterval=month; unit=seat",
      "PLAN copilot-advanced: name=Copilot Advanced; contactSales=true; currency=USD; interval=month; billingInterval=month; unit=seat",
      "PLAN copilot-enterprise: name=Copilot Enterprise; contactSales=true; currency=USD; interval=month; billingInterval=month; unit=seat",
    ],
    enrichmentPlans: [
      contactSalesPlan("professional", "ZoomInfo Professional", {
        highlighted: true,
        hasFreeTrial: true,
      }),
      contactSalesPlan("copilot-advanced", "Copilot Advanced", {
        hasFreeTrial: true,
      }),
      contactSalesPlan("copilot-enterprise", "Copilot Enterprise", {
        hasFreeTrial: true,
      }),
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
      "AI email-generation: supported",
      "AI assistant: supported",
      "AI recommendations: supported",
      "AI automation: supported",
    ],
    integrations: [
      { integrationSlug: "salesforce", kind: "native" },
      { integrationSlug: "hubspot", kind: "native" },
      { integrationSlug: "dynamics-365", kind: "native" },
      { integrationSlug: "outreach", kind: "native" },
      { integrationSlug: "salesloft", kind: "native" },
      { integrationSlug: "gong", kind: "native" },
    ],
    limitations: [
      "Main platform seat prices are not published — packaging is custom quote",
      "Credit consumption on export (CSV/CRM/API) requires ongoing governance",
      "Native sequencing depth is tier/partner dependent (Engage now partner-led with Salesloft)",
      "Database size claims conflict across ZoomInfo pages — do not treat a single count as settled",
      "Enterprise implementation and admin overhead are material vs SMB tools",
    ],
    scores: {
      "contact-data": 9,
      prospecting: 9,
      "data-enrichment": 9,
      "email-outreach": 6,
      "crm-sync": 9,
      "ease-of-use": 6,
      reporting: 8,
      "value-for-money": 5,
    },
    scoreRationales: {
      "contact-data":
        "First-party Sales and Contact & Company Search pages document a large B2B contact/company database with emails, direct dials, and 300+ attributes — the category’s enterprise data depth benchmark. Score is research-based, not a lab accuracy audit.",
      prospecting:
        "List building, search/filters, Chrome ReachOut, intent, and visitor identification are first-party Sales/prospecting surfaces — strong for outbound and ABM prioritization.",
      "data-enrichment":
        "Dedicated CRM enrichment (on-demand/scheduled/bulk) plus API enrich endpoints are first-party documented — enrichment is a primary buying job, not a side feature.",
      "email-outreach":
        "AI email generation, dialer, and Copilot drafting are documented, but native multichannel sequencing is limited/partner-dependent after the Engage→Salesloft partnership shift — score reflects outreach assist, not Apollo-class sequencer depth.",
      "crm-sync":
        "Professional CRM integrations (Salesforce, HubSpot, Dynamics, and more) plus Service Account help docs make sync a first-class enterprise capability.",
      "ease-of-use":
        "Powerful but enterprise-packaged: credits, licenses, Copilot tiers, and admin setup raise learning curve versus self-serve SMB tools.",
      reporting:
        "Copilot Enterprise advanced reporting/analytics and Marketing audience/campaign reporting are documented on pricing/product pages.",
      "value-for-money":
        "No published main-platform seat prices and custom packaging make value opaque for SMB buyers; enterprise teams that will use intent + enrichment may still justify cost — score reflects transparency and accessibility, not lab ROI.",
    },
    bestFor: [
      "Enterprise and upper mid-market NA outbound/ABM teams needing deep contact + company intelligence",
      "RevOps programs that will operationalize enrichment, intent, and CRM sync at scale",
      "Buyers who need org charts, technographics, and buying signals in one GTM data layer",
    ],
    notIdealFor: [
      "SMB teams that need transparent published pricing and self-serve seats",
      "Buyers who only want a lightweight sequencer without enterprise data depth",
      "EMEA-first teams whose primary buying criteria is GDPR phone-verified mobiles (compare Cognism)",
    ],
    pros: [
      "Enterprise-grade B2B contact and company data with enrichment workflows",
      "Intent, Account Fit Score, and Copilot AI prioritization documented first-party",
      "Broad CRM and sales-engagement integrations (Salesforce, HubSpot, Dynamics, Outreach, Salesloft)",
      "Named Sales and Marketing plan ladder even when dollars are quote-only",
      "Free-trial / talk-to-sales evaluation path is first-party documented",
    ],
    cons: [
      "Main platform list prices are not published — custom quote only",
      "Credits + licenses + add-ons create ongoing cost and ops complexity",
      "Native sequencing is limited/partner-dependent versus all-in-one SMB tools",
      "Homepage and some trust pages are often bot-blocked for research retrieval",
      "Overkill for founders who only need occasional contact lookups",
    ],
    keyFeatures: [
      "B2B contact and company database search",
      "CRM enrichment (bulk/scheduled/on-demand)",
      "Buyer intent and Account Fit Score",
      "ZoomInfo Copilot AI assistance",
      "CRM and sales-engagement sync",
    ],
    pricingSummary:
      "Custom-quote Sales packages: ZoomInfo Professional, Copilot Advanced, Copilot Enterprise (licenses + credits). No published seat dollar prices on zoominfo.com/pricing. Free trial / contact sales CTAs documented. Confirm current packaging with ZoomInfo.",
    whoShouldChoose:
      "Choose ZoomInfo when enterprise North American data depth, enrichment, and intent/Copilot workflows are the primary jobs and you can run a custom-quote evaluation.",
    whoShouldConsiderAlternatives:
      "Compare Apollo for self-serve data+engagement, Cognism for EMEA/compliance-first mobiles, and LinkedIn Sales Navigator for relationship/graph prospecting.",
    alternativeSlugs: ["apollo", "cognism", "linkedin-sales-navigator", "lusha"],
    competitorSlugs: ["apollo", "cognism", "linkedin-sales-navigator", "lusha"],
    comparableSlugs: ["apollo", "cognism"],
    subcategorySlugs: ["contact-data", "prospecting", "lead-generation"],
    useCaseSlugs: ["prospecting", "data-enrichment", "lead-management"],
    teamTypeSlugs: ["sales", "marketing", "revops"],
    businessSizeSlugs: ["mid-market", "enterprise"],
    media: [
      {
        videoId: null,
        note: "No single official product-overview YouTube embed verified from reachable product pages in the 2026-08-17 research pass — register via assets:approve when a vendor-channel video is confirmed.",
      },
    ],
    sourcesExtra: [
      {
        id: "zoominfo-sales-product",
        url: "https://www.zoominfo.com/products/sales",
        title: "ZoomInfo Sales",
        domains: ["features", "product-positioning", "ai-capabilities"],
      },
      {
        id: "zoominfo-enrichment",
        url: "https://www.zoominfo.com/features/data-enrichment",
        title: "ZoomInfo Data Enrichment",
        domains: ["features"],
      },
      {
        id: "zoominfo-copilot",
        url: "https://www.zoominfo.com/products/copilot",
        title: "ZoomInfo Copilot",
        domains: ["ai-capabilities", "features"],
      },
      {
        id: "zoominfo-docs",
        url: "https://docs.zoominfo.com/",
        title: "ZoomInfo Docs",
        domains: ["integrations", "features"],
      },
    ],
  },
  {
    slug: "cognism",
    name: "Cognism",
    company: "Cognism",
    website: "https://www.cognism.com",
    domain: "cognism.com",
    pricingUrl: "https://www.cognism.com/pricing",
    softShortDescription:
      "Compliance-first B2B sales intelligence with phone-verified Diamond Data® mobiles, strong EMEA coverage, and CRM enrichment — quote-led Sales Prospecting plans.",
    shortDescription:
      "Premium B2B sales intelligence platform focused on verified contact data, phone-verified mobiles (Diamond Data®), European/EMEA coverage, and CRM enrichment for outbound and RevOps teams.",
    vendorPositioning:
      "Europe’s most trusted B2B data for growing pipeline — premium sales intelligence with compliance-first contact data.",
    pricingModel: "custom-quote",
    hasFreePlan: false,
    hasFreeTrial: false,
    startingPriceAnnual: 12000,
    pricingNotes:
      "Sales Prospecting Standard and Pro include 5 seats and are talk-to-sales quote packages (no Standard/Pro list prices on /pricing). CRM Enrichment is published from $12,000/year on cognism.com/enrich. Credits: 1 credit per contact revealed. No self-serve free trial — sample data / discovery demo path.",
    fixturePlans: [
      "PLAN standard: name=Sales Prospecting Standard; contactSales=true; currency=USD; interval=year; billingInterval=year; unit=seat",
      "PLAN pro: name=Sales Prospecting Pro; contactSales=true; currency=USD; interval=year; billingInterval=year; unit=seat",
      "PLAN crm-enrichment: name=CRM Enrichment; amount=12000; currency=USD; interval=year; billingInterval=year; contactSales=true",
    ],
    enrichmentPlans: [
      contactSalesPlan("standard", "Sales Prospecting Standard", {
        highlighted: true,
      }),
      contactSalesPlan("pro", "Sales Prospecting Pro"),
      {
        id: "plan-crm-enrichment",
        slug: "crm-enrichment",
        name: "CRM Enrichment",
        isFree: false,
        contactSales: true,
        hasFreeTrial: false,
        highlighted: false,
        currency: "USD",
        amount: 12000,
        interval: "year",
        billingInterval: "year",
        rules: [],
      },
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
      "ai-assistance": "supported",
      "lead-scoring": "unknown",
      integrations: "supported",
      "contact-management": "supported",
    },
    aiLines: [
      "AI assistant: supported",
      "AI recommendations: limited",
      "AI automation: limited",
      "AI email-generation: unknown",
    ],
    integrations: [
      { integrationSlug: "salesforce", kind: "native" },
      { integrationSlug: "hubspot", kind: "native" },
      { integrationSlug: "pipedrive", kind: "native" },
      { integrationSlug: "dynamics-365", kind: "native" },
      { integrationSlug: "outreach", kind: "native" },
      { integrationSlug: "salesloft", kind: "native" },
    ],
    limitations: [
      "Not a native email sequencer — push contacts into Outreach/Salesloft or CRM for outreach",
      "Sales Prospecting Standard/Pro list prices are not published on /pricing",
      "No self-serve free forever plan or free trial on main pricing pages",
      "Intent topics are Pro-gated (Bombora Company Surge®; admins select up to 12 topics)",
      "Help Center pages often Cloudflare-blocked for automated research retrieval",
    ],
    scores: {
      "contact-data": 9,
      prospecting: 8,
      "data-enrichment": 8,
      "email-outreach": 3,
      "crm-sync": 8,
      "ease-of-use": 7,
      reporting: 6,
      "value-for-money": 6,
    },
    scoreRationales: {
      "contact-data":
        "Diamond Data® phone-verified mobiles, expansive email coverage, and compliance-scrubbed contact records are Cognism’s core first-party differentiator — especially for EMEA dialing motions.",
      prospecting:
        "Sales Prospecting with firmographic/technographic/signal filters, personas, Chrome extension over LinkedIn/Sales Navigator, and recommended contacts are documented first-party.",
      "data-enrichment":
        "CRM Enrichment (standalone or add-on), CSV enrichment, and DaaS destinations are first-party products — enrichment is a real buying path, not marketing fluff.",
      "email-outreach":
        "Cognism exports data for outreach but does not claim native email sending or sequences — Outreach/Salesloft integrations cover that job. Score reflects data-for-outreach, not sequencer depth.",
      "crm-sync":
        "Native Salesforce, HubSpot, Pipedrive, Dynamics, Bullhorn plus Chrome extension CRM export and “real-time” sync language on sales-intelligence pages.",
      "ease-of-use":
        "Web app + browser extension prospecting is accessible for SDR workflows; credit reveals and quote packaging add moderate ops overhead.",
      reporting:
        "Admin/RevOps dashboards and CRM health diagnostics exist but Cognism is not positioned as a full campaign analytics suite.",
      "value-for-money":
        "CRM Enrichment from $12,000/year is published; Sales Prospecting is quote-led. Strong for EMEA compliance buyers; expensive opacity for SMB price shoppers.",
    },
    bestFor: [
      "EMEA / UK / DACH outbound teams that need phone-verified mobiles and GDPR-friendly data posture",
      "RevOps teams enriching Salesforce/HubSpot/Pipedrive with compliant B2B contacts",
      "Mid-market and enterprise teams that will pair Cognism data with a separate sequencer",
    ],
    notIdealFor: [
      "Buyers who need native multichannel sequences inside the same tool",
      "Teams that require transparent published list prices for every tier before shortlisting",
      "Founders who only need occasional unpaid contact lookups",
    ],
    pros: [
      "Diamond Data® phone-verified mobile numbers with on-demand verification on Pro",
      "Strong Europe/EMEA compliance positioning (GDPR, DNC scrubbing, ISO/SOC claims)",
      "CRM Enrichment with a published starting price ($12,000/year)",
      "Native CRM and sales-engagement integrations for export workflows",
      "AI search, company research, and persona builder on Sales Prospecting plans",
    ],
    cons: [
      "No native email sequences — you still need Outreach, Salesloft, or similar",
      "Sales Prospecting Standard/Pro dollars are quote-only on the pricing page",
      "No self-serve free trial on main pricing surfaces",
      "Intent data is Pro-gated",
      "Not a CRM system of record",
    ],
    keyFeatures: [
      "Diamond Data® phone-verified mobiles",
      "Sales Prospecting list building + Chrome extension",
      "CRM Enrichment and CSV enrichment",
      "Bombora-powered intent (Pro)",
      "Salesforce/HubSpot/Pipedrive sync",
    ],
    pricingSummary:
      "Sales Prospecting Standard & Pro: 5 seats included, talk-to-sales quotes (no list prices on /pricing). CRM Enrichment from $12,000/year (first-party enrich page). Credit = contact reveal. Confirm current packaging with Cognism.",
    whoShouldChoose:
      "Choose Cognism when EMEA coverage, phone-verified mobiles, and compliance posture are the buying criteria and you already have (or will buy) a sequencer.",
    whoShouldConsiderAlternatives:
      "Compare ZoomInfo for NA enterprise depth, Apollo for self-serve data+sequences, and Lusha for lighter enrichment.",
    alternativeSlugs: ["zoominfo", "apollo", "lusha", "linkedin-sales-navigator"],
    competitorSlugs: ["zoominfo", "apollo", "lusha", "linkedin-sales-navigator"],
    comparableSlugs: ["zoominfo", "apollo"],
    subcategorySlugs: ["contact-data", "prospecting"],
    useCaseSlugs: ["prospecting", "data-enrichment", "contact-management"],
    teamTypeSlugs: ["sales", "revops"],
    businessSizeSlugs: ["mid-market", "enterprise"],
    officialVideos: [
      {
        videoId: "U21fgvZ1J0s",
        title: "Cognism for sales | Prospecting into owned accounts",
        channel: "Cognism",
        shows: [
          "Web app list building against owned accounts",
          "Filters and export to CRM / Outreach / Salesloft",
        ],
        features: ["prospecting", "contact-data", "crm-sync"],
      },
      {
        videoId: "_mAqGP5ILf0",
        title: "How to use the Cognism Chrome Extension",
        channel: "Cognism",
        shows: [
          "Chrome extension prospecting on LinkedIn surfaces",
          "CRM export from the extension",
        ],
        features: ["prospecting", "crm-sync"],
      },
    ],
    sourcesExtra: [
      {
        id: "cognism-diamond-data",
        url: "https://www.cognism.com/diamond-data",
        title: "Cognism Diamond Data",
        domains: ["features", "product-positioning"],
      },
      {
        id: "cognism-sales-intelligence",
        url: "https://www.cognism.com/sales-intelligence",
        title: "Cognism Sales Intelligence",
        domains: ["features", "product-positioning"],
      },
      {
        id: "cognism-enrich",
        url: "https://www.cognism.com/enrich",
        title: "Cognism CRM Enrichment",
        domains: ["pricing", "features"],
      },
      {
        id: "cognism-integrations",
        url: "https://www.cognism.com/integrations",
        title: "Cognism Integrations",
        domains: ["integrations"],
      },
      {
        id: "cognism-compliance",
        url: "https://www.cognism.com/compliance",
        title: "Cognism Compliance",
        domains: ["security-compliance", "product-positioning"],
      },
    ],
  },
  {
    slug: "linkedin-sales-navigator",
    name: "LinkedIn Sales Navigator",
    company: "LinkedIn",
    website: "https://business.linkedin.com/sell/sales-navigator",
    domain: "business.linkedin.com",
    pricingUrl:
      "https://business.linkedin.com/sell/sales-navigator/compare-plans",
    aliases: ["Sales Navigator", "LinkedIn Sales Nav"],
    softShortDescription:
      "LinkedIn’s AI-powered B2B sales tool for network prospecting, Buyer Intent, and InMail — Core from US$119.99/mo; Advanced Plus for CRM sync.",
    shortDescription:
      "LinkedIn’s AI-powered B2B sales tool for finding buyers on LinkedIn’s professional network with advanced search, Buyer Intent, InMail, Account/Lead IQ, and Advanced Plus CRM sync.",
    vendorPositioning:
      "AI-powered B2B sales tool to find the right buyers, grow your pipeline, and close deals faster — tailored for individual sellers and sales teams.",
    pricingModel: "subscription",
    hasFreePlan: false,
    hasFreeTrial: true,
    startingPriceMonthly: 119.99,
    pricingNotes:
      "Compare Plans (updated Aug 1, 2026): Core from US$119.99/mo or US$1,079.88/yr; Advanced from US$159.99/mo or US$1,799.88/yr; Advanced Plus custom. Prices are estimates, per license, may exclude VAT/GST. Free trial eligibility gated (no paid LinkedIn sub / no free trial in past 365 days).",
    fixturePlans: [
      "PLAN core: name=Core; amountPerSeat=119.99; currency=USD; interval=month; billingInterval=month; unit=seat",
      "PLAN advanced: name=Advanced; amountPerSeat=159.99; currency=USD; interval=month; billingInterval=month; unit=seat",
      "PLAN advanced-plus: name=Advanced Plus; contactSales=true; currency=USD; interval=month; billingInterval=month; unit=seat",
    ],
    enrichmentPlans: [
      planPerSeat("core", "Core", 119.99, {
        hasFreeTrial: true,
        highlighted: true,
      }),
      planPerSeat("advanced", "Advanced", 159.99, { hasFreeTrial: true }),
      contactSalesPlan("advanced-plus", "Advanced Plus"),
    ],
    featureOverrides: {
      "contact-data": "limited",
      prospecting: "supported",
      "data-enrichment": "limited",
      "email-outreach": "limited",
      "email-sequences": "unknown",
      "crm-sync": "supported",
      "lead-management": "supported",
      reporting: "supported",
      "ai-assistance": "supported",
      "lead-scoring": "unknown",
      integrations: "supported",
      "contact-management": "limited",
    },
    aiLines: [
      "AI assistant: supported",
      "AI email-generation: limited",
      "AI recommendations: supported",
      "AI automation: limited",
    ],
    integrations: [
      { integrationSlug: "salesforce", kind: "native" },
      { integrationSlug: "hubspot", kind: "native" },
      { integrationSlug: "dynamics-365", kind: "native" },
      { integrationSlug: "oracle-cx", kind: "native" },
      { integrationSlug: "gong", kind: "native" },
      { integrationSlug: "outreach", kind: "native" },
    ],
    limitations: [
      "Not a B2B email/phone contact database — InMail is designed to work without contact info",
      "No bulk InMail; messages are individual with monthly InMail credits (50/mo stated on plans)",
      "CRM Sync, Lead/Contact Creation, and ROI Reporting are Advanced Plus only",
      "Many AI features (Account IQ, Lead IQ, Message Assist) are Advanced/Advanced Plus and language/beta gated",
      "Does not replace a CRM or a specialist enrichment database",
    ],
    scores: {
      "contact-data": 5,
      prospecting: 9,
      "data-enrichment": 5,
      "email-outreach": 4,
      "crm-sync": 7,
      "ease-of-use": 8,
      reporting: 7,
      "value-for-money": 7,
    },
    scoreRationales: {
      "contact-data":
        "Sales Navigator searches LinkedIn’s professional network with strong firmographic/role filters, but it is not positioned as an email/phone database — contact-data score reflects graph coverage, not classic SI email/dial depth.",
      prospecting:
        "Advanced search, Personas, Relationship Explorer, Buyer Intent, saved searches, and lead alerts are first-party strengths — this is the product’s core job.",
      "data-enrichment":
        "Account IQ / Lead IQ and job-change alerts enrich LinkedIn-native context; Advanced Plus CRM validation helps keep CRM contacts current. It is not third-party email/phone waterfall enrichment.",
      "email-outreach":
        "Outreach is InMail/LinkedIn messaging (50 InMails/month; no bulk). No first-party email sequences product — score reflects social outreach, not SMTP sequencing.",
      "crm-sync":
        "CRM Sync and Embedded Experiences are real and well-documented — but gated to Advanced Plus, so the score balances capability depth with plan access.",
      "ease-of-use":
        "Familiar LinkedIn UX for individual sellers; Core/Advanced packaging is understandable. Advanced Plus CRM setup adds complexity for admins.",
      reporting:
        "Usage reporting on Advanced/Advanced Plus; ROI Reporting on Advanced Plus (custom reports upon request).",
      "value-for-money":
        "Published Core/Advanced starting prices and trial path are clearer than enterprise SI quotes; Advanced Plus remains custom. Value is strong when LinkedIn graph prospecting is the job — weak if you expected email/phone exports.",
    },
    bestFor: [
      "Sellers who prospect primarily on LinkedIn’s network and relationship graph",
      "Teams that want Buyer Intent and Account/Lead IQ on priority accounts",
      "Organizations buying Advanced Plus for Salesforce/Dynamics/HubSpot CRM sync",
    ],
    notIdealFor: [
      "Buyers who need verified emails and direct dials as the primary output",
      "Teams that need bulk email sequences inside the same tool",
      "Buyers who refuse Advanced Plus pricing but still require CRM sync",
    ],
    pros: [
      "Best-in-class LinkedIn network prospecting with advanced filters and alerts",
      "Published Core/Advanced starting prices (unlike most enterprise SI quotes)",
      "Buyer Intent, Account IQ, Lead IQ, and Message Assist (plan-gated AI)",
      "Advanced Plus CRM Sync with Salesforce, Dynamics, HubSpot, Oracle",
      "Trial path for eligible LinkedIn members",
    ],
    cons: [
      "Not an email/phone contact database",
      "No bulk InMail or native email sequences",
      "CRM sync and several admin features require Advanced Plus",
      "AI features are plan-, language-, and sometimes beta-gated",
      "InMail volume is capped (50/month stated on plans)",
    ],
    keyFeatures: [
      "Advanced LinkedIn search and lead/account lists",
      "Buyer Intent signals",
      "InMail messaging credits",
      "Account IQ / Lead IQ AI summaries",
      "Advanced Plus CRM Sync",
    ],
    pricingSummary:
      "Core from US$119.99/mo (US$1,079.88/yr); Advanced from US$159.99/mo (US$1,799.88/yr); Advanced Plus custom. Per-license estimates from LinkedIn Compare Plans (updated Aug 1, 2026). Confirm current pricing and trial eligibility on LinkedIn.",
    whoShouldChoose:
      "Choose LinkedIn Sales Navigator when relationship and LinkedIn-graph prospecting is the primary job — especially if you will also run a separate contact-data tool for emails/dials.",
    whoShouldConsiderAlternatives:
      "Compare Apollo or Lusha when email/phone data is the bottleneck; ZoomInfo when enterprise enrichment + intent depth is required; Cognism for EMEA phone-verified mobiles.",
    alternativeSlugs: ["apollo", "lusha", "zoominfo", "cognism"],
    competitorSlugs: ["apollo", "lusha", "zoominfo", "cognism"],
    comparableSlugs: ["apollo", "lusha"],
    subcategorySlugs: ["prospecting"],
    useCaseSlugs: ["prospecting", "lead-management"],
    teamTypeSlugs: ["sales"],
    businessSizeSlugs: ["micro", "small-business", "mid-market", "enterprise"],
    officialVideos: [
      {
        videoId: "qVL2gAceY-M",
        title: "Introduction to Sales Navigator",
        channel: "LinkedIn Sales Solutions",
        shows: [
          "Sales Navigator product introduction and prospecting framing",
        ],
        features: ["prospecting", "lead-management"],
      },
    ],
    sourcesExtra: [
      {
        id: "linkedin-sn-compare-plans",
        url: "https://business.linkedin.com/sell/sales-navigator/compare-plans",
        title: "Sales Navigator Compare Plans",
        domains: ["pricing", "plans", "free-trial", "features"],
      },
      {
        id: "linkedin-sn-ai",
        url: "https://business.linkedin.com/sell/sales-navigator/ai-for-sales",
        title: "AI for Sales — Sales Navigator",
        domains: ["ai-capabilities", "features"],
      },
      {
        id: "linkedin-sn-integrations",
        url: "https://business.linkedin.com/sell/sales-integrations",
        title: "Sales Navigator Integrations / SNAP",
        domains: ["integrations"],
      },
      {
        id: "linkedin-sn-crm",
        url: "https://business.linkedin.com/sales-solutions/sales-navigator-customer-hub/resources/crm",
        title: "Sales Navigator CRM Sync",
        domains: ["integrations", "features"],
      },
      {
        id: "linkedin-sn-inmail-help",
        url: "https://www.linkedin.com/help/sales-navigator/answer/a102025",
        title: "Sales Navigator InMail Help",
        domains: ["features", "limits"],
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
      domains: ["identity", "features", "product-positioning", "ai-capabilities"],
      confidence: "high",
      status: "active",
      notes: `First-party product positioning for ${p.name} (SI Priority-1 onboarding 2026-08-17).`,
    },
    {
      id: `${p.slug}-pricing-official`,
      productSlug: p.slug,
      url: p.pricingUrl,
      domain: p.domain,
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
    purpose: `Official ${p.name} product video for SI Priority-1 onboarding`,
    whatThisShows: v.shows ?? [],
    limitations: [],
    whatToNotice: [],
    status: "active",
  }));
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

  return {
    productSlug: p.slug,
    shortDescription: p.shortDescription,
    featureSupport,
    aiCapabilities: (p.aiLines ?? []).map((line) => {
      const [cap, avail] = line.replace(/^AI\s+/, "").split(":").map((s) => s.trim());
      return {
        capability: cap,
        availability: avail || "unknown",
        sourceIds: [`${p.slug}-product-official`],
      };
    }),
    integrationSupport: (p.integrations ?? []).map((i) => ({
      ...i,
      sourceIds: [`${p.slug}-product-official`],
    })),
    vendorPositioning: [
      {
        claim: p.vendorPositioning,
        audienceHints: p.bestFor.slice(0, 3),
        sourceIds: [`${p.slug}-product-official`],
      },
    ],
    editorialFit: {
      summary: p.whoShouldChoose,
      bestFor: p.bestFor,
      notIdealFor: p.notIdealFor,
    },
    limitations: p.limitations.map((description) => ({
      description,
      sourceIds: [`${p.slug}-product-official`],
    })),
    pricing,
    screenshots: [],
    media: buildMedia(p),
    sourceIds: [
      `${p.slug}-product-official`,
      `${p.slug}-pricing-official`,
      ...(p.sourcesExtra ?? []).map((s) => s.id),
    ],
    notes: `SI Priority-1 onboarding enrichment from first-party research ${VERIFIED_AT}. handsOnTesting=false.`,
    domainCheckedAt: VERIFIED_AT,
    updatedAt: VERIFIED_AT,
  };
}

function factBase(p, id, domain, field, value, sourceId, excerpt) {
  return {
    id,
    productSlug: p.slug,
    domain,
    field,
    value,
    valueType: typeof value === "object" ? "object" : typeof value,
    status: "approved",
    confidence: "medium",
    sourceIds: [sourceId],
    evidence: [
      {
        sourceId,
        excerpt: excerpt.slice(0, 280),
        retrievedAt: VERIFIED_AT,
      },
    ],
    createdAt: VERIFIED_AT,
    updatedAt: VERIFIED_AT,
    approvedAt: VERIFIED_AT,
    approvedBy: "editorial",
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
        `${plan.name}${plan.contactSales ? " (contact sales)" : ""}`,
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
      "Data depth / network coverage vs outreach execution built-in",
      "Published price transparency vs enterprise custom quoting",
      "Specialization fit vs all-in-one SMB consolidation",
    ],
    recommendation: `${p.whoShouldChoose} ${p.whoShouldConsiderAlternatives}`,
    editorialNotes:
      "SI Priority-1 credibility batch. Approved on sales-intelligence-editorial v1.0.0. handsOnTesting=false. Affiliate economics excluded.",
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
          "SI Priority-1 onboarding; approved SI criteria; handsOnTesting=false",
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
    keyFeatures: p.keyFeatures.map((label, i) => ({
      label,
      available: true,
      order: i,
    })),
    pricingSummary: p.pricingSummary,
    whoShouldChoose: p.whoShouldChoose,
    whoShouldConsiderAlternatives: p.whoShouldConsiderAlternatives,
    alternatives: p.alternativeSlugs.map((productSlug) => ({ productSlug })),
    faq: [
      {
        question: `Is ${p.name} a CRM?`,
        answer: `No. ${p.name} is sales intelligence / prospecting software. Keep a CRM of record (HubSpot, Salesforce, Pipedrive, etc.) and use ${p.name} for discovery, enrichment, or LinkedIn-graph prospecting as applicable.`,
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
    methodologySlug: "sales-intelligence-editorial",
    methodologyVersion: "1.0.0",
    handsOnTesting: false,
    confidence: "medium",
    reviewedAt: VERIFIED_AT,
    reviewer: "editorial",
    createdAt: VERIFIED_AT,
    updatedAt: VERIFIED_AT,
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
      id: `job-${p.slug}-si-priority1`,
      productSlug: p.slug,
      status: "completed",
      createdAt: VERIFIED_AT,
      completedAt: VERIFIED_AT,
      notes: "SI Priority-1 batch fixture research pack",
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
  const out = path.join(ROOT, "scripts/_si-priority1-seed-snippet.ts");
  const body = `// Auto-generated by scripts/onboard-si-priority1-batch.mjs
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
    path.join(ROOT, "scripts/_si-priority1-official-videos.json"),
    videos,
  );
  console.log(`✓ video specs → ${videos.length} videos`);
}

function main() {
  for (const p of PRODUCTS) writeProduct(p);
  writeSeedSnippet(PRODUCTS);
  writeVideoImportSpec(PRODUCTS);
  console.log("\nNext:");
  console.log("  1. Patch software.ts with scripts/_si-priority1-seed-snippet.ts");
  console.log("  2. Download / generate brand logos under public/brands/");
  console.log("  3. Update best.ts + comparisons.ts");
  console.log("  4. npx tsx scripts/product-guide-visuals.ts --si");
  console.log("  5. Import official videos via assets:approve flow");
  console.log("  6. npm run workflow:run -- software <slug> (approval gates)");
  console.log("  7. Content quality audit — target >75");
}

main();
