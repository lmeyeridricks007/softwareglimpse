/**
 * CRM Migration Cost Calculator — pure compute engine.
 *
 * Rules:
 * - Unknown / blank money ≠ 0
 * - No invented labour rates or industry averages
 * - Contingency only when user selects a %
 * - Low/expected/high ranges only when user supplies bounds
 * - Complexity never converts directly into euros
 */

import type {
  McComplexityBand,
  McConfidence,
  McCostCategoryId,
  McInputs,
  McMoneyRange,
} from "@/domain";
import {
  computeComplexityProfile,
  mappingComplexityBand,
  type McComplexityProfile,
} from "./complexity";

export type McCostBucket =
  | "external"
  | "internal"
  | "tooling"
  | "contingency"
  | "optional"
  | "unknown";

export type McCostLine = {
  id: string;
  category: McCostCategoryId;
  bucket: McCostBucket;
  label: string;
  expectedMinor: number | null;
  lowMinor: number | null;
  highMinor: number | null;
  hours?: number | null;
  known: boolean;
  optional?: boolean;
  notes?: string;
};

export type McUnknownDriver = {
  id: string;
  label: string;
  material: boolean;
};

export type McCostDriver = {
  id: string;
  label: string;
  expectedMinor: number;
  sharePercent: number;
};

export type McCategoryTotal = {
  id: McCostCategoryId;
  label: string;
  expectedMinor: number | null;
  lowMinor: number | null;
  highMinor: number | null;
  known: boolean;
};

export type McWorkSplit = {
  internalLabels: string[];
  externalLabels: string[];
  internalMinor: number | null;
  externalMinor: number | null;
};

export type McComputeResult = {
  currency: string;
  status: "complete" | "provisional" | "incomplete";
  statusReason: string | null;

  expectedTotalMinor: number | null;
  lowTotalMinor: number | null;
  highTotalMinor: number | null;
  hasUserRange: boolean;

  externalMinor: number | null;
  internalLabourMinor: number | null;
  toolingMinor: number | null;
  contingencyMinor: number | null;
  optionalMinor: number | null;

  knownMinor: number;
  coveragePercent: number | null;
  materialUnknownCount: number;

  lines: McCostLine[];
  categories: McCategoryTotal[];
  drivers: McCostDriver[];
  unknowns: McUnknownDriver[];

  complexity: McComplexityProfile;
  mappingComplexity: McComplexityBand;
  confidence: McConfidence;

  timelineWeeks: number | null;
  timelineApproximate: boolean;

  workSplit: McWorkSplit;
  readinessWarnings: string[];

  phaseTotals: Array<{
    id: string;
    label: string;
    expectedMinor: number | null;
  }>;
  scopeReductions: Array<{
    id: string;
    label: string;
    enabled: boolean;
    reductionMinor: number | null;
  }>;

  internalHoursTotal: number | null;
  partnerQuoteComparison: Array<{
    id: string;
    provider: string;
    modeledMinor: number | null;
    selected: boolean;
    includedScope?: string;
    excludedScope?: string;
  }>;
};

const CATEGORY_LABELS: Record<McCostCategoryId, string> = {
  discovery: "Discovery & planning",
  "data-preparation": "Data preparation",
  mapping: "Field mapping & transform",
  integrations: "Integrations / customization",
  "migration-execution": "Migration execution",
  testing: "Testing & validation",
  "internal-labour": "Internal labour",
  training: "Training & change",
  "cutover-hypercare": "Cutover & hypercare",
  tooling: "Tooling",
  contingency: "Contingency",
  optional: "Optional / scenario",
};

function sumKnown(values: Array<number | null | undefined>): number | null {
  const known = values.filter((v): v is number => v != null);
  if (known.length === 0) return null;
  return known.reduce((a, b) => a + b, 0);
}

function addNullable(
  a: number | null,
  b: number | null | undefined,
): number | null {
  if (a == null && b == null) return null;
  return (a ?? 0) + (b ?? 0);
}

function rangeFrom(
  expected: number | null,
  range?: McMoneyRange,
): { low: number | null; high: number | null; hasRange: boolean } {
  if (!range) return { low: null, high: null, hasRange: false };
  const low = range.lowMinor ?? null;
  const high = range.highMinor ?? null;
  const mid = range.expectedMinor ?? expected;
  const hasRange = low != null || high != null;
  return {
    low: low ?? mid,
    high: high ?? mid,
    hasRange,
  };
}

function roleLabourMinor(row: {
  include: boolean;
  people: number;
  hoursPerPerson: number;
  hourlyCostMinor?: number;
  totalCostMinor?: number | null;
}): { minor: number | null; hours: number } {
  if (!row.include) return { minor: null, hours: 0 };
  const hours = row.people * row.hoursPerPerson;
  if (row.totalCostMinor != null) {
    return { minor: row.totalCostMinor, hours };
  }
  if (row.hourlyCostMinor != null && hours > 0) {
    return { minor: Math.round(hours * row.hourlyCostMinor), hours };
  }
  if (hours > 0) {
    return { minor: null, hours };
  }
  return { minor: null, hours: 0 };
}

function toolingRowMinor(row: {
  include: boolean;
  costMinor?: number | null;
  billing: string;
  durationMonths?: number;
}): number | null {
  if (!row.include || row.costMinor == null) return null;
  if (row.billing === "monthly" && row.durationMonths != null) {
    return Math.round(row.costMinor * row.durationMonths);
  }
  return row.costMinor;
}

function partnerQuoteMinor(q: {
  fixedCostMinor?: number | null;
  dayRateMinor?: number | null;
  estimatedDays?: number;
  contingencyPercent?: number;
}): number | null {
  let base: number | null = null;
  if (q.fixedCostMinor != null) base = q.fixedCostMinor;
  else if (q.dayRateMinor != null && q.estimatedDays != null) {
    base = Math.round(q.dayRateMinor * q.estimatedDays);
  }
  if (base == null) return null;
  if (q.contingencyPercent != null && q.contingencyPercent > 0) {
    return Math.round(base * (1 + q.contingencyPercent / 100));
  }
  return base;
}

function collectLines(inputs: McInputs): McCostLine[] {
  const lines: McCostLine[] = [];

  // Discovery & planning
  if (inputs.approach.discoveryPlanningMinor != null) {
    lines.push({
      id: "discovery-external",
      category: "discovery",
      bucket: "external",
      label: "Discovery & planning (external)",
      expectedMinor: inputs.approach.discoveryPlanningMinor,
      lowMinor: null,
      highMinor: null,
      known: true,
    });
  }

  // Data quality / preparation
  if (inputs.dataQuality.overallExternalQuoteMinor != null) {
    lines.push({
      id: "dq-overall-external",
      category: "data-preparation",
      bucket: "external",
      label: "Data cleansing (external quote)",
      expectedMinor: inputs.dataQuality.overallExternalQuoteMinor,
      lowMinor: null,
      highMinor: null,
      known: true,
    });
  }
  for (const issue of inputs.dataQuality.issues) {
    if (issue.externalQuoteMinor != null) {
      lines.push({
        id: `dq-${issue.id}`,
        category: "data-preparation",
        bucket: "external",
        label: `Data quality: ${issue.id}`,
        expectedMinor: issue.externalQuoteMinor,
        lowMinor: null,
        highMinor: null,
        known: true,
        hours: issue.estimatedHours,
      });
    }
  }
  if (inputs.dataScope.attachments.storageMigrationCostMinor != null) {
    lines.push({
      id: "attachment-storage",
      category: "data-preparation",
      bucket: "external",
      label: "Attachment / storage migration",
      expectedMinor: inputs.dataScope.attachments.storageMigrationCostMinor,
      lowMinor: null,
      highMinor: null,
      known: true,
    });
  }

  // Mapping
  const mapRange = rangeFrom(
    inputs.fieldMapping.externalQuoteMinor ?? null,
    inputs.fieldMapping.range,
  );
  if (inputs.fieldMapping.externalQuoteMinor != null || mapRange.hasRange) {
    lines.push({
      id: "mapping-external",
      category: "mapping",
      bucket: "external",
      label: "Field mapping & transformation (external)",
      expectedMinor:
        inputs.fieldMapping.range?.expectedMinor ??
        inputs.fieldMapping.externalQuoteMinor ??
        null,
      lowMinor: mapRange.low,
      highMinor: mapRange.high,
      known: (inputs.fieldMapping.externalQuoteMinor ??
        inputs.fieldMapping.range?.expectedMinor) != null,
      hours: inputs.fieldMapping.internalHours,
    });
  }

  // Integrations
  for (const row of inputs.integrations.rows) {
    if (!row.include) continue;
    if (row.externalCostMinor != null) {
      lines.push({
        id: `int-${row.id}`,
        category: "integrations",
        bucket: "external",
        label: `Integration: ${row.label}`,
        expectedMinor: row.externalCostMinor,
        lowMinor: null,
        highMinor: null,
        known: true,
        hours: row.internalHours,
      });
    }
  }
  for (const c of inputs.integrations.customizations) {
    if (c.required !== "yes") continue;
    if (c.costMinor != null) {
      lines.push({
        id: `cust-${c.id}`,
        category: "integrations",
        bucket: c.owner === "internal" ? "internal" : "external",
        label: `Customization: ${c.id}`,
        expectedMinor: c.costMinor,
        lowMinor: null,
        highMinor: null,
        known: true,
        hours: c.estimatedHours,
      });
    }
  }

  // Migration execution / approach
  if (inputs.approach.externalImplementationQuoteMinor != null) {
    lines.push({
      id: "impl-quote",
      category: "migration-execution",
      bucket: "external",
      label: "External implementation quote",
      expectedMinor: inputs.approach.externalImplementationQuoteMinor,
      lowMinor: null,
      highMinor: null,
      known: true,
      notes: "May overlap with migration-specific quote — review coverage",
    });
  }
  if (inputs.approach.migrationSpecificQuoteMinor != null) {
    lines.push({
      id: "migration-quote",
      category: "migration-execution",
      bucket: "external",
      label: "Migration-specific quote",
      expectedMinor: inputs.approach.migrationSpecificQuoteMinor,
      lowMinor: null,
      highMinor: null,
      known: true,
    });
  }
  if (inputs.approach.executionExternalMinor != null) {
    lines.push({
      id: "execution-external",
      category: "migration-execution",
      bucket: "external",
      label: "Migration execution (external)",
      expectedMinor: inputs.approach.executionExternalMinor,
      lowMinor: null,
      highMinor: null,
      known: true,
    });
  }
  if (
    inputs.approach.partnerDayRateMinor != null &&
    inputs.approach.estimatedDays != null
  ) {
    lines.push({
      id: "partner-rate-days",
      category: "migration-execution",
      bucket: "external",
      label: "Partner rate × days",
      expectedMinor: Math.round(
        inputs.approach.partnerDayRateMinor * inputs.approach.estimatedDays,
      ),
      lowMinor: null,
      highMinor: null,
      known: true,
    });
  }

  // Selected partner quote (if any selected and not already covered by quotes above)
  const selectedQuote = inputs.approach.quotes.find((q) => q.selected);
  if (selectedQuote) {
    const modeled = partnerQuoteMinor(selectedQuote);
    if (modeled != null) {
      lines.push({
        id: `quote-${selectedQuote.id}`,
        category: "migration-execution",
        bucket: "external",
        label: `Selected quote: ${selectedQuote.provider || "Partner"}`,
        expectedMinor: modeled,
        lowMinor: null,
        highMinor: null,
        known: true,
      });
    }
  }

  // Tooling
  if (inputs.approach.toolingLicenseCostMinor != null) {
    lines.push({
      id: "tooling-license",
      category: "tooling",
      bucket: "tooling",
      label: "Migration tooling / licenses",
      expectedMinor: inputs.approach.toolingLicenseCostMinor,
      lowMinor: null,
      highMinor: null,
      known: true,
    });
  }
  for (const tool of inputs.approach.tooling) {
    const minor = toolingRowMinor(tool);
    if (minor != null) {
      lines.push({
        id: `tool-${tool.id}`,
        category: "tooling",
        bucket: "tooling",
        label: tool.tool,
        expectedMinor: minor,
        lowMinor: null,
        highMinor: null,
        known: true,
      });
    }
  }

  // Internal labour by role
  for (const role of inputs.internalEffort.roles) {
    const { minor, hours } = roleLabourMinor(role);
    if (minor != null || hours > 0) {
      lines.push({
        id: `role-${role.id}`,
        category: "internal-labour",
        bucket: "internal",
        label: role.label,
        expectedMinor: minor,
        lowMinor: null,
        highMinor: null,
        known: minor != null,
        hours,
      });
    }
  }

  // Testing cycles
  for (const cycle of inputs.testingCutover.testing.cycles) {
    if (!cycle.include) continue;
    if (cycle.partnerCostMinor != null) {
      lines.push({
        id: `test-partner-${cycle.id}`,
        category: "testing",
        bucket: "external",
        label: `Test cycle: ${cycle.label} (partner)`,
        expectedMinor: cycle.partnerCostMinor,
        lowMinor: null,
        highMinor: null,
        known: true,
        hours: cycle.hours,
      });
    }
    if (cycle.toolCostMinor != null) {
      lines.push({
        id: `test-tool-${cycle.id}`,
        category: "testing",
        bucket: "tooling",
        label: `Test cycle: ${cycle.label} (tooling)`,
        expectedMinor: cycle.toolCostMinor,
        lowMinor: null,
        highMinor: null,
        known: true,
      });
    }
  }
  if (inputs.testingCutover.testing.sharedPartnerCostMinor != null) {
    lines.push({
      id: "test-shared-partner",
      category: "testing",
      bucket: "external",
      label: "Testing (shared partner cost)",
      expectedMinor: inputs.testingCutover.testing.sharedPartnerCostMinor,
      lowMinor: null,
      highMinor: null,
      known: true,
      hours: inputs.testingCutover.testing.sharedHours,
    });
  }

  // Cutover
  const cut = inputs.testingCutover.cutover;
  for (const [id, label, minor] of [
    ["cutover-overtime", "Cutover overtime", cut.overtimeCostMinor],
    ["cutover-partner", "Cutover partner coverage", cut.partnerCoverageMinor],
    ["cutover-support", "Cutover additional support", cut.additionalSupportMinor],
  ] as const) {
    if (minor != null) {
      lines.push({
        id,
        category: "cutover-hypercare",
        bucket: "external",
        label,
        expectedMinor: minor,
        lowMinor: null,
        highMinor: null,
        known: true,
      });
    }
  }

  // Hypercare
  const hc = inputs.testingCutover.hypercare;
  if (hc.externalSupportCostMinor != null) {
    lines.push({
      id: "hypercare-external",
      category: "cutover-hypercare",
      bucket: "external",
      label: "Hypercare (external)",
      expectedMinor: hc.externalSupportCostMinor,
      lowMinor: null,
      highMinor: null,
      known: true,
    });
  }
  if (hc.remediationAllowanceMinor != null) {
    lines.push({
      id: "hypercare-remediation",
      category: "cutover-hypercare",
      bucket: "external",
      label: "Data remediation allowance",
      expectedMinor: hc.remediationAllowanceMinor,
      lowMinor: null,
      highMinor: null,
      known: true,
    });
  }
  if (
    hc.internalSupportHours != null &&
    hc.internalHourlyCostMinor != null
  ) {
    lines.push({
      id: "hypercare-internal",
      category: "cutover-hypercare",
      bucket: "internal",
      label: "Hypercare (internal)",
      expectedMinor: Math.round(
        hc.internalSupportHours * hc.internalHourlyCostMinor,
      ),
      lowMinor: null,
      highMinor: null,
      known: true,
      hours: hc.internalSupportHours,
    });
  } else if (hc.internalSupportHours != null) {
    lines.push({
      id: "hypercare-internal-hours",
      category: "cutover-hypercare",
      bucket: "internal",
      label: "Hypercare (internal hours — rate unknown)",
      expectedMinor: null,
      lowMinor: null,
      highMinor: null,
      known: false,
      hours: hc.internalSupportHours,
    });
  }

  // Training (migration classification only)
  const tr = inputs.testingCutover.training;
  if (tr.classification === "migration") {
    if (tr.trainingCostMinor != null) {
      lines.push({
        id: "training-external",
        category: "training",
        bucket: "external",
        label: "Training (external / vendor)",
        expectedMinor: tr.trainingCostMinor,
        lowMinor: null,
        highMinor: null,
        known: true,
      });
    }
    if (tr.environmentSetupMinor != null) {
      lines.push({
        id: "training-env",
        category: "training",
        bucket: "tooling",
        label: "Training environment setup",
        expectedMinor: tr.environmentSetupMinor,
        lowMinor: null,
        highMinor: null,
        known: true,
      });
    }
    if (tr.internalHours != null && tr.internalHourlyCostMinor != null) {
      lines.push({
        id: "training-internal",
        category: "training",
        bucket: "internal",
        label: "Training (internal)",
        expectedMinor: Math.round(tr.internalHours * tr.internalHourlyCostMinor),
        lowMinor: null,
        highMinor: null,
        known: true,
        hours: tr.internalHours,
      });
    }
  }

  // Optional downtime scenario
  const dt = inputs.testingCutover.downtime;
  if (
    dt.include &&
    dt.hours != null &&
    dt.affectedUsers != null &&
    dt.hourlyBusinessImpactMinor != null
  ) {
    lines.push({
      id: "downtime-scenario",
      category: "optional",
      bucket: "optional",
      label: "Business interruption (scenario)",
      expectedMinor: Math.round(
        dt.hours * dt.affectedUsers * dt.hourlyBusinessImpactMinor,
      ),
      lowMinor: null,
      highMinor: null,
      known: true,
      optional: true,
      notes: "Scenario only — not included in base migration total",
    });
  }

  return lines;
}

function collectUnknowns(inputs: McInputs, lines: McCostLine[]): McUnknownDriver[] {
  const unknowns: McUnknownDriver[] = [];

  const hasExternalMigration =
    inputs.approach.migrationSpecificQuoteMinor != null ||
    inputs.approach.executionExternalMinor != null ||
    inputs.approach.externalImplementationQuoteMinor != null ||
    (inputs.approach.partnerDayRateMinor != null &&
      inputs.approach.estimatedDays != null) ||
    inputs.approach.quotes.some((q) => partnerQuoteMinor(q) != null);

  if (!hasExternalMigration) {
    unknowns.push({
      id: "partner-cost",
      label: "Implementation / migration partner cost",
      material: true,
    });
  }

  const activeIntegrations = inputs.integrations.rows.filter(
    (r) =>
      r.include &&
      (r.disposition === "rebuild" ||
        r.disposition === "replace" ||
        r.existing === "yes"),
  );
  const missingIntCost = activeIntegrations.filter(
    (r) => r.externalCostMinor == null && (r.internalHours == null || r.internalHours === 0),
  );
  if (missingIntCost.length > 0) {
    unknowns.push({
      id: "integrations",
      label: `${missingIntCost.length} integration(s) without cost or hours`,
      material: true,
    });
  }

  if (
    inputs.dataScope.attachments.scope === "some" ||
    inputs.dataScope.attachments.scope === "most-all" ||
    inputs.dataScope.attachments.scope === "not-sure"
  ) {
    if (inputs.dataScope.attachments.storageMigrationCostMinor == null) {
      unknowns.push({
        id: "attachments",
        label: "Attachment migration approach / cost",
        material: inputs.dataScope.attachments.scope !== "not-sure",
      });
    }
  }

  const significantDq = inputs.dataQuality.issues.filter(
    (i) => i.severity === "significant",
  );
  const dqCovered =
    inputs.dataQuality.overallExternalQuoteMinor != null ||
    significantDq.every(
      (i) => i.externalQuoteMinor != null || i.estimatedHours != null,
    );
  if (significantDq.length > 0 && !dqCovered) {
    unknowns.push({
      id: "data-quality",
      label: "Significant data-quality remediation cost",
      material: true,
    });
  }

  const rolesWithHoursNoRate = inputs.internalEffort.roles.filter((r) => {
    if (!r.include) return false;
    const hours = r.people * r.hoursPerPerson;
    return hours > 0 && r.hourlyCostMinor == null && r.totalCostMinor == null;
  });
  if (rolesWithHoursNoRate.length > 0) {
    unknowns.push({
      id: "internal-rates",
      label: "Internal hours without loaded hourly cost",
      material: true,
    });
  }

  if (
    mappingComplexityBand(inputs) === "high" ||
    mappingComplexityBand(inputs) === "very-high"
  ) {
    if (inputs.fieldMapping.externalQuoteMinor == null) {
      unknowns.push({
        id: "mapping-cost",
        label: "High mapping complexity without external quote",
        material: false,
      });
    }
  }

  // Lines that have hours but no money
  for (const line of lines) {
    if (!line.known && (line.hours ?? 0) > 0) {
      unknowns.push({
        id: `line-${line.id}`,
        label: `${line.label} (hours known, rate unknown)`,
        material: false,
      });
    }
  }

  // Dedupe by id
  const seen = new Set<string>();
  return unknowns.filter((u) => {
    if (seen.has(u.id)) return false;
    seen.add(u.id);
    return true;
  });
}

function confidenceFrom(
  coveragePercent: number | null,
  materialUnknowns: number,
  linesKnown: number,
): McConfidence {
  if (linesKnown === 0) return "low";
  if (materialUnknowns === 0 && (coveragePercent ?? 0) >= 85) return "high";
  if (materialUnknowns <= 2 && (coveragePercent ?? 0) >= 50) return "medium";
  return "low";
}

function computeTimelineWeeks(inputs: McInputs): {
  weeks: number | null;
  approximate: boolean;
} {
  const stages = inputs.scenarios.timelineStages.filter(
    (s) => s.durationWeeks != null && s.durationWeeks > 0,
  );
  if (stages.length === 0) return { weeks: null, approximate: false };

  // Critical-path style: earliest finish with dependencies
  const byId = new Map(stages.map((s) => [s.id, s]));
  const finish = new Map<string, number>();

  function finishOf(id: string, stack: Set<string>): number {
    if (finish.has(id)) return finish.get(id)!;
    if (stack.has(id)) return 0;
    const stage = byId.get(id);
    if (!stage || stage.durationWeeks == null) return 0;
    stack.add(id);
    const depEnd = Math.max(
      0,
      ...stage.dependsOnIds.map((d) => finishOf(d, stack)),
    );
    stack.delete(id);
    const end = depEnd + stage.durationWeeks;
    finish.set(id, end);
    return end;
  }

  let total = 0;
  for (const s of stages) {
    total = Math.max(total, finishOf(s.id, new Set()));
  }
  return { weeks: total > 0 ? total : null, approximate: true };
}

function readinessWarnings(inputs: McInputs): string[] {
  const w: string[] = [];
  if (!inputs.currentSystem.projectOwner) {
    w.push("Migration project owner not assigned");
  }
  const migrating = inputs.dataScope.objects.filter((o) => o.migrate);
  if (migrating.length === 0) {
    w.push("Migration scope (objects) not finalized");
  }
  if (
    (inputs.fieldMapping.sourceFieldsApprox ?? 0) === 0 &&
    !inputs.fieldMapping.importedFromFieldMapping
  ) {
    w.push("Target field model / mapping incomplete");
  }
  const unassessedInt = inputs.integrations.rows.filter(
    (r) =>
      r.existing === "yes" &&
      (r.disposition === "unknown" || r.complexity === "unknown"),
  );
  if (unassessedInt.length >= 3) {
    w.push(`${unassessedInt.length} critical integrations not fully assessed`);
  }
  const h = inputs.dataScope.historicalActivity;
  const anyHistory =
    h.emails || h.calls || h.meetings || h.tasks || h.notes || h.stageHistory || h.ownerHistory;
  const objectsWantHistory = migrating.some(
    (o) => o.historyDepth !== "current-only" && o.historyDepth !== "unknown",
  );
  if (objectsWantHistory && !anyHistory) {
    w.push("Historical activity requirements unclear");
  }
  return w;
}

function workSplit(inputs: McInputs, lines: McCostLine[]): McWorkSplit {
  const internalLabels: string[] = [];
  const externalLabels: string[] = [];

  for (const issue of inputs.dataQuality.issues) {
    if (issue.severity === "low") continue;
    if (issue.owner === "internal") internalLabels.push(`Data cleanup: ${issue.id}`);
    if (issue.owner === "external") externalLabels.push(`Data cleanup: ${issue.id}`);
  }
  if (inputs.testingCutover.testing.businessUat) {
    internalLabels.push("UAT");
  }
  if (inputs.testingCutover.training.approach === "internal") {
    internalLabels.push("Training");
  }
  for (const row of inputs.integrations.rows) {
    if (!row.include) continue;
    if (row.disposition === "rebuild" || row.disposition === "replace") {
      if (row.who === "internal") internalLabels.push(row.label);
      else if (row.who !== "unknown") externalLabels.push(row.label);
    }
  }
  if (
    inputs.fieldMapping.transformationRules &&
    inputs.fieldMapping.transformationRules > 0
  ) {
    externalLabels.push("Transformation scripts");
  }
  if (
    inputs.approach.performer === "data-specialist" ||
    inputs.approach.performer === "implementation-partner"
  ) {
    externalLabels.push("Migration execution");
  } else if (inputs.approach.performer === "internal") {
    internalLabels.push("Migration execution");
  }

  const internalMinor = sumKnown(
    lines.filter((l) => l.bucket === "internal").map((l) => l.expectedMinor),
  );
  const externalMinor = sumKnown(
    lines.filter((l) => l.bucket === "external").map((l) => l.expectedMinor),
  );

  return {
    internalLabels: [...new Set(internalLabels)].slice(0, 8),
    externalLabels: [...new Set(externalLabels)].slice(0, 8),
    internalMinor,
    externalMinor,
  };
}

export function computeMigrationCost(inputs: McInputs): McComputeResult {
  const currency = inputs.currency;
  const complexity = computeComplexityProfile(inputs);
  const mappingComplexity = mappingComplexityBand(inputs);
  const allLines = collectLines(inputs);

  const baseLines = allLines.filter((l) => !l.optional);
  const optionalLines = allLines.filter((l) => l.optional);

  const externalMinor = sumKnown(
    baseLines.filter((l) => l.bucket === "external").map((l) => l.expectedMinor),
  );
  const internalLabourMinor = sumKnown(
    baseLines.filter((l) => l.bucket === "internal").map((l) => l.expectedMinor),
  );
  const toolingMinor = sumKnown(
    baseLines.filter((l) => l.bucket === "tooling").map((l) => l.expectedMinor),
  );
  const optionalMinor = sumKnown(
    optionalLines.map((l) => l.expectedMinor),
  );

  // Contingency
  const cont = inputs.testingCutover.contingency;
  const percent =
    cont.customPercent != null && cont.customPercent > 0
      ? cont.customPercent
      : cont.percent;

  let contingencyBase = 0;
  let contingencyHasBase = false;
  if (percent > 0) {
    if (cont.applyToExternal && externalMinor != null) {
      contingencyBase += externalMinor;
      contingencyHasBase = true;
    }
    if (cont.applyToInternal && internalLabourMinor != null) {
      contingencyBase += internalLabourMinor;
      contingencyHasBase = true;
    }
    if (cont.applyToTooling && toolingMinor != null) {
      if (cont.excludeFixedLicenses) {
        // Include only non-license tooling rows (rows with id starting tool-),
        // exclude tooling-license lump if user asked to exclude fixed licenses.
        const flexibleTooling = sumKnown(
          baseLines
            .filter((l) => l.bucket === "tooling" && l.id !== "tooling-license")
            .map((l) => l.expectedMinor),
        );
        if (flexibleTooling != null) {
          contingencyBase += flexibleTooling;
          contingencyHasBase = true;
        }
      } else {
        contingencyBase += toolingMinor;
        contingencyHasBase = true;
      }
    }
  }

  const contingencyMinor =
    percent > 0 && contingencyHasBase
      ? Math.round(contingencyBase * (percent / 100))
      : percent > 0
        ? null
        : 0;

  const lines: McCostLine[] = [...allLines];
  if (contingencyMinor != null && contingencyMinor > 0) {
    lines.push({
      id: "contingency",
      category: "contingency",
      bucket: "contingency",
      label: `Contingency (${percent}%)`,
      expectedMinor: contingencyMinor,
      lowMinor: null,
      highMinor: null,
      known: true,
    });
  }

  const knownMinor = lines
    .filter((l) => !l.optional && l.known && l.expectedMinor != null)
    .reduce((s, l) => s + (l.expectedMinor ?? 0), 0);

  const expectedTotalMinor = sumKnown(
    lines.filter((l) => !l.optional).map((l) => l.expectedMinor),
  );

  // User-defined range aggregation
  const rangeLines = lines.filter(
    (l) => !l.optional && (l.lowMinor != null || l.highMinor != null),
  );
  const hasUserRange = rangeLines.length > 0;
  let lowTotalMinor: number | null = null;
  let highTotalMinor: number | null = null;
  if (hasUserRange) {
    lowTotalMinor = 0;
    highTotalMinor = 0;
    for (const l of lines.filter((x) => !x.optional)) {
      if (l.expectedMinor == null && l.lowMinor == null && l.highMinor == null) {
        continue;
      }
      lowTotalMinor += l.lowMinor ?? l.expectedMinor ?? 0;
      highTotalMinor += l.highMinor ?? l.expectedMinor ?? 0;
    }
  }

  // Categories
  const categoryIds = Object.keys(CATEGORY_LABELS) as McCostCategoryId[];
  const categories: McCategoryTotal[] = categoryIds
    .map((id) => {
      const catLines = lines.filter((l) => l.category === id && !l.optional);
      const expected = sumKnown(catLines.map((l) => l.expectedMinor));
      const low = sumKnown(catLines.map((l) => l.lowMinor ?? l.expectedMinor));
      const high = sumKnown(catLines.map((l) => l.highMinor ?? l.expectedMinor));
      return {
        id,
        label: CATEGORY_LABELS[id],
        expectedMinor: expected,
        lowMinor: hasUserRange ? low : null,
        highMinor: hasUserRange ? high : null,
        known: expected != null,
      };
    })
    .filter((c) => c.expectedMinor != null || c.id === "contingency");

  // Drivers — top known category shares
  const driverCats = categories
    .filter(
      (c) =>
        c.expectedMinor != null &&
        c.expectedMinor > 0 &&
        c.id !== "contingency",
    )
    .sort((a, b) => (b.expectedMinor ?? 0) - (a.expectedMinor ?? 0));
  const driverBase = driverCats.reduce((s, c) => s + (c.expectedMinor ?? 0), 0);
  const drivers: McCostDriver[] = driverCats.slice(0, 5).map((c) => ({
    id: c.id,
    label: c.label,
    expectedMinor: c.expectedMinor!,
    sharePercent:
      driverBase > 0
        ? Math.round(((c.expectedMinor ?? 0) / driverBase) * 100)
        : 0,
  }));

  const unknowns = collectUnknowns(inputs, lines);
  const materialUnknownCount = unknowns.filter((u) => u.material).length;

  // Coverage: known vs known+material-unknown heuristic
  // We treat coverage as share of cost categories that have at least one known line
  // among categories the user has started (or that complexity suggests matter).
  const relevantCategoryIds = new Set(
    categories.filter((c) => c.expectedMinor != null).map((c) => c.id),
  );
  // Add likely-needed categories from complexity as "should have cost"
  if (
    complexity.dimensions.find((d) => d.id === "integrations")?.band ===
      "high" ||
    complexity.dimensions.find((d) => d.id === "integrations")?.band ===
      "very-high"
  ) {
    relevantCategoryIds.add("integrations");
  }
  if (
    complexity.dimensions.find((d) => d.id === "data-quality")?.band ===
      "high" ||
    complexity.dimensions.find((d) => d.id === "data-quality")?.band ===
      "very-high"
  ) {
    relevantCategoryIds.add("data-preparation");
  }
  relevantCategoryIds.add("migration-execution");

  const covered = [...relevantCategoryIds].filter((id) =>
    lines.some((l) => l.category === id && l.known && l.expectedMinor != null),
  ).length;
  const coveragePercent =
    relevantCategoryIds.size > 0
      ? Math.round((covered / relevantCategoryIds.size) * 100)
      : knownMinor > 0
        ? 100
        : null;

  const confidence = confidenceFrom(
    coveragePercent,
    materialUnknownCount,
    lines.filter((l) => l.known).length,
  );

  let status: McComputeResult["status"] = "complete";
  let statusReason: string | null = null;
  if (knownMinor === 0) {
    status = "incomplete";
    statusReason =
      "No cost inputs yet — enter quotes, rates, or hours × loaded cost to model migration cost.";
  } else if (materialUnknownCount > 0 || (coveragePercent ?? 100) < 80) {
    status = "provisional";
    statusReason = `${materialUnknownCount} material cost driver${materialUnknownCount === 1 ? "" : "s"} remain unknown.`;
  }

  const { weeks: timelineWeeks, approximate: timelineApproximate } =
    computeTimelineWeeks(inputs);

  const internalHoursTotal = (() => {
    let h = 0;
    let any = false;
    for (const role of inputs.internalEffort.roles) {
      if (!role.include) continue;
      const hours = role.people * role.hoursPerPerson;
      if (hours > 0) {
        h += hours;
        any = true;
      }
    }
    for (const line of lines) {
      if (line.bucket === "internal" && line.hours && !line.id.startsWith("role-")) {
        h += line.hours;
        any = true;
      }
    }
    return any ? h : null;
  })();

  const phaseTotals = inputs.scenarios.phases.map((p) => ({
    id: p.id,
    label: p.label,
    expectedMinor: p.allocatedCostMinor ?? null,
  }));

  const scopeReductions = inputs.scenarios.scopeToggles.map((t) => ({
    id: t.id,
    label: t.label,
    enabled: t.enabled,
    reductionMinor: t.enabled ? (t.reductionMinor ?? null) : null,
  }));

  const partnerQuoteComparison = inputs.approach.quotes.map((q) => ({
    id: q.id,
    provider: q.provider || "Unnamed provider",
    modeledMinor: partnerQuoteMinor(q),
    selected: q.selected,
    includedScope: q.includedScope,
    excludedScope: q.excludedScope,
  }));

  return {
    currency,
    status,
    statusReason,
    expectedTotalMinor,
    lowTotalMinor,
    highTotalMinor,
    hasUserRange,
    externalMinor,
    internalLabourMinor,
    toolingMinor,
    contingencyMinor: contingencyMinor === 0 ? 0 : contingencyMinor,
    optionalMinor,
    knownMinor,
    coveragePercent,
    materialUnknownCount,
    lines,
    categories,
    drivers,
    unknowns,
    complexity,
    mappingComplexity,
    confidence,
    timelineWeeks,
    timelineApproximate,
    workSplit: workSplit(inputs, lines),
    readinessWarnings: readinessWarnings(inputs),
    phaseTotals,
    scopeReductions,
    internalHoursTotal,
    partnerQuoteComparison,
  };
}

/** Apply enabled scope-reduction toggles to a display total (user-supplied reductions only). */
export function applyScopeReductions(
  expectedTotalMinor: number | null,
  scopeReductions: McComputeResult["scopeReductions"],
): number | null {
  if (expectedTotalMinor == null) return null;
  let total = expectedTotalMinor;
  for (const r of scopeReductions) {
    if (r.enabled && r.reductionMinor != null) {
      total = Math.max(0, total - r.reductionMinor);
    }
  }
  return total;
}

export { addNullable, CATEGORY_LABELS };
