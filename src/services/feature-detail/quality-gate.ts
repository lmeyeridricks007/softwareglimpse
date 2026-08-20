import type { FeatureDetailModel } from "./build-page-model";
import { CRM_FEATURE_PILLAR_SLUGS } from "@/data/feature-detail/deep";

export type FeaturePageGateIssue = {
  code: string;
  message: string;
  critical: boolean;
};

/**
 * Publication readiness for Feature Detail pages.
 * Never invent missing support — only flag gaps.
 */
export function validateFeatureDetailPage(
  model: FeatureDetailModel | null,
): { ok: boolean; issues: FeaturePageGateIssue[] } {
  const issues: FeaturePageGateIssue[] = [];
  if (!model) {
    return {
      ok: false,
      issues: [
        {
          code: "PAGE_MISSING",
          message: "Feature detail profile missing",
          critical: true,
        },
      ],
    };
  }

  if (!model.profile.definition) {
    issues.push({
      code: "DEFINITION_MISSING",
      message: "Feature definition missing",
      critical: true,
    });
  }
  if (!model.profile.primaryCapabilitySlug && !model.profile.primaryCapabilityName) {
    issues.push({
      code: "CAPABILITY_LINK_MISSING",
      message: "No capability relationship configured",
      critical: false,
    });
  }
  if (model.profile.requirementMappings.length === 0) {
    issues.push({
      code: "REQUIREMENTS_MISSING",
      message: "No requirement mappings configured",
      critical: false,
    });
  }

  const isPillar = (CRM_FEATURE_PILLAR_SLUGS as readonly string[]).includes(
    model.featureSlug,
  );

  if (isPillar) {
    if (!model.profile.overview) {
      issues.push({
        code: "DEPTH_OVERVIEW_MISSING",
        message: "Pillar feature missing overview depth",
        critical: true,
      });
    }
    if ((model.workedExamples?.length ?? 0) < 2) {
      issues.push({
        code: "DEPTH_EXAMPLES_THIN",
        message: "Pillar feature needs at least two worked examples",
        critical: true,
      });
    }
    if (
      !model.profile.heroVisual?.src ||
      !model.profile.needsVisual?.src ||
      !model.profile.workflowVisual?.src
    ) {
      issues.push({
        code: "DEPTH_VISUALS_MISSING",
        message: "Pillar feature missing hero/needs/workflow visual paths",
        critical: true,
      });
    }
  }

  if (model.productRows.length < 2) {
    issues.push({
      code: "PRODUCTS_MISSING",
      message: "Need multiple products with research for a feature page",
      critical: true,
    });
  }
  const evidenced = model.productRows.filter(
    (p) => p.supportStatus !== "not-evidenced",
  );
  if (evidenced.length < 2) {
    issues.push({
      code: "EVIDENCE_THIN",
      message: "Fewer than two products have verified feature evidence",
      // Soft for admin/security/API pages until enrichment catches up — still blocks
      // inventing claims, but allows educational pages to soft-publish.
      critical: !["sso", "audit-logs", "role-permissions", "api-access"].includes(
        model.featureSlug,
      ),
    });
  }
  for (const row of model.productRows) {
    if (
      row.supportStatus === "supported" &&
      row.evidenceCount === 0 &&
      !row.minimumPlan
    ) {
      issues.push({
        code: "UNSUPPORTED_CLAIM",
        message: `${row.slug} marked supported without evidence`,
        critical: true,
      });
    }
  }

  const critical = issues.some((i) => i.critical);
  return { ok: !critical, issues };
}
