/**
 * Load opportunity scores from the last real GSC Opportunity Engine run.
 * Never invents rows; returns empty when the report is missing or synthetic.
 */

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import type { GscOpportunityReport } from "./types";
import { ensureSlashPath } from "./estate";

export type GscOpportunityPathSignal = {
  path: string;
  impressions: number;
  clicks: number;
  position: number | null;
  opportunityScore: number;
  queueBucket: string | null;
  queries: string[];
  lifecycleState: string | null;
  /** True when target query came from DIRECT_GSC / HIGH evidenced mapping. */
  hasDirectQuery: boolean;
};

function reportPaths(cwd: string): string[] {
  return [
    path.join(cwd, "data/seo/gsc-opportunities.json"),
    path.join(cwd, "src/data/seo/gsc-opportunities.json"),
  ];
}

export function loadGscOpportunityReport(
  cwd: string = process.cwd(),
): GscOpportunityReport | null {
  for (const file of reportPaths(cwd)) {
    if (!existsSync(file)) continue;
    try {
      const raw = JSON.parse(readFileSync(file, "utf8")) as GscOpportunityReport & {
        provenance?: { synthetic?: boolean };
      };
      // Production reports always set synthetic:false; skip fixture payloads.
      if ((raw as { provenance?: { synthetic?: boolean } }).provenance?.synthetic) {
        continue;
      }
      if (!raw.allRanked?.length && !raw.top20?.length) continue;
      return raw;
    } catch {
      // try next
    }
  }
  return null;
}

/** Path → signal map for enrichment / prioritization consumers. */
export function loadGscOpportunitySignalsByPath(
  cwd: string = process.cwd(),
): Map<string, GscOpportunityPathSignal> {
  const report = loadGscOpportunityReport(cwd);
  const map = new Map<string, GscOpportunityPathSignal>();
  if (!report) return map;

  for (const row of report.allRanked ?? report.top100 ?? []) {
    const p = ensureSlashPath(row.path);
    const trusted =
      row.actionConfidence === "EVIDENCED" ||
      row.actionConfidence === "REVIEW_REQUIRED";
    map.set(p, {
      path: p,
      impressions: row.impressions,
      clicks: row.clicks ?? 0,
      position: row.avgPosition ?? null,
      opportunityScore: row.opportunityScore,
      queueBucket: row.queueBucket ?? null,
      queries: trusted
        ? [row.targetQuery ?? row.primaryQuery, ...(row.secondaryQueries ?? [])].filter(
            (q): q is string => Boolean(q),
          )
        : [],
      lifecycleState: row.lifecycleState ?? null,
      hasDirectQuery:
        row.queryProvenance === "DIRECT_GSC" ||
        row.queryProvenance === "HISTORICAL_DIRECT_GSC",
    });
  }
  return map;
}
