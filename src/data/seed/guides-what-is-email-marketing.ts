import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * Fundamental email marketing guide — softwareglimpse-guide-template-v1.
 */
const whatIsEmailMarketingBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Email marketing software (an ESP) creates, sends, and measures permission-based marketing email to subscriber lists — newsletters, campaigns, and automation workflows centered on email. Decision rule: if the blocking job this quarter is “reach people who opted in, with measurable campaigns,” you need email marketing; if the job is “find strangers’ work emails for outbound sales,” you need sales intelligence / outreach — not an ESP.",
    bullets: [
      "Permission-based lists",
      "Campaigns & newsletters",
      "Automation workflows",
      "Segmentation & analytics",
      "Not a personal inbox",
      "Not cold-outreach SI",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "ESP ≠ CRM",
        body: "CRM stores ownership, pipeline, and history. Email marketing sends and measures campaigns to subscribers — then may sync results back to CRM.",
      },
      {
        label: "Permission is the product boundary",
        body: "Marketing email assumes opted-in (or otherwise lawfully grounded) contacts. Cold outbound sequencers sit in sales intelligence, not this category.",
      },
      {
        label: "Contact tiers decide commercial fit",
        body: "Most ESPs price by subscribers or contacts. List size and send caps usually matter more than a marketing “from” tile.",
      },
      {
        label: "Automation depth varies widely",
        body: "Simple newsletters, design-led campaigns, and multi-step journeys are different jobs under one label — name the job first.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "em-building-blocks",
    title: "Email marketing building blocks",
    steps: [
      { id: "block-list", label: "List", short: "Subscribers & consent" },
      { id: "block-create", label: "Create", short: "Templates & editor" },
      { id: "block-segment", label: "Segment", short: "Who gets what" },
      { id: "block-send", label: "Send", short: "Campaigns & journeys" },
      { id: "block-measure", label: "Measure", short: "Opens, clicks, conversions" },
      { id: "block-deliver", label: "Deliver", short: "Auth & reputation" },
    ],
    ctaHref: "/guides/how-to-choose-email-marketing/",
    ctaLabel: "How to choose email marketing →",
    figure: {
      src: "/guides/what-is-email-marketing-building-blocks.png",
      alt: "Six email marketing building blocks: list, create, segment, send, measure, and deliverability.",
      caption:
        "These blocks define email marketing for permission-based programs — CRM still owns deals and relationship history.",
    },
  },
  {
    type: "step",
    id: "how-it-works",
    stepNumber: 1,
    heading: "How does email marketing software work?",
    body: "Most ESPs share a loop: grow and clean a subscriber list, compose with templates or a visual editor, segment who receives each message, send one-off campaigns or automated journeys, then measure opens, clicks, and conversions while protecting deliverability (domain auth, list hygiene).\n\nExample: a three-person ecommerce team at Northline Goods (DTC accessories) runs a weekly newsletter plus cart-abandon journeys. They capture signups on landing pages, segment by purchase history, send campaigns from their ESP, and push revenue events back to analytics — without treating the ESP as their order system of record.",
    tip: "Write the weekly outcome you need (“one newsletter + one nurture path live with clean unsubscribes”) before you compare vendors.",
    figure: {
      src: "/guides/what-is-email-marketing-loop.png",
      alt: "Email marketing loop: list growth, create, segment, send, measure, then deliverability hygiene.",
      caption: "ESP closes the campaign loop; CRM and commerce platforms still own records and orders.",
    },
    scenarios: [
      {
        title: "List",
        body: "Capture subscribers with consent and keep suppression / unsubscribe handling honest.",
      },
      {
        title: "Create",
        body: "Compose with templates, drag-and-drop editors, or reusable design systems.",
      },
      {
        title: "Segment",
        body: "Target by attributes, behavior, and lists — not one blast to everyone.",
      },
      {
        title: "Send",
        body: "Run one-off campaigns, recurring newsletters, or multi-step automations.",
      },
      {
        title: "Measure",
        body: "Track delivery, engagement, and conversion signals your team will act on.",
      },
    ],
  },
  {
    type: "step",
    id: "what-it-includes",
    stepNumber: 2,
    heading: "What email marketing typically includes",
    body: "Core ESP products cover campaigns, newsletter tooling, templates, subscriber management, segmentation, and analytics. Many add automation workflows, landing pages, forms, A/B tests, and light AI for subject lines or copy. Deliverability aids and list verification are often adjacent — useful, but not a substitute for a campaign platform.\n\nCatalogue examples (alphabetical, not a ranking): ActiveCampaign, AWeber, Campaign Monitor, GetResponse, and Mailchimp illustrate different mixes of automation depth, design focus, and freemium paths. Compare them by primary job and contact-tier fit — never by affiliate order or invented scores.",
    tip: "If a homepage says “CRM,” check whether it is a lightweight audience store or a true pipeline system of record before you drop your real CRM.",
  },
  {
    type: "crm-types",
    id: "em-shapes",
    title: "Common email marketing shapes (not rankings)",
    types: [
      {
        id: "newsletter",
        title: "Newsletter / campaign ESP",
        bestFor:
          "Teams whose primary job is recurring newsletters and scheduled campaigns with solid templates.",
        avoidWhen:
          "You need deep multi-step journeys and behavioral branching as the core product job.",
      },
      {
        id: "automation",
        title: "Automation-led ESP",
        bestFor:
          "Marketing-led teams that need multi-step workflows triggered by subscriber events.",
        avoidWhen:
          "You only need a simple weekly newsletter and will never use journeys.",
      },
      {
        id: "ecommerce",
        title: "Ecommerce-oriented email",
        bestFor:
          "Stores needing cart recovery, product blocks, and commerce integrations.",
        avoidWhen:
          "You have no storefront and only need editorial newsletters.",
      },
      {
        id: "all-in-one",
        title: "All-in-one creator / funnel platform",
        bestFor:
          "Creators consolidating email with landing pages, checkouts, or courses in one stack.",
        avoidWhen:
          "You only need a lightweight ESP and do not want suite complexity.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    title: "FAQ",
    items: [
      {
        question: "Is email marketing the same as sales outreach email?",
        answer:
          "No. Email marketing targets permission-based subscribers with campaigns and journeys. Cold outbound to purchased or scraped contacts is a sales-intelligence / sequencing job with different compliance and product shape.",
      },
      {
        question: "Do I need email marketing if I already have a CRM?",
        answer:
          "Often yes. CRM may log sales email; an ESP is built for list growth, campaign design, marketing automation, and deliverability tooling at list scale. Many teams connect both.",
      },
      {
        question: "What should I do next?",
        answer:
          "If you confirmed permission-based campaigns are the job, use How to Choose Email Marketing and the Best Email Marketing Software shortlist — methodology-first, not affiliate-ordered.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related email marketing resources",
    links: [
      {
        href: "/guides/how-to-choose-email-marketing/",
        label: "How to choose email marketing",
        description: "Job-first selection framework.",
      },
      {
        href: "/best/email-marketing-software/",
        label: "Best email marketing software",
        description: "Researched ESP shortlist.",
      },
      {
        href: "/categories/email-marketing/",
        label: "Email marketing category",
        description: "Browse the catalogue.",
      },
      {
        href: "/guides/email-marketing-pricing-guide/",
        label: "Email marketing pricing guide",
        description: "Contact tiers and send limits.",
      },
      {
        href: "/guides/crm-vs-marketing-automation/",
        label: "CRM vs marketing automation",
        description: "Boundary with CRM suites.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "best-cta",
    title: "Compare researched ESPs",
    body: "Once you know the primary job — newsletter, automation, ecommerce, or all-in-one — open the Best Email Marketing Software shortlist. Rankings follow published criteria, not commissions.",
    href: "/best/email-marketing-software/",
    ctaLabel: "See Best Email Marketing Software →",
    variant: "finder",
  },
];

export const whatIsEmailMarketingGuide: GuidePage = {
  id: "guide-what-is-email-marketing",
  slug: "what-is-email-marketing",
  title: "What Is Email Marketing Software? Beginner’s Guide",
  summary:
    "What is email marketing software? A clear definition of permission-based ESPs — campaigns, newsletters, and automation — and how they differ from CRM and cold outreach.",
  categorySlugs: ["email-marketing"],
  productSlugs: [
    "getresponse",
    "aweber",
    "campaign-monitor",
    "mailchimp",
    "activecampaign",
  ],
  topicType: "fundamental",
  journeyStage: "learn",
  knowledgeAreaSlug: "fundamentals",
  heroVisual: {
    src: "/guides/what-is-email-marketing-hero.png",
    alt: "Email marketing as a campaign layer: list, create, segment, send, and measure — not a CRM pipeline system of record.",
  },
  supports: [
    {
      contentId: "content:category:email-marketing",
      relationType: "supports-anchor",
      primary: true,
    },
    {
      contentId: "content:best:email-marketing-software",
      relationType: "supports-anchor",
      primary: false,
    },
    {
      contentId: "content:guide:how-to-choose-email-marketing",
      relationType: "supports-anchor",
      primary: false,
    },
  ],
  nextAction: {
    contentId: "content:guide:how-to-choose-email-marketing",
    label: "How to choose email marketing",
  },
  relatedGuideSlugs: [
    "how-to-choose-email-marketing",
    "email-marketing-pricing-guide",
    "email-marketing-requirements-guide",
    "crm-vs-marketing-automation",
  ],
  blocks: whatIsEmailMarketingBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "job",
      label: "Name the primary job",
      description: "Newsletter, automation, ecommerce, or all-in-one — one sentence.",
      order: 0,
    },
    {
      id: "boundary",
      label: "Confirm permission-based scope",
      description: "ESP for opted-in lists; SI for cold outbound.",
      order: 1,
    },
    {
      id: "list-size",
      label: "Estimate contact tier",
      description: "Approximate subscribers for pricing comparisons.",
      order: 2,
    },
  ],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: {
    status: "published",
    updatedAt: "2026-08-17T12:00:00.000Z",
    publishedAt: "2026-08-17T12:00:00.000Z",
    reviewedAt: "2026-08-17T12:00:00.000Z",
    researchStatus: "complete",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title: "What Is Email Marketing Software? | SoftwareGlimpse",
    description:
      "What is email marketing software? A clear definition of permission-based ESPs — campaigns, newsletters, automation — and how they differ from CRM and cold outreach.",
    canonicalPath: "/guides/what-is-email-marketing/",
    indexable: true,
  },
};
