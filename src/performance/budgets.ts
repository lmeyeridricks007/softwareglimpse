/**
 * Performance budgets — pragmatic thresholds by page family.
 * Used by `npm run perf:check` (static + optional build artifact checks).
 *
 * These are engineering budgets, not field CWV guarantees.
 */

export type PageFamily =
  | "content"
  | "hub"
  | "product"
  | "comparison"
  | "tool";

export type FamilyBudget = {
  /** Soft warning: first-load JS (estimated from route client chunks). */
  jsKbWarn: number;
  /** Hard fail when measured in CI with build stats. */
  jsKbMax: number;
  /** Hero/LCP source file on disk before next/image (warn). */
  heroSourceKbWarn: number;
  notes: string;
};

export const PERFORMANCE_BUDGETS: Record<PageFamily, FamilyBudget> = {
  content: {
    jsKbWarn: 180,
    jsKbMax: 280,
    heroSourceKbWarn: 900,
    notes: "Guides, features, requirements, use cases, capabilities, resources",
  },
  hub: {
    jsKbWarn: 200,
    jsKbMax: 320,
    heroSourceKbWarn: 900,
    notes: "Homepage, category CRM hub, index hubs",
  },
  product: {
    jsKbWarn: 220,
    jsKbMax: 360,
    heroSourceKbWarn: 700,
    notes: "Software review hub + tabs",
  },
  comparison: {
    jsKbWarn: 200,
    jsKbMax: 340,
    heroSourceKbWarn: 700,
    notes: "A vs B comparison pages",
  },
  tool: {
    jsKbWarn: 350,
    jsKbMax: 550,
    heroSourceKbWarn: 500,
    notes: "Finder, calculators, planners, scorecard — interactive islands",
  },
};

/** Lab CWV targets (not field truth). */
export const CWV_TARGETS = {
  lcpMs: 2500,
  inpMs: 200,
  cls: 0.1,
  ttfbMsWarn: 800,
  fcpMsWarn: 1800,
} as const;

export const REPRESENTATIVE_ROUTES: Array<{
  path: string;
  family: PageFamily;
  label: string;
}> = [
  { path: "/", family: "hub", label: "Homepage" },
  { path: "/categories/crm/", family: "hub", label: "CRM hub" },
  { path: "/best/crm-software/", family: "content", label: "Best CRM" },
  { path: "/software/pipedrive/", family: "product", label: "Product" },
  { path: "/software/hive/", family: "product", label: "Product video" },
  {
    path: "/compare/hubspot-vs-pipedrive/",
    family: "comparison",
    label: "Comparison",
  },
  {
    path: "/industries/financial-services/",
    family: "content",
    label: "Industry",
  },
  {
    path: "/use-cases/pipeline-management/",
    family: "content",
    label: "Use Case",
  },
  {
    path: "/capabilities/pipeline-management/",
    family: "content",
    label: "Capability",
  },
  {
    path: "/requirements/separate-sales-processes/",
    family: "content",
    label: "Requirement",
  },
  {
    path: "/features/workflow-automation/",
    family: "content",
    label: "Feature",
  },
  { path: "/guides/what-is-crm/", family: "content", label: "Guide" },
  { path: "/tools/crm-finder/", family: "tool", label: "Finder" },
  {
    path: "/tools/crm-cost-calculator/",
    family: "tool",
    label: "Cost Calculator",
  },
  {
    path: "/tools/crm-requirements-builder/",
    family: "tool",
    label: "Requirements Builder",
  },
  {
    path: "/tools/crm-vendor-scorecard/",
    family: "tool",
    label: "Vendor Scorecard",
  },
  { path: "/tools/crm-tco-calculator/", family: "tool", label: "TCO" },
  {
    path: "/tools/crm-implementation-planner/",
    family: "tool",
    label: "Implementation Planner",
  },
  {
    path: "/tools/crm-migration-planner/",
    family: "tool",
    label: "Migration Planner",
  },
  { path: "/search/", family: "hub", label: "Search hub" },
];
