#!/usr/bin/env npx tsx
/**
 * GuideAssetDiscoveryAgent CLI
 *
 *   npm run assets:agent:guides -- --all --write
 *   npm run assets:agent:guides -- --guide how-to-choose-crm --write
 *   npm run assets:agent:guides -- --all --include-unpublished --write --json
 *
 * Audits guides. Recommendations only — never edits guides.
 */
import {
  GUIDE_ASSET_DISCOVERY_AGENT,
  runGuideAssetDiscoveryAgent,
} from "@/services/asset-discovery/guide-agent";
import { GuideAssetAuditSchema } from "@/domain/schemas/asset-discovery";

type Args = {
  guide?: string;
  all: boolean;
  write: boolean;
  includeUnpublished: boolean;
  json: boolean;
  limit?: number;
};

function parseArgs(argv: string[]): Args {
  const args: Args = {
    all: false,
    write: false,
    includeUnpublished: false,
    json: false,
  };
  const rest = [...argv];
  while (rest.length) {
    const t = rest.shift()!;
    if (t === "--guide") args.guide = rest.shift();
    else if (t === "--all") args.all = true;
    else if (t === "--write") args.write = true;
    else if (t === "--include-unpublished") args.includeUnpublished = true;
    else if (t === "--json") args.json = true;
    else if (t === "--limit") args.limit = Number(rest.shift());
    else if (!t.startsWith("-") && !args.guide) args.guide = t;
  }
  return args;
}

function main(): void {
  const args = parseArgs(process.argv.slice(2));
  if (!args.guide && !args.all) {
    args.all = true;
    args.write = true;
  }

  const result = runGuideAssetDiscoveryAgent({
    guideSlug: args.guide,
    includeUnpublished: args.includeUnpublished,
    writeDocs: args.write,
    limit: args.limit,
    generatedAt: "2026-08-15T06:00:00.000Z",
  });

  for (const audit of result.audits) {
    GuideAssetAuditSchema.parse(audit);
  }

  if (args.json) {
    console.log(
      JSON.stringify(
        {
          agent: result.agent,
          master: {
            guidesAudited: result.master.guidesAudited,
            totals: result.master.totals,
            topRecommendations: result.master.topRecommendations.slice(0, 30),
          },
          writtenPaths: result.writtenPaths,
        },
        null,
        2,
      ),
    );
    return;
  }

  console.log(
    `${GUIDE_ASSET_DISCOVERY_AGENT.name} v${GUIDE_ASSET_DISCOVERY_AGENT.version}`,
  );
  console.log(
    `guides=${result.master.guidesAudited} addNow=${result.master.totals.addNow} strong=${result.master.totals.strongOpportunity} videos=${result.master.totals.videoOpportunities} diagrams=${result.master.totals.diagramOpportunities} originals=${result.master.totals.originalVisualOpportunities} authoritative=${result.master.totals.authoritativeSourceOpportunities}`,
  );
  for (const row of result.master.rows.slice(0, 12)) {
    console.log(
      `  ${row.guideSlug}\t${row.visualQuality}\tcq=${row.contentQualityVisualScore ?? "-"}\tpriority=${row.priority}\t→ ${row.recommendedNextAction}`,
    );
  }
  if (result.master.rows.length > 12) {
    console.log(`  … +${result.master.rows.length - 12} more`);
  }
  console.log("Top recommendations:");
  result.master.topRecommendations.slice(0, 10).forEach((r, i) => {
    console.log(`  ${i + 1}. ${r.title}`);
  });
  for (const p of result.writtenPaths.slice(0, 5)) {
    console.log(`Wrote ${p}`);
  }
  if (result.writtenPaths.length > 5) {
    console.log(`Wrote ${result.writtenPaths.length} files total`);
  }
}

main();
