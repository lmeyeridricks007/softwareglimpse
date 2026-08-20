#!/usr/bin/env npx tsx
/**
 * DigitalPROpportunityAgent CLI
 *
 *   npm run authority:digital-pr
 *   npm run authority:digital-pr -- --json
 *   npm run authority:digital-pr -- --no-write
 *
 * Report only — never invents stats, never pitches.
 */
import { runDigitalPrOpportunityAgent } from "@/services/authority-intelligence/digital-pr";

function main(): void {
  const args = process.argv.slice(2);
  const json = args.includes("--json");
  const noWrite = args.includes("--no-write");

  const result = runDigitalPrOpportunityAgent({
    write: !noWrite,
  });

  if (json) {
    console.log(
      JSON.stringify(
        {
          agent: result.agent,
          generatedAt: result.report.generatedAt,
          summary: {
            ideas: result.report.ideas.length,
            ready: result.report.ideas.filter((i) => i.status === "ready")
              .length,
            deferred: result.report.deferredIdeas.length,
            publications: result.report.publicationMatches.length,
            commentary: result.report.expertCommentary.length,
          },
          paths: result.paths,
          top5: result.report.ideas.slice(0, 5).map((o) => ({
            priority: o.priority,
            title: o.title,
            status: o.status,
            linkability: o.scoreBand,
            effort: o.effort,
          })),
        },
        null,
        2,
      ),
    );
  } else {
    const r = result.report;
    console.log(`DIGITAL PR — ${result.agent.label}`);
    console.log(`Topic:      ${r.topic}`);
    console.log(`Ideas:      ${r.ideas.length}`);
    console.log(
      `Ready:      ${r.ideas.filter((i) => i.status === "ready").length}`,
    );
    console.log(`Deferred:   ${r.deferredIdeas.length}`);
    console.log(`Pubs:       ${r.publicationMatches.length}`);
    console.log(`Commentary: ${r.expertCommentary.length}`);
    console.log("");
    console.log(
      "Reminder: report only — never invent statistics or send pitches.",
    );
    if (result.paths.master) {
      console.log("");
      console.log(`Wrote ${result.paths.master}`);
    }
  }
}

main();
