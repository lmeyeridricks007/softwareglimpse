#!/usr/bin/env npx tsx
/**
 * Content distribution workflow — drafts only.
 *
 * Usage:
 *   npm run distribution:pack
 *   npm run distribution:pack -- --no-write --json
 *   npm run distribution:pack -- --no-tracking
 *
 * Never auto-posts.
 */
import { runDistributionWorkflow } from "@/services/distribution";

function flag(name: string): boolean {
  return process.argv.includes(name);
}

function main() {
  const result = runDistributionWorkflow({
    write: !flag("--no-write"),
    recordTracking: !flag("--no-tracking"),
  });

  if (flag("--json")) {
    console.log(
      JSON.stringify(
        {
          generatedAt: result.generatedAt,
          campaignCount: result.campaigns.length,
          newsletterIncludedSections: result.newsletterIncludedSections,
          wrotePaths: result.wrotePaths,
        },
        null,
        2,
      ),
    );
    return;
  }

  console.log("distribution-workflow");
  console.log(`  campaigns: ${result.campaigns.length}`);
  for (const c of result.campaigns) {
    console.log(`  - ${c.campaignType}: ${c.title}`);
  }
  console.log(
    `  newsletter sections: ${result.newsletterIncludedSections.join(", ") || "(none)"}`,
  );
  for (const p of result.wrotePaths) {
    console.log(`  wrote: ${p}`);
  }
  console.log("\nDrafts only — human approval required. No auto-post.");
}

main();
