#!/usr/bin/env npx tsx
/**
 * Content Improvement Opportunity Agent CLI
 *
 *   npm run content:backlog
 *   npm run content:improve
 *
 * Planning only — never rewrites content.
 */
import { runContentImprovementOpportunityAgent } from "@/services/content-quality/improvement";

function main(): void {
  const json = process.argv.includes("--json");
  const noWrite = process.argv.includes("--no-write");
  const result = runContentImprovementOpportunityAgent({
    write: !noWrite,
  });
  const s = result.summary;

  if (json) {
    console.log(JSON.stringify({ ...result, markdown: undefined }, null, 2));
    return;
  }

  console.log(`CONTENT IMPROVEMENT BACKLOG — ${result.agent.label}`);
  console.log(`Total opportunities:     ${s.total}`);
  console.log(`Quick wins:              ${s.quickWins}`);
  console.log(`Major projects:          ${s.majorProjects}`);
  console.log(`Research-dependent:      ${s.researchDependent}`);
  console.log(`Systemic-tagged:         ${s.systemic}`);
  console.log(`Fix classes:             ${JSON.stringify(s.byFixClass)}`);
  console.log(`SEO input:               ${s.seoNote}`);
  console.log("");
  console.log("Systemic patterns:");
  for (const p of s.patterns) {
    console.log(`  (${p.count}) ${p.id} — ${p.label}`);
  }
  console.log("");
  console.log("Top 20 priority improvements:");
  s.top20.forEach((o, i) => {
    console.log(
      `  ${String(i + 1).padStart(2)}. ${o.priority}  ${o.score}  ${o.route}  [${o.types[0]}]`,
    );
  });
  if (result.backlogPath) {
    console.log("");
    console.log(`Wrote ${result.backlogPath}`);
  }
}

main();
