#!/usr/bin/env npx tsx
import { validateContentRepository } from "../src/data/validation/validate-content";

const report = validateContentRepository();

for (const issue of report.issues) {
  const prefix = issue.severity === "error" ? "ERROR" : "WARN";
  console.log(`${prefix} [${issue.code}] ${issue.message}`);
}

if (!report.ok) {
  console.error(`\nContent validation failed with ${report.issues.filter((i) => i.severity === "error").length} error(s).`);
  process.exit(1);
}

console.log(
  `\nContent validation passed (${report.issues.length} warning(s)).`,
);
