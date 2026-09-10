import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import type {
  OutdatedPricingMark,
  PriceChangeConfidence,
  PriceMonitorGrowthSignal,
} from "@/domain";
import type { PriceChangeImpactPage } from "./impact";

const DIR = path.join(process.cwd(), "data/pricing");
const FILE = path.join(DIR, "outdated-pricing.json");

export type OutdatedPricingStore = {
  version: "1.0.0";
  updatedAt: string;
  marks: OutdatedPricingMark[];
};

function emptyStore(): OutdatedPricingStore {
  return {
    version: "1.0.0",
    updatedAt: new Date(0).toISOString(),
    marks: [],
  };
}

export function getOutdatedPricingStorePath(): string {
  return FILE;
}

export function loadOutdatedPricingStore(
  cwd = process.cwd(),
): OutdatedPricingStore {
  const file = path.join(cwd, "data/pricing/outdated-pricing.json");
  if (!existsSync(file)) return emptyStore();
  try {
    const raw = JSON.parse(readFileSync(file, "utf8")) as OutdatedPricingStore;
    return {
      version: "1.0.0",
      updatedAt: raw.updatedAt ?? new Date(0).toISOString(),
      marks: Array.isArray(raw.marks) ? raw.marks : [],
    };
  } catch {
    return emptyStore();
  }
}

function persist(store: OutdatedPricingStore, cwd = process.cwd()): void {
  const file = path.join(cwd, "data/pricing/outdated-pricing.json");
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, `${JSON.stringify(store, null, 2)}\n`, "utf8");
}

/**
 * Mark dependent pages OUTDATED_PRICING until refreshed.
 * Does not auto-deindex or rewrite page copy.
 */
export function markPagesOutdatedPricing(
  pages: PriceChangeImpactPage[],
  opts: {
    productId: string;
    reason: string;
    confidence: PriceChangeConfidence;
    cwd?: string;
  },
): OutdatedPricingMark[] {
  const cwd = opts.cwd ?? process.cwd();
  const store = loadOutdatedPricingStore(cwd);
  const now = new Date().toISOString();
  const written: OutdatedPricingMark[] = [];

  for (const page of pages) {
    const existingIdx = store.marks.findIndex(
      (m) =>
        m.path === page.path &&
        m.productId === opts.productId &&
        m.clearedAt == null,
    );
    const mark: OutdatedPricingMark = {
      code: "OUTDATED_PRICING",
      path: page.path,
      productId: opts.productId,
      reason: opts.reason,
      confidence: opts.confidence,
      markedAt:
        existingIdx >= 0 ? store.marks[existingIdx]!.markedAt : now,
      clearedAt: null,
      visibleFreshnessRequired: true,
    };
    if (existingIdx >= 0) {
      store.marks[existingIdx] = mark;
    } else {
      store.marks.push(mark);
    }
    written.push(mark);
  }

  store.updatedAt = now;
  persist(store, cwd);
  return written;
}

export function clearOutdatedPricingForPath(
  pagePath: string,
  opts?: { productId?: string; cwd?: string },
): number {
  const cwd = opts?.cwd ?? process.cwd();
  const store = loadOutdatedPricingStore(cwd);
  const now = new Date().toISOString();
  let cleared = 0;
  for (const mark of store.marks) {
    if (mark.clearedAt != null) continue;
    if (mark.path !== pagePath) continue;
    if (opts?.productId && mark.productId !== opts.productId) continue;
    mark.clearedAt = now;
    cleared += 1;
  }
  if (cleared > 0) {
    store.updatedAt = now;
    persist(store, cwd);
  }
  return cleared;
}

export function clearOutdatedPricingForProduct(
  productId: string,
  opts?: { cwd?: string },
): number {
  const cwd = opts?.cwd ?? process.cwd();
  const store = loadOutdatedPricingStore(cwd);
  const now = new Date().toISOString();
  let cleared = 0;
  for (const mark of store.marks) {
    if (mark.clearedAt != null) continue;
    if (mark.productId !== productId) continue;
    mark.clearedAt = now;
    cleared += 1;
  }
  if (cleared > 0) {
    store.updatedAt = now;
    persist(store, cwd);
  }
  return cleared;
}

export function getActiveOutdatedPricingMarks(
  opts?: { path?: string; productId?: string; cwd?: string },
): OutdatedPricingMark[] {
  const store = loadOutdatedPricingStore(opts?.cwd);
  return store.marks.filter((m) => {
    if (m.clearedAt != null) return false;
    if (opts?.path && m.path !== opts.path) return false;
    if (opts?.productId && m.productId !== opts.productId) return false;
    return true;
  });
}

export function isPathOutdatedPricing(
  pagePath: string,
  opts?: { cwd?: string },
): OutdatedPricingMark | null {
  return (
    getActiveOutdatedPricingMarks({ path: pagePath, cwd: opts?.cwd })[0] ??
    null
  );
}

export function marksFromGrowthSignals(
  signals: PriceMonitorGrowthSignal[],
  opts?: { cwd?: string },
): OutdatedPricingMark[] {
  const byKey = new Map<string, PriceMonitorGrowthSignal>();
  for (const s of signals) {
    if (!s.outdatedPricing) continue;
    byKey.set(`${s.path}|${s.productId}`, s);
  }
  const written: OutdatedPricingMark[] = [];
  for (const signal of byKey.values()) {
    const pages: PriceChangeImpactPage[] = [
      {
        path: signal.path,
        pageType: "pricing",
        slug: signal.productId,
        productId: signal.productId,
      },
    ];
    // Prefer full impact resolution when product-scoped; here we mark the path.
    written.push(
      ...markPagesOutdatedPricing(
        [
          {
            path: signal.path,
            pageType: guessPageType(signal.path),
            slug: signal.productId,
            productId: signal.productId,
          },
        ],
        {
          productId: signal.productId,
          reason: signal.reason,
          confidence: signal.confidence,
          cwd: opts?.cwd,
        },
      ),
    );
    void pages;
  }
  return written;
}

function guessPageType(
  pagePath: string,
): PriceChangeImpactPage["pageType"] {
  if (pagePath.startsWith("/software/")) return "software-review";
  if (pagePath.startsWith("/pricing/")) return "pricing";
  if (pagePath.startsWith("/compare/")) return "comparison";
  if (pagePath.startsWith("/tools/")) return "tool";
  if (pagePath.startsWith("/best/")) return "best";
  if (pagePath.startsWith("/categories/")) return "category";
  if (pagePath.startsWith("/research/")) return "research";
  if (pagePath.startsWith("/alternatives/")) return "alternatives";
  return "pricing";
}
