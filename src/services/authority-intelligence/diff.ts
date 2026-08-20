import fs from "node:fs";
import {
  ensureAuthorityReportDirs,
  SNAPSHOT_PATH,
} from "./report-io";

export type AuthorityOpportunitySnapshotItem = {
  id: string;
  scoreBand: string;
  status: string;
  domain: string;
  type: string;
};

export type AuthorityIntelligenceSnapshot = {
  generatedAt: string;
  mode: string;
  scope: string;
  opportunityIds: string[];
  items: AuthorityOpportunitySnapshotItem[];
};

export type AuthorityChangeKind =
  | "NEW"
  | "STILL OPEN"
  | "RESOLVED"
  | "REGRESSED"
  | "IMPROVED"
  | "AVOIDED";

export type AuthorityChange = {
  id: string;
  kind: AuthorityChangeKind;
  previousBand?: string;
  currentBand?: string;
};

export function loadPreviousAuthoritySnapshot(): AuthorityIntelligenceSnapshot | null {
  if (!fs.existsSync(SNAPSHOT_PATH)) return null;
  try {
    return JSON.parse(
      fs.readFileSync(SNAPSHOT_PATH, "utf8"),
    ) as AuthorityIntelligenceSnapshot;
  } catch {
    return null;
  }
}

export function writeAuthoritySnapshot(
  snapshot: AuthorityIntelligenceSnapshot,
): string {
  ensureAuthorityReportDirs();
  fs.writeFileSync(SNAPSHOT_PATH, JSON.stringify(snapshot, null, 2), "utf8");
  return SNAPSHOT_PATH;
}

const BAND_RANK: Record<string, number> = {
  EXCELLENT: 4,
  STRONG: 3,
  GOOD: 2,
  LOW: 1,
  AVOID: 0,
};

export function diffAuthoritySnapshots(
  previous: AuthorityIntelligenceSnapshot | null,
  current: AuthorityIntelligenceSnapshot,
): AuthorityChange[] {
  const changes: AuthorityChange[] = [];
  const prevMap = new Map(
    (previous?.items ?? []).map((i) => [i.id, i] as const),
  );
  const currMap = new Map(current.items.map((i) => [i.id, i] as const));

  for (const [id, cur] of currMap) {
    const prev = prevMap.get(id);
    if (!prev) {
      changes.push({ id, kind: "NEW", currentBand: cur.scoreBand });
      continue;
    }
    if (cur.scoreBand === "AVOID" && prev.scoreBand !== "AVOID") {
      changes.push({
        id,
        kind: "AVOIDED",
        previousBand: prev.scoreBand,
        currentBand: cur.scoreBand,
      });
      continue;
    }
    const prevR = BAND_RANK[prev.scoreBand] ?? 0;
    const curR = BAND_RANK[cur.scoreBand] ?? 0;
    if (curR > prevR) {
      changes.push({
        id,
        kind: "IMPROVED",
        previousBand: prev.scoreBand,
        currentBand: cur.scoreBand,
      });
    } else if (curR < prevR) {
      changes.push({
        id,
        kind: "REGRESSED",
        previousBand: prev.scoreBand,
        currentBand: cur.scoreBand,
      });
    } else {
      changes.push({
        id,
        kind: "STILL OPEN",
        previousBand: prev.scoreBand,
        currentBand: cur.scoreBand,
      });
    }
  }

  for (const [id, prev] of prevMap) {
    if (!currMap.has(id)) {
      changes.push({
        id,
        kind: "RESOLVED",
        previousBand: prev.scoreBand,
      });
    }
  }

  return changes;
}

export function summarizeAuthorityChanges(
  changes: AuthorityChange[],
): Record<AuthorityChangeKind, number> {
  const summary: Record<AuthorityChangeKind, number> = {
    NEW: 0,
    "STILL OPEN": 0,
    RESOLVED: 0,
    REGRESSED: 0,
    IMPROVED: 0,
    AVOIDED: 0,
  };
  for (const c of changes) summary[c.kind] += 1;
  return summary;
}
