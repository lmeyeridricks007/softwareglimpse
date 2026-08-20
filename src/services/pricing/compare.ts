import type {
  CrmRequirements,
  ProductCostComparison,
  ProductCostEstimate,
} from "@/domain";
import type { CurrencyCode } from "@/domain/schemas/primitives";
import { calculateProductCost } from "./calculate";
import type {
  CalculateOptions,
  CompareOptions,
  CompareSortMode,
  PricingSnapshot,
} from "./types";

/**
 * Compare product costs across snapshots.
 *
 * Multi-currency safety: never sort $100 as comparable to €100.
 * Prefer: calculated USD together (by cost), then other currencies (grouped,
 * sorted within currency), then custom-quote, then insufficient / no-suitable.
 */
export function compareProductCosts(
  snapshots: PricingSnapshot[],
  requirements: CrmRequirements,
  opts: CompareOptions = {},
): ProductCostComparison {
  const sortMode: CompareSortMode = opts.sortMode ?? "lowest-cost";
  const calcOpts: CalculateOptions = { now: opts.now };

  const results = snapshots.map((s) =>
    calculateProductCost(s, requirements, calcOpts),
  );

  const currencyGroups = [
    ...new Set(
      results
        .map((r) => r.currency)
        .filter((c): c is CurrencyCode => typeof c === "string"),
    ),
  ];

  const notes = [
    "Currencies are not FX-normalized — amounts are only sorted within the same currency",
  ];

  const sorted = sortResults(results, sortMode, {
    inputOrder: snapshots.map((s) => s.productSlug),
    finderOrder: opts.finderOrderSlugs ?? snapshots.map((s) => s.productSlug),
  });

  return {
    requirements: { ...requirements },
    sortMode,
    results: sorted,
    currencyGroups,
    notes,
  };
}

function sortResults(
  results: ProductCostEstimate[],
  mode: CompareSortMode,
  order: { inputOrder: string[]; finderOrder: string[] },
): ProductCostEstimate[] {
  if (mode === "input-order") {
    return sortBySlugOrder(results, order.inputOrder);
  }
  if (mode === "finder-order") {
    return sortBySlugOrder(results, order.finderOrder);
  }

  // lowest-cost with currency safety
  const statusRank = (s: ProductCostEstimate["status"]) => {
    switch (s) {
      case "calculated":
        return 0;
      case "partial":
        return 1;
      case "custom-quote":
        return 2;
      case "no-suitable-plan":
        return 3;
      case "insufficient-data":
        return 4;
      default:
        return 5;
    }
  };

  const withCost = results.filter(
    (r) =>
      (r.status === "calculated" || r.status === "partial") &&
      r.monthlyEquivalent != null,
  );
  const withoutCost = results.filter((r) => !withCost.includes(r));

  // Prefer USD group first, then other currencies alphabetically
  const byCurrency = new Map<string, ProductCostEstimate[]>();
  for (const r of withCost) {
    const c = r.currency ?? "XXX";
    const list = byCurrency.get(c) ?? [];
    list.push(r);
    byCurrency.set(c, list);
  }

  const currencyKeys = [...byCurrency.keys()].sort((a, b) => {
    if (a === "USD") return -1;
    if (b === "USD") return 1;
    return a.localeCompare(b);
  });

  const sortedWithCost: ProductCostEstimate[] = [];
  for (const key of currencyKeys) {
    const group = byCurrency.get(key)!;
    group.sort(
      (a, b) =>
        (a.monthlyEquivalent?.amountMinor ?? Number.POSITIVE_INFINITY) -
        (b.monthlyEquivalent?.amountMinor ?? Number.POSITIVE_INFINITY),
    );
    sortedWithCost.push(...group);
  }

  withoutCost.sort((a, b) => {
    const sr = statusRank(a.status) - statusRank(b.status);
    if (sr !== 0) return sr;
    return a.productSlug.localeCompare(b.productSlug);
  });

  return [...sortedWithCost, ...withoutCost];
}

function sortBySlugOrder(
  results: ProductCostEstimate[],
  slugs: string[],
): ProductCostEstimate[] {
  const index = new Map(slugs.map((s, i) => [s, i]));
  return [...results].sort((a, b) => {
    const ai = index.get(a.productSlug) ?? Number.MAX_SAFE_INTEGER;
    const bi = index.get(b.productSlug) ?? Number.MAX_SAFE_INTEGER;
    return ai - bi;
  });
}
