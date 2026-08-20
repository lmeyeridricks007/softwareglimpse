import type { IndustryHubProfile } from "@/domain";

type Depth = Pick<
  IndustryHubProfile,
  | "overview"
  | "whoThisIsFor"
  | "whatMattersIntro"
  | "workedExample"
  | "workedExampleSecondary"
  | "tagline"
  | "glance"
  | "challenges"
  | "outcomes"
  | "capabilityNeeds"
  | "workflowSteps"
  | "needsVisual"
  | "workflowVisual"
  | "heroVisual"
  | "faq"
>;

/**
 * Depth layers for industry hub pages.
 * Educational / operational — no invented rankings, prices, or product endorsements.
 */
export const industryDepthBySlug: Record<string, Depth> = {
  "financial-services": {
    tagline:
      "Run advisory relationships, sales pipelines, and compliance-aware admin from one shared client system.",
    overview:
      "Financial-services CRM work spans relationship-led advisory, opportunity pipelines, and often both at once. Fit depends on how client context, ownership, and access controls map to your book of business — not on a generic “finance CRM” label.",
    whoThisIsFor:
      "Advisory firms, wealth and insurance teams, B2B financial-product sellers, and operations admins who need shared client history with role-aware access. Buyers are typically practice leads, sales managers, or ops owners who must satisfy internal governance without blocking day-to-day follow-up.",
    whatMattersIntro:
      "Prioritize multi-pipeline design, household or account hierarchy, activity discipline, and administration that matches how sensitive client data is handled in your organization. Verify security and compliance requirements with vendors — they vary by firm and jurisdiction.",
    workedExample:
      "Worked example: a regional advisory practice with planners and a small BD team. Before CRM, household notes lived in email and planner notebooks while new-business opportunities sat in a separate spreadsheet. After CRM, household contacts, open opportunities, and next reviews share one account record with clear owners.",
    workedExampleSecondary:
      "Worked example: a B2B specialty-finance sales pod. Before CRM, multi-stakeholder deals stalled because no one owned the next internal handoff. After CRM, stages encode credit, legal, and relationship checkpoints — Friday reviews start from stuck deals, not from Slack archaeology.",
    glance: {
      primaryGoal:
        "Shared client context across advisory and opportunity pipelines",
      commonPriorities: [
        "Account & household context",
        "Multi-pipeline stages",
        "Activity ownership",
        "Permissions & admin",
        "Reporting for pipeline health",
      ],
      teamTypes: [
        "Advisory / relationship management",
        "Sales / business development",
        "Practice operations",
        "Compliance-aware administration",
      ],
    },
    challenges: [
      {
        id: "split-systems",
        title: "Advisory and sales live in separate tools",
        pain: "Client history and opportunity status disagree, so coverage and forecasting both suffer.",
        crmHelps:
          "One account record can hold relationship notes and open opportunities with distinct pipelines and shared ownership rules.",
      },
      {
        id: "household-context",
        title: "Household and account context is fragmented",
        pain: "Planners rebuild who belongs together from memory when a colleague is out.",
        crmHelps:
          "Related contacts and roles sit on the account so anyone covering the book sees the same map.",
      },
      {
        id: "access-discipline",
        title: "Access and visibility are unclear",
        pain: "Teams either overshare sensitive client detail or under-share and recreate silos.",
        crmHelps:
          "Role-based permissions and team boundaries let you share process without dumping every field to every seat — confirm controls with your vendor and internal policy.",
      },
      {
        id: "stage-honesty",
        title: "Stages do not match real approvals",
        pain: "Deals jump stages while credit, compliance, or partner steps are still pending.",
        crmHelps:
          "Pipelines encode the checkpoints your firm actually uses, so reviews focus on blockers instead of wishful status.",
      },
    ],
    outcomes: [
      {
        id: "one-client-truth",
        title: "One trusted client record",
        description:
          "Advisors and sellers stop rebuilding household and account context from inboxes.",
      },
      {
        id: "pipeline-clarity",
        title: "Honest multi-pipeline visibility",
        description:
          "New business and relationship work can run as separate boards without losing shared account history.",
      },
      {
        id: "owned-next-steps",
        title: "Owned next steps on every open item",
        description:
          "Coverage and coaching start from tasks and stages, not from “who spoke last?”",
      },
      {
        id: "admin-readiness",
        title: "Clearer admin ownership",
        description:
          "Permissions, fields, and data quality have a named owner before the team scales seats.",
      },
    ],
    capabilityNeeds: [
      {
        id: "accounts-contacts",
        title: "Accounts, contacts & relationships",
        description:
          "Durable household/account maps with roles and history.",
        priority: "must",
        href: "/capabilities/contact-management/",
      },
      {
        id: "multi-pipeline",
        title: "Custom / multiple pipelines",
        description:
          "Separate boards for advisory, new business, and renewals when needed.",
        priority: "must",
        href: "/capabilities/pipeline-management/",
      },
      {
        id: "activity",
        title: "Activity logging & tasks",
        description:
          "Notes, meetings, and next dates attached to the right record.",
        priority: "must",
      },
      {
        id: "admin-security",
        title: "Permissions & administration",
        description:
          "Team/role access, field discipline, and auditability matched to your policy.",
        priority: "must",
        href: "/use-cases/security-administration/",
      },
      {
        id: "reporting",
        title: "Pipeline & activity reporting",
        description:
          "Enough for weekly reviews and leadership snapshots — not a BI rebuild on day one.",
        priority: "nice",
        href: "/capabilities/reporting/",
      },
      {
        id: "integrations",
        title: "Stack integrations",
        description:
          "Connect email/calendar first; add core ops systems only when ownership is clear.",
        priority: "nice",
        href: "/use-cases/integrations/",
      },
    ],
    workflowSteps: [
      {
        id: "prospect",
        label: "Prospect / client acquisition",
        detail:
          "Prospect or client inquiry lands on an account/contact with a named owner and source.",
        goal: "Capture every inbound or outbound inquiry into a shared system of record.",
        useCaseSlugs: ["high-volume-lead-management", "pipeline-led-sales"],
        capabilitySlugs: ["contact-management", "pipeline-management"],
        requirementSlugs: ["track-client-interactions"],
        featureSlugs: ["lead-management", "contact-management"],
      },
      {
        id: "qualify",
        label: "Qualification",
        detail:
          "Route to advisory relationship work or a sales pipeline based on intent and fit.",
        goal: "Decide whether the inquiry belongs in relationship management or opportunity work.",
        useCaseSlugs: ["advisory-relationship-management", "pipeline-led-sales"],
        capabilitySlugs: ["contact-management", "pipeline-management"],
        requirementSlugs: ["track-client-interactions"],
        featureSlugs: ["lead-management", "pipeline-management"],
      },
      {
        id: "account",
        label: "Relationship / account creation",
        detail:
          "Create or enrich household/account context so later stages inherit relationship truth.",
        goal: "Establish durable client/account context before advancing opportunities.",
        useCaseSlugs: ["advisory-relationship-management"],
        capabilitySlugs: ["contact-management"],
        requirementSlugs: ["track-client-interactions"],
        featureSlugs: ["contact-management", "custom-fields"],
      },
      {
        id: "opportunity",
        label: "Opportunity / need identification",
        detail:
          "Surface the commercial or advisory need and place it on an honest pipeline stage.",
        goal: "Make the next commercial or advisory need visible with clear ownership.",
        useCaseSlugs: ["pipeline-led-sales", "complex-sales-processes"],
        capabilitySlugs: ["pipeline-management"],
        requirementSlugs: ["separate-sales-processes", "track-opportunity-progress"],
        featureSlugs: ["pipeline-management", "deal-management", "custom-pipelines"],
      },
      {
        id: "follow-up",
        label: "Follow-up / activity",
        detail:
          "Log touches and next actions so coverage does not depend on one person’s inbox.",
        goal: "Keep relationship and opportunity activity current between meetings.",
        useCaseSlugs: ["advisory-relationship-management", "complex-sales-processes"],
        capabilitySlugs: ["workflow-automation", "contact-management"],
        requirementSlugs: ["track-client-interactions", "automate-lead-follow-up"],
        featureSlugs: ["workflow-automation", "email-sync"],
      },
      {
        id: "ongoing",
        label: "Ongoing relationship management",
        detail:
          "Maintain household/account context across advisory and sales motions over time.",
        goal: "Sustain relationship context beyond a single opportunity cycle.",
        useCaseSlugs: ["advisory-relationship-management"],
        capabilitySlugs: ["contact-management"],
        requirementSlugs: ["track-client-interactions"],
        featureSlugs: ["contact-management", "custom-fields"],
      },
      {
        id: "reporting",
        label: "Reporting / oversight",
        detail:
          "Review pipeline health, activity gaps, and ownership without rebuilding spreadsheets.",
        goal: "Give leaders visibility into stuck work and missing next touches.",
        useCaseSlugs: ["complex-sales-processes", "growing-teams"],
        capabilitySlugs: ["reporting"],
        requirementSlugs: ["forecast-revenue"],
        featureSlugs: ["reporting", "forecasting"],
      },
    ],
    heroVisual: {
      src: "/industries/financial-services-hero.png",
      alt: "Educational diagram of financial-services CRM: shared client accounts feeding advisory and sales pipelines with permission boundaries.",
      caption:
        "Advisory and sales can share client truth without sharing every field with every seat.",
    },
    needsVisual: {
      src: "/industries/financial-services-needs.png",
      alt: "Diagram mapping financial-services pains — split tools, fragmented households, unclear access, dishonest stages — to CRM fixes.",
      caption:
        "What usually breaks in financial-services CRM adoption — and how process design addresses it.",
    },
    workflowVisual: {
      src: "/industries/financial-services-workflow.png",
      alt: "Financial-services CRM workflow from prospect capture through relationship management and reporting.",
      caption:
        "A practical loop for multi-pipeline financial-services teams — from acquisition to ongoing oversight.",
    },
    faq: [
      {
        question: "Do financial-services teams need an industry-specific CRM?",
        answer:
          "Not always. Many firms succeed with a general CRM configured for accounts, multiple pipelines, and strong permissions. Choose purpose-built tools when your workflow depends on features a general CRM cannot model — verify fit with shortlisted vendors.",
      },
      {
        question: "How should we handle compliance and security in CRM selection?",
        answer:
          "Treat security as a requirements checklist: access controls, auditability, retention/export, identity, and vendor documentation. Needs vary by organization and jurisdiction — this page is educational, not legal advice. Confirm requirements with vendors and your compliance owners.",
      },
      {
        question: "Should advisory and sales share one CRM?",
        answer:
          "Usually yes for client history, with separate pipelines or stages when the work differs. Shared accounts plus clear ownership beat two systems that disagree about the same household.",
      },
      {
        question: "What should we configure before adding automation?",
        answer:
          "Accounts/contacts, owners, honest stages, and a logging habit. Automate repetitive follow-ups only after the board is trusted.",
      },
    ],
  },

  saas: {
    tagline:
      "Keep pipeline, product-qualified leads, and expansion work visible as the go-to-market motion changes.",
    overview:
      "SaaS CRM usage centers on inbound and outbound pipeline, demo-to-close discipline, and later expansion or renewal visibility. Requirements shift as you move from founder-led sales to specialized AEs, CSMs, and RevOps — plan for that growth without overbuilding on day one.",
    whoThisIsFor:
      "Founders, AEs, SDRs, customer success, and early RevOps owners at B2B SaaS companies. Buyers need a system the GTM team will update while the offer, ICP, and stages are still evolving.",
    whatMattersIntro:
      "Prioritize fast capture of demos and trials, stage definitions that match how you actually sell, and handoffs into onboarding or success. Heavy customization and forecasting sophistication come after hygiene is real.",
    workedExample:
      "Worked example: a Series A SaaS team. Before CRM, demo requests sat in a shared inbox and Notion. After CRM, every demo has an owner, stage, and next step — AE coaching starts from the board instead of reconstructing status in Slack.",
    workedExampleSecondary:
      "Worked example: a PLG-assisted sales motion. Before CRM, product-qualified signals never reached the AE with context. After CRM, PQLs land as owned leads with source fields so outbound does not restart discovery from scratch.",
    glance: {
      primaryGoal: "Pipeline truth from demo to close (and into expansion)",
      commonPriorities: [
        "Lead & demo capture",
        "Pipeline stages",
        "Email / calendar sync",
        "Handoff to success",
        "Light reporting",
      ],
      teamTypes: ["SDR / AE", "Founder-led sales", "Customer success", "RevOps"],
    },
    challenges: [
      {
        id: "inbound-chaos",
        title: "Inbound demos lack owners",
        pain: "Warm product interest cools while the team argues who should reply.",
        crmHelps:
          "Routing rules and mandatory owners put every demo or trial on a named seat the same day.",
      },
      {
        id: "stage-drift",
        title: "Stages change every quarter",
        pain: "Historical pipeline becomes meaningless when the board is redesigned weekly.",
        crmHelps:
          "Keep a short stage set the team can explain; version changes deliberately so reporting stays comparable.",
      },
      {
        id: "handoff-gap",
        title: "Closed-won context dies at handoff",
        pain: "CS and onboarding rebuild buyer needs from sales Slack threads.",
        crmHelps:
          "Won deals carry notes, stakeholders, and next actions into the success process.",
      },
      {
        id: "tool-sprawl",
        title: "GTM tools disagree on the same account",
        pain: "Marketing, sales, and success each keep a partial truth.",
        crmHelps:
          "CRM becomes the account system of record; other tools sync into it with clear field ownership.",
      },
    ],
    outcomes: [
      {
        id: "same-day-response",
        title: "Faster owned response on inbound",
        description:
          "Demos and trials stop sitting unowned in shared inboxes.",
      },
      {
        id: "coachable-board",
        title: "A coachable pipeline board",
        description:
          "Managers review stages and next steps instead of verbal updates.",
      },
      {
        id: "cleaner-handoffs",
        title: "Cleaner sales-to-success handoffs",
        description:
          "Onboarding inherits context instead of restarting discovery.",
      },
      {
        id: "scale-ready",
        title: "Room to add seats without rebuilds",
        description:
          "New AEs inherit stages and fields instead of inventing parallel sheets.",
      },
    ],
    capabilityNeeds: [
      {
        id: "leads",
        title: "Lead & contact capture",
        description: "Inbound forms, demos, and trials become owned records.",
        priority: "must",
        href: "/capabilities/lead-management/",
      },
      {
        id: "pipeline",
        title: "Pipeline management",
        description: "A few stages that match how you actually sell.",
        priority: "must",
        href: "/capabilities/pipeline-management/",
      },
      {
        id: "email-sync",
        title: "Email / calendar sync",
        description: "Reduce double entry so logging happens during the sale.",
        priority: "must",
      },
      {
        id: "tasks",
        title: "Tasks & next steps",
        description: "Due dates on deals so follow-ups do not live in personal reminders.",
        priority: "must",
      },
      {
        id: "reporting",
        title: "Pipeline reporting",
        description: "Conversion and stuck-deal views for weekly GTM reviews.",
        priority: "nice",
        href: "/capabilities/reporting/",
      },
      {
        id: "automation",
        title: "Light sales automation",
        description: "Sequences and alerts after the team trusts the data.",
        priority: "nice",
        href: "/capabilities/workflow-automation/",
      },
    ],
    workflowSteps: [
      {
        id: "capture",
        label: "Capture",
        detail: "Demo, trial, or outbound reply becomes a lead/contact with source.",
      },
      {
        id: "qualify",
        label: "Qualify",
        detail: "SDR or AE confirms fit and books the next conversation.",
      },
      {
        id: "advance",
        label: "Advance",
        detail: "Move stages on real proof (demo done, champion, commercial review).",
      },
      {
        id: "close",
        label: "Close",
        detail: "Won/lost with reason codes the team will actually fill in.",
      },
      {
        id: "hand-off",
        label: "Hand off",
        detail: "Pass stakeholders and goals to onboarding or customer success.",
      },
    ],
    heroVisual: {
      src: "/industries/saas-hero.png",
      alt: "Educational diagram of SaaS CRM from inbound demo capture through pipeline stages to success handoff.",
      caption:
        "SaaS CRM value is owned pipeline and clean handoffs — not feature depth on day one.",
    },
    needsVisual: {
      src: "/industries/saas-needs.png",
      alt: "Diagram of SaaS CRM pains — unowned inbound, stage drift, handoff gaps, tool sprawl — mapped to CRM fixes.",
      caption:
        "Common SaaS GTM breaks and how a disciplined CRM setup addresses them.",
    },
    workflowVisual: {
      src: "/industries/saas-workflow.png",
      alt: "Five-step SaaS CRM workflow: capture, qualify, advance, close, hand off.",
      caption: "A practical demo-to-success loop for B2B SaaS teams.",
    },
    faq: [
      {
        question: "When does a SaaS startup need a CRM?",
        answer:
          "When more than one person sells or follows up, or when inbound volume outpaces founder memory. A shared sheet can work briefly; CRM becomes necessary when ownership and stage truth matter weekly.",
      },
      {
        question: "How is SaaS CRM different from generic SMB CRM?",
        answer:
          "The objects are similar, but SaaS motions often add demo/trial sources, product-qualified signals, and a sales-to-success handoff. Configure for that path rather than copying an enterprise template.",
      },
      {
        question: "Should marketing automation replace CRM?",
        answer:
          "No. Marketing automation may nurture leads; CRM owns accounts, opportunities, and revenue stages. Integrate them with clear field ownership instead of running two competing systems of record.",
      },
      {
        question: "Where does sales intelligence fit for SaaS GTM?",
        answer:
          "After CRM ownership is real. Contact data, enrichment, and sequencing tools help SDR/AE pods build and work lists — they should sync into CRM, not become a second pipeline. Start from prospecting and sales engagement use cases, then shortlist sales intelligence software.",
      },
    ],
  },

  "small-business": {
    tagline:
      "Industry-agnostic SMB CRM ops: shared contacts, a lean pipeline, and follow-ups the whole shop will keep.",
    overview:
      "Within the industries taxonomy, “small business” means lean, cross-vertical CRM operations — owner-operators and small teams selling across many industries without a dedicated RevOps function. It is not the same as the business-type page at /for/small-business; here the focus is how SMB-shaped buyers evaluate CRM inside the industry hub set.",
    whoThisIsFor:
      "Owner-led and small multi-person shops (services, trade-adjacent, local B2B) that need CRM discipline without industry-specific modules. Buyers want one shared customer memory and a pipeline their team will update between jobs.",
    whatMattersIntro:
      "Optimize for adoption and clarity: few stages, mandatory owners, email sync, and a weekly review habit. Skip vertical complexity until the basics stick — industry-specific hubs cover specialized workflows when you need them.",
    workedExample:
      "Worked example: a five-person professional services shop spanning mixed clients. Before CRM, quotes and callbacks lived in personal inboxes. After CRM, every open opportunity has an owner, stage, and next date — coverage works when someone is on-site.",
    workedExampleSecondary:
      "Worked example: two partners sharing a book of accounts. Before CRM, each kept a private list and duplicated outreach. After CRM, one contact record and a short stage board stop double-quoting the same prospect.",
    glance: {
      primaryGoal: "Lean shared pipeline and contact memory",
      commonPriorities: [
        "Ease of adoption",
        "Contact history",
        "Simple stages",
        "Tasks & reminders",
        "Low admin overhead",
      ],
      teamTypes: [
        "Owner-operators",
        "Small sales / estimating pods",
        "Office coordinators",
      ],
    },
    challenges: [
      {
        id: "personal-lists",
        title: "Customer lists stay personal",
        pain: "Partners and staff cannot cover accounts without asking who spoke last.",
        crmHelps:
          "Contacts and deals live in one place with owners anyone can see.",
      },
      {
        id: "overbuilt-setup",
        title: "Setup tries to match enterprise CRM",
        pain: "Too many fields and stages kill logging before value appears.",
        crmHelps:
          "A short stage set and required next steps deliver value in days, not months.",
      },
      {
        id: "follow-up-drops",
        title: "Follow-ups slip between jobs",
        pain: "Warm leads cool while the team is busy delivering.",
        crmHelps:
          "Tasks on the record survive job-site chaos better than sticky notes.",
      },
      {
        id: "friday-guesswork",
        title: "Weekly reviews are guesswork",
        pain: "Partners ask for verbal status because no board is trusted.",
        crmHelps:
          "A simple pipeline view makes the review about next actions.",
      },
    ],
    outcomes: [
      {
        id: "shared-book",
        title: "A shared book of business",
        description:
          "Partners stop maintaining private prospect lists.",
      },
      {
        id: "fewer-drops",
        title: "Fewer dropped callbacks",
        description:
          "Next steps remain visible when delivery work is loud.",
      },
      {
        id: "faster-coverage",
        title: "Easier coverage when someone is out",
        description:
          "History and ownership travel with the record.",
      },
      {
        id: "hire-ready",
        title: "Simpler onboarding for the next hire",
        description:
          "New people inherit stages and notes instead of shadowing for weeks.",
      },
    ],
    capabilityNeeds: [
      {
        id: "contacts",
        title: "Contact & company records",
        description: "Durable history for people and accounts you sell to.",
        priority: "must",
        href: "/capabilities/contact-management/",
      },
      {
        id: "pipeline",
        title: "Simple pipeline stages",
        description: "A few stages everyone can explain in one sentence.",
        priority: "must",
        href: "/capabilities/pipeline-management/",
      },
      {
        id: "email",
        title: "Email / calendar sync",
        description: "Cut double entry so the team actually logs work.",
        priority: "must",
      },
      {
        id: "tasks",
        title: "Tasks & reminders",
        description: "Next actions with due dates on the deal or contact.",
        priority: "must",
      },
      {
        id: "mobile",
        title: "Mobile access",
        description: "Useful when work happens away from a desk.",
        priority: "nice",
      },
      {
        id: "reporting",
        title: "Basic pipeline reporting",
        description: "Enough for a weekly partner review.",
        priority: "nice",
        href: "/capabilities/reporting/",
      },
    ],
    workflowSteps: [
      {
        id: "capture",
        label: "Capture",
        detail: "Inquiry lands in CRM from form, email, or a quick manual add.",
      },
      {
        id: "own",
        label: "Own",
        detail: "One person owns the follow-up — no orphan records.",
      },
      {
        id: "advance",
        label: "Advance",
        detail: "Move stages only when real progress happens (quote sent, meeting held).",
      },
      {
        id: "review",
        label: "Review",
        detail: "Weekly board check: stuck deals and missing next steps.",
      },
      {
        id: "deliver",
        label: "Deliver",
        detail: "Won work carries notes into delivery or billing handoff.",
      },
    ],
    heroVisual: {
      src: "/industries/small-business-hero.png",
      alt: "Educational diagram of lean SMB CRM operations: shared contacts, short pipeline, and owned follow-ups across a small team.",
      caption:
        "Industry-hub SMB focus: lean ops and adoption — not a duplicate of the /for/small-business business-type page.",
    },
    needsVisual: {
      src: "/industries/small-business-needs.png",
      alt: "Diagram of SMB industry-hub pains — personal lists, overbuilt setup, slipped follow-ups, guesswork reviews — mapped to CRM fixes.",
      caption:
        "What breaks for lean multi-person shops — and how a light CRM setup helps.",
    },
    workflowVisual: {
      src: "/industries/small-business-workflow.png",
      alt: "Five-step small-business industry CRM workflow: capture, own, advance, review, deliver.",
      caption:
        "A practical CRM loop for industry-agnostic SMB teams.",
    },
    faq: [
      {
        question:
          "How is this different from /for/small-business?",
        answer:
          "That page is a business-type hub about company shape and team size. This industry hub sits in the industries taxonomy and covers lean, cross-vertical SMB CRM operations alongside other vertical hubs. Use both when relevant.",
      },
      {
        question: "Should we pick an industry-specific CRM instead?",
        answer:
          "If your workflow is highly vertical (e.g. listings, claims intake, job sites), start with that industry hub. If you sell across mixed clients with a small team, lean general CRM usually fits first.",
      },
      {
        question: "What should we avoid on day one?",
        answer:
          "Long stage lists, mandatory custom fields nobody understands, and automation before logging habits exist. Add complexity only after the board is trusted.",
      },
    ],
  },

  "real-estate": {
    tagline:
      "Track leads, listings-side relationships, and transaction follow-through without losing context between showings.",
    overview:
      "Real-estate CRM work revolves around lead capture, nurture through long cycles, and coordination across agents, brokers, and transaction partners. The operational need is owned follow-up and shared property/client context — not a generic sales board alone.",
    whoThisIsFor:
      "Agents, teams, brokerages, and transaction coordinators who juggle inbound leads, active buyers/sellers, and post-agreement tasks. Buyers need mobile-friendly logging and clear ownership across a high-touch, appointment-heavy week.",
    whatMattersIntro:
      "Prioritize lead routing, contact history tied to properties or transactions, reminders that survive showing days, and handoffs to transaction coordination. Treat any MLS or marketing integrations as requirements to verify with vendors — depth varies.",
    workedExample:
      "Worked example: a four-agent residential team. Before CRM, portal leads sat in individual inboxes and died over weekends. After CRM, every lead has an owner, source, and next touch — the ISA or team lead can see unanswered inquiries Monday morning.",
    workedExampleSecondary:
      "Worked example: a brokerage transaction desk. Before CRM, contract dates lived in personal calendars. After CRM, key milestones and partner contacts sit on the deal so coverage does not depend on one coordinator’s phone.",
    glance: {
      primaryGoal: "Owned lead follow-up and transaction continuity",
      commonPriorities: [
        "Lead capture & routing",
        "Contact history",
        "Tasks & reminders",
        "Mobile logging",
        "Transaction milestones",
      ],
      teamTypes: [
        "Agents / teams",
        "Inside sales / ISA",
        "Brokerage ops",
        "Transaction coordinators",
      ],
    },
    challenges: [
      {
        id: "lead-leakage",
        title: "Portal and referral leads leak",
        pain: "Speed-to-lead collapses when inquiries land in personal inboxes.",
        crmHelps:
          "Central capture with assignment and SLA-style next steps keeps warm inquiries owned.",
      },
      {
        id: "long-nurture",
        title: "Long nurture cycles go cold",
        pain: "Buyers months from purchase fall off personal reminder systems.",
        crmHelps:
          "Tasks and stage-based nurture keep future clients visible without daily inbox archaeology.",
      },
      {
        id: "showing-chaos",
        title: "Showing weeks erase logging",
        pain: "Notes from conversations never make it back to a shared record.",
        crmHelps:
          "Mobile-friendly notes and tasks on the contact preserve context between appointments.",
      },
      {
        id: "partner-handoffs",
        title: "Partner and TC handoffs drop details",
        pain: "Lenders, inspectors, and coordinators restart from incomplete threads.",
        crmHelps:
          "Transaction records carry stakeholders, dates, and open items into the next seat.",
      },
    ],
    outcomes: [
      {
        id: "faster-lead-response",
        title: "Faster owned lead response",
        description:
          "Inquiries stop dying in personal inboxes over weekends.",
      },
      {
        id: "nurture-visibility",
        title: "Visible long-cycle nurture",
        description:
          "Future buyers and sellers stay on a board with next touches.",
      },
      {
        id: "shared-context",
        title: "Shared client context across the team",
        description:
          "Coverage works when an agent is in showings all day.",
      },
      {
        id: "cleaner-closings",
        title: "Cleaner path into transaction work",
        description:
          "Key dates and partners are not trapped in one person’s calendar.",
      },
    ],
    capabilityNeeds: [
      {
        id: "leads",
        title: "Lead capture & assignment",
        description: "Inbound portal and referral leads become owned records fast.",
        priority: "must",
        href: "/capabilities/lead-management/",
      },
      {
        id: "contacts",
        title: "Contact & relationship history",
        description: "Notes and preferences survive across long buying cycles.",
        priority: "must",
        href: "/capabilities/contact-management/",
      },
      {
        id: "tasks",
        title: "Tasks & reminders",
        description: "Next touches and milestone dates on the record.",
        priority: "must",
      },
      {
        id: "mobile",
        title: "Mobile-friendly logging",
        description: "Update records between showings without waiting for a desk.",
        priority: "must",
      },
      {
        id: "pipelines",
        title: "Buyer / seller pipelines",
        description: "Separate or labeled stages for different sides of the business.",
        priority: "nice",
        href: "/capabilities/pipeline-management/",
      },
      {
        id: "integrations",
        title: "Marketing / listing integrations",
        description: "Verify portal, email, and related connections with vendors.",
        priority: "nice",
      },
    ],
    workflowSteps: [
      {
        id: "capture",
        label: "Lead capture",
        detail:
          "Lead from portal, referral, or open house enters CRM with source.",
        goal: "Every inquiry lands in a shared system with source and owner.",
        useCaseSlugs: ["high-volume-lead-management"],
        capabilitySlugs: ["contact-management", "pipeline-management"],
        requirementSlugs: ["track-client-interactions"],
        featureSlugs: ["lead-management", "contact-management"],
      },
      {
        id: "assign",
        label: "Assign & first touch",
        detail: "Route to an agent or ISA with a first-touch deadline.",
        goal: "Speed-to-lead with clear ownership before the trail goes cold.",
        useCaseSlugs: ["high-volume-lead-management", "pipeline-led-sales"],
        capabilitySlugs: ["workflow-automation", "pipeline-management"],
        requirementSlugs: ["automate-lead-follow-up"],
        featureSlugs: ["lead-management", "workflow-automation"],
      },
      {
        id: "nurture",
        label: "Nurture & showings",
        detail:
          "Advance stages through conversations, showings, and offer readiness.",
        goal: "Keep long-cycle buyers and sellers visible with next touches.",
        useCaseSlugs: ["pipeline-led-sales", "complex-sales-processes"],
        capabilitySlugs: ["pipeline-management", "contact-management"],
        requirementSlugs: ["track-client-interactions", "track-opportunity-progress"],
        featureSlugs: ["pipeline-management", "deal-management"],
      },
      {
        id: "under-contract",
        label: "Under contract",
        detail:
          "Track milestones and partner contacts on the transaction record.",
        goal: "Transaction continuity that does not live in one coordinator’s calendar.",
        useCaseSlugs: ["complex-sales-processes"],
        capabilitySlugs: ["pipeline-management"],
        requirementSlugs: ["track-opportunity-progress"],
        featureSlugs: ["deal-management", "custom-fields"],
      },
      {
        id: "close-follow",
        label: "Close & follow",
        detail:
          "Log closing outcome and schedule post-close nurture or referral asks.",
        goal: "Preserve relationship value after the transaction closes.",
        useCaseSlugs: ["advisory-relationship-management", "growing-teams"],
        capabilitySlugs: ["contact-management", "reporting"],
        requirementSlugs: ["track-client-interactions"],
        featureSlugs: ["contact-management", "reporting"],
      },
    ],
    heroVisual: {
      src: "/industries/real-estate-hero.png",
      alt: "Educational diagram of real-estate CRM from lead capture through nurture, contract milestones, and post-close follow-up.",
      caption:
        "Real-estate CRM is speed-to-lead and transaction continuity — not a generic B2B board alone.",
    },
    needsVisual: {
      src: "/industries/real-estate-needs.png",
      alt: "Diagram of real-estate CRM pains — lead leakage, cold nurture, showing chaos, partner handoffs — mapped to CRM fixes.",
      caption:
        "What usually breaks for agent teams — and how shared ownership helps.",
    },
    workflowVisual: {
      src: "/industries/real-estate-workflow.png",
      alt: "Five-step real-estate CRM workflow: capture, assign, nurture, under contract, close & follow.",
      caption: "A practical lead-to-close loop for brokerage teams.",
    },
    faq: [
      {
        question: "Do agents need a real-estate-specific CRM?",
        answer:
          "Many teams start with a general CRM configured for leads, tasks, and pipelines. Choose a vertical tool when listing-centric workflows or required integrations are must-haves — confirm those capabilities with vendors.",
      },
      {
        question: "What matters more: marketing automation or CRM?",
        answer:
          "CRM owns people, deals, and next actions. Marketing tools can feed leads; they should not become a second system of record for active clients.",
      },
      {
        question: "How do teams keep data clean during busy showing weeks?",
        answer:
          "Require a next step on every active lead, prefer mobile logging, and review unanswered new leads on a fixed cadence — not only when someone remembers.",
      },
    ],
  },

  healthcare: {
    tagline:
      "Coordinate patient acquisition and referral relationships with care for sensitive data and clear ownership.",
    overview:
      "Healthcare CRM (outside clinical systems of record) typically supports outreach, referral development, scheduling coordination, and relationship follow-up for practices and health organizations. It is not a substitute for clinical documentation — keep patient-care data boundaries clear and evaluate privacy requirements with your compliance owners.",
    whoThisIsFor:
      "Practice administrators, referral development / physician liaison teams, patient access and marketing ops, and outpatient or specialty groups coordinating intake. Buyers need shared relationship history without turning CRM into an unauthorized clinical chart.",
    whatMattersIntro:
      "Prioritize referral and inquiry ownership, appointment or intake handoffs, and access controls appropriate to sensitive information. Do not invent certification claims — verify privacy, security, and integration requirements (including any EHR connections) directly with vendors and your organization.",
    workedExample:
      "Worked example: a multi-site specialty practice. Before CRM, referral outreach lived in liaison spreadsheets and personal email. After CRM, each referring office has an owner, last touch, and next visit plan — coverage survives staff turnover.",
    workedExampleSecondary:
      "Worked example: a patient-access team. Before CRM, web inquiries and call-backs were reconstructed from voicemail. After CRM, every inquiry has a stage and owner so abandoned intakes are visible in a weekly review.",
    glance: {
      primaryGoal:
        "Owned referrals and intake follow-up with careful data boundaries",
      commonPriorities: [
        "Referral relationship tracking",
        "Inquiry / intake ownership",
        "Access controls",
        "Handoffs to scheduling",
        "Activity history",
      ],
      teamTypes: [
        "Practice administration",
        "Referral development",
        "Patient access / intake",
        "Marketing operations",
      ],
    },
    challenges: [
      {
        id: "referral-memory",
        title: "Referral relationships live with one liaison",
        pain: "When that person leaves, the practice loses who prefers what and who was promised follow-up.",
        crmHelps:
          "Referring contacts, notes, and next visits sit on shared records with owners.",
      },
      {
        id: "inquiry-drops",
        title: "Intake inquiries go unanswered",
        pain: "Web and phone inquiries stall between front desk, marketing, and clinical scheduling.",
        crmHelps:
          "A simple intake pipeline with mandatory owners surfaces abandoned requests.",
      },
      {
        id: "data-boundaries",
        title: "CRM and clinical systems blur",
        pain: "Teams paste sensitive clinical detail into open notes or the wrong tool.",
        crmHelps:
          "Define what belongs in CRM versus clinical systems; use permissions and field discipline accordingly — confirm policy with compliance owners.",
      },
      {
        id: "multi-site",
        title: "Multi-site outreach is inconsistent",
        pain: "Each location invents its own tracking sheet.",
        crmHelps:
          "Shared stages and reporting make outreach comparable across sites without forcing identical clinical workflows.",
      },
    ],
    outcomes: [
      {
        id: "durable-referrals",
        title: "Durable referral memory",
        description:
          "Liaison knowledge survives turnover and PTO.",
      },
      {
        id: "fewer-abandoned-intakes",
        title: "Fewer abandoned inquiries",
        description:
          "Intake follow-ups are owned and reviewable.",
      },
      {
        id: "clearer-boundaries",
        title: "Clearer tool boundaries",
        description:
          "Teams know what belongs in CRM versus clinical systems.",
      },
      {
        id: "site-consistency",
        title: "More consistent multi-site outreach",
        description:
          "Shared stages replace one-off spreadsheets per location.",
      },
    ],
    capabilityNeeds: [
      {
        id: "contacts-orgs",
        title: "Contacts & organization records",
        description:
          "Referring offices, patients-as-inquiries, and relationship notes with owners.",
        priority: "must",
        href: "/capabilities/contact-management/",
      },
      {
        id: "pipelines",
        title: "Referral & intake pipelines",
        description: "Stages for outreach and inquiry follow-through.",
        priority: "must",
        href: "/capabilities/pipeline-management/",
      },
      {
        id: "tasks",
        title: "Tasks & follow-ups",
        description: "Next touches and callbacks on the record.",
        priority: "must",
      },
      {
        id: "permissions",
        title: "Permissions & administration",
        description:
          "Limit who sees sensitive fields; align with internal policy.",
        priority: "must",
      },
      {
        id: "reporting",
        title: "Outreach & intake reporting",
        description: "Volume, response time, and source visibility for ops reviews.",
        priority: "nice",
        href: "/capabilities/reporting/",
      },
      {
        id: "integrations",
        title: "Scheduling / system integrations",
        description:
          "Verify connections to scheduling or other systems with vendors — do not assume clinical interoperability.",
        priority: "nice",
      },
    ],
    workflowSteps: [
      {
        id: "capture",
        label: "Capture",
        detail: "Referral or patient inquiry enters CRM with source and owner.",
      },
      {
        id: "qualify",
        label: "Qualify",
        detail: "Confirm appropriateness for outreach or intake — keep clinical detail in the right system.",
      },
      {
        id: "coordinate",
        label: "Coordinate",
        detail: "Schedule or hand off with notes the next teammate can trust.",
      },
      {
        id: "follow",
        label: "Follow",
        detail: "Log outcomes and set the next relationship or intake touch.",
      },
      {
        id: "review",
        label: "Review",
        detail: "Weekly review of unanswered inquiries and stale referral plans.",
      },
    ],
    heroVisual: {
      src: "/industries/healthcare-hero.png",
      alt: "Educational diagram of healthcare CRM for referrals and intake, with a clear boundary away from clinical systems of record.",
      caption:
        "Healthcare CRM here means relationship and intake ops — not a clinical chart replacement.",
    },
    needsVisual: {
      src: "/industries/healthcare-needs.png",
      alt: "Diagram of healthcare CRM pains — fragile referral memory, dropped inquiries, blurred data boundaries, multi-site inconsistency — mapped to CRM fixes.",
      caption:
        "Operational breaks in referral and intake work — and how shared ownership helps.",
    },
    workflowVisual: {
      src: "/industries/healthcare-workflow.png",
      alt: "Five-step healthcare CRM workflow: capture, qualify, coordinate, follow, review.",
      caption:
        "A practical referral and intake loop with careful data boundaries.",
    },
    faq: [
      {
        question: "Is CRM the same as an EHR or practice management system?",
        answer:
          "No. Clinical and practice-management systems document care and operations. CRM typically supports outreach, referrals, and relationship follow-up. Keep boundaries clear and confirm integrations with vendors and compliance owners.",
      },
      {
        question: "How should we talk about HIPAA or privacy on this page?",
        answer:
          "Privacy and security requirements vary by organization and use case. Treat them as evaluation criteria to verify with vendors and your compliance team — this content is educational and is not a certification or legal claim.",
      },
      {
        question: "What should a practice configure first?",
        answer:
          "Referring organizations, inquiry owners, a short intake or outreach pipeline, and permission rules. Add automation only after follow-ups are consistently logged.",
      },
      {
        question: "Can marketing teams use the same CRM?",
        answer:
          "Often yes for campaign-sourced inquiries, if access controls and field definitions prevent inappropriate sharing of sensitive details.",
      },
    ],
  },

  "retail-ecommerce": {
    tagline:
      "Connect store, support, and wholesale conversations so customer context survives the channel handoff.",
    overview:
      "Retail and ecommerce CRM work focuses on customer identity across channels, post-purchase relationships, and often B2B wholesale or partnership pipelines alongside DTC. The operational goal is shared customer context for service and sales — not replacing your commerce platform as the order system of record.",
    whoThisIsFor:
      "Omnichannel retailers, DTC brands with a sales or VIP motion, wholesale teams, and customer-experience leads who need history beyond the order admin. Buyers usually sit in CX, ecommerce ops, or wholesale sales.",
    whatMattersIntro:
      "Prioritize a durable customer profile, clear ownership for high-touch accounts, and handoffs between support, store, and sales. Verify commerce and helpdesk integrations with vendors; order truth should stay with the commerce system unless you deliberately design otherwise.",
    workedExample:
      "Worked example: a DTC brand with a VIP outreach pod. Before CRM, high-value customers were flagged only in support tickets. After CRM, VIP accounts have owners, preferences, and outreach history that marketing and CX both see.",
    workedExampleSecondary:
      "Worked example: a wholesale team selling into boutiques. Before CRM, reorder conversations lived in rep inboxes. After CRM, each retailer account has stages, contacts, and next buy windows for Friday pipeline reviews.",
    glance: {
      primaryGoal: "Customer context across channels and wholesale accounts",
      commonPriorities: [
        "Customer profile continuity",
        "Wholesale / VIP pipelines",
        "Support handoffs",
        "Segmentation fields",
        "Integrations with commerce / helpdesk",
      ],
      teamTypes: [
        "Ecommerce / CX ops",
        "Wholesale sales",
        "Store leadership",
        "VIP / retention",
      ],
    },
    challenges: [
      {
        id: "channel-split",
        title: "Store, web, and support disagree on the customer",
        pain: "Each channel keeps partial history; VIP treatment feels random.",
        crmHelps:
          "A shared customer record aggregates interactions while orders remain in commerce systems.",
      },
      {
        id: "wholesale-blind",
        title: "Wholesale pipeline is invisible",
        pain: "Reps manage boutique accounts in spreadsheets disconnected from brand CX.",
        crmHelps:
          "Account pipelines and contacts make reorder and outreach reviewable.",
      },
      {
        id: "ticket-only",
        title: "Support tickets are the only memory",
        pain: "Relationship context disappears when a ticket closes.",
        crmHelps:
          "CRM stores ongoing preferences and owners beyond a single case.",
      },
      {
        id: "campaign-noise",
        title: "Campaigns ignore recent service issues",
        pain: "Customers get promos while a complaint is still open.",
        crmHelps:
          "Shared fields and owners let teams suppress or retarget based on real status — when integrations and process support it.",
      },
    ],
    outcomes: [
      {
        id: "one-customer-view",
        title: "A more consistent customer view",
        description:
          "CX and sales stop reinventing context per channel.",
      },
      {
        id: "wholesale-visibility",
        title: "Visible wholesale opportunities",
        description:
          "Boutique and partner accounts get stages and next steps.",
      },
      {
        id: "vip-ownership",
        title: "Clear VIP ownership",
        description:
          "High-touch customers have named owners and history.",
      },
      {
        id: "cleaner-handoffs",
        title: "Cleaner support-to-sales handoffs",
        description:
          "Escalations carry context instead of “see last ticket.”",
      },
    ],
    capabilityNeeds: [
      {
        id: "profiles",
        title: "Customer & company profiles",
        description: "Durable identity for shoppers and wholesale accounts.",
        priority: "must",
        href: "/capabilities/contact-management/",
      },
      {
        id: "pipelines",
        title: "Wholesale / VIP pipelines",
        description: "Stages for high-touch revenue motions outside pure self-serve.",
        priority: "must",
        href: "/capabilities/pipeline-management/",
      },
      {
        id: "activity",
        title: "Activity & notes",
        description: "Preferences and conversations that outlive a single ticket.",
        priority: "must",
      },
      {
        id: "tasks",
        title: "Tasks & owners",
        description: "Named follow-ups for VIP and wholesale outreach.",
        priority: "must",
      },
      {
        id: "integrations",
        title: "Commerce / helpdesk integrations",
        description: "Verify sync direction and field ownership with vendors.",
        priority: "nice",
      },
      {
        id: "segmentation",
        title: "Lists & segmentation fields",
        description: "Support targeted outreach without building a CDP on day one.",
        priority: "nice",
      },
    ],
    workflowSteps: [
      {
        id: "identify",
        label: "Identify",
        detail: "Resolve the customer or retailer account and key contacts.",
      },
      {
        id: "capture",
        label: "Capture",
        detail: "Log the interaction (support, store, wholesale) on the shared record.",
      },
      {
        id: "own",
        label: "Own",
        detail: "Assign VIP or wholesale ownership when high-touch work begins.",
      },
      {
        id: "advance",
        label: "Advance",
        detail: "Move pipeline stages for wholesale deals or retention plays.",
      },
      {
        id: "review",
        label: "Review",
        detail: "Weekly review of open VIP tasks and wholesale stuck deals.",
      },
    ],
    heroVisual: {
      src: "/industries/retail-ecommerce-hero.png",
      alt: "Educational diagram of retail and ecommerce CRM linking store, web, support, and wholesale account context.",
      caption:
        "CRM complements commerce systems — it does not replace the order admin.",
    },
    needsVisual: {
      src: "/industries/retail-ecommerce-needs.png",
      alt: "Diagram of retail CRM pains — channel split, invisible wholesale, ticket-only memory, campaign noise — mapped to CRM fixes.",
      caption:
        "Where omnichannel context breaks — and how shared ownership helps.",
    },
    workflowVisual: {
      src: "/industries/retail-ecommerce-workflow.png",
      alt: "Five-step retail-ecommerce CRM workflow: identify, capture, own, advance, review.",
      caption:
        "A practical loop for VIP and wholesale relationship work.",
    },
    faq: [
      {
        question: "Should ecommerce brands use CRM or only their commerce platform?",
        answer:
          "Commerce platforms own orders and catalogs. CRM becomes useful when humans run VIP, wholesale, or relationship follow-up that needs owners and stages beyond order status.",
      },
      {
        question: "Where should customer support live?",
        answer:
          "Helpdesk tools often remain the case system. Connect or mirror key context into CRM when sales or VIP teams need lasting relationship memory.",
      },
      {
        question: "What integrations matter most first?",
        answer:
          "Usually email/calendar for high-touch teams, then commerce identity and helpdesk — confirm each with vendors and define which system wins when fields conflict.",
      },
    ],
  },

  "legal-services": {
    tagline:
      "Track matters development, client intake, and business development without losing conflict-sensitive context.",
    overview:
      "Legal-services CRM supports business development, intake, and client relationship continuity around matters — it is not a full practice-management or document system by itself. Firms need owned pursuits, clear intake stages, and careful sharing of sensitive client information.",
    whoThisIsFor:
      "Partners doing BD, intake teams, firm administrators, and practice-group coordinators. Buyers need pipeline visibility for pursuits and a durable client/contact graph that survives matter handoffs.",
    whatMattersIntro:
      "Prioritize pursuits and intake pipelines, relationship mapping (who knows whom), and permissions that match firm norms. Matter documents and timekeeping usually stay in practice systems — verify any integrations rather than assuming CRM replaces them.",
    workedExample:
      "Worked example: a mid-size firm BD committee. Before CRM, pitch status lived in partner email threads. After CRM, each pursuit has a stage, team, and next action — the BD meeting reviews the board instead of collecting verbal updates.",
    workedExampleSecondary:
      "Worked example: an intake coordinator. Before CRM, conflicts and follow-ups were tracked in a shared inbox. After CRM, prospective matters move through intake stages with owners so abandoned inquiries are visible.",
    glance: {
      primaryGoal: "Owned pursuits and intake with careful information sharing",
      commonPriorities: [
        "BD / pursuit pipelines",
        "Intake stages",
        "Relationship mapping",
        "Permissions",
        "Activity history",
      ],
      teamTypes: [
        "Partners / BD",
        "Intake coordinators",
        "Practice group admins",
        "Firm operations",
      ],
    },
    challenges: [
      {
        id: "pitch-fog",
        title: "Pitch status is tribal knowledge",
        pain: "Partners cannot see which pursuits are active or stalled.",
        crmHelps:
          "A BD pipeline with owners and next steps makes pursuits reviewable.",
      },
      {
        id: "intake-leak",
        title: "Intake inquiries stall",
        pain: "Prospective clients wait while email threads bounce between desks.",
        crmHelps:
          "Intake stages and mandatory owners surface aging inquiries.",
      },
      {
        id: "relationship-blind",
        title: "Relationship maps live in partners’ heads",
        pain: "Cross-selling and coverage fail when a partner is unavailable.",
        crmHelps:
          "Contacts, companies, and interaction history create a shareable map — within permission rules.",
      },
      {
        id: "tool-overlap",
        title: "CRM vs practice management confusion",
        pain: "Teams duplicate matter data or paste sensitive files into the wrong system.",
        crmHelps:
          "Define CRM for relationships and pursuits; keep matter work product in practice systems unless a deliberate integration exists.",
      },
    ],
    outcomes: [
      {
        id: "visible-pursuits",
        title: "Visible BD pursuits",
        description:
          "Pitch pipelines stop living only in partner inboxes.",
      },
      {
        id: "faster-intake",
        title: "Clearer intake ownership",
        description:
          "Prospective matters have stages and next actions.",
      },
      {
        id: "shareable-relationships",
        title: "Shareable relationship context",
        description:
          "Coverage and introductions rely less on one partner’s memory.",
      },
      {
        id: "cleaner-boundaries",
        title: "Cleaner system boundaries",
        description:
          "Teams know what belongs in CRM versus practice management.",
      },
    ],
    capabilityNeeds: [
      {
        id: "contacts",
        title: "Contacts & organizations",
        description: "Clients, prospects, and referral sources with history.",
        priority: "must",
        href: "/capabilities/contact-management/",
      },
      {
        id: "pipelines",
        title: "BD and intake pipelines",
        description: "Separate or labeled stages for pursuits and intake.",
        priority: "must",
        href: "/capabilities/pipeline-management/",
      },
      {
        id: "activities",
        title: "Activities & notes",
        description: "Meetings and outreach logged on the right records.",
        priority: "must",
      },
      {
        id: "permissions",
        title: "Permissions & administration",
        description:
          "Limit visibility by team or matter sensitivity per firm policy.",
        priority: "must",
      },
      {
        id: "reporting",
        title: "BD reporting",
        description: "Pipeline views for partner meetings without a BI project.",
        priority: "nice",
        href: "/capabilities/reporting/",
      },
      {
        id: "integrations",
        title: "Practice-system integrations",
        description: "Verify connections; do not assume document or billing sync.",
        priority: "nice",
      },
    ],
    workflowSteps: [
      {
        id: "capture",
        label: "Capture",
        detail: "Lead, referral, or RFP enters CRM with source and conflicts note process.",
      },
      {
        id: "qualify",
        label: "Qualify",
        detail: "Intake or BD decides pursue / decline and assigns an owner.",
      },
      {
        id: "pursue",
        label: "Pursue",
        detail: "Advance pursuit stages through meetings, proposals, and decisions.",
      },
      {
        id: "handoff",
        label: "Hand off",
        detail: "Won work moves context into matter opening in practice systems.",
      },
      {
        id: "steward",
        label: "Steward",
        detail: "Keep relationship touches alive for expansion and referrals.",
      },
    ],
    heroVisual: {
      src: "/industries/legal-services-hero.png",
      alt: "Educational diagram of legal-services CRM for BD pursuits and intake, bounded away from matter document systems.",
      caption:
        "CRM for firms is pursuits and relationships — practice systems still own matter work product.",
    },
    needsVisual: {
      src: "/industries/legal-services-needs.png",
      alt: "Diagram of legal CRM pains — pitch fog, intake leaks, relationship blindness, tool overlap — mapped to CRM fixes.",
      caption:
        "Where firm BD and intake break — and how shared pipelines help.",
    },
    workflowVisual: {
      src: "/industries/legal-services-workflow.png",
      alt: "Five-step legal-services CRM workflow: capture, qualify, pursue, hand off, steward.",
      caption: "A practical BD and intake loop for law firms.",
    },
    faq: [
      {
        question: "Does CRM replace practice management software?",
        answer:
          "Usually no. Practice management covers matters, documents, and often billing. CRM focuses on relationships, pursuits, and intake. Integrate deliberately rather than duplicating matter files.",
      },
      {
        question: "How should firms handle sensitive information in CRM?",
        answer:
          "Define what may be stored, use permissions, and follow firm policy. Requirements vary — confirm security options with vendors and your risk owners. This page is not legal advice.",
      },
      {
        question: "What should we track in the BD pipeline?",
        answer:
          "Pursuit name, owner, stage, next action, and key contacts. Keep stage definitions honest so partner meetings trust the board.",
      },
    ],
  },

  manufacturing: {
    tagline:
      "Manage account-based selling, quotes, and customer handoffs alongside long B2B sales cycles.",
    overview:
      "Manufacturing CRM supports account management, opportunity tracking, and coordination between sales, estimating, and customer service. It complements ERP and quoting tools — order and inventory truth typically remain in those systems.",
    whoThisIsFor:
      "Industrial and product manufacturers with outside sales, inside sales, estimating, and customer-service teams. Buyers need account history and quote-stage visibility without rebuilding ERP inside the CRM.",
    whatMattersIntro:
      "Prioritize account hierarchies, opportunity stages that match quote-to-order reality, and handoffs into service or applications engineering. Verify ERP and CPQ integrations with vendors; do not assume CRM becomes the order book.",
    workedExample:
      "Worked example: a regional manufacturer with outside reps. Before CRM, call reports and open quotes lived in email. After CRM, each account shows open opportunities, last visit, and next step — managers coach from the board.",
    workedExampleSecondary:
      "Worked example: inside sales and estimating. Before CRM, quote status was a spreadsheet race. After CRM, stages reflect submitted, revised, and won/lost so sales and estimating share one view.",
    glance: {
      primaryGoal: "Account-based pipeline and quote-stage visibility",
      commonPriorities: [
        "Account management",
        "Opportunity / quote stages",
        "Field & inside sales activity",
        "Handoffs to service",
        "ERP / quoting connections",
      ],
      teamTypes: [
        "Outside / inside sales",
        "Estimating",
        "Customer service",
        "Sales operations",
      ],
    },
    challenges: [
      {
        id: "account-blind",
        title: "Account history is scattered",
        pain: "Reps restart discovery because plant contacts and past quotes are hard to find.",
        crmHelps:
          "Accounts hold contacts, notes, and open opportunities in one place.",
      },
      {
        id: "quote-fog",
        title: "Quote status is opaque",
        pain: "Sales and estimating disagree on what is active versus stale.",
        crmHelps:
          "Shared opportunity stages make revisions and aging visible.",
      },
      {
        id: "field-logging",
        title: "Field visits never get logged",
        pain: "Managers only hear outcomes in weekly calls.",
        crmHelps:
          "Mobile-friendly activity and next steps on the account create a reviewable trail.",
      },
      {
        id: "erp-confusion",
        title: "CRM and ERP fight over orders",
        pain: "Teams duplicate line items or trust the wrong system for ship dates.",
        crmHelps:
          "Keep CRM for relationships and opportunities; let ERP own orders unless a designed sync exists.",
      },
    ],
    outcomes: [
      {
        id: "account-truth",
        title: "Stronger account truth",
        description:
          "Contacts and history survive territory or rep changes.",
      },
      {
        id: "quote-clarity",
        title: "Clearer quote pipelines",
        description:
          "Aging quotes are visible to sales and estimating together.",
      },
      {
        id: "coachable-activity",
        title: "Coachable field activity",
        description:
          "Visit and follow-up discipline shows up on the account.",
      },
      {
        id: "cleaner-handoffs",
        title: "Cleaner post-win handoffs",
        description:
          "Service and applications inherit context from the won opportunity.",
      },
    ],
    capabilityNeeds: [
      {
        id: "accounts",
        title: "Accounts & contacts",
        description: "Plant and buying-center maps with durable history.",
        priority: "must",
        href: "/capabilities/contact-management/",
      },
      {
        id: "opportunities",
        title: "Opportunity / quote pipelines",
        description: "Stages that match how quotes actually move.",
        priority: "must",
        href: "/capabilities/pipeline-management/",
      },
      {
        id: "activities",
        title: "Activities & tasks",
        description: "Visits, calls, and next steps on the account.",
        priority: "must",
      },
      {
        id: "reporting",
        title: "Pipeline reporting",
        description: "Aging quotes and forecast inputs for sales meetings.",
        priority: "must",
        href: "/capabilities/reporting/",
      },
      {
        id: "mobile",
        title: "Mobile access for field reps",
        description: "Log visits without waiting to return to the office.",
        priority: "nice",
      },
      {
        id: "integrations",
        title: "ERP / quoting integrations",
        description: "Verify sync scope; keep order truth clear.",
        priority: "nice",
      },
    ],
    workflowSteps: [
      {
        id: "account",
        label: "Account",
        detail: "Maintain the customer/prospect account and buying contacts.",
      },
      {
        id: "qualify",
        label: "Qualify",
        detail: "Open an opportunity when a real quote or project appears.",
      },
      {
        id: "quote",
        label: "Quote",
        detail: "Advance stages through estimate, submit, revise, and decision.",
      },
      {
        id: "win",
        label: "Win / lose",
        detail: "Capture outcome reasons the team will actually use.",
      },
      {
        id: "hand-off",
        label: "Hand off",
        detail: "Pass context to order entry, service, or applications engineering.",
      },
    ],
    heroVisual: {
      src: "/industries/manufacturing-hero.png",
      alt: "Educational diagram of manufacturing CRM linking accounts, quote stages, and handoffs while ERP remains the order system.",
      caption:
        "Manufacturing CRM is account and quote visibility — ERP still owns the order book.",
    },
    needsVisual: {
      src: "/industries/manufacturing-needs.png",
      alt: "Diagram of manufacturing CRM pains — scattered account history, opaque quotes, unlogged field visits, ERP confusion — mapped to CRM fixes.",
      caption:
        "Common B2B manufacturing sales breaks and how CRM process helps.",
    },
    workflowVisual: {
      src: "/industries/manufacturing-workflow.png",
      alt: "Five-step manufacturing CRM workflow: account, qualify, quote, win/lose, hand off.",
      caption: "A practical quote-to-handoff loop for manufacturers.",
    },
    faq: [
      {
        question: "Should manufacturers put orders in the CRM?",
        answer:
          "Usually no. Keep opportunities and relationships in CRM and orders in ERP unless you have a deliberate, maintained integration and clear system-of-record rules.",
      },
      {
        question: "What stages work for quote-heavy sales?",
        answer:
          "Stages that mirror real gates — discovery, estimating, quoted, negotiation, won/lost. Avoid vanity stages nobody updates after the quote leaves the building.",
      },
      {
        question: "How do we get field reps to log activity?",
        answer:
          "Require a next step on open opportunities, make mobile logging easy, and review the board weekly so empty accounts are visible.",
      },
    ],
  },

  education: {
    tagline:
      "Coordinate enrollment inquiries, partnerships, and stakeholder follow-up across long decision cycles.",
    overview:
      "Education CRM supports inquiry-to-enrollment (or recruitment) pipelines, partner and alumni relationship work, and internal handoffs between admissions, advising, and outreach teams. Student information systems remain the academic system of record — CRM complements recruitment and relationship ops.",
    whoThisIsFor:
      "Admissions and enrollment teams, continuing-education and program marketers, partnership/development roles, and schools or training providers coordinating long nurture cycles. Buyers need owned inquiries and clear stages without replacing the SIS.",
    whatMattersIntro:
      "Prioritize inquiry capture, counselor or recruiter ownership, nurture stages, and event/visit follow-up. Verify SIS and marketing-tool integrations carefully; define which system owns the enrolled student record.",
    workedExample:
      "Worked example: a continuing-education program office. Before CRM, web inquiries sat in a shared inbox and response times slid during peak terms. After CRM, every inquiry has an owner and stage — weekly reviews focus on unanswered applicants.",
    workedExampleSecondary:
      "Worked example: a B2B training provider selling to employers. Before CRM, company partnerships lived in individual spreadsheets. After CRM, each employer account shows contacts, open cohorts, and next renewal conversations.",
    glance: {
      primaryGoal: "Owned inquiry-to-enrollment (or partnership) pipelines",
      commonPriorities: [
        "Inquiry capture",
        "Counselor / recruiter ownership",
        "Nurture stages",
        "Event follow-up",
        "SIS / marketing connections",
      ],
      teamTypes: [
        "Admissions / enrollment",
        "Program marketing",
        "Partnerships",
        "Student outreach ops",
      ],
    },
    challenges: [
      {
        id: "inbox-intake",
        title: "Inquiries die in shared inboxes",
        pain: "Peak seasons overwhelm personal follow-up habits.",
        crmHelps:
          "Central capture with owners and stages keeps response work visible.",
      },
      {
        id: "long-nurture",
        title: "Long decision cycles go dark",
        pain: "Prospective students or partners fall off between events and terms.",
        crmHelps:
          "Tasks and stage-based nurture keep future starts on a reviewable board.",
      },
      {
        id: "handoff-gaps",
        title: "Admissions-to-advising handoffs drop context",
        pain: "Yield and onboarding teams rebuild student stories from email.",
        crmHelps:
          "Won or enrolled transitions carry notes and stakeholders forward — within your SIS/CRM design.",
      },
      {
        id: "sis-overlap",
        title: "CRM and SIS duplicate people",
        pain: "Two systems disagree on status after enrollment.",
        crmHelps:
          "Define CRM for recruitment/relationships and SIS for academic records; sync only with clear ownership.",
      },
    ],
    outcomes: [
      {
        id: "faster-response",
        title: "Faster owned inquiry response",
        description:
          "Peak-season leads stop sitting unowned in shared inboxes.",
      },
      {
        id: "nurture-visibility",
        title: "Visible long-cycle nurture",
        description:
          "Future terms and cohorts stay on stages with next touches.",
      },
      {
        id: "partner-clarity",
        title: "Clearer employer or partner accounts",
        description:
          "B2B education motions get the same ownership discipline as B2C inquiries.",
      },
      {
        id: "cleaner-systems",
        title: "Cleaner CRM–SIS boundaries",
        description:
          "Teams know which system wins after enrollment.",
      },
    ],
    capabilityNeeds: [
      {
        id: "inquiries",
        title: "Inquiry / lead capture",
        description: "Forms and events become owned records quickly.",
        priority: "must",
        href: "/capabilities/lead-management/",
      },
      {
        id: "pipelines",
        title: "Enrollment or partnership pipelines",
        description: "Stages that match how decisions actually progress.",
        priority: "must",
        href: "/capabilities/pipeline-management/",
      },
      {
        id: "tasks",
        title: "Tasks & reminders",
        description: "Counselor follow-ups and event next steps on the record.",
        priority: "must",
      },
      {
        id: "communications",
        title: "Email logging / light outreach",
        description: "Reduce double entry during high-volume seasons.",
        priority: "must",
      },
      {
        id: "reporting",
        title: "Funnel reporting",
        description: "Source and stage views for enrollment meetings.",
        priority: "nice",
        href: "/capabilities/reporting/",
      },
      {
        id: "integrations",
        title: "SIS / marketing integrations",
        description: "Verify carefully; avoid dual systems of record.",
        priority: "nice",
      },
    ],
    workflowSteps: [
      {
        id: "capture",
        label: "Capture",
        detail: "Inquiry or partner lead enters CRM with source and owner.",
      },
      {
        id: "nurture",
        label: "Nurture",
        detail: "Advance stages through counseling, visits, or employer conversations.",
      },
      {
        id: "decide",
        label: "Decide",
        detail: "Track application, deposit, contract, or partnership decision points.",
      },
      {
        id: "hand-off",
        label: "Hand off",
        detail: "Pass context into SIS, advising, or program delivery systems.",
      },
      {
        id: "review",
        label: "Review",
        detail: "Weekly funnel review of aging inquiries and missing next steps.",
      },
    ],
    heroVisual: {
      src: "/industries/education-hero.png",
      alt: "Educational diagram of education CRM from inquiry capture through nurture and handoff to student information systems.",
      caption:
        "Education CRM supports recruitment and relationships — the SIS remains academic record.",
    },
    needsVisual: {
      src: "/industries/education-needs.png",
      alt: "Diagram of education CRM pains — inbox intake, dark nurture, handoff gaps, SIS overlap — mapped to CRM fixes.",
      caption:
        "Where enrollment and partnership follow-up breaks — and how ownership helps.",
    },
    workflowVisual: {
      src: "/industries/education-workflow.png",
      alt: "Five-step education CRM workflow: capture, nurture, decide, hand off, review.",
      caption: "A practical inquiry-to-handoff loop for education teams.",
    },
    faq: [
      {
        question: "Can CRM replace our student information system?",
        answer:
          "No. Use CRM for recruitment, inquiries, and relationship pipelines. Keep academic records in the SIS and define sync rules if systems connect.",
      },
      {
        question: "What should admissions configure first?",
        answer:
          "Inquiry sources, counselor ownership, a short stage set, and a weekly unanswered-inquiry review. Add automation after response discipline exists.",
      },
      {
        question: "Does this apply to corporate training providers too?",
        answer:
          "Yes — treat employers as accounts and cohorts as opportunities or pipelines, with the same ownership and stage discipline.",
      },
    ],
  },

  nonprofit: {
    tagline:
      "Steward donors and constituents with shared history, owned outreach, and pipelines that fit fundraising — not forced B2B sales stages.",
    overview:
      "As an industry hub, nonprofit CRM centers on donor and constituent relationship operations: gifts cultivation, stewardship, volunteer or partner coordination, and campaign follow-through. It overlaps thematically with /for/nonprofits but sits in the industries taxonomy with a vertical focus on donor/constituent workflows.",
    whoThisIsFor:
      "Development officers, donor-relations staff, volunteer coordinators, and nonprofit ops leads who need durable constituent history. Buyers often evaluate general CRM versus purpose-built fundraising platforms depending on gift-processing depth.",
    whatMattersIntro:
      "Prioritize constituent records, ownership of major-donor and campaign touches, soft-credit/relationship context where relevant, and reporting your board actually uses. If receipts, pledges, and gift processing dominate, compare nonprofit-specific platforms too — without treating any vendor as endorsed here.",
    workedExample:
      "Worked example: a mid-size nonprofit development team. Before CRM, major-donor history lived in a departing officer’s spreadsheet. After CRM, every major donor has an owner, last touch, and next ask plan the next hire can inherit.",
    workedExampleSecondary:
      "Worked example: a campaign committee. Before CRM, pledge follow-ups were scattered across personal reminders. After CRM, open pledges and volunteer leads sit on stages with due dates for weekly development standups.",
    glance: {
      primaryGoal: "Donor and constituent continuity with owned stewardship",
      commonPriorities: [
        "Constituent history",
        "Major-donor ownership",
        "Campaign / pledge follow-up",
        "Volunteer or partner tracking",
        "Board-ready reporting",
      ],
      teamTypes: [
        "Development / fundraising",
        "Donor relations",
        "Volunteer coordination",
        "Nonprofit operations",
      ],
    },
    challenges: [
      {
        id: "fragile-history",
        title: "Donor history is fragile",
        pain: "Staff turnover erases who was promised what and when.",
        crmHelps:
          "Constituent records hold interactions, soft context, and next steps for the next hire.",
      },
      {
        id: "unowned-outreach",
        title: "Campaign outreach lacks owners",
        pain: "Appeals and pledge reminders slip between development and programs.",
        crmHelps:
          "Tasks and light pipelines make open asks and follow-ups reviewable.",
      },
      {
        id: "forced-sales-stages",
        title: "B2B sales stages feel wrong",
        pain: "Teams abandon CRM because stages do not match cultivation.",
        crmHelps:
          "Configure stewardship-oriented stages (identify, cultivate, ask, thank, renew) instead of forcing a commercial template.",
      },
      {
        id: "tool-choice",
        title: "General CRM vs fundraising platform confusion",
        pain: "Teams buy the wrong depth for gift processing versus relationship tracking.",
        crmHelps:
          "Separate relationship continuity needs from gift-processing must-haves, then evaluate tools against that list.",
      },
    ],
    outcomes: [
      {
        id: "durable-constituents",
        title: "Durable constituent memory",
        description:
          "Donor and volunteer context survives staff changes.",
      },
      {
        id: "owned-asks",
        title: "Owned asks and thank-yous",
        description:
          "Campaign follow-ups stop living in personal reminders.",
      },
      {
        id: "fit-stages",
        title: "Stages that match stewardship",
        description:
          "Teams use the board because it reflects cultivation, not fake B2B gates.",
      },
      {
        id: "clearer-buying",
        title: "Clearer platform choice",
        description:
          "You know when general CRM is enough versus when gift ops need a specialist tool.",
      },
    ],
    capabilityNeeds: [
      {
        id: "constituents",
        title: "Constituent & organization records",
        description: "Donors, households, foundations, and partners with history.",
        priority: "must",
        href: "/capabilities/contact-management/",
      },
      {
        id: "pipelines",
        title: "Cultivation / campaign pipelines",
        description: "Stages for major gifts, pledges, or partnership asks.",
        priority: "must",
        href: "/capabilities/pipeline-management/",
      },
      {
        id: "tasks",
        title: "Tasks & stewardship reminders",
        description: "Next touches and thank-you deadlines on the record.",
        priority: "must",
      },
      {
        id: "activities",
        title: "Activity history",
        description: "Meetings, events, and outreach logged for continuity.",
        priority: "must",
      },
      {
        id: "reporting",
        title: "Development reporting",
        description: "Pipeline and activity views for board or leadership updates.",
        priority: "nice",
        href: "/capabilities/reporting/",
      },
      {
        id: "integrations",
        title: "Payment / email integrations",
        description:
          "Verify gift and marketing connections; specialist platforms may fit better for deep gift ops.",
        priority: "nice",
      },
    ],
    workflowSteps: [
      {
        id: "identify",
        label: "Identify",
        detail: "Constituent or prospect enters CRM with source and relationship context.",
      },
      {
        id: "engage",
        label: "Engage",
        detail: "Log cultivation touches and assign an owner for major relationships.",
      },
      {
        id: "ask",
        label: "Ask",
        detail: "Track pledge or gift asks on a stage with a next date.",
      },
      {
        id: "steward",
        label: "Steward",
        detail: "Thank, report impact, and schedule the next meaningful touch.",
      },
      {
        id: "renew",
        label: "Renew",
        detail: "Review lapsed or renewal candidates from the board — not from memory.",
      },
    ],
    heroVisual: {
      src: "/industries/nonprofit-hero.png",
      alt: "Educational diagram of nonprofit industry CRM focused on donor and constituent stewardship pipelines.",
      caption:
        "Industry nonprofit focus: donor/constituent ops — related to, but distinct from, /for/nonprofits.",
    },
    needsVisual: {
      src: "/industries/nonprofit-needs.png",
      alt: "Diagram of nonprofit CRM pains — fragile history, unowned outreach, forced sales stages, tool-choice confusion — mapped to CRM fixes.",
      caption:
        "What breaks in fundraising relationship work — and how stewardship-oriented CRM helps.",
    },
    workflowVisual: {
      src: "/industries/nonprofit-workflow.png",
      alt: "Five-step nonprofit CRM workflow: identify, engage, ask, steward, renew.",
      caption: "A cultivation-oriented loop for donors and constituents.",
    },
    faq: [
      {
        question: "How is this different from /for/nonprofits?",
        answer:
          "The /for/nonprofits page is a business-type hub. This industry page sits in the industries taxonomy and emphasizes donor/constituent vertical workflows. Cross-link when both lenses help the reader.",
      },
      {
        question: "Is a sales CRM right for fundraising?",
        answer:
          "It can be when shared relationship history and light pipelines are the main need. If gift processing, receipts, and donor journeys dominate, evaluate purpose-built nonprofit platforms as well.",
      },
      {
        question: "What should we configure before automation?",
        answer:
          "People, organizations, owners, and a logging habit. Journey automation only helps after stewardship history is trusted.",
      },
      {
        question: "How do we know CRM is working?",
        answer:
          "Major-donor coverage survives turnover, open asks have next dates, and development meetings start from the board instead of spreadsheet archaeology.",
      },
    ],
  },

  hospitality: {
    tagline:
      "Coordinate group sales, repeat guests, and property relationships beyond the reservation system.",
    overview:
      "Hospitality CRM supports group and corporate sales, account management for agencies and planners, and guest-relationship follow-up that sits beside the property management or reservation system. Booking inventory stays in PMS/CRS tools; CRM owns the sales relationship and pipeline.",
    whoThisIsFor:
      "Hotel and venue sales teams, revenue managers collaborating on groups, and multi-property account managers. Buyers need pipeline visibility for RFPs and events plus durable planner/account history.",
    whatMattersIntro:
      "Prioritize account and planner contacts, group/event pipelines, traceable proposals, and handoffs to operations. Verify PMS and email integrations with vendors — do not treat CRM as the reservation book.",
    workedExample:
      "Worked example: a city hotel sales team. Before CRM, group RFPs lived in individual inboxes and the trace was lost when a seller left. After CRM, each RFP has a stage, owner, and planner contacts the next seller can inherit.",
    workedExampleSecondary:
      "Worked example: a multi-property regional team. Before CRM, key corporate accounts were “owned” differently at each hotel. After CRM, strategic accounts have shared history and coordinated next steps across properties.",
    glance: {
      primaryGoal: "Group/corporate pipeline and planner account continuity",
      commonPriorities: [
        "Account & planner contacts",
        "Group / event pipelines",
        "Proposal follow-up",
        "Multi-property coordination",
        "PMS / email connections",
      ],
      teamTypes: [
        "Hotel / venue sales",
        "Catering & events",
        "Key account management",
        "Revenue collaboration",
      ],
    },
    challenges: [
      {
        id: "rfp-inbox",
        title: "RFPs live in personal inboxes",
        pain: "Response SLAs slip and history disappears with turnover.",
        crmHelps:
          "Central opportunities with owners and stages keep group demand reviewable.",
      },
      {
        id: "planner-memory",
        title: "Planner preferences are tribal",
        pain: "New sellers relearn account quirks every season.",
        crmHelps:
          "Notes and contacts on the account preserve what planners care about.",
      },
      {
        id: "property-silos",
        title: "Properties compete without shared context",
        pain: "The same corporate account gets conflicting outreach.",
        crmHelps:
          "Shared account records coordinate next steps across the portfolio.",
      },
      {
        id: "pms-blur",
        title: "CRM and PMS blur responsibilities",
        pain: "Teams try to manage room inventory inside the CRM.",
        crmHelps:
          "Keep reservations in PMS; use CRM for relationship and sales pipeline work.",
      },
    ],
    outcomes: [
      {
        id: "rfp-visibility",
        title: "Visible group RFP pipelines",
        description:
          "Sales meetings review stages instead of inbox archaeology.",
      },
      {
        id: "account-continuity",
        title: "Continuity for planner accounts",
        description:
          "Preferences and history survive seller turnover.",
      },
      {
        id: "portfolio-coordination",
        title: "Better multi-property coordination",
        description:
          "Strategic accounts stop getting conflicting outreach.",
      },
      {
        id: "clear-systems",
        title: "Clear CRM vs PMS roles",
        description:
          "Inventory stays in reservations systems; relationships stay in CRM.",
      },
    ],
    capabilityNeeds: [
      {
        id: "accounts",
        title: "Accounts & planner contacts",
        description: "Agencies, corporates, and planners with durable history.",
        priority: "must",
        href: "/capabilities/contact-management/",
      },
      {
        id: "pipelines",
        title: "Group / event pipelines",
        description: "Stages from RFP to definite and turned-over.",
        priority: "must",
        href: "/capabilities/pipeline-management/",
      },
      {
        id: "tasks",
        title: "Tasks & follow-ups",
        description: "Proposal and trace deadlines on the opportunity.",
        priority: "must",
      },
      {
        id: "activities",
        title: "Activity logging",
        description: "Site visits, calls, and emails on the account.",
        priority: "must",
      },
      {
        id: "reporting",
        title: "Sales pipeline reporting",
        description: "Pace and aging views for sales and revenue meetings.",
        priority: "nice",
        href: "/capabilities/reporting/",
      },
      {
        id: "integrations",
        title: "PMS / email integrations",
        description: "Verify; keep reservation truth in PMS.",
        priority: "nice",
      },
    ],
    workflowSteps: [
      {
        id: "capture",
        label: "Capture",
        detail: "RFP or inquiry becomes an opportunity with planner contacts.",
      },
      {
        id: "qualify",
        label: "Qualify",
        detail: "Confirm dates, budget fit, and decision process.",
      },
      {
        id: "propose",
        label: "Propose",
        detail: "Advance stages through proposal, negotiation, and verbal/definite.",
      },
      {
        id: "hand-off",
        label: "Hand off",
        detail: "Pass details to operations / PMS processes for the group.",
      },
      {
        id: "steward",
        label: "Steward",
        detail: "Log post-event notes and schedule the next account touch.",
      },
    ],
    heroVisual: {
      src: "/industries/hospitality-hero.png",
      alt: "Educational diagram of hospitality CRM for group RFPs and planner accounts beside a property management system.",
      caption:
        "Hospitality CRM owns sales relationships — PMS owns reservations.",
    },
    needsVisual: {
      src: "/industries/hospitality-needs.png",
      alt: "Diagram of hospitality CRM pains — RFP inboxes, tribal planner memory, property silos, PMS blur — mapped to CRM fixes.",
      caption:
        "Where hotel and venue sales break — and how shared pipelines help.",
    },
    workflowVisual: {
      src: "/industries/hospitality-workflow.png",
      alt: "Five-step hospitality CRM workflow: capture, qualify, propose, hand off, steward.",
      caption: "A practical group-sales loop for hospitality teams.",
    },
    faq: [
      {
        question: "Do we need CRM if we already have a PMS?",
        answer:
          "Yes when group/corporate selling needs pipeline ownership and planner history. PMS runs inventory and stays; CRM supports the sales relationship around it.",
      },
      {
        question: "What should hotel sales configure first?",
        answer:
          "Accounts, planner contacts, RFP stages, and mandatory next steps. Add automation after traces are consistently logged.",
      },
      {
        question: "How should multi-property teams share accounts?",
        answer:
          "Use shared account records with clear ownership rules so properties coordinate instead of competing blindly — align with your brand’s account policies.",
      },
    ],
  },

  construction: {
    tagline:
      "Track bids, clients, and project handoffs so estimating and field teams share one opportunity truth.",
    overview:
      "Construction CRM supports bid pipelines, client and GC relationship management, and handoffs into project delivery. Project accounting and field systems usually remain separate — CRM keeps preconstruction and business-development work reviewable.",
    whoThisIsFor:
      "General contractors, specialty trades, and design-build firms with estimators, project executives, and business developers. Buyers need bid-stage visibility and client history that survives handoff to the field.",
    whatMattersIntro:
      "Prioritize bid/opportunity stages, account contacts (owners, GCs, architects), win/loss reasons, and a clean preconstruction-to-project handoff. Verify project-management or estimating integrations; do not assume CRM replaces job costing.",
    workedExample:
      "Worked example: a specialty contractor estimating team. Before CRM, bid due dates lived in a whiteboard and personal calendars. After CRM, every bid has a stage, owner, and due date — Friday meetings review aging pursuits from the board.",
    workedExampleSecondary:
      "Worked example: a project executive covering multiple clients. Before CRM, past RFIs and preferences were buried in email. After CRM, account notes travel with the client so the next pursuit does not restart cold.",
    glance: {
      primaryGoal: "Bid pipeline clarity and client continuity into delivery",
      commonPriorities: [
        "Bid / opportunity stages",
        "Client & GC contacts",
        "Due dates & tasks",
        "Win/loss tracking",
        "Handoff to project teams",
      ],
      teamTypes: [
        "Estimating",
        "Business development",
        "Project executives",
        "Preconstruction",
      ],
    },
    challenges: [
      {
        id: "bid-chaos",
        title: "Bid status is tribal",
        pain: "Teams cannot see what is due, waiting, or dead without a meeting.",
        crmHelps:
          "Shared bid stages and due dates make the pipeline reviewable.",
      },
      {
        id: "client-amnesia",
        title: "Client history resets every pursuit",
        pain: "Lessons from prior jobs never reach the next estimate team.",
        crmHelps:
          "Account records hold contacts, notes, and past outcomes.",
      },
      {
        id: "handoff-drop",
        title: "Won jobs lose context at kickoff",
        pain: "Field teams rebuild scope nuances from email threads.",
        crmHelps:
          "Won opportunities carry stakeholders and notes into project kickoff checklists.",
      },
      {
        id: "system-overlap",
        title: "CRM vs project software confusion",
        pain: "Teams duplicate schedules or cost data in the wrong tool.",
        crmHelps:
          "Keep CRM for pursuits and relationships; keep job execution in project systems.",
      },
    ],
    outcomes: [
      {
        id: "bid-visibility",
        title: "Visible bid pipelines",
        description:
          "Due dates and owners stop living only on whiteboards.",
      },
      {
        id: "client-memory",
        title: "Stronger client memory",
        description:
          "GC and owner preferences inform the next pursuit.",
      },
      {
        id: "cleaner-kickoffs",
        title: "Cleaner project kickoffs",
        description:
          "Won-bid context reaches the field with less archaeology.",
      },
      {
        id: "better-learning",
        title: "Better win/loss learning",
        description:
          "Reason codes become reviewable instead of forgotten anecdotes.",
      },
    ],
    capabilityNeeds: [
      {
        id: "accounts",
        title: "Accounts & contacts",
        description: "Owners, GCs, architects, and partner contacts.",
        priority: "must",
        href: "/capabilities/contact-management/",
      },
      {
        id: "pipelines",
        title: "Bid / opportunity pipelines",
        description: "Stages from invite to submit, negotiate, won/lost.",
        priority: "must",
        href: "/capabilities/pipeline-management/",
      },
      {
        id: "tasks",
        title: "Tasks & due dates",
        description: "Bid deadlines and follow-ups on the opportunity.",
        priority: "must",
      },
      {
        id: "activities",
        title: "Activity & notes",
        description: "Site walks, calls, and clarifications logged once.",
        priority: "must",
      },
      {
        id: "reporting",
        title: "Bid pipeline reporting",
        description: "Volume, hit rate inputs, and aging for leadership reviews.",
        priority: "nice",
        href: "/capabilities/reporting/",
      },
      {
        id: "integrations",
        title: "Estimating / PM integrations",
        description: "Verify; keep job costing outside CRM unless designed otherwise.",
        priority: "nice",
      },
    ],
    workflowSteps: [
      {
        id: "capture",
        label: "Capture",
        detail: "Invite or lead becomes a bid opportunity with due date and owner.",
      },
      {
        id: "qualify",
        label: "Qualify",
        detail: "Decide pursue / no-bid and record the reason.",
      },
      {
        id: "estimate",
        label: "Estimate",
        detail: "Advance stages through takeoff, pricing, and submission.",
      },
      {
        id: "negotiate",
        label: "Negotiate",
        detail: "Track revisions and decision dates until won or lost.",
      },
      {
        id: "hand-off",
        label: "Hand off",
        detail: "Pass scope notes and contacts into project kickoff.",
      },
    ],
    heroVisual: {
      src: "/industries/construction-hero.png",
      alt: "Educational diagram of construction CRM from bid capture through estimating stages to project kickoff handoff.",
      caption:
        "Construction CRM is bid and client continuity — project systems still run the job.",
    },
    needsVisual: {
      src: "/industries/construction-needs.png",
      alt: "Diagram of construction CRM pains — tribal bid status, client amnesia, kickoff drops, system overlap — mapped to CRM fixes.",
      caption:
        "Where preconstruction follow-up breaks — and how shared ownership helps.",
    },
    workflowVisual: {
      src: "/industries/construction-workflow.png",
      alt: "Five-step construction CRM workflow: capture, qualify, estimate, negotiate, hand off.",
      caption: "A practical bid-to-kickoff loop for contractors.",
    },
    faq: [
      {
        question: "Should job schedules live in the CRM?",
        answer:
          "Generally no. Use CRM for bids and relationships; keep schedules, RFIs, and costing in project tools unless you have a deliberate integration design.",
      },
      {
        question: "What win/loss fields are worth requiring?",
        answer:
          "A short reason list the team will actually complete — price, relationship, capacity, scope fit. Long taxonomies get skipped.",
      },
      {
        question: "How do estimators and BD share one board?",
        answer:
          "Agree stage definitions together, require an owner on every active bid, and review aging due dates weekly from the same pipeline.",
      },
    ],
  },

  "transportation-logistics": {
    tagline:
      "Manage shipper accounts, tender follow-ups, and lane relationships without confusing CRM for the TMS.",
    overview:
      "Transportation and logistics CRM supports shipper and broker relationship management, opportunity or tender pipelines, and account coverage across sales and customer success. Transportation management systems (TMS) and operations tools remain the execution layer for loads and routing.",
    whoThisIsFor:
      "Freight sales and account managers, brokerage development teams, and 3PL customer-success roles. Buyers need account history and tender follow-up visibility without turning CRM into a dispatch board.",
    whatMattersIntro:
      "Prioritize shipper accounts, contacts at procurement and operations, tender/opportunity stages, and owned follow-ups after quotes. Verify TMS or rating integrations carefully; keep load execution in ops systems.",
    workedExample:
      "Worked example: a brokerage sales pod. Before CRM, lane quotes and follow-ups lived in rep inboxes. After CRM, each shipper account shows open tenders, last touch, and next step — managers review aging quotes on Friday.",
    workedExampleSecondary:
      "Worked example: a 3PL customer-success team. Before CRM, expansion conversations restarted whenever a CSM changed. After CRM, account goals, stakeholders, and open issues sit on the shipper record for continuity.",
    glance: {
      primaryGoal: "Shipper account continuity and tender follow-up discipline",
      commonPriorities: [
        "Shipper account management",
        "Tender / quote pipelines",
        "Activity ownership",
        "CS handoffs",
        "TMS / ops boundaries",
      ],
      teamTypes: [
        "Freight sales",
        "Account management",
        "Customer success / retention",
        "Sales operations",
      ],
    },
    challenges: [
      {
        id: "inbox-quotes",
        title: "Quotes and tenders live in inboxes",
        pain: "Aging follow-ups disappear when reps are busy covering freight.",
        crmHelps:
          "Opportunities with due dates and owners make tender pursuit reviewable.",
      },
      {
        id: "account-churn-blind",
        title: "Account risk is invisible",
        pain: "Teams notice volume drops only after the shipper is gone.",
        crmHelps:
          "Account activity and next-step discipline surface silent accounts earlier.",
      },
      {
        id: "ops-blur",
        title: "CRM becomes a fake dispatch board",
        pain: "Sales clutter the CRM with load-level noise ops already tracks.",
        crmHelps:
          "Keep CRM at account and opportunity level; leave load execution in TMS/ops tools.",
      },
      {
        id: "handoff-gap",
        title: "Sales-to-CS handoffs drop stakeholders",
        pain: "New CSMs rebuild the org chart from email signatures.",
        crmHelps:
          "Contacts, roles, and goals on the account travel with the relationship.",
      },
    ],
    outcomes: [
      {
        id: "tender-visibility",
        title: "Visible tender pipelines",
        description:
          "Quote follow-ups stop depending on personal inbox memory.",
      },
      {
        id: "account-coverage",
        title: "Stronger shipper coverage",
        description:
          "Silent accounts show up before volume disappears.",
      },
      {
        id: "clean-boundaries",
        title: "Clean CRM vs TMS boundaries",
        description:
          "Sales stay focused on relationships; ops keeps load execution.",
      },
      {
        id: "cs-continuity",
        title: "CS continuity on key accounts",
        description:
          "Stakeholders and goals survive ownership changes.",
      },
    ],
    capabilityNeeds: [
      {
        id: "accounts",
        title: "Shipper accounts & contacts",
        description: "Procurement, ops, and partner contacts with history.",
        priority: "must",
        href: "/capabilities/contact-management/",
      },
      {
        id: "pipelines",
        title: "Tender / opportunity pipelines",
        description: "Stages for quote, negotiate, win/lose, and expansion.",
        priority: "must",
        href: "/capabilities/pipeline-management/",
      },
      {
        id: "tasks",
        title: "Tasks & follow-ups",
        description: "Next touches on aging tenders and strategic accounts.",
        priority: "must",
      },
      {
        id: "activities",
        title: "Activity logging",
        description: "Calls and meetings on the account, not only in chat.",
        priority: "must",
      },
      {
        id: "reporting",
        title: "Pipeline & activity reporting",
        description: "Aging quotes and coverage views for sales meetings.",
        priority: "nice",
        href: "/capabilities/reporting/",
      },
      {
        id: "integrations",
        title: "TMS / rating integrations",
        description: "Verify scope; keep dispatch truth in ops systems.",
        priority: "nice",
      },
    ],
    workflowSteps: [
      {
        id: "account",
        label: "Account",
        detail: "Maintain the shipper account and key procurement/ops contacts.",
      },
      {
        id: "capture",
        label: "Capture",
        detail: "Tender or expansion opportunity opens with owner and due date.",
      },
      {
        id: "quote",
        label: "Quote",
        detail: "Advance stages through pricing, negotiation, and decision.",
      },
      {
        id: "hand-off",
        label: "Hand off",
        detail: "Won work connects to ops/TMS processes without duplicating dispatch.",
      },
      {
        id: "retain",
        label: "Retain",
        detail: "CS reviews account health, stakeholders, and next expansion touches.",
      },
    ],
    heroVisual: {
      src: "/industries/transportation-logistics-hero.png",
      alt: "Educational diagram of transportation-logistics CRM for shipper accounts and tender pipelines beside a TMS execution layer.",
      caption:
        "Logistics CRM is account and tender discipline — TMS still runs the loads.",
    },
    needsVisual: {
      src: "/industries/transportation-logistics-needs.png",
      alt: "Diagram of logistics CRM pains — inbox quotes, invisible account risk, CRM/TMS blur, CS handoff gaps — mapped to CRM fixes.",
      caption:
        "Where freight sales relationship work breaks — and how CRM process helps.",
    },
    workflowVisual: {
      src: "/industries/transportation-logistics-workflow.png",
      alt: "Five-step transportation-logistics CRM workflow: account, capture, quote, hand off, retain.",
      caption: "A practical shipper-account loop for logistics teams.",
    },
    faq: [
      {
        question: "Should loads be managed in the CRM?",
        answer:
          "No for day-to-day dispatch. Keep load execution in TMS/ops tools. Use CRM for shipper relationships, tenders, and account follow-up.",
      },
      {
        question: "What makes a good tender pipeline stage set?",
        answer:
          "Stages that match how you actually quote and decide — e.g. received, quoted, negotiating, won/lost — with due dates and owners on every open item.",
      },
      {
        question: "How do sales and CS share one shipper account?",
        answer:
          "One account record, clear role contacts, and a retention or expansion next step. Avoid separate shadow spreadsheets per team.",
      },
    ],
  },
};
