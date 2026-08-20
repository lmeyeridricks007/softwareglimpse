/**
 * Shared dynamic import helpers for heavy interactive CRM tools.
 * Keeps tool JS out of shared content-route graphs and defers parse until needed.
 */
"use client";

import dynamic from "next/dynamic";

function ToolLoading({ label }: { label: string }) {
  return (
    <p className="mt-8 text-sm text-[var(--sg-color-text-muted)]" role="status">
      Loading {label}…
    </p>
  );
}

export const DynamicCrmFinderApp = dynamic(
  () =>
    import("@/components/finder/crm-finder-app").then((m) => m.CrmFinderApp),
  {
    loading: () => <ToolLoading label="CRM Finder" />,
  },
);

export const DynamicSiFinderApp = dynamic(
  () =>
    import("@/components/finder/si-finder-app").then((m) => m.SiFinderApp),
  {
    loading: () => <ToolLoading label="Sales Intelligence Finder" />,
  },
);

export const DynamicCrmTcoCalculatorApp = dynamic(
  () =>
    import("@/components/tco/crm-tco-calculator-app").then(
      (m) => m.CrmTcoCalculatorApp,
    ),
  {
    loading: () => <ToolLoading label="TCO calculator" />,
  },
);

export const DynamicCrmImplementationPlannerApp = dynamic(
  () =>
    import(
      "@/components/implementation-planner/crm-implementation-planner-app"
    ).then((m) => m.CrmImplementationPlannerApp),
  {
    loading: () => <ToolLoading label="implementation planner" />,
  },
);

export const DynamicCrmMigrationPlannerApp = dynamic(
  () =>
    import(
      "@/components/migration-planner/crm/crm-migration-planner-app"
    ).then((m) => m.CrmMigrationPlannerApp),
  {
    loading: () => <ToolLoading label="migration planner" />,
  },
);

export const DynamicCrmVendorScorecardApp = dynamic(
  () =>
    import(
      "@/components/vendor-scorecard/crm/crm-vendor-scorecard-app"
    ).then((m) => m.CrmVendorScorecardApp),
  {
    loading: () => <ToolLoading label="vendor scorecard" />,
  },
);

export const DynamicSiVendorScorecardApp = dynamic(
  () =>
    import(
      "@/components/vendor-scorecard/si/si-vendor-scorecard-app"
    ).then((m) => m.SiVendorScorecardApp),
  {
    loading: () => <ToolLoading label="SI vendor scorecard" />,
  },
);

export const DynamicCrmRequirementsBuilderApp = dynamic(
  () =>
    import(
      "@/components/requirements-builder/crm-requirements-builder-app"
    ).then((m) => m.CrmRequirementsBuilderApp),
  {
    loading: () => <ToolLoading label="requirements builder" />,
  },
);

export const DynamicSiRequirementsBuilderApp = dynamic(
  () =>
    import(
      "@/components/requirements-builder/si-requirements-builder-app"
    ).then((m) => m.SiRequirementsBuilderApp),
  {
    loading: () => <ToolLoading label="SI requirements builder" />,
  },
);

export const DynamicCrmCostCalculatorApp = dynamic(
  () =>
    import("@/components/pricing/cost-calculator-app").then(
      (m) => m.CostCalculatorApp,
    ),
  {
    loading: () => <ToolLoading label="cost calculator" />,
  },
);

export const DynamicSiCostCalculatorApp = dynamic(
  () =>
    import("@/components/pricing/si-cost-calculator-app").then(
      (m) => m.SiCostCalculatorApp,
    ),
  {
    loading: () => <ToolLoading label="SI cost calculator" />,
  },
);

export const DynamicCrmRoiCalculatorApp = dynamic(
  () =>
    import("@/components/roi/crm-roi-calculator-app").then(
      (m) => m.CrmRoiCalculatorApp,
    ),
  {
    loading: () => <ToolLoading label="ROI calculator" />,
  },
);

export const DynamicCrmDemoChecklistBuilderApp = dynamic(
  () =>
    import(
      "@/components/demo-checklist-builder/crm-demo-checklist-builder-app"
    ).then((m) => m.CrmDemoChecklistBuilderApp),
  {
    ssr: false,
    loading: () => <ToolLoading label="demo checklist builder" />,
  },
);

export const DynamicSiDemoChecklistBuilderApp = dynamic(
  () =>
    import(
      "@/components/demo-checklist-builder/si-demo-checklist-builder-app"
    ).then((m) => m.SiDemoChecklistBuilderApp),
  {
    ssr: false,
    loading: () => <ToolLoading label="SI demo checklist builder" />,
  },
);

export const DynamicCrmRfpBuilderApp = dynamic(
  () =>
    import("@/components/rfp-builder/crm-rfp-builder-app").then(
      (m) => m.CrmRfpBuilderApp,
    ),
  {
    loading: () => <ToolLoading label="RFP builder" />,
  },
);

export const DynamicSiRfpBuilderApp = dynamic(
  () =>
    import("@/components/rfp-builder/si-rfp-builder-app").then(
      (m) => m.SiRfpBuilderApp,
    ),
  {
    loading: () => <ToolLoading label="SI RFP builder" />,
  },
);

export const DynamicCrmReadinessAssessmentApp = dynamic(
  () =>
    import(
      "@/components/readiness-assessment/crm-readiness-assessment-app"
    ).then((m) => m.CrmReadinessAssessmentApp),
  {
    loading: () => <ToolLoading label="readiness assessment" />,
  },
);

export const DynamicSiReadinessAssessmentApp = dynamic(
  () =>
    import(
      "@/components/readiness-assessment/si-readiness-assessment-app"
    ).then((m) => m.SiReadinessAssessmentApp),
  {
    loading: () => <ToolLoading label="SI readiness assessment" />,
  },
);

export const DynamicCrmMigrationCostCalculatorApp = dynamic(
  () =>
    import(
      "@/components/migration-cost/crm-migration-cost-calculator-app"
    ).then((m) => m.CrmMigrationCostCalculatorApp),
  {
    loading: () => <ToolLoading label="migration cost calculator" />,
  },
);

export const DynamicCrmPlanSelectorApp = dynamic(
  () =>
    import("@/components/plan-selector/crm-plan-selector-app").then(
      (m) => m.CrmPlanSelectorApp,
    ),
  {
    loading: () => <ToolLoading label="plan selector" />,
  },
);

export const DynamicSiPlanSelectorApp = dynamic(
  () =>
    import("@/components/plan-selector/si-plan-selector-app").then(
      (m) => m.SiPlanSelectorApp,
    ),
  {
    loading: () => <ToolLoading label="SI plan selector" />,
  },
);

export const DynamicCategoryFinderApp = dynamic(
  () =>
    import("@/components/finder/category-finder-app").then(
      (m) => m.CategoryFinderApp,
    ),
  {
    loading: () => <ToolLoading label="Finder" />,
  },
);

export const DynamicCategoryCostCalculatorApp = dynamic(
  () =>
    import("@/components/pricing/category-cost-calculator-app").then(
      (m) => m.CategoryCostCalculatorApp,
    ),
  {
    loading: () => <ToolLoading label="cost calculator" />,
  },
);

export const DynamicCategoryPlanSelectorApp = dynamic(
  () =>
    import("@/components/plan-selector/category-plan-selector-app").then(
      (m) => m.CategoryPlanSelectorApp,
    ),
  {
    loading: () => <ToolLoading label="plan selector" />,
  },
);

export const DynamicCategoryRequirementsBuilderApp = dynamic(
  () =>
    import(
      "@/components/requirements-builder/category-requirements-builder-app"
    ).then((m) => m.CategoryRequirementsBuilderApp),
  {
    loading: () => <ToolLoading label="requirements builder" />,
  },
);

export const DynamicCategoryVendorScorecardApp = dynamic(
  () =>
    import(
      "@/components/vendor-scorecard/category-vendor-scorecard-app"
    ).then((m) => m.CategoryVendorScorecardApp),
  {
    loading: () => <ToolLoading label="vendor scorecard" />,
  },
);

export const DynamicCategoryRfpBuilderApp = dynamic(
  () =>
    import("@/components/rfp-builder/category-rfp-builder-app").then(
      (m) => m.CategoryRfpBuilderApp,
    ),
  {
    loading: () => <ToolLoading label="RFP builder" />,
  },
);

export const DynamicCategoryDemoChecklistBuilderApp = dynamic(
  () =>
    import(
      "@/components/demo-checklist-builder/category-demo-checklist-builder-app"
    ).then((m) => m.CategoryDemoChecklistBuilderApp),
  {
    ssr: false,
    loading: () => <ToolLoading label="demo checklist builder" />,
  },
);

export const DynamicCategoryReadinessAssessmentApp = dynamic(
  () =>
    import(
      "@/components/readiness-assessment/category-readiness-assessment-app"
    ).then((m) => m.CategoryReadinessAssessmentApp),
  {
    loading: () => <ToolLoading label="readiness assessment" />,
  },
);

export const DynamicCrmAdoptionHealthApp = dynamic(
  () =>
    import(
      "@/components/adoption-health/crm-adoption-health-app"
    ).then((m) => m.CrmAdoptionHealthApp),
  {
    loading: () => <ToolLoading label="adoption health assessment" />,
  },
);
