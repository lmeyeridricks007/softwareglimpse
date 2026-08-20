import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * CRM Implementation Timeline — phase week ranges, not guarantees.
 * Template: softwareglimpse-guide-template-v1
 */
const crmImplementationTimelineBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Build CRM implementation timelines as phase ranges with evidence gates — not fixed go-live dates promised from a kickoff slide. Decision rule: calendar configure and pilot ranges, but only schedule firm-wide expansion after two consecutive clean weekly reviews; treat every week number as a planning band, never a vendor guarantee.",
    bullets: [
      "Phase ranges",
      "Evidence gates",
      "Pilot before expand",
      "Buffer for data",
      "No fake deadlines",
      "Update weekly",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Ranges beat hard dates",
        body: "Dirty data and missing admin hours stretch calendars — plan buffers.",
      },
      {
        label: "Gates > week numbers",
        body: "Two clean reviews unlock expansion more honestly than “week 6.”",
      },
      {
        label: "Sequence matters",
        body: "Configure before import; train after sample records exist.",
      },
      {
        label: "Update the plan",
        body: "A timeline that never changes is theater — revise ranges weekly.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "timeline-path",
    title: "Timeline design path",
    steps: [
      { id: "phases", label: "Phases", short: "List workstreams" },
      { id: "ranges", label: "Ranges", short: "Week bands" },
      { id: "gates", label: "Gates", short: "Evidence checks" },
      { id: "buffers", label: "Buffers", short: "Data & training" },
      { id: "review", label: "Review", short: "Weekly replan" },
    ],
    ctaHref: "/tools/crm-implementation-planner/",
    ctaLabel: "Implementation Planner →",
  },
  {
    type: "figure",
    id: "timeline-phases",
    title: "Phase timeline with gates",
    src: "/guides/crm-implementation-timeline-phases.png",
    alt: "CRM implementation timeline infographic showing week-range bands for plan, configure, migrate, pilot, and expand, with hygiene gate checkpoints between pilot and expand.",
    caption:
      "Week bands are planning aids — hygiene gates decide when expand actually starts.",
  },
  {
    type: "feature-matrix",
    id: "phase-duration-signals",
    title: "What stretches each phase",
    rows: [
      {
        feature: "Plan freeze (outcomes, RACI, pilot)",
        mustHave: true,
        niceToHave: false,
        notes: "Often ~1 week if artifacts are ready; longer if product still undecided.",
      },
      {
        feature: "Configure core loop",
        mustHave: true,
        niceToHave: false,
        notes: "Often ~1–3 weeks for a focused pod; longer with complex permissions.",
      },
      {
        feature: "Migrate / clean pilot slice",
        mustHave: true,
        niceToHave: false,
        notes: "Widest variance — duplicates and field mapping dominate.",
      },
      {
        feature: "Pilot + hygiene gate",
        mustHave: true,
        niceToHave: false,
        notes: "Often ~2–6 weeks of live use; gate on two clean reviews.",
      },
      {
        feature: "Expand next segment",
        mustHave: true,
        niceToHave: false,
        notes: "Often ~1–2 weeks per segment after clone + train.",
      },
      {
        feature: "Heavy automation / AI rollouts",
        mustHave: false,
        niceToHave: true,
        notes: "After board trust — do not put on the critical path.",
      },
      {
        feature: "Full historical archive import",
        mustHave: false,
        niceToHave: true,
        notes: "Parallel track — not a blocker for pilot reviews.",
      },
    ],
  },
  {
    type: "checklist",
    id: "timeline-checklist",
    title: "Timeline ready when…",
    copyable: true,
    items: [
      {
        id: "phases-named",
        label: "Phases named with owners",
        description: "Plan, configure, migrate, pilot, expand.",
        order: 0,
      },
      {
        id: "ranges-written",
        label: "Week ranges written as bands",
        description: "e.g. configure 1–3 weeks — not “done Friday.”",
        order: 1,
      },
      {
        id: "gates-defined",
        label: "Evidence gates defined",
        description: "Especially two clean weekly reviews before expand.",
        order: 2,
      },
      {
        id: "buffers",
        label: "Buffers for data cleanup and training",
        description: "Explicit — not hidden hope.",
        order: 3,
      },
      {
        id: "no-fake-golive",
        label: "Firm-wide go-live not promised early",
        description: "Expansion date stays tentative until gate passes.",
        order: 4,
      },
      {
        id: "weekly-replan",
        label: "Weekly replan ritual scheduled",
        description: "Update ranges from actual blockers.",
        order: 5,
      },
    ],
  },
  {
    type: "step",
    id: "list-phases",
    stepNumber: 1,
    heading: "List phases before you assign weeks",
    body: "Name the workstreams in order: plan freeze → configure core loop → migrate pilot slice → train pilot → hygiene gate → expand → light automation. Dependencies first; dates second.\n\nExample: Cascade Labs, an 18-person SaaS GTM team (6 AEs, 4 SDRs, CS, marketing ops), lists phases with owners: RevOps lead Nina owns configure/migrate; sales manager Omar owns pilot reviews; CS waits until AE board is trusted. They refuse to put “AI scoring” on the critical path.",
    tip: "If a phase has no owner, it will silently steal weeks from whatever phase follows it.",
    figure: {
      src: "/guides/crm-implementation-timeline-hero.png",
      alt: "CRM implementation timeline hero: high-fidelity SaaS project timeline UI with week-range bands and hygiene gate markers.",
      caption:
        "Show ranges and gates on one timeline — not a single promised go-live flag.",
    },
    scenarios: [
      {
        title: "Sales-led",
        body: "Pilot AEs before SDRs and CS share the same org.",
      },
      {
        title: "Services-led",
        body: "Pilot delivery pod; sales pipeline can follow.",
      },
      {
        title: "Migration-heavy",
        body: "Split migrate into clean → test → cutover bands.",
      },
    ],
  },
  {
    type: "step",
    id: "assign-ranges",
    stepNumber: 2,
    heading: "Assign week ranges — label them as ranges",
    body: "Use bands that match scope. Illustrative planning bands for a focused GTM pod (not guarantees): plan freeze ~0.5–2 weeks; configure ~1–3 weeks; pilot migrate/clean ~1–4 weeks; pilot live use until two clean reviews ~2–6 weeks; expand per segment ~1–2 weeks. Widen bands when sources are messy or admin hours are part-time.\n\nExample: Cascade plans configure for weeks 1–3, pilot import/clean for weeks 2–5 (overlap allowed for field mapping), and pilot live use starting week 4 with a hygiene gate no earlier than week 6. Omar tells leadership the expand date is “after two clean Tuesdays,” not “week 8 guaranteed.”",
    tip: "Write “~2–4 weeks” on the slide. If someone deletes the tilde, put it back.",
    scenarios: [
      {
        title: "Clean greenfield",
        body: "Shorter migrate band; still keep a hygiene gate.",
      },
      {
        title: "Messy Sheets exit",
        body: "Widen migrate/clean; protect pilot from archive dump.",
      },
      {
        title: "Part-time admin",
        body: "Widen every band — calendar hours, not wishful nights.",
      },
    ],
  },
  {
    type: "step",
    id: "place-gates",
    stepNumber: 3,
    heading: "Place evidence gates on the critical path",
    body: "Minimum gates: (1) plan artifacts frozen before configure, (2) sync + sample activity proven before broad invites, (3) two consecutive clean weekly reviews before expand, (4) light automation only after expand hygiene holds. Gates can slip the calendar; they should not be skipped.\n\nExample: Cascade’s week-6 review still has twelve overdue next steps. Nina does not “rebaseline expand to week 7 anyway.” They add two hygiene huddles, slip expand by ~1–2 weeks, and keep CS off the timeline until Omar’s board is clean.",
    tip: "A slipped gate is honest; a skipped gate becomes a failed expansion.",
    scenarios: [
      {
        title: "Pass",
        body: "Two clean reviews; overdue view near empty.",
      },
      {
        title: "Extend",
        body: "Hygiene huddles; keep expand tentative.",
      },
      {
        title: "Rework",
        body: "Stages/fields wrong — pause invites and fix the loop.",
      },
    ],
  },
  {
    type: "step",
    id: "buffer-and-parallel",
    stepNumber: 4,
    heading: "Buffer data work; parallelize non-critical tracks",
    body: "Put dirty-data cleanup and field mapping on an explicit buffer. Run archive historical import, marketplace apps, and AI experiments as parallel tracks that cannot block the pilot board. Use the Migration Planner for cutover sequencing when tool-to-tool moves are involved.\n\nExample: Cascade keeps “five years of closed-lost notes” on a parallel track owned by an intern + Nina. The pilot only needs open opportunities and active accounts. Marketing’s form enrichment project stays parallel and cannot move the Tuesday review gate.",
    tip: "If everything is on the critical path, nothing is — until the first slip.",
    scenarios: [
      {
        title: "Critical path",
        body: "Core loop, pilot data, training, hygiene gate.",
      },
      {
        title: "Parallel",
        body: "Archive import, nice-to-have apps, reporting polish.",
      },
      {
        title: "Parked",
        body: "Complex automation until after expand.",
      },
    ],
  },
  {
    type: "step",
    id: "weekly-replan",
    stepNumber: 5,
    heading: "Replan weekly with blockers, not vibes",
    body: "Hold a short timeline standup: what slipped, which gate is at risk, what range updates. Publish a one-line status to the sponsor. Keep the Implementation Planner as the living task list.\n\nExample: Cascade’s Friday 15-minute standup updates ranges in the Planner. When duplicate accounts block import, Nina widens migrate by one week and tells Alex (sponsor) in one sentence — no surprise all-hands “we’re delayed” theater later.",
    tip: "Sponsors hate surprises more than slips — replan early and specifically.",
    scenarios: [
      {
        title: "On band",
        body: "Confirm next gate date remains tentative-but-healthy.",
      },
      {
        title: "At risk",
        body: "Name the blocker owner and the new range.",
      },
      {
        title: "Blocked",
        body: "Escalate capacity (admin hours) before inventing overtime heroes.",
      },
    ],
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "Timeline mistakes",
    items: [
      {
        title: "Promising a firm-wide go-live in kickoff",
        body: "You train the org to ignore hygiene gates.",
      },
      {
        title: "Copying vendor week-1–12 as truth",
        body: "Your data quality and admin hours are not their sample customer.",
      },
      {
        title: "Putting automation on the critical path",
        body: "You delay trust to chase feature theater.",
      },
      {
        title: "No buffer for cleanup",
        body: "Duplicate-ridden imports silently consume pilot weeks.",
      },
      {
        title: "Training before records exist",
        body: "People practice on empty sandboxes and forget habits.",
      },
      {
        title: "Never updating the plan",
        body: "A static Gantt becomes fiction by week three.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "How long does CRM implementation take?",
        answer:
          "It depends on pilot size, data cleanliness, and admin capacity. Focused pods often prove a core loop in a few weeks; multi-team rollouts often span months. Use phase ranges and hygiene gates — never invent a single guaranteed date.",
      },
      {
        question: "What is a reasonable pilot duration?",
        answer:
          "Long enough to complete two consecutive clean weekly reviews — often roughly 2–6 weeks of live use after configure/import, longer if hygiene fails early. Gate on evidence, not a preset week number.",
      },
      {
        question: "Can configure and migrate overlap?",
        answer:
          "Yes for field mapping and cleanup prep. Do not invite the full pilot until roles, stages, and sync are stable enough that imports land on a usable model.",
      },
      {
        question: "When should we schedule firm-wide training?",
        answer:
          "After the pilot hygiene gate passes and you can train on real patterns from the pilot board. Early all-hands training on empty config rarely sticks.",
      },
      {
        question: "How do we communicate slips?",
        answer:
          "Name the blocker, the owner, and the new range in one sentence to the sponsor. Do not skip the hygiene gate to “save the date.”",
      },
      {
        question: "Where do cost and roles fit on the timeline?",
        answer:
          "Cost categories and RACI belong in planning before week bands harden. See Planning and Cost guides; keep timeline focused on sequencing and gates.",
      },
      {
        question: "What should I do next?",
        answer:
          "Enter phases and ranges in the CRM Implementation Planner, align with the Planning guide’s artifacts, and keep Cost categories visible to the sponsor.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related timeline resources",
    links: [
      {
        href: "/guides/crm-implementation/",
        label: "CRM implementation guide",
        description: "Full journey pillar.",
      },
      {
        href: "/guides/crm-implementation-planning/",
        label: "Plan CRM implementation",
        description: "Artifacts before week bands.",
      },
      {
        href: "/guides/crm-implementation-cost/",
        label: "Implementation cost",
        description: "Categories that stretch timelines.",
      },
      {
        href: "/guides/crm-go-live/",
        label: "CRM go-live",
        description: "Launch gates after pilot.",
      },
      {
        href: "/guides/crm-data-migration/",
        label: "CRM data migration",
        description: "Cutover sequencing.",
      },
      {
        href: "/guides/crm-training/",
        label: "CRM training",
        description: "When to train on the calendar.",
      },
      {
        href: "/tools/crm-implementation-planner/",
        label: "CRM Implementation Planner",
        description: "Living phases and tasks.",
      },
      {
        href: "/tools/crm-migration-planner/",
        label: "CRM Migration Planner",
        description: "Test and cutover bands.",
      },
      {
        href: "/tools/crm-tco-calculator/",
        label: "CRM TCO Calculator",
        description: "Time cost categories.",
      },
      {
        href: "/tools/crm-cost-calculator/",
        label: "CRM Cost Calculator",
        description: "Subscription bands.",
      },
      {
        href: "/tools/crm-finder/",
        label: "CRM Finder",
        description: "If product choice still blocks the clock.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "planner-cta",
    title: "Put ranges on a living plan",
    body: "Use the CRM Implementation Planner to capture phases, tasks, and risks — then update week bands as gates pass or slip.",
    href: "/tools/crm-implementation-planner/",
    ctaLabel: "Build implementation plan →",
    variant: "finder",
  },
];

export const crmImplementationTimelineGuide: GuidePage = {
  id: "guide-crm-implementation-timeline",
  slug: "crm-implementation-timeline",
  title: "CRM Implementation Timeline: Phase Ranges & Gates",
  summary:
    "Build CRM implementation timelines as week-range bands with hygiene evidence gates — so expansion is scheduled on trust, not kickoff slide promises.",
  categorySlugs: ["crm"],
  productSlugs: [],
  topicType: "implementation",
  journeyStage: "implement",
  knowledgeAreaSlug: "implementation",
  heroVisual: {
    src: "/guides/crm-implementation-timeline-hero.png",
    alt: "CRM implementation timeline hero: high-fidelity SaaS project timeline UI with week-range bands and hygiene gate markers.",
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
      contentId: "content:tool:crm-migration-planner",
      relationType: "supports-anchor",
      primary: false,
    },
  ],
  nextAction: {
    contentId: "content:tool:crm-implementation-planner",
    label: "Build an implementation plan",
  },
  relatedGuideSlugs: [
    "crm-implementation",
    "crm-implementation-planning",
    "crm-implementation-cost",
    "crm-go-live",
    "crm-data-migration",
    "crm-training",
    "crm-adoption",
    "crm-implementation-mistakes",
  ],
  blocks: crmImplementationTimelineBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "phases-ranges",
      label: "Name phases and week-range bands",
      description: "Owners on each phase; tilde ranges only.",
      order: 0,
    },
    {
      id: "gates",
      label: "Place hygiene gates on the critical path",
      description: "Two clean reviews before expand.",
      order: 1,
    },
    {
      id: "replan",
      label: "Schedule weekly replan",
      description: "Update ranges from blockers.",
      order: 2,
    },
  ],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: {
    status: "published",
    updatedAt: "2026-08-14T10:30:00.000Z",
    publishedAt: "2026-08-14T10:30:00.000Z",
    reviewedAt: "2026-08-14T10:30:00.000Z",
    researchStatus: "complete",
    seoStatus: "optimized",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title:
      "CRM Implementation Timeline: Phase Ranges & Gates | SoftwareGlimpse",
    description:
      "CRM implementation timelines as week-range bands with evidence gates — pilot hygiene before firm-wide expansion.",
    canonicalPath: "/guides/crm-implementation-timeline/",
    indexable: true,
  },
};
