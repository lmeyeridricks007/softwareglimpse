import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import type {
  DigitalPrOutreachStatus,
  DigitalPrTrackingRecord,
} from "./types";

const TRACKING_DIR = path.join(process.cwd(), "data/seo");
const TRACKING_FILE = path.join(TRACKING_DIR, "link-outreach-tracking.json");

export type DigitalPrTrackingStore = {
  updatedAt: string;
  records: DigitalPrTrackingRecord[];
};

export function loadDigitalPrTracking(): DigitalPrTrackingStore {
  if (!existsSync(TRACKING_FILE)) {
    return { updatedAt: new Date().toISOString(), records: [] };
  }
  try {
    return JSON.parse(
      readFileSync(TRACKING_FILE, "utf8"),
    ) as DigitalPrTrackingStore;
  } catch {
    return { updatedAt: new Date().toISOString(), records: [] };
  }
}

export function saveDigitalPrTracking(store: DigitalPrTrackingStore): void {
  mkdirSync(TRACKING_DIR, { recursive: true });
  store.updatedAt = new Date().toISOString();
  writeFileSync(TRACKING_FILE, `${JSON.stringify(store, null, 2)}\n`, "utf8");
}

/**
 * Upsert a tracking row. Human-operated — CLI/helpers only; no auto-send.
 */
export function upsertDigitalPrTracking(
  input: Omit<DigitalPrTrackingRecord, "createdAt" | "updatedAt"> & {
    createdAt?: string;
  },
): DigitalPrTrackingRecord {
  const store = loadDigitalPrTracking();
  const now = new Date().toISOString();
  const existingIdx = store.records.findIndex((r) => r.id === input.id);
  const record: DigitalPrTrackingRecord = {
    id: input.id,
    prospectId: input.prospectId,
    domain: input.domain,
    status: input.status,
    targetUrl: input.targetUrl,
    earnedLinkUrl: input.earnedLinkUrl,
    assetPath: input.assetPath,
    relationshipNotes: input.relationshipNotes,
    createdAt:
      existingIdx >= 0
        ? store.records[existingIdx]!.createdAt
        : (input.createdAt ?? now),
    updatedAt: now,
  };
  if (existingIdx >= 0) store.records[existingIdx] = record;
  else store.records.push(record);
  saveDigitalPrTracking(store);
  return record;
}

export function relationshipMapFromTracking(
  store: DigitalPrTrackingStore = loadDigitalPrTracking(),
): Map<string, DigitalPrOutreachStatus> {
  const map = new Map<string, DigitalPrOutreachStatus>();
  for (const r of store.records) {
    map.set(r.domain.toLowerCase(), r.status);
  }
  return map;
}

export function getDigitalPrTrackingPath(): string {
  return TRACKING_FILE;
}
