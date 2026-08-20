import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * Fundamental sales intelligence guide — same `softwareglimpse-guide-template-v1`
 * chrome as CRM fundamentals (hero CTAs + framework visual + block renderer).
 */
const whatIsSalesIntelligenceBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Sales intelligence (SI) software finds, verifies, and enriches B2B contact and company data so outbound teams can prospect without rebuilding lists by hand — it is a data and outreach layer, not a CRM. Decision rule: if your blocking job this quarter is “who should we contact, with accurate emails or dials,” you need sales intelligence; if the blocking job is “who owns this deal and what happened last,” you need a CRM.",
    bullets: [
      "Find & filter contacts",
      "Verify emails & dials",
      "Enrich company fields",
      "Push into CRM / sequences",
      "Not a system of record",
      "Job decides the tool shape",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "SI ≠ CRM",
        body: "CRM stores ownership, pipeline, and history. Sales intelligence fills gaps in who to contact and with what details — then feeds the CRM.",
      },
      {
        label: "Four jobs under one label",
        body: "Contact databases, enrichment, engagement sequences, and dialers all sit in “sales intelligence,” but they fail for different reasons. Name the job first.",
      },
      {
        label: "Coverage beats record count",
        body: "Vendor database size is marketing. What matters is usable matches on your ICP, seniority band, and region.",
      },
      {
        label: "Credits and sync decide cost",
        body: "Credit definitions and CRM overwrite rules usually matter more than list price when volume ramps.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "si-building-blocks",
    title: "Sales intelligence building blocks",
    steps: [
      { id: "block-source", label: "Source", short: "Find people & firms" },
      { id: "block-filter", label: "Filter", short: "Match your ICP" },
      { id: "block-verify", label: "Verify", short: "Emails & dials" },
      { id: "block-enrich", label: "Enrich", short: "Titles & firmographics" },
      { id: "block-export", label: "Export / sync", short: "CRM or sequence" },
      { id: "block-compliance", label: "Compliance", short: "Sourcing & opt-out" },
    ],
    ctaHref: "/guides/how-to-choose-sales-intelligence/",
    ctaLabel: "How to choose sales intelligence →",
    figure: {
      src: "/guides/what-is-sales-intelligence-building-blocks.png",
      alt: "Six sales intelligence building blocks: source, filter, verify, enrich, export or sync, and compliance.",
      caption:
        "These blocks define sales intelligence for outbound — CRM still owns deals and activity history.",
    },
  },
  {
    type: "step",
    id: "how-it-works",
    stepNumber: 1,
    heading: "How does sales intelligence work?",
    body: "Most SI products share a simple loop: search a database (or enrich records you already own), filter to your ICP, verify contact details, enrich firmographics or technographics, then push results into a CRM or sequence tool so reps can act.\n\nExample: a three-person SDR pod at Harbor Analytics (42-person B2B SaaS) starts Monday without a fresh list. They filter for Heads of Revenue Ops at 200–1,000-employee companies in their region, verify work emails, enrich company size and tech stack, sync 150 contacts into their CRM, and load a cadence — without treating the SI tool as the place deals live.",
    tip: "Write the weekly outcome you need (“150 verified ICP contacts in CRM by Monday”) before you compare vendors.",
    figure: {
      src: "/guides/what-is-sales-intelligence-loop.png",
      alt: "Sales intelligence loop: source, filter, verify, enrich, then push to CRM or sequence.",
      caption: "SI closes the data gap; CRM and sequences close the follow-up gap.",
    },
    scenarios: [
      {
        title: "Source",
        body: "Search a contact/company database or upload accounts you already own.",
      },
      {
        title: "Filter",
        body: "Narrow by role, seniority, company size, industry, and region.",
      },
      {
        title: "Verify",
        body: "Confirm work emails and/or direct dials before you burn sending capacity.",
      },
      {
        title: "Enrich",
        body: "Fill missing titles, firmographics, or signals on known records.",
      },
      {
        title: "Push",
        body: "Sync into CRM ownership fields or load a sequence/dialer workflow.",
      },
    ],
  },
  {
    type: "step",
    id: "what-it-includes",
    stepNumber: 2,
    heading: "What sales intelligence typically includes",
    body: "Core SI products cover contact and company search, verification, enrichment, and export or CRM sync. Many add sequences, LinkedIn workflows, or dialers. Those extras are adjacent jobs — useful when they match your stack, not proof that one tool replaces CRM.\n\nCatalogue examples (alphabetical, not a ranking): Amplemarket, Apollo, BookYourData, Closely, Kixie, Lusha, Reply, and RocketReach illustrate different mixes of data, engagement, and dialing. Compare them by primary job and coverage on your ICP — never by affiliate order or invented scores.",
    tip: "If a vendor homepage says “CRM,” check whether it is a lightweight contact store or a true pipeline system of record before you drop your real CRM.",
  },
  {
    type: "crm-types",
    id: "si-shapes",
    title: "Common sales intelligence shapes (not rankings)",
    types: [
      {
        id: "contact-database",
        title: "Contact / company database",
        bestFor:
          "Teams that need net-new lists: searchable people and firms with filters that match an ICP.",
        avoidWhen:
          "Your main pain is incomplete records you already own, or dial volume — not finding new contacts.",
      },
      {
        id: "enrichment",
        title: "Enrichment-focused tool",
        bestFor:
          "RevOps or sales ops that already own accounts and need missing emails, titles, and firmographics.",
        avoidWhen:
          "You have almost no target account list yet and need discovery more than backfill.",
      },
      {
        id: "engagement",
        title: "Engagement / sequencing platform",
        bestFor:
          "Outbound pods whose contacts exist but follow-up dies without multichannel cadences.",
        avoidWhen:
          "Your blocking job is still “we cannot find accurate contacts,” not “we cannot execute outreach.”",
      },
      {
        id: "dialer",
        title: "Dialer-led sales intelligence",
        bestFor:
          "Phone-led teams that need connect volume, local presence, and automatic call logging into CRM.",
        avoidWhen:
          "Email-first outbound with light calling — a full dialer may be overkill.",
      },
    ],
  },
  {
    type: "feature-matrix",
    id: "si-vs-crm-jobs",
    title: "Sales intelligence vs CRM by job",
    rows: [
      {
        feature: "Find net-new ICP contacts",
        mustHave: true,
        niceToHave: false,
        notes: "SI primary job",
      },
      {
        feature: "Verify emails / dials before outreach",
        mustHave: true,
        niceToHave: false,
        notes: "SI strength",
      },
      {
        feature: "Enrich missing fields on known accounts",
        mustHave: true,
        niceToHave: false,
        notes: "SI / enrichment",
      },
      {
        feature: "Shared deal ownership & stages",
        mustHave: false,
        niceToHave: true,
        notes: "CRM system of record",
      },
      {
        feature: "Activity history across handoffs",
        mustHave: false,
        niceToHave: true,
        notes: "CRM, not SI",
      },
      {
        feature: "Weekly pipeline reporting",
        mustHave: false,
        niceToHave: true,
        notes: "CRM reporting job",
      },
    ],
  },
  {
    type: "step",
    id: "when-you-need-si",
    stepNumber: 3,
    heading: "When do you need sales intelligence?",
    body: "SI usually pays off when outbound volume outgrows LinkedIn stalking and personal networks, when bounce rates or wrong titles waste sequence capacity, or when RevOps cannot trust CRM fields without constant manual cleanup.\n\nExample: Mira, RevOps lead at a 28-person consultancy, inherited 12,000 CRM contacts with missing titles and stale emails. Buying another sequencer would not help — enrichment and verification on known accounts was the blocking job. After a coverage test on 200 target accounts, she shortlisted enrichment-capable tools from the catalogue rather than “all-in-one” marketing claims.",
    tip: "If follow-ups already fail because nobody owns the deal, fix CRM ownership first — SI will only feed a messy system faster.",
  },
  {
    type: "mistakes",
    id: "common-mistakes",
    title: "Common beginner mistakes",
    items: [
      {
        title: "Treating SI as a CRM replacement",
        body: "Contact databases and sequencers do not replace shared deal ownership, stages, and activity history.",
      },
      {
        title: "Buying on total record count",
        body: "Global database size says nothing about your niche, region, or seniority band.",
      },
      {
        title: "Ignoring credit and export rules",
        body: "Two plans with similar seat prices can diverge wildly once verification, mobile dials, and exports consume credits.",
      },
      {
        title: "Pushing data without sync rules",
        body: "One-way imports without duplicate matching and overwrite policy create a dirtier CRM, not a fuller one.",
      },
    ],
  },
  {
    type: "checklist",
    id: "need-si-signals",
    title: "Signals you need sales intelligence (not another spreadsheet of leads)",
    copyable: true,
    items: [
      {
        id: "signal-list-drought",
        label: "SDRs start the week without a fresh, ICP-matched list",
        description: "Manual LinkedIn / spreadsheet building cannot keep up with outbound capacity.",
        order: 0,
      },
      {
        id: "signal-bounces",
        label: "Bounce rates or wrong titles burn sequences",
        description: "Verification and enrichment matter before you scale sending.",
        order: 1,
      },
      {
        id: "signal-crm-gaps",
        label: "CRM records exist but key fields are empty or stale",
        description: "Enrichment on owned accounts is a different job than net-new discovery.",
        order: 2,
      },
      {
        id: "signal-dial-volume",
        label: "Connect rate is the constraint on a phone-led motion",
        description: "Direct dials and dialer workflow may be the SI shape you need.",
        order: 3,
      },
      {
        id: "signal-not-crm",
        label: "Pipeline ownership and history already live in a CRM",
        description: "You need a data/outreach layer — not a second system of record.",
        order: 4,
      },
    ],
  },
  {
    type: "callout",
    id: "how-we-define-si",
    title: "How SoftwareGlimpse uses “sales intelligence” on this page",
    body: "We mean tools that help B2B teams find, verify, enrich, and route contact/company data into outbound workflows — including databases, enrichment, engagement, and dialers that sit in this category. We do not mean a sales CRM system of record. Product mentions stay catalogue-based and alphabetical or job-based; we do not invent vendor scores, dollar ROI totals, or affiliate-ordered rankings.",
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "What is sales intelligence software?",
        answer:
          "Sales intelligence software helps teams find, verify, and enrich B2B contact and company data for outbound prospecting, then push those records into a CRM or sequence tool. It is a data and outreach layer — not a replacement for a CRM system of record.",
      },
      {
        question: "Is sales intelligence the same as a CRM?",
        answer:
          "No. CRM owns who you sell to, deal stages, and activity history. Sales intelligence fills and refreshes contact data so outbound can run. Most teams use both; see sales intelligence vs CRM when you need the boundary spelled out.",
      },
      {
        question: "What jobs does sales intelligence cover?",
        answer:
          "Four common shapes: contact/company databases (net-new lists), enrichment (complete records you own), engagement/sequences (execute outreach), and dialers (phone connect volume). Name the blocking job before you shortlist.",
      },
      {
        question: "Which products are examples of sales intelligence?",
        answer:
          "From the SoftwareGlimpse catalogue, examples include Amplemarket, Apollo, BookYourData, Closely, Kixie, Lusha, Reply, and RocketReach — listed alphabetically as category examples, not as a ranked shortlist. Use the Best page and how-to-choose guide for researched comparison criteria.",
      },
      {
        question: "Do I need sales intelligence if I already have LinkedIn?",
        answer:
          "LinkedIn is useful for research and warm paths. Dedicated SI tools usually win when you need repeatable ICP filters, verification at volume, enrichment into CRM fields, or dialer/sequence workflows that LinkedIn alone does not provide.",
      },
      {
        question: "What should I do after I understand what sales intelligence is?",
        answer:
          "Read How sales intelligence works for the source → verify → sync loop, then How to choose sales intelligence for a buying framework. Browse the sales intelligence category and Best sales intelligence software when you are ready to compare researched options — affiliate status does not set order.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related sales intelligence resources",
    links: [
      {
        href: "/guides/how-sales-intelligence-works/",
        label: "How sales intelligence works",
        description: "Source, filter, verify, enrich, and CRM sync loop.",
      },
      {
        href: "/guides/sales-intelligence-vs-crm/",
        label: "Sales intelligence vs CRM",
        description: "Data layer versus system of record.",
      },
      {
        href: "/guides/how-to-choose-sales-intelligence/",
        label: "How to choose sales intelligence",
        description: "Decision framework by primary job.",
      },
      {
        href: "/categories/sales-intelligence/",
        label: "Sales intelligence category",
        description: "Browse the full catalogue.",
      },
      {
        href: "/best/sales-intelligence-software/",
        label: "Best sales intelligence software",
        description: "Researched ranking with published methodology.",
      },
      {
        href: "/guides/what-is-crm/",
        label: "What is CRM?",
        description: "The system of record SI usually feeds.",
      },
      {
        href: "/guides/how-to-choose-crm/",
        label: "How to choose a CRM",
        description: "Pick the system of record before you scale data pushes.",
      },
      {
        href: "/use-cases/prospecting/",
        label: "Prospecting use case",
        description: "Find and prioritize accounts before outreach.",
      },
      {
        href: "/company/editorial-methodology/",
        label: "Editorial methodology",
        description: "How SoftwareGlimpse researches without affiliate bias.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "choose-cta",
    title: "Ready to pick by job, not by logo?",
    body: "Once you know sales intelligence is a data/outreach layer — not a CRM — use the how-to-choose framework to shortlist by primary job, coverage, credits, and CRM sync.",
    href: "/guides/how-to-choose-sales-intelligence/",
    ctaLabel: "How to choose sales intelligence →",
    variant: "generic",
  },
  {
    type: "interactive-cta",
    id: "best-cta",
    title: "Compare researched options",
    body: "See Best sales intelligence software for a methodology-backed shortlist. Affiliate status never changes the order.",
    href: "/best/sales-intelligence-software/",
    ctaLabel: "Best sales intelligence software →",
    variant: "generic",
  },
];

export const whatIsSalesIntelligenceGuide: GuidePage = {
  id: "guide-what-is-sales-intelligence",
  slug: "what-is-sales-intelligence",
  title: "What Is Sales Intelligence? A Clear Beginner’s Guide",
  summary:
    "Learn what sales intelligence software is, how it differs from CRM, and which jobs — contact data, enrichment, engagement, or dialer — it actually covers for outbound teams.",
  categorySlugs: ["sales-intelligence"],
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
  topicType: "fundamental",
  journeyStage: "learn",
  knowledgeAreaSlug: "fundamentals",
  heroVisual: {
    src: "/guides/what-is-sales-intelligence-hero.png",
    alt: "Sales intelligence as a data layer: contact search, verification, enrichment, and push into CRM or sequences — not a pipeline system of record.",
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
    {
      contentId: "content:guide:how-to-choose-sales-intelligence",
      relationType: "supports-anchor",
      primary: false,
    },
  ],
  nextAction: {
    contentId: "content:guide:how-to-choose-sales-intelligence",
    label: "How to choose sales intelligence",
  },
  relatedGuideSlugs: [
    "how-sales-intelligence-works",
    "sales-intelligence-vs-crm",
    "how-to-choose-sales-intelligence",
    "what-is-crm",
    "how-to-choose-crm",
  ],
  blocks: whatIsSalesIntelligenceBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "job",
      label: "Name the primary job",
      description: "Data, enrichment, engagement, or dialer — one sentence.",
      order: 0,
    },
    {
      id: "boundary",
      label: "Confirm CRM owns deals",
      description: "SI feeds the system of record; it does not replace it.",
      order: 1,
    },
    {
      id: "coverage",
      label: "Plan an ICP coverage test",
      description: "Same 200 accounts across shortlisted tools.",
      order: 2,
    },
  ],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: {
    status: "published",
    updatedAt: "2026-08-17T08:00:00.000Z",
    publishedAt: "2026-08-16T12:00:00.000Z",
    reviewedAt: "2026-08-17T08:00:00.000Z",
    researchStatus: "complete",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title: "What Is Sales Intelligence? Beginner’s Guide | SoftwareGlimpse",
    description:
      "What is sales intelligence software? A clear definition of the B2B data and outreach layer — find, verify, enrich contacts — and how it differs from CRM.",
    canonicalPath: "/guides/what-is-sales-intelligence/",
    indexable: true,
  },
};
