import { CategoryDefinitionSchema, type CategoryDefinition } from "@/domain";

/**
 * Helpdesk & Ticketing subcategory definition v1.0 — under parent customer-service.
 * Shared inbox, ticketing, SLA workflows, and knowledge base cluster.
 */
export const helpdeskTicketingDefinition: CategoryDefinition = CategoryDefinitionSchema.parse({
  id: "cat-def-helpdesk-ticketing-v1",
  slug: "helpdesk-ticketing",
  name: "Helpdesk & Ticketing",
  shortDescription:
    "Shared inbox, ticketing, SLA workflows, and knowledge base — distinct from live chat widgets and phone-only support.",
  parentSlug: "customer-service",
  aliases: [
    "helpdesk software",
    "ticketing software",
    "customer support platform",
    "shared inbox software",
    "service desk software",
  ],
  lifecycle: "active",
  configVersion: "1.0.0",
  scope: {
    definition:
      "Software whose primary job is helpdesk ticketing — shared inboxes, ticket workflows, SLA routing, knowledge bases, macros, and omnichannel agent workspaces — not website live chat widgets, phone-only VoIP, or CRM sales pipelines.",
    includes: [
      { id: "inc-ticketing", label: "Ticket workflows and case management" },
      { id: "inc-shared-inbox", label: "Shared team inbox for email and messaging" },
      { id: "inc-sla-routing", label: "SLA policies, routing rules, and escalations" },
      { id: "inc-knowledge-base", label: "Customer-facing knowledge base and self-service" },
      { id: "inc-omnichannel", label: "Omnichannel agent workspace (email, chat, social)" },
      { id: "inc-itsm", label: "IT service desk / ITSM when framed as ticketing core" },
    ],
    excludes: [
      {
        id: "exc-live-chat-only",
        label: "Website live chat widget as primary job",
        notes: "Tidio/LiveChat — parent CS live-chat cluster",
      },
      {
        id: "exc-phone-only",
        label: "Cloud phone / VoIP without helpdesk core",
        notes: "Freshcaller/Aircall — parent BC voice cluster",
      },
      {
        id: "exc-crm",
        label: "Primary CRM / sales pipeline systems",
        notes: "Prefer crm — helpdesk is secondary",
      },
      {
        id: "exc-reputation-only",
        label: "Review / reputation management without ticketing core",
        notes: "NiceJob — adjacent, not a helpdesk peer",
      },
    ],
    adjacentCategorySlugs: [
      "customer-service",
      "live-chat",
      "business-communications",
      "crm",
      "ecommerce",
    ],
    classificationNotes: [
      "Freshdesk is SMB helpdesk editorial anchor — not ITSM depth against Freshservice",
      "Freshservice is ITSM / internal service desk — distinct from customer helpdesk",
      "Zendesk Suite is omnichannel helpdesk — not CRM Sell primary",
      "Help Scout is email-first shared inbox — not enterprise ITSM peer",
      "Gorgias is ecommerce order-native helpdesk — distinct from generic SMB helpdesk",
      "Zoho Desk is Zoho-stack helpdesk — not standalone CRM primary",
      "Use parent CS finder default path — no dedicated subcategory finder UI",
      "Never rank SMB helpdesk, ITSM, ecommerce helpdesk, and email-first inboxes as one undifferentiated #1",
    ],
  },
  features: [
    feat(
      "ticketing",
      "Ticketing",
      "Ticket creation, assignment, status, and case workflows.",
      "core",
      true,
      true,
    ),
    feat(
      "shared-inbox",
      "Shared inbox",
      "Team inbox for email, chat, and messaging channels.",
      "core",
      true,
      true,
    ),
    feat(
      "sla-routing",
      "SLA & routing",
      "SLA policies, business rules, and escalations.",
      "core",
      true,
      true,
    ),
    feat(
      "knowledge-base",
      "Knowledge base",
      "Self-service articles, portals, and deflection.",
      "core",
      true,
      true,
    ),
    feat(
      "macros-automation",
      "Macros & automation",
      "Canned responses, triggers, and workflow automation.",
      "important",
      true,
      true,
    ),
    feat(
      "omnichannel-inbox",
      "Omnichannel inbox",
      "Email, chat, social, and messaging in one workspace.",
      "important",
      true,
      true,
    ),
    feat(
      "csat-surveys",
      "CSAT / satisfaction surveys",
      "Post-resolution satisfaction and feedback.",
      "important",
      true,
      true,
    ),
    feat(
      "helpdesk-integrations",
      "Helpdesk integrations",
      "CRM, ecommerce, and stack connectors.",
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
      notes: "Per-agent vs ticket-volume vs ITSM asset pricing",
    },
    { domain: "plans", level: "required", featureSlugs: [] },
    {
      domain: "features",
      level: "required",
      featureSlugs: ["ticketing", "shared-inbox"],
    },
    { domain: "integrations", level: "required", featureSlugs: [] },
    { domain: "limits", level: "required", featureSlugs: [] },
  ],
  editorialMethodology: {
    id: "methodology-helpdesk-ticketing-v1",
    slug: "helpdesk-ticketing-editorial",
    name: "Helpdesk & Ticketing Editorial Methodology",
    version: "1.0.0",
    categorySlug: "helpdesk-ticketing",
    description:
      "SoftwareGlimpse evaluates helpdesk and ticketing platforms on ease of use, helpdesk job fit, ticketing workflows, shared inbox, SLA routing, knowledge base, omnichannel depth, integrations, scalability, and value. Products are ranked within helpdesk job clusters only.",
    criteria: [
      crit("ease-of-use", "Ease of use", "Agent daily workflow and admin setup.", 12, 0, ["features:ticketing"]),
      crit("helpdesk-job-fit", "Helpdesk job fit", "Fit to SMB helpdesk vs ITSM vs ecommerce vs email-first.", 14, 1, ["features:ticketing", "features:shared-inbox"]),
      crit("ticketing-workflows", "Ticketing workflows", "Case management, statuses, and collaboration.", 12, 2, ["features:ticketing"]),
      crit("shared-inbox", "Shared inbox", "Email and messaging inbox depth.", 10, 3, ["features:shared-inbox"]),
      crit("sla-routing", "SLA & routing", "Policies, business rules, and escalations.", 10, 4, ["features:sla-routing"]),
      crit("knowledge-base", "Knowledge base", "Self-service articles and deflection.", 8, 5, ["features:knowledge-base"]),
      crit("omnichannel", "Omnichannel inbox", "Multi-channel agent workspace depth.", 8, 6, ["features:omnichannel-inbox"]),
      crit("integrations", "Integrations", "CRM, ecommerce, and stack connectors.", 10, 7, ["features:helpdesk-integrations"]),
      crit("scalability", "Scalability", "Agent limits, governance, and enterprise depth.", 8, 8, ["limits"]),
      crit("value-for-money", "Value for money", "Per-agent vs ticket-volume TCO.", 8, 9, ["pricing", "plans"]),
    ],
    notes: "Weights sum to 100. Score within helpdesk clusters. Affiliate economics excluded.",
  },
  comparisonCriteria: [
    cmp("starting-pricing", "Starting pricing", "factual", 0, "high"),
    cmp("pricing-unit", "Pricing unit (seat vs ticket)", "factual", 1, "high"),
    cmp("ticketing", "Ticketing", "editorial", 2, "high", "ticketing"),
    cmp("shared-inbox", "Shared inbox", "editorial", 3, "high", "shared-inbox"),
    cmp("sla-routing", "SLA & routing", "editorial", 4, "high", "sla-routing"),
    cmp("knowledge-base", "Knowledge base", "editorial", 5, "medium", "knowledge-base"),
    cmp("integrations", "Integrations", "editorial", 6, "medium"),
  ],
  pricingDimensions: [
    { id: "pd-hdt-seats", slug: "seats", name: "Agents / seats", enginePrimitive: "per-seat", required: true },
    { id: "pd-hdt-tickets", slug: "tickets", name: "Billable tickets / volume", enginePrimitive: "usage", required: true },
    { id: "pd-hdt-plans", slug: "plans", name: "Plan tiers", enginePrimitive: "flat", required: true },
  ],
  pricingCapability: "PARTIAL",
  pricingCapabilityNotes: [
    "Per-seat and ticket-volume primitives supported; category TCO calculator not built",
  ],
  recommendationDimensions: [
    { id: "rd-hdt-job", slug: "primary-job", name: "Primary job (helpdesk vs ITSM vs ecommerce)" },
    { id: "rd-hdt-team", slug: "team-size", name: "Agent count and pricing unit" },
    { id: "rd-hdt-stack", slug: "crm-stack", name: "CRM / ecommerce stack" },
    { id: "rd-hdt-budget", slug: "budget", name: "Budget" },
  ],
  finderReadiness: "NOT_READY",
  finderNotes: [
    "Use parent customer-service-finder default path — no dedicated subcategory finder UI",
    "Helpdesk job routing through parent CS finder dimensions",
  ],
  useCases: [
    { slug: "helpdesk-ticketing", name: "Helpdesk ticketing", pageEligibility: "content-candidate" },
    { slug: "knowledge-base-self-service", name: "Knowledge base & self-service", pageEligibility: "content-candidate" },
    { slug: "ecommerce-support", name: "Ecommerce support", pageEligibility: "content-candidate" },
    { slug: "itsm-service-desk", name: "IT service desk", pageEligibility: "content-candidate" },
  ],
  audienceSlugs: ["customer-success", "operations", "it"],
  businessSizeSlugs: ["micro", "small-business", "mid-market", "enterprise"],
  businessTypeSlugs: ["saas", "ecommerce", "agency", "startup"],
  seedProductSlugs: [
    "freshdesk",
    "zendesk-suite",
    "help-scout",
    "gorgias",
    "zoho-desk",
  ],
  queryAliases: [
    "helpdesk software",
    "ticketing software",
    "customer support platform",
    "shared inbox software",
  ],
  requiredResearchDomains: ["identity", "pricing", "plans", "features", "integrations", "limits"],
  optionalResearchDomains: ["free-trial"],
  pricingModelsSupported: ["per-seat", "usage", "flat", "credits", "hybrid"],
  notes: [
    "Tier 1 CS subcategory — helpdesk affiliate cluster",
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
    id: `feat-hdt-${slug}`,
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
    id: `crit-hdt-${slug}`,
    slug,
    name,
    description,
    weight,
    evidenceRequirements,
    scoringScaleMin: 0,
    scoringScaleMax: 10,
    categorySlug: "helpdesk-ticketing",
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
    id: `cmp-hdt-${slug}`,
    slug,
    name,
    kind,
    displayOrder,
    decisionImportance,
    ...(featureSlug ? { featureSlug } : {}),
  };
}
