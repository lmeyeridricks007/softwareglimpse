import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { reconcileDataVerifiedCoverage } from "@/services/editorial/pricing-verified-at";
import { buildGrowthDashboard } from "./build";
import { formatGrowthDashboardMarkdown } from "./report";
import type { GrowthDashboardReport } from "./types";

export type RunGrowthDashboardOptions = {
  cwd?: string;
  write?: boolean;
  outJson?: string;
  outMd?: string;
};

export function runGrowthDashboard(
  opts: RunGrowthDashboardOptions = {},
): GrowthDashboardReport {
  const cwd = opts.cwd ?? process.cwd();
  const report = buildGrowthDashboard({ cwd });

  if (opts.write !== false) {
    const jsonPath =
      opts.outJson ?? path.join(cwd, "data/seo/growth-dashboard.json");
    const mdPath =
      opts.outMd ?? path.join(cwd, "docs/seo/GROWTH-DASHBOARD.md");
    const reconPath = path.join(cwd, "data/seo/data-verified-reconciliation.json");
    const reconMd = path.join(cwd, "docs/editorial/DATA-VERIFIED-RECONCILIATION.md");
    mkdirSync(path.dirname(jsonPath), { recursive: true });
    mkdirSync(path.dirname(mdPath), { recursive: true });
    mkdirSync(path.dirname(reconPath), { recursive: true });
    writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
    writeFileSync(mdPath, formatGrowthDashboardMarkdown(report), "utf8");

    const recon = reconcileDataVerifiedCoverage();
    writeFileSync(reconPath, `${JSON.stringify(recon, null, 2)}\n`, "utf8");
    writeFileSync(
      reconMd,
      [
        "# DATA_VERIFIED reconciliation",
        "",
        `Generated with Growth Dashboard ${report.engineVersion} at ${report.generatedAt}.`,
        "",
        "## Counts",
        "",
        `| Metric | Value |`,
        `| --- | ---: |`,
        `| Total products | ${recon.total} |`,
        `| Accepted DATA_VERIFIED stamps | ${recon.accepted} |`,
        `| Rejected (not data verification) | ${recon.rejected} |`,
        `| Source coverage (accepted share) | ${(recon.sourceCoverage.acceptedShare * 100).toFixed(1)}% |`,
        `| Reconciliation confidence | ${recon.sourceCoverage.confidence} |`,
        "",
        "## Accepted by source",
        "",
        ...Object.entries(recon.bySource).map(
          ([k, v]) => `- \`${k}\`: ${v}`,
        ),
        "",
        "## Accepted by source type",
        "",
        ...Object.entries(recon.bySourceType).map(
          ([k, v]) => `- \`${k}\`: ${v}`,
        ),
        "",
        "## Reject reasons",
        "",
        ...Object.entries(recon.byRejectReason).map(
          ([k, v]) => `- \`${k}\`: ${v}`,
        ),
        "",
        "## Suspicious mass dates (rejected candidates)",
        "",
        recon.suspiciousMassDates.length === 0
          ? "_None._"
          : recon.suspiciousMassDates
              .map((d) => `- ${d.date}: ${d.rejectedCount} products`)
              .join("\n"),
        "",
        "## Mass identical ISO stamps (backfill signal)",
        "",
        recon.massIdenticalStamps.length === 0
          ? "_None._"
          : recon.massIdenticalStamps
              .slice(0, 12)
              .map((s) => `- \`${s.stamp}\`: ${s.count} products`)
              .join("\n"),
        "",
        "## Accepted examples (evidence trace)",
        "",
        recon.examples.accepted.length === 0
          ? "_None currently accepted — catalogue stamps are research/import clocks._"
          : recon.examples.accepted
              .map(
                (e) =>
                  `- **${e.slug}**: field \`${e.field}\` · ${e.acceptedAt} · source \`${e.source}\` (${e.sourceType}) · method \`${e.verificationMethod}\``,
              )
              .join("\n"),
        "",
        "## Policy",
        "",
        "Accepted: `software.pricingVerifiedAt`, `software.pricing.verifiedAt`, or enrichment `pricing.verifiedAt` with `sourceIds` that is **not** an updatedAt/generatedAt twin, not equal to any `domainCheckedAt` research clock, and not a mass-identical ISO shared by ≥3 products.",
        "",
        "Rejected (never auto DATA_VERIFIED): file mtime, generatedAt, migration/build/import/content-generation/backfill timestamps, enrichment.updatedAt twins, domainCheckedAt clocks, mass identical stamps.",
        "",
        "Full per-product traces: `data/seo/data-verified-reconciliation.json` → `traces[]`.",
        "",
      ].join("\n"),
      "utf8",
    );
  }

  return report;
}
