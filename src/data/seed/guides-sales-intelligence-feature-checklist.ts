import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * Sales intelligence feature checklist — must vs nice by job.
 * Template: softwareglimpse-guide-template-v1
 */
const salesIntelligenceFeatureChecklistBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Build a sales intelligence feature checklist from the primary job first — data, enrichment, engagement, or dialer — then mark must-haves that unblock that job and keep everything else nice-to-have. Decision rule: a capability is a must-have only if you can write a pass/fail trial check for it; CRM sync rules, credit definitions, and compliance gates belong on the sheet as constraints, not as optional polish.",
    bullets: [
      "Primary job first",
      "Must vs nice by job",
      "CRM sync rules",
      "Credit & export clarity",
      "Compliance gates",
      "Copyable demo sheet",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "One job owns the must-haves",
        body: "A dialer’s must-haves are not a database’s must-haves. Marking everything “must” recreates feature shopping.",
      },
      {
        label: "CRM sync is a day-one constraint",
        body: "Field mapping, overwrite rules, and duplicate matching belong on the sheet before you compare AI agents.",
      },
      {
        label: "Credits are product features",
        body: "What one credit unlocks, rollover, and export caps decide whether the tool is usable — treat them as requirements.",
      },
      {
        label: "Compliance is yours to gate",
        body: "Sourcing docs and opt-out handling go on the sheet; lawful basis for outreach stays with your privacy owner.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "checklist-path",
    title: "Feature checklist path",
    steps: [
      { id: "job", label: "Job", short: "Primary job" },
      { id: "must", label: "Must", short: "Job must-haves" },
      { id: "sync", label: "Sync", short: "CRM rules" },
      { id: "credits", label: "Credits", short: "Usage model" },
      { id: "compliance", label: "Compliance", short: "Sourcing gates" },
      { id: "freeze", label: "Freeze", short: "Copyable sheet" },
    ],
    ctaHref: "/guides/how-to-choose-sales-intelligence/",
    ctaLabel: "Selection framework →",
    figure: {
      src: "/guides/sales-intelligence-feature-checklist-path.png",
      alt: "Sales intelligence feature checklist path: name primary job, mark must-haves, add CRM sync rules, decode credits, set compliance gates, freeze the sheet.",
      caption:
        "Freeze must-haves from the job and constraints — not from a vendor feature grid.",
    },
  },
  {
    type: "figure",
    id: "matrix-visual",
    title: "Must-have vs nice-to-have",
    src: "/guides/sales-intelligence-feature-checklist-matrix.png",
    alt: "Must-have versus nice-to-have matrix for sales intelligence capabilities including ICP filters, verified emails, CRM mapping, credits, exports, suppression, mobiles, sequences, dialer, intent, and AI agents.",
    caption:
      "Must-haves unblock the named job; nice-to-haves wait until the core loop works in a trial week.",
  },
  {
    type: "step",
    id: "by-job",
    stepNumber: 1,
    heading: "Must-haves by primary job",
    body: "Copy only the column that matches your blocking job. If two jobs truly block you, keep two short lists — do not merge them into one “platform” wishlist.\n\nExample: a three-person SDR pod blocked on Monday list building marks data must-haves (ICP filters, verified work emails, bulk export, CRM push). Sequences in Apollo or Reply stay nice-to-have until the weekly list loop works. A phone-led team of eight would flip dialer rows to must-have and leave database depth as nice-to-have if lists already exist.",
    tip: "Write each must-have as a trial check: “Search our ICP live and export 50 verified emails to CRM without admin help.”",
    figure: {
      src: "/guides/sales-intelligence-feature-checklist-hero.png",
      alt: "Sales intelligence feature checklist board with columns for Data, Enrichment, Engagement, and Dialer plus CRM sync, credits, and compliance notes.",
      caption:
        "Four jobs share a category label — only one column should drive your must-haves this quarter.",
    },
    scenarios: [
      {
        title: "Data (list building)",
        body: "ICP search filters, verified work emails, usable phone types you need, bulk export, saved searches.",
      },
      {
        title: "Enrichment",
        body: "Match on email/domain/company ID, fill title/email/phone, refresh cadence, overwrite controls, API or bulk pass.",
      },
      {
        title: "Engagement",
        body: "Multichannel sequences, mailbox limits, reply/OOO detection, task creation, deliverability controls.",
      },
      {
        title: "Dialer",
        body: "Power/parallel dialing, local presence behaviour, dispositions, recordings/notes to CRM, connect reporting.",
      },
    ],
  },
  {
    type: "step",
    id: "constraints",
    stepNumber: 2,
    heading: "CRM sync, credits, and compliance on every sheet",
    body: "These are not “nice extras.” Without them, even strong coverage fails in week two.\n\nExample: a solo RevOps owner enriching ~18,000 CRM records puts on the sheet: two-way field map (title, email, phone only), never overwrite owner or lifecycle stage, credit definition for email vs mobile, and vendor sourcing docs for a privacy review before EU outreach. Tools like Lusha, RocketReach, or Closely only advance if those constraints pass — regardless of database marketing claims.",
    tip: "Push 50 records in trial before 5,000. Duplicate and overwrite bugs are cheap at 50.",
    scenarios: [
      {
        title: "CRM sync rules",
        body: "Which fields may write, which may never overwrite, how duplicates match, who wins on conflict.",
      },
      {
        title: "Credit & export clarity",
        body: "What one credit unlocks, rollover, monthly caps, mid-cycle top-ups, bulk/API export rights.",
      },
      {
        title: "Compliance gates",
        body: "Data origin, opt-out/deletion handling, regional processing terms, suppression list support.",
      },
    ],
  },
  {
    type: "feature-matrix",
    id: "must-nice-matrix",
    title: "Starter must-have vs nice-to-have matrix",
    rows: [
      {
        feature: "ICP search filters (industry, title, size, region)",
        mustHave: true,
        niceToHave: false,
        notes: "Must for data job",
      },
      {
        feature: "Verified work emails",
        mustHave: true,
        niceToHave: false,
        notes: "Ask how verification works",
      },
      {
        feature: "CRM sync with field mapping",
        mustHave: true,
        niceToHave: false,
        notes: "Day-one constraint",
      },
      {
        feature: "Credit / usage visibility",
        mustHave: true,
        niceToHave: false,
        notes: "Reps see burn mid-month",
      },
      {
        feature: "Export or API access to your records",
        mustHave: true,
        niceToHave: false,
        notes: "Confirm plan gates",
      },
      {
        feature: "Suppression / do-not-contact handling",
        mustHave: true,
        niceToHave: false,
        notes: "Needed before send",
      },
      {
        feature: "Direct dials / mobiles",
        mustHave: false,
        niceToHave: true,
        notes: "Must for phone-led teams",
      },
      {
        feature: "Multichannel sequences",
        mustHave: false,
        niceToHave: true,
        notes: "Must if engagement is the job",
      },
      {
        feature: "Power or parallel dialer",
        mustHave: false,
        niceToHave: true,
        notes: "Must if dialer is the job",
      },
      {
        feature: "Buying-intent signals",
        mustHave: false,
        niceToHave: true,
        notes: "After list loop works",
      },
      {
        feature: "AI research / writing agents",
        mustHave: false,
        niceToHave: true,
        notes: "Do not drive the buy",
      },
    ],
    figure: {
      src: "/guides/sales-intelligence-feature-checklist-matrix.png",
      alt: "Must-have versus nice-to-have sales intelligence feature matrix.",
      caption: "Reuse this split in every demo script and trial scorecard.",
    },
  },
  {
    type: "selection-checklist",
    id: "sheet-dimensions",
    title: "Checklist sheet dimensions",
    dimensions: [
      {
        id: "primary-job",
        label: "Primary job",
        options: [
          "Build new lists",
          "Enrich records I own",
          "Run sequences",
          "Dial at volume",
        ],
      },
      {
        id: "must-tests",
        label: "Must-have trial tests",
        options: [
          "Search our ICP live",
          "Export 50 verified contacts",
          "Push to CRM with mapping",
          "Show credit burn",
          "Honour suppression list",
        ],
      },
      {
        id: "crm-rules",
        label: "CRM sync rules",
        options: [
          "Writable fields listed",
          "Protected fields listed",
          "Dedupe key agreed",
          "Conflict rule written",
        ],
      },
      {
        id: "credits",
        label: "Credit constraints",
        options: [
          "Email vs phone pricing",
          "Rollover policy",
          "Monthly export cap",
          "Mid-cycle top-ups",
        ],
      },
      {
        id: "compliance",
        label: "Compliance gates",
        options: [
          "Sourcing documentation",
          "Opt-out handling",
          "EU / UK review needed",
          "Regulated industry review",
        ],
      },
    ],
  },
  {
    type: "checklist",
    id: "copyable-sheet",
    title: "Copyable feature checklist (freeze before demos)",
    copyable: true,
    items: [
      {
        id: "job-named",
        label: "Primary job named in one sentence",
        description: "Observable weekly outcome, not a vendor product name.",
        order: 0,
      },
      {
        id: "must-split",
        label: "Must vs nice split agreed",
        description: "Each must-have has a pass/fail trial check.",
        order: 1,
      },
      {
        id: "crm-rules",
        label: "CRM sync rules written",
        description: "Writable fields, protected fields, dedupe, conflict winner.",
        order: 2,
      },
      {
        id: "credits",
        label: "Credit & export questions listed",
        description: "Definition, caps, rollover, top-ups, export rights.",
        order: 3,
      },
      {
        id: "compliance",
        label: "Compliance gates listed",
        description: "Sourcing docs, opt-out, regional review owner.",
        order: 4,
      },
      {
        id: "examples",
        label: "Example products noted (not ranked)",
        description:
          "e.g. Apollo, Lusha, RocketReach, Amplemarket, Closely, BookYourData, Reply, Kixie — alphabetical for trials only.",
        order: 5,
      },
    ],
  },
  {
    type: "product-shortlist",
    id: "examples",
    title: "Catalogue examples (not a ranking)",
    body: "Use these alphabetical catalogue examples when you need something concrete to score against the sheet — affiliate status does not set order. The researched ranking lives on Best Sales Intelligence Software.",
    productSlugs: [
      "amplemarket",
      "apollo",
      "bookyourdata",
      "closely",
      "kixie",
      "lusha",
      "reply",
      "rocketreach",
    ],
    disclaimer:
      "Affiliate relationships never determine which products appear here or in what order.",
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "Checklist mistakes",
    items: [
      {
        title: "Starting from vendor feature grids",
        body: "You will inflate nice-to-haves and skip CRM sync and credit constraints vendors gloss over in demos.",
      },
      {
        title: "Marking every job’s features as must-have",
        body: "That is how teams buy a weaker database because the dialer looked impressive.",
      },
      {
        title: "Must-haves without trial tests",
        body: "“Good data” means nothing until you define the ICP search and verification check.",
      },
      {
        title: "Leaving compliance off the sheet",
        body: "Sourcing and opt-out handling are late surprises when EU outreach is already planned.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "What belongs on a sales intelligence feature checklist?",
        answer:
          "The primary job, must-haves with pass/fail trial checks, nice-to-haves, CRM sync rules, credit and export constraints, and compliance gates with a named privacy owner. Freeze the sheet before demos so every vendor answers the same script.",
      },
      {
        question: "How many must-haves should we list?",
        answer:
          "Keep them short and tied to one job — typically a handful of day-one capabilities plus sync, credits, and compliance. Long must-have lists recreate feature shopping.",
      },
      {
        question: "Are sequences must-have if we buy a database?",
        answer:
          "Only if engagement is also a blocking job. Example: the SDR pod keeps sequences nice-to-have until Monday list building works; Reply or Apollo sequences can be evaluated in a second pass.",
      },
      {
        question: "Do we need a dialer on the same sheet?",
        answer:
          "Include dialer rows only if phone volume is a stated job. Otherwise keep Kixie-style capabilities as nice-to-have so they do not dominate scoring.",
      },
      {
        question: "What should I do next?",
        answer:
          "Run the sheet through How to choose sales intelligence, then compare researched options on Best Sales Intelligence Software — or decode commercials in the SI pricing guide.",
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
        description: "Full selection framework and trial plan.",
      },
      {
        href: "/best/sales-intelligence-software/",
        label: "Best sales intelligence software",
        description: "Researched shortlist with methodology.",
      },
      {
        href: "/guides/do-i-need-sales-intelligence/",
        label: "Do I need sales intelligence?",
        description: "Confirm need before checklist depth.",
      },
      {
        href: "/guides/sales-intelligence-pricing-guide/",
        label: "SI pricing guide",
        description: "Seats, credits, first-90-day quotes.",
      },
      {
        href: "/guides/crm-data-hygiene/",
        label: "CRM data hygiene",
        description: "Keep enriched records trustworthy.",
      },
      {
        href: "/guides/how-to-choose-crm/",
        label: "How to choose a CRM",
        description: "System of record SI will feed.",
      },
      {
        href: "/categories/sales-intelligence/",
        label: "Sales intelligence category",
        description: "Browse catalogue products.",
      },
      {
        href: "/software/lusha/",
        label: "Lusha review",
        description: "Example enrichment / contact data tool.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "choose-cta",
    title: "Turn the checklist into a shortlist",
    body: "With must-haves frozen, use the job-first selection framework — then compare researched options without affiliate-ordered rankings.",
    href: "/guides/how-to-choose-sales-intelligence/",
    ctaLabel: "How to choose sales intelligence →",
    variant: "generic",
  },
];

export const salesIntelligenceFeatureChecklistGuide: GuidePage = {
  id: "guide-sales-intelligence-feature-checklist",
  slug: "sales-intelligence-feature-checklist",
  title: "Sales Intelligence Feature Checklist: Must-Have vs Nice-to-Have",
  summary:
    "Build a copyable sales intelligence feature checklist by primary job — data, enrichment, engagement, or dialer — with CRM sync, credit, and compliance constraints baked in.",
  categorySlugs: ["sales-intelligence"],
  productSlugs: [
    "apollo",
    "lusha",
    "rocketreach",
    "amplemarket",
    "closely",
    "bookyourdata",
    "reply",
    "kixie",
  ],
  topicType: "selection",
  journeyStage: "choose",
  knowledgeAreaSlug: "selection",
  heroVisual: {
    src: "/guides/sales-intelligence-feature-checklist-hero.png",
    alt: "Sales intelligence feature checklist board with Data, Enrichment, Engagement, and Dialer columns plus CRM sync, credits, and compliance.",
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
    "do-i-need-sales-intelligence",
    "sales-intelligence-pricing-guide",
    "how-to-choose-crm",
    "crm-data-hygiene",
  ],
  blocks: salesIntelligenceFeatureChecklistBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "job",
      label: "Name the primary job",
      description: "Data, enrichment, engagement, or dialer.",
      order: 0,
    },
    {
      id: "must-nice",
      label: "Split must vs nice",
      description: "Each must-have has a trial check.",
      order: 1,
    },
    {
      id: "constraints",
      label: "Add sync, credits, compliance",
      description: "Day-one constraints on the sheet.",
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
    title: "Sales Intelligence Feature Checklist | SoftwareGlimpse",
    description:
      "Copyable must-have vs nice-to-have checklist for sales intelligence by job — plus CRM sync, credits, and compliance gates.",
    canonicalPath: "/guides/sales-intelligence-feature-checklist/",
    indexable: true,
  },
};
