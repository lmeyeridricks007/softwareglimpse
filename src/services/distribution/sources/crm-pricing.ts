import type { DistributionCampaign, SupportingDatum } from "@/domain";
import {
  buildCrmPricingResearchReport,
  CRM_PRICING_REPORT,
} from "@/services/research-reports";
import { utmCampaignSlug } from "../utm";

function money(n: number | null): string {
  if (n == null) return "—";
  return `$${n % 1 === 0 ? n.toFixed(0) : n.toFixed(2)}`;
}

/**
 * Campaign from CRM Pricing Benchmarks research — catalogue-derived metrics only.
 */
export function campaignFromCrmPricingResearch(
  now = new Date(),
): DistributionCampaign | null {
  const report = buildCrmPricingResearchReport();
  if (report.sample.usdProductsWithPlans < 5) return null;

  const supportingData: SupportingDatum[] = [];
  supportingData.push({
    label: "USD CRM products with plans",
    value: String(report.sample.usdProductsWithPlans),
    sampleSize: report.sample.usdProductsWithPlans,
  });
  if (report.metrics.medianStartingPriceMonthlyUsd != null) {
    supportingData.push({
      label: "Median starting price (USD/mo)",
      value: money(report.metrics.medianStartingPriceMonthlyUsd),
      sampleSize: report.sample.usdWithStartingPrice,
      unit: "USD/mo",
    });
  }
  if (report.metrics.meanStartingPriceMonthlyUsd != null) {
    supportingData.push({
      label: "Mean starting price (USD/mo)",
      value: money(report.metrics.meanStartingPriceMonthlyUsd),
      sampleSize: report.sample.usdWithStartingPrice,
      unit: "USD/mo",
    });
  }
  if (report.metrics.freePlanSharePct != null) {
    supportingData.push({
      label: "Share offering a free plan",
      value: `${report.metrics.freePlanSharePct}%`,
      sampleSize: report.sample.usdProductsWithPlans,
    });
  }
  supportingData.push({
    label: "Free-plan products with $0 starting price",
    value: String(report.metrics.freePlanWithZeroStartingCount),
    sampleSize: report.sample.productsWithFreePlan,
  });
  if (report.metrics.medianAnnualDiscountPct != null) {
    supportingData.push({
      label: "Median annual billing discount",
      value: `${report.metrics.medianAnnualDiscountPct}%`,
      sampleSize: report.sample.productsWithAnnualDiscountPair,
    });
  }
  if (report.metrics.contactSalesPlanSharePct != null) {
    supportingData.push({
      label: "Share with a contact-sales plan",
      value: `${report.metrics.contactSalesPlanSharePct}%`,
      sampleSize: report.sample.usdProductsWithPlans,
    });
  }
  for (const bucket of report.startingPriceDistribution.slice(0, 5)) {
    if (bucket.count === 0) continue;
    supportingData.push({
      label: `Starting price ${bucket.label}`,
      value: String(bucket.count),
      sampleSize: report.sample.usdWithStartingPrice,
      note: "distribution count",
    });
  }

  const median = report.metrics.medianStartingPriceMonthlyUsd;
  const mean = report.metrics.meanStartingPriceMonthlyUsd;
  const free = report.metrics.freePlanSharePct;
  const keyFinding =
    median != null && mean != null && free != null
      ? `Across ${report.sample.usdProductsWithPlans} USD CRM products with researched list pricing, median starting price is ${money(median)}/mo while the mean is ${money(mean)}/mo; ${free}% offer a free plan but only ${report.metrics.freePlanWithZeroStartingCount} have a stored $0 starting price (n starting=${report.sample.usdWithStartingPrice}).`
      : `Catalogue-derived CRM pricing benchmarks cover ${report.sample.usdProductsWithPlans} USD products with plans (observation ${report.observationDate}).`;

  const iso = now.toISOString();
  return {
    id: `dist-crm-pricing-${report.observationDate}`,
    sourceAsset: CRM_PRICING_REPORT.title,
    keyFinding,
    supportingData,
    sourceURL: CRM_PRICING_REPORT.path,
    publicationDate: report.lastUpdated,
    campaignType: "research_insight",
    title: `${CRM_PRICING_REPORT.shortTitle} — distribution pack`,
    limitations: report.limitations.slice(0, 4),
    utmCampaign: utmCampaignSlug([
      "crm-pricing",
      String(CRM_PRICING_REPORT.year),
      report.observationDate,
    ]),
    generatedAt: iso,
  };
}
