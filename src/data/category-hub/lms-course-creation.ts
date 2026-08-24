import { CategoryHubProfileSchema, type CategoryHubProfile } from "@/domain";

export function buildLmsCourseCreationCategoryHubProfile(): CategoryHubProfile {
  return CategoryHubProfileSchema.parse({
    categorySlug: "lms-course-creation",
    shortName: "LMS & Course Creation",
    displayName: "LMS & Course Creation Software",
    tagline:
      "Find LMS and course creation software by job — sell courses, run cohorts, issue certificates, and assess learners.",
    definition:
      "LMS and course creation software helps creators and training businesses build curricula, sell courses, run cohort programs, and assess learners. The right tool matches the primary job — not a single list that ranks LearnWorlds against Trainual or FlexiQuiz as if they were the same purchase. Dedicated finder tooling is deferred until the category has six or more primary products.",
    iconSlug: "lms-course-creation",
    decisionCriteria: [
      "Primary learning job fit",
      "External vs internal audience",
      "Course commerce needs",
      "Cohort vs self-paced",
      "Assessment & certificate depth",
      "Total cost (learners + admins)",
    ],
    popularNeeds: [
      "Online course platform",
      "Course commerce",
      "Cohort programs",
      "Certificates",
      "Quizzes & assessments",
      "Team training paths",
    ],
    chooseGuideHref: "/guides/how-to-choose-lms-course-creation-software/",
    glance: {
      whatItDoes: [
        "Authors structured courses and lesson modules",
        "Sells courses, memberships, and bundles",
        "Runs cohort schedules and drip releases",
        "Issues completion certificates",
        "Delivers quizzes and knowledge checks",
        "Tracks learner progress and completion",
      ],
      bestFor: [
        "Course creators selling online programs",
        "Training businesses running cohort academies",
        "Teams documenting playbooks with learning paths",
        "Educators needing assessment and certification gates",
      ],
      typicalFeatures: [
        "Course creation",
        "Course commerce",
        "Cohort programs",
        "Certificates",
        "Learner assessments",
        "Learner progress tracking",
      ],
    },
    types: [
      {
        id: "course-lms",
        name: "Course LMS / academy",
        description: "Sell courses, memberships, and structured programs.",
        icon: "graduation-cap",
        href: "/use-cases/online-courses/",
        ctaLabel: "Explore course LMS platforms →",
      },
      {
        id: "cohort",
        name: "Cohort programs",
        description: "Scheduled cohorts with milestones and group learning.",
        icon: "users",
        href: "/use-cases/cohort-learning/",
        ctaLabel: "Explore cohort tools →",
      },
      {
        id: "playbooks",
        name: "Team playbooks",
        description: "Internal SOPs and role-based training paths.",
        icon: "book",
        href: "/use-cases/employee-training/",
        ctaLabel: "Explore playbook tools →",
      },
      {
        id: "assessments",
        name: "Quizzes & assessments",
        description: "Tests, grading, and certification workflows.",
        icon: "checklist",
        href: "/use-cases/learner-assessments/",
        ctaLabel: "Explore assessment tools →",
      },
    ],
    tools: [],
    bestPageHref: "/best/lms-course-creation-software/",
    guides: [
      {
        slug: "what-is-lms-course-creation-software",
        title: "What is LMS & course creation software?",
        href: "/guides/what-is-lms-course-creation-software/",
      },
      {
        slug: "how-to-choose-lms-course-creation-software",
        title: "How to choose LMS software",
        href: "/guides/how-to-choose-lms-course-creation-software/",
      },
      {
        slug: "lms-course-creation-pricing-guide",
        title: "LMS software pricing guide",
        href: "/guides/lms-course-creation-pricing-guide/",
      },
      {
        slug: "lms-course-creation-vs-hr-software",
        title: "LMS vs HR software",
        href: "/guides/lms-course-creation-vs-hr-software/",
      },
    ],
  });
}
