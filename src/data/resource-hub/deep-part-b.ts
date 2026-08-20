import type { ResourceHubProfile } from "@/domain";

type Depth = Partial<Omit<ResourceHubProfile, "resourceSlug">>;

/**
 * Depth layer B for CRM resource hub pages (`/resources/[slug]`).
 * Educational / operational — no invented rankings, prices, or product endorsements.
 */
export const resourceDepthPartB: Record<string, Depth> = {
  "crm-demo-checklist": {
    displayTitle: "CRM Demo Checklist",
    badgeLabel: "Checklist",
    toolkitLabel: "CRM Evaluation Toolkit",
    tagline: "Run the same buyer-led demo script with every vendor.",
    heroExplanation:
      "Use this during vendor demos to control the agenda, force the same live CRM tasks on every product, and mark results the same day — before the next session overwrites your memory.",
    overview:
      "A demo-day artifact for shortlisted CRMs. You own the agenda, the vendor works on your stage names and sample records, and each scenario gets a same-day mark with evidence. Requirements definition, weighted scoring, trial depth, and implementation planning live in related resources — not here.",
    whoThisIsFor:
      "Buying teams with a shortlist and a written requirements list who are about to sit through two or more vendor demos. Best for the facilitator, the scorer, and the seller, manager, and admin who will live with the choice.",
    whatMattersIntro:
      "Prioritize what you watch happen on records: object creation, your stages, owner and next step, activity logging, email landing on the right record, and the manager board. Everything else is a slide.",
    howToUse:
      "Pick the scenarios that match your must-haves. Send the agenda, stage list, and sample record names 48 hours ahead. Name a facilitator and a separate scorer. Run the same script with every vendor, mark each row the same day, and transfer results to the Vendor Scorecard for weighting.",
    workedExampleStructured: {
      title: "Worked example",
      requirement:
        "A seller advances a deal through our stage names, with an owner and a dated next step visible on the record.",
      vendors: [
        {
          name: "Vendor A",
          result: "PASS",
          note: "Ran our stage list in the session; owner and next-step date appeared on the deal and in a board filter.",
        },
        {
          name: "Vendor B",
          result: "PARTIAL",
          note: "Advanced a deal on their sample pipeline but could not show our stage names during the session.",
        },
      ],
      evidence:
        "Observed live in the demo session; screenshot filed the same working day.",
      disclaimer:
        "Hypothetical Vendor A / Vendor B scenario for teaching the artifact — not a SoftwareGlimpse case study.",
    },
    glance: {
      primaryGoal: "The same live demo script and same-day scores for every vendor",
      typicalTeam: "Facilitator, scorer, seller, sales manager, CRM admin",
      commonPriorities: [
        "Buyer-owned agenda",
        "Live record tasks",
        "Your stage names",
        "Email on the right record",
        "Manager views",
        "Same-day marks",
      ],
    },
    whatsInside: [
      {
        id: "agenda",
        title: "Agenda control",
        description:
          "Time-boxed blocks so live CRM work — not the company story — fills the session.",
        icon: "clock",
      },
      {
        id: "live-tasks",
        title: "Live record tasks",
        description:
          "Create account, contact, and deal; advance your stages; set owner and next step.",
        icon: "workflow",
      },
      {
        id: "email-proof",
        title: "Email & activity proof",
        description:
          "Watch a message and an activity land on the intended contact or deal.",
        icon: "mail",
      },
      {
        id: "manager-views",
        title: "Manager views",
        description:
          "Pipeline board, stuck deals, and forecast built from the session’s own records.",
        icon: "chart",
      },
      {
        id: "admin-live",
        title: "Admin change in-session",
        description:
          "One field, stage rule, or permission changed live — not promised offline.",
        icon: "shield",
      },
      {
        id: "same-day-score",
        title: "Same-day scoring",
        description:
          "Pass / Partial / Fail / Not tested with evidence before the next vendor.",
        icon: "check",
      },
      {
        id: "follow-ups",
        title: "Follow-up log",
        description:
          "Open questions with an owner, a due date, and whether they block the next step.",
        icon: "list",
      },
    ],
    evidenceRules: {
      countsAs: [
        "A task completed live on visible records during the session",
        "Screenshot or session recording with a timestamp",
        "Written vendor answer sent after the demo",
        "Product documentation for the edition you were quoted",
      ],
      doesNotCount: [
        "A slide claiming the capability",
        "“We can show that in a later workshop”",
        "Marketplace listings or logo walls",
        "Notes written from memory days afterwards",
      ],
    },
    challenges: [],
    outcomes: [
      {
        id: "comparable-sessions",
        title: "Comparable sessions",
        description:
          "Every vendor runs the same scenarios on your stage names and sample records.",
      },
      {
        id: "observed-not-claimed",
        title: "Observed, not claimed",
        description:
          "Each mark points at something the room watched happen on a record.",
      },
      {
        id: "clean-scorecard-handoff",
        title: "Clean scorecard handoff",
        description:
          "Same-day results transfer into the Vendor Scorecard without re-litigating the demo.",
      },
    ],
    priorities: [],
    workflowSteps: [
      {
        id: "pick-scenarios",
        label: "Pick the scenarios",
        detail:
          "Choose 6–10 rows from your must-haves; drop anything you cannot check in one session.",
      },
      {
        id: "send-brief",
        label: "Send the brief",
        detail:
          "Agenda, stage names, exit checkpoints, and sample record names 48 hours ahead.",
      },
      {
        id: "assign-roles",
        label: "Assign roles",
        detail:
          "One facilitator, one scorer, plus the seller, manager, and admin who will use the CRM.",
      },
      {
        id: "run-agenda",
        label: "Run the agenda",
        detail:
          "Hold the time boxes; hand control to your people for at least one task.",
      },
      {
        id: "score-same-day",
        label: "Score the same day",
        detail:
          "Mark every row with evidence before the next vendor session starts.",
      },
      {
        id: "follow-up-decide",
        label: "Follow up and hand off",
        detail:
          "Send written questions, then transfer results to the Vendor Scorecard.",
      },
    ],
    artifactSections: [
      {
        id: "prep-agenda",
        title: "1. Demo prep & agenda",
        accent: "green",
        intro:
          "Set the session up so the vendor demonstrates your process, not their showcase.",
        items: [
          {
            id: "1.1",
            label: "Buyer-owned agenda sent in advance",
            whyItMatters:
              "Vendor-led agendas drift into feature tours you cannot compare.",
            required: true,
            testScenario:
              "Send a timed agenda 48 hours ahead: short intro, live task block, admin block, manager block, Q&A.",
            detail:
              "Cap the company story around ten minutes and give the live task block most of the session.",
            owner: "Facilitator",
            doneWhen: "Vendor confirms the agenda before the session.",
          },
          {
            id: "1.2",
            label: "Stage names and sample records shared",
            whyItMatters:
              "Vendors can only run your process if they have your names and records.",
            required: true,
            testScenario:
              "Send your stage list, exit checkpoints, and anonymized account, contact, and deal names with the agenda.",
            owner: "RevOps",
            doneWhen: "Vendor confirms the sample records exist in their sandbox.",
          },
          {
            id: "1.3",
            label: "Identical script booked for every vendor",
            whyItMatters:
              "Sessions that cover different ground cannot be compared afterwards.",
            required: true,
            testScenario:
              "Book the same session length and the same scenario list for each shortlisted vendor.",
            owner: "Evaluation lead",
          },
          {
            id: "1.4",
            label: "Mailbox or calendar access arranged",
            whyItMatters:
              "Email sync can only be proven with a mailbox someone in the room controls.",
            required: false,
            testScenario:
              "Confirm whether a buyer mailbox can connect for the session, or agree the vendor demonstrates on theirs and you retest in trial.",
            owner: "IT",
          },
          {
            id: "1.5",
            label: "Scorer named and score sheet ready",
            whyItMatters:
              "Nobody scores accurately while also running the room.",
            required: true,
            testScenario:
              "Name one scorer and share a blank sheet with one row per scenario before the session opens.",
            owner: "Evaluation lead",
            doneWhen: "Blank sheet circulated to attendees.",
          },
        ],
      },
      {
        id: "live-tasks",
        title: "2. Live CRM tasks",
        accent: "blue",
        intro:
          "Run these in the same order with every vendor. Mark only what appears on a record.",
        items: [
          {
            id: "2.1",
            label: "Create account, contact, and deal live",
            whyItMatters:
              "Shows whether the objects and required fields fit your process before anything else is discussed.",
            required: true,
            testScenario:
              "Ask the vendor to create all three from your sample pack, with required fields set and the records linked on save.",
          },
          {
            id: "2.2",
            label: "Advance a deal through your stages",
            whyItMatters:
              "Stage names and exit checkpoints are where generic demos usually break down.",
            required: true,
            testScenario:
              "Move a deal through two of your named stages; ask how an exit checkpoint such as next step or amount is enforced or warned.",
          },
          {
            id: "2.3",
            label: "Set an owner and a dated next step",
            whyItMatters:
              "Unowned deals with no next action are the most common pipeline failure.",
            required: true,
            testScenario:
              "Set owner and next-step date on the open deal, then confirm both appear in a list or board filter.",
          },
          {
            id: "2.4",
            label: "Log an activity on the intended record",
            whyItMatters:
              "Daily adoption depends on activity capture landing where people look for it.",
            required: true,
            testScenario:
              "Log a call or note on the contact and confirm it appears on the related deal timeline.",
          },
          {
            id: "2.5",
            label: "Show an email landing on a contact or deal",
            whyItMatters:
              "Email sync is the most common gap between what a slide claims and what the edition does.",
            required: true,
            testScenario:
              "Sync or log one message, point at the record it lands on, and note which edition the behaviour requires.",
          },
          {
            id: "2.6",
            label: "Merge a duplicate contact or account",
            whyItMatters:
              "Merge behaviour decides whether your data stays usable after import.",
            required: false,
            testScenario:
              "Merge two sample records and confirm related deals and activities follow the surviving record.",
          },
        ],
      },
      {
        id: "manager-admin",
        title: "3. Manager & admin views",
        accent: "purple",
        intro:
          "The people who coach the pipeline and maintain the system should see their own screens.",
        items: [
          {
            id: "3.1",
            label: "Pipeline board filtered by owner and stage",
            whyItMatters:
              "Managers need weekly status without exporting to a spreadsheet.",
            required: true,
            testScenario:
              "Filter the board by owner and stage using the deals created earlier in the session.",
          },
          {
            id: "3.2",
            label: "Stuck or ageing deals surfaced",
            whyItMatters:
              "Coaching depends on finding the deals nobody has touched.",
            required: true,
            testScenario:
              "Ask for a view of open deals with no next step, or with time in stage above a threshold you name.",
          },
          {
            id: "3.3",
            label: "One admin change made live",
            whyItMatters:
              "Ongoing admin effort is part of the product, and you only see it by watching someone do it.",
            required: true,
            testScenario:
              "Ask the vendor to add a field to the deal layout or change one permission during the session, not offline.",
          },
          {
            id: "3.4",
            label: "Forecast view built from session deals",
            whyItMatters:
              "Forecast screens on slides rarely match what the quoted edition includes.",
            required: false,
            testScenario:
              "Open a forecast or commit view containing the deals created live, or record which edition unlocks it.",
          },
        ],
      },
      {
        id: "roles",
        title: "4. Roles in the room",
        accent: "teal",
        intro:
          "A demo where only the vendor touches the keyboard tells you very little.",
        items: [
          {
            id: "4.1",
            label: "A seller runs at least one task",
            whyItMatters:
              "Vendor-driven clicks hide how the product feels for the people who use it daily.",
            required: true,
            testScenario:
              "Hand control to a seller for one scenario — creating a deal or logging an activity — and note how long it took.",
          },
          {
            id: "4.2",
            label: "A manager asks their own questions",
            whyItMatters:
              "Forecast and coaching needs get lost when one person speaks for everybody.",
            required: false,
            testScenario:
              "Reserve time for the manager to drive the pipeline and stuck-deal views themselves.",
          },
          {
            id: "4.3",
            label: "The future admin attends",
            whyItMatters:
              "Admin burden lands on a named person, and that person should watch the work.",
            required: true,
            testScenario:
              "Confirm the intended admin joins and asks about users, fields, stages, and weekly hygiene.",
          },
        ],
      },
      {
        id: "scoring",
        title: "5. Same-day scoring & follow-up",
        accent: "navy",
        intro:
          "Close the session out before the next vendor overwrites what you saw.",
        items: [
          {
            id: "5.1",
            label: "Every scenario marked before the next session",
            whyItMatters:
              "Memory fades fast, and the loudest voice wins late debriefs.",
            required: true,
            testScenario:
              "Mark Pass / Partial / Fail / Not tested for each row within the same working day.",
          },
          {
            id: "5.2",
            label: "Evidence attached to each result",
            whyItMatters:
              "A result without proof cannot be defended in the decision meeting.",
            required: true,
            testScenario:
              "Attach a screenshot, recording timestamp, or written vendor answer to every row that is not Not tested.",
          },
          {
            id: "5.3",
            label: "Unrun scenarios recorded as Not tested",
            whyItMatters:
              "Inventing a Pass to fill a gap destroys comparability across vendors.",
            required: true,
            testScenario:
              "Where the vendor declined or ran out of time, mark Not tested and write the reason.",
          },
          {
            id: "5.4",
            label: "Open questions logged with owner and due date",
            whyItMatters:
              "Gaps found in a demo tend to disappear until contract pressure brings them back.",
            required: true,
            testScenario:
              "Send written follow-ups the same day for anything a must-have depends on, and note what it blocks.",
          },
          {
            id: "5.5",
            label: "Results transferred to the scorecard",
            whyItMatters:
              "This checklist records what you observed; the scorecard applies weights and compares.",
            required: true,
            testScenario:
              "Copy the marks and evidence into the Vendor Scorecard rather than re-scoring from memory later.",
          },
        ],
      },
    ],
    downloadFiles: [
      {
        href: "/resources/crm-demo-checklist.md",
        label: "Download Markdown",
        format: "md",
      },
    ],
    faq: [
      {
        question: "What does this checklist deliberately leave out?",
        answer:
          "Requirements definition belongs in the CRM Requirements Template, and weighted comparison belongs in the Vendor Scorecard. This checklist covers one thing: what you make each vendor do live in the demo, and how you record it the same day.",
      },
      {
        question: "Should we send vendors the whole scoring sheet?",
        answer:
          "Send the agenda, stage names, exit checkpoints, and sample record names so they can prepare a sandbox. Keep the weights and the pass bar internal so the session tests the product rather than the vendor’s ability to read your rubric.",
      },
      {
        question: "How long should a demo be?",
        answer:
          "Most teams work well with 60–90 minutes: a short intro, most of the time on live record tasks, a brief admin and manager block, then Q&A. Longer sessions tend to drift into feature tourism that nobody can score.",
      },
      {
        question: "What if the vendor cannot run a scenario live?",
        answer:
          "Mark it Partial or Not tested with a reason, and log a written follow-up. Do not accept a promise of a later workshop as a Pass for a must-have — carry it into the trial plan instead.",
      },
      {
        question: "Can we change the script between vendors?",
        answer:
          "Only with explicit agreement and a note on what changed and why. Silent changes to the scenarios are the fastest way to end up with results you cannot compare.",
      },
      {
        question: "Who should be in the room?",
        answer:
          "A facilitator, a separate scorer, a seller who will create deals, a manager who runs pipeline reviews, and whoever will administer the CRM. Add IT or security if email sync or SSO is in scope. Keep it small enough to stay disciplined.",
      },
      {
        question: "How does this connect to a trial?",
        answer:
          "Anything marked Partial, Fail, or Not tested becomes a trial task. Demo scenarios prove the product can do it; the trial proves your team can do it on real data.",
      },
    ],
    heroVisual: {
      src: "/resources/crm-demo-checklist-hero.png",
      alt: "CRM demo checklist showing a buyer-owned agenda, live scenario rows, and Pass / Partial / Fail marks with evidence.",
      caption:
        "One script, one scorer, and a mark on every row before the next vendor.",
    },
    needsVisual: {
      src: "/resources/crm-demo-checklist-needs.png",
      alt: "What’s inside the CRM Demo Checklist: agenda control, live record tasks, email proof, manager views, admin change, same-day scoring.",
      caption: "A demo-day script — not a requirements workbook.",
    },
    workflowVisual: {
      src: "/resources/crm-demo-checklist-workflow.png",
      alt: "How to use: pick scenarios, send the brief, assign roles, run the agenda, score the same day, hand off to the scorecard.",
      caption: "Demos sit between the shortlist and weighted scoring.",
    },
    useBefore: ["crm-requirements-template"],
    useWith: ["crm-evaluation-checklist"],
    useNext: ["crm-vendor-scorecard", "crm-comparison-worksheet"],
    journeySlugs: [
      "crm-requirements-template",
      "crm-demo-checklist",
      "crm-evaluation-checklist",
      "crm-vendor-scorecard",
      "crm-business-case-template",
    ],
    relatedResourceSlugs: [
      "crm-evaluation-checklist",
      "crm-vendor-scorecard",
      "crm-requirements-template",
      "crm-comparison-worksheet",
    ],
    featuredGuideHrefs: [
      "/guides/crm-demo-guide/",
      "/guides/crm-trial-evaluation/",
      "/guides/crm-vendor-questions/",
    ],
    relatedToolHrefs: [
      { href: "/tools/crm-vendor-scorecard/", label: "CRM Vendor Scorecard" },
      {
        href: "/tools/crm-requirements-builder/?start=1",
        label: "CRM Requirements Builder",
      },
      { href: "/tools/crm-finder/", label: "CRM Finder" },
    ],
    primaryCta: {
      href: "/resources/crm-demo-checklist.xlsx",
      label: "Download Excel (Editable spreadsheet)",
    },
    secondaryCta: {
      href: "/resources/crm-demo-checklist.pdf",
      label: "Download PDF (Printable version)",
    },
    categorySlug: "crm",
    lastReviewedAt: "2026-08-15",
  },

  "crm-implementation-checklist": {
    displayTitle: "CRM Implementation Checklist",
    badgeLabel: "Checklist",
    toolkitLabel: "CRM Implementation Toolkit",
    tagline: "Pass each rollout gate before you start the next one.",
    heroExplanation:
      "Use this between contract signature and launch to gate scope, configuration, integrations, access, and pilot exit — so “almost live” means evidence, not optimism.",
    overview:
      "A gated rollout artifact for the build phase. Each section is an exit gate with named owners: freeze the scope, configure the objects and stages managers will coach from, connect sync and seats, then prove it on a pilot with real deals. Vendor evaluation, the data move, and launch day live in related resources — not here.",
    whoThisIsFor:
      "Implementation leads, RevOps, CRM admins, and sponsors running a first CRM or a replacement. Best when configuration, integrations, access, and enablement have to finish together rather than in whichever order is easiest.",
    whatMattersIntro:
      "Prioritize a frozen MVP, one named owner per gate, and pilot evidence from real deals. A short checklist the team updates weekly beats a long plan that only records intentions.",
    howToUse:
      "Paste the sections into your tracker and give every item one owner. Treat each section as an exit gate: do not start the next one until the required rows pass or the sponsor risk-accepts them in writing. Review weekly, and hand data cutover to the Migration Checklist and launch day to the Go-Live Checklist.",
    workedExampleStructured: {
      title: "Worked example",
      requirement:
        "Before pilot exit, every open deal in the pilot pipeline has an owner and a dated next step without admin cleanup.",
      vendors: [
        {
          name: "Rollout A",
          result: "PASS",
          note: "Pilot sellers ran live opportunities for two weeks; at exit, the stuck-deal board showed no unowned deals.",
        },
        {
          name: "Rollout B",
          result: "FAIL",
          note: "Pilot ran in a sandbox on sample data, so the gate passed on records nobody had to maintain.",
        },
      ],
      evidence:
        "Pilot exit review notes plus the CRM stuck-deal view on the pilot pipeline.",
      disclaimer:
        "Hypothetical Rollout A / Rollout B scenario for teaching the artifact — not a SoftwareGlimpse case study.",
    },
    glance: {
      primaryGoal: "A gated CRM rollout with named owners and pilot evidence",
      typicalTeam: "Implementation lead, RevOps, CRM admin, IT, sponsor",
      commonPriorities: [
        "MVP scope freeze",
        "One owner per gate",
        "Stages and next steps",
        "Sync, dedupe, seats",
        "Pilot on real deals",
        "Written risk acceptance",
      ],
    },
    whatsInside: [
      {
        id: "scope-gate",
        title: "Scope freeze",
        description:
          "A dated MVP list of objects, stages, fields, and automations — plus a parked backlog.",
        icon: "list",
      },
      {
        id: "owner-map",
        title: "Owners per workstream",
        description:
          "A person, not a department, against configuration, data, integrations, seats, and training.",
        icon: "users",
      },
      {
        id: "config-gate",
        title: "Configuration gate",
        description:
          "Objects, stages with checkpoints, ownership rules, roles, and manager boards.",
        icon: "workflow",
      },
      {
        id: "integration-gate",
        title: "Integration & access gate",
        description:
          "Email sync, duplicate rules, day-one integrations, and a seat roster that matches the cohort.",
        icon: "plug",
      },
      {
        id: "pilot-gate",
        title: "Pilot exit gate",
        description:
          "Real deals, real mailboxes, one manager review, and a signed defect decision.",
        icon: "check",
      },
      {
        id: "handoff",
        title: "Enablement & handoff",
        description:
          "Training, support intake, ongoing admin ownership, and the handoff to migration and go-live.",
        icon: "file",
      },
    ],
    evidenceRules: {
      countsAs: [
        "Demonstrated in the CRM by the named owner",
        "Pilot records created during real selling work",
        "A dated configuration note or admin runbook entry",
        "Written risk acceptance from the sponsor",
      ],
      doesNotCount: [
        "A task ticked in the project plan alone",
        "Configuration shown only on sample data in a sandbox",
        "Verbal assurance that a workstream is nearly there",
        "A gate passed because the launch date is close",
      ],
    },
    challenges: [],
    outcomes: [
      {
        id: "gated-delivery",
        title: "Gated, explainable delivery",
        description:
          "Sponsors can see exactly which exit criteria remain before the next phase starts.",
      },
      {
        id: "owned-work",
        title: "Owned work",
        description:
          "Every gate item carries a named person and a definition of done.",
      },
      {
        id: "pilot-evidence",
        title: "Pilot evidence, not sandbox comfort",
        description:
          "Problems surface on real deals with a small cohort instead of on launch day.",
      },
    ],
    priorities: [],
    workflowSteps: [
      {
        id: "freeze",
        label: "Freeze the MVP",
        detail:
          "Write and date what is in scope for launch; route everything else to a parked backlog.",
      },
      {
        id: "assign",
        label: "Assign gate owners",
        detail:
          "One person per workstream, plus the dates each gate is expected to clear.",
      },
      {
        id: "configure",
        label: "Configure and review",
        detail:
          "Build objects, stages, ownership rules, roles, and the boards managers will use.",
      },
      {
        id: "connect",
        label: "Connect sync, dedupe, and seats",
        detail:
          "Prove email sync and duplicate rules in staging; reconcile the seat roster.",
      },
      {
        id: "pilot",
        label: "Pilot on real deals",
        detail:
          "A small cohort works live opportunities and a manager runs one review from the CRM.",
      },
      {
        id: "exit",
        label: "Clear the pilot exit gate",
        detail:
          "Close or risk-accept every defect in writing, then hand off to migration and go-live.",
      },
    ],
    artifactSections: [
      {
        id: "scope-ownership",
        title: "1. Scope & ownership gate",
        accent: "green",
        intro:
          "Clear this before anyone starts building, or configuration will never stabilise.",
        items: [
          {
            id: "1.1",
            label: "MVP objects, stages, and fields frozen",
            whyItMatters:
              "Open scope means the build keeps moving and no gate can ever close.",
            required: true,
            testScenario:
              "Write a dated list of the objects, stages, fields, reports, and automations in scope for launch, and route later requests to a parked backlog.",
            owner: "Implementation lead",
            doneWhen: "Dated scope note shared with the sponsor.",
          },
          {
            id: "1.2",
            label: "One named owner per workstream",
            whyItMatters:
              "Items owned by “the team” stay amber until someone escalates.",
            required: true,
            testScenario:
              "Name a person for configuration, data, integrations, seats, training, and support — not a department.",
            owner: "Implementation lead",
          },
          {
            id: "1.3",
            label: "Change control agreed",
            whyItMatters:
              "Untracked changes during the build cause regressions nobody can trace.",
            required: true,
            testScenario:
              "Agree who approves a scope change during build, and where approved changes are recorded.",
            owner: "Sponsor",
          },
          {
            id: "1.4",
            label: "Gate dates on the calendar",
            whyItMatters:
              "A gate without a date quietly becomes optional.",
            required: true,
            testScenario:
              "Put the configuration review, integration check, pilot start, and pilot exit on the calendar with the gate owner invited.",
            owner: "Implementation lead",
          },
          {
            id: "1.5",
            label: "Week-one and week-four measures written",
            whyItMatters:
              "Without a measure, “it went fine” is the only verdict available after launch.",
            required: false,
            testScenario:
              "Decide what you will look at after launch: deals carrying next steps, sync health, board usage, duplicate volume.",
            owner: "RevOps",
          },
        ],
      },
      {
        id: "configuration",
        title: "2. Configuration gate",
        accent: "blue",
        intro:
          "Build the process managers will coach from — and test it before anyone depends on it.",
        items: [
          {
            id: "2.1",
            label: "Objects and required fields match the agreed model",
            whyItMatters:
              "Layouts that drift from the data model break reporting long after anyone remembers why.",
            required: true,
            testScenario:
              "Review account, contact, and deal layouts against the signed model with a second admin, and note every deviation.",
            owner: "CRM admin",
          },
          {
            id: "2.2",
            label: "Stages and exit checkpoints configured",
            whyItMatters:
              "Stages without checkpoints turn pipeline reviews back into opinion.",
            required: true,
            testScenario:
              "Create a test deal and move it through every stage; confirm each checkpoint behaves the way the process document describes.",
            owner: "RevOps",
          },
          {
            id: "2.3",
            label: "Owner and next-step convention enforced",
            whyItMatters:
              "Ownership and next action drive every hygiene report you will run afterwards.",
            required: true,
            testScenario:
              "Confirm an open deal cannot sit without an owner, and that a next-step date is visible on the record and in list views.",
            owner: "RevOps",
          },
          {
            id: "2.4",
            label: "Roles and sharing tested with sample users",
            whyItMatters:
              "Making everyone an admin is the most common rollout shortcut and the hardest to reverse.",
            required: true,
            testScenario:
              "Log in as a seller and a manager test user and confirm each sees and edits only what the role matrix allows.",
            owner: "CRM admin",
          },
          {
            id: "2.5",
            label: "Manager pipeline and stuck-deal views built",
            whyItMatters:
              "If managers cannot run the week from the CRM, the team goes back to spreadsheets.",
            required: true,
            testScenario:
              "Build the board a manager will open on Monday — open deals by owner, stage, and missing next step — and have a manager confirm it works.",
            owner: "RevOps",
            doneWhen: "A manager signs off on the board definitions.",
          },
          {
            id: "2.6",
            label: "MVP automations inventoried",
            whyItMatters:
              "Automations built before launch are usually the first thing to break under real data.",
            required: false,
            testScenario:
              "List each automation in MVP with its trigger and owner, and park the rest in the post-launch backlog.",
            owner: "CRM admin",
          },
        ],
      },
      {
        id: "integration-access",
        title: "3. Integration & access gate",
        accent: "cyan",
        intro:
          "Sync, duplicate rules, and seats are part of the build — not paperwork for launch week.",
        items: [
          {
            id: "3.1",
            label: "Email and calendar sync working for test users",
            whyItMatters:
              "Sync failures show up as adoption failures, because sellers stop trusting the timeline.",
            required: true,
            testScenario:
              "Connect at least two mailboxes in staging and confirm a sent message lands on the intended contact and deal.",
            owner: "IT",
          },
          {
            id: "3.2",
            label: "Duplicate rules configured and tested",
            whyItMatters:
              "Duplicates created in the first weeks outlive the project.",
            required: true,
            testScenario:
              "Run known duplicate pairs through your match rules and confirm the survivor keeps related deals and activities.",
            owner: "RevOps",
          },
          {
            id: "3.3",
            label: "Day-one integrations connected",
            whyItMatters:
              "An integration deferred to “later” becomes manual work for sellers on day one.",
            required: false,
            testScenario:
              "Connect each must-have integration in staging and record the direction, the failure mode, and who fixes it.",
            owner: "IT",
          },
          {
            id: "3.4",
            label: "Seat roster matches the launch cohort",
            whyItMatters:
              "Missing seats block work on day one, and spare seats cost money quietly.",
            required: true,
            testScenario:
              "Compare the licence list against the intended launch cohort and resolve every difference before pilot starts.",
            owner: "CRM admin",
          },
          {
            id: "3.5",
            label: "Admin runbook drafted",
            whyItMatters:
              "Support cannot depend on one person remembering how the build works.",
            required: true,
            testScenario:
              "Write the steps for adding a user, merging duplicates, fixing a failed sync, and correcting a stage or field error.",
            owner: "CRM admin",
            doneWhen: "Runbook linked where the support team can find it.",
          },
        ],
      },
      {
        id: "pilot-exit",
        title: "4. Pilot exit gate",
        accent: "purple",
        intro:
          "The pilot is the only gate that tests the build against real behaviour.",
        items: [
          {
            id: "4.1",
            label: "Pilot cohort works real deals",
            whyItMatters:
              "Sandbox pilots pass gates that production will fail.",
            required: true,
            testScenario:
              "Have pilot sellers run live opportunities for an agreed period as part of normal work, not as a scheduled exercise.",
            owner: "Sales manager",
          },
          {
            id: "4.2",
            label: "Stages and next steps hold up in real use",
            whyItMatters:
              "Checkpoints that irritate sellers get bypassed, and the data quietly degrades.",
            required: true,
            testScenario:
              "Review a sample of pilot deals: are stages accurate, owners set, and next steps current without admin cleanup?",
            owner: "RevOps",
          },
          {
            id: "4.3",
            label: "Email sync verified on pilot mailboxes",
            whyItMatters:
              "Real mailboxes behave differently from test accounts, especially at volume.",
            required: true,
            testScenario:
              "Check across the pilot period that sent and received messages land on the correct records for every pilot user.",
            owner: "IT",
          },
          {
            id: "4.4",
            label: "A manager runs one pipeline review from the CRM",
            whyItMatters:
              "The first real test of the build is a manager using it under time pressure.",
            required: true,
            testScenario:
              "Hold at least one pipeline or forecast review with the CRM board as the only source, and capture what was missing.",
            owner: "Sales manager",
          },
          {
            id: "4.5",
            label: "Defects closed or risk-accepted in writing",
            whyItMatters:
              "Undocumented defects come back as day-one incidents with no owner.",
            required: true,
            testScenario:
              "List every pilot defect with severity and owner; each must be closed or explicitly accepted by the sponsor.",
            owner: "Implementation lead",
          },
          {
            id: "4.6",
            label: "Pilot exit signed before wider rollout",
            whyItMatters:
              "Calendar pressure passes gates that evidence would not.",
            required: true,
            testScenario:
              "Record a dated sponsor decision to exit pilot that cites the defect list and the gate items above.",
            owner: "Sponsor",
            doneWhen: "Dated exit note attached to the project record.",
          },
        ],
      },
      {
        id: "enablement-handoff",
        title: "5. Enablement & handoff gate",
        accent: "navy",
        intro:
          "People readiness and ongoing ownership close the implementation, not the configuration.",
        items: [
          {
            id: "5.1",
            label: "Role-based training delivered before launch",
            whyItMatters:
              "Training after launch competes with firefighting and usually loses.",
            required: true,
            testScenario:
              "Run sessions per role: sellers on deals and next steps, managers on boards, admins on seats, merges, and sync.",
            owner: "Change lead",
          },
          {
            id: "5.2",
            label: "Support intake and coverage named",
            whyItMatters:
              "Issues with no route home become reasons to stop using the CRM.",
            required: true,
            testScenario:
              "Publish one intake channel with named coverage and hours before the launch date is announced.",
            owner: "Implementation lead",
          },
          {
            id: "5.3",
            label: "Ongoing admin ownership assigned",
            whyItMatters:
              "The implementation ends; the CRM does not.",
            required: true,
            testScenario:
              "Name who owns users and seats, stage changes, duplicate cleanup, and the reporting backlog after launch.",
            owner: "Sponsor",
          },
          {
            id: "5.4",
            label: "Handoff to migration and go-live confirmed",
            whyItMatters:
              "Rollout gates, the data move, and launch day are three different jobs with different failure modes.",
            required: false,
            testScenario:
              "Confirm data cutover is tracked on the Migration Checklist and launch day on the Go-Live Checklist, each with an owner.",
            owner: "Implementation lead",
          },
        ],
      },
    ],
    downloadFiles: [
      {
        href: "/resources/crm-implementation-checklist.md",
        label: "Download Markdown",
        format: "md",
      },
    ],
    faq: [
      {
        question: "What does this checklist deliberately leave out?",
        answer:
          "Vendor evaluation belongs in the CRM Evaluation Checklist and Vendor Scorecard. Moving data belongs in the CRM Migration Checklist. Launch day and hypercare belong in the CRM Go-Live Checklist. This one covers the build: scope, configuration, integrations, access, and pilot exit.",
      },
      {
        question: "How is this different from a project plan?",
        answer:
          "A project plan tracks tasks and dates. This checklist defines the quality bar for leaving each phase, so a phase cannot start because the previous one ran out of calendar. Use both — the plan schedules the work, the checklist decides whether it is finished.",
      },
      {
        question: "What belongs in MVP?",
        answer:
          "Whatever weekly pipeline operations need: accounts, contacts, deals, stages with next steps, roles, email sync if required, duplicate rules, and the manager boards. Park clever automations and edge-case fields until after launch.",
      },
      {
        question: "Do small teams really need a pilot?",
        answer:
          "Scale the cohort down, but keep the gate. Even a handful of sellers running real deals for a week will surface stage, sync, and permission problems that a sandbox never will.",
      },
      {
        question: "What if a gate cannot be met before the date?",
        answer:
          "Either move the date or have the sponsor risk-accept the gap in writing with a named owner and a fix date. Passing a gate silently is how launch-day incidents are made.",
      },
      {
        question: "Who signs pilot exit?",
        answer:
          "The business sponsor, using the defect list and the pilot evidence. The implementation lead, admin, data owner, and the manager who ran the pipeline review should all have contributed before that decision.",
      },
    ],
    heroVisual: {
      src: "/resources/crm-implementation-checklist-hero.png",
      alt: "CRM implementation checklist showing rollout gates with owners, required flags, and pass or risk-accepted status.",
      caption:
        "Five gates with named owners — each one closes before the next opens.",
    },
    needsVisual: {
      src: "/resources/crm-implementation-checklist-needs.png",
      alt: "What’s inside the CRM Implementation Checklist: scope freeze, owners, configuration, integrations and access, pilot exit, enablement handoff.",
      caption: "A build-phase gate artifact — not a vendor evaluation.",
    },
    workflowVisual: {
      src: "/resources/crm-implementation-checklist-workflow.png",
      alt: "How to use: freeze scope, assign gate owners, configure, connect sync and seats, pilot on real deals, clear pilot exit.",
      caption: "Implementation sits between the decision and launch day.",
    },
    relatedResourceSlugs: [
      "crm-migration-checklist",
      "crm-go-live-checklist",
      "crm-training-plan",
      "crm-business-case-template",
    ],
    useBefore: ["crm-business-case-template", "crm-vendor-scorecard"],
    useWith: ["crm-migration-checklist", "crm-training-plan"],
    useNext: ["crm-go-live-checklist"],
    journeySlugs: [
      "crm-business-case-template",
      "crm-implementation-checklist",
      "crm-migration-checklist",
      "crm-go-live-checklist",
      "crm-training-plan",
    ],
    featuredGuideHrefs: [
      "/guides/crm-implementation/",
      "/guides/crm-implementation-planning/",
      "/guides/crm-implementation-timeline/",
      "/guides/crm-implementation-roles/",
    ],
    relatedToolHrefs: [
      {
        href: "/tools/crm-implementation-planner/",
        label: "CRM Implementation Planner",
      },
      {
        href: "/tools/crm-migration-planner/",
        label: "CRM Migration Planner",
      },
      {
        href: "/tools/crm-requirements-builder/?start=1",
        label: "CRM Requirements Builder",
      },
    ],
    primaryCta: {
      href: "/resources/crm-implementation-checklist.xlsx",
      label: "Download Excel (Editable spreadsheet)",
    },
    secondaryCta: {
      href: "/resources/crm-implementation-checklist.pdf",
      label: "Download PDF (Printable version)",
    },
    categorySlug: "crm",
    lastReviewedAt: "2026-08-15",
  },

  "crm-migration-checklist": {
    displayTitle: "CRM Migration Checklist",
    badgeLabel: "Checklist",
    toolkitLabel: "CRM Implementation Toolkit",
    tagline: "Gate the data move: inventory, mapping, dry run, cutover, rollback.",
    heroExplanation:
      "Use this for the records themselves — what moves, what it becomes, what a rehearsal proved, and what would make you stop the cutover and go back.",
    overview:
      "A data-move artifact for CRM cutover. Each section is a gate: know your sources, agree what every field and value becomes, decide which duplicate wins, rehearse the load, then cut over with a rollback you could actually use. Configuration, pilot, and launch-day gates live in related resources — not here.",
    whoThisIsFor:
      "Data leads, RevOps, implementation managers, and IT partners moving accounts, contacts, deals, and activities out of spreadsheets or a legacy CRM, plus the business owners who must sign that the result is right.",
    whatMattersIntro:
      "Prioritize honest inventory, value translations signed by the business, and at least one timed dry run. Business owners checking named records beats matching row counts every time.",
    howToUse:
      "Work the sections in order and keep them beside the Implementation Checklist. Finish inventory and mapping before any irreversible transform. Schedule dry runs early enough that fixing a stage map is not a crisis. On cutover night, follow freeze, extract, load, smoke, validate, open — and keep the rollback plan visible until the watch period ends.",
    workedExampleStructured: {
      title: "Worked example",
      requirement:
        "Every open deal arrives with the correct stage, amount, and owner after load.",
      vendors: [
        {
          name: "Dry run 1",
          result: "FAIL",
          note: "Legacy stage names fell through to the default, so a large share of open deals landed in the first stage.",
        },
        {
          name: "Dry run 2",
          result: "PASS",
          note: "After a signed stage translation table, business owners matched a sample of known deals end to end.",
        },
      ],
      evidence:
        "Staging load reports plus business-owner checks on named accounts and open deals.",
      disclaimer:
        "Hypothetical dry-run scenario for teaching the artifact — not a SoftwareGlimpse case study.",
    },
    glance: {
      primaryGoal: "A rehearsed CRM data cutover with validation and a usable rollback",
      typicalTeam: "Data lead, RevOps, CRM admin, IT, business data owners",
      commonPriorities: [
        "Source inventory",
        "Field and value mapping",
        "Duplicate survivorship",
        "Timed dry run",
        "Business sample checks",
        "Rollback triggers",
      ],
    },
    whatsInside: [
      {
        id: "inventory",
        title: "Source inventory",
        description:
          "Every system holding accounts, contacts, or deals — with an owner and a move decision.",
        icon: "list",
      },
      {
        id: "mapping",
        title: "Field & value mapping",
        description:
          "Source to target per object, plus stage, forecast, and owner translations.",
        icon: "link",
      },
      {
        id: "dedupe",
        title: "Duplicate survivorship",
        description:
          "Match keys, which record wins, and how deals and activities follow the survivor.",
        icon: "users",
      },
      {
        id: "dry-run",
        title: "Dry runs",
        description:
          "A timed rehearsal in staging with an error report and named sample checks.",
        icon: "workflow",
      },
      {
        id: "cutover",
        title: "Cutover runbook",
        description:
          "Freeze, extract, load, smoke, open — in order, with times logged per object.",
        icon: "clock",
      },
      {
        id: "rollback",
        title: "Rollback triggers",
        description:
          "What stops the migration, who calls it, and where the previous state still lives.",
        icon: "shield",
      },
    ],
    evidenceRules: {
      countsAs: [
        "A staging load report with error counts and timings",
        "Business-owner sign-off on named sample records",
        "Pipeline totals reconciled against the source within an agreed tolerance",
        "A rollback plan with named triggers and a decision owner",
      ],
      doesNotCount: [
        "Matching row counts on their own",
        "A mapping workbook nobody outside the data team reviewed",
        "“The import tool handles that”",
        "A cutover plan that has never been rehearsed",
      ],
    },
    challenges: [],
    outcomes: [
      {
        id: "known-inventory",
        title: "A known, owned inventory",
        description:
          "Every dataset has an owner and an explicit decision to migrate, archive, or leave.",
      },
      {
        id: "signed-mapping",
        title: "Mapping the business signed",
        description:
          "Stage, forecast, and owner translations are agreed before any transform runs.",
      },
      {
        id: "boring-cutover",
        title: "A boring cutover",
        description:
          "The rehearsal tells you the timings, the errors, and what would make you roll back.",
      },
    ],
    priorities: [],
    workflowSteps: [
      {
        id: "inventory",
        label: "Inventory the sources",
        detail:
          "List every system holding CRM records, with volumes, history depth, and an owner.",
      },
      {
        id: "map",
        label: "Map fields and values",
        detail:
          "Source to target per object, plus stage, forecast, and owner translations signed by the business.",
      },
      {
        id: "cleanse",
        label: "Cleanse and dedupe",
        detail:
          "Set match keys, survivorship, defaults for required fields, and the exclusion list.",
      },
      {
        id: "dry-run",
        label: "Dry run and fix",
        detail:
          "Load into staging, time it, fix the defects, and have owners check named records.",
      },
      {
        id: "cutover",
        label: "Freeze and cut over",
        detail:
          "Follow the runbook: freeze writes, extract, load, smoke, then decide whether to open.",
      },
      {
        id: "watch",
        label: "Validate and watch",
        detail:
          "Reconcile pipeline totals, staff a merge queue, and keep rollback available.",
      },
    ],
    artifactSections: [
      {
        id: "inventory-gate",
        title: "1. Inventory gate",
        accent: "green",
        intro:
          "You cannot migrate what nobody has admitted exists.",
        items: [
          {
            id: "1.1",
            label: "Every source system listed with an owner",
            whyItMatters:
              "Shadow spreadsheets appear after cutover as “missing data” with no route back.",
            required: true,
            testScenario:
              "List the legacy CRM, spreadsheets, marketing lists, and support tools holding accounts, contacts, or deals, each with a named owner.",
            owner: "Data lead",
          },
          {
            id: "1.2",
            label: "Objects in and out of scope written down",
            whyItMatters:
              "Unstated scope turns into an argument during the freeze window.",
            required: true,
            testScenario:
              "Record a decision for accounts, contacts, leads, deals, activities, notes, files, and custom objects: migrate, archive, or leave behind.",
            owner: "Implementation lead",
            doneWhen: "Scope table signed by the sponsor.",
          },
          {
            id: "1.3",
            label: "Open pipeline deals scoped explicitly",
            whyItMatters:
              "Open deals are the first records the business checks and the most expensive to get wrong.",
            required: true,
            testScenario:
              "Define which open opportunities must arrive with stage, amount, owner, and next step intact, and what happens to the rest.",
            owner: "Sales leadership",
          },
          {
            id: "1.4",
            label: "History depth decided",
            whyItMatters:
              "Activity and email history usually drives volume and effort more than contacts do.",
            required: true,
            testScenario:
              "Agree how far back activities and emails must come across, and what stays in a read-only archive.",
            owner: "Implementation lead",
          },
          {
            id: "1.5",
            label: "Sensitive and regulated fields flagged",
            whyItMatters:
              "Some fields carry handling rules that a bulk export happily ignores.",
            required: false,
            testScenario:
              "Mark personal, financial, or contractual fields and record who approves how they move.",
            owner: "Security or compliance",
          },
        ],
      },
      {
        id: "mapping-gate",
        title: "2. Mapping gate",
        accent: "blue",
        intro:
          "Column names match easily; meanings do not. This is where migrations are won or lost.",
        items: [
          {
            id: "2.1",
            label: "Field mapping workbook complete and reviewed",
            whyItMatters:
              "Similar field names routinely hide different meanings and different types.",
            required: true,
            testScenario:
              "Map source to target for each object with type, required flag, default, and transform, then have a second admin review it.",
            owner: "Data lead",
          },
          {
            id: "2.2",
            label: "Stage and forecast translations signed",
            whyItMatters:
              "A wrong stage map poisons every pipeline and forecast report from day one.",
            required: true,
            testScenario:
              "Translate every legacy stage and forecast category to the new model, including the unknown case, and have sales leadership sign it.",
            owner: "RevOps",
          },
          {
            id: "2.3",
            label: "Owner mapping resolved, including leavers",
            whyItMatters:
              "Deals owned by inactive users become invisible work nobody chases.",
            required: true,
            testScenario:
              "Map legacy owners to new seats and set an explicit rule for records whose owner has left the business.",
            owner: "CRM admin",
          },
          {
            id: "2.4",
            label: "Account, contact, and deal relationships preserved",
            whyItMatters:
              "Records that arrive unlinked are often worse than records that did not arrive.",
            required: true,
            testScenario:
              "Check parent accounts, primary contacts, and deal-contact links on a sample hierarchy after a staging load.",
            owner: "Data lead",
          },
          {
            id: "2.5",
            label: "Legacy record IDs stored on target records",
            whyItMatters:
              "Support questions and any re-migration both need a way back to the source record.",
            required: false,
            testScenario:
              "Add a legacy ID field on each migrated object and confirm it populates during the load.",
            owner: "CRM admin",
          },
          {
            id: "2.6",
            label: "Lead and activity strategy decided",
            whyItMatters:
              "Leaving these open guarantees a scramble inside the freeze window.",
            required: false,
            testScenario:
              "Decide whether open leads convert before load or migrate as they are, and whether activities migrate, summarise, or stay archived.",
            owner: "RevOps",
          },
        ],
      },
      {
        id: "cleanse-gate",
        title: "3. Cleanse & duplicate gate",
        accent: "amber",
        intro:
          "Decide who wins before load night, not while the clock is running.",
        items: [
          {
            id: "3.1",
            label: "Match keys and survivorship rules defined",
            whyItMatters:
              "Duplicates created at load are far harder to clean than duplicates prevented.",
            required: true,
            testScenario:
              "Define which fields identify a duplicate and which record survives, then test the rules on known duplicate pairs.",
            owner: "RevOps",
          },
          {
            id: "3.2",
            label: "Related records follow the survivor",
            whyItMatters:
              "A merge that orphans deals or activities is not a clean merge.",
            required: true,
            testScenario:
              "Merge a sample pair and confirm deals, activities, and notes remain reachable on the surviving record.",
            owner: "RevOps",
          },
          {
            id: "3.3",
            label: "Defaults set for required target fields",
            whyItMatters:
              "Loads either fail or fill with nonsense when the source lacks a field the target requires.",
            required: true,
            testScenario:
              "Decide what happens when the source has no stage, amount, owner, or next step, and test each default on sample rows.",
            owner: "Data lead",
          },
          {
            id: "3.4",
            label: "Exclusion list agreed before extract",
            whyItMatters:
              "Junk migrated once tends to stay for the life of the system.",
            required: false,
            testScenario:
              "List test records, obsolete campaigns, and closed junk deals that will not move, and get the business owner to agree.",
            owner: "Business data owners",
          },
        ],
      },
      {
        id: "dry-run-gate",
        title: "4. Dry-run gate",
        accent: "purple",
        intro:
          "Rehearse until cutover night has no surprises left in it.",
        items: [
          {
            id: "4.1",
            label: "Staging matches the target configuration",
            whyItMatters:
              "A rehearsal against a different schema teaches you the wrong lesson.",
            required: true,
            testScenario:
              "Confirm staging objects, fields, stages, and required rules match the build you will load into.",
            owner: "CRM admin",
          },
          {
            id: "4.2",
            label: "One full dry run completed and timed",
            whyItMatters:
              "The cutover window is a number you measure, not a number you guess.",
            required: true,
            testScenario:
              "Run the load end to end in staging and record duration per object alongside the error report.",
            owner: "Data lead",
          },
          {
            id: "4.3",
            label: "Dry-run defects closed or risk-accepted",
            whyItMatters:
              "A second run that repeats the same errors wastes the rehearsal.",
            required: true,
            testScenario:
              "List each mapping and load defect with an owner, then close it or record an explicit risk acceptance.",
            owner: "Data lead",
          },
          {
            id: "4.4",
            label: "Business owners validate named records",
            whyItMatters:
              "Row counts can match perfectly while the records themselves are wrong.",
            required: true,
            testScenario:
              "Have business owners open known accounts and open deals and confirm stage, amount, owner, next step, and linked contacts.",
            owner: "Business data owners",
            doneWhen: "Sign-off notes attached to the migration record.",
          },
          {
            id: "4.5",
            label: "Pipeline totals reconciled against the source",
            whyItMatters:
              "A forecast that moves after migration destroys trust in the new CRM immediately.",
            required: true,
            testScenario:
              "Compare open pipeline and forecast totals against the source within an agreed tolerance and explain any variance.",
            owner: "RevOps",
          },
        ],
      },
      {
        id: "cutover-gate",
        title: "5. Cutover & rollback gate",
        accent: "rose",
        intro:
          "Run this in order. Freeze, smoke, and validation are the steps people skip and regret.",
        items: [
          {
            id: "5.1",
            label: "Freeze window agreed and communicated",
            whyItMatters:
              "Records written to the old system during extract are lost silently.",
            required: true,
            testScenario:
              "State who stops writing where, from when, and for how long, and track acknowledgements from each team.",
            owner: "Implementation lead",
          },
          {
            id: "5.2",
            label: "Final backups and extracts secured",
            whyItMatters:
              "Rollback is only real if the previous state still exists and someone can reach it.",
            required: true,
            testScenario:
              "Store the final source extracts in a known location and confirm someone other than the data lead can retrieve them.",
            owner: "IT",
          },
          {
            id: "5.3",
            label: "Cutover runbook followed step by step",
            whyItMatters:
              "Improvised load nights produce steps nobody can reproduce or reverse.",
            required: true,
            testScenario:
              "Work through the runbook in order, logging start time, end time, and errors for each object.",
            owner: "Data lead",
          },
          {
            id: "5.4",
            label: "Smoke checks pass before users return",
            whyItMatters:
              "Opening on an unverified load turns a data problem into an adoption problem.",
            required: true,
            testScenario:
              "Search a known account, open a migrated deal, move a stage, open the pipeline board, and confirm the email sync heartbeat.",
            owner: "CRM admin",
          },
          {
            id: "5.5",
            label: "Rollback triggers and decision owner named",
            whyItMatters:
              "Mid-cutover is the worst possible time to work out who decides.",
            required: true,
            testScenario:
              "Write the conditions that stop the migration and name the person who calls it, before load night begins.",
            owner: "Implementation lead",
          },
          {
            id: "5.6",
            label: "Duplicate and defect watch staffed after load",
            whyItMatters:
              "Migration problems surface as people start working, not at the moment of load.",
            required: true,
            testScenario:
              "Run a merge queue and a defect intake for the first days after load, with named coverage and hours.",
            owner: "RevOps",
          },
        ],
      },
    ],
    downloadFiles: [
      {
        href: "/resources/crm-migration-checklist.md",
        label: "Download Markdown",
        format: "md",
      },
    ],
    faq: [
      {
        question: "What does this checklist deliberately leave out?",
        answer:
          "Configuration and pilot gates belong in the CRM Implementation Checklist, and launch day belongs in the CRM Go-Live Checklist. Detailed source-to-target rows belong in a field mapping template. This checklist gates the move itself.",
      },
      {
        question: "Do we migrate all historical activity?",
        answer:
          "Often not. Many teams migrate recent activities and leave older history in a read-only archive. Decide explicitly, because activity and email volume usually drives complexity more than contact counts do.",
      },
      {
        question: "How many dry runs do we need?",
        answer:
          "At least one full rehearsal covering accounts, contacts, and deals. Add a second when volumes are large, the stage or owner maps are complex, or the first run revealed mapping defects. Timing the dry run is how you learn the real cutover window.",
      },
      {
        question: "What counts as validation beyond row counts?",
        answer:
          "Business owners opening named accounts and open deals and confirming stage, amount, owner, next step, and linked contacts — plus a pipeline and forecast comparison against the source within an agreed tolerance, with variance explained.",
      },
      {
        question: "When is rollback the right call?",
        answer:
          "When smoke checks fail, open pipeline data is wrong at scale, sync is down, or an operationally critical integration has failed — and the freeze window still allows returning to the source system. Write the triggers before cutover night, not during it.",
      },
      {
        question: "Who signs the mapping?",
        answer:
          "The business owner for each dataset signs the field map, and sales leadership signs the stage and forecast translations. The data team owns the workbook, but it should never be the only party that has read it.",
      },
    ],
    heroVisual: {
      src: "/resources/crm-migration-checklist-hero.png",
      alt: "CRM migration checklist showing inventory, mapping, dry-run, and cutover gates with required flags and validation status.",
      caption:
        "Five gates from inventory to cutover — with rollback kept available throughout.",
    },
    needsVisual: {
      src: "/resources/crm-migration-checklist-needs.png",
      alt: "What’s inside the CRM Migration Checklist: source inventory, field and value mapping, duplicate survivorship, dry runs, cutover runbook, rollback triggers.",
      caption: "A data-move artifact — configuration and launch live elsewhere.",
    },
    workflowVisual: {
      src: "/resources/crm-migration-checklist-workflow.png",
      alt: "How to use: inventory sources, map fields and values, cleanse and dedupe, dry run and fix, freeze and cut over, validate and watch.",
      caption: "Six steps from inventory to a validated, watched open.",
    },
    relatedResourceSlugs: [
      "crm-implementation-checklist",
      "crm-field-mapping-template",
      "crm-data-migration-template",
      "crm-go-live-checklist",
    ],
    useBefore: ["crm-implementation-checklist"],
    useWith: ["crm-field-mapping-template", "crm-data-migration-template"],
    useNext: ["crm-go-live-checklist"],
    journeySlugs: [
      "crm-implementation-checklist",
      "crm-migration-checklist",
      "crm-go-live-checklist",
      "crm-training-plan",
    ],
    featuredGuideHrefs: [
      "/guides/crm-implementation/",
      "/guides/crm-implementation-planning/",
      "/guides/financial-services-crm-migration/",
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
      { href: "/tools/crm-finder/", label: "CRM Finder" },
    ],
    primaryCta: {
      href: "/resources/crm-migration-checklist.xlsx",
      label: "Download Excel (Editable spreadsheet)",
    },
    secondaryCta: {
      href: "/resources/crm-migration-checklist.pdf",
      label: "Download PDF (Printable version)",
    },
    categorySlug: "crm",
    lastReviewedAt: "2026-08-15",
  },

  "crm-go-live-checklist": {
    displayTitle: "CRM Go-Live Checklist",
    badgeLabel: "Checklist",
    toolkitLabel: "CRM Implementation Toolkit",
    tagline: "Freeze, verify, then open — and staff the first week.",
    heroExplanation:
      "Use this in the last days before launch and through hypercare: hold the freeze, prove access and sync on real records, make the open decision on evidence, and give day-one issues a named owner.",
    overview:
      "A launch-day artifact. Each section is a gate for the hours around go-live: freeze rules, seats and access, smoke checks on real records, the open decision and announcement, then hypercare. Building the CRM and moving the data happen earlier, on the Implementation and Migration Checklists.",
    whoThisIsFor:
      "Implementation leads, sponsors, CRM admins, RevOps, and change owners in the final week before launch — and anyone running a phased rollout who needs each wave to open on the same criteria.",
    whatMattersIntro:
      "Prioritize freeze discipline, verified logins, a green sync heartbeat, and named support coverage. Announcing before the smoke checks pass converts a fixable issue into a trust problem.",
    howToUse:
      "Start once pilot exit is in sight. Work backwards from the launch date: freeze, seats, access, data sign-off, sync heartbeat. On launch morning run the smoke checks, then have the sponsor record an open or delay decision before any announcement goes out. Keep hypercare staffed and close it with an exit review, not by drifting.",
    workedExampleStructured: {
      title: "Worked example",
      requirement:
        "On launch morning, a seller can log in, open a migrated deal, advance a stage, and see a synced email on the record.",
      vendors: [
        {
          name: "Launch A",
          result: "PASS",
          note: "Smoke checks ran an hour before the announcement; two permission errors were fixed before users were told the CRM was live.",
        },
        {
          name: "Launch B",
          result: "FAIL",
          note: "The announcement went out on schedule while sync was down for one mailbox group, and support had no named owner until midday.",
        },
      ],
      evidence:
        "Launch-day smoke log with record links, plus the published hypercare rota.",
      disclaimer:
        "Hypothetical Launch A / Launch B scenario for teaching the artifact — not a SoftwareGlimpse case study.",
    },
    glance: {
      primaryGoal: "A verified CRM launch with a recorded open decision and staffed hypercare",
      typicalTeam: "Implementation lead, CRM admin, IT, RevOps, sponsor, change lead",
      commonPriorities: [
        "Freeze with an approval path",
        "Seats and logins verified",
        "Sync heartbeat green",
        "Smoke checks on real records",
        "Open decision before comms",
        "Named hypercare coverage",
      ],
    },
    whatsInside: [
      {
        id: "freeze",
        title: "Freeze rules",
        description:
          "What is locked, who approves an exception, and who retests after one.",
        icon: "lock",
      },
      {
        id: "access",
        title: "Seats & access audit",
        description:
          "Licence reconciliation, sample logins per role, and manager visibility on team deals.",
        icon: "users",
      },
      {
        id: "smoke",
        title: "Smoke checks",
        description:
          "Search, create, advance a stage, set a next step, and open the manager board.",
        icon: "check",
      },
      {
        id: "sync",
        title: "Sync heartbeat",
        description:
          "Test messages landing on the intended contact or deal from more than one mailbox.",
        icon: "mail",
      },
      {
        id: "open-decision",
        title: "Open decision",
        description:
          "A dated sponsor call on the evidence, taken before the announcement goes out.",
        icon: "target",
      },
      {
        id: "hypercare",
        title: "Hypercare",
        description:
          "One intake channel, a named rota, daily triage, and an explicit exit review.",
        icon: "clock",
      },
    ],
    evidenceRules: {
      countsAs: [
        "A smoke check completed on a real record, with a link or screenshot",
        "A licence report reconciled against the launch roster",
        "A dated sponsor decision to open or delay",
        "A published on-call rota with names and coverage hours",
      ],
      doesNotCount: [
        "“It worked yesterday”",
        "A change made during freeze without a retest",
        "An announcement scheduled before the smoke checks ran",
        "Support that exists only as a group chat with no owner",
      ],
    },
    challenges: [],
    outcomes: [
      {
        id: "known-build",
        title: "A known-good launch build",
        description:
          "Freeze and smoke checks confirm what users will actually see on their records.",
      },
      {
        id: "verified-access",
        title: "Verified access",
        description:
          "Seats, logins, and manager visibility are proven before anyone is told the CRM is live.",
      },
      {
        id: "staffed-week",
        title: "A staffed first week",
        description:
          "Day-one issues reach a named owner instead of circulating in direct messages.",
      },
    ],
    priorities: [],
    workflowSteps: [
      {
        id: "freeze",
        label: "Enter freeze",
        detail:
          "Lock non-essential configuration, publish the approval path, and read the pause criteria.",
      },
      {
        id: "access",
        label: "Audit seats and access",
        detail:
          "Reconcile licences with the roster and complete sample logins for each role.",
      },
      {
        id: "data-sync",
        label: "Confirm data and sync",
        detail:
          "Attach the cutover sign-off and prove the email sync heartbeat on sample mailboxes.",
      },
      {
        id: "smoke",
        label: "Run launch-day smoke",
        detail:
          "Search, create, advance a stage, set a next step, and open the manager board.",
      },
      {
        id: "open",
        label: "Make the open decision",
        detail:
          "Sponsor records open or delay on the evidence; only then send the announcement.",
      },
      {
        id: "hypercare",
        label: "Run hypercare and exit",
        detail:
          "Staff the rota, triage daily, watch duplicates and hygiene, then close with an exit review.",
      },
    ],
    artifactSections: [
      {
        id: "freeze-gate",
        title: "1. Freeze gate",
        accent: "green",
        intro:
          "Stabilise the build so launch-day problems are the ones you already know about.",
        items: [
          {
            id: "1.1",
            label: "Freeze start and end announced",
            whyItMatters:
              "Untested changes landing beside new users cause incidents nobody can explain.",
            required: true,
            testScenario:
              "Announce the freeze window and exactly what it covers: fields, layouts, stages, automations, and permissions.",
            owner: "Implementation lead",
          },
          {
            id: "1.2",
            label: "Emergency change path defined",
            whyItMatters:
              "A total freeze gets ignored quietly; an approval path gets followed.",
            required: true,
            testScenario:
              "Name who approves a severity-1 change during freeze, where it is logged, and who retests afterwards.",
            owner: "CRM admin",
          },
          {
            id: "1.3",
            label: "Pilot exit and open risks reviewed",
            whyItMatters:
              "Launching over an unresolved pilot defect repeats it at full scale.",
            required: true,
            testScenario:
              "Read the pilot defect list at the launch briefing and confirm each item is closed or accepted in writing.",
            owner: "Implementation lead",
          },
          {
            id: "1.4",
            label: "Pause criteria read in the briefing",
            whyItMatters:
              "Under launch pressure, teams push through the failures they had agreed to stop for.",
            required: true,
            testScenario:
              "State out loud what would delay the launch, and name who makes that call.",
            owner: "Sponsor",
          },
        ],
      },
      {
        id: "access-gate",
        title: "2. Seats, access & data gate",
        accent: "blue",
        intro:
          "People must be able to get in, and the records waiting for them must be signed off.",
        items: [
          {
            id: "2.1",
            label: "Licence report reconciled with the launch roster",
            whyItMatters:
              "Sellers locked out on day one stop trying, and spare seats cost money quietly.",
            required: true,
            testScenario:
              "Compare assigned licences against the named launch cohort and resolve every difference before launch morning.",
            owner: "CRM admin",
          },
          {
            id: "2.2",
            label: "Sample logins completed per role",
            whyItMatters:
              "Identity and provisioning problems only show themselves at the login screen.",
            required: true,
            testScenario:
              "Have one seller, one manager, and one admin log in through the real path and confirm each lands on the expected home view.",
            owner: "IT",
          },
          {
            id: "2.3",
            label: "Manager visibility checked on team deals",
            whyItMatters:
              "Managers who cannot see their team’s pipeline revert to spreadsheets in the first week.",
            required: true,
            testScenario:
              "Log in as a manager and confirm team deals, boards, and forecast views appear as expected.",
            owner: "RevOps",
          },
          {
            id: "2.4",
            label: "Restricted roles verified as restricted",
            whyItMatters:
              "Over-permissioned launches stay quiet right up until they do not.",
            required: false,
            testScenario:
              "Confirm a restricted role cannot see or edit records outside its scope.",
            owner: "CRM admin",
          },
          {
            id: "2.5",
            label: "Data cutover signed off or marked not applicable",
            whyItMatters:
              "Launch morning is far too late to discover the load never finished.",
            required: true,
            testScenario:
              "Attach the migration validation sign-off to the go-live packet, or record explicitly that no migration applies.",
            owner: "Data lead",
          },
        ],
      },
      {
        id: "smoke-gate",
        title: "3. Launch-day smoke gate",
        accent: "purple",
        intro:
          "Walk the paths a seller will walk in their first five minutes, on real records.",
        items: [
          {
            id: "3.1",
            label: "Login and search for a known record",
            whyItMatters:
              "Users form their opinion of the system in the first few minutes.",
            required: true,
            testScenario:
              "As a normal user rather than an admin, search a known account and contact and open the related deal.",
            owner: "CRM admin",
          },
          {
            id: "3.2",
            label: "Create a contact and a deal",
            whyItMatters:
              "Creation is the first thing a seller does and the first place required fields bite.",
            required: true,
            testScenario:
              "Create one contact and one deal with required fields and confirm they save and link correctly.",
            owner: "RevOps",
          },
          {
            id: "3.3",
            label: "Advance a stage and set a next step",
            whyItMatters:
              "Stage and next step are the spine of every pipeline report you will run this week.",
            required: true,
            testScenario:
              "Move a deal to the next stage, set owner and next-step date, and confirm both appear in a board filter.",
            owner: "RevOps",
          },
          {
            id: "3.4",
            label: "Email sync heartbeat green on sample mailboxes",
            whyItMatters:
              "Sync failure is the most common day-one outage and the least visible to the launch team.",
            required: true,
            testScenario:
              "Send a test message from at least two mailboxes and confirm each lands on the intended contact or deal.",
            owner: "IT",
            doneWhen: "Heartbeat results logged with links to the records.",
          },
          {
            id: "3.5",
            label: "Manager board and forecast view open",
            whyItMatters:
              "The first pipeline review of the week depends on these views loading with real filters.",
            required: true,
            testScenario:
              "Open the pipeline, stuck-deal, and forecast views with the filters managers will use and confirm they load without error.",
            owner: "Sales manager",
          },
          {
            id: "3.6",
            label: "Day-one integrations checked",
            whyItMatters:
              "An integration failing silently creates manual work nobody has assigned.",
            required: false,
            testScenario:
              "Push one record through each must-have integration and confirm it arrives where it should.",
            owner: "IT",
          },
        ],
      },
      {
        id: "open-comms",
        title: "4. Open decision & communications",
        accent: "indigo",
        intro:
          "Going live is a decision taken on evidence, then communicated — in that order.",
        items: [
          {
            id: "4.1",
            label: "Sponsor records an open or delay decision",
            whyItMatters:
              "“Live” should mean a decision was made, not that a date arrived.",
            required: true,
            testScenario:
              "Review the smoke results and gate status with the sponsor and record a dated decision to open or delay.",
            owner: "Sponsor",
          },
          {
            id: "4.2",
            label: "Announcement held until after the decision",
            whyItMatters:
              "Announcing before verification turns a fixable issue into a trust problem.",
            required: true,
            testScenario:
              "Keep the launch message unsent until the decision is recorded, then send it with first actions and where to get help.",
            owner: "Change lead",
          },
          {
            id: "4.3",
            label: "Manager brief covers running the week from the CRM",
            whyItMatters:
              "If managers do not switch, nobody below them switches either.",
            required: true,
            testScenario:
              "Tell managers which board to open, what hygiene to expect in week one, and how to raise issues.",
            owner: "Sales leadership",
          },
          {
            id: "4.4",
            label: "Support routes published with the announcement",
            whyItMatters:
              "Users who cannot find help within a minute go back to what they know.",
            required: true,
            testScenario:
              "Include the intake channel, coverage hours, and severity examples in the launch message itself.",
            owner: "Implementation lead",
          },
        ],
      },
      {
        id: "hypercare-gate",
        title: "5. Hypercare gate",
        accent: "navy",
        intro:
          "The first days set the habits. Staff them deliberately and close them explicitly.",
        items: [
          {
            id: "5.1",
            label: "On-call rota published with names and hours",
            whyItMatters:
              "Shared responsibility on day one means nobody answers first.",
            required: true,
            testScenario:
              "Publish admin, IT, and RevOps coverage for the hypercare window, with an escalation path.",
            owner: "Implementation lead",
          },
          {
            id: "5.2",
            label: "Single intake channel with severity definitions",
            whyItMatters:
              "Issues scattered across direct messages are never counted, prioritised, or closed.",
            required: true,
            testScenario:
              "Run one channel or queue and post severity-1 examples: cannot log in, sync down, cannot advance a deal.",
            owner: "Implementation lead",
          },
          {
            id: "5.3",
            label: "Daily triage while hypercare is open",
            whyItMatters:
              "Themes stay invisible when issues are handled one at a time.",
            required: true,
            testScenario:
              "Hold a short daily review of new issues, decisions taken, and anything needing a configuration change.",
            owner: "Implementation lead",
          },
          {
            id: "5.4",
            label: "Duplicate and hygiene watch in the first days",
            whyItMatters:
              "Day-one data habits set the standard for the rest of the year.",
            required: true,
            testScenario:
              "Check new duplicate volume and open deals missing an owner or next step on day one and day three, then send the results to managers.",
            owner: "RevOps",
          },
          {
            id: "5.5",
            label: "Hypercare exit with owners for what remains",
            whyItMatters:
              "Hypercare that fades away leaves unassigned work and no closure.",
            required: true,
            testScenario:
              "Hold an exit review covering what closes, what becomes backlog, and who owns admin, seats, and reporting from now on.",
            owner: "Sponsor",
            doneWhen: "Exit notes and backlog owners recorded.",
          },
        ],
      },
    ],
    downloadFiles: [
      {
        href: "/resources/crm-go-live-checklist.md",
        label: "Download Markdown",
        format: "md",
      },
    ],
    faq: [
      {
        question: "What does this checklist deliberately leave out?",
        answer:
          "Building the CRM belongs in the CRM Implementation Checklist and moving the records belongs in the CRM Migration Checklist. This one covers the hours around launch: freeze, access, smoke checks, the open decision, and hypercare.",
      },
      {
        question: "When should we start it?",
        answer:
          "Once pilot exit is in sight — commonly one to two weeks before launch, earlier if the cutover or email sync is complex. Freeze rules, seat reconciliation, and a support rota cannot be invented on the day.",
      },
      {
        question: "What can still change during freeze?",
        answer:
          "Severity-1 fixes that unblock login, stage moves, or email sync, with written approval and a retest afterwards. Everything else — new fields, cosmetic tweaks, extra automations — waits for the post-hypercare backlog.",
      },
      {
        question: "What if smoke checks fail on launch morning?",
        answer:
          "Do not announce. Use the pause criteria you read in the briefing, especially if the sync heartbeat or the stage and next-step path failed. A late launch is recoverable; a broken first day costs you the adoption you spent months building.",
      },
      {
        question: "How long should hypercare last?",
        answer:
          "Commonly a few days to two weeks, depending on team size and cutover risk. Define the window up front, staff the duplicate and sync watches, and close it with an exit review rather than letting it fade.",
      },
      {
        question: "Does a phased rollout repeat this checklist?",
        answer:
          "Yes — run the same gates for each wave. The freeze and smoke checks get faster each time, but seats, access, sync, and support coverage are specific to the group you are opening.",
      },
    ],
    heroVisual: {
      src: "/resources/crm-go-live-checklist-hero.png",
      alt: "CRM go-live checklist showing freeze status, access audit, smoke-check rows with required flags, and the hypercare rota.",
      caption:
        "Freeze, verify access, smoke test, decide — then open with support already staffed.",
    },
    needsVisual: {
      src: "/resources/crm-go-live-checklist-needs.png",
      alt: "What’s inside the CRM Go-Live Checklist: freeze rules, seats and access, smoke checks, sync heartbeat, open decision, hypercare.",
      caption: "A launch-day artifact — the build and the data move happen earlier.",
    },
    workflowVisual: {
      src: "/resources/crm-go-live-checklist-workflow.png",
      alt: "How to use: enter freeze, audit seats and access, confirm data and sync, run smoke checks, make the open decision, run hypercare.",
      caption: "Freeze → verify → smoke → open → hypercare → exit review.",
    },
    relatedResourceSlugs: [
      "crm-implementation-checklist",
      "crm-migration-checklist",
      "crm-uat-test-script",
      "crm-training-plan",
      "crm-optimization-checklist",
    ],
    useBefore: ["crm-implementation-checklist", "crm-migration-checklist", "crm-uat-test-script"],
    useWith: ["crm-training-plan"],
    useNext: ["crm-optimization-checklist"],
    journeySlugs: [
      "crm-implementation-checklist",
      "crm-migration-checklist",
      "crm-uat-test-script",
      "crm-go-live-checklist",
      "crm-training-plan",
    ],
    featuredGuideHrefs: [
      "/guides/crm-implementation/",
      "/guides/crm-implementation-planning/",
      "/guides/crm-implementation-timeline/",
      "/guides/crm-implementation-roles/",
    ],
    relatedToolHrefs: [
      {
        href: "/tools/crm-implementation-planner/",
        label: "CRM Implementation Planner",
      },
      {
        href: "/tools/crm-migration-planner/",
        label: "CRM Migration Planner",
      },
      { href: "/tools/crm-finder/", label: "CRM Finder" },
    ],
    primaryCta: {
      href: "/resources/crm-go-live-checklist.xlsx",
      label: "Download Excel (Editable spreadsheet)",
    },
    secondaryCta: {
      href: "/resources/crm-go-live-checklist.pdf",
      label: "Download PDF (Printable version)",
    },
    categorySlug: "crm",
    lastReviewedAt: "2026-08-15",
  },
};
