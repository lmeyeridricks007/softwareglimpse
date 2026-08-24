import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import { tier13GuideScheduledAt } from "@/data/config/publishing/tier-13-social-media-marketing-launch-2026-10-01";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const SLUG = "what-is-social-media-marketing-software";
const SCHEDULED_AT = tier13GuideScheduledAt(SLUG);

const blocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Social media marketing software helps teams plan and publish posts, monitor brand mentions, run influencer campaigns, and report on social ROI — not full marketing automation or funnel builders. Decision rule: if the blocking job is a content calendar, shortlist schedulers (Buffer-class); if it is mention intelligence, shortlist listening tools (Brand24-class); if it is creator campaigns, shortlist influencer platforms (Zypper-class) — never rank those jobs as one undifferentiated list.",
    bullets: [
      "Social scheduling",
      "Social suites",
      "Social listening",
      "Influencer marketing",
      "Social analytics",
      "Not a MAP/ESP",
      "Not a funnel builder",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Social is several purchases",
        body: "Schedulers, listening suites, and influencer tools fail for different reasons. Name the job before you shortlist.",
      },
      {
        label: "Distinct from generic marketing software",
        body: "MAP, funnels, and ESPs may integrate with social — but social execution is a different buyer job.",
      },
      {
        label: "Pricing units differ",
        body: "Per-channel seats, keyword/mention caps, and workspace packs change TCO more than the starter tile.",
      },
    ],
  },
  {
    type: "crm-types",
    id: "smm-shapes",
    title: "Common social media marketing shapes (not rankings)",
    types: [
      {
        id: "scheduler",
        title: "Social scheduling",
        bestFor: "Queued posts, approvals, and multi-network calendars.",
        avoidWhen: "Mention monitoring or influencer outreach is the primary job.",
      },
      {
        id: "suite",
        title: "Social suite",
        bestFor: "Publish + inbox + analytics for growing social teams.",
        avoidWhen: "You only need lightweight scheduling on one channel.",
      },
      {
        id: "listening",
        title: "Social listening",
        bestFor: "Brand mentions, sentiment, and competitor alerts.",
        avoidWhen: "You need to publish posts — listening is not a scheduler.",
      },
      {
        id: "influencer",
        title: "Influencer marketing",
        bestFor: "Creator discovery, outreach, and campaign tracking.",
        avoidWhen: "Your job is daily post scheduling, not creator partnerships.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "next-steps",
    title: "Next steps",
    body: "Name your primary social job, then shortlist within that cluster.",
    href: "/best/social-media-marketing-software/",
    ctaLabel: "See Best Social Media Marketing Software →",
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

export const whatIsSocialMediaMarketingSoftwareGuide: GuidePage = {
  id: "guide-what-is-social-media-marketing-software",
  slug: SLUG,
  title: "What Is Social Media Marketing Software?",
  summary:
    "A clear definition of social scheduling, listening, influencer tools, and social suites — and how they differ from MAP and funnel marketing.",
  categorySlugs: ["social-media-marketing"],
  topicType: "fundamental",
  supports: [
    {
      contentId: "content:category:social-media-marketing",
      relationType: "supports-anchor",
      primary: true,
    },
    {
      contentId: "content:best:social-media-marketing-software",
      relationType: "supports-anchor",
      primary: false,
    },
  ],
  nextAction: {
    contentId: "content:guide:how-to-choose-social-media-marketing-software",
    label: "How to choose social media marketing software",
  },
  relatedGuideSlugs: [
    "how-to-choose-social-media-marketing-software",
    "social-media-marketing-pricing-guide",
    "social-media-marketing-requirements-guide",
    "social-media-marketing-evaluation-guide",
  ],
  blocks: blocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: metadata(),
  seo: {
    title: "What Is Social Media Marketing Software? | SoftwareGlimpse",
    description:
      "What is social media marketing software? Scheduling, listening, influencer campaigns, and social suites — distinct from MAP and funnels.",
    canonicalPath: `/guides/${SLUG}/`,
    indexable: !SCHEDULED_AT,
  },
};
