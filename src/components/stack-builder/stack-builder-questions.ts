import type { LucideIcon } from "lucide-react";
import {
  Building2,
  Factory,
  Handshake,
  HeartHandshake,
  Laptop,
  ShoppingCart,
  Store,
  User,
  Users,
  Wallet,
  Workflow,
  Zap,
} from "lucide-react";

export const STACK_BUILDER_STAGES = [
  { id: "business", label: "Business Profile" },
  { id: "goals", label: "Goals" },
  { id: "requirements", label: "Requirements" },
  { id: "preferences", label: "Preferences" },
  { id: "results", label: "Results" },
] as const;

export type StackStageId = (typeof STACK_BUILDER_STAGES)[number]["id"];

export type StackOption = {
  value: string;
  label: string;
  description?: string;
  icon?: LucideIcon;
};

export const COMPANY_SIZE_OPTIONS: StackOption[] = [
  {
    value: "solo",
    label: "Solo / Freelancer",
    description: "Just you (or a tiny team)",
    icon: User,
  },
  {
    value: "small-business",
    label: "Small business",
    description: "About 2–50 people",
    icon: Store,
  },
  {
    value: "growing",
    label: "Growing business",
    description: "About 51–200 people",
    icon: Building2,
  },
  {
    value: "enterprise",
    label: "Enterprise",
    description: "200+ people",
    icon: Factory,
  },
];

export const BUSINESS_TYPE_OPTIONS: StackOption[] = [
  {
    value: "ecommerce",
    label: "E-commerce",
    description: "Sell products online",
    icon: ShoppingCart,
  },
  {
    value: "b2b-services",
    label: "B2B services",
    description: "Agency, consulting, or services",
    icon: Handshake,
  },
  {
    value: "saas",
    label: "SaaS / Tech",
    description: "Software or tech product company",
    icon: Laptop,
  },
  {
    value: "nonprofit",
    label: "Non-profit",
    description: "Mission-driven organization",
    icon: HeartHandshake,
  },
];

export const GOAL_OPTIONS: StackOption[] = [
  {
    value: "grow-pipeline",
    label: "Grow sales pipeline",
    description: "More qualified opportunities",
    icon: Zap,
  },
  {
    value: "retain-customers",
    label: "Retain customers",
    description: "Support and success workflows",
    icon: HeartHandshake,
  },
  {
    value: "run-operations",
    label: "Run operations",
    description: "Projects, finance, and delivery",
    icon: Workflow,
  },
  {
    value: "market-better",
    label: "Market better",
    description: "Email, campaigns, and attribution",
    icon: Users,
  },
];

export const REQUIREMENT_OPTIONS: StackOption[] = [
  { value: "crm", label: "CRM / customer management" },
  {
    value: "sales-intelligence",
    label: "Sales intelligence / prospecting",
  },
  { value: "email-marketing", label: "Email marketing" },
  { value: "project-management", label: "Project management" },
  { value: "help-desk", label: "Help desk / support" },
  { value: "accounting", label: "Accounting / finance" },
  { value: "analytics", label: "Analytics / reporting" },
];

export const BUDGET_OPTIONS: StackOption[] = [
  {
    value: "lean",
    label: "Lean budget",
    description: "Prefer free or low-cost plans first",
    icon: Wallet,
  },
  {
    value: "balanced",
    label: "Balanced",
    description: "Pay for fit when value is clear",
    icon: Building2,
  },
  {
    value: "invest",
    label: "Ready to invest",
    description: "Prioritize capability over lowest price",
    icon: Factory,
  },
];

export const EASE_OPTIONS: StackOption[] = [
  {
    value: "simple",
    label: "Keep it simple",
    description: "Fast setup, lighter admin",
  },
  {
    value: "balanced",
    label: "Balanced depth",
    description: "Useful power without extreme complexity",
  },
  {
    value: "powerful",
    label: "Maximum control",
    description: "Deep configuration is fine",
  },
];

export type StackCategoryPreview = {
  id: string;
  title: string;
  description: string;
  group: "all" | "customer" | "marketing" | "operations" | "finance";
  availableHref?: string;
  availableLabel?: string;
};

export const STACK_CATEGORY_PREVIEWS: StackCategoryPreview[] = [
  {
    id: "crm",
    title: "CRM",
    description: "Contacts, pipeline, and customer history",
    group: "customer",
    availableHref: "/tools/crm-finder/",
    availableLabel: "Open CRM Finder",
  },
  {
    id: "sales-intelligence",
    title: "Sales intelligence",
    description: "Contact data, enrichment, and outbound prospecting",
    group: "customer",
    availableHref: "/tools/sales-intelligence-finder/",
    availableLabel: "Open Sales Intelligence Finder",
  },
  {
    id: "email-marketing",
    title: "Email marketing",
    description: "Campaigns, lists, and automations",
    group: "marketing",
  },
  {
    id: "project-management",
    title: "Project management",
    description: "Tasks, delivery, and collaboration",
    group: "operations",
  },
  {
    id: "help-desk",
    title: "Help desk",
    description: "Tickets and customer support",
    group: "customer",
  },
  {
    id: "accounting",
    title: "Accounting",
    description: "Invoicing and financial ops",
    group: "finance",
  },
  {
    id: "analytics",
    title: "Analytics",
    description: "Reporting across the stack",
    group: "operations",
  },
];

export function labelForStackOption(
  options: StackOption[],
  value: string | undefined,
): string | undefined {
  if (!value) return undefined;
  return options.find((o) => o.value === value)?.label;
}
