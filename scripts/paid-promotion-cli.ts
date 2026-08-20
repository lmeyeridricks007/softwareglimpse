#!/usr/bin/env npx tsx
/**
 * PaidPromotionOpportunityAgent CLI
 *
 *   npm run authority:paid
 *   npm run authority:paid -- --json
 *   npm run authority:paid -- --no-write
 *
 * Report only — never purchases placements.
 * Paid SEO / dofollow link buys are avoided.
 */
import { runPaidPromotionOpportunityAgent } from "@/services/authority-intelligence/paid";

function main(): void {
  const args = process.argv.slice(2);
  const json = args.includes("--json");
  const noWrite = args.includes("--no-write");

  const result = runPaidPromotionOpportunityAgent({
    write: !noWrite,
  });

  if (json) {
    console.log(
      JSON.stringify(
        {
          agent: result.agent,
          generatedAt: result.report.generatedAt,
          summary: {
            investigated: result.report.hitsInvestigated,
            accepted: result.report.accepted.length,
            avoided: result.report.avoided.length,
            experiments: result.report.experiments.length,
          },
          paths: result.paths,
          top5: result.report.accepted.slice(0, 5).map((o) => ({
            priority: o.priority,
            channel: o.siteChannel,
            cost: o.costDisplay,
            tier: o.budgetTier,
          })),
          experiments: result.report.experiments.map((e) => e.id),
        },
        null,
        2,
      ),
    );
  } else {
    const r = result.report;
    console.log(`PAID PROMOTION — ${result.agent.label}`);
    console.log(`Topic:         ${r.topic}`);
    console.log(`Investigated:  ${r.hitsInvestigated}`);
    console.log(`Accepted:      ${r.accepted.length}`);
    console.log(`Avoided:       ${r.avoided.length}`);
    console.log(`Experiments:   ${r.experiments.map((e) => e.id).join(", ")}`);
    console.log("");
    console.log(
      "Reminder: report only — do not purchase; never pay for dofollow/SEO juice.",
    );
    if (result.paths.master) {
      console.log("");
      console.log(`Wrote ${result.paths.master}`);
    }
  }
}

main();
