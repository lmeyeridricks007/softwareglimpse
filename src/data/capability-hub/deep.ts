import type { CapabilityHubProfile } from "@/domain";

type Depth = Pick<
  CapabilityHubProfile,
  | "displayTitle"
  | "badgeLabel"
  | "tagline"
  | "overview"
  | "whoThisIsFor"
  | "whatMattersIntro"
  | "workedExample"
  | "workedExampleSecondary"
  | "glance"
  | "challenges"
  | "outcomes"
  | "capabilityNeeds"
  | "workflowSteps"
  | "priorities"
  | "scenarios"
  | "buyingFramework"
  | "buyingGuideHref"
  | "faq"
  | "heroVisual"
  | "needsVisual"
  | "workflowVisual"
  | "relatedCapabilitySlugs"
  | "relatedUseCaseSlugs"
  | "relatedRequirementSlugs"
  | "relatedFeatureSlugs"
  | "featuredGuideHrefs"
  | "categorySlug"
>;

const NO_UNIVERSAL_BEST_ANSWER =
  "No. Fit depends on how your team works, which requirements are must-haves, and what the CRM has to integrate with. Use the requirement matrix and CRM Finder to build a shortlist rather than starting from a ranking.";

/**
 * Depth layers for CRM capability hub pages.
 * Category packs (email marketing, BC, PM, HR) are lazy-loaded from
 * `capability-hub/index.ts` — do not import them here.
 */
export const capabilityDepthBySlug: Record<string, Depth> = {
  "contact-management": {
    displayTitle: "CRM Contact Management capability",
    badgeLabel: "Contacts",
    tagline:
      "One record per person and account, with history that survives handoffs — not one more inbox to check.",
    overview:
      "Contact management is the CRM capability that stores people, the accounts they belong to, and the history of interactions with them in one shared record. It is the foundation most other capabilities build on: pipelines, workflows, and reporting all reference the same contact and account data. This page covers what the capability actually does, not which product does it best.",
    whoThisIsFor:
      "Any team member who touches customer or prospect relationships — sales, account management, support, or a founder juggling all three. Contact management matters most once more than one person needs to know what happened with an account, or once someone leaves and their relationship history should not leave with them.",
    whatMattersIntro:
      "Evaluate contact management on the record model, automatic history capture, and how easily people can find and trust a record — not on the number of fields available. A CRM with 200 optional fields nobody fills in is not more capable than one with 15 fields people actually use.",
    workedExample:
      "Worked example: a 12-person agency with three account managers. Before CRM, client history lived across each manager's inbox and a shared spreadsheet nobody updated consistently. After CRM, every client has one record — company details, contacts, and a timeline of emails and calls captured automatically — so a covering AM can pick up a call without asking \"catch me up.\"",
    workedExampleSecondary:
      "Worked example: a two-person founder-led B2B startup. Before CRM, prospects existed as email threads and a mental map of who's warm. After CRM, every prospect has a record with source, last touch, and next step, so nothing goes cold just because it slipped out of an inbox.",
    glance: {
      primaryGoal: "One reliable, shared record per contact and account",
      typicalTeam:
        "Sales, account management, support, and founders sharing relationships",
      commonPriorities: [
        "Accurate records",
        "Automatic history capture",
        "Clear ownership",
        "Custom fields for real attributes",
        "Duplicate control",
      ],
    },
    challenges: [
      {
        id: "scattered-history",
        title: "Client history lives in inboxes, not records",
        pain: "Nobody but the original rep knows what was discussed, promised, or last raised.",
        crmHelps:
          "Email and calendar sync attach correspondence to the record automatically, so history is shared by default.",
      },
      {
        id: "duplicate-drift",
        title: "Duplicate and stale records pile up",
        pain: "The same company gets entered three times with different spellings, and nobody's sure which is current.",
        crmHelps:
          "Duplicate detection and merge tools keep one authoritative record per contact and account.",
      },
      {
        id: "orphan-accounts",
        title: "No one owns the relationship after a handover",
        pain: "A departing rep's accounts become nobody's job until something breaks.",
        crmHelps:
          "Ownership fields and reassignment make responsibility explicit and easy to transfer.",
      },
      {
        id: "field-sprawl",
        title: "Records don't capture what actually matters to your team",
        pain: "Standard fields miss the attributes you use to segment, qualify, or route work.",
        crmHelps:
          "Custom fields let you record the specific data your process depends on, without a developer.",
      },
    ],
    outcomes: [
      {
        id: "single-source",
        title: "One trusted record per contact",
        description:
          "Anyone on the team finds the same information, not a personal version.",
      },
      {
        id: "context-survives",
        title: "Context survives people leaving",
        description:
          "History stays with the account when a rep changes roles or leaves.",
      },
      {
        id: "faster-handoffs",
        title: "Faster, less awkward handoffs",
        description:
          "Covering staff don't have to ask a client to repeat themselves.",
      },
      {
        id: "segmentable-data",
        title: "Data you can actually segment on",
        description:
          "Custom fields and tags make lists and outreach targeted rather than guesswork.",
      },
    ],
    capabilityNeeds: [
      {
        id: "contact-account-records",
        title: "Contact and account records",
        description:
          "Store people alongside the organizations they belong to, not as flat rows.",
        priority: "must",
        href: "/features/contact-management/",
      },
      {
        id: "interaction-timeline",
        title: "Interaction timeline",
        description:
          "See emails, calls, meetings, and notes chronologically on one record.",
        priority: "must",
        href: "/use-cases/contact-management/",
      },
      {
        id: "email-calendar-sync",
        title: "Email and calendar sync",
        description:
          "Capture correspondence automatically instead of relying on manual logging.",
        priority: "must",
        href: "/features/email-sync/",
      },
      {
        id: "custom-fields",
        title: "Custom fields",
        description:
          "Add the attributes your qualification or segmentation actually depends on.",
        priority: "nice",
        href: "/features/custom-fields/",
      },
      {
        id: "record-permissions",
        title: "Record-level access control",
        description: "Restrict sensitive accounts to the people who need them.",
        priority: "nice",
        href: "/capabilities/security/",
      },
    ],
    workflowSteps: [
      {
        id: "capture",
        label: "Capture",
        detail: "A new contact or account enters the CRM from a form, import, or manual add.",
      },
      {
        id: "enrich",
        label: "Enrich",
        detail: "Company detail, custom fields, and account relationships get filled in.",
      },
      {
        id: "sync",
        label: "Sync",
        detail: "Email and calendar activity attach to the record automatically.",
      },
      {
        id: "maintain",
        label: "Maintain",
        detail: "Owners update fields and merge duplicates as data drifts.",
      },
      {
        id: "handoff",
        label: "Handoff",
        detail: "Ownership reassigns cleanly, with full history moving with the record.",
      },
    ],
    priorities: [
      {
        id: "record-model",
        title: "A record model that matches your business",
        description:
          "Decide how contacts, companies, and accounts relate before importing anything.",
        icon: "database",
      },
      {
        id: "automatic-capture",
        title: "Automatic history capture",
        description: "Manual logging fails under load; sync should not.",
        icon: "mail",
        href: "/features/email-sync/",
      },
      {
        id: "clean-data",
        title: "Deduplication and data hygiene",
        description:
          "A record model is only useful if the data in it is trustworthy.",
        icon: "filter",
      },
      {
        id: "access-control",
        title: "Sensible access control",
        description: "Not every record needs to be visible to everyone.",
        icon: "shield",
        href: "/capabilities/security/",
      },
    ],
    scenarios: [
      {
        id: "multi-person-accounts",
        title: "Multiple people share the same accounts",
        bestWhen:
          "Sales, support, and account management all touch the same customer.",
        icon: "users",
        href: "/use-cases/account-management/",
      },
      {
        id: "leaving-spreadsheets",
        title: "Leaving spreadsheets and personal inboxes behind",
        bestWhen: "Client history currently lives in someone's email, not a shared system.",
        icon: "database",
        href: "/guides/crm-vs-spreadsheet/",
      },
      {
        id: "handover-heavy",
        title: "Frequent handovers between reps",
        bestWhen: "Coverage, parental leave, or turnover means accounts change owners often.",
        icon: "clock",
      },
    ],
    buyingFramework: [
      {
        step: 1,
        title: "Map your real record model",
        description:
          "Decide how contacts, companies, and accounts should relate before you look at software.",
      },
      {
        step: 2,
        title: "List the must-have fields and history",
        description:
          "Write down what a record must show to be useful in a real conversation.",
        href: "/guides/crm-requirements-guide/",
        ctaLabel: "Requirements guide →",
      },
      {
        step: 3,
        title: "Trial with a messy sample",
        description:
          "Import a slice of real, imperfect data — not a clean demo set — and see how it behaves.",
        href: "/guides/crm-trial-evaluation/",
        ctaLabel: "Trial evaluation →",
      },
      {
        step: 4,
        title: "Shortlist with Finder",
        description:
          "Compare contact-management depth across a fit-based shortlist rather than guesswork.",
        href: "/tools/crm-finder/",
        ctaLabel: "Try CRM Finder →",
      },
      {
        step: 5,
        title: "Confirm sync and access details",
        description:
          "Verify email/calendar sync coverage and record-level permissions with vendors directly.",
      },
    ],
    buyingGuideHref: "/guides/how-to-choose-crm/",
    faq: [
      {
        question: "What is contact management in a CRM?",
        answer:
          "It is the capability that stores people, the accounts they belong to, and a shared history of interactions in one record — so the record, not an individual inbox, is the source of truth.",
      },
      {
        question:
          "How is contact management different from a spreadsheet of contacts?",
        answer:
          "A spreadsheet stores names and details. Contact management adds relationships, ownership, automatic history capture, and the access controls that keep records current and trustworthy.",
      },
      {
        question: "Do we need custom fields on day one?",
        answer:
          "Not until your segmentation or qualification depends on attributes standard fields miss. Start with the default record and add fields once a real gap shows up.",
      },
      {
        question:
          "How does contact management relate to relationship management?",
        answer:
          "Contact management is the record-keeping and history capability underneath relationship management, which is the broader, ongoing job of managing an account over time using that data.",
      },
      {
        question: "Is there one best CRM for contact management?",
        answer: NO_UNIVERSAL_BEST_ANSWER,
      },
    ],
    relatedCapabilitySlugs: [
      "relationship-management",
      "pipeline-management",
      "email",
      "security",
    ],
    relatedUseCaseSlugs: [
      "contact-management",
      "relationship-management",
      "account-management",
    ],
    relatedRequirementSlugs: [],
    relatedFeatureSlugs: ["contact-management", "email-sync", "custom-fields"],
    featuredGuideHrefs: [
      "/guides/crm-vs-spreadsheet/",
      "/guides/crm-requirements-guide/",
      "/guides/how-to-choose-crm/",
    ],
    heroVisual: {
      src: "/capabilities/contact-management-hero-v2.png",
      alt: "Educational diagram of CRM contact management showing a shared contact and account record with a unified interaction timeline.",
      caption:
        "Contact management turns scattered relationship history into one shared, trustworthy record.",
    },
    needsVisual: {
      src: "/capabilities/contact-management-needs-v2.png",
      alt: "Diagram mapping contact management pains — scattered history, duplicates, orphan accounts, missing fields — to CRM capability fixes.",
      caption:
        "What typically breaks in contact records — and the capability that addresses it.",
    },
    workflowVisual: {
      src: "/capabilities/contact-management-workflow-v2.png",
      alt: "Five-step contact management workflow: capture, enrich, sync, maintain, handoff.",
      caption:
        "How a contact record stays accurate from creation through ownership handoff.",
    },
  },

  "relationship-management": {
    displayTitle: "CRM Relationship Management capability",
    badgeLabel: "Relationships",
    tagline:
      "Turn a contact record into an ongoing account relationship — with context that outlives any single deal or ticket.",
    overview:
      "Relationship management is the CRM capability that connects contact records, interaction history, and account-level context into a picture of an ongoing relationship — not just a single transaction. It sits on top of contact management, adding account hierarchy, relationship ownership, and the signals that show whether an account is healthy or drifting.",
    whoThisIsFor:
      "Account managers, customer success teams, and relationship-led sales roles who work with the same accounts over months or years, not a single close-and-move-on deal. It matters most once accounts have multiple contacts, renewal cycles, or cross-sell potential that a single deal record can't capture.",
    whatMattersIntro:
      "Prioritize account-level views, relationship history across multiple contacts, and visibility into account health — not gamified relationship scores. A CRM that shows every touchpoint across an account beats one with a proprietary \"relationship score\" nobody can explain.",
    workedExample:
      "Worked example: a B2B services firm managing 40 retained accounts. Before CRM, each account manager tracked renewal dates and contact changes in a personal notebook. After CRM, every account shows all contacts, contract dates, and recent activity in one view, so coverage during a leave of absence doesn't mean starting from zero.",
    workedExampleSecondary:
      "Worked example: a mid-market SaaS company with named customer success managers. Before CRM, cross-sell opportunities were spotted by chance in a support ticket. After CRM, account-level activity and usage notes surface renewal risk and expansion signals in the same place the CSM already works.",
    glance: {
      primaryGoal:
        "A shared, current view of every account relationship — not just individual contacts",
      typicalTeam: "Account managers, customer success, and relationship-led sales",
      commonPriorities: [
        "Account hierarchy",
        "Multi-contact visibility",
        "Relationship history",
        "Renewal and health signals",
        "Clean ownership at the account level",
      ],
    },
    challenges: [
      {
        id: "single-contact-view",
        title: "Records show a person, not the whole account",
        pain: "You can see one contact's history but not how the account as a whole is doing.",
        crmHelps:
          "Account-level records roll up every contact, deal, and interaction under one relationship.",
      },
      {
        id: "silent-drift",
        title: "Accounts go quiet without anyone noticing",
        pain: "A relationship cools gradually and nobody flags it until a renewal is at risk.",
        crmHelps:
          "Account activity views make declining engagement visible before it becomes a churn conversation.",
      },
      {
        id: "multi-contact-confusion",
        title: "Multiple stakeholders, one thread of truth",
        pain: "Different contacts at the same account hear different things because reps work from separate notes.",
        crmHelps:
          "Shared account records mean every stakeholder's interactions are visible to whoever picks up the account.",
      },
      {
        id: "handover-fragility",
        title: "Relationship knowledge leaves with the person",
        pain: "An account manager's departure resets institutional knowledge to zero.",
        crmHelps: "Ownership and history live on the account record, not in a person's head.",
      },
    ],
    outcomes: [
      {
        id: "account-visibility",
        title: "See the whole relationship, not one contact",
        description: "Every stakeholder and touchpoint rolls up to the account.",
      },
      {
        id: "early-warning",
        title: "Spot cooling relationships earlier",
        description:
          "Activity gaps become visible before a renewal conversation is a surprise.",
      },
      {
        id: "coverage",
        title: "Cover accounts without starting from scratch",
        description: "Handovers inherit account history instead of tribal knowledge.",
      },
      {
        id: "cross-sell-visibility",
        title: "See expansion signals in context",
        description: "Usage notes and support history sit next to commercial history.",
      },
    ],
    capabilityNeeds: [
      {
        id: "account-hierarchy",
        title: "Account and contact hierarchy",
        description:
          "Model organizations with multiple contacts and, where relevant, parent/child accounts.",
        priority: "must",
        href: "/capabilities/contact-management/",
      },
      {
        id: "account-activity",
        title: "Account-level activity rollup",
        description:
          "See every interaction across all contacts at an account in one place.",
        priority: "must",
        href: "/use-cases/relationship-management/",
      },
      {
        id: "ownership-at-account",
        title: "Account ownership and reassignment",
        description:
          "Assign and transfer relationship ownership without losing history.",
        priority: "must",
      },
      {
        id: "health-signals",
        title: "Relationship health signals",
        description: "Surface activity gaps or renewal dates that need attention.",
        priority: "nice",
        href: "/capabilities/reporting/",
      },
      {
        id: "analytics",
        title: "Account-level analytics",
        description: "Report on engagement trends across the account base.",
        priority: "nice",
        href: "/features/analytics/",
      },
    ],
    workflowSteps: [
      {
        id: "establish",
        label: "Establish",
        detail: "Account record created with contacts, hierarchy, and an owner.",
      },
      {
        id: "engage",
        label: "Engage",
        detail: "Interactions across every contact log to the shared account timeline.",
      },
      {
        id: "monitor",
        label: "Monitor",
        detail: "Owners watch activity levels and key dates for the account.",
      },
      {
        id: "review",
        label: "Review",
        detail: "Periodic account reviews use the shared record, not personal notes.",
      },
      {
        id: "transition",
        label: "Transition",
        detail: "Ownership changes hands with full history intact.",
      },
    ],
    priorities: [
      {
        id: "account-not-contact",
        title: "Think in accounts, not just contacts",
        description:
          "The unit of relationship management is the account, with contacts inside it.",
        icon: "users",
      },
      {
        id: "rollup-visibility",
        title: "Rollup visibility across contacts",
        description: "One view should show everything happening at an account.",
        icon: "layers",
      },
      {
        id: "health-over-vanity",
        title: "Real health signals over vanity scores",
        description:
          "Activity gaps and renewal dates matter more than a proprietary score.",
        icon: "chart",
        href: "/capabilities/reporting/",
      },
      {
        id: "clean-handovers",
        title: "Handovers that preserve context",
        description:
          "Ownership transfer should not mean the account manager starts over.",
        icon: "check",
      },
    ],
    scenarios: [
      {
        id: "retained-accounts",
        title: "Retained or subscription accounts",
        bestWhen: "Revenue depends on renewal, not a single close.",
        icon: "clock",
        href: "/use-cases/relationship-management/",
      },
      {
        id: "multi-stakeholder",
        title: "Multiple stakeholders per account",
        bestWhen: "Several contacts at the same organization need a coordinated view.",
        icon: "users",
      },
      {
        id: "csm-handoffs",
        title: "Account manager or CSM handovers",
        bestWhen: "Coverage or turnover means accounts change hands regularly.",
        icon: "layers",
        href: "/use-cases/account-management/",
      },
    ],
    buyingFramework: [
      {
        step: 1,
        title: "Define your account structure",
        description:
          "Decide how you group contacts into accounts, and whether hierarchy (parent/child) matters.",
      },
      {
        step: 2,
        title: "List account-level requirements",
        description:
          "Write down what an account view must show to support a real review.",
        href: "/guides/crm-requirements-guide/",
        ctaLabel: "Requirements guide →",
      },
      {
        step: 3,
        title: "Trial with real multi-contact accounts",
        description:
          "Import accounts with several contacts each and test the rollup view.",
        href: "/guides/crm-trial-evaluation/",
        ctaLabel: "Trial evaluation →",
      },
      {
        step: 4,
        title: "Compare with Finder",
        description:
          "Shortlist CRMs on account-level structure fit, not feature checklists alone.",
        href: "/tools/crm-finder/",
        ctaLabel: "Try CRM Finder →",
      },
      {
        step: 5,
        title: "Confirm handover mechanics",
        description:
          "Verify how ownership reassignment and history retention work with vendors.",
      },
    ],
    buyingGuideHref: "/guides/how-to-choose-crm/",
    faq: [
      {
        question: "What is relationship management in a CRM?",
        answer:
          "It is the capability that rolls up contacts, history, and ownership at the account level, so a relationship can be managed over time rather than as a series of disconnected contacts.",
      },
      {
        question:
          "How is relationship management different from contact management?",
        answer:
          "Contact management is the record and history for a person. Relationship management is the account-level job of managing that relationship over time using those records.",
      },
      {
        question: "Do we need account hierarchy?",
        answer:
          "Only if you sell to organizations with multiple related entities or contacts. Skip it if most relationships are one contact, one deal.",
      },
      {
        question: "What counts as a relationship health signal?",
        answer:
          "Activity gaps, renewal dates, and stalled follow-up — not proprietary scores you can't inspect.",
      },
      {
        question: "Is there one best CRM for relationship management?",
        answer: NO_UNIVERSAL_BEST_ANSWER,
      },
    ],
    relatedCapabilitySlugs: ["contact-management", "sales-engagement", "email", "reporting"],
    relatedUseCaseSlugs: ["relationship-management", "account-management", "customer-follow-up"],
    relatedRequirementSlugs: [],
    relatedFeatureSlugs: ["contact-management", "email-sync", "analytics"],
    featuredGuideHrefs: [
      "/guides/crm-benefits/",
      "/guides/how-crm-works/",
      "/guides/crm-vs-spreadsheet/",
    ],
    heroVisual: {
      src: "/capabilities/relationship-management-hero-v2.png",
      alt: "Educational diagram of CRM relationship management showing an account rolling up multiple contacts, history, and ownership.",
      caption:
        "Relationship management turns a contact record into an ongoing, account-level view.",
    },
    needsVisual: {
      src: "/capabilities/relationship-management-needs-v2.png",
      alt: "Diagram mapping relationship management pains — single-contact views, silent drift, fragile handovers — to CRM capability fixes.",
      caption: "What typically breaks in account relationships — and how this capability helps.",
    },
    workflowVisual: {
      src: "/capabilities/relationship-management-workflow-v2.png",
      alt: "Five-step relationship management workflow: establish, engage, monitor, review, transition.",
      caption: "How an account relationship stays current from setup through ownership transition.",
    },
  },

  "lead-management": {
    displayTitle: "CRM Lead Management capability",
    badgeLabel: "Leads",
    tagline: "Capture, route, and qualify inbound and outbound leads before interest cools.",
    overview:
      "Lead management is the CRM capability for turning inquiries and prospect lists into owned, qualified records before they're ready to become pipeline opportunities. It covers capture from forms and lists, routing to an owner, and the qualification status that decides whether a lead converts to a deal or gets disqualified.",
    whoThisIsFor:
      "SDR/BDR teams, inbound-response owners, and sales managers responsible for what happens in the first minutes or hours after someone shows interest. It matters most once lead volume exceeds what a shared inbox can track reliably.",
    whatMattersIntro:
      "Evaluate capture sources, routing rules, and qualification fields — not scoring sophistication. A simple, fast routing rule that actually runs beats a scoring model nobody trusts enough to act on.",
    workedExample:
      "Worked example: a SaaS company with a demo-request form. Before CRM, requests landed in a shared inbox and response time depended on who happened to check it. After CRM, every request becomes a lead with an owner assigned within minutes and a qualification checklist that decides fit before a demo gets booked.",
    workedExampleSecondary:
      "Worked example: an outbound team working purchased contact lists. Before CRM, two SDRs sometimes called the same contact from separate spreadsheets. After CRM, lead status and last-touch date live on one record, so outreach is coordinated instead of duplicated.",
    glance: {
      primaryGoal: "Fast, owned qualification from first inquiry to opportunity",
      typicalTeam: "SDRs, BDRs, inbound owners, and sales managers",
      commonPriorities: [
        "Capture from every source",
        "Routing and ownership",
        "Qualification criteria",
        "Response speed",
        "Clean conversion to deals",
      ],
    },
    challenges: [
      {
        id: "inbox-leaks",
        title: "Leads sit in a shared inbox",
        pain: "No record of who responded, so leads get answered twice or not at all.",
        crmHelps: "Each lead becomes a record with an owner, status, and activity history.",
      },
      {
        id: "routing-tribal-knowledge",
        title: "Routing rules live in someone's head",
        pain: "Territory or product assignment depends on Slack messages, so leads bounce between people.",
        crmHelps: "Assignment rules route new leads automatically and consistently.",
      },
      {
        id: "inconsistent-qualification",
        title: "Qualification varies rep to rep",
        pain: "Some leads get pushed to pipeline too early, others sit unqualified for weeks.",
        crmHelps: "Shared qualification fields and statuses make the bar for \"ready\" explicit.",
      },
      {
        id: "slow-response",
        title: "Response time drifts as volume grows",
        pain: "The newest, least-urgent-looking leads wait longest and go cold.",
        crmHelps: "Automatic assignment and reminders protect response time as volume rises.",
      },
    ],
    outcomes: [
      {
        id: "owned-leads",
        title: "Every lead has a named owner",
        description: "No inquiry sits unclaimed in a shared inbox.",
      },
      {
        id: "consistent-routing",
        title: "Routing that doesn't depend on memory",
        description: "Rules assign leads the same way every time.",
      },
      {
        id: "clean-qualification",
        title: "A consistent bar for \"qualified\"",
        description: "Reps and managers agree on what moves to pipeline.",
      },
      {
        id: "faster-response",
        title: "Faster, more consistent response times",
        description: "New leads get first contact quickly, even at volume.",
      },
    ],
    capabilityNeeds: [
      {
        id: "multi-source-capture",
        title: "Capture from every source",
        description: "Web forms, lists, and manual entry all create the same lead record.",
        priority: "must",
        href: "/features/lead-management/",
      },
      {
        id: "routing-rules",
        title: "Routing and assignment rules",
        description: "Send new leads to the right owner automatically.",
        priority: "must",
        href: "/features/sales-automation/",
      },
      {
        id: "qualification-status",
        title: "Qualification status and fields",
        description: "A shared definition of what counts as qualified.",
        priority: "must",
      },
      {
        id: "lead-scoring",
        title: "Lead scoring",
        description: "Prioritize follow-up once volume makes manual triage impractical.",
        priority: "nice",
        href: "/capabilities/ai-assistance/",
      },
      {
        id: "conversion-tracking",
        title: "Lead-to-opportunity conversion tracking",
        description:
          "See conversion rates by source to judge where leads actually come from.",
        priority: "nice",
        href: "/capabilities/reporting/",
      },
    ],
    workflowSteps: [
      {
        id: "capture",
        label: "Capture",
        detail: "A lead enters from a form, list import, or manual entry.",
      },
      {
        id: "route",
        label: "Route",
        detail: "Assignment rules give the lead an owner within minutes.",
      },
      {
        id: "qualify",
        label: "Qualify",
        detail: "Owner works the lead against shared qualification criteria.",
      },
      {
        id: "decide",
        label: "Decide",
        detail: "Lead converts to an opportunity or gets disqualified with a reason.",
      },
      {
        id: "review",
        label: "Review",
        detail: "Managers review source performance and response time regularly.",
      },
    ],
    priorities: [
      {
        id: "speed-to-lead",
        title: "Speed to first response",
        description: "Response time usually matters more than any scoring model.",
        icon: "zap",
      },
      {
        id: "clear-routing",
        title: "Routing rules everyone understands",
        description: "Assignment should be explicit, not tribal knowledge.",
        icon: "layers",
        href: "/capabilities/workflow-automation/",
      },
      {
        id: "shared-qualification",
        title: "A shared bar for \"qualified\"",
        description: "Reps and managers need the same definition to trust the pipeline.",
        icon: "check",
      },
      {
        id: "source-visibility",
        title: "Visibility into lead source performance",
        description: "Know which channels actually convert before doubling down.",
        icon: "chart",
        href: "/capabilities/reporting/",
      },
    ],
    scenarios: [
      {
        id: "inbound-volume",
        title: "Inbound requests need fast triage",
        bestWhen: "Forms or ads generate more inquiries than a shared inbox can track.",
        icon: "zap",
        href: "/use-cases/inbound-sales/",
      },
      {
        id: "outbound-lists",
        title: "Outbound teams working purchased or sourced lists",
        bestWhen: "Multiple reps prospect from lists and need coordinated ownership.",
        icon: "users",
        href: "/use-cases/outbound-sales/",
      },
      {
        id: "scaling-volume",
        title: "Lead volume is outgrowing manual handling",
        bestWhen:
          "Routing and qualification used to be manageable by memory and no longer are.",
        icon: "layers",
        href: "/use-cases/high-volume-lead-management/",
      },
    ],
    buyingFramework: [
      {
        step: 1,
        title: "Define your qualification criteria",
        description: "Agree what \"qualified\" means before comparing software.",
      },
      {
        step: 2,
        title: "Write down routing rules",
        description: "Document how leads should be assigned today, even if it's informal.",
        href: "/guides/crm-requirements-guide/",
        ctaLabel: "Requirements guide →",
      },
      {
        step: 3,
        title: "Trial with real lead volume",
        description:
          "Test routing and response time with a realistic batch, not five sample leads.",
        href: "/guides/crm-trial-evaluation/",
        ctaLabel: "Trial evaluation →",
      },
      {
        step: 4,
        title: "Shortlist with Finder",
        description: "Compare lead capture and routing depth across a fit-based shortlist.",
        href: "/tools/crm-finder/",
        ctaLabel: "Try CRM Finder →",
      },
      {
        step: 5,
        title: "Confirm automation limits",
        description:
          "Check plan limits on assignment rules and automated actions with vendors.",
      },
    ],
    buyingGuideHref: "/guides/how-to-choose-crm/",
    faq: [
      {
        question: "What is lead management in a CRM?",
        answer:
          "It is the capability for capturing inquiries and prospect lists, routing them to an owner, and qualifying them before they become pipeline opportunities.",
      },
      {
        question: "What is the difference between lead management and pipeline management?",
        answer:
          "Lead management covers capture and qualification before real ownership of an opportunity. Pipeline management starts once a qualified opportunity is created and staged.",
      },
      {
        question: "Do we need lead scoring?",
        answer:
          "Only once volume makes manual triage impractical. Simple, reliable routing beats a scoring model nobody trusts enough to act on.",
      },
      {
        question: "How fast should lead response be?",
        answer:
          "There's no fixed target that applies everywhere, but the capability should make your response time visible so you can measure and improve it, rather than guess.",
      },
      {
        question: "Is there one best CRM for lead management?",
        answer: NO_UNIVERSAL_BEST_ANSWER,
      },
    ],
    relatedCapabilitySlugs: ["pipeline-management", "workflow-automation", "sales-engagement", "ai-assistance"],
    relatedUseCaseSlugs: ["lead-management", "high-volume-lead-management", "inbound-sales", "prospecting"],
    relatedRequirementSlugs: ["automate-lead-follow-up"],
    relatedFeatureSlugs: ["lead-management", "sales-automation", "analytics"],
    featuredGuideHrefs: [
      "/guides/crm-requirements-guide/",
      "/guides/common-crm-mistakes/",
      "/guides/how-to-choose-crm/",
    ],
    heroVisual: {
      src: "/capabilities/lead-management-hero-v2.png",
      alt: "Educational diagram of CRM lead management showing capture, routing, and qualification of a new lead.",
      caption: "Lead management turns raw inquiries into owned, qualified records.",
    },
    needsVisual: {
      src: "/capabilities/lead-management-needs-v2.png",
      alt: "Diagram mapping lead management pains — inbox leaks, routing chaos, weak qualification, slow response — to CRM capability fixes.",
      caption: "What typically breaks in lead handling — and how this capability helps.",
    },
    workflowVisual: {
      src: "/capabilities/lead-management-workflow-v2.png",
      alt: "Five-step lead management workflow: capture, route, qualify, decide, review.",
      caption: "How a lead moves from first inquiry to a qualified decision.",
    },
  },

  "pipeline-management": {
    displayTitle: "CRM Pipeline Management capability",
    badgeLabel: "Pipeline",
    tagline:
      "Configurable stages, ownership, and activity tracking that turn a sales process into something the software can enforce and report on.",
    overview:
      "Pipeline management is the CRM capability that models opportunities moving through configurable stages, with ownership, activity tracking, and visibility rules attached. As a capability, it's the software's stage engine and deal record — separate from the use case of actually running weekly pipeline reviews, which is how a team applies it day to day.",
    whoThisIsFor:
      "Anyone evaluating whether a CRM's pipeline engine can represent your real sales process — sales ops, RevOps, and sales leaders comparing configurability, not just teams already running a pipeline.",
    whatMattersIntro:
      "Evaluate stage configurability, whether multiple pipelines are supported, and how ownership and activity attach to a deal record — not the number of preset templates. A rigid five-stage default that doesn't match your process is a worse fit than a flexible three-stage one that does.",
    workedExample:
      "Worked example: a services firm with two distinct sale types — new logo and renewal. As a capability, the CRM needs to support multiple pipelines with different stages for each; using one generic pipeline for both processes would force one process to misrepresent the other.",
    workedExampleSecondary:
      "Worked example: a hardware reseller with a long, multi-approval sales cycle. The pipeline capability needs enough stages to reflect real approval gates, plus fields to capture the approver and expected date at each — a two-stage pipeline can't represent that complexity honestly.",
    glance: {
      primaryGoal:
        "Model your real sales process as configurable stages with ownership and activity attached",
      typicalTeam: "Sales ops, RevOps, and sales leaders configuring the system",
      commonPriorities: [
        "Stage configurability",
        "Multiple pipelines",
        "Deal ownership fields",
        "Activity attachment",
        "Stage-change automation hooks",
      ],
    },
    challenges: [
      {
        id: "rigid-defaults",
        title: "Default stages don't match how you sell",
        pain: "A generic funnel forces deals through steps that don't reflect real decision points.",
        crmHelps: "Configurable stages let you define the checkpoints your process actually has.",
      },
      {
        id: "single-pipeline-limits",
        title: "One pipeline can't represent two different processes",
        pain: "New business and renewal (or product lines) get forced into the same stage model.",
        crmHelps:
          "Multiple pipeline support lets distinct processes run separately without distorting each other's data.",
      },
      {
        id: "unstructured-fields",
        title: "Deal records lack the fields your process needs",
        pain: "Value, close date, and next step exist, but approval stage or contract type don't.",
        crmHelps: "Custom fields on the deal record capture the specifics your process depends on.",
      },
      {
        id: "no-automation-hooks",
        title: "Stage changes don't trigger anything",
        pain: "Moving a deal forward doesn't create a task, notify anyone, or update anything else.",
        crmHelps: "Stage-based triggers connect pipeline movement to workflow automation.",
      },
    ],
    outcomes: [
      {
        id: "process-fidelity",
        title: "Stages that match your real process",
        description: "The pipeline reflects actual decision points, not a generic template.",
      },
      {
        id: "multi-process-support",
        title: "Distinct processes stay distinct",
        description: "Different sales motions don't distort each other's stage data.",
      },
      {
        id: "structured-records",
        title: "Deal records with the fields you need",
        description: "Custom fields capture what your process actually tracks.",
      },
      {
        id: "automation-ready",
        title: "Stage changes can trigger action",
        description: "Pipeline movement becomes a hook other capabilities can build on.",
      },
    ],
    capabilityNeeds: [
      {
        id: "configurable-stages",
        title: "Configurable stages",
        description: "Define stages yourself instead of adapting to a fixed default.",
        priority: "must",
        href: "/features/pipeline-management/",
      },
      {
        id: "deal-records",
        title: "Deal and opportunity records",
        description: "Track value, close date, and linked contacts on each opportunity.",
        priority: "must",
        href: "/features/deal-management/",
      },
      {
        id: "ownership-fields",
        title: "Ownership and assignment fields",
        description: "Give every opportunity a clear, reassignable owner.",
        priority: "must",
      },
      {
        id: "multiple-pipelines",
        title: "Multiple pipelines",
        description: "Run distinct sales processes separately when they genuinely differ.",
        priority: "nice",
        href: "/requirements/separate-sales-processes/",
      },
      {
        id: "stage-automation-hooks",
        title: "Stage-based automation triggers",
        description: "Connect stage changes to tasks, notifications, or field updates.",
        priority: "nice",
        href: "/capabilities/workflow-automation/",
      },
    ],
    workflowSteps: [
      {
        id: "configure",
        label: "Configure",
        detail: "Stages, fields, and pipelines get set up to match the real process.",
      },
      {
        id: "create",
        label: "Create",
        detail: "A qualified opportunity enters the pipeline with an owner and value.",
      },
      {
        id: "advance",
        label: "Advance",
        detail: "Deals move stage by stage as real checkpoints are met.",
      },
      {
        id: "trigger",
        label: "Trigger",
        detail: "Stage changes fire automation hooks where configured.",
      },
      {
        id: "close",
        label: "Close",
        detail: "Deals close won or lost, feeding forecasting and reporting.",
      },
    ],
    priorities: [
      {
        id: "match-process",
        title: "Configurability that matches your process",
        description: "Don't force your process to fit the software's default.",
        icon: "funnel",
      },
      {
        id: "separate-processes",
        title: "Support for genuinely separate processes",
        description:
          "One pipeline model shouldn't have to represent two different sales motions.",
        icon: "layers",
        href: "/requirements/separate-sales-processes/",
      },
      {
        id: "field-depth",
        title: "Deal record field depth",
        description: "The record should capture what your process actually needs to track.",
        icon: "settings",
      },
      {
        id: "automation-hooks",
        title: "Stage changes as automation triggers",
        description: "Pipeline movement should be able to kick off other work.",
        icon: "zap",
        href: "/capabilities/workflow-automation/",
      },
    ],
    scenarios: [
      {
        id: "complex-process",
        title: "Multi-stage, multi-approval sales cycles",
        bestWhen: "Your process has more checkpoints than a generic five-stage funnel.",
        icon: "layers",
        href: "/use-cases/complex-sales-processes/",
      },
      {
        id: "distinct-motions",
        title: "Distinct sales motions in one team",
        bestWhen:
          "New business and renewal (or different product lines) need separate stage models.",
        icon: "funnel",
      },
      {
        id: "process-migration",
        title: "Migrating off spreadsheets or a rigid legacy tool",
        bestWhen: "The current tool's pipeline model no longer reflects how you sell.",
        icon: "database",
        href: "/guides/crm-vs-spreadsheet/",
      },
    ],
    buyingFramework: [
      {
        step: 1,
        title: "Map your real stages first",
        description: "Document the actual checkpoints in your process before touching software.",
      },
      {
        step: 2,
        title: "Decide if you need multiple pipelines",
        description: "Confirm whether your processes genuinely differ or just look different.",
        href: "/requirements/separate-sales-processes/",
        ctaLabel: "Requirement detail →",
      },
      {
        step: 3,
        title: "Write pipeline requirements",
        description: "List stage, field, and ownership needs before demos.",
        href: "/guides/crm-requirements-guide/",
        ctaLabel: "Requirements guide →",
      },
      {
        step: 4,
        title: "Trial with your real stages configured",
        description: "Build your actual pipeline in a trial, not the vendor's demo template.",
        href: "/guides/crm-trial-evaluation/",
        ctaLabel: "Trial evaluation →",
      },
      {
        step: 5,
        title: "Shortlist with Finder",
        description: "Compare pipeline configurability across a fit-based shortlist.",
        href: "/tools/crm-finder/",
        ctaLabel: "Try CRM Finder →",
      },
    ],
    buyingGuideHref: "/guides/how-to-choose-crm/",
    faq: [
      {
        question: "What is pipeline management as a CRM capability?",
        answer:
          "It's the stage engine and deal record the software provides — configurable stages, ownership, and activity tracking attached to each opportunity.",
      },
      {
        question: "How is this different from the pipeline management use case?",
        answer:
          "The capability is what the software provides — the stage engine and deal record. The use case is the actual job of running a pipeline day to day using that engine.",
      },
      {
        question: "Do we need multiple pipelines?",
        answer:
          "Only if processes genuinely differ in stages. Many teams start with one well-designed pipeline and split it later.",
      },
      {
        question: "How many stages should a pipeline have?",
        answer: "Enough to reflect real decision points, and no more.",
      },
      {
        question: "Is there one best CRM for pipeline management?",
        answer: NO_UNIVERSAL_BEST_ANSWER,
      },
    ],
    relatedCapabilitySlugs: ["deal-management", "forecasting", "workflow-automation", "reporting"],
    relatedUseCaseSlugs: ["pipeline-management", "complex-sales-processes", "field-sales"],
    relatedRequirementSlugs: ["separate-sales-processes"],
    relatedFeatureSlugs: ["pipeline-management", "deal-management", "forecasting"],
    featuredGuideHrefs: [
      "/guides/crm-requirements-guide/",
      "/guides/crm-vs-spreadsheet/",
      "/guides/common-crm-mistakes/",
    ],
    heroVisual: {
      src: "/capabilities/pipeline-management-hero-v2.png",
      alt: "Educational diagram of CRM pipeline management showing configurable stages, ownership fields, and a deal record.",
      caption: "Pipeline management is the configurable stage engine behind a sales process.",
    },
    needsVisual: {
      src: "/capabilities/pipeline-management-needs-v2.png",
      alt: "Diagram mapping pipeline capability gaps — rigid defaults, single-pipeline limits, unstructured fields — to CRM fixes.",
      caption: "What typically breaks when a pipeline engine doesn't match your process.",
    },
    workflowVisual: {
      src: "/capabilities/pipeline-management-workflow-v2.png",
      alt: "Five-step pipeline capability workflow: configure, create, advance, trigger, close.",
      caption: "How a configured pipeline moves deals from creation to close.",
    },
  },

  "deal-management": {
    displayTitle: "CRM Deal Management capability",
    badgeLabel: "Deals",
    tagline:
      "The opportunity record itself — value, close date, products, and the fields a real deal needs to be tracked honestly.",
    overview:
      "Deal management is the CRM capability covering the opportunity record: value, expected close date, linked contacts and accounts, products or line items, and the custom fields a real deal needs. It's distinct from pipeline management, which is the stage engine the deal moves through — deal management is what's actually recorded on each deal.",
    whoThisIsFor:
      "Sales ops and RevOps evaluating whether a CRM's deal record can hold what your process actually needs — line items, multiple contacts per deal, custom close-reason fields — versus a generic name-value-date row.",
    whatMattersIntro:
      "Evaluate what fields a deal record supports natively versus what needs custom fields, and whether products or line items are modeled at all. A CRM that treats a deal as name plus value plus date is a poor fit for anything with multiple line items or approval fields.",
    workedExample:
      "Worked example: a company selling multi-product packages. Deal management as a capability needs to support line items with individual pricing, not just a single deal total — otherwise every package sale gets summarized into one number that hides the mix.",
    workedExampleSecondary:
      "Worked example: a firm that tracks why deals are lost. The deal record needs a structured lost-reason field, not a free-text note nobody fills in consistently — otherwise loss analysis becomes guesswork.",
    glance: {
      primaryGoal:
        "A deal record that captures what your process actually needs to know about each opportunity",
      typicalTeam: "Sales ops, RevOps, and finance stakeholders who consume deal data",
      commonPriorities: [
        "Core deal fields",
        "Line items / products",
        "Multiple contacts per deal",
        "Structured win/loss reasons",
        "Custom fields",
      ],
    },
    challenges: [
      {
        id: "flat-deal-record",
        title: "The deal record is just name, value, and date",
        pain: "Anything more specific — products, approvers, loss reason — has nowhere to live.",
        crmHelps:
          "Custom fields and, where supported, line items extend the deal record to match your process.",
      },
      {
        id: "no-line-items",
        title: "Multi-product deals collapse into one total",
        pain: "You can't see the product mix that made up a deal's value.",
        crmHelps: "Line-item support models individual products and pricing within a deal.",
      },
      {
        id: "single-contact-deal",
        title: "A deal can only link to one contact",
        pain: "Complex sales involve multiple stakeholders, but the record only has room for one.",
        crmHelps: "Multi-contact linking on the deal reflects real buying-committee structures.",
      },
      {
        id: "unstructured-loss-reasons",
        title: "Lost deals get a free-text note, or nothing",
        pain: "Loss analysis is impossible without a consistent, structured reason field.",
        crmHelps: "Structured close-reason fields make loss analysis a report, not a guess.",
      },
    ],
    outcomes: [
      {
        id: "accurate-deal-data",
        title: "Deal data that reflects reality",
        description: "Custom fields and line items capture what actually happened, not an approximation.",
      },
      {
        id: "product-visibility",
        title: "Visibility into product mix",
        description: "Line items show what's actually driving deal value.",
      },
      {
        id: "committee-aware",
        title: "Records that reflect real buying committees",
        description: "Multiple stakeholders per deal are visible, not flattened to one contact.",
      },
      {
        id: "loss-analysis",
        title: "Real loss-reason analysis",
        description: "Structured fields make win/loss patterns reportable.",
      },
    ],
    capabilityNeeds: [
      {
        id: "core-deal-fields",
        title: "Core deal fields",
        description: "Value, expected close date, and stage as standard, editable fields.",
        priority: "must",
        href: "/features/deal-management/",
      },
      {
        id: "linked-records",
        title: "Linked contacts and accounts",
        description: "Connect a deal to the people and organization it belongs to.",
        priority: "must",
        href: "/capabilities/contact-management/",
      },
      {
        id: "custom-deal-fields",
        title: "Custom fields on the deal record",
        description: "Capture attributes standard fields miss.",
        priority: "must",
        href: "/features/custom-fields/",
      },
      {
        id: "line-items",
        title: "Products and line items",
        description: "Model multi-product deals with individual pricing.",
        priority: "nice",
      },
      {
        id: "structured-loss-reasons",
        title: "Structured win/loss reason fields",
        description: "Turn loss analysis into a report instead of a guess.",
        priority: "nice",
        href: "/capabilities/reporting/",
      },
    ],
    workflowSteps: [
      {
        id: "create",
        label: "Create",
        detail: "A deal record is created with value, close date, and linked account.",
      },
      {
        id: "detail",
        label: "Detail",
        detail: "Products, custom fields, and additional contacts are added.",
      },
      {
        id: "update",
        label: "Update",
        detail: "Value and close date are revised as the opportunity develops.",
      },
      {
        id: "close",
        label: "Close",
        detail: "Deal closes won or lost with a structured reason recorded.",
      },
      {
        id: "analyze",
        label: "Analyze",
        detail: "Deal data feeds pipeline, forecasting, and win/loss reporting.",
      },
    ],
    priorities: [
      {
        id: "field-fit",
        title: "Fields that match your real deal data",
        description: "Don't force a complex deal into a flat name-value-date record.",
        icon: "settings",
      },
      {
        id: "line-item-support",
        title: "Line-item support for multi-product deals",
        description: "See the product mix, not just a total.",
        icon: "layers",
      },
      {
        id: "multi-contact-deals",
        title: "Multiple contacts per deal",
        description: "Reflect real buying committees, not a single point of contact.",
        icon: "users",
      },
      {
        id: "structured-fields",
        title: "Structured, not free-text, key fields",
        description: "Loss reasons and similar fields should be reportable.",
        icon: "chart",
        href: "/capabilities/reporting/",
      },
    ],
    scenarios: [
      {
        id: "multi-product-sales",
        title: "Multi-product or bundled sales",
        bestWhen: "Deals routinely include more than one product or SKU.",
        icon: "layers",
      },
      {
        id: "committee-sales",
        title: "Buying-committee sales",
        bestWhen: "More than one stakeholder is involved in a single deal.",
        icon: "users",
        href: "/use-cases/complex-sales-processes/",
      },
      {
        id: "loss-analysis-need",
        title: "You need real win/loss analysis",
        bestWhen: "Leadership wants patterns in why deals are lost, not anecdotes.",
        icon: "chart",
        href: "/capabilities/reporting/",
      },
    ],
    buyingFramework: [
      {
        step: 1,
        title: "List what a deal record must capture",
        description: "Products, contacts, custom fields — write down the real shape of a deal.",
      },
      {
        step: 2,
        title: "Check line-item support directly",
        description: "Confirm whether products or line items are native or require a workaround.",
        href: "/guides/crm-requirements-guide/",
        ctaLabel: "Requirements guide →",
      },
      {
        step: 3,
        title: "Trial with a real complex deal",
        description: "Build your messiest recent deal in a trial account, not a simple demo one.",
        href: "/guides/crm-trial-evaluation/",
        ctaLabel: "Trial evaluation →",
      },
      {
        step: 4,
        title: "Shortlist with Finder",
        description: "Compare deal record depth across a fit-based shortlist.",
        href: "/tools/crm-finder/",
        ctaLabel: "Try CRM Finder →",
      },
      {
        step: 5,
        title: "Confirm custom field limits",
        description: "Check how many custom fields and field types each plan allows.",
      },
    ],
    buyingGuideHref: "/guides/how-to-choose-crm/",
    faq: [
      {
        question: "What is deal management in a CRM?",
        answer:
          "It's the capability covering what's recorded on an opportunity — value, close date, linked contacts, products, and custom fields — as distinct from the stages a deal moves through.",
      },
      {
        question: "What is the difference between deal management and pipeline management?",
        answer:
          "Pipeline management is the stages a deal moves through. Deal management is what's actually recorded on the deal itself.",
      },
      {
        question: "Do we need line items?",
        answer: "Only if deals routinely include multiple products or SKUs with separate pricing.",
      },
      {
        question: "Why do structured loss reasons matter?",
        answer: "They turn loss analysis into a report you can trust, instead of anecdote.",
      },
      {
        question: "Is there one best CRM for deal management?",
        answer: NO_UNIVERSAL_BEST_ANSWER,
      },
    ],
    relatedCapabilitySlugs: ["pipeline-management", "forecasting", "customization"],
    relatedUseCaseSlugs: ["pipeline-management", "complex-sales-processes"],
    relatedRequirementSlugs: ["separate-sales-processes"],
    relatedFeatureSlugs: ["deal-management", "pipeline-management", "custom-fields"],
    featuredGuideHrefs: [
      "/guides/crm-requirements-guide/",
      "/guides/crm-selection-mistakes/",
      "/guides/how-to-choose-crm/",
    ],
    heroVisual: {
      src: "/capabilities/deal-management-hero-v2.png",
      alt: "Educational diagram of CRM deal management showing a deal record with line items, contacts, and custom fields.",
      caption: "Deal management is the structured record behind every opportunity.",
    },
    needsVisual: {
      src: "/capabilities/deal-management-needs-v2.png",
      alt: "Diagram mapping deal record gaps — flat records, no line items, single-contact limits, unstructured loss reasons — to CRM fixes.",
      caption: "What typically breaks in a deal record — and how this capability helps.",
    },
    workflowVisual: {
      src: "/capabilities/deal-management-workflow-v2.png",
      alt: "Five-step deal management workflow: create, detail, update, close, analyze.",
      caption: "How a deal record stays accurate from creation through closed analysis.",
    },
  },

  "workflow-automation": {
    displayTitle: "CRM Workflow Automation capability",
    badgeLabel: "Automation",
    tagline:
      "Rule-based actions — tasks, assignments, updates, emails — that fire on their own instead of depending on someone remembering.",
    overview:
      "Workflow automation is the CRM capability that performs actions automatically when a defined condition is met: creating a task, updating a field, assigning a record, or sending an email. It's the rules engine underneath process discipline — separate from sales engagement, which is about the content and cadence of outbound communication itself.",
    whoThisIsFor:
      "RevOps, sales ops, and managers who need process consistency to survive growth without adding administrative headcount. It matters most once manual follow-up starts slipping under volume.",
    whatMattersIntro:
      "Evaluate what can trigger a rule, what actions are available, and plan-tier limits on active workflows — not the total feature list. A capable automation engine capped at a handful of active workflows on your plan is not capable for your team.",
    workedExample:
      "Worked example: a team that used to lose new inbound leads over a weekend. As a capability, workflow automation needs to trigger on record creation (not just scheduled batches) so a new lead gets an assignment and reminder within minutes, any day of the week.",
    workedExampleSecondary:
      "Worked example: a team wanting to escalate stalled deals. The automation capability needs conditional logic — deals with no activity in a set number of days, in a specific stage — not just a single flat trigger, or every stalled deal gets treated the same regardless of why it stalled.",
    glance: {
      primaryGoal: "Rule-based actions that run consistently without manual follow-up",
      typicalTeam: "RevOps, sales ops, and process owners",
      commonPriorities: [
        "Trigger types",
        "Available actions",
        "Conditional logic",
        "Plan-tier execution limits",
        "Testing before go-live",
      ],
    },
    challenges: [
      {
        id: "trigger-gaps",
        title: "Rules can only fire on limited events",
        pain: "You need date-based or record-creation triggers, but the plan only supports scheduled batches.",
        crmHelps:
          "Broad trigger support (creation, field change, date, form submission) covers more real scenarios.",
      },
      {
        id: "action-limits",
        title: "Available actions don't cover what you need",
        pain: "You can update a field but can't send an email or create a task from the same rule.",
        crmHelps:
          "A wider action set (tasks, field updates, emails, notifications) supports real workflows in one rule.",
      },
      {
        id: "no-branching",
        title: "Rules can't branch on conditions",
        pain: "Every record gets the same treatment regardless of what's actually different about it.",
        crmHelps: "Conditional logic lets one workflow behave differently based on record data.",
      },
      {
        id: "plan-caps",
        title: "Active workflow or execution caps bite at scale",
        pain: "The rules work in a trial and then hit a hard limit once volume is real.",
        crmHelps: "Confirming execution limits before rollout avoids mid-rollout surprises.",
      },
    ],
    outcomes: [
      {
        id: "no-manual-followup",
        title: "Follow-up that doesn't depend on memory",
        description: "Rules run whether or not someone remembers to check.",
      },
      {
        id: "consistent-assignment",
        title: "Records assigned the same way every time",
        description: "Routing logic doesn't drift between people.",
      },
      {
        id: "less-admin",
        title: "Less repetitive manual entry",
        description: "Field updates and task creation happen automatically.",
      },
      {
        id: "visible-automation",
        title: "Automation you can see and audit",
        description: "Logs show what a rule actually changed and when.",
      },
    ],
    capabilityNeeds: [
      {
        id: "trigger-types",
        title: "Broad trigger support",
        description: "Fire on record creation, field changes, dates, and form submissions.",
        priority: "must",
        href: "/features/sales-automation/",
      },
      {
        id: "task-actions",
        title: "Task and reminder creation",
        description: "Automatically create and assign the follow-up work.",
        priority: "must",
        href: "/requirements/automate-lead-follow-up/",
      },
      {
        id: "assignment-routing",
        title: "Assignment and routing rules",
        description: "Route new records to an owner without manual triage.",
        priority: "must",
      },
      {
        id: "conditional-logic",
        title: "Conditional branching",
        description: "Let rules behave differently based on record data.",
        priority: "nice",
      },
      {
        id: "execution-visibility",
        title: "Execution logs and testing tools",
        description: "See and test what an automation actually did before trusting it.",
        priority: "nice",
        href: "/capabilities/security/",
      },
    ],
    workflowSteps: [
      { id: "map", label: "Map", detail: "Document the manual process a rule should replace." },
      {
        id: "build",
        label: "Build",
        detail: "Configure the trigger, conditions, and actions for one workflow.",
      },
      {
        id: "test",
        label: "Test",
        detail: "Run against a small set of records before enabling broadly.",
      },
      { id: "enable", label: "Enable", detail: "Turn the rule on and monitor early executions." },
      { id: "review", label: "Review", detail: "Retire or adjust rules as the process changes." },
    ],
    priorities: [
      {
        id: "trigger-breadth",
        title: "Triggers that match your real events",
        description: "Date-based and creation triggers matter as much as scheduled ones.",
        icon: "zap",
      },
      {
        id: "action-depth",
        title: "Actions that cover a full workflow",
        description: "One rule should be able to do more than update a single field.",
        icon: "layers",
      },
      {
        id: "plan-limits",
        title: "Execution limits that fit your volume",
        description: "Check caps on active workflows and monthly executions before committing.",
        icon: "chart",
      },
      {
        id: "auditability",
        title: "Visibility into what automation changed",
        description: "Rules that silently modify records are hard to trust or debug.",
        icon: "shield",
        href: "/capabilities/security/",
      },
    ],
    scenarios: [
      {
        id: "growing-volume",
        title: "Volume is outgrowing manual follow-up",
        bestWhen: "The team can no longer manually track every task and reminder.",
        icon: "zap",
        href: "/use-cases/sales-automation/",
      },
      {
        id: "lean-ops",
        title: "No dedicated operations headcount",
        bestWhen: "Process discipline needs to come from rules, not extra staff.",
        icon: "settings",
      },
      {
        id: "stalled-deal-escalation",
        title: "Stalled work needs to escalate automatically",
        bestWhen: "Deals or leads go quiet and nobody notices until it's too late.",
        icon: "clock",
        href: "/use-cases/customer-follow-up/",
      },
    ],
    buyingFramework: [
      {
        step: 1,
        title: "Pick the one workflow that costs you most when missed",
        description: "Start with the highest-cost manual follow-up, not the most interesting one.",
      },
      {
        step: 2,
        title: "Write down triggers and actions needed",
        description: "List the specific events and actions your top workflow requires.",
        href: "/guides/crm-requirements-guide/",
        ctaLabel: "Requirements guide →",
      },
      {
        step: 3,
        title: "Trial the actual rule",
        description: "Build and test the real workflow in a trial, not a generic demo automation.",
        href: "/guides/crm-trial-evaluation/",
        ctaLabel: "Trial evaluation →",
      },
      {
        step: 4,
        title: "Confirm plan-tier execution limits",
        description: "Verify active workflow and monthly execution caps against your real volume.",
      },
      {
        step: 5,
        title: "Shortlist with Finder",
        description: "Compare automation depth across a fit-based shortlist.",
        href: "/tools/crm-finder/",
        ctaLabel: "Try CRM Finder →",
      },
    ],
    buyingGuideHref: "/guides/how-to-choose-crm/",
    faq: [
      {
        question: "What is workflow automation in a CRM?",
        answer:
          "It is rule-based work the CRM performs on your behalf — creating tasks, updating fields, assigning records, or sending emails when a defined condition is met.",
      },
      {
        question: "What's the difference between workflow automation and sales engagement?",
        answer:
          "Automation acts on records — tasks, fields, assignment. Sales engagement is about the content and cadence of outbound communication to people.",
      },
      {
        question: "What should we automate first?",
        answer:
          "The highest-cost follow-up you currently miss, once the underlying process is stable enough to automate.",
      },
      {
        question: "Does automation usually cost more?",
        answer:
          "Often — it's a common upgrade trigger, and plans may cap active workflows or monthly executions. Verify limits with vendors before shortlisting.",
      },
      {
        question: "Is there one best CRM for automation?",
        answer: NO_UNIVERSAL_BEST_ANSWER,
      },
    ],
    relatedCapabilitySlugs: ["lead-management", "pipeline-management", "email", "sales-engagement"],
    relatedUseCaseSlugs: ["sales-automation", "high-volume-lead-management", "customer-follow-up"],
    relatedRequirementSlugs: ["automate-lead-follow-up"],
    relatedFeatureSlugs: ["sales-automation", "email-sequences"],
    featuredGuideHrefs: [
      "/guides/common-crm-mistakes/",
      "/guides/crm-requirements-guide/",
      "/guides/do-i-need-a-crm/",
    ],
    heroVisual: {
      src: "/capabilities/workflow-automation-hero-v2.png",
      alt: "Educational diagram of CRM workflow automation showing a trigger firing tasks, field updates, and notifications.",
      caption: "Workflow automation replaces manual follow-up with rule-based actions.",
    },
    needsVisual: {
      src: "/capabilities/workflow-automation-needs-v2.png",
      alt: "Diagram mapping automation gaps — limited triggers, narrow actions, no branching, plan caps — to CRM fixes.",
      caption: "What typically breaks in process discipline — and how automation helps.",
    },
    workflowVisual: {
      src: "/capabilities/workflow-automation-workflow-v2.png",
      alt: "Five-step workflow automation lifecycle: map, build, test, enable, review.",
      caption: "How a workflow automation rule goes from manual process to trusted, running rule.",
    },
  },

  email: {
    displayTitle: "CRM Email capability",
    badgeLabel: "Email",
    tagline: "Sync, tracking, and sequences that keep correspondence on the record — not marketing campaigns.",
    overview:
      "Email, as a CRM capability, covers three connected things: syncing correspondence to the right record automatically, tracking opens and replies on individual messages, and running timed follow-up sequences to a person. It is not marketing automation — there's no list-based campaign sending, newsletter segmentation, or marketing analytics here. Marketing automation is a separate category of software with a different job.",
    whoThisIsFor:
      "Sales and account teams who send and receive one-to-one email as part of a relationship, and want that correspondence visible on the CRM record without manual logging.",
    whatMattersIntro:
      "Evaluate sync depth (which providers, which folders), tracking accuracy, and sequence controls (stop-on-reply, step limits) — not template count or campaign features that belong to a different category of software.",
    workedExample:
      "Worked example: an AE who used to BCC the CRM inconsistently. After setting up email sync, every message to or from a tracked contact appears on the record automatically — no manual forwarding, no gaps when they forget.",
    workedExampleSecondary:
      "Worked example: an SDR sending a five-step outbound sequence. The sequence sends each step on schedule and stops automatically the moment the prospect replies — so nobody gets an automated step four after they've already responded.",
    glance: {
      primaryGoal:
        "Keep one-to-one correspondence on the record automatically, and follow up on a schedule without manual tracking",
      typicalTeam: "AEs, SDRs, and account managers doing individual outreach",
      commonPriorities: [
        "Provider sync coverage",
        "Open and reply tracking accuracy",
        "Sequence stop-on-reply logic",
        "Deliverability basics",
        "Clear separation from marketing sends",
      ],
    },
    challenges: [
      {
        id: "manual-bcc",
        title: "Logging email to the CRM is manual and inconsistent",
        pain: "BCC-based logging gets forgotten, so the record has gaps.",
        crmHelps: "Native email sync captures correspondence automatically for tracked contacts.",
      },
      {
        id: "no-visibility",
        title: "No visibility into whether an email was opened",
        pain: "Follow-up timing is a guess without knowing whether the last message landed.",
        crmHelps: "Open and reply tracking gives a signal for when to follow up.",
      },
      {
        id: "sequence-overrun",
        title: "Sequences keep sending after someone replies",
        pain: "An automated step four lands after the prospect already responded, which looks careless.",
        crmHelps: "Stop-on-reply logic halts a sequence the moment a person responds.",
      },
      {
        id: "marketing-confusion",
        title: "Confusing this with marketing email tools",
        pain: "Buying a CRM expecting newsletter-style campaign sending, and being disappointed.",
        crmHelps: "Understanding the boundary upfront avoids buying, or not buying, for the wrong job.",
      },
    ],
    outcomes: [
      {
        id: "complete-history",
        title: "Complete correspondence history",
        description: "Email on the record without manual logging.",
      },
      {
        id: "timing-signal",
        title: "A real signal for follow-up timing",
        description: "Opens and replies inform when to reach out again.",
      },
      {
        id: "clean-sequences",
        title: "Sequences that stop when they should",
        description: "No awkward automated messages after a reply.",
      },
      {
        id: "right-tool-expectations",
        title: "Clear expectations about what this covers",
        description: "No surprise gap when campaign-style sending was actually needed.",
      },
    ],
    capabilityNeeds: [
      {
        id: "email-sync",
        title: "Email sync to the record",
        description: "Automatically attach correspondence to the right contact.",
        priority: "must",
        href: "/features/email-sync/",
      },
      {
        id: "reply-tracking",
        title: "Open and reply tracking",
        description: "See engagement signals on individual sent messages.",
        priority: "must",
        href: "/features/email-tracking/",
      },
      {
        id: "sequences",
        title: "Timed follow-up sequences",
        description: "Send scheduled steps that stop automatically on reply.",
        priority: "must",
        href: "/features/email-sequences/",
      },
      {
        id: "templates",
        title: "Reusable email templates",
        description: "Save time on repeated messages without losing personalization.",
        priority: "nice",
      },
      {
        id: "deliverability-basics",
        title: "Sending limits and deliverability guardrails",
        description: "Understand daily send limits before scaling outreach volume.",
        priority: "nice",
      },
    ],
    workflowSteps: [
      { id: "connect", label: "Connect", detail: "Mailbox connects to the CRM via native sync." },
      {
        id: "capture",
        label: "Capture",
        detail: "Sent and received messages attach to the matching record.",
      },
      { id: "track", label: "Track", detail: "Opens and replies register as signals on the message." },
      {
        id: "sequence",
        label: "Sequence",
        detail: "Scheduled follow-up steps send until a reply stops them.",
      },
      {
        id: "review",
        label: "Review",
        detail: "Reps check engagement signals to prioritize follow-up.",
      },
    ],
    priorities: [
      {
        id: "provider-coverage",
        title: "Real sync depth for your mail provider",
        description: "Confirm which folders and features are actually covered, not just \"supported\".",
        icon: "mail",
      },
      {
        id: "stop-on-reply",
        title: "Reliable stop-on-reply logic",
        description: "A sequence that keeps sending after a reply damages the relationship.",
        icon: "check",
      },
      {
        id: "not-marketing",
        title: "Understanding this isn't marketing automation",
        description: "Campaign sending and list segmentation are a different category of tool.",
        icon: "layers",
      },
      {
        id: "tracking-accuracy",
        title: "Tracking you can actually trust",
        description: "Open tracking has real limitations — treat it as a signal, not a fact.",
        icon: "chart",
      },
    ],
    scenarios: [
      {
        id: "one-to-one-outreach",
        title: "One-to-one sales or account outreach",
        bestWhen: "Correspondence is personal, not a campaign blast.",
        icon: "mail",
        href: "/use-cases/email-outreach/",
      },
      {
        id: "sequence-driven-prospecting",
        title: "Sequence-driven outbound prospecting",
        bestWhen: "SDRs need scheduled, stop-on-reply follow-up at volume.",
        icon: "zap",
        href: "/use-cases/outbound-sales/",
      },
      {
        id: "not-marketing-campaigns",
        title: "You need list-based marketing campaigns instead",
        bestWhen:
          "The job is newsletters or segmented blasts — that's marketing automation, not this capability.",
        icon: "layers",
      },
    ],
    buyingFramework: [
      {
        step: 1,
        title: "Confirm mail provider sync depth",
        description: "Verify exactly which providers and folders are supported — not just a generic \"yes\".",
      },
      {
        step: 2,
        title: "Test tracking accuracy in a trial",
        description: "Send real test emails and check whether opens and replies register reliably.",
        href: "/guides/crm-trial-evaluation/",
        ctaLabel: "Trial evaluation →",
      },
      {
        step: 3,
        title: "Write email requirements",
        description: "List sync, tracking, and sequence needs before comparing vendors.",
        href: "/guides/crm-requirements-guide/",
        ctaLabel: "Requirements guide →",
      },
      {
        step: 4,
        title: "Rule out marketing automation confusion",
        description: "If you need campaign sending too, treat that as a separate requirement or tool.",
        href: "/guides/crm-vs-marketing-automation/",
        ctaLabel: "CRM vs marketing automation →",
      },
      {
        step: 5,
        title: "Shortlist with Finder",
        description: "Compare email capability depth across a fit-based shortlist.",
        href: "/tools/crm-finder/",
        ctaLabel: "Try CRM Finder →",
      },
    ],
    buyingGuideHref: "/guides/how-to-choose-crm/",
    faq: [
      {
        question: "Is CRM email the same as marketing automation?",
        answer:
          "No. CRM email covers sync, tracking, and one-to-one sequences to individual people. Marketing automation covers list-based campaigns, segmentation, and newsletter-style sending — a different category of software.",
      },
      {
        question: "How accurate is email open tracking?",
        answer:
          "Treat it as a signal, not a fact. Tracking pixels can be blocked, and corporate proxies can trigger false opens.",
      },
      {
        question: "What is a sequence in a CRM?",
        answer: "Scheduled follow-up email steps sent to a person that stop automatically once they reply.",
      },
      {
        question: "Do we need this if we already use a marketing tool?",
        answer:
          "Usually yes, for one-to-one sales correspondence. The two solve different jobs and often coexist.",
      },
      {
        question: "Is there one best CRM for email capability?",
        answer: NO_UNIVERSAL_BEST_ANSWER,
      },
    ],
    relatedCapabilitySlugs: ["contact-management", "sales-engagement", "workflow-automation"],
    relatedUseCaseSlugs: ["email-outreach", "customer-follow-up", "sales-engagement"],
    relatedRequirementSlugs: [],
    relatedFeatureSlugs: ["email-sync", "email-tracking", "email-sequences"],
    featuredGuideHrefs: [
      "/guides/crm-vs-marketing-automation/",
      "/guides/crm-requirements-guide/",
      "/guides/how-crm-works/",
    ],
    heroVisual: {
      src: "/capabilities/email-hero-v2.png",
      alt: "Educational diagram of CRM email capability showing sync, open/reply tracking, and a follow-up sequence.",
      caption: "CRM email keeps one-to-one correspondence on the record — sync, tracking, sequences.",
    },
    needsVisual: {
      src: "/capabilities/email-needs-v2.png",
      alt: "Diagram mapping email capability gaps — manual logging, no tracking, sequence overrun, marketing confusion — to CRM fixes.",
      caption: "What typically breaks in sales email — and what this capability actually covers.",
    },
    workflowVisual: {
      src: "/capabilities/email-workflow-v2.png",
      alt: "Five-step CRM email workflow: connect, capture, track, sequence, review.",
      caption: "How email correspondence and sequences flow through the CRM record.",
    },
  },

  "sales-engagement": {
    displayTitle: "CRM Sales Engagement capability",
    badgeLabel: "Engagement",
    tagline:
      "Multi-channel outreach cadences — email, calls, tasks — coordinated as one sequence instead of separate disconnected efforts.",
    overview:
      "Sales engagement is the CRM capability for coordinating multi-touch, multi-channel outreach — email steps, call tasks, and follow-up reminders combined into a single cadence per prospect. It builds on email sequencing and call functionality but adds the cadence structure that ties channels together into one coherent effort per person.",
    whoThisIsFor:
      "SDRs, BDRs, and outbound-focused AEs running structured, repeatable outreach across more than one channel to the same prospect list.",
    whatMattersIntro:
      "Evaluate cadence flexibility (channel mix, step timing) and whether calls and tasks are tracked alongside email in one place — not the number of channel integrations listed on a pricing page.",
    workedExample:
      "Worked example: an SDR team running a seven-touch cadence mixing email and calls. As a capability, sales engagement needs to sequence both channels together per prospect — so a call task appears between email steps automatically, rather than living in a separate call-tracking tool disconnected from the email sequence.",
    workedExampleSecondary:
      "Worked example: a rep covering someone else's territory mid-cadence. Sales engagement should show exactly which step each prospect is on and what channel comes next, so coverage doesn't mean guessing where a cadence left off.",
    glance: {
      primaryGoal: "Coordinate email, calls, and tasks into one multi-channel cadence per prospect",
      typicalTeam: "SDRs, BDRs, and outbound AEs",
      commonPriorities: [
        "Multi-channel cadence structure",
        "Call and task tracking alongside email",
        "Reply and response handling",
        "Cadence-level reporting",
        "Coverage visibility",
      ],
    },
    challenges: [
      {
        id: "channel-silos",
        title: "Email, calls, and tasks live in separate tools",
        pain: "No single view shows where a prospect actually is in outreach.",
        crmHelps: "Cadences combine channels into one sequence per prospect.",
      },
      {
        id: "manual-call-tracking",
        title: "Call outreach isn't tracked with the same rigor as email",
        pain: "Call attempts and outcomes get logged inconsistently, if at all.",
        crmHelps: "Call tasks and outcomes attach to the same cadence and record as email steps.",
      },
      {
        id: "coverage-blindspots",
        title: "Covering someone's cadences mid-sequence is guesswork",
        pain: "A covering rep can't tell which step a prospect is on across channels.",
        crmHelps: "Cadence status shows exactly where each prospect stands, regardless of who's covering.",
      },
      {
        id: "no-cadence-reporting",
        title: "No visibility into which cadence steps actually work",
        pain: "You can't tell if a call step or an email step is where replies happen.",
        crmHelps: "Cadence-level reporting shows response rates by step and channel.",
      },
    ],
    outcomes: [
      {
        id: "unified-cadence",
        title: "One coordinated cadence, not scattered efforts",
        description: "Email, calls, and tasks combine into a single sequence per prospect.",
      },
      {
        id: "call-parity",
        title: "Calls tracked with the same rigor as email",
        description: "Outcomes and attempts log consistently across channels.",
      },
      {
        id: "coverage-clarity",
        title: "Coverage without guesswork",
        description: "Anyone can see exactly where a prospect stands in the cadence.",
      },
      {
        id: "step-level-insight",
        title: "Insight into which steps actually work",
        description: "Reporting shows where replies come from, by step and channel.",
      },
    ],
    capabilityNeeds: [
      {
        id: "multi-channel-cadence",
        title: "Multi-channel cadence structure",
        description: "Combine email, calls, and tasks into one sequence per prospect.",
        priority: "must",
        href: "/features/email-sequences/",
      },
      {
        id: "call-tracking",
        title: "Call task and outcome tracking",
        description: "Log call attempts and results alongside email activity.",
        priority: "must",
        href: "/features/calling/",
      },
      {
        id: "cadence-status",
        title: "Per-prospect cadence status",
        description: "See exactly which step and channel a prospect is currently on.",
        priority: "must",
      },
      {
        id: "cadence-reporting",
        title: "Cadence-level response reporting",
        description: "See which steps and channels actually generate replies.",
        priority: "nice",
        href: "/capabilities/reporting/",
      },
      {
        id: "email-tracking-in-cadence",
        title: "Open and reply tracking on email steps",
        description: "Layer engagement signal onto the email portion of a cadence.",
        priority: "nice",
        href: "/features/email-tracking/",
      },
    ],
    workflowSteps: [
      {
        id: "build-cadence",
        label: "Build",
        detail: "A multi-channel cadence is designed with email, call, and task steps.",
      },
      { id: "enroll", label: "Enroll", detail: "Qualified prospects are added to the cadence." },
      {
        id: "execute",
        label: "Execute",
        detail: "Steps fire on schedule across channels until a reply or manual stop.",
      },
      {
        id: "respond",
        label: "Respond",
        detail: "A reply pulls the prospect out of automated steps for a real conversation.",
      },
      {
        id: "analyze",
        label: "Analyze",
        detail: "Cadence-level reporting shows which steps drove responses.",
      },
    ],
    priorities: [
      {
        id: "channel-coordination",
        title: "Real coordination across channels",
        description: "Email and calls should sit in one sequence, not two disconnected tools.",
        icon: "layers",
      },
      {
        id: "call-rigor",
        title: "Call tracking as rigorous as email tracking",
        description: "Outbound calling shouldn't be the under-tracked half of outreach.",
        icon: "phone",
      },
      {
        id: "coverage-visibility",
        title: "Cadence status visible to anyone covering",
        description: "Someone else should be able to pick up a cadence mid-sequence.",
        icon: "users",
      },
      {
        id: "step-reporting",
        title: "Reporting at the cadence step level",
        description: "Know which specific step is generating replies.",
        icon: "chart",
        href: "/capabilities/reporting/",
      },
    ],
    scenarios: [
      {
        id: "outbound-teams",
        title: "Dedicated outbound prospecting teams",
        bestWhen: "SDRs run structured, repeatable multi-touch outreach at volume.",
        icon: "zap",
        href: "/use-cases/outbound-sales/",
      },
      {
        id: "mixed-channel-outreach",
        title: "Outreach that mixes email and calling",
        bestWhen: "A single cadence needs both channels working together.",
        icon: "phone",
        href: "/use-cases/sales-engagement/",
      },
      {
        id: "team-coverage",
        title: "Territories or lists change hands often",
        bestWhen: "Reps need to pick up a cadence mid-sequence without losing context.",
        icon: "users",
      },
    ],
    buyingFramework: [
      {
        step: 1,
        title: "Design your real cadence first",
        description: "Map the channel mix and timing you actually want, before comparing tools.",
      },
      {
        step: 2,
        title: "Write engagement requirements",
        description: "List call, email, and task needs together, not as separate line items.",
        href: "/guides/crm-requirements-guide/",
        ctaLabel: "Requirements guide →",
      },
      {
        step: 3,
        title: "Trial with a real cadence",
        description: "Build your actual multi-channel sequence in a trial and run it end to end.",
        href: "/guides/crm-trial-evaluation/",
        ctaLabel: "Trial evaluation →",
      },
      {
        step: 4,
        title: "Check cadence-level reporting",
        description: "Confirm you can see response rates by step, not just overall.",
      },
      {
        step: 5,
        title: "Shortlist with Finder",
        description: "Compare sales engagement depth across a fit-based shortlist.",
        href: "/tools/crm-finder/",
        ctaLabel: "Try CRM Finder →",
      },
    ],
    buyingGuideHref: "/guides/how-to-choose-crm/",
    faq: [
      {
        question: "What is sales engagement in a CRM?",
        answer:
          "It's the capability that coordinates email, calls, and tasks into a single multi-channel cadence per prospect, rather than tracking each channel separately.",
      },
      {
        question: "How is sales engagement different from email sequences?",
        answer:
          "Sequences are one channel. Sales engagement coordinates multiple channels — email, calls, tasks — into a cadence.",
      },
      {
        question: "Do we need dedicated sales engagement features, or will basic automation cover it?",
        answer:
          "It depends on channel mix. Pure email outreach needs less structure; multi-channel outreach with calls needs real cadence coordination.",
      },
      {
        question: "How is this different from marketing automation?",
        answer:
          "Sales engagement is individual, rep-driven outreach to specific prospects, not list-based campaign sends.",
      },
      {
        question: "Is there one best CRM for sales engagement?",
        answer: NO_UNIVERSAL_BEST_ANSWER,
      },
    ],
    relatedCapabilitySlugs: ["email", "lead-management", "workflow-automation"],
    relatedUseCaseSlugs: ["sales-engagement", "outbound-sales", "email-outreach", "prospecting"],
    relatedRequirementSlugs: [],
    relatedFeatureSlugs: ["email-sequences", "calling", "email-tracking"],
    featuredGuideHrefs: [
      "/guides/crm-vs-marketing-automation/",
      "/guides/crm-requirements-guide/",
      "/guides/crm-benefits/",
    ],
    heroVisual: {
      src: "/capabilities/sales-engagement-hero-v2.png",
      alt: "Educational diagram of CRM sales engagement showing a multi-channel cadence combining email, calls, and tasks.",
      caption: "Sales engagement coordinates channels into one cadence per prospect.",
    },
    needsVisual: {
      src: "/capabilities/sales-engagement-needs-v2.png",
      alt: "Diagram mapping sales engagement gaps — channel silos, weak call tracking, coverage blind spots — to CRM fixes.",
      caption: "What typically breaks in multi-channel outreach — and how this capability helps.",
    },
    workflowVisual: {
      src: "/capabilities/sales-engagement-workflow-v2.png",
      alt: "Five-step sales engagement workflow: build, enroll, execute, respond, analyze.",
      caption: "How a multi-channel cadence runs from design through response analysis.",
    },
  },

  reporting: {
    displayTitle: "CRM Reporting capability",
    badgeLabel: "Reporting",
    tagline:
      "Dashboards and custom reports that turn CRM activity into something a manager can act on, without needing an analyst.",
    overview:
      "Reporting is the CRM capability for building dashboards and custom reports from CRM data — pipeline by stage, conversion between stages, activity levels, and export for deeper analysis elsewhere. It's distinct from forecasting, which projects a specific future revenue number; reporting describes what has happened or is happening now.",
    whoThisIsFor:
      "Sales managers, RevOps, and leadership who need CRM data to answer real questions in a review, without rebuilding the numbers in a spreadsheet first.",
    whatMattersIntro:
      "Evaluate whether a manager can build a report without administrator help, what fields reports can be built on, and how dashboards get shared — not the number of preset report templates.",
    workedExample:
      "Worked example: a manager who used to rebuild pipeline numbers in a spreadsheet before every Monday review. As a capability, reporting needs to let that manager build and save a stage-by-stage pipeline view directly in the CRM, without waiting on an administrator or exporting to Excel first.",
    workedExampleSecondary:
      "Worked example: a leadership team that wants activity levels alongside pipeline data to explain a slow quarter. Reporting as a capability needs to combine activity — calls, emails, meetings — with pipeline metrics in the same report, not two separate exports that have to be manually reconciled.",
    glance: {
      primaryGoal: "Turn CRM data into reports and dashboards a manager can build and trust",
      typicalTeam: "Sales managers, RevOps, and leadership",
      commonPriorities: [
        "Self-serve report building",
        "Custom fields and filters in reports",
        "Shareable dashboards",
        "Activity plus pipeline combined",
        "Export for BI",
      ],
    },
    challenges: [
      {
        id: "admin-bottleneck",
        title: "Only an administrator can build a new report",
        pain: "A manager's question waits in a ticket queue instead of getting answered.",
        crmHelps: "Self-serve report builders let managers answer their own questions.",
      },
      {
        id: "stale-numbers",
        title: "Numbers in a review are already stale",
        pain: "Reports get rebuilt in a spreadsheet, so what's discussed lags reality.",
        crmHelps: "Live dashboards reflect current data instead of a snapshot from last week.",
      },
      {
        id: "narrow-report-fields",
        title: "Reports can only use a small set of default fields",
        pain: "The custom fields your team actually tracks aren't reportable.",
        crmHelps: "Reporting on custom fields lets you measure what actually matters to your process.",
      },
      {
        id: "disconnected-activity",
        title: "Activity data lives apart from pipeline data",
        pain: "You can't see whether low activity explains a slow pipeline.",
        crmHelps: "Combined activity and pipeline reporting connects cause and effect.",
      },
    ],
    outcomes: [
      {
        id: "self-serve",
        title: "Managers answer their own questions",
        description: "Report building doesn't wait on an administrator.",
      },
      {
        id: "live-numbers",
        title: "Numbers reflect current reality",
        description: "Dashboards replace stale, manually rebuilt spreadsheets.",
      },
      {
        id: "measure-what-matters",
        title: "Reportable on the fields you actually track",
        description: "Custom fields feed reports, not just default ones.",
      },
      {
        id: "connected-view",
        title: "Activity and pipeline in one view",
        description: "See what's driving results, not just the results themselves.",
      },
    ],
    capabilityNeeds: [
      {
        id: "custom-reports",
        title: "Custom report building",
        description: "Build reports on your own fields, filters, and groupings.",
        priority: "must",
        href: "/features/reporting-dashboards/",
      },
      {
        id: "dashboards",
        title: "Dashboards",
        description: "Give each role a standing view of the numbers they own.",
        priority: "must",
        href: "/features/reporting-dashboards/",
      },
      {
        id: "pipeline-reporting",
        title: "Pipeline and conversion reporting",
        description: "Measure stage movement, not just current totals.",
        priority: "must",
        href: "/capabilities/pipeline-management/",
      },
      {
        id: "activity-reporting",
        title: "Activity reporting alongside pipeline",
        description: "Explain pipeline changes with call and email activity.",
        priority: "nice",
        href: "/features/analytics/",
      },
      {
        id: "export-bi",
        title: "Export or BI connection",
        description: "Get data out when reporting needs outgrow the CRM.",
        priority: "nice",
        href: "/capabilities/integrations/",
      },
    ],
    workflowSteps: [
      { id: "define", label: "Define", detail: "Decide the question a report or dashboard must answer." },
      {
        id: "build",
        label: "Build",
        detail: "A report is built on the relevant fields, filters, and groupings.",
      },
      { id: "share", label: "Share", detail: "Dashboards are shared or scheduled to the people who need them." },
      { id: "review", label: "Review", detail: "The team reviews live numbers in a regular cadence." },
      { id: "refine", label: "Refine", detail: "Reports get adjusted as the questions that matter change." },
    ],
    priorities: [
      {
        id: "self-serve-building",
        title: "Self-serve report building",
        description: "Managers shouldn't need an administrator to answer a question.",
        icon: "settings",
      },
      {
        id: "field-coverage",
        title: "Reports on your actual fields",
        description: "Custom fields need to be reportable, not just stored.",
        icon: "database",
      },
      {
        id: "shareable-dashboards",
        title: "Dashboards that can be shared and scheduled",
        description: "A great report nobody sees doesn't help a review.",
        icon: "chart",
      },
      {
        id: "activity-context",
        title: "Activity data next to pipeline data",
        description: "Understand why results look the way they do, not just what they are.",
        icon: "clock",
      },
    ],
    scenarios: [
      {
        id: "weekly-reviews",
        title: "Weekly pipeline or performance reviews",
        bestWhen: "A manager needs current, trusted numbers on a regular cadence.",
        icon: "chart",
        href: "/use-cases/reporting/",
      },
      {
        id: "leaving-spreadsheet-reports",
        title: "Reports currently live in spreadsheets",
        bestWhen: "Numbers get manually rebuilt before every review.",
        icon: "database",
        href: "/guides/crm-vs-spreadsheet/",
      },
      {
        id: "cross-functional-visibility",
        title: "Leadership needs cross-functional visibility",
        bestWhen: "Sales, marketing, or finance stakeholders need the same shared numbers.",
        icon: "users",
      },
    ],
    buyingFramework: [
      {
        step: 1,
        title: "Start from the questions you need answered",
        description: "List the decisions a report or dashboard must support before building anything.",
      },
      {
        step: 2,
        title: "Confirm self-serve report building",
        description: "Check whether a manager, not just an admin, can build and edit reports.",
        href: "/guides/crm-requirements-guide/",
        ctaLabel: "Requirements guide →",
      },
      {
        step: 3,
        title: "Trial with your real custom fields",
        description: "Build a report using the specific fields your team tracks, not default ones.",
        href: "/guides/crm-trial-evaluation/",
        ctaLabel: "Trial evaluation →",
      },
      {
        step: 4,
        title: "Check export and BI options",
        description: "Confirm what happens once reporting needs outgrow native dashboards.",
      },
      {
        step: 5,
        title: "Shortlist with Finder",
        description: "Compare reporting depth across a fit-based shortlist.",
        href: "/tools/crm-finder/",
        ctaLabel: "Try CRM Finder →",
      },
    ],
    buyingGuideHref: "/guides/how-to-choose-crm/",
    faq: [
      {
        question: "What is reporting in a CRM?",
        answer:
          "It's the capability for building dashboards and custom reports from CRM data — pipeline, conversion, and activity — to describe what has happened or is currently happening.",
      },
      {
        question: "What's the difference between reporting and forecasting?",
        answer:
          "Reporting describes what has happened or is happening now. Forecasting projects a future outcome from that data.",
      },
      {
        question: "Do we need a BI tool as well?",
        answer:
          "Usually not at first. It becomes worthwhile once you need CRM data joined to finance or product data, or history beyond what the CRM retains.",
      },
      {
        question: "Can a manager build reports without IT help?",
        answer:
          "It depends on the product — confirm self-serve capability directly, since it varies significantly between platforms.",
      },
      {
        question: "Is there one best CRM for reporting?",
        answer: NO_UNIVERSAL_BEST_ANSWER,
      },
    ],
    relatedCapabilitySlugs: ["forecasting", "pipeline-management", "ai-assistance"],
    relatedUseCaseSlugs: ["reporting", "sales-forecasting"],
    relatedRequirementSlugs: [],
    relatedFeatureSlugs: ["reporting-dashboards", "analytics"],
    featuredGuideHrefs: [
      "/guides/crm-roi-guide/",
      "/guides/crm-requirements-guide/",
      "/guides/how-crm-works/",
    ],
    heroVisual: {
      src: "/capabilities/reporting-hero-v2.png",
      alt: "Educational diagram of CRM reporting showing a dashboard built from pipeline, conversion, and activity data.",
      caption: "Reporting turns CRM activity into decisions a manager can act on.",
    },
    needsVisual: {
      src: "/capabilities/reporting-needs-v2.png",
      alt: "Diagram mapping reporting gaps — admin bottlenecks, stale numbers, narrow fields, disconnected activity — to CRM fixes.",
      caption: "What typically breaks in CRM reporting — and how this capability helps.",
    },
    workflowVisual: {
      src: "/capabilities/reporting-workflow-v2.png",
      alt: "Five-step reporting workflow: define, build, share, review, refine.",
      caption: "How a report goes from a real question to a trusted, shared dashboard.",
    },
  },

  forecasting: {
    displayTitle: "CRM Forecasting capability",
    badgeLabel: "Forecasting",
    tagline:
      "A forward revenue view built from pipeline data — as trustworthy as the stage and close-date discipline behind it.",
    overview:
      "Forecasting is the CRM capability that projects future revenue from pipeline data, using stage-weighted probability, manual rep commitments, or a combination. It's a distinct capability from reporting: reporting describes the present, forecasting projects forward — and a forecast is only as reliable as the close dates and stage discipline feeding it.",
    whoThisIsFor:
      "Sales leaders, RevOps, and finance stakeholders who need a forward revenue number for planning, not just a description of current pipeline.",
    whatMattersIntro:
      "Evaluate the forecasting method (weighted stage, manual commit, or both) and how forecasts compare to actuals over time — not the sophistication of the underlying algorithm, which the CRM rarely lets you inspect anyway.",
    workedExample:
      "Worked example: a sales team whose forecast used to be a gut-feel number announced in a meeting. As a capability, forecasting needs to build a projection from actual pipeline data — weighted by stage probability — so the number can be explained and defended, not just asserted.",
    workedExampleSecondary:
      "Worked example: a team that wants reps to commit numbers manually, separate from the stage-weighted default. Forecasting needs to support a manual commit layer alongside the calculated one, so leadership can see both the system's math and the rep's judgment.",
    glance: {
      primaryGoal: "A forward revenue projection built from real pipeline data, not a guess",
      typicalTeam: "Sales leaders, RevOps, and finance",
      commonPriorities: [
        "Forecasting method (weighted / commit)",
        "Forecast accuracy tracking",
        "Close-date discipline as an input",
        "Category rollups (best case / commit / pipeline)",
        "Historical comparison",
      ],
    },
    challenges: [
      {
        id: "gut-feel-numbers",
        title: "The forecast is a gut-feel number, not a calculation",
        pain: "Leadership can't explain or defend the number when finance asks how it was derived.",
        crmHelps: "Stage-weighted forecasting builds the number from actual pipeline data.",
      },
      {
        id: "no-manual-layer",
        title: "No way to layer rep judgment onto the calculated number",
        pain: "Reps have context the math doesn't capture, but there's nowhere to record it.",
        crmHelps:
          "Manual commit categories let reps state their own confidence alongside the system calculation.",
      },
      {
        id: "garbage-in",
        title: "Forecasts inherit bad close-date and stage hygiene",
        pain: "A sophisticated forecasting engine still produces nonsense from unmaintained data.",
        crmHelps: "Forecasting exposes data-quality problems — which is a feature, not a flaw, if you act on it.",
      },
      {
        id: "no-accuracy-tracking",
        title: "Nobody tracks whether past forecasts were accurate",
        pain: "The same forecasting mistakes repeat quarter after quarter.",
        crmHelps: "Forecast-vs-actual tracking over time shows whether the method is trustworthy.",
      },
    ],
    outcomes: [
      {
        id: "explainable-number",
        title: "A forecast you can explain and defend",
        description: "The number traces back to real pipeline data, not a feeling.",
      },
      {
        id: "layered-judgment",
        title: "Room for rep judgment, visibly separate from the math",
        description: "Manual commits sit alongside, not instead of, the calculated forecast.",
      },
      {
        id: "hygiene-visibility",
        title: "Data problems surface instead of hiding",
        description: "Bad close dates and stale stages become visible through the forecast.",
      },
      {
        id: "improving-accuracy",
        title: "A forecast that gets more accurate over time",
        description: "Tracking forecast-vs-actual builds trust in the method.",
      },
    ],
    capabilityNeeds: [
      {
        id: "weighted-forecast",
        title: "Stage-weighted forecast calculation",
        description: "Project revenue using stage probability against pipeline value.",
        priority: "must",
        href: "/features/forecasting/",
      },
      {
        id: "close-date-inputs",
        title: "Close date and value as forecast inputs",
        description: "The forecast should read directly from deal record fields.",
        priority: "must",
        href: "/capabilities/deal-management/",
      },
      {
        id: "forecast-categories",
        title: "Forecast categories (commit / best case / pipeline)",
        description: "Distinguish confidence levels rather than one flat number.",
        priority: "must",
      },
      {
        id: "manual-commit",
        title: "Manual rep commit layer",
        description: "Let reps state their own number alongside the calculated one.",
        priority: "nice",
      },
      {
        id: "accuracy-tracking",
        title: "Forecast-vs-actual tracking",
        description: "See how forecast accuracy trends over time.",
        priority: "nice",
        href: "/capabilities/reporting/",
      },
    ],
    workflowSteps: [
      {
        id: "maintain-pipeline",
        label: "Maintain",
        detail: "Reps keep stage, value, and close date current on open deals.",
      },
      { id: "calculate", label: "Calculate", detail: "The system weights pipeline value by stage probability." },
      { id: "commit", label: "Commit", detail: "Reps optionally add a manual commitment layer." },
      { id: "review", label: "Review", detail: "Leadership reviews the forecast against target and history." },
      {
        id: "reconcile",
        label: "Reconcile",
        detail: "Actuals get compared to the forecast after the period closes.",
      },
    ],
    priorities: [
      {
        id: "method-fit",
        title: "A forecasting method that fits how you sell",
        description: "Weighted-stage, manual commit, or both — pick what your process actually supports.",
        icon: "trending",
      },
      {
        id: "data-discipline",
        title: "Close-date and stage discipline as a prerequisite",
        description: "No forecasting feature fixes unmaintained pipeline data.",
        icon: "database",
      },
      {
        id: "category-clarity",
        title: "Clear forecast categories",
        description: "Commit, best case, and pipeline should mean something specific, not blur together.",
        icon: "layers",
      },
      {
        id: "accuracy-over-time",
        title: "Tracking accuracy over time",
        description: "A forecast method should get more trustworthy, not stay static.",
        icon: "chart",
        href: "/capabilities/reporting/",
      },
    ],
    scenarios: [
      {
        id: "board-level-forecasting",
        title: "Forecasts feed board or investor reporting",
        bestWhen: "The number needs to be explainable, not just stated.",
        icon: "chart",
        href: "/use-cases/sales-forecasting/",
      },
      {
        id: "rep-commit-culture",
        title: "Reps traditionally commit numbers themselves",
        bestWhen: "You want to preserve rep judgment alongside a calculated baseline.",
        icon: "users",
      },
      {
        id: "improving-hygiene",
        title: "You're actively fixing pipeline data hygiene",
        bestWhen: "Forecasting can double as a forcing function for close-date discipline.",
        icon: "check",
        href: "/capabilities/pipeline-management/",
      },
    ],
    buyingFramework: [
      {
        step: 1,
        title: "Get pipeline hygiene right first",
        description: "Forecasting quality can't exceed the close-date and stage discipline feeding it.",
      },
      {
        step: 2,
        title: "Decide which forecasting method you need",
        description: "Weighted-stage, manual commit, or both — write this down explicitly.",
        href: "/guides/crm-requirements-guide/",
        ctaLabel: "Requirements guide →",
      },
      {
        step: 3,
        title: "Trial with real historical deals",
        description: "Run the forecast against deals you already know the outcome of, to sanity-check it.",
        href: "/guides/crm-trial-evaluation/",
        ctaLabel: "Trial evaluation →",
      },
      {
        step: 4,
        title: "Check forecast category configurability",
        description:
          "Confirm whether commit, best case, and pipeline categories can be defined to match your process.",
      },
      {
        step: 5,
        title: "Shortlist with Finder",
        description: "Compare forecasting depth across a fit-based shortlist.",
        href: "/tools/crm-finder/",
        ctaLabel: "Try CRM Finder →",
      },
    ],
    buyingGuideHref: "/guides/how-to-choose-crm/",
    faq: [
      {
        question: "What is forecasting in a CRM?",
        answer:
          "It's the capability that projects future revenue from pipeline data, using stage-weighted probability, manual commits, or both.",
      },
      {
        question: "How is forecasting different from reporting?",
        answer: "Reporting describes the present state of pipeline. Forecasting projects a future number from it.",
      },
      {
        question: "Can we trust a CRM's forecast?",
        answer:
          "Only as far as the underlying data. Forecasts inherit whatever discipline exists around close dates, deal values, and stage hygiene.",
      },
      {
        question: "Do we need forecasting on day one?",
        answer:
          "No — get honest pipeline hygiene first. Forecasting quality follows data quality, not the other way around.",
      },
      {
        question: "Is there one best CRM for forecasting?",
        answer: NO_UNIVERSAL_BEST_ANSWER,
      },
    ],
    relatedCapabilitySlugs: ["reporting", "pipeline-management", "deal-management"],
    relatedUseCaseSlugs: ["sales-forecasting", "pipeline-management"],
    relatedRequirementSlugs: [],
    relatedFeatureSlugs: ["forecasting", "reporting-dashboards", "analytics"],
    featuredGuideHrefs: [
      "/guides/crm-roi-guide/",
      "/guides/crm-requirements-guide/",
      "/guides/do-i-need-a-crm/",
    ],
    heroVisual: {
      src: "/capabilities/forecasting-hero-v2.png",
      alt: "Educational diagram of CRM forecasting showing pipeline data weighted by stage probability into a forward revenue projection.",
      caption: "Forecasting projects a forward number from pipeline data — as good as the data behind it.",
    },
    needsVisual: {
      src: "/capabilities/forecasting-needs-v2.png",
      alt: "Diagram mapping forecasting gaps — gut-feel numbers, no manual layer, bad hygiene, no accuracy tracking — to CRM fixes.",
      caption: "What typically breaks in revenue forecasting — and how this capability helps.",
    },
    workflowVisual: {
      src: "/capabilities/forecasting-workflow-v2.png",
      alt: "Five-step forecasting workflow: maintain, calculate, commit, review, reconcile.",
      caption: "How a forecast moves from pipeline data to a reconciled, trustworthy number.",
    },
  },

  customization: {
    displayTitle: "CRM Customization capability",
    badgeLabel: "Customization",
    tagline:
      "Custom fields, layouts, and objects that let the CRM match your actual process — not the vendor's generic template.",
    overview:
      "Customization is the CRM capability for adapting the data model and interface to your business: custom fields, page layouts, and in more advanced platforms, custom objects entirely. It's the difference between forcing your process into the vendor's default and shaping the software to fit what you actually track and do.",
    whoThisIsFor:
      "Sales ops, RevOps, and administrators who need the CRM's data model to reflect specifics the default fields don't capture — industry-specific attributes, unusual sales stages, or entirely custom record types.",
    whatMattersIntro:
      "Evaluate how many custom fields are allowed, on which record types, and whether custom objects are possible — not how attractive the customization UI looks in a demo. Plan-tier limits on custom fields are a common and easy-to-miss constraint.",
    workedExample:
      "Worked example: a specialty distributor that needs to track certification expiry dates on customer accounts. As a capability, customization needs to support a custom date field on the account record with reminder logic attached — a generic CRM without extensible fields has no honest place to put that.",
    workedExampleSecondary:
      "Worked example: a company selling both products and services with very different sales cycles. Customization at the platform level might need custom objects entirely — not just fields on the standard contact or deal model — to represent something structurally different from a typical deal.",
    glance: {
      primaryGoal: "Adapt the CRM's data model and layout to match your real process",
      typicalTeam: "Sales ops, RevOps, and CRM administrators",
      commonPriorities: [
        "Custom field types and limits",
        "Layout and view customization",
        "Custom objects (advanced)",
        "Plan-tier limits",
        "Who can make changes",
      ],
    },
    challenges: [
      {
        id: "generic-fields",
        title: "Standard fields don't capture what your business tracks",
        pain: "Industry-specific or process-specific attributes have nowhere to live.",
        crmHelps: "Custom fields let you add exactly the attributes your process depends on.",
      },
      {
        id: "fixed-layouts",
        title: "Record layouts show fields you don't use and hide ones you do",
        pain: "Users scroll past irrelevant fields to find the ones that matter.",
        crmHelps:
          "Layout customization surfaces the fields your team actually needs, in the order they need them.",
      },
      {
        id: "no-custom-objects",
        title: "Your business has a record type the standard model doesn't represent",
        pain: "Contacts, accounts, and deals don't map cleanly onto what you actually sell or manage.",
        crmHelps: "Custom objects, on platforms that support them, model genuinely different record types.",
      },
      {
        id: "hidden-plan-limits",
        title: "Custom field limits are lower than expected",
        pain: "A plan caps custom fields well below what your process needs, discovered mid-implementation.",
        crmHelps: "Confirming limits before purchase avoids an expensive mid-rollout surprise.",
      },
    ],
    outcomes: [
      {
        id: "fields-that-fit",
        title: "Fields that match your real process",
        description: "No more forcing specific attributes into a generic notes field.",
      },
      {
        id: "cleaner-layouts",
        title: "Layouts showing what your team actually uses",
        description: "Less scrolling past irrelevant default fields.",
      },
      {
        id: "modeled-record-types",
        title: "Record types that reflect your business",
        description: "Custom objects represent what's structurally different about how you operate.",
      },
      {
        id: "no-surprise-limits",
        title: "No mid-rollout limit surprises",
        description: "Field and object limits are known and planned for upfront.",
      },
    ],
    capabilityNeeds: [
      {
        id: "custom-fields-types",
        title: "Custom field types",
        description: "Text, number, date, dropdown, and relationship fields as standard options.",
        priority: "must",
        href: "/features/custom-fields/",
      },
      {
        id: "layout-editing",
        title: "Page layout customization",
        description: "Control which fields appear, and in what order, on each record type.",
        priority: "must",
      },
      {
        id: "field-permissions",
        title: "Field-level permissions",
        description: "Decide who can view or edit specific custom fields.",
        priority: "must",
        href: "/capabilities/security/",
      },
      {
        id: "custom-objects",
        title: "Custom objects",
        description: "Model entirely new record types beyond contacts, accounts, and deals.",
        priority: "nice",
      },
      {
        id: "formula-fields",
        title: "Formula or calculated fields",
        description: "Derive values automatically instead of relying on manual entry.",
        priority: "nice",
      },
    ],
    workflowSteps: [
      {
        id: "identify-gap",
        label: "Identify",
        detail: "A process attribute has no honest home in the default data model.",
      },
      {
        id: "design-field",
        label: "Design",
        detail: "A custom field, layout change, or object is planned to fill the gap.",
      },
      { id: "configure", label: "Configure", detail: "An administrator builds the change without needing a developer." },
      { id: "adopt", label: "Adopt", detail: "The team starts using the new field or layout in daily work." },
      {
        id: "govern",
        label: "Govern",
        detail: "Someone owns field definitions so customization doesn't sprawl unchecked.",
      },
    ],
    priorities: [
      {
        id: "real-limits",
        title: "Real, plan-specific field and object limits",
        description: "Confirm actual caps, not marketing language about \"flexibility\".",
        icon: "settings",
      },
      {
        id: "no-code-config",
        title: "Configuration without a developer",
        description: "An administrator should be able to make most changes directly.",
        icon: "code",
      },
      {
        id: "governance",
        title: "Ownership over field sprawl",
        description: "Unmanaged customization becomes as messy as the spreadsheet it replaced.",
        icon: "shield",
      },
      {
        id: "layout-clarity",
        title: "Layouts that reduce noise, not add it",
        description: "More fields available shouldn't mean more clutter on every screen.",
        icon: "layers",
      },
    ],
    scenarios: [
      {
        id: "industry-specific-data",
        title: "Industry-specific attributes need tracking",
        bestWhen: "Standard fields don't capture something specific to your sector or process.",
        icon: "database",
      },
      {
        id: "complex-record-types",
        title: "Your business has genuinely different record types",
        bestWhen: "Contacts, accounts, and deals don't map onto everything you manage.",
        icon: "layers",
        href: "/use-cases/complex-sales-processes/",
      },
      {
        id: "outgrowing-defaults",
        title: "You're outgrowing the vendor's default setup",
        bestWhen: "The out-of-the-box configuration increasingly fights how your team works.",
        icon: "settings",
      },
    ],
    buyingFramework: [
      {
        step: 1,
        title: "List the fields your default setup is missing",
        description: "Identify specific gaps in the standard data model before evaluating platforms.",
      },
      {
        step: 2,
        title: "Confirm field and object limits by plan",
        description: "Get exact numbers, not general statements about flexibility.",
        href: "/guides/crm-requirements-guide/",
        ctaLabel: "Requirements guide →",
      },
      {
        step: 3,
        title: "Trial the actual configuration",
        description: "Build your real custom fields and layouts in a trial, not a hypothetical.",
        href: "/guides/crm-trial-evaluation/",
        ctaLabel: "Trial evaluation →",
      },
      {
        step: 4,
        title: "Name a configuration owner",
        description: "Decide who owns field definitions and layout decisions before go-live.",
      },
      {
        step: 5,
        title: "Shortlist with Finder",
        description: "Compare customization depth across a fit-based shortlist.",
        href: "/tools/crm-finder/",
        ctaLabel: "Try CRM Finder →",
      },
    ],
    buyingGuideHref: "/guides/how-to-choose-crm/",
    faq: [
      {
        question: "What does customization mean in a CRM?",
        answer:
          "It's the capability for adapting the data model and interface — custom fields, layouts, and sometimes custom objects — to match your real process.",
      },
      {
        question: "How many custom fields do we need?",
        answer:
          "Only as many as your process genuinely requires. Field count itself isn't the goal — fit is.",
      },
      {
        question: "What's the difference between custom fields and custom objects?",
        answer:
          "Fields add attributes to existing record types. Objects create genuinely new record types beyond contacts, accounts, and deals.",
      },
      {
        question: "Who should own customization decisions?",
        answer: "A named administrator, to prevent field sprawl and layout drift over time.",
      },
      {
        question: "Is there one best CRM for customization?",
        answer: NO_UNIVERSAL_BEST_ANSWER,
      },
    ],
    relatedCapabilitySlugs: ["administration", "integrations", "deal-management"],
    relatedUseCaseSlugs: ["complex-sales-processes", "account-management"],
    relatedRequirementSlugs: [],
    relatedFeatureSlugs: ["custom-fields"],
    featuredGuideHrefs: [
      "/guides/crm-requirements-guide/",
      "/guides/common-crm-mistakes/",
      "/guides/types-of-crm/",
    ],
    heroVisual: {
      src: "/capabilities/customization-hero-v2.png",
      alt: "Educational diagram of CRM customization showing custom fields, layout changes, and a custom object.",
      caption: "Customization adapts the CRM's data model to match your real process.",
    },
    needsVisual: {
      src: "/capabilities/customization-needs-v2.png",
      alt: "Diagram mapping customization gaps — generic fields, fixed layouts, missing object types, hidden plan limits — to CRM fixes.",
      caption: "What typically breaks when a CRM's default setup doesn't match your business.",
    },
    workflowVisual: {
      src: "/capabilities/customization-workflow-v2.png",
      alt: "Five-step customization workflow: identify, design, configure, adopt, govern.",
      caption: "How a configuration gap becomes a governed, adopted change.",
    },
  },

  integrations: {
    displayTitle: "CRM Integrations capability",
    badgeLabel: "Integrations",
    tagline: "Native connectors and API access that keep the CRM synced with the tools your team already works in.",
    overview:
      "Integrations is the CRM capability covering how the software connects to everything else — email and calendar, native app connectors for your stack, and API access for anything without a prebuilt connector. It decides whether the CRM reflects reality automatically or becomes one more place to re-enter data.",
    whoThisIsFor:
      "RevOps, IT, and sales ops evaluating whether a CRM will connect cleanly to an existing tool stack — not just whether it has an integration marketplace with a large number of listings.",
    whatMattersIntro:
      "Evaluate depth and direction of the integrations you'll actually use, plus API access and limits — not the total count of listed connectors. A short list of deep, well-maintained integrations beats a long list of shallow ones.",
    workedExample:
      "Worked example: a team whose CRM and accounting system both hold customer records. As a capability, integrations need real two-way sync with a clear conflict rule — otherwise invoices and CRM records drift out of sync and someone has to manually reconcile them.",
    workedExampleSecondary:
      "Worked example: a company using a niche industry tool with no native connector. Integrations as a capability needs a usable API with reasonable rate limits, so a custom connection can be built — otherwise that system stays permanently disconnected from the CRM.",
    glance: {
      primaryGoal: "Connect the CRM to the tools your team already depends on, without manual re-entry",
      typicalTeam: "RevOps, IT, and sales ops",
      commonPriorities: [
        "Native integration depth",
        "Sync direction and conflict rules",
        "API access and limits",
        "Webhook support",
        "Integration monitoring",
      ],
    },
    challenges: [
      {
        id: "shallow-connectors",
        title: "A native integration exists but barely does anything",
        pain: "The connector syncs one field when you need five, so manual work continues anyway.",
        crmHelps: "Checking real integration depth in a trial reveals what actually syncs versus what's marketed.",
      },
      {
        id: "sync-conflicts",
        title: "Two systems disagree and nobody set a tiebreaker",
        pain: "Bidirectional sync creates conflicting updates with no clear rule for which wins.",
        crmHelps: "Explicit conflict rules — a source of truth per field — prevent silent data corruption.",
      },
      {
        id: "no-connector-for-niche-tool",
        title: "A tool in your stack has no native connector",
        pain: "That system stays disconnected, and data has to move manually.",
        crmHelps: "API access lets you build a custom connection where no native one exists.",
      },
      {
        id: "silent-failures",
        title: "Integration failures happen silently",
        pain: "A connection breaks and nobody notices until data has been stale for weeks.",
        crmHelps: "Monitoring and failure alerts surface broken connections before they cause real damage.",
      },
    ],
    outcomes: [
      {
        id: "no-retyping",
        title: "No more re-entering the same data twice",
        description: "Real integration depth eliminates manual reconciliation.",
      },
      {
        id: "reliable-conflict-rules",
        title: "Clear rules for conflicting updates",
        description: "Sync direction and tiebreakers are explicit, not accidental.",
      },
      {
        id: "extended-reach",
        title: "Reach for tools without native connectors",
        description: "API access extends the CRM to your full stack, not just the popular parts of it.",
      },
      {
        id: "early-failure-detection",
        title: "Broken connections get noticed quickly",
        description: "Monitoring catches sync failures before data goes stale.",
      },
    ],
    capabilityNeeds: [
      {
        id: "email-calendar-integration",
        title: "Email and calendar integration",
        description: "Sync correspondence and meetings so records stay current automatically.",
        priority: "must",
        href: "/capabilities/email/",
      },
      {
        id: "native-connectors",
        title: "Native connectors for your core stack",
        description: "Prebuilt integrations for the systems your team depends on daily.",
        priority: "must",
        href: "/features/integrations/",
      },
      {
        id: "api-access",
        title: "API access",
        description: "Build custom connections where no native integration exists.",
        priority: "must",
      },
      {
        id: "two-way-sync",
        title: "Two-way sync with conflict rules",
        description: "Confirm which system wins when both sides update the same field.",
        priority: "nice",
      },
      {
        id: "integration-monitoring",
        title: "Integration failure monitoring",
        description: "Get alerted when a connection breaks, instead of finding out weeks later.",
        priority: "nice",
        href: "/capabilities/security/",
      },
    ],
    workflowSteps: [
      { id: "inventory", label: "Inventory", detail: "List every system that holds relevant customer or deal data." },
      { id: "connect", label: "Connect", detail: "Native connectors or API integrations link priority systems." },
      {
        id: "define-truth",
        label: "Define",
        detail: "Source-of-truth rules are set for any field shared across systems.",
      },
      { id: "sync", label: "Sync", detail: "Data flows automatically instead of being re-entered by hand." },
      { id: "monitor", label: "Monitor", detail: "An owner watches for sync failures and stale connections." },
    ],
    priorities: [
      {
        id: "real-depth",
        title: "Verified depth, not a marketplace listing",
        description: "Test the specific fields and direction you need in a trial.",
        icon: "puzzle",
      },
      {
        id: "conflict-clarity",
        title: "Explicit conflict resolution rules",
        description: "Know which system wins before bidirectional sync goes live.",
        icon: "settings",
      },
      {
        id: "api-quality",
        title: "Usable API access with reasonable limits",
        description: "Confirm rate limits before planning a custom connection.",
        icon: "code",
      },
      {
        id: "ownership",
        title: "A named integration owner",
        description: "Someone needs to watch connections after go-live, not just set them up.",
        icon: "users",
      },
    ],
    scenarios: [
      {
        id: "core-stack-connection",
        title: "Connecting core daily tools",
        bestWhen: "Email, calendar, and one or two operational systems need to stay in sync.",
        icon: "mail",
        href: "/use-cases/email-outreach/",
      },
      {
        id: "custom-api-need",
        title: "A niche tool has no native connector",
        bestWhen: "API access is the only realistic path to connect a system in your stack.",
        icon: "code",
      },
      {
        id: "field-heavy-outreach",
        title: "Field teams need mobile-connected systems",
        bestWhen: "Sync has to work reliably for people not at a desk.",
        icon: "puzzle",
        href: "/use-cases/field-sales/",
      },
    ],
    buyingFramework: [
      {
        step: 1,
        title: "Inventory your real stack",
        description: "List every system that currently holds customer data.",
      },
      {
        step: 2,
        title: "Rank integrations by daily use",
        description: "Prioritize what the team touches every day over rarely-used connections.",
        href: "/guides/crm-requirements-guide/",
        ctaLabel: "Requirements guide →",
      },
      {
        step: 3,
        title: "Verify depth in a trial",
        description: "Test the actual fields and sync direction you need, not just that a connector exists.",
        href: "/guides/crm-trial-evaluation/",
        ctaLabel: "Trial evaluation →",
      },
      {
        step: 4,
        title: "Ask vendor-specific integration questions",
        description: "Confirm API rate limits, sync frequency, and who maintains each connector.",
        href: "/guides/crm-vendor-questions/",
        ctaLabel: "Vendor questions guide →",
      },
      {
        step: 5,
        title: "Shortlist with Finder",
        description: "Compare integration depth across a fit-based shortlist.",
        href: "/tools/crm-finder/",
        ctaLabel: "Try CRM Finder →",
      },
    ],
    buyingGuideHref: "/guides/how-to-choose-crm/",
    faq: [
      {
        question: "What counts as a CRM integration?",
        answer:
          "Any connection — native connector or API-built — that syncs data between the CRM and another system your team uses.",
      },
      {
        question: "Is a large integration marketplace a good sign?",
        answer:
          "Only if it includes your tools and the depth is real. A short list of deep, well-maintained integrations beats a long list of shallow ones.",
      },
      {
        question: "What's the difference between a native integration and the API?",
        answer:
          "A native integration is a supported connector you configure. The API lets you build and maintain a connection yourself.",
      },
      {
        question: "Do integrations cost extra?",
        answer:
          "Sometimes. Premium connectors or API access can sit on higher plans. Confirm before shortlisting.",
      },
      {
        question: "Is there one best CRM for integrations?",
        answer: NO_UNIVERSAL_BEST_ANSWER,
      },
    ],
    relatedCapabilitySlugs: ["security", "administration", "email"],
    relatedUseCaseSlugs: ["email-outreach", "field-sales"],
    relatedRequirementSlugs: [],
    relatedFeatureSlugs: ["integrations", "email-sync"],
    featuredGuideHrefs: [
      "/guides/crm-requirements-guide/",
      "/guides/crm-vendor-questions/",
      "/guides/how-to-choose-crm/",
    ],
    heroVisual: {
      src: "/capabilities/integrations-hero-v2.png",
      alt: "Educational diagram of CRM integrations showing native connectors and an API linking the CRM to other systems.",
      caption: "Integrations connect the CRM to the tools your team already depends on.",
    },
    needsVisual: {
      src: "/capabilities/integrations-needs-v2.png",
      alt: "Diagram mapping integration gaps — shallow connectors, sync conflicts, missing connectors, silent failures — to CRM fixes.",
      caption: "What typically breaks in a connected tool stack — and how this capability helps.",
    },
    workflowVisual: {
      src: "/capabilities/integrations-workflow-v2.png",
      alt: "Five-step integrations workflow: inventory, connect, define, sync, monitor.",
      caption: "How a tool stack gets connected, kept in sync, and monitored.",
    },
  },

  administration: {
    displayTitle: "CRM Administration capability",
    badgeLabel: "Administration",
    tagline: "Configuration, user management, and data governance — the ongoing work of keeping the CRM usable as it grows.",
    overview:
      "Administration is the CRM capability covering how the system gets configured and kept healthy over time: user and role management, field and layout governance, data quality tools, and the ongoing decisions about who can change what. It's distinct from security, which focuses on access control and protection — administration is the operational work of running the platform day to day.",
    whoThisIsFor:
      "Whoever owns the CRM internally — a dedicated administrator, an operations lead, or a founder wearing that hat — responsible for configuration, user management, and keeping the system from decaying into an unmanaged mess.",
    whatMattersIntro:
      "Evaluate how much configuration a non-developer administrator can actually do, and how much ongoing maintenance the platform demands — not the total number of settings available. A highly configurable platform with no named administrator tends to drift out of date.",
    workedExample:
      "Worked example: a growing team where nobody was formally responsible for CRM upkeep. As a capability, administration needs a manageable set of tools for user provisioning, field governance, and data cleanup — so that once someone is named administrator, the work is actually doable without a dedicated engineering resource.",
    workedExampleSecondary:
      "Worked example: a company onboarding and offboarding staff regularly. Administration needs straightforward user provisioning and deprovisioning — so leavers lose access promptly instead of accumulating as orphaned accounts nobody remembers to clean up.",
    glance: {
      primaryGoal: "Keep the CRM configured, current, and well-governed as the team grows",
      typicalTeam: "CRM administrators, operations leads, and IT",
      commonPriorities: [
        "User provisioning and deprovisioning",
        "Role and permission management",
        "Data quality tools",
        "Configuration change tracking",
        "Admin effort required",
      ],
    },
    challenges: [
      {
        id: "no-named-owner",
        title: "Nobody formally owns CRM administration",
        pain: "Configuration drifts and small issues never get fixed because they're nobody's job.",
        crmHelps: "Manageable admin tools make ownership a realistic, doable responsibility.",
      },
      {
        id: "orphaned-accounts",
        title: "Leavers keep access after they've gone",
        pain: "Deprovisioning is manual and gets forgotten, leaving stale accounts active.",
        crmHelps: "Streamlined user provisioning and deprovisioning workflows reduce forgotten steps.",
      },
      {
        id: "unmanaged-fields",
        title: "Fields and layouts accumulate with no governance",
        pain: "Years of ad hoc changes leave the system cluttered and confusing.",
        crmHelps: "Change tracking and field governance tools show what exists and who added it.",
      },
      {
        id: "data-decay",
        title: "Data quality degrades with no cleanup process",
        pain: "Duplicate and stale records accumulate because nobody has a tool or a habit for fixing them.",
        crmHelps: "Built-in data quality tools make cleanup routine rather than a periodic emergency.",
      },
    ],
    outcomes: [
      {
        id: "manageable-ownership",
        title: "Administration that's actually doable",
        description: "A named owner can realistically keep the system healthy.",
      },
      {
        id: "clean-offboarding",
        title: "Access removed promptly when people leave",
        description: "Deprovisioning becomes a checklist, not a memory exercise.",
      },
      {
        id: "governed-configuration",
        title: "Configuration that doesn't drift unchecked",
        description: "Change tracking shows what's been added and by whom.",
      },
      {
        id: "ongoing-data-quality",
        title: "Data quality as routine maintenance",
        description: "Cleanup tools prevent slow decay into an unreliable system.",
      },
    ],
    capabilityNeeds: [
      {
        id: "user-provisioning",
        title: "User provisioning and deprovisioning",
        description: "Add and remove access cleanly as people join and leave.",
        priority: "must",
        href: "/capabilities/security/",
      },
      {
        id: "role-management",
        title: "Role and permission management",
        description: "Assign access by role rather than configuring every user individually.",
        priority: "must",
        href: "/features/role-permissions/",
      },
      {
        id: "config-governance",
        title: "Field and layout governance tools",
        description: "See what configuration exists and who is responsible for it.",
        priority: "must",
      },
      {
        id: "data-quality-tools",
        title: "Data quality and deduplication tools",
        description: "Keep records clean without a manual, periodic scramble.",
        priority: "nice",
      },
      {
        id: "audit-trail",
        title: "Configuration change history",
        description: "See what changed in the system's setup, and when.",
        priority: "nice",
        href: "/features/audit-logs/",
      },
    ],
    workflowSteps: [
      { id: "onboard", label: "Onboard", detail: "New users are provisioned with roles matching their responsibilities." },
      { id: "configure", label: "Configure", detail: "Fields, layouts, and workflows are set up and documented." },
      { id: "maintain", label: "Maintain", detail: "Data quality and configuration are reviewed on a schedule." },
      { id: "offboard", label: "Offboard", detail: "Leavers' access is removed promptly and completely." },
      { id: "audit", label: "Audit", detail: "Periodic review confirms configuration still matches how the team works." },
    ],
    priorities: [
      {
        id: "named-ownership",
        title: "A named administrator",
        description: "Someone specific, not \"whoever has time\", should own this.",
        icon: "users",
      },
      {
        id: "provisioning-hygiene",
        title: "Clean joiner and leaver processes",
        description: "Onboarding and offboarding should be a checklist, not improvisation.",
        icon: "check",
      },
      {
        id: "governance-tools",
        title: "Real governance over configuration",
        description: "Know what exists in the system and why, not just that it works.",
        icon: "settings",
      },
      {
        id: "sustainable-effort",
        title: "Administration effort that fits your team",
        description: "A powerful platform nobody has time to administer isn't actually powerful for you.",
        icon: "clock",
      },
    ],
    scenarios: [
      {
        id: "growing-headcount",
        title: "Headcount is growing and turnover is real",
        bestWhen: "Onboarding and offboarding volume makes manual provisioning risky.",
        icon: "users",
        href: "/use-cases/account-management/",
      },
      {
        id: "no-dedicated-admin",
        title: "No dedicated CRM administrator yet",
        bestWhen: "Administration needs to be manageable by someone doing it part-time.",
        icon: "clock",
      },
      {
        id: "configuration-cleanup",
        title: "Configuration has drifted after years of ad hoc changes",
        bestWhen: "Field and layout governance need to catch up with reality.",
        icon: "settings",
        href: "/use-cases/complex-sales-processes/",
      },
    ],
    buyingFramework: [
      {
        step: 1,
        title: "Name an administrator before go-live",
        description: "Decide who owns configuration and access before rollout, not after.",
      },
      {
        step: 2,
        title: "Write down provisioning requirements",
        description: "Document how joiners and leavers should be handled.",
        href: "/guides/crm-requirements-guide/",
        ctaLabel: "Requirements guide →",
      },
      {
        step: 3,
        title: "Estimate real admin effort",
        description: "Ask how much ongoing time the platform actually requires to administer.",
        href: "/guides/crm-vendor-questions/",
        ctaLabel: "Vendor questions guide →",
      },
      {
        step: 4,
        title: "Trial the admin console itself",
        description: "Have your prospective administrator use the settings, not just the sales rep.",
        href: "/guides/crm-trial-evaluation/",
        ctaLabel: "Trial evaluation →",
      },
      {
        step: 5,
        title: "Shortlist with Finder",
        description: "Compare administration overhead across a fit-based shortlist.",
        href: "/tools/crm-finder/",
        ctaLabel: "Try CRM Finder →",
      },
    ],
    buyingGuideHref: "/guides/how-to-choose-crm/",
    faq: [
      {
        question: "What does CRM administration cover?",
        answer:
          "User provisioning and deprovisioning, role and permission management, field and layout governance, and data quality maintenance.",
      },
      {
        question: "Do we need a dedicated administrator?",
        answer:
          "Someone should own it, even part-time. Configuration without a named owner tends to drift out of date.",
      },
      {
        question: "What's the difference between administration and security?",
        answer:
          "Administration is ongoing configuration and user management. Security is access control and data protection specifically.",
      },
      {
        question: "How much admin effort should we expect?",
        answer:
          "It varies by platform configurability. Ask vendors directly and, ideally, trial the admin console yourself before deciding.",
      },
      {
        question: "Is there one best CRM for administration?",
        answer: NO_UNIVERSAL_BEST_ANSWER,
      },
    ],
    relatedCapabilitySlugs: ["security", "customization", "integrations"],
    relatedUseCaseSlugs: ["complex-sales-processes", "account-management"],
    relatedRequirementSlugs: [],
    relatedFeatureSlugs: ["role-permissions", "audit-logs"],
    featuredGuideHrefs: [
      "/guides/crm-requirements-guide/",
      "/guides/crm-vendor-questions/",
      "/guides/common-crm-mistakes/",
    ],
    heroVisual: {
      src: "/capabilities/administration-hero-v2.png",
      alt: "Educational diagram of CRM administration showing user provisioning, role management, and configuration governance.",
      caption: "Administration is the ongoing work of keeping a CRM configured and healthy.",
    },
    needsVisual: {
      src: "/capabilities/administration-needs-v2.png",
      alt: "Diagram mapping administration gaps — no named owner, orphaned accounts, unmanaged fields, data decay — to CRM fixes.",
      caption: "What typically breaks without CRM administration — and how this capability helps.",
    },
    workflowVisual: {
      src: "/capabilities/administration-workflow-v2.png",
      alt: "Five-step administration workflow: onboard, configure, maintain, offboard, audit.",
      caption: "How CRM administration keeps the system healthy across the user lifecycle.",
    },
  },

  security: {
    displayTitle: "CRM Security capability",
    badgeLabel: "Security",
    tagline: "Access control, single sign-on, and audit logging that decide who can see, change, and export customer data.",
    overview:
      "Security is the CRM capability covering access control and data protection: role-based and record-level permissions, single sign-on, audit logging, and export controls. It's distinct from administration, which covers day-to-day configuration and user management — security is specifically about who can see, change, or extract data, and how that's enforced and recorded.",
    whoThisIsFor:
      "IT, security-conscious operations leads, and anyone responsible for answering questions about who has access to what. It matters more as team size, sensitivity of data, or regulatory exposure grows.",
    whatMattersIntro:
      "Evaluate permission granularity, SSO support, and what's actually captured in audit logs — not marketing claims about security posture. This is an evaluation framework, not a compliance verdict — confirm specifics directly with vendors and your own advisers.",
    workedExample:
      "Worked example: a team where a sensitive set of accounts needed to be visible only to two people. As a capability, security needs record-level permissions, not just role-based ones — a role-only model that shows all accounts to \"everyone in Sales\" can't represent that restriction.",
    workedExampleSecondary:
      "Worked example: a company centralizing identity through an SSO provider. Security as a capability needs to support the specific identity protocol the company already uses, and ideally on a plan tier the company can actually afford — SSO is a common feature that gets pushed to higher, sometimes significantly costlier, plans.",
    glance: {
      primaryGoal: "Control exactly who can see, change, and export customer data",
      typicalTeam: "IT, security leads, and CRM administrators",
      commonPriorities: [
        "Role and record-level permissions",
        "Single sign-on support",
        "Audit logging depth",
        "Export controls",
        "Vendor security documentation",
      ],
    },
    challenges: [
      {
        id: "role-only-permissions",
        title: "Permissions only work at the role level",
        pain: "A sensitive record can't be restricted without restricting an entire role's access.",
        crmHelps: "Record and field-level permissions allow narrower, more precise restrictions.",
      },
      {
        id: "manual-identity",
        title: "Users authenticate with separate passwords, not your identity provider",
        pain: "Offboarding means remembering to disable a CRM account separately from everything else.",
        crmHelps: "Single sign-on centralizes authentication and offboarding through your existing identity provider.",
      },
      {
        id: "thin-audit-trail",
        title: "Audit logs don't capture enough to answer real questions",
        pain: "You can't tell who viewed or changed a specific record after the fact.",
        crmHelps: "Deeper audit logging records access and changes for investigation and review.",
      },
      {
        id: "uncontrolled-exports",
        title: "Anyone with basic access can export the whole database",
        pain: "There's no way to see who took a full data export, or when.",
        crmHelps: "Export controls limit and log who can extract bulk data.",
      },
    ],
    outcomes: [
      {
        id: "precise-access",
        title: "Access restricted precisely, not just broadly",
        description: "Record and field-level controls protect sensitive data without over-restricting everyone.",
      },
      {
        id: "centralized-identity",
        title: "Authentication centralized through your identity provider",
        description: "Offboarding becomes one action, not a separate CRM step to remember.",
      },
      {
        id: "investigable-history",
        title: "A real answer to \"who accessed this?\"",
        description: "Audit logs support investigations and access reviews.",
      },
      {
        id: "controlled-exports",
        title: "Bulk exports are visible and controllable",
        description: "You know who can take the whole database out, and when they did.",
      },
    ],
    capabilityNeeds: [
      {
        id: "role-permissions",
        title: "Role-based permissions",
        description: "Grant access by role rather than the same view for everyone.",
        priority: "must",
        href: "/features/role-permissions/",
      },
      {
        id: "record-field-access",
        title: "Record and field-level access control",
        description: "Restrict sensitive records or fields beyond a broad role setting.",
        priority: "must",
      },
      {
        id: "audit-logging",
        title: "Audit logging",
        description: "Keep a record of access and changes for review and investigation.",
        priority: "must",
        href: "/features/audit-logs/",
      },
      {
        id: "sso",
        title: "Single sign-on",
        description: "Authenticate through your identity provider and centralize offboarding.",
        priority: "nice",
        href: "/features/sso/",
      },
      {
        id: "export-controls",
        title: "Export controls",
        description: "Limit and monitor who can extract bulk data.",
        priority: "nice",
      },
    ],
    workflowSteps: [
      { id: "define-roles", label: "Define", detail: "Roles and their appropriate access levels are agreed before assigning users." },
      { id: "restrict", label: "Restrict", detail: "Sensitive records or fields get narrower access where genuinely needed." },
      { id: "authenticate", label: "Authenticate", detail: "Users sign in through SSO where configured, centralizing identity." },
      { id: "log", label: "Log", detail: "Access and changes are recorded in the audit trail automatically." },
      { id: "review", label: "Review", detail: "Access and logs are reviewed periodically, not just set once." },
    ],
    priorities: [
      {
        id: "granularity-vs-maintainability",
        title: "Granular enough, without becoming unmanageable",
        description: "Very fine-grained permissions are precise but can get hard to reason about.",
        icon: "shield",
      },
      {
        id: "sso-fit",
        title: "SSO that matches your identity provider",
        description: "Confirm the specific protocol and provider support, and the plan tier it requires.",
        icon: "key",
      },
      {
        id: "meaningful-audit-depth",
        title: "Audit logs that answer real questions",
        description: "Check what's actually captured, not just that logging exists.",
        icon: "clock",
      },
      {
        id: "export-visibility",
        title: "Visibility into bulk data exports",
        description: "Know who can take the whole database, and see when they do.",
        icon: "database",
      },
    ],
    scenarios: [
      {
        id: "sensitive-account-restriction",
        title: "Some accounts need restricted visibility",
        bestWhen: "Not every team member should see every record, even within one role.",
        icon: "lock",
      },
      {
        id: "identity-provider-centralization",
        title: "You centralize authentication through an identity provider",
        bestWhen: "SSO reduces password sprawl and speeds up offboarding.",
        icon: "key",
      },
      {
        id: "access-review-requirements",
        title: "You need to answer access-review questions",
        bestWhen: "An investigation or compliance process asks who accessed specific data.",
        icon: "clock",
      },
    ],
    buyingFramework: [
      {
        step: 1,
        title: "Map who needs access to what",
        description: "Define sensitivity levels and access needs before evaluating permission models.",
      },
      {
        step: 2,
        title: "Confirm SSO support and plan tier",
        description: "Check the specific identity protocol supported and what plan it requires.",
        href: "/guides/crm-requirements-guide/",
        ctaLabel: "Requirements guide →",
      },
      {
        step: 3,
        title: "Ask what's actually in the audit log",
        description: "Get specifics on captured events and retention period, not a general claim.",
        href: "/guides/crm-vendor-questions/",
        ctaLabel: "Vendor questions guide →",
      },
      {
        step: 4,
        title: "Request security documentation directly",
        description: "Ask vendors for their security and compliance documentation rather than relying on marketing pages.",
      },
      {
        step: 5,
        title: "Shortlist with Finder",
        description: "Compare security capability depth across a fit-based shortlist.",
        href: "/tools/crm-finder/",
        ctaLabel: "Try CRM Finder →",
      },
    ],
    buyingGuideHref: "/guides/how-to-choose-crm/",
    faq: [
      {
        question: "What does CRM security cover?",
        answer:
          "Role and record-level access control, single sign-on, audit logging, and export controls — who can see, change, and extract customer data.",
      },
      {
        question: "Do we need single sign-on?",
        answer:
          "It becomes valuable once you have an identity provider and enough users that manual account management is a risk. It's often gated to higher plans.",
      },
      {
        question: "What should audit logs capture?",
        answer: "At minimum, who accessed or changed a record and when. Confirm specifics per vendor.",
      },
      {
        question: "Does strong security functionality mean a CRM is compliant?",
        answer:
          "No. Compliance depends on your obligations, configuration, and contracts. This is an evaluation framework — verify regulatory requirements with vendors and your own advisers.",
      },
      {
        question: "Is there one best CRM for security?",
        answer: NO_UNIVERSAL_BEST_ANSWER,
      },
    ],
    relatedCapabilitySlugs: ["administration", "integrations", "contact-management"],
    relatedUseCaseSlugs: ["account-management", "complex-sales-processes"],
    relatedRequirementSlugs: [],
    relatedFeatureSlugs: ["sso", "audit-logs", "role-permissions"],
    featuredGuideHrefs: [
      "/guides/crm-vendor-questions/",
      "/guides/crm-requirements-guide/",
      "/guides/how-to-choose-crm/",
    ],
    heroVisual: {
      src: "/capabilities/security-hero-v2.png",
      alt: "Educational diagram of CRM security showing role-based permissions, SSO, and an audit log.",
      caption: "Security controls who can see, change, and export customer data.",
    },
    needsVisual: {
      src: "/capabilities/security-needs-v2.png",
      alt: "Diagram mapping security gaps — role-only permissions, manual identity, thin audit trails, uncontrolled exports — to CRM fixes.",
      caption: "What typically breaks in access control — and how this capability helps.",
    },
    workflowVisual: {
      src: "/capabilities/security-workflow-v2.png",
      alt: "Five-step security workflow: define, restrict, authenticate, log, review.",
      caption: "How access control is defined, enforced, and periodically reviewed.",
    },
  },

  mobile: {
    displayTitle: "CRM Mobile capability",
    badgeLabel: "Mobile",
    tagline: "A phone or tablet app that lets field and on-the-go teams update records in real time, not after they're back at a desk.",
    overview:
      "Mobile is the CRM capability covering native phone and tablet apps — record access, activity logging, and often offline support for people who aren't sitting at a desk. It determines whether field-based work gets logged when it happens, or reconstructed from memory hours later.",
    whoThisIsFor:
      "Field sales, service technicians, and any role where most of the working day happens away from a desk. It matters less for desk-based inside sales teams who are already looking at a browser all day.",
    whatMattersIntro:
      "Evaluate what the mobile app can actually do — not just view — and whether it works offline, since field connectivity is often unreliable. A mobile app that only lets you view records, not log activity, doesn't solve the real problem.",
    workedExample:
      "Worked example: a field sales rep visiting customer sites with patchy connectivity. As a capability, mobile needs offline support that queues updates and syncs once a signal returns — an app that requires constant connectivity fails exactly when it's needed most.",
    workedExampleSecondary:
      "Worked example: a service technician who used to write up visit notes on paper and enter them into the CRM at day's end. Mobile as a capability needs to support real-time note and activity logging from the app, not just read access, so the record reflects the visit immediately.",
    glance: {
      primaryGoal: "Let field and on-the-go teams log activity and access records in real time",
      typicalTeam: "Field sales, service technicians, and mobile-first roles",
      commonPriorities: [
        "Native app functionality (not just mobile web)",
        "Offline support and sync",
        "Activity logging from the field",
        "Record access parity with desktop",
        "Performance on real devices",
      ],
    },
    challenges: [
      {
        id: "view-only-mobile",
        title: "The mobile app only lets you view, not log, activity",
        pain: "Field visits still get written up later from memory, defeating the point of having an app.",
        crmHelps: "A capable mobile app supports real activity logging, not just record browsing.",
      },
      {
        id: "connectivity-dependence",
        title: "The app requires a constant connection to work at all",
        pain: "It fails exactly where it's needed most — remote sites and patchy signal areas.",
        crmHelps: "Offline support queues updates locally and syncs once connectivity returns.",
      },
      {
        id: "feature-parity-gaps",
        title: "The mobile app is missing features the desktop version has",
        pain: "Field reps have to switch to a laptop for tasks the phone app can't do.",
        crmHelps: "Checking real feature parity in a trial avoids discovering gaps after rollout.",
      },
      {
        id: "slow-mobile-performance",
        title: "The app is slow or unreliable on real devices",
        pain: "Reps stop using a tool that's more frustrating than useful in the field.",
        crmHelps: "Testing on your actual devices and locations reveals real-world performance, not demo conditions.",
      },
    ],
    outcomes: [
      {
        id: "real-time-logging",
        title: "Activity logged when it happens, not hours later",
        description: "Field visits get recorded on the spot instead of reconstructed from memory.",
      },
      {
        id: "works-offline",
        title: "The app keeps working without a signal",
        description: "Updates queue locally and sync automatically once connectivity returns.",
      },
      {
        id: "true-parity",
        title: "Mobile parity where it matters",
        description: "Field reps aren't forced back to a laptop for routine tasks.",
      },
      {
        id: "field-adoption",
        title: "An app people actually use",
        description: "Reliable performance in real conditions drives real adoption.",
      },
    ],
    capabilityNeeds: [
      {
        id: "native-app",
        title: "Native mobile app",
        description: "A real app, not just a mobile-responsive website.",
        priority: "must",
        href: "/features/mobile-app/",
      },
      {
        id: "field-activity-logging",
        title: "Activity logging from the app",
        description: "Log calls, notes, and visits directly from the field.",
        priority: "must",
      },
      {
        id: "record-access",
        title: "Full record access on mobile",
        description: "See the same contact, deal, and account data as on desktop.",
        priority: "must",
      },
      {
        id: "offline-support",
        title: "Offline support and sync",
        description: "Keep working without a connection and sync automatically once back online.",
        priority: "nice",
      },
      {
        id: "location-features",
        title: "Location-aware features",
        description: "Check-ins or route planning for teams that visit multiple sites daily.",
        priority: "nice",
        href: "/use-cases/field-sales/",
      },
    ],
    workflowSteps: [
      { id: "check-in", label: "Check in", detail: "A rep opens the app before or during a field visit." },
      { id: "access", label: "Access", detail: "Relevant records are pulled up, even with limited connectivity." },
      { id: "log", label: "Log", detail: "Notes, activity, and outcomes are recorded directly from the visit." },
      { id: "sync", label: "Sync", detail: "Updates sync to the main record once a connection is available." },
      { id: "review", label: "Review", detail: "Managers see field activity reflected in the CRM without a lag." },
    ],
    priorities: [
      {
        id: "beyond-view-only",
        title: "Real functionality, not just read access",
        description: "The app should let you do field work, not just look at it.",
        icon: "smartphone",
      },
      {
        id: "offline-reliability",
        title: "Reliable offline behavior",
        description: "Field connectivity is often patchy — the app needs to handle that gracefully.",
        icon: "database",
      },
      {
        id: "device-testing",
        title: "Real-device testing before rollout",
        description: "Demo conditions rarely reflect actual field performance.",
        icon: "check",
      },
      {
        id: "parity-where-it-counts",
        title: "Feature parity for the tasks that matter",
        description: "Not every desktop feature needs a mobile equivalent — the essential ones do.",
        icon: "layers",
      },
    ],
    scenarios: [
      {
        id: "field-based-roles",
        title: "Most of the day happens away from a desk",
        bestWhen: "Field sales, service, or delivery roles need real-time record access and logging.",
        icon: "smartphone",
        href: "/use-cases/field-sales/",
      },
      {
        id: "patchy-connectivity",
        title: "Work happens in areas with unreliable connectivity",
        bestWhen: "Offline support isn't optional — it's a basic requirement.",
        icon: "database",
      },
      {
        id: "desk-based-teams",
        title: "Your team is mostly desk-based already",
        bestWhen: "Mobile depth matters less than for field-first roles — treat it as a lower priority.",
        icon: "layers",
      },
    ],
    buyingFramework: [
      {
        step: 1,
        title: "Test the app on real devices, in real conditions",
        description: "A demo on office wifi won't reveal how the app behaves in the field.",
      },
      {
        step: 2,
        title: "List the tasks the app must support",
        description: "Write down specific field activities, not just \"mobile access\".",
        href: "/guides/crm-requirements-guide/",
        ctaLabel: "Requirements guide →",
      },
      {
        step: 3,
        title: "Verify offline behavior specifically",
        description: "Test what happens to an update made with no signal, and whether it syncs correctly later.",
        href: "/guides/crm-trial-evaluation/",
        ctaLabel: "Trial evaluation →",
      },
      {
        step: 4,
        title: "Check feature parity gaps",
        description: "Confirm what's missing on mobile compared to desktop before committing.",
      },
      {
        step: 5,
        title: "Shortlist with Finder",
        description: "Compare mobile capability depth across a fit-based shortlist.",
        href: "/tools/crm-finder/",
        ctaLabel: "Try CRM Finder →",
      },
    ],
    buyingGuideHref: "/guides/how-to-choose-crm/",
    faq: [
      {
        question: "What should a CRM mobile app actually do?",
        answer:
          "Let field-based users access records and log real activity — calls, notes, visits — not just browse a read-only version of the desktop app.",
      },
      {
        question: "Is mobile web the same as a native app?",
        answer:
          "No. Native apps generally offer better offline support and device integration. Confirm exactly what you're getting rather than assuming.",
      },
      {
        question: "Do we need offline support?",
        answer:
          "Mostly relevant if field connectivity is unreliable. Less critical for teams that are always near reliable wifi.",
      },
      {
        question: "How do we know if the mobile app is good enough?",
        answer: "Test it yourself, on real devices, in real field conditions — not just a vendor demo.",
      },
      {
        question: "Is there one best CRM for mobile?",
        answer: NO_UNIVERSAL_BEST_ANSWER,
      },
    ],
    relatedCapabilitySlugs: ["contact-management", "pipeline-management", "sales-engagement"],
    relatedUseCaseSlugs: ["field-sales", "outbound-sales"],
    relatedRequirementSlugs: [],
    relatedFeatureSlugs: ["mobile-app"],
    featuredGuideHrefs: [
      "/guides/crm-requirements-guide/",
      "/guides/do-i-need-a-crm/",
      "/guides/types-of-crm/",
    ],
    heroVisual: {
      src: "/capabilities/mobile-hero-v2.png",
      alt: "Educational diagram of CRM mobile capability showing a field rep logging activity from a phone app.",
      caption: "Mobile lets field and on-the-go teams work from a phone or tablet, not just a desk.",
    },
    needsVisual: {
      src: "/capabilities/mobile-needs-v2.png",
      alt: "Diagram mapping mobile capability gaps — view-only apps, connectivity dependence, feature parity gaps — to CRM fixes.",
      caption: "What typically breaks in field mobile use — and how this capability helps.",
    },
    workflowVisual: {
      src: "/capabilities/mobile-workflow-v2.png",
      alt: "Five-step mobile workflow: check in, access, log, sync, review.",
      caption: "How field activity flows from a mobile app back into the main CRM record.",
    },
  },

  "ai-assistance": {
    displayTitle: "CRM AI Assistance capability",
    badgeLabel: "AI Assistance",
    tagline: "Assistive suggestions and agentic sales workflows — drafts, summaries, scoring signals, and governed AI agents that need human oversight and observable TCO.",
    overview:
      "AI assistance is the CRM capability covering AI-generated suggestions layered onto CRM data: email drafts, call or meeting summaries, lead-scoring signals, and — in 2026 — agentic sales workflows that can act inside CRM with permissions and audit trails. Creatio and Gartner framed the shift as **Agentic AI in CRM** (February 2026); Gartner’s first **CRM Sales Platforms** Magic Quadrant (July 2026) reflects the same market move toward governed agents, not just copilots. SoftwareGlimpse folds agentic evaluation into **crm-editorial v1.1.0** (agent governance, agent observability, agent-credit TCO) inside this CRM cluster — we do not spawn a separate shallow “agentic CRM” pillar or reproduce analyst quadrant graphics.",
    whoThisIsFor:
      "Any CRM user who wants help with repetitive drafting or summarizing work — but especially teams evaluating whether AI features actually save time versus adding a review burden that offsets the benefit.",
    whatMattersIntro:
      "Evaluate what data the AI features actually use, how transparent the reasoning is, and how easy it is to verify or edit output — not how impressive the marketing language sounds. Assistive AI still needs a human to check its work before anything goes out the door or gets acted on.",
    workedExample:
      "Worked example: a rep who used to spend twenty minutes writing follow-up email drafts after every call. As a capability, AI assistance can generate a first draft from call notes in seconds — but the rep still reads and edits it before sending, because the draft can misread context or invent details that weren't actually said.",
    workedExampleSecondary:
      "Worked example: a manager reviewing an AI-generated lead-scoring signal. AI assistance as a capability should show what factors fed the score, not just a number — because a score nobody can explain is a score nobody should fully trust.",
    glance: {
      primaryGoal: "Speed up repetitive drafting and summarizing work, with human verification always in the loop",
      typicalTeam: "Any CRM user, particularly reps and managers with high volumes of written follow-up",
      commonPriorities: [
        "Draft quality and editability",
        "Summary accuracy",
        "Transparency in scoring signals",
        "Data sources the AI actually uses",
        "Ease of human review",
      ],
    },
    challenges: [
      {
        id: "agent-governance-gap",
        title: "Agentic CRM features ship faster than governance",
        pain: "Sales agents can draft emails or update records without clear permission boundaries or audit logs.",
        crmHelps: "crm-editorial v1.1.0 scores agent governance and observability alongside classic CRM criteria — compare platforms on guardrails, not marketing demos alone.",
      },
      {
        id: "agent-credit-tco",
        title: "Agent credits hide in the seat price",
        pain: "Resolution caps, credit packs, and overage math make agent TCO unpredictable versus per-seat CRM.",
        crmHelps: "Model agent-credit TCO before rollout — especially when agents replace repetitive rep tasks at scale.",
      },
      {
        id: "manual-drafting-time",
        title: "Repetitive drafting eats time that could go to actual selling",
        pain: "Follow-up emails and call summaries take real time to write from scratch every time.",
        crmHelps: "AI-generated first drafts give a starting point that's faster to edit than to write from nothing.",
      },
      {
        id: "blind-trust-risk",
        title: "AI output gets trusted without verification",
        pain: "A summary or draft can misread context or state something that wasn't actually said.",
        crmHelps: "Treating AI output as a draft, not a final answer, keeps a human check in the loop before anything is acted on.",
      },
      {
        id: "opaque-scoring",
        title: "Scoring signals give a number with no explanation",
        pain: "Nobody can say why a lead scored the way it did, so nobody fully trusts the score.",
        crmHelps: "Transparent scoring that shows contributing factors is easier to trust and act on.",
      },
      {
        id: "unclear-data-sources",
        title: "It's unclear what data the AI feature actually uses",
        pain: "You can't judge output quality if you don't know what it's based on.",
        crmHelps: "Understanding the underlying data sources helps set realistic expectations for accuracy.",
      },
    ],
    outcomes: [
      {
        id: "faster-drafting",
        title: "Faster first drafts of routine writing",
        description: "Editing a draft is quicker than writing from a blank page.",
      },
      {
        id: "verified-output",
        title: "Output that gets checked, not blindly trusted",
        description: "Human review stays part of the process, every time.",
      },
      {
        id: "explainable-signals",
        title: "Scoring signals you can actually explain",
        description: "Transparency in contributing factors builds real trust, not blind faith.",
      },
      {
        id: "realistic-expectations",
        title: "Realistic expectations about accuracy",
        description: "Understanding data sources prevents over-trusting AI output.",
      },
    ],
    capabilityNeeds: [
      {
        id: "agent-governance",
        title: "Agent governance and observability",
        description: "Permissions, approval flows, action logs, and human override for sales agents.",
        priority: "must",
        href: "/best/crm-software/",
      },
      {
        id: "draft-generation",
        title: "AI-assisted drafting",
        description: "Generate first-draft emails or notes from context, for a human to edit.",
        priority: "must",
        href: "/features/ai-assistance/",
      },
      {
        id: "editable-output",
        title: "Fully editable AI output",
        description: "Nothing should send or save without a human able to review and change it first.",
        priority: "must",
      },
      {
        id: "source-transparency",
        title: "Visibility into data sources used",
        description: "Understand what information fed a summary or suggestion.",
        priority: "must",
      },
      {
        id: "scoring-explanation",
        title: "Explainable scoring signals",
        description: "See which factors contributed to a lead or deal score.",
        priority: "nice",
        href: "/capabilities/lead-management/",
      },
      {
        id: "summary-features",
        title: "Call and meeting summarization",
        description: "Reduce manual note-writing after calls, with the transcript available to verify against.",
        priority: "nice",
      },
    ],
    workflowSteps: [
      { id: "generate", label: "Generate", detail: "An AI feature produces a draft, summary, or scoring signal from available data." },
      { id: "review", label: "Review", detail: "A person checks the output against what actually happened or was said." },
      { id: "edit", label: "Edit", detail: "Inaccuracies or awkward phrasing get corrected before anything is used." },
      { id: "act", label: "Act", detail: "The verified output is sent, saved, or acted on." },
      { id: "calibrate", label: "Calibrate", detail: "Users learn over time where the AI feature is reliable and where it needs closer checking." },
    ],
    priorities: [
      {
        id: "human-in-loop",
        title: "Human review stays in the loop",
        description: "No AI output should act autonomously without a person checking it first.",
        icon: "shield",
      },
      {
        id: "editability",
        title: "Genuinely editable, not take-it-or-leave-it",
        description: "Output should be easy to correct, not just accept wholesale.",
        icon: "settings",
      },
      {
        id: "transparency",
        title: "Transparency over black-box confidence",
        description: "Understand what data and logic produced a suggestion or score.",
        icon: "chart",
      },
      {
        id: "realistic-scope",
        title: "Realistic scope, not overpromised autonomy",
        description: "Assistive features that admit their limits are more useful than ones that don't.",
        icon: "check",
      },
    ],
    scenarios: [
      {
        id: "high-volume-writing",
        title: "High volume of repetitive written follow-up",
        bestWhen: "Drafting time is a real bottleneck reps want help with, not replacement.",
        icon: "mail",
        href: "/use-cases/customer-follow-up/",
      },
      {
        id: "scoring-signal-need",
        title: "You want prioritization signals for high lead volume",
        bestWhen: "Manual triage no longer scales, and a transparent scoring signal could help.",
        icon: "chart",
        href: "/use-cases/high-volume-lead-management/",
      },
      {
        id: "verification-culture",
        title: "Your team is comfortable verifying AI output",
        bestWhen: "Reps and managers will actually review drafts and scores, not rubber-stamp them.",
        icon: "shield",
      },
    ],
    buyingFramework: [
      {
        step: 1,
        title: "Identify a real, bounded drafting or summary task",
        description: "Pick a specific repetitive task, not a vague hope that \"AI will help\".",
      },
      {
        step: 2,
        title: "Test output quality on your own data",
        description: "Generic demos don't show how a feature performs on your actual accounts and language.",
        href: "/guides/crm-trial-evaluation/",
        ctaLabel: "Trial evaluation →",
      },
      {
        step: 3,
        title: "Ask what data sources feed each feature",
        description: "Understand what the AI is drawing on before trusting its output.",
        href: "/guides/crm-vendor-questions/",
        ctaLabel: "Vendor questions guide →",
      },
      {
        step: 4,
        title: "Set a human-review habit before rollout",
        description: "Decide upfront that nothing ships unverified, and build that into the workflow.",
      },
      {
        step: 5,
        title: "Shortlist with Finder",
        description: "Compare AI assistance depth across a fit-based shortlist.",
        href: "/tools/crm-finder/",
        ctaLabel: "Try CRM Finder →",
      },
    ],
    buyingGuideHref: "/guides/how-to-choose-crm/",
    faq: [
      {
        question: "What changed in CRM AI in 2026?",
        answer:
          "Vendors are shipping agentic sales workflows — not just copilots. Creatio published on Agentic AI in CRM (26 February 2026), and Gartner’s first CRM Sales Platforms Magic Quadrant (July 2026) reflects the same shift. SoftwareGlimpse evaluates agent governance, observability, and agent-credit TCO in crm-editorial v1.1.0 inside this capability hub — we cite analyst maps for context but do not claim Magic Quadrant placement.",
      },
      {
        question: "What does AI assistance mean in a CRM?",
        answer:
          "It's the capability that layers AI-generated suggestions — drafts, summaries, scoring signals — onto CRM data, meant to be reviewed and verified by a person, not acted on automatically.",
      },
      {
        question: "Can we trust AI-generated summaries or drafts?",
        answer:
          "Treat them as a starting point requiring verification, not a finished, trustworthy output on their own.",
      },
      {
        question: "How does AI lead scoring work?",
        answer:
          "It varies by product. Prioritize transparency into contributing factors over a single opaque number.",
      },
      {
        question: "Will AI features replace manual review?",
        answer:
          "No. Assistive AI should speed up drafting and summarizing, with a human always checking before anything is acted on.",
      },
      {
        question: "Is there one best CRM for AI assistance?",
        answer: NO_UNIVERSAL_BEST_ANSWER,
      },
    ],
    relatedCapabilitySlugs: ["reporting", "lead-management", "email", "workflow-automation"],
    relatedUseCaseSlugs: ["lead-management", "sales-engagement", "reporting", "sales-automation"],
    relatedRequirementSlugs: [],
    relatedFeatureSlugs: ["ai-assistance"],
    featuredGuideHrefs: [
      "/guides/crm-glossary/",
      "/guides/do-i-need-a-crm/",
      "/guides/crm-requirements-guide/",
    ],
    heroVisual: {
      src: "/capabilities/ai-assistance-hero-v2.png",
      alt: "Educational diagram of CRM AI assistance showing an AI-generated draft being reviewed and edited by a person.",
      caption: "AI assistance speeds up drafting and summarizing, with human review always in the loop.",
    },
    needsVisual: {
      src: "/capabilities/ai-assistance-needs-v2.png",
      alt: "Diagram mapping AI assistance gaps — manual drafting time, blind trust risk, opaque scoring, unclear data sources — to CRM fixes.",
      caption: "What typically breaks in AI-assisted workflows — and how verification keeps them honest.",
    },
    workflowVisual: {
      src: "/capabilities/ai-assistance-workflow-v2.png",
      alt: "Five-step AI assistance workflow: generate, review, edit, act, calibrate.",
      caption: "How AI-generated output moves from draft to verified, acted-on result.",
    },
  },
};
