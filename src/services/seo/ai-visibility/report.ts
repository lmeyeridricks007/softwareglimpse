import type { AiVisibilityReport } from "./types";

function kvList(record: Record<string, number>): string {
  const entries = Object.entries(record).sort((a, b) => b[1] - a[1]);
  if (entries.length === 0) return "_None._\n";
  return entries.map(([k, v]) => `- **${k}**: ${v}`).join("\n") + "\n";
}

/**
 * Format docs/seo/AI-VISIBILITY.md (system overview + latest snapshot).
 */
export function formatAiVisibilityMarkdown(report: AiVisibilityReport): string {
  const top = report.analysis.topCitedPages.slice(0, 20);
  const topLines =
    top.length === 0
      ? "_No SoftwareGlimpse citations in the current import._\n"
      : top
          .map(
            (p, i) =>
              `${i + 1}. \`${p.path}\` — ${p.citationCount} citation(s) · ${p.pageType ?? "unknown"} · ${p.category ?? "uncategorised"} · platforms: ${p.platforms.join(", ")}`,
          )
          .join("\n") + "\n";

  const newLines =
    report.analysis.newCitations.length === 0
      ? "_None (or no prior report to compare)._\n"
      : report.analysis.newCitations
          .map((p) => `- \`${p.path}\` (${p.citationCount})`)
          .join("\n") + "\n";

  const lostLines =
    report.analysis.lostCitations.length === 0
      ? "_None (or no prior report to compare)._\n"
      : report.analysis.lostCitations
          .map((p) => `- \`${p.path}\` (was ${p.citationCount})`)
          .join("\n") + "\n";

  const overlap =
    report.analysis.competitorOverlap.length === 0
      ? "_No competitor co-citation fields in import._\n"
      : report.analysis.competitorOverlap
          .slice(0, 20)
          .map(
            (c) =>
              `- **${c.competitor}** — with SG: ${c.timesCitedWithSoftwareGlimpse}, without SG: ${c.timesCitedWithoutSoftwareGlimpse}`,
          )
          .join("\n") + "\n";

  const patterns =
    report.contentPatterns.length === 0
      ? "_No cited pages to inspect._\n"
      : report.contentPatterns
          .slice(0, 15)
          .map(
            (p) =>
              `- \`${p.path}\` (${p.citationCount}): ${p.patterns.join(", ")} — _${p.caveat}_`,
          )
          .join("\n") + "\n";

  return `# AI Visibility

**Measurement and analysis only.** Do not attempt to manipulate or spam AI answer engines. Observations are never fabricated.

Generated: ${report.generatedAt}  
Engine: ${report.engineVersion}

Export: ${
    report.exportMeta
      ? `${report.exportMeta.provider} · ${report.exportMeta.label} · ${report.exportMeta.rowCount} rows`
      : "**none loaded** — import Ahrefs AI visibility (or similar) under \`data/seo/imports/ahrefs-ai-visibility/\`"
  }

---

## System

Tracks when SoftwareGlimpse pages appear as sources/references in AI-assisted search and answer engines, using **legitimate third-party exports** (e.g. Ahrefs AI Visibility).

| Artifact | Path |
|---|---|
| This report | \`docs/seo/AI-VISIBILITY.md\` |
| Machine JSON | \`data/seo/ai-visibility.json\` |
| Import drop folders | \`data/seo/imports/ahrefs-ai-visibility/\`, \`data/seo/imports/ai-visibility/\` |
| Fixture | \`src/data/seo/fixtures/ai-visibility-export-sample.csv\` |
| Implementation | \`src/services/seo/ai-visibility/\` |

### Platforms

ChatGPT · Perplexity · Copilot · Google AI surfaces · Gemini · other (when present in exports)

### Observation fields

platform, query, date, SoftwareGlimpse cited, cited URL, citation position (if known), competitors cited, topic, category, page type, notes — plus optional share/impressions **only when supplied**.

### Phases

1. **Data model** — typed observations (\`AiVisibilityObservation\`)
2. **Import** — CSV/JSON normalize; discovery of newest export; empty when missing
3. **Analysis** — totals, unique pages, by platform/category/page type, new/lost vs prior JSON, competitor overlap
4. **Content patterns** — URL/path co-occurrence heuristics (research, pricing, comparisons, tables, etc.) with explicit **correlation ≠ causation** caveats
5. **Report** — this Markdown + JSON; summary metrics for Organic Growth / GSC consumers

### Organic Growth integration

There is no separate “Organic Growth Agent” ID. Summary metrics feed:

1. \`data/seo/ai-visibility.json\` → \`loadAiVisibilitySummary()\`
2. GSC Opportunity Engine (\`npm run seo:gsc-opportunities\`) embeds the summary in \`docs/seo/TOP-20-GROWTH-PAGES.md\` and \`docs/seo/GSC-OPPORTUNITIES.md\`
3. Overlap notes on GSC rows that also appear in AI top cited paths (informational — **not** a ranking score boost)

### CLI

\`\`\`bash
npm run seo:ai-visibility
npm run seo:ai-visibility -- --export src/data/seo/fixtures/ai-visibility-export-sample.csv
npm run seo:ai-visibility -- --no-write --json
\`\`\`

### Never

- invent ChatGPT / Perplexity / Copilot / Gemini citation rows
- spam or manipulate AI systems to appear as sources
- treat content-pattern co-occurrence as proven causation
- auto-publish content changes from this report

---

## Summary (Organic Growth feed)

| Metric | Value |
|---|---|
| Total SG citations | ${report.summary.totalCitations} |
| Unique cited pages | ${report.summary.uniqueCitedPages} |
| Platforms with citations | ${report.summary.platformCount} |
| Top platform | ${report.summary.topPlatform ?? "—"} |
| New citations vs prior | ${report.summary.newCitationCount} |
| Lost citations vs prior | ${report.summary.lostCitationCount} |
| Export available | ${report.summary.exportAvailable ? "yes" : "no"} |

These summary metrics are written to \`data/seo/ai-visibility.json\` for Organic Growth / GSC opportunity consumers.

---

## Top cited pages

${topLines}

## New citations

${newLines}

## Lost citations

${lostLines}

## Platforms

${kvList(report.analysis.citationsByPlatform)}

## Categories

${kvList(report.analysis.citationsByCategory)}

## Page types

${kvList(report.analysis.citationsByPageType)}

## Competitor overlap

${overlap}

## Content-pattern observations

${patterns}

---

## Methodology

${report.methodologyNotes.map((n) => `- ${n}`).join("\n")}

## Compliance

${report.complianceNotes.map((n) => `- ${n}`).join("\n")}
`;
}
