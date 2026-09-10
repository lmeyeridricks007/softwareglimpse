/**
 * Derive REAL backlink export metrics — never invent counts without rows.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { getSiteUrl } from "@/lib/site";
import { hostnameOf } from "./ingest";
import type { CompetitorLinkGap, LoadedBacklinkExport, ReferringDomainRow } from "./types";

export type BacklinkExportMetrics = {
  referringDomains: number;
  backlinks: number;
  linkedPages: number;
  /** Mean topicalRelevance from scored competitor gaps when available. */
  topicalRelevanceAverage: number | null;
  newReferringDomains: number | null;
  lostReferringDomains: number | null;
  newLostAvailable: boolean;
  linksToResearchAssets: number;
  linksToCommercialPages: number;
  sampleResearchTargets: string[];
  sampleCommercialTargets: string[];
  topReferringDomains: Array<{ domain: string; links: number }>;
  notes: string[];
};

export type ReferringDomainSnapshot = {
  savedAt: string;
  exportDate: string | null;
  sourceFilename: string | null;
  /** Unique referring domains observed linking to SoftwareGlimpse. */
  domains: string[];
};

const SNAPSHOT_REL = "data/seo/backlink-rd-snapshot.json";

const RESEARCH_PATH_RE =
  /^\/(research|guides|company\/(?:editorial-methodology|how-we-review))/i;
const COMMERCIAL_PATH_RE =
  /^\/(best|tools|software|pricing|compare|alternatives|categories|resources)\b/i;

function pathnameOfTarget(targetUrl: string): string | null {
  try {
    const raw = targetUrl.startsWith("http") ? targetUrl : `https://${targetUrl}`;
    const u = new URL(raw);
    return (u.pathname.replace(/\/$/, "") || "/") + "/";
  } catch {
    return null;
  }
}

function hostIsOurs(targetUrl: string, sgHost: string): boolean {
  const host = hostnameOf(targetUrl);
  if (!host) return false;
  return host === sgHost || host.endsWith(`.${sgHost}`);
}

export function classifyTargetPath(
  pathname: string,
): "research" | "commercial" | "other" {
  if (RESEARCH_PATH_RE.test(pathname)) return "research";
  if (COMMERCIAL_PATH_RE.test(pathname)) return "commercial";
  return "other";
}

export function loadReferringDomainSnapshot(
  cwd = process.cwd(),
): ReferringDomainSnapshot | null {
  const abs = path.join(cwd, SNAPSHOT_REL);
  if (!existsSync(abs)) return null;
  try {
    const parsed = JSON.parse(readFileSync(abs, "utf8")) as ReferringDomainSnapshot;
    if (!Array.isArray(parsed.domains)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveReferringDomainSnapshot(
  snapshot: ReferringDomainSnapshot,
  cwd = process.cwd(),
): string {
  const abs = path.join(cwd, SNAPSHOT_REL);
  mkdirSync(path.dirname(abs), { recursive: true });
  writeFileSync(abs, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
  return abs;
}

/**
 * Compute metrics from a REAL (or test-allowed) export.
 * New/lost RDs require a prior snapshot of SG-facing referring domains.
 */
export function computeBacklinkExportMetrics(
  exportData: LoadedBacklinkExport,
  opts: {
    gaps?: CompetitorLinkGap[];
    previousSnapshot?: ReferringDomainSnapshot | null;
    cwd?: string;
    persistSnapshot?: boolean;
  } = {},
): BacklinkExportMetrics {
  const notes: string[] = [];
  const sgHost = hostnameOf(getSiteUrl()) ?? "softwareglimpse.com";
  const rows = exportData.rows;

  const uniqueDomains = new Set(rows.map((r) => r.domain.toLowerCase()));
  const sgRows = rows.filter((r) => hostIsOurs(r.targetUrl, sgHost));
  const sgDomains = new Set(sgRows.map((r) => r.domain.toLowerCase()));

  const linkedPageSet = new Set<string>();
  let linksToResearch = 0;
  let linksToCommercial = 0;
  const researchTargets = new Set<string>();
  const commercialTargets = new Set<string>();

  for (const row of sgRows) {
    const pathname = pathnameOfTarget(row.targetUrl);
    if (!pathname) continue;
    linkedPageSet.add(pathname);
    const kind = classifyTargetPath(pathname);
    if (kind === "research") {
      linksToResearch += 1;
      researchTargets.add(pathname);
    } else if (kind === "commercial") {
      linksToCommercial += 1;
      commercialTargets.add(pathname);
    }
  }

  if (sgRows.length === 0) {
    notes.push(
      "No rows targeting SoftwareGlimpse host — referring-domain / page metrics reflect whole export domains; research/commercial link counts are 0.",
    );
  }

  const gaps = opts.gaps ?? [];
  const relevances = gaps
    .map((g) => g.topicalRelevance)
    .filter((n) => typeof n === "number" && n > 0);
  const topicalRelevanceAverage =
    relevances.length > 0
      ? Math.round(
          (relevances.reduce((a, b) => a + b, 0) / relevances.length) * 10,
        ) / 10
      : null;

  const previous =
    opts.previousSnapshot !== undefined
      ? opts.previousSnapshot
      : loadReferringDomainSnapshot(opts.cwd ?? process.cwd());

  let newReferringDomains: number | null = null;
  let lostReferringDomains: number | null = null;
  let newLostAvailable = false;

  const hasSeenDates = rows.some((r) => r.firstSeen || r.lastSeen);
  if (previous && previous.domains.length > 0 && sgDomains.size > 0) {
    const prev = new Set(previous.domains.map((d) => d.toLowerCase()));
    let neu = 0;
    let lost = 0;
    for (const d of sgDomains) {
      if (!prev.has(d)) neu += 1;
    }
    for (const d of prev) {
      if (!sgDomains.has(d)) lost += 1;
    }
    newReferringDomains = neu;
    lostReferringDomains = lost;
    newLostAvailable = true;
    notes.push(
      `New/lost vs snapshot ${previous.savedAt.slice(0, 10)} (${previous.domains.length} prior SG RDs).`,
    );
  } else if (hasSeenDates) {
    notes.push(
      "Export includes first_seen/last_seen but no prior RD snapshot — new/lost unavailable until a second REAL import.",
    );
  } else {
    notes.push(
      "New/lost referring domains unavailable (no prior snapshot and no first_seen/last_seen delta).",
    );
  }

  if (opts.persistSnapshot !== false && sgDomains.size > 0) {
    saveReferringDomainSnapshot(
      {
        savedAt: new Date().toISOString(),
        exportDate: exportData.meta.exportDate,
        sourceFilename: exportData.meta.filename,
        domains: [...sgDomains].sort(),
      },
      opts.cwd ?? process.cwd(),
    );
  }

  const rdSource = sgRows.length > 0 ? sgRows : rows;
  const rdCounts = new Map<string, number>();
  for (const row of rdSource) {
    const d = row.domain.toLowerCase();
    rdCounts.set(d, (rdCounts.get(d) ?? 0) + 1);
  }
  const topReferringDomains = [...rdCounts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 15)
    .map(([domain, links]) => ({ domain, links }));
  if (sgRows.length === 0 && topReferringDomains.length > 0) {
    notes.push(
      "Top referring domains listed from whole export (no SG-target rows); do not treat as earned SG links.",
    );
  }

  return {
    referringDomains: uniqueDomains.size,
    backlinks: rows.length,
    linkedPages: linkedPageSet.size,
    topicalRelevanceAverage,
    newReferringDomains,
    lostReferringDomains,
    newLostAvailable,
    linksToResearchAssets: linksToResearch,
    linksToCommercialPages: linksToCommercial,
    sampleResearchTargets: [...researchTargets].slice(0, 8),
    sampleCommercialTargets: [...commercialTargets].slice(0, 8),
    topReferringDomains,
    notes,
  };
}

/** @internal test helper */
export function _sgRowsForTest(
  rows: ReferringDomainRow[],
  sgHost = "softwareglimpse.com",
): ReferringDomainRow[] {
  return rows.filter((r) => hostIsOurs(r.targetUrl, sgHost));
}
