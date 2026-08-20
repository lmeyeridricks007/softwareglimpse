import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * CRM Pricing Guide — how plans, seats, and add-ons really work.
 * Template: softwareglimpse-guide-template-v1
 */
const crmPricingGuideBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "CRM pricing is usually per-seat tiers with feature gates and optional add-ons — the headline “from” tier is often not the plan that includes your must-haves. Decision rule: do not compare tools on marketing starting prices; map must-haves to the required plan, then estimate with the Cost Calculator using researched list prices and clear bands.",
    bullets: [
      "Per-seat common",
      "Feature gates",
      "Add-ons",
      "Annual discounts",
      "Plan ≠ must-haves",
      "Use Calculator",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Starting price ≠ buying price",
        body: "Must-haves often sit on higher tiers.",
      },
      {
        label: "Seats multiply fast",
        body: "Count daily users and viewers honestly.",
      },
      {
        label: "Add-ons are part of the plan story",
        body: "Ask which capabilities are licensed separately.",
      },
      {
        label: "Bands beat fake precision",
        body: "Use Calculator ranges; never invent list prices in copy.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "pricing-path",
    title: "Pricing literacy path",
    steps: [
      { id: "model", label: "Model", short: "How billed" },
      { id: "gates", label: "Gates", short: "Must → tier" },
      { id: "seats", label: "Seats", short: "Who pays" },
      { id: "addons", label: "Add-ons", short: "Extras listed" },
      { id: "estimate", label: "Estimate", short: "Calculator" },
    ],
    ctaHref: "/tools/crm-cost-calculator/",
    ctaLabel: "Cost Calculator →",
    figure: {
      src: "/guides/crm-pricing-literacy-path.png",
      alt: "CRM pricing literacy path: billing model, feature gates, seats, add-ons, estimate in bands.",
      caption:
        "Read pricing bottom-up from must-have gates — the cheapest tile rarely matches your sheet.",
    },
  },
  {
    type: "size-match",
    id: "worked-tco",
    title: "Worked example: Harbor maps must-haves to a qualifying plan",
    tiers: [
      {
        id: "qualifying",
        label: "Headline tile vs qualifying SKU",
        description:
          "Worked example: Harbor needs email sync and a second pipeline. Both sit above the public “from” tier. They estimate the qualifying plan in the Cost Calculator using researched list prices — not the marketing tile. Trade-off: fewer seats on a higher tier vs more seats without the must-have.",
        fitHints: ["Must-haves → plan", "Seat count honest", "Add-ons listed"],
      },
      {
        id: "skip-tile",
        label: "When starting price is a trap",
        description:
          "Worked example: Pulse compares two CRMs on “from $15.” One gates reporting; the other gates SSO. They stop ranking starting prices and re-run the Calculator on the plans that actually include their sheet.",
        fitHints: ["Do not invent list prices", "Bands beat fake precision", "Confirm live packaging"],
      },
    ],
  },
  {
    type: "figure",
    id: "pricing-anatomy",
    title: "Anatomy of a CRM price",
    src: "/guides/crm-pricing-guide-anatomy.png",
    alt: "Diagram stacking seat tier, feature gates, add-ons, and billing term into a total subscription — labels only, no dollar figures.",
    caption:
      "Read pricing bottom-up from must-have gates, not top-down from the cheapest tile.",
  },
  {
    type: "step",
    id: "read-models",
    stepNumber: 1,
    heading: "Recognize common CRM pricing models",
    body: "Most catalogue CRMs sell per-user monthly/annual plans with tiered features. Some gate automation, multiple pipelines, or advanced reporting behind higher tiers — ask how those capabilities are licensed without claiming a specific product’s policy as fact.\n\nExample: a 12-person B2B advisory team needs email sync and a shared pipeline board on day one. They discard any “from” tier that cannot show those must-haves, then compare only the qualifying plans in the Cost Calculator.",
    tip: "Screenshot or note the exact plan name shown in demo — demos often use higher tiers.",
    figure: {
      src: "/guides/crm-pricing-guide-hero.png",
      alt: "CRM pricing guide hero: tiers and feature locks.",
      caption:
        "Feature locks explain why the cheapest tile rarely matches your sheet.",
    },
    scenarios: [
      {
        title: "Per-seat tiers",
        body: "Price scales with users; features scale with plan.",
      },
      {
        title: "Add-on modules",
        body: "Separate SKUs for calling, AI, or premium support.",
      },
      {
        title: "Annual vs monthly",
        body: "Term discounts vs flexibility — commercial choice, not a fake ROI %.",
      },
    ],
  },
  {
    type: "step",
    id: "map-and-estimate",
    stepNumber: 2,
    heading: "Map must-haves, then estimate in bands",
    body: "For each finalist, list must-haves → required plan → seat count → known add-ons. Feed researched list prices into the Cost Calculator. Treat implementation and training as separate TCO lines (see Total Cost Guide) — do not invent those fees here.\n\nExample: the advisory team counts four sellers + one ops seat. They mark “viewer-only” stakeholders as non-seats until a vendor confirms otherwise in writing.",
    tip: "If a vendor will not map must-haves to a plan in writing, treat cost clarity as a failed criterion.",
    figure: {
      src: "/guides/crm-pricing-must-haves-bands.png",
      alt: "Map CRM must-haves then estimate in bands: day-one needs, qualifying plans, seats, add-ons, low/mid/high estimate.",
      caption:
        "Discard “from” tiers that cannot unlock must-haves — then compare only qualifying plans.",
    },
    scenarios: [
      {
        title: "Seat inflation",
        body: "Managers and delivery want logins — confirm license types.",
      },
      {
        title: "Gate surprise",
        body: "Automation or reporting appears only after upgrade talk.",
      },
      {
        title: "Healthy estimate",
        body: "Calculator band + written plan map attached to memo.",
      },
    ],
  },
  {
    type: "cost-breakdown",
    id: "price-lines",
    title: "What “price” usually includes",
    body: "Subscription lines you should separate before calling anything a total.",
    lines: [
      {
        label: "Base seats × plan",
        description: "Daily users on the tier that includes must-haves.",
      },
      {
        label: "Feature gates / upgrades",
        description: "Higher tier required by the sheet — not optional fluff.",
      },
      {
        label: "Add-ons",
        description: "Modules sold separately; confirm before signature.",
      },
      {
        label: "Billing term effects",
        description:
          "Monthly vs annual commercial terms — verify on the order form.",
      },
    ],
    calculatorHref: "/tools/crm-cost-calculator/",
    calculatorLabel: "Estimate with Cost Calculator →",
  },
  {
    type: "callout",
    id: "no-invented-prices",
    title: "Pricing honesty",
    tone: "warning",
    body: "SoftwareGlimpse does not invent list prices, implementation fees, or “typical” dollar totals in guides. Use the Cost Calculator and vendor-written plan maps; qualify with bands when research is incomplete.",
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "Why is CRM pricing hard to compare?",
        answer:
          "Tiers gate different features, seat definitions vary, and add-ons differ. Compare qualifying plans for your must-haves — not homepage starting tiles.",
      },
      {
        question: "Are free CRM plans enough?",
        answer:
          "Sometimes for solo use. If must-haves require paid gates, budget for the qualifying plan and confirm limits in writing.",
      },
      {
        question: "Should I use annual billing?",
        answer:
          "Often cheaper per month, less flexible. Decide after fit is proven — not from a demo discount alone.",
      },
      {
        question: "Where do I get numbers?",
        answer:
          "Researched list prices in the Cost Calculator and vendor quotes — never paste invented figures into a business case.",
      },
      {
        question: "What should I do next?",
        answer:
          "Map gates, run the Calculator, then read the Total Cost Guide for non-subscription lines.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related CRM resources",
    links: [
      {
        href: "/tools/crm-cost-calculator/",
        label: "CRM Cost Calculator",
        description: "Researched list-price estimates.",
      },
      {
        href: "/tools/crm-tco-calculator/",
        label: "CRM TCO Calculator",
        description: "Software plus ownership cost categories.",
      },
      {
        href: "/guides/crm-total-cost-guide/",
        label: "CRM total cost guide",
        description: "Beyond seats.",
      },
      {
        href: "/guides/crm-roi-guide/",
        label: "CRM ROI guide",
        description: "Value without fake %.",
      },
      {
        href: "/guides/crm-vendor-evaluation/",
        label: "CRM vendor evaluation",
        description: "Get plan gates in writing.",
      },
      {
        href: "/guides/crm-business-case/",
        label: "CRM business case",
        description: "Take numbers to approvers.",
      },
      {
        href: "/guides/how-to-choose-crm/",
        label: "How to choose a CRM",
        description: "Full selection frame.",
      },
      {
        href: "/compare/",
        label: "Compare CRM tools",
        description: "Research side-by-sides.",
      },
      {
        href: "/tools/crm-finder/",
        label: "CRM Finder",
        description: "Shortlist inside your budget.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "calculator-cta",
    title: "Estimate with researched list prices",
    body: "Use the CRM Cost Calculator for banded subscription estimates — no invented implementation fees or fake totals.",
    href: "/tools/crm-cost-calculator/",
    ctaLabel: "Open Cost Calculator →",
    variant: "calculator",
  },
];

export const crmPricingGuide: GuidePage = {
  id: "guide-crm-pricing-guide",
  slug: "crm-pricing-guide",
  title: "CRM Pricing Guide: How Plans, Seats, and Add-Ons Really Work",
  summary:
    "Learn CRM pricing models — per-seat tiers, feature gates, add-ons, and annual vs monthly — with bands and qualifiers, then estimate with the Cost Calculator.",
  categorySlugs: ["crm"],
  productSlugs: [],
  topicType: "pricing-education",
  journeyStage: "choose",
  knowledgeAreaSlug: "selection",
  heroVisual: {
    src: "/guides/crm-pricing-guide-hero.png",
    alt: "CRM pricing guide hero: tier cards with feature gates and a seat slider — no dollar totals.",
  },
  supports: [
    {
      contentId: "content:category:crm",
      relationType: "supports-anchor",
      primary: true,
    },
    {
      contentId: "content:tool:crm-cost-calculator",
      relationType: "explains-pricing",
      primary: true,
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
    "crm-total-cost-guide",
    "crm-roi-guide",
    "crm-business-case",
    "crm-vendor-evaluation",
    "crm-requirements-guide",
    "how-to-choose-crm",
  ],
  blocks: crmPricingGuideBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "model",
      label: "Name the pricing model",
      description: "Per-seat, usage, or hybrid — for each finalist.",
      order: 0,
    },
    {
      id: "gates",
      label: "Map must-haves to plan gates",
      description: "Which tier unlocks each must.",
      order: 1,
    },
    {
      id: "calculator",
      label: "Run Cost Calculator bands",
      description: "Researched list prices only — no invented fees.",
      order: 2,
    },
  ],
  sections: [],
  faq: [],
  freshnessClass: "medium-moving",
  metadata: {
    status: "published",
    updatedAt: "2026-08-14T08:00:00.000Z",
    publishedAt: "2026-08-14T08:00:00.000Z",
    reviewedAt: "2026-08-14T08:00:00.000Z",
    researchStatus: "complete",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title: "CRM Pricing Guide: Plans, Seats & Add-Ons | SoftwareGlimpse",
    description:
      "Understand CRM pricing models, plan gates, and add-ons — use bands and the Cost Calculator, not invented list prices.",
    canonicalPath: "/guides/crm-pricing-guide/",
    indexable: true,
  },
};
