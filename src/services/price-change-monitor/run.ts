import { writeFileSync } from "node:fs";
import path from "node:path";
import { buildPriceMonitorQueue } from "./queue";
import { detectPriceChangesForProducts } from "./detect";
import { buildEditorialCandidates } from "./editorial";
import {
  applyConfirmedPriceChange,
  buildGrowthSignalsFromChanges,
  resolvePriceChangeImpactPages,
} from "./impact";
import { writePriceChangeGrowthSignals } from "./growth-feed";
import { formatWeeklyPriceChangesMarkdown } from "./report";
import {
  buildPricingVerificationTasks,
  writePricingVerificationTasks,
} from "./verification-task";
import { markPagesOutdatedPricing } from "./stale-marking";
import { orderPriceRefreshPages } from "./refresh-order";

export type RunPriceChangeMonitorOptions = {
  /** Limit products scanned (from priority queue). Default 50. */
  limit?: number;
  /** Persist CONFIRMED change events + refresh + optional observation append. */
  applyConfirmed?: boolean;
  /** Append PriceObservation for CONFIRMED (default false — safer). */
  appendObservations?: boolean;
  /** Write docs/pricing/WEEKLY-PRICE-CHANGES.md */
  writeWeeklyReport?: boolean;
  /** Write data/pricing/price-change-growth-signals.json */
  writeGrowthSignals?: boolean;
  /** Write human verification tasks for REQUIRES_REVIEW / LIKELY. */
  writeVerificationTasks?: boolean;
  /** Mark dependent pages OUTDATED_PRICING for unverified + confirmed-pending. */
  markOutdatedPricing?: boolean;
};

export type PriceChangeMonitorRunResult = {
  generatedAt: string;
  productsScanned: number;
  changeCount: number;
  confirmedCount: number;
  needsVerificationCount: number;
  editorialCandidateCount: number;
  growthSignalCount: number;
  verificationTaskCount: number;
  outdatedMarkCount: number;
  weeklyReportPath: string | null;
  growthSignalsPath: string | null;
  verificationTasksPath: string | null;
};

/**
 * Full monitor run: queue → detect → impact → editorial → growth → report.
 * REQUIRES_REVIEW / LIKELY never auto-publish; they produce verification tasks.
 */
export function runPriceChangeMonitor(
  opts: RunPriceChangeMonitorOptions = {},
): PriceChangeMonitorRunResult {
  const limit = opts.limit ?? 50;
  const queue = buildPriceMonitorQueue(limit);
  const productIds = queue.items.map((i) => i.productId);
  const changes = detectPriceChangesForProducts(productIds);

  const confirmed = changes.filter((c) => c.confidence === "CONFIRMED");
  const needsVerification = changes.filter(
    (c) =>
      c.confidence === "LIKELY" || c.confidence === "REQUIRES_REVIEW",
  );

  const applications =
    opts.applyConfirmed === true
      ? confirmed.map((c) =>
          applyConfirmedPriceChange(c, {
            appendObservation: opts.appendObservations === true,
            markEditorial: true,
          }),
        )
      : [];

  const affectedPages = [
    ...new Map(
      changes.flatMap((c) =>
        resolvePriceChangeImpactPages(c.productId).map(
          (p) => [p.path + c.productId, p] as const,
        ),
      ),
    ).values(),
  ];

  const editorialCandidates = buildEditorialCandidates(changes);
  const growthSignals = buildGrowthSignalsFromChanges(changes);

  let growthSignalsPath: string | null = null;
  if (opts.writeGrowthSignals !== false) {
    writePriceChangeGrowthSignals(growthSignals);
    growthSignalsPath = "data/pricing/price-change-growth-signals.json";
  }

  let verificationTaskCount = 0;
  let verificationTasksPath: string | null = null;
  if (opts.writeVerificationTasks !== false) {
    const tasks = buildPricingVerificationTasks(needsVerification);
    const store = writePricingVerificationTasks(tasks, {
      writeMarkdown: true,
    });
    verificationTaskCount = store.tasks.filter(
      (t) => t.status === "pending",
    ).length;
    verificationTasksPath = "data/pricing/verification-tasks.json";
  }

  let outdatedMarkCount = 0;
  if (opts.markOutdatedPricing !== false) {
    const actionable = changes.filter(
      (c) =>
        c.confidence === "REQUIRES_REVIEW" ||
        c.confidence === "LIKELY" ||
        c.confidence === "CONFIRMED",
    );
    for (const change of actionable) {
      const ordered = orderPriceRefreshPages(
        resolvePriceChangeImpactPages(change.productId),
      );
      const marks = markPagesOutdatedPricing(ordered, {
        productId: change.productId,
        reason: change.summary,
        confidence: change.confidence,
      });
      outdatedMarkCount += marks.length;
    }
  }

  const researchSignals: string[] = [];
  if (confirmed.length > 0) {
    researchSignals.push(
      `${confirmed.length} CONFIRMED catalogue↔observation delta(s) — refresh CRM pricing benchmarks / history when verified`,
    );
  }
  if (needsVerification.some((c) => c.kind === "annual_discount_changed")) {
    researchSignals.push(
      "Annual discount drift detected — research report should recompute only after CONFIRMED",
    );
  }
  if (
    needsVerification.some(
      (c) =>
        c.kind === "ai_addon_introduced" || c.kind === "ai_pricing_changed",
    )
  ) {
    researchSignals.push(
      "AI pricing signal — do not publish AI premium statistics until CONFIRMED with priced SKUs",
    );
  }
  if (changes.some((c) => c.kind === "starting_price_changed")) {
    researchSignals.push(
      "Starting-price series movement — candidate for pricing-history research update after verification",
    );
  }
  if (researchSignals.length === 0) {
    researchSignals.push(
      "No actionable research signals this run (or only NO_CHANGE)",
    );
  }

  const generatedAt = new Date().toISOString();
  const weekLabel = generatedAt.slice(0, 10);

  let weeklyReportPath: string | null = null;
  if (opts.writeWeeklyReport !== false) {
    const md = formatWeeklyPriceChangesMarkdown({
      generatedAt,
      weekLabel,
      queueSample: queue.items,
      changes,
      affectedPages,
      confirmedApplications: applications,
      editorialCandidates,
      researchSignals,
    });
    weeklyReportPath = path.join(
      process.cwd(),
      "docs/pricing/WEEKLY-PRICE-CHANGES.md",
    );
    writeFileSync(weeklyReportPath, md, "utf8");
  }

  return {
    generatedAt,
    productsScanned: productIds.length,
    changeCount: changes.length,
    confirmedCount: confirmed.length,
    needsVerificationCount: needsVerification.length,
    editorialCandidateCount: editorialCandidates.length,
    growthSignalCount: growthSignals.length,
    verificationTaskCount,
    outdatedMarkCount,
    weeklyReportPath,
    growthSignalsPath,
    verificationTasksPath,
  };
}
