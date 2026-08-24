import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import { tier13GuideScheduledAt } from "@/data/config/publishing/tier-13-social-media-marketing-launch-2026-10-01";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const SLUG = "social-media-marketing-pricing-guide";
const SCHEDULED_AT = tier13GuideScheduledAt(SLUG);

const blocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Social media marketing pricing is usually per channel, per seat, or per keyword/mention pack — plus plan gates for approvals, listening depth, and AI credits. Decision rule: model the qualifying configuration for your real channels and mention volume; never compare scheduler starter tiles to listening enterprise quotes.",
    bullets: [
      "Channels / profiles",
      "Seats / users",
      "Keywords / mentions",
      "Plan feature gates",
      "AI add-ons",
      "Annual vs monthly",
    ],
  },
  {
    type: "interactive-cta",
    id: "next",
    title: "Next steps",
    body: "Shortlist by job cluster, then confirm live commercial terms.",
    href: "/best/social-media-marketing-software/",
    ctaLabel: "Best social media marketing software →",
    variant: "finder",
  },
];

function metadata(): GuidePage["metadata"] {
  return SCHEDULED_AT
    ? {
        status: "scheduled",
        scheduledAt: SCHEDULED_AT,
        updatedAt: "2026-08-23T14:30:00.000Z",
        reviewedAt: "2026-08-23T14:30:00.000Z",
        researchStatus: "complete",
        author: "author-lee-meyeridricks",
      }
    : {
        status: "published",
        updatedAt: "2026-08-23T14:30:00.000Z",
        publishedAt: "2026-08-23T14:30:00.000Z",
        reviewedAt: "2026-08-23T14:30:00.000Z",
        researchStatus: "complete",
        author: "author-lee-meyeridricks",
      };
}

export const socialMediaMarketingPricingGuide: GuidePage = {
  id: "guide-social-media-marketing-pricing-guide",
  slug: SLUG,
  title: "Social Media Marketing Software Pricing Guide",
  summary:
    "Budget social schedulers, listening tools, and influencer platforms by qualifying configuration — not the advertised starter tile.",
  categorySlugs: ["social-media-marketing"],
  topicType: "pricing-education",
  supports: [
    {
      contentId: "content:category:social-media-marketing",
      relationType: "supports-anchor",
      primary: true,
    },
  ],
  journeyStage: "evaluate",
  relatedGuideSlugs: [
    "what-is-social-media-marketing-software",
    "how-to-choose-social-media-marketing-software",
  ],
  blocks: blocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: metadata(),
  seo: {
    title: "Social Media Marketing Software Pricing Guide | SoftwareGlimpse",
    description:
      "How to budget social media marketing software — channels, seats, mention caps, plan gates, and add-ons.",
    canonicalPath: `/guides/${SLUG}/`,
    indexable: !SCHEDULED_AT,
  },
};
