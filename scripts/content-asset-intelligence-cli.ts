#!/usr/bin/env npx tsx
/**
 * Content Asset Intelligence Orchestrator CLI
 *
 *   npm run assets:intelligence
 *   npm run assets:intelligence:software
 *   npm run assets:intelligence:guides
 *   npm run assets:intelligence:crm
 *   npm run assets:intelligence -- --mode LIGHT
 *   npm run assets:intelligence -- --mode FULL --json
 *   npm run assets:intelligence -- --mode DEEP
 *   npm run assets:intelligence -- --no-write
 *   npm run assets:intelligence -- --strict-integrity
 *
 * Recommendations only — never auto-edits content.
 */
import { runContentAssetIntelligenceOrchestrator } from "@/services/asset-discovery/intelligence";

function main(): void {
  const args = process.argv.slice(2);
  const json = args.includes("--json");
  const noWrite = args.includes("--no-write");
  const strictIntegrity = args.includes("--strict-integrity");

  let mode: "LIGHT" | "FULL" | "DEEP" = "FULL";
  const modeIdx = args.indexOf("--mode");
  if (modeIdx >= 0 && args[modeIdx + 1]) {
    const m = args[modeIdx + 1]!.toUpperCase();
    if (m === "LIGHT" || m === "FULL" || m === "DEEP") mode = m;
  }

  let scope: "crm" | "software" | "guides" = "crm";
  if (args.includes("software") || args.includes("--software")) {
    scope = "software";
  } else if (args.includes("guides") || args.includes("--guides")) {
    scope = "guides";
  } else if (args.includes("crm") || args.includes("--crm")) {
    scope = "crm";
  }

  const softwareLimitIdx = args.indexOf("--software-limit");
  const guideLimitIdx = args.indexOf("--guide-limit");

  const result = runContentAssetIntelligenceOrchestrator({
    scope,
    mode,
    write: !noWrite,
    softwareLimit:
      softwareLimitIdx >= 0
        ? Number(args[softwareLimitIdx + 1])
        : undefined,
    guideLimit:
      guideLimitIdx >= 0 ? Number(args[guideLimitIdx + 1]) : undefined,
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
        },
        null,
        2,
      ),
    );
  } else {
    const s = result.summary;
    console.log(`ASSET INTELLIGENCE — ${result.agent.label}`);
    console.log(`Mode:                 ${result.mode}`);
    console.log(`Scope:                ${result.scope}`);
    console.log(`Software pages:       ${s.softwarePages}`);
    console.log(`Guides:               ${s.guides}`);
    console.log(`ResearchMedia:        ${s.researchMedia}`);
    console.log(`Backlog A0 / A1:      ${s.backlogA0} / ${s.backlogA1}`);
    console.log(`New official assets:  ${s.newOfficial}`);
    console.log(
      `Changes:              NEW ${s.changeSummary.NEW} · STILL OPEN ${s.changeSummary["STILL OPEN"]} · IMPLEMENTED ${s.changeSummary.IMPLEMENTED} · STALE ${s.changeSummary.STALE}`,
    );
    console.log(`Integrity critical:   ${s.integrityCritical}`);
    console.log("");
    console.log(
      "Reminder: recommendations only — discovery ≠ approval; no autonomous editing.",
    );
    if (result.paths.intelligenceLatest) {
      console.log("");
      console.log(`Wrote ${result.paths.intelligenceLatest}`);
    }
    if (result.paths.archive) {
      console.log(`Archived ${result.paths.archive}`);
    }
    if (result.paths.enrichmentBacklog) {
      console.log(`Backlog ${result.paths.enrichmentBacklog}`);
    }
  }

  // Never fail CI for missing screenshots / opportunity gaps.
  // Only optional hard-fail for deterministic integrity under --strict-integrity.
  if (strictIntegrity && result.summary.exitHint === "integrity-critical") {
    console.error(
      "Strict integrity: critical active-media / source URL problems detected.",
    );
    process.exit(1);
  }
}

main();
