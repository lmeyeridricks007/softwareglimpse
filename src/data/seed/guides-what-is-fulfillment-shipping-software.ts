import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import { tier26GuideScheduledAt } from "@/data/config/publishing/tier-26-fulfillment-shipping-launch-2027-07-01";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const SLUG = "what-is-fulfillment-shipping-software";
const SCHEDULED_AT = tier26GuideScheduledAt(SLUG);

const blocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Fulfillment and shipping software manages order fulfillment workflows, shipping labels, returns, and 3PL outsourcing for merchants with an existing storefront. Decision rule: if the blocking job is outsourced warehouse fulfillment with a merchant portal, shortlist ShipBob-class tools; if it is multi-carrier label generation and rate shopping, shortlist Sendcloud — never rank 3PL outsourcing and shipping-label tools as one undifferentiated list.",
    bullets: [
      "Order fulfillment workflows",
      "Shipping label generation",
      "Returns management",
      "3PL warehouse outsourcing",
      "Multi-carrier integrations",
      "Not storefront platforms or dropshipping sourcing",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Fulfillment clusters differ",
        body: "3PL outsourcing and multi-carrier shipping labels are different purchases — compare inside clusters.",
      },
      {
        label: "Subcategory under ecommerce",
        body: "Use the parent Ecommerce Finder with integration and fulfillment model filters to shortlist.",
      },
      {
        label: "Usage pricing matters",
        body: "Per-label fees, storage, and pick/pack costs change TCO more than headline SaaS tiles.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "next-steps",
    title: "Next steps",
    body: "Shortlist by fulfillment job cluster, then run the Ecommerce Finder with shipping/3PL as the fulfillment model.",
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

export const whatIsFulfillmentShippingSoftwareGuide: GuidePage = {
  id: "guide-what-is-fulfillment-shipping-software",
  slug: SLUG,
  title: "What Is Fulfillment & Shipping Software?",
  summary:
    "Order fulfillment, shipping labels, returns, and 3PL outsourcing — distinct from storefront platforms and dropshipping sourcing.",
  categorySlugs: ["fulfillment-shipping", "ecommerce"],
  topicType: "fundamental",
  journeyStage: "learn",
  supports: [
    {
      contentId: "content:category:fulfillment-shipping",
      relationType: "supports-anchor",
      primary: true,
    },
  ],
  relatedGuideSlugs: [
    "how-to-choose-fulfillment-shipping-software",
    "fulfillment-shipping-pricing-guide",
    "fulfillment-shipping-evaluation-guide",
    "what-is-ecommerce-software",
  ],
  blocks: blocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: metadata(),
  seo: {
    title: "What Is Fulfillment & Shipping Software? | SoftwareGlimpse",
    description:
      "Shipping labels, returns, and 3PL fulfillment — how fulfillment software differs from storefront and sourcing apps.",
    canonicalPath: `/guides/${SLUG}/`,
    indexable: !SCHEDULED_AT,
  },
};
