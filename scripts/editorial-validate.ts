#!/usr/bin/env npx tsx
import { validateEditorialRepository } from "../src/services/editorial/validate";

const report = validateEditorialRepository();

for (const issue of report.issues) {
  const prefix = issue.severity === "error" ? "ERROR" : "WARN";
  const target = issue.target ? ` (${issue.target})` : "";
  console.log(`${prefix} [${issue.code}]${target} ${issue.message}`);
}

if (!report.ok) {
  console.error(
    `\nEditorial validation failed with ${report.issues.filter((i) => i.severity === "error").length} error(s).`,
  );
  process.exit(1);
}

console.log(
  `\nEditorial validation passed (${report.issues.filter((i) => i.severity === "warning").length} warning(s)).`,
);
