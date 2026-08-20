#!/usr/bin/env npx tsx
/**
 * Authority / Backlink / Promotion Intelligence CLI
 *
 *   npm run authority:intelligence
 *   npm run authority:intelligence -- --mode FAST
 *   npm run authority:intelligence -- --mode FULL
 *   npm run authority:intelligence -- --mode RECHECK
 *   npm run authority:intelligence -- --json
 *   npm run authority:intelligence -- --no-write
 *
 * DISCOVER → VERIFY → QUALIFY → RECOMMEND → DRAFT ANGLES only.
 * Never sends outreach, buys placements, or mutates production content.
 */
import { runAuthorityIntelligenceOrchestrator } from "@/services/authority-intelligence";

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

  const scope =
    args.includes("crm") || args.includes("--crm") ? "crm" : "crm";

  const result = runAuthorityIntelligenceOrchestrator({
    scope,
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
          scope: result.scope,
          paths: result.paths,
          summary: result.summary,
          authorityLimitations: result.authorityLimitations,
        },
        null,
        2,
      ),
    );
  } else {
    const s = result.summary;
    console.log(`AUTHORITY INTELLIGENCE — ${result.agent.label}`);
    console.log(`Mode:              ${result.mode}`);
    console.log(`Opportunities:     ${s.total}`);
    console.log(
      `Bands:             EXCELLENT ${s.excellent} · STRONG ${s.strong} · GOOD ${s.good} · LOW ${s.low} · AVOID ${s.avoid}`,
    );
    console.log(`Free-first:        ${s.freeFirst}`);
    console.log(`Paid exposure:     ${s.paidExposure}`);
    console.log(`Linkable assets:   ${s.linkableAssets}`);
    console.log(`Angles drafted:    ${s.angles}`);
    console.log(
      `Changes:           ${Object.entries(s.changeSummary)
        .map(([k, v]) => `${k} ${v}`)
        .join(" · ")}`,
    );
    console.log("");
    console.log(
      "Reminder: recommendations only — no automated outreach, purchases, or production edits.",
    );
    if (result.paths.intelligenceLatest) {
      console.log("");
      console.log(`Wrote ${result.paths.intelligenceLatest}`);
    }
    if (result.paths.archive) {
      console.log(`Archived ${result.paths.archive}`);
    }
  }
}

main();
