import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import { tier19GuideScheduledAt } from "@/data/config/publishing/tier-19-reputation-reviews-launch-2027-04-01";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const SLUG = "reputation-reviews-pricing-guide";
const SCHEDULED_AT = tier19GuideScheduledAt(SLUG);

const blocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Reputation and review management pricing is usually per location or flat local-business plan tiers — plus gates for automation volume, multi-location dashboards, and referral modules. Decision rule: model the qualifying configuration for your real location count and review campaign volume; never compare a reputation starter tile to a helpdesk per-agent quote.",
    bullets: [
      "Locations / businesses",
      "Users",
      "Plan tiers",
      "Automation volume",
      "Multi-location add-ons",
      "Annual vs monthly",
    ],
  },
  {
    type: "interactive-cta",
    id: "next",
    title: "Next steps",
    body: "Shortlist by reputation job, then confirm live commercial terms.",
    href: "/best/reputation-reviews-software/",
    ctaLabel: "Best reputation & review management software →",
    variant: "finder",
  },
];

function metadata(): GuidePage["metadata"] {
  return SCHEDULED_AT
    ? {
        status: "scheduled",
        scheduledAt: SCHEDULED_AT,
        updatedAt: "2026-08-23T18:00:00.000Z",
        reviewedAt: "2026-08-23T18:00:00.000Z",
        researchStatus: "complete",
        author: "author-lee-meyeridricks",
      }
    : {
        status: "published",
        updatedAt: "2026-08-23T18:00:00.000Z",
        publishedAt: "2026-08-23T18:00:00.000Z",
        reviewedAt: "2026-08-23T18:00:00.000Z",
        researchStatus: "complete",
        author: "author-lee-meyeridricks",
      };
}

export const reputationReviewsPricingGuide: GuidePage = {
  id: "guide-reputation-reviews-pricing-guide",
  slug: SLUG,
  title: "Reputation & Review Management Software Pricing Guide",
  summary:
    "Budget reputation tools by qualifying configuration — not the advertised starter tile.",
  categorySlugs: ["reputation-reviews"],
  topicType: "pricing-education",
  supports: [
    {
      contentId: "content:category:reputation-reviews",
      relationType: "supports-anchor",
      primary: true,
    },
  ],
  journeyStage: "evaluate",
  relatedGuideSlugs: [
    "what-is-reputation-reviews-software",
    "how-to-choose-reputation-reviews-software",
  ],
  blocks: blocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: metadata(),
  seo: {
    title: "Reputation & Review Management Software Pricing Guide",
    description:
      "Understand how reputation software prices locations, users, and automation tiers.",
    indexable: !SCHEDULED_AT,
    canonicalPath: "/guides/reputation-reviews-pricing-guide/",
  },
};
