/**
 * Shared CRM use-case definitions.
 *
 * Industry-agnostic decision briefs. `{industry}` placeholders are replaced with
 * the industry display name by the synthesizers. Capability slugs reference the
 * shared capability definitions so every priority resolves to a real page.
 */

export type CrmUseCaseCapabilityDefinition = {
  capabilitySlug: string;
  name: string;
  description: string;
  importance: "critical" | "high" | "important" | "optional";
  weight: number;
  icon?: string;
  criterionSlug?: string;
};

export type CrmUseCaseRequirementDefinition = {
  id: string;
  name: string;
  description: string;
  capabilitySlug: string;
  priority: "must-have" | "important" | "advanced";
  featureSlug?: string;
  requirementSlug?: string;
};

export type CrmUseCaseDefinition = {
  slug: string;
  hubUseCaseId: "relationship" | "sales" | "volume" | "complex" | "growing";
  displayName: string;
  /** Template — may contain `{industry}`. */
  tagline: string;
  /** Template — may contain `{industry}`. */
  decisionNuance: string;
  glance: {
    typicalObjective: string;
    teamTypes: string[];
    topPriorityLabels: string[];
  };
  catalogueUseCaseSlugs: string[];
  finderUseCaseSlug?: string;
  capabilities: CrmUseCaseCapabilityDefinition[];
  requirements: CrmUseCaseRequirementDefinition[];
  summarySlots: Array<{
    id: string;
    label: string;
    selection:
      | "best-overall-fit"
      | "best-simplicity"
      | "best-complex"
      | "best-small-team"
      | "best-value";
    focusCapabilitySlugs: string[];
  }>;
  scenarios: Array<{
    id: string;
    title: string;
    description: string;
    priorities: string[];
    focusCapabilitySlugs: string[];
    icon?: string;
  }>;
  tradeoffs: Array<{
    id: string;
    title: string;
    description: string;
    icon?: string;
  }>;
  implementation: Array<{
    id: string;
    title: string;
    description: string;
    icon?: string;
  }>;
  vendorQuestions: Array<{ group: string; questions: string[] }>;
  relatedUseCaseSlugs: string[];
  relatedCapabilitySlugs: string[];
  /** FAQ templates — may contain `{industry}`. */
  faq: Array<{ question: string; answer: string }>;
  matrixFeatureSlugs: string[];
  screenshotMatchTerms: string[];
};

const NO_UNIVERSAL_BEST_ANSWER =
  "No. Fit depends on your workflow, must-have capabilities, integrations, and budget. Use the capability priorities on this page to build a shortlist, then compare researched evidence and cost.";

export const CRM_USE_CASES: CrmUseCaseDefinition[] = [
  {
    slug: "relationship-management",
    hubUseCaseId: "relationship",
    displayName: "Relationship-led teams",
    tagline:
      "Compare CRM platforms for {industry} teams whose value comes from ongoing client relationships rather than a single transaction.",
    decisionNuance:
      "Relationship-led teams usually shortlist differently from pipeline-led ones. Complete history, shared context, and low data-entry friction matter more than deep forecasting or heavy process configuration.",
    glance: {
      typicalObjective:
        "Keep complete, shared context on every ongoing client relationship",
      teamTypes: ["Account management", "Client service", "Business development"],
      topPriorityLabels: [
        "Interaction history",
        "Email sync",
        "Custom fields",
        "Permissions",
      ],
    },
    catalogueUseCaseSlugs: ["relationship-management", "contact-management"],
    finderUseCaseSlug: "relationship-management",
    capabilities: [
      {
        capabilitySlug: "contact-management",
        name: "Contact and relationship management",
        description:
          "Hold accounts, contacts, and full interaction history in one shared record.",
        importance: "critical",
        weight: 100,
        icon: "users",
        criterionSlug: "contact-management",
      },
      {
        capabilitySlug: "integrations",
        name: "Email and calendar integration",
        description:
          "Capture correspondence and meetings without manual logging.",
        importance: "critical",
        weight: 90,
        icon: "mail",
        criterionSlug: "integrations",
      },
      {
        capabilitySlug: "workflow-automation",
        name: "Follow-up automation",
        description:
          "Prompt periodic check-ins and reviews so relationships do not go quiet.",
        importance: "high",
        weight: 70,
        icon: "zap",
        criterionSlug: "sales-automation",
      },
      {
        capabilitySlug: "security-administration",
        name: "Access control",
        description:
          "Share relationship data across the team while protecting sensitive records.",
        importance: "high",
        weight: 65,
        icon: "shield",
      },
      {
        capabilitySlug: "reporting",
        name: "Relationship reporting",
        description:
          "Report on coverage, activity, and accounts that have gone quiet.",
        importance: "important",
        weight: 55,
        icon: "chart",
        criterionSlug: "reporting",
      },
      {
        capabilitySlug: "pipeline-management",
        name: "Opportunity tracking",
        description:
          "Track the opportunities that sit alongside ongoing relationships.",
        importance: "important",
        weight: 50,
        icon: "funnel",
        criterionSlug: "pipeline-management",
      },
    ],
    requirements: [
      {
        id: "interaction-history",
        name: "Complete interaction history",
        description: "One timeline of emails, calls, meetings, and notes.",
        capabilitySlug: "contact-management",
        priority: "must-have",
        featureSlug: "contact-management",
        requirementSlug: "track-client-interactions",
      },
      {
        id: "email-sync",
        name: "Email and calendar sync",
        description: "Capture correspondence automatically.",
        capabilitySlug: "integrations",
        priority: "must-have",
        featureSlug: "email-sync",
        requirementSlug: "integrate-with-email",
      },
      {
        id: "account-structure",
        name: "Account and contact structure",
        description: "Relate people to the organizations they belong to.",
        capabilitySlug: "contact-management",
        priority: "must-have",
        featureSlug: "contact-management",
      },
      {
        id: "custom-fields",
        name: "Custom fields",
        description: "Record the attributes your reviews and segments depend on.",
        capabilitySlug: "contact-management",
        priority: "important",
        featureSlug: "custom-fields",
        requirementSlug: "customize-record-fields",
      },
      {
        id: "check-in-reminders",
        name: "Check-in reminders",
        description: "Automate periodic outreach so accounts are not forgotten.",
        capabilitySlug: "workflow-automation",
        priority: "important",
        featureSlug: "workflow-automation",
        requirementSlug: "automate-lead-follow-up",
      },
      {
        id: "access-control",
        name: "Team-based access control",
        description: "Restrict sensitive relationship data where needed.",
        capabilitySlug: "security-administration",
        priority: "important",
        featureSlug: "role-permissions",
        requirementSlug: "restrict-access-by-team",
      },
      {
        id: "mobile",
        name: "Mobile access",
        description: "Read and update records away from a desk.",
        capabilitySlug: "contact-management",
        priority: "advanced",
        featureSlug: "mobile-app",
      },
      {
        id: "activity-reporting",
        name: "Activity and coverage reporting",
        description: "Surface accounts with no recent contact.",
        capabilitySlug: "reporting",
        priority: "advanced",
        featureSlug: "reporting",
      },
    ],
    summarySlots: [
      {
        id: "overall",
        label: "Best overall fit",
        selection: "best-overall-fit",
        focusCapabilitySlugs: ["contact-management", "integrations"],
      },
      {
        id: "simplicity",
        label: "Best for straightforward needs",
        selection: "best-simplicity",
        focusCapabilitySlugs: ["contact-management"],
      },
      {
        id: "complex",
        label: "Best for complex account structures",
        selection: "best-complex",
        focusCapabilitySlugs: [
          "contact-management",
          "security-administration",
          "reporting",
        ],
      },
      {
        id: "small",
        label: "Best for small teams",
        selection: "best-small-team",
        focusCapabilitySlugs: ["contact-management", "workflow-automation"],
      },
      {
        id: "value",
        label: "Best value",
        selection: "best-value",
        focusCapabilitySlugs: ["contact-management", "integrations"],
      },
    ],
    scenarios: [
      {
        id: "shared-accounts",
        title: "Accounts shared across several people",
        description:
          "Multiple colleagues touch the same client and need the same context.",
        priorities: ["Shared history", "Email sync", "Permissions"],
        focusCapabilitySlugs: ["contact-management", "security-administration"],
        icon: "users",
      },
      {
        id: "periodic-reviews",
        title: "Regular review cycles",
        description:
          "Relationships need scheduled check-ins rather than reactive contact.",
        priorities: ["Reminders", "Activity reporting", "Custom fields"],
        focusCapabilitySlugs: ["workflow-automation", "reporting"],
        icon: "clock",
      },
      {
        id: "field-based",
        title: "Client-facing staff on the move",
        description:
          "Notes and updates are captured between meetings, not at a desk.",
        priorities: ["Mobile access", "Fast data entry", "Email capture"],
        focusCapabilitySlugs: ["contact-management", "integrations"],
        icon: "handshake",
      },
    ],
    tradeoffs: [
      {
        id: "friction",
        title: "Rich records vs data-entry friction",
        description:
          "More structure produces better reporting but reduces adoption if entry is slow.",
        icon: "settings",
      },
      {
        id: "visibility",
        title: "Shared visibility vs restricted records",
        description:
          "Open access helps continuity; restrictions protect sensitive relationships.",
        icon: "shield",
      },
      {
        id: "sales-bias",
        title: "Relationship depth vs sales-first design",
        description:
          "Many CRMs optimize for deal velocity, which can make relationship tracking feel bolted on.",
        icon: "handshake",
      },
    ],
    implementation: [
      {
        id: "records",
        title: "Agree the account model",
        description: "Define how contacts, accounts, and households relate.",
        icon: "database",
      },
      {
        id: "history",
        title: "Decide what history to migrate",
        description: "Move the context people actually reference.",
        icon: "clock",
      },
      {
        id: "sync",
        title: "Turn on email sync first",
        description: "Automatic capture drives adoption faster than training.",
        icon: "mail",
      },
      {
        id: "cadence",
        title: "Define contact cadence",
        description: "Agree how often each account tier should be contacted.",
        icon: "check",
      },
      {
        id: "access",
        title: "Set access rules early",
        description: "Decide who sees which relationships before go-live.",
        icon: "shield",
      },
    ],
    vendorQuestions: [
      {
        group: "Relationship data",
        questions: [
          "How are contacts, accounts, and relationships modelled?",
          "Which interactions are captured automatically?",
          "How much history can we import?",
        ],
      },
      {
        group: "Email and calendar",
        questions: [
          "Which mail and calendar providers are supported?",
          "Is sync two-way, and can individual threads be excluded?",
        ],
      },
      {
        group: "Access and administration",
        questions: [
          "Can visibility be restricted by team or record?",
          "Who can export the contact database?",
        ],
      },
      {
        group: "Cost",
        questions: [
          "Which relationship features require a higher plan?",
          "Are there limits on contacts or stored data?",
        ],
      },
    ],
    relatedUseCaseSlugs: ["pipeline-led-sales", "growing-teams"],
    relatedCapabilitySlugs: [
      "contact-management",
      "integrations",
      "workflow-automation",
    ],
    faq: [
      {
        question: "What matters most in a CRM for relationship-led {industry} teams?",
        answer:
          "Complete interaction history, automatic email capture, and low data-entry friction. Deep forecasting matters less than making the shared record trustworthy.",
      },
      {
        question: "How is this different from a pipeline-led CRM setup?",
        answer:
          "Pipeline-led teams optimize stage progression and forecasting. Relationship-led teams optimize context, continuity, and coverage of accounts that already exist.",
      },
      {
        question: "Do we still need a pipeline?",
        answer:
          "Usually yes, but a simpler one. Opportunities sit alongside relationships rather than defining the whole workflow.",
      },
      {
        question: "Which CRM is best for relationship management?",
        answer: NO_UNIVERSAL_BEST_ANSWER,
      },
    ],
    matrixFeatureSlugs: [
      "contact-management",
      "email-sync",
      "custom-fields",
      "email-tracking",
      "workflow-automation",
      "reporting",
      "mobile-app",
      "integrations",
    ],
    screenshotMatchTerms: ["contact", "account", "timeline", "activity", "note"],
  },
  {
    slug: "pipeline-led-sales",
    hubUseCaseId: "sales",
    displayName: "Pipeline-led sales teams",
    tagline:
      "Compare CRM platforms for {industry} sales teams where opportunity stages, activity, and conversion drive revenue.",
    decisionNuance:
      "Pipeline-led teams should weigh stage discipline and reporting above breadth of features. A product that makes the next action obvious usually beats one with a longer feature list.",
    glance: {
      typicalObjective:
        "Move opportunities through clear stages and report on conversion",
      teamTypes: ["Sales", "Business development", "Sales management"],
      topPriorityLabels: ["Stages", "Ownership", "Activity", "Reporting"],
    },
    catalogueUseCaseSlugs: ["pipeline-management", "sales-automation"],
    finderUseCaseSlug: "pipeline-management",
    capabilities: [
      {
        capabilitySlug: "pipeline-management",
        name: "Pipeline management",
        description:
          "Configure stages, ownership, and next actions on every opportunity.",
        importance: "critical",
        weight: 100,
        icon: "funnel",
        criterionSlug: "pipeline-management",
      },
      {
        capabilitySlug: "reporting",
        name: "Reporting and forecasting",
        description:
          "Measure conversion, pipeline coverage, and expected outcomes.",
        importance: "high",
        weight: 85,
        icon: "chart",
        criterionSlug: "reporting",
      },
      {
        capabilitySlug: "workflow-automation",
        name: "Sales automation",
        description: "Automate follow-up, reminders, and stage-based tasks.",
        importance: "high",
        weight: 80,
        icon: "zap",
        criterionSlug: "sales-automation",
      },
      {
        capabilitySlug: "contact-management",
        name: "Contact management",
        description: "Keep buyer and account context next to each deal.",
        importance: "high",
        weight: 70,
        icon: "users",
        criterionSlug: "contact-management",
      },
      {
        capabilitySlug: "integrations",
        name: "Integrations",
        description: "Connect email, calendar, and the wider sales stack.",
        importance: "important",
        weight: 60,
        icon: "puzzle",
        criterionSlug: "integrations",
      },
      {
        capabilitySlug: "security-administration",
        name: "Administration",
        description: "Manage territories, visibility, and ownership rules.",
        importance: "optional",
        weight: 40,
        icon: "shield",
      },
    ],
    requirements: [
      {
        id: "stages",
        name: "Configurable stages",
        description: "Match stages to real decision points in your process.",
        capabilitySlug: "pipeline-management",
        priority: "must-have",
        featureSlug: "pipeline-management",
      },
      {
        id: "deal-records",
        name: "Deal records",
        description: "Track value, close date, and linked contacts.",
        capabilitySlug: "pipeline-management",
        priority: "must-have",
        featureSlug: "deal-management",
      },
      {
        id: "activity-tracking",
        name: "Activity and next actions",
        description: "Keep the next step visible on every open deal.",
        capabilitySlug: "pipeline-management",
        priority: "must-have",
        featureSlug: "pipeline-management",
      },
      {
        id: "follow-up-automation",
        name: "Follow-up automation",
        description: "Automate reminders so deals do not go quiet.",
        capabilitySlug: "workflow-automation",
        priority: "must-have",
        featureSlug: "workflow-automation",
        requirementSlug: "automate-lead-follow-up",
      },
      {
        id: "pipeline-reporting",
        name: "Pipeline and conversion reporting",
        description: "Report on stage movement, not just current totals.",
        capabilitySlug: "reporting",
        priority: "important",
        featureSlug: "reporting",
      },
      {
        id: "forecast",
        name: "Forecasting",
        description: "Produce a forward view leadership can plan against.",
        capabilitySlug: "reporting",
        priority: "important",
        featureSlug: "forecasting",
        requirementSlug: "forecast-revenue",
      },
      {
        id: "email-tracking",
        name: "Email tracking",
        description: "See whether outreach was opened or clicked.",
        capabilitySlug: "integrations",
        priority: "advanced",
        featureSlug: "email-tracking",
      },
      {
        id: "multiple-pipelines",
        name: "Multiple pipelines",
        description: "Separate genuinely different sales motions.",
        capabilitySlug: "pipeline-management",
        priority: "advanced",
        featureSlug: "custom-pipelines",
        requirementSlug: "separate-sales-processes",
      },
    ],
    summarySlots: [
      {
        id: "overall",
        label: "Best overall fit",
        selection: "best-overall-fit",
        focusCapabilitySlugs: ["pipeline-management", "reporting"],
      },
      {
        id: "simplicity",
        label: "Best for a simple sales process",
        selection: "best-simplicity",
        focusCapabilitySlugs: ["pipeline-management"],
      },
      {
        id: "complex",
        label: "Best for multi-motion sales",
        selection: "best-complex",
        focusCapabilitySlugs: ["pipeline-management", "workflow-automation"],
      },
      {
        id: "small",
        label: "Best for small sales teams",
        selection: "best-small-team",
        focusCapabilitySlugs: ["pipeline-management", "contact-management"],
      },
      {
        id: "value",
        label: "Best value",
        selection: "best-value",
        focusCapabilitySlugs: ["pipeline-management", "workflow-automation"],
      },
    ],
    scenarios: [
      {
        id: "single-pipeline",
        title: "One clear sales process",
        description:
          "Everyone sells the same way and needs one well-designed pipeline.",
        priorities: ["Stage clarity", "Ease of adoption", "Activity tracking"],
        focusCapabilitySlugs: ["pipeline-management"],
        icon: "funnel",
      },
      {
        id: "manager-visibility",
        title: "Managers need weekly visibility",
        description:
          "Pipeline reviews depend on trustworthy stage and conversion data.",
        priorities: ["Dashboards", "Conversion reporting", "Forecasting"],
        focusCapabilitySlugs: ["reporting", "pipeline-management"],
        icon: "chart",
      },
      {
        id: "outbound",
        title: "Active outbound motion",
        description:
          "Sequences and email tracking sit alongside pipeline progression.",
        priorities: ["Sequences", "Email tracking", "Automation"],
        focusCapabilitySlugs: ["workflow-automation", "integrations"],
        icon: "zap",
      },
    ],
    tradeoffs: [
      {
        id: "simplicity",
        title: "Adoption speed vs process depth",
        description:
          "A simple board is adopted quickly; deeper configuration takes longer to land.",
        icon: "users",
      },
      {
        id: "reporting",
        title: "Reporting depth vs plan cost",
        description:
          "Custom reports and forecasting are frequent upgrade triggers.",
        icon: "chart",
      },
      {
        id: "automation",
        title: "Automation vs rep autonomy",
        description:
          "Automated cadences improve consistency but can feel rigid to experienced reps.",
        icon: "zap",
      },
    ],
    implementation: [
      {
        id: "stages",
        title: "Define stages and exit criteria",
        description: "Every stage needs an observable condition to leave it.",
        icon: "funnel",
      },
      {
        id: "hygiene",
        title: "Set hygiene rules",
        description: "Agree expectations for close dates and next actions.",
        icon: "check",
      },
      {
        id: "dashboards",
        title: "Build the review dashboard",
        description: "Design the weekly pipeline review before go-live.",
        icon: "chart",
      },
      {
        id: "automation",
        title: "Automate the obvious gaps",
        description: "Start with follow-up reminders and stage tasks.",
        icon: "zap",
      },
    ],
    vendorQuestions: [
      {
        group: "Pipeline",
        questions: [
          "Can we configure stages and exit criteria ourselves?",
          "How does the product surface stalled deals?",
          "How many pipelines are allowed on our plan?",
        ],
      },
      {
        group: "Reporting",
        questions: [
          "Can managers build reports without an administrator?",
          "Can we report on conversion between stages?",
          "How does forecasting derive its numbers?",
        ],
      },
      {
        group: "Automation",
        questions: [
          "Which stage changes can trigger automation?",
          "Are there caps on workflow executions?",
        ],
      },
      {
        group: "Cost",
        questions: [
          "Which pipeline and reporting features require an upgrade?",
          "What does the plan cost at our expected headcount?",
        ],
      },
    ],
    relatedUseCaseSlugs: [
      "complex-sales-processes",
      "high-volume-lead-management",
      "growing-teams",
    ],
    relatedCapabilitySlugs: [
      "pipeline-management",
      "reporting",
      "workflow-automation",
    ],
    faq: [
      {
        question: "What should {industry} sales teams prioritize in a CRM?",
        answer:
          "Stage configuration, clear ownership, visible next actions, and reporting that explains conversion. Those four cover most of the value before any advanced feature.",
      },
      {
        question: "How many pipelines do we need?",
        answer:
          "One, until two processes genuinely differ in their stages. Splitting early fragments reporting for little benefit.",
      },
      {
        question: "Do we need forecasting from day one?",
        answer:
          "Only if leadership plans against pipeline numbers. Forecasts built on unreliable close dates create false confidence.",
      },
      {
        question: "Which CRM is best for pipeline-led sales?",
        answer: NO_UNIVERSAL_BEST_ANSWER,
      },
    ],
    matrixFeatureSlugs: [
      "pipeline-management",
      "deal-management",
      "custom-pipelines",
      "workflow-automation",
      "sales-automation",
      "email-tracking",
      "reporting",
      "forecasting",
    ],
    screenshotMatchTerms: ["pipeline", "deal", "kanban", "forecast", "report"],
  },
  {
    slug: "high-volume-lead-management",
    hubUseCaseId: "volume",
    displayName: "High-volume lead handling",
    tagline:
      "Compare CRM platforms for {industry} teams processing large inbound or outbound lead volumes where speed of response decides outcomes.",
    decisionNuance:
      "At volume, capture, routing, and response speed matter more than depth of customization. Plan limits on automation and email volume often become the deciding constraint.",
    glance: {
      typicalObjective:
        "Capture, route, and respond to every lead before it goes cold",
      teamTypes: ["Inbound sales", "Sales development", "Contact centres"],
      topPriorityLabels: ["Capture", "Routing", "Automation", "Sequences"],
    },
    catalogueUseCaseSlugs: ["lead-management", "sales-automation"],
    finderUseCaseSlug: "lead-management",
    capabilities: [
      {
        capabilitySlug: "workflow-automation",
        name: "Lead automation and routing",
        description:
          "Assign, prioritize, and follow up on leads without manual triage.",
        importance: "critical",
        weight: 100,
        icon: "zap",
        criterionSlug: "sales-automation",
      },
      {
        capabilitySlug: "contact-management",
        name: "Lead capture and data quality",
        description:
          "Capture leads cleanly and keep duplicates under control at volume.",
        importance: "critical",
        weight: 90,
        icon: "users",
        criterionSlug: "contact-management",
      },
      {
        capabilitySlug: "pipeline-management",
        name: "Lead pipeline",
        description:
          "Qualify and progress leads through a lightweight, fast pipeline.",
        importance: "high",
        weight: 80,
        icon: "funnel",
        criterionSlug: "pipeline-management",
      },
      {
        capabilitySlug: "integrations",
        name: "Capture integrations",
        description:
          "Connect forms, ads, website, and phone so nothing is entered by hand.",
        importance: "high",
        weight: 75,
        icon: "puzzle",
        criterionSlug: "integrations",
      },
      {
        capabilitySlug: "reporting",
        name: "Source and response reporting",
        description:
          "Measure response times and which sources actually convert.",
        importance: "important",
        weight: 60,
        icon: "chart",
        criterionSlug: "reporting",
      },
      {
        capabilitySlug: "security-administration",
        name: "Administration",
        description: "Manage routing rules, teams, and data retention at scale.",
        importance: "optional",
        weight: 35,
        icon: "shield",
      },
    ],
    requirements: [
      {
        id: "lead-capture",
        name: "Automated lead capture",
        description: "Bring leads in from forms, email, and connected channels.",
        capabilitySlug: "integrations",
        priority: "must-have",
        featureSlug: "lead-management",
      },
      {
        id: "routing",
        name: "Lead routing and assignment",
        description: "Route each lead to an owner automatically.",
        capabilitySlug: "workflow-automation",
        priority: "must-have",
        featureSlug: "sales-automation",
      },
      {
        id: "first-response",
        name: "Automated first response",
        description: "Acknowledge and follow up before the lead goes cold.",
        capabilitySlug: "workflow-automation",
        priority: "must-have",
        featureSlug: "workflow-automation",
        requirementSlug: "automate-lead-follow-up",
      },
      {
        id: "sequences",
        name: "Email sequences",
        description: "Run multi-step follow-up that stops on reply.",
        capabilitySlug: "workflow-automation",
        priority: "important",
        featureSlug: "email-sequences",
      },
      {
        id: "duplicates",
        name: "Duplicate handling",
        description: "Detect and merge duplicates before they multiply.",
        capabilitySlug: "contact-management",
        priority: "important",
        featureSlug: "contact-management",
      },
      {
        id: "qualification",
        name: "Qualification fields",
        description: "Capture the data that decides priority.",
        capabilitySlug: "contact-management",
        priority: "important",
        featureSlug: "custom-fields",
        requirementSlug: "customize-record-fields",
      },
      {
        id: "call-handling",
        name: "Call handling",
        description: "Log or place calls without leaving the record.",
        capabilitySlug: "integrations",
        priority: "advanced",
        featureSlug: "call-functionality",
      },
      {
        id: "source-reporting",
        name: "Source and response reporting",
        description: "Report on response time and conversion by source.",
        capabilitySlug: "reporting",
        priority: "advanced",
        featureSlug: "reporting",
      },
    ],
    summarySlots: [
      {
        id: "overall",
        label: "Best overall fit",
        selection: "best-overall-fit",
        focusCapabilitySlugs: ["workflow-automation", "contact-management"],
      },
      {
        id: "simplicity",
        label: "Best for straightforward volume",
        selection: "best-simplicity",
        focusCapabilitySlugs: ["contact-management", "pipeline-management"],
      },
      {
        id: "complex",
        label: "Best for complex routing",
        selection: "best-complex",
        focusCapabilitySlugs: ["workflow-automation", "integrations"],
      },
      {
        id: "small",
        label: "Best for small teams at volume",
        selection: "best-small-team",
        focusCapabilitySlugs: ["workflow-automation"],
      },
      {
        id: "value",
        label: "Best value at volume",
        selection: "best-value",
        focusCapabilitySlugs: ["workflow-automation", "contact-management"],
      },
    ],
    scenarios: [
      {
        id: "inbound-surge",
        title: "Inbound enquiries arriving all day",
        description:
          "Response time is the main lever on conversion, so capture and routing dominate.",
        priorities: ["Capture", "Routing", "First response"],
        focusCapabilitySlugs: ["workflow-automation", "integrations"],
        icon: "zap",
      },
      {
        id: "outbound-cadence",
        title: "Outbound prospecting at scale",
        description:
          "Sequences and email tracking carry most of the follow-up load.",
        priorities: ["Sequences", "Email tracking", "Plan limits"],
        focusCapabilitySlugs: ["workflow-automation", "integrations"],
        icon: "mail",
      },
      {
        id: "data-quality",
        title: "Lead data quality is deteriorating",
        description:
          "Duplicates and incomplete records are undermining prioritization.",
        priorities: ["Duplicate handling", "Required fields", "Reporting"],
        focusCapabilitySlugs: ["contact-management", "reporting"],
        icon: "database",
      },
    ],
    tradeoffs: [
      {
        id: "speed",
        title: "Speed vs qualification depth",
        description:
          "Heavier qualification improves prioritization but slows first response.",
        icon: "clock",
      },
      {
        id: "limits",
        title: "Volume vs plan limits",
        description:
          "Automation executions, email sends, and record counts are often capped by plan.",
        icon: "chart",
      },
      {
        id: "automation",
        title: "Automation vs personalization",
        description:
          "Automated cadences scale reach but can reduce response quality.",
        icon: "zap",
      },
    ],
    implementation: [
      {
        id: "sources",
        title: "Map every lead source",
        description: "Any uncaptured source becomes a manual workaround.",
        icon: "puzzle",
      },
      {
        id: "sla",
        title: "Define a response target",
        description: "Agree the time-to-first-response you will measure.",
        icon: "clock",
      },
      {
        id: "routing-rules",
        title: "Write routing rules down",
        description: "Decide ownership rules before configuring them.",
        icon: "funnel",
      },
      {
        id: "limits",
        title: "Check plan limits against volume",
        description: "Verify automation and email caps at your real volume.",
        icon: "chart",
      },
    ],
    vendorQuestions: [
      {
        group: "Capture and routing",
        questions: [
          "Which lead sources can be captured natively?",
          "How are leads routed, and can rules differ by source or team?",
          "How are duplicates detected on capture?",
        ],
      },
      {
        group: "Automation limits",
        questions: [
          "How many automation executions does our plan allow per month?",
          "Are there email sending limits?",
        ],
      },
      {
        group: "Reporting",
        questions: [
          "Can we report on time to first response?",
          "Can conversion be reported by lead source?",
        ],
      },
      {
        group: "Cost",
        questions: [
          "How does cost change as record volume grows?",
          "Which volume features require an upgrade?",
        ],
      },
    ],
    relatedUseCaseSlugs: ["pipeline-led-sales", "growing-teams"],
    relatedCapabilitySlugs: [
      "workflow-automation",
      "contact-management",
      "pipeline-management",
    ],
    faq: [
      {
        question: "What matters most for high-volume lead handling in {industry}?",
        answer:
          "Automated capture, routing, and first response. At volume, the leads you lose are usually the ones nobody reached in time.",
      },
      {
        question: "Which plan limits should we check?",
        answer:
          "Automation executions, email send volume, record or contact counts, and any per-seat caps on sequences. These bind before feature availability does.",
      },
      {
        question: "Is lead scoring necessary?",
        answer:
          "It helps once volume exceeds capacity to contact everyone. Below that, response speed usually returns more than scoring does.",
      },
      {
        question: "Which CRM is best for high lead volume?",
        answer: NO_UNIVERSAL_BEST_ANSWER,
      },
    ],
    matrixFeatureSlugs: [
      "lead-management",
      "workflow-automation",
      "sales-automation",
      "email-sequences",
      "email-tracking",
      "call-functionality",
      "contact-management",
      "reporting",
    ],
    screenshotMatchTerms: ["lead", "automation", "sequence", "queue", "assign"],
  },
  {
    slug: "complex-sales-processes",
    hubUseCaseId: "complex",
    displayName: "Complex sales processes",
    tagline:
      "Compare CRM platforms for {industry} teams running multi-stage sales with several stakeholders, approvals, and process variation.",
    decisionNuance:
      "Complex processes reward configurability, but every configuration option is also an administration cost. Weigh how much process depth you can realistically maintain.",
    glance: {
      typicalObjective:
        "Run multi-stage opportunities with clear ownership, approvals, and visibility",
      teamTypes: ["B2B sales", "Bid and proposal teams", "Sales operations"],
      topPriorityLabels: [
        "Custom stages",
        "Multiple pipelines",
        "Automation",
        "Forecasting",
      ],
    },
    catalogueUseCaseSlugs: ["pipeline-management", "sales-automation"],
    finderUseCaseSlug: "pipeline-management",
    capabilities: [
      {
        capabilitySlug: "pipeline-management",
        name: "Pipeline management",
        description:
          "Model multi-stage opportunities with ownership and handoffs.",
        importance: "critical",
        weight: 100,
        icon: "funnel",
        criterionSlug: "pipeline-management",
      },
      {
        capabilitySlug: "workflow-automation",
        name: "Process automation",
        description:
          "Trigger tasks, approvals, and updates as opportunities advance.",
        importance: "critical",
        weight: 90,
        icon: "zap",
        criterionSlug: "sales-automation",
      },
      {
        capabilitySlug: "reporting",
        name: "Reporting and forecasting",
        description:
          "Report across pipelines, stages, and long cycles with confidence.",
        importance: "high",
        weight: 80,
        icon: "chart",
        criterionSlug: "reporting",
      },
      {
        capabilitySlug: "contact-management",
        name: "Stakeholder management",
        description:
          "Track multiple stakeholders and their roles on each opportunity.",
        importance: "high",
        weight: 75,
        icon: "users",
        criterionSlug: "contact-management",
      },
      {
        capabilitySlug: "integrations",
        name: "Integrations",
        description:
          "Connect proposal, finance, and operational systems to the deal record.",
        importance: "high",
        weight: 65,
        icon: "puzzle",
        criterionSlug: "integrations",
      },
      {
        capabilitySlug: "security-administration",
        name: "Administration and permissions",
        description:
          "Control who can see and approve at each stage as the process grows.",
        importance: "important",
        weight: 55,
        icon: "shield",
      },
    ],
    requirements: [
      {
        id: "custom-stages",
        name: "Custom opportunity stages",
        description: "Model the real multi-step process, including approvals.",
        capabilitySlug: "pipeline-management",
        priority: "must-have",
        featureSlug: "pipeline-management",
      },
      {
        id: "multiple-pipelines",
        name: "Multiple pipelines",
        description: "Run distinct sales motions separately.",
        capabilitySlug: "pipeline-management",
        priority: "must-have",
        featureSlug: "custom-pipelines",
        requirementSlug: "separate-sales-processes",
      },
      {
        id: "ownership",
        name: "Ownership and handoffs",
        description: "Assign clear owners across stakeholders and stages.",
        capabilitySlug: "pipeline-management",
        priority: "must-have",
        featureSlug: "deal-management",
      },
      {
        id: "stage-automation",
        name: "Stage-based automation",
        description: "Trigger tasks and notifications as deals progress.",
        capabilitySlug: "workflow-automation",
        priority: "must-have",
        featureSlug: "workflow-automation",
        requirementSlug: "automate-lead-follow-up",
      },
      {
        id: "custom-fields",
        name: "Custom fields",
        description: "Capture process-specific data on opportunities.",
        capabilitySlug: "contact-management",
        priority: "important",
        featureSlug: "custom-fields",
        requirementSlug: "customize-record-fields",
      },
      {
        id: "forecast",
        name: "Forecasting across pipelines",
        description: "Forecast long cycles and multiple motions together.",
        capabilitySlug: "reporting",
        priority: "important",
        featureSlug: "forecasting",
        requirementSlug: "forecast-revenue",
      },
      {
        id: "permissions",
        name: "Stage and record permissions",
        description: "Restrict visibility and approval rights by role.",
        capabilitySlug: "security-administration",
        priority: "important",
        featureSlug: "role-permissions",
        requirementSlug: "restrict-access-by-team",
      },
      {
        id: "integrations",
        name: "System integrations",
        description: "Connect the systems the deal depends on.",
        capabilitySlug: "integrations",
        priority: "advanced",
        featureSlug: "integrations",
        requirementSlug: "manage-integrations",
      },
    ],
    summarySlots: [
      {
        id: "overall",
        label: "Best overall fit",
        selection: "best-overall-fit",
        focusCapabilitySlugs: ["pipeline-management", "workflow-automation"],
      },
      {
        id: "simplicity",
        label: "Best for simpler complex sales",
        selection: "best-simplicity",
        focusCapabilitySlugs: ["pipeline-management"],
      },
      {
        id: "complex",
        label: "Best for deep customization",
        selection: "best-complex",
        focusCapabilitySlugs: [
          "pipeline-management",
          "security-administration",
          "integrations",
        ],
      },
      {
        id: "small",
        label: "Best for focused teams",
        selection: "best-small-team",
        focusCapabilitySlugs: ["pipeline-management", "workflow-automation"],
      },
      {
        id: "value",
        label: "Best value",
        selection: "best-value",
        focusCapabilitySlugs: ["pipeline-management", "reporting"],
      },
    ],
    scenarios: [
      {
        id: "multi-stakeholder",
        title: "Several stakeholders per deal",
        description:
          "Buying groups need roles, contacts, and next actions tracked per person.",
        priorities: ["Stakeholder tracking", "Ownership", "Activity history"],
        focusCapabilitySlugs: ["contact-management", "pipeline-management"],
        icon: "users",
      },
      {
        id: "approvals",
        title: "Internal approvals in the process",
        description:
          "Pricing or scope decisions require an internal step before progressing.",
        priorities: ["Automation", "Permissions", "Audit trail"],
        focusCapabilitySlugs: ["workflow-automation", "security-administration"],
        icon: "check",
      },
      {
        id: "multi-motion",
        title: "Several distinct sales motions",
        description:
          "Different products, segments, or regions follow different stages.",
        priorities: ["Multiple pipelines", "Custom fields", "Reporting"],
        focusCapabilitySlugs: ["pipeline-management", "reporting"],
        icon: "layers",
      },
    ],
    tradeoffs: [
      {
        id: "depth",
        title: "Process depth vs adoption speed",
        description:
          "Heavy configuration models reality but delays go-live and complicates training.",
        icon: "settings",
      },
      {
        id: "automation",
        title: "Automation vs control",
        description:
          "Automated approvals improve consistency and need clear rule ownership.",
        icon: "zap",
      },
      {
        id: "plan",
        title: "Capability vs plan tier",
        description:
          "Multiple pipelines, forecasting, and permissions are commonly plan-gated.",
        icon: "chart",
      },
      {
        id: "suite",
        title: "Platform vs focused CRM",
        description:
          "Platforms customize further; focused CRMs are usually faster to operationalize.",
        icon: "layers",
      },
    ],
    implementation: [
      {
        id: "stages",
        title: "Design stages and exit criteria",
        description: "Document approvals and decision points before configuring.",
        icon: "funnel",
      },
      {
        id: "pipelines",
        title: "Decide pipeline count",
        description: "Split only where the stage models genuinely differ.",
        icon: "layers",
      },
      {
        id: "roles",
        title: "Define roles and approvals",
        description: "Agree who approves what, and what happens if they are away.",
        icon: "shield",
      },
      {
        id: "automation",
        title: "Automate once the process is stable",
        description: "Automating an unsettled process encodes the wrong steps.",
        icon: "zap",
      },
      {
        id: "forecast",
        title: "Agree forecast definitions",
        description: "Align on categories and review cadence up front.",
        icon: "chart",
      },
    ],
    vendorQuestions: [
      {
        group: "Process",
        questions: [
          "Can stages, exit criteria, and required fields be configured per pipeline?",
          "How are approvals modelled?",
          "How are stakeholders and their roles tracked on a deal?",
        ],
      },
      {
        group: "Automation",
        questions: [
          "Which stage events can trigger automation?",
          "Can automation differ by pipeline?",
        ],
      },
      {
        group: "Reporting",
        questions: [
          "Can forecasts span multiple pipelines?",
          "Can we report on long cycles and stage duration?",
        ],
      },
      {
        group: "Administration",
        questions: [
          "What customization is possible without professional services?",
          "Which capabilities require plan upgrades?",
        ],
      },
    ],
    relatedUseCaseSlugs: ["pipeline-led-sales", "relationship-management"],
    relatedCapabilitySlugs: [
      "pipeline-management",
      "workflow-automation",
      "reporting",
    ],
    faq: [
      {
        question: "What makes a sales process complex?",
        answer:
          "Multiple stakeholders, internal approvals, long cycles, and variation between motions. Complexity is about the number of decisions, not the deal value.",
      },
      {
        question: "What should {industry} teams prioritize for complex sales?",
        answer:
          "Configurable stages, ownership and handoffs, stage automation, and reporting that survives long cycles — plus enough permission control for approvals.",
      },
      {
        question: "Do we need multiple pipelines?",
        answer:
          "Only where stage models genuinely differ. Many teams start with one pipeline and split once the difference is proven.",
      },
      {
        question: "How much configuration is too much?",
        answer:
          "More than your team can maintain. If nobody owns the configuration, complex setups decay into unreliable data within a few quarters.",
      },
      {
        question: "Which CRM is best for complex sales?",
        answer: NO_UNIVERSAL_BEST_ANSWER,
      },
    ],
    matrixFeatureSlugs: [
      "pipeline-management",
      "custom-pipelines",
      "deal-management",
      "workflow-automation",
      "sales-automation",
      "custom-fields",
      "forecasting",
      "reporting",
      "integrations",
    ],
    screenshotMatchTerms: [
      "pipeline",
      "stage",
      "automation",
      "forecast",
      "workflow",
    ],
  },
  {
    slug: "growing-teams",
    hubUseCaseId: "growing",
    displayName: "Growing teams",
    tagline:
      "Compare CRM platforms for {industry} teams that need something people will actually adopt now, without rebuilding once headcount doubles.",
    decisionNuance:
      "Growing teams get burned in two directions: tools too simple to grow into, and platforms too heavy to adopt. Weigh adoption today against the cost of migrating later.",
    glance: {
      typicalObjective:
        "Get consistent process and shared data without heavy administration",
      teamTypes: ["Small sales teams", "Founder-led sales", "First-time CRM buyers"],
      topPriorityLabels: [
        "Ease of use",
        "Core pipeline",
        "Email sync",
        "Room to grow",
      ],
    },
    catalogueUseCaseSlugs: ["contact-management", "pipeline-management"],
    finderUseCaseSlug: "contact-management",
    capabilities: [
      {
        capabilitySlug: "contact-management",
        name: "Contact management",
        description:
          "One shared record so knowledge does not sit with individuals.",
        importance: "critical",
        weight: 100,
        icon: "users",
        criterionSlug: "contact-management",
      },
      {
        capabilitySlug: "pipeline-management",
        name: "Core pipeline",
        description:
          "A simple pipeline everyone understands and keeps up to date.",
        importance: "critical",
        weight: 90,
        icon: "funnel",
        criterionSlug: "pipeline-management",
      },
      {
        capabilitySlug: "integrations",
        name: "Email and stack integration",
        description:
          "Work inside existing tools so the CRM is not extra typing.",
        importance: "high",
        weight: 75,
        icon: "puzzle",
        criterionSlug: "integrations",
      },
      {
        capabilitySlug: "workflow-automation",
        name: "Light automation",
        description:
          "Automate a few reminders rather than building a rules engine.",
        importance: "important",
        weight: 60,
        icon: "zap",
        criterionSlug: "sales-automation",
      },
      {
        capabilitySlug: "reporting",
        name: "Basic reporting",
        description:
          "See pipeline and activity without building a reporting practice.",
        importance: "important",
        weight: 50,
        icon: "chart",
        criterionSlug: "reporting",
      },
      {
        capabilitySlug: "security-administration",
        name: "Room to add controls",
        description:
          "Permissions and administration you can turn on as the team grows.",
        importance: "optional",
        weight: 35,
        icon: "shield",
      },
    ],
    requirements: [
      {
        id: "shared-records",
        name: "Shared contact records",
        description: "Move relationships out of personal inboxes.",
        capabilitySlug: "contact-management",
        priority: "must-have",
        featureSlug: "contact-management",
      },
      {
        id: "simple-pipeline",
        name: "A pipeline people will update",
        description: "Few enough stages that the board stays accurate.",
        capabilitySlug: "pipeline-management",
        priority: "must-have",
        featureSlug: "pipeline-management",
      },
      {
        id: "email-sync",
        name: "Email and calendar sync",
        description: "Capture history without extra data entry.",
        capabilitySlug: "integrations",
        priority: "must-have",
        featureSlug: "email-sync",
        requirementSlug: "integrate-with-email",
      },
      {
        id: "reminders",
        name: "Follow-up reminders",
        description: "Automate the reminders that are currently in someone's head.",
        capabilitySlug: "workflow-automation",
        priority: "important",
        featureSlug: "workflow-automation",
        requirementSlug: "automate-lead-follow-up",
      },
      {
        id: "mobile",
        name: "Mobile access",
        description: "Update records between meetings.",
        capabilitySlug: "contact-management",
        priority: "important",
        featureSlug: "mobile-app",
      },
      {
        id: "basic-reporting",
        name: "Basic pipeline reporting",
        description: "Answer what is open and what closed, without a spreadsheet.",
        capabilitySlug: "reporting",
        priority: "important",
        featureSlug: "reporting",
      },
      {
        id: "custom-fields",
        name: "Custom fields when needed",
        description: "Add your own fields as the process matures.",
        capabilitySlug: "contact-management",
        priority: "advanced",
        featureSlug: "custom-fields",
        requirementSlug: "customize-record-fields",
      },
      {
        id: "permissions",
        name: "Permissions as the team grows",
        description: "Introduce roles and visibility limits later without migrating.",
        capabilitySlug: "security-administration",
        priority: "advanced",
        featureSlug: "role-permissions",
        requirementSlug: "restrict-access-by-team",
      },
    ],
    summarySlots: [
      {
        id: "overall",
        label: "Best overall fit",
        selection: "best-overall-fit",
        focusCapabilitySlugs: ["contact-management", "pipeline-management"],
      },
      {
        id: "simplicity",
        label: "Easiest to adopt",
        selection: "best-simplicity",
        focusCapabilitySlugs: ["contact-management"],
      },
      {
        id: "complex",
        label: "Best room to grow",
        selection: "best-complex",
        focusCapabilitySlugs: [
          "workflow-automation",
          "reporting",
          "security-administration",
        ],
      },
      {
        id: "small",
        label: "Best for very small teams",
        selection: "best-small-team",
        focusCapabilitySlugs: ["contact-management", "pipeline-management"],
      },
      {
        id: "value",
        label: "Best value",
        selection: "best-value",
        focusCapabilitySlugs: ["contact-management", "integrations"],
      },
    ],
    scenarios: [
      {
        id: "first-crm",
        title: "First CRM, moving off spreadsheets",
        description:
          "Adoption is the whole risk — the tool has to be easier than the spreadsheet.",
        priorities: ["Ease of use", "Email sync", "Fast setup"],
        focusCapabilitySlugs: ["contact-management", "integrations"],
        icon: "trending",
      },
      {
        id: "adding-people",
        title: "Adding salespeople this year",
        description:
          "Process consistency and onboarding speed start to matter more than flexibility.",
        priorities: ["Consistent process", "Reporting", "Light automation"],
        focusCapabilitySlugs: ["pipeline-management", "workflow-automation"],
        icon: "users",
      },
      {
        id: "outgrowing",
        title: "Outgrowing a basic tool",
        description:
          "Current tool cannot support reporting, permissions, or automation needs.",
        priorities: ["Room to grow", "Migration path", "Total cost"],
        focusCapabilitySlugs: ["reporting", "security-administration"],
        icon: "layers",
      },
    ],
    tradeoffs: [
      {
        id: "simplicity",
        title: "Simplicity now vs headroom later",
        description:
          "The simplest tool adopts fastest and may need replacing sooner.",
        icon: "trending",
      },
      {
        id: "cost",
        title: "Entry price vs cost at scale",
        description:
          "Per-seat pricing and upgrade thresholds matter more than the starting price.",
        icon: "chart",
      },
      {
        id: "admin",
        title: "Configurability vs administration time",
        description:
          "Growing teams rarely have an administrator, so defaults matter.",
        icon: "settings",
      },
      {
        id: "migration",
        title: "Switching cost",
        description:
          "Export quality and integration depth determine how painful a later move is.",
        icon: "database",
      },
    ],
    implementation: [
      {
        id: "minimum",
        title: "Start with the minimum",
        description: "Contacts, one pipeline, and email sync before anything else.",
        icon: "check",
      },
      {
        id: "adoption",
        title: "Make adoption the goal",
        description: "A partially used CRM produces unreliable data.",
        icon: "users",
      },
      {
        id: "cost",
        title: "Model cost at your next headcount",
        description: "Check the price at double your current seat count.",
        icon: "chart",
      },
      {
        id: "export",
        title: "Check the exit",
        description: "Confirm how data comes out before you commit.",
        icon: "database",
      },
    ],
    vendorQuestions: [
      {
        group: "Adoption",
        questions: [
          "How long does a typical setup take without professional services?",
          "What does onboarding include on our plan?",
        ],
      },
      {
        group: "Growth",
        questions: [
          "Which features unlock at the next plan tier?",
          "Can permissions and automation be added later without migrating?",
        ],
      },
      {
        group: "Cost",
        questions: [
          "What is the cost at double our current headcount?",
          "Are there minimum seat counts or annual commitments?",
        ],
      },
      {
        group: "Data",
        questions: [
          "How do we import existing data?",
          "How complete is the export if we leave?",
        ],
      },
    ],
    relatedUseCaseSlugs: [
      "pipeline-led-sales",
      "relationship-management",
      "high-volume-lead-management",
    ],
    relatedCapabilitySlugs: [
      "contact-management",
      "pipeline-management",
      "integrations",
    ],
    faq: [
      {
        question: "What should a growing {industry} team buy first?",
        answer:
          "The smallest setup people will actually use: shared contacts, one pipeline, and email sync. Add automation and reporting once that is habitual.",
      },
      {
        question: "Should we buy for today or for where we are going?",
        answer:
          "Buy for adoption today, but check that the next plan tier covers the capabilities you expect to need. Unused capability you paid for is as wasteful as a tool you outgrow.",
      },
      {
        question: "How do we avoid a migration in two years?",
        answer:
          "Check what the next tier unlocks, whether permissions and automation can be added without restructuring, and how clean the export is.",
      },
      {
        question: "Which CRM is best for a growing team?",
        answer: NO_UNIVERSAL_BEST_ANSWER,
      },
    ],
    matrixFeatureSlugs: [
      "contact-management",
      "pipeline-management",
      "email-sync",
      "custom-fields",
      "workflow-automation",
      "reporting",
      "mobile-app",
      "integrations",
    ],
    screenshotMatchTerms: ["contact", "pipeline", "dashboard", "setup", "mobile"],
  },
];

const BY_SLUG = new Map(CRM_USE_CASES.map((item) => [item.slug, item]));

export function getCrmUseCaseDefinition(
  slug: string,
): CrmUseCaseDefinition | null {
  return BY_SLUG.get(slug) ?? null;
}
