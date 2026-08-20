import { buildNewUrlInventory } from "../inventory-new";
import type { NewUrlInventoryRow } from "../types";
import { normalizeMigrationPath } from "../normalize";
import { getSitemapEntries } from "@/seo/sitemap";
import { PATH_ALIASES_FOR_VALIDATION } from "./load-redirects";

export type DestinationValidation = {
  ok: boolean;
  exists: boolean;
  inSitemap: boolean;
  notes: string[];
};

export function buildDestinationIndex(now: Date = new Date()): {
  byPath: Map<string, NewUrlInventoryRow>;
  sitemap: Set<string>;
} {
  const inventory = buildNewUrlInventory(now);
  const byPath = new Map(inventory.map((r) => [r.path, r]));
  const sitemap = new Set(
    getSitemapEntries(now).map((e) => {
      try {
        return normalizeMigrationPath(new URL(e.url).pathname);
      } catch {
        return normalizeMigrationPath(e.url);
      }
    }),
  );
  return { byPath, sitemap };
}

/**
 * Validate redirect destinations against the new app inventory / sitemap.
 * Static validation (no live HTTP) — suitable for CI and generator.
 */
export function validateRedirectDestination(
  destination: string,
  index: ReturnType<typeof buildDestinationIndex> = buildDestinationIndex(),
): DestinationValidation {
  const dest = normalizeMigrationPath(destination);
  const notes: string[] = [];

  const aliased =
    PATH_ALIASES_FOR_VALIDATION[dest] ??
    PATH_ALIASES_FOR_VALIDATION[dest.replace(/\/$/, "")];
  const resolved = aliased ? normalizeMigrationPath(aliased) : dest;

  if (resolved === "/") {
    notes.push("Homepage destination forbidden by policy");
    return { ok: false, exists: true, inSitemap: true, notes };
  }

  const row = index.byPath.get(resolved);
  const exists = Boolean(row);
  const inSitemap = index.sitemap.has(resolved);

  if (!exists) {
    notes.push(`Destination ${resolved} not found in new URL inventory`);
  }
  if (row && row.indexable === false) {
    notes.push(
      `Destination ${resolved} is intentionally non-indexable (${row.pageType}) — allowed when appropriate`,
    );
  }
  if (exists && !inSitemap && row?.indexable !== false) {
    notes.push(
      `Destination ${resolved} exists but is not in sitemap — verify publish/indexability`,
    );
  }

  return {
    ok: exists,
    exists,
    inSitemap,
    notes,
  };
}

export function assertNoRedirectChains(
  redirects: Array<{ source: string; destination: string }>,
): string[] {
  const map = new Map(
    redirects.map((r) => [
      normalizeMigrationPath(r.source),
      normalizeMigrationPath(r.destination),
    ]),
  );
  const problems: string[] = [];
  for (const [source, dest] of map) {
    if (map.has(dest)) {
      problems.push(
        `Chain risk: ${source} → ${dest} → ${map.get(dest)} (should be flattened)`,
      );
    }
  }
  return problems;
}
