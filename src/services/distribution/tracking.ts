import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import type {
  DistributionMeasurement,
  DistributionTrackingRecord,
  DistributionTrackingStatus,
} from "@/domain";

const DIR = path.join(process.cwd(), "data/distribution");
const FILE = path.join(DIR, "tracking.json");

export type DistributionTrackingStore = {
  updatedAt: string;
  records: DistributionTrackingRecord[];
  /**
   * Measurement hints — wire to analytics exports when available.
   * affiliate_clicked / newsletter_signup_* are first-party event names.
   */
  measurementHints: string[];
};

const DEFAULT_HINTS = [
  "sessions: import from analytics when available — do not invent",
  "signups: map from newsletter_signup_submitted / newsletter_signup_confirmed",
  "affiliate clicks: map from affiliate_clicked",
  "engagement: external platform insights only when exported",
];

export function loadDistributionTracking(): DistributionTrackingStore {
  if (!existsSync(FILE)) {
    return {
      updatedAt: new Date().toISOString(),
      records: [],
      measurementHints: DEFAULT_HINTS,
    };
  }
  try {
    return JSON.parse(readFileSync(FILE, "utf8")) as DistributionTrackingStore;
  } catch {
    return {
      updatedAt: new Date().toISOString(),
      records: [],
      measurementHints: DEFAULT_HINTS,
    };
  }
}

export function saveDistributionTracking(
  store: DistributionTrackingStore,
): void {
  mkdirSync(DIR, { recursive: true });
  store.updatedAt = new Date().toISOString();
  writeFileSync(FILE, `${JSON.stringify(store, null, 2)}\n`, "utf8");
}

export function upsertDistributionTracking(
  input: Omit<DistributionTrackingRecord, "createdAt" | "updatedAt"> & {
    createdAt?: string;
  },
): DistributionTrackingRecord {
  const store = loadDistributionTracking();
  const now = new Date().toISOString();
  const idx = store.records.findIndex((r) => r.id === input.id);
  const record: DistributionTrackingRecord = {
    ...input,
    createdAt: idx >= 0 ? store.records[idx]!.createdAt : (input.createdAt ?? now),
    updatedAt: now,
  };
  if (idx >= 0) store.records[idx] = record;
  else store.records.push(record);
  saveDistributionTracking(store);
  return record;
}

export function recordCampaignDraftTracking(input: {
  campaignId: string;
  utmCampaign: string;
  trackedUrl: string;
  channel?: DistributionTrackingRecord["channel"];
  status?: DistributionTrackingStatus;
}): DistributionTrackingRecord {
  return upsertDistributionTracking({
    id: `track-${input.campaignId}-${input.channel ?? "pack"}`,
    campaignId: input.campaignId,
    channel: input.channel,
    utmCampaign: input.utmCampaign,
    trackedUrl: input.trackedUrl,
    status: input.status ?? "drafted",
  });
}

export function attachMeasurement(
  trackingId: string,
  measurement: DistributionMeasurement,
): DistributionTrackingRecord | null {
  const store = loadDistributionTracking();
  const idx = store.records.findIndex((r) => r.id === trackingId);
  if (idx < 0) return null;
  const existing = store.records[idx]!;
  const updated: DistributionTrackingRecord = {
    ...existing,
    measurement: {
      ...measurement,
      recordedAt: measurement.recordedAt ?? new Date().toISOString(),
    },
    status: "measured",
    updatedAt: new Date().toISOString(),
  };
  store.records[idx] = updated;
  saveDistributionTracking(store);
  return updated;
}

export function getDistributionTrackingPath(): string {
  return FILE;
}
