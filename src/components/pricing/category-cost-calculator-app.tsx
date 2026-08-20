"use client";

import { CostCalculatorApp } from "./cost-calculator-app";
import type { CostCalculatorConfig } from "./cost-calculator-config";
import type { PricingSnapshot } from "@/services/pricing";
import type { CategoryFinderClientKit } from "@/data/config/tools/category-tool-kit-types";
import { loadDecisionProfile } from "@/services/decision-profile/client";

type Props = {
  kit: CategoryFinderClientKit;
  snapshots: PricingSnapshot[];
  resourceLinks?: Array<{ href: string; label: string }>;
  title?: string;
  description?: string;
};

export function CategoryCostCalculatorApp({
  kit,
  snapshots,
  resourceLinks,
  title,
  description,
}: Props) {
  const config: CostCalculatorConfig = {
    categorySlug: kit.categorySlug,
    storageKey: `sg-${kit.categorySlug}-cost-v1`,
    finderStorageKey: kit.storageKey,
    productNoun: kit.productNoun,
    productNounPlural: kit.productNounPlural,
    defaultTitle: title ?? `${kit.shortName} Cost Calculator`,
    defaultDescription:
      description ??
      `Estimate ${kit.softwarePhrase} costs from verified public pricing. Unknown, usage-based and custom quotes stay unknown — we never invent totals. Affiliate relationships never change the numbers.`,
    requirementsHeading: `${kit.shortName} requirements`,
    seatsDescription: "How many people will need a paid seat.",
    loadingTitle: `Calculating ${kit.softwarePhrase} costs…`,
    loadingDescription:
      "Comparing verified plan pricing for your team size and requirements.",
    resultsHeading: `${kit.shortName} cost details`,
    capabilityOptions: kit.capabilityOptions,
    loadDecisionProfile: () => loadDecisionProfile(kit.categorySlug),
    finderHref: kit.finderHref,
    finderLabel: `Find ${kit.shortName}`,
    secondaryToolHref: kit.planSelectorHref,
    secondaryToolLabel: "Open plan selector →",
    analytics: {
      started: "category_cost_calculator_started",
      completed: "category_cost_calculator_completed",
      resultViewed: "category_cost_result_viewed",
      sortChanged: "category_cost_sort_changed",
    },
    includedItems: [
      {
        title: "Verified list prices",
        body: "Per-seat or flat list pricing when research publishes calculable plan rules.",
      },
      {
        title: "Unknowns stay unknown",
        body: "Usage, overages, and quote-only tiers are marked quote-required — we do not invent dollar totals.",
      },
      {
        title: "Custom quotes",
        body: "Contact-sales tiers are never treated as $0. Ask the vendor for a real quote.",
      },
      {
        title: "Before tax",
        body: "Figures exclude tax and negotiated discounts. Invoices may differ.",
      },
    ],
    estimateAlertSuffix: kit.productNounPlural,
  };

  return (
    <CostCalculatorApp
      snapshots={snapshots}
      resourceLinks={resourceLinks}
      title={config.defaultTitle}
      description={config.defaultDescription}
      config={config}
    />
  );
}
