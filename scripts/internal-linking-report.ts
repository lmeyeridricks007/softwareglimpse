/**
 * Generate docs/seo/03-internal-linking-report.md from the CRM link graph.
 *
 * Usage: npx tsx scripts/internal-linking-report.ts
 */
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { formatInternalLinkingReportMarkdown } from "../src/services/internal-linking/report";

const out = resolve(process.cwd(), "docs/seo/03-internal-linking-report.md");
const markdown = formatInternalLinkingReportMarkdown();
writeFileSync(out, markdown, "utf8");
console.log(`Wrote ${out}`);
