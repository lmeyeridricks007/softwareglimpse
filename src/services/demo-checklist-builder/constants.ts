import type {
  DemoAttendeeRole,
  DemoItemPriority,
  DemoPriorityLevel,
  DemoType,
  DemoWizardStep,
} from "@/domain";

export const DEMO_WIZARD_STEPS: DemoWizardStep[] = [
  "setup",
  "priorities",
  "scenarios",
  "questions",
  "integrations",
  "reporting-admin",
  "commercial",
  "scoring",
  "agenda",
  "review",
];

export const DEMO_STEP_LABELS: Record<DemoWizardStep, string> = {
  setup: "Demo setup",
  priorities: "Evaluation priorities",
  scenarios: "Demo scenarios",
  questions: "Questions & checks",
  integrations: "Integrations & data",
  "reporting-admin": "Reporting & admin",
  commercial: "Commercial & impl. questions",
  scoring: "Scoring & evidence rules",
  agenda: "Agenda & time",
  review: "Review & generate",
  results: "Results",
};

export const DEMO_STEP_HINTS: Record<DemoWizardStep, string> = {
  setup: "Project, team, vendors",
  priorities: "What matters most",
  scenarios: "Key workflows to test",
  questions: "Functional questions",
  integrations: "Systems, APIs & data",
  "reporting-admin": "Reports and administration",
  commercial: "Ask, don't demo",
  scoring: "How you'll evaluate",
  agenda: "Build the demo flow",
  review: "Finalize and export",
  results: "Exports and handoffs",
};

export const DEMO_TYPE_LABELS: Record<DemoType, string> = {
  initial: "Initial demo",
  shortlist: "Shortlist demo",
  technical: "Technical demo",
  "final-validation": "Final validation demo",
};

export const DEMO_ATTENDEE_LABELS: Record<DemoAttendeeRole, string> = {
  "executive-sponsor": "Executive sponsor",
  "sales-leadership": "Sales leadership",
  "sales-operations": "Sales operations",
  "sales-representatives": "Sales representatives",
  marketing: "Marketing",
  "customer-service": "Customer service",
  it: "IT",
  security: "Security",
  data: "Data",
  procurement: "Procurement",
  other: "Other",
};

export const DEMO_PRIORITY_LABELS: Record<DemoPriorityLevel, string> = {
  "must-test": "Must test",
  "should-test": "Should test",
  optional: "Optional",
  "not-relevant": "Not relevant",
};

export const DEMO_ITEM_PRIORITY_LABELS: Record<DemoItemPriority, string> = {
  "must-have": "Must-have",
  "should-have": "Should-have",
  optional: "Optional",
};

export const DEFAULT_EVALUATION_AREAS: Array<{ id: string; label: string }> = [
  { id: "lead-management", label: "Lead management" },
  { id: "contact-management", label: "Contact management" },
  { id: "account-management", label: "Account management" },
  { id: "opportunity-management", label: "Opportunity management" },
  { id: "pipeline-management", label: "Pipeline management" },
  { id: "activities-tasks", label: "Activities / tasks" },
  { id: "email-calendar", label: "Email / calendar" },
  { id: "sales-automation", label: "Sales automation" },
  { id: "workflow-automation", label: "Workflow automation" },
  { id: "reporting", label: "Reporting" },
  { id: "dashboards", label: "Dashboards" },
  { id: "forecasting", label: "Forecasting" },
  { id: "mobile", label: "Mobile" },
  { id: "search", label: "Search" },
  { id: "data-quality", label: "Data quality" },
  { id: "customization", label: "Customization" },
  { id: "integrations", label: "Integrations" },
  { id: "apis", label: "APIs" },
  { id: "security", label: "Security" },
  { id: "permissions", label: "Permissions" },
  { id: "administration", label: "Administration" },
  { id: "ai-capabilities", label: "AI capabilities" },
  { id: "import-export", label: "Import / export" },
  { id: "customer-support", label: "Customer support" },
  { id: "implementation", label: "Implementation" },
];

export const DEFAULT_DEMO_GUIDELINES = `DEMO GUIDELINES

Please use the scenarios provided.

Use a standard product environment where possible.

Clearly identify functionality that requires:
- configuration
- customization
- third-party products
- additional modules
- higher pricing tiers

If a requested capability cannot be demonstrated, please state this rather than substituting a different workflow.

Do not steer the agenda toward unrelated features. The buyer owns the demo agenda.`;

export const DEFAULT_FUNCTIONAL_QUESTIONS: Array<{
  id: string;
  question: string;
}> = [
  { id: "Q-F-001", question: "Can this workflow be completed natively?" },
  { id: "Q-F-002", question: "Does it require configuration?" },
  { id: "Q-F-003", question: "Does it require custom development?" },
  {
    id: "Q-F-004",
    question: "Does it require another product/module?",
  },
  {
    id: "Q-F-005",
    question: "Is it available in the proposed edition?",
  },
  { id: "Q-F-006", question: "Is it available on mobile?" },
];

export const DEFAULT_ADMIN_QUESTIONS: Array<{
  id: string;
  question: string;
}> = [
  { id: "Q-A-001", question: "Who can configure this?" },
  {
    id: "Q-A-002",
    question: "Does configuration require vendor support?",
  },
  { id: "Q-A-003", question: "Can admins create fields?" },
  { id: "Q-A-004", question: "Can admins modify workflows?" },
  { id: "Q-A-005", question: "Can admins modify pipeline stages?" },
  { id: "Q-A-006", question: "Can admins create reports?" },
];

export const DEFAULT_DATA_QUESTIONS: Array<{
  id: string;
  question: string;
}> = [
  { id: "Q-D-001", question: "Can data be imported?" },
  { id: "Q-D-002", question: "Can data be exported?" },
  { id: "Q-D-003", question: "Which objects can be exported?" },
  { id: "Q-D-004", question: "Are activities included in export?" },
  { id: "Q-D-005", question: "Are attachments included in export?" },
  { id: "Q-D-006", question: "Can historical data be retained?" },
];

export const DEFAULT_INTEGRATION_CHECKS: Array<{
  id: string;
  integration: string;
  testTask: string;
}> = [
  {
    id: "INT-001",
    integration: "Email",
    testTask:
      "Log an email against a contact and show it on the activity timeline without duplicate entry.",
  },
  {
    id: "INT-002",
    integration: "Calendar",
    testTask:
      "Create a meeting from the CRM and show it on the user's calendar, then sync a reply.",
  },
  {
    id: "INT-003",
    integration: "Marketing automation",
    testTask:
      "Show how a marketing-qualified lead appears in CRM with source and campaign attribution.",
  },
  {
    id: "INT-004",
    integration: "Customer service",
    testTask:
      "Open a customer record and show related support tickets or conversation history.",
  },
  {
    id: "INT-005",
    integration: "Identity provider (SSO)",
    testTask:
      "Demonstrate SSO login for a standard user and confirm which edition includes it.",
  },
  {
    id: "INT-006",
    integration: "API / webhooks",
    testTask:
      "Show API access documentation, authentication method, and an example webhook or event.",
  },
];

export const DEFAULT_ADMIN_TASKS: Array<{
  id: string;
  category: "reporting" | "administration" | "ai";
  label: string;
  vendorTask: string;
  successCriteria: string;
  evidenceRequired: string;
  estimatedMinutes: number;
  priority: DemoItemPriority;
}> = [
  {
    id: "ADM-001",
    category: "reporting",
    label: "Pipeline by owner report",
    vendorTask:
      "Create a report showing pipeline by owner, then add a filter for region.",
    successCriteria:
      "Report uses live opportunity data and the filter can be applied without admin support.",
    evidenceRequired: "Screenshot of report + filter used",
    estimatedMinutes: 8,
    priority: "must-have",
  },
  {
    id: "ADM-002",
    category: "reporting",
    label: "Dashboard tile",
    vendorTask: "Create a dashboard tile from the pipeline report.",
    successCriteria: "Tile updates from live CRM data.",
    evidenceRequired: "Screenshot of dashboard",
    estimatedMinutes: 5,
    priority: "should-have",
  },
  {
    id: "ADM-003",
    category: "administration",
    label: "Custom field",
    vendorTask: "Add a custom field to opportunities and place it on the form.",
    successCriteria: "Field is visible to a sales user without redeploy.",
    evidenceRequired: "Screenshot + note on plan packaging",
    estimatedMinutes: 6,
    priority: "should-have",
  },
  {
    id: "ADM-004",
    category: "administration",
    label: "Pipeline stage change",
    vendorTask: "Modify a pipeline stage label or add a stage.",
    successCriteria: "Change is available in the live pipeline view.",
    evidenceRequired: "Before/after note",
    estimatedMinutes: 5,
    priority: "should-have",
  },
  {
    id: "ADM-005",
    category: "administration",
    label: "User access restriction",
    vendorTask: "Create or open a user and restrict access to another team's records.",
    successCriteria: "Restricted user cannot open out-of-scope records.",
    evidenceRequired: "Observed access attempt result",
    estimatedMinutes: 8,
    priority: "must-have",
  },
  {
    id: "ADM-006",
    category: "administration",
    label: "Simple automation",
    vendorTask:
      "Create a simple automation that assigns a follow-up task when a deal enters a stage.",
    successCriteria: "Automation fires in the demo environment without custom code.",
    evidenceRequired: "Automation definition + resulting task",
    estimatedMinutes: 8,
    priority: "should-have",
  },
  {
    id: "AI-001",
    category: "ai",
    label: "Summarize an opportunity",
    vendorTask:
      "Open an opportunity with activity history and generate an AI summary.",
    successCriteria:
      "Summary is grounded in CRM data; vendor discloses data use and whether output can be audited.",
    evidenceRequired: "Sample output + data-use answers",
    estimatedMinutes: 5,
    priority: "optional",
  },
  {
    id: "AI-002",
    category: "ai",
    label: "Generate follow-up email",
    vendorTask:
      "Generate a follow-up email draft from opportunity context and show how it is edited before send.",
    successCriteria:
      "Draft can be reviewed/edited; vendor states plan packaging and usage limits.",
    evidenceRequired: "Draft sample + packaging note",
    estimatedMinutes: 5,
    priority: "optional",
  },
  {
    id: "AI-003",
    category: "ai",
    label: "Identify risky opportunities",
    vendorTask:
      "Show how AI identifies at-risk opportunities and what signals it uses.",
    successCriteria:
      "Signals are explainable; incorrect results can be corrected or ignored.",
    evidenceRequired: "Example risk list + explanation",
    estimatedMinutes: 6,
    priority: "optional",
  },
];

export const DEFAULT_COMMERCIAL_QUESTIONS: Array<{
  id: string;
  topic: string;
  question: string;
}> = [
  {
    id: "COM-001",
    topic: "Implementation duration",
    question: "What is a realistic implementation duration for our scope?",
  },
  {
    id: "COM-002",
    topic: "Migration approach",
    question: "How is data migration typically approached for our object set?",
  },
  {
    id: "COM-003",
    topic: "Training",
    question: "What training is included vs charged separately?",
  },
  {
    id: "COM-004",
    topic: "Support model",
    question: "What support channels, hours and SLAs apply to the quoted plan?",
  },
  {
    id: "COM-005",
    topic: "Sandbox availability",
    question: "Is a sandbox included, and what limitations apply?",
  },
  {
    id: "COM-006",
    topic: "Seat / contract minimum",
    question: "What are seat minimums and contract term requirements?",
  },
  {
    id: "COM-007",
    topic: "Required modules",
    question: "Which modules or add-ons are required for the demonstrated workflows?",
  },
  {
    id: "COM-008",
    topic: "Implementation fees",
    question: "What implementation fees are expected for our scope?",
  },
  {
    id: "COM-009",
    topic: "API / storage / AI limits",
    question: "What API, storage and AI usage limits apply to the quoted edition?",
  },
  {
    id: "COM-010",
    topic: "Cancellation / export",
    question: "What is the cancellation and full data export process?",
  },
];

export const VAGUE_TASK_PATTERNS: Array<{
  pattern: RegExp;
  reason: string;
}> = [
  { pattern: /\bshow\s+(?:us\s+)?(?:your\s+)?pipeline\b/i, reason: "Too vague — specify observable steps." },
  { pattern: /\bshow\s+reporting\b/i, reason: "Too vague — specify the report to create." },
  { pattern: /\bshow\s+integrations?\b/i, reason: "Too vague — name the system and sync behaviour." },
  { pattern: /\bshow\s+(?:us\s+)?(?:your\s+)?ai\b/i, reason: "Too vague — specify an AI workflow to test." },
  { pattern: /\beasy\s+to\s+use\b/i, reason: "Subjective — not observable." },
];

export function newDemoId(prefix: string): string {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${prefix}-${rand}`;
}

export function resolveDemoDurationMinutes(input: {
  durationOption: string;
  customDurationMinutes?: number;
}): number {
  if (input.durationOption === "custom") {
    return input.customDurationMinutes ?? 90;
  }
  const parsed = Number(input.durationOption);
  return Number.isFinite(parsed) ? parsed : 90;
}
