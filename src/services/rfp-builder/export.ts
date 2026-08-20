import type { CrmRfpSession } from "@/domain";
import { buildRfpMarkdown, buildRfpPlainText } from "./export-md";

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
  options?: { vendorName?: string; filename?: string },
): Promise<void> {
  const mod = await import("./export-pdf");
  return mod.downloadRfpPdf(session, options);
}

export async function downloadRfpExcel(
  session: CrmRfpSession,
  options?: { vendorName?: string; filename?: string },
): Promise<void> {
  const mod = await import("./export-xlsx");
  return mod.downloadRfpExcel(session, options);
}

export function downloadRfpMarkdown(
  session: CrmRfpSession,
  options: { vendorName?: string } = {},
): void {
  const md = buildRfpMarkdown(session, options);
  const mode = session.mode ?? "vendor-brief";
  const base = mode === "formal-rfp" ? "crm-rfp" : "crm-vendor-brief";
  const vendorPart = options.vendorName
    ? `-${options.vendorName.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`
    : "";
  downloadBlob(
    new Blob([md], { type: "text/markdown;charset=utf-8" }),
    `${base}${vendorPart}-v${session.versionMeta.version}.md`,
  );
}

export async function downloadVendorPackages(
  session: CrmRfpSession,
  vendorNames: string[],
): Promise<void> {
  const names =
    vendorNames.filter((n) => n.trim()).length > 0
      ? vendorNames.filter((n) => n.trim())
      : [""];
  for (const name of names) {
    await downloadRfpPdf(session, { vendorName: name || undefined });
    await downloadRfpExcel(session, { vendorName: name || undefined });
  }
}

export { buildRfpMarkdown, buildRfpPlainText };
