import { NextResponse } from "next/server";
import {
  buildCrmPricingResearchReport,
  crmPricingReportToCsv,
  crmPricingReportToPublicJson,
} from "@/services/research-reports";

/**
 * Public aggregated CRM pricing research download.
 * Contains catalogue list-price fields only — no affiliate or internal notes.
 */
export async function GET(request: Request) {
  const report = buildCrmPricingResearchReport();
  const format = new URL(request.url).searchParams.get("format");

  if (format === "json") {
    return new NextResponse(crmPricingReportToPublicJson(report), {
      status: 200,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "content-disposition":
          'attachment; filename="softwareglimpse-crm-pricing-research-2026.json"',
        "cache-control": "public, max-age=3600",
      },
    });
  }

  const csv = crmPricingReportToCsv(report);
  return new NextResponse(csv, {
    status: 200,
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition":
        'attachment; filename="softwareglimpse-crm-pricing-research-2026.csv"',
      "cache-control": "public, max-age=3600",
    },
  });
}
