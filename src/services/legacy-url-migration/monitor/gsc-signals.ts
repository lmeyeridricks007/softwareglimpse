import fs from "node:fs";
import path from "node:path";
import { inspectSeoDataAvailability } from "../seo-priority/availability";
import { normalizeMigrationPath } from "../normalize";
import { loadLegacyRedirectsFile } from "../redirect-plan/load-redirects";
import { stableMigIssueId } from "./stable-ids";
import type { MonitorGscSection } from "./types";
import type { MonitorIssue } from "./types";

type Draft = Omit<MonitorIssue, "state" | "firstSeenAt" | "lastSeenAt">;

type CoverageFile = {
  synthetic?: boolean;
  latestTotals?: {
    date?: string;
    notIndexed?: number | null;
    indexed?: number | null;
    impressions?: number | null;
  };
  criticalIssues?: Array<{
    reason: string;
    source?: string;
    validation?: string;
    pages: number;
  }>;
  notes?: string[];
};

/**
 * Surface Search Console–related migration signals when real data exists.
 * Does not invent metrics. Does not treat warnings as confirmed failures.
 */
export function collectGscMonitorSignals(opts?: {
  importPath?: string;
  coveragePath?: string;
}): { gsc: MonitorGscSection; drafts: Draft[] } {
  const defaultImport = path.join(
    process.cwd(),
    "docs/migration/data/gsc-export.json",
  );
  const defaultCoverage = path.join(
    process.cwd(),
    "docs/migration/data/gsc-coverage.json",
  );
  const importPath =
    opts?.importPath ??
    (fs.existsSync(defaultImport) ? defaultImport : undefined);
  const coveragePath =
    opts?.coveragePath ??
    (fs.existsSync(defaultCoverage) ? defaultCoverage : undefined);

  const availability = inspectSeoDataAvailability({ importPath });
  const drafts: Draft[] = [];
  const signals: MonitorGscSection["signals"] = [];

  const notes = [
    ...availability.searchConsole.notes,
    "Do not interpret Search Console coverage warnings without crawl/context review.",
  ];

  // Coverage export (aggregate reasons — caution signals only)
  if (coveragePath && fs.existsSync(coveragePath)) {
    try {
      const coverage = JSON.parse(
        fs.readFileSync(coveragePath, "utf8"),
      ) as CoverageFile;
      if (coverage.synthetic) {
        notes.push("gsc-coverage.json is synthetic — ignored");
      } else {
        notes.push(`Loaded coverage import: ${coveragePath}`);
        if (coverage.latestTotals) {
          const t = coverage.latestTotals;
          signals.push({
            id: "MIG-GSC-INDEX-TOTALS",
            label: "Indexed vs not-indexed totals (aggregate)",
            detail: `As of ${t.date ?? "n/a"}: indexed=${t.indexed ?? "n/a"}, notIndexed=${t.notIndexed ?? "n/a"}, impressions=${t.impressions ?? "n/a"} — WordPress-era crawl inventory; re-check after Next.js launch.`,
            interpretWithCaution: true,
          });
        }
        for (const issue of coverage.criticalIssues ?? []) {
          const reason = issue.reason;
          const watch =
            /not found|404|redirect|canonical|duplicate|noindex/i.test(reason);
          if (!watch) continue;
          signals.push({
            id: stableMigIssueId("GSC", reason, `coverage-${issue.pages}`),
            label: `Coverage: ${reason}`,
            detail: `${issue.pages} page(s) — source=${issue.source ?? "n/a"}; validation=${issue.validation ?? "n/a"}. Aggregate only; inspect URL examples in GSC before changing redirects.`,
            interpretWithCaution: true,
          });
          drafts.push({
            id: stableMigIssueId("GSC", reason, `coverage-${issue.pages}`),
            kind: "GSC",
            severity: /not found|404/i.test(reason) ? "P1" : "P2",
            subject: reason,
            problem: `GSC coverage reports “${reason}” (${issue.pages} pages)`,
            evidence: `source=${issue.source}; validation=${issue.validation}`,
            recommendedAction:
              "Open GSC Coverage URL examples; map 404s/redirects to approved migration plan — do not bulk-fix from counts alone",
            important: /not found|404|redirect/i.test(reason),
          });
        }
        for (const n of coverage.notes ?? []) notes.push(n);
      }
    } catch (e) {
      notes.push(`Coverage import unreadable: ${String(e)}`);
    }
  }

  if (!availability.searchConsole.available || availability.searchConsole.synthetic) {
    if (signals.length === 0 && drafts.length === 0) {
      return {
        gsc: {
          available: false,
          mode: availability.searchConsole.mode,
          notes: [
            ...notes,
            "GSC performance not available for migration monitor — static redirect/inventory checks only.",
          ],
          signals: [],
        },
        drafts: [],
      };
    }
    return {
      gsc: {
        available: Boolean(signals.length || drafts.length),
        mode: availability.searchConsole.available
          ? availability.searchConsole.mode
          : "coverage-import",
        notes,
        signals,
      },
      drafts,
    };
  }

  let redirectSources = new Set<string>();
  try {
    const file = loadLegacyRedirectsFile();
    redirectSources = new Set(
      file.redirects.map((r) => normalizeMigrationPath(r.source)),
    );
  } catch {
    /* empty */
  }

  const candidatePaths: string[] = [];
  if (importPath && fs.existsSync(importPath)) {
    try {
      const raw = JSON.parse(fs.readFileSync(importPath, "utf8")) as {
        synthetic?: boolean;
        rows?: Array<{
          page?: string;
          url?: string;
          clicks?: number;
          impressions?: number;
        }>;
      };
      if (!raw.synthetic && Array.isArray(raw.rows)) {
        for (const row of raw.rows) {
          const page = row.page ?? row.url;
          if (!page) continue;
          try {
            const p = normalizeMigrationPath(
              page.startsWith("http") ? new URL(page).pathname : page,
            );
            candidatePaths.push(p);
            if (redirectSources.has(p) && (row.impressions ?? 0) > 0) {
              signals.push({
                id: stableMigIssueId("GSC", p, "legacy-impressions"),
                label: "Legacy URL still receiving impressions (import)",
                detail: `${p} impressions=${row.impressions ?? "n/a"} clicks=${row.clicks ?? "n/a"} — verify redirect live + GSC “Page with redirect” after launch`,
                interpretWithCaution: true,
              });
              drafts.push({
                id: stableMigIssueId("GSC", p, "legacy-impressions"),
                kind: "GSC",
                severity: "P2",
                subject: p,
                problem:
                  "Imported GSC data still shows impressions on a redirect source path",
                evidence: `impressions=${row.impressions}; clicks=${row.clicks}`,
                recommendedAction:
                  "After launch, confirm 301 in GSC URL inspection; do not treat alone as failure",
                important: true,
              });
            }
          } catch {
            /* skip */
          }
        }
      }
    } catch (e) {
      notes.push(`GSC import unreadable: ${String(e)}`);
    }
  }

  signals.push({
    id: "MIG-GSC-CONTEXT",
    label: "GSC monitoring checklist (manual)",
    detail:
      "Watch Not found (404), Page with redirect, Duplicate without user-selected canonical, Indexed legacy URLs, new target indexing, and traffic deltas — with path context.",
    interpretWithCaution: true,
  });

  if (candidatePaths.length) {
    notes.push(
      `Scanned ${candidatePaths.length} imported page row(s) for legacy redirect-source overlap.`,
    );
  }

  return {
    gsc: {
      available: true,
      mode: availability.searchConsole.mode,
      notes,
      signals,
    },
    drafts,
  };
}
