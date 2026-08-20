import fs from "node:fs";
import path from "node:path";
import type { UrlMappingRow } from "../mapping-agent/types";
import type { SeoPriorityRow } from "../seo-priority/types";
import type { LegacyRedirectsFile } from "../redirect-plan/types";
import { loadLegacyRedirectsFile } from "../redirect-plan/load-redirects";
import { buildNewUrlInventory } from "../inventory-new";
import type { NewUrlInventoryRow } from "../types";
import { getSitemapEntries } from "@/seo/sitemap";
import { normalizeMigrationPath } from "../normalize";
import { collectCrmOutboundEdges } from "@/services/internal-linking/outbound-graph";

const DATA_DIR = path.join(process.cwd(), "docs", "migration", "data");

export type AuditInputs = {
  mappingRows: UrlMappingRow[];
  seoPriority: SeoPriorityRow[];
  redirects: LegacyRedirectsFile;
  inventory: NewUrlInventoryRow[];
  inventoryByPath: Map<string, NewUrlInventoryRow>;
  sitemapPaths: Set<string>;
  redirectBySource: Map<string, string>;
  redirectSources: Set<string>;
  internalLinkEdges: Array<{ from: string; to: string }>;
  importanceByPath: Map<string, SeoPriorityRow>;
};

function readJson<T>(file: string): T | null {
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf8")) as T;
}

export function loadAuditInputs(now: Date = new Date()): AuditInputs {
  const mappingRows =
    readJson<UrlMappingRow[]>(path.join(DATA_DIR, "url-mapping-plan.json")) ??
    [];
  const seoPriority =
    readJson<SeoPriorityRow[]>(
      path.join(DATA_DIR, "seo-priority-migration-map.json"),
    ) ?? [];

  let redirects: LegacyRedirectsFile;
  try {
    redirects = loadLegacyRedirectsFile();
  } catch {
    redirects = {
      version: 1,
      generatedAt: now.toISOString(),
      generator: "missing",
      policy: {
        onlyHighConfidence: true,
        permanentOnly: true,
        flattenChains: true,
        noHomepageDump: true,
        noMiddleware: true,
      },
      redirects: [],
      retired: [],
      excludedManual: [],
      stats: {
        redirects: 0,
        autoApproved: 0,
        manualExcluded: 0,
        retiredPatterns: 0,
        chainsFlattened: 0,
      },
    };
  }

  const inventory = buildNewUrlInventory(now);
  const inventoryByPath = new Map(inventory.map((r) => [r.path, r]));
  const sitemapPaths = new Set(
    getSitemapEntries(now).map((e) => {
      try {
        return normalizeMigrationPath(new URL(e.url).pathname);
      } catch {
        return normalizeMigrationPath(e.url);
      }
    }),
  );

  const redirectBySource = new Map<string, string>();
  for (const r of redirects.redirects) {
    redirectBySource.set(
      normalizeMigrationPath(r.source),
      normalizeMigrationPath(r.destination),
    );
  }
  const redirectSources = new Set(redirectBySource.keys());

  const internalLinkEdges = collectCrmOutboundEdges().map((e) => ({
    from: normalizeMigrationPath(e.from),
    to: normalizeMigrationPath(e.to),
  }));

  const importanceByPath = new Map(
    seoPriority.map((r) => [normalizeMigrationPath(r.legacyPath), r]),
  );

  return {
    mappingRows,
    seoPriority,
    redirects,
    inventory,
    inventoryByPath,
    sitemapPaths,
    redirectBySource,
    redirectSources,
    internalLinkEdges,
    importanceByPath,
  };
}
