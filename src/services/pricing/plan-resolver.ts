import type {
  CrmRequirements,
  FeatureSupport,
  PricingPlan,
} from "@/domain";
import { calculatePlanCost, isCalculablePlan } from "./plan-cost";
import type { PlanResolution, PricingSnapshot } from "./types";

/**
 * Resolve the minimum suitable plan for CRM cost calculation.
 *
 * When featureSupport entries are product-level `supported`/`limited` with
 * empty planSlugs, we do NOT invent a plan matrix. Eligible calculable plans
 * are those with non-empty rules that aren't contact-sales; we pick the
 * lowest monthly-equivalent and emit `feature-plan-matrix-incomplete`.
 */
export function findMinimumSuitablePlan(
  snapshot: PricingSnapshot,
  requirements: CrmRequirements,
): PlanResolution {
  const plans = snapshot.pricing?.plans ?? [];
  const warnings: string[] = [];

  if (plans.length === 0) {
    return {
      kind: "custom-quote",
      warnings,
      explanation: "No plans available — insufficient pricing structure",
    };
  }

  const featureCheck = assessRequiredFeatures(
    snapshot.featureSupport,
    requirements.requiredFeatureSlugs,
  );

  if (featureCheck.notSupported.length > 0) {
    return {
      kind: "no-suitable-plan",
      warnings,
      explanation: `Required features not supported: ${featureCheck.notSupported.join(", ")}`,
    };
  }

  if (featureCheck.unknown.length > 0) {
    return {
      kind: "unknown-coverage",
      warnings: [...warnings, "required-feature-unknown"],
      explanation: `Cannot reliably select a plan; unknown coverage for: ${featureCheck.unknown.join(", ")}`,
    };
  }

  const matrixIncomplete = featureCheck.matrixIncomplete;
  if (matrixIncomplete) {
    warnings.push("feature-plan-matrix-incomplete");
  }

  const calculable = plans.filter(isCalculablePlan);
  const customOnly = plans.filter(
    (p) => p.contactSales || p.rules.length === 0,
  );

  if (calculable.length === 0) {
    if (customOnly.length > 0) {
      return {
        kind: "custom-quote",
        plan: customOnly[0],
        warnings,
        explanation: "Only contact-sales / empty-rule plans available",
      };
    }
    return {
      kind: "custom-quote",
      warnings,
      explanation: "No calculable plans",
    };
  }

  // With incomplete matrix (or no required features), pick lowest monthly-eq.
  // With a complete matrix and planSlugs, restrict to plans that cover features.
  let candidates = calculable;
  if (!matrixIncomplete && requirements.requiredFeatureSlugs.length > 0) {
    const restricted = filterPlansByFeatureMatrix(
      calculable,
      snapshot.featureSupport,
      requirements.requiredFeatureSlugs,
    );
    if (restricted.kind === "no-suitable-plan") {
      return { kind: "no-suitable-plan", warnings, explanation: restricted.explanation };
    }
    if (restricted.kind === "unknown-coverage") {
      return {
        kind: "unknown-coverage",
        warnings: [...warnings, ...(restricted.warnings ?? [])],
        explanation: restricted.explanation,
      };
    }
    candidates = restricted.plans;
    warnings.push(...(restricted.warnings ?? []));
  }

  /**
   * Never auto-select a free plan when the user listed required capabilities
   * and paid calculable plans exist. Free tiers rarely include the full
   * capability set buyers are filtering on; $0 would be misleading.
   */
  if (requirements.requiredFeatureSlugs.length > 0) {
    const paid = candidates.filter((p) => !p.isFree);
    if (paid.length > 0 && paid.length < candidates.length) {
      candidates = paid;
      warnings.push("excluded-free-plan-with-required-features");
    } else if (
      matrixIncomplete &&
      paid.length > 0
    ) {
      candidates = paid;
      warnings.push("excluded-free-plan-without-feature-matrix");
    }
  }

  // Honour published seat caps (e.g. Attio Free ≤ 3, Plus ≤ 10).
  const seatFiltered = candidates.filter((p) =>
    planAllowsSeatCount(p, requirements.crmUsers),
  );
  if (seatFiltered.length < candidates.length) {
    warnings.push("excluded-plans-over-seat-cap");
  }
  if (seatFiltered.length > 0) {
    candidates = seatFiltered;
  }

  /**
   * Unbounded free tiers (no published max seats) are not used for multi-seat
   * team estimates when paid plans remain — avoids $0 TCO for team sizes.
   */
  if (requirements.crmUsers > 1) {
    const paid = candidates.filter((p) => !p.isFree);
    const freeUnbounded = candidates.filter(
      (p) => p.isFree && planMaxSeats(p) == null,
    );
    if (paid.length > 0 && freeUnbounded.length > 0) {
      candidates = candidates.filter(
        (p) => !(p.isFree && planMaxSeats(p) == null),
      );
      warnings.push("excluded-unbounded-free-plan-for-team");
    }
  }

  const ranked = candidates
    .map((plan) => ({
      plan,
      cost: calculatePlanCost({
        plan,
        seats: requirements.crmUsers,
        billingPreference: requirements.billingPreference,
        currencyFallback: (snapshot.pricing?.currency as "USD") ?? "USD",
      }),
    }))
    .sort(
      (a, b) =>
        a.cost.monthlyEquivalent.amountMinor -
        b.cost.monthlyEquivalent.amountMinor ||
        a.plan.slug.localeCompare(b.plan.slug),
    );

  const best = ranked[0];
  if (!best) {
    return {
      kind: "no-suitable-plan",
      warnings,
      explanation: "No candidate plans after filtering",
    };
  }

  return {
    kind: "recommended",
    plan: best.plan,
    warnings,
  };
}

/** Published max seats from plan.limits.maxSeats or per-seat maximumSeats. */
export function planMaxSeats(plan: PricingPlan): number | null {
  const fromLimits = plan.limits?.maxSeats;
  if (typeof fromLimits === "number" && Number.isFinite(fromLimits)) {
    return fromLimits;
  }
  for (const rule of plan.rules) {
    if (rule.kind === "per-seat" && rule.maximumSeats != null) {
      return rule.maximumSeats;
    }
  }
  return null;
}

export function planAllowsSeatCount(plan: PricingPlan, seats: number): boolean {
  const max = planMaxSeats(plan);
  if (max == null) return true;
  return seats <= max;
}

function assessRequiredFeatures(
  featureSupport: FeatureSupport[],
  required: string[],
): {
  notSupported: string[];
  unknown: string[];
  matrixIncomplete: boolean;
} {
  const notSupported: string[] = [];
  const unknown: string[] = [];
  let matrixIncomplete = false;

  if (required.length === 0) {
    // Still incomplete if any product-level support has empty planSlugs
    matrixIncomplete = featureSupport.some(
      (f) =>
        (f.availability === "supported" || f.availability === "limited") &&
        f.planSlugs.length === 0,
    );
    return { notSupported, unknown, matrixIncomplete };
  }

  for (const slug of required) {
    const entry = featureSupport.find((f) => f.featureSlug === slug);
    if (!entry) {
      unknown.push(slug);
      continue;
    }
    const availability = entry.availability;
    if (availability === "not-supported") {
      notSupported.push(slug);
      continue;
    }
    // higher-plan-only without planSlugs → treat as unknown for resolution
    if (availability === "higher-plan-only" && entry.planSlugs.length === 0) {
      unknown.push(slug);
      continue;
    }
    if (availability === "unknown") {
      unknown.push(slug);
      continue;
    }
    if (
      (availability === "supported" ||
        availability === "limited" ||
        availability === "add-on") &&
      entry.planSlugs.length === 0
    ) {
      matrixIncomplete = true;
    }
  }

  // Also flag if product generally lacks plan matrices
  if (
    !matrixIncomplete &&
    featureSupport.some(
      (f) =>
        required.includes(f.featureSlug) &&
        (f.availability === "supported" || f.availability === "limited") &&
        f.planSlugs.length === 0,
    )
  ) {
    matrixIncomplete = true;
  }

  return { notSupported, unknown, matrixIncomplete };
}

function filterPlansByFeatureMatrix(
  plans: PricingPlan[],
  featureSupport: FeatureSupport[],
  required: string[],
):
  | { kind: "ok"; plans: PricingPlan[]; warnings?: string[] }
  | { kind: "no-suitable-plan"; explanation: string }
  | { kind: "unknown-coverage"; explanation: string; warnings?: string[] } {
  const warnings: string[] = [];
  let filtered = [...plans];

  for (const slug of required) {
    const entry = featureSupport.find((f) => f.featureSlug === slug);
    if (!entry) continue;
    if (entry.planSlugs.length === 0) continue;

    if (entry.availability === "higher-plan-only" || entry.availability === "supported" || entry.availability === "limited") {
      filtered = filtered.filter((p) => entry.planSlugs.includes(p.slug));
      if (entry.availability === "higher-plan-only") {
        warnings.push(`feature-${slug}-higher-plan-only`);
      }
    }
  }

  if (filtered.length === 0) {
    return {
      kind: "no-suitable-plan",
      explanation: "No plan covers all required features per plan matrix",
    };
  }

  return { kind: "ok", plans: filtered, warnings };
}
