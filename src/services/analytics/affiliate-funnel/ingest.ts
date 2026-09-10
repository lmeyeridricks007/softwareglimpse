/**
 * Affiliate conversion/click import — network adapters + safe persistence.
 * Never invents attribution or $0 revenue.
 */
import { readFileSync, readdirSync, existsSync, mkdirSync, statSync } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { AFFILIATE_FUNNEL_VERSION } from "./types";
import type {
  AffiliateClickEvent,
  AffiliateConversionStore,
} from "./types";
import {
  recomputeClickAggregates,
  saveAffiliateClickStore,
  saveAffiliateConversionStore,
  ensureAffiliateClickStore,
  loadAffiliateClickStore,
  loadAffiliateConversionStore,
} from "./store";
import {
  recordAffiliateClick,
  sanitizeReferrerHost,
  sanitizeSourcePage,
  inferTrafficSource,
} from "./record-click";
import {
  looksFixturePath,
  parseNetworkExportPayload,
} from "./adapters";
import {
  classifyFunnelValidity,
  recomputeConversionMoney,
} from "./funnel";

export { looksFixturePath } from "./adapters";

/**
 * Import GA4 / first-party CSV or JSON of affiliate_clicked aggregates/events.
 * Rejects fixture paths.
 */
export function importAffiliateClicksFromFile(
  filePath: string,
  cwd = process.cwd(),
): { imported: number; storePath: string } {
  if (looksFixturePath(filePath)) {
    throw new Error(`Refusing fixture/sample affiliate click export: ${filePath}`);
  }
  const abs = path.isAbsolute(filePath) ? filePath : path.join(cwd, filePath);
  const rawText = readFileSync(abs, "utf8");
  const raw = JSON.parse(rawText) as {
    synthetic?: boolean;
    events?: Array<Partial<AffiliateClickEvent> & { productSlug?: string }>;
    rows?: Array<Record<string, unknown>>;
  };
  if (raw.synthetic) {
    throw new Error("Refusing synthetic:true affiliate click export");
  }

  let imported = 0;
  if (Array.isArray(raw.events)) {
    for (const row of raw.events) {
      if (!row.productSlug) continue;
      recordAffiliateClick(
        {
          productSlug: row.productSlug,
          sourcePage: row.sourcePage,
          programId: row.programId,
          vendor: row.vendor,
          ctaLocation: row.ctaLocation,
          ctaType: row.ctaType,
          destinationDomain: row.destinationDomain,
          destinationType: row.destinationType,
          referrerHost: row.referrerHost,
          trafficSource: row.trafficSource,
          captureChannel: row.captureChannel ?? "ga4_import",
          ts: row.ts,
          trackingId: row.trackingId ?? row.id ?? null,
        },
        cwd,
      );
      imported += 1;
    }
  } else if (Array.isArray(raw.rows)) {
    const store = ensureAffiliateClickStore(cwd);
    const events = [...store.events];
    for (const row of raw.rows) {
      const slug = String(row.software_id ?? row.productSlug ?? "").trim();
      if (!slug) continue;
      const count = Math.max(0, Number(row.event_count ?? row.clicks ?? 1));
      const page = sanitizeSourcePage(
        String(row.page_path ?? row.sourcePage ?? "/"),
      );
      const placement = String(row.placement ?? row.ctaLocation ?? "other");
      for (let i = 0; i < Math.min(count, 500); i++) {
        const referrerHost = sanitizeReferrerHost(
          row.referrer_host != null ? String(row.referrer_host) : null,
        );
        const id = randomUUID();
        events.push({
          id,
          ts: String(row.ts ?? new Date().toISOString()),
          sourcePage: page,
          productSlug: slug.toLowerCase(),
          programId:
            row.affiliate_program != null
              ? String(row.affiliate_program)
              : null,
          vendor: row.vendor != null ? String(row.vendor) : null,
          ctaLocation: placement.toLowerCase(),
          ctaType: "affiliate",
          destinationDomain:
            row.destination_domain != null
              ? String(row.destination_domain)
              : null,
          destinationType:
            row.destination_type != null
              ? String(row.destination_type)
              : null,
          referrerHost,
          trafficSource: inferTrafficSource(referrerHost),
          captureChannel: "ga4_import",
          trackingId:
            row.tracking_id != null
              ? String(row.tracking_id)
              : row.click_id != null
                ? String(row.click_id)
                : id,
        });
        imported += 1;
      }
    }
    const capped = events.slice(-5_000);
    saveAffiliateClickStore(
      {
        ...store,
        validity: "REAL",
        synthetic: false,
        generatedAt: new Date().toISOString(),
        dataThroughDate: new Date().toISOString().slice(0, 10),
        sourceLabel: path.basename(abs),
        events: capped,
        aggregates: recomputeClickAggregates(capped),
      },
      cwd,
    );
  }

  return {
    imported,
    storePath: path.join(cwd, "data/analytics/affiliate-clicks.json"),
  };
}

/**
 * Import affiliate network conversion/revenue export (JSON or CSV).
 * Amounts may be null — never coerce missing revenue to $0.
 */
export function importAffiliateConversionsFromFile(
  filePath: string,
  cwd = process.cwd(),
): AffiliateConversionStore {
  if (looksFixturePath(filePath)) {
    throw new Error(
      `Refusing fixture/sample conversion export: ${filePath}`,
    );
  }
  const abs = path.isAbsolute(filePath) ? filePath : path.join(cwd, filePath);
  const rawText = readFileSync(abs, "utf8");
  const parsed = parseNetworkExportPayload(rawText, {
    filename: path.basename(abs),
    isJson: abs.toLowerCase().endsWith(".json"),
  });

  const conversions = parsed.rows;
  const money = recomputeConversionMoney(conversions);
  const hasAnyCommission = conversions.some(
    (c) =>
      c.commissionAmount != null ||
      (c.amountKind === "commission" && c.amount != null),
  );
  const hasAnyOrder = conversions.some(
    (c) =>
      c.orderRevenue != null ||
      (c.amountKind === "sale" && c.amount != null),
  );
  const incompleteCommission =
    hasAnyCommission && money.commissionTotal == null;
  const incompleteOrder = hasAnyOrder && money.orderRevenueTotal == null;

  const finalValidity: AffiliateConversionStore["validity"] =
    conversions.length === 0
      ? "NOT_CONNECTED"
      : classifyFunnelValidity({
          connected: true,
          dataThroughDate: parsed.dataThroughDate,
          partial: incompleteCommission || incompleteOrder,
        });

  const store: AffiliateConversionStore = {
    version: AFFILIATE_FUNNEL_VERSION,
    validity: finalValidity,
    synthetic: false,
    generatedAt: new Date().toISOString(),
    dataThroughDate: parsed.dataThroughDate,
    sourceLabel: parsed.sourceLabel,
    provider: parsed.provider === "unknown" ? null : parsed.provider,
    conversions,
    commissionTotal: money.commissionTotal,
    orderRevenueTotal: money.orderRevenueTotal,
    revenueTotal: money.revenueTotal,
    revenueCurrency: money.revenueCurrency,
    notes: [
      ...parsed.notes,
      conversions.length > 0
        ? `Imported ${conversions.length} conversion rows from ${path.basename(abs)}`
        : "Import contained zero conversions — remaining NOT_CONNECTED",
      money.commissionTotal == null
        ? "Commission total withheld — incomplete commission coverage (never show $0)"
        : `Commission total summed from complete commission fields`,
      money.orderRevenueTotal == null
        ? "Order revenue withheld — incomplete sale amounts (never show $0)"
        : `Order revenue summed from complete sale fields`,
    ],
  };
  saveAffiliateConversionStore(store, cwd);
  return store;
}

const IMPORT_DIRS = [
  "data/analytics/imports",
  "data/analytics/imports/impact",
  "data/analytics/imports/cj",
  "data/analytics/imports/shareasale",
  "data/analytics/imports/partnerstack",
];

export function ensureAffiliateImportDirs(cwd = process.cwd()): void {
  for (const rel of IMPORT_DIRS) {
    mkdirSync(path.join(cwd, rel), { recursive: true });
  }
}

/**
 * Discover newest REAL conversion export under import dirs.
 */
export function discoverLatestConversionExport(
  cwd = process.cwd(),
): string | null {
  ensureAffiliateImportDirs(cwd);
  const candidates: Array<{ path: string; mtime: number }> = [];
  for (const rel of IMPORT_DIRS) {
    const dir = path.join(cwd, rel);
    if (!existsSync(dir)) continue;
    for (const name of readdirSync(dir)) {
      if (!/\.(json|csv)$/i.test(name)) continue;
      const full = path.join(dir, name);
      if (looksFixturePath(full)) continue;
      try {
        const st = readFileSync(full);
        if (st.length < 8) continue;
        candidates.push({
          path: full,
          mtime: statSync(full).mtimeMs,
        });
      } catch {
        /* skip */
      }
    }
  }
  candidates.sort((a, b) => b.mtime - a.mtime);
  return candidates[0]?.path ?? null;
}

export function loadFunnelStores(cwd = process.cwd()) {
  return {
    clicks: loadAffiliateClickStore(cwd),
    conversions: loadAffiliateConversionStore(cwd),
  };
}
