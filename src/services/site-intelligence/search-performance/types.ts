/**
 * Site Intelligence search-performance view of GSC-shaped rows.
 * Average position is NOT a fixed SERP rank — see methodology notes.
 */
import type { SearchPerformanceRow, SearchSnapshot } from "@/domain";
import type { SearchVisibilityMetricsInput } from "@/domain/schemas/site-intelligence";

/** Canonical snapshot row for Site Intelligence (adapts domain SearchPerformanceRow). */
export type SearchPerformanceSnapshot = {
  page: string;
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  /** GSC average position for the period — not a fixed SERP slot. */
  position: number;
  period: { startDate: string; endDate: string };
  device?: string;
  country?: string;
};

export type SearchPerformanceSignalKind =
  | "near-win"
  | "ctr-opportunity"
  | "refresh-candidate"
  | "emerging-topic"
  | "defend-cluster";

export type SearchPerformanceSignal = {
  kind: SearchPerformanceSignalKind;
  title: string;
  page: string;
  query?: string;
  impressions: number;
  clicks: number;
  ctr: number;
  position: number;
  detail: string;
  recommendedAction: string;
};

export type SearchPerformanceReport = {
  generatedAt: string;
  sourceMode: "gsc" | "import" | "fixture" | "snapshot-store" | "none";
  live: boolean;
  synthetic: boolean;
  current?: {
    id: string;
    rangeLabel: string;
    dataThroughDate: string;
    source: string;
    rowCount: number;
    period: { startDate: string; endDate: string };
  };
  previous?: {
    id: string;
    rangeLabel: string;
    dataThroughDate: string;
  };
  totals: {
    clicks: number;
    impressions: number;
    avgCtr: number | null;
    avgPosition: number | null;
    queryCount: number;
    pageCount: number;
  };
  snapshots: SearchPerformanceSnapshot[];
  nearWins: SearchPerformanceSignal[];
  ctrOpportunities: SearchPerformanceSignal[];
  refreshCandidates: SearchPerformanceSignal[];
  emergingTopics: SearchPerformanceSignal[];
  defendCluster: SearchPerformanceSignal[];
  visibilityMetrics: SearchVisibilityMetricsInput | null;
  methodologyNotes: string[];
  notes: string[];
  disclaimers: string[];
};

export function rowToSnapshot(row: SearchPerformanceRow): SearchPerformanceSnapshot | null {
  if (!row.page || !row.query) return null;
  return {
    page: row.page,
    query: row.query,
    clicks: row.clicks,
    impressions: row.impressions,
    ctr: row.ctr,
    position: row.position,
    period: row.dateRange,
    device: row.device,
    country: row.country,
  };
}

export function snapshotFromSearchSnapshot(
  snap: SearchSnapshot,
): SearchPerformanceSnapshot[] {
  return snap.rows
    .map(rowToSnapshot)
    .filter((r): r is SearchPerformanceSnapshot => r != null);
}
