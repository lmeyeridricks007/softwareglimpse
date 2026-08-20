/**
 * Shared CRM buyer-requirement definitions for Requirement Detail pages.
 *
 * A requirement is a buyer need ("we must be able to…"); features are the
 * product functionality that satisfies it. Product support comes from
 * enrichment at build time — nothing here asserts what a product does.
 *
 * `separate-sales-processes` and `automate-lead-follow-up` are hand-authored
 * elsewhere and intentionally absent.
 */

export type CrmRequirementFeatureLink = {
  featureSlug: string;
  name: string;
  relationship: "required" | "strongly-supporting" | "supporting" | "optional";
  rationale: string;
  icon?: string;
};

export type CrmRequirementDefinition = {
  slug: string;
  name: string;
  requirementType: string;
  requirementTypeLabel: string;
  typicalImportanceLabel: string;
  tagline: string;
  shortAnswer: string;
  buyerNeedDescription: string;
  primaryCapabilitySlug: string;
  primaryCapabilityName: string;
  featureLinks: CrmRequirementFeatureLink[];
  evaluationCriteria: Array<{
    id: string;
    name: string;
    description: string;
    featureSlugs: string[];
    importance: "required" | "important" | "supporting";
    icon?: string;
  }>;
  needGuidance: { needIf: string[]; mayNotNeedIf: string[] };
  whyItMatters: Array<{
    id: string;
    title: string;
    description: string;
    icon?: string;
  }>;
  scenarios: Array<{
    id: string;
    title: string;
    description: string;
    priorities: string[];
    icon?: string;
  }>;
  useCaseLinks: Array<{
    id: string;
    title: string;
    description: string;
    importanceLabel: string;
    icon?: string;
  }>;
  tradeoffs: Array<{
    id: string;
    title: string;
    description: string;
    icon?: string;
  }>;
  relatedRequirementSlugs: string[];
  relatedCapabilitySlugs: string[];
  vendorQuestions: string[];
  faq: Array<{ question: string; answer: string }>;
  matrixFeatureSlugs: string[];
  screenshotMatchTerms: string[];
};

const REQUIREMENT_VS_FEATURE_FAQ = {
  question: "What is the difference between a requirement and a CRM feature?",
  answer:
    "A requirement is what your team must be able to do. A feature is concrete product functionality that helps satisfy it. Several features usually contribute to one requirement, and support for a feature does not guarantee the requirement is met.",
};

export const CRM_REQUIREMENTS: CrmRequirementDefinition[] = [
  {
    slug: "restrict-access-by-team",
    name: "Restrict Access by Team",
    requirementType: "access-control",
    requirementTypeLabel: "Access control / administration",
    typicalImportanceLabel: "High (context-dependent)",
    tagline:
      "Compare how CRM platforms limit which records and fields each team can see, edit, and export.",
    shortAnswer:
      "If some records should not be visible to everyone, you need more than admin and non-admin roles. Look for record-level visibility rules, field-level restrictions where sensitive data exists, and controls on who can export — then check which plan those controls start on.",
    buyerNeedDescription:
      "Limit which records, fields, and actions each team or role can access, so a shared CRM does not mean shared visibility of everything.",
    primaryCapabilitySlug: "security",
    primaryCapabilityName: "Security",
    featureLinks: [
      {
        featureSlug: "role-permissions",
        name: "Role Permissions",
        relationship: "required",
        rationale:
          "Provides the role and record visibility model the requirement depends on.",
        icon: "shield",
      },
      {
        featureSlug: "custom-fields",
        name: "Custom Fields",
        relationship: "strongly-supporting",
        rationale:
          "Field-level restrictions are only meaningful where fields can be configured.",
        icon: "settings",
      },
      {
        featureSlug: "audit-logs",
        name: "Audit Logs",
        relationship: "supporting",
        rationale:
          "Confirms whether restrictions are working and who accessed what.",
        icon: "clock",
      },
      {
        featureSlug: "sso",
        name: "Single Sign-On",
        relationship: "supporting",
        rationale:
          "Centralizes who can authenticate at all, complementing in-app restrictions.",
        icon: "key",
      },
      {
        featureSlug: "integrations",
        name: "Integrations",
        relationship: "optional",
        rationale:
          "Connected systems can bypass CRM restrictions if not scoped carefully.",
        icon: "puzzle",
      },
    ],
    evaluationCriteria: [
      {
        id: "role-model",
        name: "Role and team model",
        description: "Can access be granted by role, team, or hierarchy?",
        featureSlugs: ["role-permissions"],
        importance: "required",
        icon: "shield",
      },
      {
        id: "record-visibility",
        name: "Record-level visibility",
        description:
          "Can users be limited to their own or their team's records?",
        featureSlugs: ["role-permissions"],
        importance: "required",
        icon: "lock",
      },
      {
        id: "field-level",
        name: "Field-level restrictions",
        description: "Can specific sensitive fields be hidden from some roles?",
        featureSlugs: ["role-permissions", "custom-fields"],
        importance: "important",
        icon: "settings",
      },
      {
        id: "export-control",
        name: "Export control",
        description: "Can exporting the database be limited to specific roles?",
        featureSlugs: ["role-permissions"],
        importance: "important",
        icon: "database",
      },
      {
        id: "verification",
        name: "Verifiability",
        description: "Can you confirm afterwards who accessed a record?",
        featureSlugs: ["audit-logs"],
        importance: "supporting",
        icon: "clock",
      },
    ],
    needGuidance: {
      needIf: [
        "Teams should only see the records they work on",
        "Some client data is sensitive within the organization",
        "Export of the customer database is a genuine risk",
        "Different roles need different edit rights",
        "You operate separate territories or business units",
      ],
      mayNotNeedIf: [
        "Everyone in a small team legitimately needs full access",
        "There is no meaningful sensitivity between records",
        "Nobody would maintain a permission model",
      ],
    },
    whyItMatters: [
      {
        id: "confidentiality",
        title: "Confidentiality",
        description:
          "Sensitive relationships stay visible only to the people who need them.",
        icon: "lock",
      },
      {
        id: "data-loss",
        title: "Data-loss risk",
        description:
          "Restricting export limits how much can leave with a departing employee.",
        icon: "database",
      },
      {
        id: "focus",
        title: "Focus",
        description:
          "Scoped views reduce noise for teams working a defined territory or segment.",
        icon: "funnel",
      },
      {
        id: "accountability",
        title: "Accountability",
        description:
          "Clear rights make it obvious who was able to change a record.",
        icon: "shield",
      },
    ],
    scenarios: [
      {
        id: "territories",
        title: "Teams working separate territories",
        description:
          "Each team should see its own accounts without browsing everyone else's.",
        priorities: ["Team scoping", "Record visibility", "Reporting by team"],
        icon: "layers",
      },
      {
        id: "sensitive-fields",
        title: "A few sensitive fields",
        description:
          "Most of the record is shared, but specific fields should be restricted.",
        priorities: ["Field-level control", "Auditability"],
        icon: "lock",
      },
      {
        id: "departures",
        title: "Concern about data leaving",
        description:
          "Export and bulk access need limiting before a departure, not after.",
        priorities: ["Export control", "Audit logs", "Offboarding process"],
        icon: "shield",
      },
    ],
    useCaseLinks: [
      {
        id: "relationship",
        title: "Relationship-led teams",
        description:
          "Shared relationship data still needs boundaries around sensitive accounts.",
        importanceLabel: "High",
        icon: "handshake",
      },
      {
        id: "complex",
        title: "Complex sales processes",
        description:
          "Approvals and stage rights usually depend on the permission model.",
        importanceLabel: "High",
        icon: "layers",
      },
      {
        id: "growing",
        title: "Growing teams",
        description:
          "Often optional at first, but worth confirming the product can add it later.",
        importanceLabel: "Optional at first",
        icon: "trending",
      },
    ],
    tradeoffs: [
      {
        id: "granularity",
        title: "Granularity vs maintainability",
        description:
          "Fine-grained rules are precise and become hard to reason about over time.",
        icon: "settings",
      },
      {
        id: "collaboration",
        title: "Restriction vs collaboration",
        description:
          "Tight visibility protects data and can slow internal handovers.",
        icon: "users",
      },
      {
        id: "plan",
        title: "Plan impact",
        description:
          "Record and field-level controls are commonly reserved for higher plans.",
        icon: "chart",
      },
    ],
    relatedRequirementSlugs: [
      "support-sso",
      "audit-user-activity",
      "customize-record-fields",
    ],
    relatedCapabilitySlugs: [
      "security",
      "contact-management",
      "integrations",
    ],
    vendorQuestions: [
      "How is the permission model structured — roles, teams, hierarchy?",
      "Can users be limited to their own or their team's records?",
      "Can individual fields be hidden from specific roles?",
      "Can exporting records be restricted?",
      "How many custom roles are supported?",
      "Do integrations respect the same restrictions?",
      "Which of these controls require a higher plan?",
    ],
    faq: [
      {
        question: "What does restricting access by team involve?",
        answer:
          "Defining which records, fields, and actions each role or team can reach — typically through roles, ownership rules, and export controls.",
      },
      REQUIREMENT_VS_FEATURE_FAQ,
      {
        question: "Is admin versus non-admin enough?",
        answer:
          "Rarely, once teams should not see each other's records. Two-level access usually means either over-exposure or people locked out of work they need.",
      },
      {
        question: "Does this requirement need a more expensive plan?",
        answer:
          "Often. Basic roles appear early; record-level and field-level control commonly sit on higher tiers. Verify against your specific need.",
      },
    ],
    matrixFeatureSlugs: [
      "role-permissions",
      "sso",
      "audit-logs",
      "custom-fields",
      "integrations",
    ],
    screenshotMatchTerms: ["permission", "role", "team", "access", "user"],
  },
  {
    slug: "forecast-revenue",
    name: "Forecast Revenue",
    requirementType: "reporting",
    requirementTypeLabel: "Reporting / planning",
    typicalImportanceLabel: "Medium–High (context-dependent)",
    tagline:
      "Compare how CRM platforms turn pipeline data into a forward revenue view — and what each product needs from your data to do it.",
    shortAnswer:
      "Forecasting depends as much on your data as on the product. You need deal values and close dates that people maintain, a stage model with meaningful probability, and reporting that can group the result. Check whether forecasts can span multiple pipelines and which plan includes them.",
    buyerNeedDescription:
      "Produce a forward view of expected revenue from pipeline data that leadership can plan resourcing and targets against.",
    primaryCapabilitySlug: "forecasting",
    primaryCapabilityName: "Forecasting",
    featureLinks: [
      {
        featureSlug: "forecasting",
        name: "Forecasting",
        relationship: "required",
        rationale: "Produces the projection itself.",
        icon: "trending",
      },
      {
        featureSlug: "deal-management",
        name: "Deal Management",
        relationship: "required",
        rationale: "Supplies value and close date, the inputs a forecast needs.",
        icon: "briefcase",
      },
      {
        featureSlug: "pipeline-management",
        name: "Pipeline Management",
        relationship: "strongly-supporting",
        rationale: "Stage structure is where probability weighting comes from.",
        icon: "funnel",
      },
      {
        featureSlug: "reporting",
        name: "Reporting",
        relationship: "strongly-supporting",
        rationale: "Lets forecasts be grouped, compared, and reviewed.",
        icon: "chart",
      },
      {
        featureSlug: "custom-pipelines",
        name: "Multiple Pipelines",
        relationship: "supporting",
        rationale:
          "Determines whether separate motions can be forecast together or only apart.",
        icon: "layers",
      },
      {
        featureSlug: "analytics",
        name: "Analytics",
        relationship: "optional",
        rationale: "Helps assess historical accuracy and conversion assumptions.",
        icon: "chart",
      },
    ],
    evaluationCriteria: [
      {
        id: "projection",
        name: "Forecast projection",
        description: "Can the product produce a period-based forward view?",
        featureSlugs: ["forecasting"],
        importance: "required",
        icon: "trending",
      },
      {
        id: "inputs",
        name: "Reliable inputs",
        description: "Are deal value and expected close date first-class fields?",
        featureSlugs: ["deal-management"],
        importance: "required",
        icon: "briefcase",
      },
      {
        id: "probability",
        name: "Stage probability",
        description: "Can probability be configured per stage or pipeline?",
        featureSlugs: ["pipeline-management", "custom-pipelines"],
        importance: "important",
        icon: "funnel",
      },
      {
        id: "grouping",
        name: "Forecast reporting",
        description: "Can forecasts be grouped by team, pipeline, or period?",
        featureSlugs: ["reporting"],
        importance: "important",
        icon: "chart",
      },
      {
        id: "accuracy",
        name: "Accuracy review",
        description: "Can past forecasts be compared with actual outcomes?",
        featureSlugs: ["analytics", "reporting"],
        importance: "supporting",
        icon: "check",
      },
    ],
    needGuidance: {
      needIf: [
        "Hiring or capacity decisions depend on expected revenue",
        "Leadership commits to a number each period",
        "Sales cycles are long enough that current pipeline is not the answer",
        "Several teams or pipelines need to be combined",
      ],
      mayNotNeedIf: [
        "Close dates are guesses nobody maintains",
        "Your cycle is short enough that open pipeline is the forecast",
        "Pipeline is small enough to review deal by deal",
      ],
    },
    whyItMatters: [
      {
        id: "planning",
        title: "Planning",
        description:
          "Resourcing and hiring decisions need a forward view, not a current snapshot.",
        icon: "trending",
      },
      {
        id: "early-warning",
        title: "Early warning",
        description:
          "A forecast gap shows up before the period ends, while there is still time.",
        icon: "clock",
      },
      {
        id: "accountability",
        title: "Accountability",
        description:
          "Comparing forecast with outcome improves judgement over time.",
        icon: "check",
      },
      {
        id: "hygiene",
        title: "Data discipline",
        description:
          "Forecasting creates a reason to keep close dates and values current.",
        icon: "database",
      },
    ],
    scenarios: [
      {
        id: "simple-forecast",
        title: "One team, one pipeline",
        description:
          "A weighted view of open deals by close date is usually enough.",
        priorities: ["Weighted pipeline", "Close-date discipline"],
        icon: "funnel",
      },
      {
        id: "multi-team",
        title: "Several teams or pipelines",
        description:
          "Forecasts must roll up across motions without double counting.",
        priorities: ["Cross-pipeline forecasts", "Grouping", "Permissions"],
        icon: "layers",
      },
      {
        id: "commit",
        title: "Owners submit commitments",
        description:
          "Leadership wants judgement alongside the calculated number.",
        priorities: ["Forecast categories", "Manual commit", "Accuracy tracking"],
        icon: "check",
      },
    ],
    useCaseLinks: [
      {
        id: "sales",
        title: "Pipeline-led sales teams",
        description: "Forecasting is usually part of the weekly review.",
        importanceLabel: "High",
        icon: "funnel",
      },
      {
        id: "complex",
        title: "Complex sales processes",
        description: "Long cycles make a forward view more valuable and harder.",
        importanceLabel: "High",
        icon: "layers",
      },
      {
        id: "growing",
        title: "Growing teams",
        description: "Often deferred until pipeline data is reliable.",
        importanceLabel: "Optional at first",
        icon: "trending",
      },
    ],
    tradeoffs: [
      {
        id: "method",
        title: "Automatic weighting vs manual commit",
        description:
          "Weighting is consistent; manual commitments capture judgement and invite optimism.",
        icon: "chart",
      },
      {
        id: "hygiene",
        title: "Forecast quality vs data discipline",
        description:
          "No forecasting feature compensates for close dates nobody updates.",
        icon: "check",
      },
      {
        id: "plan",
        title: "Plan impact",
        description:
          "Forecasting is frequently an upper-tier feature alongside custom reporting.",
        icon: "chart",
      },
    ],
    relatedRequirementSlugs: [
      "separate-sales-processes",
      "customize-record-fields",
    ],
    relatedCapabilitySlugs: ["reporting", "pipeline-management"],
    vendorQuestions: [
      "How is the forecast calculated?",
      "Can probability be configured per stage?",
      "Can owners submit a manual commitment alongside the calculation?",
      "Can forecasts span multiple pipelines or teams?",
      "Is forecast accuracy tracked over time?",
      "How much history is retained for comparison?",
      "Which plan includes forecasting?",
    ],
    faq: [
      {
        question: "What does forecasting revenue require from a CRM?",
        answer:
          "Deal values and close dates as maintained fields, a stage model with meaningful probability, and reporting that can group and review the projection.",
      },
      REQUIREMENT_VS_FEATURE_FAQ,
      {
        question: "Why are forecasts often inaccurate?",
        answer:
          "Because they inherit the data. Optimistic values and stale close dates produce confident projections that miss.",
      },
      {
        question: "Do we need a forecasting feature, or is reporting enough?",
        answer:
          "Reporting on open pipeline is often enough for short cycles. Dedicated forecasting earns its place when periods, probability, and commitments matter.",
      },
    ],
    matrixFeatureSlugs: [
      "forecasting",
      "deal-management",
      "pipeline-management",
      "custom-pipelines",
      "reporting",
      "analytics",
    ],
    screenshotMatchTerms: ["forecast", "revenue", "quota", "projection", "period"],
  },
  {
    slug: "track-client-interactions",
    name: "Track Client Interactions",
    requirementType: "record-keeping",
    requirementTypeLabel: "Record keeping / relationship history",
    typicalImportanceLabel: "High",
    tagline:
      "Compare how CRM platforms capture emails, calls, meetings, and notes so relationship history lives on the record rather than in individual inboxes.",
    shortAnswer:
      "The requirement is met when history arrives without anyone remembering to log it. Automatic email and calendar capture does most of the work; call logging and mobile access close the remaining gaps. Check what is captured automatically versus manually, and who can see it.",
    buyerNeedDescription:
      "Keep a complete, shared record of every interaction with a client — email, calls, meetings, and notes — on a single timeline.",
    primaryCapabilitySlug: "relationship-management",
    primaryCapabilityName: "Relationship management",
    featureLinks: [
      {
        featureSlug: "contact-management",
        name: "Contact Management",
        relationship: "required",
        rationale: "Provides the record and timeline interactions attach to.",
        icon: "users",
      },
      {
        featureSlug: "email-sync",
        name: "Email Sync",
        relationship: "required",
        rationale:
          "Captures most interactions automatically for the majority of teams.",
        icon: "mail",
      },
      {
        featureSlug: "call-functionality",
        name: "Call Functionality",
        relationship: "strongly-supporting",
        rationale: "Brings phone conversations onto the same timeline.",
        icon: "phone",
      },
      {
        featureSlug: "mobile-app",
        name: "Mobile App",
        relationship: "supporting",
        rationale: "Allows capture at the point of interaction, away from a desk.",
        icon: "smartphone",
      },
      {
        featureSlug: "email-tracking",
        name: "Email Tracking",
        relationship: "optional",
        rationale: "Adds engagement detail to recorded correspondence.",
        icon: "chart",
      },
      {
        featureSlug: "role-permissions",
        name: "Role Permissions",
        relationship: "optional",
        rationale:
          "Determines who can see interaction history once it is shared.",
        icon: "shield",
      },
    ],
    evaluationCriteria: [
      {
        id: "timeline",
        name: "Unified timeline",
        description: "Do all interaction types appear in one chronological view?",
        featureSlugs: ["contact-management"],
        importance: "required",
        icon: "clock",
      },
      {
        id: "automatic-capture",
        name: "Automatic capture",
        description: "Is email and calendar activity logged without manual work?",
        featureSlugs: ["email-sync"],
        importance: "required",
        icon: "mail",
      },
      {
        id: "calls",
        name: "Call capture",
        description: "Can calls be logged with outcomes and notes?",
        featureSlugs: ["call-functionality"],
        importance: "important",
        icon: "phone",
      },
      {
        id: "mobile",
        name: "Capture away from a desk",
        description: "Can notes be added immediately after a meeting?",
        featureSlugs: ["mobile-app"],
        importance: "important",
        icon: "smartphone",
      },
      {
        id: "visibility",
        name: "Controlled visibility",
        description: "Can access to sensitive history be limited?",
        featureSlugs: ["role-permissions"],
        importance: "supporting",
        icon: "shield",
      },
    ],
    needGuidance: {
      needIf: [
        "More than one person interacts with the same clients",
        "Handovers currently lose context",
        "Relationship history sits in personal inboxes",
        "You need to see when an account was last contacted",
      ],
      mayNotNeedIf: [
        "One person owns every relationship permanently",
        "Interactions are single transactions with no follow-up",
        "Privacy rules prevent sharing correspondence internally",
      ],
    },
    whyItMatters: [
      {
        id: "continuity",
        title: "Continuity",
        description:
          "Anyone can pick up a relationship without re-learning its history.",
        icon: "handshake",
      },
      {
        id: "coverage",
        title: "Coverage",
        description:
          "You can see which accounts have gone quiet, not just which are active.",
        icon: "clock",
      },
      {
        id: "credibility",
        title: "Client credibility",
        description:
          "Nobody asks a client to repeat something already discussed with a colleague.",
        icon: "users",
      },
      {
        id: "reporting",
        title: "Activity reporting",
        description:
          "Interaction data explains why pipeline moved the way it did.",
        icon: "chart",
      },
    ],
    scenarios: [
      {
        id: "shared-accounts",
        title: "Accounts touched by several colleagues",
        description:
          "Correspondence must be visible to people who were not copied in.",
        priorities: ["Email sync", "Shared timeline", "Permissions"],
        icon: "users",
      },
      {
        id: "phone-heavy",
        title: "Phone-heavy relationships",
        description:
          "Most context comes from calls, so logging cannot depend on memory.",
        priorities: ["Call logging", "Outcomes", "Mobile capture"],
        icon: "phone",
      },
      {
        id: "field-teams",
        title: "Client-facing staff on the move",
        description: "Notes are captured between meetings, not at a desk.",
        priorities: ["Mobile app", "Fast entry", "Offline behaviour"],
        icon: "smartphone",
      },
    ],
    useCaseLinks: [
      {
        id: "relationship",
        title: "Relationship-led teams",
        description: "The central requirement for ongoing client relationships.",
        importanceLabel: "Critical",
        icon: "handshake",
      },
      {
        id: "sales",
        title: "Pipeline-led sales teams",
        description: "Interaction history explains deal progress and stalls.",
        importanceLabel: "High",
        icon: "funnel",
      },
      {
        id: "growing",
        title: "Growing teams",
        description:
          "Usually the first reason a growing team adopts a CRM at all.",
        importanceLabel: "High",
        icon: "trending",
      },
    ],
    tradeoffs: [
      {
        id: "completeness",
        title: "Completeness vs privacy",
        description:
          "Full mailbox capture builds the best history and shares more than some teams intend.",
        icon: "shield",
      },
      {
        id: "effort",
        title: "Detail vs entry effort",
        description:
          "Structured notes report better; free text is faster and less analysable.",
        icon: "settings",
      },
      {
        id: "coverage",
        title: "Channel coverage",
        description:
          "Interactions on unintegrated channels stay invisible unless logged manually.",
        icon: "puzzle",
      },
    ],
    relatedRequirementSlugs: [
      "integrate-with-email",
      "customize-record-fields",
      "restrict-access-by-team",
    ],
    relatedCapabilitySlugs: [
      "contact-management",
      "integrations",
      "security",
    ],
    vendorQuestions: [
      "Which interaction types are logged automatically?",
      "Which mail and calendar providers are supported?",
      "Are inbound emails captured, or only outbound?",
      "Can calls be logged with outcomes?",
      "Can history be captured from mobile?",
      "Can specific threads or contacts be excluded from capture?",
      "Who can see interaction history on a record?",
    ],
    faq: [
      {
        question: "What does tracking client interactions mean in practice?",
        answer:
          "Every email, call, meeting, and note appears on one timeline against the right contact or account, without relying on people to log it.",
      },
      REQUIREMENT_VS_FEATURE_FAQ,
      {
        question: "Do we have to log everything manually?",
        answer:
          "No — email and calendar sync usually covers most of it. Calls and meetings may need logging depending on which channels are integrated.",
      },
      {
        question: "Can we keep some correspondence private?",
        answer:
          "Most products allow exclusions by thread, contact, or domain, and permissions can limit who sees history. Confirm the specifics with the vendor.",
      },
    ],
    matrixFeatureSlugs: [
      "contact-management",
      "email-sync",
      "email-tracking",
      "call-functionality",
      "mobile-app",
      "custom-fields",
    ],
    screenshotMatchTerms: ["timeline", "activity", "contact", "note", "history"],
  },
  {
    slug: "customize-record-fields",
    name: "Customize Record Fields",
    requirementType: "configuration",
    requirementTypeLabel: "Configuration / data model",
    typicalImportanceLabel: "Medium–High",
    tagline:
      "Compare how CRM platforms let you add your own fields to records — and whether those fields work in filters, reports, and automation.",
    shortAnswer:
      "Adding a field is rarely the hard part. What matters is whether custom fields are usable in reports and automation, whether the field types you need exist, and how many the plan allows. Check limits per object, not just totals.",
    buyerNeedDescription:
      "Add and configure your own fields on CRM records so the data model reflects how your team qualifies, segments, and reports.",
    primaryCapabilitySlug: "customization",
    primaryCapabilityName: "Customization",
    featureLinks: [
      {
        featureSlug: "custom-fields",
        name: "Custom Fields",
        relationship: "required",
        rationale: "The feature that satisfies the requirement directly.",
        icon: "settings",
      },
      {
        featureSlug: "contact-management",
        name: "Contact Management",
        relationship: "strongly-supporting",
        rationale: "The records custom fields are added to.",
        icon: "users",
      },
      {
        featureSlug: "reporting",
        name: "Reporting",
        relationship: "strongly-supporting",
        rationale:
          "Custom fields only pay off if they can be filtered and reported on.",
        icon: "chart",
      },
      {
        featureSlug: "workflow-automation",
        name: "Workflow Automation",
        relationship: "supporting",
        rationale: "Automation branching usually depends on custom field values.",
        icon: "zap",
      },
      {
        featureSlug: "role-permissions",
        name: "Role Permissions",
        relationship: "optional",
        rationale: "Determines whether sensitive fields can be restricted.",
        icon: "shield",
      },
    ],
    evaluationCriteria: [
      {
        id: "field-creation",
        name: "Field creation",
        description: "Can administrators add fields without vendor involvement?",
        featureSlugs: ["custom-fields"],
        importance: "required",
        icon: "settings",
      },
      {
        id: "field-types",
        name: "Field types",
        description:
          "Are dropdowns, dates, numbers, and relationships available as needed?",
        featureSlugs: ["custom-fields"],
        importance: "required",
        icon: "layers",
      },
      {
        id: "reportable",
        name: "Usable in reporting",
        description: "Can custom fields be filtered, grouped, and reported on?",
        featureSlugs: ["reporting"],
        importance: "important",
        icon: "chart",
      },
      {
        id: "automation",
        name: "Usable in automation",
        description: "Can rules read and write custom fields?",
        featureSlugs: ["workflow-automation"],
        importance: "important",
        icon: "zap",
      },
      {
        id: "limits",
        name: "Field limits",
        description: "How many fields does the plan allow per object?",
        featureSlugs: ["custom-fields"],
        importance: "supporting",
        icon: "database",
      },
    ],
    needGuidance: {
      needIf: [
        "Qualification depends on data the default record lacks",
        "Reports need fields specific to your process",
        "Automation must branch on your own attributes",
        "Segmentation relies on your own categories",
      ],
      mayNotNeedIf: [
        "Standard fields already describe your records",
        "Nobody would maintain additional fields",
        "The detail you need belongs in notes, not structured data",
      ],
    },
    whyItMatters: [
      {
        id: "fit",
        title: "Process fit",
        description:
          "The CRM describes your business rather than a generic template.",
        icon: "settings",
      },
      {
        id: "reporting",
        title: "Reporting",
        description:
          "Structured fields can be reported on; the same detail in notes cannot.",
        icon: "chart",
      },
      {
        id: "automation",
        title: "Automation",
        description:
          "Rules need structured values to make reliable decisions.",
        icon: "zap",
      },
      {
        id: "consistency",
        title: "Consistency",
        description:
          "Defined options reduce the variation that free text introduces.",
        icon: "check",
      },
    ],
    scenarios: [
      {
        id: "qualification",
        title: "Structured qualification",
        description:
          "Priority depends on a handful of attributes that must be captured consistently.",
        priorities: ["Dropdown fields", "Required fields", "Reporting"],
        icon: "funnel",
      },
      {
        id: "segmentation",
        title: "Segmenting a large contact base",
        description:
          "Outreach depends on categories the default record does not hold.",
        priorities: ["Field types", "Filtering", "Field limits"],
        icon: "filter",
      },
      {
        id: "automation-branching",
        title: "Automation that branches on data",
        description:
          "Workflows behave differently depending on record attributes.",
        priorities: ["Automation access to fields", "Validation"],
        icon: "zap",
      },
    ],
    useCaseLinks: [
      {
        id: "relationship",
        title: "Relationship-led teams",
        description: "Review cycles usually depend on custom account attributes.",
        importanceLabel: "High",
        icon: "handshake",
      },
      {
        id: "complex",
        title: "Complex sales processes",
        description: "Process-specific data usually needs custom fields.",
        importanceLabel: "High",
        icon: "layers",
      },
      {
        id: "volume",
        title: "High-volume lead handling",
        description: "Prioritization depends on structured qualification data.",
        importanceLabel: "High",
        icon: "users",
      },
    ],
    tradeoffs: [
      {
        id: "sprawl",
        title: "Flexibility vs field sprawl",
        description:
          "Unmanaged fields accumulate until nobody knows which ones matter.",
        icon: "settings",
      },
      {
        id: "required",
        title: "Data quality vs entry speed",
        description:
          "Required fields improve reporting and slow down record creation.",
        icon: "users",
      },
      {
        id: "plan",
        title: "Plan impact",
        description:
          "Field counts and advanced field types are commonly plan-limited.",
        icon: "chart",
      },
    ],
    relatedRequirementSlugs: [
      "track-client-interactions",
      "forecast-revenue",
      "restrict-access-by-team",
    ],
    relatedCapabilitySlugs: [
      "contact-management",
      "reporting",
      "workflow-automation",
    ],
    vendorQuestions: [
      "How many custom fields are allowed, and per which object?",
      "Which field types are available?",
      "Can fields be required or validated?",
      "Can custom fields be used in reports and dashboards?",
      "Can automation read and write custom fields?",
      "Can field visibility be restricted by role?",
      "Do higher field limits require an upgrade?",
    ],
    faq: [
      {
        question: "Why does customizing record fields matter?",
        answer:
          "Because decisions and reports depend on data the default record often does not capture. Structured fields make that data usable rather than buried in notes.",
      },
      REQUIREMENT_VS_FEATURE_FAQ,
      {
        question: "How many custom fields should we create?",
        answer:
          "Only those that change a decision or appear in a report. Fields nobody reads become fields nobody fills in.",
      },
      {
        question: "Are custom fields limited by plan?",
        answer:
          "Frequently, and often per object rather than in total. Where limits are recorded in our research they are shown; otherwise they stay marked not verified.",
      },
    ],
    matrixFeatureSlugs: [
      "custom-fields",
      "contact-management",
      "reporting",
      "workflow-automation",
      "role-permissions",
    ],
    screenshotMatchTerms: ["field", "custom", "property", "settings", "record"],
  },
  {
    slug: "integrate-with-email",
    name: "Integrate with Email",
    requirementType: "integration",
    requirementTypeLabel: "Integration / communication",
    typicalImportanceLabel: "High",
    tagline:
      "Compare how CRM platforms connect to mailboxes and calendars so correspondence reaches the record automatically.",
    shortAnswer:
      "Check three things: whether your mail provider is properly supported, whether inbound as well as outbound mail is captured, and whether users can exclude threads. Email integration is usually the single biggest driver of whether a CRM stays current.",
    buyerNeedDescription:
      "Connect team mailboxes and calendars to the CRM so email and meetings are logged against the right record without manual effort.",
    primaryCapabilitySlug: "email",
    primaryCapabilityName: "Email",
    featureLinks: [
      {
        featureSlug: "email-sync",
        name: "Email Sync",
        relationship: "required",
        rationale: "Provides the mailbox and calendar connection itself.",
        icon: "mail",
      },
      {
        featureSlug: "contact-management",
        name: "Contact Management",
        relationship: "required",
        rationale: "Supplies the records correspondence is matched to.",
        icon: "users",
      },
      {
        featureSlug: "integrations",
        name: "Integrations",
        relationship: "strongly-supporting",
        rationale:
          "Determines which providers and adjacent tools are supported natively.",
        icon: "puzzle",
      },
      {
        featureSlug: "email-tracking",
        name: "Email Tracking",
        relationship: "supporting",
        rationale: "Adds engagement signals to synced correspondence.",
        icon: "chart",
      },
      {
        featureSlug: "email-sequences",
        name: "Email Sequences",
        relationship: "optional",
        rationale:
          "Sending follow-up steps usually depends on the same mailbox connection.",
        icon: "zap",
      },
    ],
    evaluationCriteria: [
      {
        id: "provider-support",
        name: "Provider support",
        description: "Is your mail and calendar provider properly supported?",
        featureSlugs: ["email-sync"],
        importance: "required",
        icon: "mail",
      },
      {
        id: "two-way",
        name: "Capture direction",
        description: "Are inbound and outbound messages both captured?",
        featureSlugs: ["email-sync"],
        importance: "required",
        icon: "layers",
      },
      {
        id: "record-matching",
        name: "Record matching",
        description: "Is correspondence attached to the right contact or deal?",
        featureSlugs: ["contact-management"],
        importance: "important",
        icon: "users",
      },
      {
        id: "exclusions",
        name: "Exclusion controls",
        description: "Can specific threads, contacts, or domains be excluded?",
        featureSlugs: ["email-sync"],
        importance: "important",
        icon: "shield",
      },
      {
        id: "calendar",
        name: "Calendar sync",
        description: "Are meetings logged and kept in step with the calendar?",
        featureSlugs: ["email-sync", "integrations"],
        importance: "supporting",
        icon: "clock",
      },
    ],
    needGuidance: {
      needIf: [
        "Most client communication happens by email",
        "Colleagues need visibility of threads they were not copied on",
        "Manual logging is already being skipped",
        "Meetings should appear on the record automatically",
      ],
      mayNotNeedIf: [
        "Communication is mainly by phone or in person",
        "Correspondence should not be visible team-wide",
      ],
    },
    whyItMatters: [
      {
        id: "adoption",
        title: "Adoption",
        description:
          "Automatic capture is usually what stops a CRM becoming extra typing.",
        icon: "users",
      },
      {
        id: "completeness",
        title: "Completeness",
        description:
          "History stays complete even when people forget to log things.",
        icon: "clock",
      },
      {
        id: "continuity",
        title: "Continuity",
        description:
          "Colleagues can cover an account without forwarding email chains.",
        icon: "handshake",
      },
      {
        id: "reporting",
        title: "Activity visibility",
        description:
          "Email activity data supports coverage and responsiveness reporting.",
        icon: "chart",
      },
    ],
    scenarios: [
      {
        id: "standard",
        title: "Standard mailbox integration",
        description:
          "A common provider, straightforward sync, minimal configuration.",
        priorities: ["Provider support", "Two-way capture"],
        icon: "mail",
      },
      {
        id: "shared-inbox",
        title: "Shared or team mailboxes",
        description:
          "Enquiries arrive at a shared address and need routing to owners.",
        priorities: ["Shared mailbox handling", "Assignment", "Matching"],
        icon: "users",
      },
      {
        id: "sensitive",
        title: "Sensitive correspondence",
        description:
          "Some threads must stay out of the shared record entirely.",
        priorities: ["Exclusions", "Permissions", "Audit"],
        icon: "shield",
      },
    ],
    useCaseLinks: [
      {
        id: "relationship",
        title: "Relationship-led teams",
        description: "The main source of relationship history in most teams.",
        importanceLabel: "Critical",
        icon: "handshake",
      },
      {
        id: "sales",
        title: "Pipeline-led sales teams",
        description: "Keeps deal correspondence visible without manual logging.",
        importanceLabel: "High",
        icon: "funnel",
      },
      {
        id: "growing",
        title: "Growing teams",
        description: "Often the deciding factor in whether a CRM gets adopted.",
        importanceLabel: "Critical",
        icon: "trending",
      },
    ],
    tradeoffs: [
      {
        id: "privacy",
        title: "Completeness vs privacy",
        description:
          "Full sync gives the best history and shares more than some teams want.",
        icon: "shield",
      },
      {
        id: "provider",
        title: "Provider dependency",
        description:
          "Depth varies by mail provider, so test with the one you actually use.",
        icon: "puzzle",
      },
      {
        id: "plan",
        title: "Plan impact",
        description:
          "Basic sync is often included while advanced controls sit higher up.",
        icon: "chart",
      },
    ],
    relatedRequirementSlugs: [
      "track-client-interactions",
      "manage-integrations",
      "automate-lead-follow-up",
    ],
    relatedCapabilitySlugs: [
      "integrations",
      "contact-management",
      "workflow-automation",
    ],
    vendorQuestions: [
      "Which mail and calendar providers are supported?",
      "Is sync one-way or two-way?",
      "Are inbound emails captured, or only outbound?",
      "How are shared or team mailboxes handled?",
      "Can users exclude threads, contacts, or domains?",
      "Can we send from the CRM using our own mail account?",
      "Does email integration require a higher plan?",
    ],
    faq: [
      {
        question: "What does integrating a CRM with email involve?",
        answer:
          "Connecting mailboxes and calendars so messages and meetings are attached to the matching record automatically, rather than copied in by hand.",
      },
      REQUIREMENT_VS_FEATURE_FAQ,
      {
        question: "Is BCC-to-CRM good enough?",
        answer:
          "It works for outbound only and depends on people remembering. Proper sync captures both directions without effort.",
      },
      {
        question: "Can we stop certain emails syncing?",
        answer:
          "Usually. Exclusions by thread, contact, or domain are common, but the controls differ — verify them if privacy matters to your team.",
      },
    ],
    matrixFeatureSlugs: [
      "email-sync",
      "contact-management",
      "email-tracking",
      "email-sequences",
      "integrations",
    ],
    screenshotMatchTerms: ["email", "inbox", "sync", "calendar", "connect"],
  },
  {
    slug: "support-sso",
    name: "Support Single Sign-On",
    requirementType: "identity",
    requirementTypeLabel: "Identity / access management",
    typicalImportanceLabel: "Medium (higher for larger teams)",
    tagline:
      "Compare how CRM platforms support authentication through your identity provider — and which plan it takes to get it.",
    shortAnswer:
      "Single sign-on matters most for reliable offboarding. Check which protocols and identity providers are supported, whether sign-on can be enforced for all users, and whether account provisioning is included or separate. It is commonly an enterprise-tier feature.",
    buyerNeedDescription:
      "Authenticate CRM users through the organization's identity provider so access is granted, enforced, and revoked centrally.",
    primaryCapabilitySlug: "security",
    primaryCapabilityName: "Security",
    featureLinks: [
      {
        featureSlug: "sso",
        name: "Single Sign-On",
        relationship: "required",
        rationale: "The feature that satisfies the requirement directly.",
        icon: "key",
      },
      {
        featureSlug: "role-permissions",
        name: "Role Permissions",
        relationship: "strongly-supporting",
        rationale:
          "Authentication decides who gets in; permissions decide what they can do.",
        icon: "shield",
      },
      {
        featureSlug: "audit-logs",
        name: "Audit Logs",
        relationship: "supporting",
        rationale: "Records sign-in activity for review.",
        icon: "clock",
      },
      {
        featureSlug: "integrations",
        name: "Integrations",
        relationship: "optional",
        rationale:
          "Directory provisioning is sometimes delivered as an integration.",
        icon: "puzzle",
      },
    ],
    evaluationCriteria: [
      {
        id: "protocol",
        name: "Protocol and provider support",
        description: "Are SAML or OIDC and your identity provider supported?",
        featureSlugs: ["sso"],
        importance: "required",
        icon: "key",
      },
      {
        id: "enforcement",
        name: "Enforcement",
        description: "Can single sign-on be required for all users?",
        featureSlugs: ["sso"],
        importance: "required",
        icon: "lock",
      },
      {
        id: "provisioning",
        name: "User provisioning",
        description: "Can accounts be created and deactivated from the directory?",
        featureSlugs: ["sso", "integrations"],
        importance: "important",
        icon: "users",
      },
      {
        id: "permissions",
        name: "Permission mapping",
        description: "Can roles be assigned from directory groups?",
        featureSlugs: ["role-permissions"],
        importance: "important",
        icon: "shield",
      },
      {
        id: "logging",
        name: "Sign-in logging",
        description: "Is authentication activity recorded for review?",
        featureSlugs: ["audit-logs"],
        importance: "supporting",
        icon: "clock",
      },
    ],
    needGuidance: {
      needIf: [
        "You already operate an identity provider",
        "Offboarding must remove access everywhere at once",
        "Password and MFA policy is centrally mandated",
        "User numbers make manual account management risky",
      ],
      mayNotNeedIf: [
        "You have very few users and no identity provider",
        "The required plan cost outweighs the administration saved",
      ],
    },
    whyItMatters: [
      {
        id: "offboarding",
        title: "Reliable offboarding",
        description:
          "Access disappears with the directory account rather than a manual step.",
        icon: "lock",
      },
      {
        id: "policy",
        title: "Consistent policy",
        description:
          "Password and multi-factor rules apply the same way everywhere.",
        icon: "shield",
      },
      {
        id: "admin",
        title: "Less account admin",
        description:
          "Fewer credentials to create, reset, and remember per person.",
        icon: "users",
      },
      {
        id: "visibility",
        title: "Access visibility",
        description:
          "Central identity makes it easier to answer who has access.",
        icon: "clock",
      },
    ],
    scenarios: [
      {
        id: "small-team",
        title: "Small team, no identity provider",
        description:
          "Single sign-on is usually not worth an enterprise plan step yet.",
        priorities: ["Cost", "Basic security", "Offboarding checklist"],
        icon: "users",
      },
      {
        id: "it-managed",
        title: "IT-managed environment",
        description:
          "All applications are expected to authenticate through the directory.",
        priorities: ["Protocol support", "Enforcement", "Provisioning"],
        icon: "key",
      },
      {
        id: "high-turnover",
        title: "Frequent joiners and leavers",
        description:
          "Manual account management is the main access risk.",
        priorities: ["Provisioning", "Enforcement", "Audit"],
        icon: "trending",
      },
    ],
    useCaseLinks: [
      {
        id: "complex",
        title: "Complex sales processes",
        description:
          "Larger teams with approvals usually already run central identity.",
        importanceLabel: "Medium–High",
        icon: "layers",
      },
      {
        id: "relationship",
        title: "Relationship-led teams",
        description:
          "Relevant where client data sensitivity raises access expectations.",
        importanceLabel: "Medium",
        icon: "handshake",
      },
      {
        id: "growing",
        title: "Growing teams",
        description:
          "Usually deferred, but worth checking the upgrade path exists.",
        importanceLabel: "Optional at first",
        icon: "trending",
      },
    ],
    tradeoffs: [
      {
        id: "cost",
        title: "Central control vs plan cost",
        description:
          "Single sign-on is often gated to the top tier, which can be a large jump.",
        icon: "chart",
      },
      {
        id: "provisioning",
        title: "Authentication vs provisioning",
        description:
          "Sign-on alone does not create or remove accounts unless provisioning is included.",
        icon: "users",
      },
      {
        id: "dependency",
        title: "Convenience vs dependency",
        description:
          "Central identity is a single point of failure as well as a single point of control.",
        icon: "shield",
      },
    ],
    relatedRequirementSlugs: [
      "restrict-access-by-team",
      "audit-user-activity",
      "manage-integrations",
    ],
    relatedCapabilitySlugs: ["security", "integrations"],
    vendorQuestions: [
      "Which protocols and identity providers are supported?",
      "Can single sign-on be enforced for all users?",
      "Is directory provisioning or SCIM available?",
      "Can roles be mapped from directory groups?",
      "What happens to existing passwords when it is enabled?",
      "Is sign-in activity logged?",
      "Which plan includes it, and at what cost?",
    ],
    faq: [
      {
        question: "What does supporting single sign-on require?",
        answer:
          "A CRM that authenticates against your identity provider using a standard protocol, ideally with enforcement for all users and directory-based provisioning.",
      },
      REQUIREMENT_VS_FEATURE_FAQ,
      {
        question: "Is single sign-on the same as two-factor authentication?",
        answer:
          "No. Single sign-on delegates authentication to your identity provider, where multi-factor policy is usually enforced. Some CRMs also offer their own second factor.",
      },
      {
        question: "Do smaller teams need it?",
        answer:
          "Often not. Below a certain size, a documented offboarding checklist achieves most of the benefit without an enterprise plan.",
      },
    ],
    matrixFeatureSlugs: [
      "sso",
      "role-permissions",
      "audit-logs",
      "integrations",
    ],
    screenshotMatchTerms: ["sso", "saml", "login", "identity", "security"],
  },
  {
    slug: "audit-user-activity",
    name: "Audit User Activity",
    requirementType: "governance",
    requirementTypeLabel: "Governance / accountability",
    typicalImportanceLabel: "Medium (higher where data is sensitive)",
    tagline:
      "Compare how CRM platforms record who accessed, changed, exported, or deleted data — and how long those records are kept.",
    shortAnswer:
      "The useful question is not whether logs exist but what they cover and for how long. Look for coverage of exports and deletions, retention long enough to investigate, and the ability to export logs. Full audit logging is usually a higher-tier feature.",
    buyerNeedDescription:
      "Maintain a reviewable record of user access and changes in the CRM, so it is possible to establish who did what and when.",
    primaryCapabilitySlug: "security",
    primaryCapabilityName: "Security",
    featureLinks: [
      {
        featureSlug: "audit-logs",
        name: "Audit Logs",
        relationship: "required",
        rationale: "Provides the access and change record itself.",
        icon: "clock",
      },
      {
        featureSlug: "role-permissions",
        name: "Role Permissions",
        relationship: "strongly-supporting",
        rationale:
          "Logs show what happened; permissions are what limit it happening.",
        icon: "shield",
      },
      {
        featureSlug: "sso",
        name: "Single Sign-On",
        relationship: "supporting",
        rationale: "Central identity makes sign-in records more meaningful.",
        icon: "key",
      },
      {
        featureSlug: "api-access",
        name: "API Access",
        relationship: "optional",
        rationale:
          "Sometimes the only way to export logs into your own tooling.",
        icon: "code",
      },
    ],
    evaluationCriteria: [
      {
        id: "coverage",
        name: "Event coverage",
        description:
          "Are sign-ins, edits, deletions, exports, and config changes captured?",
        featureSlugs: ["audit-logs"],
        importance: "required",
        icon: "database",
      },
      {
        id: "retention",
        name: "Retention period",
        description: "Are logs kept long enough to investigate an incident?",
        featureSlugs: ["audit-logs"],
        importance: "required",
        icon: "clock",
      },
      {
        id: "access",
        name: "Reviewer access",
        description: "Can the right people review logs without full admin rights?",
        featureSlugs: ["audit-logs", "role-permissions"],
        importance: "important",
        icon: "shield",
      },
      {
        id: "export",
        name: "Log export",
        description: "Can logs be exported or streamed to your own systems?",
        featureSlugs: ["api-access", "audit-logs"],
        importance: "important",
        icon: "code",
      },
      {
        id: "prevention",
        name: "Preventive controls",
        description:
          "Are there permissions that stop the actions you would otherwise only detect?",
        featureSlugs: ["role-permissions"],
        importance: "supporting",
        icon: "lock",
      },
    ],
    needGuidance: {
      needIf: [
        "You must be able to investigate data access",
        "Internal policy requires periodic access review",
        "Bulk export of the customer database is a real risk",
        "Several administrators can change configuration",
      ],
      mayNotNeedIf: [
        "A very small team with complete mutual visibility",
        "Record-level change history already answers your questions",
      ],
    },
    whyItMatters: [
      {
        id: "investigation",
        title: "Investigation",
        description:
          "Questions about access can be answered with evidence rather than assumption.",
        icon: "database",
      },
      {
        id: "deterrence",
        title: "Deterrence",
        description:
          "Visible logging changes behaviour around bulk access and export.",
        icon: "shield",
      },
      {
        id: "review",
        title: "Access review",
        description:
          "Periodic reviews need a record of who actually used their access.",
        icon: "clock",
      },
      {
        id: "config",
        title: "Configuration history",
        description:
          "Knowing who changed a setting shortens debugging after a change.",
        icon: "settings",
      },
    ],
    scenarios: [
      {
        id: "sensitive-data",
        title: "Sensitive client data",
        description:
          "Access to certain records must be reviewable after the fact.",
        priorities: ["Event coverage", "Retention", "Reviewer access"],
        icon: "lock",
      },
      {
        id: "departures",
        title: "Investigating a departure",
        description:
          "You need to know what was viewed or exported before someone left.",
        priorities: ["Export logging", "Retention", "Log export"],
        icon: "database",
      },
      {
        id: "multi-admin",
        title: "Several administrators",
        description:
          "Configuration changes need attribution to avoid guesswork.",
        priorities: ["Config change logging", "Reviewer access"],
        icon: "settings",
      },
    ],
    useCaseLinks: [
      {
        id: "relationship",
        title: "Relationship-led teams",
        description:
          "Relevant where client confidentiality expectations are high.",
        importanceLabel: "Medium–High",
        icon: "handshake",
      },
      {
        id: "complex",
        title: "Complex sales processes",
        description:
          "Approvals and stage rights benefit from a reviewable trail.",
        importanceLabel: "Medium",
        icon: "layers",
      },
      {
        id: "growing",
        title: "Growing teams",
        description:
          "Usually deferred until the team is large enough for review cycles.",
        importanceLabel: "Optional at first",
        icon: "trending",
      },
    ],
    tradeoffs: [
      {
        id: "coverage",
        title: "Coverage vs noise",
        description:
          "Comprehensive logs answer more questions and are harder to review manually.",
        icon: "database",
      },
      {
        id: "retention",
        title: "Retention vs plan tier",
        description:
          "Short retention windows on lower plans limit what can be investigated.",
        icon: "clock",
      },
      {
        id: "detect-prevent",
        title: "Detection vs prevention",
        description:
          "Logs tell you afterwards; permissions are what stop it happening.",
        icon: "shield",
      },
    ],
    relatedRequirementSlugs: ["restrict-access-by-team", "support-sso"],
    relatedCapabilitySlugs: ["security", "reporting"],
    vendorQuestions: [
      "What events are captured in the audit log?",
      "Are exports and deletions logged?",
      "How long are logs retained on our plan?",
      "Who can view the audit log?",
      "Can logs be exported or streamed externally?",
      "Are configuration changes attributed to a user?",
      "Which plan includes full audit logging?",
    ],
    faq: [
      {
        question: "What does auditing user activity involve?",
        answer:
          "Keeping a reviewable record of sign-ins, record changes, deletions, exports, and configuration changes, retained long enough to be useful.",
      },
      REQUIREMENT_VS_FEATURE_FAQ,
      {
        question: "Is record history the same as an audit log?",
        answer:
          "No. Record history shows changes on one record to normal users. An audit log covers system-wide access and administrative events for reviewers.",
      },
      {
        question: "Does audit logging make a CRM compliant?",
        answer:
          "No. It is one control among many. Compliance depends on your obligations, configuration, and contracts — verify requirements with vendors and your own advisers.",
      },
    ],
    matrixFeatureSlugs: [
      "audit-logs",
      "role-permissions",
      "sso",
      "api-access",
    ],
    screenshotMatchTerms: ["audit", "log", "activity", "history", "security"],
  },
  {
    slug: "manage-integrations",
    name: "Manage Integrations",
    requirementType: "integration",
    requirementTypeLabel: "Integration / platform",
    typicalImportanceLabel: "High",
    tagline:
      "Compare how CRM platforms connect to the rest of your stack — native connectors, sync depth, API access, and what happens when a connection fails.",
    shortAnswer:
      "Start from your own stack rather than the vendor's directory. For each system you depend on, confirm the integration exists, syncs the fields and direction you need, is actively maintained, and surfaces failures. Then check whether API access is included on your plan.",
    buyerNeedDescription:
      "Connect and maintain integrations between the CRM and the other systems that hold customer data, so information does not have to be re-entered by hand.",
    primaryCapabilitySlug: "integrations",
    primaryCapabilityName: "Integrations",
    featureLinks: [
      {
        featureSlug: "integrations",
        name: "Integrations",
        relationship: "required",
        rationale: "Provides the native connectors the requirement depends on.",
        icon: "puzzle",
      },
      {
        featureSlug: "api-access",
        name: "API Access",
        relationship: "strongly-supporting",
        rationale: "Covers the cases no native connector handles.",
        icon: "code",
      },
      {
        featureSlug: "email-sync",
        name: "Email Sync",
        relationship: "strongly-supporting",
        rationale: "Usually the first integration that has to work properly.",
        icon: "mail",
      },
      {
        featureSlug: "workflow-automation",
        name: "Workflow Automation",
        relationship: "supporting",
        rationale:
          "Lets connected data trigger action rather than just arriving.",
        icon: "zap",
      },
      {
        featureSlug: "role-permissions",
        name: "Role Permissions",
        relationship: "optional",
        rationale:
          "Integrations should not become a route around CRM access controls.",
        icon: "shield",
      },
    ],
    evaluationCriteria: [
      {
        id: "coverage",
        name: "Stack coverage",
        description: "Do native integrations exist for the systems you depend on?",
        featureSlugs: ["integrations"],
        importance: "required",
        icon: "puzzle",
      },
      {
        id: "depth",
        name: "Sync depth and direction",
        description:
          "Do integrations move the fields you need, in the direction you need?",
        featureSlugs: ["integrations"],
        importance: "required",
        icon: "layers",
      },
      {
        id: "api",
        name: "API availability",
        description: "Is API access included, and are rate limits workable?",
        featureSlugs: ["api-access"],
        importance: "important",
        icon: "code",
      },
      {
        id: "reliability",
        name: "Failure visibility",
        description: "Are failed syncs surfaced and retried?",
        featureSlugs: ["integrations"],
        importance: "important",
        icon: "shield",
      },
      {
        id: "governance",
        name: "Integration governance",
        description: "Can you control who connects what, and with which access?",
        featureSlugs: ["role-permissions", "integrations"],
        importance: "supporting",
        icon: "lock",
      },
    ],
    needGuidance: {
      needIf: [
        "Customer data lives in more than one system",
        "The team works primarily inside another tool",
        "Manual reconciliation between systems is consuming time",
        "Reporting depends on data from outside the CRM",
      ],
      mayNotNeedIf: [
        "The CRM would be your only customer system",
        "Volumes are low enough that occasional manual entry is acceptable",
      ],
    },
    whyItMatters: [
      {
        id: "no-retyping",
        title: "Less duplicate entry",
        description:
          "Data arrives from the source system rather than being typed twice.",
        icon: "database",
      },
      {
        id: "accuracy",
        title: "Accuracy",
        description:
          "Records stay current instead of drifting apart between systems.",
        icon: "check",
      },
      {
        id: "adoption",
        title: "Adoption",
        description:
          "People use a CRM that fits their existing tools rather than replacing them.",
        icon: "users",
      },
      {
        id: "automation",
        title: "Automation reach",
        description:
          "Connected data lets workflows act across systems, not just inside the CRM.",
        icon: "zap",
      },
    ],
    scenarios: [
      {
        id: "core-stack",
        title: "A few essential systems",
        description:
          "Email, calendar, and one or two operational tools need to connect properly.",
        priorities: ["Native connectors", "Sync depth", "Reliability"],
        icon: "puzzle",
      },
      {
        id: "custom",
        title: "A system with no connector",
        description:
          "An internal or niche application has to be integrated another way.",
        priorities: ["API access", "Webhooks", "Rate limits"],
        icon: "code",
      },
      {
        id: "many-systems",
        title: "Many connected systems",
        description:
          "Integration ownership and failure monitoring become the real work.",
        priorities: ["Monitoring", "Governance", "Middleware options"],
        icon: "layers",
      },
    ],
    useCaseLinks: [
      {
        id: "complex",
        title: "Complex sales processes",
        description:
          "Deals usually depend on proposal, finance, or delivery systems.",
        importanceLabel: "High",
        icon: "layers",
      },
      {
        id: "volume",
        title: "High-volume lead handling",
        description:
          "Capture integrations decide whether leads arrive automatically.",
        importanceLabel: "High",
        icon: "users",
      },
      {
        id: "growing",
        title: "Growing teams",
        description:
          "Email integration matters immediately; the rest can come later.",
        importanceLabel: "Medium–High",
        icon: "trending",
      },
    ],
    tradeoffs: [
      {
        id: "breadth",
        title: "Directory breadth vs depth",
        description:
          "A long integration list matters less than depth in the ones you need.",
        icon: "puzzle",
      },
      {
        id: "ownership",
        title: "Native connectors vs custom builds",
        description:
          "Custom integrations fit precisely and become your maintenance burden.",
        icon: "code",
      },
      {
        id: "sync",
        title: "Two-way sync vs data integrity",
        description:
          "Bidirectional sync is convenient and multiplies conflict risk.",
        icon: "settings",
      },
    ],
    relatedRequirementSlugs: [
      "integrate-with-email",
      "restrict-access-by-team",
      "automate-lead-follow-up",
    ],
    relatedCapabilitySlugs: [
      "integrations",
      "workflow-automation",
      "security",
    ],
    vendorQuestions: [
      "Which of our systems have native integrations?",
      "Who builds and maintains each integration?",
      "Is sync one-way or two-way, and which system wins conflicts?",
      "Is API access included, and what are the rate limits?",
      "Are webhooks available for record events?",
      "How are integration failures surfaced and retried?",
      "Can we control who connects applications?",
      "Which integrations require a higher plan or extra cost?",
    ],
    faq: [
      {
        question: "How should we evaluate CRM integrations?",
        answer:
          "List the systems you depend on, then check each one individually for existence, depth, direction, and maintenance. A directory count tells you very little.",
      },
      REQUIREMENT_VS_FEATURE_FAQ,
      {
        question: "What if there is no native integration?",
        answer:
          "You are looking at an API build or middleware. Both work, but both add cost and become something your team owns.",
      },
      {
        question: "Do integrations affect CRM cost?",
        answer:
          "Sometimes. API access, premium connectors, and middleware subscriptions may sit outside the base plan. Confirm before shortlisting.",
      },
    ],
    matrixFeatureSlugs: [
      "integrations",
      "api-access",
      "email-sync",
      "workflow-automation",
      "call-functionality",
    ],
    screenshotMatchTerms: [
      "integration",
      "marketplace",
      "connect",
      "api",
      "webhook",
    ],
  },
  {
    slug: "retain-and-export-data",
    name: "Retain and Export Data",
    requirementType: "data-governance",
    requirementTypeLabel: "Data governance / administration",
    typicalImportanceLabel: "High (context-dependent)",
    tagline:
      "Compare how CRM platforms retain, export, and delete customer data when you need portability or controlled retention.",
    shortAnswer:
      "Confirm export formats, deletion workflows, and retention controls before you buy. Ask what leaves the platform on export, who can trigger exports or deletes, and whether retention policies are configurable on your plan — then verify with the vendor for your jurisdiction.",
    buyerNeedDescription:
      "Control how long customer data is kept, how it can be exported in usable formats, and how it can be deleted when retention ends or a customer requests removal.",
    primaryCapabilitySlug: "security",
    primaryCapabilityName: "Security and administration",
    featureLinks: [
      {
        featureSlug: "role-permissions",
        name: "Role Permissions",
        relationship: "required",
        rationale:
          "Export and deletion should be limited to roles that are allowed to move or remove data.",
        icon: "shield",
      },
      {
        featureSlug: "custom-fields",
        name: "Custom Fields",
        relationship: "strongly-supporting",
        rationale:
          "Exports are only useful if the fields your team depends on can be included.",
        icon: "settings",
      },
      {
        featureSlug: "audit-logs",
        name: "Audit Logs",
        relationship: "supporting",
        rationale:
          "Shows who exported or deleted records when governance reviews ask.",
        icon: "clock",
      },
      {
        featureSlug: "integrations",
        name: "Integrations",
        relationship: "supporting",
        rationale:
          "Connected systems may hold copies that export/delete policies must also cover.",
        icon: "puzzle",
      },
      {
        featureSlug: "contact-management",
        name: "Contact Management",
        relationship: "supporting",
        rationale:
          "Retention and export usually center on contact and account records.",
        icon: "users",
      },
    ],
    evaluationCriteria: [
      {
        id: "export-format",
        name: "Export usability",
        description:
          "Can you export records in formats your team can actually reuse?",
        featureSlugs: ["contact-management", "custom-fields"],
        importance: "required",
        icon: "database",
      },
      {
        id: "who-exports",
        name: "Export permissions",
        description: "Can bulk export be limited to specific roles?",
        featureSlugs: ["role-permissions"],
        importance: "required",
        icon: "lock",
      },
      {
        id: "deletion",
        name: "Deletion workflow",
        description:
          "Is there a clear path to delete or anonymize records when required?",
        featureSlugs: ["role-permissions", "contact-management"],
        importance: "important",
        icon: "shield",
      },
      {
        id: "retention-policy",
        name: "Retention controls",
        description:
          "Can retention windows be configured, or only handled manually?",
        featureSlugs: ["role-permissions"],
        importance: "important",
        icon: "clock",
      },
      {
        id: "audit-trail",
        name: "Export and delete auditability",
        description: "Can you see who exported or deleted data?",
        featureSlugs: ["audit-logs"],
        importance: "supporting",
        icon: "clock",
      },
    ],
    needGuidance: {
      needIf: [
        "You may migrate platforms later and need portable data",
        "Customers or regulators can request deletion or export",
        "Multiple systems hold copies of the same customer records",
      ],
      mayNotNeedIf: [
        "Volumes are tiny and manual CSV exports already cover audits",
        "Another system of record owns retention and the CRM is temporary",
      ],
    },
    whyItMatters: [
      {
        id: "portability",
        title: "Avoid lock-in surprises",
        description:
          "Knowing what you can export — and in what shape — prevents painful migrations later.",
        icon: "database",
      },
      {
        id: "governance",
        title: "Support governance reviews",
        description:
          "Retention and deletion workflows are common diligence questions even when no specific regulation is named.",
        icon: "shield",
      },
      {
        id: "copies",
        title: "Account for connected copies",
        description:
          "Integrations can retain data outside the CRM; export/delete plans should include them.",
        icon: "puzzle",
      },
    ],
    scenarios: [
      {
        id: "migration",
        title: "Preparing for a possible CRM change",
        description:
          "The team wants confidence that contacts, notes, and pipeline history can leave cleanly.",
        priorities: ["Export completeness", "Field coverage", "Permissions"],
        icon: "trending",
      },
      {
        id: "customer-request",
        title: "Handling customer data requests",
        description:
          "Operations needs a repeatable export and deletion path without ad-hoc admin work.",
        priorities: ["Deletion workflow", "Audit trail", "Role limits"],
        icon: "users",
      },
    ],
    useCaseLinks: [
      {
        id: "growing-teams",
        title: "Growing teams",
        description:
          "Process maturity usually increases the need for export and retention discipline.",
        importanceLabel: "Medium–High",
        icon: "trending",
      },
      {
        id: "complex-sales-processes",
        title: "Complex sales processes",
        description:
          "Longer cycles create richer histories that are harder to reconstruct without exports.",
        importanceLabel: "Medium",
        icon: "layers",
      },
    ],
    tradeoffs: [
      {
        id: "completeness-vs-simplicity",
        title: "Complete exports vs simple plans",
        description:
          "Full export tooling and retention controls often sit on higher plans. Confirm before shortlisting.",
        icon: "chart",
      },
      {
        id: "crm-vs-other-systems",
        title: "CRM vs other systems of record",
        description:
          "If another system owns the master customer record, CRM retention rules alone will not be enough.",
        icon: "puzzle",
      },
    ],
    relatedRequirementSlugs: [
      "restrict-access-by-team",
      "audit-user-activity",
      "control-data-residency",
      "review-vendor-security-docs",
    ],
    relatedCapabilitySlugs: ["security", "integrations"],
    vendorQuestions: [
      "What formats can we export contacts, activities, and opportunities in?",
      "Who can run bulk exports or deletions, and can that be restricted?",
      "Can retention windows be configured, or only handled manually?",
      "What happens to data in connected integrations when we delete a CRM record?",
      "Is export or retention tooling limited to specific plans?",
    ],
    faq: [
      {
        question: "Does SoftwareGlimpse verify legal retention compliance?",
        answer:
          "No. This page helps you evaluate product capabilities. Retention and deletion obligations vary by organization and jurisdiction — confirm requirements with counsel and with vendors.",
      },
      REQUIREMENT_VS_FEATURE_FAQ,
      {
        question: "Is a CSV export enough?",
        answer:
          "Sometimes for contacts. It is often incomplete for notes, activities, custom objects, and relationship history. Ask what is included before assuming portability.",
      },
    ],
    matrixFeatureSlugs: [
      "role-permissions",
      "custom-fields",
      "audit-logs",
      "contact-management",
      "integrations",
    ],
    screenshotMatchTerms: [
      "export",
      "import",
      "delete",
      "retention",
      "gdpr",
      "data",
    ],
  },
  {
    slug: "control-data-residency",
    name: "Control Data Residency",
    requirementType: "data-governance",
    requirementTypeLabel: "Data governance / platform",
    typicalImportanceLabel: "Situational (high when required)",
    tagline:
      "Compare how CRM platforms let you choose or constrain where customer data is stored and processed.",
    shortAnswer:
      "If residency matters for your organization, treat it as a vendor diligence question — not a feature checkbox. Confirm region options, what components are covered (app, backups, subprocessors), and whether residency choices are available on your plan. Do not assume a marketing region claim covers every processing path.",
    buyerNeedDescription:
      "Choose or constrain the regions where customer data is stored and processed so platform location matches organizational policy.",
    primaryCapabilitySlug: "security",
    primaryCapabilityName: "Security and administration",
    featureLinks: [
      {
        featureSlug: "role-permissions",
        name: "Role Permissions",
        relationship: "strongly-supporting",
        rationale:
          "Admin boundaries matter when residency settings are organization-wide.",
        icon: "shield",
      },
      {
        featureSlug: "sso",
        name: "Single Sign-On",
        relationship: "supporting",
        rationale:
          "Identity location and CRM residency are often reviewed together.",
        icon: "key",
      },
      {
        featureSlug: "integrations",
        name: "Integrations",
        relationship: "required",
        rationale:
          "Connected tools can move data outside the CRM’s chosen region.",
        icon: "puzzle",
      },
      {
        featureSlug: "audit-logs",
        name: "Audit Logs",
        relationship: "supporting",
        rationale:
          "Helps evidence who changed administration and access settings.",
        icon: "clock",
      },
      {
        featureSlug: "contact-management",
        name: "Contact Management",
        relationship: "supporting",
        rationale:
          "Customer records are usually the data residency reviewers care about first.",
        icon: "users",
      },
    ],
    evaluationCriteria: [
      {
        id: "region-options",
        name: "Region options",
        description:
          "Which storage/processing regions does the vendor actually offer?",
        featureSlugs: ["integrations"],
        importance: "required",
        icon: "globe",
      },
      {
        id: "coverage",
        name: "Coverage of components",
        description:
          "Do backups, logs, analytics, and subprocessors follow the same region claims?",
        featureSlugs: ["integrations", "audit-logs"],
        importance: "required",
        icon: "layers",
      },
      {
        id: "integrations-path",
        name: "Integration data paths",
        description:
          "Do connected systems create copies outside the chosen region?",
        featureSlugs: ["integrations"],
        importance: "important",
        icon: "puzzle",
      },
      {
        id: "plan-gate",
        name: "Plan availability",
        description: "Is residency choice available on the plan you would buy?",
        featureSlugs: ["role-permissions"],
        importance: "important",
        icon: "chart",
      },
      {
        id: "evidence",
        name: "Published evidence",
        description:
          "Does the vendor publish documentation you can review with stakeholders?",
        featureSlugs: ["audit-logs"],
        importance: "supporting",
        icon: "file",
      },
    ],
    needGuidance: {
      needIf: [
        "Organizational policy requires data in specific regions",
        "Procurement or security review asks for residency evidence",
        "Integrations could otherwise move data across borders",
      ],
      mayNotNeedIf: [
        "No residency constraint applies to your organization",
        "Another approved system already owns regulated records",
      ],
    },
    whyItMatters: [
      {
        id: "policy-fit",
        title: "Match organizational policy",
        description:
          "Residency is often a hard gate in procurement even when product fit is otherwise strong.",
        icon: "shield",
      },
      {
        id: "subprocessors",
        title: "Look beyond the app UI",
        description:
          "Backups, analytics, support tooling, and integrations can process data outside the primary region.",
        icon: "layers",
      },
      {
        id: "no-invention",
        title: "Do not invent compliance claims",
        description:
          "Region marketing is not the same as verified compliance for your use case. Verify with the vendor.",
        icon: "alert",
      },
    ],
    scenarios: [
      {
        id: "procurement",
        title: "Security questionnaire asks for region",
        description:
          "Buyers need a clear vendor answer covering storage, processing, and subprocessors.",
        priorities: ["Region options", "Coverage", "Documentation"],
        icon: "file",
      },
      {
        id: "stack",
        title: "CRM plus connected tools",
        description:
          "Even with CRM residency, email or warehouse connectors may create copies elsewhere.",
        priorities: ["Integration paths", "Vendor evidence"],
        icon: "puzzle",
      },
    ],
    useCaseLinks: [
      {
        id: "complex-sales-processes",
        title: "Complex sales processes",
        description:
          "Larger deals often trigger stronger procurement and residency review.",
        importanceLabel: "Situational",
        icon: "layers",
      },
      {
        id: "relationship-management",
        title: "Relationship-led teams",
        description:
          "Long-lived client records raise the stakes of where data lives.",
        importanceLabel: "Situational",
        icon: "handshake",
      },
    ],
    tradeoffs: [
      {
        id: "region-vs-features",
        title: "Region constraints vs feature availability",
        description:
          "Some features or AI add-ons may not be available in every region. Confirm jointly.",
        icon: "zap",
      },
      {
        id: "claim-vs-coverage",
        title: "Marketing region vs full coverage",
        description:
          "A primary data center claim may exclude logs, backups, or support tooling. Ask explicitly.",
        icon: "alert",
      },
    ],
    relatedRequirementSlugs: [
      "retain-and-export-data",
      "review-vendor-security-docs",
      "manage-integrations",
      "support-sso",
    ],
    relatedCapabilitySlugs: ["security", "integrations"],
    vendorQuestions: [
      "Which regions can store and process our customer data?",
      "Do backups, logs, analytics, and support tooling follow the same region?",
      "Which subprocessors process customer data, and where?",
      "Do integrations or AI features move data outside the chosen region?",
      "Is residency selection available on the plan we intend to buy?",
    ],
    faq: [
      {
        question: "Does SoftwareGlimpse certify data residency compliance?",
        answer:
          "No. We surface evaluation questions and vendor documentation paths. Residency and regulatory fit must be verified with vendors and your own advisors.",
      },
      REQUIREMENT_VS_FEATURE_FAQ,
      {
        question: "Is choosing a region the same as being compliant?",
        answer:
          "No. Region selection is one technical control. Compliance depends on your obligations, contracts, and how data actually flows — including integrations.",
      },
    ],
    matrixFeatureSlugs: [
      "integrations",
      "role-permissions",
      "sso",
      "audit-logs",
      "contact-management",
    ],
    screenshotMatchTerms: [
      "region",
      "data center",
      "residency",
      "location",
      "subprocessor",
    ],
  },
  {
    slug: "review-vendor-security-docs",
    name: "Review Vendor Security Documentation",
    requirementType: "vendor-diligence",
    requirementTypeLabel: "Vendor diligence / security",
    typicalImportanceLabel: "High for procurement reviews",
    tagline:
      "Compare what CRM vendors publish for security review — trust centers, questionnaires, and evidence packages — before shortlisting.",
    shortAnswer:
      "Ask for the trust center, security whitepaper, subprocessors list, and questionnaire responses early. Strong product fit still fails procurement if documentation is thin or only available late. Treat published docs as inputs to review — not as SoftwareGlimpse-verified compliance badges.",
    buyerNeedDescription:
      "Obtain and review vendor-published security documentation so stakeholders can assess controls without inventing assurance from marketing pages.",
    primaryCapabilitySlug: "security",
    primaryCapabilityName: "Security and administration",
    featureLinks: [
      {
        featureSlug: "sso",
        name: "Single Sign-On",
        relationship: "strongly-supporting",
        rationale:
          "Identity controls are among the first items security questionnaires cover.",
        icon: "key",
      },
      {
        featureSlug: "role-permissions",
        name: "Role Permissions",
        relationship: "strongly-supporting",
        rationale:
          "Access-control documentation should match the permission model you will configure.",
        icon: "shield",
      },
      {
        featureSlug: "audit-logs",
        name: "Audit Logs",
        relationship: "required",
        rationale:
          "Auditability claims need product capability and documented retention of logs.",
        icon: "clock",
      },
      {
        featureSlug: "integrations",
        name: "Integrations",
        relationship: "supporting",
        rationale:
          "Security reviews usually ask how third-party connections are authorized and monitored.",
        icon: "puzzle",
      },
      {
        featureSlug: "mobile-app",
        name: "Mobile App",
        relationship: "optional",
        rationale:
          "Mobile clients expand the attack surface reviewers often ask about.",
        icon: "smartphone",
      },
    ],
    evaluationCriteria: [
      {
        id: "trust-center",
        name: "Published trust center",
        description:
          "Is there a maintained trust/security portal with current documents?",
        featureSlugs: ["audit-logs"],
        importance: "required",
        icon: "file",
      },
      {
        id: "questionnaire",
        name: "Questionnaire readiness",
        description:
          "Can the vendor respond to standard security questionnaires in a usable timeframe?",
        featureSlugs: ["role-permissions", "sso"],
        importance: "required",
        icon: "clipboard",
      },
      {
        id: "controls-map",
        name: "Controls mapped to product",
        description:
          "Do documents explain SSO, permissions, logging, and data handling in product terms?",
        featureSlugs: ["sso", "role-permissions", "audit-logs"],
        importance: "important",
        icon: "layers",
      },
      {
        id: "subprocessors",
        name: "Subprocessors transparency",
        description: "Is a current subprocessors list available?",
        featureSlugs: ["integrations"],
        importance: "important",
        icon: "puzzle",
      },
      {
        id: "update-cadence",
        name: "Document freshness",
        description: "Are security documents dated and updated regularly?",
        featureSlugs: ["audit-logs"],
        importance: "supporting",
        icon: "clock",
      },
    ],
    needGuidance: {
      needIf: [
        "Procurement or security must approve vendors before purchase",
        "You need questionnaire answers for internal risk review",
        "Stakeholders require published evidence rather than sales claims",
      ],
      mayNotNeedIf: [
        "The purchase is a low-risk trial with no customer data yet",
        "Your organization has already approved the vendor globally",
      ],
    },
    whyItMatters: [
      {
        id: "procurement-gate",
        title: "Unblock procurement",
        description:
          "Missing docs often delay deals more than missing features.",
        icon: "clipboard",
      },
      {
        id: "no-badges",
        title: "Avoid badge-driven decisions",
        description:
          "Published documents help reviewers; they are not automatic proof of fit for your environment.",
        icon: "alert",
      },
      {
        id: "compare-early",
        title: "Compare evidence early",
        description:
          "Request the same artifact types from each shortlisted vendor so reviews stay comparable.",
        icon: "layers",
      },
    ],
    scenarios: [
      {
        id: "security-review",
        title: "Internal security review",
        description:
          "InfoSec needs a trust center, subprocessors list, and questionnaire pack before approval.",
        priorities: ["Trust center", "Questionnaire", "Subprocessors"],
        icon: "shield",
      },
      {
        id: "shortlist",
        title: "Comparing two shortlisted CRMs",
        description:
          "Buyers want documentation quality as an evaluation input alongside capabilities.",
        priorities: ["Controls map", "Freshness", "Product alignment"],
        icon: "chart",
      },
    ],
    useCaseLinks: [
      {
        id: "complex-sales-processes",
        title: "Complex sales processes",
        description:
          "Enterprise buying processes usually include formal security documentation review.",
        importanceLabel: "High",
        icon: "layers",
      },
      {
        id: "growing-teams",
        title: "Growing teams",
        description:
          "As customer data volume grows, documentation expectations usually rise.",
        importanceLabel: "Medium–High",
        icon: "trending",
      },
    ],
    tradeoffs: [
      {
        id: "speed-vs-depth",
        title: "Sales speed vs documentation depth",
        description:
          "Some vendors answer quickly with thin packs; others are slower but more complete. Plan time accordingly.",
        icon: "clock",
      },
      {
        id: "docs-vs-product",
        title: "Documents vs product reality",
        description:
          "Strong documentation does not guarantee the controls you need are on your plan. Verify both.",
        icon: "alert",
      },
    ],
    relatedRequirementSlugs: [
      "support-sso",
      "restrict-access-by-team",
      "audit-user-activity",
      "control-data-residency",
      "retain-and-export-data",
    ],
    relatedCapabilitySlugs: ["security"],
    vendorQuestions: [
      "Where is your current trust center or security documentation portal?",
      "What standard questionnaires can you complete, and in what timeframe?",
      "Where is the current subprocessors list published?",
      "Which documents cover SSO, permissions, logging, and data handling?",
      "How often are security documents reviewed and updated?",
    ],
    faq: [
      {
        question:
          "Does SoftwareGlimpse award security badges based on vendor docs?",
        answer:
          "No. We help you ask for and compare documentation. We do not invent compliance certifications or treat marketing claims as verified assurance.",
      },
      REQUIREMENT_VS_FEATURE_FAQ,
      {
        question: "What should we request from every shortlisted vendor?",
        answer:
          "A trust/security portal link, subprocessors list, and responses to your standard questionnaire — plus clarification of which controls apply on your intended plan.",
      },
    ],
    matrixFeatureSlugs: [
      "audit-logs",
      "sso",
      "role-permissions",
      "integrations",
      "mobile-app",
    ],
    screenshotMatchTerms: [
      "trust center",
      "security",
      "compliance",
      "questionnaire",
      "subprocessor",
    ],
  },
  {
    slug: "support-multiple-currencies",
    name: "Support Multiple Currencies",
    requirementType: "admin-pricing",
    requirementTypeLabel: "Administration / pricing",
    typicalImportanceLabel: "Medium–High (context-dependent)",
    tagline:
      "Compare how CRM platforms record deal values in more than one currency — and whether reports and forecasts can roll them up without a spreadsheet.",
    shortAnswer:
      "Multi-currency matters when deals are priced in different currencies and leadership still needs one pipeline or forecast number. Check whether currency is a first-class deal field, whether reporting can convert or group by currency, and which plan includes that behaviour — then confirm exchange-rate handling rather than assuming it.",
    buyerNeedDescription:
      "Record opportunity values in more than one currency and still produce trustworthy pipeline, reporting, and forecast totals for leadership.",
    primaryCapabilitySlug: "pipeline-management",
    primaryCapabilityName: "Pipeline management",
    featureLinks: [
      {
        featureSlug: "deal-management",
        name: "Deal Management",
        relationship: "required",
        rationale:
          "Deal value and currency live on the opportunity record the requirement depends on.",
        icon: "briefcase",
      },
      {
        featureSlug: "reporting",
        name: "Reporting",
        relationship: "strongly-supporting",
        rationale:
          "Leadership needs totals that group or convert across currencies, not a list of mixed amounts.",
        icon: "chart",
      },
      {
        featureSlug: "forecasting",
        name: "Forecasting",
        relationship: "strongly-supporting",
        rationale:
          "Forward revenue views inherit deal currency; inconsistent basis makes forecasts unusable.",
        icon: "trending",
      },
      {
        featureSlug: "custom-fields",
        name: "Custom Fields",
        relationship: "supporting",
        rationale:
          "Teams sometimes add currency or FX-related fields when native multi-currency options are limited.",
        icon: "settings",
      },
      {
        featureSlug: "integrations",
        name: "Integrations",
        relationship: "optional",
        rationale:
          "Accounting or ERP systems may own rates and invoices that must stay aligned with CRM values.",
        icon: "puzzle",
      },
      {
        featureSlug: "analytics",
        name: "Analytics",
        relationship: "optional",
        rationale:
          "Helps review conversion assumptions and historical revenue by currency over time.",
        icon: "chart",
      },
    ],
    evaluationCriteria: [
      {
        id: "deal-currency",
        name: "Deal-level currency",
        description:
          "Can each opportunity store a currency alongside its value?",
        featureSlugs: ["deal-management"],
        importance: "required",
        icon: "briefcase",
      },
      {
        id: "reporting-rollup",
        name: "Reporting across currencies",
        description:
          "Can reports group by currency or convert amounts into a reporting currency?",
        featureSlugs: ["reporting"],
        importance: "required",
        icon: "chart",
      },
      {
        id: "forecast-basis",
        name: "Forecast currency basis",
        description:
          "Can forecasts use a consistent currency when deals are mixed?",
        featureSlugs: ["forecasting", "deal-management"],
        importance: "important",
        icon: "trending",
      },
      {
        id: "rate-handling",
        name: "Exchange-rate handling",
        description:
          "Are rates configurable, synced, or left to the buyer — and when do they apply?",
        featureSlugs: ["deal-management", "integrations"],
        importance: "important",
        icon: "settings",
      },
      {
        id: "plan-limits",
        name: "Plan and object limits",
        description:
          "Is multi-currency available on the intended plan, and on which objects?",
        featureSlugs: ["deal-management", "custom-fields"],
        importance: "supporting",
        icon: "layers",
      },
    ],
    needGuidance: {
      needIf: [
        "Deals are routinely priced in more than one currency",
        "Leadership needs one pipeline or forecast total across regions",
        "Finance expects CRM values to align with invoicing currency",
        "Teams in different countries share the same CRM instance",
      ],
      mayNotNeedIf: [
        "Every deal is priced and reported in a single currency",
        "Currency conversion already happens outside the CRM and nobody reports from CRM totals",
        "Deal values are approximate and not used for planning",
      ],
    },
    whyItMatters: [
      {
        id: "trustworthy-totals",
        title: "Trustworthy totals",
        description:
          "Mixed currencies without a conversion or grouping rule produce pipeline numbers nobody should plan against.",
        icon: "chart",
      },
      {
        id: "regional-selling",
        title: "Regional selling",
        description:
          "Local teams can price in the currency buyers expect without breaking company-wide reporting.",
        icon: "globe",
      },
      {
        id: "forecast-quality",
        title: "Forecast quality",
        description:
          "Forward views inherit deal currency; a shared basis keeps commitments comparable.",
        icon: "trending",
      },
      {
        id: "finance-alignment",
        title: "Finance alignment",
        description:
          "CRM opportunity values that ignore currency create reconciliation work later.",
        icon: "check",
      },
    ],
    scenarios: [
      {
        id: "multi-region-pipeline",
        title: "Multi-region pipeline",
        description:
          "Teams sell in local currencies and leadership wants one weekly pipeline review.",
        priorities: [
          "Deal currency field",
          "Reporting conversion or grouping",
          "Shared dashboards",
        ],
        icon: "funnel",
      },
      {
        id: "single-reporting-currency",
        title: "One reporting currency",
        description:
          "Finance requires all CRM totals in a home currency even when quotes are local.",
        priorities: ["Exchange-rate rules", "Converted reports", "Auditability"],
        icon: "chart",
      },
      {
        id: "forecast-across-currencies",
        title: "Forecast across currencies",
        description:
          "Period commitments must combine deals priced in several currencies without double-counting or silent FX drift.",
        priorities: ["Forecast basis", "Rate timing", "Accuracy review"],
        icon: "trending",
      },
    ],
    useCaseLinks: [
      {
        id: "complex",
        title: "Complex sales processes",
        description:
          "Cross-border or multi-entity motions usually need currency on the deal record.",
        importanceLabel: "High",
        icon: "layers",
      },
      {
        id: "sales",
        title: "Pipeline-led sales teams",
        description:
          "Pipeline reviews lose meaning when deal values are in incompatible units.",
        importanceLabel: "High",
        icon: "funnel",
      },
      {
        id: "growing",
        title: "Growing teams",
        description:
          "Often deferred until the first international deal or regional hire appears.",
        importanceLabel: "Optional at first",
        icon: "trending",
      },
    ],
    tradeoffs: [
      {
        id: "native-vs-workaround",
        title: "Native multi-currency vs custom fields",
        description:
          "Native currency fields and conversion are safer for reporting; custom fields are flexible but easy to misuse in totals.",
        icon: "settings",
      },
      {
        id: "rate-timing",
        title: "Live rates vs locked rates",
        description:
          "Live conversion keeps reports current; locking at quote or close preserves the commercial number that was agreed.",
        icon: "clock",
      },
      {
        id: "plan",
        title: "Plan impact",
        description:
          "Multi-currency support is commonly plan-limited and may apply only to certain objects.",
        icon: "chart",
      },
    ],
    relatedRequirementSlugs: [
      "forecast-revenue",
      "customize-record-fields",
      "manage-integrations",
      "retain-and-export-data",
    ],
    relatedCapabilitySlugs: ["pipeline-management", "reporting"],
    vendorQuestions: [
      "Can each deal store its own currency alongside value?",
      "How do reports convert or group mixed-currency amounts?",
      "Where do exchange rates come from, and can they be locked?",
      "Do forecasts use a consistent reporting currency?",
      "Which objects support multi-currency (deals, products, invoices)?",
      "Which plan includes multi-currency, and are there limits?",
      "How should CRM values align with our accounting or ERP currency?",
    ],
    faq: [
      {
        question: "What does supporting multiple currencies require from a CRM?",
        answer:
          "A way to record currency on deal values, reporting that can group or convert those amounts, and a clear rule for when exchange rates apply — especially if forecasts depend on the same numbers.",
      },
      REQUIREMENT_VS_FEATURE_FAQ,
      {
        question: "Is a currency dropdown on a deal enough?",
        answer:
          "Not by itself. Leadership still needs reports and forecasts that treat mixed currencies consistently. Without conversion or grouping rules, totals remain ambiguous.",
      },
      {
        question: "When can custom fields substitute for multi-currency?",
        answer:
          "Only for lightweight tagging when nobody relies on CRM totals. If pipeline value or forecasts matter, treat native or verified multi-currency behaviour as the requirement — and confirm plan coverage.",
      },
    ],
    matrixFeatureSlugs: [
      "deal-management",
      "reporting",
      "forecasting",
      "custom-fields",
      "integrations",
      "analytics",
    ],
    screenshotMatchTerms: [
      "currency",
      "multi-currency",
      "exchange rate",
      "USD",
      "EUR",
      "reporting currency",
    ],
  },
];

const BY_SLUG = new Map(CRM_REQUIREMENTS.map((item) => [item.slug, item]));

export function getCrmRequirementDefinition(
  slug: string,
): CrmRequirementDefinition | null {
  return BY_SLUG.get(slug) ?? null;
}
