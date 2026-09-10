import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import {
  SearchPerformanceRowSchema,
  type SearchPerformanceRow,
} from "@/domain";
import { normalizePagePath } from "../url-resolver";

export type GscExportMeta = {
  id?: string;
  retrievedAt?: string;
  dataThroughDate?: string;
  source?: string;
  rangeLabel?: string;
  sourceFiles?: string[];
  searchType?: string;
  /** Prior-period page×query matrix (not current export). */
  historicalPageQuery?: boolean;
};

export type LoadedGscExport = {
  sourcePath: string;
  absolutePath: string;
  label: string | null;
  synthetic: boolean;
  meta: GscExportMeta;
  /** Page-dimension rows (no query) — preferred for page-level metrics. */
  pageRows: SearchPerformanceRow[];
  /** Query-dimension rows (no page). */
  queryRows: SearchPerformanceRow[];
  /**
   * Real page×query matrix rows (both page and query set).
   * Only these may produce DIRECT_GSC provenance.
   */
  pageQueryRows: SearchPerformanceRow[];
  hasPageQueryMatrix: boolean;
  historicalPageQuery: boolean;
  /** Sort key used to pick this file as newest. */
  sortKey: string;
  dateRangeStart: string | null;
  dateRangeEnd: string | null;
};

const DEFAULT_CANDIDATE_GLOBS = [
  "docs/migration/data/gsc-export.json",
  "src/data/seo/imports/gsc-export.json",
  "data/seo/imports/gsc-export.json",
  "data/seo/gsc-export.json",
  "data/seo/imports/gsc-page-query.json",
  "data/seo/imports/gsc-page-query.csv",
];

function ensureTrailingSlash(pathname: string): string {
  if (!pathname || pathname === "/") return "/";
  return pathname.endsWith("/") ? pathname : `${pathname}/`;
}

function fileSortKey(
  filePath: string,
  meta: GscExportMeta,
  label: string | null,
): string {
  if (meta.dataThroughDate) return meta.dataThroughDate;
  if (meta.retrievedAt) return meta.retrievedAt.slice(0, 10);
  const fromLabel = label?.match(/(\d{4}-\d{2}-\d{2})/);
  if (fromLabel?.[1]) return fromLabel[1];
  try {
    return new Date(statSync(filePath).mtimeMs).toISOString().slice(0, 10);
  } catch {
    return "1970-01-01";
  }
}

function listJsonCandidates(cwd: string): string[] {
  const out = new Set<string>();
  for (const rel of DEFAULT_CANDIDATE_GLOBS) {
    const abs = path.join(cwd, rel);
    if (existsSync(abs)) out.add(abs);
  }

  const searchRoots = [
    path.join(cwd, "docs/migration/data"),
    path.join(cwd, "src/data/seo"),
    path.join(cwd, "data/seo"),
    path.join(cwd, "data/seo/imports"),
    path.join(cwd, "tmp"),
  ];

  for (const root of searchRoots) {
    if (!existsSync(root)) continue;
    for (const name of readdirSync(root)) {
      const lower = name.toLowerCase();
      if (
        !(
          lower.endsWith(".json") ||
          lower.endsWith(".csv")
        )
      ) {
        continue;
      }
      if (
        lower.includes("gsc-export") ||
        lower.includes("gsc-page-query") ||
        lower.includes("performance-on-search") ||
        (lower.includes("gsc") && lower.includes("performance")) ||
        (lower.includes("gsc") && lower.includes("page") && lower.includes("query"))
      ) {
        out.add(path.join(root, name));
      }
    }
  }

  return [...out];
}

function parseRow(raw: unknown): SearchPerformanceRow | null {
  const parsed = SearchPerformanceRowSchema.safeParse(raw);
  return parsed.success ? parsed.data : null;
}

function splitPerformanceRows(rows: SearchPerformanceRow[]): {
  pageRows: SearchPerformanceRow[];
  queryRows: SearchPerformanceRow[];
  pageQueryRows: SearchPerformanceRow[];
} {
  const pageRows: SearchPerformanceRow[] = [];
  const queryRows: SearchPerformanceRow[] = [];
  const pageQueryRows: SearchPerformanceRow[] = [];

  for (const parsed of rows) {
    const hasPage = Boolean(parsed.page);
    const hasQuery = Boolean(parsed.query);
    if (hasPage && hasQuery) {
      pageQueryRows.push(parsed);
    } else if (hasPage) {
      pageRows.push(parsed);
    } else if (hasQuery) {
      queryRows.push(parsed);
    }
  }
  return { pageRows, queryRows, pageQueryRows };
}

function defaultDateRange(): SearchPerformanceRow["dateRange"] {
  return { startDate: "1970-01-01", endDate: "1970-01-01" };
}

/**
 * Parse a manually imported page×query CSV.
 * Required headers (case-insensitive): page, query, clicks, impressions, ctr, position
 * Optional: startDate, endDate (or dateRangeStart / dateRangeEnd)
 */
export function parsePageQueryCsv(csvText: string): SearchPerformanceRow[] {
  const lines = csvText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length < 2) return [];

  const header = parseCsvLine(lines[0]!).map((h) => h.trim().toLowerCase());
  const idx = (names: string[]) =>
    header.findIndex((h) => names.includes(h));

  const pageI = idx(["page", "url", "landing page", "landing_page"]);
  const queryI = idx(["query", "queries", "search query", "top queries"]);
  const clicksI = idx(["clicks"]);
  const impressionsI = idx(["impressions", "impr"]);
  const ctrI = idx(["ctr", "click through rate", "click-through rate"]);
  const positionI = idx(["position", "avg. position", "avg position", "average position"]);
  const startI = idx(["startdate", "start_date", "daterangestart", "start date"]);
  const endI = idx(["enddate", "end_date", "daterangeend", "end date"]);

  if (pageI < 0 || queryI < 0 || impressionsI < 0 || positionI < 0) {
    throw new Error(
      "page×query CSV requires headers: page, query, impressions, position (plus clicks, ctr recommended)",
    );
  }

  const rows: SearchPerformanceRow[] = [];
  for (const line of lines.slice(1)) {
    const cols = parseCsvLine(line);
    const page = cols[pageI]?.trim();
    const query = cols[queryI]?.trim();
    if (!page || !query) continue;

    const clicks = Number(cols[clicksI] ?? 0) || 0;
    const impressions = Number(String(cols[impressionsI] ?? "0").replace(/,/g, "")) || 0;
    let ctr = Number(String(cols[ctrI] ?? "").replace(/%/g, "")) || 0;
    if (ctr > 1) ctr = ctr / 100;
    if (!ctr && impressions > 0) ctr = clicks / impressions;
    const position = Number(cols[positionI] ?? 0) || 0;
    if (impressions <= 0 || position <= 0) continue;

    const startDate = (cols[startI] ?? "").trim() || "1970-01-01";
    const endDate = (cols[endI] ?? "").trim() || startDate;

    const parsed = parseRow({
      dateRange: { startDate, endDate },
      page,
      query,
      clicks,
      impressions,
      ctr,
      position,
    });
    if (parsed) rows.push(parsed);
  }
  return rows;
}

/** Minimal CSV line parser supporting quoted fields. */
function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]!;
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        cur += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      out.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out;
}

function loadFromCsvFile(absolutePath: string): LoadedGscExport {
  const csvText = readFileSync(absolutePath, "utf8");
  const pageQueryRows = parsePageQueryCsv(csvText);
  const meta: GscExportMeta = {
    source: "import",
    rangeLabel: "manual page×query CSV",
  };
  const label = path.basename(absolutePath);
  return finalizeLoaded({
    absolutePath,
    label,
    synthetic: false,
    meta,
    pageRows: [],
    queryRows: [],
    pageQueryRows,
  });
}

function finalizeLoaded(input: {
  absolutePath: string;
  label: string | null;
  synthetic: boolean;
  meta: GscExportMeta;
  pageRows: SearchPerformanceRow[];
  queryRows: SearchPerformanceRow[];
  pageQueryRows: SearchPerformanceRow[];
}): LoadedGscExport {
  const { pageRows, queryRows, pageQueryRows } = input;
  const meta = input.meta;
  const sortKey = fileSortKey(input.absolutePath, meta, input.label);

  let dateRangeStart: string | null = null;
  let dateRangeEnd: string | null = null;
  for (const row of [...pageRows, ...queryRows, ...pageQueryRows]) {
    const start = row.dateRange?.startDate;
    const end = row.dateRange?.endDate;
    if (start && start !== "1970-01-01" && (!dateRangeStart || start < dateRangeStart)) {
      dateRangeStart = start;
    }
    if (end && end !== "1970-01-01" && (!dateRangeEnd || end > dateRangeEnd)) {
      dateRangeEnd = end;
    }
  }
  if (!dateRangeEnd && meta.dataThroughDate) {
    dateRangeEnd = meta.dataThroughDate;
  }

  return {
    sourcePath:
      path.relative(process.cwd(), input.absolutePath) || input.absolutePath,
    absolutePath: input.absolutePath,
    label: input.label,
    synthetic: input.synthetic,
    meta,
    pageRows,
    queryRows,
    pageQueryRows,
    hasPageQueryMatrix: pageQueryRows.length > 0,
    historicalPageQuery: Boolean(meta.historicalPageQuery),
    sortKey,
    dateRangeStart,
    dateRangeEnd,
  };
}

/**
 * Load a Search Console–shaped JSON export (pages + optional queries + page×query).
 * Does not scrape GSC. Accepts ImportSearchPerformanceProvider-compatible JSON
 * or a page×query CSV.
 */
export function loadGscExport(filePath: string): LoadedGscExport {
  const absolutePath = path.isAbsolute(filePath)
    ? filePath
    : path.join(process.cwd(), filePath);
  if (!existsSync(absolutePath)) {
    throw new Error(`GSC export not found: ${absolutePath}`);
  }

  if (absolutePath.toLowerCase().endsWith(".csv")) {
    return loadFromCsvFile(absolutePath);
  }

  const raw = JSON.parse(readFileSync(absolutePath, "utf8")) as {
    synthetic?: boolean;
    label?: string;
    meta?: GscExportMeta;
    rows?: unknown[];
    queries?: unknown[];
    pages?: unknown[];
    /** Explicit page×query matrix (preferred). */
    pageQueries?: unknown[];
    pageQueryRows?: unknown[];
  };

  const collected: SearchPerformanceRow[] = [];

  for (const row of raw.pages ?? []) {
    const parsed = parseRow(row);
    if (parsed) collected.push(parsed);
  }
  for (const row of raw.queries ?? []) {
    const parsed = parseRow(row);
    if (parsed) collected.push(parsed);
  }
  for (const row of raw.pageQueries ?? raw.pageQueryRows ?? []) {
    const parsed = parseRow(row);
    if (parsed) collected.push(parsed);
  }

  // Search Console API shape: rows[].keys = [page, query] with dimensions page+query
  const apiRows = Array.isArray(raw.rows) ? raw.rows : [];
  const looksLikeApiKeys =
    apiRows.length > 0 &&
    apiRows.some(
      (r) =>
        r &&
        typeof r === "object" &&
        Array.isArray((r as { keys?: unknown }).keys) &&
        ((r as { keys: unknown[] }).keys?.length ?? 0) >= 2,
    );
  if (looksLikeApiKeys) {
    collected.push(
      ...parseGscApiPageQueryPayload(raw, {
        startDate: metaDate(raw as Record<string, unknown>, "startDate"),
        endDate: metaDate(raw as Record<string, unknown>, "endDate"),
      }),
    );
  } else {
    for (const row of apiRows) {
      const parsed = parseRow(row);
      if (parsed) collected.push(parsed);
    }
  }

  // Ensure dateRange exists for schema-valid rows that somehow skipped it
  // (should not happen via parseRow).
  void defaultDateRange;

  const split = splitPerformanceRows(collected);
  const meta = raw.meta ?? {};
  const label = raw.label ?? null;

  return finalizeLoaded({
    absolutePath,
    label,
    synthetic: Boolean(raw.synthetic) || meta.source === "fixture",
    meta,
    ...split,
  });
}

function metaDate(raw: Record<string, unknown>, key: string): string | undefined {
  if (typeof raw[key] === "string") return raw[key] as string;
  const meta = raw.meta;
  if (meta && typeof meta === "object" && typeof (meta as Record<string, unknown>)[key] === "string") {
    return (meta as Record<string, unknown>)[key] as string;
  }
  return undefined;
}

/**
 * Pick the newest **real** GSC Performance export under known project locations.
 * Prefer exports that include a page×query matrix when dates tie.
 * Fixture/synthetic exports are skipped unless `allowSynthetic` is true.
 */
export function discoverLatestGscExport(
  cwd: string = process.cwd(),
  opts: { allowSynthetic?: boolean } = {},
): LoadedGscExport {
  const candidates = listJsonCandidates(cwd);
  if (candidates.length === 0) {
    throw new Error(
      "No GSC export found. Pass --export <path> to a SearchSnapshot JSON or page×query CSV.",
    );
  }

  let best: LoadedGscExport | null = null;
  let bestSynthetic: LoadedGscExport | null = null;
  for (const abs of candidates) {
    try {
      const loaded = loadGscExport(abs);
      if (loaded.synthetic) {
        if (
          !bestSynthetic ||
          loaded.sortKey > bestSynthetic.sortKey ||
          (loaded.sortKey === bestSynthetic.sortKey &&
            loaded.pageQueryRows.length > bestSynthetic.pageQueryRows.length)
        ) {
          bestSynthetic = loaded;
        }
        continue;
      }
      if (!best || loaded.sortKey > best.sortKey) {
        best = loaded;
      } else if (best && loaded.sortKey === best.sortKey) {
        // Prefer matrix-bearing exports on the same date.
        const bestScore =
          (best.hasPageQueryMatrix ? 1_000_000 : 0) + best.pageRows.length;
        const nextScore =
          (loaded.hasPageQueryMatrix ? 1_000_000 : 0) + loaded.pageRows.length;
        if (nextScore > bestScore) best = loaded;
      }
    } catch {
      // skip unreadable / invalid candidates
    }
  }

  if (best) return best;
  if (opts.allowSynthetic && bestSynthetic) return bestSynthetic;

  throw new Error(
    "No real (non-fixture) GSC export found. Production opportunity reporting requires a live Search Console export. Pass --export <path> or place gsc-export.json under docs/migration/data/.",
  );
}

/** Aggregate page-only rows by normalized path (impression-weighted position). */
export function aggregatePagesByPath(
  rows: SearchPerformanceRow[],
): Map<string, { clicks: number; impressions: number; ctr: number; position: number; sourceUrls: string[] }> {
  const map = new Map<
    string,
    { clicks: number; impressions: number; positionWeighted: number; sourceUrls: string[] }
  >();

  for (const row of rows) {
    if (!row.page) continue;
    const p = ensureTrailingSlash(normalizePagePath(row.page));
    const cur = map.get(p) ?? {
      clicks: 0,
      impressions: 0,
      positionWeighted: 0,
      sourceUrls: [],
    };
    cur.clicks += row.clicks;
    cur.impressions += row.impressions;
    cur.positionWeighted += row.position * row.impressions;
    if (!cur.sourceUrls.includes(row.page)) cur.sourceUrls.push(row.page);
    map.set(p, cur);
  }

  const out = new Map<
    string,
    { clicks: number; impressions: number; ctr: number; position: number; sourceUrls: string[] }
  >();
  for (const [p, cur] of map) {
    out.set(p, {
      clicks: cur.clicks,
      impressions: cur.impressions,
      ctr: cur.impressions > 0 ? cur.clicks / cur.impressions : 0,
      position:
        cur.impressions > 0 ? cur.positionWeighted / cur.impressions : 0,
      sourceUrls: cur.sourceUrls,
    });
  }
  return out;
}

export function aggregateQueries(
  rows: SearchPerformanceRow[],
): Array<{
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  sourceDateRange: { startDate: string | null; endDate: string | null };
}> {
  const map = new Map<
    string,
    {
      clicks: number;
      impressions: number;
      positionWeighted: number;
      startDate: string | null;
      endDate: string | null;
    }
  >();
  for (const row of rows) {
    if (!row.query) continue;
    // Skip matrix rows here when aggregating site-wide query dimension —
    // callers pass query-only rows, or matrix when building per-page maps.
    const key = row.query.trim().toLowerCase();
    const cur = map.get(key) ?? {
      clicks: 0,
      impressions: 0,
      positionWeighted: 0,
      startDate: null as string | null,
      endDate: null as string | null,
    };
    cur.clicks += row.clicks;
    cur.impressions += row.impressions;
    cur.positionWeighted += row.position * row.impressions;
    const start = row.dateRange?.startDate ?? null;
    const end = row.dateRange?.endDate ?? null;
    if (start && start !== "1970-01-01" && (!cur.startDate || start < cur.startDate)) {
      cur.startDate = start;
    }
    if (end && end !== "1970-01-01" && (!cur.endDate || end > cur.endDate)) {
      cur.endDate = end;
    }
    map.set(key, cur);
  }
  return [...map.entries()]
    .map(([query, cur]) => ({
      query,
      clicks: cur.clicks,
      impressions: cur.impressions,
      ctr: cur.impressions > 0 ? cur.clicks / cur.impressions : 0,
      position:
        cur.impressions > 0 ? cur.positionWeighted / cur.impressions : 0,
      sourceDateRange: {
        startDate: cur.startDate,
        endDate: cur.endDate,
      },
    }))
    .sort((a, b) => b.impressions - a.impressions);
}

/**
 * Build path → queries from DIRECT page×query matrix rows.
 * Paths are normalized with trailing slash.
 */
export function aggregatePageQueryMatrix(
  rows: SearchPerformanceRow[],
): Map<
  string,
  Array<{
    query: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
    sourceDateRange: { startDate: string | null; endDate: string | null };
  }>
> {
  const byPath = new Map<
    string,
    Map<
      string,
      {
        clicks: number;
        impressions: number;
        positionWeighted: number;
        startDate: string | null;
        endDate: string | null;
      }
    >
  >();

  for (const row of rows) {
    if (!row.page || !row.query) continue;
    const p = ensureTrailingSlash(normalizePagePath(row.page));
    const qKey = row.query.trim().toLowerCase();
    const pathMap = byPath.get(p) ?? new Map();
    const cur = pathMap.get(qKey) ?? {
      clicks: 0,
      impressions: 0,
      positionWeighted: 0,
      startDate: null as string | null,
      endDate: null as string | null,
    };
    cur.clicks += row.clicks;
    cur.impressions += row.impressions;
    cur.positionWeighted += row.position * row.impressions;
    const start = row.dateRange?.startDate ?? null;
    const end = row.dateRange?.endDate ?? null;
    if (start && start !== "1970-01-01" && (!cur.startDate || start < cur.startDate)) {
      cur.startDate = start;
    }
    if (end && end !== "1970-01-01" && (!cur.endDate || end > cur.endDate)) {
      cur.endDate = end;
    }
    pathMap.set(qKey, cur);
    byPath.set(p, pathMap);
  }

  const out = new Map<
    string,
    Array<{
      query: string;
      clicks: number;
      impressions: number;
      ctr: number;
      position: number;
      sourceDateRange: { startDate: string | null; endDate: string | null };
    }>
  >();

  for (const [p, qMap] of byPath) {
    const list = [...qMap.entries()]
      .map(([query, cur]) => ({
        query,
        clicks: cur.clicks,
        impressions: cur.impressions,
        ctr: cur.impressions > 0 ? cur.clicks / cur.impressions : 0,
        position:
          cur.impressions > 0 ? cur.positionWeighted / cur.impressions : 0,
        sourceDateRange: {
          startDate: cur.startDate,
          endDate: cur.endDate,
        },
      }))
      .sort((a, b) => b.impressions - a.impressions);
    out.set(p, list);
  }
  return out;
}

/**
 * Parse a Search Console API-style JSON payload where rows use
 * `keys: [page, query]` with dimensions = ["page","query"].
 *
 * Accepted shapes:
 * - `{ rows: [ { keys: [page, query], clicks, impressions, ctr, position } ] }`
 * - `{ rows: [ { page, query, clicks, impressions, ctr, position } ] }`
 */
export function parseGscApiPageQueryPayload(
  raw: unknown,
  opts?: { startDate?: string; endDate?: string },
): SearchPerformanceRow[] {
  if (!raw || typeof raw !== "object") return [];
  const obj = raw as Record<string, unknown>;
  const rowsIn = Array.isArray(obj.rows) ? obj.rows : [];
  const startDate =
    opts?.startDate ??
    (typeof obj.startDate === "string" ? obj.startDate : null) ??
    "1970-01-01";
  const endDate =
    opts?.endDate ??
    (typeof obj.endDate === "string" ? obj.endDate : null) ??
    startDate;

  const out: SearchPerformanceRow[] = [];
  for (const row of rowsIn) {
    if (!row || typeof row !== "object") continue;
    const r = row as Record<string, unknown>;
    let page: string | undefined;
    let query: string | undefined;
    if (Array.isArray(r.keys) && r.keys.length >= 2) {
      page = String(r.keys[0] ?? "");
      query = String(r.keys[1] ?? "");
    } else {
      page = typeof r.page === "string" ? r.page : undefined;
      query = typeof r.query === "string" ? r.query : undefined;
    }
    if (!page || !query) continue;
    const clicks = Number(r.clicks ?? 0) || 0;
    const impressions = Number(r.impressions ?? 0) || 0;
    let ctr = Number(r.ctr ?? 0) || 0;
    if (ctr > 1) ctr = ctr / 100;
    if (!ctr && impressions > 0) ctr = clicks / impressions;
    const position = Number(r.position ?? 0) || 0;
    if (impressions <= 0 || position <= 0) continue;
    const parsed = parseRow({
      dateRange: { startDate, endDate },
      page,
      query,
      clicks,
      impressions,
      ctr,
      position,
    });
    if (parsed) out.push(parsed);
  }
  return out;
}
