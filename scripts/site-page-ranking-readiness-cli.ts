#!/usr/bin/env tsx
/**
 * PageRankingReadinessAgent CLI
 *
 *   npm run site:page-readiness -- /best/crm-software/
 *   npm run site:page-readiness -- /resources/crm-evaluation-checklist/
 *   npm run site:page-readiness -- software:pipedrive
 *   npm run site:page-readiness -- /guides/how-to-choose-crm/ --json
 *   npm run site:page-readiness -- /best/crm-software/ --no-write
 *
 * Relative readiness only — NOT a ranking promise.
 * Does NOT mutate production content.
 */
import { runPageRankingReadinessAgent } from "@/services/site-intelligence/page-readiness";

function main(): void {
  const args = process.argv.slice(2);
  const json = args.includes("--json");
  const noWrite = args.includes("--no-write");
  const input = args.find((a) => !a.startsWith("--"));

  if (!input) {
    console.error(
      "Usage: npm run site:page-readiness -- <route-or-content-id>",
    );
    console.error("Example: npm run site:page-readiness -- /best/crm-software/");
    process.exit(1);
  }

  const result = runPageRankingReadinessAgent({
    input,
    write: !noWrite,
  });

  if (json) {
    console.log(
      JSON.stringify(
        {
          agent: result.agent,
          generatedAt: result.generatedAt,
          route: result.report.route,
          slug: result.report.slug,
          rankingReadiness: result.report.rankingReadiness,
          feasibility: result.report.feasibility,
          confidence: result.report.confidence,
          strong: result.report.strong,
          weak: result.report.weak,
          paths: result.paths,
        },
        null,
        2,
      ),
    );
    return;
  }

  const r = result.report;
  console.log(
    `PAGE RANKING READINESS — ${result.agent.name} v${result.agent.version}`,
  );
  console.log(`Route:         ${r.route}`);
  console.log(`Readiness:     ${r.rankingReadiness} / 100`);
  console.log(`Feasibility:   ${r.feasibility}`);
  console.log(`Confidence:    ${r.confidence.toUpperCase()}`);
  console.log(`Queries:       ${r.targetQueries.slice(0, 3).join("; ") || "—"}`);
  console.log(`Strong:        ${r.strong.length}`);
  console.log(`Weak:          ${r.weak.length}`);
  console.log(`Competitors:   ${r.competitors.length}`);
  if (result.paths.report) console.log(`Report:        ${result.paths.report}`);
  console.log("\nRelative readiness only — not a ranking probability.");
  console.log("No production content was modified.");
}

main();
