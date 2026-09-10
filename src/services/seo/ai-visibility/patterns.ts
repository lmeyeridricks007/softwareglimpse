import type {
  AiVisibilityObservation,
  CitedPageAggregate,
  ContentPatternObservation,
} from "./types";

/**
 * Content-pattern co-occurrence for frequently cited pages.
 * Correlation ≠ causation — documented on every row.
 */
export function observeContentPatterns(
  aggregates: CitedPageAggregate[],
): ContentPatternObservation[] {
  const caveat =
    "Co-occurrence with citation frequency only — not proof that the pattern caused AI citations.";

  return aggregates.slice(0, 25).map((page) => {
    const patterns: string[] = [];
    const p = page.path;

    if (p.includes("/research/")) patterns.push("research");
    if (p.includes("/pricing/") || p.includes("pricing")) patterns.push("pricing");
    if (p.includes("/compare/") || page.pageType === "comparison") {
      patterns.push("comparisons");
    }
    if (p.includes("/best/")) patterns.push("direct_answers");
    if (p.includes("/tools/")) patterns.push("interactive_tools");
    if (p.includes("/guides/")) patterns.push("guides_direct_answers");
    if (page.pageType === "product-review") patterns.push("product_pages");

    // Heuristic flags from URL/structure — not HTML inspection
    if (p.includes("crm-pricing") || p.includes("benchmark")) {
      patterns.push("unique_data");
      patterns.push("tables");
    }
    if (p.includes("methodology") || p.includes("how-we-review")) {
      patterns.push("citations_methodology");
    }
    if (p.includes("history") || p.includes("2026")) {
      patterns.push("freshness_signal_in_url");
    }
    if (patterns.length === 0) patterns.push("unclassified_path");

    // structured_data / tables assumed only when research/benchmark URLs
    if (patterns.includes("unique_data")) {
      patterns.push("structured_data_likely");
    }

    return {
      path: page.path,
      citationCount: page.citationCount,
      patterns: [...new Set(patterns)],
      caveat,
    };
  });
}

export function aggregateCitedPages(
  observations: AiVisibilityObservation[],
): CitedPageAggregate[] {
  const map = new Map<string, CitedPageAggregate>();
  for (const obs of observations) {
    if (!obs.softwareGlimpseCited || !obs.citedPath) continue;
    const existing = map.get(obs.citedPath);
    if (!existing) {
      map.set(obs.citedPath, {
        path: obs.citedPath,
        citationCount: 1,
        platforms: [obs.platform],
        pageType: obs.pageType,
        category: obs.category,
        sampleQueries: [obs.query],
      });
    } else {
      existing.citationCount += 1;
      if (!existing.platforms.includes(obs.platform)) {
        existing.platforms.push(obs.platform);
      }
      if (existing.sampleQueries.length < 5) {
        existing.sampleQueries.push(obs.query);
      }
    }
  }
  return [...map.values()].sort((a, b) => b.citationCount - a.citationCount);
}
