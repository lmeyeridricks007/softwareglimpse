/**
 * Precompile the site search index for fast Vercel cold starts.
 *
 *   npm run search:build-index
 *   (also runs automatically via npm prebuild)
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  __resetSearchIndexCache,
  buildSearchIndexFromSources,
} from "@/services/search/build-index";

const OUT_DIR = join(process.cwd(), "src/data/generated");
const OUT_FILE = join(OUT_DIR, "search-index.json");
const INDEX_VERSION = 1;

function main() {
  const started = performance.now();
  __resetSearchIndexCache();
  const documents = buildSearchIndexFromSources();
  const elapsedMs = Math.round(performance.now() - started);

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(
    OUT_FILE,
    JSON.stringify(
      {
        version: INDEX_VERSION,
        builtAt: new Date().toISOString(),
        documentCount: documents.length,
        buildMs: elapsedMs,
        documents,
      },
      null,
      0,
    ),
  );

  console.log(
    `✓ search index (${documents.length} docs, ${elapsedMs}ms) → ${OUT_FILE}`,
  );
}

main();
