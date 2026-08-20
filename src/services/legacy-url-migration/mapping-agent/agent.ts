import fs from "node:fs";
import path from "node:path";
import { buildContentGraph } from "./content-graph";
import { parseLegacyIntent } from "./intent";
import { mapLegacyIntent } from "./map";
import {
  renderUrlMappingPlanMarkdown,
  summarizeMappingPlan,
} from "./report";
import {
  LEGACY_URL_MAPPING_AGENT,
  type UrlMappingPlanSummary,
  type UrlMappingRow,
} from "./types";

export type LegacyUrlMappingAgentOptions = {
  /** Legacy paths or full URLs to map. Defaults to docs/migration/data/legacy-primary-en.json */
  legacyPaths?: string[];
  /** Optional legacy titles by path */
  legacyTitles?: Record<string, string>;
  write?: boolean;
  generatedAt?: string;
};

export type LegacyUrlMappingAgentResult = {
  agent: typeof LEGACY_URL_MAPPING_AGENT;
  summary: UrlMappingPlanSummary;
  rows: UrlMappingRow[];
  paths: {
    markdown: string;
    json: string;
    summary: string;
  };
};

const OUT_DIR = path.join(process.cwd(), "docs", "migration");
const DATA_DIR = path.join(OUT_DIR, "data");

function loadDefaultLegacyPaths(): string[] {
  const file = path.join(DATA_DIR, "legacy-primary-en.json");
  if (!fs.existsSync(file)) {
    throw new Error(
      `Missing ${file}. Run npm run migration:legacy-urls harvest first.`,
    );
  }
  const rows = JSON.parse(fs.readFileSync(file, "utf8")) as Array<{
    loc: string;
  }>;
  return rows.map((r) => r.loc);
}

function loadLegacyTitles(): Record<string, string> {
  const file = path.join(DATA_DIR, "migration-records.json");
  if (!fs.existsSync(file)) return {};
  const rows = JSON.parse(fs.readFileSync(file, "utf8")) as Array<{
    legacyPath: string;
    legacyTitle?: string | null;
  }>;
  const out: Record<string, string> = {};
  for (const r of rows) {
    if (r.legacyTitle) out[r.legacyPath] = r.legacyTitle;
  }
  return out;
}

/**
 * LegacyUrlMappingAgent — maps every meaningful legacy URL to the best new URL.
 * Does not mutate redirects or production config.
 */
export function runLegacyUrlMappingAgent(
  opts: LegacyUrlMappingAgentOptions = {},
): LegacyUrlMappingAgentResult {
  const generatedAt = opts.generatedAt ?? new Date().toISOString();
  const write = opts.write !== false;
  const graph = buildContentGraph();
  const legacyPaths = opts.legacyPaths ?? loadDefaultLegacyPaths();
  const titles = { ...loadLegacyTitles(), ...(opts.legacyTitles ?? {}) };

  const rows: UrlMappingRow[] = legacyPaths.map((raw) => {
    const intent = parseLegacyIntent(raw, graph);
    return mapLegacyIntent(intent, graph, titles[intent.path] ?? null);
  });

  const summary = summarizeMappingPlan(rows, {
    agent: LEGACY_URL_MAPPING_AGENT.name,
    version: LEGACY_URL_MAPPING_AGENT.version,
    generatedAt,
  });

  const paths = {
    markdown: path.join(OUT_DIR, "02-url-mapping-plan.md"),
    json: path.join(DATA_DIR, "url-mapping-plan.json"),
    summary: path.join(DATA_DIR, "url-mapping-summary.json"),
  };

  if (write) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    const markdown = renderUrlMappingPlanMarkdown({ summary, rows });
    fs.writeFileSync(paths.markdown, markdown);
    fs.writeFileSync(paths.json, `${JSON.stringify(rows, null, 2)}\n`);
    fs.writeFileSync(paths.summary, `${JSON.stringify(summary, null, 2)}\n`);
  }

  return {
    agent: LEGACY_URL_MAPPING_AGENT,
    summary,
    rows,
    paths,
  };
}
