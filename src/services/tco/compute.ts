import {
  type TCOAdministrationInput,
  type TCOCategoryTotal,
  type TCOComputeResult,
  type TCOCostCategory,
  type TCOCostItem,
  type TCOCostSourceType,
  type TCOCustomCost,
  type TCOImplementationInput,
  type TCOIntegrationLine,
  type TCOMigrationInput,
  type TCOProductResult,
  type TCOScenario,
  type TCOSupportInput,
  type TCOTrainingInput,
  type TCOUnknownItem,
} from "@/domain";
import type { PricingSnapshot } from "@/services/pricing";
import { buildSeatPlan } from "./seat-plan";
import { calculateSoftwareCostsOverHorizon } from "./software-costs";

const OPERATIONAL: TCOCostCategory[] = [
  "integrations",
  "training",
  "administration",
  "support",
  "custom",
  "addon",
];

function isExplicitlyUnknown(value: number | null | undefined): boolean {
  return value === null;
}

function hasAmount(value: number | null | undefined): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function spreadOneTime(
  amountMinor: number,
  year: number,
  horizon: number,
): number[] {
  const out = Array.from({ length: horizon }, () => 0);
  const idx = Math.min(horizon, Math.max(1, year)) - 1;
  out[idx] = amountMinor;
  return out;
}

function spreadRecurringMonthly(
  monthlyMinor: number,
  startYear: number,
  endYear: number,
  horizon: number,
): number[] {
  const out = Array.from({ length: horizon }, () => 0);
  for (let y = 1; y <= horizon; y++) {
    if (y >= startYear && y <= endYear) {
      out[y - 1] = monthlyMinor * 12;
    }
  }
  return out;
}

function spreadAnnual(
  annualMinor: number,
  startYear: number,
  endYear: number,
  horizon: number,
): number[] {
  const out = Array.from({ length: horizon }, () => 0);
  for (let y = 1; y <= horizon; y++) {
    if (y >= startYear && y <= endYear) {
      out[y - 1] = annualMinor;
    }
  }
  return out;
}

/** Build non-software cost items from shared scenario assumptions. */
export function buildAssumptionCostItems(
  scenario: TCOScenario,
  productId: string,
): { items: TCOCostItem[]; unknowns: TCOUnknownItem[] } {
  const items: TCOCostItem[] = [];
  const unknowns: TCOUnknownItem[] = [];
  const horizon = scenario.horizonYears;
  const currency = scenario.currency;
  const y1Users = scenario.startingUsers;
  const hourly =
    scenario.administration.hourlyCostMinor ??
    scenario.implementation.internalHourlyCostMinor ??
    scenario.training.hourlyCostMinor ??
    scenario.support.internalHourlyCostMinor;

  pushImplementation(
    items,
    unknowns,
    scenario.implementation,
    productId,
    currency,
    hourly,
  );
  pushMigration(
    items,
    unknowns,
    scenario.migration,
    productId,
    currency,
    hourly,
  );
  pushIntegrations(
    items,
    unknowns,
    scenario.integrations,
    productId,
    currency,
    horizon,
    hourly,
  );
  pushTraining(
    items,
    unknowns,
    scenario.training,
    productId,
    currency,
    y1Users,
  );
  pushAdministration(
    items,
    unknowns,
    scenario.administration,
    productId,
    currency,
    horizon,
  );
  pushSupport(items, unknowns, scenario.support, productId, currency, horizon);
  pushCustom(items, scenario.customCosts, productId, currency, horizon);

  return { items, unknowns };
}

function pushImplementation(
  items: TCOCostItem[],
  unknowns: TCOUnknownItem[],
  input: TCOImplementationInput,
  productId: string,
  currency: string,
  fallbackHourly?: number,
) {
  if (isExplicitlyUnknown(input.externalCostMinor)) {
    unknowns.push({
      id: `impl-ext-${productId}`,
      category: "implementation",
      label: "External implementation",
    });
    items.push({
      id: `impl-ext-${productId}`,
      category: "implementation",
      label: "External implementation",
      sourceType: "unknown",
      frequency: "one-time",
      amountMinor: null,
      productId,
    });
  } else if (hasAmount(input.externalCostMinor) && input.externalCostMinor > 0) {
    items.push({
      id: `impl-ext-${productId}`,
      category: "implementation",
      label: "External implementation",
      sourceType: "user-input",
      frequency: "one-time",
      amountMinor: input.externalCostMinor,
      currency,
      startYear: 1,
      endYear: 1,
      productId,
    });
  }

  const hours = input.internalHours;
  const rate = input.internalHourlyCostMinor ?? fallbackHourly;
  if (hours != null && rate != null && hours > 0) {
    items.push({
      id: `impl-int-${productId}`,
      category: "implementation",
      label: "Internal implementation effort",
      sourceType: "calculated",
      frequency: "one-time",
      amountMinor: Math.round(hours * rate),
      currency,
      startYear: 1,
      endYear: 1,
      productId,
      userNote: `${hours} hours × internal rate`,
    });
  }
}

function pushMigration(
  items: TCOCostItem[],
  unknowns: TCOUnknownItem[],
  input: TCOMigrationInput,
  productId: string,
  currency: string,
  fallbackHourly?: number,
) {
  if (input.needed === "none") return;

  if (isExplicitlyUnknown(input.externalCostMinor)) {
    unknowns.push({
      id: `mig-ext-${productId}`,
      category: "migration",
      label: "External migration",
    });
    items.push({
      id: `mig-ext-${productId}`,
      category: "migration",
      label: "External migration",
      sourceType: "unknown",
      frequency: "one-time",
      amountMinor: null,
      productId,
    });
  } else if (hasAmount(input.externalCostMinor) && input.externalCostMinor > 0) {
    items.push({
      id: `mig-ext-${productId}`,
      category: "migration",
      label: "External migration",
      sourceType: "user-input",
      frequency: "one-time",
      amountMinor: input.externalCostMinor,
      currency,
      startYear: 1,
      endYear: 1,
      productId,
    });
  } else if (input.externalCostMinor === undefined) {
    unknowns.push({
      id: `mig-ext-${productId}`,
      category: "migration",
      label: "Data migration",
    });
    items.push({
      id: `mig-ext-${productId}`,
      category: "migration",
      label: "Data migration",
      sourceType: "unknown",
      frequency: "one-time",
      amountMinor: null,
      productId,
    });
  }

  if (isExplicitlyUnknown(input.dataCleaningCostMinor)) {
    unknowns.push({
      id: `mig-clean-${productId}`,
      category: "migration",
      label: "Data cleaning",
    });
  } else if (
    hasAmount(input.dataCleaningCostMinor) &&
    input.dataCleaningCostMinor > 0
  ) {
    items.push({
      id: `mig-clean-${productId}`,
      category: "migration",
      label: "Data cleaning",
      sourceType: "user-input",
      frequency: "one-time",
      amountMinor: input.dataCleaningCostMinor,
      currency,
      startYear: 1,
      endYear: 1,
      productId,
    });
  }

  const hours = input.internalHours;
  const rate = input.internalHourlyCostMinor ?? fallbackHourly;
  if (hours != null && rate != null && hours > 0) {
    items.push({
      id: `mig-int-${productId}`,
      category: "migration",
      label: "Internal migration effort",
      sourceType: "calculated",
      frequency: "one-time",
      amountMinor: Math.round(hours * rate),
      currency,
      startYear: 1,
      endYear: 1,
      productId,
    });
  }
}

function pushIntegrations(
  items: TCOCostItem[],
  unknowns: TCOUnknownItem[],
  lines: TCOIntegrationLine[],
  productId: string,
  currency: string,
  horizon: number,
  fallbackHourly?: number,
) {
  for (const line of lines) {
    if (line.status === "native") continue;

    if (isExplicitlyUnknown(line.setupCostMinor)) {
      unknowns.push({
        id: `int-setup-${line.id}-${productId}`,
        category: "integrations",
        label: `${line.name} setup`,
      });
      items.push({
        id: `int-setup-${line.id}-${productId}`,
        category: "integrations",
        label: `${line.name} setup`,
        sourceType: "unknown",
        frequency: "one-time",
        amountMinor: null,
        productId,
      });
    } else if (hasAmount(line.setupCostMinor) && line.setupCostMinor > 0) {
      items.push({
        id: `int-setup-${line.id}-${productId}`,
        category: "integrations",
        label: `${line.name} setup`,
        sourceType: "user-input",
        frequency: "one-time",
        amountMinor: line.setupCostMinor,
        currency,
        startYear: 1,
        endYear: 1,
        productId,
      });
    }

    if (isExplicitlyUnknown(line.recurringMonthlyMinor)) {
      unknowns.push({
        id: `int-rec-${line.id}-${productId}`,
        category: "integrations",
        label: `${line.name} recurring`,
      });
    } else if (
      hasAmount(line.recurringMonthlyMinor) &&
      line.recurringMonthlyMinor > 0
    ) {
      items.push({
        id: `int-rec-${line.id}-${productId}`,
        category: "integrations",
        label: `${line.name} recurring`,
        sourceType: "user-input",
        frequency: "monthly",
        amountMinor: line.recurringMonthlyMinor,
        currency,
        startYear: 1,
        endYear: horizon,
        productId,
      });
    }

    if (
      line.maintenanceHoursPerMonth != null &&
      line.maintenanceHoursPerMonth > 0 &&
      fallbackHourly != null
    ) {
      const monthly = Math.round(line.maintenanceHoursPerMonth * fallbackHourly);
      items.push({
        id: `int-maint-${line.id}-${productId}`,
        category: "integrations",
        label: `${line.name} internal maintenance`,
        sourceType: "calculated",
        frequency: "monthly",
        amountMinor: monthly,
        currency,
        startYear: 1,
        endYear: horizon,
        productId,
      });
    }
  }
}

function pushTraining(
  items: TCOCostItem[],
  unknowns: TCOUnknownItem[],
  input: TCOTrainingInput,
  productId: string,
  currency: string,
  users: number,
) {
  if (isExplicitlyUnknown(input.externalCostMinor)) {
    unknowns.push({
      id: `train-ext-${productId}`,
      category: "training",
      label: "External training",
    });
    items.push({
      id: `train-ext-${productId}`,
      category: "training",
      label: "External training",
      sourceType: "unknown",
      frequency: "one-time",
      amountMinor: null,
      productId,
    });
  } else if (hasAmount(input.externalCostMinor) && input.externalCostMinor > 0) {
    items.push({
      id: `train-ext-${productId}`,
      category: "training",
      label: "External training",
      sourceType: "user-input",
      frequency: "one-time",
      amountMinor: input.externalCostMinor,
      currency,
      startYear: 1,
      endYear: 1,
      productId,
    });
  }

  if (
    input.hoursPerUser != null &&
    input.hourlyCostMinor != null &&
    input.hoursPerUser > 0
  ) {
    const amount = Math.round(
      users * input.hoursPerUser * input.hourlyCostMinor,
    );
    items.push({
      id: `train-int-${productId}`,
      category: "training",
      label: "Internal training / productivity cost",
      sourceType: "calculated",
      frequency: "one-time",
      amountMinor: amount,
      currency,
      startYear: 1,
      endYear: 1,
      productId,
      userNote: `${users} users × ${input.hoursPerUser} hrs × rate`,
    });
  }
}

function pushAdministration(
  items: TCOCostItem[],
  unknowns: TCOUnknownItem[],
  input: TCOAdministrationInput,
  productId: string,
  currency: string,
  horizon: number,
) {
  let hoursPerWeek = input.hoursPerWeek;
  if (hoursPerWeek == null && input.ftePercent != null) {
    hoursPerWeek = (input.ftePercent / 100) * 40;
  }
  if (hoursPerWeek == null || hoursPerWeek <= 0) return;
  if (input.hourlyCostMinor == null) {
    unknowns.push({
      id: `admin-${productId}`,
      category: "administration",
      label: "CRM administration (missing hourly rate)",
    });
    return;
  }
  const annual = Math.round(hoursPerWeek * 52 * input.hourlyCostMinor);
  items.push({
    id: `admin-${productId}`,
    category: "administration",
    label: "Internal CRM administration",
    sourceType: "calculated",
    frequency: "annual",
    amountMinor: annual,
    currency,
    startYear: 1,
    endYear: horizon,
    productId,
    userNote: `${hoursPerWeek} hrs/week × 52 × rate`,
  });
}

function pushSupport(
  items: TCOCostItem[],
  unknowns: TCOUnknownItem[],
  input: TCOSupportInput,
  productId: string,
  currency: string,
  horizon: number,
) {
  if (isExplicitlyUnknown(input.externalMonthlyMinor)) {
    unknowns.push({
      id: `support-ext-${productId}`,
      category: "support",
      label: "Premium / partner support",
    });
    items.push({
      id: `support-ext-${productId}`,
      category: "support",
      label: "Premium / partner support",
      sourceType: "unknown",
      frequency: "monthly",
      amountMinor: null,
      productId,
    });
  } else if (
    hasAmount(input.externalMonthlyMinor) &&
    input.externalMonthlyMinor > 0
  ) {
    items.push({
      id: `support-ext-${productId}`,
      category: "support",
      label: "External support retainer",
      sourceType: "user-input",
      frequency: "monthly",
      amountMinor: input.externalMonthlyMinor,
      currency,
      startYear: 1,
      endYear: horizon,
      productId,
    });
  }

  if (
    input.internalHoursPerMonth != null &&
    input.internalHoursPerMonth > 0 &&
    input.internalHourlyCostMinor != null
  ) {
    const monthly = Math.round(
      input.internalHoursPerMonth * input.internalHourlyCostMinor,
    );
    items.push({
      id: `support-int-${productId}`,
      category: "support",
      label: "Internal support effort",
      sourceType: "calculated",
      frequency: "monthly",
      amountMinor: monthly,
      currency,
      startYear: 1,
      endYear: horizon,
      productId,
    });
  }
}

function pushCustom(
  items: TCOCostItem[],
  customs: TCOCustomCost[],
  productId: string,
  currency: string,
  horizon: number,
) {
  for (const c of customs) {
    items.push({
      id: `custom-${c.id}-${productId}`,
      category: "custom",
      label: c.name,
      sourceType: "user-input",
      frequency: c.frequency,
      amountMinor: c.amountMinor,
      currency: c.currency ?? currency,
      startYear: c.startYear,
      endYear: c.endYear ?? horizon,
      productId,
      userNote: c.notes,
    });
  }
}

function allocateItemToYears(
  item: TCOCostItem,
  horizon: number,
): number[] {
  const out = Array.from({ length: horizon }, () => 0);
  if (item.amountMinor == null || item.amountMinor <= 0) return out;
  const start = item.startYear ?? 1;
  const end = item.endYear ?? (item.frequency === "one-time" ? start : horizon);

  if (item.frequency === "one-time") {
    return spreadOneTime(item.amountMinor, start, horizon);
  }
  if (item.frequency === "monthly") {
    return spreadRecurringMonthly(item.amountMinor, start, end, horizon);
  }
  return spreadAnnual(item.amountMinor, start, end, horizon);
}

function sumCategory(
  items: TCOCostItem[],
  category: TCOCostCategory,
  horizon: number,
): { total: number; sourceType: TCOCostSourceType; items: TCOCostItem[] } {
  const catItems = items.filter(
    (i) => i.category === category && i.amountMinor != null,
  );
  let total = 0;
  for (const item of catItems) {
    total += allocateItemToYears(item, horizon).reduce((a, b) => a + b, 0);
  }
  const sourceType: TCOCostSourceType =
    catItems.length === 0
      ? "unknown"
      : catItems.every((i) => i.sourceType === "researched")
        ? "researched"
        : catItems.every((i) => i.sourceType === "user-input")
          ? "user-input"
          : catItems.every((i) => i.sourceType === "calculated")
            ? "calculated"
            : "calculated";
  return { total, sourceType, items: catItems };
}

function buildProductResult(
  snapshot: PricingSnapshot,
  scenario: TCOScenario,
  requiredFeatureSlugs: string[],
): TCOProductResult {
  const seatPlan = buildSeatPlan(scenario);
  const horizon = scenario.horizonYears;
  const selectedPlanSlug =
    scenario.planSelections[snapshot.productSlug] || undefined;
  const software = calculateSoftwareCostsOverHorizon({
    snapshot,
    seatPlan,
    requiredFeatureSlugs,
    billingPreference: scenario.billingPreference,
    negotiatedDiscountPercent: scenario.negotiatedDiscountPercent,
    selectedPlanSlug,
  });

  const { items: assumptionItems, unknowns } = buildAssumptionCostItems(
    scenario,
    snapshot.productSlug,
  );

  const costItems = [...software.items, ...assumptionItems];
  const currency = software.currency ?? scenario.currency;

  const categories: TCOCostCategory[] = [
    "software",
    "implementation",
    "migration",
    "integrations",
    "training",
    "administration",
    "support",
    "addon",
    "custom",
  ];

  const categoryTotals: TCOCategoryTotal[] = categories
    .map((category) => {
      const summed = sumCategory(costItems, category, horizon);
      return {
        category,
        amountMinor: summed.total,
        sourceType: summed.sourceType,
        items: summed.items,
      };
    })
    .filter(
      (c) =>
        c.amountMinor > 0 ||
        c.items.length > 0 ||
        c.items.some((i) => i.sourceType === "unknown"),
    );

  const knownTcoMinor = categoryTotals.reduce(
    (sum, c) => sum + c.amountMinor,
    0,
  );

  const yearly = seatPlan.map((seat) => {
    const byCategory: Partial<Record<TCOCostCategory, number>> = {};
    let knownTotalMinor = 0;
    for (const item of costItems) {
      if (item.amountMinor == null) continue;
      const yearAmounts = allocateItemToYears(item, horizon);
      const amount = yearAmounts[seat.year - 1] ?? 0;
      // Include $0 researched free plans — do not skip known zero amounts.
      if (amount < 0) continue;
      if (amount === 0 && item.amountMinor !== 0) continue;
      byCategory[item.category] = (byCategory[item.category] ?? 0) + amount;
      knownTotalMinor += amount;
    }
    // Software already in costItems as annual per year
    return {
      year: seat.year,
      users: seat.users,
      byCategory,
      knownTotalMinor,
    };
  });

  const softwareTotal =
    categoryTotals.find((c) => c.category === "software")?.amountMinor ?? 0;
  const implMig =
    (categoryTotals.find((c) => c.category === "implementation")?.amountMinor ??
      0) +
    (categoryTotals.find((c) => c.category === "migration")?.amountMinor ?? 0);
  const operational = OPERATIONAL.reduce(
    (sum, cat) =>
      sum +
      (categoryTotals.find((c) => c.category === cat)?.amountMinor ?? 0),
    0,
  );

  const denom = knownTcoMinor > 0 ? knownTcoMinor : 1;
  const avgUsers =
    seatPlan.reduce((s, y) => s + y.users, 0) / Math.max(1, seatPlan.length);
  const months = horizon * 12;

  const y1Software = software.years[0]?.monthlyEquivalentMinor ?? null;
  const unknownItems = [
    ...unknowns,
    ...software.items
      .filter((i) => i.sourceType === "unknown")
      .map((i) => ({
        id: i.id,
        category: i.category,
        label: i.label,
      })),
  ];

  // Dedupe unknowns by id
  const seen = new Set<string>();
  const dedupedUnknowns = unknownItems.filter((u) => {
    if (seen.has(u.id)) return false;
    seen.add(u.id);
    return true;
  });

  let confidenceLabel: TCOProductResult["confidenceLabel"] = "incomplete";
  if (software.status === "calculated" || software.status === "partial") {
    const hasUser = costItems.some((i) => i.sourceType === "user-input");
    const hasCalc = costItems.some((i) => i.sourceType === "calculated");
    if (!hasUser && !hasCalc && dedupedUnknowns.length === 0) {
      confidenceLabel = "researched";
    } else if (dedupedUnknowns.length > 0) {
      confidenceLabel = "incomplete";
    } else if (hasUser && hasCalc) {
      confidenceLabel = "mixed";
    } else if (hasUser) {
      confidenceLabel = "assumption-heavy";
    } else {
      confidenceLabel = "mixed";
    }
  }

  return {
    productId: snapshot.productSlug,
    productName: snapshot.name,
    currency,
    status: software.status as TCOProductResult["status"],
    qualifyingPlanName: software.planName,
    qualifyingPlanSlug: software.planSlug,
    softwareSourceIds: software.sourceIds,
    pricingVerifiedAt: software.pricingVerifiedAt,
    knownTcoMinor,
    unknownItems: dedupedUnknowns,
    categoryTotals,
    yearly,
    costItems,
    shares: {
      software: softwareTotal / denom,
      implementationMigration: implMig / denom,
      operational: operational / denom,
    },
    perUser: {
      knownTcoMinor: Math.round(knownTcoMinor / Math.max(1, avgUsers)),
      avgMonthlyMinor: Math.round(
        knownTcoMinor / Math.max(1, avgUsers) / months,
      ),
      softwareMonthlyMinor: y1Software,
    },
    confidenceLabel,
  };
}

/**
 * Compute TCO for all selected products in a scenario.
 * Software licence costs always come from calculateProductCost.
 */
export function computeTco(input: {
  scenario: TCOScenario;
  snapshots: PricingSnapshot[];
  requiredFeatureSlugs?: string[];
}): TCOComputeResult {
  const { scenario } = input;
  const seatPlan = buildSeatPlan(scenario);
  const requiredFeatureSlugs = input.requiredFeatureSlugs ?? [];
  const bySlug = new Map(input.snapshots.map((s) => [s.productSlug, s]));

  const products: TCOProductResult[] = [];
  const currencies = new Set<string>();

  for (const id of scenario.productIds) {
    const snap = bySlug.get(id);
    if (!snap) continue;
    const result = buildProductResult(snap, scenario, requiredFeatureSlugs);
    products.push(result);
    currencies.add(result.currency);
  }

  let currencyWarning: string | undefined;
  if (currencies.size > 1) {
    currencyWarning =
      "Selected products use different currencies. Amounts are not FX-normalized — compare within each currency only.";
  }

  const displayCurrency =
    products[0]?.currency ?? scenario.currency;

  // Comparison only among same-currency calculable products
  const comparable = products.filter(
    (p) =>
      p.currency === displayCurrency &&
      (p.status === "calculated" || p.status === "partial") &&
      p.knownTcoMinor > 0,
  );
  const lowest = comparable.reduce(
    (min, p) => (p.knownTcoMinor < min ? p.knownTcoMinor : min),
    comparable[0]?.knownTcoMinor ?? 0,
  );

  const comparison = comparable
    .map((p) => ({
      productId: p.productId,
      productName: p.productName,
      knownTcoMinor: p.knownTcoMinor,
      deltaVsLowestMinor: p.knownTcoMinor - lowest,
    }))
    .sort((a, b) => a.knownTcoMinor - b.knownTcoMinor);

  const assumptions = buildAssumptionList(scenario, seatPlan);

  return {
    scenario,
    seatPlan,
    currency: displayCurrency,
    currencyWarning,
    products,
    comparison,
    assumptions,
  };
}

function buildAssumptionList(
  scenario: TCOScenario,
  seatPlan: ReturnType<typeof buildSeatPlan>,
): Array<{ id: string; label: string; value: string }> {
  const list: Array<{ id: string; label: string; value: string }> = [
    {
      id: "horizon",
      label: "Ownership period",
      value: `${scenario.horizonYears} year${scenario.horizonYears === 1 ? "" : "s"}`,
    },
    {
      id: "users",
      label: "Starting users",
      value: String(scenario.startingUsers),
    },
    {
      id: "growth",
      label: "Annual user growth",
      value:
        scenario.growthMode === "flat"
          ? "0% (no growth assumed)"
          : scenario.growthMode === "percent"
            ? `${scenario.annualGrowthPercent ?? 0}%`
            : `Custom: ${seatPlan.map((s) => s.users).join(" → ")}`,
    },
    {
      id: "billing",
      label: "Billing",
      value: scenario.billingPreference,
    },
  ];
  if (scenario.negotiatedDiscountPercent > 0) {
    list.push({
      id: "discount",
      label: "Negotiated discount (your assumption)",
      value: `${scenario.negotiatedDiscountPercent}%`,
    });
  }
  if (scenario.administration.hoursPerWeek != null) {
    list.push({
      id: "admin",
      label: "Admin effort",
      value: `${scenario.administration.hoursPerWeek} hr/week`,
    });
  }
  const hourly = scenario.administration.hourlyCostMinor;
  if (hourly != null) {
    list.push({
      id: "hourly",
      label: "Internal hourly cost",
      value: `${(hourly / 100).toFixed(0)} ${scenario.currency}/hour (your assumption)`,
    });
  }
  list.push({
    id: "tax",
    label: "Tax",
    value: "Before tax (unless vendor pricing includes tax)",
  });
  return list;
}

export function majorToMinor(major: number): number {
  return Math.round(major * 100);
}

export function minorToMajor(minor: number): number {
  return minor / 100;
}
