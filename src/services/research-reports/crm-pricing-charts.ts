import type { CrmPricingResearchReport } from "./crm-pricing-report";

export const CRM_PRICING_CHART_IDS = [
  "starting-distribution",
  "free-vs-paid",
  "annual-discount",
  "pricing-transparency",
] as const;

export type CrmPricingChartId = (typeof CRM_PRICING_CHART_IDS)[number];

export function isCrmPricingChartId(value: string): value is CrmPricingChartId {
  return (CRM_PRICING_CHART_IDS as readonly string[]).includes(value);
}

type ChartSpec = {
  id: CrmPricingChartId;
  title: string;
  filename: string;
  bars: Array<{ label: string; value: number }>;
  sampleSize: number;
  valueSuffix?: string;
};

export function listCrmPricingChartSpecs(
  report: CrmPricingResearchReport,
): ChartSpec[] {
  return [
    {
      id: "starting-distribution",
      title: "CRM starting list-price distribution (USD / month)",
      filename: "softwareglimpse-crm-starting-price-distribution-2026.svg",
      bars: report.startingPriceDistribution.map((b) => ({
        label: b.label,
        value: b.count,
      })),
      sampleSize: report.sample.usdWithStartingPrice,
    },
    {
      id: "free-vs-paid",
      title: "Free plan availability among USD CRMs with plans",
      filename: "softwareglimpse-crm-free-plan-availability-2026.svg",
      bars: [
        {
          label: "Has free plan",
          value: report.sample.productsWithFreePlan,
        },
        {
          label: "No free plan",
          value:
            report.sample.usdProductsWithPlans - report.sample.productsWithFreePlan,
        },
      ],
      sampleSize: report.sample.usdProductsWithPlans,
    },
    {
      id: "annual-discount",
      title: "Annual billing discount distribution",
      filename: "softwareglimpse-crm-annual-discount-distribution-2026.svg",
      bars: report.annualDiscountDistribution.map((b) => ({
        label: b.label,
        value: b.count,
      })),
      sampleSize: report.sample.productsWithAnnualDiscountPair,
    },
    {
      id: "pricing-transparency",
      title: "CRM list-price transparency (USD products)",
      filename: "softwareglimpse-crm-pricing-transparency-2026.svg",
      bars: [
        {
          label: "Public priced plan",
          value: report.sample.productsWithPublicPricedPlan,
        },
        {
          label: "Contact-sales plan",
          value: report.sample.productsWithContactSalesPlan,
        },
        {
          label: "No starting price",
          value:
            report.sample.usdProductsWithPlans - report.sample.usdWithStartingPrice,
        },
      ],
      sampleSize: report.sample.usdProductsWithPlans,
    },
  ];
}

export function chartFilename(
  report: CrmPricingResearchReport,
  chartId: CrmPricingChartId,
): string {
  return (
    listCrmPricingChartSpecs(report).find((c) => c.id === chartId)?.filename ??
    `softwareglimpse-crm-${chartId}.svg`
  );
}

export function crmPricingChartSvg(
  report: CrmPricingResearchReport,
  chartId: CrmPricingChartId,
): string | null {
  const spec = listCrmPricingChartSpecs(report).find((c) => c.id === chartId);
  if (!spec) return null;
  return renderBarChartSvg({
    title: spec.title,
    bars: spec.bars,
    sampleSize: spec.sampleSize,
    observationDate: report.lastUpdated,
    dataset: report.dataset,
  });
}

function renderBarChartSvg(input: {
  title: string;
  bars: Array<{ label: string; value: number }>;
  sampleSize: number;
  observationDate: string;
  dataset: string;
}): string {
  const width = 960;
  const rowH = 52;
  const headerH = 88;
  const footerH = 56;
  const height = headerH + input.bars.length * rowH + footerH;
  const max = Math.max(...input.bars.map((b) => b.value), 1);
  const barX = 220;
  const barMaxW = 620;

  const rows = input.bars
    .map((bar, i) => {
      const y = headerH + i * rowH;
      const w = Math.max(8, Math.round((bar.value / max) * barMaxW));
      return `
      <text x="32" y="${y + 28}" font-size="16" fill="#1b2430" font-family="Georgia, 'Times New Roman', serif">${escapeXml(bar.label)}</text>
      <rect x="${barX}" y="${y + 12}" width="${w}" height="24" rx="4" fill="#0f6b5c"/>
      <text x="${barX + w + 12}" y="${y + 30}" font-size="16" fill="#1b2430" font-family="ui-sans-serif, system-ui, sans-serif">${bar.value}</text>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img">
  <title>${escapeXml(input.title)}</title>
  <rect width="100%" height="100%" fill="#ffffff"/>
  <text x="32" y="40" font-size="22" font-weight="700" fill="#1b2430" font-family="Georgia, 'Times New Roman', serif">${escapeXml(input.title)}</text>
  ${rows}
  <text x="32" y="${height - 24}" font-size="12" fill="#5c6570" font-family="ui-sans-serif, system-ui, sans-serif">SoftwareGlimpse · ${escapeXml(input.dataset)} · n=${input.sampleSize} · ${escapeXml(input.observationDate)}. List prices, not negotiated quotes.</text>
</svg>
`;
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
