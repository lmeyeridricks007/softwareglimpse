import { describe, expect, it } from "vitest";
import {
  getAllAlternativesUnfiltered,
  getAllBestPagesUnfiltered,
  getAllComparisonsUnfiltered,
  getAllSoftwareUnfiltered,
  getCategories,
  getSoftwareBySlug,
  getUseCases,
} from "@/data";
import {
  getMethodologyBySlug,
  loadAssessment,
  loadReview,
} from "@/data/editorial/store";
import {
  approvedCriterionScores,
  buildBestPageModel,
  enrichmentFeatureCell,
  enrichmentFeatureName,
  enrichmentPricingDetail,
  enrichmentPricingTeaser,
  enrichmentScreenshot,
  findBestPageLeaks,
  researchTransparencyForProducts,
} from "@/services/best-page";
import { listPublishedLearningGuides } from "@/services/content-clusters";
import { evaluateBestQuality, isEntityIndexable } from "@/domain/quality-gates";
import { COMPANY_ROUTES, LEGAL_ROUTES } from "@/services/site-foundation";
import { navBestSlugByCategory } from "@/data/seed/nav";

function buildBestModel(opts: {
  slug: string;
  categorySlug: string;
  shortName: string;
  methodologySlugs: string[];
  withEnrichment?: boolean;
}) {
  const page = getAllBestPagesUnfiltered().find((p) => p.slug === opts.slug);
  expect(page).toBeTruthy();
  const methodology = opts.methodologySlugs
    .map((slug) => getMethodologyBySlug(slug))
    .find(Boolean);
  const category = getCategories({ includeUnpublished: true }).find(
    (c) => c.slug === opts.categorySlug,
  );

  const withEnrichment = opts.withEnrichment ?? true;

  return buildBestPageModel({
    page: page!,
    category: category
      ? {
          name: category.name,
          path: category.path,
          shortName: opts.shortName,
        }
      : null,
    softwareBySlug: (slug) =>
      getSoftwareBySlug(slug) ??
      getAllSoftwareUnfiltered().find((s) => s.slug === slug),
    methodology: methodology
      ? { description: methodology.description, criteria: methodology.criteria }
      : null,
    approvedScore: (software) => {
      const assessment = loadAssessment(software.slug);
      const review = loadReview(software.slug);
      const score = review?.overallScore ?? assessment?.overallScore;
      const approved =
        assessment?.status === "approved" &&
        review?.editorialStatus === "approved" &&
        typeof score === "number";
      return { score: approved ? score : null, approved };
    },
    pricingTeaser: withEnrichment ? enrichmentPricingTeaser : () => null,
    pricingDetail: withEnrichment ? enrichmentPricingDetail : undefined,
    featureCell: withEnrichment ? enrichmentFeatureCell : undefined,
    featureName: withEnrichment ? enrichmentFeatureName : undefined,
    criterionScores: withEnrichment ? approvedCriterionScores : undefined,
    productScreenshot: withEnrichment ? enrichmentScreenshot : undefined,
    researchTransparency: withEnrichment
      ? researchTransparencyForProducts(page!.eligibleProductSlugs)
      : null,
    comparisons: getAllComparisonsUnfiltered().map((c) => ({
      slug: c.slug,
      title: c.title,
      summary: c.summary,
      productSlugs: c.productSlugs,
    })),
    alternatives: getAllAlternativesUnfiltered().map((a) => ({
      slug: a.slug,
      title: a.title,
      sourceSlug: a.sourceSlug,
    })),
    guides: listPublishedLearningGuides(opts.categorySlug).map((g) => ({
      path: g.path,
      title: g.title,
      featured: g.slug.includes("how-to-choose"),
    })),
    useCases: getUseCases().map((u) => ({
      slug: u.slug,
      name: u.name,
      shortDescription: u.shortDescription,
    })),
    methodologyHref: COMPANY_ROUTES.methodology,
    howWeReviewHref: COMPANY_ROUTES.howWeReview,
    affiliateDisclosureHref: LEGAL_ROUTES.affiliateDisclosure,
    editorialIndependenceHref: LEGAL_ROUTES.editorialIndependence,
    contactCorrectionHref: `${COMPANY_ROUTES.contact}?reason=correction`,
  });
}

function buildCrmModel(opts?: { withEnrichment?: boolean }) {
  return buildBestModel({
    slug: "crm-software",
    categorySlug: "crm",
    shortName: "CRM",
    methodologySlugs: ["crm-editorial", "crm-software-v1"],
    withEnrichment: opts?.withEnrichment,
  });
}

describe("best page model", () => {
  it("passes quality gate and is indexable after editorial approval", () => {
    const page = getAllBestPagesUnfiltered().find((p) => p.slug === "crm-software")!;
    expect(page.editorialStatus).toBe("approved");
    expect(page.seo.indexable).toBe(true);
    expect(page.metadata.researchStatus).toBe("complete");
    expect(evaluateBestQuality(page)).toEqual({ ok: true, failures: [] });
    expect(isEntityIndexable({ kind: "best", entity: page })).toBe(true);
  });

  it("treats approved cluster awards as the quality gate for HR software", () => {
    const page = getAllBestPagesUnfiltered().find((p) => p.slug === "hr-software")!;
    expect(page.recommendations).toEqual([]);
    expect(
      page.useCaseRecommendations.filter((r) => r.approved && r.rationale).length,
    ).toBeGreaterThanOrEqual(2);
    expect(evaluateBestQuality(page)).toEqual({ ok: true, failures: [] });
    expect(isEntityIndexable({ kind: "best", entity: page })).toBe(true);
  });

  it("keeps a passing Best page in chrome for every live category with products", () => {
    const expected: Record<string, string> = {
      "business-communications": "business-communications-software",
      marketing: "marketing-software",
      "project-management": "project-management-software",
      hr: "hr-software",
      "email-marketing": "email-marketing-software",
      "customer-service": "customer-service-software",
      ecommerce: "ecommerce-software",
      "accounting-finance": "accounting-finance-software",
      "social-media-marketing": "social-media-marketing-software",
      "webinar-virtual-events": "webinar-virtual-events-software",
      "lms-course-creation": "lms-course-creation-software",
      "website-digital-presence": "website-digital-presence-software",
      "analytics-bi": "analytics-bi-software",
      "field-service-operations": "field-service-operations-software",
      "reputation-reviews": "reputation-reviews-software",
    };
    for (const [categorySlug, bestSlug] of Object.entries(expected)) {
      expect(navBestSlugByCategory[categorySlug]).toBe(bestSlug);
      const page = getAllBestPagesUnfiltered().find((p) => p.slug === bestSlug);
      expect(page, bestSlug).toBeTruthy();
      expect(page!.categorySlug).toBe(categorySlug);
      expect(evaluateBestQuality(page!)).toEqual({ ok: true, failures: [] });
      expect(isEntityIndexable({ kind: "best", entity: page! })).toBe(true);
    }
  });

  it("lists every top-level category with a Best page in the Best Software nav", () => {
    const top = getCategories().filter((c) => !c.parentSlug);
    const pages = getAllBestPagesUnfiltered();
    for (const category of top) {
      const page = pages.find((p) => p.categorySlug === category.slug);
      if (!page) continue;
      expect(
        navBestSlugByCategory[category.slug],
        `${category.slug} missing from Best Software nav`,
      ).toBe(page.slug);
    }
  });

  it("does not invent a cross-cluster #1 ranking on HR software", () => {
    const model = buildBestModel({
      slug: "hr-software",
      categorySlug: "hr",
      shortName: "HR, Workforce & Training",
      methodologySlugs: ["hr-editorial", "hr-software-v1"],
    });
    expect(model.listMode).toBe("shortlist");
    expect(model.hero.compareLabel).toBe("View picks by job");
    expect(model.products.every((p) => p.rank == null)).toBe(true);
    expect(model.hero.shortlist.every((p) => p.rank == null)).toBe(true);

    const bamboo = model.products.find((p) => p.product.slug === "bamboohr");
    const rippling = model.products.find((p) => p.product.slug === "rippling");
    expect(bamboo?.badge).toMatch(/core HRIS/i);
    expect(rippling?.badge).toMatch(/people platform/i);
    expect(bamboo?.scoreApproved).toBe(true);
    expect(rippling?.scoreApproved).toBe(true);
    expect(bamboo?.score).toBeLessThan(rippling!.score!);
    expect(model.productDeepDives[0]?.product.slug).toBe("bamboohr");
    expect(model.productDeepDives[1]?.product.slug).toBe("rippling");
  });

  it("builds a ranked CRM buying-guide model without editorial leaks", () => {
    const model = buildCrmModel();
    expect(model.slug).toBe("crm-software");
    expect(model.listMode).toBe("ranked");
    expect(model.rankingsApproved).toBe(true);
    expect(model.hero.title).toBe("Best CRM Software");
    expect(model.hero.shortlist.length).toBeGreaterThanOrEqual(3);
    expect(model.hero.fitHighlights.length).toBeGreaterThanOrEqual(1);
    expect(model.quickAnswer).not.toBeNull();
    expect(model.comparison).not.toBeNull();
    expect(model.faq.length).toBeGreaterThanOrEqual(5);
    expect(model.buyingGuide?.steps.length).toBeGreaterThanOrEqual(5);
    expect(model.buyingFramework?.steps.length).toBe(5);
    expect(model.methodology).not.toBeNull();
    expect(model.methodology!.intro).not.toMatch(/v\d/);
    expect(model.topPicks.length).toBeGreaterThanOrEqual(3);
    expect(model.decision).not.toBeNull();
    expect(model.decisionExplore).toBeNull();
    expect(model.tradeOffs.length).toBeGreaterThan(0);
    expect(model.byNeed.length).toBeGreaterThan(0);

    // Public ranks for approved shortlist
    const ranked = model.products.filter((p) => p.rank != null);
    expect(ranked.length).toBeGreaterThanOrEqual(3);
    expect(ranked[0]?.product.slug).toBe("pipedrive");
    expect(ranked[0]?.badge).toMatch(/pipeline/i);

    const blob = JSON.stringify({
      hero: model.hero,
      quickAnswer: model.quickAnswer,
      products: model.products,
      faq: model.faq,
      verdict: model.verdict,
      methodology: model.methodology,
      buyingGuide: model.buyingGuide,
      useCases: model.useCases,
      landscape: model.landscape,
      topPicks: model.topPicks,
      decision: model.decision,
    });
    expect(findBestPageLeaks(blob)).toEqual([]);
    expect(blob).not.toMatch(/provisional/i);
    expect(blob).not.toMatch(/candidate/i);
    expect(blob).not.toMatch(/fixture/i);
    expect(blob).not.toMatch(/pending approval/i);
    expect(blob).not.toMatch(/newsletter coming soon/i);
    expect(blob).not.toMatch(/noindex until/i);
    expect(blob).not.toMatch(/editorial approval/i);
  });

  it("wires enrichment pricing, features, scores, and screenshots without inventing data", () => {
    const model = buildCrmModel({ withEnrichment: true });
    expect(model.pricing).not.toBeNull();
    expect(model.pricing!.rows.some((r) => r.startingPrice)).toBe(true);
    expect(model.featureMatrix).not.toBeNull();
    expect(model.featureMatrix!.rows.length).toBeGreaterThan(0);
    expect(model.researchTransparency?.productsEvaluated).toBeGreaterThanOrEqual(39);
    expect(model.researchTransparency!.featureSupportRows).toBeGreaterThan(0);
    expect(model.productDeepDives.length).toBeGreaterThanOrEqual(3);
    expect(
      model.productDeepDives.some((p) => p.criterionScores.length > 0),
    ).toBe(true);
    expect(model.productDeepDives.some((p) => p.screenshot)).toBe(true);
    expect(model.comparison!.columns).toContain("keyStrength");
    expect(model.comparison!.columns).toContain("compare");
  });

  it("keeps internal editorialNotes off the public model", () => {
    const page = getAllBestPagesUnfiltered().find((p) => p.slug === "crm-software")!;
    expect(page.editorialNotes).toMatch(/Editorially approved/i);
    const model = buildCrmModel();
    const blob = JSON.stringify(model);
    expect(blob).not.toContain(page.editorialNotes!);
  });
});
