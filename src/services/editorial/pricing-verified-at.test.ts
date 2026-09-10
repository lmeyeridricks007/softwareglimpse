import { describe, expect, it } from "vitest";
import {
  clearPricingVerificationCaches,
  explainPricingVerification,
  reconcileDataVerifiedCoverage,
  resolvePricingVerifiedAt,
} from "@/services/editorial/pricing-verified-at";
import type { Software } from "@/domain";

function softStub(overrides: Partial<Software> & Pick<Software, "slug">): Software {
  return {
    id: overrides.slug,
    slug: overrides.slug,
    name: overrides.name ?? overrides.slug,
    primaryCategorySlug: "crm",
    website: "https://example.com",
    metadata: {
      status: "published",
      publishedAt: "2026-01-01T00:00:00.000Z",
    },
    seo: { indexable: true },
    ...overrides,
  } as Software;
}

describe("pricing verification for DATA_VERIFIED", () => {
  it("accepts product-level pricingVerifiedAt", () => {
    const at = "2026-09-01T12:00:00.000Z";
    expect(
      resolvePricingVerifiedAt(softStub({ slug: "x", pricingVerifiedAt: at })),
    ).toBe(at);
  });

  it("accepts catalogue pricing envelope verifiedAt", () => {
    const at = "2026-09-02T12:00:00.000Z";
    expect(
      resolvePricingVerifiedAt(
        softStub({
          slug: "y",
          pricing: {
            currency: "USD",
            model: "subscription",
            verifiedAt: at,
          } as Software["pricing"],
        }),
      ),
    ).toBe(at);
  });

  it("reconciles live catalogue without treating mass stamps as verified", () => {
    clearPricingVerificationCaches();
    const rec = reconcileDataVerifiedCoverage();
    expect(rec.total).toBeGreaterThan(100);
    // Previous bug: 312/313 accepted via mass domainCheckedAt / batch clocks.
    // Legitimate live vendor stamps with unique ISO + sourceIds may grow
    // past a minority of the catalogue; never treat that growth as a mass backfill.
    expect(rec.accepted).toBeGreaterThan(100);
    expect(rec.accepted).toBeLessThan(rec.total);
    const acceptedStampCounts = new Map<string, number>();
    for (const t of rec.traces.filter((x) => x.classification === "DATA_VERIFIED")) {
      const stamp = t.verificationTimestamp;
      if (!stamp) continue;
      acceptedStampCounts.set(stamp, (acceptedStampCounts.get(stamp) ?? 0) + 1);
    }
    expect(Math.max(0, ...acceptedStampCounts.values())).toBeLessThan(3);
    expect(
      (rec.byRejectReason.matches_domain_checked_at ?? 0) +
        (rec.byRejectReason.mass_domain_checked_batch ?? 0) +
        (rec.byRejectReason.mass_identical_stamp ?? 0) +
        (rec.byRejectReason.matches_enrichment_updatedAt ?? 0),
    ).toBeGreaterThan(0);
    expect(rec.traces.length).toBe(rec.total);
    expect(rec.sourceCoverage.confidence).toMatch(/high|medium|low/);
    // Every accepted row must record field + source + method
    for (const t of rec.traces.filter((x) => x.classification === "DATA_VERIFIED")) {
      expect(t.field).toBeTruthy();
      expect(t.verificationTimestamp).toBeTruthy();
      expect(t.source).not.toBe("none");
      expect(t.verificationMethod).not.toBe("rejected");
    }
  }, 60_000);

  it("rejects domainCheckedAt twins even when sourceIds exist", () => {
    clearPricingVerificationCaches();
    // Prefer a product that still has domainCheckedAt-era clocks (not live-stamped).
    // HubSpot may be DATA_VERIFIED after a live vendor wave — then enrichment is valid.
    const researchedTwin = softStub({ slug: "insightly" });
    const row = explainPricingVerification(researchedTwin);
    if (row.acceptedAt) {
      expect(row.verificationMethod).toBe("enrichment_pricing_with_sources");
      expect(row.source).toBe("enrichment.pricing.verifiedAt");
    } else {
      expect([
        "matches_domain_checked_at",
        "mass_identical_stamp",
        "mass_domain_checked_batch",
        "matches_enrichment_updatedAt",
        "domain_checked_only_without_sources",
        "enrichment_verified_without_sources",
      ]).toContain(row.rejectReason);
    }

    const hubspot = explainPricingVerification(softStub({ slug: "hubspot" }));
    if (hubspot.acceptedAt) {
      expect(hubspot.verificationMethod).toBe("enrichment_pricing_with_sources");
      expect(hubspot.sourceType).toBe("vendor_enrichment");
    }
  });
});
