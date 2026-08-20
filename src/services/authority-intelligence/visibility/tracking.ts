/**
 * Unified opportunity tracking + link acquisition store.
 */

import fs from "node:fs";
import path from "node:path";
import type {
  LinkAcquisitionRecord,
  VisibilityTrackingStatus,
} from "@/domain/schemas/authority-intelligence";

export type TrackedOpportunity = {
  id: string;
  family:
    | "RESOURCE"
    | "EARNED"
    | "PAID"
    | "PR"
    | "PRESENCE"
    | "PARTNER"
    | "PROMO"
    | "AVOID";
  title: string;
  sourceUrl?: string;
  status: VisibilityTrackingStatus;
  scoreBand?: string;
  agentId: string;
};

export type VisibilitySnapshot = {
  generatedAt: string;
  mode: string;
  opportunityIds: string[];
  items: TrackedOpportunity[];
  acquisitions: LinkAcquisitionRecord[];
};

const AUTHORITY_DIR = path.join(process.cwd(), "docs", "authority");
const TRACKING_DIR = path.join(AUTHORITY_DIR, "tracking");
export const VISIBILITY_SNAPSHOT_PATH = path.join(
  TRACKING_DIR,
  "visibility-snapshot-latest.json",
);
export const ACQUISITIONS_PATH = path.join(
  TRACKING_DIR,
  "link-acquisitions.json",
);

export function loadAcquisitions(): LinkAcquisitionRecord[] {
  if (!fs.existsSync(ACQUISITIONS_PATH)) return [];
  try {
    return JSON.parse(fs.readFileSync(ACQUISITIONS_PATH, "utf8")) as LinkAcquisitionRecord[];
  } catch {
    return [];
  }
}

export function loadPreviousVisibilitySnapshot(): VisibilitySnapshot | null {
  if (!fs.existsSync(VISIBILITY_SNAPSHOT_PATH)) return null;
  try {
    return JSON.parse(
      fs.readFileSync(VISIBILITY_SNAPSHOT_PATH, "utf8"),
    ) as VisibilitySnapshot;
  } catch {
    return null;
  }
}

export function writeVisibilitySnapshot(snapshot: VisibilitySnapshot): string {
  fs.mkdirSync(TRACKING_DIR, { recursive: true });
  fs.writeFileSync(
    VISIBILITY_SNAPSHOT_PATH,
    JSON.stringify(snapshot, null, 2),
    "utf8",
  );
  return VISIBILITY_SNAPSHOT_PATH;
}

export function ensureAcquisitionsFile(): string {
  fs.mkdirSync(TRACKING_DIR, { recursive: true });
  if (!fs.existsSync(ACQUISITIONS_PATH)) {
    fs.writeFileSync(ACQUISITIONS_PATH, "[]\n", "utf8");
  }
  return ACQUISITIONS_PATH;
}

export type VisibilityHistoryDiff = {
  newOpportunities: string[];
  expiredOrMissing: string[];
  wonLinks: LinkAcquisitionRecord[];
  status: Record<string, number>;
};

export function diffVisibilityHistory(
  previous: VisibilitySnapshot | null,
  current: VisibilitySnapshot,
): VisibilityHistoryDiff {
  const prevIds = new Set(previous?.opportunityIds ?? []);
  const currIds = new Set(current.opportunityIds);
  const newOpportunities = [...currIds].filter((id) => !prevIds.has(id));
  const expiredOrMissing = [...prevIds].filter((id) => !currIds.has(id));
  const status: Record<string, number> = {};
  for (const item of current.items) {
    status[item.status] = (status[item.status] ?? 0) + 1;
  }
  return {
    newOpportunities,
    expiredOrMissing,
    wonLinks: current.acquisitions.filter((a) => a.dateAcquired),
    status,
  };
}

export function stableVisibilityId(
  family: TrackedOpportunity["family"],
  seed: string,
  index: number,
): string {
  const n = String(index).padStart(3, "0");
  return `AUTH-${family}-${n}`;
}
