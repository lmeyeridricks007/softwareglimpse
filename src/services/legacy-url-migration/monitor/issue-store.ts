import fs from "node:fs";
import path from "node:path";
import type { MonitorIssue, MonitorIssueSnapshot, MonitorIssueState } from "./types";

const DATA_DIR = path.join(process.cwd(), "docs", "migration", "data");
const SNAPSHOT_PATH = path.join(DATA_DIR, "migration-monitor-issues-latest.json");
const INTENTIONAL_PATH = path.join(DATA_DIR, "monitor-intentional.json");

export type IntentionalAllowlist = {
  updatedAt?: string;
  /** Issue IDs marked intentional (accepted risk / known retirement). */
  issueIds: string[];
  notes?: string[];
};

export function loadIntentionalAllowlist(): IntentionalAllowlist {
  if (!fs.existsSync(INTENTIONAL_PATH)) {
    return { issueIds: [], notes: [] };
  }
  try {
    const raw = JSON.parse(
      fs.readFileSync(INTENTIONAL_PATH, "utf8"),
    ) as IntentionalAllowlist;
    return {
      issueIds: Array.isArray(raw.issueIds) ? raw.issueIds : [],
      notes: raw.notes,
      updatedAt: raw.updatedAt,
    };
  } catch {
    return { issueIds: [], notes: ["Failed to parse monitor-intentional.json"] };
  }
}

export function loadPreviousMonitorSnapshot(): MonitorIssueSnapshot | null {
  if (!fs.existsSync(SNAPSHOT_PATH)) return null;
  try {
    return JSON.parse(
      fs.readFileSync(SNAPSHOT_PATH, "utf8"),
    ) as MonitorIssueSnapshot;
  } catch {
    return null;
  }
}

export function writeMonitorSnapshot(snapshot: MonitorIssueSnapshot): string {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(SNAPSHOT_PATH, `${JSON.stringify(snapshot, null, 2)}\n`);
  return SNAPSHOT_PATH;
}

export function monitorSnapshotPath(): string {
  return SNAPSHOT_PATH;
}

/**
 * Assign NEW / OPEN / RESOLVED / REGRESSED / INTENTIONAL from previous snapshot.
 */
export function reconcileIssueStates(input: {
  current: Omit<MonitorIssue, "state" | "firstSeenAt" | "lastSeenAt">[];
  previous: MonitorIssueSnapshot | null;
  intentionalIds: Set<string>;
  now: string;
}): {
  issues: MonitorIssue[];
  counts: {
    NEW: number;
    OPEN: number;
    RESOLVED: number;
    REGRESSED: number;
    INTENTIONAL: number;
  };
} {
  const prevById = new Map(
    (input.previous?.issues ?? []).map((i) => [i.id, i] as const),
  );
  const currIds = new Set(input.current.map((i) => i.id));
  const counts = {
    NEW: 0,
    OPEN: 0,
    RESOLVED: 0,
    REGRESSED: 0,
    INTENTIONAL: 0,
  };

  const issues: MonitorIssue[] = [];

  for (const raw of input.current) {
    let state: MonitorIssueState;
    let firstSeenAt = input.now;

    if (input.intentionalIds.has(raw.id)) {
      state = "INTENTIONAL";
      counts.INTENTIONAL += 1;
      const prev = prevById.get(raw.id);
      firstSeenAt = prev?.firstSeenAt ?? input.now;
    } else {
      const prev = prevById.get(raw.id);
      if (!prev) {
        // Was this ID present in an older resolved sense? If previous snapshot
        // lacked it but we track only latest — first appearance is NEW.
        // REGRESSED: previous snapshot had it as RESOLVED… we don't keep resolved
        // in snapshot. Instead: if previous snapshot exists, id absent, but a
        // "resolved history" file… Keep simple: reappearance after absence from
        // previous *open* snapshot isn't REGRESSED. Use severity worsen OR
        // explicit prior RESOLVED entries if we store them.
        //
        // Practical rule matching SEO audits:
        // - not in previous → NEW
        // - in previous → OPEN
        // Additionally: if previous had fewer severity (P2→P0) → REGRESSED
        state = "NEW";
        counts.NEW += 1;
      } else {
        firstSeenAt = prev.firstSeenAt ?? prev.lastSeenAt ?? input.now;
        const sevRank = { P0: 0, P1: 1, P2: 2 } as const;
        if (sevRank[raw.severity] < sevRank[prev.severity]) {
          state = "REGRESSED";
          counts.REGRESSED += 1;
        } else {
          state = "OPEN";
          counts.OPEN += 1;
        }
      }
    }

    issues.push({
      ...raw,
      state,
      firstSeenAt,
      lastSeenAt: input.now,
    });
  }

  // RESOLVED: in previous open set, not in current (and not intentional-only ghost)
  for (const [id, prev] of prevById) {
    if (currIds.has(id)) continue;
    if (prev.state === "RESOLVED") continue;
    issues.push({
      id,
      kind: prev.kind,
      severity: prev.severity,
      subject: prev.subject,
      problem: prev.problem,
      evidence: "No longer detected in this monitor run",
      recommendedAction: "Confirm fix holds on next run",
      important: prev.important,
      state: "RESOLVED",
      firstSeenAt: prev.firstSeenAt,
      lastSeenAt: input.now,
    });
    counts.RESOLVED += 1;
  }

  // Detect REGRESSED reappearance: previous snapshot had RESOLVED entry with same id
  // (if we carried RESOLVED forward). When previous only stores open issues, also
  // check a companion resolved set on the snapshot.
  return { issues, counts };
}

export function toMonitorSnapshot(
  issues: MonitorIssue[],
  mode: string,
  generatedAt: string,
): MonitorIssueSnapshot {
  // Persist active + intentional for next diff; drop RESOLVED after one cycle
  // by only writing non-RESOLVED into the "open" snapshot — but keep RESOLVED
  // in the report. For reappearance REGRESSED, store lastResolvedIds.
  const active = issues.filter((i) => i.state !== "RESOLVED");
  return {
    generatedAt,
    mode,
    issues: active.map((i) => ({
      id: i.id,
      kind: i.kind,
      severity: i.severity,
      subject: i.subject,
      problem: i.problem,
      state: i.state === "NEW" ? "OPEN" : i.state,
      important: i.important,
      firstSeenAt: i.firstSeenAt ?? generatedAt,
      lastSeenAt: i.lastSeenAt ?? generatedAt,
    })),
  };
}

/**
 * Mark reappearance: if id was in previousResolvedIds and is current → REGRESSED.
 */
export function applyReappearanceRegression(
  issues: MonitorIssue[],
  previousResolvedIds: Set<string>,
  counts: {
    NEW: number;
    OPEN: number;
    RESOLVED: number;
    REGRESSED: number;
    INTENTIONAL: number;
  },
): MonitorIssue[] {
  return issues.map((issue) => {
    if (
      issue.state === "NEW" &&
      previousResolvedIds.has(issue.id) &&
      issue.state !== "INTENTIONAL"
    ) {
      counts.NEW -= 1;
      counts.REGRESSED += 1;
      return { ...issue, state: "REGRESSED" as const };
    }
    return issue;
  });
}

export function loadPreviousResolvedIds(): Set<string> {
  const file = path.join(DATA_DIR, "migration-monitor-resolved.json");
  if (!fs.existsSync(file)) return new Set();
  try {
    const raw = JSON.parse(fs.readFileSync(file, "utf8")) as {
      ids?: string[];
    };
    return new Set(raw.ids ?? []);
  } catch {
    return new Set();
  }
}

export function writeResolvedHistory(issues: MonitorIssue[]): void {
  const file = path.join(DATA_DIR, "migration-monitor-resolved.json");
  const prev = loadPreviousResolvedIds();
  for (const i of issues) {
    if (i.state === "RESOLVED") prev.add(i.id);
    if (i.state === "OPEN" || i.state === "NEW" || i.state === "REGRESSED") {
      prev.delete(i.id);
    }
  }
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(
    file,
    `${JSON.stringify({ updatedAt: new Date().toISOString(), ids: [...prev] }, null, 2)}\n`,
  );
}
