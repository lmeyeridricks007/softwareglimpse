import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import { tier31GuideScheduledAt } from "@/data/config/publishing/tier-31-social-media-management-launch-2027-09-01";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const SLUG = "how-to-choose-social-media-management-software";
const SCHEDULED_AT = tier31GuideScheduledAt(SLUG);

const blocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Choose social media management software by the weekly social job blocking work — lightweight per-channel scheduling, multi-account suite governance, or content-recycling agency workspaces — then confirm pricing unit (per-channel vs per-seat), approval depth, inbox ownership, and connected profile limits. Shortlist only tools whose core product is social publishing and management, not MAP journeys, funnel builders, or ESP campaigns.",
    bullets: [
      "Primary management cluster",
      "Per-channel vs per-seat pricing",
      "Approval and workspace depth",
      "Connected profiles and seats",
      "Social inbox ownership",
      "Trial with one real calendar week",
    ],
  },
  {
    type: "interactive-cta",
    id: "next",
    title: "Next steps",
    body: "Shortlist by management cluster, then confirm live commercial terms.",
    href: "/tools/marketing-finder/",
    ctaLabel: "Marketing Finder (social management) →",
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

export const howToChooseSocialMediaManagementSoftwareGuide: GuidePage = {
  id: "guide-how-to-choose-social-media-management-software",
  slug: SLUG,
  title: "How to Choose Social Media Management Software",
  summary:
    "Pick social management tools by scheduling cluster — lightweight scheduler, suite governance, or content-recycling workspace — not as one generic list.",
  categorySlugs: ["social-media-management"],
  topicType: "selection",
  supports: [
    {
      contentId: "content:category:social-media-management",
      relationType: "supports-anchor",
      primary: true,
    },
  ],
  relatedGuideSlugs: [
    "what-is-social-media-management-software",
    "social-media-management-pricing-guide",
    "social-media-management-evaluation-guide",
    "social-media-management-vs-marketing-software",
  ],
  blocks: blocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: metadata(),
  seo: {
    title: "How to Choose Social Media Management Software | SoftwareGlimpse",
    description:
      "Choose social management software by cluster, pricing unit, approval depth, and inbox ownership.",
    canonicalPath: `/guides/${SLUG}/`,
    indexable: !SCHEDULED_AT,
  },
};
