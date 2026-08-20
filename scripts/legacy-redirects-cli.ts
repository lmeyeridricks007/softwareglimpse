#!/usr/bin/env tsx
/**
 * RedirectPlanGenerator CLI
 *
 *   npm run migration:redirects
 *   npm run migration:redirects -- --no-write
 *   npm run migration:redirects -- --json
 */
import { runRedirectPlanGenerator } from "@/services/legacy-url-migration/redirect-plan";

function main() {
  const args = process.argv.slice(2);
  const write = !args.includes("--no-write");
  const json = args.includes("--json");

  const result = runRedirectPlanGenerator({ write });

  if (json) {
    console.log(
      JSON.stringify(
        {
          redirects: result.redirects,
          manualExcluded: result.manualExcluded,
          chainsFlattened: result.chainsFlattened,
          validationErrors: result.validationErrors,
          paths: result.paths,
        },
        null,
        2,
      ),
    );
    return;
  }

  console.log(`${result.agent.name} v${result.agent.version}`);
  console.log(`  redirects generated:  ${result.redirects}`);
  console.log(`  manual excluded:      ${result.manualExcluded}`);
  console.log(`  chains flattened:     ${result.chainsFlattened}`);
  console.log(`  validation errors:    ${result.validationErrors.length}`);
  if (result.validationErrors.length) {
    for (const e of result.validationErrors.slice(0, 10)) {
      console.log(`    - ${e}`);
    }
  }
  if (write) {
    console.log(`  wrote ${result.paths.config}`);
    console.log(`  wrote ${result.paths.markdown}`);
  }
}

main();
