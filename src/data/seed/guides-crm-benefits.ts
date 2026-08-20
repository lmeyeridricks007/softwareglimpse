import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * CRM benefits — outcomes by role and stage (no invented ROI dollars).
 * Template: softwareglimpse-guide-template-v1
 */
const crmBenefitsBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "CRM benefits show up as operational results: shared ownership, fewer dropped follow-ups, live pipeline reviews, cleaner handoffs, and reporting without weekly spreadsheet rebuilds. Decision rule: if the team will not maintain owners, stages, and history, those benefits will not appear — buy process discipline first, then the tool.",
    bullets: [
      "Shared ownership",
      "Follow-up reliability",
      "Pipeline visibility",
      "Handoff continuity",
      "Reporting without sheets",
      "Process consistency",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Benefits are team outcomes",
        body: "CRM value shows up as fewer lost deals from neglect, clearer weekly reviews, and less “who owns this?” — not as a magic feature list.",
      },
      {
        label: "Adoption unlocks benefits",
        body: "An unused CRM delivers no benefit. Training, ownership rules, and stage discipline matter as much as the vendor.",
      },
      {
        label: "Different roles feel different wins",
        body: "Reps want less admin friction; managers want forecast clarity; success wants history; marketing wants clean handoffs.",
      },
      {
        label: "No invented ROI theater",
        body: "Ignore vague “increase revenue by X%” claims without a measurement method tied to your process.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "benefit-path",
    title: "Where CRM benefits come from",
    steps: [
      { id: "capture", label: "Capture", short: "Leads enter one place" },
      { id: "own", label: "Own", short: "Clear follow-up owner" },
      { id: "advance", label: "Advance", short: "Visible stages" },
      { id: "history", label: "History", short: "Context for handoffs" },
      { id: "review", label: "Review", short: "Honest pipeline view" },
      { id: "improve", label: "Improve", short: "Fix process gaps" },
    ],
    ctaHref: "/guides/how-to-choose-crm/",
    ctaLabel: "How to choose a CRM →",
    figure: {
      src: "/guides/crm-benefits-path.png",
      alt: "Benefit path from capture through ownership, stages, history, review, and improvement.",
      caption: "CRM benefits show up when each step reduces reconstruction work for the team.",
    },
  },
  {
    type: "figure",
    id: "before-after",
    title: "Before vs after a working CRM",
    src: "/guides/crm-benefits-hero.png",
    alt: "Before CRM chaos with scattered notes versus after CRM with organized pipeline and shared team context.",
    caption: "Benefits appear when the team trusts one system of record.",
  },
  {
    type: "figure",
    id: "week-example-visual",
    title: "A week without vs with CRM",
    src: "/guides/crm-benefits-week-example.png",
    alt: "Worked example comparing one team week without CRM versus with a maintained CRM system of record.",
    caption:
      "Worked example: the benefit is a quieter week — fewer reconstruction tasks — when owners, stages, and history stay current.",
  },
  {
    type: "step",
    id: "benefits-by-role",
    stepNumber: 1,
    heading: "CRM benefits by role",
    body: "A useful CRM helps different jobs without forcing everyone into the same workflow. The shared layer is customer and deal context; the benefit is less reconstruction work.\n\nExample: on a 6-person B2B team, Maya (AE) opens a deal and sees Jordan’s discovery notes; Priya (manager) runs Friday review from live stages instead of Slack pings; Sam (CS) inherits the closed-won account with commitments already attached. Same records — different jobs get quieter weeks.",
    tip: "Ask each role what they stop doing manually if the CRM is trustworthy — that is your benefit hypothesis.",
    figure: {
      src: "/guides/crm-benefits-by-role.png",
      alt: "CRM benefits for sales, managers, customer success, and marketing around a shared hub.",
      caption: "Same system — different outcomes by role.",
    },
    scenarios: [
      {
        title: "Sales reps",
        body: "Next steps and history live with the deal; less hunting through email to remember context.",
      },
      {
        title: "Managers",
        body: "Pipeline reviews use live stages and owners instead of last-minute spreadsheet rebuilds.",
      },
      {
        title: "Customer success / account",
        body: "Handoffs include prior conversations and commitments — not a blank slate.",
      },
      {
        title: "Marketing",
        body: "Lead status and ownership are visible after handoff, reducing “black hole” complaints.",
      },
    ],
  },
  {
    type: "step",
    id: "pain-to-outcome",
    stepNumber: 2,
    heading: "Common pains CRM is meant to remove",
    body: "Most teams buy CRM after a pattern of operational failures — not because a brochure promised transformation. Mapping pain → outcome keeps evaluation honest.\n\nExample: before CRM, that same team lost two warm leads because follow-ups lived only in Maya’s inbox while she was out. After CRM, every open deal has an owner and a next-step task visible to the team — the pain (dropped follow-up) maps to a concrete outcome (shared, visible next actions).",
    figure: {
      src: "/guides/crm-benefits-outcomes.png",
      alt: "Three CRM outcome paths: follow-ups, shared ownership, and pipeline visibility.",
      caption: "Benefit claims should map to a concrete operational pain.",
    },
    scenarios: [
      {
        title: "Dropped follow-ups",
        body: "Tasks and reminders attached to deals reduce “I forgot to reply” losses.",
      },
      {
        title: "Spreadsheet drift",
        body: "Shared ownership and stage updates replace conflicting personal lists.",
      },
      {
        title: "Blind pipeline",
        body: "Stage visibility makes weekly coaching possible without surprise end-of-month chaos.",
      },
    ],
  },
  {
    type: "size-match",
    id: "when-benefits-show",
    title: "When benefits usually show up",
    figure: {
      src: "/guides/crm-benefits-when.png",
      alt: "Timeline of when CRM benefits typically appear from week one through the first quarter by team size.",
      caption: "Shared ownership shows early; forecast trust usually takes longer.",
    },
    tiers: [
      {
        id: "solo",
        label: "Solo operator",
        description:
          "Benefits are modest until volume or memory load rises — a simple structure may be enough.",
        fitHints: ["Light tracking", "Personal discipline"],
      },
      {
        id: "small-team",
        label: "2–10 person sales team",
        description:
          "Shared ownership and follow-up reliability are usually the first clear wins.",
        fitHints: ["Weekly review", "Clear owners"],
      },
      {
        id: "scaling",
        label: "Scaling org",
        description:
          "Handoffs, reporting, and permissioned access become the high-value benefits.",
        fitHints: ["Managers + reps", "Integrations"],
      },
      {
        id: "complex",
        label: "Multi-team / regulated",
        description:
          "Governance, auditability, and process consistency dominate the benefit case.",
        fitHints: ["Security", "Cross-team workflows"],
      },
    ],
  },
  {
    type: "feature-matrix",
    id: "benefit-vs-feature",
    title: "Benefit vs feature checklist",
    figure: {
      src: "/guides/crm-benefits-vs-feature.png",
      alt: "Side-by-side checklist mapping buyer benefits to the product features that enable them.",
      caption: "Buy the benefit — then require the feature that makes it real.",
    },
    rows: [
      {
        feature: "Fewer missed follow-ups",
        mustHave: true,
        niceToHave: false,
        notes: "Needs tasks + ownership",
      },
      {
        feature: "Shared deal history",
        mustHave: true,
        niceToHave: false,
        notes: "Needs activity logging",
      },
      {
        feature: "Honest pipeline reviews",
        mustHave: true,
        niceToHave: false,
        notes: "Needs stage discipline",
      },
      {
        feature: "AI “insights” demos",
        mustHave: false,
        niceToHave: true,
        notes: "Not a day-one benefit",
      },
      {
        feature: "Vanity dashboards nobody opens",
        mustHave: false,
        niceToHave: true,
        notes: "Not a real benefit",
      },
    ],
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "Benefit traps",
    items: [
      {
        title: "Buying for aspirational benefits",
        body: "If the team will not update deals weekly, forecast benefits will not appear.",
      },
      {
        title: "Confusing vendor ROI claims with your reality",
        body: "Percent-lift marketing is not evidence for your process, team size, or data quality.",
      },
      {
        title: "Ignoring change cost",
        body: "Migration, training, and dual running can delay benefits for months — plan for that.",
      },
      {
        title: "Measuring only license cost",
        body: "Under-adoption wastes more money than a slightly more expensive tool the team uses.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "What are the main benefits of CRM?",
        answer:
          "Operational ones: shared ownership of contacts and deals, fewer dropped follow-ups, live pipeline visibility, cleaner handoffs, and reporting that does not require rebuilding spreadsheets every week. Those only appear when the team maintains the system of record.",
      },
      {
        question: "What is the biggest benefit of CRM?",
        answer:
          "For most sales teams: a trusted shared view of who owns each relationship, what stage deals are in, and what happened last.",
      },
      {
        question: "Will CRM automatically increase revenue?",
        answer:
          "Not by itself. It can reduce lost follow-ups and improve coaching visibility — revenue impact depends on process and adoption. Treat vague “X% revenue lift” claims without a measurement method as marketing, not evidence.",
      },
      {
        question: "How soon should we see benefits?",
        answer:
          "Shared ownership and follow-up reliability can appear within weeks if logging norms stick. Forecast quality usually takes longer — after stages and close dates are consistently maintained.",
      },
      {
        question: "What should I read next?",
        answer:
          "Review CRM examples for concrete scenarios, then How to Choose a CRM — or estimate cost with the CRM Cost Calculator.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related CRM resources",
    links: [
      {
        href: "/guides/crm-examples/",
        label: "CRM examples",
        description: "Concrete scenarios by team type.",
      },
      {
        href: "/guides/how-crm-works/",
        label: "How CRM works",
        description: "The operating model behind the benefits.",
      },
      {
        href: "/guides/what-is-crm/",
        label: "What is CRM?",
        description: "Foundational definition.",
      },
      {
        href: "/guides/do-i-need-a-crm/",
        label: "Do I need a CRM?",
        description: "Check the benefits apply to you.",
      },
      {
        href: "/guides/crm-roi-guide/",
        label: "CRM ROI guide",
        description: "Turn benefits into defensible value.",
      },
      {
        href: "/tools/crm-requirements-builder/",
        label: "Requirements Builder",
        description: "Convert benefits into must-haves.",
      },
      {
        href: "/tools/crm-cost-calculator/",
        label: "CRM Cost Calculator",
        description: "Estimate team cost from researched pricing.",
      },
      {
        href: "/tools/crm-finder/",
        label: "CRM Finder",
        description: "Shortlist from structured answers.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "finder-cta",
    title: "Turn benefits into a buying brief",
    body: "If the benefits above match your pains, use CRM Finder to map requirements to researched products — rankings ignore affiliate commissions.",
    href: "/tools/crm-finder/",
    ctaLabel: "Find My CRM →",
    variant: "finder",
  },
];

export const crmBenefitsGuide: GuidePage = {
  id: "guide-crm-benefits",
  slug: "crm-benefits",
  title: "CRM Benefits: What Teams Actually Gain",
  summary:
    "See the practical benefits of CRM software for sales, managers, success, and marketing — shared ownership, follow-ups, pipeline visibility, and handoffs — without invented ROI percentages.",
  categorySlugs: ["crm"],
  productSlugs: [],
  topicType: "fundamental",
  journeyStage: "learn",
  knowledgeAreaSlug: "fundamentals",
  heroVisual: {
    src: "/guides/crm-benefits-hero.png",
    alt: "Before CRM chaos versus after CRM with organized pipeline and shared team context.",
  },
  supports: [
    {
      contentId: "content:category:crm",
      relationType: "supports-anchor",
      primary: true,
    },
    {
      contentId: "content:best:crm-software",
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
    contentId: "content:tool:crm-finder",
    label: "Try the CRM Finder",
  },
  relatedGuideSlugs: [
    "what-is-crm",
    "how-crm-works",
    "crm-examples",
    "do-i-need-a-crm",
    "crm-roi-guide",
    "when-to-adopt-crm",
    "how-to-choose-crm",
  ],
  blocks: crmBenefitsBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "pains",
      label: "List top operational pains",
      description: "Follow-ups, ownership, visibility, handoffs.",
      order: 0,
    },
    {
      id: "roles",
      label: "Map benefits by role",
      description: "Rep, manager, success, marketing.",
      order: 1,
    },
    {
      id: "adoption",
      label: "Name adoption requirements",
      description: "Who updates deals, and how often?",
      order: 2,
    },
  ],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: {
    status: "published",
    updatedAt: "2026-08-14T08:00:00.000Z",
    publishedAt: "2026-08-14T08:00:00.000Z",
    reviewedAt: "2026-08-14T08:00:00.000Z",
    researchStatus: "complete",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title: "CRM Benefits for Sales Teams | SoftwareGlimpse",
    description:
      "Practical CRM benefits — ownership, follow-ups, pipeline visibility, and handoffs — explained without invented ROI claims.",
    canonicalPath: "/guides/crm-benefits/",
    indexable: true,
  },
};
