/**
 * Plan Selector requirement catalog.
 * Only canonical feature slugs — never invent vendor-specific capabilities here.
 * UI filters to features present on the selected vendor’s featureSupport matrix.
 */

export type RequirementGroupId =
  | "sales-pipeline"
  | "automation"
  | "reporting"
  | "administration"
  | "integrations"
  | "ai"
  | "other";

export type PlanRequirementDef = {
  featureSlug: string;
  label: string;
  group: RequirementGroupId;
  /** Short “why we ask” copy — not a claim about a specific vendor. */
  whyWeAsk: string;
  /** Soft hint for usage follow-up when marked must-have. */
  usageHint?: "pipelines" | "workflows" | "sequences" | "custom-fields";
};

export const REQUIREMENT_GROUPS: Array<{
  id: RequirementGroupId;
  label: string;
}> = [
  { id: "sales-pipeline", label: "Sales pipeline" },
  { id: "automation", label: "Automation" },
  { id: "reporting", label: "Reporting" },
  { id: "administration", label: "Admin & security" },
  { id: "integrations", label: "Integrations" },
  { id: "ai", label: "AI" },
  { id: "other", label: "Other" },
];

export const PLAN_REQUIREMENTS: PlanRequirementDef[] = [
  {
    featureSlug: "contact-management",
    label: "Contact management",
    group: "sales-pipeline",
    whyWeAsk: "Baseline CRM capability — usually available on entry plans.",
  },
  {
    featureSlug: "lead-management",
    label: "Lead management",
    group: "sales-pipeline",
    whyWeAsk: "Capturing and qualifying leads often sits on lower tiers.",
  },
  {
    featureSlug: "pipeline-management",
    label: "Deal pipelines",
    group: "sales-pipeline",
    whyWeAsk: "Core pipeline tracking for sales teams.",
  },
  {
    featureSlug: "deal-management",
    label: "Deal management",
    group: "sales-pipeline",
    whyWeAsk: "Managing opportunities through stages.",
  },
  {
    featureSlug: "custom-pipelines",
    label: "Multiple / custom pipelines",
    group: "sales-pipeline",
    whyWeAsk: "Multiple pipelines can be plan-gated or limited.",
    usageHint: "pipelines",
  },
  {
    featureSlug: "custom-fields",
    label: "Custom fields",
    group: "sales-pipeline",
    whyWeAsk: "Custom properties are often limited on cheaper plans.",
    usageHint: "custom-fields",
  },
  {
    featureSlug: "email-sync",
    label: "Email sync",
    group: "sales-pipeline",
    whyWeAsk: "Two-way email sync is a common mid-tier differentiator.",
  },
  {
    featureSlug: "email-tracking",
    label: "Email tracking",
    group: "sales-pipeline",
    whyWeAsk: "Open/click tracking may sit above free tiers.",
  },
  {
    featureSlug: "email-sequences",
    label: "Email sequences",
    group: "automation",
    whyWeAsk: "Sequences frequently force a paid upgrade.",
    usageHint: "sequences",
  },
  {
    featureSlug: "workflow-automation",
    label: "Workflow automation",
    group: "automation",
    whyWeAsk: "Automation depth and volume often define plan tiers.",
    usageHint: "workflows",
  },
  {
    featureSlug: "sales-automation",
    label: "Sales automation",
    group: "automation",
    whyWeAsk: "Broader sales automation suites are usually paid.",
  },
  {
    featureSlug: "lead-scoring",
    label: "Lead scoring",
    group: "automation",
    whyWeAsk: "Scoring is commonly Professional/Premium+.",
  },
  {
    featureSlug: "reporting",
    label: "Standard reporting",
    group: "reporting",
    whyWeAsk: "Basic dashboards vs custom reporting differ by plan.",
  },
  {
    featureSlug: "forecasting",
    label: "Sales forecasting",
    group: "reporting",
    whyWeAsk: "Forecasting is a frequent Professional+ gate.",
  },
  {
    featureSlug: "role-permissions",
    label: "Advanced role / field permissions",
    group: "administration",
    whyWeAsk: "Fine-grained permissions often require Enterprise.",
  },
  {
    featureSlug: "sso",
    label: "Single sign-on (SSO)",
    group: "administration",
    whyWeAsk: "SSO is a common hard Enterprise gate.",
  },
  {
    featureSlug: "audit-logs",
    label: "Audit logs",
    group: "administration",
    whyWeAsk: "Audit logging is typically Enterprise-only when published.",
  },
  {
    featureSlug: "api-access",
    label: "API access",
    group: "integrations",
    whyWeAsk: "API access and rate limits vary by plan.",
  },
  {
    featureSlug: "integrations",
    label: "Standard integrations",
    group: "integrations",
    whyWeAsk: "Marketplace / native connectors may differ by tier.",
  },
  {
    featureSlug: "ai-assistance",
    label: "AI assistance",
    group: "ai",
    whyWeAsk: "Only shown when vendor research verifies AI plan coverage.",
  },
  {
    featureSlug: "mobile-app",
    label: "Mobile app",
    group: "other",
    whyWeAsk: "Mobile access is usually broad, but confirm for your CRM.",
  },
  {
    featureSlug: "call-functionality",
    label: "Calling",
    group: "other",
    whyWeAsk: "Built-in calling can be plan- or add-on-gated.",
  },
  {
    featureSlug: "meeting-scheduling",
    label: "Meeting scheduling",
    group: "other",
    whyWeAsk: "Scheduling tools may be limited on entry plans.",
  },
];

export function requirementLabel(featureSlug: string): string {
  return (
    PLAN_REQUIREMENTS.find((r) => r.featureSlug === featureSlug)?.label ??
    featureSlug
  );
}
