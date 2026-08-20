import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * When to adopt sales intelligence — timing, pilot, expand.
 * Template: softwareglimpse-guide-template-v1
 */
const whenToAdoptSalesIntelligenceBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Adopt sales intelligence when list-building or enrichment pain is recurring, someone will own credits and CRM write rules, and you can pilot on real ICP accounts — then expand. Decision rule: if Mondays start without usable contacts (or enrichment debt is blocking outbound) and a small pod will maintain suppression and sync rules, start the pilot now; if nobody will own credits or overwrite rules, wait — empty seats and burned credits are worse than a late buy.",
    bullets: [
      "List / enrich pain",
      "Credit & write owners",
      "Pilot real ICP",
      "Expand deliberately",
      "Too early vs too late",
      "Don’t wait for perfect ICP doc",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Timing is an outbound-process decision",
        body: "The calendar date matters less than whether pain, credit ownership, and a live ICP pilot exist.",
      },
      {
        label: "Pilot beats big-bang seats",
        body: "Run real accounts through coverage, sync, and one cadence week first; expand seats after habits stick.",
      },
      {
        label: "Perfect ICP docs are a trap",
        body: "Waiting to “finish” the persona deck often delays the tool that would reveal real coverage gaps.",
      },
      {
        label: "Late adoption has a cost",
        body: "Every week of spreadsheet lists and dual contact sources increases cleanup and duplicate debt later.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "adopt-path",
    title: "Adoption timing path",
    steps: [
      { id: "pain", label: "Pain", short: "Empty Mondays / enrich debt" },
      { id: "owners", label: "Owners", short: "Credits & write rules" },
      { id: "scope", label: "Pilot scope", short: "Pod + ICP sample" },
      { id: "pilot", label: "Pilot", short: "Live accounts only" },
      { id: "review", label: "Review", short: "Coverage vs burn" },
      { id: "expand", label: "Expand", short: "Seats, sequences, dialer" },
    ],
    ctaHref: "/guides/how-to-choose-sales-intelligence/",
    ctaLabel: "How to choose SI →",
    figure: {
      src: "/guides/when-to-adopt-sales-intelligence-path.png",
      alt: "Sales intelligence adoption timing path: pain, owners, pilot scope, live ICP accounts, review coverage vs burn, then expand.",
      caption:
        "Move when list pain and ownership are real — then pilot before scaling seats.",
    },
  },
  {
    type: "figure",
    id: "timeline-visual",
    title: "Adopt sales intelligence on a practical timeline",
    src: "/guides/when-to-adopt-sales-intelligence-timeline.png",
    alt: "Timeline: list pain appears, agree credit and CRM write owners, pilot real ICP accounts, then expand — with too-early and too-late callouts.",
    caption:
      "Move when pain and ownership are real — then pilot before scaling seats and sequences.",
  },
  {
    type: "step",
    id: "too-early-late",
    stepNumber: 1,
    heading: "Too early vs too late",
    body: "Early adoption without shared list pain creates unused seats and surprise credit burn. Late adoption after months of CSV chaos creates dirty CRM sync and entrenched dual lists. Aim for the middle: Mondays hurt, a small group will own credits and write rules, and leadership will protect a two-week pilot.\n\nExample: a 2-person founder-led SaaS team bought annual seats on day one with no overwrite rules — burned a month of credits exporting junk titles and stopped logging within three weeks. Four months later, after missed follow-ups and duplicate HubSpot contacts, they relaunched with a 200-account coverage pilot, written CRM write rules, and a weekly credit review. The second attempt worked because pain and ownership were real.",
    tip: "If people still argue about whether contacts need verified emails before sequencing, resolve that before buying seats.",
    figure: {
      src: "/guides/when-to-adopt-sales-intelligence-hero.png",
      alt: "Hero diagram showing the sales intelligence adoption window between too early (no list pain) and too late (CSV chaos and dirty CRM sync).",
      caption:
        "The useful window sits between “no shared list pain” and “contact data already broken everywhere.”",
    },
    scenarios: [
      {
        title: "Too early",
        body: "Outbound volume is low, no shared list ritual, nobody will own credits — wait or use light lookups.",
      },
      {
        title: "Right window",
        body: "Empty Mondays or enrichment debt appear; a pilot pod will run real ICP accounts.",
      },
      {
        title: "Too late",
        body: "Duplicates dominate CRM, spreadsheets are the real database — adopt, but budget cleanup time.",
      },
    ],
  },
  {
    type: "step",
    id: "pilot-expand",
    stepNumber: 2,
    heading: "Pilot real ICP accounts, then expand",
    body: "Start with one primary job, a 200-account coverage sample, written CRM write rules, and the contacts that matter this month. Expand seats, sequences, dialer, and intent widgets only after the pilot team trusts coverage and credit burn in weekly reviews.\n\nExample: that SaaS team’s 14-day pilot used only data + CRM push — no dialer yet. After two Monday lists ran from the tool without a shadow Sheet, and a 50-record sync kept Owner intact, they added a sequencer seat. Catalogue products such as BookYourData (pay-as-you-go data) or Apollo.io (broader platform) are examples of shapes you might pilot — not ranked recommendations on this page.",
    tip: "Measure pilot success by “did Monday lists stop living in Sheets?” — not by how many AI features you enabled.",
    figure: {
      src: "/guides/when-to-adopt-sales-intelligence-pilot.png",
      alt: "Pilot real sales intelligence ICP accounts then expand: coverage sample, credit log, CRM write rules, Monday from the tool, then seats and sequences.",
      caption:
        "Measure pilot success by stopping the Sheet rebuild — not by how many modules you turned on.",
    },
    scenarios: [
      {
        title: "Agree owners",
        body: "Name who buys credits, who sets write rules, and who owns suppression.",
      },
      {
        title: "Pilot live ICP",
        body: "No vendor-demo accounts only — put your real targets through coverage and sync.",
      },
      {
        title: "Expand",
        body: "Add seats, engagement, and dialer once coverage and burn are trusted for a few cycles.",
      },
    ],
  },
  {
    type: "size-match",
    id: "timing-by-team",
    title: "Timing by team situation",
    tiers: [
      {
        id: "solo",
        label: "Solo / founder-led",
        description:
          "Adopt when personal list building or memory load breaks — prefer credits you can stop buying.",
        fitHints: ["Pay-as-you-go", "Light CRM push"],
      },
      {
        id: "first-sdr",
        label: "First SDR hire",
        description:
          "Often the right moment: shared list ownership appears overnight. Pilot together immediately.",
        fitHints: ["Shared saved searches", "Credit visibility"],
      },
      {
        id: "sdr-pod",
        label: "Small SDR pod",
        description:
          "If Monday lists already hurt, you are in the adoption window — pilot one pod, then expand.",
        fitHints: ["Coverage sample", "Write rules"],
      },
      {
        id: "scaling",
        label: "Scaling / multi-pod",
        description:
          "Adopt (or re-implement) before duplicate sources multiply; delay increases cleanup pain.",
        fitHints: ["Governance", "Suppression"],
      },
    ],
  },
  {
    type: "feature-matrix",
    id: "readiness",
    title: "Readiness signals",
    rows: [
      {
        feature: "Recurring list or enrichment pain named",
        mustHave: true,
        niceToHave: false,
        notes: "Adopt window open",
      },
      {
        feature: "Named owners for credits and CRM write rules",
        mustHave: true,
        niceToHave: false,
        notes: "Required for pilot",
      },
      {
        feature: "Willing to run live ICP accounts in pilot",
        mustHave: true,
        niceToHave: false,
        notes: "Avoid demo-only data",
      },
      {
        feature: "Perfect persona deck finished",
        mustHave: false,
        niceToHave: true,
        notes: "Do not block on this",
      },
      {
        feature: "Every module (dialer, intent, AI) on day one",
        mustHave: false,
        niceToHave: true,
        notes: "Expand later",
      },
    ],
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "Timing mistakes",
    items: [
      {
        title: "Waiting for the perfect ICP document",
        body: "The tool will expose real coverage — delay usually protects a fictional persona map.",
      },
      {
        title: "Big-bang seat rollout",
        body: "Forcing every rep and every module on day one creates credit burn and rejection.",
      },
      {
        title: "Piloting only vendor demo accounts",
        body: "Demo searches never surface your niche coverage or overwrite failures.",
      },
      {
        title: "Adopting with no weekly credit / list ritual",
        body: "Without a Monday review that uses the tool, seats become optional again.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "When is the best time to adopt sales intelligence?",
        answer:
          "When list or enrichment pain is recurring, owners can agree on credits and CRM write rules, and a pilot pod can run real ICP accounts — then expand after habits stick. Example: a 2-person SaaS team that bought empty seats too early relaunched successfully only after naming owners and piloting a 200-account coverage sample.",
      },
      {
        question: "Should startups buy sales intelligence on day one?",
        answer:
          "Only if shared list ownership or outbound volume already creates risk. Many solos start later with pay-as-you-go credits; first SDR hire is a common trigger.",
      },
      {
        question: "How long should a sales intelligence pilot last?",
        answer:
          "Long enough to cover coverage sample, credit burn for a normal week, CRM sync of ~50 records, and at least one cadence or dial check — typically about two weeks, not a single demo day.",
      },
      {
        question: "What should I read next?",
        answer:
          "Confirm the job with How to Choose Sales Intelligence, freeze the sheet in the Requirements Guide, then use the Evaluation Guide or Best Sales Intelligence Software.",
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
        description: "Buying framework after timing is clear.",
      },
      {
        href: "/guides/sales-intelligence-requirements-guide/",
        label: "SI requirements guide",
        description: "Freeze the sheet before you shop.",
      },
      {
        href: "/guides/sales-intelligence-evaluation-guide/",
        label: "SI evaluation guide",
        description: "Two-week trial scorecard.",
      },
      {
        href: "/best/sales-intelligence-software/",
        label: "Best sales intelligence software",
        description: "Researched shortlist with methodology.",
      },
      {
        href: "/guides/when-to-replace-sales-intelligence/",
        label: "When to replace sales intelligence",
        description: "Optimize vs switch later.",
      },
      {
        href: "/guides/how-to-choose-crm/",
        label: "How to choose a CRM",
        description: "System of record before bulk sync.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "best-cta",
    title: "Adopt with a shortlist, not a guess",
    body: "Once timing is right, use How to Choose Sales Intelligence and the Best Sales Intelligence page so the pilot starts on a methodology-first shortlist.",
    href: "/best/sales-intelligence-software/",
    ctaLabel: "See Best SI Software →",
    variant: "finder",
  },
];

export const whenToAdoptSalesIntelligenceGuide: GuidePage = {
  id: "guide-when-to-adopt-sales-intelligence",
  slug: "when-to-adopt-sales-intelligence",
  title: "When to Adopt Sales Intelligence: Timing, Pilot & Expand",
  summary:
    "Learn when to adopt sales intelligence software — after list or enrichment pain appears and owners agree, pilot with real ICP accounts, then expand — without waiting for a perfect persona deck or delaying until CSV chaos piles up.",
  categorySlugs: ["sales-intelligence"],
  productSlugs: [],
  topicType: "selection",
  journeyStage: "choose",
  knowledgeAreaSlug: "fundamentals",
  heroVisual: {
    src: "/guides/when-to-adopt-sales-intelligence-hero.png",
    alt: "Hero diagram showing the sales intelligence adoption window between too early (no list pain) and too late (CSV chaos and dirty CRM sync).",
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
    "sales-intelligence-requirements-guide",
    "sales-intelligence-evaluation-guide",
    "when-to-replace-sales-intelligence",
    "how-to-choose-crm",
  ],
  blocks: whenToAdoptSalesIntelligenceBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "pain",
      label: "Name the adoption trigger pain",
      description: "Empty Mondays, enrich debt, or dual lists.",
      order: 0,
    },
    {
      id: "owners",
      label: "Agree credit and write-rule owners",
      description: "Who buys, who syncs, who suppresses.",
      order: 1,
    },
    {
      id: "pilot",
      label: "Define live ICP pilot scope",
      description: "Sample, sync rules, and review ritual.",
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
    title: "When to Adopt Sales Intelligence | SoftwareGlimpse",
    description:
      "Timing guidance for sales intelligence adoption — list pain, credit owners, live ICP pilots, and expansion — without waiting for a perfect persona deck.",
    canonicalPath: "/guides/when-to-adopt-sales-intelligence/",
    indexable: true,
  },
};
