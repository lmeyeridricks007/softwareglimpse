import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const howToChooseMarketingSoftwareBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Choose marketing software by the job that is blocking work — social scheduling, funnels/landing pages, MAP automation, social listening, or webinars — then confirm seats or contact volume, plan gates, and the CRM/ESP integrations you need. Shortlist only tools whose core product is your job; a scheduler and a listening suite are different purchases even when both live in this category.",
    bullets: [
      "Primary job to be done",
      "Channels / contact volume",
      "Must-have workflows & gates",
      "CRM / ESP integrations",
      "Seat vs contact vs mention pricing",
      "Trial with one real campaign",
    ],
  },
  {
    type: "key-takeaways",
    id: "takeaways",
    title: "What matters most",
    items: [
      {
        label: "“Marketing software” is several products",
        body: "Schedulers, funnel builders, MAP platforms, listening tools, and webinar products fail for different reasons. Pick the shape before you pick a brand.",
      },
      {
        label: "Contact and mention math changes cost",
        body: "Profile caps, mention volumes, and AI add-ons often decide TCO. Price the qualifying configuration.",
      },
      {
        label: "Approvals beat extra networks",
        body: "If legal or brand review is the bottleneck, a calendar with approvals beats a tool that adds two unused networks.",
      },
      {
        label: "Do not invent scores from marketing pages",
        body: "Use SoftwareGlimpse methodology qualitatively when comparing peers — see Best marketing software for job-cluster editor’s picks.",
      },
    ],
  },
  {
    type: "figure",
    id: "worked-examples",
    title: "Five worked examples",
    src: "/guides/how-to-choose-marketing-software-needs.png",
    alt: "Five worked examples of marketing buying: scheduler, funnel, MAP, listening, and webinars.",
    caption:
      "Five teams, one category, five different shortlists. The job decides the tool — not the brand.",
  },
  {
    type: "selection-checklist",
    id: "interactive-checklist",
    title: "Interactive marketing selection checklist",
    dimensions: [
      {
        id: "primary-job",
        label: "Primary job",
        options: [
          "Social scheduling",
          "Funnels / landing pages",
          "MAP / lifecycle automation",
          "Social listening / PR intel",
          "Webinars / live video",
        ],
      },
      {
        id: "team-size",
        label: "People needing access",
        options: ["1–5", "6–20", "21–100", "100+"],
      },
      {
        id: "volume",
        label: "Scale driver",
        options: [
          "Channels / profiles",
          "Contacts / leads",
          "Mentions / coverage",
          "Events / attendees",
        ],
      },
      {
        id: "stack",
        label: "Must integrate with",
        options: ["CRM", "ESP / email", "Ads accounts", "Minimal integrations"],
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
    body: "Write: “We need software so that ___ happens every week without spreadsheet archaeology.” If the blank is scheduled posts with approvals, you are in social scheduling. If it is a campaign page with checkout, you are in funnels. If it is multi-step journeys from a person record, you are in MAP. If it is mention triage, you are in listening.\n\nWorked example: Harbor Creative wrote “three social channels publish from one calendar this month.” That sentence ruled out Meltwater-only tools before demos started.",
    tip: "If two jobs are blocking, buy for the one that creates the most rework this quarter.",
  },
  {
    type: "step",
    id: "map-gates",
    stepNumber: 2,
    heading: "Map must-haves to plan gates and TCO",
    body: "List the workflows that must work on day one — approvals, Shopify/checkout, journey branching, mention alerts, webinar rooms — and ask which plan unlocks them. Model seats, contact tiers, or mention volumes at your expected usage.\n\nWorked example: Northline Demand needed branching journeys synced to HubSpot; a funnel-builder trial without a person model failed that requirement, so MAP-class tools stayed on the shortlist and a page builder did not.",
    tip: "Ask for a written configuration — plan, volume bands, required add-ons — before the demo ends.",
    figure: {
      src: "/guides/how-to-choose-marketing-software-framework.png",
      alt: "Marketing selection framework mapping job cluster to plan gates, volume bands, and integrations.",
      caption: "Job first, then gates and TCO, then brand comparisons.",
    },
  },
  {
    type: "faq",
    id: "faq",
    title: "FAQ",
    items: [
      {
        question: "Should I buy Hootsuite if I only need Buffer-class scheduling?",
        answer:
          "Only if enterprise governance or listening is the job. Compare schedulers to schedulers. Do not rank them as a single undifferentiated #1 against MAP or funnels.",
      },
      {
        question: "How do I treat Klaviyo on a marketing shortlist?",
        answer:
          "As email marketing when owned-channel campaigns are the job — not as a Buffer or ClickFunnels peer scored on social or funnel methodology.",
      },
      {
        question: "Where should I compare researched products?",
        answer:
          "See Best marketing software for editor’s picks by job cluster and disclosed methodology notes.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "next",
    title: "Next steps",
    body: "Shortlist by job cluster, then confirm live commercial terms.",
    href: "/best/marketing-software/",
    ctaLabel: "Best marketing software →",
    variant: "finder",
  },
];

export const howToChooseMarketingSoftwareGuide: GuidePage = {
  id: "guide-how-to-choose-marketing-software",
  slug: "how-to-choose-marketing-software",
  title: "How to Choose Marketing Software",
  summary:
    "A practical framework for shortlisting social schedulers, funnel builders, MAP platforms, listening tools, and webinars by job.",
  categorySlugs: ["marketing"],
  topicType: "buying-guide",
  journeyStage: "evaluate",
  heroVisual: {
    src: "/guides/how-to-choose-marketing-software-hero.png",
    alt: "Educational illustration for How to Choose Marketing Software.",
  },
  supports: [
    {
      contentId: "content:category:marketing",
      relationType: "supports-anchor",
      primary: true,
    },
    {
      contentId: "content:best:marketing-software",
      relationType: "supports-anchor",
      primary: false,
    },
  ],
  relatedGuideSlugs: [
    "what-is-marketing-software",
    "marketing-software-pricing-guide",
    "marketing-software-requirements-guide",
    "marketing-software-evaluation-guide",
  ],
  blocks: howToChooseMarketingSoftwareBlocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: {
    status: "published",
    updatedAt: "2026-08-18T12:00:00.000Z",
    publishedAt: "2026-08-18T12:00:00.000Z",
    reviewedAt: "2026-08-18T12:00:00.000Z",
    researchStatus: "complete",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title: "How to Choose Marketing Software | SoftwareGlimpse",
    description:
      "How to choose marketing software by job cluster — social scheduling, funnels, MAP, listening, and webinars — with plan gates and integrations.",
    canonicalPath: "/guides/how-to-choose-marketing-software/",
    indexable: true,
  },
};
