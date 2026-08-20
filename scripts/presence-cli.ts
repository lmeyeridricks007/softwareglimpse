#!/usr/bin/env npx tsx
/**
 * PresenceOpportunityAgent CLI
 *   npm run authority:presence
 */
import { runPresenceOpportunityAgent } from "@/services/authority-intelligence/presence";

function main(): void {
  const noWrite = process.argv.includes("--no-write");
  const json = process.argv.includes("--json");
  const result = runPresenceOpportunityAgent({ write: !noWrite });
  if (json) {
    console.log(
      JSON.stringify(
        {
          accepted: result.report.accepted.length,
          rejected: result.report.rejected.length,
          paths: result.paths,
        },
        null,
        2,
      ),
    );
  } else {
    console.log(`PRESENCE — ${result.agent.label}`);
    console.log(`Accepted: ${result.report.accepted.length}`);
    console.log(`Rejected: ${result.report.rejected.length}`);
    if (result.paths.master) console.log(`Wrote ${result.paths.master}`);
  }
}

main();
