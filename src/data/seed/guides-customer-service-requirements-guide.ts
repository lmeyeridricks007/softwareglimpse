import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const customerServiceRequirementsGuideBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Write customer service requirements as jobs and evidence, not feature wishlists: primary job (helpdesk vs live chat vs ecommerce vs ITSM), must-have channels, SLA/routing needs, integrations, reporting cadence, and who updates tickets weekly. Decision rule: every must-have must map to a weekly outcome and a plan or volume tier you are willing to buy.",
    bullets: [
      "Primary job statement",
      "Must-have channels",
      "SLA / routing needs",
      "Integrations list",
      "Reporting cadence",
      "Roles & permissions",
    ],
  },
  {
    type: "key-takeaways",
    id: "kt",
    title: "Key takeaways",
    items: [
      {
        label: "Separate must from nice",
        body: "If the team still operates without it for 90 days, it is nice-to-have.",
      },
      {
        label: "Requirements own plan gates",
        body: "Omnichannel, Shopify macros, and SSO must-haves imply a qualifying configuration — write that explicitly.",
      },
      {
        label: "Clusters need their own sheet",
        body: "Helpdesk, live-chat, and ITSM requirements should not pollute a single undifferentiated RFP.",
      },
    ],
  },
  {
    type: "step",
    id: "write-jobs",
    stepNumber: 1,
    heading: "Write three job statements",
    body: "Capture: (1) who updates tickets or chats, (2) who needs visibility, (3) which CRM or storefront tools must sync.\n\nWorked example: Harbor Shop wrote “Agents resolve Shopify refunds in one thread; the lead needs first-response SLAs without chasing Slack; finance needs a weekly refund export.”",
    tip: "Reject any requirement that cannot be tested in a two-week trial.",
  },
  {
    type: "step",
    id: "score-sheet",
    stepNumber: 2,
    heading: "Build a one-page score sheet",
    body: "Columns: requirement, must/nice, evidence to collect in trial, qualifying plan/volume. Rows for ticketing, live chat, knowledge base, omnichannel, ecommerce context, ITSM, integrations, reporting.\n\nThis guide is the requirements surface for customer-service buyers on SoftwareGlimpse.",
    tip: "Score only inside one job cluster per sheet.",
    figure: {
      src: "/guides/customer-service-requirements-guide-sheet.png",
      alt: "One-page customer service requirements score sheet with must/nice columns.",
      caption:
        "One page beats a 40-row feature dump — every must-have needs evidence and a plan tier.",
    },
  },
  {
    type: "faq",
    id: "faq",
    title: "FAQ",
    items: [
      {
        question: "Should requirements include scores?",
        answer:
          "No invented product scores. Capture evidence against your jobs; use Best page methodology for cluster editor’s picks.",
      },
      {
        question: "How many must-haves is too many?",
        answer:
          "If more than roughly eight items are must-haves, you are still in wishlist mode — force a ranking.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "next",
    title: "Next steps",
    body: "Turn the score sheet into an evaluation script.",
    href: "/guides/customer-service-evaluation-guide/",
    ctaLabel: "Evaluation guide →",
    variant: "finder",
  },
];

export const customerServiceRequirementsGuide: GuidePage = {
  id: "guide-customer-service-requirements-guide",
  slug: "customer-service-requirements-guide",
  title: "Customer Service Software Requirements Guide",
  summary:
    "A practical requirements sheet for helpdesk, live chat, ecommerce helpdesk, knowledge base, and ITSM purchases.",
  categorySlugs: ["customer-service"],
  topicType: "checklist",
  heroVisual: {
    src: "/guides/customer-service-requirements-guide-hero.png",
    alt: "Educational illustration for Customer Service Software Requirements Guide.",
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
    "how-to-choose-customer-service-software",
    "customer-service-pricing-guide",
    "customer-service-evaluation-guide",
  ],
  blocks: customerServiceRequirementsGuideBlocks as GuidePage["blocks"],
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
    title: "Customer Service Software Requirements Guide | SoftwareGlimpse",
    description:
      "Write customer service software requirements by job cluster — helpdesk, live chat, ecommerce helpdesk, knowledge base, and ITSM — with must/nice evidence.",
    canonicalPath: "/guides/customer-service-requirements-guide/",
    indexable: true,
  },
};
