#!/usr/bin/env npx tsx
/**
 * Knowledge graph + hub organization + IMPROVE inbound + QA
 *
 *   npm run seo:knowledge-graph
 *   npm run seo:knowledge-graph -- --no-write --json
 */
import { analyzeKnowledgeGraph } from "@/services/seo/knowledge-graph";

function main(): void {
  const args = process.argv.slice(2);
  const write = !args.includes("--no-write");
  const json = args.includes("--json");

  const report = analyzeKnowledgeGraph({ write });

  if (json) {
    console.log(
      JSON.stringify(
        {
          generatedAt: report.generatedAt,
          summary: report.summary,
          journeys: report.journeys.map((j) => j.id),
          authorityTop: report.authorityTop.slice(0, 10),
          improveSample: report.improveInbound.slice(0, 5).map((r) => ({
            path: r.path,
            orphanStatus: r.orphanStatus,
            hubDepth: r.hubDepth,
            suggested: r.suggestedAdditions.map((s) => s.fromPath),
          })),
          qaErrors: report.summary.qaErrors,
          qaWarnings: report.summary.qaWarnings,
        },
        null,
        2,
      ),
    );
    return;
  }

  console.log("Knowledge graph");
  console.log(
    `  Nodes ${report.summary.nodes} · Edges ${report.summary.edges}`,
  );
  console.log(
    `  IMPROVE ${report.summary.improvePages} (orphans ${report.summary.improveOrphans})`,
  );
  console.log(
    `  QA errors ${report.summary.qaErrors} · warnings ${report.summary.qaWarnings}`,
  );
  console.log("  Journeys:", report.journeys.map((j) => j.id).join(", "));
  if (write) {
    console.log("Wrote:");
    console.log("  data/seo/knowledge-graph.json");
    console.log("  docs/seo/KNOWLEDGE-GRAPH.md");
  }
}

main();
