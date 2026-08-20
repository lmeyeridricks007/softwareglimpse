import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * CRM Implementation KPIs — leading vs lagging signals and intervene decision rules.
 * Template: softwareglimpse-guide-template-v1
 * Note: qualitative / team-defined thresholds only — no invented industry benchmark %.
 */
const crmImplementationKpisBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Track leading implementation signals (hygiene, next-step fill, time-to-first-value, core-object adoption) before lagging outcomes (forecast trust, side-sheet retirement, board-native reviews). Decision rule: if leading signals miss your team-defined targets for two consecutive weeks, intervene — coach, simplify, or freeze expansion — even if lagging metrics still look “fine.” Do not treat invented industry benchmark percentages as verified facts.",
    bullets: [
      "Leading first",
      "Lagging second",
      "Team-defined targets",
      "Two-week intervene",
      "Core-object adoption",
      "No fake benchmarks",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Leading signals predict collapse",
        body: "Empty next steps show up before forecast trust dies.",
      },
      {
        label: "Lagging without leading is late",
        body: "Waiting for revenue stories misses the operable window.",
      },
      {
        label: "Targets are yours to set",
        body: "Use qualitative thresholds or internal goals — not invented industry % facts.",
      },
      {
        label: "Intervene is a decision",
        body: "Two-week miss → coach / simplify / freeze — not another dashboard tile.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "kpi-path",
    title: "KPI operating path",
    steps: [
      { id: "pick", label: "Pick signals", short: "Leading set" },
      { id: "targets", label: "Set targets", short: "Team-defined" },
      { id: "review", label: "Weekly read", short: "Same views" },
      { id: "rule", label: "Decision rule", short: "Intervene / hold / expand" },
      { id: "lag", label: "Check lagging", short: "Trust outcomes" },
    ],
    ctaHref: "/guides/crm-adoption/",
    ctaLabel: "Adoption guide →",
  },
  {
    type: "figure",
    id: "signals-visual",
    title: "Leading vs lagging with intervene rules",
    src: "/guides/crm-implementation-kpis-signals.png",
    alt: "Teaching diagram of CRM leading versus lagging KPIs with intervene, hold, and expand decision paths.",
    caption:
      "Leading misses trigger action; lagging confirms whether trust actually moved.",
  },
  {
    type: "checklist",
    id: "kpi-standup-checklist",
    title: "Stand up implementation KPIs",
    copyable: true,
    items: [
      {
        id: "leading-set",
        label: "Choose 4 leading signals",
        description: "Hygiene, next-step fill, time-to-first-value, core-object adoption.",
        order: 0,
      },
      {
        id: "lagging-set",
        label: "Choose 2–3 lagging outcomes",
        description: "Board-native review, side-sheet retired, forecast/trust proxy.",
        order: 1,
      },
      {
        id: "targets",
        label: "Write team-defined targets",
        description: "Qualitative bands or internal goals — cite no fake industry %.",
        order: 2,
      },
      {
        id: "owner",
        label: "Name KPI review owner",
        description: "Ops + business lead; same views each week.",
        order: 3,
      },
      {
        id: "rule",
        label: "Publish intervene rule",
        description: "Two consecutive leading misses → freeze expansion.",
        order: 4,
      },
    ],
  },
  {
    type: "step",
    id: "leading-signals",
    stepNumber: 1,
    heading: "Instrument leading signals",
    body: "Leading signals are operable weekly: hygiene completeness on open work (owners filled), next-step fill rate on open items, time-to-first-value (how quickly a new user completes the core loop on a real record), and adoption of core objects (contacts/accounts/opportunities actually used — not unused modules). Define each signal in plain language so managers can act without a BI project.\n\nExample: Meridian Specialty Finance tracks (1) open deals missing owner or next step, (2) days from seat invite to first complete loop, (3) share of sellers with at least one updated opportunity this week. Ana reviews the same three saved lists every Monday — no vanity login chart.",
    tip: "If a metric cannot change behavior this week, it is not a leading implementation KPI.",
    figure: {
      src: "/guides/crm-implementation-kpis-hero.png",
      alt: "CRM implementation KPIs hero dashboard splitting leading indicators and lagging outcomes with intervene decision callouts.",
      caption:
        "Leading panels drive weekly action; lagging panels confirm trust — with Low / On-track / Intervene bands, not fake industry percentages.",
    },
    scenarios: [
      {
        title: "Hygiene %",
        body: "Team-defined completeness on owner + required hygiene fields.",
      },
      {
        title: "Next-step fill",
        body: "Open work with a dated next action — queue the empties.",
      },
      {
        title: "Time-to-first-value",
        body: "Invite → first complete core loop on a live record.",
      },
      {
        title: "Core-object adoption",
        body: "Primary objects updated; unused objects stay out of the score.",
      },
    ],
  },
  {
    type: "step",
    id: "lagging-outcomes",
    stepNumber: 2,
    heading: "Watch lagging outcomes without waiting on them",
    body: "Lagging outcomes confirm trust: Friday reviews run from the CRM board, side sheets retired from the coaching ritual, and leadership accepts CRM-sourced status (forecast or coverage) without a rebuild. These move slower — use them to validate, not to notice problems late.\n\nExample: Harborline’s lagging check is simple: two consecutive Friday coverage meetings with no household spreadsheet open. Leading next-step fill had to stabilize first; the lagging win arrived afterward.",
    tip: "Do not celebrate lagging wins if leading signals are already slipping again.",
    scenarios: [
      {
        title: "Board-native review",
        body: "Meeting starts from CRM views — not a pasted export.",
      },
      {
        title: "Sheet retirement",
        body: "Shadow list gone from the ritual (policy date met).",
      },
      {
        title: "Trust proxy",
        body: "Leaders stop asking for parallel status rebuilds.",
      },
    ],
  },
  {
    type: "step",
    id: "targets-without-fake-benchmarks",
    stepNumber: 3,
    heading: "Set targets without invented benchmarks",
    body: "Use team-defined targets and qualitative bands (for example On-track / Watch / Intervene) based on your process and capacity. You may set internal numeric goals for queues or fill rates — but do not present unverified “industry average” percentages as facts. Document how each target was chosen and when you will revisit it.\n\nExample: Crestview sets Intervene when the empty next-step queue is still growing at the second weekly quality review, and On-track when the queue is empty before Monday coverage. They explicitly refuse to cite a made-up industry fill-rate percentage in the exec update.",
    tip: "A honest internal target beats a fake external benchmark every time.",
    scenarios: [
      {
        title: "Queue-based targets",
        body: "Overdue or empty queues must shrink week over week.",
      },
      {
        title: "Band-based targets",
        body: "On-track / Watch / Intervene on a written rubric.",
      },
      {
        title: "Pilot vs scale",
        body: "Tighter targets for pilot; revisit before firm-wide expand.",
      },
    ],
  },
  {
    type: "step",
    id: "intervene-rules",
    stepNumber: 4,
    heading: "Publish intervene / hold / expand rules",
    body: "Write the decision rules before emotions run hot. Default: two consecutive weekly misses on leading signals → Intervene (freeze seat expansion and new automation; coach or simplify). Mixed signals → Hold. Leading on-track for two weeks and lagging moving the right way → Expand. If leading is healthy but lagging stays broken, dig into manager bypass or product/process fit — not more vanity metrics.\n\nExample: Blue Harbor hits Intervene when next-step fill misses for two Mondays. They cancel a marketplace app install, run manager coaching, and only reopen expansion after two On-track weeks.",
    tip: "Rules without owners are wallpaper — name who calls Intervene.",
    scenarios: [
      {
        title: "Intervene",
        body: "Coach ritual, cut fields, pause automation and seats.",
      },
      {
        title: "Hold",
        body: "Keep WIP steady; no new required fields or stages.",
      },
      {
        title: "Expand",
        body: "Next pod with same core config and KPI pack.",
      },
    ],
  },
  {
    type: "step",
    id: "weekly-kpi-ritual",
    stepNumber: 5,
    heading: "Run a weekly KPI ritual",
    body: "Same day, same views, same decision: read leading signals, skim lagging, apply the rule, assign actions. Tie actions to adoption coaching, data-quality queues, and governance change control. Keep the pack small enough to finish in thirty minutes.\n\nExample: Northwind’s Monday pack is three lists and one decision cell (Intervene/Hold/Expand). Priya posts the decision in the pilot channel so sellers see that metrics change behavior — not just slides.",
    tip: "If the KPI meeting creates no decisions, delete a metric before adding one.",
    scenarios: [
      {
        title: "Pilot phase",
        body: "Emphasize time-to-first-value and next-step fill.",
      },
      {
        title: "Scale phase",
        body: "Add core-object adoption by cohort; keep intervene rule.",
      },
      {
        title: "Optimize phase",
        body: "Keep leading pack; use lagging to judge trust, not vanity.",
      },
    ],
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "Implementation KPI mistakes",
    items: [
      {
        title: "Login vanity as the north star",
        body: "High activity can coexist with empty next steps and sheet rebuilds.",
      },
      {
        title: "Citing unverified industry percentages",
        body: "Fake benchmarks create false confidence and bad exec debates.",
      },
      {
        title: "Only lagging metrics",
        body: "You notice failure after the dual-run culture hardens.",
      },
      {
        title: "No intervene owner",
        body: "Red metrics without a freeze decision train people to ignore dashboards.",
      },
      {
        title: "Too many KPIs",
        body: "A wall of charts replaces the thirty-minute decision ritual.",
      },
      {
        title: "Expanding while in Intervene",
        body: "Seat growth amplifies the miss instead of fixing the loop.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "What KPIs should we track during CRM implementation?",
        answer:
          "Prioritize leading signals: hygiene completeness, next-step fill on open work, time-to-first-value for new users, and core-object adoption. Use lagging outcomes (board-native reviews, side-sheet retirement, leadership trust) to confirm — not as your only early warning.",
      },
      {
        question: "What is a good benchmark percentage?",
        answer:
          "There is no universal verified percentage you should treat as fact here. Set team-defined targets and qualitative bands (On-track / Watch / Intervene) from your process. Revisit targets as the pilot matures.",
      },
      {
        question: "When should we intervene?",
        answer:
          "When leading signals miss your targets for two consecutive weekly reviews — freeze expansion and new automation, then coach or simplify. Name who owns that call.",
      },
      {
        question: "What is time-to-first-value in CRM?",
        answer:
          "Elapsed time from invite (or go-live for a user) until they complete the core loop on a real record — create/update, activity, honest stage, dated next step. Long times usually mean training or complexity problems.",
      },
      {
        question: "How do KPIs relate to adoption and data quality?",
        answer:
          "Adoption defines the loop and coaching ritual; data quality runs hygiene queues; KPIs are the shared signals and decision rules that connect them to expand/intervene choices.",
      },
      {
        question: "What should I do next?",
        answer:
          "Pick four leading signals, write On-track/Intervene bands, schedule the weekly pack, and link actions to Adoption, Data Quality, and Governance owners.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related CRM resources",
    links: [
      {
        href: "/guides/crm-adoption/",
        label: "CRM adoption",
        description: "Core-loop usage and 30/60/90 gates.",
      },
      {
        href: "/guides/crm-data-quality/",
        label: "CRM data quality",
        description: "Hygiene SLAs behind the leading signals.",
      },
      {
        href: "/guides/crm-governance/",
        label: "CRM governance",
        description: "Ownership when metrics demand config changes.",
      },
      {
        href: "/guides/crm-change-management/",
        label: "CRM change management",
        description: "People actions when Intervene fires.",
      },
      {
        href: "/guides/crm-implementation/",
        label: "CRM implementation",
        description: "Pillar path these KPIs gate.",
      },
      {
        href: "/guides/crm-roi-guide/",
        label: "CRM ROI guide",
        description: "Value framing without invented ROI % facts.",
      },
      {
        href: "/guides/common-crm-mistakes/",
        label: "Common CRM mistakes",
        description: "Set-and-forget and ownership failures.",
      },
      {
        href: "/tools/crm-implementation-planner/",
        label: "Implementation Planner",
        description: "Put KPI reviews on the plan.",
      },
      {
        href: "/tools/crm-finder/",
        label: "CRM Finder",
        description: "Shortlist if product fit is still open.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "planner-cta",
    title: "Schedule the KPI ritual",
    body: "Add weekly leading-signal reviews and intervene checkpoints to the Implementation Planner so expansion decisions stay evidence-based.",
    href: "/tools/crm-implementation-planner/",
    ctaLabel: "Open Implementation Planner →",
    variant: "finder",
  },
];

export const crmImplementationKpisGuide: GuidePage = {
  id: "guide-crm-implementation-kpis",
  slug: "crm-implementation-kpis",
  title: "CRM Implementation KPIs: Leading Signals & Intervene Rules",
  summary:
    "Track CRM implementation with leading hygiene and adoption signals, lagging trust outcomes, and clear intervene/hold/expand rules — without invented industry benchmark percentages.",
  categorySlugs: ["crm"],
  productSlugs: [],
  topicType: "implementation",
  journeyStage: "implement",
  knowledgeAreaSlug: "implementation",
  heroVisual: {
    src: "/guides/crm-implementation-kpis-hero.png",
    alt: "CRM implementation KPIs hero dashboard splitting leading indicators and lagging outcomes with intervene decision callouts.",
  },
  supports: [
    {
      contentId: "content:category:crm",
      relationType: "supports-anchor",
      primary: true,
    },
    {
      contentId: "content:tool:crm-implementation-planner",
      relationType: "supports-anchor",
      primary: false,
    },
    {
      contentId: "content:tool:crm-finder",
      relationType: "supports-anchor",
      primary: false,
    },
  ],
  nextAction: {
    contentId: "content:tool:crm-implementation-planner",
    label: "Open Implementation Planner",
  },
  relatedGuideSlugs: [
    "crm-adoption",
    "crm-data-quality",
    "crm-governance",
    "crm-change-management",
    "crm-implementation",
    "crm-roi-guide",
    "common-crm-mistakes",
  ],
  blocks: crmImplementationKpisBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "leading-lagging",
      label: "Define leading + lagging signal packs",
      description: "Team-defined targets only.",
      order: 0,
    },
    {
      id: "intervene-rule",
      label: "Publish intervene / hold / expand rules",
      description: "Two-week leading miss → freeze expansion.",
      order: 1,
    },
    {
      id: "weekly-ritual",
      label: "Run weekly KPI ritual with named owner",
      description: "Same views; decisions posted.",
      order: 2,
    },
  ],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: {
    status: "published",
    updatedAt: "2026-08-14T12:00:00.000Z",
    publishedAt: "2026-08-14T12:00:00.000Z",
    reviewedAt: "2026-08-14T12:00:00.000Z",
    researchStatus: "complete",
    seoStatus: "optimized",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title: "CRM Implementation KPIs Guide | SoftwareGlimpse",
    description:
      "CRM implementation KPIs: leading hygiene and adoption signals, lagging trust outcomes, and intervene rules — without invented industry benchmarks.",
    canonicalPath: "/guides/crm-implementation-kpis/",
    indexable: true,
  },
};
