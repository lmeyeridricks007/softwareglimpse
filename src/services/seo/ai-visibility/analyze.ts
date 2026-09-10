import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { aggregateCitedPages, observeContentPatterns } from "./patterns";
import type {
  AiVisibilityObservation,
  AiVisibilityReport,
  CitedPageAggregate,
  LoadedAiVisibilityExport,
} from "./types";
import { AI_VISIBILITY_ENGINE_VERSION } from "./types";

function countBy(keys: Array<string | null | undefined>): Record<string, number> {
  const out: Record<string, number> = {};
  for (const key of keys) {
    const k = key?.trim() || "unknown";
    out[k] = (out[k] ?? 0) + 1;
  }
  return out;
}

function loadPreviousReport(cwd: string): AiVisibilityReport | null {
  const file = path.join(cwd, "data/seo/ai-visibility.json");
  if (!existsSync(file)) return null;
  try {
    return JSON.parse(readFileSync(file, "utf8")) as AiVisibilityReport;
  } catch {
    return null;
  }
}

function pathsFromAggregates(pages: CitedPageAggregate[]): Set<string> {
  return new Set(pages.map((p) => p.path));
}

/**
 * Analyze imported observations. New/lost require a prior report file —
 * never invent historical citations.
 */
export function analyzeAiVisibility(
  exportData: LoadedAiVisibilityExport | null,
  opts: { cwd?: string } = {},
): AiVisibilityReport {
  const cwd = opts.cwd ?? process.cwd();
  const observations = exportData?.observations ?? [];
  const cited = observations.filter((o) => o.softwareGlimpseCited && o.citedPath);
  const topCitedPages = aggregateCitedPages(observations);

  const previous = loadPreviousReport(cwd);
  const previousPaths = previous
    ? pathsFromAggregates(previous.analysis.topCitedPages)
    : new Set<string>();
  const currentPaths = pathsFromAggregates(topCitedPages);

  // Deltas require a prior report — never invent historical citation state.
  const newCitations = previous
    ? topCitedPages.filter((p) => !previousPaths.has(p.path))
    : [];
  const lostCitations = previous
    ? previous.analysis.topCitedPages.filter((p) => !currentPaths.has(p.path))
    : [];

  const competitorMap = new Map<
    string,
    { withSg: number; withoutSg: number }
  >();
  for (const obs of observations) {
    for (const competitor of obs.competitorsCited) {
      const key = competitor.toLowerCase();
      const row = competitorMap.get(key) ?? { withSg: 0, withoutSg: 0 };
      if (obs.softwareGlimpseCited) row.withSg += 1;
      else row.withoutSg += 1;
      competitorMap.set(key, row);
    }
  }

  const competitorOverlap = [...competitorMap.entries()]
    .map(([competitor, v]) => ({
      competitor,
      timesCitedWithSoftwareGlimpse: v.withSg,
      timesCitedWithoutSoftwareGlimpse: v.withoutSg,
    }))
    .sort(
      (a, b) =>
        b.timesCitedWithSoftwareGlimpse +
        b.timesCitedWithoutSoftwareGlimpse -
        (a.timesCitedWithSoftwareGlimpse + a.timesCitedWithoutSoftwareGlimpse),
    );

  const citationsByPlatform = countBy(cited.map((o) => o.platform));
  const citationsByCategory = countBy(cited.map((o) => o.category));
  const citationsByPageType = countBy(cited.map((o) => o.pageType));

  const topPlatform =
    Object.entries(citationsByPlatform).sort((a, b) => b[1] - a[1])[0]?.[0] ??
    null;

  const methodologyNotes = [
    "Observations come only from imported third-party exports (e.g. Ahrefs AI visibility) or empty when none supplied.",
    "Never fabricate ChatGPT/Perplexity/Copilot citations.",
    "New/lost citations compare against the previous data/seo/ai-visibility.json when present.",
    "Content-pattern notes are co-occurrence heuristics — correlation does not equal causation.",
    "This engine measures visibility; it does not attempt to manipulate AI systems.",
  ];

  if (!exportData) {
    methodologyNotes.push(
      "No export loaded — drop CSV/JSON under data/seo/imports/ahrefs-ai-visibility/.",
    );
  }
  if (!previous) {
    methodologyNotes.push(
      "No prior report on disk — new/lost citation lists start empty until a second run.",
    );
  }

  return {
    engineVersion: AI_VISIBILITY_ENGINE_VERSION,
    generatedAt: new Date().toISOString(),
    methodologyNotes,
    complianceNotes: [
      "Do not spam or manipulate AI answer engines.",
      "Do not invent observation rows or authority metrics.",
      "Measurement and analysis only.",
    ],
    exportMeta: exportData?.meta ?? null,
    observations,
    analysis: {
      totalCitations: cited.length,
      uniqueCitedPages: topCitedPages.length,
      citationsByPlatform,
      citationsByCategory,
      citationsByPageType,
      newCitations,
      lostCitations,
      competitorOverlap,
      topCitedPages,
    },
    contentPatterns: observeContentPatterns(topCitedPages),
    summary: {
      exportAvailable: Boolean(exportData && observations.length > 0),
      totalCitations: cited.length,
      uniqueCitedPages: topCitedPages.length,
      platformCount: Object.keys(citationsByPlatform).length,
      newCitationCount: newCitations.length,
      lostCitationCount: lostCitations.length,
      topPlatform,
    },
  };
}

/** @internal */
export function __countCited(observations: AiVisibilityObservation[]): number {
  return observations.filter((o) => o.softwareGlimpseCited).length;
}
