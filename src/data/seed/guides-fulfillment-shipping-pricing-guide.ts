import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import { tier26GuideScheduledAt } from "@/data/config/publishing/tier-26-fulfillment-shipping-launch-2027-07-01";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const SLUG = "fulfillment-shipping-pricing-guide";
const SCHEDULED_AT = tier26GuideScheduledAt(SLUG);

const blocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Fulfillment and shipping pricing mixes SaaS subscriptions, per-label fees, storage, and pick/pack costs. Sendcloud uses tiered monthly plans with per-shipment label fees; ShipBob quotes 3PL storage, receiving, and fulfillment per order — confirm live terms for your volume and regions. Compare per-label and per-order TCO, not headline SaaS tiles alone.",
    bullets: [
      "SaaS subscription vs usage fees",
      "Per-label and carrier surcharges",
      "3PL storage and pick/pack costs",
      "Returns portal tier gates",
      "Integration and onboarding fees",
      "Volume discounts and annual contracts",
    ],
  },
  {
    type: "interactive-cta",
    id: "next",
    title: "Next steps",
    body: "Model TCO for your shipment volume and regions, then shortlist inside the fulfillment cluster.",
    href: "/best/fulfillment-shipping-software/",
    ctaLabel: "Best fulfillment & shipping software →",
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

export const fulfillmentShippingPricingGuide: GuidePage = {
  id: "guide-fulfillment-shipping-pricing-guide",
  slug: SLUG,
  title: "Fulfillment & Shipping Pricing Guide",
  summary:
    "SaaS tiers, per-label fees, and 3PL pick/pack costs for fulfillment and shipping platforms.",
  categorySlugs: ["fulfillment-shipping", "ecommerce"],
  productSlugs: [],
  topicType: "pricing-education",
  journeyStage: "evaluate",
  supports: [
    {
      contentId: "content:category:fulfillment-shipping",
      relationType: "supports-anchor",
      primary: true,
    },
  ],
  relatedGuideSlugs: [
    "what-is-fulfillment-shipping-software",
    "how-to-choose-fulfillment-shipping-software",
    "fulfillment-shipping-evaluation-guide",
  ],
  blocks: blocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: metadata(),
  seo: {
    title: "Fulfillment & Shipping Pricing Guide | SoftwareGlimpse",
    description:
      "Compare SaaS tiers, per-label fees, and 3PL fulfillment costs for shipping software.",
    canonicalPath: `/guides/${SLUG}/`,
    indexable: !SCHEDULED_AT,
  },
};
