import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import type {
  AffiliateClickAggregates,
  AffiliateClickEvent,
  AffiliateClickStore,
  AffiliateConversionStore,
} from "./types";
import { AFFILIATE_FUNNEL_VERSION } from "./types";

function analyticsRoot(cwd = process.cwd()): string {
  return path.join(cwd, "data/analytics");
}

export function affiliateClicksPath(cwd = process.cwd()): string {
  return path.join(analyticsRoot(cwd), "affiliate-clicks.json");
}

export function affiliateConversionsPath(cwd = process.cwd()): string {
  return path.join(analyticsRoot(cwd), "affiliate-conversions.json");
}

function emptyAggregates(): AffiliateClickAggregates {
  return {
    totalClicks: 0,
    uniqueSourcePages: 0,
    uniqueProducts: 0,
    byProduct: {},
    byCtaLocation: {},
    byTrafficSource: {},
  };
}

export function recomputeClickAggregates(
  events: AffiliateClickEvent[],
): AffiliateClickAggregates {
  const byProduct: Record<string, number> = {};
  const byCtaLocation: Record<string, number> = {};
  const byTrafficSource: Record<string, number> = {};
  const pages = new Set<string>();
  const products = new Set<string>();
  for (const e of events) {
    pages.add(e.sourcePage);
    products.add(e.productSlug);
    byProduct[e.productSlug] = (byProduct[e.productSlug] ?? 0) + 1;
    byCtaLocation[e.ctaLocation] = (byCtaLocation[e.ctaLocation] ?? 0) + 1;
    const ts = e.trafficSource ?? "unknown";
    byTrafficSource[ts] = (byTrafficSource[ts] ?? 0) + 1;
  }
  return {
    totalClicks: events.length,
    uniqueSourcePages: pages.size,
    uniqueProducts: products.size,
    byProduct,
    byCtaLocation,
    byTrafficSource,
  };
}

export function loadAffiliateClickStore(
  cwd = process.cwd(),
): AffiliateClickStore | null {
  const file = affiliateClicksPath(cwd);
  if (!existsSync(file)) return null;
  try {
    const raw = JSON.parse(readFileSync(file, "utf8")) as AffiliateClickStore;
    return {
      ...raw,
      events: (raw.events ?? []).map((e) => ({
        ...e,
        trackingId: e.trackingId ?? e.id ?? null,
      })),
    };
  } catch {
    return null;
  }
}

export function saveAffiliateClickStore(
  store: AffiliateClickStore,
  cwd = process.cwd(),
): void {
  const file = affiliateClicksPath(cwd);
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, `${JSON.stringify(store, null, 2)}\n`, "utf8");
}

export function ensureAffiliateClickStore(
  cwd = process.cwd(),
): AffiliateClickStore {
  const existing = loadAffiliateClickStore(cwd);
  if (existing) return existing;
  const now = new Date().toISOString();
  const store: AffiliateClickStore = {
    version: AFFILIATE_FUNNEL_VERSION,
    validity: "REAL",
    synthetic: false,
    generatedAt: now,
    dataThroughDate: null,
    sourceLabel: "first_party_beacon",
    events: [],
    aggregates: emptyAggregates(),
    notes: [
      "First-party affiliate click store — no PII (no IP, email, full referrer URL).",
      "Conversions/revenue live in affiliate-conversions.json and stay NOT_CONNECTED until network import.",
    ],
  };
  saveAffiliateClickStore(store, cwd);
  return store;
}

export function loadAffiliateConversionStore(
  cwd = process.cwd(),
): AffiliateConversionStore | null {
  const file = affiliateConversionsPath(cwd);
  if (!existsSync(file)) return null;
  try {
    const raw = JSON.parse(
      readFileSync(file, "utf8"),
    ) as AffiliateConversionStore;
    return {
      ...raw,
      commissionTotal: raw.commissionTotal ?? null,
      orderRevenueTotal: raw.orderRevenueTotal ?? null,
      revenueTotal: raw.revenueTotal ?? null,
    };
  } catch {
    return null;
  }
}

export function saveAffiliateConversionStore(
  store: AffiliateConversionStore,
  cwd = process.cwd(),
): void {
  const file = affiliateConversionsPath(cwd);
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, `${JSON.stringify(store, null, 2)}\n`, "utf8");
}

/** Placeholder conversions file — validity NOT_CONNECTED until a real network export is imported. */
export function ensureAffiliateConversionPlaceholder(
  cwd = process.cwd(),
): AffiliateConversionStore {
  const existing = loadAffiliateConversionStore(cwd);
  if (existing) {
    if (
      existing.validity === "NOT_CONNECTED" &&
      existing.conversions.length === 0 &&
      (existing.version !== AFFILIATE_FUNNEL_VERSION ||
        existing.commissionTotal === undefined ||
        existing.orderRevenueTotal === undefined)
    ) {
      const migrated: AffiliateConversionStore = {
        ...existing,
        version: AFFILIATE_FUNNEL_VERSION,
        commissionTotal: null,
        orderRevenueTotal: null,
        revenueTotal: null,
        notes: [
          "NOT_CONNECTED — do not display $0 revenue or 0 conversions.",
          "Import Impact/PartnerStack/CJ/ShareASale (etc.) CSV/JSON via analytics:affiliate-conversions.",
          "Drop files under data/analytics/imports/{impact,cj,shareasale,partnerstack}/",
        ],
      };
      saveAffiliateConversionStore(migrated, cwd);
      return migrated;
    }
    return existing;
  }
  const store: AffiliateConversionStore = {
    version: AFFILIATE_FUNNEL_VERSION,
    validity: "NOT_CONNECTED",
    synthetic: false,
    generatedAt: new Date().toISOString(),
    dataThroughDate: null,
    sourceLabel: null,
    provider: null,
    conversions: [],
    commissionTotal: null,
    orderRevenueTotal: null,
    revenueTotal: null,
    revenueCurrency: null,
    notes: [
      "NOT_CONNECTED — do not display $0 revenue or 0 conversions.",
      "Import Impact/PartnerStack/CJ/ShareASale (etc.) CSV/JSON via analytics:affiliate-conversions.",
      "Drop files under data/analytics/imports/{impact,cj,shareasale,partnerstack}/",
    ],
  };
  saveAffiliateConversionStore(store, cwd);
  return store;
}
