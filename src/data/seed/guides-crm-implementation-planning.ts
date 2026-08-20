import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * Plan CRM Implementation — outcomes, RACI, pilot scope, phase plan.
 * Template: softwareglimpse-guide-template-v1
 */
const crmImplementationPlanningBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Plan CRM implementation by freezing three 90-day outcomes, a RACI-ish ownership map, a pilot segment with written exit criteria, and a phase list (configure → migrate slice → pilot → expand) before anyone builds fields. Decision rule: if outcomes, admin owner, and pilot exit criteria are still vague, pause configuration — planning debt becomes go-live debt.",
    bullets: [
      "Freeze outcomes",
      "Name RACI",
      "Pick pilot",
      "Write exit criteria",
      "List phases",
      "Then configure",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Outcomes beat feature lists",
        body: "“Monday reviews run from the board” is a plan; “enable AI insights” is not.",
      },
      {
        label: "Ownership is the plan",
        body: "Without Responsible/Accountable names, fields and hygiene drift.",
      },
      {
        label: "Pilot scope is a decision",
        body: "Write who is in, who is out, and what proves readiness to expand.",
      },
      {
        label: "Planner is a scaffold",
        body: "Use the Implementation Planner for phases/tasks — gate on evidence, not slide weeks.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "planning-path",
    title: "Implementation planning path",
    steps: [
      { id: "outcomes", label: "Outcomes", short: "Three 90-day goals" },
      { id: "raci", label: "RACI", short: "Owners named" },
      { id: "pilot", label: "Pilot", short: "Segment + exit" },
      { id: "phases", label: "Phases", short: "Configure→expand" },
      { id: "risks", label: "Risks", short: "Gaps listed" },
    ],
    ctaHref: "/tools/crm-implementation-planner/",
    ctaLabel: "Implementation Planner →",
  },
  {
    type: "figure",
    id: "planning-map",
    title: "Planning artifact map",
    src: "/guides/crm-implementation-planning-map.png",
    alt: "CRM implementation planning map linking outcomes sheet, RACI ownership grid, pilot scope card, phase plan, and risk log into one go/no-go gate before configuration.",
    caption:
      "Five artifacts before day-zero config: outcomes, RACI, pilot scope, phases, and risks.",
  },
  {
    type: "feature-matrix",
    id: "plan-artifacts",
    title: "Must-have planning artifacts",
    rows: [
      {
        feature: "Written 90-day outcomes (≤3)",
        mustHave: true,
        niceToHave: false,
        notes: "Tied to reviews people already run.",
      },
      {
        feature: "Admin / ops owner with hours",
        mustHave: true,
        niceToHave: false,
        notes: "Fields, users, duplicates, permissions.",
      },
      {
        feature: "Business owner for stage honesty",
        mustHave: true,
        niceToHave: false,
        notes: "Sales or delivery lead — not IT alone.",
      },
      {
        feature: "Pilot segment + exit criteria",
        mustHave: true,
        niceToHave: false,
        notes: "Two clean weekly reviews from the board.",
      },
      {
        feature: "Phase list with dependencies",
        mustHave: true,
        niceToHave: false,
        notes: "Configure → migrate → pilot → expand.",
      },
      {
        feature: "Risk & readiness log",
        mustHave: true,
        niceToHave: false,
        notes: "Data quality, integrations, training gaps.",
      },
      {
        feature: "Vendor-provided Gantt as sole plan",
        mustHave: false,
        niceToHave: true,
        notes: "Useful input — never the only gate.",
      },
    ],
  },
  {
    type: "checklist",
    id: "planning-checklist",
    title: "Planning complete when…",
    copyable: true,
    items: [
      {
        id: "outcomes-written",
        label: "Three outcomes written and shared",
        description: "Sponsor + pilot lead agree on wording.",
        order: 0,
      },
      {
        id: "raci-named",
        label: "RACI named for fields, users, data, training",
        description: "One Accountable per row — not a committee.",
        order: 1,
      },
      {
        id: "pilot-frozen",
        label: "Pilot in/out list frozen",
        description: "Segment size and who stays on old tools.",
        order: 2,
      },
      {
        id: "exit-criteria",
        label: "Pilot exit criteria measurable",
        description: "Two clean Fridays / Mondays without side sheets.",
        order: 3,
      },
      {
        id: "phases-in-planner",
        label: "Phases entered in Implementation Planner",
        description: "Tasks, risks, and go-live checklist scaffolded.",
        order: 4,
      },
      {
        id: "cost-categories",
        label: "Cost categories listed for sponsor",
        description: "Link Cost / TCO calculators — no invented totals.",
        order: 5,
      },
    ],
  },
  {
    type: "step",
    id: "freeze-outcomes",
    stepNumber: 1,
    heading: "Freeze three 90-day outcomes",
    body: "Write outcomes as observable operating changes — shared board reviews, owned next steps, cleaner handoffs — not as product feature checklists. Share them with the sponsor and pilot lead until wording is stable.\n\nExample: Brightfield Partners, a 4-AE B2B sales pod plus one manager (Maya), freezes: (1) every open opportunity has owner + next-step date, (2) Tuesday pipeline reviews start from stuck deals on the board, (3) SDR→AE handoffs include context on the record. They reject “roll out forecasting AI” as an outcome because it does not change how Tuesday works.",
    tip: "If an outcome cannot be checked in a weekly review, it is not an implementation outcome yet.",
    figure: {
      src: "/guides/crm-implementation-planning-hero.png",
      alt: "CRM implementation planning hero: SaaS planning workspace with outcomes cards, RACI grid, and pilot scope panel.",
      caption:
        "Planning is a workspace of artifacts — outcomes and owners before fields.",
    },
    scenarios: [
      {
        title: "Sales pod",
        body: "Board trust + owned next steps + honest stages.",
      },
      {
        title: "Services delivery",
        body: "Account coverage + handoff checklist + next review date.",
      },
      {
        title: "Founder + first hire",
        body: "Shared pipeline so coverage survives vacation.",
      },
    ],
  },
  {
    type: "step",
    id: "name-raci",
    stepNumber: 2,
    heading: "Name RACI for the work that keeps CRM alive",
    body: "At minimum assign Responsible and Accountable for: field model, user/roles, data quality & duplicates, migration decisions, training, and weekly hygiene. Informed/Consulted lists can be short — avoid ownership by committee.\n\nExample: At Brightfield, ops coordinator Devon is Responsible for fields/users (~2–3 hrs/week). Maya is Accountable for stage honesty and review ritual. Founder Alex is Accountable for scope and budget gates. Each AE is Responsible for updating their own deals; nobody is “Accountable for CRM” as a vague shared duty.",
    tip: "If two people are Accountable for the same row, you have zero Accountable people.",
    scenarios: [
      {
        title: "Admin / ops",
        body: "Fields, permissions, duplicates, import hygiene.",
      },
      {
        title: "Business lead",
        body: "Stage definitions and review coaching.",
      },
      {
        title: "Sponsor",
        body: "Scope fights, pilot protection, expansion go/no-go.",
      },
    ],
  },
  {
    type: "step",
    id: "define-pilot",
    stepNumber: 3,
    heading: "Define pilot segment and exit criteria",
    body: "Pick a segment large enough to feel real and small enough to fix quickly. Write who is in, who stays on old tools, what data enters, and the exit criteria that unlock expansion.\n\nExample: Brightfield pilots Maya’s full 4-AE pod (≈60 open opportunities) and parks the customer-success team on existing trackers until two consecutive Tuesdays run from the board with zero side sheets and fewer than five overdue next steps. Exit criteria are written before Devon starts configuring stages.",
    tip: "“Everyone is in by end of month” is a calendar wish — not an exit criterion.",
    scenarios: [
      {
        title: "One manager’s team",
        body: "Natural coaching loop and shared stages.",
      },
      {
        title: "One territory / book",
        body: "Clear account boundaries for import scope.",
      },
      {
        title: "One workflow only",
        body: "New business first; renewals later.",
      },
    ],
  },
  {
    type: "step",
    id: "phase-the-work",
    stepNumber: 4,
    heading: "Phase the work and log risks",
    body: "List phases with dependencies: plan freeze → configure core loop → migrate pilot slice → train pilot → run hygiene gate → expand. Capture risks (dirty sources, missing admin hours, integration unknowns) with owners. Enter the scaffold in the Implementation Planner; use Timeline and Cost guides for ranges and categories.\n\nExample: Brightfield’s plan puts configure (roles, stages, sync) before import, blocks training until sample deals exist, and lists “Sheets have duplicate company names” as a risk owned by Devon with a dedupe pass before go-live of the pilot board. They refuse to schedule firm-wide training until the Tuesday gate passes.",
    tip: "A phase without an owner and a done-when statement is a wish, not a plan.",
    scenarios: [
      {
        title: "Dependencies first",
        body: "Do not train on empty pipelines.",
      },
      {
        title: "Risk log live",
        body: "Update weekly — do not bury issues in Slack.",
      },
      {
        title: "Handoffs written",
        body: "Migration → admin; admin → business lead for reviews.",
      },
    ],
  },
  {
    type: "step",
    id: "sponsor-go",
    stepNumber: 5,
    heading: "Get sponsor go / no-go before configuration",
    body: "Walk the sponsor through outcomes, RACI, pilot exit criteria, phase list, and cost categories (qualitative). Configuration starts only after go. If product choice is still open, pause and use CRM Finder — do not plan implementation for an undecided shortlist.\n\nExample: Alex signs the Brightfield plan in a 30-minute review: outcomes accepted, Devon’s hours protected on the calendar, pilot exit criteria printed. Only then does Devon open the sandbox and rename stages. Cost categories are listed with links to Cost and TCO calculators — no invented dollar totals in the memo.",
    tip: "Sponsor “interest” without protected admin hours is not a go decision.",
    scenarios: [
      {
        title: "Go",
        body: "Artifacts complete; hours on calendar; pilot frozen.",
      },
      {
        title: "Conditional go",
        body: "Fix one risk (e.g. admin hours) within a dated window.",
      },
      {
        title: "No-go",
        body: "Product still undecided or outcomes still feature-wishlists.",
      },
    ],
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "Planning mistakes that sink rollouts",
    items: [
      {
        title: "Starting in the product before outcomes exist",
        body: "You decorate a workspace nobody can evaluate.",
      },
      {
        title: "RACI by committee",
        body: "Shared “Accountable” means hygiene never has an owner.",
      },
      {
        title: "Pilot = whole company",
        body: "You lose the ability to fix the loop quickly.",
      },
      {
        title: "Vendor timeline as the only plan",
        body: "Week numbers without exit criteria become fake certainty.",
      },
      {
        title: "Skipping cost categories",
        body: "Sponsors later shock at admin time and migration effort.",
      },
      {
        title: "Planning while still choosing a vendor",
        body: "Implementation plans for three finalists waste cycles — shortlist first.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "What belongs in a CRM implementation plan?",
        answer:
          "Outcomes, RACI ownership, pilot scope and exit criteria, phased work with dependencies, risks, and cost categories. Decision rule: if those artifacts are missing, do not start day-zero configuration.",
      },
      {
        question: "How detailed should RACI be?",
        answer:
          "Detailed enough that fields, users, data quality, migration, training, and weekly hygiene each have one Accountable person. Avoid large Informed lists that create noise without ownership.",
      },
      {
        question: "How big should the pilot be?",
        answer:
          "Large enough that reviews feel real (a full pod or territory) and small enough that you can fix hygiene in days, not quarters. Write the in/out list explicitly.",
      },
      {
        question: "Should we use the vendor’s implementation methodology?",
        answer:
          "Use it as input for tasks and training assets. Keep your outcomes, RACI, and hygiene gates as the decision system — vendor week ranges are not guarantees.",
      },
      {
        question: "How do planning and timeline guides differ?",
        answer:
          "Planning freezes artifacts and owners. The Timeline guide translates phases into week ranges and sequencing. Use both; do not substitute a Gantt for outcomes.",
      },
      {
        question: "What if we lack an admin owner?",
        answer:
          "Treat that as a no-go risk. Implementation without protected admin hours almost always returns to spreadsheets — fix capacity before configuring.",
      },
      {
        question: "What should I do next?",
        answer:
          "Enter phases and risks in the CRM Implementation Planner, then use the Timeline and Cost guides. Return to the pillar Implementation Guide for the full journey.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related planning resources",
    links: [
      {
        href: "/guides/crm-implementation/",
        label: "CRM implementation guide",
        description: "Pillar journey: plan → pilot → expand.",
      },
      {
        href: "/guides/crm-implementation-timeline/",
        label: "Implementation timeline",
        description: "Phase week ranges and sequencing.",
      },
      {
        href: "/guides/crm-implementation-cost/",
        label: "Implementation cost",
        description: "Cost categories for the sponsor memo.",
      },
      {
        href: "/guides/crm-implementation-roles/",
        label: "Implementation roles",
        description: "Deeper ownership patterns.",
      },
      {
        href: "/guides/crm-requirements-guide/",
        label: "CRM requirements guide",
        description: "Freeze must-haves before plan.",
      },
      {
        href: "/guides/crm-data-migration/",
        label: "CRM data migration",
        description: "When the plan includes history.",
      },
      {
        href: "/tools/crm-implementation-planner/",
        label: "CRM Implementation Planner",
        description: "Phases, tasks, risks, checklist.",
      },
      {
        href: "/tools/crm-migration-planner/",
        label: "CRM Migration Planner",
        description: "Inventory and cutover planning.",
      },
      {
        href: "/tools/crm-tco-calculator/",
        label: "CRM TCO Calculator",
        description: "Ownership categories beyond seats.",
      },
      {
        href: "/tools/crm-cost-calculator/",
        label: "CRM Cost Calculator",
        description: "Qualifying subscription bands.",
      },
      {
        href: "/tools/crm-finder/",
        label: "CRM Finder",
        description: "Shortlist if product is still open.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "planner-cta",
    title: "Scaffold the plan in a planner",
    body: "Turn outcomes, pilot scope, and risks into phases and tasks with the CRM Implementation Planner — transparent planning rules, not invented vendor guarantees.",
    href: "/tools/crm-implementation-planner/",
    ctaLabel: "Build implementation plan →",
    variant: "finder",
  },
];

export const crmImplementationPlanningGuide: GuidePage = {
  id: "guide-crm-implementation-planning",
  slug: "crm-implementation-planning",
  title: "Plan CRM Implementation: Outcomes, Owners, Pilot",
  summary:
    "Plan CRM rollout by freezing outcomes, RACI ownership, pilot exit criteria, and phased work before configuration — so go-live is gated on evidence, not wishful calendars.",
  categorySlugs: ["crm"],
  productSlugs: [],
  topicType: "implementation",
  journeyStage: "implement",
  knowledgeAreaSlug: "implementation",
  heroVisual: {
    src: "/guides/crm-implementation-planning-hero.png",
    alt: "CRM implementation planning hero: SaaS planning workspace with outcomes cards, RACI grid, and pilot scope panel.",
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
    label: "Build an implementation plan",
  },
  relatedGuideSlugs: [
    "crm-implementation",
    "crm-implementation-timeline",
    "crm-implementation-cost",
    "crm-implementation-roles",
    "crm-implementation-mistakes",
    "crm-requirements-guide",
    "crm-data-migration",
    "crm-go-live",
  ],
  blocks: crmImplementationPlanningBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "outcomes-raci",
      label: "Freeze outcomes and RACI",
      description: "Three goals; named admin and business owners.",
      order: 0,
    },
    {
      id: "pilot-exit",
      label: "Freeze pilot segment and exit criteria",
      description: "In/out list; two clean weekly reviews.",
      order: 1,
    },
    {
      id: "phases-sponsor",
      label: "Phase plan + sponsor go",
      description: "Then configure — not before.",
      order: 2,
    },
  ],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: {
    status: "published",
    updatedAt: "2026-08-14T10:15:00.000Z",
    publishedAt: "2026-08-14T10:15:00.000Z",
    reviewedAt: "2026-08-14T10:15:00.000Z",
    researchStatus: "complete",
    seoStatus: "optimized",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title:
      "Plan CRM Implementation: Outcomes, Owners, Pilot | SoftwareGlimpse",
    description:
      "Plan CRM implementation with outcomes, RACI, pilot exit criteria, and phased work before day-zero configuration.",
    canonicalPath: "/guides/crm-implementation-planning/",
    indexable: true,
  },
};
