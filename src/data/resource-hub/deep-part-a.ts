import type { ResourceHubProfile } from "@/domain";
import { crmVendorScorecardDepth } from "./crm-vendor-scorecard";
import { crmRfpTemplateDepth } from "./crm-rfp-template";

type Depth = Partial<
  Omit<ResourceHubProfile, "resourceSlug">
>;

/**
 * Depth layer (part A) for CRM Choose-stage downloadable resources.
 * Educational / operational — no invented rankings, prices, or product endorsements.
 */
export const resourceDepthPartA: Record<string, Depth> = {
  "crm-evaluation-checklist": {
    displayTitle: "CRM Evaluation Checklist",
    badgeLabel: "Resource",
    toolkitLabel: "CRM Evaluation Toolkit",
    tagline:
      "Evaluate every CRM against the same real-world tests.",
    heroExplanation:
      "Run this checklist during vendor demos and trials to verify workflow, email/calendar, reporting, administration, and commercial fit — then transfer results to your Vendor Scorecard.",
    overview:
      "A focused evaluation artifact for shortlisted CRMs. Use identical scenarios on every product, capture evidence (not slide promises), and mark Pass / Partial / Fail / Not tested. Requirements definition, weighted scoring, deep security diligence, and implementation handoff live in related resources — not here.",
    whoThisIsFor:
      "CRM buying teams running demos or trials after requirements and a shortlist exist. Best for ops leads, founders, and cross-functional evaluators who need a fair bar across vendors.",
    whatMattersIntro:
      "Prioritize observed workflow fit, email/calendar reality, reporting you can open in trial, admin effort, and edition/seat gates. Score vendors separately on the Vendor Scorecard.",
    howToUse:
      "Complete requirements first. Shortlist with CRM Finder or your own list. Run the same checks in every demo or trial. Capture screenshots or docs as evidence. Transfer outcomes to the Vendor Scorecard. Decide with fit, risk, and cost together.",
    workedExampleStructured: {
      title: "Worked example",
      requirement:
        "Reps must log Gmail activity to the contact/deal record without admin help.",
      vendors: [
        {
          name: "Vendor A",
          result: "PASS",
          note: "Non-admin logged sent mail to the deal timeline during trial.",
        },
        {
          name: "Vendor B",
          result: "PARTIAL",
          note: "Logging available only on a higher edition than the quoted plan.",
        },
      ],
      evidence: "Trial observation + vendor edition documentation.",
      disclaimer:
        "Hypothetical Vendor A / Vendor B scenario for teaching the artifact — not a SoftwareGlimpse case study.",
    },
    glance: {
      primaryGoal: "Same evidence-based checks for every shortlisted CRM",
      typicalTeam: "CRM buying teams",
      commonPriorities: [
        "Workflow fit",
        "Email & calendar",
        "Reporting",
        "Security & admin",
        "Commercial fit",
        "Evidence capture",
      ],
    },
    whatsInside: [
      {
        id: "workflow",
        title: "Workflow fit",
        description:
          "Verify pipeline, contacts, activities, and daily sales workflows.",
        icon: "workflow",
      },
      {
        id: "adoption",
        title: "User adoption",
        description:
          "Test navigation, data entry burden, mobile, and learning curve.",
        icon: "users",
      },
      {
        id: "comms",
        title: "Email & calendar",
        description:
          "Confirm sync direction, meeting logging, and non-admin usability.",
        icon: "mail",
      },
      {
        id: "automation",
        title: "Automation",
        description:
          "Check assignment, workflows, notifications, and routing where needed.",
        icon: "zap",
      },
      {
        id: "reporting",
        title: "Reporting",
        description:
          "Validate pipeline visibility, dashboards, and forecasting options.",
        icon: "chart",
      },
      {
        id: "integrations",
        title: "Integrations",
        description:
          "Smoke-test critical integrations, API/webhooks, and sync reliability.",
        icon: "plug",
      },
      {
        id: "security-admin",
        title: "Security & admin",
        description:
          "Light gates on roles, SSO need, auditability, and admin effort.",
        icon: "shield",
      },
      {
        id: "commercial",
        title: "Commercial fit",
        description:
          "Confirm editions, seats, add-ons, and limits against must-haves.",
        icon: "tag",
      },
    ],
    evidenceRules: {
      countsAs: [
        "Observed in trial or buyer-led demo",
        "Official product documentation",
        "Written vendor response",
        "Pricing or edition confirmation in writing",
      ],
      doesNotCount: [
        "Sales slide alone",
        "Marketplace logo alone",
        "Roadmap promises",
        "Assumptions without a test",
      ],
    },
    challenges: [],
    outcomes: [
      {
        id: "comparable",
        title: "Comparable evidence",
        description:
          "Every shortlisted CRM faces the same checks and result scale.",
      },
      {
        id: "proof",
        title: "Proof over promises",
        description:
          "Pass / Partial / Fail only when evidence exists; otherwise Not tested.",
      },
      {
        id: "handoff-score",
        title: "Clean scorecard handoff",
        description:
          "Results transfer into the Vendor Scorecard without rewriting criteria.",
      },
    ],
    priorities: [],
    workflowSteps: [
      {
        id: "define",
        label: "Define",
        detail:
          "Confirm must-haves and your process/stage model in the Requirements resource first.",
      },
      {
        id: "shortlist",
        label: "Shortlist",
        detail: "Use CRM Finder or your existing longlist — typically 2–4 vendors.",
      },
      {
        id: "run-checks",
        label: "Run the same checks",
        detail: "Use identical scenarios in every demo or trial.",
      },
      {
        id: "evidence",
        label: "Capture evidence",
        detail: "Log screenshots, docs, and vendor answers as proof.",
      },
      {
        id: "score",
        label: "Score separately",
        detail: "Transfer results to the Vendor Scorecard for weighted scoring.",
      },
      {
        id: "decide",
        label: "Make the decision",
        detail: "Compare fit, risk, and cost with confidence.",
      },
    ],
    artifactSections: [
      {
        id: "core-workflow",
        title: "1. Core workflow fit",
        accent: "green",
        intro:
          "Confirm the CRM can run your day-to-day sales process on contacts, deals, stages, ownership, and activities.",
        items: [
          {
            id: "1.1",
            label: "Pipeline stage model matches our process",
            whyItMatters: "Ensures comparable sales workflow across vendors.",
            required: true,
            testScenario:
              "Create a deal and move it through your named stages; confirm entry/exit rules can be represented.",
            detail: "Stages map to your written process — not the vendor’s default board.",
            doneWhen: "Stages demonstrated against your model with notes.",
          },
          {
            id: "1.2",
            label: "Owner + next-step rules enforceable",
            whyItMatters: "Prevents unowned deals and stale pipeline.",
            required: true,
            testScenario:
              "Assign owner and dated next step; attempt to leave a deal without both if your process requires them.",
            detail: "Ownership and next action are visible and enforceable.",
          },
          {
            id: "1.3",
            label: "Required fields on objects",
            whyItMatters: "Data quality and reporting accuracy.",
            required: true,
            testScenario:
              "Create contact/account/deal with your required fields; confirm enforcement without blocking legitimate entry.",
            detail: "Required fields match your shortlist of must-requireds.",
          },
          {
            id: "1.4",
            label: "Activity logging (from email/calendar or manual)",
            whyItMatters: "Real-world daily adoption depends on easy activity capture.",
            required: true,
            testScenario:
              "As a non-admin, log an email/call/note on a contact and related deal.",
            detail: "Activities attach to the right records without admin help.",
          },
          {
            id: "1.5",
            label: "Mobile access covers day-to-day work",
            whyItMatters: "Field usage and adoption outside the desk.",
            required: false,
            testScenario:
              "Update stage, owner, and log an activity from mobile if mobile is in scope.",
            detail: "Mark Not tested if mobile is explicitly out of scope.",
          },
        ],
      },
      {
        id: "ux-adoption",
        title: "2. User experience & adoption",
        accent: "teal",
        intro: "Sellers must complete core tasks without a full-time admin beside them.",
        items: [
          {
            id: "2.1",
            label: "Daily rep workflow is tolerable",
            whyItMatters: "Adoption fails when data entry dominates selling time.",
            required: true,
            testScenario:
              "Time a non-admin creating a contact, deal, next step, and activity.",
            detail: "Capture time-to-task notes; compare vendors on the same script.",
          },
          {
            id: "2.2",
            label: "Navigation & search find records quickly",
            whyItMatters: "Lost records kill trust in the system of record.",
            required: true,
            testScenario: "Find a contact and open related deals/activities in under a minute.",
          },
          {
            id: "2.3",
            label: "Learning curve acceptable for target roles",
            whyItMatters: "Training cost and time-to-productivity.",
            required: false,
            testScenario:
              "Have a first-time user complete the shared script with only a short walkthrough.",
          },
        ],
      },
      {
        id: "email-calendar",
        title: "3. Communication (email & calendar)",
        accent: "blue",
        intro: "Treat inbox and calendar reality as first-class evaluation — marketplace logos do not count.",
        items: [
          {
            id: "3.1",
            label: "Email sync direction meets requirement",
            whyItMatters: "Keeps inbox and CRM in alignment.",
            required: true,
            testScenario:
              "Configure or observe logging/sync for a non-admin mailbox; confirm direction matches your requirement.",
          },
          {
            id: "3.2",
            label: "Calendar / meeting logging works",
            whyItMatters: "Meetings appear on records without manual copy-paste.",
            required: false,
            testScenario:
              "Associate a meeting with a contact/deal and confirm it appears on the timeline.",
          },
          {
            id: "3.3",
            label: "Non-admin email/calendar test completed",
            whyItMatters: "Proves real-world usability for sellers.",
            required: true,
            testScenario:
              "Seller (not admin) completes the email/calendar smoke test and files evidence.",
          },
        ],
      },
      {
        id: "automation",
        title: "4. Automation",
        accent: "indigo",
        intro: "Only test automations that map to written must-haves for day one.",
        items: [
          {
            id: "4.1",
            label: "Assignment / ownership automation available",
            whyItMatters: "Reduces manual routing errors.",
            required: false,
            testScenario:
              "Trigger a simple assignment rule for inbound lead or new deal if in scope.",
          },
          {
            id: "4.2",
            label: "Workflow / notification for stuck deals",
            whyItMatters: "Keeps pipeline hygiene without constant manager chasing.",
            required: false,
            testScenario:
              "Create or review a notification when next step is overdue (or document edition gate).",
          },
          {
            id: "4.3",
            label: "Lead routing (if high-volume inbound)",
            whyItMatters: "Fair, maintainable ownership for inbound volume.",
            required: false,
            testScenario:
              "Assign an inbound contact via rules/queues your team can maintain — or mark N/A.",
          },
        ],
      },
      {
        id: "reporting",
        title: "5. Reporting & forecasting",
        accent: "purple",
        intro: "Weekly boards and forecast views must be testable in trial — not promised later.",
        items: [
          {
            id: "5.1",
            label: "Pipeline visibility & dashboards",
            whyItMatters: "Team can see status and risk at a glance.",
            required: true,
            testScenario:
              "Open a pipeline board/dashboard; filter by owner; identify a stuck deal.",
          },
          {
            id: "5.2",
            label: "Forecast accuracy options available",
            whyItMatters: "Supports reliable forecasts at multiple levels.",
            required: false,
            testScenario:
              "Open forecast/commit view or document that it requires a higher edition.",
          },
          {
            id: "5.3",
            label: "Custom reports build cleanly",
            whyItMatters: "Answers unique business questions without export gymnastics.",
            required: false,
            testScenario:
              "Build or edit one report matching a real weekly question your team asks.",
          },
        ],
      },
      {
        id: "integrations",
        title: "6. Integrations & extensibility",
        accent: "cyan",
        intro: "Smoke-test only integrations that are day-one must-haves.",
        items: [
          {
            id: "6.1",
            label: "Critical integrations smoke-tested",
            whyItMatters: "Broken sync becomes operational debt immediately.",
            required: true,
            testScenario:
              "Connect or trial each must-have integration; note sync direction and failure modes.",
          },
          {
            id: "6.2",
            label: "API / webhooks available if required",
            whyItMatters: "Custom or middleware needs must be possible.",
            required: false,
            testScenario:
              "Confirm API/webhook availability on the quoted edition (docs or written answer).",
          },
          {
            id: "6.3",
            label: "Marketplace / extensibility for known gaps",
            whyItMatters: "Known gaps need a credible path — not logo wallpaper.",
            required: false,
            testScenario:
              "For each known gap, identify a native feature, app, or integration path with evidence.",
          },
        ],
      },
      {
        id: "security-admin",
        title: "7. Security & administration (light gates)",
        accent: "slate",
        intro:
          "Light evaluation gates only. Deep diligence belongs on the CRM Security Checklist.",
        items: [
          {
            id: "7.1",
            label: "Roles & permissions cover seller vs admin",
            whyItMatters: "Least privilege and safe seller workflows.",
            required: true,
            testScenario:
              "Confirm a seller cannot perform admin-only actions; admin can manage users/fields.",
          },
          {
            id: "7.2",
            label: "SSO need confirmed (day-one or deferred)",
            whyItMatters: "Identity requirements can block rollout.",
            required: false,
            testScenario:
              "Document SSO availability on quoted edition — or explicit deferral with owner.",
          },
          {
            id: "7.3",
            label: "Admin effort estimate discussed",
            whyItMatters: "Ongoing ownership cost is part of fit.",
            required: true,
            testScenario:
              "Ask who owns users, fields, stages, and weekly hygiene; note hours/week estimate.",
          },
        ],
      },
      {
        id: "data-portability",
        title: "8. Data & portability",
        accent: "amber",
        intro: "Confirm you can get data in and out without locking the business.",
        items: [
          {
            id: "8.1",
            label: "Import path for contacts/deals works",
            whyItMatters: "Trial realism and migration risk.",
            required: true,
            testScenario:
              "Import a small sample pack or document native import limits.",
          },
          {
            id: "8.2",
            label: "Export of contacts, deals, and activities confirmed",
            whyItMatters: "Exit option and audit readiness.",
            required: true,
            testScenario:
              "Confirm export formats/completeness in docs or written vendor answer.",
          },
          {
            id: "8.3",
            label: "Custom fields & duplicate handling adequate",
            whyItMatters: "Data model flexibility without chaos.",
            required: false,
            testScenario:
              "Add a custom field; review duplicate merge/detect options if in scope.",
          },
        ],
      },
      {
        id: "commercial-fit",
        title: "9. Commercial fit",
        accent: "rose",
        intro:
          "Must-haves locked behind unaffordable editions are fails — do not average them away.",
        items: [
          {
            id: "9.1",
            label: "Required edition covers must-haves",
            whyItMatters: "Edition locks are hard gates.",
            required: true,
            testScenario:
              "Map each must-have to base vs higher edition vs add-on; fail if unaffordable.",
          },
          {
            id: "9.2",
            label: "Seat / license model understood",
            whyItMatters: "Who needs a paid seat vs lighter access.",
            required: true,
            testScenario:
              "Document seat types required for sellers, managers, and viewers.",
          },
          {
            id: "9.3",
            label: "Add-ons and usage limits noted",
            whyItMatters: "Hidden costs and caps change true fit.",
            required: false,
            testScenario:
              "List add-ons and limits that affect day-one must-haves (automation, storage, sync).",
          },
        ],
      },
      {
        id: "evidence-outcome",
        title: "10. Evidence & outcome",
        accent: "navy",
        intro: "Close each vendor session with an explicit outcome before the next demo.",
        items: [
          {
            id: "10.1",
            label: "Evidence filed for every Pass/Partial/Fail",
            whyItMatters: "Results without proof are not comparable.",
            required: true,
            testScenario:
              "Attach screenshot, doc link, or written confirmation for each non–Not-tested result.",
          },
          {
            id: "10.2",
            label: "Same-day result capture completed",
            whyItMatters: "Memory fades; bias grows overnight.",
            required: true,
            testScenario:
              "Fill Pass/Partial/Fail/Not tested before the next vendor session.",
          },
          {
            id: "10.3",
            label: "Follow-ups and transfer to scorecard listed",
            whyItMatters: "Open questions must not vanish into Slack.",
            required: true,
            testScenario:
              "List follow-ups; copy outcomes into Vendor Scorecard criteria notes.",
          },
        ],
      },
    ],
    downloadFiles: [
      {
        href: "/resources/crm-evaluation-checklist.md",
        label: "Download Markdown",
        format: "md",
      },
    ],
    faq: [
      {
        question: "Do we still need a requirements checklist?",
        answer:
          "Yes. Define must-haves and your process model in the CRM Requirements Template first. This evaluation checklist assumes that work is done so demos stay comparable.",
      },
      {
        question: "Should we run every row for every vendor?",
        answer:
          "Run every required row. Mark nice-to-haves Not tested only with an explicit reason. Niche or automation rows that do not apply can be Not tested / N/A — do not invent a Pass.",
      },
      {
        question: "How is this different from the Vendor Scorecard?",
        answer:
          "This checklist captures Pass/Partial/Fail evidence during demos and trials. The Vendor Scorecard applies weights and compares vendors numerically. Use checklist first, scorecard next.",
      },
      {
        question: "Where does deep security diligence go?",
        answer:
          "Light gates (roles, SSO need, admin effort) stay here. Deep SSO, export controls, and access-review work belongs on the CRM Security Checklist.",
      },
      {
        question: "What counts as evidence?",
        answer:
          "Observed trial/demo behavior, official docs, written vendor answers, or written edition/pricing confirmation. Sales slides, marketplace logos, roadmaps, and assumptions do not count.",
      },
      {
        question: "Can we change the checklist mid-evaluation?",
        answer:
          "Only with explicit team agreement and a note on what changed. Silent criteria changes destroy comparable results.",
      },
      {
        question: "What if a vendor will not follow our script?",
        answer:
          "Score only what you verified, mark the rest Not tested, and treat refusal as a signal. Buyer-led scenarios are how evaluations stay fair.",
      },
    ],
    heroVisual: {
      src: "/resources/crm-evaluation-checklist-hero.png",
      alt: "Preview of the CRM Evaluation Checklist spreadsheet with check items, why it matters, required flags, evidence, and Pass/Partial/Fail results.",
      caption:
        "Same checks, evidence columns, and Pass / Partial / Fail for every vendor.",
    },
    needsVisual: {
      src: "/resources/crm-evaluation-checklist-needs.png",
      alt: "What’s inside the CRM Evaluation Checklist: workflow, adoption, email, automation, reporting, integrations, security/admin, commercial fit.",
      caption: "Focused evaluation categories — not a full buying workbook.",
    },
    workflowVisual: {
      src: "/resources/crm-evaluation-checklist-workflow.png",
      alt: "How to use: define requirements, shortlist, run the same checks, capture evidence, score on Vendor Scorecard, decide.",
      caption: "Evaluation sits between requirements and weighted scoring.",
    },
    relatedResourceSlugs: [
      "crm-requirements-template",
      "crm-demo-checklist",
      "crm-vendor-scorecard",
      "crm-security-checklist",
      "crm-business-case-template",
    ],
    useBefore: ["crm-requirements-template"],
    useWith: ["crm-demo-checklist", "crm-vendor-scorecard"],
    useNext: [
      "crm-vendor-scorecard",
      "crm-comparison-worksheet",
      "crm-business-case-template",
    ],
    journeySlugs: [
      "crm-requirements-template",
      "crm-evaluation-checklist",
      "crm-vendor-scorecard",
      "crm-business-case-template",
      "crm-implementation-checklist",
    ],
    featuredGuideHrefs: [
      "/guides/crm-evaluation-guide/",
      "/guides/how-to-choose-crm/",
      "/guides/crm-selection-process/",
    ],
    relatedToolHrefs: [
      { href: "/tools/crm-finder/", label: "CRM Finder" },
      {
        href: "/tools/crm-vendor-scorecard/",
        label: "Vendor Scorecard tool",
      },
      {
        href: "/tools/crm-requirements-builder/?start=1",
        label: "Requirements Builder",
      },
      { href: "/tools/crm-cost-calculator/", label: "CRM Cost Calculator" },
    ],
    primaryCta: {
      href: "/resources/crm-evaluation-checklist.xlsx",
      label: "Download Excel (Editable spreadsheet)",
    },
    secondaryCta: {
      href: "/resources/crm-evaluation-checklist.pdf",
      label: "Download PDF (Printable version)",
    },
    categorySlug: "crm",
    lastReviewedAt: "2026-08-15",
  },

  "crm-requirements-template": {
    displayTitle: "CRM Requirements Template",
    badgeLabel: "Template",
    toolkitLabel: "CRM Evaluation Toolkit",
    tagline: "Define what your CRM must do before you shortlist.",
    heroExplanation:
      "Fill this template with your pipeline model, must / should / nice priorities, hard constraints, and one acceptance check per must-have — then freeze it so every later demo and score uses the same bar.",
    overview:
      "A definition artifact for the stage before shortlisting. Describe how you run contacts, accounts, deals, stages, and activities; tag each need must / should / nice; and write an acceptance check a non-admin can attempt in a trial. Vendor testing, weighted scoring, and deep security diligence live in related resources — not here.",
    whoThisIsFor:
      "Ops leads, founders, and buying leads who need one agreed requirements sheet before CRM Finder shortlists or vendor calls begin.",
    whatMattersIntro:
      "Prioritize a written stage model, a capped must-have list, real constraints (email sync, seats/editions, admin capacity, export), and acceptance checks. Vendors get tested and scored later.",
    howToUse:
      "Capture context and your stage model. Write capability rows for contacts, deals, activities, email/calendar, reporting, and seats. Add constraints, integrations, and data sources. Give every must-have an acceptance check. Freeze and sign off, then hand the sheet to the Evaluation Checklist and Vendor Scorecard.",
    workedExampleStructured: {
      title: "Worked example",
      requirement:
        "Draft requirement: “Reps log email activity to the contact and deal record without admin help.”",
      vendors: [
        {
          name: "Team A draft",
          result: "PASS",
          note: "Tagged must-have, owner named, acceptance check written: a non-admin logs a sent email to a deal timeline during trial.",
        },
        {
          name: "Team B draft",
          result: "FAIL",
          note: "Row reads “email integration” with no priority, owner, or acceptance check — nothing a demo can test.",
        },
      ],
      evidence: "Requirements row review before freeze.",
      disclaimer:
        "Hypothetical Team A / Team B drafting scenario for teaching the artifact — not a SoftwareGlimpse case study.",
    },
    glance: {
      primaryGoal: "Testable CRM requirements agreed before shortlisting",
      typicalTeam: "Ops, founders, sales leads, and IT stakeholders",
      commonPriorities: [
        "Stage & ownership model",
        "Email & calendar needs",
        "Reporting & forecast views",
        "Seats, editions & admin capacity",
        "Export & integrations",
        "Acceptance checks",
      ],
    },
    whatsInside: [
      {
        id: "context",
        title: "Buying context",
        description:
          "Team, motion, current systems holding contacts and deals, and what is out of scope.",
        icon: "target",
      },
      {
        id: "stage-model",
        title: "Stage & ownership model",
        description:
          "Your pipeline stages, entry/exit checkpoints, owner and next-step rules.",
        icon: "workflow",
      },
      {
        id: "capability-rows",
        title: "Capability rows",
        description:
          "Contacts, deals, activities, views, and seats written as needs — not feature names.",
        icon: "list",
      },
      {
        id: "comms",
        title: "Email & calendar needs",
        description:
          "Logging versus sync direction, and who needs it on day one.",
        icon: "mail",
      },
      {
        id: "reporting-seats",
        title: "Reporting, seats & admin",
        description:
          "Weekly views, forecast needs, suspected edition gates, and admin capacity.",
        icon: "chart",
      },
      {
        id: "constraints",
        title: "Constraints & data",
        description:
          "Integrations, import sources, export requirement, and your real security baseline.",
        icon: "shield",
      },
      {
        id: "acceptance",
        title: "Acceptance checks",
        description:
          "One trial-attemptable check per must-have so demos can verify it.",
        icon: "check",
      },
      {
        id: "freeze",
        title: "Freeze & change control",
        description:
          "Priority tags, must-have cap, parking lot, sign-off date, and change log.",
        icon: "lock",
      },
    ],
    evidenceRules: {
      countsAs: [
        "A need expressed on contacts, deals, stages, activities, views, or seats",
        "Something a non-admin can attempt in a trial",
        "A constraint with a named owner",
        "A row the committee signed off in writing",
      ],
      doesNotCount: [
        "A vendor feature name with no acceptance check",
        "A wish added mid-demo without change control",
        "Everything tagged must-have",
        "A need that only works on a future roadmap date",
      ],
    },
    challenges: [],
    priorities: [],
    outcomes: [
      {
        id: "one-bar",
        title: "One agreed bar",
        description:
          "Sales, ops, and IT argue before demos rather than during them.",
      },
      {
        id: "testable",
        title: "Testable must-haves",
        description:
          "Every must-have names something a non-admin can attempt in a trial.",
      },
      {
        id: "clean-handoff",
        title: "Clean handoff",
        description:
          "The frozen sheet feeds the Evaluation Checklist and scorecard weights without rework.",
      },
    ],
    workflowSteps: [
      {
        id: "context",
        label: "Capture context",
        detail:
          "Team, motion, systems holding contacts and deals today, and what is out of scope.",
      },
      {
        id: "stage-model",
        label: "Write the stage model",
        detail:
          "Name your stages, entry/exit checkpoints, and owner plus next-step rules.",
      },
      {
        id: "capabilities",
        label: "List capability rows",
        detail:
          "Contacts, activities, email/calendar, reporting, and seats — each tagged must / should / nice.",
      },
      {
        id: "constraints",
        label: "Add constraints & data",
        detail:
          "Integrations, import sources, export requirement, admin capacity, and security baseline.",
      },
      {
        id: "acceptance",
        label: "Write acceptance checks",
        detail:
          "Give each must-have a check a non-admin can attempt in a trial or demo.",
      },
      {
        id: "freeze",
        label: "Freeze & hand off",
        detail:
          "Cap the must-haves, sign and date the sheet, then pass it to evaluation and scoring.",
      },
    ],
    artifactSections: [
      {
        id: "context-scope",
        title: "1. Buying context & scope",
        accent: "green",
        intro:
          "Orient every later row around how you sell and where contacts and deals live today. Keep it short enough to read aloud.",
        items: [
          {
            id: "1.1",
            label: "Team, motion, and objects in scope",
            whyItMatters:
              "Every later row depends on how you sell and which CRM objects are day one.",
            required: true,
            testScenario:
              "Acceptance: one short paragraph naming team size, sales motion, and whether accounts and post-sale records are in scope.",
            detail:
              "Objects usually means contacts, accounts, deals/opportunities, and activities.",
            owner: "Sponsor",
            doneWhen: "Paragraph agreed by sales, ops, and IT.",
          },
          {
            id: "1.2",
            label: "Where contacts and deals live today",
            whyItMatters:
              "Migration effort and import risk come from your current systems, not the new one.",
            required: true,
            testScenario:
              "Acceptance: list every system holding contacts, deals, or activities today, with its owner.",
            detail: "Inbox, spreadsheets, legacy CRM, helpdesk, invoicing tools.",
            owner: "Ops",
            doneWhen: "System list complete with named owners.",
          },
          {
            id: "1.3",
            label: "Top three operational pains",
            whyItMatters:
              "Keeps requirements tied to problems instead of feature envy.",
            required: true,
            testScenario:
              "Acceptance: three pains stated as behaviours — unowned deals, missing next steps, no weekly view.",
            owner: "Sales + ops",
            doneWhen: "Committee can recite all three without the document.",
          },
          {
            id: "1.4",
            label: "Explicit out of scope for phase one",
            whyItMatters:
              "Prevents demo scope creep into marketing automation or custom objects.",
            required: false,
            testScenario:
              "Acceptance: written list of what this purchase will not solve in the first 90 days.",
            owner: "Sponsor",
            doneWhen: "Out-of-scope list attached to the sheet.",
          },
        ],
      },
      {
        id: "pipeline-ownership",
        title: "2. Pipeline, stages & ownership",
        accent: "blue",
        intro:
          "Define how deals move before you watch anyone else’s board. This section is the spine of every later test.",
        items: [
          {
            id: "2.1",
            label: "Pipeline stage model written down",
            whyItMatters:
              "Stages are the spine of every later demo test and scorecard row.",
            required: true,
            testScenario:
              "Acceptance: name each stage and its entry/exit checkpoint before you see a vendor board.",
            detail: "Describe how you sell — do not copy a vendor default pipeline.",
            owner: "Sales lead",
            doneWhen: "Stage list matches how the team actually sells.",
          },
          {
            id: "2.2",
            label: "Owner and dated next step on open deals",
            whyItMatters:
              "Unowned deals and missing next steps are the most common CRM failure.",
            required: true,
            testScenario:
              "Acceptance: state whether owner and next step must be enforced, prompted, or optional.",
            owner: "Sales lead",
            doneWhen: "Rule written with a priority tag.",
          },
          {
            id: "2.3",
            label: "Required deal fields kept short",
            whyItMatters:
              "Long required-field lists get bypassed and wreck reporting.",
            required: true,
            testScenario:
              "Acceptance: list required versus optional deal fields — amount, close date, stage, source.",
            owner: "Ops",
            doneWhen: "Required list is short enough that reps will complete it.",
          },
          {
            id: "2.4",
            label: "Multiple pipelines or motions",
            whyItMatters:
              "Independent stage sets change which editions and products qualify.",
            required: false,
            testScenario:
              "Acceptance: mark must only if motions genuinely need separate stages; otherwise should, nice, or N/A.",
            detail:
              "Examples: agency client delivery pipelines alongside new business.",
            owner: "Sales ops",
            doneWhen: "Priority tagged with a written reason.",
          },
          {
            id: "2.5",
            label: "Won-deal and renewal handoff",
            whyItMatters:
              "Post-sale scope is where phase-one budgets quietly double.",
            required: false,
            testScenario:
              "Acceptance: state whether won deals become accounts or renewals in phase one, or later.",
            owner: "CS / AM lead",
            doneWhen: "In scope with a priority, or explicitly deferred.",
          },
        ],
      },
      {
        id: "contacts-activities",
        title: "3. Contacts, activities & email/calendar",
        accent: "teal",
        intro:
          "Activity on the record beats private inboxes. Write these rows so a seller — not an admin — can verify them.",
        items: [
          {
            id: "3.1",
            label: "Contact and account data you will maintain",
            whyItMatters:
              "A taxonomy nobody maintains produces reports nobody trusts.",
            required: true,
            testScenario:
              "Acceptance: list required contact fields and when contacts roll up to accounts.",
            owner: "Ops",
            doneWhen: "Required versus optional fields listed.",
          },
          {
            id: "3.2",
            label: "Activity logging expectations",
            whyItMatters:
              "Activity on the record is what makes the CRM the system of record.",
            required: true,
            testScenario:
              "Acceptance: state which activities — calls, notes, tasks, emails — must attach to contacts and deals.",
            owner: "Sales lead",
            doneWhen: "Activity list tagged must / should / nice.",
          },
          {
            id: "3.3",
            label: "Email and calendar requirement stated precisely",
            whyItMatters:
              "“Email integration” means very different things per product and edition.",
            required: true,
            testScenario:
              "Acceptance: write whether you need manual logging, one-way sync, or two-way sync — and for which users.",
            detail:
              "Name the mail platform so demos test the real thing rather than a generic connector.",
            owner: "Ops / IT",
            doneWhen: "Sync direction and audience written down.",
          },
          {
            id: "3.4",
            label: "Mobile and inbound routing needs",
            whyItMatters:
              "Field updates and lead assignment are common hidden must-haves.",
            required: false,
            testScenario:
              "Acceptance: tag mobile activity updates and inbound assignment rules must / should / nice / N/A.",
            owner: "Sales ops",
            doneWhen: "Both rows tagged or marked not applicable.",
          },
        ],
      },
      {
        id: "reporting-seats-admin",
        title: "4. Reporting, seats & admin capacity",
        accent: "purple",
        intro:
          "Views and edition gates eliminate more vendors than missing nice-to-haves ever will.",
        items: [
          {
            id: "4.1",
            label: "Weekly review views you need",
            whyItMatters:
              "If the weekly board needs an export, the CRM is not doing its job.",
            required: true,
            testScenario:
              "Acceptance: name the views you must open without exporting — stage board, owner filter, deals missing next steps.",
            owner: "Ops",
            doneWhen: "View list written before demos.",
          },
          {
            id: "4.2",
            label: "Forecast or commit reporting need",
            whyItMatters:
              "Forecast features are often edition-locked and change the price band.",
            required: false,
            testScenario:
              "Acceptance: state whether you need open pipeline only, stage-weighted forecast, or commit categories.",
            owner: "Sales lead / finance",
            doneWhen: "Need tagged with a priority, not assumed.",
          },
          {
            id: "4.3",
            label: "Seat and edition constraints",
            whyItMatters:
              "A must-have on an edition you will not buy is a fail, not a detail.",
            required: true,
            testScenario:
              "Acceptance: list which must-haves you suspect are edition- or add-on-gated so demos confirm them.",
            owner: "Sponsor / ops",
            doneWhen: "Suspected gate list written before shortlisting.",
          },
          {
            id: "4.4",
            label: "Admin capacity constraint",
            whyItMatters:
              "Someone must own users, fields, stages, and hygiene every single week.",
            required: true,
            testScenario:
              "Acceptance: name the admin and the hours per week they actually have.",
            owner: "Sponsor",
            doneWhen: "Named person and hours recorded on the sheet.",
          },
        ],
      },
      {
        id: "constraints-data",
        title: "5. Constraints, integrations & data",
        accent: "amber",
        intro:
          "Constraints here often eliminate vendors before a demo is booked. Write them as needs, not wishes.",
        items: [
          {
            id: "5.1",
            label: "Integrations that must work on day one",
            whyItMatters:
              "Day-one integrations eliminate options faster than missing features.",
            required: true,
            testScenario:
              "Acceptance: name each system, the direction of sync, and whether it is day one or phase two.",
            owner: "Ops",
            doneWhen: "Each integration has a priority and an owner.",
          },
          {
            id: "5.2",
            label: "Import sources and known data mess",
            whyItMatters:
              "Import realism decides whether go-live slips by a week or a quarter.",
            required: true,
            testScenario:
              "Acceptance: list source files and systems plus the known duplicate or formatting problems.",
            owner: "Ops",
            doneWhen: "Source list plus a named cleanup owner.",
          },
          {
            id: "5.3",
            label: "Export and exit requirement",
            whyItMatters:
              "You should be able to leave with contacts, deals, and activity history.",
            required: true,
            testScenario:
              "Acceptance: state what must be exportable and in what shape, so vendors can answer it in writing later.",
            owner: "Ops",
            doneWhen: "Export written as a must-have row.",
          },
          {
            id: "5.4",
            label: "Security baseline you truly require",
            whyItMatters:
              "Over-asking stalls the buy; under-asking blocks rollout at the last minute.",
            required: false,
            testScenario:
              "Acceptance: list only hard identity, access, or residency requirements — send deeper diligence to the CRM Security Checklist.",
            owner: "IT / security",
            doneWhen: "Hard constraints separated from nice-to-have controls.",
          },
          {
            id: "5.5",
            label: "Budget posture without invented totals",
            whyItMatters:
              "Cost clarity is a requirement; a made-up total cost of ownership is not.",
            required: false,
            testScenario:
              "Acceptance: write the seat range, edition tolerance, and what cost breakdown you need in vendor quotes.",
            owner: "Sponsor",
            doneWhen: "Posture paragraph written; no invented pricing.",
          },
        ],
      },
      {
        id: "priority-freeze",
        title: "6. Priority, acceptance & freeze",
        accent: "navy",
        intro:
          "This section is what makes the sheet usable downstream. Skip it and demos will renegotiate your requirements for you.",
        items: [
          {
            id: "6.1",
            label: "Every row tagged must / should / nice",
            whyItMatters:
              "Untagged rows become silent must-haves during demos.",
            required: true,
            testScenario:
              "Acceptance: no capability row is left without a priority tag.",
            owner: "Ops lead",
            doneWhen: "Priority column complete.",
          },
          {
            id: "6.2",
            label: "Must-have count capped",
            whyItMatters:
              "If everything is a must, no vendor can pass and no tradeoff is visible.",
            required: true,
            testScenario:
              "Acceptance: must-haves fit a one-page trial script across contacts, deals, activities, and views.",
            owner: "Committee",
            doneWhen: "Must list trimmed to fit the script.",
          },
          {
            id: "6.3",
            label: "Acceptance check written for every must-have",
            whyItMatters:
              "A must-have with no check cannot be tested in a demo or scored later.",
            required: true,
            testScenario:
              "Acceptance: each must-have names something a non-admin can attempt in a trial or buyer-led demo.",
            owner: "Ops",
            doneWhen: "No must-have is left without a check.",
          },
          {
            id: "6.4",
            label: "Parking lot created for deferred wishes",
            whyItMatters:
              "Good ideas need somewhere to live that is not the must-have column.",
            required: false,
            testScenario:
              "Acceptance: deferred items are listed separately with the reason for deferral.",
            owner: "Ops",
            doneWhen: "Parking lot section exists and is separate from the tables.",
          },
          {
            id: "6.5",
            label: "Sign-off and change log started",
            whyItMatters:
              "A frozen, dated sheet is what keeps later evaluations comparable.",
            required: true,
            testScenario:
              "Acceptance: sponsor, ops, and sales lead date the sheet; post-freeze edits require a logged reason.",
            owner: "Sponsor",
            doneWhen: "Signature date present and an empty change log exists.",
          },
        ],
      },
    ],
    downloadFiles: [
      {
        href: "/resources/crm-requirements-template.md",
        label: "Download Markdown",
        format: "md",
      },
    ],
    faq: [
      {
        question: "How detailed should requirements be before demos?",
        answer:
          "Detailed enough that a non-admin can attempt each must-have on contacts, deals, activities, or views — and no more. You are writing a testable bar, not designing your future CRM taxonomy.",
      },
      {
        question: "Must, should, or nice — how do we decide?",
        answer:
          "Must means the evaluation fails without it on day one, including capabilities locked to an edition you will not buy. Should means important but workable for 90 days. Nice means valuable later. If almost everything is a must, the tradeoffs are not finished.",
      },
      {
        question: "How is this different from the Evaluation Checklist?",
        answer:
          "This template defines what you need and how you will verify it. The Evaluation Checklist runs those verifications against each shortlisted CRM and records Pass, Partial, Fail, or Not tested.",
      },
      {
        question: "How does this relate to the Requirements Builder tool?",
        answer:
          "The interactive builder helps you assemble and prioritize needs quickly. This template is the durable, signable artifact for committees, RFPs, and handoffs. Use either entry point, but keep one canonical sheet.",
      },
      {
        question: "Should pricing be a requirement?",
        answer:
          "Capture budget posture and the cost breakdown you need from vendors. Do not write a total cost into the sheet before you have written quotes — seat models and edition gates change the answer.",
      },
      {
        question: "Where does deep security diligence go?",
        answer:
          "Keep only hard constraints here — required identity, access, or residency needs. Access reviews, export controls, and detailed diligence belong on the CRM Security Checklist.",
      },
      {
        question: "What if stakeholders add must-haves during demos?",
        answer:
          "Park them. Promote an item only with a dated change-control note. Silent must-have inflation is how evaluations stop being comparable.",
      },
    ],
    heroVisual: {
      src: "/resources/crm-requirements-template-hero.png",
      alt: "Preview of the CRM Requirements Template with capability rows, must / should / nice priorities, owners, and acceptance checks.",
      caption:
        "Priorities, constraints, and acceptance checks in one signable sheet.",
    },
    needsVisual: {
      src: "/resources/crm-requirements-template-needs.png",
      alt: "What’s inside the CRM Requirements Template: context, stage model, capability rows, email and calendar, reporting and seats, constraints, acceptance checks, freeze.",
      caption: "A definition artifact — vendor scoring happens elsewhere.",
    },
    workflowVisual: {
      src: "/resources/crm-requirements-template-workflow.png",
      alt: "How to use: capture context, write the stage model, list capabilities, add constraints, write acceptance checks, freeze and hand off.",
      caption: "Requirements sit before shortlisting and evaluation.",
    },
    relatedResourceSlugs: [
      "crm-evaluation-checklist",
      "crm-vendor-scorecard",
      "crm-rfp-template",
      "crm-security-checklist",
    ],
    useBefore: [],
    useWith: ["crm-evaluation-checklist"],
    useNext: [
      "crm-evaluation-checklist",
      "crm-demo-checklist",
      "crm-vendor-scorecard",
    ],
    journeySlugs: [
      "crm-requirements-template",
      "crm-evaluation-checklist",
      "crm-vendor-scorecard",
      "crm-business-case-template",
      "crm-implementation-checklist",
    ],
    featuredGuideHrefs: [
      "/guides/crm-requirements-guide/",
      "/guides/how-to-choose-crm/",
      "/guides/crm-evaluation-guide/",
    ],
    relatedToolHrefs: [
      {
        href: "/tools/crm-requirements-builder/?start=1",
        label: "Requirements Builder",
      },
      { href: "/tools/crm-finder/", label: "CRM Finder" },
      {
        href: "/tools/crm-vendor-scorecard/",
        label: "Vendor Scorecard tool",
      },
    ],
    primaryCta: {
      href: "/resources/crm-requirements-template.xlsx",
      label: "Download Excel (Editable spreadsheet)",
    },
    secondaryCta: {
      href: "/resources/crm-requirements-template.pdf",
      label: "Download PDF (Printable version)",
    },
    categorySlug: "crm",
    lastReviewedAt: "2026-08-15",
  },

  "crm-vendor-scorecard": crmVendorScorecardDepth,

  "crm-rfp-template": crmRfpTemplateDepth,
};
