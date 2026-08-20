#!/usr/bin/env npx tsx
import {
  approveFacts,
  runResearchPipeline,
} from "../src/services/research/pipeline";
import { parseDomainList } from "../src/services/research/utils";
import type { ResearchDomain } from "../src/domain";

function usage(): never {
  console.error(`Usage:
  npm run research:product -- <slug> [--domain pricing] [--all] [--dry-run] [--approve] [--merge] [--allow-fixture-merge]

Examples:
  npm run research:product -- pipedrive --all --approve --merge --allow-fixture-merge
  npm run research:product -- apollo --domain pricing --domain features --dry-run
`);
  process.exit(1);
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0 || args.includes("--help")) usage();

  const slug = args.find((arg) => !arg.startsWith("--"));
  if (!slug) usage();

  const domains: ResearchDomain[] = [];
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === "--domain" && args[i + 1]) {
      domains.push(args[i + 1] as ResearchDomain);
    }
  }

  const all = args.includes("--all");
  const dryRun = args.includes("--dry-run");
  const autoApprove = args.includes("--approve");
  const merge = args.includes("--merge");
  const allowFixtureMerge = args.includes("--allow-fixture-merge");

  const result = await runResearchPipeline(slug, {
    domains: all || domains.length === 0 ? undefined : domains,
    dryRun,
    autoApprove,
    merge,
    allowFixtureMerge,
    allowFixtures: true,
  });

  if (autoApprove && !dryRun) {
    approveFacts(slug);
  }

  console.log(`Product: ${slug}`);
  console.log(`Job: ${result.job.id} (${result.job.status})`);
  console.log(`Facts: ${result.factCount}`);
  console.log(`Conflicts: ${result.conflictCount}`);
  console.log(`Merged enrichment: ${result.merged ? "yes" : "no"}`);
  if (result.job.errors.length) {
    console.error(result.job.errors.join("\n"));
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});

void parseDomainList;
