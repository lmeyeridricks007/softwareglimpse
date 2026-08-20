import { describe, expect, it } from "vitest";
import type { CrmFinderCriteria, CrmProductFit } from "@/domain";
import {
  crmFinderConfig,
  type CrmFinderConfig,
} from "@/data/config/recommendation/crm-finder-v1";
import {
  buildProductSnapshot,
  evaluateEligibility,
  isFinderEligible,
  normalizeCrmFinderAnswers,
  recommendCrm,
  selectCrmCandidates,
  type ProductRecommendationSnapshot,
} from "@/services/recommendation";
import type { Software } from "@/domain";

function baseFit(overrides: Partial<CrmProductFit> = {}): CrmProductFit {
  return {
    productSlug: overrides.productSlug ?? "demo",
    businessSizeFits: {
      solo: "unknown",
      micro: "good",
      "small-business": "strong",
      "mid-market": "good",
      enterprise: "unknown",
      ...overrides.businessSizeFits,
    },
    useCaseFits: {
      "pipeline-management": "strong",
      "lead-management": "good",
      "contact-management": "moderate",
      "sales-automation": "weak",
      ...overrides.useCaseFits,
    },
    priorityFits: {
      "ease-of-use": "moderate",
      "fast-setup": "moderate",
      customization: "good",
      "minimal-admin": "moderate",
      ...overrides.priorityFits,
    },
    businessTypeFits: overrides.businessTypeFits ?? {},
  };
}

function snapshot(
  partial: Partial<ProductRecommendationSnapshot> &
    Pick<ProductRecommendationSnapshot, "slug" | "name">,
): ProductRecommendationSnapshot {
  return {
    primaryCategorySlug: "crm",
    secondaryCategorySlugs: [],
    subcategorySlugs: ["sales-crm"],
    useCaseSlugs: ["pipeline-management", "lead-management"],
    businessSizeSlugs: ["micro", "small-business"],
    businessTypeSlugs: [],
    featureSupport: [],
    integrationSupport: [],
    researchCompleteness: 0.5,
    hasFixtureResearch: false,
    fit: baseFit({ productSlug: partial.slug }),
    ...partial,
  };
}

function criteria(
  overrides: Partial<CrmFinderCriteria> = {},
): CrmFinderCriteria {
  return {
    categorySlug: "crm",
    companySizeSlug: "small-business",
    crmUsers: 5,
    primaryUseCaseSlug: "pipeline-management",
    secondaryUseCaseSlugs: [],
    requiredFeatureSlugs: [],
    preferredFeatureSlugs: [],
    preferredIntegrationSlugs: [],
    budgetPerUserMax: null,
    budgetMode: "per-user-month",
    priorities: {
      "ease-of-use": 0.5,
      "fast-setup": 0.5,
      customization: 0.5,
      "minimal-admin": 0.5,
    },
    methodologyVersion: crmFinderConfig.version,
    ...overrides,
  };
}

describe("selectCrmCandidates", () => {
  it("only includes primaryCategorySlug === crm", () => {
    const pool = [
      snapshot({ slug: "pipedrive", name: "Pipedrive" }),
      snapshot({
        slug: "apollo",
        name: "Apollo",
        primaryCategorySlug: "sales-intelligence",
        secondaryCategorySlugs: ["crm"],
      }),
    ];
    const selected = selectCrmCandidates(pool);
    expect(selected.map((s) => s.slug)).toEqual(["pipedrive"]);
  });
});

describe("eligibility", () => {
  it("unknown required feature does not exclude", () => {
    const product = snapshot({
      slug: "folk",
      name: "folk",
      featureSupport: [],
    });
    const result = evaluateEligibility(
      product,
      criteria({ requiredFeatureSlugs: ["email-sequences"] }),
      crmFinderConfig,
    );
    expect(result.eligible).toBe(true);
  });

  it("not-supported required feature excludes", () => {
    const product = snapshot({
      slug: "folk",
      name: "folk",
      featureSupport: [
        { slug: "forecasting", availability: "not-supported" },
      ],
    });
    const result = evaluateEligibility(
      product,
      criteria({ requiredFeatureSlugs: ["forecasting"] }),
      crmFinderConfig,
    );
    expect(result.eligible).toBe(false);
    expect(result.exclusions[0]?.code).toBe("required-feature-not-supported");
  });

  it("isFinderEligible requires crm + use cases or features", () => {
    expect(
      isFinderEligible(
        snapshot({
          slug: "a",
          name: "A",
          useCaseSlugs: ["pipeline-management"],
          featureSupport: [],
        }),
      ),
    ).toBe(true);
    expect(
      isFinderEligible(
        snapshot({
          slug: "b",
          name: "B",
          useCaseSlugs: [],
          featureSupport: [{ slug: "reporting", availability: "supported" }],
        }),
      ),
    ).toBe(true);
    expect(
      isFinderEligible(
        snapshot({
          slug: "c",
          name: "C",
          useCaseSlugs: [],
          featureSupport: [],
        }),
      ),
    ).toBe(false);
    expect(
      isFinderEligible(
        snapshot({
          slug: "apollo",
          name: "Apollo",
          primaryCategorySlug: "sales-intelligence",
          useCaseSlugs: ["prospecting"],
        }),
      ),
    ).toBe(false);
  });
});

describe("recommendCrm", () => {
  it("produces deterministic ranking", () => {
    const pool = [
      snapshot({
        slug: "alpha",
        name: "Alpha",
        fit: baseFit({
          productSlug: "alpha",
          useCaseFits: { "pipeline-management": "strong" },
        }),
      }),
      snapshot({
        slug: "beta",
        name: "Beta",
        fit: baseFit({
          productSlug: "beta",
          useCaseFits: { "pipeline-management": "weak" },
        }),
      }),
    ];
    const a = recommendCrm(criteria(), pool, crmFinderConfig);
    const b = recommendCrm(criteria(), pool, crmFinderConfig);
    expect(a.results.map((r) => r.productSlug)).toEqual(
      b.results.map((r) => r.productSlug),
    );
    expect(a.results.map((r) => r.matchScore)).toEqual(
      b.results.map((r) => r.matchScore),
    );
    expect(a.results[0]?.productSlug).toBe("alpha");
  });

  it("primary use case materially influences ranking", () => {
    const pool = [
      snapshot({
        slug: "pipeline-king",
        name: "Pipeline King",
        useCaseSlugs: ["pipeline-management"],
        fit: baseFit({
          productSlug: "pipeline-king",
          useCaseFits: {
            "pipeline-management": "strong",
            "contact-management": "weak",
          },
        }),
      }),
      snapshot({
        slug: "contact-king",
        name: "Contact King",
        useCaseSlugs: ["contact-management"],
        fit: baseFit({
          productSlug: "contact-king",
          useCaseFits: {
            "pipeline-management": "weak",
            "contact-management": "strong",
          },
          priorityFits: {
            "ease-of-use": "strong",
            "fast-setup": "strong",
            customization: "weak",
            "minimal-admin": "strong",
          },
        }),
      }),
    ];

    const pipelineFirst = recommendCrm(
      criteria({ primaryUseCaseSlug: "pipeline-management" }),
      pool,
      crmFinderConfig,
    );
    const contactFirst = recommendCrm(
      criteria({ primaryUseCaseSlug: "contact-management" }),
      pool,
      crmFinderConfig,
    );

    expect(pipelineFirst.results[0]?.productSlug).toBe("pipeline-king");
    expect(contactFirst.results[0]?.productSlug).toBe("contact-king");
  });

  it("affiliate is absent from snapshot scoring (identical except affiliate rank same)", () => {
    const softA = {
      id: "1",
      slug: "twin-a",
      name: "Twin A",
      aliases: [],
      formerlyKnownAs: [],
      entityType: "software" as const,
      productLifecycle: "active" as const,
      primaryCategorySlug: "crm",
      secondaryCategorySlugs: [],
      subcategorySlugs: ["sales-crm"],
      useCaseSlugs: ["pipeline-management"],
      businessSizeSlugs: ["small-business"],
      businessTypeSlugs: [],
      teamTypeSlugs: [],
      industrySlugs: [],
      userPrioritySlugs: [],
      featureRatings: [],
      integrationSlugs: [],
      platforms: [],
      deploymentModels: [],
      aiCapabilities: [],
      competitorSlugs: [],
      alternativeSlugs: [],
      comparableSlugs: [],
      pros: [],
      cons: [],
      bestFor: [],
      notIdealFor: [],
      sources: [],
      affiliate: {
        enabled: false,
        network: "none" as const,
        disclosureRequired: true,
      },
      metadata: { status: "published" as const, researchStatus: "none" as const },
      seo: { indexable: false },
    } satisfies Software;

    const softB: Software = {
      ...softA,
      id: "2",
      slug: "twin-b",
      name: "Twin B",
      affiliate: {
        enabled: true,
        network: "other",
        disclosureRequired: true,
        trackingUrl: "https://example.com/aff",
        commissionNotes: "high payout",
      },
    };

    const snapA = buildProductSnapshot({ software: softA });
    const snapB = buildProductSnapshot({ software: softB });

    expect(snapA).not.toHaveProperty("affiliate");
    expect(snapB).not.toHaveProperty("affiliate");

    // Force identical fit/taxonomy for fair score compare
    const fit = baseFit({
      useCaseFits: { "pipeline-management": "strong" },
      businessSizeFits: { "small-business": "strong" },
    });
    const pool = [
      { ...snapA, fit: { ...fit, productSlug: "twin-a" } },
      { ...snapB, fit: { ...fit, productSlug: "twin-b" } },
    ];

    const ranked = recommendCrm(criteria(), pool, crmFinderConfig);
    expect(ranked.results).toHaveLength(2);
    expect(ranked.results[0]?.matchScore).toBe(ranked.results[1]?.matchScore);
  });

  it("unknown price is not treated as over budget", () => {
    const product = snapshot({
      slug: "no-price",
      name: "No Price",
      pricing: undefined,
    });
    const ranked = recommendCrm(
      criteria({ budgetPerUserMax: 15 }),
      [product],
      crmFinderConfig,
    );
    expect(ranked.results[0]?.budgetFit).toBe("unknown");
    expect(ranked.results[0]?.budgetFit).not.toBe("over");
    expect(
      ranked.results[0]?.tradeoffs.some((t) => t.code === "budget-over"),
    ).toBe(false);
  });

  it("applies tie threshold labels", () => {
    const pool = [
      snapshot({
        slug: "aaa",
        name: "AAA",
        fit: baseFit({
          productSlug: "aaa",
          useCaseFits: { "pipeline-management": "strong" },
        }),
      }),
      snapshot({
        slug: "bbb",
        name: "BBB",
        fit: baseFit({
          productSlug: "bbb",
          useCaseFits: { "pipeline-management": "strong" },
        }),
      }),
    ];
    const ranked = recommendCrm(criteria(), pool, crmFinderConfig);
    expect(Math.abs(ranked.results[0]!.matchScore - ranked.results[1]!.matchScore)).toBeLessThanOrEqual(
      crmFinderConfig.tieThresholdPoints,
    );
    expect(ranked.results[0]?.labels).toContain("Close match");
    expect(ranked.results[1]?.labels).toContain("Close match");
  });

  it("JSON / input order does not change ranking", () => {
    const a = snapshot({
      slug: "zebra",
      name: "Zebra",
      fit: baseFit({
        productSlug: "zebra",
        useCaseFits: { "pipeline-management": "moderate" },
      }),
    });
    const b = snapshot({
      slug: "yak",
      name: "Yak",
      fit: baseFit({
        productSlug: "yak",
        useCaseFits: { "pipeline-management": "strong" },
      }),
    });
    const c = snapshot({
      slug: "xenon",
      name: "Xenon",
      fit: baseFit({
        productSlug: "xenon",
        useCaseFits: { "pipeline-management": "good" },
      }),
    });

    const forward = recommendCrm(criteria(), [a, b, c], crmFinderConfig);
    const reverse = recommendCrm(criteria(), [c, b, a], crmFinderConfig);
    const shuffled = recommendCrm(criteria(), [b, c, a], crmFinderConfig);

    expect(forward.results.map((r) => r.productSlug)).toEqual([
      "yak",
      "xenon",
      "zebra",
    ]);
    expect(reverse.results.map((r) => r.productSlug)).toEqual(
      forward.results.map((r) => r.productSlug),
    );
    expect(shuffled.results.map((r) => r.productSlug)).toEqual(
      forward.results.map((r) => r.productSlug),
    );
  });

  it("explanation codes match evidence", () => {
    const product = snapshot({
      slug: "pipedrive",
      name: "Pipedrive",
      featureSupport: [
        { slug: "pipeline-management", availability: "supported" },
        { slug: "forecasting", availability: "limited" },
      ],
      fit: baseFit({
        productSlug: "pipedrive",
        useCaseFits: { "pipeline-management": "strong" },
        businessSizeFits: { "small-business": "strong" },
      }),
      pricing: { startingPriceMonthly: 14, currency: "USD", model: "subscription" },
    });

    const ranked = recommendCrm(
      criteria({
        requiredFeatureSlugs: ["pipeline-management", "forecasting"],
        budgetPerUserMax: 30,
      }),
      [product],
      crmFinderConfig,
    );

    const codes = ranked.results[0]!.reasons.map((r) => r.code);
    expect(codes).toContain("strong-primary-use-case");
    expect(codes).toContain("required-feature-supported");
    expect(codes).toContain("required-feature-limited");
    expect(codes).toContain("business-size-strong");
    expect(codes).toContain("budget-good");
    expect(
      ranked.results[0]!.tradeoffs.some((t) => t.code === "required-feature-limited"),
    ).toBe(true);
  });

  it("weight changes alter scores", () => {
    const product = snapshot({
      slug: "weighted",
      name: "Weighted",
      fit: baseFit({
        productSlug: "weighted",
        useCaseFits: { "pipeline-management": "strong" },
        businessSizeFits: { "small-business": "weak" },
        priorityFits: {
          "ease-of-use": "weak",
          "fast-setup": "weak",
          customization: "weak",
          "minimal-admin": "weak",
        },
      }),
    });

    const heavyUseCase: CrmFinderConfig = {
      ...crmFinderConfig,
      weights: {
        ...crmFinderConfig.weights,
        useCaseFit: 0.9,
        businessSizeFit: 0.02,
        priorities: 0.02,
        budgetFit: 0.02,
        requiredFeatures: 0.01,
        preferredFeatures: 0.01,
        integrations: 0.01,
        businessTypeFit: 0.01,
      },
    };

    const heavySize: CrmFinderConfig = {
      ...crmFinderConfig,
      weights: {
        ...crmFinderConfig.weights,
        useCaseFit: 0.02,
        businessSizeFit: 0.9,
        priorities: 0.02,
        budgetFit: 0.02,
        requiredFeatures: 0.01,
        preferredFeatures: 0.01,
        integrations: 0.01,
        businessTypeFit: 0.01,
      },
    };

    const useCaseHeavy = recommendCrm(criteria(), [product], heavyUseCase);
    const sizeHeavy = recommendCrm(criteria(), [product], heavySize);

    expect(useCaseHeavy.results[0]!.matchScore).toBeGreaterThan(
      sizeHeavy.results[0]!.matchScore,
    );
  });

  it("excludes SI products even when present in pool", () => {
    const pool = [
      snapshot({ slug: "pipedrive", name: "Pipedrive" }),
      snapshot({
        slug: "apollo",
        name: "Apollo",
        primaryCategorySlug: "sales-intelligence",
        secondaryCategorySlugs: ["crm"],
        useCaseSlugs: ["lead-management"],
      }),
    ];
    const ranked = recommendCrm(criteria(), pool, crmFinderConfig);
    expect(ranked.results.every((r) => r.productSlug !== "apollo")).toBe(true);
  });
});

describe("normalizeCrmFinderAnswers", () => {
  it("maps budget bands and ease preference", () => {
    const criteriaResult = normalizeCrmFinderAnswers({
      companySizeSlug: "micro",
      crmUsers: 4,
      primaryUseCaseSlug: "contact-management",
      budgetBand: "15-30",
      budgetMode: "per-user-month",
      easePreference: "easy-setup",
    });
    expect(criteriaResult.budgetPerUserMax).toBe(30);
    expect(criteriaResult.priorities["ease-of-use"]).toBe(1);
    expect(criteriaResult.priorities.customization).toBe(0.2);
    expect(criteriaResult.methodologyVersion).toBe("crm-finder-v1");
    expect(criteriaResult.categorySlug).toBe("crm");
  });

  it("maps no-limit and 100-plus to null max", () => {
    expect(
      normalizeCrmFinderAnswers({
        companySizeSlug: "solo",
        crmUsers: 1,
        primaryUseCaseSlug: "contact-management",
        budgetBand: "no-limit",
        budgetMode: "per-user-month",
      }).budgetPerUserMax,
    ).toBeNull();
    expect(
      normalizeCrmFinderAnswers({
        companySizeSlug: "solo",
        crmUsers: 1,
        primaryUseCaseSlug: "contact-management",
        budgetBand: "100-plus",
        budgetMode: "per-user-month",
      }).budgetPerUserMax,
    ).toBeNull();
  });
});
