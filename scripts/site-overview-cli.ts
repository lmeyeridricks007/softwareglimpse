#!/usr/bin/env tsx
/**
 * WebsiteOverviewAgent CLI
 *
 *   npm run site:overview
 *   npm run site:overview -- --no-write
 *   npm run site:overview -- --json
 *
 * Consumes existing latest reports. Does NOT mutate production content.
 */
import { runWebsiteOverviewAgent } from "@/services/site-intelligence/overview";

function main(): void {
  const args = process.argv.slice(2);
  const json = args.includes("--json");
  const noWrite = args.includes("--no-write");
  const noArchive = args.includes("--no-archive");

  const result = runWebsiteOverviewAgent({
    write: !noWrite,
    archive: !noWrite && !noArchive,
  });

  if (json) {
    console.log(
      JSON.stringify(
        {
          agent: result.agent,
          generatedAt: result.generatedAt,
          paths: result.paths,
          overall: result.model.assessment.overallWebsiteQuality.score,
          band: result.model.assessment.overallWebsiteQuality.band,
          visibility:
            result.model.assessment.searchVisibility.availability,
          competitive:
            result.model.assessment.competitiveContentStrength.availability,
          strengths: result.model.strengths.length,
          weaknesses: result.model.weaknesses.length,
          risks: result.model.risks.length,
          recommendations: result.model.recommendations.length,
        },
        null,
        2,
      ),
    );
    return;
  }

  const o = result.model.assessment.overallWebsiteQuality;
  console.log(`WEBSITE OVERVIEW — ${result.agent.name} v${result.agent.version}`);
  console.log(`Generated:     ${result.generatedAt}`);
  console.log(
    `Overall:       ${o.score ?? "—"} / 100 (${o.band ?? o.availability})`,
  );
  console.log(
    `Technical:     ${result.model.assessment.technicalSeoHealth.score}`,
  );
  console.log(
    `Content:       ${result.model.assessment.contentQuality.score}`,
  );
  console.log(
    `Experience:    ${result.model.assessment.websiteExperience.score}`,
  );
  console.log(
    `Ecosystem:     ${result.model.assessment.contentEcosystemStrength.score}`,
  );
  console.log(
    `Competitive:   ${result.model.assessment.competitiveContentStrength.availability}`,
  );
  console.log(
    `Visibility:    ${result.model.assessment.searchVisibility.availability}`,
  );
  console.log(`Strengths:     ${result.model.strengths.length}`);
  console.log(`Weaknesses:    ${result.model.weaknesses.length}`);
  console.log(`Risks:         ${result.model.risks.length}`);
  console.log(`Recommendations: ${result.model.recommendations.length}`);
  if (result.paths.latest) console.log(`Latest:        ${result.paths.latest}`);
  if (result.paths.archive) console.log(`Archive:       ${result.paths.archive}`);
  console.log("\nNo production content was modified.");
}

main();
