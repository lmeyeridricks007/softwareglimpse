import type { TCOCostCategory, TCOProductResult } from "@/domain";

const LABELS: Record<TCOCostCategory, string> = {
  software: "Software subscriptions",
  implementation: "Implementation",
  migration: "Migration",
  integrations: "Integrations",
  training: "Training",
  administration: "CRM administration",
  support: "Support",
  addon: "Add-ons",
  custom: "Other costs",
};

export type TCOCostDriver = {
  category: TCOCostCategory;
  label: string;
  amountMinor: number;
  share: number;
  rank: number;
};

/** Rank largest known cost categories for a product result. */
export function deriveCostDrivers(
  product: TCOProductResult,
  limit = 4,
): TCOCostDriver[] {
  const known = product.knownTcoMinor;
  if (known <= 0) return [];

  return product.categoryTotals
    .filter((c) => c.amountMinor > 0)
    .map((c) => ({
      category: c.category,
      label: LABELS[c.category],
      amountMinor: c.amountMinor,
      share: c.amountMinor / known,
      rank: 0,
    }))
    .sort((a, b) => b.amountMinor - a.amountMinor)
    .slice(0, limit)
    .map((d, i) => ({ ...d, rank: i + 1 }));
}
