/**
 * Optional REAL external evidence for Lane A (AI citations / backlinks).
 * Fixture/sample sources never contribute.
 */

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { classifyDataValidity, validityAllowsNorthStar } from "@/services/seo/growth-dashboard/validity";
import type { AiVisibilityReport } from "@/services/seo/ai-visibility/types";

export type ExternalEnrichmentEvidence = {
  /** Path → REAL AI citation count (FIXTURE excluded). */
  aiCitationsByPath: Map<string, number>;
  /** Path → known backlink / referring count when REAL export exists. */
  backlinksByPath: Map<string, number>;
  aiValidity: "REAL" | "PARTIAL" | "FIXTURE" | "NOT_CONNECTED" | "STALE";
  backlinkValidity: "REAL" | "PARTIAL" | "FIXTURE" | "NOT_CONNECTED" | "STALE";
};

function ensureSlash(p: string): string {
  if (!p.startsWith("/")) return `/${p}`;
  return p.endsWith("/") ? p : `${p}/`;
}

/**
 * Load path-level external evidence. Never fabricates demand.
 */
export function loadExternalEnrichmentEvidence(
  cwd: string = process.cwd(),
): ExternalEnrichmentEvidence {
  const aiCitationsByPath = new Map<string, number>();
  const backlinksByPath = new Map<string, number>();

  let aiValidity: ExternalEnrichmentEvidence["aiValidity"] = "NOT_CONNECTED";
  const aiFile = path.join(cwd, "data/seo/ai-visibility.json");
  if (existsSync(aiFile)) {
    try {
      const report = JSON.parse(readFileSync(aiFile, "utf8")) as AiVisibilityReport;
      const sourcePath = report.exportMeta?.sourcePath ?? null;
      aiValidity = classifyDataValidity({
        connected: Boolean(report.summary?.exportAvailable),
        sourcePath,
        generatedAt: report.generatedAt,
      });
      if (validityAllowsNorthStar(aiValidity)) {
        for (const page of report.analysis?.topCitedPages ?? []) {
          if (!page.path) continue;
          aiCitationsByPath.set(
            ensureSlash(page.path),
            (aiCitationsByPath.get(ensureSlash(page.path)) ?? 0) +
              (page.citationCount ?? 1),
          );
        }
        for (const obs of report.observations ?? []) {
          if (!obs.softwareGlimpseCited || !obs.citedPath) continue;
          const p = ensureSlash(obs.citedPath);
          aiCitationsByPath.set(p, (aiCitationsByPath.get(p) ?? 0) + 1);
        }
      }
    } catch {
      aiValidity = "NOT_CONNECTED";
    }
  }

  let backlinkValidity: ExternalEnrichmentEvidence["backlinkValidity"] =
    "NOT_CONNECTED";
  // Optional path-level backlink export (when present + REAL).
  const backlinkCandidates = [
    path.join(cwd, "data/seo/backlinks-by-path.json"),
    path.join(cwd, "data/seo/imports/backlinks-by-path.json"),
  ];
  for (const file of backlinkCandidates) {
    if (!existsSync(file)) continue;
    try {
      const raw = JSON.parse(readFileSync(file, "utf8")) as {
        synthetic?: boolean;
        meta?: { source?: string; sourcePath?: string };
        rows?: Array<{ path: string; referringDomains?: number; links?: number }>;
      };
      backlinkValidity = classifyDataValidity({
        connected: Boolean(raw.rows?.length),
        synthetic: raw.synthetic,
        sourcePath: raw.meta?.sourcePath ?? raw.meta?.source ?? file,
      });
      if (!validityAllowsNorthStar(backlinkValidity)) break;
      for (const row of raw.rows ?? []) {
        if (!row.path) continue;
        const n = row.referringDomains ?? row.links ?? 0;
        if (n <= 0) continue;
        backlinksByPath.set(ensureSlash(row.path), n);
      }
      break;
    } catch {
      backlinkValidity = "NOT_CONNECTED";
    }
  }

  return {
    aiCitationsByPath,
    backlinksByPath,
    aiValidity,
    backlinkValidity,
  };
}
