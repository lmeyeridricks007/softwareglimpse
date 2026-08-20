import { loadAffiliateCatalogue } from "@/data/catalogue/source";
import {
  appendCatalogueAudit,
  listProcessingRecords,
  loadProcessingRecord,
  saveProcessingRecord,
} from "@/data/catalogue/store";
import type {
  CatalogueProcessingRecord,
  NormalizedCatalogueCandidate,
} from "@/domain";
import { normalizeCatalogueEntries } from "./normalize";
import { classifyCatalogueCandidate } from "./classify";
import { mapCatalogueCandidate, rebuildCategoryGaps } from "./map";
import { scoreCommercialPriority } from "./priority";
import { assessProductMaturity } from "./maturity";
import type { CatalogueWorkItem } from "./planner";

function now(): string {
  return new Date().toISOString();
}

/**
 * Import + normalize + classify + map entire catalogue (idempotent per sourceId).
 */
export async function importAndProcessCatalogue(options?: {
  persist?: boolean;
}): Promise<CatalogueWorkItem[]> {
  const persist = options?.persist !== false;
  const raw = await loadAffiliateCatalogue();
  const normalized = normalizeCatalogueEntries(raw);
  const items: CatalogueWorkItem[] = [];
  const mappings = [];

  for (const candidate of normalized) {
    const classification = classifyCatalogueCandidate(candidate);
    const mapping = mapCatalogueCandidate(candidate, classification);
    mappings.push(mapping);
    const priority = scoreCommercialPriority({
      candidate,
      classification,
      mapping,
    });
    const productSlug =
      mapping.canonicalProductSlug ??
      (classification.bucket === "SOFTWARE"
        ? candidate.suggestedSlug
        : undefined);
    const maturityTier = assessProductMaturity(
      mapping.canonicalProductSlug ?? productSlug,
    );

    const existing = loadProcessingRecord(candidate.sourceId);
    let state: CatalogueProcessingRecord["state"] = "classified";
    if (classification.exclusionReason) {
      state =
        classification.bucket === "REVIEW_REQUIRED" ||
        classification.bucket === "MULTI_PRODUCT_PROGRAM"
          ? "review-required"
          : "excluded";
    } else if (mapping.canonicalProductSlug) {
      state =
        priority.actionHint === "MAINTAIN" || maturityTier.startsWith("TIER_4")
          ? "onboarded"
          : priority.actionHint === "RECONCILE"
            ? "mapped"
            : "mapped";
    } else if (mapping.gaps.length) {
      state = "blocked";
    }

    const processing: CatalogueProcessingRecord = {
      sourceId: candidate.sourceId,
      state: existing?.state === "onboarding-created" ? existing.state : state,
      bucket: classification.bucket,
      identityOutcome: classification.identityOutcome,
      canonicalProductSlug: mapping.canonicalProductSlug,
      mappedProductSlugs: mapping.mappedProductSlugs,
      categorySlug: mapping.categorySlug,
      categoryReadiness: mapping.categoryReadiness,
      exclusionReason: classification.exclusionReason,
      commercialPriorityScore: priority.score,
      commercialPriorityLabel: priority.label,
      priorityReasons: priority.reasons,
      maturityTier,
      workflowRunId: existing?.workflowRunId,
      batchId: existing?.batchId,
      blockers: [...classification.blockers, ...mapping.gaps],
      reviewDecision: existing?.reviewDecision,
      reviewNotes: existing?.reviewNotes,
      updatedAt: now(),
    };

    if (persist) {
      saveProcessingRecord(processing);
    }

    items.push({
      candidate,
      classification,
      mapping,
      priority,
      maturityTier,
      processing,
    });
  }

  if (persist) {
    rebuildCategoryGaps(mappings);
    appendCatalogueAudit("catalogue_imported", {
      count: items.length,
    });
  }

  return items;
}

export function getProcessedWorkItemsFromStore(
  candidates: NormalizedCatalogueCandidate[],
): CatalogueWorkItem[] {
  const records = listProcessingRecords();
  const byId = new Map(records.map((r) => [r.sourceId, r]));
  const items: CatalogueWorkItem[] = [];

  for (const candidate of candidates) {
    const processing = byId.get(candidate.sourceId);
    if (!processing) continue;
    const classification = classifyCatalogueCandidate(candidate);
    const mapping = mapCatalogueCandidate(candidate, classification);
    const priority = scoreCommercialPriority({
      candidate,
      classification,
      mapping,
    });
    items.push({
      candidate,
      classification,
      mapping,
      priority,
      maturityTier: assessProductMaturity(mapping.canonicalProductSlug),
      processing,
    });
  }
  return items;
}

export function recordReviewDecision(input: {
  sourceId: string;
  decision:
    | "approve-as-software"
    | "classify-as-service"
    | "split-multi-product"
    | "map-to-existing"
    | "exclude";
  notes?: string;
  mapToSlug?: string;
}): CatalogueProcessingRecord {
  const existing = loadProcessingRecord(input.sourceId);
  if (!existing) {
    throw new Error(`Unknown catalogue sourceId: ${input.sourceId}`);
  }
  const updated: CatalogueProcessingRecord = {
    ...existing,
    reviewDecision: input.decision,
    reviewNotes: input.notes,
    canonicalProductSlug:
      input.decision === "map-to-existing" && input.mapToSlug
        ? input.mapToSlug
        : existing.canonicalProductSlug,
    state:
      input.decision === "exclude"
        ? "excluded"
        : input.decision === "approve-as-software" ||
            input.decision === "map-to-existing"
          ? "mapped"
          : "review-required",
    exclusionReason:
      input.decision === "exclude"
        ? "OUT_OF_SCOPE"
        : input.decision === "classify-as-service"
          ? "NOT_SOFTWARE"
          : input.decision === "split-multi-product"
            ? "MULTI_PRODUCT_PROGRAM"
            : existing.exclusionReason,
    updatedAt: now(),
  };
  saveProcessingRecord(updated);
  appendCatalogueAudit("review_decision", {
    sourceId: input.sourceId,
    decision: input.decision,
  });
  return updated;
}
