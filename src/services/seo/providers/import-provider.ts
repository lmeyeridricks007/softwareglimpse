import { buildSnapshotId } from "@/data/seo/store";
import {
  SearchSnapshotSchema,
  type SearchPerformanceRow,
  type SearchSnapshot,
} from "@/domain";
import { readFileSync } from "node:fs";
import type {
  SearchPerformanceProvider,
  SearchPerformanceRequest,
  SearchPerformanceResult,
} from "./search-performance-provider";

/**
 * Approved import of Search Console–shaped JSON (export / API dump).
 * Does not scrape GSC. Does not invent credentials.
 *
 * Accepts either a full SearchSnapshot or `{ rows, meta?, synthetic? }`.
 */
export class ImportSearchPerformanceProvider
  implements SearchPerformanceProvider
{
  constructor(
    private readonly filePath: string,
    private readonly opts: { treatAsLive?: boolean } = {},
  ) {}

  async queryPerformance(
    request: SearchPerformanceRequest,
  ): Promise<SearchPerformanceResult> {
    const raw = JSON.parse(readFileSync(this.filePath, "utf8")) as unknown;
    const snapshot = normalizeImport(raw, request);
    const rangeLabel = request.rangeLabel ?? snapshot.meta.rangeLabel;
    const dataThroughDate =
      request.range?.endDate ?? snapshot.meta.dataThroughDate;
    const source = this.opts.treatAsLive ? "import" : snapshot.meta.source;
    return {
      rows: snapshot.rows.map((row) => ({
        ...row,
        dateRange: request.range ?? row.dateRange,
      })),
      meta: {
        ...snapshot.meta,
        id: buildSnapshotId(source, rangeLabel, dataThroughDate),
        source: source === "gsc" ? "import" : source,
        rangeLabel,
        dataThroughDate,
        retrievedAt: new Date().toISOString(),
      },
    };
  }
}

function normalizeImport(
  raw: unknown,
  request: SearchPerformanceRequest,
): SearchSnapshot {
  if (raw && typeof raw === "object" && "rows" in raw) {
    const obj = raw as {
      rows: SearchPerformanceRow[];
      meta?: Partial<SearchSnapshot["meta"]>;
      synthetic?: boolean;
      label?: string;
    };
    const end =
      request.range?.endDate ??
      obj.meta?.dataThroughDate ??
      new Date().toISOString().slice(0, 10);
    const rangeLabel = request.rangeLabel ?? obj.meta?.rangeLabel ?? "import";
    return SearchSnapshotSchema.parse({
      synthetic: obj.synthetic ?? false,
      label:
        obj.label ??
        (obj.synthetic
          ? "SYNTHETIC import — not live SoftwareGlimpse GSC"
          : "Imported Search Console–shaped snapshot"),
      meta: {
        id: obj.meta?.id ?? buildSnapshotId("import", rangeLabel, end),
        retrievedAt: obj.meta?.retrievedAt ?? new Date().toISOString(),
        dataThroughDate: end,
        source: "import",
        rangeLabel,
      },
      rows: obj.rows,
    });
  }
  throw new Error(
    "Import file must be a SearchSnapshot JSON with a rows[] array (GSC-shaped). Do not scrape Search Console HTML.",
  );
}
