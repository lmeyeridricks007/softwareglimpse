import { CategoryDefinitionSchema, type CategoryDefinition } from "@/domain";

/**
 * Time & Attendance subcategory definition v1.0 — under parent hr.
 * Clock-in, timesheets, shift scheduling, and frontline attendance cluster.
 */
export const timeAttendanceDefinition: CategoryDefinition = CategoryDefinitionSchema.parse({
  id: "cat-def-time-attendance-v1",
  slug: "time-attendance",
  name: "Time & Attendance",
  shortDescription:
    "Clock-in, timesheets, shift scheduling, and attendance policies — distinct from core HRIS and ATS recruiting.",
  parentSlug: "hr",
  aliases: [
    "time and attendance software",
    "time tracking software",
    "employee time clock",
    "shift scheduling software",
    "workforce time management",
  ],
  lifecycle: "active",
  configVersion: "1.0.0",
  scope: {
    definition:
      "Software whose primary job is time & attendance — clock-in/out, timesheets, attendance policies, shift scheduling for hourly teams, and GPS/geofence verification — not core HRIS, ATS recruiting, payroll-only platforms, or project-management time-tracking against tasks.",
    includes: [
      { id: "inc-clock-in", label: "Clock-in / clock-out and timesheets" },
      { id: "inc-attendance-policies", label: "Attendance policies, breaks, and overtime rules" },
      { id: "inc-shift-scheduling", label: "Shift scheduling and open-shift publishing" },
      { id: "inc-gps-geofence", label: "GPS / geofence clock-in for field and multi-site teams" },
      { id: "inc-frontline-mobile", label: "Mobile and kiosk clock-in for deskless workers" },
    ],
    excludes: [
      {
        id: "exc-core-hris",
        label: "Core HRIS / employee system of record as primary job",
        notes: "BambooHR — parent HR core-HRIS cluster",
      },
      {
        id: "exc-ats",
        label: "Applicant tracking / recruiting as primary job",
        notes: "Breezy HR — parent HR ATS cluster",
      },
      {
        id: "exc-pm-time",
        label: "Project-scoped time tracking against tasks",
        notes: "Prefer project-management — PM time is project-scoped, not HR attendance",
      },
      {
        id: "exc-payroll-only",
        label: "Payroll processing without attendance core",
        notes: "Gusto — parent HR payroll cluster",
      },
    ],
    adjacentCategorySlugs: ["hr", "project-management", "business-communications"],
    classificationNotes: [
      "Connecteam is frontline WFM + time primary — scheduling and mobile comms bundled",
      "Jibble is time & attendance primary — geofence and kiosk clock-in depth",
      "Homebase, When I Work, and Deputy are WFM peers with scheduling — rank inside time/WFM cluster",
      "Use parent HR finder with shift-scheduling dimension — no dedicated subcategory finder",
      "Never rank pure time clocks, full WFM suites, and HRIS time modules as one undifferentiated #1",
    ],
  },
  features: [
    feat(
      "time-attendance",
      "Time & attendance",
      "Clock-in/out, timesheets, and attendance policies for hourly staff.",
      "core",
      true,
      true,
    ),
    feat(
      "workforce-scheduling",
      "Workforce scheduling",
      "Shift planning, open shifts, and schedule publishing.",
      "core",
      true,
      true,
    ),
    feat(
      "gps-geofence-clockin",
      "GPS / geofence clock-in",
      "Location-aware or geofenced clock-in for field and multi-site teams.",
      "core",
      true,
      true,
    ),
    feat(
      "frontline-comms",
      "Frontline communications",
      "Mobile chat, announcements, and tasking for deskless workers.",
      "important",
      true,
      true,
    ),
    feat(
      "hris-integrations",
      "HRIS integrations",
      "Native sync with HRIS and payroll for timesheet export.",
      "important",
      true,
      true,
    ),
    feat(
      "analytics-reporting",
      "Analytics & reporting",
      "Attendance, overtime, and scheduling analytics.",
      "important",
      true,
      true,
    ),
    feat(
      "kiosk-clockin",
      "Kiosk clock-in",
      "Shared-device and PIN/biometric clock-in for on-site teams.",
      "important",
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
      notes: "Per-user / per-employee + location minimums when published",
    },
    { domain: "plans", level: "required", featureSlugs: [] },
    {
      domain: "features",
      level: "required",
      featureSlugs: ["time-attendance", "workforce-scheduling"],
    },
    { domain: "integrations", level: "required", featureSlugs: [] },
    { domain: "limits", level: "required", featureSlugs: [] },
  ],
  editorialMethodology: {
    id: "methodology-time-attendance-v1",
    slug: "time-attendance-editorial",
    name: "Time & Attendance Editorial Methodology",
    version: "1.0.0",
    categorySlug: "time-attendance",
    description:
      "SoftwareGlimpse evaluates time & attendance platforms on ease of use, attendance job fit, clock-in workflows, shift scheduling, mobile/frontline readiness, integrations, analytics, scalability, and value. Products are ranked within time & attendance job clusters only.",
    criteria: [
      crit("ease-of-use", "Ease of use", "Employee and manager daily workflow.", 12, 0, ["features:time-attendance"]),
      crit("attendance-job-fit", "Attendance job fit", "Fit to time clock vs WFM suite vs HRIS module.", 14, 1, ["features:time-attendance", "features:workforce-scheduling"]),
      crit("clock-in-workflows", "Clock-in workflows", "Timesheets, policies, breaks, and overtime.", 12, 2, ["features:time-attendance"]),
      crit("shift-scheduling", "Shift scheduling", "Shift planning, open shifts, and publishing.", 10, 3, ["features:workforce-scheduling"]),
      crit("gps-geofence", "GPS / geofence", "Location-aware clock-in depth.", 10, 4, ["features:gps-geofence-clockin"]),
      crit("mobile-frontline", "Mobile / frontline", "Mobile, kiosk, and deskless-worker readiness.", 10, 5, ["features:frontline-comms", "features:kiosk-clockin"]),
      crit("integrations", "Integrations", "HRIS, payroll, and stack connectors.", 8, 6, ["features:hris-integrations"]),
      crit("analytics", "Analytics", "Attendance, overtime, and scheduling metrics.", 8, 7, ["features:analytics-reporting"]),
      crit("scalability", "Scalability", "Employee count, locations, and governance.", 8, 8, ["limits"]),
      crit("value-for-money", "Value for money", "Per-user vs location TCO.", 8, 9, ["pricing", "plans"]),
    ],
    notes: "Weights sum to 100. Score within time & attendance clusters. Affiliate economics excluded.",
  },
  comparisonCriteria: [
    cmp("starting-pricing", "Starting pricing", "factual", 0, "high"),
    cmp("pricing-unit", "Pricing unit (user vs location)", "factual", 1, "high"),
    cmp("time-attendance", "Time & attendance", "editorial", 2, "high", "time-attendance"),
    cmp("shift-scheduling", "Shift scheduling", "editorial", 3, "high", "workforce-scheduling"),
    cmp("gps-geofence", "GPS / geofence clock-in", "editorial", 4, "high", "gps-geofence-clockin"),
    cmp("integrations", "Integrations", "editorial", 5, "medium", "hris-integrations"),
  ],
  pricingDimensions: [
    { id: "pd-ta-users", slug: "users", name: "Users / employees", enginePrimitive: "per-seat", required: true },
    { id: "pd-ta-locations", slug: "locations", name: "Locations / sites", enginePrimitive: "addon", required: false },
    { id: "pd-ta-plans", slug: "plans", name: "Plan tiers", enginePrimitive: "flat", required: true },
  ],
  pricingCapability: "PARTIAL",
  pricingCapabilityNotes: [
    "Per-user and location primitives supported; category TCO calculator not built",
  ],
  recommendationDimensions: [
    { id: "rd-ta-job", slug: "primary-job", name: "Primary job (time clock vs WFM suite)" },
    { id: "rd-ta-scheduling", slug: "shift-scheduling", name: "Shift scheduling need" },
    { id: "rd-ta-frontline", slug: "frontline-need", name: "Frontline / deskless need" },
    { id: "rd-ta-team", slug: "team-size", name: "Employee count and locations" },
    { id: "rd-ta-budget", slug: "budget", name: "Budget" },
  ],
  finderReadiness: "NOT_READY",
  finderNotes: [
    "Use parent hr-finder with shift-scheduling dimension — no dedicated subcategory finder UI",
    "Time & attendance job routing through parent HR finder dimensions",
  ],
  useCases: [
    { slug: "time-attendance", name: "Time & attendance", pageEligibility: "content-candidate" },
    { slug: "workforce-scheduling", name: "Workforce scheduling", pageEligibility: "content-candidate" },
    { slug: "frontline-ops", name: "Frontline operations", pageEligibility: "content-candidate" },
  ],
  audienceSlugs: ["operations", "hr", "retail"],
  businessSizeSlugs: ["micro", "small-business", "mid-market"],
  businessTypeSlugs: ["retail", "hospitality", "professional-services", "agency"],
  seedProductSlugs: ["connecteam", "jibble"],
  queryAliases: [
    "time and attendance software",
    "time tracking software",
    "employee time clock",
    "shift scheduling software",
  ],
  requiredResearchDomains: ["identity", "pricing", "plans", "features", "integrations", "limits"],
  optionalResearchDomains: ["free-trial", "free-plan"],
  pricingModelsSupported: ["per-seat", "usage", "flat", "custom", "hybrid"],
  notes: [
    "Tier 1 HR subcategory — August 2027 indexable sub-hub launch",
    "~5630 affiliate revenue units in expansion audit",
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
    id: `feat-ta-${slug}`,
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
    id: `crit-ta-${slug}`,
    slug,
    name,
    description,
    weight,
    evidenceRequirements,
    scoringScaleMin: 0,
    scoringScaleMax: 10,
    categorySlug: "time-attendance",
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
    id: `cmp-ta-${slug}`,
    slug,
    name,
    kind,
    displayOrder,
    decisionImportance,
    ...(featureSlug ? { featureSlug } : {}),
  };
}
