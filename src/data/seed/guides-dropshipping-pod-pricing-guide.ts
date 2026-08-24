import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import { tier25GuideScheduledAt } from "@/data/config/publishing/tier-25-dropshipping-pod-launch-2027-07-01";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const SLUG = "dropshipping-pod-pricing-guide";
const SCHEDULED_AT = tier25GuideScheduledAt(SLUG);

const blocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Dropshipping and POD pricing mixes monthly subscription tiers with product-import caps and separate print/fulfillment costs. Spocket Starter is $39.99/mo with product caps per tier; AliDrop Starter is $39/mo with a $1 seven-day trial; Printify Free is $0 (5 stores) with Premium at $24.99/mo annual — print costs are separate — confirm live terms. Compare import caps and fulfillment margins, not headline tiles alone.",
    bullets: [
      "Monthly subscription tiers",
      "Product import caps per plan",
      "POD print costs (separate from SaaS)",
      "Storefront integration limits",
      "Trial length and onboarding",
      "Annual vs monthly billing",
    ],
  },
  {
    type: "interactive-cta",
    id: "next",
    title: "Next steps",
    body: "Model TCO for your catalog size and order volume, then shortlist inside the sourcing cluster.",
    href: "/best/dropshipping-pod-software/",
    ctaLabel: "Best dropshipping & POD software →",
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

export const dropshippingPodPricingGuide: GuidePage = {
  id: "guide-dropshipping-pod-pricing-guide",
  slug: SLUG,
  title: "Dropshipping & Print-on-Demand Pricing Guide",
  summary:
    "Subscription tiers, product-import caps, and separate POD fulfillment costs for dropshipping apps.",
  categorySlugs: ["dropshipping-pod", "ecommerce"],
  productSlugs: [],
  topicType: "pricing-education",
  journeyStage: "evaluate",
  supports: [
    {
      contentId: "content:category:dropshipping-pod",
      relationType: "supports-anchor",
      primary: true,
    },
  ],
  relatedGuideSlugs: [
    "what-is-dropshipping-pod-software",
    "how-to-choose-dropshipping-pod-software",
    "dropshipping-pod-evaluation-guide",
  ],
  blocks: blocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: metadata(),
  seo: {
    title: "Dropshipping & Print-on-Demand Pricing Guide | SoftwareGlimpse",
    description:
      "Compare subscription tiers, import caps, and POD fulfillment costs for dropshipping software.",
    canonicalPath: `/guides/${SLUG}/`,
    indexable: !SCHEDULED_AT,
  },
};
