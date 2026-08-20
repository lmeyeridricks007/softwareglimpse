/**
 * CRM RFP / Vendor Brief PDF — client-side jsPDF (dynamic import).
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

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export async function downloadRfpPdf(
  session: CrmRfpSession,
  options: { vendorName?: string; filename?: string } = {},
): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 48;
  const maxW = pageW - margin * 2;
  let y = margin;

  const navy: [number, number, number] = [15, 35, 70];
  const primary: [number, number, number] = [37, 99, 235];
  const muted: [number, number, number] = [100, 116, 139];
  const bodyColor: [number, number, number] = [40, 40, 50];

  const mode: RfpMode = session.mode ?? "vendor-brief";
  const formal = mode === "formal-rfp";
  const draft = session.draft;
  const title = modeDocumentTitle(mode);
  const counts = countByPriority(draft.requirements);

  const ensure = (need: number) => {
    if (y + need > pageH - margin) {
      doc.addPage();
      y = margin;
    }
  };

  const h2 = (text: string) => {
    ensure(32);
    y += 6;
    doc.setFillColor(...primary);
    doc.roundedRect(margin, y - 10, 4, 14, 1, 1, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...navy);
    doc.text(text, margin + 12, y);
    y += 20;
  };

  const body = (text: string) => {
    if (!text.trim()) return;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...bodyColor);
    const lines = doc.splitTextToSize(text, maxW) as string[];
    ensure(lines.length * 13 + 6);
    doc.text(lines, margin, y);
    y += lines.length * 13 + 6;
  };

  const mutedLine = (text: string) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...muted);
    const lines = doc.splitTextToSize(text, maxW) as string[];
    ensure(lines.length * 12 + 4);
    doc.text(lines, margin, y);
    y += lines.length * 12 + 4;
  };

  const kv = (label: string, value: string) => {
    if (!value.trim()) return;
    ensure(16);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...muted);
    doc.text(label, margin, y);
    doc.setTextColor(...bodyColor);
    doc.setFont("helvetica", "bold");
    const lines = doc.splitTextToSize(value, maxW - 160) as string[];
    doc.text(lines, margin + 160, y);
    y += Math.max(14, lines.length * 12);
  };

  // Cover
  doc.setFillColor(239, 246, 255);
  doc.rect(0, 0, pageW, 120, "F");
  y = 56;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...primary);
  doc.text("SoftwareGlimpse", margin, y);
  y += 28;
  doc.setFontSize(22);
  doc.setTextColor(...navy);
  doc.text(title, margin, y);
  y += 22;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(...muted);
  doc.text(
    draft.project.projectName || "CRM evaluation package",
    margin,
    y,
  );
  y = 140;

  mutedLine(
    "Buyer-authored package. SoftwareGlimpse does not invent requirements, pricing, timelines or vendor capabilities.",
  );
  kv("Version", session.versionMeta.version);
  if (options.vendorName) kv("Vendor package", options.vendorName);
  kv("Organization", draft.project.organization);
  kv("Issue date", draft.project.issueDate);
  kv("Response deadline", draft.project.responseDeadline || draft.responseRules.responseDeadline);
  kv("Decision date", draft.project.decisionDate);
  kv("Go-live", draft.project.goLiveDate);
  kv("Vendors expected", draft.project.vendorsExpected != null ? String(draft.project.vendorsExpected) : "");
  kv(
    "Requirements",
    `${counts.total} total · ${counts.mustHave} must-have · ${counts.shouldHave} should-have`,
  );

  h2("Instructions to vendors");
  for (const rule of draft.responseRules.rules) {
    body(`• ${rule}`);
  }

  h2("Company / project context");
  kv("Project", draft.project.projectName);
  kv("Owner", draft.project.owner);
  kv("Executive sponsor", draft.project.executiveSponsor);
  kv("Current CRM", draft.project.currentCrm);
  kv("Geography", draft.project.geography);
  kv("Currency", draft.project.currency);

  h2("Business context");
  if (draft.businessContext.currentSituation) {
    body("Current situation");
    body(draft.businessContext.currentSituation);
  }
  if (draft.businessContext.businessProblem) {
    body("Business problem");
    body(draft.businessContext.businessProblem);
  }
  if (draft.businessContext.changeTriggers.length) {
    body("Change triggers (buyer-selected)");
    body(draft.businessContext.changeTriggers.join("; "));
  }
  if (draft.businessContext.desiredFutureState) {
    body("Desired future state");
    body(draft.businessContext.desiredFutureState);
  }
  if (draft.businessContext.successOutcomes) {
    body("Success outcomes");
    body(draft.businessContext.successOutcomes);
  }

  if (draft.objectives.length) {
    h2("Objectives");
    for (const o of draft.objectives) {
      body(`${o.id} — ${o.objective || "(untitled)"} (${o.priority})`);
      if (o.desiredOutcome) body(`Target: ${o.desiredOutcome}`);
      if (o.measurement) body(`Measurement: ${o.measurement}`);
    }
  }

  h2("Scope & users");
  for (const s of draft.scope) {
    body(`• ${s.label} — ${s.phase}`);
  }
  if (draft.users.currentUsers != null) {
    kv("Current users", String(draft.users.currentUsers));
  }
  if (draft.users.users12Month != null) {
    kv("12-month users", String(draft.users.users12Month));
  }
  if (draft.users.users36Month != null) {
    kv("36-month users", String(draft.users.users36Month));
  }
  for (const g of draft.users.groups.filter((x) => x.group.trim())) {
    body(
      `• ${g.group}${g.users != null ? ` (${g.users})` : ""}${g.primaryJob ? ` — ${g.primaryJob}` : ""}`,
    );
  }

  h2(formal ? "Functional requirements" : "Priority requirements");
  mutedLine(
    "Vendors must respond in the Excel workbook using the delivery-method legend.",
  );
  const reqs = draft.requirements
    .filter((r) => r.priority !== "out-of-scope")
    .sort((a, b) => a.sortOrder - b.sortOrder);
  for (const r of reqs) {
    ensure(36);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...primary);
    doc.text(
      `${r.id} · ${RFP_PRIORITY_LABELS[r.priority]}${r.mandatory ? " · Mandatory" : ""}`,
      margin,
      y,
    );
    y += 12;
    body(r.requirement);
    if (r.acceptanceCriterion) {
      mutedLine(`Acceptance: ${r.acceptanceCriterion}`);
    }
  }

  h2("Vendor response legend");
  for (const m of RFP_DELIVERY_METHODS) {
    body(`${RFP_DELIVERY_METHOD_LABELS[m]} — ${RFP_DELIVERY_METHOD_DEFINITIONS[m]}`);
  }

  if (draft.integrations.length) {
    h2("Integrations");
    for (const i of draft.integrations) {
      body(
        `• ${i.system} (${i.category}) — ${i.direction}, ${i.criticality}${i.data ? `: ${i.data}` : ""}`,
      );
    }
  }

  if (formal && draft.migration.objects.length) {
    h2("Data / migration");
    if (draft.migration.performer) {
      kv("Migration performer", draft.migration.performer);
    }
    if (draft.migration.constraints) body(draft.migration.constraints);
    for (const o of draft.migration.objects) {
      body(
        `• ${o.objectName} from ${o.sourceSystem || "—"}${o.approxRecordCount ? ` (~${o.approxRecordCount})` : ""}`,
      );
    }
  }

  h2("Implementation");
  if (draft.implementation.model) {
    kv("Model preference", draft.implementation.model);
  }
  if (draft.implementation.preferredGoLive) {
    kv("Preferred go-live", draft.implementation.preferredGoLive);
  }
  for (const q of draft.implementation.questions.filter((x) => x.requested)) {
    body(`• ${q.label}`);
  }
  if (formal) {
    mutedLine(
      "Provide duration, dependencies and customer resources for: " +
        draft.implementation.timelinePhases.map((p) => p.phase).join(", "),
    );
  }

  if (formal) {
    const sec = draft.securityQuestions.filter((q) => q.required);
    if (sec.length) {
      h2("Security / privacy");
      for (const q of sec) {
        body(`• ${q.id}: ${q.question}`);
      }
    }
    const support = draft.supportQuestions.filter((q) => q.requested);
    if (support.length) {
      h2("Support / SLA");
      for (const q of support) body(`• ${q.topic}`);
    }
  }

  h2("Commercial response");
  const a = draft.pricingAssumptions;
  if (a.usersYear1 != null) kv("Users Year 1", String(a.usersYear1));
  if (a.usersYear2 != null) kv("Users Year 2", String(a.usersYear2));
  if (a.usersYear3 != null) kv("Users Year 3", String(a.usersYear3));
  if (a.requiredAddOns) kv("Required add-ons", a.requiredAddOns);
  if (a.regions) kv("Regions", a.regions);
  if (a.supportTier) kv("Support tier", a.supportTier);
  if (a.implementationScope) kv("Implementation scope", a.implementationScope);
  kv("Currency", a.currency);
  kv("Tax treatment", a.taxTreatment);
  body(
    "Complete the Excel pricing sheet for software, add-ons, implementation, recurring services and 3-year TCO. Do not substitute marketing price lists.",
  );

  if (formal) {
    h2("Vendor profile / references");
    body(
      "Complete Vendor Profile and References sheets in the Excel workbook.",
    );
    h2("Assumptions / exceptions");
    body(
      "List all assumptions and exceptions in the workbook. Do not bury them in cover letters.",
    );
    h2("Vendor declaration");
    body(
      "By submitting a response, the vendor confirms answers are accurate for the quoted edition, identifies third-party dependencies, and lists assumptions and exceptions.",
    );
  }

  h2("Contacts & deadlines");
  kv("Response deadline", draft.responseRules.responseDeadline || draft.project.responseDeadline);
  kv("Questions deadline", draft.responseRules.questionsDeadline);
  kv("Contact", draft.responseRules.contactPerson);
  kv("Email", draft.responseRules.contactEmail);
  kv("Submission method", draft.responseRules.submissionMethod);
  if (draft.responseRules.clarificationCallWindow) {
    kv("Clarification calls", draft.responseRules.clarificationCallWindow);
  }

  // Footer page numbers
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i += 1) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...muted);
    doc.text(
      `SoftwareGlimpse · ${title} · v${session.versionMeta.version} · ${i}/${pageCount}`,
      margin,
      pageH - 24,
    );
  }

  const base =
    options.filename ??
    (formal ? "crm-rfp" : "crm-vendor-brief");
  const vendorPart = options.vendorName
    ? `-${options.vendorName.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`
    : "";
  const filename = `${base}${vendorPart}-v${session.versionMeta.version}.pdf`;
  const blob = doc.output("blob");
  downloadBlob(blob, filename);
}
