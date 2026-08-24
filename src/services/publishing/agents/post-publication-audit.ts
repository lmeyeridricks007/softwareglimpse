import path from "node:path";
import { mkdirSync, writeFileSync } from "node:fs";
import { buildContentRegistry } from "@/services/publishing/registry";
import { getPublicationStateForEntry } from "@/services/publishing/resolver";
import { isEntityIndexable } from "@/domain/quality-gates";
import {
  getAllAlternativesUnfiltered,
  getAllBestPagesUnfiltered,
  getAllComparisonsUnfiltered,
  getAllSoftwareUnfiltered,
} from "@/data";
import { getAllGuidesUnfiltered } from "@/data/repositories/guides";

const DOCS_ROOT = path.join(process.cwd(), "docs/publishing");

/**
 * Audit content that became live recently (last 48h by publishedAt).
 */
export function runPostPublicationAudit(now = new Date()): string {
  mkdirSync(DOCS_ROOT, { recursive: true });
  const windowMs = 48 * 60 * 60 * 1000;
  const registry = buildContentRegistry();
  const recent = registry.filter((entry) => {
    const publishedAt = entry.metadata.publishedAt;
    if (!publishedAt) return false;
    const ts = Date.parse(publishedAt);
    return !Number.isNaN(ts) && ts >= now.getTime() - windowMs && ts <= now.getTime();
  });

  const lines: string[] = [
    "# Post-publication audit",
    "",
    `Generated: ${now.toISOString()}`,
    "",
  ];

  if (!recent.length) {
    lines.push("_No content published in the last 48 hours._", "");
  }

  for (const entry of recent) {
    const state = getPublicationStateForEntry(entry, now);
    const checks: string[] = [];

    if (!state.isVisibleInListings) checks.push("not visible in listings");
    if (!state.isIndexable && entry.seoIndexable) {
      checks.push("expected indexable but gate failed");
    }

    lines.push(
      `## ${entry.title}`,
      "",
      `- Path: \`${entry.path}\``,
      `- Published: ${entry.metadata.publishedAt}`,
      checks.length
        ? `- **Issues:** ${checks.join("; ")}`
        : "- Status: PASS",
      "",
    );
  }

  // Spot-check entity indexability for software published recently
  for (const software of getAllSoftwareUnfiltered()) {
    if (software.metadata.status !== "published") continue;
    const publishedAt = software.metadata.publishedAt;
    if (!publishedAt) continue;
    const ts = Date.parse(publishedAt);
    if (Number.isNaN(ts) || ts < now.getTime() - windowMs) continue;
    if (!isEntityIndexable({ kind: "software", entity: software }, now)) {
      lines.push(
        `- Software \`${software.slug}\` published recently but not indexable`,
      );
    }
  }

  void getAllComparisonsUnfiltered;
  void getAllAlternativesUnfiltered;
  void getAllBestPagesUnfiltered;
  void getAllGuidesUnfiltered;

  const outputPath = path.join(DOCS_ROOT, "POST-PUBLICATION-AUDIT-LATEST.md");
  writeFileSync(outputPath, lines.join("\n"), "utf8");
  return outputPath;
}
