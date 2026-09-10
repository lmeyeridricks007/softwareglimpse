#!/usr/bin/env npx tsx
/**
 * Software Price Change Monitor
 *
 * Usage:
 *   npm run pricing:monitor
 *   npm run pricing:monitor -- --limit 30
 *   npm run pricing:monitor -- --apply-confirmed
 *   npm run pricing:monitor -- --apply-confirmed --append-observations
 *   npm run pricing:confirm -- --task <id>
 *   npm run pricing:confirm -- --reject --task <id>
 */
import {
  confirmPricingVerificationTask,
  rejectPricingVerificationTask,
  runPriceChangeMonitor,
} from "@/services/price-change-monitor/server";

function flag(name: string): boolean {
  return process.argv.includes(name);
}

function argValue(name: string): string | null {
  const idx = process.argv.indexOf(name);
  if (idx === -1) return null;
  return process.argv[idx + 1] ?? null;
}

function intFlag(name: string, fallback: number): number {
  const raw = argValue(name);
  const n = raw ? Number(raw) : NaN;
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

function main() {
  const taskId = argValue("--task");
  if (taskId) {
    if (flag("--reject")) {
      const rejected = rejectPricingVerificationTask(taskId, {
        reason: argValue("--reason") ?? undefined,
      });
      console.log("pricing-verification rejected", rejected.id, rejected.productId);
      return;
    }
    const result = confirmPricingVerificationTask(taskId);
    console.log("pricing-verification confirmed");
    console.log(`  taskId: ${result.taskId}`);
    console.log(`  productId: ${result.productId}`);
    console.log(`  observationAppended: ${result.observationAppended}`);
    console.log(`  canonicalUpdated: ${result.canonicalUpdated}`);
    console.log(`  changeEventId: ${result.changeEventId}`);
    console.log(`  refreshCandidates: ${result.refreshCandidates.length}`);
    console.log(
      `  refreshOrder (first 8): ${result.refreshOrder
        .slice(0, 8)
        .map((p) => `t${p.refreshTier}:${p.path}`)
        .join(", ")}`,
    );
    console.log(
      `  outdatedMarksRemaining: ${result.outdatedMarksRemaining} (clear after page refresh)`,
    );
    return;
  }

  const result = runPriceChangeMonitor({
    limit: intFlag("--limit", 50),
    applyConfirmed: flag("--apply-confirmed"),
    appendObservations: flag("--append-observations"),
    writeWeeklyReport: !flag("--no-report"),
    writeGrowthSignals: !flag("--no-growth-signals"),
    writeVerificationTasks: !flag("--no-verification-tasks"),
    markOutdatedPricing: !flag("--no-outdated-marks"),
  });

  console.log("price-change-monitor");
  console.log(`  productsScanned: ${result.productsScanned}`);
  console.log(`  changes: ${result.changeCount}`);
  console.log(`  confirmed: ${result.confirmedCount}`);
  console.log(`  needsVerification: ${result.needsVerificationCount}`);
  console.log(`  editorialCandidates: ${result.editorialCandidateCount}`);
  console.log(`  growthSignals: ${result.growthSignalCount}`);
  console.log(`  verificationTasksPending: ${result.verificationTaskCount}`);
  console.log(`  outdatedMarksWritten: ${result.outdatedMarkCount}`);
  if (result.weeklyReportPath) {
    console.log(`  weeklyReport: ${result.weeklyReportPath}`);
  }
  if (result.growthSignalsPath) {
    console.log(`  growthSignalsFile: ${result.growthSignalsPath}`);
  }
  if (result.verificationTasksPath) {
    console.log(`  verificationTasks: ${result.verificationTasksPath}`);
  }
  console.log(
    "\nUnverified (LIKELY / REQUIRES_REVIEW) must not be published as pricing facts.",
  );
  console.log(
    "Confirm a task: npm run pricing:confirm -- --task <id>",
  );
}

main();
