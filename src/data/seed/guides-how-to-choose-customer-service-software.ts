import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const howToChooseCustomerServiceSoftwareBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Choose customer service software by the job that is blocking work — helpdesk ticketing, live chat, ecommerce order-aware support, knowledge-base deflection, or ITSM — then confirm agents/conversation caps, plan gates, and the CRM or storefront integrations you need. Shortlist only tools whose core product is your job; a live-chat widget and an ITSM desk are different purchases even when both live in this category.",
    bullets: [
      "Primary job to be done",
      "Agents / tickets / conversations",
      "Must-have channels & gates",
      "CRM / storefront integrations",
      "AI as assistance, not the core",
      "Trial with one real workflow",
    ],
  },
  {
    type: "key-takeaways",
    id: "takeaways",
    title: "What matters most",
    items: [
      {
        label: "“Customer service software” is several products",
        body: "Helpdesk, live chat, ecommerce inboxes, and ITSM desks fail for different reasons. Pick the shape before you pick a brand.",
      },
      {
        label: "Seat vs ticket vs AI-outcome math changes cost",
        body: "Per-agent floors, conversation caps, and AI credit packs often decide TCO. Price the qualifying configuration.",
      },
      {
        label: "Channel gates hide on cheaper tiles",
        body: "Voice, social, SLAs, or Shopify macros may unlock only on a higher plan — map must-haves before the demo.",
      },
      {
        label: "Do not invent scores from marketing pages",
        body: "Use SoftwareGlimpse methodology qualitatively when comparing peers — see Best customer service software for job-cluster editor’s picks.",
      },
    ],
  },
  {
    type: "figure",
    id: "worked-examples",
    title: "Five worked examples",
    src: "/guides/how-to-choose-customer-service-software-needs.png",
    alt: "Five worked examples of customer service buying: helpdesk, live chat, ecommerce helpdesk, knowledge base, and ITSM.",
    caption:
      "Five teams, one category, five different shortlists. The job decides the tool — not the brand.",
  },
  {
    type: "selection-checklist",
    id: "interactive-checklist",
    title: "Interactive customer service selection checklist",
    dimensions: [
      {
        id: "primary-job",
        label: "Primary job",
        options: [
          "Helpdesk / ticketing",
          "Live chat support",
          "Ecommerce helpdesk",
          "Knowledge base / self-service",
          "ITSM / service desk",
        ],
      },
      {
        id: "team-size",
        label: "Agents needing access",
        options: ["1–5", "6–20", "21–75", "75+"],
      },
      {
        id: "channels",
        label: "Channels needed",
        options: ["Email only", "Email + chat", "Omnichannel + social", "Voice / ITSM"],
      },
      {
        id: "stack",
        label: "Must integrate with",
        options: ["CRM", "Shopify / storefront", "Identity / SSO", "Minimal integrations"],
      },
      {
        id: "budget-style",
        label: "Buying style",
        options: ["Free / self-serve", "Published per-agent", "Ticket / conversation caps", "Enterprise RFP"],
      },
    ],
  },
  {
    type: "step",
    id: "name-the-job",
    stepNumber: 1,
    heading: "Name the job in one sentence",
    body: "Write: “We need software so that ___ happens every week without inbox archaeology.” If the blank is owned tickets and SLAs, you are in helpdesk. If it is website visitors in real time, you are in live chat. If it is refunds with order context, buy an ecommerce helpdesk. If it is employee incidents and changes, buy ITSM.\n\nWorked example: Northline Support wrote “every Shopify refund has order context in the same thread.” That sentence ruled out generic live-chat widgets before demos started.",
    tip: "If two jobs are blocking, buy for the one that creates the most rework this quarter.",
  },
  {
    type: "step",
    id: "map-gates",
    stepNumber: 2,
    heading: "Map must-haves to plan and usage gates",
    body: "List the workflows that must work on day one — SLAs, macros, live chat, social, Shopify refunds, change management, SSO — and ask which plan or conversation pack unlocks them. Ticket-cap and AI-outcome vendors need a volume model, not just a seat count.\n\nWorked example: Harbor Shop needed order macros on Starter; a helpdesk that gated ecommerce apps behind Enterprise failed that requirement.",
    tip: "Ask for a written configuration quote — agents, ticket/conversation caps, AI packs, add-ons — before the demo ends.",
    figure: {
      src: "/guides/how-to-choose-customer-service-software-framework.png",
      alt: "Customer service selection framework mapping job cluster to plan gates and integrations.",
      caption: "Job first, then gates, then integrations — brand comparisons come last.",
    },
  },
  {
    type: "faq",
    id: "faq",
    title: "FAQ",
    items: [
      {
        question: "Should I buy an all-in-one support suite?",
        answer:
          "Only if you will use multiple hubs weekly. Otherwise a specialist helpdesk, live-chat tool, or ecommerce inbox usually ships faster and clearer TCO.",
      },
      {
        question: "How do I treat Intercom on a customer service shortlist?",
        answer:
          "As a business-communications primary AI-inbox / messenger product. It is a borderline CS adjacency — not a helpdesk or live-chat methodology peer on SoftwareGlimpse.",
      },
      {
        question: "Where should I compare researched products?",
        answer:
          "See Best customer service software for Wave-1 editor’s picks by job cluster and disclosed methodology notes.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "next",
    title: "Next steps",
    body: "Shortlist by job cluster, then confirm live commercial terms.",
    href: "/best/customer-service-software/",
    ctaLabel: "Best customer service software →",
    variant: "finder",
  },
];

export const howToChooseCustomerServiceSoftwareGuide: GuidePage = {
  id: "guide-how-to-choose-customer-service-software",
  slug: "how-to-choose-customer-service-software",
  title: "How to Choose Customer Service Software",
  summary:
    "A practical framework for shortlisting helpdesk, live chat, ecommerce helpdesk, knowledge base, and ITSM tools by job.",
  categorySlugs: ["customer-service"],
  topicType: "buying-guide",
  journeyStage: "evaluate",
  heroVisual: {
    src: "/guides/how-to-choose-customer-service-software-hero.png",
    alt: "Educational illustration for How to Choose Customer Service Software.",
  },
  supports: [
    {
      contentId: "content:category:customer-service",
      relationType: "supports-anchor",
      primary: true,
    },
    {
      contentId: "content:best:customer-service-software",
      relationType: "supports-anchor",
      primary: false,
    },
  ],
  relatedGuideSlugs: [
    "what-is-customer-service-software",
    "customer-service-pricing-guide",
    "customer-service-requirements-guide",
    "customer-service-evaluation-guide",
  ],
  blocks: howToChooseCustomerServiceSoftwareBlocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: {
    status: "published",
    updatedAt: "2026-08-18T00:00:00.000Z",
    publishedAt: "2026-08-18T00:00:00.000Z",
    reviewedAt: "2026-08-18T00:00:00.000Z",
    researchStatus: "complete",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title: "How to Choose Customer Service Software | SoftwareGlimpse",
    description:
      "How to choose customer service software by job cluster — helpdesk, live chat, ecommerce helpdesk, knowledge base, and ITSM — with plan gates and integrations.",
    canonicalPath: "/guides/how-to-choose-customer-service-software/",
    indexable: true,
  },
};
