import type { AudienceHubProfile } from "@/domain";

type Depth = Pick<
  AudienceHubProfile,
  | "whoThisIsFor"
  | "workedExampleSecondary"
  | "challenges"
  | "outcomes"
  | "capabilityNeeds"
  | "workflowSteps"
  | "needsVisual"
  | "workflowVisual"
  | "faq"
>;

/**
 * Depth layers merged into audience hub profiles.
 * Educational / operational — no invented rankings or prices.
 */
export const audienceDepthBySlug: Record<string, Depth> = {
  "small-business": {
    whoThisIsFor:
      "Owner-led companies and small sales pods (roughly 2–25 people) that sell through relationships and follow-ups. You are past “I can keep it in my head,” but you do not have a RevOps team. You need shared customer memory and a pipeline the whole team will actually update.",
    workedExampleSecondary:
      "Worked example: a local B2B installer with two estimators and one office coordinator. Before CRM, quotes lived in email drafts. After CRM, every quote has an owner, a stage, and a next date — the coordinator can chase without guessing who spoke last.",
    challenges: [
      {
        id: "lost-followups",
        title: "Follow-ups slip when people get busy",
        pain: "Warm leads cool off because reminders live in personal inboxes or sticky notes.",
        crmHelps:
          "Tasks and next-step dates sit on the deal or contact, so anyone covering the account can see what is due.",
      },
      {
        id: "tribal-knowledge",
        title: "Customer context lives with one person",
        pain: "If the owner or top rep is out, the team rebuilds history from memory and Slack.",
        crmHelps:
          "Notes, emails, and call history attach to one record so coverage does not mean starting over.",
      },
      {
        id: "sheet-chaos",
        title: "The spreadsheet becomes the unofficial CRM",
        pain: "Multiple editors, conflicting rows, and no clear owner per opportunity.",
        crmHelps:
          "A simple stage board with required owners replaces the shared sheet for active deals.",
      },
      {
        id: "friday-blind",
        title: "Weekly reviews are storytelling, not data",
        pain: "Monday or Friday check-ins ask “any updates?” instead of reviewing a trusted board.",
        crmHelps:
          "A short, honest pipeline view makes reviews about next actions — not reconstructing status.",
      },
    ],
    outcomes: [
      {
        id: "shared-truth",
        title: "One place the team trusts",
        description:
          "Contacts and open deals stop living in private lists.",
      },
      {
        id: "fewer-drops",
        title: "Fewer dropped follow-ups",
        description:
          "Next steps are visible and owned, even when someone is out.",
      },
      {
        id: "lighter-meetings",
        title: "Shorter status meetings",
        description:
          "Reviews start from the board instead of verbal updates.",
      },
      {
        id: "hire-ready",
        title: "Easier to onboard the next hire",
        description:
          "New people inherit context instead of shadowing for weeks.",
      },
    ],
    capabilityNeeds: [
      {
        id: "contacts",
        title: "Contact & company records",
        description: "Durable history for people and accounts you sell to.",
        priority: "must",
        href: "/use-cases/contact-management/",
      },
      {
        id: "pipeline",
        title: "Simple pipeline stages",
        description: "A few stages everyone can explain in one sentence.",
        priority: "must",
        href: "/use-cases/pipeline-management/",
      },
      {
        id: "email",
        title: "Email / calendar sync",
        description: "Reduce double entry so logging actually happens.",
        priority: "must",
      },
      {
        id: "tasks",
        title: "Tasks & reminders",
        description: "Next actions with due dates on the record.",
        priority: "must",
      },
      {
        id: "reporting",
        title: "Basic pipeline reporting",
        description: "Enough for a weekly review — not a BI project.",
        priority: "nice",
        href: "/use-cases/reporting/",
      },
      {
        id: "automation",
        title: "Light automation",
        description: "Add after habits stick — not on day one.",
        priority: "nice",
        href: "/use-cases/sales-automation/",
      },
    ],
    workflowSteps: [
      {
        id: "capture",
        label: "Capture",
        detail: "Lead or inquiry lands in CRM (form, email, or manual).",
      },
      {
        id: "own",
        label: "Own",
        detail: "One person owns the follow-up — no orphan records.",
      },
      {
        id: "advance",
        label: "Advance",
        detail: "Move stages only when real progress happens.",
      },
      {
        id: "review",
        label: "Review",
        detail: "Weekly board review: stuck deals and missing next steps.",
      },
      {
        id: "hand",
        label: "Hand off",
        detail: "Won work carries notes into delivery or fulfillment.",
      },
    ],
    needsVisual: {
      src: "/for/for-small-business-needs.png",
      alt: "Diagram of small-business pains — lost follow-ups, tribal knowledge, spreadsheet chaos — mapped to CRM fixes like owned tasks, shared history, and a simple pipeline.",
      caption:
        "What usually breaks for small businesses — and how a light CRM setup addresses it.",
    },
    workflowVisual: {
      src: "/for/for-small-business-workflow.png",
      alt: "Five-step small-business CRM workflow: capture, own, advance, review, hand off.",
      caption:
        "A practical CRM loop for small teams — keep stages few and ownership mandatory.",
    },
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
      {
        question: "How do we know CRM is working?",
        answer:
          "Look for fewer “who owns this?” questions, next steps on every open deal, and weekly reviews that start from the board — not from Slack archaeology.",
      },
    ],
  },

  startups: {
    whoThisIsFor:
      "Early-stage teams (founders through first AEs) that need pipeline truth without enterprise process weight. You move fast, change the offer often, and cannot afford a CRM that needs a full-time admin before you have product-market fit.",
    workedExampleSecondary:
      "Worked example: a seed SaaS team. Before CRM, founders closed from scattered inboxes. After CRM, demo requests route the same day and AE coaching starts from the board instead of Notion tables.",
    challenges: [
      {
        id: "speed",
        title: "Setup time kills momentum",
        pain: "Heavy CRM projects stall while founders should be selling.",
        crmHelps:
          "A fast path to contacts + stages + email sync delivers value in days, not quarters.",
      },
      {
        id: "founder-brain",
        title: "Deal knowledge stays with founders",
        pain: "Hiring the first AE means recreating context from memory.",
        crmHelps:
          "Logging demos, notes, and next steps creates a handoff package for new sellers.",
      },
      {
        id: "inbound-surge",
        title: "Inbound outgrows inbox triage",
        pain: "Demo requests pile up; nobody sees SLA or ownership clearly.",
        crmHelps:
          "Lead capture with assignment rules keeps response times honest.",
      },
      {
        id: "premature-enterprise",
        title: "Buying “Series B CRM” too early",
        pain: "Complex permissions and empty fields create shelfware.",
        crmHelps:
          "Start simple, then deepen reporting and permissions when hiring proves the need.",
      },
    ],
    outcomes: [
      {
        id: "same-day",
        title: "Same-day ownership of inbound",
        description: "Every demo request has an owner and a next step.",
      },
      {
        id: "founder-leverage",
        title: "Founders stop being the only system of record",
        description: "Deal context survives hiring and vacation.",
      },
      {
        id: "scale-path",
        title: "A path to scale without rip-and-replace panic",
        description:
          "Process deepens in place as the team grows.",
      },
    ],
    capabilityNeeds: [
      {
        id: "pipeline",
        title: "Founder-readable pipeline",
        description: "Stages match how you sell today.",
        priority: "must",
        href: "/use-cases/pipeline-management/",
      },
      {
        id: "leads",
        title: "Lead capture & assignment",
        description: "Inbound does not die in a shared inbox.",
        priority: "must",
        href: "/use-cases/lead-management/",
      },
      {
        id: "speed",
        title: "Fast setup",
        description: "Hours to first useful review — not a six-week project.",
        priority: "must",
      },
      {
        id: "integrations",
        title: "Core stack connectors",
        description: "Email, calendar, and your main acquisition tools.",
        priority: "must",
      },
      {
        id: "engagement",
        title: "Light sequences",
        description: "Useful when outbound volume appears.",
        priority: "nice",
        href: "/use-cases/sales-engagement/",
      },
      {
        id: "reporting",
        title: "Growth reporting",
        description: "Add when hygiene is real.",
        priority: "nice",
        href: "/use-cases/reporting/",
      },
    ],
    workflowSteps: [
      {
        id: "inbound",
        label: "Inbound",
        detail: "Demo or signup intent is captured automatically.",
      },
      {
        id: "qualify",
        label: "Qualify",
        detail: "Owner books discovery; disqualify reasons are logged.",
      },
      {
        id: "trial",
        label: "Trial / pilot",
        detail: "Stage reflects real product usage or evaluation progress.",
      },
      {
        id: "close",
        label: "Close",
        detail: "Won/lost reasons feed learning — not vanity dashboards.",
      },
      {
        id: "expand",
        label: "Expand later",
        detail: "Add AE capacity, then forecasting discipline.",
      },
    ],
    needsVisual: {
      src: "/for/for-startups-needs.png",
      alt: "Startup CRM needs diagram: speed, founder handoff, inbound ownership, and avoiding premature enterprise complexity.",
      caption:
        "Startup CRM jobs: move fast now, leave room to deepen process later.",
    },
    workflowVisual: {
      src: "/for/for-startups-workflow.png",
      alt: "Startup CRM workflow from inbound capture through qualify, trial, close, and later expansion.",
      caption: "A startup-friendly CRM loop that founders and early AEs can share.",
    },
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
      {
        question: "What is the first process to lock?",
        answer:
          "Owner + next step on every open opportunity. Everything else (forecast categories, heavy automation) waits until that habit is real.",
      },
    ],
  },

  enterprise: {
    whoThisIsFor:
      "Multi-team organizations where CRM is a program — sales, RevOps, IT, security, and finance all have a say. You need governance and integrations as much as a pretty pipeline UI.",
    workedExampleSecondary:
      "Worked example: a global sales org. Before CRM, flashy demos drove shortlists. After CRM, SSO, territory rules, and nightly ERP sync clear first — a vendor that fails security is dropped before procurement.",
    challenges: [
      {
        id: "governance",
        title: "Permissions and audit requirements",
        pain: "Shadow spreadsheets appear when people cannot get the access model right.",
        crmHelps:
          "Role-based access, audit logs, and clear admin ownership keep one system of record viable.",
      },
      {
        id: "integrations",
        title: "CRM becomes another silo",
        pain: "Data is retyped across ERP, support, and marketing tools.",
        crmHelps:
          "An integration map with owned sync direction prevents duplicate truth.",
      },
      {
        id: "change",
        title: "Change management is underestimated",
        pain: "A tool launches; adoption stalls; leaders lose trust in forecasts.",
        crmHelps:
          "Pilots with real process, training, and hygiene metrics make rollout measurable.",
      },
      {
        id: "demo-theater",
        title: "Demos outrun requirements",
        pain: "Buying groups choose on polish, then fail security or integration gates.",
        crmHelps:
          "A shared scorecard with must-have gates keeps demos honest.",
      },
    ],
    outcomes: [
      {
        id: "trusted-forecast",
        title: "Forecasts leadership can challenge",
        description: "Stages and hygiene rules make numbers discussable.",
      },
      {
        id: "safer-ops",
        title: "Security and admin under control",
        description: "Access, audit, and data handling meet policy.",
      },
      {
        id: "connected",
        title: "Connected revenue systems",
        description: "CRM participates in the stack instead of duplicating it.",
      },
    ],
    capabilityNeeds: [
      {
        id: "security",
        title: "SSO, roles, audit",
        description: "Non-negotiable for most enterprise buys.",
        priority: "must",
        href: "/guides/crm-vendor-evaluation/",
      },
      {
        id: "integrations",
        title: "Integration architecture",
        description: "Documented sync with systems of record.",
        priority: "must",
      },
      {
        id: "reporting",
        title: "Enterprise reporting",
        description: "Rollups leaders will use in operating reviews.",
        priority: "must",
        href: "/use-cases/reporting/",
      },
      {
        id: "process",
        title: "Multi-team process",
        description: "Handoffs across sales, CS, partners.",
        priority: "must",
      },
      {
        id: "tco",
        title: "TCO visibility",
        description: "Licenses, implementation, admin, add-ons.",
        priority: "must",
        href: "/tools/crm-tco-calculator/",
      },
      {
        id: "ai",
        title: "AI add-ons",
        description: "Evaluate after core process works.",
        priority: "nice",
      },
    ],
    workflowSteps: [
      {
        id: "requirements",
        label: "Requirements",
        detail: "Buying group writes must-haves before demos.",
      },
      {
        id: "gates",
        label: "Gates",
        detail: "Security and integration pass/fail criteria.",
      },
      {
        id: "pilot",
        label: "Pilot",
        detail: "One region or segment on real deals.",
      },
      {
        id: "measure",
        label: "Measure",
        detail: "Adoption, hygiene, and forecast quality.",
      },
      {
        id: "scale",
        label: "Scale",
        detail: "Roll out with training and admin capacity.",
      },
    ],
    needsVisual: {
      src: "/for/for-enterprise-needs.png",
      alt: "Enterprise CRM needs: governance, integrations, change management, and scorecard gates instead of demo theater.",
      caption:
        "Enterprise CRM success depends on governance and integrations — not demo polish alone.",
    },
    workflowVisual: {
      src: "/for/for-enterprise-workflow.png",
      alt: "Enterprise CRM buying and rollout workflow: requirements, gates, pilot, measure, scale.",
      caption: "Treat CRM as a program with gates, pilots, and measurable adoption.",
    },
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
      {
        question: "How do we avoid shelfware?",
        answer:
          "Pilot with real process, fund admin capacity, and measure hygiene weekly. Do not declare success from go-live day alone.",
      },
    ],
  },

  freelancers: {
    whoThisIsFor:
      "Solo operators and independent consultants who need client memory and reliable follow-ups — not a multi-rep sales machine. You win work through relationships and proposals, and admin time is unpaid time.",
    workedExampleSecondary:
      "Worked example: a freelance strategist with 35 warm prospects. Before CRM, two missed nudges cost retainers. After CRM, tasks and notes restore follow-up discipline in under an hour a week — still no eight-stage board.",
    challenges: [
      {
        id: "memory",
        title: "Client context fragments across tools",
        pain: "Notes in docs, emails in inbox, promises in chat.",
        crmHelps:
          "One contact record holds history so you sound briefed every time.",
      },
      {
        id: "followups",
        title: "Follow-ups compete with delivery work",
        pain: "Billable work crowds out nurture; warm leads go quiet.",
        crmHelps:
          "Reminders on the record make nurture a scheduled habit, not a hope.",
      },
      {
        id: "overbuy",
        title: "Team CRM is overkill",
        pain: "Paying for seats, pipelines, and admin you will never use.",
        crmHelps:
          "Choose the lightest tool that stores history and next actions.",
      },
    ],
    outcomes: [
      {
        id: "reliable",
        title: "Reliable follow-ups",
        description: "Warm opportunities get a planned next touch.",
      },
      {
        id: "briefed",
        title: "You always sound briefed",
        description: "History is one click away before a call.",
      },
      {
        id: "boundary",
        title: "Clear boundary vs spreadsheets",
        description: "You know when a sheet is enough — and when it is not.",
      },
    ],
    capabilityNeeds: [
      {
        id: "contacts",
        title: "Contact history",
        description: "Notes and past touches on one record.",
        priority: "must",
        href: "/use-cases/contact-management/",
      },
      {
        id: "tasks",
        title: "Reminders",
        description: "Simple due dates beat complex stages.",
        priority: "must",
      },
      {
        id: "mobile",
        title: "Mobile access",
        description: "Log on the go between client sessions.",
        priority: "must",
      },
      {
        id: "pipeline",
        title: "Optional light pipeline",
        description: "Only if you juggle many concurrent pitches.",
        priority: "nice",
        href: "/use-cases/pipeline-management/",
      },
    ],
    workflowSteps: [
      {
        id: "meet",
        label: "Meet",
        detail: "Capture the person and why they matter.",
      },
      {
        id: "note",
        label: "Note",
        detail: "Log the conversation and promised next step.",
      },
      {
        id: "remind",
        label: "Remind",
        detail: "Due date ensures the nudge happens.",
      },
      {
        id: "propose",
        label: "Propose",
        detail: "Attach proposal status to the same record.",
      },
      {
        id: "retain",
        label: "Retain",
        detail: "Keep relationship history after the project starts.",
      },
    ],
    needsVisual: {
      src: "/for/for-freelancers-needs.png",
      alt: "Freelancer CRM needs: fragmented client memory and missed follow-ups solved by contact history and reminders without a heavy sales board.",
      caption:
        "Freelancer CRM is usually history + follow-ups — not enterprise pipeline design.",
    },
    workflowVisual: {
      src: "/for/for-freelancers-workflow.png",
      alt: "Freelancer CRM workflow: meet, note, remind, propose, retain.",
      caption: "A solo-friendly loop that protects relationships without admin theater.",
    },
    faq: [
      {
        question: "Do freelancers need CRM software?",
        answer:
          "Only when relationship volume exceeds what you can reliably track in a sheet and inbox. Many freelancers never need a full CRM.",
      },
      {
        question: "What is the minimum useful setup?",
        answer:
          "Contacts, notes, and reminders. Skip multi-stage forecasting until you truly run a sales pipeline.",
      },
    ],
  },

  agencies: {
    whoThisIsFor:
      "Agencies and studios that run a new-business pipeline and then deliver work across account teams. Principals, new-business leads, and delivery managers all need context — especially at handoff.",
    workedExampleSecondary:
      "Worked example: a 30-person digital agency. Before CRM, kickoffs started with “what did sales promise?” After CRM, RFPs move through stages and the account lead inherits stakeholders, scope notes, and risks on verbal win.",
    challenges: [
      {
        id: "pitch-fog",
        title: "Pitch status is tribal",
        pain: "Principals hold RFP reality in their heads; the team cannot help.",
        crmHelps:
          "A shared pitch pipeline with owners and next steps makes new business visible.",
      },
      {
        id: "handoff",
        title: "Sales → delivery loses context",
        pain: "Kickoffs rediscover stakeholders and promises from scratch.",
        crmHelps:
          "Won records carry notes, contacts, and scope into account ownership.",
      },
      {
        id: "multi-contact",
        title: "Clients have many stakeholders",
        pain: "Emails scatter across threads; nobody sees the map.",
        crmHelps:
          "Account + contact models keep buying committees and day-to-day contacts organized.",
      },
      {
        id: "retainers",
        title: "Retainer relationships go quiet",
        pain: "Delivery is busy; expansion conversations never get scheduled.",
        crmHelps:
          "Relationship tasks and renewal dates keep account care intentional.",
      },
    ],
    outcomes: [
      {
        id: "visible-pipeline",
        title: "Visible new-business pipeline",
        description: "Leadership sees pitches without chasing principals.",
      },
      {
        id: "clean-kickoff",
        title: "Cleaner kickoffs",
        description: "Delivery inherits context instead of interrogating sales.",
      },
      {
        id: "account-care",
        title: "More intentional account care",
        description: "Renewals and expansions get owners and dates.",
      },
    ],
    capabilityNeeds: [
      {
        id: "pipeline",
        title: "New-business pipeline",
        description: "RFP and pitch stages with clear owners.",
        priority: "must",
        href: "/use-cases/pipeline-management/",
      },
      {
        id: "accounts",
        title: "Multi-contact accounts",
        description: "Stakeholders mapped to client organizations.",
        priority: "must",
        href: "/use-cases/relationship-management/",
      },
      {
        id: "handoff",
        title: "Handoff fields",
        description: "Scope, risks, and promises captured at win.",
        priority: "must",
      },
      {
        id: "reporting",
        title: "Pitch reporting",
        description: "Honest views of new-business health.",
        priority: "nice",
        href: "/use-cases/reporting/",
      },
    ],
    workflowSteps: [
      {
        id: "rfp",
        label: "RFP in",
        detail: "Opportunity created with owner and due dates.",
      },
      {
        id: "pitch",
        label: "Pitch",
        detail: "Stakeholders and materials linked to the record.",
      },
      {
        id: "verbal",
        label: "Verbal",
        detail: "Risks and commercial terms noted before contract.",
      },
      {
        id: "handoff",
        label: "Handoff",
        detail: "Account lead inherits full context.",
      },
      {
        id: "care",
        label: "Care",
        detail: "Retainer health and expansion tasks scheduled.",
      },
    ],
    needsVisual: {
      src: "/for/for-agencies-needs.png",
      alt: "Agency CRM needs: pitch visibility, sales-to-delivery handoff, multi-stakeholder accounts, and retainer care.",
      caption:
        "Agency CRM must cover both winning work and keeping client context after the win.",
    },
    workflowVisual: {
      src: "/for/for-agencies-workflow.png",
      alt: "Agency CRM workflow from RFP through pitch, verbal, handoff, and ongoing account care.",
      caption: "From pitch board to delivery handoff — context should survive the win.",
    },
    faq: [
      {
        question: "Do agencies need a sales CRM or a client CRM?",
        answer:
          "Usually both jobs in one system: a pipeline for pitches and durable account history for retainers. If delivery lives elsewhere, define the handoff fields explicitly.",
      },
      {
        question: "What breaks most often?",
        answer:
          "The handoff. If won deals do not carry stakeholders and promises, CRM becomes a new-business toy instead of an operating system.",
      },
    ],
  },

  nonprofits: {
    whoThisIsFor:
      "Nonprofit teams coordinating donors, volunteers, partners, and sometimes grant pipelines. You may not “sell” in a classic sense, but you still need ownership, history, and follow-through across people.",
    workedExampleSecondary:
      "Worked example: a regional nonprofit. Before CRM, a departing development lead left relationship history in personal spreadsheets. After CRM, major-donor touches and volunteer shifts live in one system the next hire can inherit.",
    challenges: [
      {
        id: "history",
        title: "Relationship history is fragile",
        pain: "Staff turnover erases who was promised what.",
        crmHelps:
          "Every meaningful touch is logged on the person or organization record.",
      },
      {
        id: "ownership",
        title: "Unclear outreach ownership",
        pain: "Two people email the same donor — or nobody does.",
        crmHelps:
          "Explicit owners and next dates prevent both collisions and silence.",
      },
      {
        id: "forced-sales",
        title: "Forced B2B sales templates",
        pain: "Deal stages that do not match donor or volunteer journeys.",
        crmHelps:
          "Model the real journey (stewardship, engagement, grants) instead of copying a software sales board.",
      },
      {
        id: "tool-fit",
        title: "General CRM vs donor platforms",
        pain: "Buying the wrong shape of tool for gift processing vs relationship ops.",
        crmHelps:
          "Separate “relationship system of record” needs from specialized fundraising operations before you buy.",
      },
    ],
    outcomes: [
      {
        id: "continuity",
        title: "Continuity across staff changes",
        description: "Relationships survive turnover.",
      },
      {
        id: "respectful",
        title: "More respectful outreach",
        description: "Owners and history reduce duplicate asks.",
      },
      {
        id: "clarity",
        title: "Clearer program pipelines",
        description: "Grants or partnerships get stages that match reality.",
      },
    ],
    capabilityNeeds: [
      {
        id: "contacts",
        title: "People & organization records",
        description: "Donors, volunteers, partners in one model.",
        priority: "must",
        href: "/use-cases/contact-management/",
      },
      {
        id: "history",
        title: "Interaction history",
        description: "Notes and outreach logged consistently.",
        priority: "must",
        href: "/use-cases/relationship-management/",
      },
      {
        id: "owners",
        title: "Ownership & tasks",
        description: "Who follows up, by when.",
        priority: "must",
      },
      {
        id: "segments",
        title: "Simple segmentation",
        description: "Lists for campaigns without a data warehouse.",
        priority: "nice",
      },
      {
        id: "pipeline",
        title: "Grant / partner pipeline",
        description: "When opportunities truly have stages.",
        priority: "nice",
        href: "/use-cases/pipeline-management/",
      },
    ],
    workflowSteps: [
      {
        id: "identify",
        label: "Identify",
        detail: "Person or org enters the system with a role (donor, volunteer…).",
      },
      {
        id: "engage",
        label: "Engage",
        detail: "Touches are logged with an owner.",
      },
      {
        id: "steward",
        label: "Steward",
        detail: "Next asks respect history and timing.",
      },
      {
        id: "report",
        label: "Report",
        detail: "Activity views support board or program updates.",
      },
      {
        id: "renew",
        label: "Renew",
        detail: "Renewals and re-engagement get planned tasks.",
      },
    ],
    needsVisual: {
      src: "/for/for-nonprofits-needs.png",
      alt: "Nonprofit CRM needs: fragile history, outreach ownership, journey fit, and choosing general CRM vs donor tools.",
      caption:
        "Nonprofit CRM value is relationship continuity — not forcing a B2B sales template.",
    },
    workflowVisual: {
      src: "/for/for-nonprofits-workflow.png",
      alt: "Nonprofit CRM workflow: identify, engage, steward, report, renew.",
      caption: "A stewardship-oriented loop for donors, volunteers, and partners.",
    },
    faq: [
      {
        question: "Is a sales CRM right for nonprofits?",
        answer:
          "It can be when you need shared relationship history and light pipelines. If gift processing, receipts, and donor journeys dominate, compare purpose-built nonprofit platforms too.",
      },
      {
        question: "What should we configure first?",
        answer:
          "People, organizations, owners, and a logging habit. Fancy journey automation comes after history is trusted.",
      },
    ],
  },

  "growing-teams": {
    whoThisIsFor:
      "Teams that outgrew informal selling — spreadsheets, Slack status, and hallway updates no longer scale. You need light process that new hires can learn quickly, without freezing the team in bureaucracy.",
    workedExampleSecondary:
      "Worked example: an eight-person sales pod. Before CRM, two hires could not see deal status on the sheet. After CRM, four stages and mandatory next steps stick — forecast categories wait until hygiene is real for a month.",
    challenges: [
      {
        id: "sheet-break",
        title: "The spreadsheet breaks under concurrency",
        pain: "Conflicts, lost rows, and no single owner per deal.",
        crmHelps:
          "CRM becomes the system of record with required ownership fields.",
      },
      {
        id: "onboarding",
        title: "New hires cannot inherit context",
        pain: "Ramp depends on shadowing and Slack archaeology.",
        crmHelps:
          "History and next steps are visible on day one.",
      },
      {
        id: "manager-blind",
        title: "Managers coach from anecdotes",
        pain: "No shared board means no consistent pipeline review.",
        crmHelps:
          "A trusted board supports coaching without status theater.",
      },
      {
        id: "overprocess",
        title: "Big-bang process kills adoption",
        pain: "Too many fields on day one; people revert to old habits.",
        crmHelps:
          "Launch tiny; expand configuration only after habits stick.",
      },
    ],
    outcomes: [
      {
        id: "shared",
        title: "Shared pipeline truth",
        description: "Everyone sees the same stages and owners.",
      },
      {
        id: "faster-ramp",
        title: "Faster ramp for new hires",
        description: "Context is in the system, not only in people’s heads.",
      },
      {
        id: "scalable",
        title: "Process that can deepen later",
        description: "Automation and forecast come after hygiene.",
      },
    ],
    capabilityNeeds: [
      {
        id: "pipeline",
        title: "Stable stage definitions",
        description: "Few stages, clearly explained.",
        priority: "must",
        href: "/use-cases/pipeline-management/",
      },
      {
        id: "owners",
        title: "Mandatory owners & next steps",
        description: "No orphan deals.",
        priority: "must",
      },
      {
        id: "leads",
        title: "Lead routing",
        description: "As volume grows past inbox triage.",
        priority: "must",
        href: "/use-cases/lead-management/",
      },
      {
        id: "reporting",
        title: "Reporting after hygiene",
        description: "Do not demand forecasts on dirty data.",
        priority: "nice",
        href: "/use-cases/reporting/",
      },
      {
        id: "automation",
        title: "Automation after habits",
        description: "Automate only what people already do.",
        priority: "nice",
        href: "/use-cases/sales-automation/",
      },
    ],
    workflowSteps: [
      {
        id: "admit",
        label: "Admit the break",
        detail: "Name the spreadsheet / Slack failure modes.",
      },
      {
        id: "minimal",
        label: "Minimal CRM",
        detail: "Four stages, owner required, weekly review.",
      },
      {
        id: "habit",
        label: "Habit",
        detail: "Measure logging and next-step completeness.",
      },
      {
        id: "report",
        label: "Report",
        detail: "Add forecast only when data is trusted.",
      },
      {
        id: "automate",
        label: "Automate",
        detail: "Layer automation on stable workflows.",
      },
    ],
    needsVisual: {
      src: "/for/for-growing-teams-needs.png",
      alt: "Growing-team CRM needs: spreadsheet breakage, hire ramp, manager visibility, and avoiding over-process.",
      caption:
        "Growing teams need shared truth with a light process — then depth later.",
    },
    workflowVisual: {
      src: "/for/for-growing-teams-workflow.png",
      alt: "Growing-team CRM adoption workflow from admitting spreadsheet failure through minimal CRM, habits, reporting, and automation.",
      caption: "Adopt CRM in layers so process deepens without killing adoption.",
    },
    faq: [
      {
        question: "How do growing teams avoid CRM shelfware?",
        answer:
          "Launch with a tiny required field set, train on real deals, and review adoption weekly. Expand configuration only after the basics stick.",
      },
      {
        question: "When do we add forecasting?",
        answer:
          "After next steps and stages are trustworthy for several review cycles. Forecast on fiction trains the wrong habits.",
      },
    ],
  },

  "sales-teams": {
    whoThisIsFor:
      "Distributed AEs, SDRs, and managers who cannot rely on hallway updates. You need shared pipeline truth, visible activity, and async coaching across time zones.",
    workedExampleSecondary:
      "Worked example: a remote team across three time zones. Before CRM, Friday reviews were Slack status essays. After CRM, managers coach from stages, next steps, and activity gaps on the board.",
    challenges: [
      {
        id: "hallway",
        title: "Hallway updates do not exist",
        pain: "Remote work removes informal visibility managers used to rely on.",
        crmHelps:
          "Pipeline and activity become the shared operating picture.",
      },
      {
        id: "private-sheets",
        title: "Reps keep private trackers",
        pain: "Forecasts and coaching miss reality.",
        crmHelps:
          "CRM as system of record — inspected before meetings — replaces private sheets.",
      },
      {
        id: "async",
        title: "Coaching is hard across time zones",
        pain: "Live standups punish someone every week.",
        crmHelps:
          "Managers review deals and activity on their schedule with the same rubric.",
      },
      {
        id: "outbound",
        title: "High activity without visibility",
        pain: "SDR/AE outbound volume is invisible until results slip.",
        crmHelps:
          "Engagement workflows and activity capture show effort and gaps early.",
      },
    ],
    outcomes: [
      {
        id: "shared",
        title: "Shared pipeline across regions",
        description: "One board, many time zones.",
      },
      {
        id: "async-coach",
        title: "Async coaching that works",
        description: "Managers inspect CRM before asking for updates.",
      },
      {
        id: "activity",
        title: "Visible activity discipline",
        description: "Follow-ups and outreach are inspectable.",
      },
    ],
    capabilityNeeds: [
      {
        id: "pipeline",
        title: "Single pipeline truth",
        description: "Stages and owners everyone trusts.",
        priority: "must",
        href: "/use-cases/pipeline-management/",
      },
      {
        id: "activity",
        title: "Activity visibility",
        description: "Calls, emails, and next steps on the record.",
        priority: "must",
        href: "/use-cases/sales-engagement/",
      },
      {
        id: "reporting",
        title: "Manager reporting",
        description: "Reviews without reconstructing status.",
        priority: "must",
        href: "/use-cases/reporting/",
      },
      {
        id: "mobile",
        title: "Work-from-anywhere UX",
        description: "Logging must be easy or it will not happen.",
        priority: "must",
      },
      {
        id: "sequences",
        title: "Sequences / dialer",
        description: "When outbound volume is real.",
        priority: "nice",
        href: "/use-cases/sales-engagement/",
      },
    ],
    workflowSteps: [
      {
        id: "log",
        label: "Log",
        detail: "Activity lands on the deal/contact automatically when possible.",
      },
      {
        id: "advance",
        label: "Advance",
        detail: "Stages update with clear exit criteria.",
      },
      {
        id: "inspect",
        label: "Inspect",
        detail: "Managers review CRM before 1:1s.",
      },
      {
        id: "coach",
        label: "Coach",
        detail: "Gaps and stuck deals drive coaching topics.",
      },
      {
        id: "forecast",
        label: "Forecast",
        detail: "Weekly forecast from the same trusted board.",
      },
    ],
    needsVisual: {
      src: "/for/for-sales-teams-needs.png",
      alt: "Remote sales CRM needs: no hallway updates, private sheets, async coaching, and outbound activity visibility.",
      caption:
        "Remote sales CRM replaces hallway visibility with shared pipeline and activity truth.",
    },
    workflowVisual: {
      src: "/for/for-sales-teams-workflow.png",
      alt: "Remote sales CRM workflow: log, advance, inspect, coach, forecast across time zones.",
      caption: "An async-friendly operating rhythm for distributed revenue teams.",
    },
    faq: [
      {
        question: "What CRM features matter most for remote sales?",
        answer:
          "Shared pipeline, reliable activity capture, reporting managers can trust, and integrations with email/calendar. Fancy dashboards mean little if stages are fiction.",
      },
      {
        question: "How do managers avoid status-meeting theater?",
        answer:
          "Inspect CRM first. Meetings discuss exceptions and coaching — not “any updates?” for every deal.",
      },
    ],
  },
};
