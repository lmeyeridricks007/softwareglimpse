import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import { tier16GuideScheduledAt } from "@/data/config/publishing/tier-16-website-digital-presence-launch-2027-01-01";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const SLUG = "website-digital-presence-pricing-guide";
const SCHEDULED_AT = tier16GuideScheduledAt(SLUG);

const blocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Website and digital presence pricing mixes flat plan tiers, per-site/seat fees, transaction/GMV percentages, and panel licensing — plus plan gates for commerce, CRO, and white-label. Decision rule: model the qualifying configuration for your catalog size and payment volume; never compare a landing-page starter tile to Shopify Plus or Plesk server licensing.",
    bullets: [
      "Plan tiers",
      "Transaction / GMV fees",
      "Sites / seats",
      "Commerce plan gates",
      "CRO add-ons",
      "Annual vs monthly",
    ],
  },
  {
    type: "interactive-cta",
    id: "next",
    title: "Next steps",
    body: "Shortlist by job cluster, then confirm live commercial terms.",
    href: "/best/website-digital-presence-software/",
    ctaLabel: "Best website & digital presence software →",
    variant: "finder",
  },
];

function metadata(): GuidePage["metadata"] {
  return SCHEDULED_AT
    ? {
        status: "scheduled",
        scheduledAt: SCHEDULED_AT,
        updatedAt: "2026-08-23T16:30:00.000Z",
        reviewedAt: "2026-08-23T16:30:00.000Z",
        researchStatus: "complete",
        author: "author-lee-meyeridricks",
      }
    : {
        status: "published",
        updatedAt: "2026-08-23T16:30:00.000Z",
        publishedAt: "2026-08-23T16:30:00.000Z",
        reviewedAt: "2026-08-23T16:30:00.000Z",
        researchStatus: "complete",
        author: "author-lee-meyeridricks",
      };
}

export const websiteDigitalPresencePricingGuide: GuidePage = {
  id: "guide-website-digital-presence-pricing-guide",
  slug: SLUG,
  title: "Website & Digital Presence Software Pricing Guide",
  summary:
    "Budget storefronts, builders, landing tools, and panels by qualifying configuration — not the advertised starter tile.",
  categorySlugs: ["website-digital-presence"],
  topicType: "pricing-education",
  supports: [
    {
      contentId: "content:category:website-digital-presence",
      relationType: "supports-anchor",
      primary: true,
    },
  ],
  journeyStage: "evaluate",
  relatedGuideSlugs: [
    "what-is-website-digital-presence-software",
    "how-to-choose-website-digital-presence-software",
  ],
  blocks: blocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: metadata(),
  seo: {
    title: "Website & Digital Presence Software Pricing Guide | SoftwareGlimpse",
    description:
      "How to budget website software — plans, transaction fees, commerce gates, and panel licensing.",
    canonicalPath: `/guides/${SLUG}/`,
    indexable: !SCHEDULED_AT,
  },
};
