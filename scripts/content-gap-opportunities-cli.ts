#!/usr/bin/env npx tsx
/**
 * Content Gap & New Content Opportunity Agent CLI
 *
 *   npm run content:gaps
 *   npm run content:opportunities
 *   npm run content:new-opportunities
 *
 * Identifies gaps only — never creates content.
 *
 * Note: supporting-content-clusters gaps live at:
 *   npm run content:clusters:gaps
 */
import { runContentGapOpportunityAgent } from "@/services/content-quality/gaps";

function main(): void {
  const json = process.argv.includes("--json");
  const noWrite = process.argv.includes("--no-write");
  const result = runContentGapOpportunityAgent({
    write: !noWrite,
  });
  const s = result.summary;

  if (json) {
    console.log(JSON.stringify({ ...result, markdown: undefined }, null, 2));
    return;
  }

  console.log(`NEW CONTENT OPPORTUNITIES — ${result.agent.label}`);
  console.log(`Total candidates:        ${s.total}`);
  console.log(`CREATE now:              ${s.create}`);
  console.log(`RESEARCH FIRST:          ${s.researchFirst}`);
  console.log(`MERGE INTO EXISTING:     ${s.merge}`);
  console.log(`KEEP AS SECTION:         ${s.keepAsSection}`);
  console.log(`DO NOT CREATE:           ${s.doNotCreate}`);
  console.log(`FUTURE:                  ${s.future}`);
  console.log(`Resources/tools:         ${s.resources}`);
  console.log(`Product guides:          ${s.productGuides}`);
  console.log(`Industry guides:         ${s.industryGuides}`);
  console.log(`Supporting/pillar:       ${s.supporting}`);
  console.log(`Coverage input:          ${s.coverageNote}`);
  console.log("");
  console.log("Top priorities:");
  s.top50.slice(0, 20).forEach((o, i) => {
    console.log(
      `  ${String(i + 1).padStart(2)}. ${o.priority}  [${o.decision}]  ${o.title}  (${o.type})`,
    );
  });
  if (result.reportPath) {
    console.log("");
    console.log(`Wrote ${result.reportPath}`);
  } else {
    console.log("");
    console.log(`Document path: ${s.documentPath}`);
  }
}

main();
