import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import { tier31GuideScheduledAt } from "@/data/config/publishing/tier-31-social-media-management-launch-2027-09-01";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const SLUG = "social-media-management-pricing-guide";
const SCHEDULED_AT = tier31GuideScheduledAt(SLUG);

const blocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Social media management pricing mixes per-channel monthly plans, per-seat suite tiers, and workspace packs. Buffer Essentials from $6/channel/mo; Hootsuite Standard from $99/user/mo; SocialBee Bootstrap from $29/mo ($24 annual) — confirm live terms. Compare pricing units and connected profile limits, not headline tiles alone.",
    bullets: [
      "Per-channel vs per-seat",
      "Free tiers and profile caps",
      "Approval and inbox gates",
      "Workspace and client packs",
      "AI and analytics add-ons",
      "Annual vs monthly billing",
    ],
  },
  {
    type: "interactive-cta",
    id: "next",
    title: "Next steps",
    body: "Model TCO for your channels and seats, then shortlist inside the management cluster.",
    href: "/best/social-media-management-software/",
    ctaLabel: "Best social media management software →",
    variant: "finder",
  },
];

function metadata(): GuidePage["metadata"] {
  return SCHEDULED_AT
    ? {
        status: "scheduled",
        scheduledAt: SCHEDULED_AT,
        updatedAt: "2026-08-23T21:00:00.000Z",
        reviewedAt: "2026-08-23T21:00:00.000Z",
        researchStatus: "complete",
        author: "author-lee-meyeridricks",
      }
    : {
        status: "published",
        updatedAt: "2026-08-23T21:00:00.000Z",
        publishedAt: "2026-08-23T21:00:00.000Z",
        reviewedAt: "2026-08-23T21:00:00.000Z",
        researchStatus: "complete",
        author: "author-lee-meyeridricks",
      };
}

export const socialMediaManagementPricingGuide: GuidePage = {
  id: "guide-social-media-management-pricing-guide",
  slug: SLUG,
  title: "Social Media Management Software Pricing Guide",
  summary:
    "Per-channel, per-seat, and workspace pricing for social media management platforms.",
  categorySlugs: ["social-media-management"],
  productSlugs: [],
  topicType: "pricing-education",
  journeyStage: "evaluate",
  supports: [
    {
      contentId: "content:category:social-media-management",
      relationType: "supports-anchor",
      primary: true,
    },
  ],
  relatedGuideSlugs: [
    "what-is-social-media-management-software",
    "how-to-choose-social-media-management-software",
    "social-media-management-evaluation-guide",
  ],
  blocks: blocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: metadata(),
  seo: {
    title: "Social Media Management Software Pricing Guide | SoftwareGlimpse",
    description:
      "Compare per-channel, per-seat, and workspace pricing for social media management software.",
    canonicalPath: `/guides/${SLUG}/`,
    indexable: !SCHEDULED_AT,
  },
};
