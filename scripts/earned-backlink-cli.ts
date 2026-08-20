#!/usr/bin/env npx tsx
/**
 * EarnedBacklinkOpportunityAgent CLI
 *
 *   npm run authority:earned
 *   npm run authority:earned -- --json
 *   npm run authority:earned -- --no-write
 *
 * Requires live-verified search hits. Does not invent opportunities.
 * Never sends outreach.
 */
import { runEarnedBacklinkOpportunityAgent } from "@/services/authority-intelligence/earned";

function main(): void {
  const args = process.argv.slice(2);
  const json = args.includes("--json");
  const noWrite = args.includes("--no-write");

  const result = runEarnedBacklinkOpportunityAgent({
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
            top50: result.report.top50.length,
            rejected: result.report.rejected.length,
          },
          paths: result.paths,
          top10: result.report.top50.slice(0, 10).map((o) => ({
            priority: o.priority,
            domain: o.domain,
            type: o.type,
            scoreBand: o.scoreBand,
            url: o.opportunityUrl,
          })),
        },
        null,
        2,
      ),
    );
  } else {
    const r = result.report;
    console.log(`EARNED BACKLINKS — ${result.agent.label}`);
    console.log(`Topic:           ${r.topic}`);
    console.log(`Investigated:    ${r.hitsInvestigated}`);
    console.log(`Accepted:        ${r.accepted.length}`);
    console.log(`Top listed:      ${r.top50.length}`);
    console.log(`Rejected:        ${r.rejected.length}`);
    console.log("");
    console.log(
      "Reminder: live-verified recommendations only — no automated outreach.",
    );
    if (result.paths.master) {
      console.log("");
      console.log(`Wrote ${result.paths.master}`);
      console.log(`Rejects ${result.paths.rejects}`);
      console.log(`Domain reports: ${result.paths.domains.length}`);
    }
  }
}

main();
