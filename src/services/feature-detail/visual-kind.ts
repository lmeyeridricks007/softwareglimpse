/**
 * Feature visual taxonomy — shared by page model and UI diagrams.
 * Kept outside React components so services can import safely.
 */

export type FeatureVisualKind =
  | "contacts"
  | "leads"
  | "pipeline"
  | "deals"
  | "automation"
  | "sequences"
  | "email"
  | "calls"
  | "reporting"
  | "forecasting"
  | "analytics"
  | "integrations"
  | "fields"
  | "mobile"
  | "ai"
  | "permissions"
  | "sso"
  | "audit"
  | "default";

const SLUG_TO_KIND: Record<string, FeatureVisualKind> = {
  "contact-management": "contacts",
  "lead-management": "leads",
  "pipeline-management": "pipeline",
  "custom-pipelines": "pipeline",
  "multiple-pipelines": "pipeline",
  "deal-management": "deals",
  "workflow-automation": "automation",
  "sales-automation": "automation",
  "email-sequences": "sequences",
  "email-sync": "email",
  "email-tracking": "email",
  "call-functionality": "calls",
  calling: "calls",
  reporting: "reporting",
  "reporting-dashboards": "reporting",
  "custom-pipeline-stages": "pipeline",
  "lead-scoring": "leads",
  "api-access": "integrations",
  forecasting: "forecasting",
  analytics: "analytics",
  integrations: "integrations",
  "custom-fields": "fields",
  "mobile-app": "mobile",
  "ai-assistance": "ai",
  "role-permissions": "permissions",
  sso: "sso",
  "audit-logs": "audit",
};

export function featureVisualKindForSlug(slug: string): FeatureVisualKind {
  return SLUG_TO_KIND[slug] ?? "default";
}

export function featureHowItWorksCaption(
  featureName: string,
  kind: FeatureVisualKind,
): string {
  switch (kind) {
    case "contacts":
      return `How ${featureName.toLowerCase()} connects people, accounts, and activity into one shared record.`;
    case "leads":
      return `How enquiries become owned leads, then convert into contacts or opportunities.`;
    case "pipeline":
      return `How opportunities move through stages with ownership and next actions visible.`;
    case "deals":
      return `How deal value, stage, and close date sit on top of the pipeline record.`;
    case "automation":
      return `How a no-show demo can trigger a follow-up task for the owner — trigger, condition, and action in one scenario.`;
    case "sequences":
      return `How a multi-step outreach sequence progresses until a reply or exit rule.`;
    case "email":
      return `How CRM and mailbox stay linked so conversations appear on the record.`;
    case "calls":
      return `How call logging and follow-up attach to the same contact timeline.`;
    case "reporting":
      return `How activity and pipeline data roll up into team-visible reports.`;
    case "forecasting":
      return `How open opportunities roll into an expected outcome view by period.`;
    case "analytics":
      return `How trends across activity and conversion help spot process issues.`;
    case "integrations":
      return `How CRM exchanges data with the rest of the stack without re-typing.`;
    case "fields":
      return `How custom fields extend the standard contact/deal model for your process.`;
    case "mobile":
      return `How field teams capture notes and next steps away from the desk.`;
    case "ai":
      return `How AI suggestions assist drafting or summarizing — still reviewed by people.`;
    case "permissions":
      return `How roles limit who can see or change records and fields.`;
    case "sso":
      return `How company identity controls who can sign in to the CRM.`;
    case "audit":
      return `How changes and access events are retained for later review.`;
    default:
      return `Conceptual view of how ${featureName.toLowerCase()} works inside a CRM.`;
  }
}
