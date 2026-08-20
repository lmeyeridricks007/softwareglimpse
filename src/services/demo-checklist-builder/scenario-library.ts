/**
 * Starter CRM demo scenario templates.
 * Structured config — not hard-coded in React components.
 */

import type { DemoItemPriority } from "@/domain";

export type DemoScenarioTemplate = {
  id: string;
  name: string;
  businessContext: string;
  persona: string;
  categoryId: string;
  startingState: string;
  vendorTasks: string[];
  expectedOutcome: string;
  successCriteria: string[];
  evidenceRequired: string[];
  priority: DemoItemPriority;
  estimatedMinutes: number;
  moderatorScript: string;
  /** Capability / requirement area hints for coverage matching. */
  capabilityHints: string[];
};

export const DEMO_SCENARIO_TEMPLATES: DemoScenarioTemplate[] = [
  {
    id: "tmpl-lead-to-opportunity",
    name: "New Lead → Qualified Opportunity",
    businessContext:
      "End-to-end lead capture and qualification into a managed opportunity.",
    persona: "Sales Rep",
    categoryId: "lead-management",
    startingState:
      "A new inbound lead has arrived with name, email, company and source.",
    vendorTasks: [
      "Create or import the inbound lead",
      "Assign the lead to a salesperson",
      "Qualify the lead",
      "Convert / create the appropriate account, contact and deal records",
      "Move the opportunity into the first pipeline stage",
      "Assign an owner",
      "Create a dated next step",
    ],
    expectedOutcome:
      "A qualified opportunity exists with owner, stage and next activity.",
    successCriteria: [
      "Workflow completes without duplicate data entry",
      "Opportunity has an owner",
      "Opportunity has a pipeline stage",
      "Opportunity has a dated next activity",
    ],
    evidenceRequired: [
      "Screenshot of resulting opportunity",
      "Number of manual steps",
      "Automation used",
      "Configuration required",
      "Limitations mentioned",
    ],
    priority: "must-have",
    estimatedMinutes: 12,
    moderatorScript:
      "Please start from the CRM home screen. Assume I am a sales representative receiving a new inbound lead. Create or import that lead, assign it, qualify it, convert it into the appropriate records, place the opportunity in the first pipeline stage, assign an owner and create a dated next step. Please do not skip to a pre-built opportunity unless that is how a standard customer would work.",
    capabilityHints: ["lead-management", "pipeline-management", "contact-management"],
  },
  {
    id: "tmpl-account-to-opportunity",
    name: "Existing Account → New Opportunity",
    businessContext:
      "Can reps create a new deal on an existing account without re-entering customer data?",
    persona: "Sales Rep",
    categoryId: "opportunity-management",
    startingState: "An existing account and primary contact are already in the CRM.",
    vendorTasks: [
      "Open the existing account",
      "Create a new opportunity from the account",
      "Link the primary contact",
      "Set value, close date and stage",
      "Assign ownership",
      "Log a kickoff activity",
    ],
    expectedOutcome:
      "New opportunity is linked to the existing account/contact with owner and stage.",
    successCriteria: [
      "No duplicate account/contact created",
      "Opportunity linked correctly",
      "Owner and stage set",
    ],
    evidenceRequired: ["Screenshot of linked opportunity", "Steps observed"],
    priority: "must-have",
    estimatedMinutes: 8,
    moderatorScript:
      "Open an existing account that already has a contact. Create a new opportunity from that account, link the contact, set value and close date, assign an owner and log a kickoff activity. Do not recreate the account.",
    capabilityHints: ["account-management", "opportunity-management"],
  },
  {
    id: "tmpl-next-step-management",
    name: "Opportunity → Next-step Management",
    businessContext:
      "Can the team keep every active deal moving with clear next actions?",
    persona: "Sales Rep",
    categoryId: "activities-tasks",
    startingState: "An open opportunity exists without a scheduled next activity.",
    vendorTasks: [
      "Open the opportunity",
      "Identify that no next step is scheduled",
      "Create a follow-up task or meeting with a due date",
      "Return to a list or pipeline view that shows next activity",
    ],
    expectedOutcome: "Opportunity shows a dated next step visible in pipeline/list views.",
    successCriteria: [
      "Missing next step is visible",
      "New activity can be created in-context",
      "Next activity appears in pipeline/list",
    ],
    evidenceRequired: ["Screenshot before/after", "Clicks observed"],
    priority: "must-have",
    estimatedMinutes: 7,
    moderatorScript:
      "Open an opportunity that has no scheduled next activity. Show me how you would spot that gap, create a dated follow-up, and confirm it appears back in the pipeline or list view.",
    capabilityHints: ["activities-tasks", "pipeline-management"],
  },
  {
    id: "tmpl-pipeline-review",
    name: "Manager → Pipeline Review",
    businessContext:
      "Can a manager quickly identify stalled deals and missing next steps?",
    persona: "Sales Manager",
    categoryId: "pipeline-management",
    startingState: "Pipeline contains multiple active opportunities across reps.",
    vendorTasks: [
      "Open the team's pipeline",
      "Filter opportunities by salesperson",
      "Identify opportunities without recent activity",
      "Identify opportunities without a next step",
      "Open one opportunity",
      "Reassign the owner if needed",
      "Create a follow-up task",
      "Return to the pipeline view",
    ],
    expectedOutcome:
      "Manager can identify stalled deals and act without leaving the workflow.",
    successCriteria: [
      "Can identify stalled deals",
      "Can identify missing next steps",
      "Can filter by owner",
      "Can update the deal without leaving the workflow",
    ],
    evidenceRequired: [
      "Screenshot",
      "Number of clicks",
      "Configuration required",
      "Limitation",
      "Follow-up question",
    ],
    priority: "must-have",
    estimatedMinutes: 10,
    moderatorScript:
      "Please start from the CRM home screen. Assume I am a sales manager responsible for five representatives. Show me how I would identify opportunities with no scheduled next activity. Please do not use a pre-built dashboard unless that dashboard would be available to a standard customer.",
    capabilityHints: ["pipeline-management", "reporting", "forecasting"],
  },
  {
    id: "tmpl-daily-activity",
    name: "Sales Rep → Daily Activity Workflow",
    businessContext: "Can a rep run their day from CRM without spreadsheets?",
    persona: "Sales Rep",
    categoryId: "activities-tasks",
    startingState: "Rep has open tasks, meetings and opportunities for today.",
    vendorTasks: [
      "Open today's task or activity list",
      "Complete or log one call/meeting",
      "Update an opportunity stage",
      "Schedule the next follow-up",
      "Show how unfinished work carries forward",
    ],
    expectedOutcome: "Daily work is visible and updatable in one workflow.",
    successCriteria: [
      "Today's work is visible",
      "Logging activity updates related records",
      "Next follow-up can be scheduled quickly",
    ],
    evidenceRequired: ["Screenshot of daily view", "Time to complete loop"],
    priority: "should-have",
    estimatedMinutes: 8,
    moderatorScript:
      "Show me a sales rep's daily work list. Log one activity, update a deal stage and schedule the next follow-up without leaving CRM for a spreadsheet.",
    capabilityHints: ["activities-tasks", "email-calendar"],
  },
  {
    id: "tmpl-forecast-review",
    name: "Manager → Forecast Review",
    businessContext:
      "Can managers reconcile pipeline to a usable forward revenue view?",
    persona: "Sales Manager",
    categoryId: "forecasting",
    startingState: "Sample opportunities have values, stages and close dates.",
    vendorTasks: [
      "Open the forecast or pipeline projection view",
      "Show how deal value and close date feed the forecast",
      "Adjust stage probability or category and show the impact",
      "Filter by team or owner if claimed",
      "Confirm which plan includes forecasting",
    ],
    expectedOutcome: "Forecast uses live opportunity data and is filterable for planning.",
    successCriteria: [
      "Forecast uses live opportunity data",
      "Probability or categories are configurable where required",
      "Views can be filtered for planning conversations",
    ],
    evidenceRequired: ["Screenshot of forecast", "Plan packaging note"],
    priority: "should-have",
    estimatedMinutes: 8,
    moderatorScript:
      "Open the forecast view based on live opportunities. Show how changing stage or category affects the forecast, and filter by owner if available.",
    capabilityHints: ["forecasting", "reporting", "pipeline-management"],
  },
  {
    id: "tmpl-admin-pipeline-field",
    name: "Admin → Modify Pipeline / Field",
    businessContext: "Can admins adapt the CRM without vendor tickets for simple changes?",
    persona: "Admin",
    categoryId: "administration",
    startingState: "Admin access is available in the demo environment.",
    vendorTasks: [
      "Add or rename a pipeline stage",
      "Add a custom field to opportunities",
      "Place the field on the sales form",
      "Confirm a sales user can see the change",
    ],
    expectedOutcome: "Simple configuration changes are available without custom development.",
    successCriteria: [
      "Stage change appears in pipeline",
      "Custom field visible to sales user",
      "No custom code required for this change",
    ],
    evidenceRequired: ["Configuration screenshots", "Edition/plan note"],
    priority: "should-have",
    estimatedMinutes: 10,
    moderatorScript:
      "As an admin, add or rename a pipeline stage and add a custom opportunity field that a sales user can see. Tell me if this requires a higher plan or vendor services.",
    capabilityHints: ["administration", "customization", "permissions"],
  },
  {
    id: "tmpl-email-calendar",
    name: "User → Email / Calendar Activity",
    businessContext: "Can email and calendar activity stay attached to the right records?",
    persona: "Sales Rep",
    categoryId: "email-calendar",
    startingState: "Email/calendar integration is available or can be shown in sandbox.",
    vendorTasks: [
      "Log or sync an email to a contact",
      "Create a meeting linked to an opportunity",
      "Show the activity on the record timeline",
      "Clarify sync direction and plan packaging",
    ],
    expectedOutcome: "Email and meetings appear on the correct CRM records.",
    successCriteria: [
      "Email appears on contact/opportunity",
      "Meeting is linked without duplicate entry",
      "Packaging and sync direction are explicit",
    ],
    evidenceRequired: ["Timeline screenshot", "Sync notes"],
    priority: "must-have",
    estimatedMinutes: 8,
    moderatorScript:
      "Show how a sales rep logs or syncs an email to a contact and creates a meeting on an opportunity so both appear on the activity timeline.",
    capabilityHints: ["email-calendar", "integrations"],
  },
  {
    id: "tmpl-report-dashboard",
    name: "Ops → Report / Dashboard Creation",
    businessContext: "Can operations create useful views without waiting on vendors?",
    persona: "Tech / RevOps",
    categoryId: "reporting",
    startingState: "Sample pipeline data exists; report builder is accessible.",
    vendorTasks: [
      "Create a report showing pipeline by owner",
      "Add a filter for region or team",
      "Create a dashboard tile from the report",
      "Confirm who can create and share reports",
    ],
    expectedOutcome: "Ops can build and share a live pipeline report/dashboard.",
    successCriteria: [
      "Report uses live data",
      "Filter works",
      "Dashboard tile can be created and shared",
    ],
    evidenceRequired: ["Report screenshot", "Permission note"],
    priority: "should-have",
    estimatedMinutes: 10,
    moderatorScript:
      "Create a pipeline-by-owner report, add a filter, and put it on a dashboard. Tell me who can do this on the quoted edition.",
    capabilityHints: ["reporting", "dashboards"],
  },
  {
    id: "tmpl-export-data",
    name: "Admin → Export CRM Data",
    businessContext:
      "Can the buyer export contacts, accounts, deals and activities without lock-in surprises?",
    persona: "Admin",
    categoryId: "import-export",
    startingState: "Admin export tools are available in the demo or documented live.",
    vendorTasks: [
      "Export contacts",
      "Export accounts",
      "Export deals / opportunities",
      "Export activities",
      "Clarify attachment and historical data handling",
    ],
    expectedOutcome: "Required objects can be exported; gaps are stated explicitly.",
    successCriteria: [
      "Contacts export demonstrated or clearly unavailable",
      "Accounts export demonstrated or clearly unavailable",
      "Deals export demonstrated or clearly unavailable",
      "Activities export demonstrated or clearly unavailable",
    ],
    evidenceRequired: ["Export sample or limitation statement", "Object coverage list"],
    priority: "must-have",
    estimatedMinutes: 8,
    moderatorScript:
      "Demonstrate exporting contacts, accounts, deals and activities. If any object cannot be exported, say so rather than substituting another report.",
    capabilityHints: ["import-export", "apis", "data-quality"],
  },
];

export function getScenarioTemplate(id: string): DemoScenarioTemplate | undefined {
  return DEMO_SCENARIO_TEMPLATES.find((t) => t.id === id);
}
