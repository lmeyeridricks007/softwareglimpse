import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const customerServicePricingGuideBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Customer service software pricing is usually per agent, per ticket or conversation pack, or AI outcome/credits — plus add-ons. Decision rule: never compare the advertised starter tile; compare the total for your real agent count and volume on the configuration that unlocks your must-have channels.",
    bullets: [
      "Agents / seats",
      "Tickets / conversations",
      "Plan feature gates",
      "AI resolutions / credits",
      "Add-ons (voice, social, SSO)",
      "Annual vs monthly",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Gates are part of the price",
        body: "A cheap tile that blocks SLAs, omnichannel, or Shopify macros forces an upgrade — budget the qualifying tier.",
      },
      {
        label: "Units are not comparable on a tile alone",
        body: "Per-agent helpdesks, conversation-cap live chat, and ticket-based ecommerce inboxes need a volume model for the same team.",
      },
      {
        label: "AI packs stack on the core",
        body: "Outcome-priced agents and credit bundles can exceed seat cost. Treat AI as a line item, not a free checkbox.",
      },
      {
        label: "ITSM floors are a different purchase",
        body: "Employee service-desk SKUs are not cheaper helpdesks. Do not compare Freshservice tiles to live-chat Starter prices as peers.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "pricing-path",
    title: "Pricing path",
    steps: [
      { id: "agents", label: "Agents", short: "Real headcount" },
      { id: "volume", label: "Volume", short: "Tickets / chats" },
      { id: "gates", label: "Gates", short: "Must-have channels" },
      { id: "ai", label: "AI", short: "Credits / outcomes" },
      { id: "addons", label: "Add-ons", short: "Voice / SSO" },
      { id: "total", label: "Total", short: "Compare like for like" },
    ],
    ctaHref: "/best/customer-service-software/",
    ctaLabel: "See Best Customer Service Software →",
    figure: {
      src: "/guides/customer-service-pricing-guide-stack.png",
      alt: "Customer service cost stack: agents, volume caps, feature gates, AI packs, and add-ons.",
      caption:
        "The starter tile is the bottom layer. Caps, gates, and AI often decide which vendor is actually cheaper.",
    },
  },
  {
    type: "step",
    id: "build-total",
    stepNumber: 1,
    heading: "Build one comparable total per vendor",
    body: "Use one assumption set: agent count, monthly tickets or chats, must-have channels, and whether AI deflection is in scope. Total the qualifying configuration.\n\nWorked example: Northline Support needs 8 agents and ~2,000 tickets/month with Shopify macros. Vendor A’s $19/agent tile looks cheaper until macros unlock on a higher tier; Vendor B’s ticket pack looks expensive until you include overage. The honest comparison is qualifying config × volume, not the homepage tile.",
    tip: "Ask for a written quote on the qualifying configuration for your agents and volume.",
    figure: {
      src: "/guides/customer-service-pricing-guide-worked-example.png",
      alt: "Worked example comparing two customer service quotes at the same agent count with gate and volume effects.",
      caption:
        "Same team, same requirements — the cheaper tile is not always the cheaper deployment once caps apply.",
    },
  },
  {
    type: "faq",
    id: "faq",
    title: "FAQ",
    items: [
      {
        question: "How much does customer service software cost?",
        answer:
          "Models vary: free shared-inbox caps, per-agent helpdesks from published $7–$19 floors, ticket/conversation packs, and quote-led ITSM. Exact floors change — confirm live vendor pricing.",
      },
      {
        question: "Should I pay annually?",
        answer:
          "Annual billing is usually discounted but locks seats and volume. If seasonal chat spikes, price both annual and monthly overage.",
      },
      {
        question: "Do affiliate deals change our advice?",
        answer:
          "No. SoftwareGlimpse methodology excludes affiliate economics from rankings and pricing guidance.",
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

export const customerServicePricingGuide: GuidePage = {
  id: "guide-customer-service-pricing-guide",
  slug: "customer-service-pricing-guide",
  title: "Customer Service Software Pricing Guide",
  summary:
    "Budget helpdesk, live chat, ecommerce helpdesk, and ITSM tools by qualifying configuration — not the advertised starter tile.",
  categorySlugs: ["customer-service"],
  topicType: "pricing-education",
  heroVisual: {
    src: "/guides/customer-service-pricing-guide-hero.png",
    alt: "Educational illustration for Customer Service Software Pricing Guide.",
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
  journeyStage: "evaluate",
  relatedGuideSlugs: [
    "what-is-customer-service-software",
    "how-to-choose-customer-service-software",
    "customer-service-requirements-guide",
    "customer-service-evaluation-guide",
  ],
  blocks: customerServicePricingGuideBlocks as GuidePage["blocks"],
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
    title: "Customer Service Software Pricing Guide | SoftwareGlimpse",
    description:
      "How to budget customer service software — agents, ticket/conversation caps, plan gates, AI credits, and add-ons.",
    canonicalPath: "/guides/customer-service-pricing-guide/",
    indexable: true,
  },
};
