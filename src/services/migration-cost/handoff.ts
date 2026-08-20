/**
 * Field-mapping / readiness soft-import helpers (confirm before overwrite).
 */

import type { McFieldMapping, McInputs } from "@/domain";

export type FieldMappingImportPreview = {
  available: boolean;
  sourceFieldsApprox?: number;
  targetFieldsApprox?: number;
  directMappings?: number;
  transformationRules?: number;
  valueMappings?: number;
  unmappedRequired?: number;
  customObjects?: number;
  openIssues?: number;
  message: string;
};

/**
 * Soft-read Migration Planner field-mapping summary from localStorage.
 * Never mutates session without caller confirmation.
 */
export function previewFieldMappingImport(): FieldMappingImportPreview {
  if (typeof window === "undefined") {
    return { available: false, message: "Not available" };
  }
  try {
    const raw = localStorage.getItem("sg-crm-migration-plan-v1");
    if (!raw) {
      return {
        available: false,
        message: "No CRM Migration Planner project found on this device.",
      };
    }
    const plan = JSON.parse(raw) as {
      objects?: Array<{
        include?: boolean;
        custom?: boolean;
        fieldMappings?: Array<{
          status?: string;
          transformType?: string;
        }>;
      }>;
      fieldMappings?: Array<{
        status?: string;
        transformType?: string;
      }>;
    };

    const mappings =
      plan.fieldMappings ??
      plan.objects?.flatMap((o) => o.fieldMappings ?? []) ??
      [];

    if (mappings.length === 0 && !plan.objects?.length) {
      return {
        available: false,
        message: "Migration Planner found, but no field mappings to import.",
      };
    }

    const direct = mappings.filter(
      (m) =>
        m.status === "mapped" ||
        m.transformType === "direct" ||
        m.transformType === "rename",
    ).length;
    const transforms = mappings.filter(
      (m) =>
        m.transformType === "transform" ||
        m.transformType === "calculated" ||
        m.transformType === "lookup",
    ).length;
    const values = mappings.filter(
      (m) => m.transformType === "value-map" || m.transformType === "picklist",
    ).length;
    const unmapped = mappings.filter(
      (m) => m.status === "unmapped" || m.status === "blocked",
    ).length;
    const customObjects =
      plan.objects?.filter((o) => o.custom && o.include !== false).length ?? 0;

    return {
      available: true,
      sourceFieldsApprox: mappings.length || undefined,
      targetFieldsApprox: mappings.length || undefined,
      directMappings: direct || undefined,
      transformationRules: transforms || undefined,
      valueMappings: values || undefined,
      unmappedRequired: unmapped || undefined,
      customObjects: customObjects || undefined,
      openIssues: unmapped || undefined,
      message:
        "Import mapping counts from your CRM Migration Planner? Existing mapping numbers in this calculator will be replaced after you confirm.",
    };
  } catch {
    return {
      available: false,
      message: "Could not read Migration Planner data.",
    };
  }
}

export function applyFieldMappingImport(
  inputs: McInputs,
  preview: FieldMappingImportPreview,
): McInputs {
  if (!preview.available) return inputs;
  const fieldMapping: McFieldMapping = {
    ...inputs.fieldMapping,
    importedFromFieldMapping: true,
    importedAt: new Date().toISOString(),
    sourceFieldsApprox: preview.sourceFieldsApprox,
    targetFieldsApprox: preview.targetFieldsApprox,
    directMappings: preview.directMappings,
    transformationRules: preview.transformationRules,
    valueMappings: preview.valueMappings,
    unmappedRequired: preview.unmappedRequired,
    customObjects: preview.customObjects,
    openIssues: preview.openIssues,
  };
  return { ...inputs, fieldMapping };
}

export type ReadinessImportPreview = {
  available: boolean;
  warnings: string[];
  message: string;
};

export function previewReadinessWarnings(): ReadinessImportPreview {
  if (typeof window === "undefined") {
    return { available: false, warnings: [], message: "Not available" };
  }
  try {
    const raw = localStorage.getItem("sg-crm-readiness-assessment-v1");
    if (!raw) {
      return {
        available: false,
        warnings: [],
        message: "No CRM Readiness Assessment found on this device.",
      };
    }
    const session = JSON.parse(raw) as {
      result?: {
        criticalBlockers?: Array<{ title?: string; label?: string }>;
        risks?: Array<{ title?: string; label?: string }>;
      };
      answers?: Record<string, unknown>;
    };
    const warnings: string[] = [];
    for (const b of session.result?.criticalBlockers ?? []) {
      const t = b.title ?? b.label;
      if (t) warnings.push(t);
    }
    for (const r of session.result?.risks ?? []) {
      const t = r.title ?? r.label;
      if (t && warnings.length < 6) warnings.push(t);
    }
    if (warnings.length === 0) {
      return {
        available: true,
        warnings: [],
        message: "Readiness assessment found — no critical blockers listed.",
      };
    }
    return {
      available: true,
      warnings: warnings.slice(0, 6),
      message: "Warnings from your CRM Readiness Assessment.",
    };
  } catch {
    return {
      available: false,
      warnings: [],
      message: "Could not read readiness assessment.",
    };
  }
}
