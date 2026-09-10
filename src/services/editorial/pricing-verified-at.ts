import type { ProductResearchEnrichment, Software } from "@/domain";
import { loadEnrichment } from "@/data/research/store";
import { getSoftware } from "@/data";
import { resolveProductPricing } from "@/services/pricing/resolve-product-pricing";

/**
 * Canonical pricing-verification timestamp for **evidence / DATA_VERIFIED**.
 *
 * Accepts only editorial/vendor verification stamps:
 * 1. `software.pricingVerifiedAt`
 * 2. `software.pricing.verifiedAt` (product catalogue envelope)
 * 3. Enrichment `pricing.verifiedAt` with sourceIds that is **not** a twin of
 *    research/import/build clocks
 *
 * Must NOT automatically qualify (Phase 2):
 * - file modified time / build timestamp
 * - generatedAt / migration date / catalogue import timestamp
 * - content-generation / backfill timestamp
 * - enrichment.updatedAt twin
 * - domainCheckedAt research-check clocks (any domain)
 * - identical ISO stamps shared across many products (batch backfill)
 *
 * Freshness UIs may still read `resolveProductPricing().verifiedAt` /
 * `domainCheckedAt` — those are “checked in research”, not DATA_VERIFIED.
 */

export type PricingVerificationSource =
  | "software.pricingVerifiedAt"
  | "software.pricing.verifiedAt"
  | "enrichment.pricing.verifiedAt"
  | "none";

export type PricingVerificationSourceType =
  | "editorial_catalogue"
  | "vendor_enrichment"
  | "invalid_or_absent";

export type PricingVerificationMethod =
  | "product_field"
  | "pricing_envelope"
  | "enrichment_pricing_with_sources"
  | "rejected"
  | "absent";

export type PricingVerificationRejectReason =
  | "no_timestamp"
  | "matches_enrichment_updatedAt"
  | "matches_enrichment_generatedAt"
  | "matches_domain_checked_at"
  | "mass_domain_checked_batch"
  | "mass_identical_stamp"
  | "suspicious_mass_calendar_day"
  | "enrichment_verified_without_sources"
  | "domain_checked_only_without_sources";

export type PricingVerificationExplanation = {
  slug: string;
  acceptedAt: string | null;
  /** Field that would / did trigger verification. */
  field: string | null;
  source: PricingVerificationSource;
  sourceType: PricingVerificationSourceType;
  verificationMethod: PricingVerificationMethod;
  rejectedCandidateAt: string | null;
  rejectReason: PricingVerificationRejectReason | null;
};

/** Per-product evidence trace for reconciliation dashboards (Phase 1). */
export type DataVerifiedEvidenceTrace = {
  product: string;
  classification: "DATA_VERIFIED" | "RESEARCHED" | "HANDS_ON_TESTED";
  field: string | null;
  verificationTimestamp: string | null;
  source: PricingVerificationSource;
  sourceType: PricingVerificationSourceType;
  verificationMethod: PricingVerificationMethod;
  rejectReason: PricingVerificationRejectReason | null;
  rejectedCandidateAt: string | null;
};

const MASS_IDENTICAL_STAMP_MIN = 3;
const SUSPICIOUS_DAY_MIN = 20;

let stampFrequencyCache: Map<string, number> | null = null;
let calendarDayFrequencyCache: Map<string, number> | null = null;

export function clearPricingVerificationCaches(): void {
  stampFrequencyCache = null;
  calendarDayFrequencyCache = null;
}

function enrichmentPricingStampFrequency(): Map<string, number> {
  if (stampFrequencyCache) return stampFrequencyCache;
  const map = new Map<string, number>();
  const dayMap = new Map<string, number>();
  for (const product of getSoftware({ includeUnpublished: true })) {
    const v = (
      loadEnrichment(product.slug)?.pricing as
        | { verifiedAt?: string }
        | undefined
    )?.verifiedAt?.trim();
    if (!v) continue;
    map.set(v, (map.get(v) ?? 0) + 1);
    const day = v.slice(0, 10);
    dayMap.set(day, (dayMap.get(day) ?? 0) + 1);
  }
  stampFrequencyCache = map;
  calendarDayFrequencyCache = dayMap;
  return map;
}

function enrichmentPricingDayFrequency(): Map<string, number> {
  enrichmentPricingStampFrequency();
  return calendarDayFrequencyCache ?? new Map();
}

function isMassDomainCheckedBatch(
  enrichment: ProductResearchEnrichment | null | undefined,
): { mass: boolean; stamp: string | null } {
  const vals = Object.values(enrichment?.domainCheckedAt ?? {}).filter(Boolean);
  if (vals.length < 5) return { mass: false, stamp: null };
  const unique = new Set(vals);
  if (unique.size !== 1) return { mass: false, stamp: null };
  return { mass: true, stamp: [...unique][0] ?? null };
}

function matchesAnyDomainCheckedAt(
  enrichment: ProductResearchEnrichment | null | undefined,
  candidate: string,
): boolean {
  const vals = Object.values(enrichment?.domainCheckedAt ?? {});
  return vals.some((v) => v === candidate);
}

export function resolvePricingVerifiedAt(
  software: Software | null | undefined,
): string | null {
  return explainPricingVerification(software).acceptedAt;
}

export function explainPricingVerification(
  software: Software | null | undefined,
): PricingVerificationExplanation {
  const slug = software?.slug ?? "";
  if (!software) {
    return {
      slug,
      acceptedAt: null,
      field: null,
      source: "none",
      sourceType: "invalid_or_absent",
      verificationMethod: "absent",
      rejectedCandidateAt: null,
      rejectReason: "no_timestamp",
    };
  }

  const top = software.pricingVerifiedAt?.trim() || null;
  if (top) {
    return {
      slug,
      acceptedAt: top,
      field: "software.pricingVerifiedAt",
      source: "software.pricingVerifiedAt",
      sourceType: "editorial_catalogue",
      verificationMethod: "product_field",
      rejectedCandidateAt: null,
      rejectReason: null,
    };
  }

  const envelope = software.pricing?.verifiedAt?.trim() || null;
  if (envelope) {
    return {
      slug,
      acceptedAt: envelope,
      field: "software.pricing.verifiedAt",
      source: "software.pricing.verifiedAt",
      sourceType: "editorial_catalogue",
      verificationMethod: "pricing_envelope",
      rejectedCandidateAt: null,
      rejectReason: null,
    };
  }

  const enrichment = loadEnrichment(software.slug);
  const resolved = resolveProductPricing(software);
  const enrichmentPricing = enrichment?.pricing as
    | { verifiedAt?: string; sourceIds?: string[] }
    | undefined;
  const enrichmentPricingVerified =
    enrichmentPricing?.verifiedAt?.trim() || null;
  const candidate =
    enrichmentPricingVerified ||
    resolved.verifiedAt?.trim() ||
    enrichment?.domainCheckedAt?.pricing?.trim() ||
    null;

  if (!candidate) {
    return {
      slug,
      acceptedAt: null,
      field: null,
      source: "none",
      sourceType: "invalid_or_absent",
      verificationMethod: "absent",
      rejectedCandidateAt: null,
      rejectReason: "no_timestamp",
    };
  }

  const field =
    enrichmentPricingVerified === candidate
      ? "enrichment.pricing.verifiedAt"
      : resolved.verifiedAt?.trim() === candidate
        ? "resolveProductPricing.verifiedAt"
        : "enrichment.domainCheckedAt.pricing";

  const updatedAt = enrichment?.updatedAt?.trim() || null;
  if (updatedAt && candidate === updatedAt) {
    return {
      slug,
      acceptedAt: null,
      field,
      source: "none",
      sourceType: "invalid_or_absent",
      verificationMethod: "rejected",
      rejectedCandidateAt: candidate,
      rejectReason: "matches_enrichment_updatedAt",
    };
  }

  const generatedAt =
    (enrichment as { generatedAt?: string } | null)?.generatedAt?.trim() ||
    null;
  if (generatedAt && candidate === generatedAt) {
    return {
      slug,
      acceptedAt: null,
      field,
      source: "none",
      sourceType: "invalid_or_absent",
      verificationMethod: "rejected",
      rejectedCandidateAt: candidate,
      rejectReason: "matches_enrichment_generatedAt",
    };
  }

  if (matchesAnyDomainCheckedAt(enrichment, candidate)) {
    return {
      slug,
      acceptedAt: null,
      field,
      source: "none",
      sourceType: "invalid_or_absent",
      verificationMethod: "rejected",
      rejectedCandidateAt: candidate,
      rejectReason: "matches_domain_checked_at",
    };
  }

  const { mass, stamp } = isMassDomainCheckedBatch(enrichment);
  if (mass && stamp && candidate === stamp) {
    return {
      slug,
      acceptedAt: null,
      field,
      source: "none",
      sourceType: "invalid_or_absent",
      verificationMethod: "rejected",
      rejectedCandidateAt: candidate,
      rejectReason: "mass_domain_checked_batch",
    };
  }

  const stampFreq = enrichmentPricingStampFrequency().get(candidate) ?? 0;
  if (stampFreq >= MASS_IDENTICAL_STAMP_MIN) {
    return {
      slug,
      acceptedAt: null,
      field,
      source: "none",
      sourceType: "invalid_or_absent",
      verificationMethod: "rejected",
      rejectedCandidateAt: candidate,
      rejectReason: "mass_identical_stamp",
    };
  }

  const sourceIds = enrichmentPricing?.sourceIds?.length ?? 0;

  // Unique enrichment stamps with vendor sourceIds are legitimate live
  // confirmations — even when many products are verified the same calendar day.
  // Calendar-day rejection only applies to source-less / backfill-like stamps.
  if (
    enrichmentPricingVerified &&
    enrichmentPricingVerified === candidate &&
    sourceIds > 0
  ) {
    return {
      slug,
      acceptedAt: enrichmentPricingVerified,
      field: "enrichment.pricing.verifiedAt",
      source: "enrichment.pricing.verifiedAt",
      sourceType: "vendor_enrichment",
      verificationMethod: "enrichment_pricing_with_sources",
      rejectedCandidateAt: null,
      rejectReason: null,
    };
  }

  const dayFreq = enrichmentPricingDayFrequency().get(candidate.slice(0, 10)) ?? 0;
  if (dayFreq >= SUSPICIOUS_DAY_MIN) {
    return {
      slug,
      acceptedAt: null,
      field,
      source: "none",
      sourceType: "invalid_or_absent",
      verificationMethod: "rejected",
      rejectedCandidateAt: candidate,
      rejectReason: "suspicious_mass_calendar_day",
    };
  }

  if (enrichmentPricingVerified && enrichmentPricingVerified === candidate) {
    if (sourceIds <= 0) {
      return {
        slug,
        acceptedAt: null,
        field,
        source: "none",
        sourceType: "invalid_or_absent",
        verificationMethod: "rejected",
        rejectedCandidateAt: candidate,
        rejectReason: "enrichment_verified_without_sources",
      };
    }
  }

  return {
    slug,
    acceptedAt: null,
    field,
    source: "none",
    sourceType: "invalid_or_absent",
    verificationMethod: "rejected",
    rejectedCandidateAt: candidate,
    rejectReason: "domain_checked_only_without_sources",
  };
}

/**
 * Evidence-facing pricing verification including optional editorial review stamp.
 * Review stamps count unless they collide with a mass enrichment backfill ISO.
 */
export function resolvePricingVerifiedAtForEvidence(
  software: Software | null | undefined,
  reviewPricingVerifiedAt?: string | null,
): string | null {
  const fromReview = reviewPricingVerifiedAt?.trim() || null;
  if (fromReview) {
    const freq = enrichmentPricingStampFrequency().get(fromReview) ?? 0;
    if (freq < MASS_IDENTICAL_STAMP_MIN) return fromReview;
  }
  return resolvePricingVerifiedAt(software);
}

export type DataVerifiedReconciliation = {
  total: number;
  accepted: number;
  rejected: number;
  bySource: Record<PricingVerificationSource, number>;
  bySourceType: Record<PricingVerificationSourceType, number>;
  byRejectReason: Record<string, number>;
  acceptedDateHistogram: Array<{ date: string; count: number }>;
  rejectedDateHistogram: Array<{ date: string; count: number }>;
  suspiciousMassDates: Array<{ date: string; rejectedCount: number }>;
  massIdenticalStamps: Array<{ stamp: string; count: number }>;
  /** Source coverage: share of catalogue with accepted verification. */
  sourceCoverage: {
    acceptedShare: number;
    editorialCatalogueShare: number;
    vendorEnrichmentShare: number;
    confidence: "high" | "medium" | "low";
  };
  traces: DataVerifiedEvidenceTrace[];
  examples: {
    accepted: PricingVerificationExplanation[];
    rejected: PricingVerificationExplanation[];
  };
};

/** Catalogue reconciliation for Growth Dashboard / editorial audits. */
export function reconcileDataVerifiedCoverage(
  softwareList?: Software[],
): DataVerifiedReconciliation {
  clearPricingVerificationCaches();
  const list = softwareList ?? getSoftware({ includeUnpublished: true });

  const bySource: Record<PricingVerificationSource, number> = {
    "software.pricingVerifiedAt": 0,
    "software.pricing.verifiedAt": 0,
    "enrichment.pricing.verifiedAt": 0,
    none: 0,
  };
  const bySourceType: Record<PricingVerificationSourceType, number> = {
    editorial_catalogue: 0,
    vendor_enrichment: 0,
    invalid_or_absent: 0,
  };
  const byRejectReason: Record<string, number> = {};
  const acceptedDates: Record<string, number> = {};
  const rejectedDates: Record<string, number> = {};
  const accepted: PricingVerificationExplanation[] = [];
  const rejected: PricingVerificationExplanation[] = [];
  const traces: DataVerifiedEvidenceTrace[] = [];

  for (const product of list) {
    const row = explainPricingVerification(product);
    bySource[row.source] += 1;
    bySourceType[row.sourceType] += 1;

    traces.push({
      product: product.slug,
      classification: row.acceptedAt ? "DATA_VERIFIED" : "RESEARCHED",
      field: row.field,
      verificationTimestamp: row.acceptedAt,
      source: row.source,
      sourceType: row.sourceType,
      verificationMethod: row.verificationMethod,
      rejectReason: row.rejectReason,
      rejectedCandidateAt: row.rejectedCandidateAt,
    });

    if (row.acceptedAt) {
      accepted.push(row);
      const d = row.acceptedAt.slice(0, 10);
      acceptedDates[d] = (acceptedDates[d] ?? 0) + 1;
    } else {
      rejected.push(row);
      const reason = row.rejectReason ?? "unknown";
      byRejectReason[reason] = (byRejectReason[reason] ?? 0) + 1;
      if (row.rejectedCandidateAt) {
        const d = row.rejectedCandidateAt.slice(0, 10);
        rejectedDates[d] = (rejectedDates[d] ?? 0) + 1;
      }
    }
  }

  const toHist = (m: Record<string, number>) =>
    Object.entries(m)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => b.count - a.count);

  const rejectedDateHistogram = toHist(rejectedDates);
  const suspiciousMassDates = rejectedDateHistogram
    .filter((r) => r.count >= SUSPICIOUS_DAY_MIN)
    .map((r) => ({ date: r.date, rejectedCount: r.count }));

  const massIdenticalStamps = [...enrichmentPricingStampFrequency().entries()]
    .filter(([, count]) => count >= MASS_IDENTICAL_STAMP_MIN)
    .map(([stamp, count]) => ({ stamp, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 25);

  const acceptedShare = list.length ? accepted.length / list.length : 0;
  const editorialCatalogueShare =
    list.length
      ? (bySourceType.editorial_catalogue) / list.length
      : 0;
  const vendorEnrichmentShare =
    list.length ? bySourceType.vendor_enrichment / list.length : 0;

  // High confidence when mass rejects dominate and accepted share is small.
  const confidence: "high" | "medium" | "low" =
    acceptedShare <= 0.05 &&
    (byRejectReason.matches_domain_checked_at ?? 0) +
      (byRejectReason.mass_domain_checked_batch ?? 0) +
      (byRejectReason.mass_identical_stamp ?? 0) >
      list.length * 0.5
      ? "high"
      : acceptedShare <= 0.2
        ? "medium"
        : "low";

  return {
    total: list.length,
    accepted: accepted.length,
    rejected: rejected.length,
    bySource,
    bySourceType,
    byRejectReason,
    acceptedDateHistogram: toHist(acceptedDates),
    rejectedDateHistogram,
    suspiciousMassDates,
    massIdenticalStamps,
    sourceCoverage: {
      acceptedShare: Number(acceptedShare.toFixed(4)),
      editorialCatalogueShare: Number(editorialCatalogueShare.toFixed(4)),
      vendorEnrichmentShare: Number(vendorEnrichmentShare.toFixed(4)),
      confidence,
    },
    traces,
    examples: {
      accepted: accepted.slice(0, 12),
      rejected: rejected.slice(0, 12),
    },
  };
}
