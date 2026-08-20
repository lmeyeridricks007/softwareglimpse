/** Shared helpers for readiness export filenames / downloads. */

import type { CrmReadinessSession } from "@/domain";

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40) || "project"
  );
}

export function readinessExportBasename(
  session: CrmReadinessSession,
  productLabel?: string,
): string {
  const prefix = productLabel
    ? `${productLabel.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-readiness`
    : "crm-readiness";
  const project = session.context.projectName || prefix;
  return `${prefix}-${slugify(project)}-v1`;
}
