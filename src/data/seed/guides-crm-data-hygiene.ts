import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * CRM Data Hygiene — ongoing operating rhythm (≠ cleaning/quality IMP one-time projects).
 * Template: softwareglimpse-guide-template-v1
 */
const crmDataHygieneBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "CRM data hygiene is a weekly operating rhythm with named owners, SLAs, and decay-prevention rules — not a quarterly cleanup project. Decision rule: if duplicates age in a queue, open work lacks owners or next steps, or Friday still needs a rebuild sheet, pause new automation and hold the weekly hygiene ritual until team-defined signals meet target for two consecutive weeks.",
    bullets: [
      "Weekly rhythm",
      "Named owners",
      "Hygiene SLAs",
      "Decay prevention",
      "Pause automation",
      "Not one-time clean",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Hygiene ≠ cleanup event",
        body: "A migration cleanse without weekly ownership decays within weeks.",
      },
      {
        label: "SLAs need people",
        body: "Every signal needs an owner, a queue, and a coaching response.",
      },
      {
        label: "Prevent decay upstream",
        body: "Required fields, duplicate rules, and archive policies beat heroic merges.",
      },
      {
        label: "Quality guide is the system design",
        body: "Use /guides/crm-data-quality/ for rules; this guide is the ongoing ops cadence.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "hygiene-ops-path",
    title: "Hygiene operating path",
    steps: [
      { id: "signals", label: "Pick signals", short: "3–5 metrics" },
      { id: "owners", label: "Name owners", short: "Queue + R/A" },
      { id: "sla", label: "Set SLAs", short: "Team targets" },
      { id: "weekly", label: "Weekly ritual", short: "Decide + coach" },
      { id: "prevent", label: "Prevent decay", short: "Rules upstream" },
    ],
    ctaHref: "/guides/crm-data-quality/",
    ctaLabel: "Data quality guide →",
    figure: {
      src: "/guides/crm-data-hygiene-path.png",
      alt: "Hygiene operating path: pick signals, name owners, set SLAs, weekly ritual, prevent decay upstream.",
      caption:
        "Hygiene is a calendar with owners — not a one-off data day on the backlog.",
    },
  },
  {
    type: "figure",
    id: "hygiene-weekly-rhythm",
    title: "Weekly hygiene operating rhythm",
    src: "/guides/crm-data-hygiene-rhythm.png",
    alt: "Weekly CRM data hygiene calendar diagram: Monday queue review, midweek owner coaching, Friday trust check, with SLA owners and decay-prevention rules on the side.",
    caption:
      "Hygiene is a calendar with owners — not a one-off “data day” on the backlog.",
  },
  {
    type: "checklist",
    id: "hygiene-standup-checklist",
    title: "Stand up hygiene ops",
    copyable: true,
    items: [
      {
        id: "signal-set",
        label: "Pick 3–5 hygiene signals",
        description: "e.g. owner filled, next-step dated, duplicate age, stale open deals, stage honesty sample.",
        order: 0,
      },
      {
        id: "queue-owner",
        label: "Name queue owners",
        description: "Who clears duplicates, who coaches empty next steps, who archives.",
        order: 1,
      },
      {
        id: "sla-targets",
        label: "Write team-defined SLAs",
        description: "Internal targets only — no invented industry benchmarks.",
        order: 2,
      },
      {
        id: "weekly-slot",
        label: "Book the weekly hygiene slot",
        description: "Short huddle with saved views — not a quarterly mega-cleanse.",
        order: 3,
      },
      {
        id: "decay-rules",
        label: "Document decay-prevention rules",
        description: "Required fields, match keys, merge authority, archive policy.",
        order: 4,
      },
    ],
  },
  {
    type: "step",
    id: "rhythm-not-project",
    stepNumber: 1,
    heading: "Treat hygiene as ops, not a project",
    body: "One-time cleaning clears a backlog; hygiene keeps trust between Fridays. Separate the migration/cleanup workstream from the weekly operating system. If your team only “does data” when reports break, you are in project mode — switch to a recurring ritual with exit criteria for intervene weeks.\n\nExample: Lakeside B2B Services finished a migration cleanse in March. By June, duplicates aged past two weeks and forecast Fridays needed a Sheet again. Ops lead Ana stopped scheduling quarterly “data days,” named a Monday queue owner, and defined three signals with team targets. Trust returned without another full cleanse.",
    tip: "If hygiene only appears on the project board, it will lose to feature work every sprint.",
    figure: {
      src: "/guides/crm-data-hygiene-hero.png",
      alt: "CRM data hygiene hero: weekly operating dashboard with SLA tiles, duplicate queue age, owner coverage, and decay-prevention rules — not a one-time cleanup banner.",
      caption:
        "Hygiene looks like a weekly ops board — cleanup is a separate workstream when backlog spikes.",
    },
    scenarios: [
      {
        title: "Post-migration decay",
        body: "Stand up weekly SLAs within two weeks of go-live.",
      },
      {
        title: "Report distrust",
        body: "Pause vanity dashboards; fix ownership and next steps first.",
      },
      {
        title: "Automation blocked",
        body: "Do not automate on dirty queues — restore hygiene first.",
      },
    ],
  },
  {
    type: "step",
    id: "owners-and-slas",
    stepNumber: 2,
    heading: "Assign owners and write hygiene SLAs",
    body: "Every signal needs a responsible owner, a clear queue, and a coaching response when the SLA misses. Typical signals: open records without owners, next-step fill on open work, duplicate age, stale opportunities past a team-defined idle window, and a small stage-honesty sample. Targets are internal — never paste invented industry percentages as facts.\n\nExample: Meridian Specialty Finance sets “duplicate age ≤ 5 business days” and “open deals with dated next step” as team goals. Admin Jordan owns the duplicate queue; managers own empty next-step coaching. Two consecutive weekly misses trigger an intervene huddle, not a silent dashboard red tile.",
    tip: "An SLA without a named human is decoration. Write R/A next to each signal.",
    figure: {
      src: "/guides/crm-data-hygiene-owners-slas.png",
      alt: "Assign CRM hygiene owners and SLAs: signal, named R/A, queue, coach on miss, intervene after two miss weeks.",
      caption:
        "Every signal needs a responsible human, a queue, and a coaching response on miss.",
    },
    scenarios: [
      {
        title: "Small team",
        body: "One ops owner + pod lead share the Monday queue.",
      },
      {
        title: "Multi-pod",
        body: "Central duplicate queue; each pod lead owns next-step coaching.",
      },
      {
        title: "Service + sales",
        body: "Separate signals per object; same weekly slot.",
      },
    ],
  },
  {
    type: "step",
    id: "weekly-ritual",
    stepNumber: 3,
    heading: "Run the weekly hygiene ritual",
    body: "Keep the ritual short and decision-oriented: open the saved hygiene views, clear or assign queue items, coach empty next steps, and note intervene flags. Do not turn Monday into a silent merge marathon without coaching. Capture decisions (merge survivor, archive, reassign) so the same debate does not recur.\n\nExample: Harborline’s fifteen-minute Monday huddle opens three saved lists. Maya assigns five empty next-step deals to coaching, Jordan merges two clear duplicates, and they flag one stage-honesty sample for Friday review. No Sheet rebuild follows.",
    tip: "If the huddle routinely exceeds thirty minutes, your signal set is too wide — cut to the three that block Friday trust.",
    figure: {
      src: "/guides/crm-data-hygiene-ritual.png",
      alt: "Weekly CRM hygiene ritual: open saved views, clear queue, coach next steps, decide merges, flag intervene.",
      caption:
        "Keep the ritual short and decision-oriented — not a silent merge marathon.",
    },
    scenarios: [
      {
        title: "Light week",
        body: "Queue clear; sample stage honesty and close early.",
      },
      {
        title: "Spike week",
        body: "Protect the slot; defer non-hygiene admin work.",
      },
      {
        title: "Missed SLA",
        body: "Run intervene: freeze new fields/automations until two green weeks.",
      },
    ],
  },
  {
    type: "step",
    id: "decay-prevention",
    stepNumber: 4,
    heading: "Prevent decay upstream",
    body: "Hygiene fails when creation paths allow junk. Enforce required owner + next-step on open work, publish duplicate match keys and merge authority, and define archive/close rules for idle records. Pair with governance so field changes do not silently break reports.\n\nExample: Crestview Wealth required next-step dates on open opportunities and banned self-serve custom fields. Duplicate match used email + company domain with Jordan as sole merge authority. Decay slowed before the next cleanup project was even scoped.",
    tip: "Upstream rules reduce queue volume. If the queue always grows, fix creation paths — do not hire more merge time forever.",
    figure: {
      src: "/guides/crm-data-hygiene-prevent.png",
      alt: "Prevent CRM decay upstream: required owner and next step, match keys, merge authority, archive rules, governance.",
      caption:
        "Creation-path rules shrink the weekly queue — merge capacity alone never catches up.",
    },
    scenarios: [
      {
        title: "Import spikes",
        body: "Hold imports behind match rules; sample before full load.",
      },
      {
        title: "Integration noise",
        body: "Map which sync creates duplicates; fix the source key.",
      },
      {
        title: "Field sprawl",
        body: "Route new fields through governance — see Governance guide.",
      },
    ],
  },
  {
    type: "step",
    id: "when-to-clean-vs-hygiene",
    stepNumber: 5,
    heading: "Know when to run a cleanup project",
    body: "Sometimes backlog exceeds the weekly ritual. Run a bounded cleaning project when duplicate age or stale volume blocks reporting for more than two intervene weeks — with a start count, owner, and end criteria. Then return to the weekly rhythm. Do not replace ops with endless projects.\n\nExample: Lakeside’s June intervene found 400 aged duplicates after a list import. Ana scoped a two-week cleaning sprint with daily batch counts, then resumed Monday SLAs. She linked the Data Cleaning guide for merge mechanics and kept this hygiene guide as the permanent calendar.",
    tip: "Cleanup without a return-to-rhythm plan is how decay repeats every quarter.",
    figure: {
      src: "/guides/crm-data-hygiene-cleanup.png",
      alt: "When to run a CRM cleanup project: detect intervene weeks, scope start count, bounded cleanse, end criteria, resume weekly SLAs.",
      caption:
        "Bounded cleanse, then return to the weekly rhythm — projects do not replace ops.",
    },
    scenarios: [
      {
        title: "Import incident",
        body: "Bounded cleanse + tighten match keys + resume weekly SLAs.",
      },
      {
        title: "Pre-automation gate",
        body: "Clear owner/next-step debt before enabling workflows.",
      },
      {
        title: "Pre-migration",
        body: "Hygiene first; migration mapping second.",
      },
    ],
  },
  {
    type: "feature-matrix",
    id: "hygiene-vs-cleaning",
    title: "Hygiene ops vs cleaning projects",
    rows: [
      {
        feature: "Cadence",
        mustHave: true,
        niceToHave: false,
        notes: "Hygiene: weekly ritual. Cleaning: time-boxed sprint with end criteria.",
      },
      {
        feature: "Primary goal",
        mustHave: true,
        niceToHave: false,
        notes: "Hygiene: prevent decay + Friday trust. Cleaning: clear a measured backlog.",
      },
      {
        feature: "Owners",
        mustHave: true,
        niceToHave: false,
        notes: "Hygiene: ongoing R/A per signal. Cleaning: sprint lead + merge authority.",
      },
      {
        feature: "Success signal",
        mustHave: true,
        niceToHave: false,
        notes: "Hygiene: two consecutive weeks on team SLAs. Cleaning: backlog count to target.",
      },
      {
        feature: "Automation readiness",
        mustHave: false,
        niceToHave: false,
        notes: "Only after hygiene trust — never automate to hide a dirty queue.",
      },
    ],
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "Hygiene mistakes",
    items: [
      {
        title: "Quarterly data days only",
        body: "Trust collapses between events; install a weekly ritual.",
      },
      {
        title: "SLAs without owners",
        body: "Red tiles nobody owns train the team to ignore dashboards.",
      },
      {
        title: "Invented benchmark percentages",
        body: "Use team-defined targets and batch counts — not fake industry stats.",
      },
      {
        title: "Automating on dirty data",
        body: "Workflows amplify junk tasks and false stage moves.",
      },
      {
        title: "Everyone can merge",
        body: "Unclear merge authority creates worse duplicates and lost history.",
      },
      {
        title: "Cleaning forever",
        body: "Endless projects without upstream rules never become ops.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "How is data hygiene different from data quality or cleaning?",
        answer:
          "Data quality designs the rules and signals. Data cleaning is a bounded project to clear backlog. Data hygiene is the weekly operating rhythm — owners, SLAs, and decay prevention — that keeps quality between cleanses. Use all three in that order of permanence.",
      },
      {
        question: "How often should we run hygiene?",
        answer:
          "Weekly for most SMB/mid-market teams that rely on Friday pipeline trust. Daily only for high-volume queues with a dedicated owner. Decision rule: if Friday still needs a rebuild sheet, your cadence is too weak.",
      },
      {
        question: "What should our hygiene SLAs be?",
        answer:
          "Team-defined only — e.g. duplicate age, owner fill, next-step fill on open work. Do not cite invented industry percentages as facts. Intervene after two consecutive weekly misses.",
      },
      {
        question: "Who should own hygiene?",
        answer:
          "Ops or admin typically owns duplicate/archive queues; managers own next-step and stage-honesty coaching. Write R/A explicitly. Vacuums kill SLAs.",
      },
      {
        question: "When do we pause automation?",
        answer:
          "When open work routinely lacks owners/next steps, duplicates age past SLA, or Friday trust fails. Restore two green hygiene weeks before re-enabling noisy workflows.",
      },
      {
        question: "Can we skip hygiene if we just cleaned?",
        answer:
          "No. Cleaning without a return-to-rhythm plan decays quickly. Book the weekly slot before the cleanup sprint ends.",
      },
      {
        question: "What should I do next?",
        answer:
          "Pick 3–5 signals, name owners, book the weekly slot, and write decay-prevention rules. Cross-read Data Quality, Data Cleaning, and Governance; use the Implementation Planner to put the ritual on the calendar.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related CRM resources",
    links: [
      {
        href: "/guides/crm-data-quality/",
        label: "CRM data quality",
        description: "Rules, signals, and quality system design.",
      },
      {
        href: "/guides/crm-data-cleaning/",
        label: "CRM data cleaning",
        description: "Bounded cleanup when backlog spikes.",
      },
      {
        href: "/guides/crm-governance/",
        label: "CRM governance",
        description: "Field ownership and change control.",
      },
      {
        href: "/guides/improve-crm-adoption/",
        label: "Improve CRM adoption",
        description: "When hygiene fails because coaching stalled.",
      },
      {
        href: "/guides/crm-reporting-best-practices/",
        label: "Reporting best practices",
        description: "Friday trust depends on hygiene.",
      },
      {
        href: "/guides/crm-automation-best-practices/",
        label: "Automation best practices",
        description: "Automate only after hygiene is trusted.",
      },
      {
        href: "/guides/crm-implementation-kpis/",
        label: "CRM implementation KPIs",
        description: "Leading signals and intervene rules.",
      },
      {
        href: "/tools/crm-implementation-planner/",
        label: "Implementation Planner",
        description: "Schedule hygiene rituals and gates.",
      },
      {
        href: "/tools/crm-finder/",
        label: "CRM Finder",
        description: "Shortlist if product fit blocks hygiene.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "planner-cta",
    title: "Put hygiene on the calendar",
    body: "Use the Implementation Planner to schedule weekly hygiene huddles, SLA owners, and intervene freezes — so data trust is ops, not a forgotten project.",
    href: "/tools/crm-implementation-planner/",
    ctaLabel: "Open Implementation Planner →",
    variant: "finder",
  },
];

export const crmDataHygieneGuide: GuidePage = {
  id: "guide-crm-data-hygiene",
  slug: "crm-data-hygiene",
  title: "CRM Data Hygiene: Weekly Ops That Prevent Decay",
  summary:
    "Run CRM data hygiene as a weekly operating rhythm with named owners, SLAs, and decay-prevention rules — not a one-time cleanup project.",
  categorySlugs: ["crm"],
  productSlugs: [],
  topicType: "strategy",
  journeyStage: "optimize",
  knowledgeAreaSlug: "strategy",
  heroVisual: {
    src: "/guides/crm-data-hygiene-hero.png",
    alt: "CRM data hygiene hero: weekly operating dashboard with SLA tiles, duplicate queue age, owner coverage, and decay-prevention rules — not a one-time cleanup banner.",
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
    "crm-data-quality",
    "crm-data-cleaning",
    "crm-governance",
    "improve-crm-adoption",
    "crm-reporting-best-practices",
    "crm-automation-best-practices",
    "crm-implementation-kpis",
  ],
  blocks: crmDataHygieneBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "signals-owners",
      label: "Pick signals + name queue owners",
      description: "3–5 hygiene signals with R/A.",
      order: 0,
    },
    {
      id: "weekly-sla",
      label: "Book weekly ritual + write SLAs",
      description: "Team-defined targets; intervene after two misses.",
      order: 1,
    },
    {
      id: "decay-rules",
      label: "Document decay-prevention rules",
      description: "Required fields, match keys, merge authority, archive.",
      order: 2,
    },
  ],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: {
    status: "published",
    updatedAt: "2026-08-14T09:00:00.000Z",
    publishedAt: "2026-08-14T09:00:00.000Z",
    reviewedAt: "2026-08-14T09:00:00.000Z",
    researchStatus: "complete",
    seoStatus: "optimized",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title:
      "CRM Data Hygiene: Weekly Ops That Prevent Decay | SoftwareGlimpse",
    description:
      "CRM data hygiene as a weekly operating rhythm: owners, SLAs, decay prevention, and when to pause automation — distinct from one-time cleaning.",
    canonicalPath: "/guides/crm-data-hygiene/",
    indexable: true,
  },
};
