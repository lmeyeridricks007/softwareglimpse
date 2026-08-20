import {
  CRM_DECISION_PROFILE_STORAGE_KEY,
  SI_DECISION_PROFILE_STORAGE_KEY,
  DecisionProfileSchema,
  createEmptyCrmDecisionProfile,
  createEmptyDecisionProfile,
  createEmptySiDecisionProfile,
  decisionProfileStorageKey,
  type CrmDecisionProfile,
  type DecisionCategorySlug,
  type DecisionProfile,
  type SiDecisionProfile,
} from "@/domain";

export {
  CRM_DECISION_PROFILE_STORAGE_KEY,
  SI_DECISION_PROFILE_STORAGE_KEY,
  createEmptyCrmDecisionProfile,
  createEmptyDecisionProfile,
  createEmptySiDecisionProfile,
  decisionProfileStorageKey,
};

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function loadDecisionProfile(
  category: DecisionCategorySlug,
): DecisionProfile | null {
  if (!canUseStorage()) return null;
  try {
    const raw = localStorage.getItem(decisionProfileStorageKey(category));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    const profile = DecisionProfileSchema.parse(parsed);
    if (profile.categorySlug !== category) return null;
    return profile;
  } catch {
    return null;
  }
}

export function saveDecisionProfile(profile: DecisionProfile): void {
  if (!canUseStorage()) return;
  try {
    const next = DecisionProfileSchema.parse({
      ...profile,
      updatedAt: new Date().toISOString(),
    });
    localStorage.setItem(
      decisionProfileStorageKey(next.categorySlug),
      JSON.stringify(next),
    );
  } catch {
    // Never break UX on storage failures.
  }
}

export function resetDecisionProfile(
  category: DecisionCategorySlug,
): DecisionProfile {
  const empty = createEmptyDecisionProfile(category);
  if (canUseStorage()) {
    try {
      localStorage.removeItem(decisionProfileStorageKey(category));
    } catch {
      // ignore
    }
  }
  return empty;
}

export function touchDecisionProfile(
  profile: DecisionProfile,
  patch: Partial<DecisionProfile>,
): DecisionProfile {
  return DecisionProfileSchema.parse({
    ...profile,
    ...patch,
    categorySlug: patch.categorySlug ?? profile.categorySlug,
    businessContext: {
      ...profile.businessContext,
      ...(patch.businessContext ?? {}),
    },
    budget: {
      ...profile.budget,
      ...(patch.budget ?? {}),
    },
    implementation: {
      ...profile.implementation,
      ...(patch.implementation ?? {}),
    },
    updatedAt: new Date().toISOString(),
  });
}

/** CRM-specific helpers — always use the CRM storage key. */
export function loadCrmDecisionProfile(): CrmDecisionProfile | null {
  return loadDecisionProfile("crm");
}

export function saveCrmDecisionProfile(profile: CrmDecisionProfile): void {
  saveDecisionProfile({ ...profile, categorySlug: "crm" });
}

export function resetCrmDecisionProfile(): CrmDecisionProfile {
  return resetDecisionProfile("crm");
}

export function touchCrmDecisionProfile(
  profile: CrmDecisionProfile,
  patch: Partial<CrmDecisionProfile>,
): CrmDecisionProfile {
  return touchDecisionProfile(profile, { ...patch, categorySlug: "crm" });
}

/** Sales Intelligence helpers — always use the SI storage key. */
export function loadSiDecisionProfile(): SiDecisionProfile | null {
  return loadDecisionProfile("sales-intelligence");
}

export function saveSiDecisionProfile(profile: SiDecisionProfile): void {
  saveDecisionProfile({ ...profile, categorySlug: "sales-intelligence" });
}

export function resetSiDecisionProfile(): SiDecisionProfile {
  return resetDecisionProfile("sales-intelligence");
}

export function touchSiDecisionProfile(
  profile: SiDecisionProfile,
  patch: Partial<SiDecisionProfile>,
): SiDecisionProfile {
  return touchDecisionProfile(profile, {
    ...patch,
    categorySlug: "sales-intelligence",
  });
}
