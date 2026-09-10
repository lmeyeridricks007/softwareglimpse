import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import type { AiVisibilityReport } from "./types";

/**
 * Load AI visibility summary for Organic Growth / opportunity queues.
 * Returns null when no report exists — never invents citations.
 */
export function loadAiVisibilitySummary(cwd = process.cwd()): {
  generatedAt: string;
  totalCitations: number;
  uniqueCitedPages: number;
  topPlatform: string | null;
  platformCount: number;
  newCitationCount: number;
  lostCitationCount: number;
  exportAvailable: boolean;
  topCitedPaths: string[];
} | null {
  const file = path.join(cwd, "data/seo/ai-visibility.json");
  if (!existsSync(file)) return null;
  try {
    const report = JSON.parse(readFileSync(file, "utf8")) as AiVisibilityReport;
    return {
      generatedAt: report.generatedAt,
      totalCitations: report.summary.totalCitations,
      uniqueCitedPages: report.summary.uniqueCitedPages,
      topPlatform: report.summary.topPlatform,
      platformCount: report.summary.platformCount,
      newCitationCount: report.summary.newCitationCount,
      lostCitationCount: report.summary.lostCitationCount,
      exportAvailable: report.summary.exportAvailable,
      topCitedPaths: report.analysis.topCitedPages.slice(0, 10).map((p) => p.path),
    };
  } catch {
    return null;
  }
}
