import { CategoryDefinitionSchema, type CategoryDefinition } from "@/domain";

/**
 * ATS & Recruiting subcategory definition v1.0 — under parent hr.
 * Applicant tracking, career sites, and hiring workflow cluster.
 */
export const atsRecruitingDefinition: CategoryDefinition = CategoryDefinitionSchema.parse({
  id: "cat-def-ats-recruiting-v1",
  slug: "ats-recruiting",
  name: "ATS & Recruiting",
  shortDescription:
    "Applicant tracking, career sites, and hiring workflows — distinct from core HRIS, payroll, and frontline WFM.",
  parentSlug: "hr",
  aliases: [
    "ATS software",
    "applicant tracking software",
    "recruiting software",
    "hiring software",
    "recruitment platform",
  ],
  lifecycle: "active",
  configVersion: "1.0.0",
  scope: {
    definition:
      "Software whose primary job is applicant tracking and recruiting — candidate pipelines, career sites, job-board syndication, interview scheduling, and hiring-team collaboration — not core HRIS, payroll/benefits, frontline scheduling, or time & attendance.",
    includes: [
      { id: "inc-ats-pipeline", label: "Candidate pipelines and hiring workflows" },
      { id: "inc-career-site", label: "Branded career sites and job-board posting" },
      { id: "inc-interview-scheduling", label: "Interview scheduling and coordination" },
      { id: "inc-candidate-collab", label: "Hiring-team collaboration and scorecards" },
    ],
    excludes: [
      {
        id: "exc-core-hris",
        label: "Core HRIS / employee system of record as primary job",
        notes: "BambooHR/HiBob — parent HR core-HRIS cluster",
      },
      {
        id: "exc-payroll",
        label: "Payroll and benefits administration as primary job",
        notes: "Gusto — parent HR payroll cluster",
      },
      {
        id: "exc-wfm",
        label: "Frontline workforce scheduling without ATS core",
        notes: "Connecteam/Homebase — parent HR WFM cluster",
      },
      {
        id: "exc-time-clock",
        label: "Time & attendance / clock-in as primary job",
        notes: "Jibble — parent HR time-attendance cluster",
      },
    ],
    adjacentCategorySlugs: ["hr", "business-communications", "crm"],
    classificationNotes: [
      "Breezy HR is SMB ATS editorial anchor — not enterprise structured-hiring peer against Greenhouse",
      "Freshteam is Freshworks ATS — sunset / limited buyability; inventory for affiliate coverage only",
      "Greenhouse, Workable, Lever, and Ashby are ATS peers — rank inside ATS only",
      "Use parent HR finder with hiring-team-size constraints — no dedicated subcategory finder",
      "Never rank SMB ATS, structured enterprise hiring, and HRIS-with-ATS modules as one undifferentiated #1",
    ],
  },
  features: [
    feat(
      "applicant-tracking",
      "Applicant tracking",
      "Pipelines, candidate profiles, and hiring workflows.",
      "core",
      true,
      true,
    ),
    feat(
      "career-site-job-boards",
      "Career site & job boards",
      "Branded career pages and job-board posting / syndication.",
      "core",
      true,
      true,
    ),
    feat(
      "interview-scheduling",
      "Interview scheduling",
      "Calendar booking, interviewer coordination, and interview workflows.",
      "core",
      true,
      true,
    ),
    feat(
      "hiring-collaboration",
      "Hiring collaboration",
      "Scorecards, feedback, and team hiring workflows.",
      "important",
      true,
      true,
    ),
    feat(
      "hris-integrations",
      "HRIS integrations",
      "Native sync with HRIS and onboarding for hire-to-retain handoff.",
      "important",
      true,
      true,
    ),
    feat(
      "analytics-reporting",
      "Analytics & reporting",
      "Hiring funnel, time-to-hire, and recruiting analytics.",
      "important",
      true,
      true,
    ),
    feat(
      "ai-assistance",
      "AI assistance",
      "AI help for sourcing, screening, and job-description drafting.",
      "optional",
      true,
      true,
    ),
  ],
  researchRequirements: [
    { domain: "identity", level: "required", featureSlugs: [] },
    {
      domain: "pricing",
      level: "required",
      featureSlugs: [],
      notes: "Per-seat / per-recruiter + employee or job-posting minimums when published",
    },
    { domain: "plans", level: "required", featureSlugs: [] },
    {
      domain: "features",
      level: "required",
      featureSlugs: ["applicant-tracking", "career-site-job-boards"],
    },
    { domain: "integrations", level: "required", featureSlugs: [] },
    { domain: "limits", level: "required", featureSlugs: [] },
  ],
  editorialMethodology: {
    id: "methodology-ats-recruiting-v1",
    slug: "ats-recruiting-editorial",
    name: "ATS & Recruiting Editorial Methodology",
    version: "1.0.0",
    categorySlug: "ats-recruiting",
    description:
      "SoftwareGlimpse evaluates ATS and recruiting platforms on ease of use, ATS job fit, pipeline workflows, career sites, interview scheduling, integrations, analytics, scalability, value, and AI assistance. Products are ranked within ATS job clusters only.",
    criteria: [
      crit("ease-of-use", "Ease of use", "Recruiter and hiring-manager daily workflow.", 12, 0, ["features:applicant-tracking"]),
      crit("ats-job-fit", "ATS job fit", "Fit to SMB ATS vs structured enterprise hiring.", 14, 1, ["features:applicant-tracking", "features:career-site-job-boards"]),
      crit("pipeline-workflows", "Pipeline workflows", "Stages, collaboration, and candidate management depth.", 12, 2, ["features:applicant-tracking"]),
      crit("career-site", "Career site & job boards", "Branded pages and syndication depth.", 10, 3, ["features:career-site-job-boards"]),
      crit("interview-scheduling", "Interview scheduling", "Calendar booking and coordination workflows.", 10, 4, ["features:interview-scheduling"]),
      crit("integrations", "Integrations", "HRIS, calendar, and stack connectors.", 8, 5, ["features:hris-integrations"]),
      crit("analytics", "Analytics", "Funnel, time-to-hire, and recruiting metrics.", 8, 6, ["features:analytics-reporting"]),
      crit("scalability", "Scalability", "Candidate volume, seats, and governance.", 8, 7, ["limits"]),
      crit("value-for-money", "Value for money", "Per-seat vs job-posting TCO.", 10, 8, ["pricing", "plans"]),
      crit("ai-capabilities", "AI capabilities", "AI sourcing, screening, and drafting depth.", 8, 9, ["features:ai-assistance"]),
    ],
    notes: "Weights sum to 100. Score within ATS clusters. Affiliate economics excluded.",
  },
  comparisonCriteria: [
    cmp("starting-pricing", "Starting pricing", "factual", 0, "high"),
    cmp("pricing-unit", "Pricing unit (seat vs job)", "factual", 1, "high"),
    cmp("applicant-tracking", "Applicant tracking", "editorial", 2, "high", "applicant-tracking"),
    cmp("career-site", "Career site & job boards", "editorial", 3, "high", "career-site-job-boards"),
    cmp("interview-scheduling", "Interview scheduling", "editorial", 4, "high", "interview-scheduling"),
    cmp("integrations", "Integrations", "editorial", 5, "medium", "hris-integrations"),
  ],
  pricingDimensions: [
    { id: "pd-ats-seats", slug: "seats", name: "Recruiters / seats", enginePrimitive: "per-seat", required: true },
    { id: "pd-ats-jobs", slug: "jobs", name: "Active job postings", enginePrimitive: "usage", required: true },
    { id: "pd-ats-plans", slug: "plans", name: "Plan tiers", enginePrimitive: "flat", required: true },
  ],
  pricingCapability: "PARTIAL",
  pricingCapabilityNotes: [
    "Per-seat and job-posting primitives supported; category TCO calculator not built",
  ],
  recommendationDimensions: [
    { id: "rd-ats-job", slug: "primary-job", name: "Primary job (SMB ATS vs structured hiring)" },
    { id: "rd-ats-team", slug: "hiring-team-size", name: "Hiring team size" },
    { id: "rd-ats-volume", slug: "hiring-volume", name: "Hiring volume and job count" },
    { id: "rd-ats-stack", slug: "hris-stack", name: "HRIS / payroll stack" },
    { id: "rd-ats-budget", slug: "budget", name: "Budget" },
  ],
  finderReadiness: "NOT_READY",
  finderNotes: [
    "Use parent hr-finder with hiring-team-size constraints — no dedicated subcategory finder UI",
    "ATS job routing through parent HR finder dimensions",
  ],
  useCases: [
    { slug: "recruiting-ats", name: "Recruiting / ATS", pageEligibility: "content-candidate" },
  ],
  audienceSlugs: ["hr", "operations", "small-business"],
  businessSizeSlugs: ["micro", "small-business", "mid-market", "enterprise"],
  businessTypeSlugs: ["saas", "agency", "startup", "professional-services"],
  seedProductSlugs: ["breezy-hr", "freshteam"],
  queryAliases: [
    "ATS software",
    "applicant tracking software",
    "recruiting software",
    "hiring software",
  ],
  requiredResearchDomains: ["identity", "pricing", "plans", "features", "integrations", "limits"],
  optionalResearchDomains: ["free-trial", "ai-capabilities"],
  pricingModelsSupported: ["per-seat", "usage", "flat", "custom", "hybrid"],
  notes: [
    "Tier 1 HR subcategory — August 2027 indexable sub-hub launch",
    "~3600 affiliate revenue units in expansion audit",
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
    id: `feat-ats-${slug}`,
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
    id: `crit-ats-${slug}`,
    slug,
    name,
    description,
    weight,
    evidenceRequirements,
    scoringScaleMin: 0,
    scoringScaleMax: 10,
    categorySlug: "ats-recruiting",
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
    id: `cmp-ats-${slug}`,
    slug,
    name,
    kind,
    displayOrder,
    decisionImportance,
    ...(featureSlug ? { featureSlug } : {}),
  };
}
