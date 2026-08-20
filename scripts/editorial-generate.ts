#!/usr/bin/env npx tsx
import { generateEditorial } from "../src/services/editorial/generate";

function usage(): never {
  console.error(`Usage:
  npm run editorial:generate -- software <slug> [--dry-run] [--force]
  npm run editorial:generate -- comparison <slug> [--dry-run] [--force]
  npm run editorial:generate -- best <slug> [--dry-run] [--force]

Examples:
  npm run editorial:generate -- software pipedrive
  npm run editorial:generate -- comparison freshsales-vs-pipedrive --dry-run
  npm run editorial:generate -- best crm-software --force
`);
  process.exit(1);
}

function main() {
  const args = process.argv.slice(2);
  if (args.length === 0 || args.includes("--help")) usage();

  const kind = args[0];
  const targetSlug = args[1];
  if (
    kind !== "software" &&
    kind !== "comparison" &&
    kind !== "best"
  ) {
    usage();
  }
  if (!targetSlug || targetSlug.startsWith("--")) usage();

  const dryRun = args.includes("--dry-run");
  const force = args.includes("--force");

  const result = generateEditorial(kind, targetSlug, { dryRun, force });

  console.log(`Kind: ${result.pageType}`);
  console.log(`Target: ${result.targetSlug}`);
  console.log(`Dry run: ${result.dryRun}`);
  console.log(`Wrote: ${result.wrote.join(", ") || "(none)"}`);
  console.log(`Skipped: ${result.skipped.join(", ") || "(none)"}`);
  for (const message of result.messages) {
    console.log(`- ${message}`);
  }
}

main();
