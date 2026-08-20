/**
 * HR Priority-3 enterprise landscape (compact).
 * Workday, Oracle Cloud HCM, UKG Pro, Dayforce, ADP Workforce Now, Paylocity, Paycor.
 *
 * Pricing grounded 2026-08-18: first-party pages are quote-led. Do not invent PEPM.
 * Affiliate economics never enter scores. handsOnTesting=false.
 */
import { expandHrProduct } from "./hr-compact-expand.mjs";

const HCM_FEATURES = {
  "applicant-tracking": "supported",
  "career-site-job-boards": "supported",
  "interview-scheduling": "supported",
  "core-hris": "supported",
  "payroll-processing": "supported",
  "benefits-admin": "supported",
  "workforce-scheduling": "limited",
  "frontline-comms": "limited",
  "time-attendance": "supported",
  "gps-geofence-clockin": "limited",
  "sop-knowledge-base": "limited",
  "employee-training-paths": "supported",
  "lms-course-commerce": "not-supported",
  "hris-integrations": "supported",
  "analytics-reporting": "supported",
  "ai-assistance": "supported",
};

const PAYROLL_HCM_FEATURES = {
  ...HCM_FEATURES,
  "applicant-tracking": "limited",
  "career-site-job-boards": "limited",
  "interview-scheduling": "limited",
  "employee-training-paths": "limited",
};

const COMPACT = [
  {
    slug: "workday",
    name: "Workday",
    company: "Workday, Inc.",
    website: "https://www.workday.com",
    domain: "workday.com",
    pricingUrl: "https://www.workday.com/en-us/products/human-capital-management.html",
    aliases: ["Workday HCM", "Workday Human Capital Management"],
    membershipRole: "primary",
    jobCluster: "enterprise-hcm",
    softShortDescription:
      "Enterprise HCM default — custom PEPM quote (no published seat $); implementation-led. Landscape only vs SMB HRIS/payroll.",
    shortDescription:
      "Workday Human Capital Management is the enterprise shortlist default for global HR, payroll, talent, and analytics on one employee record. First-party pages are demo/quote-led: no published PEPM, free plan, or self-serve trial. Contracts are headcount- and module-stacked; implementation partners and multi-year terms dominate TCO. Score as enterprise-HCM landscape — not an SMB BambooHR or Gusto peer.",
    vendorPositioning:
      "The enterprise system of record that should run HR, finance, and planning on one cloud.",
    pricingModel: "custom-quote",
    hasFreePlan: false,
    hasFreeTrial: false,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from workday.com HCM product pages (high confidence that no USD list exists). Custom PEPM by worker count and modules. Do not invent third-party PEPM benchmarks as list prices. Affiliate economics excluded.",
    pricingSummary:
      "Custom quote. No published PEPM, free plan, or self-serve trial. Implementation and module stack dominate TCO. Confirm with Workday.",
    plans: [
      {
        kind: "contact-sales",
        slug: "hcm",
        name: "Workday HCM",
        highlighted: true,
        description: "Core HCM — employee records, org, compensation, absence. Quote-only.",
      },
      {
        kind: "contact-sales",
        slug: "modules",
        name: "Payroll / Talent / Learning / Planning",
        description: "Additional HCM and adjacent modules — quote-stacked PEPM.",
      },
    ],
    featureOverrides: HCM_FEATURES,
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
      "No published list price — PEPM and implementation are opaque",
      "Multi-month implementations and SI partners are typical",
      "Not an SMB HRIS or published-PEPM payroll product",
      "Native WFM depth is not UKG/Dayforce-class for complex hourly ops",
      "No free plan or self-serve trial",
    ],
    limitationKinds: [
      "plan-restriction",
      "other",
      "feature-unavailable",
      "feature-unavailable",
      "plan-restriction",
    ],
    scores: {
      "ease-of-use": 6,
      "hiring-workforce-fit": 10,
      "workflow-depth": 10,
      integrations: 9,
      "mobile-frontline": 6,
      analytics: 9,
      scalability: 10,
      "value-for-money": 5,
      "ai-capabilities": 8,
    },
    scoreRationales: {
      "ease-of-use":
        "Enterprise admin and implementation weight vs SMB HRIS. Score is research-grounded, not lab-tested.",
      "hiring-workforce-fit":
        "Primary job is enterprise HCM. Scored inside that cluster — not against BambooHR, Gusto, or Connecteam.",
      "workflow-depth":
        "Global HR, payroll, talent, and analytics on one record are the category-default depth.",
      integrations:
        "Enterprise identity, finance, and ISV graph is a published strength.",
      "mobile-frontline":
        "Employee/manager mobile exists; this is not deskless WFM.",
      analytics:
        "People analytics and planning adjacency are a Workday thesis.",
      scalability:
        "Designed for thousands to tens of thousands of workers.",
      "value-for-money":
        "Opaque PEPM plus implementation depress value vs published SMB floors. Affiliate economics excluded.",
      "ai-capabilities":
        "Named AI assistants and skills/talent recommendations are marketed with packaging gates.",
    },
    bestFor: [
      "Enterprises (typically 1,000+ employees) that want one HCM system of record",
      "Global HR + payroll programmes comparing Workday as the default shortlist",
      "Orgs that will fund a multi-month SI implementation",
    ],
    notIdealFor: [
      "SMB teams that need published PEPM (BambooHR) or payroll (Gusto)",
      "Hourly WFM-first buyers (UKG Pro / Dayforce / Connecteam)",
      "Buyers who will not take a custom enterprise quote",
    ],
    pros: [
      "Enterprise HCM category default",
      "Unified HR, payroll, talent, analytics",
      "Strong scalability story",
      "Broad integration and partner ecosystem",
      "Named AI in the HCM suite",
    ],
    cons: [
      "Custom quote only",
      "Heavy implementation",
      "Not an SMB product",
      "WFM not the UKG-class hourly thesis",
      "No free plan or trial",
    ],
    keyFeatures: [
      "Global core HR and org management",
      "Enterprise payroll",
      "Talent, recruiting, and learning modules",
      "People analytics",
      "Employee self-service",
      "AI assistants (packaging-gated)",
    ],
    whoShouldChoose:
      "Choose Workday when enterprise HCM on one employee record is the job and you will fund a custom quote plus implementation — not when you need published SMB PEPM, simple US payroll, or frontline WFM.",
    whoShouldConsiderAlternatives:
      "Compare Oracle Cloud HCM for Fusion-stack enterprises, UKG Pro or Dayforce for WFM-heavy HCM, Rippling for HR+IT unification at smaller scale, and BambooHR/Gusto if the real job is SMB HRIS or payroll.",
    alternativeSlugs: ["oracle-hcm", "ukg-pro", "dayforce"],
    competitorSlugs: ["oracle-hcm", "ukg-pro", "dayforce", "adp-workforce-now", "sap-successfactors"],
    comparableSlugs: ["oracle-hcm", "ukg-pro"],
    useCaseSlugs: ["enterprise-hcm"],
    businessSizeSlugs: ["mid-market", "enterprise"],
    teamTypeSlugs: ["operations", "recruiting"],
  },

  {
    slug: "oracle-hcm",
    name: "Oracle Cloud HCM",
    company: "Oracle Corporation",
    website: "https://www.oracle.com/human-capital-management/",
    domain: "oracle.com",
    pricingUrl: "https://www.oracle.com/human-capital-management/",
    aliases: ["Oracle Fusion Cloud HCM", "Oracle HCM Cloud", "Oracle Fusion HCM"],
    membershipRole: "primary",
    jobCluster: "enterprise-hcm",
    softShortDescription:
      "Oracle Fusion Cloud HCM — modular enterprise suite (Global HR, payroll, talent, WFM); custom quote, no published PEPM.",
    shortDescription:
      "Oracle Fusion Cloud HCM is a unified cloud suite connecting HR, payroll, talent, learning, recruiting, and workforce management on one data model with embedded AI. First-party pages are demo/contact-sales: no published PEPM or free plan. Modular SKUs (Human Resources Foundation, Talent, Workforce Management, Cloud Payroll) are quote-stacked. Landscape enterprise HCM — not an SMB HRIS peer.",
    vendorPositioning:
      "One HCM cloud, one data model, and AI throughout the employee journey.",
    pricingModel: "custom-quote",
    hasFreePlan: false,
    hasFreeTrial: false,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from oracle.com/human-capital-management (high confidence that no public rate card is listed). Modular PEPM quotes. Do not invent list PEPM. Affiliate economics excluded.",
    pricingSummary:
      "Custom quote by module and headcount. No published PEPM. Request a demo / contact sales on oracle.com.",
    plans: [
      {
        kind: "contact-sales",
        slug: "hcm-cloud",
        name: "Oracle Fusion Cloud HCM",
        highlighted: true,
        description: "Unified HCM cloud — Global HR, payroll, talent, WFM modules. Quote-only.",
      },
    ],
    featureOverrides: {
      ...HCM_FEATURES,
      "workforce-scheduling": "supported",
      "employee-training-paths": "supported",
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
      "No published list price",
      "Oracle Cloud / Fusion stack gravity — not a lightweight SMB HRIS",
      "Implementation typically partner-led and multi-month",
      "Module SKUs stack TCO",
      "No free plan",
    ],
    limitationKinds: [
      "plan-restriction",
      "other",
      "other",
      "requires-add-on",
      "plan-restriction",
    ],
    scores: {
      "ease-of-use": 5,
      "hiring-workforce-fit": 10,
      "workflow-depth": 10,
      integrations: 9,
      "mobile-frontline": 5,
      analytics: 9,
      scalability: 10,
      "value-for-money": 5,
      "ai-capabilities": 8,
    },
    scoreRationales: {
      "ease-of-use":
        "Fusion-suite admin is heavier than Workday for many mid-market teams. Not lab-tested.",
      "hiring-workforce-fit":
        "Primary job is enterprise HCM, including global HR and payroll. Scored inside enterprise-HCM only.",
      "workflow-depth":
        "Global HR, Cloud Payroll, Talent, Learning, Recruiting, and WFM on one model is full-suite depth.",
      integrations:
        "Oracle Cloud adjacency (ERP/EPM) plus standard HCM connectors.",
      "mobile-frontline":
        "Employee self-service exists; not a deskless WFM app.",
      analytics:
        "Embedded analytics and AI journeys are a published pillar.",
      scalability:
        "Built for global enterprises and 175+ country localisation claims.",
      "value-for-money":
        "Opaque quotes and implementation 1.5–3× year-one licence (industry pattern — not a first-party $). Affiliate economics excluded.",
      "ai-capabilities":
        "AI-embedded HCM (journeys, hiring, employee experience) is first-party messaging.",
    },
    bestFor: [
      "Enterprises already on Oracle Cloud ERP/EPM that want HCM on the same stack",
      "Global HR programmes that need localisation depth",
      "Buyers comparing Workday vs Oracle as the two enterprise HCM defaults",
    ],
    notIdealFor: [
      "SMB HRIS or published-PEPM payroll buyers",
      "Teams that want a lighter mid-market HCM (Paylocity / HiBob)",
      "Frontline-only WFM purchases",
    ],
    pros: [
      "Complete Fusion HCM suite",
      "Global HR and payroll depth",
      "One data model + embedded AI",
      "ERP/EPM stack adjacency",
      "Named Talent / WFM / Payroll modules",
    ],
    cons: [
      "Custom quote only",
      "Heavier admin than SMB HRIS",
      "Implementation-led",
      "Module stacking",
      "No free plan",
    ],
    keyFeatures: [
      "Oracle Fusion Cloud Human Resources",
      "Cloud Payroll",
      "Talent, recruiting, and learning",
      "Workforce management",
      "Embedded AI journeys",
      "Single HCM data model",
    ],
    whoShouldChoose:
      "Choose Oracle Cloud HCM when a Fusion-stack enterprise HCM suite is the job — not when you need published SMB pricing or a lightweight HRIS.",
    whoShouldConsiderAlternatives:
      "Compare Workday for the independent HCM default, UKG Pro / Dayforce for WFM-heavy HCM, and BambooHR/Gusto if the job is SMB people admin or payroll.",
    alternativeSlugs: ["workday", "ukg-pro", "dayforce"],
    competitorSlugs: ["workday", "ukg-pro", "dayforce", "sap-successfactors"],
    comparableSlugs: ["workday", "ukg-pro"],
    useCaseSlugs: ["enterprise-hcm"],
    businessSizeSlugs: ["enterprise"],
    teamTypeSlugs: ["operations", "recruiting"],
  },

  {
    slug: "ukg-pro",
    name: "UKG Pro",
    company: "UKG Inc.",
    website: "https://www.ukg.com/products/ukg-pro",
    domain: "ukg.com",
    pricingUrl: "https://www.ukg.com/products/ukg-pro",
    aliases: ["UKG Pro HCM", "Ultimate Kronos Group Pro", "UltiPro"],
    membershipRole: "primary",
    jobCluster: "enterprise-hcm",
    softShortDescription:
      "Enterprise HCM + WFM (Kronos heritage) — custom quote; Bryte AI. Distinct from UKG Ready (mid-market bundles).",
    shortDescription:
      "UKG Pro is UKG’s enterprise HCM suite: HR, payroll (including 160+ country global payroll claims), talent, time & attendance, and complex workforce scheduling, with Bryte AI. First-party pricing is custom quote by scope, modules, workforce size, and implementation — no published PEPM. UKG Ready is a separate mid-market product, not an upgrade path. Landscape enterprise HCM with a WFM thesis vs Workday.",
    vendorPositioning:
      "People-first HCM that goes beyond tasks — HR, payroll, and workforce management in one suite.",
    pricingModel: "custom-quote",
    hasFreePlan: false,
    hasFreeTrial: false,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from ukg.com/products/ukg-pro and UKG Pro vs Ready guide (high confidence: custom quote only). Do not invent PEPM. Ready is a different product. Affiliate economics excluded.",
    pricingSummary:
      "Custom quote by modules, workforce size, and implementation. No published PEPM. UKG Ready is a separate mid-market line. Confirm with UKG.",
    plans: [
      {
        kind: "contact-sales",
        slug: "hcm-suite",
        name: "UKG Pro HCM Suite",
        highlighted: true,
        description: "HR, payroll, talent — contact UKG. No published USD.",
      },
      {
        kind: "contact-sales",
        slug: "wfm",
        name: "UKG Pro + Workforce Management",
        description: "Time, scheduling, labor forecasting — quote as modules/scope.",
      },
    ],
    featureOverrides: {
      ...HCM_FEATURES,
      "workforce-scheduling": "supported",
      "gps-geofence-clockin": "supported",
      "frontline-comms": "supported",
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
      "No published list price",
      "UKG Ready is a different product — not a Pro upgrade",
      "WFM/HCM module scope drives TCO and implementation length",
      "Not an SMB published-PEPM HRIS",
      "No free plan",
    ],
    limitationKinds: [
      "plan-restriction",
      "other",
      "requires-add-on",
      "feature-unavailable",
      "plan-restriction",
    ],
    scores: {
      "ease-of-use": 6,
      "hiring-workforce-fit": 10,
      "workflow-depth": 10,
      integrations: 8,
      "mobile-frontline": 8,
      analytics: 8,
      scalability: 9,
      "value-for-money": 5,
      "ai-capabilities": 8,
    },
    scoreRationales: {
      "ease-of-use":
        "Enterprise HCM+WFM is deeper than SMB schedulers. Not lab-tested.",
      "hiring-workforce-fit":
        "Primary job is enterprise HCM with a WFM heritage. Scored inside enterprise-HCM — not as a Connecteam WFM peer.",
      "workflow-depth":
        "HR + payroll + Kronos-class time/scheduling is the deepest P3 WFM-in-HCM workflow.",
      integrations:
        "HCM/payroll/WFM connectors are strong; not Workday’s ISV breadth.",
      "mobile-frontline":
        "Timekeeping, schedules, and payroll tasks on mobile are a published pillar.",
      analytics:
        "Reporting plus Bryte AI insights; Dynamic Workforce Operations is the ops story.",
      scalability:
        "Enterprise 1,000–50,000+ positioning; Ready covers smaller mid-market separately.",
      "value-for-money":
        "Opaque quotes and implementation depress value vs published SMB tools. Affiliate economics excluded.",
      "ai-capabilities":
        "Bryte AI is first-party named AI for insights and employee experience.",
    },
    bestFor: [
      "Enterprises whose HCM shortlist is Workday vs UKG because hourly WFM/compliance is core",
      "Healthcare, retail, and 24/7 operations that need HCM plus complex scheduling",
      "Global payroll programmes that will quote UKG Pro rather than Ready",
    ],
    notIdealFor: [
      "SMB teams (UKG Ready or Gusto/BambooHR fit better)",
      "Buyers who only need a lightweight ATS or SOP tool",
      "Orgs that want published PEPM",
    ],
    pros: [
      "HCM + WFM in one enterprise suite",
      "Bryte AI",
      "Global payroll claim (160+ countries)",
      "Analyst-leader HCM/WFM positioning",
      "Mobile time and scheduling",
    ],
    cons: [
      "Custom quote only",
      "Ready ≠ Pro upgrade",
      "Implementation-heavy",
      "Not SMB-priced",
      "No free plan",
    ],
    keyFeatures: [
      "Core HR and payroll",
      "Time & attendance (Kronos heritage)",
      "Complex workforce scheduling",
      "Talent and HR service delivery",
      "Bryte AI",
      "Global payroll",
    ],
    whoShouldChoose:
      "Choose UKG Pro when enterprise HCM plus complex hourly WFM is the job — not when you need UKG Ready, published SMB payroll, or a Workday-simple global HRIS without deep WFM.",
    whoShouldConsiderAlternatives:
      "Compare Workday for the HCM default, Dayforce for continuous-calc payroll+WFM, Connecteam for SMB frontline WFM, and Gusto if US SMB payroll is the job.",
    alternativeSlugs: ["workday", "dayforce", "oracle-hcm"],
    competitorSlugs: ["workday", "dayforce", "oracle-hcm", "adp-workforce-now"],
    comparableSlugs: ["workday", "dayforce"],
    useCaseSlugs: ["enterprise-hcm"],
    businessSizeSlugs: ["mid-market", "enterprise"],
    teamTypeSlugs: ["operations"],
  },

  {
    slug: "dayforce",
    name: "Dayforce",
    company: "Dayforce, Inc.",
    website: "https://www.dayforce.com",
    domain: "dayforce.com",
    pricingUrl: "https://www.dayforce.com",
    aliases: ["Ceridian Dayforce", "Ceridian", "Dayforce HCM"],
    membershipRole: "primary",
    jobCluster: "enterprise-hcm",
    softShortDescription:
      "AI-powered HCM (HR, pay, time, talent) with continuous payroll calculation — custom quote; formerly Ceridian.",
    shortDescription:
      "Dayforce (legal/brand shift from Ceridian in 2024) is a single-application HCM for HR, payroll, time, talent, planning, and analytics. The product thesis is continuous calculation: pay impacts update as timecards change rather than a week-end batch. First-party pricing is quote-led with no published PEPM or free plan. Gartner Cloud HCM Leader (vendor-cited, 2025). Landscape enterprise HCM — not an SMB payroll peer.",
    vendorPositioning:
      "Less busywork, more HR — one AI-powered people platform for pay, time, and talent.",
    pricingModel: "custom-quote",
    hasFreePlan: false,
    hasFreeTrial: false,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from dayforce.com (high confidence: no public rate card). Custom PEPM. Do not invent $22–45 PEPM third-party bands as list prices. Affiliate economics excluded.",
    pricingSummary:
      "Custom quote. No published PEPM, free plan, or self-serve trial. Confirm on dayforce.com.",
    plans: [
      {
        kind: "contact-sales",
        slug: "hcm",
        name: "Dayforce HCM",
        highlighted: true,
        description: "HR, pay, time, talent, analytics on one app — contact sales.",
      },
    ],
    featureOverrides: {
      ...HCM_FEATURES,
      "workforce-scheduling": "supported",
      "gps-geofence-clockin": "supported",
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
      "No published list price",
      "Implementation is typically a large share of year-one TCO",
      "Not an SMB Gusto/BambooHR substitute",
      "Talent/ATS depth is HCM-module, not Greenhouse-class",
      "No free plan",
    ],
    limitationKinds: [
      "plan-restriction",
      "other",
      "feature-unavailable",
      "feature-unavailable",
      "plan-restriction",
    ],
    scores: {
      "ease-of-use": 6,
      "hiring-workforce-fit": 10,
      "workflow-depth": 9,
      integrations: 8,
      "mobile-frontline": 7,
      analytics: 8,
      scalability: 9,
      "value-for-money": 5,
      "ai-capabilities": 7,
    },
    scoreRationales: {
      "ease-of-use":
        "Single-app HCM is simpler than multi-module stacks, still enterprise-weight. Not lab-tested.",
      "hiring-workforce-fit":
        "Primary job is enterprise HCM with payroll+time as the differentiator. Scored inside enterprise-HCM.",
      "workflow-depth":
        "Continuous-calc payroll plus time/WFM is deep. Held at 9 vs the broadest global HCM suites.",
      integrations:
        "Payroll/time/HR connectors are solid; not Oracle ERP adjacency.",
      "mobile-frontline":
        "Time and pay self-service are stronger than pure HRIS suites; not Connecteam hubs.",
      analytics:
        "Single data model + workforce insights are first-party claims.",
      scalability:
        "Mid-market through enterprise; vendor cites millions of users.",
      "value-for-money":
        "Quote-only PEPM plus implementation. Affiliate economics excluded.",
      "ai-capabilities":
        "AI-powered people platform is marketed; less named-SKU depth than Workday/UKG Bryte in first-party copy.",
    },
    bestFor: [
      "Mid-to-enterprise teams that want HR, pay, and time in one app with continuous payroll calc",
      "Retail/manufacturing orgs comparing Dayforce vs UKG Pro",
      "Buyers who will take a Gartner-HCM-leader shortlist quote",
    ],
    notIdealFor: [
      "SMB published-price payroll (Gusto)",
      "Structured-hiring ATS as the primary purchase (Greenhouse)",
      "Deskless comms hubs without enterprise payroll",
    ],
    pros: [
      "Single-app HR + pay + time",
      "Continuous payroll calculation thesis",
      "WFM alongside HCM",
      "Vendor-cited Gartner HCM Leader",
      "Global HR ecosystem messaging",
    ],
    cons: [
      "Custom quote only",
      "Implementation-heavy",
      "Not SMB-priced",
      "ATS is not Greenhouse-class",
      "No free plan",
    ],
    keyFeatures: [
      "Continuous calculation payroll",
      "Time and attendance",
      "Core HR and benefits",
      "Talent and workforce planning",
      "Analytics on one data model",
      "Employee self-service",
    ],
    whoShouldChoose:
      "Choose Dayforce when unified HR, continuous-calc payroll, and time/WFM in one enterprise app is the job — not when you need published SMB payroll or a dedicated ATS.",
    whoShouldConsiderAlternatives:
      "Compare UKG Pro for deeper complex scheduling, Workday for the HCM default, ADP Workforce Now for payroll-compliance mid-market, and Gusto if US SMB payroll is the job.",
    alternativeSlugs: ["ukg-pro", "workday", "adp-workforce-now"],
    competitorSlugs: ["ukg-pro", "workday", "oracle-hcm", "adp-workforce-now"],
    comparableSlugs: ["ukg-pro", "workday"],
    useCaseSlugs: ["enterprise-hcm"],
    businessSizeSlugs: ["mid-market", "enterprise"],
    teamTypeSlugs: ["operations"],
  },

  {
    slug: "adp-workforce-now",
    name: "ADP Workforce Now",
    company: "ADP, Inc.",
    website: "https://www.adp.com",
    domain: "adp.com",
    pricingUrl: "https://www.adp.com",
    aliases: ["Workforce Now", "ADP WFN", "ADP WorkforceNow"],
    membershipRole: "primary",
    jobCluster: "payroll-benefits",
    softShortDescription:
      "Mid-market payroll + HR (Select / Plus / Premium packaging) — custom PEPM quote; no published seat $. Landscape vs Gusto.",
    shortDescription:
      "ADP Workforce Now is ADP’s mid-to-enterprise HCM for payroll, tax filing, HR records, benefits, and optional time/talent modules. Industry coverage consistently describes three named packages — Select (payroll + core HR), Plus (benefits), Premium (time & workforce) — all contact-sales. First-party pages do not publish PEPM. Score as payroll-benefits landscape (compliance-scale), not a Gusto SMB award peer and not a Workday enterprise-HCM peer.",
    vendorPositioning:
      "Payroll and HR you can trust when compliance, tax, and scale are non-negotiable.",
    pricingModel: "custom-quote",
    hasFreePlan: false,
    hasFreeTrial: false,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18: ADP does not publish Workforce Now PEPM on first-party pages (high confidence). Named Select / Plus / Premium packaging is widely documented from ADP plan descriptions; no USD on those cards. Do not invent $18–30 PEPM as list. Affiliate economics excluded.",
    pricingSummary:
      "Custom quote. Named Select / Plus / Premium packaging (payroll → benefits → time). No published PEPM. Confirm with ADP sales.",
    plans: [
      {
        kind: "contact-sales",
        slug: "select",
        name: "Select",
        description: "Payroll, tax filing, core HR records — contact sales. No published USD.",
      },
      {
        kind: "contact-sales",
        slug: "plus",
        name: "Plus",
        highlighted: true,
        description: "Adds benefits administration — contact sales.",
      },
      {
        kind: "contact-sales",
        slug: "premium",
        name: "Premium",
        description: "Adds time, scheduling, and workforce tools — contact sales.",
      },
    ],
    featureOverrides: {
      ...PAYROLL_HCM_FEATURES,
      "time-attendance": "add-on",
      "workforce-scheduling": "add-on",
      "benefits-admin": "add-on",
      "applicant-tracking": "add-on",
    },
    aiLines: [
      "AI assistant: limited",
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
      "No published PEPM — invoices can include garnishment/W-2 extras",
      "Time, talent, and benefits depth live on Plus/Premium or add-ons",
      "Not a Workday-class global HCM",
      "Not a published-price SMB payroll product (Gusto)",
      "No free plan",
    ],
    limitationKinds: [
      "plan-restriction",
      "requires-add-on",
      "feature-unavailable",
      "feature-unavailable",
      "plan-restriction",
    ],
    scores: {
      "ease-of-use": 7,
      "hiring-workforce-fit": 9,
      "workflow-depth": 8,
      integrations: 8,
      "mobile-frontline": 7,
      analytics: 7,
      scalability: 8,
      "value-for-money": 5,
      "ai-capabilities": 6,
    },
    scoreRationales: {
      "ease-of-use":
        "Mid-market payroll+HR is heavier than Gusto, lighter than Workday. Not lab-tested.",
      "hiring-workforce-fit":
        "Primary job is payroll-benefits at mid-market compliance scale. Scored inside payroll-benefits — Gusto keeps the published-SMB award.",
      "workflow-depth":
        "Payroll, tax, and HR records are deep. Talent/time sit on higher packages.",
      integrations:
        "Payroll/benefits/401(k) ecosystem is a category strength.",
      "mobile-frontline":
        "Employee self-service and mobile payroll/HR exist; not deskless WFM.",
      analytics:
        "Benchmark reporting against ADP’s dataset is marketed; not people-science Culture Amp.",
      scalability:
        "Designed past Gusto’s SMB comfort zone into multi-state mid-market.",
      "value-for-money":
        "Opaque PEPM and add-ons vs Gusto’s $49+$6 published floor. Affiliate economics excluded.",
      "ai-capabilities":
        "Assistive payroll/HR AI is marketed without a first-party named AI SKU like Bryte or Ignite.",
    },
    bestFor: [
      "Mid-market US employers that need payroll tax compliance depth beyond Gusto",
      "Teams comparing ADP WFN vs Paylocity as the payroll+HR shortlist",
      "Orgs that may add time/benefits later on Plus/Premium",
    ],
    notIdealFor: [
      "Startups that want published month-to-month payroll (Gusto)",
      "Enterprise HCM programmes standardised on Workday/Oracle",
      "Frontline WFM as the primary purchase",
    ],
    pros: [
      "Payroll/tax compliance brand",
      "Named Select / Plus / Premium ladder",
      "Benefits and time as package steps",
      "Mid-market scale",
      "Broad payroll partner ecosystem",
    ],
    cons: [
      "Custom quote only",
      "Add-ons and extras",
      "Not enterprise-HCM Workday",
      "Not published-SMB Gusto",
      "No free plan",
    ],
    keyFeatures: [
      "Payroll and tax filing",
      "Digital employee records",
      "Benefits admin (Plus+)",
      "Time and scheduling (Premium)",
      "Optional talent modules",
      "Employee self-service / mobile",
    ],
    whoShouldChoose:
      "Choose ADP Workforce Now when mid-market payroll compliance and HR records are the job and you will take a custom quote — not when you need Gusto’s published SMB prices or Workday-class HCM.",
    whoShouldConsiderAlternatives:
      "Compare Gusto for published US SMB payroll, Paylocity / Paycor for mid-market HCM UX, and Workday/UKG if enterprise HCM is the real job.",
    alternativeSlugs: ["gusto", "paylocity", "paycor"],
    competitorSlugs: ["gusto", "paylocity", "paycor", "rippling", "paychex"],
    comparableSlugs: ["gusto", "paylocity"],
    useCaseSlugs: ["payroll-benefits"],
    businessSizeSlugs: ["small-business", "mid-market", "enterprise"],
    teamTypeSlugs: ["operations"],
  },

  {
    slug: "paylocity",
    name: "Paylocity",
    company: "Paylocity Corporation",
    website: "https://www.paylocity.com",
    domain: "paylocity.com",
    pricingUrl: "https://www.paylocity.com/products/payroll/",
    aliases: ["Paylocity HCM", "PCTY"],
    membershipRole: "primary",
    jobCluster: "payroll-benefits",
    softShortDescription:
      "US mid-market HR + payroll (+ finance/IT) — custom quote (‘Explore Payroll Pricing’); Ignite AI. Landscape vs Gusto.",
    shortDescription:
      "Paylocity is a unified HR, payroll, finance, and IT platform aimed at small, midsize (100–499), and enterprise (500+) US employers. Payroll, tax services (IRS registered reporting agent, 50 states + territories), time & labor, talent, Community, and Ignite AI are first-party pillars. Pricing is ‘get a customized quote’ — no published PEPM. Score as payroll-benefits landscape (mid-market HCM), not the Gusto SMB award and not Workday enterprise HCM.",
    vendorPositioning:
      "Unify HR, finance, and IT so payroll, spend, and people data stop living in three systems.",
    pricingModel: "custom-quote",
    hasFreePlan: false,
    hasFreeTrial: false,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from paylocity.com (high confidence: Explore Payroll Pricing → custom quote; no USD list). Do not invent $22–33 PEPM third-party bands as list prices. Affiliate economics excluded.",
    pricingSummary:
      "Custom quote. No published PEPM. Sized for 1–99 / 100–499 / 500+ employees on marketing pages. Confirm on paylocity.com.",
    plans: [
      {
        kind: "contact-sales",
        slug: "platform",
        name: "Paylocity platform",
        highlighted: true,
        description: "HR + payroll (+ finance/IT modules) — customized quote. No published USD.",
      },
    ],
    featureOverrides: {
      ...PAYROLL_HCM_FEATURES,
      "applicant-tracking": "supported",
      "time-attendance": "supported",
      "benefits-admin": "supported",
      "employee-training-paths": "supported",
      "workforce-scheduling": "limited",
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
      "No published PEPM",
      "Not a Workday-class global HCM",
      "Not Gusto’s published SMB floor",
      "Scheduling/WFM is not UKG-class",
      "No free plan",
    ],
    limitationKinds: [
      "plan-restriction",
      "feature-unavailable",
      "feature-unavailable",
      "feature-unavailable",
      "plan-restriction",
    ],
    scores: {
      "ease-of-use": 8,
      "hiring-workforce-fit": 9,
      "workflow-depth": 8,
      integrations: 8,
      "mobile-frontline": 8,
      analytics: 7,
      scalability: 7,
      "value-for-money": 6,
      "ai-capabilities": 7,
    },
    scoreRationales: {
      "ease-of-use":
        "Modern mid-market HCM UX vs ADP-weight payroll suites. Not lab-tested.",
      "hiring-workforce-fit":
        "Primary job is US mid-market payroll+HR. Scored inside payroll-benefits; Gusto keeps published-SMB award.",
      "workflow-depth":
        "Payroll, tax, time, talent, and Community are a full mid-market stack. Held at 8 vs enterprise HCM.",
      integrations:
        "Open APIs plus 401(k)/benefits file transfers are adequate mid-market.",
      "mobile-frontline":
        "Employee Community + mobile is a Paylocity differentiator vs older payroll suites.",
      analytics:
        "Data Insights / dashboards are marketed; not enterprise people analytics.",
      scalability:
        "Marketing covers 1 through 500+ employees; not Workday 10k+ default.",
      "value-for-money":
        "Quote-only vs Gusto transparency. Affiliate economics excluded.",
      "ai-capabilities":
        "Ignite AI is a first-party named payroll/HR automation story.",
    },
    bestFor: [
      "US mid-market companies (roughly 100–1,000 employees) that want payroll+HR in one modern platform",
      "Teams comparing Paylocity vs ADP Workforce Now vs Paycor",
      "Orgs that may add finance/IT and Ignite AI later",
    ],
    notIdealFor: [
      "Tiny teams that want Gusto’s published $49+$6 floor",
      "Global enterprise HCM (Workday / Oracle)",
      "Complex hourly WFM as the primary job (UKG Pro)",
    ],
    pros: [
      "Unified mid-market HR + payroll on one platform",
      "Ignite AI assistant in the employee experience",
      "Employee Community / mobile as a differentiator",
      "50-state tax services story as IRS reporting agent",
      "Optional finance/IT platform expansion beyond payroll",
    ],
    cons: [
      "Custom quote only — no published PEPM",
      "Not a Workday-class enterprise HCM",
      "Not Gusto’s published SMB payroll floor",
      "Scheduling/WFM is not UKG-class",
      "No free plan on first-party pages",
    ],
    keyFeatures: [
      "Payroll, tax, and garnishments",
      "HR and talent",
      "Time & labor",
      "Ignite AI",
      "Employee Community mobile",
      "Optional finance / IT modules",
    ],
    whoShouldChoose:
      "Choose Paylocity when US mid-market payroll+HR with a modern employee app is the job and you will take a custom quote — not when you need Gusto’s published prices or Workday-class HCM.",
    whoShouldConsiderAlternatives:
      "Compare Gusto for published SMB payroll, ADP Workforce Now for compliance-brand payroll, Paycor for a similar mid-market HCM, and Rippling if HR+IT unification is the job.",
    alternativeSlugs: ["gusto", "adp-workforce-now", "paycor"],
    competitorSlugs: ["gusto", "adp-workforce-now", "paycor", "rippling", "bamboohr"],
    comparableSlugs: ["adp-workforce-now", "paycor"],
    useCaseSlugs: ["payroll-benefits"],
    businessSizeSlugs: ["small-business", "mid-market", "enterprise"],
    teamTypeSlugs: ["operations"],
  },

  {
    slug: "paycor",
    name: "Paycor",
    company: "Paycor, Inc.",
    website: "https://www.paycor.com",
    domain: "paycor.com",
    pricingUrl: "https://www.paycor.com",
    aliases: ["Paycor HCM", "Paychex Paycor"],
    membershipRole: "primary",
    jobCluster: "payroll-benefits",
    softShortDescription:
      "HR + payroll HCM (Paychex-owned since 2025) — custom quote; WISE AI. Landscape vs Gusto / Paylocity.",
    shortDescription:
      "Paycor is an HCM suite for HR, payroll, talent, workforce management, and benefits, now under Paychex (acquisition closed 2025). First-party pricing is quote-only — the public rate card was pulled. Named historical small-business bundles (Basic / Essential / Core / Complete) are not treated as current list prices. WISE is the expert-enabled AI assistant. Score as payroll-benefits landscape, not Gusto’s published-SMB award.",
    vendorPositioning:
      "HCM that empowers leaders — payroll, talent, and workforce intelligence with always-on AI help.",
    pricingModel: "custom-quote",
    hasFreePlan: false,
    hasFreeTrial: false,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-18 from paycor.com (high confidence: no current USD list). Paychex acquisition 2025; public pricing page removed. Do not republish historical $99+$6 figures as live list. Affiliate economics excluded.",
    pricingSummary:
      "Custom quote only (public rate card removed after the Paychex acquisition). Confirm current packaging with Paycor sales.",
    plans: [
      {
        kind: "contact-sales",
        slug: "hcm",
        name: "Paycor HCM",
        highlighted: true,
        description: "HR + payroll + talent/WFM modules — contact sales. No published USD.",
      },
    ],
    featureOverrides: {
      ...PAYROLL_HCM_FEATURES,
      "applicant-tracking": "supported",
      "career-site-job-boards": "supported",
      "time-attendance": "supported",
      "workforce-scheduling": "supported",
      "benefits-admin": "supported",
    },
    aiLines: [
      "AI assistant: supported",
      "AI summaries: supported",
      "AI automation: supported",
      "AI recommendations: limited",
    ],
    integrations: [
      { integrationSlug: "slack", kind: "native" },
      { integrationSlug: "google-workspace", kind: "native" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    limitations: [
      "No current published PEPM after the Paychex deal",
      "Not a Workday-class enterprise HCM",
      "Not Gusto’s transparent SMB floor",
      "Ownership/packaging may still be settling post-acquisition",
      "No free plan",
    ],
    limitationKinds: [
      "plan-restriction",
      "feature-unavailable",
      "feature-unavailable",
      "other",
      "plan-restriction",
    ],
    scores: {
      "ease-of-use": 8,
      "hiring-workforce-fit": 9,
      "workflow-depth": 7,
      integrations: 7,
      "mobile-frontline": 8,
      analytics: 6,
      scalability: 7,
      "value-for-money": 6,
      "ai-capabilities": 7,
    },
    scoreRationales: {
      "ease-of-use":
        "Leader-friendly mid-market HCM UX is the shortlist reason vs ADP-weight tools. Not lab-tested.",
      "hiring-workforce-fit":
        "Primary job is payroll-benefits / mid-market HCM. Scored inside payroll-benefits; Gusto keeps SMB award.",
      "workflow-depth":
        "HR, payroll, recruiting, time, and benefits are complete enough. Held at 7 vs Paylocity’s broader finance/IT story and ADP’s tax depth.",
      integrations:
        "Partner marketplace is marketed; not the deepest ISV graph.",
      "mobile-frontline":
        "Self-service and on-demand pay / scheduling for hourly verticals are first-party claims.",
      analytics:
        "Workforce analytics exist; WISE is the intelligence story more than BI depth.",
      scalability:
        "SMB through mid-market; enterprise quotes exist but Workday is the 10k+ default.",
      "value-for-money":
        "Quote-only after the rate card came down. Affiliate economics excluded.",
      "ai-capabilities":
        "WISE (workforce intelligence) is a named AI assistant in first-party copy.",
    },
    bestFor: [
      "Growing US companies comparing Paycor vs Paylocity for payroll+HR",
      "Hourly verticals (healthcare, restaurants, manufacturing) that want HCM plus scheduling",
      "Buyers already in the Paychex orbit post-acquisition",
    ],
    notIdealFor: [
      "Teams that need a live published price card (Gusto)",
      "Enterprise HCM (Workday / Oracle / UKG Pro)",
      "Global EOR as the primary job (Deel — P4)",
    ],
    pros: [
      "Full mid-market HCM (HR, payroll, talent, WFM)",
      "WISE AI",
      "Strong hourly-vertical packaging",
      "Mobile employee experience",
      "Paychex distribution adjacency",
    ],
    cons: [
      "No current list prices",
      "Post-acquisition packaging flux",
      "Not enterprise HCM",
      "Not Gusto-simple SMB payroll",
      "No free plan",
    ],
    keyFeatures: [
      "Payroll and HR system of record",
      "Recruiting and onboarding",
      "Time and scheduling",
      "Benefits and ACA tools",
      "WISE AI assistant",
      "Analytics and expenses",
    ],
    whoShouldChoose:
      "Choose Paycor when mid-market HR+payroll with WISE AI is the job and you will take a custom quote — not when you need published SMB prices or enterprise HCM.",
    whoShouldConsiderAlternatives:
      "Compare Paylocity for a similar modern HCM, ADP Workforce Now for payroll-compliance brand, Gusto for published SMB payroll, and Workday if enterprise HCM is the job.",
    alternativeSlugs: ["paylocity", "adp-workforce-now", "gusto"],
    competitorSlugs: ["paylocity", "adp-workforce-now", "gusto", "rippling", "paychex"],
    comparableSlugs: ["paylocity", "adp-workforce-now"],
    useCaseSlugs: ["payroll-benefits"],
    businessSizeSlugs: ["small-business", "mid-market"],
    teamTypeSlugs: ["operations", "recruiting"],
  },
];

export const PRODUCTS = COMPACT.map(expandHrProduct);

export const COMPARISON_PAIRS = [
  ["workday", "oracle-hcm"],
  ["workday", "ukg-pro"],
  ["workday", "dayforce"],
  ["ukg-pro", "dayforce"],
  ["gusto", "adp-workforce-now"],
  ["gusto", "paylocity"],
  ["paylocity", "paycor"],
  ["adp-workforce-now", "paylocity"],
];
