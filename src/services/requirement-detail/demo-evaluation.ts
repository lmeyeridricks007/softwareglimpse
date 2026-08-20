import {
  VendorScorecardStateSchema,
  type DemoChecklistItem,
  type DemoChecklistResult,
  type VendorScorecardState,
} from "@/domain";
import {
  loadCrmDecisionProfile,
  loadDecisionProfile,
  loadSiDecisionProfile,
  saveCrmDecisionProfile,
  saveDecisionProfile,
  saveSiDecisionProfile,
  touchCrmDecisionProfile,
  touchDecisionProfile,
  touchSiDecisionProfile,
  createEmptyCrmDecisionProfile,
  createEmptyDecisionProfile,
  createEmptySiDecisionProfile,
} from "@/services/decision-profile/persistence";
import {
  createEmptyVendorScorecard,
  loadVendorScorecard,
  saveVendorScorecard,
  touchVendorScorecard,
} from "@/services/vendor-scorecard/persistence";

export const DEMO_RESULT_LABELS: Record<DemoChecklistResult, string> = {
  "not-tested": "Not tested",
  "fully-demonstrated": "Fully demonstrated",
  "partially-demonstrated": "Partially demonstrated",
  "not-demonstrated": "Not demonstrated",
  "needs-follow-up": "Needs follow-up",
};

/**
 * Upsert a user demo-test result into Vendor Scorecard state.
 * Never rewrites SoftwareGlimpse research assessments.
 */
export function upsertRequirementDemoResult(input: {
  requirementId: string;
  productId: string;
  result: DemoChecklistResult;
  notes?: string;
  categorySlug?: string;
}): VendorScorecardState {
  const categorySlug = input.categorySlug ?? "crm";
  const existing =
    loadVendorScorecard(categorySlug) ??
    createEmptyVendorScorecard(categorySlug);

  const productIds = existing.productIds.includes(input.productId)
    ? existing.productIds
    : [...existing.productIds, input.productId].slice(0, 5);

  const assessments = [...existing.productAssessments];
  let row = assessments.find((a) => a.productId === input.productId);
  if (!row) {
    row = { productId: input.productId, userRatings: [], demoChecklist: [] };
    assessments.push(row);
  }

  const checklist: DemoChecklistItem[] = row.demoChecklist.filter(
    (d) => d.requirementId !== input.requirementId,
  );
  checklist.push({
    requirementId: input.requirementId,
    result: input.result,
    notes: input.notes?.trim() || undefined,
  });

  const next = touchVendorScorecard(existing, {
    productIds,
    productAssessments: assessments.map((a) =>
      a.productId === input.productId
        ? { ...a, demoChecklist: checklist }
        : a,
    ),
  });
  saveVendorScorecard(next);
  return VendorScorecardStateSchema.parse(next);
}

/**
 * Add requirement to CRMDecisionProfile so Demo Checklist Builder / Scorecard
 * can pick it up later. Shared evaluation state — not isolated.
 */
export function addRequirementToDemoChecklistProfile(
  requirementId: string,
  priority: "must-have" | "important" | "nice-to-have" = "must-have",
  categorySlug: string = "crm",
): void {
  const isSi = categorySlug === "sales-intelligence";
  const isCrm = categorySlug === "crm";
  const profile = isSi
    ? (loadSiDecisionProfile() ?? createEmptySiDecisionProfile())
    : isCrm
      ? (loadCrmDecisionProfile() ?? createEmptyCrmDecisionProfile())
      : (loadDecisionProfile(categorySlug as Parameters<
          typeof createEmptyDecisionProfile
        >[0]) ??
        createEmptyDecisionProfile(
          categorySlug as Parameters<typeof createEmptyDecisionProfile>[0],
        ));
  const existing = profile.requirements.find((r) => r.id === requirementId);
  const requirements = existing
    ? profile.requirements.map((r) =>
        r.id === requirementId ? { ...r, priority } : r,
      )
    : [
        ...profile.requirements,
        { id: requirementId, priority, source: "user-selected" as const },
      ];

  if (isSi) {
    saveSiDecisionProfile(touchSiDecisionProfile(profile, { requirements }));
  } else if (isCrm) {
    saveCrmDecisionProfile(touchCrmDecisionProfile(profile, { requirements }));
  } else {
    saveDecisionProfile(touchDecisionProfile(profile, { requirements }));
  }

  // Also ensure a Vendor Scorecard checklist row exists (not-tested) for shortlist.
  const scorecard =
    loadVendorScorecard(categorySlug) ??
    createEmptyVendorScorecard(categorySlug);
  const productIds =
    scorecard.productIds.length > 0
      ? scorecard.productIds
      : profile.shortlistProductIds.slice(0, 5);

  if (productIds.length === 0) {
    saveVendorScorecard(
      touchVendorScorecard(scorecard, {
        productIds: [],
      }),
    );
    return;
  }

  const assessments = productIds.map((productId) => {
    const row =
      scorecard.productAssessments.find((a) => a.productId === productId) ?? {
        productId,
        userRatings: [],
        demoChecklist: [] as DemoChecklistItem[],
      };
    const has = row.demoChecklist.some(
      (d) => d.requirementId === requirementId,
    );
    return {
      ...row,
      demoChecklist: has
        ? row.demoChecklist
        : [
            ...row.demoChecklist,
            { requirementId, result: "not-tested" as const },
          ],
    };
  });

  saveVendorScorecard(
    touchVendorScorecard(scorecard, {
      productIds,
      productAssessments: assessments,
    }),
  );
}

export function getShortlistDemoResults(input: {
  requirementId: string;
  categorySlug?: string;
}): Array<{
  productId: string;
  result: DemoChecklistResult;
  notes?: string;
}> {
  const state = loadVendorScorecard(input.categorySlug ?? "crm");
  const profile = loadCrmDecisionProfile();
  const shortlist =
    profile?.shortlistProductIds?.length
      ? profile.shortlistProductIds
      : (state?.productIds ?? []);

  if (!state || shortlist.length === 0) return [];

  return shortlist.map((productId) => {
    const row = state.productAssessments.find((a) => a.productId === productId);
    const item = row?.demoChecklist.find(
      (d) => d.requirementId === input.requirementId,
    );
    return {
      productId,
      result: item?.result ?? "not-tested",
      notes: item?.notes,
    };
  });
}
