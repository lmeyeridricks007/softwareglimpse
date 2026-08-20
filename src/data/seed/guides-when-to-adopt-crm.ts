import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * When to adopt CRM — timing, pilot, expand (not perfect process first).
 * Template: softwareglimpse-guide-template-v1
 */
const whenToAdoptCrmBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Adopt CRM when operational pain is real, owners can agree who updates what, and you can pilot with live deals — then expand. Decision rule: if pain is visible and a small group will maintain records, start the pilot now; if nobody will update stages, wait — empty fields are worse than a late buy.",
    bullets: [
      "Pain appears",
      "Agree owners",
      "Pilot real deals",
      "Expand deliberately",
      "Too early vs too late",
      "Don’t wait for perfect process",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Timing is a process decision",
        body: "The calendar date matters less than whether pain, ownership, and a pilot path exist.",
      },
      {
        label: "Pilot beats big-bang",
        body: "Run real deals in a thin workflow first; expand stages and integrations after habits stick.",
      },
      {
        label: "Perfect process is a trap",
        body: "Waiting to “finish” the sales process document often delays the system that would reveal the real process.",
      },
      {
        label: "Late adoption has a cost",
        body: "Every week of dual ownership and inbox history increases migration and cleanup work later.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "adopt-path",
    title: "Adoption timing path",
    steps: [
      { id: "pain", label: "Pain", short: "Recurring operational fails" },
      { id: "owners", label: "Owners", short: "Who updates & decides" },
      { id: "scope", label: "Pilot scope", short: "Team + deal types" },
      { id: "pilot", label: "Pilot", short: "Live deals only" },
      { id: "review", label: "Review", short: "Habits vs friction" },
      { id: "expand", label: "Expand", short: "Stages, teams, tools" },
    ],
    ctaHref: "/guides/do-i-need-a-crm/",
    ctaLabel: "Do I need a CRM? →",
    figure: {
      src: "/guides/when-to-adopt-path.png",
      alt: "CRM adoption timing path: pain, owners, pilot scope, live deals, review habits, then expand.",
      caption:
        "Move when pain and ownership are real — then pilot before scaling configuration.",
    },
  },
  {
    type: "figure",
    id: "timeline-visual",
    title: "Adopt CRM on a practical timeline",
    src: "/guides/when-to-adopt-crm-timeline.png",
    alt: "Timeline: pain appears, agree owners, pilot real deals, then expand — with too-early and too-late callouts.",
    caption: "Move when pain and ownership are real — then pilot before scaling configuration.",
  },
  {
    type: "step",
    id: "too-early-late",
    stepNumber: 1,
    heading: "Too early vs too late",
    body: "Early adoption without shared pain creates shelfware. Late adoption after months of spreadsheet chaos creates dirty migrations and entrenched workarounds. Aim for the middle: pain is visible, a small group will maintain records, and leadership will protect the pilot.\n\nExample: a 3-person B2B SaaS founding team bought seats on day one with 12 empty required fields — reps stopped logging within two weeks. Six months later, after missed renewals and dual-owned accounts, they relaunched with four stages, mandatory owners, and a Friday review. The second attempt worked because pain and ownership were real.",
    tip: "If people still argue about whether deals should have owners, resolve that before buying seats.",
    figure: {
      src: "/guides/when-to-adopt-crm-hero.png",
      alt: "Hero diagram showing the CRM adoption window between too early (no pain) and too late (chaos and dirty data).",
      caption: "The useful window sits between “no shared pain” and “process already broken everywhere.”",
    },
    scenarios: [
      {
        title: "Too early",
        body: "Solo volume is low, no shared ownership pain, and nobody wants weekly updates — wait or use a light list.",
      },
      {
        title: "Right window",
        body: "Misses and ownership conflicts appear; a pilot team will log activity for real opportunities.",
      },
      {
        title: "Too late",
        body: "Forecasts are fiction, handoffs fail, and history lives only in inboxes — adopt, but budget cleanup time.",
      },
    ],
  },
  {
    type: "step",
    id: "pilot-expand",
    stepNumber: 2,
    heading: "Pilot real deals, then expand",
    body: "Start with a thin stage model, required ownership fields, and the deals that matter this month. Expand automations, integrations, and extra pipelines only after the pilot team trusts the board in weekly reviews.\n\nExample: that SaaS team’s 30-day pilot used only New → Qualified → Proposal → Won/Lost, one owner field, and the 15 active opportunities — no marketing sync yet. After three Friday reviews ran from the board without a shadow sheet, they added email sync and a second pipeline for renewals.",
    tip: "Measure pilot success by “did we stop rebuilding the pipeline?” — not by how many custom fields you created.",
    figure: {
      src: "/guides/when-to-adopt-pilot.png",
      alt: "Pilot real CRM deals then expand: thin stages, required owners, this month’s deals, Friday from board, then sync and pipelines.",
      caption:
        "Measure pilot success by stopping the rebuild — not by how many custom fields you created.",
    },
    scenarios: [
      {
        title: "Agree owners",
        body: "Name who creates deals, who advances stages, and who cleans duplicates.",
      },
      {
        title: "Pilot live deals",
        body: "No sandbox-only theater — put active opportunities in the system and run one real weekly review.",
      },
      {
        title: "Expand",
        body: "Add teams, integrations, and reporting once logging habits stick for a few review cycles.",
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
          "Adopt when volume or memory load breaks personal tracking — not because a checklist said day one.",
        fitHints: ["Light stages", "Personal discipline"],
      },
      {
        id: "first-hire",
        label: "First sales hire",
        description:
          "Often the right moment: shared ownership appears overnight. Pilot together immediately.",
        fitHints: ["Shared owners", "Simple pipeline"],
      },
      {
        id: "small-team",
        label: "Small sales team",
        description:
          "If weekly reviews already hurt, you are in the adoption window — pilot one pod, then expand.",
        fitHints: ["Weekly review", "Pilot pod"],
      },
      {
        id: "scaling",
        label: "Scaling / multi-team",
        description:
          "Adopt (or re-implement) before handoffs multiply; delay increases migration pain.",
        fitHints: ["Handoffs", "Governance"],
      },
    ],
  },
  {
    type: "feature-matrix",
    id: "readiness",
    title: "Readiness signals",
    rows: [
      {
        feature: "Recurring operational pain named",
        mustHave: true,
        niceToHave: false,
        notes: "Adopt window open",
      },
      {
        feature: "Named people who will update records",
        mustHave: true,
        niceToHave: false,
        notes: "Required for pilot",
      },
      {
        feature: "Willing to run live deals in pilot",
        mustHave: true,
        niceToHave: false,
        notes: "Avoid sandbox-only",
      },
      {
        feature: "Perfect process document finished",
        mustHave: false,
        niceToHave: true,
        notes: "Do not block on this",
      },
      {
        feature: "Every integration built on day one",
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
        title: "Waiting for the perfect process",
        body: "The CRM will expose how work actually happens — delay usually protects a fictional process map.",
      },
      {
        title: "Big-bang rollout",
        body: "Forcing every team and every field on day one creates rejection and dirty data.",
      },
      {
        title: "Piloting only fake data",
        body: "Sandbox deals never surface the ownership and follow-up habits that matter.",
      },
      {
        title: "Adopting with no review ritual",
        body: "Without a weekly pipeline review that uses the CRM, the system becomes optional again.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "When is the best time to implement a CRM?",
        answer:
          "When pain is recurring, owners can agree on update rules, and a pilot team can run real deals — then expand after habits stick. Example: a 3-person SaaS team that bought empty seats too early relaunched successfully only after naming owners and piloting 15 live deals.",
      },
      {
        question: "Should startups adopt CRM on day one?",
        answer:
          "Only if shared ownership or volume already creates risk. Many solos start later; first sales hire is a common trigger.",
      },
      {
        question: "How long should a CRM pilot last?",
        answer:
          "Long enough to cover several weekly reviews and real stage movements — typically weeks, not a single demo day. Extend if logging habits are still fragile.",
      },
      {
        question: "What should I read next?",
        answer:
          "Confirm need with Do I Need a CRM?, avoid failure patterns in Common CRM Mistakes, then use How to Choose a CRM or CRM Finder.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related CRM resources",
    links: [
      {
        href: "/guides/do-i-need-a-crm/",
        label: "Do I need a CRM?",
        description: "Confirm the need with pain signals.",
      },
      {
        href: "/guides/common-crm-mistakes/",
        label: "Common CRM mistakes",
        description: "Failure patterns to avoid at adoption.",
      },
      {
        href: "/guides/how-to-choose-crm/",
        label: "How to choose a CRM",
        description: "Buying framework after timing is clear.",
      },
      {
        href: "/guides/crm-requirements-guide/",
        label: "CRM requirements guide",
        description: "Freeze the sheet before you shop.",
      },
      {
        href: "/guides/crm-benefits/",
        label: "CRM benefits",
        description: "What adoption is meant to change.",
      },
      {
        href: "/tools/crm-finder/",
        label: "CRM Finder",
        description: "Shortlist from structured answers.",
      },
      {
        href: "/tools/crm-requirements-builder/",
        label: "Requirements Builder",
        description: "Scope a pilot to must-haves only.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "finder-cta",
    title: "Adopt with a shortlist, not a guess",
    body: "Once timing is right, CRM Finder maps your team constraints to researched products so the pilot starts on a fit-first shortlist.",
    href: "/tools/crm-finder/",
    ctaLabel: "Find My CRM →",
    variant: "finder",
  },
];

export const whenToAdoptCrmGuide: GuidePage = {
  id: "guide-when-to-adopt-crm",
  slug: "when-to-adopt-crm",
  title: "When to Adopt a CRM: Timing, Pilot & Expand",
  summary:
    "Learn when to adopt CRM software — after pain appears and owners agree, pilot with real deals, then expand — without waiting for a perfect process or delaying until chaos piles up.",
  categorySlugs: ["crm"],
  productSlugs: [],
  topicType: "selection",
  journeyStage: "choose",
  knowledgeAreaSlug: "fundamentals",
  heroVisual: {
    src: "/guides/when-to-adopt-crm-hero.png",
    alt: "Hero diagram showing the CRM adoption window between too early (no pain) and too late (chaos and dirty data).",
  },
  supports: [
    {
      contentId: "content:category:crm",
      relationType: "supports-anchor",
      primary: true,
    },
    {
      contentId: "content:best:crm-software",
      relationType: "supports-anchor",
      primary: false,
    },
    {
      contentId: "content:tool:crm-finder",
      relationType: "supports-anchor",
      primary: false,
    },
  ],
  nextAction: {
    contentId: "content:tool:crm-finder",
    label: "Try the CRM Finder",
  },
  relatedGuideSlugs: [
    "do-i-need-a-crm",
    "how-to-choose-crm",
    "crm-requirements-guide",
    "common-crm-mistakes",
    "crm-benefits",
    "crm-vs-spreadsheet",
    "crm-selection-process",
  ],
  blocks: whenToAdoptCrmBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "pain",
      label: "Name the adoption trigger pain",
      description: "Follow-ups, ownership, or rebuilds.",
      order: 0,
    },
    {
      id: "owners",
      label: "Agree pilot owners",
      description: "Who creates, advances, and cleans records.",
      order: 1,
    },
    {
      id: "pilot",
      label: "Define live-deal pilot scope",
      description: "Team, stages, and review ritual.",
      order: 2,
    },
  ],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: {
    status: "published",
    updatedAt: "2026-08-14T08:00:00.000Z",
    publishedAt: "2026-08-14T08:00:00.000Z",
    reviewedAt: "2026-08-14T08:00:00.000Z",
    researchStatus: "complete",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title: "When to Adopt a CRM | SoftwareGlimpse",
    description:
      "Timing guidance for CRM adoption — pain, owners, live-deal pilots, and expansion — without waiting for a perfect process.",
    canonicalPath: "/guides/when-to-adopt-crm/",
    indexable: true,
  },
};
