/**
 * Deterministic CRM migration complexity model.
 * Complexity guides risk, effort prompts and explanations — never fake euro pricing.
 */

import type {
  McComplexityBand,
  McInputs,
} from "@/domain";

export type McComplexityDimension =
  | "data-volume"
  | "data-quality"
  | "mapping"
  | "integrations"
  | "customization"
  | "testing"
  | "history"
  | "attachments"
  | "sources";

export type McComplexityProfile = {
  overall: McComplexityBand;
  dimensions: Array<{
    id: McComplexityDimension;
    label: string;
    band: McComplexityBand;
    reasons: string[];
  }>;
  score: number;
  maxScore: number;
};

function bandFromScore(score: number, max: number): McComplexityBand {
  if (max <= 0) return "unknown";
  const ratio = score / max;
  if (ratio < 0.2) return "low";
  if (ratio < 0.45) return "moderate";
  if (ratio < 0.7) return "high";
  return "very-high";
}

function volumeScore(inputs: McInputs): { score: number; max: number; reasons: string[] } {
  const reasons: string[] = [];
  let score = 0;
  const max = 8;
  const migrating = inputs.dataScope.objects.filter((o) => o.migrate);
  if (migrating.length === 0) {
    return { score: 0, max, reasons: ["No objects selected to migrate yet"] };
  }
  score += Math.min(4, Math.floor(migrating.length / 3));
  if (migrating.length >= 8) reasons.push(`${migrating.length} objects in scope`);

  const bands = migrating.map((o) => o.recordVolumeBand);
  if (bands.some((b) => b === "1m-plus")) {
    score += 4;
    reasons.push("1m+ record volume on at least one object");
  } else if (bands.some((b) => b === "250k-1m")) {
    score += 3;
    reasons.push("250k–1m records on at least one object");
  } else if (bands.some((b) => b === "50k-250k")) {
    score += 2;
    reasons.push("50k–250k records on at least one object");
  } else if (bands.some((b) => b === "10k-50k")) {
    score += 1;
  }

  const exact = migrating
    .map((o) => o.recordCountExact)
    .filter((n): n is number => n != null);
  if (exact.some((n) => n >= 1_000_000)) {
    score = Math.max(score, 7);
    reasons.push("Exact counts include 1m+ records");
  }

  return { score: Math.min(score, max), max, reasons };
}

function qualityScore(inputs: McInputs): { score: number; max: number; reasons: string[] } {
  const reasons: string[] = [];
  let score = 0;
  const max = 10;
  const issues = inputs.dataQuality.issues;
  if (issues.length === 0) {
    return { score: 0, max, reasons: ["Data quality not assessed yet"] };
  }
  for (const issue of issues) {
    if (issue.severity === "significant") {
      score += 1.5;
      reasons.push(`Significant: ${issue.id}`);
    } else if (issue.severity === "some") {
      score += 0.75;
    } else if (issue.severity === "unknown") {
      score += 0.4;
    }
  }
  const significant = issues.filter((i) => i.severity === "significant").length;
  if (significant >= 3) {
    reasons.push(`${significant} significant data-quality issues`);
  }
  return { score: Math.min(score, max), max, reasons: reasons.slice(0, 4) };
}

function mappingScore(inputs: McInputs): { score: number; max: number; reasons: string[] } {
  const reasons: string[] = [];
  let score = 0;
  const max = 12;
  const m = inputs.fieldMapping;
  const transforms = m.transformationRules ?? 0;
  const values = m.valueMappings ?? 0;
  const lookups = m.lookupMappings ?? 0;
  const customs = m.customObjects ?? 0;
  const unmapped = m.unmappedRequired ?? 0;
  const review = m.fieldsNeedingReview ?? 0;

  if (transforms + values + lookups === 0 && (m.sourceFieldsApprox ?? 0) === 0) {
    return { score: 0, max, reasons: ["Field mapping not defined yet"] };
  }

  score += Math.min(3, transforms / 20);
  score += Math.min(2, values / 30);
  score += Math.min(3, lookups / 10);
  score += Math.min(2, customs);
  score += Math.min(2, unmapped / 5);
  score += Math.min(1, review / 20);

  if (transforms >= 50) reasons.push("Extensive transformation rules");
  if (lookups >= 10) reasons.push("Many lookup / reference mappings");
  if (customs >= 2) reasons.push("Multiple custom objects in mapping");
  if (unmapped >= 5) reasons.push("Unresolved required target fields");
  if (m.openIssues && m.openIssues > 0) {
    score += Math.min(1, m.openIssues / 5);
    reasons.push(`${m.openIssues} open mapping issues`);
  }

  return { score: Math.min(score, max), max, reasons: reasons.slice(0, 4) };
}

function integrationScore(inputs: McInputs): {
  score: number;
  max: number;
  reasons: string[];
} {
  const reasons: string[] = [];
  let score = 0;
  const max = 12;
  const active = inputs.integrations.rows.filter(
    (r) =>
      r.include &&
      (r.disposition === "rebuild" ||
        r.disposition === "replace" ||
        r.disposition === "validate" ||
        r.existing === "yes"),
  );
  if (active.length === 0) {
    const anyTouched = inputs.integrations.rows.some(
      (r) => r.existing !== "unknown" || r.disposition !== "unknown",
    );
    if (!anyTouched) {
      return { score: 0, max, reasons: ["Integrations not assessed yet"] };
    }
  }
  score += Math.min(4, active.length);
  for (const row of active) {
    if (row.complexity === "complex") score += 1.5;
    else if (row.complexity === "moderate") score += 0.75;
    if (row.integrationType === "custom-api") score += 1;
    if (row.id === "erp" || row.label.toLowerCase().includes("erp")) {
      score += 1;
      reasons.push("ERP integration in scope");
    }
  }
  if (active.length >= 4) reasons.push(`${active.length} integrations to rebuild/validate`);
  return { score: Math.min(score, max), max, reasons: reasons.slice(0, 4) };
}

function customizationScore(inputs: McInputs): {
  score: number;
  max: number;
  reasons: string[];
} {
  const reasons: string[] = [];
  let score = 0;
  const max = 8;
  const required = inputs.integrations.customizations.filter(
    (c) => c.required === "yes",
  );
  if (
    required.length === 0 &&
    !inputs.integrations.customizations.some((c) => c.required !== "unknown")
  ) {
    return { score: 0, max, reasons: ["Customization needs not assessed yet"] };
  }
  score += Math.min(6, required.length);
  if (required.some((c) => c.id === "custom-code" || c.id === "api-work")) {
    score += 1;
    reasons.push("Custom code / API work required");
  }
  if (required.length >= 3) {
    reasons.push(`${required.length} customization areas required`);
  }
  return { score: Math.min(score, max), max, reasons: reasons.slice(0, 4) };
}

function testingScore(inputs: McInputs): { score: number; max: number; reasons: string[] } {
  const reasons: string[] = [];
  let score = 0;
  const max = 6;
  const t = inputs.testingCutover.testing;
  const countMap = { "0": 0, "1": 1, "2": 2, "3-plus": 3 } as const;
  score += countMap[t.testMigrationCount] ?? 0;
  if (t.fullReconciliation) {
    score += 1.5;
    reasons.push("Full data reconciliation required");
  }
  if (t.securityValidation) score += 0.5;
  if (t.integrationRegression) score += 0.5;
  if (t.testMigrationCount === "3-plus") {
    reasons.push("3+ test migration cycles planned");
  }
  return { score: Math.min(score, max), max, reasons };
}

function historyScore(inputs: McInputs): { score: number; max: number; reasons: string[] } {
  const reasons: string[] = [];
  let score = 0;
  const max = 8;
  const h = inputs.dataScope.historicalActivity;
  const flags = [
    h.emails,
    h.calls,
    h.meetings,
    h.tasks,
    h.notes,
    h.stageHistory,
    h.ownerHistory,
  ];
  const count = flags.filter(Boolean).length;
  score += Math.min(5, count);
  if (h.emails) {
    score += 1;
    reasons.push("Historical emails in scope");
  }
  if (h.stageHistory || h.ownerHistory) {
    score += 1;
    reasons.push("Stage / owner history in scope");
  }
  const deepHistory = inputs.dataScope.objects.filter(
    (o) =>
      o.migrate &&
      (o.historyDepth === "5-plus-years" || o.historyDepth === "all-history"),
  );
  if (deepHistory.length > 0) {
    score += 1;
    reasons.push("Deep historical depth on one or more objects");
  }
  if (count === 0 && deepHistory.length === 0) {
    return { score: 0, max, reasons: ["Limited or no historical activity selected"] };
  }
  return { score: Math.min(score, max), max, reasons: reasons.slice(0, 4) };
}

function attachmentScore(inputs: McInputs): {
  score: number;
  max: number;
  reasons: string[];
} {
  const reasons: string[] = [];
  let score = 0;
  const max = 6;
  const a = inputs.dataScope.attachments;
  if (a.scope === "most-all") {
    score += 3;
    reasons.push("Most/all attachments to migrate");
  } else if (a.scope === "some") {
    score += 1.5;
    reasons.push("Some attachments to migrate");
  } else if (a.scope === "not-sure") {
    score += 1;
  }
  if (a.storageBand === "100gb-plus") {
    score += 2;
    reasons.push("100GB+ attachment storage");
  } else if (a.storageBand === "25-100gb") {
    score += 1;
  }
  if (a.externalFileLinks === "yes") score += 0.5;
  return { score: Math.min(score, max), max, reasons };
}

function sourceScore(inputs: McInputs): { score: number; max: number; reasons: string[] } {
  const reasons: string[] = [];
  let score = 0;
  const max = 6;
  const s = inputs.currentSystem.sourceType;
  if (s === "multiple-systems" || s === "combination") {
    score += 4;
    reasons.push("Multiple source systems");
  } else if (s === "legacy-database") {
    score += 3;
    reasons.push("Legacy database source");
  } else if (s === "existing-crm") {
    score += 1;
  } else if (s === "spreadsheets") {
    score += 1;
  }
  if (inputs.currentSystem.migrationType === "complex") {
    score += 2;
    reasons.push("User classified migration as complex");
  } else if (inputs.currentSystem.migrationType === "moderate") {
    score += 1;
  }
  return { score: Math.min(score, max), max, reasons };
}

/**
 * Historical activity impact band for UI (Low / Moderate / High).
 */
export function historicalActivityImpact(
  inputs: McInputs,
): "low" | "moderate" | "high" {
  const { score, max } = historyScore(inputs);
  const ratio = max > 0 ? score / max : 0;
  if (ratio < 0.25) return "low";
  if (ratio < 0.55) return "moderate";
  return "high";
}

/**
 * Field-mapping complexity band from deterministic rules.
 */
export function mappingComplexityBand(inputs: McInputs): McComplexityBand {
  const { score, max } = mappingScore(inputs);
  if (
    (inputs.fieldMapping.sourceFieldsApprox ?? 0) === 0 &&
    (inputs.fieldMapping.transformationRules ?? 0) === 0 &&
    !inputs.fieldMapping.importedFromFieldMapping
  ) {
    return "unknown";
  }
  return bandFromScore(score, max);
}

export function computeComplexityProfile(inputs: McInputs): McComplexityProfile {
  function dim(
    id: McComplexityDimension,
    label: string,
    scorer: (inputs: McInputs) => { score: number; max: number; reasons: string[] },
    forceUnknown?: boolean,
  ): McComplexityProfile["dimensions"][number] {
    const r = scorer(inputs);
    return {
      id,
      label,
      band: forceUnknown ? "unknown" : bandFromScore(r.score, r.max),
      reasons: r.reasons,
    };
  }

  const mappingUntouched =
    (inputs.fieldMapping.sourceFieldsApprox ?? 0) === 0 &&
    (inputs.fieldMapping.transformationRules ?? 0) === 0 &&
    !inputs.fieldMapping.importedFromFieldMapping;

  const dimensions: McComplexityProfile["dimensions"] = [
    dim("sources", "Source systems", sourceScore),
    dim("data-volume", "Data volume", volumeScore),
    dim("data-quality", "Data quality", qualityScore),
    dim("history", "Historical activity", historyScore),
    dim("attachments", "Attachments", attachmentScore),
    dim("mapping", "Mapping", mappingScore, mappingUntouched),
    dim("integrations", "Integrations", integrationScore),
    dim("customization", "Customization", customizationScore),
    dim("testing", "Testing", testingScore),
  ];

  const scores = [
    sourceScore(inputs),
    volumeScore(inputs),
    qualityScore(inputs),
    historyScore(inputs),
    attachmentScore(inputs),
    mappingScore(inputs),
    integrationScore(inputs),
    customizationScore(inputs),
    testingScore(inputs),
  ];
  const score = scores.reduce((s, r) => s + r.score, 0);
  const maxScore = scores.reduce((s, r) => s + r.max, 0);

  let adjusted = score;
  if (inputs.currentSystem.migrationType === "complex") adjusted += 4;
  else if (inputs.currentSystem.migrationType === "moderate") adjusted += 2;
  else if (inputs.currentSystem.migrationType === "simple")
    adjusted = Math.max(0, adjusted - 2);

  const overall = bandFromScore(adjusted, maxScore + 4);

  return {
    overall,
    dimensions,
    score: Math.round(adjusted * 10) / 10,
    maxScore: maxScore + 4,
  };
}
