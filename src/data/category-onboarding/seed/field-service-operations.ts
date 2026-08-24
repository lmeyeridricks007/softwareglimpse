import { CategoryDefinitionSchema, type CategoryDefinition } from "@/domain";

/**
 * Field Service & Operations decision-domain definition v1.0.
 * Schedule field crews, manage construction jobs, or run appointment-based local services.
 */
export const fieldServiceOperationsDefinition: CategoryDefinition =
  CategoryDefinitionSchema.parse({
    id: "cat-def-field-service-operations-v1",
    slug: "field-service-operations",
    name: "Field Service & Operations",
    shortDescription:
      "Schedule field crews, manage construction jobs, and run appointment-based local services — distinct from generic Work OS boards or helpdesk ticketing.",
    parentSlug: null,
    aliases: [
      "field service management software",
      "construction management software",
      "appointment scheduling software",
      "trades business software",
      "job dispatch software",
    ],
    lifecycle: "active",
    configVersion: "1.0.0",
    scope: {
      definition:
        "Software whose primary job is scheduling and operating work outside a central office — construction job costing, trades dispatch, quotes/invoicing in the field, or appointment-led local services. Not generic project boards, ITSM, or live-chat helpdesks unless field ops is the stated buyer job.",
      includes: [
        { id: "inc-construction", label: "Construction job management" },
        { id: "inc-trades-fsm", label: "Trades field service & dispatch" },
        { id: "inc-appointments", label: "Appointment scheduling for local services" },
        { id: "inc-quotes-invoicing", label: "Quotes, invoicing & payments in the field" },
      ],
      excludes: [
        {
          id: "exc-work-os",
          label: "Generic Work OS / kanban boards without field ops depth",
          notes: "Prefer project-management for cross-functional boards",
        },
        {
          id: "exc-helpdesk",
          label: "Helpdesk ticketing without appointment/field ops core",
          notes: "Prefer customer-service for ticket queues",
        },
        {
          id: "exc-manufacturing",
          label: "Manufacturing MRP / shop-floor MES",
          notes: "Prefer accounting-finance MRP peers",
        },
      ],
      adjacentCategorySlugs: ["project-management", "customer-service", "accounting-finance"],
      classificationNotes: [
        "Contractor Foreman is construction management primary — not Monday-class Work OS",
        "ServiceM8 is trades FSM primary — dispatch, quotes, and mobile jobs",
        "Shore is appointment scheduling primary — local services, not helpdesk",
        "Never rank construction, trades FSM, and appointment tools as one undifferentiated #1",
        "Generic finder deferred — vertical-specific industry pages first",
      ],
    },
    features: [
      feat(
        "job-scheduling",
        "Job scheduling",
        "Schedule crews, appointments, and site visits.",
        "core",
        true,
        true,
      ),
      feat(
        "crew-dispatch",
        "Crew dispatch",
        "Assign jobs, routes, and field workers.",
        "core",
        true,
        true,
      ),
      feat(
        "job-costing",
        "Job costing",
        "Estimates, change orders, and job-level P&L.",
        "core",
        true,
        true,
      ),
      feat(
        "quotes-invoicing",
        "Quotes & invoicing",
        "Quotes, invoices, and payments from the field.",
        "important",
        true,
        true,
      ),
      feat(
        "appointment-booking",
        "Appointment booking",
        "Client self-booking, reminders, and calendars.",
        "core",
        true,
        true,
      ),
      feat(
        "client-management",
        "Client management",
        "Customer records, history, and communication.",
        "important",
        true,
        true,
      ),
      feat(
        "mobile-field-app",
        "Mobile field app",
        "Offline-capable mobile workflows for crews.",
        "important",
        true,
        true,
      ),
      feat(
        "integrations",
        "Integrations",
        "Accounting, payments, and calendar connectors.",
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
        notes: "Per-user, per-job, and flat trade plan models",
      },
      { domain: "plans", level: "required", featureSlugs: [] },
      {
        domain: "features",
        level: "required",
        featureSlugs: ["job-scheduling", "crew-dispatch", "appointment-booking"],
      },
      { domain: "integrations", level: "required", featureSlugs: [] },
      { domain: "limits", level: "required", featureSlugs: [] },
      { domain: "free-trial", level: "recommended", featureSlugs: [] },
    ],
    editorialMethodology: {
      id: "methodology-field-service-operations-v1",
      slug: "field-service-operations-editorial",
      name: "Field Service & Operations Editorial Methodology",
      version: "1.0.0",
      categorySlug: "field-service-operations",
      description:
        "SoftwareGlimpse evaluates field service and operations platforms on ease of use, field job fit, scheduling depth, costing, mobile workflows, integrations, scalability, and value. Products are ranked within job clusters only.",
      criteria: [
        crit("ease-of-use", "Ease of use", "Setup for owners, dispatchers, and field crews.", 12, 0, ["features:job-scheduling"]),
        crit("field-job-fit", "Field job fit", "Fit to construction, trades FSM, or appointment cluster.", 15, 1, ["features:job-scheduling", "features:appointment-booking"]),
        crit("scheduling-depth", "Scheduling depth", "Crew, route, and appointment scheduling workflows.", 12, 2, ["features:crew-dispatch", "features:appointment-booking"]),
        crit("job-costing", "Job costing", "Estimates, change orders, and job financials.", 10, 3, ["features:job-costing"]),
        crit("mobile-workflows", "Mobile workflows", "Field app depth and offline reliability.", 10, 4, ["features:mobile-field-app"]),
        crit("quotes-invoicing", "Quotes & invoicing", "Quote-to-cash from the field.", 10, 5, ["features:quotes-invoicing"]),
        crit("integrations", "Integrations", "Accounting, payments, and calendar depth.", 10, 6, ["integrations"]),
        crit("scalability", "Scalability", "Multi-crew, multi-location, and governance.", 8, 7, ["limits"]),
        crit("value-for-money", "Value for money", "Pricing fairness vs crews, jobs, and features.", 13, 8, ["pricing", "plans"]),
      ],
      notes: "Weights sum to 100. Score within job clusters. Affiliate economics excluded.",
    },
    comparisonCriteria: [
      cmp("starting-pricing", "Starting pricing", "factual", 0, "high"),
      cmp("free-trial", "Free trial", "factual", 1, "medium"),
      cmp("scheduling", "Job scheduling", "editorial", 2, "high", "job-scheduling"),
      cmp("dispatch", "Crew dispatch", "editorial", 3, "high", "crew-dispatch"),
      cmp("costing", "Job costing", "editorial", 4, "high", "job-costing"),
      cmp("appointments", "Appointment booking", "editorial", 5, "medium", "appointment-booking"),
      cmp("integrations", "Integrations", "editorial", 6, "medium"),
    ],
    pricingDimensions: [
      { id: "pd-fso-users", slug: "users", name: "Users / field workers", enginePrimitive: "per-seat", required: true },
      { id: "pd-fso-jobs", slug: "jobs", name: "Jobs / appointments", enginePrimitive: "usage", required: false },
      { id: "pd-fso-plans", slug: "plans", name: "Plan tiers", enginePrimitive: "flat", required: true },
    ],
    pricingCapability: "PARTIAL",
    pricingCapabilityNotes: [
      "Per-seat and flat plan primitives supported; category TCO calculator not built",
    ],
    recommendationDimensions: [
      { id: "rd-fso-job", slug: "primary-job", name: "Primary job (construction vs trades vs appointments)" },
      { id: "rd-fso-crews", slug: "crew-size", name: "Crew size and dispatch complexity" },
      { id: "rd-fso-mobile", slug: "mobile", name: "Mobile / offline field requirements" },
      { id: "rd-fso-budget", slug: "budget", name: "Budget" },
    ],
    finderReadiness: "NOT_READY",
    finderNotes: [
      "Defer generic finder — vertical-specific industry use-case pages first",
      "ServiceM8 affiliate URL pending — editorial anchor only",
    ],
    useCases: [
      { slug: "construction-management", name: "Construction management", pageEligibility: "content-candidate" },
      { slug: "trades-field-service", name: "Trades field service", pageEligibility: "content-candidate" },
      { slug: "appointment-scheduling", name: "Appointment scheduling", pageEligibility: "content-candidate" },
    ],
    audienceSlugs: ["operations", "small-business"],
    businessSizeSlugs: ["micro", "small-business", "mid-market"],
    businessTypeSlugs: ["trades", "construction", "local-services"],
    seedProductSlugs: ["contractor-foreman", "shore", "servicem8"],
    queryAliases: [
      "field service management software",
      "construction management software",
      "appointment scheduling software",
    ],
    requiredResearchDomains: ["identity", "pricing", "plans", "features", "integrations", "limits"],
    optionalResearchDomains: ["free-trial"],
    pricingModelsSupported: ["per-seat", "usage", "flat", "custom", "hybrid"],
    notes: [
      "Tier 2 nurture inventory — March 2027 hub launch",
      "Shore what-is ships Tier 7 CS Nov 2026 — not rescheduled here",
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
    id: `feat-fso-${slug}`,
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
    id: `crit-fso-${slug}`,
    slug,
    name,
    description,
    weight,
    evidenceRequirements,
    scoringScaleMin: 0,
    scoringScaleMax: 10,
    categorySlug: "field-service-operations",
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
    id: `cmp-fso-${slug}`,
    slug,
    name,
    kind,
    displayOrder,
    decisionImportance,
    ...(featureSlug ? { featureSlug } : {}),
  };
}
