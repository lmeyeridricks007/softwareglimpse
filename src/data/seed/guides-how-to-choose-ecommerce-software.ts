import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const howToChooseEcommerceSoftwareBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Choose ecommerce software by the job that is blocking work — hosted storefront, open-source cart, omnichannel POS, or dropshipping sourcing — then confirm catalog depth, checkout/payments, channels, and TCO (subscription + processing + apps). Shortlist only tools whose core product is your job; a sourcing app and a storefront platform are different purchases even when both live in this category.",
    bullets: [
      "Primary job to be done",
      "Catalog / variant complexity",
      "Checkout & payment methods",
      "POS / omnichannel need",
      "Apps, hosting, processing TCO",
      "Trial with one real order",
    ],
  },
  {
    type: "key-takeaways",
    id: "takeaways",
    title: "What matters most",
    items: [
      {
        label: "“Ecommerce software” is several products",
        body: "SaaS platforms, WooCommerce stacks, Square-class POS, and dropshipping apps fail for different reasons. Pick the shape before you pick a brand.",
      },
      {
        label: "Processing and apps change cost",
        body: "Card rates, GMV overages, themes, and extensions often decide TCO. Price the qualifying configuration at your order volume.",
      },
      {
        label: "Retail inventory is a different job",
        body: "If stores and the website must share stock, shortlist omnichannel — do not bolt POS onto an online-only platform as an afterthought.",
      },
      {
        label: "Do not invent scores from marketing pages",
        body: "Use SoftwareGlimpse methodology qualitatively when comparing peers — see Best ecommerce software for job-cluster editor’s picks.",
      },
    ],
  },
  {
    type: "figure",
    id: "worked-examples",
    title: "Four worked examples",
    src: "/guides/how-to-choose-ecommerce-software-needs.png",
    alt: "Four worked examples of ecommerce buying: hosted SaaS, open-source, omnichannel POS, and dropshipping sourcing.",
    caption: "Four teams, one category, four different shortlists. The job decides the tool — not the brand.",
  },
  {
    type: "selection-checklist",
    id: "interactive-checklist",
    title: "Interactive ecommerce selection checklist",
    dimensions: [
      {
        id: "primary-job",
        label: "Primary job",
        options: [
          "Hosted SaaS storefront",
          "Open-source / WordPress cart",
          "Omnichannel POS + online",
          "Dropshipping sourcing (store exists)",
        ],
      },
      {
        id: "catalog",
        label: "Catalog complexity",
        options: ["<50 SKUs", "50–500 SKUs", "Variants / bundles", "B2B price lists"],
      },
      {
        id: "channels",
        label: "Sales channels",
        options: ["Own domain only", "Amazon / social shops", "In-store POS", "Wholesale portal"],
      },
      {
        id: "stack",
        label: "Must integrate with",
        options: ["Payments / tax", "3PL / shipping", "Email / ads", "Minimal integrations"],
      },
      {
        id: "budget-style",
        label: "Buying style",
        options: ["Free / self-serve", "Published monthly plans", "Annual OK", "Enterprise quote"],
      },
    ],
  },
  {
    type: "step",
    id: "name-the-job",
    stepNumber: 1,
    heading: "Name the job in one sentence",
    body: "Write: “We need software so that ___ happens every week without spreadsheet archaeology.” If the blank is a branded store with checkout, you are in SaaS or open-source. If it is POS inventory matching the website, you are in omnichannel. If it is importing supplier SKUs into a store you already run, you are in dropshipping sourcing.\n\nWorked example: Harbor Studio wrote “a customer can buy our 12 SKUs on our domain this month.” That sentence ruled out Spocket-only tools before demos started.",
    tip: "If two jobs are blocking, buy for the one that creates the most rework this quarter.",
  },
  {
    type: "step",
    id: "map-gates",
    stepNumber: 2,
    heading: "Map must-haves to plan gates and TCO",
    body: "List the workflows that must work on day one — custom domain, Shopify Payments vs third-party gateways, POS stock, B2B quantity breaks, product import caps — and ask which plan unlocks them. Model processing spreads and app TCO at your expected GMV.\n\nWorked example: Northline Retail needed in-store and online stock on one SKU; a hosted SaaS trial without POS hardware failed that requirement, so Square Online stayed on the shortlist and WooCommerce did not.",
    tip: "Ask for a written configuration — plan, payment rates, apps, hosting — before the demo ends.",
    figure: {
      src: "/guides/how-to-choose-ecommerce-software-framework.png",
      alt: "Ecommerce selection framework mapping job cluster to plan gates, processing, and apps.",
      caption: "Job first, then gates and TCO, then brand comparisons.",
    },
  },
  {
    type: "faq",
    id: "faq",
    title: "FAQ",
    items: [
      {
        question: "Should I buy Shopify if I already have WordPress?",
        answer:
          "Only if you want to leave WordPress. WooCommerce is the open-source cluster path when you intend to keep hosting and plugins. Do not rank them as a single undifferentiated #1.",
      },
      {
        question: "How do I treat Spocket or AliDrop on a platform shortlist?",
        answer:
          "As dropshipping sourcing when a store already exists — not as Shopify or WooCommerce peers scored on storefront methodology.",
      },
      {
        question: "Where should I compare researched products?",
        answer:
          "See Best ecommerce software for Wave-1 editor’s picks by job cluster and disclosed methodology notes.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "next",
    title: "Next steps",
    body: "Shortlist by job cluster, then confirm live commercial terms.",
    href: "/best/ecommerce-software/",
    ctaLabel: "Best ecommerce software →",
    variant: "finder",
  },
];

export const howToChooseEcommerceSoftwareGuide: GuidePage = {
  id: "guide-how-to-choose-ecommerce-software",
  slug: "how-to-choose-ecommerce-software",
  title: "How to Choose Ecommerce Software",
  summary:
    "A practical framework for shortlisting hosted platforms, open-source carts, omnichannel POS, and dropshipping sourcing by job.",
  categorySlugs: ["ecommerce"],
  topicType: "buying-guide",
  journeyStage: "evaluate",
  heroVisual: {
    src: "/guides/how-to-choose-ecommerce-software-hero.png",
    alt: "Educational illustration for How to Choose Ecommerce Software.",
  },
  supports: [
    {
      contentId: "content:category:ecommerce",
      relationType: "supports-anchor",
      primary: true,
    },
    {
      contentId: "content:best:ecommerce-software",
      relationType: "supports-anchor",
      primary: false,
    },
  ],
  relatedGuideSlugs: [
    "what-is-ecommerce-software",
    "ecommerce-pricing-guide",
  ],
  blocks: howToChooseEcommerceSoftwareBlocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: {
    status: "published",
    updatedAt: "2026-08-18T00:00:00.000Z",
    publishedAt: "2026-08-18T00:00:00.000Z",
    reviewedAt: "2026-08-18T00:00:00.000Z",
    researchStatus: "complete",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title: "How to Choose Ecommerce Software | SoftwareGlimpse",
    description:
      "How to choose ecommerce software by job cluster — hosted SaaS, open-source, omnichannel POS, and dropshipping sourcing — with plan gates and TCO.",
    canonicalPath: "/guides/how-to-choose-ecommerce-software/",
    indexable: true,
  },
};
