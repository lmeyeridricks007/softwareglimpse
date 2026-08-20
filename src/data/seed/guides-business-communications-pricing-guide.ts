import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const businessCommunicationsPricingGuideBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Business communications pricing is a per-seat licence plus everything that sits on top of it: licence minimums, phone numbers, calling minutes, and — for WhatsApp platforms — Meta conversation fees the vendor does not control. Decision rule: never compare the advertised per-user tile; compare the total for your real seat count, on the tier that unlocks your must-have features, including numbers and expected usage.",
    bullets: [
      "Per-seat licence",
      "Licence minimums",
      "Number charges",
      "Minutes: bundled or metered",
      "WhatsApp conversation fees",
      "Feature gates by tier",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Minimums are part of the price",
        body: "A three-licence minimum on a $30 seat means $90 a month whether or not you have three people who need it.",
      },
      {
        label: "Usage billing varies more than seat price",
        body: "Some plans bundle inbound minutes, some meter everything pay-as-you-go. For a high-volume team, the usage model can outweigh the licence entirely.",
      },
      {
        label: "The cheap tier usually lacks the feature you came for",
        body: "Call recording, IVR, analytics, and AI commonly unlock one or two tiers up. Price the qualifying tier, not the entry rung.",
      },
      {
        label: "WhatsApp pricing has two bills",
        body: "A platform subscription plus Meta's per-conversation charges. The vendor publishes the first and passes through the second.",
      },
      {
        label: "Published figures move",
        body: "Several vendors render pricing client-side or restrict access. Confirm current numbers in writing before you budget.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "pricing-path",
    title: "Pricing path",
    steps: [
      { id: "seats", label: "Seats", short: "Real licence count" },
      { id: "minimum", label: "Minimum", short: "Vendor floor" },
      { id: "tier", label: "Tier", short: "Feature gates" },
      { id: "numbers", label: "Numbers", short: "Per-line charges" },
      { id: "usage", label: "Usage", short: "Minutes & messages" },
      { id: "total", label: "Total", short: "Compare like for like" },
    ],
    ctaHref: "/best/business-communications-software/",
    ctaLabel: "See Best Business Communications Software →",
    figure: {
      src: "/guides/business-communications-pricing-guide-stack.png",
      alt: "Business communications cost stack: seat licence, licence minimum, number charges, calling minutes, and message fees.",
      caption:
        "The seat price is the bottom layer. Minimums, numbers, and usage sit above it — and often decide which vendor is actually cheaper.",
    },
  },
  {
    type: "step",
    id: "read-the-tiers",
    stepNumber: 1,
    heading: "Read the tier ladder for gates, not just prices",
    body: "Write down the tier each must-have unlocks. In the products we researched for this category, the shape is consistent: entry tiers cover calling and basic setup, while recording, IVR, analytics, and AI features appear higher up.\n\nResearched cloud-phone / UCaaS floors (medium confidence where noted — confirm live on the vendor pricing page before you budget): RingCentral RingEX Core around ~$20 per user per month billed annually (selector/quote-gated pages; Advanced ~$25, Ultra ~$35); Dialpad Connect Standard $15 / Pro $25 per user per month annual (medium confidence; Support and Sell are separate ladders); Zoom Phone US/CA Unlimited around ~$15–16 per user per month, with Workplace+Phone bundles commonly cited higher (medium confidence — free Zoom meetings are not Zoom Phone); Nextiva Core $15 / Engage $25 / Scale $75 per user per month annual (high confidence on published Nextiva pricing, still confirm eligibility).\n\nWave-1 and messaging examples still useful for comparison: KrispCall Essential around $12 per user per month annually with pay-as-you-go usage; CallHippo Starter around $18 with a two-user minimum; Freshcaller free agent + Growth from about $15; Aircall Essentials around $30 with a three-licence minimum and Professional around $50 (medium confidence — client-rendered). Wati is a platform subscription from roughly $49 per month annually plus Meta conversation fees. Team messaging (Slack, Microsoft Teams) and WhatsApp inbox tools sit on different cost models — do not compare their tiles to a phone seat.",
    tip: "Ask the vendor to quote the tier that contains your must-haves, for your seat count, in writing. Verbal demo pricing is not a quote.",
    scenarios: [
      {
        title: "Small team, one country",
        body: "Seat price and licence minimum dominate; bundled minutes rarely matter yet.",
      },
      {
        title: "High-volume outbound",
        body: "Per-minute rates and dialer availability outweigh the licence difference.",
      },
      {
        title: "WhatsApp messaging",
        body: "Conversation volume drives the Meta bill; the platform fee is the smaller half at scale.",
      },
    ],
  },
  {
    type: "step",
    id: "build-the-total",
    stepNumber: 2,
    heading: "Build one comparable total per vendor",
    body: "Use a single assumption set for every quote: number of licences, countries where you need numbers, expected inbound and outbound minutes, and expected monthly message volume. Then total the licence cost at the qualifying tier, plus number rental, plus expected usage.\n\nWorked example: Harbor Studio needs four licences and numbers in two countries. On a $30 seat with a three-licence minimum, four licences cost $120 before numbers — the minimum is not binding at four users. On an $18 seat with a two-user minimum, the same four licences cost $72, but recording sits one tier up, so the honest comparison is against that higher tier, not the starter rung. Neither total is knowable from the pricing tile alone.",
    tip: "Keep the assumption set in the same document as the quotes. When a vendor changes the seat count to look cheaper, the mismatch is immediately visible.",
    figure: {
      src: "/guides/business-communications-pricing-worked-example.png",
      alt: "Worked example comparing two business phone quotes at the same seat count, showing licence minimum and feature-tier effects.",
      caption:
        "Same team, same requirements — the cheaper tile is not always the cheaper deployment once minimums and feature tiers are applied.",
    },
  },
  {
    type: "faq",
    id: "faq",
    title: "FAQ",
    items: [
      {
        question: "How much does a business phone system cost per user?",
        answer:
          "In the products researched for this category, published cloud-phone entry floors commonly sit from about $12 to about $30 per user or licence per month on annual billing (KrispCall-class budget through Aircall-class mid-market), with several UCaaS peers (RingCentral, Dialpad, Zoom Phone, Nextiva) researching around ~$15–20 annual entry floors at medium-to-high confidence — confirm live. One product offers a free agent tier with metered minutes. Numbers and calling minutes are usually charged separately, so the per-user figure is a starting point rather than the bill.",
      },
      {
        question: "Are annual plans always cheaper?",
        answer:
          "Annual billing is usually discounted, but it also locks the seat count. If your team size is uncertain, price both and decide whether the discount is worth the commitment.",
      },
      {
        question: "Why do WhatsApp platforms quote two prices?",
        answer:
          "The platform charges a subscription for the inbox, automation, and broadcast tooling. Meta separately charges per conversation or message through the WhatsApp Business API. The platform passes those through and does not set the rate.",
      },
      {
        question: "Do I pay for phone numbers separately?",
        answer:
          "Usually yes. Most vendors rent numbers monthly, with different rates for local, national, and toll-free lines, and different availability per country. Budget one line item per number you need.",
      },
      {
        question: "What should I do next?",
        answer:
          "Freeze must-haves with the requirements guide so you price the correct tier, then use the evaluation guide's trial script before committing to annual billing.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related business communications resources",
    links: [
      {
        href: "/guides/how-to-choose-business-communications-software/",
        label: "How to choose business communications software",
        description: "Job-first framework.",
      },
      {
        href: "/guides/business-communications-requirements-guide/",
        label: "Requirements guide",
        description: "Decide which tier you actually need.",
      },
      {
        href: "/guides/business-communications-evaluation-guide/",
        label: "Evaluation guide",
        description: "Trial before you commit annually.",
      },
      {
        href: "/best/business-communications-software/",
        label: "Best business communications software",
        description: "Methodology shortlist.",
      },
      {
        href: "/categories/business-communications/",
        label: "Business communications category",
        description: "Browse the catalogue.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "best-cta",
    title: "Compare researched platforms",
    body: "Once your seat count, country list, and usage assumptions are frozen, open the Best Business Communications Software shortlist — ordering follows published criteria, not commissions.",
    href: "/best/business-communications-software/",
    ctaLabel: "See Best Business Communications Software →",
    variant: "finder",
  },
];

export const businessCommunicationsPricingGuide: GuidePage = {
  id: "guide-business-communications-pricing-guide",
  slug: "business-communications-pricing-guide",
  title: "Business Communications Pricing Guide: Seats, Minutes & Message Fees",
  summary:
    "How business communications pricing really works — per-seat licences, licence minimums, number rental, calling minutes, and WhatsApp conversation fees — with a method for building comparable totals.",
  categorySlugs: ["business-communications"],
  productSlugs: [
    "ringcentral",
    "dialpad",
    "zoom",
    "nextiva",
    "aircall",
    "callhippo",
    "krispcall",
    "freshcaller",
    "wati",
    "slack",
    "microsoft-teams",
  ],
  topicType: "pricing-education",
  journeyStage: "choose",
  knowledgeAreaSlug: "selection",
  heroVisual: {
    src: "/guides/business-communications-pricing-guide-hero.png",
    alt: "Business communications pricing hero: seat licence, licence minimum, number rental, minutes, and message fees stacked into one total.",
  },
  supports: [
    {
      contentId: "content:category:business-communications",
      relationType: "supports-anchor",
      primary: true,
    },
    {
      contentId: "content:best:business-communications-software",
      relationType: "supports-anchor",
      primary: false,
    },
  ],
  nextAction: {
    contentId: "content:best:business-communications-software",
    label: "See Best Business Communications Software",
  },
  relatedGuideSlugs: [
    "how-to-choose-business-communications-software",
    "business-communications-requirements-guide",
    "business-communications-evaluation-guide",
    "what-is-business-communications-software",
  ],
  blocks: businessCommunicationsPricingGuideBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "seats",
      label: "Fix one seat assumption",
      description: "Same licence count in every quote.",
      order: 0,
    },
    {
      id: "tier",
      label: "Price the qualifying tier",
      description: "The tier that unlocks your must-haves.",
      order: 1,
    },
    {
      id: "usage",
      label: "Add numbers and usage",
      description: "Lines, minutes, and message fees.",
      order: 2,
    },
  ],
  sections: [],
  faq: [],
  freshnessClass: "medium-moving",
  metadata: {
    status: "published",
    updatedAt: "2026-08-17T12:00:00.000Z",
    publishedAt: "2026-08-17T12:00:00.000Z",
    reviewedAt: "2026-08-17T12:00:00.000Z",
    researchStatus: "complete",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title: "Business Communications Pricing Guide | SoftwareGlimpse",
    description:
      "Business communications pricing explained: per-seat licences, licence minimums, phone number rental, calling minutes, and WhatsApp conversation fees.",
    canonicalPath: "/guides/business-communications-pricing-guide/",
    indexable: true,
  },
};
