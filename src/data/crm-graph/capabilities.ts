/**
 * Shared CRM capability definitions.
 *
 * These are industry-agnostic decision frameworks. `{industry}` placeholders are
 * replaced with the industry display name by the synthesizers. Nothing here may
 * assert product support, scores, prices, or compliance posture — product
 * evidence is resolved from catalogue + enrichment at build time.
 */

export type CrmCapabilityRequirementDefinition = {
  id: string;
  name: string;
  description: string;
  priority: "core" | "advanced" | "optional";
  /** Canonical feature slug for evidence cells. Omit when no honest proxy exists. */
  featureSlug?: string;
  /** Buyer requirement page slug when one exists. */
  requirementSlug?: string;
  icon?: string;
};

export type CrmCapabilityTradeoff = {
  id: string;
  title: string;
  description: string;
  icon?: string;
};

export type CrmCapabilityDefinition = {
  slug: string;
  name: string;
  icon: string;
  /** Industry hub priority id this capability answers. */
  hubPriorityId:
    | "relationships"
    | "pipeline"
    | "automation"
    | "reporting"
    | "integrations"
    | "security";
  /** Methodology criterion slug for approved score lookup, when one applies. */
  criterionSlug?: string;
  glance: {
    importanceLabel: string;
    coreObjective: string;
    importantRequirementLabels: string[];
  };
  /** Paragraph templates — may contain `{industry}`. */
  whyItMatters: string[];
  weakProcessRisks: string[];
  evaluationDimensions: string[];
  requirements: CrmCapabilityRequirementDefinition[];
  matrixFeatureSlugs: string[];
  relatedCapabilitySlugs: string[];
  vendorQuestions: string[];
  /** FAQ templates — questions and answers may contain `{industry}`. */
  faq: Array<{ question: string; answer: string }>;
  tradeoffs: CrmCapabilityTradeoff[];
  outcomes: Array<{ id: string; label: string }>;
  implementation: Array<{
    id: string;
    title: string;
    description: string;
    icon?: string;
  }>;
  screenshotMatchTerms: string[];
};

const NO_UNIVERSAL_BEST_ANSWER =
  "No. Fit depends on how your team works, which requirements are must-haves, and what the CRM has to integrate with. Use the requirement matrix and CRM Finder to build a shortlist rather than starting from a ranking.";

export const CRM_CAPABILITIES: CrmCapabilityDefinition[] = [
  {
    slug: "contact-management",
    name: "Contact management",
    icon: "users",
    hubPriorityId: "relationships",
    criterionSlug: "contact-management",
    glance: {
      importanceLabel: "High",
      coreObjective:
        "Keep one reliable record of every contact, account, and interaction",
      importantRequirementLabels: [
        "Records",
        "History",
        "Email sync",
        "Custom fields",
      ],
    },
    whyItMatters: [
      "Contact management is the foundation of every other CRM capability. For {industry} teams it decides whether anyone can answer basic questions — who owns this relationship, what was last discussed, and what happens next.",
      "When contact data lives in inboxes, spreadsheets, and individual memory, {industry} teams duplicate work and lose context at handovers. A shared record makes relationship history a team asset rather than a personal one.",
      "Products differ less in whether they store contacts and more in how they model accounts, relationships, custom data, and interaction history. Compare those specifics against your own record structure.",
    ],
    weakProcessRisks: [
      "Duplicate records",
      "Lost interaction history",
      "Unclear ownership",
      "Data trapped in inboxes",
    ],
    evaluationDimensions: [
      "Contact and account records",
      "Relationship structure",
      "Interaction history",
      "Email and calendar sync",
      "Custom fields",
      "Segmentation and lists",
      "Duplicate handling",
      "Import and export",
    ],
    requirements: [
      {
        id: "contact-records",
        name: "Contact and account records",
        description:
          "Store people alongside the organizations and accounts they belong to.",
        priority: "core",
        featureSlug: "contact-management",
        icon: "users",
      },
      {
        id: "interaction-history",
        name: "Interaction history",
        description:
          "See emails, calls, meetings, and notes on a single timeline.",
        priority: "core",
        featureSlug: "contact-management",
        requirementSlug: "track-client-interactions",
        icon: "clock",
      },
      {
        id: "email-sync",
        name: "Email and calendar sync",
        description:
          "Capture correspondence automatically instead of relying on manual logging.",
        priority: "core",
        featureSlug: "email-sync",
        requirementSlug: "integrate-with-email",
        icon: "mail",
      },
      {
        id: "custom-fields",
        name: "Custom fields",
        description:
          "Record the attributes your team actually uses to segment and qualify.",
        priority: "advanced",
        featureSlug: "custom-fields",
        requirementSlug: "customize-record-fields",
        icon: "settings",
      },
      {
        id: "segmentation",
        name: "Segmentation and lists",
        description:
          "Filter and group contacts for outreach, reviews, and reporting.",
        priority: "advanced",
        featureSlug: "contact-management",
        icon: "filter",
      },
      {
        id: "record-access",
        name: "Record-level access control",
        description:
          "Limit who can see or edit sensitive relationship data where required.",
        priority: "advanced",
        requirementSlug: "restrict-access-by-team",
        icon: "shield",
      },
    ],
    matrixFeatureSlugs: [
      "contact-management",
      "lead-management",
      "email-sync",
      "custom-fields",
      "email-tracking",
      "mobile-app",
      "integrations",
    ],
    relatedCapabilitySlugs: [
      "pipeline-management",
      "workflow-automation",
      "reporting",
      "integrations",
      "security-administration",
    ],
    vendorQuestions: [
      "How are contacts, companies, and accounts related in the data model?",
      "Which interactions are logged automatically versus manually?",
      "How does email and calendar sync work, and for which mail providers?",
      "How many custom fields can we add, and on which record types?",
      "How are duplicate records detected and merged?",
      "Can access to specific records or fields be restricted?",
      "How do imports and exports work, and are there volume limits?",
      "Which contact-management functionality requires a higher plan?",
    ],
    faq: [
      {
        question: "What is contact management in a CRM?",
        answer:
          "Contact management is how a CRM stores people, the accounts they belong to, and the history of interactions with them — so the record, not an individual inbox, is the source of truth.",
      },
      {
        question: "Why does contact management matter for {industry} teams?",
        answer:
          "It determines whether anyone can pick up a relationship without re-learning it. For {industry} teams that share accounts across roles, a complete shared history is usually the difference between a smooth handover and a lost thread.",
      },
      {
        question: "What is the difference between contact management and a contact database?",
        answer:
          "A database stores names and details. Contact management adds relationships, ownership, interaction history, and the workflows that keep those records current.",
      },
      {
        question: "Do we need custom fields?",
        answer:
          "You need them once your qualification or segmentation depends on attributes the default record does not capture. If standard fields already describe your contacts, custom fields can wait.",
      },
      {
        question: "Is there one best CRM for contact management?",
        answer: NO_UNIVERSAL_BEST_ANSWER,
      },
    ],
    tradeoffs: [
      {
        id: "simplicity",
        title: "Simple records vs rich data model",
        description:
          "Flexible data models capture more nuance but need someone to own field definitions and data quality.",
        icon: "settings",
      },
      {
        id: "automatic-capture",
        title: "Automatic capture vs control",
        description:
          "Automatic email and calendar sync keeps history complete but pulls in more data than some teams want stored.",
        icon: "mail",
      },
      {
        id: "openness",
        title: "Open access vs restricted visibility",
        description:
          "Broad visibility helps collaboration; restricted records protect sensitive relationships but add administration.",
        icon: "shield",
      },
    ],
    outcomes: [
      { id: "single-record", label: "Find one record per contact" },
      { id: "history", label: "See the full interaction history" },
      { id: "owner", label: "Know who owns the relationship" },
      { id: "context", label: "Pick up a relationship after a handover" },
      { id: "segment", label: "Segment contacts for outreach" },
      { id: "export", label: "Export contact data when needed" },
    ],
    implementation: [
      {
        id: "model",
        title: "Agree the record model",
        description:
          "Decide how contacts, companies, and accounts relate before importing.",
        icon: "database",
      },
      {
        id: "fields",
        title: "Define required fields",
        description: "Keep the required set small enough that people fill it in.",
        icon: "settings",
      },
      {
        id: "dedupe",
        title: "Clean before you migrate",
        description: "Deduplicate existing data rather than importing the mess.",
        icon: "filter",
      },
      {
        id: "sync",
        title: "Set up email sync early",
        description: "Automatic capture drives adoption more than training does.",
        icon: "mail",
      },
      {
        id: "ownership",
        title: "Assign data ownership",
        description: "Name who maintains fields, lists, and duplicate rules.",
        icon: "users",
      },
    ],
    screenshotMatchTerms: ["contact", "account", "record", "timeline", "activity"],
  },
  {
    slug: "pipeline-management",
    name: "Pipeline management",
    icon: "funnel",
    hubPriorityId: "pipeline",
    criterionSlug: "pipeline-management",
    glance: {
      importanceLabel: "High",
      coreObjective:
        "Move opportunities through stages with clear ownership and next actions",
      importantRequirementLabels: [
        "Stages",
        "Ownership",
        "Follow-ups",
        "Visibility",
      ],
    },
    whyItMatters: [
      "Pipeline management is where a {industry} sales or business-development process becomes visible. Stages, ownership, and next actions turn individual effort into a process that a manager can inspect.",
      "Without structured stages, {industry} teams lose deals to silence rather than to competitors — nobody notices an opportunity that simply stopped moving.",
      "The right setup mirrors how your team actually sells, not a generic template. Compare products on stage flexibility, ownership rules, activity tracking, and whether separate processes can coexist.",
    ],
    weakProcessRisks: [
      "Stalled opportunities",
      "Missed follow-ups",
      "Unclear ownership",
      "No reliable pipeline view",
    ],
    evaluationDimensions: [
      "Opportunity stages",
      "Multiple pipelines",
      "Deal ownership",
      "Activities and follow-ups",
      "Pipeline visibility",
      "Stage automation",
      "Forecasting signals",
    ],
    requirements: [
      {
        id: "custom-stages",
        name: "Configurable stages",
        description:
          "Adapt stages to your real process instead of a default funnel.",
        priority: "core",
        featureSlug: "pipeline-management",
        icon: "funnel",
      },
      {
        id: "deal-records",
        name: "Deal and opportunity records",
        description:
          "Track value, expected close, and linked contacts on each opportunity.",
        priority: "core",
        featureSlug: "deal-management",
        icon: "briefcase",
      },
      {
        id: "ownership",
        name: "Deal ownership",
        description: "Give every opportunity a named owner and clear handoffs.",
        priority: "core",
        featureSlug: "deal-management",
        icon: "users",
      },
      {
        id: "follow-ups",
        name: "Activity and follow-up tracking",
        description: "Keep the next action visible and assigned on every deal.",
        priority: "core",
        featureSlug: "pipeline-management",
        icon: "check",
      },
      {
        id: "multiple-pipelines",
        name: "Multiple pipelines",
        description:
          "Run distinct processes separately when they differ materially.",
        priority: "advanced",
        featureSlug: "custom-pipelines",
        requirementSlug: "separate-sales-processes",
        icon: "layers",
      },
      {
        id: "stage-automation",
        name: "Stage-based automation",
        description: "Trigger tasks or updates as opportunities change stage.",
        priority: "advanced",
        featureSlug: "workflow-automation",
        requirementSlug: "automate-lead-follow-up",
        icon: "zap",
      },
      {
        id: "forecast",
        name: "Pipeline forecasting",
        description: "Turn pipeline data into a forward view for planning.",
        priority: "advanced",
        featureSlug: "forecasting",
        requirementSlug: "forecast-revenue",
        icon: "chart",
      },
    ],
    matrixFeatureSlugs: [
      "pipeline-management",
      "custom-pipelines",
      "deal-management",
      "lead-management",
      "workflow-automation",
      "forecasting",
      "reporting",
    ],
    relatedCapabilitySlugs: [
      "contact-management",
      "workflow-automation",
      "reporting",
      "integrations",
    ],
    vendorQuestions: [
      "Can we configure stages ourselves, without professional services?",
      "Can different teams use different pipelines, and how many are allowed?",
      "How is deal ownership assigned and reassigned?",
      "How does the product surface stalled or overdue opportunities?",
      "Which stage changes can trigger automation?",
      "Can we report on stage movement and conversion between stages?",
      "How does forecasting use pipeline data?",
      "Which pipeline functionality requires a higher plan?",
    ],
    faq: [
      {
        question: "What is CRM pipeline management?",
        answer:
          "It is how a CRM tracks opportunities through stages, with ownership, activities, and visibility, so work progresses consistently and can be reported on.",
      },
      {
        question: "Why does pipeline management matter for {industry} teams?",
        answer:
          "{industry} opportunities usually pass through several steps and people. Structured stages keep ownership and next actions explicit instead of implicit.",
      },
      {
        question: "How many pipeline stages should we have?",
        answer:
          "Enough to reflect real decision points and no more. Stages that nobody can define an exit criterion for tend to become parking spaces.",
      },
      {
        question: "Do we need multiple pipelines?",
        answer:
          "Only when processes genuinely differ in their stages. Many teams start with one well-designed pipeline and split it later.",
      },
      {
        question: "What is the difference between pipeline management and workflow automation?",
        answer:
          "Pipeline management structures the stages and ownership. Workflow automation reacts to changes in those records by creating tasks or updates.",
      },
      {
        question: "Is there one best CRM for pipeline management?",
        answer: NO_UNIVERSAL_BEST_ANSWER,
      },
    ],
    tradeoffs: [
      {
        id: "simplicity",
        title: "Simplicity vs customization",
        description:
          "Highly configurable pipelines fit complex processes but need ongoing administration.",
        icon: "settings",
      },
      {
        id: "adoption",
        title: "Ease of adoption vs process depth",
        description:
          "A simple board is quicker to adopt; deeper process controls take longer to land.",
        icon: "users",
      },
      {
        id: "automation",
        title: "Automation vs control",
        description:
          "Automating stage actions improves consistency but needs someone owning the rules.",
        icon: "zap",
      },
      {
        id: "plan",
        title: "Capability vs plan tier",
        description:
          "Multiple pipelines, automation, and forecasting are often gated to higher plans.",
        icon: "chart",
      },
    ],
    outcomes: [
      { id: "active", label: "See which opportunities are active" },
      { id: "owner", label: "Know who owns each opportunity" },
      { id: "next", label: "See the next action on every deal" },
      { id: "stalled", label: "Spot stalled opportunities early" },
      { id: "consistency", label: "Move deals through consistent stages" },
      { id: "report", label: "Report on pipeline status and movement" },
    ],
    implementation: [
      {
        id: "design",
        title: "Design the process first",
        description: "Define stages and exit criteria before configuring software.",
        icon: "funnel",
      },
      {
        id: "ownership",
        title: "Decide ownership rules",
        description: "Agree who owns deals at each stage and after a handover.",
        icon: "users",
      },
      {
        id: "activities",
        title: "Make next actions mandatory",
        description: "A stage without a next action is where deals go quiet.",
        icon: "check",
      },
      {
        id: "reporting",
        title: "Agree the management view",
        description: "Decide what leadership needs to see weekly.",
        icon: "chart",
      },
      {
        id: "automation",
        title: "Automate last",
        description: "Add automation once the process is stable.",
        icon: "zap",
      },
    ],
    screenshotMatchTerms: ["pipeline", "deal", "kanban", "stage", "opportunity"],
  },
  {
    slug: "workflow-automation",
    name: "Workflow automation",
    icon: "zap",
    hubPriorityId: "automation",
    criterionSlug: "sales-automation",
    glance: {
      importanceLabel: "Medium–High",
      coreObjective:
        "Remove repetitive administration and make follow-up consistent",
      importantRequirementLabels: [
        "Triggers",
        "Actions",
        "Sequences",
        "Assignment",
      ],
    },
    whyItMatters: [
      "Automation is how {industry} teams keep process discipline without adding administrators. Reminders, assignments, and follow-ups happen because a rule fired, not because someone remembered.",
      "Manual follow-up degrades under load. When volumes rise, {industry} teams lose the newest and least urgent-looking work first — exactly the work automation protects.",
      "Products differ sharply in what can trigger a rule, what actions are available, and which plan unlocks them. Compare against the two or three workflows you would automate first.",
    ],
    weakProcessRisks: [
      "Inconsistent follow-up",
      "Manual data entry",
      "Leads left unassigned",
      "Process depends on individuals",
    ],
    evaluationDimensions: [
      "Trigger types",
      "Available actions",
      "Conditional logic",
      "Record assignment rules",
      "Email sequences",
      "Automation limits by plan",
      "Testing and visibility",
    ],
    requirements: [
      {
        id: "triggers",
        name: "Rule triggers",
        description:
          "Start workflows from record changes, stage moves, dates, or form submissions.",
        priority: "core",
        featureSlug: "workflow-automation",
        icon: "zap",
      },
      {
        id: "task-creation",
        name: "Automated tasks and reminders",
        description: "Create the follow-up work automatically and assign it.",
        priority: "core",
        featureSlug: "workflow-automation",
        requirementSlug: "automate-lead-follow-up",
        icon: "check",
      },
      {
        id: "assignment",
        name: "Assignment and routing",
        description: "Route new records to the right owner without manual triage.",
        priority: "core",
        featureSlug: "sales-automation",
        icon: "users",
      },
      {
        id: "sequences",
        name: "Email sequences",
        description:
          "Send timed follow-up email steps that stop when someone replies.",
        priority: "advanced",
        featureSlug: "email-sequences",
        icon: "mail",
      },
      {
        id: "conditions",
        name: "Conditional logic",
        description: "Branch workflows on record data rather than one linear path.",
        priority: "advanced",
        featureSlug: "workflow-automation",
        icon: "layers",
      },
      {
        id: "cross-system",
        name: "Cross-system actions",
        description:
          "Trigger updates in connected tools where integrations allow it.",
        priority: "advanced",
        featureSlug: "integrations",
        requirementSlug: "manage-integrations",
        icon: "puzzle",
      },
    ],
    matrixFeatureSlugs: [
      "workflow-automation",
      "sales-automation",
      "email-sequences",
      "email-tracking",
      "lead-management",
      "integrations",
      "reporting",
    ],
    relatedCapabilitySlugs: [
      "pipeline-management",
      "contact-management",
      "integrations",
      "reporting",
    ],
    vendorQuestions: [
      "What can trigger an automation, and are date-based triggers supported?",
      "Which actions are available — tasks, field updates, emails, notifications?",
      "Does automation support conditional branching?",
      "How are records assigned automatically, and can rules differ by team?",
      "How many active workflows or monthly executions does each plan allow?",
      "Can we test a workflow safely before enabling it?",
      "How do we see what an automation did to a record?",
      "Which automation features require a higher plan or an add-on?",
    ],
    faq: [
      {
        question: "What is CRM workflow automation?",
        answer:
          "It is rule-based work the CRM performs on your behalf — creating tasks, updating fields, assigning records, or sending emails when a defined condition is met.",
      },
      {
        question: "Why does automation matter for {industry} teams?",
        answer:
          "It keeps follow-up consistent as volume grows. For {industry} teams without dedicated operations staff, automation is usually the cheapest way to add process discipline.",
      },
      {
        question: "What should we automate first?",
        answer:
          "Start with the follow-up that costs you most when it is missed — typically new enquiry assignment and first response. Automate a stable process, not one you are still designing.",
      },
      {
        question: "What is the difference between workflow automation and email sequences?",
        answer:
          "Sequences send a timed series of emails to a person. Workflow automation acts on records more broadly — tasks, fields, assignment, and notifications.",
      },
      {
        question: "Does automation usually cost more?",
        answer:
          "Often. Automation is a common upgrade trigger, and plans may cap active workflows or monthly executions. Verify limits with vendors and check total cost for your team size.",
      },
      {
        question: "Is there one best CRM for automation?",
        answer: NO_UNIVERSAL_BEST_ANSWER,
      },
    ],
    tradeoffs: [
      {
        id: "consistency",
        title: "Consistency vs flexibility",
        description:
          "Strict automation standardizes behaviour but can fight genuine exceptions.",
        icon: "settings",
      },
      {
        id: "ownership",
        title: "Power vs ownership cost",
        description:
          "Capable builders need someone to maintain rules as the process changes.",
        icon: "users",
      },
      {
        id: "limits",
        title: "Capability vs plan limits",
        description:
          "Execution caps and workflow counts often matter more than the feature list.",
        icon: "chart",
      },
      {
        id: "opacity",
        title: "Automation vs transparency",
        description:
          "Rules that silently change records are hard to debug without good logs.",
        icon: "shield",
      },
    ],
    outcomes: [
      { id: "follow-up", label: "Follow up on every new enquiry" },
      { id: "assignment", label: "Assign records without manual triage" },
      { id: "admin", label: "Cut repetitive data entry" },
      { id: "consistency", label: "Apply the same process to every record" },
      { id: "escalation", label: "Escalate work that has gone quiet" },
      { id: "visibility", label: "See what automation changed" },
    ],
    implementation: [
      {
        id: "map",
        title: "Map the manual process",
        description: "Write down the steps a person takes today.",
        icon: "funnel",
      },
      {
        id: "start-small",
        title: "Start with one workflow",
        description: "Prove value on a single high-cost follow-up first.",
        icon: "zap",
      },
      {
        id: "data",
        title: "Check data quality",
        description: "Rules that read empty fields do nothing useful.",
        icon: "database",
      },
      {
        id: "test",
        title: "Test before enabling",
        description: "Run against a small set of records before going live.",
        icon: "check",
      },
      {
        id: "review",
        title: "Review on a schedule",
        description: "Retire rules that no longer match the process.",
        icon: "settings",
      },
    ],
    screenshotMatchTerms: ["automation", "workflow", "sequence", "trigger", "rule"],
  },
  {
    slug: "reporting",
    name: "Reporting and forecasting",
    icon: "chart",
    hubPriorityId: "reporting",
    criterionSlug: "reporting",
    glance: {
      importanceLabel: "Medium–High",
      coreObjective:
        "Turn CRM activity into decisions leadership can act on",
      importantRequirementLabels: [
        "Dashboards",
        "Custom reports",
        "Forecasts",
        "Export",
      ],
    },
    whyItMatters: [
      "Reporting is what makes CRM data useful beyond the person who entered it. For {industry} teams it answers whether pipeline coverage, activity, and conversion are healthy — or only look busy.",
      "Weak reporting pushes {industry} managers back into spreadsheets, which means the numbers in a review are stale and nobody trusts them.",
      "Compare how reports are built, what can be grouped and filtered, whether dashboards can be shared, and how much of it needs an analyst rather than a manager.",
    ],
    weakProcessRisks: [
      "Decisions made on stale numbers",
      "Shadow spreadsheets",
      "No conversion visibility",
      "Forecasts nobody trusts",
    ],
    evaluationDimensions: [
      "Standard reports",
      "Custom report building",
      "Dashboards and sharing",
      "Forecasting method",
      "Activity reporting",
      "Historical data and trends",
      "Export and BI access",
    ],
    requirements: [
      {
        id: "dashboards",
        name: "Dashboards",
        description: "Give each role a standing view of the numbers they own.",
        priority: "core",
        featureSlug: "reporting",
        icon: "chart",
      },
      {
        id: "custom-reports",
        name: "Custom reports",
        description:
          "Build reports on your own fields, filters, and groupings.",
        priority: "core",
        featureSlug: "reporting",
        icon: "settings",
      },
      {
        id: "pipeline-reporting",
        name: "Pipeline and conversion reporting",
        description:
          "Measure stage movement and conversion, not just current totals.",
        priority: "core",
        featureSlug: "analytics",
        icon: "funnel",
      },
      {
        id: "forecasting",
        name: "Forecasting",
        description: "Produce a forward revenue view from pipeline data.",
        priority: "advanced",
        featureSlug: "forecasting",
        requirementSlug: "forecast-revenue",
        icon: "trending",
      },
      {
        id: "activity-reporting",
        name: "Activity reporting",
        description:
          "Report on calls, emails, and meetings to explain pipeline changes.",
        priority: "advanced",
        featureSlug: "analytics",
        icon: "clock",
      },
      {
        id: "export",
        name: "Export and BI access",
        description:
          "Get data out for finance or a warehouse when reporting needs outgrow the CRM.",
        priority: "advanced",
        featureSlug: "api-access",
        requirementSlug: "manage-integrations",
        icon: "database",
      },
    ],
    matrixFeatureSlugs: [
      "reporting",
      "forecasting",
      "analytics",
      "pipeline-management",
      "deal-management",
      "custom-fields",
      "integrations",
    ],
    relatedCapabilitySlugs: [
      "pipeline-management",
      "workflow-automation",
      "contact-management",
      "integrations",
    ],
    vendorQuestions: [
      "Can a manager build a report without help from an administrator?",
      "Which fields and objects can reports be built on?",
      "Can dashboards be shared, scheduled, or restricted by role?",
      "How does forecasting work — weighted stages, manual commit, or both?",
      "How much history is retained and reportable?",
      "Can activity data be reported alongside pipeline data?",
      "How do we export data or connect a BI tool?",
      "Which reporting or forecasting features require a higher plan?",
    ],
    faq: [
      {
        question: "What should CRM reporting cover?",
        answer:
          "At minimum pipeline by stage, conversion between stages, activity levels, and a forward view. Anything else should answer a question someone actually asks in a review.",
      },
      {
        question: "Why does reporting matter for {industry} teams?",
        answer:
          "It replaces opinion with evidence. For {industry} teams, reporting is what shows whether the pipeline supports the target or only looks full.",
      },
      {
        question: "What is the difference between reporting and forecasting?",
        answer:
          "Reporting describes what has happened or is happening now. Forecasting projects a future outcome from that data, using stage probability, dates, or manual commitments.",
      },
      {
        question: "Can we trust CRM forecasts?",
        answer:
          "Only as far as the underlying data. Forecasts inherit whatever discipline exists around close dates, deal values, and stage hygiene.",
      },
      {
        question: "Do we still need a BI tool?",
        answer:
          "Usually not at first. It becomes worthwhile when you need CRM data joined to finance or product data, or history beyond what the CRM retains.",
      },
      {
        question: "Is there one best CRM for reporting?",
        answer: NO_UNIVERSAL_BEST_ANSWER,
      },
    ],
    tradeoffs: [
      {
        id: "flexibility",
        title: "Ready-made vs custom reports",
        description:
          "Prebuilt reports are quick to use; custom builders are more capable but need someone to learn them.",
        icon: "settings",
      },
      {
        id: "depth",
        title: "In-CRM reporting vs BI",
        description:
          "Native reporting is convenient; a warehouse handles cross-system analysis better.",
        icon: "database",
      },
      {
        id: "plan",
        title: "Reporting depth vs plan tier",
        description:
          "Custom reports, dashboards, and forecasting are common upgrade triggers.",
        icon: "chart",
      },
      {
        id: "data-quality",
        title: "Reporting quality vs data discipline",
        description:
          "No report compensates for missing close dates or unmaintained stages.",
        icon: "check",
      },
    ],
    outcomes: [
      { id: "pipeline-health", label: "See whether pipeline covers the target" },
      { id: "conversion", label: "Understand conversion between stages" },
      { id: "activity", label: "Explain results with activity data" },
      { id: "forecast", label: "Produce a forward revenue view" },
      { id: "share", label: "Give each role its own dashboard" },
      { id: "export", label: "Export data for finance or BI" },
    ],
    implementation: [
      {
        id: "questions",
        title: "Start from the questions",
        description: "List the decisions reports must support, then build back.",
        icon: "faq",
      },
      {
        id: "definitions",
        title: "Agree definitions",
        description: "Define qualified, won, and close date once, in writing.",
        icon: "settings",
      },
      {
        id: "hygiene",
        title: "Fix data hygiene first",
        description: "Reports expose data problems rather than solving them.",
        icon: "database",
      },
      {
        id: "cadence",
        title: "Set a review cadence",
        description: "A dashboard nobody opens weekly will not stay accurate.",
        icon: "clock",
      },
      {
        id: "access",
        title: "Decide who sees what",
        description: "Agree which reports are open and which are restricted.",
        icon: "shield",
      },
    ],
    screenshotMatchTerms: ["report", "dashboard", "forecast", "analytics", "chart"],
  },
  {
    slug: "integrations",
    name: "Integrations",
    icon: "puzzle",
    hubPriorityId: "integrations",
    criterionSlug: "integrations",
    glance: {
      importanceLabel: "High",
      coreObjective:
        "Connect the CRM to the tools your team already works in",
      importantRequirementLabels: [
        "Email",
        "Calendar",
        "Native apps",
        "API",
      ],
    },
    whyItMatters: [
      "A CRM that does not connect to the tools {industry} teams already use becomes a second place to type things. Integrations decide whether the CRM reflects reality automatically.",
      "Email, calendar, and phone are usually the integrations that determine adoption. Accounting, marketing, and operational systems then decide how much manual reconciliation remains.",
      "Compare native integrations against your actual stack, and check what the API allows when a native connector does not exist.",
    ],
    weakProcessRisks: [
      "Double data entry",
      "Records that drift out of date",
      "Manual reconciliation",
      "Low adoption",
    ],
    evaluationDimensions: [
      "Email and calendar integration",
      "Native integration catalogue",
      "Integration depth and direction",
      "API access and limits",
      "Webhooks and events",
      "Middleware support",
      "Administration and monitoring",
    ],
    requirements: [
      {
        id: "email-calendar",
        name: "Email and calendar integration",
        description:
          "Sync correspondence and meetings so history stays current automatically.",
        priority: "core",
        featureSlug: "email-sync",
        requirementSlug: "integrate-with-email",
        icon: "mail",
      },
      {
        id: "native-apps",
        name: "Native integrations for your stack",
        description:
          "Prebuilt connectors for the systems your team depends on daily.",
        priority: "core",
        featureSlug: "integrations",
        requirementSlug: "manage-integrations",
        icon: "puzzle",
      },
      {
        id: "api",
        name: "API access",
        description:
          "Build or extend connections where no native integration exists.",
        priority: "advanced",
        featureSlug: "api-access",
        icon: "code",
      },
      {
        id: "sync-direction",
        name: "Two-way sync where it matters",
        description:
          "Confirm which direction data flows and which system wins on conflict.",
        priority: "advanced",
        featureSlug: "integrations",
        icon: "layers",
      },
      {
        id: "monitoring",
        name: "Integration monitoring",
        description:
          "See when a connection fails before the data silently goes stale.",
        priority: "advanced",
        featureSlug: "integrations",
        icon: "shield",
      },
    ],
    matrixFeatureSlugs: [
      "integrations",
      "email-sync",
      "api-access",
      "email-tracking",
      "call-functionality",
      "mobile-app",
      "workflow-automation",
    ],
    relatedCapabilitySlugs: [
      "contact-management",
      "workflow-automation",
      "reporting",
      "security-administration",
    ],
    vendorQuestions: [
      "Which of our current tools have native integrations?",
      "Which mail and calendar providers are supported, and how deeply?",
      "Is each integration one-way or two-way, and what wins on conflict?",
      "Is API access included, and what are the rate limits?",
      "Are webhooks available for record events?",
      "Who maintains the integration — the CRM vendor, the other vendor, or a third party?",
      "How are integration failures surfaced and retried?",
      "Which integrations require a higher plan or a separate cost?",
    ],
    faq: [
      {
        question: "Which CRM integrations matter most?",
        answer:
          "Email and calendar almost always come first, because they drive whether the CRM stays current. After that, prioritize the systems where you would otherwise re-enter data.",
      },
      {
        question: "Why do integrations matter for {industry} teams?",
        answer:
          "{industry} teams rarely run on the CRM alone. Integrations decide how much of the day is spent moving information between systems by hand.",
      },
      {
        question: "What is the difference between a native integration and an API?",
        answer:
          "A native integration is a supported connector you configure. An API lets you build a connection yourself, which is more flexible but becomes something you own and maintain.",
      },
      {
        question: "Is a large integration directory a good sign?",
        answer:
          "Only if it includes your tools and the depth is real. A short list of deep, well-maintained integrations beats a long list of shallow ones.",
      },
      {
        question: "Do integrations cost extra?",
        answer:
          "Sometimes. API access, premium connectors, or middleware may sit on higher plans or carry separate fees. Confirm before shortlisting.",
      },
      {
        question: "Is there one best CRM for integrations?",
        answer: NO_UNIVERSAL_BEST_ANSWER,
      },
    ],
    tradeoffs: [
      {
        id: "native-vs-api",
        title: "Native connectors vs custom builds",
        description:
          "Native integrations are cheaper to run; custom builds fit better but become your maintenance burden.",
        icon: "code",
      },
      {
        id: "suite",
        title: "Suite consolidation vs best-of-breed",
        description:
          "A single vendor reduces integration work but may be weaker in individual areas.",
        icon: "layers",
      },
      {
        id: "sync",
        title: "Two-way sync vs data integrity",
        description:
          "Bidirectional sync is convenient but multiplies conflict and duplication risk.",
        icon: "settings",
      },
      {
        id: "middleware",
        title: "Middleware vs direct connections",
        description:
          "Middleware fills gaps quickly and adds another dependency and cost line.",
        icon: "puzzle",
      },
    ],
    outcomes: [
      { id: "no-retyping", label: "Stop re-entering the same data" },
      { id: "email", label: "Keep email and meetings on the record" },
      { id: "current", label: "Keep connected systems current" },
      { id: "extend", label: "Extend the CRM where needed" },
      { id: "monitor", label: "Notice when a connection breaks" },
    ],
    implementation: [
      {
        id: "inventory",
        title: "Inventory the stack",
        description: "List every system that holds customer data today.",
        icon: "database",
      },
      {
        id: "priority",
        title: "Rank by daily use",
        description: "Integrate what the team touches every day first.",
        icon: "funnel",
      },
      {
        id: "source-of-truth",
        title: "Name the source of truth",
        description: "Decide which system wins for each shared field.",
        icon: "settings",
      },
      {
        id: "verify",
        title: "Verify depth in a trial",
        description: "Test the actual fields and directions you need.",
        icon: "check",
      },
      {
        id: "ownership",
        title: "Assign an owner",
        description: "Integrations need someone watching them after go-live.",
        icon: "users",
      },
    ],
    screenshotMatchTerms: [
      "integration",
      "marketplace",
      "connect",
      "api",
      "app",
    ],
  },
  {
    slug: "security-administration",
    name: "Security and administration",
    icon: "shield",
    hubPriorityId: "security",
    glance: {
      importanceLabel: "Medium–High",
      coreObjective:
        "Control who can see, change, and export customer data",
      importantRequirementLabels: [
        "Permissions",
        "SSO",
        "Audit logs",
        "Export control",
      ],
    },
    whyItMatters: [
      "Access control is what lets a {industry} team share a CRM without sharing everything. Permissions decide who sees which records, and who can take the data with them.",
      "Administration effort is a real cost. As {industry} teams grow, the question shifts from what the CRM can do to who is responsible for configuring it and reviewing access.",
      "Requirements vary by organization and jurisdiction. Treat this section as an evaluation framework and confirm security and regulatory specifics directly with shortlisted vendors.",
    ],
    weakProcessRisks: [
      "Over-broad data access",
      "No record of who changed what",
      "Uncontrolled exports",
      "Orphaned accounts after leavers",
    ],
    evaluationDimensions: [
      "Role-based permissions",
      "Record and field-level access",
      "Single sign-on",
      "Audit logging",
      "Export controls",
      "Admin roles and delegation",
      "Vendor security documentation",
    ],
    requirements: [
      {
        id: "roles",
        name: "Role-based permissions",
        description:
          "Grant access by role rather than giving everyone the same view.",
        priority: "core",
        featureSlug: "role-permissions",
        requirementSlug: "restrict-access-by-team",
        icon: "shield",
      },
      {
        id: "record-access",
        name: "Record and field-level access",
        description:
          "Restrict sensitive records or fields to the teams that need them.",
        priority: "core",
        featureSlug: "role-permissions",
        icon: "lock",
      },
      {
        id: "field-config",
        name: "Controlled field configuration",
        description:
          "Decide who can change the data model, not just the data.",
        priority: "core",
        featureSlug: "custom-fields",
        requirementSlug: "customize-record-fields",
        icon: "settings",
      },
      {
        id: "sso",
        name: "Single sign-on",
        description:
          "Authenticate through your identity provider and centralize offboarding.",
        priority: "advanced",
        featureSlug: "sso",
        requirementSlug: "support-sso",
        icon: "key",
      },
      {
        id: "audit",
        name: "Audit logging",
        description:
          "Keep a record of access and changes for review and investigation.",
        priority: "advanced",
        featureSlug: "audit-logs",
        requirementSlug: "audit-user-activity",
        icon: "clock",
      },
      {
        id: "export-control",
        name: "Export controls",
        description:
          "Limit and monitor who can extract the customer database.",
        priority: "advanced",
        featureSlug: "role-permissions",
        icon: "database",
      },
    ],
    matrixFeatureSlugs: [
      "role-permissions",
      "sso",
      "audit-logs",
      "custom-fields",
      "integrations",
      "api-access",
    ],
    relatedCapabilitySlugs: [
      "contact-management",
      "integrations",
      "reporting",
      "pipeline-management",
    ],
    vendorQuestions: [
      "How are permissions structured — roles, teams, hierarchy, or a mix?",
      "Can access be restricted at record and field level?",
      "Is single sign-on available, with which identity providers, and on which plan?",
      "What is logged in the audit trail, and how long is it retained?",
      "Can data export be limited to specific roles?",
      "How are users deprovisioned when someone leaves?",
      "What security documentation do you publish for review?",
      "Which administration and security features require a higher plan?",
    ],
    faq: [
      {
        question: "What should CRM permissions cover?",
        answer:
          "Who can view, edit, delete, and export records — plus who can change configuration. Roles alone are often not enough once teams need separated visibility.",
      },
      {
        question: "Why does administration matter for {industry} teams?",
        answer:
          "Someone has to own configuration, access reviews, and data quality. For {industry} teams without a dedicated administrator, low administration overhead is itself a selection criterion.",
      },
      {
        question: "Do we need single sign-on?",
        answer:
          "It becomes valuable once you have an identity provider and enough users that manual account management is a risk. It is frequently restricted to higher plans.",
      },
      {
        question: "What are audit logs used for?",
        answer:
          "Answering who accessed or changed a record, and when. They matter most for investigations, access reviews, and internal accountability.",
      },
      {
        question: "Does this page tell us whether a CRM is compliant?",
        answer:
          "No. Compliance depends on your obligations, configuration, and contracts. This is an evaluation framework — verify regulatory requirements with vendors and your own advisers.",
      },
      {
        question: "Is there one best CRM for security and administration?",
        answer: NO_UNIVERSAL_BEST_ANSWER,
      },
    ],
    tradeoffs: [
      {
        id: "openness",
        title: "Collaboration vs restriction",
        description:
          "Open access speeds up collaboration; tighter restrictions protect data and add administration.",
        icon: "users",
      },
      {
        id: "granularity",
        title: "Granularity vs maintainability",
        description:
          "Very fine-grained permissions are precise and quickly become hard to reason about.",
        icon: "settings",
      },
      {
        id: "plan",
        title: "Controls vs plan tier",
        description:
          "SSO, audit logs, and advanced permissions are common enterprise-tier features.",
        icon: "chart",
      },
      {
        id: "admin",
        title: "Capability vs administrator time",
        description:
          "Configurable platforms need an owner; without one, controls drift out of date.",
        icon: "shield",
      },
    ],
    outcomes: [
      { id: "least-privilege", label: "Give people only the access they need" },
      { id: "sensitive", label: "Protect sensitive records" },
      { id: "identity", label: "Manage access from your identity provider" },
      { id: "accountability", label: "See who changed or accessed a record" },
      { id: "offboarding", label: "Remove access cleanly when people leave" },
      { id: "export", label: "Control who can export the database" },
    ],
    implementation: [
      {
        id: "roles",
        title: "Define roles before users",
        description: "Agree the access each role needs, then assign people.",
        icon: "users",
      },
      {
        id: "sensitive-data",
        title: "Identify sensitive data",
        description: "Decide which fields and records need restriction.",
        icon: "lock",
      },
      {
        id: "admin-owner",
        title: "Name an administrator",
        description: "Configuration and access reviews need a named owner.",
        icon: "shield",
      },
      {
        id: "joiners-leavers",
        title: "Document joiner and leaver steps",
        description: "Make offboarding a checklist, not a memory exercise.",
        icon: "check",
      },
      {
        id: "review",
        title: "Review access periodically",
        description: "Permissions granted for a project rarely get removed.",
        icon: "clock",
      },
    ],
    screenshotMatchTerms: [
      "permission",
      "role",
      "user",
      "security",
      "audit",
      "settings",
    ],
  },
];

const BY_SLUG = new Map(CRM_CAPABILITIES.map((item) => [item.slug, item]));

export function getCrmCapabilityDefinition(
  slug: string,
): CrmCapabilityDefinition | null {
  return BY_SLUG.get(slug) ?? null;
}
