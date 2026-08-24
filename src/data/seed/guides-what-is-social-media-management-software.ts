import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import { tier31GuideScheduledAt } from "@/data/config/publishing/tier-31-social-media-management-launch-2027-09-01";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const SLUG = "what-is-social-media-management-software";
const SCHEDULED_AT = tier31GuideScheduledAt(SLUG);

const blocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Social media management software plans, publishes, and reports on brand-owned social channels — calendars, approvals, workspaces, and inbox replies — not full marketing automation, funnel builders, or ESP campaigns. Decision rule: if the blocking job is lightweight per-channel scheduling, shortlist Buffer-class tools; if it is multi-account team governance, shortlist Hootsuite-class suites; if it is content recycling and agency workspaces, shortlist SocialBee — never rank those management clusters as one undifferentiated list.",
    bullets: [
      "Content calendars",
      "Multi-channel publishing",
      "Approvals and workspaces",
      "Social inbox replies",
      "Per-channel or per-seat pricing",
      "Not MAP journeys",
      "Not funnel builders",
      "Not ESP campaigns",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Management is a distinct job",
        body: "Scheduling, suite governance, and content-recycling workspaces are different purchases — compare inside clusters.",
      },
      {
        label: "Subcategory under marketing",
        body: "Use the Marketing Finder with social management as the primary job to shortlist.",
      },
      {
        label: "Pricing units matter",
        body: "Per-channel, per-seat, and workspace packs change TCO more than starter tiles.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "next-steps",
    title: "Next steps",
    body: "Shortlist by social management cluster, then run the Marketing Finder with social management as the primary job.",
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

export const whatIsSocialMediaManagementSoftwareGuide: GuidePage = {
  id: "guide-what-is-social-media-management-software",
  slug: SLUG,
  title: "What Is Social Media Management Software?",
  summary:
    "Social media management software for calendars, publishing, approvals, and inbox workflows — distinct from MAP, funnels, and ESP campaigns.",
  categorySlugs: ["social-media-management"],
  topicType: "fundamental",
  journeyStage: "learn",
  supports: [
    {
      contentId: "content:category:social-media-management",
      relationType: "supports-anchor",
      primary: true,
    },
  ],
  relatedGuideSlugs: [
    "how-to-choose-social-media-management-software",
    "social-media-management-pricing-guide",
    "social-media-management-evaluation-guide",
    "social-media-management-vs-marketing-software",
    "what-is-marketing-software",
  ],
  blocks: blocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: metadata(),
  seo: {
    title: "What Is Social Media Management Software? | SoftwareGlimpse",
    description:
      "Social calendars, publishing, approvals, and inbox workflows — how social management differs from MAP and funnels.",
    canonicalPath: `/guides/${SLUG}/`,
    indexable: !SCHEDULED_AT,
  },
};
