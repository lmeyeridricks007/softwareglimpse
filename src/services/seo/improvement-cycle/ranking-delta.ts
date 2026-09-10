import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import type {
  ImprovementCycleSnapshot,
  RankingMovement,
} from "./types";

const SNAPSHOT_DIR = "data/seo/improvement-cycle";
const SNAPSHOT_FILE = "previous-ranking-snapshot.json";

export function snapshotPath(cwd = process.cwd()): string {
  return path.join(cwd, SNAPSHOT_DIR, SNAPSHOT_FILE);
}

export function loadPreviousRankingSnapshot(
  cwd = process.cwd(),
): ImprovementCycleSnapshot | null {
  const file = snapshotPath(cwd);
  if (!existsSync(file)) return null;
  try {
    return JSON.parse(readFileSync(file, "utf8")) as ImprovementCycleSnapshot;
  } catch {
    return null;
  }
}

export function saveRankingSnapshot(
  snapshot: ImprovementCycleSnapshot,
  cwd = process.cwd(),
): string {
  const file = snapshotPath(cwd);
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
  return file;
}

/**
 * Compare current GSC opportunity rows to last cycle snapshot.
 * Honest: if no prior snapshot, returns empty wins/losses with a note.
 */
export function computeRankingMovements(
  current: ImprovementCycleSnapshot["pages"],
  previous: ImprovementCycleSnapshot | null,
): {
  wins: RankingMovement[];
  losses: RankingMovement[];
  note: string;
} {
  if (!previous?.pages?.length) {
    return {
      wins: [],
      losses: [],
      note: "No prior improvement-cycle ranking snapshot — wins/losses unavailable until next weekly run.",
    };
  }

  const prevByPath = new Map(previous.pages.map((p) => [p.path, p]));
  const wins: RankingMovement[] = [];
  const losses: RankingMovement[] = [];

  for (const cur of current) {
    const prev = prevByPath.get(cur.path);
    if (!prev) continue;

    const deltaClicks = cur.clicks - prev.clicks;
    const deltaPosition =
      cur.position != null && prev.position != null
        ? prev.position - cur.position // positive = improved (lower position number)
        : null;

    const movement: RankingMovement = {
      path: cur.path,
      previousPosition: prev.position,
      currentPosition: cur.position,
      previousClicks: prev.clicks,
      currentClicks: cur.clicks,
      previousImpressions: prev.impressions,
      currentImpressions: cur.impressions,
      deltaClicks,
      deltaPosition,
      note: "",
    };

    const improved =
      deltaClicks >= 3 ||
      (deltaPosition != null && deltaPosition >= 2 && cur.impressions >= 30);
    const declined =
      deltaClicks <= -3 ||
      (deltaPosition != null && deltaPosition <= -2 && prev.impressions >= 30);

    if (improved && !declined) {
      movement.note = `Clicks ${prev.clicks}→${cur.clicks}; pos ${fmtPos(prev.position)}→${fmtPos(cur.position)}`;
      wins.push(movement);
    } else if (declined && !improved) {
      movement.note = `Clicks ${prev.clicks}→${cur.clicks}; pos ${fmtPos(prev.position)}→${fmtPos(cur.position)}`;
      losses.push(movement);
    }
  }

  wins.sort((a, b) => b.deltaClicks - a.deltaClicks);
  losses.sort((a, b) => a.deltaClicks - b.deltaClicks);

  return {
    wins: wins.slice(0, 25),
    losses: losses.slice(0, 25),
    note: `Compared to snapshot from ${previous.generatedAt} (${previous.weekId}).`,
  };
}

function fmtPos(p: number | null): string {
  return p == null ? "?" : p.toFixed(1);
}
