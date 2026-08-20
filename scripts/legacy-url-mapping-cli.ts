#!/usr/bin/env tsx
/**
 * LegacyUrlMappingAgent CLI
 *
 *   npm run migration:map-urls
 *   npm run migration:map-urls -- --no-write
 *   npm run migration:map-urls -- --json
 *
 * Does NOT implement redirects.
 */
import { runLegacyUrlMappingAgent } from "@/services/legacy-url-migration/mapping-agent";

function main() {
  const args = process.argv.slice(2);
  const write = !args.includes("--no-write");
  const json = args.includes("--json");

  const result = runLegacyUrlMappingAgent({ write });
  const s = result.summary;

  if (json) {
    console.log(JSON.stringify(s, null, 2));
    return;
  }

  console.log(`${s.agent} v${s.version}`);
  console.log(`  total legacy:        ${s.totalLegacy}`);
  console.log(`  meaningful:          ${s.meaningfulLegacy}`);
  console.log(`  mapped:              ${s.mapped}`);
  console.log(`  unmapped:            ${s.unmapped}`);
  console.log(`  KEEP:                ${s.keep}`);
  console.log(`  301_REDIRECT:        ${s.redirect301}`);
  console.log(`  MERGE_AND_301:       ${s.mergeAnd301}`);
  console.log(`  404:                 ${s.status404}`);
  console.log(`  410:                 ${s.status410}`);
  console.log(`  REVIEW:              ${s.review}`);
  console.log(`  high-risk:           ${s.highRisk}`);
  console.log(`  low-confidence map:  ${s.lowConfidenceMapped}`);
  if (write) {
    console.log(`  wrote ${result.paths.markdown}`);
  }
}

main();
