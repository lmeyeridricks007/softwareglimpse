#!/usr/bin/env node
/**
 * Generates full onboarding artifacts for migration-gap CRM products.
 * Usage: node scripts/onboard-migration-crm-batch.mjs [--wave a|b|c|all]
 * Idempotent — overwrites existing files.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const VERIFIED_AT = "2026-08-16T12:00:00.000Z";
const PUBLISHED_AT = "2026-08-16T00:00:00.000Z";

const CRITERIA = [
  "ease-of-use",
  "pipeline-management",
  "sales-automation",
  "email-capabilities",
  "reporting",
  "customization",
  "integrations",
  "administration-overhead",
  "scalability",
  "value-for-money",
];

const DEFAULT_FEATURES = [
  "contact-management",
  "lead-management",
  "pipeline-management",
  "deal-management",
  "custom-pipelines",
  "custom-fields",
  "email-sync",
  "email-tracking",
  "workflow-automation",
  "reporting",
  "mobile-app",
  "sales-automation",
  "integrations",
  "ai-assistance",
];

/** @typedef {{
 *  wave: 'a'|'b'|'c',
 *  slug: string,
 *  name: string,
 *  company: string,
 *  website: string,
 *  domain: string,
 *  pricingUrl?: string,
 *  shortDescription: string,
 *  vendorPositioning: string,
 *  pricingModel: string,
 *  hasFreePlan: boolean,
 *  hasFreeTrial: boolean,
 *  trialDays?: number,
 *  startingPriceMonthly?: number,
 *  pricingNotes: string,
 *  fixturePlans: string[],
 *  enrichmentPlans: object[],
 *  featureOverrides?: Record<string, string>,
 *  aiLines?: string[],
 *  limitations: string[],
 *  scores: Record<string, number>,
 *  scoreRationales?: Record<string, string>,
 *  bestFor: string[],
 *  notIdealFor: string[],
 *  pros: string[],
 *  cons: string[],
 *  keyFeatures: string[],
 *  pricingSummary: string,
 *  whoShouldChoose: string,
 *  whoShouldConsiderAlternatives: string,
 *  alternativeSlugs: string[],
 *  aliases?: string[],
 *  formerlyKnownAs?: string[],
 *  secondaryCategorySlugs?: string[],
 *  subcategorySlugs: string[],
 *  useCaseSlugs: string[],
 *  teamTypeSlugs: string[],
 *  businessSizeSlugs: string[],
 *  competitorSlugs: string[],
 *  comparableSlugs: string[],
 *  softShortDescription: string,
 * }} Product */

/** @type {Product[]} */
const PRODUCTS = [
  // ─── WAVE A ───────────────────────────────────────────────
  {
    wave: "a",
    slug: "nimble",
    name: "Nimble",
    company: "Nimble",
    website: "https://www.nimble.com",
    domain: "nimble.com",
    pricingUrl: "https://www.nimble.com/pricing/",
    shortDescription:
      "Social and relationship CRM with Gmail/Outlook sync, contact enrichment, and a single Business plan for teams.",
    vendorPositioning:
      "Relationship CRM that unifies contacts, social signals, and email for sales and marketing teams.",
    pricingModel: "subscription",
    hasFreePlan: false,
    hasFreeTrial: true,
    trialDays: 14,
    startingPriceMonthly: 24.9,
    pricingNotes:
      "Business $24.90/user/mo annual or $29.90 monthly. 14-day trial. No free forever plan (first-party Aug 2026).",
    fixturePlans: [
      "PLAN business: name=Business; amountPerSeat=24.9; currency=USD; interval=month; billingInterval=annual; unit=seat",
    ],
    enrichmentPlans: [
      planPerSeat("business", "Business", 24.9, 29.9, {
        hasFreeTrial: true,
        trialDays: 14,
        highlighted: true,
      }),
    ],
    featureOverrides: {
      "email-sync": "supported",
      "ai-assistance": "limited",
      "mobile-app": "supported",
    },
    limitations: [
      "Single public Business tier — limited plan ladder flexibility",
      "No free forever plan",
      "Relationship/social CRM focus may be lighter for complex enterprise pipelines",
    ],
    scores: {
      "ease-of-use": 8,
      "pipeline-management": 7,
      "sales-automation": 6,
      "email-capabilities": 8,
      "reporting": 6,
      customization: 6,
      integrations: 7,
      "administration-overhead": 8,
      scalability: 6,
      "value-for-money": 7,
    },
    bestFor: [
      "SMB teams wanting relationship/social CRM with Gmail or Outlook",
      "Solos and small sales teams needing contact enrichment",
      "Buyers who prefer a simple single-plan CRM",
    ],
    notIdealFor: [
      "Enterprise custom-process CRM buyers",
      "Teams needing deep marketing automation",
      "Buyers who require a free forever CRM tier",
    ],
    pros: [
      "Clear Business pricing with annual discount",
      "Gmail and Outlook email integration",
      "Social/relationship contact context",
      "14-day trial",
    ],
    cons: [
      "No free forever plan",
      "Single public tier limits packaging options",
      "Automation/reporting depth secondary to relationship CRM",
      "Not an enterprise platform CRM",
    ],
    keyFeatures: [
      "Contact and relationship management",
      "Gmail/Outlook sync",
      "Social signals on contacts",
      "Pipeline tracking",
      "Mobile access",
    ],
    pricingSummary:
      "Business $24.90/user/mo billed annually ($29.90 monthly). 14-day trial. No free forever plan.",
    whoShouldChoose:
      "Choose Nimble when you want a relationship CRM with Gmail/Outlook sync and simple Business pricing.",
    whoShouldConsiderAlternatives:
      "Compare HubSpot, Capsule, or Pipedrive if you need freemium, deeper automation, or multi-tier packaging.",
    alternativeSlugs: ["hubspot", "capsule", "pipedrive", "folk"],
    subcategorySlugs: ["small-business-crm", "sales-crm"],
    useCaseSlugs: ["contact-management", "pipeline-management", "lead-management"],
    teamTypeSlugs: ["sales", "founders", "marketing"],
    businessSizeSlugs: ["micro", "small-business"],
    competitorSlugs: ["hubspot", "capsule", "folk", "pipedrive"],
    comparableSlugs: ["capsule", "folk"],
    softShortDescription:
      "Social/relationship CRM with Gmail and Outlook sync; Business plan from $24.90/user/mo annual.",
  },
  {
    wave: "a",
    slug: "agile-crm",
    name: "Agile CRM",
    company: "Agile CRM",
    website: "https://www.agilecrm.com",
    domain: "agilecrm.com",
    pricingUrl: "https://www.agilecrm.com/pricing/",
    shortDescription:
      "All-in-one CRM with a free tier (10 users) and Starter/Regular/Enterprise plans for sales, marketing, and service.",
    vendorPositioning:
      "Affordable all-in-one CRM combining sales, marketing automation, and service for growing teams.",
    pricingModel: "freemium",
    hasFreePlan: true,
    hasFreeTrial: false,
    startingPriceMonthly: 8.99,
    pricingNotes:
      "Free (10 users). 2-year headline: Starter from $8.99, Regular $29.99, Enterprise $47.99 per user/mo. Annual rates higher ($9.99/$39.99/$64.99). First-party Aug 2026.",
    fixturePlans: [
      "PLAN free: name=Free; isFree=true; currency=USD; interval=month; billingInterval=month; unit=seat; minimumSeats=1",
      "PLAN starter: name=Starter; amountPerSeat=8.99; currency=USD; interval=month; billingInterval=annual; unit=seat",
      "PLAN regular: name=Regular; amountPerSeat=29.99; currency=USD; interval=month; billingInterval=annual; unit=seat",
      "PLAN enterprise: name=Enterprise; amountPerSeat=47.99; currency=USD; interval=month; billingInterval=annual; unit=seat",
    ],
    enrichmentPlans: [
      {
        id: "plan-free",
        slug: "free",
        name: "Free",
        isFree: true,
        contactSales: false,
        hasFreeTrial: false,
        highlighted: false,
        rules: [
          {
            kind: "flat",
            amount: 0,
            currency: "USD",
            interval: "month",
            amountPeriod: "month",
          },
        ],
        description: "Free forever for up to 10 users (vendor-documented).",
      },
      planPerSeat("starter", "Starter", 8.99, 9.99, {
        highlighted: true,
        notes: "2-year headline $8.99; annual published $9.99/user/mo.",
      }),
      planPerSeat("regular", "Regular", 29.99, 39.99, {
        notes: "2-year headline $29.99; annual published $39.99/user/mo.",
      }),
      planPerSeat("enterprise", "Enterprise", 47.99, 64.99, {
        notes: "2-year headline $47.99; annual published $64.99/user/mo.",
      }),
    ],
    featureOverrides: {
      "workflow-automation": "supported",
      "sales-automation": "supported",
      "ai-assistance": "limited",
    },
    limitations: [
      "Free plan capped at 10 users",
      "2-year vs annual headline rates require careful comparison",
      "All-in-one breadth can mean shallower depth vs specialist CRMs",
    ],
    scores: {
      "ease-of-use": 7,
      "pipeline-management": 7,
      "sales-automation": 7,
      "email-capabilities": 7,
      reporting: 6,
      customization: 6,
      integrations: 6,
      "administration-overhead": 6,
      scalability: 6,
      "value-for-money": 8,
    },
    bestFor: [
      "Budget-conscious SMBs wanting freemium CRM",
      "Teams combining sales + light marketing automation",
      "Buyers comparing low Starter entry pricing",
    ],
    notIdealFor: [
      "Enterprises needing deep customization and governance",
      "Buyers who dislike multi-year discount packaging complexity",
      "Teams needing best-in-class specialist CRM depth",
    ],
    pros: [
      "Free plan for up to 10 users",
      "Low Starter entry pricing",
      "Sales + marketing + service positioning",
      "Clear multi-tier ladder",
    ],
    cons: [
      "2-year vs annual rate confusion",
      "All-in-one depth tradeoffs",
      "Reporting/admin maturity below enterprise CRMs",
      "Integrations marketplace thinner than HubSpot/Salesforce",
    ],
    keyFeatures: [
      "Contact and deal CRM",
      "Marketing automation modules",
      "Sales pipelines",
      "Free tier (10 users)",
      "Email and workflow tools",
    ],
    pricingSummary:
      "Free (10 users). Starter from $8.99, Regular $29.99, Enterprise $47.99 per user/mo on 2-year headline; annual $9.99/$39.99/$64.99.",
    whoShouldChoose:
      "Choose Agile CRM when freemium entry and low Starter pricing matter more than enterprise CRM depth.",
    whoShouldConsiderAlternatives:
      "Compare HubSpot, Zoho CRM, or Freshsales for broader ecosystems or clearer packaging.",
    alternativeSlugs: ["hubspot", "zoho-crm", "freshsales", "bitrix24"],
    subcategorySlugs: ["small-business-crm", "sales-crm"],
    useCaseSlugs: ["pipeline-management", "lead-management", "sales-automation"],
    teamTypeSlugs: ["sales", "marketing", "founders"],
    businessSizeSlugs: ["micro", "small-business", "mid-market"],
    competitorSlugs: ["hubspot", "zoho-crm", "freshsales", "bitrix24"],
    comparableSlugs: ["zoho-crm", "bitrix24"],
    softShortDescription:
      "Freemium all-in-one CRM; Free (10 users), Starter from ~$8.99/user/mo on multi-year headline pricing.",
  },
  {
    wave: "a",
    slug: "affinity",
    name: "Affinity",
    company: "Affinity",
    website: "https://www.affinity.co",
    domain: "affinity.co",
    pricingUrl: "https://www.affinity.co/pricing",
    shortDescription:
      "Relationship intelligence CRM for private capital teams with Essential through Advanced annual seat pricing.",
    vendorPositioning:
      "CRM built for venture capital, private equity, and private capital relationship networks.",
    pricingModel: "subscription",
    hasFreePlan: false,
    hasFreeTrial: false,
    startingPriceMonthly: Math.round((2000 / 12) * 100) / 100,
    pricingNotes:
      "Essential $2000/user/year, Scale $2300, Advanced $2700, Enterprise custom. Private capital CRM (first-party Aug 2026).",
    fixturePlans: [
      "PLAN essential: name=Essential; amountPerSeat=2000; currency=USD; interval=year; billingInterval=annual; unit=seat",
      "PLAN scale: name=Scale; amountPerSeat=2300; currency=USD; interval=year; billingInterval=annual; unit=seat",
      "PLAN advanced: name=Advanced; amountPerSeat=2700; currency=USD; interval=year; billingInterval=annual; unit=seat",
      "PLAN enterprise: name=Enterprise; contactSales=true; currency=USD; interval=month; billingInterval=month",
    ],
    enrichmentPlans: [
      planAnnualSeat("essential", "Essential", 2000, { highlighted: true }),
      planAnnualSeat("scale", "Scale", 2300),
      planAnnualSeat("advanced", "Advanced", 2700),
      contactSalesPlan("enterprise", "Enterprise"),
    ],
    featureOverrides: {
      "pipeline-management": "supported",
      "deal-management": "supported",
      "email-sync": "supported",
      "ai-assistance": "supported",
      "mobile-app": "supported",
      "workflow-automation": "limited",
    },
    limitations: [
      "High annual seat cost aimed at private capital, not SMB",
      "Enterprise is custom quote",
      "Poor fit for generalist SMB sales CRM buyers",
    ],
    scores: {
      "ease-of-use": 7,
      "pipeline-management": 8,
      "sales-automation": 6,
      "email-capabilities": 7,
      reporting: 7,
      customization: 7,
      integrations: 7,
      "administration-overhead": 6,
      scalability: 7,
      "value-for-money": 5,
    },
    bestFor: [
      "Venture capital and private equity relationship teams",
      "Private capital firms tracking deal networks",
      "Teams prioritizing relationship intelligence over SMB CRM price",
    ],
    notIdealFor: [
      "SMB generalist CRM buyers",
      "Budget-sensitive startups needing freemium",
      "Marketing-automation-first buyers",
    ],
    pros: [
      "Purpose-built for private capital workflows",
      "Published Essential/Scale/Advanced annual seats",
      "Relationship intelligence positioning",
      "Enterprise path for larger firms",
    ],
    cons: [
      "High $2000+/user/year entry",
      "Not priced for typical SMB CRM",
      "Automation depth secondary to relationship graph",
      "Enterprise opacity",
    ],
    keyFeatures: [
      "Relationship intelligence",
      "Deal and pipeline tracking for private capital",
      "Email capture",
      "Network insights",
      "Enterprise customization path",
    ],
    pricingSummary:
      "Essential $2000, Scale $2300, Advanced $2700 per user/year. Enterprise custom quote.",
    whoShouldChoose:
      "Choose Affinity when private capital relationship CRM is the primary need and annual seat budgets allow.",
    whoShouldConsiderAlternatives:
      "Compare Salesforce, HubSpot, or Attio for broader CRM or lower-cost relationship CRM options.",
    alternativeSlugs: ["salesforce", "attio", "hubspot", "folk"],
    subcategorySlugs: ["sales-crm"],
    useCaseSlugs: ["pipeline-management", "contact-management", "deal-management"],
    teamTypeSlugs: ["sales"],
    businessSizeSlugs: ["mid-market", "enterprise"],
    competitorSlugs: ["salesforce", "attio", "hubspot", "folk"],
    comparableSlugs: ["attio", "salesforce"],
    softShortDescription:
      "Private capital relationship CRM; Essential from $2000/user/year through Advanced $2700, Enterprise custom.",
  },
  {
    wave: "a",
    slug: "apptivo",
    name: "Apptivo",
    company: "Apptivo",
    website: "https://www.apptivo.com",
    domain: "apptivo.com",
    pricingUrl: "https://www.apptivo.com/pricing/",
    shortDescription:
      "All-in-one business suite CRM with Lite, Premium, and Ultimate per-user plans plus Enterprise custom.",
    vendorPositioning:
      "Affordable all-in-one CRM and business apps suite for SMBs that want more than sales pipeline alone.",
    pricingModel: "subscription",
    hasFreePlan: false,
    hasFreeTrial: true,
    startingPriceMonthly: 15,
    pricingNotes:
      "Lite $15/$20, Premium $25/$30, Ultimate $40/$50 annual/monthly per user. Enterprise custom (first-party Aug 2026).",
    fixturePlans: [
      "PLAN lite: name=Lite; amountPerSeat=15; currency=USD; interval=month; billingInterval=annual; unit=seat",
      "PLAN premium: name=Premium; amountPerSeat=25; currency=USD; interval=month; billingInterval=annual; unit=seat",
      "PLAN ultimate: name=Ultimate; amountPerSeat=40; currency=USD; interval=month; billingInterval=annual; unit=seat",
      "PLAN enterprise: name=Enterprise; contactSales=true; currency=USD; interval=month; billingInterval=month",
    ],
    enrichmentPlans: [
      planPerSeat("lite", "Lite", 15, 20, { highlighted: true, hasFreeTrial: true }),
      planPerSeat("premium", "Premium", 25, 30, { hasFreeTrial: true }),
      planPerSeat("ultimate", "Ultimate", 40, 50, { hasFreeTrial: true }),
      contactSalesPlan("enterprise", "Enterprise"),
    ],
    featureOverrides: {
      "workflow-automation": "supported",
      "custom-fields": "supported",
      "mobile-app": "supported",
      "ai-assistance": "unknown",
    },
    limitations: [
      "Suite breadth can dilute specialist CRM polish",
      "Enterprise is custom quote",
      "Brand recognition lower than major CRM suites",
    ],
    scores: {
      "ease-of-use": 7,
      "pipeline-management": 7,
      "sales-automation": 6,
      "email-capabilities": 6,
      reporting: 6,
      customization: 7,
      integrations: 6,
      "administration-overhead": 6,
      scalability: 6,
      "value-for-money": 8,
    },
    bestFor: [
      "SMBs wanting CRM plus adjacent business apps",
      "Buyers comparing low per-user Lite/Premium pricing",
      "Teams needing customizable all-in-one suite",
    ],
    notIdealFor: [
      "Buyers wanting best-of-breed specialist sales CRM UX",
      "Enterprises standardized on Salesforce/Dynamics",
      "Marketing-automation-first buyers",
    ],
    pros: [
      "Competitive Lite/Premium/Ultimate pricing",
      "All-in-one suite positioning",
      "Annual discounts published",
      "Enterprise path available",
    ],
    cons: [
      "Less specialist sales CRM polish than Pipedrive-class tools",
      "Ecosystem smaller than HubSpot/Salesforce",
      "AI capabilities less documented",
      "Enterprise pricing opaque",
    ],
    keyFeatures: [
      "CRM contacts and pipelines",
      "Suite business apps",
      "Custom fields and workflows",
      "Mobile access",
      "Multi-tier seat pricing",
    ],
    pricingSummary:
      "Lite $15/$20, Premium $25/$30, Ultimate $40/$50 annual/monthly per user. Enterprise custom.",
    whoShouldChoose:
      "Choose Apptivo when an affordable all-in-one suite matters more than specialist CRM brand depth.",
    whoShouldConsiderAlternatives:
      "Compare Zoho CRM, Bitrix24, or HubSpot for broader ecosystems or freemium entry.",
    alternativeSlugs: ["zoho-crm", "bitrix24", "hubspot", "freshsales"],
    subcategorySlugs: ["small-business-crm", "sales-crm"],
    useCaseSlugs: ["pipeline-management", "contact-management", "sales-automation"],
    teamTypeSlugs: ["sales", "founders"],
    businessSizeSlugs: ["micro", "small-business", "mid-market"],
    competitorSlugs: ["zoho-crm", "bitrix24", "hubspot", "freshsales"],
    comparableSlugs: ["zoho-crm", "bitrix24"],
    softShortDescription:
      "All-in-one suite CRM; Lite from $15/user/mo annual through Ultimate $40, Enterprise custom.",
  },
  {
    wave: "a",
    slug: "cloze",
    name: "Cloze",
    company: "Cloze",
    website: "https://www.cloze.com",
    domain: "cloze.com",
    pricingUrl: "https://www.cloze.com/pricing",
    shortDescription:
      "Relationship CRM popular with real-estate and advisors, with Pro through Platinum annual per-user plans and a 14-day trial.",
    vendorPositioning:
      "Automatic relationship management CRM that keeps people, deals, and follow-ups organized — strong for real estate professionals.",
    pricingModel: "subscription",
    hasFreePlan: false,
    hasFreeTrial: true,
    trialDays: 14,
    startingPriceMonthly: 17,
    pricingNotes:
      "Pro $17, Silver $21, Gold $29, Platinum $42 annual per user/mo. 14-day trial. Relationship/real-estate CRM (first-party Aug 2026).",
    fixturePlans: [
      "PLAN pro: name=Pro; amountPerSeat=17; currency=USD; interval=month; billingInterval=annual; unit=seat",
      "PLAN silver: name=Silver; amountPerSeat=21; currency=USD; interval=month; billingInterval=annual; unit=seat",
      "PLAN gold: name=Gold; amountPerSeat=29; currency=USD; interval=month; billingInterval=annual; unit=seat",
      "PLAN platinum: name=Platinum; amountPerSeat=42; currency=USD; interval=month; billingInterval=annual; unit=seat",
    ],
    enrichmentPlans: [
      planAnnualOnly("pro", "Pro", 17, { highlighted: true, hasFreeTrial: true, trialDays: 14 }),
      planAnnualOnly("silver", "Silver", 21, { hasFreeTrial: true, trialDays: 14 }),
      planAnnualOnly("gold", "Gold", 29, { hasFreeTrial: true, trialDays: 14 }),
      planAnnualOnly("platinum", "Platinum", 42, { hasFreeTrial: true, trialDays: 14 }),
    ],
    featureOverrides: {
      "email-sync": "supported",
      "mobile-app": "supported",
      "ai-assistance": "limited",
      "workflow-automation": "limited",
    },
    limitations: [
      "Strongest fit for relationship/real-estate workflows vs general B2B SaaS sales",
      "No free forever plan",
      "Automation/reporting less than full marketing suites",
    ],
    scores: {
      "ease-of-use": 8,
      "pipeline-management": 7,
      "sales-automation": 6,
      "email-capabilities": 8,
      reporting: 6,
      customization: 6,
      integrations: 6,
      "administration-overhead": 8,
      scalability: 6,
      "value-for-money": 7,
    },
    bestFor: [
      "Real-estate professionals needing relationship CRM",
      "Advisors managing follow-ups and people timelines",
      "Solo/small teams wanting automatic relationship capture",
    ],
    notIdealFor: [
      "Enterprise B2B SaaS pipeline orgs",
      "Marketing automation buyers",
      "Teams needing free forever CRM",
    ],
    pros: [
      "Clear Pro–Platinum annual ladder",
      "14-day trial",
      "Strong relationship/real-estate positioning",
      "Email-centric contact timelines",
    ],
    cons: [
      "Not a general enterprise sales platform",
      "No free forever tier",
      "Automation depth limited vs marketing CRMs",
      "Industry focus may not fit all B2B teams",
    ],
    keyFeatures: [
      "Automatic relationship management",
      "Email and people timelines",
      "Pipeline tracking",
      "Mobile apps",
      "Tiered Pro–Platinum plans",
    ],
    pricingSummary:
      "Pro $17, Silver $21, Gold $29, Platinum $42 per user/mo billed annually. 14-day trial.",
    whoShouldChoose:
      "Choose Cloze when relationship/real-estate CRM with automatic people timelines is the priority.",
    whoShouldConsiderAlternatives:
      "Compare HubSpot, Follow Up Boss alternatives via Pipedrive/Capsule, or Wealthbox for advisor-specific needs.",
    alternativeSlugs: ["hubspot", "capsule", "wealthbox", "nimble"],
    subcategorySlugs: ["small-business-crm", "sales-crm"],
    useCaseSlugs: ["contact-management", "pipeline-management", "lead-management"],
    teamTypeSlugs: ["sales", "founders"],
    businessSizeSlugs: ["micro", "small-business"],
    competitorSlugs: ["hubspot", "capsule", "nimble", "wealthbox"],
    comparableSlugs: ["nimble", "capsule"],
    softShortDescription:
      "Relationship/real-estate CRM; Pro $17 through Platinum $42/user/mo annual with 14-day trial.",
  },
  {
    wave: "a",
    slug: "wealthbox",
    name: "Wealthbox",
    company: "Wealthbox",
    website: "https://www.wealthbox.com",
    domain: "wealthbox.com",
    pricingUrl: "https://www.wealthbox.com/pricing/",
    shortDescription:
      "Advisor-focused CRM with Basic, Pro, and Premier per-user plans plus Enterprise custom pricing.",
    vendorPositioning:
      "CRM built for financial advisors to manage clients, tasks, and compliance-friendly workflows.",
    pricingModel: "subscription",
    hasFreePlan: false,
    hasFreeTrial: true,
    startingPriceMonthly: 59,
    pricingNotes:
      "Basic $59, Pro $75, Premier $99 per user/mo. Enterprise custom. Advisor CRM (first-party Aug 2026).",
    fixturePlans: [
      "PLAN basic: name=Basic; amountPerSeat=59; currency=USD; interval=month; billingInterval=month; unit=seat",
      "PLAN pro: name=Pro; amountPerSeat=75; currency=USD; interval=month; billingInterval=month; unit=seat",
      "PLAN premier: name=Premier; amountPerSeat=99; currency=USD; interval=month; billingInterval=month; unit=seat",
      "PLAN enterprise: name=Enterprise; contactSales=true; currency=USD; interval=month; billingInterval=month",
    ],
    enrichmentPlans: [
      planMonthlyOnly("basic", "Basic", 59, { highlighted: true, hasFreeTrial: true }),
      planMonthlyOnly("pro", "Pro", 75, { hasFreeTrial: true }),
      planMonthlyOnly("premier", "Premier", 99, { hasFreeTrial: true }),
      contactSalesPlan("enterprise", "Enterprise"),
    ],
    featureOverrides: {
      "contact-management": "supported",
      "workflow-automation": "supported",
      "email-sync": "supported",
      "mobile-app": "supported",
      "ai-assistance": "limited",
      "deal-management": "limited",
    },
    limitations: [
      "Priced and positioned for advisors — poor general SMB sales CRM fit",
      "Enterprise custom quote",
      "Higher seat cost than mass-market SMB CRMs",
    ],
    scores: {
      "ease-of-use": 7,
      "pipeline-management": 6,
      "sales-automation": 6,
      "email-capabilities": 7,
      reporting: 6,
      customization: 6,
      integrations: 7,
      "administration-overhead": 7,
      scalability: 6,
      "value-for-money": 6,
    },
    bestFor: [
      "Financial advisors and RIAs",
      "Wealth management client relationship teams",
      "Firms needing advisor-oriented CRM workflows",
    ],
    notIdealFor: [
      "General B2B SaaS sales teams",
      "Budget SMB freemium buyers",
      "Marketing automation platforms",
    ],
    pros: [
      "Advisor-specific CRM positioning",
      "Clear Basic/Pro/Premier ladder",
      "Email and workflow tools for client work",
      "Enterprise option for larger firms",
    ],
    cons: [
      "Higher seat pricing than general SMB CRMs",
      "Not designed as a general sales pipeline platform",
      "Enterprise opacity",
      "Niche industry focus",
    ],
    keyFeatures: [
      "Advisor client CRM",
      "Tasks and workflows",
      "Email sync",
      "Mobile access",
      "Tiered Basic–Premier plans",
    ],
    pricingSummary:
      "Basic $59, Pro $75, Premier $99 per user/mo. Enterprise custom quote.",
    whoShouldChoose:
      "Choose Wealthbox when advisor CRM workflows matter more than generalist sales CRM price.",
    whoShouldConsiderAlternatives:
      "Compare Salesforce Financial Services Cloud alternatives via Salesforce/HubSpot, or Cloze for relationship CRM.",
    alternativeSlugs: ["salesforce", "hubspot", "cloze", "nutshell"],
    subcategorySlugs: ["sales-crm", "small-business-crm"],
    useCaseSlugs: ["contact-management", "pipeline-management"],
    teamTypeSlugs: ["sales"],
    businessSizeSlugs: ["small-business", "mid-market"],
    competitorSlugs: ["salesforce", "hubspot", "cloze"],
    comparableSlugs: ["salesforce", "hubspot"],
    softShortDescription:
      "Advisor CRM; Basic $59, Pro $75, Premier $99 per user/mo, Enterprise custom.",
  },
  {
    wave: "a",
    slug: "podio",
    name: "Podio",
    company: "Citrix",
    website: "https://www.podio.com",
    domain: "podio.com",
    pricingUrl: "https://www.podio.com/pricing",
    shortDescription:
      "Flexible work platform often used as a customizable CRM, with Free (5 users), Plus, and Premium plans.",
    vendorPositioning:
      "Customizable work platform where teams build CRM-like apps, projects, and workflows without rigid CRM lock-in.",
    pricingModel: "freemium",
    hasFreePlan: true,
    hasFreeTrial: false,
    startingPriceMonthly: 11.2,
    pricingNotes:
      "Free (5 users). Plus $11.20/$14, Premium $19.20/$24 annual/monthly. Work platform used as CRM (first-party / Citrix Podio Aug 2026).",
    fixturePlans: [
      "PLAN free: name=Free; isFree=true; currency=USD; interval=month; billingInterval=month",
      "PLAN plus: name=Plus; amountPerSeat=11.2; currency=USD; interval=month; billingInterval=annual; unit=seat",
      "PLAN premium: name=Premium; amountPerSeat=19.2; currency=USD; interval=month; billingInterval=annual; unit=seat",
    ],
    enrichmentPlans: [
      {
        id: "plan-free",
        slug: "free",
        name: "Free",
        isFree: true,
        contactSales: false,
        hasFreeTrial: false,
        highlighted: false,
        rules: [
          {
            kind: "flat",
            amount: 0,
            currency: "USD",
            interval: "month",
            amountPeriod: "month",
          },
        ],
        description: "Free for up to 5 users.",
      },
      planPerSeat("plus", "Plus", 11.2, 14, { highlighted: true }),
      planPerSeat("premium", "Premium", 19.2, 24),
    ],
    featureOverrides: {
      "custom-fields": "supported",
      "custom-pipelines": "supported",
      "workflow-automation": "supported",
      "pipeline-management": "limited",
      "deal-management": "limited",
      "email-tracking": "limited",
      "ai-assistance": "unknown",
      "mobile-app": "supported",
    },
    limitations: [
      "Work platform — CRM is DIY/custom vs dedicated sales CRM",
      "Free capped at 5 users",
      "Sales reporting/email CRM depth depends on how you build apps",
    ],
    scores: {
      "ease-of-use": 6,
      "pipeline-management": 6,
      "sales-automation": 6,
      "email-capabilities": 5,
      reporting: 5,
      customization: 9,
      integrations: 6,
      "administration-overhead": 5,
      scalability: 6,
      "value-for-money": 7,
    },
    bestFor: [
      "Teams wanting highly customizable CRM-like apps",
      "Small teams starting on Free (5 users)",
      "Buyers who prefer flexible work platform over rigid CRM",
    ],
    notIdealFor: [
      "Teams wanting out-of-the-box sales CRM best practices",
      "Buyers needing polished email sequencing CRM",
      "Enterprises needing dedicated SFA governance",
    ],
    pros: [
      "Free tier for 5 users",
      "Extreme customization of apps/workflows",
      "Affordable Plus/Premium seats",
      "Flexible work + CRM hybrid use",
    ],
    cons: [
      "Not a dedicated sales CRM out of the box",
      "Admin effort to build CRM processes",
      "Email/reporting CRM depth DIY",
      "Product longevity/ownership under Citrix/Progress umbrella needs buyer diligence",
    ],
    keyFeatures: [
      "Custom apps and workspaces",
      "Workflow automation",
      "Task and project collaboration",
      "Configurable as CRM",
      "Free and paid seat tiers",
    ],
    pricingSummary:
      "Free (5 users). Plus $11.20/$14, Premium $19.20/$24 annual/monthly per user.",
    whoShouldChoose:
      "Choose Podio when you want a flexible work platform you can shape into CRM processes.",
    whoShouldConsiderAlternatives:
      "Compare Monday Sales CRM, HubSpot, or Pipedrive for more sales-native CRM experiences.",
    alternativeSlugs: ["monday-sales-crm", "hubspot", "pipedrive", "bitrix24"],
    aliases: ["Citrix Podio"],
    subcategorySlugs: ["small-business-crm", "sales-crm"],
    useCaseSlugs: ["contact-management", "pipeline-management", "sales-automation"],
    teamTypeSlugs: ["sales", "founders"],
    businessSizeSlugs: ["micro", "small-business", "mid-market"],
    competitorSlugs: ["monday-sales-crm", "hubspot", "pipedrive", "bitrix24"],
    comparableSlugs: ["monday-sales-crm", "bitrix24"],
    softShortDescription:
      "Customizable work platform used as CRM; Free (5 users), Plus from $11.20/user/mo annual.",
  },
  {
    wave: "a",
    slug: "pipelinepro",
    name: "Pipeline CRM",
    company: "Pipeline CRM",
    website: "https://www.pipelinecrm.com",
    domain: "pipelinecrm.com",
    pricingUrl: "https://www.pipelinecrm.com/pricing/",
    shortDescription:
      "Sales-focused Pipeline CRM with Start, Develop, and Grow per-user plans (formerly PipelineDeals / Pipeline Pro).",
    vendorPositioning:
      "Straightforward sales CRM centered on pipeline visibility, deal tracking, and sales team execution.",
    pricingModel: "subscription",
    hasFreePlan: false,
    hasFreeTrial: true,
    startingPriceMonthly: 25,
    pricingNotes:
      "Start $25/$29, Develop $33/$39, Grow $49/$59 annual/monthly. Pipeline CRM (aliases Pipeline Pro, PipelineDeals). First-party Aug 2026.",
    fixturePlans: [
      "PLAN start: name=Start; amountPerSeat=25; currency=USD; interval=month; billingInterval=annual; unit=seat",
      "PLAN develop: name=Develop; amountPerSeat=33; currency=USD; interval=month; billingInterval=annual; unit=seat",
      "PLAN grow: name=Grow; amountPerSeat=49; currency=USD; interval=month; billingInterval=annual; unit=seat",
    ],
    enrichmentPlans: [
      planPerSeat("start", "Start", 25, 29, { highlighted: true, hasFreeTrial: true }),
      planPerSeat("develop", "Develop", 33, 39, { hasFreeTrial: true }),
      planPerSeat("grow", "Grow", 49, 59, { hasFreeTrial: true }),
    ],
    featureOverrides: {
      "pipeline-management": "supported",
      "deal-management": "supported",
      "sales-automation": "supported",
      "reporting": "supported",
      "email-sync": "supported",
      "ai-assistance": "limited",
    },
    limitations: [
      "Smaller ecosystem than HubSpot/Salesforce",
      "No free forever plan",
      "Brand history (PipelineDeals/Pipeline Pro) may confuse buyers",
    ],
    scores: {
      "ease-of-use": 8,
      "pipeline-management": 8,
      "sales-automation": 7,
      "email-capabilities": 7,
      reporting: 7,
      customization: 6,
      integrations: 6,
      "administration-overhead": 8,
      scalability: 6,
      "value-for-money": 7,
    },
    bestFor: [
      "SMB sales teams wanting pipeline-first CRM",
      "Buyers comparing Start/Develop/Grow seat ladders",
      "Teams migrating from PipelineDeals/Pipeline Pro branding",
    ],
    notIdealFor: [
      "Enterprise platform CRM buyers",
      "Marketing automation suites",
      "Freemium-first buyers",
    ],
    pros: [
      "Clear sales pipeline focus",
      "Published Start/Develop/Grow pricing",
      "Annual discounts",
      "Straightforward SMB CRM UX positioning",
    ],
    cons: [
      "Smaller integration marketplace",
      "No free forever tier",
      "Less brand gravity than Pipedrive/HubSpot",
      "AI features limited vs modern AI CRMs",
    ],
    keyFeatures: [
      "Visual sales pipelines",
      "Deal management",
      "Sales activity tracking",
      "Email sync",
      "Reporting on higher tiers",
    ],
    pricingSummary:
      "Start $25/$29, Develop $33/$39, Grow $49/$59 annual/monthly per user.",
    whoShouldChoose:
      "Choose Pipeline CRM when you want a sales pipeline CRM with clear Start–Grow packaging.",
    whoShouldConsiderAlternatives:
      "Compare Pipedrive, Freshsales, or HubSpot for larger ecosystems or freemium entry.",
    alternativeSlugs: ["pipedrive", "freshsales", "hubspot", "close"],
    aliases: ["Pipeline Pro", "PipelineDeals", "PipelineCRM"],
    formerlyKnownAs: ["PipelineDeals", "Pipeline Pro"],
    subcategorySlugs: ["sales-crm", "small-business-crm"],
    useCaseSlugs: ["pipeline-management", "deal-management", "sales-automation"],
    teamTypeSlugs: ["sales", "founders"],
    businessSizeSlugs: ["micro", "small-business", "mid-market"],
    competitorSlugs: ["pipedrive", "freshsales", "close", "hubspot"],
    comparableSlugs: ["pipedrive", "close"],
    softShortDescription:
      "Sales pipeline CRM (Pipeline Pro/PipelineDeals); Start from $25/user/mo annual through Grow $49.",
  },

  // ─── WAVE B ───────────────────────────────────────────────
  {
    wave: "b",
    slug: "zendesk",
    name: "Zendesk Sell",
    company: "Zendesk",
    website: "https://www.zendesk.com",
    domain: "zendesk.com",
    pricingUrl: "https://www.zendesk.com/sell/pricing/",
    shortDescription:
      "Zendesk Sell sales CRM with Team through Enterprise annual per-agent plans for pipeline and sales engagement.",
    vendorPositioning:
      "Sales CRM from Zendesk for teams that want pipeline management alongside the broader Zendesk customer experience stack.",
    pricingModel: "subscription",
    hasFreePlan: false,
    hasFreeTrial: true,
    startingPriceMonthly: 19,
    pricingNotes:
      "Zendesk Sell: Team $19, Growth $55, Professional $115, Enterprise $169 annual per agent (first-party Aug 2026).",
    fixturePlans: [
      "PLAN team: name=Team; amountPerSeat=19; currency=USD; interval=month; billingInterval=annual; unit=seat",
      "PLAN growth: name=Growth; amountPerSeat=55; currency=USD; interval=month; billingInterval=annual; unit=seat",
      "PLAN professional: name=Professional; amountPerSeat=115; currency=USD; interval=month; billingInterval=annual; unit=seat",
      "PLAN enterprise: name=Enterprise; amountPerSeat=169; currency=USD; interval=month; billingInterval=annual; unit=seat",
    ],
    enrichmentPlans: [
      planAnnualOnly("team", "Team", 19, { highlighted: true, hasFreeTrial: true }),
      planAnnualOnly("growth", "Growth", 55, { hasFreeTrial: true }),
      planAnnualOnly("professional", "Professional", 115, { hasFreeTrial: true }),
      planAnnualOnly("enterprise", "Enterprise", 169, { hasFreeTrial: true }),
    ],
    featureOverrides: {
      "pipeline-management": "supported",
      "email-sync": "supported",
      "sales-automation": "supported",
      "reporting": "supported",
      "mobile-app": "supported",
      "ai-assistance": "limited",
    },
    limitations: [
      "Sell is one product in a larger Zendesk stack — packaging can confuse",
      "Higher tiers escalate quickly vs SMB CRMs",
      "Best value often when already in Zendesk ecosystem",
    ],
    scores: {
      "ease-of-use": 7,
      "pipeline-management": 7,
      "sales-automation": 7,
      "email-capabilities": 7,
      reporting: 7,
      customization: 6,
      integrations: 8,
      "administration-overhead": 6,
      scalability: 7,
      "value-for-money": 6,
    },
    bestFor: [
      "Teams already using Zendesk Support/CX",
      "SMB–mid-market sales needing published Sell tiers",
      "Buyers wanting sales CRM tied to Zendesk ecosystem",
    ],
    notIdealFor: [
      "Buyers seeking cheapest standalone SMB CRM",
      "Oracle/Salesforce-stack enterprises",
      "Marketing automation platforms",
    ],
    pros: [
      "Published Team–Enterprise Sell pricing",
      "Zendesk ecosystem integrations",
      "Sales pipeline + engagement tooling",
      "Brand trust of Zendesk",
    ],
    cons: [
      "Price jumps across tiers",
      "Sell vs Support packaging complexity",
      "Value-for-money weaker without Zendesk stack",
      "AI depth varies by Zendesk SKU era",
    ],
    keyFeatures: [
      "Sales pipeline management",
      "Email and calling workflows",
      "Reporting",
      "Zendesk ecosystem links",
      "Mobile access",
    ],
    pricingSummary:
      "Zendesk Sell annual: Team $19, Growth $55, Professional $115, Enterprise $169 per agent/mo.",
    whoShouldChoose:
      "Choose Zendesk Sell when Zendesk CX alignment and published Sell tiers matter.",
    whoShouldConsiderAlternatives:
      "Compare HubSpot, Pipedrive, or Freshsales for standalone sales CRM value.",
    alternativeSlugs: ["hubspot", "pipedrive", "freshsales", "salesforce"],
    aliases: ["Zendesk Sell", "Sell by Zendesk"],
    subcategorySlugs: ["sales-crm"],
    useCaseSlugs: ["pipeline-management", "lead-management", "sales-automation"],
    teamTypeSlugs: ["sales"],
    businessSizeSlugs: ["small-business", "mid-market", "enterprise"],
    competitorSlugs: ["hubspot", "pipedrive", "salesforce", "freshsales"],
    comparableSlugs: ["hubspot", "pipedrive"],
    softShortDescription:
      "Zendesk Sell CRM; Team $19 through Enterprise $169/agent/mo annual.",
  },
  {
    wave: "b",
    slug: "netsuite",
    name: "Oracle NetSuite CRM",
    company: "Oracle",
    website: "https://www.netsuite.com",
    domain: "netsuite.com",
    pricingUrl: "https://www.netsuite.com/portal/products/crm.shtml",
    shortDescription:
      "Oracle NetSuite CRM module within the NetSuite ERP suite — custom enterprise quoting only.",
    vendorPositioning:
      "CRM embedded in NetSuite’s cloud ERP for mid-market and enterprise finance-operations aligned sales teams.",
    pricingModel: "custom-quote",
    hasFreePlan: false,
    hasFreeTrial: false,
    pricingNotes:
      "Custom quote only — contact sales. NetSuite CRM (first-party Aug 2026).",
    fixturePlans: [
      "PLAN enterprise: name=Enterprise; contactSales=true; currency=USD; interval=month; billingInterval=month",
    ],
    enrichmentPlans: [contactSalesPlan("enterprise", "Enterprise")],
    featureOverrides: {
      "pipeline-management": "supported",
      "workflow-automation": "supported",
      "reporting": "supported",
      "custom-fields": "supported",
      "integrations": "supported",
      "ai-assistance": "limited",
      "mobile-app": "supported",
      "email-tracking": "limited",
    },
    limitations: [
      "No public list pricing — custom quote only",
      "Tied to NetSuite ERP buying motion",
      "High implementation overhead",
    ],
    scores: {
      "ease-of-use": 5,
      "pipeline-management": 7,
      "sales-automation": 7,
      "email-capabilities": 6,
      reporting: 8,
      customization: 7,
      integrations: 8,
      "administration-overhead": 4,
      scalability: 8,
      "value-for-money": 5,
    },
    bestFor: [
      "NetSuite ERP customers needing native CRM",
      "Mid-market/enterprise finance-ops aligned sales",
      "Buyers with NetSuite implementation partners",
    ],
    notIdealFor: [
      "SMB self-serve CRM buyers",
      "Teams wanting transparent published pricing",
      "Standalone lightweight pipeline CRM",
    ],
    pros: [
      "Native NetSuite ERP alignment",
      "Enterprise reporting/scalability ceiling",
      "Unified finance + CRM data model",
      "Oracle ecosystem backing",
    ],
    cons: [
      "Opaque custom quote pricing",
      "High admin/implementation cost",
      "Poor SMB fit",
      "CRM secondary to ERP buying decision for many",
    ],
    keyFeatures: [
      "NetSuite-native CRM",
      "Pipeline and opportunity management",
      "ERP-integrated reporting",
      "Workflow automation",
      "Enterprise customization",
    ],
    pricingSummary: "Custom quote only — contact Oracle NetSuite sales.",
    whoShouldChoose:
      "Choose NetSuite CRM when you already run or plan NetSuite ERP and need native CRM.",
    whoShouldConsiderAlternatives:
      "Compare Salesforce, Dynamics 365, or HubSpot if you need standalone CRM without NetSuite ERP.",
    alternativeSlugs: ["salesforce", "dynamics-365", "hubspot", "oracle-cx"],
    aliases: ["NetSuite CRM", "Oracle NetSuite"],
    subcategorySlugs: ["sales-crm"],
    useCaseSlugs: ["pipeline-management", "lead-management", "sales-automation"],
    teamTypeSlugs: ["sales"],
    businessSizeSlugs: ["mid-market", "enterprise"],
    competitorSlugs: ["salesforce", "dynamics-365", "oracle-cx", "hubspot"],
    comparableSlugs: ["oracle-cx", "salesforce"],
    softShortDescription:
      "Oracle NetSuite CRM module; custom enterprise quote only.",
  },
  {
    wave: "b",
    slug: "pega",
    name: "Pega CRM",
    company: "Pegasystems",
    website: "https://www.pega.com",
    domain: "pega.com",
    pricingUrl: "https://www.pega.com/products/crm",
    shortDescription:
      "Pega CRM for enterprise customer engagement and case-driven CRM — custom quote only.",
    vendorPositioning:
      "Enterprise CRM and decisioning platform for complex customer engagement, case management, and AI-driven workflows.",
    pricingModel: "custom-quote",
    hasFreePlan: false,
    hasFreeTrial: false,
    pricingNotes: "Custom enterprise quote only (first-party Aug 2026).",
    fixturePlans: [
      "PLAN enterprise: name=Enterprise; contactSales=true; currency=USD; interval=month; billingInterval=month",
    ],
    enrichmentPlans: [contactSalesPlan("enterprise", "Enterprise")],
    featureOverrides: {
      "workflow-automation": "supported",
      "sales-automation": "supported",
      "custom-fields": "supported",
      "reporting": "supported",
      "ai-assistance": "supported",
      "pipeline-management": "supported",
      "email-tracking": "limited",
      "mobile-app": "supported",
    },
    limitations: [
      "Enterprise custom quote — no SMB list pricing",
      "High implementation and admin overhead",
      "Overkill for simple pipeline CRM needs",
    ],
    scores: {
      "ease-of-use": 5,
      "pipeline-management": 7,
      "sales-automation": 8,
      "email-capabilities": 6,
      reporting: 8,
      customization: 8,
      integrations: 7,
      "administration-overhead": 4,
      scalability: 9,
      "value-for-money": 5,
    },
    bestFor: [
      "Large enterprises with complex case/CRM processes",
      "Organizations investing in Pega decisioning platforms",
      "Buyers with enterprise implementation partners",
    ],
    notIdealFor: [
      "SMB self-serve CRM",
      "Transparent published-pricing buyers",
      "Lightweight pipeline-only teams",
    ],
    pros: [
      "Enterprise case + CRM depth",
      "Strong automation/decisioning story",
      "Scalability for large orgs",
      "AI-assisted enterprise workflows",
    ],
    cons: [
      "Opaque pricing",
      "Heavy admin/implementation",
      "Steep learning curve",
      "Poor SMB economics",
    ],
    keyFeatures: [
      "Enterprise CRM and case management",
      "Decisioning and automation",
      "AI-assisted workflows",
      "Reporting and analytics",
      "Deep customization",
    ],
    pricingSummary: "Custom enterprise quote — contact Pegasystems sales.",
    whoShouldChoose:
      "Choose Pega CRM for complex enterprise engagement/case CRM, not SMB pipeline tools.",
    whoShouldConsiderAlternatives:
      "Compare Salesforce, Dynamics 365, or ServiceNow-adjacent stacks depending on case vs sales focus.",
    alternativeSlugs: ["salesforce", "dynamics-365", "oracle-cx", "hubspot"],
    aliases: ["Pegasystems CRM", "Pega Customer Engagement"],
    subcategorySlugs: ["sales-crm"],
    useCaseSlugs: ["sales-automation", "pipeline-management", "contact-management"],
    teamTypeSlugs: ["sales"],
    businessSizeSlugs: ["enterprise"],
    competitorSlugs: ["salesforce", "dynamics-365", "oracle-cx"],
    comparableSlugs: ["salesforce", "dynamics-365"],
    softShortDescription: "Pega enterprise CRM; custom quote only.",
  },
  {
    wave: "b",
    slug: "act",
    name: "ACT!",
    company: "Swiftpage",
    website: "https://www.act.com",
    domain: "act.com",
    pricingUrl: "https://www.act.com/pricing",
    shortDescription:
      "ACT! by Swiftpage — long-standing SMB CRM for contacts, calendars, and sales follow-up; pricing primarily contact-sales.",
    vendorPositioning:
      "Classic SMB CRM for managing contacts, activities, and sales follow-ups — especially familiar to established small businesses.",
    pricingModel: "custom-quote",
    hasFreePlan: false,
    hasFreeTrial: true,
    pricingNotes:
      "Typical SMB CRM; public packaging often contact-sales. Research treat as contactSales enterprise-style starter uncertainty (Aug 2026). Do not invent precise list prices.",
    fixturePlans: [
      "PLAN enterprise: name=Enterprise; contactSales=true; currency=USD; interval=month; billingInterval=month",
    ],
    enrichmentPlans: [
      contactSalesPlan("enterprise", "ACT! (contact sales)", {
        notes:
          "Confirm live ACT! packaging/starter with Swiftpage — precise public list amounts not asserted in this research pack.",
      }),
    ],
    featureOverrides: {
      "contact-management": "supported",
      "pipeline-management": "supported",
      "email-sync": "supported",
      "reporting": "limited",
      "workflow-automation": "limited",
      "ai-assistance": "unknown",
      "mobile-app": "supported",
      "custom-pipelines": "limited",
    },
    limitations: [
      "Precise public list pricing not asserted — contact sales",
      "Legacy SMB brand vs modern cloud CRM UX expectations",
      "Smaller modern ecosystem than HubSpot/Pipedrive",
    ],
    scores: {
      "ease-of-use": 6,
      "pipeline-management": 6,
      "sales-automation": 5,
      "email-capabilities": 6,
      reporting: 5,
      customization: 6,
      integrations: 5,
      "administration-overhead": 6,
      scalability: 5,
      "value-for-money": 6,
    },
    bestFor: [
      "Established SMBs already familiar with ACT!",
      "Contact- and activity-centric small sales teams",
      "Buyers evaluating classic SMB CRM continuity",
    ],
    notIdealFor: [
      "Modern AI/marketing automation buyers",
      "Enterprise platform CRM",
      "Teams needing transparent SaaS ladders without sales calls",
    ],
    pros: [
      "Long SMB CRM brand history",
      "Contact/activity CRM fundamentals",
      "Familiar to many established small businesses",
      "Trial paths often available via vendor",
    ],
    cons: [
      "Pricing transparency weaker than modern SaaS CRMs",
      "Ecosystem and UX less modern than category leaders",
      "Automation/AI story thinner",
      "Scalability ceiling for complex orgs",
    ],
    keyFeatures: [
      "Contact management",
      "Activity and calendar CRM",
      "Sales follow-up tracking",
      "Email tools",
      "SMB-oriented CRM workflows",
    ],
    pricingSummary:
      "Contact Swiftpage/ACT! sales for current packaging — precise list prices not asserted in this pack.",
    whoShouldChoose:
      "Choose ACT! when continuity with classic SMB ACT! workflows matters more than modern SaaS CRM ecosystems.",
    whoShouldConsiderAlternatives:
      "Compare HubSpot, Pipedrive, Capsule, or Freshsales for clearer cloud packaging.",
    alternativeSlugs: ["hubspot", "pipedrive", "capsule", "freshsales"],
    aliases: ["ACT! by Swiftpage", "Act CRM", "Swiftpage ACT!"],
    subcategorySlugs: ["small-business-crm", "sales-crm"],
    useCaseSlugs: ["contact-management", "pipeline-management", "lead-management"],
    teamTypeSlugs: ["sales", "founders"],
    businessSizeSlugs: ["micro", "small-business"],
    competitorSlugs: ["hubspot", "pipedrive", "capsule", "freshsales"],
    comparableSlugs: ["capsule", "pipedrive"],
    softShortDescription:
      "ACT! by Swiftpage SMB CRM; contact sales for current packaging (no invented list prices).",
  },
  {
    wave: "b",
    slug: "sap",
    name: "SAP Customer Experience",
    company: "SAP",
    website: "https://www.sap.com",
    domain: "sap.com",
    pricingUrl: "https://www.sap.com/products/crm.html",
    shortDescription:
      "SAP Customer Experience / Sales Cloud — enterprise CRM with custom quote pricing only.",
    vendorPositioning:
      "Enterprise customer experience and sales cloud for SAP-centric organizations needing CRM aligned with SAP ERP.",
    pricingModel: "custom-quote",
    hasFreePlan: false,
    hasFreeTrial: false,
    pricingNotes: "Custom enterprise quote — SAP CX / Sales Cloud (first-party Aug 2026).",
    fixturePlans: [
      "PLAN enterprise: name=Enterprise; contactSales=true; currency=USD; interval=month; billingInterval=month",
    ],
    enrichmentPlans: [contactSalesPlan("enterprise", "Enterprise")],
    featureOverrides: {
      "pipeline-management": "supported",
      "sales-automation": "supported",
      "reporting": "supported",
      "integrations": "supported",
      "custom-fields": "supported",
      "ai-assistance": "supported",
      "email-tracking": "limited",
      "mobile-app": "supported",
    },
    limitations: [
      "Custom quote only",
      "High implementation overhead",
      "Best fit inside SAP landscapes",
    ],
    scores: {
      "ease-of-use": 5,
      "pipeline-management": 8,
      "sales-automation": 8,
      "email-capabilities": 6,
      reporting: 8,
      customization: 8,
      integrations: 8,
      "administration-overhead": 4,
      scalability: 9,
      "value-for-money": 5,
    },
    bestFor: [
      "SAP ERP-centric enterprises",
      "Global sales orgs needing SAP CX alignment",
      "Buyers with SAP implementation partners",
    ],
    notIdealFor: [
      "SMB self-serve CRM",
      "Transparent list-price buyers",
      "Lightweight pipeline tools",
    ],
    pros: [
      "Enterprise SAP stack integration",
      "Sales Cloud / CX depth",
      "Scalability for global orgs",
      "Strong reporting ceiling",
    ],
    cons: [
      "Opaque pricing",
      "Heavy admin/implementation",
      "Poor SMB fit",
      "Complexity for simple sales teams",
    ],
    keyFeatures: [
      "SAP Sales Cloud / CX",
      "Enterprise pipeline",
      "Automation",
      "SAP ERP alignment",
      "Analytics",
    ],
    pricingSummary: "Custom enterprise quote — contact SAP sales.",
    whoShouldChoose:
      "Choose SAP CX/Sales Cloud when SAP landscape alignment is non-negotiable.",
    whoShouldConsiderAlternatives:
      "Compare Salesforce, Dynamics 365, or Oracle CX for other enterprise stacks.",
    alternativeSlugs: ["salesforce", "dynamics-365", "oracle-cx", "hubspot"],
    aliases: ["SAP Sales Cloud", "SAP CX", "SAP CRM"],
    subcategorySlugs: ["sales-crm"],
    useCaseSlugs: ["pipeline-management", "sales-automation", "lead-management"],
    teamTypeSlugs: ["sales"],
    businessSizeSlugs: ["enterprise"],
    competitorSlugs: ["salesforce", "dynamics-365", "oracle-cx"],
    comparableSlugs: ["salesforce", "dynamics-365"],
    softShortDescription:
      "SAP Customer Experience / Sales Cloud; custom enterprise quote only.",
  },
  {
    wave: "b",
    slug: "siebel",
    name: "Oracle Siebel CRM",
    company: "Oracle",
    website: "https://www.oracle.com",
    domain: "oracle.com",
    pricingUrl: "https://www.oracle.com/cx/siebel/",
    shortDescription:
      "Oracle Siebel CRM — legacy enterprise CRM platform with custom quote licensing.",
    vendorPositioning:
      "Established enterprise CRM (Siebel) for complex on-prem/cloud deployments still running mission-critical Siebel processes.",
    pricingModel: "custom-quote",
    hasFreePlan: false,
    hasFreeTrial: false,
    pricingNotes: "Custom enterprise legacy quote — Oracle Siebel (first-party Aug 2026).",
    fixturePlans: [
      "PLAN enterprise: name=Enterprise; contactSales=true; currency=USD; interval=month; billingInterval=month",
    ],
    enrichmentPlans: [contactSalesPlan("enterprise", "Enterprise")],
    featureOverrides: {
      "pipeline-management": "supported",
      "custom-fields": "supported",
      "workflow-automation": "supported",
      "reporting": "supported",
      "integrations": "supported",
      "ai-assistance": "limited",
      "mobile-app": "limited",
      "email-tracking": "limited",
    },
    limitations: [
      "Legacy enterprise platform — high TCO and specialization",
      "Custom quote only",
      "New greenfield buyers usually evaluate Fusion/CX instead",
    ],
    scores: {
      "ease-of-use": 5,
      "pipeline-management": 7,
      "sales-automation": 7,
      "email-capabilities": 5,
      reporting: 7,
      customization: 8,
      integrations: 6,
      "administration-overhead": 4,
      scalability: 8,
      "value-for-money": 5,
    },
    bestFor: [
      "Enterprises already standardized on Siebel",
      "Complex legacy CRM process continuity",
      "Oracle accounts maintaining Siebel estates",
    ],
    notIdealFor: [
      "New SMB CRM buyers",
      "Greenfield cloud CRM projects preferring modern UX",
      "Transparent SaaS pricing seekers",
    ],
    pros: [
      "Deep enterprise CRM configurability",
      "Proven at large scale historically",
      "Oracle support path",
      "Industry solution heritage",
    ],
    cons: [
      "Legacy complexity and overhead",
      "Opaque licensing",
      "Modern UX/ecosystem lag vs cloud natives",
      "Poor fit for new SMB deployments",
    ],
    keyFeatures: [
      "Enterprise CRM processes",
      "Deep customization",
      "Industry solutions heritage",
      "Workflow automation",
      "Large-scale deployments",
    ],
    pricingSummary: "Custom enterprise quote — contact Oracle for Siebel licensing.",
    whoShouldChoose:
      "Choose Siebel only for continuity of existing Siebel estates — not typical new SMB CRM buys.",
    whoShouldConsiderAlternatives:
      "Compare Oracle CX, Salesforce, or Dynamics 365 for greenfield enterprise CRM.",
    alternativeSlugs: ["oracle-cx", "salesforce", "dynamics-365", "sap"],
    aliases: ["Siebel", "Siebel CRM", "Oracle Siebel"],
    subcategorySlugs: ["sales-crm"],
    useCaseSlugs: ["pipeline-management", "sales-automation", "contact-management"],
    teamTypeSlugs: ["sales"],
    businessSizeSlugs: ["enterprise"],
    competitorSlugs: ["oracle-cx", "salesforce", "dynamics-365", "sap"],
    comparableSlugs: ["oracle-cx", "salesforce"],
    softShortDescription:
      "Oracle Siebel CRM legacy enterprise platform; custom quote only.",
  },

  // ─── WAVE C ───────────────────────────────────────────────
  {
    wave: "c",
    slug: "mailchimp",
    name: "Mailchimp",
    company: "Intuit Mailchimp",
    website: "https://mailchimp.com",
    domain: "mailchimp.com",
    pricingUrl: "https://mailchimp.com/pricing/marketing/",
    shortDescription:
      "Email marketing platform with CRM-oriented contact and audience tools; freemium entry for smaller lists.",
    vendorPositioning:
      "Marketing platform with CRM features for audience management, journeys, and email — strongest as marketing-led CRM, not full sales platform.",
    pricingModel: "freemium",
    hasFreePlan: true,
    hasFreeTrial: false,
    startingPriceMonthly: 0,
    pricingNotes:
      "Freemium email marketing + CRM features. Exact paid ladder is contact/list based — assert freemium model without inventing unpaid dollar tiers beyond Free entry (Aug 2026).",
    fixturePlans: [
      "PLAN free: name=Free; isFree=true; currency=USD; interval=month; billingInterval=month",
      "PLAN standard: name=Standard; contactSales=true; currency=USD; interval=month; billingInterval=month; unit=contact",
      "PLAN enterprise: name=Enterprise; contactSales=true; currency=USD; interval=month; billingInterval=month",
    ],
    enrichmentPlans: [
      {
        id: "plan-free",
        slug: "free",
        name: "Free",
        isFree: true,
        contactSales: false,
        hasFreeTrial: false,
        highlighted: true,
        rules: [
          {
            kind: "flat",
            amount: 0,
            currency: "USD",
            interval: "month",
            amountPeriod: "month",
          },
        ],
        description:
          "Freemium Free tier for eligible small audiences — confirm current contact caps on mailchimp.com/pricing.",
      },
      {
        id: "plan-standard",
        slug: "standard",
        name: "Standard / paid marketing plans",
        isFree: false,
        contactSales: false,
        hasFreeTrial: false,
        highlighted: false,
        rules: [],
        notes:
          "Paid plans are primarily contact/list-based. Exact dollar ladders change — verify live pricing; not invented here.",
      },
      contactSalesPlan("enterprise", "Enterprise"),
    ],
    featureOverrides: {
      "email-sync": "supported",
      "email-tracking": "supported",
      "contact-management": "supported",
      "lead-management": "limited",
      "pipeline-management": "limited",
      "deal-management": "limited",
      "sales-automation": "limited",
      "workflow-automation": "supported",
      "ai-assistance": "supported",
      "reporting": "supported",
      "mobile-app": "supported",
    },
    limitations: [
      "Marketing-led CRM — not a full sales pipeline platform",
      "Paid pricing is contact-based and changes — verify live",
      "Deal/pipeline CRM depth limited vs sales CRMs",
    ],
    scores: {
      "ease-of-use": 8,
      "pipeline-management": 5,
      "sales-automation": 5,
      "email-capabilities": 9,
      reporting: 7,
      customization: 6,
      integrations: 7,
      "administration-overhead": 7,
      scalability: 7,
      "value-for-money": 7,
    },
    bestFor: [
      "Marketing teams needing email + audience CRM features",
      "SMBs starting on freemium email marketing",
      "Buyers prioritizing campaigns over sales pipelines",
    ],
    notIdealFor: [
      "Sales teams needing deep deal CRM",
      "Enterprise SFA platforms",
      "Complex B2B pipeline automation buyers",
    ],
    pros: [
      "Strong email marketing capabilities",
      "Freemium entry",
      "Audience/CRM-lite contact tools",
      "Broad integrations and brand familiarity",
    ],
    cons: [
      "Not a full sales CRM",
      "Contact-based paid pricing can scale up quickly",
      "Pipeline/deal depth limited",
      "Sales automation secondary to marketing",
    ],
    keyFeatures: [
      "Email campaigns and journeys",
      "Audience/contact CRM features",
      "Automation",
      "Reporting",
      "Freemium Free tier",
    ],
    pricingSummary:
      "Freemium Free tier for eligible audiences; paid plans are contact-based — verify live Mailchimp pricing. Enterprise available.",
    whoShouldChoose:
      "Choose Mailchimp when email marketing + audience CRM features are the primary need.",
    whoShouldConsiderAlternatives:
      "Compare HubSpot, ActiveCampaign, or Pipedrive if you need stronger sales CRM pipelines.",
    alternativeSlugs: ["hubspot", "activecampaign", "pipedrive", "keap"],
    secondaryCategorySlugs: ["marketing"],
    subcategorySlugs: ["small-business-crm"],
    useCaseSlugs: ["lead-management", "contact-management"],
    teamTypeSlugs: ["marketing", "founders"],
    businessSizeSlugs: ["micro", "small-business", "mid-market"],
    competitorSlugs: ["hubspot", "activecampaign", "keap", "getresponse"],
    comparableSlugs: ["hubspot", "activecampaign"],
    softShortDescription:
      "Email marketing with CRM features; freemium entry (secondary category: marketing).",
  },
  {
    wave: "c",
    slug: "marketo",
    name: "Adobe Marketo Engage",
    company: "Adobe",
    website: "https://business.adobe.com",
    domain: "business.adobe.com",
    pricingUrl: "https://business.adobe.com/products/marketo/adobe-marketo.html",
    shortDescription:
      "Adobe Marketo Engage marketing automation platform — enterprise custom quote only.",
    vendorPositioning:
      "Enterprise marketing automation (MA) for complex B2B lead lifecycle and campaign orchestration within Adobe Experience Cloud.",
    pricingModel: "custom-quote",
    hasFreePlan: false,
    hasFreeTrial: false,
    pricingNotes: "Custom quote marketing automation — Adobe Marketo Engage (Aug 2026).",
    fixturePlans: [
      "PLAN enterprise: name=Enterprise; contactSales=true; currency=USD; interval=month; billingInterval=month",
    ],
    enrichmentPlans: [contactSalesPlan("enterprise", "Enterprise")],
    featureOverrides: {
      "lead-management": "supported",
      "email-tracking": "supported",
      "workflow-automation": "supported",
      "sales-automation": "limited",
      "pipeline-management": "limited",
      "deal-management": "limited",
      "reporting": "supported",
      "ai-assistance": "supported",
      "integrations": "supported",
      "contact-management": "supported",
    },
    limitations: [
      "MA platform — not a full sales CRM system of record for many teams",
      "Custom quote only",
      "High complexity/admin overhead",
    ],
    scores: {
      "ease-of-use": 5,
      "pipeline-management": 5,
      "sales-automation": 6,
      "email-capabilities": 9,
      reporting: 8,
      customization: 8,
      integrations: 8,
      "administration-overhead": 4,
      scalability: 9,
      "value-for-money": 5,
    },
    bestFor: [
      "Enterprise B2B marketing automation teams",
      "Adobe Experience Cloud customers",
      "Complex lead lifecycle orchestration",
    ],
    notIdealFor: [
      "SMB sales CRM buyers",
      "Simple email newsletter needs",
      "Transparent list-price seekers",
    ],
    pros: [
      "Enterprise MA depth",
      "Adobe ecosystem",
      "Lead lifecycle sophistication",
      "Scalability",
    ],
    cons: [
      "Opaque pricing",
      "Heavy admin overhead",
      "Not a sales-native CRM",
      "Overkill for SMB",
    ],
    keyFeatures: [
      "Marketing automation",
      "Lead management",
      "Email and journey orchestration",
      "Analytics",
      "Adobe Experience Cloud integration",
    ],
    pricingSummary: "Custom quote — contact Adobe for Marketo Engage.",
    whoShouldChoose:
      "Choose Marketo Engage for enterprise B2B marketing automation, not lightweight sales CRM.",
    whoShouldConsiderAlternatives:
      "Compare HubSpot, Pardot/Account Engagement, or ActiveCampaign depending on stack and scale.",
    alternativeSlugs: ["hubspot", "pardot", "activecampaign", "salesforce"],
    aliases: ["Marketo", "Marketo Engage", "Adobe Marketo"],
    secondaryCategorySlugs: ["marketing"],
    subcategorySlugs: ["sales-crm"],
    useCaseSlugs: ["lead-management", "sales-automation"],
    teamTypeSlugs: ["marketing", "sales"],
    businessSizeSlugs: ["mid-market", "enterprise"],
    competitorSlugs: ["hubspot", "pardot", "activecampaign", "salesforce"],
    comparableSlugs: ["hubspot", "pardot"],
    softShortDescription:
      "Adobe Marketo Engage marketing automation; custom enterprise quote.",
  },
  {
    wave: "c",
    slug: "pardot",
    name: "Salesforce Account Engagement",
    company: "Salesforce",
    website: "https://www.salesforce.com",
    domain: "salesforce.com",
    pricingUrl: "https://www.salesforce.com/products/marketing-cloud/account-engagement/",
    shortDescription:
      "Salesforce Account Engagement (Pardot) B2B marketing automation — custom quote packaging within Salesforce.",
    vendorPositioning:
      "B2B marketing automation tightly coupled to Salesforce CRM for lead nurturing, scoring, and sales alignment.",
    pricingModel: "custom-quote",
    hasFreePlan: false,
    hasFreeTrial: false,
    pricingNotes:
      "Custom quote — Salesforce Account Engagement (Pardot). Aliases Pardot, Account Engagement (Aug 2026).",
    fixturePlans: [
      "PLAN enterprise: name=Enterprise; contactSales=true; currency=USD; interval=month; billingInterval=month",
    ],
    enrichmentPlans: [contactSalesPlan("enterprise", "Enterprise")],
    featureOverrides: {
      "lead-management": "supported",
      "email-tracking": "supported",
      "workflow-automation": "supported",
      "reporting": "supported",
      "integrations": "supported",
      "pipeline-management": "limited",
      "deal-management": "limited",
      "sales-automation": "limited",
      "ai-assistance": "supported",
      "contact-management": "supported",
    },
    limitations: [
      "MA product — pairs with Salesforce CRM rather than replacing it",
      "Custom quote / Salesforce packaging",
      "Best value inside Salesforce stack",
    ],
    scores: {
      "ease-of-use": 6,
      "pipeline-management": 5,
      "sales-automation": 6,
      "email-capabilities": 8,
      reporting: 7,
      customization: 7,
      integrations: 9,
      "administration-overhead": 5,
      scalability: 8,
      "value-for-money": 6,
    },
    bestFor: [
      "Salesforce CRM customers needing B2B MA",
      "Lead nurturing and scoring aligned to Salesforce",
      "Mid-market/enterprise marketing ops on Salesforce",
    ],
    notIdealFor: [
      "Non-Salesforce stacks seeking standalone MA",
      "SMB freemium email tools",
      "Sales-only CRM buyers without marketing ops",
    ],
    pros: [
      "Deep Salesforce CRM alignment",
      "B2B lead nurturing/scoring",
      "Salesforce ecosystem integrations",
      "Enterprise scalability",
    ],
    cons: [
      "Pricing/packaging via Salesforce sales motion",
      "Not a standalone sales CRM",
      "Admin overhead for MA programs",
      "Weaker fit outside Salesforce",
    ],
    keyFeatures: [
      "B2B marketing automation",
      "Lead scoring and nurturing",
      "Salesforce CRM sync",
      "Email and engagement",
      "Reporting",
    ],
    pricingSummary:
      "Custom quote via Salesforce — Account Engagement (Pardot) packaging.",
    whoShouldChoose:
      "Choose Account Engagement when Salesforce CRM + B2B MA alignment is required.",
    whoShouldConsiderAlternatives:
      "Compare HubSpot, Marketo, or ActiveCampaign if you are not standardized on Salesforce.",
    alternativeSlugs: ["hubspot", "marketo", "activecampaign", "salesforce"],
    aliases: ["Pardot", "Account Engagement", "Salesforce Pardot"],
    formerlyKnownAs: ["Pardot"],
    secondaryCategorySlugs: ["marketing"],
    subcategorySlugs: ["sales-crm"],
    useCaseSlugs: ["lead-management", "sales-automation"],
    teamTypeSlugs: ["marketing", "sales"],
    businessSizeSlugs: ["mid-market", "enterprise"],
    competitorSlugs: ["hubspot", "marketo", "activecampaign", "salesforce"],
    comparableSlugs: ["hubspot", "marketo"],
    softShortDescription:
      "Salesforce Account Engagement (Pardot) B2B MA; custom quote.",
  },
  {
    wave: "c",
    slug: "tidio",
    name: "Tidio",
    company: "Tidio",
    website: "https://www.tidio.com",
    domain: "tidio.com",
    pricingUrl: "https://www.tidio.com/pricing/",
    shortDescription:
      "Live chat and AI customer communication platform with freemium-ish entry and CRM-adjacent visitor/contact tools.",
    vendorPositioning:
      "Live chat, chatbots, and AI agents for customer communication — CRM-adjacent more than full sales CRM.",
    pricingModel: "freemium",
    hasFreePlan: true,
    hasFreeTrial: true,
    startingPriceMonthly: 0,
    pricingNotes:
      "Freemium-ish live chat + AI. Exact paid seat/billers change — assert freemium model; verify live paid amounts on tidio.com/pricing (Aug 2026). Has affiliate partnership.",
    fixturePlans: [
      "PLAN free: name=Free; isFree=true; currency=USD; interval=month; billingInterval=month",
      "PLAN paid: name=Paid plans; contactSales=true; currency=USD; interval=month; billingInterval=month",
      "PLAN enterprise: name=Enterprise; contactSales=true; currency=USD; interval=month; billingInterval=month",
    ],
    enrichmentPlans: [
      {
        id: "plan-free",
        slug: "free",
        name: "Free",
        isFree: true,
        contactSales: false,
        hasFreeTrial: false,
        highlighted: true,
        rules: [
          {
            kind: "flat",
            amount: 0,
            currency: "USD",
            interval: "month",
            amountPeriod: "month",
          },
        ],
        description: "Freemium Free entry — confirm current limits on tidio.com/pricing.",
      },
      {
        id: "plan-paid",
        slug: "paid",
        name: "Paid plans",
        isFree: false,
        contactSales: false,
        hasFreeTrial: true,
        highlighted: false,
        rules: [],
        notes:
          "Paid chat/AI packages — verify live amounts; not invented beyond freemium model in this pack.",
      },
      contactSalesPlan("enterprise", "Enterprise"),
    ],
    featureOverrides: {
      "contact-management": "limited",
      "lead-management": "limited",
      "pipeline-management": "not-supported",
      "deal-management": "not-supported",
      "email-sync": "limited",
      "email-tracking": "limited",
      "workflow-automation": "limited",
      "sales-automation": "limited",
      "reporting": "limited",
      "ai-assistance": "supported",
      "mobile-app": "supported",
      "custom-pipelines": "not-supported",
      "custom-fields": "limited",
      integrations: "supported",
    },
    aiLines: ["AI chatbot: supported", "AI assistant: supported"],
    limitations: [
      "Live chat/AI — not a full sales CRM system of record",
      "Pipeline/deal CRM features largely absent",
      "Paid plan dollar amounts should be verified live",
    ],
    scores: {
      "ease-of-use": 8,
      "pipeline-management": 5,
      "sales-automation": 5,
      "email-capabilities": 5,
      reporting: 5,
      customization: 6,
      integrations: 7,
      "administration-overhead": 8,
      scalability: 6,
      "value-for-money": 7,
    },
    bestFor: [
      "Websites needing live chat and AI chatbots",
      "SMB support/sales chat entry points",
      "Teams wanting freemium chat before upgrading",
    ],
    notIdealFor: [
      "Full sales pipeline CRM buyers",
      "Enterprise SFA platforms",
      "Complex B2B deal management",
    ],
    pros: [
      "Freemium-ish chat entry",
      "AI chatbot capabilities",
      "Easy website embed",
      "Affiliate program available",
    ],
    cons: [
      "Not a sales CRM of record",
      "Weak pipeline/deal management",
      "Reporting depth limited vs CRM suites",
      "Paid pricing should be re-verified live",
    ],
    keyFeatures: [
      "Live chat",
      "AI chatbots/agents",
      "Visitor/contact tools",
      "Integrations",
      "Freemium entry",
    ],
    pricingSummary:
      "Freemium Free entry; paid chat/AI plans — verify live amounts on tidio.com/pricing.",
    whoShouldChoose:
      "Choose Tidio for live chat and AI customer messaging, not as a primary sales CRM.",
    whoShouldConsiderAlternatives:
      "Compare HubSpot, Zendesk, or Pipedrive if you need CRM/pipeline systems of record.",
    alternativeSlugs: ["hubspot", "zendesk", "pipedrive", "freshsales"],
    subcategorySlugs: ["small-business-crm"],
    useCaseSlugs: ["lead-management", "contact-management"],
    teamTypeSlugs: ["sales", "founders", "marketing"],
    businessSizeSlugs: ["micro", "small-business"],
    competitorSlugs: ["hubspot", "zendesk", "freshsales"],
    comparableSlugs: ["hubspot", "zendesk"],
    softShortDescription:
      "Live chat + AI messaging with freemium-ish entry; CRM-adjacent (affiliate available).",
  },
];

// ── helpers ─────────────────────────────────────────────────

function planPerSeat(slug, name, annual, monthly, extra = {}) {
  return {
    id: `plan-${slug}`,
    slug,
    name,
    isFree: false,
    contactSales: false,
    hasFreeTrial: !!extra.hasFreeTrial,
    trialDays: extra.trialDays,
    highlighted: !!extra.highlighted,
    rules: [
      {
        kind: "per-seat",
        amountPerSeat: annual,
        currency: "USD",
        interval: "year",
        amountPeriod: "month",
      },
      {
        kind: "per-seat",
        amountPerSeat: monthly,
        currency: "USD",
        interval: "month",
        amountPeriod: "month",
      },
    ],
    notes: extra.notes,
  };
}

function planAnnualOnly(slug, name, amount, extra = {}) {
  return {
    id: `plan-${slug}`,
    slug,
    name,
    isFree: false,
    contactSales: false,
    hasFreeTrial: !!extra.hasFreeTrial,
    trialDays: extra.trialDays,
    highlighted: !!extra.highlighted,
    rules: [
      {
        kind: "per-seat",
        amountPerSeat: amount,
        currency: "USD",
        interval: "year",
        amountPeriod: "month",
      },
    ],
    notes: extra.notes,
  };
}

function planMonthlyOnly(slug, name, amount, extra = {}) {
  return {
    id: `plan-${slug}`,
    slug,
    name,
    isFree: false,
    contactSales: false,
    hasFreeTrial: !!extra.hasFreeTrial,
    trialDays: extra.trialDays,
    highlighted: !!extra.highlighted,
    rules: [
      {
        kind: "per-seat",
        amountPerSeat: amount,
        currency: "USD",
        interval: "month",
        amountPeriod: "month",
      },
    ],
    notes: extra.notes,
  };
}

function planAnnualSeat(slug, name, amountPerYear, extra = {}) {
  return {
    id: `plan-${slug}`,
    slug,
    name,
    isFree: false,
    contactSales: false,
    hasFreeTrial: false,
    highlighted: !!extra.highlighted,
    rules: [
      {
        kind: "per-seat",
        amountPerSeat: amountPerYear,
        currency: "USD",
        interval: "year",
        amountPeriod: "year",
      },
    ],
    notes: extra.notes,
  };
}

function contactSalesPlan(slug, name, extra = {}) {
  return {
    id: `plan-${slug}`,
    slug,
    name,
    isFree: false,
    contactSales: true,
    hasFreeTrial: false,
    highlighted: !!extra.highlighted,
    rules: [],
    notes: extra.notes,
  };
}

function avgScore(scores) {
  const vals = CRITERIA.map((c) => scores[c]);
  const sum = vals.reduce((a, b) => a + b, 0);
  return Math.round((sum / vals.length) * 10) / 10;
}

function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function writeText(filePath, text) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, text.endsWith("\n") ? text : `${text}\n`, "utf8");
}

function planSlugs(p) {
  return p.enrichmentPlans.map((pl) => pl.slug);
}

function featureAvailability(p, feature) {
  return p.featureOverrides?.[feature] ?? "supported";
}

function buildSources(p) {
  const pricingUrl = p.pricingUrl ?? `${p.website.replace(/\/$/, "")}/pricing`;
  return [
    {
      id: `${p.slug}-pricing-official`,
      productSlug: p.slug,
      url: pricingUrl,
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
    {
      id: `${p.slug}-product-official`,
      productSlug: p.slug,
      url: p.website,
      domain: p.domain,
      title: p.name,
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
        "integrations",
      ],
      confidence: "high",
      status: "active",
      notes: p.vendorPositioning,
    },
    {
      id: `${p.slug}-pricing-fixture`,
      productSlug: p.slug,
      url: pricingUrl,
      domain: p.domain,
      title: `${p.name} Pricing (fixture snapshot)`,
      publisher: p.company,
      sourceType: "fixture",
      authority: "fixture",
      domains: ["pricing", "plans", "free-plan", "free-trial"],
      status: "active",
      notes:
        "FIXTURE for FixtureFactExtractor — structured extract mirroring researched first-party numbers where asserted. Label: fixture extract, not a live scrape.",
    },
    {
      id: `${p.slug}-product-fixture`,
      productSlug: p.slug,
      url: p.website,
      domain: p.domain,
      title: `${p.name} Product (fixture snapshot)`,
      publisher: p.company,
      sourceType: "fixture",
      authority: "fixture",
      domains: [
        "identity",
        "features",
        "ai-capabilities",
        "product-positioning",
      ],
      status: "active",
      notes:
        "FIXTURE for FixtureFactExtractor — structured product/features text. Label: fixture extract.",
    },
  ];
}

function buildPricingFixture(p) {
  return `# FIXTURE SNAPSHOT — structured extract for FixtureFactExtractor
# NOT a live HTML scrape. Numbers below mirror researched first-party figures where asserted (verifiedAt ${VERIFIED_AT.slice(0, 10)}).
# ${p.pricingNotes}

CURRENCY: USD
PRICING_MODEL: ${p.pricingModel}
FREE_PLAN: ${p.hasFreePlan}
FREE_TRIAL: ${p.hasFreeTrial}

${p.fixturePlans.join("\n")}
`;
}

function buildProductFixture(p) {
  const features = DEFAULT_FEATURES.map(
    (f) => `FEATURE ${f}: ${featureAvailability(p, f)}`,
  ).join("\n");
  const ai =
    (p.aiLines ?? ["AI assistant: unknown"]).join("\n");
  return `# FIXTURE SNAPSHOT — structured product extract for FixtureFactExtractor
# Label: fixture extract grounded in first-party positioning (verifiedAt ${VERIFIED_AT.slice(0, 10)}).

SHORT_DESCRIPTION: ${p.shortDescription}
VENDOR_POSITIONING: ${p.vendorPositioning}

${features}

${ai}
`;
}

function buildEnrichment(p) {
  const pricingSrc = `${p.slug}-pricing-official`;
  const productSrc = `${p.slug}-product-official`;
  const slugs = planSlugs(p);
  const featureSupport = DEFAULT_FEATURES.map((featureSlug) => {
    const availability = featureAvailability(p, featureSlug);
    return {
      featureSlug,
      availability,
      planSlugs:
        availability === "not-supported" || availability === "unknown"
          ? []
          : slugs,
      sourceIds: [productSrc, pricingSrc],
    };
  });

  const pricing = {
    currency: "USD",
    model: p.pricingModel,
    hasFreePlan: p.hasFreePlan,
    hasFreeTrial: p.hasFreeTrial,
    ...(p.startingPriceMonthly !== undefined
      ? { startingPriceMonthly: p.startingPriceMonthly }
      : {}),
    plans: p.enrichmentPlans,
    notes: p.pricingNotes,
    verifiedAt: VERIFIED_AT,
    sourceIds: [pricingSrc],
  };

  return {
    productSlug: p.slug,
    shortDescription: p.shortDescription,
    featureSupport,
    integrationSupport: [],
    aiCapabilities: (p.aiLines ?? ["AI assistant: unknown"]).map((line) => {
      const m = /^AI\s+([a-z0-9-]+):\s*([a-z-]+)/i.exec(line);
      return {
        capability: m?.[1] ?? "assistant",
        availability: m?.[2] ?? "unknown",
        sourceIds: [productSrc],
      };
    }),
    vendorPositioning: [
      {
        claim: p.vendorPositioning,
        audienceHints: p.bestFor.slice(0, 2),
        sourceIds: [productSrc],
      },
    ],
    editorialFit: p.businessSizeSlugs.map((businessSizeSlug) => ({
      businessSizeSlug,
      strength:
        businessSizeSlug === "enterprise"
          ? "moderate"
          : businessSizeSlug === "micro"
            ? "strong"
            : "moderate",
      rationale: p.shortDescription,
      isEditorial: true,
    })),
    limitations: p.limitations.map((description) => ({
      kind: "feature-unavailable",
      description,
      sourceIds: [productSrc, pricingSrc],
      isEditorial: true,
    })),
    screenshots: [
      {
        id: `${p.slug}-shot-pipeline-teaching`,
        src: `/software/${p.slug}/pipeline-teaching.png`,
        alt: `${p.name} pipeline teaching visual`,
        caption: `SoftwareGlimpse teaching placeholder for ${p.name} pipeline concepts.`,
        source: p.website,
        checkedAt: VERIFIED_AT,
        annotation:
          "Teaching asset path — not a fabricated vendor UI capture; generate/replace with approved teaching art.",
        kind: "original-diagram",
        featureIds: ["pipeline-management"],
        useCaseIds: ["pipeline-management"],
      },
      {
        id: `${p.slug}-shot-overview-teaching`,
        src: `/software/${p.slug}/overview-teaching.png`,
        alt: `${p.name} overview teaching visual`,
        caption: `SoftwareGlimpse teaching placeholder for ${p.name} overview.`,
        source: p.website,
        checkedAt: VERIFIED_AT,
        annotation:
          "Teaching asset path — not a fabricated vendor UI capture; generate/replace with approved teaching art.",
        kind: "original-diagram",
        featureIds: ["contact-management"],
        useCaseIds: [],
      },
    ],
    pricing,
    domainCheckedAt: {
      identity: VERIFIED_AT,
      pricing: VERIFIED_AT,
      plans: VERIFIED_AT,
      "free-plan": VERIFIED_AT,
      "free-trial": VERIFIED_AT,
      features: VERIFIED_AT,
      "ai-capabilities": VERIFIED_AT,
      "product-positioning": VERIFIED_AT,
      integrations: VERIFIED_AT,
      limits: VERIFIED_AT,
      support: VERIFIED_AT,
    },
    sourceIds: [pricingSrc, productSrc],
    updatedAt: VERIFIED_AT,
    notes: `First-party research extract as of 2026-08-16. handsOnTesting=false. Fixture sources included for extraction pipeline. Do not invent YouTube URLs.`,
    media: [],
  };
}

function factBase(p, id, domain, field, value, sourceId, excerpt) {
  return {
    id,
    productSlug: p.slug,
    domain,
    field,
    value,
    sourceIds: [sourceId],
    evidence: [{ sourceId, excerpt }],
    extractedAt: VERIFIED_AT,
    normalizedAt: VERIFIED_AT,
    verifiedAt: VERIFIED_AT,
    approvedAt: VERIFIED_AT,
    confidence: "high",
    status: "approved",
    isFixture: false,
  };
}

function buildFacts(p) {
  const pricingSrc = `${p.slug}-pricing-official`;
  const productSrc = `${p.slug}-product-official`;
  const facts = [
    factBase(
      p,
      `fact-${p.slug}-pricing.hasFreePlan`,
      "free-plan",
      "pricing.hasFreePlan",
      p.hasFreePlan,
      pricingSrc,
      `FREE_PLAN / documented: ${p.hasFreePlan}`,
    ),
    factBase(
      p,
      `fact-${p.slug}-pricing.hasFreeTrial`,
      "free-trial",
      "pricing.hasFreeTrial",
      p.hasFreeTrial,
      pricingSrc,
      `FREE_TRIAL / documented: ${p.hasFreeTrial}`,
    ),
    factBase(
      p,
      `fact-${p.slug}-pricing.currency`,
      "pricing",
      "pricing.currency",
      "USD",
      pricingSrc,
      "USD",
    ),
    factBase(
      p,
      `fact-${p.slug}-pricing.model`,
      "pricing",
      "pricing.model",
      p.pricingModel,
      pricingSrc,
      p.pricingModel,
    ),
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

  for (const featureSlug of DEFAULT_FEATURES) {
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

function defaultRationale(criterion, score, p) {
  const map = {
    "ease-of-use": `Usability score ${score}/10 based on first-party positioning for ${p.name} — not hands-on lab tested.`,
    "pipeline-management": `Pipeline/deal management assessed at ${score}/10 from documented CRM capabilities.`,
    "sales-automation": `Sales/workflow automation assessed at ${score}/10 from first-party feature claims.`,
    "email-capabilities": `Email-related capabilities assessed at ${score}/10 from product positioning.`,
    reporting: `Reporting depth assessed at ${score}/10 from documented analytics/reporting claims.`,
    customization: `Customization assessed at ${score}/10 from documented fields/workflows/configurability.`,
    integrations: `Integrations assessed at ${score}/10 from ecosystem/connector positioning.`,
    "administration-overhead": `Admin overhead inverted score ${score}/10 (higher = lower burden) from deployment complexity signals.`,
    scalability: `Scalability assessed at ${score}/10 for intended business sizes (${p.businessSizeSlugs.join(", ")}).`,
    "value-for-money": `Value assessed at ${score}/10 against published or custom-quote pricing posture.`,
  };
  return p.scoreRationales?.[criterion] ?? map[criterion];
}

function buildCriterionAssessments(p) {
  return CRITERIA.map((criterionSlug) => {
    const score = p.scores[criterionSlug];
    const supportingFactIds = [
      `fact-${p.slug}-features.pipeline-management`,
      `fact-${p.slug}-pricing.model`,
    ];
    if (criterionSlug === "email-capabilities") {
      supportingFactIds[0] = `fact-${p.slug}-features.email-sync`;
    }
    if (criterionSlug === "value-for-money") {
      supportingFactIds[0] = `fact-${p.slug}-pricing.hasFreePlan`;
    }
    return {
      criterionSlug,
      score,
      rationale: defaultRationale(criterionSlug, score, p),
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
    id: `assessment-${p.slug}-crm-v1`,
    productSlug: p.slug,
    methodologySlug: "crm-editorial",
    methodologyVersion: "1.0.0",
    status: "approved",
    verdict: `${p.name}: ${p.whoShouldChoose} Scores reflect first-party research as of 2026-08-16 — not hands-on product testing.`,
    strengths: p.pros.slice(0, 5),
    weaknesses: p.cons.slice(0, 5),
    bestFor: p.bestFor,
    notIdealFor: p.notIdealFor,
    tradeoffs: [
      "Published packaging clarity vs ecosystem depth",
      "Specialization fit vs generalist CRM breadth",
      "Price transparency vs enterprise custom quoting",
    ],
    recommendation: `${p.whoShouldChoose} ${p.whoShouldConsiderAlternatives}`,
    editorialNotes:
      "Approved from first-party research extract 2026-08-16. handsOnTesting=false.",
    handsOnTesting: false,
    confidence: "medium",
    criterionAssessments,
    overallScore,
    overallScoreRationale:
      "Equal-weight average of 10 CRM editorial criteria, rounded to 1 decimal. Not a hands-on lab score.",
    scoreAudit: [
      {
        at: VERIFIED_AT,
        actor: "editorial",
        change: "Migration-gap onboarding batch; approved criteria; handsOnTesting=false",
        nextOverall: overallScore,
      },
    ],
    reviewedAt: VERIFIED_AT,
    reviewer: "editorial",
    createdAt: VERIFIED_AT,
    updatedAt: VERIFIED_AT,
  };
}

function buildReview(p, overallScore, criterionAssessments) {
  const pricingSrc = `${p.slug}-pricing-official`;
  const productSrc = `${p.slug}-product-official`;
  const planFactIds = p.enrichmentPlans
    .slice(0, 3)
    .map((pl) => `fact-${p.slug}-pricing.plans.${pl.slug}`);

  return {
    id: `review-${p.slug}-v1`,
    productSlug: p.slug,
    assessmentId: `assessment-${p.slug}-crm-v1`,
    editorialStatus: "approved",
    title: `${p.name} Review (2026)`,
    h1: `${p.name} Review`,
    intro: `${p.shortDescription} This review covers pricing posture, CRM capabilities, limitations, and fit based on first-party research — not hands-on lab testing.`,
    summary: `${p.name} overall score ${overallScore}/10 from equal-weight CRM criteria. ${p.pricingSummary}`,
    verdict: `${p.name}: ${p.whoShouldChoose} Scores reflect first-party research as of 2026-08-16 — not hands-on product testing.`,
    overallScore,
    criterionAssessments,
    bestFor: p.bestFor,
    notIdealFor: p.notIdealFor,
    pros: p.pros,
    cons: p.cons,
    pricingSummary: p.pricingSummary,
    keyFeatures: p.keyFeatures,
    limitations: p.limitations,
    whoShouldChoose: p.whoShouldChoose,
    whoShouldConsiderAlternatives: p.whoShouldConsiderAlternatives,
    alternativeSlugs: p.alternativeSlugs,
    comparisonSlugs: [],
    relatedGuidePaths: ["/guides/what-is-crm/", "/guides/how-to-choose-crm/"],
    methodologySlug: "crm-editorial",
    methodologyVersion: "1.0.0",
    researchSourceIds: [pricingSrc, productSrc],
    factRefs: [
      { section: "pricing", factIds: planFactIds },
      {
        section: "features",
        factIds: [
          `fact-${p.slug}-features.pipeline-management`,
          `fact-${p.slug}-features.contact-management`,
          `fact-${p.slug}-features.email-sync`,
        ],
      },
      {
        section: "positioning",
        factIds: [`fact-${p.slug}-positioning.vendorClaim`],
      },
    ],
    faq: [
      {
        question: `How much does ${p.name} cost?`,
        answer: p.pricingSummary,
        factIds: planFactIds,
      },
      {
        question: `Does ${p.name} have a free plan?`,
        answer: p.hasFreePlan
          ? `${p.name} offers a free/freemium entry according to first-party research — confirm current limits on the vendor site.`
          : `${p.name} does not offer a free forever plan in this research pack.`,
        factIds: [`fact-${p.slug}-pricing.hasFreePlan`],
      },
      {
        question: `Does ${p.name} offer a free trial?`,
        answer: p.hasFreeTrial
          ? `Yes — a free trial is documented (${p.trialDays ? `${p.trialDays}-day` : "vendor trial"}). Confirm live terms.`
          : `No self-serve free trial is asserted in this research pack.`,
        factIds: [`fact-${p.slug}-pricing.hasFreeTrial`],
      },
      {
        question: `Who is ${p.name} best for?`,
        answer: p.bestFor.join(" "),
        factIds: [`fact-${p.slug}-positioning.vendorClaim`],
      },
      {
        question: "Is this a hands-on SoftwareGlimpse lab review?",
        answer:
          "No. This review is approved from first-party research extracts without hands-on product testing.",
        factIds: [],
      },
    ],
    sections: [
      {
        id: "overview",
        heading: `What ${p.name} is`,
        body: p.shortDescription,
        factRefs: [`fact-${p.slug}-positioning.vendorClaim`],
      },
      {
        id: "pricing",
        heading: "Pricing and plans",
        body: p.pricingSummary,
        factRefs: planFactIds,
      },
      {
        id: "features",
        heading: "Core capabilities",
        body: `${p.name} documents capabilities including ${p.keyFeatures.slice(0, 4).join(", ")}. Feature support is mapped from first-party extracts — see criterion scores for relative strengths.`,
        factRefs: [
          `fact-${p.slug}-features.pipeline-management`,
          `fact-${p.slug}-features.contact-management`,
        ],
      },
      {
        id: "pros-cons",
        heading: "Pros and cons",
        body: `Pros: ${p.pros.slice(0, 3).join("; ")}. Cons: ${p.cons.slice(0, 3).join("; ")}.`,
        factRefs: [`fact-${p.slug}-pricing.model`],
      },
      {
        id: "best-for",
        heading: "Who it’s for",
        body: `Best for: ${p.bestFor.join("; ")}. Not ideal for: ${p.notIdealFor.join("; ")}.`,
        factRefs: [`fact-${p.slug}-positioning.vendorClaim`],
      },
      {
        id: "methodology",
        heading: "How we scored this",
        body: "Scores use the crm-editorial methodology (10 equal-weight criteria). Research is first-party extract as of 2026-08-16. handsOnTesting=false. Confidence=medium.",
        factRefs: [`fact-${p.slug}-pricing.model`],
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
      researchStatus: "complete",
    },
    seo: {
      title: `${p.name} Review (2026): Pricing, Features, Pros & Cons`,
      description: `In-depth ${p.name} review covering 2026 pricing posture, features, limitations, and who should buy.`,
      indexable: true,
      canonicalPath: `/software/${p.slug}/`,
    },
  };
}

function softSnippet(p) {
  const lines = [
    `  soft({`,
    `    id: "soft-${p.slug}",`,
    `    slug: "${p.slug}",`,
    `    name: ${JSON.stringify(p.name)},`,
    `    company: ${JSON.stringify(p.company)},`,
    `    website: ${JSON.stringify(p.website)},`,
    `    logo: { src: "/brands/${p.slug}.png", alt: ${JSON.stringify(`${p.name} logo`)} },`,
    `    shortDescription:`,
    `      ${JSON.stringify(p.softShortDescription)},`,
    `    primaryCategorySlug: "crm",`,
  ];
  if (p.secondaryCategorySlugs?.length) {
    lines.push(
      `    secondaryCategorySlugs: ${JSON.stringify(p.secondaryCategorySlugs)},`,
    );
  }
  lines.push(
    `    subcategorySlugs: ${JSON.stringify(p.subcategorySlugs)},`,
    `    useCaseSlugs: ${JSON.stringify(p.useCaseSlugs)},`,
    `    teamTypeSlugs: ${JSON.stringify(p.teamTypeSlugs)},`,
    `    businessSizeSlugs: ${JSON.stringify(p.businessSizeSlugs)},`,
    `    competitorSlugs: ${JSON.stringify(p.competitorSlugs)},`,
    `    alternativeSlugs: ${JSON.stringify(p.alternativeSlugs)},`,
    `    comparableSlugs: ${JSON.stringify(p.comparableSlugs)},`,
  );
  if (p.aliases?.length) {
    lines.push(`    aliases: ${JSON.stringify(p.aliases)},`);
  }
  if (p.formerlyKnownAs?.length) {
    lines.push(`    formerlyKnownAs: ${JSON.stringify(p.formerlyKnownAs)},`);
  }
  lines.push(
    `    metadata: {`,
    `      status: "published",`,
    `      publishedAt: "${PUBLISHED_AT}",`,
    `      researchStatus: "complete",`,
    `    },`,
    `  }),`,
  );
  return lines.join("\n");
}

function writeProduct(p) {
  const researchDir = path.join(ROOT, "src/data/research", p.slug);
  const fixturesDir = path.join(researchDir, "fixtures");
  const publicDir = path.join(ROOT, "public/software", p.slug);

  fs.mkdirSync(fixturesDir, { recursive: true });
  fs.mkdirSync(publicDir, { recursive: true });
  writeText(path.join(publicDir, ".gitkeep"), "");

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
  writeJson(path.join(researchDir, "jobs.json"), []);
  writeJson(path.join(researchDir, "snapshots.json"), []);

  const assessment = buildAssessment(p);
  writeJson(
    path.join(ROOT, "src/data/editorial/assessments", `${p.slug}.json`),
    assessment,
  );
  writeJson(
    path.join(ROOT, "src/data/editorial/reviews", `${p.slug}.json`),
    buildReview(p, assessment.overallScore, assessment.criterionAssessments),
  );
}

function writeSeedSnippet(products) {
  const body = [
    `// Auto-generated by scripts/onboard-migration-crm-batch.mjs`,
    `// Append these soft({...}) entries into src/data/seed/software.ts before the closing ]; of softwareSeed.`,
    `// Do NOT paste blindly if slugs already exist — dedupe first.`,
    `// Prefer: node scripts/patch-software-seed-migration-crm.mjs`,
    ``,
    ...products.map(softSnippet),
    ``,
  ].join("\n");
  writeText(
    path.join(ROOT, "scripts/_migration-crm-seed-snippet.ts"),
    body,
  );
}

function parseWave() {
  const idx = process.argv.indexOf("--wave");
  const raw = idx >= 0 ? (process.argv[idx + 1] ?? "all") : "all";
  const wave = String(raw).toLowerCase();
  if (!["a", "b", "c", "all"].includes(wave)) {
    console.error(`Invalid --wave ${raw}. Use a|b|c|all.`);
    process.exit(1);
  }
  return wave;
}

function main() {
  const wave = parseWave();
  const selected =
    wave === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.wave === wave);

  // Always emit full snippet for all products (so patch helper has complete set)
  writeSeedSnippet(PRODUCTS);

  const written = [];
  for (const p of selected) {
    writeProduct(p);
    written.push(p.slug);
  }

  console.log(
    `Wrote onboarding artifacts for ${written.length} product(s) [wave=${wave}]:`,
  );
  for (const slug of written) {
    console.log(`  - ${slug}`);
  }
  console.log(
    `Seed snippet: scripts/_migration-crm-seed-snippet.ts (${PRODUCTS.length} soft entries)`,
  );
}

main();
