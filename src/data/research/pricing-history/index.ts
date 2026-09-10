import crmDataset from "./crm.json";

/**
 * Legacy CRM starting-price dataset (crm.json).
 * Prefer `@/services/pricing-history` (`listPriceObservations`) for new work.
 */
export type PricingHistorySnapshot = {
  productSlug: string;
  observedAt: string;
  startingPriceMonthly: number | null;
  currency: string;
  planName?: string;
  billingNotes?: string;
  sourceIds: string[];
};

export type PricingHistoryDataset = {
  datasetId: string;
  categorySlug: string;
  description: string;
  methodology: string;
  snapshots: PricingHistorySnapshot[];
};

const CRM_PRICING_HISTORY = crmDataset as PricingHistoryDataset;

export function getCrmPricingHistory(): PricingHistoryDataset {
  return CRM_PRICING_HISTORY;
}

/** Raw crm.json snapshots (legacy file only — does not invent rows). */
export function listCrmPricingHistorySnapshots(): PricingHistorySnapshot[] {
  return [...CRM_PRICING_HISTORY.snapshots].sort((a, b) =>
    b.observedAt.localeCompare(a.observedAt),
  );
}
