import type {
  DateRange,
  SearchPerformanceRow,
  SearchSnapshotMeta,
} from "@/domain";

export type SearchPerformanceRequest = {
  /** Optional for import providers that already embed date ranges in the file. */
  range?: DateRange;
  rangeLabel?: string;
  dimensions?: Array<"query" | "page" | "country" | "device">;
};

export type SearchPerformanceResult = {
  rows: SearchPerformanceRow[];
  meta: SearchSnapshotMeta;
};

export interface SearchPerformanceProvider {
  queryPerformance(
    request: SearchPerformanceRequest,
  ): Promise<SearchPerformanceResult>;
}
