/**
 * Join network conversions to first-party clicks only when identifiers allow.
 * Never invent attribution.
 */
import type {
  AffiliateClickEvent,
  AffiliateClickStore,
  AffiliateConversionRow,
  AffiliateConversionStore,
  AffiliateFunnelReport,
  AffiliateFunnelValidity,
} from "./types";
import { AFFILIATE_FUNNEL_VERSION } from "./types";

const STALE_DAYS = 45;

function daysSinceIso(iso: string | null | undefined, now = Date.now()): number | null {
  if (!iso) return null;
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return null;
  return Math.floor((now - t) / (1000 * 60 * 60 * 24));
}

export function classifyFunnelValidity(opts: {
  connected: boolean;
  synthetic?: boolean;
  dataThroughDate?: string | null;
  generatedAt?: string | null;
  partial?: boolean;
}): AffiliateFunnelValidity {
  if (!opts.connected) return "NOT_CONNECTED";
  if (opts.synthetic) return "FIXTURE";
  const age =
    daysSinceIso(opts.dataThroughDate) ?? daysSinceIso(opts.generatedAt);
  if (age != null && age > STALE_DAYS) return "STALE";
  if (opts.partial) return "PARTIAL";
  return "REAL";
}

function clickLookupKeys(e: AffiliateClickEvent): string[] {
  const keys = [e.id];
  if (e.trackingId) keys.push(e.trackingId);
  return keys.map((k) => k.toLowerCase());
}

/**
 * Match conversion → click only when clickId equals a known click id/trackingId.
 */
export function matchConversionsToClicks(
  conversions: AffiliateConversionRow[],
  clicks: AffiliateClickEvent[],
): {
  matched: Array<{
    conversion: AffiliateConversionRow;
    click: AffiliateClickEvent;
  }>;
  unmatched: AffiliateConversionRow[];
} {
  const byId = new Map<string, AffiliateClickEvent>();
  for (const c of clicks) {
    for (const k of clickLookupKeys(c)) byId.set(k, c);
  }
  const matched: Array<{
    conversion: AffiliateConversionRow;
    click: AffiliateClickEvent;
  }> = [];
  const unmatched: AffiliateConversionRow[] = [];
  for (const conv of conversions) {
    const key = conv.clickId?.trim().toLowerCase();
    if (!key) {
      unmatched.push(conv);
      continue;
    }
    const click = byId.get(key);
    if (click) matched.push({ conversion: conv, click });
    else unmatched.push(conv);
  }
  return { matched, unmatched };
}

function sumNullable(
  values: Array<number | null | undefined>,
): number | null {
  if (values.length === 0) return null;
  if (values.some((v) => v == null || !Number.isFinite(v))) return null;
  return values.reduce<number>((s, v) => s + (v as number), 0);
}

export function recomputeConversionMoney(
  conversions: AffiliateConversionRow[],
): {
  commissionTotal: number | null;
  orderRevenueTotal: number | null;
  revenueTotal: number | null;
  revenueCurrency: string | null;
} {
  const commissions = conversions.map(
    (c) => c.commissionAmount ?? (c.amountKind === "commission" ? c.amount : null),
  );
  const orders = conversions.map(
    (c) => c.orderRevenue ?? (c.amountKind === "sale" ? c.amount : null),
  );
  const amounts = conversions.map((c) => c.amount);
  return {
    commissionTotal: sumNullable(commissions),
    orderRevenueTotal: sumNullable(orders),
    revenueTotal: sumNullable(amounts),
    revenueCurrency: conversions.find((c) => c.currency)?.currency ?? null,
  };
}

/**
 * Build funnel report for dashboard / CLI.
 * Never shows conversion/revenue zeros when source is NOT_CONNECTED.
 */
export function buildAffiliateFunnelReport(
  clicks: AffiliateClickStore | null,
  conversions: AffiliateConversionStore | null,
): AffiliateFunnelReport {
  const notes: string[] = [];
  const clicksConnected =
    clicks != null &&
    !clicks.synthetic &&
    (clicks.validity === "REAL" ||
      clicks.validity === "PARTIAL" ||
      clicks.validity === "STALE");
  const conversionsConnected =
    conversions != null &&
    !conversions.synthetic &&
    (conversions.validity === "REAL" ||
      conversions.validity === "PARTIAL" ||
      conversions.validity === "STALE");

  const clickEvents = clicksConnected ? clicks!.events : [];
  const convRows = conversionsConnected ? conversions!.conversions : [];
  const { matched, unmatched } = matchConversionsToClicks(
    convRows,
    clickEvents,
  );

  const clickCount = clicksConnected ? clicks!.aggregates.totalClicks : 0;
  const conversionRate =
    clicksConnected && conversionsConnected && clickCount > 0
      ? matched.length / clickCount
      : null;

  const pageStats = new Map<
    string,
    { matchedConversions: number; clicks: number }
  >();
  for (const e of clickEvents) {
    const cur = pageStats.get(e.sourcePage) ?? {
      matchedConversions: 0,
      clicks: 0,
    };
    cur.clicks += 1;
    pageStats.set(e.sourcePage, cur);
  }
  for (const m of matched) {
    const cur = pageStats.get(m.click.sourcePage) ?? {
      matchedConversions: 0,
      clicks: 0,
    };
    cur.matchedConversions += 1;
    pageStats.set(m.click.sourcePage, cur);
  }
  const topConvertingSourcePages = [...pageStats.entries()]
    .map(([path, s]) => ({ path, ...s }))
    .filter((s) => s.matchedConversions > 0 || s.clicks > 0)
    .sort(
      (a, b) =>
        b.matchedConversions - a.matchedConversions || b.clicks - a.clicks,
    )
    .slice(0, 15);

  const productStats = new Map<
    string,
    { matchedConversions: number; clicks: number; commissionParts: number[] }
  >();
  for (const e of clickEvents) {
    const cur = productStats.get(e.productSlug) ?? {
      matchedConversions: 0,
      clicks: 0,
      commissionParts: [],
    };
    cur.clicks += 1;
    productStats.set(e.productSlug, cur);
  }
  for (const m of matched) {
    const slug =
      m.conversion.productSlug ?? m.click.productSlug ?? "unknown";
    const cur = productStats.get(slug) ?? {
      matchedConversions: 0,
      clicks: 0,
      commissionParts: [],
    };
    cur.matchedConversions += 1;
    const c =
      m.conversion.commissionAmount ??
      (m.conversion.amountKind === "commission" ? m.conversion.amount : null);
    if (c != null) cur.commissionParts.push(c);
    productStats.set(slug, cur);
  }
  const topProducts = [...productStats.entries()]
    .map(([productSlug, s]) => ({
      productSlug,
      matchedConversions: s.matchedConversions,
      clicks: s.clicks,
      commission:
        s.commissionParts.length > 0
          ? s.commissionParts.reduce((a, b) => a + b, 0)
          : null,
    }))
    .sort(
      (a, b) =>
        b.matchedConversions - a.matchedConversions || b.clicks - a.clicks,
    )
    .slice(0, 15);

  if (!clicksConnected) {
    notes.push("Affiliate clicks NOT_CONNECTED — deploy beacon/go or import GA4.");
  }
  if (!conversionsConnected) {
    notes.push(
      "Conversions NOT_CONNECTED — import network export; do not display 0 conversions.",
    );
  } else {
    notes.push(
      `Matched ${matched.length}/${convRows.length} conversions via clickId (unmatched ${unmatched.length}).`,
    );
    if (unmatched.length > 0) {
      notes.push(
        "Unmatched conversions lack a joinable clickId or the click is outside the retained window — not invented attribution.",
      );
    }
  }

  const money = conversionsConnected
    ? recomputeConversionMoney(convRows)
    : {
        commissionTotal: null,
        orderRevenueTotal: null,
        revenueTotal: null,
        revenueCurrency: null,
      };

  const commissionValidity: AffiliateFunnelValidity = !conversionsConnected
    ? "NOT_CONNECTED"
    : money.commissionTotal == null
      ? "PARTIAL"
      : classifyFunnelValidity({
          connected: true,
          dataThroughDate: conversions!.dataThroughDate,
        });
  const revenueValidity: AffiliateFunnelValidity = !conversionsConnected
    ? "NOT_CONNECTED"
    : money.orderRevenueTotal == null
      ? "PARTIAL"
      : classifyFunnelValidity({
          connected: true,
          dataThroughDate: conversions!.dataThroughDate,
        });

  return {
    version: AFFILIATE_FUNNEL_VERSION,
    generatedAt: new Date().toISOString(),
    clicks: {
      validity: clicksConnected
        ? clicks!.validity === "STALE"
          ? "STALE"
          : "REAL"
        : "NOT_CONNECTED",
      count: clickCount,
      uniqueSourcePages: clicksConnected
        ? clicks!.aggregates.uniqueSourcePages
        : 0,
      uniqueProducts: clicksConnected
        ? clicks!.aggregates.uniqueProducts
        : 0,
    },
    conversions: {
      validity: conversionsConnected
        ? conversions!.validity
        : "NOT_CONNECTED",
      count: conversionsConnected ? convRows.length : 0,
      matched: conversionsConnected ? matched.length : 0,
      unmatched: conversionsConnected ? unmatched.length : 0,
      conversionRate,
    },
    commission: {
      validity: commissionValidity,
      total: money.commissionTotal,
      currency: money.revenueCurrency,
    },
    revenue: {
      validity: revenueValidity,
      total: money.orderRevenueTotal,
      currency: money.revenueCurrency,
    },
    topConvertingSourcePages: conversionsConnected
      ? topConvertingSourcePages
      : [],
    topProducts: clicksConnected || conversionsConnected ? topProducts : [],
    notes,
  };
}
