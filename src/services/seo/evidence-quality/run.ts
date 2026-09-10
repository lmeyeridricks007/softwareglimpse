import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import {
  clearPricingVerificationCaches,
  reconcileDataVerifiedCoverage,
} from "@/services/editorial/pricing-verified-at";
import { buildProductTestingQueue } from "@/services/product-testing/queue";
import { buildProductEvidencePack } from "./build-pack";
import { verifyPricingAgainstVendor } from "./verify-pricing";
import { runEvidenceLanguageQa } from "./language-qa";
import { renderEvidenceQualityMarkdown } from "./report";
import type { EvidenceQualityReport, ProductEvidencePack } from "./types";
import { EVIDENCE_QUALITY_VERSION } from "./types";

export type RunEvidenceQualityOptions = {
  /** Priority products to pack/verify (default 40). */
  limit?: number;
  /** Explicit slug list — overrides queue selection when provided. */
  slugs?: string[];
  /** Skip products already DATA_VERIFIED / hands-on (default true for waves). */
  skipAlreadyVerified?: boolean;
  /** Persist enrichment DATA_VERIFIED stamps when live check passes. */
  apply?: boolean;
  /** Also write docs + JSON artifacts. */
  writeArtifacts?: boolean;
  waveId?: string;
  cwd?: string;
};

function packPath(cwd: string, slug: string): string {
  return path.join(cwd, "data/seo/evidence-packs", `${slug}.json`);
}

function savePack(cwd: string, pack: ProductEvidencePack): void {
  const file = packPath(cwd, pack.slug);
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, `${JSON.stringify(pack, null, 2)}\n`, "utf8");
}

/**
 * Phase 1–5 evidence quality run:
 * normalize packs → live pricing verify → promote when policy accepts →
 * language QA → testing queue top 10 → schema/reconciliation notes.
 *
 * Never fabricates ProductTestSession / hands-on claims.
 */
export async function runEvidenceQuality(
  options: RunEvidenceQualityOptions = {},
): Promise<EvidenceQualityReport> {
  const cwd = options.cwd ?? process.cwd();
  const limit = options.limit ?? 40;
  const apply = options.apply === true;
  const writeArtifacts = options.writeArtifacts !== false;
  const waveId =
    options.waveId ??
    `evidence-quality-${new Date().toISOString().slice(0, 10)}`;

  clearPricingVerificationCaches();

  const skipAlready = options.skipAlreadyVerified !== false;
  const explicitSlugs = options.slugs?.filter(Boolean) ?? [];
  const priority = explicitSlugs.length
    ? {
        items: explicitSlugs.map((productSlug, i) => ({
          rank: i + 1,
          productSlug,
        })),
      }
    : buildProductTestingQueue(limit);

  const packs: ProductEvidencePack[] = [];
  let pricingChecksAttempted = 0;
  let pricingChecksVerified = 0;
  let promotedToDataVerified = 0;
  let alreadyDataVerified = 0;
  let stampIndex = 0;

  for (const item of priority.items) {
    const pack = buildProductEvidencePack(item.productSlug);
    if (!pack) continue;

    if (pack.evidenceLevelBefore === "data_verified") {
      alreadyDataVerified += 1;
      if (skipAlready) {
        packs.push(pack);
        if (writeArtifacts) savePack(cwd, pack);
        continue;
      }
    }
    if (
      skipAlready &&
      pack.evidenceLevelBefore === "hands_on_tested"
    ) {
      packs.push(pack);
      if (writeArtifacts) savePack(cwd, pack);
      continue;
    }

    // Skip live verify when already DATA_VERIFIED / hands-on — still normalize pack.
    const shouldVerify =
      pack.evidenceLevelBefore === "researched" &&
      pack.plans.length > 0 &&
      pack.pricingSourceCount > 0;

    if (shouldVerify) {
      const verification = await verifyPricingAgainstVendor(pack, {
        apply,
        stampIndex: stampIndex++,
      });
      pack.pricingVerification = verification;
      if (verification.attempted) pricingChecksAttempted += 1;
      if (verification.verified) pricingChecksVerified += 1;

      if (verification.stampApplied) {
        pack.promotedToDataVerified = true;
        pack.evidenceLevelAfter = "data_verified";
        pack.researchTimestamps.enrichmentPricingVerifiedAt =
          verification.verifiedAt;
        promotedToDataVerified += 1;
        pack.notes.push(
          `DATA_VERIFIED via live vendor plan confirmation (${verification.sourceUrl})`,
        );
      } else if (verification.verified && !apply) {
        pack.notes.push(
          "Live vendor plan confirmation passed — re-run with --apply to stamp",
        );
      } else if (verification.rejectReason) {
        pack.notes.push(`Pricing verify: ${verification.rejectReason}`);
      }
    } else if (pack.evidenceLevelBefore !== "researched") {
      pack.notes.push("Skipped live verify — already elevated");
    }

    // Re-resolve after possible stamp
    if (apply && pack.promotedToDataVerified) {
      const refreshed = buildProductEvidencePack(pack.slug);
      if (refreshed) {
        pack.evidenceLevelAfter = refreshed.evidenceLevelBefore;
        pack.researchTimestamps = refreshed.researchTimestamps;
      }
    }

    packs.push(pack);
    if (writeArtifacts) savePack(cwd, pack);
  }

  const languageQa = runEvidenceLanguageQa(cwd);

  clearPricingVerificationCaches();
  const recon = reconcileDataVerifiedCoverage();
  const schemaQaNotes: string[] = [
    `Reconciliation accepted DATA_VERIFIED stamps: ${recon.accepted}`,
    `Reconciliation rejected: ${recon.rejected}`,
    `Source coverage: ${(recon.sourceCoverage.acceptedShare * 100).toFixed(1)}%`,
    "No AggregateRating / fabricated Review schema in this pass — trust uses editorial timestamps only.",
    "Hands-on tested remains 0 until a completed ProductTestSession exists.",
  ];
  if (recon.accepted > 0 && recon.sourceCoverage.confidence === "high") {
    schemaQaNotes.push("Schema/evidence reconciliation confidence: high");
  }

  const testingQueue = buildProductTestingQueue(10);

  const report: EvidenceQualityReport = {
    version: EVIDENCE_QUALITY_VERSION,
    generatedAt: new Date().toISOString(),
    waveId,
    priorityLimit: limit,
    packsBuilt: packs.length,
    pricingChecksAttempted,
    pricingChecksVerified,
    promotedToDataVerified,
    retainedResearched: packs.filter(
      (p) => p.evidenceLevelAfter === "researched",
    ).length,
    alreadyDataVerified,
    languageHits: languageQa.length,
    schemaQaOk: languageQa.length === 0,
    schemaQaNotes,
    testingQueueTop10: testingQueue.items.map((i) => ({
      rank: i.rank,
      slug: i.productSlug,
      name: i.productName,
      evidencePriorityScore: i.evidencePriorityScore,
      comparisonCount: i.comparisonCount,
      opportunityScore: i.opportunityScore,
      impressions: i.impressions,
      evidenceLevel: i.evidenceLevel,
    })),
    packs,
    languageQa,
  };

  if (writeArtifacts) {
    const jsonPath = path.join(
      cwd,
      "data/seo",
      "evidence-quality-report.json",
    );
    mkdirSync(path.dirname(jsonPath), { recursive: true });
    writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

    const mdPath = path.join(
      cwd,
      "docs/seo",
      `EVIDENCE-QUALITY-${waveId.replace(/^evidence-quality-/, "").toUpperCase()}.md`,
    );
    // Prefer stable dated name
    const dated = path.join(
      cwd,
      "docs/seo",
      `EVIDENCE-QUALITY-${new Date().toISOString().slice(0, 10)}.md`,
    );
    const target = existsSync(path.dirname(dated)) ? dated : mdPath;
    writeFileSync(target, renderEvidenceQualityMarkdown(report), "utf8");
  }

  return report;
}
