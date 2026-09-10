import { describe, expect, it } from "vitest";
import {
  buildCrmPricingResearchReport,
  crmPricingReportToCsv,
  CRM_PRICING_REPORT,
} from "@/services/research-reports";
import { datasetJsonLd } from "@/seo/structured-data";
import { isPathIndexable } from "@/services/internal-linking/eligibility";

describe("CRM pricing research report", () => {
  it("calculates metrics from stored catalogue data without inventing sample sizes", () => {
    const report = buildCrmPricingResearchReport();

    expect(report.path).toBe(CRM_PRICING_REPORT.path);
    expect(report.dataset).toBe(CRM_PRICING_REPORT.datasetId);
    expect(report.sample.primaryCrmProducts).toBeGreaterThan(0);
    expect(report.sample.usdProductsWithPlans).toBeGreaterThan(0);
    expect(report.sample.usdWithStartingPrice).toBeLessThanOrEqual(
      report.sample.usdProductsWithPlans,
    );
    expect(report.rows.length).toBe(report.sample.usdProductsWithPlans);

    if (report.metrics.medianStartingPriceMonthlyUsd != null) {
      expect(report.sample.usdWithStartingPrice).toBeGreaterThan(0);
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

    expect(report.calculationLogic.length).toBeGreaterThan(3);
    expect(report.limitations.length).toBeGreaterThan(2);
    expect(report.observationDate).toMatch(/^\d{4}-\d{2}-\d{2}/);
  });

  it("exports public CSV without inventing columns of private data", () => {
    const report = buildCrmPricingResearchReport();
    const csv = crmPricingReportToCsv(report);
    expect(csv).toContain("product_slug");
    expect(csv).toContain("starting_price_monthly");
    expect(csv.toLowerCase()).not.toContain("affiliate");
    expect(csv.toLowerCase()).not.toContain("internal_notes");
    expect(csv.split("\n").length).toBeGreaterThan(report.rows.length);
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
