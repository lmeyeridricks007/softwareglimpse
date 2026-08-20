"use client";

import type { CategoryFinderClientKit } from "@/data/config/tools/category-tool-kit-types";
import type { DecisionCategorySlug } from "@/domain";
import { loadDecisionProfile } from "@/services/decision-profile/client";
import { SiDemoChecklistBuilderApp } from "./si-demo-checklist-builder-app";
import {
  createSeededCategoryDemoSession,
  loadCategoryDemoSession,
  resetCategoryDemoSession,
  saveCategoryDemoSession,
} from "@/services/demo-checklist-builder/category-persistence";

type Props = {
  kit: CategoryFinderClientKit;
  title?: string;
  description?: string;
  titleElement?: "h1" | "h2" | "none";
};

export function CategoryDemoChecklistBuilderApp({
  kit,
  title,
  description,
  titleElement = "none",
}: Props) {
  return (
    <SiDemoChecklistBuilderApp
      title={title ?? `${kit.shortName} Demo Checklist Builder`}
      description={
        description ??
        `Build a reusable ${kit.productNoun} demo agenda — same script for every vendor, with per-vendor scoring.`
      }
      titleElement={titleElement}
      runtime={{
        categorySlug: kit.categorySlug,
        loadSession: () => loadCategoryDemoSession(kit.categorySlug),
        saveSession: (session) =>
          saveCategoryDemoSession(kit.categorySlug, session),
        createSeeded: () => createSeededCategoryDemoSession(kit),
        resetSession: () => resetCategoryDemoSession(kit),
        loadProfile: () =>
          loadDecisionProfile(kit.categorySlug as DecisionCategorySlug),
      }}
    />
  );
}
