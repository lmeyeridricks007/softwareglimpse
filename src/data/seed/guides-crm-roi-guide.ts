import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * CRM ROI Guide — justify value without fake percentages.
 * Template: softwareglimpse-guide-template-v1
 */
const crmRoiGuideBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "CRM ROI is the gap between today’s messy operating cost (dropped leads, rebuilds, missed handoffs) and a system that makes your 90-day outcomes observable — not a vendor slide with a made-up percentage. Decision rule: if you cannot name a baseline metric and an after-CRM check for each benefit claim, delete the claim; never invent ROI % or revenue uplift.",
    bullets: [
      "Baselines first",
      "Outcome-tied benefits",
      "Cost categories known",
      "No fake %",
      "Evidence from trial",
      "Memo-ready",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Operational ROI is enough",
        body: "Faster logging and cleaner boards are valid without fantasy revenue math.",
      },
      {
        label: "Baselines make benefits real",
        body: "“We rebuild pipeline in spreadsheets each Friday” is a cost you can describe.",
      },
      {
        label: "Trial supplies evidence",
        body: "Time-to-complete tasks beats brochure claims.",
      },
      {
        label: "ROI ≠ business case alone",
        body: "ROI logic feeds the memo; the Business Case guide structures approval.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "roi-path",
    title: "Honest ROI path",
    steps: [
      { id: "baseline", label: "Baseline", short: "Today’s pain" },
      { id: "outcomes", label: "Outcomes", short: "90-day checks" },
      { id: "benefits", label: "Benefits", short: "Tied claims" },
      { id: "costs", label: "Costs", short: "TCO categories" },
      { id: "review", label: "Review", short: "After go-live" },
    ],
    ctaHref: "/guides/crm-business-case/",
    ctaLabel: "Business case →",
  },
  {
    type: "figure",
    id: "roi-logic",
    title: "ROI logic without fake math",
    src: "/guides/crm-roi-guide-logic.png",
    alt: "Flow from baseline pains to 90-day outcomes to benefit hypotheses to cost categories to go-live review checks.",
    caption:
      "Every benefit arrow must start from a baseline you can observe today.",
  },
  {
    type: "step",
    id: "baseline-benefits",
    stepNumber: 1,
    heading: "Write baselines, then benefit hypotheses",
    body: "Describe today’s failure modes in plain language. Convert each 90-day outcome into a benefit hypothesis (“inbound leads get owners same day → fewer cold follow-ups lost”). Keep revenue claims out unless you already track conversion with trustworthy data.\n\nExample: a 12-person B2B advisory team baselines: leads sit in a shared inbox; Friday pipeline is a rebuilt sheet; delivery asks for context in Slack. Benefit hypotheses: owner field SLA, board replaces rebuild, handoff note required before “won.”",
    tip: "One honest baseline beats three speculative revenue uplifts.",
    figure: {
      src: "/guides/crm-roi-guide-hero.png",
      alt: "CRM ROI hero: outcomes vs cost categories on a scale.",
      caption:
        "ROI is a comparison of operating realities — not a badge percentage.",
    },
    scenarios: [
      {
        title: "Time back",
        body: "Minutes saved on logging and weekly rebuilds.",
      },
      {
        title: "Leak reduction",
        body: "Fewer unowned leads past SLA.",
      },
      {
        title: "Handoff quality",
        body: "Fewer delivery rework loops.",
      },
    ],
  },
  {
    type: "step",
    id: "evidence-and-review",
    stepNumber: 2,
    heading: "Attach evidence and a post-go-live review",
    body: "Pull task times from the trial scorecard and subscription bands from the Cost Calculator. Schedule a 30-day review against the same outcome checks. If a vendor ROI calculator shows a large percentage with no inputs you recognize, discard it.\n\nExample: after trial, sellers complete log-activity faster on Tool B; the team cites that evidence in the memo instead of a “3× pipeline visibility” slogan.",
    tip: "Put “unknown” next to any benefit you cannot measure yet — credibility rises.",
    scenarios: [
      {
        title: "Weak ROI story",
        body: "Only vendor % slides, no baselines.",
      },
      {
        title: "Strong ROI story",
        body: "Baselines + trial times + TCO categories.",
      },
      {
        title: "After go-live",
        body: "Re-check outcomes; adjust process, not mythology.",
      },
    ],
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "ROI mistakes",
    items: [
      {
        title: "Inventing uplift percentages",
        body: "Unverifiable numbers destroy trust with finance.",
      },
      {
        title: "Counting benefits twice",
        body: "Same outcome described as time and revenue without linkage.",
      },
      {
        title: "Ignoring adoption risk",
        body: "ROI assumes sellers actually log — usability matters.",
      },
      {
        title: "Stopping at purchase",
        body: "Without a review date, claims never get tested.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "How do I calculate CRM ROI?",
        answer:
          "Compare named baselines and outcome checks to cost categories (subscription via Calculator, time/change qualitatively or via quotes). Decision rule: no claim without a baseline and a review method — never invent ROI %.",
      },
      {
        question: "What if leadership wants a percentage?",
        answer:
          "Offer a sensitivity range only when inputs are real (seat estimate, measured hours). Otherwise show operational ROI and refuse fabricated precision.",
      },
      {
        question: "Is softer “visibility” a valid benefit?",
        answer:
          "Yes if you define the Friday check that proves it (board used vs sheet rebuild).",
      },
      {
        question: "Where does pricing fit?",
        answer:
          "Costs come from Pricing + Total Cost guides and the Calculator; benefits come from outcomes and trial evidence.",
      },
      {
        question: "What should I do next?",
        answer:
          "Fold this logic into the Business Case memo and keep Finder/Calculator links for appendices.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related CRM resources",
    links: [
      {
        href: "/guides/crm-business-case/",
        label: "CRM business case",
        description: "Approval memo structure.",
      },
      {
        href: "/guides/crm-total-cost-guide/",
        label: "CRM total cost guide",
        description: "Cost categories.",
      },
      {
        href: "/guides/crm-pricing-guide/",
        label: "CRM pricing guide",
        description: "Plan and seat literacy.",
      },
      {
        href: "/guides/crm-requirements-guide/",
        label: "CRM requirements guide",
        description: "Outcomes source.",
      },
      {
        href: "/guides/crm-benefits/",
        label: "CRM benefits",
        description: "Benefit categories to measure.",
      },
      {
        href: "/guides/how-to-choose-crm/",
        label: "How to choose a CRM",
        description: "Selection frame around the numbers.",
      },
      {
        href: "/tools/crm-cost-calculator/",
        label: "CRM Cost Calculator",
        description: "Subscription bands.",
      },
      {
        href: "/tools/crm-tco-calculator/",
        label: "CRM TCO Calculator",
        description: "Ownership cost for the ROI frame.",
      },
      {
        href: "/tools/crm-finder/",
        label: "CRM Finder",
        description: "Shortlist context.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "calculator-cta",
    title: "Ground ROI in a real cost estimate",
    body: "Pair outcome-based benefits with Cost Calculator subscription bands — still no invented ROI percentages.",
    href: "/tools/crm-cost-calculator/",
    ctaLabel: "Open Cost Calculator →",
    variant: "calculator",
  },
];

export const crmRoiGuide: GuidePage = {
  id: "guide-crm-roi-guide",
  slug: "crm-roi-guide",
  title: "CRM ROI Guide: Justify Value Without Fake Percentages",
  summary:
    "Frame CRM return as observable operational gains tied to 90-day outcomes — time saved, fewer dropped leads, cleaner forecasts — without inventing ROI percentages.",
  categorySlugs: ["crm"],
  productSlugs: [],
  topicType: "selection",
  journeyStage: "choose",
  knowledgeAreaSlug: "selection",
  heroVisual: {
    src: "/guides/crm-roi-guide-hero.png",
    alt: "CRM ROI guide hero: balance scale with outcomes on one side and cost categories on the other — no percent badges.",
  },
  supports: [
    {
      contentId: "content:category:crm",
      relationType: "supports-anchor",
      primary: true,
    },
    {
      contentId: "content:tool:crm-cost-calculator",
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
    contentId: "content:tool:crm-cost-calculator",
    label: "Open Cost Calculator",
  },
  relatedGuideSlugs: [
    "crm-business-case",
    "crm-total-cost-guide",
    "crm-pricing-guide",
    "crm-requirements-guide",
    "crm-benefits",
    "crm-vendor-evaluation",
    "how-to-choose-crm",
  ],
  blocks: crmRoiGuideBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "outcomes",
      label: "Tie ROI claims to 90-day outcomes",
      description: "Observable weekly checks only.",
      order: 0,
    },
    {
      id: "baselines",
      label: "Write current-state baselines",
      description: "How work happens today.",
      order: 1,
    },
    {
      id: "no-fake-pct",
      label: "Ban invented ROI %",
      description: "Use ranges only with real inputs.",
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
    title: "CRM ROI Guide: Value Without Fake Percentages | SoftwareGlimpse",
    description:
      "Build a CRM ROI narrative from 90-day outcomes and cost categories — no invented ROI percentages or dollar totals.",
    canonicalPath: "/guides/crm-roi-guide/",
    indexable: true,
  },
};
