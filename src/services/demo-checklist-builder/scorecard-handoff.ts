/**
 * Handoff demo results → Vendor Scorecard without silent overwrite.
 */

import type {
  CrmDemoChecklistSession,
  DemoChecklistResult,
  DemoEvidenceStatus,
  DemoItemResult,
  DemoTaskResult,
  MustHaveGateResult,
} from "@/domain";
import {
  createEmptyVendorScorecard,
  loadVendorScorecard,
  saveVendorScorecard,
  touchVendorScorecard,
} from "@/services/vendor-scorecard/persistence";

export type ScorecardHandoffPreviewItem = {
  productId: string;
  requirementId: string;
  proposedResult: DemoChecklistResult;
  existingResult?: DemoChecklistResult;
  willOverwrite: boolean;
  notes?: string;
};

function mapTaskResultToDemoChecklist(
  result?: DemoTaskResult,
  gate?: MustHaveGateResult,
  evidence?: DemoEvidenceStatus,
): DemoChecklistResult {
  if (gate === "fail") return "not-demonstrated";
  if (gate === "pass") return "fully-demonstrated";
  if (result === "completed") return "fully-demonstrated";
  if (result === "completed-with-limitation") return "partially-demonstrated";
  if (result === "unable" || result === "not-demonstrated") {
    return "not-demonstrated";
  }
  if (result === "follow-up-required") return "needs-follow-up";
  if (evidence === "requires-follow-up") return "needs-follow-up";
  return "not-tested";
}

function collectRequirementResults(
  session: CrmDemoChecklistSession,
  vendorId: string,
): Array<{
  requirementId: string;
  result: DemoItemResult;
}> {
  const vendor = session.draft.vendorEvaluations.find(
    (v) => v.vendorId === vendorId,
  );
  if (!vendor) return [];

  const out: Array<{ requirementId: string; result: DemoItemResult }> = [];
  for (const scenario of session.draft.scenarios.filter((s) => s.included)) {
    const itemResult = vendor.results.find((r) => r.itemId === scenario.id);
    if (!itemResult) continue;
    for (const requirementId of scenario.requirementIds) {
      out.push({ requirementId, result: itemResult });
    }
  }
  // Explicit requirement gates
  for (const r of vendor.results.filter((x) => x.itemType === "requirement-gate")) {
    out.push({ requirementId: r.itemId, result: r });
  }
  return out;
}

export function previewScorecardHandoff(
  session: CrmDemoChecklistSession,
  options: {
    vendorId?: string;
    overwriteExisting?: boolean;
    categorySlug?: string;
  } = {},
): ScorecardHandoffPreviewItem[] {
  const categorySlug = options.categorySlug ?? "crm";
  const vendor =
    session.draft.vendorEvaluations.find(
      (v) => v.vendorId === (options.vendorId ?? session.draft.activeVendorId),
    ) ?? session.draft.vendorEvaluations[0];
  if (!vendor?.productId) return [];

  const scorecard =
    loadVendorScorecard(categorySlug) ??
    createEmptyVendorScorecard(categorySlug);
  const existing = scorecard.productAssessments.find(
    (a) => a.productId === vendor.productId,
  );

  const preview: ScorecardHandoffPreviewItem[] = [];
  for (const row of collectRequirementResults(session, vendor.vendorId)) {
    const proposed = mapTaskResultToDemoChecklist(
      row.result.result,
      row.result.mustHaveGate,
      row.result.evidenceStatus,
    );
    const prior = existing?.demoChecklist.find(
      (d) => d.requirementId === row.requirementId,
    );
    const willOverwrite = Boolean(
      prior &&
        prior.result !== "not-tested" &&
        prior.result !== proposed,
    );
    if (willOverwrite && !options.overwriteExisting) {
      preview.push({
        productId: vendor.productId,
        requirementId: row.requirementId,
        proposedResult: proposed,
        existingResult: prior?.result,
        willOverwrite: true,
        notes: row.result.evaluatorNotes,
      });
      continue;
    }
    preview.push({
      productId: vendor.productId,
      requirementId: row.requirementId,
      proposedResult: proposed,
      existingResult: prior?.result,
      willOverwrite,
      notes: row.result.evaluatorNotes,
    });
  }
  return preview;
}

/**
 * Apply handoff. Skips rows that would overwrite unless overwriteExisting=true.
 */
export function applyScorecardHandoff(
  session: CrmDemoChecklistSession,
  options: {
    vendorId?: string;
    overwriteExisting?: boolean;
    categorySlug?: string;
  } = {},
): { applied: number; skipped: number } {
  const categorySlug = options.categorySlug ?? "crm";
  const preview = previewScorecardHandoff(session, {
    ...options,
    overwriteExisting: true,
  });
  if (preview.length === 0) return { applied: 0, skipped: 0 };

  const productId = preview[0]!.productId;
  const scorecard =
    loadVendorScorecard(categorySlug) ??
    createEmptyVendorScorecard(categorySlug);

  const productIds = scorecard.productIds.includes(productId)
    ? scorecard.productIds
    : [...scorecard.productIds, productId].slice(0, 5);

  let applied = 0;
  let skipped = 0;

  const assessments = [...scorecard.productAssessments];
  let row = assessments.find((a) => a.productId === productId);
  if (!row) {
    row = { productId, userRatings: [], demoChecklist: [] };
    assessments.push(row);
  }

  let checklist = [...row.demoChecklist];
  for (const item of preview) {
    const existing = checklist.find(
      (d) => d.requirementId === item.requirementId,
    );
    if (
      existing &&
      existing.result !== "not-tested" &&
      existing.result !== item.proposedResult &&
      !options.overwriteExisting
    ) {
      skipped += 1;
      continue;
    }
    checklist = checklist.filter((d) => d.requirementId !== item.requirementId);
    checklist.push({
      requirementId: item.requirementId,
      result: item.proposedResult,
      notes: item.notes?.trim() || undefined,
    });
    applied += 1;
  }

  saveVendorScorecard(
    touchVendorScorecard(scorecard, {
      productIds,
      productAssessments: assessments.map((a) =>
        a.productId === productId ? { ...a, demoChecklist: checklist } : a,
      ),
    }),
  );

  return { applied, skipped };
}

export type VendorComparisonRow = {
  category: string;
  scores: Record<string, number | null>;
};

export function buildVendorComparison(
  session: CrmDemoChecklistSession,
): {
  vendors: Array<{ id: string; label: string }>;
  rows: VendorComparisonRow[];
  mustHaveFails: Record<string, number>;
  notVerified: Record<string, number>;
} {
  const vendors = session.draft.vendorEvaluations.map((v) => ({
    id: v.vendorId,
    label: v.vendorLabel || v.vendorId,
  }));

  const categories = [
    { id: "pipeline", match: /pipeline|opportunity|lead/i },
    { id: "automation", match: /automation|workflow/i },
    { id: "reporting", match: /report|dashboard|forecast/i },
    { id: "admin", match: /admin|permission|custom/i },
    { id: "integrations", match: /integrat|email|api/i },
  ];

  const rows: VendorComparisonRow[] = categories.map((cat) => {
    const scores: Record<string, number | null> = {};
    for (const vendor of session.draft.vendorEvaluations) {
      const relevant = vendor.results.filter((r) => {
        const scenario = session.draft.scenarios.find((s) => s.id === r.itemId);
        const admin = session.draft.adminTasks.find((t) => t.id === r.itemId);
        const label = scenario?.categoryId || admin?.category || "";
        return cat.match.test(label) && typeof r.score === "number";
      });
      if (relevant.length === 0) {
        scores[vendor.vendorId] = null;
      } else {
        scores[vendor.vendorId] =
          Math.round(
            (relevant.reduce((s, r) => s + (r.score ?? 0), 0) /
              relevant.length) *
              10,
          ) / 10;
      }
    }
    return {
      category: cat.id,
      scores,
    };
  });

  const mustHaveFails: Record<string, number> = {};
  const notVerified: Record<string, number> = {};
  for (const vendor of session.draft.vendorEvaluations) {
    mustHaveFails[vendor.vendorId] = vendor.results.filter(
      (r) => r.mustHaveGate === "fail",
    ).length;
    notVerified[vendor.vendorId] = vendor.results.filter(
      (r) => r.evidenceStatus === "not-verified",
    ).length;
  }

  return { vendors, rows, mustHaveFails, notVerified };
}
