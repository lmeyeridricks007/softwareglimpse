/**
 * Document exports for CRM requirements profiles (PDF print HTML + Excel XML).
 * No server round-trip — generated on-device from the local profile.
 */

import type { CrmDecisionProfile } from "@/domain";
import {
  BUDGET_OPTIONS,
  COMPANY_SIZE_OPTIONS,
  EASE_OPTIONS,
  INTEGRATION_OPTIONS,
  labelForOption,
} from "@/components/finder/crm-finder-questions";
import {
  INDUSTRY_OPTIONS,
  TEAM_OPTIONS,
  CURRENT_STATE_OPTIONS,
  PRIORITY_LABELS,
} from "@/components/requirements-builder/crm/definition";
import {
  SI_CURRENT_STATE_OPTIONS,
  SI_TEAM_OPTIONS,
} from "@/components/requirements-builder/si/definition";
import {
  isSiProfile,
  listSelectableCapabilitiesForProfile,
  listSelectableUseCasesForProfile,
  profileTitleForExport,
  resolveRequirementMetaForProfile,
  usersLabelForProfile,
} from "./category-helpers";
import { buildProfileCompleteness } from "./completeness";

function featureLabel(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function teamOptionsForProfile(profile: CrmDecisionProfile) {
  return isSiProfile(profile) ? SI_TEAM_OPTIONS : TEAM_OPTIONS;
}

function currentStateOptionsForProfile(profile: CrmDecisionProfile) {
  return isSiProfile(profile) ? SI_CURRENT_STATE_OPTIONS : CURRENT_STATE_OPTIONS;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function industryLabel(slug: string | undefined): string {
  if (!slug) return "Unknown";
  return (
    INDUSTRY_OPTIONS.find((o) => o.value === slug)?.label ?? slug
  );
}

export function teamLabels(
  teamIds: string[],
  profile?: CrmDecisionProfile,
): string {
  if (!teamIds.length) return "Unknown";
  const options = profile ? teamOptionsForProfile(profile) : TEAM_OPTIONS;
  return teamIds
    .map((id) => options.find((t) => t.value === id)?.label ?? id)
    .join(" + ");
}

export function currentStateLabel(
  value: string | undefined,
  profile?: CrmDecisionProfile,
): string {
  if (!value) return "Unknown";
  const options = profile
    ? currentStateOptionsForProfile(profile)
    : CURRENT_STATE_OPTIONS;
  return options.find((c) => c.value === value)?.label ?? value;
}

export type ProfileExportRow = {
  section: string;
  item: string;
  priority: string;
  notes: string;
};

export function buildProfileExportRows(
  profile: CrmDecisionProfile,
): ProfileExportRow[] {
  const rows: ProfileExportRow[] = [];
  const bc = profile.businessContext;
  const useCases = listSelectableUseCasesForProfile(profile);
  const caps = listSelectableCapabilitiesForProfile(profile);

  rows.push({
    section: "Business",
    item: "Industry",
    priority: "",
    notes: industryLabel(bc.industrySlug),
  });
  rows.push({
    section: "Business",
    item: "Company size",
    priority: "",
    notes:
      labelForOption(COMPANY_SIZE_OPTIONS, bc.companySizeSlug) ?? "Unknown",
  });
  rows.push({
    section: "Business",
    item: usersLabelForProfile(profile),
    priority: "",
    notes: bc.crmUserCount != null ? String(bc.crmUserCount) : "Unknown",
  });
  rows.push({
    section: "Business",
    item: "Primary teams",
    priority: "",
    notes: teamLabels(bc.teamIds, profile),
  });
  rows.push({
    section: "Business",
    item: "Current state",
    priority: "",
    notes: currentStateLabel(bc.currentState, profile),
  });

  for (const u of profile.useCases) {
    rows.push({
      section: "Use case",
      item: useCases.find((x) => x.slug === u.id)?.name ?? u.id,
      priority: PRIORITY_LABELS[u.priority] ?? u.priority,
      notes: "",
    });
  }
  for (const c of profile.capabilities) {
    rows.push({
      section: "Capability",
      item: caps.find((x) => x.slug === c.id)?.name ?? c.id,
      priority: PRIORITY_LABELS[c.priority] ?? c.priority,
      notes: "",
    });
  }
  for (const r of profile.requirements) {
    if (r.priority === "not-needed") continue;
    const meta = resolveRequirementMetaForProfile(profile, r.id);
    rows.push({
      section: "Requirement",
      item: meta?.name ?? r.id,
      priority: PRIORITY_LABELS[r.priority] ?? r.priority,
      notes: meta?.capabilityName ?? "",
    });
  }
  for (const f of profile.features) {
    rows.push({
      section: "Feature",
      item: featureLabel(f.id),
      priority: PRIORITY_LABELS[f.priority] ?? f.priority,
      notes: f.source,
    });
  }
  for (const i of profile.integrations) {
    rows.push({
      section: "Integration",
      item: labelForOption(INTEGRATION_OPTIONS, i.id) || i.id,
      priority: PRIORITY_LABELS[i.priority] ?? i.priority,
      notes: "",
    });
  }

  rows.push({
    section: "Constraint",
    item: "Budget",
    priority: "",
    notes: labelForOption(BUDGET_OPTIONS, profile.budget.band) ?? "Unknown",
  });
  rows.push({
    section: "Constraint",
    item: "Billing",
    priority: "",
    notes: profile.budget.billingPreference ?? "Unknown",
  });
  rows.push({
    section: "Constraint",
    item: "Implementation",
    priority: "",
    notes:
      labelForOption(EASE_OPTIONS, profile.implementation.complexity) ??
      "Unknown",
  });
  rows.push({
    section: "Constraint",
    item: "Migration",
    priority: "",
    notes: profile.implementation.migrationComplexity ?? "Unknown",
  });

  return rows;
}

/** Excel-compatible SpreadsheetML (.xls) — opens in Excel / Google Sheets. */
export function profileToExcelXml(profile: CrmDecisionProfile): string {
  const rows = buildProfileExportRows(profile);
  const header = ["Section", "Item", "Priority", "Notes"];
  const xmlRows = [
    `<Row>${header.map((h) => `<Cell><Data ss:Type="String">${escapeXml(h)}</Data></Cell>`).join("")}</Row>`,
    ...rows.map(
      (r) =>
        `<Row>${[r.section, r.item, r.priority, r.notes]
          .map(
            (cell) =>
              `<Cell><Data ss:Type="String">${escapeXml(cell)}</Data></Cell>`,
          )
          .join("")}</Row>`,
    ),
  ].join("");

  const sheetName = isSiProfile(profile)
    ? "SI Requirements"
    : profile.categorySlug === "crm"
      ? "CRM Requirements"
      : `${profileTitleForExport(profile).replace(" Profile", "").slice(0, 31)}`;

  return `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Worksheet ss:Name="${sheetName}">
  <Table>
   ${xmlRows}
  </Table>
 </Worksheet>
</Workbook>`;
}

/** Print-optimized HTML report used for Download PDF (browser Save as PDF). */
export function profileToPdfHtml(profile: CrmDecisionProfile): string {
  const useCases = listSelectableUseCasesForProfile(profile);
  const caps = listSelectableCapabilitiesForProfile(profile);
  const completeness = buildProfileCompleteness(profile);
  const bc = profile.businessContext;
  const must = profile.requirements.filter((r) => r.priority === "must-have");
  const important = profile.requirements.filter(
    (r) => r.priority === "important",
  );
  const nice = profile.requirements.filter(
    (r) => r.priority === "nice-to-have",
  );
  const generated = new Date().toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const reqBlock = (title: string, items: typeof must) => {
    if (!items.length) return "";
    return `<h3>${escapeHtml(title)}</h3><ul>${items
      .map((r) => {
        const meta = resolveRequirementMetaForProfile(profile, r.id);
        return `<li>${escapeHtml(meta?.name ?? r.id)}${
          meta?.capabilityName
            ? ` <span class="muted">· ${escapeHtml(meta.capabilityName)}</span>`
            : ""
        }</li>`;
      })
      .join("")}</ul>`;
  };

  const featBlock = (title: string, priority: "must-have" | "important" | "nice-to-have") => {
    const items = profile.features.filter((f) => f.priority === priority);
    if (!items.length) return "";
    return `<h3>${escapeHtml(title)}</h3><ul>${items
      .map((f) => `<li>${escapeHtml(featureLabel(f.id))}</li>`)
      .join("")}</ul>`;
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${profileTitleForExport(profile)} — SoftwareGlimpse</title>
<style>
  :root { color-scheme: light; }
  * { box-sizing: border-box; }
  body {
    font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
    color: #0f172a;
    margin: 0;
    padding: 32px;
    line-height: 1.45;
  }
  .brand {
    display: flex; justify-content: space-between; align-items: flex-start;
    border-bottom: 3px solid #2563eb; padding-bottom: 16px; margin-bottom: 24px;
  }
  .brand h1 { margin: 4px 0 0; font-size: 24px; }
  .eyebrow { color: #2563eb; font-size: 11px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; }
  .muted { color: #64748b; font-size: 12px; }
  .kpis { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 20px 0 28px; }
  .kpi { border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px; background: #f8fafc; }
  .kpi strong { display: block; font-size: 22px; margin-top: 4px; }
  h2 { font-size: 14px; text-transform: uppercase; letter-spacing: .05em; color: #64748b; margin: 28px 0 10px; }
  h3 { font-size: 13px; margin: 14px 0 6px; color: #1e293b; }
  .card { border: 1px solid #e2e8f0; border-radius: 14px; padding: 16px 18px; margin-bottom: 14px; }
  .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 24px; }
  .label { font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: .04em; }
  .value { font-weight: 600; margin-top: 2px; }
  ul { margin: 0; padding-left: 18px; }
  li { margin: 4px 0; }
  .pill {
    display: inline-block; font-size: 11px; font-weight: 600; padding: 2px 8px;
    border-radius: 999px; background: #dbeafe; color: #1d4ed8; margin-right: 8px;
  }
  .pill.warn { background: #fef3c7; color: #b45309; }
  .pill.soft { background: #f1f5f9; color: #475569; }
  .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b; }
  @media print {
    body { padding: 12mm; }
    .no-print { display: none !important; }
    a { color: inherit; text-decoration: none; }
  }
</style>
</head>
<body>
  <div class="no-print" style="margin-bottom:16px;padding:12px 14px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;font-size:13px;">
    Use your browser’s print dialog and choose <strong>Save as PDF</strong> to download this report.
  </div>
  <div class="brand">
    <div>
      <div class="eyebrow">SoftwareGlimpse</div>
      <h1>${profileTitleForExport(profile)}</h1>
      <p class="muted">Generated ${escapeHtml(generated)} · Affiliate relationships do not influence this profile</p>
    </div>
  </div>

  <div class="kpis">
    <div class="kpi"><span class="label">Must have</span><strong>${must.length}</strong></div>
    <div class="kpi"><span class="label">Important</span><strong>${important.length}</strong></div>
    <div class="kpi"><span class="label">${usersLabelForProfile(profile)}</span><strong>${bc.crmUserCount ?? "—"}</strong></div>
    <div class="kpi"><span class="label">Budget</span><strong style="font-size:14px;margin-top:8px">${escapeHtml(
      labelForOption(BUDGET_OPTIONS, profile.budget.band) ?? "Unknown",
    )}</strong></div>
  </div>

  <div class="card">
    <h2 style="margin-top:0">Business context</h2>
    <div class="grid2">
      <div><div class="label">Industry</div><div class="value">${escapeHtml(industryLabel(bc.industrySlug))}</div></div>
      <div><div class="label">Company size</div><div class="value">${escapeHtml(labelForOption(COMPANY_SIZE_OPTIONS, bc.companySizeSlug) ?? "Unknown")}</div></div>
      <div><div class="label">Primary teams</div><div class="value">${escapeHtml(teamLabels(bc.teamIds, profile))}</div></div>
      <div><div class="label">Current state</div><div class="value">${escapeHtml(currentStateLabel(bc.currentState, profile))}</div></div>
    </div>
  </div>

  <div class="card">
    <h2 style="margin-top:0">Use cases</h2>
    ${
      profile.useCases.length
        ? profile.useCases
            .map((u) => {
              const name = useCases.find((x) => x.slug === u.id)?.name ?? u.id;
              const cls = u.priority === "primary" ? "pill" : u.priority === "important" ? "pill warn" : "pill soft";
              return `<div style="margin:6px 0"><span class="${cls}">${escapeHtml(PRIORITY_LABELS[u.priority] ?? u.priority)}</span>${escapeHtml(name)}</div>`;
            })
            .join("")
        : "<p class='muted'>None selected</p>"
    }
  </div>

  <div class="card">
    <h2 style="margin-top:0">Capabilities</h2>
    ${
      profile.capabilities.length
        ? profile.capabilities
            .map((c) => {
              const name = caps.find((x) => x.slug === c.id)?.name ?? c.id;
              const cls =
                c.priority === "critical"
                  ? "pill"
                  : c.priority === "high"
                    ? "pill warn"
                    : "pill soft";
              return `<div style="display:flex;justify-content:space-between;margin:6px 0;gap:12px"><span>${escapeHtml(name)}</span><span class="${cls}">${escapeHtml(PRIORITY_LABELS[c.priority] ?? c.priority)}</span></div>`;
            })
            .join("")
        : "<p class='muted'>None selected</p>"
    }
  </div>

  <div class="card">
    <h2 style="margin-top:0">Requirements</h2>
    ${reqBlock("Must have", must)}
    ${reqBlock("Important", important)}
    ${reqBlock("Nice to have", nice)}
  </div>

  <div class="card">
    <h2 style="margin-top:0">Feature requirements</h2>
    ${featBlock("Must have", "must-have")}
    ${featBlock("Important", "important")}
    ${featBlock("Nice to have", "nice-to-have")}
  </div>

  <div class="card">
    <h2 style="margin-top:0">Integrations</h2>
    ${
      profile.integrations.length
        ? `<ul>${profile.integrations
            .map(
              (i) =>
                `<li><strong>${escapeHtml(PRIORITY_LABELS[i.priority] ?? i.priority)}</strong> — ${escapeHtml(labelForOption(INTEGRATION_OPTIONS, i.id) || i.id)}</li>`,
            )
            .join("")}</ul>`
        : "<p class='muted'>None specified</p>"
    }
  </div>

  <div class="card">
    <h2 style="margin-top:0">Profile completeness</h2>
    <ul>
      ${completeness.sections
        .map(
          (s) =>
            `<li>${escapeHtml(s.label)} — ${escapeHtml(s.status.replace("-", " "))}</li>`,
        )
        .join("")}
    </ul>
  </div>

  <div class="footer">
    SoftwareGlimpse ${profileTitleForExport(profile).replace(' Profile', ' Builder')} · softwareglimpse.com<br />
    This profile does not recommend products. Use the matching Finder to match products to these requirements.
  </div>
  <script>
    window.addEventListener('load', function () {
      setTimeout(function () { window.print(); }, 250);
    });
  </script>
</body>
</html>`;
}

export function downloadBlob(
  contents: BlobPart,
  filename: string,
  mime: string,
): void {
  const blob = new Blob([contents], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Generate and download a real PDF file (not a print dialog).
 */
export async function downloadProfilePdf(
  profile: CrmDecisionProfile,
): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 48;
  const maxWidth = pageWidth - margin * 2;
  let y = margin;

  const ensureSpace = (needed: number) => {
    if (y + needed > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  };

  const writeWrapped = (
    text: string,
    options: {
      fontSize?: number;
      style?: "normal" | "bold";
      color?: [number, number, number];
      gapAfter?: number;
    } = {},
  ) => {
    const fontSize = options.fontSize ?? 11;
    const style = options.style ?? "normal";
    const color = options.color ?? ([15, 23, 42] as [number, number, number]);
    const gapAfter = options.gapAfter ?? 8;
    doc.setFont("helvetica", style);
    doc.setFontSize(fontSize);
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, maxWidth) as string[];
    ensureSpace(lines.length * (fontSize + 3) + gapAfter);
    doc.text(lines, margin, y);
    y += lines.length * (fontSize + 3) + gapAfter;
  };

  const sectionHeading = (title: string) => {
    ensureSpace(28);
    y += 6;
    writeWrapped(title.toUpperCase(), {
      fontSize: 10,
      style: "bold",
      color: [37, 99, 235],
      gapAfter: 10,
    });
  };

  const bullet = (text: string) => {
    writeWrapped(`•  ${text}`, { fontSize: 11, gapAfter: 4 });
  };

  const useCases = listSelectableUseCasesForProfile(profile);
  const caps = listSelectableCapabilitiesForProfile(profile);
  const bc = profile.businessContext;
  const generated = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  writeWrapped("SoftwareGlimpse", {
    fontSize: 10,
    style: "bold",
    color: [37, 99, 235],
    gapAfter: 4,
  });
  writeWrapped(profileTitleForExport(profile), {
    fontSize: 20,
    style: "bold",
    color: [15, 23, 42],
    gapAfter: 6,
  });
  writeWrapped(
    `Generated ${generated}  ·  Affiliate relationships do not influence this profile`,
    { fontSize: 9, color: [100, 116, 139], gapAfter: 16 },
  );

  // Accent line
  doc.setDrawColor(37, 99, 235);
  doc.setLineWidth(2);
  doc.line(margin, y, pageWidth - margin, y);
  y += 18;

  const must = profile.requirements.filter((r) => r.priority === "must-have");
  const important = profile.requirements.filter(
    (r) => r.priority === "important",
  );
  const nice = profile.requirements.filter((r) => r.priority === "nice-to-have");

  writeWrapped(
    `Must have: ${must.length}   ·   Important: ${important.length}   ·   Nice to have: ${nice.length}   ·   Users: ${bc.crmUserCount ?? "—"}   ·   Budget: ${labelForOption(BUDGET_OPTIONS, profile.budget.band) ?? "Unknown"}`,
    { fontSize: 10, color: [51, 65, 85], gapAfter: 14 },
  );

  sectionHeading("Business context");
  bullet(`Industry: ${industryLabel(bc.industrySlug)}`);
  bullet(
    `Company size: ${labelForOption(COMPANY_SIZE_OPTIONS, bc.companySizeSlug) ?? "Unknown"}`,
  );
  bullet(
    `${usersLabelForProfile(profile)}: ${bc.crmUserCount != null ? String(bc.crmUserCount) : "Unknown"}`,
  );
  bullet(`Primary teams: ${teamLabels(bc.teamIds, profile)}`);
  bullet(`Current state: ${currentStateLabel(bc.currentState, profile)}`);

  sectionHeading("Use cases");
  if (profile.useCases.length === 0) {
    bullet("None selected");
  } else {
    for (const u of profile.useCases) {
      const name = useCases.find((x) => x.slug === u.id)?.name ?? u.id;
      bullet(`[${PRIORITY_LABELS[u.priority] ?? u.priority}] ${name}`);
    }
  }

  sectionHeading("Capabilities");
  if (profile.capabilities.length === 0) {
    bullet("None selected");
  } else {
    for (const c of profile.capabilities) {
      const name = caps.find((x) => x.slug === c.id)?.name ?? c.id;
      bullet(`[${PRIORITY_LABELS[c.priority] ?? c.priority}] ${name}`);
    }
  }

  sectionHeading("Requirements");
  for (const [group, items] of [
    ["Must have", must],
    ["Important", important],
    ["Nice to have", nice],
  ] as const) {
    if (!items.length) continue;
    writeWrapped(group, { fontSize: 11, style: "bold", gapAfter: 4 });
    for (const r of items) {
      const meta = resolveRequirementMetaForProfile(profile, r.id);
      bullet(
        meta?.capabilityName
          ? `${meta.name} (${meta.capabilityName})`
          : (meta?.name ?? r.id),
      );
    }
  }

  sectionHeading("Feature requirements");
  for (const priority of ["must-have", "important", "nice-to-have"] as const) {
    const items = profile.features.filter((f) => f.priority === priority);
    if (!items.length) continue;
    writeWrapped(PRIORITY_LABELS[priority] ?? priority, {
      fontSize: 11,
      style: "bold",
      gapAfter: 4,
    });
    for (const f of items) {
      bullet(featureLabel(f.id));
    }
  }

  sectionHeading("Integrations");
  if (profile.integrations.length === 0) {
    bullet("None specified");
  } else {
    for (const i of profile.integrations) {
      bullet(
        `[${PRIORITY_LABELS[i.priority] ?? i.priority}] ${labelForOption(INTEGRATION_OPTIONS, i.id) || i.id}`,
      );
    }
  }

  sectionHeading("Constraints");
  bullet(
    `Budget: ${labelForOption(BUDGET_OPTIONS, profile.budget.band) ?? "Unknown"}`,
  );
  bullet(`Billing: ${profile.budget.billingPreference ?? "Unknown"}`);
  bullet(
    `Implementation: ${labelForOption(EASE_OPTIONS, profile.implementation.complexity) ?? "Unknown"}`,
  );
  bullet(
    `Migration: ${profile.implementation.migrationComplexity ?? "Unknown"}`,
  );

  const completeness = buildProfileCompleteness(profile);
  sectionHeading("Completeness");
  for (const s of completeness.sections) {
    bullet(`${s.label}: ${s.status.replace("-", " ")}`);
  }

  ensureSpace(40);
  y += 10;
  writeWrapped(
    `Generated by SoftwareGlimpse ${profileTitleForExport(profile).replace(' Profile', ' Builder')}. This profile does not recommend products.`,
    { fontSize: 9, color: [100, 116, 139], gapAfter: 0 },
  );

  const fileSlug =
    profile.categorySlug === "sales-intelligence"
      ? "si"
      : profile.categorySlug;
  doc.save(`${fileSlug}-requirements-profile.pdf`);
}

/** @deprecated Prefer downloadProfilePdf for a real .pdf file. */
export function openPdfPrintWindow(profile: CrmDecisionProfile): void {
  void downloadProfilePdf(profile);
}
