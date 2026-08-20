import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * Sales Intelligence Data Quality — bounce, stale contacts, enrichment hygiene.
 * Template: softwareglimpse-guide-template-v1
 */
const salesIntelligenceDataQualityGuideBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Sales intelligence data quality is an ongoing operating system — verification before send, bounce/suppression SLAs, stale-contact rules, enrichment overwrite discipline, and a weekly hygiene review — not a one-time list scrub. Decision rule: if bounce rates climb, CRM duplicates age in a queue, or SDRs keep private sheets because SI numbers fail, pause new credit spend and run the weekly ritual until your team-defined signals hold for two consecutive weeks.",
    bullets: [
      "Verify before send",
      "Bounce SLAs",
      "Stale rules",
      "Enrichment discipline",
      "Weekly review",
      "Not one-time scrub",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Purchased ≠ trusted",
        body: "Credits unlock records; verification and CRM hygiene make them usable.",
      },
      {
        label: "Bounces are a quality signal",
        body: "Treat spike patterns as incidents — not just deliverability luck.",
      },
      {
        label: "Stale data needs aging rules",
        body: "Re-verify or retire contacts past your team’s freshness window.",
      },
      {
        label: "Weekly review beats quarterly scrubs",
        body: "Short queues with owners prevent spreadsheet relapse.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "quality-path",
    title: "SI data quality path",
    steps: [
      { id: "verify", label: "Verify", short: "Before send" },
      { id: "bounce", label: "Bounce SLA", short: "Team targets" },
      { id: "stale", label: "Stale rules", short: "Re-check / retire" },
      { id: "enrich", label: "Enrichment", short: "Overwrite map" },
      { id: "weekly", label: "Weekly", short: "Queue → decide" },
    ],
    ctaHref: "/guides/sales-intelligence-crm-sync-explained/",
    ctaLabel: "CRM sync →",
    figure: {
      src: "/guides/sales-intelligence-data-quality-map.png",
      alt: "Sales intelligence data quality path: verify before send, bounce SLA, stale rules, enrichment overwrite map, weekly queue review.",
      caption:
        "Quality is recurring ops — credits without hygiene become expensive noise.",
    },
  },
  {
    type: "figure",
    id: "quality-ops",
    title: "Hygiene signals and weekly review",
    src: "/guides/sales-intelligence-data-quality-map.png",
    alt: "Four-panel SI data quality diagram: verification gate, bounce queue, stale-contact aging, enrichment overwrite rules feeding a weekly hygiene huddle.",
    caption:
      "Team-defined signals and a weekly agenda — not invented industry accuracy percentages.",
  },
  {
    type: "checklist",
    id: "quality-ops-checklist",
    title: "Stand up SI data quality ops",
    copyable: true,
    items: [
      {
        id: "signals",
        label: "Pick 3–5 hygiene signals",
        description:
          "e.g. bounce rate band, duplicate age, stale unlocks, suppression sync health.",
        order: 0,
      },
      {
        id: "targets",
        label: "Set team-defined targets",
        description: "Internal goals — not invented vendor accuracy claims as fact.",
        order: 1,
      },
      {
        id: "verify",
        label: "Define verify-before-send rule",
        description: "Which lists require verification pass.",
        order: 2,
      },
      {
        id: "enrich",
        label: "Confirm enrichment overwrite map",
        description: "Align with CRM sync sheet.",
        order: 3,
      },
      {
        id: "ritual",
        label: "Schedule weekly quality review",
        description: "30 minutes; queue → assign → pause credits if needed.",
        order: 4,
      },
    ],
  },
  {
    type: "step",
    id: "ongoing-vs-scrub",
    stepNumber: 1,
    heading: "Treat quality as ongoing — not a cleanup weekend",
    body: "A one-time dedupe or verification pass is necessary but temporary. Ongoing quality is the SLA and ritual that keep unlocks trustworthy after go-live. Separate projects: finish an initial scrub, then turn on weekly bounce/stale reviews so the scrub does not expire.\n\nExample: Meridian runs a heroic verification before launch, then skips reviews. By week four SDRs rebuild lists in Sheets because mobiles bounce and CRM duplicates return. Ops restarts a Tuesday hygiene huddle and freezes net-new credit spend until the overdue bounce queue shrinks for two weeks.",
    tip: "If your plan only says “buy better data” and has no weekly owner, you planned a relapse.",
    figure: {
      src: "/guides/sales-intelligence-data-quality-hero.png",
      alt: "Sales intelligence data quality hero: hygiene dashboard with bounce meters, stale queue, verification gate, and weekly review agenda.",
      caption:
        "Operational quality looks like meters and queues — not a one-off CSV scrub.",
    },
    scenarios: [
      {
        title: "Post-backfill",
        body: "Enrichment pass first; start SLAs in week one of live sending.",
      },
      {
        title: "Mature drift",
        body: "Re-baseline signals; do not only buy another database.",
      },
      {
        title: "Multi-tool intake",
        body: "Tighten create paths and suppression sync across sequencer + CRM.",
      },
    ],
  },
  {
    type: "step",
    id: "slas-and-stale",
    stepNumber: 2,
    heading: "Define bounce SLAs and stale-contact rules",
    body: "Choose signals: hard-bounce rate on new unlocks, suppression sync lag, duplicate queue age, and contacts past your freshness window without re-verify. Set targets your team can act on in the weekly review. Avoid treating vendor “95% accuracy” marketing as a verified benchmark.\n\nExample: Harborline defines success as: hard bounces investigated within 48 hours, duplicates older than seven days have an owner, and contacts unlocked >90 days ago are re-verified before reuse in sequences.",
    tip: "A target nobody can clear in the weekly review is decoration.",
    scenarios: [
      {
        title: "Email-led pod",
        body: "Verification + bounce queue + suppression honor.",
      },
      {
        title: "Phone-led pod",
        body: "Add wrong-number / disconnect disposition hygiene.",
      },
      {
        title: "Enrichment-led RevOps",
        body: "Overwrite conflicts and blank-fill audits weekly.",
      },
    ],
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "SI data quality mistakes",
    items: [
      {
        title: "Trusting unlocks without verification",
        body: "Credits spent, domain reputation burned.",
      },
      {
        title: "No bounce owner",
        body: "SDRs keep sending; deliverability silently decays.",
      },
      {
        title: "Enrichment overwrites trusted CRM fields",
        body: "AEs stop believing both systems.",
      },
      {
        title: "Quarterly “data day” only",
        body: "Queues grow; private sheets return between events.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "What is sales intelligence data quality?",
        answer:
          "Ongoing hygiene so unlocked and enriched contacts stay usable: verification, bounce/suppression handling, stale rules, and CRM-aligned enrichment — with a weekly control loop.",
      },
      {
        question: "How do we measure quality without fake accuracy %?",
        answer:
          "Track team-defined signals (bounces, duplicate age, stale reuse, suppression sync). Intervene when they miss for two consecutive weeks. Do not cite invented industry percentages as facts.",
      },
      {
        question: "How does this relate to CRM sync?",
        answer:
          "Sync rules decide what lands in CRM; quality ops decide whether those records stay trustworthy. Build both — see CRM Sync Explained.",
      },
      {
        question: "What should I do next?",
        answer:
          "Stand up the checklist, align overwrite rules with sync, and link training so SDRs know the verify-before-send ritual.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related sales intelligence resources",
    links: [
      {
        href: "/guides/sales-intelligence-crm-sync-explained/",
        label: "CRM sync explained",
        description: "Mapping and overwrite.",
      },
      {
        href: "/guides/sales-intelligence-compliance-basics/",
        label: "Compliance basics",
        description: "Suppression and scope.",
      },
      {
        href: "/guides/sales-intelligence-adoption/",
        label: "Adoption guide",
        description: "When sheets return.",
      },
      {
        href: "/guides/crm-data-quality/",
        label: "CRM data quality",
        description: "System-of-record hygiene.",
      },
      {
        href: "/guides/how-to-choose-sales-intelligence/",
        label: "How to choose SI",
        description: "Coverage tests before buy.",
      },
      {
        href: "/best/sales-intelligence-software/",
        label: "Best sales intelligence",
        description: "Shortlist context.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "choose-cta",
    title: "Test coverage before you scale credits",
    body: "Job-first shortlists plus ICP coverage samples beat buying on claimed accuracy percentages.",
    href: "/guides/how-to-choose-sales-intelligence/",
    ctaLabel: "How to choose SI →",
    variant: "finder",
  },
];

export const salesIntelligenceDataQualityGuide: GuidePage = {
  id: "guide-sales-intelligence-data-quality",
  slug: "sales-intelligence-data-quality",
  title: "Sales Intelligence Data Quality Guide",
  summary:
    "Run SI data quality with verification, bounce SLAs, stale-contact rules, enrichment discipline, and weekly hygiene — not one-time list scrubs.",
  categorySlugs: ["sales-intelligence"],
  productSlugs: [],
  topicType: "implementation",
  journeyStage: "optimize",
  knowledgeAreaSlug: "implementation",
  heroVisual: {
    src: "/guides/sales-intelligence-data-quality-hero.png",
    alt: "Sales intelligence data quality hero: hygiene dashboard with bounce meters, stale queue, verification gate, and weekly agenda.",
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
    label: "See Best Sales Intelligence",
  },
  relatedGuideSlugs: [
    "sales-intelligence-crm-sync-explained",
    "sales-intelligence-compliance-basics",
    "sales-intelligence-adoption",
    "how-to-choose-sales-intelligence",
    "crm-data-quality",
  ],
  blocks: salesIntelligenceDataQualityGuideBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "signals",
      label: "Pick hygiene signals + team targets",
      description: "No invented industry %.",
      order: 0,
    },
    {
      id: "verify-rule",
      label: "Define verify-before-send",
      description: "Owner + tool path.",
      order: 1,
    },
    {
      id: "weekly",
      label: "Run weekly quality review",
      description: "Pause credits on two-week miss.",
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
    title: "Sales Intelligence Data Quality Guide | SoftwareGlimpse",
    description:
      "SI data quality: verification, bounce SLAs, stale rules, enrichment discipline, weekly hygiene — no fake accuracy percentages.",
    canonicalPath: "/guides/sales-intelligence-data-quality/",
    indexable: true,
  },
};
