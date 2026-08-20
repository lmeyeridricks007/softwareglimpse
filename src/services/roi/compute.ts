import type {
  RoiAssumptionType,
  RoiConfidence,
  RoiCostAvoidanceRow,
  RoiInputs,
  RoiInvestment,
  RoiProcessHours,
  RoiProductivity,
  RoiProductivityRole,
  RoiScenarioKey,
  RoiValueBasis,
} from "@/domain";

export type RoiBenefitCategory =
  | "productivity"
  | "cost-avoidance"
  | "revenue-scenario"
  | "other";

export type RoiCashFlowYear = {
  year: number;
  label: string;
  costsMinor: number;
  benefitsMinor: number;
  netMinor: number;
  cumulativeMinor: number;
};

export type RoiBenefitLine = {
  id: string;
  category: RoiBenefitCategory;
  label: string;
  annualMinor: number;
  assumptionType: RoiAssumptionType;
  confidence: RoiConfidence;
  valueBasis?: RoiValueBasis;
  included: boolean;
};

export type RoiAssumptionRow = {
  id: string;
  label: string;
  valueLabel: string;
  assumptionType: RoiAssumptionType;
  confidence: RoiConfidence;
  included: boolean;
  notes?: string;
  editablePath?: string;
};

export type RoiUnknownCost = {
  id: string;
  label: string;
  material: boolean;
};

export type RoiBreakEven = {
  hoursSavedPerUserWeek: number | null;
  annualMeasurableBenefitMinor: number | null;
  additionalContributionMinor: number | null;
  narrative: string[];
};

export type RoiAssessment = {
  paybackBand: "fast" | "moderate" | "long" | "none" | "unknown";
  benefitConfidence: RoiConfidence | "unknown";
  revenueDependence: "low" | "medium" | "high";
  costCompleteness: "complete" | "partial" | "significant-unknowns";
  interpretation: string;
};

export type RoiScenarioResult = {
  key: RoiScenarioKey;
  label: string;
  annualBenefitMinor: number;
  netAnnualBenefitMinor: number | null;
  threeYearBenefitMinor: number;
  threeYearCostMinor: number | null;
  netThreeYearValueMinor: number | null;
  roiPercent: number | null;
  paybackMonths: number | null;
  paybackApproximate: boolean;
};

export type RoiSensitivityPoint = {
  id: string;
  label: string;
  baseRoiPercent: number | null;
  altRoiPercent: number | null;
  deltaRoiPp: number | null;
  description: string;
};

export type RoiComputeResult = {
  currency: string;
  horizonYears: number;
  scenario: RoiScenarioKey;
  status: "complete" | "provisional" | "incomplete" | "negative";
  statusReason: string | null;

  year1InvestmentMinor: number | null;
  annualRecurringMinor: number | null;
  threeYearTcoMinor: number | null;

  annualBenefitMinor: number;
  netAnnualBenefitMinor: number | null;
  threeYearBenefitMinor: number;
  netThreeYearValueMinor: number | null;

  roiPercent: number | null;
  paybackMonths: number | null;
  paybackApproximate: boolean;

  benefitLines: RoiBenefitLine[];
  benefitByCategory: Array<{
    category: RoiBenefitCategory;
    annualMinor: number;
    sharePercent: number;
  }>;
  benefitByType: Array<{
    assumptionType: RoiAssumptionType;
    annualMinor: number;
    sharePercent: number;
  }>;

  cashFlow: RoiCashFlowYear[];
  breakEvenMonth: number | null;

  unknowns: RoiUnknownCost[];
  assumptions: RoiAssumptionRow[];
  assessment: RoiAssessment;
  breakEven: RoiBreakEven;
  scenarios: RoiScenarioResult[];
  sensitivity: RoiSensitivityPoint[];
  overlapWarnings: string[];

  currentSoftwareAnnualMinor: number;
  productivityGrossAnnualMinor: number;
  productivityRealizedAnnualMinor: number;
  realizationFactor: number;
};

const MATERIAL_INVESTMENT_FIELDS: Array<{
  key: keyof RoiInvestment;
  label: string;
}> = [
  { key: "licencesMinor", label: "CRM licences" },
  { key: "implementationPartnerMinor", label: "Implementation partner" },
  { key: "integrationsMinor", label: "Integrations" },
  { key: "migrationMinor", label: "Migration" },
];

function isKnown(value: number | null | undefined): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function sumKnown(values: Array<number | null | undefined>): number | null {
  let total = 0;
  let any = false;
  for (const v of values) {
    if (isKnown(v)) {
      total += v;
      any = true;
    }
  }
  return any ? total : null;
}

function sumProcessHours(
  hours: RoiProcessHours["salesRep"] | RoiProcessHours["manager"] | RoiProcessHours["opsAdmin"],
): number {
  return Object.values(hours).reduce((a, b) => a + (b ?? 0), 0);
}

export function currentHoursForRole(
  inputs: RoiInputs,
  role: "salesReps" | "managers" | "opsAdmin",
): number {
  const ph = inputs.currentState.processHours;
  if (role === "salesReps") return sumProcessHours(ph.salesRep);
  if (role === "managers") return sumProcessHours(ph.manager);
  return sumProcessHours(ph.opsAdmin);
}

export function resolveHoursSaved(
  role: RoiProductivityRole,
  currentHours: number,
  scenario: RoiScenarioKey,
): number {
  // Only use per-scenario overrides when that scenario key was explicitly set.
  // Avoid treating a missing key (or accidental base: 0 from UI side-effects) as
  // a hard override of the main hours-saved / reduction inputs.
  if (
    role.scenarioHours &&
    Object.prototype.hasOwnProperty.call(role.scenarioHours, scenario)
  ) {
    const scenarioHours = role.scenarioHours[scenario];
    if (typeof scenarioHours === "number" && Number.isFinite(scenarioHours)) {
      return Math.max(0, scenarioHours);
    }
  }
  if (role.inputMode === "hours-saved") {
    return Math.max(0, role.hoursSavedPerWeek ?? 0);
  }
  const pct = role.reductionPercent ?? 0;
  return Math.max(0, (currentHours * pct) / 100);
}

export function annualizeSoftwareRow(row: {
  include: boolean;
  billing: "annual" | "monthly";
  annualMinor?: number | null;
  monthlyMinor?: number | null;
}): number {
  if (!row.include) return 0;
  if (row.billing === "monthly" && isKnown(row.monthlyMinor)) {
    return row.monthlyMinor * 12;
  }
  if (isKnown(row.annualMinor)) return row.annualMinor;
  if (isKnown(row.monthlyMinor)) return row.monthlyMinor * 12;
  return 0;
}

export function computeInternalLabourMinor(
  investment: RoiInvestment,
): number {
  return investment.internalLabour.reduce((sum, row) => {
    const rate = row.hourlyCostMinor ?? 0;
    return sum + Math.round(row.people * row.hours * rate);
  }, 0);
}

export function computeInvestmentTotals(investment: RoiInvestment): {
  year1OneTimeMinor: number | null;
  year1SoftwareMinor: number | null;
  year1InvestmentMinor: number | null;
  annualRecurringMinor: number | null;
  unknowns: RoiUnknownCost[];
} {
  const unknowns: RoiUnknownCost[] = [];

  for (const field of MATERIAL_INVESTMENT_FIELDS) {
    const v = investment[field.key];
    if (v === null) {
      unknowns.push({
        id: String(field.key),
        label: field.label,
        material: true,
      });
    }
  }

  const oneTimeParts = [
    investment.implementationPartnerMinor,
    investment.migrationMinor,
    investment.integrationsMinor,
    investment.trainingMinor,
    investment.changeManagementMinor,
    investment.customizationMinor,
    investment.otherOneTimeMinor,
  ];
  const softwareY1Parts = [
    investment.licencesMinor,
    investment.addOnsMinor,
    investment.otherRecurringSoftwareMinor,
  ];
  const recurringParts = [
    investment.licencesMinor,
    investment.addOnsMinor,
    investment.otherRecurringSoftwareMinor,
    investment.crmAdministrationMinor,
    investment.premiumSupportMinor,
    investment.integrationPlatformMinor,
    investment.ongoingTrainingMinor,
  ];

  const internal = computeInternalLabourMinor(investment);
  const oneTimeKnown = sumKnown(oneTimeParts);
  const softwareY1 = sumKnown(softwareY1Parts);
  const recurring = sumKnown(recurringParts);

  const year1OneTimeMinor =
    oneTimeKnown == null && internal === 0
      ? oneTimeKnown
      : (oneTimeKnown ?? 0) + internal;

  let year1InvestmentMinor: number | null = null;
  if (year1OneTimeMinor != null || softwareY1 != null) {
    year1InvestmentMinor = (year1OneTimeMinor ?? 0) + (softwareY1 ?? 0);
  }

  return {
    year1OneTimeMinor,
    year1SoftwareMinor: softwareY1,
    year1InvestmentMinor,
    annualRecurringMinor: recurring,
    unknowns,
  };
}

export function costAvoidanceAnnual(row: RoiCostAvoidanceRow): number {
  if (!row.included || !isKnown(row.currentAnnualMinor)) return 0;
  return Math.round((row.currentAnnualMinor * row.eliminationPercent) / 100);
}

function winRateImprovementPp(
  inputs: RoiInputs,
  scenario: RoiScenarioKey,
): number {
  const wr = inputs.costRevenue.winRate;
  const override = wr.scenarioImprovementPp?.[scenario];
  if (typeof override === "number" && Number.isFinite(override)) {
    return override;
  }
  if (
    isKnown(wr.currentWinRatePercent) &&
    isKnown(wr.scenarioWinRatePercent)
  ) {
    return wr.scenarioWinRatePercent - wr.currentWinRatePercent;
  }
  return 0;
}

export function computeBenefitLines(
  inputs: RoiInputs,
  scenario: RoiScenarioKey,
): RoiBenefitLine[] {
  const lines: RoiBenefitLine[] = [];
  const cs = inputs.currentState;
  const prod = inputs.productivity;
  const weeks = cs.workingWeeksPerYear;
  const factor = prod.realizationFactor;

  const roles: Array<{
    key: keyof RoiProductivity;
    roleKey: "salesReps" | "managers" | "opsAdmin";
    users: number;
    hourly: number | undefined;
    label: string;
  }> = [
    {
      key: "salesReps",
      roleKey: "salesReps",
      users: cs.salesReps,
      hourly: cs.hourlyCosts.salesRepMinor,
      label: "Sales rep productivity",
    },
    {
      key: "managers",
      roleKey: "managers",
      users: cs.managers,
      hourly: cs.hourlyCosts.managerMinor,
      label: "Manager productivity",
    },
    {
      key: "opsAdmin",
      roleKey: "opsAdmin",
      users: cs.opsAdminUsers,
      hourly: cs.hourlyCosts.opsAdminMinor,
      label: "Ops/admin productivity",
    },
  ];

  for (const r of roles) {
    const roleCfg = prod[r.key] as RoiProductivityRole;
    if (!roleCfg.included) continue;
    const currentHours = currentHoursForRole(inputs, r.roleKey);
    const hoursSaved = resolveHoursSaved(roleCfg, currentHours, scenario);
    const hourly = r.hourly ?? 0;
    const gross = Math.round(r.users * hoursSaved * weeks * hourly);
    const realized = Math.round(gross * factor);
    if (realized === 0 && hoursSaved === 0) continue;
    lines.push({
      id: `productivity-${r.roleKey}`,
      category: "productivity",
      label: r.label,
      annualMinor: realized,
      assumptionType: roleCfg.assumptionType,
      confidence: roleCfg.confidence,
      included: roleCfg.included,
    });
  }

  for (const row of inputs.costRevenue.costAvoidance) {
    const annual = costAvoidanceAnnual(row);
    if (!row.included && annual === 0) continue;
    lines.push({
      id: `avoidance-${row.id}`,
      category: "cost-avoidance",
      label: row.label,
      annualMinor: row.included ? annual : 0,
      assumptionType: row.assumptionType,
      confidence: row.confidence,
      included: row.included,
    });
  }

  const wr = inputs.costRevenue.winRate;
  if (wr.enabled && wr.included) {
    const opps = wr.annualQualifiedOpportunities ?? 0;
    const pp = winRateImprovementPp(inputs, scenario);
    const contrib = wr.contributionPerWinMinor ?? 0;
    const additionalWins = opps * (pp / 100);
    const annual = Math.round(additionalWins * contrib);
    lines.push({
      id: "win-rate",
      category: "revenue-scenario",
      label: `Win-rate scenario (${pp >= 0 ? "+" : ""}${pp.toFixed(1)} pp)`,
      annualMinor: annual,
      assumptionType: wr.assumptionType,
      confidence: wr.confidence,
      valueBasis: wr.valueBasis,
      included: wr.included,
    });
  }

  const conv = inputs.costRevenue.conversion;
  if (conv.enabled && conv.included) {
    const leads = conv.leadsPerYear ?? 0;
    const current = conv.currentConversionPercent ?? 0;
    const next = conv.scenarioConversionPercent ?? current;
    const delta = (next - current) / 100;
    const contrib = conv.contributionPerDealMinor ?? 0;
    const annual = Math.round(leads * delta * contrib);
    lines.push({
      id: "conversion",
      category: "revenue-scenario",
      label: "Lead conversion scenario",
      annualMinor: annual,
      assumptionType: conv.assumptionType,
      confidence: conv.confidence,
      valueBasis: conv.valueBasis,
      included: conv.included,
    });
  }

  const rec = inputs.costRevenue.recovered;
  if (rec.enabled && rec.included) {
    const n = rec.opportunitiesRecovered ?? 0;
    const p = (rec.winProbabilityPercent ?? 0) / 100;
    const v = rec.contributionPerOpportunityMinor ?? 0;
    const annual = Math.round(n * p * v);
    lines.push({
      id: "recovered",
      category: "revenue-scenario",
      label: "Recovered opportunities",
      annualMinor: annual,
      assumptionType: rec.assumptionType,
      confidence: rec.confidence,
      valueBasis: rec.valueBasis,
      included: rec.included,
    });
  }

  const cap = inputs.costRevenue.capacity;
  if (cap.enabled && cap.included && isKnown(cap.additionalAnnualContributionMinor)) {
    lines.push({
      id: "capacity",
      category: "revenue-scenario",
      label: "Capacity / cycle scenario",
      annualMinor: cap.additionalAnnualContributionMinor,
      assumptionType: cap.assumptionType,
      confidence: cap.confidence,
      valueBasis: "contribution",
      included: cap.included,
    });
  }

  const other = inputs.costRevenue;
  if (
    other.otherBenefitsIncluded &&
    isKnown(other.otherBenefitsMinor) &&
    other.otherBenefitsMinor > 0
  ) {
    lines.push({
      id: "other",
      category: "other",
      label: other.otherBenefitsLabel || "Other benefits",
      annualMinor: other.otherBenefitsMinor,
      assumptionType: other.otherBenefitsType,
      confidence: other.otherBenefitsConfidence,
      included: true,
    });
  }

  return lines;
}

function adoptionFactor(inputs: RoiInputs, year: number): number {
  if (!inputs.adoption.enabled) return 1;
  if (year <= 1) return inputs.adoption.year1Percent / 100;
  if (year === 2) return inputs.adoption.year2Percent / 100;
  return inputs.adoption.year3Percent / 100;
}

export function computeRoiForScenario(
  inputs: RoiInputs,
  scenario: RoiScenarioKey,
): Omit<
  RoiComputeResult,
  "scenarios" | "sensitivity" | "assumptions" | "assessment" | "breakEven" | "overlapWarnings"
> & { productivityGrossAnnualMinor: number } {
  const investment = computeInvestmentTotals(inputs.investment);
  const lines = computeBenefitLines(inputs, scenario).filter((l) => l.included);
  const annualBenefitMinor = lines.reduce((s, l) => s + l.annualMinor, 0);

  const productivityGross = computeBenefitLines(
    {
      ...inputs,
      productivity: { ...inputs.productivity, realizationFactor: 1 },
    },
    scenario,
  )
    .filter((l) => l.category === "productivity" && l.included)
    .reduce((s, l) => s + l.annualMinor, 0);

  const productivityRealized = lines
    .filter((l) => l.category === "productivity")
    .reduce((s, l) => s + l.annualMinor, 0);

  const currentSoftwareAnnualMinor = inputs.currentState.softwareCosts.reduce(
    (s, row) => s + annualizeSoftwareRow(row),
    0,
  );

  const categoryMap = new Map<RoiBenefitCategory, number>();
  for (const l of lines) {
    categoryMap.set(l.category, (categoryMap.get(l.category) ?? 0) + l.annualMinor);
  }
  const benefitByCategory = (
    ["productivity", "cost-avoidance", "revenue-scenario", "other"] as const
  ).map((category) => {
    const annualMinor = categoryMap.get(category) ?? 0;
    return {
      category,
      annualMinor,
      sharePercent:
        annualBenefitMinor > 0
          ? Math.round((annualMinor / annualBenefitMinor) * 100)
          : 0,
    };
  });

  const typeMap = new Map<RoiAssumptionType, number>();
  for (const l of lines) {
    typeMap.set(
      l.assumptionType,
      (typeMap.get(l.assumptionType) ?? 0) + l.annualMinor,
    );
  }
  const benefitByType = (
    ["verified", "estimated", "scenario", "unknown"] as const
  ).map((assumptionType) => {
    const annualMinor = typeMap.get(assumptionType) ?? 0;
    return {
      assumptionType,
      annualMinor,
      sharePercent:
        annualBenefitMinor > 0
          ? Math.round((annualMinor / annualBenefitMinor) * 100)
          : 0,
    };
  });

  const horizon = inputs.horizonYears;
  const y1 = investment.year1InvestmentMinor;
  const recurring = investment.annualRecurringMinor;

  const cashFlow: RoiCashFlowYear[] = [];
  let cumulative = 0;
  let breakEvenMonth: number | null = null;

  // Year 0 = implementation / start: year-1 investment outflow, no benefits yet
  const year0Cost = y1 ?? 0;
  cumulative -= year0Cost;
  cashFlow.push({
    year: 0,
    label: "Year 0 / Implementation",
    costsMinor: year0Cost,
    benefitsMinor: 0,
    netMinor: -year0Cost,
    cumulativeMinor: cumulative,
  });

  for (let y = 1; y <= horizon; y++) {
    const adopt = adoptionFactor(inputs, y);
    const benefits = Math.round(annualBenefitMinor * adopt);
    // Year 1 software already in year0/y1 investment; years 2+ pay recurring
    const costs =
      y === 1
        ? 0
        : recurring ?? 0;
    // If year1 investment was null, treat costs as unknown → mark later
    const net = benefits - costs;
    cumulative += net;
    cashFlow.push({
      year: y,
      label: `Year ${y}`,
      costsMinor: costs,
      benefitsMinor: benefits,
      netMinor: net,
      cumulativeMinor: cumulative,
    });
  }

  // Monthly payback approximation using year-1 benefit run-rate after year 0
  const y1Benefit = Math.round(annualBenefitMinor * adoptionFactor(inputs, 1));
  const monthlyBenefit = y1Benefit / 12;
  const monthlyRecurringY1 = 0; // recurring already bundled into year-1 investment
  const monthlyNet = monthlyBenefit - monthlyRecurringY1;
  let paybackMonths: number | null = null;
  let paybackApproximate = true;
  if (y1 != null && y1 > 0 && monthlyNet > 0) {
    // Walk months: start at -y1, add monthly net; after month 12 start charging recurring/12
    let cum = -y1;
    const monthlyRecurring = (recurring ?? 0) / 12;
    for (let m = 1; m <= horizon * 12; m++) {
      const benefitThisMonth = (annualBenefitMinor * adoptionFactor(
        inputs,
        Math.ceil(m / 12),
      )) / 12;
      const costThisMonth = m <= 12 ? 0 : monthlyRecurring;
      cum += benefitThisMonth - costThisMonth;
      if (cum >= 0) {
        paybackMonths = m;
        break;
      }
    }
    paybackApproximate = Boolean(inputs.adoption.enabled) || investment.unknowns.length > 0;
  } else if (y1 != null && y1 === 0 && annualBenefitMinor > 0) {
    paybackMonths = 0;
    paybackApproximate = false;
  }

  if (paybackMonths != null) {
    breakEvenMonth = paybackMonths;
  }

  const threeYearBenefitMinor = cashFlow
    .filter((r) => r.year >= 1)
    .reduce((s, r) => s + r.benefitsMinor, 0);

  let threeYearTcoMinor: number | null = null;
  if (y1 != null && recurring != null) {
    threeYearTcoMinor = y1 + recurring * Math.max(0, horizon - 1);
  } else if (y1 != null && horizon === 1) {
    threeYearTcoMinor = y1;
  }

  const netAnnualBenefitMinor =
    recurring != null ? annualBenefitMinor - recurring : null;

  const netThreeYearValueMinor =
    threeYearTcoMinor != null
      ? threeYearBenefitMinor - threeYearTcoMinor
      : null;

  let roiPercent: number | null = null;
  if (threeYearTcoMinor != null && threeYearTcoMinor > 0) {
    roiPercent =
      ((threeYearBenefitMinor - threeYearTcoMinor) / threeYearTcoMinor) * 100;
  } else if (threeYearTcoMinor === 0) {
    roiPercent = null; // invalid denominator
  }

  const hasMaterialUnknowns = investment.unknowns.some((u) => u.material);
  const hasAnyKnownCost = y1 != null || recurring != null;
  let status: RoiComputeResult["status"] = "complete";
  let statusReason: string | null = null;

  if (!hasAnyKnownCost) {
    status = "incomplete";
    statusReason =
      "ROI cannot be calculated yet because no CRM investment costs have been entered. Add licence and/or implementation costs in the CRM Investment step.";
    roiPercent = null;
    paybackMonths = null;
  } else if (hasMaterialUnknowns && !inputs.allowProvisional) {
    status = "incomplete";
    statusReason = `ROI cannot be finalized because ${investment.unknowns
      .filter((u) => u.material)
      .map((u) => u.label)
      .join(", ")} remain unknown.`;
    roiPercent = null;
    paybackMonths = null;
  } else if (hasMaterialUnknowns && inputs.allowProvisional) {
    status = "provisional";
    statusReason =
      "Provisional scenario — material cost inputs are still unknown.";
  }

  if (
    status !== "incomplete" &&
    netThreeYearValueMinor != null &&
    netThreeYearValueMinor < 0
  ) {
    status = "negative";
    statusReason =
      "Under the current assumptions, estimated benefits do not recover the modeled CRM investment within the selected period.";
  }

  return {
    currency: inputs.currency,
    horizonYears: horizon,
    scenario,
    status,
    statusReason,
    year1InvestmentMinor: y1,
    annualRecurringMinor: recurring,
    threeYearTcoMinor,
    annualBenefitMinor,
    netAnnualBenefitMinor,
    threeYearBenefitMinor,
    netThreeYearValueMinor,
    roiPercent,
    paybackMonths,
    paybackApproximate,
    benefitLines: lines,
    benefitByCategory,
    benefitByType,
    cashFlow,
    breakEvenMonth,
    unknowns: investment.unknowns,
    currentSoftwareAnnualMinor,
    productivityGrossAnnualMinor: productivityGross,
    productivityRealizedAnnualMinor: productivityRealized,
    realizationFactor: inputs.productivity.realizationFactor,
  };
}

function buildAssumptions(inputs: RoiInputs, scenario: RoiScenarioKey): RoiAssumptionRow[] {
  const rows: RoiAssumptionRow[] = [];
  const prod = inputs.productivity;
  const cs = inputs.currentState;

  for (const role of [
    {
      key: "salesReps" as const,
      label: "Rep time saved",
      users: cs.salesReps,
    },
    {
      key: "managers" as const,
      label: "Manager time saved",
      users: cs.managers,
    },
    {
      key: "opsAdmin" as const,
      label: "Ops/admin time saved",
      users: cs.opsAdminUsers,
    },
  ]) {
    const cfg = prod[role.key];
    const hours = resolveHoursSaved(
      cfg,
      currentHoursForRole(inputs, role.key),
      scenario,
    );
    rows.push({
      id: `prod-${role.key}`,
      label: role.label,
      valueLabel: `${hours} hr/week × ${role.users} users`,
      assumptionType: cfg.assumptionType,
      confidence: cfg.confidence,
      included: cfg.included,
      editablePath: "productivity",
    });
  }

  rows.push({
    id: "realization",
    label: "Productivity realization factor",
    valueLabel: `${Math.round(prod.realizationFactor * 100)}%`,
    assumptionType: "estimated",
    confidence: "medium",
    included: true,
    editablePath: "productivity",
  });

  for (const row of inputs.costRevenue.costAvoidance) {
    rows.push({
      id: `avoid-${row.id}`,
      label: row.label,
      valueLabel: isKnown(row.currentAnnualMinor)
        ? `${row.eliminationPercent}% of annual cost`
        : "Unknown",
      assumptionType: row.assumptionType,
      confidence: row.confidence,
      included: row.included,
      editablePath: "cost-revenue",
    });
  }

  const wr = inputs.costRevenue.winRate;
  if (wr.enabled) {
    const pp = winRateImprovementPp(inputs, scenario);
    rows.push({
      id: "win-rate",
      label: "Win-rate improvement",
      valueLabel: `${pp >= 0 ? "+" : ""}${pp} pp`,
      assumptionType: wr.assumptionType,
      confidence: wr.confidence,
      included: wr.included,
      editablePath: "cost-revenue",
    });
  }

  if (inputs.adoption.enabled) {
    rows.push({
      id: "adoption",
      label: "Adoption ramp",
      valueLabel: `Y1 ${inputs.adoption.year1Percent}% / Y2 ${inputs.adoption.year2Percent}% / Y3 ${inputs.adoption.year3Percent}%`,
      assumptionType: "estimated",
      confidence: "medium",
      included: true,
      editablePath: "assumptions",
    });
  }

  for (const override of inputs.assumptionOverrides) {
    const existing = rows.find((r) => r.id === override.id);
    if (!existing) continue;
    if (override.included != null) existing.included = override.included;
    if (override.assumptionType) existing.assumptionType = override.assumptionType;
    if (override.confidence) existing.confidence = override.confidence;
    if (override.notes) existing.notes = override.notes;
  }

  return rows;
}

function buildAssessment(
  partial: ReturnType<typeof computeRoiForScenario>,
): RoiAssessment {
  const revenueShare =
    partial.benefitByCategory.find((c) => c.category === "revenue-scenario")
      ?.sharePercent ?? 0;
  const verifiedShare =
    partial.benefitByType.find((t) => t.assumptionType === "verified")
      ?.sharePercent ?? 0;
  const estimatedShare =
    partial.benefitByType.find((t) => t.assumptionType === "estimated")
      ?.sharePercent ?? 0;
  const scenarioShare =
    partial.benefitByType.find((t) => t.assumptionType === "scenario")
      ?.sharePercent ?? 0;

  let paybackBand: RoiAssessment["paybackBand"] = "unknown";
  if (partial.status === "incomplete") paybackBand = "unknown";
  else if (partial.paybackMonths == null) paybackBand = "none";
  else if (partial.paybackMonths <= 12) paybackBand = "fast";
  else if (partial.paybackMonths <= 24) paybackBand = "moderate";
  else paybackBand = "long";

  let benefitConfidence: RoiAssessment["benefitConfidence"] = "unknown";
  if (partial.annualBenefitMinor <= 0) benefitConfidence = "low";
  else if (verifiedShare + estimatedShare >= 70 && scenarioShare < 40)
    benefitConfidence = verifiedShare >= 40 ? "high" : "medium";
  else if (scenarioShare >= 50) benefitConfidence = "low";
  else benefitConfidence = "medium";

  const revenueDependence: RoiAssessment["revenueDependence"] =
    revenueShare >= 50 ? "high" : revenueShare >= 25 ? "medium" : "low";

  const costCompleteness: RoiAssessment["costCompleteness"] =
    partial.unknowns.filter((u) => u.material).length >= 2
      ? "significant-unknowns"
      : partial.unknowns.length > 0
        ? "partial"
        : "complete";

  let interpretation: string;
  if (partial.status === "incomplete") {
    interpretation =
      partial.statusReason ??
      "ROI is incomplete because material cost inputs remain unknown.";
  } else if (partial.status === "negative") {
    interpretation =
      "Your base case shows negative 3-year value under the current assumptions. Review costs, realization, or measurable benefits before treating this as an approval case.";
  } else if (scenarioShare >= 50) {
    interpretation = `Your base case shows ${
      partial.netThreeYearValueMinor != null && partial.netThreeYearValueMinor > 0
        ? "positive"
        : "mixed"
    } 3-year value, but ${scenarioShare}% of modeled benefit depends on scenario assumptions.`;
  } else if (verifiedShare + estimatedShare >= 60) {
    interpretation =
      "Most projected value is supported by verified or estimated inputs rather than speculative revenue scenarios.";
  } else {
    interpretation =
      "Review the assumption register — benefit confidence is mixed across verified, estimated, and scenario inputs.";
  }

  return {
    paybackBand,
    benefitConfidence,
    revenueDependence,
    costCompleteness,
    interpretation,
  };
}

export function computeBreakEven(inputs: RoiInputs): RoiBreakEven {
  const investment = computeInvestmentTotals(inputs.investment);
  const narrative: string[] = [];
  const y1 = investment.year1InvestmentMinor;
  const recurring = investment.annualRecurringMinor ?? 0;
  const horizon = inputs.horizonYears;

  if (y1 == null) {
    return {
      hoursSavedPerUserWeek: null,
      annualMeasurableBenefitMinor: null,
      additionalContributionMinor: null,
      narrative: [
        "Break-even cannot be calculated until Year 1 investment is known.",
      ],
    };
  }

  // Annual benefit needed so 3-year benefits = 3-year costs (no adoption ramp)
  const threeYearCost = y1 + recurring * Math.max(0, horizon - 1);
  const annualNeeded =
    horizon > 0 ? Math.ceil(threeYearCost / horizon) : threeYearCost;

  narrative.push(
    `At your current cost assumptions, the CRM breaks even over ${horizon} years if it delivers approximately ${annualNeeded} (minor units) of annual measurable benefit.`,
  );

  // Hours saved needed from productivity alone (all users, current realization)
  const cs = inputs.currentState;
  const totalUsers = cs.salesReps + cs.managers + cs.opsAdminUsers;
  const avgHourly =
    [
      cs.hourlyCosts.salesRepMinor,
      cs.hourlyCosts.managerMinor,
      cs.hourlyCosts.opsAdminMinor,
    ].filter((v): v is number => typeof v === "number" && v > 0)[0] ?? 0;
  const factor = inputs.productivity.realizationFactor;

  let hoursSavedPerUserWeek: number | null = null;
  if (totalUsers > 0 && avgHourly > 0 && factor > 0) {
    const annualPerHourPerUser =
      cs.workingWeeksPerYear * avgHourly * factor;
    if (annualPerHourPerUser > 0) {
      hoursSavedPerUserWeek =
        Math.round((annualNeeded / (totalUsers * annualPerHourPerUser)) * 100) /
        100;
      narrative.push(
        `Equivalently, about ${hoursSavedPerUserWeek} hours saved per paid user per week (at ${Math.round(factor * 100)}% realization).`,
      );
    }
  }

  return {
    hoursSavedPerUserWeek,
    annualMeasurableBenefitMinor: annualNeeded,
    additionalContributionMinor: annualNeeded,
    narrative,
  };
}

function detectOverlapWarnings(inputs: RoiInputs): string[] {
  const warnings: string[] = [];
  const hasProductivityHours =
    resolveHoursSaved(
      inputs.productivity.salesReps,
      currentHoursForRole(inputs, "salesReps"),
      inputs.activeScenario,
    ) > 0 ||
    resolveHoursSaved(
      inputs.productivity.managers,
      currentHoursForRole(inputs, "managers"),
      inputs.activeScenario,
    ) > 0 ||
    resolveHoursSaved(
      inputs.productivity.opsAdmin,
      currentHoursForRole(inputs, "opsAdmin"),
      inputs.activeScenario,
    ) > 0;

  const hasHourly =
    (inputs.currentState.hourlyCosts.salesRepMinor ?? 0) > 0 ||
    (inputs.currentState.hourlyCosts.managerMinor ?? 0) > 0 ||
    (inputs.currentState.hourlyCosts.opsAdminMinor ?? 0) > 0;

  if (hasProductivityHours && !hasHourly) {
    warnings.push(
      "Time savings are entered, but loaded hourly costs are missing — productivity value stays €0 until you add hourly rates (or turn off “use my own estimate later”).",
    );
  }

  const hasProductivityReduction =
    hasProductivityHours ||
    (inputs.productivity.salesReps.reductionPercent ?? 0) > 0 ||
    (inputs.productivity.managers.reductionPercent ?? 0) > 0 ||
    (inputs.productivity.opsAdmin.reductionPercent ?? 0) > 0;

  const hasCurrentHours =
    currentHoursForRole(inputs, "salesReps") > 0 ||
    currentHoursForRole(inputs, "managers") > 0 ||
    currentHoursForRole(inputs, "opsAdmin") > 0;

  if (
    hasCurrentHours &&
    !hasProductivityReduction &&
    inputs.productivity.salesReps.inputMode === "reduction-percent"
  ) {
    warnings.push(
      "Current process hours are set, but expected reduction % / hours saved are still blank — enter productivity assumptions to turn time into measurable benefit.",
    );
  }

  if (
    hasProductivityHours &&
    inputs.costRevenue.otherBenefitsIncluded &&
    (inputs.costRevenue.otherBenefitsMinor ?? 0) > 0 &&
    /headcount|fte|staff|salary|payroll/i.test(
      inputs.costRevenue.otherBenefitsLabel ?? "",
    )
  ) {
    warnings.push(
      "These benefits may overlap: productivity time savings and a staff/headcount cost reduction could count the same value twice.",
    );
  }

  return warnings;
}

function buildSensitivity(
  inputs: RoiInputs,
  base: ReturnType<typeof computeRoiForScenario>,
): RoiSensitivityPoint[] {
  const points: RoiSensitivityPoint[] = [];
  const baseRoi = base.roiPercent;

  // Realization factor swing
  {
    const altFactor = Math.min(1, inputs.productivity.realizationFactor + 0.25);
    if (altFactor !== inputs.productivity.realizationFactor) {
      const alt = computeRoiForScenario(
        {
          ...inputs,
          productivity: {
            ...inputs.productivity,
            realizationFactor: altFactor,
          },
        },
        inputs.activeScenario,
      );
      points.push({
        id: "realization",
        label: "Productivity realization",
        baseRoiPercent: baseRoi,
        altRoiPercent: alt.roiPercent,
        deltaRoiPp:
          baseRoi != null && alt.roiPercent != null
            ? alt.roiPercent - baseRoi
            : null,
        description: `If realization moves to ${Math.round(altFactor * 100)}%`,
      });
    }
  }

  // Hours saved +0.5 for reps
  {
    const current = resolveHoursSaved(
      inputs.productivity.salesReps,
      currentHoursForRole(inputs, "salesReps"),
      inputs.activeScenario,
    );
    const alt = computeRoiForScenario(
      {
        ...inputs,
        productivity: {
          ...inputs.productivity,
          salesReps: {
            ...inputs.productivity.salesReps,
            inputMode: "hours-saved",
            hoursSavedPerWeek: current + 0.5,
          },
        },
      },
      inputs.activeScenario,
    );
    points.push({
      id: "hours-saved",
      label: "Hours saved (reps)",
      baseRoiPercent: baseRoi,
      altRoiPercent: alt.roiPercent,
      deltaRoiPp:
        baseRoi != null && alt.roiPercent != null
          ? alt.roiPercent - baseRoi
          : null,
      description: `If rep hours saved rise from ${current} to ${current + 0.5}/week`,
    });
  }

  // Implementation +10k major
  if (isKnown(inputs.investment.implementationPartnerMinor) || inputs.investment.implementationPartnerMinor === undefined) {
    const current = inputs.investment.implementationPartnerMinor ?? 0;
    const alt = computeRoiForScenario(
      {
        ...inputs,
        investment: {
          ...inputs.investment,
          implementationPartnerMinor: current + 1_000_000,
        },
      },
      inputs.activeScenario,
    );
    points.push({
      id: "implementation",
      label: "Implementation cost",
      baseRoiPercent: baseRoi,
      altRoiPercent: alt.roiPercent,
      deltaRoiPp:
        baseRoi != null && alt.roiPercent != null
          ? alt.roiPercent - baseRoi
          : null,
      description: "If implementation partner cost rises by 10,000 (major units)",
    });
  }

  // Win-rate +1pp when enabled
  if (inputs.costRevenue.winRate.enabled) {
    const wr = inputs.costRevenue.winRate;
    const currentPp = winRateImprovementPp(inputs, inputs.activeScenario);
    const alt = computeRoiForScenario(
      {
        ...inputs,
        costRevenue: {
          ...inputs.costRevenue,
          winRate: {
            ...wr,
            scenarioImprovementPp: {
              conservative: currentPp + 1,
              base: currentPp + 1,
              upside: currentPp + 1,
            },
          },
        },
      },
      inputs.activeScenario,
    );
    points.push({
      id: "win-rate",
      label: "Win-rate improvement",
      baseRoiPercent: baseRoi,
      altRoiPercent: alt.roiPercent,
      deltaRoiPp:
        baseRoi != null && alt.roiPercent != null
          ? alt.roiPercent - baseRoi
          : null,
      description: `If win-rate improvement rises by +1 pp`,
    });
  }

  return points.sort(
    (a, b) => Math.abs(b.deltaRoiPp ?? 0) - Math.abs(a.deltaRoiPp ?? 0),
  );
}

const SCENARIO_LABELS: Record<RoiScenarioKey, string> = {
  conservative: "Conservative",
  base: "Base",
  upside: "Upside",
};

/**
 * Full ROI computation for the active scenario plus comparison scenarios.
 * Pure function — no I/O, no invented defaults for benefits.
 */
export function computeRoi(inputs: RoiInputs): RoiComputeResult {
  const base = computeRoiForScenario(inputs, inputs.activeScenario);
  const scenarios: RoiScenarioResult[] = (
    ["conservative", "base", "upside"] as const
  ).map((key) => {
    const r = computeRoiForScenario(inputs, key);
    return {
      key,
      label: SCENARIO_LABELS[key],
      annualBenefitMinor: r.annualBenefitMinor,
      netAnnualBenefitMinor: r.netAnnualBenefitMinor,
      threeYearBenefitMinor: r.threeYearBenefitMinor,
      threeYearCostMinor: r.threeYearTcoMinor,
      netThreeYearValueMinor: r.netThreeYearValueMinor,
      roiPercent: r.roiPercent,
      paybackMonths: r.paybackMonths,
      paybackApproximate: r.paybackApproximate,
    };
  });

  return {
    ...base,
    assumptions: buildAssumptions(inputs, inputs.activeScenario),
    assessment: buildAssessment(base),
    breakEven: computeBreakEven(inputs),
    scenarios,
    sensitivity: buildSensitivity(inputs, base),
    overlapWarnings: detectOverlapWarnings(inputs),
  };
}

/** Apply a single sensitivity slider override and recompute. */
export function computeRoiWithOverrides(
  inputs: RoiInputs,
  overrides: {
    realizationFactor?: number;
    salesRepHoursSaved?: number;
  },
): RoiComputeResult {
  const next: RoiInputs = {
    ...inputs,
    productivity: {
      ...inputs.productivity,
      realizationFactor:
        overrides.realizationFactor ?? inputs.productivity.realizationFactor,
      salesReps:
        overrides.salesRepHoursSaved != null
          ? {
              ...inputs.productivity.salesReps,
              inputMode: "hours-saved",
              hoursSavedPerWeek: overrides.salesRepHoursSaved,
            }
          : inputs.productivity.salesReps,
    },
  };
  return computeRoi(next);
}
