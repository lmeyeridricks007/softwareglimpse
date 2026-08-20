import fs from "node:fs";
import path from "node:path";
import { isGscConfigured } from "@/services/seo/providers/resolve";
import { listSnapshots, loadSnapshot } from "@/data/seo/store";
import { normalizeMigrationPath } from "../normalize";
import type {
  DataAvailabilityReport,
  LegacyUrlGscMetrics,
} from "./types";

export type PagePerfAggregate = {
  path: string;
  clicks: number;
  impressions: number;
  ctr: number | null;
  averagePosition: number | null;
  topQueries: Array<{ query: string; clicks: number; impressions: number }>;
  dateRange?: { startDate?: string; endDate?: string; rangeLabel?: string };
  source: "gsc" | "import" | "snapshot-store";
};

/**
 * Inspect which historical SEO data sources actually exist.
 * Does not invent metrics. Synthetic fixtures are never treated as live.
 */
export function inspectSeoDataAvailability(opts?: {
  importPath?: string;
}): DataAvailabilityReport {
  const notesGsc: string[] = [];
  let mode: DataAvailabilityReport["searchConsole"]["mode"] = "none";
  let live = false;
  let synthetic = false;
  let pageCount: number | undefined;
  let dateRange: DataAvailabilityReport["searchConsole"]["dateRange"];

  if (opts?.importPath) {
    if (fs.existsSync(opts.importPath)) {
      mode = "import";
      live = true;
      notesGsc.push(`Approved import path present: ${opts.importPath}`);
      try {
        const raw = JSON.parse(fs.readFileSync(opts.importPath, "utf8")) as {
          synthetic?: boolean;
          rows?: unknown[];
          meta?: { rangeLabel?: string; dataThroughDate?: string };
        };
        synthetic = Boolean(raw.synthetic);
        if (synthetic) {
          live = false;
          notesGsc.push(
            "Import file is labeled synthetic — will NOT be used as live SoftwareGlimpse GSC",
          );
        } else {
          pageCount = Array.isArray(raw.rows) ? raw.rows.length : undefined;
          dateRange = {
            rangeLabel: raw.meta?.rangeLabel,
            endDate: raw.meta?.dataThroughDate,
          };
        }
      } catch (e) {
        notesGsc.push(`Import file unreadable: ${String(e)}`);
        mode = "none";
        live = false;
      }
    } else {
      notesGsc.push(`Import path not found: ${opts.importPath}`);
    }
  }

  if (mode === "none") {
    const snapshots = listSnapshots().filter(
      (m) => m.source === "gsc" || m.source === "import",
    );
    const nonSynthetic = snapshots.filter((m) => {
      try {
        const snap = loadSnapshot(m.id);
        return snap && !snap.synthetic;
      } catch {
        return false;
      }
    });
    if (nonSynthetic.length > 0) {
      mode = "snapshot-store";
      live = true;
      notesGsc.push(
        `Found ${nonSynthetic.length} non-synthetic snapshot(s) in SEO store`,
      );
      const latest = nonSynthetic.sort((a, b) =>
        b.dataThroughDate.localeCompare(a.dataThroughDate),
      )[0]!;
      dateRange = {
        rangeLabel: latest.rangeLabel,
        endDate: latest.dataThroughDate,
      };
    } else {
      notesGsc.push("No non-synthetic GSC/import snapshot in SEO store");
    }
  }

  if (mode === "none") {
    if (isGscConfigured()) {
      notesGsc.push(
        "GSC env vars present but live googleapis client is not implemented — use --import with an approved export",
      );
      mode = "gsc";
      live = false;
    } else {
      notesGsc.push(
        "GSC not configured (GSC_PROPERTY_URL + GSC_CLIENT_EMAIL / GOOGLE_APPLICATION_CREDENTIALS)",
      );
    }
    notesGsc.push(
      "Latest search-performance report: sourceMode=none, live=false (see docs/site-intelligence/SEARCH-PERFORMANCE-LATEST.md)",
    );
    notesGsc.push(
      "Synthetic fixtures under src/data/seo/fixtures/ are excluded from migration priority",
    );
  }

  return {
    inspectedAt: new Date().toISOString(),
    searchConsole: {
      available: live && !synthetic && mode !== "none" && mode !== "fixture",
      mode,
      live,
      synthetic,
      notes: notesGsc,
      dateRange,
      pageCount,
    },
    analytics: {
      available: false,
      notes: [
        "No Google Analytics / GA4 historical export found in repository",
        "Analytics layer is a forward event bus only (docs/softwareglimpse/analytics.md) — no organic session history for legacy URLs",
        "No affiliate-click or download aggregates keyed to legacy WordPress paths",
      ],
    },
    backlinks: {
      available: false,
      notes: [
        "No live backlink index provider wired (authority-limitations-bridge)",
        "EarnedBacklinkOpportunityAgent discovers outbound opportunities — not inbound referring-domain counts per legacy URL",
        "Do not invent referring-domain / DA / DR figures",
      ],
    },
    proxySignals: {
      available: true,
      notes: [
        "URL mapping plan (commercial intent, relationship, recommended action)",
        "Content-graph role (product / comparison / best / guide / cluster)",
        "New-site internal-link inbound counts for mapped destinations (not legacy WP inbound)",
      ],
    },
  };
}

function pathKeyFromPageUrl(page: string): string {
  try {
    if (page.startsWith("http")) {
      return normalizeMigrationPath(new URL(page).pathname);
    }
  } catch {
    // fall through
  }
  return normalizeMigrationPath(page);
}

/**
 * Load per-path GSC aggregates from an approved import or non-synthetic store snapshot.
 * Returns empty map when no live/import data exists. Never loads synthetic fixtures.
 */
export function loadLivePagePerformance(opts?: {
  importPath?: string;
}): Map<string, PagePerfAggregate> {
  const availability = inspectSeoDataAvailability(opts);
  const out = new Map<string, PagePerfAggregate>();

  if (!availability.searchConsole.available) {
    return out;
  }

  type Row = {
    page?: string;
    query?: string;
    clicks?: number;
    impressions?: number;
    ctr?: number;
    position?: number;
  };

  let rows: Row[] = [];
  let source: PagePerfAggregate["source"] = "import";
  let dateRange = availability.searchConsole.dateRange;

  if (opts?.importPath && fs.existsSync(opts.importPath)) {
    const raw = JSON.parse(fs.readFileSync(opts.importPath, "utf8")) as {
      synthetic?: boolean;
      rows?: Row[];
      meta?: { rangeLabel?: string; dataThroughDate?: string };
    };
    if (raw.synthetic) return out;
    rows = raw.rows ?? [];
    source = "import";
    dateRange = {
      rangeLabel: raw.meta?.rangeLabel,
      endDate: raw.meta?.dataThroughDate,
    };
  } else {
    const snapshots = listSnapshots().filter(
      (m) => m.source === "gsc" || m.source === "import",
    );
    for (const meta of snapshots.sort((a, b) =>
      b.dataThroughDate.localeCompare(a.dataThroughDate),
    )) {
      const snap = loadSnapshot(meta.id);
      if (!snap || snap.synthetic) continue;
      rows = snap.rows as Row[];
      source = meta.source === "gsc" ? "gsc" : "snapshot-store";
      dateRange = {
        rangeLabel: meta.rangeLabel,
        endDate: meta.dataThroughDate,
      };
      break;
    }
  }

  type Acc = {
    clicks: number;
    impressions: number;
    positionWeighted: number;
    queries: Map<string, { clicks: number; impressions: number }>;
  };
  const byPath = new Map<string, Acc>();

  for (const row of rows) {
    if (!row.page) continue;
    const p = pathKeyFromPageUrl(row.page);
    const acc = byPath.get(p) ?? {
      clicks: 0,
      impressions: 0,
      positionWeighted: 0,
      queries: new Map(),
    };
    const clicks = Number(row.clicks ?? 0);
    const impressions = Number(row.impressions ?? 0);
    acc.clicks += clicks;
    acc.impressions += impressions;
    if (typeof row.position === "number" && impressions > 0) {
      acc.positionWeighted += row.position * impressions;
    }
    if (row.query) {
      const q = acc.queries.get(row.query) ?? { clicks: 0, impressions: 0 };
      q.clicks += clicks;
      q.impressions += impressions;
      acc.queries.set(row.query, q);
    }
    byPath.set(p, acc);
  }

  for (const [p, acc] of byPath) {
    const ctr =
      acc.impressions > 0 ? acc.clicks / acc.impressions : null;
    const averagePosition =
      acc.impressions > 0 ? acc.positionWeighted / acc.impressions : null;
    const topQueries = [...acc.queries.entries()]
      .map(([query, v]) => ({
        query,
        clicks: v.clicks,
        impressions: v.impressions,
      }))
      .sort(
        (a, b) =>
          b.clicks - a.clicks || b.impressions - a.impressions,
      )
      .slice(0, 5);
    out.set(p, {
      path: p,
      clicks: acc.clicks,
      impressions: acc.impressions,
      ctr,
      averagePosition,
      topQueries,
      dateRange,
      source,
    });
  }

  return out;
}

export function toGscMetrics(
  agg: PagePerfAggregate | undefined,
): LegacyUrlGscMetrics | null {
  if (!agg) return null;
  return {
    clicks: agg.clicks,
    impressions: agg.impressions,
    ctr: agg.ctr,
    averagePosition: agg.averagePosition,
    topQueries: agg.topQueries,
    dateRange: agg.dateRange,
    source: agg.source,
  };
}

/** Optional path for approved GSC import used by migration enrichment. */
export function defaultMigrationGscImportPath(): string | undefined {
  const candidates = [
    path.join(process.cwd(), "docs/migration/data/gsc-export.json"),
    path.join(process.cwd(), "src/data/seo/imports/gsc-export.json"),
    process.env.SG_MIGRATION_GSC_IMPORT,
  ].filter(Boolean) as string[];
  return candidates.find((p) => fs.existsSync(p));
}
