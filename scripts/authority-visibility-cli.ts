#!/usr/bin/env npx tsx
/**
 * Authority Visibility Intelligence CLI (master)
 *
 *   npm run authority:intelligence
 *   npm run authority:audit
 *   npm run authority:intelligence -- --mode FAST|FULL|RECHECK
 *   npm run authority:intelligence -- --json
 *   npm run authority:intelligence -- --no-write
 *
 * Never sends outreach or purchases placements.
 */
import { runAuthorityVisibilityIntelligenceOrchestrator } from "@/services/authority-intelligence/visibility";

function main(): void {
  const args = process.argv.slice(2);
  const json = args.includes("--json");
  const noWrite = args.includes("--no-write");

  let mode: "FAST" | "FULL" | "RECHECK" = "FULL";
  const modeIdx = args.indexOf("--mode");
  if (modeIdx >= 0 && args[modeIdx + 1]) {
    const m = args[modeIdx + 1]!.toUpperCase();
    if (m === "FAST" || m === "FULL" || m === "RECHECK") mode = m;
  }

  const result = runAuthorityVisibilityIntelligenceOrchestrator({
    mode,
    write: !noWrite,
  });

  if (json) {
    console.log(
      JSON.stringify(
        {
          agent: result.agent,
          generatedAt: result.generatedAt,
          mode: result.mode,
          paths: result.paths,
          summary: result.summary,
          scorecard: result.scorecard,
        },
        null,
        2,
      ),
    );
  } else {
    console.log(`AUTHORITY VISIBILITY — ${result.agent.label}`);
    console.log(`Mode:       ${result.mode}`);
    console.log(`Readiness:  ${result.summary.authorityReadiness}`);
    console.log(
      `Earned/Paid/PR/Presence/Partners/Promo: ${result.summary.earnedTop}/${result.summary.paid}/${result.summary.prIdeas}/${result.summary.presence}/${result.summary.partnerships}/${result.summary.promotionPlans}`,
    );
    console.log(`Tracked IDs: ${result.summary.tracked}`);
    console.log(`New vs prev: ${result.summary.newOpportunities}`);
    console.log(`Won links:   ${result.summary.wonLinks} (evidence-only)`);
    console.log("");
    console.log(
      "Reminder: report only — no outreach, no purchases, no invented won links.",
    );
    if (result.paths.master) {
      console.log("");
      console.log(`Wrote ${result.paths.master}`);
    }
    if (result.paths.archive) console.log(`Archived ${result.paths.archive}`);
    if (result.paths.system) console.log(`System ${result.paths.system}`);
  }
}

main();
