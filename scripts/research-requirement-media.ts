#!/usr/bin/env npx tsx
/**
 * Requirement media research CLI
 *
 *   npm run research:requirement-media -- coverage <requirementSlug> [--json]
 *   npm run research:requirement-media -- coverage separate-sales-processes
 */
import {
  buildRequirementVisualCoverageReport,
  formatRequirementVisualCoverageReportText,
} from "@/services/requirement-media-research";

function parseArgs(argv: string[]) {
  const json = argv.includes("--json");
  const positional = argv.filter((a) => !a.startsWith("--"));
  return {
    command: positional[0] ?? "help",
    requirementSlug: positional[1],
    json,
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.command === "coverage") {
    if (!args.requirementSlug) {
      console.error(
        "Usage: research:requirement-media coverage <requirementSlug> [--json]",
      );
      process.exit(1);
    }
    const report = buildRequirementVisualCoverageReport(args.requirementSlug);
    if (!report) {
      console.error(`No requirement found for ${args.requirementSlug}`);
      process.exit(1);
    }
    if (args.json) {
      console.log(JSON.stringify(report, null, 2));
    } else {
      console.log(formatRequirementVisualCoverageReportText(report));
    }
    return;
  }

  console.log(`Requirement media research

Commands:
  coverage <requirementSlug> [--json]
    Evidence coverage report (official video counts are informational)

Lifecycle (API — do not auto-publish):
  discoverRequirementOfficialVideo
  verifyRequirementOfficialSource
  classifyRequirementOfficialVideo
  submitRequirementEditorialReview
  activateRequirementOfficialVideo

Classification maps: productIds, requirementIds, requirementCriterionIds,
  featureIds, capabilityIds, useCaseIds, industryIds
Editorial: whatThisShows[] + limitations[] (grounded observations only)
Criterion coverage: only explicitly classified requirementCriterionIds
Dedup: provider + providerId / sourceUrl (shared ResearchMedia catalog)
`);
}

main();
