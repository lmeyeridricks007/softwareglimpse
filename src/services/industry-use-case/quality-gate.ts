import type { IndustryUseCaseModel } from "./build-page-model";

export type UseCasePageGateIssue = {
  code: string;
  message: string;
  critical: boolean;
};

/**
 * Publication readiness checks for industry use-case decision pages.
 * Does not invent missing research — only flags gaps.
 */
export function validateIndustryUseCasePage(
  model: IndustryUseCaseModel | null,
): { ok: boolean; issues: UseCasePageGateIssue[] } {
  const issues: UseCasePageGateIssue[] = [];
  if (!model) {
    return {
      ok: false,
      issues: [
        {
          code: "PAGE_MISSING",
          message: "Industry use-case profile or industry entity missing",
          critical: true,
        },
      ],
    };
  }

  if (!model.useCaseSlug || !model.industry.slug) {
    issues.push({
      code: "IDENTITY_MISSING",
      message: "Use case or industry identity missing",
      critical: true,
    });
  }
  if (model.capabilities.length === 0) {
    issues.push({
      code: "CAPABILITIES_MISSING",
      message: "No use-case capability priorities configured",
      critical: true,
    });
  }
  if (model.requirements.length === 0) {
    issues.push({
      code: "REQUIREMENTS_MISSING",
      message: "No use-case requirements configured",
      critical: true,
    });
  }
  if (model.productRows.length < 2) {
    issues.push({
      code: "PRODUCTS_MISSING",
      message: "Need multiple researched products for a decision page",
      critical: true,
    });
  }
  for (const row of model.productRows) {
    if (
      row.fitLabel !== "Unknown" &&
      row.fitScore == null &&
      row.evidenceCount === 0
    ) {
      issues.push({
        code: "UNSUPPORTED_FIT_LABEL",
        message: `${row.slug} has a fit label without assessment or evidence`,
        critical: true,
      });
    }
    if (row.fitScore != null && row.fitBreakdown.length === 0) {
      issues.push({
        code: "SCORE_WITHOUT_BREAKDOWN",
        message: `${row.slug} has a numeric fit score without breakdown`,
        critical: true,
      });
    }
  }
  if (model.summaryPicks.length === 0 && model.productCards.length === 0) {
    issues.push({
      code: "RECOMMENDATIONS_MISSING",
      message: "No evidence-backed recommendation slots populated",
      critical: false,
    });
  }

  const critical = issues.some((i) => i.critical);
  return { ok: !critical, issues };
}
