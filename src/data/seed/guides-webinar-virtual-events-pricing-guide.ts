import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import { tier14GuideScheduledAt } from "@/data/config/publishing/tier-14-webinar-virtual-events-launch-2026-11-01";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const SLUG = "webinar-virtual-events-pricing-guide";
const SCHEDULED_AT = tier14GuideScheduledAt(SLUG);

const blocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Webinar and virtual events pricing is usually per host/presenter, per attendee cap, or per registrant/contact tier — plus plan gates for evergreen automation, virtual event rooms, and production outputs. Decision rule: model the qualifying configuration for your real audience size and event cadence; never compare a host starter tile to an enterprise virtual-events quote.",
    bullets: [
      "Hosts / presenters",
      "Attendee caps",
      "Registrant / contact tiers",
      "Evergreen add-ons",
      "Virtual event room gates",
      "Annual vs monthly",
    ],
  },
  {
    type: "interactive-cta",
    id: "next",
    title: "Next steps",
    body: "Shortlist by job cluster, then confirm live commercial terms.",
    href: "/best/webinar-virtual-events-software/",
    ctaLabel: "Best webinar & virtual events software →",
    variant: "finder",
  },
];

function metadata(): GuidePage["metadata"] {
  return SCHEDULED_AT
    ? {
        status: "scheduled",
        scheduledAt: SCHEDULED_AT,
        updatedAt: "2026-08-23T15:00:00.000Z",
        reviewedAt: "2026-08-23T15:00:00.000Z",
        researchStatus: "complete",
        author: "author-lee-meyeridricks",
      }
    : {
        status: "published",
        updatedAt: "2026-08-23T15:00:00.000Z",
        publishedAt: "2026-08-23T15:00:00.000Z",
        reviewedAt: "2026-08-23T15:00:00.000Z",
        researchStatus: "complete",
        author: "author-lee-meyeridricks",
      };
}

export const webinarVirtualEventsPricingGuide: GuidePage = {
  id: "guide-webinar-virtual-events-pricing-guide",
  slug: SLUG,
  title: "Webinar & Virtual Events Software Pricing Guide",
  summary:
    "Budget webinar hosts, virtual event platforms, and live production tools by qualifying configuration — not the advertised starter tile.",
  categorySlugs: ["webinar-virtual-events"],
  topicType: "pricing-education",
  supports: [
    {
      contentId: "content:category:webinar-virtual-events",
      relationType: "supports-anchor",
      primary: true,
    },
  ],
  journeyStage: "evaluate",
  relatedGuideSlugs: [
    "what-is-webinar-virtual-events-software",
    "how-to-choose-webinar-virtual-events-software",
  ],
  blocks: blocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: metadata(),
  seo: {
    title: "Webinar & Virtual Events Software Pricing Guide | SoftwareGlimpse",
    description:
      "How to budget webinar software — hosts, attendee caps, registrant tiers, plan gates, and add-ons.",
    canonicalPath: `/guides/${SLUG}/`,
    indexable: !SCHEDULED_AT,
  },
};
