import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * Types of sales intelligence — product shapes (data, enrichment, engagement, dialer).
 * Template: softwareglimpse-guide-template-v1
 */
const typesOfSalesIntelligenceBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "“Types of sales intelligence” means four primary product shapes: contact data (build lists), enrichment (complete records you own), engagement (sequences and multichannel outreach), and dialer (phone at volume). Decision rule: name the one job blocking pipeline this quarter, shortlist only tools whose core product is that job, and treat hybrid “all-in-one” bundles as optional convenience — not the reason to buy.",
    bullets: [
      "Contact data / database",
      "Enrichment (+ intent)",
      "Sales engagement",
      "Dialer / phone",
      "Hybrid caution",
      "Job before brand",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "One category, four products",
        body: "Contact databases, enrichment, engagement platforms, and dialers share a label but fail for different reasons. Pick the shape first.",
      },
      {
        label: "Coverage is local, not global",
        body: "Total record counts say nothing about your niche, seniority band, or region. Sample your own ICP before comparing plans.",
      },
      {
        label: "Credits are part of the product",
        body: "What one credit unlocks, whether mobile is separate, and how exports are capped often matter more than seat price.",
      },
      {
        label: "Hybrids need a primary job",
        body: "Buying an all-in-one because it “does everything” usually means you under-test the one job you actually need.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "choose-shape-first",
    title: "How to choose a sales intelligence type",
    steps: [
      { id: "job", label: "Primary job", short: "List, enrich, engage, dial" },
      { id: "icp", label: "ICP coverage", short: "Your accounts, not theirs" },
      { id: "credits", label: "Credit model", short: "What one credit buys" },
      { id: "crm", label: "CRM sync", short: "Map & overwrite rules" },
      { id: "compliance", label: "Compliance owner", short: "Lawful basis is yours" },
      { id: "shape", label: "Pick a shape", short: "Then shortlist vendors" },
    ],
    ctaHref: "/guides/how-to-choose-sales-intelligence/",
    ctaLabel: "How to choose sales intelligence →",
    figure: {
      src: "/guides/types-of-sales-intelligence-choose-shape.png",
      alt: "Six-step path: primary job, ICP coverage, credit model, CRM sync, compliance owner, then pick a sales intelligence shape.",
      caption: "Choose the product shape before you compare vendor brands.",
    },
  },
  {
    type: "figure",
    id: "shapes-visual",
    title: "Four sales intelligence product shapes",
    src: "/guides/types-of-sales-intelligence-hero.png",
    alt: "Four sales intelligence product shapes: contact data, enrichment, engagement, and dialer.",
    caption: "Same category label — different primary jobs.",
  },
  {
    type: "crm-types",
    id: "product-shapes",
    title: "Modern product shapes (not rankings)",
    types: [
      {
        id: "data",
        title: "Contact data / database",
        bestFor:
          "Teams that must build net-new prospect lists on a repeatable weekly cadence and need searchable company + contact coverage.",
        avoidWhen:
          "Your accounts are already known and the gap is missing fields, not missing companies — that is enrichment.",
      },
      {
        id: "enrichment",
        title: "Enrichment (& intent)",
        bestFor:
          "RevOps and sales teams completing and refreshing records they already own, plus prioritizing known accounts with intent signals.",
        avoidWhen:
          "You have no usable base list yet — enrichment cannot fill a database you do not have.",
      },
      {
        id: "engagement",
        title: "Sales engagement",
        bestFor:
          "Outbound pods whose bottleneck is follow-up: sequences, reply handling, multichannel cadences, and deliverability ops.",
        avoidWhen:
          "Your data is the weak link. Faster sending on bad records just burns domains.",
      },
      {
        id: "dialer",
        title: "Dialer / phone intelligence",
        bestFor:
          "Phone-led teams where connect volume, local presence, dispositions, and call logging decide the quarter.",
        avoidWhen:
          "Your motion is email-first and calls are occasional — a full dialer is overhead.",
      },
    ],
  },
  {
    type: "step",
    id: "hybrid-caution",
    stepNumber: 1,
    heading: "Hybrid / all-in-one caution",
    body: "Many vendors market data + enrichment + engagement (and sometimes dialer) in one seat. That can work — but only if the primary job is excellent and you will actually use the rest.\n\nExample: a 4-person SDR pod at Northline SaaS bought an “all-in-one” because the demo showed sequences and a database. Their real blocker was weekly list coverage on mid-market IT buyers. Six weeks in, sequences were fine but ICP coverage was thin — they still needed a specialist data tool. The hybrid badge did not replace a coverage test.",
    tip: "Score the primary job as if the other modules did not exist. If that score fails, the bundle is a distraction.",
    scenarios: [
      {
        title: "When hybrid helps",
        body: "One admin, one login, and the primary job (e.g. data or engagement) already passes your ICP and credit tests.",
      },
      {
        title: "When hybrid hurts",
        body: "You bought breadth to avoid choosing — then under-test coverage, credits, or deliverability on the job that actually matters.",
      },
      {
        title: "Safe pattern",
        body: "Shortlist by primary shape; accept hybrid only as a bonus after the core job wins a trial.",
      },
    ],
  },
  {
    type: "size-match",
    id: "fit-by-audience",
    title: "Which sales intelligence type fits whom?",
    tiers: [
      {
        id: "founder",
        label: "Founder-led outbound",
        description:
          "Light data or engagement first — avoid dialer stacks until call volume is the bottleneck.",
        fitHints: ["Small lists", "Low admin"],
      },
      {
        id: "sdr-pod",
        label: "SDR pod",
        description:
          "Data for list building; engagement when follow-up volume is the constraint.",
        fitHints: ["Weekly lists", "Sequences"],
      },
      {
        id: "revops",
        label: "RevOps / data owner",
        description:
          "Enrichment when the CRM is full of incomplete records that need refresh and match rate discipline.",
        fitHints: ["Field mapping", "Overwrite rules"],
      },
      {
        id: "phone-team",
        label: "Phone-led sales team",
        description:
          "Dialer shape when connect rates and dispositions drive the motion — data still feeds the dialer.",
        fitHints: ["Local presence", "CRM call log"],
      },
    ],
  },
  {
    type: "feature-matrix",
    id: "shape-signals",
    title: "Signals you may be in the wrong shape",
    rows: [
      {
        feature: "Need net-new weekly prospect lists",
        mustHave: true,
        niceToHave: false,
        notes: "Points to contact data",
      },
      {
        feature: "CRM full of incomplete records",
        mustHave: true,
        niceToHave: false,
        notes: "Enrichment shape",
      },
      {
        feature: "Follow-up and cadence are the bottleneck",
        mustHave: true,
        niceToHave: false,
        notes: "Engagement shape",
      },
      {
        feature: "Phone connect volume decides the quarter",
        mustHave: true,
        niceToHave: false,
        notes: "Dialer territory",
      },
      {
        feature: "Buying “all-in-one” to skip choosing",
        mustHave: false,
        niceToHave: true,
        notes: "Common overbuy pattern",
      },
    ],
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "Common typing mistakes",
    items: [
      {
        title: "Comparing all “sales intelligence” tools as equals",
        body: "A dialer and a contact database can both say sales intelligence and still solve different jobs.",
      },
      {
        title: "Starting with engagement features",
        body: "Sequences cannot fix missing emails and bad phone numbers — data quality comes first.",
      },
      {
        title: "Assuming hybrid = better",
        body: "Unused modules add cost and credit burn without improving the primary job.",
      },
      {
        title: "Ignoring credit and export rules",
        body: "Seat price looks comparable until mobile unlocks and export caps decide real cost.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "What types of sales intelligence software are there?",
        answer:
          "Four useful shapes: contact data/databases (build lists), enrichment (complete records you own, often with intent), sales engagement (sequences and multichannel outreach), and dialers (phone at volume). Pick the shape that matches your primary job before comparing brands.",
      },
      {
        question: "Is enrichment the same as a contact database?",
        answer:
          "No. A database helps you find net-new companies and people. Enrichment fills or refreshes fields on records you already have. Example: a RevOps owner with 18,000 incomplete CRM contacts needs enrichment; an SDR pod with no list yet needs data.",
      },
      {
        question: "Should we buy an all-in-one sales intelligence platform?",
        answer:
          "Only if the primary job passes your ICP, credit, and CRM sync tests on its own. Treat bundled modules as convenience — not the buying reason.",
      },
      {
        question: "What should I read next?",
        answer:
          "Use How to Choose Sales Intelligence for evaluation criteria, or browse Best Sales Intelligence Software for researched rankings when available.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related sales intelligence resources",
    links: [
      {
        href: "/guides/how-to-choose-sales-intelligence/",
        label: "How to choose sales intelligence",
        description: "Buying framework by primary job.",
      },
      {
        href: "/guides/sales-intelligence-benefits/",
        label: "Sales intelligence benefits",
        description: "What each shape is meant to improve.",
      },
      {
        href: "/guides/sales-intelligence-glossary/",
        label: "Sales intelligence glossary",
        description: "Credits, match rate, intent, and more.",
      },
      {
        href: "/guides/sales-intelligence-examples/",
        label: "Sales intelligence examples",
        description: "Scenarios by team type.",
      },
      {
        href: "/guides/common-sales-intelligence-mistakes/",
        label: "Common SI mistakes",
        description: "Failure modes to avoid.",
      },
      {
        href: "/best/sales-intelligence-software/",
        label: "Best sales intelligence software",
        description: "Research-backed rankings when available.",
      },
      {
        href: "/categories/sales-intelligence/",
        label: "Sales intelligence category",
        description: "Browse the catalogue.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "best-cta",
    title: "Compare options within your shape",
    body: "Once you know which sales intelligence type fits, Best Sales Intelligence Software maps researched products to criteria — without affiliate-ordered rankings.",
    href: "/best/sales-intelligence-software/",
    ctaLabel: "See Best Sales Intelligence →",
    variant: "finder",
  },
];

export const typesOfSalesIntelligenceGuide: GuidePage = {
  id: "guide-types-of-sales-intelligence",
  slug: "types-of-sales-intelligence",
  title: "Types of Sales Intelligence: Data, Enrichment, Engagement & Dialers",
  summary:
    "Learn the four sales intelligence product shapes — contact data, enrichment, engagement, and dialer — and why hybrid “all-in-one” tools still need a primary job before you buy.",
  categorySlugs: ["sales-intelligence"],
  productSlugs: [],
  topicType: "fundamental",
  journeyStage: "learn",
  knowledgeAreaSlug: "fundamentals",
  heroVisual: {
    src: "/guides/types-of-sales-intelligence-hero.png",
    alt: "Four sales intelligence product shapes: contact data, enrichment, engagement, and dialer.",
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
    label: "See Best Sales Intelligence Software",
  },
  relatedGuideSlugs: [
    "how-to-choose-sales-intelligence",
    "sales-intelligence-benefits",
    "sales-intelligence-glossary",
    "sales-intelligence-examples",
    "sales-intelligence-vs-spreadsheet",
    "common-sales-intelligence-mistakes",
  ],
  blocks: typesOfSalesIntelligenceBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "job",
      label: "Name the primary job",
      description: "List, enrich, engage, or dial.",
      order: 0,
    },
    {
      id: "shape",
      label: "Pick a product shape",
      description: "Data, enrichment, engagement, or dialer.",
      order: 1,
    },
    {
      id: "hybrid",
      label: "Test hybrid carefully",
      description: "Primary job must win on its own.",
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
    title: "Types of Sales Intelligence Software Explained | SoftwareGlimpse",
    description:
      "Contact data vs enrichment vs engagement vs dialer — plus hybrid caution — so you pick the right sales intelligence shape before comparing brands.",
    canonicalPath: "/guides/types-of-sales-intelligence/",
    indexable: true,
  },
};
