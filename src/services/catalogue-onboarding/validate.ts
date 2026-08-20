import { loadAffiliateCatalogue } from "@/data/catalogue/source";
import {
  listCatalogueBatches,
  listProcessingRecords,
  loadAliasMap,
} from "@/data/catalogue/store";
import { getSoftwareBySlug } from "@/data";
import { normalizeCatalogueEntries } from "./normalize";
import { classifyCatalogueCandidate } from "./classify";

export type CatalogueValidationIssue = {
  code: string;
  severity: "error" | "warning";
  message: string;
  sourceId?: string;
};

export async function validateCatalogueOnboarding(): Promise<{
  ok: boolean;
  issues: CatalogueValidationIssue[];
}> {
  const issues: CatalogueValidationIssue[] = [];
  const raw = await loadAffiliateCatalogue();
  const ids = new Set<string>();

  for (const entry of raw) {
    if (ids.has(entry.sourceId)) {
      issues.push({
        code: "duplicate_source_id",
        severity: "error",
        message: `Duplicate sourceId ${entry.sourceId}`,
        sourceId: entry.sourceId,
      });
    }
    ids.add(entry.sourceId);
  }

  const normalized = normalizeCatalogueEntries(raw);
  const canonicalCounts = new Map<string, string[]>();

  for (const candidate of normalized) {
    const classification = classifyCatalogueCandidate(candidate);
    if (
      classification.bucket === "SOFTWARE" &&
      !candidate.categoryHint &&
      !classification.matchedProductSlug
    ) {
      issues.push({
        code: "software_no_taxonomy",
        severity: "warning",
        message: `Software candidate ${candidate.sourceId} has no category hint`,
        sourceId: candidate.sourceId,
      });
    }

    if (
      classification.bucket === "MULTI_PRODUCT_PROGRAM" &&
      classification.identityOutcome !== "MULTI_PRODUCT_PROGRAM"
    ) {
      issues.push({
        code: "composite_mislabeled",
        severity: "error",
        message: `Composite programme incorrectly classified: ${candidate.sourceId}`,
        sourceId: candidate.sourceId,
      });
    }

    if (
      candidate.multiProductHint &&
      classification.bucket === "SOFTWARE"
    ) {
      issues.push({
        code: "composite_treated_as_software",
        severity: "error",
        message: `Composite programme treated as software: ${candidate.rawName}`,
        sourceId: candidate.sourceId,
      });
    }
  }

  const records = listProcessingRecords();
  for (const record of records) {
    if (record.canonicalProductSlug) {
      const list = canonicalCounts.get(record.canonicalProductSlug) ?? [];
      list.push(record.sourceId);
      canonicalCounts.set(record.canonicalProductSlug, list);
    }

    if (
      record.canonicalProductSlug &&
      !getSoftwareBySlug(record.canonicalProductSlug, {
        includeUnpublished: true,
      }) &&
      record.state === "onboarded"
    ) {
      issues.push({
        code: "mapped_missing_product",
        severity: "warning",
        message: `Entry ${record.sourceId} mapped to missing product ${record.canonicalProductSlug}`,
        sourceId: record.sourceId,
      });
    }

    if (
      record.state === "excluded" &&
      record.workflowRunId &&
      record.exclusionReason === "NOT_SOFTWARE"
    ) {
      issues.push({
        code: "excluded_with_workflow",
        severity: "warning",
        message: `Excluded non-software entry ${record.sourceId} has workflow ${record.workflowRunId}`,
        sourceId: record.sourceId,
      });
    }
  }

  for (const [slug, sourceIds] of canonicalCounts) {
    if (sourceIds.length > 1) {
      // Multiple programmes can map to one product — warn only if different families
      issues.push({
        code: "duplicate_canonical_mapping",
        severity: "warning",
        message: `Multiple catalogue entries map to ${slug}: ${sourceIds.join(", ")}`,
      });
    }
  }

  const aliases = loadAliasMap();
  for (const a of aliases) {
    if (
      !getSoftwareBySlug(a.canonicalProductSlug, { includeUnpublished: true })
    ) {
      issues.push({
        code: "alias_missing_product",
        severity: "error",
        message: `Alias "${a.affiliateLabel}" → missing product ${a.canonicalProductSlug}`,
      });
    }
  }

  const batches = listCatalogueBatches();
  for (const b of batches) {
    if (b.status === "running" && !b.sourceIds.length) {
      issues.push({
        code: "empty_running_batch",
        severity: "error",
        message: `Running batch ${b.id} has no sourceIds`,
      });
    }
  }

  const ok = !issues.some((i) => i.severity === "error");
  return { ok, issues };
}
