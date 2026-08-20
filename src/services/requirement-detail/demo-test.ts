import {
  RequirementDemoTestSchema,
  type RequirementDemoTest,
  type RequirementDetailProfile,
} from "@/domain";

/**
 * Hand-authored demo tests keyed by requirement slug.
 * Prefer these over synthesis when present on the profile or here.
 */
const DEMO_TESTS: Record<string, RequirementDemoTest> = {
  "separate-sales-processes": RequirementDemoTestSchema.parse({
    requirementId: "separate-sales-processes",
    objective:
      "Verify that separate teams/processes can operate distinct sales workflows.",
    preconditions: [
      "Admin or configuration access in the demo environment",
      "At least two sample users or teams available",
      "Ability to create pipelines, stages, deals, automation, and reports",
    ],
    steps: [
      "Create Pipeline A.",
      "Create Pipeline B.",
      "Configure different stages on each pipeline.",
      "Add an opportunity to each pipeline.",
      "Show how team access is controlled between pipelines.",
      "Add automation specific to one pipeline only.",
      "Show separate pipeline reporting or filtered views.",
    ],
    expectedOutcomes: [
      "Pipelines are genuinely independent",
      "Stages can differ by pipeline",
      "Workflows/automation can differ where required",
      "Reporting can distinguish the pipelines",
      "User access can be controlled where required",
    ],
    failureSignals: [
      "Only one shared stage set can exist",
      "Automation cannot be scoped to a pipeline",
      "Reporting cannot filter or separate by pipeline",
      "Access cannot be limited by team/process",
      "Vendor can only show slides — not a live configuration",
    ],
    questions: [
      "Can each process keep its own stage structure permanently?",
      "Which plan is required for multiple pipelines and pipeline permissions?",
      "Can automation and reporting be scoped independently per pipeline?",
    ],
  }),

  "restrict-access-by-team": RequirementDemoTestSchema.parse({
    requirementId: "restrict-access-by-team",
    objective:
      "Verify that teams can be limited to the records, fields, and exports they should see.",
    preconditions: [
      "Two roles or teams available in the demo tenant",
      "Sample records owned by different teams",
      "Admin access to permission settings",
    ],
    steps: [
      "Create or open Role/Team A and Role/Team B.",
      "Assign different record visibility rules to each.",
      "Log in (or impersonate) as a Team A user and attempt to open a Team B record.",
      "Show whether sensitive fields can be hidden by role.",
      "Attempt an export as a restricted user.",
      "Show how ownership or sharing changes visibility.",
      "Confirm which plan includes these controls.",
    ],
    expectedOutcomes: [
      "Record visibility can differ by team/role",
      "Restricted users cannot open out-of-scope records",
      "Field-level restrictions work where claimed",
      "Export can be limited",
      "Permission model is understandable for admins",
    ],
    failureSignals: [
      "Only admin vs non-admin exists",
      "Restricted user can still open other teams' records",
      "Export cannot be constrained",
      "Controls require undocumented custom development",
      "Vendor refuses a live permission walkthrough",
    ],
    questions: [
      "Is visibility ownership-based, team-based, hierarchy-based, or sharing-based?",
      "Can field visibility be restricted independently of record access?",
      "Which plan unlocks record-level and export controls?",
    ],
  }),

  "forecast-revenue": RequirementDemoTestSchema.parse({
    requirementId: "forecast-revenue",
    objective:
      "Verify that pipeline data can produce a usable forward revenue view for planning.",
    preconditions: [
      "Sample opportunities with values and close dates",
      "Stage probabilities configured or configurable",
      "Access to forecast or pipeline reporting views",
    ],
    steps: [
      "Open the forecast or pipeline projection view.",
      "Show how deal value and close date feed the forecast.",
      "Adjust stage probability or category and show the impact.",
      "Filter or split the forecast by team or pipeline if claimed.",
      "Show a manager vs owner view if available.",
      "Ask how forecast accuracy or history is tracked.",
      "Confirm which plan includes forecasting.",
    ],
    expectedOutcomes: [
      "Forecast uses live opportunity data",
      "Probability or categories are configurable where required",
      "Views can be filtered for planning conversations",
      "Owners and managers can reconcile the numbers",
      "Plan packaging for forecasting is explicit",
    ],
    failureSignals: [
      "Forecast is a static spreadsheet export only",
      "Cannot change probability or categories",
      "Cannot filter by team/pipeline when that is required",
      "Numbers do not match open pipeline totals",
      "Feature is promised but not shown live",
    ],
    questions: [
      "How is the forecast calculated?",
      "Can owners submit a commitment alongside the calculated view?",
      "Does forecasting work across multiple pipelines?",
    ],
  }),

  "manage-integrations": RequirementDemoTestSchema.parse({
    requirementId: "manage-integrations",
    objective:
      "Verify that critical systems can connect with the sync depth, ownership, and failure handling you need.",
    preconditions: [
      "List of must-have systems (mail, billing, marketing, support, etc.)",
      "Admin access to the integrations directory or API settings",
      "Willingness to show a live connector or sandbox sync",
    ],
    steps: [
      "Open the integrations / marketplace / API area.",
      "Locate a connector for one of your must-have systems.",
      "Show authentication and which objects/fields sync.",
      "Clarify sync direction and conflict handling.",
      "Show how failures, retries, or logs are surfaced.",
      "Show who can install or revoke connectors.",
      "Confirm API / webhook access and plan packaging.",
    ],
    expectedOutcomes: [
      "Required connectors exist or API access is clear",
      "Sync scope and direction are explicit",
      "Failures are visible to admins",
      "Access to connect apps can be controlled",
      "Plan and add-on costs for integrations are stated",
    ],
    failureSignals: [
      "Critical systems only supported via unpaid custom work",
      "No failure visibility",
      "API access locked behind an unexpected plan",
      "Vendor cannot show a live connector configuration",
      "Field mapping is too limited for your process",
    ],
    questions: [
      "Who builds and maintains each integration?",
      "What are API rate limits on our target plan?",
      "How are sync failures retried and alerted?",
    ],
  }),

  "automate-lead-follow-up": RequirementDemoTestSchema.parse({
    requirementId: "automate-lead-follow-up",
    objective:
      "Verify that inbound or owned leads can trigger timely, visible follow-up without manual babysitting.",
    preconditions: [
      "Sample lead or contact record",
      "Ability to create automation / sequences / tasks",
      "A second user to receive assignment if routing is required",
    ],
    steps: [
      "Create or import a lead that should trigger follow-up.",
      "Configure a trigger (form submit, status change, or time-based).",
      "Show automatic owner assignment or task creation.",
      "Show a sequence or reminder path if claimed.",
      "Demonstrate how stalled leads become visible.",
      "Show where a human can pause or override automation.",
      "Confirm plan limits for automation volume.",
    ],
    expectedOutcomes: [
      "Triggers fire from the events you care about",
      "Owners or tasks are assigned automatically",
      "Follow-up remains visible to managers",
      "Humans can intervene without breaking the process",
      "Plan packaging for automation is clear",
    ],
    failureSignals: [
      "Only manual task creation is available",
      "No visibility when follow-up stalls",
      "Automation cannot be scoped to lead status/source",
      "Vendor demo is slides only",
    ],
    questions: [
      "Which events can start automation?",
      "Can sequences and tasks be paused per lead?",
      "Which plan includes the automation volume we need?",
    ],
  }),
};

/**
 * Build a RequirementDemoTest from profile data (no hardcoded JSX).
 * Prefer profile.demoTest → hand-authored catalog → synthesis.
 */
export function buildRequirementDemoTest(
  profile: Pick<
    RequirementDetailProfile,
    | "slug"
    | "name"
    | "buyerNeedDescription"
    | "evaluationCriteria"
    | "acceptanceNeeds"
    | "workflowSteps"
    | "vendorQuestions"
    | "demoTest"
  >,
): RequirementDemoTest {
  if (profile.demoTest) {
    return RequirementDemoTestSchema.parse({
      ...profile.demoTest,
      requirementId: profile.slug,
    });
  }

  const authored = DEMO_TESTS[profile.slug];
  if (authored) return authored;

  const steps =
    profile.workflowSteps.length > 0
      ? profile.workflowSteps.map((s) => s.detail || s.label)
      : profile.acceptanceNeeds.length > 0
        ? profile.acceptanceNeeds.map((n) => n.description || n.title)
        : profile.vendorQuestions.slice(0, 6).map((q) =>
            q.endsWith("?") ? `Ask: ${q}` : q,
          );

  const expectedOutcomes =
    profile.evaluationCriteria.length > 0
      ? profile.evaluationCriteria.map((c) => c.name)
      : [`${profile.name} can be demonstrated end-to-end in a live session`];

  return RequirementDemoTestSchema.parse({
    requirementId: profile.slug,
    objective: `Verify that the product can satisfy: ${profile.buyerNeedDescription}`,
    preconditions: [
      "Live product environment (not slides only)",
      "Admin or configuration access for the features under test",
      "Sample data that matches your real process",
    ],
    steps:
      steps.length > 0
        ? steps
        : [
            `Ask the vendor to demonstrate ${profile.name.toLowerCase()} live.`,
            "Walk the configuration path your team would use.",
            "Confirm plan packaging for the capabilities shown.",
          ],
    expectedOutcomes,
    failureSignals: [
      "Vendor cannot demonstrate the requirement live",
      "Behavior depends on undocumented custom work",
      "Critical controls only exist on an unexpected plan",
      "Outcome cannot be verified by a second user/role",
    ],
    questions:
      profile.vendorQuestions.length > 0
        ? profile.vendorQuestions.slice(0, 7)
        : [
            `Which plan is required to satisfy ${profile.name}?`,
            "What cannot be configured without professional services?",
          ],
  });
}

export function formatRequirementDemoTestPlainText(
  test: RequirementDemoTest,
  requirementName: string,
): string {
  const lines = [
    `Vendor demo test: ${requirementName}`,
    "",
    "Objective",
    test.objective,
    "",
  ];
  if (test.preconditions.length) {
    lines.push("Preconditions", ...test.preconditions.map((p) => `- ${p}`), "");
  }
  lines.push(
    "Ask the vendor to demonstrate",
    ...test.steps.map((s, i) => `${i + 1}. ${s}`),
    "",
    "What good support looks like",
    ...test.expectedOutcomes.map((o) => `✓ ${o}`),
    "",
  );
  if (test.failureSignals.length) {
    lines.push(
      "Failure signals",
      ...test.failureSignals.map((f) => `• ${f}`),
      "",
    );
  }
  if (test.questions.length) {
    lines.push(
      "Follow-up questions",
      ...test.questions.map((q) => `- ${q}`),
      "",
    );
  }
  lines.push(
    "Note: Official vendor videos are examples only — they do not replace your live demo.",
  );
  return lines.join("\n");
}

export { DEMO_TESTS as REQUIREMENT_DEMO_TEST_CATALOG };
