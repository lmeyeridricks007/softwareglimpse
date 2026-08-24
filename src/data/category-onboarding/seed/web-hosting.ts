import { CategoryDefinitionSchema, type CategoryDefinition } from "@/domain";

/**
 * Web Hosting subcategory definition v1.0 — under parent it-development.
 * Hosting control panels, server administration, and web operations cluster.
 */
export const webHostingDefinition: CategoryDefinition = CategoryDefinitionSchema.parse({
  id: "cat-def-web-hosting-v1",
  slug: "web-hosting",
  name: "Web Hosting",
  shortDescription:
    "Hosting control panels, server administration, and web operations — distinct from managed hosting providers and cloud PaaS.",
  parentSlug: "it-development",
  aliases: [
    "web hosting software",
    "hosting control panel",
    "server management software",
    "web hosting panel",
    "hosting operations",
  ],
  lifecycle: "active",
  configVersion: "1.0.0",
  scope: {
    definition:
      "Software whose primary job is hosting control panels and server administration — domain, website, email, and server management for web hosts and ops teams — not managed WordPress hosting providers, cloud PaaS app platforms, observability suites, or ITSM service desks.",
    includes: [
      { id: "inc-hosting-panel", label: "Hosting / server control panels" },
      { id: "inc-server-admin", label: "Server, domain, and website administration" },
      { id: "inc-email-hosting", label: "Email hosting and mailbox management on servers" },
      { id: "inc-ssl-security", label: "SSL, security hardening, and backup on panels" },
    ],
    excludes: [
      {
        id: "exc-managed-hosting",
        label: "Managed cloud / WordPress hosting providers",
        notes: "WP Engine/Cloudways — parent IT hosting-providers cluster",
      },
      {
        id: "exc-cloud-paas",
        label: "Cloud PaaS / git-push app platforms",
        notes: "Render/Railway — parent IT cloud-paas cluster",
      },
      {
        id: "exc-observability",
        label: "Infrastructure monitoring / observability suites",
        notes: "Datadog — parent IT observability cluster",
      },
      {
        id: "exc-itsm",
        label: "ITSM / service desk platforms",
        notes: "Freshservice — parent IT ITSM cluster",
      },
    ],
    adjacentCategorySlugs: ["it-development", "website-digital-presence", "ecommerce"],
    classificationNotes: [
      "Plesk is hosting-panel primary — per-server licence, not per developer seat",
      "cPanel and DirectAdmin are hosting-panel peers with Plesk — per-server licence",
      "Cloudways, WP Engine, and Kinsta are hosting-providers primary — not panel peers",
      "Render, Fly.io, and Railway are cloud-paas primary — not hosting-panel peers",
      "Use parent IT finder with hosting constraint — no dedicated subcategory finder",
      "Single SKU — expand inventory before indexable hub",
      "Never rank hosting panels, managed hosts, and cloud PaaS as one undifferentiated #1",
    ],
  },
  features: [
    feat(
      "hosting-panel",
      "Hosting control panel",
      "Server, domain, and website administration for web hosts.",
      "core",
      true,
      true,
    ),
    feat(
      "server-admin",
      "Server administration",
      "OS-level server management, updates, and resource allocation.",
      "core",
      true,
      true,
    ),
    feat(
      "domain-ssl",
      "Domain & SSL management",
      "Domain DNS, SSL certificates, and site provisioning.",
      "core",
      true,
      true,
    ),
    feat(
      "email-hosting",
      "Email hosting",
      "Mailbox creation and email server administration.",
      "important",
      true,
      true,
    ),
    feat(
      "backup-restore",
      "Backup & restore",
      "Automated backups, snapshots, and disaster recovery.",
      "important",
      true,
      true,
    ),
    feat(
      "enterprise-security",
      "Enterprise security & SSO",
      "SSO, RBAC, audit logs, and hardening controls.",
      "important",
      true,
      true,
    ),
    feat(
      "analytics-reporting",
      "Analytics & reporting",
      "Server usage, uptime, and resource dashboards.",
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
      notes: "Per-server licence floors and edition tiers",
    },
    { domain: "plans", level: "required", featureSlugs: [] },
    {
      domain: "features",
      level: "required",
      featureSlugs: ["hosting-panel", "server-admin"],
    },
    { domain: "integrations", level: "required", featureSlugs: [] },
    { domain: "limits", level: "required", featureSlugs: [] },
  ],
  editorialMethodology: {
    id: "methodology-web-hosting-v1",
    slug: "web-hosting-editorial",
    name: "Web Hosting Editorial Methodology",
    version: "1.0.0",
    categorySlug: "web-hosting",
    description:
      "SoftwareGlimpse evaluates web hosting platforms on ease of use, hosting job fit, panel depth, server administration, domain/SSL, security, integrations, scalability, and value. Products are ranked within hosting-panel job clusters only.",
    criteria: [
      crit("ease-of-use", "Ease of use", "Admin setup and daily ops workflow.", 12, 0, ["features:hosting-panel"]),
      crit("hosting-job-fit", "Hosting job fit", "Fit to panel vs managed host vs cloud PaaS.", 14, 1, ["features:hosting-panel", "features:server-admin"]),
      crit("panel-depth", "Panel depth", "Website, domain, and email admin workflows.", 12, 2, ["features:hosting-panel"]),
      crit("server-admin", "Server administration", "OS management, updates, and resources.", 10, 3, ["features:server-admin"]),
      crit("domain-ssl", "Domain & SSL", "DNS, certificates, and provisioning.", 10, 4, ["features:domain-ssl"]),
      crit("security-admin", "Security & admin", "Hardening, RBAC, and audit controls.", 8, 5, ["features:enterprise-security"]),
      crit("integrations", "Integrations", "Cloud, billing, and ecosystem connectors.", 8, 6, ["integrations"]),
      crit("scalability", "Scalability", "Server count, multi-tenant, and governance.", 8, 7, ["limits"]),
      crit("value-for-money", "Value for money", "Per-server licence TCO.", 10, 8, ["pricing", "plans"]),
      crit("reliability", "Reliability", "Backup, uptime, and support posture.", 8, 9, ["features:backup-restore"]),
    ],
    notes: "Weights sum to 100. Score within hosting-panel clusters. Affiliate economics excluded.",
  },
  comparisonCriteria: [
    cmp("starting-pricing", "Starting pricing", "factual", 0, "high"),
    cmp("pricing-unit", "Pricing unit (per server)", "factual", 1, "high"),
    cmp("hosting-panel", "Hosting control panel", "editorial", 2, "high", "hosting-panel"),
    cmp("server-admin", "Server administration", "editorial", 3, "high", "server-admin"),
    cmp("domain-ssl", "Domain & SSL", "editorial", 4, "high", "domain-ssl"),
    cmp("security", "Security & admin", "editorial", 5, "medium", "enterprise-security"),
  ],
  pricingDimensions: [
    { id: "pd-wh-servers", slug: "servers", name: "Servers / licences", enginePrimitive: "usage", unitHint: "server", required: true },
    { id: "pd-wh-plans", slug: "plans", name: "Plan tiers / editions", enginePrimitive: "flat", required: true },
  ],
  pricingCapability: "PARTIAL",
  pricingCapabilityNotes: [
    "Per-server licence primitives supported; category TCO calculator not built",
  ],
  recommendationDimensions: [
    { id: "rd-wh-job", slug: "primary-job", name: "Primary job (panel vs managed host vs PaaS)" },
    { id: "rd-wh-servers", slug: "server-count", name: "Server count and hosting model" },
    { id: "rd-wh-stack", slug: "existing-stack", name: "Existing cloud / dev stack" },
    { id: "rd-wh-budget", slug: "budget", name: "Budget" },
  ],
  finderReadiness: "NOT_READY",
  finderNotes: [
    "Use parent it-development-finder with hosting constraint — no dedicated subcategory finder UI",
    "Hosting job routing through parent IT finder dimensions",
  ],
  useCases: [
    { slug: "hosting-operations", name: "Hosting operations", pageEligibility: "content-candidate" },
  ],
  audienceSlugs: ["operations", "founders"],
  businessSizeSlugs: ["micro", "small-business", "mid-market", "enterprise"],
  businessTypeSlugs: ["agency", "saas", "startup", "professional-services"],
  seedProductSlugs: ["plesk"],
  queryAliases: [
    "web hosting software",
    "hosting control panel",
    "server management software",
    "hosting operations",
  ],
  requiredResearchDomains: ["identity", "pricing", "plans", "features", "integrations", "limits"],
  optionalResearchDomains: ["free-trial", "security-compliance"],
  pricingModelsSupported: ["flat", "usage", "custom", "hybrid"],
  notes: [
    "Tier 2 IT subcategory — August 2027 launch scheduled",
    "Single SKU — defer expand inventory before indexable hub",
    "~2400 affiliate revenue units in expansion audit",
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
    id: `feat-wh-${slug}`,
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
    id: `crit-wh-${slug}`,
    slug,
    name,
    description,
    weight,
    evidenceRequirements,
    scoringScaleMin: 0,
    scoringScaleMax: 10,
    categorySlug: "web-hosting",
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
    id: `cmp-wh-${slug}`,
    slug,
    name,
    kind,
    displayOrder,
    decisionImportance,
    ...(featureSlug ? { featureSlug } : {}),
  };
}
