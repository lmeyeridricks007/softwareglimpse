import {
  buildSnapshotId,
  loadFixtureSnapshot,
} from "@/data/seo/store";
import type {
  SearchPerformanceProvider,
  SearchPerformanceRequest,
  SearchPerformanceResult,
} from "./search-performance-provider";

/**
 * Loads synthetic Search Console–shaped fixtures.
 * Never claims to be live SoftwareGlimpse performance.
 */
export class FixtureSearchPerformanceProvider
  implements SearchPerformanceProvider
{
  constructor(
    private readonly fixtureName: string = "synthetic-28d-current.json",
  ) {}

  async queryPerformance(
    request: SearchPerformanceRequest,
  ): Promise<SearchPerformanceResult> {
    const snapshot = loadFixtureSnapshot(this.fixtureName);
    if (!snapshot.synthetic && snapshot.meta.source === "fixture") {
      // Fixtures are always treated as synthetic for labeling.
    }
    const rangeLabel =
      request.rangeLabel ?? snapshot.meta.rangeLabel ?? "fixture";
    const id = buildSnapshotId(
      "fixture",
      rangeLabel,
      snapshot.meta.dataThroughDate,
    );
    return {
      rows: snapshot.rows.map((row) => ({
        ...row,
        dateRange: request.range ?? row.dateRange,
      })),
      meta: {
        ...snapshot.meta,
        id,
        source: "fixture",
        rangeLabel,
      },
    };
  }
}
