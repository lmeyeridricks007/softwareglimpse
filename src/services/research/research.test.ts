import { describe, expect, it } from "vitest";
import {
  AiCapabilityKindSchema,
  FeatureAvailabilitySchema,
  IntegrationKindSchema,
  ResearchFactSchema,
  ResearchSourceSchema,
  getSourcePriority,
} from "@/domain";
import { detectConflicts, preferBySourcePriority } from "@/services/research/conflicts";
import { FixtureFactExtractor } from "@/services/research/extractors/fixture-extractor";
import { isResearchDomainStale } from "@/services/research/freshness";
import {
  canOverwriteFact,
  mergeApprovedFacts,
} from "@/services/research/merge";
import { normalizeFact } from "@/services/research/normalize";
import { hashContent } from "@/services/research/utils";
import { getSoftwareBySlug } from "@/data";
import { loadEnrichment } from "@/data/research/store";
import { validateResearchRepository } from "@/data/validation/validate-research";

const now = "2026-08-13T12:00:00.000Z";

describe("research sources", () => {
  it("accepts valid sources and rejects invalid URLs", () => {
    const ok = ResearchSourceSchema.safeParse({
      id: "src-1",
      productSlug: "pipedrive",
      url: "https://www.pipedrive.com/en/pricing",
      sourceType: "official-pricing-page",
      authority: "first-party",
      domains: ["pricing"],
    });
    expect(ok.success).toBe(true);

    const bad = ResearchSourceSchema.safeParse({
      id: "src-2",
      url: "not-a-url",
      sourceType: "fixture",
    });
    expect(bad.success).toBe(false);
  });

  it("ranks official pricing above fixtures", () => {
    expect(getSourcePriority("official-pricing-page")).toBeLessThan(
      getSourcePriority("fixture"),
    );
  });
});

describe("extraction + evidence", () => {
  it("extracts candidate facts with evidence from fixture text", async () => {
    const extractor = new FixtureFactExtractor();
    const facts = await extractor.extract(
      {
        id: "snap-1",
        sourceId: "pipedrive-pricing-fixture",
        productSlug: "pipedrive",
        retrievedAt: now,
        contentHash: hashContent("x"),
        extractedText: `
CURRENCY: USD
PRICING_MODEL: subscription
FREE_TRIAL: true
PLAN essential: name=Essential; amountPerSeat=14; currency=USD; interval=month; billingInterval=annual; unit=seat
`,
        domains: ["pricing", "plans"],
        isFixture: true,
        metadata: {},
      },
      { productSlug: "pipedrive", domains: ["pricing", "plans", "free-trial"] },
    );

    expect(facts.length).toBeGreaterThan(0);
    expect(facts.every((f) => f.sourceIds.length > 0)).toBe(true);
    expect(facts.every((f) => f.evidence.length > 0)).toBe(true);
    expect(facts.some((f) => f.field.startsWith("pricing.plans."))).toBe(true);
  });
});

describe("normalization", () => {
  it("normalizes seat pricing with currency and billing interval", () => {
    const fact = ResearchFactSchema.parse({
      id: "f1",
      productSlug: "pipedrive",
      domain: "plans",
      field: "pricing.plans.essential",
      value: {
        slug: "essential",
        name: "Essential",
        amountPerSeat: 14,
        currency: "usd",
        interval: "month",
        billingInterval: "annual",
      },
      sourceIds: ["pipedrive-pricing-fixture"],
      extractedAt: now,
      isFixture: true,
    });

    const normalized = normalizeFact(fact);
    expect(normalized.status).toBe("normalized");
    const value = normalized.value as {
      rules: Array<{
        kind: string;
        amountPerSeat?: number;
        currency: string;
        interval: string;
        amountPeriod: string;
      }>;
    };
    expect(value.rules[0]?.kind).toBe("per-seat");
    expect(value.rules[0]?.amountPerSeat).toBe(14);
    expect(value.rules[0]?.currency).toBe("USD");
    // Billing cadence is annual…
    expect(value.rules[0]?.interval).toBe("year");
    // …but the listed $14 is a monthly-equivalent amount.
    expect(value.rules[0]?.amountPeriod).toBe("month");
  });
});

describe("merge + overwrite rules", () => {
  it("blocks unapproved facts from merging", () => {
    const software = getSoftwareBySlug("pipedrive", { includeUnpublished: true })!;
    const fact = ResearchFactSchema.parse({
      id: "candidate",
      productSlug: "pipedrive",
      domain: "identity",
      field: "identity.shortDescription",
      value: "Should not apply",
      sourceIds: ["pipedrive-product-fixture"],
      extractedAt: now,
      status: "normalized",
      isFixture: true,
    });

    const result = mergeApprovedFacts({
      software,
      facts: [fact],
      options: { requireApproved: true, allowFixtureMerge: true },
    });
    expect(result.appliedFactIds).toHaveLength(0);
    expect(result.skipped[0]?.reason).toBe("not-approved");
  });

  it("merges approved facts and retains provenance source ids", () => {
    const software = getSoftwareBySlug("pipedrive", { includeUnpublished: true })!;
    const fact = ResearchFactSchema.parse({
      id: "approved-desc",
      productSlug: "pipedrive",
      domain: "identity",
      field: "identity.shortDescription",
      value: "Pipeline CRM for growing sales teams.",
      sourceIds: ["pipedrive-product-fixture"],
      extractedAt: now,
      status: "approved",
      approvedAt: now,
      isFixture: true,
    });

    const result = mergeApprovedFacts({
      software,
      facts: [fact],
      options: { requireApproved: true, allowFixtureMerge: true },
    });
    expect(result.appliedFactIds).toContain("approved-desc");
    expect(result.enrichment.shortDescription).toContain("Pipeline CRM");
    expect(result.enrichment.sourceIds).toContain("pipedrive-product-fixture");
  });

  it("does not let lower-confidence candidate overwrite verified fact", () => {
    const verified = ResearchFactSchema.parse({
      id: "v1",
      productSlug: "pipedrive",
      domain: "pricing",
      field: "pricing.currency",
      value: "USD",
      sourceIds: ["official"],
      extractedAt: now,
      status: "verified",
      confidence: "high",
      isFixture: false,
    });
    const candidate = ResearchFactSchema.parse({
      id: "c1",
      productSlug: "pipedrive",
      domain: "pricing",
      field: "pricing.currency",
      value: "EUR",
      sourceIds: ["other"],
      extractedAt: now,
      status: "normalized",
      confidence: "low",
      isFixture: true,
    });
    expect(canOverwriteFact(verified, candidate)).toBe(false);
  });
});

describe("conflicts", () => {
  it("detects conflicting facts and prefers higher-priority sources", () => {
    const a = ResearchFactSchema.parse({
      id: "a",
      productSlug: "pipedrive",
      domain: "pricing",
      field: "pricing.currency",
      value: "USD",
      sourceIds: ["official"],
      extractedAt: now,
      status: "normalized",
      isFixture: false,
    });
    const b = ResearchFactSchema.parse({
      id: "b",
      productSlug: "pipedrive",
      domain: "pricing",
      field: "pricing.currency",
      value: "EUR",
      sourceIds: ["fixture"],
      extractedAt: now,
      status: "normalized",
      isFixture: true,
    });
    const sources = [
      ResearchSourceSchema.parse({
        id: "official",
        sourceType: "official-pricing-page",
        authority: "first-party",
      }),
      ResearchSourceSchema.parse({
        id: "fixture",
        sourceType: "fixture",
        authority: "fixture",
      }),
    ];
    const conflicts = detectConflicts([a, b], sources);
    expect(conflicts).toHaveLength(1);
    expect(preferBySourcePriority([a, b], sources)?.id).toBe("a");
  });
});

describe("freshness", () => {
  it("marks old pricing as stale and recent pricing as current", () => {
    expect(
      isResearchDomainStale({
        domain: "pricing",
        checkedAt: "2026-01-01T00:00:00.000Z",
        now: new Date("2026-08-13T00:00:00.000Z"),
      }),
    ).toBe(true);
    expect(
      isResearchDomainStale({
        domain: "pricing",
        checkedAt: "2026-08-01T00:00:00.000Z",
        now: new Date("2026-08-13T00:00:00.000Z"),
      }),
    ).toBe(false);
  });
});

describe("research validation + sales intelligence support", () => {
  it("passes research validation for fixture POCs", () => {
    const report = validateResearchRepository();
    const errors = report.issues.filter((i) => i.severity === "error");
    expect(errors).toEqual([]);
  });

  it("coerces vendor availability and integration-kind aliases", () => {
    expect(FeatureAvailabilitySchema.parse("unsupported")).toBe("not-supported");
    expect(IntegrationKindSchema.parse("limited")).toBe("unknown");
    expect(IntegrationKindSchema.parse("zapier")).toBe("zapier-style");
    expect(IntegrationKindSchema.parse("api")).toBe("api-only");
    expect(AiCapabilityKindSchema.parse("copilot")).toBe("assistant");
    expect(AiCapabilityKindSchema.parse("ITSM AI copilot")).toBe("assistant");
    expect(AiCapabilityKindSchema.parse("Developer AI copilot")).toBe(
      "assistant",
    );
    expect(AiCapabilityKindSchema.parse("Freddy AI")).toBe("other");
  });

  it("loads enrichment that previously failed enum validation", () => {
    for (const slug of [
      "basecamp",
      "switcher-studio",
      "uniqode",
      "whatconverts",
    ]) {
      expect(loadEnrichment(slug)).not.toBeNull();
    }
  });

  it("supports Apollo credit-style plan normalization", () => {
    const fact = ResearchFactSchema.parse({
      id: "apollo-plan",
      productSlug: "apollo",
      domain: "plans",
      field: "pricing.plans.basic",
      value: {
        slug: "basic",
        name: "Basic",
        amount: 49,
        currency: "USD",
        unit: "credit",
        interval: "month",
        billingInterval: "month",
      },
      sourceIds: ["apollo-pricing-fixture"],
      extractedAt: now,
      isFixture: true,
    });
    const normalized = normalizeFact(fact);
    const value = normalized.value as {
      rules: Array<{ kind: string; unit?: string }>;
    };
    expect(value.rules[0]?.kind).toBe("per-unit");
    expect(value.rules[0]?.unit).toBe("credit");
  });
});
