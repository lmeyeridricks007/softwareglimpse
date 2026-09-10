import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { analyzeAiVisibility } from "./analyze";
import {
  discoverLatestAiVisibilityExport,
  ensureAiVisibilityImportDirs,
  loadAiVisibilityExport,
} from "./ingest";
import { formatAiVisibilityMarkdown } from "./report";
import type { AiVisibilityReport } from "./types";

export type AnalyzeAiVisibilityOptions = {
  exportPath?: string;
  cwd?: string;
  write?: boolean;
  outJson?: string;
  outMd?: string;
};

/**
 * Import → analyze → dual-write AI visibility report.
 */
export function runAiVisibilityAnalysis(
  opts: AnalyzeAiVisibilityOptions = {},
): AiVisibilityReport {
  const cwd = opts.cwd ?? process.cwd();
  ensureAiVisibilityImportDirs(cwd);

  const exportData = opts.exportPath
    ? loadAiVisibilityExport(
        path.isAbsolute(opts.exportPath)
          ? opts.exportPath
          : path.join(cwd, opts.exportPath),
      )
    : discoverLatestAiVisibilityExport(cwd);

  const report = analyzeAiVisibility(exportData, { cwd });

  if (opts.write !== false) {
    const jsonPath =
      opts.outJson ?? path.join(cwd, "data/seo/ai-visibility.json");
    const mdPath = opts.outMd ?? path.join(cwd, "docs/seo/AI-VISIBILITY.md");
    mkdirSync(path.dirname(jsonPath), { recursive: true });
    mkdirSync(path.dirname(mdPath), { recursive: true });
    writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
    writeFileSync(mdPath, formatAiVisibilityMarkdown(report), "utf8");
  }

  return report;
}
