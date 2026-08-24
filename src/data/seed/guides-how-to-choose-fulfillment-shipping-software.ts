import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import { tier26GuideScheduledAt } from "@/data/config/publishing/tier-26-fulfillment-shipping-launch-2027-07-01";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const SLUG = "how-to-choose-fulfillment-shipping-software";
const SCHEDULED_AT = tier26GuideScheduledAt(SLUG);

const blocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Choose fulfillment and shipping software by the ops job blocking work — multi-carrier label generation or outsourced 3PL warehouse fulfillment — then confirm carrier coverage, returns workflows, storefront integrations, and per-label or per-pick TCO. Shortlist only tools whose core product is fulfillment or shipping ops, not hosted storefront platforms or dropshipping product sourcing.",
    bullets: [
      "Primary fulfillment job",
      "3PL vs self-ship label tools",
      "Carrier and region coverage",
      "Returns and reverse logistics",
      "Storefront / OMS integrations",
      "Trial with one real shipment workflow",
    ],
  },
  {
    type: "interactive-cta",
    id: "next",
    title: "Next steps",
    body: "Shortlist by fulfillment cluster, then confirm live commercial terms.",
    href: "/tools/ecommerce-finder/",
    ctaLabel: "Ecommerce Finder (fulfillment model) →",
    variant: "finder",
  },
];

function metadata(): GuidePage["metadata"] {
  return SCHEDULED_AT
    ? {
        status: "scheduled",
        scheduledAt: SCHEDULED_AT,
        updatedAt: "2026-08-23T20:00:00.000Z",
        reviewedAt: "2026-08-23T20:00:00.000Z",
        researchStatus: "complete",
        author: "author-lee-meyeridricks",
      }
    : {
        status: "published",
        updatedAt: "2026-08-23T20:00:00.000Z",
        publishedAt: "2026-08-23T20:00:00.000Z",
        reviewedAt: "2026-08-23T20:00:00.000Z",
        researchStatus: "complete",
        author: "author-lee-meyeridricks",
      };
}

export const howToChooseFulfillmentShippingSoftwareGuide: GuidePage = {
  id: "guide-how-to-choose-fulfillment-shipping-software",
  slug: SLUG,
  title: "How to Choose Fulfillment & Shipping Software",
  summary:
    "Pick fulfillment tools by job cluster — multi-carrier labels or 3PL outsourcing — not as one generic list.",
  categorySlugs: ["fulfillment-shipping", "ecommerce"],
  topicType: "selection",
  supports: [
    {
      contentId: "content:category:fulfillment-shipping",
      relationType: "supports-anchor",
      primary: true,
    },
  ],
  relatedGuideSlugs: [
    "what-is-fulfillment-shipping-software",
    "fulfillment-shipping-pricing-guide",
    "fulfillment-shipping-evaluation-guide",
  ],
  blocks: blocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: metadata(),
  seo: {
    title: "How to Choose Fulfillment & Shipping Software | SoftwareGlimpse",
    description:
      "Choose fulfillment software by 3PL vs label-tool job, carrier coverage, returns, and integration depth.",
    canonicalPath: `/guides/${SLUG}/`,
    indexable: !SCHEDULED_AT,
  },
};
