import type {
  ContentRegistryEntry,
  SearchPerformanceRow,
  SeoOpportunity,
} from "@/domain";
import type { PageAggregate, PageQueryAggregate, QueryAggregate } from "../aggregate";

export type OpportunityContext = {
  currentRows: SearchPerformanceRow[];
  previousRows?: SearchPerformanceRow[];
  pageAggs: PageAggregate[];
  queryAggs: QueryAggregate[];
  pageQueryAggs: PageQueryAggregate[];
  registry: ContentRegistryEntry[];
  nowIso: string;
  /** Optional planning-only commercial boost 0–1 (never product ranks). */
  commercialBoostByProduct?: Record<string, number>;
};

export type OpportunityDetector = (
  ctx: OpportunityContext,
) => SeoOpportunity[];

export function isLiveRegistryEntry(
  entry: ContentRegistryEntry | undefined,
): boolean {
  if (!entry) return false;
  return entry.metadata.status === "published" && entry.seoIndexable === true;
}

export function findRegistryEntry(
  registry: ContentRegistryEntry[],
  type: ContentRegistryEntry["type"],
  slug: string,
): ContentRegistryEntry | undefined {
  return registry.find((e) => e.type === type && e.slug === slug);
}
