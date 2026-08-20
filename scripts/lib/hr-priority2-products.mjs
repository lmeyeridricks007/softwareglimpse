/**
 * HR Priority-2 white-space products (compact).
 * Homebase, When I Work, Deputy, 7shifts, Lever, Ashby, HiBob, Personio.
 *
 * Pricing grounded 2026-08-18 from first-party pages.
 * Affiliate economics never enter scores. handsOnTesting=false.
 */
import { expandHrProduct } from "./hr-compact-expand.mjs";

const WFM_FEATURES = {
  "applicant-tracking": "limited",
  "career-site-job-boards": "limited",
  "interview-scheduling": "not-supported",
  "core-hris": "limited",
  "payroll-processing": "add-on",
  "benefits-admin": "not-supported",
  "workforce-scheduling": "supported",
  "frontline-comms": "supported",
  "time-attendance": "supported",
  "gps-geofence-clockin": "supported",
  "sop-knowledge-base": "limited",
  "employee-training-paths": "limited",
  "lms-course-commerce": "not-supported",
  "hris-integrations": "supported",
  "analytics-reporting": "supported",
  "ai-assistance": "limited",
};

const ATS_FEATURES = {
  "applicant-tracking": "supported",
  "career-site-job-boards": "supported",
  "interview-scheduling": "supported",
  "core-hris": "not-supported",
  "payroll-processing": "not-supported",
  "benefits-admin": "not-supported",
  "workforce-scheduling": "not-supported",
  "frontline-comms": "not-supported",
  "time-attendance": "not-supported",
  "gps-geofence-clockin": "not-supported",
  "sop-knowledge-base": "not-supported",
  "employee-training-paths": "not-supported",
  "lms-course-commerce": "not-supported",
  "hris-integrations": "supported",
  "analytics-reporting": "supported",
  "ai-assistance": "supported",
};

const COMPACT = [
  {
    slug: "homebase",
    name: "Homebase",
    company: "Pioneer Works, Inc.",
    website: "https://www.joinhomebase.com",
    domain: "joinhomebase.com",
    pricingUrl: "https://www.joinhomebase.com/pricing",
    aliases: ["Join Homebase"],
    membershipRole: "primary",
    jobCluster: "frontline-wfm",
    softShortDescription:
      "SMB hourly WFM (scheduling, time, hiring) priced per location — free Basic ≤10 employees at 1 site; paid Essentials from $24/location/mo annual.",
    shortDescription:
      "Homebase is an SMB frontline app for hourly scheduling, time clocks, team comms, and light hiring. Published per-location plans: Basic free (1 location, ≤10 employees); Essentials $30/$24 monthly vs annual; Plus $70/$56; All-in-One $120/$96 with unlimited employees on paid tiers. 14-day All-in-One trial. Payroll, tip manager, and hiring boosts are add-ons. Multi-site TCO is location-count, not headcount.",
    vendorPositioning:
      "The easy all-in-one app that replaces paper schedules and scattered POS tools for small hourly businesses.",
    pricingModel: "hybrid",
    hasFreePlan: true,
    hasFreeTrial: true,
    trialDays: 14,
    startingPriceMonthly: 24,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from joinhomebase.com/pricing (high confidence). Basic free: 1 location, ≤10 employees. Paid per location annual: Essentials $24, Plus $56, All-in-One $96/mo (monthly $30/$70/$120). Unlimited employees on paid. Payroll advertised ~$39/mo + $6/employee (a $49 figure also appears — confirm cadence). 14-day All-in-One trial. Affiliate economics excluded.",
    pricingSummary:
      "Free Basic (1 location, ≤10 employees). Paid per location annual: Essentials $24 / Plus $56 / All-in-One $96/mo (monthly higher). Payroll add-on. 14-day trial. Confirm on joinhomebase.com/pricing.",
    plans: [
      {
        kind: "free",
        slug: "basic",
        name: "Basic",
        limits: { maxLocations: 1, maxUsers: 10 },
        description: "Free: 1 location, ≤10 employees — scheduling/time starter for tiny shops.",
      },
      {
        kind: "flat-annual",
        slug: "essentials",
        name: "Essentials",
        amount: 24,
        highlighted: true,
        hasFreeTrial: true,
        trialDays: 14,
        description: "$24/location/mo annual ($30 monthly). Unlimited employees. Paid floor.",
      },
      {
        kind: "flat-annual",
        slug: "plus",
        name: "Plus",
        amount: 56,
        description: "$56/location/mo annual ($70 monthly). Scheduling assistant on Plus+.",
      },
      {
        kind: "flat-annual",
        slug: "all-in-one",
        name: "All-in-One",
        amount: 96,
        description: "$96/location/mo annual ($120 monthly). HR/labor controls and deepest published hub.",
      },
    ],
    featureOverrides: {
      ...WFM_FEATURES,
      "ai-assistance": "supported",
    },
    aiLines: [
      "AI assistant: supported",
      "AI summaries: limited",
      "AI automation: supported",
      "AI recommendations: supported",
    ],
    integrations: [
      { integrationSlug: "slack", kind: "native" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    limitations: [
      "Paid pricing is per location — multi-site TCO stacks faster than per-user WFM",
      "Free Basic is capped at 1 location and 10 employees",
      "Payroll, tip manager, and hiring boosts are add-ons on every tier",
      "Not a mid-market multi-entity WFM (Deputy) or restaurant-only suite (7shifts)",
      "Not a core HRIS or dedicated ATS",
    ],
    limitationKinds: [
      "plan-restriction",
      "plan-restriction",
      "requires-add-on",
      "feature-unavailable",
      "feature-unavailable",
    ],
    scores: {
      "ease-of-use": 9,
      "hiring-workforce-fit": 9,
      "workflow-depth": 8,
      integrations: 8,
      "mobile-frontline": 9,
      analytics: 7,
      scalability: 7,
      "value-for-money": 8,
      "ai-capabilities": 7,
    },
    scoreRationales: {
      "ease-of-use":
        "Homebase is the SMB hourly default for replacing paper schedules. Score reflects first-party packaging, not hands-on lab testing.",
      "hiring-workforce-fit":
        "Primary job is frontline WFM (scheduling + time + light hiring). Scored inside WFM, not against ATS or core HRIS.",
      "workflow-depth":
        "Scheduling, clocks, comms, and optional payroll/hiring are solid for SMB. Held at 8 vs Deputy’s deeper multi-location compliance.",
      integrations:
        "POS/payroll connectors are marketed for hourly ops; adequate SMB depth, not an enterprise HCM graph.",
      "mobile-frontline":
        "Hourly mobile scheduling and clock-in are the product thesis — scored as WFM mobility.",
      analytics:
        "Labor reporting on paid tiers is adequate for SMB; not enterprise WFM BI.",
      scalability:
        "Per-location paid unlimited employees helps a growing shop; multi-brand/mid-market is a different shortlist.",
      "value-for-money":
        "Meaningful free Basic plus $24 annual location floor is strong; add-ons and extra locations raise TCO. Affiliate economics excluded.",
      "ai-capabilities":
        "Scheduling Assistant (Plus+) and Hiring/Payroll assistants are published — useful, plan-gated AI.",
    },
    bestFor: [
      "Small hourly businesses (retail, cafes, local services) that need scheduling + time in one app",
      "Teams that want a free ≤10-employee starter before paying per location",
      "Operators who may add payroll later rather than buying Gusto first",
    ],
    notIdealFor: [
      "Restaurant groups standardised on 7shifts",
      "Multi-entity mid-market WFM (Deputy) or deskless comms hubs (Connecteam)",
      "Buyers whose primary job is core HRIS or structured ATS",
    ],
    pros: [
      "Free Basic for tiny hourly teams",
      "Clear per-location Essentials/Plus/All-in-One ladder",
      "Scheduling + time + light hiring in one SMB app",
      "14-day All-in-One trial",
      "Published AI assistants on higher tiers",
    ],
    cons: [
      "Per-location pricing multiplies with sites",
      "Payroll and hiring boosts are add-ons",
      "Free cap of 10 employees / 1 location",
      "Not hospitality-specialist or enterprise WFM",
      "Not a full HRIS",
    ],
    keyFeatures: [
      "Shift scheduling and open shifts",
      "Time clock and timesheets",
      "Team messaging",
      "Light hiring / job posts",
      "Optional payroll add-on",
      "Scheduling Assistant AI (Plus+)",
    ],
    whoShouldChoose:
      "Choose Homebase when SMB hourly scheduling and time clocks priced per location is the job — not when you need restaurant-only WFM, multi-entity Deputy, or a core HRIS.",
    whoShouldConsiderAlternatives:
      "Compare Connecteam for deskless hubs, When I Work for cheap per-user scheduling, Deputy for mid-market compliance, and 7shifts for restaurants.",
    alternativeSlugs: ["connecteam", "when-i-work", "deputy"],
    competitorSlugs: ["when-i-work", "deputy", "7shifts", "connecteam"],
    comparableSlugs: ["connecteam", "when-i-work"],
    useCaseSlugs: ["workforce-scheduling", "frontline-ops", "time-attendance"],
    businessSizeSlugs: ["micro", "small-business"],
    teamTypeSlugs: ["operations"],
    businessTypeSlugs: ["local-business"],
  },

  {
    slug: "when-i-work",
    name: "When I Work",
    company: "When I Work, Inc.",
    website: "https://wheniwork.com",
    domain: "wheniwork.com",
    pricingUrl: "https://wheniwork.com/pricing",
    aliases: ["WhenIWork"],
    membershipRole: "primary",
    jobCluster: "frontline-wfm",
    softShortDescription:
      "Per-user hourly scheduling — Essentials from $2.50/user/mo; Pro $5; Premium $8; 14-day trial. Time & attendance is a paid toggle.",
    shortDescription:
      "When I Work is mobile-first shift scheduling and team messaging for hourly workplaces. Published per-user plans: Essentials $2.50, Pro $5, Premium $8/user/mo. 14-day trial, no credit card. Time & attendance is a separate toggle (dollar amount not printed on the live price card; vendor blog cites +$1.50). Auto-scheduling, multi-location, and POS/payroll integrations sit on Essentials+; SSO/API on Premium. No free forever plan.",
    vendorPositioning:
      "Simple, no-contract scheduling that gets hourly teams on the same page.",
    pricingModel: "per-seat",
    hasFreePlan: false,
    hasFreeTrial: true,
    trialDays: 14,
    startingPriceMonthly: 2.5,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from wheniwork.com/pricing (high confidence on scheduling seats). Essentials $2.50 / Pro $5 / Premium $8 per user/mo. Enterprise contact. T&A ON price is not on the pricing card (medium confidence from vendor comparison blog +$1.50). 14-day trial. Affiliate economics excluded.",
    pricingSummary:
      "Essentials $2.50 / Pro $5 / Premium $8 per user/mo. 14-day trial. Time clock is a paid toggle (amount not on the price card). Confirm on wheniwork.com/pricing.",
    plans: [
      {
        kind: "per-seat-monthly",
        slug: "essentials",
        name: "Essentials",
        amount: 2.5,
        highlighted: true,
        hasFreeTrial: true,
        trialDays: 14,
        description: "$2.50/user/mo scheduling. Auto-scheduling, multi-location, OpenShifts, messaging.",
      },
      {
        kind: "per-seat-monthly",
        slug: "pro",
        name: "Pro",
        amount: 5,
        description: "$5/user/mo. Rules, permissions, labor sharing, custom forecasting.",
      },
      {
        kind: "per-seat-monthly",
        slug: "premium",
        name: "Premium",
        amount: 8,
        description: "$8/user/mo. API, webhooks, SAML/SSO.",
      },
      {
        kind: "contact-sales",
        slug: "enterprise",
        name: "Enterprise",
        description: "Custom enterprise packaging — contact sales.",
      },
    ],
    featureOverrides: {
      ...WFM_FEATURES,
      "time-attendance": "add-on",
      "gps-geofence-clockin": "add-on",
      "payroll-processing": "not-supported",
      "ai-assistance": "limited",
    },
    aiLines: [
      "AI assistant: limited",
      "AI summaries: limited",
      "AI automation: limited",
      "AI recommendations: limited",
    ],
    integrations: [
      { integrationSlug: "slack", kind: "native" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    limitations: [
      "Headline $2.50 is scheduling-only — time & attendance is a toggle not priced on the card",
      "No free forever plan",
      "SSO/API require Premium",
      "Not a restaurant-specialist (7shifts) or full people platform",
      "Payroll is partner-led (Rippling promo), not native",
    ],
    limitationKinds: [
      "requires-add-on",
      "plan-restriction",
      "plan-restriction",
      "feature-unavailable",
      "feature-unavailable",
    ],
    scores: {
      "ease-of-use": 9,
      "hiring-workforce-fit": 8,
      "workflow-depth": 8,
      integrations: 8,
      "mobile-frontline": 9,
      analytics: 7,
      scalability: 8,
      "value-for-money": 8,
      "ai-capabilities": 5,
    },
    scoreRationales: {
      "ease-of-use":
        "Long-standing simple hourly scheduler with a 14-day trial. Score is research-grounded, not lab-tested.",
      "hiring-workforce-fit":
        "Primary job is frontline scheduling/comms. Fit is strong for that cluster; T&A is add-on so not a time-clock specialist.",
      "workflow-depth":
        "OpenShifts, templates, and auto-scheduling on Essentials+ are solid. Premium unlocks API/SSO.",
      integrations:
        "POS/payroll connectors including a Rippling partnership are adequate for hourly stacks.",
      "mobile-frontline":
        "Mobile-first scheduling and messaging are the product thesis.",
      analytics:
        "Forecasting/reporting deepen on Pro; not Deputy-class analytics add-ons.",
      scalability:
        "Per-user path plus Enterprise contact supports growth; T&A packaging is the main ops friction.",
      "value-for-money":
        "Low $2.50 scheduling floor is strong if you do not need clocks; clocks raise real TCO. Affiliate economics excluded.",
      "ai-capabilities":
        "Auto-scheduler/forecasting are marketed; no named AI suite like Deputy AI — scored limited.",
    },
    bestFor: [
      "Hourly teams that mainly need scheduling and messaging at a low per-user price",
      "Operators who will trial 14 days before buying Deputy or Homebase hubs",
      "Multi-location teams that stay on Essentials+ for templates and OpenShifts",
    ],
    notIdealFor: [
      "Teams whose primary job is GPS time clocks (Jibble) without paying the T&A toggle",
      "Restaurants that want 7shifts’ hospitality payroll/tips stack",
      "Buyers who need a free forever WFM tier (Homebase Basic / Connecteam ≤10)",
    ],
    pros: [
      "Low published per-user scheduling floor",
      "14-day trial, no credit card",
      "Mobile-first OpenShifts and messaging",
      "Clear Essentials / Pro / Premium ladder",
      "POS and payroll partner integrations",
    ],
    cons: [
      "Time & attendance not in the $2.50 headline",
      "No free plan",
      "SSO/API on Premium only",
      "AI is not a product pillar",
      "Not hospitality- or HRIS-complete",
    ],
    keyFeatures: [
      "Shift scheduling and OpenShifts",
      "Team messaging",
      "Auto-scheduling and templates (Essentials+)",
      "Optional time & attendance toggle",
      "POS / payroll integrations",
      "Premium API and SSO",
    ],
    whoShouldChoose:
      "Choose When I Work when cheap per-user hourly scheduling is the job — not when clocks must be in the headline price, or when you need restaurant-only or hub-style WFM.",
    whoShouldConsiderAlternatives:
      "Compare Homebase for a free tiny-team tier, Connecteam for deskless hubs, Deputy for compliance-heavy shift work, and 7shifts for restaurants.",
    alternativeSlugs: ["homebase", "connecteam", "deputy"],
    competitorSlugs: ["homebase", "deputy", "7shifts", "connecteam"],
    comparableSlugs: ["homebase", "connecteam"],
    useCaseSlugs: ["workforce-scheduling", "frontline-ops"],
    businessSizeSlugs: ["small-business", "mid-market"],
    teamTypeSlugs: ["operations"],
  },

  {
    slug: "deputy",
    name: "Deputy",
    company: "Deputy Corporation",
    website: "https://www.deputy.com",
    domain: "deputy.com",
    pricingUrl: "https://www.deputy.com/pricing",
    aliases: ["Deputy WFM"],
    membershipRole: "primary",
    jobCluster: "frontline-wfm",
    softShortDescription:
      "Mid-market hourly WFM — Lite $5 / Core $6.50 / Pro $9 per user/mo; $30 invoice minimum; up to 31-day trial.",
    shortDescription:
      "Deputy is a shift-work platform for scheduling, timekeeping, compliance, comms, and optional HR/payroll add-ons. Published USD per-user: Lite $5, Core $6.50 (most popular), Pro $9. $30 monthly invoice minimum. All users including managers are billed. Trial up to 31 days (Core default). HR $2/user, Messaging+ $1.95, Analytics+ $1.50; US payroll via Paycor on annual Core/Pro. Deputy AI is marketed for schedules and timesheets.",
    vendorPositioning:
      "The complete people platform for shift work — scheduling, time, compliance, and actionable AI.",
    pricingModel: "per-seat",
    hasFreePlan: false,
    hasFreeTrial: true,
    trialDays: 31,
    startingPriceMonthly: 5,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from deputy.com/pricing (high confidence). Lite $5 / Core $6.50 / Pro $9 per user/mo USD excl. tax. $30 USD invoice minimum. Add-ons: HR $2, Messaging+ $1.95, Analytics+ $1.50. US payroll $8/user + $49 base on annual Core/Pro. Trial up to 31 days. Affiliate economics excluded.",
    pricingSummary:
      "Lite $5 / Core $6.50 / Pro $9 per user/mo. $30 invoice minimum. Add-ons for HR, messaging, analytics, US payroll. Up to 31-day trial. Confirm on deputy.com/pricing.",
    plans: [
      {
        kind: "per-seat-monthly",
        slug: "lite",
        name: "Lite",
        amount: 5,
        hasFreeTrial: true,
        trialDays: 31,
        description: "$5/user/mo. Basic scheduling, timesheets, clock, leave, messaging.",
      },
      {
        kind: "per-seat-monthly",
        slug: "core",
        name: "Core",
        amount: 6.5,
        highlighted: true,
        hasFreeTrial: true,
        trialDays: 31,
        description: "$6.50/user/mo. Auto-scheduling, forecasting, biometrics, labor budgets.",
      },
      {
        kind: "per-seat-monthly",
        slug: "pro",
        name: "Pro",
        amount: 9,
        description: "$9/user/mo. SSO, location hierarchies, Analytics+ and Messaging+ included.",
      },
    ],
    featureOverrides: {
      ...WFM_FEATURES,
      "core-hris": "add-on",
      "ai-assistance": "supported",
    },
    aiLines: [
      "AI assistant: supported",
      "AI summaries: supported",
      "AI automation: supported",
      "AI recommendations: supported",
    ],
    integrations: [
      { integrationSlug: "slack", kind: "native" },
      { integrationSlug: "zapier", kind: "zapier-style" },
      { integrationSlug: "google-workspace", kind: "native" },
    ],
    limitations: [
      "Every user including managers is billed; $30 invoice minimum",
      "HR, analytics, messaging, and US payroll are add-ons (some bundled on Pro)",
      "SMS is usage-priced by country",
      "No free forever plan",
      "Not a restaurant-only suite or a core HRIS like BambooHR",
    ],
    limitationKinds: [
      "plan-restriction",
      "requires-add-on",
      "requires-add-on",
      "plan-restriction",
      "feature-unavailable",
    ],
    scores: {
      "ease-of-use": 8,
      "hiring-workforce-fit": 9,
      "workflow-depth": 9,
      integrations: 8,
      "mobile-frontline": 9,
      analytics: 8,
      scalability: 9,
      "value-for-money": 6,
      "ai-capabilities": 8,
    },
    scoreRationales: {
      "ease-of-use":
        "Deeper than Homebase/When I Work; still shift-work native. Score reflects mid-market WFM admin, not lab testing.",
      "hiring-workforce-fit":
        "Primary job is frontline WFM with compliance and timekeeping. Scored inside WFM — not an ATS or HRIS peer.",
      "workflow-depth":
        "Auto-scheduling, forecasting, biometrics, and location hierarchies on Core/Pro are the deepest P2 WFM workflows.",
      integrations:
        "Payroll/POS and identity connectors plus Paycor US payroll path are solid for shift-work stacks.",
      "mobile-frontline":
        "Clock, swaps, and messaging are built for hourly mobile use.",
      analytics:
        "Analytics+ / Pro reporting is stronger than SMB schedulers.",
      scalability:
        "Per-user plus location hierarchies and Enterprise-adjacent Pro features support multi-site growth.",
      "value-for-money":
        "Add-ons, manager billing, and the $30 floor depress value versus $2.50 When I Work scheduling. Affiliate economics excluded.",
      "ai-capabilities":
        "Deputy AI (human-in-the-loop for schedules/timesheets) plus Core+ auto-scheduling is a real WFM AI story.",
    },
    bestFor: [
      "Multi-location hourly operators who need scheduling + time + labor compliance",
      "Teams that will trial Core for up to 31 days before Homebase-style SMB hubs",
      "Ops leaders who want WFM AI with a human-in-the-loop",
    ],
    notIdealFor: [
      "Tiny shops that need a free ≤10-employee plan",
      "Restaurant groups standardised on 7shifts",
      "Buyers whose primary job is core HRIS or structured ATS",
    ],
    pros: [
      "Deep shift-work scheduling and timekeeping",
      "Published Lite/Core/Pro per-user ladder",
      "Up to 31-day trial",
      "Deputy AI plus Core auto-scheduling",
      "Location hierarchies and SSO on Pro",
    ],
    cons: [
      "Managers billed; $30 invoice minimum",
      "Add-ons stack TCO",
      "No free plan",
      "US payroll is partner/add-on",
      "Heavier than SMB Homebase",
    ],
    keyFeatures: [
      "Auto-scheduling and demand forecasting",
      "Timekeeping and biometrics (Core+)",
      "Labor-law and leave tools",
      "Team messaging (add-on or Pro)",
      "Deputy AI for schedules/timesheets",
      "Optional HR and US payroll add-ons",
    ],
    whoShouldChoose:
      "Choose Deputy when multi-location shift work, timekeeping, and compliance are the job — not when you need a free SMB tier, restaurant-only WFM, or a core HRIS.",
    whoShouldConsiderAlternatives:
      "Compare Connecteam for deskless hubs, Homebase for cheaper SMB locations, When I Work for low per-user scheduling, and 7shifts for restaurants.",
    alternativeSlugs: ["connecteam", "homebase", "when-i-work"],
    competitorSlugs: ["homebase", "when-i-work", "7shifts", "connecteam"],
    comparableSlugs: ["connecteam", "homebase"],
    useCaseSlugs: ["workforce-scheduling", "frontline-ops", "time-attendance"],
    businessSizeSlugs: ["small-business", "mid-market", "enterprise"],
    teamTypeSlugs: ["operations"],
  },

  {
    slug: "7shifts",
    name: "7shifts",
    company: "7shifts Inc.",
    website: "https://www.7shifts.com",
    domain: "7shifts.com",
    pricingUrl: "https://www.7shifts.com/pricing",
    aliases: ["7 Shifts", "Seven Shifts"],
    membershipRole: "primary",
    jobCluster: "frontline-wfm",
    softShortDescription:
      "Restaurant WFM priced per location — Essentials $44.99 (≤30 staff); Pro $89.99 (≤60); Premium $149.99 unlimited; free plan + 14-day Pro trial.",
    shortDescription:
      "7shifts is hospitality workforce management: scheduling, 7punches time clock, tips, tasks, POS sync, and optional restaurant payroll. Paid per-location floors (first-party 2026): Essentials $44.99/mo (≤30 employees), Pro $89.99 (≤60), Premium $149.99 unlimited with payroll included. Payroll on lower tiers ~$39.99/location + $6/employee paid. Free Comp plan exists (caps not fully published on pages fetched). 14-day Pro trial.",
    vendorPositioning:
      "The restaurant operator’s single app from shift to paycheck.",
    pricingModel: "hybrid",
    hasFreePlan: true,
    hasFreeTrial: true,
    trialDays: 14,
    startingPriceMonthly: 44.99,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from 7shifts.com/pricing and first-party payroll landing (high confidence on paid tiers). Essentials $44.99 / Pro $89.99 / Premium $149.99 per location/mo with employee caps 30 / 60 / unlimited. Payroll add-on ~$39.99/location + $6/ee on Essentials/Pro; included on Premium still +$6/ee paid. Free plan yes; Comp caps not fully on fetched HTML. 14-day Pro trial. Affiliate economics excluded.",
    pricingSummary:
      "Per location: Essentials $44.99 (≤30 staff) / Pro $89.99 (≤60) / Premium $149.99 unlimited. Free plan available. 14-day Pro trial. Payroll extra on lower tiers. Confirm on 7shifts.com/pricing.",
    plans: [
      {
        kind: "free",
        slug: "comp",
        name: "Comp (Free)",
        description: "Free hospitality starter. Confirm live employee/location caps on 7shifts.com/pricing.",
      },
      {
        kind: "flat-annual",
        slug: "essentials",
        name: "Essentials",
        amount: 44.99,
        highlighted: true,
        hasFreeTrial: true,
        trialDays: 14,
        limits: { maxUsers: 30 },
        description: "$44.99/location/mo. ≤30 employees. Advanced scheduling and basic time clock.",
      },
      {
        kind: "flat-annual",
        slug: "pro",
        name: "Pro",
        amount: 89.99,
        hasFreeTrial: true,
        trialDays: 14,
        limits: { maxUsers: 60 },
        description: "$89.99/location/mo. ≤60 employees. Labor compliance, advanced clock, performance.",
      },
      {
        kind: "flat-annual",
        slug: "premium",
        name: "Premium",
        amount: 149.99,
        description: "$149.99/location/mo. Unlimited employees. Tips, tasks, forecasts; payroll included + $6/ee paid.",
      },
    ],
    featureOverrides: {
      ...WFM_FEATURES,
      "ai-assistance": "supported",
    },
    aiLines: [
      "AI assistant: limited",
      "AI summaries: limited",
      "AI automation: supported",
      "AI recommendations: supported",
    ],
    integrations: [
      { integrationSlug: "slack", kind: "native" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    limitations: [
      "Hospitality-specialist — not a general retail/field WFM",
      "Per-location pricing and employee caps force Pro/Premium as sites grow",
      "Tip/task/auto-scheduler depth is Premium-gated",
      "Payroll still bills $6/employee paid even when ‘included’",
      "Free Comp caps were not fully published on fetched pages",
    ],
    limitationKinds: [
      "feature-unavailable",
      "plan-restriction",
      "plan-restriction",
      "requires-add-on",
      "other",
    ],
    scores: {
      "ease-of-use": 8,
      "hiring-workforce-fit": 9,
      "workflow-depth": 8,
      integrations: 9,
      "mobile-frontline": 9,
      analytics: 8,
      scalability: 8,
      "value-for-money": 7,
      "ai-capabilities": 7,
    },
    scoreRationales: {
      "ease-of-use":
        "Restaurant-native UX for operators already living in POS land. Not lab-tested.",
      "hiring-workforce-fit":
        "Primary job is hospitality frontline WFM. Scored inside WFM; do not rank as a generic HRIS or ATS.",
      "workflow-depth":
        "Scheduling, 7punches, tips, and tasks are deep for restaurants. Caps and Premium gates hold the score at 8.",
      integrations:
        "POS sync is a category strength versus generic WFM tools.",
      "mobile-frontline":
        "Shift-to-paycheck mobile is the hospitality thesis.",
      analytics:
        "Labor forecasts and insights deepen on Pro/Premium.",
      scalability:
        "Per-location + employee caps scale restaurant groups, but TCO doubles with each site.",
      "value-for-money":
        "Paid floors start near $45/location; payroll $6/ee stacks. Free Comp helps tiny restaurants. Affiliate economics excluded.",
      "ai-capabilities":
        "ML sales forecast and auto-scheduler are marketed — useful hospitality AI, not a general HR copilot.",
    },
    bestFor: [
      "Restaurants and hospitality groups that want scheduling, punches, tips, and POS in one WFM",
      "Operators comparing 7shifts as the hospitality default versus Homebase",
      "Teams that will trial Pro for 14 days before Premium payroll",
    ],
    notIdealFor: [
      "Non-restaurant hourly businesses (Homebase / When I Work / Connecteam fit better)",
      "Core HRIS or structured ATS buyers",
      "Deskless field teams that need GPS clocks without restaurant features",
    ],
    pros: [
      "Hospitality-native scheduling, tips, and POS sync",
      "Published per-location paid ladder",
      "Free Comp starter + 14-day Pro trial",
      "7punches time clock",
      "Forecast/auto-scheduler AI on higher tiers",
    ],
    cons: [
      "Not a general WFM outside restaurants",
      "Location × employee-cap TCO",
      "Premium gates tips/tasks",
      "Payroll still has per-employee fees",
      "Free Comp limits not fully published",
    ],
    keyFeatures: [
      "Restaurant shift scheduling",
      "7punches time clock",
      "Tip and task management (Premium)",
      "POS integrations",
      "Labor forecasting",
      "Optional restaurant payroll",
    ],
    whoShouldChoose:
      "Choose 7shifts when restaurant scheduling, punches, tips, and POS sync are the job — not when you need general SMB WFM, a core HRIS, or an ATS.",
    whoShouldConsiderAlternatives:
      "Compare Homebase for general hourly SMB, Deputy for multi-industry compliance WFM, Connecteam for deskless hubs, and Toast-adjacent stacks for POS-first operators.",
    alternativeSlugs: ["homebase", "deputy", "connecteam"],
    competitorSlugs: ["homebase", "when-i-work", "deputy", "connecteam"],
    comparableSlugs: ["homebase", "deputy"],
    useCaseSlugs: ["workforce-scheduling", "frontline-ops", "time-attendance"],
    businessSizeSlugs: ["small-business", "mid-market"],
    teamTypeSlugs: ["operations"],
    businessTypeSlugs: ["local-business"],
  },

  {
    slug: "lever",
    name: "Lever",
    company: "Employ, Inc.",
    website: "https://www.lever.co",
    domain: "lever.co",
    pricingUrl: "https://www.lever.co/pricing",
    aliases: ["Lever ATS"],
    membershipRole: "primary",
    jobCluster: "ats-recruiting",
    softShortDescription:
      "ATS + recruiting CRM under Employ — custom quote (Core AI-powered hiring platform plus Insights/VONQ/Onboarding add-ons); demo-led, no published seat $.",
    shortDescription:
      "Lever is an ATS plus recruiting CRM for growing and enterprise talent teams, now under Employ (alongside JazzHR and Jobvite). The pricing page is quote-led: a core AI-powered hiring platform (ATS+CRM, reporting, AI screening, interview transcripts/summaries, fraud signals) plus add-ons (Candidate Insights, AI Screening by VONQ, Onboarding). No published USD floor, free plan, or self-serve trial — demo / quote only. IBM watsonx.governance is marketed for AI governance.",
    vendorPositioning:
      "An AI-powered hiring platform that unifies ATS and CRM so hiring doesn’t hijack the week.",
    pricingModel: "custom-quote",
    hasFreePlan: false,
    hasFreeTrial: false,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from lever.co/pricing (high confidence that no USD list exists). Custom quote by company size / hiring needs. Add-ons quote-only. No free plan or self-serve trial. Affiliate economics excluded.",
    pricingSummary:
      "Custom quote. Named core AI-powered hiring platform plus Insights / VONQ screening / Onboarding add-ons. No published seat dollars. Confirm on lever.co/pricing.",
    plans: [
      {
        kind: "contact-sales",
        slug: "core",
        name: "AI-Powered Hiring Platform",
        highlighted: true,
        description: "ATS+CRM core — contact sales. No published USD.",
      },
      {
        kind: "contact-sales",
        slug: "add-ons",
        name: "Insights / VONQ / Onboarding",
        description: "Quote-only add-ons on top of the core platform.",
      },
    ],
    featureOverrides: {
      ...ATS_FEATURES,
      "core-hris": "limited",
    },
    aiLines: [
      "AI assistant: supported",
      "AI summaries: supported",
      "AI automation: supported",
      "AI recommendations: supported",
    ],
    integrations: [
      { integrationSlug: "slack", kind: "native" },
      { integrationSlug: "google-workspace", kind: "native" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    limitations: [
      "No published list price — ACV and implementation are opaque",
      "No free plan or self-serve trial",
      "Insights, VONQ screening, and onboarding are extra",
      "Not a core HRIS or payroll platform",
      "Employ family (JazzHR/Jobvite) can confuse packaging",
    ],
    limitationKinds: [
      "plan-restriction",
      "plan-restriction",
      "requires-add-on",
      "feature-unavailable",
      "other",
    ],
    scores: {
      "ease-of-use": 8,
      "hiring-workforce-fit": 9,
      "workflow-depth": 8,
      integrations: 8,
      "mobile-frontline": 5,
      analytics: 8,
      scalability: 8,
      "value-for-money": 6,
      "ai-capabilities": 8,
    },
    scoreRationales: {
      "ease-of-use":
        "ATS+CRM in one recruiting workspace is familiar to mid-market TA. Not lab-tested.",
      "hiring-workforce-fit":
        "Primary job is ATS/recruiting. Scored as a Greenhouse/Ashby peer — not WFM or HRIS.",
      "workflow-depth":
        "ATS+CRM, screening, and interview intelligence are solid. Held at 8 vs Greenhouse kits and Ashby analytics depth.",
      integrations:
        "HRIS, LinkedIn, and collaboration connectors are table-stakes for this cohort.",
      "mobile-frontline":
        "Recruiter mobility only — not deskless WFM.",
      analytics:
        "Reporting plus Candidate Insights add-on is adequate mid-market TA analytics.",
      scalability:
        "Quote-by-company-size supports growth; Employ portfolio is the enterprise adjacency.",
      "value-for-money":
        "Opaque custom quotes and add-ons depress value versus Workable/Breezy published floors. Affiliate economics excluded.",
      "ai-capabilities":
        "AI screening, transcripts/summaries, fraud signals, and watsonx.governance are a real ATS AI story with packaging gates.",
    },
    bestFor: [
      "Mid-market talent teams that want ATS and recruiting CRM together",
      "Orgs already comparing Greenhouse / Lever / Ashby as the dedicated ATS shortlist",
      "Teams that will take a demo rather than a self-serve ATS trial",
    ],
    notIdealFor: [
      "SMB teams that need published ATS floors or a free Bootstrap (Workable / Breezy)",
      "AI-native all-in-one ATS buyers leaning Ashby",
      "Core HRIS or payroll-first buyers",
    ],
    pros: [
      "ATS + recruiting CRM in one platform",
      "Named AI screening and interview intelligence",
      "Fraud signals and governance story",
      "Employ ecosystem adjacency",
      "Standard Greenhouse-cohort shortlist name",
    ],
    cons: [
      "Custom quote only",
      "No free plan or trial",
      "Add-ons extra",
      "Not structured-hiring-kit depth of Greenhouse",
      "Not a people platform",
    ],
    keyFeatures: [
      "Applicant tracking and recruiting CRM",
      "AI screening and interview summaries",
      "Fraud-prevention signals",
      "Reporting and optional Candidate Insights",
      "HRIS / LinkedIn integrations",
      "Optional onboarding add-on",
    ],
    whoShouldChoose:
      "Choose Lever when a mid-market ATS+CRM with AI screening is the job and you will take a custom quote — not when you need published SMB ATS prices or Greenhouse-depth structured hiring kits.",
    whoShouldConsiderAlternatives:
      "Compare Greenhouse for structured hiring, Ashby for modern AI ATS analytics, Workable for published floors, and Breezy HR for a free Bootstrap.",
    alternativeSlugs: ["greenhouse", "ashby", "workable"],
    competitorSlugs: ["greenhouse", "ashby", "workable", "breezy-hr"],
    comparableSlugs: ["greenhouse", "ashby"],
    useCaseSlugs: ["recruiting-ats"],
    businessSizeSlugs: ["mid-market", "enterprise"],
    teamTypeSlugs: ["recruiting"],
  },

  {
    slug: "ashby",
    name: "Ashby",
    company: "Ashby, Inc.",
    website: "https://www.ashbyhq.com",
    domain: "ashbyhq.com",
    pricingUrl: "https://www.ashbyhq.com/pricing",
    aliases: ["Ashby ATS", "AshbyHQ"],
    membershipRole: "primary",
    jobCluster: "ats-recruiting",
    softShortDescription:
      "Modern ATS + CRM/analytics — Foundations $400/mo flat for ≤100 employees (10% off annual); Plus/Enterprise seat-based custom quote.",
    shortDescription:
      "Ashby is an all-in-one ATS with recruiting CRM, scheduling, and analytics, marketed from startups through enterprise. Foundations is $400/mo (≤100 employees; 10% off annual). Plus (101–1,000) and Enterprise (1,000+) are seat-based custom quotes. Foundations extras: SSO $100/mo, extra SMS, 1,500 AI credits/mo; AI Notetaker and Advanced Scheduling are paid add-ons without public dollars. No free plan. Analytics is also sold standalone for teams keeping another ATS.",
    vendorPositioning:
      "The ATS that should not force a choice between platform depth and AI.",
    pricingModel: "hybrid",
    hasFreePlan: false,
    hasFreeTrial: false,
    startingPriceMonthly: 400,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from ashbyhq.com/pricing (high confidence). Foundations $400/mo for ≤100 employees, 10% off annual. Plus/Enterprise custom. SSO $100/mo on Foundations. AI credits included by tier; Notetaker and Advanced Scheduling add-ons unpublished. No free plan. Affiliate economics excluded.",
    pricingSummary:
      "Foundations $400/mo (≤100 employees). Plus/Enterprise custom seat quotes after 100 employees. SSO $100/mo on Foundations. Confirm on ashbyhq.com/pricing.",
    plans: [
      {
        kind: "flat-annual",
        slug: "foundations",
        name: "All-in-One Foundations",
        amount: 400,
        highlighted: true,
        limits: { maxUsers: 100 },
        description: "$400/mo for companies ≤100 employees. 10% off annual. AI credits included.",
      },
      {
        kind: "contact-sales",
        slug: "plus",
        name: "All-in-One Plus",
        description: "101–1,000 employees — seat-based custom quote.",
      },
      {
        kind: "contact-sales",
        slug: "enterprise",
        name: "All-in-One Enterprise",
        description: "1,000+ employees — custom consolidation quote.",
      },
    ],
    featureOverrides: {
      ...ATS_FEATURES,
      "analytics-reporting": "supported",
      "ai-assistance": "add-on",
    },
    aiLines: [
      "AI assistant: add-on",
      "AI summaries: add-on",
      "AI automation: supported",
      "AI recommendations: supported",
    ],
    integrations: [
      { integrationSlug: "slack", kind: "native" },
      { integrationSlug: "google-workspace", kind: "native" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    limitations: [
      "Crossing 101 employees leaves the $400 flat for seat-based quotes",
      "SSO, extra SMS, Notetaker, and Advanced Scheduling stack TCO on Foundations",
      "No free plan or published trial",
      "Not a core HRIS or WFM product",
      "Analytics-on-another-ATS is a separate SKU",
    ],
    limitationKinds: [
      "plan-restriction",
      "requires-add-on",
      "plan-restriction",
      "feature-unavailable",
      "requires-add-on",
    ],
    scores: {
      "ease-of-use": 8,
      "hiring-workforce-fit": 9,
      "workflow-depth": 9,
      integrations: 8,
      "mobile-frontline": 6,
      analytics: 8,
      scalability: 8,
      "value-for-money": 6,
      "ai-capabilities": 9,
    },
    scoreRationales: {
      "ease-of-use":
        "Startup-to-mid ATS with a published Foundations SKU is easier to start than Greenhouse quotes — still not a free Bootstrap. Not lab-tested.",
      "hiring-workforce-fit":
        "Primary job is modern ATS/CRM/analytics. Scored inside ATS; Greenhouse keeps structured-hiring-kit excellence.",
      "workflow-depth":
        "Scheduling, sourcing, and analytics in one ATS is deep. Held at 9 vs the most process-heavy enterprise TA suites.",
      integrations:
        "Standard TA ecosystem connectors; MCP/AI tooling is the differentiator more than connector count.",
      "mobile-frontline":
        "Hiring-manager mobility is better than some enterprise ATS tools, still not WFM.",
      analytics:
        "Native ATS analytics (and standalone Analytics SKU) are a published strength.",
      scalability:
        "Foundations → Plus → Enterprise is clear; the 101-employee quote cliff is the friction.",
      "value-for-money":
        "$400/mo is a high SMB floor versus Breezy/Workable; add-ons raise TCO. Affiliate economics excluded.",
      "ai-capabilities":
        "Agents, credits, notetaker, and auto-scheduler are the most complete P2 ATS AI story — with credit/add-on packaging.",
    },
    bestFor: [
      "Startups and growth-stage companies (≤100 employees) that want one modern ATS+analytics platform",
      "TA teams comparing Ashby vs Greenhouse for AI-native hiring",
      "Orgs willing to pay a high Foundations floor instead of a free ATS",
    ],
    notIdealFor: [
      "Teams that need a free ATS or $157 Breezy-style floors",
      "Structured-hiring enterprises standardised on Greenhouse kits",
      "Core HRIS or payroll-first buyers",
    ],
    pros: [
      "Published $400 Foundations SKU (≤100 employees)",
      "ATS + CRM + analytics in one product",
      "Strong AI agent / credits story",
      "Clear jump to Plus/Enterprise by headcount",
      "Optional Analytics if you keep another ATS",
    ],
    cons: [
      "High SMB floor versus Breezy/Workable",
      "Quote cliff after 100 employees",
      "SSO and advanced AI features extra on Foundations",
      "No free plan",
      "Not structured-hiring-kit Greenhouse",
    ],
    keyFeatures: [
      "All-in-one ATS, CRM, and scheduling",
      "Native recruiting analytics",
      "AI assistant/agents with monthly credits",
      "Optional AI Notetaker and advanced scheduling",
      "Foundations SSO add-on",
      "Standalone Analytics SKU",
    ],
    whoShouldChoose:
      "Choose Ashby when a modern AI-forward ATS with published Foundations pricing for ≤100 employees is the job — not when you need a free ATS, Greenhouse structured kits, or a core HRIS.",
    whoShouldConsiderAlternatives:
      "Compare Greenhouse for structured hiring, Lever for ATS+CRM quotes, Workable for cheaper published floors, and Breezy HR for a free Bootstrap.",
    alternativeSlugs: ["greenhouse", "lever", "workable"],
    competitorSlugs: ["greenhouse", "lever", "workable", "breezy-hr"],
    comparableSlugs: ["greenhouse", "lever"],
    useCaseSlugs: ["recruiting-ats"],
    businessSizeSlugs: ["small-business", "mid-market", "enterprise"],
    teamTypeSlugs: ["recruiting"],
  },

  {
    slug: "hibob",
    name: "HiBob",
    company: "HiBob",
    website: "https://www.hibob.com",
    domain: "hibob.com",
    pricingUrl: "https://www.hibob.com/pricing-plans/",
    aliases: ["Bob", "Bob HR", "Hi Bob"],
    membershipRole: "primary",
    jobCluster: "hris-core",
    softShortDescription:
      "Culture-forward mid-market HRIS (Bob Core + modules) — custom PEPM quote; no published seat dollars; AI Companion included in Core.",
    shortDescription:
      "HiBob (product brand Bob) is a modular HRIS for distributed mid-market companies: employee system of record, time off, workflows, analytics, and mobile, with optional hiring, payroll (US/UK), talent, compensation, learning, and time & attendance modules. Every subscription includes Bob Core (including AI Companion). Pricing is custom PEPM plus implementation — no published USD floor, free plan, or self-serve trial. Demo / pricing request only.",
    vendorPositioning:
      "The intuitive, modular people platform that scales from growing companies to 1,000+ without Workday weight.",
    pricingModel: "custom-quote",
    hasFreePlan: false,
    hasFreeTrial: false,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from hibob.com/pricing-plans (high confidence that no USD list exists). Custom PEPM + modules + implementation. Bob Core included in every subscription. No free plan or self-serve trial. Affiliate economics excluded.",
    pricingSummary:
      "Custom quote. Bob Core is included; talent, payroll, T&A, compensation, and learning are modules. No published PEPM. Confirm on hibob.com/pricing-plans.",
    plans: [
      {
        kind: "contact-sales",
        slug: "core",
        name: "Bob Core",
        highlighted: true,
        description: "Included in every subscription — employee DB, time off, workflows, analytics, AI Companion. Quote-only.",
      },
      {
        kind: "contact-sales",
        slug: "modules",
        name: "Optional modules",
        description: "Hiring, Payroll Hub, Talent, Compensation, Learning, Time & Attendance, surveys — quote PEPM.",
      },
    ],
    featureOverrides: {
      "applicant-tracking": "add-on",
      "career-site-job-boards": "add-on",
      "interview-scheduling": "add-on",
      "core-hris": "supported",
      "payroll-processing": "add-on",
      "benefits-admin": "limited",
      "workforce-scheduling": "not-supported",
      "frontline-comms": "limited",
      "time-attendance": "add-on",
      "gps-geofence-clockin": "not-supported",
      "sop-knowledge-base": "limited",
      "employee-training-paths": "add-on",
      "lms-course-commerce": "not-supported",
      "hris-integrations": "supported",
      "analytics-reporting": "supported",
      "ai-assistance": "supported",
    },
    aiLines: [
      "AI assistant: supported",
      "AI summaries: supported",
      "AI automation: limited",
      "AI recommendations: supported",
    ],
    integrations: [
      { integrationSlug: "slack", kind: "native" },
      { integrationSlug: "google-workspace", kind: "native" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    limitations: [
      "No published PEPM — implementation and modules dominate TCO",
      "No free plan or self-serve trial",
      "Payroll, T&A, talent, and learning are modules on top of Core",
      "Not a frontline WFM or dedicated ATS",
      "US payroll depth is module/region-specific versus Gusto/Rippling",
    ],
    limitationKinds: [
      "plan-restriction",
      "plan-restriction",
      "requires-add-on",
      "feature-unavailable",
      "feature-unavailable",
    ],
    scores: {
      "ease-of-use": 9,
      "hiring-workforce-fit": 9,
      "workflow-depth": 8,
      integrations: 8,
      "mobile-frontline": 7,
      analytics: 8,
      scalability: 9,
      "value-for-money": 6,
      "ai-capabilities": 8,
    },
    scoreRationales: {
      "ease-of-use":
        "Culture-forward HRIS UX is the mid-market shortlist reason versus Workday weight. Not lab-tested.",
      "hiring-workforce-fit":
        "Primary job is core HRIS for distributed growth companies. Scored inside hris-core, not as ATS or WFM.",
      "workflow-depth":
        "Core people admin plus modular talent/payroll is deep. Held at 8 vs Rippling’s IT graph.",
      integrations:
        "Marketplace and collaboration connectors are strong for a mid-market HRIS.",
      "mobile-frontline":
        "Employee mobile is solid; not a deskless WFM app.",
      analytics:
        "People analytics in Core plus module insights are adequate mid-market.",
      scalability:
        "Modular path from <200 toward 1,000+ is the vendor thesis; still not enterprise HCM.",
      "value-for-money":
        "Opaque PEPM and module stacking depress value versus BambooHR’s published $10 floor. Affiliate economics excluded.",
      "ai-capabilities":
        "Bob AI Companion included in Core is a real included-AI story versus add-on-only suites.",
    },
    bestFor: [
      "Distributed mid-market companies that want a modern HRIS without Workday implementation",
      "People teams comparing HiBob vs BambooHR when culture UX and modules matter more than published PEPM",
      "Orgs that will attach payroll/talent later as modules",
    ],
    notIdealFor: [
      "SMB teams that need published $10 PEPM (BambooHR) or payroll-first Gusto",
      "EU-first GDPR buyers standardised on Personio",
      "Frontline scheduling or dedicated ATS as the primary purchase",
    ],
    pros: [
      "Modern mid-market HRIS shortlist name",
      "Bob Core includes AI Companion",
      "Modular talent, payroll, T&A, learning",
      "Strong employee UX / culture positioning",
      "Scales past typical BambooHR comfort zone",
    ],
    cons: [
      "Custom quote only",
      "Modules extra",
      "No free plan or trial",
      "Not a WFM or ATS specialist",
      "Payroll is not the Gusto-simple path",
    ],
    keyFeatures: [
      "Employee system of record and time off",
      "Lifecycle workflows and analytics",
      "Bob AI Companion in Core",
      "Optional hiring, payroll, talent, compensation modules",
      "Employee mobile app",
      "Integrations marketplace",
    ],
    whoShouldChoose:
      "Choose HiBob when a culture-forward mid-market HRIS with modular talent/payroll is the job and you will take a PEPM quote — not when you need published SMB PEPM, EU-first Personio, or frontline WFM.",
    whoShouldConsiderAlternatives:
      "Compare BambooHR for published PEPM, Personio for EU GDPR-native HRIS, Rippling for HR+IT unification, and Workday for enterprise HCM.",
    alternativeSlugs: ["bamboohr", "personio", "rippling"],
    competitorSlugs: ["bamboohr", "personio", "rippling", "workday"],
    comparableSlugs: ["bamboohr", "personio"],
    useCaseSlugs: ["core-hris"],
    businessSizeSlugs: ["small-business", "mid-market", "enterprise"],
    teamTypeSlugs: ["operations", "recruiting"],
  },

  {
    slug: "personio",
    name: "Personio",
    company: "Personio SE",
    website: "https://www.personio.com",
    domain: "personio.com",
    pricingUrl: "https://www.personio.com/pricing/",
    aliases: ["Personio HR"],
    membershipRole: "primary",
    jobCluster: "hris-core",
    softShortDescription:
      "EU mid-market HRIS — Core from €7.60 PEPM (no USD list); CorePro and Recruiting/Payroll apps are quote-led; 12-month annual minimum.",
    shortDescription:
      "Personio is a GDPR-native HRIS for European SMB and mid-market teams: employee file, absences, workflows, time tracking, and preliminary payroll on Core. Homepage publishes Core from €7.60 per employee/month. CorePro (positions, unlimited docs/legal entities, API) and Apps (Recruiting, Surveys, Performance, selected-country payroll) are contact-sales. Annual subscription with 12-month minimum; ~10% off for annual upfront. One-time setup fee by company size. No USD list prices and no free plan.",
    vendorPositioning:
      "GDPR-native HR software that starts simply and scales with European growing companies.",
    pricingModel: "hybrid",
    hasFreePlan: false,
    hasFreeTrial: false,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from personio.com/pricing and homepage (high confidence on EUR floor only). Core from €7.60 PEPM. CorePro and Apps quote-only. No USD list — do not invent a dollar floor. 12-month minimum; setup fee by size. Affiliate economics excluded.",
    pricingSummary:
      "Core from €7.60 per employee/month (EUR, not USD). CorePro and Recruiting/Payroll apps are quotes. 12-month minimum + setup fee. Confirm on personio.com/pricing.",
    plans: [
      {
        kind: "contact-sales",
        slug: "core",
        name: "Core",
        highlighted: true,
        description:
          "From €7.60 PEPM (homepage). Employee file, absences, workflows, time tracking, preliminary payroll. No USD list.",
      },
      {
        kind: "contact-sales",
        slug: "corepro",
        name: "CorePro",
        description: "Most popular — positions, unlimited docs/entities, API. Contact sales.",
      },
      {
        kind: "contact-sales",
        slug: "apps",
        name: "Apps",
        description: "Recruiting, Surveys, Performance, and payroll in selected EU countries — quote.",
      },
    ],
    featureOverrides: {
      "applicant-tracking": "add-on",
      "career-site-job-boards": "add-on",
      "interview-scheduling": "add-on",
      "core-hris": "supported",
      "payroll-processing": "limited",
      "benefits-admin": "limited",
      "workforce-scheduling": "not-supported",
      "frontline-comms": "not-supported",
      "time-attendance": "supported",
      "gps-geofence-clockin": "not-supported",
      "sop-knowledge-base": "limited",
      "employee-training-paths": "not-supported",
      "lms-course-commerce": "not-supported",
      "hris-integrations": "supported",
      "analytics-reporting": "supported",
      "ai-assistance": "supported",
    },
    aiLines: [
      "AI assistant: supported",
      "AI summaries: limited",
      "AI automation: limited",
      "AI recommendations: limited",
    ],
    integrations: [
      { integrationSlug: "slack", kind: "native" },
      { integrationSlug: "google-workspace", kind: "native" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    limitations: [
      "No USD list price — Core floor is EUR; Apps and CorePro are quotes",
      "Recruiting and full payroll are Apps, not Core",
      "12-month minimum plus a size-based setup fee",
      "Every active employee is a license",
      "Weak US-payroll story versus Gusto/Rippling/BambooHR",
    ],
    limitationKinds: [
      "plan-restriction",
      "requires-add-on",
      "plan-restriction",
      "plan-restriction",
      "feature-unavailable",
    ],
    scores: {
      "ease-of-use": 8,
      "hiring-workforce-fit": 9,
      "workflow-depth": 8,
      integrations: 8,
      "mobile-frontline": 6,
      analytics: 7,
      scalability: 8,
      "value-for-money": 7,
      "ai-capabilities": 7,
    },
    scoreRationales: {
      "ease-of-use":
        "EU SMB/mid HRIS with a published Core EUR floor is approachable versus Workday. Not lab-tested.",
      "hiring-workforce-fit":
        "Primary job is GDPR-native core HRIS. Scored inside hris-core; recruiting is an App, not the core job.",
      "workflow-depth":
        "Core people admin, absences, and workflows are solid. Payroll/recruiting depth lives on Apps.",
      integrations:
        "European payroll/accounting connectors plus collaboration apps are adequate.",
      "mobile-frontline":
        "Employee self-serve exists; not deskless WFM.",
      analytics:
        "Core analytics plus App surveys/performance — adequate, not HiBob culture-analytics depth.",
      scalability:
        "Vendor claims ~10–5,000 employees; CorePro entities/API support mid-market growth.",
      "value-for-money":
        "Published €7.60 Core floor is clearer than HiBob quotes; setup fee and 12-month lock are the friction. No USD invented. Affiliate economics excluded.",
      "ai-capabilities":
        "In-product AI agents are marketed in 2026 without a separate public SKU — useful but not Ashby-class ATS AI.",
    },
    bestFor: [
      "EU-headquartered or EU-heavy teams that need GDPR-native HRIS",
      "Companies comparing Personio as the European BambooHR analogue",
      "Orgs that can commit to annual Core and add Recruiting/Payroll apps later",
    ],
    notIdealFor: [
      "US-only payroll-first buyers (Gusto) or HR+IT unification (Rippling)",
      "Frontline WFM or dedicated ATS as the primary purchase",
      "Buyers who need a published USD PEPM like BambooHR Core $10",
    ],
    pros: [
      "Published Core floor (€7.60 PEPM)",
      "GDPR-native EU HRIS default shortlist",
      "Clear Core / CorePro / Apps packaging",
      "Time tracking and preliminary payroll on Core",
      "Annual discount for upfront payment",
    ],
    cons: [
      "No USD list",
      "Recruiting/payroll Apps extra",
      "12-month minimum + setup fee",
      "All active employees licensed",
      "Not a US payroll leader",
    ],
    keyFeatures: [
      "Employee file, absences, and workflows",
      "Core time tracking and preliminary payroll",
      "CorePro API and multi-entity (quote)",
      "Recruiting and performance Apps (quote)",
      "GDPR-native EU compliance posture",
      "In-product AI agents (marketed)",
    ],
    whoShouldChoose:
      "Choose Personio when EU GDPR-native core HRIS with a published euro PEPM floor is the job — not when you need US payroll, published USD PEPM, or frontline WFM.",
    whoShouldConsiderAlternatives:
      "Compare HiBob for culture-forward mid-market UX, BambooHR for US published PEPM, Rippling for HR+IT, and Workday for enterprise HCM.",
    alternativeSlugs: ["hibob", "bamboohr", "rippling"],
    competitorSlugs: ["hibob", "bamboohr", "rippling", "factorial"],
    comparableSlugs: ["hibob", "bamboohr"],
    useCaseSlugs: ["core-hris"],
    businessSizeSlugs: ["small-business", "mid-market", "enterprise"],
    teamTypeSlugs: ["operations"],
  },
];

export const PRODUCTS = COMPACT.map(expandHrProduct);

export const COMPARISON_PAIRS = [
  ["connecteam", "homebase"],
  ["homebase", "when-i-work"],
  ["connecteam", "deputy"],
  ["homebase", "7shifts"],
  ["greenhouse", "ashby"],
  ["greenhouse", "lever"],
  ["ashby", "lever"],
  ["bamboohr", "hibob"],
  ["hibob", "personio"],
];
