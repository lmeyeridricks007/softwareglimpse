import type { PricingPlan } from "@/domain";
import { getSoftwareBySlug } from "@/data";
import { loadEnrichment } from "@/data/research/store";
import { buildPricingSnapshot } from "@/services/pricing/build-snapshot";
import { resolveProductPricing } from "@/services/pricing/resolve-product-pricing";
import { resolvePlanDisplayPrice } from "@/services/pricing/plan-display-price";
import { listPriceObservations } from "@/services/pricing-history";

export type SurfacePlanPrice = {
  surface:
    | "software"
    | "pricing"
    | "comparison"
    | "calculator"
    | "research";
  planId: string;
  planName: string;
  amount: number | null;
  currency: string | null;
};

export type PricingConsistencyReport = {
  productId: string;
  consistent: boolean;
  divergences: Array<{
    planId: string;
    amounts: Array<{ surface: string; amount: number | null }>;
  }>;
  surfaces: SurfacePlanPrice[];
};

function planAmount(plan: PricingPlan, currency: string | null | undefined): number | null {
  return resolvePlanDisplayPrice(
    plan,
    (currency ?? "USD") as "USD",
    false,
  ).amount;
}

/**
 * Collect plan list prices as resolved for each dependent surface.
 * All surfaces must share the same catalogue/enrichment source of truth.
 */
export function collectSurfacePlanPrices(
  productId: string,
): SurfacePlanPrice[] {
  const software = getSoftwareBySlug(productId);
  if (!software) return [];

  const enrichment = loadEnrichment(productId);
  const { pricing } = resolveProductPricing(software);
  const snapshot = buildPricingSnapshot({ software, enrichment });
  const out: SurfacePlanPrice[] = [];

  const pushFromPlans = (
    surface: SurfacePlanPrice["surface"],
    plans: PricingPlan[] | undefined,
    currency: string | null | undefined,
  ) => {
    for (const plan of plans ?? []) {
      out.push({
        surface,
        planId: plan.id,
        planName: plan.name,
        amount: planAmount(plan, currency),
        currency: currency ?? null,
      });
    }
  };

  // Software review + comparison + calculator all consume resolveProductPricing /
  // buildPricingSnapshot — assert they stay identical for the same product.
  pushFromPlans("software", pricing?.plans, pricing?.currency);
  pushFromPlans(
    "pricing",
    snapshot.pricing?.plans,
    snapshot.pricing?.currency,
  );
  pushFromPlans(
    "comparison",
    pricing?.plans,
    pricing?.currency,
  );
  pushFromPlans(
    "calculator",
    snapshot.pricing?.plans,
    snapshot.pricing?.currency,
  );

  // Research aggregate: latest observation per plan must not contradict catalogue
  // when an observation exists for the same planId.
  const observations = listPriceObservations({ productId });
  const latestByPlan = new Map<string, (typeof observations)[number]>();
  for (const o of observations) {
    if (!o.planId || o.metricKind !== "plan-list") continue;
    const prev = latestByPlan.get(o.planId);
    if (!prev || o.observedAt > prev.observedAt) {
      latestByPlan.set(o.planId, o);
    }
  }
  for (const [planId, o] of latestByPlan) {
    out.push({
      surface: "research",
      planId,
      planName: o.planName ?? planId,
      amount: o.price,
      currency: o.currency,
    });
  }

  return out;
}

/**
 * Ensure the same product plan price does not diverge across
 * software, pricing, comparison, calculator, and research surfaces.
 *
 * Research diverges only when a plan-list observation exists for the plan
 * and its amount differs from the catalogue amount.
 */
export function assertPricingConsistency(
  productId: string,
): PricingConsistencyReport {
  const surfaces = collectSurfacePlanPrices(productId);
  const byPlan = new Map<string, SurfacePlanPrice[]>();
  for (const row of surfaces) {
    const list = byPlan.get(row.planId) ?? [];
    list.push(row);
    byPlan.set(row.planId, list);
  }

  const divergences: PricingConsistencyReport["divergences"] = [];

  for (const [planId, rows] of byPlan) {
    const catalogueAmounts = rows
      .filter((r) => r.surface !== "research")
      .map((r) => r.amount);
    const uniqueCatalogue = new Set(
      catalogueAmounts.map((a) => (a == null ? "null" : String(a))),
    );
    if (uniqueCatalogue.size > 1) {
      divergences.push({
        planId,
        amounts: rows.map((r) => ({ surface: r.surface, amount: r.amount })),
      });
      continue;
    }

    const catalogueAmount = catalogueAmounts[0] ?? null;
    const research = rows.find((r) => r.surface === "research");
    if (
      research &&
      catalogueAmount != null &&
      research.amount != null &&
      research.amount !== catalogueAmount
    ) {
      divergences.push({
        planId,
        amounts: rows.map((r) => ({ surface: r.surface, amount: r.amount })),
      });
    }
  }

  return {
    productId,
    consistent: divergences.length === 0,
    divergences,
    surfaces,
  };
}
