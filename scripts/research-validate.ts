#!/usr/bin/env npx tsx
import { validateResearchRepository } from "../src/data/validation/validate-research";

const report = validateResearchRepository();

for (const issue of report.issues) {
  const prefix = issue.severity === "error" ? "ERROR" : "WARN";
  console.log(`${prefix} [${issue.code}] ${issue.message}`);
}

if (!report.ok) {
  console.error(
    `\nResearch validation failed with ${report.issues.filter((i) => i.severity === "error").length} error(s).`,
  );
  process.exit(1);
}

console.log(`\nResearch validation passed (${report.issues.length} warning(s)).`);
