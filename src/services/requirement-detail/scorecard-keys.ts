import type { ProductMedia } from "@/domain";
import type {
  RequirementConfidence,
  RequirementFeatureCellStatus,
  RequirementFitStatus,
} from "@/services/requirement-detail/labels";

/**
 * Client-safe scorecard evidence types + key helper.
 * Keep free of `@/data/research/store` (node:fs) so drawers/tables can run in client components.
 */

export type RequirementCriterionDocEvidence = {
  id: string;
  title: string;
  featureSlug: string;
  featureName: string;
  sourceUrl: string | null;
};

export type RequirementCriterionShotEvidence = {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  source?: string;
};

export type RequirementCriterionVideoEvidence = {
  media: ProductMedia;
  title: string;
  demonstrates: string[];
  doesNotEstablish: string[];
  sourceOrganization: string | null;
  verifiedAt: string | null;
};

export type RequirementCriterionCellEvidence = {
  requirementSlug: string;
  criterionId: string;
  criterionName: string;
  productSlug: string;
  productName: string;
  assessment: RequirementFitStatus | "insufficient-evidence";
  confidence: RequirementConfidence;
  supportingFeatures: Array<{
    slug: string;
    name: string;
    status: RequirementFeatureCellStatus;
    href: string | null;
  }>;
  documentation: RequirementCriterionDocEvidence[];
  screenshots: RequirementCriterionShotEvidence[];
  videos: RequirementCriterionVideoEvidence[];
  counts: { docs: number; screenshots: number; videos: number };
};

export function scorecardEvidenceKey(
  productSlug: string,
  criterionId: string,
): string {
  return `${productSlug}::${criterionId}`;
}
