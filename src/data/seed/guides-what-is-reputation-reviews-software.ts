import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import { tier19GuideScheduledAt } from "@/data/config/publishing/tier-19-reputation-reviews-launch-2027-04-01";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const SLUG = "what-is-reputation-reviews-software";
const SCHEDULED_AT = tier19GuideScheduledAt(SLUG);

const blocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Reputation and review management software helps local businesses collect customer reviews, monitor Google and social ratings, respond to feedback, and automate review-request workflows — not helpdesk ticketing or live chat. Decision rule: if the blocking job is review generation and local reputation, shortlist NiceJob-class tools; if it is ticket queues or live support, shortlist helpdesk products — never rank those jobs as one undifferentiated list.",
    bullets: [
      "Review collection",
      "Review monitoring",
      "Review response",
      "Social proof widgets",
      "Referral workflows",
      "Not helpdesk ticketing",
      "Not live chat",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Reputation is not customer service",
        body: "Helpdesks resolve tickets; reputation tools grow and manage public reviews. Different buyer jobs.",
      },
      {
        label: "Local SMB focus",
        body: "Review automation after jobs and Google presence matter more than omnichannel SLAs.",
      },
      {
        label: "Thin inventory today",
        body: "Wave-1 hub ships with one primary product — expand comparisons as inventory grows.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "next-steps",
    title: "Next steps",
    body: "Shortlist by reputation job, then confirm live collection and platform coverage.",
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

export const whatIsReputationReviewsSoftwareGuide: GuidePage = {
  id: "guide-what-is-reputation-reviews-software",
  slug: SLUG,
  title: "What is Reputation & Review Management Software?",
  summary:
    "Reputation software collects reviews, monitors ratings, and automates local reputation workflows — distinct from helpdesk ticketing and live chat.",
  categorySlugs: ["reputation-reviews"],
  topicType: "fundamental",
  supports: [
    {
      contentId: "content:category:reputation-reviews",
      relationType: "supports-anchor",
      primary: true,
    },
  ],
  relatedGuideSlugs: [
    "how-to-choose-reputation-reviews-software",
    "reputation-reviews-pricing-guide",
    "reputation-reviews-vs-customer-service-software",
  ],
  blocks: blocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: metadata(),
  seo: {
    title: "What is Reputation & Review Management Software?",
    description:
      "Learn how reputation software collects reviews, monitors ratings, and automates local business reputation workflows.",
    indexable: !SCHEDULED_AT,
    canonicalPath: "/guides/what-is-reputation-reviews-software/",
  },
};
