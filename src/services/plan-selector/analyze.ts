import type {
  CrmPlanSelectorAnswers,
  FeatureAvailability,
  FeatureSupport,
  Money,
  PlanSelectorSupportStatus,
  PricingPlan,
  RecommendationConfidence,
} from "@/domain";
import { crmRequirementsFromCalculatorInput, formatMoney } from "@/domain";
import { requirementLabel } from "@/data/config/plan-selector/requirements";
import {
  calculatePlanCost,
  confidenceFromSnapshot,
  findMinimumSuitablePlan,
  isCalculablePlan,
  planAllowsSeatCount,
  planMaxSeats,
  type PlanCostResult,
  type PricingSnapshot,
} from "@/services/pricing";

export type CoverageSymbol =
  | "included"
  | "limited"
  | "add-on"
  | "not-included"
  | "unknown";

export type PlanLadderEntry = {
  plan: PricingPlan;
  status:
    | "failed"
    | "recommended"
    | "eligible"
    | "upgrade"
    | "custom"
    | "skipped";
  missingMustHaves: string[];
  limitFailures: string[];
  niceToHavesGained: string[];
  cost?: PlanCostResult;
  summary: string;
};

export type RequirementDriver = {
  featureSlug: string;
  label: string;
  fromPlanSlug: string | null;
  fromPlanName: string | null;
  toPlanSlug: string;
  toPlanName: string;
  reason: "missing-feature" | "seat-limit" | "usage-limit";
};

export type CoverageCell = {
  featureSlug: string;
  planSlug: string;
  symbol: CoverageSymbol;
  notes?: string;
};

export type PlanSelectorAnalysis = {
  productSlug: string;
  productName: string;
  kind:
    | "recommended"
    | "custom-quote"
    | "no-suitable-plan"
    | "unknown-coverage";
  recommendedPlan: PricingPlan | null;
  cheapestEligiblePlan: PricingPlan | null;
  nextPlan: PricingPlan | null;
  previousFailedPlan: PricingPlan | null;
  planLadder: PlanLadderEntry[];
  requirementDrivers: RequirementDriver[];
  upgradeBenefits: string[];
  unusedCapabilitiesOnNext: string[];
  mustHaveSlugs: string[];
  niceToHaveSlugs: string[];
  coverageMatrix: CoverageCell[];
  pricingNow: PlanCostResult | null;
  pricingGrowth: PlanCostResult | null;
  confidence: RecommendationConfidence;
  confidenceReasons: string[];
  unknowns: string[];
  warnings: string[];
  explanation: string;
  verifiedAt?: string;
  sourceIds: string[];
  growthMayNeedReconsideration: boolean;
  growthReconsiderationReason?: string;
};

export type VendorPlanSupport = {
  productSlug: string;
  name: string;
  status: PlanSelectorSupportStatus;
  planCount: number;
  calculablePlanCount: number;
  featureMatrixCount: number;
  startingPriceMonthly: number | null;
  currency: string | null;
  logo?: { src: string; alt: string };
  reason?: string;
};

const HARD_GATE_FEATURE: Record<
  "requireSso" | "requireAuditLogs" | "requireAdvancedPermissions",
  string
> = {
  requireSso: "sso",
  requireAuditLogs: "audit-logs",
  requireAdvancedPermissions: "role-permissions",
};

/** Classify whether the Plan Selector can run for a snapshot. */
export function classifyVendorSupport(
  snapshot: PricingSnapshot,
): VendorPlanSupport {
  const plans = snapshot.pricing?.plans ?? [];
  const calculable = plans.filter(isCalculablePlan);
  const selfServe = plans.filter((p) => !p.contactSales);
  const emptyRuleStubs = selfServe.filter(
    (p) => !p.isFree && p.rules.length === 0,
  );
  const withMatrix = snapshot.featureSupport.filter(
    (f) => f.planSlugs.length > 0 && f.availability !== "unknown",
  );

  let status: PlanSelectorSupportStatus = "unsupported";
  let reason: string | undefined;

  const matrixOk = withMatrix.length >= 8;
  const multiTier = calculable.length >= 2 && matrixOk;
  /**
   * Single public tier (e.g. Nimble Business) is enough when every self-serve
   * plan is calculable — no empty-rule stubs pretending to be a ladder.
   */
  const completeSingleTier =
    calculable.length >= 1 &&
    matrixOk &&
    emptyRuleStubs.length === 0 &&
    selfServe.every((p) => isCalculablePlan(p));

  if (multiTier || completeSingleTier) {
    status = "supported";
    if (calculable.length === 1) {
      reason = "Single public plan tier with verified pricing.";
    }
  } else if (calculable.length >= 1 && withMatrix.length >= 4) {
    status = "partial";
    reason =
      emptyRuleStubs.length > 0
        ? "Some published plans lack verified list prices — recommendation confidence is limited."
        : "Plan data exists but the feature→plan matrix is incomplete.";
  } else if (plans.length > 0) {
    status = "unsupported";
    const creditOrUsage =
      snapshot.pricing?.model === "usage" ||
      plans.some(
        (p) =>
          /credit/i.test(p.name) ||
          /credit/i.test(p.slug) ||
          /pack/i.test(p.slug),
      );
    const allContactSales =
      calculable.length === 0 &&
      plans.every((p) => p.contactSales || p.rules.length === 0);
    if (creditOrUsage && calculable.length === 0) {
      reason =
        "Credit packs and usage pricing need a vendor quote — we do not invent credit dollar totals from incomplete public data.";
    } else if (allContactSales) {
      reason =
        "Pricing is quote-based — contact the vendor for a plan and seat quote. We won’t guess tiers from incomplete list prices.";
    } else if (calculable.length === 0) {
      reason =
        "No public seat/list prices to compare yet — ask the vendor which edition fits your requirements and what it costs.";
    } else {
      reason =
        "Plan comparison isn’t ready for this product yet — use the review or Finder, then confirm pricing with the vendor.";
    }
  } else {
    status = "unsupported";
    reason =
      "No verified public plan ladder — contact the vendor for pricing, or shortlist with the Finder first.";
  }

  return {
    productSlug: snapshot.productSlug,
    name: snapshot.name,
    status,
    planCount: plans.length,
    calculablePlanCount: calculable.length,
    featureMatrixCount: withMatrix.length,
    startingPriceMonthly: snapshot.pricing?.startingPriceMonthly ?? null,
    currency: snapshot.pricing?.currency ?? null,
    logo: snapshot.logo,
    reason,
  };
}

export function mustHaveSlugsFromAnswers(
  answers: CrmPlanSelectorAnswers,
  featureSupport: FeatureSupport[],
): { must: string[]; nice: string[]; unknowns: string[] } {
  const must = new Set<string>();
  const nice = new Set<string>();
  const unknowns: string[] = [];

  for (const [slug, priority] of Object.entries(
    answers.requirementPriorities,
  )) {
    if (priority === "must") must.add(slug);
    if (priority === "nice") nice.add(slug);
  }

  if (answers.requireSso) must.add(HARD_GATE_FEATURE.requireSso);
  if (answers.requireAuditLogs) must.add(HARD_GATE_FEATURE.requireAuditLogs);
  if (answers.requireAdvancedPermissions) {
    must.add(HARD_GATE_FEATURE.requireAdvancedPermissions);
  }
  // Sandbox: only gate when research records a feature; otherwise unknown.
  if (answers.requireSandbox) {
    const sandbox = featureSupport.find((f) => f.featureSlug === "sandbox");
    if (sandbox) {
      must.add("sandbox");
    } else {
      unknowns.push("sandbox");
    }
  }

  return {
    must: [...must],
    nice: [...nice].filter((s) => !must.has(s)),
    unknowns,
  };
}

function featureEntry(
  featureSupport: FeatureSupport[],
  featureSlug: string,
): FeatureSupport | undefined {
  return featureSupport.find((f) => f.featureSlug === featureSlug);
}

export function coverageForPlan(
  entry: FeatureSupport | undefined,
  planSlug: string,
): CoverageSymbol {
  if (!entry) return "unknown";
  const availability: FeatureAvailability = entry.availability;
  if (availability === "unknown") return "unknown";
  if (availability === "not-supported") return "not-included";
  if (entry.planSlugs.length === 0) {
    if (availability === "add-on") return "add-on";
    return "unknown";
  }
  if (!entry.planSlugs.includes(planSlug)) return "not-included";
  if (availability === "limited") return "limited";
  if (availability === "add-on") return "add-on";
  return "included";
}

function planCoversMustHave(
  plan: PricingPlan,
  featureSlug: string,
  featureSupport: FeatureSupport[],
): { ok: boolean; symbol: CoverageSymbol } {
  const entry = featureEntry(featureSupport, featureSlug);
  const symbol = coverageForPlan(entry, plan.slug);
  if (symbol === "unknown") return { ok: false, symbol };
  if (symbol === "not-included") return { ok: false, symbol };
  // included | limited | add-on count as available for hard gates
  return { ok: true, symbol };
}

function evaluatePlanEligibility(
  plan: PricingPlan,
  mustHaves: string[],
  seats: number,
  featureSupport: FeatureSupport[],
  usageAssumptions: Record<string, number>,
): {
  eligible: boolean;
  missingMustHaves: string[];
  limitFailures: string[];
  unknownMustHaves: string[];
} {
  const missingMustHaves: string[] = [];
  const unknownMustHaves: string[] = [];
  const limitFailures: string[] = [];

  for (const slug of mustHaves) {
    const { ok, symbol } = planCoversMustHave(plan, slug, featureSupport);
    if (symbol === "unknown") unknownMustHaves.push(slug);
    else if (!ok) missingMustHaves.push(slug);
  }

  if (!planAllowsSeatCount(plan, seats)) {
    const max = planMaxSeats(plan);
    limitFailures.push(
      max != null
        ? `Seat limit: plan allows up to ${max} users`
        : "Seat limit exceeded",
    );
  }

  // Published numeric limits only — never invent.
  const limits = plan.limits ?? {};
  for (const [key, assumed] of Object.entries(usageAssumptions)) {
    const published = limits[key];
    if (typeof published === "number" && Number.isFinite(published)) {
      if (assumed > published) {
        limitFailures.push(
          `Usage limit: ${key} needs ~${assumed}, plan allows ${published}`,
        );
      }
    }
  }

  const eligible =
    missingMustHaves.length === 0 &&
    unknownMustHaves.length === 0 &&
    limitFailures.length === 0;

  return { eligible, missingMustHaves, limitFailures, unknownMustHaves };
}

function orderedPlans(snapshot: PricingSnapshot): PricingPlan[] {
  return [...(snapshot.pricing?.plans ?? [])];
}

function costFor(
  plan: PricingPlan,
  seats: number,
  answers: CrmPlanSelectorAnswers,
  snapshot: PricingSnapshot,
): PlanCostResult | undefined {
  if (plan.contactSales || (!plan.isFree && plan.rules.length === 0)) {
    return undefined;
  }
  return calculatePlanCost({
    plan,
    seats,
    billingPreference: answers.billingPreference,
    currencyFallback: (snapshot.pricing?.currency as "USD") ?? "USD",
  });
}

/**
 * Full plan-selection analysis — pure, no React.
 */
export function analyzePlanSelection(
  snapshot: PricingSnapshot,
  answers: CrmPlanSelectorAnswers,
): PlanSelectorAnalysis {
  const plans = orderedPlans(snapshot);
  const { must, nice, unknowns: gateUnknowns } = mustHaveSlugsFromAnswers(
    answers,
    snapshot.featureSupport,
  );
  const seats = answers.crmUsers;
  const growthSeats = answers.usersIn12Months ?? seats;
  const unknowns = [...gateUnknowns];
  const warnings: string[] = [];

  // Detect unknown must-haves against matrix
  for (const slug of must) {
    const entry = featureEntry(snapshot.featureSupport, slug);
    if (!entry || entry.availability === "unknown") {
      if (!unknowns.includes(slug)) unknowns.push(slug);
    } else if (
      (entry.availability === "supported" ||
        entry.availability === "limited" ||
        entry.availability === "add-on") &&
      entry.planSlugs.length === 0
    ) {
      warnings.push("feature-plan-matrix-incomplete");
      if (!unknowns.includes(slug)) unknowns.push(slug);
    }
  }

  const ladder: PlanLadderEntry[] = [];
  const eligiblePlans: PricingPlan[] = [];

  for (const plan of plans) {
    const evalResult = evaluatePlanEligibility(
      plan,
      must,
      seats,
      snapshot.featureSupport,
      answers.usageAssumptions,
    );
    const cost = costFor(plan, seats, answers, snapshot);
    const niceGained = nice.filter((slug) => {
      const { ok } = planCoversMustHave(plan, slug, snapshot.featureSupport);
      return ok;
    });

    if (plan.contactSales || (!plan.isFree && plan.rules.length === 0)) {
      ladder.push({
        plan,
        status: "custom",
        missingMustHaves: evalResult.missingMustHaves,
        limitFailures: evalResult.limitFailures,
        niceToHavesGained: niceGained,
        cost,
        summary: "Contact sales / custom pricing",
      });
      continue;
    }

    if (evalResult.unknownMustHaves.length > 0) {
      ladder.push({
        plan,
        status: "skipped",
        missingMustHaves: evalResult.missingMustHaves,
        limitFailures: evalResult.limitFailures,
        niceToHavesGained: niceGained,
        cost,
        summary: `Unknown coverage: ${evalResult.unknownMustHaves.map(requirementLabel).join(", ")}`,
      });
      continue;
    }

    if (!evalResult.eligible) {
      const parts = [
        ...evalResult.missingMustHaves.map(
          (s) => `${requirementLabel(s)} missing`,
        ),
        ...evalResult.limitFailures,
      ];
      ladder.push({
        plan,
        status: "failed",
        missingMustHaves: evalResult.missingMustHaves,
        limitFailures: evalResult.limitFailures,
        niceToHavesGained: niceGained,
        cost,
        summary:
          parts.length > 0
            ? `${evalResult.missingMustHaves.length} must-have${evalResult.missingMustHaves.length === 1 ? "" : "s"} missing`
            : "Does not meet requirements",
      });
      continue;
    }

    eligiblePlans.push(plan);
    ladder.push({
      plan,
      status: "eligible",
      missingMustHaves: [],
      limitFailures: [],
      niceToHavesGained: niceGained,
      cost,
      summary: `${must.length} of ${must.length} must-haves met`,
    });
  }

  // Prefer engine alignment for recommended pick among calculable eligible
  const requirements = crmRequirementsFromCalculatorInput({
    crmUsers: seats,
    requiredFeatureSlugs: must,
    preferredFeatureSlugs: nice,
    billingPreference: answers.billingPreference,
  });
  const resolution = findMinimumSuitablePlan(snapshot, requirements);

  let kind: PlanSelectorAnalysis["kind"] = "recommended";
  let recommended: PricingPlan | null = null;
  let explanation = "";

  if (unknowns.length > 0 && eligiblePlans.length === 0) {
    kind = "unknown-coverage";
    explanation = `Cannot reliably select a plan; unknown coverage for: ${unknowns.map(requirementLabel).join(", ")}`;
  } else if (eligiblePlans.length === 0) {
    if (resolution.kind === "custom-quote") {
      kind = "custom-quote";
      recommended = resolution.plan ?? null;
      explanation =
        resolution.explanation ??
        "Only custom / contact-sales pricing is available for these requirements.";
    } else {
      kind = "no-suitable-plan";
      explanation =
        "No verified plan satisfies all must-have requirements and seat/usage limits. We will not recommend the highest tier by default.";
    }
  } else if (resolution.kind === "recommended" && resolution.plan) {
    // Ensure recommended is in eligible set; else first eligible
    recommended = eligiblePlans.some((p) => p.slug === resolution.plan!.slug)
      ? resolution.plan
      : eligiblePlans[0]!;
    kind = "recommended";
    explanation =
      "Lowest plan that meets all of your must-have requirements.";
  } else if (resolution.kind === "custom-quote") {
    kind = "custom-quote";
    recommended = resolution.plan ?? eligiblePlans[0] ?? null;
    explanation =
      resolution.explanation ?? "Custom pricing may apply.";
  } else if (resolution.kind === "unknown-coverage") {
    kind = "unknown-coverage";
    explanation = resolution.explanation ?? explanation;
    recommended = eligiblePlans[0] ?? null;
  } else {
    recommended = eligiblePlans[0]!;
    kind = "recommended";
    explanation =
      "Lowest plan that meets all of your must-have requirements.";
  }

  warnings.push(...resolution.warnings);

  // Mark ladder statuses relative to recommendation
  const recommendedIndex = recommended
    ? ladder.findIndex((e) => e.plan.slug === recommended!.slug)
    : -1;

  for (let i = 0; i < ladder.length; i++) {
    const entry = ladder[i]!;
    if (recommended && entry.plan.slug === recommended.slug) {
      entry.status = "recommended";
      entry.summary = "Recommended — lowest qualifying tier";
    } else if (
      entry.status === "eligible" &&
      recommendedIndex >= 0 &&
      i > recommendedIndex
    ) {
      entry.status = "upgrade";
      entry.summary =
        entry.niceToHavesGained.length > 0
          ? `+${entry.niceToHavesGained.length} nice-to-have capabilities`
          : "Higher tier — optional for your must-haves";
    }
  }

  const cheapestEligible = eligiblePlans[0] ?? null;
  const nextPlan =
    recommendedIndex >= 0 && recommendedIndex < ladder.length - 1
      ? ladder[recommendedIndex + 1]?.plan ?? null
      : null;

  const previousFailed =
    recommendedIndex > 0
      ? ladder
          .slice(0, recommendedIndex)
          .reverse()
          .find((e) => e.status === "failed")?.plan ?? null
      : null;

  // Drivers: features that first appear at recommended vs lower failed plans
  const requirementDrivers: RequirementDriver[] = [];
  if (recommended && recommendedIndex > 0) {
    const lower = ladder.slice(0, recommendedIndex);
    for (const slug of must) {
      const failedBecause = lower.filter(
        (e) =>
          e.status === "failed" &&
          (e.missingMustHaves.includes(slug) ||
            e.limitFailures.some((l) => l.toLowerCase().includes("seat"))),
      );
      if (failedBecause.length === 0) continue;
      const from = failedBecause[failedBecause.length - 1]!;
      const seatFail = from.limitFailures.length > 0 && from.missingMustHaves.length === 0;
      requirementDrivers.push({
        featureSlug: slug,
        label: requirementLabel(slug),
        fromPlanSlug: from.plan.slug,
        fromPlanName: from.plan.name,
        toPlanSlug: recommended.slug,
        toPlanName: recommended.name,
        reason: seatFail ? "seat-limit" : "missing-feature",
      });
    }
    // Deduplicate by feature
    const seen = new Set<string>();
    for (let i = requirementDrivers.length - 1; i >= 0; i--) {
      const d = requirementDrivers[i]!;
      if (seen.has(d.featureSlug)) requirementDrivers.splice(i, 1);
      else seen.add(d.featureSlug);
    }
  }

  const upgradeBenefits: string[] = [];
  const unusedCapabilitiesOnNext: string[] = [];
  if (nextPlan && recommended) {
    for (const slug of nice) {
      const onRec = planCoversMustHave(
        recommended,
        slug,
        snapshot.featureSupport,
      );
      const onNext = planCoversMustHave(nextPlan, slug, snapshot.featureSupport);
      if (!onRec.ok && onNext.ok) {
        upgradeBenefits.push(requirementLabel(slug));
      }
    }
    // Capabilities on next that user marked don't-need or didn't select
    for (const fs of snapshot.featureSupport) {
      const priority = answers.requirementPriorities[fs.featureSlug];
      if (priority === "must" || priority === "nice") continue;
      const onRec = planCoversMustHave(
        recommended,
        fs.featureSlug,
        snapshot.featureSupport,
      );
      const onNext = planCoversMustHave(
        nextPlan,
        fs.featureSlug,
        snapshot.featureSupport,
      );
      if (!onRec.ok && onNext.ok) {
        unusedCapabilitiesOnNext.push(requirementLabel(fs.featureSlug));
      }
    }
  }

  const coverageMatrix: CoverageCell[] = [];
  const matrixFeatures = [...new Set([...must, ...nice])];
  for (const featureSlug of matrixFeatures) {
    const entry = featureEntry(snapshot.featureSupport, featureSlug);
    for (const plan of plans) {
      coverageMatrix.push({
        featureSlug,
        planSlug: plan.slug,
        symbol: coverageForPlan(entry, plan.slug),
        notes: entry?.notes,
      });
    }
  }

  const pricingNow =
    recommended && kind === "recommended"
      ? costFor(recommended, seats, answers, snapshot) ?? null
      : null;
  const pricingGrowth =
    recommended && kind === "recommended"
      ? costFor(recommended, growthSeats, answers, snapshot) ?? null
      : null;

  // Growth reconsideration when seat caps break at growth seats
  let growthMayNeedReconsideration = false;
  let growthReconsiderationReason: string | undefined;
  if (recommended && growthSeats > seats) {
    const growthEval = evaluatePlanEligibility(
      recommended,
      must,
      growthSeats,
      snapshot.featureSupport,
      answers.usageAssumptions,
    );
    if (!growthEval.eligible) {
      growthMayNeedReconsideration = true;
      growthReconsiderationReason =
        growthEval.limitFailures[0] ??
        "Your 12-month seat count may exceed this plan’s published limits.";
    }
  }

  const confidenceReasons: string[] = [];
  let confidence = confidenceFromSnapshot(snapshot, {
    matrixIncomplete: warnings.includes("feature-plan-matrix-incomplete"),
    unknownFeatures: unknowns.length > 0,
    hasAssumptions: Object.keys(answers.usageAssumptions).length > 0,
  });

  if (kind === "recommended" && unknowns.length === 0) {
    confidenceReasons.push(
      "All must-have requirements and relevant published limits were checked against verified plan data.",
    );
  }
  if (unknowns.length > 0) {
    confidenceReasons.push(
      `${unknowns.length} item(s) require verification: ${unknowns.map(requirementLabel).join(", ")}.`,
    );
    confidence = "low";
  }
  if (snapshot.hasFixtureResearch) {
    confidenceReasons.push(
      "Some research for this product is fixture-flagged — treat list prices as provisional.",
    );
  }
  if (kind === "no-suitable-plan" || kind === "custom-quote") {
    confidenceReasons.push(explanation);
  }
  if (confidenceReasons.length === 0) {
    confidenceReasons.push(
      confidence === "high"
        ? "Recommendation based on published plan matrices."
        : "Recommendation is directional; confirm details with the vendor.",
    );
  }

  return {
    productSlug: snapshot.productSlug,
    productName: snapshot.name,
    kind,
    recommendedPlan: recommended,
    cheapestEligiblePlan: cheapestEligible,
    nextPlan,
    previousFailedPlan: previousFailed,
    planLadder: ladder,
    requirementDrivers,
    upgradeBenefits,
    unusedCapabilitiesOnNext,
    mustHaveSlugs: must,
    niceToHaveSlugs: nice,
    coverageMatrix,
    pricingNow,
    pricingGrowth,
    confidence,
    confidenceReasons,
    unknowns,
    warnings: [...new Set(warnings)],
    explanation,
    verifiedAt: snapshot.pricingCheckedAt,
    sourceIds: snapshot.sourceIds,
    growthMayNeedReconsideration,
    growthReconsiderationReason,
  };
}

/** Lightweight live preview while answering (may be partial). */
export function previewPlanSelection(
  snapshot: PricingSnapshot | null,
  answers: CrmPlanSelectorAnswers,
): PlanSelectorAnalysis | null {
  if (!snapshot || !answers.productSlug) return null;
  return analyzePlanSelection(snapshot, {
    ...answers,
    productSlug: snapshot.productSlug,
  });
}

export function formatPlanMoney(money: Money | undefined | null): string | null {
  if (!money) return null;
  return formatMoney(money, { maximumFractionDigits: 0 });
}
