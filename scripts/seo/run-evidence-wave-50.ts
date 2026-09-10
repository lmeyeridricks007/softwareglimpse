#!/usr/bin/env npx tsx
/**
 * FR-003 — top-50 structured product evidence wave (batches of 25).
 *
 *   npm run seo:evidence-wave-50
 *   npm run seo:evidence-wave-50 -- --apply
 *   npm run seo:evidence-wave-50 -- --apply --batch-size 25
 *
 * Priority: GSC + dependents + affiliate + category + Lane A (testing queue).
 * Live vendor plan confirmation only — never fabricates HANDS_ON sessions.
 * After each batch: reconciliation, pricing consistency, unit tests, quality gates.
 * Downstream pages read canonical enrichment stamps (no duplicated price files).
 */
import { execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { getSoftwareBySlug } from "@/data";
import {
  clearPricingVerificationCaches,
  reconcileDataVerifiedCoverage,
} from "@/services/editorial/pricing-verified-at";
import { buildProductTestingQueue } from "@/services/product-testing/queue";
import { runEvidenceQuality } from "@/services/seo/evidence-quality";
import { listSoftwareDependents } from "@/services/seo/software-enrichment/dependents";
import { runSoftwareEnrichmentBatch } from "@/services/seo/software-enrichment";
import { assertPricingConsistency } from "@/services/price-change-monitor/consistency";
import { analyzePageQualityGate } from "@/services/content-quality/gate";
import type { ProductEvidencePack } from "@/services/seo/evidence-quality/types";

const ROOT = process.cwd();
const WAVE_DATE = new Date().toISOString().slice(0, 10);

function nextWaveId(): string {
  const base = `evidence-wave-50-${WAVE_DATE}`;
  const batches = path.join(ROOT, "data/seo/batches");
  if (!existsSync(path.join(batches, base, "summary.json"))) return base;
  let n = 2;
  while (existsSync(path.join(batches, `${base}-pass${n}`, "summary.json"))) {
    n += 1;
  }
  return `${base}-pass${n}`;
}

function argFlag(args: string[], name: string): boolean {
  return args.includes(name);
}

function argValue(args: string[], name: string): string | undefined {
  const idx = args.indexOf(name);
  if (idx >= 0 && args[idx + 1] && !args[idx + 1]!.startsWith("--")) {
    return args[idx + 1];
  }
  return undefined;
}

/** Skip slugs that already failed live verify in a saved pack (retry later). */
function recentlyFailedLive(slug: string): boolean {
  const packPath = path.join(ROOT, "data/seo/evidence-packs", `${slug}.json`);
  if (!existsSync(packPath)) return false;
  try {
    const pack = JSON.parse(
      readFileSync(packPath, "utf8"),
    ) as ProductEvidencePack;
    const v = pack.pricingVerification;
    if (!v?.attempted || v.verified) return false;
    // Hard blocks — do not burn the wave re-hitting the same walls.
    const reason = v.rejectReason ?? "";
    return (
      reason.startsWith("http_403") ||
      reason.startsWith("http_401") ||
      reason.startsWith("http_404") ||
      reason.startsWith("plan_hit_ratio") ||
      reason.startsWith("fetch_failed") ||
      reason === "no_pricing_source_url" ||
      reason === "no_enrichment_plans"
    );
  } catch {
    return false;
  }
}

type BatchGateReport = {
  batchIndex: number;
  slugs: string[];
  promoted: string[];
  alreadyVerified: number;
  verifiedLive: number;
  failedLive: Array<{ slug: string; reason: string | null }>;
  reconciliation: { accepted: number; rejected: number };
  pricingConsistencyFails: number;
  qualityGateSamples: number;
  dependentsTouched: number;
  softwareEnrichApplied: number;
  testsOk: boolean;
};

function selectTop50(limit = 50): string[] {
  // Prefer RESEARCHED (not yet DATA_VERIFIED) so the wave raises coverage.
  // Queue already ranks by GSC + dependents + affiliate + category + Lane A.
  const queue = buildProductTestingQueue(Math.max(200, limit * 4));
  const researched = queue.items
    .filter((i) => i.evidenceLevel === "researched")
    .map((i) => i.productSlug);
  const seen = new Set<string>();
  const out: string[] = [];
  const deferred: string[] = [];
  for (const slug of researched) {
    if (seen.has(slug)) continue;
    seen.add(slug);
    if (recentlyFailedLive(slug)) {
      deferred.push(slug);
      continue;
    }
    out.push(slug);
    if (out.length >= limit) break;
  }
  // Fill with deferred failures only if we lack fresher candidates.
  if (out.length < limit) {
    for (const slug of deferred) {
      if (out.length >= limit) break;
      out.push(slug);
    }
  }
  // Fill only if fewer than `limit` RESEARCHED candidates in priority queue
  if (out.length < limit) {
    for (const item of queue.items) {
      if (out.length >= limit) break;
      if (seen.has(item.productSlug)) continue;
      if (item.evidenceLevel === "data_verified") continue;
      seen.add(item.productSlug);
      out.push(item.productSlug);
    }
  }
  return out;
}

function runBatchGates(slugs: string[]): {
  pricingConsistencyFails: number;
  qualityGateSamples: number;
  testsOk: boolean;
} {
  let pricingConsistencyFails = 0;
  let qualityGateSamples = 0;
  for (const slug of slugs.slice(0, 10)) {
    try {
      const report = assertPricingConsistency(slug);
      if (!report.consistent) pricingConsistencyFails += 1;
    } catch {
      pricingConsistencyFails += 1;
    }
    try {
      const gate = analyzePageQualityGate({
        pageType: "software",
        slug,
      });
      if (gate) qualityGateSamples += 1;
    } catch {
      // optional
    }
  }

  let testsOk = true;
  try {
    execSync(
      "npx vitest run src/services/editorial/pricing-verified-at.test.ts src/services/seo/evidence-quality/evidence-quality.test.ts --reporter=dot",
      { cwd: ROOT, stdio: "pipe", timeout: 180_000 },
    );
  } catch {
    testsOk = false;
  }

  return { pricingConsistencyFails, qualityGateSamples, testsOk };
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const apply = argFlag(args, "--apply");
  const dryRun = argFlag(args, "--dry-run") || !apply;
  const batchSize = Number(argValue(args, "--batch-size") ?? "25");
  const limit = Number(argValue(args, "--limit") ?? "50");
  const WAVE = nextWaveId();

  clearPricingVerificationCaches();
  const before = reconcileDataVerifiedCoverage();
  const selected = selectTop50(limit);

  console.log(
    `FR-003 evidence wave: ${selected.length} products, batch=${batchSize}, mode=${dryRun ? "DRY-RUN" : "APPLY"}`,
  );
  console.log(
    `Before reconcile: accepted=${before.accepted} rejected=${before.rejected}`,
  );
  console.log("Top 10:", selected.slice(0, 10).join(", "));

  const batches: BatchGateReport[] = [];
  const allPromoted: string[] = [];
  const dependentsBySlug: Record<string, number> = {};

  const totalBatches = Math.ceil(selected.length / batchSize);
  for (let i = 0; i < totalBatches; i++) {
    const slugs = selected.slice(i * batchSize, (i + 1) * batchSize);
    console.log(`\n══ Batch ${i + 1}/${totalBatches} (${slugs.length}) ══`);

    const report = await runEvidenceQuality({
      slugs,
      apply: !dryRun,
      writeArtifacts: true,
      skipAlreadyVerified: true,
      waveId: `${WAVE}-b${i + 1}`,
      limit: slugs.length,
    });

    const promoted = report.packs
      .filter((p) => p.promotedToDataVerified)
      .map((p) => p.slug);
    allPromoted.push(...promoted);

    const failedLive = report.packs
      .filter(
        (p) =>
          p.pricingVerification.attempted &&
          !p.pricingVerification.verified &&
          p.evidenceLevelAfter === "researched",
      )
      .map((p) => ({
        slug: p.slug,
        reason: p.pricingVerification.rejectReason,
      }));

    // Canonical enrichment → software overlays (no duplicated price files)
    let softwareEnrichApplied = 0;
    let dependentsTouched = 0;
    if (!dryRun && (promoted.length || slugs.length)) {
      const enrichSlugs = promoted.length ? promoted : slugs.slice(0, 5);
      const enrich = runSoftwareEnrichmentBatch({ slugs: enrichSlugs });
      softwareEnrichApplied = enrich.applied.filter((a) => a.applied).length;
      for (const slug of enrichSlugs) {
        const deps = listSoftwareDependents(slug);
        dependentsBySlug[slug] = deps.length;
        dependentsTouched += deps.length;
      }
    }

    clearPricingVerificationCaches();
    const recon = reconcileDataVerifiedCoverage();
    const gates = runBatchGates(slugs);

    const batchReport: BatchGateReport = {
      batchIndex: i + 1,
      slugs,
      promoted,
      alreadyVerified: report.alreadyDataVerified,
      verifiedLive: report.pricingChecksVerified,
      failedLive,
      reconciliation: {
        accepted: recon.accepted,
        rejected: recon.rejected,
      },
      pricingConsistencyFails: gates.pricingConsistencyFails,
      qualityGateSamples: gates.qualityGateSamples,
      dependentsTouched,
      softwareEnrichApplied,
      testsOk: gates.testsOk,
    };
    batches.push(batchReport);

    console.log(
      `Batch ${i + 1}: liveVerified=${report.pricingChecksVerified} promoted=${promoted.length} already=${report.alreadyDataVerified} recon=${recon.accepted}/${recon.total} tests=${gates.testsOk ? "ok" : "FAIL"} deps≈${dependentsTouched}`,
    );
    for (const p of promoted) {
      console.log(`  PROMOTED ${p}`);
    }
    for (const f of failedLive.slice(0, 8)) {
      console.log(`  FAIL ${f.slug}: ${f.reason}`);
    }
  }

  clearPricingVerificationCaches();
  const after = reconcileDataVerifiedCoverage();
  const gained = after.accepted - before.accepted;
  const allFailed = batches.flatMap((b) => b.failedLive);
  const stillResearched = selected.filter((s) => !allPromoted.includes(s));
  const pricingConflicts = batches.reduce(
    (a, b) => a + b.pricingConsistencyFails,
    0,
  );

  const summary = {
    wave: WAVE,
    fr: "FR-003",
    generatedAt: new Date().toISOString(),
    apply: !dryRun,
    selected,
    productsReviewed: selected.length,
    before: { accepted: before.accepted, rejected: before.rejected },
    after: { accepted: after.accepted, rejected: after.rejected },
    verifiedProductsGained: gained,
    newlyPromotedThisWave: allPromoted,
    stillResearched,
    blockedLive: allFailed,
    pricingConflicts,
    dependentsBySlug,
    totalDependentsAffected: Object.values(dependentsBySlug).reduce(
      (a, b) => a + b,
      0,
    ),
    batches,
  };

  const outDir = path.join(ROOT, "data/seo/batches", WAVE);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(
    path.join(outDir, "summary.json"),
    `${JSON.stringify(summary, null, 2)}\n`,
    "utf8",
  );

  const md = [
    `# FR-003 evidence wave — top 50 (${WAVE_DATE})`,
    "",
    "Live vendor plan confirmation only. No fabricated HANDS_ON sessions.",
    "DATA_VERIFIED never from domainCheckedAt / migration / file mtime.",
    "",
    "## Results",
    "",
    `| Metric | Value |`,
    `| --- | ---: |`,
    `| Selected | ${selected.length} |`,
    `| DATA_VERIFIED before | ${before.accepted} |`,
    `| DATA_VERIFIED after | ${after.accepted} |`,
    `| Verified gained | ${gained} |`,
    `| Newly stamped this wave | ${allPromoted.length} |`,
    `| Still RESEARCHED (this wave) | ${stillResearched.length} |`,
    `| Blocked live verification | ${allFailed.length} |`,
    `| Pricing consistency conflicts (samples) | ${pricingConflicts} |`,
    `| Downstream dependents (flagged) | ${summary.totalDependentsAffected} |`,
    "",
    "## Batches",
    "",
    `| Batch | Live OK | Promoted | Already | Recon accepted | Tests | Deps |`,
    `| --- | ---: | ---: | ---: | ---: | --- | ---: |`,
    ...batches.map(
      (b) =>
        `| ${b.batchIndex} | ${b.verifiedLive} | ${b.promoted.length} | ${b.alreadyVerified} | ${b.reconciliation.accepted} | ${b.testsOk ? "ok" : "FAIL"} | ${b.dependentsTouched} |`,
    ),
    "",
    "## Newly promoted",
    "",
    ...(allPromoted.length
      ? allPromoted.map((s) => {
          const soft = getSoftwareBySlug(s);
          return `- [${soft?.name ?? s}](/software/${s}/) — dependents ${dependentsBySlug[s] ?? "—"}`;
        })
      : ["- None (see live failures / already verified)"]),
    "",
    "## Blocked / still RESEARCHED (sample)",
    "",
    ...(allFailed.length
      ? allFailed
          .slice(0, 25)
          .map((f) => `- \`${f.slug}\`: ${f.reason ?? "live_verify_failed"}`)
      : ["- No live verification failures recorded"]),
    "",
    "## Propagation",
    "",
    "Stamps live on enrichment `pricing.verifiedAt` + `sourceIds`.",
    "Software / pricing / guides / compares / best / alternatives / tools read via",
    "`resolvePricingVerifiedAtForEvidence` — no duplicated page-level price copies.",
    "",
    `Artifacts: \`data/seo/batches/${WAVE}/\``,
    "",
  ].join("\n");

  writeFileSync(
    path.join(ROOT, "docs/seo", `EVIDENCE-WAVE-50-${WAVE_DATE}${WAVE.includes("-pass") ? WAVE.slice(WAVE.indexOf("-pass")) : ""}.md`),
    md,
    "utf8",
  );

  console.log("\n════════ FR-003 SUMMARY ════════");
  console.log(`products reviewed: ${selected.length}`);
  console.log(`verified before→after: ${before.accepted} → ${after.accepted} (Δ ${gained})`);
  console.log(`newly stamped: ${allPromoted.length}`);
  console.log(`still RESEARCHED (wave): ${stillResearched.length}`);
  console.log(`blocked live: ${allFailed.length}`);
  console.log(`pricing conflicts (sample): ${pricingConflicts}`);
  console.log(`dependents affected ≈ ${summary.totalDependentsAffected}`);
  console.log(`Wrote data/seo/batches/${WAVE}/summary.json`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
