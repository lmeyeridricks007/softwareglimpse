/**
 * Shared CRM feature definitions for Feature Detail pages.
 *
 * Educational definitions and evaluation frameworks only. Support status, plan
 * availability, limits, and screenshots are resolved from catalogue + enrichment
 * at build time — unknown stays unknown.
 *
 * `multiple-pipelines` (catalogue slug `custom-pipelines`) and
 * `workflow-automation` are hand-authored elsewhere and intentionally absent.
 */

export type CrmFeatureDimensionDefinition = {
  id: string;
  name: string;
  description?: string;
  valueType: "support-status" | "plan" | "limit" | "text";
  source: "primary" | "related-feature" | "min-plan" | "notes-limit";
  relatedFeatureSlug?: string;
  importance?: "critical" | "high" | "important" | "optional";
};

export type CrmFeatureDefinition = {
  /** Public URL slug. */
  slug: string;
  /** Catalogue / enrichment slug when it differs from the page slug. */
  canonicalFeatureSlug?: string;
  name: string;
  featureType:
    | "boolean"
    | "tiered"
    | "quantitative"
    | "configurable"
    | "integration"
    | "usage-limited";
  featureTypeLabel: string;
  definition: string;
  notTheSameAs: string[];
  supportsBullets: string[];
  typicalBuyerNeed: string;
  commonLimitation: string;
  primaryCapabilitySlug: string;
  primaryCapabilityName: string;
  /** Added after the standard availability + minimum-plan dimensions. */
  extraDimensions: CrmFeatureDimensionDefinition[];
  needGuidance: { needIf: string[]; mayNotNeedIf: string[] };
  requirementMappings: Array<{
    id: string;
    name: string;
    description: string;
    supportLevel: "direct" | "partial" | "depends" | "indirect";
    requirementSlug?: string;
  }>;
  relatedFeatureSlugs: string[];
  relatedCapabilitySlugs: string[];
  tradeoffs: Array<{
    id: string;
    title: string;
    description: string;
    icon?: string;
  }>;
  vendorQuestions: string[];
  faq: Array<{ question: string; answer: string }>;
  screenshotMatchTerms: string[];
};

const PLAN_TRADEOFF = {
  id: "plan",
  title: "Plan restrictions",
  description:
    "Availability and depth often differ by plan tier, so check where this feature starts.",
  icon: "chart",
};

const IMPLEMENTATION_TRADEOFF = {
  id: "implementation",
  title: "Support is not the same as depth",
  description:
    "Two products can both support this feature and implement it very differently.",
  icon: "layers",
};

export const CRM_FEATURES: CrmFeatureDefinition[] = [
  {
    slug: "contact-management",
    name: "Contact Management",
    featureType: "configurable",
    featureTypeLabel: "Core record management",
    definition:
      "Contact management is how a CRM stores people and the organizations they belong to, together with the history of interactions, ownership, and the fields your team uses to describe them.",
    notTheSameAs: [
      "A contact list or address book export",
      "Email marketing audience lists",
      "Lead management, which handles unqualified enquiries",
      "Account-based marketing tooling",
    ],
    supportsBullets: [
      "One shared record per contact",
      "Contacts linked to companies or accounts",
      "Interaction history on a single timeline",
      "Ownership and assignment",
      "Segmentation and filtered lists",
    ],
    typicalBuyerNeed:
      "Relationship history must live on the record rather than in individual inboxes",
    commonLimitation:
      "Record limits, duplicate handling, and relationship depth vary widely",
    primaryCapabilitySlug: "contact-management",
    primaryCapabilityName: "Contact management",
    extraDimensions: [
      {
        id: "custom-fields",
        name: "Custom fields",
        valueType: "support-status",
        source: "related-feature",
        relatedFeatureSlug: "custom-fields",
        importance: "high",
      },
      {
        id: "email-history",
        name: "Automatic email history",
        valueType: "support-status",
        source: "related-feature",
        relatedFeatureSlug: "email-sync",
        importance: "high",
      },
      {
        id: "mobile-access",
        name: "Mobile access",
        valueType: "support-status",
        source: "related-feature",
        relatedFeatureSlug: "mobile-app",
        importance: "important",
      },
      {
        id: "record-limit",
        name: "Record limits",
        valueType: "limit",
        source: "notes-limit",
        importance: "important",
      },
    ],
    needGuidance: {
      needIf: [
        "More than one person touches the same relationships",
        "Relationship history currently lives in email",
        "Handovers lose context",
        "You need to segment contacts for outreach or review",
      ],
      mayNotNeedIf: [
        "A single person owns every relationship and always will",
        "Your interactions are one-off transactions with no follow-up",
      ],
    },
    requirementMappings: [
      {
        id: "track-interactions",
        name: "Track client interactions",
        description: "Keep every touchpoint on one timeline.",
        supportLevel: "direct",
        requirementSlug: "track-client-interactions",
      },
      {
        id: "custom-fields",
        name: "Customize record fields",
        description: "Depends on custom-field support in the product.",
        supportLevel: "depends",
        requirementSlug: "customize-record-fields",
      },
      {
        id: "restrict-access",
        name: "Restrict access by team",
        description: "Depends on the permission model, not the record itself.",
        supportLevel: "depends",
        requirementSlug: "restrict-access-by-team",
      },
    ],
    relatedFeatureSlugs: [
      "lead-management",
      "email-sync",
      "custom-fields",
      "mobile-app",
      "integrations",
    ],
    relatedCapabilitySlugs: [
      "contact-management",
      "pipeline-management",
      "security-administration",
    ],
    tradeoffs: [
      {
        id: "structure",
        title: "Structure vs entry speed",
        description:
          "Richer records support better reporting but slow down data entry.",
        icon: "settings",
      },
      {
        id: "duplicates",
        title: "Open creation vs data quality",
        description:
          "Letting anyone create records improves capture and increases duplicates.",
        icon: "database",
      },
      IMPLEMENTATION_TRADEOFF,
    ],
    vendorQuestions: [
      "How are contacts, companies, and accounts related?",
      "Are there limits on the number of records?",
      "How are duplicates detected and merged?",
      "Which interactions appear on the timeline automatically?",
      "Can we restrict visibility of specific records or fields?",
      "How do bulk import and export work?",
    ],
    faq: [
      {
        question: "What is contact management in a CRM?",
        answer:
          "It is the shared record of people, the accounts they belong to, their interaction history, and who owns the relationship.",
      },
      {
        question: "How is it different from lead management?",
        answer:
          "Lead management handles enquiries that are not yet qualified. Contact management holds the ongoing record once someone is a known person or customer.",
      },
      {
        question: "Do CRMs limit how many contacts we can store?",
        answer:
          "Some do, by plan. Where limits are recorded in our research they appear in the comparison; unverified cases stay marked as not verified.",
      },
    ],
    screenshotMatchTerms: ["contact", "account", "record", "timeline", "profile"],
  },
  {
    slug: "lead-management",
    name: "Lead Management",
    featureType: "configurable",
    featureTypeLabel: "Workflow / records",
    definition:
      "Lead management is how a CRM captures enquiries, assigns an owner, records qualification data, and moves qualified leads into the sales process.",
    notTheSameAs: [
      "Contact management, which handles known relationships",
      "Lead scoring, which ranks leads automatically",
      "Marketing automation campaigns",
      "A web form on its own",
    ],
    supportsBullets: [
      "Lead capture from forms and connected channels",
      "Owner assignment and routing",
      "Qualification status and fields",
      "Conversion into a contact or opportunity",
      "Source attribution",
    ],
    typicalBuyerNeed:
      "Every enquiry needs an owner and a response before it goes cold",
    commonLimitation:
      "Routing sophistication and native capture channels vary considerably",
    primaryCapabilitySlug: "contact-management",
    primaryCapabilityName: "Contact management",
    extraDimensions: [
      {
        id: "routing-automation",
        name: "Assignment automation",
        valueType: "support-status",
        source: "related-feature",
        relatedFeatureSlug: "sales-automation",
        importance: "high",
      },
      {
        id: "follow-up-automation",
        name: "Follow-up automation",
        valueType: "support-status",
        source: "related-feature",
        relatedFeatureSlug: "workflow-automation",
        importance: "high",
      },
      {
        id: "pipeline-conversion",
        name: "Conversion to pipeline",
        valueType: "support-status",
        source: "related-feature",
        relatedFeatureSlug: "pipeline-management",
        importance: "important",
      },
    ],
    needGuidance: {
      needIf: [
        "Enquiries arrive from several channels",
        "Leads need triage before entering the pipeline",
        "Response time affects conversion",
        "You need to report on lead source performance",
      ],
      mayNotNeedIf: [
        "All new business comes from referrals you handle personally",
        "Every enquiry is immediately an opportunity",
      ],
    },
    requirementMappings: [
      {
        id: "automate-follow-up",
        name: "Automate lead follow-up",
        description: "Lead records are what follow-up automation acts on.",
        supportLevel: "partial",
        requirementSlug: "automate-lead-follow-up",
      },
      {
        id: "track-interactions",
        name: "Track client interactions",
        description: "Captures early interactions before conversion.",
        supportLevel: "partial",
        requirementSlug: "track-client-interactions",
      },
    ],
    relatedFeatureSlugs: [
      "contact-management",
      "sales-automation",
      "pipeline-management",
      "email-sequences",
      "custom-fields",
    ],
    relatedCapabilitySlugs: [
      "contact-management",
      "workflow-automation",
      "pipeline-management",
    ],
    tradeoffs: [
      {
        id: "separation",
        title: "Separate leads vs one contact model",
        description:
          "A distinct lead object keeps unqualified data separate; a single model is simpler to run.",
        icon: "layers",
      },
      {
        id: "qualification",
        title: "Qualification depth vs response speed",
        description:
          "More qualification data improves prioritization and delays first contact.",
        icon: "clock",
      },
      PLAN_TRADEOFF,
    ],
    vendorQuestions: [
      "Which channels can create leads automatically?",
      "How is lead ownership assigned?",
      "Is there a separate lead object or one contact model?",
      "What happens to data when a lead converts?",
      "Can we report on lead source and conversion?",
      "Which lead functionality requires a higher plan?",
    ],
    faq: [
      {
        question: "What is lead management in a CRM?",
        answer:
          "It is the capture, assignment, qualification, and conversion of enquiries before they become opportunities.",
      },
      {
        question: "Do we need a separate lead object?",
        answer:
          "Only if unqualified enquiries would pollute your contact database. Smaller teams often manage leads as contacts with a status field.",
      },
      {
        question: "How is this different from lead scoring?",
        answer:
          "Lead management is the process and records. Lead scoring is an optional ranking layer that prioritizes which leads to work first.",
      },
    ],
    screenshotMatchTerms: ["lead", "enquiry", "assign", "queue", "convert"],
  },
  {
    slug: "email-sync",
    name: "Email Sync",
    featureType: "integration",
    featureTypeLabel: "Integration",
    definition:
      "Email sync connects a mailbox to the CRM so correspondence is attached to the right contact or deal automatically, rather than being copied in manually.",
    notTheSameAs: [
      "Email tracking, which reports opens and clicks",
      "Email sequences, which send timed campaigns",
      "BCC-to-CRM forwarding alone",
      "Marketing email sending",
    ],
    supportsBullets: [
      "Automatic logging of sent and received email",
      "Email visible on contact and deal records",
      "Calendar and meeting sync",
      "Send from the CRM using your mail account",
      "Control over which threads are shared",
    ],
    typicalBuyerNeed:
      "Correspondence must reach the record without anyone remembering to log it",
    commonLimitation:
      "Provider support and sync direction differ, and some products sync only outbound mail",
    primaryCapabilitySlug: "integrations",
    primaryCapabilityName: "Integrations",
    extraDimensions: [
      {
        id: "contact-timeline",
        name: "Appears on contact timeline",
        valueType: "support-status",
        source: "related-feature",
        relatedFeatureSlug: "contact-management",
        importance: "high",
      },
      {
        id: "tracking",
        name: "Open and click tracking",
        valueType: "support-status",
        source: "related-feature",
        relatedFeatureSlug: "email-tracking",
        importance: "important",
      },
      {
        id: "provider-notes",
        name: "Supported providers",
        valueType: "text",
        source: "notes-limit",
        importance: "high",
      },
    ],
    needGuidance: {
      needIf: [
        "Most client communication happens by email",
        "Colleagues need to see correspondence they were not copied on",
        "Manual logging is being skipped",
        "You want meetings on the record automatically",
      ],
      mayNotNeedIf: [
        "Communication happens mainly by phone or in person",
        "Privacy rules mean correspondence should not be shared team-wide",
      ],
    },
    requirementMappings: [
      {
        id: "integrate-email",
        name: "Integrate with email",
        description: "This is the feature that satisfies the requirement directly.",
        supportLevel: "direct",
        requirementSlug: "integrate-with-email",
      },
      {
        id: "track-interactions",
        name: "Track client interactions",
        description: "Supplies most of the interaction timeline in practice.",
        supportLevel: "direct",
        requirementSlug: "track-client-interactions",
      },
    ],
    relatedFeatureSlugs: [
      "contact-management",
      "email-tracking",
      "email-sequences",
      "integrations",
    ],
    relatedCapabilitySlugs: [
      "integrations",
      "contact-management",
      "workflow-automation",
    ],
    tradeoffs: [
      {
        id: "privacy",
        title: "Completeness vs privacy",
        description:
          "Full mailbox sync gives complete history and shares more than some teams intend.",
        icon: "shield",
      },
      {
        id: "provider",
        title: "Provider dependency",
        description:
          "Sync depth usually differs between mail providers, so test with yours.",
        icon: "puzzle",
      },
      IMPLEMENTATION_TRADEOFF,
    ],
    vendorQuestions: [
      "Which mail and calendar providers are supported?",
      "Is sync one-way or two-way?",
      "Are inbound emails logged, or only outbound?",
      "Can individual threads or domains be excluded?",
      "Can we send from the CRM using our own mail account?",
      "Does email sync require a higher plan?",
    ],
    faq: [
      {
        question: "What does CRM email sync do?",
        answer:
          "It attaches email correspondence to the matching CRM record automatically, so the timeline stays current without manual logging.",
      },
      {
        question: "Is email sync the same as email tracking?",
        answer:
          "No. Sync stores the correspondence on the record. Tracking reports whether a recipient opened or clicked a message.",
      },
      {
        question: "Can we control what gets synced?",
        answer:
          "Usually to some degree — exclusions by domain, thread, or folder are common. The specifics vary by product, so verify with the vendor.",
      },
    ],
    screenshotMatchTerms: ["email", "inbox", "sync", "calendar", "gmail", "outlook"],
  },
  {
    slug: "custom-fields",
    name: "Custom Fields",
    featureType: "quantitative",
    featureTypeLabel: "Configuration (often limited by plan)",
    definition:
      "Custom fields let you add your own attributes to CRM records so the data model reflects how your team qualifies, segments, and reports — not just the vendor's defaults.",
    notTheSameAs: [
      "Custom objects, which add whole new record types",
      "Tags or labels",
      "Custom report columns",
      "Free-text notes",
    ],
    supportsBullets: [
      "Extra fields on contacts, companies, and deals",
      "Field types such as dropdowns, dates, and numbers",
      "Required fields and validation",
      "Fields usable in filters, reports, and automation",
      "Field-level visibility where supported",
    ],
    typicalBuyerNeed:
      "The data that drives decisions is not in the default record",
    commonLimitation:
      "Field counts, available types, and per-object limits are frequently plan-dependent",
    primaryCapabilitySlug: "contact-management",
    primaryCapabilityName: "Contact management",
    extraDimensions: [
      {
        id: "field-limit",
        name: "Custom field limits",
        valueType: "limit",
        source: "notes-limit",
        importance: "high",
      },
      {
        id: "reportable",
        name: "Usable in reports",
        valueType: "support-status",
        source: "related-feature",
        relatedFeatureSlug: "reporting",
        importance: "high",
      },
      {
        id: "automation-usable",
        name: "Usable in automation",
        valueType: "support-status",
        source: "related-feature",
        relatedFeatureSlug: "workflow-automation",
        importance: "important",
      },
    ],
    needGuidance: {
      needIf: [
        "Segmentation depends on data the CRM does not capture by default",
        "Reports need fields specific to your process",
        "Automation must branch on your own attributes",
      ],
      mayNotNeedIf: [
        "Standard fields already describe your records",
        "Nobody would maintain additional fields",
      ],
    },
    requirementMappings: [
      {
        id: "customize-fields",
        name: "Customize record fields",
        description: "Directly satisfies the requirement.",
        supportLevel: "direct",
        requirementSlug: "customize-record-fields",
      },
      {
        id: "track-interactions",
        name: "Track client interactions",
        description: "Supports structured detail alongside the timeline.",
        supportLevel: "indirect",
        requirementSlug: "track-client-interactions",
      },
    ],
    relatedFeatureSlugs: [
      "contact-management",
      "reporting-dashboards",
      "deal-management",
      "role-permissions",
    ],
    relatedCapabilitySlugs: [
      "contact-management",
      "reporting",
      "security-administration",
    ],
    tradeoffs: [
      {
        id: "sprawl",
        title: "Flexibility vs field sprawl",
        description:
          "Unmanaged custom fields accumulate until nobody knows which to fill in.",
        icon: "settings",
      },
      {
        id: "required",
        title: "Required fields vs adoption",
        description:
          "Mandatory fields improve data quality and slow down record creation.",
        icon: "users",
      },
      PLAN_TRADEOFF,
    ],
    vendorQuestions: [
      "How many custom fields are allowed, and per which object?",
      "Which field types are available?",
      "Can fields be made required or validated?",
      "Can custom fields be used in reports and automation?",
      "Can field visibility be restricted by role?",
      "Do higher field limits require an upgrade?",
    ],
    faq: [
      {
        question: "What are CRM custom fields?",
        answer:
          "They are additional attributes you define on records so the CRM captures the data your process depends on.",
      },
      {
        question: "How many custom fields do we need?",
        answer:
          "Only the ones that change a decision or appear in a report. Fields nobody reads become fields nobody fills in.",
      },
      {
        question: "Are custom fields limited by plan?",
        answer:
          "Often yes. Limits per object and plan are a common constraint; where limits are recorded in our research they are shown, otherwise they stay marked not verified.",
      },
    ],
    screenshotMatchTerms: ["field", "custom", "settings", "properties", "record"],
  },
  {
    slug: "pipeline-management",
    name: "Pipeline Management",
    featureType: "configurable",
    featureTypeLabel: "Core workflow",
    definition:
      "Pipeline management is how a CRM represents opportunities moving through stages, with ownership, activities, and a view that shows what is progressing and what has stalled.",
    notTheSameAs: [
      "Multiple pipelines, which is running more than one stage model",
      "A task list or project board",
      "Forecasting, which projects outcomes",
      "Workflow automation, which reacts to changes",
    ],
    supportsBullets: [
      "Configurable stages",
      "Board and list views of open opportunities",
      "Deal ownership",
      "Activities and next actions on each deal",
      "Stage movement history where available",
    ],
    typicalBuyerNeed:
      "Sales work must be visible and progressable rather than living in individual heads",
    commonLimitation:
      "Stage configurability, pipeline count, and stalled-deal visibility differ widely",
    primaryCapabilitySlug: "pipeline-management",
    primaryCapabilityName: "Pipeline management",
    extraDimensions: [
      {
        id: "multiple-pipelines",
        name: "Multiple pipelines",
        valueType: "support-status",
        source: "related-feature",
        relatedFeatureSlug: "custom-pipelines",
        importance: "high",
      },
      {
        id: "deal-records",
        name: "Deal records",
        valueType: "support-status",
        source: "related-feature",
        relatedFeatureSlug: "deal-management",
        importance: "high",
      },
      {
        id: "stage-automation",
        name: "Stage automation",
        valueType: "support-status",
        source: "related-feature",
        relatedFeatureSlug: "workflow-automation",
        importance: "high",
      },
      {
        id: "pipeline-reporting",
        name: "Pipeline reporting",
        valueType: "support-status",
        source: "related-feature",
        relatedFeatureSlug: "reporting",
        importance: "important",
      },
    ],
    needGuidance: {
      needIf: [
        "More than one opportunity is open at a time",
        "Managers need visibility of progress",
        "Deals are being lost to silence",
        "Handovers require clear ownership",
      ],
      mayNotNeedIf: [
        "You have no recurring sales process",
        "Work is transactional with no stages between enquiry and sale",
      ],
    },
    requirementMappings: [
      {
        id: "separate-processes",
        name: "Support separate sales processes",
        description: "Base capability that multiple pipelines build on.",
        supportLevel: "partial",
        requirementSlug: "separate-sales-processes",
      },
      {
        id: "forecast",
        name: "Forecast revenue",
        description: "Supplies the pipeline data forecasting depends on.",
        supportLevel: "partial",
        requirementSlug: "forecast-revenue",
      },
      {
        id: "automate-follow-up",
        name: "Automate lead follow-up",
        description: "Stage changes are the usual automation trigger.",
        supportLevel: "depends",
        requirementSlug: "automate-lead-follow-up",
      },
    ],
    relatedFeatureSlugs: [
      "deal-management",
      "custom-pipelines",
      "workflow-automation",
      "forecasting",
      "reporting-dashboards",
    ],
    relatedCapabilitySlugs: [
      "pipeline-management",
      "workflow-automation",
      "reporting",
    ],
    tradeoffs: [
      {
        id: "stages",
        title: "Few stages vs process detail",
        description:
          "More stages describe the process better and make the board harder to keep accurate.",
        icon: "funnel",
      },
      {
        id: "flexibility",
        title: "Configurability vs administration",
        description:
          "Highly configurable pipelines need an owner to keep them coherent.",
        icon: "settings",
      },
      PLAN_TRADEOFF,
    ],
    vendorQuestions: [
      "Can we configure stages without vendor help?",
      "How does the product highlight stalled deals?",
      "Is stage movement history retained and reportable?",
      "How many pipelines are included on our plan?",
      "Can required fields differ by stage?",
      "Can automation trigger on stage changes?",
    ],
    faq: [
      {
        question: "What is pipeline management in a CRM?",
        answer:
          "It is the stage-based view of open opportunities, with ownership and next actions, that lets a team progress and report on sales work consistently.",
      },
      {
        question: "How is it different from multiple pipelines?",
        answer:
          "Pipeline management is the core capability. Multiple pipelines means running more than one distinct stage model alongside it.",
      },
      {
        question: "How many stages should a pipeline have?",
        answer:
          "As many as have a clear exit criterion. Stages nobody can define tend to collect deals rather than move them.",
      },
    ],
    screenshotMatchTerms: ["pipeline", "kanban", "deal", "stage", "board"],
  },
  {
    slug: "deal-management",
    name: "Deal Management",
    featureType: "configurable",
    featureTypeLabel: "Core records",
    definition:
      "Deal management is the opportunity record itself — value, expected close date, owner, linked contacts, products, and the activity history behind the number in your pipeline.",
    notTheSameAs: [
      "Pipeline management, which is the stage model around deals",
      "Quoting or proposal software",
      "Order or invoice management",
      "Forecasting",
    ],
    supportsBullets: [
      "Deal value and currency",
      "Expected close date",
      "Owner and collaborators",
      "Linked contacts and companies",
      "Products or line items where supported",
      "Won and lost reasons",
    ],
    typicalBuyerNeed:
      "Each opportunity needs a record that can be valued, owned, and reported on",
    commonLimitation:
      "Products, line items, and multi-currency support are often higher-plan features",
    primaryCapabilitySlug: "pipeline-management",
    primaryCapabilityName: "Pipeline management",
    extraDimensions: [
      {
        id: "pipeline-view",
        name: "Pipeline views",
        valueType: "support-status",
        source: "related-feature",
        relatedFeatureSlug: "pipeline-management",
        importance: "high",
      },
      {
        id: "custom-fields",
        name: "Custom deal fields",
        valueType: "support-status",
        source: "related-feature",
        relatedFeatureSlug: "custom-fields",
        importance: "high",
      },
      {
        id: "forecast-input",
        name: "Feeds forecasting",
        valueType: "support-status",
        source: "related-feature",
        relatedFeatureSlug: "forecasting",
        importance: "important",
      },
    ],
    needGuidance: {
      needIf: [
        "You need pipeline value, not just a count of opportunities",
        "Deals have close dates that drive planning",
        "Won and lost analysis matters",
      ],
      mayNotNeedIf: [
        "You do not track opportunity value",
        "Every sale closes in one interaction",
      ],
    },
    requirementMappings: [
      {
        id: "forecast",
        name: "Forecast revenue",
        description: "Value and close date are the inputs a forecast needs.",
        supportLevel: "direct",
        requirementSlug: "forecast-revenue",
      },
      {
        id: "separate-processes",
        name: "Support separate sales processes",
        description: "Deals are what separate pipelines contain.",
        supportLevel: "indirect",
        requirementSlug: "separate-sales-processes",
      },
    ],
    relatedFeatureSlugs: [
      "pipeline-management",
      "custom-pipelines",
      "forecasting",
      "custom-fields",
      "reporting-dashboards",
    ],
    relatedCapabilitySlugs: ["pipeline-management", "reporting"],
    tradeoffs: [
      {
        id: "detail",
        title: "Deal detail vs entry effort",
        description:
          "Line items and detailed fields improve reporting and add work per deal.",
        icon: "settings",
      },
      {
        id: "accuracy",
        title: "Value accuracy vs optimism",
        description:
          "Deal values and close dates are only as reliable as the discipline behind them.",
        icon: "chart",
      },
      PLAN_TRADEOFF,
    ],
    vendorQuestions: [
      "Which fields exist on a deal by default?",
      "Are products or line items supported?",
      "Is multi-currency supported, and on which plan?",
      "Can we record structured won and lost reasons?",
      "Can several people collaborate on one deal?",
      "How does deal data feed forecasting?",
    ],
    faq: [
      {
        question: "What is deal management?",
        answer:
          "It is the opportunity record — value, close date, owner, linked people, and history — that pipeline views and forecasts are built from.",
      },
      {
        question: "How is it different from pipeline management?",
        answer:
          "Deals are the records; the pipeline is the stage model they move through. Products differ in how much detail the deal record holds.",
      },
      {
        question: "Do we need products or line items?",
        answer:
          "Only if deal value varies by what is sold and you need to report on it. Otherwise a single value field is usually enough.",
      },
    ],
    screenshotMatchTerms: ["deal", "opportunity", "value", "close date", "won"],
  },
  {
    slug: "sales-automation",
    name: "Sales Automation",
    featureType: "tiered",
    featureTypeLabel: "Automation (plan-tiered)",
    definition:
      "Sales automation is the set of rules that handle sales-specific administration — assigning records, creating follow-up tasks, updating stages, and notifying owners — without anyone doing it by hand.",
    notTheSameAs: [
      "General workflow automation across all objects",
      "Email sequences, which send timed outreach",
      "Marketing automation campaigns",
      "AI assistance",
    ],
    supportsBullets: [
      "Automatic record assignment and routing",
      "Task creation on stage change",
      "Field updates from rules",
      "Owner notifications and escalation",
      "Activity logging without manual entry",
    ],
    typicalBuyerNeed:
      "Sales admin work is consuming selling time and being applied inconsistently",
    commonLimitation:
      "Rule counts and monthly executions are commonly capped by plan",
    primaryCapabilitySlug: "workflow-automation",
    primaryCapabilityName: "Workflow automation",
    extraDimensions: [
      {
        id: "workflow-builder",
        name: "General workflow builder",
        valueType: "support-status",
        source: "related-feature",
        relatedFeatureSlug: "workflow-automation",
        importance: "high",
      },
      {
        id: "sequences",
        name: "Email sequences",
        valueType: "support-status",
        source: "related-feature",
        relatedFeatureSlug: "email-sequences",
        importance: "important",
      },
      {
        id: "execution-limits",
        name: "Execution limits",
        valueType: "limit",
        source: "notes-limit",
        importance: "high",
      },
    ],
    needGuidance: {
      needIf: [
        "Leads wait for manual assignment",
        "Follow-up depends on individuals remembering",
        "The same administrative steps repeat on every deal",
      ],
      mayNotNeedIf: [
        "Volume is low enough to handle manually",
        "Your process is still changing week to week",
      ],
    },
    requirementMappings: [
      {
        id: "automate-follow-up",
        name: "Automate lead follow-up",
        description: "Directly satisfies assignment and follow-up automation.",
        supportLevel: "direct",
        requirementSlug: "automate-lead-follow-up",
      },
    ],
    relatedFeatureSlugs: [
      "workflow-automation",
      "email-sequences",
      "lead-management",
      "pipeline-management",
    ],
    relatedCapabilitySlugs: ["workflow-automation", "pipeline-management"],
    tradeoffs: [
      {
        id: "rigidity",
        title: "Consistency vs rigidity",
        description:
          "Automated steps standardize behaviour and can obstruct legitimate exceptions.",
        icon: "settings",
      },
      {
        id: "limits",
        title: "Capability vs execution limits",
        description:
          "Monthly execution caps often bind before the feature list does.",
        icon: "chart",
      },
      PLAN_TRADEOFF,
    ],
    vendorQuestions: [
      "Which sales actions can be automated?",
      "How are records assigned automatically?",
      "How many rules and executions does our plan allow?",
      "Can rules differ by team or pipeline?",
      "Can we see what a rule changed on a record?",
      "Which automation requires an upgrade or add-on?",
    ],
    faq: [
      {
        question: "What is sales automation in a CRM?",
        answer:
          "It is rule-based handling of sales administration such as assignment, task creation, field updates, and notifications.",
      },
      {
        question: "How is it different from workflow automation?",
        answer:
          "Sales automation is the sales-specific subset. General workflow automation usually spans more objects and offers deeper conditional logic.",
      },
      {
        question: "What should we automate first?",
        answer:
          "Assignment and first follow-up, because those are where delay costs the most. Automate a settled process rather than one still being designed.",
      },
    ],
    screenshotMatchTerms: ["automation", "rule", "assign", "trigger", "workflow"],
  },
  {
    slug: "email-sequences",
    name: "Email Sequences",
    featureType: "usage-limited",
    featureTypeLabel: "Automation (usage-limited)",
    definition:
      "Email sequences send a predefined series of messages over time to a contact, pausing or stopping automatically when the recipient replies or meets an exit condition.",
    notTheSameAs: [
      "Email marketing campaigns to large lists",
      "Email sync, which logs correspondence",
      "One-off templated emails",
      "Newsletters",
    ],
    supportsBullets: [
      "Multi-step follow-up on a schedule",
      "Automatic stop on reply",
      "Personalization tokens",
      "Enrolment from records or automation",
      "Reply and engagement reporting",
    ],
    typicalBuyerNeed:
      "Follow-up needs to persist beyond the first message without manual chasing",
    commonLimitation:
      "Daily or monthly send limits and per-seat enrolment caps are common",
    primaryCapabilitySlug: "workflow-automation",
    primaryCapabilityName: "Workflow automation",
    extraDimensions: [
      {
        id: "tracking",
        name: "Open and click tracking",
        valueType: "support-status",
        source: "related-feature",
        relatedFeatureSlug: "email-tracking",
        importance: "high",
      },
      {
        id: "automation-enrolment",
        name: "Automated enrolment",
        valueType: "support-status",
        source: "related-feature",
        relatedFeatureSlug: "workflow-automation",
        importance: "high",
      },
      {
        id: "send-limits",
        name: "Send limits",
        valueType: "limit",
        source: "notes-limit",
        importance: "high",
      },
    ],
    needGuidance: {
      needIf: [
        "Outbound follow-up needs several touches",
        "Reps are dropping follow-up after the first email",
        "You want consistent messaging across the team",
      ],
      mayNotNeedIf: [
        "Volume is low and each message is bespoke",
        "Your relationships would be damaged by templated follow-up",
      ],
    },
    requirementMappings: [
      {
        id: "automate-follow-up",
        name: "Automate lead follow-up",
        description: "Delivers multi-step follow-up directly.",
        supportLevel: "direct",
        requirementSlug: "automate-lead-follow-up",
      },
      {
        id: "integrate-email",
        name: "Integrate with email",
        description: "Depends on mailbox connection to send and detect replies.",
        supportLevel: "depends",
        requirementSlug: "integrate-with-email",
      },
    ],
    relatedFeatureSlugs: [
      "email-tracking",
      "email-sync",
      "sales-automation",
      "workflow-automation",
    ],
    relatedCapabilitySlugs: ["workflow-automation", "integrations"],
    tradeoffs: [
      {
        id: "scale",
        title: "Reach vs relevance",
        description:
          "Sequences scale follow-up and reduce how personal each message feels.",
        icon: "mail",
      },
      {
        id: "deliverability",
        title: "Volume vs deliverability",
        description:
          "Higher send volume from a mailbox increases deliverability risk.",
        icon: "shield",
      },
      PLAN_TRADEOFF,
    ],
    vendorQuestions: [
      "How many steps can a sequence contain?",
      "Are there daily or monthly send limits?",
      "Does a reply stop the sequence automatically?",
      "Can enrolment be triggered by automation?",
      "Which mailbox is used to send?",
      "Which plan includes sequences, and are seats limited?",
    ],
    faq: [
      {
        question: "What are CRM email sequences?",
        answer:
          "They are scheduled multi-step follow-up emails that stop automatically when the recipient replies or meets an exit condition.",
      },
      {
        question: "How are sequences different from email marketing?",
        answer:
          "Sequences send from an individual mailbox to a small number of people as part of a sales conversation. Marketing email sends campaigns to lists.",
      },
      {
        question: "Do sequences hurt deliverability?",
        answer:
          "They can if volume rises sharply from one mailbox. Send limits exist partly for this reason — check the caps on your plan.",
      },
    ],
    screenshotMatchTerms: ["sequence", "cadence", "email", "step", "enroll"],
  },
  {
    slug: "email-tracking",
    name: "Email Tracking",
    featureType: "boolean",
    featureTypeLabel: "Tracking",
    definition:
      "Email tracking reports whether a sent message was opened and whether links in it were clicked, and surfaces that engagement on the CRM record.",
    notTheSameAs: [
      "Email sync, which logs correspondence",
      "Email sequences, which send follow-up steps",
      "Read receipts requested from the recipient",
      "Website visitor tracking",
    ],
    supportsBullets: [
      "Open notifications",
      "Link click tracking",
      "Engagement visible on the record",
      "Template performance comparison",
      "Follow-up prompts based on engagement",
    ],
    typicalBuyerNeed:
      "Reps need a signal about which outreach landed before deciding who to chase",
    commonLimitation:
      "Open tracking is unreliable when recipients block images or use privacy proxies",
    primaryCapabilitySlug: "workflow-automation",
    primaryCapabilityName: "Workflow automation",
    extraDimensions: [
      {
        id: "sequence-reporting",
        name: "Sequence engagement reporting",
        valueType: "support-status",
        source: "related-feature",
        relatedFeatureSlug: "email-sequences",
        importance: "important",
      },
      {
        id: "record-visibility",
        name: "Engagement on record",
        valueType: "support-status",
        source: "related-feature",
        relatedFeatureSlug: "contact-management",
        importance: "important",
      },
    ],
    needGuidance: {
      needIf: [
        "Outbound volume makes prioritizing follow-up difficult",
        "You want to compare template or subject performance",
        "Reps need a prompt to follow up on engagement",
      ],
      mayNotNeedIf: [
        "Your relationships are warm and replies are the norm",
        "Tracking recipients raises privacy concerns for your organization",
      ],
    },
    requirementMappings: [
      {
        id: "automate-follow-up",
        name: "Automate lead follow-up",
        description: "Engagement signals can prioritize or trigger follow-up.",
        supportLevel: "partial",
        requirementSlug: "automate-lead-follow-up",
      },
      {
        id: "track-interactions",
        name: "Track client interactions",
        description: "Adds engagement detail to the interaction record.",
        supportLevel: "partial",
        requirementSlug: "track-client-interactions",
      },
    ],
    relatedFeatureSlugs: ["email-sync", "email-sequences", "sales-automation"],
    relatedCapabilitySlugs: ["workflow-automation", "integrations"],
    tradeoffs: [
      {
        id: "accuracy",
        title: "Signal vs reliability",
        description:
          "Open data is increasingly unreliable; clicks and replies are stronger signals.",
        icon: "chart",
      },
      {
        id: "privacy",
        title: "Insight vs recipient privacy",
        description:
          "Tracking individual recipients may conflict with your privacy stance.",
        icon: "shield",
      },
      PLAN_TRADEOFF,
    ],
    vendorQuestions: [
      "Are opens, clicks, or both tracked?",
      "Can tracking be disabled per message or per user?",
      "Where does engagement appear on the record?",
      "Can automation react to engagement?",
      "Which plan includes tracking?",
    ],
    faq: [
      {
        question: "What is CRM email tracking?",
        answer:
          "It reports whether a sent email was opened or clicked, and shows that engagement against the contact record.",
      },
      {
        question: "Is open tracking accurate?",
        answer:
          "Not entirely. Image blocking and privacy proxies distort open data, so clicks and replies are more dependable signals.",
      },
      {
        question: "Can we turn tracking off?",
        answer:
          "Most products allow it per message or per user. Confirm the controls if privacy expectations matter to your organization.",
      },
    ],
    screenshotMatchTerms: ["email", "open", "click", "tracking", "engagement"],
  },
  {
    slug: "calling",
    canonicalFeatureSlug: "call-functionality",
    name: "Calling",
    featureType: "integration",
    featureTypeLabel: "Communication (often an add-on)",
    definition:
      "Calling lets users place or log calls from the CRM, attaching call records, notes, outcomes, and sometimes recordings to the relevant contact or deal.",
    notTheSameAs: [
      "A full contact-centre platform",
      "Manually typed call notes alone",
      "Meeting scheduling",
      "Video conferencing",
    ],
    supportsBullets: [
      "Click-to-call from a record",
      "Automatic call logging",
      "Call outcomes and dispositions",
      "Recording where supported and permitted",
      "Call activity reporting",
    ],
    typicalBuyerNeed:
      "Phone conversations must appear on the record without manual note-taking",
    commonLimitation:
      "Calling is frequently an add-on with separate per-minute or per-seat costs",
    primaryCapabilitySlug: "sales-engagement",
    primaryCapabilityName: "Sales engagement",
    extraDimensions: [
      {
        id: "activity-record",
        name: "Logged on record",
        valueType: "support-status",
        source: "related-feature",
        relatedFeatureSlug: "contact-management",
        importance: "high",
      },
      {
        id: "telephony-integration",
        name: "Telephony integrations",
        valueType: "support-status",
        source: "related-feature",
        relatedFeatureSlug: "integrations",
        importance: "high",
      },
      {
        id: "call-reporting",
        name: "Call reporting",
        valueType: "support-status",
        source: "related-feature",
        relatedFeatureSlug: "reporting",
        importance: "important",
      },
    ],
    needGuidance: {
      needIf: [
        "Phone is a primary channel for your team",
        "Call outcomes need to be reported on",
        "Reps make enough calls that logging is a burden",
      ],
      mayNotNeedIf: [
        "Communication is mainly email or in person",
        "You already run a separate telephony system you are happy with",
      ],
    },
    requirementMappings: [
      {
        id: "track-interactions",
        name: "Track client interactions",
        description: "Brings phone conversations onto the timeline.",
        supportLevel: "direct",
        requirementSlug: "track-client-interactions",
      },
    ],
    relatedFeatureSlugs: [
      "contact-management",
      "integrations",
      "mobile-app",
      "reporting-dashboards",
    ],
    relatedCapabilitySlugs: ["sales-engagement", "contact-management"],
    tradeoffs: [
      {
        id: "native-vs-integration",
        title: "Native calling vs telephony integration",
        description:
          "Native calling is simpler to start; integrating existing telephony preserves your numbers and controls.",
        icon: "puzzle",
      },
      {
        id: "cost",
        title: "Convenience vs usage cost",
        description:
          "Per-minute or per-seat calling charges sit outside the base subscription.",
        icon: "chart",
      },
      {
        id: "recording",
        title: "Recording vs consent obligations",
        description:
          "Recording requirements vary by jurisdiction — confirm obligations before enabling it.",
        icon: "shield",
      },
    ],
    vendorQuestions: [
      "Is calling native, or via a telephony integration?",
      "Which telephony providers are supported?",
      "Are calls logged automatically with outcomes?",
      "Is recording available, and how is consent handled?",
      "What are the usage costs beyond the subscription?",
      "Can we report on call activity and outcomes?",
    ],
    faq: [
      {
        question: "What does CRM calling include?",
        answer:
          "Typically click-to-call, automatic logging, outcomes, and sometimes recording — either natively or through a telephony integration.",
      },
      {
        question: "Is calling included in CRM pricing?",
        answer:
          "Often not. Calling is commonly an add-on with usage charges. Confirm both the plan requirement and per-minute costs.",
      },
      {
        question: "Should we use native calling or integrate our phone system?",
        answer:
          "Integrate if you already have numbers, routing, or compliance controls you need to keep. Native calling is faster to start from nothing.",
      },
    ],
    screenshotMatchTerms: ["call", "dialer", "phone", "recording", "log"],
  },
  {
    slug: "reporting-dashboards",
    canonicalFeatureSlug: "reporting",
    name: "Reporting Dashboards",
    featureType: "tiered",
    featureTypeLabel: "Reporting (plan-tiered)",
    definition:
      "Reporting dashboards are saved, shareable views of CRM data — pipeline, activity, conversion, and custom fields — so decisions rest on the system rather than a spreadsheet.",
    notTheSameAs: [
      "Forecasting, which projects future outcomes",
      "A business intelligence platform",
      "A single dashboard widget",
      "Raw data export",
    ],
    supportsBullets: [
      "Standard pipeline and activity reports",
      "Custom reports on your own fields",
      "Dashboards per role or team",
      "Scheduled or shared reports",
      "Filtering and grouping",
    ],
    typicalBuyerNeed:
      "Managers need trustworthy numbers without rebuilding them in a spreadsheet",
    commonLimitation:
      "Custom report builders and dashboard counts are usually restricted by plan",
    primaryCapabilitySlug: "reporting",
    primaryCapabilityName: "Reporting and forecasting",
    extraDimensions: [
      {
        id: "custom-field-reporting",
        name: "Reports on custom fields",
        valueType: "support-status",
        source: "related-feature",
        relatedFeatureSlug: "custom-fields",
        importance: "high",
      },
      {
        id: "analytics-depth",
        name: "Advanced analytics",
        valueType: "support-status",
        source: "related-feature",
        relatedFeatureSlug: "analytics",
        importance: "important",
      },
      {
        id: "forecast-link",
        name: "Forecasting",
        valueType: "support-status",
        source: "related-feature",
        relatedFeatureSlug: "forecasting",
        importance: "important",
      },
      {
        id: "dashboard-limits",
        name: "Dashboard or report limits",
        valueType: "limit",
        source: "notes-limit",
        importance: "important",
      },
    ],
    needGuidance: {
      needIf: [
        "Pipeline reviews currently run on spreadsheets",
        "Different roles need different views",
        "You need conversion data, not just current totals",
      ],
      mayNotNeedIf: [
        "One person can see the whole pipeline at a glance",
        "Decisions do not depend on trend data yet",
      ],
    },
    requirementMappings: [
      {
        id: "forecast",
        name: "Forecast revenue",
        description: "Reporting supplies the base data; forecasting adds projection.",
        supportLevel: "partial",
        requirementSlug: "forecast-revenue",
      },
      {
        id: "audit-activity",
        name: "Audit user activity",
        description:
          "Activity reports are not an audit trail, though they overlap.",
        supportLevel: "indirect",
        requirementSlug: "audit-user-activity",
      },
    ],
    relatedFeatureSlugs: [
      "forecasting",
      "analytics",
      "custom-fields",
      "pipeline-management",
    ],
    relatedCapabilitySlugs: ["reporting", "pipeline-management"],
    tradeoffs: [
      {
        id: "builder",
        title: "Prebuilt reports vs custom builders",
        description:
          "Prebuilt reports are immediately useful; builders are more capable and take time to learn.",
        icon: "settings",
      },
      {
        id: "bi",
        title: "In-CRM reporting vs BI tooling",
        description:
          "Native reporting is convenient; a warehouse handles cross-system analysis better.",
        icon: "database",
      },
      PLAN_TRADEOFF,
    ],
    vendorQuestions: [
      "Can a manager build a report without an administrator?",
      "Which objects and fields can reports use?",
      "How many dashboards and reports does our plan allow?",
      "Can reports be scheduled or shared externally?",
      "How much history is retained and reportable?",
      "Which reporting features require an upgrade?",
    ],
    faq: [
      {
        question: "What should CRM reporting dashboards cover?",
        answer:
          "Pipeline by stage, conversion between stages, activity, and any custom field your reviews depend on — plus dashboards for each role.",
      },
      {
        question: "How is reporting different from analytics?",
        answer:
          "Reporting answers defined questions about current data. Analytics usually implies deeper exploration, trends, and derived metrics.",
      },
      {
        question: "Do we need a BI tool as well?",
        answer:
          "Only once you need CRM data joined to other systems or history beyond what the CRM retains.",
      },
    ],
    screenshotMatchTerms: ["report", "dashboard", "chart", "analytics", "filter"],
  },
  {
    slug: "lead-scoring",
    canonicalFeatureSlug: "lead-scoring",
    name: "Lead Scoring",
    featureType: "tiered",
    featureTypeLabel: "Prioritization (often plan-tiered)",
    definition:
      "Lead scoring ranks enquiries or contacts by fit and engagement so teams work the highest-priority leads first, using rules, behavioural signals, or a combination of both.",
    notTheSameAs: [
      "Lead management, which captures and assigns enquiries",
      "Predictive forecasting of revenue",
      "Marketing automation scoring alone",
      "A manual priority field with no model behind it",
    ],
    supportsBullets: [
      "Score based on demographic or firmographic fit",
      "Engagement or activity signals",
      "Thresholds that route or alert owners",
      "Score visible on the lead or contact record",
      "Recalculation as behaviour changes",
    ],
    typicalBuyerNeed:
      "Volume is high enough that working every lead in arrival order wastes effort",
    commonLimitation:
      "Scoring models and signal depth vary widely, and many products gate scoring to higher plans",
    primaryCapabilitySlug: "lead-management",
    primaryCapabilityName: "Lead management",
    extraDimensions: [
      {
        id: "lead-records",
        name: "Lead records",
        valueType: "support-status",
        source: "related-feature",
        relatedFeatureSlug: "lead-management",
        importance: "high",
      },
      {
        id: "routing",
        name: "Assignment or routing from score",
        valueType: "support-status",
        source: "related-feature",
        relatedFeatureSlug: "sales-automation",
        importance: "high",
      },
      {
        id: "custom-attributes",
        name: "Custom score inputs",
        valueType: "support-status",
        source: "related-feature",
        relatedFeatureSlug: "custom-fields",
        importance: "important",
      },
    ],
    needGuidance: {
      needIf: [
        "Inbound volume exceeds what the team can work evenly",
        "Some leads convert far more often than others",
        "You need a shared definition of what 'hot' means",
      ],
      mayNotNeedIf: [
        "Every enquiry is handled personally and promptly",
        "You lack the data hygiene needed for a reliable score",
      ],
    },
    requirementMappings: [
      {
        id: "automate-follow-up",
        name: "Automate lead follow-up",
        description: "Scores can prioritize or trigger follow-up, not replace it.",
        supportLevel: "partial",
        requirementSlug: "automate-lead-follow-up",
      },
      {
        id: "track-interactions",
        name: "Track client interactions",
        description: "Engagement signals usually depend on interaction history.",
        supportLevel: "depends",
        requirementSlug: "track-client-interactions",
      },
    ],
    relatedFeatureSlugs: [
      "lead-management",
      "sales-automation",
      "custom-fields",
      "email-tracking",
    ],
    relatedCapabilitySlugs: ["lead-management", "workflow-automation"],
    tradeoffs: [
      {
        id: "complexity",
        title: "Model sophistication vs maintainability",
        description:
          "Richer scoring is more precise and harder to keep accurate as your process changes.",
        icon: "settings",
      },
      {
        id: "trust",
        title: "Automation vs sales judgement",
        description:
          "Blindly following scores can deprioritize good deals the model does not understand.",
        icon: "users",
      },
      PLAN_TRADEOFF,
    ],
    vendorQuestions: [
      "Is scoring rule-based, predictive, or both?",
      "Which signals can contribute to the score?",
      "Can scores trigger assignment or automation?",
      "How often do scores recalculate?",
      "Can we edit or override the model without a vendor?",
      "Which plan includes lead scoring?",
    ],
    faq: [
      {
        question: "What is lead scoring in a CRM?",
        answer:
          "It is a ranking of leads or contacts by fit and engagement so the team can prioritize who to work next.",
      },
      {
        question: "How is lead scoring different from lead management?",
        answer:
          "Lead management is the capture, ownership, and conversion process. Lead scoring is an optional prioritization layer on top of those records.",
      },
      {
        question: "Do we need lead scoring?",
        answer:
          "It helps when volume outpaces capacity and you have consistent signals of fit. Without data discipline, scores become noise.",
      },
    ],
    screenshotMatchTerms: ["score", "lead", "priority", "hot", "ranking"],
  },
  {
    slug: "custom-pipeline-stages",
    canonicalFeatureSlug: "custom-pipelines",
    name: "Custom Pipeline Stages",
    featureType: "configurable",
    featureTypeLabel: "Configuration",
    definition:
      "Custom pipeline stages are the ability to design the stage model inside a sales pipeline — names, order, and exit criteria — so the board matches how your team actually advances opportunities.",
    notTheSameAs: [
      "Multiple pipelines, which means running more than one distinct pipeline",
      "Deal management fields alone",
      "Workflow automation on stage change",
      "Forecast categories",
    ],
    supportsBullets: [
      "Add, rename, reorder, or remove stages",
      "Stage order that matches your sales process",
      "Probability or forecast weighting per stage where supported",
      "Required fields or exit criteria by stage where supported",
      "Stage history retained on the deal",
    ],
    typicalBuyerNeed:
      "The default stages do not describe how opportunities actually progress",
    commonLimitation:
      "How freely stages can be edited, and whether probability is editable, differs by product and plan",
    primaryCapabilitySlug: "pipeline-management",
    primaryCapabilityName: "Pipeline management",
    extraDimensions: [
      {
        id: "pipeline-core",
        name: "Pipeline management",
        valueType: "support-status",
        source: "related-feature",
        relatedFeatureSlug: "pipeline-management",
        importance: "high",
      },
      {
        id: "multiple-pipelines",
        name: "Multiple pipelines",
        valueType: "support-status",
        source: "related-feature",
        relatedFeatureSlug: "custom-pipelines",
        importance: "important",
      },
      {
        id: "stage-automation",
        name: "Automation on stage change",
        valueType: "support-status",
        source: "related-feature",
        relatedFeatureSlug: "workflow-automation",
        importance: "important",
      },
    ],
    needGuidance: {
      needIf: [
        "Your process has named steps the defaults do not cover",
        "Stage names need to match how the team talks about deals",
        "Forecast or reporting depends on your stage definitions",
      ],
      mayNotNeedIf: [
        "A simple default stage model already fits",
        "Nobody would maintain a custom stage design",
      ],
    },
    requirementMappings: [
      {
        id: "separate-processes",
        name: "Support separate sales processes",
        description:
          "Stage design shapes one process; multiple pipelines address separate processes.",
        supportLevel: "partial",
        requirementSlug: "separate-sales-processes",
      },
      {
        id: "forecast",
        name: "Forecast revenue",
        description: "Stage definitions often feed probability and forecast views.",
        supportLevel: "partial",
        requirementSlug: "forecast-revenue",
      },
    ],
    relatedFeatureSlugs: [
      "pipeline-management",
      "deal-management",
      "custom-pipelines",
      "workflow-automation",
    ],
    relatedCapabilitySlugs: ["pipeline-management", "reporting"],
    tradeoffs: [
      {
        id: "stages",
        title: "Process fidelity vs board clarity",
        description:
          "More stages describe the process better and make the board harder to keep accurate.",
        icon: "funnel",
      },
      {
        id: "change",
        title: "Flexibility vs historical consistency",
        description:
          "Renaming or removing stages can muddy historical reporting unless the product preserves history carefully.",
        icon: "clock",
      },
      PLAN_TRADEOFF,
    ],
    vendorQuestions: [
      "Can we add, rename, reorder, and remove stages without vendor help?",
      "Can probability be set per stage?",
      "Can required fields differ by stage?",
      "Is stage movement history retained and reportable?",
      "What happens to open deals if we remove a stage?",
      "Does stage customization require a higher plan?",
    ],
    faq: [
      {
        question: "What are custom pipeline stages?",
        answer:
          "They are the configurable steps inside a pipeline — the stage names, order, and rules that describe how deals move from enquiry to close.",
      },
      {
        question: "How is this different from multiple pipelines?",
        answer:
          "Custom stages design the model inside one pipeline. Multiple pipelines means running more than one distinct pipeline alongside each other.",
      },
      {
        question: "How many stages should we create?",
        answer:
          "As many as have a clear exit criterion. Stages nobody can define tend to collect deals rather than move them.",
      },
    ],
    screenshotMatchTerms: ["stage", "pipeline", "customize", "board", "kanban"],
  },
  {
    slug: "api-access",
    canonicalFeatureSlug: "api-access",
    name: "API Access",
    featureType: "integration",
    featureTypeLabel: "Platform / developer access",
    definition:
      "API access is the ability for other systems to read and write CRM data programmatically — typically via REST APIs, webhooks, and developer credentials — so custom integrations and exports are possible beyond the native connector directory.",
    notTheSameAs: [
      "A native integration marketplace listing",
      "One-off CSV import or export",
      "Zapier or middleware alone, without a CRM API",
      "Admin UI configuration",
    ],
    supportsBullets: [
      "REST or equivalent API for records and activities",
      "Authentication for applications or integrations",
      "Webhooks for create, update, or delete events",
      "Rate limits and usage documentation",
      "Export paths for audit or warehouse use where supported",
    ],
    typicalBuyerNeed:
      "The CRM must connect to systems that have no adequate native connector",
    commonLimitation:
      "API access, webhook support, and rate limits are frequently plan-restricted",
    primaryCapabilitySlug: "integrations",
    primaryCapabilityName: "Integrations",
    extraDimensions: [
      {
        id: "native-integrations",
        name: "Native connectors",
        valueType: "support-status",
        source: "related-feature",
        relatedFeatureSlug: "integrations",
        importance: "high",
      },
      {
        id: "audit-export",
        name: "Audit log export",
        valueType: "support-status",
        source: "related-feature",
        relatedFeatureSlug: "audit-logs",
        importance: "important",
      },
      {
        id: "api-limits",
        name: "Rate or call limits",
        valueType: "limit",
        source: "notes-limit",
        importance: "high",
      },
    ],
    needGuidance: {
      needIf: [
        "You need custom sync with internal systems",
        "Native connectors do not cover a critical tool",
        "You want event-driven updates via webhooks",
        "Compliance or analytics requires programmatic export",
      ],
      mayNotNeedIf: [
        "Native integrations already cover your stack",
        "Nobody will build or maintain a custom integration",
      ],
    },
    requirementMappings: [
      {
        id: "manage-integrations",
        name: "Manage integrations",
        description: "API access is how custom integrations are usually built.",
        supportLevel: "direct",
        requirementSlug: "manage-integrations",
      },
      {
        id: "audit-activity",
        name: "Audit user activity",
        description: "APIs can export logs where the product exposes them.",
        supportLevel: "depends",
        requirementSlug: "audit-user-activity",
      },
    ],
    relatedFeatureSlugs: [
      "integrations",
      "audit-logs",
      "workflow-automation",
      "custom-fields",
    ],
    relatedCapabilitySlugs: ["integrations", "security-administration"],
    tradeoffs: [
      {
        id: "ownership",
        title: "Flexibility vs maintenance",
        description:
          "Custom API integrations fit precisely and become your team's responsibility to keep working.",
        icon: "code",
      },
      {
        id: "limits",
        title: "Capability vs rate limits",
        description:
          "Plan rate limits often bind before the documented endpoint list does.",
        icon: "chart",
      },
      PLAN_TRADEOFF,
    ],
    vendorQuestions: [
      "Is API access included on our plan?",
      "Which objects and actions are available via the API?",
      "Are webhooks available, and for which events?",
      "What are the rate limits and how is usage metered?",
      "Is there sandbox or non-production API access?",
      "Can audit logs or exports be pulled programmatically?",
    ],
    faq: [
      {
        question: "What does CRM API access include?",
        answer:
          "Usually authenticated endpoints to create, read, update, and delete records, plus documentation and often webhooks for change events.",
      },
      {
        question: "Is an API the same as a native integration?",
        answer:
          "No. Native connectors are prebuilt links to common tools. An API lets you build connections the vendor did not ship.",
      },
      {
        question: "Do we need API access?",
        answer:
          "Only if you will build or buy a custom connection. If native connectors cover your stack, API access is optional insurance rather than a day-one requirement.",
      },
    ],
    screenshotMatchTerms: ["api", "webhook", "developer", "token", "rest"],
  },
  {
    slug: "forecasting",
    name: "Forecasting",
    featureType: "tiered",
    featureTypeLabel: "Reporting (plan-tiered)",
    definition:
      "CRM forecasting projects expected revenue from pipeline data, using stage probability, close dates, weighted values, or manual commitments from deal owners.",
    notTheSameAs: [
      "Reporting on current pipeline value",
      "Financial budgeting software",
      "Quota tracking alone",
      "Predictive lead scoring",
    ],
    supportsBullets: [
      "Weighted pipeline projections",
      "Period-based forecast views",
      "Forecast categories or commit levels",
      "Forecast versus quota comparison",
      "Forecast accuracy tracking where available",
    ],
    typicalBuyerNeed:
      "Leadership needs a forward revenue view they can plan resources against",
    commonLimitation:
      "Forecasting is often an upper-tier feature, and accuracy depends entirely on data hygiene",
    primaryCapabilitySlug: "reporting",
    primaryCapabilityName: "Reporting and forecasting",
    extraDimensions: [
      {
        id: "pipeline-input",
        name: "Pipeline data quality inputs",
        valueType: "support-status",
        source: "related-feature",
        relatedFeatureSlug: "pipeline-management",
        importance: "high",
      },
      {
        id: "deal-values",
        name: "Deal values and close dates",
        valueType: "support-status",
        source: "related-feature",
        relatedFeatureSlug: "deal-management",
        importance: "high",
      },
      {
        id: "reporting-link",
        name: "Custom reporting",
        valueType: "support-status",
        source: "related-feature",
        relatedFeatureSlug: "reporting",
        importance: "important",
      },
    ],
    needGuidance: {
      needIf: [
        "Hiring or capacity decisions depend on expected revenue",
        "Leadership commits to numbers each period",
        "Pipeline is large enough that intuition is unreliable",
      ],
      mayNotNeedIf: [
        "Close dates are guesses nobody maintains",
        "Your sales cycle is short enough that current pipeline is the forecast",
      ],
    },
    requirementMappings: [
      {
        id: "forecast",
        name: "Forecast revenue",
        description: "Directly satisfies the requirement.",
        supportLevel: "direct",
        requirementSlug: "forecast-revenue",
      },
      {
        id: "separate-processes",
        name: "Support separate sales processes",
        description:
          "Whether forecasts can span multiple pipelines depends on implementation.",
        supportLevel: "depends",
        requirementSlug: "separate-sales-processes",
      },
    ],
    relatedFeatureSlugs: [
      "reporting-dashboards",
      "pipeline-management",
      "deal-management",
      "analytics",
    ],
    relatedCapabilitySlugs: ["reporting", "pipeline-management"],
    tradeoffs: [
      {
        id: "method",
        title: "Weighted automation vs manual commit",
        description:
          "Automatic weighting is consistent; manual commits capture judgement but invite optimism.",
        icon: "chart",
      },
      {
        id: "hygiene",
        title: "Forecast quality vs data discipline",
        description:
          "A forecast is only as good as the close dates and values behind it.",
        icon: "check",
      },
      PLAN_TRADEOFF,
    ],
    vendorQuestions: [
      "How is the forecast calculated?",
      "Can probability be set per stage?",
      "Can owners submit a manual commit alongside the calculated number?",
      "Can forecasts span multiple pipelines or teams?",
      "Is forecast accuracy tracked over time?",
      "Which plan includes forecasting?",
    ],
    faq: [
      {
        question: "How does CRM forecasting work?",
        answer:
          "Most products weight open deals by stage probability and expected close date, sometimes combined with a manual commitment from the owner.",
      },
      {
        question: "Why are CRM forecasts often wrong?",
        answer:
          "Because they inherit the data. Unmaintained close dates and optimistic values produce confident but unreliable projections.",
      },
      {
        question: "Is forecasting worth an upgrade?",
        answer:
          "Only if your pipeline data is disciplined enough to forecast from. Fix hygiene first, then pay for the projection.",
      },
    ],
    screenshotMatchTerms: ["forecast", "quota", "projection", "revenue", "period"],
  },
  {
    slug: "analytics",
    name: "Analytics",
    featureType: "tiered",
    featureTypeLabel: "Reporting / analysis",
    definition:
      "CRM analytics goes beyond standard reports to explore trends, conversion patterns, activity correlation, and derived metrics across the CRM dataset.",
    notTheSameAs: [
      "Standard reports and dashboards",
      "Forecasting",
      "A dedicated BI or warehouse platform",
      "Website or product analytics",
    ],
    supportsBullets: [
      "Trend analysis over time",
      "Conversion and funnel analysis",
      "Activity-to-outcome correlation",
      "Custom calculated metrics",
      "Cohort or segment comparison where supported",
    ],
    typicalBuyerNeed:
      "Someone needs to explain why the numbers moved, not just report that they did",
    commonLimitation:
      "Advanced analytics is usually a top-tier or add-on capability with its own learning curve",
    primaryCapabilitySlug: "reporting",
    primaryCapabilityName: "Reporting and forecasting",
    extraDimensions: [
      {
        id: "reporting-base",
        name: "Underlying reporting",
        valueType: "support-status",
        source: "related-feature",
        relatedFeatureSlug: "reporting",
        importance: "high",
      },
      {
        id: "history",
        name: "Historical data retention",
        valueType: "limit",
        source: "notes-limit",
        importance: "important",
      },
      {
        id: "export",
        name: "Data export for external analysis",
        valueType: "support-status",
        source: "related-feature",
        relatedFeatureSlug: "integrations",
        importance: "important",
      },
    ],
    needGuidance: {
      needIf: [
        "You need to understand why conversion is changing",
        "Someone owns analysis as part of their role",
        "Standard reports keep prompting follow-up questions",
      ],
      mayNotNeedIf: [
        "Standard reports answer your current questions",
        "Nobody has time to explore data regularly",
      ],
    },
    requirementMappings: [
      {
        id: "forecast",
        name: "Forecast revenue",
        description: "Supports better inputs rather than producing the forecast.",
        supportLevel: "indirect",
        requirementSlug: "forecast-revenue",
      },
    ],
    relatedFeatureSlugs: ["reporting-dashboards", "forecasting", "integrations"],
    relatedCapabilitySlugs: ["reporting", "integrations"],
    tradeoffs: [
      {
        id: "depth",
        title: "Analytical depth vs usability",
        description:
          "Deeper analysis tools need skill; simpler dashboards get used more often.",
        icon: "settings",
      },
      {
        id: "warehouse",
        title: "CRM analytics vs a warehouse",
        description:
          "CRM analytics only sees CRM data; cross-system questions need export.",
        icon: "database",
      },
      PLAN_TRADEOFF,
    ],
    vendorQuestions: [
      "What analysis is possible beyond standard reports?",
      "How much history is retained for trend analysis?",
      "Can we define calculated metrics?",
      "Is analytics included, an upper tier, or an add-on?",
      "Can data be exported for external analysis?",
    ],
    faq: [
      {
        question: "What is CRM analytics?",
        answer:
          "It is deeper analysis of CRM data — trends, funnels, correlations, and derived metrics — beyond the standard report set.",
      },
      {
        question: "How is analytics different from reporting?",
        answer:
          "Reporting answers known questions repeatedly. Analytics is for exploring why something changed.",
      },
      {
        question: "Do we need CRM analytics or a BI tool?",
        answer:
          "CRM analytics is enough while the questions stay inside CRM data. Cross-system analysis needs export into a warehouse or BI platform.",
      },
    ],
    screenshotMatchTerms: ["analytics", "trend", "funnel", "insight", "chart"],
  },
  {
    slug: "integrations",
    name: "Integrations",
    featureType: "integration",
    featureTypeLabel: "Platform / integration",
    definition:
      "CRM integrations are the supported connections between the CRM and other systems — email, calendar, accounting, marketing, support, telephony — plus the API and webhooks that allow custom connections.",
    notTheSameAs: [
      "A one-off CSV import",
      "Email sync alone",
      "An integration listed in a directory but no longer maintained",
      "Middleware you would have to buy separately",
    ],
    supportsBullets: [
      "Native connectors for common tools",
      "Two-way data sync where supported",
      "API access for custom connections",
      "Webhooks for record events",
      "Middleware compatibility",
    ],
    typicalBuyerNeed:
      "The CRM must reflect what happens in other systems without manual re-entry",
    commonLimitation:
      "Directory size says little about depth, and API access is often plan-restricted",
    primaryCapabilitySlug: "integrations",
    primaryCapabilityName: "Integrations",
    extraDimensions: [
      {
        id: "email-integration",
        name: "Email and calendar",
        valueType: "support-status",
        source: "related-feature",
        relatedFeatureSlug: "email-sync",
        importance: "critical",
      },
      {
        id: "api",
        name: "API access",
        valueType: "support-status",
        source: "related-feature",
        relatedFeatureSlug: "api-access",
        importance: "high",
      },
      {
        id: "automation-actions",
        name: "Automation across systems",
        valueType: "support-status",
        source: "related-feature",
        relatedFeatureSlug: "workflow-automation",
        importance: "important",
      },
      {
        id: "integration-notes",
        name: "Integration limits",
        valueType: "limit",
        source: "notes-limit",
        importance: "important",
      },
    ],
    needGuidance: {
      needIf: [
        "Customer data lives in more than one system",
        "The team works primarily inside email or another tool",
        "Manual reconciliation is consuming time",
      ],
      mayNotNeedIf: [
        "The CRM would be your only customer system",
        "Volumes are low enough that occasional manual entry is fine",
      ],
    },
    requirementMappings: [
      {
        id: "manage-integrations",
        name: "Manage integrations",
        description: "Directly satisfies the requirement.",
        supportLevel: "direct",
        requirementSlug: "manage-integrations",
      },
      {
        id: "integrate-email",
        name: "Integrate with email",
        description: "Email integration is usually the first case that matters.",
        supportLevel: "partial",
        requirementSlug: "integrate-with-email",
      },
    ],
    relatedFeatureSlugs: [
      "email-sync",
      "api-access",
      "workflow-automation",
      "calling",
    ],
    relatedCapabilitySlugs: [
      "integrations",
      "workflow-automation",
      "security-administration",
    ],
    tradeoffs: [
      {
        id: "breadth",
        title: "Directory breadth vs integration depth",
        description:
          "A long integration list matters less than depth in the two or three you need.",
        icon: "puzzle",
      },
      {
        id: "ownership",
        title: "Native connectors vs custom builds",
        description:
          "Custom integrations fit precisely and become your maintenance responsibility.",
        icon: "code",
      },
      PLAN_TRADEOFF,
    ],
    vendorQuestions: [
      "Which of our tools have native integrations?",
      "Who maintains each integration?",
      "Is sync one-way or two-way, and which system wins conflicts?",
      "Is API access included, and what are the rate limits?",
      "Are webhooks available?",
      "How are integration failures surfaced?",
    ],
    faq: [
      {
        question: "How should we evaluate CRM integrations?",
        answer:
          "Start from your own stack. Check that the specific integrations you need exist, are maintained, and sync the fields and direction you require.",
      },
      {
        question: "Is a bigger integration directory better?",
        answer:
          "Not necessarily. Depth and maintenance matter more than count — a shallow connector still leaves manual work.",
      },
      {
        question: "Do integrations cost extra?",
        answer:
          "Sometimes. API access, premium connectors, and middleware may sit on higher plans or carry separate fees.",
      },
    ],
    screenshotMatchTerms: [
      "integration",
      "marketplace",
      "connect",
      "app",
      "api",
    ],
  },
  {
    slug: "mobile-app",
    name: "Mobile App",
    featureType: "boolean",
    featureTypeLabel: "Access / client app",
    definition:
      "A CRM mobile app provides access to records, activities, and updates from a phone or tablet, usually with a reduced feature set compared to the web application.",
    notTheSameAs: [
      "A responsive website in a mobile browser",
      "Full feature parity with the desktop app",
      "Offline access, which is a separate capability",
      "A separate field-service application",
    ],
    supportsBullets: [
      "View contacts, deals, and activities",
      "Log calls, notes, and meetings",
      "Update records between meetings",
      "Notifications and reminders",
      "Offline access where supported",
    ],
    typicalBuyerNeed:
      "Client-facing staff need to read and update records away from a desk",
    commonLimitation:
      "Mobile apps rarely support administration, reporting, or automation configuration",
    primaryCapabilitySlug: "contact-management",
    primaryCapabilityName: "Contact management",
    extraDimensions: [
      {
        id: "record-access",
        name: "Record access",
        valueType: "support-status",
        source: "related-feature",
        relatedFeatureSlug: "contact-management",
        importance: "high",
      },
      {
        id: "call-logging",
        name: "Call logging",
        valueType: "support-status",
        source: "related-feature",
        relatedFeatureSlug: "call-functionality",
        importance: "important",
      },
      {
        id: "offline-notes",
        name: "Offline capability",
        valueType: "text",
        source: "notes-limit",
        importance: "important",
      },
    ],
    needGuidance: {
      needIf: [
        "Staff meet clients away from the office",
        "Notes are captured between meetings",
        "Reps need pipeline visibility while travelling",
      ],
      mayNotNeedIf: [
        "The team works entirely at desks",
        "Updates happen in batches at the end of the day",
      ],
    },
    requirementMappings: [
      {
        id: "track-interactions",
        name: "Track client interactions",
        description: "Enables capture at the point of interaction.",
        supportLevel: "partial",
        requirementSlug: "track-client-interactions",
      },
    ],
    relatedFeatureSlugs: [
      "contact-management",
      "pipeline-management",
      "calling",
    ],
    relatedCapabilitySlugs: ["contact-management", "pipeline-management"],
    tradeoffs: [
      {
        id: "parity",
        title: "Convenience vs feature parity",
        description:
          "Mobile apps prioritize quick capture, so configuration and reporting usually stay on the web.",
        icon: "settings",
      },
      {
        id: "offline",
        title: "Connectivity assumptions",
        description:
          "Apps that require connectivity fail exactly where field staff need them.",
        icon: "shield",
      },
      IMPLEMENTATION_TRADEOFF,
    ],
    vendorQuestions: [
      "Which functions are available on mobile?",
      "Is there offline access, and how does sync resolve conflicts?",
      "Are iOS and Android both supported?",
      "Can calls and notes be logged from the app?",
      "Does mobile access require a specific plan?",
    ],
    faq: [
      {
        question: "What can you do in a CRM mobile app?",
        answer:
          "Typically view and update records, log activities, and receive notifications. Administration and reporting usually remain web-only.",
      },
      {
        question: "Do mobile apps work offline?",
        answer:
          "Some do, partially. Offline behaviour varies significantly, so test it if field staff work without reliable connectivity.",
      },
      {
        question: "Is a mobile app essential?",
        answer:
          "It matters most when relationships are managed away from a desk. Desk-based teams often get more from browser access.",
      },
    ],
    screenshotMatchTerms: ["mobile", "app", "phone", "ios", "android"],
  },
  {
    slug: "ai-assistance",
    name: "AI Assistance",
    featureType: "tiered",
    featureTypeLabel: "AI (plan-tiered or add-on)",
    definition:
      "AI assistance in a CRM covers generated content, summaries of records or calls, suggested next actions, and data-entry support — features that propose output a person reviews.",
    notTheSameAs: [
      "Rule-based workflow automation",
      "Traditional lead scoring models",
      "An autonomous agent acting without review",
      "Analytics dashboards",
    ],
    supportsBullets: [
      "Email and message drafting",
      "Record or thread summaries",
      "Call or meeting summaries where supported",
      "Suggested next actions",
      "Data entry and enrichment assistance",
    ],
    typicalBuyerNeed:
      "Administrative writing and summarizing is consuming time that could go to selling",
    commonLimitation:
      "AI features are frequently add-ons with usage credits, and output always needs review",
    primaryCapabilitySlug: "workflow-automation",
    primaryCapabilityName: "Workflow automation",
    extraDimensions: [
      {
        id: "automation-link",
        name: "Automation integration",
        valueType: "support-status",
        source: "related-feature",
        relatedFeatureSlug: "workflow-automation",
        importance: "important",
      },
      {
        id: "usage-limits",
        name: "Usage credits or limits",
        valueType: "limit",
        source: "notes-limit",
        importance: "high",
      },
      {
        id: "data-handling",
        name: "Data handling notes",
        valueType: "text",
        source: "notes-limit",
        importance: "high",
      },
    ],
    needGuidance: {
      needIf: [
        "Reps spend significant time drafting routine messages",
        "Long records or threads need summarizing before calls",
        "Data entry is being skipped because it is slow",
      ],
      mayNotNeedIf: [
        "Your communication requires specialist accuracy or approval",
        "Data handling constraints rule out sending records to a model",
        "Core CRM adoption is not yet established",
      ],
    },
    requirementMappings: [
      {
        id: "automate-follow-up",
        name: "Automate lead follow-up",
        description:
          "Can help draft follow-up, but the automation itself comes from workflow rules.",
        supportLevel: "indirect",
        requirementSlug: "automate-lead-follow-up",
      },
      {
        id: "track-interactions",
        name: "Track client interactions",
        description: "Summaries can improve what gets recorded.",
        supportLevel: "indirect",
        requirementSlug: "track-client-interactions",
      },
    ],
    relatedFeatureSlugs: [
      "workflow-automation",
      "email-sequences",
      "contact-management",
      "analytics",
    ],
    relatedCapabilitySlugs: [
      "workflow-automation",
      "contact-management",
      "security-administration",
    ],
    tradeoffs: [
      {
        id: "review",
        title: "Speed vs review burden",
        description:
          "Generated output saves drafting time and still needs checking before it is sent.",
        icon: "check",
      },
      {
        id: "cost",
        title: "Capability vs usage cost",
        description:
          "Credit-based pricing makes cost depend on usage rather than headcount.",
        icon: "chart",
      },
      {
        id: "data",
        title: "Convenience vs data handling",
        description:
          "Confirm how record data is processed and retained before enabling AI features.",
        icon: "shield",
      },
    ],
    vendorQuestions: [
      "Which AI features are included, and which are add-ons?",
      "How is usage metered or credited?",
      "How is our data processed, retained, and used for training?",
      "Can AI features be disabled per user or per team?",
      "What review controls exist before generated content is sent?",
    ],
    faq: [
      {
        question: "What does AI assistance do in a CRM?",
        answer:
          "It drafts content, summarizes records or conversations, and suggests next actions — proposals a person reviews rather than actions taken independently.",
      },
      {
        question: "How is AI assistance different from automation?",
        answer:
          "Automation executes rules you define deterministically. AI assistance generates suggestions that vary and need review.",
      },
      {
        question: "Does AI assistance cost extra?",
        answer:
          "Often. It is commonly an add-on or credit-based, so cost scales with usage. Confirm metering and data handling before adopting it.",
      },
    ],
    screenshotMatchTerms: ["ai", "assistant", "summary", "generate", "copilot"],
  },
  {
    slug: "role-permissions",
    name: "Role Permissions",
    featureType: "tiered",
    featureTypeLabel: "Administration (plan-tiered)",
    definition:
      "Role permissions control what each user can view, create, edit, delete, and export in the CRM, usually through roles, teams, or a record-ownership hierarchy.",
    notTheSameAs: [
      "Single sign-on, which handles authentication",
      "Audit logs, which record what happened",
      "Simply having admin and non-admin users",
      "Field-level encryption",
    ],
    supportsBullets: [
      "Role-based access to objects and actions",
      "Record-level visibility rules",
      "Field-level restrictions where supported",
      "Team or territory scoping",
      "Export and delete restrictions",
    ],
    typicalBuyerNeed:
      "Not everyone should see or be able to export every record",
    commonLimitation:
      "Granular permissions are commonly reserved for higher plans",
    primaryCapabilitySlug: "security-administration",
    primaryCapabilityName: "Security and administration",
    extraDimensions: [
      {
        id: "sso-link",
        name: "Single sign-on",
        valueType: "support-status",
        source: "related-feature",
        relatedFeatureSlug: "sso",
        importance: "important",
      },
      {
        id: "audit-link",
        name: "Audit logging",
        valueType: "support-status",
        source: "related-feature",
        relatedFeatureSlug: "audit-logs",
        importance: "important",
      },
      {
        id: "field-config",
        name: "Field configuration control",
        valueType: "support-status",
        source: "related-feature",
        relatedFeatureSlug: "custom-fields",
        importance: "important",
      },
    ],
    needGuidance: {
      needIf: [
        "Teams should only see their own records",
        "Some data is sensitive within the organization",
        "Export needs to be restricted",
        "Different roles need different edit rights",
      ],
      mayNotNeedIf: [
        "Everyone in a small team legitimately needs full access",
        "There is no sensitive segmentation in your data",
      ],
    },
    requirementMappings: [
      {
        id: "restrict-access",
        name: "Restrict access by team",
        description: "Directly satisfies the requirement.",
        supportLevel: "direct",
        requirementSlug: "restrict-access-by-team",
      },
      {
        id: "audit-activity",
        name: "Audit user activity",
        description: "Permissions limit exposure; logs record what occurred.",
        supportLevel: "partial",
        requirementSlug: "audit-user-activity",
      },
    ],
    relatedFeatureSlugs: ["sso", "audit-logs", "custom-fields", "integrations"],
    relatedCapabilitySlugs: ["security-administration", "contact-management"],
    tradeoffs: [
      {
        id: "granularity",
        title: "Granularity vs maintainability",
        description:
          "Fine-grained rules are precise and quickly become hard to reason about.",
        icon: "settings",
      },
      {
        id: "collaboration",
        title: "Restriction vs collaboration",
        description:
          "Tight visibility protects data and can slow down internal handovers.",
        icon: "users",
      },
      PLAN_TRADEOFF,
    ],
    vendorQuestions: [
      "How is the permission model structured?",
      "Can visibility be restricted at record and field level?",
      "Can export be limited to specific roles?",
      "How many custom roles are supported?",
      "Can permissions follow a team or territory hierarchy?",
      "Which permission features require a higher plan?",
    ],
    faq: [
      {
        question: "What do CRM role permissions control?",
        answer:
          "Which users can view, create, edit, delete, and export which records — and, in some products, which fields they can see.",
      },
      {
        question: "How is this different from single sign-on?",
        answer:
          "Single sign-on decides how someone authenticates. Role permissions decide what they can do once inside.",
      },
      {
        question: "Are permissions available on lower plans?",
        answer:
          "Basic roles usually are; record and field-level control is often higher-tier. Verify against your specific requirement.",
      },
    ],
    screenshotMatchTerms: ["permission", "role", "user", "team", "access"],
  },
  {
    slug: "sso",
    name: "Single Sign-On",
    featureType: "boolean",
    featureTypeLabel: "Identity (usually a higher plan)",
    definition:
      "Single sign-on lets users authenticate to the CRM through your identity provider, so access is granted and revoked centrally rather than through separate CRM credentials.",
    notTheSameAs: [
      "Two-factor authentication",
      "Social login with a personal account",
      "Automated user provisioning, which is often separate",
      "Role permissions",
    ],
    supportsBullets: [
      "Authentication through your identity provider",
      "Centralized access revocation",
      "Enforced identity policy",
      "SAML or OIDC support",
      "Directory provisioning where supported",
    ],
    typicalBuyerNeed:
      "Access must be centrally managed so offboarding is reliable",
    commonLimitation:
      "Frequently restricted to enterprise plans, sometimes at significant cost",
    primaryCapabilitySlug: "security-administration",
    primaryCapabilityName: "Security and administration",
    extraDimensions: [
      {
        id: "permissions-link",
        name: "Role permissions",
        valueType: "support-status",
        source: "related-feature",
        relatedFeatureSlug: "role-permissions",
        importance: "important",
      },
      {
        id: "audit-link",
        name: "Audit logging",
        valueType: "support-status",
        source: "related-feature",
        relatedFeatureSlug: "audit-logs",
        importance: "important",
      },
      {
        id: "provider-notes",
        name: "Supported identity providers",
        valueType: "text",
        source: "notes-limit",
        importance: "high",
      },
    ],
    needGuidance: {
      needIf: [
        "You already run an identity provider",
        "Offboarding must remove access everywhere at once",
        "Password policy is centrally mandated",
      ],
      mayNotNeedIf: [
        "You have very few users and no identity provider",
        "The plan cost outweighs the administration it saves",
      ],
    },
    requirementMappings: [
      {
        id: "support-sso",
        name: "Support single sign-on",
        description: "Directly satisfies the requirement.",
        supportLevel: "direct",
        requirementSlug: "support-sso",
      },
      {
        id: "restrict-access",
        name: "Restrict access by team",
        description:
          "Controls authentication, not in-app visibility — permissions do that.",
        supportLevel: "indirect",
        requirementSlug: "restrict-access-by-team",
      },
    ],
    relatedFeatureSlugs: ["role-permissions", "audit-logs", "integrations"],
    relatedCapabilitySlugs: ["security-administration", "integrations"],
    tradeoffs: [
      {
        id: "cost",
        title: "Central control vs plan cost",
        description:
          "Single sign-on is often gated to the highest tier, which can be a large step up.",
        icon: "chart",
      },
      {
        id: "provisioning",
        title: "Authentication vs provisioning",
        description:
          "Sign-on alone does not create or remove accounts unless directory provisioning is also supported.",
        icon: "users",
      },
      IMPLEMENTATION_TRADEOFF,
    ],
    vendorQuestions: [
      "Which identity providers and protocols are supported?",
      "Is directory provisioning or SCIM available?",
      "Can single sign-on be enforced for all users?",
      "What happens to existing passwords once it is enabled?",
      "Which plan includes it, and at what cost?",
    ],
    faq: [
      {
        question: "What is single sign-on for a CRM?",
        answer:
          "It lets users sign in through your identity provider so access is centrally granted, enforced, and revoked.",
      },
      {
        question: "Is single sign-on the same as user provisioning?",
        answer:
          "No. Sign-on handles authentication; provisioning creates and deactivates accounts. Some products support both, some only the first.",
      },
      {
        question: "Do we need single sign-on?",
        answer:
          "It becomes valuable once you run an identity provider and have enough users that manual account management is a real risk.",
      },
    ],
    screenshotMatchTerms: ["sso", "saml", "login", "identity", "authentication"],
  },
  {
    slug: "audit-logs",
    name: "Audit Logs",
    featureType: "tiered",
    featureTypeLabel: "Administration / accountability",
    definition:
      "Audit logs record what happened in the CRM — who signed in, who changed or deleted a record, and who exported data — so access and changes can be reviewed after the fact.",
    notTheSameAs: [
      "Activity history on a record, which is user-facing",
      "Reporting on sales activity",
      "Role permissions, which prevent actions",
      "Backups",
    ],
    supportsBullets: [
      "Login and access history",
      "Record change history",
      "Deletion and export events",
      "Administrator and configuration changes",
      "Log export or retention where supported",
    ],
    typicalBuyerNeed:
      "Someone needs to be able to answer who changed or accessed a record",
    commonLimitation:
      "Coverage and retention differ widely, and full audit logs are usually a top-tier feature",
    primaryCapabilitySlug: "security-administration",
    primaryCapabilityName: "Security and administration",
    extraDimensions: [
      {
        id: "permissions-link",
        name: "Role permissions",
        valueType: "support-status",
        source: "related-feature",
        relatedFeatureSlug: "role-permissions",
        importance: "important",
      },
      {
        id: "retention",
        name: "Log retention",
        valueType: "limit",
        source: "notes-limit",
        importance: "high",
      },
      {
        id: "export",
        name: "Log export",
        valueType: "support-status",
        source: "related-feature",
        relatedFeatureSlug: "api-access",
        importance: "important",
      },
    ],
    needGuidance: {
      needIf: [
        "You must be able to investigate data access",
        "Internal policy requires periodic access review",
        "Export of the customer database is a real risk",
      ],
      mayNotNeedIf: [
        "A very small team with full mutual visibility",
        "Record-level history already answers your questions",
      ],
    },
    requirementMappings: [
      {
        id: "audit-activity",
        name: "Audit user activity",
        description: "Directly satisfies the requirement.",
        supportLevel: "direct",
        requirementSlug: "audit-user-activity",
      },
      {
        id: "restrict-access",
        name: "Restrict access by team",
        description:
          "Logs show what happened; permissions are what prevent it.",
        supportLevel: "partial",
        requirementSlug: "restrict-access-by-team",
      },
    ],
    relatedFeatureSlugs: ["role-permissions", "sso", "reporting-dashboards"],
    relatedCapabilitySlugs: ["security-administration", "reporting"],
    tradeoffs: [
      {
        id: "coverage",
        title: "Coverage vs noise",
        description:
          "Comprehensive logs answer more questions and are harder to review without tooling.",
        icon: "database",
      },
      {
        id: "retention",
        title: "Retention vs plan tier",
        description:
          "Retention windows are often short on lower plans, which limits investigations.",
        icon: "clock",
      },
      PLAN_TRADEOFF,
    ],
    vendorQuestions: [
      "What events are captured in the audit log?",
      "Are data exports and deletions logged?",
      "How long are logs retained?",
      "Can logs be exported or streamed to our own systems?",
      "Who can view the audit log?",
      "Which plan includes full audit logging?",
    ],
    faq: [
      {
        question: "What are CRM audit logs?",
        answer:
          "They are records of access and changes — sign-ins, edits, deletions, exports, and configuration changes — kept for later review.",
      },
      {
        question: "How are audit logs different from record history?",
        answer:
          "Record history shows changes on one record to normal users. Audit logs cover system-wide access and administrative events for reviewers.",
      },
      {
        question: "Does having audit logs make a CRM compliant?",
        answer:
          "No. Logs are one control among many. Compliance depends on your obligations, configuration, and contracts — verify requirements with the vendor and your own advisers.",
      },
    ],
    screenshotMatchTerms: ["audit", "log", "history", "activity", "security"],
  },
];

const BY_SLUG = new Map(CRM_FEATURES.map((item) => [item.slug, item]));

export function getCrmFeatureDefinition(
  slug: string,
): CrmFeatureDefinition | null {
  return BY_SLUG.get(slug) ?? null;
}
