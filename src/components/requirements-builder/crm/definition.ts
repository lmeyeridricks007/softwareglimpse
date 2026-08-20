import { CRM_DECISION_PROFILE_STORAGE_KEY } from "@/domain";
import type { RequirementsBuilderDefinition } from "../framework/types";

export const crmRequirementsBuilderDefinition: RequirementsBuilderDefinition = {
  id: "crm-requirements-builder",
  categorySlug: "crm",
  storageKey: CRM_DECISION_PROFILE_STORAGE_KEY,
  title: "CRM Requirements Builder",
  productNoun: "CRM",
  estimatedMinutes: "8–12 minutes",
  methodologyHref: "/company/editorial-methodology/",
  finderHref: "/tools/crm-finder/?from=requirements",
  calculatorHref: "/tools/crm-cost-calculator/?from=requirements",
  compareHref: "/compare/",
  scorecardHref: "/tools/crm-vendor-scorecard/",
  stages: [
    { id: "business", label: "Business", shortLabel: "Business" },
    { id: "use-cases", label: "Use cases", shortLabel: "Use cases" },
    { id: "capabilities", label: "Capabilities", shortLabel: "Capabilities" },
    { id: "requirements", label: "Requirements", shortLabel: "Requirements" },
    { id: "features", label: "Features", shortLabel: "Features" },
    { id: "integrations", label: "Integrations", shortLabel: "Integrations" },
    { id: "security", label: "Security", shortLabel: "Security" },
    { id: "budget", label: "Budget & setup", shortLabel: "Budget" },
    { id: "prioritize", label: "Prioritize", shortLabel: "Prioritize" },
    { id: "results", label: "Results", shortLabel: "Results" },
  ],
};

export const TEAM_OPTIONS = [
  { value: "sales", label: "Sales" },
  { value: "account-management", label: "Account Management" },
  { value: "customer-success", label: "Customer Success" },
  { value: "marketing", label: "Marketing" },
  { value: "operations", label: "Operations" },
  { value: "other", label: "Other" },
] as const;

export const CURRENT_STATE_OPTIONS = [
  {
    value: "no-crm",
    label: "No CRM",
    description: "Starting from scratch",
  },
  {
    value: "spreadsheet",
    label: "Spreadsheet / Manual",
    description: "Tracking in sheets or email",
  },
  {
    value: "existing-crm",
    label: "Existing CRM",
    description: "Replacing or extending one",
  },
  {
    value: "multiple-tools",
    label: "Multiple Tools",
    description: "Disconnected systems today",
  },
] as const;

export const ADMIN_COMPLEXITY_OPTIONS = [
  { value: "simple", label: "Simple", description: "Minimal admin burden" },
  {
    value: "moderate",
    label: "Moderate",
    description: "Some configuration is fine",
  },
  {
    value: "advanced",
    label: "Advanced",
    description: "Willing to invest in admin depth",
  },
  {
    value: "doesnt-matter",
    label: "Doesn't matter",
    description: "Not a deciding factor",
  },
] as const;

export const MIGRATION_COMPLEXITY_OPTIONS = [
  { value: "none", label: "None" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
] as const;

export const SECURITY_REQUIREMENT_SLUGS = [
  "support-sso",
  "restrict-access-by-team",
  "audit-user-activity",
] as const;

export const INDUSTRY_OPTIONS = [
  { value: "small-business", label: "Small business" },
  { value: "retail-ecommerce", label: "Retail & e-commerce" },
  { value: "healthcare", label: "Healthcare" },
  { value: "financial-services", label: "Financial services" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "real-estate", label: "Real estate" },
  { value: "education", label: "Education" },
  { value: "saas", label: "SaaS" },
  { value: "nonprofit", label: "Non-profit" },
  { value: "hospitality", label: "Hospitality" },
  { value: "transportation-logistics", label: "Transportation & logistics" },
  { value: "legal-services", label: "Legal services" },
  { value: "construction", label: "Construction" },
] as const;

export const PRIORITY_LABELS: Record<string, string> = {
  "must-have": "Must have",
  important: "Important",
  "nice-to-have": "Nice to have",
  "not-needed": "Not needed",
  primary: "Primary",
  relevant: "Relevant",
  critical: "Critical",
  high: "High",
  optional: "Optional",
  required: "Required",
  preferred: "Preferred",
};
