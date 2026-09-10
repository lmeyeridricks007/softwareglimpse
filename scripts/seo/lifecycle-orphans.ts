#!/usr/bin/env npx tsx
/**
 * Detect (and optionally demote) LIFECYCLE_ORPHAN registry rows.
 *
 *   npm run seo:lifecycle-orphans
 *   npm run seo:lifecycle-orphans -- --apply
 *   npm run seo:lifecycle-orphans -- --apply --persist
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { loadContentLifecycleStoreFromDisk } from "@/services/seo/content-lifecycle/store-write";
import { runLifecycleOrphanReconcile } from "@/services/seo/content-lifecycle/lifecycle-orphans";

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const apply = args.includes("--apply");
  const persist = args.includes("--persist") || apply;

  loadContentLifecycleStoreFromDisk();
  const report = runLifecycleOrphanReconcile({ apply, persist: apply && persist });

  console.log(
    `Lifecycle orphans: scanned=${report.scanned} orphans=${report.orphanCount} demoted=${report.demoted}`,
  );
  const byReason = report.findings.reduce(
    (acc, f) => {
      acc[f.reason] = (acc[f.reason] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
  console.log("  by reason:", byReason);
  for (const f of report.findings.slice(0, 30)) {
    console.log(`  [${f.reason}] ${f.path} — ${f.detail}`);
  }
  if (report.findings.length > 30) {
    console.log(`  … +${report.findings.length - 30} more`);
  }

  const outDir = path.join(process.cwd(), "data/seo");
  mkdirSync(outDir, { recursive: true });
  const jsonPath = path.join(outDir, "lifecycle-orphans.json");
  writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.log(`Wrote ${jsonPath}`);

  if (!apply && report.orphanCount > 0) {
    console.log("Dry-run only. Pass --apply to demote orphans to IMPROVE.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
