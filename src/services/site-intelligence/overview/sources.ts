import fs from "node:fs";
import path from "node:path";

export type ReportSourceStatus = "available" | "missing" | "stale";

export type ReportSource = {
  id: string;
  label: string;
  path: string;
  status: ReportSourceStatus;
  mtimeIso?: string;
  notes?: string;
};

export type SeoIssuesSnapshot = {
  generatedAt?: string;
  mode?: string;
  findings: Array<{
    id: string;
    severity?: string;
    area?: string;
    problem?: string;
    affectedPages?: string[];
  }>;
};

export type ContentScoreSnapshot = {
  generatedAt: string;
  mode: string;
  scope: string;
  pages: Record<
    string,
    {
      score: number;
      band: string;
      pageType: string;
      priority: string;
      title?: string;
    }
  >;
};

const ROOT = process.cwd();

function abs(...parts: string[]): string {
  return path.join(ROOT, ...parts);
}

function fileMeta(rel: string): {
  exists: boolean;
  mtimeIso?: string;
  absPath: string;
} {
  const absPath = abs(rel);
  if (!fs.existsSync(absPath)) return { exists: false, absPath };
  const st = fs.statSync(absPath);
  return { exists: true, mtimeIso: st.mtime.toISOString(), absPath };
}

function source(
  id: string,
  label: string,
  rel: string,
  staleDays = 14,
): ReportSource {
  const meta = fileMeta(rel);
  if (!meta.exists) {
    return { id, label, path: rel, status: "missing" };
  }
  const ageMs =
    Date.now() - new Date(meta.mtimeIso ?? Date.now()).getTime();
  const stale = ageMs > staleDays * 24 * 60 * 60 * 1000;
  return {
    id,
    label,
    path: rel,
    status: stale ? "stale" : "available",
    mtimeIso: meta.mtimeIso,
    notes: stale
      ? `Older than ${staleDays}d — prefer refresh before claiming freshness`
      : undefined,
  };
}

export function listOverviewReportSources(): ReportSource[] {
  return [
    source("seo-health", "Technical SEO / SEO Health", "docs/seo/reports/SEO-HEALTH-LATEST.md"),
    source("seo-technical", "Technical SEO agent", "docs/seo/reports/technical-seo-latest.md"),
    source("seo-performance", "Performance", "docs/seo/reports/performance-latest.md"),
    source("seo-links", "Internal Linking", "docs/seo/reports/internal-linking-latest.md"),
    source("seo-issues", "SEO issues snapshot", "docs/seo/reports/archive/seo-issues-latest.json"),
    source(
      "content-intelligence",
      "Content Intelligence",
      "docs/content-quality/CONTENT-INTELLIGENCE-LATEST.md",
    ),
    source(
      "content-quality",
      "Content Quality",
      "docs/content-quality/CONTENT-QUALITY-LATEST.md",
    ),
    source(
      "content-scores",
      "Content score snapshot",
      "docs/content-quality/archive/scores-latest.json",
    ),
    source(
      "content-backlog",
      "Content improvement backlog",
      "docs/content-quality/CONTENT-IMPROVEMENT-BACKLOG.md",
    ),
    source(
      "content-map-coverage",
      "Content Map coverage",
      "docs/content-quality/CONTENT-MAP-COVERAGE-LATEST.md",
    ),
    source(
      "content-map",
      "CRM master content map",
      "docs/content-ecosystem/04-crm-master-content-map.md",
    ),
    source(
      "asset-intelligence",
      "Asset Intelligence",
      "docs/content-assets/ASSET-INTELLIGENCE-LATEST.md",
    ),
    source(
      "resource-audit",
      "Resource Quality",
      "docs/content-ecosystem/resources/RESOURCE-AUDIT.md",
    ),
  ];
}

export function readTextIfExists(rel: string): string | null {
  const meta = fileMeta(rel);
  if (!meta.exists) return null;
  return fs.readFileSync(meta.absPath, "utf8");
}

export function loadSeoIssuesSnapshot(): SeoIssuesSnapshot | null {
  const raw = readTextIfExists(
    "docs/seo/reports/archive/seo-issues-latest.json",
  );
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as SeoIssuesSnapshot;
    return {
      generatedAt: parsed.generatedAt,
      mode: parsed.mode,
      findings: Array.isArray(parsed.findings) ? parsed.findings : [],
    };
  } catch {
    return null;
  }
}

export function loadContentScoreSnapshot(): ContentScoreSnapshot | null {
  const raw = readTextIfExists(
    "docs/content-quality/archive/scores-latest.json",
  );
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ContentScoreSnapshot;
  } catch {
    return null;
  }
}

export function parseSeoHealthSkippedChecks(md: string | null): Array<{
  id: string;
  status: "skipped" | "failed" | "completed";
  reason?: string;
  agent?: string;
}> {
  if (!md) return [];
  const checks: Array<{
    id: string;
    status: "skipped" | "failed" | "completed";
    reason?: string;
    agent?: string;
  }> = [];

  const completedMatch = md.match(/\|\s*Checks completed\s*\|\s*(\d+)\s*\|/i);
  const skippedMatch = md.match(/\|\s*Checks skipped\s*\|\s*(\d+)\s*\|/i);
  const failedMatch = md.match(/\|\s*Checks failed\s*\|\s*(\d+)\s*\|/i);
  const completed = completedMatch ? Number(completedMatch[1]) : 0;
  const skipped = skippedMatch ? Number(skippedMatch[1]) : 0;
  const failed = failedMatch ? Number(failedMatch[1]) : 0;

  for (let i = 0; i < completed; i++) {
    checks.push({ id: `completed-${i}`, status: "completed" });
  }
  for (let i = 0; i < failed; i++) {
    checks.push({ id: `failed-${i}`, status: "failed", reason: "See SEO-HEALTH-LATEST" });
  }

  const skipSection = md.split(/## Checks skipped/i)[1]?.split(/^## /m)[0] ?? "";
  const skipLines = skipSection
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.startsWith("- **"));
  for (const line of skipLines) {
    const m = line.match(/-\s*\*\*(.+?)\*\*\s*\/\s*`([^`]+)`:\s*(.+)$/);
    if (m) {
      checks.push({
        id: m[2]!,
        status: "skipped",
        agent: m[1],
        reason: m[3],
      });
    } else {
      checks.push({
        id: `skipped-${checks.filter((c) => c.status === "skipped").length}`,
        status: "skipped",
        reason: line.replace(/^-\s*/, ""),
      });
    }
  }
  if (skipLines.length === 0 && skipped > 0) {
    for (let i = 0; i < skipped; i++) {
      checks.push({
        id: `skipped-count-${i}`,
        status: "skipped",
        reason: "Listed in SEO health summary",
      });
    }
  }
  return checks;
}

export function parseInternalLinkSummary(md: string | null): {
  edges?: number;
  orphans?: number;
  weak?: number;
  findings?: number;
} {
  if (!md) return {};
  const m = md.match(
    /Internal linking:\s*(\d+)\s*edges,\s*(\d+)\s*orphans,\s*(\d+)\s*weak,\s*(\d+)\s*finding/i,
  );
  if (!m) return {};
  return {
    edges: Number(m[1]),
    orphans: Number(m[2]),
    weak: Number(m[3]),
    findings: Number(m[4]),
  };
}

export function parseAssetIntelligenceSummary(md: string | null): {
  software?: number;
  guides?: number;
  researchMedia?: number;
  backlogA0?: number;
  backlogA1?: number;
} {
  if (!md) return {};
  const inv = md.match(
    /\*\*Inventory:\*\*\s*(\d+)\s*software\s*·\s*(\d+)\s*guides\s*·\s*(\d+)\s*ResearchMedia/i,
  );
  const a0 = md.match(/\|\s*Backlog A0\s*\|\s*(\d+)\s*\|/i);
  const a1 = md.match(/\|\s*Backlog A1\s*\|\s*(\d+)\s*\|/i);
  return {
    software: inv ? Number(inv[1]) : undefined,
    guides: inv ? Number(inv[2]) : undefined,
    researchMedia: inv ? Number(inv[3]) : undefined,
    backlogA0: a0 ? Number(a0[1]) : undefined,
    backlogA1: a1 ? Number(a1[1]) : undefined,
  };
}

export function parseMapCoverageSummary(md: string | null): {
  total?: number;
  missing?: number;
  thin?: number;
  optional?: number;
  missingIds: string[];
  thinIds: string[];
} {
  const out = {
    total: undefined as number | undefined,
    missing: undefined as number | undefined,
    thin: undefined as number | undefined,
    optional: undefined as number | undefined,
    missingIds: [] as string[],
    thinIds: [] as string[],
  };
  if (!md) return out;
  const total = md.match(/\|\s*Total map rows\s*\|\s*(\d+)\s*\|/i);
  const missing = md.match(/\|\s*Missing \/ NOT-YET\s*\|\s*(\d+)\s*\|/i);
  const thin = md.match(/\|\s*Thin \/ research\s*\|\s*(\d+)\s*\|/i);
  const optional = md.match(/\|\s*Optional\s*\|\s*(\d+)\s*\|/i);
  out.total = total ? Number(total[1]) : undefined;
  out.missing = missing ? Number(missing[1]) : undefined;
  out.thin = thin ? Number(thin[1]) : undefined;
  out.optional = optional ? Number(optional[1]) : undefined;

  const missingSection =
    md.split(/## Missing \/ not-yet-implemented/i)[1]?.split(/^## /m)[0] ?? "";
  for (const line of missingSection.split("\n")) {
    const m = line.match(/`([A-Z0-9-]+)`/);
    if (m) out.missingIds.push(m[1]!);
  }
  const thinSection =
    md.split(/## Thin \/ research-required/i)[1]?.split(/^## /m)[0] ?? "";
  for (const line of thinSection.split("\n")) {
    const m = line.match(/`([A-Z0-9-]+)`/);
    if (m) out.thinIds.push(m[1]!);
  }
  return out;
}

export function parseResourceAuditSummary(md: string | null): {
  resourcesLive?: number;
  improve?: number;
  restructure?: number;
} {
  if (!md) return {};
  const live = md.match(/\|\s*Resources live\s*\|\s*(\d+)\s*\|/i);
  const improve = md.match(/\|\s*Recommended IMPROVE\s*\|\s*(\d+)\s*\|/i);
  const restructure = md.match(
    /\|\s*Recommended RESTRUCTURE\s*\|\s*(\d+)\s*\|/i,
  );
  return {
    resourcesLive: live ? Number(live[1]) : undefined,
    improve: improve ? Number(improve[1]) : undefined,
    restructure: restructure ? Number(restructure[1]) : undefined,
  };
}

export type BacklogRecRow = {
  priority: string;
  route: string;
  pageType: string;
  score: string;
  issue: string;
  action: string;
  effort: string;
  impact: string;
  relatedId?: string;
};

/** Parse top ranked rows from CONTENT-IMPROVEMENT-BACKLOG.md */
export function parseImprovementBacklogTop(
  md: string | null,
  limit = 40,
): BacklogRecRow[] {
  if (!md) return [];
  const table =
    md.split(/## Top \d+ ranked improvements/i)[1]?.split(/^## /m)[0] ?? "";
  const rows: BacklogRecRow[] = [];
  for (const line of table.split("\n")) {
    if (!line.trim().startsWith("|")) continue;
    if (/^\|\s*#\s*\|/.test(line) || /^\|[\s-|]+\|$/.test(line)) continue;
    const cells = line
      .split("|")
      .map((c) => c.trim())
      .filter(Boolean);
    // # | Priority | Route | Page type | Score | Map | Issue | Recommended | Research | Effort | Fix class | Impact
    if (cells.length < 10) continue;
    const route = cells[2]!.replace(/`/g, "");
    const impact = cells[11] ?? cells[cells.length - 1] ?? "—";
    const mapId = cells[5] && cells[5] !== "—" ? cells[5] : undefined;
    rows.push({
      priority: cells[1]!,
      route,
      pageType: cells[3]!,
      score: cells[4]!,
      issue: cells[6]!,
      action: cells[7]!,
      effort: cells[9] ?? "medium",
      impact,
      relatedId: mapId,
    });
    if (rows.length >= limit) break;
  }
  return rows;
}

export function hasLiveSearchPerformanceData(): boolean {
  // Fixture snapshots must not be treated as live SoftwareGlimpse GSC.
  const storeDir = abs("src/data/seo/snapshots");
  if (!fs.existsSync(storeDir)) return false;
  const files = fs.readdirSync(storeDir).filter((f) => f.endsWith(".json"));
  for (const f of files) {
    if (/fixture|synthetic/i.test(f)) continue;
    try {
      const raw = JSON.parse(
        fs.readFileSync(path.join(storeDir, f), "utf8"),
      ) as { meta?: { synthetic?: boolean } };
      if (raw.meta?.synthetic === true) continue;
      return true;
    } catch {
      /* ignore */
    }
  }
  return false;
}
