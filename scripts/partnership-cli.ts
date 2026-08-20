#!/usr/bin/env npx tsx
/**
 * PartnershipOpportunityAgent CLI
 *
 *   npm run authority:partnerships
 *   npm run authority:partnerships -- --json
 *   npm run authority:partnerships -- --no-write
 *
 * Report only — never contacts partners.
 */
import { runPartnershipOpportunityAgent } from "@/services/authority-intelligence/partnership";

function main(): void {
  const args = process.argv.slice(2);
  const json = args.includes("--json");
  const noWrite = args.includes("--no-write");

  const result = runPartnershipOpportunityAgent({
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
            rejected: result.report.rejected.length,
          },
          paths: result.paths,
          top5: result.report.accepted.slice(0, 5).map((o) => ({
            priority: o.priority,
            organization: o.organization,
            type: o.partnerType,
            visibility: o.visibilityValue,
            difficulty: o.difficulty,
          })),
        },
        null,
        2,
      ),
    );
  } else {
    const r = result.report;
    console.log(`PARTNERSHIPS — ${result.agent.label}`);
    console.log(`Topic:        ${r.topic}`);
    console.log(`Investigated: ${r.hitsInvestigated}`);
    console.log(`Accepted:     ${r.accepted.length}`);
    console.log(`Rejected:     ${r.rejected.length}`);
    console.log("");
    console.log(
      "Reminder: report only — no outreach; no mass link exchange; no false SI claims.",
    );
    if (result.paths.master) {
      console.log("");
      console.log(`Wrote ${result.paths.master}`);
    }
  }
}

main();
