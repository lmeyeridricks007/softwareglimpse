import type { FeatureDetailProfile } from "@/domain";

type Depth = Pick<
  FeatureDetailProfile,
  | "displayTitle"
  | "tagline"
  | "overview"
  | "whoThisIsFor"
  | "whatMattersIntro"
  | "challenges"
  | "outcomes"
  | "workflowSteps"
  | "heroVisual"
  | "needsVisual"
  | "workflowVisual"
  | "workedExamples"
  | "faq"
>;

/**
 * Depth layers for CRM Features pillar pages (`/features/[slug]/`).
 * Educational / operational — no invented rankings, prices, product endorsements,
 * or fake metrics. A feature is a concrete product capability buyers compare;
 * a capability hub describes the broader job family; a use case is the team job.
 */
export const featureDepthBySlug: Record<string, Depth> = {
  "multiple-pipelines": {
    displayTitle: "CRM Multiple Pipelines feature",
    tagline:
      "Run genuinely different sales or relationship processes as separate pipelines — not one overloaded funnel with filters pretending to be structure.",
    overview:
      "Multiple pipelines is the CRM feature that lets you maintain separate opportunity workflows with their own stage models, instead of forcing every deal through one shared funnel. It is not the same as custom stages inside a single pipeline, and it is not the same as filtered views or tags on one board. Teams reach for this feature when new business, renewals, partner deals, or advisory workflows follow materially different checkpoints.",
    whoThisIsFor:
      "Sales ops, revenue leaders, and multi-team orgs where at least two processes have different stages, owners, or reporting needs — for example a B2B SaaS pod with new logo vs expansion, an agency with new-business vs retainers, or a financial-services firm separating advisory intake from product sales.",
    whatMattersIntro:
      "Evaluate whether each pipeline can have independent stages, fields, automation scope, and reporting — not how many pipelines the marketing site claims. If two motions share the same checkpoints, one well-designed pipeline usually beats two half-configured ones.",
    challenges: [
      {
        id: "forced-funnel",
        title: "One funnel forced onto mismatched processes",
        pain: "New business and renewals share stages that only fit one motion, so reps skip or invent status.",
        crmHelps:
          "Separate pipelines keep each process’s stage model honest without contaminating the other.",
      },
      {
        id: "filter-fiction",
        title: "Filters and tags stand in for real structure",
        pain: "Managers filter a single board by deal type and call it “pipelines,” then forecasts and coaching still mix incompatible deals.",
        crmHelps:
          "True multiple pipelines isolate stage definitions and, where supported, reporting per process.",
      },
      {
        id: "reporting-blend",
        title: "Reporting mixes incompatible deal types",
        pain: "Conversion rates and stuck-stage metrics become meaningless when motions are blended.",
        crmHelps:
          "Pipeline-scoped views and reports keep each motion’s metrics readable.",
      },
      {
        id: "access-bleed",
        title: "Teams see processes they should not own",
        pain: "Partner or advisory boards are visible to people who only need new-business deals.",
        crmHelps:
          "Pipeline-level access (with role permissions) limits noise and leakage.",
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
        id: "scoped-automation",
        title: "Automation that stays in scope",
        description:
          "Stage triggers and tasks can follow the rules of one pipeline without firing on another.",
      },
      {
        id: "readable-metrics",
        title: "Readable conversion metrics",
        description:
          "Stage conversion and velocity make sense because the denominator is one process.",
      },
    ],
    workflowSteps: [
      {
        id: "map",
        label: "Map motions",
        detail:
          "List which processes truly differ in stages — not just in deal size or product name.",
      },
      {
        id: "create",
        label: "Create pipelines",
        detail:
          "Stand up a pipeline per distinct motion with its own stage list and owners.",
      },
      {
        id: "route",
        label: "Route deals",
        detail:
          "Create or move opportunities into the correct pipeline at qualification.",
      },
      {
        id: "operate",
        label: "Operate",
        detail:
          "Run reviews, automation, and next steps inside each pipeline’s board.",
      },
      {
        id: "report",
        label: "Report",
        detail:
          "Analyze conversion and forecast by pipeline where the product supports it.",
      },
    ],
    workedExamples: [
      {
        id: "saas-new-vs-expansion",
        title: "B2B SaaS: new logo vs expansion",
        situation:
          "A 14-person B2B SaaS sales team runs new-logo AE deals (discovery → demo → security review → close) and expansion CSMs (QBR → upsell proposal → close) on one board. Expansion deals sit in “Demo” for weeks because that stage does not apply.",
        whatGoodLooksLike:
          "Two pipelines: New Business with demo and security stages; Expansion with QBR and commercial-review stages. Monday reviews open the right board; automation creates security checklist tasks only on new logos.",
        whatToAskVendors:
          "Can each pipeline have fully independent stages? Can workflows and reports be scoped to a pipeline? Are there plan limits on pipeline count?",
      },
      {
        id: "agency-new-vs-retainer",
        title: "Agency: new business vs retainer renewals",
        situation:
          "An 8-person digital agency tracks pitch opportunities and retainer renewals in one funnel. Pitch stages (brief → proposal → pitch → won) confuse AMs renewing retainers, who invent “stages” in notes.",
        whatGoodLooksLike:
          "A New Business pipeline for pitches and a Retention pipeline for renewals with health-check and commercial-renewal stages. Account managers only work Retention; BD owns New Business.",
        whatToAskVendors:
          "Can we restrict pipeline visibility by role? Can custom fields differ by pipeline? How do we move a won pitch into a separate retention process without duplicating the account?",
      },
    ],
    faq: [
      {
        question: "What are multiple pipelines in a CRM?",
        answer:
          "They are separate opportunity workflows — each with its own stage model — so different processes do not share one forced funnel.",
      },
      {
        question:
          "How are multiple pipelines different from custom pipeline stages?",
        answer:
          "Custom stages design the checkpoints inside one pipeline. Multiple pipelines mean you can run more than one stage model. Views and tags on a single board are not the same thing.",
      },
      {
        question: "Do we need multiple pipelines on day one?",
        answer:
          "Only if processes already differ in real checkpoints. Many teams start with one honest pipeline and split later when a second motion proves it needs its own stages.",
      },
    ],
    heroVisual: {
      src: "/features/multiple-pipelines-hero.png",
      alt: "Educational diagram of CRM multiple pipelines showing two separate process boards with independent stage models.",
      caption:
        "Multiple pipelines keep distinct sales or relationship motions on separate stage engines.",
    },
    needsVisual: {
      src: "/features/multiple-pipelines-needs.png",
      alt: "Diagram mapping pains of a forced single funnel — mixed stages, filter fiction, blended metrics — to multiple-pipeline fixes.",
      caption:
        "What breaks when one funnel is asked to represent two processes.",
    },
    workflowVisual: {
      src: "/features/multiple-pipelines-workflow.png",
      alt: "Five-step multiple-pipelines workflow: map motions, create pipelines, route deals, operate, report.",
      caption:
        "How teams stand up and operate genuinely separate CRM pipelines.",
    },
  },

  "workflow-automation": {
    displayTitle: "CRM Workflow Automation feature",
    tagline:
      "Turn stable process rules into reliable tasks, field updates, and notifications — so follow-through does not depend on memory alone.",
    overview:
      "Workflow automation is the CRM feature that runs if-this-then-that rules on records: create a task when a deal stalls, assign an owner when a lead arrives, notify a manager when a stage changes. It is not the same as multi-step email sequences, and it is not a substitute for a clear process. Teams use it after stages and ownership are honest, to reduce missed handoffs and repetitive admin.",
    whoThisIsFor:
      "Sales managers, ops leads, and growing teams (often 5–50 people) who already know the next action for common events but still miss it under volume — inbound lead response, stage handoffs, inactivity nudges, or compliance reminders.",
    whatMattersIntro:
      "Evaluate trigger coverage, action types, scoping (pipeline/team), plan limits, and how you debug failures — not how many “automations” appear on a feature checklist. Automating a fuzzy process amplifies noise.",
    challenges: [
      {
        id: "missed-followups",
        title: "Follow-ups depend on personal discipline",
        pain: "Warm leads cool because nobody created the next task after a call or form fill.",
        crmHelps:
          "Trigger-based tasks and reminders fire when the record event happens, not when someone remembers.",
      },
      {
        id: "inconsistent-handoffs",
        title: "Stage handoffs are inconsistent",
        pain: "Some reps notify CS; others dump a Slack message; closed-won context arrives late.",
        crmHelps:
          "Stage-change rules create the same tasks, owners, or notifications every time.",
      },
      {
        id: "admin-load",
        title: "Reps drown in busywork fields",
        pain: "Manual status updates and checklist ticks get skipped when the day fills up.",
        crmHelps:
          "Field updates and task creation offload the repeatable admin after the process is defined.",
      },
      {
        id: "automation-noise",
        title: "Bad rules create alert noise",
        pain: "Over-eager automations flood inboxes and train people to ignore the CRM.",
        crmHelps:
          "Scoped, reviewed rules with clear owners keep automation useful instead of theatrical.",
      },
    ],
    outcomes: [
      {
        id: "consistent-next-actions",
        title: "Consistent next actions",
        description:
          "Common events produce the same tasks and owners without chasing people in chat.",
      },
      {
        id: "faster-response",
        title: "Faster first response on inbound",
        description:
          "Assignment and task creation happen when the lead lands, not when someone checks a form inbox.",
      },
      {
        id: "cleaner-handoffs",
        title: "Cleaner stage handoffs",
        description:
          "Downstream teams get structured work items instead of informal pings.",
      },
      {
        id: "auditable-process",
        title: "A process you can inspect",
        description:
          "Rules live in the CRM where ops can review, edit, and turn them off when the process changes.",
      },
    ],
    workflowSteps: [
      {
        id: "stabilize",
        label: "Stabilize process",
        detail:
          "Document the event, condition, and desired action before building any rule.",
      },
      {
        id: "trigger",
        label: "Define trigger",
        detail:
          "Choose the record event (create, stage change, field update, inactivity).",
      },
      {
        id: "action",
        label: "Define action",
        detail:
          "Create tasks, update fields, assign owners, or notify people — keep the action list short.",
      },
      {
        id: "scope",
        label: "Scope & test",
        detail:
          "Limit the rule to the right pipeline or team; test with sample records.",
      },
      {
        id: "monitor",
        label: "Monitor",
        detail:
          "Review failures, noise, and ownership when processes or plans change.",
      },
    ],
    workedExamples: [
      {
        id: "inbound-sdr-pod",
        title: "B2B SaaS inbound: five SDRs",
        situation:
          "A SaaS company with five SDRs gets 40–80 form fills per week. Without automation, leads sit in a shared inbox until someone claims them; response times vary wildly by day.",
        whatGoodLooksLike:
          "Form → CRM lead create triggers round-robin assignment, a same-day call task, and a Slack ping to the owner. Managers review unworked tasks older than four hours instead of reconstructing ownership from email.",
        whatToAskVendors:
          "Which create/update events can trigger rules? Can assignment be round-robin or territory-based? Are monthly automation executions capped by plan?",
      },
      {
        id: "ria-stage-handoff",
        title: "RIA: advisor handoff after discovery",
        situation:
          "A 20-advisor RIA moves prospects from discovery to proposal. Compliance wants a checklist started every time, but advisors forget and ops discovers gaps at review.",
        whatGoodLooksLike:
          "Moving to Proposal creates a compliance checklist task for the ops owner and locks a required field for source of funds. The rule is pipeline-scoped so it does not fire on a separate institutional pipeline.",
        whatToAskVendors:
          "Can workflows be scoped to a pipeline? Can required-field enforcement and task creation happen on the same stage change? How do we audit which rules ran on a record?",
      },
    ],
    faq: [
      {
        question: "What is workflow automation in a CRM?",
        answer:
          "It is rule-based automation that creates tasks, updates records, assigns owners, or sends notifications when defined conditions occur on CRM records.",
      },
      {
        question:
          "How is workflow automation different from email sequences?",
        answer:
          "Workflow automation acts on records (tasks, fields, assignment). Email sequences schedule outreach steps to a person and usually stop on reply. Many teams use both.",
      },
      {
        question: "What should we automate first?",
        answer:
          "The highest-cost follow-up you already miss consistently — typically inbound assignment or stage handoffs — once the underlying process is stable enough to encode.",
      },
    ],
    heroVisual: {
      src: "/features/workflow-automation-hero.png",
      alt: "Educational diagram of CRM workflow automation showing a trigger event leading to tasks, field updates, and notifications.",
      caption:
        "Workflow automation encodes stable process rules as reliable CRM actions.",
    },
    needsVisual: {
      src: "/features/workflow-automation-needs.png",
      alt: "Diagram mapping missed follow-ups, inconsistent handoffs, and admin load to workflow automation fixes.",
      caption:
        "What typically breaks when process rules live only in people’s heads.",
    },
    workflowVisual: {
      src: "/features/workflow-automation-workflow.png",
      alt: "Five-step workflow automation lifecycle: stabilize process, define trigger, define action, scope and test, monitor.",
      caption:
        "How teams design, ship, and maintain CRM automation without creating noise.",
    },
  },

  "custom-pipeline-stages": {
    displayTitle: "CRM Custom Pipeline Stages feature",
    tagline:
      "Design the checkpoints inside a pipeline so deals advance only when real work is done — not when someone wants a prettier board.",
    overview:
      "Custom pipeline stages is the CRM feature for defining, renaming, reordering, and governing the steps within a pipeline. It answers “what must be true before this deal moves?” rather than “how many separate pipelines do we need?” Multiple pipelines create separate processes; custom stages shape the process inside one of them. Without honest stages, forecasts and coaching become storytelling.",
    whoThisIsFor:
      "Sales managers, founders building their first shared board, and ops leads whose default vendor stages (Lead → Qualified → Proposal → Closed) do not match how the team actually sells — including field sales with site visits, agencies with pitch gates, or B2B teams with security review.",
    whatMattersIntro:
      "Evaluate stage editability, entry criteria or required fields, probability defaults, won/lost reasons, and whether stage changes can trigger automation — not how many stages a template ships with. Fewer honest stages beat a long decorative funnel.",
    challenges: [
      {
        id: "default-mismatch",
        title: "Default stages do not match reality",
        pain: "Reps park deals in the nearest-looking stage, so the board lies about progress.",
        crmHelps:
          "Editable stage lists let you encode real checkpoints your team can explain in one sentence.",
      },
      {
        id: "wishful-advancement",
        title: "Deals advance without the work",
        pain: "Opportunities jump to Proposal before discovery or stakeholder map exists.",
        crmHelps:
          "Required fields or entry criteria on stage change make advancement reflect completed work.",
      },
      {
        id: "review-theater",
        title: "Pipeline meetings reconstruct meaning",
        pain: "Managers spend the meeting asking what “Negotiation” actually means this week.",
        crmHelps:
          "Shared stage definitions turn reviews into coaching on blockers, not vocabulary debates.",
      },
      {
        id: "forecast-fiction",
        title: "Stage probabilities become fiction",
        pain: "Weighted forecasts inherit decorative stages nobody treats as real.",
        crmHelps:
          "Stages tied to checkpoints make probability and commit conversations more grounded.",
      },
    ],
    outcomes: [
      {
        id: "shared-language",
        title: "A shared stage language",
        description:
          "Everyone means the same thing when a deal sits in a given stage.",
      },
      {
        id: "honest-board",
        title: "A board you can coach from",
        description:
          "Stuck deals and missing work show up as stage problems, not Slack archaeology.",
      },
      {
        id: "better-hygiene",
        title: "Better stage hygiene",
        description:
          "Entry criteria reduce wishful advancement before automation or forecasting depends on it.",
      },
      {
        id: "cleaner-reporting",
        title: "Cleaner conversion reporting",
        description:
          "Stage-to-stage conversion reflects real process steps instead of decorative labels.",
      },
    ],
    workflowSteps: [
      {
        id: "document",
        label: "Document checkpoints",
        detail:
          "Write the exit criteria for each real decision point before touching the CRM.",
      },
      {
        id: "configure",
        label: "Configure stages",
        detail:
          "Add, rename, reorder, or remove stages so the list matches that document.",
      },
      {
        id: "govern",
        label: "Govern advancement",
        detail:
          "Add required fields or rules so deals cannot skip unfinished work.",
      },
      {
        id: "coach",
        label: "Coach from the board",
        detail:
          "Run weekly reviews against stuck stages and missing next steps.",
      },
      {
        id: "revise",
        label: "Revise",
        detail:
          "Retire unused stages when the process changes — keep the list short.",
      },
    ],
    workedExamples: [
      {
        id: "field-sales-site-visit",
        title: "Field sales: site visit as a real stage",
        situation:
          "A 12-rep industrial field team uses a generic SaaS-style funnel. Site visits and sample installs are buried in notes, so managers cannot see which deals are waiting on a visit.",
        whatGoodLooksLike:
          "Stages include Qualified → Site Scheduled → Site Complete → Proposal → Verbal → Closed. Moving to Proposal requires a completed site-visit date field. Monday reviews filter “Site Scheduled older than 14 days.”",
        whatToAskVendors:
          "Can we add and reorder stages freely? Can stage changes require fields? Can automation create a visit task when entering Site Scheduled?",
      },
      {
        id: "agency-pitch-gates",
        title: "Agency: pitch committee gates",
        situation:
          "A 25-person agency’s new-business board has seven vague stages. Pitches enter “Proposal” before creative and pricing sign-off, and win rates look random.",
        whatGoodLooksLike:
          "Four stages with written criteria: Brief Accepted → Internal Ready → Client Pitch → Won/Lost. “Internal Ready” requires pricing owner and creative lead fields. Lost reasons are structured for monthly review.",
        whatToAskVendors:
          "Can we collapse stages without losing history? Are won/lost reasons configurable? Can probability defaults differ by stage?",
      },
    ],
    faq: [
      {
        question: "What are custom pipeline stages in a CRM?",
        answer:
          "They are the configurable checkpoints inside a pipeline — the ordered steps an opportunity moves through, ideally with clear entry or exit criteria.",
      },
      {
        question:
          "How is this different from multiple pipelines?",
        answer:
          "Custom stages shape one process. Multiple pipelines are for running more than one process with different stage models. You often need both: stages that fit, and separate pipelines when motions diverge.",
      },
      {
        question: "How many stages should we have?",
        answer:
          "Enough to reflect real decision points, and no more. If the team cannot explain a stage in one sentence, it usually should not exist.",
      },
    ],
    heroVisual: {
      src: "/features/custom-pipeline-stages-hero.png",
      alt: "Educational diagram of custom CRM pipeline stages with labeled checkpoints and entry criteria between stages.",
      caption:
        "Custom stages encode real process checkpoints inside a single pipeline.",
    },
    needsVisual: {
      src: "/features/custom-pipeline-stages-needs.png",
      alt: "Diagram mapping default-stage mismatch, wishful advancement, and forecast fiction to custom stage fixes.",
      caption:
        "What breaks when stage labels do not match how the team sells.",
    },
    workflowVisual: {
      src: "/features/custom-pipeline-stages-workflow.png",
      alt: "Five-step custom stages workflow: document checkpoints, configure stages, govern advancement, coach, revise.",
      caption:
        "How teams design and maintain honest CRM pipeline stages.",
    },
  },

  "email-sync": {
    displayTitle: "CRM Email Sync feature",
    tagline:
      "Attach sent and received email to the right contact and deal automatically — so relationship history does not live in one person’s inbox.",
    overview:
      "Email sync is the CRM feature that connects mailboxes (and often calendars) so correspondence and meetings land on contact, account, and deal timelines without manual logging. It is the backbone of shared relationship history, distinct from marketing email blasts and from outbound email sequences. Teams evaluate sync on mailbox coverage, matching accuracy, privacy controls, and whether sync is two-way or logging-only.",
    whoThisIsFor:
      "Any multi-person sales, account, or advisory team where covering for a colleague, onboarding a new hire, or answering “what did we last promise?” still requires forwarding threads. Especially painful for agencies, RIAs, and B2B SaaS once more than one person touches the same account.",
    whatMattersIntro:
      "Evaluate which mail providers sync, how messages match to records, BCC/shared-inbox behavior, private vs shared controls, and calendar capture — not whether “email” appears on a feature list. Sync that nobody trusts gets turned off.",
    challenges: [
      {
        id: "inbox-silos",
        title: "History lives in personal inboxes",
        pain: "Covering AMs and new hires ask clients to repeat context because the thread never left a private mailbox.",
        crmHelps:
          "Synced email attaches to the shared CRM record so history survives handoffs.",
      },
      {
        id: "manual-logging",
        title: "Manual email logging fails under load",
        pain: "Reps promise to “log it later,” then the record stays empty when managers need it.",
        crmHelps:
          "Automatic capture removes the logging step for day-to-day correspondence.",
      },
      {
        id: "mismatch",
        title: "Messages attach to the wrong record",
        pain: "Bad matching creates clutter or privacy scares, and teams disable sync.",
        crmHelps:
          "Clear matching rules, manual overrides, and privacy settings keep sync trustworthy.",
      },
      {
        id: "calendar-blind",
        title: "Meetings never appear on the timeline",
        pain: "Deal records show emails but not the discovery calls that actually moved the deal.",
        crmHelps:
          "Calendar sync puts meetings alongside email on the same timeline where supported.",
      },
    ],
    outcomes: [
      {
        id: "shared-timeline",
        title: "A shared interaction timeline",
        description:
          "Anyone with access sees recent correspondence without digging through personal mail.",
      },
      {
        id: "handoff-ready",
        title: "Handoffs without archaeology",
        description:
          "Coverage and role changes inherit context already on the record.",
      },
      {
        id: "less-admin",
        title: "Less logging admin",
        description:
          "Reps spend time on conversations, not copy-pasting emails into notes.",
      },
      {
        id: "manager-visibility",
        title: "Manager-visible activity",
        description:
          "Coaching and deal reviews start from real touches, not reconstructed memory.",
      },
    ],
    workflowSteps: [
      {
        id: "connect",
        label: "Connect mailboxes",
        detail:
          "Users authorize Google, Microsoft, or other supported providers under the right privacy policy.",
      },
      {
        id: "match",
        label: "Match",
        detail:
          "Incoming and outgoing messages associate to contacts and open deals by address and rules.",
      },
      {
        id: "review",
        label: "Review",
        detail:
          "Users confirm private threads stay private and fix mis-matches early.",
      },
      {
        id: "use",
        label: "Use on records",
        detail:
          "Timelines inform calls, handoffs, and pipeline reviews.",
      },
      {
        id: "govern",
        label: "Govern",
        detail:
          "Admins set retention, shared-inbox rules, and who can see synced content.",
      },
    ],
    workedExamples: [
      {
        id: "agency-am-coverage",
        title: "Agency: account manager coverage",
        situation:
          "A 10-person agency’s senior AM goes on leave. Client history is in her Gmail; the covering AM spends two days asking clients “remind me where we left off.”",
        whatGoodLooksLike:
          "Gmail sync attaches threads to client accounts automatically. The covering AM opens the account timeline, sees last week’s scope email, and joins the call prepared. Private HR threads stay excluded via privacy rules.",
        whatToAskVendors:
          "Does Google Workspace sync include past mail or only new mail? Can users mark threads private? How are shared inboxes handled?",
      },
      {
        id: "saas-ae-handoff",
        title: "B2B SaaS: AE to CSM handoff",
        situation:
          "A SaaS AE closes a deal and dumps a Slack summary to CS. Implementation discovers missing stakeholder emails that lived only in the AE’s inbox.",
        whatGoodLooksLike:
          "Synced mail on the opportunity and account shows procurement and champion threads. CSM starts from the record, not a recap. Calendar sync shows the kickoff already booked.",
        whatToAskVendors:
          "Do emails attach to deals as well as contacts? Is calendar sync included? What happens to sync when a user is deactivated?",
      },
    ],
    faq: [
      {
        question: "What is email sync in a CRM?",
        answer:
          "It connects user mailboxes so sent and received messages (and often meetings) appear on CRM contact, account, and deal timelines without manual logging.",
      },
      {
        question: "Is email sync the same as email sequences?",
        answer:
          "No. Sync captures real correspondence onto records. Sequences schedule outbound follow-up steps to a person. Most sales teams eventually need both.",
      },
      {
        question: "Will every email appear in the CRM?",
        answer:
          "It depends on provider support, matching rules, and privacy settings. Treat sync design as a trust exercise — mis-matched or over-shared mail is why teams turn it off.",
      },
    ],
    heroVisual: {
      src: "/features/email-sync-hero.png",
      alt: "Educational diagram of CRM email sync connecting a mailbox to a shared contact and deal timeline.",
      caption:
        "Email sync turns private correspondence into shared CRM relationship history.",
    },
    needsVisual: {
      src: "/features/email-sync-needs.png",
      alt: "Diagram mapping inbox silos, failed manual logging, and mismatched threads to email sync fixes.",
      caption:
        "What breaks when relationship history never leaves personal inboxes.",
    },
    workflowVisual: {
      src: "/features/email-sync-workflow.png",
      alt: "Five-step email sync workflow: connect mailboxes, match, review privacy, use on records, govern.",
      caption:
        "How teams connect mail, keep sync trustworthy, and use it on records.",
    },
  },

  "lead-scoring": {
    displayTitle: "CRM Lead Scoring feature",
    tagline:
      "Rank inbound and prospect records by fit and engagement signals so the team works the right leads first — not whoever shouted last in Slack.",
    overview:
      "Lead scoring is the CRM feature that assigns points or ranks to leads based on firmographic fit, behavior, or both, so routing and outreach prioritize higher-intent records. It is a triage aid inside lead management, not a substitute for ownership and response SLAs, and not the same as pipeline forecasting. Scoring only helps when the team trusts the model enough to change who they call first.",
    whoThisIsFor:
      "Inbound-heavy B2B teams, marketing-and-sales pods, and SDR orgs where volume exceeds manual “who looks good?” triage — typically once form fills or list uploads outpace same-day human review.",
    whatMattersIntro:
      "Evaluate which signals you can score on, whether scores are inspectable and editable, how scores feed routing or views, and whether marketing automation scores can sync — not whether an “AI score” badge appears. A simple trusted score beats a opaque model nobody uses.",
    challenges: [
      {
        id: "volume-triage",
        title: "Volume overwhelms manual triage",
        pain: "SDRs cherry-pick easy names while stronger-fit leads age in the queue.",
        crmHelps:
          "Scores and sorted queues make priority visible without relying on gut feel alone.",
      },
      {
        id: "vanity-mql",
        title: "MQL labels without shared meaning",
        pain: "Marketing marks MQLs; sales ignores them because the definition is opaque.",
        crmHelps:
          "Transparent score components and thresholds create a definition both teams can debate and improve.",
      },
      {
        id: "stale-scores",
        title: "Scores go stale",
        pain: "A lead looked hot last month; today the model still ranks them first.",
        crmHelps:
          "Recalculation on new activity and decay rules keep priority closer to current reality.",
      },
      {
        id: "score-theater",
        title: "Scores nobody acts on",
        pain: "A field exists, but routing and daily work ignore it.",
        crmHelps:
          "Wiring scores into views, assignment, or SLAs makes the model operational, not decorative.",
      },
    ],
    outcomes: [
      {
        id: "priority-queue",
        title: "A priority queue the team uses",
        description:
          "SDRs start from highest-fit or highest-engagement leads instead of random order.",
      },
      {
        id: "shared-definition",
        title: "A shared MQL / PQL definition",
        description:
          "Sales and marketing argue about thresholds with visible components, not vibes.",
      },
      {
        id: "better-routing",
        title: "Smarter routing inputs",
        description:
          "Assignment rules can prefer high-score leads for senior reps or fast lanes.",
      },
      {
        id: "inspectable-model",
        title: "An inspectable model",
        description:
          "Ops can explain why a lead scored high and adjust rules when the market shifts.",
      },
    ],
    workflowSteps: [
      {
        id: "define",
        label: "Define signals",
        detail:
          "List fit attributes and engagement events that actually predict good conversations.",
      },
      {
        id: "configure",
        label: "Configure scoring",
        detail:
          "Assign weights, thresholds, and decay in the CRM or connected marketing tool.",
      },
      {
        id: "route",
        label: "Route & view",
        detail:
          "Sort queues, trigger assignment, or flag MQLs from score thresholds.",
      },
      {
        id: "act",
        label: "Act",
        detail:
          "SDRs work the prioritized queue with response SLAs still enforced.",
      },
      {
        id: "tune",
        label: "Tune",
        detail:
          "Compare score vs conversion monthly; adjust weights when the model drifts.",
      },
    ],
    workedExamples: [
      {
        id: "saas-inbound-sdr",
        title: "B2B SaaS: SDR queue after product-led signup surge",
        situation:
          "A 6-SDR SaaS team gets mixed website demos and free-tier signups. Without scoring, SDRs call whoever is newest; enterprise-fit demos wait behind student signups.",
        whatGoodLooksLike:
          "Fit score from company size and industry plus engagement points for pricing-page views. Queue sorted by score; score ≥ threshold auto-assigns to senior SDRs. Weekly review compares score bands to meeting rates.",
        whatToAskVendors:
          "Can we score on custom fields and web events? Are score rules editable without engineering? Can scores drive assignment or only sorting?",
      },
      {
        id: "agency-inbound-forms",
        title: "Agency: inbound briefing forms",
        situation:
          "A mid-size agency’s BD lead triages 20–30 brief forms per week in a spreadsheet, prioritizing friendly brands over budget-ready ones.",
        whatGoodLooksLike:
          "CRM score weights budget range, timeline, and service fit fields from the form. High-score briefs create same-day call tasks; low-score briefs enter a nurture view. BD and delivery agree on the threshold in writing.",
        whatToAskVendors:
          "Can form fields map into score rules? Can low-score leads stay out of the sales pipeline until they qualify? How do we export score history for tuning?",
      },
    ],
    faq: [
      {
        question: "What is lead scoring in a CRM?",
        answer:
          "It is ranking or points on lead records based on fit and/or engagement so teams can prioritize outreach and routing.",
      },
      {
        question: "Do we need lead scoring on day one?",
        answer:
          "Usually not. Get capture, ownership, and response discipline working first. Add scoring when volume makes manual triage unreliable.",
      },
      {
        question: "Is CRM lead scoring the same as AI lead ranking?",
        answer:
          "Not necessarily. Some products use rule-based points; others add model-based ranks. Prefer inspectable logic your ops team can explain and change.",
      },
    ],
    heroVisual: {
      src: "/features/lead-scoring-hero.png",
      alt: "Educational diagram of CRM lead scoring showing fit and engagement signals combining into a prioritized lead queue.",
      caption:
        "Lead scoring turns fit and engagement signals into an operational priority queue.",
    },
    needsVisual: {
      src: "/features/lead-scoring-needs.png",
      alt: "Diagram mapping volume triage failures, opaque MQLs, and unused scores to lead scoring fixes.",
      caption:
        "What breaks when priority is decided by gut feel under inbound volume.",
    },
    workflowVisual: {
      src: "/features/lead-scoring-workflow.png",
      alt: "Five-step lead scoring workflow: define signals, configure scoring, route and view, act, tune.",
      caption:
        "How teams build, use, and retune a lead score people actually trust.",
    },
  },

  "custom-fields": {
    displayTitle: "CRM Custom Fields feature",
    tagline:
      "Add the attributes your process actually depends on — AUM band, contract type, territory — without waiting on a developer for every column.",
    overview:
      "Custom fields is the CRM feature that extends contact, company, deal, and other records with attributes beyond the vendor’s defaults. It is the practical half of customization: you capture what qualification, routing, reporting, and compliance require. It is not the same as custom objects (new record types), and field count alone is not capability — unused fields create noise and bad data.",
    whoThisIsFor:
      "Ops admins, sales managers, and regulated or specialized teams whose standard CRM fields miss must-have attributes — RIAs tracking AUM and risk, agencies tracking retainers vs projects, B2B teams tracking security review status or ICP segments.",
    whatMattersIntro:
      "Evaluate field types, where fields can appear (layouts, filters, reports, automation), permissions, and governance — not how many custom fields the plan allows on paper. Prefer a short governed set tied to real decisions.",
    challenges: [
      {
        id: "missing-attributes",
        title: "Standard fields miss what you segment on",
        pain: "ICP tier, contract type, or compliance flags live in spreadsheets beside the CRM.",
        crmHelps:
          "Custom fields put those attributes on the record where filters, reports, and automation can use them.",
      },
      {
        id: "field-sprawl",
        title: "Field sprawl nobody maintains",
        pain: "Every request adds a column; layouts become unusable and data quality collapses.",
        crmHelps:
          "Admin-owned field governance, required- sparingly, and layouts per role keep the model lean.",
      },
      {
        id: "report-gaps",
        title: "Reports cannot slice on real dimensions",
        pain: "Managers want win rate by segment, but the segment only exists in a note.",
        crmHelps:
          "Reportable custom fields make operational questions answerable in the CRM.",
      },
      {
        id: "automation-blind",
        title: "Automation cannot see your process data",
        pain: "Rules need “if enterprise and security incomplete…” but those facts are not fields.",
        crmHelps:
          "Custom fields become conditions and update targets for workflow automation.",
      },
    ],
    outcomes: [
      {
        id: "process-fit",
        title: "Records that match your process",
        description:
          "Qualification and handoffs use fields your team already decides on.",
      },
      {
        id: "filterable-lists",
        title: "Filterable, segmentable lists",
        description:
          "Views and outreach target real attributes instead of free-text notes.",
      },
      {
        id: "reportable-dimensions",
        title: "Reportable dimensions",
        description:
          "Dashboards can group by the same fields people fill in day to day.",
      },
      {
        id: "automation-ready",
        title: "Automation-ready data",
        description:
          "Rules can branch on structured values instead of parsing notes.",
      },
    ],
    workflowSteps: [
      {
        id: "inventory",
        label: "Inventory decisions",
        detail:
          "List attributes used in routing, qualification, compliance, or reporting.",
      },
      {
        id: "design",
        label: "Design fields",
        detail:
          "Choose types (picklist, number, date) and owners; reject vanity columns.",
      },
      {
        id: "place",
        label: "Place on layouts",
        detail:
          "Show fields where work happens; hide the rest by role when possible.",
      },
      {
        id: "enforce",
        label: "Enforce lightly",
        detail:
          "Require only fields that block real advancement; train on the rest.",
      },
      {
        id: "govern",
        label: "Govern",
        detail:
          "Review unused fields quarterly; archive rather than accumulate.",
      },
    ],
    workedExamples: [
      {
        id: "ria-aum-fields",
        title: "RIA: AUM and client type on household records",
        situation:
          "A 15-advisor RIA tracks AUM and client type in a spreadsheet because CRM contacts only have name and email. Segment reviews and suitability checks are manual.",
        whatGoodLooksLike:
          "Custom fields for AUM band, client type, and last review date on the household/account. Pipeline views and reports filter by AUM band; a workflow nudges when last review date is older than policy.",
        whatToAskVendors:
          "Which field types are available? Are custom fields usable in reports and automation? Can field visibility differ by role for sensitive attributes?",
      },
      {
        id: "saas-icp-segment",
        title: "B2B SaaS: ICP segment on every opportunity",
        situation:
          "A 9-person SaaS sales team argues about win rates by segment, but segment only appears in Slack. Ops cannot build a trustworthy dashboard.",
        whatGoodLooksLike:
          "A required picklist ICP Segment on create (Enterprise / Mid-market / SMB). Dashboards and forecasts group by that field. Expansion deals use a separate Renewal Type field on the expansion pipeline.",
        whatToAskVendors:
          "Can fields be required on create or on stage change? Can different pipelines show different fields? Are there plan caps on custom fields?",
      },
    ],
    faq: [
      {
        question: "What are custom fields in a CRM?",
        answer:
          "They are admin-defined attributes added to standard records (contacts, companies, deals, and others) so the data model matches your process.",
      },
      {
        question: "How are custom fields different from custom objects?",
        answer:
          "Fields add columns to existing record types. Custom objects create new record types when contacts, companies, and deals are not enough.",
      },
      {
        question: "How many custom fields do we need?",
        answer:
          "Only as many as your process, routing, compliance, or reporting genuinely require. Field count is not a quality metric.",
      },
    ],
    heroVisual: {
      src: "/features/custom-fields-hero.png",
      alt: "Educational diagram of CRM custom fields extending a contact and deal record with process-specific attributes.",
      caption:
        "Custom fields extend CRM records with the attributes your process actually uses.",
    },
    needsVisual: {
      src: "/features/custom-fields-needs.png",
      alt: "Diagram mapping spreadsheet side data, field sprawl, and report gaps to custom field fixes.",
      caption:
        "What breaks when must-have attributes never make it onto the CRM record.",
    },
    workflowVisual: {
      src: "/features/custom-fields-workflow.png",
      alt: "Five-step custom fields workflow: inventory decisions, design fields, place on layouts, enforce lightly, govern.",
      caption:
        "How teams add custom fields without creating unmaintainable sprawl.",
    },
  },

  forecasting: {
    displayTitle: "CRM Forecasting feature",
    tagline:
      "Project expected revenue from pipeline data with commits, categories, or stage weights — after stage hygiene is real enough to trust.",
    overview:
      "Forecasting is the CRM feature that projects future closed revenue from open pipeline, using stage probabilities, forecast categories (commit / best case / pipeline), manager overrides, or a mix. It is forward-looking and distinct from reporting dashboards, which describe what has happened or is happening now. Forecast quality inherits deal hygiene: close dates, amounts, and honest stages.",
    whoThisIsFor:
      "Sales leaders, finance partners, and AE managers who need a shared weekly or monthly revenue outlook — typically once a team is large enough that verbal “we’ll be fine” updates are no longer enough for planning.",
    whatMattersIntro:
      "Evaluate forecast categories, roll-ups by team/territory, override auditability, and dependence on stage data — not flashy prediction charts. If close dates and amounts are fiction, no forecast feature will save the number.",
    challenges: [
      {
        id: "spreadsheet-forecast",
        title: "Forecast lives in a side spreadsheet",
        pain: "Managers rebuild the quarter every Friday from Slack updates that disagree with the CRM.",
        crmHelps:
          "Native forecast views roll up the same opportunities the team already works.",
      },
      {
        id: "sandbag-upside",
        title: "Sandbagging and upside theater",
        pain: "Commits are political; best case is wishful; nobody can see what changed week to week.",
        crmHelps:
          "Categories, history, and manager overrides make judgment calls visible and discussable.",
      },
      {
        id: "hygiene-debt",
        title: "Pipeline hygiene undermines the number",
        pain: "Stale close dates and zombie deals inflate weighted forecasts.",
        crmHelps:
          "Forecast views surface stale deals; process discipline still has to fix the inputs.",
      },
      {
        id: "rollup-blind",
        title: "Leaders cannot roll up by team",
        pain: "Each manager has a personal method; the VP cannot see one coherent tree.",
        crmHelps:
          "Hierarchy roll-ups produce one forecast conversation across teams where supported.",
      },
    ],
    outcomes: [
      {
        id: "shared-outlook",
        title: "One shared revenue outlook",
        description:
          "Leadership debates the same opportunity set the reps work in the CRM.",
      },
      {
        id: "visible-judgment",
        title: "Visible judgment calls",
        description:
          "Commits and overrides are explicit instead of buried in private sheets.",
      },
      {
        id: "earlier-risk",
        title: "Earlier risk signals",
        description:
          "Gaps to target show up mid-period while there is still time to act.",
      },
      {
        id: "cleaner-inputs",
        title: "Pressure for cleaner inputs",
        description:
          "Forecast meetings force honesty on close dates, amounts, and stages.",
      },
    ],
    workflowSteps: [
      {
        id: "hygiene",
        label: "Fix hygiene",
        detail:
          "Clean close dates, amounts, owners, and stages before trusting any forecast view.",
      },
      {
        id: "categorize",
        label: "Categorize",
        detail:
          "Reps or managers set commit / best case / pipeline (or use stage weights).",
      },
      {
        id: "roll-up",
        label: "Roll up",
        detail:
          "Managers review team forecasts and apply documented overrides if needed.",
      },
      {
        id: "inspect",
        label: "Inspect gaps",
        detail:
          "Compare outlook to target; drill into risky deals and missing coverage.",
      },
      {
        id: "update",
        label: "Update weekly",
        detail:
          "Refresh categories and deal facts on a fixed cadence — not only at month-end.",
      },
    ],
    workedExamples: [
      {
        id: "saas-vp-sales",
        title: "B2B SaaS: VP Sales weekly forecast",
        situation:
          "A VP of a 3-pod SaaS sales org collects three manager spreadsheets every Thursday. Numbers disagree with CRM pipeline by hundreds of thousands.",
        whatGoodLooksLike:
          "Each AE sets forecast category on opportunities. Managers roll up in CRM; VP sees one tree vs quota. Weekly meeting starts from commit gap and deals that slipped close dates — not from rebuilding the sheet.",
        whatToAskVendors:
          "Do you support forecast categories and hierarchy roll-ups? Can managers override with an audit trail? How do stage probabilities interact with categories?",
      },
      {
        id: "field-sales-region",
        title: "Field sales: regional quarterly outlook",
        situation:
          "A regional director of 8 field reps forecasts from verbal updates because many deals wait on site visits that are not reflected in close dates.",
        whatGoodLooksLike:
          "Close dates and amounts stay current; a custom “Site Complete” stage gates late-stage categories. Forecast view filters by region. Director commits only deals past site-complete unless marked exception.",
        whatToAskVendors:
          "Can forecasts filter by territory or custom field? Can we prevent commit category before a stage? Is there period-over-period forecast history?",
      },
    ],
    faq: [
      {
        question: "What is forecasting in a CRM?",
        answer:
          "It is projecting future closed revenue from open pipeline using probabilities, forecast categories, manager judgment, or a combination.",
      },
      {
        question: "How is forecasting different from reporting dashboards?",
        answer:
          "Reporting describes current or historical activity and pipeline state. Forecasting projects a future outcome from that pipeline. You usually need both.",
      },
      {
        question: "Should we buy CRM for forecasting on day one?",
        answer:
          "Get honest pipeline stages, amounts, and close dates first. Forecasting features amplify whatever discipline — or fiction — already exists in the data.",
      },
    ],
    heroVisual: {
      src: "/features/forecasting-hero.png",
      alt: "Educational diagram of CRM forecasting rolling opportunities into commit, best case, and pipeline outlook vs target.",
      caption:
        "Forecasting projects future revenue from the same opportunities the team works daily.",
    },
    needsVisual: {
      src: "/features/forecasting-needs.png",
      alt: "Diagram mapping spreadsheet forecasts, sandbagging, and hygiene debt to CRM forecasting fixes.",
      caption:
        "What breaks when the revenue outlook lives outside the CRM pipeline.",
    },
    workflowVisual: {
      src: "/features/forecasting-workflow.png",
      alt: "Five-step forecasting workflow: fix hygiene, categorize, roll up, inspect gaps, update weekly.",
      caption:
        "How teams run a forecast cadence that stays tied to CRM deal facts.",
    },
  },

  "reporting-dashboards": {
    displayTitle: "CRM Reporting Dashboards feature",
    tagline:
      "See pipeline, activity, and conversion in shared dashboards and reports — so decisions start from the same numbers, not competing screenshots.",
    overview:
      "Reporting dashboards is the CRM feature for building charts, tables, and saved views that describe what has happened or is currently happening: pipeline by stage, activity by rep, conversion, win/loss, and SLA performance. It is descriptive analytics, not forecasting (which projects a future number). Teams use it for weekly ops reviews, coaching, and executive snapshots without exporting to a spreadsheet every time.",
    whoThisIsFor:
      "Sales managers, RevOps, founders, and team leads who currently rebuild the same charts in Sheets or BI for every meeting — and anyone who needs self-serve answers to “where are we stuck?” without filing an IT ticket.",
    whatMattersIntro:
      "Evaluate self-serve builders, filters, sharing, schedule/export, and whether reports use the same fields your team fills in — not how many dashboard templates ship in a gallery. A dashboard nobody opens is decoration.",
    challenges: [
      {
        id: "screenshot-ops",
        title: "Ops runs on screenshots and side sheets",
        pain: "Every Monday someone exports CSV and rebuilds charts that are already stale by Tuesday.",
        crmHelps:
          "Saved dashboards refresh from live CRM data and can be shared as the meeting’s single source.",
      },
      {
        id: "it-bottleneck",
        title: "Only specialists can build reports",
        pain: "Managers wait days for a simple win-rate-by-segment chart.",
        crmHelps:
          "Self-serve report builders let trained managers answer routine questions themselves.",
      },
      {
        id: "definition-drift",
        title: "Metric definitions drift",
        pain: "Two dashboards show different “open pipeline” because filters disagree.",
        crmHelps:
          "Shared, named reports with documented filters become the canonical definitions.",
      },
      {
        id: "activity-blind",
        title: "Coaching lacks activity visibility",
        pain: "Managers hear about effort in 1:1s instead of seeing calls, emails, and next steps on deals.",
        crmHelps:
          "Activity and pipeline dashboards make coaching evidence-based.",
      },
    ],
    outcomes: [
      {
        id: "shared-truth",
        title: "Shared operational truth",
        description:
          "Meetings open the same dashboard instead of debating whose export is right.",
      },
      {
        id: "faster-answers",
        title: "Faster routine answers",
        description:
          "Managers self-serve common cuts without waiting on a reporting specialist.",
      },
      {
        id: "stuck-visibility",
        title: "Stuck work becomes visible",
        description:
          "Stage aging, missing owners, and conversion drops show up early.",
      },
      {
        id: "coaching-fuel",
        title: "Fuel for coaching",
        description:
          "Activity and outcome reports turn 1:1s into specific conversations.",
      },
    ],
    workflowSteps: [
      {
        id: "questions",
        label: "List questions",
        detail:
          "Write the recurring questions Monday reviews must answer.",
      },
      {
        id: "build",
        label: "Build reports",
        detail:
          "Create charts/tables from CRM objects with explicit filters and owners.",
      },
      {
        id: "dashboard",
        label: "Assemble dashboards",
        detail:
          "Group reports for roles (AE, manager, leadership) without overcrowding.",
      },
      {
        id: "share",
        label: "Share",
        detail:
          "Pin dashboards in the meeting ritual; schedule email if the product supports it.",
      },
      {
        id: "maintain",
        label: "Maintain",
        detail:
          "Retire unused widgets; update filters when field definitions change.",
      },
    ],
    workedExamples: [
      {
        id: "saas-monday-ops",
        title: "B2B SaaS: Monday sales ops dashboard",
        situation:
          "A RevOps analyst at a 40-person SaaS company rebuilds pipeline-by-stage and activity-by-AE charts in Sheets every Sunday night for Monday’s meeting.",
        whatGoodLooksLike:
          "A CRM dashboard with pipeline by stage, deals with no next step, and activity last 7 days by AE. The meeting opens that URL. Forecast stays on a separate forecasting view so descriptive and predictive conversations do not blur.",
        whatToAskVendors:
          "Can managers build and share dashboards without admin rights? Can we filter by team hierarchy? Can reports include custom fields?",
      },
      {
        id: "agency-delivery-sales",
        title: "Agency: new-business conversion dashboard",
        situation:
          "An agency MD wants pitch win rate by service line, but the data is in a pitch tracker spreadsheet that diverges from CRM deals.",
        whatGoodLooksLike:
          "All pitches live as CRM opportunities with a Service Line custom field. A dashboard shows win rate and average cycle by service line. BD and delivery review it monthly to adjust pursuit criteria.",
        whatToAskVendors:
          "Can dashboards group by custom fields? Can we export or schedule the dashboard? Are historical snapshots retained or only live data?",
      },
    ],
    faq: [
      {
        question: "What are reporting dashboards in a CRM?",
        answer:
          "They are saved charts and tables built from CRM data to describe current or historical pipeline, activity, and outcomes in a shareable view.",
      },
      {
        question: "How are reporting dashboards different from forecasting?",
        answer:
          "Dashboards and reports describe what is or was. Forecasting projects what may close. Keep the two jobs separate in meetings even when both live in the CRM.",
      },
      {
        question: "Do we still need a BI tool?",
        answer:
          "Often not at first. BI becomes useful when you must join CRM data to finance, product, or long history the CRM does not retain well.",
      },
    ],
    heroVisual: {
      src: "/features/reporting-dashboards-hero.png",
      alt: "Educational diagram of CRM reporting dashboards showing pipeline, activity, and conversion widgets on a shared board.",
      caption:
        "Reporting dashboards make live CRM data the shared visual for operational reviews.",
    },
    needsVisual: {
      src: "/features/reporting-dashboards-needs.png",
      alt: "Diagram mapping screenshot ops, IT report bottlenecks, and metric drift to reporting dashboard fixes.",
      caption:
        "What breaks when every meeting starts from a fresh spreadsheet export.",
    },
    workflowVisual: {
      src: "/features/reporting-dashboards-workflow.png",
      alt: "Five-step reporting dashboards workflow: list questions, build reports, assemble dashboards, share, maintain.",
      caption:
        "How teams build CRM dashboards that stay useful after week one.",
    },
  },

  calling: {
    displayTitle: "CRM Calling feature",
    tagline:
      "Place and log calls from the CRM so conversations attach to the right records — without turning the CRM into a full contact center.",
    overview:
      "Calling is the CRM feature for click-to-call, call logging, notes, and often recordings or dispositions tied to contacts and deals. It supports sales and account conversations inside the CRM workflow. It is not a full contact-center suite (IVR, large queue routing, workforce management). Teams evaluate dialer depth, logging automation, local presence, and compliance controls separately from helpdesk telephony.",
    whoThisIsFor:
      "SDRs, AEs, and account managers who live on the phone and currently copy notes from a softphone into the CRM — or skip logging entirely. Common in B2B SaaS outbound, field-sales follow-up calls, and advisory scheduling touchpoints.",
    whatMattersIntro:
      "Evaluate one-click dial, automatic logging, dispositions, recording/consent options, and whether power dialing is included or bolted on — not whether “CTI” appears as a buzzword. If logging is still manual, adoption will fail.",
    challenges: [
      {
        id: "unlogged-calls",
        title: "Calls never make the timeline",
        pain: "Managers and covering reps cannot see who was called or what was said.",
        crmHelps:
          "Click-to-call with automatic logging attaches calls to the contact and deal.",
      },
      {
        id: "double-tools",
        title: "Reps juggle dialer and CRM",
        pain: "Context switches kill pace; notes get lost between systems.",
        crmHelps:
          "Calling inside the CRM keeps the record open while the conversation happens.",
      },
      {
        id: "disposition-chaos",
        title: "Outcomes are free-text chaos",
        pain: "“Left VM” means five different things; coaching and sequences cannot branch.",
        crmHelps:
          "Structured dispositions make next steps and reporting consistent.",
      },
      {
        id: "compliance-risk",
        title: "Recording and consent are unclear",
        pain: "Teams record ad hoc without knowing what the CRM supports by region.",
        crmHelps:
          "Clarify recording, consent prompts, and retention with the vendor before rollout.",
      },
    ],
    outcomes: [
      {
        id: "call-on-timeline",
        title: "Calls on the shared timeline",
        description:
          "Conversation history sits with email and meetings on the record.",
      },
      {
        id: "faster-dial",
        title: "Faster dial from context",
        description:
          "Reps call from the record they are already working, with notes ready.",
      },
      {
        id: "coachable-activity",
        title: "Coachable call activity",
        description:
          "Managers see volume, connect rates, and dispositions without spreadsheet exports.",
      },
      {
        id: "cleaner-followups",
        title: "Cleaner follow-ups",
        description:
          "Dispositions trigger tasks or sequence steps instead of relying on memory.",
      },
    ],
    workflowSteps: [
      {
        id: "enable",
        label: "Enable calling",
        detail:
          "Connect numbers or softphone; set recording/consent policy with legal/ops.",
      },
      {
        id: "dial",
        label: "Dial from record",
        detail:
          "Rep opens contact or deal and starts the call in-CRM.",
      },
      {
        id: "log",
        label: "Log & disposition",
        detail:
          "Call duration and outcome save automatically; rep adds a short note.",
      },
      {
        id: "next",
        label: "Next step",
        detail:
          "Create a task or enroll in a sequence based on disposition.",
      },
      {
        id: "review",
        label: "Review",
        detail:
          "Managers coach from call activity and recordings where permitted.",
      },
    ],
    workedExamples: [
      {
        id: "saas-sdr-dialer",
        title: "B2B SaaS: SDR click-to-call",
        situation:
          "Four SDRs use a separate dialer and paste notes into CRM when they remember. Connect rates look fine in the dialer; CRM activity reports look empty, so AEs distrust handoffs.",
        whatGoodLooksLike:
          "SDRs dial from the lead record; calls auto-log with dispositions (Connected, VM, Wrong number). Connected calls with interest create AE tasks. Managers review CRM activity, not a second tool’s CSV.",
        whatToAskVendors:
          "Is calling native or via integration? Do calls auto-log to leads and contacts? Are power dial / parallel dial features included or separate?",
      },
      {
        id: "field-sales-followup",
        title: "Field sales: post-visit follow-up calls",
        situation:
          "Field reps visit sites then call from mobile. Notes stay in the phone app; CRM deals lack call history when inside sales follows up.",
        whatGoodLooksLike:
          "Mobile CRM calling logs the follow-up against the opportunity. Disposition “Send proposal” creates a task for the inside partner. The deal timeline shows visit notes plus call outcomes.",
        whatToAskVendors:
          "Does the mobile app support calling and logging? Can calls associate to opportunities? How are local dialing and caller ID handled?",
      },
    ],
    faq: [
      {
        question: "What is CRM calling?",
        answer:
          "It is placing and logging phone calls from the CRM so conversations attach to contacts and deals — typically click-to-call, dispositions, notes, and sometimes recordings.",
      },
      {
        question: "Is CRM calling a full contact center?",
        answer:
          "No. Contact centers add heavy queue routing, IVR, and workforce tools. CRM calling supports sales and account conversations inside the CRM record workflow.",
      },
      {
        question: "Do we need a separate dialer?",
        answer:
          "It depends on volume and dialing mode. Light click-to-call may be enough; high-volume outbound often needs power-dial features — confirm whether they are native, add-on, or integrated.",
      },
    ],
    heroVisual: {
      src: "/features/calling-hero.png",
      alt: "Educational diagram of CRM calling showing click-to-call from a contact record with automatic call logging on the timeline.",
      caption:
        "CRM calling keeps conversations attached to the records reps already work.",
    },
    needsVisual: {
      src: "/features/calling-needs.png",
      alt: "Diagram mapping unlogged calls, dual-tool friction, and disposition chaos to CRM calling fixes.",
      caption:
        "What breaks when phone work happens outside the CRM timeline.",
    },
    workflowVisual: {
      src: "/features/calling-workflow.png",
      alt: "Five-step CRM calling workflow: enable calling, dial from record, log and disposition, next step, review.",
      caption:
        "How teams place, log, and coach from CRM-connected calls.",
    },
  },

  "email-sequences": {
    displayTitle: "CRM Email Sequences feature",
    tagline:
      "Run multi-step outbound follow-ups that pause on reply — so prospects get a consistent cadence without spreadsheet reminders.",
    overview:
      "Email sequences (also called cadences or drips in sales contexts) schedule a series of one-to-one emails to a person, with delays between steps and automatic stop on reply or meeting booked. They sit in sales engagement / CRM email, distinct from marketing automation list campaigns and from general workflow automation that updates records. Sequences help SDRs and AEs systematize follow-up after the first touch.",
    whoThisIsFor:
      "SDRs, AEs, and founder-led sellers who chase follow-ups in calendar reminders or spreadsheets — especially outbound or inbound nurture where a 3–7 step cadence is already informally agreed.",
    whatMattersIntro:
      "Evaluate personalization tokens, reply detection, throttling, A/B or step analytics, and mailbox sending limits — not how many sequence templates ship. A sequence that ignores replies damages trust faster than no sequence.",
    challenges: [
      {
        id: "forgotten-followups",
        title: "Follow-ups die in personal reminders",
        pain: "Day-3 and day-7 emails never send because the rep’s week fills up.",
        crmHelps:
          "Scheduled sequence steps send or queue tasks without relying on memory.",
      },
      {
        id: "inconsistent-cadence",
        title: "Every rep improvises the cadence",
        pain: "Managers cannot coach messaging or compare outcomes across the team.",
        crmHelps:
          "Shared sequence templates standardize steps while still allowing personalization.",
      },
      {
        id: "reply-blind",
        title: "Sequences keep emailing after a reply",
        pain: "Prospects get robotic follow-ups that ignore an active thread.",
        crmHelps:
          "Reply detection (and meeting booked rules) auto-stop the sequence.",
      },
      {
        id: "marketing-confusion",
        title: "Sales sequences confused with marketing blasts",
        pain: "Teams blast list campaigns from the CRM and burn domains or trust.",
        crmHelps:
          "Keep sequences one-to-one and leave list campaigns to marketing tools with proper consent.",
      },
    ],
    outcomes: [
      {
        id: "reliable-cadence",
        title: "Reliable multi-step cadence",
        description:
          "Agreed follow-ups actually leave the mailbox on schedule.",
      },
      {
        id: "shared-playbooks",
        title: "Shared outreach playbooks",
        description:
          "New hires start from proven sequences instead of blank drafts.",
      },
      {
        id: "reply-aware",
        title: "Reply-aware sending",
        description:
          "Active conversations stop getting automated nudges.",
      },
      {
        id: "coachable-steps",
        title: "Coachable step performance",
        description:
          "Teams see which steps get replies and revise copy from evidence.",
      },
    ],
    workflowSteps: [
      {
        id: "design",
        label: "Design cadence",
        detail:
          "Define steps, delays, and exit criteria (reply, meeting, bounce).",
      },
      {
        id: "personalize",
        label: "Personalize",
        detail:
          "Use tokens and mandatory first-line edits so mail does not feel bulk.",
      },
      {
        id: "enroll",
        label: "Enroll",
        detail:
          "Add qualified leads or contacts; respect suppression and ownership.",
      },
      {
        id: "monitor",
        label: "Monitor",
        detail:
          "Watch opens/replies as signals; intervene on hot replies manually.",
      },
      {
        id: "iterate",
        label: "Iterate",
        detail:
          "Update templates from step metrics; retire underperforming sequences.",
      },
    ],
    workedExamples: [
      {
        id: "saas-outbound-sdr",
        title: "B2B SaaS: outbound SDR cadence",
        situation:
          "Three SDRs each keep a personal Notion checklist for follow-ups. Prospects who reply still get the day-5 bump because nobody updated the checklist.",
        whatGoodLooksLike:
          "A 5-step sequence with reply auto-stop and a task on reply for personal response. Shared template owned by sales ops; SDRs personalize step one. Weekly review looks at reply rate by step, not vanity open rates alone.",
        whatToAskVendors:
          "Does reply detection auto-stop reliably across aliases? Are sends from the user’s mailbox? What are daily send limits and warmup guidance?",
      },
      {
        id: "agency-inbound-nurture",
        title: "Agency: inbound brief nurture",
        situation:
          "An agency BD lead manually follows up on lukewarm briefs twice, then forgets them. Hot briefs are fine; medium-fit ones go cold.",
        whatGoodLooksLike:
          "A short 3-step sequence for “nurture” briefs only, separate from active pitch opportunities. Enrollment is manual after triage. Reply or meeting booked exits to a human task — no marketing-style weekly newsletter from the CRM.",
        whatToAskVendors:
          "Can sequences be limited by lists or views? Can we mix email steps with call tasks? How do sequences interact with email sync threads?",
      },
    ],
    faq: [
      {
        question: "What are email sequences in a CRM?",
        answer:
          "They are scheduled multi-step one-to-one email follow-ups to a person, usually with delays between steps and automatic stop when the person replies.",
      },
      {
        question: "How are sequences different from workflow automation?",
        answer:
          "Sequences send outreach to people on a cadence. Workflow automation updates CRM records (tasks, fields, assignment) when conditions are met. Teams often use both.",
      },
      {
        question: "How are sequences different from marketing automation?",
        answer:
          "Sales sequences are individual, rep-owned follow-ups. Marketing automation runs list- and consent-based campaigns at scale — a different job and usually different compliance expectations.",
      },
    ],
    heroVisual: {
      src: "/features/email-sequences-hero.png",
      alt: "Educational diagram of a CRM email sequence with timed steps and automatic stop on reply.",
      caption:
        "Email sequences systematize one-to-one follow-up without ignoring active replies.",
    },
    needsVisual: {
      src: "/features/email-sequences-needs.png",
      alt: "Diagram mapping forgotten follow-ups, inconsistent cadences, and reply-blind sends to sequence fixes.",
      caption:
        "What breaks when follow-up lives only in personal reminders.",
    },
    workflowVisual: {
      src: "/features/email-sequences-workflow.png",
      alt: "Five-step email sequences workflow: design cadence, personalize, enroll, monitor, iterate.",
      caption:
        "How teams design and run CRM email sequences responsibly.",
    },
  },

  sso: {
    displayTitle: "CRM SSO feature",
    tagline:
      "Let people sign into the CRM with your identity provider — so access follows corporate joiners, movers, and leavers instead of shared passwords.",
    overview:
      "SSO (single sign-on) is the CRM feature that authenticates users via an identity provider such as Okta, Azure AD / Entra ID, or Google Workspace using SAML or OpenID Connect. It is an authentication control, distinct from role permissions (what users can do after login) and from audit logs (what they did). Buyers in regulated or IT-managed environments often treat SSO as a must-have on higher plans.",
    whoThisIsFor:
      "IT, security, and ops owners at companies that already standardize apps on an IdP — especially firms with frequent contractors, advisors, or employees who should lose CRM access the day they leave.",
    whatMattersIntro:
      "Evaluate protocol support (SAML/OIDC), IdP compatibility, just-in-time provisioning, enforced SSO vs optional, and plan gating — not whether “SSO” is merely listed. Confirm how break-glass admin access works if the IdP is down.",
    challenges: [
      {
        id: "password-sprawl",
        title: "Per-app passwords and shared logins",
        pain: "People reuse passwords or share a CRM seat; leavers still have access weeks later.",
        crmHelps:
          "SSO ties CRM login to the corporate identity lifecycle IT already manages.",
      },
      {
        id: "slow-offboarding",
        title: "Offboarding lags behind HR",
        pain: "Disable-user tickets sit in a queue while ex-employees retain CRM access.",
        crmHelps:
          "Disabling the IdP account revokes CRM sign-in when SSO is enforced.",
      },
      {
        id: "it-inconsistency",
        title: "CRM is the odd app out",
        pain: "Every other system is on Okta; CRM is a local password island.",
        crmHelps:
          "IdP integration brings CRM into the same access standard as the rest of the stack.",
      },
      {
        id: "plan-surprise",
        title: "SSO is gated after shortlisting",
        pain: "Security requires SSO; the affordable plan does not include it.",
        crmHelps:
          "Verify SSO plan requirements early — before demos lock emotional favorites.",
      },
    ],
    outcomes: [
      {
        id: "corporate-login",
        title: "Corporate login as the default",
        description:
          "Users sign in the same way they sign into other approved apps.",
      },
      {
        id: "faster-offboarding",
        title: "Faster access revocation",
        description:
          "Leaver access ends with IdP disablement when SSO is enforced.",
      },
      {
        id: "fewer-resets",
        title: "Fewer password-reset tickets",
        description:
          "IT supports one identity path instead of CRM-specific passwords.",
      },
      {
        id: "security-alignment",
        title: "Security policy alignment",
        description:
          "MFA and conditional access policies from the IdP apply to CRM sessions.",
      },
    ],
    workflowSteps: [
      {
        id: "confirm",
        label: "Confirm requirements",
        detail:
          "Security states required protocols, IdPs, and whether SSO must be enforced.",
      },
      {
        id: "plan-check",
        label: "Check plan gating",
        detail:
          "Verify which CRM edition includes SSO before shortlisting.",
      },
      {
        id: "configure",
        label: "Configure IdP",
        detail:
          "Set up SAML/OIDC app, claims, and test users in a sandbox.",
      },
      {
        id: "provision",
        label: "Provision",
        detail:
          "Map groups to CRM roles where supported; define JIT vs SCIM behavior.",
      },
      {
        id: "enforce",
        label: "Enforce & break-glass",
        detail:
          "Turn on enforced SSO with a documented emergency admin path.",
      },
    ],
    workedExamples: [
      {
        id: "ria-entra-sso",
        title: "RIA: Entra ID enforced SSO",
        situation:
          "A 40-person RIA’s IT requires Entra ID SSO for any system with client data. Two CRM finalists look fine in demos; only later does security learn SSO starts two tiers up.",
        whatGoodLooksLike:
          "SSO plan requirement is a must-have filter in CRM Finder and RFP. Pilot configures Entra SAML, maps advisor vs ops groups, and enforces SSO before go-live. Role permissions still define what advisors can see after login.",
        whatToAskVendors:
          "Which plans include SAML/OIDC SSO? Is SSO enforceable (not just optional)? Do you support SCIM provisioning? How does break-glass admin work?",
      },
      {
        id: "saas-contractor-access",
        title: "B2B SaaS: contractor offboarding",
        situation:
          "A SaaS company gives contractors CRM passwords. When contracts end, ops forgets to deactivate two seats; one ex-contractor still views pipeline.",
        whatGoodLooksLike:
          "Contractors authenticate via Okta time-bound groups. Contract end removes group membership; CRM login fails the same day. Audit logs still track what happened while they had access.",
        whatToAskVendors:
          "Can we require SSO for all non-admin users? How are session revocations handled? Can IdP groups map to CRM roles automatically?",
      },
    ],
    faq: [
      {
        question: "What is SSO in a CRM?",
        answer:
          "Single sign-on lets users authenticate to the CRM through your company’s identity provider instead of a CRM-only username and password.",
      },
      {
        question: "How is SSO different from role permissions?",
        answer:
          "SSO controls how users prove who they are at login. Role permissions control what they can see and do after they are authenticated.",
      },
      {
        question: "How is SSO different from audit logs?",
        answer:
          "SSO is about authentication. Audit logs record actions taken inside the CRM (views, edits, exports) for investigation and compliance.",
      },
    ],
    heroVisual: {
      src: "/features/sso-hero.png",
      alt: "Educational diagram of CRM SSO showing an identity provider authenticating a user into the CRM.",
      caption:
        "SSO connects CRM login to the identity provider your company already trusts.",
    },
    needsVisual: {
      src: "/features/sso-needs.png",
      alt: "Diagram mapping password sprawl, slow offboarding, and plan surprises to SSO fixes.",
      caption:
        "What breaks when CRM access sits outside corporate identity management.",
    },
    workflowVisual: {
      src: "/features/sso-workflow.png",
      alt: "Five-step SSO workflow: confirm requirements, check plan gating, configure IdP, provision, enforce with break-glass.",
      caption:
        "How IT rolls out CRM SSO without locking out administrators.",
    },
  },

  "audit-logs": {
    displayTitle: "CRM Audit Logs feature",
    tagline:
      "Record who viewed, changed, exported, or deleted CRM data — so investigations and compliance reviews have evidence, not guesswork.",
    overview:
      "Audit logs are the CRM feature that captures a trail of security-relevant and data-change events: logins, permission changes, record edits, exports, and deletions. They support investigations, customer commitments, and regulated industries. Audit logs are not the same as SSO (authentication) or role permissions (access rules); they answer “what happened?” after access was granted. Retention length and exportability matter as much as whether logging exists.",
    whoThisIsFor:
      "Security, compliance, IT, and ops leaders in firms that handle sensitive client data — RIAs, financial services, healthcare-adjacent sellers, and any team that must answer “who exported that list?” or “who changed this field?”",
    whatMattersIntro:
      "Evaluate event coverage (reads vs writes vs exports), retention period, search/export, immutability, and plan gating — not a vague “audit trail” checkbox. A log that only keeps seven days of edits may not meet your policy.",
    challenges: [
      {
        id: "who-changed",
        title: "Nobody can prove who changed a record",
        pain: "A deal amount or client attribute changes; the team argues from memory.",
        crmHelps:
          "Field-level or record-level change logs show actor, time, and before/after values where supported.",
      },
      {
        id: "silent-export",
        title: "Exports leave no trail",
        pain: "A CSV of contacts leaves the building with no record of who pulled it.",
        crmHelps:
          "Export and bulk-action events in the audit log support incident response.",
      },
      {
        id: "access-mystery",
        title: "Suspicious access is a mystery",
        pain: "A leaver or compromised account may have viewed records; there is no evidence trail.",
        crmHelps:
          "Login and, where available, view events narrow the blast-radius investigation.",
      },
      {
        id: "retention-gap",
        title: "Logs expire before reviews",
        pain: "Annual compliance asks for six months of history; the CRM kept two weeks.",
        crmHelps:
          "Confirm retention and export-to-SIEM options against your policy before buying.",
      },
    ],
    outcomes: [
      {
        id: "investigable-changes",
        title: "Investigable data changes",
        description:
          "Ops and security can answer who changed what, and when.",
      },
      {
        id: "export-accountability",
        title: "Export accountability",
        description:
          "Bulk extracts are attributable for incident and compliance reviews.",
      },
      {
        id: "policy-evidence",
        title: "Evidence for policy reviews",
        description:
          "Access and admin actions can be shown to auditors with less manual reconstruction.",
      },
      {
        id: "deterrence",
        title: "Deterrence through visibility",
        description:
          "Knowing sensitive actions are logged reduces casual misuse.",
      },
    ],
    workflowSteps: [
      {
        id: "map-events",
        label: "Map required events",
        detail:
          "List actions your policy must retain (edits, exports, logins, permission changes).",
      },
      {
        id: "verify-coverage",
        label: "Verify coverage",
        detail:
          "Confirm the CRM logs those events on the plan you will buy.",
      },
      {
        id: "retention",
        label: "Set retention",
        detail:
          "Align CRM retention or SIEM export with legal/compliance needs.",
      },
      {
        id: "access",
        label: "Control log access",
        detail:
          "Limit who can read audit logs; separate from day-to-day CRM roles.",
      },
      {
        id: "use",
        label: "Use in incidents",
        detail:
          "Practice searching logs for a sample investigation before go-live.",
      },
    ],
    workedExamples: [
      {
        id: "ria-field-change",
        title: "RIA: suitability field change investigation",
        situation:
          "A client complains a risk rating changed. The RIA’s CRM shows the new value; three advisors touched the household that week. Without logs, compliance cannot show who edited the field.",
        whatGoodLooksLike:
          "Audit history shows advisor B changed Risk Rating at a timestamp with old and new values. Compliance documents the finding. Role permissions still prevent junior staff from editing that field going forward.",
        whatToAskVendors:
          "Is field history available on standard and custom fields? How long is it retained? Can we export audit events for an external archive?",
      },
      {
        id: "saas-list-export",
        title: "B2B SaaS: unexpected contact export",
        situation:
          "Security learns a large contact export occurred after a contractor’s last week. The CRM has no export log; IT only sees that the user existed.",
        whatGoodLooksLike:
          "Audit log shows export event, user, time, and approximate volume. SSO had already revoked login; the log still closes the investigation. Future exports alert security where supported.",
        whatToAskVendors:
          "Are exports and bulk API pulls logged? Can logs stream to a SIEM? Which plans include full audit logging?",
      },
    ],
    faq: [
      {
        question: "What are audit logs in a CRM?",
        answer:
          "They are recorded events showing who did what in the CRM — such as logins, record changes, permission updates, and exports — for investigation and compliance.",
      },
      {
        question: "How are audit logs different from role permissions?",
        answer:
          "Permissions define what users are allowed to do. Audit logs record what they actually did (and sometimes what they viewed), for after-the-fact accountability.",
      },
      {
        question: "Do all CRMs keep audit logs long enough?",
        answer:
          "No. Retention and event depth vary widely and are often plan-gated. Match vendor retention to your policy — or export logs to a system you control.",
      },
    ],
    heroVisual: {
      src: "/features/audit-logs-hero.png",
      alt: "Educational diagram of CRM audit logs showing a chronological trail of user actions on records and exports.",
      caption:
        "Audit logs turn sensitive CRM activity into an investigable evidence trail.",
    },
    needsVisual: {
      src: "/features/audit-logs-needs.png",
      alt: "Diagram mapping unknown editors, silent exports, and retention gaps to audit log fixes.",
      caption:
        "What breaks when nobody can prove who touched client or pipeline data.",
    },
    workflowVisual: {
      src: "/features/audit-logs-workflow.png",
      alt: "Five-step audit logs workflow: map required events, verify coverage, set retention, control log access, use in incidents.",
      caption:
        "How security and ops make CRM audit logging meet real policy needs.",
    },
  },

  "role-permissions": {
    displayTitle: "CRM Role Permissions feature",
    tagline:
      "Control what each role can see and change — so SDRs, advisors, and executives get the access they need without opening every record to everyone.",
    overview:
      "Role permissions are the CRM feature for authorizing actions and data visibility after login: which objects, fields, records, and admin tools a role may use. They implement least privilege for sales, CS, leadership, and ops. Distinct from SSO (who can authenticate) and audit logs (what was done), permissions answer “what is this person allowed to do?” Record ownership, teams, and field-level security are part of the same evaluation.",
    whoThisIsFor:
      "Admins and security-minded leaders in any multi-role CRM — especially when contractors, junior SDRs, or cross-functional staff should not see full pipeline, compensation fields, or sensitive client attributes.",
    whatMattersIntro:
      "Evaluate object vs record vs field-level controls, team/territory models, admin separation, and how hard day-two changes are — not a binary “permissions: yes.” Overly coarse roles push people toward shared logins.",
    challenges: [
      {
        id: "everyone-sees-all",
        title: "Everyone sees everything",
        pain: "Junior staff and contractors browse deals and client details they do not need.",
        crmHelps:
          "Role and record rules limit visibility to owned, team, or permitted records.",
      },
      {
        id: "blocked-work",
        title: "Permissions block legitimate work",
        pain: "AEs cannot update fields CS needs, so work moves back to spreadsheets.",
        crmHelps:
          "Role design maps to real jobs; field-level access separates view vs edit carefully.",
      },
      {
        id: "admin-sprawl",
        title: "Too many full admins",
        pain: "Half the company can change automation and delete records.",
        crmHelps:
          "Separate system admin from sales roles; grant config rights sparingly.",
      },
      {
        id: "shared-logins",
        title: "Shared logins as a workaround",
        pain: "When roles are clumsy, teams share passwords and destroy accountability.",
        crmHelps:
          "Usable permission models plus SSO remove the excuse for shared seats.",
      },
    ],
    outcomes: [
      {
        id: "least-privilege",
        title: "Least-privilege access",
        description:
          "People see and edit what their job requires — not the whole database by default.",
      },
      {
        id: "safer-contractors",
        title: "Safer contractor and junior access",
        description:
          "Temporary or junior roles can work without full pipeline exposure.",
      },
      {
        id: "cleaner-admin",
        title: "Clearer admin boundaries",
        description:
          "Configuration rights stay with named owners instead of accidental superusers.",
      },
      {
        id: "audit-ready-access",
        title: "Access model auditors can understand",
        description:
          "Documented roles map to job functions for reviews and customer questionnaires.",
      },
    ],
    workflowSteps: [
      {
        id: "roles",
        label: "List roles",
        detail:
          "Name real jobs (SDR, AE, AM, advisor, ops, exec) and what each must do.",
      },
      {
        id: "matrix",
        label: "Build access matrix",
        detail:
          "For each object/field, decide view, edit, export, and delete rights.",
      },
      {
        id: "configure",
        label: "Configure roles",
        detail:
          "Implement roles, teams/territories, and field security in the CRM.",
      },
      {
        id: "test",
        label: "Test as users",
        detail:
          "Log in as each role with sample records before go-live.",
      },
      {
        id: "review",
        label: "Review",
        detail:
          "Revisit permissions when hiring a new role or after an incident.",
      },
    ],
    workedExamples: [
      {
        id: "saas-sdr-vs-ae",
        title: "B2B SaaS: SDR vs AE visibility",
        situation:
          "SDRs can see every late-stage enterprise deal, including discount fields. Leadership worries about leaks and noise; SDRs only need their leads and MQLs.",
        whatGoodLooksLike:
          "SDR role: create/edit leads, view own activities, no export of full contact list, no view of discount fields on opportunities. AE role: own and team opportunities. Exec role: read-only dashboards across teams. SSO still handles login; audit logs watch exports.",
        whatToAskVendors:
          "Do you support field-level security? Can visibility follow ownership and team hierarchy? Can export be denied per role?",
      },
      {
        id: "ria-advisor-isolation",
        title: "RIA: advisor book isolation",
        situation:
          "Advisors at a 25-person RIA can open each other’s households by default. Compliance wants book-level isolation with supervised exceptions for partners.",
        whatGoodLooksLike:
          "Record rules show advisors their households only; partners get team visibility; ops gets broader access for service. Sensitive suitability fields are edit-restricted. Quarterly access review uses the role matrix.",
        whatToAskVendors:
          "Can record access be owner- and team-based? Are there sharing rules for exceptions? How complex is maintaining rules as teams change?",
      },
    ],
    faq: [
      {
        question: "What are role permissions in a CRM?",
        answer:
          "They are the authorization settings that control what each user role can see and do — objects, fields, records, exports, and admin tools — after login.",
      },
      {
        question: "How are role permissions different from SSO?",
        answer:
          "SSO authenticates identity. Role permissions authorize actions and data access for that identity inside the CRM.",
      },
      {
        question: "How are role permissions different from audit logs?",
        answer:
          "Permissions set the rules. Audit logs record activity for investigation. You typically need both: prevent misuse and detect what still happened.",
      },
    ],
    heroVisual: {
      src: "/features/role-permissions-hero.png",
      alt: "Educational diagram of CRM role permissions showing different roles with different view and edit rights on records.",
      caption:
        "Role permissions apply least privilege to CRM data and actions after login.",
    },
    needsVisual: {
      src: "/features/role-permissions-needs.png",
      alt: "Diagram mapping open-book access, blocked work, admin sprawl, and shared logins to permission fixes.",
      caption:
        "What breaks when CRM access is all-or-nothing.",
    },
    workflowVisual: {
      src: "/features/role-permissions-workflow.png",
      alt: "Five-step role permissions workflow: list roles, build access matrix, configure, test as users, review.",
      caption:
        "How admins design CRM roles that match real jobs.",
    },
  },

  "api-access": {
    displayTitle: "CRM API Access feature",
    tagline:
      "Connect the CRM to your stack programmatically — sync data, build integrations, and automate across systems when native connectors are not enough.",
    overview:
      "API access is the CRM feature that exposes programmatic interfaces (REST, GraphQL, webhooks, or similar) so engineering or iPaaS tools can read and write CRM data. It underpins custom integrations, data warehouses, and product-led workflows. Native app-marketplace connectors are related but different: the API is what you use when a connector does not exist or is too shallow. Evaluate auth, rate limits, webhooks, and plan gating carefully.",
    whoThisIsFor:
      "Technical founders, RevOps with iPaaS, and engineering teams that must sync CRM with billing, product analytics, data warehouse, or internal tools — especially mid-market B2B SaaS and firms with bespoke advisor portals.",
    whatMattersIntro:
      "Evaluate authentication (OAuth/keys), objects covered, webhooks vs polling, rate limits, sandbox, and whether API access is plan-gated — not a marketing claim of “open platform.” A crippled API on your tier is a dead end mid-project.",
    challenges: [
      {
        id: "connector-gaps",
        title: "Native connectors do not cover your tools",
        pain: "Billing or product usage never reaches the CRM; reps work half-blind.",
        crmHelps:
          "API and webhooks let you build or buy the sync that marketplace apps miss.",
      },
      {
        id: "spreadsheet-bridge",
        title: "People bridge systems with CSV",
        pain: "Weekly exports/imports drift and create duplicate records.",
        crmHelps:
          "Scheduled API syncs replace fragile manual bridges.",
      },
      {
        id: "rate-limit-surprises",
        title: "Rate limits surprise production",
        pain: "A sync works in trial then throttles when the team scales.",
        crmHelps:
          "Documented limits and bulk endpoints inform architecture before go-live.",
      },
      {
        id: "plan-lock",
        title: "API locked to an enterprise plan",
        pain: "Integration design assumes API access that the affordable plan excludes.",
        crmHelps:
          "Confirm API entitlements and webhook support on the exact plan you will buy.",
      },
    ],
    outcomes: [
      {
        id: "system-of-record-sync",
        title: "CRM stays in sync with other systems",
        description:
          "Billing, product, and support data can update CRM records without CSV rituals.",
      },
      {
        id: "custom-workflows",
        title: "Custom cross-system workflows",
        description:
          "Events in one system can create tasks or opportunities in the CRM.",
      },
      {
        id: "warehouse-ready",
        title: "Warehouse- and BI-ready extracts",
        description:
          "Engineering can land CRM data alongside finance and product for deeper analysis.",
      },
      {
        id: "less-manual-ops",
        title: "Less manual RevOps glue",
        description:
          "Integrations absorb the busywork that formerly lived in spreadsheets.",
      },
    ],
    workflowSteps: [
      {
        id: "inventory",
        label: "Inventory integrations",
        detail:
          "List systems that must read/write CRM data and whether a native connector exists.",
      },
      {
        id: "entitlements",
        label: "Confirm entitlements",
        detail:
          "Verify API, webhook, and sandbox access on the target plan.",
      },
      {
        id: "design",
        label: "Design sync",
        detail:
          "Choose direction, conflict rules, identity keys, and error handling.",
      },
      {
        id: "build",
        label: "Build or configure",
        detail:
          "Implement via iPaaS or custom code; use webhooks where freshness matters.",
      },
      {
        id: "monitor",
        label: "Monitor",
        detail:
          "Alert on failures, auth expiry, and rate-limit responses.",
      },
    ],
    workedExamples: [
      {
        id: "saas-product-usage",
        title: "B2B SaaS: product usage on accounts",
        situation:
          "AEs ask CS for usage screenshots before renewal calls. Product data lives in the app database; CRM accounts have no usage fields.",
        whatGoodLooksLike:
          "Nightly job writes seats-active and last-seen to CRM account custom fields via API. Renewal views sort by usage risk. Webhooks create a task when usage drops sharply.",
        whatToAskVendors:
          "Can we update custom fields via API? Are webhooks available on our plan? What are daily rate limits and bulk APIs?",
      },
      {
        id: "ria-custodian-sync",
        title: "RIA: custodian and CRM household sync",
        situation:
          "Ops copies AUM from custodian reports into CRM weekly. Numbers disagree during reviews; advisors lose trust in the record.",
        whatGoodLooksLike:
          "Middleware syncs household identifiers and AUM into CRM fields on a schedule. Exceptions queue for human review. Role permissions keep raw custodian IDs off junior layouts; audit logs capture bulk updates.",
        whatToAskVendors:
          "Is there a sandbox for integration testing? How is API authentication rotated? Can bulk upserts be performed safely without duplicates?",
      },
    ],
    faq: [
      {
        question: "What is API access in a CRM?",
        answer:
          "It is programmatic access — typically REST or similar, often with webhooks — so other systems can read and write CRM data under authenticated credentials.",
      },
      {
        question: "How is API access different from native integrations?",
        answer:
          "Native integrations are prebuilt connectors you configure. The API is the platform interface you (or an iPaaS) use to build connections when a connector is missing or too shallow.",
      },
      {
        question: "Is API access usually plan-gated?",
        answer:
          "Often yes — or rate limits differ by plan. Confirm entitlements on the exact tier you will buy before committing to an integration design.",
      },
    ],
    heroVisual: {
      src: "/features/api-access-hero.png",
      alt: "Educational diagram of CRM API access connecting the CRM to billing, product, and data warehouse systems.",
      caption:
        "API access lets the CRM exchange data with the rest of your stack programmatically.",
    },
    needsVisual: {
      src: "/features/api-access-needs.png",
      alt: "Diagram mapping connector gaps, CSV bridges, and rate-limit surprises to API access fixes.",
      caption:
        "What breaks when CRM data cannot move reliably to and from other systems.",
    },
    workflowVisual: {
      src: "/features/api-access-workflow.png",
      alt: "Five-step API access workflow: inventory integrations, confirm entitlements, design sync, build, monitor.",
      caption:
        "How teams ship CRM integrations without discovering plan limits mid-build.",
    },
  },

  "mobile-app": {
    displayTitle: "CRM Mobile App feature",
    tagline:
      "Update deals, log notes, and check context from a phone — so field and on-the-go work does not wait until someone is back at a laptop.",
    overview:
      "A CRM mobile app is the smartphone (and often tablet) client for viewing and updating CRM records away from the desktop: contacts, deals, tasks, notes, and sometimes calling or email. It matters when work happens on-site, between meetings, or in transit. Mobile is not just a shrunk desktop; evaluate offline behavior, which actions are possible, and whether mobile is a true app or a mobile web bookmark.",
    whoThisIsFor:
      "Field sales, founders always between meetings, advisors visiting clients, and account managers who need to log outcomes before context fades — anyone who currently scribbles notes and “enters them later” (then does not).",
    whatMattersIntro:
      "Evaluate which objects are editable, offline/sync behavior, mobile calling/email, biometric login, and MDM friendliness — not App Store star counts. If critical updates require desktop, field adoption will stall.",
    challenges: [
      {
        id: "later-logging",
        title: "Notes wait until “later”",
        pain: "Site-visit details and call outcomes never reach the CRM while memory is fresh.",
        crmHelps:
          "Mobile note and activity logging captures context immediately after the conversation.",
      },
      {
        id: "context-gap",
        title: "No context before a meeting",
        pain: "Reps walk into client sites without last email or open tasks on their phone.",
        crmHelps:
          "Mobile record views surface timeline and next steps in the lobby or car park.",
      },
      {
        id: "offline-fail",
        title: "Dead zones kill updates",
        pain: "Warehouse or rural sites have no signal; desktop-only habits return.",
        crmHelps:
          "Offline-capable mobile clients queue edits and sync when connectivity returns.",
      },
      {
        id: "feature-thin",
        title: "Mobile is view-only theater",
        pain: "The app shows records but cannot create tasks or advance stages.",
        crmHelps:
          "Confirm create/edit coverage for the jobs field teams actually do.",
      },
    ],
    outcomes: [
      {
        id: "same-day-hygiene",
        title: "Same-day activity hygiene",
        description:
          "Notes and stage updates land while the visit or call is still fresh.",
      },
      {
        id: "prepared-visits",
        title: "Better-prepared visits",
        description:
          "Reps pull timeline and open tasks on the phone before walking in.",
      },
      {
        id: "field-inclusion",
        title: "Field roles included in CRM reality",
        description:
          "Pipeline data reflects field work, not only office-based updates.",
      },
      {
        id: "fewer-lost-notes",
        title: "Fewer lost notebook scribbles",
        description:
          "Structured mobile capture replaces paper that never gets typed in.",
      },
    ],
    workflowSteps: [
      {
        id: "jobs",
        label: "List mobile jobs",
        detail:
          "Write the three actions field people must complete on a phone.",
      },
      {
        id: "trial",
        label: "Trial on real devices",
        detail:
          "Test those actions on iOS/Android with offline and biometric login.",
      },
      {
        id: "enable",
        label: "Enable securely",
        detail:
          "Apply MDM, SSO, and device policies as required by IT.",
      },
      {
        id: "train",
        label: "Train briefly",
        detail:
          "Show logging and next-step habits that replace “enter it later.”",
      },
      {
        id: "reinforce",
        label: "Reinforce",
        detail:
          "Managers coach from mobile-sourced activity in weekly reviews.",
      },
    ],
    workedExamples: [
      {
        id: "field-sales-site",
        title: "Field sales: post-site update",
        situation:
          "A 10-rep field team finishes site visits and emails themselves notes. Half never get pasted into CRM; inside sales follows up blind.",
        whatGoodLooksLike:
          "Before leaving the site, the rep opens the opportunity on mobile, logs a note, updates stage to Site Complete, and creates a proposal task for the inside partner. Offline mode queues the update in the basement; it syncs in the parking lot.",
        whatToAskVendors:
          "Can we edit deals and create tasks offline? Does mobile support our SSO? Are calling and email available in the mobile app?",
      },
      {
        id: "advisor-client-visit",
        title: "RIA: advisor client meeting",
        situation:
          "Advisors review households on a laptop at the office but meet clients at homes or cafes. They cannot see last review notes on their phone without emailing themselves a PDF.",
        whatGoodLooksLike:
          "Mobile app shows household timeline, open tasks, and key custom fields. After the meeting, the advisor logs notes and sets next review date. Field-level permissions still hide internal compliance flags from the client-facing screen share.",
        whatToAskVendors:
          "Which custom fields and related lists appear on mobile? Can layouts differ for mobile? How does the app handle SSO and biometrics?",
      },
    ],
    faq: [
      {
        question: "What does a CRM mobile app cover?",
        answer:
          "Typically viewing and updating contacts, deals, tasks, and notes on a phone or tablet — sometimes with calling, email, or offline sync. Depth varies widely by product.",
      },
      {
        question: "Is mobile web enough?",
        answer:
          "Sometimes for light viewing. If you need offline use, push notifications, or polished data entry in the field, trial a native app on real devices before deciding.",
      },
      {
        question: "Do field teams need every desktop feature on mobile?",
        answer:
          "No. They need the few jobs that happen away from a desk — usually notes, stage updates, tasks, and record lookup. Confirm those specifically.",
      },
    ],
    heroVisual: {
      src: "/features/mobile-app-hero.png",
      alt: "Educational diagram of a CRM mobile app showing on-the-go record lookup, notes, and task updates syncing to the CRM.",
      caption:
        "Mobile CRM captures field work while context is fresh — not hours later at a laptop.",
    },
    needsVisual: {
      src: "/features/mobile-app-needs.png",
      alt: "Diagram mapping delayed logging, pre-meeting context gaps, and offline failures to mobile app fixes.",
      caption:
        "What breaks when CRM work only happens at a desk.",
    },
    workflowVisual: {
      src: "/features/mobile-app-workflow.png",
      alt: "Five-step mobile app workflow: list mobile jobs, trial on devices, enable securely, train, reinforce.",
      caption:
        "How teams roll out CRM mobile for real field jobs.",
    },
  },

  "ai-assistance": {
    displayTitle: "CRM AI Assistance feature",
    tagline:
      "Use AI to draft, summarize, and suggest next steps on CRM records — with human review — instead of treating the CRM as an autopilot.",
    overview:
      "AI assistance in CRM covers features that draft emails, summarize timelines, suggest next actions, extract fields from notes, or help qualify leads using models on top of CRM data. It is an accelerator for existing workflows, not a replacement for ownership, stage discipline, or accurate records. Evaluate groundedness (does it use your timeline?), review controls, data-use policies, and whether AI is plan-gated — without invented accuracy claims.",
    whoThisIsFor:
      "Busy AEs, SDRs, and advisors who spend too long writing recaps or scanning long timelines — and ops leaders who want assistance without letting unverified model output update records silently.",
    whatMattersIntro:
      "Evaluate which jobs AI helps (summarize, draft, extract, suggest), whether outputs cite CRM context, human-approval requirements, admin controls, and vendor data-retention policies — not demo wow. If underlying data is messy, AI will summarize the mess confidently.",
    challenges: [
      {
        id: "blank-page",
        title: "Reps stare at blank follow-up emails",
        pain: "Writing quality follow-ups after every call eats the afternoon.",
        crmHelps:
          "Draft assistance from the timeline gives a starting point the rep edits before send.",
      },
      {
        id: "long-timelines",
        title: "Long timelines are hard to scan",
        pain: "Covering AMs cannot quickly grasp six months of email and notes before a call.",
        crmHelps:
          "Summaries compress recent activity into a brief the human still verifies.",
      },
      {
        id: "silent-writes",
        title: "AI writes to records without review",
        pain: "Wrong extracted fields or stages pollute the system of record.",
        crmHelps:
          "Prefer suggest-and-approve flows; keep destructive automation behind confirmation.",
      },
      {
        id: "data-policy",
        title: "Unclear data use for training",
        pain: "Security blocks AI features because vendor policy is vague.",
        crmHelps:
          "Get written answers on training use, retention, and regional processing before enabling.",
      },
    ],
    outcomes: [
      {
        id: "faster-drafts",
        title: "Faster first drafts",
        description:
          "Reps edit AI drafts instead of composing every follow-up from scratch.",
      },
      {
        id: "quicker-briefings",
        title: "Quicker pre-call briefings",
        description:
          "Summaries help humans orient — then they spot-check the timeline.",
      },
      {
        id: "assisted-admin",
        title: "Assisted admin, not silent admin",
        description:
          "Field suggestions and task ideas reduce typing while keeping approval with the user.",
      },
      {
        id: "policy-clear",
        title: "Clearer enablement under policy",
        description:
          "Security can approve specific AI features with documented data boundaries.",
      },
    ],
    workflowSteps: [
      {
        id: "jobs",
        label: "Pick assist jobs",
        detail:
          "Choose one or two tasks (summarize, draft, extract) worth assisting first.",
      },
      {
        id: "policy",
        label: "Clear policy",
        detail:
          "Confirm vendor data use, retention, and which record types may be sent to models.",
      },
      {
        id: "enable",
        label: "Enable narrowly",
        detail:
          "Turn on features for a pilot cohort with human review required.",
      },
      {
        id: "review",
        label: "Review outputs",
        detail:
          "Users edit drafts and verify summaries against the timeline before acting.",
      },
      {
        id: "expand",
        label: "Expand carefully",
        detail:
          "Add more AI jobs only after quality and policy comfort are real.",
      },
    ],
    workedExamples: [
      {
        id: "saas-ae-summary",
        title: "B2B SaaS: AE pre-call summary",
        situation:
          "An AE inherits an enterprise opportunity with 80 timeline entries. Prep takes 40 minutes of scrolling; something important still gets missed.",
        whatGoodLooksLike:
          "AI summary highlights last stakeholder positions, open questions, and next step from CRM email sync and notes. AE spot-checks two source emails, then joins the call. No stage or amount changes without the AE confirming.",
        whatToAskVendors:
          "Does summarization use CRM timeline data only? Can we disable automatic record updates? What model data-retention policy applies on our plan?",
      },
      {
        id: "agency-followup-draft",
        title: "Agency: follow-up draft after pitch",
        situation:
          "BD leads write custom follow-ups after every pitch late at night. Quality varies; some pitches get no follow-up until midweek.",
        whatGoodLooksLike:
          "After logging pitch notes, AI drafts a follow-up email using the opportunity fields and notes. BD edits tone and specifics, then sends via synced mailbox so the thread stays on the record. Sequence enrollment stays manual for nurture cases.",
        whatToAskVendors:
          "Can drafts pull custom fields and notes? Do sends still go from the user’s mailbox? Can admins turn off AI for certain roles?",
      },
    ],
    faq: [
      {
        question: "What is AI assistance in a CRM?",
        answer:
          "It is model-powered help on CRM work — such as summarizing records, drafting emails, suggesting next steps, or extracting fields — ideally grounded in your CRM data and reviewed by a human.",
      },
      {
        question: "Should AI automatically update deals?",
        answer:
          "Treat silent writes with caution. Prefer suggestions that a person confirms, especially for stage, amount, and compliance-sensitive fields.",
      },
      {
        question: "Does AI replace pipeline discipline?",
        answer:
          "No. AI amplifies whatever is in the records. Honest stages, ownership, and activity capture still come first; assistance makes good hygiene faster to work with.",
      },
    ],
    heroVisual: {
      src: "/features/ai-assistance-hero.png",
      alt: "Educational diagram of CRM AI assistance drafting and summarizing from a record timeline with a human review step.",
      caption:
        "AI assistance accelerates CRM work when humans still verify what matters.",
    },
    needsVisual: {
      src: "/features/ai-assistance-needs.png",
      alt: "Diagram mapping blank-page writing, long timelines, silent AI writes, and data-policy blockers to AI assistance patterns.",
      caption:
        "What teams need from CRM AI — help with review, not unsupervised autopilot.",
    },
    workflowVisual: {
      src: "/features/ai-assistance-workflow.png",
      alt: "Five-step AI assistance workflow: pick assist jobs, clear policy, enable narrowly, review outputs, expand carefully.",
      caption:
        "How teams enable CRM AI features without losing control of the system of record.",
    },
  },
};

/** Curated CRM Features pillar public URL slugs (CRM-FEAT-001…016). */
export const CRM_FEATURE_PILLAR_SLUGS = [
  "multiple-pipelines",
  "workflow-automation",
  "custom-pipeline-stages",
  "email-sync",
  "lead-scoring",
  "custom-fields",
  "forecasting",
  "reporting-dashboards",
  "calling",
  "email-sequences",
  "sso",
  "audit-logs",
  "role-permissions",
  "api-access",
  "mobile-app",
  "ai-assistance",
] as const;