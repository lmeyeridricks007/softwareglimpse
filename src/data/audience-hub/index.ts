import {
  AudienceHubProfileSchema,
  type AudienceHubProfile,
} from "@/domain";
import { audienceDepthBySlug } from "./deep";

function profile(
  input: Parameters<typeof AudienceHubProfileSchema.parse>[0],
): AudienceHubProfile {
  const slug = String(input.audienceSlug);
  const depth = audienceDepthBySlug[slug];
  return AudienceHubProfileSchema.parse({
    ...input,
    ...(depth
      ? {
          whoThisIsFor: depth.whoThisIsFor ?? input.whoThisIsFor,
          workedExampleSecondary:
            depth.workedExampleSecondary ?? input.workedExampleSecondary,
          challenges: depth.challenges?.length
            ? depth.challenges
            : input.challenges,
          outcomes: depth.outcomes?.length ? depth.outcomes : input.outcomes,
          capabilityNeeds: depth.capabilityNeeds?.length
            ? depth.capabilityNeeds
            : input.capabilityNeeds,
          workflowSteps: depth.workflowSteps?.length
            ? depth.workflowSteps
            : input.workflowSteps,
          needsVisual: depth.needsVisual ?? input.needsVisual,
          workflowVisual: depth.workflowVisual ?? input.workflowVisual,
          faq: depth.faq?.length ? depth.faq : input.faq,
        }
      : {}),
  });
}

const SHARED_BUYING = [
  {
    step: 1,
    title: "Name the job to improve in 90 days",
    description:
      "Lost follow-ups, unclear ownership, or forecast chaos — pick one primary pain.",
  },
  {
    step: 2,
    title: "List must-have workflows only",
    description:
      "Contacts, pipeline stages, email/calendar sync, reporting — skip vanity features.",
  },
  {
    step: 3,
    title: "Check admin capacity",
    description:
      "Someone must own fields, users, and hygiene weekly. No owner → no CRM value.",
  },
  {
    step: 4,
    title: "Trial on real work",
    description:
      "Import a slice of live data and run a week of actual follow-ups — not a demo script.",
    href: "/guides/crm-trial-evaluation/",
    ctaLabel: "Trial evaluation guide →",
  },
  {
    step: 5,
    title: "Estimate total cost",
    description: "Seats × plan plus add-ons you will actually enable.",
    href: "/tools/crm-cost-calculator/",
    ctaLabel: "Cost calculator →",
  },
] as const;

export function buildSmallBusinessAudienceProfile(): AudienceHubProfile {
  return profile({
    audienceSlug: "small-business",
    displayTitle: "CRM for Small Business",
    badgeLabel: "Small business",
    tagline:
      "Choose CRM that your team will keep updated — shared contacts, a simple pipeline, and minimal admin.",
    overview:
      "Small-business CRM decisions fail when buyers chase enterprise feature lists. Prioritize adoption: clear owners, stages you will actually use, and enough reporting for a Friday pipeline review.",
    whatMattersIntro:
      "For most small businesses, CRM value is operational discipline — not AI theater or deep customization on day one.",
    workedExample:
      "Worked example: a 12-person services firm. Before CRM, the team rebuilt deal status from a shared spreadsheet and Slack every Monday. After CRM, four stages, one owner per deal, and email sync mean check-ins start from the board — not from “where is this?” threads.",
    glance: {
      primaryGoal: "Shared pipeline + contact history",
      typicalTeam: "Owner-operators and small sales teams",
      commonPriorities: [
        "Ease of adoption",
        "Contact management",
        "Simple pipeline",
        "Email sync",
        "Affordable seats",
      ],
    },
    priorities: [
      {
        id: "adoption",
        title: "Adoption over feature depth",
        description:
          "If reps will not log activity, fancy automation will not save you.",
        icon: "users",
        href: "/guides/how-to-choose-crm/",
      },
      {
        id: "pipeline",
        title: "Simple, visible pipeline",
        description:
          "A few honest stages beat a complex board nobody trusts.",
        icon: "funnel",
        href: "/use-cases/pipeline-management/",
      },
      {
        id: "contacts",
        title: "One place for contacts",
        description:
          "Stop rebuilding client history from inboxes and notebooks.",
        icon: "users",
        href: "/use-cases/contact-management/",
      },
      {
        id: "admin",
        title: "Light administration",
        description:
          "Prefer tools a part-time admin can keep clean in under two hours a week.",
        icon: "shield",
      },
      {
        id: "cost",
        title: "Predictable cost",
        description:
          "Model seats and required add-ons before committing to a suite.",
        icon: "calculator",
        href: "/tools/crm-cost-calculator/",
      },
      {
        id: "integrations",
        title: "Core integrations",
        description:
          "Email, calendar, and the one tool your team already lives in.",
        icon: "puzzle",
      },
    ],
    scenarios: [
      {
        id: "owner-led",
        title: "Owner-led selling",
        bestWhen: "The founder still closes most deals and needs shared history as they hire.",
        icon: "users",
      },
      {
        id: "small-sales",
        title: "Small sales pod",
        bestWhen: "2–8 people share a pipeline and need weekly forecast honesty.",
        icon: "funnel",
        href: "/use-cases/pipeline-management/",
      },
      {
        id: "leaving-sheets",
        title: "Leaving spreadsheets",
        bestWhen: "Follow-ups drop when volume outgrows a sheet + inbox combo.",
        icon: "trending",
        href: "/guides/crm-vs-spreadsheet/",
      },
    ],
    fitSignals: [
      { id: "f1", label: "Team will maintain owners and stages weekly", kind: "fit" },
      { id: "f2", label: "Need shared visibility beyond one person’s inbox", kind: "fit" },
      { id: "w1", label: "No one owns CRM admin yet", kind: "watch" },
      { id: "a1", label: "Buying for ‘AI features’ without a process", kind: "avoid" },
      { id: "a2", label: "Enterprise suite with empty seats and zero hygiene", kind: "avoid" },
    ],
    buyingFramework: [...SHARED_BUYING],
    buyingGuideHref: "/guides/how-to-choose-crm/",
    faq: [
      {
        question: "Do small businesses need a CRM?",
        answer:
          "Yes when more than one person touches customers and follow-ups are slipping. If a single owner keeps a clean sheet and never misses callbacks, wait until shared ownership becomes the bottleneck.",
      },
      {
        question: "What should a small-business CRM include on day one?",
        answer:
          "Contacts, deal stages, activity logging, email/calendar sync, and a basic pipeline view. Add automation after the team trusts the data.",
      },
      {
        question: "How is this different from CRM by industry?",
        answer:
          "Business type is about company shape and team size. Industry pages cover vertical workflows (e.g. financial services). Use both when relevant.",
      },
    ],
    relatedAudienceSlugs: ["startups", "growing-teams", "freelancers"],
    relatedUseCaseSlugs: [
      "pipeline-management",
      "contact-management",
      "lead-management",
    ],
    featuredGuideHrefs: [
      "/guides/how-to-choose-crm/",
      "/guides/crm-vs-spreadsheet/",
      "/guides/do-i-need-a-crm/",
    ],
    matchBusinessSizeSlugs: ["small-business", "micro"],
    primaryCta: { href: "/tools/crm-finder/", label: "Find My CRM" },
    secondaryCta: { href: "/guides/how-to-choose-crm/", label: "How to choose" },
    visualKind: "small-business",
    sortOrder: 1,
  });
}

export function buildStartupsAudienceProfile(): AudienceHubProfile {
  return profile({
    audienceSlug: "startups",
    displayTitle: "CRM for Startups",
    badgeLabel: "Startups",
    tagline:
      "Move fast with a pipeline the founding team will use — then scale process without a painful rip-and-replace.",
    overview:
      "Startup CRM fit is about speed and honesty: capture opportunities, keep ownership clear, and avoid tools that demand a RevOps team you do not have yet.",
    whatMattersIntro:
      "Early-stage teams should optimize for adoption and migration headroom — not for enterprise permission matrices on day one.",
    workedExample:
      "Worked example: a seed-stage SaaS team of three founders. Before CRM, inbound demos lived in Notion tables and founder inboxes. After CRM, stages and fields already exist when two AEs join — they add reporting instead of rebuilding the pipeline.",
    glance: {
      primaryGoal: "Speed + pipeline truth",
      typicalTeam: "Founders and early AEs",
      commonPriorities: [
        "Fast setup",
        "Lead capture",
        "Pipeline",
        "Growth headroom",
        "Low admin",
      ],
    },
    priorities: [
      {
        id: "speed",
        title: "Hours to first value",
        description: "Import leads and run pipeline reviews in the first week.",
        icon: "zap",
      },
      {
        id: "pipeline",
        title: "Founder-readable pipeline",
        description: "Stages that match how you actually sell today.",
        icon: "funnel",
        href: "/use-cases/pipeline-management/",
      },
      {
        id: "headroom",
        title: "Room to grow",
        description:
          "Permissions, custom fields, and reporting you can deepen later.",
        icon: "trending",
      },
      {
        id: "integrations",
        title: "Product + outreach stack",
        description: "Connect the tools that already generate pipeline.",
        icon: "puzzle",
      },
      {
        id: "cost",
        title: "Seat economics",
        description: "Avoid plans that punish early hiring spikes.",
        icon: "calculator",
        href: "/tools/crm-cost-calculator/",
      },
      {
        id: "discipline",
        title: "Light process discipline",
        description: "Owners + next steps beat elaborate playbooks nobody follows.",
        icon: "list",
      },
    ],
    scenarios: [
      {
        id: "founder-led",
        title: "Founder-led sales",
        bestWhen: "Founders still run demos and need a shared opportunity list.",
        icon: "users",
      },
      {
        id: "first-aes",
        title: "First AE hires",
        bestWhen: "You need coaching visibility without building a RevOps org.",
        icon: "funnel",
      },
      {
        id: "inbound",
        title: "Inbound volume rising",
        bestWhen: "Demo requests outgrow inbox triage.",
        icon: "users",
        href: "/use-cases/lead-management/",
      },
    ],
    fitSignals: [
      { id: "f1", label: "Will define stages in the first sprint", kind: "fit" },
      { id: "f2", label: "Expect hiring to change who owns deals soon", kind: "fit" },
      { id: "w1", label: "Process still changes weekly — keep stages short", kind: "watch" },
      { id: "a1", label: "Buying enterprise CRM ‘for later’ with no admin", kind: "avoid" },
    ],
    buyingFramework: [...SHARED_BUYING],
    buyingGuideHref: "/guides/how-to-choose-crm/",
    faq: [
      {
        question: "When should a startup buy CRM?",
        answer:
          "When more than one person needs deal context and missed follow-ups cost pipeline. Before that, a disciplined sheet can be enough — but plan the migration trigger.",
      },
      {
        question: "Should startups buy the platform they will use at Series B?",
        answer:
          "Only if adoption will stick now. A tool the team ignores is worse than a simpler CRM you later migrate from with a plan.",
      },
    ],
    relatedAudienceSlugs: ["small-business", "growing-teams", "sales-teams"],
    relatedUseCaseSlugs: [
      "pipeline-management",
      "lead-management",
      "sales-engagement",
    ],
    featuredGuideHrefs: [
      "/guides/when-to-adopt-crm/",
      "/guides/how-to-choose-crm/",
      "/guides/do-i-need-a-crm/",
    ],
    matchBusinessSizeSlugs: ["solo", "micro", "small-business"],
    matchBusinessTypeSlugs: ["startup"],
    primaryCta: { href: "/tools/crm-finder/", label: "Find My CRM" },
    secondaryCta: {
      href: "/guides/when-to-adopt-crm/",
      label: "When to adopt",
    },
    visualKind: "startups",
    sortOrder: 2,
  });
}

export function buildEnterpriseAudienceProfile(): AudienceHubProfile {
  return profile({
    audienceSlug: "enterprise",
    displayTitle: "CRM for Enterprise",
    badgeLabel: "Enterprise",
    tagline:
      "Evaluate CRM on governance, integrations, and change management — not demo polish alone.",
    overview:
      "Enterprise CRM buying is a program: security reviews, multi-team processes, integration maps, and adoption plans. Feature checklists without those layers create expensive shelfware.",
    whatMattersIntro:
      "Weight administration, permissions, auditability, and integration depth as highly as pipeline UX.",
    workedExample:
      "Worked example: a multi-region sales org. Before CRM, demos drove the vendor pick. After CRM, vendors only advance after SSO, territory rules, and nightly sync clear the scorecard — a demo winner that fails security is dropped before procurement.",
    glance: {
      primaryGoal: "Governed revenue operations",
      typicalTeam: "Sales, RevOps, IT, and security stakeholders",
      commonPriorities: [
        "Security & admin",
        "Integrations",
        "Reporting",
        "Permissions",
        "Change management",
      ],
    },
    priorities: [
      {
        id: "security",
        title: "Security & administration",
        description: "SSO, roles, audit logs, and data residency requirements.",
        icon: "shield",
        href: "/guides/crm-vendor-evaluation/",
      },
      {
        id: "integrations",
        title: "Integration architecture",
        description: "CRM as a hub — not another isolated silo.",
        icon: "puzzle",
      },
      {
        id: "reporting",
        title: "Enterprise reporting",
        description: "Forecast and activity views leadership will trust.",
        icon: "chart",
        href: "/use-cases/reporting/",
      },
      {
        id: "process",
        title: "Multi-team process",
        description: "Handoffs across sales, CS, and partners.",
        icon: "layers",
      },
      {
        id: "vendor",
        title: "Vendor diligence",
        description: "Support, roadmap clarity, and contractual fit.",
        icon: "list",
        href: "/guides/crm-vendor-evaluation/",
      },
      {
        id: "tco",
        title: "Total cost of ownership",
        description: "Licenses, implementation, admin, and add-ons.",
        icon: "calculator",
        href: "/tools/crm-tco-calculator/",
      },
    ],
    scenarios: [
      {
        id: "multi-bu",
        title: "Multi-business-unit selling",
        bestWhen: "Separate pipelines need shared account context and governance.",
        icon: "layers",
      },
      {
        id: "regulated",
        title: "Regulated environments",
        bestWhen: "Security and audit requirements gate any SaaS purchase.",
        icon: "shield",
      },
      {
        id: "transform",
        title: "CRM transformation",
        bestWhen: "Replacing a legacy CRM with a structured migration plan.",
        icon: "trending",
        href: "/tools/crm-migration-planner/",
      },
    ],
    fitSignals: [
      { id: "f1", label: "Named IT/security and RevOps owners", kind: "fit" },
      { id: "f2", label: "Documented integration and permission requirements", kind: "fit" },
      { id: "w1", label: "Business buyers skipping security review", kind: "watch" },
      { id: "a1", label: "Choosing solely on AE demo theater", kind: "avoid" },
    ],
    buyingFramework: [
      {
        step: 1,
        title: "Assemble the buying group",
        description: "Sales ops, IT, security, finance, and end-user champions.",
      },
      {
        step: 2,
        title: "Write must-have governance requirements",
        description: "SSO, roles, retention, and audit needs before demos.",
        href: "/tools/crm-requirements-builder/",
        ctaLabel: "Requirements builder →",
      },
      {
        step: 3,
        title: "Map integrations",
        description: "Systems of record and sync direction for each critical flow.",
      },
      {
        step: 4,
        title: "Score vendors with a shared rubric",
        description: "Weighted criteria + must-have gates.",
        href: "/tools/crm-vendor-scorecard/",
        ctaLabel: "Vendor scorecard →",
      },
      {
        step: 5,
        title: "Pilot with real process",
        description: "One region or segment — measure adoption and data quality.",
        href: "/guides/crm-trial-evaluation/",
        ctaLabel: "Trial guide →",
      },
    ],
    buyingGuideHref: "/guides/crm-evaluation-guide/",
    faq: [
      {
        question: "What makes enterprise CRM different?",
        answer:
          "Governance, integration depth, and change management dominate. Ease of use still matters — but it cannot override security and admin requirements.",
      },
      {
        question: "Should we start with Best CRM lists?",
        answer:
          "Use them as research entry points, then score against your requirements. Enterprise fit is contextual — not a universal ranking.",
      },
    ],
    relatedAudienceSlugs: ["sales-teams", "growing-teams"],
    relatedUseCaseSlugs: [
      "pipeline-management",
      "relationship-management",
      "reporting",
    ],
    featuredGuideHrefs: [
      "/guides/crm-evaluation-guide/",
      "/guides/crm-vendor-evaluation/",
      "/guides/crm-rfp-guide/",
    ],
    matchBusinessSizeSlugs: ["enterprise"],
    primaryCta: { href: "/best/crm-software/", label: "Best CRM Software" },
    secondaryCta: {
      href: "/guides/crm-evaluation-guide/",
      label: "Evaluation guide",
    },
    bestHref: "/best/crm-software/",
    visualKind: "enterprise",
    sortOrder: 3,
  });
}

export function buildFreelancersAudienceProfile(): AudienceHubProfile {
  return profile({
    audienceSlug: "freelancers",
    displayTitle: "CRM for Freelancers",
    badgeLabel: "Freelancers",
    tagline:
      "Keep client history and follow-ups organized without adopting a sales org’s CRM.",
    overview:
      "Most freelancers need reliable contact context and next actions — not multi-stage forecasting. Buy CRM only when inbox + notes start costing you clients.",
    whatMattersIntro:
      "Prefer lightweight contact management and reminders over complex pipeline configuration.",
    workedExample:
      "Worked example: an independent consultant with 40 active prospects. Before CRM, two warm follow-ups slipped in personal reminders. After CRM, tasks and notes live on each client — still no five-stage board.",
    glance: {
      primaryGoal: "Client memory + follow-ups",
      typicalTeam: "Solo operators",
      commonPriorities: [
        "Simplicity",
        "Contact history",
        "Reminders",
        "Low cost",
        "Mobile access",
      ],
    },
    priorities: [
      {
        id: "contacts",
        title: "Durable client history",
        description: "Notes, emails, and next steps on one record.",
        icon: "users",
        href: "/use-cases/contact-management/",
      },
      {
        id: "simple",
        title: "Near-zero admin",
        description: "If setup takes a weekend, it is too much.",
        icon: "zap",
      },
      {
        id: "cost",
        title: "Solo-friendly pricing",
        description: "Avoid per-seat plans designed for teams you do not have.",
        icon: "calculator",
        href: "/tools/crm-cost-calculator/",
      },
      {
        id: "boundary",
        title: "Know when a sheet is enough",
        description: "CRM is optional until follow-up reliability breaks.",
        icon: "list",
        href: "/guides/crm-vs-spreadsheet/",
      },
    ],
    scenarios: [
      {
        id: "consulting",
        title: "Independent consulting",
        bestWhen: "Multiple warm leads need scheduled follow-ups.",
        icon: "handshake",
      },
      {
        id: "retainers",
        title: "Retainer clients",
        bestWhen: "You need relationship history across months of work.",
        icon: "users",
        href: "/use-cases/relationship-management/",
      },
    ],
    fitSignals: [
      { id: "f1", label: "Missed follow-ups are costing opportunities", kind: "fit" },
      { id: "w1", label: "Only a handful of clients — sheet may still win", kind: "watch" },
      { id: "a1", label: "Buying team CRM for solo vanity metrics", kind: "avoid" },
    ],
    buyingFramework: [
      {
        step: 1,
        title: "Confirm the pain",
        description: "Lost follow-ups or lost context — if neither, wait.",
        href: "/guides/do-i-need-a-crm/",
        ctaLabel: "Do I need a CRM? →",
      },
      {
        step: 2,
        title: "Pick the lightest tool that stores history",
        description: "Contacts + tasks beat pipeline theater.",
      },
      {
        step: 3,
        title: "Migrate only active relationships",
        description: "Do not import years of junk contacts on day one.",
      },
    ],
    buyingGuideHref: "/guides/do-i-need-a-crm/",
    faq: [
      {
        question: "Do freelancers need CRM software?",
        answer:
          "Only when relationship volume exceeds what you can reliably track in a sheet and inbox. Many freelancers never need a full CRM.",
      },
    ],
    relatedAudienceSlugs: ["small-business", "agencies"],
    relatedUseCaseSlugs: ["contact-management", "relationship-management"],
    featuredGuideHrefs: [
      "/guides/do-i-need-a-crm/",
      "/guides/crm-vs-spreadsheet/",
    ],
    matchBusinessSizeSlugs: ["solo", "micro"],
    primaryCta: { href: "/tools/crm-finder/", label: "Find My CRM" },
    secondaryCta: {
      href: "/guides/do-i-need-a-crm/",
      label: "Do I need a CRM?",
    },
    visualKind: "freelancers",
    sortOrder: 4,
  });
}

export function buildAgenciesAudienceProfile(): AudienceHubProfile {
  return profile({
    audienceSlug: "agencies",
    displayTitle: "CRM for Agencies",
    badgeLabel: "Agencies",
    tagline:
      "Win new business and keep client context intact when work moves from pitch to delivery.",
    overview:
      "Agency CRM needs usually span a new-business pipeline plus multi-client relationship history. The handoff between sales and account/delivery is where most tools — and processes — fail.",
    whatMattersIntro:
      "Optimize for client context, pitch pipeline clarity, and clean ownership across roles.",
    workedExample:
      "Worked example: a 25-person agency. Before CRM, closed deals restarted discovery from Slack threads. After CRM, RFPs move through stages and the account lead inherits notes, stakeholders, and next actions at handoff.",
    glance: {
      primaryGoal: "New business + client continuity",
      typicalTeam: "New business, account, and delivery leads",
      commonPriorities: [
        "Pipeline",
        "Client context",
        "Handoffs",
        "Reporting",
        "Multi-contact accounts",
      ],
    },
    priorities: [
      {
        id: "pipeline",
        title: "New-business pipeline",
        description: "RFP and pitch stages with clear next owners.",
        icon: "funnel",
        href: "/use-cases/pipeline-management/",
      },
      {
        id: "accounts",
        title: "Multi-contact accounts",
        description: "Stakeholders, history, and open work in one place.",
        icon: "users",
        href: "/use-cases/relationship-management/",
      },
      {
        id: "handoff",
        title: "Sales → delivery handoff",
        description: "Context must survive the win celebration.",
        icon: "handshake",
      },
      {
        id: "reporting",
        title: "Pipeline reporting",
        description: "Honest views of pitches without spreadsheet rebuilds.",
        icon: "chart",
        href: "/use-cases/reporting/",
      },
      {
        id: "integrations",
        title: "Agency stack fit",
        description: "Connect proposal, project, and communication tools you already use.",
        icon: "puzzle",
      },
      {
        id: "admin",
        title: "Sustainable admin",
        description: "Someone owns hygiene across many client records.",
        icon: "shield",
      },
    ],
    scenarios: [
      {
        id: "newbiz",
        title: "Competitive new business",
        bestWhen: "Multiple pitches run in parallel with different stakeholders.",
        icon: "funnel",
      },
      {
        id: "retainers",
        title: "Retainer + project mix",
        bestWhen: "Account teams need ongoing relationship memory.",
        icon: "handshake",
      },
      {
        id: "growth",
        title: "Agency growth",
        bestWhen: "Hiring account managers who cannot inherit tribal knowledge.",
        icon: "trending",
      },
    ],
    fitSignals: [
      { id: "f1", label: "Need shared pitch pipeline across principals", kind: "fit" },
      { id: "f2", label: "Delivery needs sales context after close", kind: "fit" },
      { id: "a1", label: "CRM used only as a glorified contact book", kind: "avoid" },
    ],
    buyingFramework: [...SHARED_BUYING],
    buyingGuideHref: "/guides/how-to-choose-crm/",
    faq: [
      {
        question: "Do agencies need a sales CRM or a client CRM?",
        answer:
          "Usually both jobs in one system: a pipeline for pitches and durable account history for retainers. If delivery lives elsewhere, define the handoff fields explicitly.",
      },
    ],
    relatedAudienceSlugs: ["small-business", "growing-teams", "freelancers"],
    relatedUseCaseSlugs: [
      "pipeline-management",
      "relationship-management",
      "contact-management",
    ],
    featuredGuideHrefs: [
      "/guides/how-to-choose-crm/",
      "/guides/crm-requirements-guide/",
    ],
    matchBusinessTypeSlugs: ["agency"],
    matchBusinessSizeSlugs: ["micro", "small-business", "mid-market"],
    primaryCta: { href: "/tools/crm-finder/", label: "Find My CRM" },
    secondaryCta: {
      href: "/use-cases/pipeline-management/",
      label: "Pipeline use case",
    },
    visualKind: "agencies",
    sortOrder: 5,
  });
}

export function buildNonprofitsAudienceProfile(): AudienceHubProfile {
  return profile({
    audienceSlug: "nonprofits",
    displayTitle: "CRM for Nonprofits",
    badgeLabel: "Nonprofits",
    tagline:
      "Track donors, volunteers, and stakeholders with relationship discipline — not a forced B2B sales process.",
    overview:
      "Nonprofit teams often need relationship history and outreach ownership more than classic deal stages. Evaluate whether a general CRM, a donor platform, or a hybrid fits the real workflow.",
    whatMattersIntro:
      "Map people and journeys first (donor, volunteer, partner) before copying a sales pipeline template.",
    workedExample:
      "Worked example: a regional nonprofit. Before CRM, quarterly outreach depended on whoever still had the old spreadsheet. After CRM, volunteer and major-donor interactions sit in one system with clear owners.",
    glance: {
      primaryGoal: "Relationship continuity",
      typicalTeam: "Development, programs, and volunteer coordinators",
      commonPriorities: [
        "Contact history",
        "Outreach ownership",
        "Segmentation",
        "Reporting",
        "Budget fit",
      ],
    },
    priorities: [
      {
        id: "relationships",
        title: "Relationship history",
        description: "Every meaningful touch should be findable later.",
        icon: "handshake",
        href: "/use-cases/relationship-management/",
      },
      {
        id: "ownership",
        title: "Clear outreach ownership",
        description: "Know who follows up with each stakeholder.",
        icon: "users",
        href: "/use-cases/contact-management/",
      },
      {
        id: "reporting",
        title: "Mission-friendly reporting",
        description: "Activity and pipeline views that match your programs.",
        icon: "chart",
        href: "/use-cases/reporting/",
      },
      {
        id: "budget",
        title: "Budget reality",
        description: "Prefer tools you can staff and afford sustainably.",
        icon: "calculator",
        href: "/tools/crm-cost-calculator/",
      },
      {
        id: "fit",
        title: "Sales CRM vs donor tools",
        description:
          "If fundraising workflows dominate, evaluate purpose-built options alongside general CRM.",
        icon: "layers",
      },
    ],
    scenarios: [
      {
        id: "donors",
        title: "Donor stewardship",
        bestWhen: "Major gifts and renewals need consistent follow-up.",
        icon: "heart",
      },
      {
        id: "volunteers",
        title: "Volunteer coordination",
        bestWhen: "People and engagement history matter more than deal stages.",
        icon: "users",
      },
      {
        id: "partners",
        title: "Partner / grant pipeline",
        bestWhen: "Opportunities resemble a pipeline with stages and owners.",
        icon: "funnel",
        href: "/use-cases/pipeline-management/",
      },
    ],
    fitSignals: [
      { id: "f1", label: "Multiple people touch the same relationships", kind: "fit" },
      { id: "w1", label: "Heavy fundraising features may need a donor CRM", kind: "watch" },
      { id: "a1", label: "Forcing a B2B sales template onto donors", kind: "avoid" },
    ],
    buyingFramework: [...SHARED_BUYING],
    buyingGuideHref: "/guides/how-to-choose-crm/",
    faq: [
      {
        question: "Is a sales CRM right for nonprofits?",
        answer:
          "It can be when you need shared relationship history and light pipelines. If gift processing, receipts, and donor journeys dominate, compare purpose-built nonprofit platforms too.",
      },
    ],
    relatedAudienceSlugs: ["small-business", "agencies"],
    relatedUseCaseSlugs: [
      "relationship-management",
      "contact-management",
      "reporting",
    ],
    featuredGuideHrefs: [
      "/guides/how-to-choose-crm/",
      "/guides/do-i-need-a-crm/",
    ],
    matchBusinessSizeSlugs: ["micro", "small-business", "mid-market"],
    primaryCta: { href: "/tools/crm-finder/", label: "Find My CRM" },
    secondaryCta: {
      href: "/use-cases/relationship-management/",
      label: "Relationship use case",
    },
    visualKind: "nonprofits",
    sortOrder: 6,
  });
}

export function buildGrowingTeamsAudienceProfile(): AudienceHubProfile {
  return profile({
    audienceSlug: "growing-teams",
    displayTitle: "CRM for Growing Teams",
    badgeLabel: "Growing teams",
    tagline:
      "Graduate from spreadsheets with process light enough to adopt — and structured enough to scale.",
    overview:
      "Growing teams hit a tipping point: informal ownership stops working. CRM should introduce stages and visibility without freezing the team in process bureaucracy.",
    whatMattersIntro:
      "Start with the minimum process that creates shared truth, then add automation and reporting as volume grows.",
    workedExample:
      "Worked example: a team of eight. Before CRM, two new hires could not see deal status on the shared sheet. After CRM, four stages and mandatory next steps stick — forecasts come three months later, once hygiene is real.",
    glance: {
      primaryGoal: "Scale process without killing adoption",
      typicalTeam: "Teams expanding past informal selling",
      commonPriorities: [
        "Adoption",
        "Pipeline",
        "Onboarding new hires",
        "Reporting",
        "Scalability",
      ],
    },
    priorities: [
      {
        id: "tipping",
        title: "Recognize the tipping point",
        description: "Missed handoffs and reconstruction meetings are the signal.",
        icon: "trending",
        href: "/guides/when-to-adopt-crm/",
      },
      {
        id: "adoption",
        title: "Adoption-first rollout",
        description: "Fewer fields, clearer owners, weekly hygiene.",
        icon: "users",
      },
      {
        id: "pipeline",
        title: "Stable stage definitions",
        description: "Stages everyone can explain in one sentence.",
        icon: "funnel",
        href: "/use-cases/pipeline-management/",
      },
      {
        id: "reporting",
        title: "Reporting that waits for clean data",
        description: "Do not demand forecasts before activity is trusted.",
        icon: "chart",
        href: "/use-cases/reporting/",
      },
      {
        id: "automation",
        title: "Automation after habits",
        description: "Automate only workflows people already follow.",
        icon: "zap",
        href: "/use-cases/sales-automation/",
      },
    ],
    scenarios: [
      {
        id: "sheet-break",
        title: "Spreadsheet breaking point",
        bestWhen: "Multiple editors and lost follow-ups are common.",
        icon: "list",
        href: "/guides/crm-vs-spreadsheet/",
      },
      {
        id: "hiring",
        title: "Hiring wave",
        bestWhen: "New sellers need inherited context on day one.",
        icon: "users",
      },
      {
        id: "manager",
        title: "First sales manager",
        bestWhen: "Coaching needs a shared pipeline view.",
        icon: "funnel",
      },
    ],
    fitSignals: [
      { id: "f1", label: "Team agrees on a short stage list", kind: "fit" },
      { id: "f2", label: "Someone will own weekly CRM hygiene", kind: "fit" },
      { id: "a1", label: "Big-bang process redesign with no champions", kind: "avoid" },
    ],
    buyingFramework: [...SHARED_BUYING],
    buyingGuideHref: "/guides/when-to-adopt-crm/",
    faq: [
      {
        question: "How do growing teams avoid CRM shelfware?",
        answer:
          "Launch with a tiny required field set, train on real deals, and review adoption weekly. Expand configuration only after the basics stick.",
      },
    ],
    relatedAudienceSlugs: ["small-business", "startups", "sales-teams"],
    relatedUseCaseSlugs: [
      "pipeline-management",
      "lead-management",
      "sales-automation",
    ],
    featuredGuideHrefs: [
      "/guides/when-to-adopt-crm/",
      "/guides/crm-vs-spreadsheet/",
      "/guides/how-to-choose-crm/",
    ],
    matchBusinessSizeSlugs: ["small-business", "mid-market"],
    primaryCta: { href: "/tools/crm-finder/", label: "Find My CRM" },
    secondaryCta: {
      href: "/guides/when-to-adopt-crm/",
      label: "When to adopt",
    },
    visualKind: "growing-teams",
    sortOrder: 7,
  });
}

export function buildSalesTeamsAudienceProfile(): AudienceHubProfile {
  return profile({
    audienceSlug: "sales-teams",
    displayTitle: "CRM for Remote Sales Teams",
    badgeLabel: "Remote sales teams",
    tagline:
      "Replace hallway updates with a shared pipeline, visible activity, and async coaching.",
    overview:
      "Distributed sales teams need CRM as the system of record for deals and activity. Without it, managers coach from anecdotes and reps optimize private spreadsheets.",
    whatMattersIntro:
      "Prioritize shared pipeline truth, activity visibility, and mobile/async workflows over office-centric process assumptions.",
    workedExample:
      "Worked example: a remote team across three time zones. Before CRM, Friday reviews were “any updates?” in Slack. After CRM, managers coach from stages, next steps, and activity gaps on the board.",
    glance: {
      primaryGoal: "Shared pipeline + activity visibility",
      typicalTeam: "Distributed AEs, SDRs, and managers",
      commonPriorities: [
        "Pipeline visibility",
        "Activity tracking",
        "Engagement workflows",
        "Reporting",
        "Async coaching",
      ],
    },
    priorities: [
      {
        id: "pipeline",
        title: "Single pipeline truth",
        description: "Stages and owners everyone trusts across time zones.",
        icon: "funnel",
        href: "/use-cases/pipeline-management/",
      },
      {
        id: "activity",
        title: "Activity visibility",
        description: "See follow-ups without pinging people for status.",
        icon: "phone",
        href: "/use-cases/sales-engagement/",
      },
      {
        id: "coaching",
        title: "Async coaching inputs",
        description: "Managers review deals and activity on their schedule.",
        icon: "chart",
        href: "/use-cases/reporting/",
      },
      {
        id: "engagement",
        title: "Engagement workflows",
        description: "Sequences and calling where outbound volume is real.",
        icon: "zap",
        href: "/use-cases/sales-engagement/",
      },
      {
        id: "mobile",
        title: "Work-from-anywhere UX",
        description: "Logging must be easy on the go — or it will not happen.",
        icon: "users",
      },
      {
        id: "integrations",
        title: "Comm stack sync",
        description: "Email, calendar, and dialer context on the record.",
        icon: "puzzle",
      },
    ],
    scenarios: [
      {
        id: "distributed-ae",
        title: "Distributed AE team",
        bestWhen: "Pipeline reviews happen without a shared office.",
        icon: "funnel",
      },
      {
        id: "sdr",
        title: "Remote SDR / outbound",
        bestWhen: "High activity needs sequencing and clear ownership.",
        icon: "phone",
        href: "/use-cases/sales-engagement/",
      },
      {
        id: "hybrid",
        title: "Hybrid management",
        bestWhen: "Managers coach across regions with the same rubric.",
        icon: "chart",
      },
    ],
    fitSignals: [
      { id: "f1", label: "Team already agrees CRM is system of record", kind: "fit" },
      { id: "f2", label: "Managers will inspect CRM before status meetings", kind: "fit" },
      { id: "a1", label: "Slack as the unofficial CRM of record", kind: "avoid" },
    ],
    buyingFramework: [...SHARED_BUYING],
    buyingGuideHref: "/guides/how-to-choose-crm/",
    faq: [
      {
        question: "What CRM features matter most for remote sales?",
        answer:
          "Shared pipeline, reliable activity capture, reporting managers can trust, and integrations with email/calendar. Fancy dashboards mean little if stages are fiction.",
      },
    ],
    relatedAudienceSlugs: ["growing-teams", "startups", "enterprise"],
    relatedUseCaseSlugs: [
      "pipeline-management",
      "sales-engagement",
      "reporting",
    ],
    featuredGuideHrefs: [
      "/guides/how-to-choose-crm/",
      "/guides/crm-evaluation-guide/",
    ],
    matchTeamTypeSlugs: ["sales"],
    matchBusinessSizeSlugs: ["small-business", "mid-market", "enterprise"],
    primaryCta: { href: "/tools/crm-finder/", label: "Find My CRM" },
    secondaryCta: {
      href: "/use-cases/pipeline-management/",
      label: "Pipeline use case",
    },
    visualKind: "sales-teams",
    sortOrder: 8,
  });
}

const BUILDERS: Record<string, () => AudienceHubProfile> = {
  "small-business": buildSmallBusinessAudienceProfile,
  startups: buildStartupsAudienceProfile,
  enterprise: buildEnterpriseAudienceProfile,
  freelancers: buildFreelancersAudienceProfile,
  agencies: buildAgenciesAudienceProfile,
  nonprofits: buildNonprofitsAudienceProfile,
  "growing-teams": buildGrowingTeamsAudienceProfile,
  "sales-teams": buildSalesTeamsAudienceProfile,
};

export function getAudienceHubProfile(
  audienceSlug: string,
): AudienceHubProfile | null {
  const build = BUILDERS[audienceSlug];
  return build ? build() : null;
}

export function listAudienceHubProfiles(): AudienceHubProfile[] {
  return Object.keys(BUILDERS)
    .map((slug) => BUILDERS[slug]!())
    .sort((a, b) => a.sortOrder - b.sortOrder);
}
