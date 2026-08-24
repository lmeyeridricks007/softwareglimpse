import { writeScheduledContentReport } from "@/services/publishing/launches";
import { validatePublicationDependencies } from "@/services/publishing/dependency-validation";
import { buildContentRegistry } from "@/services/publishing/registry";
import { getPublicationStateForEntry } from "@/services/publishing/resolver";
import path from "node:path";
import { mkdirSync, writeFileSync } from "node:fs";

const DOCS_ROOT = path.join(process.cwd(), "docs/publishing");

export type ScheduledAuditVerdict = "READY" | "READY_WITH_WARNINGS" | "BLOCKED";

export function runScheduledContentAudit(now = new Date()): {
  outputPath: string;
  verdict: ScheduledAuditVerdict;
  blocked: number;
  warnings: number;
} {
  mkdirSync(DOCS_ROOT, { recursive: true });
  const registry = buildContentRegistry();
  const scheduled = registry.filter(
    (e) => e.metadata.status === "scheduled",
  );
  const deps = validatePublicationDependencies(now);
  const depBySource = new Map(deps.map((d) => [d.sourceId, d]));

  let blocked = 0;
  let warnings = 0;
  const lines: string[] = [
    "# Scheduled content audit",
    "",
    `Generated: ${now.toISOString()}`,
    "",
  ];

  for (const entry of scheduled) {
    const state = getPublicationStateForEntry(entry, now);
    const dep = depBySource.get(entry.contentId);
    const issues: string[] = [];

    if (!entry.metadata.scheduledAt) issues.push("missing scheduledAt");
    if (!entry.seoIndexable) issues.push("seo not indexable");
    if (dep) issues.push(dep.message);

    let verdict: ScheduledAuditVerdict = "READY";
    if (issues.some((i) => i.includes("DEPENDENCY") || i.includes("missing scheduledAt"))) {
      verdict = "BLOCKED";
      blocked++;
    } else if (issues.length) {
      verdict = "READY_WITH_WARNINGS";
      warnings++;
    }

    lines.push(
      `## ${entry.title}`,
      "",
      `- Verdict: **${verdict}**`,
      `- Path: \`${entry.path}\``,
      `- Scheduled: ${entry.metadata.scheduledAt ?? "—"}`,
      `- Visible in listings (public): ${state.isVisibleInListings}`,
      issues.length ? `- Issues: ${issues.join("; ")}` : "- Issues: none",
      "",
    );
  }

  const overall: ScheduledAuditVerdict =
    blocked > 0 ? "BLOCKED" : warnings > 0 ? "READY_WITH_WARNINGS" : "READY";

  lines.splice(3, 0, `Overall: **${overall}**`, "");

  const outputPath = path.join(DOCS_ROOT, "SCHEDULED-CONTENT-AUDIT-LATEST.md");
  writeFileSync(outputPath, lines.join("\n"), "utf8");
  writeScheduledContentReport();

  return { outputPath, verdict: overall, blocked, warnings };
}
