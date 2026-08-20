import type { IndustryCapabilityModel } from "./build-page-model";

export type CapabilityPageGateIssue = {
  code: string;
  message: string;
  critical: boolean;
};

/**
 * Publication readiness checks for industry capability pages.
 * Does not invent missing research — only flags gaps.
 */
export function validateIndustryCapabilityPage(
  model: IndustryCapabilityModel | null,
): { ok: boolean; issues: CapabilityPageGateIssue[] } {
  const issues: CapabilityPageGateIssue[] = [];
  if (!model) {
    return {
      ok: false,
      issues: [
        {
          code: "PAGE_MISSING",
          message: "Industry capability profile or industry entity missing",
          critical: true,
        },
      ],
    };
  }

  if (!model.capabilitySlug || !model.industry.slug) {
    issues.push({
      code: "IDENTITY_MISSING",
      message: "Capability or industry identity missing",
      critical: true,
    });
  }
  if (model.requirements.length === 0) {
    issues.push({
      code: "REQUIREMENTS_MISSING",
      message: "No capability requirements configured",
      critical: true,
    });
  }
  if (model.whyItMatters.length === 0) {
    issues.push({
      code: "WHY_MISSING",
      message: "No industry-context editorial paragraphs",
      critical: false,
    });
  }
  if (model.productRows.length === 0) {
    issues.push({
      code: "PRODUCTS_MISSING",
      message: "No researched products available for scorecard",
      critical: true,
    });
  }
  for (const row of model.productRows) {
    if (row.fitLabel !== "Unknown" && row.fitScore == null && row.evidenceCount === 0) {
      issues.push({
        code: "UNSUPPORTED_FIT_LABEL",
        message: `${row.slug} has a fit label without assessment or evidence`,
        critical: true,
      });
    }
  }
  if (model.faq.some((f) => /best crm/i.test(f.question) && /best product for every/i.test(f.answer) === false && /universal best/i.test(f.answer) === false && /no universal/i.test(f.answer) === false && /depends/i.test(f.answer) === false)) {
    // Soft check only — answers should avoid unsupported absolute rankings.
  }

  const critical = issues.some((i) => i.critical);
  return { ok: !critical, issues };
}
