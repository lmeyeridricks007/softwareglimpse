#!/usr/bin/env tsx
/**
 * CRM keyword targets inventory (full catalogue)
 *
 *   npm run site:crm-keywords
 *   npm run site:crm-keywords -- --no-write --json
 *
 * Does not mutate production content.
 */
import { writeCrmKeywordTargets } from "@/services/site-intelligence/crm-keywords";

function main(): void {
  const args = process.argv.slice(2);
  const json = args.includes("--json");
  const noWrite = args.includes("--no-write");
  const noArchive = args.includes("--no-archive");

  const result = writeCrmKeywordTargets({
    write: !noWrite,
    archive: !noWrite && !noArchive,
  });

  if (json) {
    console.log(
      JSON.stringify(
        {
          generatedAt: result.generatedAt,
          seedCount: result.seedCount,
          paths: result.paths,
        },
        null,
        2,
      ),
    );
    return;
  }

  console.log("CRM KEYWORD TARGETS — full catalogue");
  console.log(`Keywords:      ${result.seedCount}`);
  if (result.paths.latest) console.log(`Latest:        ${result.paths.latest}`);
  if (result.paths.json) console.log(`JSON:          ${result.paths.json}`);
  if (result.paths.archive) console.log(`Archive:       ${result.paths.archive}`);
  console.log("\nNot a ranking claim — keyword → page inventory only.");
  console.log("No production content was modified.");
}

main();
