#!/usr/bin/env tsx
/**
 * Locale 410 topic review — equity preservation (English-only).
 *
 *   npm run migration:locale-410-review
 *   npm run migration:locale-410-review -- --no-write
 *   npm run migration:locale-410-review -- --apply
 *   npm run migration:locale-410-review -- --json
 */
import {
  applyLocale410Repairs,
  runLocale410TopicReview,
} from "@/services/legacy-url-migration/locale-410-review";

function main() {
  const args = process.argv.slice(2);
  const write = !args.includes("--no-write");
  const apply = args.includes("--apply");
  const json = args.includes("--json");

  const result = runLocale410TopicReview({ write });
  const s = result.summary;

  if (json) {
    console.log(
      JSON.stringify(
        {
          summary: s,
          repairs: result.repairs.map((r) => ({
            enPath: r.enPath,
            destination: r.proposedDestination,
            locales: r.localeCount,
            reason: r.absorbReason,
          })),
          gapReview: result.gapReview.map((r) => r.enPath),
        },
        null,
        2,
      ),
    );
  } else {
    console.log(`${s.agent} v${s.version}`);
    console.log(`  unmapped locale URLs: ${s.unmappedLocaleUrls}`);
    console.log(`  unique EN topics:     ${s.uniqueEnTopics}`);
    console.log(`  TRUE_OBSOLETE:        ${s.byClassification.TRUE_OBSOLETE}`);
    console.log(`  TAXONOMY_JUNK:        ${s.byClassification.TAXONOMY_JUNK}`);
    console.log(`  DUPLICATE_TOPIC:      ${s.byClassification.DUPLICATE_TOPIC}`);
    console.log(
      `  EN_EQUIV_MISSING:     ${s.byClassification.ENGLISH_EQUIVALENT_MISSING}`,
    );
    console.log(
      `  VALUABLE_CANDIDATE:   ${s.byClassification.VALUABLE_TOPIC_CANDIDATE}`,
    );
    console.log(`  repairs proposed:     ${s.repairsProposed}`);
    console.log(`  gap review:           ${s.gapReviewCount}`);
    if (write) {
      console.log(`  wrote ${result.paths.markdown}`);
      console.log(`  wrote ${result.paths.gapReviewMarkdown}`);
      console.log(`  wrote ${result.paths.json}`);
    }
  }

  if (apply) {
    const applied = applyLocale410Repairs(result.repairs);
    console.log(`Apply repairs`);
    console.log(`  locale 301s added: ${applied.localeRedirectsAdded}`);
    console.log(`  EN 301s added:     ${applied.enRedirectsAdded}`);
    console.log(`  skipped unsafe:    ${applied.skippedUnsafe}`);
    console.log(`  topics:            ${Object.keys(applied.destinations).length}`);
    for (const [en, dest] of Object.entries(applied.destinations)) {
      console.log(`    ${en} → ${dest}`);
    }
    console.log(`  updated ${applied.cutoverPath}`);
    console.log(`  updated ${applied.enRedirectsPath}`);
  }
}

main();
