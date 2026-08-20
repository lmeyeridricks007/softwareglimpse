"use client";

import type { CategoryFinderClientKit } from "@/data/config/tools/category-tool-kit-types";
import type { DecisionCategorySlug } from "@/domain";
import { loadDecisionProfile } from "@/services/decision-profile/client";
import { SiRfpBuilderApp } from "./si-rfp-builder-app";
import { buildCategoryRfpPack } from "@/services/rfp-builder/category-pack";
import {
  createSeededCategoryRfpSession,
  loadCategoryRfpSession,
  resetCategoryRfpSession,
  saveCategoryRfpSession,
} from "@/services/rfp-builder/category-persistence";
import {
  applyCategoryProfileToDraft,
  categoryIntegrationsFromProfile,
  requirementsFromCategoryKit,
} from "@/services/rfp-builder/category-from-profile";

type Props = {
  kit: CategoryFinderClientKit;
};

export function CategoryRfpBuilderApp({ kit }: Props) {
  const pack = buildCategoryRfpPack(kit);
  return (
    <SiRfpBuilderApp
      runtime={{
        pack,
        loadSession: () => loadCategoryRfpSession(kit.categorySlug),
        saveSession: (session) =>
          saveCategoryRfpSession(kit.categorySlug, session),
        createSeeded: () => createSeededCategoryRfpSession(pack),
        resetSession: () => resetCategoryRfpSession(kit.categorySlug, pack),
        loadProfile: () =>
          loadDecisionProfile(kit.categorySlug as DecisionCategorySlug),
        applyProfile: (draft, profile, options) =>
          applyCategoryProfileToDraft(draft, profile, kit, pack, options),
        integrationsFromProfile: (profile) =>
          categoryIntegrationsFromProfile(profile, kit),
        requirementsFromLibrary: () => requirementsFromCategoryKit(kit, pack),
      }}
    />
  );
}
