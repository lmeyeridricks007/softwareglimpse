import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import { tier13GuideScheduledAt } from "@/data/config/publishing/tier-13-social-media-marketing-launch-2026-10-01";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const SLUG = "how-to-choose-social-media-marketing-software";
const SCHEDULED_AT = tier13GuideScheduledAt(SLUG);

const blocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Choose social media marketing software by the job blocking work — scheduling, listening, influencer campaigns, or a full social suite — then confirm channels, seats, mention/keyword caps, and integrations. Shortlist only tools whose core product is your job.",
    bullets: [
      "Primary social job",
      "Channels & seats",
      "Approval workflows",
      "Listening keywords",
      "Analytics you will use weekly",
      "Trial with one real calendar or alert",
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

export const howToChooseSocialMediaMarketingSoftwareGuide: GuidePage = {
  id: "guide-how-to-choose-social-media-marketing-software",
  slug: SLUG,
  title: "How to Choose Social Media Marketing Software",
  summary:
    "Pick social schedulers, listening tools, influencer platforms, or suites by primary job, channels, and plan gates.",
  categorySlugs: ["social-media-marketing"],
  topicType: "selection",
  supports: [
    {
      contentId: "content:category:social-media-marketing",
      relationType: "supports-anchor",
      primary: true,
    },
  ],
  relatedGuideSlugs: [
    "what-is-social-media-marketing-software",
    "social-media-marketing-pricing-guide",
  ],
  blocks: blocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: metadata(),
  seo: {
    title: "How to Choose Social Media Marketing Software | SoftwareGlimpse",
    description:
      "How to choose social media marketing software by scheduling, listening, influencer, or suite job cluster.",
    canonicalPath: `/guides/${SLUG}/`,
    indexable: !SCHEDULED_AT,
  },
};
