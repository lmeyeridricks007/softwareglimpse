import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * Sales Intelligence ROI Guide — formulas/inputs only; no invented dollar claims.
 * Template: softwareglimpse-guide-template-v1
 */
const salesIntelligenceRoiGuideBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Sales intelligence ROI is the gap between today’s prospecting operating cost (list rebuilds, bad unlocks, CRM gaps, missed follow-ups) and a system that makes your 90-day outcomes observable — not a vendor slide with a made-up percentage or dollar uplift. Decision rule: if you cannot name a baseline metric and an after-SI check for each benefit claim, delete the claim; teach formulas and inputs only — never invent ROI % or revenue dollars.",
    bullets: [
      "Baselines first",
      "Outcome-tied benefits",
      "Cost categories known",
      "Formulas & inputs only",
      "Evidence from trial",
      "No fake $ or %",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Operational ROI is enough",
        body: "Faster list build and cleaner CRM landing are valid without fantasy revenue math.",
      },
      {
        label: "Baselines make benefits real",
        body: "“We rebuild ICP lists every Monday in Sheets” is a cost you can describe.",
      },
      {
        label: "Formulas need your inputs",
        body: "Hours saved × loaded cost is a method — plug your numbers; we do not invent them.",
      },
      {
        label: "Trial supplies evidence",
        body: "Coverage hit rate and task times beat brochure claims.",
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
    ctaHref: "/guides/sales-intelligence-total-cost-guide/",
    ctaLabel: "Total cost →",
    figure: {
      src: "/guides/sales-intelligence-roi-guide-logic.png",
      alt: "Flow from baseline pains to 90-day outcomes to benefit hypotheses to cost category inputs to go-live review — no percent badges.",
      caption:
        "Every benefit arrow must start from a baseline you can observe today.",
    },
  },
  {
    type: "figure",
    id: "roi-logic",
    title: "ROI logic without fake math",
    src: "/guides/sales-intelligence-roi-guide-logic.png",
    alt: "SI ROI logic diagram: baselines, outcome checks, benefit hypotheses, TCO input categories, and post-go-live review — formulas only.",
    caption:
      "Use formulas and your inputs — never ship an invented dollar ROI total.",
  },
  {
    type: "step",
    id: "baseline-benefits",
    stepNumber: 1,
    heading: "Write baselines, then benefit hypotheses",
    body: "Describe today’s failure modes in plain language. Convert each 90-day outcome into a benefit hypothesis (“ICP list rebuild drops from weekly sheet to SI saved view → fewer hours”). Keep revenue claims out unless you already track conversion with trustworthy data.\n\nExample: a 10-person B2B outbound team baselines: Monday list rebuilds; 1-in-N unlocks bounce; CRM missing mobiles after export. Benefit hypotheses: rebuild time down, bounce handling owned, CRM landing rate up — each with a Friday check.",
    tip: "One honest baseline beats three speculative pipeline uplifts.",
    figure: {
      src: "/guides/sales-intelligence-roi-guide-hero.png",
      alt: "Sales intelligence ROI hero: balance scale with observable outcomes on one side and TCO input categories on the other — no dollar or percent badges.",
      caption:
        "ROI is a comparison of operating realities — not a badge percentage.",
    },
    scenarios: [
      {
        title: "Time back",
        body: "Hours saved on list build and enrichment (your measured hours).",
      },
      {
        title: "Waste reduction",
        body: "Fewer failed reveals and sheet dual-runs.",
      },
      {
        title: "CRM hygiene",
        body: "Higher share of unlocks landing with owners.",
      },
    ],
  },
  {
    type: "step",
    id: "formulas-and-review",
    stepNumber: 2,
    heading: "Use formulas with your inputs — then schedule a review",
    body: "Teaching formulas (plug your numbers; we do not invent results):\n• Time value ≈ (hours saved per week) × (loaded hourly cost you use internally) × weeks in period\n• Credit efficiency ≈ (usable contacts landed in CRM) ÷ (credits consumed) — track as a ratio, not a vendor accuracy claim\n• Net operating change ≈ (benefit categories you can evidence) − (TCO categories from quotes + time notes)\n\nPull task times and coverage notes from the trial scorecard. Schedule a 30-day review against the same outcome checks. Discard vendor ROI calculators that show large percentages with no inputs you recognize.\n\nExample: after trial, SDRs complete ICP search faster on Tool B; the memo cites measured task times and credit burn logs — not a “3× pipeline” slogan or a fabricated dollar return.",
    tip: "Put “unknown” next to any benefit you cannot measure yet — credibility rises.",
    scenarios: [
      {
        title: "Weak ROI story",
        body: "Only vendor % or $ slides, no baselines.",
      },
      {
        title: "Strong ROI story",
        body: "Baselines + trial times + TCO categories + formulas with your inputs.",
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
        title: "Inventing uplift percentages or dollar returns",
        body: "Unverifiable numbers destroy trust with finance.",
      },
      {
        title: "Counting benefits twice",
        body: "Same outcome described as time and revenue without linkage.",
      },
      {
        title: "Ignoring adoption and credit waste",
        body: "ROI assumes SDRs follow verify→CRM — usability matters.",
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
        question: "How do I calculate sales intelligence ROI?",
        answer:
          "Compare named baselines and outcome checks to cost categories (seats/credits via vendor quotes, time qualitatively or via measured hours). Use formulas with your inputs only. Decision rule: no claim without a baseline and a review method — never invent ROI % or dollar totals.",
      },
      {
        question: "What if leadership wants a percentage?",
        answer:
          "Offer a sensitivity range only when inputs are real (measured hours, quoted credits). Otherwise show operational ROI and refuse fabricated precision.",
      },
      {
        question: "Is better coverage a valid benefit?",
        answer:
          "Yes if you define the ICP sample check that proves it (hit rate on your account list in trial and after go-live).",
      },
      {
        question: "What should I do next?",
        answer:
          "Fold this logic into the selection decision memo; attach Total Cost categories and Trial evidence — still no invented dollars.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related sales intelligence resources",
    links: [
      {
        href: "/guides/sales-intelligence-total-cost-guide/",
        label: "Total cost guide",
        description: "Cost categories.",
      },
      {
        href: "/guides/sales-intelligence-credits-explained/",
        label: "Credits explained",
        description: "Credit efficiency inputs.",
      },
      {
        href: "/guides/sales-intelligence-trial-evaluation/",
        label: "Trial evaluation",
        description: "Evidence for the memo.",
      },
      {
        href: "/guides/sales-intelligence-selection-process/",
        label: "Selection process",
        description: "Where the memo sits.",
      },
      {
        href: "/guides/how-to-choose-sales-intelligence/",
        label: "How to choose SI",
        description: "Selection frame.",
      },
      {
        href: "/best/sales-intelligence-software/",
        label: "Best sales intelligence",
        description: "Shortlist context.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "choose-cta",
    title: "Ground ROI in job fit and real quotes",
    body: "Pair outcome-based benefits with vendor quotes and your measured inputs — still no invented ROI percentages or dollar totals.",
    href: "/guides/how-to-choose-sales-intelligence/",
    ctaLabel: "How to choose SI →",
    variant: "finder",
  },
];

export const salesIntelligenceRoiGuide: GuidePage = {
  id: "guide-sales-intelligence-roi-guide",
  slug: "sales-intelligence-roi-guide",
  title: "Sales Intelligence ROI Guide: Value Without Fake Numbers",
  summary:
    "Frame SI return as observable operational gains tied to 90-day outcomes — using formulas and your inputs only, never invented ROI percentages or dollar totals.",
  categorySlugs: ["sales-intelligence"],
  productSlugs: [],
  topicType: "selection",
  journeyStage: "choose",
  knowledgeAreaSlug: "selection",
  heroVisual: {
    src: "/guides/sales-intelligence-roi-guide-hero.png",
    alt: "Sales intelligence ROI guide hero: balance scale with outcomes vs cost categories — no percent or dollar badges.",
  },
  supports: [
    {
      contentId: "content:category:sales-intelligence",
      relationType: "supports-anchor",
      primary: true,
    },
    {
      contentId: "content:best:sales-intelligence-software",
      relationType: "supports-anchor",
      primary: false,
    },
  ],
  nextAction: {
    contentId: "content:best:sales-intelligence-software",
    label: "See Best Sales Intelligence",
  },
  relatedGuideSlugs: [
    "sales-intelligence-total-cost-guide",
    "sales-intelligence-credits-explained",
    "sales-intelligence-trial-evaluation",
    "sales-intelligence-selection-process",
    "how-to-choose-sales-intelligence",
  ],
  blocks: salesIntelligenceRoiGuideBlocks as GuidePage["blocks"],
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
      description: "How prospecting happens today.",
      order: 1,
    },
    {
      id: "no-fake",
      label: "Ban invented ROI % and dollar totals",
      description: "Formulas + your inputs only.",
      order: 2,
    },
  ],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: {
    status: "published",
    updatedAt: "2026-08-17T08:00:00.000Z",
    publishedAt: "2026-08-17T08:00:00.000Z",
    reviewedAt: "2026-08-17T08:00:00.000Z",
    researchStatus: "complete",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title: "Sales Intelligence ROI Guide | SoftwareGlimpse",
    description:
      "Build an SI ROI narrative from 90-day outcomes and cost categories — formulas and inputs only, no invented ROI % or dollar totals.",
    canonicalPath: "/guides/sales-intelligence-roi-guide/",
    indexable: true,
  },
};
