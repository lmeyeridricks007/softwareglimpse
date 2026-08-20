import {
  CRM_VENDOR_SCORECARD_STORAGE_KEY,
  SI_VENDOR_SCORECARD_STORAGE_KEY,
  VendorScorecardStateSchema,
  createEmptyVendorScorecard,
  vendorScorecardStorageKey,
  type VendorScorecardState,
} from "@/domain";

export {
  CRM_VENDOR_SCORECARD_STORAGE_KEY,
  SI_VENDOR_SCORECARD_STORAGE_KEY,
  createEmptyVendorScorecard,
  vendorScorecardStorageKey,
};

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function loadVendorScorecard(
  categorySlug = "crm",
): VendorScorecardState | null {
  if (!canUseStorage()) return null;
  try {
    const raw = localStorage.getItem(vendorScorecardStorageKey(categorySlug));
    if (!raw) return null;
    const parsed = VendorScorecardStateSchema.parse(JSON.parse(raw));
    if (parsed.categorySlug !== categorySlug) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveVendorScorecard(state: VendorScorecardState): void {
  if (!canUseStorage()) return;
  try {
    const next = VendorScorecardStateSchema.parse({
      ...state,
      updatedAt: new Date().toISOString(),
    });
    localStorage.setItem(
      vendorScorecardStorageKey(next.categorySlug),
      JSON.stringify(next),
    );
  } catch {
    // Never break UX on storage failures.
  }
}

export function resetVendorScorecard(
  categorySlug = "crm",
): VendorScorecardState {
  const empty = createEmptyVendorScorecard(categorySlug);
  if (canUseStorage()) {
    try {
      localStorage.removeItem(vendorScorecardStorageKey(categorySlug));
    } catch {
      // ignore
    }
  }
  return empty;
}

/** Clear only user ratings, notes, demo checklist, and status — keep shortlist/weights. */
export function resetUserEvaluationOnly(
  state: VendorScorecardState,
): VendorScorecardState {
  return VendorScorecardStateSchema.parse({
    ...state,
    productAssessments: state.productAssessments.map((a) => ({
      ...a,
      userRatings: [],
      notes: undefined,
      status: undefined,
      demoChecklist: [],
    })),
    combinationSettings: state.combinationSettings
      ? { ...state.combinationSettings, enabled: false }
      : undefined,
    updatedAt: new Date().toISOString(),
  });
}

export function touchVendorScorecard(
  state: VendorScorecardState,
  patch: Partial<VendorScorecardState>,
): VendorScorecardState {
  return VendorScorecardStateSchema.parse({
    ...state,
    ...patch,
    updatedAt: new Date().toISOString(),
  });
}
