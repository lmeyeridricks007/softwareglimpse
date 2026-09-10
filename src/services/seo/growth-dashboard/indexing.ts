import path from "node:path";
import { getSitemapEntries } from "@/seo/sitemap";
import { firstExisting, notConnected, num, pct, readJsonIfExists } from "./io";
import { classifyDataValidity } from "./validity";
import type { IndexingSection } from "./types";

type CoverageExport = {
  label?: string;
  latestTotals?: {
    indexed?: number;
    notIndexed?: number;
    impressions?: number;
  };
  criticalIssues?: Array<{ reason: string; pages: number }>;
  notes?: string[];
};

function issuePages(
  issues: CoverageExport["criticalIssues"],
  matcher: (reason: string) => boolean,
): number | null {
  if (!issues?.length) return null;
  const hit = issues.find((i) => matcher(i.reason.toLowerCase()));
  return hit ? hit.pages : null;
}

/**
 * Indexing section — sitemap URL count is the submitted/indexable denominator.
 * Never compute indexation % from guides+compare-only proxy counts.
 */
export function buildIndexingSection(cwd = process.cwd()): IndexingSection {
  const coveragePath = firstExisting(
    path.join(cwd, "docs/migration/data/gsc-coverage.json"),
    path.join(cwd, "data/seo/gsc-coverage.json"),
  );
  const coverage = coveragePath
    ? readJsonIfExists<CoverageExport>(coveragePath)
    : null;

  let sitemapCount: number | null = null;
  try {
    sitemapCount = getSitemapEntries().length;
  } catch {
    sitemapCount = null;
  }

  const indexed = coverage?.latestTotals?.indexed ?? null;
  const discovered = issuePages(coverage?.criticalIssues, (r) =>
    r.includes("discovered") && r.includes("not indexed"),
  );
  const crawled = issuePages(coverage?.criticalIssues, (r) =>
    r.includes("crawled") && r.includes("not indexed"),
  );

  const notes: string[] = [
    ...(coverage?.notes ?? []),
    "Sitemap URL count is the submitted/indexable denominator for this dashboard.",
    "GSC Coverage “indexed” totals are property-wide aggregates — not automatically comparable 1:1 to sitemap rows (Coverage may include URLs outside the sitemap or exclude some submitted URLs).",
  ];

  if (!coverage && sitemapCount == null) {
    return {
      status: "not_connected",
      validity: "NOT_CONNECTED",
      sourceLabel: null,
      sitemapUrlCount: notConnected(),
      indexedUrls: notConnected(),
      discoveredNotIndexed: notConnected(),
      crawledNotIndexed: notConnected(),
      indexationRatio: notConnected(
        "Need sitemap count and a comparable GSC indexed total",
      ),
      indexableUrls: notConnected(),
      notes: ["No sitemap entries and no GSC Coverage export."],
    };
  }

  // Do not present a false ratio. Label clearly instead.
  const ratioComparable = false;
  const indexationRatio = ratioComparable
    && indexed != null
    && sitemapCount != null
    && sitemapCount > 0
    ? pct((indexed / sitemapCount) * 100, "Indexed ÷ sitemap (only when declared comparable)")
    : notConnected(
        indexed != null && sitemapCount != null
          ? `Not comparable as a ratio — GSC indexed ${indexed.toLocaleString()} vs sitemap ${sitemapCount.toLocaleString()} (different scopes)`
          : "Need both sitemap count and GSC indexed total — and an explicit comparable-scope declaration",
      );

  const validity = classifyDataValidity({
    connected: Boolean(coverage || sitemapCount != null),
    sourcePath: coveragePath,
    dataThroughDate: null,
  });

  return {
    status: coverage ? "connected" : "partial",
    validity,
    sourceLabel: coverage?.label ?? "Sitemap only (Coverage export missing)",
    sitemapUrlCount:
      sitemapCount != null
        ? num(sitemapCount, "Actual public sitemap URL count")
        : notConnected(),
    indexedUrls:
      indexed != null
        ? num(indexed, "GSC Coverage latestTotals.indexed — property aggregate")
        : notConnected(),
    discoveredNotIndexed:
      discovered != null ? num(discovered) : notConnected(),
    crawledNotIndexed: crawled != null ? num(crawled) : notConnected(),
    indexationRatio,
    indexableUrls:
      sitemapCount != null
        ? num(sitemapCount, "Alias of sitemap URL count (submitted/indexable denominator)")
        : notConnected(),
    notes,
  };
}
