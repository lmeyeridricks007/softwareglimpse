import { saveSnapshot } from "@/data/seo/store";
import type { DateRange, SearchSnapshot, SearchSnapshotMeta } from "@/domain";
import type { SearchPerformanceProvider } from "./providers/search-performance-provider";

export type SyncSearchPerformanceOptions = {
  provider: SearchPerformanceProvider;
  range: DateRange;
  rangeLabel: string;
  /** Mark written snapshot as synthetic (fixtures/imports). */
  synthetic?: boolean;
  label?: string;
};

/**
 * Query provider and upsert snapshot idempotently by
 * `${source}-${rangeLabel}-${dataThroughDate}`.
 */
export async function syncSearchPerformance(
  opts: SyncSearchPerformanceOptions,
): Promise<SearchSnapshotMeta> {
  const result = await opts.provider.queryPerformance({
    range: opts.range,
    rangeLabel: opts.rangeLabel,
  });

  const snapshot: SearchSnapshot = {
    meta: {
      ...result.meta,
      rangeLabel: opts.rangeLabel,
    },
    rows: result.rows,
    synthetic: opts.synthetic ?? result.meta.source === "fixture",
    label:
      opts.label ??
      (opts.synthetic || result.meta.source === "fixture"
        ? "SYNTHETIC — not live SoftwareGlimpse GSC data"
        : undefined),
  };

  return saveSnapshot(snapshot);
}
