import { describe, expect, it } from "vitest";
import { buildComparisonTrustMetadata } from "@/services/editorial/comparison-trust";
import type { Software } from "@/domain";

function stubSoftware(
  slug: string,
  overrides: Partial<Software> = {},
): Software {
  return {
    id: slug,
    slug,
    name: slug,
    status: "published",
    primaryCategorySlug: "crm",
    bestFor: [],
    cons: [],
    sources: [],
    metadata: {},
    ...overrides,
  } as Software;
}

describe("buildComparisonTrustMetadata", () => {
  it("claims pricing verified only when both products are verified", () => {
    const a = stubSoftware("a", {
      pricingVerifiedAt: "2026-07-01T00:00:00.000Z",
    });
    const b = stubSoftware("b");
    const trust = buildComparisonTrustMetadata({ productA: a, productB: b });
    expect(trust.pricingVerifiedAt).toBeUndefined();
    expect(trust.evidenceLevel).toBe("researched");
  });

  it("uses the earlier pricing stamp when both are verified", () => {
    const a = stubSoftware("a", {
      pricingVerifiedAt: "2026-07-01T00:00:00.000Z",
    });
    const b = stubSoftware("b", {
      pricingVerifiedAt: "2026-08-01T00:00:00.000Z",
    });
    const trust = buildComparisonTrustMetadata({ productA: a, productB: b });
    expect(trust.pricingVerifiedAt).toBe("2026-07-01T00:00:00.000Z");
    expect(trust.evidenceLevel).toBe("data_verified");
  });

  it("never claims hands-on unless both products qualify", () => {
    const a = stubSoftware("a");
    const b = stubSoftware("b");
    const trust = buildComparisonTrustMetadata({ productA: a, productB: b });
    expect(trust.handsOnTesting).toBe(false);
    expect(trust.testedAt).toBeUndefined();
  });
});
