#!/usr/bin/env tsx
/**
 * Scan teaching-visual PNG size bar; vendor-ui is excluded (expected captures).
 *
 * Usage:
 *   npm run audit:teaching-visuals
 *   npm run audit:teaching-visuals -- --json
 */
import { scanTeachingVisualLibrary } from "../src/services/teaching-visuals/library-scan";

const json = process.argv.includes("--json");
const { all, teaching } = scanTeachingVisualLibrary();
const failures = teaching.flatMap((row) => row.failingFiles);

if (json) {
  console.log(JSON.stringify({ directories: all, failingCount: failures.length }, null, 2));
} else {
  console.log("Teaching visual library (PNG size bar)\n");
  console.log(
    "Directory".padEnd(28) +
      "PNGs".padStart(6) +
      "Median".padStart(10) +
      "<80KB".padStart(8) +
      "<900KB".padStart(8) +
      "  Notes",
  );
  for (const row of all) {
    console.log(
      row.directory.padEnd(28) +
        String(row.pngCount).padStart(6) +
        `${Math.round(row.medianBytes / 1024)} KB`.padStart(10) +
        String(row.under80Kb).padStart(8) +
        String(row.under900Kb).padStart(8) +
        `  ${row.notes}`,
    );
  }
  console.log(`\nTeaching-bar failures: ${failures.length}`);
  if (failures.length) {
    failures.slice(0, 20).forEach((f) => console.log(`  - ${f}`));
  }
}

process.exit(failures.length ? 1 : 0);
