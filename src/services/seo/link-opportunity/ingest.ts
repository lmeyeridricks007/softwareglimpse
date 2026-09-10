import { existsSync, mkdirSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import type {
  BacklinkExportMeta,
  LoadedBacklinkExport,
  ReferringDomainRow,
} from "./types";
import {
  classifyBacklinkExportValidity,
  inferExportDate,
  metricsAvailableFromRows,
} from "./validity";

const IMPORT_DIRS = [
  "data/seo/imports/ahrefs",
  "data/seo/imports/semrush",
  "data/seo/imports/backlinks",
  "src/data/seo/imports/backlinks",
];

function hostnameFromUrl(raw: string): string | null {
  try {
    const u = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
    return u.hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return null;
  }
}

function pickField(
  row: Record<string, unknown>,
  keys: string[],
): string | number | undefined {
  for (const key of keys) {
    const direct = row[key];
    if (direct != null && direct !== "") return direct as string | number;
    const found = Object.keys(row).find(
      (k) => k.toLowerCase().replace(/\s+/g, "_") === key.toLowerCase(),
    );
    if (found && row[found] != null && row[found] !== "") {
      return row[found] as string | number;
    }
  }
  return undefined;
}

function toNumber(v: unknown): number | undefined {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v.replace(/,/g, ""));
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
}

function normalizeRow(raw: Record<string, unknown>): ReferringDomainRow | null {
  const domainRaw = pickField(raw, [
    "domain",
    "referring_domain",
    "referringDomain",
    "DR domain",
    "Domain",
    "root_domain",
  ]);
  const targetRaw = pickField(raw, [
    "target_url",
    "targetUrl",
    "target",
    "To URL",
    "to_url",
    "page",
    "url",
  ]);
  const sourceRaw = pickField(raw, [
    "source_url",
    "sourceUrl",
    "Referring page URL",
    "referring_page",
    "from_url",
  ]);

  const targetUrl =
    typeof targetRaw === "string"
      ? targetRaw
      : typeof sourceRaw === "string"
        ? String(pickField(raw, ["target_url", "To URL"]) ?? "")
        : "";

  let domain =
    typeof domainRaw === "string"
      ? domainRaw.replace(/^www\./, "").toLowerCase()
      : null;
  if (!domain && typeof sourceRaw === "string") {
    domain = hostnameFromUrl(sourceRaw);
  }
  if (!domain) return null;

  const resolvedTarget =
    targetUrl ||
    (typeof pickField(raw, ["To URL", "target"]) === "string"
      ? String(pickField(raw, ["To URL", "target"]))
      : "");

  if (!resolvedTarget) return null;

  const dr = toNumber(
    pickField(raw, ["domain_rating", "Domain Rating", "DR", "domainRating"]),
  );
  const da = toNumber(
    pickField(raw, [
      "domain_authority",
      "Domain Authority",
      "DA",
      "Authority Score",
      "authority_score",
    ]),
  );
  const traffic = toNumber(
    pickField(raw, [
      "organic_traffic",
      "Organic traffic",
      "Traffic",
      "traffic",
    ]),
  );

  const followRaw = pickField(raw, ["is_dofollow", "Dofollow", "follow", "type"]);
  let isDofollow: boolean | undefined;
  if (typeof followRaw === "boolean") isDofollow = followRaw;
  else if (typeof followRaw === "string") {
    const lower = followRaw.toLowerCase();
    if (lower.includes("dofollow") || lower === "true" || lower === "yes") {
      isDofollow = true;
    } else if (lower.includes("nofollow") || lower === "false") {
      isDofollow = false;
    }
  }

  return {
    domain,
    targetUrl: resolvedTarget,
    sourceUrl: typeof sourceRaw === "string" ? sourceRaw : undefined,
    anchorText:
      typeof pickField(raw, ["anchor", "Anchor", "anchor_text"]) === "string"
        ? String(pickField(raw, ["anchor", "Anchor", "anchor_text"]))
        : undefined,
    domainRating: dr,
    domainAuthority: da,
    organicTraffic: traffic,
    firstSeen:
      typeof pickField(raw, ["first_seen", "First seen"]) === "string"
        ? String(pickField(raw, ["first_seen", "First seen"]))
        : undefined,
    lastSeen:
      typeof pickField(raw, ["last_seen", "Last seen"]) === "string"
        ? String(pickField(raw, ["last_seen", "Last seen"]))
        : undefined,
    isDofollow,
  };
}

function parseCsv(text: string): Record<string, unknown>[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];
  const headers = splitCsvLine(lines[0]!);
  const rows: Record<string, unknown>[] = [];
  for (const line of lines.slice(1)) {
    const cols = splitCsvLine(line);
    const row: Record<string, unknown> = {};
    headers.forEach((h, i) => {
      row[h] = cols[i] ?? "";
    });
    rows.push(row);
  }
  return rows;
}

function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]!;
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (ch === "," && !inQuotes) {
      out.push(cur.trim());
      cur = "";
      continue;
    }
    cur += ch;
  }
  out.push(cur.trim());
  return out;
}

function detectProvider(filePath: string): BacklinkExportMeta["provider"] {
  const lower = filePath.toLowerCase();
  if (lower.includes("ahrefs")) return "ahrefs";
  if (lower.includes("semrush")) return "semrush";
  if (lower.includes("/backlinks/") || lower.includes("backlink")) {
    return "other";
  }
  return "other";
}

function buildExportMeta(
  filePath: string,
  rows: ReferringDomainRow[],
  notes: string[],
): BacklinkExportMeta {
  const { validity, reasons } = classifyBacklinkExportValidity({
    sourcePath: filePath,
    label: path.basename(filePath),
    rows,
  });
  let mtimeIso: string | null = null;
  try {
    mtimeIso = statSync(filePath).mtime.toISOString();
  } catch {
    mtimeIso = null;
  }
  const exportDate = inferExportDate(filePath, mtimeIso);
  const metaNotes = [...notes];
  if (validity !== "REAL") {
    metaNotes.push(
      `Rejected for production Digital PR (${validity}): ${reasons.join("; ")}`,
    );
  }
  return {
    provider: detectProvider(filePath),
    sourcePath: filePath,
    filename: path.basename(filePath),
    label: path.basename(filePath),
    importedAt: new Date().toISOString(),
    exportDate,
    rowCount: rows.length,
    metricsAvailable: metricsAvailableFromRows(rows),
    validity,
    rejectionReasons: reasons,
    notes: metaNotes,
  };
}

/**
 * Load a backlink export (JSON array or CSV).
 * Never invents rows — empty/missing file returns null.
 * Callers must check meta.validity before using in production reports.
 */
export function loadBacklinkExport(
  filePath: string,
): LoadedBacklinkExport | null {
  if (!existsSync(filePath)) return null;
  const text = readFileSync(filePath, "utf8");
  let rawRows: Record<string, unknown>[] = [];
  const notes: string[] = [];

  if (filePath.endsWith(".json")) {
    try {
      const parsed = JSON.parse(text) as unknown;
      if (Array.isArray(parsed)) {
        rawRows = parsed as Record<string, unknown>[];
      } else if (
        parsed &&
        typeof parsed === "object" &&
        Array.isArray((parsed as { rows?: unknown }).rows)
      ) {
        rawRows = (parsed as { rows: Record<string, unknown>[] }).rows;
      } else {
        notes.push("JSON export must be an array or { rows: [] }");
        return null;
      }
    } catch {
      notes.push("Invalid JSON");
      return null;
    }
  } else if (filePath.endsWith(".csv")) {
    rawRows = parseCsv(text);
  } else {
    notes.push("Unsupported extension — use .csv or .json");
    return null;
  }

  const rows = rawRows
    .map((r) => normalizeRow(r))
    .filter((r): r is ReferringDomainRow => Boolean(r));

  if (rows.length === 0) {
    notes.push("No usable referring-domain rows after normalize");
  }

  return {
    meta: buildExportMeta(filePath, rows, notes),
    rows,
  };
}

export function ensureBacklinkImportDirs(cwd = process.cwd()): string[] {
  const created: string[] = [];
  for (const rel of IMPORT_DIRS) {
    const abs = path.join(cwd, rel);
    if (!existsSync(abs)) {
      mkdirSync(abs, { recursive: true });
      created.push(abs);
    }
  }
  return created;
}

export type DiscoverBacklinkExportOptions = {
  /** When true (default for production), skip FIXTURE/SAMPLE/TEST/EXAMPLE. */
  realOnly?: boolean;
};

/**
 * Discover newest REAL backlink export under known import directories.
 * Fixture/sample/example/test files are skipped when realOnly is true.
 */
export function discoverLatestBacklinkExport(
  cwd = process.cwd(),
  opts: DiscoverBacklinkExportOptions = {},
): LoadedBacklinkExport | null {
  const realOnly = opts.realOnly !== false;
  ensureBacklinkImportDirs(cwd);
  const candidates: { abs: string; mtime: number }[] = [];

  for (const rel of IMPORT_DIRS) {
    const dir = path.join(cwd, rel);
    if (!existsSync(dir)) continue;
    for (const name of readdirSync(dir)) {
      if (!/\.(csv|json)$/i.test(name)) continue;
      if (name.startsWith(".")) continue;
      if (/readme/i.test(name)) continue;
      const abs = path.join(dir, name);
      try {
        candidates.push({ abs, mtime: statSync(abs).mtimeMs });
      } catch {
        continue;
      }
    }
  }

  candidates.sort((a, b) => b.mtime - a.mtime);
  for (const c of candidates) {
    const loaded = loadBacklinkExport(c.abs);
    if (!loaded || loaded.rows.length === 0) continue;
    if (realOnly && loaded.meta.validity !== "REAL") continue;
    return loaded;
  }
  return null;
}

export function hostnameOf(url: string): string | null {
  return hostnameFromUrl(url);
}

export function targetMatchesUrl(
  rowTarget: string,
  candidateUrl: string,
): boolean {
  const a = rowTarget.toLowerCase();
  const b = candidateUrl.toLowerCase();
  if (a === b) return true;
  try {
    const ua = new URL(a.startsWith("http") ? a : `https://${a}`);
    const ub = new URL(b.startsWith("http") ? b : `https://${b}`);
    if (ua.hostname.replace(/^www\./, "") !== ub.hostname.replace(/^www\./, "")) {
      return false;
    }
    const pa = ua.pathname.replace(/\/$/, "") || "/";
    const pb = ub.pathname.replace(/\/$/, "") || "/";
    return pa === pb || pa.startsWith(pb) || pb.startsWith(pa);
  } catch {
    return a.includes(b) || b.includes(a);
  }
}
