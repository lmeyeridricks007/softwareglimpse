/**
 * Persist MANUAL_REVIEW triage decisions into lifecycle + decision store.
 * Never auto-RETIRE; never fabricate indexability.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import {
  loadContentLifecycleStoreFromDisk,
  persistContentLifecycleStore,
  upsertAndPersistLifecycleEntry,
} from "@/services/seo/content-lifecycle/store-write";
import { getLifecycleEntry } from "@/services/seo/content-lifecycle/store";
import type { ContentLifecycleState } from "@/services/seo/content-lifecycle/types";
import { ENRICHABLE_CLASSES, type ManualReviewReport } from "./types";

export type ApplyManualReviewResult = {
  appliedToImprove: number;
  retainedManualReview: number;
  skippedIndexable: number;
  decisionsPath: string;
};

function targetLifecycle(
  decision: ManualReviewReport["results"][number]["decision"],
  classification: ManualReviewReport["results"][number]["classification"],
): ContentLifecycleState {
  if (ENRICHABLE_CLASSES.has(classification) && decision === "ENQUEUE_ENRICHMENT") {
    return "IMPROVE";
  }
  // Weak / missing / nonsensical — retain MANUAL_REVIEW (editorial gate)
  return "MANUAL_REVIEW";
}

/**
 * Apply triage: enrichable → IMPROVE; others stay MANUAL_REVIEW with notes.
 * Writes `data/seo/compare-manual-review-decisions.json` for audit/enrichment.
 */
export function applyManualReviewTriage(
  report: ManualReviewReport,
  cwd = process.cwd(),
): ApplyManualReviewResult {
  loadContentLifecycleStoreFromDisk();

  let appliedToImprove = 0;
  let retainedManualReview = 0;
  let skippedIndexable = 0;

  const decisionRows: Array<Record<string, unknown>> = [];

  for (const r of report.results) {
    const existing = getLifecycleEntry("comparison", r.slug);
    if (existing?.lifecycle === "INDEXABLE" || existing?.indexable) {
      skippedIndexable += 1;
      decisionRows.push({
        slug: r.slug,
        classification: r.classification,
        decision: r.decision,
        appliedLifecycle: existing.lifecycle,
        skipped: "already_indexable",
        thesis: r.thesis,
        remediation: r.remediation,
      });
      r.appliedLifecycle = null;
      continue;
    }

    const next = targetLifecycle(r.decision, r.classification);
    const notes = [
      `manual-review-triage:${r.classification}`,
      r.thesis ? `thesis:${r.thesis.label}` : "thesis:none",
      ...r.remediation.slice(0, 4),
    ].join(" | ");

    upsertAndPersistLifecycleEntry({
      kind: "comparison",
      slug: r.slug,
      lifecycle: next,
      previousLifecycle: existing?.lifecycle ?? "MANUAL_REVIEW",
      notes,
      updatedAt: new Date().toISOString(),
      passedReasons: existing?.passedReasons,
      indexable: existing?.indexable,
      promotedAt: existing?.promotedAt,
    });

    r.appliedLifecycle = next === "IMPROVE" ? "IMPROVE" : "MANUAL_REVIEW";
    if (next === "IMPROVE") appliedToImprove += 1;
    else retainedManualReview += 1;

    decisionRows.push({
      slug: r.slug,
      classification: r.classification,
      decision: r.decision,
      appliedLifecycle: next,
      evidenceScore: r.evidence.evidenceScore,
      thesis: r.thesis,
      remediation: r.remediation,
      reasons: r.reasons.slice(0, 8),
      retireEligible: r.retireEligible,
    });
  }

  persistContentLifecycleStore();

  const dataDir = path.join(cwd, "data/seo");
  mkdirSync(dataDir, { recursive: true });
  const decisionsPath = path.join(dataDir, "compare-manual-review-decisions.json");
  writeFileSync(
    decisionsPath,
    `${JSON.stringify(
      {
        version: report.version,
        generatedAt: new Date().toISOString(),
        triageGeneratedAt: report.generatedAt,
        summary: {
          appliedToImprove,
          retainedManualReview,
          skippedIndexable,
          total: report.results.length,
        },
        decisions: decisionRows,
      },
      null,
      2,
    )}\n`,
    "utf8",
  );

  report.summary.appliedToImprove = appliedToImprove;
  report.summary.retainedManualReview = retainedManualReview;

  return {
    appliedToImprove,
    retainedManualReview,
    skippedIndexable,
    decisionsPath,
  };
}
