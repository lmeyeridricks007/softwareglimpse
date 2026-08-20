import type { ResourceHubProfile } from "@/domain";
import { crmFieldMappingTemplateDepth } from "./crm-field-mapping-template";

type Depth = Partial<Omit<ResourceHubProfile, "resourceSlug">>;

/**
 * Depth layer (part C) for CRM resource hub pages (`/resources/[slug]/`).
 * Educational / operational — no invented rankings, prices, or product endorsements.
 */
export const resourceDepthPartC: Record<string, Depth> = {
  "crm-training-plan": {
    displayTitle: "CRM Training Plan",
    badgeLabel: "Planning pack",
    toolkitLabel: "CRM Rollout Toolkit",
    tagline: "Plan role-based CRM enablement before production seats open.",
    heroExplanation:
      "Build one short curriculum per role — AE, manager, admin, and CS — practice on sandbox accounts, contacts, and deals, then open each production seat as that person passes their own task list.",
    overview:
      "A role-based enablement plan for CRM rollout. Each audience gets its own curriculum, sandbox drill, pass criteria, and named signer, so “we trained everyone” becomes something you can check. This plan covers who learns what, how they practice, and when their seat opens. Data readiness, cutover, launch communications, and adoption reporting stay in the migration, go-live, and optimization resources.",
    whoThisIsFor:
      "Enablement leads, sales ops, implementation leads, and managers rolling CRM out to more than one role. Useful when AEs, managers, admins, and customer success will each touch accounts, contacts, deals, and activities differently — and when the last rollout leaned on a single recorded demo.",
    whatMattersIntro:
      "Prioritize observable CRM-object tasks per role over slide time: create a deal, set a dated next step, run a stuck-deal board, provision a user, receive a Closed-Won handoff. A short curriculum people finish beats a long course they skip, and seats should follow a signed pass rather than attendance.",
    howToUse:
      "List the roles going live in wave one. Write one curriculum per role in CRM-object language. Load a sandbox with sample accounts, contacts, and deals that mirror your stages and required fields. Run the sessions, then have a named signer watch or spot-check each pass row. Open production seats per person as they pass. Keep office hours and manager board coaching running through the first two weeks.",
    workedExampleStructured: {
      title: "Worked example",
      requirement:
        "Each role completes its own CRM drill in sandbox before a production seat opens.",
      vendors: [
        {
          name: "AE track",
          result: "PASS",
          note: "Trainee created a linked account and contact, opened a deal with owner and dated next step, and logged an activity while the signer watched.",
        },
        {
          name: "Manager track",
          result: "PARTIAL",
          note: "Stuck-deal board review was rehearsed, but ownership reassignment was never attempted — so that pass row stays open.",
        },
        {
          name: "Admin track",
          result: "NOT_TESTED",
          note: "User provisioning and deactivation drill is not scheduled yet, so admin seats stay closed.",
        },
      ],
      evidence:
        "Sandbox drill observed by the named signer, with the pass row dated.",
      disclaimer:
        "Hypothetical role tracks for teaching the artifact — not a SoftwareGlimpse case study.",
    },
    glance: {
      primaryGoal: "Role-ready users on CRM objects before production seats open",
      typicalTeam: "Enablement, sales ops, managers, CS leads, and implementation leads",
      commonPriorities: [
        "AE deal + next-step drill",
        "Manager board coaching",
        "Admin user lifecycle",
        "CS Closed-Won handoff",
        "Email sync privacy",
        "Seat gating on a signed pass",
      ],
    },
    whatsInside: [
      {
        id: "audiences",
        title: "Audiences & owners",
        description:
          "Wave-one roles, curriculum owners, and the signer for each track.",
        icon: "users",
      },
      {
        id: "ae-track",
        title: "AE track",
        description:
          "Account, contact, deal, stage, next-step, and activity drills.",
        icon: "workflow",
      },
      {
        id: "manager-track",
        title: "Manager track",
        description:
          "Stuck-deal boards, ownership changes, and the weekly pipeline view.",
        icon: "chart",
      },
      {
        id: "admin-track",
        title: "Admin track",
        description:
          "User lifecycle, persona visibility checks, and duplicate hygiene.",
        icon: "shield",
      },
      {
        id: "cs-track",
        title: "CS / post-sale track",
        description:
          "Closed-Won handoff fields, account ownership, and post-sale activity.",
        icon: "handshake",
      },
      {
        id: "sandbox",
        title: "Sandbox practice set",
        description:
          "Sample accounts, contacts, and deals that mirror production rules.",
        icon: "database",
      },
      {
        id: "cert-lite",
        title: "Certification-lite & seat gating",
        description:
          "Observable pass rows, dated signatures, and access that follows the pass.",
        icon: "check",
      },
      {
        id: "reinforcement",
        title: "Reinforcement",
        description:
          "Office hours, manager coaching, cheat sheets, and a feedback route.",
        icon: "repeat",
      },
    ],
    evidenceRules: {
      countsAs: [
        "Drill completed in sandbox and observed by the named signer",
        "Screen recording of the role script",
        "Dated pass row with a signer name",
        "Admin confirmation that the seat opened after the pass",
      ],
      doesNotCount: [
        "Attendance at a webinar or recording view",
        "Slide deck sent to the team",
        "“They have used a CRM before”",
        "Self-reported completion with no signer",
      ],
    },
    challenges: [],
    outcomes: [
      {
        id: "role-ready",
        title: "Role-ready users at go-live",
        description:
          "Each audience can complete its core CRM-object tasks without an admin standing over them.",
      },
      {
        id: "cleaner-day-one",
        title: "Cleaner day-one records",
        description:
          "Practice happens in sandbox, so production deals start with owners and next steps.",
      },
      {
        id: "access-gated",
        title: "Access gated on observable tasks",
        description:
          "Seats open after a dated pass on real CRM drills — not after attendance.",
      },
      {
        id: "adoption-bridge",
        title: "A bridge into adoption",
        description:
          "Office hours and manager coaching continue after launch instead of stopping at training day.",
      },
    ],
    priorities: [],
    workflowSteps: [
      {
        id: "audiences",
        label: "Audiences",
        detail:
          "List the roles going live in wave one and what each must be able to do in CRM.",
      },
      {
        id: "curricula",
        label: "Curricula",
        detail:
          "Write one short, object-level curriculum per role: AE, manager, admin, CS.",
      },
      {
        id: "practice",
        label: "Practice",
        detail:
          "Load sandbox accounts, contacts, and deals that mirror production stages and required fields.",
      },
      {
        id: "sessions",
        label: "Sessions",
        detail:
          "Run guided practice per role instead of one shared webinar for everyone.",
      },
      {
        id: "certify",
        label: "Certify-lite",
        detail:
          "A named signer confirms each person’s pass rows before their seat opens.",
      },
      {
        id: "reinforce",
        label: "Reinforce",
        detail:
          "Office hours and manager board coaching through the first two weeks.",
      },
    ],
    artifactSections: [
      {
        id: "audiences-owners",
        title: "1. Audiences & owners",
        accent: "green",
        intro:
          "Name the roles going live in wave one, who writes each curriculum, and who signs the pass.",
        items: [
          {
            id: "1.1",
            label: "Wave-one roles listed (AE, manager, admin, CS)",
            whyItMatters:
              "The role you forget is the one that edits deals without training.",
            required: true,
            testScenario:
              "Walk the org chart and name everyone who will create or edit accounts, contacts, deals, or activities in the first 90 days.",
            owner: "Implementation lead",
            doneWhen: "Named list exists with headcount per role.",
          },
          {
            id: "1.2",
            label: "Later waves given target dates",
            whyItMatters:
              "Deferred audiences return as unplanned support load when nobody owns a date.",
            required: false,
            testScenario:
              "List marketing, partners, or executives with a target month rather than “TBD”.",
            owner: "Implementation lead",
          },
          {
            id: "1.3",
            label: "Curriculum owner per role track",
            whyItMatters:
              "Object-level scripts drift without one accountable author per role.",
            required: true,
            testScenario:
              "Assign one owner to each of the AE, manager, admin, and CS tracks and confirm they accept.",
            owner: "Enablement / ops",
          },
          {
            id: "1.4",
            label: "Certification signer per role",
            whyItMatters: "A pass with no signer is self-reported.",
            required: true,
            testScenario:
              "Name who watches each drill — manager for AEs, ops for admins, CS lead for CS.",
            owner: "Managers / ops",
          },
          {
            id: "1.5",
            label: "Session and communications owner named",
            whyItMatters:
              "Invites, sandbox links, and access instructions fall between owners.",
            required: true,
            testScenario:
              "Point one person at the training thread and confirm they hold the calendar.",
            owner: "Project lead",
          },
        ],
      },
      {
        id: "ae-track",
        title: "2. AE track",
        accent: "teal",
        intro:
          "What a seller must do on accounts, contacts, deals, and activities without an admin beside them.",
        items: [
          {
            id: "2.1",
            label: "Create an account with a linked contact",
            whyItMatters:
              "Contacts stranded from accounts break ownership and reporting from day one.",
            required: true,
            testScenario:
              "In sandbox, create a company/account, add a contact with email, and confirm the link appears on both records.",
            owner: "Sales ops",
          },
          {
            id: "2.2",
            label: "Open a deal with stage, close date, and owner",
            whyItMatters:
              "The pipeline is only as honest as the fields sellers fill at creation.",
            required: true,
            testScenario:
              "Create a deal that saves with your required stage, close date, amount (if used), and the trainee as owner.",
            owner: "Sales ops",
          },
          {
            id: "2.3",
            label: "Set a dated next step on an open deal",
            whyItMatters:
              "Deals without a next step become the stuck pipeline managers chase later.",
            required: true,
            testScenario:
              "Add a dated next step or task, then confirm your stuck-deal filter no longer returns the practice deal.",
            owner: "Sales ops",
          },
          {
            id: "2.4",
            label: "Advance a stage using your exit criteria",
            whyItMatters:
              "Stage discipline learned in practice is what makes the forecast readable later.",
            required: true,
            testScenario:
              "Move the practice deal one stage and complete whatever your process requires at that gate.",
            owner: "Sales ops",
          },
          {
            id: "2.5",
            label: "Log an activity on the right record",
            whyItMatters:
              "Activity logged as a personal task instead of on the record hides the account history.",
            required: true,
            testScenario:
              "Log a call, meeting, or note and confirm it appears on the contact and the related deal timeline.",
            owner: "Curriculum owner",
          },
          {
            id: "2.6",
            label: "Complete the email and calendar sync privacy brief",
            whyItMatters:
              "Sellers connect mailboxes faster than they ask what syncs and who can read it.",
            required: true,
            testScenario:
              "Before enabling sync, have the trainee state what syncs, who can view it, and how to disconnect.",
            owner: "Ops + security",
          },
          {
            id: "2.7",
            label: "Convert a lead preserving source and owner",
            whyItMatters:
              "Attribution and ownership break quietly at conversion when nobody practices it.",
            required: false,
            testScenario:
              "Convert a sandbox lead and confirm lead source and owner survive on the resulting contact and deal — skip if leads are out of scope.",
            owner: "Sales ops",
          },
        ],
      },
      {
        id: "manager-track",
        title: "3. Manager track",
        accent: "blue",
        intro: "Coaching from CRM views instead of a private spreadsheet.",
        items: [
          {
            id: "3.1",
            label: "Run a stuck-deal / missing-next-step review",
            whyItMatters:
              "Managers who cannot filter risk return to their own sheet within a week.",
            required: true,
            testScenario:
              "Filter open deals with no next step or too many days in stage, then talk through two of them in sandbox.",
            owner: "Sales leadership",
          },
          {
            id: "3.2",
            label: "Reassign deal and contact ownership",
            whyItMatters:
              "Territory changes and departures stall when only admins can move ownership.",
            required: true,
            testScenario:
              "Change the owner on a practice deal and its contacts, then confirm the receiving rep can see them.",
            owner: "Sales leadership",
          },
          {
            id: "3.3",
            label: "Open the pipeline or forecast view leadership will use",
            whyItMatters:
              "A weekly number nobody can reproduce in CRM becomes a spreadsheet again.",
            required: true,
            testScenario:
              "Answer “what is closing this month?” from that view alone, by stage and close date.",
            owner: "Sales leadership",
          },
          {
            id: "3.4",
            label: "Coach stage honesty from the exit criteria",
            whyItMatters:
              "Stage inflation is a coaching habit, not a configuration problem.",
            required: false,
            testScenario:
              "Review a deal sitting in a late stage without evidence and rehearse the coaching prompt.",
            owner: "Sales leadership",
          },
        ],
      },
      {
        id: "admin-track",
        title: "4. Admin track",
        accent: "indigo",
        intro: "User lifecycle, permissions, and hygiene on real CRM objects.",
        items: [
          {
            id: "4.1",
            label: "Provision a user and assign a role",
            whyItMatters:
              "Rollout stalls whenever only the vendor can add a seat.",
            required: true,
            testScenario:
              "Create a sandbox user with the AE role from your access map and confirm they land with the intended visibility.",
            owner: "CRM admin",
          },
          {
            id: "4.2",
            label: "Deactivate a user and confirm access is gone",
            whyItMatters:
              "Leavers keep access whenever offboarding was never practiced.",
            required: true,
            testScenario:
              "Deactivate the sandbox user, then confirm sign-in fails and their records are still owned or reassigned.",
            owner: "CRM admin",
          },
          {
            id: "4.3",
            label: "Verify object visibility for each persona",
            whyItMatters: "Least privilege that nobody tested is an assumption.",
            required: true,
            testScenario:
              "Sign in as an AE, then a manager, and check contact and deal visibility against the access map.",
            owner: "CRM admin",
          },
          {
            id: "4.4",
            label: "Resolve a duplicate contact and a required-field gap",
            whyItMatters:
              "Duplicate contacts and empty required fields are the two most common day-one tickets.",
            required: true,
            testScenario:
              "Merge or flag a duplicate contact by email and fix a deal missing a required field, without breaking the deal–contact link.",
            owner: "CRM admin",
          },
          {
            id: "4.5",
            label: "Know the import boundary",
            whyItMatters:
              "Ad-hoc admin imports recreate the mess the migration plan was meant to prevent.",
            required: false,
            testScenario:
              "State which small CSV updates an admin may run, and when the work must go to the migration owners instead.",
            owner: "CRM admin",
          },
          {
            id: "4.6",
            label: "Support and escalation path documented",
            whyItMatters:
              "Sync failures and permission requests need a route before go-live, not after.",
            required: true,
            testScenario:
              "Write who handles sync errors, permission requests, and data defects — and confirm those people know.",
            owner: "CRM admin",
          },
        ],
      },
      {
        id: "cs-track",
        title: "5. CS / post-sale track",
        accent: "purple",
        intro:
          "Only needed if someone other than the AE owns the account after the win — but ownership must be explicit either way.",
        items: [
          {
            id: "5.1",
            label: "Receive a Closed-Won handoff",
            whyItMatters:
              "Won deals stall when handoff fields and account ownership are undefined.",
            required: false,
            testScenario:
              "Take a won sandbox deal through your handoff fields and confirm account ownership changes as designed.",
            owner: "CS lead",
          },
          {
            id: "5.2",
            label: "Find the account timeline and log post-sale activity",
            whyItMatters:
              "CS creating a second account is how customer history splits in two.",
            required: false,
            testScenario:
              "Locate the existing account, add an onboarding or renewal note, and confirm no duplicate account was created.",
            owner: "CS lead",
          },
          {
            id: "5.3",
            label: "Post-sale ownership written down when there is no CS track",
            whyItMatters:
              "Ambiguous post-sale ownership is worse than having no CS track at all.",
            required: true,
            testScenario:
              "Record whether AEs retain ownership after Closed-Won and have sales leadership confirm it.",
            owner: "Sales leadership",
          },
        ],
      },
      {
        id: "sandbox",
        title: "6. Sandbox practice set",
        accent: "cyan",
        intro:
          "Practice records that behave like production without exposing live clients.",
        items: [
          {
            id: "6.1",
            label: "Sandbox loaded with sample accounts, contacts, deals, activities",
            whyItMatters: "Empty sandboxes teach clicking, not the job.",
            required: true,
            testScenario:
              "Confirm each role script can be completed end to end on the sample data.",
            owner: "CRM admin",
          },
          {
            id: "6.2",
            label: "Stages and required fields mirror production",
            whyItMatters:
              "Drills that pass under looser sandbox rules fail on day one.",
            required: true,
            testScenario:
              "Compare the sandbox stage list and required fields against the production configuration.",
            owner: "Sales ops",
          },
          {
            id: "6.3",
            label: "Sample data obviously labeled as practice",
            whyItMatters:
              "Practice records that look real end up in forecasts and outbound email.",
            required: true,
            testScenario:
              "Check that sample accounts and contacts are clearly test data with non-routable email addresses.",
            owner: "CRM admin",
          },
          {
            id: "6.4",
            label: "Reset path for the practice set",
            whyItMatters:
              "Reused sandboxes get messy enough to block the next cohort.",
            required: false,
            testScenario:
              "Reset or reload the practice data between cohorts and name who runs it.",
            owner: "CRM admin",
          },
        ],
      },
      {
        id: "cert-lite",
        title: "7. Certification-lite & seat gating",
        accent: "amber",
        intro:
          "Observable pass rows, a dated signature, and access that follows the pass.",
        items: [
          {
            id: "7.1",
            label: "Pass rows written per role",
            whyItMatters:
              "Anything vaguer than a task list becomes attendance tracking.",
            required: true,
            testScenario:
              "For each role, list the drills above as pass rows a signer can watch or spot-check.",
            owner: "Enablement",
          },
          {
            id: "7.2",
            label: "Signer dates every pass",
            whyItMatters:
              "Undated passes cannot be reconciled against the seat list.",
            required: true,
            testScenario:
              "Confirm each pass row carries a signer name and a date.",
            owner: "Managers / ops",
          },
          {
            id: "7.3",
            label: "Production seats open only after the pass",
            whyItMatters:
              "Seats granted early are where dirty day-one records come from.",
            required: true,
            testScenario:
              "Compare the access list against the pass log and confirm no unpassed user holds a seat.",
            owner: "Implementation lead",
          },
          {
            id: "7.4",
            label: "Retake path defined",
            whyItMatters:
              "People who fail once need a route back, or they work around CRM instead.",
            required: true,
            testScenario:
              "Book the next sandbox window and name who re-runs the drill.",
            owner: "Enablement",
          },
          {
            id: "7.5",
            label: "Exceptions recorded with an owner and expiry",
            whyItMatters:
              "Emergency access without an expiry date becomes permanent.",
            required: false,
            testScenario:
              "For any seat opened before a pass, record who approved it and when the pass is due.",
            owner: "Implementation lead",
          },
        ],
      },
      {
        id: "reinforcement",
        title: "8. Reinforcement after launch",
        accent: "rose",
        intro: "The first two weeks decide whether the new habits hold.",
        items: [
          {
            id: "8.1",
            label: "Office hours booked in the first hypercare week",
            whyItMatters:
              "The questions that break adoption arrive after launch, not during training.",
            required: true,
            testScenario:
              "Hold at least two staffed sessions covering deals, email sync, and duplicates.",
            owner: "CRM admin / ops",
          },
          {
            id: "8.2",
            label: "Manager board coaching scheduled",
            whyItMatters:
              "If the first pipeline reviews run off a private sheet, CRM loses.",
            required: true,
            testScenario:
              "Book the first two pipeline reviews and confirm they run from the CRM views practiced in training.",
            owner: "Sales leadership",
          },
          {
            id: "8.3",
            label: "One-page references published per role",
            whyItMatters:
              "Small reminders prevent most day-one support tickets.",
            required: false,
            testScenario:
              "Publish create-deal, board-filter, and handoff references and check the links resolve.",
            owner: "Enablement",
          },
          {
            id: "8.4",
            label: "Feedback route for friction",
            whyItMatters:
              "Stage and required-field problems surface from users first.",
            required: true,
            testScenario:
              "Name the channel where trainees report friction and who triages it weekly.",
            owner: "Curriculum owners",
          },
          {
            id: "8.5",
            label: "Plan version frozen for go-live",
            whyItMatters:
              "Two versions of the curriculum mean two sets of habits.",
            required: false,
            testScenario:
              "Store a dated version alongside your implementation artifacts.",
            owner: "Project lead",
          },
        ],
      },
    ],
    downloadFiles: [
      {
        href: "/resources/crm-training-plan.md",
        label: "Download Markdown",
        format: "md",
      },
    ],
    faq: [
      {
        question: "How is this different from a vendor training webinar?",
        answer:
          "A webinar is one broadcast to everyone. This plan assigns a separate curriculum per role on CRM objects (accounts, contacts, deals, activities), a sandbox drill, a pass row, a signer, and reinforcement. Attendance never proves someone can run their job in CRM.",
      },
      {
        question: "Does every role need its own track?",
        answer:
          "Every role that edits CRM records differently does. AEs, managers, and admins almost always need separate drills. Skip the CS track only if AEs keep post-sale ownership — and write that decision down instead of leaving it ambiguous.",
      },
      {
        question: "What does certification-lite mean?",
        answer:
          "A short list of observable CRM tasks that a named signer watches or spot-checks, dated on the day. No quiz scores or vendor badges unless your compliance process genuinely requires them.",
      },
      {
        question: "When should training start relative to go-live?",
        answer:
          "After stages and required fields are stable enough to practice honestly, and before broad production access. If the board still changes daily, train a later wave rather than freezing bad habits into day one.",
      },
      {
        question: "Where do data readiness and go-live gates live?",
        answer:
          "In the migration and go-live resources. This plan only decides who learns what, how they practice, and when their seat opens — it does not own cutover, freeze windows, or launch communications.",
      },
      {
        question: "How does email sync fit in?",
        answer:
          "As a privacy brief before any mailbox connects: what syncs, who can read it on the record, and how to disconnect. The deeper controls and visibility decisions belong on the CRM Security Checklist.",
      },
    ],
    heroVisual: {
      src: "/resources/crm-training-plan-hero.png",
      alt: "Educational CRM training plan interface showing role tracks for admin, rep, and manager alongside curriculum modules, practice scenarios, and a reinforcement calendar.",
      caption:
        "One curriculum per role, practice scenarios, then reinforcement — not a single shared session.",
    },
    needsVisual: {
      src: "/resources/crm-training-plan-needs.png",
      alt: "Diagram pairing common training problems — one webinar, no practice, forgotten by week two — with fixes: role-based tracks, hands-on scenario practice, and ongoing reinforcement.",
      caption:
        "What breaks when training is a single demo — and what a role plan changes.",
    },
    workflowVisual: {
      src: "/resources/crm-training-plan-workflow.png",
      alt: "Five-stage training workflow: audiences, curriculum, practice, launch sessions, reinforce.",
      caption:
        "Audiences, curriculum, practice, sessions, reinforcement — with seats gated on a signed pass.",
    },
    useBefore: ["crm-implementation-checklist"],
    useWith: ["crm-security-checklist"],
    useNext: ["crm-go-live-checklist", "crm-optimization-checklist"],
    journeySlugs: [
      "crm-implementation-checklist",
      "crm-training-plan",
      "crm-go-live-checklist",
      "crm-optimization-checklist",
    ],
    relatedResourceSlugs: [
      "crm-implementation-checklist",
      "crm-go-live-checklist",
      "crm-security-checklist",
      "crm-optimization-checklist",
    ],
    featuredGuideHrefs: [
      "/guides/crm-implementation-roles/",
      "/guides/crm-implementation/",
      "/guides/crm-implementation-planning/",
    ],
    relatedToolHrefs: [
      {
        href: "/tools/crm-implementation-planner/",
        label: "CRM Implementation Planner",
      },
      { href: "/tools/crm-finder/", label: "CRM Software Finder" },
    ],
    primaryCta: {
      href: "/resources/crm-training-plan.xlsx",
      label: "Download Excel (Editable planner)",
    },
    secondaryCta: {
      href: "/resources/crm-training-plan.pdf",
      label: "Download PDF (Printable version)",
    },
    categorySlug: "crm",
    lastReviewedAt: "2026-08-15",
  },

  "crm-data-migration-template": {
    displayTitle: "CRM Data Migration Template",
    badgeLabel: "Migration template",
    toolkitLabel: "CRM Migration Toolkit",
    tagline: "Inventory CRM objects, volumes, owners, and load order.",
    heroExplanation:
      "One row per CRM object — accounts, contacts, deals, activities, leads — with its source, record count, data owner, dependencies, and load-order number, agreed before anyone maps a field.",
    overview:
      "The scope artifact for a CRM data move. It answers four questions per object: where does it come from, how many records are we moving, who owns the quality, and what has to load first. Field-level transforms belong in the field mapping template; dry runs, freeze windows, validation, and rollback belong on the migration checklist. Keeping this sheet narrow is what makes those two artifacts possible.",
    whoThisIsFor:
      "Migration leads, ops leads, and CRM admins moving from a legacy CRM, spreadsheets, or a mix of both. You need it as soon as more than one object or more than one source competes for the same open accounts, contacts, and deals.",
    whatMattersIntro:
      "Prioritize an honest object list, order-of-magnitude counts, a named owner per object, and a load order that respects parent–child links. A short inventory the team believes beats a complete one full of “TBD”, and every unowned row eventually becomes an orphaned record.",
    howToUse:
      "List every source system and mark which one is primary for open work. Fill one row per CRM object with an explicit wave-one decision. Pull record counts from real exports. Assign a business owner and a technical owner per included object. Write the parent–child dependencies, then number the load order so no child loads before its parent. Sign off a dated version and hand field-level work to the field map.",
    workedExampleStructured: {
      title: "Worked example",
      requirement:
        "Every included object has a record count, a named owner, and a load-order number before mapping starts.",
      vendors: [
        {
          name: "Accounts",
          result: "PASS",
          note: "Count pulled from the legacy export, business and technical owners named, load order 2 behind the user load.",
        },
        {
          name: "Deals",
          result: "PARTIAL",
          note: "Count and owner are set, but the load-order number is provisional until the user and seat map is confirmed.",
        },
        {
          name: "Activities",
          result: "NOT_TESTED",
          note: "Volume unknown and no owner has accepted the row, so activities are deferred to a later wave in writing.",
        },
      ],
      evidence:
        "Record counts from a real export, plus a named owner who accepted each row.",
      disclaimer:
        "Hypothetical object rows for teaching the artifact — not a SoftwareGlimpse case study.",
    },
    glance: {
      primaryGoal: "A trusted CRM object inventory with owners and a load order",
      typicalTeam: "Migration lead, ops, CRM admin, and data owners",
      commonPriorities: [
        "Object scope per wave",
        "Open vs archive",
        "Record counts",
        "Business + technical owners",
        "Parent–child dependencies",
        "Load order",
      ],
    },
    whatsInside: [
      {
        id: "sources",
        title: "Source systems",
        description:
          "Legacy CRM, spreadsheets, and tools — with the primary source per object.",
        icon: "database",
      },
      {
        id: "object-rows",
        title: "Object inventory rows",
        description:
          "Accounts, contacts, deals, activities, leads, users, and customs.",
        icon: "list",
      },
      {
        id: "volumes",
        title: "Volumes & open vs archive",
        description:
          "Record counts and the rule that separates working records from history.",
        icon: "chart",
      },
      {
        id: "owners",
        title: "Owners per object",
        description:
          "A business owner for quality and a technical owner for the load.",
        icon: "users",
      },
      {
        id: "dependencies",
        title: "Dependencies & load order",
        description:
          "Parent–child links and a numbered sequence that keeps records connected.",
        icon: "workflow",
      },
      {
        id: "handoff",
        title: "Sign-off & handoff",
        description:
          "A dated version, plus what passes to the field map and migration checklist.",
        icon: "check",
      },
    ],
    evidenceRules: {
      countsAs: [
        "Record count from a real export or report",
        "A named person who accepted the owner role",
        "Dependency confirmed against the target CRM data model",
        "Written wave-one include or exclude decision",
      ],
      doesNotCount: [
        "Counts recalled from memory",
        "An object row with a “TBD” owner",
        "Load order implied by spreadsheet tab order",
        "Assuming the importer will resolve links for you",
      ],
    },
    challenges: [],
    outcomes: [
      {
        id: "clear-scope",
        title: "Explicit scope per CRM object",
        description:
          "Everyone knows which accounts, contacts, deals, activities, and leads move in wave one.",
      },
      {
        id: "safe-sequence",
        title: "A load order that keeps links intact",
        description:
          "Parents land before children, so account–contact–deal relationships and owners survive.",
      },
      {
        id: "owned-quality",
        title: "Owned data quality",
        description:
          "Each included object has a business owner for quality and a technical owner for the load.",
      },
      {
        id: "plannable",
        title: "A plannable migration",
        description:
          "Honest counts and dependencies let the migration checklist set real dates and gates.",
      },
    ],
    priorities: [],
    workflowSteps: [
      {
        id: "list-objects",
        label: "List objects",
        detail:
          "One row per CRM object per source, with an explicit wave-one include or exclude.",
      },
      {
        id: "estimate-volumes",
        label: "Estimate volumes",
        detail:
          "Pull record counts from real exports and split working records from archive.",
      },
      {
        id: "assign-owners",
        label: "Assign owners",
        detail:
          "Name a business owner for quality and a technical owner for the export and load.",
      },
      {
        id: "set-load-order",
        label: "Set load order",
        detail:
          "Write parent–child dependencies, then number the sequence without conflicts.",
      },
      {
        id: "sign-off",
        label: "Sign off",
        detail:
          "Date the version, then hand field rules to the field map and gates to the migration checklist.",
      },
    ],
    artifactSections: [
      {
        id: "sources",
        title: "1. Source systems",
        accent: "green",
        intro:
          "Where records come from, and which system wins for open work.",
        items: [
          {
            id: "1.1",
            label: "Every candidate source listed",
            whyItMatters:
              "The source you forget is the spreadsheet someone keeps using after go-live.",
            required: true,
            testScenario:
              "List legacy CRM, spreadsheets, inbox exports, and marketing tools, marking each in scope or excluded.",
            owner: "Ops lead",
          },
          {
            id: "1.2",
            label: "Primary source named per object",
            whyItMatters:
              "Two systems claiming the same open deals guarantees duplicates.",
            required: true,
            testScenario:
              "For accounts, contacts, and deals, name the single system that wins when records conflict.",
            owner: "Ops lead",
          },
          {
            id: "1.3",
            label: "Export method and access recorded",
            whyItMatters:
              "Nobody should discover during cutover that an export needs vendor support.",
            required: true,
            testScenario:
              "Record API, CSV, or vendor export per source and who holds credentials to run it.",
            owner: "CRM admin",
          },
          {
            id: "1.4",
            label: "Excluded sources written down with a reason",
            whyItMatters:
              "Silent exclusions get re-litigated in the middle of cutover week.",
            required: false,
            testScenario:
              "Note each excluded source, the reason, and who agreed.",
            owner: "Ops lead",
          },
        ],
      },
      {
        id: "object-inventory",
        title: "2. Object inventory",
        accent: "teal",
        intro:
          "One row per CRM object, each with an explicit wave-one decision.",
        items: [
          {
            id: "2.1",
            label: "Accounts / companies row filled",
            whyItMatters:
              "Accounts are the parent nearly every other object hangs from.",
            required: true,
            testScenario:
              "Fill source, wave-one decision, and how an active account is identified.",
            owner: "Sales ops",
          },
          {
            id: "2.2",
            label: "Contacts row filled with a match key",
            whyItMatters:
              "Contacts are where duplicates bite hardest, and the key decides the outcome.",
            required: true,
            testScenario:
              "Name email (or your alternative) as the match key and note the account link dependency.",
            owner: "Sales ops",
          },
          {
            id: "2.3",
            label: "Deals / opportunities row split open vs closed",
            whyItMatters:
              "Open pipeline is the object the business notices immediately if it is wrong.",
            required: true,
            testScenario:
              "Record open pipeline separately from closed-won and closed-lost history, with a decision on each.",
            owner: "Rev ops",
          },
          {
            id: "2.4",
            label: "Activities row decided (include, exclude, later wave)",
            whyItMatters:
              "Activity history is usually the largest object and the easiest to underestimate.",
            required: true,
            testScenario:
              "Record the decision for tasks, calls, notes, and logged email — not “maybe”.",
            owner: "CRM admin",
          },
          {
            id: "2.5",
            label: "Leads row decided (import, convert, or exclude)",
            whyItMatters:
              "Leads left undecided reappear as duplicate contacts.",
            required: true,
            testScenario:
              "Choose import as leads, convert before load, or exclude — and write it on the row.",
            owner: "Marketing / sales ops",
          },
          {
            id: "2.6",
            label: "Users / owners row filled",
            whyItMatters:
              "Owner remapping fails when seats do not exist before owned records land.",
            required: true,
            testScenario:
              "List the active seats to create first and how inactive legacy owners are handled.",
            owner: "IT / CRM admin",
          },
          {
            id: "2.7",
            label: "Custom objects listed or deferred",
            whyItMatters:
              "Custom objects rarely earn a wave-one slot, and they load after their parents.",
            required: false,
            testScenario:
              "List renewals, projects, or households only if day-one operations need them; otherwise defer with a date.",
            owner: "Implementation lead",
          },
          {
            id: "2.8",
            label: "Files and attachments decided",
            whyItMatters:
              "Attachment volume is what turns a planned weekend into a week.",
            required: false,
            testScenario:
              "Record include, link-only, or exclude for files — with a rough size if you include them.",
            owner: "CRM admin",
          },
        ],
      },
      {
        id: "volumes",
        title: "3. Volumes, open vs archive",
        accent: "blue",
        intro: "Size the work honestly before anyone promises a date.",
        items: [
          {
            id: "3.1",
            label: "Open vs archive rule written per object",
            whyItMatters:
              "Cleaning everything stalls migrations; cleaning the operating set is achievable.",
            required: true,
            testScenario:
              "Write the rule that separates records the team will work from cold history, object by object.",
            owner: "Sales ops",
          },
          {
            id: "3.2",
            label: "Record counts filled for every included object",
            whyItMatters:
              "Order-of-magnitude counts are what make load windows and cleanup effort plannable.",
            required: true,
            testScenario:
              "Pull counts from a real export or report — not an estimate from memory.",
            owner: "Data owner",
          },
          {
            id: "3.3",
            label: "Objects whose volume moves are flagged for re-count",
            whyItMatters:
              "A count taken months before the move misleads everyone planning against it.",
            required: false,
            testScenario:
              "Note fast-growing objects and when you will re-count them.",
            owner: "Data owner",
          },
          {
            id: "3.4",
            label: "Sensitive objects and fields flagged",
            whyItMatters:
              "An extracted contact list is the highest-risk artifact the project creates.",
            required: true,
            testScenario:
              "Flag objects carrying restricted contact attributes or financial identifiers and link them to your export controls.",
            owner: "Security / ops",
          },
          {
            id: "3.5",
            label: "Known exceptions recorded",
            whyItMatters:
              "Legal holds and regional splits cannot live in a chat thread.",
            required: false,
            testScenario:
              "Note records that must not move, and who decided.",
            owner: "Data owner",
          },
        ],
      },
      {
        id: "owners",
        title: "4. Owners & accountability",
        accent: "indigo",
        intro: "Every included object needs a person, not a channel.",
        items: [
          {
            id: "4.1",
            label: "Business owner named per object",
            whyItMatters:
              "Quality decisions need someone whose team lives with the result.",
            required: true,
            testScenario:
              "Name who decides what good looks like for each object and confirm they accept the row.",
            owner: "Ops lead",
          },
          {
            id: "4.2",
            label: "Technical owner named per object",
            whyItMatters:
              "Exports and loads need a named pair of hands and a backup.",
            required: true,
            testScenario:
              "Name who runs the export and load for each object, plus who covers if they are away.",
            owner: "CRM admin",
          },
          {
            id: "4.3",
            label: "Cleansing responsibility agreed before mapping",
            whyItMatters:
              "Cleanup with no owner slides to “after go-live” and never happens.",
            required: true,
            testScenario:
              "For each object, record who resolves duplicates and blanks, and by when.",
            owner: "Data owner",
          },
          {
            id: "4.4",
            label: "Tie-breaker named for contested records",
            whyItMatters:
              "Two owners disagreeing over one account can stall the whole load.",
            required: false,
            testScenario:
              "Name who decides ownership and duplicate disputes.",
            owner: "Project lead",
          },
        ],
      },
      {
        id: "load-order",
        title: "5. Dependencies & load order",
        accent: "purple",
        intro:
          "Sequence so account, contact, and deal links survive the load.",
        items: [
          {
            id: "5.1",
            label: "Parent–child relationships listed",
            whyItMatters:
              "Children loaded before their parents arrive as orphans.",
            required: true,
            testScenario:
              "For each object, name its parents: contacts to accounts, deals to accounts and contacts, activities to deals and contacts.",
            owner: "CRM admin",
          },
          {
            id: "5.2",
            label: "Users placed above owned records",
            whyItMatters:
              "Deals landing on missing users is the most common load defect.",
            required: true,
            testScenario:
              "Confirm the user or seat load sits above accounts, contacts, and deals in the numbered order.",
            owner: "CRM admin",
          },
          {
            id: "5.3",
            label: "Load order numbered without conflicts",
            whyItMatters:
              "An order that only exists in someone’s head cannot be reviewed.",
            required: true,
            testScenario:
              "Number every included object and check each parent carries a lower number than its children.",
            owner: "Implementation lead",
          },
          {
            id: "5.4",
            label: "Legacy key strategy recorded",
            whyItMatters:
              "Without a stable key you cannot reconnect children to parents or reconcile afterwards.",
            required: true,
            testScenario:
              "Record which legacy id travels with each object and where it lands in the target.",
            owner: "CRM admin",
          },
          {
            id: "5.5",
            label: "Parallel-safe objects marked",
            whyItMatters:
              "Loading in parallel saves hours only where no link depends on the other object.",
            required: false,
            testScenario:
              "Mark objects with no shared parent dependency as safe to load concurrently.",
            owner: "CRM admin",
          },
          {
            id: "5.6",
            label: "Order reviewed with a frontline lead",
            whyItMatters:
              "The sequence has to match how the team actually works deals.",
            required: true,
            testScenario:
              "Walk the numbered order with a sales or service lead and capture a dated sign-off.",
            owner: "Sales lead",
          },
        ],
      },
      {
        id: "handoff",
        title: "6. Sign-off & handoff",
        accent: "amber",
        intro:
          "Where this inventory stops and the other migration artifacts pick up.",
        items: [
          {
            id: "6.1",
            label: "Inventory version dated",
            whyItMatters:
              "Mapping and load work must cite one version of the scope.",
            required: true,
            testScenario:
              "Store a dated version and confirm the field map references it.",
            owner: "Implementation lead",
          },
          {
            id: "6.2",
            label: "Field-level work handed to the field map",
            whyItMatters:
              "Stage, amount, close-date, and owner rules belong in one dictionary, not two.",
            required: true,
            testScenario:
              "Confirm every included object points at its rows in the CRM Field Mapping Template.",
            owner: "CRM admin",
          },
          {
            id: "6.3",
            label: "Cutover gates handed to the migration checklist",
            whyItMatters:
              "Dry runs, freeze windows, validation, and rollback are gate work — not inventory work.",
            required: true,
            testScenario:
              "Confirm the CRM Migration Checklist owns dry run, cutover, and rollback for every included object.",
            owner: "Project lead",
          },
          {
            id: "6.4",
            label: "Scope changes go through change control",
            whyItMatters:
              "Silent scope edits after mapping starts are how orphaned records appear.",
            required: true,
            testScenario:
              "Name who approves adding or dropping an object, and where the change is logged.",
            owner: "Implementation lead",
          },
          {
            id: "6.5",
            label: "Extract handling reviewed with security",
            whyItMatters:
              "Export files are contact and deal lists sitting outside the CRM.",
            required: false,
            testScenario:
              "Confirm where extracts are stored, who can open them, and when they are deleted.",
            owner: "Security / ops",
          },
        ],
      },
    ],
    downloadFiles: [
      {
        href: "/resources/crm-data-migration-template.md",
        label: "Download Markdown",
        format: "md",
      },
      {
        href: "/resources/crm-data-migration-template.csv",
        label: "Download CSV",
        format: "csv",
      },
    ],
    faq: [
      {
        question: "Is this the same as field mapping?",
        answer:
          "No. This sheet inventories objects, volumes, owners, and load order. The CRM Field Mapping Template defines source→target fields and transforms such as stage values, owner email lookups, amounts, and close dates. Fill the inventory first so the map knows which objects exist.",
      },
      {
        question: "How is it different from the migration checklist?",
        answer:
          "The checklist owns the gates — dry run, freeze window, validation, cutover, rollback. This template owns the scope those gates run against. Keeping them separate stops the checklist from turning into a scoping argument mid-cutover.",
      },
      {
        question: "Should we migrate all historical activities?",
        answer:
          "Only if someone will use them and someone will own them. Many teams move open accounts, contacts, and deals first and record activities as a later wave — the decision belongs on the activities row, not in a hallway conversation.",
      },
      {
        question: "How accurate do record counts need to be?",
        answer:
          "Accurate enough to plan load windows and cleanup effort, and pulled from a real export rather than memory. Re-count fast-growing objects closer to the move.",
      },
      {
        question: "What if two systems claim the same records?",
        answer:
          "Name one primary source per object on the source row and record how conflicts resolve. Without that, both systems load and the team inherits duplicates on day one.",
      },
    ],
    heroVisual: {
      src: "/resources/crm-data-migration-template-hero.png",
      alt: "Educational CRM data migration template showing object rows for contacts, deals, and activities with description, record volume, data owner, load order, and dependency notes.",
      caption:
        "One row per object: volume, owner, load order, and the dependencies behind it.",
    },
    needsVisual: {
      src: "/resources/crm-data-migration-template-needs.png",
      alt: "Diagram contrasting undefined migration scope, orphaned loads, unmapped owners, and volume surprises with the object inventory that prevents them.",
      caption:
        "What breaks when a data move starts without an object inventory.",
    },
    workflowVisual: {
      src: "/resources/crm-data-migration-template-workflow.png",
      alt: "Five-stage migration template workflow: list objects, estimate volumes, assign owners, set load order, sign off — above an object inventory table.",
      caption:
        "List objects, estimate volumes, assign owners, set load order, sign off.",
    },
    useBefore: ["crm-implementation-checklist"],
    useWith: ["crm-field-mapping-template"],
    useNext: ["crm-migration-checklist", "crm-go-live-checklist"],
    journeySlugs: [
      "crm-implementation-checklist",
      "crm-data-migration-template",
      "crm-field-mapping-template",
      "crm-migration-checklist",
      "crm-go-live-checklist",
    ],
    relatedResourceSlugs: [
      "crm-field-mapping-template",
      "crm-migration-checklist",
      "crm-go-live-checklist",
      "crm-security-checklist",
    ],
    featuredGuideHrefs: [
      "/guides/crm-implementation/",
      "/guides/financial-services-crm-migration/",
      "/guides/crm-implementation-planning/",
    ],
    relatedToolHrefs: [
      {
        href: "/tools/crm-migration-planner/",
        label: "CRM Migration Planner",
      },
      {
        href: "/tools/crm-implementation-planner/",
        label: "CRM Implementation Planner",
      },
    ],
    primaryCta: {
      href: "/resources/crm-data-migration-template.xlsx",
      label: "Download Excel (Editable spreadsheet)",
    },
    secondaryCta: {
      href: "/resources/crm-data-migration-template.pdf",
      label: "Download PDF (Printable version)",
    },
    categorySlug: "crm",
    lastReviewedAt: "2026-08-15",
  },

  "crm-field-mapping-template": crmFieldMappingTemplateDepth,

  "crm-security-checklist": {
    displayTitle: "CRM Security Checklist",
    badgeLabel: "Audit template",
    toolkitLabel: "CRM Security Diligence Pack",
    tagline: "Prove CRM access controls on the plan you would actually buy.",
    heroExplanation:
      "Work through identity, object visibility, contact and deal exports, email-sync privacy, audit evidence, and access reviews — asking each vendor the same questions and confirming answers against the quoted plan, not the demo tier.",
    overview:
      "Deep access diligence for CRM, used during validation and again before go-live. It turns “enterprise-grade security” into an access model you can operate: who sees which accounts, contacts, and deals; whether SSO and MFA exist on your quoted plan; who can export a customer list; what email sync stores and who can read it; what audit evidence you can pull yourself; and who re-reviews access after launch. The evaluation checklist keeps light gates on roles and admin effort — this is the deeper pass behind them.",
    whoThisIsFor:
      "Ops leads, IT, implementation leads, and the security or compliance partners they work with. You need it when roles should see different contacts and deals, when leavers must lose access the same day, or when exports and mailbox sync could move sensitive client data out of the CRM.",
    whatMattersIntro:
      "Prioritize a written access map, plan-scoped identity answers, export controls on contacts and deals, email-sync visibility, and a review cadence with a signer. Certification badges and trust-page logos are not controls. Nothing passes on a feature seen on a higher tier than the one you would buy.",
    howToUse:
      "Draft the access map first: roles against view, edit, export, and admin on each CRM object. Send the same questions to every finalist and record answers against the quoted plan. Configure least privilege in trial and test each persona. Lock exports and document sync privacy. Pull a sample audit export yourself. Re-run the must-have rows as a pre-go-live gate, then schedule the first access review with a named signer.",
    workedExampleStructured: {
      title: "Worked example",
      requirement:
        "Only named roles can export contacts and deals, and exports leave an audit record we can pull on the quoted plan.",
      vendors: [
        {
          name: "Vendor A",
          result: "PASS",
          note: "Export permission was role-scoped in trial, and export events appeared in an audit extract the buyer pulled themselves.",
        },
        {
          name: "Vendor B",
          result: "PARTIAL",
          note: "Export restriction works, but export audit events are only available on a tier above the quoted plan.",
        },
      ],
      evidence:
        "Persona test in trial plus a written vendor answer naming the plan on the quote.",
      disclaimer:
        "Hypothetical Vendor A / Vendor B scenario for teaching the artifact — not a SoftwareGlimpse case study.",
    },
    glance: {
      primaryGoal: "An operable CRM access model with evidence and a review cadence",
      typicalTeam: "Ops, IT, CRM admins, and security or compliance partners",
      commonPriorities: [
        "SSO & MFA on the quoted plan",
        "Object visibility by role",
        "Contact & deal export control",
        "Email sync privacy",
        "Audit evidence you can pull",
        "Access reviews after launch",
      ],
    },
    whatsInside: [
      {
        id: "identity",
        title: "Identity: SSO & MFA",
        description:
          "Plan-scoped SSO, MFA expectations, joiner-leaver paths, and break-glass accounts.",
        icon: "key",
      },
      {
        id: "visibility",
        title: "Roles & object visibility",
        description:
          "An access map for accounts, contacts, deals, and activities — tested per persona.",
        icon: "users",
      },
      {
        id: "exports",
        title: "Export controls",
        description:
          "Who can extract contacts and deals via CSV, reports, or connected apps.",
        icon: "download",
      },
      {
        id: "sync-privacy",
        title: "Email sync privacy",
        description:
          "What syncs from mailboxes, who can read it on records, and how to disconnect.",
        icon: "mail",
      },
      {
        id: "audit",
        title: "Audit logs & evidence",
        description:
          "Events you need, retention on your plan, and an export you pulled yourself.",
        icon: "file",
      },
      {
        id: "reviews",
        title: "Access reviews",
        description:
          "Cadence, inputs, signer, and remediation tracked to closure.",
        icon: "repeat",
      },
      {
        id: "fs-niche",
        title: "Client-book reviews (FS)",
        description:
          "Optional rows for advisor books, export attestations, and leaver reassignment.",
        icon: "shield",
      },
    ],
    evidenceRules: {
      countsAs: [
        "Written vendor answer naming the plan on your quote",
        "Official documentation for that plan or edition",
        "Configuration observed in trial or sandbox (persona test)",
        "A sample audit export you pulled yourself",
        "A runbook that has been tested at least once",
      ],
      doesNotCount: [
        "Compliance badge or trust-page logo",
        "Sales assurance with no plan scope",
        "A control demonstrated on a higher tier than you would buy",
        "Roadmap commitment",
        "“Your data is stored securely” with no control named",
      ],
    },
    challenges: [],
    outcomes: [
      {
        id: "named-model",
        title: "A written CRM access model",
        description:
          "Roles, object visibility, and sensitive fields are documented rather than assumed.",
      },
      {
        id: "plan-truth",
        title: "Plan-true identity and export controls",
        description:
          "Every control is confirmed on the commercial plan you would actually buy.",
      },
      {
        id: "export-discipline",
        title: "Export discipline on contacts and deals",
        description:
          "Who can extract customer and pipeline data is limited, named, and preferably auditable.",
      },
      {
        id: "review-cadence",
        title: "A review cadence that outlives go-live",
        description:
          "Access reviews have inputs, an owner, a signer, and remediation tracked to closure.",
      },
    ],
    priorities: [],
    workflowSteps: [
      {
        id: "access-map",
        label: "Draft the access map",
        detail:
          "Roles against view, edit, export, and admin on accounts, contacts, deals, and activities.",
      },
      {
        id: "identity",
        label: "Identity",
        detail:
          "Confirm SSO and MFA on the quoted plan, plus joiner and leaver paths.",
      },
      {
        id: "roles",
        label: "Roles",
        detail:
          "Configure least privilege in trial and test visibility as each persona.",
      },
      {
        id: "exports",
        label: "Export controls",
        detail:
          "Limit contact and deal extraction, inventory connected apps, and document sync privacy.",
      },
      {
        id: "audit",
        label: "Audit logs",
        detail:
          "List the events you need and pull a sample evidence export yourself.",
      },
      {
        id: "reviews",
        label: "Access reviews",
        detail:
          "Schedule the recurring review with defined inputs, an owner, and a signer.",
      },
    ],
    artifactSections: [
      {
        id: "identity",
        title: "1. Identity: SSO & MFA on the quoted plan",
        accent: "green",
        intro:
          "How people sign in, and how quickly access ends — confirmed against the plan on your quote.",
        items: [
          {
            id: "1.1",
            label: "SSO availability confirmed on the quoted plan",
            whyItMatters:
              "Identity features shown in demos are frequently sold on a higher tier than the quote.",
            required: true,
            testScenario:
              "Get a written answer naming the plan on your quote and check it against the vendor’s own documentation.",
            owner: "IT / security",
          },
          {
            id: "1.2",
            label: "MFA expectation written",
            whyItMatters:
              "“SSO handles it” is not a policy until you name where MFA is enforced.",
            required: true,
            testScenario:
              "Record whether MFA comes from your identity provider, the CRM, or both — and list exceptions with expiry dates.",
            owner: "IT",
          },
          {
            id: "1.3",
            label: "Joiner and leaver paths defined",
            whyItMatters:
              "Most stale CRM access starts with a manual joiner-leaver process nobody owns.",
            required: true,
            testScenario:
              "Trace one joiner and one leaver end to end, including mobile sessions and API tokens.",
            owner: "IT / HR ops",
          },
          {
            id: "1.4",
            label: "Same-day leaver disablement tested",
            whyItMatters:
              "A leaver keeping access to the customer book is the sharpest risk CRM carries.",
            required: true,
            testScenario:
              "Deactivate a test user on ticket close, then confirm sign-in and token access both fail.",
            owner: "IT / CRM admin",
          },
          {
            id: "1.5",
            label: "Local and break-glass admin accounts limited",
            whyItMatters:
              "Accounts outside SSO are the ones nobody reviews.",
            required: true,
            testScenario:
              "Count non-SSO admin logins, name an owner for each, and justify why each still exists.",
            owner: "CRM admin",
          },
          {
            id: "1.6",
            label: "Session and idle policy recorded",
            whyItMatters:
              "Shared or unattended devices make session length a real control.",
            required: false,
            testScenario:
              "Record the session controls available on your plan and the value you intend to set.",
            owner: "IT",
          },
          {
            id: "1.7",
            label: "Identity escalation owner named",
            whyItMatters:
              "An SSO failure blocks the entire sales floor at once.",
            required: true,
            testScenario:
              "Name who handles CRM identity incidents and confirm they are reachable when it matters.",
            owner: "Project lead",
          },
        ],
      },
      {
        id: "visibility",
        title: "2. Roles & object visibility",
        accent: "blue",
        intro:
          "Least privilege on accounts, contacts, deals, and activities — tested, not assumed.",
        items: [
          {
            id: "2.1",
            label: "Access map drafted: roles against objects",
            whyItMatters:
              "Everything else in this checklist is guesswork until visibility is written down.",
            required: true,
            testScenario:
              "Build a grid of AE, manager, admin, CS, and read-only against view, edit, export, and admin for each CRM object.",
            owner: "Ops + security",
          },
          {
            id: "2.2",
            label: "Production role list matches the map",
            whyItMatters:
              "Roles that exist only in production drift away from the design immediately.",
            required: true,
            testScenario:
              "List configured roles and confirm each appears on the access map with the same name.",
            owner: "CRM admin",
          },
          {
            id: "2.3",
            label: "Contact visibility tested per persona",
            whyItMatters:
              "Broad contact visibility is the most common oversharing default.",
            required: true,
            testScenario:
              "Sign in as an AE and confirm you can reach exactly the contacts the map allows — and no more.",
            owner: "CRM admin",
          },
          {
            id: "2.4",
            label: "Deal visibility tested per persona",
            whyItMatters:
              "Pipeline amounts are visible to more people than most teams intend.",
            required: true,
            testScenario:
              "Compare AE and manager deal views against the map, including restricted or private deals.",
            owner: "CRM admin",
          },
          {
            id: "2.5",
            label: "Account sharing model documented",
            whyItMatters:
              "Coverage models — households, pooled accounts, multi-client agencies — are where sharing rules get complicated.",
            required: true,
            testScenario:
              "Write how shared accounts work in your business and confirm the configuration matches it.",
            owner: "Ops",
          },
          {
            id: "2.6",
            label: "Field-level restriction confirmed on the plan",
            whyItMatters:
              "Restricting a single sensitive field is often a higher-tier capability.",
            required: false,
            testScenario:
              "Ask which plan supports field-level restriction and record the gap if yours does not.",
            owner: "Security",
          },
          {
            id: "2.7",
            label: "Full admin roster minimized",
            whyItMatters:
              "Every extra full admin is an unaudited export path.",
            required: true,
            testScenario:
              "List full admins, move those who need less to a narrower role, and justify who remains.",
            owner: "Ops lead",
          },
          {
            id: "2.8",
            label: "Permission-change approver named",
            whyItMatters:
              "Role edits requested in chat are how least privilege erodes.",
            required: true,
            testScenario:
              "Name who approves role changes after go-live and where requests are recorded.",
            owner: "CRM admin",
          },
        ],
      },
      {
        id: "exports",
        title: "3. Export controls for contacts & deals",
        accent: "indigo",
        intro: "Every path by which CRM lists leave the system.",
        items: [
          {
            id: "3.1",
            label: "Roles allowed to export contacts defined",
            whyItMatters:
              "A contact export is your customer list leaving the CRM.",
            required: true,
            testScenario:
              "Attempt a contact export as each persona in trial and reduce the capability to the named list.",
            owner: "Security + admin",
          },
          {
            id: "3.2",
            label: "Roles allowed to export deals defined",
            whyItMatters:
              "Pipeline and forecast extracts are commercially sensitive.",
            required: true,
            testScenario:
              "Attempt a deal export as an AE and as a manager, then compare with the access map.",
            owner: "Security + admin",
          },
          {
            id: "3.3",
            label: "Export audit availability confirmed on the plan",
            whyItMatters:
              "Without export events you cannot answer who took what.",
            required: true,
            testScenario:
              "Pull an audit record for an export you performed yourself on the quoted plan.",
            owner: "Security",
          },
          {
            id: "3.4",
            label: "Report and dashboard sharing reviewed",
            whyItMatters:
              "A widely shared report is an export with extra steps.",
            required: true,
            testScenario:
              "Review shared folders and dashboards for contact data or deal amounts visible more broadly than intended.",
            owner: "CRM admin",
          },
          {
            id: "3.5",
            label: "Connected apps and scopes inventoried",
            whyItMatters:
              "Integrations often hold read access to every contact and deal.",
            required: true,
            testScenario:
              "List connected apps with their scopes and owners, and remove any nobody claims.",
            owner: "IT / admin",
          },
          {
            id: "3.6",
            label: "API tokens owned and rotatable",
            whyItMatters:
              "A token created in a personal account outlives the person.",
            required: true,
            testScenario:
              "Confirm each token has a named owner and a documented rotation or revocation path.",
            owner: "IT",
          },
          {
            id: "3.7",
            label: "Migration and cutover extracts controlled",
            whyItMatters:
              "Legacy export files usually sit in the least protected place in the company.",
            required: false,
            testScenario:
              "Confirm where cutover files live, who can open them, and when they are deleted.",
            owner: "Security / ops",
          },
        ],
      },
      {
        id: "sync-privacy",
        title: "4. Email & calendar sync privacy",
        accent: "purple",
        intro:
          "What mailbox data lands on CRM records, and who can read it there.",
        items: [
          {
            id: "4.1",
            label: "Sync scope documented",
            whyItMatters:
              "Users assume only metadata syncs; products often capture more.",
            required: true,
            testScenario:
              "Record what syncs — metadata, subject, body, attachments — which folders, and where it is stored.",
            owner: "Ops + security",
          },
          {
            id: "4.2",
            label: "Who can read synced email on records defined",
            whyItMatters:
              "Mailbox content on a shared timeline is a privacy decision, not a feature setting.",
            required: true,
            testScenario:
              "Check as AE, manager, and admin who can open synced messages on a contact and a deal.",
            owner: "Ops + security",
          },
          {
            id: "4.3",
            label: "Privacy brief delivered before sync enablement",
            whyItMatters: "Consent after connection is not consent.",
            required: true,
            testScenario:
              "Confirm the training plan briefs what syncs, who sees it, and how to disconnect — before mailboxes connect.",
            owner: "Enablement",
          },
          {
            id: "4.4",
            label: "Disconnect and retention behavior tested",
            whyItMatters:
              "Stopping sync rarely removes what has already synced.",
            required: true,
            testScenario:
              "Disconnect a test mailbox and confirm what remains visible on records afterwards.",
            owner: "CRM admin",
          },
          {
            id: "4.5",
            label: "Attachment visibility reviewed",
            whyItMatters:
              "Attachments carry the sensitive content people forget is syncing.",
            required: false,
            testScenario:
              "Check who can open files logged from email, then restrict or accept the risk in writing.",
            owner: "Security",
          },
          {
            id: "4.6",
            label: "Private and personal folders excluded",
            whyItMatters:
              "Syncing everything sweeps in correspondence that was never a business record.",
            required: false,
            testScenario:
              "Confirm which folders are excluded and how a user marks a message private.",
            owner: "Ops + security",
          },
        ],
      },
      {
        id: "audit",
        title: "5. Audit logs & evidence",
        accent: "slate",
        intro:
          "Prove who had access and what they did — with evidence you can extract.",
        items: [
          {
            id: "5.1",
            label: "Required audit events listed",
            whyItMatters:
              "Asking for “audit logs” gets you whatever the vendor happens to log.",
            required: true,
            testScenario:
              "List the events you need: sign-in, permission change, contact and deal export, admin configuration change.",
            owner: "Security",
          },
          {
            id: "5.2",
            label: "Log retention on the plan recorded",
            whyItMatters:
              "Short retention closes the investigation window before you notice a problem.",
            required: true,
            testScenario:
              "Record the retention period for your plan from documentation or a written answer.",
            owner: "Security",
          },
          {
            id: "5.3",
            label: "Evidence export path proven",
            whyItMatters: "A log you cannot extract is not evidence.",
            required: true,
            testScenario:
              "Export a sample audit set yourself during trial and store it with the checklist.",
            owner: "Security",
          },
          {
            id: "5.4",
            label: "Anomaly escalation route written",
            whyItMatters:
              "Unusual admin activity or an export spike needs somewhere to go.",
            required: true,
            testScenario:
              "Name who investigates and test the contact path once.",
            owner: "Security",
          },
          {
            id: "5.5",
            label: "Control gaps accepted in writing",
            whyItMatters:
              "An unacknowledged gap becomes a surprise during an incident.",
            required: true,
            testScenario:
              "For each missing control, record the decision, the owner, and any compensating control.",
            owner: "Security / project lead",
          },
        ],
      },
      {
        id: "reviews",
        title: "6. Access reviews after go-live",
        accent: "amber",
        intro:
          "Access hygiene decays continuously; reviews only happen when they are scheduled.",
        items: [
          {
            id: "6.1",
            label: "Review cadence set with calendar holds",
            whyItMatters:
              "A cadence with no holds becomes an intention nobody honors.",
            required: true,
            testScenario:
              "Put the first review on the calendar at a cadence you can sustain, and repeat the hold.",
            owner: "Ops lead",
          },
          {
            id: "6.2",
            label: "Review inputs defined",
            whyItMatters:
              "A review without user, role, and export lists is just a conversation.",
            required: true,
            testScenario:
              "List the extracts you will pull: users with last sign-in, roles, admin roster, connected apps, export-capable roles.",
            owner: "CRM admin",
          },
          {
            id: "6.3",
            label: "Reviewer and signer named",
            whyItMatters: "Reviews with no signer produce no decisions.",
            required: true,
            testScenario:
              "Name who runs the review and who signs the outcome.",
            owner: "Project lead",
          },
          {
            id: "6.4",
            label: "Remediation tracked to closure",
            whyItMatters:
              "Findings that are not tracked reappear at the next review.",
            required: true,
            testScenario:
              "Confirm removals and role changes from the last review were completed and dated.",
            owner: "Ops lead",
          },
          {
            id: "6.5",
            label: "Re-run triggered by material change",
            whyItMatters:
              "New integrations and reorganizations change the access picture faster than time does.",
            required: true,
            testScenario:
              "Trigger a review after changes to SSO, the role model, email sync, or integrations.",
            owner: "Security",
          },
          {
            id: "6.6",
            label: "Post-go-live re-run scheduled",
            whyItMatters:
              "The first weeks of production always create access exceptions.",
            required: false,
            testScenario:
              "Book a re-run 30 to 90 days after launch and record the date.",
            owner: "Implementation lead",
          },
        ],
      },
      {
        id: "fs-niche",
        title: "7. Niche: client-book reviews (financial services)",
        accent: "rose",
        intro:
          "Optional rows for teams where advisor books and client data demand tighter hygiene. Operational only — your compliance partner interprets the requirements.",
        items: [
          {
            id: "7.1",
            label: "Advisor client-book visibility documented",
            whyItMatters:
              "Cross-book browsing is the visibility question FS teams get asked about most.",
            required: false,
            testScenario:
              "Write which households or accounts each advisor may see, then test whether cross-book access is blocked.",
            owner: "Ops + compliance partner",
          },
          {
            id: "7.2",
            label: "Export-capable roles re-attested on a cadence",
            whyItMatters:
              "Client-list export rights need a periodic, recorded confirmation.",
            required: false,
            testScenario:
              "Re-attest the export-capable roster on a fixed cadence and store the attestation with a date.",
            owner: "Compliance / security",
          },
          {
            id: "7.3",
            label: "Leaver client-book reassignment runbook",
            whyItMatters:
              "An advisor departure moves whole books of contacts and deals at once.",
            required: false,
            testScenario:
              "Run the reassignment in sandbox and confirm the audit trail shows who moved what.",
            owner: "Ops + CRM admin",
          },
          {
            id: "7.4",
            label: "Sample access evidence for client records",
            whyItMatters:
              "You may be asked to show who viewed or exported client data.",
            required: false,
            testScenario:
              "Pull a sample showing access to sensitive contact fields, or record the gap and its owner.",
            owner: "Security / compliance",
          },
          {
            id: "7.5",
            label: "Compliance partner review recorded",
            whyItMatters:
              "This checklist is operational; regulatory interpretation is not its job.",
            required: false,
            testScenario:
              "Have your compliance or legal partner review the completed rows and record the date.",
            owner: "Security / legal partner",
          },
        ],
      },
    ],
    downloadFiles: [
      {
        href: "/resources/crm-security-checklist.md",
        label: "Download Markdown",
        format: "md",
      },
    ],
    faq: [
      {
        question: "How is this different from the evaluation checklist?",
        answer:
          "The evaluation checklist keeps light gates — can a seller do admin actions, is SSO needed, how much admin effort is there. This checklist is the deeper pass: a written access map, plan-scoped identity answers, export controls on contacts and deals, sync privacy, audit evidence you pulled yourself, and a review cadence.",
      },
      {
        question: "Is this legal or compliance advice?",
        answer:
          "No. It is an operational checklist for evaluating and running CRM access controls. Bring in your security, legal, or compliance partners for regulatory interpretation, particularly for the client-book section.",
      },
      {
        question: "When should we run it?",
        answer:
          "During validation, sending identical questions to every finalist, and again as a pre-go-live gate. Re-run it after changes to SSO, the role model, email sync, or integrations.",
      },
      {
        question: "What if a vendor cannot audit contact and deal exports?",
        answer:
          "Record it as a gap with an owner and a compensating control, or treat it as a disqualifier based on your access map. Note the answer next to the plan on your quote — unread storage is not a control.",
      },
      {
        question: "Do we need a financial-services-specific CRM?",
        answer:
          "Not automatically. Many teams meet their needs with a general CRM that supports roles, sharing rules, export controls, and auditability, plus disciplined process. Use the client-book section when advisor visibility and export attestations matter, and verify each answer with the vendor and your own owners.",
      },
      {
        question: "How does this relate to the training plan?",
        answer:
          "Training teaches people how to work contacts and deals; this checklist decides what they can see, export, and reveal through mailbox sync. Keep role names identical across both so the curriculum matches least privilege.",
      },
    ],
    heroVisual: {
      src: "/resources/crm-security-checklist-hero.png",
      alt: "Educational CRM security checklist interface covering SSO and MFA, account, contact and deal visibility, export controls, email-sync privacy, and access-review cadence.",
      caption:
        "Access model first — visibility, exports, sync privacy, and reviews on the plan you would buy.",
    },
    needsVisual: {
      src: "/resources/crm-security-checklist-needs.png",
      alt: "Diagram pairing common CRM security gaps — shared logins, open exports, stale user access — with fixes: SSO and unique accounts, export controls with audit, and recurring role reviews.",
      caption:
        "Common gaps on the left, the controls this checklist gates on the right.",
    },
    workflowVisual: {
      src: "/resources/crm-security-checklist-workflow.png",
      alt: "Five-stage security workflow: identity, roles, export controls, audit logs, quarterly review.",
      caption:
        "Identity, roles, export controls, audit logs, then a review you repeat.",
    },
    useBefore: ["crm-evaluation-checklist"],
    useWith: ["crm-rfp-template", "crm-training-plan"],
    useNext: ["crm-business-case-template", "crm-implementation-checklist"],
    journeySlugs: [
      "crm-evaluation-checklist",
      "crm-security-checklist",
      "crm-business-case-template",
      "crm-implementation-checklist",
    ],
    relatedResourceSlugs: [
      "crm-evaluation-checklist",
      "crm-rfp-template",
      "crm-implementation-checklist",
      "crm-training-plan",
    ],
    featuredGuideHrefs: [
      "/guides/financial-services-crm-security/",
      "/guides/crm-vendor-evaluation/",
      "/guides/crm-implementation/",
    ],
    relatedToolHrefs: [
      { href: "/tools/crm-finder/", label: "CRM Software Finder" },
      {
        href: "/tools/crm-implementation-planner/",
        label: "CRM Implementation Planner",
      },
    ],
    primaryCta: {
      href: "/resources/crm-security-checklist.xlsx",
      label: "Download Excel (Editable checklist)",
    },
    secondaryCta: {
      href: "/resources/crm-security-checklist.pdf",
      label: "Download PDF (Printable version)",
    },
    categorySlug: "crm",
    lastReviewedAt: "2026-08-15",
  },
};
