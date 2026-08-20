#!/usr/bin/env npx tsx
import {
  buildEditorialReport,
  formatEditorialReport,
} from "../src/services/editorial/report";

function usage(): never {
  console.error(`Usage:
  npm run editorial:report -- <software-slug>

Example:
  npm run editorial:report -- pipedrive
`);
  process.exit(1);
}

function main() {
  const slug = process.argv[2];
  if (!slug || slug.startsWith("--") || slug === "--help") usage();

  const report = buildEditorialReport(slug);
  console.log(formatEditorialReport(report));
}

main();
