import type { WorkflowSupportStatus } from "@/services/workflow-experience";

export type WorkflowCompareMedia =
  | {
      kind: "official-video";
      media: import("@/domain").ProductMedia;
      title: string;
      whatToNotice: string[];
      notShown: string[];
      sourceUrl: string;
      sourceOrganization: string;
    }
  | {
      kind: "screenshot";
      src: string;
      alt: string;
      caption?: string;
      title: string;
      whatToNotice: string[];
      notShown: string[];
      sourceUrl: string | null;
      sourceOrganization: string;
    };

export type WorkflowCompareRequirementDiff = {
  id: string;
  label: string;
  leftStatus: WorkflowSupportStatus;
  rightStatus: WorkflowSupportStatus;
  leftDetail: string;
  rightDetail: string;
};

export type WorkflowComparePlanDiff = {
  id: string;
  label: string;
  left: string | null;
  right: string | null;
  evidenceNote: string;
};

export type WorkflowCompareProduct = {
  slug: string;
  name: string;
  logo?: { src: string; alt: string } | null;
  /** Prefer official video; else screenshot; else null (never empty player). */
  media: WorkflowCompareMedia | null;
  stepSupport: Record<string, WorkflowSupportStatus>;
  /** Evidence-backed strengths relevant to this use case (not marketing). */
  researchNotes: string[];
  researched: boolean;
};

export type WorkflowPairAnalysis = {
  left: WorkflowCompareProduct;
  right: WorkflowCompareProduct;
  matrix: Array<{
    stepId: string;
    label: string;
    left: WorkflowSupportStatus;
    right: WorkflowSupportStatus;
  }>;
  whereLeftDiffers: string[];
  whereRightDiffers: string[];
  requirementDiffs: WorkflowCompareRequirementDiff[];
  planDiffs: WorkflowComparePlanDiff[];
  compareHref: string;
};

export type UseCaseWorkflowProductCompareModel = {
  useCaseSlug: string;
  useCaseLabel: string;
  heading: string;
  supporting: string;
  steps: Array<{
    id: string;
    label: string;
    featureIds: string[];
    requirementIds: string[];
    requirementLabels: string[];
  }>;
  products: WorkflowCompareProduct[];
  /** Default pair from researched relevance — not video presence. */
  defaultLeftSlug: string | null;
  defaultRightSlug: string | null;
  /** Feature/requirement rows that can differ between products. */
  comparableRequirements: Array<{
    id: string;
    label: string;
    featureIds: string[];
  }>;
  /**
   * Server-precomputed pair analyses keyed by `${leftSlug}__${rightSlug}`.
   * Keeps node:fs enrichment out of client bundles.
   */
  pairAnalyses: Record<string, WorkflowPairAnalysis>;
};

export function pairAnalysisKey(leftSlug: string, rightSlug: string): string {
  return `${leftSlug}__${rightSlug}`;
}
