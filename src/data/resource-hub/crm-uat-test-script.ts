import type { ResourceHubProfile } from "@/domain";

type Depth = Partial<Omit<ResourceHubProfile, "resourceSlug">>;

/**
 * CRM UAT test script worksheet — process already in testing/go-live guides.
 * No invented pass rates, vendor scores, or lab-testing claims.
 */
export const crmUatTestScriptDepth: Depth = {
  displayTitle: "CRM UAT Test Script Worksheet",
  badgeLabel: "UAT",
  toolkitLabel: "CRM Implementation Toolkit",
  tagline: "Script the same user-acceptance cases before go-live — not a second buying scorecard.",
  heroExplanation:
    "Turn testing and go-live guides into a reusable script: persona, starting data, steps, expected result, evidence, owner, and pass/fail. Same cases on every dry run.",
  overview:
    "This worksheet is for the week before cutover, when implementation and migration plans exist but testers still improvise. It captures role-based cases (rep, manager, admin), starting records, click-path, expected CRM state, evidence to attach, and a sign-off. It is not an evaluation checklist and not a vendor ranking. Pair it with the Go-Live Checklist for freeze/hypercare and the Implementation Planner for owners.",
  whoThisIsFor:
    "Implementation leads, CRM admins, sales managers nominated as UAT owners, and anyone who must sign that core workflows work in the target org before cutover.",
  whatMattersIntro:
    "UAT fails when each tester invents a different happy path. Write the cases once. Run them on a dry-run copy. Record Pass / Partial / Fail with a screenshot or record ID. Do not treat a vendor demo script as UAT.",
  howToUse:
    "Copy the cases that match your live workflows. Fill starting data from the migration sample, not production. Run each case twice: once as the role, once as the admin watching logs. Sign only the cases you actually executed. Failed cases become go-live blockers or known-issues, not silent waivers.",
  workedExampleStructured: {
    title: "Worked example",
    requirement: "Can a sales manager advance a migrated open deal and log a next step without losing owner or amount?",
    vendors: [
      {
        name: "Case 1 — Rep updates next step",
        result: "PASS",
        note: "Tester used a sample migrated deal, set a dated next step, and the board filter no longer showed it as missing action.",
      },
      {
        name: "Case 2 — Manager forecast view",
        result: "PARTIAL",
        note: "Amount and close date survived migration, but the custom forecast category was blank — logged as a mapping defect, not a UAT skip.",
      },
      {
        name: "Case 3 — Admin permission boundary",
        result: "FAIL",
        note: "A standard rep could export the full contact list. Blocker recorded against the Go-Live Checklist security line.",
      },
    ],
    evidence:
      "Hypothetical teaching run on a sandbox copy — not a SoftwareGlimpse lab test or a named vendor result.",
    disclaimer:
      "Example outcomes illustrate how to fill the worksheet. They are not product scores.",
  },
  glance: {
    primaryGoal: "The same UAT cases, evidence, and sign-off before CRM cutover",
    typicalTeam: "Implementation lead, role testers, CRM admin, go-live owner",
    commonPriorities: [
      "Role-based cases",
      "Starting data from migration sample",
      "Expected result + evidence",
      "Pass / Partial / Fail",
      "Blockers vs known issues",
    ],
  },
  whatsInside: [
    {
      id: "cover",
      title: "Cover & scope",
      description: "Org, CRM, sandbox vs production, freeze window, and who may sign.",
      icon: "file",
    },
    {
      id: "cases",
      title: "Role-based cases",
      description: "Rep, manager, and admin scripts with starting records and expected state.",
      icon: "list",
    },
    {
      id: "evidence",
      title: "Evidence rules",
      description: "What counts as Pass vs a screenshot of the wrong org.",
      icon: "shield",
    },
    {
      id: "signoff",
      title: "Sign-off log",
      description: "Owner, date, blockers, and known issues handed to go-live.",
      icon: "check",
    },
  ],
  evidenceRules: {
    countsAs: [
      "Named tester, role, and timestamp",
      "Record ID or screenshot from the UAT org",
      "Expected vs actual written in the same row",
    ],
    doesNotCount: [
      "Vendor demo recordings",
      "Admin-only clicks described as end-user UAT",
      "Pass marks with no evidence field",
    ],
  },
  challenges: [
    {
      id: "improvised",
      title: "Improvised click-paths",
      pain: "Each tester wanders a different happy path, so failures cannot be reproduced.",
      crmHelps: "A written starting record and expected state make the case rerunnable.",
    },
    {
      id: "prod-copy",
      title: "Testing in production",
      pain: "Live data is mutated or freeze windows are ignored.",
      crmHelps: "The cover block forces sandbox vs production and freeze notes before cases start.",
    },
  ],
  outcomes: [
    {
      id: "repeatable",
      title: "Repeatable cases",
      description: "The same scripts run on dry-run and cutover weekend.",
    },
    {
      id: "blockers",
      title: "Visible blockers",
      description: "Fails become go-live checklist items instead of hallway waivers.",
    },
  ],
  workflowSteps: [
    {
      id: "scope",
      label: "Scope the workflows that must work on day one",
      detail: "Pipeline update, next step, reporting view, permission boundary — not every feature.",
    },
    {
      id: "write",
      label: "Write cases from live jobs, not marketing tours",
      detail: "Persona, starting data, steps, expected CRM state, evidence.",
    },
    {
      id: "run",
      label: "Run on the dry-run copy",
      detail: "Record Pass / Partial / Fail with an owner. Failed cases are blockers or known issues.",
    },
    {
      id: "sign",
      label: "Sign only what you ran",
      detail: "Hand the log to the Go-Live Checklist owner before freeze.",
    },
  ],
  artifactSections: [
    {
      id: "cases",
      title: "Core UAT cases",
      intro: "Rewrite labels to match your objects. Do not invent vendor-specific scores.",
      items: [
        {
          id: "case-next-step",
          label: "Open deal next step",
          whyItMatters: "Pipeline reviews fail if migrated deals have no dated next action.",
          testScenario:
            "As a sales rep, open a sample migrated deal, set a dated next step, confirm it leaves the missing-action filter.",
          owner: "Rep tester",
          doneWhen: "Record ID + screenshot of the filter before/after.",
        },
        {
          id: "case-manager-view",
          label: "Manager coaching view",
          whyItMatters: "If the manager still exports to a sheet, UAT did not cover the ritual.",
          testScenario:
            "As a manager, open the weekly stuck-deal view on the UAT org and coach from it without a CSV.",
          owner: "Manager tester",
          doneWhen: "View URL + note that no export was required.",
        },
        {
          id: "case-permissions",
          label: "Rep cannot full-export",
          whyItMatters: "Cutover with an open export permission is a security go-live fail.",
          testScenario:
            "As a standard rep, attempt a full contact export and confirm it is blocked or approval-gated.",
          owner: "Admin tester",
          doneWhen: "Permission screenshot + actual result.",
        },
      ],
    },
  ],
  faq: [
    {
      question: "Is this a vendor evaluation scorecard?",
      answer:
        "No. Evaluation and demo checklists stay on the buy side. This worksheet only tests that your workflows work in the org you are about to go live on.",
    },
    {
      question: "Do I need a case for every feature?",
      answer:
        "No. Script the jobs that must work on Monday morning. Extra features belong in a later optimization pass.",
    },
    {
      question: "What if a case fails?",
      answer:
        "Record Fail, name the owner, and either block go-live or list it as a known issue on the Go-Live Checklist. Do not silently pass it.",
    },
  ],
  heroVisual: {
    src: "/resources/crm-uat-test-script-hero.png",
    alt: "CRM UAT worksheet showing role-based test cases, expected results, and sign-off",
    caption: "Script the same cases on every dry run — evidence required.",
  },
  needsVisual: {
    src: "/resources/crm-uat-test-script-needs.png",
    alt: "Diagram of improvised testing problems versus a shared UAT script",
    caption: "Improvised click-paths versus a written case with evidence.",
  },
  workflowVisual: {
    src: "/resources/crm-uat-test-script-workflow.png",
    alt: "Four-step UAT workflow: scope, write, run, sign",
    caption: "Scope → write → run on dry-run copy → sign what you ran.",
  },
  relatedResourceSlugs: [
    "crm-go-live-checklist",
    "crm-implementation-checklist",
    "crm-migration-checklist",
  ],
  useBefore: ["crm-implementation-checklist", "crm-migration-checklist"],
  useWith: ["crm-go-live-checklist"],
  useNext: ["crm-training-plan", "crm-optimization-checklist"],
  featuredGuideHrefs: [
    "/guides/crm-testing/",
    "/guides/crm-go-live/",
  ],
  relatedToolHrefs: [
    { href: "/tools/crm-implementation-planner/", label: "CRM Implementation Planner" },
    { href: "/tools/crm-migration-planner/", label: "CRM Migration Planner" },
  ],
  downloadFiles: [
    {
      href: "/resources/crm-uat-test-script.md",
      label: "Download Markdown",
      format: "md",
    },
    {
      href: "/resources/crm-uat-test-script.csv",
      label: "Download CSV case log",
      format: "csv",
    },
  ],
  primaryCta: {
    href: "/resources/crm-uat-test-script.md",
    label: "Download Markdown worksheet",
  },
  secondaryCta: {
    href: "/resources/crm-uat-test-script.csv",
    label: "Download CSV case log",
  },
  journeySlugs: [
    "crm-implementation-checklist",
    "crm-migration-checklist",
    "crm-uat-test-script",
    "crm-go-live-checklist",
    "crm-training-plan",
  ],
};
