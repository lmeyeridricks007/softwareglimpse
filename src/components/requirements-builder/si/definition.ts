import { SI_DECISION_PROFILE_STORAGE_KEY } from "@/domain";
import type { RequirementsBuilderDefinition } from "../framework/types";

export const siRequirementsBuilderDefinition: RequirementsBuilderDefinition = {
  id: "sales-intelligence-requirements-builder",
  categorySlug: "sales-intelligence",
  storageKey: SI_DECISION_PROFILE_STORAGE_KEY,
  title: "Sales Intelligence Requirements Builder",
  productNoun: "sales intelligence",
  estimatedMinutes: "8–12 minutes",
  methodologyHref: "/company/editorial-methodology/",
  finderHref: "/tools/sales-intelligence-finder/?from=requirements",
  calculatorHref: "/tools/sales-intelligence-cost-calculator/?from=requirements",
  compareHref: "/compare/",
  scorecardHref: "/tools/sales-intelligence-vendor-scorecard/",
  stages: [
    { id: "business", label: "Business", shortLabel: "Business" },
    { id: "use-cases", label: "Use cases", shortLabel: "Use cases" },
    { id: "capabilities", label: "Capabilities", shortLabel: "Capabilities" },
    { id: "requirements", label: "Requirements", shortLabel: "Requirements" },
    { id: "features", label: "Features", shortLabel: "Features" },
    { id: "integrations", label: "Integrations", shortLabel: "Integrations" },
    { id: "security", label: "Compliance", shortLabel: "Compliance" },
    { id: "budget", label: "Budget & setup", shortLabel: "Budget" },
    { id: "prioritize", label: "Prioritize", shortLabel: "Prioritize" },
    { id: "results", label: "Results", shortLabel: "Results" },
  ],
};

export const SI_TEAM_OPTIONS = [
  { value: "sdr-bdr", label: "SDR / BDR" },
  { value: "outbound-sales", label: "Outbound sales" },
  { value: "revops", label: "RevOps / Sales ops" },
  { value: "demand-gen", label: "Demand gen" },
  { value: "marketing", label: "Marketing" },
  { value: "other", label: "Other" },
] as const;

export const SI_CURRENT_STATE_OPTIONS = [
  {
    value: "no-crm",
    label: "No SI tool",
    description: "Starting from scratch",
  },
  {
    value: "spreadsheet",
    label: "Spreadsheet / Manual",
    description: "Lists in sheets or LinkedIn",
  },
  {
    value: "existing-crm",
    label: "Existing SI tool",
    description: "Replacing or extending one",
  },
  {
    value: "multiple-tools",
    label: "Multiple Tools",
    description: "Disconnected data + outreach today",
  },
] as const;

export const SI_SECURITY_REQUIREMENT_SLUGS = [
  "gdpr-compliance-posture",
  "credit-transparency",
  "export-rights",
] as const;

export const SI_INTEGRATION_OPTIONS = [
  { value: "salesforce", label: "Salesforce" },
  { value: "hubspot", label: "HubSpot" },
  { value: "pipedrive", label: "Pipedrive" },
  { value: "gmail", label: "Gmail" },
  { value: "outlook", label: "Outlook" },
  { value: "microsoft-365", label: "Microsoft 365" },
  { value: "google-workspace", label: "Google Workspace" },
  { value: "slack", label: "Slack" },
  { value: "zapier", label: "Zapier" },
] as const;

export {
  ADMIN_COMPLEXITY_OPTIONS,
  MIGRATION_COMPLEXITY_OPTIONS,
  INDUSTRY_OPTIONS,
  PRIORITY_LABELS,
} from "../crm/definition";
