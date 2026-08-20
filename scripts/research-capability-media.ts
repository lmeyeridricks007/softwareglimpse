#!/usr/bin/env npx tsx
/**
 * Capability media research CLI
 *
 *   npm run research:capability-media -- coverage <capabilitySlug> [--industry <slug>] [--json]
 *   npm run research:capability-media -- coverage pipeline-management
 *   npm run research:capability-media -- coverage pipeline-management --industry financial-services
 */
import {
  buildCapabilityVisualCoverageReport,
  formatCapabilityVisualCoverageReportText,
} from "@/services/capability-media-research";

function parseArgs(argv: string[]) {
  const json = argv.includes("--json");
  const industryIdx = argv.indexOf("--industry");
  const industrySlug =
    industryIdx >= 0 ? argv[industryIdx + 1] : "financial-services";
  const positional = argv.filter(
    (a, i) =>
      !a.startsWith("--") &&
      !(industryIdx >= 0 && (i === industryIdx || i === industryIdx + 1)),
  );
  return {
    command: positional[0] ?? "help",
    capabilitySlug: positional[1],
    industrySlug,
    json,
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.command === "coverage") {
    if (!args.capabilitySlug) {
      console.error(
        "Usage: research:capability-media coverage <capabilitySlug> [--industry <slug>] [--json]",
      );
      process.exit(1);
    }
    const report = buildCapabilityVisualCoverageReport(args.capabilitySlug, {
      industrySlug: args.industrySlug,
    });
    if (!report) {
      console.error(
        `No Capability page for ${args.capabilitySlug} (industry=${args.industrySlug})`,
      );
      process.exit(1);
    }
    if (args.json) {
      console.log(JSON.stringify(report, null, 2));
    } else {
      console.log(formatCapabilityVisualCoverageReportText(report));
    }
    return;
  }

  console.log(`Capability media research

Commands:
  coverage <capabilitySlug> [--industry <slug>] [--json]
    Visual evidence coverage report (missing video ≠ incompleteness)

Lifecycle (API — do not auto-publish):
  discoverCapabilityOfficialVideo
  verifyCapabilityOfficialSource
  classifyCapabilityOfficialVideo
  submitCapabilityEditorialReview
  activateCapabilityOfficialVideo

Discovery types: official-video | official-tutorial | official-webinar
Dedup: provider + providerId / sourceUrl (shared ResearchMedia catalog)
`);
}

main();
