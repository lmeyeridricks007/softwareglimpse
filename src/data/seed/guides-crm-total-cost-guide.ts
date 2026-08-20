import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * CRM Total Cost Guide — see beyond per-seat subscription.
 * Template: softwareglimpse-guide-template-v1
 */
const crmTotalCostGuideBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Total cost of CRM ownership is subscription plus the time and change costs to launch and run it — admin hours, migration, training, add-ons, and switching/exit risk. Decision rule: never call a per-seat quote “total cost” until those categories are listed with owners; use the Cost Calculator for subscription bands and keep non-list fees qualitative unless you have a real quote.",
    bullets: [
      "Subscription",
      "Admin time",
      "Migration",
      "Training",
      "Add-ons",
      "Exit risk",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Time is a cost line",
        body: "Part-time admins and seller learning show up as capacity, not invoices.",
      },
      {
        label: "Migration is optional until it isn’t",
        body: "Spreadsheets and old tools create one-time work.",
      },
      {
        label: "Cheap seats, expensive sprawl",
        body: "Complex tools burn admin hours even on “affordable” tiers.",
      },
      {
        label: "No fake totals",
        body: "Name categories; quantify only with Calculator or vendor quotes.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "tco-path",
    title: "TCO mapping path",
    steps: [
      { id: "sub", label: "Subscription", short: "Calculator band" },
      { id: "time", label: "Time", short: "Admin & users" },
      { id: "change", label: "Change", short: "Migrate & train" },
      { id: "risk", label: "Risk", short: "Exit & lock-in" },
      { id: "memo", label: "Memo", short: "Categories listed" },
    ],
    ctaHref: "/tools/crm-cost-calculator/",
    ctaLabel: "Cost Calculator →",
    figure: {
      src: "/guides/crm-total-cost-path.png",
      alt: "TCO mapping path: subscription Calculator band, time, change costs, risk and exit, memo with categories listed.",
      caption:
        "Separate one-time change costs from ongoing operating costs before you compare tools.",
    },
  },
  {
    type: "figure",
    id: "tco-map",
    title: "TCO category map",
    src: "/guides/crm-total-cost-guide-map.png",
    alt: "CRM TCO map showing subscription vs one-time change costs vs ongoing operating costs vs risk buffer.",
    caption:
      "Separate one-time change costs from ongoing operating costs before you compare tools.",
  },
  {
    type: "step",
    id: "list-categories",
    stepNumber: 1,
    heading: "List every category before comparing quotes",
    body: "Start with qualifying subscription (from Pricing Guide + Calculator). Add admin hours/week, seller onboarding time, data cleanup/import, training sessions, paid add-ons, and exit/export readiness.\n\nExample: a 9-person agency moving off shared spreadsheets lists: four seller seats on the must-have plan, ops at ~2 hours/week admin, a weekend import cleanup, and two 45-minute training huddles. They refuse to “pick the cheaper tile” until Finalist B explains that multiple pipelines need a higher tier.",
    tip: "If nobody owns admin hours, enterprise-shaped tools are expensive even when seats look fine.",
    figure: {
      src: "/guides/crm-total-cost-guide-hero.png",
      alt: "CRM total cost hero: category donut.",
      caption: "Subscription is one slice — not the whole pie.",
    },
    scenarios: [
      {
        title: "One-time",
        body: "Import, cleanup, initial configuration.",
      },
      {
        title: "Ongoing",
        body: "Seats, add-ons, admin spare capacity.",
      },
      {
        title: "Risk",
        body: "Weak export, opaque renewals, forced upgrades.",
      },
    ],
  },
  {
    type: "step",
    id: "compare-fairly",
    stepNumber: 2,
    heading: "Compare TCO shapes, not single numbers",
    body: "Put finalists side by side on categories. A lower seat band with heavy admin needs can lose to a clearer mid-tier plan your team can run. Keep unknown implementation partner fees as “unknown — need quote,” never as invented line items.\n\nExample: the agency keeps Tool A for lower admin complexity despite a higher Calculator band, because Tool B’s trial showed sellers needing ops for basic reporting.",
    tip: "Attach the category table to the business case — finance can challenge assumptions without demanding fake precision.",
    figure: {
      src: "/guides/crm-total-cost-compare.png",
      alt: "Compare CRM TCO shapes not single numbers: side-by-side categories, qualifying tier, runnable admin load, clear export, shape fit pick.",
      caption:
        "A lower seat band with heavy admin needs can lose to a clearer mid-tier plan your team can run.",
    },
    scenarios: [
      {
        title: "Seat-cheap trap",
        body: "Low tier, missing must-haves, forced upgrade later.",
      },
      {
        title: "Time-expensive trap",
        body: "Powerful platform, no admin capacity.",
      },
      {
        title: "Balanced pick",
        body: "Qualifying plan + runnable admin load + clear exit.",
      },
    ],
  },
  {
    type: "cost-breakdown",
    id: "tco-lines",
    title: "TCO lines to capture",
    body: "Use qualitative notes where you lack quotes; quantify subscription via Calculator only.",
    lines: [
      {
        label: "Qualifying subscription",
        description:
          "Seats × plan that includes must-haves (Calculator).",
      },
      {
        label: "Add-ons & support tiers",
        description: "Anything sold separately — confirm in writing.",
      },
      {
        label: "Admin operating time",
        description: "Hours/week for fields, users, hygiene.",
      },
      {
        label: "Migration & cleanup",
        description: "One-time import and dedupe effort.",
      },
      {
        label: "Training & adoption",
        description: "Seller enablement until the Friday board works.",
      },
      {
        label: "Switching / exit buffer",
        description: "Export readiness and renewal flexibility.",
      },
    ],
    calculatorHref: "/tools/crm-cost-calculator/",
    calculatorLabel: "Estimate subscription →",
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "What is CRM total cost of ownership?",
        answer:
          "Subscription plus change and operating costs (time, migration, training, add-ons) and exit/renewal risk. Decision rule: list categories with owners before treating any quote as complete.",
      },
      {
        question: "Can SoftwareGlimpse give me a dollar TCO?",
        answer:
          "No invented totals. Use the Cost Calculator for researched subscription estimates and your own quotes for services.",
      },
      {
        question: "How do I account for admin time?",
        answer:
          "Estimate hours/week and who supplies them. If capacity is zero, simplify the tool or delay the buy.",
      },
      {
        question: "Is migration always required?",
        answer:
          "Not always — some teams start clean. If history matters, budget cleanup time explicitly.",
      },
      {
        question: "What should I do next?",
        answer:
          "Run Calculator bands, finish diligence on plan gates, then fold categories into the Business Case guide.",
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
        description: "Subscription bands.",
      },
      {
        href: "/tools/crm-tco-calculator/",
        label: "CRM TCO Calculator",
        description: "Software plus ownership cost categories.",
      },
      {
        href: "/guides/crm-pricing-guide/",
        label: "CRM pricing guide",
        description: "How plans work.",
      },
      {
        href: "/guides/crm-business-case/",
        label: "CRM business case",
        description: "Memo for approvers.",
      },
      {
        href: "/guides/crm-roi-guide/",
        label: "CRM ROI guide",
        description: "Benefits without fake %.",
      },
      {
        href: "/guides/crm-vendor-evaluation/",
        label: "CRM vendor evaluation",
        description: "Cost clarity in writing.",
      },
      {
        href: "/guides/crm-requirements-guide/",
        label: "CRM requirements guide",
        description: "Scope that drives cost.",
      },
      {
        href: "/guides/how-to-choose-crm/",
        label: "How to choose a CRM",
        description: "Selection frame.",
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
    title: "Anchor TCO with a real subscription estimate",
    body: "Start the Cost Calculator for researched list-price bands, then layer your time and change categories beside it.",
    href: "/tools/crm-cost-calculator/",
    ctaLabel: "Open Cost Calculator →",
    variant: "calculator",
  },
];

export const crmTotalCostGuide: GuidePage = {
  id: "guide-crm-total-cost-guide",
  slug: "crm-total-cost-guide",
  title: "CRM Total Cost Guide: See Beyond Per-Seat Subscription",
  summary:
    "Map CRM total cost categories — subscription, admin time, migration, training, add-ons, and switching risk — without inventing dollar totals.",
  categorySlugs: ["crm"],
  productSlugs: [],
  topicType: "pricing-education",
  journeyStage: "choose",
  knowledgeAreaSlug: "selection",
  heroVisual: {
    src: "/guides/crm-total-cost-guide-hero.png",
    alt: "CRM total cost hero: donut of cost categories around a CRM hub — subscription, time, migration, training, add-ons.",
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
    "crm-pricing-guide",
    "crm-roi-guide",
    "crm-business-case",
    "crm-vendor-evaluation",
    "crm-requirements-guide",
    "crm-selection-process",
    "how-to-choose-crm",
  ],
  blocks: crmTotalCostGuideBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "categories",
      label: "List TCO categories for your buy",
      description: "Not only seats.",
      order: 0,
    },
    {
      id: "owners",
      label: "Name who pays in time",
      description: "Admin and training hours.",
      order: 1,
    },
    {
      id: "sub-estimate",
      label: "Estimate subscription via Calculator",
      description: "Bands only; no invented fees.",
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
    title:
      "CRM Total Cost Guide: Beyond Per-Seat Subscription | SoftwareGlimpse",
    description:
      "CRM TCO categories: seats, admin time, migration, training, add-ons, and exit risk — estimate subscriptions with the Cost Calculator.",
    canonicalPath: "/guides/crm-total-cost-guide/",
    indexable: true,
  },
};
