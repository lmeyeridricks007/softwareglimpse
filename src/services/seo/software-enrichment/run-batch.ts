import { applySoftwareEnrichment } from "./apply";
import type { SoftwareEnrichmentApplyResult } from "./apply";

export type RunSoftwareEnrichmentBatchOptions = {
  slugs: string[];
};

export type SoftwareEnrichmentBatchResult = {
  applied: SoftwareEnrichmentApplyResult[];
  failed: string[];
  materiallyImproved: string[];
  totalDependentsNeedingRefresh: number;
};

export function runSoftwareEnrichmentBatch(
  options: RunSoftwareEnrichmentBatchOptions,
): SoftwareEnrichmentBatchResult {
  const applied: SoftwareEnrichmentApplyResult[] = [];
  const failed: string[] = [];
  const materiallyImproved: string[] = [];
  let totalDependentsNeedingRefresh = 0;

  for (const slug of options.slugs) {
    try {
      const result = applySoftwareEnrichment(slug);
      applied.push(result);
      if (!result.applied) failed.push(slug);
      if (result.materiallyImproved) materiallyImproved.push(slug);
      totalDependentsNeedingRefresh += result.dependentsNeedingRefresh;
    } catch {
      failed.push(slug);
    }
  }

  return {
    applied,
    failed,
    materiallyImproved,
    totalDependentsNeedingRefresh,
  };
}
