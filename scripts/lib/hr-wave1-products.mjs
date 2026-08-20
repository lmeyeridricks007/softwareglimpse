/**
 * HR Wave-1 affiliate products (compact).
 * breezy-hr, Connecteam, Jibble, Trainual.
 *
 * Pricing floors grounded 2026-08-17 from first-party / official pages
 * (medium confidence where JS-rendered or third-party cited).
 * Affiliate economics never enter scores. handsOnTesting=false.
 *
 * LearnWorlds is marketing-primary already onboarded — NOT in this array.
 */
import { expandHrProduct } from "./hr-compact-expand.mjs";

const COMPACT = [
  {
    slug: "breezy-hr",
    name: "Breezy HR",
    company: "Breezy HR, Inc.",
    website: "https://breezy.hr",
    domain: "breezy.hr",
    pricingUrl: "https://breezy.hr/pricing",
    aliases: ["BreezyHR", "Breezy"],
    membershipRole: "primary",
    jobCluster: "ats-recruiting",
    softShortDescription:
      "Mid-market ATS with free Bootstrap, paid Startup/Growth/Business pools, career site, and interview workflows — Growth from $273/mo annual.",
    shortDescription:
      "Breezy HR is an applicant tracking system for recruiting pipelines, career sites, interview scheduling, and hiring collaboration. Free forever Bootstrap covers one active pool/position with unlimited users and candidates (last 30 days). Paid annual plans: Startup $157/mo, Growth $273/mo (most popular), Business $439/mo, plus Custom Pro. Monthly list is higher ($189 / $329 / $529). 14-day full trial. Add-ons include Breezy Intelligence credits, SMS, Onboard, and Perform.",
    vendorPositioning:
      "A modern ATS to attract, evaluate, and hire — pipelines, career pages, and collaborative hiring without enterprise HRIS complexity.",
    pricingModel: "flat",
    hasFreePlan: true,
    hasFreeTrial: true,
    trialDays: 14,
    startingPriceMonthly: 157,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-17 from breezy.hr/pricing (high confidence, static HTML). Annual (2 months free): Bootstrap Free; Startup $157/mo; Growth $273/mo; Business $439/mo; Custom Pro contact. Monthly: $189 / $329 / $529. Free Bootstrap: 1 active pool/position, unlimited users, unlimited candidates (last 30 days). 14-day full trial. Add-ons: Intelligence credits from $30/100k; SMS from $41/mo; Onboard from $49/mo; Perform. Affiliate economics excluded from scoring.",
    pricingSummary:
      "Free Bootstrap (1 active pool). Annual: Startup $157, Growth $273, Business $439/mo; Custom Pro contact. Monthly $189/$329/$529. 14-day trial. Add-ons for Intelligence, SMS, Onboard, Perform. Confirm live on breezy.hr/pricing.",
    plans: [
      {
        kind: "free",
        slug: "bootstrap",
        name: "Bootstrap",
        limits: { maxActivePools: 1 },
        description:
          "Free forever: 1 active pool/position, unlimited users, unlimited candidates (last 30 days).",
      },
      {
        kind: "flat-annual",
        slug: "startup",
        name: "Startup",
        amount: 157,
        hasFreeTrial: true,
        trialDays: 14,
        description:
          "$157/mo billed annually (monthly $189). Entry paid ATS for growing recruiting teams.",
      },
      {
        kind: "flat-annual",
        slug: "growth",
        name: "Growth",
        amount: 273,
        highlighted: true,
        hasFreeTrial: true,
        trialDays: 14,
        description:
          "$273/mo billed annually (monthly $329). Most popular mid-market ATS tier.",
      },
      {
        kind: "flat-annual",
        slug: "business",
        name: "Business",
        amount: 439,
        hasFreeTrial: true,
        trialDays: 14,
        description:
          "$439/mo billed annually (monthly $529). Higher-volume hiring and admin depth.",
      },
      {
        kind: "contact-sales",
        slug: "pro",
        name: "Custom Pro",
        description: "Custom Pro — contact sales for advanced needs.",
      },
    ],
    featureOverrides: {
      "applicant-tracking": "supported",
      "career-site-job-boards": "supported",
      "interview-scheduling": "supported",
      "workforce-scheduling": "not-supported",
      "frontline-comms": "not-supported",
      "time-attendance": "not-supported",
      "gps-geofence-clockin": "not-supported",
      "sop-knowledge-base": "not-supported",
      "employee-training-paths": "not-supported",
      "lms-course-commerce": "not-supported",
      "hris-integrations": "supported",
      "analytics-reporting": "supported",
      "ai-assistance": "add-on",
    },
    aiLines: [
      "AI assistant: add-on",
      "AI summaries: add-on",
      "AI automation: limited",
      "AI recommendations: add-on",
    ],
    integrations: [
      { integrationSlug: "slack", kind: "native" },
      { integrationSlug: "google-workspace", kind: "native" },
      { integrationSlug: "zapier", kind: "zapier-style" },
      { integrationSlug: "linkedin", kind: "native" },
    ],
    limitations: [
      "Free Bootstrap limits to one active pool/position — not enough for multi-role hiring volume",
      "Breezy Intelligence AI is credit-based add-on packaging, not unlimited included AI",
      "SMS, Onboard, and Perform are separate paid add-ons that raise TCO",
      "Not a frontline WFM, time-clock, or SOP training platform",
      "Custom Pro requires sales engagement for advanced packaging",
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
      "hiring-workforce-fit": 9,
      "workflow-depth": 8,
      integrations: 8,
      "mobile-frontline": 7,
      analytics: 7,
      scalability: 8,
      "value-for-money": 8,
      "ai-capabilities": 7,
    },
    scoreRationales: {
      "ease-of-use":
        "Breezy positions recruiting pipelines and collaborative hiring for mid-market teams without heavy HRIS admin overhead. Score reflects first-party packaging and published onboarding posture, not hands-on lab testing.",
      "hiring-workforce-fit":
        "Primary job is ATS/recruiting — pipelines, career site, interview scheduling, and candidate collaboration match the ats-recruiting cluster strongly. Scored inside ATS peers, not against WFM or time clocks.",
      "workflow-depth":
        "Published hiring stages, pools/positions, interview scheduling, and career-site posting give solid ATS workflow depth for SMB–mid-market. Held at 8 vs deepest enterprise ATS suites.",
      integrations:
        "Native Slack/Google Workspace/LinkedIn-style connectors plus Zapier-style automation support hire-to-retain stacks; not a full HRIS replacement.",
      "mobile-frontline":
        "Recruiting collaboration is available on mobile surfaces, but Breezy is not a deskless WFM/comms product — scored for recruiting mobility, not frontline shift ops.",
      analytics:
        "Hiring reporting and pipeline analytics are marketed on paid tiers; depth is adequate for mid-market ATS buyers, not BI-suite depth.",
      scalability:
        "Clear Bootstrap → Startup/Growth/Business → Custom Pro path with annual discounts supports growth; free pool limit is the main early constraint.",
      "value-for-money":
        "Meaningful free Bootstrap plus transparent annual floors ($157/$273/$439) are strong for ATS buyers; add-ons (Intelligence/SMS/Onboard) raise real TCO. Affiliate economics excluded.",
      "ai-capabilities":
        "Breezy Intelligence is a published AI add-on with credit packaging from ~$30/100k — useful capability with packaging friction rather than unlimited included AI.",
    },
    bestFor: [
      "SMB and mid-market teams needing a dedicated ATS with transparent published pricing",
      "Hiring teams that want a free Bootstrap plan to start with one active role",
      "Buyers who prefer collaborative recruiting without buying a full HRIS suite",
    ],
    notIdealFor: [
      "Frontline ops teams whose primary job is shift scheduling or GPS clock-in",
      "Orgs that need SOP training paths or an employee LMS as the primary purchase",
      "High-volume enterprise ATS buyers who need Custom Pro features without sales engagement",
    ],
    pros: [
      "Clear ATS primary job with career site and interview workflows",
      "Free forever Bootstrap for single-pool hiring",
      "Transparent Startup/Growth/Business annual floors",
      "14-day full trial on paid packaging",
      "Published AI Intelligence add-on path",
    ],
    cons: [
      "Free plan capped to one active pool",
      "AI, SMS, Onboard, and Perform add-ons raise TCO",
      "Not a WFM, time-clock, or SOP training product",
      "Custom Pro is contact-sales",
      "Mobile strength is recruiting-oriented, not frontline WFM",
    ],
    keyFeatures: [
      "Applicant tracking pipelines and candidate pools",
      "Career site and job-board posting",
      "Interview scheduling and collaborative hiring",
      "Hiring analytics and reporting",
      "Breezy Intelligence AI credits (add-on)",
      "Integrations via Slack, Google Workspace, Zapier-style",
    ],
    whoShouldChoose:
      "Choose Breezy HR when you need a mid-market ATS with a usable free Bootstrap tier and clear paid pool pricing — not when the primary job is frontline scheduling, time clocks, or SOP training.",
    whoShouldConsiderAlternatives:
      "Compare Connecteam for frontline WFM, Jibble for time & attendance, and Trainual for SOP/employee training docs. Freshteam is a future ATS peer when onboarded — not forced in this wave.",
    alternativeSlugs: ["connecteam", "jibble", "trainual"],
    competitorSlugs: ["freshteam", "connecteam", "greenhouse", "lever"],
    comparableSlugs: ["freshteam"],
    useCaseSlugs: ["recruiting-ats"],
    businessSizeSlugs: ["micro", "small-business", "mid-market"],
    teamTypeSlugs: ["recruiting", "operations"],
    sourcesExtra: [
      {
        id: "breezy-hr-pricing-help",
        url: "https://breezy.hr/pricing",
        title: "Breezy HR Pricing",
        domains: ["pricing", "plans", "free-plan", "free-trial", "limits"],
      },
    ],
    catalogueSourceId: "aff-breezy-hr",
    affiliateUrl: "https://breezyhr.partnerlinks.io/2mnqgfqugfj2",
  },

  {
    slug: "connecteam",
    name: "Connecteam",
    company: "Connecteam Inc.",
    website: "https://connecteam.com",
    domain: "connecteam.com",
    pricingUrl: "https://connecteam.com/pricing/",
    aliases: ["Connecteam app"],
    membershipRole: "primary",
    jobCluster: "frontline-wfm",
    softShortDescription:
      "Frontline workforce app with Ops, Comms, and HR & Skills hubs — free ≤10 users; paid hubs from $29/mo annual for first 30 users.",
    shortDescription:
      "Connecteam is a frontline workforce management platform sold as hubs (Ops, Comms, HR & Skills). Small Business free covers ≤10 users across hubs with limited essentials. Paid annual hub pricing for the first 30 users: Basic $29/mo, Advanced $49/mo, Expert $99/mo (monthly $35/$59/$119). Per-user pricing above 30 varies by hub. 14-day trial. Multi-hub TCO can stack when Ops + Comms + HR are purchased separately.",
    vendorPositioning:
      "An all-in-one app for deskless and frontline teams — scheduling, communications, tasks, and HR/skills in mobile-first hubs.",
    pricingModel: "hybrid",
    hasFreePlan: true,
    hasFreeTrial: true,
    trialDays: 14,
    startingPriceMonthly: 29,
    startingPriceConfidence: "medium",
    pricingNotes:
      "Researched 2026-08-17 from connecteam.com/pricing/ plus help.connecteam.com yearly plan documentation (medium confidence — base $ from help center; confirm live hub packaging). Free ≤10 users all hubs (limited essentials). Paid per hub annual: Basic $29, Advanced $49, Expert $99/mo for first 30 users; monthly $35/$59/$119. Over-30 per-user rates vary by hub. 14-day trial. Multi-hub purchases stack TCO. Affiliate economics excluded.",
    pricingSummary:
      "Free ≤10 users (limited). Per hub annual: Basic $29 / Advanced $49 / Expert $99/mo for first 30 users (monthly higher). Over-30 per-user varies. 14-day trial. Multi-hub TCO stacks. Confirm on connecteam.com/pricing/ and help center.",
    plans: [
      {
        kind: "free",
        slug: "small-business",
        name: "Small Business Free",
        limits: { maxUsers: 10 },
        description:
          "Free for ≤10 users across hubs with limited essentials — good evaluation floor for tiny frontline teams.",
      },
      {
        kind: "flat-annual",
        slug: "basic",
        name: "Basic (per hub)",
        amount: 29,
        hasFreeTrial: true,
        trialDays: 14,
        limits: { includedUsers: 30 },
        description:
          "$29/mo billed annually per hub for first 30 users (monthly $35). Entry paid hub tier.",
      },
      {
        kind: "flat-annual",
        slug: "advanced",
        name: "Advanced (per hub)",
        amount: 49,
        highlighted: true,
        hasFreeTrial: true,
        trialDays: 14,
        limits: { includedUsers: 30 },
        description:
          "$49/mo billed annually per hub for first 30 users (monthly $59). Common mid-tier hub depth.",
      },
      {
        kind: "flat-annual",
        slug: "expert",
        name: "Expert (per hub)",
        amount: 99,
        hasFreeTrial: true,
        trialDays: 14,
        limits: { includedUsers: 30 },
        description:
          "$99/mo billed annually per hub for first 30 users (monthly $119). Deepest published hub tier before custom overages.",
      },
    ],
    featureOverrides: {
      "applicant-tracking": "limited",
      "career-site-job-boards": "not-supported",
      "interview-scheduling": "not-supported",
      "workforce-scheduling": "supported",
      "frontline-comms": "supported",
      "time-attendance": "supported",
      "gps-geofence-clockin": "supported",
      "sop-knowledge-base": "limited",
      "employee-training-paths": "supported",
      "lms-course-commerce": "not-supported",
      "hris-integrations": "supported",
      "analytics-reporting": "supported",
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
      { integrationSlug: "google-workspace", kind: "native" },
    ],
    limitations: [
      "Ops / Comms / HR & Skills hubs are sold separately — multi-hub TCO stacks quickly",
      "Free plan capped at ≤10 users with limited essentials",
      "Per-user rates above 30 vary by hub and need live confirmation (medium confidence)",
      "Not a deep ATS peer to Breezy for high-volume recruiting pipelines",
      "Not a course-commerce LMS like LearnWorlds",
    ],
    limitationKinds: [
      "requires-add-on",
      "plan-restriction",
      "other",
      "feature-unavailable",
      "feature-unavailable",
    ],
    scores: {
      "ease-of-use": 9,
      "hiring-workforce-fit": 9,
      "workflow-depth": 9,
      integrations: 8,
      "mobile-frontline": 10,
      analytics: 7,
      scalability: 8,
      "value-for-money": 7,
      "ai-capabilities": 6,
    },
    scoreRationales: {
      "ease-of-use":
        "Connecteam markets a mobile-first experience for deskless workers and managers — scheduling, chat, and tasks without desktop-only workflows. Score from first-party positioning, not lab testing.",
      "hiring-workforce-fit":
        "Primary job is frontline WFM (scheduling, comms, time, training hubs). Excellent cluster fit; light hiring features do not make it an ATS peer.",
      "workflow-depth":
        "Shift scheduling, open shifts, tasking, time clocks, and HR/skills training paths give deep frontline ops workflows when the relevant hubs are purchased.",
      integrations:
        "Published native + Zapier-style connectors support payroll/HRIS adjacent stacks; depth is strong for SMB–mid-market frontline, not every enterprise HRIS.",
      "mobile-frontline":
        "Category-leading mobile/frontline readiness is the product’s core promise — deskless workers are the primary surface.",
      analytics:
        "Manager reporting for schedules, attendance, and training is marketed; held at 7 vs specialist workforce analytics suites.",
      scalability:
        "Free → Basic/Advanced/Expert hub ladder with over-30 user expansion supports growth; multi-hub purchasing is the main complexity tax.",
      "value-for-money":
        "Free ≤10 and $29 hub floor look competitive, but buying multiple hubs (Ops+Comms+HR) raises real TCO — value score reflects that complexity. Affiliate economics excluded.",
      "ai-capabilities":
        "AI assistance is marketed lightly relative to ATS Intelligence or LMS AI packs — limited published depth versus category AI leaders.",
    },
    bestFor: [
      "Deskless / frontline teams needing scheduling + mobile communications",
      "Ops leaders who want hubs for time, tasks, and skills in one mobile app",
      "Small teams that can start on the ≤10-user free plan",
    ],
    notIdealFor: [
      "Recruiting-heavy orgs whose primary job is a full ATS pipeline",
      "Buyers who need transparent single-SKU pricing without multi-hub math",
      "Course creators selling public LMS commerce (LearnWorlds territory)",
    ],
    pros: [
      "Strong mobile-first frontline WFM fit",
      "Scheduling, comms, time, and training hubs",
      "Free plan for ≤10 users",
      "Clear Basic/Advanced/Expert hub tiers",
      "14-day trial",
    ],
    cons: [
      "Multi-hub pricing stacks TCO",
      "Over-30 per-user rates need live confirmation",
      "Not a peer ATS to Breezy",
      "AI depth is limited vs specialist AI recruiting/LMS tools",
      "Medium pricing confidence from help-center figures",
    ],
    keyFeatures: [
      "Workforce scheduling and open shifts",
      "Frontline chat and announcements",
      "Time & attendance with GPS/geofence clock-in",
      "HR & Skills training paths",
      "Ops tasking for deskless teams",
      "Hub-based Analytics reporting",
    ],
    whoShouldChoose:
      "Choose Connecteam when frontline scheduling, mobile communications, and deskless ops are the primary job — and you can model multi-hub TCO.",
    whoShouldConsiderAlternatives:
      "Compare Jibble if you only need time & attendance, Breezy if hiring/ATS is the job, and Trainual if SOP documentation is the core need.",
    alternativeSlugs: ["jibble", "breezy-hr", "trainual"],
    competitorSlugs: ["when-i-work", "homebase", "deputy", "jibble"],
    comparableSlugs: ["jibble"],
    useCaseSlugs: ["workforce-scheduling", "frontline-ops", "time-attendance"],
    businessSizeSlugs: ["micro", "small-business", "mid-market"],
    teamTypeSlugs: ["operations"],
    sourcesExtra: [
      {
        id: "connecteam-help-yearly",
        url: "https://help.connecteam.com/",
        title: "Connecteam Help — yearly plans",
        domains: ["pricing", "plans", "limits"],
      },
    ],
    catalogueSourceId: "aff-connecteam",
    affiliateUrl: "https://partners.connecteam.com/h77a37h9xngf",
  },

  {
    slug: "jibble",
    name: "Jibble",
    company: "Jibble Limited",
    website: "https://www.jibble.io",
    domain: "jibble.io",
    pricingUrl: "https://www.jibble.io/pricing",
    aliases: ["Jibble time tracking"],
    membershipRole: "primary",
    jobCluster: "time-attendance",
    softShortDescription:
      "Time & attendance with free forever unlimited users (GPS, face recognition, timesheets) — paid Premium ~$4.49 and Ultimate ~$7.99/user/mo annual.",
    shortDescription:
      "Jibble is a time & attendance platform for clock-in, timesheets, GPS/geofence, and face recognition. Free forever covers unlimited users with GPS, face recognition, timesheets, and Slack/Teams/QuickBooks integrations. Paid annual seats commonly cited as Premium ~$4.49/user/mo and Ultimate ~$7.99/user/mo (StackArbiter May 2026; medium confidence), with Enterprise custom. Free plan is the headline entry.",
    vendorPositioning:
      "Automatic time tracking for teams — accurate attendance with GPS and face recognition without expensive hardware.",
    pricingModel: "per-seat",
    hasFreePlan: true,
    hasFreeTrial: false,
    startingPriceMonthly: 4.49,
    startingPriceConfidence: "medium",
    pricingNotes:
      "Researched 2026-08-17. Free forever unlimited users confirmed first-party (GPS, face recognition, timesheets, Slack/Teams/QuickBooks). Paid annual commonly cited Premium ~$3.99–$4.49 and Ultimate ~$6.99–$7.99 per user/mo; prefer StackArbiter May 2026 cite Premium $4.49 / Ultimate $7.99 annual (medium confidence). Enterprise custom. Confirm live on jibble.io upgrade plans. Affiliate economics excluded.",
    pricingSummary:
      "Free forever unlimited users (GPS, face recognition, timesheets). Paid annual commonly Premium ~$4.49 / Ultimate ~$7.99 per user/mo (medium confidence). Enterprise custom. Confirm live.",
    plans: [
      {
        kind: "free",
        slug: "free",
        name: "Free",
        description:
          "Free forever unlimited users — GPS, face recognition, timesheets, Slack/Teams/QuickBooks.",
      },
      {
        kind: "per-seat-annual",
        slug: "premium",
        name: "Premium",
        amount: 4.49,
        highlighted: true,
        description:
          "~$4.49/user/month billed annually (medium confidence from widely cited 2026 figures; confirm live).",
      },
      {
        kind: "per-seat-annual",
        slug: "ultimate",
        name: "Ultimate",
        amount: 7.99,
        description:
          "~$7.99/user/month billed annually (medium confidence; confirm live).",
      },
      {
        kind: "contact-sales",
        slug: "enterprise",
        name: "Enterprise",
        description: "Enterprise — custom quote for advanced governance and scale.",
      },
    ],
    featureOverrides: {
      "applicant-tracking": "not-supported",
      "career-site-job-boards": "not-supported",
      "interview-scheduling": "not-supported",
      "workforce-scheduling": "limited",
      "frontline-comms": "limited",
      "time-attendance": "supported",
      "gps-geofence-clockin": "supported",
      "sop-knowledge-base": "not-supported",
      "employee-training-paths": "not-supported",
      "lms-course-commerce": "not-supported",
      "hris-integrations": "supported",
      "analytics-reporting": "supported",
      "ai-assistance": "not-supported",
    },
    aiLines: [
      "AI assistant: not-supported",
      "AI summaries: not-supported",
      "AI automation: limited",
      "AI recommendations: not-supported",
    ],
    integrations: [
      { integrationSlug: "slack", kind: "native" },
      { integrationSlug: "microsoft-teams", kind: "native" },
      { integrationSlug: "quickbooks", kind: "native" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    limitations: [
      "Paid tier dollar amounts are medium confidence — confirm live upgrade plans",
      "Not a full frontline WFM suite (scheduling/comms depth trails Connecteam)",
      "Not an ATS or SOP training platform",
      "AI assistance is not a published differentiator",
      "Project-management task time tracking is a different job — do not conflate",
    ],
    limitationKinds: [
      "other",
      "feature-unavailable",
      "feature-unavailable",
      "feature-unavailable",
      "other",
    ],
    scores: {
      "ease-of-use": 9,
      "hiring-workforce-fit": 8,
      "workflow-depth": 8,
      integrations: 7,
      "mobile-frontline": 9,
      analytics: 6,
      scalability: 7,
      "value-for-money": 9,
      "ai-capabilities": 4,
    },
    scoreRationales: {
      "ease-of-use":
        "Jibble markets simple mobile/kiosk clock-in with face recognition and GPS — low friction for hourly and field teams. Score from first-party positioning, not lab testing.",
      "hiring-workforce-fit":
        "Primary job is time & attendance. Strong cluster fit; light scheduling does not make it a Connecteam WFM peer or Breezy ATS peer.",
      "workflow-depth":
        "Timesheets, GPS/geofence, face recognition, and attendance policies deliver solid time-attendance workflows; deeper WFM hubs live elsewhere.",
      integrations:
        "Slack, Teams, QuickBooks plus Zapier-style cover common payroll/comms stacks; held at 7 vs broader WFM ecosystems.",
      "mobile-frontline":
        "GPS and face-recognition clock-in are built for mobile/field attendance — excellent frontline readiness for the time job.",
      analytics:
        "Attendance reporting is present; depth is adequate for SMB time tracking, not workforce analytics suites.",
      scalability:
        "Unlimited free users is a strong start; paid Premium/Ultimate/Enterprise ladder supports policy depth as teams grow.",
      "value-for-money":
        "Free forever unlimited users is an outstanding entry; paid seats ~$4.49–$7.99 annual (medium confidence) keep paid TCO accessible. Affiliate economics excluded.",
      "ai-capabilities":
        "No meaningful published AI assistant/recommendation packaging comparable to ATS Intelligence or LMS AI credits — scored low on this criterion.",
    },
    bestFor: [
      "Teams needing GPS/face-recognition time & attendance without per-user free-plan caps",
      "Hourly and field workers who clock in on mobile",
      "Buyers who want Slack/Teams/QuickBooks attendance sync",
    ],
    notIdealFor: [
      "Orgs whose primary job is full frontline scheduling + comms hubs",
      "Recruiting teams needing ATS pipelines",
      "Buyers who need AI-assisted SOP/training content platforms",
    ],
    pros: [
      "Free forever unlimited users",
      "GPS and face-recognition clock-in",
      "Slack / Teams / QuickBooks integrations",
      "Clear Premium / Ultimate paid ladder (confirm live)",
      "Strong time-attendance job fit",
    ],
    cons: [
      "Paid dollar amounts medium confidence",
      "Not full WFM scheduling/comms depth",
      "Weak AI packaging",
      "Not an ATS or SOP training tool",
      "Scheduling is limited vs Connecteam",
    ],
    keyFeatures: [
      "Time & attendance clock-in/out",
      "GPS / geofence clock-in",
      "Face recognition attendance",
      "Timesheets and attendance policies",
      "Slack, Teams, QuickBooks integrations",
      "Unlimited-user free plan",
    ],
    whoShouldChoose:
      "Choose Jibble when accurate time & attendance with GPS/face recognition — and a generous free plan — is the primary job.",
    whoShouldConsiderAlternatives:
      "Compare Connecteam for broader frontline WFM, Breezy for ATS hiring, and Trainual for SOP training documentation.",
    alternativeSlugs: ["connecteam", "breezy-hr", "trainual"],
    competitorSlugs: ["connecteam", "when-i-work", "homebase", "toggl"],
    comparableSlugs: ["connecteam"],
    useCaseSlugs: ["time-attendance", "frontline-ops"],
    businessSizeSlugs: ["micro", "small-business", "mid-market"],
    teamTypeSlugs: ["operations"],
    sourcesExtra: [
      {
        id: "jibble-product",
        url: "https://www.jibble.io/",
        title: "Jibble — Time tracking",
        domains: ["features", "product-positioning", "free-plan"],
      },
    ],
    catalogueSourceId: "aff-jibble",
    affiliateUrl: "https://affiliate.jibble.io/acciur08fa6h",
  },

  {
    slug: "trainual",
    name: "Trainual",
    company: "Trainual, Inc.",
    website: "https://trainual.com",
    domain: "trainual.com",
    pricingUrl: "https://trainual.com/pricing/",
    aliases: ["Trainual SOPs"],
    membershipRole: "primary",
    jobCluster: "sop-training",
    softShortDescription:
      "SOP and employee training platform with Core/Pro/Premium/Enterprise contact pricing — implementation fee $1,000; best suited ~25–1000 employees.",
    shortDescription:
      "Trainual is an SOP knowledge base and employee training-path platform for documenting how work gets done, onboarding roles, and tracking completion. Published tiers are Core / Pro / Premium / Enterprise with contact/demo pricing (no public seat dollars). FAQ cites a $1,000 implementation fee and best fit for roughly 25–1000 employees. Higher tiers add AI-assisted docs, e-sign, and SSO. Pricing confidence low–medium.",
    vendorPositioning:
      "The system of record for how your business runs — SOPs, training, and accountability in one place.",
    pricingModel: "custom",
    hasFreePlan: false,
    hasFreeTrial: false,
    // startingPriceMonthly omitted — contact/demo only
    startingPriceConfidence: "low",
    pricingNotes:
      "Researched 2026-08-17 from trainual.com/pricing/ (low–medium confidence). Core / Pro / Premium / Enterprise are contact/demo priced — no public seat dollars. FAQ: implementation fee $1,000; best suited ~25–1000 employees. AI-assisted docs, training paths, e-sign, SSO on higher tiers. Confirm via demo. Affiliate economics excluded.",
    pricingSummary:
      "Core / Pro / Premium / Enterprise — contact/demo pricing (no public seat dollars). Implementation fee $1,000 (FAQ). Best suited ~25–1000 employees. Confirm via demo.",
    plans: [
      {
        kind: "contact-sales",
        slug: "core",
        name: "Core",
        description: "Core — contact/demo pricing for SOP documentation entry.",
      },
      {
        kind: "contact-sales",
        slug: "pro",
        name: "Pro",
        highlighted: true,
        description: "Pro — contact/demo pricing with deeper training-path packaging.",
      },
      {
        kind: "contact-sales",
        slug: "premium",
        name: "Premium",
        description:
          "Premium — contact/demo pricing; AI-assisted docs, e-sign, SSO typically land on higher tiers.",
      },
      {
        kind: "contact-sales",
        slug: "enterprise",
        name: "Enterprise",
        description: "Enterprise — custom quote for advanced governance and scale.",
      },
    ],
    featureOverrides: {
      "applicant-tracking": "not-supported",
      "career-site-job-boards": "not-supported",
      "interview-scheduling": "not-supported",
      "workforce-scheduling": "not-supported",
      "frontline-comms": "limited",
      "time-attendance": "not-supported",
      "gps-geofence-clockin": "not-supported",
      "sop-knowledge-base": "supported",
      "employee-training-paths": "supported",
      "lms-course-commerce": "limited",
      "hris-integrations": "supported",
      "analytics-reporting": "supported",
      "ai-assistance": "higher-plan-only",
    },
    aiLines: [
      "AI assistant: higher-plan-only",
      "AI summaries: higher-plan-only",
      "AI automation: limited",
      "AI recommendations: higher-plan-only",
    ],
    integrations: [
      { integrationSlug: "slack", kind: "native" },
      { integrationSlug: "google-workspace", kind: "native" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    limitations: [
      "No public seat dollar amounts — buyers must demo/quote (hurts price transparency)",
      "$1,000 implementation fee (FAQ) raises entry TCO",
      "Best suited ~25–1000 employees — may be heavy for micro teams",
      "Not an ATS, time-clock, or frontline scheduling product",
      "AI assistance and SSO are higher-tier gated",
    ],
    limitationKinds: [
      "other",
      "requires-add-on",
      "plan-restriction",
      "feature-unavailable",
      "plan-restriction",
    ],
    scores: {
      "ease-of-use": 8,
      "hiring-workforce-fit": 9,
      "workflow-depth": 8,
      integrations: 7,
      "mobile-frontline": 6,
      analytics: 7,
      scalability: 8,
      "value-for-money": 5,
      "ai-capabilities": 7,
    },
    scoreRationales: {
      "ease-of-use":
        "Trainual positions SOP templates, role charts, and training paths for operators who need process documentation without building a custom LMS. Score from first-party packaging, not lab testing.",
      "hiring-workforce-fit":
        "Primary job is SOP knowledge base + employee training paths — strong sop-training cluster fit. Not scored as an ATS or time-clock peer.",
      "workflow-depth":
        "Playbooks, subjects, tests, and completion tracking give solid training-path depth; e-sign and advanced governance land on higher tiers.",
      integrations:
        "Slack/Google Workspace/Zapier-style support process distribution; not a full HRIS replacement.",
      "mobile-frontline":
        "Training content is consumable on mobile, but Trainual is not a deskless WFM/comms product — scored moderate for frontline readiness.",
      analytics:
        "Completion and training reporting are marketed for managers; held at 7 vs deep L&D analytics suites.",
      scalability:
        "FAQ best-fit 25–1000 employees plus Core→Enterprise ladder supports mid-market growth; micro teams may be underserved.",
      "value-for-money":
        "Opaque contact pricing plus a $1,000 implementation fee hurt transparency and entry value versus published ATS/WFM floors — capability is strong, price clarity is weak. Affiliate economics excluded.",
      "ai-capabilities":
        "AI-assisted documentation is published on higher tiers — useful for SOP drafting with plan gates rather than free unlimited AI.",
    },
    bestFor: [
      "Growing companies (roughly 25–1000 employees) documenting SOPs and role training",
      "Ops leaders who need searchable playbooks with completion tracking",
      "Teams that can engage sales for demos and accept implementation onboarding",
    ],
    notIdealFor: [
      "Micro teams that need transparent self-serve seat pricing",
      "Buyers whose primary job is ATS hiring or GPS time clocks",
      "Course creators selling public LMS commerce (LearnWorlds)",
    ],
    pros: [
      "Strong SOP knowledge-base and training-path focus",
      "Role-based onboarding and completion tracking",
      "AI-assisted docs on higher tiers",
      "Clear Core/Pro/Premium/Enterprise ladder",
      "Integrations for process distribution",
    ],
    cons: [
      "No public seat dollars — demo/quote only",
      "$1,000 implementation fee",
      "Value score hurt by pricing opacity",
      "Not ATS / WFM / time-clock",
      "AI and SSO are higher-plan gated",
    ],
    keyFeatures: [
      "SOP / knowledge base documentation",
      "Employee training paths and tests",
      "Role charts and onboarding content",
      "Completion tracking and reporting",
      "AI-assisted documentation (higher tiers)",
      "E-sign and SSO on higher tiers",
    ],
    whoShouldChoose:
      "Choose Trainual when documenting SOPs and running employee training paths is the primary job — and you can work through demo/quote pricing.",
    whoShouldConsiderAlternatives:
      "Compare LearnWorlds (marketing-primary LMS) for course commerce, Connecteam for frontline training-lite hubs, and Breezy if hiring/ATS is the actual job.",
    alternativeSlugs: ["learnworlds", "connecteam", "breezy-hr"],
    competitorSlugs: ["process-street", "sweetprocess", "learnworlds", "guru"],
    comparableSlugs: ["learnworlds"],
    useCaseSlugs: ["sop-documentation", "employee-training"],
    businessSizeSlugs: ["small-business", "mid-market", "enterprise"],
    teamTypeSlugs: ["operations"],
    sourcesExtra: [
      {
        id: "trainual-pricing",
        url: "https://trainual.com/pricing/",
        title: "Trainual Pricing",
        domains: ["pricing", "plans", "limits"],
      },
    ],
    catalogueSourceId: "aff-trainual",
    affiliateUrl: "https://start.trainual.com/8kshk4tc5bv4",
  },
];

export const PRODUCTS = COMPACT.map(expandHrProduct);

/**
 * Comparison pairs: Wave-1 products sit in different job clusters.
 * Do NOT manufacture cross-cluster pages (e.g. breezy-hr vs jibble).
 * breezy-hr vs freshteam skipped — freshteam not onboarded in this wave.
 * Prefer 0 forced pairs; approvedHrPair helper exists for future same-cluster peers.
 */
export const COMPARISON_PAIRS = [];
