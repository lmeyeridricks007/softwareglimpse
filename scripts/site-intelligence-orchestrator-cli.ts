#!/usr/bin/env tsx
/**
 * WebsiteIntelligenceOrchestrator CLI
 *
 *   npm run site:intelligence
 *   npm run site:intelligence:crm
 *   npm run site:intelligence -- --mode LIGHT
 *   npm run site:intelligence -- --mode FULL
 *   npm run site:intelligence -- --mode DEEP
 *   npm run site:intelligence -- --no-write --json
 *   npm run site:intelligence -- --fixture
 *
 * Evaluation / recommendation only — never modifies the site.
 */
import { runWebsiteIntelligenceOrchestrator } from "@/services/site-intelligence/orchestrator";
import type { WebsiteIntelligenceMode } from "@/services/site-intelligence/orchestrator/types";

function parseMode(raw: string | undefined): WebsiteIntelligenceMode {
  const m = (raw ?? "FULL").toUpperCase();
  if (m === "LIGHT" || m === "FULL" || m === "DEEP") return m;
  console.error(`Unknown mode "${raw}" — use LIGHT | FULL | DEEP`);
  process.exit(1);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const json = args.includes("--json");
  const noWrite = args.includes("--no-write");
  const noArchive = args.includes("--no-archive");
  const fixture = args.includes("--fixture");

  const modeIdx = args.indexOf("--mode");
  const mode = parseMode(modeIdx >= 0 ? args[modeIdx + 1] : "FULL");

  // npm run site:intelligence:crm may pass "crm"
  const cluster =
    args.includes("crm") || args.includes("--crm") ? "crm" : "crm";

  const result = await runWebsiteIntelligenceOrchestrator({
    mode,
    cluster,
    write: !noWrite,
    archive: !noWrite && !noArchive,
    fixture,
  });

  if (json) {
    console.log(
      JSON.stringify(
        {
          agent: result.agent,
          generatedAt: result.generatedAt,
          mode: result.mode,
          cluster: result.cluster,
          overall: result.model.overallScore,
          confidence: result.model.confidence.level,
          paths: result.paths,
          refreshNotes: result.refreshNotes,
          measurementStatus: result.model.measurementStatus,
          scorecard: result.model.scorecard.map((c) => ({
            id: c.id,
            display: c.display,
            score: c.score,
          })),
        },
        null,
        2,
      ),
    );
    return;
  }

  console.log(
    `WEBSITE INTELLIGENCE — ${result.agent.name} v${result.agent.version}`,
  );
  console.log(`Mode:          ${result.mode}`);
  console.log(`Cluster:       ${result.cluster}`);
  console.log(`Generated:     ${result.generatedAt}`);
  console.log(
    `Overall:       ${result.model.overallScore ?? "—"} / 100`,
  );
  console.log(`Confidence:    ${result.model.confidence.level}`);
  for (const c of result.model.scorecard) {
    if (c.id === "overall") continue;
    console.log(`  ${c.label.padEnd(22)} ${c.display}`);
  }
  console.log("");
  console.log(`Risks:         ${result.model.topRisks.length}`);
  console.log(`Actions:       ${result.model.topActions.length}`);
  for (const m of result.model.measurementStatus) {
    console.log(`  ${m.label}: ${m.status}`);
  }
  if (result.paths.latest) console.log(`\nLatest:        ${result.paths.latest}`);
  if (result.paths.archive) console.log(`Archive:       ${result.paths.archive}`);
  if (result.paths.json) console.log(`JSON:          ${result.paths.json}`);
  console.log("\nNo production content was modified.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
