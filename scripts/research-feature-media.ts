#!/usr/bin/env npx tsx
/**
 * Feature media research CLI
 *
 *   npm run research:feature-media -- coverage <featureSlug> [--json]
 *   npm run research:feature-media -- coverage workflow-automation
 */
import {
  buildFeatureVisualCoverageReport,
  formatFeatureVisualCoverageReportText,
} from "@/services/feature-media-research";

function parseArgs(argv: string[]) {
  const json = argv.includes("--json");
  const positional = argv.filter((a) => !a.startsWith("--"));
  return {
    command: positional[0] ?? "help",
    featureSlug: positional[1],
    json,
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.command === "coverage") {
    if (!args.featureSlug) {
      console.error("Usage: research:feature-media coverage <featureSlug>");
      process.exit(1);
    }
    const report = buildFeatureVisualCoverageReport(args.featureSlug);
    if (!report) {
      console.error(`No Feature Detail page for ${args.featureSlug}`);
      process.exit(1);
    }
    if (args.json) {
      console.log(JSON.stringify(report, null, 2));
    } else {
      console.log(formatFeatureVisualCoverageReportText(report));
    }
    return;
  }

  console.log(`Feature media research

Commands:
  coverage <featureSlug> [--json]   Visual evidence coverage report

Lifecycle (API — do not auto-publish):
  discoverOfficialVideo
  verifyOfficialSource
  classifyOfficialVideo
  submitEditorialReview
  activateOfficialVideo
`);
}

main();
