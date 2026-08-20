#!/usr/bin/env node
/**
 * Business Communications Wave 1+2 onboarding:
 * Aircall, CallHippo, KrispCall, Freshcaller, Wati, Zenzap (BC primary)
 * plus Fastmail and SaneBox (adjacent, not phone/messaging peers).
 *
 * Usage: node scripts/onboard-bc-wave1-batch.mjs
 * Idempotent — overwrites product research / editorial packs.
 *
 * Does NOT auto-publish beyond writing approved editorial JSON.
 * Affiliate economics never enter scores.
 *
 * Research grounding (retrieved 2026-08-17, first-party pages):
 * - aircall.io/pricing — Essentials/Professional 3-licence minimum, Custom 25-licence
 *   minimum, Power Dialer + Salesforce CTI on Professional, AI Assist / AI Voice Agents /
 *   Analytics+ / WhatsApp as priced add-ons. Seat dollars render client-side, so the
 *   $30 / $50 annual per-licence floors are recorded at medium confidence.
 * - callhippo.com/pricing — Office Phone System: Basic $0 (first 6 months), Starter $18
 *   (min 2 users), Professional $30, Ultimate $42 per user/month billed annually; separate
 *   call-centre ladder (Bronze/Silver/Platinum); AI Copilot add-on $10/user/month;
 *   fair-usage policy prohibits auto/predictive dialing on the Office Phone System.
 * - freshworks.com/freshcaller-cloud-pbx/pricing — Free $0 + pay/min, Growth $15,
 *   Pro $39, Enterprise $69 per agent/month billed annually; 14-day trial; day passes.
 * - krispcall.com/pricing — Essential $15/user ($12 annual, up to 5 users),
 *   Standard $40/user ($32 annual, up to 50 users), Enterprise custom; calls and SMS are
 *   pay-as-you-go; no free plan, 14-day refund. Page render was blocked to direct fetch,
 *   so plan dollars are medium confidence from the official pricing page content.
 * - wati.io/pricing — Growth (1 channel, 3 users, 15k broadcasts), Pro (5 users,
 *   +$24/user, unlimited broadcasts), Business (5 users, +$69/user, volume discounts),
 *   Enterprise; 7-day free trial; per-message charges on top of platform fee. Platform-fee
 *   dollars render client-side by region — bands recorded at low confidence.
 * - zenzap.co/pricing — Free $0, Pro $3/user/month yearly ($4 monthly), Business+
 *   $8/user/month yearly ($10 monthly), Enterprise custom; flat-rate team bands.
 * - fastmail.com/pricing — Business Basic $3, Standard $5, Professional $9 per user/month
 *   on annual billing; 30-day trial.
 * - sanebox.com help centre + pricing — Snack / Lunch / Dinner tiers, per-person billing,
 *   1 / 2 / 4 mailbox caps, free trial (7 days on help centre, 14 days on signup surfaces).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const VERIFIED_AT = "2026-08-17T09:00:00.000Z";
const PUBLISHED_AT = "2026-08-17T00:00:00.000Z";

const RELATED_GUIDE_PATHS = ["/categories/business-communications/"];

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
  "security-compliance",
];

/** Exact criterionSlug values from the business-communications editorialMethodology. */
const BC_CRITERIA = [
  "ease-of-use",
  "voice-messaging-quality",
  "routing-workflows",
  "integrations",
  "analytics",
  "outbound-tools",
  "scalability",
  "value-for-money",
  "ai-capabilities",
];

/** Weights from the category definition (sum = 100). */
const BC_CRITERION_WEIGHTS = {
  "ease-of-use": 12,
  "voice-messaging-quality": 15,
  "routing-workflows": 14,
  integrations: 14,
  analytics: 10,
  "outbound-tools": 8,
  scalability: 9,
  "value-for-money": 10,
  "ai-capabilities": 8,
};

/** Exact feature slugs from the business-communications category definition. */
const BC_FEATURES = [
  "cloud-phone",
  "call-routing",
  "call-recording",
  "power-dialer",
  "sms-messaging",
  "whatsapp-business",
  "shared-inbox",
  "team-messaging",
  "video-meetings",
  "crm-cti",
  "analytics-reporting",
  "ai-assistance",
  "unified-inbox",
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

/** Per-seat plan quoted as monthly-equivalent on annual billing. */
function planPerSeatAnnual(slug, name, monthlyPerSeat, extra = {}) {
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
        kind: "per-seat",
        amountPerSeat: monthlyPerSeat,
        currency: "USD",
        interval: "year",
        amountPeriod: "month",
        ...(extra.minimumSeats ? { minimumSeats: extra.minimumSeats } : {}),
        ...(extra.maximumSeats ? { maximumSeats: extra.maximumSeats } : {}),
      },
    ],
    ...(extra.description ? { description: extra.description } : {}),
    ...(extra.limits ? { limits: extra.limits } : {}),
  };
}

/** Flat platform / account plan quoted as monthly-equivalent on annual billing. */
function planFlatAnnual(slug, name, monthly, extra = {}) {
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
        interval: "year",
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
    slug: "aircall",
    name: "Aircall",
    company: "Aircall",
    website: "https://aircall.io",
    domain: "aircall.io",
    pricingUrl: "https://aircall.io/pricing/",
    aliases: [],
    membershipRole: "primary",
    jobCluster: "cloud-phone",
    softShortDescription:
      "Mid-market cloud phone and customer-conversation platform with deep CRM/helpdesk CTI, IVR, power dialer on Professional, and paid AI add-ons — 3-licence minimum.",
    shortDescription:
      "Aircall is a cloud business phone and customer-conversation platform for sales and support teams, with IVR and call routing, call recording, SMS/MMS, 250+ integrations including a Salesforce CTI, and Power Dialer on the Professional plan. Licences are sold with a 3-licence minimum on Essentials and Professional (25 on Custom), and AI Assist, AI Voice Agents, Analytics+ and WhatsApp are priced add-ons.",
    vendorPositioning:
      "The AI-powered platform for customer conversations — unify conversations, context, AI, and automation so every interaction drives growth.",
    pricingModel: "subscription",
    hasFreePlan: false,
    hasFreeTrial: true,
    startingPriceMonthly: 30,
    startingPriceConfidence: "medium",
    pricingNotes:
      "Verified 2026-08-17 from aircall.io/pricing. Plan structure is first-party: Essentials and Professional both require a 3-licence minimum with 1 local or toll-free number included, unlimited inbound and unlimited simultaneous outbound calls, and annual billing discounted 25% vs monthly; Custom requires a 25-licence minimum. Seat dollars are rendered client-side on the pricing page, so the widely published floors — Essentials ~$30/licence/month and Professional ~$50/licence/month on annual billing — are recorded at medium confidence. AI Voice Agents (per minute, 50 free minutes/account/month), AI Assist, AI Assist Pro, Analytics+ and WhatsApp in Aircall are separately priced add-ons. Domestic SMS/MMS rates for the US, Canada, UK, Australia, France and Germany are quote-based.",
    fixturePlans: [
      "PLAN essentials: name=Essentials; amountPerSeat=30; currency=USD; interval=year; amountPeriod=month; minimumSeats=3; fromFloor=true",
      "PLAN professional: name=Professional; amountPerSeat=50; currency=USD; interval=year; amountPeriod=month; minimumSeats=3; fromFloor=true",
      "PLAN custom: name=Custom; contactSales=true; minimumSeats=25",
    ],
    enrichmentPlans: [
      planPerSeatAnnual("essentials", "Essentials", 30, {
        minimumSeats: 3,
        hasFreeTrial: true,
        limits: {
          minimumLicences: 3,
          maxTeams: 3,
          includedNumbers: 1,
          callRecordingRetention: "up to 1 year on request",
          analyticsHistoryMonths: 6,
        },
        description:
          "From ~$30/licence/month on annual billing (research floor; page renders prices client-side). 3-licence minimum, 250+ integrations, IVR, call recording, click-to-dial, SMS/MMS, unlimited simultaneous outbound calls.",
      }),
      planPerSeatAnnual("professional", "Professional", 50, {
        minimumSeats: 3,
        highlighted: true,
        hasFreeTrial: true,
        limits: {
          minimumLicences: 3,
          maxTeams: "unlimited",
          includedNumbers: 1,
          analyticsHistoryMonths: 6,
        },
        description:
          "From ~$50/licence/month on annual billing (research floor). Adds Salesforce CTI, advanced analytics and live monitoring, smart routing and queue callback, Power Dialer and Voicemail Drop, plus all AI Assist features.",
      }),
      contactSalesPlan("custom", "Custom", {
        limits: { minimumLicences: 25 },
        description:
          "Custom package with a 25-licence minimum: custom onboarding, API developer support, SLA, SSO, unlimited Analytics+ history.",
      }),
    ],
    featureOverrides: {
      "cloud-phone": "supported",
      "call-routing": "supported",
      "call-recording": "supported",
      "power-dialer": "higher-plan-only",
      "sms-messaging": "supported",
      "whatsapp-business": "add-on",
      "shared-inbox": "limited",
      "team-messaging": "limited",
      "video-meetings": "not-supported",
      "crm-cti": "supported",
      "analytics-reporting": "supported",
      "ai-assistance": "add-on",
      "unified-inbox": "limited",
    },
    aiLines: [
      "AI transcription: add-on",
      "AI summaries: add-on",
      "AI assistant: add-on",
      "AI automation: add-on",
    ],
    integrations: [
      { integrationSlug: "salesforce", kind: "native", notes: "Salesforce CTI on Professional; Aircall for Salesforce Voice available" },
      { integrationSlug: "hubspot", kind: "native" },
      { integrationSlug: "pipedrive", kind: "native" },
      { integrationSlug: "zendesk", kind: "native" },
      { integrationSlug: "intercom", kind: "native" },
      { integrationSlug: "slack", kind: "native" },
    ],
    limitations: [
      "3-licence minimum on Essentials and Professional (25 on Custom) — solo operators and 1–2 person teams overpay",
      "Power Dialer, Voicemail Drop, Salesforce CTI, smart routing and queue callback are Professional-only",
      "AI Assist, AI Voice Agents, Analytics+ and WhatsApp are separately priced add-ons on top of licence fees",
      "Analytics history is capped at 6 months unless you buy Analytics+ (unlimited on Custom)",
      "Domestic SMS/MMS rates in major markets are quote-based rather than published",
      "No native team chat or video meeting product — Aircall is a voice-and-messaging layer, not a workspace suite",
    ],
    limitationKinds: [
      "plan-restriction",
      "plan-restriction",
      "requires-add-on",
      "usage-cap",
      "other",
      "feature-unavailable",
    ],
    scores: {
      "ease-of-use": 8,
      "voice-messaging-quality": 9,
      "routing-workflows": 9,
      integrations: 10,
      analytics: 8,
      "outbound-tools": 8,
      scalability: 8,
      "value-for-money": 5,
      "ai-capabilities": 8,
    },
    scoreRationales: {
      "ease-of-use":
        "Aircall is packaged for fast self-serve activation — softphone apps for desktop, Android and iOS, click-to-dial, and an admin dashboard that non-technical ops owners can configure. Reviewer quotes on the first-party pricing page emphasise fast implementation for teams of 15+ users. Score reflects documented setup posture, not a hands-on lab test.",
      "voice-messaging-quality":
        "First-party plan tables document unlimited inbound and internal calls, unlimited simultaneous outbound calls, a local or toll-free number included per plan, and paid numbers in additional countries — the strongest published voice envelope in this Wave-1 phone cluster. SMS/MMS is included but rate-quoted in major markets.",
      "routing-workflows":
        "IVR, call recording and business-hours handling are on Essentials; Professional adds smart routing, manual and automated queue callback, mandatory call tagging and live monitoring. That is contact-centre-grade routing depth without moving to a separate CCaaS product.",
      integrations:
        "250+ integrations plus API access on Essentials, a dedicated Salesforce CTI and Aircall for Salesforce Voice on Professional, and native CRM/helpdesk connectors (HubSpot, Pipedrive, Zendesk, Intercom, Slack). CRM/CTI depth is Aircall’s clearest differentiator against SMB dialers.",
      analytics:
        "Basic analytics on Essentials, basic plus advanced analytics and live monitoring on Professional, with hourly heatmaps, agent deep-dives and unlimited history in the Analytics+ add-on. Score is held at 8 because unlimited history is an add-on or Custom-only.",
      "outbound-tools":
        "Power Dialer and Voicemail Drop are documented on Professional, which covers structured outbound sales motions, but Aircall is not a parallel/predictive dialer product for high-volume boiler-room dialing.",
      scalability:
        "Licence-based growth with unlimited teams on Professional, a 25-licence Custom tier with SLA and SSO, and multi-country numbers support real expansion; the 3-licence floor and add-on stack are the friction points at the bottom and top of the range.",
      "value-for-money":
        "Essentials from ~$30/licence/month on annual billing with a 3-licence minimum means a realistic entry commitment near $90/month before AI, analytics or WhatsApp add-ons — materially above CallHippo, KrispCall or Freshcaller entry tiers. The capability set justifies the premium for mid-market CTI buyers, but transparency and accessibility of cost are weaker. Affiliate economics excluded.",
      "ai-capabilities":
        "AI Voice Agents (autonomous handling, live transfer with context, in-call actions, CRM logging), AI Assist (summaries, topics, sentiment, call scoring) and AI Assist Pro (live transcription, playbooks, live prompt) are first-party documented with 50 free voice-agent minutes per account per month — strong AI surface, but priced as add-ons rather than included.",
    },
    bestFor: [
      "Mid-market sales and support teams that need CRM/helpdesk CTI as a primary buying criterion",
      "Teams running inbound queues and IVR alongside outbound calling in one phone system",
      "Salesforce, HubSpot or Zendesk shops that want click-to-dial and bidirectional call logging out of the box",
    ],
    notIdealFor: [
      "Solo operators and 1–2 seat teams blocked by the 3-licence minimum",
      "Budget-first buyers who need the lowest per-seat entry price",
      "Teams that expect AI summaries, deep analytics history or WhatsApp included in the base licence",
    ],
    pros: [
      "250+ integrations and API access with a dedicated Salesforce CTI on Professional",
      "IVR, smart routing and queue callback cover real inbound support workflows",
      "Power Dialer and Voicemail Drop for outbound sales on Professional",
      "Unlimited inbound and unlimited simultaneous outbound calling documented first-party",
      "Mature AI surface: AI Voice Agents, AI Assist and AI Assist Pro with free monthly voice-agent minutes",
    ],
    cons: [
      "3-licence minimum makes it the wrong shape for very small teams",
      "Premium entry price versus CallHippo, KrispCall and Freshcaller",
      "AI, Analytics+ and WhatsApp are add-ons that inflate real TCO",
      "Analytics history capped at 6 months without Analytics+",
      "No team chat or video meetings — needs a separate collaboration tool",
    ],
    keyFeatures: [
      "Cloud phone with local and toll-free numbers",
      "IVR, smart routing and queue callback",
      "Call recording with extended retention",
      "Power Dialer and Voicemail Drop (Professional)",
      "Salesforce CTI and 250+ integrations",
      "AI Voice Agents and AI Assist add-ons",
    ],
    pricingSummary:
      "Essentials from ~$30/licence/month and Professional from ~$50/licence/month on annual billing (25% cheaper than monthly), both with a 3-licence minimum; Custom is quote-based with a 25-licence minimum. Research floors as of 2026-08-17 — aircall.io/pricing renders seat prices client-side, so confirm live. AI Assist, AI Voice Agents, Analytics+ and WhatsApp in Aircall are separately priced add-ons, and domestic SMS/MMS rates are quoted on request.",
    whoShouldChoose:
      "Choose Aircall when CRM/helpdesk CTI depth, IVR routing and outbound dialing must live in one mid-market phone system and you can commit to at least three licences.",
    whoShouldConsiderAlternatives:
      "Compare CallHippo for SMB entry pricing without a 3-seat floor, KrispCall for the cheapest global number footprint, Freshcaller if you are standardising on Freshworks, and Kixie if the dialer is the primary job inside an existing CRM.",
    alternativeSlugs: ["callhippo", "krispcall", "freshcaller", "kixie"],
    competitorSlugs: ["callhippo", "krispcall", "freshcaller", "kixie"],
    comparableSlugs: ["callhippo", "krispcall", "freshcaller"],
    secondaryCategorySlugs: ["customer-service"],
    subcategorySlugs: [],
    useCaseSlugs: ["sales-engagement", "outbound-sales", "customer-follow-up"],
    teamTypeSlugs: ["sales", "customer-success", "operations"],
    businessSizeSlugs: ["small-business", "mid-market"],
    officialVideos: [],
    sourcesExtra: [
      {
        id: "aircall-ai-products",
        url: "https://aircall.io/products/ai/",
        title: "Aircall AI",
        domains: ["ai-capabilities", "features"],
      },
      {
        id: "aircall-call-recording",
        url: "https://aircall.io/call-center-software-features/call-recording/",
        title: "Aircall Call Recording",
        domains: ["features", "limits"],
      },
      {
        id: "aircall-business-text",
        url: "https://aircall.io/call-center-software-features/business-text-messaging/",
        title: "Aircall Business Text Messaging",
        domains: ["features", "limits"],
      },
      {
        id: "aircall-whatsapp",
        url: "https://aircall.io/products/whatsapp-in-aircall/",
        title: "WhatsApp in Aircall",
        domains: ["features", "pricing"],
      },
    ],
  },
  {
    slug: "callhippo",
    name: "CallHippo",
    company: "CallHippo",
    website: "https://callhippo.com",
    domain: "callhippo.com",
    pricingUrl: "https://callhippo.com/pricing/",
    aliases: [],
    membershipRole: "primary",
    jobCluster: "cloud-phone",
    softShortDescription:
      "SMB cloud phone system with a $0 starter rung, Starter from $18/user/month annual (2-user minimum), call recording and IVR from Professional, plus a separate call-centre plan ladder.",
    shortDescription:
      "CallHippo is an SMB-focused cloud phone system sold as two ladders: an Office Phone System (Basic, Starter, Professional, Ultimate) for day-to-day business calling and a scaled call-centre ladder (Bronze, Silver, Platinum) for high-volume teams. Entry pricing is materially lower than Aircall with only a 2-user minimum on Starter, but call recording, multilingual IVR and CRM integrations start on Professional, and AI is a paid Copilot add-on.",
    vendorPositioning:
      "Core calling for business teams — a reliable, affordable business phone system for small teams, with a scaled call-centre ladder for growing operations that need control and visibility.",
    pricingModel: "freemium",
    hasFreePlan: true,
    hasFreeTrial: true,
    trialDays: 10,
    startingPriceMonthly: 18,
    pricingNotes:
      "Verified 2026-08-17 from callhippo.com/pricing. Office Phone System (billed annually, per user/month): Basic $0 — free for the first 6 months from signup, after which an upgrade to Starter is required; Starter $18 with a 2-user minimum, 1,000 US/CA calling minutes and 100 SMS; Professional $30 with unlimited US/CA minutes, 500 SMS, call recording, multilingual IVR, cascading distribution and reports; Ultimate $42 with 1,000 SMS, multilevel IVR, smart DID routing, SSO and custom integrations; Enterprise is quote-based with a 50-user minimum. A separate call-centre ladder (Bronze / Silver / Platinum / Enterprise) adds supervisor tooling, call barge/whisper and compliance recording — its USD figures render by region, so treat them as unconfirmed. AI Copilot is a $10/user/month add-on. A one-time $20 account setup fee applies for SMS services, calling is metered ($0.25/min on some rate cards) and the fair-usage policy prohibits auto/predictive dialing on the Office Phone System. 10-day free trial.",
    fixturePlans: [
      "PLAN basic: name=Basic; isFree=true; freeMonths=6; payForNumbersOnly=true",
      "PLAN starter: name=Starter; amountPerSeat=18; currency=USD; interval=year; amountPeriod=month; minimumSeats=2",
      "PLAN professional: name=Professional; amountPerSeat=30; currency=USD; interval=year; amountPeriod=month",
      "PLAN ultimate: name=Ultimate; amountPerSeat=42; currency=USD; interval=year; amountPeriod=month",
      "PLAN enterprise: name=Enterprise; contactSales=true; minimumSeats=50",
    ],
    enrichmentPlans: [
      freePlan("basic", "Basic", {
        limits: {
          freeMonthsFromSignup: 6,
          payOnlyForNumbers: true,
          whatsappBusinessApi: true,
        },
        description:
          "$0/user/month — free for the first 6 months from signup, then an upgrade to Starter is required. Calling, voicemail, click-to-dial, SMS/MMS, WhatsApp Business API and desktop/mobile apps; you pay only for numbers and usage.",
      }),
      planPerSeatAnnual("starter", "Starter", 18, {
        minimumSeats: 2,
        hasFreeTrial: true,
        trialDays: 10,
        limits: {
          includedCallingMinutesUsCa: 1000,
          includedSmsMonthly: 100,
          callLogRetentionMonths: 1,
        },
        description:
          "$18/user/month billed annually with a 2-user minimum. 1,000 US/CA calling minutes, 100 SMS, forward-to-device, ring all devices, SMS templates, omnichannel inbox, basic report analytics, Zapier/Slack/webhooks.",
      }),
      planPerSeatAnnual("professional", "Professional", 30, {
        highlighted: true,
        hasFreeTrial: true,
        trialDays: 10,
        limits: {
          callingMinutesUsCa: "unlimited",
          includedSmsMonthly: 500,
          callLogRetention: "lifetime",
        },
        description:
          "$30/user/month billed annually. Unlimited US/CA minutes, 500 SMS, call recording, multilingual IVR, cascading call distribution, reports/analytics, AI voicemail transcription, role-based access, HubSpot/Salesforce/Pipedrive/Zoho integrations.",
      }),
      planPerSeatAnnual("ultimate", "Ultimate", 42, {
        hasFreeTrial: true,
        trialDays: 10,
        limits: {
          callingMinutesUsCa: "unlimited",
          includedSmsMonthly: 1000,
        },
        description:
          "$42/user/month billed annually. Adds smart DID routing, multilevel IVR, holiday routing, CRM-based VIP routing, SSO, custom integrations, dedicated account manager and 24×7 phone support.",
      }),
      contactSalesPlan("enterprise", "Enterprise", {
        limits: {
          minimumUsers: 50,
          unlimitedCallingCountries: 48,
        },
        description:
          "Quote-based with a 50-user minimum: unlimited calling to 48 countries, SLA, WhatsApp Business API, custom data storage/API usage, speech analytics or CallHippo AI included.",
      }),
    ],
    featureOverrides: {
      "cloud-phone": "supported",
      "call-routing": "higher-plan-only",
      "call-recording": "higher-plan-only",
      "power-dialer": "higher-plan-only",
      "sms-messaging": "supported",
      "whatsapp-business": "supported",
      "shared-inbox": "supported",
      "team-messaging": "limited",
      "video-meetings": "not-supported",
      "crm-cti": "higher-plan-only",
      "analytics-reporting": "limited",
      "ai-assistance": "add-on",
      "unified-inbox": "supported",
    },
    aiLines: [
      "AI transcription: higher-plan-only",
      "AI summaries: add-on",
      "AI assistant: add-on",
      "AI automation: limited",
    ],
    integrations: [
      { integrationSlug: "hubspot", kind: "native", notes: "Professional and above" },
      { integrationSlug: "salesforce", kind: "native", notes: "Professional and above" },
      { integrationSlug: "pipedrive", kind: "native" },
      { integrationSlug: "zoho-crm", kind: "native" },
      { integrationSlug: "zendesk", kind: "native", notes: "Ultimate tier listing" },
      { integrationSlug: "slack", kind: "native", notes: "Starter and above" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    limitations: [
      "Call recording, multilingual IVR and CRM integrations (HubSpot/Salesforce/Pipedrive/Zoho) start on Professional",
      "Basic is only free for the first 6 months from signup, after which Starter is required",
      "Fair-usage policy prohibits auto-dialing, predictive dialing and trunking on the Office Phone System",
      "Parallel calls are capped at 30% of total call capacity within the Office Phone System",
      "AI Copilot is a $10/user/month add-on and speech analytics is Enterprise-included only",
      "Call-centre ladder (Bronze/Silver/Platinum) USD figures render by region — pricing transparency is weaker than the office plans",
      "Metered calling ($0.25/min on some rate cards) plus a one-time $20 SMS setup fee sit on top of seat prices",
    ],
    limitationKinds: [
      "plan-restriction",
      "usage-cap",
      "other",
      "usage-cap",
      "requires-add-on",
      "other",
      "high-cost-at-scale",
    ],
    scores: {
      "ease-of-use": 8,
      "voice-messaging-quality": 7,
      "routing-workflows": 7,
      integrations: 7,
      analytics: 7,
      "outbound-tools": 7,
      scalability: 7,
      "value-for-money": 9,
      "ai-capabilities": 6,
    },
    scoreRationales: {
      "ease-of-use":
        "Self-serve signup, a 10-day free trial, desktop/mobile softphones and a $0 Basic rung make CallHippo the easiest of these phone products to start on without procurement. The two parallel plan ladders (office vs call centre) are the main comprehension tax for buyers.",
      "voice-messaging-quality":
        "Unlimited US/CA calling from Professional, smart failover with alternate caller ID, smart switch between carriers, local presence and number porting are all first-party documented. Score is held at 7 because unlimited minutes are domestic-only, excluded destinations and premium/toll-free numbers are metered, and fair-usage caps apply.",
      "routing-workflows":
        "Business hours on Basic, cascading distribution and multilingual IVR on Professional, multilevel IVR, holiday routing, smart DID and CRM-based VIP routing on Ultimate, with skill-based routing on the call-centre ladder. Real depth exists but the useful routing sits two rungs up.",
      integrations:
        "50+ integrations with HubSpot, Salesforce, Pipedrive, Zoho and Zendesk, plus Zapier/Slack/webhooks lower down and custom integrations on Ultimate. Solid SMB coverage that trails Aircall’s 250+ catalogue and dedicated Salesforce CTI.",
      analytics:
        "Basic report analytics on Starter, full reports/analytics and lifetime call logs on Professional, call summary on Ultimate, with supervisor dashboards, CSAT and target-vs-achievement on the call-centre ladder. Adequate for SMB oversight, not an analytics platform.",
      "outbound-tools":
        "Stand-alone dialer, click-to-call Chrome extension, AI voicemail drop and auto-rotate are documented in the Pro Suite, and the call-centre ladder carries dispositions and after-call work — but the fair-usage policy explicitly prohibits auto/predictive dialing on the Office Phone System, so this is not a parallel-dialer product.",
      scalability:
        "A 2-user Starter minimum, four office rungs, a separate call-centre ladder and a 50-user Enterprise tier with unlimited calling to 48 countries cover a wide growth path; the discontinuity between the two ladders and the region-dependent call-centre pricing are the limits.",
      "value-for-money":
        "$0 Basic for six months, Starter at $18/user/month annual, and Professional at $30 with call recording, IVR and CRM integrations make CallHippo the strongest published value posture in this phone cluster — the same $30 that only buys Aircall Essentials. Metered minutes and the AI add-on temper it. Affiliate economics excluded.",
      "ai-capabilities":
        "AI voicemail transcription on Professional and an AI Copilot add-on ($10/user/month) covering call transcription, key topics, summaries, sentiment and talk ratio. Real but thinner and more clearly paywalled than Aircall’s AI Assist/Voice Agent stack.",
    },
    bestFor: [
      "SMB and micro teams that need a real phone system with a low entry price and no 3-seat floor",
      "Growing sales teams that want unlimited domestic calling plus recording and IVR around $30/user/month",
      "Buyers who want a self-serve trial and a $0 starting rung before committing budget",
    ],
    notIdealFor: [
      "High-volume outbound teams needing auto/predictive dialing (prohibited by fair-usage on the office plans)",
      "Buyers who need call recording and CRM integrations on the cheapest paid tier",
      "Enterprises wanting a single transparent global price list rather than two region-dependent ladders",
    ],
    pros: [
      "Lowest-friction entry in the phone cluster: $0 Basic rung and $18/user/month Starter",
      "Unlimited US/CA calling, call recording, multilingual IVR and CRM integrations on Professional at $30",
      "WhatsApp Business API and a free omnichannel inbox available from the entry rungs",
      "10-day free trial with self-serve signup",
      "Separate call-centre ladder with supervisor tooling, barge/whisper and compliance recording",
    ],
    cons: [
      "Recording, IVR and CRM integrations are gated behind Professional",
      "Basic is free for only 6 months",
      "Fair-usage policy blocks auto/predictive dialing and caps parallel calls",
      "AI is a paid Copilot add-on",
      "Two parallel plan ladders with region-dependent call-centre pricing complicate comparison",
    ],
    keyFeatures: [
      "Cloud phone with number porting and local presence",
      "Unlimited US/CA calling on Professional and above",
      "Call recording and multilingual IVR (Professional)",
      "Free omnichannel inbox with WhatsApp Business API",
      "50+ CRM and helpdesk integrations",
      "AI Copilot add-on for transcription and sentiment",
    ],
    pricingSummary:
      "Office Phone System billed annually per user/month: Basic $0 (free for the first 6 months, then upgrade required), Starter $18 with a 2-user minimum, Professional $30, Ultimate $42; Enterprise is quote-based with a 50-user minimum. A separate call-centre ladder (Bronze/Silver/Platinum) exists with region-rendered pricing. AI Copilot is $10/user/month, a one-time $20 SMS setup fee applies, and calling is metered on top of seats. Verified 2026-08-17 — confirm live rates for your region.",
    whoShouldChoose:
      "Choose CallHippo when you want SMB-priced business calling with recording, IVR and CRM logging around $30/user/month and no three-seat floor.",
    whoShouldConsiderAlternatives:
      "Compare Aircall for CRM/CTI depth and contact-centre routing, KrispCall for the cheapest global number footprint, Freshcaller for a free inbound rung inside Freshworks, and Kixie when a compliant high-volume power dialer is the primary job.",
    alternativeSlugs: ["aircall", "krispcall", "freshcaller", "kixie"],
    competitorSlugs: ["aircall", "krispcall", "freshcaller", "kixie"],
    comparableSlugs: ["aircall", "krispcall", "freshcaller"],
    secondaryCategorySlugs: ["customer-service"],
    subcategorySlugs: [],
    useCaseSlugs: ["sales-engagement", "outbound-sales", "customer-follow-up"],
    teamTypeSlugs: ["sales", "operations"],
    businessSizeSlugs: ["micro", "small-business", "mid-market"],
    officialVideos: [],
    sourcesExtra: [
      {
        id: "callhippo-fair-usage",
        url: "https://callhippo.com/exemption-list/",
        title: "CallHippo Unlimited Calling Exemption List",
        domains: ["limits", "pricing"],
      },
      {
        id: "callhippo-whatsapp",
        url: "https://callhippo.com/whatsapp-business-api/",
        title: "CallHippo WhatsApp Business API",
        domains: ["features"],
      },
    ],
  },
  {
    slug: "krispcall",
    name: "KrispCall",
    company: "KrispCall",
    website: "https://krispcall.com",
    domain: "krispcall.com",
    pricingUrl: "https://krispcall.com/pricing/",
    aliases: [],
    membershipRole: "primary",
    jobCluster: "cloud-phone",
    softShortDescription:
      "Budget global cloud telephony with virtual numbers across 100+ countries and a unified callbox — Essential from $12/user/month annual (up to 5 users); calls and SMS are pay-as-you-go.",
    shortDescription:
      "KrispCall is a low-cost cloud telephony platform built around virtual numbers in a wide list of countries and a unified callbox that keeps calls, SMS and contact history in one workspace. Essential starts at $12/user/month on annual billing but caps at 5 users; Standard unlocks up to 50 users with power dialer, call monitoring, multi-level IVR and API access. Calling minutes and SMS are billed pay-as-you-go on top of the seat price.",
    vendorPositioning:
      "A cloud phone system with global virtual numbers and a unified callbox — international presence for startups, agencies and remote sales teams without an enterprise telecom contract.",
    pricingModel: "subscription",
    hasFreePlan: false,
    hasFreeTrial: false,
    startingPriceMonthly: 12,
    startingPriceConfidence: "medium",
    pricingNotes:
      "Verified 2026-08-17 from krispcall.com/pricing content (the page blocked direct retrieval, so figures are recorded at medium confidence). Essential: $15/user/month monthly or $12/user/month billed annually (20% annual discount), for teams up to 5 users, with one local or mobile number per user. Standard: $40/user/month monthly or $32 annually, up to 50 users, adding unlimited call recordings and storage, power dialer, call monitoring (listen/whisper/barge), multi-level IVR, advanced reporting and API/webhooks. Enterprise is custom-priced with bundled calling/SMS rates and a dedicated account manager. There is no free plan and no free trial — a 14-day money-back guarantee applies to subscriptions, and every call minute and SMS segment is billed pay-as-you-go against a separate credit balance.",
    fixturePlans: [
      "PLAN essential: name=Essential; amountPerSeat=12; currency=USD; interval=year; amountPeriod=month; maximumSeats=5",
      "PLAN standard: name=Standard; amountPerSeat=32; currency=USD; interval=year; amountPeriod=month; maximumSeats=50",
      "PLAN enterprise: name=Enterprise; contactSales=true",
    ],
    enrichmentPlans: [
      planPerSeatAnnual("essential", "Essential", 12, {
        maximumSeats: 5,
        limits: {
          maxUsers: 5,
          includedNumbersPerUser: 1,
          callingAndSms: "pay-as-you-go",
        },
        description:
          "$12/user/month billed annually ($15 monthly) for teams up to 5 users. One local or mobile number per user, call recording, voicemail, IVR and the unified callbox; minutes and SMS billed pay-as-you-go.",
      }),
      planPerSeatAnnual("standard", "Standard", 32, {
        maximumSeats: 50,
        highlighted: true,
        limits: {
          maxUsers: 50,
          callRecordingStorage: "unlimited",
          callingAndSms: "pay-as-you-go",
        },
        description:
          "$32/user/month billed annually ($40 monthly) for up to 50 users. Adds unlimited call recordings and storage, power dialer, call monitoring (listen/whisper/barge), multi-level IVR, advanced reporting and API/webhooks.",
      }),
      contactSalesPlan("enterprise", "Enterprise", {
        description:
          "Custom-priced: bundled calling and SMS rates, dedicated account manager, developer support, custom integrations and onboarding.",
      }),
    ],
    featureOverrides: {
      "cloud-phone": "supported",
      "call-routing": "supported",
      "call-recording": "supported",
      "power-dialer": "higher-plan-only",
      "sms-messaging": "supported",
      "whatsapp-business": "unknown",
      "shared-inbox": "supported",
      "team-messaging": "limited",
      "video-meetings": "not-supported",
      "crm-cti": "limited",
      "analytics-reporting": "limited",
      "ai-assistance": "limited",
      "unified-inbox": "supported",
    },
    aiLines: [
      "AI transcription: limited",
      "AI summaries: unknown",
      "AI assistant: unknown",
      "AI automation: limited",
    ],
    integrations: [
      { integrationSlug: "hubspot", kind: "native" },
      { integrationSlug: "pipedrive", kind: "native" },
      { integrationSlug: "zoho-crm", kind: "native" },
      { integrationSlug: "salesforce", kind: "native", notes: "Integration breadth increases on Standard" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    limitations: [
      "Essential caps at 5 users — growing teams must jump to Standard at $32/user/month annual",
      "Every call minute and SMS segment is pay-as-you-go on top of the seat price",
      "No free plan and no free trial — only a 14-day money-back guarantee",
      "Power dialer, call monitoring, multi-level IVR and API access are Standard-only",
      "Pricing page blocked automated retrieval, so plan figures are medium-confidence research",
      "AI tooling is thin compared with Aircall AI Assist or CallHippo AI Copilot",
    ],
    limitationKinds: [
      "plan-restriction",
      "high-cost-at-scale",
      "other",
      "plan-restriction",
      "other",
      "feature-unavailable",
    ],
    scores: {
      "ease-of-use": 8,
      "voice-messaging-quality": 8,
      "routing-workflows": 6,
      integrations: 6,
      analytics: 6,
      "outbound-tools": 7,
      scalability: 6,
      "value-for-money": 9,
      "ai-capabilities": 5,
    },
    scoreRationales: {
      "ease-of-use":
        "The unified callbox consolidates calls, SMS and contact history in a single pane, and self-serve signup with per-user numbers keeps setup light for small distributed teams. Score reflects documented product shape rather than hands-on testing.",
      "voice-messaging-quality":
        "Global virtual numbers across a wide country list with a local or mobile number included per user on Essential is KrispCall’s core strength for teams that need international presence — the reason to pick it over a US-centric SMB provider. Pay-as-you-go minutes mean quality-of-service commitments are less explicit than Aircall’s unlimited-calling envelope.",
      "routing-workflows":
        "IVR and voicemail are available from Essential, with multi-level IVR and call monitoring on Standard, but there is no documented queue-callback or skills-based routing depth comparable to Aircall Professional or CallHippo’s call-centre ladder.",
      integrations:
        "CRM connectors (HubSpot, Pipedrive, Zoho, Salesforce) and API/webhooks exist, with breadth and API access concentrated on Standard. Adequate for logging, well short of Aircall’s catalogue and CTI depth.",
      analytics:
        "Basic analytics on Essential and advanced reporting on Standard cover call volumes and agent activity; there is no evidence of contact-centre-grade dashboards or long-horizon historical analytics.",
      "outbound-tools":
        "A power dialer plus call monitoring on Standard makes structured outbound viable for small sales teams, but the entry tier has no dialer and there is no parallel/predictive dialing story.",
      scalability:
        "Hard user caps shape the growth path: 5 users on Essential, 50 on Standard, then custom Enterprise. Number coverage scales well internationally; seat and feature ceilings do not scale as smoothly as Aircall or CallHippo.",
      "value-for-money":
        "$12/user/month on annual billing is the lowest published entry in this phone cluster, and Standard at $32 bundles recording, dialer and IVR. The caveat is real: metered minutes and SMS mean the sticker price is only part of the bill, so heavy dialers should model usage. Affiliate economics excluded.",
      "ai-capabilities":
        "AI surfacing is limited to lighter transcription/assist claims rather than a documented AI assistant, summary or voice-agent product — the weakest AI posture among the Wave-1 phone peers.",
    },
    bestFor: [
      "Startups, agencies and remote teams that need virtual numbers in multiple countries cheaply",
      "Small teams (up to 5 users) that want a real phone system for around $12/user/month",
      "Sales teams that will move to Standard for the power dialer, monitoring and API access",
    ],
    notIdealFor: [
      "Teams above 50 users or those needing contact-centre routing and queue callback",
      "Buyers who need bundled calling minutes rather than pay-as-you-go usage billing",
      "Buyers who require a free trial before paying (only a 14-day refund window exists)",
    ],
    pros: [
      "Lowest published entry price in the phone cluster ($12/user/month annual)",
      "Global virtual numbers with one local or mobile number included per user",
      "Unified callbox brings calls, SMS and contact context together",
      "Standard adds power dialer, call monitoring, multi-level IVR and API access",
      "Unlimited call recording storage on Standard",
    ],
    cons: [
      "Essential caps at 5 users; Standard caps at 50",
      "Calls and SMS are pay-as-you-go on top of seats",
      "No free plan or free trial",
      "Thin AI capabilities versus Aircall and CallHippo",
      "Routing and analytics depth trail contact-centre-oriented peers",
    ],
    keyFeatures: [
      "Global virtual numbers with unified callbox",
      "Call recording and voicemail from the entry tier",
      "Multi-level IVR and call monitoring (Standard)",
      "Power dialer (Standard)",
      "CRM integrations plus API and webhooks (Standard)",
    ],
    pricingSummary:
      "Essential $15/user/month monthly or $12 billed annually (up to 5 users); Standard $40/user/month monthly or $32 annually (up to 50 users); Enterprise custom. No free plan or free trial — a 14-day money-back guarantee applies, and calling minutes plus SMS segments are pay-as-you-go on top of the seat price. Medium-confidence research from krispcall.com/pricing on 2026-08-17 — confirm live.",
    whoShouldChoose:
      "Choose KrispCall when cheap international virtual numbers and a unified calling workspace matter more than contact-centre routing depth, and your team fits inside its seat caps.",
    whoShouldConsiderAlternatives:
      "Compare CallHippo for a $0 starting rung and unlimited domestic minutes, Aircall for CRM/CTI and routing depth, Freshcaller for a free inbound rung with bundled minutes, and Kixie for high-volume outbound dialing.",
    alternativeSlugs: ["callhippo", "aircall", "freshcaller", "kixie"],
    competitorSlugs: ["callhippo", "aircall", "freshcaller", "kixie"],
    comparableSlugs: ["callhippo", "aircall", "freshcaller"],
    secondaryCategorySlugs: [],
    subcategorySlugs: [],
    useCaseSlugs: ["sales-engagement", "outbound-sales"],
    teamTypeSlugs: ["sales", "operations", "founders"],
    businessSizeSlugs: ["micro", "small-business"],
    officialVideos: [],
    sourcesExtra: [
      {
        id: "krispcall-features",
        url: "https://krispcall.com/features/",
        title: "KrispCall Features",
        domains: ["features", "product-positioning"],
      },
      {
        id: "krispcall-integrations",
        url: "https://krispcall.com/integrations/",
        title: "KrispCall Integrations",
        domains: ["integrations"],
      },
    ],
  },
  {
    slug: "freshcaller",
    name: "Freshcaller",
    company: "Freshworks",
    website: "https://www.freshworks.com/freshcaller-cloud-pbx/",
    domain: "freshworks.com",
    pricingUrl: "https://www.freshworks.com/freshcaller-cloud-pbx/pricing/",
    aliases: ["Freshdesk Contact Center", "Freshworks cloud PBX"],
    membershipRole: "primary",
    jobCluster: "cloud-phone",
    softShortDescription:
      "Freshworks cloud PBX for inbound voice support: a $0 agent plan plus pay-per-minute, Growth from $15/agent/month annual with 2,000 included incoming minutes, and routing automation higher up.",
    shortDescription:
      "Freshcaller is Freshworks’ cloud PBX for voice support teams. It is unusual in this cluster for publishing a $0 agent tier (pay per minute only) and for bundling included incoming minutes into each paid tier — 2,000 on Growth, 3,000 on Pro, 5,000 on Enterprise. Routing depth climbs with the ladder (wait queues and recording on Growth, routing automation and conferencing on Pro, speech-enabled IVR and service-level monitoring on Enterprise), and day passes let occasional agents log in without a full seat.",
    vendorPositioning:
      "Get started with voice support and scale it — a cloud PBX that grows from free inbound calling to enterprise-grade voice support inside the Freshworks suite.",
    pricingModel: "freemium",
    hasFreePlan: true,
    hasFreeTrial: true,
    trialDays: 14,
    startingPriceMonthly: 15,
    pricingNotes:
      "Verified 2026-08-17 from freshworks.com/freshcaller-cloud-pbx/pricing. Billed annually, per agent/month plus per-minute call charges: Free $0 (inbound caller ID, desktop notifications, call notes, custom greetings, call metrics); Growth $15 with 2,000 included incoming minutes/month, number porting, wait queues, voicemail, warm/cold transfer and call recording, plus $2 day passes; Pro $39 with 3,000 included minutes, holiday routing, agent statuses, routing automation, conferencing and smart escalations, plus $7 day passes; Enterprise $69 with 5,000 included minutes, speech-enabled IVR, abandoned-call metrics and service-level monitoring, plus $12 day passes. Annual billing saves 20% versus monthly. A 14-day free trial grants Enterprise features.",
    fixturePlans: [
      "PLAN free: name=Free; isFree=true; payPerMinute=true",
      "PLAN growth: name=Growth; amountPerSeat=15; currency=USD; interval=year; amountPeriod=month; includedIncomingMinutes=2000",
      "PLAN pro: name=Pro; amountPerSeat=39; currency=USD; interval=year; amountPeriod=month; includedIncomingMinutes=3000",
      "PLAN enterprise: name=Enterprise; amountPerSeat=69; currency=USD; interval=year; amountPeriod=month; includedIncomingMinutes=5000",
    ],
    enrichmentPlans: [
      freePlan("free", "Free", {
        limits: {
          agentPriceMonthly: 0,
          payPerMinute: true,
        },
        description:
          "$0/agent/month plus pay-per-minute call charges. Inbound caller ID, desktop notifications, call notes, custom greetings, call metrics and conversion properties.",
      }),
      planPerSeatAnnual("growth", "Growth", 15, {
        highlighted: true,
        hasFreeTrial: true,
        trialDays: 14,
        limits: {
          includedIncomingMinutesMonthly: 2000,
          dayPassPrice: 2,
        },
        description:
          "$15/agent/month billed annually plus per-minute charges. 2,000 included incoming minutes/month, number porting, wait queues, voicemail, warm/cold transfer, call recording; $2 day passes.",
      }),
      planPerSeatAnnual("pro", "Pro", 39, {
        hasFreeTrial: true,
        trialDays: 14,
        limits: {
          includedIncomingMinutesMonthly: 3000,
          dayPassPrice: 7,
        },
        description:
          "$39/agent/month billed annually. 3,000 included incoming minutes/month, holiday routing, call-centre agent statuses, routing automation, call conferencing, smart escalations; $7 day passes.",
      }),
      planPerSeatAnnual("enterprise", "Enterprise", 69, {
        hasFreeTrial: true,
        trialDays: 14,
        limits: {
          includedIncomingMinutesMonthly: 5000,
          dayPassPrice: 12,
        },
        description:
          "$69/agent/month billed annually. 5,000 included incoming minutes/month, speech-enabled IVR, abandoned-call metrics, service-level monitoring; $12 day passes.",
      }),
    ],
    featureOverrides: {
      "cloud-phone": "supported",
      "call-routing": "supported",
      "call-recording": "higher-plan-only",
      "power-dialer": "not-supported",
      "sms-messaging": "unknown",
      "whatsapp-business": "not-supported",
      "shared-inbox": "not-supported",
      "team-messaging": "not-supported",
      "video-meetings": "not-supported",
      "crm-cti": "supported",
      "analytics-reporting": "supported",
      "ai-assistance": "unknown",
      "unified-inbox": "not-supported",
    },
    aiLines: [
      "AI transcription: unknown",
      "AI summaries: unknown",
      "AI assistant: unknown",
      "AI automation: limited",
    ],
    integrations: [
      { integrationSlug: "freshdesk", kind: "native" },
      { integrationSlug: "freshsales", kind: "native" },
      { integrationSlug: "salesforce", kind: "official-connector" },
      { integrationSlug: "hubspot", kind: "official-connector" },
      { integrationSlug: "slack", kind: "official-connector" },
    ],
    limitations: [
      "Call recording, wait queues and voicemail require Growth or above — the Free tier is inbound-basics only",
      "Every tier bills per-minute call charges on top of agent seats; included minutes cover incoming only",
      "No power dialer or outbound sales cadence tooling in the published plan ladder",
      "WhatsApp, shared inbox and team messaging live in other Freshworks products, not Freshcaller",
      "Routing automation is Pro-only and speech-enabled IVR is Enterprise-only",
      "AI assistance is not documented in the Freshcaller plan tables",
    ],
    limitationKinds: [
      "plan-restriction",
      "usage-cap",
      "feature-unavailable",
      "feature-unavailable",
      "plan-restriction",
      "feature-unavailable",
    ],
    scores: {
      "ease-of-use": 8,
      "voice-messaging-quality": 7,
      "routing-workflows": 8,
      integrations: 7,
      analytics: 7,
      "outbound-tools": 4,
      scalability: 8,
      "value-for-money": 8,
      "ai-capabilities": 4,
    },
    scoreRationales: {
      "ease-of-use":
        "A $0 agent tier and a 14-day Enterprise trial make evaluation painless, and the Freshworks admin idiom is familiar to teams already running Freshdesk or Freshsales. Score reflects documented onboarding posture, not hands-on testing.",
      "voice-messaging-quality":
        "Included incoming minutes per tier (2,000/3,000/5,000), number porting, warm/cold transfer and voicemail give a credible inbound voice envelope. Score is held at 7 because included minutes are inbound-only, outbound is metered, and there is no published SMS or messaging channel inside Freshcaller.",
      "routing-workflows":
        "Wait queues on Growth, holiday routing, agent statuses, routing automation, conferencing and smart escalations on Pro, and speech-enabled IVR with service-level monitoring on Enterprise. This is the most support-shaped routing ladder in the Wave-1 cluster after Aircall.",
      integrations:
        "Native depth inside the Freshworks suite (Freshdesk, Freshsales) is the real reason to buy, with connectors out to other CRMs. Cross-ecosystem CTI breadth trails Aircall’s 250+ catalogue.",
      analytics:
        "Call metrics and conversion properties from the Free tier, abandoned-call metrics and service-level monitoring on Enterprise. Reporting is oriented to support SLAs rather than sales coaching.",
      "outbound-tools":
        "No power dialer, voicemail drop or outbound cadence tooling appears in the published plans, and included minutes cover incoming calls only — Freshcaller is an inbound-support product and is scored accordingly rather than penalised for a job it does not claim.",
      scalability:
        "Four published rungs, per-tier included minutes, day passes for occasional agents, and enterprise service-level monitoring make growth predictable inside the Freshworks estate.",
      "value-for-money":
        "A genuinely free agent tier plus Growth at $15/agent/month with 2,000 included incoming minutes is the best published inbound value in this cluster; day passes avoid paying full seats for part-time agents. Per-minute charges and the $39 jump to routing automation temper the score. Affiliate economics excluded.",
      "ai-capabilities":
        "The Freshcaller plan tables do not document AI transcription, summaries or agent-assist, so AI is scored low on evidence rather than assumed from other Freshworks products.",
    },
    bestFor: [
      "Support teams already standardising on Freshworks (Freshdesk / Freshsales)",
      "Teams that want to start voice support free and pay only for minutes",
      "Inbound-heavy operations that need wait queues, transfers and SLA monitoring",
    ],
    notIdealFor: [
      "Outbound sales teams that need a power dialer or cadence tooling",
      "Buyers who need WhatsApp, SMS or a shared multichannel inbox inside the phone product",
      "Teams wanting AI call summaries or coaching in the base product",
    ],
    pros: [
      "Genuinely free agent tier (pay per minute only)",
      "Included incoming minutes bundled into every paid tier",
      "Day passes ($2/$7/$12) for occasional agents instead of full seats",
      "Support-grade routing: wait queues, routing automation, speech-enabled IVR",
      "Native fit with Freshdesk and Freshsales",
    ],
    cons: [
      "No power dialer or outbound sales tooling",
      "Recording and queues require Growth or above",
      "Per-minute charges on top of every seat",
      "No WhatsApp, SMS or unified inbox inside Freshcaller",
      "AI capabilities are undocumented in the plan tables",
    ],
    keyFeatures: [
      "Cloud PBX with number porting",
      "Included incoming minutes per tier",
      "Wait queues, warm/cold transfer, voicemail",
      "Routing automation and smart escalations (Pro)",
      "Speech-enabled IVR and SLA monitoring (Enterprise)",
      "Day passes for part-time agents",
    ],
    pricingSummary:
      "Billed annually per agent/month plus per-minute call charges: Free $0; Growth $15 with 2,000 included incoming minutes; Pro $39 with 3,000; Enterprise $69 with 5,000. Day passes cost $2/$7/$12 by tier and annual billing saves 20% versus monthly. A 14-day free trial grants Enterprise features. Verified 2026-08-17 on the Freshworks pricing page.",
    whoShouldChoose:
      "Choose Freshcaller when inbound voice support inside the Freshworks suite is the job and you want a free starting tier with bundled incoming minutes.",
    whoShouldConsiderAlternatives:
      "Compare Aircall for CRM/CTI depth and outbound dialing, CallHippo for cheap unlimited domestic calling, KrispCall for global numbers on a budget, and Wati if the real requirement is WhatsApp customer messaging.",
    alternativeSlugs: ["aircall", "callhippo", "krispcall"],
    competitorSlugs: ["aircall", "callhippo", "krispcall", "kixie"],
    comparableSlugs: ["aircall", "callhippo", "krispcall"],
    secondaryCategorySlugs: ["customer-service"],
    subcategorySlugs: [],
    useCaseSlugs: ["customer-follow-up", "inbound-sales"],
    teamTypeSlugs: ["customer-success", "operations"],
    businessSizeSlugs: ["small-business", "mid-market"],
    officialVideos: [],
    sourcesExtra: [
      {
        id: "freshcaller-product",
        url: "https://www.freshworks.com/freshcaller-cloud-pbx/features/",
        title: "Freshcaller Features",
        domains: ["features", "product-positioning"],
      },
    ],
  },
  {
    slug: "wati",
    name: "Wati",
    company: "Wati (Clare.AI)",
    website: "https://www.wati.io",
    domain: "wati.io",
    pricingUrl: "https://www.wati.io/pricing/",
    aliases: ["WATI", "WhatsApp Team Inbox"],
    membershipRole: "primary",
    jobCluster: "customer-messaging",
    softShortDescription:
      "Official WhatsApp Business API platform with a shared team inbox, broadcasts, chatbots and AI co-pilot — platform subscription (Growth/Pro/Business) plus Meta per-message charges.",
    shortDescription:
      "Wati is a WhatsApp Business Solution Provider platform: an official WhatsApp Business API account with blue-tick assistance, a multi-agent shared inbox, broadcast campaigns, chatbots and click-to-WhatsApp ad capture. Pricing is a platform subscription (Growth includes 1 channel and 3 users; Pro and Business include 5 users with additional users at $24 and $69 per user/month) plus Meta per-message charges billed from a credit balance. It is a messaging peer, not a phone-system peer.",
    vendorPositioning:
      "Turn WhatsApp conversations into conversions — official WhatsApp Business API, omnichannel inbox, campaigns and AI agents for businesses that sell and support on WhatsApp.",
    pricingModel: "subscription",
    hasFreePlan: false,
    hasFreeTrial: true,
    trialDays: 7,
    startingPriceMonthly: 49,
    startingPriceConfidence: "low",
    pricingNotes:
      "Verified 2026-08-17 from wati.io/pricing. Plan structure is first-party: Growth connects any 1 channel with 3 users included and no additional users, 15,000 broadcasts/month at standard rates, 1,000 free automation triggers, 2 commerce/CRM integrations, 10k API calls and 250 AI co-pilot credits; Pro includes 5 users with additional users at $24/user/month, unlimited broadcasts, 5 integrations including HubSpot, 200k API calls, 500 AI credits, advanced chatbots and CTWA tracking; Business includes 5 users with additional users at $69/user/month, unlimited broadcasts with volume discounts, unlimited integrations including Salesforce, 20M API calls, 1,500 AI credits, multiple WhatsApp numbers and round-robin assignment. Enterprise is quote-based. Platform-fee dollars render client-side by region, so the commonly cited annual-billed bands (~$49 Growth, ~$99 Pro, ~$299 Business) are recorded at LOW confidence and must be confirmed live. Every plan states additional per-message charges that vary by marketing/utility/authentication template and recipient country code, deducted from a non-expiring credit balance. A Shopify add-on costs $4.99/month; the Astra AI agent suite is priced separately. 7-day free trial with zero setup fees.",
    fixturePlans: [
      "PLAN growth: name=Growth; amount=49; currency=USD; interval=year; amountPeriod=month; usersIncluded=3; confidence=low",
      "PLAN pro: name=Pro; amount=99; currency=USD; interval=year; amountPeriod=month; usersIncluded=5; additionalUserMonthly=24; confidence=low",
      "PLAN business: name=Business; amount=299; currency=USD; interval=year; amountPeriod=month; usersIncluded=5; additionalUserMonthly=69; confidence=low",
      "PLAN enterprise: name=Enterprise; contactSales=true",
    ],
    enrichmentPlans: [
      planFlatAnnual("growth", "Growth", 49, {
        hasFreeTrial: true,
        trialDays: 7,
        limits: {
          channelsIncluded: 1,
          usersIncluded: 3,
          additionalUsersAllowed: false,
          broadcastsMonthly: 15000,
          automationTriggersMonthly: 1000,
          integrations: 2,
          apiCallsMonthly: 10000,
          aiCopilotCreditsMonthly: 250,
        },
        description:
          "Platform subscription (~$49/month billed annually — low-confidence band, confirm live) plus per-message charges. 1 channel, 3 users included with no additional users, 15,000 broadcasts/month, omnichannel inbox, CTWA lead capture, WhatsApp catalog and Shopify templates.",
      }),
      planFlatAnnual("pro", "Pro", 99, {
        highlighted: true,
        hasFreeTrial: true,
        trialDays: 7,
        limits: {
          usersIncluded: 5,
          additionalUserMonthly: 24,
          broadcasts: "unlimited",
          automationTriggersMonthly: 2000,
          integrations: 5,
          apiCallsMonthly: 200000,
          aiCopilotCreditsMonthly: 500,
        },
        description:
          "Platform subscription (~$99/month billed annually — low-confidence band) plus per-message charges. 5 users included, additional users $24/user/month, unlimited broadcasts, advanced chatbots, CTWA source tags and click tracking, HubSpot integration, auto routing and operator reports.",
      }),
      planFlatAnnual("business", "Business", 299, {
        hasFreeTrial: true,
        trialDays: 7,
        limits: {
          usersIncluded: 5,
          additionalUserMonthly: 69,
          broadcasts: "unlimited with volume discounts",
          automationTriggersMonthly: 5000,
          integrations: "unlimited",
          apiCallsMonthly: 20000000,
          aiCopilotCreditsMonthly: 1500,
          messagesPerMinute: 4000,
        },
        description:
          "Platform subscription (~$299/month billed annually — low-confidence band) plus per-message charges. 5 users included, additional users $69/user/month, 4,000 messages/minute, multiple WhatsApp numbers, round-robin assignment, Salesforce integration, number masking, IP whitelisting, dedicated CSM.",
      }),
      contactSalesPlan("enterprise", "Enterprise", {
        description:
          "Quote-based enterprise packaging beyond the published Business tier.",
      }),
    ],
    featureOverrides: {
      "cloud-phone": "limited",
      "call-routing": "limited",
      "call-recording": "unknown",
      "power-dialer": "not-supported",
      "sms-messaging": "add-on",
      "whatsapp-business": "supported",
      "shared-inbox": "supported",
      "team-messaging": "limited",
      "video-meetings": "not-supported",
      "crm-cti": "higher-plan-only",
      "analytics-reporting": "supported",
      "ai-assistance": "supported",
      "unified-inbox": "supported",
    },
    aiLines: [
      "AI assistant: supported",
      "AI automation: supported",
      "AI summaries: limited",
      "AI transcription: unknown",
    ],
    integrations: [
      { integrationSlug: "shopify", kind: "native", notes: "$4.99/month add-on for Shopify surfaces" },
      { integrationSlug: "hubspot", kind: "native", notes: "Pro and above" },
      { integrationSlug: "salesforce", kind: "native", notes: "Business tier" },
      { integrationSlug: "woocommerce", kind: "native" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    limitations: [
      "Platform subscription is only part of the bill — Meta per-message charges vary by template category and recipient country",
      "Growth includes 3 users and does not allow additional users at all",
      "Additional users cost $24/user/month on Pro and $69/user/month on Business",
      "HubSpot integration starts on Pro and Salesforce on Business; Growth has only 2 integrations",
      "Platform-fee dollars render by region on the pricing page — treat published bands as unconfirmed",
      "Astra AI agents and the Shopify add-on are priced separately",
      "Not a phone system: no IVR, queues, power dialer or PSTN calling depth",
    ],
    limitationKinds: [
      "usage-cap",
      "plan-restriction",
      "high-cost-at-scale",
      "plan-restriction",
      "other",
      "requires-add-on",
      "feature-unavailable",
    ],
    scores: {
      "ease-of-use": 8,
      "voice-messaging-quality": 8,
      "routing-workflows": 8,
      integrations: 7,
      analytics: 7,
      "outbound-tools": 9,
      scalability: 7,
      "value-for-money": 6,
      "ai-capabilities": 8,
    },
    scoreRationales: {
      "ease-of-use":
        "Zero-fee WhatsApp API setup with blue-tick verification assistance, a 7-day trial and a familiar chat-inbox metaphor make Wati approachable for support and sales teams who already live in WhatsApp. Score reflects documented onboarding, not hands-on testing.",
      "voice-messaging-quality":
        "Scored on the messaging channel Wati actually sells: an official WhatsApp Business API account with template approval, WhatsApp Business Calling, and an omnichannel inbox spanning WhatsApp, Facebook, Instagram, QR code, widget and wa.me. Per the methodology, a WhatsApp BSP is not penalised for lacking PSTN voice depth.",
      "routing-workflows":
        "Assignment, tagging, automated follow-ups, teams and auto routing on Pro, plus round-robin chat assignment and multiple WhatsApp numbers on Business, cover multi-agent messaging workflows. Chatbots and forms handle deflection where a phone product would use IVR.",
      integrations:
        "Commerce and CRM connectors are real but tiered: 2 integrations on Growth, 5 including HubSpot on Pro, unlimited including Salesforce on Business, with API-call ceilings and webhook access rising by tier. Shopify depth (abandoned cart, order templates, Shopflo/Gokwik checkout) is a genuine strength.",
      analytics:
        "Campaign and engagement insights, CTWA source tags and click tracking on Pro, operator reports and conversion tracking with WhatsApp Pay API on Business. Solid conversation analytics; not a BI-grade reporting suite.",
      "outbound-tools":
        "This is Wati’s strongest axis: 15,000 broadcasts/month on Growth and unlimited broadcasts on Pro and Business, approved template libraries, carousel templates, retargeting, click-to-WhatsApp ad capture and 4,000 messages/minute on Business with SMS fallback in beta.",
      scalability:
        "Message-throughput and API ceilings scale cleanly (10k → 200k → 20M API calls; Blitz add-on to 12k messages/minute), but agent-seat economics scale badly: Growth blocks extra users entirely and Business charges $69 per additional user.",
      "value-for-money":
        "Two-layer cost (platform subscription plus Meta per-message charges) plus steep additional-user pricing makes real TCO hard to forecast, and the published platform-fee bands could not be confirmed on the live page. Strong ROI is plausible for teams already converting on WhatsApp, but transparency and accessibility are weaker than the phone peers. Affiliate economics excluded.",
      "ai-capabilities":
        "AI co-pilot credits are included on every tier (250/500/1,500 per month), advanced chatbots handle qualification and reminders, and Astra AI agents extend to web, WhatsApp and voice as a separately priced add-on — a credible AI surface for messaging.",
    },
    bestFor: [
      "Ecommerce and D2C teams that sell and support on WhatsApp",
      "Support teams needing a multi-agent WhatsApp inbox with templates and routing",
      "Growth teams running click-to-WhatsApp ads and broadcast campaigns",
    ],
    notIdealFor: [
      "Buyers who need a business phone system with IVR, queues and PSTN calling",
      "Large agent teams where per-user add-on pricing becomes punitive",
      "Teams that need a single predictable subscription without per-message billing",
    ],
    pros: [
      "Official WhatsApp Business API with zero-fee setup and blue-tick assistance",
      "Multi-agent shared inbox spanning WhatsApp, Facebook, Instagram and web widgets",
      "Unlimited broadcasts on Pro and Business with approved template tooling",
      "Click-to-WhatsApp ad capture with source tags and click tracking",
      "AI co-pilot credits on every tier plus chatbots and Astra AI agents",
    ],
    cons: [
      "Meta per-message charges sit on top of the platform subscription",
      "Growth does not allow additional users; Business charges $69 per extra user",
      "Key CRM integrations are gated to Pro (HubSpot) and Business (Salesforce)",
      "Platform-fee dollars are region-rendered and could not be verified live",
      "No phone-system capabilities — pair it with a VoIP provider if you need calls",
    ],
    keyFeatures: [
      "Official WhatsApp Business API account and templates",
      "Multi-agent shared and omnichannel inbox",
      "Broadcast campaigns (unlimited on Pro and above)",
      "Chatbots, forms and automated follow-ups",
      "Click-to-WhatsApp ads with conversion tracking",
      "AI co-pilot credits and Astra AI agents add-on",
    ],
    pricingSummary:
      "Platform subscription plus Meta per-message charges. Growth: 1 channel, 3 users included (no additional users), 15,000 broadcasts/month. Pro: 5 users, additional users $24/user/month, unlimited broadcasts. Business: 5 users, additional users $69/user/month, volume discounts, multiple WhatsApp numbers. Enterprise is quote-based. Commonly cited annual bands of ~$49 / ~$99 / ~$299 per month are LOW confidence because wati.io/pricing renders platform fees by region — confirm live. Shopify add-on $4.99/month; 7-day free trial with zero setup fees.",
    whoShouldChoose:
      "Choose Wati when WhatsApp is where your customers actually buy and support themselves, and you need an official API, shared inbox, broadcasts and chatbots in one platform.",
    whoShouldConsiderAlternatives:
      "Compare Aircall, CallHippo, KrispCall or Freshcaller when the real requirement is a business phone system; consider a dedicated helpdesk if ticketing rather than WhatsApp conversion is the primary job.",
    alternativeSlugs: ["aircall", "callhippo"],
    competitorSlugs: ["aircall", "callhippo", "krispcall"],
    comparableSlugs: ["aircall", "callhippo"],
    secondaryCategorySlugs: ["customer-service", "marketing"],
    subcategorySlugs: [],
    useCaseSlugs: ["customer-follow-up", "lead-nurturing", "small-business-campaigns"],
    teamTypeSlugs: ["marketing", "customer-success", "sales"],
    businessSizeSlugs: ["micro", "small-business", "mid-market"],
    officialVideos: [],
    sourcesExtra: [
      {
        id: "wati-shared-inbox",
        url: "https://www.wati.io/whatsapp-shared-team-inbox/",
        title: "Wati WhatsApp Shared Team Inbox",
        domains: ["features"],
      },
      {
        id: "wati-broadcast",
        url: "https://www.wati.io/whatsapp-broadcast/",
        title: "Wati WhatsApp Broadcast",
        domains: ["features"],
      },
    ],
  },
  {
    slug: "zenzap",
    name: "Zenzap",
    company: "Zenzap LTD",
    website: "https://www.zenzap.co",
    domain: "zenzap.co",
    pricingUrl: "https://www.zenzap.co/pricing",
    aliases: [],
    membershipRole: "primary",
    jobCluster: "team-messaging",
    softShortDescription:
      "Professional work-chat app for frontline and multi-site teams replacing WhatsApp groups — free tier, Pro $3/user/month yearly, Business+ $8 with HIPAA, integrations and AI agents.",
    shortDescription:
      "Zenzap is a work-chat app aimed at teams that currently run operations through personal WhatsApp groups — hospitality, healthcare, care providers, restaurants, construction and multi-site services. It combines structured chats, built-in to-dos, admin controls and company-owned data with AI transcription and search on the free tier, voice/video calls and stronger admin controls on Pro, and HIPAA compliance, integrations, call recording and personal AI agents on Business+. It is a team-messaging peer, not a phone system.",
    vendorPositioning:
      "Work chat built for the AI era — keep teams aligned, operations organised and business data protected, with structured chat that replaces 24/7 personal WhatsApp groups.",
    pricingModel: "freemium",
    hasFreePlan: true,
    hasFreeTrial: false,
    startingPriceMonthly: 3,
    pricingNotes:
      "Verified 2026-08-17 from zenzap.co/pricing. Per-user pricing: Free $0 (unlimited group chats, built-in to-dos, scheduled messages, calendar integration, working hours, 1 GB storage, WhatsApp chat migration, AI voice-note transcription and AI in-chat search); Pro $4/user/month monthly or $3/user/month yearly (voice and video calls, task templates, team privacy settings, media controls, malware scanning, 100 GB storage, AI workspace search); Business+ $10/user/month monthly or $8/user/month yearly (integrations, API access, HIPAA compliance with signed BAA, call recording and transcription, data archiving, 10 TB storage, personal AI agents); Enterprise custom (SAML/SCIM/SSO, encryption key management, audit logs, 24/7 CSM). Flat-rate team bands are also published — for example Business+ yearly at $89 up to 20 users, $190 up to 50, $410 up to 100, and Pro yearly at $51 up to 20 and $112 up to 50 — with GBP equivalents. Yearly billing saves about 33%. External users, guests, vendors and clients are free and do not count toward the plan; 501(c)(3) non-profits, charities and public schools get a discount.",
    fixturePlans: [
      "PLAN free: name=Free; isFree=true; storageGb=1",
      "PLAN pro: name=Pro; amountPerSeat=3; currency=USD; interval=year; amountPeriod=month; storageGb=100",
      "PLAN business-plus: name=Business+; amountPerSeat=8; currency=USD; interval=year; amountPeriod=month; storageTb=10",
      "PLAN enterprise: name=Enterprise; contactSales=true",
    ],
    enrichmentPlans: [
      freePlan("free", "Free", {
        limits: {
          storageGb: 1,
          groupChats: "unlimited",
          whatsappMigration: true,
        },
        description:
          "$0 — unlimited group chats, unlimited built-in to-dos, scheduled messages, calendar integration, working hours and notifications, team access and permissions, 1 GB secure storage, WhatsApp chat migration, AI voice-note transcription and AI in-chat search.",
      }),
      planPerSeatAnnual("pro", "Pro", 3, {
        limits: {
          storageGb: 100,
          flatRateYearlyUpTo20Users: 51,
          flatRateYearlyUpTo50Users: 112,
        },
        description:
          "$3/user/month billed yearly ($4 monthly). Voice and video calls, task checklist templates, sub-task breakdown, smart task sorting, team privacy settings, media sharing controls, malware scanning, 100 GB storage, AI workspace search and message-to-task AI.",
      }),
      planPerSeatAnnual("business-plus", "Business+", 8, {
        highlighted: true,
        limits: {
          storageTb: 10,
          flatRateYearlyUpTo20Users: 89,
          flatRateYearlyUpTo50Users: 190,
          hipaaBaa: true,
        },
        description:
          "$8/user/month billed yearly ($10 monthly). Integrations with other business tools, API access, HIPAA compliance with signed BAA, enhanced privacy controls, call recording and transcription, data archiving, 10 TB storage, priority support, a personal AI agent per user and unlimited custom/internal AI agents.",
      }),
      contactSalesPlan("enterprise", "Enterprise", {
        description:
          "Custom: custom integrations, organisation chart, SAML/SCIM/SSO, encryption key management, audit logs, 24/7 enterprise CSM, tailored onboarding, custom and privately deployed AI agents.",
      }),
    ],
    featureOverrides: {
      "cloud-phone": "not-supported",
      "call-routing": "not-supported",
      "call-recording": "higher-plan-only",
      "power-dialer": "not-supported",
      "sms-messaging": "not-supported",
      "whatsapp-business": "not-supported",
      "shared-inbox": "not-supported",
      "team-messaging": "supported",
      "video-meetings": "higher-plan-only",
      "crm-cti": "higher-plan-only",
      "analytics-reporting": "limited",
      "ai-assistance": "supported",
      "unified-inbox": "limited",
    },
    aiLines: [
      "AI transcription: supported",
      "AI assistant: higher-plan-only",
      "AI summaries: limited",
      "AI automation: higher-plan-only",
    ],
    integrations: [
      { integrationSlug: "google-calendar", kind: "native", notes: "Calendar integration available on Free" },
      { integrationSlug: "zapier", kind: "api-only", notes: "Integrations and API access require Business+" },
    ],
    limitations: [
      "Integrations with other business tools and API access require Business+",
      "Voice and video calls require Pro; call recording and transcription require Business+",
      "Free tier is capped at 1 GB of secure file storage",
      "No customer-facing channels — no PSTN calling, SMS, WhatsApp Business API or shared customer inbox",
      "Reporting is limited to admin/audit surfaces rather than communication analytics",
      "Plans apply to the whole workspace — different team members cannot be on different plans",
    ],
    limitationKinds: [
      "plan-restriction",
      "plan-restriction",
      "usage-cap",
      "feature-unavailable",
      "feature-unavailable",
      "other",
    ],
    scores: {
      "ease-of-use": 9,
      "voice-messaging-quality": 6,
      "routing-workflows": 5,
      integrations: 5,
      analytics: 3,
      "outbound-tools": 2,
      scalability: 8,
      "value-for-money": 9,
      "ai-capabilities": 8,
    },
    scoreRationales: {
      "ease-of-use":
        "Zenzap’s entire pitch is “if you can text, you can Zenzap” — no training, WhatsApp chat migration, and free external guests. For frontline and multi-site teams that is the decisive adoption factor, and it is the highest ease-of-use score in this batch.",
      "voice-messaging-quality":
        "Scored on the internal messaging channel it sells: structured chats organised by project, team or site, with cloud-stored messages and files, plus voice and video calls from Pro. It carries no PSTN or customer-messaging channel, so the ceiling is lower than the phone and WhatsApp peers by design.",
      "routing-workflows":
        "Chat structure, permissions, built-in to-dos, task templates and smart task sorting give real internal workflow value, but there is no IVR, queue, assignment or customer routing model — the workflow surface is task-shaped rather than conversation-routing-shaped.",
      integrations:
        "Calendar integration is on Free, but business-tool integrations and API access are Business+ only, and custom integrations require Enterprise. That gating keeps the integrations score low relative to CRM-connected phone products.",
      analytics:
        "Published plan tables cover audit logs, archiving and admin controls rather than communication or performance analytics, so analytics is scored on evidence and is the weakest axis alongside outbound tooling.",
      "outbound-tools":
        "Zenzap does not sell broadcasts, dialers or customer outbound messaging; scheduled internal messages are the closest analogue. Scored low because the capability is genuinely absent, not because the product underperforms at its own job.",
      scalability:
        "Flat-rate bands published up to 1,000 users in both USD and GBP, free external collaborators, HIPAA/BAA on Business+, and SAML/SCIM/SSO plus encryption key management on Enterprise make growth and compliance paths clear.",
      "value-for-money":
        "A genuinely useful free tier with AI transcription and search, Pro at $3/user/month yearly, Business+ at $8 with HIPAA and AI agents, plus free guests and flat-rate team bands make this the strongest value posture in the batch for its job. Affiliate economics excluded.",
      "ai-capabilities":
        "AI voice-note transcription and in-chat search are on the free tier; AI workspace search and message-to-task come with Pro; Business+ adds a personal AI agent per user with unlimited bring-your-own and internal AI workers, and Enterprise adds privately deployed agents. Unusually deep AI packaging for a team-chat product at this price.",
    },
    bestFor: [
      "Frontline, multi-site and shift-based teams replacing personal WhatsApp groups",
      "Regulated operators (healthcare, care providers) needing HIPAA compliance with a signed BAA",
      "Owner-operators who want structured team chat with tasks at a very low per-user price",
    ],
    notIdealFor: [
      "Teams that need customer-facing calling, SMS or WhatsApp Business messaging",
      "Buyers who require deep third-party integrations without moving to Business+",
      "Organisations that want communication analytics and performance reporting",
    ],
    pros: [
      "Free tier includes AI voice-note transcription, AI in-chat search and WhatsApp chat migration",
      "Pro at $3/user/month yearly adds voice/video calls and admin controls",
      "Business+ adds HIPAA compliance with signed BAA, call recording, archiving and AI agents",
      "External users, guests, vendors and clients are free and do not count toward the plan",
      "Flat-rate team bands published up to 1,000 users in USD and GBP",
    ],
    cons: [
      "No customer-facing communication channels at all",
      "Integrations and API access are Business+ only",
      "Free tier capped at 1 GB storage",
      "No communication analytics or performance reporting",
      "Plans apply workspace-wide — no mixed-tier teams",
    ],
    keyFeatures: [
      "Structured work chat by project, team or site",
      "Built-in to-dos with templates and sub-tasks",
      "Voice and video calls (Pro)",
      "HIPAA compliance with signed BAA (Business+)",
      "Personal AI agents and AI workspace search",
      "Admin controls, one-click offboarding and data archiving",
    ],
    pricingSummary:
      "Free $0 (1 GB storage, AI transcription and in-chat search); Pro $4/user/month monthly or $3/user/month yearly (voice/video calls, 100 GB); Business+ $10/user/month monthly or $8/user/month yearly (integrations, API, HIPAA with BAA, call recording, 10 TB, AI agents); Enterprise custom. Flat-rate team bands are published too — for example Business+ yearly at $89 up to 20 users and $190 up to 50 — and yearly billing saves about 33%. External guests are free. Verified 2026-08-17 on zenzap.co/pricing.",
    whoShouldChoose:
      "Choose Zenzap when the job is getting an operational team off personal WhatsApp onto structured, company-owned work chat — especially where HIPAA or admin control matters.",
    whoShouldConsiderAlternatives:
      "Compare Aircall, CallHippo, KrispCall or Freshcaller if you actually need a business phone system, and Wati if you need to talk to customers on WhatsApp rather than organise your own team.",
    alternativeSlugs: ["wati"],
    competitorSlugs: ["wati"],
    comparableSlugs: ["wati"],
    secondaryCategorySlugs: [],
    subcategorySlugs: [],
    useCaseSlugs: [],
    teamTypeSlugs: ["operations", "founders"],
    businessSizeSlugs: ["micro", "small-business", "mid-market"],
    officialVideos: [],
    sourcesExtra: [
      {
        id: "zenzap-home",
        url: "https://www.zenzap.co/",
        title: "Zenzap — The Professional Work Chat App",
        domains: ["identity", "product-positioning", "features", "security-compliance"],
      },
    ],
  },
  {
    slug: "fastmail",
    name: "Fastmail",
    company: "Fastmail Pty Ltd",
    website: "https://www.fastmail.com",
    domain: "fastmail.com",
    pricingUrl: "https://www.fastmail.com/pricing/",
    aliases: [],
    membershipRole: "adjacent",
    adjacentNote:
      "Adjacent to business communications: Fastmail is a private email, calendar and contacts provider, not a phone, WhatsApp or team-chat platform. It is never a best-page phone peer and scores low on voice, routing, outbound and analytics criteria by design.",
    jobCluster: "inbox-adjacent",
    softShortDescription:
      "Privacy-focused business email, calendar and contacts with custom domains and shared addresses — Business Basic from $3/user/month annual; adjacent to business communications, not a phone system.",
    shortDescription:
      "Fastmail is an independent, privacy-focused email, calendar and contacts provider with custom business domains, shared addresses like support@, shared calendars and a shared company address book. In a business-communications context it is adjacent tooling: it handles the email channel and internal coordination, not voice, WhatsApp or team chat. Business plans start at $3/user/month on annual billing with a 30-day trial.",
    vendorPositioning:
      "Premium, private email with your own domain — expert human support, all Fastmail apps, offline support, scheduled send, and powerful admin controls for business accounts.",
    pricingModel: "subscription",
    hasFreePlan: false,
    hasFreeTrial: true,
    trialDays: 30,
    startingPriceMonthly: 3,
    pricingNotes:
      "Verified 2026-08-17 from fastmail.com/pricing. Business (per user/month): Basic $4 monthly or $3 annually ($36/12 months), 5 GB mail plus 1 GB files; Standard $6 monthly or $5 annually ($60/12 months), 50 GB mail plus 10 GB files, shared addresses, shared calendars and shared company address book; Professional $10 monthly or $9 annually ($108/12 months), 100 GB mail plus 50 GB files with an email retention archive for legal compliance. Longer 24- and 36-month cycles reduce the monthly rate further (for example Standard at $4.75 and $4.67). Individual & Family plans are separate: Individual $6/month or $5 annually ($60/12 months), Duo $10/$8, Family $14/$11. Business plans offer a free trial of up to 30 days.",
    fixturePlans: [
      "PLAN business-basic: name=Business Basic; amountPerSeat=3; currency=USD; interval=year; amountPeriod=month; mailStorageGb=5",
      "PLAN business-standard: name=Business Standard; amountPerSeat=5; currency=USD; interval=year; amountPeriod=month; mailStorageGb=50",
      "PLAN business-professional: name=Business Professional; amountPerSeat=9; currency=USD; interval=year; amountPeriod=month; mailStorageGb=100",
      "PLAN individual: name=Individual; amount=5; currency=USD; interval=year; amountPeriod=month",
    ],
    enrichmentPlans: [
      planPerSeatAnnual("business-basic", "Business Basic", 3, {
        hasFreeTrial: true,
        trialDays: 30,
        limits: { mailStorageGb: 5, fileStorageGb: 1 },
        description:
          "$3/user/month billed annually ($4 monthly; $36 for 12 months). 5 GB for mail, calendar and contacts plus 1 GB file storage, custom business addresses on your domain, 24/7 human support.",
      }),
      planPerSeatAnnual("business-standard", "Business Standard", 5, {
        highlighted: true,
        hasFreeTrial: true,
        trialDays: 30,
        limits: { mailStorageGb: 50, fileStorageGb: 10 },
        description:
          "$5/user/month billed annually ($6 monthly; $60 for 12 months). 50 GB mail plus 10 GB files, shared email addresses like support@, layered shared calendars, shared company address book, offline support, scheduled send and snooze.",
      }),
      planPerSeatAnnual("business-professional", "Business Professional", 9, {
        hasFreeTrial: true,
        trialDays: 30,
        limits: { mailStorageGb: 100, fileStorageGb: 50 },
        description:
          "$9/user/month billed annually ($10 monthly; $108 for 12 months). 100 GB mail plus 50 GB files and an email retention archive for legal compliance.",
      }),
      planFlatAnnual("individual", "Individual", 5, {
        limits: { mailStorageGb: 50, fileStorageGb: 10 },
        description:
          "$5/month billed annually ($6 monthly; $60 for 12 months) for a single mailbox with premium email, calendar and contacts.",
      }),
    ],
    featureOverrides: {
      "cloud-phone": "not-supported",
      "call-routing": "not-supported",
      "call-recording": "not-supported",
      "power-dialer": "not-supported",
      "sms-messaging": "not-supported",
      "whatsapp-business": "not-supported",
      "shared-inbox": "limited",
      "team-messaging": "not-supported",
      "video-meetings": "not-supported",
      "crm-cti": "not-supported",
      "analytics-reporting": "not-supported",
      "ai-assistance": "not-supported",
      "unified-inbox": "limited",
    },
    aiLines: [
      "AI assistant: not-supported",
      "AI summaries: not-supported",
      "AI automation: not-supported",
    ],
    integrations: [
      { integrationSlug: "dropbox", kind: "native" },
      { integrationSlug: "1password", kind: "native" },
      { integrationSlug: "outlook", kind: "third-party", notes: "Use with third-party mail apps via standard protocols" },
    ],
    limitations: [
      "Not a business phone, WhatsApp or team-chat product — adjacent to business communications",
      "Shared addresses, shared calendars and the shared address book require Standard or above",
      "Basic is capped at 5 GB mail and 1 GB file storage",
      "No CRM/CTI logging, call analytics or conversation reporting",
      "No AI assistance documented in the published plans",
      "Email retention archive for legal compliance is Professional-only",
    ],
    limitationKinds: [
      "feature-unavailable",
      "plan-restriction",
      "usage-cap",
      "feature-unavailable",
      "feature-unavailable",
      "plan-restriction",
    ],
    scores: {
      "ease-of-use": 8,
      "voice-messaging-quality": 4,
      "routing-workflows": 5,
      integrations: 5,
      analytics: 2,
      "outbound-tools": 2,
      scalability: 6,
      "value-for-money": 8,
      "ai-capabilities": 2,
    },
    scoreRationales: {
      "ease-of-use":
        "Clean web and mobile apps, standards-based access from third-party clients, offline support and scheduled send make Fastmail straightforward for small teams; admin controls are documented for business accounts. Adjacent product — scored on its own job.",
      "voice-messaging-quality":
        "Scored low by design: Fastmail carries the email channel only, with no voice, SMS or WhatsApp capability. This is a category-fit statement, not a quality criticism of the mail service.",
      "routing-workflows":
        "Shared addresses such as support@, layered shared calendars and mail rules provide light coordination, but there is no assignment, queueing or agent-routing model.",
      integrations:
        "Standards-based access (works with Outlook, iPhone Mail and similar) plus 1Password and Dropbox integrations. No CRM/CTI connectors, which is what the business-communications integrations criterion measures.",
      analytics:
        "No communication analytics or reporting is documented in the published plans.",
      "outbound-tools":
        "No broadcast, dialer or campaign tooling — Fastmail is a mailbox, not an outbound engagement platform.",
      scalability:
        "Per-user business plans with mix-and-match tiers, custom domains and multi-year terms scale for small and mid-size teams, without contact-centre or enterprise comms capabilities.",
      "value-for-money":
        "Business Basic at $3/user/month annual and Standard at $5 with shared addresses and calendars is inexpensive for privacy-focused business mail, and 24/36-month terms cut it further. A 30-day trial lowers evaluation risk. Affiliate economics excluded.",
      "ai-capabilities":
        "No AI assistance is documented in the published plan tables, so this is scored on evidence rather than assumed.",
    },
    bestFor: [
      "Small teams that want private, independent business email on their own domain",
      "Owner-operators who need shared support@ addresses and shared calendars cheaply",
      "Buyers who need an email retention archive for legal compliance (Professional)",
    ],
    notIdealFor: [
      "Anyone shortlisting a business phone system, WhatsApp platform or team-chat tool",
      "Teams needing CRM logging, call analytics or agent routing",
      "Buyers expecting AI inbox assistance in the base product",
    ],
    pros: [
      "Business Basic from $3/user/month on annual billing",
      "Shared addresses, shared calendars and shared address book on Standard",
      "Email retention archive for legal compliance on Professional",
      "Works with third-party mail apps and integrates with 1Password and Dropbox",
      "Up to 30-day free trial on business plans",
    ],
    cons: [
      "Adjacent to business communications — no voice, SMS, WhatsApp or team chat",
      "Sharing features require Standard or above",
      "Basic storage is small (5 GB mail, 1 GB files)",
      "No AI assistance in published plans",
      "No CRM/CTI or conversation analytics",
    ],
    keyFeatures: [
      "Business email on custom domains",
      "Shared addresses like support@ (Standard)",
      "Shared calendars and company address book",
      "Email retention archive (Professional)",
      "Offline support, scheduled send and snooze",
    ],
    pricingSummary:
      "Business per user/month: Basic $4 monthly / $3 annually; Standard $6 / $5; Professional $10 / $9, with 24- and 36-month terms cheaper again. Individual & Family plans are separate ($6/$5 Individual, $10/$8 Duo, $14/$11 Family). Business plans include a free trial of up to 30 days. Verified 2026-08-17 on fastmail.com/pricing.",
    whoShouldChoose:
      "Choose Fastmail when you want private, independent business email with shared addresses and calendars — and treat it as adjacent to, not a substitute for, a phone or messaging platform.",
    whoShouldConsiderAlternatives:
      "For business communications proper, compare Aircall, CallHippo, KrispCall or Freshcaller for voice, Wati for WhatsApp, and Zenzap for team chat.",
    alternativeSlugs: ["sanebox"],
    competitorSlugs: ["sanebox"],
    comparableSlugs: ["sanebox"],
    secondaryCategorySlugs: [],
    subcategorySlugs: [],
    useCaseSlugs: [],
    teamTypeSlugs: ["operations", "founders"],
    businessSizeSlugs: ["micro", "small-business"],
    officialVideos: [],
    sourcesExtra: [
      {
        id: "fastmail-business",
        url: "https://www.fastmail.com/for-business/",
        title: "Fastmail for Business",
        domains: ["features", "product-positioning"],
      },
    ],
  },
  {
    slug: "sanebox",
    name: "SaneBox",
    company: "SaneBox, Inc.",
    website: "https://www.sanebox.com",
    domain: "sanebox.com",
    pricingUrl: "https://www.sanebox.com/pricing",
    aliases: [],
    membershipRole: "adjacent",
    adjacentNote:
      "Adjacent to business communications: SaneBox is per-person inbox triage that sits on top of an existing mailbox (Gmail, Outlook, iCloud, any IMAP). It is not a phone, WhatsApp or team-chat platform and is never a best-page phone peer.",
    jobCluster: "inbox-adjacent",
    softShortDescription:
      "Per-person email triage that filters existing mailboxes into SaneLater/SaneBlackHole folders — Snack, Lunch and Dinner tiers with 1, 2 and 4 mailbox caps; adjacent to business communications.",
    shortDescription:
      "SaneBox is inbox-productivity tooling that layers onto an existing mailbox — Gmail, Outlook, Yahoo, iCloud or any IMAP account — and triages incoming mail into folders such as SaneLater, SaneBlackHole and SaneAttachments, with follow-up reminders on higher tiers. Plans are per person rather than per organisation and are gated by mailbox count: Snack (1), Lunch (2) and Dinner (4). In a business-communications context it is adjacent tooling, not a communication channel.",
    vendorPositioning:
      "A clean, distraction-free inbox in less than five minutes — email management that works with any inbox and learns what matters to you.",
    pricingModel: "subscription",
    hasFreePlan: false,
    hasFreeTrial: true,
    trialDays: 7,
    startingPriceMonthly: 4.92,
    startingPriceConfidence: "medium",
    pricingNotes:
      "Verified 2026-08-17 from sanebox.com help centre (plan structure) plus published pricing research. Three per-person tiers gated by mailbox count: Snack (1 email account, core folders), Lunch (2 accounts, more SaneFolders plus SaneReminders) and Dinner (4 accounts, all features including SaneAttachments). Widely published rates are $7/month or $59/year for Snack, $12/month or $99/year for Lunch, and $36/month or $299/year for Dinner, with two-year cycles cheaper again; annual billing saves roughly 20–30%. There is no free tier. Trial length is stated inconsistently across first-party surfaces — the help centre describes a 7-day free trial while signup pages advertise 14 days — so trial length is recorded at medium confidence. Educational, non-profit and government organisations can get 25% off, and referrals earn account credit. Billing is per person; there is no team or family plan.",
    fixturePlans: [
      "PLAN snack: name=Snack; amount=4.92; currency=USD; interval=year; amountPeriod=month; emailAccounts=1",
      "PLAN lunch: name=Lunch; amount=8.25; currency=USD; interval=year; amountPeriod=month; emailAccounts=2",
      "PLAN dinner: name=Dinner; amount=24.92; currency=USD; interval=year; amountPeriod=month; emailAccounts=4",
    ],
    enrichmentPlans: [
      planFlatAnnual("snack", "Snack", 4.92, {
        hasFreeTrial: true,
        trialDays: 7,
        limits: { emailAccounts: 1, annualPrice: 59, monthlyPrice: 7 },
        description:
          "About $4.92/month billed annually ($59/year; $7 month-to-month). One email account with core folders such as SaneLater and SaneBlackHole.",
      }),
      planFlatAnnual("lunch", "Lunch", 8.25, {
        highlighted: true,
        hasFreeTrial: true,
        trialDays: 7,
        limits: { emailAccounts: 2, annualPrice: 99, monthlyPrice: 12 },
        description:
          "About $8.25/month billed annually ($99/year; $12 month-to-month). Two email accounts, more SaneFolders and SaneReminders follow-up tracking.",
      }),
      planFlatAnnual("dinner", "Dinner", 24.92, {
        hasFreeTrial: true,
        trialDays: 7,
        limits: { emailAccounts: 4, annualPrice: 299, monthlyPrice: 36 },
        description:
          "About $24.92/month billed annually ($299/year; $36 month-to-month). Four email accounts and every SaneBox feature, including SaneAttachments and the full folder set.",
      }),
    ],
    featureOverrides: {
      "cloud-phone": "not-supported",
      "call-routing": "not-supported",
      "call-recording": "not-supported",
      "power-dialer": "not-supported",
      "sms-messaging": "not-supported",
      "whatsapp-business": "not-supported",
      "shared-inbox": "not-supported",
      "team-messaging": "not-supported",
      "video-meetings": "not-supported",
      "crm-cti": "not-supported",
      "analytics-reporting": "limited",
      "ai-assistance": "limited",
      "unified-inbox": "limited",
    },
    aiLines: [
      "AI automation: limited",
      "AI assistant: limited",
      "AI summaries: not-supported",
    ],
    integrations: [
      { integrationSlug: "gmail", kind: "native" },
      { integrationSlug: "outlook", kind: "native" },
      { integrationSlug: "icloud", kind: "native", notes: "Works with any IMAP mailbox" },
    ],
    limitations: [
      "Not a communication channel — SaneBox triages an existing mailbox and adds no voice, SMS, WhatsApp or chat",
      "Billing is per person with no team or family plan, so multi-user rollouts multiply cost",
      "Mailbox caps drive upgrades: 1 account on Snack, 2 on Lunch, 4 on Dinner",
      "No free tier — evaluation is trial-only",
      "Trial length is stated inconsistently across first-party surfaces (7 vs 14 days)",
      "SaneReminders and SaneAttachments are gated to higher tiers",
    ],
    limitationKinds: [
      "feature-unavailable",
      "high-cost-at-scale",
      "usage-cap",
      "other",
      "other",
      "plan-restriction",
    ],
    scores: {
      "ease-of-use": 8,
      "voice-messaging-quality": 3,
      "routing-workflows": 6,
      integrations: 4,
      analytics: 3,
      "outbound-tools": 2,
      scalability: 4,
      "value-for-money": 6,
      "ai-capabilities": 5,
    },
    scoreRationales: {
      "ease-of-use":
        "Setup is a mailbox connection rather than a migration, and triage runs through ordinary IMAP folders that work in any client — the vendor pitch of a clean inbox in under five minutes. Adjacent product, scored on its own job.",
      "voice-messaging-quality":
        "Scored low by category fit: SaneBox has no voice, SMS or WhatsApp channel at all. This is a scope statement, not a criticism of its filtering.",
      "routing-workflows":
        "Automated triage into SaneLater, SaneBlackHole and SaneAttachments plus SaneReminders follow-up tracking is genuine inbound workflow automation — the strongest of its business-communications criteria — but it routes mail to folders, not conversations to agents.",
      integrations:
        "Works with Gmail, Outlook, Yahoo, iCloud and any IMAP mailbox, which is broad for its job, but there are no CRM/CTI connectors, which is what this criterion measures.",
      analytics:
        "Digest-style summaries of filtered mail exist, but there is no communication or performance reporting.",
      "outbound-tools":
        "No sending, broadcast or campaign capability — SaneBox only acts on incoming mail.",
      scalability:
        "Per-person billing with 1/2/4 mailbox caps and no team plan makes organisation-wide rollout expensive and administratively manual.",
      "value-for-money":
        "About $4.92/month annually for one mailbox is cheap individually, but the absence of a free tier, per-person billing and a $299/year Dinner tier weaken value for teams. Affiliate economics excluded.",
      "ai-capabilities":
        "Filtering that learns from user corrections is real automation, but there is no documented AI assistant, summarisation or drafting layer, so this sits mid-scale.",
    },
    bestFor: [
      "Individuals and small teams drowning in inbound email who want automatic triage",
      "Professionals tracking outstanding replies with SaneReminders (Lunch and above)",
      "People managing multiple mailboxes who want one triage layer across them (Dinner)",
    ],
    notIdealFor: [
      "Anyone shortlisting a phone system, WhatsApp platform or team-chat tool",
      "Organisations wanting centrally billed team-wide deployment",
      "Buyers who need a free tier before committing",
    ],
    pros: [
      "Works on top of any existing mailbox (Gmail, Outlook, Yahoo, iCloud, IMAP)",
      "Automatic triage into SaneLater, SaneBlackHole and SaneAttachments",
      "SaneReminders follow-up tracking from the Lunch tier",
      "Annual billing cuts about 20–30% off monthly rates",
      "25% discount for educational, non-profit and government organisations",
    ],
    cons: [
      "Adjacent to business communications — no voice, messaging or chat channel",
      "Per-person billing with no team plan",
      "Mailbox caps of 1 / 2 / 4 force tier upgrades",
      "No free tier; trial length is inconsistently documented",
      "Dinner at $299/year is expensive for a filtering layer",
    ],
    keyFeatures: [
      "Automatic inbound email triage",
      "SaneLater and SaneBlackHole folders",
      "SaneReminders follow-up tracking (Lunch)",
      "SaneAttachments and full folder set (Dinner)",
      "Works with any IMAP mailbox",
    ],
    pricingSummary:
      "Three per-person tiers gated by mailbox count: Snack (1 account) about $7/month or $59/year; Lunch (2 accounts) about $12/month or $99/year; Dinner (4 accounts) about $36/month or $299/year, with two-year cycles cheaper again. No free tier, and trial length is documented inconsistently (7 days on the help centre, 14 on signup pages). Educational, non-profit and government buyers get 25% off. Verified 2026-08-17.",
    whoShouldChoose:
      "Choose SaneBox when the problem is inbound email volume on mailboxes you already have — and treat it as adjacent to, not part of, your business communications stack.",
    whoShouldConsiderAlternatives:
      "For business communications proper, compare Aircall, CallHippo, KrispCall or Freshcaller for voice, Wati for WhatsApp, and Zenzap for team chat; consider Fastmail if you want to replace the mailbox itself.",
    alternativeSlugs: ["fastmail"],
    competitorSlugs: ["fastmail"],
    comparableSlugs: ["fastmail"],
    secondaryCategorySlugs: [],
    subcategorySlugs: [],
    useCaseSlugs: [],
    teamTypeSlugs: ["operations", "founders"],
    businessSizeSlugs: ["solo", "micro", "small-business"],
    officialVideos: [],
    sourcesExtra: [
      {
        id: "sanebox-plans-help",
        url: "https://www.sanebox.com/help/201-which-subscription-plans-can-i-choose-from",
        title: "SaneBox — Which Subscription Plans Can I Choose From?",
        domains: ["plans", "pricing", "free-trial", "limits"],
      },
    ],
  },
];

/** Weighted overall score on the 0–10 scale (BC weights sum to 100). */
function weightedScore(scores) {
  const total = BC_CRITERIA.reduce(
    (sum, criterion) => sum + scores[criterion] * BC_CRITERION_WEIGHTS[criterion],
    0,
  );
  return Math.round((total / 100) * 10) / 10;
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
      notes: `First-party product positioning for ${p.name} (business-communications Wave-1 onboarding 2026-08-17).`,
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
JOB_CLUSTER: ${p.jobCluster}

${p.fixturePlans.join("\n")}
`;
}

function buildProductFixture(p) {
  const featureLines = BC_FEATURES.map(
    (f) => `FEATURE ${f}: ${featureAvailability(p, f)}`,
  ).join("\n");
  const ai = (p.aiLines ?? ["AI assistant: unknown"]).join("\n");
  const adjacent =
    p.membershipRole === "adjacent"
      ? `\nADJACENT: true\nADJACENT_NOTE: ${p.adjacentNote}\n`
      : "";
  return `# FIXTURE SNAPSHOT — structured from first-party research (2026-08-17)

SHORT_DESCRIPTION: ${p.shortDescription}
VENDOR_POSITIONING: ${p.vendorPositioning}
MEMBERSHIP_ROLE: ${p.membershipRole}
JOB_CLUSTER: ${p.jobCluster}${adjacent}
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
    useCaseIds: p.useCaseSlugs?.slice(0, 2) ?? [],
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
    purpose: `Official ${p.name} product video for business-communications Wave-1 onboarding`,
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
  const availability = (idx === -1 ? "unknown" : cleaned.slice(idx + 1)).trim();
  return { capability, availability: availability || "unknown" };
}

function supportingFeatureForCriterion(criterionSlug) {
  const map = {
    "ease-of-use": "shared-inbox",
    "voice-messaging-quality": "cloud-phone",
    "routing-workflows": "call-routing",
    integrations: "crm-cti",
    analytics: "analytics-reporting",
    "outbound-tools": "power-dialer",
    scalability: "unified-inbox",
    "value-for-money": "cloud-phone",
    "ai-capabilities": "ai-assistance",
  };
  return map[criterionSlug] ?? "cloud-phone";
}

function buildEnrichment(p) {
  const slugs = planSlugs(p);
  const featureSupport = BC_FEATURES.map((featureSlug) => ({
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

  const primaryTeamType = p.teamTypeSlugs?.[0] ?? "operations";
  const editorialFit = (p.businessSizeSlugs ?? []).map((businessSizeSlug) => {
    const strength =
      p.membershipRole === "adjacent"
        ? "weak"
        : businessSizeSlug === "enterprise" || businessSizeSlug === "solo"
          ? "moderate"
          : "strong";
    return {
      businessSizeSlug,
      teamTypeSlug: primaryTeamType,
      strength,
      rationale: `${p.name} fit for ${businessSizeSlug} ${primaryTeamType} teams in the ${p.jobCluster} job cluster, from first-party positioning and business-communications Wave-1 research${
        p.membershipRole === "adjacent"
          ? " (adjacent tool — not a phone or customer-messaging peer)"
          : ""
      }.`,
      isEditorial: true,
    };
  });

  const notesParts = [
    `Business-communications Wave-1 onboarding enrichment from first-party research ${VERIFIED_AT}. handsOnTesting=false.`,
    `membershipRole=${p.membershipRole}. jobCluster=${p.jobCluster}.`,
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

function factBase(p, id, domain, field, value, sourceId, excerpt, locator, confidence) {
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
    confidence: confidence ?? "medium",
    status: "approved",
    isFixture: true,
    notes: "Business-communications Wave-1 first-party research extract",
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
      `fact-${p.slug}-positioning.jobCluster`,
      "product-positioning",
      "positioning.jobCluster",
      p.jobCluster,
      productSrc,
      `Business-communications job cluster: ${p.jobCluster}`,
      "JOB_CLUSTER",
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
      `hasFreeTrial=${p.hasFreeTrial}${p.trialDays ? ` (${p.trialDays} days)` : ""}`,
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
        `Starting ~$${p.startingPriceMonthly}/month where published`,
        undefined,
        p.startingPriceConfidence,
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
  for (const featureSlug of BC_FEATURES) {
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
  return BC_CRITERIA.map((criterionSlug) => {
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
    if (criterionSlug === "scalability") {
      supportingFactIds[0] = `fact-${p.slug}-pricing.plans.${planSlugs(p)[0]}`;
      supportingFactIds.push(
        `fact-${p.slug}-pricing.plans.${planSlugs(p)[planSlugs(p).length - 1]}`,
      );
    }
    if (criterionSlug === "integrations") {
      supportingFactIds.push(`fact-${p.slug}-positioning.vendorClaim`);
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

const OVERALL_RATIONALE =
  "Weighted average of the nine business-communications editorial criteria using the category weights (voice/messaging quality 15, routing & workflows 14, integrations 14, ease of use 12, value 10, analytics 10, scalability 9, outbound tools 8, AI 8), rounded to 1 decimal. Products are scored inside their job cluster — phone systems, WhatsApp messaging platforms, team chat and adjacent inbox tools are not forced into one undifferentiated ranking, so a WhatsApp BSP is not penalised for lacking IVR depth and adjacent tools score low on voice criteria by design. Not a hands-on lab score, and affiliate economics are excluded.";

function buildAssessment(p) {
  const overallScore = weightedScore(p.scores);
  const criterionAssessments = buildCriterionAssessments(p);
  const adjacentBit =
    p.membershipRole === "adjacent"
      ? " Marked adjacent — not a phone or customer-messaging peer for best-page ranking."
      : "";
  return {
    id: `assessment-${p.slug}-business-communications-v1`,
    productSlug: p.slug,
    methodologySlug: "business-communications-editorial",
    methodologyVersion: "1.0.0",
    status: "approved",
    verdict: `${p.name}: ${p.whoShouldChoose}${adjacentBit} Scores use the business-communications editorial methodology from first-party research as of 2026-08-17 — not hands-on product testing.`,
    strengths: p.pros.slice(0, 5),
    weaknesses: p.cons.slice(0, 5),
    bestFor: p.bestFor,
    notIdealFor: p.notIdealFor,
    tradeoffs: [
      "Entry price and seat minimums vs routing, CTI and analytics depth",
      "Bundled minutes or messages vs pay-as-you-go usage billing",
      "Single-channel specialisation (voice, WhatsApp, team chat) vs one undifferentiated comms suite",
      "Included AI vs AI sold as a per-seat or per-minute add-on",
    ],
    recommendation: `${p.whoShouldChoose} ${p.whoShouldConsiderAlternatives}`,
    editorialNotes: `Business-communications Wave-1 batch. Approved on business-communications-editorial v1.0.0. membershipRole=${p.membershipRole}. jobCluster=${p.jobCluster}. handsOnTesting=false. Affiliate economics excluded.${
      p.adjacentNote ? ` ${p.adjacentNote}` : ""
    }`,
    handsOnTesting: false,
    confidence: "medium",
    criterionAssessments,
    overallScore,
    overallScoreRationale: OVERALL_RATIONALE,
    scoreAudit: [
      {
        at: VERIFIED_AT,
        actor: "editorial",
        change:
          "Business-communications Wave-1 onboarding; approved BC criteria with category weights; handsOnTesting=false",
        nextOverall: overallScore,
      },
    ],
    reviewedAt: VERIFIED_AT,
    reviewer: "editorial",
    createdAt: VERIFIED_AT,
    updatedAt: VERIFIED_AT,
  };
}

const CLUSTER_LABELS = {
  "cloud-phone": "a cloud business phone system",
  "customer-messaging": "a WhatsApp Business / customer messaging platform",
  "team-messaging": "a team messaging / work chat platform",
  "inbox-adjacent":
    "an adjacent inbox tool (email channel and triage — not a phone, WhatsApp or team-chat platform)",
};

function buildReview(p) {
  const overallScore = weightedScore(p.scores);
  const criterionAssessments = buildCriterionAssessments(p);
  const researchSourceIds = [
    `${p.slug}-product-official`,
    `${p.slug}-pricing-official`,
    ...(p.sourcesExtra ?? []).map((s) => s.id),
  ];
  const comparisonSlugs = (p.alternativeSlugs ?? []).map((alt) =>
    comparisonSlugPair(p.slug, alt),
  );
  const roleLabel = CLUSTER_LABELS[p.jobCluster] ?? "business communications software";

  return {
    id: `review-${p.slug}-v1`,
    productSlug: p.slug,
    assessmentId: `assessment-${p.slug}-business-communications-v1`,
    editorialStatus: "approved",
    title: `${p.name} Review (2026)`,
    h1: `${p.name} Review`,
    intro: `${p.name} is evaluated here as ${roleLabel} — ${p.shortDescription} This review uses SoftwareGlimpse’s business-communications methodology (ease of use, voice/messaging quality, routing and workflows, integrations, analytics, outbound tools, scalability, value, AI), scoring products inside their job cluster rather than against unrelated peers. It is based on first-party research, not hands-on lab testing.`,
    summary: p.whoShouldChoose,
    verdict: `${p.whoShouldChoose} ${p.whoShouldConsiderAlternatives} Scores reflect first-party documentation as of 2026-08-17 — not hands-on product testing. Confirm current packaging, minimums and usage rates on the vendor site before purchase.`,
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
    methodologySlug: "business-communications-editorial",
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
          ...planSlugs(p).map((s) => `fact-${p.slug}-pricing.plans.${s}`),
        ],
      },
      {
        section: "overview",
        factIds: [
          `fact-${p.slug}-identity.shortDescription`,
          `fact-${p.slug}-positioning.vendorClaim`,
          `fact-${p.slug}-positioning.jobCluster`,
        ],
      },
      {
        section: "features",
        factIds: BC_FEATURES.map((f) => `fact-${p.slug}-features.${f}`),
      },
    ],
    faq: [
      {
        question: `Is ${p.name} a business phone system?`,
        answer:
          p.jobCluster === "cloud-phone"
            ? `Yes. ${p.name} is a cloud business phone system: virtual numbers, inbound and outbound calling, softphone apps and call routing. It is not a CRM of record — keep your CRM and connect it for call logging.`
            : p.jobCluster === "customer-messaging"
              ? `No. ${p.name} is a WhatsApp Business / customer messaging platform. If you need IVR, queues and PSTN calling, pair it with a cloud phone system such as Aircall, CallHippo, KrispCall or Freshcaller.`
              : p.jobCluster === "team-messaging"
                ? `No. ${p.name} is internal team messaging. It does not provide business phone numbers, IVR or customer messaging channels — pair it with a phone or WhatsApp platform if you need those.`
                : `No. ${p.name} is adjacent tooling for the email channel. It provides no voice, SMS, WhatsApp or team-chat capability, so it is not a business phone or messaging platform.`,
      },
      {
        question: `How is ${p.name} priced?`,
        answer: p.pricingSummary,
      },
      {
        question: `Does ${p.name} have a free plan or free trial?`,
        answer: `${p.hasFreePlan ? "Yes — a free plan is published." : "No free plan is published."} ${
          p.hasFreeTrial
            ? `A free trial is documented${p.trialDays ? ` (about ${p.trialDays} days)` : ""}.`
            : "No free trial is documented on the pricing page."
        } Confirm current terms with the vendor.`,
      },
      {
        question: `Did SoftwareGlimpse personally test ${p.name}?`,
        answer:
          "No. This review is based on first-party product and pricing research evidence, not hands-on product usage. Affiliate relationships never influence scores.",
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
        id: "features",
        heading: "Feature coverage",
        body: BC_FEATURES.map(
          (f) => `• ${f}: ${featureAvailability(p, f)}`,
        ).join("\n"),
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
      title: `${p.name} Review (2026) — Business Communications`,
      description: `${p.name} business communications review on SoftwareGlimpse: strengths, trade-offs, pricing posture, and who should buy.`,
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
    primaryCategorySlug: "business-communications",${secondary}
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
      id: `job-${p.slug}-business-communications-wave1`,
      productSlug: p.slug,
      status: "completed",
      createdAt: VERIFIED_AT,
      completedAt: VERIFIED_AT,
      notes: `Business-communications Wave-1 batch; membershipRole=${p.membershipRole}; jobCluster=${p.jobCluster}`,
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
    `✓ ${p.slug}  overall=${assessment.overallScore}  role=${p.membershipRole}  cluster=${p.jobCluster}`,
  );
}

function writeSeedSnippet(products) {
  const out = path.join(ROOT, "scripts/_bc-wave1-seed-snippet.ts");
  const body = `// Auto-generated by scripts/onboard-bc-wave1-batch.mjs
// Append into src/data/seed/software.ts before the closing ]; of softwareSeed
// via: node scripts/patch-software-seed-bc.mjs
// Business-communications Wave 1+2: aircall, callhippo, krispcall, freshcaller,
// wati, zenzap (BC primary) plus fastmail, sanebox (adjacent).

${products.map(softSnippet).join("\n")}
`;
  writeText(out, body);
  console.log(`✓ seed snippet → ${path.relative(ROOT, out)}`);
}

/** Comparison inputs for the phone cluster (materialized into comparisons seed). */
function writeComparisonSpec(products) {
  const bySlug = new Map(products.map((p) => [p.slug, p]));
  const pairs = [
    ["aircall", "callhippo"],
    ["aircall", "krispcall"],
    ["callhippo", "krispcall"],
    ["aircall", "freshcaller"],
  ];
  const spec = pairs
    .filter(([a, b]) => bySlug.has(a) && bySlug.has(b))
    .map(([a, b]) => {
      const pa = bySlug.get(a);
      const pb = bySlug.get(b);
      return {
        slug: comparisonSlugPair(a, b),
        a,
        b,
        labels: { a: pa.name, b: pb.name },
        scoresA: pa.scores,
        scoresB: pb.scores,
        overallA: weightedScore(pa.scores),
        overallB: weightedScore(pb.scores),
        startingPricing: {
          a: pa.startingPriceMonthly,
          b: pb.startingPriceMonthly,
        },
      };
    });
  writeJson(path.join(ROOT, "scripts/_bc-wave1-comparisons.json"), spec);
  console.log(`✓ comparison specs → ${spec.length} pairs`);
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
  writeJson(path.join(ROOT, "scripts/_bc-wave1-official-videos.json"), videos);
  console.log(`✓ video specs → ${videos.length} videos`);
}

function main() {
  for (const p of PRODUCTS) writeProduct(p);
  writeSeedSnippet(PRODUCTS);
  writeComparisonSpec(PRODUCTS);
  writeVideoImportSpec(PRODUCTS);
  console.log("\nNext:");
  console.log("  1. node scripts/patch-software-seed-bc.mjs (append soft() entries)");
  console.log("  2. Verify src/data/seed/software.ts count (89 baseline + 8 = 97)");
  console.log("  3. Add BC comparisons to src/data/seed/comparisons.ts");
  console.log("  4. Add brand logos under public/brands/{slug}.png");
  console.log("  5. Content quality audit — product-review CQ target ≥75");
  console.log("  6. Leave best.ts to the BC best-page owner; no WordPress auto-publish");
}

main();
