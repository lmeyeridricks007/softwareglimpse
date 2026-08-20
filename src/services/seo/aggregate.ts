import type { SearchPerformanceRow } from "@/domain";

export type AggregatedMetrics = {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

export type PageAggregate = AggregatedMetrics & { page: string };
export type QueryAggregate = AggregatedMetrics & { query: string };
export type PageQueryAggregate = AggregatedMetrics & {
  page: string;
  query: string;
};

export type PeriodDelta = {
  clicksDeltaPct: number | null;
  impressionsDeltaPct: number | null;
  ctrDeltaPct: number | null;
  positionDelta: number | null;
};

function aggregateRows(rows: SearchPerformanceRow[]): AggregatedMetrics {
  let clicks = 0;
  let impressions = 0;
  let positionWeighted = 0;

  for (const row of rows) {
    clicks += row.clicks;
    impressions += row.impressions;
    positionWeighted += row.position * row.impressions;
  }

  const ctr = impressions > 0 ? clicks / impressions : 0;
  const position = impressions > 0 ? positionWeighted / impressions : 0;
  return { clicks, impressions, ctr, position };
}

export function aggregatePage(rows: SearchPerformanceRow[]): PageAggregate[] {
  const byPage = new Map<string, SearchPerformanceRow[]>();
  for (const row of rows) {
    if (!row.page) continue;
    const list = byPage.get(row.page) ?? [];
    list.push(row);
    byPage.set(row.page, list);
  }
  return [...byPage.entries()]
    .map(([page, group]) => ({ page, ...aggregateRows(group) }))
    .sort((a, b) => b.impressions - a.impressions);
}

export function aggregateQuery(rows: SearchPerformanceRow[]): QueryAggregate[] {
  const byQuery = new Map<string, SearchPerformanceRow[]>();
  for (const row of rows) {
    if (!row.query) continue;
    const list = byQuery.get(row.query) ?? [];
    list.push(row);
    byQuery.set(row.query, list);
  }
  return [...byQuery.entries()]
    .map(([query, group]) => ({ query, ...aggregateRows(group) }))
    .sort((a, b) => b.impressions - a.impressions);
}

export function aggregatePageQuery(
  rows: SearchPerformanceRow[],
): PageQueryAggregate[] {
  const byKey = new Map<string, SearchPerformanceRow[]>();
  for (const row of rows) {
    if (!row.page || !row.query) continue;
    const key = `${row.page}\0${row.query}`;
    const list = byKey.get(key) ?? [];
    list.push(row);
    byKey.set(key, list);
  }
  return [...byKey.entries()]
    .map(([key, group]) => {
      const [page, query] = key.split("\0");
      return { page, query, ...aggregateRows(group) };
    })
    .sort((a, b) => b.impressions - a.impressions);
}

function pctDelta(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null;
  return ((current - previous) / previous) * 100;
}

export function comparePeriods(
  current: AggregatedMetrics,
  previous: AggregatedMetrics,
): PeriodDelta {
  return {
    clicksDeltaPct: pctDelta(current.clicks, previous.clicks),
    impressionsDeltaPct: pctDelta(current.impressions, previous.impressions),
    ctrDeltaPct: pctDelta(current.ctr, previous.ctr),
    positionDelta: current.position - previous.position,
  };
}
