import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import { tier18GuideScheduledAt } from "@/data/config/publishing/tier-18-field-service-operations-launch-2027-03-01";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const SLUG = "field-service-operations-pricing-guide";
const SCHEDULED_AT = tier18GuideScheduledAt(SLUG);

const blocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Field service and operations pricing is usually per user, per job, or flat trade plan tiers — plus plan gates for dispatch, costing, and mobile apps. Decision rule: model the qualifying configuration for your real crew count and job volume; never compare a scheduling starter tile to a construction estimating quote.",
    bullets: [
      "Users / field workers",
      "Jobs / appointments",
      "Plan tiers",
      "Mobile app add-ons",
      "Accounting integrations",
      "Annual vs monthly",
    ],
  },
  {
    type: "interactive-cta",
    id: "next",
    title: "Next steps",
    body: "Shortlist by job cluster, then confirm live commercial terms.",
    href: "/best/field-service-operations-software/",
    ctaLabel: "Best field service & operations software →",
    variant: "finder",
  },
];

function metadata(): GuidePage["metadata"] {
  return SCHEDULED_AT
    ? {
        status: "scheduled",
        scheduledAt: SCHEDULED_AT,
        updatedAt: "2026-08-23T17:30:00.000Z",
        reviewedAt: "2026-08-23T17:30:00.000Z",
        researchStatus: "complete",
        author: "author-lee-meyeridricks",
      }
    : {
        status: "published",
        updatedAt: "2026-08-23T17:30:00.000Z",
        publishedAt: "2026-08-23T17:30:00.000Z",
        reviewedAt: "2026-08-23T17:30:00.000Z",
        researchStatus: "complete",
        author: "author-lee-meyeridricks",
      };
}

export const fieldServiceOperationsPricingGuide: GuidePage = {
  id: "guide-field-service-operations-pricing-guide",
  slug: SLUG,
  title: "Field Service & Operations Software Pricing Guide",
  summary:
    "Budget construction, trades FSM, and appointment tools by qualifying configuration — not the advertised starter tile.",
  categorySlugs: ["field-service-operations"],
  topicType: "pricing-education",
  supports: [
    {
      contentId: "content:category:field-service-operations",
      relationType: "supports-anchor",
      primary: true,
    },
  ],
  journeyStage: "evaluate",
  relatedGuideSlugs: [
    "what-is-field-service-operations-software",
    "how-to-choose-field-service-operations-software",
  ],
  blocks: blocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: metadata(),
  seo: {
    title: "Field Service & Operations Software Pricing Guide",
    description:
      "Understand how construction, trades, and appointment software price users, jobs, and plan tiers.",
    indexable: !SCHEDULED_AT,
    canonicalPath: "/guides/field-service-operations-pricing-guide/",
  },
};
