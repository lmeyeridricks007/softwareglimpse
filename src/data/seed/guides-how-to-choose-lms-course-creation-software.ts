import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import { tier15GuideScheduledAt } from "@/data/config/publishing/tier-15-lms-course-creation-launch-2026-12-01";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const SLUG = "how-to-choose-lms-course-creation-software";
const SCHEDULED_AT = tier15GuideScheduledAt(SLUG);

const blocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Choose LMS and course creation software by the job blocking work — selling courses, running cohorts, internal team playbooks, or learner assessments — then confirm audience (external students vs internal team), commerce needs, and assessment depth. Shortlist only tools whose core product is your job.",
    bullets: [
      "Primary learning job",
      "External vs internal audience",
      "Course commerce needs",
      "Cohort vs self-paced",
      "Assessment / certificate gates",
      "Trial with one real module",
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

export const howToChooseLmsCourseCreationSoftwareGuide: GuidePage = {
  id: "guide-how-to-choose-lms-course-creation-software",
  slug: SLUG,
  title: "How to Choose LMS & Course Creation Software",
  summary:
    "Pick course LMS platforms, team playbook tools, or assessment software by primary job, audience, and commerce needs.",
  categorySlugs: ["lms-course-creation"],
  topicType: "selection",
  supports: [
    {
      contentId: "content:category:lms-course-creation",
      relationType: "supports-anchor",
      primary: true,
    },
  ],
  relatedGuideSlugs: [
    "what-is-lms-course-creation-software",
    "lms-course-creation-pricing-guide",
  ],
  blocks: blocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: metadata(),
  seo: {
    title: "How to Choose LMS & Course Creation Software | SoftwareGlimpse",
    description:
      "How to choose LMS software by course commerce, cohort, playbook, or assessment job cluster.",
    canonicalPath: `/guides/${SLUG}/`,
    indexable: !SCHEDULED_AT,
  },
};
