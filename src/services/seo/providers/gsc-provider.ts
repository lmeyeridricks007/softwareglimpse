/**
 * Future Google Search Console provider.
 *
 * Approved connector for Site Intelligence / SEO sync.
 * - Requires GSC_PROPERTY_URL + (GSC_CLIENT_EMAIL | GOOGLE_APPLICATION_CREDENTIALS)
 * - Does NOT scrape Search Console HTML
 * - Does NOT invent credentials or fabricate rows
 * - Live googleapis client is intentionally not bundled yet — configure env,
 *   then implement API calls here, or use ImportSearchPerformanceProvider
 *   with an approved export.
 */
import { buildSnapshotId } from "@/data/seo/store";
import type {
  SearchPerformanceProvider,
  SearchPerformanceRequest,
  SearchPerformanceResult,
} from "./search-performance-provider";

export function gscConfigured(): boolean {
  return Boolean(
    process.env.GSC_PROPERTY_URL &&
      (process.env.GSC_CLIENT_EMAIL ||
        process.env.GOOGLE_APPLICATION_CREDENTIALS),
  );
}

export class GoogleSearchConsoleProvider implements SearchPerformanceProvider {
  constructor(
    private readonly opts: { allowEmpty?: boolean } = {},
  ) {}

  async queryPerformance(
    request: SearchPerformanceRequest,
  ): Promise<SearchPerformanceResult> {
    if (!gscConfigured()) {
      if (this.opts.allowEmpty) {
        const rangeLabel = request.rangeLabel ?? "gsc-empty";
        const dataThroughDate = request.range.endDate;
        return {
          rows: [],
          meta: {
            id: buildSnapshotId("gsc", rangeLabel, dataThroughDate),
            retrievedAt: new Date().toISOString(),
            dataThroughDate,
            source: "gsc",
            rangeLabel,
          },
        };
      }
      throw new Error(
        "Google Search Console is not configured. Set GSC_PROPERTY_URL and GSC_CLIENT_EMAIL (or GOOGLE_APPLICATION_CREDENTIALS), or use FixtureSearchPerformanceProvider / ImportSearchPerformanceProvider.",
      );
    }

    // Credentials present — interface is ready; live Search Console API client
    // is not implemented in-repo yet (avoids shipping unverified googleapis wiring).
    throw new Error(
      [
        "Google Search Console credentials are present but the live GSC API client is not implemented yet.",
        "Do not scrape Search Console.",
        "Options:",
        "  1. Export GSC performance (query×page) JSON and: npm run site:search-performance -- --import <file>",
        "  2. npm run seo:sync -- --fixture (synthetic labeling)",
        "  3. Implement googleapis searchconsole.query in this provider when approved.",
      ].join("\n"),
    );
  }
}
