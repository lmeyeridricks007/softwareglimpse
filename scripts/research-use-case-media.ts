#!/usr/bin/env npx tsx
/**
 * Use Case media research CLI
 *
 *   npm run research:use-case-media -- coverage <useCaseSlug> [--json]
 *   npm run research:use-case-media -- coverage lead-management
 */
import {
  buildUseCaseVisualCoverageReport,
  formatUseCaseVisualCoverageReportText,
} from "@/services/use-case-media-research";

function parseArgs(argv: string[]) {
  const json = argv.includes("--json");
  const positional = argv.filter((a) => !a.startsWith("--"));
  return {
    command: positional[0] ?? "help",
    useCaseSlug: positional[1],
    json,
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.command === "coverage") {
    if (!args.useCaseSlug) {
      console.error(
        "Usage: research:use-case-media coverage <useCaseSlug> [--json]",
      );
      process.exit(1);
    }
    const report = buildUseCaseVisualCoverageReport(args.useCaseSlug);
    if (!report) {
      console.error(`No use case found for ${args.useCaseSlug}`);
      process.exit(1);
    }
    if (args.json) {
      console.log(JSON.stringify(report, null, 2));
    } else {
      console.log(formatUseCaseVisualCoverageReportText(report));
    }
    return;
  }

  console.log(`Use Case media research

Commands:
  coverage <useCaseSlug> [--json]
    Visual evidence coverage report (video coverage is informational)

Lifecycle (API — do not auto-publish):
  discoverUseCaseOfficialVideo
  verifyUseCaseOfficialSource
  classifyUseCaseOfficialVideo
  submitUseCaseEditorialReview
  activateUseCaseOfficialVideo

Discovery types: official-video | official-tutorial | official-webinar
Avoid generic corporate/brand marketing.
Dedup: provider + providerId / sourceUrl (shared ResearchMedia catalog)
Workflow coverage: only explicitly classified workflowStepIds (no inference)
`);
}

main();
