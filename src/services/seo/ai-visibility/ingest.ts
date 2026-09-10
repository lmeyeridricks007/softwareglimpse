import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import {
  canonicalizeCitedUrl,
  inferAiVisibilityCategory,
  inferAiVisibilityPageType,
} from "./page-type";
import type {
  AiVisibilityExportMeta,
  AiVisibilityObservation,
  AiVisibilityPlatform,
  LoadedAiVisibilityExport,
} from "./types";

const IMPORT_DIRS = [
  "data/seo/imports/ahrefs-ai-visibility",
  "data/seo/imports/ai-visibility",
  "src/data/seo/imports/ai-visibility",
];

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

function toNumber(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v.replace(/[% ,]/g, ""));
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function splitList(v: unknown): string[] {
  if (Array.isArray(v)) {
    return v.map(String).map((s) => s.trim()).filter(Boolean);
  }
  if (typeof v !== "string" || !v.trim()) return [];
  return v
    .split(/[;|,]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function mapPlatform(raw: unknown): AiVisibilityPlatform {
  const s = String(raw ?? "")
    .toLowerCase()
    .replace(/\s+/g, "_");
  if (!s) return "other";
  if (s.includes("chatgpt") || s.includes("openai") || s === "gpt") {
    return "chatgpt";
  }
  if (s.includes("perplexity")) return "perplexity";
  if (s.includes("copilot") || s.includes("bing")) return "copilot";
  if (s.includes("ai_overview") || s.includes("aio") || s.includes("google_ai")) {
    return "google_ai";
  }
  if (s.includes("gemini") || s.includes("bard")) return "gemini";
  return "other";
}

function detectProvider(filePath: string): AiVisibilityExportMeta["provider"] {
  const lower = filePath.toLowerCase();
  if (lower.includes("ahrefs")) return "ahrefs";
  if (lower.includes("semrush")) return "semrush";
  return "other";
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
      } else inQuotes = !inQuotes;
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

function parseCsv(text: string): Record<string, unknown>[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];
  const headers = splitCsvLine(lines[0]!);
  return lines.slice(1).map((line) => {
    const cols = splitCsvLine(line);
    const row: Record<string, unknown> = {};
    headers.forEach((h, i) => {
      row[h] = cols[i] ?? "";
    });
    return row;
  });
}

function observationId(parts: string[]): string {
  return createHash("sha256").update(parts.join("|")).digest("hex").slice(0, 16);
}

function normalizeRow(raw: Record<string, unknown>): AiVisibilityObservation | null {
  const query = pickField(raw, [
    "query",
    "prompt",
    "keyword",
    "search_query",
    "Question",
  ]);
  if (typeof query !== "string" || !query.trim()) return null;

  const platform = mapPlatform(
    pickField(raw, ["platform", "ai_platform", "engine", "source", "AI platform"]),
  );
  const dateRaw = pickField(raw, [
    "date",
    "observed_at",
    "observation_date",
    "Date",
    "first_seen",
  ]);
  const date =
    typeof dateRaw === "string" && dateRaw.trim()
      ? dateRaw.slice(0, 10)
      : new Date().toISOString().slice(0, 10);

  const citedRaw = pickField(raw, [
    "cited_url",
    "url",
    "page",
    "landing_page",
    "SoftwareGlimpse URL",
    "cited_page",
    "target_url",
  ]);
  const canon = canonicalizeCitedUrl(
    typeof citedRaw === "string" ? citedRaw : null,
  );

  const citedFlag = pickField(raw, [
    "softwareglimpse_cited",
    "brand_cited",
    "is_cited",
    "cited",
  ]);
  let softwareGlimpseCited = canon.isSoftwareGlimpse;
  if (typeof citedFlag === "string") {
    const lower = citedFlag.toLowerCase();
    if (["true", "yes", "1", "y"].includes(lower)) softwareGlimpseCited = true;
    if (["false", "no", "0", "n"].includes(lower)) {
      softwareGlimpseCited = canon.isSoftwareGlimpse;
    }
  } else if (typeof citedFlag === "boolean") {
    softwareGlimpseCited = citedFlag || canon.isSoftwareGlimpse;
  }

  const position = toNumber(
    pickField(raw, [
      "citation_position",
      "position",
      "rank",
      "Citation position",
    ]),
  );

  const competitors = splitList(
    pickField(raw, [
      "competitors_cited",
      "competitors",
      "other_citations",
      "Competitor domains",
    ]),
  );

  const topicRaw = pickField(raw, ["topic", "theme", "intent"]);
  const topic = typeof topicRaw === "string" && topicRaw.trim() ? topicRaw : null;

  const notesRaw = pickField(raw, ["notes", "note", "comment"]);
  const notes =
    typeof notesRaw === "string" && notesRaw.trim() ? [notesRaw.trim()] : [];

  const path = canon.citedPath;
  const pageType = path ? inferAiVisibilityPageType(path) : null;
  const category = path ? inferAiVisibilityCategory(path) : null;

  return {
    id: observationId([
      platform,
      query.trim().toLowerCase(),
      date,
      path ?? canon.citedUrl ?? "",
    ]),
    platform,
    query: query.trim(),
    date,
    softwareGlimpseCited,
    citedUrl: canon.citedUrl,
    citedPath: path,
    citationPosition: position,
    competitorsCited: competitors,
    topic,
    category,
    pageType,
    notes,
    aiSharePct: toNumber(
      pickField(raw, ["ai_share", "AI share", "share_pct", "visibility"]),
    ),
    impressions: toNumber(
      pickField(raw, ["impressions", "volume", "AI volume"]),
    ),
  };
}

/**
 * Load Ahrefs AI visibility (or similar) CSV/JSON. Never invents rows.
 */
export function loadAiVisibilityExport(
  filePath: string,
): LoadedAiVisibilityExport | null {
  if (!existsSync(filePath)) return null;
  const text = readFileSync(filePath, "utf8");
  const notes: string[] = [];
  let rawRows: Record<string, unknown>[] = [];

  if (filePath.endsWith(".json")) {
    try {
      const parsed = JSON.parse(text) as unknown;
      if (Array.isArray(parsed)) rawRows = parsed as Record<string, unknown>[];
      else if (
        parsed &&
        typeof parsed === "object" &&
        Array.isArray((parsed as { observations?: unknown }).observations)
      ) {
        rawRows = (parsed as { observations: Record<string, unknown>[] })
          .observations;
      } else if (
        parsed &&
        typeof parsed === "object" &&
        Array.isArray((parsed as { rows?: unknown }).rows)
      ) {
        rawRows = (parsed as { rows: Record<string, unknown>[] }).rows;
      } else {
        notes.push("JSON must be an array or { observations|rows: [] }");
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

  const observations = rawRows
    .map((r) => normalizeRow(r))
    .filter((r): r is AiVisibilityObservation => Boolean(r));

  if (observations.length === 0) {
    notes.push("No usable observation rows after normalize");
  }

  return {
    meta: {
      provider: detectProvider(filePath),
      sourcePath: filePath,
      label: path.basename(filePath),
      importedAt: new Date().toISOString(),
      rowCount: observations.length,
      notes,
    },
    observations,
  };
}

export function ensureAiVisibilityImportDirs(cwd = process.cwd()): void {
  for (const rel of IMPORT_DIRS) {
    const abs = path.join(cwd, rel);
    if (!existsSync(abs)) mkdirSync(abs, { recursive: true });
  }
}

export function discoverLatestAiVisibilityExport(
  cwd = process.cwd(),
): LoadedAiVisibilityExport | null {
  ensureAiVisibilityImportDirs(cwd);
  const candidates: { abs: string; mtime: number }[] = [];
  for (const rel of IMPORT_DIRS) {
    const dir = path.join(cwd, rel);
    if (!existsSync(dir)) continue;
    for (const name of readdirSync(dir)) {
      if (!/\.(csv|json)$/i.test(name)) continue;
      if (name.startsWith(".") || /readme|example/i.test(name)) continue;
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
    const loaded = loadAiVisibilityExport(c.abs);
    if (loaded && loaded.observations.length > 0) return loaded;
  }
  return null;
}
