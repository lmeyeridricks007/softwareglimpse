/**
 * Client-side PDF + Excel exports for CRM Migration Cost Calculator.
 * Libraries are dynamically imported so they stay out of the initial tool bundle.
 */

import { formatMoney, type CurrencyCode, type McInputs } from "@/domain";
import type { McComputeResult } from "./compute";
import { CATEGORY_LABELS } from "./compute";

type RGB = [number, number, number];

const NAVY: RGB = [15, 23, 42];
const PRIMARY: RGB = [37, 99, 235];
const MUTED: RGB = [100, 116, 139];
const BORDER: RGB = [226, 232, 240];
const SURFACE: RGB = [248, 250, 252];
const WHITE: RGB = [255, 255, 255];

function money(
  minor: number | null | undefined,
  currency: CurrencyCode,
): string {
  if (minor == null) return "—";
  return formatMoney(
    { amountMinor: minor, currency },
    { maximumFractionDigits: 0 },
  );
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function generatedLabel(): string {
  return new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function complexityLabel(band: string): string {
  if (band === "very-high") return "Very high";
  return band.charAt(0).toUpperCase() + band.slice(1);
}

export async function downloadMigrationCostPdf(
  inputs: McInputs,
  result: McComputeResult,
): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 40;
  const contentW = pageW - margin * 2;
  let y = margin;
  const currency = inputs.currency as CurrencyCode;
  const generated = generatedLabel();

  const ensure = (need: number) => {
    if (y + need > pageH - 44) {
      doc.addPage();
      y = margin;
      drawChrome();
    }
  };

  const drawChrome = () => {
    doc.setFillColor(...PRIMARY);
    doc.rect(0, 0, pageW, 4, "F");
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text("SoftwareGlimpse · CRM Migration Cost Estimate", margin, pageH - 20);
    doc.text(generated, pageW - margin, pageH - 20, { align: "right" });
  };

  const heading = (text: string) => {
    ensure(28);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(...NAVY);
    doc.text(text, margin, y);
    y += 18;
  };

  const body = (text: string) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...MUTED);
    const lines = doc.splitTextToSize(text, contentW);
    ensure(lines.length * 13 + 4);
    doc.text(lines, margin, y);
    y += lines.length * 13 + 6;
  };

  drawChrome();

  // PAGE 1 — Executive summary
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(...NAVY);
  doc.text("CRM Migration Cost Estimate", margin, y + 12);
  y += 36;

  body(
    `${inputs.currentSystem.projectName} · ${inputs.currentSystem.sourceType ?? "Source TBD"} → ${inputs.currentSystem.targetCrm ?? "Target TBD"}`,
  );

  doc.setFillColor(...SURFACE);
  doc.roundedRect(margin, y, contentW, 72, 6, 6, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...MUTED);
  doc.text("EXPECTED MODELLED COST", margin + 16, y + 22);
  doc.setFontSize(24);
  doc.setTextColor(...NAVY);
  doc.text(money(result.expectedTotalMinor, currency), margin + 16, y + 50);
  doc.setFontSize(10);
  doc.setTextColor(...MUTED);
  doc.text(
    `Confidence: ${result.confidence.toUpperCase()} · Complexity: ${complexityLabel(result.complexity.overall)} · Coverage: ${result.coveragePercent ?? "—"}%`,
    margin + 200,
    y + 50,
  );
  y += 90;

  const cards: Array<[string, number | null]> = [
    ["External services", result.externalMinor],
    ["Internal labour", result.internalLabourMinor],
    ["Tooling", result.toolingMinor],
    ["Contingency", result.contingencyMinor],
  ];
  const cardW = (contentW - 18) / 4;
  cards.forEach(([label, val], i) => {
    const x = margin + i * (cardW + 6);
    doc.setFillColor(...WHITE);
    doc.setDrawColor(...BORDER);
    doc.roundedRect(x, y, cardW, 48, 4, 4, "FD");
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text(label, x + 8, y + 16);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...NAVY);
    doc.text(money(val, currency), x + 8, y + 36);
  });
  y += 68;

  if (result.hasUserRange) {
    heading("Expected range");
    body(
      `Low ${money(result.lowTotalMinor, currency)} · Expected ${money(result.expectedTotalMinor, currency)} · High ${money(result.highTotalMinor, currency)}`,
    );
  }

  if (result.statusReason) {
    heading("Estimate status");
    body(`${result.status.toUpperCase()} — ${result.statusReason}`);
  }

  // PAGE 2 — Scope
  doc.addPage();
  y = margin;
  drawChrome();
  heading("Migration scope");
  const migrating = inputs.dataScope.objects.filter((o) => o.migrate);
  if (migrating.length === 0) {
    body("No objects marked for migration yet.");
  } else {
    for (const o of migrating) {
      ensure(16);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(...NAVY);
      doc.text(
        `${o.label} · ${o.recordCountExact != null ? `${o.recordCountExact.toLocaleString()} records` : o.recordVolumeBand} · history: ${o.historyDepth}`,
        margin,
        y,
      );
      y += 14;
    }
  }
  y += 8;
  heading("Attachments");
  body(
    `Scope: ${inputs.dataScope.attachments.scope} · Storage: ${inputs.dataScope.attachments.storageBand}`,
  );

  // PAGE 3 — Cost breakdown
  doc.addPage();
  y = margin;
  drawChrome();
  heading("Cost breakdown");
  for (const cat of result.categories) {
    if (cat.expectedMinor == null) continue;
    ensure(16);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...NAVY);
    doc.text(cat.label, margin, y);
    doc.text(money(cat.expectedMinor, currency), margin + contentW, y, {
      align: "right",
    });
    y += 14;
  }
  y += 8;
  doc.setFont("helvetica", "bold");
  doc.text("Total", margin, y);
  doc.text(money(result.expectedTotalMinor, currency), margin + contentW, y, {
    align: "right",
  });

  // PAGE 4 — Drivers / complexity
  doc.addPage();
  y = margin;
  drawChrome();
  heading("What is driving migration cost?");
  if (result.drivers.length === 0) {
    body("Add cost inputs to see drivers.");
  } else {
    result.drivers.forEach((d, i) => {
      ensure(16);
      doc.setFontSize(10);
      doc.setTextColor(...NAVY);
      doc.text(
        `${i + 1}. ${d.label} — ${d.sharePercent}% (${money(d.expectedMinor, currency)})`,
        margin,
        y,
      );
      y += 14;
    });
  }
  y += 10;
  heading("Complexity profile");
  for (const dim of result.complexity.dimensions) {
    ensure(14);
    doc.setFontSize(9);
    doc.setTextColor(...MUTED);
    doc.text(
      `${dim.label}: ${complexityLabel(dim.band)}`,
      margin,
      y,
    );
    y += 12;
  }

  // PAGE 5 — Risks / unknowns
  doc.addPage();
  y = margin;
  drawChrome();
  heading("Unknowns & risks");
  if (result.unknowns.length === 0) {
    body("No material unknowns flagged.");
  } else {
    for (const u of result.unknowns) {
      ensure(14);
      doc.setFontSize(10);
      doc.setTextColor(...NAVY);
      doc.text(`• ${u.label}${u.material ? " (material)" : ""}`, margin, y);
      y += 14;
    }
  }
  y += 8;
  heading("Readiness warnings");
  if (result.readinessWarnings.length === 0) {
    body("No readiness warnings.");
  } else {
    for (const w of result.readinessWarnings) {
      ensure(14);
      doc.text(`⚠ ${w}`, margin, y);
      y += 14;
    }
  }

  // PAGE 6 — Next steps
  doc.addPage();
  y = margin;
  drawChrome();
  heading("Scope-reduction options");
  for (const s of result.scopeReductions) {
    ensure(14);
    doc.setFontSize(10);
    doc.setTextColor(...NAVY);
    const red =
      s.reductionMinor != null
        ? ` · potential −${money(s.reductionMinor, currency)}`
        : " · enter reduction to model impact";
    doc.text(
      `${s.enabled ? "[on]" : "[ ]"} ${s.label}${red}`,
      margin,
      y,
    );
    y += 14;
  }
  y += 12;
  heading("Next steps");
  body(
    "1. Resolve material unknowns (partner quotes, integrations, rates).\n2. Open Field Mapping Template if mapping is incomplete.\n3. Review CRM Readiness Assessment.\n4. Import this estimate into CRM Cost / TCO / ROI / Business Case after confirming.",
  );

  doc.save(
    `crm-migration-cost-${inputs.currentSystem.projectName.replace(/\s+/g, "-").toLowerCase()}.pdf`,
  );
}

export async function downloadMigrationCostExcel(
  inputs: McInputs,
  result: McComputeResult,
): Promise<void> {
  const XLSX = await import("xlsx");
  const wb = XLSX.utils.book_new();
  const currency = inputs.currency as CurrencyCode;

  const readMe = [
    ["SoftwareGlimpse CRM Migration Cost Calculator"],
    ["Generated", generatedLabel()],
    ["Currency", currency],
    [],
    ["Rules"],
    ["Unknown costs stay blank — never treated as zero"],
    ["No invented partner rates or industry averages"],
    ["Contingency only when you select a percentage"],
    ["Ranges only when you supply low/expected/high"],
    [],
    ["Sheets"],
    ["00_READ_ME", "This sheet"],
    ["01_PROJECT", "Project / source / target"],
    ["02_DATA_SCOPE", "Objects & history"],
    ["03_DATA_QUALITY", "Quality issues"],
    ["04_FIELD_MAPPING", "Mapping counts"],
    ["05_INTEGRATIONS", "Integrations"],
    ["06_CUSTOMIZATION", "Customization"],
    ["07_INTERNAL_EFFORT", "Internal roles"],
    ["08_EXTERNAL_COSTS", "External quotes & rates"],
    ["09_TESTING", "Test cycles"],
    ["10_CUTOVER", "Cutover / hypercare / training"],
    ["11_CONTINGENCY", "Contingency settings"],
    ["12_RESULTS", "Computed totals"],
    ["13_SCENARIOS", "Scope reduction / phases"],
  ];
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet(readMe),
    "00_READ_ME",
  );

  const project = [
    ["Project name", inputs.currentSystem.projectName],
    ["Owner", inputs.currentSystem.projectOwner ?? ""],
    ["Source type", inputs.currentSystem.sourceType ?? ""],
    ["Current platform", inputs.currentSystem.currentPlatform ?? ""],
    ["Target CRM", inputs.currentSystem.targetCrm ?? ""],
    ["Current users", inputs.currentSystem.currentUsers ?? ""],
    ["Target users", inputs.currentSystem.targetUsers ?? ""],
    ["Deadline", inputs.currentSystem.migrationDeadline ?? ""],
    ["Cutover approach", inputs.currentSystem.cutoverApproach ?? ""],
    ["Migration type", inputs.currentSystem.migrationType ?? ""],
    ["Currency", currency],
  ];
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet(project),
    "01_PROJECT",
  );

  const scope = [
    [
      "Object",
      "Migrate",
      "Exact count",
      "Volume band",
      "History",
      "Custom fields",
      "Attachments",
      "Relationships",
    ],
    ...inputs.dataScope.objects.map((o) => [
      o.label,
      o.migrate ? "yes" : "no",
      o.recordCountExact ?? "",
      o.recordVolumeBand,
      o.historyDepth,
      o.customFieldsApprox ?? "",
      o.hasAttachments,
      o.importantRelationships,
    ]),
  ];
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet(scope),
    "02_DATA_SCOPE",
  );

  const dq = [
    ["Issue", "Severity", "Owner", "Hours", "External quote (major)"],
    ...inputs.dataQuality.issues.map((i) => [
      i.id,
      i.severity,
      i.owner,
      i.estimatedHours ?? "",
      i.externalQuoteMinor != null ? i.externalQuoteMinor / 100 : "",
    ]),
  ];
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet(dq),
    "03_DATA_QUALITY",
  );

  const mapping = [
    ["Metric", "Value"],
    ["Source fields", inputs.fieldMapping.sourceFieldsApprox ?? ""],
    ["Target fields", inputs.fieldMapping.targetFieldsApprox ?? ""],
    ["Direct mappings", inputs.fieldMapping.directMappings ?? ""],
    ["Transformations", inputs.fieldMapping.transformationRules ?? ""],
    ["Value mappings", inputs.fieldMapping.valueMappings ?? ""],
    ["Lookups", inputs.fieldMapping.lookupMappings ?? ""],
    ["Custom objects", inputs.fieldMapping.customObjects ?? ""],
    ["Unmapped required", inputs.fieldMapping.unmappedRequired ?? ""],
    ["Open issues", inputs.fieldMapping.openIssues ?? ""],
    [
      "External quote (major)",
      inputs.fieldMapping.externalQuoteMinor != null
        ? inputs.fieldMapping.externalQuoteMinor / 100
        : "",
    ],
    ["Internal hours", inputs.fieldMapping.internalHours ?? ""],
  ];
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet(mapping),
    "04_FIELD_MAPPING",
  );

  const ints = [
    [
      "Integration",
      "Existing",
      "Disposition",
      "Type",
      "Complexity",
      "Who",
      "External cost (major)",
      "Internal hours",
    ],
    ...inputs.integrations.rows.map((r) => [
      r.label,
      r.existing,
      r.disposition,
      r.integrationType,
      r.complexity,
      r.who,
      r.externalCostMinor != null ? r.externalCostMinor / 100 : "",
      r.internalHours ?? "",
    ]),
  ];
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet(ints),
    "05_INTEGRATIONS",
  );

  const cust = [
    ["Item", "Required", "Hours", "Owner", "Cost (major)"],
    ...inputs.integrations.customizations.map((c) => [
      c.id,
      c.required,
      c.estimatedHours ?? "",
      c.owner,
      c.costMinor != null ? c.costMinor / 100 : "",
    ]),
  ];
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet(cust),
    "06_CUSTOMIZATION",
  );

  const effort = [
    ["Role", "People", "Hours/person", "Hourly (major)", "Total (major)", "Include"],
    ...inputs.internalEffort.roles.map((r) => [
      r.label,
      r.people,
      r.hoursPerPerson,
      r.hourlyCostMinor != null ? r.hourlyCostMinor / 100 : "",
      r.totalCostMinor != null ? r.totalCostMinor / 100 : "",
      r.include ? "yes" : "no",
    ]),
  ];
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet(effort),
    "07_INTERNAL_EFFORT",
  );

  const external = [
    ["Item", "Amount (major)"],
    [
      "Implementation quote",
      inputs.approach.externalImplementationQuoteMinor != null
        ? inputs.approach.externalImplementationQuoteMinor / 100
        : "",
    ],
    [
      "Migration-specific quote",
      inputs.approach.migrationSpecificQuoteMinor != null
        ? inputs.approach.migrationSpecificQuoteMinor / 100
        : "",
    ],
    [
      "Partner day rate",
      inputs.approach.partnerDayRateMinor != null
        ? inputs.approach.partnerDayRateMinor / 100
        : "",
    ],
    ["Estimated days", inputs.approach.estimatedDays ?? ""],
    [
      "Tooling license",
      inputs.approach.toolingLicenseCostMinor != null
        ? inputs.approach.toolingLicenseCostMinor / 100
        : "",
    ],
  ];
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet(external),
    "08_EXTERNAL_COSTS",
  );

  const testing = [
    ["Cycle", "Hours", "Partner (major)", "Tool (major)", "Include"],
    ...inputs.testingCutover.testing.cycles.map((c) => [
      c.label,
      c.hours ?? "",
      c.partnerCostMinor != null ? c.partnerCostMinor / 100 : "",
      c.toolCostMinor != null ? c.toolCostMinor / 100 : "",
      c.include ? "yes" : "no",
    ]),
  ];
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet(testing),
    "09_TESTING",
  );

  const cutover = [
    ["Field", "Value"],
    ["Cutover model", inputs.testingCutover.cutover.model],
    [
      "Overtime (major)",
      inputs.testingCutover.cutover.overtimeCostMinor != null
        ? inputs.testingCutover.cutover.overtimeCostMinor / 100
        : "",
    ],
    [
      "Partner coverage (major)",
      inputs.testingCutover.cutover.partnerCoverageMinor != null
        ? inputs.testingCutover.cutover.partnerCoverageMinor / 100
        : "",
    ],
    ["Hypercare period", inputs.testingCutover.hypercare.period],
    [
      "Hypercare external (major)",
      inputs.testingCutover.hypercare.externalSupportCostMinor != null
        ? inputs.testingCutover.hypercare.externalSupportCostMinor / 100
        : "",
    ],
    [
      "Training cost (major)",
      inputs.testingCutover.training.trainingCostMinor != null
        ? inputs.testingCutover.training.trainingCostMinor / 100
        : "",
    ],
    ["Training classification", inputs.testingCutover.training.classification],
  ];
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet(cutover),
    "10_CUTOVER",
  );

  const contingency = [
    ["Percent", inputs.testingCutover.contingency.percent],
    ["Custom percent", inputs.testingCutover.contingency.customPercent ?? ""],
    ["Apply to external", inputs.testingCutover.contingency.applyToExternal],
    ["Apply to internal", inputs.testingCutover.contingency.applyToInternal],
    ["Apply to tooling", inputs.testingCutover.contingency.applyToTooling],
    [
      "Exclude fixed licenses",
      inputs.testingCutover.contingency.excludeFixedLicenses,
    ],
    [
      "Computed contingency (major)",
      result.contingencyMinor != null ? result.contingencyMinor / 100 : "",
    ],
  ];
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet(contingency),
    "11_CONTINGENCY",
  );

  const results = [
    ["Metric", "Value (major)"],
    [
      "Expected total",
      result.expectedTotalMinor != null ? result.expectedTotalMinor / 100 : "",
    ],
    ["Low", result.lowTotalMinor != null ? result.lowTotalMinor / 100 : ""],
    ["High", result.highTotalMinor != null ? result.highTotalMinor / 100 : ""],
    ["External", result.externalMinor != null ? result.externalMinor / 100 : ""],
    [
      "Internal",
      result.internalLabourMinor != null
        ? result.internalLabourMinor / 100
        : "",
    ],
    ["Tooling", result.toolingMinor != null ? result.toolingMinor / 100 : ""],
    [
      "Contingency",
      result.contingencyMinor != null ? result.contingencyMinor / 100 : "",
    ],
    ["Known modelled", result.knownMinor / 100],
    ["Coverage %", result.coveragePercent ?? ""],
    ["Confidence", result.confidence],
    ["Complexity", result.complexity.overall],
    ["Status", result.status],
    [],
    ["Category", "Amount (major)"],
    ...result.categories.map((c) => [
      CATEGORY_LABELS[c.id],
      c.expectedMinor != null ? c.expectedMinor / 100 : "",
    ]),
    [],
    ["Line", "Category", "Bucket", "Amount (major)", "Hours", "Known"],
    ...result.lines.map((l) => [
      l.label,
      l.category,
      l.bucket,
      l.expectedMinor != null ? l.expectedMinor / 100 : "",
      l.hours ?? "",
      l.known ? "yes" : "no",
    ]),
  ];
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet(results),
    "12_RESULTS",
  );

  const scenarios = [
    ["Scope toggle", "Enabled", "Reduction (major)"],
    ...result.scopeReductions.map((s) => [
      s.label,
      s.enabled ? "yes" : "no",
      s.reductionMinor != null ? s.reductionMinor / 100 : "",
    ]),
    [],
    ["Phase", "Allocated (major)"],
    ...result.phaseTotals.map((p) => [
      p.label,
      p.expectedMinor != null ? p.expectedMinor / 100 : "",
    ]),
  ];
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.aoa_to_sheet(scenarios),
    "13_SCENARIOS",
  );

  const out = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  downloadBlob(
    new Blob([out], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    `crm-migration-cost-model.xlsx`,
  );
}

export async function downloadMigrationCostMarkdown(
  inputs: McInputs,
  result: McComputeResult,
): Promise<void> {
  const currency = inputs.currency as CurrencyCode;
  const lines = [
    `# CRM Migration Cost Estimate`,
    ``,
    `**Project:** ${inputs.currentSystem.projectName}`,
    `**Expected modelled cost:** ${money(result.expectedTotalMinor, currency)}`,
    `**Confidence:** ${result.confidence}`,
    `**Complexity:** ${result.complexity.overall}`,
    `**Coverage:** ${result.coveragePercent ?? "—"}%`,
    ``,
    `## Buckets`,
    `- External: ${money(result.externalMinor, currency)}`,
    `- Internal: ${money(result.internalLabourMinor, currency)}`,
    `- Tooling: ${money(result.toolingMinor, currency)}`,
    `- Contingency: ${money(result.contingencyMinor, currency)}`,
    ``,
    `## Categories`,
    ...result.categories
      .filter((c) => c.expectedMinor != null)
      .map((c) => `- ${c.label}: ${money(c.expectedMinor, currency)}`),
    ``,
    `## Unknowns`,
    ...result.unknowns.map((u) => `- ${u.label}`),
    ``,
    `_Generated by SoftwareGlimpse CRM Migration Cost Calculator_`,
  ];
  downloadBlob(
    new Blob([lines.join("\n")], { type: "text/markdown;charset=utf-8" }),
    "crm-migration-cost-estimate.md",
  );
}
