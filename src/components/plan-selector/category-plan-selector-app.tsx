"use client";

import {
  SiPlanSelectorApp,
  type PlanSelectorAppConfig,
} from "./si-plan-selector-app";
import type { PricingSnapshot } from "@/services/pricing";
import type { CategoryFinderClientKit } from "@/data/config/tools/category-tool-kit-types";

type Props = {
  kit: CategoryFinderClientKit;
  snapshots: PricingSnapshot[];
};

export function CategoryPlanSelectorApp({ kit, snapshots }: Props) {
  const config: PlanSelectorAppConfig = {
    storageKey: `sg-${kit.categorySlug}-plan-selector-v1`,
    productLabel: kit.productNoun,
    finderHref: kit.finderHref,
    finderLabel: kit.title,
    startedEvent: "category_plan_selector_started",
    vendorEvent: "category_plan_vendor_selected",
    generatedEvent: "category_plan_recommendation_generated",
  };
  return <SiPlanSelectorApp snapshots={snapshots} config={config} />;
}
