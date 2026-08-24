import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import { tier25GuideScheduledAt } from "@/data/config/publishing/tier-25-dropshipping-pod-launch-2027-07-01";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const SLUG = "how-to-choose-dropshipping-pod-software";
const SCHEDULED_AT = tier25GuideScheduledAt(SLUG);

const blocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Choose dropshipping and POD software by the sourcing job blocking work — curated supplier import, marketplace automation, or POD fulfillment networks — then confirm product caps, storefront integrations, shipping regions, and margin rules. Shortlist only tools whose core product is sourcing or POD fulfillment, not hosted storefront platforms or pure shipping-label tools.",
    bullets: [
      "Primary sourcing job",
      "Supplier region and catalog depth",
      "Storefront integration (Shopify, WooCommerce)",
      "Product import caps per tier",
      "POD mockup and print network",
      "Trial with one real product import",
    ],
  },
  {
    type: "interactive-cta",
    id: "next",
    title: "Next steps",
    body: "Shortlist by sourcing cluster, then confirm live commercial terms.",
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

export const howToChooseDropshippingPodSoftwareGuide: GuidePage = {
  id: "guide-how-to-choose-dropshipping-pod-software",
  slug: SLUG,
  title: "How to Choose Dropshipping & Print-on-Demand Software",
  summary:
    "Pick dropshipping and POD tools by sourcing cluster — supplier import, marketplace automation, or POD networks — not as one generic list.",
  categorySlugs: ["dropshipping-pod", "ecommerce"],
  topicType: "selection",
  supports: [
    {
      contentId: "content:category:dropshipping-pod",
      relationType: "supports-anchor",
      primary: true,
    },
  ],
  relatedGuideSlugs: [
    "what-is-dropshipping-pod-software",
    "dropshipping-pod-pricing-guide",
    "dropshipping-pod-evaluation-guide",
  ],
  blocks: blocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: metadata(),
  seo: {
    title: "How to Choose Dropshipping & POD Software | SoftwareGlimpse",
    description:
      "Choose dropshipping and POD software by sourcing job, integrations, product caps, and shipping regions.",
    canonicalPath: `/guides/${SLUG}/`,
    indexable: !SCHEDULED_AT,
  },
};
