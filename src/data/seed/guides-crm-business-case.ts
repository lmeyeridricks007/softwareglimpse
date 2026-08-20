import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * CRM Business Case — write the memo approvers actually need.
 * Template: softwareglimpse-guide-template-v1
 */
const crmBusinessCaseBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "A CRM business case is a short decision memo: problem, 90-day outcomes, options considered, evaluation evidence, cost categories, risks, and a single ask. Decision rule: do not send the memo until scores and diligence notes exist; a preference paragraph is not a business case.",
    bullets: [
      "Problem",
      "Outcomes",
      "Options",
      "Evidence",
      "Costs",
      "Ask",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "One ask",
        body: "Approvers need a decision, not a tour of the market.",
      },
      {
        label: "Evidence over enthusiasm",
        body: "Scorecard + trial notes beat adjectives.",
      },
      {
        label: "Costs as categories",
        body: "Calculator band + time/change lines; no fake totals.",
      },
      {
        label: "Risks named",
        body: "Adoption, admin capacity, exit, plan gates.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "memo-path",
    title: "Business case memo path",
    steps: [
      { id: "problem", label: "Problem", short: "Why now" },
      { id: "outcomes", label: "Outcomes", short: "90-day" },
      { id: "options", label: "Options", short: "2–3 + status quo" },
      { id: "evidence", label: "Evidence", short: "Scores" },
      { id: "ask", label: "Ask", short: "Decision" },
    ],
    ctaHref: "/guides/crm-selection-process/",
    ctaLabel: "Selection process →",
  },
  {
    type: "figure",
    id: "memo-outline",
    title: "Memo outline",
    src: "/guides/crm-business-case-outline.png",
    alt: "Seven-section CRM business case outline with owners for Evidence and Costs appendices.",
    caption:
      "Keep the body to one or two pages; put scorecards and Calculator screenshots in appendices.",
  },
  {
    type: "step",
    id: "write-core",
    stepNumber: 1,
    heading: "Write problem, outcomes, and options",
    body: "Open with the operating problem and why spreadsheets/status quo fail the 90-day outcomes. List options: status quo, finalist A, finalist B (from Finder shortlist). State recommendation only after evidence.\n\nExample: a 7-person boutique consultancy writes: problem = founder rebuilds pipeline from chats weekly; outcomes = owner SLA + Friday board + handoff notes; options = stay on sheets, Tool A, Tool B.",
    tip: "Include status quo as an option. It forces honest tradeoffs.",
    figure: {
      src: "/guides/crm-business-case-hero.png",
      alt: "CRM business case hero: memo sections to Ask.",
      caption:
        "The memo is the Decide gate artifact — not a marketing one-pager.",
    },
    scenarios: [
      {
        title: "Buyer",
        body: "Wants risk and cost clarity.",
      },
      {
        title: "Users",
        body: "Need adoption reality from trial.",
      },
      {
        title: "Finance",
        body: "Needs categories and plan posture, not vibes.",
      },
    ],
  },
  {
    type: "step",
    id: "evidence-costs-ask",
    stepNumber: 2,
    heading: "Attach evidence, costs, risks, and the ask",
    body: "Paste weighted scores, demo/trial notes, and diligence answers (exit, support, plan gates). Summarize TCO categories and Calculator subscription band. End with: recommended tool, who owns rollout, success checks at 30 days, and approval requested.\n\nExample: the consultancy recommends Tool B with ops as admin owner, cites non-admin trial scores, lists unknown partner fees as “none planned,” and asks founder to approve a qualifying annual plan after order-form review.",
    tip: "If diligence is incomplete, the ask is “approve trial extension / security review,” not “sign now.”",
    scenarios: [
      {
        title: "Approve buy",
        body: "Scores + diligence + owners ready.",
      },
      {
        title: "Approve next gate",
        body: "More security or reference calls needed.",
      },
      {
        title: "Reject / pause",
        body: "Admin capacity missing — fix readiness first.",
      },
    ],
  },
  {
    type: "checklist",
    id: "memo-checklist",
    title: "Business case section checklist",
    copyable: true,
    items: [
      { id: "problem", label: "Problem & why now", order: 0 },
      { id: "outcomes", label: "Three 90-day outcomes", order: 1 },
      {
        id: "options",
        label: "Options including status quo",
        order: 2,
      },
      { id: "evidence", label: "Scorecard + trial notes", order: 3 },
      {
        id: "costs",
        label: "TCO categories + Calculator band",
        order: 4,
      },
      { id: "risks", label: "Risks & mitigations", order: 5 },
      {
        id: "ask",
        label: "Single ask + rollout owners",
        order: 6,
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "How long should a CRM business case be?",
        answer:
          "One to two pages plus appendices. Decision rule: if an approver cannot find the ask in 30 seconds, rewrite.",
      },
      {
        question: "Do I need ROI percentages?",
        answer:
          "No. Use the ROI Guide’s baseline logic. Invented % weaken the memo.",
      },
      {
        question: "Who should write it?",
        answer:
          "The Accountable decider’s delegate (often ops/founder) with scorers contributing evidence.",
      },
      {
        question: "What if two tools score closely?",
        answer:
          "Document the tradeoff and the tie-break (constraint, admin load, exit clarity) — do not invent a ranking.",
      },
      {
        question: "What should I do next?",
        answer:
          "Complete selection-process Decide gate, then vendor evaluation items still open before signature.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related CRM resources",
    links: [
      {
        href: "/guides/crm-roi-guide/",
        label: "CRM ROI guide",
        description: "Benefit logic without fake %.",
      },
      {
        href: "/guides/crm-total-cost-guide/",
        label: "CRM total cost guide",
        description: "Cost categories.",
      },
      {
        href: "/guides/crm-evaluation-guide/",
        label: "CRM evaluation guide",
        description: "Score evidence.",
      },
      {
        href: "/guides/crm-selection-process/",
        label: "CRM selection process",
        description: "Decide gate.",
      },
      {
        href: "/guides/crm-pricing-guide/",
        label: "CRM pricing guide",
        description: "Plan literacy.",
      },
      {
        href: "/tools/crm-cost-calculator/",
        label: "CRM Cost Calculator",
        description: "Subscription appendix.",
      },
      {
        href: "/tools/crm-tco-calculator/",
        label: "CRM TCO Calculator",
        description: "Ownership categories for the memo.",
      },
      {
        href: "/tools/crm-finder/",
        label: "CRM Finder",
        description: "Constrained options.",
      },
      {
        href: "/tools/crm-requirements-builder/",
        label: "Requirements Builder",
        description: "Scope appendix for the memo.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "finder-cta",
    title: "Keep options constrained",
    body: "Use CRM Finder so the memo compares a short, researched list — not an endless market tour.",
    href: "/tools/crm-finder/",
    ctaLabel: "Find My CRM →",
    variant: "finder",
  },
];

export const crmBusinessCaseGuide: GuidePage = {
  id: "guide-crm-business-case",
  slug: "crm-business-case",
  title: "CRM Business Case: Write the Memo Approvers Actually Need",
  summary:
    "Structure a CRM business case — problem, outcomes, options, evidence, costs, risks, and ask — without fake ROI percentages or affiliate rankings.",
  categorySlugs: ["crm"],
  productSlugs: [],
  topicType: "selection",
  journeyStage: "choose",
  knowledgeAreaSlug: "selection",
  heroVisual: {
    src: "/guides/crm-business-case-hero.png",
    alt: "CRM business case hero: one-page memo sections from Problem through Ask with signature line.",
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
    "crm-roi-guide",
    "crm-total-cost-guide",
    "crm-pricing-guide",
    "crm-selection-process",
    "crm-evaluation-guide",
    "crm-requirements-guide",
    "crm-vendor-evaluation",
    "how-to-choose-crm",
  ],
  blocks: crmBusinessCaseBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "ask",
      label: "State a single clear ask",
      description: "Tool + plan posture + owners.",
      order: 0,
    },
    {
      id: "evidence",
      label: "Attach scorecard + diligence notes",
      description: "Not demo vibes.",
      order: 1,
    },
    {
      id: "costs",
      label: "Include TCO categories + Calculator band",
      description: "No invented fees.",
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
    title:
      "CRM Business Case: Memo Approvers Actually Need | SoftwareGlimpse",
    description:
      "Write a CRM business case memo: problem, outcomes, options, trial evidence, cost categories, risks, and a clear ask.",
    canonicalPath: "/guides/crm-business-case/",
    indexable: true,
  },
};
