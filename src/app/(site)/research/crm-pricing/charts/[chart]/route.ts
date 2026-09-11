import { NextResponse } from "next/server";
import {
  buildCrmPricingResearchReport,
  chartFilename,
  crmPricingChartSvg,
  isCrmPricingChartId,
} from "@/services/research-reports";

type RouteParams = { params: Promise<{ chart: string }> };

/**
 * Shareable SVG charts generated from the live CRM pricing report.
 * Numbers match /research/crm-pricing/ — never invented.
 */
export async function GET(_request: Request, { params }: RouteParams) {
  const { chart } = await params;
  if (!isCrmPricingChartId(chart)) {
    return new NextResponse("Unknown chart", { status: 404 });
  }

  const report = buildCrmPricingResearchReport();
  const svg = crmPricingChartSvg(report, chart);
  if (!svg) {
    return new NextResponse("Chart unavailable", { status: 404 });
  }

  return new NextResponse(svg, {
    status: 200,
    headers: {
      "content-type": "image/svg+xml; charset=utf-8",
      "content-disposition": `attachment; filename="${chartFilename(report, chart)}"`,
      "cache-control": "public, max-age=3600",
    },
  });
}
