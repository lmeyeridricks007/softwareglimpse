import fs from "node:fs";
import path from "node:path";
import { ensureCutoverPath } from "@/seo/english-only-cutover";
import { normalizeMigrationPath } from "../normalize";
import type { Locale410TopicRow } from "./types";

export type LocaleCutoverFile = {
  version: number;
  generatedAt: string;
  generator: string;
  policy: {
    englishOnly: boolean;
    noHomepageDump: boolean;
    hreflangMappedRedirects: boolean;
  };
  redirects: Record<string, string>;
  stats?: Record<string, number>;
  review?: {
    locale410ReviewAt?: string;
    repairsApplied?: number;
    note?: string;
  };
};

export type ApplyLocale410RepairsResult = {
  cutoverPath: string;
  enRedirectsPath: string;
  localeRedirectsAdded: number;
  enRedirectsAdded: number;
  skippedUnsafe: number;
  destinations: Record<string, string>;
};

function isSafeDestination(dest: string): boolean {
  const d = ensureCutoverPath(dest);
  if (d === "/") return false;
  const first = d.split("/").filter(Boolean)[0]?.toLowerCase();
  if (
    first &&
    ["fr", "de", "es", "nl", "zh", "hi", "ar", "pt", "it", "ja"].includes(first)
  ) {
    return false;
  }
  return true;
}

/**
 * Patch locale cutover 301 map + append EN legacy redirects for repaired topics.
 * Does not create pages. Junk stays 410.
 */
export function applyLocale410Repairs(
  repairs: Locale410TopicRow[],
  opts?: { cwd?: string; dryRun?: boolean },
): ApplyLocale410RepairsResult {
  const cwd = opts?.cwd ?? process.cwd();
  const cutoverPath = path.join(cwd, "config/legacy-locale-cutover.json");
  const enRedirectsPath = path.join(cwd, "config/legacy-redirects.json");

  const cutover = JSON.parse(
    fs.readFileSync(cutoverPath, "utf8"),
  ) as LocaleCutoverFile;
  const enFile = JSON.parse(fs.readFileSync(enRedirectsPath, "utf8")) as {
    redirects: Array<{
      source: string;
      destination: string;
      permanent?: boolean;
      id?: string;
      reason?: string;
    }>;
  };

  const enSources = new Set(
    enFile.redirects.map((r) => normalizeMigrationPath(r.source)),
  );

  let localeRedirectsAdded = 0;
  let enRedirectsAdded = 0;
  let skippedUnsafe = 0;
  const destinations: Record<string, string> = {};

  for (const row of repairs) {
    if (row.disposition !== "ADD_301" || !row.proposedDestination) continue;
    const dest = ensureCutoverPath(row.proposedDestination);
    if (!isSafeDestination(dest)) {
      skippedUnsafe += 1;
      continue;
    }
    destinations[row.enPath] = dest;

    for (const localePath of row.localePaths) {
      const src = ensureCutoverPath(localePath);
      if (!cutover.redirects[src]) {
        cutover.redirects[src] = dest;
        localeRedirectsAdded += 1;
      } else if (cutover.redirects[src] !== dest) {
        // Prefer curated repair over stale map
        cutover.redirects[src] = dest;
      }
    }

    const enSource = normalizeMigrationPath(row.enPath);
    if (!enSources.has(enSource) && enSource !== dest) {
      enFile.redirects.push({
        source: enSource,
        destination: dest,
        permanent: true,
        id: `redir-${enSource.replace(/^\/|\/$/g, "").replace(/\//g, "__")}`,
        reason: `Locale-410 equity repair: ${row.absorbReason ?? "genuine EN absorb"}`,
      });
      enSources.add(enSource);
      enRedirectsAdded += 1;
    }
  }

  // Stable key order for cutover redirects
  const sorted = Object.fromEntries(
    Object.entries(cutover.redirects).sort(([a], [b]) => a.localeCompare(b)),
  );
  cutover.redirects = sorted;
  cutover.generatedAt = new Date().toISOString();
  cutover.generator = "Locale410TopicReview apply";
  cutover.stats = {
    ...(cutover.stats ?? {}),
    redirectCount: Object.keys(sorted).length,
  };
  cutover.review = {
    locale410ReviewAt: cutover.generatedAt,
    repairsApplied: Object.keys(destinations).length,
    note: "Genuine EN absorbs only; junk locale URLs remain 410; no multilingual restore",
  };

  enFile.redirects.sort((a, b) => a.source.localeCompare(b.source));

  if (!opts?.dryRun) {
    fs.writeFileSync(cutoverPath, `${JSON.stringify(cutover, null, 2)}\n`);
    fs.writeFileSync(enRedirectsPath, `${JSON.stringify(enFile, null, 2)}\n`);
  }

  return {
    cutoverPath,
    enRedirectsPath,
    localeRedirectsAdded,
    enRedirectsAdded,
    skippedUnsafe,
    destinations,
  };
}
