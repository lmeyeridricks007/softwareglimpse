import fs from "node:fs";
import path from "node:path";
import type { ScorecardSnapshot, ScoreHistoryRow } from "./types";

const SNAPSHOT_PATH = path.join(
  process.cwd(),
  "docs/site-intelligence/website-intelligence-scorecard-latest.json",
);

export function loadPreviousScorecard(): ScorecardSnapshot | null {
  if (!fs.existsSync(SNAPSHOT_PATH)) return null;
  try {
    return JSON.parse(
      fs.readFileSync(SNAPSHOT_PATH, "utf8"),
    ) as ScorecardSnapshot;
  } catch {
    return null;
  }
}

export function saveScorecardSnapshot(snap: ScorecardSnapshot): string {
  fs.mkdirSync(path.dirname(SNAPSHOT_PATH), { recursive: true });
  // Preserve previous before overwrite for history compare mid-run
  fs.writeFileSync(SNAPSHOT_PATH, JSON.stringify(snap, null, 2), "utf8");
  return path.relative(process.cwd(), SNAPSHOT_PATH);
}

export function compareScorecards(
  previous: ScorecardSnapshot | null,
  current: ScorecardSnapshot,
  labels: Record<string, string>,
): ScoreHistoryRow[] {
  const ids = [
    ...new Set([
      ...Object.keys(current.scores),
      ...Object.keys(previous?.scores ?? {}),
    ]),
  ];
  return ids.map((id) => {
    const cur = current.scores[id] ?? null;
    const prev = previous?.scores[id] ?? null;
    const curDisp =
      current.displays[id] ??
      (cur == null ? "—" : String(cur));
    const prevDisp =
      previous?.displays[id] ??
      (prev == null ? "—" : String(prev));
    let change: ScoreHistoryRow["change"] = "N/A";
    let delta: number | null = null;
    if (prev == null && cur == null) change = "N/A";
    else if (prev == null && cur != null) change = "NEW";
    else if (prev != null && cur == null) change = "N/A";
    else if (prev != null && cur != null) {
      delta = cur - prev;
      if (delta > 0) change = "IMPROVED";
      else if (delta < 0) change = "REGRESSED";
      else change = "UNCHANGED";
    }
    return {
      id,
      label: labels[id] ?? id,
      previous: prev,
      current: cur,
      previousDisplay: prevDisp,
      currentDisplay: curDisp,
      delta,
      change,
    };
  });
}
