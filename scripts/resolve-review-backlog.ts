#!/usr/bin/env tsx
/**
 * Resolve REVIEW backlog URLs without mapping destinations.
 *
 *   npm run migration:resolve-review-backlog
 *   npm run migration:resolve-review-backlog -- --patch-plan
 *   npm run migration:resolve-review-backlog -- --finalize   # promote implemented REVIEW→301
 */
import fs from "node:fs";
import path from "node:path";
import { EXISTING_APP_ALIASES } from "@/services/legacy-url-migration/redirect-plan/policy";
import {
  loadLegacyRedirectsFile,
  legacyRedirectsConfigPath,
} from "@/services/legacy-url-migration/redirect-plan/load-redirects";
import {
  resolveAllReviewBacklog,
  reviewBacklogConfigPath,
  toReviewBacklogFile,
} from "@/services/legacy-url-migration/redirect-plan/review-backlog-resolver";
import { normalizeMigrationPath } from "@/services/legacy-url-migration/normalize";
import type { UrlMappingRow } from "@/services/legacy-url-migration/mapping-agent/types";

function finalizeImplementedReviewRows(rows: UrlMappingRow[]): number {
  const redirectSources = new Set(
    loadLegacyRedirectsFile(legacyRedirectsConfigPath()).redirects.map((r) =>
      normalizeMigrationPath(r.source),
    ),
  );
  let promoted = 0;
  for (const row of rows) {
    if (row.recommendedAction !== "REVIEW" || !row.newPath) continue;
    const source = normalizeMigrationPath(row.legacyPath);
    if (!redirectSources.has(source)) continue;
    row.recommendedAction = "301_REDIRECT";
    row.relationship =
      row.relationship === "MERGED_INTO" ? "EQUIVALENT" : row.relationship;
    row.confidence = "HIGH";
    if (!row.reason.includes("Launch-approved")) {
      row.reason = `Launch-approved redirect: ${row.reason}`;
    }
    promoted += 1;
  }
  return promoted;
}

function main() {
  const patchPlan = process.argv.includes("--patch-plan");
  const finalize = process.argv.includes("--finalize");

  const planPath = path.join(
    process.cwd(),
    "docs/migration/data/url-mapping-plan.json",
  );

  if (finalize) {
    const rows = JSON.parse(fs.readFileSync(planPath, "utf8")) as UrlMappingRow[];
    const promoted = finalizeImplementedReviewRows(rows);
    fs.writeFileSync(planPath, `${JSON.stringify(rows, null, 2)}\n`);
    console.log(`Finalized ${promoted} REVIEW row(s) → 301_REDIRECT`);
    return;
  }

  const { resolutions, unresolved } = resolveAllReviewBacklog();

  const file = toReviewBacklogFile(resolutions);
  const outPath = reviewBacklogConfigPath();
  fs.writeFileSync(outPath, `${JSON.stringify(file, null, 2)}\n`);

  console.log(`Review backlog resolver`);
  console.log(`  301 redirects: ${file.redirects.length}`);
  console.log(`  410 retirements: ${file.retirements.length}`);
  console.log(`  unresolved:      ${unresolved.length}`);
  if (unresolved.length) {
    for (const u of unresolved.slice(0, 20)) {
      console.log(`    - ${u}`);
    }
  }
  console.log(`  wrote ${outPath}`);

  if (patchPlan) {
    const rows = JSON.parse(fs.readFileSync(planPath, "utf8")) as UrlMappingRow[];
    const bySource = new Map<
      string,
      { action: "301" | "410"; destination?: string; reason: string }
    >();

    for (const r of resolutions) {
      bySource.set(normalizeMigrationPath(r.source), {
        action: r.action,
        destination: r.action === "301" ? r.destination : undefined,
        reason: r.reason,
      });
    }
    for (const alias of EXISTING_APP_ALIASES) {
      bySource.set(normalizeMigrationPath(alias.source), {
        action: "301",
        destination: normalizeMigrationPath(alias.destination),
        reason: alias.reason,
      });
    }

    let patched = 0;
    for (const row of rows) {
      const patch = bySource.get(normalizeMigrationPath(row.legacyPath));
      if (!patch) continue;
      if (patch.action === "301" && patch.destination) {
        row.recommendedAction = "301_REDIRECT";
        row.newPath = patch.destination;
        row.newUrl = `https://www.softwareglimpse.com${patch.destination.replace(/\/$/, "")}/`;
        row.relationship = "EQUIVALENT";
        row.confidence = "HIGH";
        row.matchBasis = "explicit_historical";
        row.reason = patch.reason;
      } else if (patch.action === "410") {
        row.recommendedAction = "410";
        row.newPath = null;
        row.newUrl = null;
        row.relationship = "NO_EQUIVALENT";
        row.confidence = "HIGH";
        row.matchBasis = "explicit_historical";
        row.reason = patch.reason;
      }
      patched += 1;
    }
    const promoted = finalizeImplementedReviewRows(rows);
    fs.writeFileSync(planPath, `${JSON.stringify(rows, null, 2)}\n`);
    console.log(`  patched url-mapping-plan.json (${patched} rows)`);
    if (promoted > 0) {
      console.log(`  finalized REVIEW → 301_REDIRECT (${promoted} rows)`);
    }
  }
}

main();
