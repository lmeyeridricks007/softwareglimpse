import {
  catalogueBatchDefaults,
  categoryStrategicWeights,
} from "@/data/config/catalogue/priority-weights";
import {
  appendCatalogueAudit,
  saveCatalogueBatch,
  saveProcessingRecord,
} from "@/data/catalogue/store";
import type {
  CatalogueOnboardingBatch,
  CatalogueProcessingRecord,
  NormalizedCatalogueCandidate,
} from "@/domain";
import type { CatalogueClassification } from "./classify";
import type { CatalogueMapping } from "./map";
import type { CommercialPriorityResult } from "./priority";
import { assessProductMaturity, clusterCompletionScore } from "./maturity";

export type CatalogueWorkItem = {
  candidate: NormalizedCatalogueCandidate;
  classification: CatalogueClassification;
  mapping: CatalogueMapping;
  priority: CommercialPriorityResult;
  maturityTier: ReturnType<typeof assessProductMaturity>;
  processing: CatalogueProcessingRecord;
};

export type BatchPlanOptions = {
  maxProducts?: number;
  category?: string;
  priority?: "high" | "medium" | "low" | "any";
  dryRun?: boolean;
  /** Prefer coherent category clusters over mixed batches. */
  preferCluster?: boolean;
};

export type BatchPlanResult = {
  batch: CatalogueOnboardingBatch;
  items: CatalogueWorkItem[];
  deferred: Array<{ sourceId: string; reason: string }>;
  explanation: string[];
};

function now(): string {
  return new Date().toISOString();
}

function priorityGate(
  label: CommercialPriorityResult["label"],
  gate: BatchPlanOptions["priority"],
): boolean {
  if (!gate || gate === "any") return true;
  const rank = { "very-high": 4, high: 3, medium: 2, low: 1, none: 0 };
  const need = { high: 3, medium: 2, low: 1 }[gate];
  return rank[label] >= need;
}

/**
 * Prefer products that can make progress now within a coherent category cluster.
 */
export function planCatalogueBatch(
  items: CatalogueWorkItem[],
  options: BatchPlanOptions = {},
): BatchPlanResult {
  const maxProducts = options.maxProducts ?? catalogueBatchDefaults.maxProducts;
  const deferred: Array<{ sourceId: string; reason: string }> = [];
  const explanation: string[] = [];

  let eligible = items.filter((item) => {
    if (
      item.priority.actionHint === "EXCLUDE" ||
      item.priority.actionHint === "REVIEW"
    ) {
      deferred.push({
        sourceId: item.candidate.sourceId,
        reason: `action=${item.priority.actionHint}`,
      });
      return false;
    }
    if (item.priority.actionHint === "MAINTAIN") {
      deferred.push({
        sourceId: item.candidate.sourceId,
        reason: "Already mature — reconcile/maintain only (not batch onboard)",
      });
      return false;
    }
    if (item.priority.actionHint === "DEFER") {
      deferred.push({
        sourceId: item.candidate.sourceId,
        reason: "Category not ready",
      });
      return false;
    }
    if (
      item.mapping.categoryReadiness === "CATEGORY_NOT_READY" ||
      item.mapping.categoryReadiness === "CATEGORY_UNKNOWN"
    ) {
      deferred.push({
        sourceId: item.candidate.sourceId,
        reason: `Blocked category: ${item.mapping.categorySlug ?? "unknown"}`,
      });
      return false;
    }
    if (!priorityGate(item.priority.label, options.priority)) {
      deferred.push({
        sourceId: item.candidate.sourceId,
        reason: `Priority below ${options.priority}`,
      });
      return false;
    }
    if (options.category && item.mapping.categorySlug !== options.category) {
      return false;
    }
    // Skip fully onboarded mature products from onboard batches
    if (
      item.maturityTier === "TIER_4_DECISION_ECOSYSTEM" ||
      item.maturityTier === "TIER_5_FULLY_INTEGRATED"
    ) {
      if (item.priority.actionHint === "RECONCILE") {
        deferred.push({
          sourceId: item.candidate.sourceId,
          reason: "Mature — reconcile path, not content batch",
        });
        return false;
      }
    }
    return (
      item.classification.bucket === "SOFTWARE" ||
      item.classification.bucket === "SOFTWARE_LIKE_PLATFORM"
    );
  });

  // Prefer RECONCILE of partial CRM cluster when category=crm
  // Score by commercial priority + cluster affinity
  const preferCluster = options.preferCluster !== false;

  // Pick dominant category among eligible by strategic weight × count × cluster gap
  if (preferCluster && !options.category && eligible.length) {
    const byCat = new Map<string, CatalogueWorkItem[]>();
    for (const item of eligible) {
      const cat = item.mapping.categorySlug ?? "unknown";
      const list = byCat.get(cat) ?? [];
      list.push(item);
      byCat.set(cat, list);
    }
    let bestCat = "";
    let bestScore = -1;
    for (const [cat, list] of byCat) {
      if (cat === "unknown") continue;
      const ready = list.every(
        (i) =>
          i.mapping.categoryReadiness === "CATEGORY_READY" ||
          i.mapping.categoryReadiness === "CATEGORY_PARTIAL",
      );
      if (!ready) continue;
      const strategic = categoryStrategicWeights[cat] ?? 0.3;
      const cluster = clusterCompletionScore(cat);
      // Prefer categories close to meaningful ecosystem but not complete
      const gapBoost = cluster < 80 ? (80 - cluster) / 80 : 0.1;
      const score =
        list.length * 10 + strategic * 40 + gapBoost * 30 + list.reduce((s, i) => s + i.priority.score, 0) / list.length;
      if (score > bestScore) {
        bestScore = score;
        bestCat = cat;
      }
    }
    if (bestCat) {
      explanation.push(`Preferred cluster: ${bestCat}`);
      eligible = eligible.filter((i) => i.mapping.categorySlug === bestCat);
    }
  }

  eligible.sort((a, b) => b.priority.score - a.priority.score);

  // Prefer onboarding incomplete products; include RECONCILE partials for CRM
  const selected = eligible.slice(0, maxProducts);

  if (selected.length) {
    explanation.push(
      `Selected ${selected.length} products (max ${maxProducts})`,
    );
    explanation.push(
      `Category: ${selected[0]?.mapping.categorySlug ?? "mixed"}`,
    );
    for (const s of selected) {
      explanation.push(
        `${s.candidate.normalizedName}: priority ${s.priority.score} (${s.priority.label}) action=${s.priority.actionHint}`,
      );
    }
  } else {
    explanation.push("No eligible products for batch — check deferred list");
  }

  const id = `batch-${(selected[0]?.mapping.categorySlug ?? "mixed").slice(0, 24)}-${Date.now()}`;
  const batch: CatalogueOnboardingBatch = {
    id,
    name: selected[0]?.mapping.categorySlug
      ? `${selected[0].mapping.categorySlug} onboarding batch`
      : "Catalogue onboarding batch",
    productIds: selected
      .map((s) => s.mapping.canonicalProductSlug ?? s.candidate.suggestedSlug)
      .filter(Boolean),
    sourceIds: selected.map((s) => s.candidate.sourceId),
    categoryIds: [
      ...new Set(
        selected
          .map((s) => s.mapping.categorySlug)
          .filter((x): x is string => Boolean(x)),
      ),
    ],
    maxProducts,
    status: "planned",
    rationale: explanation,
    workflowRunIds: [],
    results: [],
    createdAt: now(),
    updatedAt: now(),
  };

  if (!options.dryRun) {
    saveCatalogueBatch(batch);
    for (const item of selected) {
      const record: CatalogueProcessingRecord = {
        ...item.processing,
        state: "mapped",
        batchId: batch.id,
        updatedAt: now(),
      };
      saveProcessingRecord(record);
    }
    appendCatalogueAudit("batch_planned", {
      batchId: batch.id,
      sourceIds: batch.sourceIds,
    });
  }

  return { batch, items: selected, deferred, explanation };
}

export function recommendNextBatch(
  items: CatalogueWorkItem[],
): BatchPlanResult {
  return planCatalogueBatch(items, {
    maxProducts: catalogueBatchDefaults.maxProducts,
    preferCluster: true,
    dryRun: true,
  });
}
