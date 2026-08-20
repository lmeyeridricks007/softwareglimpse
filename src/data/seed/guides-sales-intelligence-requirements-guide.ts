import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * Sales Intelligence Requirements Guide — must-haves by job, compliance, CRM write rules.
 * Template: softwareglimpse-guide-template-v1
 */
const salesIntelligenceRequirementsGuideBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Write sales intelligence requirements from the primary job first (data, enrichment, engagement, or dialer), then split must-have vs nice-to-have against coverage, credits, compliance, and CRM write rules. Decision rule: a requirement is demo-ready only when every must-have has an owner, a pass/fail check, and named overwrite/dedupe rules — if you cannot run a coverage sample from the sheet, keep writing.",
    bullets: [
      "Primary job",
      "Must vs nice by job",
      "Coverage & credits",
      "Compliance posture",
      "CRM write rules",
      "Demo-ready sheet",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Job beats feature wishlists",
        body: "Vendors claim all four jobs; only the blocking job keeps the shortlist honest.",
      },
      {
        label: "Must-haves need pass/fail checks",
        body: "If you cannot test coverage, credit burn, or sync on your ICP, it is not a requirement yet.",
      },
      {
        label: "CRM write rules are requirements",
        body: "Which fields may write, never overwrite, and how duplicates match — freeze these before any bulk push.",
      },
      {
        label: "Compliance is yours to own",
        body: "Vendor sourcing docs inform the buy; lawful basis for outreach stays with your privacy owner.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "requirements-path",
    title: "Requirements path",
    steps: [
      { id: "job", label: "Primary job", short: "Data / enrich / engage / dial" },
      { id: "must-nice", label: "Must vs nice", short: "Split by job" },
      { id: "coverage", label: "Coverage", short: "ICP sample" },
      { id: "compliance", label: "Compliance", short: "Sourcing & opt-out" },
      { id: "crm-write", label: "CRM write", short: "Overwrite rules" },
      { id: "sheet", label: "Sheet", short: "Demo-ready" },
    ],
    ctaHref: "/guides/sales-intelligence-evaluation-guide/",
    ctaLabel: "Evaluation guide →",
    figure: {
      src: "/guides/sales-intelligence-requirements-path.png",
      alt: "Sales intelligence requirements path: primary job, must vs nice, coverage sample, compliance, CRM write rules, freeze the demo sheet.",
      caption:
        "Start from the blocking job and CRM write rules — not from vendor feature grids.",
    },
  },
  {
    type: "figure",
    id: "requirements-matrix-visual",
    title: "Must-have vs nice-to-have by job",
    src: "/guides/sales-intelligence-requirements-matrix.png",
    alt: "Sales intelligence requirements matrix separating must-have outcomes by primary job from nice-to-haves, with compliance and CRM write columns.",
    caption:
      "Must-haves unblock the weekly loop for your primary job; nice-to-haves wait until coverage and sync are trusted.",
  },
  {
    type: "step",
    id: "write-job-outcomes",
    stepNumber: 1,
    heading: "Name the primary job and three 90-day outcomes",
    body: "Pick one blocking job — build net-new lists (data), complete records you own (enrichment), run multichannel sequences (engagement), or dial at volume (dialer). Then write three outcomes your team can observe weekly.\n\nExample: a 4-person SDR pod at a mid-market SaaS company writes: (1) every SDR starts Monday with 150 verified ICP contacts, (2) credits for emails and mobiles stay visible before burn-out, (3) CRM pushes never overwrite AE ownership. Sequencing already works in their stack, so cadence features stay nice-to-have.",
    tip: "If a stakeholder cannot describe how they will verify the outcome in a Friday review, rewrite the outcome.",
    figure: {
      src: "/guides/sales-intelligence-requirements-guide-hero.png",
      alt: "Sales intelligence requirements guide hero: primary job, must-haves, compliance, and CRM write rules feeding a demo-ready requirements sheet.",
      caption:
        "Requirements start from the blocking job and write rules — not from a marketplace feature grid.",
    },
    scenarios: [
      {
        title: "Data job",
        body: "Usable contacts for your ICP without rebuilding lists in spreadsheets.",
      },
      {
        title: "Enrichment job",
        body: "Match rate and field fill on records you already own.",
      },
      {
        title: "Engagement / dialer job",
        body: "Sequences or connect volume that reps finish without admin help.",
      },
    ],
  },
  {
    type: "step",
    id: "compliance-crm-write",
    stepNumber: 2,
    heading: "Freeze compliance posture and CRM write rules",
    body: "List regions you prospect, who owns privacy review, and what sourcing / opt-out docs you need from vendors. Separately write four CRM rules: fields the tool may write, fields it may never overwrite, duplicate match keys (email, domain, company ID), and what happens when systems disagree.\n\nExample: the same SDR pod names RevOps as CRM owner and legal as privacy reviewer for EU/UK outreach. Write rules: SI may fill email, phone, title, and company size; may never overwrite Owner, Lifecycle Stage, or Deal fields; match on work email then domain; conflicts leave the CRM value and log a review flag.",
    tip: "Push 50 records first with these rules — never 5,000 — before you call sync “done.”",
    figure: {
      src: "/guides/sales-intelligence-requirements-crm-write.png",
      alt: "CRM write rules diagram: allowed write fields, never-overwrite fields, duplicate match keys, and conflict handling between sales intelligence and CRM.",
      caption:
        "A must-have without overwrite and dedupe rules is adoption debt waiting to happen.",
    },
    scenarios: [
      {
        title: "Allowed writes",
        body: "Contact and firmographic fields only — unless enrichment is the job.",
      },
      {
        title: "Never overwrite",
        body: "Owner, stage, and revenue fields stay CRM-owned.",
      },
      {
        title: "Compliance gate",
        body: "Sourcing docs + suppression list before first send in regulated regions.",
      },
    ],
  },
  {
    type: "feature-matrix",
    id: "must-nice-matrix",
    title: "Must-have vs nice-to-have (starter by job)",
    rows: [
      {
        feature: "ICP filters that match your market",
        mustHave: true,
        niceToHave: false,
        notes: "Data / enrichment core",
      },
      {
        feature: "Verified work emails (spot-checkable)",
        mustHave: true,
        niceToHave: false,
        notes: "Pass/fail on sample",
      },
      {
        feature: "Credit & export visibility",
        mustHave: true,
        niceToHave: false,
        notes: "Burn before month-end",
      },
      {
        feature: "CRM sync + written overwrite rules",
        mustHave: true,
        niceToHave: false,
        notes: "Constraint, not wishlist",
      },
      {
        feature: "Suppression / do-not-contact handling",
        mustHave: true,
        niceToHave: false,
        notes: "Day-one compliance",
      },
      {
        feature: "Multichannel sequences",
        mustHave: false,
        niceToHave: true,
        notes: "Must only if engagement is the job",
      },
      {
        feature: "Power / parallel dialer",
        mustHave: false,
        niceToHave: true,
        notes: "Must only if dialer is the job",
      },
      {
        feature: "Intent signals / AI research agents",
        mustHave: false,
        niceToHave: true,
        notes: "Do not drive the buy",
      },
    ],
    figure: {
      src: "/guides/sales-intelligence-requirements-matrix.png",
      alt: "Must-have versus nice-to-have sales intelligence feature matrix by primary job.",
      caption: "Reuse this split in every vendor demo and trial scorecard.",
    },
  },
  {
    type: "selection-checklist",
    id: "requirements-dimensions",
    title: "Requirements sheet dimensions",
    dimensions: [
      {
        id: "job",
        label: "Primary job",
        options: [
          "Build new lists (data)",
          "Enrich records I own",
          "Run sequences",
          "Dial at volume",
        ],
      },
      {
        id: "coverage",
        label: "Coverage tests",
        options: [
          "200 ICP accounts sampled",
          "Usable email rate",
          "Phone type needed",
          "Spot-check 20 records",
        ],
      },
      {
        id: "credits",
        label: "Credits & export",
        options: [
          "What one credit unlocks",
          "Email vs phone pricing",
          "Rollover / top-ups",
          "Export / API caps",
        ],
      },
      {
        id: "compliance",
        label: "Compliance",
        options: [
          "Regions prospected",
          "Sourcing docs needed",
          "Opt-out / deletion path",
          "Privacy owner named",
        ],
      },
      {
        id: "crm-write",
        label: "CRM write rules",
        options: [
          "Allowed write fields",
          "Never-overwrite fields",
          "Match keys",
          "Conflict handling",
        ],
      },
    ],
  },
  {
    type: "checklist",
    id: "sheet-ready",
    title: "Demo-ready requirements sheet",
    copyable: true,
    items: [
      {
        id: "primary-job",
        label: "Primary job + three 90-day outcomes written",
        description: "Observable in a weekly review.",
        order: 0,
      },
      {
        id: "must-split",
        label: "Must vs nice split agreed by job",
        description: "Each must-have has a pass/fail check.",
        order: 1,
      },
      {
        id: "crm-write",
        label: "CRM write / overwrite / dedupe rules written",
        description: "Testable on a 50-record push.",
        order: 2,
      },
      {
        id: "compliance",
        label: "Compliance owners and sourcing asks listed",
        description: "Regions, privacy owner, suppression.",
        order: 3,
      },
    ],
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "Requirements mistakes",
    items: [
      {
        title: "Starting from vendor feature grids",
        body: "You will inflate nice-to-haves and skip the coverage sample vendors cannot fake in a scripted demo.",
      },
      {
        title: "Must-haves without ICP tests",
        body: "“Good data” means nothing until you define the 200-account sample and usable-email bar.",
      },
      {
        title: "Ignoring CRM write and overwrite rules",
        body: "A perfect database fails if it duplicates contacts or wipes AE ownership on first sync.",
      },
      {
        title: "Treating vendor compliance claims as your legal basis",
        body: "Sourcing docs inform the buy; outreach lawfulness stays with your privacy owner.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "How do I write sales intelligence requirements?",
        answer:
          "Start with the primary job and three observable 90-day outcomes, split must vs nice with pass/fail checks, then freeze coverage sample criteria, credit/export asks, compliance owners, and CRM write rules. You are ready for demos when the sheet alone can drive a consistent script across vendors.",
      },
      {
        question: "What belongs on a sales intelligence requirements sheet?",
        answer:
          "Primary job, outcomes, must-haves with tests, nice-to-haves, ICP coverage sample, credit/export model, sourcing and opt-out docs, CRM write/overwrite/dedupe rules, and named owners for buyer, daily users, and RevOps/privacy.",
      },
      {
        question: "How many must-haves should we list?",
        answer:
          "Prefer a short list tied to the primary job and three outcomes. Long must-have lists recreate feature shopping across data, engagement, and dialer capabilities you will not use.",
      },
      {
        question: "What are CRM write rules?",
        answer:
          "Agreed field-level rules for what the sales intelligence tool may write into CRM, what it may never overwrite, how duplicates are matched, and how conflicts are resolved — tested on a small push before any bulk import.",
      },
      {
        question: "What should I do next?",
        answer:
          "Use the sheet in the Sales Intelligence Evaluation Guide’s two-week trial scorecard, or shortlist with How to Choose Sales Intelligence and the Best Sales Intelligence Software page once must-haves and constraints are clear.",
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
        description: "Full selection framework by primary job.",
      },
      {
        href: "/guides/sales-intelligence-evaluation-guide/",
        label: "Sales intelligence evaluation guide",
        description: "Two-week trial scorecard.",
      },
      {
        href: "/best/sales-intelligence-software/",
        label: "Best sales intelligence software",
        description: "Researched shortlist with methodology.",
      },
      {
        href: "/guides/sales-intelligence-vs-sales-engagement/",
        label: "SI vs sales engagement",
        description: "Data layer vs sequencing layer.",
      },
      {
        href: "/guides/when-to-adopt-sales-intelligence/",
        label: "When to adopt sales intelligence",
        description: "Timing signals before you write the sheet.",
      },
      {
        href: "/guides/how-to-choose-crm/",
        label: "How to choose a CRM",
        description: "System of record your SI tool will feed.",
      },
      {
        href: "/guides/crm-data-hygiene/",
        label: "CRM data hygiene",
        description: "Keep enriched records trustworthy after sync.",
      },
      {
        href: "/software/apollo/",
        label: "Apollo.io (catalogue example)",
        description: "Combined data + engagement example — not a ranking.",
      },
      {
        href: "/software/bookyourdata/",
        label: "BookYourData (catalogue example)",
        description: "Pay-as-you-go data example — not a ranking.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "how-to-choose-cta",
    title: "Turn the sheet into a shortlist",
    body: "Once outcomes, must-haves, compliance, and CRM write rules are on the sheet, use How to Choose Sales Intelligence and the Best Sales Intelligence page — methodology-first, not affiliate-ordered.",
    href: "/guides/how-to-choose-sales-intelligence/",
    ctaLabel: "How to choose →",
    variant: "generic",
  },
  {
    type: "interactive-cta",
    id: "best-cta",
    title: "Compare researched options",
    body: "Open the Best Sales Intelligence Software shortlist after your requirements sheet is frozen — rankings follow published criteria, not commissions.",
    href: "/best/sales-intelligence-software/",
    ctaLabel: "See Best SI Software →",
    variant: "finder",
  },
];

export const salesIntelligenceRequirementsGuide: GuidePage = {
  id: "guide-sales-intelligence-requirements-guide",
  slug: "sales-intelligence-requirements-guide",
  title:
    "Sales Intelligence Requirements Guide: Must-Haves, Compliance & CRM Write Rules",
  summary:
    "Write demo-ready sales intelligence requirements from the primary job, must vs nice features, compliance posture, and CRM write rules — without feature-wishlist shopping.",
  categorySlugs: ["sales-intelligence"],
  productSlugs: [],
  topicType: "selection",
  journeyStage: "choose",
  knowledgeAreaSlug: "selection",
  heroVisual: {
    src: "/guides/sales-intelligence-requirements-guide-hero.png",
    alt: "Sales intelligence requirements guide hero: primary job, must-haves, compliance, and CRM write rules feeding a demo-ready requirements sheet.",
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
    "sales-intelligence-evaluation-guide",
    "sales-intelligence-vs-sales-engagement",
    "when-to-adopt-sales-intelligence",
    "how-to-choose-crm",
    "crm-data-hygiene",
  ],
  blocks: salesIntelligenceRequirementsGuideBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "job",
      label: "Name primary job + three outcomes",
      description: "Observable in weekly reviews.",
      order: 0,
    },
    {
      id: "must-nice",
      label: "Split must vs nice with tests",
      description: "Pass/fail checks for each must-have.",
      order: 1,
    },
    {
      id: "crm-write",
      label: "Freeze CRM write & compliance rules",
      description: "Overwrite, dedupe, privacy owner.",
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
    title: "Sales Intelligence Requirements Guide | SoftwareGlimpse",
    description:
      "How to write sales intelligence requirements: primary job, must vs nice, compliance, and CRM write rules — ready for fair demos and trials.",
    canonicalPath: "/guides/sales-intelligence-requirements-guide/",
    indexable: true,
  },
};
