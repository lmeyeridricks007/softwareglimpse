/**
 * HR Priority-1 credibility products (compact).
 * BambooHR, Rippling, Gusto, Greenhouse, Workable.
 *
 * Freshteam skipped: Freshworks sunset (renewals stopped ~Mar 2026).
 * Workable substitutes as the fifth ATS peer.
 *
 * Pricing grounded 2026-08-18 from first-party pages.
 * Affiliate economics never enter scores. handsOnTesting=false.
 */
import { expandHrProduct } from "./hr-compact-expand.mjs";

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
    slug: "bamboohr",
    name: "BambooHR",
    company: "Bamboo HR LLC",
    website: "https://www.bamboohr.com",
    domain: "bamboohr.com",
    pricingUrl: "https://www.bamboohr.com/pricing/",
    aliases: ["Bamboo HR"],
    membershipRole: "primary",
    jobCluster: "hris-core",
    softShortDescription:
      "SMB/mid-market core HRIS with Core/Pro/Elite PEPM tiers — Core from $10/employee/mo above 25 employees, or $250/mo flat floor for smaller teams.",
    shortDescription:
      "BambooHR is a core HRIS for employee records, hiring/onboarding, PTO, performance, and employee experience. Published Core/Pro/Elite PEPM is $10 / $17 / $25 per employee/month above 25 employees; teams of 25 or fewer start from a $250/mo flat floor. US payroll, benefits admin, time & attendance, and global employment are add-ons. ATS job-opening caps scale by plan (5 / 25 / 50).",
    vendorPositioning:
      "The complete HR platform — from HR platform to HR partner with Bamboo AI.",
    pricingModel: "hybrid",
    hasFreePlan: false,
    hasFreeTrial: false,
    startingPriceMonthly: 10,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from bamboohr.com/pricing (high confidence). Core $10, Pro $17, Elite $25 PEPM for >25 employees. ≤25 employees: flat from $250/mo. Payroll, Benefits, Time & Attendance, and Global Employment are add-ons. No published free plan or N-day trial on the pricing page (demo/quote). Affiliate economics excluded.",
    pricingSummary:
      "Core $10 / Pro $17 / Elite $25 PEPM above 25 employees; ≤25 employees from $250/mo flat. Payroll, benefits, time, and global employment are add-ons. Confirm live on bamboohr.com/pricing.",
    plans: [
      {
        kind: "per-seat-annual",
        slug: "core",
        name: "Core",
        amount: 10,
        highlighted: true,
        description:
          "$10 per employee/mo (published PEPM) for teams above 25 employees. ATS openings capped (5). Payroll/benefits/time are add-ons.",
      },
      {
        kind: "per-seat-annual",
        slug: "pro",
        name: "Pro",
        amount: 17,
        description:
          "$17 PEPM. Higher hiring caps and HR depth. Add-ons still apply for payroll/benefits/time.",
      },
      {
        kind: "per-seat-annual",
        slug: "elite",
        name: "Elite",
        amount: 25,
        description:
          "$25 PEPM. Highest published people-experience / AI packaging. Confirm quote for volume discounts.",
      },
      {
        kind: "flat-annual",
        slug: "core-small-team",
        name: "Core (≤25 employees)",
        amount: 250,
        description:
          "Published flat floor from $250/mo for teams of 25 or fewer — effective PEPM is much higher than $10.",
      },
    ],
    featureOverrides: {
      "applicant-tracking": "limited",
      "career-site-job-boards": "limited",
      "interview-scheduling": "limited",
      "core-hris": "supported",
      "payroll-processing": "add-on",
      "benefits-admin": "add-on",
      "workforce-scheduling": "not-supported",
      "frontline-comms": "not-supported",
      "time-attendance": "add-on",
      "gps-geofence-clockin": "not-supported",
      "sop-knowledge-base": "limited",
      "employee-training-paths": "limited",
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
      "Payroll, benefits, time & attendance, and global employment are add-ons — Core PEPM is not full HCM TCO",
      "Teams of 25 or fewer pay a $250/mo floor, so effective PEPM is far above $10",
      "ATS job-opening caps (5 / 25 / 50) make it a light hiring module, not a Greenhouse-class ATS",
      "US-centric payroll/benefits bundle; not an enterprise HCM (Workday/UKG) replacement",
      "No published free plan; packaging is quote-assisted even with list PEPM",
    ],
    limitationKinds: [
      "requires-add-on",
      "plan-restriction",
      "plan-restriction",
      "feature-unavailable",
      "plan-restriction",
    ],
    scores: {
      "ease-of-use": 9,
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
        "BambooHR is the default SMB/mid HRIS shortlist name for a clean people admin UI. Score reflects first-party positioning, not hands-on lab testing.",
      "hiring-workforce-fit":
        "Primary job is core HRIS (employee system of record). Scored inside hris-core, not against ATS, WFM, or payroll-only peers. Built-in hiring is a module with opening caps.",
      "workflow-depth":
        "Employee records, PTO, onboarding, and performance workflows are the HRIS core. Payroll/time depth lives on add-ons — held at 8 vs full people platforms.",
      integrations:
        "150+ marketplace connectors including Slack and payroll/benefits carriers; native depth is stronger as an HRIS hub than as a payroll engine.",
      "mobile-frontline":
        "Employee self-service mobile exists; this is not a deskless WFM/comms product. Scored for HRIS mobility, not shift ops.",
      analytics:
        "HR reporting and AI insights are marketed on paid tiers; adequate for SMB/mid people analytics, not enterprise HCM BI.",
      scalability:
        "Clear Core → Pro → Elite PEPM plus small-team floor supports growth into mid-market; not an enterprise HCM path.",
      "value-for-money":
        "Transparent PEPM floors are a strength; add-ons and the $250 small-team floor raise real TCO. Affiliate economics excluded.",
      "ai-capabilities":
        "Bamboo AI / Ask BambooHR is a published assistant with tiered packaging — useful, not unlimited included AI.",
    },
    bestFor: [
      "Small and mid-size teams that need a clean core HRIS as the employee system of record",
      "US companies that may add payroll/benefits later rather than buying a payroll-first suite",
      "Buyers who want published PEPM instead of fully opaque HCM quotes",
    ],
    notIdealFor: [
      "High-volume recruiting teams whose primary job is a dedicated ATS",
      "Frontline ops teams whose primary job is shift scheduling or GPS clock-in",
      "Enterprises that need Workday/UKG-class HCM + financials",
    ],
    pros: [
      "Default SMB/mid core HRIS shortlist name with published PEPM",
      "Clear Core / Pro / Elite packaging",
      "Marketplace integrations and Bamboo AI assistant",
      "Optional US payroll and benefits add-ons on the same record",
      "Small-team flat floor is published (even if expensive per head)",
    ],
    cons: [
      "Payroll/benefits/time are add-ons, not included in Core PEPM",
      "$250/mo floor for ≤25 employees",
      "Light ATS with job-opening caps",
      "Not a frontline WFM or enterprise HCM",
      "Demo/quote motion rather than a published free trial",
    ],
    keyFeatures: [
      "Employee system of record, org chart, and PTO",
      "Onboarding and people admin workflows",
      "Optional US payroll, benefits, and time add-ons",
      "Light ATS with plan-capped job openings",
      "Bamboo AI assistant",
      "Marketplace integrations (Slack, payroll/benefits carriers)",
    ],
    whoShouldChoose:
      "Choose BambooHR when you need a clean SMB/mid-market core HRIS with published PEPM — not when the primary job is high-volume ATS, frontline scheduling, or enterprise HCM.",
    whoShouldConsiderAlternatives:
      "Compare Rippling for HR+IT+payroll on one platform, Gusto for US SMB payroll-first buying, Greenhouse or Breezy HR for dedicated ATS, and Workday for enterprise HCM.",
    alternativeSlugs: ["rippling", "gusto", "greenhouse"],
    competitorSlugs: ["rippling", "gusto", "hibob", "personio", "namely"],
    comparableSlugs: ["rippling", "gusto"],
    useCaseSlugs: ["core-hris", "payroll-benefits"],
    businessSizeSlugs: ["small-business", "mid-market"],
    teamTypeSlugs: ["operations", "recruiting"],
  },

  {
    slug: "rippling",
    name: "Rippling",
    company: "People Center, Inc.",
    website: "https://www.rippling.com",
    domain: "rippling.com",
    pricingUrl: "https://www.rippling.com/pricing",
    aliases: ["Rippling HR"],
    membershipRole: "primary",
    jobCluster: "people-platform",
    softShortDescription:
      "Unified people platform (HR + payroll + IT/spend) — published SMB floor $8/user/mo plus $40/mo platform fee; modules are quote-stacked.",
    shortDescription:
      "Rippling is a unified workforce platform spanning HRIS, payroll, benefits, time, recruiting, plus native IT (devices/SSO) and spend on one employee system of record. The published SMB floor is $8/user/mo plus a $40/mo base fee for core platform access; payroll, benefits, IT, spend, and EOR modules stack PEPM and are largely quote-led. No free plan or self-serve trial — demo / free quote.",
    vendorPositioning:
      "The platform for companies that want to grow faster — unify HR, Finance, and IT on one employee system of record.",
    pricingModel: "hybrid",
    hasFreePlan: false,
    hasFreeTrial: false,
    startingPriceMonthly: 8,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from rippling.com/small-business and rippling.com/pricing (high confidence on the $8 PEPM + $40/mo base floor only). Main pricing page is quote-led. Modules billed PEPM alongside required platform. All-in TCO is custom. Affiliate economics excluded.",
    pricingSummary:
      "Published SMB floor $8/user/mo + $40/mo platform fee. Payroll, benefits, IT, spend, and EOR stack as quote-based PEPM modules. Confirm live quote on rippling.com/pricing.",
    plans: [
      {
        kind: "per-seat-annual",
        slug: "platform",
        name: "Rippling Platform",
        amount: 8,
        highlighted: true,
        description:
          "Published SMB floor ~$8 PEPM plus ~$40/mo base for Unity/core platform. Not all-in HCM.",
      },
      {
        kind: "contact-sales",
        slug: "modules",
        name: "Payroll / IT / Spend modules",
        description:
          "Payroll, benefits, IT, spend, recruiting, and EOR are sold as PEPM modules on a quote. Confirm current packaging.",
      },
    ],
    featureOverrides: {
      "applicant-tracking": "add-on",
      "career-site-job-boards": "add-on",
      "interview-scheduling": "add-on",
      "core-hris": "supported",
      "payroll-processing": "supported",
      "benefits-admin": "supported",
      "workforce-scheduling": "limited",
      "frontline-comms": "limited",
      "time-attendance": "supported",
      "gps-geofence-clockin": "limited",
      "sop-knowledge-base": "limited",
      "employee-training-paths": "limited",
      "lms-course-commerce": "not-supported",
      "hris-integrations": "supported",
      "analytics-reporting": "supported",
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
      { integrationSlug: "google-workspace", kind: "native" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    limitations: [
      "The $8 floor is platform/core only — payroll, IT, spend, and EOR stack PEPM and dominate TCO",
      "No published free plan or self-serve trial; sales-led packaging",
      "Easy to overbuy modules that the team will not adopt",
      "Implementation is non-trivial versus a simple Gusto payroll start",
      "Not a hospitality/frontline WFM specialist (Connecteam/Deputy class)",
    ],
    limitationKinds: [
      "requires-add-on",
      "plan-restriction",
      "requires-add-on",
      "other",
      "feature-unavailable",
    ],
    scores: {
      "ease-of-use": 7,
      "hiring-workforce-fit": 9,
      "workflow-depth": 9,
      integrations: 9,
      "mobile-frontline": 7,
      analytics: 8,
      scalability: 9,
      "value-for-money": 6,
      "ai-capabilities": 8,
    },
    scoreRationales: {
      "ease-of-use":
        "Powerful modular platform with more setup than BambooHR or Gusto. Score reflects breadth versus a simple payroll-first UI — not hands-on lab testing.",
      "hiring-workforce-fit":
        "Primary job is people-platform: HR + payroll + IT on one employee record. Scored inside that cluster, not as a dedicated ATS or frontline WFM.",
      "workflow-depth":
        "Hire-to-device-to-pay workflows are the product thesis. Recruiting and time exist as modules; depth is strongest as a unified employee graph.",
      integrations:
        "650+ apps plus native device/app provisioning is category-leading ecosystem depth for a people platform.",
      "mobile-frontline":
        "Employee/manager mobile and time exist; not a deskless scheduling specialist. Scored for people-platform mobility.",
      analytics:
        "Workforce reporting across HR/IT/spend is a published strength versus single-module HRIS tools.",
      scalability:
        "Modular PEPM and global/EOR paths support growth from SMB into mid-market; enterprise HCM is still a different shortlist.",
      "value-for-money":
        "Published $8 floor is misleading versus stacked TCO. Held at 6 for packaging opacity. Affiliate economics excluded.",
      "ai-capabilities":
        "Ask Rippling AI is marketed across workforce data — useful assistant story with quote-gated packaging.",
    },
    bestFor: [
      "Companies that want HR, payroll, and IT provisioning on one employee record",
      "Fast-growing teams willing to model modular PEPM TCO",
      "Orgs that currently stitch HRIS + Okta/MDM + payroll and want one hire event",
    ],
    notIdealFor: [
      "Teams that only need simple US payroll (Gusto is the lighter start)",
      "Buyers who want a dedicated ATS as the primary purchase (Greenhouse)",
      "Frontline-only operators shopping for shift scheduling apps",
    ],
    pros: [
      "Unifies HR, payroll, and IT on one employee system of record",
      "Deep native + marketplace integrations",
      "Published SMB PEPM floor (with clear module-stacking caveat)",
      "Time, recruiting, spend, and EOR available as modules",
      "Ask Rippling AI across workforce data",
    ],
    cons: [
      "All-in TCO is quote-stacked far above $8 PEPM",
      "No free plan / self-serve trial",
      "Implementation heavier than payroll-first SMB tools",
      "Easy to overbuy unused modules",
      "Not a specialist ATS or hospitality WFM",
    ],
    keyFeatures: [
      "Unified employee system of record (Unity)",
      "Payroll, benefits, and time modules",
      "Native IT: devices, SSO, app provisioning",
      "Optional recruiting / spend / EOR modules",
      "Ask Rippling AI",
      "650+ app integrations",
    ],
    whoShouldChoose:
      "Choose Rippling when you want HR, payroll, and IT on one employee record and will model stacked PEPM — not when you only need simple US payroll or a dedicated ATS.",
    whoShouldConsiderAlternatives:
      "Compare BambooHR for a simpler core HRIS, Gusto for payroll-first SMB buying, Greenhouse for structured hiring, and Workday for enterprise HCM.",
    alternativeSlugs: ["bamboohr", "gusto", "greenhouse"],
    competitorSlugs: ["bamboohr", "gusto", "deel", "workday", "hibob"],
    comparableSlugs: ["bamboohr", "gusto"],
    useCaseSlugs: ["people-platform", "core-hris", "payroll-benefits"],
    businessSizeSlugs: ["small-business", "mid-market", "enterprise"],
    teamTypeSlugs: ["operations", "recruiting"],
    sourcesExtra: [
      {
        id: "rippling-smb-pricing",
        url: "https://www.rippling.com/small-business",
        title: "Rippling for small business",
        domains: ["pricing", "plans", "limits"],
      },
    ],
  },

  {
    slug: "gusto",
    name: "Gusto",
    company: "Gusto, Inc.",
    website: "https://gusto.com",
    domain: "gusto.com",
    pricingUrl: "https://gusto.com/product/pricing",
    aliases: ["Gusto payroll"],
    membershipRole: "primary",
    jobCluster: "payroll-benefits",
    softShortDescription:
      "US SMB payroll + benefits + light HR — Simple from $49/mo + $6/person; Plus $80 + $12; Premium $180 + $22.",
    shortDescription:
      "Gusto is transparent US payroll with benefits and light HR for small businesses. Published 2026 plans: Contractor Only $35/mo + $6/person (promo $0 base for first six months); Simple $49 + $6; Plus $80 + $12; Premium $180 + $22. Month-to-month. Account setup is free until you run payroll. Simple is single-state; multi-state needs Plus. Time, performance, and many benefits tools are add-ons.",
    vendorPositioning:
      "Simple, transparent pricing. Payroll, benefits, and HR all in one place. No hidden fees. Cancel any time.",
    pricingModel: "hybrid",
    hasFreePlan: false,
    hasFreeTrial: true,
    startingPriceMonthly: 49,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from gusto.com/product/pricing (high confidence). Simple $49/mo + $6/person; Plus $80 + $12; Premium $180 + $22. Contractor Only $35 + $6 (promo $0 base 6 months). Setup free until first payroll (not a fixed N-day trial). Simple = single-state. Affiliate economics excluded.",
    pricingSummary:
      "Simple $49/mo + $6/person; Plus $80 + $12; Premium $180 + $22. Contractor Only $35 + $6. Setup free until first payroll. Simple is single-state. Confirm on gusto.com/product/pricing.",
    plans: [
      {
        kind: "flat-annual",
        slug: "simple",
        name: "Simple",
        amount: 49,
        highlighted: true,
        description:
          "$49/mo platform + $6/person. Single-state US payroll. Time/performance/many benefits features are add-ons.",
      },
      {
        kind: "flat-annual",
        slug: "plus",
        name: "Plus",
        amount: 80,
        description:
          "$80/mo + $12/person. Multi-state payroll path versus Simple.",
      },
      {
        kind: "flat-annual",
        slug: "premium",
        name: "Premium",
        amount: 180,
        description:
          "$180/mo + $22/person. Highest published SMB payroll+HR bundle.",
      },
      {
        kind: "flat-annual",
        slug: "contractor-only",
        name: "Contractor Only",
        amount: 35,
        description:
          "$35/mo + $6/contractor after promo; first 6 months $0 base advertised. Not employee payroll.",
      },
    ],
    featureOverrides: {
      "applicant-tracking": "limited",
      "career-site-job-boards": "not-supported",
      "interview-scheduling": "not-supported",
      "core-hris": "limited",
      "payroll-processing": "supported",
      "benefits-admin": "supported",
      "workforce-scheduling": "not-supported",
      "frontline-comms": "not-supported",
      "time-attendance": "add-on",
      "gps-geofence-clockin": "not-supported",
      "sop-knowledge-base": "not-supported",
      "employee-training-paths": "not-supported",
      "lms-course-commerce": "not-supported",
      "hris-integrations": "supported",
      "analytics-reporting": "limited",
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
      "Simple plan is single-state payroll — multi-state needs Plus",
      "People/HRIS depth is light versus BambooHR; Gusto is payroll-first",
      "Time, performance, next-day pay, and many benefits tools are add-ons",
      "US-centric; not a global EOR (Deel) or enterprise HCM",
      "No dedicated ATS/WFM core",
    ],
    limitationKinds: [
      "plan-restriction",
      "feature-unavailable",
      "requires-add-on",
      "feature-unavailable",
      "feature-unavailable",
    ],
    scores: {
      "ease-of-use": 9,
      "hiring-workforce-fit": 9,
      "workflow-depth": 7,
      integrations: 7,
      "mobile-frontline": 6,
      analytics: 5,
      scalability: 6,
      "value-for-money": 8,
      "ai-capabilities": 4,
    },
    scoreRationales: {
      "ease-of-use":
        "Gusto’s payroll UX is the SMB default for non-experts with transparent published prices. Score is research-grounded, not lab-tested.",
      "hiring-workforce-fit":
        "Primary job is payroll-benefits. Scored inside that cluster — strong payroll/benefits fit, not an ATS or WFM.",
      "workflow-depth":
        "Pay runs, tax filings, and benefits admin are solid for SMB. HRIS/performance/time are thinner or add-on — held at 7.",
      integrations:
        "Accounting and time-clock connectors (QuickBooks, Xero, Homebase-class) are adequate; not a 600-app people platform.",
      "mobile-frontline":
        "Employee pay stubs and time add-ons exist; not a deskless WFM app.",
      analytics:
        "Payroll reports are table-stakes; people analytics are not the product thesis.",
      scalability:
        "Clear Simple → Plus → Premium path for SMB; mid-market/enterprise payroll (ADP/Paylocity) is a different shortlist.",
      "value-for-money":
        "Transparent $49+$6 floor and month-to-month cancel story are strong; add-ons and multi-state upgrades raise TCO. Affiliate economics excluded.",
      "ai-capabilities":
        "AI is not a primary marketed payroll pillar on the pricing page — scored low versus Bamboo/Rippling/Greenhouse AI stories.",
    },
    bestFor: [
      "US small businesses running payroll (and benefits) for the first time",
      "Teams that want published month-to-month pricing instead of HCM quotes",
      "Single-state companies that can start on Simple and upgrade for multi-state",
    ],
    notIdealFor: [
      "Companies whose primary job is a full HRIS or people platform",
      "High-volume recruiting / structured hiring ATS buyers",
      "Global EOR or 1,000+ employee HCM buyers",
    ],
    pros: [
      "Transparent published payroll pricing",
      "Setup free until first payroll",
      "Month-to-month; cancel any time (vendor claim)",
      "Benefits admin on paid tiers",
      "Clear Simple / Plus / Premium ladder",
    ],
    cons: [
      "Simple is single-state only",
      "Light HRIS versus BambooHR/Rippling",
      "Many expected HR features are add-ons",
      "US-centric; not global EOR",
      "AI is not a product pillar",
    ],
    keyFeatures: [
      "US payroll, tax filings, and pay stubs",
      "Benefits administration",
      "Light people/HR tools",
      "Contractor-only plan",
      "Optional time & performance add-ons",
      "Accounting integrations",
    ],
    whoShouldChoose:
      "Choose Gusto when US SMB payroll and benefits with transparent published pricing is the job — not when you need a full HRIS, people platform, or dedicated ATS.",
    whoShouldConsiderAlternatives:
      "Compare Rippling for HR+IT+payroll unification, BambooHR for a stronger core HRIS, Justworks for PEO, and Deel for global hiring.",
    alternativeSlugs: ["rippling", "bamboohr", "greenhouse"],
    competitorSlugs: ["rippling", "adp", "paychex", "justworks", "bamboohr"],
    comparableSlugs: ["rippling", "bamboohr"],
    useCaseSlugs: ["payroll-benefits", "core-hris"],
    businessSizeSlugs: ["micro", "small-business"],
    teamTypeSlugs: ["operations"],
  },

  {
    slug: "greenhouse",
    name: "Greenhouse",
    company: "Greenhouse Software, Inc.",
    website: "https://www.greenhouse.com",
    domain: "greenhouse.com",
    pricingUrl: "https://www.greenhouse.com/pricing",
    aliases: ["Greenhouse ATS", "greenhouse.io"],
    membershipRole: "primary",
    jobCluster: "ats-recruiting",
    softShortDescription:
      "Structured-hiring ATS (Core / Plus / Pro) — custom quote by plan, hiring volume, and org complexity; no published seat dollars.",
    shortDescription:
      "Greenhouse is a structured-hiring ATS/CRM from sourcing through offer and onboarding, with interview kits, scorecards, scheduling, and recruiting analytics. Named plans are Core, Plus, and Pro. Cost is custom-quote — influenced by plan, hiring volume, organizational complexity, and features. No free plan or self-serve trial (demo). AI features (notetaker, suggestions, Voice AI, Real Talent) are marketed and often tier-gated.",
    vendorPositioning:
      "The hiring platform that helps teams hire better, faster — structured hiring with governance, not AI noise.",
    pricingModel: "custom-quote",
    hasFreePlan: false,
    hasFreeTrial: false,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from greenhouse.com/pricing (high confidence). Core / Plus / Pro with no published USD seat prices. Quote depends on plan, hiring volume, and complexity. Do not invent third-party dollar ranges as official floors. Affiliate economics excluded.",
    pricingSummary:
      "Custom quote. Named plans Core, Plus, and Pro. Price depends on plan, hiring volume, and org complexity. No free plan. Confirm on greenhouse.com/pricing.",
    plans: [
      {
        kind: "contact-sales",
        slug: "core",
        name: "Core",
        description: "Entry structured-hiring ATS package — contact sales.",
      },
      {
        kind: "contact-sales",
        slug: "plus",
        name: "Plus",
        highlighted: true,
        description:
          "Mid package with additional AI/analytics packaging — contact sales.",
      },
      {
        kind: "contact-sales",
        slug: "pro",
        name: "Pro",
        description: "Highest published named plan — contact sales.",
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
      { integrationSlug: "linkedin", kind: "native" },
      { integrationSlug: "google-workspace", kind: "native" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    limitations: [
      "No published list price — quotes scale with hiring volume and complexity, not recruiter seats alone",
      "Implementation and onboarding modules are often separate commercially",
      "AI/enterprise features are gated by tier",
      "Not a core HRIS, payroll, or frontline WFM product",
      "No free plan or self-serve trial",
    ],
    limitationKinds: [
      "plan-restriction",
      "requires-add-on",
      "plan-restriction",
      "feature-unavailable",
      "plan-restriction",
    ],
    scores: {
      "ease-of-use": 7,
      "hiring-workforce-fit": 10,
      "workflow-depth": 9,
      integrations: 9,
      "mobile-frontline": 5,
      analytics: 8,
      scalability: 9,
      "value-for-money": 6,
      "ai-capabilities": 8,
    },
    scoreRationales: {
      "ease-of-use":
        "Structured hiring is powerful and process-heavy versus SMB ATS tools. Score reflects mid-market/enterprise ATS admin overhead, not lab testing.",
      "hiring-workforce-fit":
        "Primary job is ATS/recruiting — Greenhouse is the category-standard structured-hiring shortlist name. Scored inside ATS peers only.",
      "workflow-depth":
        "Interview kits, scorecards, scheduling, CRM, and offer/onboarding workflows are deep. Held at 9 vs the most customized enterprise TA suites.",
      integrations:
        "Hundreds of pre-built HRIS, LinkedIn, scheduling, background-check, and Slack connectors plus BI/API on higher tiers.",
      "mobile-frontline":
        "Recruiter/hiring-manager mobility exists; this is not deskless WFM. Scored for recruiting mobility only.",
      analytics:
        "Recruiting analytics and AI report filters are a published strength on Plus+ packaging.",
      scalability:
        "Core → Plus → Pro plus volume-based quotes support mid-market through enterprise hiring orgs.",
      "value-for-money":
        "Opaque custom quotes and implementation extras depress value versus transparent ATS floors (Breezy/Workable). Affiliate economics excluded.",
      "ai-capabilities":
        "AI Notetaker, suggestions, Voice AI, and governed MCP are marketed with tier gates — strong ATS AI story, not unlimited included AI.",
    },
    bestFor: [
      "Mid-market and enterprise teams that want structured hiring (kits, scorecards, governance)",
      "Talent orgs comparing Greenhouse as the default dedicated ATS",
      "Companies that will integrate ATS to an existing HRIS/payroll rather than buying all-in-one HR",
    ],
    notIdealFor: [
      "SMB teams that need a free ATS tier (Breezy Bootstrap)",
      "Buyers whose primary job is core HRIS or payroll",
      "Frontline scheduling / time-clock operators",
    ],
    pros: [
      "Category-standard structured-hiring ATS",
      "Deep interview kits, scorecards, and scheduling",
      "Broad HRIS and job-board integrations",
      "Named Core / Plus / Pro packaging",
      "Published AI (notetaker, Voice AI, Real Talent) with governance story",
    ],
    cons: [
      "Custom quote only — no published seat dollars",
      "Implementation cost commonly extra",
      "No free plan",
      "Not an HRIS or payroll system",
      "Heavier process than SMB ATS tools",
    ],
    keyFeatures: [
      "Structured hiring: kits, scorecards, stages",
      "Interview scheduling and recruiting CRM",
      "Career site / job distribution",
      "Recruiting analytics",
      "AI notetaker and hiring assistants (tier-gated)",
      "HRIS and LinkedIn integrations",
    ],
    whoShouldChoose:
      "Choose Greenhouse when structured hiring is the job and you will take a custom ATS quote — not when you need a free SMB ATS, a core HRIS, or payroll.",
    whoShouldConsiderAlternatives:
      "Compare Breezy HR for transparent SMB ATS pricing, Workable for published ATS floors with light HR, Ashby/Lever as ATS peers, and BambooHR if the real job is core HRIS.",
    alternativeSlugs: ["breezy-hr", "workable", "bamboohr"],
    competitorSlugs: ["lever", "ashby", "workable", "breezy-hr", "smartrecruiters"],
    comparableSlugs: ["breezy-hr", "workable"],
    useCaseSlugs: ["recruiting-ats"],
    businessSizeSlugs: ["mid-market", "enterprise"],
    teamTypeSlugs: ["recruiting"],
  },

  {
    slug: "workable",
    name: "Workable",
    company: "Workable Software Ltd",
    website: "https://www.workable.com",
    domain: "workable.com",
    pricingUrl: "https://www.workable.com/pricing",
    aliases: ["Workable ATS"],
    membershipRole: "primary",
    jobCluster: "ats-recruiting",
    softShortDescription:
      "Recruiting + light HR ATS with published floors — Standard $299/mo (1–20 employees, annual); Premier $599; Enterprise $719.",
    shortDescription:
      "Workable is a recruiting platform with optional HRIS-lite (onboarding, time off, employee directory) sold on headcount bands. Published 1–20 employee annual floors: Standard $299/mo ($3,588/yr), Premier $599, Enterprise $719. 15-day Standard trial, no credit card. Standard add-ons include texting, video interviews, and assessments; Premier/Enterprise bundle many of those. Workable Agent AI uses credits (3,000 included on paid accounts; not in the trial). Prices rise for bands above 20 employees (not all published).",
    vendorPositioning:
      "Fair, transparent pricing for your complete recruiting and HR solution.",
    pricingModel: "flat",
    hasFreePlan: false,
    hasFreeTrial: true,
    trialDays: 15,
    startingPriceMonthly: 299,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from workable.com/pricing (high confidence for 1–20 employee annual band). Standard $299/mo ($3,588/yr); Premier $599; Enterprise $719. Monthly billing advertised ~20% higher. 15-day Standard trial. Add-ons on Standard: texting ~$89, video ~$109, assessments ~$59. Agent AI credits extra after 3,000 included. Higher headcount bands require quote. Affiliate economics excluded.",
    pricingSummary:
      "1–20 employees annual: Standard $299 / Premier $599 / Enterprise $719 per month. 15-day trial. Add-ons on Standard. Headcount bands above 20 are higher / quote. Confirm on workable.com/pricing.",
    plans: [
      {
        kind: "flat-annual",
        slug: "standard",
        name: "Standard",
        amount: 299,
        highlighted: true,
        hasFreeTrial: true,
        trialDays: 15,
        description:
          "$299/mo billed annually for 1–20 employees. ATS + sourcing. Texting/video/assessments are add-ons. 15-day trial.",
      },
      {
        kind: "flat-annual",
        slug: "premier",
        name: "Premier",
        amount: 599,
        hasFreeTrial: true,
        trialDays: 15,
        description:
          "$599/mo annual (1–20 employees). Bundles many recruiting add-ons versus Standard.",
      },
      {
        kind: "flat-annual",
        slug: "enterprise",
        name: "Enterprise",
        amount: 719,
        description:
          "$719/mo annual (1–20 employees). Custom reporting and extra permission sets advertised.",
      },
    ],
    featureOverrides: {
      ...ATS_FEATURES,
      "core-hris": "limited",
      "payroll-processing": "limited",
      "time-attendance": "limited",
      "employee-training-paths": "limited",
      "ai-assistance": "add-on",
    },
    aiLines: [
      "AI assistant: add-on",
      "AI summaries: add-on",
      "AI automation: add-on",
      "AI recommendations: add-on",
    ],
    integrations: [
      { integrationSlug: "slack", kind: "native" },
      { integrationSlug: "linkedin", kind: "native" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    limitations: [
      "Published $299 floor is the 1–20 employee band — larger companies pay more (often quote)",
      "Standard add-ons (texting, video, assessments) can nearly double TCO",
      "Workable Agent AI is credit-based and excluded from the free trial",
      "HRIS/payroll-prep features are light versus BambooHR/Rippling — still an ATS-first product",
      "No free plan",
    ],
    limitationKinds: [
      "plan-restriction",
      "requires-add-on",
      "requires-add-on",
      "feature-unavailable",
      "plan-restriction",
    ],
    scores: {
      "ease-of-use": 8,
      "hiring-workforce-fit": 8,
      "workflow-depth": 8,
      integrations: 7,
      "mobile-frontline": 6,
      analytics: 6,
      scalability: 7,
      "value-for-money": 7,
      "ai-capabilities": 7,
    },
    scoreRationales: {
      "ease-of-use":
        "SMB-friendly ATS with a 15-day trial and published floors is easier to start than Greenhouse quotes. Not hands-on lab tested.",
      "hiring-workforce-fit":
        "Primary job is ATS/recruiting with optional HRIS-lite. Scored as an ATS peer — not a core HRIS or payroll platform.",
      "workflow-depth":
        "Sourcing + ATS + optional onboarding/time-off is solid mid-market depth; structured-hiring kits are not Greenhouse-class.",
      integrations:
        "LinkedIn/Slack/Zapier-style connectors are adequate; ecosystem is thinner than Greenhouse’s marketplace.",
      "mobile-frontline":
        "Recruiting mobile plus light employee HR features; not frontline WFM.",
      analytics:
        "Hiring reports on paid tiers; custom report builder is Enterprise-gated.",
      scalability:
        "Headcount-band pricing scales, but unpublished higher bands and ATS-first design cap it versus enterprise TA suites.",
      "value-for-money":
        "Published $299 floor and trial are clearer than Greenhouse quotes; add-ons and headcount bands raise TCO. Affiliate economics excluded.",
      "ai-capabilities":
        "Workable Agent with 3,000 included credits is a real AI path with usage packaging — not unlimited included AI.",
    },
    bestFor: [
      "SMB and lower mid-market teams that want a dedicated ATS with published prices",
      "Hiring teams that want a 15-day trial before a custom enterprise ATS quote",
      "Companies that may use Workable’s light HR features without buying a full HRIS",
    ],
    notIdealFor: [
      "Structured-hiring enterprises standardised on Greenhouse kits/scorecards",
      "Teams that need a free ATS tier (Breezy Bootstrap)",
      "Buyers whose primary job is payroll or core HRIS",
    ],
    pros: [
      "Published Standard/Premier/Enterprise floors for the 1–20 band",
      "15-day Standard trial, no credit card",
      "ATS plus optional HRIS-lite in one product",
      "Workable Agent AI with included credits on paid plans",
      "Unlimited active jobs advertised (fair-use)",
    ],
    cons: [
      "Higher headcount bands are not fully published",
      "Standard add-ons raise TCO quickly",
      "Agent AI excluded from the trial",
      "Not Greenhouse-depth structured hiring",
      "Not a payroll-first or core HRIS product",
    ],
    keyFeatures: [
      "Applicant tracking and candidate sourcing",
      "Career site / job posting",
      "Optional HRIS-lite (directory, time off, onboarding)",
      "Texting / video / assessments (add-on or bundled)",
      "Workable Agent AI credits",
      "15-day Standard trial",
    ],
    whoShouldChoose:
      "Choose Workable when you want a dedicated ATS with published SMB floors and a trial — not when you need Greenhouse-depth structured hiring, a free ATS, or payroll/HRIS as the primary job.",
    whoShouldConsiderAlternatives:
      "Compare Greenhouse for structured enterprise hiring, Breezy HR for a free Bootstrap ATS, and BambooHR if the real purchase is core HRIS.",
    alternativeSlugs: ["greenhouse", "breezy-hr", "bamboohr"],
    competitorSlugs: ["greenhouse", "breezy-hr", "lever", "ashby"],
    comparableSlugs: ["greenhouse", "breezy-hr"],
    useCaseSlugs: ["recruiting-ats"],
    businessSizeSlugs: ["small-business", "mid-market"],
    teamTypeSlugs: ["recruiting", "operations"],
  },
];

export const PRODUCTS = COMPACT.map(expandHrProduct);

/** Same-cluster or commonly shortlisted P1 pairs (plus Breezy via comparisons.ts). */
export const COMPARISON_PAIRS = [
  ["bamboohr", "rippling"],
  ["gusto", "rippling"],
  ["bamboohr", "gusto"],
  ["greenhouse", "workable"],
];
