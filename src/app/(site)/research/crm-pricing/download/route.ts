import { NextResponse } from "next/server";
import {
  buildCrmPricingResearchReport,
  crmPricingReportToCsv,
} from "@/services/research-reports";

/**
 * Public aggregated CRM pricing research CSV.
 * Contains catalogue list-price fields only — no affiliate or internal notes.
 */
export async function GET() {
  const report = buildCrmPricingResearchReport();
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
