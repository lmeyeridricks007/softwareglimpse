import fs from "node:fs";
import path from "node:path";

export type ScoreSnapshot = {
  generatedAt: string;
  mode: "FAST" | "FULL";
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
  recommendationIds: string[];
};

export type ScoreChangeKind =
  | "NEW ISSUES"
  | "RESOLVED"
  | "IMPROVED"
  | "REGRESSED"
  | "UNCHANGED";

export type ScoreChange = {
  route: string;
  title?: string;
  kind: ScoreChangeKind;
  previousScore?: number;
  currentScore?: number;
  delta?: number;
};

const ARCHIVE_DIR = path.join(
  process.cwd(),
  "docs",
  "content-quality",
  "archive",
);

export const SCORES_LATEST_PATH = path.join(
  ARCHIVE_DIR,
  "scores-latest.json",
);

export function loadPreviousScoreSnapshot(): ScoreSnapshot | null {
  if (!fs.existsSync(SCORES_LATEST_PATH)) return null;
  try {
    return JSON.parse(fs.readFileSync(SCORES_LATEST_PATH, "utf8")) as ScoreSnapshot;
  } catch {
    return null;
  }
}

export function writeScoreSnapshot(snapshot: ScoreSnapshot): string {
  fs.mkdirSync(ARCHIVE_DIR, { recursive: true });
  fs.writeFileSync(SCORES_LATEST_PATH, JSON.stringify(snapshot, null, 2), "utf8");
  return SCORES_LATEST_PATH;
}

export function diffScoreSnapshots(
  previous: ScoreSnapshot | null,
  current: ScoreSnapshot,
): ScoreChange[] {
  const changes: ScoreChange[] = [];
  const prevPages = previous?.pages ?? {};
  const currRoutes = new Set(Object.keys(current.pages));
  const prevRoutes = new Set(Object.keys(prevPages));

  for (const route of currRoutes) {
    const cur = current.pages[route]!;
    const prev = prevPages[route];
    if (!prev) {
      changes.push({
        route,
        title: cur.title,
        kind: "NEW ISSUES",
        currentScore: cur.score,
      });
      continue;
    }
    const delta = cur.score - prev.score;
    if (delta >= 3) {
      changes.push({
        route,
        title: cur.title,
        kind: "IMPROVED",
        previousScore: prev.score,
        currentScore: cur.score,
        delta,
      });
    } else if (delta <= -3) {
      changes.push({
        route,
        title: cur.title,
        kind: "REGRESSED",
        previousScore: prev.score,
        currentScore: cur.score,
        delta,
      });
    } else {
      changes.push({
        route,
        title: cur.title,
        kind: "UNCHANGED",
        previousScore: prev.score,
        currentScore: cur.score,
        delta,
      });
    }
  }

  for (const route of prevRoutes) {
    if (!currRoutes.has(route)) {
      // Only mark RESOLVED when previous was a weak page that disappeared from
      // the audited set in FULL mode, or score was low. Otherwise note as resolved gap.
      const prev = prevPages[route]!;
      changes.push({
        route,
        title: prev.title,
        kind: "RESOLVED",
        previousScore: prev.score,
      });
    }
  }

  const order: Record<ScoreChangeKind, number> = {
    REGRESSED: 0,
    "NEW ISSUES": 1,
    IMPROVED: 2,
    RESOLVED: 3,
    UNCHANGED: 4,
  };
  return changes.sort(
    (a, b) =>
      order[a.kind] - order[b.kind] ||
      (a.delta ?? 0) - (b.delta ?? 0) ||
      a.route.localeCompare(b.route),
  );
}

export function summarizeChanges(changes: ScoreChange[]): Record<ScoreChangeKind, number> {
  const out: Record<ScoreChangeKind, number> = {
    "NEW ISSUES": 0,
    RESOLVED: 0,
    IMPROVED: 0,
    REGRESSED: 0,
    UNCHANGED: 0,
  };
  for (const c of changes) out[c.kind] += 1;
  return out;
}
