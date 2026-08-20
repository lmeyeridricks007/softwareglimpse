import type {
  SeoFinding,
  SeoIssueDiff,
  SeoIssueDiffSummary,
  SeoSeverity,
} from "./types";

const SEVERITY_RANK: Record<SeoSeverity, number> = {
  P0: 0,
  P1: 1,
  P2: 2,
  P3: 3,
};

export type SeoIssueSnapshot = {
  generatedAt: string;
  mode: string;
  findingIds: string[];
  findings: Array<{
    id: string;
    severity: SeoSeverity;
    problem: string;
    area: string;
  }>;
};

export function diffFindings(
  previous: SeoIssueSnapshot | null,
  current: SeoFinding[],
): SeoIssueDiff {
  const prevById = new Map(
    (previous?.findings ?? []).map((f) => [f.id, f] as const),
  );
  const currIds = new Set(current.map((f) => f.id));
  const prevIds = new Set(prevById.keys());

  const items: SeoIssueDiff["items"] = [];
  const summary: SeoIssueDiffSummary = {
    NEW: 0,
    RESOLVED: 0,
    REGRESSED: 0,
    UNCHANGED: 0,
    EXISTING: 0,
  };

  for (const f of current) {
    const prev = prevById.get(f.id);
    if (!prev) {
      items.push({
        id: f.id,
        status: "NEW",
        severity: f.severity,
        problem: f.problem,
      });
      summary.NEW += 1;
      continue;
    }
    const prevRank = SEVERITY_RANK[prev.severity];
    const currRank = SEVERITY_RANK[f.severity];
    if (currRank < prevRank) {
      // Lower rank number = worse → regressed
      items.push({
        id: f.id,
        status: "REGRESSED",
        severity: f.severity,
        problem: f.problem,
      });
      summary.REGRESSED += 1;
    } else {
      items.push({
        id: f.id,
        status: "EXISTING",
        severity: f.severity,
        problem: f.problem,
      });
      summary.EXISTING += 1;
      summary.UNCHANGED += 1;
    }
  }

  for (const id of prevIds) {
    if (!currIds.has(id)) {
      const prev = prevById.get(id)!;
      items.push({
        id,
        status: "RESOLVED",
        severity: prev.severity,
        problem: prev.problem,
      });
      summary.RESOLVED += 1;
    }
  }

  return { summary, items };
}

export function toSnapshot(
  findings: SeoFinding[],
  mode: string,
  generatedAt: string,
): SeoIssueSnapshot {
  return {
    generatedAt,
    mode,
    findingIds: findings.map((f) => f.id),
    findings: findings.map((f) => ({
      id: f.id,
      severity: f.severity,
      problem: f.problem,
      area: f.area,
    })),
  };
}
