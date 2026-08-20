import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * Sales intelligence vs sales engagement — data layer vs sequencing layer.
 * Template: softwareglimpse-guide-template-v1
 */
const salesIntelligenceVsSalesEngagementBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Sales intelligence owns the data layer — finding, verifying, and enriching contacts. Sales engagement owns the sequencing layer — cadences, mailbox sending, reply handling, and (often) dialing. Decision rule: if the work is “who should we contact and with what verified details,” you need intelligence; if the work is “run and measure multichannel follow-up at volume,” you need engagement — many platforms blur both, but buy for the primary job.",
    bullets: [
      "SI = data layer",
      "Engagement = sequencing layer",
      "Bundles blur, jobs differ",
      "Coverage vs cadence fit",
      "Shared CRM truth",
      "Buy for the primary job",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Different failure modes",
        body: "Intelligence fails on thin ICP coverage and credit burn; engagement fails on deliverability, reply handling, and rep workflow.",
      },
      {
        label: "All-in-one is not automatically better",
        body: "Bundled data + sequences helps when one admin model is real — not when you only need one job done well.",
      },
      {
        label: "CRM remains the system of record",
        body: "Neither layer should become the place ownership, stages, and forecast truth live.",
      },
      {
        label: "Handoff is list → cadence",
        body: "Agree how verified contacts enter sequences and how replies/log activity write back to CRM.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "si-or-engagement",
    title: "How to choose (or combine)",
    steps: [
      { id: "job", label: "Primary job", short: "Data vs sequences" },
      { id: "coverage", label: "Coverage pain", short: "Lists thin?" },
      { id: "cadence", label: "Cadence pain", short: "Follow-up dies?" },
      { id: "stack", label: "Stack shape", short: "Separate vs bundle" },
      { id: "crm", label: "CRM write", short: "Shared truth" },
      { id: "admin", label: "Admin capacity", short: "Who runs it?" },
    ],
    ctaHref: "/guides/how-to-choose-sales-intelligence/",
    ctaLabel: "How to choose SI →",
    figure: {
      src: "/guides/sales-intelligence-vs-sales-engagement-choose.png",
      alt: "How to choose or combine sales intelligence and sales engagement: primary job, coverage pain, cadence pain, stack shape, CRM write rules, admin capacity.",
      caption:
        "Same outbound motion — different layers by job. Write the list→cadence handoff before arguing logos.",
    },
  },
  {
    type: "figure",
    id: "boundary-visual",
    title: "Data layer vs sequencing layer",
    src: "/guides/sales-intelligence-vs-sales-engagement-hero.png",
    alt: "Sales intelligence data layer (search, verify, enrich) flowing into a sales engagement sequencing layer (cadences, send, replies) then into CRM.",
    caption: "Same outbound motion — different systems by job.",
  },
  {
    type: "step",
    id: "handoff",
    stepNumber: 1,
    heading: "The list → cadence handoff",
    body: "Boundary clarity fails most often when verified contacts never enter a disciplined sequence — or when a sequencer becomes a second contact database. Agree what “ready to sequence” means, which tool owns verification, and how replies and dispositions write to CRM.\n\nExample: a five-seat outbound pod uses a contact database (catalogue examples include BookYourData or Lusha) to build Monday lists, then enrolls only verified emails into a sequencer (catalogue examples include Reply.io or Amplemarket). CRM owns owners and stages; the sequencer may log activities but never overwrite Owner. Without that sentence, reps rebuild lists in Sheets and blame “the data tool” for follow-up failures.",
    tip: "Write the handoff in one sentence: “When a contact has verified email + ICP tags, Y enrolls it in cadence Z within one business day, and CRM remains source of ownership.”",
    figure: {
      src: "/guides/sales-intelligence-vs-sales-engagement-handoff.png",
      alt: "Diagram of sales intelligence verifying contacts and handing a ready-to-sequence list into sales engagement cadences with CRM activity write-back.",
      caption: "Ready-to-sequence definitions matter more than vendor logos.",
    },
    scenarios: [
      {
        title: "Intelligence side",
        body: "Search, filter, verify, enrich, export/push — data quality and credits.",
      },
      {
        title: "Engagement side",
        body: "Cadences, mailbox limits, reply detection, dialing, activity logging.",
      },
      {
        title: "Shared CRM fields",
        body: "Owner, lifecycle, last touch, and disposition must mean the same thing.",
      },
    ],
  },
  {
    type: "crm-types",
    id: "stack-shapes",
    title: "Stack shapes (educational, not rankings)",
    types: [
      {
        id: "si-only",
        title: "Intelligence with light outreach",
        bestFor:
          "Teams whose bottleneck is finding verified contacts; follow-up already works in CRM or a simple mail client.",
        avoidWhen:
          "You need multichannel cadences, deliverability tooling, and reply workflows at volume.",
      },
      {
        id: "engagement-only",
        title: "Engagement with thin data",
        bestFor:
          "Teams that already have lists or enrichment elsewhere and need sequencing discipline.",
        avoidWhen:
          "Weekly list building is empty — a sequencer will not invent ICP coverage.",
      },
      {
        id: "separate",
        title: "Separate SI + engagement",
        bestFor:
          "Teams that want best-fit depth per layer and can maintain CRM write rules between them.",
        avoidWhen:
          "No one owns sync, suppression, or which tool is contact truth.",
      },
      {
        id: "bundle",
        title: "Combined data + engagement platform",
        bestFor:
          "Pods that will use both layers daily and prefer one vendor for list→cadence admin.",
        avoidWhen:
          "You only need one job and would ignore the other module after purchase.",
      },
    ],
  },
  {
    type: "feature-matrix",
    id: "job-matrix",
    title: "Job matrix: intelligence vs engagement",
    rows: [
      {
        feature: "ICP search, verification, enrichment",
        mustHave: true,
        niceToHave: false,
        notes: "Sales intelligence job",
      },
      {
        feature: "Multichannel cadences & reply handling",
        mustHave: true,
        niceToHave: false,
        notes: "Sales engagement job",
      },
      {
        feature: "Agreed list → cadence handoff",
        mustHave: true,
        niceToHave: false,
        notes: "Process + both tools",
      },
      {
        feature: "CRM ownership & pipeline stages",
        mustHave: true,
        niceToHave: false,
        notes: "CRM system of record",
      },
      {
        feature: "Intent widgets / AI research agents",
        mustHave: false,
        niceToHave: true,
        notes: "Nice after core loop works",
      },
      {
        feature: "Buying a bundle “to grow into later”",
        mustHave: false,
        niceToHave: true,
        notes: "Common overbuy",
      },
    ],
  },
  {
    type: "size-match",
    id: "fit-by-team",
    title: "Fit by team shape",
    tiers: [
      {
        id: "founder-led",
        label: "Founder-led outbound",
        description:
          "Intelligence first if lists are thin; add engagement when follow-up volume exceeds inbox discipline.",
        fitHints: ["Credits over seats", "Light cadence"],
      },
      {
        id: "sdr-pod",
        label: "SDR pod (1–5)",
        description:
          "Separate or bundle can work — only if ready-to-sequence and CRM write rules are written down.",
        fitHints: ["Monday list ritual", "Shared suppression"],
      },
      {
        id: "outbound-heavy",
        label: "Outbound-heavy / multi-pod",
        description:
          "Engagement depth and deliverability dominate; intelligence must still clear ICP coverage tests.",
        fitHints: ["Mailbox governance", "Credit budgets"],
      },
      {
        id: "enterprise",
        label: "Enterprise / regulated",
        description:
          "Sourcing docs, SSO, and write-rule governance dominate — bundles help only with real shared admin.",
        fitHints: ["Privacy review", "Field-level sync"],
      },
    ],
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "Common boundary mistakes",
    items: [
      {
        title: "Using a sequencer as the contact database",
        body: "Engagement tools are poor systems of truth for verification, enrichment refresh, and credit-efficient list building.",
      },
      {
        title: "Buying data and never sequencing",
        body: "Verified contacts without a cadence ritual become another stale CSV.",
      },
      {
        title: "Assuming a suite replaces process design",
        body: "Shared software still needs shared definitions for ready-to-sequence, suppression, and CRM ownership.",
      },
      {
        title: "Blaming “bad data” for deliverability debt",
        body: "Mailbox warm-up, limits, and content hygiene are engagement-layer problems.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "Is sales intelligence the same as sales engagement?",
        answer:
          "No. Sales intelligence focuses on finding, verifying, and enriching contacts (data layer). Sales engagement focuses on cadences, sending, replies, and often dialing (sequencing layer). Decision rule: who to contact vs how to follow up at volume.",
      },
      {
        question: "Do we need both?",
        answer:
          "Only if both jobs are real. Many teams start with intelligence and light email; add engagement when follow-up volume and multichannel discipline justify another system (or suite module).",
      },
      {
        question: "Should we buy a combined platform?",
        answer:
          "Consider a bundle when you will use both layers daily and want one list→cadence admin model. If you only need data or only need sequences, a simpler shape usually reduces cost and complexity.",
      },
      {
        question: "Where does LinkedIn Sales Navigator fit?",
        answer:
          "Sales Navigator is closer to a social-graph prospecting layer than a verified contact database or sequencer — see Sales Intelligence vs LinkedIn Sales Navigator.",
      },
      {
        question: "What should I read next?",
        answer:
          "Review How to Choose Sales Intelligence, then the Requirements and Evaluation guides — or shortlist on Best Sales Intelligence Software.",
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
        description: "Job-first selection framework.",
      },
      {
        href: "/guides/sales-intelligence-vs-linkedin-sales-navigator/",
        label: "SI vs LinkedIn Sales Navigator",
        description: "Social graph vs verified contact DB.",
      },
      {
        href: "/guides/sales-intelligence-requirements-guide/",
        label: "SI requirements guide",
        description: "Freeze must-haves before you shop.",
      },
      {
        href: "/best/sales-intelligence-software/",
        label: "Best sales intelligence software",
        description: "Researched shortlist with methodology.",
      },
      {
        href: "/use-cases/sales-engagement/",
        label: "Sales engagement use case",
        description: "Where sequencing fits in the stack.",
      },
      {
        href: "/software/reply/",
        label: "Reply.io (catalogue example)",
        description: "Engagement-leaning example — not a ranking.",
      },
      {
        href: "/software/apollo/",
        label: "Apollo.io (catalogue example)",
        description: "Combined data + engagement example — not a ranking.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "best-cta",
    title: "Shortlist the intelligence side of the stack",
    body: "Once you know whether data, engagement, or both are the primary job, use How to Choose Sales Intelligence and the Best Sales Intelligence page — rankings ignore affiliate commissions.",
    href: "/best/sales-intelligence-software/",
    ctaLabel: "See Best SI Software →",
    variant: "finder",
  },
];

export const salesIntelligenceVsSalesEngagementGuide: GuidePage = {
  id: "guide-sales-intelligence-vs-sales-engagement",
  slug: "sales-intelligence-vs-sales-engagement",
  title: "Sales Intelligence vs Sales Engagement: Data vs Sequencing",
  summary:
    "See how sales intelligence (data layer) differs from sales engagement (sequencing layer) — and how list→cadence handoffs, bundles, and CRM ownership should work together.",
  categorySlugs: ["sales-intelligence"],
  productSlugs: [],
  topicType: "comparison-education",
  journeyStage: "learn",
  knowledgeAreaSlug: "fundamentals",
  heroVisual: {
    src: "/guides/sales-intelligence-vs-sales-engagement-hero.png",
    alt: "Sales intelligence data layer flowing into a sales engagement sequencing layer and then into CRM.",
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
      contentId: "content:use-case:sales-engagement",
      relationType: "answers-question-for",
      primary: false,
    },
  ],
  nextAction: {
    contentId: "content:best:sales-intelligence-software",
    label: "See Best Sales Intelligence Software",
  },
  relatedGuideSlugs: [
    "how-to-choose-sales-intelligence",
    "sales-intelligence-vs-linkedin-sales-navigator",
    "sales-intelligence-requirements-guide",
    "sales-intelligence-evaluation-guide",
    "how-to-choose-crm",
  ],
  blocks: salesIntelligenceVsSalesEngagementBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "job",
      label: "Name the primary job",
      description: "Data layer, sequencing layer, or both.",
      order: 0,
    },
    {
      id: "handoff",
      label: "Write the list → cadence handoff",
      description: "Ready-to-sequence criteria and CRM write-back.",
      order: 1,
    },
    {
      id: "stack",
      label: "Pick stack shape",
      description: "SI-only, engagement-only, separate, or bundle.",
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
    title: "Sales Intelligence vs Sales Engagement | SoftwareGlimpse",
    description:
      "Sales intelligence is the data layer; sales engagement is the sequencing layer. Learn handoffs, bundles, and when you need both.",
    canonicalPath: "/guides/sales-intelligence-vs-sales-engagement/",
    indexable: true,
  },
};
