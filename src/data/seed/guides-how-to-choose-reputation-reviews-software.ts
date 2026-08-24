import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import { tier19GuideScheduledAt } from "@/data/config/publishing/tier-19-reputation-reviews-launch-2027-04-01";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const SLUG = "how-to-choose-reputation-reviews-software";
const SCHEDULED_AT = tier19GuideScheduledAt(SLUG);

const blocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Choose reputation and review management software by the job blocking work — automated review collection, multi-platform monitoring, or response workflows — then confirm Google/social coverage, location count, and integration with scheduling or CRM tools. Shortlist only tools whose core product is reputation, not ticketing.",
    bullets: [
      "Primary reputation job",
      "Review collection automation",
      "Platform coverage",
      "Multi-location needs",
      "Social proof & referrals",
      "Trial with one real review campaign",
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

export const howToChooseReputationReviewsSoftwareGuide: GuidePage = {
  id: "guide-how-to-choose-reputation-reviews-software",
  slug: SLUG,
  title: "How to Choose Reputation & Review Management Software",
  summary:
    "Pick reputation tools by collection automation, platform coverage, and local business workflow fit.",
  categorySlugs: ["reputation-reviews"],
  topicType: "selection",
  supports: [
    {
      contentId: "content:category:reputation-reviews",
      relationType: "supports-anchor",
      primary: true,
    },
  ],
  relatedGuideSlugs: [
    "what-is-reputation-reviews-software",
    "reputation-reviews-pricing-guide",
  ],
  blocks: blocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: metadata(),
  seo: {
    title: "How to Choose Reputation & Review Management Software",
    description:
      "Choose reputation software by review collection, monitoring, and response workflows for local businesses.",
    indexable: !SCHEDULED_AT,
    canonicalPath: "/guides/how-to-choose-reputation-reviews-software/",
  },
};
