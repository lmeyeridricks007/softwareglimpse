import type { RequirementDetailProfile } from "@/domain";

type Depth = Pick<
  RequirementDetailProfile,
  | "displayTitle"
  | "tagline"
  | "overview"
  | "whoThisIsFor"
  | "whatMattersIntro"
  | "workedExample"
  | "workedExampleSecondary"
  | "challenges"
  | "outcomes"
  | "acceptanceNeeds"
  | "workflowSteps"
  | "heroVisual"
  | "needsVisual"
  | "workflowVisual"
  | "faq"
  | "useCaseLinks"
  | "primaryCapabilityHref"
>;

/**
 * Depth layer (part A) for CRM requirement detail pages (`/requirements/[slug]/`).
 * Educational / operational — no invented rankings, prices, metrics, or product endorsements.
 */
export const requirementDepthPartA: Record<string, Depth> = {
  "separate-sales-processes": {
    displayTitle: "CRM requirement: Support separate sales processes",
    tagline:
      "Model genuinely different sales motions as separate pipelines — so new logos, renewals, and partner deals stop sharing one dishonest stage board.",
    overview:
      "Supporting separate sales processes means your CRM can run more than one opportunity workflow with independent stages, owners, and review rituals. Teams need this when new-business, expansion, partner, or advisory motions have different checkpoints — not just different deal sizes tagged on one funnel. The requirement is satisfied by process structure (typically multiple pipelines plus pipeline-scoped stages and reporting), not by filters that pretend one board is many. Evaluating it well means testing whether each motion can advance, automate, and report without contaminating the other.",
    whoThisIsFor:
      "Sales ops, revenue leaders, and multi-motion orgs — a B2B SaaS pod with new-logo AEs and expansion CSMs, an agency running pitch vs retainer renewals, or a financial-services firm separating product sales from advisory intake. You feel the pain when Monday reviews mix incompatible stages and reps invent status in notes.",
    whatMattersIntro:
      "Prioritize independent stage models per motion, clear routing into the right process, and readable reporting per pipeline — not how many pipelines a marketing page lists. If two motions share the same checkpoints, one honest pipeline usually beats two half-configured ones. Validate access and automation scoping only after the stage models themselves are real.",
    workedExample:
      "Worked example: a 14-person B2B SaaS sales team. Before CRM, new-logo and expansion deals shared one board; expansion sat in “Demo” for weeks because that stage did not apply. After CRM, New Business and Expansion are separate pipelines with their own stages — Monday reviews open the right board, and security-checklist automation fires only on new logos.",
    workedExampleSecondary:
      "Worked example: an 8-person digital agency. Before CRM, pitch opportunities and retainer renewals shared one funnel; account managers invented stages in notes. After CRM, New Business covers pitches and Retention covers renewals — BD and AMs each work a board that matches their motion.",
    challenges: [
      {
        id: "forced-funnel",
        title: "One funnel forced onto mismatched motions",
        pain: "New business and renewals share stages that only fit one motion, so reps skip or invent status.",
        crmHelps:
          "Separate pipelines keep each process’s stage model honest without contaminating the other.",
      },
      {
        id: "filter-fiction",
        title: "Filters stand in for real process structure",
        pain: "Managers filter one board by deal type and call it “pipelines,” then coaching still mixes incompatible deals.",
        crmHelps:
          "True multiple pipelines isolate stage definitions and, where supported, reporting per process.",
      },
      {
        id: "blended-metrics",
        title: "Conversion metrics become meaningless",
        pain: "Stage conversion and velocity averages blend motions with different cycle lengths and exit criteria.",
        crmHelps:
          "Pipeline-scoped views keep each motion’s metrics readable for coaching and planning.",
      },
      {
        id: "access-bleed",
        title: "Teams see processes they should not operate",
        pain: "Partner or advisory boards are visible to people who only need new-business deals.",
        crmHelps:
          "Pipeline-level access (with role permissions) limits noise and leakage across motions.",
      },
    ],
    outcomes: [
      {
        id: "honest-stages",
        title: "Honest stages per motion",
        description:
          "Each process advances only through checkpoints that match how that work actually happens.",
      },
      {
        id: "cleaner-reviews",
        title: "Cleaner pipeline reviews",
        description:
          "Managers coach from the right board instead of reconciling mixed deal types mid-meeting.",
      },
      {
        id: "scoped-rules",
        title: "Automation that stays in scope",
        description:
          "Stage triggers and tasks can follow one pipeline’s rules without firing on another.",
      },
      {
        id: "readable-metrics",
        title: "Readable conversion metrics",
        description:
          "Stage conversion and velocity make sense because the denominator is one process.",
      },
    ],
    acceptanceNeeds: [
      {
        id: "independent-pipelines",
        title: "Independent pipelines (or equivalent process containers)",
        description:
          "Materially different motions can exist as separate stage engines, not only filtered views.",
        priority: "must",
        href: "/features/multiple-pipelines/",
      },
      {
        id: "independent-stages",
        title: "Independent stage models per process",
        description:
          "Each pipeline can define, rename, and order its own stages without forcing a shared list.",
        priority: "must",
        href: "/capabilities/pipeline-management/",
      },
      {
        id: "routing-clarity",
        title: "Clear routing into the right process",
        description:
          "New opportunities land in the correct pipeline at create/qualify — not by tribal habit alone.",
        priority: "must",
        href: "/use-cases/complex-sales-processes/",
      },
      {
        id: "process-reporting",
        title: "Readable reporting per process",
        description:
          "You can review conversion, stuck deals, or forecast inputs for one motion without blending another.",
        priority: "must",
        href: "/capabilities/reporting/",
      },
      {
        id: "pipeline-access",
        title: "Pipeline-scoped access where needed",
        description:
          "Teams can be limited to the processes they operate when confidentiality or noise matters.",
        priority: "nice",
        href: "/capabilities/security/",
      },
      {
        id: "pipeline-automation",
        title: "Process-scoped automation",
        description:
          "Workflows can trigger differently by pipeline after stage hygiene is real.",
        priority: "nice",
        href: "/capabilities/workflow-automation/",
      },
    ],
    workflowSteps: [
      {
        id: "map-motions",
        label: "Map motions",
        detail:
          "List which processes truly differ in checkpoints — not only in product name or deal size.",
      },
      {
        id: "configure-trial",
        label: "Configure trial",
        detail:
          "Stand up two pipelines with distinct stages that mirror your real motions.",
      },
      {
        id: "route-sample",
        label: "Route sample deals",
        detail:
          "Create representative opportunities into each pipeline and attempt a week of realistic updates.",
      },
      {
        id: "inspect-bleed",
        label: "Inspect bleed",
        detail:
          "Check whether reports, automations, and board views mix motions or stay scoped.",
      },
      {
        id: "accept-or-simplify",
        label: "Accept or simplify",
        detail:
          "Keep separate processes only where stages differ; collapse motions that share checkpoints.",
      },
    ],
    heroVisual: {
      src: "/requirements/separate-sales-processes-hero.png",
      alt: "Educational CRM UI showing two separate pipeline boards — New Business and Expansion — each with its own stage model and owners.",
      caption:
        "Separate sales processes mean independent stage engines, not one funnel with filters.",
    },
    needsVisual: {
      src: "/requirements/separate-sales-processes-needs.png",
      alt: "Diagram mapping forced-funnel, filter fiction, blended metrics, and access bleed to CRM fixes via multiple pipelines.",
      caption:
        "What breaks when one board is asked to represent two sales motions — and how this requirement helps.",
    },
    workflowVisual: {
      src: "/requirements/separate-sales-processes-workflow.png",
      alt: "Five-step buyer validation loop: map motions, configure trial, route sample deals, inspect bleed, accept or simplify.",
      caption:
        "How to validate separate-process support in a CRM trial before you buy.",
    },
    faq: [
      {
        question: "What does “support separate sales processes” mean as a requirement?",
        answer:
          "It means the CRM can model materially different opportunity workflows — typically via multiple pipelines with independent stages — instead of forcing every deal through one shared stage model. The requirement is the buyer need; multiple pipelines are a common feature that helps satisfy it.",
      },
      {
        question: "How is this requirement different from the multiple-pipelines feature?",
        answer:
          "The requirement is what you need to achieve (distinct process models that stay honest). Multiple pipelines are concrete product functionality that often delivers that outcome. Some products may meet the need with other process containers; evaluate the outcome, not the label alone.",
      },
      {
        question: "Do we need separate processes on day one?",
        answer:
          "Only if motions already differ in real checkpoints. Many teams start with one honest pipeline and split later when a second motion proves it needs its own stages.",
      },
      {
        question: "Can fields or tags replace separate pipelines?",
        answer:
          "Sometimes, when differences are minor. If stages, exit criteria, automation, or reporting must diverge, tags on one board usually recreate the same forced-funnel problems.",
      },
    ],
    useCaseLinks: [
      {
        id: "complex",
        title: "Complex sales processes",
        description:
          "Long-cycle, multi-stakeholder deals often need a stage model distinct from transactional motions.",
        importanceLabel: "Critical",
        href: "/use-cases/complex-sales-processes/",
        icon: "layers",
      },
      {
        id: "pipeline",
        title: "Pipeline management",
        description:
          "Separate processes still depend on owned stages and next steps inside each board.",
        importanceLabel: "High",
        href: "/use-cases/pipeline-management/",
        icon: "funnel",
      },
      {
        id: "account",
        title: "Account management",
        description:
          "Expansion and retention motions often deserve a process separate from new-logo sales.",
        importanceLabel: "High",
        href: "/use-cases/account-management/",
        icon: "building",
      },
    ],
    primaryCapabilityHref: "/capabilities/pipeline-management/",
  },

  "automate-lead-follow-up": {
    displayTitle: "CRM requirement: Automate lead follow-up",
    tagline:
      "Trigger first-touch SLAs, idle-lead reminders, and multi-step sequences from the record — so follow-up survives busy weeks and vacations.",
    overview:
      "Automating lead follow-up means the CRM can create tasks, reminders, notifications, or sequence steps when lead conditions occur — new inbound, inactivity, stage change — instead of relying only on personal memory. Workflow automation is usually the foundation; email sequences and sales engagement deepen multi-step outreach once ownership and SLAs are clear. This requirement is about consistent response discipline under volume, not about removing human judgment from qualification. Evaluate trigger coverage, task ownership, sequence controls, and how managers see missed SLAs.",
    whoThisIsFor:
      "Inbound SDR pods, high-volume lead teams, and sales managers who still chase “who touched this form fill?” in Slack. Typical situations: a B2B SaaS inbound pod with same-day first-touch SLAs, a financial-services advisory desk routing web leads, or an agency BD team that drops warm intros when Friday fills up.",
    whatMattersIntro:
      "Prioritize event-based triggers tied to real lead events, owned tasks with due times, and a manager view of overdue first touches — before long sequence libraries. Automating an unclear lead process amplifies noise. Confirm plan limits on automation runs and whether sequences pause when a human replies.",
    workedExample:
      "Worked example: a B2B SaaS inbound SDR pod. Before CRM, form fills waited on a coordinator Slack ping and first touches slipped past the same-day SLA. After CRM, new-lead rules assign an owner and create a timed first-touch task; idle leads at 48 hours create a manager-visible reminder — coaching starts from overdue tasks, not from “any updates?”",
    workedExampleSecondary:
      "Worked example: a financial-services advisory intake desk. Before CRM, nurture follow-ups lived in personal calendars and stalled when advisors traveled. After CRM, inactivity workflows create the next call task on the lead, and a short email sequence runs only until the advisor logs a conversation.",
    challenges: [
      {
        id: "sla-drift",
        title: "First-touch SLAs depend on memory",
        pain: "Inbound leads cool while ownership waits on Slack or a shared inbox.",
        crmHelps:
          "New-lead triggers assign owners and create timed first-touch tasks where the work lives.",
      },
      {
        id: "idle-leads",
        title: "Idle leads go quiet unnoticed",
        pain: "Warm prospects stall after one touch with no system reminder.",
        crmHelps:
          "Inactivity rules surface overdue follow-ups before managers notice by accident.",
      },
      {
        id: "manual-sequences",
        title: "Multi-step follow-up is hand-built every time",
        pain: "Reps reinvent the same three emails; coverage collapses when someone is out.",
        crmHelps:
          "Sequences and workflow tasks standardize the cadence while keeping ownership on the lead.",
      },
      {
        id: "automation-noise",
        title: "Bad rules create task spam",
        pain: "Over-eager automation floods queues and trains the team to ignore the CRM.",
        crmHelps:
          "Scoped triggers with clear owners and review keep automation useful instead of theatrical.",
      },
    ],
    outcomes: [
      {
        id: "faster-first-touch",
        title: "More consistent first touches",
        description:
          "New leads get owned, timed work instead of waiting on coordinator memory.",
      },
      {
        id: "fewer-drops",
        title: "Fewer dropped nurture loops",
        description:
          "Idle and post-call follow-ups surface as tasks before the lead goes cold.",
      },
      {
        id: "manager-sla-view",
        title: "Manager-visible SLA gaps",
        description:
          "Overdue first touches and idle leads are reviewable without reconstructing Slack history.",
      },
      {
        id: "handoff-safe",
        title: "Handoff-safe follow-up state",
        description:
          "Covering SDRs inherit what is due next on the lead record.",
      },
    ],
    acceptanceNeeds: [
      {
        id: "event-triggers",
        title: "Event-based follow-up triggers",
        description:
          "New lead, inactivity, or stage/status change can create owned tasks or notifications.",
        priority: "must",
        href: "/capabilities/workflow-automation/",
      },
      {
        id: "owned-tasks",
        title: "Owned tasks with due times",
        description:
          "Follow-up work lands on a named person with a reviewable deadline on the lead.",
        priority: "must",
        href: "/use-cases/customer-follow-up/",
      },
      {
        id: "lead-context",
        title: "Lead records automation can act on",
        description:
          "Lifecycle status, owner, and source fields exist so rules have trustworthy inputs.",
        priority: "must",
        href: "/capabilities/lead-management/",
      },
      {
        id: "sla-visibility",
        title: "Visibility into missed follow-up",
        description:
          "Managers can see overdue first touches or idle leads without rebuilding a sheet.",
        priority: "must",
        href: "/use-cases/high-volume-lead-management/",
      },
      {
        id: "sequences",
        title: "Multi-step email / outreach sequences",
        description:
          "Cadences help when volume requires standardized steps after ownership is clear.",
        priority: "nice",
        href: "/capabilities/sales-engagement/",
      },
      {
        id: "reply-pause",
        title: "Human-reply / stop conditions",
        description:
          "Sequences and reminders pause or hand back when a real conversation starts.",
        priority: "nice",
        href: "/use-cases/sales-automation/",
      },
      {
        id: "trial-checklist",
        title: "Trial evaluation of automation limits",
        description:
          "Confirm plan caps, failure logs, and who can edit rules before committing.",
        priority: "nice",
        href: "/guides/crm-trial-evaluation/",
      },
    ],
    workflowSteps: [
      {
        id: "define-sla",
        label: "Define SLA",
        detail:
          "Write the first-touch and idle rules you actually enforce (times, owners, exceptions).",
      },
      {
        id: "wire-triggers",
        label: "Wire triggers",
        detail:
          "In trial, create rules for new lead, inactivity, and one stage handoff — keep the set small.",
      },
      {
        id: "run-volume",
        label: "Run sample volume",
        detail:
          "Inject realistic inbound and idle scenarios; complete or miss tasks on purpose.",
      },
      {
        id: "review-queues",
        label: "Review queues",
        detail:
          "Check whether overdue work is visible to managers and whether noise is tolerable.",
      },
      {
        id: "tune-or-stop",
        label: "Tune or stop",
        detail:
          "Keep only rules that reduce missed follow-ups; disable anything that creates spam.",
      },
    ],
    heroVisual: {
      src: "/requirements/automate-lead-follow-up-hero.png",
      alt: "Educational CRM UI showing a new inbound lead with an automated first-touch task, SLA timer, and sequence step on the record.",
      caption:
        "Automated lead follow-up turns SLA and idle rules into owned work on the lead.",
    },
    needsVisual: {
      src: "/requirements/automate-lead-follow-up-needs.png",
      alt: "Diagram mapping SLA drift, idle leads, manual sequences, and automation noise to CRM follow-up automation fixes.",
      caption:
        "What breaks when follow-up depends only on memory — and how this requirement helps.",
    },
    workflowVisual: {
      src: "/requirements/automate-lead-follow-up-workflow.png",
      alt: "Five-step buyer validation loop: define SLA, wire triggers, run sample volume, review queues, tune or stop.",
      caption:
        "How to validate lead follow-up automation in a CRM trial before you scale rules.",
    },
    faq: [
      {
        question: "What does automate lead follow-up mean as a requirement?",
        answer:
          "It means the CRM can trigger reminders, tasks, updates, or multi-step outreach when lead conditions occur — instead of relying only on manual discipline. The requirement is the buyer need; workflow automation and sequences are features that help satisfy it.",
      },
      {
        question: "Is workflow automation enough on its own?",
        answer:
          "It is usually the foundation for tasks and SLA reminders. Email sequences and sales engagement often complete multi-step outreach. Evaluate whether you need reminders, cadences, or both.",
      },
      {
        question: "Should we automate before the lead process is clear?",
        answer:
          "No. Automating fuzzy ownership and stages scales inconsistency. Define who owns first touch and what “idle” means, then automate those events.",
      },
      {
        question: "How is this different from general sales automation?",
        answer:
          "This requirement focuses on timely lead follow-up and first-touch discipline. Broader sales automation also covers deal-stage handoffs, routing, and other repetitive sales admin beyond the lead lifecycle.",
      },
    ],
    useCaseLinks: [
      {
        id: "high-volume",
        title: "High-volume lead management",
        description:
          "Automation is often critical when inbound or list volume makes manual follow-up unreliable.",
        importanceLabel: "Critical",
        href: "/use-cases/high-volume-lead-management/",
        icon: "users",
      },
      {
        id: "sales-auto",
        title: "Sales automation",
        description:
          "Follow-up rules sit inside the broader job of automating repetitive sales work.",
        importanceLabel: "High",
        href: "/use-cases/sales-automation/",
        icon: "zap",
      },
      {
        id: "customer-follow-up",
        title: "Customer follow-up",
        description:
          "Dated next steps after conversations complement automated lead reminders.",
        importanceLabel: "High",
        href: "/use-cases/customer-follow-up/",
        icon: "check",
      },
    ],
    primaryCapabilityHref: "/capabilities/workflow-automation/",
  },

  "restrict-access-by-team": {
    displayTitle: "CRM requirement: Restrict access by team",
    tagline:
      "Limit who can see, edit, and export records by role and team — so sensitive books, partner deals, and field territories stay appropriately scoped.",
    overview:
      "Restricting access by team means the CRM can enforce who sees which accounts, deals, and fields — and who can export bulk data — based on roles, teams, or ownership rules. This is a security and governance requirement, not merely “having user logins.” Teams need it when multiple pods share one CRM but should not share every book of business, compensation-sensitive pipeline, or client file. Evaluate role models, record visibility (ownership, teams, hierarchies), field-level controls, and export permissions with concrete trial scenarios — not marketing claims about “enterprise security.”",
    whoThisIsFor:
      "IT/security leads, CRM admins, and operators in multi-team orgs — a financial-services advisory firm with restricted UHNW books, a B2B SaaS company separating partner deals from direct AEs, or a field-sales org with territory-only visibility. You feel the pain when everyone in “Sales” can open every account or export the full contact database.",
    whatMattersIntro:
      "Prioritize record-level visibility rules and export controls before exotic compliance badges. Role-only models that show all accounts to an entire department often fail restricted-book scenarios. Confirm how ownership transfer, shared coverage, and manager roll-ups behave when visibility is tight — and who can change permissions.",
    workedExample:
      "Worked example: a financial-services advisory firm. Before CRM, every advisor could open every household in a shared spreadsheet clone. After CRM, roles limit record visibility to owned books plus named coverage; sensitive net-worth fields are hidden from junior staff, and bulk export is limited to admins — coverage still works for vacation handoffs without opening the whole book.",
    workedExampleSecondary:
      "Worked example: a B2B SaaS company with a partner channel. Before CRM, partner-sourced deals were visible to all AEs and leaked into compensation disputes. After CRM, partner pipeline visibility is scoped to the partner team and leadership; direct AEs see only their territory — forecast roll-ups still work for managers with hierarchy access.",
    challenges: [
      {
        id: "department-wide-view",
        title: "Everyone in Sales sees every record",
        pain: "Restricted books, partner deals, or competitive accounts are exposed to the wrong people.",
        crmHelps:
          "Team, ownership, or hierarchy-based visibility limits records without abandoning a shared CRM.",
      },
      {
        id: "field-overexposure",
        title: "Sensitive fields are visible to all editors",
        pain: "Compensation notes, personal data, or commercial terms appear on layouts everyone can read.",
        crmHelps:
          "Field-level permissions hide or lock sensitive attributes by role.",
      },
      {
        id: "uncontrolled-export",
        title: "Anyone can export the database",
        pain: "Bulk CSV downloads leave with departing reps or curious users.",
        crmHelps:
          "Export permissions and logging limit who can extract large data sets.",
      },
      {
        id: "coverage-breakage",
        title: "Tight access breaks legitimate coverage",
        pain: "Vacation handoffs fail because covering reps cannot see the account at all.",
        crmHelps:
          "Shared ownership, teams, or temporary access rules allow coverage without opening the whole org.",
      },
    ],
    outcomes: [
      {
        id: "scoped-books",
        title: "Books of business stay appropriately scoped",
        description:
          "Teams operate in one CRM without every user browsing every account.",
      },
      {
        id: "field-hygiene",
        title: "Sensitive fields stay role-appropriate",
        description:
          "Junior or adjacent roles see what they need without overexposure.",
      },
      {
        id: "safer-exports",
        title: "Safer bulk data extraction",
        description:
          "Export rights match trust level; admins can see who can take data out.",
      },
      {
        id: "coverage-safe",
        title: "Coverage without total openness",
        description:
          "Handoffs and manager roll-ups work through deliberate sharing rules.",
      },
    ],
    acceptanceNeeds: [
      {
        id: "role-model",
        title: "Role-based access model",
        description:
          "You can define roles that differ in object create/edit/delete rights — not one flat “user” permission.",
        priority: "must",
        href: "/features/role-permissions/",
      },
      {
        id: "record-visibility",
        title: "Record-level visibility rules",
        description:
          "Accounts/deals can be limited by owner, team, territory, or hierarchy — not only by department role.",
        priority: "must",
        href: "/capabilities/security/",
      },
      {
        id: "export-control",
        title: "Export / bulk extract controls",
        description:
          "Not every user with read access can download the full contact or deal set.",
        priority: "must",
        href: "/capabilities/security/",
      },
      {
        id: "coverage-path",
        title: "Legitimate sharing / coverage path",
        description:
          "You can grant temporary or team access for vacation and manager oversight without opening everything.",
        priority: "must",
        href: "/use-cases/account-management/",
      },
      {
        id: "field-permissions",
        title: "Field-level permissions",
        description:
          "Hide or lock sensitive fields (commercial terms, personal data) by role when needed.",
        priority: "nice",
        href: "/capabilities/administration/",
      },
      {
        id: "audit-visibility",
        title: "Audit of access-relevant actions",
        description:
          "Ability to review permission changes or high-risk exports where the product supports it.",
        priority: "nice",
        href: "/guides/crm-vendor-questions/",
      },
    ],
    workflowSteps: [
      {
        id: "map-sensitivity",
        label: "Map sensitivity",
        detail:
          "List which records and fields must stay team-scoped vs leadership-visible.",
      },
      {
        id: "define-roles",
        label: "Define trial roles",
        detail:
          "Create at least three roles (e.g. AE, partner manager, admin) with different visibility expectations.",
      },
      {
        id: "seed-records",
        label: "Seed restricted records",
        detail:
          "Load sample accounts/deals owned by different teams, including one “restricted book.”",
      },
      {
        id: "login-as",
        label: "Login-as test",
        detail:
          "Sign in as each role and verify what is visible, editable, and exportable — including coverage handoff.",
      },
      {
        id: "decide-controls",
        label: "Decide controls",
        detail:
          "Accept only if restricted scenarios hold without breaking manager roll-ups you require.",
      },
    ],
    heroVisual: {
      src: "/requirements/restrict-access-by-team-hero.png",
      alt: "Educational CRM security UI showing role permissions, team-scoped record visibility, hidden sensitive fields, and export controls.",
      caption:
        "Restrict access by team means roles, record visibility, and export control — not just user logins.",
    },
    needsVisual: {
      src: "/requirements/restrict-access-by-team-needs.png",
      alt: "Diagram mapping department-wide visibility, field overexposure, uncontrolled exports, and coverage breakage to CRM security fixes.",
      caption:
        "What breaks without team-scoped access — and how this requirement helps.",
    },
    workflowVisual: {
      src: "/requirements/restrict-access-by-team-workflow.png",
      alt: "Five-step buyer validation loop: map sensitivity, define trial roles, seed restricted records, login-as test, decide controls.",
      caption:
        "How to validate team access restrictions in a CRM trial before you trust production data.",
    },
    faq: [
      {
        question: "What does restrict access by team mean as a requirement?",
        answer:
          "It means the CRM can limit who sees, edits, and exports records based on roles, teams, ownership, or hierarchy — so multiple groups can share a CRM without sharing every book of business. Role permissions and record visibility are features that help satisfy that need.",
      },
      {
        question: "How is this different from the security capability?",
        answer:
          "Security is the broader capability area (access control, SSO, audit, exports). This requirement is a specific buyer need inside that area: team-scoped visibility and control in day-to-day CRM use.",
      },
      {
        question: "Are role permissions enough?",
        answer:
          "Often not for restricted books. Role-only models that grant “all Sales records” fail when two teams need the same role but different accounts. Ask for record-level or team/territory visibility rules.",
      },
      {
        question: "Will tight access break forecasting and management?",
        answer:
          "It can, if manager hierarchy or roll-up access is missing. Test that leaders can still see the teams they coach while individual AEs stay scoped.",
      },
    ],
    useCaseLinks: [
      {
        id: "account",
        title: "Account management",
        description:
          "Ongoing account work often needs coverage rules without opening every client file.",
        importanceLabel: "High",
        href: "/use-cases/account-management/",
        icon: "building",
      },
      {
        id: "field",
        title: "Field sales",
        description:
          "Territory-based visibility is a common form of team-scoped access.",
        importanceLabel: "High",
        href: "/use-cases/field-sales/",
        icon: "map",
      },
      {
        id: "complex",
        title: "Complex sales processes",
        description:
          "Partner and enterprise deals frequently require tighter visibility than transactional boards.",
        importanceLabel: "Medium",
        href: "/use-cases/complex-sales-processes/",
        icon: "layers",
      },
    ],
    primaryCapabilityHref: "/capabilities/security/",
  },

  "forecast-revenue": {
    displayTitle: "CRM requirement: Forecast revenue",
    tagline:
      "Roll open pipeline into commit, best-case, and weighted outlooks from stages and categories — so weekly revenue calls stop living in a shadow spreadsheet.",
    overview:
      "Forecasting revenue in CRM means projecting likely closed revenue from open opportunities using stage-based weights, forecast categories (commit / best case / pipeline), manager judgment, or a combination. It is forward-looking and distinct from historical reporting dashboards. This requirement is about a shared, inspectable forecast process on clean pipeline — not about inventing accuracy percentages or promising predictive magic. Evaluate category definitions, amount/close-date hygiene, roll-ups by team, and the ability to drill from totals to deal evidence.",
    whoThisIsFor:
      "Sales managers, founders, and RevOps partners who must call a number weekly or monthly — a B2B SaaS VP Sales running Friday forecast, a professional-services firm forecasting project wins, or a financial-services sales leader separating commit from upside. You are done reconstructing the “real” number from AE emails and mismatched personal sheets.",
    whatMattersIntro:
      "Prioritize honest stages, required amount and close date, and shared category definitions before advanced predictive models. A simple commit process on clean pipeline beats a sophisticated model on fiction. Do not treat vendor demo accuracy claims as proof; validate whether your team can inspect borderline deals in the same system used for the call.",
    workedExample:
      "Worked example: a B2B SaaS sales manager submitting a Friday forecast. Before CRM, each AE emailed a number with different meanings of “commit,” and the manager rebuilt a sheet. After CRM, forecast categories sit on opportunities with shared stage rules — the meeting inspects evidence on borderline commits, not arithmetic in a new workbook.",
    workedExampleSecondary:
      "Worked example: a founder preparing a board update for a services firm. Before CRM, pipeline dollar totals mixed wishful late stages. After CRM, forecast views separate commit from upside so leadership sees risk clearly without inventing a precision percentage.",
    challenges: [
      {
        id: "shadow-sheet",
        title: "The real forecast lives in a spreadsheet",
        pain: "CRM pipeline is ignored because managers do not trust categories or hygiene.",
        crmHelps:
          "Native forecast views roll up the same opportunities the team already works — when categories are defined.",
      },
      {
        id: "category-confusion",
        title: "Commit means different things by rep",
        pain: "One AE’s commit is another’s best case, so totals are not comparable.",
        crmHelps:
          "Written category rules on opportunities create a common language for the call.",
      },
      {
        id: "dirty-inputs",
        title: "Forecasts inherit dirty pipeline",
        pain: "Missing amounts, fictional stages, and zombie deals inflate weighted outlooks.",
        crmHelps:
          "Forecast discipline forces owners, stages, and close dates onto open deals.",
      },
      {
        id: "no-drilldown",
        title: "Totals without deal inspection",
        pain: "Leaders argue about a number without opening the opportunities behind it.",
        crmHelps:
          "Forecast views that drill to stage, next step, and category evidence make calls reviewable.",
      },
    ],
    outcomes: [
      {
        id: "shared-language",
        title: "A shared forecast language",
        description:
          "Commit and best case mean the same thing across the team.",
      },
      {
        id: "inspectable-deals",
        title: "Inspectable borderline deals",
        description:
          "Meetings challenge evidence on categories, not just spreadsheet totals.",
      },
      {
        id: "cleaner-pipeline",
        title: "Cleaner pipeline as a side effect",
        description:
          "Forecast pressure drives stage honesty and zombie-deal cleanup.",
      },
      {
        id: "less-rebuild",
        title: "Less weekly rebuild labor",
        description:
          "Managers stop recreating the forecast in a personal workbook.",
      },
    ],
    acceptanceNeeds: [
      {
        id: "pipeline-inputs",
        title: "Trusted pipeline stages and ownership",
        description:
          "Forecast inputs start from an honest stage board with named owners.",
        priority: "must",
        href: "/capabilities/pipeline-management/",
      },
      {
        id: "forecast-fields",
        title: "Amount, close date, and forecast category (or equivalent)",
        description:
          "Required fields that power commit, best-case, and pipeline views.",
        priority: "must",
        href: "/features/forecasting/",
      },
      {
        id: "forecast-views",
        title: "Forecast views by category / period",
        description:
          "Managers can review commit, best case, and pipeline in one place for a period.",
        priority: "must",
        href: "/capabilities/forecasting/",
      },
      {
        id: "deal-inspection",
        title: "Deal-level inspection from the forecast",
        description:
          "Drill from totals to stage, next step, and evidence on borderline deals.",
        priority: "must",
        href: "/use-cases/sales-forecasting/",
      },
      {
        id: "team-rollups",
        title: "Team / hierarchy roll-ups",
        description:
          "Useful when multiple managers contribute to one leadership call.",
        priority: "nice",
        href: "/use-cases/reporting/",
      },
      {
        id: "snapshot-history",
        title: "Snapshot or period history",
        description:
          "Compare prior calls to actuals for calibration over time — without inventing accuracy claims.",
        priority: "nice",
        href: "/capabilities/reporting/",
      },
    ],
    workflowSteps: [
      {
        id: "hygiene-bar",
        label: "Set hygiene bar",
        detail:
          "Define required amount, close date, stage honesty, and zombie-deal rules before trusting any forecast view.",
      },
      {
        id: "define-categories",
        label: "Define categories",
        detail:
          "Write what commit vs best case vs pipeline means for your team in one page.",
      },
      {
        id: "configure-trial",
        label: "Configure trial forecast",
        detail:
          "Enable categories or stage weights on sample opportunities across two teams.",
      },
      {
        id: "run-mock-call",
        label: "Run a mock forecast call",
        detail:
          "Build the period view in CRM and inspect three borderline deals end-to-end.",
      },
      {
        id: "accept-process",
        label: "Accept the process",
        detail:
          "Keep CRM as the forecast system of record only if the team can run the call without a shadow sheet.",
      },
    ],
    heroVisual: {
      src: "/requirements/forecast-revenue-hero.png",
      alt: "Educational CRM forecast UI rolling opportunities into commit, best case, and pipeline outlook versus period target.",
      caption:
        "Revenue forecasting in CRM is category and stage judgment on clean pipeline — not a promised accuracy percentage.",
    },
    needsVisual: {
      src: "/requirements/forecast-revenue-needs.png",
      alt: "Diagram mapping shadow spreadsheets, category confusion, dirty inputs, and no-drilldown totals to CRM forecasting fixes.",
      caption:
        "What breaks when forecasts live outside CRM — and how this requirement helps.",
    },
    workflowVisual: {
      src: "/requirements/forecast-revenue-workflow.png",
      alt: "Five-step buyer validation loop: set hygiene bar, define categories, configure trial forecast, run mock call, accept the process.",
      caption:
        "How to validate revenue forecasting in a CRM trial before you retire the shadow sheet.",
    },
    faq: [
      {
        question: "What does forecast revenue mean as a CRM requirement?",
        answer:
          "It means the CRM can project likely closed revenue from open pipeline using stages, weights, forecast categories, and/or manager judgment — in a view the team can inspect together. It does not mean a vendor-guaranteed accuracy rate.",
      },
      {
        question: "How is this requirement different from the forecasting feature?",
        answer:
          "The requirement is the buyer need: a trustworthy, shared revenue call from pipeline. Forecasting features (categories, weighted roll-ups, overrides) are product functionality that may satisfy that need. Reporting dashboards alone are usually historical, not a full forecast process.",
      },
      {
        question: "Should we buy CRM for forecasting on day one?",
        answer:
          "Only if pipeline stages, amounts, and ownership are already honest enough to feed a call. Otherwise fix pipeline hygiene first; forecast views will amplify fiction.",
      },
      {
        question: "Stage-weighted vs category-based forecasting — which do we need?",
        answer:
          "Many teams use both: stages for process honesty and categories for commit judgment. Choose based on how your leadership call works — validate both models in trial rather than assuming one is universally better.",
      },
    ],
    useCaseLinks: [
      {
        id: "sales-forecasting",
        title: "Sales forecasting",
        description:
          "The operating use case for running commit and best-case calls from CRM.",
        importanceLabel: "Critical",
        href: "/use-cases/sales-forecasting/",
        icon: "chart",
      },
      {
        id: "pipeline",
        title: "Pipeline management",
        description:
          "Forecast quality inherits stage honesty, ownership, and next-step discipline.",
        importanceLabel: "Critical",
        href: "/use-cases/pipeline-management/",
        icon: "funnel",
      },
      {
        id: "reporting",
        title: "Reporting",
        description:
          "Historical conversion and activity reports complement — but do not replace — forward forecast calls.",
        importanceLabel: "High",
        href: "/use-cases/reporting/",
        icon: "chart",
      },
    ],
    primaryCapabilityHref: "/capabilities/forecasting/",
  },

  "track-client-interactions": {
    displayTitle: "CRM requirement: Track client interactions",
    tagline:
      "Keep emails, calls, meetings, and notes on a shared activity timeline — so coverage and coaching start from the record, not from someone’s inbox.",
    overview:
      "Tracking client interactions means every meaningful touch — email, call, meeting, note — can be attached to the right contact, account, or deal and reviewed on a timeline. This requirement underpins relationship continuity, handoffs, and coaching; it is not the same as marketing engagement scoring or a complete customer-support ticket system. Teams need it when commitments live in private inboxes and covering colleagues restart the story. Evaluate logging effort, email/calendar capture, timeline completeness, and whether activity is visible to the people who need coverage — with appropriate access controls.",
    whoThisIsFor:
      "Account managers, advisors, AEs, and client-success partners who share relationships — an advisory practice covering households, an agency retainer pod, or a B2B SaaS AM team running QBRs. You feel the pain when a colleague is out and the only history is buried in one person’s mailbox.",
    whatMattersIntro:
      "Prioritize a readable timeline on the record, low-friction capture (manual notes plus email/calendar sync where needed), and next-step tasks after meaningful touches. Fancy activity scores matter less than whether a covering teammate can reconstruct the last three conversations in under a minute. Confirm visibility rules so interaction history does not overexpose sensitive notes.",
    workedExample:
      "Worked example: a financial-services advisory practice. Before CRM, household commitments lived in planner notebooks and personal email; covering advisors restarted discovery. After CRM, calls, meeting notes, and synced emails sit on the household timeline with a dated next review — coverage starts from the record.",
    workedExampleSecondary:
      "Worked example: an agency retainer pod. Before CRM, the lead strategist’s inbox was the account history. After CRM, every client account shows recent meetings, emailed decisions, and open follow-ups — the pod can brief a substitute without a scavenger hunt.",
    challenges: [
      {
        id: "inbox-memory",
        title: "History lives in private inboxes",
        pain: "Only the sender knows what was promised; coverage and coaching are blind.",
        crmHelps:
          "Email and meeting capture attach correspondence to the shared contact or account timeline.",
      },
      {
        id: "thin-logging",
        title: "Calls and meetings leave no usable note",
        pain: "Activity exists as a calendar block with no decisions or next steps on the record.",
        crmHelps:
          "Structured notes and tasks on the interaction make history actionable for the team.",
      },
      {
        id: "fragmented-timeline",
        title: "Touches are scattered across tools",
        pain: "Slack, email, and spreadsheets each hold a partial story nobody can assemble quickly.",
        crmHelps:
          "A single activity timeline on the CRM record becomes the default place to reconstruct context.",
      },
      {
        id: "handoff-amnesia",
        title: "Handoffs restart the client story",
        pain: "New AMs or covering advisors ask the client to repeat history already told.",
        crmHelps:
          "Complete interaction history travels with the account when ownership changes.",
      },
    ],
    outcomes: [
      {
        id: "shared-memory",
        title: "Shared interaction memory",
        description:
          "Commitments and preferences live on the account timeline, not in one inbox.",
      },
      {
        id: "faster-coverage",
        title: "Faster coverage briefings",
        description:
          "Substitutes reconstruct recent touches without hunting through personal mail.",
      },
      {
        id: "coachable-history",
        title: "Coachable conversation history",
        description:
          "Managers review what happened and what is next from the same record.",
      },
      {
        id: "quieter-gaps",
        title: "Easier to spot quiet relationships",
        description:
          "Last-activity context makes coverage gaps visible before clients feel ignored.",
      },
    ],
    acceptanceNeeds: [
      {
        id: "activity-timeline",
        title: "Activity timeline on contacts/accounts/deals",
        description:
          "Emails, calls, meetings, and notes appear in chronological context on the record.",
        priority: "must",
        href: "/capabilities/relationship-management/",
      },
      {
        id: "manual-logging",
        title: "Low-friction manual logging",
        description:
          "Reps can log a call or meeting note with owner and date without a heavy form.",
        priority: "must",
        href: "/capabilities/contact-management/",
      },
      {
        id: "next-step-link",
        title: "Next step tied to the interaction",
        description:
          "Meaningful touches can create or update a dated follow-up on the same record.",
        priority: "must",
        href: "/use-cases/customer-follow-up/",
      },
      {
        id: "coverage-visibility",
        title: "Visibility for covering teammates",
        description:
          "People who need coverage can read the timeline (within your access model).",
        priority: "must",
        href: "/use-cases/account-management/",
      },
      {
        id: "email-calendar-sync",
        title: "Email / calendar sync",
        description:
          "Reduces manual logging for correspondence and meetings when the team will actually adopt it.",
        priority: "nice",
        href: "/capabilities/email/",
      },
      {
        id: "activity-reporting",
        title: "Activity / coverage reporting",
        description:
          "Managers can see quiet accounts or activity distribution without exporting raw logs.",
        priority: "nice",
        href: "/capabilities/reporting/",
      },
    ],
    workflowSteps: [
      {
        id: "define-touches",
        label: "Define touches",
        detail:
          "List which interaction types must appear on the timeline (calls, meetings, emails, notes).",
      },
      {
        id: "configure-capture",
        label: "Configure capture",
        detail:
          "In trial, enable logging plus any email/calendar sync you expect to use in production.",
      },
      {
        id: "run-week",
        label: "Run a real week",
        detail:
          "Have two people log and sync touches on the same sample account, including a coverage handoff.",
      },
      {
        id: "reconstruct",
        label: "Reconstruct",
        detail:
          "A third person briefs from the timeline only — time how long it takes and what is missing.",
      },
      {
        id: "accept-habit",
        label: "Accept the habit",
        detail:
          "Keep only capture methods the team will sustain; drop sync that creates noise or privacy issues.",
      },
    ],
    heroVisual: {
      src: "/requirements/track-client-interactions-hero.png",
      alt: "Educational CRM account timeline showing emails, calls, meetings, and notes with owners and next-step tasks on one record.",
      caption:
        "Tracking client interactions means a shared activity timeline on the record — not history trapped in one inbox.",
    },
    needsVisual: {
      src: "/requirements/track-client-interactions-needs.png",
      alt: "Diagram mapping inbox memory, thin logging, fragmented tools, and handoff amnesia to CRM interaction-tracking fixes.",
      caption:
        "What breaks when interaction history is private — and how this requirement helps.",
    },
    workflowVisual: {
      src: "/requirements/track-client-interactions-workflow.png",
      alt: "Five-step buyer validation loop: define touches, configure capture, run a real week, reconstruct, accept the habit.",
      caption:
        "How to validate interaction tracking in a CRM trial before you trust it for coverage.",
    },
    faq: [
      {
        question: "What does track client interactions mean as a requirement?",
        answer:
          "It means meaningful emails, calls, meetings, and notes can live on a shared CRM timeline for contacts, accounts, or deals — so coverage and coaching do not depend on one person’s inbox. Activity timelines and email sync are features that help satisfy that need.",
      },
      {
        question: "How is this different from relationship management?",
        answer:
          "Relationship management is the broader capability/use case of ongoing account context and coverage. Tracking interactions is the specific requirement that history of touches is captured and reviewable on the record.",
      },
      {
        question: "Do we need automatic email sync on day one?",
        answer:
          "Not always. Many teams start with disciplined meeting notes and call logs, then add sync when volume makes manual capture unreliable. Sync helps only if privacy rules and adoption are clear.",
      },
      {
        question: "Is this the same as a support ticketing timeline?",
        answer:
          "No. This requirement focuses on sales and relationship touches on CRM records. Support tickets may integrate later; do not assume a CRM activity feed replaces a service desk.",
      },
    ],
    useCaseLinks: [
      {
        id: "relationship",
        title: "Relationship management",
        description:
          "Ongoing client context depends on a trustworthy interaction history.",
        importanceLabel: "Critical",
        href: "/use-cases/relationship-management/",
        icon: "handshake",
      },
      {
        id: "account",
        title: "Account management",
        description:
          "Account coverage and renewals need shared touches across the pod.",
        importanceLabel: "Critical",
        href: "/use-cases/account-management/",
        icon: "building",
      },
      {
        id: "customer-follow-up",
        title: "Customer follow-up",
        description:
          "Logging a touch without a next step still drops the ball — pair timeline with dated tasks.",
        importanceLabel: "High",
        href: "/use-cases/customer-follow-up/",
        icon: "check",
      },
    ],
    primaryCapabilityHref: "/capabilities/relationship-management/",
  },
};
