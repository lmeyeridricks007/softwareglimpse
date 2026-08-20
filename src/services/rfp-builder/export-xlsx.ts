/**
 * CRM RFP / Vendor Brief — Excel vendor response workbook.
 * SheetJS is dynamically imported by callers. Formulas compute in Excel.
 * Blank vendor inputs only — never invent pricing figures.
 */

import type { CrmRfpSession, RfpMode } from "@/domain";
import {
  RFP_DELIVERY_METHOD_DEFINITIONS,
  RFP_DELIVERY_METHOD_LABELS,
  RFP_DELIVERY_METHODS,
  RFP_PRIORITY_LABELS,
} from "./constants";
import { countByPriority } from "./quality";
import { modeDocumentTitle } from "./export-md";

type AOA = (string | number | null)[][];

export type RfpSheetSpec = {
  name: string;
  aoa: AOA;
  cols?: { wch: number }[];
};

function blankRow(cols: number): (string | number | null)[] {
  return Array.from({ length: cols }, () => "");
}

export function buildRfpWorkbookSheets(
  session: CrmRfpSession,
  options: { vendorName?: string } = {},
): RfpSheetSpec[] {
  const mode: RfpMode = session.mode ?? "vendor-brief";
  const formal = mode === "formal-rfp";
  const draft = session.draft;
  const counts = countByPriority(draft.requirements);
  const title = modeDocumentTitle(mode);
  const vendorLabel = options.vendorName?.trim() || "";

  const legend = RFP_DELIVERY_METHODS.map((m) => [
    RFP_DELIVERY_METHOD_LABELS[m],
    RFP_DELIVERY_METHOD_DEFINITIONS[m],
  ]);

  const instructions: AOA = [
    [`SoftwareGlimpse — ${title} (Excel vendor response)`],
    ["Version", session.versionMeta.version],
    ["Generated", session.versionMeta.generatedAt ?? session.updatedAt],
    ["Mode", mode],
    vendorLabel ? ["Vendor package", vendorLabel] : ["Vendor package", "(unnamed — identical pack)"],
    [],
    ["Purpose"],
    [
      "Buyers complete context and requirements; vendors complete response columns. Score answers later in the CRM Vendor Scorecard — not inside this file.",
    ],
    [],
    ["Delivery method legend"],
    ["Code", "Meaning"],
    ...legend,
    [],
    ["Response rules"],
    ...draft.responseRules.rules.map((r) => [r]),
    [],
    ["Do not remove requirement IDs."],
    ["Do not invent capabilities or replace tables with marketing decks."],
  ];

  const summary: AOA = [
    ["RFP summary"],
    ["Project", draft.project.projectName || ""],
    ["Organization", draft.project.organization || ""],
    ["Mode", title],
    ["Version", session.versionMeta.version],
    ["Currency", draft.project.currency],
    ["Vendors expected", draft.project.vendorsExpected ?? ""],
    ["Response deadline", draft.project.responseDeadline || draft.responseRules.responseDeadline || ""],
    ["Decision date", draft.project.decisionDate || ""],
    ["Go-live", draft.project.goLiveDate || ""],
    ["Requirements total", counts.total],
    ["Must-have", counts.mustHave],
    ["Should-have", counts.shouldHave],
    ["Could-have", counts.couldHave],
    ["Integrations", draft.integrations.length],
    ["Security questions required", draft.securityQuestions.filter((q) => q.required).length],
  ];

  const objectives: AOA = [
    ["ID", "Objective", "Current baseline", "Desired outcome", "Measurement", "Priority", "Owner"],
    ...draft.objectives.map((o) => [
      o.id,
      o.objective,
      o.currentBaseline,
      o.desiredOutcome,
      o.measurement,
      o.priority,
      o.owner,
    ]),
    ...Array.from({ length: 5 }, () => blankRow(7)),
  ];

  const scopeUsers: AOA = [
    ["Scope item", "Phase", "Capability slug"],
    ...draft.scope.map((s) => [s.label, s.phase, s.capabilitySlug ?? ""]),
    [],
    ["User metric", "Value"],
    ["Current users", draft.users.currentUsers ?? ""],
    ["12-month expected", draft.users.users12Month ?? ""],
    ["36-month expected", draft.users.users36Month ?? ""],
    [],
    ["Group", "Users", "Primary job", "Access type", "Key workflows"],
    ...draft.users.groups.map((g) => [
      g.group,
      g.users ?? "",
      g.primaryJob,
      g.accessType,
      g.keyWorkflows,
    ]),
  ];

  const reqs = draft.requirements
    .filter((r) => r.priority !== "out-of-scope")
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const reqHeader = [
    "ID",
    "Category",
    "Requirement",
    "Priority",
    "Rationale",
    "Acceptance criterion",
    "Evidence requested",
    "Mandatory",
    "Vendor Response",
    "Delivery Method",
    "Edition/Tier",
    "Additional Cost",
    "Evidence URL/Reference",
    "Implementation Dependency",
    "Vendor Comments",
  ];

  const requirementsSheet: AOA = [
    ["Functional requirements — vendor response"],
    [
      `Delivery methods: ${RFP_DELIVERY_METHODS.map((m) => RFP_DELIVERY_METHOD_LABELS[m]).join(" | ")}`,
    ],
    [],
    reqHeader,
    ...reqs.map((r) => [
      r.id,
      r.category,
      r.requirement,
      RFP_PRIORITY_LABELS[r.priority],
      r.rationale,
      r.acceptanceCriterion,
      r.evidenceRequested,
      r.mandatory ? "Yes" : "No",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ]),
    ...Array.from({ length: 8 }, () => blankRow(reqHeader.length)),
  ];

  const integrations: AOA = [
    [
      "System",
      "Category",
      "Direction",
      "Data",
      "Frequency",
      "Criticality",
      "Preferred method",
      "Owner",
      "Notes",
      "Vendor approach",
      "Vendor comments",
    ],
    ...draft.integrations.map((i) => [
      i.system,
      i.category,
      i.direction,
      i.data,
      i.frequency,
      i.criticality,
      i.preferredMethod,
      i.owner,
      i.notes,
      "",
      "",
    ]),
    ...Array.from({ length: 5 }, () => blankRow(11)),
  ];

  const sheets: RfpSheetSpec[] = [
    {
      name: "00_INSTRUCTIONS",
      aoa: instructions,
      cols: [{ wch: 28 }, { wch: 72 }],
    },
    {
      name: "01_RFP_SUMMARY",
      aoa: summary,
      cols: [{ wch: 28 }, { wch: 48 }],
    },
    {
      name: "02_OBJECTIVES",
      aoa: objectives,
      cols: [
        { wch: 10 },
        { wch: 28 },
        { wch: 24 },
        { wch: 24 },
        { wch: 20 },
        { wch: 10 },
        { wch: 14 },
      ],
    },
    {
      name: "03_SCOPE_USERS",
      aoa: scopeUsers,
      cols: [{ wch: 22 }, { wch: 16 }, { wch: 22 }, { wch: 18 }, { wch: 28 }],
    },
    {
      name: "04_REQUIREMENTS",
      aoa: requirementsSheet,
      cols: [
        { wch: 12 },
        { wch: 18 },
        { wch: 48 },
        { wch: 12 },
        { wch: 20 },
        { wch: 24 },
        { wch: 18 },
        { wch: 10 },
        { wch: 22 },
        { wch: 16 },
        { wch: 14 },
        { wch: 14 },
        { wch: 22 },
        { wch: 18 },
        { wch: 22 },
      ],
    },
    {
      name: "05_INTEGRATIONS",
      aoa: integrations,
      cols: Array.from({ length: 11 }, () => ({ wch: 16 })),
    },
  ];

  if (formal) {
    sheets.push({
      name: "06_DATA_MIGRATION",
      aoa: [
        ["Performer", draft.migration.performer ?? ""],
        ["Constraints", draft.migration.constraints],
        [],
        [
          "Object",
          "Source system",
          "Approx record count",
          "History required",
          "Attachments",
          "Custom fields",
          "Migration owner",
          "Priority",
          "Vendor approach",
        ],
        ...draft.migration.objects.map((o) => [
          o.objectName,
          o.sourceSystem,
          o.approxRecordCount,
          o.historyRequired ? "Yes" : "No",
          o.attachments ? "Yes" : "No",
          o.customFields ? "Yes" : "No",
          o.migrationOwner,
          RFP_PRIORITY_LABELS[o.priority],
          "",
        ]),
        ...Array.from({ length: 5 }, () => blankRow(9)),
      ],
      cols: Array.from({ length: 9 }, () => ({ wch: 16 })),
    });

    sheets.push({
      name: "07_SECURITY",
      aoa: [
        [
          "ID",
          "Area",
          "Question",
          "Required",
          "Evidence requested",
          "Buyer comments",
          "Vendor response",
          "Evidence / reference",
        ],
        ...draft.securityQuestions.map((q) => [
          q.id,
          q.area,
          q.question,
          q.required ? "Yes" : "No",
          q.evidenceRequested ? "Yes" : "No",
          q.comments,
          "",
          "",
        ]),
      ],
      cols: [
        { wch: 10 },
        { wch: 14 },
        { wch: 48 },
        { wch: 10 },
        { wch: 12 },
        { wch: 20 },
        { wch: 28 },
        { wch: 22 },
      ],
    });
  }

  sheets.push({
    name: formal ? "08_IMPLEMENTATION" : "06_IMPLEMENTATION",
    aoa: [
      ["Preferred go-live", draft.implementation.preferredGoLive],
      ["Implementation model preference", draft.implementation.model ?? ""],
      ["Custom requirements", draft.implementation.customRequirements],
      [],
      ["Question", "Requested", "Buyer notes", "Vendor response"],
      ...draft.implementation.questions.map((q) => [
        q.label,
        q.requested ? "Yes" : "No",
        q.notes,
        "",
      ]),
      [],
      [
        "Phase",
        "Duration (vendor)",
        "Dependencies (vendor)",
        "Customer resources (vendor)",
      ],
      ...draft.implementation.timelinePhases.map((p) => [
        p.phase,
        "",
        "",
        "",
      ]),
    ],
    cols: [{ wch: 28 }, { wch: 18 }, { wch: 28 }, { wch: 28 }],
  });

  if (formal) {
    sheets.push({
      name: "09_SUPPORT",
      aoa: [
        ["Topic", "Requested", "Buyer notes", "Vendor response"],
        ...draft.supportQuestions.map((q) => [
          q.topic,
          q.requested ? "Yes" : "No",
          q.notes,
          "",
        ]),
      ],
      cols: [{ wch: 28 }, { wch: 12 }, { wch: 24 }, { wch: 36 }],
    });
  }

  const pricingName = formal ? "10_PRICING" : "07_PRICING";
  const a = draft.pricingAssumptions;
  // Pricing sheet with formulas: annual software, add-ons, implementation, recurring, Y1–Y3, TCO
  const pricing: AOA = [
    ["Pricing assumptions (buyer — vendors must price against these)"],
    ["Currency", a.currency],
    ["Users Year 1", a.usersYear1 ?? ""],
    ["Users Year 2", a.usersYear2 ?? ""],
    ["Users Year 3", a.usersYear3 ?? ""],
    ["Required add-ons", a.requiredAddOns],
    ["Regions", a.regions],
    ["Support tier", a.supportTier],
    ["Implementation scope", a.implementationScope],
    ["Tax treatment", a.taxTreatment],
    [],
    ["SOFTWARE"],
    ["Edition / plan", "Users", "List price", "Proposed price", "Billing frequency", "Discount", "Annual software cost"],
    ["", a.usersYear1 ?? "", "", "", "Annual", "", ""], // row 14 in 1-based if header at 13 — we'll use explicit formula rows below
    [],
    ["ADD-ONS"],
    ["Name", "Required/optional", "Quantity", "Unit price", "Annual cost"],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    [],
    ["IMPLEMENTATION (one-time)"],
    ["Line", "Amount"],
    ["Discovery", ""],
    ["Configuration", ""],
    ["Integration", ""],
    ["Migration", ""],
    ["Training", ""],
    ["Project management", ""],
    ["Customization", ""],
    ["Other", ""],
    ["Implementation total", { f: "SUM(B24:B31)" } as unknown as number],
    [],
    ["RECURRING SERVICES (annual)"],
    ["Line", "Amount"],
    ["Support", ""],
    ["Success services", ""],
    ["Integration/platform", ""],
    ["Storage", ""],
    ["API packages", ""],
    ["Other", ""],
    ["Recurring total", { f: "SUM(B35:B40)" } as unknown as number],
    [],
    ["3-YEAR TCO"],
    ["Year", "Software", "Add-ons", "Implementation", "Recurring", "Total"],
    ["Year 1", "", "", "", "", ""],
    ["Year 2", "", "", "", "", ""],
    ["Year 3", "", "", "", "", ""],
    ["Total", "", "", "", "", ""],
    [],
    ["CONTRACT"],
    ["Minimum term", ""],
    ["Price increases", ""],
    ["Renewal", ""],
    ["Cancellation", ""],
    ["Seat changes", ""],
    ["Minimum seats", ""],
    ["Payment terms", ""],
  ];

  // SheetJS accepts formula objects as { t: 'n', f: '...' } when using cell objects;
  // AOA string formulas starting with = also work when written via cell assignment.
  // Replace formula placeholders with Excel formula strings for reliability:
  const pricingFixed: AOA = pricing.map((row) =>
    row.map((cell) => {
      if (cell && typeof cell === "object" && "f" in cell) {
        return `=${(cell as { f: string }).f}`;
      }
      return cell as string | number | null;
    }),
  );

  // Use clearer formula layout with labelled cells
  const pricingClean: AOA = [
    ["Pricing assumptions (buyer)"],
    ["Currency", a.currency],
    ["Users_Y1", a.usersYear1 ?? ""],
    ["Users_Y2", a.usersYear2 ?? ""],
    ["Users_Y3", a.usersYear3 ?? ""],
    ["Required_add_ons", a.requiredAddOns],
    ["Regions", a.regions],
    ["Support_tier", a.supportTier],
    ["Implementation_scope", a.implementationScope],
    ["Tax_treatment", a.taxTreatment],
    [],
    ["SOFTWARE (vendor inputs)"],
    ["Edition_plan", ""],
    ["Users", a.usersYear1 ?? ""],
    ["List_price", ""],
    ["Proposed_price", ""],
    ["Billing_frequency", "Annual"],
    ["Discount", ""],
    ["Annual_software", ""],
    [],
    ["ADD_ONS_ANNUAL", ""],
    [],
    ["IMPLEMENTATION (vendor inputs — one-time)"],
    ["Discovery", ""],
    ["Configuration", ""],
    ["Integration", ""],
    ["Migration", ""],
    ["Training", ""],
    ["Project_management", ""],
    ["Customization", ""],
    ["Other_impl", ""],
    ["Implementation_total", "=SUM(B24:B31)"],
    [],
    ["RECURRING (vendor inputs — annual)"],
    ["Support", ""],
    ["Success_services", ""],
    ["Integration_platform", ""],
    ["Storage", ""],
    ["API_packages", ""],
    ["Other_recurring", ""],
    ["Recurring_total", "=SUM(B35:B40)"],
    [],
    ["THREE_YEAR_TCO"],
    ["Metric", "Year1", "Year2", "Year3", "Total"],
    [
      "Software",
      "=IF(B19=\"\",\"\",B19)",
      "=IF(B19=\"\",\"\",B19)",
      "=IF(B19=\"\",\"\",B19)",
      "=SUM(B44:D44)",
    ],
    [
      "Add_ons",
      "=IF(B21=\"\",\"\",B21)",
      "=IF(B21=\"\",\"\",B21)",
      "=IF(B21=\"\",\"\",B21)",
      "=SUM(B45:D45)",
    ],
    ["Implementation", "=IF(B32=\"\",\"\",B32)", "0", "0", "=SUM(B46:D46)"],
    [
      "Recurring",
      "=IF(B41=\"\",\"\",B41)",
      "=IF(B41=\"\",\"\",B41)",
      "=IF(B41=\"\",\"\",B41)",
      "=SUM(B47:D47)",
    ],
    ["Year_total", "=SUM(B44:B47)", "=SUM(C44:C47)", "=SUM(D44:D47)", "=SUM(E44:E47)"],
    [],
    ["CONTRACT"],
    ["Minimum_term", ""],
    ["Price_increases", ""],
    ["Renewal", ""],
    ["Cancellation", ""],
    ["Seat_changes", ""],
    ["Minimum_seats", ""],
    ["Payment_terms", ""],
  ];

  void pricingFixed; // keep build path simple — use pricingClean
  sheets.push({
    name: pricingName,
    aoa: pricingClean,
    cols: [{ wch: 24 }, { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 14 }],
  });

  sheets.push({
    name: formal ? "11_ASSUMPTIONS_EXCEPTIONS" : "08_ASSUMPTIONS_EXCEPTIONS",
    aoa: [
      ["Vendor assumptions"],
      [""],
      [""],
      [""],
      [],
      ["Vendor exceptions"],
      [""],
      [""],
      [""],
    ],
    cols: [{ wch: 80 }],
  });

  if (formal) {
    sheets.push({
      name: "12_VENDOR_PROFILE",
      aoa: [
        ["Field", "Vendor response"],
        ["Company legal name", ""],
        ["Headquarters", ""],
        ["Years in CRM market", ""],
        ["Quoted product / edition", ""],
        ["Implementation partner (if any)", ""],
        ["Primary contact", ""],
        ["Email", ""],
      ],
      cols: [{ wch: 32 }, { wch: 40 }],
    });
    sheets.push({
      name: "13_REFERENCES",
      aoa: [
        ["Customer", "Industry", "Users", "Scope summary", "Contact permission"],
        ...Array.from({ length: 5 }, () => blankRow(5)),
      ],
      cols: [{ wch: 20 }, { wch: 16 }, { wch: 10 }, { wch: 36 }, { wch: 16 }],
    });
  }

  const summaryName = formal ? "14_RESPONSE_SUMMARY" : "09_RESPONSE_SUMMARY";
  const reqDataStart = 5; // header row index in sheet (1-based Excel row after titles)
  const reqCount = Math.max(reqs.length, 1);
  sheets.push({
    name: summaryName,
    aoa: [
      ["Response completeness (vendor completes / Excel may count)"],
      ["Do not calculate vendor scores here — use CRM Vendor Scorecard."],
      [],
      ["Metric", "Value / formula note"],
      ["Requirements in pack", reqCount],
      ["Must-have count", counts.mustHave],
      ["Requirements answered", "(vendor: count non-blank Vendor Response)"],
      ["Must-have unsupported", "(vendor: count Must Have + NOT SUPPORTED)"],
      ["Roadmap dependencies", "(vendor: count ROADMAP delivery)"],
      ["Third-party dependencies", "(vendor: count THIRD PARTY delivery)"],
      ["Year 1 cost", "(from pricing Year_total Year1)"],
      ["3-year TCO", "(from pricing Year_total Total)"],
      ["Estimated implementation duration", ""],
      ["Open exceptions", ""],
      [],
      ["Requirement sheet rows start near Excel row", String(reqDataStart)],
    ],
    cols: [{ wch: 36 }, { wch: 48 }],
  });

  return sheets;
}

export async function downloadRfpExcel(
  session: CrmRfpSession,
  options: { vendorName?: string; filename?: string } = {},
): Promise<void> {
  const XLSX = await import("xlsx");
  const sheets = buildRfpWorkbookSheets(session, options);
  const wb = XLSX.utils.book_new();
  for (const sheet of sheets) {
    const ws = XLSX.utils.aoa_to_sheet(sheet.aoa);
    if (sheet.cols) ws["!cols"] = sheet.cols;
    XLSX.utils.book_append_sheet(wb, ws, sheet.name.slice(0, 31));
  }
  const mode = session.mode ?? "vendor-brief";
  const base =
    options.filename ??
    (mode === "formal-rfp" ? "crm-rfp" : "crm-vendor-brief");
  const vendorPart = options.vendorName
    ? `-${options.vendorName.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`
    : "";
  const filename = `${base}${vendorPart}-v${session.versionMeta.version}.xlsx`;
  XLSX.writeFile(wb, filename);
}
