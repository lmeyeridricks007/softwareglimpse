import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import { tier15GuideScheduledAt } from "@/data/config/publishing/tier-15-lms-course-creation-launch-2026-12-01";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const SLUG = "lms-course-creation-pricing-guide";
const SCHEDULED_AT = tier15GuideScheduledAt(SLUG);

const blocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "LMS and course creation pricing is usually per learner, per admin seat, or flat academy plan tiers — plus plan gates for commerce, white-label, assessments, and cohort features. Decision rule: model the qualifying configuration for your real learner volume and course catalog; never compare a quiz-tool starter tile to an enterprise academy quote.",
    bullets: [
      "Learners / students",
      "Admin / author seats",
      "Academy plan tiers",
      "Commerce transaction fees",
      "Assessment add-ons",
      "Annual vs monthly",
    ],
  },
  {
    type: "interactive-cta",
    id: "next",
    title: "Next steps",
    body: "Shortlist by job cluster, then confirm live commercial terms.",
    href: "/best/lms-course-creation-software/",
    ctaLabel: "Best LMS & course creation software →",
    variant: "finder",
  },
];

function metadata(): GuidePage["metadata"] {
  return SCHEDULED_AT
    ? {
        status: "scheduled",
        scheduledAt: SCHEDULED_AT,
        updatedAt: "2026-08-23T16:00:00.000Z",
        reviewedAt: "2026-08-23T16:00:00.000Z",
        researchStatus: "complete",
        author: "author-lee-meyeridricks",
      }
    : {
        status: "published",
        updatedAt: "2026-08-23T16:00:00.000Z",
        publishedAt: "2026-08-23T16:00:00.000Z",
        reviewedAt: "2026-08-23T16:00:00.000Z",
        researchStatus: "complete",
        author: "author-lee-meyeridricks",
      };
}

export const lmsCourseCreationPricingGuide: GuidePage = {
  id: "guide-lms-course-creation-pricing-guide",
  slug: SLUG,
  title: "LMS & Course Creation Software Pricing Guide",
  summary:
    "Budget course LMS, playbook, and assessment tools by qualifying configuration — not the advertised starter tile.",
  categorySlugs: ["lms-course-creation"],
  topicType: "pricing-education",
  supports: [
    {
      contentId: "content:category:lms-course-creation",
      relationType: "supports-anchor",
      primary: true,
    },
  ],
  journeyStage: "evaluate",
  relatedGuideSlugs: [
    "what-is-lms-course-creation-software",
    "how-to-choose-lms-course-creation-software",
  ],
  blocks: blocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: metadata(),
  seo: {
    title: "LMS & Course Creation Software Pricing Guide | SoftwareGlimpse",
    description:
      "How to budget LMS software — learners, seats, academy tiers, commerce fees, and plan gates.",
    canonicalPath: `/guides/${SLUG}/`,
    indexable: !SCHEDULED_AT,
  },
};
