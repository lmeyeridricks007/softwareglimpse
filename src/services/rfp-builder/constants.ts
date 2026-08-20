import type {
  RfpDeliveryMethod,
  RfpMode,
  RfpRequirementPriority,
  RfpWizardStep,
} from "@/domain";

export const RFP_PRIORITY_LABELS: Record<RfpRequirementPriority, string> = {
  "must-have": "Must Have",
  "should-have": "Should Have",
  "could-have": "Could Have",
  future: "Future",
  "out-of-scope": "Out of Scope",
};

export const RFP_DELIVERY_METHOD_LABELS: Record<RfpDeliveryMethod, string> = {
  native: "NATIVE",
  configuration: "CONFIGURATION",
  custom: "CUSTOM",
  "third-party": "THIRD PARTY",
  roadmap: "ROADMAP",
  "not-supported": "NOT SUPPORTED",
  "n-a": "N/A",
};

export const RFP_DELIVERY_METHOD_DEFINITIONS: Record<
  RfpDeliveryMethod,
  string
> = {
  native: "Available as standard functionality.",
  configuration: "Available through product configuration.",
  custom: "Requires custom development.",
  "third-party": "Requires another product/service.",
  roadmap: "Planned, not currently available.",
  "not-supported": "Cannot currently meet requirement.",
  "n-a": "Not applicable.",
};

export const RFP_DELIVERY_METHODS = Object.keys(
  RFP_DELIVERY_METHOD_LABELS,
) as RfpDeliveryMethod[];

/** Prompt-only change triggers — never auto-selected as facts. */
export const RFP_CHANGE_TRIGGER_PROMPTS = [
  "CRM no longer fits process",
  "Poor adoption",
  "Reporting problems",
  "Disconnected systems",
  "Manual workflows",
  "Growth / scalability",
  "Replacing spreadsheets",
  "Consolidation",
  "Cost reduction",
  "Migration from existing CRM",
] as const;

export const RFP_SCOPE_CATALOG: Array<{
  id: string;
  label: string;
  capabilitySlug?: string;
}> = [
  { id: "contacts-accounts", label: "Contacts / accounts", capabilitySlug: "contact-management" },
  { id: "lead-management", label: "Lead management", capabilitySlug: "pipeline-management" },
  { id: "opportunity-management", label: "Opportunity management", capabilitySlug: "pipeline-management" },
  { id: "pipeline-management", label: "Pipeline management", capabilitySlug: "pipeline-management" },
  { id: "activities-tasks", label: "Activities / tasks", capabilitySlug: "contact-management" },
  { id: "email-calendar", label: "Email / calendar", capabilitySlug: "contact-management" },
  { id: "sales-automation", label: "Sales automation", capabilitySlug: "workflow-automation" },
  { id: "forecasting", label: "Forecasting", capabilitySlug: "reporting" },
  { id: "reporting", label: "Reporting", capabilitySlug: "reporting" },
  { id: "territory-management", label: "Territory management" },
  { id: "mobile", label: "Mobile" },
  { id: "integrations", label: "Integrations", capabilitySlug: "integrations" },
  { id: "data-migration", label: "Data migration" },
  { id: "customer-service", label: "Customer service" },
  { id: "marketing", label: "Marketing" },
  { id: "other", label: "Other" },
];

export const RFP_USER_GROUP_PROMPTS = [
  "Sales reps",
  "Managers",
  "RevOps",
  "Admins",
  "Executives",
  "Customer success",
  "Marketing",
] as const;

export const RFP_INTEGRATION_CATEGORIES = [
  "ERP",
  "Email/calendar",
  "Marketing automation",
  "Customer support",
  "Data warehouse",
  "Identity",
  "Website/forms",
  "Finance",
  "Telephony",
  "Other",
] as const;

export const RFP_MIGRATION_OBJECT_PROMPTS = [
  "Contacts",
  "Accounts",
  "Leads",
  "Opportunities",
  "Activities",
  "Emails",
  "Notes",
  "Custom objects",
] as const;

export const DEFAULT_IMPLEMENTATION_QUESTIONS: Array<{
  id: string;
  label: string;
}> = [
  { id: "duration", label: "Estimated implementation duration" },
  { id: "phases", label: "Implementation phases" },
  { id: "vendor-resp", label: "Vendor responsibilities" },
  { id: "customer-resp", label: "Customer responsibilities" },
  { id: "partner-resp", label: "Partner responsibilities" },
  { id: "customer-roles", label: "Required customer roles" },
  { id: "migration-approach", label: "Data migration approach" },
  { id: "integration-approach", label: "Integration approach" },
  { id: "uat", label: "Testing / UAT approach" },
  { id: "training", label: "Training" },
  { id: "change-mgmt", label: "Change management" },
  { id: "go-live-support", label: "Go-live support" },
  { id: "hypercare", label: "Hypercare" },
  { id: "post-success", label: "Post-go-live success support" },
];

export const DEFAULT_TIMELINE_PHASES = [
  "Discovery",
  "Design",
  "Configuration",
  "Integration",
  "Migration",
  "Testing",
  "Training",
  "Go-live",
  "Hypercare",
] as const;

export const DEFAULT_SECURITY_LIBRARY: Array<{
  id: string;
  area: string;
  question: string;
  sourceSlug?: string;
}> = [
  { id: "SEC-001", area: "Access", question: "Does the platform support SSO on the quoted edition?", sourceSlug: "support-sso" },
  { id: "SEC-002", area: "Access", question: "Does the platform support MFA for user and/or admin access?" },
  { id: "SEC-003", area: "Access", question: "Does the platform support role-based access control (RBAC)?", sourceSlug: "restrict-access-by-team" },
  { id: "SEC-004", area: "Audit", question: "Are audit logs available for user and admin activity?", sourceSlug: "audit-user-activity" },
  { id: "SEC-005", area: "Encryption", question: "Is customer data encrypted at rest?" },
  { id: "SEC-006", area: "Encryption", question: "Is data encrypted in transit (TLS)?" },
  { id: "SEC-007", area: "Residency", question: "What data residency options are available?", sourceSlug: "control-data-residency" },
  { id: "SEC-008", area: "Backup", question: "Describe backup frequency and restoration options." },
  { id: "SEC-009", area: "Retention", question: "How are retention and deletion handled for customer CRM data?" },
  { id: "SEC-010", area: "Privacy", question: "Describe GDPR / privacy programme support for CRM customer data." },
  { id: "SEC-011", area: "Privacy", question: "Provide a current subprocessor list relevant to CRM data." },
  { id: "SEC-012", area: "Certifications", question: "List security certifications available for the quoted service (do not invent)." },
  { id: "SEC-013", area: "Incident", question: "Describe incident notification and handling process." },
  { id: "SEC-014", area: "Continuity", question: "Describe business continuity / disaster recovery approach." },
];

export const DEFAULT_SUPPORT_TOPICS: Array<{ id: string; topic: string }> = [
  { id: "SUP-001", topic: "Support hours" },
  { id: "SUP-002", topic: "Support channels" },
  { id: "SUP-003", topic: "Severity levels" },
  { id: "SUP-004", topic: "Response SLA" },
  { id: "SUP-005", topic: "Resolution SLA" },
  { id: "SUP-006", topic: "Dedicated CSM" },
  { id: "SUP-007", topic: "Technical account manager" },
  { id: "SUP-008", topic: "Admin support" },
  { id: "SUP-009", topic: "Premium support pricing" },
  { id: "SUP-010", topic: "Training portal" },
  { id: "SUP-011", topic: "Knowledge base" },
];

export const DEFAULT_RESPONSE_RULES = [
  "Keep requirement IDs unchanged.",
  "Answer every applicable requirement.",
  "Identify native vs configured vs custom functionality.",
  "Identify all third-party dependencies.",
  "Identify required editions/plans.",
  "Clearly mark roadmap functionality.",
  "Provide evidence links where requested.",
  "State assumptions and exceptions.",
  "Use the provided pricing structure.",
  "Do not replace requested answers with marketing collateral.",
] as const;

export const VAGUE_REQUIREMENT_PATTERNS: Array<{
  pattern: RegExp;
  reason: string;
  suggestion: string;
}> = [
  {
    pattern: /\beasy\s+to\s+use\b/i,
    reason: "Too subjective.",
    suggestion:
      "Sales reps should be able to create/update a deal, assign next action and move stage without administrator intervention.",
  },
  {
    pattern: /\bgood\s+reporting\b/i,
    reason: "Too vague — not observable.",
    suggestion:
      "Managers must be able to view pipeline by owner, stage and forecast category and export results.",
  },
  {
    pattern: /\bstrong\s+(?:reporting|automation|integrations?)\b/i,
    reason: "Too vague — not observable.",
    suggestion:
      "Managers must be able to view pipeline by owner, stage and forecast category and export results.",
  },
  {
    pattern: /\bbest\s+integrations?\b/i,
    reason: "Too vague — not comparable.",
    suggestion:
      "Sync contacts and activities bidirectionally with company Microsoft 365 or Google Workspace email on the quoted edition.",
  },
  {
    pattern: /\bai\s+capabilities\b/i,
    reason: "Too vague — specify the job to be done.",
    suggestion:
      "Suggest next best activity on open opportunities using CRM activity history, with the suggestion visible to the opportunity owner.",
  },
  {
    pattern: /\buser[- ]?friendly\b/i,
    reason: "Too subjective.",
    suggestion:
      "A new sales rep can log a call, update deal stage and schedule a follow-up in under two minutes without admin help.",
  },
  {
    pattern: /\bintuitive\b/i,
    reason: "Too subjective.",
    suggestion:
      "Users can complete primary daily workflows (create contact, update opportunity, log activity) without custom training beyond a 30-minute walkthrough.",
  },
];

/** Formal RFP uses all content steps; Vendor Brief collapses advanced ones. */
export function stepsForMode(mode: RfpMode | undefined): RfpWizardStep[] {
  const core: RfpWizardStep[] = [
    "project",
    "business-context",
    "scope-users",
    "requirements",
    "integrations",
    "implementation",
    "commercials",
    "response-rules",
    "review",
  ];
  if (mode === "formal-rfp") {
    return [
      "project",
      "business-context",
      "scope-users",
      "requirements",
      "integrations",
      "implementation",
      "security-support",
      "commercials",
      "response-rules",
      "review",
    ];
  }
  if (mode === "vendor-brief") {
    return core;
  }
  return ["mode"];
}

export const STEP_LABELS: Record<RfpWizardStep, string> = {
  mode: "Mode",
  project: "Project",
  "business-context": "Business Context",
  "scope-users": "Scope & Users",
  requirements: "Requirements",
  integrations: "Integrations & Data",
  implementation: "Implementation",
  "security-support": "Security & Support",
  commercials: "Commercials",
  "response-rules": "Response Rules",
  review: "Review & Generate",
  results: "Results",
};

export function newRfpId(prefix: string): string {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${prefix}-${rand}`;
}
