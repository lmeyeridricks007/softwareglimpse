import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import { tier25GuideScheduledAt } from "@/data/config/publishing/tier-25-dropshipping-pod-launch-2027-07-01";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const SLUG = "what-is-dropshipping-pod-software";
const SCHEDULED_AT = tier25GuideScheduledAt(SLUG);

const blocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Dropshipping and print-on-demand software sources supplier catalogs, imports products to an existing storefront, and fulfills orders without holding inventory. Decision rule: if the blocking job is curated US/EU supplier sourcing, shortlist Spocket-class tools; if it is AliExpress marketplace import automation, shortlist AliDrop; if it is POD merch fulfillment networks, shortlist Printify — never rank those sourcing and POD clusters as one undifferentiated list.",
    bullets: [
      "Dropshipping supplier sourcing",
      "Print-on-demand catalogs",
      "Product import to storefront",
      "Supplier vetting and catalogs",
      "POD mockups and fulfillment",
      "Not hosted storefront platforms or 3PL shipping labels",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Sourcing clusters differ",
        body: "Curated supplier import, marketplace automation, and POD networks are different purchases — compare inside clusters.",
      },
      {
        label: "Subcategory under ecommerce",
        body: "Use the parent Ecommerce Finder with fulfillment model as the primary filter to shortlist.",
      },
      {
        label: "Storefront required",
        body: "These apps assume an existing Shopify, WooCommerce, or similar store — not a standalone storefront.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "next-steps",
    title: "Next steps",
    body: "Shortlist by sourcing job cluster, then run the Ecommerce Finder with dropshipping/POD as the fulfillment model.",
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

export const whatIsDropshippingPodSoftwareGuide: GuidePage = {
  id: "guide-what-is-dropshipping-pod-software",
  slug: SLUG,
  title: "What Is Dropshipping & Print-on-Demand Software?",
  summary:
    "Dropshipping sourcing and POD fulfillment apps for inventory-free ecommerce — distinct from storefront platforms and 3PL shipping.",
  categorySlugs: ["dropshipping-pod", "ecommerce"],
  topicType: "fundamental",
  journeyStage: "learn",
  supports: [
    {
      contentId: "content:category:dropshipping-pod",
      relationType: "supports-anchor",
      primary: true,
    },
  ],
  relatedGuideSlugs: [
    "how-to-choose-dropshipping-pod-software",
    "dropshipping-pod-pricing-guide",
    "dropshipping-pod-evaluation-guide",
    "what-is-ecommerce-software",
  ],
  blocks: blocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: metadata(),
  seo: {
    title: "What Is Dropshipping & Print-on-Demand Software? | SoftwareGlimpse",
    description:
      "Supplier sourcing, product import, and POD fulfillment — how dropshipping apps differ from storefront platforms.",
    canonicalPath: `/guides/${SLUG}/`,
    indexable: !SCHEDULED_AT,
  },
};
