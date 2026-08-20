#!/usr/bin/env npx tsx
/**
 * Content Intelligence Orchestrator CLI
 *
 *   npm run content:intelligence
 *   npm run content:intelligence:crm
 *   npm run content:intelligence -- --mode FAST
 *   npm run content:intelligence -- --mode FULL --json
 *   npm run content:intelligence -- --no-write
 *   npm run content:intelligence -- --strict-integrity
 *
 * Evaluation / recommendation only — never creates or publishes content.
 */
import { runContentIntelligenceOrchestrator } from "@/services/content-quality/intelligence";

function main(): void {
  const args = process.argv.slice(2);
  const json = args.includes("--json");
  const noWrite = args.includes("--no-write");
  const strictIntegrity = args.includes("--strict-integrity");
  const updateMasterMap = args.includes("--update-master-map");

  let mode: "FAST" | "FULL" = "FULL";
  const modeIdx = args.indexOf("--mode");
  if (modeIdx >= 0 && args[modeIdx + 1]) {
    const m = args[modeIdx + 1]!.toUpperCase();
    if (m === "FAST" || m === "FULL") mode = m;
  }
  // npm run content:intelligence:crm may pass "crm"
  const scope = args.includes("crm") || args.includes("--crm") ? "crm" : "crm";

  const result = runContentIntelligenceOrchestrator({
    scope,
    mode,
    write: !noWrite,
    updateMasterMap,
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
    console.log(`CONTENT INTELLIGENCE — ${result.agent.label}`);
    console.log(`Mode:                    ${result.mode}`);
    console.log(`Pages audited:           ${s.pagesAudited}`);
    console.log(`Average score:           ${s.averageScore}`);
    console.log(`Improvements:            ${s.improvements}`);
    console.log(`New content candidates:  ${s.gaps}`);
    console.log(`Duplicates:              ${s.duplicates}`);
    console.log(`Integrity critical:      ${s.integrityCritical}`);
    console.log(
      `Changes:                 NEW ${s.changeSummary["NEW ISSUES"]} · RESOLVED ${s.changeSummary.RESOLVED} · IMPROVED ${s.changeSummary.IMPROVED} · REGRESSED ${s.changeSummary.REGRESSED} · UNCHANGED ${s.changeSummary.UNCHANGED}`,
    );
    console.log("");
    console.log(
      "Reminder: recommendations only — human selects actions; no autonomous editing.",
    );
    if (result.paths.intelligenceLatest) {
      console.log("");
      console.log(`Wrote ${result.paths.intelligenceLatest}`);
    }
    if (result.paths.archive) {
      console.log(`Archived ${result.paths.archive}`);
    }
    if (result.paths.qualityLatest) {
      console.log(`Quality ${result.paths.qualityLatest}`);
    }
    if (result.paths.improvementBacklog) {
      console.log(`Backlog ${result.paths.improvementBacklog}`);
    }
    if (result.paths.newOpportunities) {
      console.log(`Gaps ${result.paths.newOpportunities}`);
    }
  }

  // Subjective quality never fails CI. Deterministic integrity may warn or
  // fail only when --strict-integrity is set.
  if (strictIntegrity && result.summary.integrityCritical > 0) {
    console.error(
      `\nStrict integrity: ${result.summary.integrityCritical} critical finding(s).`,
    );
    process.exit(1);
  }
}

main();
