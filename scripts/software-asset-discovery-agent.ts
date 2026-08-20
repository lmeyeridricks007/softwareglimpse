#!/usr/bin/env npx tsx
/**
 * SoftwareAssetDiscoveryAgent CLI
 *
 *   npm run assets:agent:software
 *   npm run assets:agent:software -- --product hubspot --write
 *   npm run assets:agent:software -- --all --write
 *   npm run assets:agent:software -- --all --include-unpublished --write --json
 *
 * Audits software/product pages. Recommendations only — never edits product pages.
 */
import {
  SOFTWARE_ASSET_DISCOVERY_AGENT,
  runSoftwareAssetDiscoveryAgent,
} from "@/services/asset-discovery/software-agent";
import { SoftwareProductAssetAuditSchema } from "@/domain/schemas/asset-discovery";

type Args = {
  product?: string;
  all: boolean;
  write: boolean;
  includeUnpublished: boolean;
  json: boolean;
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
    if (t === "--product") args.product = rest.shift();
    else if (t === "--all") args.all = true;
    else if (t === "--write") args.write = true;
    else if (t === "--include-unpublished") args.includeUnpublished = true;
    else if (t === "--json") args.json = true;
    else if (!t.startsWith("-") && !args.product) args.product = t;
  }
  return args;
}

function main(): void {
  const args = parseArgs(process.argv.slice(2));

  if (!args.product && !args.all) {
    // Default: audit all public products and write docs
    args.all = true;
    args.write = args.write || true;
  }

  const result = runSoftwareAssetDiscoveryAgent({
    productSlug: args.product,
    includeUnpublished: args.includeUnpublished,
    writeDocs: args.write,
    generatedAt: "2026-08-15T06:00:00.000Z",
  });

  for (const audit of result.audits) {
    SoftwareProductAssetAuditSchema.parse(audit);
  }

  if (args.json) {
    console.log(
      JSON.stringify(
        {
          agent: result.agent,
          master: result.master,
          audits: result.audits.map((a) => ({
            productSlug: a.productSlug,
            coverageRating: a.coverageRating,
            summary: a.summary,
          })),
          writtenPaths: result.writtenPaths,
        },
        null,
        2,
      ),
    );
    return;
  }

  console.log(
    `${SOFTWARE_ASSET_DISCOVERY_AGENT.name} v${SOFTWARE_ASSET_DISCOVERY_AGENT.version}`,
  );
  console.log(
    `products=${result.master.productsAudited} addNow=${result.master.totals.addNow} strong=${result.master.totals.strongOpportunity} reuse=${result.master.totals.reuseExisting} stale=${result.master.totals.staleAssets} originals=${result.master.totals.originalVisualOpportunities} videos=${result.master.totals.officialVideosCatalogued}`,
  );
  for (const row of result.master.rows.slice(0, 15)) {
    console.log(
      `  ${row.productSlug}\t${row.coverageRating}\tvideos=${row.officialVideosFound}\tpriority=${row.priorityOpportunities}\t→ ${row.recommendedNextAction}`,
    );
  }
  if (result.master.rows.length > 15) {
    console.log(`  … +${result.master.rows.length - 15} more`);
  }
  for (const p of result.writtenPaths) {
    console.log(`Wrote ${p}`);
  }
}

main();
