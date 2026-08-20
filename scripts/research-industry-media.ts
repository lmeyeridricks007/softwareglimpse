#!/usr/bin/env npx tsx
/**
 * Industry media research CLI
 *
 *   npm run research:industry-media -- coverage <industrySlug> [--json]
 *   npm run research:industry-media -- coverage financial-services
 */
import {
  buildIndustryVisualCoverageReport,
  formatIndustryVisualCoverageReportText,
} from "@/services/industry-media-research";

function parseArgs(argv: string[]) {
  const json = argv.includes("--json");
  const positional = argv.filter((a) => !a.startsWith("--"));
  return {
    command: positional[0] ?? "help",
    industrySlug: positional[1],
    json,
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.command === "coverage") {
    if (!args.industrySlug) {
      console.error(
        "Usage: research:industry-media coverage <industrySlug> [--json]",
      );
      process.exit(1);
    }
    const report = buildIndustryVisualCoverageReport(args.industrySlug);
    if (!report) {
      console.error(`No industry found for ${args.industrySlug}`);
      process.exit(1);
    }
    if (args.json) {
      console.log(JSON.stringify(report, null, 2));
    } else {
      console.log(formatIndustryVisualCoverageReportText(report));
    }
    return;
  }

  console.log(`Industry media research

Commands:
  coverage <industrySlug> [--json]
    Industry media coverage report (informational — never a ranking factor)

Lifecycle (API — do not auto-publish):
  discoverIndustryOfficialVideo
  verifyIndustryOfficialSource
  classifyIndustryOfficialVideo
  submitIndustryEditorialReview
  activateIndustryOfficialVideo

Discovery targets:
  industry product/solution demos, workflows, webinars, tutorials,
  industry edition demos, vendor-published customer case studies
  (avoid generic brand marketing)

Classification maps:
  productId, industryIds[], mediaContext, industryRelevance,
  optional useCaseIds / capabilityIds / requirementIds / featureIds,
  whatThisShows / whatToNotice / limitations,
  reportedOutcomes (case studies — vendor-reported only)

Dedup: provider + providerId / sourceUrl (shared ResearchMedia catalog)
Health flags: unavailable, embedding-disabled, stale-ui, source-changed,
  industry-relationship-needs-review
`);
}

main();
