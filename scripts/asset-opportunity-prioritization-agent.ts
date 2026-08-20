#!/usr/bin/env npx tsx
/**
 * AssetOpportunityPrioritizationAgent CLI
 *
 *   npm run assets:agent:prioritize
 *   npm run assets:agent:prioritize -- --write
 *   npm run assets:agent:prioritize -- --write --json
 *   npm run assets:agent:prioritize -- --software-limit 5 --guide-limit 10 --write
 *
 * Prioritizes asset opportunities. Does **not** implement assets.
 */
import {
  ASSET_OPPORTUNITY_PRIORITIZATION_AGENT,
  runAssetOpportunityPrioritizationAgent,
} from "@/services/asset-discovery/prioritization-agent";
import { AssetEnrichmentBacklogReportSchema } from "@/domain/schemas/asset-discovery";

type Args = {
  write: boolean;
  json: boolean;
  softwareLimit?: number;
  guideLimit?: number;
  includeUnpublished: boolean;
};

function parseArgs(argv: string[]): Args {
  const args: Args = {
    write: false,
    json: false,
    includeUnpublished: false,
  };
  const rest = [...argv];
  while (rest.length) {
    const t = rest.shift()!;
    if (t === "--write") args.write = true;
    else if (t === "--json") args.json = true;
    else if (t === "--include-unpublished") args.includeUnpublished = true;
    else if (t === "--software-limit") {
      args.softwareLimit = Number(rest.shift());
    } else if (t === "--guide-limit") {
      args.guideLimit = Number(rest.shift());
    }
  }
  return args;
}

function main(): void {
  const args = parseArgs(process.argv.slice(2));

  // Default: write backlog (agent's primary deliverable)
  if (!args.write && !args.json) {
    args.write = true;
  }

  const result = runAssetOpportunityPrioritizationAgent({
    writeDocs: args.write,
    includeUnpublished: args.includeUnpublished,
    softwareLimit: args.softwareLimit,
    guideLimit: args.guideLimit,
    generatedAt: "2026-08-15T06:00:00.000Z",
  });

  AssetEnrichmentBacklogReportSchema.parse(result.report);

  if (args.json) {
    console.log(
      JSON.stringify(
        {
          agent: result.agent,
          summary: result.report.summary,
          systemic: result.report.systemicOpportunities.map((s) => ({
            id: s.id,
            priority: s.priority,
            count: s.count,
            title: s.title,
          })),
          topActions: result.report.topActions.map((a) => ({
            priority: a.priority,
            page: a.page,
            asset: a.asset,
            recommendation: a.recommendation,
            batch: a.implementationBatch,
            impactScore: a.impactScore,
          })),
          writtenPath: result.writtenPath,
        },
        null,
        2,
      ),
    );
    return;
  }

  const s = result.report.summary;
  console.log(
    `${ASSET_OPPORTUNITY_PRIORITIZATION_AGENT.name} ${ASSET_OPPORTUNITY_PRIORITIZATION_AGENT.version}`,
  );
  console.log(
    `A0 ${s.a0} · A1 ${s.a1} · A2 ${s.a2} · A3 ${s.a3} · template ${s.templateOpportunities} · page-specific ${s.pageSpecificOpportunities} · originals ${s.originalVisualOpportunities}`,
  );
  console.log(`Systemic patterns: ${result.report.systemicOpportunities.length}`);
  console.log("Top 10:");
  for (const a of result.report.topActions.slice(0, 10)) {
    console.log(
      `  [${a.priority}] ${a.page} — ${a.asset} (${a.implementationBatch})`,
    );
  }
  if (result.writtenPath) {
    console.log(`Wrote ${result.writtenPath}`);
  }
}

main();
