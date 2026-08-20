import fs from "node:fs";
import path from "node:path";
import {
  loadFixtureSnapshot,
  loadLatestSnapshot,
  loadPreviousSnapshot,
  saveSnapshot,
} from "@/data/seo/store";
import type { DateRange, SearchSnapshot } from "@/domain";
import { resolveSearchPerformanceProvider } from "@/services/seo/providers/resolve";
import { analyzeSearchPerformance } from "./analyze";
import { formatSearchPerformanceMarkdown } from "./report";
import type { SearchPerformanceReport } from "./types";

export const SEARCH_PERFORMANCE_AGENT = {
  id: "search-performance-agent",
  name: "SearchPerformanceAgent",
  version: "1.0.0",
  mutatesProduction: false as const,
};

const OUT_DIR = path.join(process.cwd(), "docs", "site-intelligence");
const LATEST_PATH = path.join(OUT_DIR, "SEARCH-PERFORMANCE-LATEST.md");
const JSON_PATH = path.join(OUT_DIR, "search-performance-latest.json");
const VISIBILITY_PATH = path.join(
  OUT_DIR,
  "search-visibility-metrics-latest.json",
);
const ARCHIVE_DIR = path.join(OUT_DIR, "archive");

export type SearchPerformanceAgentOptions = {
  write?: boolean;
  archive?: boolean;
  fixture?: boolean | string;
  importPath?: string;
  /** Prefer reading existing snapshot store over re-querying. */
  fromStore?: boolean;
  generatedAt?: string;
  range?: DateRange;
};

function defaultRange(): DateRange {
  const end = new Date();
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - 28);
  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  };
}

export async function runSearchPerformanceAgent(
  opts: SearchPerformanceAgentOptions = {},
): Promise<{
  agent: typeof SEARCH_PERFORMANCE_AGENT;
  generatedAt: string;
  report: SearchPerformanceReport;
  markdown: string;
  paths: {
    latest?: string;
    json?: string;
    visibility?: string;
    archive?: string;
  };
}> {
  const generatedAt = opts.generatedAt ?? new Date().toISOString();
  const write = opts.write !== false;
  const notes: string[] = [];
  let current: SearchSnapshot | null = null;
  let previous: SearchSnapshot | null = null;
  let sourceMode: SearchPerformanceReport["sourceMode"] = "none";

  const preferStore =
    opts.fromStore !== false && !opts.importPath && !opts.fixture;

  if (preferStore) {
    current = loadLatestSnapshot({ preferLive: true });
    if (current) {
      sourceMode = "snapshot-store";
      notes.push(`Loaded live/import snapshot from store: ${current.meta.id}`);
      previous = loadPreviousSnapshot(current, { preferLive: true });
    } else {
      // Fall back to any snapshot including synthetic for local demos only when --fixture
      notes.push("No live/import snapshot in store");
    }
  }

  if (!current && (opts.fixture || opts.importPath)) {
    const resolved = resolveSearchPerformanceProvider({
      fixture: opts.fixture,
      importPath: opts.importPath,
      preferGsc: false,
    });
    sourceMode = resolved.mode;
    notes.push(...resolved.notes);
    const range = opts.range ?? defaultRange();
    try {
      const result = await resolved.provider.queryPerformance({
        range,
        rangeLabel: resolved.mode === "fixture" ? "28d-current" : "import",
      });
      current = {
        meta: result.meta,
        rows: result.rows,
        synthetic: resolved.mode === "fixture",
        label:
          resolved.mode === "fixture"
            ? "SYNTHETIC — not live SoftwareGlimpse GSC data"
            : "Imported Search Console–shaped snapshot",
      };
      if (write && opts.importPath) {
        saveSnapshot(current);
        notes.push("Import saved to src/data/seo/snapshots for Site Intelligence reuse");
      }
      if (resolved.mode === "fixture") {
        try {
          previous = loadFixtureSnapshot("synthetic-28d-previous.json");
        } catch {
          previous = null;
        }
      }
    } catch (err) {
      notes.push(err instanceof Error ? err.message : String(err));
    }
  }

  // Optional: try GSC when explicitly not fixture/import and store empty
  if (!current && !opts.fixture && !opts.importPath) {
    const resolved = resolveSearchPerformanceProvider({ preferGsc: true });
    if (resolved.mode === "gsc") {
      sourceMode = "gsc";
      notes.push(...resolved.notes);
      try {
        const range = opts.range ?? defaultRange();
        const result = await resolved.provider.queryPerformance({
          range,
          rangeLabel: "28d-current",
        });
        current = {
          meta: result.meta,
          rows: result.rows,
          synthetic: false,
        };
        saveSnapshot(current);
      } catch (err) {
        notes.push(err instanceof Error ? err.message : String(err));
        // Last resort: labeled fixture for offline report structure
        if (process.env.SG_SEARCH_PERF_ALLOW_FIXTURE_FALLBACK === "1") {
          current = loadFixtureSnapshot("synthetic-28d-current.json");
          previous = loadFixtureSnapshot("synthetic-28d-previous.json");
          sourceMode = "fixture";
          notes.push("Fell back to synthetic fixture (SG_SEARCH_PERF_ALLOW_FIXTURE_FALLBACK=1)");
        }
      }
    } else {
      notes.push(...resolved.notes);
    }
  }

  const report = analyzeSearchPerformance({
    generatedAt,
    sourceMode,
    current,
    previous,
    notes,
  });
  const markdown = formatSearchPerformanceMarkdown(report);
  const paths: {
    latest?: string;
    json?: string;
    visibility?: string;
    archive?: string;
  } = {};

  if (write) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
    fs.writeFileSync(LATEST_PATH, markdown, "utf8");
    paths.latest = path.relative(process.cwd(), LATEST_PATH);

    fs.writeFileSync(JSON_PATH, JSON.stringify(report, null, 2), "utf8");
    paths.json = path.relative(process.cwd(), JSON_PATH);

    if (report.visibilityMetrics) {
      fs.writeFileSync(
        VISIBILITY_PATH,
        JSON.stringify(
          {
            generatedAt,
            live: report.live,
            synthetic: report.synthetic,
            metrics: report.visibilityMetrics,
          },
          null,
          2,
        ),
        "utf8",
      );
      paths.visibility = path.relative(process.cwd(), VISIBILITY_PATH);
    }

    if (opts.archive !== false) {
      const day = generatedAt.slice(0, 10);
      const archivePath = path.join(
        ARCHIVE_DIR,
        `${day}-search-performance.md`,
      );
      fs.mkdirSync(ARCHIVE_DIR, { recursive: true });
      fs.writeFileSync(archivePath, markdown, "utf8");
      paths.archive = path.relative(process.cwd(), archivePath);
    }
  }

  return {
    agent: SEARCH_PERFORMANCE_AGENT,
    generatedAt,
    report,
    markdown,
    paths,
  };
}

export function loadSearchVisibilityMetricsFile(): {
  live: boolean;
  synthetic: boolean;
  metrics: import("@/domain/schemas/site-intelligence").SearchVisibilityMetricsInput;
} | null {
  if (!fs.existsSync(VISIBILITY_PATH)) return null;
  try {
    const raw = JSON.parse(fs.readFileSync(VISIBILITY_PATH, "utf8")) as {
      live?: boolean;
      synthetic?: boolean;
      metrics?: import("@/domain/schemas/site-intelligence").SearchVisibilityMetricsInput;
    };
    if (!raw.metrics) return null;
    return {
      live: Boolean(raw.live),
      synthetic: Boolean(raw.synthetic),
      metrics: raw.metrics,
    };
  } catch {
    return null;
  }
}
