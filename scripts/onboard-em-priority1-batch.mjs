#!/usr/bin/env node
/**
 * Email Marketing Priority-1 credibility products (not yet onboarded):
 * Klaviyo, Brevo (Sendinblue), MailerLite.
 *
 * Usage: node scripts/onboard-em-priority1-batch.mjs
 * Idempotent — overwrites product research / editorial packs.
 *
 * Does NOT auto-publish beyond writing approved editorial JSON.
 * Affiliate economics never enter scores.
 * Grounded pricing verified 2026-08-17 from official / help pages
 * (note dynamic pricing sliders — floors quoted as "from").
 *
 * Schema notes (match EM Wave-1 / SI Priority-1):
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
    slug: "klaviyo",
    name: "Klaviyo",
    company: "Klaviyo, Inc.",
    website: "https://www.klaviyo.com",
    domain: "klaviyo.com",
    pricingUrl: "https://www.klaviyo.com/pricing",
    aliases: [],
    membershipRole: "primary",
    softShortDescription:
      "Ecommerce email + SMS platform with Shopify-native flows, revenue attribution, and active-profile billing.",
    shortDescription:
      "Klaviyo is an ecommerce-focused email and SMS marketing platform with catalog-aware flows, segmentation, and revenue attribution — commonly used by Shopify and other online retailers. Pricing is primarily based on active profiles (and messaging credits for SMS); a free plan and paid Email / Email + SMS ladders are published with dynamic bands.",
    vendorPositioning:
      "Ecommerce email and SMS to grow revenue with personalized flows, campaigns, and attribution — positioned as the default owned-channel stack for online brands (Shopify-native emphasis).",
    pricingModel: "freemium",
    hasFreePlan: true,
    hasFreeTrial: false,
    startingPriceMonthly: 20,
    pricingNotes:
      "Verified 2026-08-17 from klaviyo.com/pricing (dynamic slider — confirm live bands). Free: up to 250 active profiles, 500 emails/mo, with mobile messaging credits included on free. Paid Email commonly cited from ~$20/mo at 251–500 active profiles. Email + SMS commonly from ~$35/mo at entry. Pricing scales by active profiles; exact package dollars require the live pricing slider. Taxes may apply.",
    fixturePlans: [
      "PLAN free: name=Free; isFree=true; maxActiveProfiles=250; maxEmailsMonthly=500",
      "PLAN email: name=Email; amount=20; currency=USD; interval=month; entryBand=251-500 active profiles; fromFloor=true",
      "PLAN email-sms: name=Email + SMS; amount=35; currency=USD; interval=month; entryBand=entry profiles; fromFloor=true",
    ],
    enrichmentPlans: [
      freePlan("free", "Free", {
        limits: { maxActiveProfiles: 250, maxEmailSendsMonthly: 500 },
        description:
          "Free up to 250 active profiles / 500 emails/mo; mobile messaging credits included on free (confirm live).",
      }),
      planFlat("email", "Email", 20, {
        highlighted: true,
        limits: { includedActiveProfilesEntry: 500 },
        description:
          "From ~$20/mo at 251–500 active profiles (research floor). Scales by active profiles — confirm live pricing slider.",
      }),
      planFlat("email-sms", "Email + SMS", 35, {
        limits: { includedActiveProfilesEntry: 500 },
        description:
          "From ~$35/mo at entry profile bands (research floor). Email + SMS packaging; confirm live slider and SMS credit rates.",
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
      forms: "supported",
      "transactional-email": "limited",
      analytics: "supported",
      "deliverability-tools": "supported",
      "ai-content-generation": "supported",
    },
    aiLines: [
      "AI email-generation: supported",
      "AI assistant: supported",
      "AI recommendations: supported",
      "AI automation: supported",
    ],
    integrations: [
      { integrationSlug: "shopify", kind: "native" },
      { integrationSlug: "woocommerce", kind: "native" },
      { integrationSlug: "magento", kind: "native" },
      { integrationSlug: "bigcommerce", kind: "native" },
      { integrationSlug: "salesforce", kind: "zapier-style" },
    ],
    limitations: [
      "Active-profile billing can rise quickly as the store’s engaged customer base grows",
      "Exact paid-band dollars require the live pricing slider — floors are research estimates",
      "Less ideal as a simple newsletter-only ESP for non-ecommerce creators",
      "SMS costs and credit consumption need separate forecasting beyond Email plan floors",
      "Not a full sales CRM of record — ecommerce lifecycle email/SMS center of gravity",
    ],
    limitationKinds: [
      "usage-cap",
      "other",
      "feature-unavailable",
      "requires-add-on",
      "feature-unavailable",
    ],
    scores: {
      "ease-of-use": 7,
      "email-creation": 8,
      automation: 9,
      segmentation: 9,
      analytics: 9,
      "deliverability-tooling": 7,
      integrations: 9,
      scalability: 8,
      "value-for-money": 5,
      "ai-capabilities": 8,
    },
    scoreRationales: {
      "ease-of-use":
        "Strong for ecommerce marketers familiar with flows/segments; learning curve rises vs simple newsletter ESPs because of profile, catalog, and SMS surfaces.",
      "email-creation":
        "First-party campaign and flow email builders with ecommerce templates are core — strong composition for retail senders, not primarily a design-agency ESP story.",
      automation:
        "Shopify-native and catalog-aware flows (welcome, abandoned cart, browse/post-purchase) are the category’s ecommerce automation benchmark among researched ESPs.",
      segmentation:
        "Behavioral, predictive, and ecommerce attribute segmentation are first-party strengths — deeper than typical SMB newsletter tools.",
      analytics:
        "Revenue attribution and ecommerce performance reporting are central to the product story — among the strongest analytics postures in this EM set.",
      "deliverability-tooling":
        "Authentication and deliverability guidance are present; not a specialist reputation-repair suite like InboxAlly.",
      integrations:
        "Deep ecommerce platform connectors (Shopify and peers) plus marketing stack hooks — integrations are a primary buying reason for online brands.",
      scalability:
        "Active-profile packaging scales with store growth; high-volume brands are a documented sweet spot, with cost governance as the trade-off.",
      "value-for-money":
        "Free rung exists, but paid Email from ~$20/mo and profile-based scaling make Klaviyo premium at growth — score reflects accessibility/transparency of cost at scale, not affiliate terms.",
      "ai-capabilities":
        "AI content and recommendations are marketed across campaigns/flows; score reflects documented AI assistance rather than a hands-on lab audit.",
    },
    bestFor: [
      "Ecommerce brands needing email + SMS with catalog-aware flows",
      "Shopify-centric teams prioritizing revenue attribution",
      "Growth-stage stores where lifecycle automation is the primary job",
    ],
    notIdealFor: [
      "Creators who only need a simple newsletter without ecommerce catalog data",
      "Buyers who need the lowest possible contact-based TCO at large list sizes",
      "Teams wanting a full sales CRM as the system of record",
    ],
    pros: [
      "Ecommerce-native flows and segmentation with strong Shopify fit",
      "Revenue attribution and analytics oriented to online retail",
      "Email + SMS in one owned-channel stack",
      "Free plan for very small active-profile bases",
      "Broad ecommerce platform integrations",
    ],
    cons: [
      "Active-profile pricing becomes expensive as engaged customers grow",
      "Live slider required for exact paid-band confirmation",
      "Overkill for non-ecommerce newsletter-only senders",
      "SMS credit economics need separate forecasting",
      "Not a sales CRM of record",
    ],
    keyFeatures: [
      "Ecommerce email campaigns and flows",
      "SMS messaging with shared profile data",
      "Behavioral and catalog-aware segmentation",
      "Revenue attribution analytics",
      "Shopify and major ecommerce integrations",
    ],
    pricingSummary:
      "Free: up to 250 active profiles / 500 emails/mo. Paid Email from ~$20/mo at 251–500 profiles; Email + SMS from ~$35/mo at entry (research floors 2026-08-17). Scales by active profiles — confirm live pricing slider.",
    whoShouldChoose:
      "Choose Klaviyo when ecommerce email + SMS with Shopify-native flows and revenue attribution are the primary jobs.",
    whoShouldConsiderAlternatives:
      "Compare ActiveCampaign for B2B/services automation depth, Brevo for send-based value pricing, Mailchimp for brand-familiar freemium, and Omnisend (when onboarded) for ecommerce multichannel alternatives.",
    alternativeSlugs: [
      "activecampaign",
      "mailchimp",
      "brevo",
      "getresponse",
    ],
    competitorSlugs: [
      "mailchimp",
      "activecampaign",
      "brevo",
      "mailerlite",
      "getresponse",
      "hubspot",
    ],
    comparableSlugs: ["activecampaign", "mailchimp", "brevo"],
    secondaryCategorySlugs: ["marketing", "ecommerce"],
    subcategorySlugs: [],
    useCaseSlugs: [
      "ecommerce-email",
      "marketing-automation",
      "newsletters",
      "lead-nurturing",
      "small-business-campaigns",
    ],
    teamTypeSlugs: ["marketing", "founders"],
    businessSizeSlugs: ["small-business", "mid-market", "enterprise"],
    officialVideos: [],
    sourcesExtra: [],
  },
  {
    slug: "brevo",
    name: "Brevo",
    company: "Brevo",
    website: "https://www.brevo.com",
    domain: "brevo.com",
    pricingUrl: "https://www.brevo.com/pricing/",
    aliases: ["Sendinblue", "Send in Blue"],
    membershipRole: "primary",
    softShortDescription:
      "Multi-channel email marketing with send-based pricing, a generous free plan, and CRM-lite tools — formerly Sendinblue.",
    shortDescription:
      "Brevo (formerly Sendinblue) is a multi-channel marketing platform centered on email, with automation, SMS, chat, and CRM-lite tools. Pricing is primarily send-volume based (not contact-count for email), with a forever-free plan and Starter/Standard/Professional ladders published.",
    vendorPositioning:
      "All-in-one digital marketing platform — email, SMS, chat, CRM — positioned for SMBs and growing teams that want multi-channel outreach with predictable send-based email pricing (rebranded from Sendinblue).",
    pricingModel: "freemium",
    hasFreePlan: true,
    hasFreeTrial: false,
    startingPriceMonthly: 9,
    pricingNotes:
      "Verified 2026-08-17 from brevo.com/pricing and help.brevo.com. Free forever: 300 emails/day, up to 100,000 contacts stored. Starter from $9/mo monthly / ~$8 annual — billed by email volume (from 5,000 emails/mo), not contacts. Standard from $18/mo — automation, A/B testing, landing pages. Professional from $499/mo. Enterprise custom. Confirm live volume bands and annual discounts on the pricing page.",
    fixturePlans: [
      "PLAN free: name=Free; isFree=true; maxEmailsDaily=300; maxContactsStored=100000",
      "PLAN starter: name=Starter; amount=9; currency=USD; interval=month; billing=email-volume; fromEmailsMonthly=5000",
      "PLAN standard: name=Standard; amount=18; currency=USD; interval=month; automation=true",
      "PLAN professional: name=Professional; amount=499; currency=USD; interval=month",
      "PLAN enterprise: name=Enterprise; contactSales=true",
    ],
    enrichmentPlans: [
      freePlan("free", "Free", {
        limits: { maxEmailSendsDaily: 300, maxContactsStored: 100000 },
        description:
          "Forever free: 300 emails/day; up to 100,000 contacts stored (research).",
      }),
      planFlat("starter", "Starter", 9, {
        limits: { includedEmailsMonthlyEntry: 5000 },
        description:
          "From $9/mo monthly (~$8 annual) — email-volume billing from 5,000 emails/mo; not contact-based.",
      }),
      planFlat("standard", "Standard", 18, {
        highlighted: true,
        limits: { includedEmailsMonthlyEntry: 5000 },
        description:
          "From $18/mo — automation, A/B testing, landing pages (research). Confirm live volume bands.",
      }),
      planFlat("professional", "Professional", 499, {
        description:
          "From $499/mo Professional tier (research). Confirm included volume and features live.",
      }),
      contactSalesPlan("enterprise", "Enterprise", {
        description: "Enterprise custom quote.",
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
      "transactional-email": "supported",
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
      { integrationSlug: "wordpress", kind: "native" },
      { integrationSlug: "woocommerce", kind: "native" },
      { integrationSlug: "hubspot", kind: "zapier-style" },
      { integrationSlug: "salesforce", kind: "zapier-style" },
    ],
    limitations: [
      "Free plan daily send cap (300/day) constrains frequent campaigners",
      "Advanced automation and A/B depth concentrate on Standard+",
      "Professional jumps to $499/mo — large step from Standard",
      "Multi-channel add-ons (SMS/WhatsApp) can change TCO beyond email floors",
      "CRM-lite is not a full sales CRM of record",
    ],
    limitationKinds: [
      "usage-cap",
      "plan-restriction",
      "other",
      "requires-add-on",
      "feature-unavailable",
    ],
    scores: {
      "ease-of-use": 8,
      "email-creation": 7,
      automation: 8,
      segmentation: 7,
      analytics: 7,
      "deliverability-tooling": 7,
      integrations: 7,
      scalability: 8,
      "value-for-money": 9,
      "ai-capabilities": 7,
    },
    scoreRationales: {
      "ease-of-use":
        "Approachable SMB multi-channel workspace with clear Free→Starter→Standard ladder; less ecommerce-specialist complexity than Klaviyo.",
      "email-creation":
        "Solid campaign/template builders for SMB senders; not the design-led peak of Campaign Monitor or the ecommerce template depth of Klaviyo.",
      automation:
        "Automation is a documented strength on Standard+ (workflows, A/B); Free/Starter gates keep the score tied to paid automation depth.",
      segmentation:
        "List and behavioral segmentation cover SMB lifecycle needs; depth trails Klaviyo-class ecommerce predictive audiences.",
      analytics:
        "Campaign and automation reporting are first-party documented; revenue attribution is lighter than ecommerce-specialist stacks.",
      "deliverability-tooling":
        "ESP authentication and deliverability practices are present; not a specialist placement-repair product.",
      integrations:
        "Ecommerce and common marketing connectors are documented; ecosystem breadth is competitive for SMB multi-channel stacks.",
      scalability:
        "Send-based packaging and high free contact storage scale differently than contact-tier ESPs — strong for high-contact / moderate-send use cases.",
      "value-for-money":
        "Free forever with 300 sends/day plus Starter from $9/mo on email volume is among the strongest published value postures in this EM set — affiliate economics excluded.",
      "ai-capabilities":
        "AI content assistance is marketed; score reflects documented assistance rather than unconstrained AI automation suites.",
    },
    bestFor: [
      "SMBs wanting send-based email pricing with a generous free plan",
      "EU/SMB buyers comparing multi-channel email + SMS/chat stacks",
      "Teams with large contact databases but moderate monthly send volume",
    ],
    notIdealFor: [
      "Ecommerce brands that need Klaviyo-depth catalog flows and revenue attribution as the primary job",
      "Buyers who need Professional features but cannot justify the $499/mo jump",
      "Teams that only want the simplest creator newsletter with no multi-channel surface",
    ],
    pros: [
      "Send-based pricing with Starter from $9/mo",
      "Forever-free plan with high contact storage",
      "Automation, A/B, and landing pages on Standard+",
      "Multi-channel path (email/SMS/chat/CRM-lite)",
      "Clear rebrand continuity from Sendinblue",
    ],
    cons: [
      "Free daily send cap limits high-frequency campaigns",
      "Automation depth gated behind Standard+",
      "Professional pricing jump is steep",
      "Ecommerce attribution trails Klaviyo-class specialists",
      "CRM-lite is not a full sales CRM",
    ],
    keyFeatures: [
      "Email campaigns with send-volume pricing",
      "Marketing automation on Standard+",
      "Landing pages and A/B testing",
      "SMS/chat multi-channel options",
      "CRM-lite contact management",
    ],
    pricingSummary:
      "Free forever (300 emails/day; up to 100k contacts stored). Starter from $9/mo (~$8 annual) by email volume from 5k emails/mo. Standard from $18/mo. Professional from $499/mo. Enterprise custom. Confirm live bands.",
    whoShouldChoose:
      "Choose Brevo when send-based pricing, a generous free plan, and multi-channel SMB email are the priority.",
    whoShouldConsiderAlternatives:
      "Compare MailerLite for simpler free-tier ease, GetResponse for all-in-one free-tier automation/LPs, Klaviyo for ecommerce depth, and ActiveCampaign for automation+CRM depth.",
    alternativeSlugs: [
      "mailerlite",
      "getresponse",
      "mailchimp",
      "klaviyo",
    ],
    competitorSlugs: [
      "mailchimp",
      "mailerlite",
      "getresponse",
      "klaviyo",
      "activecampaign",
      "hubspot",
    ],
    comparableSlugs: ["mailerlite", "getresponse", "mailchimp"],
    secondaryCategorySlugs: ["marketing"],
    subcategorySlugs: [],
    useCaseSlugs: [
      "newsletters",
      "marketing-automation",
      "small-business-campaigns",
      "lead-nurturing",
      "ecommerce-email",
    ],
    teamTypeSlugs: ["marketing", "founders"],
    businessSizeSlugs: ["micro", "small-business", "mid-market"],
    officialVideos: [],
    sourcesExtra: [
      {
        id: "brevo-help-pricing",
        url: "https://help.brevo.com/",
        title: "Brevo Help Center",
        domains: ["pricing", "limits", "plans"],
      },
    ],
  },
  {
    slug: "mailerlite",
    name: "MailerLite",
    company: "MailerLite",
    website: "https://www.mailerlite.com",
    domain: "mailerlite.com",
    pricingUrl: "https://www.mailerlite.com/pricing",
    aliases: [],
    membershipRole: "primary",
    softShortDescription:
      "Simple email marketing for SMBs and creators with a free tier and approachable Comfort/Power subscriber plans.",
    shortDescription:
      "MailerLite is an email marketing platform aimed at small businesses and creators, with campaigns, automation, landing pages, and websites. Pricing is subscriber-tiered with a free plan; paid Comfort and Power plans (renamed June 2026 from Growing Business / Advanced) publish entry floors at 500 subscribers.",
    vendorPositioning:
      "Easy email marketing for growing brands — drag-and-drop campaigns, automation, and sites with a free starting rung and clear paid upgrades.",
    pricingModel: "freemium",
    hasFreePlan: true,
    hasFreeTrial: false,
    startingPriceMonthly: 12,
    pricingNotes:
      "Verified 2026-08-17 from mailerlite.com/pricing. Plan rename noted June 16 2026: Growing Business → Comfort; Advanced → Power. Free: up to 250 subscribers, 2,500 emails/30 days, 2 seats. Comfort from $12/mo at 500 subscribers. Power from $25/mo at 500 subscribers. Enterprise custom (200k+). ~10% annual discount. Confirm live subscriber bands on the pricing page.",
    fixturePlans: [
      "PLAN free: name=Free; isFree=true; maxSubscribers=250; maxEmailsPer30Days=2500; seats=2",
      "PLAN comfort: name=Comfort; amount=12; currency=USD; interval=month; entryBand=500 subscribers; formerly=Growing Business",
      "PLAN power: name=Power; amount=25; currency=USD; interval=month; entryBand=500 subscribers; formerly=Advanced",
      "PLAN enterprise: name=Enterprise; contactSales=true; fromSubscribers=200000",
    ],
    enrichmentPlans: [
      freePlan("free", "Free", {
        limits: {
          maxContacts: 250,
          maxEmailSendsPer30Days: 2500,
          seats: 2,
        },
        description:
          "Free up to 250 subscribers / 2,500 emails per 30 days / 2 seats.",
      }),
      planFlat("comfort", "Comfort", 12, {
        highlighted: true,
        limits: { includedContactsEntry: 500 },
        description:
          "From $12/mo at 500 subscribers (formerly Growing Business). ~10% annual discount.",
      }),
      planFlat("power", "Power", 25, {
        limits: { includedContactsEntry: 500 },
        description:
          "From $25/mo at 500 subscribers (formerly Advanced). Confirm live feature gates vs Comfort.",
      }),
      contactSalesPlan("enterprise", "Enterprise", {
        description: "Enterprise custom for ~200k+ subscribers (research).",
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
      { integrationSlug: "shopify", kind: "native" },
      { integrationSlug: "wordpress", kind: "native" },
      { integrationSlug: "woocommerce", kind: "native" },
      { integrationSlug: "stripe", kind: "native" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    limitations: [
      "Free caps at 250 subscribers / 2,500 emails per 30 days",
      "Automation and segmentation depth trail Klaviyo and ActiveCampaign",
      "Plan rename (Comfort/Power) may confuse older comparison content — use new names",
      "AI assistance is lighter than AI-forward ESP peers",
      "Not ideal for complex B2B multi-product marketing automation / CRM-heavy stacks",
    ],
    limitationKinds: [
      "usage-cap",
      "feature-unavailable",
      "other",
      "other",
      "feature-unavailable",
    ],
    scores: {
      "ease-of-use": 9,
      "email-creation": 8,
      automation: 7,
      segmentation: 7,
      analytics: 6,
      "deliverability-tooling": 7,
      integrations: 7,
      scalability: 6,
      "value-for-money": 9,
      "ai-capabilities": 6,
    },
    scoreRationales: {
      "ease-of-use":
        "MailerLite’s primary brand story is simple, approachable email for SMBs/creators — among the highest ease scores in this EM set.",
      "email-creation":
        "Drag-and-drop campaigns and templates are core strengths for newsletter and promo sends; design depth is strong for SMB without Campaign Monitor’s agency-first story.",
      automation:
        "Automations are solid for SMB lifecycle email on paid plans; depth is intentionally lighter than ActiveCampaign/Klaviyo-class journeys.",
      segmentation:
        "Subscriber and behavior segments cover common SMB needs; predictive/ecommerce catalog depth trails Klaviyo.",
      analytics:
        "Campaign analytics cover opens/clicks and core performance; not a deep ecommerce revenue-attribution suite.",
      "deliverability-tooling":
        "Standard ESP deliverability practices and authentication guidance; not a specialist reputation-repair product.",
      integrations:
        "Creator/ecommerce and Zapier-style connectors are documented; ecosystem is competitive for SMB, narrower than Mailchimp-class breadth.",
      scalability:
        "Subscriber tiers scale with Comfort/Power/Enterprise, but the product is positioned for SMB/creator growth rather than enterprise MAP complexity.",
      "value-for-money":
        "Free tier plus Comfort from $12/mo at 500 subscribers is strong published value for simple ESP buyers — affiliate economics excluded.",
      "ai-capabilities":
        "Limited AI assistance relative to AI-forward peers; score reflects lighter documented AI surface.",
    },
    bestFor: [
      "SMBs and creators wanting simple email with a free starting rung",
      "Teams comparing Mailchimp for easier/cheaper freemium email",
      "Buyers who want landing pages/sites bundled without deep MAP complexity",
    ],
    notIdealFor: [
      "Ecommerce brands needing deep catalog-aware automation (prefer Klaviyo)",
      "Marketing-led teams whose primary job is multi-step automation + CRM (prefer ActiveCampaign)",
      "Enterprises needing MAP-grade governance and complex multi-brand stacks",
    ],
    pros: [
      "High ease-of-use for SMB/creator email",
      "Free plan plus Comfort from $12/mo at 500 subscribers",
      "Landing pages and sites bundled with email",
      "Clear Comfort/Power paid ladder after 2026 rename",
      "Strong value for simple campaign programs",
    ],
    cons: [
      "Automation/segmentation trail automation-first and ecommerce-first ESPs",
      "Free subscriber/send caps are tighter than some peers’ free rungs",
      "AI assistance is limited",
      "Analytics are lighter than revenue-attribution specialists",
      "Not a full CRM or ecommerce CDP",
    ],
    keyFeatures: [
      "Drag-and-drop email campaigns",
      "Automation workflows for SMB journeys",
      "Landing pages and websites",
      "Subscriber-tier Free / Comfort / Power pricing",
      "Forms and signup tools",
    ],
    pricingSummary:
      "Free (250 subscribers / 2,500 emails per 30 days / 2 seats). Comfort from $12/mo and Power from $25/mo at 500 subscribers (~10% annual off). Enterprise custom (200k+). Confirm live bands.",
    whoShouldChoose:
      "Choose MailerLite when you want simple, high-ease email marketing with a free tier and approachable Comfort/Power pricing.",
    whoShouldConsiderAlternatives:
      "Compare Brevo for send-based value and multi-channel breadth, Mailchimp for brand-familiar freemium, GetResponse for deeper all-in-one automation/LPs, and Klaviyo for ecommerce depth.",
    alternativeSlugs: [
      "mailchimp",
      "brevo",
      "getresponse",
      "aweber",
    ],
    competitorSlugs: [
      "mailchimp",
      "brevo",
      "getresponse",
      "aweber",
      "klaviyo",
      "activecampaign",
    ],
    comparableSlugs: ["mailchimp", "brevo", "aweber"],
    secondaryCategorySlugs: ["marketing"],
    subcategorySlugs: [],
    useCaseSlugs: [
      "newsletters",
      "small-business-campaigns",
      "lead-nurturing",
      "ecommerce-email",
      "marketing-automation",
    ],
    teamTypeSlugs: ["marketing", "founders"],
    businessSizeSlugs: ["micro", "small-business"],
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
      notes: `First-party product positioning for ${p.name} (email-marketing Priority-1 onboarding 2026-08-17).`,
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
    purpose: `Official ${p.name} product video for email-marketing Priority-1 onboarding`,
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
      rationale: `${p.name} fit for ${businessSizeSlug} marketing teams from first-party positioning and email-marketing Priority-1 research${
        p.membershipRole === "adjacent" ? " (adjacent tool, not core ESP)" : ""
      }.`,
      isEditorial: true,
    };
  });

  const notesParts = [
    `Email-marketing Priority-1 onboarding enrichment from first-party research ${VERIFIED_AT}. handsOnTesting=false.`,
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
    notes: "Email-marketing Priority-1 first-party research extract",
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
    editorialNotes: `Email-marketing Priority-1 batch. Approved on email-marketing-editorial v1.0.0. membershipRole=${p.membershipRole}. handsOnTesting=false. Affiliate economics excluded.${
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
          "Email-marketing Priority-1 onboarding; approved EM criteria; handsOnTesting=false",
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
      id: `job-${p.slug}-email-marketing-priority1`,
      productSlug: p.slug,
      status: "completed",
      createdAt: VERIFIED_AT,
      completedAt: VERIFIED_AT,
      notes: `Email-marketing Priority-1 batch; membershipRole=${p.membershipRole}`,
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
  const out = path.join(ROOT, "scripts/_em-priority1-seed-snippet.ts");
  const body = `// Auto-generated by scripts/onboard-em-priority1-batch.mjs
// Append into src/data/seed/software.ts before the closing ]; of softwareSeed.
// Priority-1 non-affiliate credibility ESPs: klaviyo, brevo, mailerlite.

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
  writeJson(path.join(ROOT, "scripts/_em-priority1-official-videos.json"), videos);
  console.log(`✓ video specs → ${videos.length} videos`);
}

function main() {
  for (const p of PRODUCTS) writeProduct(p);
  writeSeedSnippet(PRODUCTS);
  writeVideoImportSpec(PRODUCTS);
  console.log("\nNext:");
  console.log("  1. Patch software.ts with scripts/_em-priority1-seed-snippet.ts");
  console.log("  2. Update email-marketing.ts seedProductSlugs + best.ts + comparisons.ts");
  console.log("  3. Generate brand logos under public/brands/");
  console.log("  4. npx tsx scripts/product-guide-visuals.ts --em");
  console.log("  5. Content quality audit — target ≥75");
  console.log("  6. No WordPress auto-publish");
}

main();
