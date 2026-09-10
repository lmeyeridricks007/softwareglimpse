#!/usr/bin/env npx tsx
/**
 * AI Visibility monitoring CLI
 *
 * Usage:
 *   npm run seo:ai-visibility
 *   npm run seo:ai-visibility -- --export src/data/seo/fixtures/ai-visibility-export-sample.csv
 *   npm run seo:ai-visibility -- --no-write --json
 *
 * Measurement only. Never invents citations. Does not manipulate AI systems.
 */
import { runAiVisibilityAnalysis } from "@/services/seo/ai-visibility";

function flag(name: string): boolean {
  return process.argv.includes(name);
}

function argValue(name: string): string | undefined {
  const idx = process.argv.indexOf(name);
  if (idx === -1) return undefined;
  return process.argv[idx + 1];
}

function usage(code = 1): never {
  console.error(`AI Visibility Engine

Usage:
  npm run seo:ai-visibility
  npm run seo:ai-visibility -- --export <path-to-csv-or-json>
  npm run seo:ai-visibility -- --no-write --json

Flags:
  --export <path>   Ahrefs AI visibility (or similar) CSV/JSON
  --no-write        Do not write docs/seo or data/seo outputs
  --json            Print summary JSON to stdout
  --help            Show this help

When --export is omitted, the newest file under
data/seo/imports/ahrefs-ai-visibility/ or data/seo/imports/ai-visibility/
is selected. If none exist, the report is empty (never fabricated).
`);
  process.exit(code);
}

function main(): void {
  if (flag("--help") || flag("-h")) usage(0);

  const report = runAiVisibilityAnalysis({
    exportPath: argValue("--export"),
    write: !flag("--no-write"),
  });

  if (flag("--json")) {
    console.log(JSON.stringify(report.summary, null, 2));
    return;
  }

  console.log(`ai-visibility-engine v${report.engineVersion}`);
  console.log(
    `  export: ${report.exportMeta ? report.exportMeta.label : "(none)"}`,
  );
  console.log(`  citations: ${report.summary.totalCitations}`);
  console.log(`  uniquePages: ${report.summary.uniqueCitedPages}`);
  console.log(`  platforms: ${report.summary.platformCount}`);
  console.log(`  topPlatform: ${report.summary.topPlatform ?? "—"}`);
  console.log(`  new: ${report.summary.newCitationCount}`);
  console.log(`  lost: ${report.summary.lostCitationCount}`);
  if (!flag("--no-write")) {
    console.log("  wrote: data/seo/ai-visibility.json");
    console.log("  wrote: docs/seo/AI-VISIBILITY.md");
  }
  console.log(
    "\nCompliance: measurement only — no fabricated observations, no AI manipulation.",
  );
}

main();
