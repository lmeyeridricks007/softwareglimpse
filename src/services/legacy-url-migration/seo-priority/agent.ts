import fs from "node:fs";
import path from "node:path";
import type { UrlMappingRow } from "../mapping-agent/types";
import { runLegacyUrlMappingAgent } from "../mapping-agent/agent";
import { enrichMappingRowsWithSeoPriority } from "./enrich";
import { renderSeoPriorityMigrationMapMarkdown } from "./report";
import {
  SEO_PRIORITY_MIGRATION_AGENT,
  type DataAvailabilityReport,
  type SeoPriorityRow,
} from "./types";

export type SeoPriorityMigrationOptions = {
  write?: boolean;
  importPath?: string;
  /** Reuse mapping rows instead of re-running mapping agent */
  mappingRows?: UrlMappingRow[];
  generatedAt?: string;
};

export type SeoPriorityMigrationResult = {
  agent: typeof SEO_PRIORITY_MIGRATION_AGENT;
  availability: DataAvailabilityReport;
  rows: SeoPriorityRow[];
  paths: { markdown: string; json: string; availability: string };
};

const OUT_DIR = path.join(process.cwd(), "docs", "migration");
const DATA_DIR = path.join(OUT_DIR, "data");

function loadMappingRowsFromDisk(): UrlMappingRow[] | null {
  const file = path.join(DATA_DIR, "url-mapping-plan.json");
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf8")) as UrlMappingRow[];
}

/**
 * SeoPriorityMigrationAgent — enrich mapping plan with historical SEO importance.
 * Does not invent metrics. Does not implement redirects.
 */
export function runSeoPriorityMigrationAgent(
  opts: SeoPriorityMigrationOptions = {},
): SeoPriorityMigrationResult {
  const generatedAt = opts.generatedAt ?? new Date().toISOString();
  const write = opts.write !== false;

  let mappingRows = opts.mappingRows ?? loadMappingRowsFromDisk();
  if (!mappingRows) {
    const mapped = runLegacyUrlMappingAgent({ write: false });
    mappingRows = mapped.rows;
  }

  const { availability, enriched } = enrichMappingRowsWithSeoPriority(
    mappingRows,
    { importPath: opts.importPath },
  );

  const paths = {
    markdown: path.join(OUT_DIR, "03-seo-priority-migration-map.md"),
    json: path.join(DATA_DIR, "seo-priority-migration-map.json"),
    availability: path.join(DATA_DIR, "seo-data-availability.json"),
  };

  if (write) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    const markdown = renderSeoPriorityMigrationMapMarkdown({
      generatedAt,
      availability,
      rows: enriched,
    });
    fs.writeFileSync(paths.markdown, markdown);
    fs.writeFileSync(paths.json, `${JSON.stringify(enriched, null, 2)}\n`);
    fs.writeFileSync(
      paths.availability,
      `${JSON.stringify(availability, null, 2)}\n`,
    );
  }

  return {
    agent: SEO_PRIORITY_MIGRATION_AGENT,
    availability,
    rows: enriched,
    paths,
  };
}
