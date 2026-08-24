import { CategoryDefinitionSchema, type CategoryDefinition } from "@/domain";

/**
 * ITSM subcategory definition v1.0 — under parent it-development.
 * Internal service desk, incident management, and ITIL workflow cluster.
 */
export const itsmDefinition: CategoryDefinition = CategoryDefinitionSchema.parse({
  id: "cat-def-itsm-v1",
  slug: "itsm",
  name: "ITSM",
  shortDescription:
    "Internal service desk, incident management, and ITIL workflows — distinct from customer-facing helpdesk and observability suites.",
  parentSlug: "it-development",
  aliases: [
    "ITSM software",
    "IT service management",
    "IT service desk software",
    "internal service desk",
    "ITIL software",
  ],
  lifecycle: "active",
  configVersion: "1.0.0",
  scope: {
    definition:
      "Software whose primary job is IT service management — internal employee service desks, incident management, change/problem workflows, service catalogs, and ITIL-aligned operations — not customer-facing helpdesk ticketing, observability monitoring, source control, or hosting panels.",
    includes: [
      { id: "inc-incident-mgmt", label: "Incident management and IT ticket workflows" },
      { id: "inc-change-problem", label: "Change, problem, and release management" },
      { id: "inc-service-catalog", label: "Employee-facing service request catalog" },
      { id: "inc-asset-cmdb", label: "Asset management and CMDB when ITSM-native" },
      { id: "inc-internal-sla", label: "Internal SLA policies and escalations" },
    ],
    excludes: [
      {
        id: "exc-customer-helpdesk",
        label: "Customer-facing helpdesk ticketing as primary job",
        notes: "Freshdesk/Zendesk — parent CS helpdesk cluster",
      },
      {
        id: "exc-observability",
        label: "Infrastructure monitoring / observability suites",
        notes: "Datadog — parent IT observability cluster",
      },
      {
        id: "exc-pm",
        label: "Project management without ITSM core",
        notes: "Jira Software — parent project-management primary",
      },
      {
        id: "exc-oncall-only",
        label: "On-call paging without ITSM ticketing core",
        notes: "PagerDuty — parent IT incident-oncall cluster",
      },
    ],
    adjacentCategorySlugs: [
      "it-development",
      "customer-service",
      "helpdesk-ticketing",
      "project-management",
    ],
    classificationNotes: [
      "Freshservice is ITSM primary — distinct from Freshdesk customer helpdesk",
      "ServiceNow and Jira Service Management are enterprise ITSM peers — not SMB helpdesk",
      "ManageEngine ServiceDesk Plus, SysAid, HaloITSM, and TOPdesk are ITSM landscape peers",
      "Scope note: customer-facing vs internal ITSM — Freshservice straddles CS and IT buyer jobs",
      "Use parent IT finder — scope internal vs customer-facing ITSM — no dedicated subcategory finder",
      "Defer — need 3+ ITSM-native peers before indexable hub",
      "Never rank SMB ITSM, enterprise ITSM, and customer helpdesks as one undifferentiated #1",
    ],
  },
  features: [
    feat(
      "incident-management",
      "Incident management",
      "Ticket intake, triage, resolution, and incident records for IT teams.",
      "core",
      true,
      true,
    ),
    feat(
      "change-problem",
      "Change & problem management",
      "ITIL-style change, problem, and release workflows.",
      "core",
      true,
      true,
    ),
    feat(
      "service-catalog",
      "Service catalog",
      "Employee-facing service request catalog and fulfilment.",
      "core",
      true,
      true,
    ),
    feat(
      "asset-cmdb",
      "Asset management / CMDB",
      "IT asset inventory and configuration management.",
      "important",
      true,
      true,
    ),
    feat(
      "itsm-ai",
      "ITSM AI assistance",
      "AI copilots for agents, routing, and knowledge deflection.",
      "important",
      true,
      true,
    ),
    feat(
      "enterprise-security",
      "Enterprise security & SSO",
      "SSO, SCIM, audit logs, and compliance controls.",
      "important",
      true,
      true,
    ),
    feat(
      "analytics-reporting",
      "Analytics & reporting",
      "SLA, XLAs, and operational ITSM dashboards.",
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
      notes: "Per-agent / per-technician + asset or IT user pricing",
    },
    { domain: "plans", level: "required", featureSlugs: [] },
    {
      domain: "features",
      level: "required",
      featureSlugs: ["incident-management", "change-problem"],
    },
    { domain: "integrations", level: "required", featureSlugs: [] },
    { domain: "limits", level: "required", featureSlugs: [] },
  ],
  editorialMethodology: {
    id: "methodology-itsm-v1",
    slug: "itsm-editorial",
    name: "ITSM Editorial Methodology",
    version: "1.0.0",
    categorySlug: "itsm",
    description:
      "SoftwareGlimpse evaluates ITSM platforms on ease of use, ITSM job fit, incident management, change/problem workflows, service catalog, admin/security, integrations, scalability, and value. Products are ranked within ITSM job clusters only.",
    criteria: [
      crit("ease-of-use", "Ease of use", "Agent and admin daily workflow.", 12, 0, ["features:incident-management"]),
      crit("itsm-job-fit", "ITSM job fit", "Fit to SMB ITSM vs enterprise vs customer-facing hybrid.", 14, 1, ["features:incident-management", "features:service-catalog"]),
      crit("incident-management", "Incident management", "Ticket intake, triage, and resolution depth.", 12, 2, ["features:incident-management"]),
      crit("change-problem", "Change & problem", "ITIL change, problem, and release workflows.", 10, 3, ["features:change-problem"]),
      crit("service-catalog", "Service catalog", "Employee request catalog and fulfilment.", 10, 4, ["features:service-catalog"]),
      crit("internal-vs-customer", "Internal vs customer scope", "Clarity of internal ITSM vs customer-facing overlap.", 10, 5, ["features:incident-management"]),
      crit("integrations", "Integrations", "Cloud, chat, identity, and ecosystem depth.", 8, 6, ["integrations"]),
      crit("admin-security", "Admin & security", "SSO/SCIM, RBAC, and compliance posture.", 8, 7, ["features:enterprise-security"]),
      crit("scalability", "Scalability", "Agent scaling and enterprise packaging.", 8, 8, ["limits"]),
      crit("value-for-money", "Value for money", "Per-agent TCO vs module stacking.", 8, 9, ["pricing", "plans"]),
    ],
    notes: "Weights sum to 100. Score within ITSM clusters. Affiliate economics excluded.",
  },
  comparisonCriteria: [
    cmp("starting-pricing", "Starting pricing", "factual", 0, "high"),
    cmp("pricing-unit", "Pricing unit (agent vs IT user)", "factual", 1, "high"),
    cmp("incident-management", "Incident management", "editorial", 2, "high", "incident-management"),
    cmp("change-problem", "Change & problem", "editorial", 3, "high", "change-problem"),
    cmp("service-catalog", "Service catalog", "editorial", 4, "high", "service-catalog"),
    cmp("security", "Security & admin", "editorial", 5, "medium", "enterprise-security"),
  ],
  pricingDimensions: [
    { id: "pd-itsm-agents", slug: "agents", name: "Agents / technicians", enginePrimitive: "per-seat", required: true },
    { id: "pd-itsm-it-users", slug: "it-users", name: "IT users / assets", enginePrimitive: "usage", required: false },
    { id: "pd-itsm-plans", slug: "plans", name: "Plan tiers", enginePrimitive: "flat", required: true },
  ],
  pricingCapability: "PARTIAL",
  pricingCapabilityNotes: [
    "Per-agent and IT-user primitives supported; category TCO calculator not built",
  ],
  recommendationDimensions: [
    { id: "rd-itsm-job", slug: "primary-job", name: "Primary job (internal ITSM vs customer-facing hybrid)" },
    { id: "rd-itsm-team", slug: "team-size", name: "IT team size and agent count" },
    { id: "rd-itsm-itil", slug: "itil-depth", name: "ITIL workflow depth need" },
    { id: "rd-itsm-stack", slug: "existing-stack", name: "Existing cloud / dev stack" },
    { id: "rd-itsm-budget", slug: "budget", name: "Budget" },
  ],
  finderReadiness: "NOT_READY",
  finderNotes: [
    "Use parent it-development-finder — scope customer-facing vs internal ITSM — no dedicated subcategory finder UI",
    "ITSM job routing through parent IT finder dimensions",
  ],
  useCases: [
    { slug: "itsm-service-desk", name: "ITSM / service desk", pageEligibility: "content-candidate" },
  ],
  audienceSlugs: ["operations", "it"],
  businessSizeSlugs: ["small-business", "mid-market", "enterprise"],
  businessTypeSlugs: ["saas", "agency", "startup", "professional-services"],
  seedProductSlugs: ["freshservice"],
  queryAliases: [
    "ITSM software",
    "IT service management",
    "IT service desk software",
    "internal service desk",
  ],
  requiredResearchDomains: ["identity", "pricing", "plans", "features", "integrations", "limits"],
  optionalResearchDomains: ["free-trial", "ai-capabilities", "security-compliance"],
  pricingModelsSupported: ["per-seat", "usage", "flat", "custom", "hybrid"],
  notes: [
    "Tier 2 IT subcategory — August 2027 launch scheduled",
    "Defer — need 3+ ITSM-native peers before indexable hub",
    "~4200 affiliate revenue units in expansion audit",
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
    id: `feat-itsm-${slug}`,
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
    id: `crit-itsm-${slug}`,
    slug,
    name,
    description,
    weight,
    evidenceRequirements,
    scoringScaleMin: 0,
    scoringScaleMax: 10,
    categorySlug: "itsm",
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
    id: `cmp-itsm-${slug}`,
    slug,
    name,
    kind,
    displayOrder,
    decisionImportance,
    ...(featureSlug ? { featureSlug } : {}),
  };
}
