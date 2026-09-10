/**
 * First-party affiliate funnel aggregates — clicks now, conversions/revenue via import.
 * Never invents revenue. Never stores unnecessary personal data.
 */
export const AFFILIATE_FUNNEL_VERSION = "1.1.0";

export type AffiliateFunnelValidity =
  | "REAL"
  | "PARTIAL"
  | "FIXTURE"
  | "NOT_CONNECTED"
  | "STALE";

export type AffiliateClickEvent = {
  id: string;
  /** ISO timestamp */
  ts: string;
  /** Path only — no query/hash */
  sourcePage: string;
  productSlug: string;
  /** Affiliate programme / network id when known */
  programId: string | null;
  vendor: string | null;
  /** CTA placement: hero | sidebar | comparison_table | go_redirect | … */
  ctaLocation: string;
  /** affiliate | official_fallback */
  ctaType: string;
  destinationDomain: string | null;
  destinationType: string | null;
  /** Referrer hostname only (no full URL / PII) */
  referrerHost: string | null;
  /** Coarse: organic | referral | direct | unknown */
  trafficSource: string | null;
  /** go_redirect | beacon | ga4_import | manual_import */
  captureChannel: string;
  /**
   * Network sub-id / click ref when known (for join). Same as id when we mint
   * the tracking token ourselves — never invents network-side ids.
   */
  trackingId: string | null;
};

export type AffiliateClickAggregates = {
  totalClicks: number;
  uniqueSourcePages: number;
  uniqueProducts: number;
  byProduct: Record<string, number>;
  byCtaLocation: Record<string, number>;
  byTrafficSource: Record<string, number>;
};

export type AffiliateClickStore = {
  version: string;
  validity: AffiliateFunnelValidity;
  synthetic: boolean;
  generatedAt: string;
  dataThroughDate: string | null;
  sourceLabel: string | null;
  events: AffiliateClickEvent[];
  aggregates: AffiliateClickAggregates;
  notes: string[];
};

export type AffiliateConversionRow = {
  id: string;
  /** ISO conversion time from network */
  convertedAt: string;
  productSlug: string | null;
  programId: string | null;
  network: string | null;
  /** Network transaction / order id (non-PII) */
  externalId: string | null;
  /** Attributed click id when known from network */
  clickId: string | null;
  status: "pending" | "approved" | "rejected" | "paid" | "unknown";
  /** Currency code */
  currency: string | null;
  /** Primary amount for backward compat — prefer commission when present */
  amount: number | null;
  amountKind: "commission" | "sale" | "unknown";
  /** Commission/payout when provided by network */
  commissionAmount?: number | null;
  /** Order/sale revenue when provided — never invent */
  orderRevenue?: number | null;
  /** Vendor/program label from export (non-PII) */
  vendor?: string | null;
};

export type AffiliateConversionStore = {
  version: string;
  validity: AffiliateFunnelValidity;
  synthetic: boolean;
  generatedAt: string;
  dataThroughDate: string | null;
  sourceLabel: string | null;
  provider: string | null;
  conversions: AffiliateConversionRow[];
  /** Sum of commission amounts when every row has commission; else null */
  commissionTotal: number | null;
  /** Sum of order revenue when every row has orderRevenue; else null */
  orderRevenueTotal: number | null;
  /**
   * @deprecated Prefer commissionTotal / orderRevenueTotal.
   * Sum of `amount` only when every row has a numeric amount; else null.
   */
  revenueTotal: number | null;
  revenueCurrency: string | null;
  notes: string[];
};

export type AffiliateFunnelReport = {
  version: string;
  generatedAt: string;
  clicks: {
    validity: AffiliateFunnelValidity;
    count: number;
    uniqueSourcePages: number;
    uniqueProducts: number;
  };
  conversions: {
    validity: AffiliateFunnelValidity;
    count: number;
    matched: number;
    unmatched: number;
    /** matched/clicks when clicks > 0 and conversions connected; else null */
    conversionRate: number | null;
  };
  commission: {
    validity: AffiliateFunnelValidity;
    total: number | null;
    currency: string | null;
  };
  revenue: {
    validity: AffiliateFunnelValidity;
    total: number | null;
    currency: string | null;
  };
  topConvertingSourcePages: Array<{
    path: string;
    matchedConversions: number;
    clicks: number;
  }>;
  topProducts: Array<{
    productSlug: string;
    matchedConversions: number;
    clicks: number;
    commission: number | null;
  }>;
  notes: string[];
};
