import { describe, expect, it } from "vitest";
import {
  buildCrmPricingResearchReport,
  chartFilename,
  crmPricingChartSvg,
  crmPricingReportToCsv,
  crmPricingReportToPublicJson,
  CRM_PRICING_REPORT,
  listCrmPricingChartSpecs,
} from "@/services/research-reports";
import { datasetJsonLd } from "@/seo/structured-data";
import { isPathIndexable } from "@/services/internal-linking/eligibility";

describe("CRM pricing research report", () => {
  it("calculates metrics from stored catalogue data without inventing sample sizes", () => {
    const report = buildCrmPricingResearchReport();

    expect(report.path).toBe(CRM_PRICING_REPORT.path);
    expect(report.dataset).toBe(CRM_PRICING_REPORT.datasetId);
    expect(report.methodologyVersion).toBe("2.0.0");
    expect(report.sample.primaryCrmProducts).toBeGreaterThan(0);
    expect(report.sample.usdProductsWithPlans).toBeGreaterThan(0);
    expect(report.sample.usdWithStartingPrice).toBeLessThanOrEqual(
      report.sample.usdProductsWithPlans,
    );
    expect(report.sample.eurProductsWithPlans).toBeGreaterThanOrEqual(0);
    expect(report.rows.length).toBe(report.sample.usdProductsWithPlans);
    expect(report.sample.usdPlanCount).toBe(
      report.rows.reduce((sum, r) => sum + r.planCount, 0),
    );

    if (report.metrics.medianStartingPriceMonthlyUsd != null) {
      expect(report.sample.usdWithStartingPrice).toBeGreaterThanOrEqual(5);
    }
    if (report.metrics.meanStartingPriceMonthlyUsd != null) {
      expect(report.sample.usdWithStartingPrice).toBeGreaterThanOrEqual(5);
    }
    if (report.metrics.freePlanSharePct != null) {
      expect(report.metrics.freePlanSharePct).toBeGreaterThanOrEqual(0);
      expect(report.metrics.freePlanSharePct).toBeLessThanOrEqual(100);
    }
    if (report.metrics.medianAnnualDiscountPct != null) {
      expect(report.sample.productsWithAnnualDiscountPair).toBeGreaterThanOrEqual(
        5,
      );
    }
    expect(report.metrics.freePlanWithZeroStartingCount).toBeLessThanOrEqual(
      report.sample.productsWithFreePlan,
    );
    expect(report.sample.productsWithContactSalesPlan).toBe(
      report.rows.filter((r) => r.hasContactSalesPlan).length,
    );

    expect(report.calculationLogic.length).toBeGreaterThan(3);
    expect(report.limitations.length).toBeGreaterThan(2);
    expect(report.observationDate).toMatch(/^\d{4}-\d{2}-\d{2}/);
    expect(report.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}/);
    expect(report.statistics.length).toBeGreaterThan(5);
    for (const statistic of report.statistics) {
      expect(statistic.dataset).toBe(report.dataset);
      expect(statistic.sampleSize).toBeGreaterThan(0);
      expect(statistic.calculation.length).toBeGreaterThan(10);
      expect(statistic.date).toMatch(/^\d{4}-\d{2}-\d{2}/);
      expect(statistic.limitations.length).toBeGreaterThan(0);
    }
    expect(report.executiveFindingIds.length).toBeGreaterThan(0);
    expect(report.ai.skuPricingSufficient).toBe(false);
    expect(report.citation.organization).toBe("SoftwareGlimpse");
    expect(report.citation.urlPath).toBe(CRM_PRICING_REPORT.path);
  });

  it("does not invent AI SKU prices or market inflation", () => {
    const report = buildCrmPricingResearchReport();
    expect(report.ai.skuPricingSufficient).toBe(false);
    expect(report.limitations.some((l) => /AI feature premiums/i.test(l))).toBe(
      true,
    );
    expect(
      report.limitations.some((l) => /inflation or deflation/i.test(l)),
    ).toBe(true);
    expect(report.limitations.some((l) => /affiliate commissions/i.test(l))).toBe(
      true,
    );
    expect(report.history.increases + report.history.decreases).toBeGreaterThanOrEqual(
      0,
    );
  });

  it("exports public CSV and JSON without private columns", () => {
    const report = buildCrmPricingResearchReport();
    const csv = crmPricingReportToCsv(report);
    expect(csv).toContain("product_slug");
    expect(csv).toContain("starting_price_monthly");
    expect(csv).toContain("has_contact_sales_plan");
    expect(csv.toLowerCase()).not.toContain("internal_notes");
    expect(csv.split("\n").length).toBeGreaterThan(report.rows.length);

    const json = crmPricingReportToPublicJson(report);
    const parsed = JSON.parse(json) as {
      dataset: string;
      rows: Array<Record<string, unknown>>;
    };
    expect(parsed.dataset).toBe(report.dataset);
    expect(parsed.rows.length).toBe(report.rows.length);
    expect(parsed.rows.some((row) => "affiliate" in row)).toBe(false);
  });

  it("builds shareable SVG charts from the same report counts", () => {
    const report = buildCrmPricingResearchReport();
    const specs = listCrmPricingChartSpecs(report);
    expect(specs.length).toBe(4);
    for (const spec of specs) {
      const svg = crmPricingChartSvg(report, spec.id);
      expect(svg).toBeTruthy();
      expect(svg).toContain("<svg");
      expect(svg).toContain(`n=${spec.sampleSize}`);
      expect(svg).toContain(report.dataset);
      expect(svg?.toLowerCase()).not.toContain("commission");
      expect(svg?.toLowerCase()).not.toContain("affiliate");
      expect(chartFilename(report, spec.id)).toMatch(/\.svg$/);
    }
    const dist = crmPricingChartSvg(report, "starting-distribution");
    const freeBucket = report.startingPriceDistribution.find((b) => b.id === "free");
    if (freeBucket) {
      expect(dist).toContain(String(freeBucket.count));
    }
  });

  it("exposes dataset schema and indexable research paths", () => {
    const ld = datasetJsonLd({
      name: CRM_PRICING_REPORT.title,
      description: "Test dataset",
      path: CRM_PRICING_REPORT.path,
      dateModified: "2026-09-06",
      distributionUrl: "/research/crm-pricing/download/",
    });
    expect(ld["@type"]).toBe("Dataset");
    expect(ld.aggregateRating).toBeUndefined();
    expect(isPathIndexable("/research/")).toBe(true);
    expect(isPathIndexable("/research/crm-pricing/")).toBe(true);
  });
});
