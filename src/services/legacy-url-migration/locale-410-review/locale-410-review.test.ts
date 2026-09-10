import { describe, expect, it } from "vitest";
import { classifyLocale410Topic } from "./classify";
import { CURATED_TOPIC_ABSORBS } from "./absorbs";
import { applyLocale410Repairs } from "./apply";
import type { Locale410TopicRow } from "./types";

const inventory = new Set([
  "/company/my-story/",
  "/legal/terms/",
  "/software/pipedrive/",
  "/software/salesforce/",
  "/software/freshsales/",
  "/software/zoho-crm/",
  "/categories/crm/",
]);

function gsc(impressions = 0, clicks = 0) {
  return { clicks, impressions, available: true };
}

function bl() {
  return {
    referringDomains: null as number | null,
    available: false,
    validity: "NOT_CONNECTED" as const,
  };
}

describe("locale-410 topic classify", () => {
  it("repairs curated my-story absorb as DUPLICATE_TOPIC / ADD_301", () => {
    const row = classifyLocale410Topic({
      enPath: "/my-story/",
      localePaths: ["/fr/mon-histoire/", "/de/meine-geschichte/"],
      title: "My Story",
      category: "company",
      legacyPageType: "other_article",
      lastmod: null,
      intentKind: "other",
      mappingAction: "410",
      mappingBasis: "unmapped",
      mappingReason: "No safe equivalent",
      detectedDestination: null,
      inventoryHas: (p) => inventory.has(p),
      enGsc: gsc(14),
      localeGsc: gsc(1),
      enBacklinks: bl(),
      curatedAbsorbs: CURATED_TOPIC_ABSORBS,
    });
    expect(row.classification).toBe("DUPLICATE_TOPIC");
    expect(row.disposition).toBe("ADD_301");
    expect(row.proposedDestination).toBe("/company/my-story/");
  });

  it("keeps locale roots as TRUE_OBSOLETE 410 (no homepage dump)", () => {
    const row = classifyLocale410Topic({
      enPath: "/",
      localePaths: ["/fr/", "/de/"],
      title: "Home",
      category: "home",
      legacyPageType: "home",
      lastmod: null,
      intentKind: "home",
      mappingAction: "KEEP",
      mappingBasis: "explicit_historical",
      mappingReason: "Home",
      detectedDestination: "/",
      inventoryHas: () => true,
      enGsc: gsc(41),
      localeGsc: gsc(0),
      enBacklinks: bl(),
    });
    expect(row.classification).toBe("TRUE_OBSOLETE");
    expect(row.disposition).toBe("KEEP_410");
    expect(row.proposedDestination).toBeNull();
  });

  it("retires SEO strategy topics as TRUE_OBSOLETE", () => {
    const row = classifyLocale410Topic({
      enPath: "/ahrefs-vs-semrush/",
      localePaths: ["/es/ahrefs-vs-semrush/"],
      title: "Ahrefs vs Semrush",
      category: null,
      legacyPageType: "comparison",
      lastmod: null,
      intentKind: "comparison",
      mappingAction: "410",
      mappingBasis: "strategy_retire",
      mappingReason: "Out of strategy",
      detectedDestination: null,
      inventoryHas: (p) => inventory.has(p),
      enGsc: gsc(100),
      localeGsc: gsc(500),
      enBacklinks: bl(),
    });
    expect(row.classification).toBe("TRUE_OBSOLETE");
    expect(row.disposition).toBe("KEEP_410");
  });

  it("queues valuable off-catalogue reviews for gap review (no auto-create)", () => {
    const row = classifyLocale410Topic({
      enPath: "/unknown-field-saas-review/",
      localePaths: ["/fr/unknown-field-saas-review/"],
      title: "Unknown Field SaaS Review",
      category: "product_review",
      legacyPageType: "product_review",
      lastmod: null,
      intentKind: "product_review",
      mappingAction: "REVIEW",
      mappingBasis: "unmapped",
      mappingReason: "Product not in catalogue",
      detectedDestination: null,
      inventoryHas: (p) => inventory.has(p),
      enGsc: gsc(45),
      localeGsc: gsc(19),
      enBacklinks: bl(),
    });
    expect(row.classification).toBe("VALUABLE_TOPIC_CANDIDATE");
    expect(row.disposition).toBe("EXISTING_ESTATE_GAP_REVIEW");
    expect(row.proposedDestination).toBeNull();
  });

  it("absorbs MioCommerce review when catalogue page exists", () => {
    const withMio = new Set([...inventory, "/software/miocommerce/"]);
    const row = classifyLocale410Topic({
      enPath: "/miocommerce-review/",
      localePaths: ["/fr/miocommerce-review/"],
      title: "Miocommerce Review",
      category: "product_review",
      legacyPageType: "product_review",
      lastmod: null,
      intentKind: "product_review",
      mappingAction: "REVIEW",
      mappingBasis: "unmapped",
      mappingReason: "Product not in catalogue",
      detectedDestination: null,
      inventoryHas: (p) => withMio.has(p),
      enGsc: gsc(45),
      localeGsc: gsc(19),
      enBacklinks: bl(),
      curatedAbsorbs: CURATED_TOPIC_ABSORBS,
    });
    expect(row.classification).toBe("DUPLICATE_TOPIC");
    expect(row.disposition).toBe("ADD_301");
    expect(row.proposedDestination).toBe("/software/miocommerce/");
  });

  it("retires Content at Scale as TRUE_OBSOLETE (no page fabrication)", () => {
    const row = classifyLocale410Topic({
      enPath: "/content-at-scale-review/",
      localePaths: ["/fr/content-at-scale-review/"],
      title: "Content At Scale Review",
      category: "product_review",
      legacyPageType: "product_review",
      lastmod: null,
      intentKind: "product_review",
      mappingAction: "REVIEW",
      mappingBasis: "unmapped",
      mappingReason: "Product not in catalogue",
      detectedDestination: null,
      inventoryHas: (p) => inventory.has(p),
      enGsc: gsc(0),
      localeGsc: gsc(0),
      enBacklinks: bl(),
    });
    expect(row.classification).toBe("TRUE_OBSOLETE");
    expect(row.disposition).toBe("KEEP_410");
    expect(row.proposedDestination).toBeNull();
  });

  it("absorbs Tidio vs Live Chat and Tidio vs Crisp when compares exist", () => {
    const withCs = new Set([
      ...inventory,
      "/compare/livechat-vs-tidio/",
      "/compare/crisp-vs-tidio/",
    ]);
    const live = classifyLocale410Topic({
      enPath: "/tidio-vs-live-chat/",
      localePaths: ["/fr/tidio-vs-live-chat/"],
      title: "Tidio vs Live Chat",
      category: "comparison",
      legacyPageType: "comparison",
      lastmod: null,
      intentKind: "comparison",
      mappingAction: "REVIEW",
      mappingBasis: "unmapped",
      mappingReason: null,
      detectedDestination: null,
      inventoryHas: (p) => withCs.has(p),
      enGsc: gsc(20),
      localeGsc: gsc(51),
      enBacklinks: bl(),
      curatedAbsorbs: CURATED_TOPIC_ABSORBS,
    });
    expect(live.proposedDestination).toBe("/compare/livechat-vs-tidio/");
    expect(live.disposition).toBe("ADD_301");

    const crisp = classifyLocale410Topic({
      enPath: "/tidio-vs-crisp/",
      localePaths: ["/fr/tidio-vs-crisp/"],
      title: "Tidio vs Crisp",
      category: "comparison",
      legacyPageType: "comparison",
      lastmod: null,
      intentKind: "comparison",
      mappingAction: "REVIEW",
      mappingBasis: "unmapped",
      mappingReason: null,
      detectedDestination: null,
      inventoryHas: (p) => withCs.has(p),
      enGsc: gsc(6),
      localeGsc: gsc(13),
      enBacklinks: bl(),
      curatedAbsorbs: CURATED_TOPIC_ABSORBS,
    });
    expect(crisp.proposedDestination).toBe("/compare/crisp-vs-tidio/");
    expect(crisp.disposition).toBe("ADD_301");
  });

  it("marks thin missing topics ENGLISH_EQUIVALENT_MISSING", () => {
    const row = classifyLocale410Topic({
      enPath: "/obscure-legacy-post/",
      localePaths: ["/fr/obscure-legacy-post/"],
      title: "Obscure",
      category: null,
      legacyPageType: "other_article",
      lastmod: null,
      intentKind: "other",
      mappingAction: "410",
      mappingBasis: "unmapped",
      mappingReason: "No match",
      detectedDestination: null,
      inventoryHas: (p) => inventory.has(p),
      enGsc: gsc(0),
      localeGsc: gsc(0),
      enBacklinks: bl(),
    });
    expect(row.classification).toBe("ENGLISH_EQUIVALENT_MISSING");
    expect(row.disposition).toBe("KEEP_410");
  });
});

describe("applyLocale410Repairs dry-run safety", () => {
  it("rejects homepage destinations", () => {
    const bad: Locale410TopicRow = {
      enPath: "/x/",
      localePaths: ["/fr/x/"],
      localeCount: 1,
      title: null,
      category: null,
      legacyPageType: null,
      lastmod: null,
      intentKind: "other",
      mappingAction: null,
      mappingBasis: null,
      mappingReason: null,
      modernEstateMatch: "/",
      enGsc: gsc(),
      localeGsc: gsc(),
      enBacklinks: bl(),
      classification: "DUPLICATE_TOPIC",
      disposition: "ADD_301",
      proposedDestination: "/",
      absorbReason: "bad",
      notes: [],
    };
    const result = applyLocale410Repairs([bad], { dryRun: true });
    expect(result.skippedUnsafe).toBe(1);
    expect(result.localeRedirectsAdded).toBe(0);
  });
});
