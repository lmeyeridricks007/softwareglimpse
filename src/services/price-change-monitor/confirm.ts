import type {
  DetectedPriceChange,
  PricingVerificationTask,
  RefreshCandidate,
} from "@/domain";
import { PricingSchema } from "@/domain";
import { getSoftwareBySlug } from "@/data";
import { loadEnrichment, saveEnrichment } from "@/data/research/store";
import { normalizePricingInput } from "@/services/pricing/build-snapshot";
import { snapshotPricingHistory } from "@/services/pricing-history";
import {
  applyConfirmedPriceChange,
  resolvePriceChangeImpactPages,
  type ApplyConfirmedPriceChangeResult,
} from "./impact";
import { orderPriceRefreshPages } from "./refresh-order";
import {
  clearOutdatedPricingForProduct,
  markPagesOutdatedPricing,
} from "./stale-marking";
import {
  loadPricingVerificationTasks,
  writePricingVerificationTasks,
} from "./verification-task";

export type ConfirmPricingChangeResult = {
  taskId: string;
  productId: string;
  observationAppended: boolean;
  canonicalUpdated: boolean;
  changeEventId: string | null;
  refreshCandidates: RefreshCandidate[];
  refreshOrder: Array<{ path: string; refreshTier: number; pageType: string }>;
  outdatedMarksRemaining: number;
  apply: ApplyConfirmedPriceChangeResult;
};

/**
 * After human confirmation:
 * 1. append PriceObservation
 * 2. update canonical current pricing (enrichment verifiedAt stamp)
 * 3. record change event
 * 4. trigger ordered refresh candidates
 * 5. keep OUTDATED_PRICING until pages are refreshed (marks stay active;
 *    caller may clear after successful refresh run)
 */
export function confirmPricingVerificationTask(
  taskId: string,
  opts?: {
    cwd?: string;
    change?: DetectedPriceChange;
    clearOutdatedOnConfirm?: boolean;
  },
): ConfirmPricingChangeResult {
  const cwd = opts?.cwd ?? process.cwd();
  const store = loadPricingVerificationTasks(cwd);
  const task = store.tasks.find((t) => t.id === taskId);
  if (!task) {
    throw new Error(`Pricing verification task not found: ${taskId}`);
  }
  if (task.status === "confirmed") {
    throw new Error(`Task already confirmed: ${taskId}`);
  }
  if (task.status === "rejected") {
    throw new Error(`Task was rejected: ${taskId}`);
  }

  const change: DetectedPriceChange = opts?.change ?? {
    productId: task.productId,
    productName: task.productName,
    kind: task.kind,
    confidence: "CONFIRMED",
    summary: task.difference.summary,
    previousPrice: task.difference.previousPrice,
    newPrice: task.difference.newPrice,
    absoluteChange: task.difference.absoluteChange,
    percentageChange: task.difference.percentageChange,
    planId: task.affectedPlans[0]?.planId ?? null,
    planName: task.affectedPlans[0]?.planName ?? null,
    requiresHumanVerification: false,
    validationNotes: [
      ...task.difference.notes,
      `Confirmed via verification task ${taskId}`,
    ],
    noteworthy: true,
  };

  // Force CONFIRMED for apply path.
  const confirmedChange: DetectedPriceChange = {
    ...change,
    confidence: "CONFIRMED",
    requiresHumanVerification: false,
  };

  const apply = applyConfirmedPriceChange(confirmedChange, {
    appendObservation: true,
    markEditorial: true,
  });

  const canonicalUpdated = stampCanonicalPricingVerified(
    task.productId,
    `Confirmed pricing change (${task.kind}) via task ${taskId}`,
  );

  const ordered = orderPriceRefreshPages(
    resolvePriceChangeImpactPages(task.productId),
  );

  // Dependent pages stay marked until refreshed (unless explicitly cleared).
  if (opts?.clearOutdatedOnConfirm) {
    clearOutdatedPricingForProduct(task.productId, { cwd });
  } else {
    markPagesOutdatedPricing(ordered, {
      productId: task.productId,
      reason: `Confirmed pricing change pending refresh: ${task.difference.summary}`,
      confidence: "CONFIRMED",
      cwd,
    });
  }

  const now = new Date().toISOString();
  const updatedTask: PricingVerificationTask = {
    ...task,
    status: "confirmed",
    publishBlocked: false,
    confirmedAt: now,
  };
  // publishBlocked stays conceptually true until surfaces refresh; status=confirmed
  // unlocks observation/canonical writes. Re-write with confirmed task.
  writePricingVerificationTasks(
    store.tasks.map((t) => (t.id === taskId ? updatedTask : t)),
    { cwd, writeMarkdown: true },
  );

  // Sort refresh candidates to match dependency order when paths map.
  const refreshCandidates = sortRefreshCandidatesByOrder(
    apply.refreshCandidates,
    ordered,
  );

  return {
    taskId,
    productId: task.productId,
    observationAppended: apply.observationAppended,
    canonicalUpdated,
    changeEventId: apply.changeEventId,
    refreshCandidates,
    refreshOrder: ordered.map((p) => ({
      path: p.path,
      refreshTier: p.refreshTier,
      pageType: p.pageType,
    })),
    outdatedMarksRemaining: opts?.clearOutdatedOnConfirm
      ? 0
      : ordered.length,
    apply,
  };
}

function stampCanonicalPricingVerified(
  productId: string,
  note: string,
): boolean {
  const enrichment = loadEnrichment(productId);
  const software = getSoftwareBySlug(productId);
  if (!enrichment?.pricing && !software?.pricing) return false;

  if (enrichment?.pricing) {
    const parsed = PricingSchema.safeParse(
      normalizePricingInput(enrichment.pricing),
    );
    if (!parsed.success) return false;
    const verifiedAt = new Date().toISOString();
    saveEnrichment(productId, {
      ...enrichment,
      pricing: {
        ...parsed.data,
        verifiedAt,
        notes: [parsed.data.notes, note].filter(Boolean).join(" · "),
      },
      updatedAt: verifiedAt,
    });
    // Also ensure observation series captures the stamped pricing.
    snapshotPricingHistory({
      productId,
      pricing: { ...parsed.data, verifiedAt },
      categorySlug: software?.primaryCategorySlug,
      verificationMethod: "vendor-page",
      confidence: "high",
      notes: note,
    });
    return true;
  }
  return false;
}

function sortRefreshCandidatesByOrder(
  candidates: RefreshCandidate[],
  ordered: Array<{ path: string; refreshTier: number }>,
): RefreshCandidate[] {
  const tierByPath = new Map(ordered.map((p) => [p.path, p.refreshTier]));
  return [...candidates].sort((a, b) => {
    const pathA = contentIdToPath(String(a.contentId));
    const pathB = contentIdToPath(String(b.contentId));
    const tA = pathA ? (tierByPath.get(pathA) ?? 99) : 99;
    const tB = pathB ? (tierByPath.get(pathB) ?? 99) : 99;
    if (tA !== tB) return tA - tB;
    return String(a.contentId).localeCompare(String(b.contentId));
  });
}

function contentIdToPath(contentId: string): string | null {
  // content:software:pipedrive → /software/pipedrive/
  const m = contentId.match(
    /^content:(software|pricing|comparison|best|tool|category|alternatives):(.+)$/,
  );
  if (!m) return null;
  const type = m[1]!;
  const slug = m[2]!;
  const map: Record<string, string> = {
    software: "software",
    pricing: "pricing",
    comparison: "compare",
    best: "best",
    tool: "tools",
    category: "categories",
    alternatives: "alternatives",
  };
  const segment = map[type];
  return segment ? `/${segment}/${slug}/` : null;
}

export function rejectPricingVerificationTask(
  taskId: string,
  opts?: { cwd?: string; reason?: string },
): PricingVerificationTask {
  const cwd = opts?.cwd ?? process.cwd();
  const store = loadPricingVerificationTasks(cwd);
  const task = store.tasks.find((t) => t.id === taskId);
  if (!task) throw new Error(`Pricing verification task not found: ${taskId}`);
  const updated: PricingVerificationTask = {
    ...task,
    status: "rejected",
    rejectedAt: new Date().toISOString(),
    difference: {
      ...task.difference,
      notes: [
        ...task.difference.notes,
        opts?.reason ? `Rejected: ${opts.reason}` : "Rejected by human",
      ],
    },
  };
  writePricingVerificationTasks(
    store.tasks.map((t) => (t.id === taskId ? updated : t)),
    { cwd, writeMarkdown: true },
  );
  return updated;
}
