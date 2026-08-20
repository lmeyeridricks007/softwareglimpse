/**
 * Sales Intelligence Priority-4 — optional / adjacent products.
 * Adapt.io (regional contact DB peer — landscape).
 * Outreach, Salesloft (SEP — landscape only).
 * Instantly, Lemlist, Smartlead (cold-email infra — landscape only).
 * Gong (conversation intelligence — landscape only).
 *
 * Pricing floors verified 2026-08-17 via first-party pricing pages.
 * Affiliate economics never enter scores. handsOnTesting=false.
 */
import {
  contactSalesPlan,
  freePlan,
  planPerSeat,
} from "./si-onboard-runtime.mjs";

/** @type {object[]} */
export const PRODUCTS = [
  {
    slug: "adapt-io",
    name: "Adapt.io",
    company: "Adapt.io",
    website: "https://www.adapt.io",
    domain: "adapt.io",
    pricingUrl: "https://www.adapt.io/pricing",
    aliases: ["Adapt", "Adapt.io"],
    membershipRole: "landscape",
    softShortDescription:
      "Regional B2B contact database with credit plans — Free; Starter $49/mo; Basic $99/mo; Custom contact sales; 7-day trial.",
    shortDescription:
      "B2B sales intelligence contact and company database with email/phone credits, Chrome extension, list building, and CRM export — Free through Basic published plans plus Custom packaging and a 7-day free trial.",
    vendorPositioning:
      "Adapt.io helps sales teams find verified B2B emails and contacts with credit-based pricing (not seat licenses) and CRM export.",
    pricingModel: "subscription",
    hasFreePlan: true,
    hasFreeTrial: true,
    trialDays: 7,
    startingPriceMonthly: 49,
    pricingNotes:
      "First-party pricing verified 2026-08-17 on adapt.io/pricing: Free $0 (25 email + 25 enrichment credits, 25 contacts/day); Starter $49/mo (500 email + 500 enrichment, 50/day); Basic $99/mo (1,000 email + 100 phone + 1,000 enrichment, 100/day); Custom contact sales. 7-day free trial (no card). Annual saves ~20%. Confirm live credits and limits.",
    pricingSummary:
      "Free plan; Starter $49/mo; Basic $99/mo; Custom contact sales. 7-day free trial. Credit-based (not seat-licensed). Confirm on adapt.io/pricing.",
    fixturePlans: [
      "PLAN free: name=Free; isFree=true; currency=USD; interval=month; billingInterval=month",
      "PLAN starter: name=Starter; amountPerSeat=49; currency=USD; interval=month; billingInterval=month; unit=seat",
      "PLAN basic: name=Basic; amountPerSeat=99; currency=USD; interval=month; billingInterval=month; unit=seat",
      "PLAN custom: name=Custom; contactSales=true; currency=USD; interval=month; billingInterval=month; unit=seat",
    ],
    enrichmentPlans: [
      freePlan("free", "Free"),
      planPerSeat("starter", "Starter", 49, {
        hasFreeTrial: true,
        trialDays: 7,
        highlighted: true,
      }),
      planPerSeat("basic", "Basic", 99, { hasFreeTrial: true, trialDays: 7 }),
      contactSalesPlan("custom", "Custom"),
    ],
    featureOverrides: {
      "contact-data": "supported",
      prospecting: "supported",
      "data-enrichment": "supported",
      "email-outreach": "limited",
      "email-sequences": "not-supported",
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
      { integrationSlug: "outreach", kind: "native" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    limitations: [
      "Thinner global mega-database depth than UpLead/Hunter/Apollo-class peers for many buyer niches",
      "No native email sequencing — data/export first",
      "Daily contact caps on Free/Starter/Basic constrain volume",
      "Phone credits only unlock meaningfully on Basic+",
      "Reporting is basic usage vs enterprise SI analytics",
    ],
    limitationKinds: [
      "feature-unavailable",
      "feature-unavailable",
      "usage-cap",
      "plan-restriction",
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
        "Solid mid-tier B2B email/contact DB with published credit plans; thinner than ZoomInfo/Apollo and not clearly ahead of UpLead/Hunter for most shortlists — landscape not ranked.",
      prospecting:
        "Filters, list building, Chrome extension, and ABM list upload support prospecting; daily caps shape usable volume.",
      "data-enrichment":
        "Enrichment credits and CRM export are documented; not a multi-provider waterfall platform.",
      "email-outreach":
        "Not a sequencer — outreach is limited to finding/exporting contacts for external tools.",
      "crm-sync":
        "CRM export to Salesforce, HubSpot, Pipedrive, Outreach and peers is first-party documented on Basic+.",
      "ease-of-use":
        "Credit-based contact DB with Free + published Starter/Basic is approachable for SMB evaluation.",
      reporting:
        "Basic/advanced usage reporting only — not enterprise SI analytics.",
      "value-for-money":
        "Free plan, 7-day trial, and Starter-from-$49 published ladder is transparent for SMB/mid-market data buyers.",
    },
    bestFor: [
      "SMB/mid-market teams wanting a regional contact DB peer with published credit plans",
      "Buyers who prefer credit (not seat) packaging and Chrome-led email finding",
      "Teams exporting contacts into CRM or SEP tools rather than sequencing in-app",
    ],
    notIdealFor: [
      "Buyers who need a ranked SI shortlist peer with proven depth vs UpLead/Hunter/Apollo",
      "Teams whose primary job is multichannel email sequencing",
      "Enterprise buyers needing predictive ABM or phone-verified EMEA depth",
    ],
    pros: [
      "Published Free + Starter/Basic credit plans with 7-day trial",
      "Credit-based (not seat-licensed) packaging",
      "CRM export and Chrome extension for prospecting",
      "Phone credits on Basic for cold-call motions",
      "Approachable SMB entry vs opaque enterprise SI quotes",
    ],
    cons: [
      "Thinner vs UpLead/Hunter/Apollo for many niches — kept landscape, not ranked",
      "No native email sequences",
      "Daily contact caps on lower plans",
      "Light reporting",
      "Custom tier is contact-sales",
    ],
    keyFeatures: [
      "B2B email and contact database",
      "Credit-based Free/Starter/Basic/Custom plans",
      "Chrome extension and list building",
      "CRM export (Salesforce, HubSpot, Pipedrive, Outreach)",
      "Phone credits on Basic+",
    ],
    whoShouldChoose:
      "Choose Adapt.io when you want a credit-based mid-tier contact DB with Free + published Starter/Basic plans — treat it as landscape coverage, not a top ranked SI peer.",
    whoShouldConsiderAlternatives:
      "Compare UpLead and Hunter for stronger mid-tier ranked peers, Apollo for data+sequences, and Cognism/Lusha for enrichment-first or EMEA motions.",
    alternativeSlugs: ["uplead", "hunter", "apollo", "lusha"],
    competitorSlugs: ["uplead", "hunter", "apollo", "lusha", "bookyourdata"],
    comparableSlugs: ["uplead", "hunter"],
    subcategorySlugs: ["contact-data", "prospecting"],
    useCaseSlugs: ["prospecting", "data-enrichment", "contact-management"],
    teamTypeSlugs: ["sales", "revops"],
    businessSizeSlugs: ["micro", "small-business", "mid-market"],
    officialVideos: [],
    sourcesExtra: [
      {
        id: "adapt-io-product",
        url: "https://www.adapt.io/",
        title: "Adapt.io Product",
        domains: ["features", "product-positioning"],
      },
      {
        id: "adapt-io-pricing",
        url: "https://www.adapt.io/pricing",
        title: "Adapt.io Pricing",
        domains: ["pricing", "plans", "free-plan", "free-trial"],
      },
    ],
  },
  {
    slug: "outreach",
    name: "Outreach",
    company: "Outreach",
    website: "https://www.outreach.io",
    domain: "outreach.io",
    pricingUrl: "https://www.outreach.io/pricing",
    aliases: ["Outreach.io", "Outreach AI"],
    membershipRole: "landscape",
    softShortDescription:
      "Enterprise sales engagement / AI revenue platform — Amplify Essentials/Core/Plus/Pro packages; request pricing (seat + AI credits).",
    shortDescription:
      "Sales engagement and AI agent platform for revenue teams — multichannel sequences, CRM sync, conversation intelligence, deal/pipeline management, and forecasting packaged as Amplify Essentials, Core, Plus, and Pro with seat-based plus AI-credit consumption pricing (contact sales).",
    vendorPositioning:
      "Outreach is the AI Agent Platform for revenue teams — pipeline creation, deal execution, coaching, and forecasting.",
    pricingModel: "subscription",
    hasFreePlan: false,
    hasFreeTrial: false,
    pricingNotes:
      "First-party pricing verified 2026-08-17 on outreach.io/pricing: Amplify Essentials (10k AI credits), Core (25k), Plus (50k), Pro (100k) — all request pricing. Seat-based + consumption AI credits; no published dollar floors. Confirm packaging with Outreach sales.",
    pricingSummary:
      "Contact sales. Amplify Essentials / Core / Plus / Pro with included AI credit bands (10k–100k). Seat + consumption model — no public dollar list price. Confirm on outreach.io/pricing.",
    fixturePlans: [
      "PLAN amplify-essentials: name=Amplify Essentials; contactSales=true; currency=USD; interval=month; billingInterval=month; unit=seat",
      "PLAN amplify-core: name=Amplify Core; contactSales=true; currency=USD; interval=month; billingInterval=month; unit=seat",
      "PLAN amplify-plus: name=Amplify Plus; contactSales=true; currency=USD; interval=month; billingInterval=month; unit=seat",
      "PLAN amplify-pro: name=Amplify Pro; contactSales=true; currency=USD; interval=month; billingInterval=month; unit=seat",
    ],
    enrichmentPlans: [
      contactSalesPlan("amplify-essentials", "Amplify Essentials"),
      contactSalesPlan("amplify-core", "Amplify Core", { highlighted: true }),
      contactSalesPlan("amplify-plus", "Amplify Plus"),
      contactSalesPlan("amplify-pro", "Amplify Pro"),
    ],
    featureOverrides: {
      "contact-data": "limited",
      prospecting: "limited",
      "data-enrichment": "limited",
      "email-outreach": "supported",
      "email-sequences": "supported",
      "crm-sync": "supported",
      "lead-management": "supported",
      reporting: "supported",
      "ai-assistance": "supported",
      "lead-scoring": "limited",
      integrations: "supported",
      "contact-management": "supported",
    },
    aiLines: [
      "AI assistant: supported",
      "AI email-generation: supported",
      "AI recommendations: supported",
      "AI automation: supported",
    ],
    integrations: [
      { integrationSlug: "salesforce", kind: "native" },
      { integrationSlug: "hubspot", kind: "native" },
      { integrationSlug: "gong", kind: "official-connector" },
      { integrationSlug: "slack", kind: "native" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    limitations: [
      "Not a contact database peer — weak as SI data/enrichment core",
      "No published dollar pricing — enterprise quote only",
      "Heavy platform; overkill for SMB credit-DB buyers",
      "Data enrichment exists but is secondary to engagement/AI agents",
      "Scored as SI landscape SEP, not ranked contact-DB recommendation",
    ],
    limitationKinds: [
      "feature-unavailable",
      "plan-restriction",
      "high-cost-at-scale",
      "feature-unavailable",
      "other",
    ],
    scores: {
      "contact-data": 3,
      prospecting: 5,
      "data-enrichment": 4,
      "email-outreach": 9,
      "crm-sync": 9,
      "ease-of-use": 7,
      reporting: 8,
      "value-for-money": 5,
    },
    scoreRationales: {
      "contact-data":
        "Honestly weak as a contact DB — Outreach is a sales engagement / AI revenue platform, not a ZoomInfo/Apollo-class database.",
      prospecting:
        "Supports pipeline creation and sequencing workflows, but prospecting is engagement-led rather than database search depth.",
      "data-enrichment":
        "Some data enrichment is packaged, but enrichment is secondary to sequences, agents, and CRM execution.",
      "email-outreach":
        "Multichannel engagement and sequences are a category-defining strength for SEP buyers.",
      "crm-sync":
        "Deep bi-directional CRM sync (especially Salesforce-class stacks) is a first-party strength.",
      "ease-of-use":
        "Powerful but enterprise-heavy; approachable for trained revenue teams, not SMB DIY credit tools.",
      reporting:
        "Engagement, AI performance, revenue attribution, and pipeline reporting are strong.",
      "value-for-money":
        "Opaque request-pricing and enterprise packaging lower transparency vs published SMB SI tools.",
    },
    bestFor: [
      "Mid-market/enterprise teams whose primary job is sales engagement sequencing + CRM sync",
      "Revenue orgs adding AI agents, coaching, and forecast workflows on top of CRM",
      "Buyers comparing SEP peers (vs Salesloft) — not contact-database peers",
    ],
    notIdealFor: [
      "Buyers whose primary need is a B2B contact/enrichment database",
      "SMB teams needing published self-serve dollar pricing",
      "Teams that only need cold-email infrastructure without enterprise SEP depth",
    ],
    pros: [
      "Excellent email outreach / multichannel sequences",
      "Excellent CRM sync for revenue stacks",
      "Strong reporting, coaching, and AI agent packaging",
      "Clear Amplify Essentials→Pro capability ladder",
      "Enterprise conversation intelligence and deal management depth",
    ],
    cons: [
      "Weak contact-data and enrichment vs SI database peers",
      "No published dollar prices",
      "Not appropriate as a ranked SI contact-DB pick",
      "Enterprise complexity and cost for SMB buyers",
      "Enrichment is secondary to engagement",
    ],
    keyFeatures: [
      "Multichannel sales engagement sequences",
      "AI agents for research, personalization, deals, forecasting",
      "Bi-directional CRM sync",
      "Conversation intelligence and coaching",
      "Amplify Essentials/Core/Plus/Pro packages (request pricing)",
    ],
    whoShouldChoose:
      "Choose Outreach when enterprise sales engagement, CRM sync, and AI revenue workflows are the job — not when you need a contact database.",
    whoShouldConsiderAlternatives:
      "Compare Salesloft as the SEP peer; Apollo/Reply for data+engage SMB stacks; Instantly for cold-email infra; ZoomInfo/Apollo when contact data is the primary job.",
    alternativeSlugs: ["salesloft", "apollo", "reply", "instantly"],
    competitorSlugs: ["salesloft", "apollo", "reply", "gong"],
    comparableSlugs: ["salesloft", "apollo"],
    subcategorySlugs: ["prospecting"],
    useCaseSlugs: ["sales-engagement", "prospecting", "lead-management"],
    teamTypeSlugs: ["sales", "revops"],
    businessSizeSlugs: ["mid-market", "enterprise"],
    officialVideos: [],
    sourcesExtra: [
      {
        id: "outreach-product",
        url: "https://www.outreach.io/",
        title: "Outreach Product",
        domains: ["features", "product-positioning", "ai-capabilities"],
      },
      {
        id: "outreach-pricing",
        url: "https://www.outreach.io/pricing",
        title: "Outreach Pricing",
        domains: ["pricing", "plans"],
      },
    ],
  },
  {
    slug: "salesloft",
    name: "Salesloft",
    company: "Salesloft",
    website: "https://salesloft.com",
    domain: "salesloft.com",
    pricingUrl: "https://salesloft.com/pricing",
    membershipRole: "landscape",
    softShortDescription:
      "Enterprise sales engagement / revenue generation platform — bi-directional CRM sync, sequencing, coaching; talk-to-sales pricing.",
    shortDescription:
      "Sales engagement and revenue generation platform for sequencing, dialer automation, coaching, conversation intelligence, and bi-directional CRM sync — packaging is talk-to-sales / request pricing rather than published self-serve dollar floors.",
    vendorPositioning:
      "Salesloft helps revenue teams prospect, engage, and win with an all-in-one sales engagement and revenue generation platform.",
    pricingModel: "subscription",
    hasFreePlan: false,
    hasFreeTrial: false,
    pricingNotes:
      "First-party pricing verified 2026-08-17 on salesloft.com/pricing: no published dollar list — Talk to Sales / request intro. Platform capabilities include bi-directional CRM sync, coaching, reporting & analytics, AI-powered workflows. Confirm current packages with Salesloft sales.",
    pricingSummary:
      "Contact sales / Talk to Sales. No public dollar list price on salesloft.com/pricing as of 2026-08-17. Confirm packaging with Salesloft.",
    fixturePlans: [
      "PLAN platform: name=Salesloft Platform; contactSales=true; currency=USD; interval=month; billingInterval=month; unit=seat",
    ],
    enrichmentPlans: [
      contactSalesPlan("platform", "Salesloft Platform", { highlighted: true }),
    ],
    featureOverrides: {
      "contact-data": "limited",
      prospecting: "limited",
      "data-enrichment": "limited",
      "email-outreach": "supported",
      "email-sequences": "supported",
      "crm-sync": "supported",
      "lead-management": "supported",
      reporting: "supported",
      "ai-assistance": "supported",
      "lead-scoring": "limited",
      integrations: "supported",
      "contact-management": "supported",
    },
    aiLines: [
      "AI assistant: supported",
      "AI email-generation: supported",
      "AI recommendations: supported",
      "AI automation: supported",
    ],
    integrations: [
      { integrationSlug: "salesforce", kind: "native" },
      { integrationSlug: "hubspot", kind: "native" },
      { integrationSlug: "gong", kind: "official-connector" },
      { integrationSlug: "slack", kind: "native" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    limitations: [
      "Not a contact database peer — weak as SI data/enrichment core",
      "No published dollar pricing — talk-to-sales only",
      "Enterprise SEP complexity vs SMB credit tools",
      "Conversation intelligence depth varies by packaging",
      "Scored as SI landscape SEP, not ranked contact-DB recommendation",
    ],
    limitationKinds: [
      "feature-unavailable",
      "plan-restriction",
      "high-cost-at-scale",
      "plan-restriction",
      "other",
    ],
    scores: {
      "contact-data": 3,
      prospecting: 5,
      "data-enrichment": 4,
      "email-outreach": 9,
      "crm-sync": 9,
      "ease-of-use": 7,
      reporting: 8,
      "value-for-money": 5,
    },
    scoreRationales: {
      "contact-data":
        "Honestly weak as a contact DB — Salesloft is a sales engagement platform, not a primary B2B contact database.",
      prospecting:
        "Supports cadence/prospecting execution, but database search depth is not the product center of gravity.",
      "data-enrichment":
        "Enrichment is limited relative to SI data platforms; CRM activity sync is the stronger data story.",
      "email-outreach":
        "Email and dialer automation / sequencing are a category-defining strength for SEP buyers.",
      "crm-sync":
        "Bi-directional CRM sync is first-party emphasized as a platform capability.",
      "ease-of-use":
        "Marketed as scalable and intuitive for revenue teams; still an enterprise engagement platform.",
      reporting:
        "Reporting, analytics, and coaching visibility are strong for engagement ops.",
      "value-for-money":
        "Opaque talk-to-sales pricing lowers transparency vs published SMB SI tools.",
    },
    bestFor: [
      "Mid-market/enterprise teams whose primary job is sales engagement + CRM sync",
      "Revenue orgs comparing Salesloft vs Outreach as SEP peers",
      "Teams needing coaching and engagement analytics more than a contact DB",
    ],
    notIdealFor: [
      "Buyers whose primary need is B2B contact/enrichment data",
      "SMB teams needing published self-serve dollar pricing",
      "Cold-email-only infra buyers (Instantly/Smartlead class)",
    ],
    pros: [
      "Excellent email outreach and sales engagement sequencing",
      "Excellent bi-directional CRM sync",
      "Strong coaching, reporting, and AI workflow packaging",
      "Clear SEP peer positioning vs Outreach",
      "Dialer automation alongside email cadences",
    ],
    cons: [
      "Weak contact-data and enrichment vs SI database peers",
      "No published dollar prices",
      "Not appropriate as a ranked SI contact-DB pick",
      "Enterprise cost/complexity for SMB",
      "Talk-to-sales packaging only",
    ],
    keyFeatures: [
      "Sales engagement sequencing and dialer automation",
      "Bi-directional CRM sync",
      "Coaching and conversation intelligence",
      "Reporting and analytics",
      "AI-powered workflows (talk-to-sales packaging)",
    ],
    whoShouldChoose:
      "Choose Salesloft when enterprise sales engagement and bi-directional CRM sync are the job — not when you need a contact database.",
    whoShouldConsiderAlternatives:
      "Compare Outreach as the primary SEP peer; Apollo/Reply for SMB data+engage; Instantly for cold-email infra; ZoomInfo/Apollo when contact data is primary.",
    alternativeSlugs: ["outreach", "apollo", "reply", "instantly"],
    competitorSlugs: ["outreach", "apollo", "reply", "gong"],
    comparableSlugs: ["outreach", "apollo"],
    subcategorySlugs: ["prospecting"],
    useCaseSlugs: ["sales-engagement", "prospecting", "lead-management"],
    teamTypeSlugs: ["sales", "revops"],
    businessSizeSlugs: ["mid-market", "enterprise"],
    officialVideos: [],
    sourcesExtra: [
      {
        id: "salesloft-product",
        url: "https://salesloft.com/",
        title: "Salesloft Product",
        domains: ["features", "product-positioning", "ai-capabilities"],
      },
      {
        id: "salesloft-pricing",
        url: "https://salesloft.com/pricing",
        title: "Salesloft Pricing",
        domains: ["pricing", "plans"],
      },
    ],
  },
  {
    slug: "instantly",
    name: "Instantly",
    company: "Instantly",
    website: "https://instantly.ai",
    domain: "instantly.ai",
    pricingUrl: "https://instantly.ai/pricing",
    aliases: ["Instantly.ai"],
    membershipRole: "landscape",
    softShortDescription:
      "Cold-email outreach infrastructure — Growth from $47/mo; Hypergrowth $97; Light Speed $358; bundles/credits add-ons; Enterprise custom.",
    shortDescription:
      "Cold-email outreach platform focused on unlimited email accounts/warmup, high-volume sending, Unibox, and optional Instantly Credits lead/enrichment add-ons — Growth from $47/mo through Light Speed and Enterprise; not a core sales-intelligence contact database.",
    vendorPositioning:
      "Instantly helps teams run cold email at scale with unlimited accounts, warmup, and deliverability-focused outreach infrastructure.",
    pricingModel: "subscription",
    hasFreePlan: false,
    hasFreeTrial: true,
    startingPriceMonthly: 47,
    pricingNotes:
      "First-party pricing verified 2026-08-17 on instantly.ai/pricing: Outreach Growth $47/mo (unlimited accounts/warmup, 1k uploaded contacts, 5k emails/mo); Hypergrowth $97/mo; Light Speed $358/mo; Enterprise custom. Bundles (Starter ~$94, Scale ~$194, Agency ~$555 monthly) combine outreach + credits. Credits Growth $47/mo. Confirm live limits and annual discounts.",
    pricingSummary:
      "Outreach Growth from $47/mo; Hypergrowth $97/mo; Light Speed $358/mo; Enterprise custom. Credit add-ons from $47/mo. Bundles combine outreach + credits. Confirm on instantly.ai/pricing.",
    fixturePlans: [
      "PLAN growth: name=Growth; amountPerSeat=47; currency=USD; interval=month; billingInterval=month; unit=seat",
      "PLAN hypergrowth: name=Hypergrowth; amountPerSeat=97; currency=USD; interval=month; billingInterval=month; unit=seat",
      "PLAN light-speed: name=Light Speed; amountPerSeat=358; currency=USD; interval=month; billingInterval=month; unit=seat",
      "PLAN enterprise: name=Enterprise; contactSales=true; currency=USD; interval=month; billingInterval=month; unit=seat",
    ],
    enrichmentPlans: [
      planPerSeat("growth", "Growth", 47, {
        hasFreeTrial: true,
        highlighted: true,
      }),
      planPerSeat("hypergrowth", "Hypergrowth", 97),
      planPerSeat("light-speed", "Light Speed", 358),
      contactSalesPlan("enterprise", "Enterprise"),
    ],
    featureOverrides: {
      "contact-data": "limited",
      prospecting: "limited",
      "data-enrichment": "limited",
      "email-outreach": "supported",
      "email-sequences": "supported",
      "crm-sync": "supported",
      "lead-management": "limited",
      reporting: "limited",
      "ai-assistance": "supported",
      "lead-scoring": "limited",
      integrations: "supported",
      "contact-management": "limited",
    },
    aiLines: [
      "AI email-generation: supported",
      "AI assistant: supported",
      "AI recommendations: limited",
      "AI automation: supported",
    ],
    integrations: [
      { integrationSlug: "hubspot", kind: "official-connector" },
      { integrationSlug: "salesforce", kind: "official-connector" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    limitations: [
      "Cold-email infra first — not an SI contact-database core",
      "Lead finder/credits are add-on depth vs dedicated SI databases",
      "CRM sync is lighter than enterprise SEP platforms",
      "High-volume sending carries deliverability/compliance risk",
      "Scored as SI landscape cold-email, not ranked data peer",
    ],
    limitationKinds: [
      "feature-unavailable",
      "feature-unavailable",
      "feature-unavailable",
      "other",
      "other",
    ],
    scores: {
      "contact-data": 5,
      prospecting: 6,
      "data-enrichment": 5,
      "email-outreach": 9,
      "crm-sync": 6,
      "ease-of-use": 8,
      reporting: 6,
      "value-for-money": 8,
    },
    scoreRationales: {
      "contact-data":
        "Optional lead/credits database exists, but Instantly’s center of gravity is sending infra — not a primary SI contact DB peer.",
      prospecting:
        "Useful for list upload + lead finder add-ons; weaker than dedicated prospecting databases.",
      "data-enrichment":
        "Waterfall enrichment via credits is available as add-on; secondary to outreach infra.",
      "email-outreach":
        "Unlimited accounts/warmup and high-volume cold email are a category-defining strength.",
      "crm-sync":
        "CRM/export connectors exist; lighter than Outreach/Salesloft-class bi-directional SEP sync.",
      "ease-of-use":
        "Published Growth→Light Speed ladder and cold-email UX are approachable for SMB/agency senders.",
      reporting:
        "Campaign/account analytics support outreach ops; not enterprise SI/ABM analytics.",
      "value-for-money":
        "Clear published Growth-from-$47 packaging is strong transparency for cold-email buyers.",
    },
    bestFor: [
      "Teams whose primary job is cold-email sending infra at volume",
      "Agencies and SMB outbound needing warmup + unlimited accounts",
      "Buyers comparing Instantly vs Lemlist/Smartlead as cold-email landscape",
    ],
    notIdealFor: [
      "Buyers whose primary need is a verified B2B contact mega-database",
      "Enterprise SEP buyers needing coaching/forecasting (Outreach/Salesloft)",
      "Teams that need conversation intelligence (Gong)",
    ],
    pros: [
      "Excellent cold-email outreach and deliverability tooling",
      "Published Growth-from-$47 ladder",
      "Unlimited email accounts and warmup on Growth+",
      "Optional credits for leads/enrichment",
      "Strong value transparency vs opaque enterprise SEP quotes",
    ],
    cons: [
      "Not an SI data-core peer — landscape only",
      "Contact data/enrichment secondary to sending",
      "CRM sync lighter than enterprise SEP",
      "High-volume sending compliance risk",
      "Reporting is outreach-ops grade",
    ],
    keyFeatures: [
      "Cold email sequences at volume",
      "Unlimited email accounts and warmup",
      "Unibox and deliverability tooling",
      "Optional Instantly Credits lead/enrichment",
      "Published Growth/Hypergrowth/Light Speed plans",
    ],
    whoShouldChoose:
      "Choose Instantly when cold-email infrastructure (accounts, warmup, volume sending) is the job — not when you need a sales-intelligence contact database.",
    whoShouldConsiderAlternatives:
      "Compare Lemlist/Smartlead as cold-email peers; Outreach/Salesloft for enterprise SEP; Apollo/Hunter when data+light outreach is primary.",
    alternativeSlugs: ["lemlist", "smartlead", "apollo", "hunter"],
    competitorSlugs: ["lemlist", "smartlead", "apollo", "outreach"],
    comparableSlugs: ["lemlist", "smartlead"],
    subcategorySlugs: ["prospecting"],
    useCaseSlugs: ["sales-engagement", "prospecting"],
    teamTypeSlugs: ["sales", "marketing"],
    businessSizeSlugs: ["micro", "small-business", "mid-market"],
    officialVideos: [],
    sourcesExtra: [
      {
        id: "instantly-product",
        url: "https://instantly.ai/",
        title: "Instantly Product",
        domains: ["features", "product-positioning", "ai-capabilities"],
      },
      {
        id: "instantly-pricing",
        url: "https://instantly.ai/pricing",
        title: "Instantly Pricing",
        domains: ["pricing", "plans", "free-trial"],
      },
    ],
  },
  {
    slug: "gong",
    name: "Gong",
    company: "Gong",
    website: "https://www.gong.io",
    domain: "gong.io",
    pricingUrl: "https://www.gong.io/pricing",
    aliases: ["Gong.io", "Gong Revenue AI"],
    membershipRole: "landscape",
    softShortDescription:
      "Conversation intelligence / revenue AI — per-user licenses + platform fee; custom proposal only (no public dollar list).",
    shortDescription:
      "Conversation intelligence and revenue AI platform for capturing customer interactions, coaching, deal insight, and CRM-connected revenue workflows — priced per user with a platform fee via custom proposal (no public dollar list). Adjacent to sales intelligence; separate primary job from contact databases.",
    vendorPositioning:
      "Gong helps revenue teams win more with Revenue AI — conversation intelligence, deal insights, and coaching.",
    pricingModel: "subscription",
    hasFreePlan: false,
    hasFreeTrial: false,
    pricingNotes:
      "First-party pricing verified 2026-08-17 on gong.io/pricing: licenses priced per user; platform fee based on users supported; existing tech-stack integrations free; customized proposal only — no published dollar floors. Confirm with Gong sales.",
    pricingSummary:
      "Contact sales. Per-user licenses + platform fee based on team size. No public dollar list on gong.io/pricing as of 2026-08-17.",
    fixturePlans: [
      "PLAN platform: name=Gong Platform; contactSales=true; currency=USD; interval=month; billingInterval=month; unit=seat",
    ],
    enrichmentPlans: [
      contactSalesPlan("platform", "Gong Platform", { highlighted: true }),
    ],
    featureOverrides: {
      "contact-data": "not-supported",
      prospecting: "limited",
      "data-enrichment": "limited",
      "email-outreach": "limited",
      "email-sequences": "not-supported",
      "crm-sync": "supported",
      "lead-management": "limited",
      reporting: "supported",
      "ai-assistance": "supported",
      "lead-scoring": "limited",
      integrations: "supported",
      "contact-management": "limited",
    },
    aiLines: [
      "AI assistant: supported",
      "AI recommendations: supported",
      "AI summaries: supported",
      "AI transcription: supported",
      "AI automation: limited",
    ],
    integrations: [
      { integrationSlug: "salesforce", kind: "native" },
      { integrationSlug: "hubspot", kind: "native" },
      { integrationSlug: "outreach", kind: "official-connector" },
      { integrationSlug: "salesloft", kind: "official-connector" },
      { integrationSlug: "slack", kind: "native" },
    ],
    limitations: [
      "Separate job from sales intelligence contact databases",
      "Not a prospecting/enrichment data core",
      "No native cold-email sequencing as primary product",
      "Opaque enterprise pricing (per-user + platform fee)",
      "Scored as SI landscape adjacent only — not ranked",
    ],
    limitationKinds: [
      "feature-unavailable",
      "feature-unavailable",
      "feature-unavailable",
      "plan-restriction",
      "other",
    ],
    scores: {
      "contact-data": 2,
      prospecting: 3,
      "data-enrichment": 3,
      "email-outreach": 3,
      "crm-sync": 8,
      "ease-of-use": 7,
      reporting: 9,
      "value-for-money": 4,
    },
    scoreRationales: {
      "contact-data":
        "Not a contact database — conversation intelligence is a different buyer job; score is honestly low on SI contact-data.",
      prospecting:
        "May inform account/deal work from conversations, but is not a prospecting database tool.",
      "data-enrichment":
        "Enriches deal/conversation context, not B2B contact/firmographic enrichment as SI buyers mean it.",
      "email-outreach":
        "Not a sequencer; limited email outreach vs SEP/cold-email tools.",
      "crm-sync":
        "Deep CRM connection for revenue workflows is a first-party strength.",
      "ease-of-use":
        "Strong for revenue teams already recording calls/meetings; enterprise onboarding expected.",
      reporting:
        "Conversation intelligence analytics, coaching, and deal insight reporting are category-leading.",
      "value-for-money":
        "Opaque per-user + platform-fee custom proposals lower transparency for SI buyers comparing published tools.",
    },
    bestFor: [
      "Revenue teams whose primary job is conversation intelligence and deal coaching",
      "Orgs layering Gong beside CRM + SEP (Outreach/Salesloft)",
      "Buyers who need call/meeting insight — not contact discovery",
    ],
    notIdealFor: [
      "Buyers whose primary need is B2B contact/enrichment databases",
      "SMB teams needing published self-serve SI pricing",
      "Cold-email infra or SEP sequencing as the only job",
    ],
    pros: [
      "Category-leading conversation intelligence reporting",
      "Strong CRM sync for revenue workflows",
      "AI coaching and deal insight packaging",
      "Integrates with major CRMs and SEPs",
      "Clear adjacent role in SI landscape guides",
    ],
    cons: [
      "Not an SI contact-data or enrichment peer",
      "Weak prospecting/email-outreach as SI criteria",
      "Opaque enterprise pricing",
      "Separate buyer job from sales intelligence cores",
      "Not ranked on Best SI page",
    ],
    keyFeatures: [
      "Conversation intelligence and call/meeting capture",
      "Revenue AI coaching and deal insights",
      "CRM-connected revenue workflows",
      "Per-user + platform fee packaging (custom proposal)",
      "Integrations with CRM and sales engagement tools",
    ],
    whoShouldChoose:
      "Choose Gong when conversation intelligence and revenue coaching are the job — mention it on SI pages as adjacent landscape, not as a contact-database peer.",
    whoShouldConsiderAlternatives:
      "Compare Outreach/Salesloft when engagement sequencing is primary; ZoomInfo/Apollo when contact data is primary; Fireflies-class tools for lighter meeting notes.",
    alternativeSlugs: ["outreach", "salesloft", "apollo", "zoominfo"],
    competitorSlugs: ["outreach", "salesloft", "apollo"],
    comparableSlugs: ["outreach", "salesloft"],
    subcategorySlugs: ["prospecting"],
    useCaseSlugs: ["sales-engagement", "lead-management"],
    teamTypeSlugs: ["sales", "revops"],
    businessSizeSlugs: ["mid-market", "enterprise"],
    officialVideos: [],
    sourcesExtra: [
      {
        id: "gong-product",
        url: "https://www.gong.io/",
        title: "Gong Product",
        domains: ["features", "product-positioning", "ai-capabilities"],
      },
      {
        id: "gong-pricing",
        url: "https://www.gong.io/pricing",
        title: "Gong Pricing",
        domains: ["pricing", "plans"],
      },
    ],
  },
  {
    slug: "lemlist",
    name: "Lemlist",
    company: "lemlist",
    website: "https://www.lemlist.com",
    domain: "lemlist.com",
    pricingUrl: "https://www.lemlist.com/pricing",
    aliases: ["lemlist", "Lem List"],
    membershipRole: "landscape",
    softShortDescription:
      "Multichannel cold outreach — Email from $55/user/mo yearly; Multichannel from $87/user/mo yearly; Enterprise custom; 14-day trial.",
    shortDescription:
      "Multichannel cold outreach platform (email, LinkedIn, SMS, dialer) with lead database and enrichment credits — Email plan from $55/user/mo (yearly headline), Multichannel from $87/user/mo, Enterprise custom, 14-day free trial. Landscape cold-email/outbound infra for SI pages — not a ranked contact-DB peer.",
    vendorPositioning:
      "lemlist is the all-in-one platform for precise outbound at any scale — email and multichannel sequences with deliverability tooling.",
    pricingModel: "subscription",
    hasFreePlan: false,
    hasFreeTrial: true,
    trialDays: 14,
    startingPriceMonthly: 55,
    pricingNotes:
      "First-party pricing verified 2026-08-17 on lemlist.com/pricing: Email from $55/user/mo yearly ($69 monthly); Multichannel from $87/user/mo yearly ($109 monthly); Enterprise custom. 14-day free trial (Multichannel access). Enrichment credits pay-per-success (~$0.01/credit). Confirm live floors and sender limits.",
    pricingSummary:
      "Email from $55/user/mo (yearly); Multichannel from $87/user/mo (yearly); Enterprise custom. 14-day free trial. Enrichment credits separate. Confirm on lemlist.com/pricing.",
    fixturePlans: [
      "PLAN email: name=Email; amountPerSeat=55; currency=USD; interval=year; billingInterval=month; unit=seat",
      "PLAN multichannel: name=Multichannel; amountPerSeat=87; currency=USD; interval=year; billingInterval=month; unit=seat",
      "PLAN enterprise: name=Enterprise; contactSales=true; currency=USD; interval=month; billingInterval=month; unit=seat",
    ],
    enrichmentPlans: [
      planPerSeat("email", "Email", 55, {
        hasFreeTrial: true,
        trialDays: 14,
        billingInterval: "year",
        highlighted: true,
      }),
      planPerSeat("multichannel", "Multichannel", 87, {
        hasFreeTrial: true,
        trialDays: 14,
        billingInterval: "year",
      }),
      contactSalesPlan("enterprise", "Enterprise"),
    ],
    featureOverrides: {
      "contact-data": "limited",
      prospecting: "supported",
      "data-enrichment": "limited",
      "email-outreach": "supported",
      "email-sequences": "supported",
      "crm-sync": "supported",
      "lead-management": "limited",
      reporting: "limited",
      "ai-assistance": "supported",
      "lead-scoring": "limited",
      integrations: "supported",
      "contact-management": "supported",
    },
    aiLines: [
      "AI email-generation: supported",
      "AI assistant: supported",
      "AI recommendations: limited",
      "AI automation: supported",
    ],
    integrations: [
      { integrationSlug: "hubspot", kind: "native" },
      { integrationSlug: "salesforce", kind: "native" },
      { integrationSlug: "pipedrive", kind: "native" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    limitations: [
      "Cold-outreach first — not an SI mega-database peer",
      "Lead database included but secondary to multichannel sending",
      "Enrichment is credit add-on depth vs dedicated SI tools",
      "LinkedIn automation carries platform compliance risk",
      "Scored as SI landscape cold-email, not ranked data peer",
    ],
    limitationKinds: [
      "feature-unavailable",
      "feature-unavailable",
      "plan-restriction",
      "other",
      "other",
    ],
    scores: {
      "contact-data": 5,
      prospecting: 6,
      "data-enrichment": 5,
      "email-outreach": 9,
      "crm-sync": 7,
      "ease-of-use": 8,
      reporting: 6,
      "value-for-money": 7,
    },
    scoreRationales: {
      "contact-data":
        "Includes a lead database, but lemlist’s center of gravity is multichannel outbound — not a ranked SI contact-DB peer.",
      prospecting:
        "Account-based prospecting and lead finder support outbound; weaker than dedicated SI databases.",
      "data-enrichment":
        "Pay-per-success enrichment credits help, but depth trails Clay/Clearbit-class enrichment platforms.",
      "email-outreach":
        "Email + multichannel sequences with deliverability hub are a category strength.",
      "crm-sync":
        "Native CRM integrations (HubSpot, Salesforce, Pipedrive) are first-party documented.",
      "ease-of-use":
        "Published Email/Multichannel ladder and trial path are approachable for SMB outbound teams.",
      reporting:
        "Campaign reporting supports outbound coaching; not enterprise SI/ABM analytics.",
      "value-for-money":
        "Yearly Email-from-$55 is clear; Multichannel and credits raise TCO — still more transparent than opaque SEP quotes.",
    },
    bestFor: [
      "Teams whose primary job is multichannel cold outreach (email + LinkedIn)",
      "SMB outbound comparing lemlist vs Instantly/Smartlead",
      "Buyers wanting published per-user outbound plans with a trial",
    ],
    notIdealFor: [
      "Buyers whose primary need is a verified B2B contact mega-database",
      "Enterprise SEP buyers needing coaching/forecasting depth",
      "Orgs that cannot accept LinkedIn automation compliance risk",
    ],
    pros: [
      "Excellent email/multichannel outreach",
      "Published Email-from-$55 yearly headline",
      "CRM integrations for HubSpot/Salesforce/Pipedrive",
      "14-day free trial",
      "Deliverability hub and warm-up included",
    ],
    cons: [
      "Not an SI data-core peer — landscape only",
      "Contact data secondary to outreach",
      "Enrichment credits add cost",
      "LinkedIn automation compliance risk",
      "Reporting is outbound-ops grade",
    ],
    keyFeatures: [
      "Email and multichannel cold outreach sequences",
      "Lead database and email/phone finder",
      "Deliverability hub and warm-up",
      "CRM integrations",
      "Email / Multichannel / Enterprise packaging",
    ],
    whoShouldChoose:
      "Choose lemlist when multichannel cold outreach is the job — treat it as SI landscape cold-email coverage, not a ranked contact-database pick.",
    whoShouldConsiderAlternatives:
      "Compare Instantly/Smartlead for cold-email infra; Outreach/Salesloft for enterprise SEP; Apollo/Hunter when data+light outreach is primary.",
    alternativeSlugs: ["instantly", "smartlead", "apollo", "hunter"],
    competitorSlugs: ["instantly", "smartlead", "apollo", "outreach"],
    comparableSlugs: ["instantly", "smartlead"],
    subcategorySlugs: ["prospecting"],
    useCaseSlugs: ["sales-engagement", "prospecting"],
    teamTypeSlugs: ["sales", "marketing"],
    businessSizeSlugs: ["micro", "small-business", "mid-market"],
    officialVideos: [],
    sourcesExtra: [
      {
        id: "lemlist-product",
        url: "https://www.lemlist.com/",
        title: "lemlist Product",
        domains: ["features", "product-positioning", "ai-capabilities"],
      },
      {
        id: "lemlist-pricing",
        url: "https://www.lemlist.com/pricing",
        title: "lemlist Pricing",
        domains: ["pricing", "plans", "free-trial"],
      },
    ],
  },
  {
    slug: "smartlead",
    name: "Smartlead",
    company: "Smartlead",
    website: "https://www.smartlead.ai",
    domain: "smartlead.ai",
    pricingUrl: "https://www.smartlead.ai/pricing",
    aliases: ["Smartlead.ai", "Smart Lead"],
    membershipRole: "landscape",
    softShortDescription:
      "Cold-email outreach infra — Base from $59/mo ($39/mo yearly headline) with send/verified-email bands; higher tiers scale volume.",
    shortDescription:
      "Cold-email outreach platform with unlimited mailboxes, warmups, master inbox, and published Base→Prime volume bands — Base from $59/mo monthly ($39/mo yearly research floor) with included send and verified prospect email allowances. Landscape cold-email infra for SI pages — not a ranked contact-DB peer.",
    vendorPositioning:
      "Smartlead helps teams run cold email with unlimited mailboxes, AI warmups, and a master inbox to close deals.",
    pricingModel: "subscription",
    hasFreePlan: false,
    hasFreeTrial: true,
    startingPriceMonthly: 39,
    pricingNotes:
      "First-party pricing verified 2026-08-17 on smartlead.ai/pricing: Base ~6k sends / 2k verified emails from $59/mo monthly ($39/mo yearly headline); Pro/Smart/Prime scale send and verified-email bands (confirm live slider). Free trial available via sign-up. Confirm current Base/Pro/Smart/Prime dollars and included volumes on the live pricing page — dynamic UI.",
    pricingSummary:
      "Base from $59/mo ($39/mo yearly headline) with published send/verified-email bands; Pro/Smart/Prime scale volume. Free trial via sign-up. Confirm live on smartlead.ai/pricing.",
    fixturePlans: [
      "PLAN base: name=Base; amountPerSeat=39; currency=USD; interval=year; billingInterval=month; unit=seat",
      "PLAN pro: name=Pro; contactSales=false; currency=USD; interval=month; billingInterval=month; unit=seat",
      "PLAN smart: name=Smart; contactSales=false; currency=USD; interval=month; billingInterval=month; unit=seat",
      "PLAN prime: name=Prime; contactSales=false; currency=USD; interval=month; billingInterval=month; unit=seat",
    ],
    enrichmentPlans: [
      planPerSeat("base", "Base", 39, {
        hasFreeTrial: true,
        billingInterval: "year",
        highlighted: true,
      }),
      planPerSeat("pro", "Pro", 59, { hasFreeTrial: true }),
      contactSalesPlan("smart", "Smart"),
      contactSalesPlan("prime", "Prime"),
    ],
    featureOverrides: {
      "contact-data": "limited",
      prospecting: "limited",
      "data-enrichment": "limited",
      "email-outreach": "supported",
      "email-sequences": "supported",
      "crm-sync": "supported",
      "lead-management": "limited",
      reporting: "limited",
      "ai-assistance": "supported",
      "lead-scoring": "not-supported",
      integrations: "supported",
      "contact-management": "limited",
    },
    aiLines: [
      "AI email-generation: limited",
      "AI assistant: limited",
      "AI recommendations: limited",
      "AI automation: supported",
    ],
    integrations: [
      { integrationSlug: "hubspot", kind: "official-connector" },
      { integrationSlug: "salesforce", kind: "official-connector" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    limitations: [
      "Cold-email infra first — not an SI contact-database core",
      "Verified prospect emails are sending-plan allowances, not a full SI DB",
      "CRM access exists but is lighter than enterprise SEP sync",
      "Pricing UI is dynamic — confirm live tier dollars carefully",
      "Scored as SI landscape cold-email, not ranked data peer",
    ],
    limitationKinds: [
      "feature-unavailable",
      "feature-unavailable",
      "feature-unavailable",
      "other",
      "other",
    ],
    scores: {
      "contact-data": 4,
      prospecting: 5,
      "data-enrichment": 4,
      "email-outreach": 9,
      "crm-sync": 6,
      "ease-of-use": 8,
      reporting: 6,
      "value-for-money": 8,
    },
    scoreRationales: {
      "contact-data":
        "Verified prospect email allowances support sending, but Smartlead is not a primary SI contact database.",
      prospecting:
        "List/campaign prospecting for cold email; weaker than dedicated SI search databases.",
      "data-enrichment":
        "Limited enrichment relative to SI enrichment platforms; focus is mailbox/warmup/sending.",
      "email-outreach":
        "Unlimited mailboxes, warmups, and high-volume cold email are a category strength.",
      "crm-sync":
        "CRM access/connectors are documented; lighter than Outreach/Salesloft bi-directional SEP depth.",
      "ease-of-use":
        "Simple cold-email plan ladder and free trial path suit SMB/agency senders.",
      reporting:
        "Campaign analytics support outbound ops; not enterprise SI analytics.",
      "value-for-money":
        "Base yearly headline from ~$39/mo is accessible; confirm live volume bands before buying.",
    },
    bestFor: [
      "Teams whose primary job is cold-email sending with unlimited mailboxes",
      "Agencies comparing Smartlead vs Instantly/lemlist",
      "Buyers wanting published Base volume bands and a free trial",
    ],
    notIdealFor: [
      "Buyers whose primary need is a B2B contact mega-database",
      "Enterprise SEP coaching/forecast buyers",
      "Conversation intelligence buyers (Gong)",
    ],
    pros: [
      "Excellent cold-email outreach infra",
      "Accessible Base yearly headline (~$39/mo)",
      "Unlimited mailboxes and warmups posture",
      "Free trial via sign-up",
      "Clear cold-email landscape peer to Instantly/lemlist",
    ],
    cons: [
      "Not an SI data-core peer — landscape only",
      "Weak contact-data/enrichment vs SI databases",
      "Dynamic pricing UI needs live confirmation",
      "CRM sync lighter than enterprise SEP",
      "Reporting is outbound-ops grade",
    ],
    keyFeatures: [
      "Cold email sequences at volume",
      "Unlimited mailboxes and AI warmups",
      "Master inbox",
      "Base/Pro/Smart/Prime volume bands",
      "CRM access and API/webhooks",
    ],
    whoShouldChoose:
      "Choose Smartlead when cold-email infrastructure is the job — treat it as SI landscape coverage, not a ranked contact-database pick.",
    whoShouldConsiderAlternatives:
      "Compare Instantly/lemlist for cold-email peers; Outreach/Salesloft for enterprise SEP; Apollo/Hunter when data+light outreach is primary.",
    alternativeSlugs: ["instantly", "lemlist", "apollo", "hunter"],
    competitorSlugs: ["instantly", "lemlist", "apollo", "outreach"],
    comparableSlugs: ["instantly", "lemlist"],
    subcategorySlugs: ["prospecting"],
    useCaseSlugs: ["sales-engagement", "prospecting"],
    teamTypeSlugs: ["sales", "marketing"],
    businessSizeSlugs: ["micro", "small-business", "mid-market"],
    officialVideos: [],
    sourcesExtra: [
      {
        id: "smartlead-product",
        url: "https://www.smartlead.ai/",
        title: "Smartlead Product",
        domains: ["features", "product-positioning"],
      },
      {
        id: "smartlead-pricing",
        url: "https://www.smartlead.ai/pricing",
        title: "Smartlead Pricing",
        domains: ["pricing", "plans", "free-trial"],
      },
    ],
  },
];
