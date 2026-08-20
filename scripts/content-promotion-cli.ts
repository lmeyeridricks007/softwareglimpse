#!/usr/bin/env npx tsx
/**
 * ContentPromotionOpportunityAgent CLI
 *
 *   npm run authority:promote
 *   npm run authority:promote -- --json
 *   npm run authority:promote -- --no-write
 *
 * Report only — never posts; never generates all creative assets.
 */
import { runContentPromotionOpportunityAgent } from "@/services/authority-intelligence/promotion";

function main(): void {
  const args = process.argv.slice(2);
  const json = args.includes("--json");
  const noWrite = args.includes("--no-write");

  const result = runContentPromotionOpportunityAgent({
    write: !noWrite,
  });

  if (json) {
    console.log(
      JSON.stringify(
        {
          agent: result.agent,
          generatedAt: result.report.generatedAt,
          summary: {
            plans: result.report.plans.length,
            launches: result.report.launchPlans.length,
            rejected: result.report.rejectedTactics.length,
            channels: result.report.channelsCatalogued,
          },
          paths: result.paths,
          top5: result.report.plans.slice(0, 5).map((p) => ({
            priority: p.priority,
            asset: p.assetName,
            channels: p.primaryChannels.slice(0, 4),
            effort: p.effort,
          })),
        },
        null,
        2,
      ),
    );
  } else {
    const r = result.report;
    console.log(`CONTENT PROMOTION — ${result.agent.label}`);
    console.log(`Topic:     ${r.topic}`);
    console.log(`Plans:     ${r.plans.length}`);
    console.log(`Launches:  ${r.launchPlans.length}`);
    console.log(`Rejected:  ${r.rejectedTactics.length}`);
    console.log(`Channels:  ${r.channelsCatalogued}`);
    console.log("");
    console.log(
      "Reminder: report only — no posting; help-first in communities; no fake engagement.",
    );
    if (result.paths.master) {
      console.log("");
      console.log(`Wrote ${result.paths.master}`);
    }
  }
}

main();
