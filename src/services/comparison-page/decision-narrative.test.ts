import { describe, expect, it } from "vitest";
import {
  buildDecisionNarrative,
  buildIntegrationCompare,
  buildSeatScenarios,
} from "./decision-narrative";
import type { ComparisonPageModel } from "./types";

function baseModel(
  overrides: Partial<ComparisonPageModel> = {},
): Omit<ComparisonPageModel, "decision"> {
  const product = (slug: string, name: string) => ({
    slug,
    name,
    href: `/software/${slug}/`,
    bestFor: [] as string[],
    notIdealFor: [] as string[],
    pros: [] as string[],
    cons: [] as string[],
    score: null,
    scoreApproved: false,
    screenshots: [],
    visitLabel: `Visit ${name}`,
  });

  return {
    slug: "alpha-vs-beta",
    title: "Alpha vs Beta",
    subtitle: "Compare Alpha and Beta on SoftwareGlimpse.",
    provisional: false,
    researched: true,
    methodologyHref: "/methodology/",
    howWeReviewHref: "/how-we-review/",
    evidenceSourceCount: 0,
    screenshotCount: 0,
    featureCount: 0,
    productA: product("alpha", "Alpha"),
    productB: product("beta", "Beta"),
    overallLabel: "No universal winner",
    winsA: [],
    winsB: [],
    ties: [],
    depends: [],
    criteria: [],
    decisionCards: [],
    keyDifferences: [],
    featureGroups: [],
    pricing: {
      showEstimator: false,
      defaultSeats: 15,
      cardA: { plans: [] },
      cardB: { plans: [] },
    },
    relatedComparisons: [],
    alternatives: [],
    guides: [],
    faq: [],
    sources: [],
    availableTabs: ["overview", "faq"],
    finderHref: "/tools/finder/",
    finderLabel: "Finder",
    costCalculatorHref: "/tools/cost/",
    ...overrides,
  };
}

describe("buildDecisionNarrative", () => {
  it("omits empty sections for sparse pairs", () => {
    const narrative = buildDecisionNarrative({
      nameA: "Alpha",
      nameB: "Beta",
      model: baseModel(),
    });
    expect(narrative.limitedData).toBe(true);
    expect(narrative.categoryWinners).toHaveLength(0);
    expect(narrative.seatScenarios).toBeNull();
    expect(narrative.integrations).toBeNull();
    expect(narrative.h1).toBe("Alpha vs Beta");
    expect(narrative.seoTitle.length).toBeGreaterThan(5);
    expect(narrative.relatedPaths.length).toBeGreaterThan(0);
  });

  it("builds pair-specific verdict and winners from criterion data", () => {
    const narrative = buildDecisionNarrative({
      nameA: "HubSpot",
      nameB: "Pipedrive",
      existingSeoTitle: "HubSpot vs Pipedrive: Which Is Better?",
      existingSeoDescription:
        "Compare HubSpot and Pipedrive on pricing, ease of use, and marketing depth.",
      model: baseModel({
        productA: {
          ...baseModel().productA,
          slug: "hubspot",
          name: "HubSpot",
          bestFor: ["Marketing-led growth teams"],
          startingPriceLabel: "$20/user/mo",
        },
        productB: {
          ...baseModel().productB,
          slug: "pipedrive",
          name: "Pipedrive",
          bestFor: ["Sales-first SMB teams"],
          startingPriceLabel: "$14/user/mo",
        },
        winsA: [
          {
            slug: "marketing",
            name: "Marketing",
            strengthA: "stronger",
            strengthB: "weaker",
            scoreA: null,
            scoreB: null,
            label: "HubSpot leads on marketing depth",
            supportingFactIds: [],
            evidenceSummary: "Broader marketing automation coverage",
          },
        ],
        winsB: [
          {
            slug: "ease-of-use",
            name: "Ease of use",
            strengthA: "weaker",
            strengthB: "stronger",
            scoreA: null,
            scoreB: null,
            label: "Pipedrive leads on ease of use",
            supportingFactIds: [],
            evidenceSummary: "Faster sales pipeline setup",
          },
        ],
        criteria: [
          {
            slug: "marketing",
            name: "Marketing",
            strengthA: "stronger",
            strengthB: "weaker",
            scoreA: null,
            scoreB: null,
            label: "HubSpot leads on marketing depth",
            supportingFactIds: [],
            evidenceSummary: "Broader marketing automation coverage",
            winnerKind: "product-a",
            winnerName: "HubSpot",
          },
          {
            slug: "ease-of-use",
            name: "Ease of use",
            strengthA: "weaker",
            strengthB: "stronger",
            scoreA: null,
            scoreB: null,
            label: "Pipedrive leads on ease of use",
            supportingFactIds: [],
            evidenceSummary: "Faster sales pipeline setup",
            winnerKind: "product-b",
            winnerName: "Pipedrive",
          },
        ],
        keyDifferences: [
          {
            id: "marketing",
            title: "Marketing",
            leftLabel: "HubSpot",
            rightLabel: "Pipedrive",
            leftBody: "Broader marketing automation coverage",
            rightBody: "Trails HubSpot on this criterion",
            winnerName: "HubSpot",
          },
        ],
        pricing: {
          showEstimator: true,
          defaultSeats: 15,
          cardA: { plans: [], starting: "$20/user/mo" },
          cardB: { plans: [], starting: "$14/user/mo" },
          unitA: { perUserMonthly: 20, currency: "USD" },
          unitB: { perUserMonthly: 14, currency: "USD" },
        },
      }),
    });

    expect(narrative.limitedData).toBe(false);
    expect(narrative.summary).toMatch(/HubSpot/i);
    expect(narrative.summary).toMatch(/Pipedrive/i);
    expect(narrative.quickVerdict?.chooseA[0]).toMatch(/Marketing-led/i);
    expect(narrative.quickVerdict?.keyTradeoff).toMatch(/marketing/i);
    expect(narrative.categoryWinners).toHaveLength(2);
    expect(narrative.categoryWinners[0]?.winnerName).toBe("HubSpot");
    expect(narrative.realDifferences[0]?.analysis).toMatch(/HubSpot is ahead/i);
    expect(narrative.whoShouldNot?.dontChooseA.length).toBeGreaterThan(0);
    expect(narrative.implementation?.pointsB[0]).toMatch(/ease of use/i);
    expect(narrative.seatScenarios).toHaveLength(4);
    expect(narrative.seatScenarios?.[0]?.labelA).toMatch(/~/);
    expect(narrative.finalVerdict?.winsWhenA).toBeTruthy();
    // Pair-specific — not identical boilerplate for both sides
    expect(narrative.quickVerdict?.chooseA.join()).not.toBe(
      narrative.quickVerdict?.chooseB.join(),
    );
  });
});

describe("buildSeatScenarios", () => {
  it("returns null without unit pricing", () => {
    expect(buildSeatScenarios({})).toBeNull();
  });
});

describe("buildIntegrationCompare", () => {
  it("computes shared and exclusive integrations", () => {
    const result = buildIntegrationCompare({
      nameA: "A",
      nameB: "B",
      slugsA: ["slack", "gmail"],
      slugsB: ["slack", "outlook"],
    });
    expect(result?.shared.map((i) => i.slug)).toEqual(["slack"]);
    expect(result?.exclusiveA.map((i) => i.slug)).toEqual(["gmail"]);
    expect(result?.exclusiveB.map((i) => i.slug)).toEqual(["outlook"]);
  });

  it("returns null when no integration evidence exists", () => {
    expect(
      buildIntegrationCompare({
        nameA: "A",
        nameB: "B",
        slugsA: [],
        slugsB: [],
      }),
    ).toBeNull();
  });
});
