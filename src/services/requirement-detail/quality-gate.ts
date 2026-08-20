import type { RequirementDetailModel } from "./build-page-model";

export type RequirementPageGateIssue = {
  code: string;
  message: string;
  critical: boolean;
};

export function validateRequirementDetailPage(
  model: RequirementDetailModel | null,
): { ok: boolean; issues: RequirementPageGateIssue[] } {
  const issues: RequirementPageGateIssue[] = [];
  if (!model) {
    return {
      ok: false,
      issues: [
        {
          code: "PAGE_MISSING",
          message: "Requirement detail profile missing",
          critical: true,
        },
      ],
    };
  }
  if (!model.profile.buyerNeedDescription) {
    issues.push({
      code: "BUYER_NEED_MISSING",
      message: "Buyer need description missing",
      critical: true,
    });
  }
  if (model.profile.featureLinks.length === 0) {
    issues.push({
      code: "FEATURES_MISSING",
      message: "No feature relationships configured",
      critical: true,
    });
  }
  if (model.coreFeatures.length === 0) {
    issues.push({
      code: "CORE_FEATURES_MISSING",
      message: "No required/strongly-supporting features",
      critical: true,
    });
  }
  if (model.profile.evaluationCriteria.length === 0) {
    issues.push({
      code: "CRITERIA_MISSING",
      message: "No evaluation criteria configured",
      critical: false,
    });
  }
  if (model.productRows.length < 2) {
    issues.push({
      code: "PRODUCTS_MISSING",
      message: "Need multiple products for a requirement page",
      critical: true,
    });
  }
  const evidenced = model.productRows.filter(
    (p) => p.fitStatus !== "insufficient-evidence",
  );
  if (evidenced.length < 2) {
    issues.push({
      code: "EVIDENCE_THIN",
      message: "Fewer than two products have requirement evidence",
      critical: true,
    });
  }

  if (!model.profile.overview) {
    issues.push({
      code: "DEPTH_OVERVIEW_MISSING",
      message: "Depth overview missing",
      critical: true,
    });
  }
  if ((model.profile.challenges?.length ?? 0) < 3) {
    issues.push({
      code: "DEPTH_CHALLENGES_THIN",
      message: "Fewer than three depth challenges",
      critical: true,
    });
  }
  if ((model.profile.acceptanceNeeds?.length ?? 0) < 4) {
    issues.push({
      code: "DEPTH_ACCEPTANCE_THIN",
      message: "Fewer than four acceptance needs",
      critical: false,
    });
  }
  if ((model.profile.workflowSteps?.length ?? 0) < 4) {
    issues.push({
      code: "DEPTH_WORKFLOW_THIN",
      message: "Fewer than four validation workflow steps",
      critical: false,
    });
  }
  if (!model.profile.heroVisual?.src) {
    issues.push({
      code: "HERO_VISUAL_MISSING",
      message: "Unique hero visual missing",
      critical: true,
    });
  }
  if (!model.profile.needsVisual?.src || !model.profile.workflowVisual?.src) {
    issues.push({
      code: "TEACHING_VISUALS_MISSING",
      message: "Needs or workflow teaching visual missing",
      critical: true,
    });
  }
  if (!model.profile.workedExample) {
    issues.push({
      code: "WORKED_EXAMPLE_MISSING",
      message: "Worked example missing",
      critical: false,
    });
  }

  const critical = issues.some((i) => i.critical);
  return { ok: !critical, issues };
}
