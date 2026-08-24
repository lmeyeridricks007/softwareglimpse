import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import { tier15GuideScheduledAt } from "@/data/config/publishing/tier-15-lms-course-creation-launch-2026-12-01";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const SLUG = "what-is-lms-course-creation-software";
const SCHEDULED_AT = tier15GuideScheduledAt(SLUG);

const blocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "LMS and course creation software helps creators and training businesses build, sell, and deliver online courses, run cohort programs, issue certificates, and assess learners — not HR onboarding checklists or frontline shift scheduling. Decision rule: if the blocking job is selling courses and running an academy, shortlist LearnWorlds-class LMS platforms; if it is internal team playbooks, shortlist Trainual-class tools; if it is quizzes and certifications only, shortlist FlexiQuiz-class assessment tools — never rank those jobs as one undifferentiated list.",
    bullets: [
      "Course LMS & academies",
      "Course commerce",
      "Cohort programs",
      "Certificates",
      "Quizzes & assessments",
      "Not HR onboarding",
      "Not frontline WFM",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Learning is several purchases",
        body: "Course LMS, team playbooks, and assessment tools fail for different reasons. Name the job before you shortlist.",
      },
      {
        label: "Distinct from HR software",
        body: "HRIS, ATS, and WFM tools may include training modules — but course creators and academy commerce are different buyer jobs.",
      },
      {
        label: "Pricing units differ",
        body: "Per-learner, per-course, and academy plan tiers change TCO more than the starter tile.",
      },
    ],
  },
  {
    type: "crm-types",
    id: "lms-shapes",
    title: "Common LMS & course creation shapes (not rankings)",
    types: [
      {
        id: "course-lms",
        title: "Course LMS / academy",
        bestFor: "Sell courses, memberships, and structured online programs.",
        avoidWhen: "You only need internal SOP docs without learner commerce.",
      },
      {
        id: "cohort",
        title: "Cohort programs",
        bestFor: "Scheduled cohorts with drip content and group milestones.",
        avoidWhen: "Self-paced evergreen courses without cohort admin are enough.",
      },
      {
        id: "playbooks",
        title: "Team playbooks & training paths",
        bestFor: "Internal role paths, SOPs, and employee onboarding content.",
        avoidWhen: "External course sales and checkout are the blocking job.",
      },
      {
        id: "assessments",
        title: "Quizzes & assessments",
        bestFor: "Tests, certifications, and knowledge checks.",
        avoidWhen: "You need full course authoring and commerce — not quizzes alone.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "next-steps",
    title: "Next steps",
    body: "Name your primary learning job, then shortlist within that cluster.",
    href: "/best/lms-course-creation-software/",
    ctaLabel: "See Best LMS & Course Creation Software →",
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

export const whatIsLmsCourseCreationSoftwareGuide: GuidePage = {
  id: "guide-what-is-lms-course-creation-software",
  slug: SLUG,
  title: "What Is LMS & Course Creation Software?",
  summary:
    "A clear definition of course LMS platforms, cohort programs, team playbooks, and assessment tools — and how they differ from HR onboarding software.",
  categorySlugs: ["lms-course-creation"],
  topicType: "fundamental",
  supports: [
    {
      contentId: "content:category:lms-course-creation",
      relationType: "supports-anchor",
      primary: true,
    },
    {
      contentId: "content:best:lms-course-creation-software",
      relationType: "supports-anchor",
      primary: false,
    },
  ],
  nextAction: {
    contentId: "content:guide:how-to-choose-lms-course-creation-software",
    label: "How to choose LMS software →",
  },
  relatedGuideSlugs: [
    "how-to-choose-lms-course-creation-software",
    "lms-course-creation-pricing-guide",
  ],
  blocks: blocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: metadata(),
  seo: {
    title: "What Is LMS & Course Creation Software? | SoftwareGlimpse",
    description:
      "Definition of course LMS, academy commerce, cohort learning, and assessments — distinct from HR onboarding and WFM.",
    canonicalPath: `/guides/${SLUG}/`,
    indexable: !SCHEDULED_AT,
  },
};
