#!/usr/bin/env npx tsx
/**
 * Audit guide completeness by prose word count (~5 min minimum).
 * Usage: npx tsx scripts/audit-guide-completeness.ts [--json]
 */
import { __resetGuideCaches, getAllGuidesUnfiltered } from "../src/data/repositories/guides";
import {
  GUIDE_MIN_PROSE_WORDS,
  GUIDE_MIN_READING_MINUTES,
  isGuideProseComplete,
  proseMinutesFromGuide,
  proseWordsFromBlocks,
} from "../src/services/guides/guide-prose";

__resetGuideCaches();

const jsonOut = process.argv.includes("--json");
const guides = getAllGuidesUnfiltered();

type Row = {
  slug: string;
  kind: "educational" | "product";
  category: string | null;
  topicType: string;
  proseMin: number;
  words: number;
  steps: number;
  complete: boolean;
};

const rows: Row[] = guides.map((g) => {
  const words = proseWordsFromBlocks(g.blocks, g.summary);
  return {
    slug: g.slug,
    kind: g.productSlugs.length > 0 ? "product" : "educational",
    category: g.categorySlugs[0] ?? null,
    topicType: g.topicType ?? "unknown",
    proseMin: proseMinutesFromGuide(g),
    words,
    steps: g.blocks.filter((b) => b.type === "step").length,
    complete: isGuideProseComplete(g),
  };
});

const incomplete = rows.filter((r) => !r.complete);
const complete = rows.filter((r) => r.complete);

if (jsonOut) {
  console.log(
    JSON.stringify(
      {
        thresholdMinutes: GUIDE_MIN_READING_MINUTES,
        thresholdWords: GUIDE_MIN_PROSE_WORDS,
        total: rows.length,
        complete: complete.length,
        incomplete: incomplete.length,
        incompleteSlugs: incomplete.map((r) => r.slug),
        byCategory: Object.fromEntries(
          [...new Set(incomplete.map((r) => r.category ?? "none"))].map((cat) => [
            cat,
            incomplete.filter((r) => (r.category ?? "none") === cat).length,
          ]),
        ),
      },
      null,
      2,
    ),
  );
  process.exit(incomplete.length > 0 ? 1 : 0);
}

console.log(`Guide completeness audit (${GUIDE_MIN_READING_MINUTES}+ min / ${GUIDE_MIN_PROSE_WORDS}+ words prose)`);
console.log(`Total: ${rows.length} | Complete: ${complete.length} | Incomplete: ${incomplete.length}`);

const eduIncomplete = incomplete.filter((r) => r.kind === "educational");
const prodIncomplete = incomplete.filter((r) => r.kind === "product");
console.log(`  Educational incomplete: ${eduIncomplete.length}`);
console.log(`  Product incomplete: ${prodIncomplete.length}`);

if (eduIncomplete.length > 0) {
  console.log("\n--- Educational guides still under threshold ---");
  for (const r of eduIncomplete.sort((a, b) => a.words - b.words).slice(0, 40)) {
    console.log(`  ${r.proseMin}min ${r.words}w  ${r.slug}`);
  }
  if (eduIncomplete.length > 40) {
    console.log(`  ... and ${eduIncomplete.length - 40} more`);
  }
}

if (prodIncomplete.length > 0) {
  console.log("\n--- Product guides still under threshold (sample) ---");
  for (const r of prodIncomplete.sort((a, b) => a.words - b.words).slice(0, 20)) {
    console.log(`  ${r.proseMin}min ${r.words}w  ${r.slug}`);
  }
  if (prodIncomplete.length > 20) {
    console.log(`  ... and ${prodIncomplete.length - 20} more`);
  }
}

process.exit(incomplete.length > 0 ? 1 : 0);
