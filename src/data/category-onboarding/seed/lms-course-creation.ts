import { CategoryDefinitionSchema, type CategoryDefinition } from "@/domain";

/**
 * LMS & Course Creation decision-domain definition v1.0.
 * Sell courses, host cohorts, issue certificates, and assess learners.
 */
export const lmsCourseCreationDefinition: CategoryDefinition =
  CategoryDefinitionSchema.parse({
    id: "cat-def-lms-course-creation-v1",
    slug: "lms-course-creation",
    name: "LMS & Course Creation",
    shortDescription:
      "Create, sell, and deliver online courses, cohort programs, certificates, and learner assessments — distinct from HR onboarding checklists.",
    parentSlug: null,
    aliases: [
      "LMS software",
      "online course platform",
      "course creation software",
      "learning management system",
      "online academy software",
    ],
    lifecycle: "active",
    configVersion: "1.0.0",
    scope: {
      definition:
        "Software whose primary job is building and delivering learning content for external students, customers, or structured training programs — selling courses, hosting cohorts, issuing certificates, and assessing learners. Not frontline HRIS onboarding, shift scheduling, or generic MAP/funnel tools unless course delivery is the stated buyer job.",
      includes: [
        { id: "inc-course-lms", label: "Course LMS & academy hosting" },
        { id: "inc-course-commerce", label: "Course commerce & checkout" },
        { id: "inc-cohort", label: "Cohort programs & drip schedules" },
        { id: "inc-certificates", label: "Certificates & completion tracking" },
        { id: "inc-assessments", label: "Quizzes, tests & knowledge checks" },
      ],
      excludes: [
        {
          id: "exc-hr-onboarding",
          label: "HR onboarding checklists without course delivery depth",
          notes: "Prefer hr for pure SOP wikis without learner commerce",
        },
        {
          id: "exc-wfm",
          label: "Frontline workforce scheduling / time clocks",
          notes: "Prefer hr for WFM purchases",
        },
        {
          id: "exc-funnel-only",
          label: "Funnel builders without LMS core",
          notes: "Kartra-class tools stay marketing unless LMS is the job",
        },
        {
          id: "exc-webinar-only",
          label: "Webinar hosts without course/academy depth",
          notes: "Prefer webinar-virtual-events for live-event-only jobs",
        },
      ],
      adjacentCategorySlugs: ["marketing", "hr", "webinar-virtual-events"],
      classificationNotes: [
        "LearnWorlds is course LMS + academy commerce primary — not HRIS or SOP wiki",
        "Trainual is team playbook / training-path primary with HR overlap — not external course commerce",
        "FlexiQuiz is assessment/quiz primary — not a full course LMS",
        "Never rank course LMS, team playbooks, and quiz tools as one undifferentiated #1",
        "Dedicated category finder deferred until 6+ primary products",
      ],
    },
    features: [
      feat(
        "course-creation",
        "Course creation",
        "Author lessons, modules, videos, and structured curricula.",
        "core",
        true,
        true,
      ),
      feat(
        "course-commerce",
        "Course commerce",
        "Sell courses, memberships, and bundles with checkout.",
        "core",
        true,
        true,
      ),
      feat(
        "cohort-learning",
        "Cohort programs",
        "Scheduled cohorts, drip releases, and cohort communication.",
        "important",
        true,
        true,
      ),
      feat(
        "certificates",
        "Certificates",
        "Issue completion certificates and track credentials.",
        "important",
        true,
        true,
      ),
      feat(
        "learner-assessments",
        "Learner assessments",
        "Quizzes, tests, grading, and knowledge checks.",
        "core",
        true,
        true,
      ),
      feat(
        "learner-progress",
        "Learner progress",
        "Completion tracking, paths, and reporting per learner.",
        "important",
        true,
        true,
      ),
      feat(
        "integrations",
        "Integrations",
        "CRM, email, payment, and video hosting integrations.",
        "important",
        true,
        true,
      ),
      feat(
        "team-playbooks",
        "Team playbooks",
        "Internal SOP and role-based training paths (landscape for Trainual).",
        "specialist",
        true,
        false,
        "Score only when the product claims internal playbook depth.",
      ),
    ],
    researchRequirements: [
      { domain: "identity", level: "required", featureSlugs: [] },
      {
        domain: "pricing",
        level: "required",
        featureSlugs: [],
        notes: "Per-course, per-learner, and academy plan models",
      },
      { domain: "plans", level: "required", featureSlugs: [] },
      {
        domain: "features",
        level: "required",
        featureSlugs: ["course-creation", "course-commerce", "learner-assessments"],
      },
      { domain: "integrations", level: "required", featureSlugs: [] },
      { domain: "limits", level: "required", featureSlugs: [] },
      { domain: "free-trial", level: "recommended", featureSlugs: [] },
    ],
    editorialMethodology: {
      id: "methodology-lms-course-creation-v1",
      slug: "lms-course-creation-editorial",
      name: "LMS & Course Creation Editorial Methodology",
      version: "1.0.0",
      categorySlug: "lms-course-creation",
      description:
        "SoftwareGlimpse evaluates LMS and course creation platforms on ease of use, learning job fit, workflow depth, commerce, assessments, integrations, analytics, scalability, and value. Products are ranked within job clusters only.",
      criteria: [
        crit("ease-of-use", "Ease of use", "Learning curve for authors and admins.", 12, 0, ["features:course-creation"]),
        crit("learning-job-fit", "Learning job fit", "Fit to course LMS, cohort, playbook, or assessment cluster.", 15, 1, ["features:course-creation", "features:team-playbooks", "features:learner-assessments"]),
        crit("workflow-depth", "Workflow depth", "Curriculum, cohort, and learner admin workflows.", 12, 2, ["features:cohort-learning", "features:learner-progress"]),
        crit("course-commerce", "Course commerce", "Checkout, memberships, and pricing flexibility.", 10, 3, ["features:course-commerce"]),
        crit("assessments", "Assessments", "Quiz depth, grading, and certification gates.", 10, 4, ["features:learner-assessments", "features:certificates"]),
        crit("integrations", "Integrations", "CRM, email, payments, and video stack depth.", 10, 5, ["integrations"]),
        crit("analytics", "Analytics", "Learner progress, completion, and revenue reporting.", 8, 6, ["features:learner-progress"]),
        crit("scalability", "Scalability", "Learner volume, multi-academy, and admin governance.", 8, 7, ["limits"]),
        crit("value-for-money", "Value for money", "Pricing fairness vs capabilities and plan gates.", 15, 8, ["pricing", "plans"]),
      ],
      notes: "Weights sum to 100. Score within job clusters. Affiliate economics excluded.",
    },
    comparisonCriteria: [
      cmp("starting-pricing", "Starting pricing", "factual", 0, "high"),
      cmp("free-trial", "Free trial", "factual", 1, "medium"),
      cmp("course-lms", "Course LMS", "editorial", 2, "high", "course-creation"),
      cmp("commerce", "Course commerce", "editorial", 3, "high", "course-commerce"),
      cmp("cohorts", "Cohort programs", "editorial", 4, "medium", "cohort-learning"),
      cmp("assessments", "Assessments", "editorial", 5, "high", "learner-assessments"),
      cmp("integrations", "Integrations", "editorial", 6, "medium"),
    ],
    pricingDimensions: [
      { id: "pd-lms-learners", slug: "learners", name: "Learners / students", enginePrimitive: "usage", required: true },
      { id: "pd-lms-authors", slug: "authors", name: "Authors / admins", enginePrimitive: "per-seat", required: false },
      { id: "pd-lms-plans", slug: "plans", name: "Plan tiers", enginePrimitive: "flat", required: true },
    ],
    pricingCapability: "PARTIAL",
    pricingCapabilityNotes: [
      "Per-learner and flat academy primitives supported; category TCO calculator not built",
    ],
    recommendationDimensions: [
      { id: "rd-lms-job", slug: "primary-job", name: "Primary job (LMS vs playbooks vs assessments)" },
      { id: "rd-lms-audience", slug: "audience", name: "External students vs internal team" },
      { id: "rd-lms-commerce", slug: "commerce", name: "Course sales / memberships needed" },
      { id: "rd-lms-budget", slug: "budget", name: "Budget" },
    ],
    finderReadiness: "NOT_READY",
    finderNotes: [
      "Defer dedicated finder until 6+ primary products in category",
      "Index under marketing/hr hubs with scope notes until then",
    ],
    useCases: [
      { slug: "online-courses", name: "Online courses", pageEligibility: "content-candidate" },
      { slug: "course-commerce", name: "Course commerce", pageEligibility: "content-candidate" },
      { slug: "cohort-learning", name: "Cohort learning", pageEligibility: "content-candidate" },
      { slug: "learner-assessments", name: "Learner assessments", pageEligibility: "content-candidate" },
    ],
    audienceSlugs: ["marketing", "small-business"],
    businessSizeSlugs: ["micro", "small-business", "mid-market", "enterprise"],
    businessTypeSlugs: ["saas", "agency", "startup"],
    seedProductSlugs: ["learnworlds", "trainual", "flexiquiz"],
    queryAliases: [
      "LMS software",
      "online course platform",
      "course creation software",
      "learning management system",
    ],
    requiredResearchDomains: ["identity", "pricing", "plans", "features", "integrations", "limits"],
    optionalResearchDomains: ["free-trial", "ai-capabilities"],
    pricingModelsSupported: ["per-seat", "usage", "flat", "custom", "hybrid"],
    notes: [
      "Tier 2 nurture inventory — December 2026 hub launch",
      "Trainual and FlexiQuiz have HR overlap; scope notes on hub and vs-hr guide",
      "Do not invent product scores; do not auto-publish pages",
    ],
    supportingKnowledgeAreas: ["fundamentals", "selection", "pricing", "features"],
  });

function feat(
  slug: string,
  name: string,
  description: string,
  importance: "core" | "important" | "optional" | "specialist",
  comparisonRelevant: boolean,
  finderRelevant: boolean,
  researchGuidance?: string,
) {
  return {
    id: `feat-lms-${slug}`,
    slug,
    name,
    description,
    importance,
    comparisonRelevant,
    finderRelevant,
    researchGuidance,
    aliases: [],
  };
}

function crit(
  slug: string,
  name: string,
  description: string,
  weight: number,
  displayOrder: number,
  evidenceRequirements: string[],
) {
  return {
    id: `crit-lms-${slug}`,
    slug,
    name,
    description,
    weight,
    evidenceRequirements,
    scoringScaleMin: 0,
    scoringScaleMax: 10,
    categorySlug: "lms-course-creation",
    displayOrder,
  };
}

function cmp(
  slug: string,
  name: string,
  kind: "factual" | "editorial",
  displayOrder: number,
  decisionImportance: "high" | "medium" | "low",
  featureSlug?: string,
) {
  return {
    id: `cmp-lms-${slug}`,
    slug,
    name,
    kind,
    displayOrder,
    decisionImportance,
    ...(featureSlug ? { featureSlug } : {}),
  };
}
