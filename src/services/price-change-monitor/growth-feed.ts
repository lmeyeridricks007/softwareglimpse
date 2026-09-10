import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { PriceMonitorGrowthSignal } from "@/domain";

export { applyGrowthSignalsToRefreshCandidates } from "./growth-feed-apply";

const SIGNALS_DIR = path.join(process.cwd(), "data/pricing");
const SIGNALS_FILE = path.join(SIGNALS_DIR, "price-change-growth-signals.json");

export type PriceChangeGrowthFeed = {
  generatedAt: string;
  engine: "price-change-monitor";
  note: string;
  signals: PriceMonitorGrowthSignal[];
};

/**
 * Persist growth signals for organic growth / refresh prioritization.
 * Ranking pages with outdated pricing receive increased refresh priority.
 */
export function writePriceChangeGrowthSignals(
  signals: PriceMonitorGrowthSignal[],
): PriceChangeGrowthFeed {
  const feed: PriceChangeGrowthFeed = {
    generatedAt: new Date().toISOString(),
    engine: "price-change-monitor",
    note: "Feed for refresh scanner and organic growth prioritization. Unverified (LIKELY / REQUIRES_REVIEW) must not be published as pricing facts.",
    signals,
  };

  if (!existsSync(SIGNALS_DIR)) {
    mkdirSync(SIGNALS_DIR, { recursive: true });
  }
  writeFileSync(SIGNALS_FILE, `${JSON.stringify(feed, null, 2)}\n`, "utf8");
  return feed;
}

export function getPriceChangeGrowthSignalsPath(): string {
  return SIGNALS_FILE;
}
