import type { UseCaseHubProfile } from "@/domain";

type Depth = Pick<
  UseCaseHubProfile,
  | "overview"
  | "whoThisIsFor"
  | "whatMattersIntro"
  | "workedExample"
  | "workedExampleSecondary"
  | "tagline"
  | "displayTitle"
  | "badgeLabel"
  | "glance"
  | "challenges"
  | "outcomes"
  | "capabilityNeeds"
  | "workflowSteps"
  | "priorities"
  | "scenarios"
  | "buyingFramework"
  | "needsVisual"
  | "workflowVisual"
  | "heroVisual"
  | "faq"
  | "relatedUseCaseSlugs"
  | "featuredGuideHrefs"
  | "categorySlug"
  | "finderHref"
  | "catalogueHref"
  | "primaryCta"
  | "secondaryCta"
  | "buyingGuideHref"
>;

/**
 * Depth layers for CRM (and SI/marketing-adjacent) use-case hub pages.
 * Category packs (email marketing, BC, PM, HR) are lazy-loaded from
 * `use-case-hub/index.ts` — do not import them here.
 */
export const useCaseDepthBySlug: Record<string, Depth> = {
  "pipeline-management": {
    displayTitle: "CRM for Pipeline Management",
    badgeLabel: "Pipeline",
    tagline:
      "Keep every open opportunity owned, staged, and reviewable — so weekly forecasts stop being storytelling.",
    overview:
      "Pipeline management is the CRM job of tracking deals through defined stages with clear owners and next steps. Teams use it to see where opportunities stall, coach from a shared board, and replace private spreadsheets with a process everyone can explain.",
    whoThisIsFor:
      "Sales managers, AEs, and founders who run multi-person pipelines and need a single view of open deals. You are past “keep it in your head,” and Friday reviews still depend on verbal updates instead of a trusted stage board.",
    whatMattersIntro:
      "Prioritize honest stage definitions, mandatory ownership, and activity that attaches to the deal — not feature count. A short pipeline the team updates beats a complex board nobody trusts.",
    workedExample:
      "Worked example: a B2B sales pod with four AEs. Before CRM, each rep kept deals in a personal sheet and managers reconstructed status in Slack. After CRM, every opportunity has a stage, owner, and next date — Monday reviews start from stuck deals, not from “any updates?”",
    workedExampleSecondary:
      "Worked example: a founder-led team hiring its first AE. Before CRM, the founder’s inbox was the pipeline. After CRM, demos and proposals live on a shared board so coverage and coaching survive vacations and handoffs.",
    glance: {
      primaryGoal: "Shared, honest visibility of open opportunities by stage",
      typicalTeam: "Sales managers, AEs, and founder-led pods",
      commonPriorities: [
        "Clear stage definitions",
        "Named deal owners",
        "Next-step discipline",
        "Weekly board reviews",
        "Pipeline reporting",
      ],
    },
    challenges: [
      {
        id: "sheet-drift",
        title: "Pipeline lives in private spreadsheets",
        pain: "Managers cannot see the same deals reps claim are “active,” so forecasts disagree.",
        crmHelps:
          "One shared stage board with required owners replaces conflicting personal lists.",
      },
      {
        id: "stage-fiction",
        title: "Stages do not match how you actually sell",
        pain: "Deals jump ahead while discovery, proposal, or approval work is unfinished.",
        crmHelps:
          "Stages encode real checkpoints so reviews focus on blockers, not wishful status.",
      },
      {
        id: "orphan-deals",
        title: "Opportunities have no clear owner",
        pain: "Warm deals cool off because nobody owns the next conversation.",
        crmHelps:
          "Ownership and next-step dates sit on the record so coverage is visible.",
      },
      {
        id: "review-theater",
        title: "Pipeline meetings are storytelling",
        pain: "Time goes to reconstructing history instead of coaching stuck deals.",
        crmHelps:
          "A trusted board makes reviews about next actions and stage honesty.",
      },
    ],
    outcomes: [
      {
        id: "shared-board",
        title: "One pipeline the team trusts",
        description:
          "Open deals stop living in private sheets and Slack threads.",
      },
      {
        id: "owned-next",
        title: "Owned next steps on every deal",
        description:
          "Coverage and coaching start from dates and owners, not memory.",
      },
      {
        id: "honest-forecast",
        title: "More honest weekly reviews",
        description:
          "Stuck stages surface early instead of at quarter-end surprises.",
      },
      {
        id: "faster-handoffs",
        title: "Cleaner handoffs",
        description:
          "New AEs and covering managers inherit context with the deal.",
      },
    ],
    capabilityNeeds: [
      {
        id: "stages",
        title: "Custom deal stages",
        description: "A stage model that matches how you actually sell.",
        priority: "must",
      },
      {
        id: "ownership",
        title: "Deal ownership & assignment",
        description: "Every open opportunity has a named owner.",
        priority: "must",
      },
      {
        id: "activity",
        title: "Activity & next-step tasks",
        description: "Notes, calls, and due dates attached to the deal.",
        priority: "must",
      },
      {
        id: "pipeline-views",
        title: "Pipeline board / list views",
        description: "Filter by owner, stage, and stuck age for reviews.",
        priority: "must",
      },
      {
        id: "pipeline-reporting",
        title: "Pipeline reporting",
        description: "Stage conversion and forecast snapshots for managers.",
        priority: "nice",
        href: "/capabilities/reporting/",
      },
      {
        id: "automation",
        title: "Light stage automation",
        description: "Reminders and tasks after hygiene is real — not day one.",
        priority: "nice",
        href: "/capabilities/workflow-automation/",
      },
    ],
    workflowSteps: [
      {
        id: "create",
        label: "Create",
        detail: "Qualified opportunity enters the pipeline with a named owner.",
      },
      {
        id: "stage",
        label: "Stage",
        detail: "Advance only when the real checkpoint for that stage is done.",
      },
      {
        id: "act",
        label: "Act",
        detail: "Log activity and set the next date on the deal record.",
      },
      {
        id: "review",
        label: "Review",
        detail: "Weekly board review: stuck deals, missing owners, weak next steps.",
      },
      {
        id: "close",
        label: "Close or recycle",
        detail: "Won/lost with reason; carry notes into delivery or nurture.",
      },
    ],
    priorities: [
      {
        id: "honest-stages",
        title: "Honest stage definitions",
        description: "Few stages everyone can explain in one sentence.",
        icon: "funnel",
      },
      {
        id: "owners",
        title: "Mandatory ownership",
        description: "No orphan deals — coverage is visible on the board.",
        icon: "users",
      },
      {
        id: "next-steps",
        title: "Next-step discipline",
        description: "Every open deal has a dated next action.",
        icon: "zap",
      },
      {
        id: "weekly-review",
        title: "Weekly board reviews",
        description: "Coach from the pipeline, not from Slack archaeology.",
        icon: "chart",
        href: "/use-cases/reporting/",
      },
      {
        id: "adoption",
        title: "Adoption over complexity",
        description: "A simple board updated beats a fancy empty one.",
        icon: "shield",
        href: "/guides/crm-adoption/",
      },
    ],
    scenarios: [
      {
        id: "multi-rep",
        title: "Multi-rep sales pods",
        bestWhen:
          "Two or more people sell the same offer and managers need a shared view.",
        icon: "users",
      },
      {
        id: "leaving-sheets",
        title: "Leaving spreadsheets",
        bestWhen:
          "Deal lists disagree across personal sheets and inbox folders.",
        icon: "funnel",
        href: "/guides/crm-vs-spreadsheet/",
      },
      {
        id: "forecast-pressure",
        title: "Forecast pressure",
        bestWhen:
          "Leadership needs stage-based visibility without rebuilding status weekly.",
        icon: "chart",
        href: "/use-cases/reporting/",
      },
    ],
    buyingFramework: [
      {
        step: 1,
        title: "Map your real selling stages",
        description:
          "Write the checkpoints you already use — discovery, proposal, negotiation — before demos.",
      },
      {
        step: 2,
        title: "Define must-have pipeline workflows",
        description:
          "Ownership, stage moves, activity logging, and a weekly review view.",
        href: "/guides/crm-requirements-guide/",
        ctaLabel: "Requirements guide →",
      },
      {
        step: 3,
        title: "Trial with live deals",
        description:
          "Import a slice of open opportunities and run one real review cycle.",
        href: "/guides/crm-trial-evaluation/",
        ctaLabel: "Trial evaluation →",
      },
      {
        step: 4,
        title: "Confirm reporting inputs",
        description:
          "Check that stage and amount fields support the reviews you need.",
        href: "/use-cases/reporting/",
        ctaLabel: "Reporting use case →",
      },
      {
        step: 5,
        title: "Name an admin owner",
        description:
          "Someone owns fields, stages, and hygiene weekly — or the board decays.",
      },
    ],
    heroVisual: {
      src: "/use-cases/pipeline-management-hero.png",
      alt: "Educational diagram of CRM pipeline management: deals moving through stages with owners and next steps on a shared board.",
      caption:
        "Pipeline management turns open opportunities into a shared, reviewable process.",
    },
    needsVisual: {
      src: "/use-cases/pipeline-management-needs.png",
      alt: "Diagram mapping pipeline pains — private sheets, fictional stages, orphan deals, review theater — to CRM fixes.",
      caption:
        "What usually breaks in pipeline work — and how CRM process design addresses it.",
    },
    workflowVisual: {
      src: "/use-cases/pipeline-management-workflow.png",
      alt: "Five-step pipeline CRM workflow: create, stage, act, review, close or recycle.",
      caption:
        "A practical pipeline loop — advance stages only when real checkpoints complete.",
    },
    faq: [
      {
        question: "What is pipeline management in a CRM?",
        answer:
          "It is tracking open opportunities through defined stages with owners and next steps, so the team shares one view of where deals stand and what happens next.",
      },
      {
        question: "How many pipeline stages should we start with?",
        answer:
          "Usually five to seven stages everyone can explain. Add complexity only after the team updates the board consistently.",
      },
      {
        question: "Do we need forecasting features on day one?",
        answer:
          "Not if ownership and stage honesty are still weak. Get a trusted board first; forecasting quality follows data quality.",
      },
      {
        question: "How is this different from lead management?",
        answer:
          "Lead management covers capture and qualification before a deal is created. Pipeline management starts once an opportunity is owned and staged.",
      },
    ],
    relatedUseCaseSlugs: [
      "lead-management",
      "sales-automation",
      "reporting",
      "sales-engagement",
    ],
    featuredGuideHrefs: [
      "/guides/how-to-choose-crm/",
      "/guides/crm-requirements-guide/",
      "/guides/crm-adoption/",
      "/guides/crm-implementation-kpis/",
    ],
  },

  "lead-management": {
    displayTitle: "CRM for Lead Management",
    badgeLabel: "Leads",
    tagline:
      "Capture, qualify, and route inbound and outbound leads before they disappear into inboxes.",
    overview:
      "Lead management is the CRM job of turning inquiries and prospect lists into owned, qualified work. Teams use it to prevent speed-to-lead failures, route by territory or product, and decide which leads become pipeline deals.",
    whoThisIsFor:
      "SDR/BDR teams, inbound owners, marketing ops partners, and sales managers who need consistent capture and qualification. You lose warm interest when forms, ads, or lists land without a clear owner and response SLA.",
    whatMattersIntro:
      "Prioritize capture sources, ownership rules, qualification criteria, and conversion into opportunities. Scoring and automation help after routing and response habits are reliable.",
    workedExample:
      "Worked example: a SaaS team with demo request forms. Before CRM, requests sat in a shared inbox and response times varied by who checked email. After CRM, every lead is owned within minutes, with source fields and a clear qualify-or-disqualify path.",
    workedExampleSecondary:
      "Worked example: a regional services firm buying lists. Before CRM, SDRs worked the same contacts twice from separate sheets. After CRM, lead status and last touch live on one record so outreach is coordinated.",
    glance: {
      primaryGoal: "Fast, owned qualification from inquiry to opportunity",
      typicalTeam: "SDRs, inbound owners, and sales managers",
      commonPriorities: [
        "Capture from every source",
        "Routing & ownership",
        "Qualification criteria",
        "Speed-to-lead",
        "Clean conversion to deals",
      ],
    },
    challenges: [
      {
        id: "inbox-leaks",
        title: "Leads hide in shared inboxes",
        pain: "No one knows who responded, so follow-ups duplicate or never happen.",
        crmHelps:
          "Each lead becomes a record with an owner, status, and activity timeline.",
      },
      {
        id: "routing-chaos",
        title: "Routing rules are tribal knowledge",
        pain: "Territory and product ownership live in Slack, so leads bounce or stall.",
        crmHelps:
          "Assignment rules and queues make ownership explicit and auditable.",
      },
      {
        id: "weak-qualify",
        title: "Qualification is inconsistent",
        pain: "Junk opportunities clog the pipeline while good leads wait.",
        crmHelps:
          "Shared qualify fields and statuses create a repeatable gate before deals.",
      },
      {
        id: "source-blind",
        title: "Source and campaign context is lost",
        pain: "Teams cannot tell which channels produce workable leads.",
        crmHelps:
          "Source fields travel with the lead into the opportunity for honest review.",
      },
    ],
    outcomes: [
      {
        id: "owned-leads",
        title: "Every lead has an owner",
        description:
          "Inquiries stop dying in shared inboxes and personal tabs.",
      },
      {
        id: "faster-response",
        title: "Faster, measurable response",
        description:
          "Time-to-first-touch becomes visible and coachable.",
      },
      {
        id: "cleaner-pipeline",
        title: "Cleaner pipeline intake",
        description:
          "Only qualified leads become opportunities with context intact.",
      },
      {
        id: "source-clarity",
        title: "Clearer channel feedback",
        description:
          "Source data supports better conversations between sales and marketing.",
      },
    ],
    capabilityNeeds: [
      {
        id: "capture",
        title: "Lead capture & forms",
        description: "Web, import, and manual entry land as owned records.",
        priority: "must",
      },
      {
        id: "routing",
        title: "Assignment & routing",
        description: "Rules or queues that put leads with the right owner.",
        priority: "must",
      },
      {
        id: "qualify-fields",
        title: "Qualification fields & statuses",
        description: "A shared gate before converting to an opportunity.",
        priority: "must",
      },
      {
        id: "activity",
        title: "Activity logging on leads",
        description: "Calls, emails, and notes stay on the lead record.",
        priority: "must",
      },
      {
        id: "scoring",
        title: "Lead scoring / prioritization",
        description: "Useful after volume rises and criteria are stable.",
        priority: "nice",
      },
      {
        id: "automation",
        title: "Follow-up automation",
        description: "Reminders and sequences once ownership habits stick.",
        priority: "nice",
        href: "/capabilities/workflow-automation/",
      },
    ],
    workflowSteps: [
      {
        id: "capture",
        label: "Capture",
        detail: "Inquiry or list entry becomes a lead with source fields.",
        goal: "Get every inbound and list-sourced inquiry into an owned lead record with source intact.",
        capabilities: [
          {
            id: "lead-capture",
            label: "Lead capture & forms",
            href: "/capabilities/lead-management/",
          },
        ],
        requirements: [
          {
            id: "capture-channels",
            label: "Capture leads from required channels",
            priority: "must",
          },
          {
            id: "preserve-source",
            label: "Preserve source and campaign context",
            priority: "important",
          },
        ],
        features: [
          { id: "lead-management", label: "Lead management" },
          { id: "web-forms", label: "Web forms" },
        ],
      },
      {
        id: "route",
        label: "Assign",
        detail: "Assign to a person or queue based on territory, product, or SLA.",
        goal: "Get each qualified lead to the correct salesperson quickly.",
        capabilities: [
          {
            id: "assignment",
            label: "Assignment & routing",
            href: "/capabilities/lead-management/",
          },
          {
            id: "automation",
            label: "Workflow automation",
            href: "/capabilities/workflow-automation/",
          },
        ],
        requirements: [
          {
            id: "auto-assign",
            label: "Automatic lead assignment",
            priority: "must",
            href: "/requirements/automate-lead-follow-up/",
          },
          {
            id: "territory",
            label: "Territory routing",
            priority: "important",
          },
          {
            id: "round-robin",
            label: "Round-robin assignment",
            priority: "optional",
          },
        ],
        features: [
          { id: "lead-management", label: "Assignment rules" },
          { id: "workflow-automation", label: "Workflow automation" },
          { id: "deal-management", label: "Team ownership" },
        ],
      },
      {
        id: "qualify",
        label: "Qualify",
        detail: "Apply shared criteria; update status with notes.",
        goal: "Decide fit consistently before creating pipeline opportunities.",
        capabilities: [
          {
            id: "qualify-fields",
            label: "Qualification fields & statuses",
            href: "/capabilities/lead-management/",
          },
        ],
        requirements: [
          {
            id: "qualify-criteria",
            label: "Define lead qualification criteria",
            priority: "must",
          },
          {
            id: "scoring",
            label: "Prioritize with scoring when volume rises",
            priority: "optional",
          },
        ],
        features: [
          { id: "lead-management", label: "Lead statuses" },
          { id: "lead-scoring", label: "Lead scoring" },
        ],
      },
      {
        id: "convert",
        label: "Convert",
        detail: "Create an opportunity (or contact/account) with context preserved.",
        goal: "Hand off ready leads into pipeline without restarting discovery.",
        capabilities: [
          {
            id: "pipeline",
            label: "Pipeline management",
            href: "/capabilities/pipeline-management/",
          },
        ],
        requirements: [
          {
            id: "convert-opp",
            label: "Convert leads into opportunities",
            priority: "must",
          },
        ],
        features: [
          { id: "deal-management", label: "Deal / opportunity creation" },
          { id: "pipeline-management", label: "Pipeline stages" },
        ],
      },
      {
        id: "recycle",
        label: "Follow up / recycle",
        detail: "Nurture, disqualify with reason, or re-route — no silent drops.",
        goal: "Keep unfinished leads visible with a next action — never silent drops.",
        capabilities: [
          {
            id: "activity",
            label: "Activity management",
            href: "/capabilities/workflow-automation/",
          },
        ],
        requirements: [
          {
            id: "track-follow-up",
            label: "Track follow-up",
            priority: "must",
          },
          {
            id: "disqualify-reason",
            label: "Record disqualify reasons",
            priority: "important",
          },
        ],
        features: [
          { id: "workflow-automation", label: "Task automation" },
          { id: "email-sequences", label: "Email sequences" },
        ],
      },
    ],
    priorities: [
      {
        id: "speed",
        title: "Speed-to-lead",
        description: "Owned response within your SLA beats perfect scoring.",
        icon: "zap",
      },
      {
        id: "routing",
        title: "Clear routing",
        description: "Territory and product ownership must be explicit.",
        icon: "users",
      },
      {
        id: "qualify-gate",
        title: "Shared qualification gate",
        description: "Protect the pipeline from unready opportunities.",
        icon: "funnel",
        href: "/use-cases/pipeline-management/",
      },
      {
        id: "source",
        title: "Source discipline",
        description: "Keep campaign and channel context on the record.",
        icon: "chart",
      },
      {
        id: "handoff",
        title: "Clean handoff to pipeline",
        description: "Conversion should carry notes, not restart discovery.",
        icon: "workflow",
      },
    ],
    scenarios: [
      {
        id: "inbound",
        title: "Inbound demo or quote requests",
        bestWhen:
          "Forms and ads create volume that a shared inbox cannot handle fairly.",
        icon: "mail",
      },
      {
        id: "sdr-team",
        title: "SDR / BDR teams",
        bestWhen:
          "Multiple people work lists and need status without stepping on each other.",
        icon: "users",
        href: "/use-cases/prospecting/",
      },
      {
        id: "marketing-align",
        title: "Sales–marketing alignment",
        bestWhen:
          "You need shared definitions of MQL/SQL and honest source feedback.",
        icon: "chart",
      },
    ],
    buyingFramework: [
      {
        step: 1,
        title: "List every lead source",
        description:
          "Forms, imports, partners, events — each needs a capture path.",
      },
      {
        step: 2,
        title: "Write routing and SLA rules",
        description:
          "Who owns what, and how fast first touch must happen.",
      },
      {
        step: 3,
        title: "Define qualification criteria",
        description:
          "Fields and statuses that gate conversion to opportunities.",
        href: "/guides/crm-requirements-guide/",
        ctaLabel: "Requirements guide →",
      },
      {
        step: 4,
        title: "Trial capture-to-convert",
        description:
          "Run real leads through assign → qualify → convert in a sandbox.",
        href: "/guides/crm-trial-evaluation/",
        ctaLabel: "Trial evaluation →",
      },
      {
        step: 5,
        title: "Decide automation later",
        description:
          "Automate reminders only after ownership and statuses are trusted.",
        href: "/use-cases/sales-automation/",
        ctaLabel: "Sales automation →",
      },
    ],
    heroVisual: {
      src: "/use-cases/lead-management-hero.png",
      alt: "Educational diagram of CRM lead management: capture sources feeding owned leads, qualification, and conversion to pipeline.",
      caption:
        "Lead management turns inquiries into owned, qualified work before deals are created.",
    },
    needsVisual: {
      src: "/use-cases/lead-management-needs.png",
      alt: "Diagram mapping lead-management pains — inbox leaks, routing chaos, weak qualification, lost source — to CRM fixes.",
      caption:
        "What usually breaks in lead handling — and how CRM process design addresses it.",
    },
    workflowVisual: {
      src: "/use-cases/lead-management-workflow.png",
      alt: "Five-step lead CRM workflow: capture, route, qualify, convert, recycle or close.",
      caption:
        "A practical lead loop from first touch to pipeline or deliberate recycle.",
    },
    faq: [
      {
        question: "What is lead management in a CRM?",
        answer:
          "It is capturing inquiries and prospect lists as owned records, qualifying them with shared criteria, and converting ready leads into opportunities without losing context.",
      },
      {
        question: "When should a lead become an opportunity?",
        answer:
          "When your team agrees the prospect meets qualification criteria and someone will actively advance a deal. Converting too early clogs the pipeline; converting too late hides real work.",
      },
      {
        question: "Do we need lead scoring immediately?",
        answer:
          "Usually no. Fix capture, ownership, and response SLA first. Scoring helps when volume is high and criteria are stable.",
      },
      {
        question: "How does this relate to prospecting?",
        answer:
          "Prospecting finds and prioritizes who to contact. Lead management tracks those people (and inbound inquiries) through ownership and qualification.",
      },
    ],
    relatedUseCaseSlugs: [
      "prospecting",
      "pipeline-management",
      "email-outreach",
      "sales-automation",
    ],
    featuredGuideHrefs: [
      "/guides/how-to-choose-crm/",
      "/guides/crm-requirements-guide/",
      "/guides/how-crm-works/",
      "/guides/when-to-adopt-crm/",
    ],
  },

  "contact-management": {
    displayTitle: "CRM for Contact Management",
    badgeLabel: "Contacts",
    tagline:
      "Keep people, companies, and interaction history in one searchable system the whole team can trust.",
    overview:
      "Contact management is the CRM foundation of durable records for people and organizations. Teams use it so notes, emails, and roles are not trapped in personal inboxes — and so coverage does not mean rebuilding history from scratch.",
    whoThisIsFor:
      "Anyone who shares customers across sales, success, or delivery — from small owner-led teams to account pods. You need searchable people and company records before advanced pipelines or automation pay off.",
    whatMattersIntro:
      "Prioritize clean contact/company structure, activity timelines, and low-friction logging (especially email/calendar sync). Fancy fields help only after duplicates and ownership are under control.",
    workedExample:
      "Worked example: a professional-services firm. Before CRM, client history lived in partner notebooks and email folders. After CRM, each contact sits under an account with a shared timeline — covering partners stop asking “who spoke last?”",
    workedExampleSecondary:
      "Worked example: a small sales team leaving spreadsheets. Before CRM, phone numbers and roles drifted across conflicting rows. After CRM, one contact record is the source of truth, with duplicates merged and roles labeled.",
    glance: {
      primaryGoal: "Shared, searchable people and company history",
      typicalTeam: "Sales, account, and ops teams that share customers",
      commonPriorities: [
        "Contact & company records",
        "Activity timelines",
        "Duplicate control",
        "Email / calendar sync",
        "Roles & relationships",
      ],
    },
    challenges: [
      {
        id: "tribal-history",
        title: "Context lives with one person",
        pain: "When that person is out, the team rebuilds relationships from memory.",
        crmHelps:
          "Notes, emails, and meetings attach to shared contact and account records.",
      },
      {
        id: "duplicates",
        title: "Duplicate contacts multiply",
        pain: "The same person appears three times with conflicting details.",
        crmHelps:
          "Deduplication and merge habits keep one trusted record.",
      },
      {
        id: "orphan-notes",
        title: "Notes never attach to the right person",
        pain: "Useful detail stays in chat tools and never surfaces later.",
        crmHelps:
          "Activity logging on the contact makes history searchable.",
      },
      {
        id: "weak-accounts",
        title: "People are disconnected from companies",
        pain: "Buying committees and account context are invisible.",
        crmHelps:
          "Account hierarchies and roles map who belongs together.",
      },
    ],
    outcomes: [
      {
        id: "one-record",
        title: "One trusted contact record",
        description:
          "The team stops arguing which phone number or email is current.",
      },
      {
        id: "coverage",
        title: "Coverage without archaeology",
        description:
          "Anyone can pick up a relationship with timeline context.",
      },
      {
        id: "search",
        title: "Faster findability",
        description:
          "People and companies are searchable instead of buried in inboxes.",
      },
      {
        id: "foundation",
        title: "Solid foundation for other CRM jobs",
        description:
          "Pipeline, engagement, and reporting inherit clean records.",
      },
    ],
    capabilityNeeds: [
      {
        id: "contacts-accounts",
        title: "Contacts & companies",
        description: "People linked to organizations with clear ownership.",
        priority: "must",
      },
      {
        id: "timeline",
        title: "Interaction timeline",
        description: "Emails, calls, meetings, and notes on one record.",
        priority: "must",
      },
      {
        id: "dedupe",
        title: "Duplicate detection / merge",
        description: "Keep one trusted version of each person.",
        priority: "must",
      },
      {
        id: "email-sync",
        title: "Email / calendar sync",
        description: "Reduce manual logging so history actually gets captured.",
        priority: "must",
      },
      {
        id: "custom-fields",
        title: "Custom fields & roles",
        description: "Capture the attributes your process actually uses.",
        priority: "nice",
      },
      {
        id: "permissions",
        title: "Team permissions",
        description: "Share records without exposing every sensitive field.",
        priority: "nice",
      },
    ],
    workflowSteps: [
      {
        id: "create",
        label: "Create / enrich",
        detail: "Add or update contact and company with required fields only.",
      },
      {
        id: "relate",
        label: "Relate",
        detail: "Link people to accounts and label roles in the buying map.",
      },
      {
        id: "log",
        label: "Log",
        detail: "Attach notes and synced activity to the right record.",
      },
      {
        id: "dedupe",
        label: "Dedupe",
        detail: "Merge duplicates on a regular hygiene cadence.",
      },
      {
        id: "use",
        label: "Use",
        detail: "Start every follow-up from the timeline, not from Slack search.",
      },
    ],
    priorities: [
      {
        id: "structure",
        title: "Contact–company structure",
        description: "People belong to accounts; roles are labeled.",
        icon: "users",
      },
      {
        id: "timeline",
        title: "Complete timelines",
        description: "History is attached, searchable, and shared.",
        icon: "mail",
      },
      {
        id: "hygiene",
        title: "Hygiene habits",
        description: "Duplicates and stale fields get a weekly owner.",
        icon: "shield",
      },
      {
        id: "low-friction",
        title: "Low logging friction",
        description: "Sync reduces the tax that kills adoption.",
        icon: "zap",
      },
      {
        id: "minimal-fields",
        title: "Minimal required fields",
        description: "Only ask for data the team will actually maintain.",
        icon: "funnel",
        href: "/guides/crm-governance/",
      },
    ],
    scenarios: [
      {
        id: "shared-book",
        title: "Shared customer book",
        bestWhen:
          "More than one person covers the same accounts and needs history.",
        icon: "users",
        href: "/use-cases/relationship-management/",
      },
      {
        id: "leaving-inbox",
        title: "Leaving inbox-as-CRM",
        bestWhen:
          "Important details only exist in personal email folders.",
        icon: "mail",
        href: "/guides/crm-vs-spreadsheet/",
      },
      {
        id: "growing-team",
        title: "Growing teams",
        bestWhen:
          "New hires should inherit context instead of shadowing for weeks.",
        icon: "trending",
      },
    ],
    buyingFramework: [
      {
        step: 1,
        title: "Inventory where contacts live today",
        description:
          "Sheets, inboxes, and tools that hold phone numbers and roles.",
        href: "/guides/crm-vs-spreadsheet/",
        ctaLabel: "CRM vs spreadsheet →",
      },
      {
        step: 2,
        title: "Define required fields only",
        description:
          "Name, company, role, owner — resist a giant form on day one.",
        href: "/guides/crm-requirements-guide/",
        ctaLabel: "Requirements guide →",
      },
      {
        step: 3,
        title: "Require email/calendar sync in trials",
        description:
          "If logging is painful, history will not stay current.",
      },
      {
        step: 4,
        title: "Plan duplicate hygiene",
        description:
          "Who merges records weekly, and what “good enough” looks like.",
      },
      {
        step: 5,
        title: "Migrate active relationships first",
        description:
          "Import the book you touch now — not years of junk contacts.",
      },
    ],
    heroVisual: {
      src: "/use-cases/contact-management-hero.png",
      alt: "Educational diagram of CRM contact management: people linked to companies with a shared interaction timeline.",
      caption:
        "Contact management is the shared memory layer every other CRM job depends on.",
    },
    needsVisual: {
      src: "/use-cases/contact-management-needs.png",
      alt: "Diagram mapping contact-management pains — tribal history, duplicates, orphan notes, weak accounts — to CRM fixes.",
      caption:
        "What usually breaks in contact work — and how CRM structure addresses it.",
    },
    workflowVisual: {
      src: "/use-cases/contact-management-workflow.png",
      alt: "Five-step contact CRM workflow: create/enrich, relate, log, dedupe, use.",
      caption:
        "A practical contact loop that keeps people and companies trustworthy.",
    },
    faq: [
      {
        question: "Is contact management enough CRM for a small team?",
        answer:
          "Sometimes. If your main pain is shared history and follow-ups, contacts plus tasks may be enough before you invest in complex pipelines.",
      },
      {
        question: "How is contact management different from relationship management?",
        answer:
          "Contact management is the record structure and timeline. Relationship management is the ongoing operating rhythm of coverage, check-ins, and account health on top of those records.",
      },
      {
        question: "Should we import every old contact on day one?",
        answer:
          "Usually no. Start with active relationships and recent opportunities. Expand once hygiene habits exist.",
      },
      {
        question: "What fields should be required?",
        answer:
          "Only fields the team will maintain weekly. Extra required fields increase skip behavior and dirty data.",
      },
    ],
    relatedUseCaseSlugs: [
      "relationship-management",
      "lead-management",
      "pipeline-management",
      "reporting",
    ],
    featuredGuideHrefs: [
      "/guides/what-is-crm/",
      "/guides/how-crm-works/",
      "/guides/crm-vs-spreadsheet/",
      "/guides/how-to-choose-crm/",
    ],
  },

  "sales-automation": {
    displayTitle: "CRM for Sales Automation",
    badgeLabel: "Automation",
    tagline:
      "Automate repetitive follow-ups and handoffs — after the team trusts owners, stages, and data.",
    overview:
      "Sales automation is the CRM job of using rules and workflows to reduce repetitive tasks without removing human judgment. Teams use it for reminders, stage-based tasks, lead routing, and notification — once process and hygiene are real enough to automate safely.",
    whoThisIsFor:
      "Sales ops, managers, and growing teams drowning in manual reminders and handoff checklists. You already have a CRM people update, but the same follow-ups and assignments still rely on memory.",
    whatMattersIntro:
      "Prioritize triggers tied to real process events (new lead, stage change, idle deal) and keep humans in the loop for judgment calls. Automating a broken process just scales chaos.",
    workedExample:
      "Worked example: a mid-market AE team. Before CRM automation, managers pinged reps about idle deals in Slack. After CRM, idle-stage rules create tasks at day seven — coaching focuses on stuck deals, not nagging.",
    workedExampleSecondary:
      "Worked example: an inbound SDR pod. Before CRM, routing waited on a human coordinator. After CRM, assignment rules route by territory immediately, with an alert if the owner misses the SLA.",
    glance: {
      primaryGoal: "Reduce repetitive sales admin without losing judgment",
      typicalTeam: "Sales ops, managers, and process-ready sales pods",
      commonPriorities: [
        "Trusted base process",
        "Event-based triggers",
        "Task & reminder automation",
        "Routing rules",
        "Human override",
      ],
    },
    challenges: [
      {
        id: "automate-chaos",
        title: "Automating before hygiene exists",
        pain: "Bad stages and missing owners produce noisy tasks nobody trusts.",
        crmHelps:
          "Start with clean stages and ownership; automate only proven events.",
      },
      {
        id: "manual-nags",
        title: "Managers become human reminder systems",
        pain: "Follow-up discipline depends on Slack pings, not the process.",
        crmHelps:
          "Idle-deal and next-step rules create tasks where the work lives.",
      },
      {
        id: "handoff-drops",
        title: "Handoffs drop between roles",
        pain: "SDR-to-AE or AE-to-CS steps rely on someone remembering a checklist.",
        crmHelps:
          "Stage or status changes can create the next owner’s required tasks.",
      },
      {
        id: "over-automation",
        title: "Sequences feel spammy",
        pain: "Automation runs without context and damages relationships.",
        crmHelps:
          "Keep judgment gates; automate reminders and logging, not every message.",
      },
    ],
    outcomes: [
      {
        id: "fewer-drops",
        title: "Fewer dropped follow-ups",
        description:
          "Idle work surfaces as tasks instead of disappearing.",
      },
      {
        id: "consistent-handoffs",
        title: "More consistent handoffs",
        description:
          "Role transitions carry required next steps automatically.",
      },
      {
        id: "manager-leverage",
        title: "Managers coach, not nag",
        description:
          "Time shifts from reminders to stuck-deal conversations.",
      },
      {
        id: "scalable-process",
        title: "Process that scales with seats",
        description:
          "New hires inherit the same triggers without tribal checklists.",
      },
    ],
    capabilityNeeds: [
      {
        id: "workflow-builder",
        title: "Workflow / rule builder",
        description: "If-this-then-that rules on records and stages.",
        priority: "must",
      },
      {
        id: "tasks",
        title: "Automated tasks & reminders",
        description: "Create owned work when events fire.",
        priority: "must",
      },
      {
        id: "routing",
        title: "Assignment automation",
        description: "Route leads and deals without a coordinator bottleneck.",
        priority: "must",
        href: "/capabilities/lead-management/",
      },
      {
        id: "base-pipeline",
        title: "Reliable stages & ownership",
        description: "Automation inputs must be trustworthy first.",
        priority: "must",
        href: "/capabilities/pipeline-management/",
      },
      {
        id: "sequence-hooks",
        title: "Sequence / cadence hooks",
        description: "Connect engagement tools when outreach volume rises.",
        priority: "nice",
        href: "/capabilities/sales-engagement/",
      },
      {
        id: "reporting",
        title: "Automation health reporting",
        description: "See which rules fire and which tasks are ignored.",
        priority: "nice",
        href: "/capabilities/reporting/",
      },
    ],
    workflowSteps: [
      {
        id: "stabilize",
        label: "Stabilize",
        detail: "Confirm owners, stages, and logging habits before any rule.",
      },
      {
        id: "pick",
        label: "Pick one job",
        detail: "Choose a high-frequency, low-judgment task (e.g. idle-deal reminder).",
      },
      {
        id: "build",
        label: "Build",
        detail: "Create a small rule with a clear owner and exit condition.",
      },
      {
        id: "monitor",
        label: "Monitor",
        detail: "Review task completion and false positives for two weeks.",
      },
      {
        id: "expand",
        label: "Expand",
        detail: "Add the next rule only after the first earns trust.",
      },
    ],
    priorities: [
      {
        id: "hygiene-first",
        title: "Hygiene before automation",
        description: "Automate a trusted process — never a messy one.",
        icon: "shield",
        href: "/guides/crm-data-quality/",
      },
      {
        id: "event-triggers",
        title: "Event-based triggers",
        description: "Stage changes, new leads, and idle timers beat vague batches.",
        icon: "zap",
      },
      {
        id: "human-gate",
        title: "Human judgment gates",
        description: "Keep people deciding what to say and when to stop.",
        icon: "users",
      },
      {
        id: "handoffs",
        title: "Handoff checklists",
        description: "Encode role transitions as required tasks.",
        icon: "workflow",
      },
      {
        id: "measure",
        title: "Measure rule health",
        description: "Kill noisy automations that create ignored tasks.",
        icon: "chart",
      },
    ],
    scenarios: [
      {
        id: "idle-deals",
        title: "Idle-deal discipline",
        bestWhen:
          "Managers spend hours chasing updates on deals with no next step.",
        icon: "funnel",
        href: "/use-cases/pipeline-management/",
      },
      {
        id: "inbound-volume",
        title: "Inbound volume",
        bestWhen:
          "Routing and SLA reminders cannot depend on one coordinator.",
        icon: "zap",
        href: "/use-cases/lead-management/",
      },
      {
        id: "role-handoffs",
        title: "Multi-role handoffs",
        bestWhen:
          "SDR → AE → CS steps drop without a shared checklist.",
        icon: "workflow",
      },
    ],
    buyingFramework: [
      {
        step: 1,
        title: "Prove the base process",
        description:
          "If stages and owners are fiction, pause automation buying.",
        href: "/use-cases/pipeline-management/",
        ctaLabel: "Pipeline use case →",
      },
      {
        step: 2,
        title: "List repetitive jobs worth automating",
        description:
          "Reminders, routing, and handoff tasks — not every email.",
        href: "/guides/crm-requirements-guide/",
        ctaLabel: "Requirements guide →",
      },
      {
        step: 3,
        title: "Require transparent rule builders in demos",
        description:
          "Ask how non-engineers create, pause, and audit workflows.",
        href: "/guides/crm-demo-guide/",
        ctaLabel: "Demo guide →",
      },
      {
        step: 4,
        title: "Pilot one rule on live data",
        description:
          "Measure false positives before rolling out a suite of automations.",
        href: "/guides/crm-trial-evaluation/",
        ctaLabel: "Trial evaluation →",
      },
      {
        step: 5,
        title: "Assign an automation owner",
        description:
          "Someone reviews rule health monthly and retires noise.",
      },
    ],
    heroVisual: {
      src: "/use-cases/sales-automation-hero.png",
      alt: "Educational diagram of CRM sales automation: process events triggering tasks, routing, and reminders with human judgment gates.",
      caption:
        "Sales automation scales follow-ups after ownership and stages are trustworthy.",
    },
    needsVisual: {
      src: "/use-cases/sales-automation-needs.png",
      alt: "Diagram mapping sales-automation pains — premature automation, manual nags, handoff drops, spammy sequences — to CRM fixes.",
      caption:
        "What usually breaks when teams automate sales work — and how to avoid it.",
    },
    workflowVisual: {
      src: "/use-cases/sales-automation-workflow.png",
      alt: "Five-step sales automation workflow: stabilize, pick one job, build, monitor, expand.",
      caption:
        "A practical automation loop — one trusted rule at a time.",
    },
    faq: [
      {
        question: "When should we add sales automation?",
        answer:
          "After the team consistently updates owners, stages, and next steps. Automating earlier multiplies bad data and ignored tasks.",
      },
      {
        question: "What should we automate first?",
        answer:
          "High-frequency, low-judgment jobs: idle-deal reminders, lead assignment, and handoff task creation. Keep message content human until cadences are mature.",
      },
      {
        question: "Is sales automation the same as marketing automation?",
        answer:
          "No. Sales automation focuses on seller workflows around leads and deals. Marketing automation centers on campaigns and nurturing — related, but different operating jobs.",
      },
      {
        question: "How do we know automation is helping?",
        answer:
          "Look for fewer dropped follow-ups, completed handoff tasks, and less manager nagging — without a rise in ignored task queues.",
      },
    ],
    relatedUseCaseSlugs: [
      "pipeline-management",
      "lead-management",
      "email-outreach",
      "sales-engagement",
    ],
    featuredGuideHrefs: [
      "/guides/how-to-choose-crm/",
      "/guides/crm-requirements-guide/",
      "/guides/common-crm-mistakes/",
      "/guides/crm-vs-marketing-automation/",
    ],
  },

  "email-outreach": {
    displayTitle: "CRM for Email Outreach",
    badgeLabel: "Email outreach",
    tagline:
      "Connect outbound and follow-up email to CRM records so every thread has context and ownership.",
    overview:
      "Email outreach in a CRM context means logging, sequencing, and tracking sales email against contacts and leads — not running marketing blasts. Teams use it so replies, opens, and next steps stay on the record the whole team can see.",
    whoThisIsFor:
      "SDRs, AEs, and founders who sell primarily over email and need outreach tied to CRM history. You are past one-off messages and need visibility into who was contacted, what was said, and what is due next.",
    whatMattersIntro:
      "Prioritize CRM sync of sends and replies, ownership of sequences, and compliance-friendly controls. Volume tools without record hygiene create duplicate outreach and lost context.",
    workedExample:
      "Worked example: an SDR team running cold and warm follow-ups. Before CRM, sequences lived in a separate mailbox tool and replies never updated lead status. After CRM, every send and reply lands on the contact — managers coach from the timeline.",
    workedExampleSecondary:
      "Worked example: AEs following up after demos. Before CRM, “I’ll send a recap” emails vanished into personal Sent folders. After CRM, outreach templates and tasks keep the deal record current for anyone covering the account.",
    glance: {
      primaryGoal: "Owned email outreach with CRM-visible history",
      typicalTeam: "SDRs, AEs, and outbound-led sales pods",
      commonPriorities: [
        "Email synced to records",
        "Sequence ownership",
        "Reply visibility",
        "Template discipline",
        "Unsubscribe / compliance basics",
      ],
    },
    challenges: [
      {
        id: "tool-split",
        title: "Outreach tools and CRM disagree",
        pain: "Sends happen in one system while status lives in another.",
        crmHelps:
          "Logging sends and replies on the contact keeps one timeline.",
      },
      {
        id: "duplicate-touch",
        title: "Two people email the same prospect",
        pain: "Without shared status, outreach collides and looks unprofessional.",
        crmHelps:
          "Ownership and last-touch fields make coverage visible before send.",
      },
      {
        id: "reply-blind",
        title: "Replies never update CRM status",
        pain: "Hot replies sit in personal inboxes while the lead looks cold in CRM.",
        crmHelps:
          "Reply sync and tasks push follow-up back onto the shared record.",
      },
      {
        id: "template-chaos",
        title: "Templates drift without process",
        pain: "Every rep invents messaging; quality and claims vary wildly.",
        crmHelps:
          "Shared templates plus required fields keep outreach consistent enough to coach.",
      },
    ],
    outcomes: [
      {
        id: "one-timeline",
        title: "One email timeline per contact",
        description:
          "The team sees what was sent without inbox archaeology.",
      },
      {
        id: "less-collision",
        title: "Fewer duplicate outreaches",
        description:
          "Ownership and last-touch prevent stepping on teammates.",
      },
      {
        id: "faster-handoffs",
        title: "Cleaner SDR → AE handoffs",
        description:
          "Conversation history travels with the lead or deal.",
      },
      {
        id: "coachable-outbound",
        title: "Coachable outbound activity",
        description:
          "Managers review real threads and next steps, not vanity send counts alone.",
      },
    ],
    capabilityNeeds: [
      {
        id: "email-sync",
        title: "Email sync to CRM records",
        description: "Sends and replies attach to contacts and leads.",
        priority: "must",
      },
      {
        id: "sequences",
        title: "Sequences / follow-up cadences",
        description: "Multi-step outreach with ownership and pause rules.",
        priority: "must",
      },
      {
        id: "templates",
        title: "Shared templates",
        description: "Reusable messaging the team can improve together.",
        priority: "must",
      },
      {
        id: "ownership",
        title: "Contact ownership visibility",
        description: "Know who is allowed to email before you send.",
        priority: "must",
        href: "/capabilities/contact-management/",
      },
      {
        id: "tracking",
        title: "Open / click tracking (optional)",
        description: "Useful signals when privacy policy allows — not a substitute for replies.",
        priority: "nice",
      },
      {
        id: "automation",
        title: "Task creation from replies",
        description: "Turn responses into owned next steps automatically.",
        priority: "nice",
        href: "/capabilities/workflow-automation/",
      },
    ],
    workflowSteps: [
      {
        id: "select",
        label: "Select",
        detail: "Choose owned contacts/leads with clear reason to reach out.",
      },
      {
        id: "personalize",
        label: "Personalize",
        detail: "Use templates as a base; adjust with CRM context.",
      },
      {
        id: "send",
        label: "Send / sequence",
        detail: "Start a cadence that logs every step to the record.",
      },
      {
        id: "capture",
        label: "Capture replies",
        detail: "Sync responses and update status or create tasks.",
      },
      {
        id: "advance",
        label: "Advance",
        detail: "Book meetings, convert leads, or pause — based on CRM status.",
      },
    ],
    priorities: [
      {
        id: "sync",
        title: "CRM-visible email history",
        description: "If it is not on the record, it did not happen for the team.",
        icon: "mail",
      },
      {
        id: "ownership",
        title: "Outreach ownership",
        description: "Prevent collision with clear contact owners.",
        icon: "users",
      },
      {
        id: "cadence",
        title: "Cadence discipline",
        description: "Sequences with pause rules beat endless one-offs.",
        icon: "zap",
        href: "/use-cases/sales-engagement/",
      },
      {
        id: "quality",
        title: "Message quality over volume",
        description: "Coach replies and relevance, not send counts alone.",
        icon: "chart",
      },
      {
        id: "compliance",
        title: "Basic compliance hygiene",
        description: "Respect opt-outs and regional rules your team must follow.",
        icon: "shield",
      },
    ],
    scenarios: [
      {
        id: "sdr-outbound",
        title: "SDR outbound",
        bestWhen:
          "Multiple people email prospects and need shared last-touch visibility.",
        icon: "mail",
        href: "/use-cases/prospecting/",
      },
      {
        id: "demo-followup",
        title: "Post-demo follow-up",
        bestWhen:
          "AEs need consistent recap and nurture emails tied to deals.",
        icon: "funnel",
        href: "/use-cases/pipeline-management/",
      },
      {
        id: "founder-outbound",
        title: "Founder-led outbound",
        bestWhen:
          "You are hiring the first SDR and need history they can inherit.",
        icon: "users",
      },
    ],
    buyingFramework: [
      {
        step: 1,
        title: "Separate sales email from marketing blasts",
        description:
          "Define the job: 1:1/1:few sales outreach tied to records.",
      },
      {
        step: 2,
        title: "Require bidirectional CRM logging",
        description:
          "Sends, replies, and status changes must land on contacts/leads.",
        href: "/guides/crm-requirements-guide/",
        ctaLabel: "Requirements guide →",
      },
      {
        step: 3,
        title: "Test collision prevention",
        description:
          "In trial, confirm two users cannot silently email the same owned contact.",
      },
      {
        step: 4,
        title: "Review complementary sales intelligence sequencers",
        description:
          "If CRM-native email is not enough, shortlist SI outreach tools that write back — keep ownership on the CRM record.",
        href: "/categories/sales-intelligence/",
        ctaLabel: "Sales intelligence category →",
      },
      {
        step: 5,
        title: "Pilot one cadence on live prospects",
        description:
          "Measure reply handling and CRM status updates for a week.",
        href: "/guides/crm-trial-evaluation/",
        ctaLabel: "Trial evaluation →",
      },
    ],
    heroVisual: {
      src: "/use-cases/email-outreach-hero.png",
      alt: "Educational diagram of CRM email outreach: sequences and replies logging to contact records with clear ownership.",
      caption:
        "Email outreach works when every send and reply strengthens shared CRM history.",
    },
    needsVisual: {
      src: "/use-cases/email-outreach-needs.png",
      alt: "Diagram mapping email-outreach pains — split tools, duplicate touches, blind replies, template chaos — to CRM fixes.",
      caption:
        "What usually breaks in sales email outreach — and how CRM sync addresses it.",
    },
    workflowVisual: {
      src: "/use-cases/email-outreach-workflow.png",
      alt: "Five-step email outreach workflow: select, personalize, send/sequence, capture replies, advance.",
      caption:
        "A practical outreach loop anchored to CRM records.",
    },
    faq: [
      {
        question: "Is CRM email outreach the same as email marketing?",
        answer:
          "No. Sales outreach is owned, conversational follow-up tied to contacts and deals. Marketing email is typically broader campaigns. Many teams need both, with clear boundaries.",
      },
      {
        question: "Do we need a separate sequencing tool?",
        answer:
          "Only if CRM-native email cannot support your cadence volume and controls. Evaluate sync quality first — a separate tool that does not update CRM recreates the split-brain problem. Sales intelligence sequencers can complement CRM when write-back is proven.",
      },
      {
        question: "What matters more: open tracking or reply logging?",
        answer:
          "Reply logging and status updates. Opens can be noisy; replies and meetings are the operational signal.",
      },
      {
        question: "How does this relate to sales engagement?",
        answer:
          "Email outreach is one channel. Sales engagement coordinates multi-channel cadences (email, call, social) around the same CRM records.",
      },
    ],
    relatedUseCaseSlugs: [
      "sales-engagement",
      "prospecting",
      "lead-management",
      "sales-automation",
    ],
    featuredGuideHrefs: [
      "/guides/how-to-choose-crm/",
      "/guides/how-to-choose-sales-intelligence/",
      "/guides/crm-requirements-guide/",
      "/guides/crm-vs-marketing-automation/",
    ],
  },

  prospecting: {
    displayTitle: "CRM for Prospecting",
    badgeLabel: "Prospecting",
    tagline:
      "Find, prioritize, and track target accounts and contacts before the first real conversation.",
    overview:
      "Prospecting is the CRM-adjacent job of building and working a prioritized list of accounts and people to contact. Teams use CRM to store targets, ownership, research notes, and outreach status so prospecting does not live in disposable spreadsheets.",
    whoThisIsFor:
      "SDRs, BDRs, and outbound AEs who build pipeline from lists and account research. You need a system of record for who is targeted, who owns them, and what has already been tried.",
    whatMattersIntro:
      "Prioritize account/contact ownership, list hygiene, research fields, and a clean path into lead or opportunity records. Data enrichment tools help after you can store and act on targets without duplication.",
    workedExample:
      "Worked example: an SDR pod working a named account list. Before CRM, targets lived in personal sheets and two reps researched the same company. After CRM, accounts are owned, research notes are shared, and outreach status is visible.",
    workedExampleSecondary:
      "Worked example: a founder doing outbound before hiring SDRs. Before CRM, LinkedIn notes and spreadsheet rows drifted apart. After CRM, every target contact has a next step — so the first hire inherits the book of work.",
    glance: {
      primaryGoal: "Owned, prioritized targets ready for first outreach",
      typicalTeam: "SDRs, BDRs, and outbound-led sellers",
      commonPriorities: [
        "Target account lists",
        "Contact ownership",
        "Research notes",
        "Outreach status",
        "Handoff into leads/deals",
      ],
    },
    challenges: [
      {
        id: "list-sprawl",
        title: "Prospect lists sprawl across sheets",
        pain: "Nobody knows which version is current or who already contacted whom.",
        crmHelps:
          "Target accounts and contacts become owned records with status fields.",
      },
      {
        id: "duplicate-research",
        title: "Duplicate research effort",
        pain: "Two people rebuild the same account map from public sources.",
        crmHelps:
          "Shared notes and roles on the account prevent rework.",
      },
      {
        id: "dead-ends",
        title: "Dead ends never get marked",
        pain: "Bad-fit accounts stay on lists and waste cycles.",
        crmHelps:
          "Disqualify reasons and statuses keep lists honest.",
      },
      {
        id: "weak-handoff",
        title: "Warm interest does not become a lead",
        pain: "Positive replies sit in inboxes without CRM follow-through.",
        crmHelps:
          "Clear convert paths turn prospecting wins into owned leads or deals.",
      },
    ],
    outcomes: [
      {
        id: "owned-targets",
        title: "Owned target lists",
        description:
          "Accounts and contacts have clear owners and statuses.",
      },
      {
        id: "less-rework",
        title: "Less duplicate research",
        description:
          "Notes and org maps are reusable across the team.",
      },
      {
        id: "honest-lists",
        title: "Honest list hygiene",
        description:
          "Dead ends are marked so capacity goes to fit accounts.",
      },
      {
        id: "pipeline-feed",
        title: "Cleaner pipeline feed",
        description:
          "Prospecting successes convert into leads/deals with context.",
      },
    ],
    capabilityNeeds: [
      {
        id: "accounts-contacts",
        title: "Accounts & contacts for targets",
        description: "Store companies and people you intend to pursue.",
        priority: "must",
        href: "/capabilities/contact-management/",
      },
      {
        id: "ownership",
        title: "List / territory ownership",
        description: "Prevent two reps working the same target silently.",
        priority: "must",
      },
      {
        id: "status-fields",
        title: "Prospecting status fields",
        description: "Researching, sequencing, waiting, disqualified, converted.",
        priority: "must",
      },
      {
        id: "notes",
        title: "Research notes & activity",
        description: "Capture why the account is a fit and what was tried.",
        priority: "must",
      },
      {
        id: "enrichment",
        title: "Enrichment / data imports",
        description: "Helpful once storage and ownership habits exist.",
        priority: "nice",
        href: "/categories/sales-intelligence/",
      },
      {
        id: "outreach-hooks",
        title: "Outreach / sequence hooks",
        description: "Move from research to email/call cadences cleanly.",
        priority: "nice",
        href: "/capabilities/email/",
      },
    ],
    workflowSteps: [
      {
        id: "define",
        label: "Define",
        detail: "Agree ICP and target account criteria before building lists.",
      },
      {
        id: "build",
        label: "Build",
        detail: "Create owned account/contact records for the target set.",
      },
      {
        id: "research",
        label: "Research",
        detail: "Capture roles, triggers, and fit notes on the record.",
      },
      {
        id: "outreach",
        label: "Outreach",
        detail: "Start cadences with status updates on every attempt.",
      },
      {
        id: "convert",
        label: "Convert",
        detail: "Promote engaged targets to leads/opportunities with context.",
      },
    ],
    priorities: [
      {
        id: "icp",
        title: "Clear ICP criteria",
        description: "Lists without fit rules become busywork.",
        icon: "target",
      },
      {
        id: "ownership",
        title: "Account ownership",
        description: "One owner per target prevents collision and rework.",
        icon: "users",
      },
      {
        id: "notes",
        title: "Shared research notes",
        description: "Make account intelligence reusable.",
        icon: "contact",
      },
      {
        id: "status",
        title: "Honest outreach status",
        description: "Know what was tried and what is next.",
        icon: "zap",
        href: "/use-cases/sales-engagement/",
      },
      {
        id: "convert-path",
        title: "Convert path into CRM pipeline",
        description: "Prospecting wins must become owned leads/deals.",
        icon: "funnel",
        href: "/use-cases/lead-management/",
      },
    ],
    scenarios: [
      {
        id: "named-accounts",
        title: "Named account outbound",
        bestWhen:
          "You work a finite target account list rather than pure inbound.",
        icon: "target",
      },
      {
        id: "sdr-pod",
        title: "SDR / BDR pods",
        bestWhen:
          "Multiple prospectors need shared ownership and research.",
        icon: "users",
      },
      {
        id: "founder-outbound",
        title: "Founder outbound",
        bestWhen:
          "You need a book of targets a future hire can inherit.",
        icon: "zap",
      },
    ],
    buyingFramework: [
      {
        step: 1,
        title: "Write ICP and target criteria",
        description:
          "Firmographics, triggers, and disqualify rules before tooling.",
      },
      {
        step: 2,
        title: "Decide where targets will live",
        description:
          "CRM accounts/contacts vs disposable sheets — prefer durable records.",
        href: "/guides/crm-vs-spreadsheet/",
        ctaLabel: "CRM vs spreadsheet →",
      },
      {
        step: 3,
        title: "Require ownership and status in demos",
        description:
          "Ask how collision and last-touch are prevented across reps.",
        href: "/guides/crm-demo-guide/",
        ctaLabel: "Demo guide →",
      },
      {
        step: 4,
        title: "Map convert paths",
        description:
          "How a warm prospect becomes a lead or opportunity with notes intact.",
        href: "/use-cases/lead-management/",
        ctaLabel: "Lead management →",
      },
      {
        step: 5,
        title: "Add complementary sales intelligence after CRM hygiene",
        description:
          "Once targets are owned records, shortlist contact-data and enrichment tools that sync into CRM — not replace it.",
        href: "/guides/how-to-choose-sales-intelligence/",
        ctaLabel: "Sales intelligence guide →",
      },
    ],
    heroVisual: {
      src: "/use-cases/prospecting-hero.png",
      alt: "Educational diagram of CRM prospecting: target accounts and contacts with ownership, research notes, and convert paths into leads.",
      caption:
        "Prospecting works when targets are owned records — not disposable spreadsheet rows.",
    },
    needsVisual: {
      src: "/use-cases/prospecting-needs.png",
      alt: "Diagram mapping prospecting pains — list sprawl, duplicate research, unmarked dead ends, weak handoffs — to CRM fixes.",
      caption:
        "What usually breaks in prospecting operations — and how CRM structure addresses it.",
    },
    workflowVisual: {
      src: "/use-cases/prospecting-workflow.png",
      alt: "Five-step prospecting workflow: define, build, research, outreach, convert.",
      caption:
        "A practical prospecting loop from ICP to owned pipeline intake.",
    },
    faq: [
      {
        question: "Does prospecting require a CRM?",
        answer:
          "You can start in a sheet, but shared ownership, research notes, and convert paths break quickly with more than one person. CRM becomes valuable when collision and lost context cost pipeline.",
      },
      {
        question: "How is prospecting different from lead management?",
        answer:
          "Prospecting builds and works the target list. Lead management tracks inquiries and qualified prospects through ownership and conversion — often the next step after outreach succeeds.",
      },
      {
        question: "Should we buy enrichment before CRM?",
        answer:
          "Usually no. Enrichment multiplies volume; without ownership and status, it multiplies mess. Store and act on targets first, then compare sales intelligence tools that write into those owned records.",
      },
      {
        question: "What fields matter on a target account?",
        answer:
          "Owner, fit rationale, key contacts/roles, outreach status, and next step. Add enrichment fields only if someone will maintain them.",
      },
    ],
    relatedUseCaseSlugs: [
      "email-outreach",
      "lead-management",
      "sales-engagement",
      "contact-management",
    ],
    featuredGuideHrefs: [
      "/guides/how-to-choose-crm/",
      "/guides/how-to-choose-sales-intelligence/",
      "/guides/crm-requirements-guide/",
      "/guides/do-i-need-a-crm/",
    ],
  },

  "relationship-management": {
    displayTitle: "CRM for Relationship Management",
    badgeLabel: "Relationships",
    tagline:
      "Keep ongoing client context, coverage, and next touches shared — beyond the first closed deal.",
    overview:
      "Relationship management is the CRM job of maintaining durable account and contact context over time. Teams use it for coverage, periodic check-ins, expansion awareness, and handoffs — so relationships do not go quiet when a single person is busy or leaves.",
    whoThisIsFor:
      "Account managers, client success partners, advisors, and BD teams whose value compounds through ongoing relationships. You need shared history and coverage plans more than a high-velocity transactional board.",
    whatMattersIntro:
      "Prioritize complete interaction history, account structure, ownership/coverage rules, and lightweight next-touch discipline. Heavy sales process configuration matters less than making relationship context easy to capture and find.",
    workedExample:
      "Worked example: an advisory practice. Before CRM, household notes lived in planner notebooks while colleagues covered blindly. After CRM, accounts hold roles, history, and next review dates — coverage starts from the record.",
    workedExampleSecondary:
      "Worked example: an agency with retainers. Before CRM, account context sat with the lead strategist. After CRM, every client account has stakeholders, recent touches, and renewal-oriented next steps visible to the pod.",
    glance: {
      primaryGoal: "Shared, ongoing context for every important relationship",
      typicalTeam: "Account, success, advisory, and relationship-led BD teams",
      commonPriorities: [
        "Interaction history",
        "Account & role maps",
        "Coverage ownership",
        "Next-touch cadence",
        "Quiet-account visibility",
      ],
    },
    challenges: [
      {
        id: "single-threaded",
        title: "Relationships are single-threaded",
        pain: "If one person is out, the account feels abandoned.",
        crmHelps:
          "Shared timelines and coverage owners make continuity possible.",
      },
      {
        id: "quiet-accounts",
        title: "Accounts go quiet unnoticed",
        pain: "Nobody sees which relationships have had no touch in months.",
        crmHelps:
          "Last-activity views and tasks surface coverage gaps.",
      },
      {
        id: "thin-history",
        title: "History is thin or private",
        pain: "Important commitments live in email and never become team knowledge.",
        crmHelps:
          "Email sync and notes attach commitments to the account timeline.",
      },
      {
        id: "expansion-blind",
        title: "Expansion signals are missed",
        pain: "Upsell or referral moments pass because context is fragmented.",
        crmHelps:
          "Account notes and related opportunities sit beside relationship history.",
      },
    ],
    outcomes: [
      {
        id: "continuity",
        title: "Continuity across coverage",
        description:
          "Clients are not restarting their story with every new teammate.",
      },
      {
        id: "coverage",
        title: "Visible coverage gaps",
        description:
          "Quiet accounts surface before they churn or cool off.",
      },
      {
        id: "shared-memory",
        title: "Shared relationship memory",
        description:
          "Commitments and preferences live on the account, not in one inbox.",
      },
      {
        id: "healthier-growth",
        title: "Healthier expansion conversations",
        description:
          "Next opportunities start from real history, not cold re-discovery.",
      },
    ],
    capabilityNeeds: [
      {
        id: "accounts-contacts",
        title: "Accounts, contacts & roles",
        description: "Map who matters and how they relate.",
        priority: "must",
        href: "/capabilities/contact-management/",
      },
      {
        id: "timeline",
        title: "Complete interaction history",
        description: "Emails, meetings, and notes on one timeline.",
        priority: "must",
      },
      {
        id: "email-sync",
        title: "Email / calendar sync",
        description: "Capture correspondence without heavy manual logging.",
        priority: "must",
      },
      {
        id: "tasks",
        title: "Next-touch tasks & reminders",
        description: "Periodic reviews and check-ins with owners.",
        priority: "must",
      },
      {
        id: "reporting",
        title: "Coverage / activity reporting",
        description: "See quiet accounts and activity distribution.",
        priority: "nice",
        href: "/capabilities/reporting/",
      },
      {
        id: "light-pipeline",
        title: "Opportunity tracking alongside relationships",
        description: "Capture expansion without losing account context.",
        priority: "nice",
        href: "/capabilities/pipeline-management/",
      },
    ],
    workflowSteps: [
      {
        id: "map",
        label: "Map",
        detail: "Ensure account, stakeholders, and roles are on the record.",
      },
      {
        id: "capture",
        label: "Capture",
        detail: "Log or sync every meaningful touch to the account timeline.",
      },
      {
        id: "plan",
        label: "Plan",
        detail: "Set the next review or check-in with a named owner.",
      },
      {
        id: "cover",
        label: "Cover",
        detail: "Use shared history when another teammate steps in.",
      },
      {
        id: "review",
        label: "Review",
        detail: "Weekly look at quiet accounts and missing next touches.",
      },
    ],
    priorities: [
      {
        id: "history",
        title: "Complete history",
        description: "Timelines beat memory for ongoing relationships.",
        icon: "mail",
      },
      {
        id: "coverage",
        title: "Coverage ownership",
        description: "Someone owns the next touch for every key account.",
        icon: "users",
      },
      {
        id: "cadence",
        title: "Light cadences",
        description: "Periodic reviews without turning relationships into spam.",
        icon: "zap",
      },
      {
        id: "account-map",
        title: "Account & role maps",
        description: "Know the buying and stakeholder landscape.",
        icon: "contact",
        href: "/use-cases/contact-management/",
      },
      {
        id: "quiet-signal",
        title: "Quiet-account signals",
        description: "Last-activity visibility prevents silent drift.",
        icon: "chart",
        href: "/use-cases/reporting/",
      },
    ],
    scenarios: [
      {
        id: "retainers",
        title: "Retainer / advisory relationships",
        bestWhen:
          "Value comes from ongoing service, not a one-time close.",
        icon: "handshake",
      },
      {
        id: "account-pods",
        title: "Account pods",
        bestWhen:
          "Multiple people touch the same clients and need shared context.",
        icon: "users",
      },
      {
        id: "post-sale",
        title: "Post-sale expansion",
        bestWhen:
          "Renewals and upsells depend on relationship history, not cold outreach.",
        icon: "funnel",
        href: "/use-cases/pipeline-management/",
      },
    ],
    buyingFramework: [
      {
        step: 1,
        title: "Name the relationship jobs",
        description:
          "Coverage, reviews, renewals, expansion — pick the primary 90-day job.",
      },
      {
        step: 2,
        title: "Require timeline + sync in shortlists",
        description:
          "If history is hard to capture, relationship CRM will not stick.",
        href: "/guides/crm-requirements-guide/",
        ctaLabel: "Requirements guide →",
      },
      {
        step: 3,
        title: "Define coverage rules",
        description:
          "Who owns next touch, and how quiet accounts are reviewed.",
      },
      {
        step: 4,
        title: "Trial with live accounts",
        description:
          "Import a slice of key relationships and run two weeks of real touches.",
        href: "/guides/crm-trial-evaluation/",
        ctaLabel: "Trial evaluation →",
      },
      {
        step: 5,
        title: "Connect light opportunity tracking later",
        description:
          "Add expansion pipelines only after timelines are trusted.",
        href: "/use-cases/pipeline-management/",
        ctaLabel: "Pipeline use case →",
      },
    ],
    heroVisual: {
      src: "/use-cases/relationship-management-hero.png",
      alt: "Educational diagram of CRM relationship management: shared account timelines, coverage owners, and next-touch cadences.",
      caption:
        "Relationship management keeps ongoing client context shared and actionable.",
    },
    needsVisual: {
      src: "/use-cases/relationship-management-needs.png",
      alt: "Diagram mapping relationship-management pains — single-threaded coverage, quiet accounts, thin history, missed expansion — to CRM fixes.",
      caption:
        "What usually breaks in ongoing relationship work — and how CRM addresses it.",
    },
    workflowVisual: {
      src: "/use-cases/relationship-management-workflow.png",
      alt: "Five-step relationship CRM workflow: map, capture, plan, cover, review.",
      caption:
        "A practical relationship loop focused on coverage and continuity.",
    },
    faq: [
      {
        question: "Do relationship-led teams need a sales pipeline CRM?",
        answer:
          "Often they need strong contact/account history first. Add pipelines when expansion or new-business stages need their own board — ideally on the same account records.",
      },
      {
        question: "How is this different from contact management?",
        answer:
          "Contact management is the data structure. Relationship management is the operating rhythm of coverage, cadences, and account health using that structure.",
      },
      {
        question: "What is a good first success metric?",
        answer:
          "Every key account has a named coverage owner and a dated next touch — and quiet accounts appear in a weekly review.",
      },
      {
        question: "Should we automate relationship check-ins?",
        answer:
          "Light reminders help after ownership is clear. Avoid spammy sequences that ignore account context; relationship quality beats cadence volume.",
      },
    ],
    relatedUseCaseSlugs: [
      "contact-management",
      "sales-engagement",
      "reporting",
      "pipeline-management",
    ],
    featuredGuideHrefs: [
      "/guides/what-is-crm/",
      "/guides/how-crm-works/",
      "/guides/how-to-choose-crm/",
      "/guides/crm-benefits/",
    ],
  },

  "sales-engagement": {
    displayTitle: "CRM for Sales Engagement",
    badgeLabel: "Engagement",
    tagline:
      "Coordinate calls, email, and messaging cadences around shared CRM records — not disconnected tools.",
    overview:
      "Sales engagement is the CRM-centered job of running multi-channel outreach cadences with visibility and ownership. Teams use it so SDRs and AEs execute sequenced touches while replies, outcomes, and next steps stay on the lead or contact record.",
    whoThisIsFor:
      "Outbound and blended sales teams that run structured cadences across email, phone, and other channels. You need engagement activity tied to CRM so managers can coach process, not just activity volume.",
    whatMattersIntro:
      "Prioritize CRM as the system of record, cadence ownership, multi-channel step visibility, and reply handling. A sequencing tool that does not update CRM recreates silos.",
    workedExample:
      "Worked example: an SDR team running 8-step cadences. Before CRM engagement discipline, email lived in one tool and calls in another while lead status lagged. After CRM-centered engagement, each step logs to the lead and replies pause the cadence automatically.",
    workedExampleSecondary:
      "Worked example: AEs working inbound and outbound together. Before CRM, call notes never reached the deal. After CRM, engagement activity sits on the opportunity timeline for coaching and coverage.",
    glance: {
      primaryGoal: "Multi-channel cadences with CRM-visible outcomes",
      typicalTeam: "SDR/BDR pods and outbound-heavy AE teams",
      commonPriorities: [
        "Cadence design",
        "Multi-channel steps",
        "CRM logging",
        "Reply / pause rules",
        "Coaching visibility",
      ],
    },
    challenges: [
      {
        id: "channel-silos",
        title: "Channels live in separate tools",
        pain: "Email, dialer, and CRM tell different stories about the same person.",
        crmHelps:
          "Engagement steps log to one contact/lead timeline managers can trust.",
      },
      {
        id: "zombie-cadences",
        title: "Cadences run after replies",
        pain: "Prospects get automated follow-ups after they already answered.",
        crmHelps:
          "Reply detection and pause rules keep sequences respectful.",
      },
      {
        id: "vanity-activity",
        title: "Activity metrics without outcomes",
        pain: "Teams optimize dials and sends while pipeline quality falls.",
        crmHelps:
          "Tie engagement to lead status and opportunity conversion, not vanity counts alone.",
      },
      {
        id: "weak-coaching",
        title: "Managers cannot coach the process",
        pain: "Without shared step history, coaching becomes anecdotal.",
        crmHelps:
          "Cadence adherence and outcomes are visible on the record.",
      },
    ],
    outcomes: [
      {
        id: "unified-touches",
        title: "Unified touch history",
        description:
          "Calls, emails, and messages appear on one timeline.",
      },
      {
        id: "respectful-cadences",
        title: "Respectful cadence control",
        description:
          "Replies and meetings pause sequences instead of spamming.",
      },
      {
        id: "coachable-process",
        title: "Coachable engagement process",
        description:
          "Managers see step completion and conversion, not just volume.",
      },
      {
        id: "cleaner-handoffs",
        title: "Cleaner handoffs",
        description:
          "AE and managers inherit full engagement context with the record.",
      },
    ],
    capabilityNeeds: [
      {
        id: "cadences",
        title: "Multi-step cadences",
        description: "Sequenced touches across channels with ownership.",
        priority: "must",
      },
      {
        id: "crm-logging",
        title: "Automatic CRM activity logging",
        description: "Every step writes to the lead/contact/deal.",
        priority: "must",
      },
      {
        id: "pause-rules",
        title: "Reply and meeting pause rules",
        description: "Stop or branch when humans respond.",
        priority: "must",
      },
      {
        id: "tasking",
        title: "Call / task queues",
        description: "Work the next best step without spreadsheet lists.",
        priority: "must",
      },
      {
        id: "templates",
        title: "Channel templates",
        description: "Shared email and call guidance for consistency.",
        priority: "nice",
        href: "/capabilities/email/",
      },
      {
        id: "analytics",
        title: "Cadence analytics",
        description: "Step conversion and reply rates for coaching.",
        priority: "nice",
        href: "/capabilities/reporting/",
      },
    ],
    workflowSteps: [
      {
        id: "enroll",
        label: "Enroll",
        detail: "Add owned leads/contacts to the right cadence.",
        goal: "Put the right people into an owned multi-step cadence without losing CRM ownership.",
        capabilities: [
          {
            id: "sales-engagement",
            label: "Sales engagement",
            href: "/capabilities/sales-engagement/",
          },
          {
            id: "lead-management",
            label: "Lead management",
            href: "/capabilities/lead-management/",
          },
        ],
        requirements: [
          {
            id: "cadence-enrollment",
            label: "Enroll owned leads/contacts into cadences",
            priority: "must",
          },
          {
            id: "preserve-ownership",
            label: "Keep owner visible on the cadence",
            priority: "must",
          },
        ],
        features: [
          { id: "email-sequences", label: "Email sequences / cadences" },
          { id: "lead-management", label: "Lead management" },
          { id: "contact-management", label: "Contact management" },
        ],
      },
      {
        id: "execute",
        label: "Execute",
        detail: "Work queued steps (email, call, other) with logging.",
        goal: "Complete the next touch from a queue while activity lands on the CRM record.",
        capabilities: [
          {
            id: "sales-engagement",
            label: "Sales engagement",
            href: "/capabilities/sales-engagement/",
          },
          {
            id: "email",
            label: "Email",
            href: "/capabilities/email/",
          },
        ],
        requirements: [
          {
            id: "queued-steps",
            label: "Work the next cadence step from a queue",
            priority: "must",
          },
          {
            id: "activity-logging",
            label: "Log email/call activity to the record",
            priority: "must",
          },
        ],
        features: [
          { id: "email-sequences", label: "Email sequences" },
          { id: "email-sync", label: "Email sync" },
          { id: "sales-automation", label: "Sales automation" },
        ],
      },
      {
        id: "respond",
        label: "Respond",
        detail: "Handle replies; pause or branch the cadence.",
        goal: "Stop or branch the cadence when a human replies so outreach stays respectful.",
        capabilities: [
          {
            id: "workflow-automation",
            label: "Workflow automation",
            href: "/capabilities/workflow-automation/",
          },
          {
            id: "email",
            label: "Email",
            href: "/capabilities/email/",
          },
        ],
        requirements: [
          {
            id: "reply-pause",
            label: "Pause or branch on replies",
            priority: "must",
          },
          {
            id: "reply-visibility",
            label: "Surface replies on the CRM timeline",
            priority: "must",
          },
        ],
        features: [
          { id: "email-sync", label: "Email sync" },
          { id: "email-sequences", label: "Email sequences" },
          { id: "workflow-automation", label: "Workflow automation" },
        ],
      },
      {
        id: "update",
        label: "Update",
        detail: "Refresh lead/deal status from engagement outcomes.",
        goal: "Convert engagement outcomes into accurate lead and deal status.",
        capabilities: [
          {
            id: "lead-management",
            label: "Lead management",
            href: "/capabilities/lead-management/",
          },
          {
            id: "pipeline-management",
            label: "Pipeline management",
            href: "/capabilities/pipeline-management/",
          },
        ],
        requirements: [
          {
            id: "status-from-engagement",
            label: "Update status from engagement outcomes",
            priority: "must",
          },
          {
            id: "deal-linkage",
            label: "Keep engagement tied to the opportunity",
            priority: "important",
          },
        ],
        features: [
          { id: "lead-management", label: "Lead management" },
          { id: "deal-management", label: "Deal management" },
          { id: "pipeline-management", label: "Pipeline management" },
        ],
      },
      {
        id: "coach",
        label: "Coach",
        detail: "Review cadence health and conversion in weekly 1:1s.",
        goal: "Coach step completion and conversion — not vanity dial/send counts alone.",
        capabilities: [
          {
            id: "reporting",
            label: "Reporting",
            href: "/capabilities/reporting/",
          },
          {
            id: "sales-engagement",
            label: "Sales engagement",
            href: "/capabilities/sales-engagement/",
          },
        ],
        requirements: [
          {
            id: "cadence-analytics",
            label: "Review cadence step health",
            priority: "important",
          },
          {
            id: "conversion-visibility",
            label: "Tie engagement to conversion outcomes",
            priority: "important",
          },
        ],
        features: [
          { id: "reporting", label: "Reporting" },
          { id: "sales-automation", label: "Sales automation" },
          { id: "email-sequences", label: "Email sequences" },
        ],
      },
    ],
    priorities: [
      {
        id: "crm-first",
        title: "CRM as system of record",
        description: "Engagement tools must write back — or do not buy them.",
        icon: "shield",
      },
      {
        id: "multi-channel",
        title: "Multi-channel steps",
        description: "Coordinate email and calls as one process.",
        icon: "zap",
      },
      {
        id: "pause",
        title: "Human-reply pauses",
        description: "Respect conversations over cadence completion.",
        icon: "mail",
      },
      {
        id: "outcomes",
        title: "Outcomes over vanity activity",
        description: "Measure meetings and conversions, not just sends.",
        icon: "chart",
        href: "/use-cases/reporting/",
      },
      {
        id: "ownership",
        title: "Clear enrollment ownership",
        description: "Know who enrolled whom and why.",
        icon: "users",
        href: "/use-cases/lead-management/",
      },
    ],
    scenarios: [
      {
        id: "sdr-cadence",
        title: "SDR cadence teams",
        bestWhen:
          "Multiple prospectors run structured multi-touch sequences daily.",
        icon: "zap",
        href: "/use-cases/prospecting/",
      },
      {
        id: "blended",
        title: "Blended inbound + outbound",
        bestWhen:
          "The same people work form fills and cold outreach with shared history.",
        icon: "funnel",
        href: "/use-cases/lead-management/",
      },
      {
        id: "remote-coaching",
        title: "Remote sales coaching",
        bestWhen:
          "Managers need process visibility without sitting next to reps.",
        icon: "chart",
      },
    ],
    buyingFramework: [
      {
        step: 1,
        title: "Map channels you actually use",
        description:
          "Email, phone, LinkedIn, etc. — buy for real steps, not imagined ones.",
      },
      {
        step: 2,
        title: "Require write-back to CRM",
        description:
          "Make logging non-negotiable in requirements and demos.",
        href: "/guides/crm-requirements-guide/",
        ctaLabel: "Requirements guide →",
      },
      {
        step: 3,
        title: "Design one pilot cadence",
        description:
          "8–12 steps max; define pause rules and success outcomes.",
      },
      {
        step: 4,
        title: "Compare complementary sales intelligence engagement tools",
        description:
          "If CRM-native cadences are not enough, shortlist SI engagement platforms that sync activity back — keep CRM as the system of record.",
        href: "/best/sales-intelligence-software/",
        ctaLabel: "Best sales intelligence →",
      },
      {
        step: 5,
        title: "Align coaching metrics",
        description:
          "Pick outcome metrics before scaling cadences across the team.",
        href: "/use-cases/reporting/",
        ctaLabel: "Reporting use case →",
      },
    ],
    heroVisual: {
      src: "/use-cases/sales-engagement-hero.png",
      alt: "Educational diagram of CRM sales engagement: multi-channel cadence steps logging to shared lead and contact records.",
      caption:
        "Sales engagement coordinates touches across channels without losing CRM truth.",
    },
    needsVisual: {
      src: "/use-cases/sales-engagement-needs.png",
      alt: "Diagram mapping sales-engagement pains — channel silos, zombie cadences, vanity activity, weak coaching — to CRM fixes.",
      caption:
        "What usually breaks in sales engagement programs — and how CRM-centered design addresses it.",
    },
    workflowVisual: {
      src: "/use-cases/sales-engagement-workflow.png",
      alt: "Five-step sales engagement workflow: enroll, execute, respond, update, coach.",
      caption:
        "A practical engagement loop from cadence enrollment to coaching.",
    },
    faq: [
      {
        question: "What is sales engagement vs email outreach?",
        answer:
          "Email outreach focuses on email as a channel. Sales engagement coordinates multi-channel cadences (email, call, and more) with shared process and CRM logging.",
      },
      {
        question: "Do we need a separate engagement platform?",
        answer:
          "Only if your CRM cannot support the cadence volume and channel mix you need. Evaluate CRM write-back first; disconnected engagement tools recreate silos. When you do need depth, treat sales intelligence engagement tools as complementary — not a second system of record.",
      },
      {
        question: "How do we avoid spammy cadences?",
        answer:
          "Use reply/meeting pauses, keep step counts reasonable, personalize with CRM context, and coach for relevance — not completion rate alone.",
      },
      {
        question: "What should managers review weekly?",
        answer:
          "Enrollment quality, pause-rule health, meetings booked, and conversion to qualified opportunities — not dials or sends in isolation.",
      },
    ],
    relatedUseCaseSlugs: [
      "email-outreach",
      "prospecting",
      "sales-automation",
      "lead-management",
    ],
    featuredGuideHrefs: [
      "/guides/how-to-choose-crm/",
      "/guides/how-to-choose-sales-intelligence/",
      "/guides/crm-requirements-guide/",
      "/guides/crm-evaluation-guide/",
    ],
  },

  reporting: {
    displayTitle: "CRM for Reporting",
    badgeLabel: "Reporting",
    tagline:
      "Build pipeline and activity reports managers can trust — without rebuilding the week in spreadsheets.",
    overview:
      "CRM reporting turns recorded stages, owners, and activities into views for coaching and planning. Teams use it for pipeline health, conversion, activity distribution, and forecast inputs — but report quality always follows data hygiene.",
    whoThisIsFor:
      "Sales managers, founders, and ops owners who need weekly truth about pipeline and activity. You are tired of status meetings that reconstruct numbers instead of deciding next actions.",
    whatMattersIntro:
      "Prioritize a small set of trusted metrics, consistent stage and amount fields, and adoption of logging. Fancy dashboards on dirty data create false confidence — fix inputs before expanding BI complexity.",
    workedExample:
      "Worked example: a sales manager running Friday forecasts. Before CRM reporting, each AE pasted numbers into a sheet with different stage meanings. After CRM, one pipeline report uses shared stages — the meeting starts from stuck deals and coverage gaps.",
    workedExampleSecondary:
      "Worked example: an SDR team measured only on dials. Before CRM, volume looked fine while qualified pipeline lagged. After CRM, reports connect activity to lead conversion so coaching targets outcomes.",
    glance: {
      primaryGoal: "Trusted views of pipeline health and team activity",
      typicalTeam: "Sales managers, founders, and sales ops",
      commonPriorities: [
        "Pipeline by stage",
        "Conversion rates",
        "Activity quality",
        "Forecast inputs",
        "Data hygiene",
      ],
    },
    challenges: [
      {
        id: "sheet-rebuilds",
        title: "Weekly spreadsheet rebuilds",
        pain: "Managers re-collect status instead of reviewing a trusted system.",
        crmHelps:
          "Shared stage and amount fields power repeatable pipeline views.",
      },
      {
        id: "dirty-inputs",
        title: "Reports on dirty inputs",
        pain: "Missing owners, fictional stages, and empty next steps make dashboards fiction.",
        crmHelps:
          "Reporting goals drive hygiene rules: required fields and review rituals.",
      },
      {
        id: "vanity-metrics",
        title: "Vanity activity metrics",
        pain: "Teams optimize dials and emails while pipeline quality falls.",
        crmHelps:
          "Pair activity with conversion and stage movement metrics.",
      },
      {
        id: "too-many-dashboards",
        title: "Dashboard sprawl",
        pain: "Nobody knows which report is canonical for decisions.",
        crmHelps:
          "Start with a short set of operating reports everyone uses weekly.",
      },
    ],
    outcomes: [
      {
        id: "trusted-pipeline",
        title: "A trusted pipeline view",
        description:
          "Reviews start from the same board and numbers every week.",
      },
      {
        id: "faster-decisions",
        title: "Faster coaching decisions",
        description:
          "Stuck stages and coverage gaps are visible without archaeology.",
      },
      {
        id: "outcome-focus",
        title: "Outcome-linked activity",
        description:
          "Teams connect effort to conversion, not vanity counts alone.",
      },
      {
        id: "less-manual-reporting",
        title: "Less manual reporting labor",
        description:
          "Managers stop rebuilding the week in spreadsheets.",
      },
    ],
    capabilityNeeds: [
      {
        id: "pipeline-reports",
        title: "Pipeline by stage / owner",
        description: "Core operating view for weekly reviews.",
        priority: "must",
        href: "/capabilities/pipeline-management/",
      },
      {
        id: "conversion",
        title: "Stage conversion reporting",
        description: "See where deals stall between stages.",
        priority: "must",
      },
      {
        id: "activity",
        title: "Activity reporting",
        description: "Touches tied to records — paired with outcomes.",
        priority: "must",
      },
      {
        id: "hygiene-fields",
        title: "Consistent required fields",
        description: "Stage, amount, close date, owner as report inputs.",
        priority: "must",
      },
      {
        id: "forecast",
        title: "Forecast / commit views",
        description: "Useful after stage honesty is real.",
        priority: "nice",
      },
      {
        id: "exports",
        title: "Exports / BI hooks",
        description: "Connect to deeper analysis only when needed.",
        priority: "nice",
      },
    ],
    workflowSteps: [
      {
        id: "define",
        label: "Define",
        detail: "Choose 3–5 operating metrics the team will actually use.",
      },
      {
        id: "standardize",
        label: "Standardize",
        detail: "Align stage meanings, required fields, and owners.",
      },
      {
        id: "hygiene",
        label: "Hygiene",
        detail: "Fix missing next steps and stale deals before report day.",
      },
      {
        id: "review",
        label: "Review",
        detail: "Run the weekly meeting from the CRM views, not a new sheet.",
      },
      {
        id: "act",
        label: "Act",
        detail: "Turn report findings into owned tasks and coaching notes.",
      },
    ],
    priorities: [
      {
        id: "inputs",
        title: "Clean inputs first",
        description: "Report quality cannot exceed logging quality.",
        icon: "shield",
        href: "/guides/crm-data-quality/",
      },
      {
        id: "pipeline-view",
        title: "One canonical pipeline view",
        description: "Everyone reviews the same stages and owners.",
        icon: "funnel",
        href: "/use-cases/pipeline-management/",
      },
      {
        id: "conversion",
        title: "Conversion over vanity",
        description: "Track stage movement and outcomes, not noise metrics.",
        icon: "chart",
      },
      {
        id: "ritual",
        title: "Weekly review ritual",
        description: "Reports only matter if decisions follow them.",
        icon: "users",
      },
      {
        id: "few-dashboards",
        title: "Few dashboards",
        description: "A short operating set beats dashboard sprawl.",
        icon: "zap",
      },
    ],
    scenarios: [
      {
        id: "weekly-forecast",
        title: "Weekly pipeline reviews",
        bestWhen:
          "Managers need shared stage truth without rebuilding sheets.",
        icon: "funnel",
        href: "/use-cases/pipeline-management/",
      },
      {
        id: "sdr-coaching",
        title: "SDR / AE coaching",
        bestWhen:
          "You must connect activity to conversion and meetings.",
        icon: "chart",
        href: "/use-cases/sales-engagement/",
      },
      {
        id: "leadership-snapshot",
        title: "Leadership snapshots",
        bestWhen:
          "Founders or execs need a short, honest pipeline read-out.",
        icon: "users",
      },
    ],
    buyingFramework: [
      {
        step: 1,
        title: "List decisions reports must support",
        description:
          "Coaching, forecast, coverage — write the questions first.",
      },
      {
        step: 2,
        title: "Audit field inputs",
        description:
          "Stage, amount, owner, close date — standardize meanings.",
        href: "/guides/crm-requirements-guide/",
        ctaLabel: "Requirements guide →",
      },
      {
        step: 3,
        title: "Require out-of-box pipeline views in demos",
        description:
          "Ask how non-admins build and share operating reports.",
        href: "/guides/crm-demo-guide/",
        ctaLabel: "Demo guide →",
      },
      {
        step: 4,
        title: "Trial with a real weekly review",
        description:
          "Run one Friday meeting from CRM only — note what breaks.",
        href: "/guides/crm-trial-evaluation/",
        ctaLabel: "Trial evaluation →",
      },
      {
        step: 5,
        title: "Add forecasting sophistication later",
        description:
          "Commit categories and BI exports wait until hygiene sticks.",
      },
    ],
    heroVisual: {
      src: "/use-cases/reporting-hero.png",
      alt: "Educational diagram of CRM reporting: pipeline stages, owners, and activity feeding trusted weekly review views.",
      caption:
        "CRM reporting turns shared process data into decisions — when inputs are honest.",
    },
    needsVisual: {
      src: "/use-cases/reporting-needs.png",
      alt: "Diagram mapping reporting pains — spreadsheet rebuilds, dirty inputs, vanity metrics, dashboard sprawl — to CRM fixes.",
      caption:
        "What usually breaks in CRM reporting — and how operating discipline addresses it.",
    },
    workflowVisual: {
      src: "/use-cases/reporting-workflow.png",
      alt: "Five-step CRM reporting workflow: define, standardize, hygiene, review, act.",
      caption:
        "A practical reporting loop that starts with metrics and ends in owned actions.",
    },
    faq: [
      {
        question: "Why do CRM reports feel wrong?",
        answer:
          "Usually because inputs are inconsistent: stages mean different things, owners are missing, or activity is not logged. Fix field discipline before blaming the charting tool.",
      },
      {
        question: "What reports should we start with?",
        answer:
          "Pipeline by stage/owner, deals with no next step, stage conversion, and a simple activity-to-outcome view. Expand only after those are trusted.",
      },
      {
        question: "Do we need a BI tool on day one?",
        answer:
          "Rarely. Native CRM views are enough for weekly operating reviews. Add BI when you have clean exports and questions native reports cannot answer.",
      },
      {
        question: "How does reporting relate to pipeline management?",
        answer:
          "Pipeline management creates the stage and ownership process. Reporting visualizes that process for coaching and planning — they succeed or fail together.",
      },
    ],
    relatedUseCaseSlugs: [
      "pipeline-management",
      "lead-management",
      "sales-engagement",
      "relationship-management",
    ],
    featuredGuideHrefs: [
      "/guides/how-to-choose-crm/",
      "/guides/crm-requirements-guide/",
      "/guides/crm-implementation-kpis/",
      "/guides/crm-data-quality/",
    ],
  },

  "account-management": {
    displayTitle: "CRM for Account Management",
    badgeLabel: "Accounts",
    tagline:
      "Own post-sale accounts with renewal, expansion, and health context — not a contact list that ends at close-won.",
    overview:
      "Account management is the CRM job of running named customer accounts after the initial sale: ownership, health signals, renewals, and expansion opportunities. It differs from broader relationship management by focusing on commercial account ownership — who owns the account, what is at risk, and what grows next — not only staying in touch.",
    whoThisIsFor:
      "Account managers, CSMs with commercial ownership, and sales leaders responsible for renewals and expansion. You close deals well but struggle when renewals, upsells, and stakeholder maps live in inboxes instead of on the account.",
    whatMattersIntro:
      "Prioritize account ownership, renewal dates, health or risk notes, and linked expansion opportunities. Contact history alone is not enough — you need a commercial picture of the account over time.",
    workedExample:
      "Worked example: a SaaS AM team with 40 named accounts. Before CRM, renewals surfaced when finance emailed an invoice date. After CRM, every account has an owner, renewal date, and open expansion opp — QBR prep starts from at-risk accounts, not from searching Slack.",
    workedExampleSecondary:
      "Worked example: a services firm handing closed deals to delivery. Before CRM, the AE’s notes never reached the AM. After CRM, the account record carries stakeholders, contract terms, and next commercial step so expansion does not restart from zero.",
    glance: {
      primaryGoal: "Named ownership of post-sale accounts with renewal and expansion visibility",
      typicalTeam: "Account managers, CSMs with commercial goals, sales leaders",
      commonPriorities: [
        "Named account owners",
        "Renewal dates",
        "Expansion opportunities",
        "Stakeholder maps",
        "Health / risk notes",
      ],
    },
    challenges: [
      {
        id: "close-and-forget",
        title: "Accounts disappear after close-won",
        pain: "Nobody owns the commercial relationship once delivery starts.",
        crmHelps:
          "Account records keep a named AM owner, renewal date, and next commercial step.",
      },
      {
        id: "renewal-surprises",
        title: "Renewals arrive as surprises",
        pain: "Teams scramble when contract end dates appear in finance systems first.",
        crmHelps:
          "Renewal fields and tasks on the account make upcoming renewals reviewable weekly.",
      },
      {
        id: "expansion-blind",
        title: "Expansion lives in tribal knowledge",
        pain: "Upsell ideas stay in one person’s head and vanish on vacation or turnover.",
        crmHelps:
          "Linked expansion opportunities and notes sit on the account for handoffs.",
      },
      {
        id: "stakeholder-drift",
        title: "Stakeholder maps go stale",
        pain: "Champions leave and the AM discovers it at renewal time.",
        crmHelps:
          "Contacts and roles on the account make coverage gaps visible before renewals.",
      },
    ],
    outcomes: [
      {
        id: "owned-accounts",
        title: "Every strategic account has an owner",
        description:
          "Coverage is visible — no orphan renewals waiting for someone to notice.",
      },
      {
        id: "renewal-rhythm",
        title: "Renewals managed on a calendar",
        description:
          "Upcoming renewals and risks surface in reviews, not in last-minute fire drills.",
      },
      {
        id: "expansion-pipeline",
        title: "Expansion treated as real pipeline",
        description:
          "Upsells and cross-sells become owned opportunities with stages and next steps.",
      },
      {
        id: "cleaner-handoffs",
        title: "Cleaner AE-to-AM handoffs",
        description:
          "Context travels with the account instead of living in the closer’s inbox.",
      },
    ],
    capabilityNeeds: [
      {
        id: "account-objects",
        title: "Account records with ownership",
        description: "Named owners and hierarchy for parent/child accounts where needed.",
        priority: "must",
      },
      {
        id: "renewal-fields",
        title: "Renewal / contract date fields",
        description: "Dates and status that power renewal reviews and tasks.",
        priority: "must",
      },
      {
        id: "linked-opps",
        title: "Opportunities linked to accounts",
        description: "Expansion and renewal deals sit on the same account context.",
        priority: "must",
        href: "/capabilities/pipeline-management/",
      },
      {
        id: "contacts-roles",
        title: "Contacts & roles on accounts",
        description: "Stakeholder map with roles for buying and renewal conversations.",
        priority: "must",
        href: "/capabilities/contact-management/",
      },
      {
        id: "health-notes",
        title: "Health / risk notes or scores",
        description: "Lightweight signals for at-risk accounts — after ownership is real.",
        priority: "nice",
      },
      {
        id: "account-reporting",
        title: "Account & renewal reporting",
        description: "Views of renewals by period, owner, and risk for leadership.",
        priority: "nice",
        href: "/capabilities/reporting/",
      },
    ],
    workflowSteps: [
      {
        id: "hand-off",
        label: "Hand off",
        detail: "Won deal creates or updates the account with AM owner and key context.",
      },
      {
        id: "map",
        label: "Map",
        detail: "Confirm stakeholders, roles, renewal date, and success criteria on the account.",
      },
      {
        id: "engage",
        label: "Engage",
        detail: "Log QBR notes, health signals, and customer-follow-up tasks on the record.",
      },
      {
        id: "expand",
        label: "Expand or renew",
        detail: "Open renewal/expansion opportunities linked to the account with stages.",
      },
      {
        id: "review",
        label: "Review",
        detail: "Weekly account review: at-risk renewals, missing owners, stale stakeholders.",
      },
    ],
    priorities: [
      {
        id: "ownership",
        title: "Named account ownership",
        description: "Every strategic account has a clear commercial owner.",
        icon: "users",
      },
      {
        id: "renewals",
        title: "Renewal date discipline",
        description: "Contract end dates live on the account, not only in finance.",
        icon: "target",
      },
      {
        id: "expansion-ops",
        title: "Expansion as pipeline",
        description: "Upsells get stages and next steps like new business.",
        icon: "funnel",
        href: "/use-cases/pipeline-management/",
      },
      {
        id: "stakeholder-map",
        title: "Living stakeholder maps",
        description: "Roles and contacts stay current before renewal season.",
        icon: "users",
        href: "/use-cases/relationship-management/",
      },
      {
        id: "hygiene",
        title: "Account hygiene rituals",
        description: "Short weekly reviews beat annual account archaeology.",
        icon: "shield",
        href: "/guides/crm-data-quality/",
      },
    ],
    scenarios: [
      {
        id: "named-am",
        title: "Named account managers",
        bestWhen:
          "AMs own renewals and expansion across a book of accounts.",
        icon: "users",
      },
      {
        id: "ae-to-am",
        title: "AE-to-AM handoffs",
        bestWhen:
          "Closed deals must transfer context without losing stakeholders or terms.",
        icon: "funnel",
        href: "/use-cases/relationship-management/",
      },
      {
        id: "renewal-pressure",
        title: "Renewal-heavy revenue",
        bestWhen:
          "A large share of revenue depends on renewals and expansion, not only new logos.",
        icon: "chart",
        href: "/use-cases/sales-forecasting/",
      },
    ],
    buyingFramework: [
      {
        step: 1,
        title: "Define account vs opportunity jobs",
        description:
          "Separate post-sale ownership from new-business pipeline stages before demos.",
      },
      {
        step: 2,
        title: "List must-have account fields",
        description:
          "Owner, renewal date, key contacts, health notes, linked opportunities.",
        href: "/guides/crm-requirements-guide/",
        ctaLabel: "Requirements guide →",
      },
      {
        step: 3,
        title: "Trial with a live book of accounts",
        description:
          "Import a slice of renewals and run one AM review from CRM only.",
        href: "/guides/crm-trial-evaluation/",
        ctaLabel: "Trial evaluation →",
      },
      {
        step: 4,
        title: "Check handoff from close-won",
        description:
          "Confirm won deals create usable account context for AMs — not empty shells.",
      },
      {
        step: 5,
        title: "Name an account data owner",
        description:
          "Someone owns fields, renewal hygiene, and review cadence — or books decay.",
      },
    ],
    heroVisual: {
      src: "/use-cases/account-management-hero.png",
      alt: "Educational diagram of CRM account management: named accounts with owners, renewals, stakeholders, and expansion opportunities.",
      caption:
        "Account management keeps post-sale commercial ownership visible after close-won.",
    },
    needsVisual: {
      src: "/use-cases/account-management-needs.png",
      alt: "Diagram mapping account pains — close-and-forget, renewal surprises, expansion blind spots, stale stakeholders — to CRM fixes.",
      caption:
        "What usually breaks in account work — and how CRM account design addresses it.",
    },
    workflowVisual: {
      src: "/use-cases/account-management-workflow.png",
      alt: "Five-step account CRM workflow: hand off, map, engage, expand or renew, review.",
      caption:
        "A practical account loop from AE handoff through renewal and expansion reviews.",
    },
    faq: [
      {
        question: "How is account management different from relationship management?",
        answer:
          "Relationship management is the broader practice of staying connected across contacts and history. Account management is specifically post-sale commercial ownership: renewals, expansion, health, and who owns the customer account.",
      },
      {
        question: "Do we need a separate customer success tool?",
        answer:
          "Not necessarily on day one. Many teams start with account ownership, renewal dates, and linked opportunities in CRM. Add specialized CS tooling when health scoring and product usage workflows outgrow that model.",
      },
      {
        question: "Should renewals be opportunities or account fields?",
        answer:
          "Usually both: a renewal date on the account for calendar visibility, plus a renewal opportunity when active selling work starts — so stages and next steps stay clear.",
      },
      {
        question: "When should expansion enter the pipeline?",
        answer:
          "When there is a real next commercial conversation with an owner and date — not every vague upsell idea. Keep noise off the board; keep intent on the account as notes until it qualifies.",
      },
    ],
    relatedUseCaseSlugs: [
      "relationship-management",
      "customer-follow-up",
      "pipeline-management",
      "sales-forecasting",
      "contact-management",
    ],
    featuredGuideHrefs: [
      "/guides/how-to-choose-crm/",
      "/guides/crm-requirements-guide/",
      "/guides/crm-governance/",
      "/guides/crm-adoption/",
    ],
  },

  "outbound-sales": {
    displayTitle: "CRM for Outbound Sales",
    badgeLabel: "Outbound",
    tagline:
      "Run proactive prospecting and sequences from shared records — so outbound effort compounds instead of resetting in personal lists.",
    overview:
      "Outbound sales is the CRM job of managing proactive outreach: target accounts, sequences, ownership, and conversion into meetings and pipeline. It differs from prospecting (finding and prioritizing who to contact) by covering the full sell motion after targets are chosen — and from inbound sales by starting with seller-initiated outreach rather than responding to inbound interest.",
    whoThisIsFor:
      "SDR/BDR teams, AEs who run outbound, and sales managers who need visibility into sequences and meetings booked. You lose momentum when cadences live in personal tools and nobody sees who owns which account.",
    whatMattersIntro:
      "Prioritize account/lead ownership, sequence or task visibility, and clean conversion into opportunities. Volume tools help after ownership and logging habits prevent double-touching and ghost lists.",
    workedExample:
      "Worked example: an SDR pod working a target account list. Before CRM, each rep kept prospects in a personal sheet and sequences in a separate sequencer. After CRM, every target has an owner, last touch, and next step — standups start from stalled sequences, not from “who’s working Acme?”",
    workedExampleSecondary:
      "Worked example: AEs expected to self-source. Before CRM, outbound activity vanished into inboxes. After CRM, outbound tasks and meetings attach to records so managers can coach conversion, not just dial volume.",
    glance: {
      primaryGoal: "Owned outbound motion from target list to meeting and opportunity",
      typicalTeam: "SDR/BDR teams, outbound AEs, sales managers",
      commonPriorities: [
        "Target account ownership",
        "Sequence / task visibility",
        "No double-touching",
        "Meeting-to-pipeline conversion",
        "Activity tied to outcomes",
      ],
    },
    challenges: [
      {
        id: "personal-lists",
        title: "Outbound lives in personal lists",
        pain: "Managers cannot see coverage, and reps rework the same accounts.",
        crmHelps:
          "Shared lead/account ownership and status replace conflicting personal sheets.",
      },
      {
        id: "sequence-blind",
        title: "Sequences invisible to the team",
        pain: "Cadences run in siloed tools with no record of last touch on the CRM record.",
        crmHelps:
          "Tasks and activity on the contact/account make outbound progress reviewable.",
      },
      {
        id: "volume-without-pipeline",
        title: "Volume without pipeline",
        pain: "Teams celebrate dials while meetings and opportunities lag.",
        crmHelps:
          "Reports connect outbound activity to meetings and stage entry.",
      },
      {
        id: "handoff-drop",
        title: "SDR-to-AE handoffs drop context",
        pain: "Meeting notes and prior touches never reach the AE who takes discovery.",
        crmHelps:
          "History travels with the record into the opportunity created from outbound.",
      },
    ],
    outcomes: [
      {
        id: "owned-targets",
        title: "Clear ownership of target accounts",
        description:
          "Coverage is visible and double-touching drops.",
      },
      {
        id: "reviewable-cadences",
        title: "Reviewable outbound cadences",
        description:
          "Managers coach stalled sequences from shared next steps, not guesswork.",
      },
      {
        id: "outcome-linked",
        title: "Activity linked to meetings and pipeline",
        description:
          "Coaching shifts from vanity volume to conversion.",
      },
      {
        id: "cleaner-handoffs",
        title: "Cleaner SDR-to-AE handoffs",
        description:
          "Prior touches and notes sit on the record when opportunities open.",
      },
    ],
    capabilityNeeds: [
      {
        id: "lead-account-ownership",
        title: "Lead / account ownership",
        description: "Named owners for outbound targets with status fields.",
        priority: "must",
        href: "/capabilities/lead-management/",
      },
      {
        id: "tasks-sequences",
        title: "Tasks or sequence steps on records",
        description: "Next outbound actions visible on contacts and accounts.",
        priority: "must",
        href: "/capabilities/sales-engagement/",
      },
      {
        id: "activity-logging",
        title: "Activity logging",
        description: "Calls, emails, and meetings attach to the prospect record.",
        priority: "must",
        href: "/capabilities/email/",
      },
      {
        id: "convert-to-opp",
        title: "Convert to opportunity",
        description: "Clean path from qualified outbound interest into pipeline.",
        priority: "must",
        href: "/capabilities/pipeline-management/",
      },
      {
        id: "sequencer-sync",
        title: "Sequencer / engagement sync",
        description: "Useful after CRM ownership is trusted — avoid dual systems of truth.",
        priority: "nice",
        href: "/capabilities/sales-engagement/",
      },
      {
        id: "outbound-reporting",
        title: "Outbound conversion reporting",
        description: "Meetings and opportunities from outbound activity by owner.",
        priority: "nice",
        href: "/capabilities/reporting/",
      },
    ],
    workflowSteps: [
      {
        id: "target",
        label: "Target",
        detail: "Select accounts/leads and assign a named outbound owner.",
      },
      {
        id: "sequence",
        label: "Sequence",
        detail: "Run cadence steps with tasks and logged touches on the record.",
      },
      {
        id: "qualify",
        label: "Qualify",
        detail: "Capture interest, disqualify politely, or book a meeting with context.",
      },
      {
        id: "convert",
        label: "Convert",
        detail: "Create an opportunity with history intact for the AE or closer.",
      },
      {
        id: "review",
        label: "Review",
        detail: "Weekly: stalled sequences, uncovered targets, conversion quality.",
      },
    ],
    priorities: [
      {
        id: "ownership",
        title: "Mandatory target ownership",
        description: "No orphan accounts on the outbound list.",
        icon: "users",
      },
      {
        id: "next-touch",
        title: "Visible next touch",
        description: "Every active prospect has a dated next outbound step.",
        icon: "zap",
        href: "/use-cases/customer-follow-up/",
      },
      {
        id: "conversion",
        title: "Conversion over volume",
        description: "Measure meetings and pipeline, not dials alone.",
        icon: "chart",
        href: "/use-cases/reporting/",
      },
      {
        id: "handoff",
        title: "Handoff with history",
        description: "SDR context must survive opportunity creation.",
        icon: "funnel",
        href: "/use-cases/pipeline-management/",
      },
      {
        id: "one-system",
        title: "One system of record",
        description: "Sequencers support CRM — they should not replace ownership.",
        icon: "shield",
        href: "/guides/crm-adoption/",
      },
    ],
    scenarios: [
      {
        id: "sdr-pod",
        title: "SDR / BDR pods",
        bestWhen:
          "Multiple outbound reps share a territory or account list and need coverage rules.",
        icon: "users",
        href: "/use-cases/prospecting/",
      },
      {
        id: "ae-self-source",
        title: "AE self-sourcing",
        bestWhen:
          "AEs must generate pipeline with visible outbound discipline.",
        icon: "target",
      },
      {
        id: "leaving-sheets",
        title: "Leaving personal prospect sheets",
        bestWhen:
          "Outbound lists disagree and managers cannot see who owns which target.",
        icon: "funnel",
        href: "/guides/crm-vs-spreadsheet/",
      },
    ],
    buyingFramework: [
      {
        step: 1,
        title: "Map outbound stages to CRM statuses",
        description:
          "Working, meeting booked, qualified, disqualified — before tool demos.",
      },
      {
        step: 2,
        title: "Define ownership and territory rules",
        description:
          "Who can touch which accounts, and how handoffs to AEs work.",
        href: "/guides/crm-requirements-guide/",
        ctaLabel: "Requirements guide →",
      },
      {
        step: 3,
        title: "Trial with a live sequence week",
        description:
          "Run one real cadence from CRM-visible tasks and review conversion.",
        href: "/guides/crm-trial-evaluation/",
        ctaLabel: "Trial evaluation →",
      },
      {
        step: 4,
        title: "Decide sequencer / dialer integration later",
        description:
          "Prove ownership and logging first; then compare complementary sales intelligence engagement tools that sync into CRM.",
        href: "/best/sales-intelligence-software/",
        ctaLabel: "Best sales intelligence →",
      },
      {
        step: 5,
        title: "Name an outbound process owner",
        description:
          "Someone owns statuses, fields, and weekly coverage reviews.",
      },
    ],
    heroVisual: {
      src: "/use-cases/outbound-sales-hero.png",
      alt: "Educational diagram of CRM outbound sales: owned targets, cadence steps, meetings booked, and conversion into pipeline.",
      caption:
        "Outbound sales CRM keeps proactive outreach owned, sequenced, and convertible.",
    },
    needsVisual: {
      src: "/use-cases/outbound-sales-needs.png",
      alt: "Diagram mapping outbound pains — personal lists, invisible sequences, volume without pipeline, handoff drop — to CRM fixes.",
      caption:
        "What usually breaks in outbound — and how CRM process design addresses it.",
    },
    workflowVisual: {
      src: "/use-cases/outbound-sales-workflow.png",
      alt: "Five-step outbound CRM workflow: target, sequence, qualify, convert, review.",
      caption:
        "A practical outbound loop from target assignment through pipeline entry.",
    },
    faq: [
      {
        question: "How is outbound sales different from prospecting?",
        answer:
          "Prospecting focuses on finding and prioritizing who to contact. Outbound sales covers the full proactive motion after targets are chosen: ownership, sequences, meetings, and conversion into opportunities.",
      },
      {
        question: "How is outbound different from inbound sales?",
        answer:
          "Outbound starts with seller-initiated outreach to targets. Inbound sales responds to people who already raised their hand via forms, demos, or content — speed-to-lead and routing matter more than cold cadence design.",
      },
      {
        question: "Do we need a sequencer on day one?",
        answer:
          "Not if ownership and next-step logging are still weak. Start with CRM tasks and activity on records; add sequencers when the team will keep CRM as the system of record.",
      },
      {
        question: "What should managers review weekly?",
        answer:
          "Uncovered targets, stalled sequences (no next date), meeting conversion, and opportunity creation quality — not dial counts alone.",
      },
    ],
    relatedUseCaseSlugs: [
      "prospecting",
      "email-outreach",
      "sales-engagement",
      "inbound-sales",
      "lead-management",
      "pipeline-management",
    ],
    featuredGuideHrefs: [
      "/guides/how-to-choose-crm/",
      "/guides/how-to-choose-sales-intelligence/",
      "/guides/crm-requirements-guide/",
      "/guides/common-crm-mistakes/",
    ],
  },

  "inbound-sales": {
    displayTitle: "CRM for Inbound Sales",
    badgeLabel: "Inbound",
    tagline:
      "Respond fast, route fairly, and convert demo requests into owned pipeline — before warm interest cools in a shared inbox.",
    overview:
      "Inbound sales is the CRM job of handling buyer-initiated interest: capture, speed-to-lead, routing, qualification, and conversion into opportunities. It differs from outbound (seller-initiated) and from general lead management by focusing on the inbound response motion — SLAs, source context, and fair distribution of high-intent requests.",
    whoThisIsFor:
      "Inbound SDRs, AE pods taking demos, marketing ops partners, and sales managers measured on response time. You lose deals when form fills sit in email or get claimed chaotically in Slack.",
    whatMattersIntro:
      "Prioritize capture reliability, ownership within minutes, qualification criteria, and conversion into pipeline. Lead scoring helps after routing and SLA habits are dependable.",
    workedExample:
      "Worked example: a product team with “Book a demo” forms. Before CRM, requests hit a shared inbox and response times varied by who checked email. After CRM, every inbound lead is owned within minutes with source and UTM context — Monday reviews start from SLA misses, not from hunting threads.",
    workedExampleSecondary:
      "Worked example: marketing running webinars and content offers. Before CRM, MQLs dumped into a sheet with no clear sales owner. After CRM, routing rules assign owners and status so inbound handoffs are auditable.",
    glance: {
      primaryGoal: "Fast, owned response to inbound interest with clean pipeline conversion",
      typicalTeam: "Inbound SDRs, demo-taking AEs, marketing ops, sales managers",
      commonPriorities: [
        "Speed-to-lead",
        "Fair routing",
        "Source context",
        "Qualify or disqualify",
        "Convert to opportunity",
      ],
    },
    challenges: [
      {
        id: "inbox-sla",
        title: "Inbound dies in shared inboxes",
        pain: "High-intent requests wait hours or days without a named owner.",
        crmHelps:
          "Automatic capture and assignment create owned leads with visible response SLAs.",
      },
      {
        id: "routing-chaos",
        title: "Routing is chaotic or unfair",
        pain: "Reps cherry-pick easy leads; territories and skills are ignored.",
        crmHelps:
          "Routing rules by territory, product, or round-robin make distribution reviewable.",
      },
      {
        id: "context-loss",
        title: "Source context never reaches sales",
        pain: "AEs take demos without knowing campaign, page, or prior touches.",
        crmHelps:
          "Source and activity fields travel with the lead into the opportunity.",
      },
      {
        id: "no-disqualify-path",
        title: "No clear qualify / disqualify path",
        pain: "Junk and fit leads clog the same queue as high intent.",
        crmHelps:
          "Status fields and reasons keep the inbound queue honest and coachable.",
      },
    ],
    outcomes: [
      {
        id: "faster-response",
        title: "Faster, owned first response",
        description:
          "Warm interest gets a named owner within an agreed SLA.",
      },
      {
        id: "fair-distribution",
        title: "Fairer lead distribution",
        description:
          "Routing rules replace Slack claiming and cherry-picking.",
      },
      {
        id: "context-rich-demos",
        title: "Context-rich demos",
        description:
          "AEs inherit source and prior touches instead of starting cold.",
      },
      {
        id: "cleaner-pipeline-entry",
        title: "Cleaner pipeline entry",
        description:
          "Only qualified inbound becomes opportunities with retained history.",
      },
    ],
    capabilityNeeds: [
      {
        id: "capture",
        title: "Form / source capture",
        description: "Inbound requests create CRM leads with source fields intact.",
        priority: "must",
        href: "/capabilities/lead-management/",
      },
      {
        id: "routing",
        title: "Assignment / routing rules",
        description: "Territory, round-robin, or skill-based ownership within minutes.",
        priority: "must",
        href: "/use-cases/high-volume-lead-management/",
      },
      {
        id: "sla-visibility",
        title: "SLA / first-response visibility",
        description: "Managers see unworked inbound and aging leads.",
        priority: "must",
      },
      {
        id: "convert",
        title: "Qualify and convert to opportunity",
        description: "Clear path from inbound status into owned pipeline stages.",
        priority: "must",
        href: "/capabilities/pipeline-management/",
      },
      {
        id: "scoring",
        title: "Lead scoring",
        description: "Helpful after routing and response habits are reliable.",
        priority: "nice",
      },
      {
        id: "marketing-sync",
        title: "Marketing automation sync",
        description: "Useful when campaigns already run elsewhere — keep CRM as sales truth.",
        priority: "nice",
      },
    ],
    workflowSteps: [
      {
        id: "capture",
        label: "Capture",
        detail: "Inbound form, chat, or hand-raise creates a lead with source context.",
      },
      {
        id: "route",
        label: "Route",
        detail: "Assign a named owner by rule within the response SLA window.",
      },
      {
        id: "respond",
        label: "Respond",
        detail: "First touch logged; schedule demo or gather qualification answers.",
      },
      {
        id: "qualify",
        label: "Qualify",
        detail: "Advance, nurture, or disqualify with a reason — no silent rotting leads.",
      },
      {
        id: "convert",
        label: "Convert",
        detail: "Create an opportunity with history; review SLA and conversion weekly.",
      },
    ],
    priorities: [
      {
        id: "speed",
        title: "Speed-to-lead",
        description: "Minutes matter more than perfect scoring on day one.",
        icon: "zap",
      },
      {
        id: "routing",
        title: "Clear routing rules",
        description: "Fair ownership beats chaotic claiming.",
        icon: "users",
        href: "/use-cases/high-volume-lead-management/",
      },
      {
        id: "source",
        title: "Preserve source context",
        description: "Campaign and page data must reach the person taking the demo.",
        icon: "mail",
      },
      {
        id: "qualify-path",
        title: "Honest qualify / disqualify",
        description: "Statuses keep the inbound queue coachable.",
        icon: "funnel",
        href: "/use-cases/lead-management/",
      },
      {
        id: "sla-review",
        title: "Weekly SLA reviews",
        description: "Unworked inbound is a process failure, not a mystery.",
        icon: "chart",
        href: "/use-cases/reporting/",
      },
    ],
    scenarios: [
      {
        id: "demo-requests",
        title: "Demo and contact forms",
        bestWhen:
          "High-intent web forms need owned response within a tight SLA.",
        icon: "zap",
      },
      {
        id: "mql-handoff",
        title: "Marketing-to-sales handoffs",
        bestWhen:
          "MQLs need auditable ownership instead of spreadsheet dumps.",
        icon: "users",
        href: "/use-cases/lead-management/",
      },
      {
        id: "mixed-motion",
        title: "Mixed inbound and outbound teams",
        bestWhen:
          "You must keep inbound SLAs distinct from outbound cadence work.",
        icon: "funnel",
        href: "/use-cases/outbound-sales/",
      },
    ],
    buyingFramework: [
      {
        step: 1,
        title: "Write your inbound SLA and statuses",
        description:
          "First response time, qualify criteria, and disqualify reasons — on paper first.",
      },
      {
        step: 2,
        title: "Map capture sources into required fields",
        description:
          "Forms, chat, webinars — what must land on the lead record.",
        href: "/guides/crm-requirements-guide/",
        ctaLabel: "Requirements guide →",
      },
      {
        step: 3,
        title: "Demo routing and assignment",
        description:
          "Ask how non-admins change round-robin or territory rules safely.",
        href: "/guides/crm-demo-guide/",
        ctaLabel: "Demo guide →",
      },
      {
        step: 4,
        title: "Trial with live inbound for one week",
        description:
          "Measure SLA, ownership, and conversion — not just form integration.",
        href: "/guides/crm-trial-evaluation/",
        ctaLabel: "Trial evaluation →",
      },
      {
        step: 5,
        title: "Add scoring after SLA is real",
        description:
          "Scoring amplifies good routing; it does not fix unworked leads.",
      },
    ],
    heroVisual: {
      src: "/use-cases/inbound-sales-hero.png",
      alt: "Educational diagram of CRM inbound sales: capture, route, respond within SLA, qualify, and convert to pipeline.",
      caption:
        "Inbound sales CRM turns hand-raises into owned, fast, convertible work.",
    },
    needsVisual: {
      src: "/use-cases/inbound-sales-needs.png",
      alt: "Diagram mapping inbound pains — shared inbox SLA failures, routing chaos, context loss, no disqualify path — to CRM fixes.",
      caption:
        "What usually breaks in inbound sales — and how CRM routing and capture address it.",
    },
    workflowVisual: {
      src: "/use-cases/inbound-sales-workflow.png",
      alt: "Five-step inbound CRM workflow: capture, route, respond, qualify, convert.",
      caption:
        "A practical inbound loop from form fill through opportunity creation.",
    },
    faq: [
      {
        question: "How is inbound sales different from lead management?",
        answer:
          "Lead management is the broader capture-and-qualify discipline across sources. Inbound sales focuses on the buyer-initiated response motion: speed-to-lead, routing fairness, and converting high-intent requests into pipeline.",
      },
      {
        question: "How is inbound different from outbound?",
        answer:
          "Inbound responds to people who already expressed interest. Outbound initiates contact with targets who have not raised their hand. Priorities differ: SLA and routing versus cadence and coverage.",
      },
      {
        question: "What SLA should we start with?",
        answer:
          "Pick a response window you can actually keep — often under an hour for demo requests during business hours — then measure misses weekly before tightening.",
      },
      {
        question: "Should marketing and sales share one lead object?",
        answer:
          "Usually yes for mid-market teams: one record with clear ownership and status beats dual databases. Separate marketing engagement tools can sync, but sales ownership should be unambiguous.",
      },
    ],
    relatedUseCaseSlugs: [
      "lead-management",
      "high-volume-lead-management",
      "outbound-sales",
      "pipeline-management",
      "sales-automation",
    ],
    featuredGuideHrefs: [
      "/guides/how-to-choose-crm/",
      "/guides/crm-requirements-guide/",
      "/guides/common-crm-mistakes/",
      "/guides/crm-roi-guide/",
    ],
  },

  "field-sales": {
    displayTitle: "CRM for Field Sales",
    badgeLabel: "Field",
    tagline:
      "Keep territory visits, on-site notes, and next steps on the record — so field work survives beyond the car and the notebook.",
    overview:
      "Field sales is the CRM job of supporting territory and on-site selling: account visits, route context, offline-friendly capture, and follow-up after face-to-face meetings. It differs from desk-based outbound or inbound by centering physical coverage — who visited whom, what was promised on-site, and what happens next when the rep is back on the road.",
    whoThisIsFor:
      "Field AEs, territory managers, and leaders of hybrid inside/field teams. You lose deals when visit notes stay in notebooks and territory coverage is tribal knowledge.",
    whatMattersIntro:
      "Prioritize mobile capture, account visit history, territory ownership, and next-step tasks after meetings. Fancy mapping helps after reps actually log visits and outcomes on the account.",
    workedExample:
      "Worked example: a regional equipment sales team. Before CRM, visit notes lived in notebooks and managers reconstructed coverage from expense reports. After CRM, each visit logs against the account with outcome and next date — Monday reviews start from overdue follow-ups, not from “how was the trip?”",
    workedExampleSecondary:
      "Worked example: a hybrid team with inside SDRs and field AEs. Before CRM, field promises never reached inside follow-up. After CRM, on-site notes and tasks hand off cleanly so the next call continues the conversation.",
    glance: {
      primaryGoal: "Territory and visit visibility with reliable post-visit follow-up",
      typicalTeam: "Field AEs, territory managers, hybrid inside/field pods",
      commonPriorities: [
        "Territory ownership",
        "Visit logging",
        "Mobile capture",
        "Post-visit next steps",
        "Coverage reviews",
      ],
    },
    challenges: [
      {
        id: "notebook-crm",
        title: "The notebook is the CRM",
        pain: "Visit outcomes never reach managers or covering reps.",
        crmHelps:
          "Mobile-friendly activity on accounts captures visits before memory fades.",
      },
      {
        id: "territory-fog",
        title: "Territory coverage is opaque",
        pain: "Leaders cannot see which accounts were visited or neglected.",
        crmHelps:
          "Territory ownership and visit history make coverage reviewable.",
      },
      {
        id: "follow-up-gap",
        title: "On-site promises lack follow-up",
        pain: "Quotes and next meetings die between the driveway and the desk.",
        crmHelps:
          "Required next-step tasks after visits keep field work connected to pipeline.",
      },
      {
        id: "handoff-gap",
        title: "Inside and field handoffs break",
        pain: "Inside teams re-ask questions the field already answered on-site.",
        crmHelps:
          "Shared account history connects field visits with inside outreach.",
      },
    ],
    outcomes: [
      {
        id: "visit-history",
        title: "Visit history on every key account",
        description:
          "Coverage and last-visit context survive vacations and turnover.",
      },
      {
        id: "faster-follow-up",
        title: "Faster post-visit follow-up",
        description:
          "Promises from the field become dated tasks on the record.",
      },
      {
        id: "territory-visibility",
        title: "Territory visibility for managers",
        description:
          "Reviews focus on neglected accounts and overdue visits.",
      },
      {
        id: "hybrid-continuity",
        title: "Hybrid inside/field continuity",
        description:
          "On-site context feeds the next inside call or quote.",
      },
    ],
    capabilityNeeds: [
      {
        id: "mobile-logging",
        title: "Mobile-friendly activity logging",
        description: "Capture visits and notes quickly from the field.",
        priority: "must",
      },
      {
        id: "account-visit-history",
        title: "Account visit / activity history",
        description: "Last visit, outcome, and attendees on the account.",
        priority: "must",
        href: "/use-cases/account-management/",
      },
      {
        id: "territory-ownership",
        title: "Territory / account ownership",
        description: "Clear ownership of who covers which geography or book.",
        priority: "must",
      },
      {
        id: "next-step-tasks",
        title: "Post-visit next-step tasks",
        description: "Required follow-ups after meetings keep deals moving.",
        priority: "must",
        href: "/use-cases/customer-follow-up/",
      },
      {
        id: "offline-maps",
        title: "Offline or mapping aids",
        description: "Helpful after logging habits stick — not a day-one dependency.",
        priority: "nice",
      },
      {
        id: "coverage-reporting",
        title: "Coverage / visit reporting",
        description: "Views of visits by territory and overdue follow-ups.",
        priority: "nice",
        href: "/capabilities/reporting/",
      },
    ],
    workflowSteps: [
      {
        id: "plan",
        label: "Plan",
        detail: "Select accounts for the route with ownership and last-visit context.",
      },
      {
        id: "visit",
        label: "Visit",
        detail: "Meet on-site; capture attendees, outcome, and needs while fresh.",
      },
      {
        id: "log",
        label: "Log",
        detail: "Write the visit to the account with a dated next step before the next drive.",
      },
      {
        id: "follow",
        label: "Follow up",
        detail: "Complete quote, sample, or intro tasks; update opportunity stage if needed.",
      },
      {
        id: "review",
        label: "Review",
        detail: "Territory review: neglected accounts, overdue visits, weak next steps.",
      },
    ],
    priorities: [
      {
        id: "log-fast",
        title: "Fast field capture",
        description: "If logging is hard on mobile, the notebook wins.",
        icon: "zap",
      },
      {
        id: "territory",
        title: "Clear territory ownership",
        description: "Coverage rules must be visible to managers and reps.",
        icon: "users",
      },
      {
        id: "next-after-visit",
        title: "Next step after every visit",
        description: "On-site work without a dated follow-up is unfinished.",
        icon: "target",
        href: "/use-cases/customer-follow-up/",
      },
      {
        id: "shared-history",
        title: "Shared account history",
        description: "Inside and field see the same visit and promise trail.",
        icon: "funnel",
        href: "/use-cases/account-management/",
      },
      {
        id: "coverage-ritual",
        title: "Coverage review ritual",
        description: "Weekly look at neglected accounts beats end-of-quarter surprises.",
        icon: "chart",
        href: "/use-cases/reporting/",
      },
    ],
    scenarios: [
      {
        id: "territory-aes",
        title: "Territory field AEs",
        bestWhen:
          "Reps spend most selling time on-site and need visit history on accounts.",
        icon: "users",
      },
      {
        id: "hybrid",
        title: "Hybrid inside + field",
        bestWhen:
          "Field visits must hand context to inside follow-up without rework.",
        icon: "funnel",
        href: "/use-cases/sales-engagement/",
      },
      {
        id: "leaving-notebooks",
        title: "Leaving notebooks and spreadsheets",
        bestWhen:
          "Managers reconstruct coverage from expenses and memory.",
        icon: "shield",
        href: "/guides/crm-vs-spreadsheet/",
      },
    ],
    buyingFramework: [
      {
        step: 1,
        title: "List what must be logged after a visit",
        description:
          "Attendees, outcome, next step, opportunity impact — keep the list short.",
      },
      {
        step: 2,
        title: "Require mobile capture in demos",
        description:
          "Have a rep log a fake visit in under two minutes on a phone.",
        href: "/guides/crm-demo-guide/",
        ctaLabel: "Demo guide →",
      },
      {
        step: 3,
        title: "Define territory ownership rules",
        description:
          "Geography, named accounts, or hybrid — write rules before importing.",
        href: "/guides/crm-requirements-guide/",
        ctaLabel: "Requirements guide →",
      },
      {
        step: 4,
        title: "Trial on a live route week",
        description:
          "One territory, real visits, one coverage review from CRM only.",
        href: "/guides/crm-trial-evaluation/",
        ctaLabel: "Trial evaluation →",
      },
      {
        step: 5,
        title: "Add maps and offline later",
        description:
          "Routing aids matter after visit logging is habitual.",
      },
    ],
    heroVisual: {
      src: "/use-cases/field-sales-hero.png",
      alt: "Educational diagram of CRM field sales: territory ownership, on-site visits logged to accounts, and post-visit follow-up tasks.",
      caption:
        "Field sales CRM turns territory visits into shared history and next steps.",
    },
    needsVisual: {
      src: "/use-cases/field-sales-needs.png",
      alt: "Diagram mapping field pains — notebook CRM, territory fog, follow-up gaps, inside/field handoff breaks — to CRM fixes.",
      caption:
        "What usually breaks in field selling — and how CRM capture addresses it.",
    },
    workflowVisual: {
      src: "/use-cases/field-sales-workflow.png",
      alt: "Five-step field sales CRM workflow: plan, visit, log, follow up, review.",
      caption:
        "A practical field loop from route planning through coverage review.",
    },
    faq: [
      {
        question: "What makes field sales CRM different from desk sales CRM?",
        answer:
          "Field sales emphasizes territory coverage, visit logging, and mobile capture after face-to-face meetings. Desk motions emphasize sequences and inbox workflows more than on-site visit history.",
      },
      {
        question: "Do we need offline mode on day one?",
        answer:
          "Only if reps routinely work without connectivity. Many teams succeed first with fast mobile logging when signal returns — then add offline if that still blocks adoption.",
      },
      {
        question: "How detailed should visit notes be?",
        answer:
          "Short and structured: who attended, outcome, next step, and date. Long narrative that nobody writes consistently loses to a notebook again.",
      },
      {
        question: "How should field work connect to pipeline?",
        answer:
          "Visits should update account context and, when commercial progress is real, advance or create opportunities with the same next-step discipline as inside deals.",
      },
    ],
    relatedUseCaseSlugs: [
      "account-management",
      "customer-follow-up",
      "pipeline-management",
      "contact-management",
      "relationship-management",
    ],
    featuredGuideHrefs: [
      "/guides/how-to-choose-crm/",
      "/guides/crm-requirements-guide/",
      "/guides/crm-vs-spreadsheet/",
      "/guides/common-crm-mistakes/",
    ],
  },

  "high-volume-lead-management": {
    displayTitle: "CRM for High-Volume Lead Management",
    badgeLabel: "High volume",
    tagline:
      "Route, prioritize, and clear large lead queues without losing SLAs — when “who grabs it in Slack” no longer scales.",
    overview:
      "High-volume lead management is the CRM job of operating lead flow at scale: routing rules, queue hygiene, prioritization, and SLA enforcement when hundreds or thousands of leads arrive. It builds on general lead management by emphasizing throughput, fair distribution, and preventing queue rot — not only capturing and qualifying a modest inbound stream.",
    whoThisIsFor:
      "Inbound ops, SDR managers, and marketing/sales ops teams drowning in form fills, list uploads, or partner leads. You need routing and queue discipline more than another spreadsheet column.",
    whatMattersIntro:
      "Prioritize assignment rules, queue views by age/SLA, status hygiene, and recycling paths. Advanced scoring helps after the team can clear and audit a high-volume queue daily.",
    workedExample:
      "Worked example: a SaaS inbound team at 500+ leads/week. Before CRM, leads piled in a sheet and Slack claims created fights over “good” ones. After CRM, round-robin and territory rules assign instantly — daily standups clear aged unworked leads instead of arguing ownership.",
    workedExampleSecondary:
      "Worked example: a partner channel dumping CSVs weekly. Before CRM, duplicates and unassigned rows sat for days. After CRM, import, dedupe, and routing put every row into an owned status with an SLA clock.",
    glance: {
      primaryGoal: "Scalable routing and queue clearance with enforceable SLAs",
      typicalTeam: "SDR managers, inbound ops, marketing/sales ops",
      commonPriorities: [
        "Automated routing",
        "Queue age / SLA views",
        "Dedupe discipline",
        "Status hygiene",
        "Recycle / nurture paths",
      ],
    },
    challenges: [
      {
        id: "queue-rot",
        title: "Lead queues rot unworked",
        pain: "Volume exceeds manual claiming; aged leads silently die.",
        crmHelps:
          "Assignment rules and aged-lead views make unworked volume visible daily.",
      },
      {
        id: "unfair-grab",
        title: "Cherry-picking and Slack claiming",
        pain: "High-intent leads get contested; others never get touched.",
        crmHelps:
          "Round-robin or rule-based routing removes ad-hoc claiming.",
      },
      {
        id: "duplicate-storm",
        title: "Duplicates flood the queue",
        pain: "Reps waste time on the same person from multiple sources.",
        crmHelps:
          "Dedupe on create/import keeps volume workable.",
      },
      {
        id: "no-recycle",
        title: "No recycle path for not-now leads",
        pain: "Disqualified and nurture leads clog the same active queue.",
        crmHelps:
          "Statuses and nurture/recycle workflows keep the working queue honest.",
      },
    ],
    outcomes: [
      {
        id: "owned-at-scale",
        title: "Ownership at volume",
        description:
          "Leads get owners automatically instead of waiting for volunteers.",
      },
      {
        id: "sla-clearance",
        title: "SLA-driven queue clearance",
        description:
          "Aged unworked leads surface every day for managers.",
      },
      {
        id: "less-duplicate-waste",
        title: "Less duplicate waste",
        description:
          "Imports and forms collide less with existing records.",
      },
      {
        id: "cleaner-active-queue",
        title: "A cleaner active queue",
        description:
          "Nurture and disqualified leads leave the working list.",
      },
    ],
    capabilityNeeds: [
      {
        id: "routing-rules",
        title: "Routing / assignment rules",
        description: "Territory, round-robin, product, or partner-based ownership.",
        priority: "must",
        href: "/use-cases/inbound-sales/",
      },
      {
        id: "queue-views",
        title: "Queue views by age and owner",
        description: "Daily clearance of unworked and SLA-breached leads.",
        priority: "must",
      },
      {
        id: "statuses",
        title: "Lead statuses & reasons",
        description: "Working, recycled, disqualified — keep volume segmented.",
        priority: "must",
        href: "/capabilities/lead-management/",
      },
      {
        id: "dedupe",
        title: "Dedupe on create / import",
        description: "Prevent duplicate storms from forms and list loads.",
        priority: "must",
        href: "/capabilities/contact-management/",
      },
      {
        id: "scoring",
        title: "Prioritization / scoring",
        description: "Useful after routing and clearance rituals work.",
        priority: "nice",
      },
      {
        id: "automation",
        title: "SLA reminders & auto-reassign",
        description: "Escalate unworked leads after hygiene is real.",
        priority: "nice",
        href: "/capabilities/workflow-automation/",
      },
    ],
    workflowSteps: [
      {
        id: "ingest",
        label: "Ingest",
        detail: "Forms, imports, and partners create leads with source fields.",
      },
      {
        id: "route",
        label: "Route",
        detail: "Rules assign owners immediately; duplicates merge or link.",
      },
      {
        id: "work",
        label: "Work",
        detail: "Reps clear personal queues by SLA; log touches and outcomes.",
      },
      {
        id: "disposition",
        label: "Disposition",
        detail: "Convert, recycle/nurture, or disqualify with a reason.",
      },
      {
        id: "clear",
        label: "Clear",
        detail: "Daily ops review: aged unworked, routing misses, queue health.",
      },
    ],
    priorities: [
      {
        id: "auto-own",
        title: "Automatic ownership",
        description: "Volume cannot wait for manual claiming.",
        icon: "zap",
        href: "/use-cases/inbound-sales/",
      },
      {
        id: "age-views",
        title: "Age and SLA views",
        description: "Make rotting leads impossible to ignore.",
        icon: "chart",
        href: "/use-cases/reporting/",
      },
      {
        id: "dedupe",
        title: "Dedupe discipline",
        description: "High volume without dedupe multiplies waste.",
        icon: "shield",
        href: "/use-cases/contact-management/",
      },
      {
        id: "status-hygiene",
        title: "Strict status hygiene",
        description: "Keep the working queue separate from nurture and junk.",
        icon: "funnel",
        href: "/use-cases/lead-management/",
      },
      {
        id: "daily-clearance",
        title: "Daily clearance ritual",
        description: "Ops looks at aged leads every day — not only at month end.",
        icon: "users",
      },
    ],
    scenarios: [
      {
        id: "high-inbound",
        title: "High-inbound product teams",
        bestWhen:
          "Demo and trial volume exceeds what Slack claiming can fairly distribute.",
        icon: "zap",
        href: "/use-cases/inbound-sales/",
      },
      {
        id: "list-and-partner",
        title: "List and partner floods",
        bestWhen:
          "Regular CSV or partner uploads create bursty volume and duplicates.",
        icon: "funnel",
        href: "/use-cases/lead-management/",
      },
      {
        id: "multi-sdr",
        title: "Large SDR teams",
        bestWhen:
          "Many reps need fair queues and managers need SLA visibility.",
        icon: "users",
      },
    ],
    buyingFramework: [
      {
        step: 1,
        title: "Measure current volume and SLA misses",
        description:
          "Leads per week, median time-to-own, aged unworked count — baseline first.",
      },
      {
        step: 2,
        title: "Design routing rules on paper",
        description:
          "Territory, round-robin, product, partner — before vendor demos.",
        href: "/guides/crm-requirements-guide/",
        ctaLabel: "Requirements guide →",
      },
      {
        step: 3,
        title: "Demo queue and reassignment admin",
        description:
          "Ask how ops changes rules and clears aged leads without engineering.",
        href: "/guides/crm-demo-guide/",
        ctaLabel: "Demo guide →",
      },
      {
        step: 4,
        title: "Trial at representative volume",
        description:
          "Import a real week of leads; run routing and one clearance day.",
        href: "/guides/crm-trial-evaluation/",
        ctaLabel: "Trial evaluation →",
      },
      {
        step: 5,
        title: "Add scoring and auto-escalation later",
        description:
          "Prioritization features amplify good queues; they do not create them.",
      },
    ],
    heroVisual: {
      src: "/use-cases/high-volume-lead-management-hero.png",
      alt: "Educational diagram of high-volume CRM lead management: ingest, route at scale, work queues by SLA, disposition, and daily clearance.",
      caption:
        "High-volume lead management keeps large queues owned, aged, and clearable.",
    },
    needsVisual: {
      src: "/use-cases/high-volume-lead-management-needs.png",
      alt: "Diagram mapping high-volume pains — queue rot, cherry-picking, duplicates, no recycle path — to CRM fixes.",
      caption:
        "What usually breaks at lead scale — and how routing and queue design address it.",
    },
    workflowVisual: {
      src: "/use-cases/high-volume-lead-management-workflow.png",
      alt: "Five-step high-volume lead workflow: ingest, route, work, disposition, clear.",
      caption:
        "A practical high-volume loop from ingest through daily queue clearance.",
    },
    faq: [
      {
        question: "How is this different from regular lead management?",
        answer:
          "General lead management covers capture and qualification for any volume. High-volume lead management emphasizes routing automation, SLA/age views, dedupe, and daily queue clearance when manual claiming no longer scales.",
      },
      {
        question: "When do we know we need high-volume patterns?",
        answer:
          "When unworked leads regularly age past your SLA, ownership fights appear in Slack, or imports create more duplicates than the team can clean by hand.",
      },
      {
        question: "Should every lead be scored on day one?",
        answer:
          "No. Get ownership, statuses, and clearance rituals working first. Scoring helps prioritize a healthy queue; it cannot fix an unowned backlog.",
      },
      {
        question: "How do recycle paths help volume?",
        answer:
          "Not-now leads need a nurture or recycle status so they leave the active working queue without being deleted — keeping SDRs focused on actionable volume.",
      },
    ],
    relatedUseCaseSlugs: [
      "lead-management",
      "inbound-sales",
      "sales-automation",
      "contact-management",
      "reporting",
    ],
    featuredGuideHrefs: [
      "/guides/how-to-choose-crm/",
      "/guides/crm-requirements-guide/",
      "/guides/common-crm-mistakes/",
      "/guides/crm-roi-guide/",
    ],
  },

  "complex-sales-processes": {
    displayTitle: "CRM for Complex Sales Processes",
    badgeLabel: "Complex sales",
    tagline:
      "Coordinate multi-stakeholder, long-cycle deals with stages, mutual plans, and clear next steps — without losing the thread across months.",
    overview:
      "Complex sales processes are the CRM job of running long, multi-threaded deals: multiple stakeholders, approvals, champions, and checkpoints that span weeks or months. It differs from simple pipeline management by emphasizing stakeholder maps, mutual action plans, and stage gates that match enterprise or committee buying — not just a short stage board for transactional deals.",
    whoThisIsFor:
      "Enterprise AEs, solution consultants, and sales leaders running multi-stakeholder cycles. You lose deals when the buying committee changes and the CRM only shows a stage name with no stakeholder or next-step truth.",
    whatMattersIntro:
      "Prioritize stakeholder roles, stage exit criteria, mutual next steps, and multi-thread coverage. Heavy CPQ and CLM help after the team can explain who is involved and what must happen before a stage advances.",
    workedExample:
      "Worked example: an enterprise AE selling a six-month deal. Before CRM, stakeholders lived in a slide deck and the stage was “negotiation” for months. After CRM, contacts have roles, stage exit criteria are explicit, and next steps are dated — forecast reviews challenge multi-threading, not just close dates.",
    workedExampleSecondary:
      "Worked example: a founder joining late-stage deals. Before CRM, tribal knowledge lived with the AE. After CRM, the opportunity shows champions, blockers, and mutual plan tasks so coverage survives illness and handoffs.",
    glance: {
      primaryGoal: "Multi-stakeholder deal control across long cycles",
      typicalTeam: "Enterprise AEs, SEs, sales leaders on long-cycle deals",
      commonPriorities: [
        "Stakeholder roles",
        "Stage exit criteria",
        "Mutual action plans",
        "Multi-thread coverage",
        "Honest close dates",
      ],
    },
    challenges: [
      {
        id: "single-thread",
        title: "Single-threaded deals",
        pain: "One champion leaves and the opportunity dies quietly.",
        crmHelps:
          "Contacts with roles on the opportunity make coverage gaps visible.",
      },
      {
        id: "stage-wishful",
        title: "Stages without exit criteria",
        pain: "Deals sit in late stages while legal, security, or budget work is unfinished.",
        crmHelps:
          "Stage definitions encode real checkpoints for complex buying.",
      },
      {
        id: "mutual-plan-fog",
        title: "Mutual plans live in decks",
        pain: "Buyer and seller next steps diverge and nobody notices until the close date slips.",
        crmHelps:
          "Shared tasks and dates on the opportunity keep the mutual plan operational.",
      },
      {
        id: "long-cycle-amnesia",
        title: "Long-cycle context amnesia",
        pain: "Months of history live in email; new stakeholders restart discovery.",
        crmHelps:
          "Activity and notes on the deal preserve institutional memory.",
      },
    ],
    outcomes: [
      {
        id: "multi-thread-visible",
        title: "Multi-threading becomes visible",
        description:
          "Managers see role coverage, not only a stage label.",
      },
      {
        id: "honest-stages",
        title: "Honest late-stage progression",
        description:
          "Deals advance when complex checkpoints are done, not when optimism peaks.",
      },
      {
        id: "mutual-plan-ops",
        title: "Mutual plans become operational",
        description:
          "Buyer and seller next steps live as dated work on the deal.",
      },
      {
        id: "handoff-ready",
        title: "Handoff-ready deal context",
        description:
          "SEs, managers, and executives inherit stakeholder and history context.",
      },
    ],
    capabilityNeeds: [
      {
        id: "contact-roles",
        title: "Contacts with roles on opportunities",
        description: "Champion, economic buyer, blocker, user — on the deal.",
        priority: "must",
        href: "/capabilities/contact-management/",
      },
      {
        id: "stage-gates",
        title: "Stage model with exit criteria",
        description: "Complex checkpoints encoded in stage definitions.",
        priority: "must",
        href: "/capabilities/pipeline-management/",
      },
      {
        id: "mutual-tasks",
        title: "Mutual next-step tasks",
        description: "Buyer and seller actions with dates on the opportunity.",
        priority: "must",
        href: "/use-cases/customer-follow-up/",
      },
      {
        id: "activity-history",
        title: "Long-cycle activity history",
        description: "Notes, meetings, and emails attached to the deal over months.",
        priority: "must",
      },
      {
        id: "meddic-fields",
        title: "Methodology fields (MEDDICC, etc.)",
        description: "Optional structure after roles and next steps are consistent.",
        priority: "nice",
      },
      {
        id: "forecast-categories",
        title: "Forecast categories",
        description: "Commit/best-case useful once stage honesty exists.",
        priority: "nice",
        href: "/capabilities/forecasting/",
      },
    ],
    workflowSteps: [
      {
        id: "map",
        label: "Map",
        detail: "Identify stakeholders and roles; attach them to the opportunity.",
      },
      {
        id: "qualify",
        label: "Qualify",
        detail: "Confirm problem, budget path, and process — record exit criteria progress.",
      },
      {
        id: "plan",
        label: "Plan",
        detail: "Agree a mutual action plan with dated buyer and seller steps.",
      },
      {
        id: "advance",
        label: "Advance",
        detail: "Move stages only when checkpoints complete; multi-thread continuously.",
      },
      {
        id: "review",
        label: "Review",
        detail: "Deal review: roles, blockers, next steps, forecast category honesty.",
      },
    ],
    priorities: [
      {
        id: "roles",
        title: "Stakeholder roles on every deal",
        description: "Know who champions, who buys, and who can block.",
        icon: "users",
        href: "/use-cases/contact-management/",
      },
      {
        id: "exit-criteria",
        title: "Stage exit criteria",
        description: "Late stages mean completed work, not hopeful labels.",
        icon: "funnel",
        href: "/use-cases/pipeline-management/",
      },
      {
        id: "mutual-plan",
        title: "Mutual next steps",
        description: "Buyer and seller commitments dated on the record.",
        icon: "zap",
        href: "/use-cases/customer-follow-up/",
      },
      {
        id: "multi-thread",
        title: "Multi-thread coverage",
        description: "Single-threaded deals are a coaching alarm, not a surprise.",
        icon: "target",
      },
      {
        id: "forecast-honesty",
        title: "Forecast honesty",
        description: "Categories follow evidence from roles and stages.",
        icon: "chart",
        href: "/use-cases/sales-forecasting/",
      },
    ],
    scenarios: [
      {
        id: "enterprise",
        title: "Enterprise / committee buying",
        bestWhen:
          "Multiple stakeholders and approvals stretch the cycle beyond a few weeks.",
        icon: "users",
      },
      {
        id: "se-involved",
        title: "SE-assisted deals",
        bestWhen:
          "Solution consultants need shared deal context across many meetings.",
        icon: "funnel",
        href: "/use-cases/pipeline-management/",
      },
      {
        id: "long-forecast",
        title: "Long-cycle forecasting pressure",
        bestWhen:
          "Leadership needs evidence-based commit calls on multi-quarter deals.",
        icon: "chart",
        href: "/use-cases/sales-forecasting/",
      },
    ],
    buyingFramework: [
      {
        step: 1,
        title: "Write your real buying process",
        description:
          "Stakeholders, approvals, security, legal — map checkpoints before demos.",
      },
      {
        step: 2,
        title: "Define must-have deal fields and roles",
        description:
          "Roles, exit criteria, mutual tasks — keep methodology fields optional at first.",
        href: "/guides/crm-requirements-guide/",
        ctaLabel: "Requirements guide →",
      },
      {
        step: 3,
        title: "Trial with 5–10 live complex deals",
        description:
          "Import real opportunities and run one deal review from CRM only.",
        href: "/guides/crm-trial-evaluation/",
        ctaLabel: "Trial evaluation →",
      },
      {
        step: 4,
        title: "Validate manager coaching views",
        description:
          "Can leaders see single-threaded deals and missing next steps quickly?",
        href: "/use-cases/reporting/",
        ctaLabel: "Reporting use case →",
      },
      {
        step: 5,
        title: "Add CPQ / CLM when process is stable",
        description:
          "Configure quotes and contracts after stage and stakeholder discipline sticks.",
      },
    ],
    heroVisual: {
      src: "/use-cases/complex-sales-processes-hero.png",
      alt: "Educational diagram of CRM for complex sales: multi-stakeholder roles, stage gates, mutual action plans, and long-cycle reviews.",
      caption:
        "Complex sales CRM keeps committee deals multi-threaded and checkpoint-honest.",
    },
    needsVisual: {
      src: "/use-cases/complex-sales-processes-needs.png",
      alt: "Diagram mapping complex-sales pains — single-threading, wishful stages, deck-only mutual plans, long-cycle amnesia — to CRM fixes.",
      caption:
        "What usually breaks in complex deals — and how CRM deal design addresses it.",
    },
    workflowVisual: {
      src: "/use-cases/complex-sales-processes-workflow.png",
      alt: "Five-step complex sales CRM workflow: map, qualify, plan, advance, review.",
      caption:
        "A practical complex-deal loop from stakeholder mapping through forecast review.",
    },
    faq: [
      {
        question: "How is this different from ordinary pipeline management?",
        answer:
          "Pipeline management is the shared stage board for open deals. Complex sales processes add multi-stakeholder roles, stage exit criteria for committee buying, and mutual action plans suited to long cycles.",
      },
      {
        question: "Do we need MEDDICC fields on day one?",
        answer:
          "Not required. Start with roles, next steps, and honest stage gates. Methodology fields help once the team already updates those consistently.",
      },
      {
        question: "How many stakeholders should we track?",
        answer:
          "Track roles that can advance or block the deal — typically a handful of named contacts with roles, not every meeting attendee.",
      },
      {
        question: "When should forecast categories enter the process?",
        answer:
          "After stage meanings and stakeholder coverage are trustworthy. Categories on fictional late-stage deals create false confidence.",
      },
    ],
    relatedUseCaseSlugs: [
      "pipeline-management",
      "sales-forecasting",
      "contact-management",
      "customer-follow-up",
      "relationship-management",
      "reporting",
    ],
    featuredGuideHrefs: [
      "/guides/how-to-choose-crm/",
      "/guides/crm-requirements-guide/",
      "/guides/common-crm-mistakes/",
      "/guides/crm-roi-guide/",
    ],
  },

  "customer-follow-up": {
    displayTitle: "CRM for Customer Follow-Up",
    badgeLabel: "Follow-up",
    tagline:
      "Make the next step unavoidable — dated tasks on records so promises after calls and meetings do not vanish into inboxes.",
    overview:
      "Customer follow-up is the CRM job of enforcing next-step discipline: every conversation ends with a dated, owned task on the contact, lead, or deal. It differs from broader sales engagement or email outreach by focusing on the operational habit of closing the loop — not on cadence design or campaign volume.",
    whoThisIsFor:
      "AEs, SDRs, account managers, and managers tired of “I’ll ping them next week” with no system of record. You lose momentum when follow-ups live only in memory, sticky notes, or personal reminders.",
    whatMattersIntro:
      "Prioritize required next dates, task queues by owner, and review of overdue follow-ups. Automation reminders help after the team accepts that open work without a next step is incomplete.",
    workedExample:
      "Worked example: an AE team after demos. Before CRM, follow-ups sat in personal calendars and many demos went quiet. After CRM, every demo creates a dated next task on the opportunity — Friday reviews clear overdue follow-ups before new outbound.",
    workedExampleSecondary:
      "Worked example: an AM promising a QBR and a pricing review. Before CRM, both lived in email drafts. After CRM, tasks on the account make missed follow-ups visible to the manager before the customer notices.",
    glance: {
      primaryGoal: "Dated, owned next steps after every meaningful conversation",
      typicalTeam: "AEs, SDRs, account managers, sales managers",
      commonPriorities: [
        "Required next dates",
        "Owner task queues",
        "Overdue visibility",
        "Post-meeting hygiene",
        "Handoff continuity",
      ],
    },
    challenges: [
      {
        id: "memory-crm",
        title: "Follow-ups live in memory",
        pain: "Promised pings never happen; deals cool without a visible miss.",
        crmHelps:
          "Tasks with due dates on records make next steps reviewable and coachable.",
      },
      {
        id: "inbox-promises",
        title: "Promises trapped in inboxes",
        pain: "Only the sender knows a follow-up was implied.",
        crmHelps:
          "Logging the next step on the shared record makes coverage survive vacations.",
      },
      {
        id: "no-overdue-view",
        title: "No overdue follow-up view",
        pain: "Managers cannot see which conversations are dangling.",
        crmHelps:
          "Queues of overdue tasks by owner drive weekly hygiene.",
      },
      {
        id: "activity-without-next",
        title: "Activity logged without a next step",
        pain: "Notes prove a call happened but not what happens next.",
        crmHelps:
          "Process rules: meaningful activity requires a dated next action.",
      },
    ],
    outcomes: [
      {
        id: "fewer-dropped-balls",
        title: "Fewer dropped follow-ups",
        description:
          "Promises after calls become dated work on the record.",
      },
      {
        id: "manager-visibility",
        title: "Manager visibility into dangling work",
        description:
          "Overdue tasks surface before customers feel ignored.",
      },
      {
        id: "handoff-safe",
        title: "Handoff-safe next steps",
        description:
          "Covering reps inherit what was promised and when.",
      },
      {
        id: "cleaner-reviews",
        title: "Cleaner pipeline and account reviews",
        description:
          "Reviews start from missing next steps, not from reconstructing history.",
      },
    ],
    capabilityNeeds: [
      {
        id: "tasks-on-records",
        title: "Tasks on leads, contacts, deals, accounts",
        description: "Next steps attach to the right record with an owner and date.",
        priority: "must",
      },
      {
        id: "my-queue",
        title: "Owner task queues",
        description: "Each rep sees today’s and overdue follow-ups clearly.",
        priority: "must",
      },
      {
        id: "overdue-views",
        title: "Overdue / no-next-step views",
        description: "Managers coach dangling conversations weekly.",
        priority: "must",
        href: "/capabilities/reporting/",
      },
      {
        id: "activity-link",
        title: "Activity linked to next steps",
        description: "Calls and meetings close with a required follow-up habit.",
        priority: "must",
        href: "/capabilities/sales-engagement/",
      },
      {
        id: "reminders",
        title: "Reminders / light automation",
        description: "Nudge overdue tasks after the habit exists.",
        priority: "nice",
        href: "/capabilities/workflow-automation/",
      },
      {
        id: "calendar-sync",
        title: "Calendar sync",
        description: "Helpful when meetings already drive the day — optional early on.",
        priority: "nice",
      },
    ],
    workflowSteps: [
      {
        id: "converse",
        label: "Converse",
        detail: "Complete the call, meeting, or email thread with a clear outcome.",
      },
      {
        id: "capture",
        label: "Capture",
        detail: "Log the touch on the record — brief notes beat perfect prose.",
      },
      {
        id: "schedule",
        label: "Schedule",
        detail: "Create a dated next-step task with an owner before leaving the record.",
      },
      {
        id: "execute",
        label: "Execute",
        detail: "Work the task queue daily; complete or reschedule with a reason.",
      },
      {
        id: "review",
        label: "Review",
        detail: "Weekly: overdue tasks, records with no next step, handoff gaps.",
      },
    ],
    priorities: [
      {
        id: "required-next",
        title: "Required next dates",
        description: "Open work without a next step is incomplete by definition.",
        icon: "target",
      },
      {
        id: "daily-queue",
        title: "Daily task queues",
        description: "Reps work CRM follow-ups, not only inbox stars.",
        icon: "zap",
      },
      {
        id: "overdue-coaching",
        title: "Overdue coaching",
        description: "Managers review dangling tasks weekly.",
        icon: "chart",
        href: "/use-cases/reporting/",
      },
      {
        id: "record-attachment",
        title: "Attach to the right record",
        description: "Tasks on deals, accounts, or contacts — not orphan personal todos.",
        icon: "funnel",
        href: "/use-cases/pipeline-management/",
      },
      {
        id: "habit-first",
        title: "Habit before automation",
        description: "Reminders amplify discipline; they do not create it.",
        icon: "shield",
        href: "/guides/crm-change-management/",
      },
    ],
    scenarios: [
      {
        id: "post-demo",
        title: "Post-demo and post-meeting follow-up",
        bestWhen:
          "Deals stall because nobody owns the next conversation after a good meeting.",
        icon: "zap",
        href: "/use-cases/pipeline-management/",
      },
      {
        id: "am-promises",
        title: "Account manager promises",
        bestWhen:
          "Renewal and expansion conversations need dated commercial follow-ups.",
        icon: "users",
        href: "/use-cases/account-management/",
      },
      {
        id: "sdr-ae-hand",
        title: "SDR-to-AE continuity",
        bestWhen:
          "Handoffs fail when the next step was only in the SDR’s head.",
        icon: "funnel",
        href: "/use-cases/sales-engagement/",
      },
    ],
    buyingFramework: [
      {
        step: 1,
        title: "Define “done” for a conversation",
        description:
          "Logged touch + dated next step on the right record — write the rule.",
      },
      {
        step: 2,
        title: "Require task queues in demos",
        description:
          "Ask how reps see today’s and overdue follow-ups without admin help.",
        href: "/guides/crm-demo-guide/",
        ctaLabel: "Demo guide →",
      },
      {
        step: 3,
        title: "Trial with a no-next-step review",
        description:
          "Run one week where managers clear overdue tasks from CRM only.",
        href: "/guides/crm-trial-evaluation/",
        ctaLabel: "Trial evaluation →",
      },
      {
        step: 4,
        title: "Align with pipeline and account reviews",
        description:
          "Follow-up hygiene should feed stage and account meetings.",
        href: "/guides/crm-requirements-guide/",
        ctaLabel: "Requirements guide →",
      },
      {
        step: 5,
        title: "Add reminders after adoption",
        description:
          "Automate nudges only when manual task discipline is already working.",
      },
    ],
    heroVisual: {
      src: "/use-cases/customer-follow-up-hero.png",
      alt: "Educational diagram of CRM customer follow-up: conversation, capture, dated next-step task, execute queue, weekly overdue review.",
      caption:
        "Customer follow-up CRM makes the next step owned, dated, and reviewable.",
    },
    needsVisual: {
      src: "/use-cases/customer-follow-up-needs.png",
      alt: "Diagram mapping follow-up pains — memory CRM, inbox promises, no overdue view, activity without next steps — to CRM fixes.",
      caption:
        "What usually breaks in follow-up — and how task discipline on records addresses it.",
    },
    workflowVisual: {
      src: "/use-cases/customer-follow-up-workflow.png",
      alt: "Five-step customer follow-up workflow: converse, capture, schedule, execute, review.",
      caption:
        "A practical follow-up loop that ends every conversation with a dated next step.",
    },
    faq: [
      {
        question: "How is customer follow-up different from sales engagement?",
        answer:
          "Sales engagement often focuses on cadences and multi-channel outreach programs. Customer follow-up is the narrower discipline of ensuring every conversation has a dated next step on the CRM record.",
      },
      {
        question: "Should every email create a task?",
        answer:
          "No. Require next steps after meaningful conversations — demos, discovery, pricing, renewals — not after every trivial ping. Too many tasks recreate inbox noise.",
      },
      {
        question: "Where should the task live — contact or deal?",
        answer:
          "On the object that owns the work: opportunity for active deals, account for post-sale promises, lead/contact for pre-pipeline conversations. Consistency matters more than perfection.",
      },
      {
        question: "What should managers look at weekly?",
        answer:
          "Overdue tasks by owner, open deals/accounts with no next step, and handoffs where the next action was never created.",
      },
    ],
    relatedUseCaseSlugs: [
      "pipeline-management",
      "account-management",
      "sales-engagement",
      "sales-automation",
      "relationship-management",
    ],
    featuredGuideHrefs: [
      "/guides/how-to-choose-crm/",
      "/guides/crm-requirements-guide/",
      "/guides/common-crm-mistakes/",
      "/guides/crm-roi-guide/",
    ],
  },

  "sales-forecasting": {
    displayTitle: "CRM for Sales Forecasting",
    badgeLabel: "Forecasting",
    tagline:
      "Build commit and best-case calls from clean pipeline stages — so forecasts stop being optimistic storytelling.",
    overview:
      "Sales forecasting is the CRM job of turning honest pipeline into forecast categories: commit, best case, pipeline, and omitted — with owners accountable for evidence. It differs from general reporting by focusing on forward-looking category judgment from stage, amount, close date, and deal quality — not only historical dashboards of activity or conversion.",
    whoThisIsFor:
      "Sales managers, founders, and RevOps partners who must call a number weekly or monthly. You are done reconstructing forecasts from AE verbal updates and mismatched personal sheets.",
    whatMattersIntro:
      "Prioritize stage honesty, required amount/close-date fields, and clear category definitions before advanced AI forecast models. A simple commit process on clean pipeline beats a sophisticated model on fiction.",
    workedExample:
      "Worked example: a sales manager submitting a Friday forecast. Before CRM, each AE emailed a number with different meanings of “commit.” After CRM, categories sit on opportunities with shared stage rules — the forecast meeting inspects evidence on borderline deals, not arithmetic in a new sheet.",
    workedExampleSecondary:
      "Worked example: a founder preparing a board update. Before CRM, pipeline dollar totals mixed wishful late stages. After CRM, forecast views separate commit from upside so leadership sees risk clearly.",
    glance: {
      primaryGoal: "Evidence-based forecast categories from a trusted pipeline",
      typicalTeam: "Sales managers, founders, RevOps",
      commonPriorities: [
        "Stage honesty",
        "Category definitions",
        "Amount & close dates",
        "Deal inspection ritual",
        "Commit accountability",
      ],
    },
    challenges: [
      {
        id: "storytelling",
        title: "Forecast storytelling",
        pain: "Weekly numbers are negotiated verbally instead of inspected in a system.",
        crmHelps:
          "Categories on opportunities with shared definitions make calls reviewable.",
      },
      {
        id: "dirty-pipeline",
        title: "Forecasts on dirty pipeline",
        pain: "Missing amounts, fictional stages, and zombie deals inflate totals.",
        crmHelps:
          "Forecast quality forces pipeline hygiene: owners, stages, close dates.",
      },
      {
        id: "category-confusion",
        title: "Category meanings differ by rep",
        pain: "One AE’s commit is another’s best case.",
        crmHelps:
          "Written category rules and manager overrides create a common language.",
      },
      {
        id: "sheet-shadow",
        title: "Shadow forecast spreadsheets",
        pain: "The “real” forecast lives outside CRM, so CRM data never improves.",
        crmHelps:
          "Running the call from CRM views removes the parallel sheet habit.",
      },
    ],
    outcomes: [
      {
        id: "shared-language",
        title: "A shared forecast language",
        description:
          "Commit and best case mean the same thing across the team.",
      },
      {
        id: "inspectable-deals",
        title: "Inspectable borderline deals",
        description:
          "Meetings challenge evidence on categories, not just totals.",
      },
      {
        id: "cleaner-pipeline",
        title: "Cleaner pipeline as a side effect",
        description:
          "Forecast pressure drives stage honesty and zombie-deal cleanup.",
      },
      {
        id: "less-rebuild",
        title: "Less weekly rebuild labor",
        description:
          "Managers stop recreating the forecast in a personal workbook.",
      },
    ],
    capabilityNeeds: [
      {
        id: "pipeline-inputs",
        title: "Trusted pipeline stages & ownership",
        description: "Forecast inputs start with an honest stage board.",
        priority: "must",
        href: "/capabilities/pipeline-management/",
      },
      {
        id: "forecast-fields",
        title: "Amount, close date, forecast category",
        description: "Required fields that power commit and upside views.",
        priority: "must",
      },
      {
        id: "forecast-views",
        title: "Forecast views by category / period",
        description: "Managers review commit, best case, and pipeline in one place.",
        priority: "must",
      },
      {
        id: "deal-inspection",
        title: "Deal-level inspection",
        description: "Drill from totals to evidence: stage, next step, stakeholders.",
        priority: "must",
        href: "/use-cases/complex-sales-processes/",
      },
      {
        id: "ai-predict",
        title: "Predictive / AI forecast aids",
        description: "Useful after category discipline and hygiene are real.",
        priority: "nice",
      },
      {
        id: "history-snapshots",
        title: "Snapshot / trend history",
        description: "Compare forecast vs actual over time for calibration.",
        priority: "nice",
        href: "/capabilities/reporting/",
      },
    ],
    workflowSteps: [
      {
        id: "hygiene",
        label: "Hygiene",
        detail: "Clear zombie deals, fix amounts/close dates, confirm next steps.",
      },
      {
        id: "categorize",
        label: "Categorize",
        detail: "AEs set forecast categories using shared definitions.",
      },
      {
        id: "inspect",
        label: "Inspect",
        detail: "Manager reviews borderline commits and weak evidence deals.",
      },
      {
        id: "call",
        label: "Call",
        detail: "Lock the period forecast from CRM views — not a new sheet.",
      },
      {
        id: "calibrate",
        label: "Calibrate",
        detail: "Compare forecast to actuals; coach category judgment over time.",
      },
    ],
    priorities: [
      {
        id: "pipeline-first",
        title: "Pipeline honesty first",
        description: "Forecast quality cannot exceed stage and amount quality.",
        icon: "funnel",
        href: "/use-cases/pipeline-management/",
      },
      {
        id: "definitions",
        title: "Written category definitions",
        description: "Commit vs best case must be teachable in one sentence each.",
        icon: "target",
      },
      {
        id: "crm-ritual",
        title: "Forecast from CRM only",
        description: "Kill the shadow spreadsheet or CRM data never improves.",
        icon: "shield",
        href: "/guides/crm-implementation-kpis/",
      },
      {
        id: "evidence",
        title: "Evidence over optimism",
        description: "Inspect next steps, stages, and stakeholders on commits.",
        icon: "users",
        href: "/use-cases/complex-sales-processes/",
      },
      {
        id: "calibration",
        title: "Calibration over time",
        description: "Track forecast vs actual to improve judgment.",
        icon: "chart",
        href: "/use-cases/reporting/",
      },
    ],
    scenarios: [
      {
        id: "weekly-commit",
        title: "Weekly commit calls",
        bestWhen:
          "Managers must submit a number and need shared category evidence.",
        icon: "chart",
      },
      {
        id: "board-updates",
        title: "Leadership / board updates",
        bestWhen:
          "Founders need commit vs upside separated from raw pipeline totals.",
        icon: "users",
        href: "/use-cases/reporting/",
      },
      {
        id: "long-cycle",
        title: "Long-cycle deal inspection",
        bestWhen:
          "Complex deals need category calls grounded in stakeholders and stages.",
        icon: "funnel",
        href: "/use-cases/complex-sales-processes/",
      },
    ],
    buyingFramework: [
      {
        step: 1,
        title: "Write forecast category definitions",
        description:
          "Commit, best case, pipeline, omit — evidence rules before vendor demos.",
      },
      {
        step: 2,
        title: "Confirm pipeline field inputs",
        description:
          "Stage, amount, close date, owner — standardize meanings.",
        href: "/guides/crm-requirements-guide/",
        ctaLabel: "Requirements guide →",
      },
      {
        step: 3,
        title: "Demo native forecast views",
        description:
          "Ask how managers change categories and run a period call without exports.",
        href: "/guides/crm-demo-guide/",
        ctaLabel: "Demo guide →",
      },
      {
        step: 4,
        title: "Trial one real forecast meeting",
        description:
          "Run Friday from CRM only; note which deals lack evidence.",
        href: "/guides/crm-trial-evaluation/",
        ctaLabel: "Trial evaluation →",
      },
      {
        step: 5,
        title: "Add predictive models later",
        description:
          "AI forecast aids wait until categories and hygiene are trusted.",
      },
    ],
    heroVisual: {
      src: "/use-cases/sales-forecasting-hero.png",
      alt: "Educational diagram of CRM sales forecasting: clean pipeline stages feeding commit, best-case, and pipeline categories for a period call.",
      caption:
        "Sales forecasting CRM turns honest pipeline into evidence-based category calls.",
    },
    needsVisual: {
      src: "/use-cases/sales-forecasting-needs.png",
      alt: "Diagram mapping forecasting pains — storytelling, dirty pipeline, category confusion, shadow spreadsheets — to CRM fixes.",
      caption:
        "What usually breaks in forecasting — and how category discipline addresses it.",
    },
    workflowVisual: {
      src: "/use-cases/sales-forecasting-workflow.png",
      alt: "Five-step sales forecasting workflow: hygiene, categorize, inspect, call, calibrate.",
      caption:
        "A practical forecast loop that starts with hygiene and ends in calibration.",
    },
    faq: [
      {
        question: "How is sales forecasting different from CRM reporting?",
        answer:
          "Reporting visualizes pipeline, conversion, and activity for coaching and planning. Forecasting specifically assigns forward-looking categories (commit, best case, etc.) to call a number for a period — it depends on reporting inputs but is a distinct operating ritual.",
      },
      {
        question: "What do we need before forecasting features matter?",
        answer:
          "Honest stages, required amounts and close dates, named owners, and next steps. Without those, forecast categories decorate fiction.",
      },
      {
        question: "How should we define commit?",
        answer:
          "Write a short evidence rule your team can apply — for example, stage past a checkpoint, economic buyer engaged, and a dated mutual next step. Consistency beats a perfect definition.",
      },
      {
        question: "Should AI forecast replace manager judgment?",
        answer:
          "Treat predictive aids as a second opinion after your category process works. Manager inspection of borderline deals remains the operating core for most teams.",
      },
    ],
    relatedUseCaseSlugs: [
      "pipeline-management",
      "reporting",
      "complex-sales-processes",
      "account-management",
      "sales-automation",
    ],
    featuredGuideHrefs: [
      "/guides/how-to-choose-crm/",
      "/guides/crm-requirements-guide/",
      "/guides/crm-roi-guide/",
      "/guides/common-crm-mistakes/",
    ],
  },
};
