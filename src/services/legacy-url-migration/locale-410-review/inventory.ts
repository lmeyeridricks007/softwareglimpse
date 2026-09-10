import fs from "node:fs";
import path from "node:path";
import {
  LEGACY_LOCALE_PREFIXES,
  ensureCutoverPath,
  getLocalePrefix,
} from "@/seo/english-only-cutover";
import { loadExternalEnrichmentEvidence } from "@/services/seo/enrichment-lanes/external-evidence";
import { normalizeMigrationPath } from "../normalize";
import type { BacklinkPathSignals, GscPathSignals } from "./types";

export type PrimaryEnRow = {
  loc: string;
  title?: string | null;
  lastmod?: string | null;
  legacyPageType?: string | null;
  pageTypeGuess?: string | null;
  hreflangAlts?: Array<{ href: string; hreflang?: string }>;
};

export type UnmappedLocaleTopic = {
  enPath: string;
  localePaths: string[];
  title: string | null;
  lastmod: string | null;
  legacyPageType: string | null;
};

function pathOf(urlOrPath: string): string {
  try {
    if (/^https?:\/\//i.test(urlOrPath)) {
      return ensureCutoverPath(new URL(urlOrPath).pathname);
    }
  } catch {
    // fall through
  }
  return ensureCutoverPath(urlOrPath);
}

export function isLocalePath(p: string): boolean {
  return getLocalePrefix(p) !== null;
}

export function loadLocaleCutoverRedirects(
  cwd: string = process.cwd(),
): Record<string, string> {
  const file = path.join(cwd, "config/legacy-locale-cutover.json");
  const raw = JSON.parse(fs.readFileSync(file, "utf8")) as {
    redirects?: Record<string, string>;
  };
  return raw.redirects ?? {};
}

export function loadPrimaryEnInventory(
  cwd: string = process.cwd(),
): PrimaryEnRow[] {
  const file = path.join(cwd, "docs/migration/data/legacy-primary-en.json");
  return JSON.parse(fs.readFileSync(file, "utf8")) as PrimaryEnRow[];
}

/**
 * English hreflang siblings whose locale alternates are NOT in the cutover 301 map
 * (today → 410 via Proxy catch-all). Locale roots included.
 */
export function inventoryUnmappedLocaleTopics(opts?: {
  cwd?: string;
  cutoverRedirects?: Record<string, string>;
  primary?: PrimaryEnRow[];
}): UnmappedLocaleTopic[] {
  const cwd = opts?.cwd ?? process.cwd();
  const redirects = opts?.cutoverRedirects ?? loadLocaleCutoverRedirects(cwd);
  const redirectKeys = new Set(Object.keys(redirects));
  const primary = opts?.primary ?? loadPrimaryEnInventory(cwd);

  const byEn = new Map<string, UnmappedLocaleTopic>();

  for (const row of primary) {
    const enPath = pathOf(row.loc);
    for (const alt of row.hreflangAlts ?? []) {
      const localePath = pathOf(alt.href);
      if (!isLocalePath(localePath)) continue;
      if (
        redirectKeys.has(localePath) ||
        redirectKeys.has(decodeURIComponent(localePath))
      ) {
        continue;
      }
      const cur = byEn.get(enPath) ?? {
        enPath,
        localePaths: [],
        title: row.title ?? null,
        lastmod: row.lastmod ?? null,
        legacyPageType: row.legacyPageType ?? row.pageTypeGuess ?? null,
      };
      cur.localePaths.push(localePath);
      byEn.set(enPath, cur);
    }
  }

  return [...byEn.values()].sort((a, b) => a.enPath.localeCompare(b.enPath));
}

export function loadGscByPath(cwd: string = process.cwd()): {
  available: boolean;
  byPath: Map<string, { clicks: number; impressions: number }>;
} {
  const file = path.join(cwd, "docs/migration/data/gsc-export.json");
  const byPath = new Map<string, { clicks: number; impressions: number }>();
  if (!fs.existsSync(file)) {
    return { available: false, byPath };
  }
  try {
    const raw = JSON.parse(fs.readFileSync(file, "utf8")) as {
      synthetic?: boolean;
      rows?: Array<{
        page: string;
        clicks?: number;
        impressions?: number;
      }>;
    };
    if (raw.synthetic) return { available: false, byPath };
    for (const row of raw.rows ?? []) {
      const p = pathOf(row.page);
      const cur = byPath.get(p) ?? { clicks: 0, impressions: 0 };
      cur.clicks += row.clicks ?? 0;
      cur.impressions += row.impressions ?? 0;
      byPath.set(p, cur);
    }
    return { available: true, byPath };
  } catch {
    return { available: false, byPath };
  }
}

export function gscForPath(
  byPath: Map<string, { clicks: number; impressions: number }>,
  available: boolean,
  target: string,
): GscPathSignals {
  const hit = byPath.get(normalizeMigrationPath(target));
  return {
    clicks: hit?.clicks ?? 0,
    impressions: hit?.impressions ?? 0,
    available,
  };
}

export function gscForPaths(
  byPath: Map<string, { clicks: number; impressions: number }>,
  available: boolean,
  targets: string[],
): GscPathSignals {
  let clicks = 0;
  let impressions = 0;
  for (const t of targets) {
    const hit = byPath.get(normalizeMigrationPath(t));
    if (!hit) continue;
    clicks += hit.clicks;
    impressions += hit.impressions;
  }
  return { clicks, impressions, available };
}

export function loadBacklinkSignals(cwd: string = process.cwd()): {
  available: boolean;
  validity: BacklinkPathSignals["validity"];
  byPath: Map<string, number>;
} {
  const evidence = loadExternalEnrichmentEvidence(cwd);
  return {
    available: evidence.backlinkValidity === "REAL",
    validity: evidence.backlinkValidity,
    byPath: evidence.backlinksByPath,
  };
}

export function backlinksForPath(
  byPath: Map<string, number>,
  validity: BacklinkPathSignals["validity"],
  available: boolean,
  target: string,
): BacklinkPathSignals {
  const n = byPath.get(normalizeMigrationPath(target));
  return {
    referringDomains: available && typeof n === "number" ? n : null,
    available,
    validity,
  };
}

export function loadUrlMappingPlanByPath(
  cwd: string = process.cwd(),
): Map<
  string,
  {
    legacyTitle?: string | null;
    legacyIntent?: string | null;
    legacyPageType?: string | null;
    recommendedAction?: string | null;
    matchBasis?: string | null;
    reason?: string | null;
    newPath?: string | null;
  }
> {
  const file = path.join(cwd, "docs/migration/data/url-mapping-plan.json");
  const map = new Map<
    string,
    {
      legacyTitle?: string | null;
      legacyIntent?: string | null;
      legacyPageType?: string | null;
      recommendedAction?: string | null;
      matchBasis?: string | null;
      reason?: string | null;
      newPath?: string | null;
    }
  >();
  if (!fs.existsSync(file)) return map;
  const rows = JSON.parse(fs.readFileSync(file, "utf8")) as Array<{
    legacyPath: string;
    legacyTitle?: string | null;
    legacyIntent?: string | null;
    legacyPageType?: string | null;
    recommendedAction?: string | null;
    matchBasis?: string | null;
    reason?: string | null;
    newPath?: string | null;
  }>;
  for (const row of rows) {
    map.set(normalizeMigrationPath(row.legacyPath), row);
  }
  return map;
}

export { LEGACY_LOCALE_PREFIXES };
