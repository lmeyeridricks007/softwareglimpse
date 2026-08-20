/**
 * Project Management Wave-1 affiliate products (compact).
 * monday, Hive, Office Timeline, Foxit, Getscreen.me, WebCatalog.
 *
 * Pricing floors grounded 2026-08-17 from first-party / official pages.
 * Affiliate economics never enter scores. handsOnTesting=false.
 * NOTE: monday-sales-crm is CRM — this entity is monday (Work Management).
 */
import { expandPmProduct } from "./pm-compact-expand.mjs";

const COMPACT = [
  {
    slug: "monday",
    name: "monday.com",
    company: "monday.com Ltd.",
    website: "https://monday.com",
    domain: "monday.com",
    pricingUrl: "https://monday.com/pricing",
    aliases: ["monday Work Management", "monday Work OS", "monday.com Work Management"],
    membershipRole: "primary",
    jobCluster: "work-os",
    softShortDescription:
      "Work OS / work management platform with boards, timelines, automations and AI credits — Basic from $9/seat/mo annual (3-seat minimum).",
    shortDescription:
      "monday.com Work Management is a work OS for boards, timelines/Gantt, workload views, automations, docs and dashboards. Free covers ≤2 seats and ≤3 boards. Paid plans start at a 3-seat minimum: Basic $9, Standard $12, Pro $19 per seat/month on annual billing, each bundling AI credits (~1k/2k/3k; roughly +$10/$20/$30), with Enterprise custom. 14-day Pro trial. Yearly ~18% off vs monthly. Distinct from monday sales CRM.",
    vendorPositioning:
      "A flexible Work OS to run projects, processes and everyday work — boards, automations and AI assistants in one platform.",
    pricingModel: "hybrid",
    hasFreePlan: true,
    hasFreeTrial: true,
    trialDays: 14,
    startingPriceMonthly: 9,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-17 from monday.com/pricing (Work Management). Free $0 (≤2 seats, ≤3 boards). Paid 3-seat minimum. Annual: Basic $9/seat/mo + ~1k AI credits (~$10), Standard $12 + ~2k credits (~$20), Pro $19 + ~3k credits (~$30), Enterprise custom. 14-day Pro trial. Yearly ~18% off. Confirm live AI credit packaging.",
    pricingSummary:
      "Free: ≤2 seats, ≤3 boards. Paid 3-seat minimum — Basic $9, Standard $12, Pro $19 per seat/mo annual (+ AI credit bundles ~$10/$20/$30). Enterprise custom. 14-day Pro trial. Confirm live.",
    plans: [
      {
        kind: "free",
        slug: "free",
        name: "Free",
        limits: { maxSeats: 2, maxBoards: 3 },
        description: "Free: up to 2 seats and 3 boards.",
      },
      {
        kind: "per-seat-annual",
        slug: "basic",
        name: "Basic",
        amount: 9,
        minimumSeats: 3,
        description:
          "$9/seat/month billed annually (3-seat minimum) plus ~1,000 AI credits (~$10). Entry Work Management seat.",
      },
      {
        kind: "per-seat-annual",
        slug: "standard",
        name: "Standard",
        amount: 12,
        minimumSeats: 3,
        highlighted: true,
        description:
          "$12/seat/month billed annually (3-seat minimum) plus ~2,000 AI credits (~$20). Timeline and guest access depth typically land here.",
      },
      {
        kind: "per-seat-annual",
        slug: "pro",
        name: "Pro",
        amount: 19,
        minimumSeats: 3,
        hasFreeTrial: true,
        trialDays: 14,
        description:
          "$19/seat/month billed annually (3-seat minimum) plus ~3,000 AI credits (~$30). Time tracking, chart views and private boards on Pro.",
      },
      {
        kind: "contact-sales",
        slug: "enterprise",
        name: "Enterprise",
        description: "Enterprise — custom quote for advanced governance, scale and security.",
      },
    ],
    featureOverrides: {
      "task-boards": "supported",
      "timeline-gantt": "supported",
      "workload-resources": "supported",
      "automations-workflows": "supported",
      "time-tracking": "higher-plan-only",
      "docs-collaboration": "supported",
      "integrations-ecosystem": "supported",
      "reporting-dashboards": "supported",
      "ai-assistance": "add-on",
      "document-pdf": "not-supported",
      "remote-access": "not-supported",
      "desktop-workspace": "not-supported",
    },
    aiLines: [
      "AI assistant: add-on",
      "AI summaries: add-on",
      "AI automation: supported",
      "AI recommendations: add-on",
    ],
    integrations: [
      { integrationSlug: "slack", kind: "native" },
      { integrationSlug: "microsoft-teams", kind: "native" },
      { integrationSlug: "google-workspace", kind: "native" },
      { integrationSlug: "salesforce", kind: "native" },
      { integrationSlug: "zapier", kind: "zapier-style" },
      { integrationSlug: "jira", kind: "native" },
    ],
    limitations: [
      "Paid plans enforce a 3-seat minimum — solo/micro teams pay for unused seats",
      "AI credits are bundled/paid extras that raise effective TCO beyond the seat floor",
      "Free plan caps seats (2) and boards (3)",
      "Time tracking and some advanced views are Pro-gated",
      "Not a PDF editor, remote desktop, or desktop app shell",
      "Distinct from monday sales CRM — do not conflate Work Management with CRM pipeline",
    ],
    limitationKinds: [
      "plan-restriction",
      "requires-add-on",
      "plan-restriction",
      "plan-restriction",
      "feature-unavailable",
      "other",
    ],
    scores: {
      "ease-of-use": 9,
      "work-planning": 9,
      "automation-workflows": 9,
      collaboration: 9,
      integrations: 9,
      reporting: 8,
      scalability: 9,
      "value-for-money": 7,
      "ai-capabilities": 8,
    },
    scoreRationales: {
      "ease-of-use":
        "monday.com is widely positioned for fast board setup with templates and visual columns; non-technical ops owners can run work without a heavy PM tool learning curve. Score reflects first-party packaging, not hands-on lab testing.",
      "work-planning":
        "Boards, timeline/Gantt, dependencies and workload views give monday the strongest published work-planning envelope in this Wave-1 set — category leader for Work OS peers.",
      "automation-workflows":
        "Native automations and integrations recipes are a first-party strength across paid plans; action caps still apply by tier. Score grounded in product breadth, not lab verification of every recipe.",
      collaboration:
        "Docs, updates, mentions and guest collaboration are core Work Management surfaces — strong for cross-functional teams.",
      integrations:
        "Broad native connectors (Slack, Teams, Google Workspace, Salesforce, Jira) plus Zapier-style automation — top-tier ecosystem for a work OS.",
      reporting:
        "Dashboards and chart views support manager visibility; deepest charting lands on higher plans. Held at 8 vs absolute best-in-class BI suites.",
      scalability:
        "Clear Free → Basic/Standard/Pro → Enterprise path with seat growth and governance on Enterprise — strong scale story for mid-market and up.",
      "value-for-money":
        "Basic $9/seat annual looks competitive, but the 3-seat minimum plus AI credit bundles raise real entry TCO. Capability justifies mid-market spend; micro teams may prefer Hive’s lower floor. Affiliate economics excluded.",
      "ai-capabilities":
        "AI assistant and credit packs are marketed across Work Management, but credits are paid/bundled rather than unlimited — strong capability with packaging friction.",
    },
    bestFor: [
      "Teams standardising on one Work OS for projects, ops and cross-functional work",
      "Buyers who need boards + timeline + automations with mainstream brand recognition",
      "Mid-market orgs that can accept a 3-seat paid minimum and AI credit packaging",
    ],
    notIdealFor: [
      "Solo operators who cannot use three paid seats",
      "Buyers whose only job is PowerPoint-native executive Gantt decks (Office Timeline)",
      "Teams needing PDF editing, remote desktop or desktop app shells as the primary purchase",
    ],
    pros: [
      "Category-leading Work OS breadth — boards, timeline, workload, automations",
      "Strong integrations ecosystem",
      "Approachable free tier for tiny teams",
      "Clear Standard/Pro depth ladder with 14-day Pro trial",
      "AI assistance marketed with published credit bundles",
    ],
    cons: [
      "3-seat paid minimum raises micro-team entry cost",
      "AI credits add to seat TCO",
      "Some advanced views/time tracking are Pro-gated",
      "Not a specialist PDF/remote/desktop tool",
      "Easy to confuse with monday sales CRM (separate entity)",
    ],
    keyFeatures: [
      "Boards, tables and kanban-style work views",
      "Timeline / Gantt and workload views",
      "Automations and integrations",
      "Docs and team collaboration",
      "Dashboards and reporting",
      "AI credits on paid plans",
    ],
    whoShouldChoose:
      "Choose monday.com Work Management when you want a mainstream Work OS for boards, timelines, automations and cross-team collaboration — and can accept the 3-seat paid floor plus AI credit packaging.",
    whoShouldConsiderAlternatives:
      "Compare Hive for a lower paid entry and generous free seats, Office Timeline for PowerPoint-native Gantt decks, and keep monday sales CRM separate if the job is sales pipeline CRM.",
    alternativeSlugs: ["hive", "office-timeline"],
    competitorSlugs: ["hive", "office-timeline", "asana", "clickup", "monday-sales-crm"],
    comparableSlugs: ["hive", "office-timeline"],
    useCaseSlugs: ["work-management", "project-tracking", "team-collaboration-work", "resource-planning"],
    businessSizeSlugs: ["small-business", "mid-market", "enterprise"],
    teamTypeSlugs: ["operations", "project-managers", "marketing"],
    sourcesExtra: [
      {
        id: "monday-work-management",
        url: "https://monday.com/work-management",
        title: "monday.com Work Management",
        domains: ["features", "product-positioning"],
      },
    ],
  },

  {
    slug: "hive",
    name: "Hive",
    company: "Hive Technology, Inc.",
    website: "https://hive.com",
    domain: "hive.com",
    pricingUrl: "https://hive.com/pricing",
    aliases: [],
    membershipRole: "primary",
    jobCluster: "work-os",
    softShortDescription:
      "Work management platform with free plan (≤10 members) and Teams from $12/user/mo annual — strong monday.com peer.",
    shortDescription:
      "Hive is a work management platform for projects, messaging, proofs and AI-assisted workflows. Free covers ≤10 members with storage and AI credit caps. Starter is $5/user/mo annual (≤10 members/projects); Teams is $12/user/mo annual unlimited; Enterprise is contact sales. Flexible add-ons ~$5 each. 14-day trial.",
    vendorPositioning:
      "All-in-one work management — projects, chat, proofing and AI so teams ship faster without tool sprawl.",
    pricingModel: "freemium",
    hasFreePlan: true,
    hasFreeTrial: true,
    trialDays: 14,
    startingPriceMonthly: 5,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-17 from hive.com/pricing. Free $0 (≤10 members, 200MB, 1k AI credits). Starter $5/user/mo annual (≤10 members/projects). Teams $12/user/mo annual unlimited. Enterprise contact. Flexible add-ons ~$5 each. 14-day trial. Confirm live add-on catalogue.",
    pricingSummary:
      "Free ≤10 members. Starter $5/user/mo annual (≤10), Teams $12/user/mo annual unlimited, Enterprise contact. Add-ons ~$5. 14-day trial. Confirm live.",
    plans: [
      {
        kind: "free",
        slug: "free",
        name: "Free",
        limits: { maxMembers: 10, storageMb: 200, aiCredits: 1000 },
        description: "Free: up to 10 members, 200MB storage, 1,000 AI credits.",
      },
      {
        kind: "per-seat-annual",
        slug: "starter",
        name: "Starter",
        amount: 5,
        maximumSeats: 10,
        description:
          "$5/user/month billed annually — capped at ≤10 members/projects. Entry paid rung above Free.",
      },
      {
        kind: "per-seat-annual",
        slug: "teams",
        name: "Teams",
        amount: 12,
        highlighted: true,
        description:
          "$12/user/month billed annually — unlimited members/projects for growing work-management teams.",
      },
      {
        kind: "contact-sales",
        slug: "enterprise",
        name: "Enterprise",
        description: "Enterprise — contact sales for governance, security and scale packaging.",
      },
    ],
    featureOverrides: {
      "task-boards": "supported",
      "timeline-gantt": "supported",
      "workload-resources": "supported",
      "automations-workflows": "supported",
      "time-tracking": "supported",
      "docs-collaboration": "supported",
      "integrations-ecosystem": "supported",
      "reporting-dashboards": "supported",
      "ai-assistance": "supported",
      "document-pdf": "not-supported",
      "remote-access": "not-supported",
      "desktop-workspace": "not-supported",
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
      { integrationSlug: "microsoft-teams", kind: "native" },
      { integrationSlug: "salesforce", kind: "native" },
      { integrationSlug: "zapier", kind: "zapier-style" },
    ],
    limitations: [
      "Free and Starter cap members/projects at 10 — growth forces Teams",
      "Free storage (200MB) and AI credits (1k) are tight for active teams",
      "Flexible add-ons (~$5) can raise TCO beyond the Teams floor",
      "Brand recognition trails monday.com for some buyers",
      "Not a PDF / remote-desktop / desktop-workspace specialist",
    ],
    limitationKinds: [
      "plan-restriction",
      "plan-restriction",
      "requires-add-on",
      "other",
      "feature-unavailable",
    ],
    scores: {
      "ease-of-use": 8,
      "work-planning": 8,
      "automation-workflows": 8,
      collaboration: 8,
      integrations: 7,
      reporting: 7,
      scalability: 7,
      "value-for-money": 8,
      "ai-capabilities": 7,
    },
    scoreRationales: {
      "ease-of-use":
        "Hive packages projects, chat and proofing in one workspace with a generous free rung — approachable for SMB teams. Slightly below monday on mainstream onboarding familiarity.",
      "work-planning":
        "Boards, Gantt/timeline and resourcing cover core work-planning jobs as a credible monday peer, without quite matching monday’s published breadth narrative.",
      "automation-workflows":
        "Workflows and automations are first-party strengths on paid plans; add-ons may deepen specific actions. Score from documentation, not lab recipe coverage.",
      collaboration:
        "Messaging, proofs and shared project spaces support collaboration well for creative/ops teams.",
      integrations:
        "Solid Slack/Google/Teams/Salesforce plus Zapier path — credible but not as heavily marketed as monday’s 200+ narrative.",
      reporting:
        "Dashboards and project reporting cover manager needs; not positioned as a BI platform.",
      scalability:
        "Teams unlimited seats help growth, but Enterprise is quote-led and Starter caps at 10 — adequate mid-market path.",
      "value-for-money":
        "Free ≤10 members and Starter at $5/user annual undercut monday’s 3-seat $9 floor for many SMBs — strong value posture. Affiliate economics excluded.",
      "ai-capabilities":
        "AI credits on Free and AI features on paid plans are marketed; credit caps keep the score below unlimited-AI narratives.",
    },
    bestFor: [
      "SMB and mid-market teams wanting Work OS depth with a lower paid entry than monday",
      "Teams that can start on Free (≤10) before upgrading to Teams",
      "Buyers comparing monday.com as a primary Work OS peer",
    ],
    notIdealFor: [
      "Enterprises that need monday-class brand default and deepest published ecosystem claims",
      "Buyers whose only job is PowerPoint timeline decks",
      "PDF / remote-access / desktop-shell primary purchases",
    ],
    pros: [
      "Generous Free plan (≤10 members)",
      "Starter $5 and Teams $12 annual floors are accessible",
      "Projects, chat, proofing and AI in one stack",
      "Credible monday.com Work OS peer",
      "14-day trial reduces buy risk",
    ],
    cons: [
      "Starter/Free caps push growing teams to Teams quickly",
      "Add-ons can inflate TCO",
      "Integrations breadth trails monday’s marketing narrative",
      "Not a specialist timeline-presentation or PDF tool",
      "Enterprise packaging is contact-sales",
    ],
    keyFeatures: [
      "Project boards and Gantt/timeline",
      "Team messaging and proofing",
      "Automations and workflows",
      "Time tracking and resourcing",
      "AI assistance with credit packs",
      "Free / Starter / Teams / Enterprise ladder",
    ],
    whoShouldChoose:
      "Choose Hive when you want a full work-management platform with a friendlier free/paid entry than monday.com’s 3-seat floor — especially for teams under ~10 seats starting out.",
    whoShouldConsiderAlternatives:
      "Compare monday.com for mainstream Work OS brand and ecosystem depth, Office Timeline for PowerPoint Gantt specialists, and adjacent Foxit/Getscreen/WebCatalog only when those specialist jobs dominate.",
    alternativeSlugs: ["monday", "office-timeline"],
    competitorSlugs: ["monday", "office-timeline", "asana", "clickup", "wrike"],
    comparableSlugs: ["monday", "office-timeline"],
    useCaseSlugs: ["work-management", "project-tracking", "team-collaboration-work"],
    businessSizeSlugs: ["micro", "small-business", "mid-market"],
    teamTypeSlugs: ["operations", "project-managers", "marketing"],
  },

  {
    slug: "office-timeline",
    name: "Office Timeline",
    company: "Office Timeline (Lucen)",
    website: "https://www.officetimeline.com",
    domain: "officetimeline.com",
    pricingUrl: "https://www.officetimeline.com/pricing",
    aliases: ["Lucen Timeline", "Office Timeline Lucen", "Lucen"],
    membershipRole: "primary",
    jobCluster: "timeline",
    softShortDescription:
      "PowerPoint-native timeline / Gantt specialist (now Lucen Timeline) — Free add-in; Lite from $9/user/mo annual.",
    shortDescription:
      "Office Timeline (now Lucen Timeline) is a PowerPoint-native timeline and Gantt presentation tool for executive-ready schedules — not a full work OS. Free add-in available; Lite $9, Plus $17, Expert $21 per user/month on annual billing. Strong for timeline reporting; weak as a monday/Hive peer for boards, automations and workload.",
    vendorPositioning:
      "Build stunning project timelines and Gantt charts in PowerPoint — Lucen Timeline for executive-ready visuals.",
    pricingModel: "freemium",
    hasFreePlan: true,
    hasFreeTrial: true,
    startingPriceMonthly: 9,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-17 from officetimeline.com/pricing (Lucen branding). Free add-in. Lite $9/user/mo annual, Plus $17, Expert $21. PowerPoint-native timeline/Gantt. Confirm live Lucen rename packaging and trial terms.",
    pricingSummary:
      "Free PowerPoint add-in. Lite $9, Plus $17, Expert $21 per user/mo annual. Specialist timeline tool — not a full work OS. Confirm live.",
    plans: [
      {
        kind: "free",
        slug: "free",
        name: "Free",
        description: "Free PowerPoint add-in for basic timelines.",
      },
      {
        kind: "per-seat-annual",
        slug: "lite",
        name: "Lite",
        amount: 9,
        highlighted: true,
        description: "$9/user/month billed annually — entry paid Lucen / Office Timeline seat.",
      },
      {
        kind: "per-seat-annual",
        slug: "plus",
        name: "Plus",
        amount: 17,
        description: "$17/user/month billed annually — deeper templates and styling.",
      },
      {
        kind: "per-seat-annual",
        slug: "expert",
        name: "Expert",
        amount: 21,
        description: "$21/user/month billed annually — top published timeline/Gantt presentation tier.",
      },
    ],
    featureOverrides: {
      "task-boards": "limited",
      "timeline-gantt": "supported",
      "workload-resources": "not-supported",
      "automations-workflows": "not-supported",
      "time-tracking": "not-supported",
      "docs-collaboration": "limited",
      "integrations-ecosystem": "limited",
      "reporting-dashboards": "supported",
      "ai-assistance": "not-supported",
      "document-pdf": "not-supported",
      "remote-access": "not-supported",
      "desktop-workspace": "not-supported",
    },
    aiLines: [
      "AI assistant: not-supported",
      "AI summaries: not-supported",
      "AI automation: not-supported",
      "AI recommendations: not-supported",
    ],
    integrations: [
      { integrationSlug: "microsoft-powerpoint", kind: "native", notes: "PowerPoint-native add-in / Lucen Timeline" },
      { integrationSlug: "microsoft-project", kind: "native" },
      { integrationSlug: "excel", kind: "native" },
    ],
    limitations: [
      "Not a work OS — no monday/Hive-class boards, automations or workload management",
      "Centre of gravity is PowerPoint presentation timelines, not live team task execution",
      "Automations and AI assistance are not the product job",
      "Collaboration is presentation-centric rather than multiplayer work tracking",
      "Rebrand to Lucen Timeline may change packaging — confirm live",
    ],
    limitationKinds: [
      "feature-unavailable",
      "other",
      "feature-unavailable",
      "other",
      "other",
    ],
    scores: {
      "ease-of-use": 8,
      "work-planning": 9,
      "automation-workflows": 4,
      collaboration: 6,
      integrations: 6,
      reporting: 8,
      scalability: 5,
      "value-for-money": 8,
      "ai-capabilities": 3,
    },
    scoreRationales: {
      "ease-of-use":
        "PowerPoint-native workflow is familiar for PMs and PMO staff who already live in Office — fast for timeline authors, less so for teams wanting a cloud work OS.",
      "work-planning":
        "Timeline/Gantt presentation depth is the specialist strength — scored high for that job, not as a full multi-view work OS. Landscape specialist treatment applies on best pages.",
      "automation-workflows":
        "Not an automation platform — low score by design for a timeline specialist, not a product failure against monday/Hive.",
      collaboration:
        "Sharing polished decks supports stakeholder reporting; multiplayer task collaboration trails work OS peers.",
      integrations:
        "Strong Microsoft Office / Project / Excel path; broader SaaS ecosystem is limited vs monday/Hive.",
      reporting:
        "Executive-ready Gantt/timeline visuals are the reporting job — strong for stakeholder presentations.",
      scalability:
        "Per-user presentation seats scale for PMO authors, not for org-wide work execution platforms.",
      "value-for-money":
        "Free add-in plus Lite $9 annual is fair for specialist timeline authors. Affiliate economics excluded.",
      "ai-capabilities":
        "AI is not a published centre of gravity — low score reflects product focus, not a demerit vs AI work OS tools.",
    },
    bestFor: [
      "PMO and project leads who need PowerPoint-native executive timelines/Gantt",
      "Buyers comparing monday/Hive only for presentation output — not full work tracking",
      "Teams already standardised on Microsoft Office",
    ],
    notIdealFor: [
      "Teams needing a full Work OS with boards, automations and workload",
      "Buyers whose primary job is PDF editing or remote access",
      "Organisations wanting AI agents for work planning",
    ],
    pros: [
      "Best-in-batch timeline/Gantt presentation specialist",
      "PowerPoint-native authoring",
      "Free add-in entry",
      "Clear Lite/Plus/Expert paid ladder",
      "Strong for executive stakeholder reporting",
    ],
    cons: [
      "Not a work OS peer for live task execution",
      "Weak automations and AI",
      "Limited multiplayer collaboration vs monday/Hive",
      "Microsoft-centric integrations",
      "Lucen rebrand packaging should be reconfirmed live",
    ],
    keyFeatures: [
      "PowerPoint-native timelines and Gantt charts",
      "Executive presentation templates",
      "Microsoft Project / Excel import paths",
      "Free add-in + Lite/Plus/Expert seats",
      "Lucen Timeline branding",
    ],
    whoShouldChoose:
      "Choose Office Timeline (Lucen Timeline) when PowerPoint-native executive timelines and Gantt decks are the primary job — not when you need a full work OS.",
    whoShouldConsiderAlternatives:
      "Compare monday.com or Hive for live work management; keep Office Timeline as a landscape specialist for presentation timelines.",
    alternativeSlugs: ["monday", "hive"],
    competitorSlugs: ["monday", "hive", "microsoft-project"],
    comparableSlugs: ["monday", "hive"],
    useCaseSlugs: ["timeline-reporting", "project-tracking"],
    businessSizeSlugs: ["small-business", "mid-market", "enterprise"],
    teamTypeSlugs: ["project-managers", "operations"],
  },

  {
    slug: "foxit",
    name: "Foxit",
    company: "Foxit Software Inc.",
    website: "https://www.foxit.com",
    domain: "foxit.com",
    pricingUrl: "https://www.foxit.com/pdf-editor/pricing/",
    aliases: ["Foxit PDF Editor", "Foxit PhantomPDF"],
    membershipRole: "adjacent",
    jobCluster: "document-pdf",
    adjacentNote:
      "Adjacent PDF / document productivity — not a work-OS peer for undifferentiated best ranks.",
    softShortDescription:
      "PDF Editor adjacent productivity tool — PDF Editor ~$129.99/user/year (~$10.83/mo); free Reader.",
    shortDescription:
      "Foxit is a PDF editor and document productivity suite (PDF Editor / PDF Editor+) with a free Reader. Published list pricing centres on ~$129.99/user/year for PDF Editor (~$10.83/mo) and ~$159.99/user/year for PDF Editor+. Trial available. Adjacent to project management — strong on document-pdf, weak on work-planning boards/Gantt as a primary job.",
    vendorPositioning:
      "Powerful PDF editor for business — create, edit, convert, sign and protect documents without Adobe-only lock-in.",
    pricingModel: "subscription",
    hasFreePlan: true,
    hasFreeTrial: true,
    startingPriceMonthly: 11,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-17 from foxit.com/pdf-editor/pricing. PDF Editor ~$129.99/user/year (~$10.83/mo); PDF Editor+ ~$159.99/user/year. Free Reader. Trial available. Recorded as annual per-licence with monthly-equivalent startingPriceMonthly ~11. Confirm live regional promotions.",
    pricingSummary:
      "Free Reader. PDF Editor ~$129.99/user/year (~$10.83/mo); PDF Editor+ ~$159.99/user/year. Trial available. Annual per-licence — confirm live.",
    plans: [
      {
        kind: "free",
        slug: "reader",
        name: "Reader",
        description: "Free Foxit Reader for viewing PDFs.",
      },
      {
        kind: "per-seat-annual",
        slug: "pdf-editor",
        name: "PDF Editor",
        amount: 10.83,
        highlighted: true,
        description:
          "~$129.99/user/year (~$10.83/mo monthly-equivalent on annual billing) — core PDF edit/convert/sign licence.",
      },
      {
        kind: "per-seat-annual",
        slug: "pdf-editor-plus",
        name: "PDF Editor+",
        amount: 13.33,
        description:
          "~$159.99/user/year (~$13.33/mo monthly-equivalent) — PDF Editor+ with deeper document productivity packaging.",
      },
    ],
    featureOverrides: {
      "task-boards": "not-supported",
      "timeline-gantt": "not-supported",
      "workload-resources": "not-supported",
      "automations-workflows": "limited",
      "time-tracking": "not-supported",
      "docs-collaboration": "limited",
      "integrations-ecosystem": "limited",
      "reporting-dashboards": "not-supported",
      "ai-assistance": "limited",
      "document-pdf": "supported",
      "remote-access": "not-supported",
      "desktop-workspace": "not-supported",
    },
    aiLines: [
      "AI assistant: limited",
      "AI other: limited",
      "AI automation: not-supported",
      "AI recommendations: limited",
    ],
    integrations: [
      { integrationSlug: "microsoft-365", kind: "native" },
      { integrationSlug: "google-drive", kind: "native" },
      { integrationSlug: "dropbox", kind: "native" },
      { integrationSlug: "sharepoint", kind: "native" },
    ],
    limitations: [
      "Adjacent tool — not a project management or work OS platform",
      "No task boards, Gantt, workload or PM dashboards as the primary product",
      "Scored low on work-planning by design for category fairness",
      "AI document features are limited vs dedicated AI writing suites",
      "Enterprise volume licensing may differ from published list cards",
    ],
    limitationKinds: [
      "other",
      "feature-unavailable",
      "other",
      "other",
      "other",
    ],
    scores: {
      "ease-of-use": 8,
      "work-planning": 2,
      "automation-workflows": 3,
      collaboration: 5,
      integrations: 7,
      reporting: 4,
      scalability: 8,
      "value-for-money": 8,
      "ai-capabilities": 6,
    },
    scoreRationales: {
      "ease-of-use":
        "PDF Editor is familiar desktop/cloud document software for business users — approachable for edit/convert/sign jobs.",
      "work-planning":
        "Not a work-planning product — intentionally low so adjacent PDF tools are not ranked as monday/Hive peers.",
      "automation-workflows":
        "Limited batch/document automation only — not a work OS automation engine.",
      collaboration:
        "Shared review/sign workflows exist; not multiplayer project collaboration.",
      integrations:
        "Solid Microsoft 365 / Drive / Dropbox / SharePoint document stack connectors.",
      reporting:
        "Not a PM reporting product — low by design.",
      scalability:
        "Per-licence annual seats scale cleanly for document workers across orgs.",
      "value-for-money":
        "Free Reader plus ~$130/user/year Editor is a clear Adobe-alternative value story. Affiliate economics excluded.",
      "ai-capabilities":
        "Limited AI document assistance marketed — moderate for PDF-adjacent help, not work OS AI agents.",
    },
    bestFor: [
      "Teams needing PDF edit/convert/sign as adjacent productivity",
      "Buyers comparing Adobe Acrobat on annual per-licence cost",
      "Stacks that already own a separate work OS",
    ],
    notIdealFor: [
      "Buyers whose primary job is work OS boards, Gantt and automations",
      "Teams needing remote desktop or desktop app shells",
      "Anyone expecting Foxit to replace monday/Hive",
    ],
    pros: [
      "Strong document-pdf specialist in this category",
      "Clear annual per-licence pricing",
      "Free Reader entry",
      "Microsoft 365 / cloud storage connectors",
      "Fair Adobe-alternative value posture",
    ],
    cons: [
      "Not a work OS — weak work-planning by design",
      "No PM dashboards or Gantt",
      "Collaboration is document-centric",
      "AI depth is limited",
      "Should not be ranked against monday/Hive as peers",
    ],
    keyFeatures: [
      "PDF create, edit, convert",
      "eSign and protect workflows",
      "Free Reader",
      "PDF Editor / PDF Editor+ annual licences",
      "Microsoft 365 and cloud storage connectors",
    ],
    whoShouldChoose:
      "Choose Foxit when document/PDF productivity is the job — as adjacent tooling beside a work OS, not instead of one.",
    whoShouldConsiderAlternatives:
      "Compare monday/Hive for work management; Getscreen.me for remote access; WebCatalog for desktop app workspaces.",
    alternativeSlugs: ["monday", "hive", "getscreen-me", "webcatalog"],
    competitorSlugs: ["adobe-acrobat", "monday", "hive"],
    comparableSlugs: ["getscreen-me", "webcatalog"],
    useCaseSlugs: ["document-productivity"],
    businessSizeSlugs: ["micro", "small-business", "mid-market", "enterprise"],
    teamTypeSlugs: ["operations", "legal", "admin"],
  },

  {
    slug: "getscreen-me",
    name: "Getscreen.me",
    company: "Getscreen.me",
    website: "https://getscreen.me",
    domain: "getscreen.me",
    pricingUrl: "https://getscreen.me/en/plan/",
    aliases: ["Getscreen", "getscreen.me"],
    membershipRole: "adjacent",
    jobCluster: "remote-access",
    adjacentNote:
      "Adjacent remote access / screen share — not a work-OS peer for undifferentiated best ranks.",
    softShortDescription:
      "Remote desktop / screen-share adjacent tool — Free (1 user, ≤2 devices); Standard from $5/user + device fees.",
    shortDescription:
      "Getscreen.me is remote access and screen-sharing software for support and remote work. Free covers 1 user and ≤2 devices. Business plans combine per-user and per-device fees: Standard $5/user + $0.10/device, Advanced $8/user + $0.15/device, Enterprise $10/user + $0.20/device. Personal Lifetime one-time option. 14-day business trial. Adjacent productivity — not a project tracker.",
    vendorPositioning:
      "Simple remote desktop and screen sharing for support teams and remote work — connect to devices without heavy VPN complexity.",
    pricingModel: "hybrid",
    hasFreePlan: true,
    hasFreeTrial: true,
    trialDays: 14,
    startingPriceMonthly: 5,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-17 from getscreen.me/en/plan/. Free (1 user, ≤2 devices). Standard $5/user + $0.10/device, Advanced $8/user + $0.15/device, Enterprise $10/user + $0.20/device. Personal Lifetime one-time. 14-day business trial. Hybrid user+device model — seat floor $5 does not include device fees.",
    pricingSummary:
      "Free: 1 user, ≤2 devices. Standard $5/user + $0.10/device; Advanced $8+$0.15; Enterprise $10+$0.20. Personal Lifetime one-time. 14-day business trial. Confirm live.",
    plans: [
      {
        kind: "free",
        slug: "free",
        name: "Free",
        limits: { maxUsers: 1, maxDevices: 2 },
        description: "Free: 1 user, up to 2 devices.",
      },
      {
        kind: "per-seat-annual",
        slug: "standard",
        name: "Standard",
        amount: 5,
        highlighted: true,
        description:
          "$5/user/month plus $0.10 per device — entry business remote-access rung (device fees extra).",
      },
      {
        kind: "per-seat-annual",
        slug: "advanced",
        name: "Advanced",
        amount: 8,
        description:
          "$8/user/month plus $0.15 per device — higher remote-access tier.",
      },
      {
        kind: "per-seat-annual",
        slug: "enterprise",
        name: "Enterprise",
        amount: 10,
        description:
          "$10/user/month plus $0.20 per device — top published business remote-access tier.",
      },
      {
        kind: "contact-sales",
        slug: "personal-lifetime",
        name: "Personal Lifetime",
        description:
          "Personal Lifetime — one-time purchase option (confirm live dollar amount on vendor site; not used as the business starting floor).",
      },
    ],
    featureOverrides: {
      "task-boards": "not-supported",
      "timeline-gantt": "not-supported",
      "workload-resources": "not-supported",
      "automations-workflows": "limited",
      "time-tracking": "not-supported",
      "docs-collaboration": "limited",
      "integrations-ecosystem": "limited",
      "reporting-dashboards": "limited",
      "ai-assistance": "not-supported",
      "document-pdf": "not-supported",
      "remote-access": "supported",
      "desktop-workspace": "not-supported",
    },
    aiLines: [
      "AI assistant: not-supported",
      "AI summaries: not-supported",
      "AI automation: not-supported",
      "AI recommendations: not-supported",
    ],
    integrations: [
      { integrationSlug: "windows", kind: "native" },
      { integrationSlug: "macos", kind: "native" },
      { integrationSlug: "linux", kind: "native" },
      { integrationSlug: "android", kind: "native" },
    ],
    limitations: [
      "Adjacent remote-access tool — not a project management platform",
      "Hybrid user + device pricing means TCO rises with device count",
      "Free is capped at 1 user / 2 devices",
      "No work OS boards, Gantt or PM reporting",
      "Personal Lifetime dollar amount should be confirmed live — not inventing one-time dollars here",
    ],
    limitationKinds: [
      "other",
      "other",
      "plan-restriction",
      "feature-unavailable",
      "other",
    ],
    scores: {
      "ease-of-use": 9,
      "work-planning": 1,
      "automation-workflows": 4,
      collaboration: 5,
      integrations: 6,
      reporting: 3,
      scalability: 7,
      "value-for-money": 9,
      "ai-capabilities": 2,
    },
    scoreRationales: {
      "ease-of-use":
        "Remote access products succeed when connection UX is simple — Getscreen markets quick unattended/attended access without heavy IT ceremony.",
      "work-planning":
        "Not a planning product — intentionally near-floor so remote tools are not ranked as work OS peers.",
      "automation-workflows":
        "Limited session/automation helpers only — not workflow engines.",
      collaboration:
        "Screen share supports support collaboration; not project collaboration.",
      integrations:
        "Cross-OS client coverage (Windows/macOS/Linux/Android) matters more than SaaS PM connectors.",
      reporting:
        "Session logging may exist; not PM portfolio reporting.",
      scalability:
        "User+device model scales for MSP/support fleets with clear published rates.",
      "value-for-money":
        "Free rung plus $5 Standard user floor is accessible; watch device fees. Affiliate economics excluded.",
      "ai-capabilities":
        "AI is not the product centre — low by design.",
    },
    bestFor: [
      "Support and IT teams needing remote desktop / screen share",
      "Buyers evaluating adjacent productivity beside a separate work OS",
      "Small fleets that can start Free or Standard",
    ],
    notIdealFor: [
      "Anyone needing boards, Gantt, automations or PM dashboards as the purchase",
      "Buyers wanting PDF editing or desktop app shells",
      "Teams that confuse remote access with work management",
    ],
    pros: [
      "Clear remote-access specialist in this category",
      "Published user + device rate card",
      "Free plan for light personal/support use",
      "14-day business trial",
      "Strong adjacent value for support stacks",
    ],
    cons: [
      "Not a work OS — work-planning scored near floor by design",
      "Device fees raise TCO",
      "No PM reporting/Gantt",
      "No AI assistance centre of gravity",
      "Lifetime plan dollars need live confirmation",
    ],
    keyFeatures: [
      "Remote desktop and unattended access",
      "Screen sharing for support",
      "Cross-platform clients",
      "Free / Standard / Advanced / Enterprise ladder",
      "Hybrid user + device pricing",
    ],
    whoShouldChoose:
      "Choose Getscreen.me when remote access / screen share is the productivity job — adjacent to, not instead of, a work OS.",
    whoShouldConsiderAlternatives:
      "Compare monday/Hive for work management, Foxit for PDF, WebCatalog for desktop app workspaces.",
    alternativeSlugs: ["monday", "hive", "foxit", "webcatalog"],
    competitorSlugs: ["anydesk", "teamviewer", "monday", "hive"],
    comparableSlugs: ["foxit", "webcatalog"],
    useCaseSlugs: ["remote-support-access"],
    businessSizeSlugs: ["micro", "small-business", "mid-market"],
    teamTypeSlugs: ["operations", "it-support"],
  },

  {
    slug: "webcatalog",
    name: "WebCatalog",
    company: "WebCatalog Ltd.",
    website: "https://webcatalog.io",
    domain: "webcatalog.io",
    pricingUrl: "https://webcatalog.io/pricing",
    aliases: [],
    membershipRole: "adjacent",
    jobCluster: "desktop-workspace",
    adjacentNote:
      "Adjacent desktop workspace organizer — not a work-OS peer for undifferentiated best ranks.",
    softShortDescription:
      "Desktop workspace organizer for web apps — Basic Free (2 apps); Pro $5/user/mo annual.",
    shortDescription:
      "WebCatalog turns web apps into desktop apps and organises multi-app productivity workspaces. Basic Free covers 2 apps; Pro $5/user/mo annual; Business $8/user/mo annual. 7-day trial. Adjacent productivity shell — not a project management or work OS platform.",
    vendorPositioning:
      "Turn websites into desktop apps and organise your workspaces — focus without browser-tab chaos.",
    pricingModel: "freemium",
    hasFreePlan: true,
    hasFreeTrial: true,
    trialDays: 7,
    startingPriceMonthly: 5,
    startingPriceConfidence: "high",
    pricingNotes:
      "Verified 2026-08-17 from webcatalog.io/pricing. Basic Free (2 apps). Pro $5/user/mo annual, Business $8/user/mo annual. 7-day trial. Confirm live app limits per plan.",
    pricingSummary:
      "Basic Free (2 apps). Pro $5/user/mo annual, Business $8/user/mo annual. 7-day trial. Confirm live.",
    plans: [
      {
        kind: "free",
        slug: "basic",
        name: "Basic",
        limits: { maxApps: 2 },
        description: "Free Basic: up to 2 apps.",
      },
      {
        kind: "per-seat-annual",
        slug: "pro",
        name: "Pro",
        amount: 5,
        highlighted: true,
        description: "$5/user/month billed annually — Pro desktop workspace organizer.",
      },
      {
        kind: "per-seat-annual",
        slug: "business",
        name: "Business",
        amount: 8,
        description: "$8/user/month billed annually — Business workspace packaging for teams.",
      },
    ],
    featureOverrides: {
      "task-boards": "not-supported",
      "timeline-gantt": "not-supported",
      "workload-resources": "not-supported",
      "automations-workflows": "not-supported",
      "time-tracking": "not-supported",
      "docs-collaboration": "not-supported",
      "integrations-ecosystem": "limited",
      "reporting-dashboards": "not-supported",
      "ai-assistance": "not-supported",
      "document-pdf": "not-supported",
      "remote-access": "not-supported",
      "desktop-workspace": "supported",
    },
    aiLines: [
      "AI assistant: not-supported",
      "AI summaries: not-supported",
      "AI automation: not-supported",
      "AI recommendations: not-supported",
    ],
    integrations: [
      { integrationSlug: "chrome", kind: "native", notes: "Web app → desktop app wrapping" },
      { integrationSlug: "macos", kind: "native" },
      { integrationSlug: "windows", kind: "native" },
      { integrationSlug: "linux", kind: "native" },
    ],
    limitations: [
      "Adjacent desktop shell — not a project management or work OS tool",
      "Free Basic capped at 2 apps",
      "No boards, Gantt, automations, or PM reporting",
      "No AI assistance centre of gravity",
      "Should never be ranked as a monday/Hive peer",
    ],
    limitationKinds: [
      "other",
      "plan-restriction",
      "feature-unavailable",
      "feature-unavailable",
      "other",
    ],
    scores: {
      "ease-of-use": 9,
      "work-planning": 2,
      "automation-workflows": 3,
      collaboration: 4,
      integrations: 6,
      reporting: 3,
      scalability: 6,
      "value-for-money": 9,
      "ai-capabilities": 2,
    },
    scoreRationales: {
      "ease-of-use":
        "Installing web apps as desktop apps is a simple productivity job — high ease for the specialist task.",
      "work-planning":
        "Not a planning product — low by design for adjacent fairness.",
      "automation-workflows":
        "Not a workflow automation platform.",
      collaboration:
        "Personal/team desktop shells; not project collaboration suites.",
      integrations:
        "Wraps arbitrary web apps rather than deep native PM connectors — moderate.",
      reporting:
        "No PM reporting surface.",
      scalability:
        "Per-user Pro/Business seats scale for knowledge workers; not org-wide work OS scale.",
      "value-for-money":
        "Free 2-app Basic and Pro at $5 annual is strong value for the desktop-workspace job. Affiliate economics excluded.",
      "ai-capabilities":
        "AI is not the product — low by design.",
    },
    bestFor: [
      "Knowledge workers who want web apps as desktop apps / workspaces",
      "Buyers evaluating adjacent productivity beside a separate work OS",
      "Individuals starting on Free (2 apps) before Pro",
    ],
    notIdealFor: [
      "Anyone needing project boards, Gantt, automations or PM dashboards",
      "Remote desktop or PDF editing as the primary purchase",
      "Teams expecting WebCatalog to replace monday/Hive",
    ],
    pros: [
      "Clear desktop-workspace specialist",
      "Free Basic entry (2 apps)",
      "Pro $5 / Business $8 annual floors",
      "7-day trial",
      "Cross-platform desktop shells",
    ],
    cons: [
      "Not a work OS — work-planning low by design",
      "No PM features",
      "Free app cap is tight",
      "No AI centre of gravity",
      "Must stay landscape/adjacent on best pages",
    ],
    keyFeatures: [
      "Web app → desktop app wrapping",
      "Multi-app workspaces",
      "Basic Free / Pro / Business seats",
      "macOS, Windows, Linux clients",
      "Focus spaces without browser-tab sprawl",
    ],
    whoShouldChoose:
      "Choose WebCatalog when organising web apps into desktop workspaces is the productivity job — adjacent to a work OS, never a substitute for one.",
    whoShouldConsiderAlternatives:
      "Compare monday/Hive for work management, Foxit for PDF, Getscreen.me for remote access.",
    alternativeSlugs: ["monday", "hive", "foxit", "getscreen-me"],
    competitorSlugs: ["rambox", "shift", "monday", "hive"],
    comparableSlugs: ["foxit", "getscreen-me"],
    useCaseSlugs: ["desktop-productivity"],
    businessSizeSlugs: ["micro", "small-business", "mid-market"],
    teamTypeSlugs: ["operations", "founders"],
  },
];

export const PRODUCTS = COMPACT.map(expandPmProduct);

/** Comparison pairs where BOTH sides are in this PRODUCTS array. */
export const COMPARISON_PAIRS = [
  ["monday", "hive"],
  ["monday", "office-timeline"],
  ["hive", "office-timeline"],
  ["foxit", "getscreen-me"],
  ["getscreen-me", "webcatalog"],
];
