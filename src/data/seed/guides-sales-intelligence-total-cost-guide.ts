import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * Sales Intelligence Total Cost Guide — seats + credits + ops beyond list price.
 * Template: softwareglimpse-guide-template-v1
 * Educational only — no invented dollar totals.
 */
const salesIntelligenceTotalCostGuideBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Total cost of sales intelligence is seats (if any) plus credit/export spend, deliverability tooling, CRM sync admin time, training, and stack overlap — not the homepage “from” price. Decision rule: never call a quote “total cost” until you list credit definition, first-90-day volume, export rights, and who owns sync/hygiene; quantify only with vendor quotes and your volume model — never invent a dollar TCO.",
    bullets: [
      "Seats & plans",
      "Credits & exports",
      "Deliverability stack",
      "Sync admin time",
      "Training",
      "Overlap risk",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Credits dominate the bill",
        body: "Seat price is often the smaller line once enrichment and dials run hot.",
      },
      {
        label: "Export rights are a cost gate",
        body: "View-only or capped export quietly forces a higher tier or a second tool.",
      },
      {
        label: "Time is a cost line",
        body: "Field mapping, dedupe, and bounce triage show up as RevOps capacity.",
      },
      {
        label: "No fake totals",
        body: "Name categories; attach quotes and volume assumptions — never invented sums.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "tco-path",
    title: "SI TCO mapping path",
    steps: [
      { id: "plan", label: "Plan", short: "Qualifying tier" },
      { id: "credits", label: "Credits", short: "90-day volume" },
      { id: "ops", label: "Ops time", short: "Sync & hygiene" },
      { id: "stack", label: "Stack", short: "Overlap tools" },
      { id: "memo", label: "Memo", short: "Categories listed" },
    ],
    ctaHref: "/guides/sales-intelligence-credits-explained/",
    ctaLabel: "Credits explained →",
    figure: {
      src: "/guides/sales-intelligence-total-cost-guide-map.png",
      alt: "Sales intelligence TCO map: qualifying plan, credit volume, ops time, deliverability stack, and overlap risk around a central SI hub.",
      caption:
        "Separate one-time setup costs from recurring credit and ops costs before you compare vendors.",
    },
  },
  {
    type: "figure",
    id: "tco-map",
    title: "TCO category map",
    src: "/guides/sales-intelligence-total-cost-guide-map.png",
    alt: "Sales intelligence TCO categories: subscription seats, credits and exports, deliverability tools, CRM sync admin time, training, and stack overlap.",
    caption:
      "Subscription is one slice — credits and ops usually decide whether the buy stays affordable.",
  },
  {
    type: "step",
    id: "list-categories",
    stepNumber: 1,
    heading: "List every category before comparing quotes",
    body: "Start with the plan that includes your must-haves (CRM sync, export, dialer minutes if needed). Add: credit unit definition, first-90-day volume (backfill + net-new), top-up rules, mailbox/warmup tools, bounce scrubbing, RevOps hours for sync and dedupe, SDR training, and any second tool you will still pay for (sequencer, dialer, enrichment API).\n\nExample: Harborline Outbound (four SDRs + one RevOps) lists: qualifying mid-tier seats, ~monthly credits for net-new emails/phones, a one-time enrichment backfill for 18k CRM contacts, Warmbox-class deliverability spend already in the stack, and ~3 hours/week for sync hygiene. They refuse to crown “cheapest seat” until Finalist B explains export caps on the demoed tier.",
    tip: "If nobody owns credit forecasting, mid-month top-ups become surprise invoices.",
    figure: {
      src: "/guides/sales-intelligence-total-cost-guide-hero.png",
      alt: "Sales intelligence total cost hero: category donut around an SI workspace — seats, credits, deliverability, sync time, training.",
      caption: "Seats are one slice — credits and ops complete the pie.",
    },
    scenarios: [
      {
        title: "One-time",
        body: "Backfill enrichment, initial field mapping, list cleanup.",
      },
      {
        title: "Ongoing",
        body: "Seats, monthly credits, deliverability, sync admin hours.",
      },
      {
        title: "Risk",
        body: "Export caps, forced upgrades, overlapping data tools.",
      },
    ],
  },
  {
    type: "step",
    id: "compare-fairly",
    stepNumber: 2,
    heading: "Compare TCO shapes, not single numbers",
    body: "Put finalists side by side on categories. A lower seat band with opaque credits can lose to a clearer credit model your RevOps can forecast. Keep unknown partner fees and custom data buys as “unknown — need quote,” never as invented line items.\n\nExample: Harborline keeps Tool A despite a higher seat band because Tool B’s trial burned credits on failed phone reveals and capped CSV export — the operating shape was worse even before any dollar sum.",
    tip: "Attach the category table to the decision memo — finance can challenge assumptions without demanding fake precision.",
    scenarios: [
      {
        title: "Seat-cheap trap",
        body: "Low tier missing sync/export; upgrade forced after pilot.",
      },
      {
        title: "Credit-opaque trap",
        body: "Cheap seats, unclear unit cost, mid-campaign top-ups.",
      },
      {
        title: "Balanced pick",
        body: "Qualifying plan + forecastable credits + clear exit/export.",
      },
    ],
  },
  {
    type: "cost-breakdown",
    id: "tco-lines",
    title: "TCO lines to capture",
    body: "Use qualitative notes where you lack quotes; quantify only with vendor pricing pages and written volume quotes.",
    lines: [
      {
        label: "Qualifying subscription",
        description:
          "Seats × plan that includes must-haves (sync, export, channels).",
      },
      {
        label: "Credits & top-ups",
        description:
          "Unit definition × first-90-day volume + rollover/top-up rules.",
      },
      {
        label: "Deliverability & sending stack",
        description: "Warmup, inboxes, verification — often separate spend.",
      },
      {
        label: "Sync & data ops time",
        description: "Field mapping, dedupe, bounce triage hours/week.",
      },
      {
        label: "Training & adoption",
        description: "SDR enablement until the core prospecting loop sticks.",
      },
      {
        label: "Stack overlap / exit buffer",
        description: "Tools you still pay for + export readiness at renewal.",
      },
    ],
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "TCO mistakes",
    items: [
      {
        title: "Treating seat price as total cost",
        body: "Credits and export gates decide the real operating bill.",
      },
      {
        title: "Inventing a dollar TCO",
        body: "Unverifiable sums destroy trust — list categories and quotes instead.",
      },
      {
        title: "Ignoring stack overlap",
        body: "Paying for two databases plus a sequencer without a system of record.",
      },
      {
        title: "No owner for credit forecasting",
        body: "Campaigns run hot; finance sees the invoice after the fact.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "What is sales intelligence total cost of ownership?",
        answer:
          "Qualifying subscription plus credits/exports, deliverability stack, sync/ops time, training, and overlap/exit risk. Decision rule: list categories with owners before treating any quote as complete.",
      },
      {
        question: "Can SoftwareGlimpse give me a dollar TCO?",
        answer:
          "No invented totals. Use vendor published pricing and written quotes for your volume; keep time costs qualitative unless you have measured hours.",
      },
      {
        question: "How do I estimate credits without a fake number?",
        answer:
          "Model inputs: backfill records × reveal rate assumptions, monthly net-new ICP volume, and phone vs email mix — then ask vendors to price that scenario in writing. See Credits Explained.",
      },
      {
        question: "Is migration always a cost?",
        answer:
          "Not always — some teams start clean. If CRM history and enrichment backfill matter, budget that pass explicitly as one-time.",
      },
      {
        question: "What should I do next?",
        answer:
          "Decode credits, map CRM sync ownership, then fold categories into selection process and ROI narrative guides — still without invented dollar claims.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related sales intelligence resources",
    links: [
      {
        href: "/guides/sales-intelligence-credits-explained/",
        label: "Credits explained",
        description: "What one credit buys.",
      },
      {
        href: "/guides/sales-intelligence-roi-guide/",
        label: "SI ROI guide",
        description: "Benefits without fake %.",
      },
      {
        href: "/guides/sales-intelligence-crm-sync-explained/",
        label: "CRM sync explained",
        description: "Ops time drivers.",
      },
      {
        href: "/guides/how-to-choose-sales-intelligence/",
        label: "How to choose SI",
        description: "Selection frame.",
      },
      {
        href: "/guides/sales-intelligence-selection-process/",
        label: "Selection process",
        description: "Gates and owners.",
      },
      {
        href: "/best/sales-intelligence-software/",
        label: "Best sales intelligence",
        description: "Researched shortlist context.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "choose-cta",
    title: "Anchor cost categories to a job-first shortlist",
    body: "Name the primary job and must-have plan gates first — then layer credit and ops categories beside vendor quotes.",
    href: "/guides/how-to-choose-sales-intelligence/",
    ctaLabel: "How to choose SI →",
    variant: "finder",
  },
];

export const salesIntelligenceTotalCostGuide: GuidePage = {
  id: "guide-sales-intelligence-total-cost-guide",
  slug: "sales-intelligence-total-cost-guide",
  title: "Sales Intelligence Total Cost Guide: Beyond Seat Price",
  summary:
    "Map sales intelligence TCO categories — seats, credits, deliverability, sync admin time, training, and stack overlap — without inventing dollar totals.",
  categorySlugs: ["sales-intelligence"],
  productSlugs: [],
  topicType: "pricing-education",
  journeyStage: "choose",
  knowledgeAreaSlug: "selection",
  heroVisual: {
    src: "/guides/sales-intelligence-total-cost-guide-hero.png",
    alt: "Sales intelligence total cost hero: donut of cost categories around an SI hub — seats, credits, deliverability, sync time, training.",
  },
  supports: [
    {
      contentId: "content:category:sales-intelligence",
      relationType: "supports-anchor",
      primary: true,
    },
    {
      contentId: "content:best:sales-intelligence-software",
      relationType: "explains-pricing",
      primary: true,
    },
  ],
  nextAction: {
    contentId: "content:best:sales-intelligence-software",
    label: "See Best Sales Intelligence",
  },
  relatedGuideSlugs: [
    "sales-intelligence-credits-explained",
    "sales-intelligence-roi-guide",
    "sales-intelligence-crm-sync-explained",
    "how-to-choose-sales-intelligence",
    "sales-intelligence-selection-process",
  ],
  blocks: salesIntelligenceTotalCostGuideBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "categories",
      label: "List SI TCO categories for your buy",
      description: "Not only seats.",
      order: 0,
    },
    {
      id: "volume",
      label: "Write first-90-day credit volume inputs",
      description: "Backfill + net-new assumptions.",
      order: 1,
    },
    {
      id: "quotes",
      label: "Attach vendor quotes — no invented totals",
      description: "Categories + written pricing only.",
      order: 2,
    },
  ],
  sections: [],
  faq: [],
  freshnessClass: "medium-moving",
  metadata: {
    status: "published",
    updatedAt: "2026-08-17T08:00:00.000Z",
    publishedAt: "2026-08-17T08:00:00.000Z",
    reviewedAt: "2026-08-17T08:00:00.000Z",
    researchStatus: "complete",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title: "Sales Intelligence Total Cost Guide | SoftwareGlimpse",
    description:
      "SI TCO categories: seats, credits, deliverability, sync admin time, training, and stack overlap — no invented dollar totals.",
    canonicalPath: "/guides/sales-intelligence-total-cost-guide/",
    indexable: true,
  },
};
